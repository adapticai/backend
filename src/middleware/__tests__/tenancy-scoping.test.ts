import { describe, it, expect, vi } from 'vitest';
import type { GraphQLResolveInfo } from 'graphql';
import type { ResolverData } from 'type-graphql';
import type { BackendPrincipal } from '../../auth/token-verifier';
import {
  createTenancyScopingMiddleware,
  type TenancyScopingContext,
} from '../tenancy-scoping';
import {
  buildScopeWhere,
  injectScopeWhere,
  type Entitlement,
  type TenancyScopingMode,
} from '../../auth/tenancy-scope';

/**
 * SP2-G7 middleware tests. The middleware is the transport wiring around the
 * pure decision logic; these tests pin the three-mode contract and, most
 * importantly, the CRITICAL SAFETY invariant that service/server (and admin /
 * unauthenticated) principals are NEVER scoped in ANY mode — the engine's live
 * trading depends on unscoped `adaptic.*` access.
 */

const ORG_A = '11111111-1111-1111-1111-111111111111';
const ORG_B = '22222222-2222-2222-2222-222222222222';
const FUND_A1 = 'aaaaaaaa-0000-0000-0000-000000000001';
const USER = '99999999-9999-9999-9999-999999999999';

const USER_PRINCIPAL: BackendPrincipal = {
  kind: 'user',
  sub: USER,
  roles: ['user'],
};
const SERVER_PRINCIPAL: BackendPrincipal = { kind: 'server' };
const ADMIN_PRINCIPAL: BackendPrincipal = {
  kind: 'admin',
  sub: 'admin-1',
  roles: ['admin'],
};

const ENTITLEMENT: Entitlement = {
  userId: USER,
  orgIds: [ORG_A],
  fundIds: [FUND_A1],
};

function makeInfo(
  parentTypeName: string,
  fieldName: string
): GraphQLResolveInfo {
  return {
    parentType: { name: parentTypeName },
    fieldName,
  } as unknown as GraphQLResolveInfo;
}

/**
 * A Prisma stub whose entitlement queries throw — used to prove that bypassed
 * principals never trigger entitlement resolution.
 */
function explodingPrisma(): unknown {
  const boom = () => {
    throw new Error(
      'entitlement resolution must not run for bypassed principal'
    );
  };
  return {
    orgMembership: { findMany: boom },
    fund: { findMany: boom },
    fundAssignment: { findMany: boom },
  };
}

interface RunOptions {
  mode: TenancyScopingMode;
  principal?: BackendPrincipal | null;
  parentTypeName?: string;
  fieldName: string;
  args?: Record<string, unknown>;
  /** Pre-seed the memoised entitlement (skips Prisma resolution). */
  entitlement?: Entitlement;
  prisma?: unknown;
}

async function run(opts: RunOptions): Promise<{
  args: Record<string, unknown>;
  nextCalls: number;
  error?: unknown;
}> {
  const middleware = createTenancyScopingMiddleware({
    modeProvider: () => opts.mode,
  });
  const context: TenancyScopingContext = {
    principal: opts.principal === undefined ? USER_PRINCIPAL : opts.principal,
    prisma: opts.prisma ?? explodingPrisma(),
  };
  if (opts.entitlement) {
    context.__tenancyEntitlement = Promise.resolve(opts.entitlement);
  }
  const args = opts.args ?? {};
  const action: ResolverData<TenancyScopingContext> = {
    root: {},
    args,
    context,
    info: makeInfo(opts.parentTypeName ?? 'Query', opts.fieldName),
  };
  const next = vi.fn().mockResolvedValue('ok');
  let error: unknown;
  try {
    await middleware(action, next);
  } catch (e) {
    error = e;
  }
  return { args, nextCalls: next.mock.calls.length, error };
}

describe('tenancy-scoping middleware — off mode', () => {
  it('is a no-op: executes unchanged even for a user-scoped governed read', async () => {
    const args = { where: { organizationId: ORG_B } };
    const result = await run({ mode: 'off', fieldName: 'funds', args });
    expect(result.nextCalls).toBe(1);
    expect(result.error).toBeUndefined();
    expect(args.where).toEqual({ organizationId: ORG_B });
  });
});

describe('tenancy-scoping middleware — shadow mode', () => {
  it('executes UNCHANGED for a foreign-tenant read (logs but does not modify args)', async () => {
    const args = { where: { organizationId: ORG_B } };
    const result = await run({
      mode: 'shadow',
      fieldName: 'funds',
      args,
      entitlement: ENTITLEMENT,
    });
    expect(result.nextCalls).toBe(1);
    expect(result.error).toBeUndefined();
    // shadow must NOT mutate the query.
    expect(args.where).toEqual({ organizationId: ORG_B });
  });

  it('executes unchanged for an already-in-scope read', async () => {
    const args = { where: { organizationId: ORG_A } };
    const result = await run({
      mode: 'shadow',
      fieldName: 'funds',
      args,
      entitlement: ENTITLEMENT,
    });
    expect(result.nextCalls).toBe(1);
    expect(args.where).toEqual({ organizationId: ORG_A });
  });

  it('never denies a cross-tenant create in shadow (executes unchanged)', async () => {
    const args = { data: { organization: { connect: { id: ORG_B } } } };
    const result = await run({
      mode: 'shadow',
      fieldName: 'createOneFund',
      args,
      entitlement: ENTITLEMENT,
    });
    expect(result.nextCalls).toBe(1);
    expect(result.error).toBeUndefined();
    expect(args.data).toEqual({ organization: { connect: { id: ORG_B } } });
  });
});

describe('tenancy-scoping middleware — enforce mode (reads)', () => {
  it('injects the scope predicate into an unbounded list read', async () => {
    const args: Record<string, unknown> = {};
    const result = await run({
      mode: 'enforce',
      fieldName: 'funds',
      args,
      entitlement: ENTITLEMENT,
    });
    expect(result.nextCalls).toBe(1);
    expect(args.where).toEqual(
      injectScopeWhere(undefined, buildScopeWhere('Fund', ENTITLEMENT))
    );
  });

  it('preserves the caller where and AND-appends the scope', async () => {
    const args: Record<string, unknown> = {
      where: { status: 'ACTIVE', organizationId: ORG_A },
    };
    await run({
      mode: 'enforce',
      fieldName: 'funds',
      args,
      entitlement: ENTITLEMENT,
    });
    expect(args.where).toEqual({
      status: 'ACTIVE',
      organizationId: ORG_A,
      AND: [buildScopeWhere('Fund', ENTITLEMENT)],
    });
  });

  it('scopes an update-by-id where (preserves the unique selector)', async () => {
    const args: Record<string, unknown> = { where: { id: 'brok-1' }, data: {} };
    await run({
      mode: 'enforce',
      fieldName: 'updateOneBrokerageAccount',
      args,
      entitlement: ENTITLEMENT,
    });
    expect(args.where).toEqual({
      id: 'brok-1',
      AND: [buildScopeWhere('BrokerageAccount', ENTITLEMENT)],
    });
  });
});

describe('tenancy-scoping middleware — enforce mode (mutations)', () => {
  it('denies a cross-tenant create with FORBIDDEN and does not call the resolver', async () => {
    const args = { data: { organization: { connect: { id: ORG_B } } } };
    const result = await run({
      mode: 'enforce',
      fieldName: 'createOneFund',
      args,
      entitlement: ENTITLEMENT,
    });
    expect(result.nextCalls).toBe(0);
    expect(
      (result.error as { extensions?: { code?: string } })?.extensions?.code
    ).toBe('FORBIDDEN');
  });

  it('allows an in-scope create', async () => {
    const args = { data: { organization: { connect: { id: ORG_A } } } };
    const result = await run({
      mode: 'enforce',
      fieldName: 'createOneFund',
      args,
      entitlement: ENTITLEMENT,
    });
    expect(result.nextCalls).toBe(1);
    expect(result.error).toBeUndefined();
  });

  it('fails closed with FORBIDDEN when entitlement cannot be resolved', async () => {
    // No prisma on context and no pre-seeded entitlement → resolution rejects.
    const result = await run({
      mode: 'enforce',
      fieldName: 'funds',
      args: { where: {} },
      prisma: undefined,
    });
    expect(result.nextCalls).toBe(0);
    expect(
      (result.error as { extensions?: { code?: string } })?.extensions?.code
    ).toBe('FORBIDDEN');
  });
});

describe('tenancy-scoping middleware — principal bypass (CRITICAL SAFETY)', () => {
  const governedRead = { where: { organizationId: ORG_B } };

  it.each<[string, TenancyScopingMode]>([
    ['shadow', 'shadow'],
    ['enforce', 'enforce'],
  ])(
    'NEVER scopes a SERVER principal in %s mode (regression: engine service path)',
    async (_label, mode) => {
      const args = { where: { organizationId: ORG_B } };
      const result = await run({
        mode,
        principal: SERVER_PRINCIPAL,
        fieldName: 'funds',
        args,
        // exploding prisma proves entitlement resolution never runs
      });
      expect(result.nextCalls).toBe(1);
      expect(result.error).toBeUndefined();
      // args are byte-for-byte unchanged: no injection, no denial.
      expect(args).toEqual({ where: { organizationId: ORG_B } });
    }
  );

  it('never scopes an ADMIN principal in enforce mode', async () => {
    const args = { data: { organization: { connect: { id: ORG_B } } } };
    const result = await run({
      mode: 'enforce',
      principal: ADMIN_PRINCIPAL,
      fieldName: 'createOneFund',
      args,
    });
    expect(result.nextCalls).toBe(1);
    expect(result.error).toBeUndefined();
    expect(args.data).toEqual({ organization: { connect: { id: ORG_B } } });
  });

  it('never scopes an unauthenticated (null principal) caller in enforce mode', async () => {
    const args = { ...governedRead };
    const result = await run({
      mode: 'enforce',
      principal: null,
      fieldName: 'funds',
      args,
    });
    expect(result.nextCalls).toBe(1);
    expect(result.error).toBeUndefined();
    expect(args).toEqual(governedRead);
  });
});

describe('tenancy-scoping middleware — field/parent gating', () => {
  it('bypasses non-governed root fields without resolving entitlement', async () => {
    const args = { where: { symbol: 'AAPL' } };
    const result = await run({
      mode: 'enforce',
      fieldName: 'trades',
      args,
      // exploding prisma → if entitlement ran, this would throw
    });
    expect(result.nextCalls).toBe(1);
    expect(result.error).toBeUndefined();
    expect(args.where).toEqual({ symbol: 'AAPL' });
  });

  it('bypasses a governed model reached via a non-root (relation) parent type', async () => {
    const args = { where: { organizationId: ORG_B } };
    const result = await run({
      mode: 'enforce',
      parentTypeName: 'Organization',
      fieldName: 'funds',
      args,
    });
    expect(result.nextCalls).toBe(1);
    expect(result.error).toBeUndefined();
    expect(args.where).toEqual({ organizationId: ORG_B });
  });
});

describe('tenancy-scoping middleware — authored strategies (G-STR-06)', () => {
  const STRATEGY_SCOPE = {
    OR: [{ kind: { equals: null } }, { fundId: { in: [FUND_A1] } }],
  };

  it.each(['off', 'shadow', 'enforce'] as const)(
    'scopes a user read of strategies to SYSTEM rows and the caller funds in %s mode',
    async (mode) => {
      for (const fieldName of [
        'strategies',
        'strategy',
        'findFirstStrategy',
        'aggregateStrategy',
      ]) {
        const args: Record<string, unknown> = {
          where: { id: { equals: 'draft-1' } },
        };
        const result = await run({
          mode,
          fieldName,
          args,
          entitlement: ENTITLEMENT,
        });
        expect(result.error).toBeUndefined();
        expect(result.nextCalls).toBe(1);
        expect(args.where).toEqual({
          id: { equals: 'draft-1' },
          AND: [STRATEGY_SCOPE],
        });
      }
    }
  );

  it('holds an unauthenticated read to the SYSTEM strategies', async () => {
    const args: Record<string, unknown> = {};
    const result = await run({
      mode: 'off',
      principal: null,
      fieldName: 'strategies',
      args,
    });
    expect(result.error).toBeUndefined();
    expect(result.nextCalls).toBe(1);
    expect(args.where).toEqual({ AND: [{ kind: { equals: null } }] });
  });

  it('never scopes the service principal', async () => {
    const args: Record<string, unknown> = { where: { key: { equals: 'k' } } };
    const result = await run({
      mode: 'enforce',
      principal: SERVER_PRINCIPAL,
      fieldName: 'strategies',
      args,
    });
    expect(result.nextCalls).toBe(1);
    expect(args.where).toEqual({ key: { equals: 'k' } });
  });

  it('classifies no Strategy write: those stay with the mutation guard (service_only for a user)', async () => {
    const args: Record<string, unknown> = { where: { id: 'x' }, data: {} };
    const result = await run({
      mode: 'enforce',
      parentTypeName: 'Mutation',
      fieldName: 'updateManyStrategy',
      args,
    });
    expect(result.nextCalls).toBe(1);
    expect(args.where).toEqual({ id: 'x' });
  });
});

describe('tenancy-scoping middleware — access models (AG-29, GAP-MO-ORG-02)', () => {
  const ACCESS_READS: ReadonlyArray<readonly [string, string, Record<string, unknown>]> = [
    ['RoleAssignment', 'roleAssignments', { organizationId: { in: [ORG_A] } }],
    ['RoleAssignment', 'getRoleAssignment', { organizationId: { in: [ORG_A] } }],
    ['AuditorGrant', 'auditorGrants', { officeOrganizationId: { in: [ORG_A] } }],
    ['AuditorGrant', 'groupByAuditorGrant', { officeOrganizationId: { in: [ORG_A] } }],
    ['EntityGroup', 'entityGroups', { officeId: { in: [ORG_A] } }],
    ['EntityGroup', 'findFirstEntityGroupOrThrow', { officeId: { in: [ORG_A] } }],
  ];

  it.each(['off', 'shadow', 'enforce'] as const)(
    "scopes a member's read of every access model to their own organizations in %s mode",
    async (mode) => {
      for (const [, fieldName, scope] of ACCESS_READS) {
        const args: Record<string, unknown> = { where: { id: { equals: 'row-1' } } };
        const result = await run({ mode, fieldName, args, entitlement: ENTITLEMENT });
        expect(result.error, fieldName).toBeUndefined();
        expect(result.nextCalls, fieldName).toBe(1);
        expect(args.where, fieldName).toEqual({ id: { equals: 'row-1' }, AND: [scope] });
      }
    }
  );

  it('scopes a member of no organization to nothing (empty id set)', async () => {
    const args: Record<string, unknown> = {};
    const result = await run({
      mode: 'off',
      fieldName: 'auditorGrants',
      args,
      entitlement: { userId: USER, orgIds: [], fundIds: [] },
    });
    expect(result.nextCalls).toBe(1);
    expect(args.where).toEqual({ AND: [{ officeOrganizationId: { in: [] } }] });
  });

  it.each(['roleAssignments', 'auditorGrants', 'entityGroups'])(
    'refuses an unauthenticated read of %s even with scoping off',
    async (fieldName) => {
      const result = await run({ mode: 'off', principal: null, fieldName });
      expect(result.nextCalls).toBe(0);
      expect((result.error as { extensions?: { code?: string } }).extensions?.code).toBe('UNAUTHENTICATED');
    }
  );

  it('never scopes the service principal', async () => {
    const args: Record<string, unknown> = { where: { userId: { equals: USER } } };
    const result = await run({ mode: 'enforce', principal: SERVER_PRINCIPAL, fieldName: 'roleAssignments', args });
    expect(result.nextCalls).toBe(1);
    expect(args.where).toEqual({ userId: { equals: USER } });
  });

  it('classifies no access-model write: those stay with the mutation guard (service_only for a user)', async () => {
    for (const fieldName of ['createOneRoleAssignment', 'updateOneAuditorGrant', 'upsertOneEntityGroup']) {
      const args: Record<string, unknown> = { where: { id: 'x' }, data: {} };
      const result = await run({ mode: 'enforce', parentTypeName: 'Mutation', fieldName, args });
      expect(result.nextCalls, fieldName).toBe(1);
      expect(args.where, fieldName).toEqual({ id: 'x' });
    }
  });
});

import { describe, it, expect, vi } from 'vitest';
import {
  buildScopeWhere,
  classifyGovernedField,
  dataInScope,
  evaluateAccess,
  getTenancyScopingMode,
  injectScopeWhere,
  resolveEntitlement,
  type Entitlement,
  type EntitlementPrismaClient,
} from '../tenancy-scope';

/**
 * SP2-G7 unit tests for the pure row-level tenancy-scoping domain logic.
 * These functions carry the entitlement + scoping decisions the TypeGraphQL
 * middleware wires into the request lifecycle; they must be provably correct in
 * isolation so the shadow→enforce rollout can trust them.
 */

const ORG_A = '11111111-1111-1111-1111-111111111111';
const ORG_B = '22222222-2222-2222-2222-222222222222';
const FUND_A1 = 'aaaaaaaa-0000-0000-0000-000000000001';
const FUND_A2 = 'aaaaaaaa-0000-0000-0000-000000000002';
const FUND_B1 = 'bbbbbbbb-0000-0000-0000-000000000001';
const USER = '99999999-9999-9999-9999-999999999999';

function entitlement(overrides: Partial<Entitlement> = {}): Entitlement {
  return {
    userId: USER,
    orgIds: [ORG_A],
    fundIds: [FUND_A1, FUND_A2],
    ...overrides,
  };
}

describe('getTenancyScopingMode', () => {
  it('defaults to shadow when unset or unrecognised', () => {
    expect(getTenancyScopingMode({})).toBe('shadow');
    expect(getTenancyScopingMode({ TENANCY_SCOPING_MODE: 'bogus' })).toBe(
      'shadow'
    );
  });

  it('parses off / shadow / enforce case-insensitively', () => {
    expect(getTenancyScopingMode({ TENANCY_SCOPING_MODE: 'OFF' })).toBe('off');
    expect(getTenancyScopingMode({ TENANCY_SCOPING_MODE: ' Shadow ' })).toBe(
      'shadow'
    );
    expect(getTenancyScopingMode({ TENANCY_SCOPING_MODE: 'enforce' })).toBe(
      'enforce'
    );
  });
});

describe('resolveEntitlement', () => {
  it('resolves only the caller orgs and the funds owned by them (+ assignments)', async () => {
    const prisma: EntitlementPrismaClient = {
      orgMembership: {
        findMany: vi
          .fn()
          .mockResolvedValue([{ organizationId: ORG_A }]),
      },
      fund: {
        findMany: vi
          .fn()
          .mockResolvedValue([{ id: FUND_A1 }, { id: FUND_A2 }]),
      },
      fundAssignment: {
        findMany: vi.fn().mockResolvedValue([{ fundId: FUND_A2 }]),
      },
    };

    const ent = await resolveEntitlement(prisma, USER);

    expect(ent.userId).toBe(USER);
    expect(ent.orgIds).toEqual([ORG_A]);
    // Union of org-owned funds and assigned funds, de-duplicated.
    expect([...ent.fundIds].sort()).toEqual([FUND_A1, FUND_A2].sort());
    expect(prisma.orgMembership.findMany).toHaveBeenCalledWith({
      where: { userId: USER },
      select: { organizationId: true },
    });
    expect(prisma.fund.findMany).toHaveBeenCalledWith({
      where: { organizationId: { in: [ORG_A] } },
      select: { id: true },
    });
  });

  it('short-circuits the fund query and returns empty sets for a member of no orgs', async () => {
    const fundFindMany = vi.fn();
    const prisma: EntitlementPrismaClient = {
      orgMembership: { findMany: vi.fn().mockResolvedValue([]) },
      fund: { findMany: fundFindMany },
      fundAssignment: { findMany: vi.fn().mockResolvedValue([]) },
    };

    const ent = await resolveEntitlement(prisma, USER);

    expect(ent.orgIds).toEqual([]);
    expect(ent.fundIds).toEqual([]);
    // No org ids → the fund lookup must not run.
    expect(fundFindMany).not.toHaveBeenCalled();
  });

  it('includes assigned funds even when their org is not a membership', async () => {
    const prisma: EntitlementPrismaClient = {
      orgMembership: {
        findMany: vi.fn().mockResolvedValue([{ organizationId: ORG_A }]),
      },
      fund: { findMany: vi.fn().mockResolvedValue([{ id: FUND_A1 }]) },
      fundAssignment: {
        findMany: vi.fn().mockResolvedValue([{ fundId: FUND_B1 }]),
      },
    };

    const ent = await resolveEntitlement(prisma, USER);
    expect([...ent.fundIds].sort()).toEqual([FUND_A1, FUND_B1].sort());
  });
});

describe('classifyGovernedField', () => {
  it('maps the platform read fields to their governed model (whereScope)', () => {
    expect(classifyGovernedField('funds')).toEqual({
      model: 'Fund',
      opKind: 'whereScope',
    });
    expect(classifyGovernedField('findFirstOrganization')).toEqual({
      model: 'Organization',
      opKind: 'whereScope',
    });
    expect(classifyGovernedField('brokerageAccounts')).toEqual({
      model: 'BrokerageAccount',
      opKind: 'whereScope',
    });
    expect(classifyGovernedField('orgMemberships')).toEqual({
      model: 'OrgMembership',
      opKind: 'whereScope',
    });
    // findUnique singular + findUniqueOrThrow (getX)
    expect(classifyGovernedField('organization')).toEqual({
      model: 'Organization',
      opKind: 'whereScope',
    });
    expect(classifyGovernedField('getFund')).toEqual({
      model: 'Fund',
      opKind: 'whereScope',
    });
  });

  it('maps mutations to the correct op kind', () => {
    expect(classifyGovernedField('updateOneBrokerageAccount')).toEqual({
      model: 'BrokerageAccount',
      opKind: 'whereScope',
    });
    expect(classifyGovernedField('deleteOneOrganization')).toEqual({
      model: 'Organization',
      opKind: 'whereScope',
    });
    expect(classifyGovernedField('createOneOrgMembership')).toEqual({
      model: 'OrgMembership',
      opKind: 'createScope',
    });
    expect(classifyGovernedField('upsertOneNotificationPreference')).toEqual({
      model: 'NotificationPreference',
      opKind: 'upsertScope',
    });
  });

  it('returns null for non-governed models', () => {
    expect(classifyGovernedField('trades')).toBeNull();
    expect(classifyGovernedField('findManyUser')).toBeNull();
    expect(classifyGovernedField('updateOneAlpacaAccount')).toBeNull();
    expect(classifyGovernedField('user')).toBeNull();
  });
});

describe('buildScopeWhere', () => {
  it('scopes org/fund/brokerage by membership-derived id sets', () => {
    const ent = entitlement();
    expect(buildScopeWhere('Organization', ent)).toEqual({
      id: { in: [ORG_A] },
    });
    expect(buildScopeWhere('OrgMembership', ent)).toEqual({
      organizationId: { in: [ORG_A] },
    });
    expect(buildScopeWhere('Fund', ent)).toEqual({
      OR: [
        { organizationId: { in: [ORG_A] } },
        { id: { in: [FUND_A1, FUND_A2] } },
      ],
    });
    expect(buildScopeWhere('BrokerageAccount', ent)).toEqual({
      fundId: { in: [FUND_A1, FUND_A2] },
    });
  });

  it('scopes notification deliveries/preferences to the caller only', () => {
    const ent = entitlement();
    expect(buildScopeWhere('NotificationDelivery', ent)).toEqual({
      recipientUserId: USER,
    });
    expect(buildScopeWhere('NotificationPreference', ent)).toEqual({
      userId: USER,
    });
    expect(buildScopeWhere('NotificationEvent', ent)).toEqual({
      OR: [
        { orgId: { in: [ORG_A] } },
        { fundId: { in: [FUND_A1, FUND_A2] } },
        { actorUserId: USER },
      ],
    });
  });
});

describe('injectScopeWhere', () => {
  it('preserves a top-level unique selector and appends the scope to AND', () => {
    const scope = { id: { in: [ORG_A] } };
    const out = injectScopeWhere({ id: ORG_B }, scope);
    expect(out).toEqual({ id: ORG_B, AND: [scope] });
  });

  it('creates an AND array when the caller supplied no where', () => {
    const scope = { fundId: { in: [FUND_A1] } };
    expect(injectScopeWhere(undefined, scope)).toEqual({ AND: [scope] });
  });

  it('merges into an existing AND array without dropping caller filters', () => {
    const scope = { fundId: { in: [FUND_A1] } };
    const out = injectScopeWhere(
      { status: 'ACTIVE', AND: [{ label: 'x' }] },
      scope
    );
    expect(out).toEqual({
      status: 'ACTIVE',
      AND: [{ label: 'x' }, scope],
    });
  });
});

describe('dataInScope (create payloads)', () => {
  const ent = entitlement();

  it('permits self-service organization creation (onboarding)', () => {
    expect(dataInScope('Organization', { name: 'New Org' }, ent)).toBe(true);
  });

  it('scopes membership/fund creation to an entitled organization', () => {
    // scalar FK form
    expect(
      dataInScope('OrgMembership', { organizationId: ORG_A }, ent)
    ).toBe(true);
    expect(
      dataInScope('OrgMembership', { organizationId: ORG_B }, ent)
    ).toBe(false);
    // nested connect form (typegraphql-prisma create input)
    expect(
      dataInScope(
        'Fund',
        { name: 'f', organization: { connect: { id: ORG_A } } },
        ent
      )
    ).toBe(true);
    expect(
      dataInScope(
        'Fund',
        { name: 'f', organization: { connect: { id: ORG_B } } },
        ent
      )
    ).toBe(false);
  });

  it('scopes brokerage/fund-assignment creation to an entitled fund', () => {
    expect(
      dataInScope('BrokerageAccount', { fund: { connect: { id: FUND_A1 } } }, ent)
    ).toBe(true);
    expect(
      dataInScope('BrokerageAccount', { fund: { connect: { id: FUND_B1 } } }, ent)
    ).toBe(false);
  });

  it('scopes notification deliveries/preferences to the caller only', () => {
    expect(
      dataInScope('NotificationDelivery', { recipientUserId: USER }, ent)
    ).toBe(true);
    expect(
      dataInScope('NotificationDelivery', { recipientUserId: ORG_B }, ent)
    ).toBe(false);
    expect(
      dataInScope('NotificationPreference', { user: { connect: { id: USER } } }, ent)
    ).toBe(true);
  });

  it('requires every element of a createMany payload to be in scope', () => {
    expect(
      dataInScope(
        'Fund',
        [
          { organization: { connect: { id: ORG_A } } },
          { organization: { connect: { id: ORG_A } } },
        ],
        ent
      )
    ).toBe(true);
    expect(
      dataInScope(
        'Fund',
        [
          { organization: { connect: { id: ORG_A } } },
          { organization: { connect: { id: ORG_B } } },
        ],
        ent
      )
    ).toBe(false);
  });

  it('treats a missing/malformed payload as out of scope', () => {
    expect(dataInScope('Fund', undefined, ent)).toBe(false);
    expect(dataInScope('Fund', null, ent)).toBe(false);
  });
});

describe('evaluateAccess', () => {
  const ent = entitlement();

  it('allows a read already scoped to an entitled tenant', () => {
    expect(
      evaluateAccess(
        { model: 'Fund', opKind: 'whereScope' },
        { where: { organizationId: ORG_A, status: 'ACTIVE' } },
        ent
      )
    ).toEqual({ decision: 'allow', reason: 'where_within_entitlement' });

    expect(
      evaluateAccess(
        { model: 'BrokerageAccount', opKind: 'whereScope' },
        { where: { fundId: FUND_A1 } },
        ent
      ).decision
    ).toBe('allow');

    expect(
      evaluateAccess(
        { model: 'NotificationDelivery', opKind: 'whereScope' },
        { where: { recipientUserId: USER } },
        ent
      ).decision
    ).toBe('allow');
  });

  it('flags a read that is not proven in-scope as restrict (foreign or unscoped)', () => {
    // foreign org
    expect(
      evaluateAccess(
        { model: 'Fund', opKind: 'whereScope' },
        { where: { organizationId: ORG_B } },
        ent
      ).decision
    ).toBe('restrict');
    // no where at all (unbounded list)
    expect(
      evaluateAccess(
        { model: 'Fund', opKind: 'whereScope' },
        {},
        ent
      ).decision
    ).toBe('restrict');
    // another user's deliveries
    expect(
      evaluateAccess(
        { model: 'NotificationDelivery', opKind: 'whereScope' },
        { where: { recipientUserId: ORG_B } },
        ent
      ).decision
    ).toBe('restrict');
  });

  it('allows an in-scope create and denies a cross-tenant create', () => {
    expect(
      evaluateAccess(
        { model: 'Fund', opKind: 'createScope' },
        { data: { organization: { connect: { id: ORG_A } } } },
        ent
      ).decision
    ).toBe('allow');
    expect(
      evaluateAccess(
        { model: 'Fund', opKind: 'createScope' },
        { data: { organization: { connect: { id: ORG_B } } } },
        ent
      ).decision
    ).toBe('deny');
  });

  it('denies an upsert whose create payload is cross-tenant', () => {
    expect(
      evaluateAccess(
        { model: 'NotificationPreference', opKind: 'upsertScope' },
        {
          where: { userId: USER },
          create: { user: { connect: { id: ORG_B } } },
        },
        ent
      ).decision
    ).toBe('deny');
  });
});

/**
 * The served access reads, against a fake Prisma that records every query
 * and returns whatever rows the test seeds. Proves who may ask, that the
 * caller's organizations are ANDed onto every user read, that a row the
 * database should not have returned as active is never served, and that an
 * office entity view with no grant reads nothing.
 */
import { describe, expect, it } from 'vitest';

import type { BackendPrincipal } from '../../../auth/token-verifier';
import {
  activeAuditorGrants,
  activeRoleAssignments,
  AllocatorAccessRefusal,
  OFFICE_ENTITY_SELECT,
  officeEntities,
  type AllocatorAccessPrisma,
  type AuditorGrantRow,
  type RoleAssignmentRow,
} from '../allocator-access-service';

const ORG_A = '11111111-1111-1111-1111-111111111111';
const ORG_B = '22222222-2222-2222-2222-222222222222';
const USER = '99999999-9999-9999-9999-999999999999';
const OTHER = '88888888-8888-8888-8888-888888888888';
const INV_1 = 'aaaaaaaa-0000-0000-0000-000000000001';
const INV_2 = 'aaaaaaaa-0000-0000-0000-000000000002';

const NOW = new Date('2026-11-23T12:00:00.000Z');
const clock = (): Date => NOW;

const USER_P: BackendPrincipal = { kind: 'user', sub: USER, roles: [] };
const SERVER_P: BackendPrincipal = {
  kind: 'server',
  sub: 'adaptic-platform:h:1',
};

function grant(
  id: string,
  over: Partial<AuditorGrantRow> = {}
): AuditorGrantRow {
  return {
    id,
    officeOrganizationId: ORG_A,
    userId: USER,
    entityIds: [INV_1],
    periodFrom: new Date('2026-01-01T00:00:00Z'),
    periodTo: new Date('2026-06-30T00:00:00Z'),
    expiresAt: new Date('2026-12-01T00:00:00Z'),
    revokedAt: null,
    grantedById: OTHER,
    createdAt: new Date('2026-11-01T00:00:00Z'),
    ...over,
  };
}

interface Fake {
  prisma: AllocatorAccessPrisma;
  calls: Array<{ model: string; args: unknown }>;
}

function fake(seed: {
  memberOrgs?: string[];
  /** Member organizations whose membership has entityScopeAll. */
  scopeAllOrgs?: string[];
  grants?: AuditorGrantRow[];
  assignments?: RoleAssignmentRow[];
  membership?: { entityScopeAll: boolean; entityScopeIds: string[] } | null;
  investors?: Array<{ id: string; name: string }>;
}): Fake {
  const calls: Fake['calls'] = [];
  const record =
    <T>(model: string, rows: T[]) =>
    async (args: unknown): Promise<T[]> => {
      calls.push({ model, args });
      return rows;
    };
  const prisma = {
    orgMembership: {
      findMany: record(
        'orgMembership',
        (seed.memberOrgs ?? []).map((organizationId) => ({
          organizationId,
          entityScopeAll: (seed.scopeAllOrgs ?? []).includes(organizationId),
          entityScopeIds: [],
          organization: { kind: 'ALLOCATOR_OFFICE' },
        }))
      ),
      findFirst: async (args: unknown) => {
        calls.push({ model: 'orgMembership.findFirst', args });
        return seed.membership ?? null;
      },
    },
    fund: { findMany: record('fund', []) },
    fundAssignment: { findMany: record('fundAssignment', []) },
    auditorGrant: {
      // The office-scope read selects columns; the served read does not.
      findMany: async (args: { select?: unknown }) => {
        const model = args.select === undefined ? 'auditorGrant' : 'auditorGrant.scope';
        calls.push({ model, args });
        return model === 'auditorGrant' ? (seed.grants ?? []) : [];
      },
    },
    roleAssignment: {
      findMany: record('roleAssignment', seed.assignments ?? []),
    },
    investor: { findMany: record('investor', seed.investors ?? []) },
  } as unknown as AllocatorAccessPrisma;
  return { prisma, calls };
}

function whereOf(f: Fake, model: string): unknown {
  return (
    f.calls.find((c) => c.model === model)?.args as
      | { where?: unknown }
      | undefined
  )?.where;
}

async function refusal(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
  } catch (error: unknown) {
    if (error instanceof AllocatorAccessRefusal) return error.code;
    throw error;
  }
  return 'none';
}

describe('activeAuditorGrants', () => {
  it('refuses no principal and a malformed id', async () => {
    expect(
      await refusal(activeAuditorGrants(fake({}).prisma, null, {}, clock))
    ).toBe('UNAUTHENTICATED');
    expect(
      await refusal(
        activeAuditorGrants(
          fake({}).prisma,
          USER_P,
          { userId: 'not-a-uuid' },
          clock
        )
      )
    ).toBe('BAD_USER_INPUT');
  });

  it("selects only active grants, ANDed with the caller's own grants or the offices whose every entity they see, and the filters", async () => {
    const f = fake({ memberOrgs: [ORG_A], scopeAllOrgs: [ORG_A] });
    await activeAuditorGrants(
      f.prisma,
      USER_P,
      { organizationId: ORG_A, userId: USER },
      clock
    );
    expect(whereOf(f, 'auditorGrant')).toEqual({
      AND: [
        { revokedAt: { equals: null }, expiresAt: { gt: NOW } },
        { OR: [{ userId: { equals: USER } }, { officeOrganizationId: { in: [ORG_A] } }] },
        { officeOrganizationId: { equals: ORG_A } },
        { userId: { equals: USER } },
      ],
    });
  });

  it('a member with a listed entity scope reads only their own grants of that office, never other people\'s', async () => {
    const f = fake({ memberOrgs: [ORG_A] });
    await activeAuditorGrants(f.prisma, USER_P, {}, clock);
    expect(whereOf(f, 'auditorGrant')).toEqual({
      AND: [
        { revokedAt: { equals: null }, expiresAt: { gt: NOW } },
        { OR: [{ userId: { equals: USER } }, { officeOrganizationId: { in: [] } }] },
      ],
    });
  });

  it('never serves a revoked or expired grant as active, even when the database returns it', async () => {
    const f = fake({
      memberOrgs: [ORG_A],
      grants: [
        grant('active'),
        grant('revoked', { revokedAt: new Date('2026-11-20T00:00:00Z') }),
        grant('expired', { expiresAt: new Date('2026-11-22T00:00:00Z') }),
        grant('expires-now', { expiresAt: NOW }),
      ],
    });
    const rows = await activeAuditorGrants(f.prisma, USER_P, {}, clock);
    expect(rows.map((r) => r.id)).toEqual(['active']);
  });

  it('reads unscoped for the service principal', async () => {
    const f = fake({});
    await activeAuditorGrants(f.prisma, SERVER_P, {}, clock);
    expect(whereOf(f, 'auditorGrant')).toEqual({
      AND: [{ revokedAt: { equals: null }, expiresAt: { gt: NOW } }],
    });
    expect(f.calls.some((c) => c.model === 'orgMembership')).toBe(false);
  });

  it('an external auditor, a member of no organization, reads their own grants and no one else\'s', async () => {
    const f = fake({ memberOrgs: [] });
    await activeAuditorGrants(f.prisma, USER_P, {}, clock);
    expect(whereOf(f, 'auditorGrant')).toEqual({
      AND: [
        { revokedAt: { equals: null }, expiresAt: { gt: NOW } },
        { OR: [{ userId: { equals: USER } }, { officeOrganizationId: { in: [] } }] },
      ],
    });
  });
});

describe('activeRoleAssignments', () => {
  it('serves only assignments inside their window, scoped to the user organizations', async () => {
    const f = fake({
      memberOrgs: [ORG_A, ORG_B],
      assignments: [
        {
          id: 'open',
          organizationId: ORG_A,
          userId: USER,
          startsAt: new Date('2026-01-01T00:00:00Z'),
          endsAt: null,
        },
        {
          id: 'ended',
          organizationId: ORG_A,
          userId: USER,
          startsAt: new Date('2026-01-01T00:00:00Z'),
          endsAt: NOW,
        },
        {
          id: 'future',
          organizationId: ORG_A,
          userId: USER,
          startsAt: new Date('2026-12-01T00:00:00Z'),
          endsAt: null,
        },
      ],
    });
    const rows = await activeRoleAssignments(f.prisma, USER_P, {}, clock);
    expect(rows.map((r) => r.id)).toEqual(['open']);
    expect(whereOf(f, 'roleAssignment')).toEqual({
      AND: [
        {
          startsAt: { lte: NOW },
          OR: [{ endsAt: { equals: null } }, { endsAt: { gt: NOW } }],
        },
        { organizationId: { in: [ORG_A, ORG_B] } },
      ],
    });
  });
});

describe('officeEntities', () => {
  it('reads nothing when the membership scope is false with an empty list and no grant names an entity', async () => {
    const f = fake({
      membership: { entityScopeAll: false, entityScopeIds: [] },
      investors: [{ id: INV_1, name: 'Leaked' }],
    });
    expect(
      await officeEntities(
        f.prisma,
        USER_P,
        { officeOrganizationId: ORG_A },
        clock
      )
    ).toEqual([]);
    expect(f.calls.some((c) => c.model === 'investor')).toBe(false);
  });

  it('reads nothing for a person with no membership and no grant', async () => {
    const f = fake({
      membership: null,
      investors: [{ id: INV_1, name: 'Leaked' }],
    });
    expect(
      await officeEntities(
        f.prisma,
        USER_P,
        { officeOrganizationId: ORG_A },
        clock
      )
    ).toEqual([]);
  });

  it('reads exactly the listed entities of the office, widened by active grants only', async () => {
    const f = fake({
      membership: { entityScopeAll: false, entityScopeIds: [INV_1] },
      grants: [
        grant('g1', { entityIds: [INV_2] }),
        grant('g-revoked', {
          entityIds: ['bbbbbbbb-0000-0000-0000-000000000009'],
          revokedAt: NOW,
        }),
      ],
    });
    await officeEntities(
      f.prisma,
      USER_P,
      { officeOrganizationId: ORG_A },
      clock
    );
    expect(whereOf(f, 'investor')).toEqual({
      officeOrganizationId: { equals: ORG_A },
      deletedAt: { equals: null },
      id: { in: [INV_1, INV_2] },
    });
    expect(whereOf(f, 'auditorGrant')).toEqual({
      AND: [
        { revokedAt: { equals: null }, expiresAt: { gt: NOW } },
        { officeOrganizationId: { equals: ORG_A } },
        { userId: { equals: USER } },
      ],
    });
  });

  it('selects only the entity columns, never a relation', async () => {
    const f = fake({ membership: { entityScopeAll: true, entityScopeIds: [] } });
    await officeEntities(f.prisma, USER_P, { officeOrganizationId: ORG_A }, clock);
    const args = f.calls.find((c) => c.model === 'investor')?.args as { select?: Record<string, boolean> };
    expect(args.select).toEqual(OFFICE_ENTITY_SELECT);
  });

  it('reads every office entity only when entityScopeAll is true', async () => {
    const f = fake({
      membership: { entityScopeAll: true, entityScopeIds: [] },
    });
    await officeEntities(
      f.prisma,
      USER_P,
      { officeOrganizationId: ORG_A },
      clock
    );
    expect(whereOf(f, 'investor')).toEqual({
      officeOrganizationId: { equals: ORG_A },
      deletedAt: { equals: null },
    });
  });

  it("refuses a user asking for someone else's view, and the service without a viewer", async () => {
    expect(
      await refusal(
        officeEntities(
          fake({}).prisma,
          USER_P,
          { officeOrganizationId: ORG_A, userId: OTHER },
          clock
        )
      )
    ).toBe('FORBIDDEN');
    expect(
      await refusal(
        officeEntities(
          fake({}).prisma,
          SERVER_P,
          { officeOrganizationId: ORG_A },
          clock
        )
      )
    ).toBe('BAD_USER_INPUT');
    expect(
      await refusal(
        officeEntities(
          fake({}).prisma,
          null,
          { officeOrganizationId: ORG_A },
          clock
        )
      )
    ).toBe('UNAUTHENTICATED');
  });

  it("resolves the named viewer's membership for the service principal", async () => {
    const f = fake({
      membership: { entityScopeAll: false, entityScopeIds: [INV_2] },
    });
    await officeEntities(
      f.prisma,
      SERVER_P,
      { officeOrganizationId: ORG_A, userId: OTHER },
      clock
    );
    expect(whereOf(f, 'orgMembership.findFirst')).toEqual({
      organizationId: ORG_A,
      userId: OTHER,
    });
  });
});

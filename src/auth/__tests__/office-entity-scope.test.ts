/**
 * An allocator office's entities (`Investor` rows with an
 * `officeOrganizationId`) and the authority around them, the pure halves:
 * the entity scope on the generated investor reads and the investor's
 * records, the write hold on an office's entities, the filter refusal around
 * them, the mode escalation for the authority columns, and the audit
 * workspace tags a user may not set. The served half is
 * `src/tests/office-entity-scope.test.ts`.
 */
import { describe, expect, it } from 'vitest';
import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  anonymousScopeWhere,
  buildScopeWhere,
  buildWriteScopeWhere,
  classifyGovernedField,
  investorRowVisible,
  isAlwaysEnforced,
  NO_OFFICE_SCOPE,
  resolveOfficeScope,
  type Entitlement,
  type OfficeScope,
  type OfficeScopePrismaClient,
} from '../tenancy-scope';
import {
  escalatedMutationMode,
  RESERVED_COLUMNS,
  userContentRefusal,
  USER_RESERVED_AUDIT_WORKSPACES,
} from '../user-write-content';
import { namesOfficeEntityColumn } from '../../middleware/tenancy-scoping';
import type { MutationTarget } from '../mutation-authorization';

const OFFICE_A = '11111111-1111-1111-1111-111111111111';
const OFFICE_B = '22222222-2222-2222-2222-222222222222';
const MANAGER = '33333333-3333-3333-3333-333333333333';
const USER = '99999999-9999-9999-9999-999999999999';
const INV_1 = 'aaaaaaaa-0000-0000-0000-000000000001';
const INV_2 = 'aaaaaaaa-0000-0000-0000-000000000002';

const ENT: Entitlement = { userId: USER, orgIds: [OFFICE_A], fundIds: [] };
const NOW = new Date('2026-11-23T12:00:00.000Z');

const SCOPE: OfficeScope = {
  allOfficeIds: [OFFICE_B],
  listed: [{ officeId: OFFICE_A, investorIds: [INV_1] }],
  managerOrgIds: [MANAGER],
};

describe('office entity scope on the investor reads', () => {
  it('keeps every row no office owns, then adds the manager register, the whole offices and the listed entities', () => {
    expect(buildScopeWhere('Investor', ENT, SCOPE)).toEqual({
      OR: [
        { officeOrganizationId: { equals: null } },
        { organizationId: { in: [MANAGER] } },
        { officeOrganizationId: { in: [OFFICE_B] } },
        { officeOrganizationId: { equals: OFFICE_A }, id: { in: [INV_1] } },
      ],
    });
  });

  it('reads no office entity without an office scope, and none for a caller with no identity', () => {
    expect(buildScopeWhere('Investor', ENT)).toEqual({
      OR: [
        { officeOrganizationId: { equals: null } },
        { organizationId: { in: [] } },
        { officeOrganizationId: { in: [] } },
      ],
    });
    expect(anonymousScopeWhere('Investor')).toEqual({
      officeOrganizationId: { equals: null },
    });
  });

  it("scopes an investor's records through their investor, keeping fund-wide documents", () => {
    const investorScope = buildScopeWhere('Investor', ENT, SCOPE);
    for (const model of [
      'Holding',
      'InvestorTransaction',
      'TaxDocument',
    ] as const) {
      expect(buildScopeWhere(model, ENT, SCOPE), model).toEqual({
        investor: { is: investorScope },
      });
      expect(anonymousScopeWhere(model), model).toEqual({
        investor: { is: { officeOrganizationId: { equals: null } } },
      });
    }
    expect(buildScopeWhere('InvestorDocument', ENT, SCOPE)).toEqual({
      OR: [
        { investorId: { equals: null } },
        { investor: { is: investorScope } },
      ],
    });
  });

  it('classifies every generated read of an investor and its records, holds them in every mode, and holds investor writes to rows no office owns', () => {
    for (const [model, plural] of [
      ['Investor', 'investors'],
      ['Holding', 'holdings'],
      ['InvestorTransaction', 'investorTransactions'],
      ['InvestorDocument', 'investorDocuments'],
      ['TaxDocument', 'taxDocuments'],
    ] as const) {
      const lower = model[0].toLowerCase() + model.slice(1);
      for (const field of [
        plural,
        lower,
        `get${model}`,
        `findFirst${model}`,
        `aggregate${model}`,
        `groupBy${model}`,
      ]) {
        expect(classifyGovernedField(field), field).toEqual({
          model,
          opKind: 'whereScope',
        });
      }
      expect(isAlwaysEnforced(model), model).toBe(true);
    }
    for (const field of [
      'updateOneInvestor',
      'updateManyInvestor',
      'deleteOneInvestor',
      'deleteManyInvestor',
      'upsertOneInvestor',
    ]) {
      expect(classifyGovernedField(field), field).toEqual({
        model: 'Investor',
        opKind: 'whereScope',
      });
    }
    expect(classifyGovernedField('createManyInvestor')).toBeNull();
    expect(buildWriteScopeWhere('Investor', ENT, SCOPE)).toEqual({
      officeOrganizationId: { equals: null },
    });
  });

  it('serves a related row no office owns to anyone, and an office entity only within the scope', () => {
    expect(
      investorRowVisible(
        { id: INV_2, officeOrganizationId: null, organizationId: OFFICE_A },
        null
      )
    ).toBe(true);
    expect(
      investorRowVisible(
        { id: INV_1, officeOrganizationId: OFFICE_A, organizationId: OFFICE_A },
        SCOPE
      )
    ).toBe(true);
    expect(
      investorRowVisible(
        { id: INV_2, officeOrganizationId: OFFICE_A, organizationId: OFFICE_A },
        SCOPE
      )
    ).toBe(false);
    expect(
      investorRowVisible(
        { id: INV_2, officeOrganizationId: OFFICE_A, organizationId: MANAGER },
        SCOPE
      )
    ).toBe(true);
    expect(
      investorRowVisible(
        { id: INV_2, officeOrganizationId: OFFICE_B, organizationId: OFFICE_B },
        SCOPE
      )
    ).toBe(true);
    expect(
      investorRowVisible({ id: INV_1, officeOrganizationId: OFFICE_A }, null)
    ).toBe(false);
    expect(
      investorRowVisible(
        { id: INV_1, officeOrganizationId: OFFICE_A },
        NO_OFFICE_SCOPE
      )
    ).toBe(false);
    // A row whose office was not read is not known to be unowned.
    expect(investorRowVisible({ id: INV_1 }, SCOPE)).toBe(false);
  });
});

describe('office scope resolution', () => {
  function fakePrisma(
    memberships: Array<{
      organizationId: string;
      kind: string | null;
      all: boolean;
      ids: string[] | null;
    }>,
    grants: Array<{
      officeOrganizationId: string;
      entityIds: string[] | null;
      expiresAt: Date;
      revokedAt: Date | null;
    }>
  ): { prisma: OfficeScopePrismaClient; grantWhere: () => unknown } {
    let seen: unknown;
    const prisma: OfficeScopePrismaClient = {
      orgMembership: {
        findMany: async () =>
          memberships.map((m) => ({
            organizationId: m.organizationId,
            organization: m.kind === null ? null : { kind: m.kind },
            entityScopeAll: m.all,
            entityScopeIds: m.ids,
          })),
      },
      auditorGrant: {
        findMany: async (args) => {
          seen = args.where;
          return grants;
        },
      },
    };
    return { prisma, grantWhere: () => seen };
  }

  it('lists whole offices, listed entities widened by active grants only, and manager registers', async () => {
    const { prisma, grantWhere } = fakePrisma(
      [
        {
          organizationId: OFFICE_A,
          kind: 'ALLOCATOR_OFFICE',
          all: false,
          ids: [INV_1],
        },
        {
          organizationId: OFFICE_B,
          kind: 'ALLOCATOR_OFFICE',
          all: true,
          ids: [],
        },
        { organizationId: MANAGER, kind: 'MANAGER', all: false, ids: [] },
      ],
      [
        {
          officeOrganizationId: OFFICE_A,
          entityIds: [INV_2],
          expiresAt: new Date('2026-12-01T00:00:00Z'),
          revokedAt: null,
        },
        {
          officeOrganizationId: OFFICE_A,
          entityIds: ['revoked'],
          expiresAt: new Date('2026-12-01T00:00:00Z'),
          revokedAt: NOW,
        },
        {
          officeOrganizationId: OFFICE_A,
          entityIds: ['expired'],
          expiresAt: NOW,
          revokedAt: null,
        },
      ]
    );
    expect(await resolveOfficeScope(prisma, USER, NOW)).toEqual({
      allOfficeIds: [OFFICE_B],
      listed: [{ officeId: OFFICE_A, investorIds: [INV_1, INV_2] }],
      managerOrgIds: [MANAGER],
    });
    expect(grantWhere()).toEqual({
      AND: [
        { revokedAt: { equals: null }, expiresAt: { gt: NOW } },
        { userId: { equals: USER } },
      ],
    });
  });

  it('fails closed: an empty list, a null list, no membership and an unread organization kind open nothing', async () => {
    const { prisma } = fakePrisma(
      [
        {
          organizationId: OFFICE_A,
          kind: 'ALLOCATOR_OFFICE',
          all: false,
          ids: [],
        },
        { organizationId: OFFICE_B, kind: null, all: false, ids: null },
      ],
      [
        {
          officeOrganizationId: MANAGER,
          entityIds: null,
          expiresAt: new Date('2026-12-01T00:00:00Z'),
          revokedAt: null,
        },
      ]
    );
    expect(await resolveOfficeScope(prisma, USER, NOW)).toEqual(
      NO_OFFICE_SCOPE
    );
  });

  it("gives an auditor who is no office's member exactly their granted entities", async () => {
    const { prisma } = fakePrisma(
      [],
      [
        {
          officeOrganizationId: OFFICE_A,
          entityIds: [INV_2],
          expiresAt: new Date('2026-12-01T00:00:00Z'),
          revokedAt: null,
        },
      ]
    );
    expect(await resolveOfficeScope(prisma, USER, NOW)).toEqual({
      allOfficeIds: [],
      listed: [{ officeId: OFFICE_A, investorIds: [INV_2] }],
      managerOrgIds: [],
    });
  });
});

describe("grants and groups name entities, so only a whole-office reader reads other people's", () => {
  it("scopes grants to the caller's own and the offices they see all of, and groups to those offices", () => {
    expect(buildScopeWhere('AuditorGrant', ENT, SCOPE)).toEqual({
      OR: [
        { userId: { equals: USER } },
        { officeOrganizationId: { in: [OFFICE_B] } },
      ],
    });
    expect(buildScopeWhere('EntityGroup', ENT, SCOPE)).toEqual({
      officeId: { in: [OFFICE_B] },
    });
    expect(buildScopeWhere('EntityGroup', ENT)).toEqual({
      officeId: { in: [] },
    });
  });
});

describe('mode escalation for the authority columns', () => {
  const office = [{ model: 'Investor', column: 'officeOrganizationId' }];
  const name = [{ model: 'Investor', column: 'name' }];

  it("decides an entity's office or parent, root or nested, at enforce for a user or no principal, in every mode", () => {
    for (const column of [
      'officeOrganizationId',
      'officeOrganization',
      'parentInvestorId',
      'parentInvestor',
    ]) {
      for (const mode of ['off', 'shadow', 'enforce'] as const) {
        for (const principal of [{ kind: 'user' as const }, null]) {
          expect(
            escalatedMutationMode({
              principal,
              contentRefusal: null,
              columns: [{ model: 'Investor', column }],
              mode,
            }),
            `${column}/${mode}/${principal?.kind ?? 'none'}`
          ).toBe('enforce');
        }
      }
    }
  });

  it('leaves the service and admins at their mode, and every other column at its mode', () => {
    for (const kind of ['server', 'admin'] as const) {
      expect(
        escalatedMutationMode({
          principal: { kind },
          contentRefusal: null,
          columns: office,
          mode: 'shadow',
        })
      ).toBe('shadow');
    }
    expect(
      escalatedMutationMode({
        principal: { kind: 'user' },
        contentRefusal: null,
        columns: name,
        mode: 'shadow',
      })
    ).toBe('shadow');
    expect(
      escalatedMutationMode({
        principal: { kind: 'user' },
        contentRefusal: null,
        columns: [],
        mode: 'off',
      })
    ).toBe('off');
  });

  it('decides the always-enforced content refusals at enforce, and no other refusal', () => {
    for (const refusal of [
      'ledger_fund_reserved',
      'organization_kind_reserved',
      'audit_workspace_reserved',
    ] as const) {
      expect(
        escalatedMutationMode({
          principal: { kind: 'user' },
          contentRefusal: refusal,
          columns: [],
          mode: 'off',
        })
      ).toBe('enforce');
    }
    expect(
      escalatedMutationMode({
        principal: { kind: 'user' },
        contentRefusal: 'field_not_user_writable',
        columns: [],
        mode: 'shadow',
      })
    ).toBe('shadow');
  });

  it('reserves the office and tree keys of an entity, scalar and relation', () => {
    expect([...(RESERVED_COLUMNS.get('Investor') ?? [])]).toEqual([
      'officeOrganizationId',
      'officeOrganization',
      'parentInvestorId',
      'parentInvestor',
    ]);
  });
});

describe('audit workspace tags a user may not set', () => {
  const create: MutationTarget = {
    model: 'AuditLog',
    action: 'create',
    cardinality: 'one',
    fieldName: 'createOneAuditLog',
  };
  const entry = (workspace?: string): Record<string, unknown> => ({
    data: {
      userId: USER,
      operationType: 'CREATE',
      modelName: 'Fund',
      recordId: 'r',
      changedFields: {},
      workspace,
    },
  });

  it('refuses SHARED and ORGANISATION, which open an entry to every workspace', () => {
    expect([...USER_RESERVED_AUDIT_WORKSPACES]).toEqual([
      'SHARED',
      'ORGANISATION',
    ]);
    expect(userContentRefusal(create, entry('SHARED'), USER)).toBe(
      'audit_workspace_reserved'
    );
    expect(userContentRefusal(create, entry('ORGANISATION'), USER)).toBe(
      'audit_workspace_reserved'
    );
  });

  it("admits the user's own workspace tag and an untagged entry", () => {
    expect(userContentRefusal(create, entry('STRATEGY'), USER)).toBeNull();
    expect(userContentRefusal(create, entry('FUND'), USER)).toBeNull();
    expect(userContentRefusal(create, entry(), USER)).toBeNull();
  });
});

describe("filters on an office entity's columns outside the investor reads", () => {
  const stringFilter = new GraphQLInputObjectType({
    name: 'StringNullableFilter',
    fields: { equals: { type: GraphQLString } },
  });
  const investorWhere: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'InvestorWhereInput',
    fields: () => ({
      name: { type: stringFilter },
      registrationNumber: { type: stringFilter },
      officeOrganizationId: { type: stringFilter },
    }),
  });
  const investorList = new GraphQLInputObjectType({
    name: 'InvestorListRelationFilter',
    fields: { some: { type: investorWhere } },
  });
  const orgWhere: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'OrganizationWhereInput',
    fields: () => ({
      registrationNumber: { type: stringFilter },
      investors: { type: investorList },
      AND: { type: new GraphQLList(orgWhere) },
    }),
  });
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      organizations: {
        type: GraphQLString,
        args: { where: { type: orgWhere } },
      },
    },
  });
  const named = (where: unknown): boolean =>
    namesOfficeEntityColumn(
      { parentType: query, fieldName: 'organizations' },
      { where }
    );

  it('finds a filter on an entity column through a relation, at any depth', () => {
    expect(
      named({
        investors: { some: { registrationNumber: { equals: 'REG-1' } } },
      })
    ).toBe(true);
    expect(
      named({
        AND: [
          {
            investors: { some: { officeOrganizationId: { equals: OFFICE_A } } },
          },
        ],
      })
    ).toBe(true);
  });

  it('ignores the same key on another model, and the columns every investor always had', () => {
    expect(named({ registrationNumber: { equals: 'REG-1' } })).toBe(false);
    expect(named({ investors: { some: { name: { equals: 'n' } } } })).toBe(
      false
    );
    expect(named(undefined)).toBe(false);
  });
});

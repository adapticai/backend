/**
 * The access models (`RoleAssignment`, `AuditorGrant`, `EntityGroup`), the
 * allocator entity scope, the "active" rules for grants and assignments, and
 * the reserved `Organization.kind` — the pure halves, run without a database.
 * The served-schema half is `src/tests/access-authz.test.ts`.
 */
import { describe, expect, it } from 'vitest';
import { GraphQLBoolean, GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from 'graphql';

import {
  activeAuditorGrantWhere,
  activeRoleAssignmentWhere,
  isAuditorGrantActive,
  isRoleAssignmentActive,
  NO_ENTITIES,
  officeEntityWhere,
  resolveEntityScope,
  withGrantedEntities,
} from '../allocator-access';
import {
  effectiveModeFor,
  evaluateMutationAccess,
  ruleFor,
  type MutationTarget,
} from '../mutation-authorization';
import {
  ACCESS_MODELS,
  buildScopeWhere,
  classifyGovernedField,
  dataInScope,
  evaluateAccess,
  GOVERNED_MODELS,
  isAlwaysEnforced,
  type Entitlement,
} from '../tenancy-scope';
import { findNestedWrites, type WrittenColumn } from '../nested-write-inspector';
import { hiddenRelationCountsFor } from '../../config/server-only-models';
import {
  ALWAYS_ENFORCED_CONTENT_REFUSALS,
  RESERVED_COLUMNS,
  userContentRefusal,
  writesReservedColumn,
} from '../user-write-content';
import type { BackendPrincipal } from '../token-verifier';

const ORG_A = '11111111-1111-1111-1111-111111111111';
const ORG_B = '22222222-2222-2222-2222-222222222222';
const USER = '99999999-9999-9999-9999-999999999999';
const INV_1 = 'aaaaaaaa-0000-0000-0000-000000000001';
const INV_2 = 'aaaaaaaa-0000-0000-0000-000000000002';

const ENT: Entitlement = { userId: USER, orgIds: [ORG_A], fundIds: [] };
const USER_P: BackendPrincipal = { kind: 'user', sub: USER, roles: [] };
const ADMIN_P: BackendPrincipal = {
  kind: 'admin',
  sub: 'admin-1',
  roles: ['admin'],
};
const SERVER_P: BackendPrincipal = {
  kind: 'server',
  sub: 'adaptic-engine:h:1',
};

const NOW = new Date('2026-11-23T12:00:00.000Z');
const BEFORE = new Date('2026-11-23T11:59:59.999Z');
const AFTER = new Date('2026-11-23T12:00:00.001Z');

function target(
  model: string,
  action: MutationTarget['action'] = 'create'
): MutationTarget {
  return {
    model,
    action,
    cardinality: 'one',
    fieldName: `${action}One${model}`,
  };
}

describe('access models: read scope', () => {
  it('scopes each access model to the caller organizations and nothing else', () => {
    expect(buildScopeWhere('RoleAssignment', ENT)).toEqual({
      organizationId: { in: [ORG_A] },
    });
    expect(buildScopeWhere('AuditorGrant', ENT)).toEqual({
      officeOrganizationId: { in: [ORG_A] },
    });
    expect(buildScopeWhere('EntityGroup', ENT)).toEqual({
      officeId: { in: [ORG_A] },
    });
  });

  it('classifies every generated read of each access model, and no write', () => {
    for (const [model, plural] of [
      ['RoleAssignment', 'roleAssignments'],
      ['AuditorGrant', 'auditorGrants'],
      ['EntityGroup', 'entityGroups'],
    ] as const) {
      const lower = model[0].toLowerCase() + model.slice(1);
      for (const field of [
        plural,
        lower,
        `get${model}`,
        `findFirst${model}`,
        `findFirst${model}OrThrow`,
        `aggregate${model}`,
        `groupBy${model}`,
      ]) {
        expect(classifyGovernedField(field), field).toEqual({
          model,
          opKind: 'whereScope',
        });
      }
      for (const field of [
        `createOne${model}`,
        `updateOne${model}`,
        `upsertOne${model}`,
        `deleteMany${model}`,
      ]) {
        expect(classifyGovernedField(field), field).toBeNull();
      }
    }
  });

  it('holds the access models in every mode and out of the tenant-writable list', () => {
    for (const model of ACCESS_MODELS) {
      expect(isAlwaysEnforced(model), model).toBe(true);
      expect(
        (GOVERNED_MODELS as readonly string[]).includes(model),
        model
      ).toBe(false);
    }
  });

  it('proves a read pre-scoped only when it names an entitled organization', () => {
    const field = { model: 'AuditorGrant', opKind: 'whereScope' } as const;
    expect(
      evaluateAccess(field, { where: { officeOrganizationId: ORG_A } }, ENT)
        .decision
    ).toBe('allow');
    expect(
      evaluateAccess(field, { where: { officeOrganizationId: ORG_B } }, ENT)
        .decision
    ).toBe('restrict');
    expect(
      evaluateAccess(field, { where: { userId: USER } }, ENT).decision
    ).toBe('restrict');
  });

  it('never treats a create payload as in scope', () => {
    for (const model of ACCESS_MODELS) {
      expect(
        dataInScope(
          model,
          {
            organizationId: ORG_A,
            officeOrganizationId: ORG_A,
            officeId: ORG_A,
          },
          ENT
        ),
        model
      ).toBe(false);
    }
  });
});

describe('access models: writes', () => {
  it('are service-only for a user and admitted for the service and admins', () => {
    for (const model of ACCESS_MODELS) {
      expect(ruleFor(model).policy, model).toBe('service_only');
      for (const action of ['create', 'update', 'upsert', 'delete'] as const) {
        expect(
          evaluateMutationAccess(USER_P, target(model, action)),
          `${model} ${action}`
        ).toMatchObject({
          allowed: false,
          reason: 'model_not_user_writable',
        });
      }
      expect(
        evaluateMutationAccess(SERVER_P, target(model)).allowed,
        model
      ).toBe(true);
      expect(
        evaluateMutationAccess(ADMIN_P, target(model)).allowed,
        model
      ).toBe(true);
      expect(evaluateMutationAccess(null, target(model)).reason, model).toBe(
        'unauthenticated'
      );
    }
  });

  it('are decided at enforce in every mode, as the root and as a nested write', () => {
    for (const model of ACCESS_MODELS) {
      for (const mode of ['off', 'shadow', 'enforce'] as const) {
        expect(
          effectiveModeFor([model], mode, new Set()),
          `${model} ${mode}`
        ).toBe('enforce');
        expect(
          effectiveModeFor(['Organization', model], mode, new Set()),
          `nested ${model} ${mode}`
        ).toBe('enforce');
      }
    }
  });
});

describe('Organization.kind is reserved from users', () => {
  it('refuses kind on a user create, update or upsert, in every mode', () => {
    expect(
      userContentRefusal(
        target('Organization', 'create'),
        { data: { name: 'O', slug: 'o', kind: 'ALLOCATOR_OFFICE' } },
        USER
      )
    ).toBe('organization_kind_reserved');
    expect(
      userContentRefusal(
        target('Organization', 'update'),
        { where: { id: ORG_A }, data: { kind: { set: 'MANAGER' } } },
        USER
      )
    ).toBe('organization_kind_reserved');
    expect(
      userContentRefusal(
        target('Organization', 'upsert'),
        {
          where: { id: ORG_A },
          create: { name: 'O', slug: 'o' },
          update: { kind: { set: 'ALLOCATOR_OFFICE' } },
        },
        USER
      )
    ).toBe('organization_kind_reserved');
    expect(
      ALWAYS_ENFORCED_CONTENT_REFUSALS.has('organization_kind_reserved')
    ).toBe(true);
  });

  it('leaves every other organization field as it was', () => {
    expect(
      userContentRefusal(
        target('Organization', 'update'),
        {
          where: { id: ORG_A },
          data: {
            name: { set: 'Renamed' },
            timeZone: { set: 'Europe/London' },
          },
        },
        USER
      )
    ).toBeNull();
  });
});

describe('entity scope fails closed', () => {
  it('resolves entityScopeAll = false with an empty list to no entity', () => {
    expect(
      resolveEntityScope({ entityScopeAll: false, entityScopeIds: [] })
    ).toEqual({ all: false, investorIds: [] });
  });

  it('resolves no membership, a null flag and a null list to no entity', () => {
    expect(resolveEntityScope(null)).toEqual(NO_ENTITIES);
    expect(
      resolveEntityScope({ entityScopeAll: null, entityScopeIds: null })
    ).toEqual(NO_ENTITIES);
    expect(
      resolveEntityScope({
        entityScopeAll: undefined,
        entityScopeIds: undefined,
      })
    ).toEqual(NO_ENTITIES);
  });

  it('opens every entity only when entityScopeAll is true, and lists exactly the ids otherwise', () => {
    expect(
      resolveEntityScope({ entityScopeAll: true, entityScopeIds: [] })
    ).toEqual({ all: true });
    expect(
      resolveEntityScope({
        entityScopeAll: false,
        entityScopeIds: [INV_1, INV_1, INV_2],
      })
    ).toEqual({
      all: false,
      investorIds: [INV_1, INV_2],
    });
  });

  it('filters an empty scope to id IN () on the office, which matches nothing', () => {
    expect(officeEntityWhere(ORG_A, NO_ENTITIES)).toEqual({
      officeOrganizationId: { equals: ORG_A },
      deletedAt: { equals: null },
      id: { in: [] },
    });
    expect(officeEntityWhere(ORG_A, { all: true })).toEqual({
      officeOrganizationId: { equals: ORG_A },
      deletedAt: { equals: null },
    });
  });

  it('widens a listed scope by granted entities and leaves an all scope as it is', () => {
    expect(withGrantedEntities(NO_ENTITIES, [INV_2])).toEqual({
      all: false,
      investorIds: [INV_2],
    });
    expect(withGrantedEntities({ all: true }, [INV_2])).toEqual({ all: true });
  });
});

describe('active auditor grant', () => {
  it('is active only while not revoked and before it expires', () => {
    expect(
      isAuditorGrantActive({ expiresAt: AFTER, revokedAt: null }, NOW)
    ).toBe(true);
    expect(
      isAuditorGrantActive({ expiresAt: AFTER, revokedAt: BEFORE }, NOW)
    ).toBe(false);
    expect(
      isAuditorGrantActive({ expiresAt: BEFORE, revokedAt: null }, NOW)
    ).toBe(false);
  });

  it('is not active when its revocation was not read (unknown is not active)', () => {
    expect(isAuditorGrantActive({ expiresAt: AFTER }, NOW)).toBe(false);
  });

  it('is expired at exactly its expiry instant', () => {
    expect(isAuditorGrantActive({ expiresAt: NOW, revokedAt: null }, NOW)).toBe(
      false
    );
  });

  it('selects the same rows in the database', () => {
    expect(activeAuditorGrantWhere(NOW)).toEqual({
      revokedAt: { equals: null },
      expiresAt: { gt: NOW },
    });
  });
});

describe('active role assignment', () => {
  it('is active from its start (inclusive) to its end (exclusive), open-ended when it has none', () => {
    expect(isRoleAssignmentActive({ startsAt: NOW, endsAt: null }, NOW)).toBe(
      true
    );
    expect(isRoleAssignmentActive({ startsAt: AFTER, endsAt: null }, NOW)).toBe(
      false
    );
    expect(isRoleAssignmentActive({ startsAt: BEFORE, endsAt: NOW }, NOW)).toBe(
      false
    );
    expect(
      isRoleAssignmentActive({ startsAt: BEFORE, endsAt: AFTER }, NOW)
    ).toBe(true);
  });

  it('is not active when its end was not read (unknown is not active)', () => {
    expect(isRoleAssignmentActive({ startsAt: BEFORE }, NOW)).toBe(false);
  });

  it('selects the same rows in the database', () => {
    expect(activeRoleAssignmentWhere(NOW)).toEqual({
      startsAt: { lte: NOW },
      OR: [{ endsAt: { equals: null } }, { endsAt: { gt: NOW } }],
    });
  });
});

describe('reserved authority columns (kind, entity scope)', () => {
  const boolSet = new GraphQLInputObjectType({ name: 'BoolFieldUpdateOperationsInput', fields: { set: { type: GraphQLBoolean } } });
  const kindSet = new GraphQLInputObjectType({ name: 'EnumOrganizationKindFieldUpdateOperationsInput', fields: { set: { type: GraphQLString } } });
  const orgWhere = new GraphQLInputObjectType({ name: 'OrganizationWhereInput', fields: { kind: { type: GraphQLString } } });
  const orgUpdate = new GraphQLInputObjectType({
    name: 'OrganizationUpdateWithoutFundsInput',
    fields: { kind: { type: kindSet }, name: { type: GraphQLString } },
  });
  const orgNested = new GraphQLInputObjectType({
    name: 'OrganizationUpdateOneRequiredWithoutFundsNestedInput',
    fields: { update: { type: orgUpdate } },
  });
  const fundUpdate = new GraphQLInputObjectType({
    name: 'FundUpdateInput',
    fields: { organization: { type: orgNested }, name: { type: GraphQLString } },
  });
  const membershipUpdate = new GraphQLInputObjectType({
    name: 'OrgMembershipUpdateInput',
    fields: { entityScopeAll: { type: boolSet } },
  });
  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      updateOneFund: { type: GraphQLString, args: { data: { type: fundUpdate }, where: { type: orgWhere } } },
      updateOneOrgMembership: { type: GraphQLString, args: { data: { type: membershipUpdate } } },
    },
  });
  const models = ['OrgMembership', 'Organization', 'Fund'];

  function columnsOf(fieldName: string, args: Record<string, unknown>, model: string): WrittenColumn[] {
    const columns: WrittenColumn[] = [];
    findNestedWrites({ parentType: mutation, fieldName }, args, models, { model, action: 'update' }, columns);
    return columns;
  }

  it('names the kind and the entity scope, and nothing else', () => {
    expect([...RESERVED_COLUMNS.entries()].map(([m, c]) => [m, [...c]])).toEqual([
      ['Organization', ['kind']],
      ['OrgMembership', ['entityScopeAll', 'entityScopeIds']],
    ]);
  });

  it('finds an organization kind set through a nested write from a fund', () => {
    const columns = columnsOf('updateOneFund', { data: { organization: { update: { kind: { set: 'MANAGER' } } } } }, 'Fund');
    expect(columns).toContainEqual({ model: 'Organization', column: 'kind' });
    expect(writesReservedColumn(columns)).toBe(true);
  });

  it("finds a member's own entity scope set at the root", () => {
    const columns = columnsOf('updateOneOrgMembership', { data: { entityScopeAll: { set: true } } }, 'OrgMembership');
    expect(writesReservedColumn(columns)).toBe(true);
  });

  it('ignores the column named in a filter, and writes of other columns', () => {
    expect(writesReservedColumn(columnsOf('updateOneFund', { where: { kind: 'MANAGER' }, data: { name: 'F' } }, 'Fund'))).toBe(false);
    expect(
      writesReservedColumn(columnsOf('updateOneFund', { data: { organization: { update: { name: 'O' } } } }, 'Fund'))
    ).toBe(false);
  });
});

describe('hidden relation counts', () => {
  it('removes the access back-relation counts from the User, Organization and Investor _count types', () => {
    expect([...(hiddenRelationCountsFor('UserCount') ?? [])]).toEqual(['roleAssignments', 'auditorGrants']);
    expect([...(hiddenRelationCountsFor('OrganizationCount') ?? [])]).toEqual([
      'officeInvestors',
      'entityGroups',
      'auditorGrants',
      'roleAssignments',
    ]);
    expect([...(hiddenRelationCountsFor('InvestorCount') ?? [])]).toEqual(['childInvestors']);
    expect(hiddenRelationCountsFor('FundCount')).toBeUndefined();
    expect(hiddenRelationCountsFor('UserCountAggregate')).toBeUndefined();
  });
});

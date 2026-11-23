/**
 * An allocator office's entities on the served schema: who reads them, through
 * which roots and relations, who may write them, and what a user may tag an
 * audit entry with, against a real Postgres built from the migration history.
 * Every staged mode is left at its default (the tenancy scope and the
 * mutation guard both in shadow, as production runs), so what holds here holds
 * before any mode is flipped.
 *
 * Cast: an office (OFFICE) and a manager (MANAGER) whose fund an office entity
 * invests in. Alice sees every office entity; Carol sees only entity 1; Dave
 * is a member with an empty list; Erin is an external auditor (no membership)
 * with an active grant for entity 2; Mona is a member of the manager; Mallory
 * belongs nowhere. Entities: 1 and 2 on the manager's register, 3 on the
 * office's own (2's parent), plus a legacy investor no office owns.
 *
 * Needs `ACCESS_IT_DATABASE_URL`. Output is printed between `<<<RESULTS>>>`
 * and `<<<END>>>`; seeded rows are removed.
 */
import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { buildSchema } from 'type-graphql';
import { graphql, type GraphQLSchema } from 'graphql';

import { resolvers } from '../generated/typegraphql-prisma';
import {
  withoutServerOnlyResolvers,
  withoutServerOnlySchemaSurface,
} from '../config/server-only-models';
import { AllocatorAccessResolver } from '../resolvers/custom';
import { createCredentialFieldGuardMiddleware } from '../middleware/credential-field-guard';
import { createTenancyScopingMiddleware } from '../middleware/tenancy-scoping';
import { installMutationAuthGuard } from '../middleware/mutation-auth-guard';
import { cortexAuthChecker } from '../auth/cortex-auth-checker';
import { applyCortexAuthorizationMap } from '../auth/authorization-map';
import type { BackendPrincipal } from '../auth/token-verifier';

interface StepResult {
  data: unknown;
  errors: string[];
  codes: string[];
}

async function run(
  schema: GraphQLSchema,
  prisma: PrismaClient,
  principal: BackendPrincipal | null,
  source: string,
  variableValues: Record<string, unknown> = {}
): Promise<StepResult> {
  const result = await graphql({
    schema,
    source,
    variableValues,
    contextValue: { prisma, principal },
  });
  return {
    data: result.data ?? null,
    errors: (result.errors ?? []).map((error) => error.message),
    codes: (result.errors ?? []).map((error) =>
      String(error.extensions?.code ?? '')
    ),
  };
}

const DAY_MS = 86_400_000;

async function main(): Promise<void> {
  const url = process.env.ACCESS_IT_DATABASE_URL;
  if (!url) throw new Error('ACCESS_IT_DATABASE_URL is not set');
  delete process.env.MUTATION_AUTH_MODE;
  delete process.env.MUTATION_AUTH_ENFORCE_MODELS;
  delete process.env.TENANCY_SCOPING_MODE;
  delete process.env.CORTEX_AUTHCHECKER_ENFORCE;

  const prisma = new PrismaClient({ datasourceUrl: url });
  applyCortexAuthorizationMap();
  const schema = withoutServerOnlySchemaSurface(
    await buildSchema({
      resolvers: [
        ...withoutServerOnlyResolvers(resolvers),
        AllocatorAccessResolver,
      ],
      validate: false,
      globalMiddlewares: [
        createCredentialFieldGuardMiddleware(),
        createTenancyScopingMiddleware(),
      ],
      authChecker: cortexAuthChecker,
    })
  );
  installMutationAuthGuard(schema);

  const tag = randomUUID().slice(0, 8);
  const now = Date.now();
  const names = [
    'alice',
    'carol',
    'dave',
    'erin',
    'mona',
    'mallory',
    'grantor',
  ] as const;
  const users = await Promise.all(
    names.map((who) =>
      prisma.user.create({
        data: { email: `office-${who}-${tag}@example.test` },
      })
    )
  );
  const [alice, carol, dave, erin, mona, mallory, grantor] = users;
  const office = await prisma.organization.create({
    data: {
      name: `Office ${tag}`,
      slug: `office-${tag}`,
      kind: 'ALLOCATOR_OFFICE',
    },
  });
  const manager = await prisma.organization.create({
    data: { name: `Manager ${tag}`, slug: `manager-${tag}`, kind: 'MANAGER' },
  });
  const orgIds = [office.id, manager.id];
  const userIds = users.map((u) => u.id);
  const steps: Record<string, StepResult> = {};
  const facts: Record<string, unknown> = {};

  try {
    const inv3 = await prisma.investor.create({
      data: {
        name: 'Entity 3',
        organizationId: office.id,
        officeOrganizationId: office.id,
        registrationNumber: 'REG-3',
      },
    });
    const inv1 = await prisma.investor.create({
      data: {
        name: 'Entity 1',
        organizationId: manager.id,
        officeOrganizationId: office.id,
        registrationNumber: 'REG-1',
      },
    });
    const inv2 = await prisma.investor.create({
      data: {
        name: 'Entity 2',
        organizationId: manager.id,
        officeOrganizationId: office.id,
        parentInvestorId: inv3.id,
        registrationNumber: 'REG-2',
      },
    });
    const legacy = await prisma.investor.create({
      data: {
        name: 'Legacy LP',
        organizationId: manager.id,
        email: 'lp@example.test',
        jurisdiction: 'GB',
      },
    });
    facts.investors = {
      inv1: inv1.id,
      inv2: inv2.id,
      inv3: inv3.id,
      legacy: legacy.id,
    };
    await prisma.orgMembership.createMany({
      data: [
        {
          organizationId: office.id,
          userId: alice.id,
          role: 'ALLOCATOR_PRINCIPAL',
          entityScopeAll: true,
        },
        {
          organizationId: office.id,
          userId: carol.id,
          role: 'OPERATIONS_LEAD',
          entityScopeIds: [inv1.id],
        },
        { organizationId: office.id, userId: dave.id, role: 'MEMBER' },
        { organizationId: manager.id, userId: mona.id, role: 'MEMBER' },
      ],
    });
    const fund = await prisma.fund.create({
      data: {
        name: `Fund ${tag}`,
        slug: `office-fund-${tag}`,
        organizationId: manager.id,
      },
    });
    const [h1, hLegacy] = await Promise.all(
      [inv1.id, legacy.id].map((investorId) =>
        prisma.holding.create({ data: { investorId, fundId: fund.id } })
      )
    );
    facts.holdings = { h1: h1.id, legacy: hLegacy.id };
    const grant = (entityIds: string[], over: { revokedAt?: Date } = {}) =>
      prisma.auditorGrant.create({
        data: {
          officeOrganizationId: office.id,
          userId: erin.id,
          entityIds,
          periodFrom: new Date('2026-01-01T00:00:00Z'),
          periodTo: new Date('2026-06-30T00:00:00Z'),
          expiresAt: new Date(now + 30 * DAY_MS),
          revokedAt: over.revokedAt ?? null,
          grantedById: grantor.id,
        },
      });
    const gActive = await grant([inv2.id]);
    const gRevoked = await grant([inv3.id], {
      revokedAt: new Date(now - DAY_MS),
    });
    facts.grants = { active: gActive.id, revoked: gRevoked.id };
    const group = await prisma.entityGroup.create({
      data: {
        officeId: office.id,
        name: 'Branch',
        investorIds: [inv1.id, inv2.id],
      },
    });
    facts.group = group.id;

    const principal = (sub: string): BackendPrincipal => ({
      kind: 'user',
      sub,
      roles: [],
    });
    const P = {
      alice: principal(alice.id),
      carol: principal(carol.id),
      dave: principal(dave.id),
      erin: principal(erin.id),
      mona: principal(mona.id),
      mallory: principal(mallory.id),
    };
    const SERVICE: BackendPrincipal = { kind: 'server' };

    // Root reads.
    const OFFICE_READ = `query ($office: String!) {
      investors(where: { officeOrganizationId: { equals: $office } }, orderBy: [{ name: asc }]) { id }
      aggregateInvestor(where: { officeOrganizationId: { equals: $office } }) { _count { _all } }
      findFirstInvestor(where: { registrationNumber: { equals: "REG-3" } }) { id }
    }`;
    for (const [who, p] of [
      ...Object.entries(P),
      ['service', SERVICE],
      ['anonymous', null],
    ] as const) {
      steps[`officeRead.${who}`] = await run(schema, prisma, p, OFFICE_READ, {
        office: office.id,
      });
    }

    // Rows no office owns read exactly as before, by everyone.
    const LEGACY_READ = `query ($id: String!) {
      investor(where: { id: $id }) { id name email jurisdiction organizationId officeOrganizationId parentInvestorId registrationNumber status type kycStatus }
    }`;
    for (const [who, p] of [
      ['mallory', P.mallory],
      ['anonymous', null],
      ['service', SERVICE],
    ] as const) {
      steps[`legacyRead.${who}`] = await run(schema, prisma, p, LEGACY_READ, {
        id: legacy.id,
      });
    }

    // Records of an entity, and the relations that return one.
    const RECORDS = `query ($fund: String!) {
      holdings(where: { fundId: { equals: $fund } }, orderBy: [{ investorId: asc }]) { id }
    }`;
    for (const [who, p] of [
      ['mallory', P.mallory],
      ['mona', P.mona],
      ['service', SERVICE],
    ] as const) {
      steps[`holdings.${who}`] = await run(schema, prisma, p, RECORDS, {
        fund: fund.id,
      });
    }
    const RELATION = `query ($org: String!, $inv2: String!) {
      organization(where: { id: $org }) { id investors(orderBy: [{ name: asc }]) { id } }
      investor(where: { id: $inv2 }) { id parentInvestor { id } }
    }`;
    for (const [who, p] of [
      ['mallory', P.mallory],
      ['mona', P.mona],
      ['alice', P.alice],
    ] as const) {
      steps[`relation.${who}`] = await run(schema, prisma, p, RELATION, {
        org: manager.id,
        inv2: inv2.id,
      });
    }

    // Probing an entity's columns from outside the investor reads.
    const PROBE = `query { organizations(where: { investors: { some: { registrationNumber: { equals: "REG-1" } } } }) { id } }`;
    steps['probe.mallory'] = await run(schema, prisma, P.mallory, PROBE);
    steps['probe.malloryCount'] = await run(
      schema,
      prisma,
      P.mallory,
      `query ($id: String!) { organizations(where: { id: { equals: $id } }) { id _count { investors(where: { registrationNumber: { equals: "REG-1" } }) } } }`,
      { id: manager.id }
    );
    steps['probe.serviceCount'] = await run(
      schema,
      prisma,
      SERVICE,
      `query ($id: String!) { organizations(where: { id: { equals: $id } }) { id _count { investors(where: { registrationNumber: { equals: "REG-1" } }) } } }`,
      { id: manager.id }
    );
    steps['probe.service'] = await run(schema, prisma, SERVICE, PROBE);

    // Grants and groups.
    const GRANTS = `query ($office: String!) {
      auditorGrants(where: { officeOrganizationId: { equals: $office } }, orderBy: [{ createdAt: asc }]) { id }
      activeAuditorGrants(officeOrganizationId: $office) { id }
      entityGroups(where: { officeId: { equals: $office } }) { id }
    }`;
    for (const who of ['alice', 'carol', 'erin', 'mallory'] as const) {
      steps[`grants.${who}`] = await run(schema, prisma, P[who], GRANTS, {
        office: office.id,
      });
    }

    // Writes at the guard's default (shadow).
    const countBefore = await prisma.investor.count({
      where: { officeOrganizationId: office.id },
    });
    steps['write.malloryPlantsEntity'] = await run(
      schema,
      prisma,
      P.mallory,
      `mutation ($data: [InvestorCreateManyInput!]!) { createManyInvestor(data: $data) { count } }`,
      {
        data: [
          {
            name: 'Planted',
            organizationId: manager.id,
            officeOrganizationId: office.id,
            parentInvestorId: inv3.id,
          },
        ],
      }
    );
    steps['write.malloryConnectsOffice'] = await run(
      schema,
      prisma,
      P.mallory,
      `mutation ($org: String!, $office: String!) {
        createOneInvestor(data: { name: "Planted 2", organization: { connect: { id: $org } }, officeOrganization: { connect: { id: $office } } }) { id }
      }`,
      { org: manager.id, office: office.id }
    );
    steps['write.malloryMovesLegacyUnderEntity'] = await run(
      schema,
      prisma,
      P.mallory,
      `mutation ($id: String!, $parent: String!) { updateOneInvestor(where: { id: $id }, data: { parentInvestor: { connect: { id: $parent } } }) { id } }`,
      { id: legacy.id, parent: inv3.id }
    );
    steps['write.malloryRenamesOfficeEntities'] = await run(
      schema,
      prisma,
      P.mallory,
      `mutation ($office: String!) { updateManyInvestor(where: { officeOrganizationId: { equals: $office } }, data: { name: { set: "pwned" } }) { count } }`,
      { office: office.id }
    );
    steps['write.malloryDeletesOfficeEntities'] = await run(
      schema,
      prisma,
      P.mallory,
      `mutation ($office: String!) { deleteManyInvestor(where: { officeOrganizationId: { equals: $office } }) { count } }`,
      { office: office.id }
    );
    // Control: a row no office owns keeps the write behaviour it had (shadow admits it).
    steps['write.malloryRenamesLegacy'] = await run(
      schema,
      prisma,
      P.mallory,
      `mutation ($id: String!) { updateManyInvestor(where: { id: { equals: $id } }, data: { notes: { set: "control" } }) { count } }`,
      { id: legacy.id }
    );
    const officeRowsAfter = await prisma.investor.findMany({
      where: { officeOrganizationId: office.id },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, parentInvestorId: true },
    });
    const legacyAfter = await prisma.investor.findUniqueOrThrow({
      where: { id: legacy.id },
    });
    facts.writes = {
      countBefore,
      officeRowsAfter,
      legacyParentAfter: legacyAfter.parentInvestorId,
      legacyNotesAfter: legacyAfter.notes,
    };

    // The generated client's echo of a fetched row: unchanged reserved columns are a no-op.
    const membership = await prisma.orgMembership.findFirstOrThrow({
      where: { organizationId: office.id, userId: carol.id },
    });
    steps['echo.carolUpdatesOwnMembershipUnchanged'] = await run(
      schema,
      prisma,
      P.carol,
      `mutation ($id: String!, $ids: [String!]!) {
        updateOneOrgMembership(where: { id: $id }, data: { entityScopeAll: { set: false }, entityScopeIds: { set: $ids } }) { id entityScopeAll entityScopeIds }
      }`,
      { id: membership.id, ids: [inv1.id] }
    );
    steps['echo.carolWidensOwnScope'] = await run(
      schema,
      prisma,
      P.carol,
      `mutation ($id: String!, $ids: [String!]!) {
        updateOneOrgMembership(where: { id: $id }, data: { entityScopeIds: { set: $ids } }) { id }
      }`,
      { id: membership.id, ids: [inv1.id, inv2.id] }
    );
    steps['echo.serviceSetsScope'] = await run(
      schema,
      prisma,
      SERVICE,
      `mutation ($id: String!, $ids: [String!]!) {
        updateOneOrgMembership(where: { id: $id }, data: { entityScopeIds: { set: $ids } }) { id entityScopeIds }
      }`,
      { id: membership.id, ids: [inv1.id, inv3.id] }
    );
    steps['echo.serviceSetsKind'] = await run(
      schema,
      prisma,
      SERVICE,
      `mutation ($id: String!) { updateOneOrganization(where: { id: $id }, data: { kind: { set: ALLOCATOR_OFFICE } }) { id kind } }`,
      { id: manager.id }
    );
    await prisma.organization.update({
      where: { id: manager.id },
      data: { kind: 'MANAGER' },
    });
    facts.carolScopeAfter = (
      await prisma.orgMembership.findUniqueOrThrow({
        where: { id: membership.id },
      })
    ).entityScopeIds;

    // The id lists refuse NULL: empty means none, and there is no third state.
    const nullViolation = async (statement: string, ...values: string[]): Promise<string> => {
      try {
        await prisma.$executeRawUnsafe(statement, ...values);
        return 'admitted';
      } catch (error: unknown) {
        const meta = (error as { meta?: { code?: string } }).meta;
        return meta?.code ?? (error instanceof Error ? error.message : String(error));
      }
    };
    facts.nullLists = {
      entityScopeIds: await nullViolation(
        `UPDATE org_memberships SET "entityScopeIds" = NULL WHERE id = $1::uuid`,
        membership.id
      ),
      entityIds: await nullViolation(`UPDATE auditor_grants SET "entityIds" = NULL WHERE id = $1::uuid`, gActive.id),
      investorIds: await nullViolation(`UPDATE entity_groups SET "investorIds" = NULL WHERE id = $1::uuid`, group.id),
    };

    // Audit workspace tags.
    const AUDIT = `mutation ($data: AuditLogCreateInput!) { createOneAuditLog(data: $data) { id workspace } }`;
    const entry = (workspace?: string) => ({
      userId: mallory.id,
      operationType: 'CREATE',
      modelName: 'Fund',
      recordId: fund.id,
      changedFields: { name: { after: 'x' } },
      ...(workspace === undefined ? {} : { workspace }),
    });
    for (const workspace of ['SHARED', 'ORGANISATION', 'FUND']) {
      steps[`audit.${workspace}`] = await run(
        schema,
        prisma,
        P.mallory,
        AUDIT,
        { data: entry(workspace) }
      );
    }
    facts.auditRows = await prisma.auditLog.findMany({
      where: { userId: mallory.id },
      select: { workspace: true },
      orderBy: { workspace: 'asc' },
    });
  } finally {
    await prisma.auditLog.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.auditorGrant.deleteMany({
      where: { officeOrganizationId: { in: orgIds } },
    });
    await prisma.entityGroup.deleteMany({
      where: { officeId: { in: orgIds } },
    });
    await prisma.holding.deleteMany({
      where: { fund: { organizationId: { in: orgIds } } },
    });
    await prisma.fund.deleteMany({ where: { organizationId: { in: orgIds } } });
    await prisma.orgMembership.deleteMany({
      where: { organizationId: { in: orgIds } },
    });
    await prisma.investor.updateMany({
      where: { organizationId: { in: orgIds } },
      data: { parentInvestorId: null },
    });
    await prisma.investor.deleteMany({
      where: { organizationId: { in: orgIds } },
    });
    await prisma.organization.deleteMany({ where: { id: { in: orgIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  }

  process.stdout.write(
    `<<<RESULTS>>>${JSON.stringify({ steps, facts })}<<<END>>>\n`
  );
}

main().catch((error: unknown) => {
  process.stderr.write(`harness failed: ${String(error)}\n`);
  process.exit(1);
});

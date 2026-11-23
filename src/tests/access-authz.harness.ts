/**
 * The access models (`RoleAssignment`, `AuditorGrant`, `EntityGroup`), the
 * served access reads (`activeAuditorGrants`, `activeRoleAssignments`,
 * `officeEntities`) and the reserved `Organization.kind`, measured on the
 * schema `server.ts` assembles (generated resolvers, the access resolver, the
 * credential guard, the tenancy middleware, the mutation guard) against a
 * real Postgres built from the migration history.
 *
 * Every staged mode is left at its default (the tenancy scope and the
 * mutation guard both in shadow), so what is proven here is what holds in
 * production before any mode is flipped.
 *
 * Needs `ACCESS_IT_DATABASE_URL` pointing at a disposable migrated database.
 * Output is printed between `<<<RESULTS>>>` and `<<<END>>>`; seeded rows are
 * removed.
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

/** One executed operation: its data, or its errors' messages and codes. */
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
  const mkUser = (who: string) =>
    prisma.user.create({
      data: { email: `access-${who}-${tag}@example.test` },
    });
  const [alice, bob, carol, dave, erin, grantor] = await Promise.all(
    ['alice', 'bob', 'carol', 'dave', 'erin', 'grantor'].map(mkUser)
  );
  const officeA = await prisma.organization.create({
    data: {
      name: `Office A ${tag}`,
      slug: `access-a-${tag}`,
      kind: 'ALLOCATOR_OFFICE',
    },
  });
  const officeB = await prisma.organization.create({
    data: {
      name: `Office B ${tag}`,
      slug: `access-b-${tag}`,
      kind: 'ALLOCATOR_OFFICE',
    },
  });
  const orgIds = [officeA.id, officeB.id];
  const userIds = [alice, bob, carol, dave, erin, grantor].map((u) => u.id);

  const steps: Record<string, StepResult> = {};
  const facts: Record<string, unknown> = {};
  try {
    const [inv1, inv2, inv3, invB] = await Promise.all(
      ['Entity 1', 'Entity 2', 'Entity 3', 'Entity B'].map((name, i) =>
        prisma.investor.create({
          data: {
            name,
            organizationId: i === 3 ? officeB.id : officeA.id,
            officeOrganizationId: i === 3 ? officeB.id : officeA.id,
          },
        })
      )
    );
    facts.investors = {
      inv1: inv1.id,
      inv2: inv2.id,
      inv3: inv3.id,
      invB: invB.id,
    };
    await prisma.orgMembership.createMany({
      data: [
        {
          organizationId: officeA.id,
          userId: alice.id,
          role: 'ALLOCATOR_PRINCIPAL',
          entityScopeAll: true,
        },
        {
          organizationId: officeB.id,
          userId: bob.id,
          role: 'INVESTMENT_LEAD',
          entityScopeAll: true,
        },
        {
          organizationId: officeA.id,
          userId: carol.id,
          role: 'OPERATIONS_LEAD',
          entityScopeIds: [inv1.id],
        },
        { organizationId: officeA.id, userId: dave.id, role: 'MEMBER' },
      ],
    });
    const grant = (
      office: string,
      user: string,
      entityIds: string[],
      over: { revokedAt?: Date; expiresAt?: Date } = {}
    ) =>
      prisma.auditorGrant.create({
        data: {
          officeOrganizationId: office,
          userId: user,
          entityIds,
          periodFrom: new Date('2026-01-01T00:00:00Z'),
          periodTo: new Date('2026-06-30T00:00:00Z'),
          expiresAt: over.expiresAt ?? new Date(now + 30 * DAY_MS),
          revokedAt: over.revokedAt ?? null,
          grantedById: grantor.id,
        },
      });
    const gActive = await grant(officeA.id, erin.id, [inv2.id]);
    const gRevoked = await grant(officeA.id, erin.id, [inv3.id], {
      revokedAt: new Date(now - DAY_MS),
    });
    const gExpired = await grant(officeA.id, erin.id, [inv3.id], {
      expiresAt: new Date(now - DAY_MS),
    });
    const gB = await grant(officeB.id, erin.id, [invB.id]);
    facts.grants = {
      active: gActive.id,
      revoked: gRevoked.id,
      expired: gExpired.id,
      b: gB.id,
    };
    const assign = (
      org: string,
      user: string,
      startsAt: Date,
      endsAt: Date | null
    ) =>
      prisma.roleAssignment.create({
        data: {
          organizationId: org,
          userId: user,
          role: 'COO',
          workspace: 'FUND',
          scopeType: 'ORGANIZATION',
          startsAt,
          endsAt,
          grantedById: grantor.id,
        },
      });
    const raOpen = await assign(
      officeA.id,
      alice.id,
      new Date(now - DAY_MS),
      null
    );
    const raEnded = await assign(
      officeA.id,
      alice.id,
      new Date(now - 2 * DAY_MS),
      new Date(now - DAY_MS)
    );
    const raB = await assign(officeB.id, bob.id, new Date(now - DAY_MS), null);
    facts.assignments = { open: raOpen.id, ended: raEnded.id, b: raB.id };
    const egA = await prisma.entityGroup.create({
      data: {
        officeId: officeA.id,
        name: 'Branch A',
        investorIds: [inv1.id, inv2.id],
      },
    });
    const egB = await prisma.entityGroup.create({
      data: { officeId: officeB.id, name: 'Branch B', investorIds: [invB.id] },
    });
    facts.groups = { a: egA.id, b: egB.id };

    const ALICE: BackendPrincipal = { kind: 'user', sub: alice.id, roles: [] };
    const CAROL: BackendPrincipal = { kind: 'user', sub: carol.id, roles: [] };
    const DAVE: BackendPrincipal = { kind: 'user', sub: dave.id, roles: [] };
    const SERVICE: BackendPrincipal = { kind: 'server' };

    const LIST = `query ($orgs: [String!]!) {
      roleAssignments(where: { organizationId: { in: $orgs } }, orderBy: [{ startsAt: asc }]) { id organizationId }
      auditorGrants(where: { officeOrganizationId: { in: $orgs } }, orderBy: [{ createdAt: asc }]) { id officeOrganizationId }
      entityGroups(where: { officeId: { in: $orgs } }) { id officeId }
    }`;
    steps.aliceList = await run(schema, prisma, ALICE, LIST, { orgs: orgIds });
    steps.serviceList = await run(schema, prisma, SERVICE, LIST, {
      orgs: orgIds,
    });
    steps.anonymousList = await run(schema, prisma, null, LIST, {
      orgs: orgIds,
    });
    steps.aliceReadsOtherOfficeRows = await run(
      schema,
      prisma,
      ALICE,
      `query ($ra: String!, $ag: String!, $eg: String!) {
        roleAssignment(where: { id: $ra }) { id }
        auditorGrant(where: { id: $ag }) { id }
        entityGroup(where: { id: $eg }) { id }
      }`,
      { ra: raB.id, ag: gB.id, eg: egB.id }
    );

    const ACTIVE_GRANTS = `query ($office: String, $user: String) {
      activeAuditorGrants(officeOrganizationId: $office, userId: $user) { id }
    }`;
    steps.aliceActiveGrants = await run(
      schema,
      prisma,
      ALICE,
      ACTIVE_GRANTS,
      {}
    );
    steps.serviceActiveGrantsForErin = await run(
      schema,
      prisma,
      SERVICE,
      ACTIVE_GRANTS,
      { user: erin.id }
    );
    steps.aliceActiveAssignments = await run(
      schema,
      prisma,
      ALICE,
      `query { activeRoleAssignments { id } }`
    );

    const ENTITIES = `query ($office: String!, $user: String) {
      officeEntities(officeOrganizationId: $office, userId: $user) { id }
    }`;
    steps.aliceEntities = await run(schema, prisma, ALICE, ENTITIES, {
      office: officeA.id,
    });
    steps.carolEntities = await run(schema, prisma, CAROL, ENTITIES, {
      office: officeA.id,
    });
    steps.daveEntities = await run(schema, prisma, DAVE, ENTITIES, {
      office: officeA.id,
    });
    steps.serviceEntitiesForErin = await run(
      schema,
      prisma,
      SERVICE,
      ENTITIES,
      { office: officeA.id, user: erin.id }
    );
    steps.carolAsksForAlice = await run(schema, prisma, CAROL, ENTITIES, {
      office: officeA.id,
      user: alice.id,
    });

    const before = await prisma.roleAssignment.count({
      where: { organizationId: { in: orgIds } },
    });
    steps.aliceCreatesRoleAssignment = await run(
      schema,
      prisma,
      ALICE,
      `mutation ($data: RoleAssignmentCreateInput!) { createOneRoleAssignment(data: $data) { id } }`,
      {
        data: {
          organization: { connect: { id: officeA.id } },
          user: { connect: { id: alice.id } },
          role: 'OVERSIGHT',
          workspace: 'STRATEGY',
          scopeType: 'ORGANIZATION',
          startsAt: new Date(now).toISOString(),
          grantedById: alice.id,
        },
      }
    );
    steps.aliceCreatesAuditorGrant = await run(
      schema,
      prisma,
      ALICE,
      `mutation ($data: AuditorGrantCreateInput!) { createOneAuditorGrant(data: $data) { id } }`,
      {
        data: {
          officeOrganization: { connect: { id: officeA.id } },
          user: { connect: { id: alice.id } },
          entityIds: { set: [invB.id] },
          periodFrom: new Date(now).toISOString(),
          periodTo: new Date(now).toISOString(),
          expiresAt: new Date(now + DAY_MS).toISOString(),
          grantedById: alice.id,
        },
      }
    );
    steps.aliceRevivesRevokedGrant = await run(
      schema,
      prisma,
      ALICE,
      `mutation ($id: String!) { updateOneAuditorGrant(where: { id: $id }, data: { revokedAt: { set: null } }) { id } }`,
      { id: gRevoked.id }
    );
    steps.aliceNestedRoleAssignment = await run(
      schema,
      prisma,
      ALICE,
      `mutation ($id: String!, $user: String!) {
        updateOneOrganization(where: { id: $id }, data: { roleAssignments: { create: [{
          user: { connect: { id: $user } }, role: COO, workspace: FUND, scopeType: ORGANIZATION,
          startsAt: "2026-01-01T00:00:00.000Z", grantedById: $user }] } }) { id }
      }`,
      { id: officeA.id, user: alice.id }
    );
    steps.aliceSetsOrganizationKind = await run(
      schema,
      prisma,
      ALICE,
      `mutation ($id: String!) { updateOneOrganization(where: { id: $id }, data: { kind: { set: MANAGER } }) { id kind } }`,
      { id: officeA.id }
    );
    steps.aliceSetsTimeZone = await run(
      schema,
      prisma,
      ALICE,
      `mutation ($id: String!) { updateOneOrganization(where: { id: $id }, data: { timeZone: { set: "Europe/London" } }) { id timeZone kind } }`,
      { id: officeA.id }
    );
    steps.serviceCreatesRoleAssignment = await run(
      schema,
      prisma,
      SERVICE,
      `mutation ($data: RoleAssignmentCreateInput!) { createOneRoleAssignment(data: $data) { id role workspace scopeType } }`,
      {
        data: {
          organization: { connect: { id: officeA.id } },
          user: { connect: { id: carol.id } },
          role: 'VERIFIER',
          workspace: 'SHARED',
          scopeType: 'ORGANIZATION',
          startsAt: new Date(now).toISOString(),
          grantedById: grantor.id,
        },
      }
    );
    steps.userReadsGrantsThroughUser = await run(
      schema,
      prisma,
      ALICE,
      `query ($id: String!) { user(where: { id: $id }) { id auditorGrants { id } } }`,
      { id: erin.id }
    );
    const after = await prisma.roleAssignment.count({
      where: { organizationId: { in: orgIds } },
    });
    const officeAAfter = await prisma.organization.findUniqueOrThrow({
      where: { id: officeA.id },
    });
    const revokedAfter = await prisma.auditorGrant.findUniqueOrThrow({
      where: { id: gRevoked.id },
    });
    const aliceGrants = await prisma.auditorGrant.count({
      where: { userId: alice.id },
    });
    facts.writes = {
      roleAssignmentsBefore: before,
      roleAssignmentsAfter: after,
      officeKindAfter: officeAAfter.kind,
      revokedStillRevoked: revokedAfter.revokedAt !== null,
      aliceGrants,
    };
  } finally {
    await prisma.roleAssignment.deleteMany({
      where: { organizationId: { in: orgIds } },
    });
    await prisma.auditorGrant.deleteMany({
      where: { officeOrganizationId: { in: orgIds } },
    });
    await prisma.entityGroup.deleteMany({
      where: { officeId: { in: orgIds } },
    });
    await prisma.orgMembership.deleteMany({
      where: { organizationId: { in: orgIds } },
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

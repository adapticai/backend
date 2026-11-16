/**
 * Strategy fund tenancy (G-STR-06) on the served path, against a real Postgres
 * built from the migration history.
 *
 * The schema is assembled as src/server.ts assembles it — generated resolvers
 * minus server-only models, the strategy-draft resolver, the credential-field
 * guard and tenancy scoping as global middlewares, the cortex authChecker over
 * the authorization map, then the mutation guard installed on the built
 * schema — and every operation runs through `graphql()` with a principal in
 * the context. Both staged modes are left unset (`shadow`), because the claim
 * under test is that the Strategy scope does not depend on them.
 *
 * Seeds two organizations, one fund in each, ALICE as a member of
 * organization A and BOB assigned to fund B, one SYSTEM strategy, and a draft
 * ALICE authored that sits in fund B (as if she had since left it). Needs
 * `DESK_IT_DATABASE_URL` pointing at a disposable migrated database. Output is
 * printed between `<<<RESULTS>>>` and `<<<END>>>`; seeded rows are removed.
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
import { StrategyDraftResolver } from '../resolvers/custom';
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

const CREATE = `mutation ($fundId: String!, $name: String!) {
  createStrategyDraft(fundId: $fundId, kind: thematic, displayName: $name, spec: { thesis: "Grid" }) { status id revision }
}`;

const SAVE = `mutation ($id: String!, $rev: DateTimeISO!) {
  saveStrategyDraft(id: $id, expectedRevision: $rev, displayName: "Edited", spec: { thesis: "Edited" }) { status }
}`;

const LIST = `query ($prefix: String!) {
  strategies(where: { key: { startsWith: $prefix } }, orderBy: [{ key: asc }]) { key fundId }
}`;

const ONE = `query ($id: String!) { strategy(where: { id: $id }) { id } }`;

async function main(): Promise<void> {
  const url = process.env.DESK_IT_DATABASE_URL;
  if (!url) throw new Error('DESK_IT_DATABASE_URL is not set');
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
        StrategyDraftResolver,
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
  const prefix = `str06-${tag}`;
  const alice = await prisma.user.create({
    data: { email: `str06-a-${tag}@example.test` },
  });
  const bob = await prisma.user.create({
    data: { email: `str06-b-${tag}@example.test` },
  });
  const orgA = await prisma.organization.create({
    data: { name: `A ${tag}`, slug: `str06-a-${tag}` },
  });
  const orgB = await prisma.organization.create({
    data: { name: `B ${tag}`, slug: `str06-b-${tag}` },
  });
  const fundA = await prisma.fund.create({
    data: { name: 'A', slug: `a-${tag}`, organizationId: orgA.id },
  });
  const fundB = await prisma.fund.create({
    data: { name: 'B', slug: `b-${tag}`, organizationId: orgB.id },
  });
  await prisma.orgMembership.create({
    data: { organizationId: orgA.id, userId: alice.id },
  });
  await prisma.fundAssignment.create({
    data: { fundId: fundB.id, userId: bob.id },
  });
  await prisma.strategy.create({
    data: { key: `${prefix}-0-system`, displayName: 'System' },
  });
  const aliceInB = await prisma.strategy.create({
    data: {
      key: `${prefix}-3-alice-in-b`,
      displayName: 'Left behind',
      origin: 'USER',
      kind: 'thematic',
      spec: { thesis: 'Grid' },
      ownerUserId: alice.id,
      fundId: fundB.id,
    },
  });

  const ALICE: BackendPrincipal = { kind: 'user', sub: alice.id, roles: [] };
  const BOB: BackendPrincipal = { kind: 'user', sub: bob.id, roles: [] };
  const SERVICE: BackendPrincipal = { kind: 'server' };

  const steps: Record<string, StepResult> = {};
  const facts: Record<string, unknown> = {
    fundA: fundA.id,
    fundB: fundB.id,
    prefix,
  };
  try {
    steps.aliceCreatesInB = await run(schema, prisma, ALICE, CREATE, {
      fundId: fundB.id,
      name: 'Not mine',
    });
    steps.aliceCreatesInA = await run(schema, prisma, ALICE, CREATE, {
      fundId: fundA.id,
      name: 'Mine',
    });
    steps.bobCreatesInB = await run(schema, prisma, BOB, CREATE, {
      fundId: fundB.id,
      name: 'Bob',
    });
    const created = await prisma.strategy.findMany({
      where: {
        ownerUserId: { in: [alice.id, bob.id] },
        key: { startsWith: 'desk-' },
      },
      select: { id: true, ownerUserId: true, fundId: true },
    });
    facts.created = created.map((row) => ({
      owner: row.ownerUserId === alice.id ? 'alice' : 'bob',
      fund:
        row.fundId === fundA.id
          ? 'A'
          : row.fundId === fundB.id
            ? 'B'
            : row.fundId,
    }));
    // Give the builder's rows the tag prefix so the list reads below see them.
    for (const row of created) {
      const who = row.ownerUserId === alice.id ? '1-alice-in-a' : '2-bob-in-b';
      await prisma.strategy.update({
        where: { id: row.id },
        data: { key: `${prefix}-${who}` },
      });
    }
    const bobDraft = created.find((row) => row.ownerUserId === bob.id);

    steps.aliceList = await run(schema, prisma, ALICE, LIST, { prefix });
    steps.bobList = await run(schema, prisma, BOB, LIST, { prefix });
    steps.anonymousList = await run(schema, prisma, null, LIST, { prefix });
    steps.serviceList = await run(schema, prisma, SERVICE, LIST, { prefix });
    steps.aliceReadsBobsDraft = await run(schema, prisma, ALICE, ONE, {
      id: bobDraft?.id ?? '',
    });
    steps.aliceReadsHerDraftInB = await run(schema, prisma, ALICE, ONE, {
      id: aliceInB.id,
    });

    steps.aliceSavesHerDraftInB = await run(schema, prisma, ALICE, SAVE, {
      id: aliceInB.id,
      rev: aliceInB.updatedAt.toISOString(),
    });
    const after = await prisma.strategy.findUniqueOrThrow({
      where: { id: aliceInB.id },
    });
    facts.aliceInBAfterSave = {
      displayName: after.displayName,
      fund: after.fundId === fundB.id ? 'B' : after.fundId,
    };
  } finally {
    await prisma.strategy.deleteMany({
      where: {
        OR: [
          { key: { startsWith: prefix } },
          { ownerUserId: { in: [alice.id, bob.id] } },
        ],
      },
    });
    await prisma.fundAssignment.deleteMany({ where: { userId: bob.id } });
    await prisma.orgMembership.deleteMany({ where: { userId: alice.id } });
    await prisma.fund.deleteMany({
      where: { id: { in: [fundA.id, fundB.id] } },
    });
    await prisma.organization.deleteMany({
      where: { id: { in: [orgA.id, orgB.id] } },
    });
    await prisma.user.deleteMany({ where: { id: { in: [alice.id, bob.id] } } });
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

/**
 * Round-trips one Follow and one DeskDecision through the generated GraphQL
 * resolvers against a real Postgres built from the migration history.
 *
 * The schema is assembled as src/server.ts assembles it (generated resolvers
 * minus server-only models, residual surface stripped) and each operation is
 * executed with `graphql()` and a Prisma client in the context, so the path
 * under test is the generated resolver → Prisma → the migrated tables. Rows it
 * seeds and creates are removed before it exits.
 *
 * Needs `DESK_IT_DATABASE_URL` pointing at a disposable database the
 * migrations have been applied to. Runs out of process under ts-node because
 * the generated resolvers need `emitDecoratorMetadata` (see
 * src/middleware/__tests__/ts-node-harness.ts). Output is printed between
 * `<<<RESULTS>>>` and `<<<END>>>`.
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

/** One executed operation: its data, or its error messages. */
interface StepResult {
  data: unknown;
  errors: string[];
}

async function run(
  schema: GraphQLSchema,
  prisma: PrismaClient,
  source: string,
  variableValues: Record<string, unknown>
): Promise<StepResult> {
  const result = await graphql({
    schema,
    source,
    variableValues,
    contextValue: { prisma },
  });
  return {
    data: result.data ?? null,
    errors: (result.errors ?? []).map((error) => error.message),
  };
}

async function main(): Promise<void> {
  const url = process.env.DESK_IT_DATABASE_URL;
  if (!url) throw new Error('DESK_IT_DATABASE_URL is not set');
  const prisma = new PrismaClient({ datasourceUrl: url });

  const schema = withoutServerOnlySchemaSurface(
    await buildSchema({
      resolvers: withoutServerOnlyResolvers(resolvers),
      validate: false,
    })
  );

  const tag = randomUUID().slice(0, 8);
  const user = await prisma.user.create({ data: { email: `desk-it-${tag}@example.test` } });
  const org = await prisma.organization.create({
    data: { name: `Desk IT ${tag}`, slug: `desk-it-${tag}` },
  });
  const fund = await prisma.fund.create({
    data: { name: 'Desk IT fund', slug: `desk-it-${tag}`, organizationId: org.id },
  });
  const account = await prisma.alpacaAccount.create({
    data: { userId: user.id, APIKey: 'desk-it-key', APISecret: 'desk-it-secret' },
  });

  const steps: Record<string, StepResult> = {};
  try {
    steps.followCreate = await run(
      schema,
      prisma,
      `mutation ($data: FollowCreateInput!) {
        createOneFollow(data: $data) { id userId fundId targetKind targetId level riskBudgetPctNav }
      }`,
      {
        data: {
          user: { connect: { id: user.id } },
          fund: { connect: { id: fund.id } },
          targetKind: 'asset',
          targetId: 'NVDA',
          level: 1,
        },
      }
    );
    const followId = (steps.followCreate.data as { createOneFollow?: { id: string } } | null)
      ?.createOneFollow?.id;
    steps.followRead = await run(
      schema,
      prisma,
      `query ($id: String!) { follow(where: { id: $id }) { id targetId level } }`,
      { id: followId }
    );
    steps.followUpdate = await run(
      schema,
      prisma,
      `mutation ($id: String!) {
        updateOneFollow(where: { id: $id }, data: { level: { set: 2 } }) { id level }
      }`,
      { id: followId }
    );
    steps.followDelete = await run(
      schema,
      prisma,
      `mutation ($id: String!) { deleteOneFollow(where: { id: $id }) { id } }`,
      { id: followId }
    );
    steps.followGone = await run(
      schema,
      prisma,
      `query ($id: String!) { follow(where: { id: $id }) { id } }`,
      { id: followId }
    );
    // The level CHECK constraint: a level outside 0..2 is refused by Postgres.
    steps.followLevelOutOfRange = await run(
      schema,
      prisma,
      `mutation ($data: FollowCreateInput!) { createOneFollow(data: $data) { id } }`,
      {
        data: {
          user: { connect: { id: user.id } },
          fund: { connect: { id: fund.id } },
          targetKind: 'event',
          targetId: 'E-1',
          level: 3,
        },
      }
    );

    steps.decisionCreate = await run(
      schema,
      prisma,
      `mutation ($data: DeskDecisionCreateInput!) {
        createOneDeskDecision(data: $data) {
          id fundId accountId kind ruleId desk question nums counterCase ifIdle facets
          dueAt defaultAction amendLabel reasonRequired status decidedBy decidedAt reason
        }
      }`,
      {
        data: {
          fund: { connect: { id: fund.id } },
          account: { connect: { id: account.id } },
          kind: 'order_approval',
          ruleId: 'R-01',
          desk: 'event',
          question: 'Approve the NVDA entry above the notify bucket?',
          nums: [{ label: 'Size', value: '1.2% NAV' }],
          counterCase: 'Earnings in two sessions.',
          ifIdle: 'The order is declined.',
          facets: { tier: 'approve' },
          dueAt: '2026-11-14T15:00:00.000Z',
          defaultAction: 'decline',
          reasonRequired: true,
        },
      }
    );
    const decisionId = (
      steps.decisionCreate.data as { createOneDeskDecision?: { id: string } } | null
    )?.createOneDeskDecision?.id;
    steps.decisionOpenByIndex = await run(
      schema,
      prisma,
      `query ($fundId: String!) {
        deskDecisions(where: { fundId: { equals: $fundId }, status: { equals: open } }, orderBy: [{ dueAt: asc }]) { id status }
      }`,
      { fundId: fund.id }
    );
    steps.decisionUpdate = await run(
      schema,
      prisma,
      `mutation ($id: String!) {
        updateOneDeskDecision(
          where: { id: $id }
          data: {
            status: { set: approved }
            decidedBy: { set: "${user.id}" }
            decidedAt: { set: "2026-11-14T14:30:00.000Z" }
            reason: { set: "Within the event budget." }
          }
        ) { id status decidedBy decidedAt reason }
      }`,
      { id: decisionId }
    );
    steps.decisionDelete = await run(
      schema,
      prisma,
      `mutation ($id: String!) { deleteOneDeskDecision(where: { id: $id }) { id } }`,
      { id: decisionId }
    );
    steps.decisionGone = await run(
      schema,
      prisma,
      `query ($id: String!) { deskDecision(where: { id: $id }) { id } }`,
      { id: decisionId }
    );
  } finally {
    await prisma.follow.deleteMany({ where: { fundId: fund.id } });
    await prisma.deskDecision.deleteMany({ where: { fundId: fund.id } });
    await prisma.alpacaAccount.delete({ where: { id: account.id } });
    await prisma.fund.delete({ where: { id: fund.id } });
    await prisma.organization.delete({ where: { id: org.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  }

  process.stdout.write(
    `<<<RESULTS>>>${JSON.stringify({ ids: { userId: user.id, fundId: fund.id, accountId: account.id }, steps })}<<<END>>>\n`
  );
}

main().catch((error: unknown) => {
  process.stderr.write(`harness failed: ${String(error)}\n`);
  process.exit(1);
});

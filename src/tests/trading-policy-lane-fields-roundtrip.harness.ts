/**
 * Exercises the TradingPolicy lane-preferences carrier against a real Postgres
 * built from the migration history: a policy created without it reads back
 * null (disarmed) through the generated GraphQL resolvers, a written value
 * round-trips, it can be set to armed:false and cleared back to null, and the
 * migration's own SQL runs down and up again inside a transaction that is
 * rolled back, leaving the database as it was.
 *
 * Assembled like `desk-attribution-roundtrip.harness.ts`. Needs
 * `LANE_IT_DATABASE_URL` pointing at a disposable migrated database. Output is
 * printed between `<<<RESULTS>>>` and `<<<END>>>`; seeded rows are removed.
 */
import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Prisma, PrismaClient } from '@prisma/client';
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

/** What the column catalogue and the seeded row looked like at one point of the down/up run. */
interface CatalogueSnapshot {
  columns: Array<{ column_name: string; is_nullable: string; column_default: string | null }>;
  row: Record<string, unknown> | null;
}

const MIGRATION_SQL = join(
  __dirname,
  '..',
  '..',
  'prisma',
  'migrations',
  '20261121130000_trading_policy_lane_fields',
  'migration.sql'
);

const DOWN_SQL = `ALTER TABLE "trading_policies" DROP COLUMN "intradayLanePrefs"`;

const LANE_COLUMNS = `('intradayLanePrefs')`;

const POLICY_FIELDS = 'id intradayLanePrefs maxOpenPositions';

/** Arms the seeded row inside the transaction, so the down limb has a value to drop. */
const ARM_ROW_SQL = `UPDATE trading_policies SET "intradayLanePrefs" = '{"armed": true}'::jsonb WHERE id = $1::uuid`;

/** Raised to roll the down/up transaction back once its snapshots are taken. */
class RollbackSignal extends Error {}

async function run(
  schema: GraphQLSchema,
  prisma: PrismaClient,
  source: string,
  variableValues: Record<string, unknown> = {}
): Promise<StepResult> {
  const result = await graphql({ schema, source, variableValues, contextValue: { prisma } });
  return {
    data: result.data ?? null,
    errors: (result.errors ?? []).map((error) => error.message),
  };
}

async function snapshot(tx: Prisma.TransactionClient, policyId: string): Promise<CatalogueSnapshot> {
  const columns = await tx.$queryRawUnsafe<CatalogueSnapshot['columns']>(
    `SELECT column_name, is_nullable, column_default FROM information_schema.columns
     WHERE table_name = 'trading_policies' AND column_name IN ${LANE_COLUMNS} ORDER BY column_name`
  );
  const rows = await tx.$queryRawUnsafe<Array<{ row: Record<string, unknown> }>>(
    `SELECT row_to_json(t) AS row FROM trading_policies t WHERE id = $1::uuid`,
    policyId
  );
  return { columns, row: rows[0]?.row ?? null };
}

async function main(): Promise<void> {
  const url = process.env.LANE_IT_DATABASE_URL;
  if (!url) throw new Error('LANE_IT_DATABASE_URL is not set');
  const prisma = new PrismaClient({ datasourceUrl: url });
  const schema = withoutServerOnlySchemaSurface(
    await buildSchema({ resolvers: withoutServerOnlyResolvers(resolvers), validate: false })
  );

  const tag = randomUUID().slice(0, 8);
  const user = await prisma.user.create({ data: { email: `lane-${tag}@example.invalid` } });
  const account = await prisma.alpacaAccount.create({
    data: { userId: user.id, APIKey: `k-${tag}`, APISecret: `s-${tag}` },
  });
  const steps: Record<string, StepResult> = {};
  const downUp: Record<string, CatalogueSnapshot> = {};

  try {
    steps.created = await run(
      schema,
      prisma,
      `mutation ($data: TradingPolicyCreateInput!) { createOneTradingPolicy(data: $data) { ${POLICY_FIELDS} } }`,
      { data: { alpacaAccount: { connect: { id: account.id } }, maxOpenPositions: 7 } }
    );
    const policyId = (steps.created.data as { createOneTradingPolicy?: { id: string } } | null)
      ?.createOneTradingPolicy?.id;
    if (!policyId) throw new Error(`policy create failed: ${steps.created.errors.join('; ')}`);

    const UPDATE = `mutation ($id: String!, $data: TradingPolicyUpdateInput!) {
      updateOneTradingPolicy(where: { id: $id }, data: $data) { ${POLICY_FIELDS} }
    }`;
    steps.armed = await run(schema, prisma, UPDATE, {
      id: policyId,
      data: { intradayLanePrefs: { armed: true, perLaneTradesPerDay: 4 } },
    });
    steps.cleared = await run(schema, prisma, UPDATE, {
      id: policyId,
      data: { intradayLanePrefs: { armed: false } },
    });
    // The generated update input types a Json? field as InputJsonValue; this
    // proves a GraphQL null still clears the carrier, so an operator can
    // disarm by unsetting it rather than only by writing armed: false.
    steps.prefsNull = await run(schema, prisma, UPDATE, { id: policyId, data: { intradayLanePrefs: null } });

    const up = readFileSync(MIGRATION_SQL, 'utf8');
    await prisma
      .$transaction(async (tx) => {
        await tx.$executeRawUnsafe(ARM_ROW_SQL, policyId);
        downUp.before = await snapshot(tx, policyId);
        await tx.$executeRawUnsafe(DOWN_SQL);
        downUp.down = await snapshot(tx, policyId);
        await tx.$executeRawUnsafe(up);
        downUp.up = await snapshot(tx, policyId);
        throw new RollbackSignal('roll back the down/up run');
      })
      .catch((error: unknown) => {
        if (!(error instanceof RollbackSignal)) throw error;
      });
    downUp.afterRollback = await snapshot(prisma, policyId);
  } finally {
    await prisma.tradingPolicy.deleteMany({ where: { alpacaAccountId: account.id } });
    await prisma.alpacaAccount.delete({ where: { id: account.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  }

  process.stdout.write(`<<<RESULTS>>>${JSON.stringify({ tag, steps, downUp })}<<<END>>>\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`harness failed: ${String(error)}\n`);
  process.exit(1);
});

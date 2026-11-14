/**
 * Exercises the desk attribution and ledger fields through the generated
 * GraphQL resolvers against a real Postgres built from the migration history:
 * `Strategy.desk`, the `MandateRule` machine keys and their CHECK and unique
 * constraints, and the `AuditLog` ledger sequence with a `before` page.
 *
 * Assembled like `desk-models-roundtrip.harness.ts` (the schema src/server.ts
 * serves, executed with `graphql()` and a Prisma client in the context). Needs
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

/** One executed operation: its data, or its error messages. */
interface StepResult {
  data: unknown;
  errors: string[];
}

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

/** A MandateRule create payload on a version, with overrides. */
function rule(versionId: string, overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    mandateVersion: { connect: { id: versionId } },
    label: 'Gross',
    detail: 'Gross leverage stays at or under 2.0x.',
    ...overrides,
  };
}

const CREATE_RULE = `mutation ($data: MandateRuleCreateInput!) {
  createOneMandateRule(data: $data) { id ruleCode metricKey action group threshold }
}`;

const CREATE_AUDIT = `mutation ($data: AuditLogCreateInput!) {
  createOneAuditLog(data: $data) { id fundId ledgerSeq }
}`;

async function main(): Promise<void> {
  const url = process.env.DESK_IT_DATABASE_URL;
  if (!url) throw new Error('DESK_IT_DATABASE_URL is not set');
  const prisma = new PrismaClient({ datasourceUrl: url });
  const schema = withoutServerOnlySchemaSurface(
    await buildSchema({ resolvers: withoutServerOnlyResolvers(resolvers), validate: false })
  );

  const tag = randomUUID().slice(0, 8);
  const fundId = randomUUID();
  const org = await prisma.organization.create({
    data: { name: `Desk attr ${tag}`, slug: `desk-attr-${tag}` },
  });
  const mandate = await prisma.mandate.create({
    data: { klass: 'STRATEGY_CHARTER', name: `Charter ${tag}`, organizationId: org.id },
  });
  const v1 = await prisma.mandateVersion.create({
    data: { mandateId: mandate.id, versionLabel: 'v1', versionSeq: 1 },
  });
  const v2 = await prisma.mandateVersion.create({
    data: { mandateId: mandate.id, versionLabel: 'v2', versionSeq: 2 },
  });

  const steps: Record<string, StepResult> = {};
  try {
    steps.strategyAssigned = await run(
      schema,
      prisma,
      `mutation ($data: StrategyCreateInput!) { createOneStrategy(data: $data) { id key desk } }`,
      { data: { key: `desk-attr-${tag}-a`, displayName: 'Assigned', desk: 'THEMATIC' } }
    );
    steps.strategyUnassigned = await run(
      schema,
      prisma,
      `mutation ($data: StrategyCreateInput!) { createOneStrategy(data: $data) { id key desk } }`,
      { data: { key: `desk-attr-${tag}-u`, displayName: 'Unassigned' } }
    );
    steps.strategiesOnDesk = await run(
      schema,
      prisma,
      `query ($prefix: String!) {
        strategies(where: { key: { startsWith: $prefix }, desk: { equals: THEMATIC } }) { key desk }
      }`,
      { prefix: `desk-attr-${tag}` }
    );

    steps.ruleMeasured = await run(schema, prisma, CREATE_RULE, {
      data: rule(v1.id, {
        ruleCode: 'R-01',
        metricKey: 'GROSS_LEVERAGE',
        action: 'BLOCK',
        group: 'EXPOSURE',
        threshold: 2,
        limitKind: 'MAX',
      }),
    });
    steps.ruleQualitative = await run(schema, prisma, CREATE_RULE, {
      data: rule(v1.id, { label: 'Conduct', detail: 'No trading on material non-public information.' }),
    });
    steps.ruleMetricWithoutThreshold = await run(schema, prisma, CREATE_RULE, {
      data: rule(v1.id, { ruleCode: 'R-02', metricKey: 'DRAWDOWN', action: 'HALT', group: 'LOSS' }),
    });
    steps.ruleMetricWithoutCode = await run(schema, prisma, CREATE_RULE, {
      data: rule(v1.id, { metricKey: 'VAR_95', action: 'ESCALATE', group: 'LOSS', threshold: 18000 }),
    });
    steps.ruleBlankCode = await run(schema, prisma, CREATE_RULE, {
      data: rule(v1.id, { ruleCode: '  ' }),
    });
    steps.ruleDuplicateCode = await run(schema, prisma, CREATE_RULE, {
      data: rule(v1.id, { ruleCode: 'R-01' }),
    });
    steps.ruleSameCodeOtherVersion = await run(schema, prisma, CREATE_RULE, {
      data: rule(v2.id, {
        ruleCode: 'R-01',
        metricKey: 'GROSS_LEVERAGE',
        action: 'BLOCK',
        group: 'EXPOSURE',
        threshold: 1.5,
      }),
    });

    const audit = (recordId: string): Record<string, unknown> => ({
      data: { operationType: 'UPDATE', modelName: 'Order', recordId, changedFields: {}, fundId },
    });
    steps.ledgerFirst = await run(schema, prisma, CREATE_AUDIT, audit(`${tag}-1`));
    steps.ledgerSecond = await run(schema, prisma, CREATE_AUDIT, audit(`${tag}-2`));
    steps.ledgerThird = await run(schema, prisma, CREATE_AUDIT, audit(`${tag}-3`));
    steps.ledgerCallerSuppliedSeq = await run(
      schema,
      prisma,
      `mutation { createOneAuditLog(data: { operationType: UPDATE, modelName: "Order", recordId: "${tag}-x", changedFields: {}, ledgerSeq: 1 }) { id } }`
    );
    const third = (steps.ledgerThird.data as { createOneAuditLog?: { ledgerSeq: string | number } } | null)
      ?.createOneAuditLog?.ledgerSeq;
    steps.ledgerPageBefore = await run(
      schema,
      prisma,
      `query ($fundId: String!, $before: BigInt!) {
        auditLogs(
          where: { fundId: { equals: $fundId }, ledgerSeq: { lt: $before } }
          orderBy: [{ ledgerSeq: { sort: desc } }]
          take: 1
        ) { recordId ledgerSeq }
      }`,
      { fundId, before: third }
    );
  } finally {
    await prisma.auditLog.deleteMany({ where: { recordId: { startsWith: tag } } });
    await prisma.strategy.deleteMany({ where: { key: { startsWith: `desk-attr-${tag}` } } });
    await prisma.mandate.delete({ where: { id: mandate.id } });
    await prisma.organization.delete({ where: { id: org.id } });
    await prisma.$disconnect();
  }

  process.stdout.write(`<<<RESULTS>>>${JSON.stringify({ tag, steps })}<<<END>>>\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`harness failed: ${String(error)}\n`);
  process.exit(1);
});

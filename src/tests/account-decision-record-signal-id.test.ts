import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';
import { getDMMF } from '@prisma/internals';
import type { DMMF } from '@prisma/generator-helper';
import { ApolloClient, ApolloLink, InMemoryCache, Observable } from '@apollo/client/core';
import type { FetchResult, NormalizedCacheObject, Operation } from '@apollo/client/core';
import { Kind } from 'graphql';
import type { DocumentNode, SelectionSetNode } from 'graphql';
import { AccountDecisionRecord } from '../AccountDecisionRecord';
import type { AccountDecisionRecord as AccountDecisionRecordModel } from '../generated/typegraphql-prisma/models/AccountDecisionRecord';
import { AccountDecisionRecord as generatedSelectionSet } from '../generated/selectionSets/AccountDecisionRecord';

/**
 * `AccountDecisionRecord.signalId` is the key that joins a per-account decision
 * to the firm-level signal it evaluated, and through `Trade.signalId` to any
 * trade opened from that signal. A column is only a join if every layer between
 * the writer and the reader carries it, so each layer is pinned here:
 *
 * 1. Schema: optional and defaultless — a decision whose originating signal
 *    could not be resolved stores NULL, never a placeholder that joins nothing.
 *    Not GQL/TYPESTRING-skipped: a skip removes the field from every generated
 *    selection set and silently blinds every consumer. Indexed on its own so the
 *    signal-to-decision join is not a table scan.
 * 2. Migration: exactly one nullable ADD COLUMN and one index; no default, no
 *    backfill, no unrelated statement riding along.
 * 3. Generated selection set: requests the field.
 * 4. The committed CRUD client — the code path the engine's decision writer
 *    calls: `create` sends the field and every read selects it back.
 */

const ROOT = join(__dirname, '..', '..');
const SCHEMA_PATH = join(ROOT, 'prisma', 'schema.prisma');
const MIGRATION_PATH = join(
  ROOT,
  'prisma',
  'migrations',
  '20260912180625_add_account_decision_record_signal_id',
  'migration.sql',
);

const MODEL = 'AccountDecisionRecord';
const FIELD = 'signalId';
const SIGNAL_ID = 'sig-7f3c2a91';

let datamodel: DMMF.Datamodel;

/**
 * Look up a field on the model, failing loudly when absent.
 *
 * @param fieldName - Field name on AccountDecisionRecord.
 * @returns The field node.
 */
function field(fieldName: string): DMMF.Field {
  const model = datamodel.models.find((m) => m.name === MODEL);
  if (!model) throw new Error(`model ${MODEL} is missing from schema.prisma`);
  const found = model.fields.find((f) => f.name === fieldName);
  if (!found) throw new Error(`${MODEL}.${fieldName} is missing from schema.prisma`);
  return found;
}

/**
 * Executable statements of the migration: `--` comment lines stripped (the
 * header prose names the very things asserted absent), split on `;`,
 * whitespace-normalised, empties dropped.
 *
 * @returns One entry per SQL statement.
 */
function migrationStatements(): string[] {
  return readFileSync(MIGRATION_PATH, 'utf8')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n')
    .split(';')
    .map((statement) => statement.replace(/\s+/g, ' ').trim())
    .filter((statement) => statement.length > 0);
}

/**
 * Field names requested directly under a root field of an operation.
 *
 * @param document - The GraphQL operation document sent over the link.
 * @param rootField - The root field whose selection set is inspected.
 * @returns The selected field names, in document order.
 */
function selectedFields(document: DocumentNode, rootField: string): string[] {
  for (const definition of document.definitions) {
    if (definition.kind !== Kind.OPERATION_DEFINITION) continue;
    for (const selection of definition.selectionSet.selections) {
      if (selection.kind === Kind.FIELD && selection.name.value === rootField) {
        const inner: SelectionSetNode | undefined = selection.selectionSet;
        if (!inner) return [];
        return inner.selections.flatMap((s) => (s.kind === Kind.FIELD ? [s.name.value] : []));
      }
    }
  }
  throw new Error(`root field ${rootField} is not present in the operation`);
}

/**
 * A decision row as the engine writer shapes it, carrying a resolved signal id.
 *
 * @returns A fully populated AccountDecisionRecord model value.
 */
function decisionRow(): AccountDecisionRecordModel {
  const now = new Date('2026-01-05T15:00:00.000Z');
  return {
    id: '0f1e2d3c-4b5a-4968-8776-655443322110',
    alpacaAccountId: 'c26e0915-81f2-4e44-a136-09340bb0ce5e',
    correlationId: 'corr-1',
    opportunityId: 'opp-1',
    signalId: SIGNAL_ID,
    symbol: 'AAPL',
    assetClass: 'equity',
    signalAction: 'BUY',
    signalConfidence: 72,
    decision: 'OPEN_POSITION',
    decisionRationale: 'rationale',
    decisionConfidence: 0.7,
    actionIntents: null,
    validationResults: null,
    executionResults: null,
    effectivePolicySnapshot: { policy: 'snapshot' },
    positionsSnapshot: null,
    openOrdersSnapshot: null,
    exposureSnapshot: null,
    overlaysSnapshot: null,
    modelProvider: 'openai',
    modelId: 'model',
    modelTier: 'normal',
    routingReason: null,
    tokenUsage: null,
    sessionDurationMs: 1200,
    gatingDurationMs: null,
    validationDurationMs: null,
    executionDurationMs: null,
    status: 'COMPLETED',
    createdAt: now,
    updatedAt: now,
  } as AccountDecisionRecordModel;
}

/**
 * A real Apollo client whose terminating link records each operation and
 * answers with a canned payload, so the committed CRUD functions run unmodified
 * with no network.
 *
 * @param respond - Builds the response data for a recorded operation.
 * @returns The client and the list of operations it has sent.
 */
function recordingClient(respond: (operation: Operation) => Record<string, unknown>): {
  client: ApolloClient<NormalizedCacheObject>;
  operations: Operation[];
} {
  const operations: Operation[] = [];
  const link = new ApolloLink(
    (operation) =>
      new Observable<FetchResult>((observer) => {
        operations.push(operation);
        observer.next({ data: respond(operation) });
        observer.complete();
      }),
  );
  return { client: new ApolloClient({ link, cache: new InMemoryCache() }), operations };
}

beforeAll(async () => {
  const parsed = await getDMMF({ datamodel: readFileSync(SCHEMA_PATH, 'utf8') });
  datamodel = parsed.datamodel;
});

describe('AccountDecisionRecord.signalId — schema', () => {
  it('is an optional, defaultless String so an unresolved signal stays NULL', () => {
    const signalId = field(FIELD);
    expect(signalId.type).toBe('String');
    expect(signalId.isRequired).toBe(false);
    expect(signalId.hasDefaultValue).toBe(false);
    expect(signalId.default).toBeUndefined();
  });

  it('is not GQL- or TYPESTRING-skipped, so no generated consumer is blinded', () => {
    const documentation = field(FIELD).documentation ?? '';
    expect(documentation).not.toMatch(/GQL\.SKIP/);
    expect(documentation).not.toMatch(/TYPESTRING\.SKIP/);
  });

  it('has a single-column index so the signal-to-decision join is not a scan', () => {
    const indexed = datamodel.indexes
      .filter((index) => index.model === MODEL && index.type === 'normal')
      .map((index) => index.fields.map((f) => f.name));
    expect(indexed).toContainEqual([FIELD]);
  });
});

describe('AccountDecisionRecord.signalId — migration', () => {
  it('adds one nullable column and one index, with no default and no data movement', () => {
    const statements = migrationStatements();
    expect(statements).toHaveLength(2);
    expect(statements[0]).toMatch(
      /^ALTER TABLE "account_decision_records" ADD COLUMN (IF NOT EXISTS )?"signalId" TEXT$/,
    );
    expect(statements[1]).toMatch(
      /^CREATE INDEX (IF NOT EXISTS )?"account_decision_records_signalId_idx" ON "account_decision_records"\("signalId"\)$/,
    );
    const sql = statements.join(';');
    expect(sql).not.toMatch(/\bDEFAULT\b/i);
    expect(sql).not.toMatch(/\bNOT NULL\b/i);
    expect(sql).not.toMatch(/\b(UPDATE|INSERT|DELETE)\b/i);
    expect(sql).not.toMatch(/\bALTER TYPE\b/i);
  });
});

describe('AccountDecisionRecord.signalId — generated selection set', () => {
  it('requests signalId', () => {
    const fields = generatedSelectionSet.split(/\s+/).filter((token) => token.length > 0);
    expect(fields).toContain(FIELD);
  });
});

describe('AccountDecisionRecord.signalId — committed CRUD client', () => {
  it('create sends signalId in the payload and selects it back', async () => {
    const { client, operations } = recordingClient(() => ({
      createOneAccountDecisionRecord: { ...decisionRow(), __typename: MODEL },
    }));

    const created = await AccountDecisionRecord.create(decisionRow(), client);

    expect(operations).toHaveLength(1);
    const [operation] = operations;
    const data = operation.variables.data as Record<string, unknown>;
    expect(data[FIELD]).toBe(SIGNAL_ID);
    expect(selectedFields(operation.query, 'createOneAccountDecisionRecord')).toContain(FIELD);
    expect(created[FIELD]).toBe(SIGNAL_ID);
  });

  it('findMany filters on signalId and selects it on every returned row', async () => {
    const { client, operations } = recordingClient(() => ({
      accountDecisionRecords: [{ ...decisionRow(), __typename: MODEL }],
    }));

    const rows = await AccountDecisionRecord.findMany(
      { signalId: SIGNAL_ID } as AccountDecisionRecordModel,
      client,
    );

    expect(operations).toHaveLength(1);
    const [operation] = operations;
    const where = operation.variables.where as Record<string, unknown>;
    expect(where[FIELD]).toEqual({ equals: SIGNAL_ID });
    expect(selectedFields(operation.query, 'accountDecisionRecords')).toContain(FIELD);
    expect(rows?.[0]?.[FIELD]).toBe(SIGNAL_ID);
  });
});

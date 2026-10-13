/**
 * Every `AuditLog` write stores its payload with stored-credential values
 * redacted, whoever makes it.
 *
 * Three layers, each proving something the one below it cannot:
 *
 * 1. `redactAuditLogWriteArgs`, pure: which values change and, as importantly,
 *    that everything else is handed on as the very same object.
 * 2. `withAuditLogWriteRedaction` on a real Prisma client that never connects:
 *    a terminal capture extension records what each operation would hand the
 *    query engine, so the test observes the extension on every write
 *    operation Prisma exposes, not just the function it calls.
 * 3. `audit-log-write-redaction.harness.ts`, out of process: the server's own
 *    client singleton from `src/prismaClient.ts` behind the GENERATED AuditLog
 *    resolvers, the mutation-authorization guard and the audit plugin, beside
 *    an unextended client driven with the same scenario. That is what shows
 *    the wiring (both client assignment sites), who can reach each write
 *    mutation, and that the payloads the engine and platform write today reach
 *    the engine byte-identical.
 * 4. The acceptance matrix, through the same harness: every credential shape
 *    (named column, variable-named, nested JSON, inline GraphQL arguments) on
 *    every generated write, both as a credential model's write the audit
 *    plugin records and as a direct AuditLog write, plus credentials nested in
 *    a relation write; and credential-free writes of credential models, which
 *    must store the row main's recorder stored, byte for byte. The harness
 *    derives each expected row from its scenario template, which marks the
 *    credential columns, so the expectation never comes from the redaction
 *    vocabulary under test.
 *
 * No layer contacts a database: the capture returns a synthetic row instead
 * of executing, and the datasource points at a closed local port.
 */
import { Prisma, PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { REDACTED, redactCredentials } from '../../auth/credential-redaction';
import {
  ROW_PAYLOAD_ARGS,
  redactAuditLogWriteArgs,
  withAuditLogWriteRedaction,
} from '../audit-log-write-redaction';
import { runTsNodeHarness } from './ts-node-harness';

// Duplicated from the harness on purpose: importing the harness would run it.
const API_KEY = 'PKAUDITHARNESSKEY0000000';
const API_SECRET = 'audit-harness-secret-that-must-never-persist';
const OAUTH_TOKEN = 'audit-harness-oauth-refresh-token';
const SECRETS = [API_KEY, API_SECRET, OAUTH_TOKEN];
const UNREACHABLE_DATABASE_URL = 'postgresql://harness:harness@127.0.0.1:9/harness';

const CREDENTIAL_CHANGED_FIELDS = {
  where: { id: 'acct-1' },
  data: { APIKey: { set: API_KEY }, APISecret: { set: API_SECRET }, label: { set: 'rotated' } },
};
const CREDENTIAL_METADATA = { source: 'harness', refresh_token: OAUTH_TOKEN, note: 'kept' };

/** The two columns above as they must be stored: only the credential values differ. */
const REDACTED_CHANGED_FIELDS = {
  where: { id: 'acct-1' },
  data: { APIKey: REDACTED, APISecret: REDACTED, label: { set: 'rotated' } },
};
const REDACTED_METADATA = { source: 'harness', refresh_token: REDACTED, note: 'kept' };

const CREDENTIAL_ROW = {
  operationType: 'UPDATE',
  modelName: 'AlpacaAccount',
  recordId: 'acct-1',
  changedFields: CREDENTIAL_CHANGED_FIELDS,
  metadata: CREDENTIAL_METADATA,
} as const;
const PLAIN_ROW = {
  operationType: 'CREATE',
  modelName: 'Order',
  recordId: 'order-2',
  changedFields: { status: 'cancel_requested' },
  metadata: { source: 'harness' },
} as const;

function containsSecret(value: unknown): boolean {
  const serialised = JSON.stringify(value);
  return SECRETS.some((secret) => serialised.includes(secret));
}

/** `leaf` wrapped in `depth` levels of `{ level: … }`. */
function nest(depth: number, leaf: unknown): unknown {
  let value = leaf;
  for (let level = 0; level < depth; level += 1) value = { level: value };
  return value;
}

// -----------------------------------------------------------------------------
// 1. The argument rewrite
// -----------------------------------------------------------------------------

describe('redactAuditLogWriteArgs', () => {
  it('redacts the credential values in a created row and nothing else', () => {
    const args = { data: { ...CREDENTIAL_ROW } };
    const out = redactAuditLogWriteArgs(args);
    expect(out).toEqual({
      data: { ...CREDENTIAL_ROW, changedFields: REDACTED_CHANGED_FIELDS, metadata: REDACTED_METADATA },
    });
    expect(containsSecret(out)).toBe(false);
    // The input is never mutated: the caller's object still holds what it sent.
    expect(args.data.changedFields).toBe(CREDENTIAL_CHANGED_FIELDS);
  });

  it('redacts each credential row of a many-row write and keeps the other rows as the same objects', () => {
    const plain = { ...PLAIN_ROW };
    const out = redactAuditLogWriteArgs({ data: [{ ...CREDENTIAL_ROW }, plain], skipDuplicates: true });
    expect(out.data[0]).toEqual({ ...CREDENTIAL_ROW, changedFields: REDACTED_CHANGED_FIELDS, metadata: REDACTED_METADATA });
    expect(out.data[1]).toBe(plain);
    expect(out.skipDuplicates).toBe(true);
  });

  it('redacts a single-row many-write (`data` as one object)', () => {
    const out = redactAuditLogWriteArgs({ data: { ...CREDENTIAL_ROW } });
    expect(out.data.changedFields).toEqual(REDACTED_CHANGED_FIELDS);
    expect(out.data.metadata).toEqual(REDACTED_METADATA);
  });

  it('redacts both halves of an upsert and leaves its `where` alone', () => {
    const where = { id: 'row-1' };
    const out = redactAuditLogWriteArgs({
      where,
      create: { ...CREDENTIAL_ROW },
      update: { changedFields: CREDENTIAL_CHANGED_FIELDS, metadata: CREDENTIAL_METADATA },
    });
    expect(out.where).toBe(where);
    expect(out.create.changedFields).toEqual(REDACTED_CHANGED_FIELDS);
    expect(out.create.metadata).toEqual(REDACTED_METADATA);
    expect(out.update).toEqual({ changedFields: REDACTED_CHANGED_FIELDS, metadata: REDACTED_METADATA });
  });

  it('stores exactly what the shared redaction contract produces, depth limit included', () => {
    let deep: Record<string, unknown> = { APISecret: API_SECRET };
    for (let level = 0; level < 14; level += 1) deep = { level: deep };
    const changedFields = { shallow: { apiKey: API_KEY }, deep };
    const out = redactAuditLogWriteArgs({ data: { ...PLAIN_ROW, changedFields } });
    expect(out.data.changedFields).toEqual(redactCredentials(changedFields));
    expect(containsSecret(out)).toBe(false);
  });

  it('keeps a null or absent credential visible as null or absent', () => {
    const changedFields = { data: { APISecret: null, apiKey: undefined, label: 'x' } };
    const args = { data: { ...PLAIN_ROW, changedFields } };
    expect(redactAuditLogWriteArgs(args)).toBe(args);
  });

  it("keeps an update's { set: null } credential clear visible, handing the write on as the same object", () => {
    const changedFields = { where: { id: 'ba-1' }, data: { apiKey: { set: null }, apiSecret: { set: null } } };
    const args = { data: { ...PLAIN_ROW, changedFields } };
    expect(redactAuditLogWriteArgs(args)).toBe(args);
  });

  it('replaces what sits 12 or more levels inside a column value, which the redaction cannot inspect, credential or not', () => {
    const LEAF = 'plain-value-without-a-credential';
    const within = { data: { ...PLAIN_ROW, changedFields: { shallow: { note: 'kept' }, deep: nest(10, LEAF) } } };
    expect(redactAuditLogWriteArgs(within)).toBe(within);

    const changedFields = { shallow: { note: 'kept' }, deep: nest(11, LEAF) };
    const past = { data: { ...PLAIN_ROW, changedFields } };
    const out = redactAuditLogWriteArgs(past);
    expect(out).not.toBe(past);
    expect(out.data.changedFields).toEqual({ shallow: { note: 'kept' }, deep: nest(11, REDACTED) });
    expect(JSON.stringify(out)).not.toContain(LEAF);
  });

  it('hands on a write without a credential as the same object', () => {
    const create = { data: { ...PLAIN_ROW } };
    const many = { data: [{ ...PLAIN_ROW }, { ...PLAIN_ROW }] };
    const update = { where: { id: 'row-1' }, data: { metadata: { note: 'x' } } };
    const upsert = { where: { id: 'row-1' }, create: { ...PLAIN_ROW }, update: { metadata: { note: 'x' } } };
    for (const args of [create, many, update, upsert]) expect(redactAuditLogWriteArgs(args)).toBe(args);
  });

  it('hands on Prisma null sentinels and Date values untouched rather than normalising them', () => {
    const args = {
      data: {
        ...PLAIN_ROW,
        timestamp: new Date('2026-09-26T16:00:00.000Z'),
        changedFields: Prisma.JsonNull,
        metadata: Prisma.DbNull,
      },
    };
    const out = redactAuditLogWriteArgs(args);
    expect(out).toBe(args);
    expect(out.data.metadata).toBe(Prisma.DbNull);
    expect(out.data.changedFields).toBe(Prisma.JsonNull);
  });

  it('never rewrites a read or delete, even one whose filter names a credential key', () => {
    const read = { where: { metadata: { equals: { refresh_token: OAUTH_TOKEN } } } };
    const remove = { where: { recordId: 'acct-1' } };
    expect(redactAuditLogWriteArgs(read)).toBe(read);
    expect(redactAuditLogWriteArgs(remove)).toBe(remove);
    expect(redactAuditLogWriteArgs(undefined)).toBeUndefined();
  });

  it('leaves a payload the audit plugin or TradingPolicy trail already redacted exactly as it was', () => {
    const stored = { data: { ...PLAIN_ROW, changedFields: REDACTED_CHANGED_FIELDS, metadata: REDACTED_METADATA } };
    expect(redactAuditLogWriteArgs(stored)).toEqual(stored);
  });
});

// -----------------------------------------------------------------------------
// 2. The client extension, on every Prisma write operation
// -----------------------------------------------------------------------------

interface Captured {
  operation: string;
  args: Record<string, unknown>;
}

/** Record what reaches the engine and return a synthetic result instead of executing. */
function captureLast(client: PrismaClient, sink: Captured[]): PrismaClient {
  return client.$extends({
    query: {
      $allModels: {
        $allOperations({ operation, args }) {
          sink.push({ operation, args: (args ?? {}) as Record<string, unknown> });
          const many = operation.endsWith('AndReturn');
          const count = operation.endsWith('Many');
          return Promise.resolve(many ? [] : count ? { count: 0 } : null);
        },
      },
    },
  }) as unknown as PrismaClient;
}

/** The AuditLog operations that write rows, as the Prisma client names them. */
const WRITE_OPERATIONS = [
  'create',
  'createMany',
  'createManyAndReturn',
  'update',
  'updateMany',
  'updateManyAndReturn',
  'upsert',
] as const;

describe('withAuditLogWriteRedaction', () => {
  let raw: PrismaClient;

  beforeAll(() => {
    raw = new PrismaClient({ datasourceUrl: UNREACHABLE_DATABASE_URL });
  });

  afterAll(async () => {
    await raw.$disconnect();
  });

  /** Run one operation through the extension and return what reached the engine. */
  async function engineArgs(
    run: (client: PrismaClient) => Promise<unknown>,
    extend: (client: PrismaClient) => PrismaClient = withAuditLogWriteRedaction
  ): Promise<Captured> {
    const sink: Captured[] = [];
    await run(captureLast(extend(raw), sink));
    expect(sink).toHaveLength(1);
    return sink[0];
  }

  it('covers every write operation the AuditLog delegate exposes', () => {
    const delegate = raw.auditLog as unknown as Record<string, unknown>;
    const writes = Object.keys(delegate).filter(
      (op) => /^(create|update|upsert)/.test(op) && typeof delegate[op] === 'function'
    );
    // A new write operation must be checked against ROW_PAYLOAD_ARGS and added
    // to the cases below before this passes.
    expect(writes.sort()).toEqual([...WRITE_OPERATIONS].sort());
    expect(ROW_PAYLOAD_ARGS).toEqual(['data', 'create', 'update']);
  });

  it('create: redacts the row', async () => {
    const got = await engineArgs((c) => c.auditLog.create({ data: { ...CREDENTIAL_ROW } }));
    expect(got.args).toEqual({ data: { ...CREDENTIAL_ROW, changedFields: REDACTED_CHANGED_FIELDS, metadata: REDACTED_METADATA } });
  });

  it('createMany: redacts every row, as a list or a single object', async () => {
    const list = await engineArgs((c) => c.auditLog.createMany({ data: [{ ...CREDENTIAL_ROW }, { ...PLAIN_ROW }] }));
    expect(list.args).toEqual({
      data: [{ ...CREDENTIAL_ROW, changedFields: REDACTED_CHANGED_FIELDS, metadata: REDACTED_METADATA }, { ...PLAIN_ROW }],
    });
    const single = await engineArgs((c) => c.auditLog.createMany({ data: { ...CREDENTIAL_ROW } }));
    expect(containsSecret(single.args)).toBe(false);
  });

  it('createManyAndReturn: redacts every row', async () => {
    const got = await engineArgs((c) => c.auditLog.createManyAndReturn({ data: [{ ...CREDENTIAL_ROW }] }));
    expect(got.args).toEqual({ data: [{ ...CREDENTIAL_ROW, changedFields: REDACTED_CHANGED_FIELDS, metadata: REDACTED_METADATA }] });
  });

  it('update: redacts the new column values', async () => {
    const got = await engineArgs((c) =>
      c.auditLog.update({ where: { id: 'row-1' }, data: { changedFields: CREDENTIAL_CHANGED_FIELDS, metadata: CREDENTIAL_METADATA } })
    );
    expect(got.args).toEqual({ where: { id: 'row-1' }, data: { changedFields: REDACTED_CHANGED_FIELDS, metadata: REDACTED_METADATA } });
  });

  it('updateMany: redacts the new column values', async () => {
    const got = await engineArgs((c) =>
      c.auditLog.updateMany({ where: { modelName: 'AlpacaAccount' }, data: { changedFields: CREDENTIAL_CHANGED_FIELDS } })
    );
    expect(got.args).toEqual({ where: { modelName: 'AlpacaAccount' }, data: { changedFields: REDACTED_CHANGED_FIELDS } });
  });

  it('updateManyAndReturn: redacts the new column values', async () => {
    const got = await engineArgs((c) =>
      c.auditLog.updateManyAndReturn({ where: { modelName: 'AlpacaAccount' }, data: { metadata: CREDENTIAL_METADATA } })
    );
    expect(got.args).toEqual({ where: { modelName: 'AlpacaAccount' }, data: { metadata: REDACTED_METADATA } });
  });

  it('upsert: redacts both the create and the update row', async () => {
    const got = await engineArgs((c) =>
      c.auditLog.upsert({ where: { id: 'row-1' }, create: { ...CREDENTIAL_ROW }, update: { metadata: CREDENTIAL_METADATA } })
    );
    expect(got.args).toEqual({
      where: { id: 'row-1' },
      create: { ...CREDENTIAL_ROW, changedFields: REDACTED_CHANGED_FIELDS, metadata: REDACTED_METADATA },
      update: { metadata: REDACTED_METADATA },
    });
  });

  it('hands a credential-free write, sentinels and Dates to the engine exactly as the unextended client does', async () => {
    const timestamp = new Date('2026-09-26T16:00:00.000Z');
    const run = (c: PrismaClient): Promise<unknown> =>
      c.auditLog.create({
        data: { ...PLAIN_ROW, timestamp, changedFields: { at: timestamp.toISOString(), n: [1, null] }, metadata: Prisma.DbNull },
      });
    const guarded = await engineArgs(run);
    const unguarded = await engineArgs(run, (c) => c);
    expect(guarded.args).toEqual(unguarded.args);
    const data = guarded.args.data as Record<string, unknown>;
    expect(data.metadata).toBe(Prisma.DbNull);
    expect(data.timestamp).toBeInstanceOf(Date);
  });

  it('leaves reads and deletes alone, whatever their filter names', async () => {
    const where = { metadata: { equals: { refresh_token: OAUTH_TOKEN } } };
    const read = await engineArgs((c) => c.auditLog.findFirst({ where }));
    expect(read.args).toEqual({ where });
    const removed = await engineArgs((c) => c.auditLog.deleteMany({ where: { recordId: 'acct-1' } }));
    expect(removed.args).toEqual({ where: { recordId: 'acct-1' } });
  });

  it('leaves other models alone, credential columns included', async () => {
    const got = await engineArgs((c) =>
      c.alpacaAccount.update({ where: { id: 'acct-1' }, data: { APIKey: { set: API_KEY }, APISecret: { set: API_SECRET } } })
    );
    expect(got.args).toEqual({ where: { id: 'acct-1' }, data: { APIKey: { set: API_KEY }, APISecret: { set: API_SECRET } } });
  });
});

// -----------------------------------------------------------------------------
// 3. The server's own client, behind the generated resolvers
// -----------------------------------------------------------------------------

type Described = unknown;

interface HarnessCapture {
  model: string;
  operation: string;
  args: Described;
  bytes: string;
}

interface HarnessScenario {
  status: number;
  codes: string[];
  errors: string[];
  production: HarnessCapture[];
  unguarded: HarnessCapture[];
}

type CredentialShape = 'named-column' | 'variable-named' | 'nested-json' | 'graphql-args';

interface HarnessMatrixCase {
  path: 'plugin' | 'direct';
  field: string;
  shape: CredentialShape | 'nested-relation';
  model: string;
  operation: string;
  auditType?: 'CREATE' | 'UPDATE';
  expected: unknown;
  query: string;
  result: HarnessScenario;
}

interface HarnessCredentialFreeCase {
  variables: Record<string, unknown>;
  operationType: 'CREATE' | 'UPDATE' | 'DELETE';
  result: HarnessScenario;
}

interface HarnessOutput {
  singletonIsDefaultExport: boolean;
  reconnect: { available: boolean; replaced: boolean; result: HarnessScenario | null };
  results: Record<string, HarnessScenario>;
  matrix: HarnessMatrixCase[];
  credentialFree: Record<string, HarnessCredentialFreeCase>;
}

const HARNESS_TIMEOUT_MS = 240_000;

let harness: HarnessOutput;

function scenario(name: string): HarnessScenario {
  const result = harness.results[name];
  if (!result) throw new Error(`harness produced no result for scenario "${name}"`);
  return result;
}

function auditWrites(captures: HarnessCapture[]): HarnessCapture[] {
  return captures.filter((c) => c.model === 'AuditLog');
}

/** The captured JSON columns of every row a write carried, wherever the operation keeps them. */
function rowsOf(capture: HarnessCapture): Array<Record<string, unknown>> {
  const args = capture.args as Record<string, unknown>;
  const rows: Array<Record<string, unknown>> = [];
  for (const key of ['data', 'create', 'update']) {
    const payload = args[key];
    if (Array.isArray(payload)) rows.push(...(payload as Array<Record<string, unknown>>));
    else if (payload && typeof payload === 'object') rows.push(payload as Record<string, unknown>);
  }
  return rows;
}

beforeAll(async () => {
  harness = await runTsNodeHarness<HarnessOutput>(
    'src/middleware/__tests__/audit-log-write-redaction.harness.ts',
    HARNESS_TIMEOUT_MS
  );
}, HARNESS_TIMEOUT_MS + 10_000);

/** Each generated AuditLog write mutation and the Prisma operation its resolver runs. */
const GRAPHQL_WRITE_OPERATIONS = {
  createOneAuditLog: 'create',
  createManyAuditLog: 'createMany',
  createManyAndReturnAuditLog: 'createManyAndReturn',
  updateOneAuditLog: 'update',
  updateManyAuditLog: 'updateMany',
  upsertOneAuditLog: 'upsert',
} as const;

type GraphqlWrite = keyof typeof GRAPHQL_WRITE_OPERATIONS;

const GRAPHQL_WRITES = Object.keys(GRAPHQL_WRITE_OPERATIONS) as GraphqlWrite[];

describe('generated AuditLog write mutations, through the server client', () => {
  it.each(GRAPHQL_WRITES)('%s: an anonymous caller reaches the resolver under shadow, and the row is stored redacted', (field) => {
    const r = scenario(`gql/${field}/none/shadow`);
    expect(r.status).toBe(200);
    // No AuditLog write the request caused carries a secret, the audit
    // plugin's own row included.
    expect(auditWrites(r.production).length).toBeGreaterThan(0);
    for (const write of auditWrites(r.production)) expect(containsSecret(write.args)).toBe(false);
    // The resolver's own write stores exactly the redacted columns.
    const own = auditWrites(r.production).filter((c) => c.operation === GRAPHQL_WRITE_OPERATIONS[field]);
    expect(own).toHaveLength(1);
    const credentialRows = rowsOf(own[0]).filter((row) => JSON.stringify(row).includes('APIKey'));
    expect(credentialRows.length).toBeGreaterThan(0);
    for (const row of credentialRows) {
      expect(row.changedFields).toEqual(REDACTED_CHANGED_FIELDS);
      expect(row.metadata).toEqual(REDACTED_METADATA);
    }
    // The same scenario through an unextended client carries the secret: the
    // payload reached the write, and only the server client's guard removed it.
    expect(auditWrites(r.unguarded).some((c) => containsSecret(c.args))).toBe(true);
  });

  it.each(GRAPHQL_WRITES)('%s: redacted for the engine service principal too', (field) => {
    const r = scenario(`gql/${field}/server/enforce`);
    expect(r.status).toBe(200);
    expect(auditWrites(r.production).length).toBeGreaterThan(0);
    for (const write of auditWrites(r.production)) expect(containsSecret(write.args)).toBe(false);
  });

  it('a user may create one audit row under enforce, and it is stored redacted', () => {
    const r = scenario('gql/createOneAuditLog/user/enforce');
    expect(r.status).toBe(200);
    const [write] = auditWrites(r.production);
    expect(write.operation).toBe('create');
    expect(rowsOf(write)[0].changedFields).toEqual(REDACTED_CHANGED_FIELDS);
    expect(rowsOf(write)[0].metadata).toEqual(REDACTED_METADATA);
  });

  it.each(GRAPHQL_WRITES.filter((f) => f !== 'createOneAuditLog'))(
    '%s: refused to a user under enforce before anything reaches the engine',
    (field) => {
      const r = scenario(`gql/${field}/user/enforce`);
      expect(r.status).toBe(403);
      expect(r.production).toEqual([]);
    }
  );

  it.each(GRAPHQL_WRITES)('%s: refused to an anonymous caller under enforce', (field) => {
    const r = scenario(`gql/${field}/none/enforce`);
    expect(r.status).toBe(401);
    expect(r.codes).toEqual(['UNAUTHENTICATED']);
    expect(r.production).toEqual([]);
  });
});

describe('server-side writers', () => {
  it.each(['server/audit-plugin', 'server/trading-policy-attempt'])(
    '%s already redacts, and its row reaches the engine byte-identical through the guard',
    (name) => {
      const r = scenario(name);
      const guarded = auditWrites(r.production);
      expect(guarded).toHaveLength(1);
      expect(containsSecret(guarded[0].args)).toBe(false);
      expect(guarded.map((c) => c.bytes)).toEqual(auditWrites(r.unguarded).map((c) => c.bytes));
    }
  );

  it.each(['direct/create', 'direct/createMany-single-row', 'direct/updateManyAndReturn'])(
    '%s: a direct prisma.auditLog write that does not redact is stored redacted',
    (name) => {
      const r = scenario(name);
      expect(r.codes).toEqual([]);
      const [write] = auditWrites(r.production);
      expect(containsSecret(write.args)).toBe(false);
      expect(rowsOf(write)[0].changedFields).toEqual(REDACTED_CHANGED_FIELDS);
      expect(auditWrites(r.unguarded).some((c) => containsSecret(c.args))).toBe(true);
    }
  );
});

describe('writes without a credential are unchanged', () => {
  const unchanged = [
    'consumer/engine/order-cancel',
    'consumer/engine/nav-strike',
    'consumer/engine/nav-execution',
    'consumer/platform/broker-credentials',
    'consumer/platform/auth-event',
    'consumer/platform/kyc-decision',
    'consumer/platform/notification-delivery',
    'consumer/nullable/metadata-null',
    'direct/sentinels',
    'direct/non-json-values',
    'direct/read-filter',
    'direct/deleteMany',
  ];

  it.each(unchanged)('%s reaches the engine byte-identical to the unextended client', (name) => {
    const r = scenario(name);
    expect(r.codes).toEqual([]);
    expect(r.production.length).toBeGreaterThan(0);
    expect(r.production.map((c) => c.bytes)).toEqual(r.unguarded.map((c) => c.bytes));
  });

  it('keeps Prisma sentinels and Dates as sentinels and Dates', () => {
    const [sentinels] = auditWrites(scenario('direct/sentinels').production);
    expect(sentinels.bytes).toContain('{"$sentinel":"DbNull"}');
    expect(sentinels.bytes).toContain('{"$sentinel":"JsonNull"}');
    const [dates] = auditWrites(scenario('direct/non-json-values').production);
    expect(dates.bytes).toContain('"changedFields":{"at":{"$date":"2026-09-26T16:00:00.000Z"}');
  });
});

// -----------------------------------------------------------------------------
// 4. The acceptance matrix: every credential shape on every write
// -----------------------------------------------------------------------------

const SHAPES: readonly CredentialShape[] = ['named-column', 'variable-named', 'nested-json', 'graphql-args'];

/** A credential model's generated writes, each recorded by the audit plugin. */
const PLUGIN_FIELDS = [
  'createOneAlpacaAccount',
  'createManyAlpacaAccount',
  'createManyAndReturnAlpacaAccount',
  'updateOneAlpacaAccount',
  'updateManyAlpacaAccount',
  'upsertOneAlpacaAccount',
] as const;

/** Writes of a model with no credential on its own row, carrying one in a nested relation write. */
const NESTED_RELATION_FIELDS = ['createOneUser', 'updateOneUser', 'upsertOneUser'] as const;

const DIRECT_FIELDS = GRAPHQL_WRITES;

function matrixCase(path: HarnessMatrixCase['path'], field: string, shape: HarnessMatrixCase['shape']): HarnessMatrixCase {
  const found = harness.matrix.filter((c) => c.path === path && c.field === field && c.shape === shape);
  if (found.length !== 1) throw new Error(`harness produced ${found.length} results for ${path} ${field} ${shape}`);
  return found[0];
}

/**
 * The audit plugin's row for another model's write: the credential reached
 * that model's own write, and the audit row records the write's arguments
 * under their schema paths with every credential column redacted.
 */
function expectPluginRow(c: HarnessMatrixCase): void {
  const r = c.result;
  expect(r.status).toBe(200);
  expect(r.errors).toEqual([]);
  // The credential went where it belongs: the model's own write carries it,
  // so the scenario really sent one.
  const modelWrites = r.production.filter((w) => w.model !== 'AuditLog');
  expect(modelWrites.map((w) => `${w.model}.${w.operation}`)).toEqual([`${c.model}.${c.operation}`]);
  expect(containsSecret(modelWrites[0].args)).toBe(true);
  // The audit trail gets exactly one row and no secret, through either
  // client: the recorder redacts it itself, and the guard again.
  for (const captures of [r.production, r.unguarded]) {
    const audits = auditWrites(captures);
    expect(audits.map((w) => w.operation)).toEqual(['create']);
    expect(containsSecret(audits[0].args)).toBe(false);
  }
  const row = (auditWrites(r.production)[0].args as { data: Record<string, unknown> }).data;
  expect(row).toMatchObject({ modelName: c.model, operationType: c.auditType, operationName: c.field });
  expect(row.changedFields).toEqual(c.expected);
}

/**
 * A direct write through a generated AuditLog mutation: the rows reach the
 * write carrying the credential, and the server's client stores each one
 * with every credential column redacted and everything else as sent.
 */
function expectDirectRows(c: HarnessMatrixCase): void {
  const r = c.result;
  expect(r.status).toBe(200);
  expect(r.errors).toEqual([]);
  // Through a client without the guard, the write stores the secret: the
  // payload reached it, and only the server client's guard removes it.
  expect(auditWrites(r.unguarded).some((w) => containsSecret(w.args))).toBe(true);
  // AuditLog writes are not themselves audited, so the resolver's write is
  // the only one, and it stores exactly the redacted rows.
  const writes = auditWrites(r.production);
  expect(writes.map((w) => w.operation)).toEqual([c.operation]);
  expect(containsSecret(writes[0].args)).toBe(false);
  expect(rowsOf(writes[0])).toEqual(c.expected);
}

/** Every (field, shape) pair, as `it.each` tuples. */
function crossShapes(fields: readonly string[]): Array<[string, CredentialShape]> {
  return fields.flatMap((field) => SHAPES.map((shape): [string, CredentialShape] => [field, shape]));
}

describe('every credential shape on every write is stored redacted', () => {
  it.each(crossShapes(PLUGIN_FIELDS))(
    '[plugin] %s · %s: the audit row records it redacted under its schema path',
    (field, shape) => {
      expectPluginRow(matrixCase('plugin', field, shape));
    }
  );

  it.each([...NESTED_RELATION_FIELDS])(
    '[plugin] %s · nested-relation: a credential nested in a relation write is recorded redacted',
    (field) => {
      expectPluginRow(matrixCase('plugin', field, 'nested-relation'));
    }
  );

  it.each(crossShapes(DIRECT_FIELDS))(
    '[direct] %s · %s: every row it writes stores the credential redacted',
    (field, shape) => {
      expectDirectRows(matrixCase('direct', field, shape));
    }
  );

  it('covers every case the harness ran, and nothing it did not', () => {
    const expected = [
      ...PLUGIN_FIELDS.flatMap((field) => SHAPES.map((shape) => `plugin ${field} ${shape}`)),
      ...NESTED_RELATION_FIELDS.map((field) => `plugin ${field} nested-relation`),
      ...DIRECT_FIELDS.flatMap((field) => SHAPES.map((shape) => `direct ${field} ${shape}`)),
    ];
    expect(harness.matrix.map((c) => `${c.path} ${c.field} ${c.shape}`).sort()).toEqual(expected.sort());
  });
});

/**
 * Main's recorder: the request's variables map, cut by operation type. For a
 * document that names each variable after the argument it fills, as the
 * generated client's do, the row this change stores must match it byte for
 * byte.
 */
function variablesMapChangedFields(
  operationType: 'CREATE' | 'UPDATE' | 'DELETE',
  variables: Record<string, unknown>
): Record<string, unknown> {
  const fields =
    operationType === 'CREATE'
      ? { input: variables.data || variables }
      : operationType === 'UPDATE'
        ? { where: variables.where || {}, data: variables.data || {} }
        : { where: variables.where || {} };
  return redactCredentials(fields) as Record<string, unknown>;
}

describe('credential-free writes of credential models are stored byte-identical', () => {
  const FIELDS = [
    'updateOneAlpacaAccount',
    'updateManyAlpacaAccount',
    'createOneUser',
    'upsertOneUser',
    'deleteOneAlpacaAccount',
  ];

  it.each(FIELDS)('[plugin] no credential: %s stores the byte-identical row', (field) => {
    const free = harness.credentialFree[field];
    if (!free) throw new Error(`harness produced no credential-free result for ${field}`);
    expect(free.result.status).toBe(200);
    expect(free.result.errors).toEqual([]);
    const guarded = auditWrites(free.result.production);
    expect(guarded).toHaveLength(1);
    // The persistence guard hands the row on unchanged ...
    expect(guarded.map((w) => w.bytes)).toEqual(auditWrites(free.result.unguarded).map((w) => w.bytes));
    // ... and the recorder stores what main's variables-map recorder stored.
    const row = (guarded[0].args as { data: { changedFields: unknown } }).data;
    expect(JSON.stringify(row.changedFields)).toBe(
      JSON.stringify(variablesMapChangedFields(free.operationType, free.variables))
    );
  });

  it('covers every credential-free write the harness ran', () => {
    expect(Object.keys(harness.credentialFree).sort()).toEqual([...FIELDS].sort());
  });
});

describe('wiring', () => {
  it('the guarded client is the singleton src/prismaClient.ts exports', () => {
    expect(harness.singletonIsDefaultExport).toBe(true);
  });

  it('the client a reconnect installs carries the redaction too', () => {
    expect(harness.reconnect.available).toBe(true);
    expect(harness.reconnect.replaced).toBe(true);
    const result = harness.reconnect.result;
    expect(result).not.toBeNull();
    const [write] = auditWrites(result?.production ?? []);
    expect(containsSecret(write.args)).toBe(false);
    expect(rowsOf(write)[0].changedFields).toEqual(REDACTED_CHANGED_FIELDS);
  });
});

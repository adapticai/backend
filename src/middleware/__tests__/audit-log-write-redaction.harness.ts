/**
 * Out-of-process harness for `audit-log-write-redaction.test.ts`.
 *
 * Answers one question for every way an `AuditLog` row can be written: what
 * reaches Prisma's query engine? It runs each write through the server's own
 * Prisma client — the singleton `src/prismaClient.ts` builds, with every guard
 * that module applies — and through an unextended client, and records the
 * arguments each would hand the engine. A terminal capture extension, applied
 * last so it runs after every production extension, records them and returns
 * a synthetic row instead of executing: no database is ever contacted, and the
 * datasource URL points at a closed local port so an accidental execution
 * fails rather than writes.
 *
 * The write paths it drives:
 *
 * - every generated `AuditLog` write mutation, through the GENERATED resolver
 *   served by a real ApolloServer with the mutation-authorization guard
 *   installed as `server.ts` installs it, across the principal/mode matrix
 *   (so "who can reach this resolver" is observed, not assumed);
 * - the audit plugin (`createAuditLogPlugin`) auditing another model's
 *   mutation, and the TradingPolicy audit trail (`writeAttemptRow`);
 * - direct `prisma.auditLog` writes, including the operations no GraphQL
 *   field exposes (`updateManyAndReturn`, `createMany` with a single row);
 * - the exact payload shapes the engine and platform write today, which must
 *   reach the engine byte-identical through the guarded client;
 * - the acceptance matrix: every credential shape (named column,
 *   variable-named, nested JSON, inline GraphQL arguments) on every generated
 *   write, both as a credential model's write the audit plugin records and as
 *   a direct write through a generated AuditLog mutation, plus credentials
 *   nested in a relation write and credential-free writes of credential
 *   models;
 * - the client `reconnectPrisma()` installs after a failed heartbeat.
 *
 * The generated TypeGraphQL resolvers need `emitDecoratorMetadata`, which
 * vitest's esbuild transform does not emit, hence ts-node. Run directly:
 *   npx ts-node --transpile-only src/middleware/__tests__/audit-log-write-redaction.harness.ts
 */
import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { Prisma, PrismaClient } from '@prisma/client';
import { buildSchema } from 'type-graphql';

import { AlpacaAccountCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/AlpacaAccount/AlpacaAccountCrudResolver';
import { AuditLogCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/AuditLog/AuditLogCrudResolver';
import { UserCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/User/UserCrudResolver';
import { REDACTED } from '../../auth/credential-redaction';
import type { MutationAuthMode } from '../../auth/mutation-authorization';
import type { BackendPrincipal } from '../../auth/token-verifier';
import { createHttpStatusMapperPlugin } from '../../plugins/http-status-mapper';
import { createAuditLogPlugin } from '../audit-logger';
import { installMutationAuthGuard } from '../mutation-auth-guard';
import { writeAttemptRow, type AuditLogWriter, type TradingPolicyAuditEntry } from '../trading-policy-audit';

/**
 * A datasource no query can reach: a closed port on the loopback interface.
 * Set before `prismaClient.ts` is loaded so the singleton it builds points
 * here, whatever DATABASE_URL the parent environment carries.
 */
const UNREACHABLE_DATABASE_URL = 'postgresql://harness:harness@127.0.0.1:9/harness';

export const API_KEY = 'PKAUDITHARNESSKEY0000000';
export const API_SECRET = 'audit-harness-secret-that-must-never-persist';
export const OAUTH_TOKEN = 'audit-harness-oauth-refresh-token';

const U_USER = '11111111-1111-4111-8111-111111111111';
const AUDIT_ROW_ID = '99999999-9999-4999-8999-999999999999';

/** `changedFields` as an AlpacaAccount key rotation records it: the defect's own shape. */
export const CREDENTIAL_CHANGED_FIELDS = {
  where: { id: 'acct-1' },
  data: { APIKey: { set: API_KEY }, APISecret: { set: API_SECRET }, label: { set: 'rotated' } },
};

/** `metadata` carrying an OAuth token next to ordinary context. */
export const CREDENTIAL_METADATA = { source: 'harness', refresh_token: OAUTH_TOKEN, note: 'kept' };

/** A row whose two JSON columns both carry a credential. */
const CREDENTIAL_ROW = {
  operationType: 'UPDATE',
  modelName: 'AlpacaAccount',
  recordId: 'acct-1',
  changedFields: CREDENTIAL_CHANGED_FIELDS,
  metadata: CREDENTIAL_METADATA,
};

/** A row with no credential anywhere, written alongside a credential row. */
const PLAIN_ROW = {
  operationType: 'CREATE',
  modelName: 'Order',
  recordId: 'order-2',
  changedFields: { status: 'cancel_requested' },
  metadata: { source: 'harness' },
};

const PRINCIPALS: Record<string, BackendPrincipal | null> = {
  none: null,
  server: { kind: 'server', sub: 'adaptic-engine:audit-harness' },
  user: { kind: 'user', sub: U_USER, roles: ['user'] },
};

const CREATE_ONE = 'mutation CreateOne($data: AuditLogCreateInput!) { createOneAuditLog(data: $data) { id } }';
const CREATE_MANY =
  'mutation CreateMany($data: [AuditLogCreateManyInput!]!) { createManyAuditLog(data: $data) { count } }';
const CREATE_MANY_AND_RETURN =
  'mutation CreateManyAndReturn($data: [AuditLogCreateManyInput!]!) { createManyAndReturnAuditLog(data: $data) { id } }';
const UPDATE_ONE =
  'mutation UpdateOne($where: AuditLogWhereUniqueInput!, $data: AuditLogUpdateInput!) { updateOneAuditLog(where: $where, data: $data) { id } }';
const UPDATE_MANY =
  'mutation UpdateMany($where: AuditLogWhereInput, $data: AuditLogUpdateManyMutationInput!) { updateManyAuditLog(where: $where, data: $data) { count } }';
const UPSERT_ONE =
  'mutation UpsertOne($where: AuditLogWhereUniqueInput!, $create: AuditLogCreateInput!, $update: AuditLogUpdateInput!) { upsertOneAuditLog(where: $where, create: $create, update: $update) { id } }';
const UPDATE_ACCOUNT_KEYS =
  'mutation RotateKeys($where: AlpacaAccountWhereUniqueInput!, $data: AlpacaAccountUpdateInput!) { updateOneAlpacaAccount(where: $where, data: $data) { id } }';

/** Each generated AuditLog write mutation, carrying credentials in every row it writes. */
export const WRITE_MUTATIONS: Record<string, { query: string; variables: Record<string, unknown> }> = {
  createOneAuditLog: { query: CREATE_ONE, variables: { data: CREDENTIAL_ROW } },
  createManyAuditLog: { query: CREATE_MANY, variables: { data: [CREDENTIAL_ROW, PLAIN_ROW] } },
  createManyAndReturnAuditLog: { query: CREATE_MANY_AND_RETURN, variables: { data: [CREDENTIAL_ROW, PLAIN_ROW] } },
  updateOneAuditLog: {
    query: UPDATE_ONE,
    variables: {
      where: { id: AUDIT_ROW_ID },
      data: { changedFields: CREDENTIAL_CHANGED_FIELDS, metadata: CREDENTIAL_METADATA },
    },
  },
  updateManyAuditLog: {
    query: UPDATE_MANY,
    variables: {
      where: { modelName: { equals: 'AlpacaAccount' } },
      data: { changedFields: CREDENTIAL_CHANGED_FIELDS, metadata: CREDENTIAL_METADATA },
    },
  },
  upsertOneAuditLog: {
    query: UPSERT_ONE,
    variables: {
      where: { id: AUDIT_ROW_ID },
      create: CREDENTIAL_ROW,
      update: { changedFields: CREDENTIAL_CHANGED_FIELDS, metadata: CREDENTIAL_METADATA },
    },
  },
};

/** The principal / mode combinations each write mutation is driven under. */
export const AUTH_MATRIX: Array<{ principal: keyof typeof PRINCIPALS; mode: MutationAuthMode }> = [
  { principal: 'none', mode: 'shadow' },
  { principal: 'none', mode: 'enforce' },
  { principal: 'user', mode: 'enforce' },
  { principal: 'server', mode: 'enforce' },
];

const ISO_NOW = '2026-09-26T16:00:00.000Z';

/**
 * The payloads the engine and platform write today, as they arrive at
 * `/graphql` (the `data` variable of `createOneAuditLog`). None carries a
 * credential, so the guarded client must hand each to the engine unchanged.
 */
export const CONSUMER_PAYLOADS: Record<string, Record<string, unknown>> = {
  // engine src/routes/order-cancel.routes.ts writeCancelAudit()
  'engine/order-cancel': {
    timestamp: ISO_NOW,
    userId: null,
    operationType: 'DELETE',
    modelName: 'Order',
    recordId: 'broker-order-1',
    changedFields: { status: 'cancel_requested' },
    operationName: 'order.cancel',
    ipAddress: null,
    metadata: { accountId: 'acct-1', source: 'engine.order-cancel-route' },
  },
  // engine src/services/fund/nav-strike-audit.ts, the strike row
  'engine/nav-strike': {
    timestamp: ISO_NOW,
    userId: U_USER,
    operationType: 'CREATE',
    modelName: 'FundNavRecord',
    recordId: 'nav-record-1',
    operationName: 'fund.nav.strike',
    changedFields: {
      fundId: 'fund-1',
      periodEnd: '2026-09-25T00:00:00.000Z',
      periodType: 'DAILY',
      valuationAt: ISO_NOW,
      navPerShare: 101.25,
      sharesOutstanding: 1000,
      netAssetValue: 101250,
      totalAssets: 101500,
      totalLiabilities: 250,
      previousNavPerShare: 100,
      highWaterMarkNav: 101.25,
      staleMarkCount: 0,
      calculationMethod: 'MARK_TO_MARKET',
      valuationInputs: {
        accounts: [{ accountId: 'acct-1', equity: 101500, asOf: ISO_NOW, stale: false }],
        holdingsCounted: 3,
        maxMarkAgeMs: 60000,
      },
      executionCount: 1,
      holdingsUpdated: 1,
    },
    ipAddress: null,
    metadata: { idempotencyKey: 'strike-1', replayed: false, correlationId: null, source: 'engine.nav-strike' },
  },
  // engine src/services/fund/nav-strike-audit.ts, one executed movement
  'engine/nav-execution': {
    timestamp: ISO_NOW,
    userId: U_USER,
    operationType: 'UPDATE',
    modelName: 'InvestorTransaction',
    recordId: 'txn-1',
    operationName: 'fund.nav.execute_transaction',
    changedFields: {
      status: 'COMPLETED',
      executionNav: 101.25,
      executedUnits: 9.876,
      netAmount: 1000,
      investorId: 'investor-1',
      type: 'SUBSCRIPTION',
    },
    ipAddress: null,
    metadata: { navRecordId: 'nav-record-1', fundId: 'fund-1', source: 'engine.nav-strike' },
  },
  // platform apps/web/lib/audit/audit-log.ts buildAuditLogInput(), as the broker-credentials route calls it
  'platform/broker-credentials': {
    userId: U_USER,
    operationType: 'CREATE',
    modelName: 'BrokerageAccount',
    recordId: 'fund-1',
    changedFields: { provider: 'ALPACA', accountType: 'PAPER', fundId: 'fund-1' },
    operationName: 'broker_credentials.create',
    ipAddress: '203.0.113.7',
    metadata: {
      outcome: 'success',
      actorUserId: U_USER,
      requestId: 'req-1',
      statusCode: 200,
      method: 'POST',
      path: '/api/broker-credentials',
    },
  },
  // platform apps/web/lib/auth/auth-events.ts persistAuthEvent()
  'platform/auth-event': {
    userId: U_USER,
    operationType: 'CREATE',
    modelName: 'Session',
    recordId: U_USER,
    changedFields: {},
    operationName: 'auth.login_success',
    ipAddress: '203.0.113.7',
    metadata: {
      outcome: 'success',
      actorUserId: U_USER,
      eventType: 'LOGIN_SUCCESS',
      email: 'someone@example.test',
      userAgent: 'Mozilla/5.0',
      provider: 'google',
    },
  },
  // platform apps/web/lib/data-adapters/mutations.ts submitKycDecision()
  'platform/kyc-decision': {
    operationType: 'UPDATE',
    modelName: 'Customer',
    recordId: '42',
    operationName: 'submitKycDecision',
    userId: U_USER,
    changedFields: { amlStatus: { after: 'CLEAR' }, lastKycUpdate: { after: ISO_NOW } },
    metadata: { source: 'adaptic-os-client', kycDecision: 'approve', reason: 'documents verified' },
  },
  // platform apps/web/lib/notifications/dispatcher/process-event.ts writeAuditEntry()
  'platform/notification-delivery': {
    operationType: 'CREATE',
    modelName: 'NotificationDelivery',
    recordId: 'delivery-1',
    changedFields: {
      eventRowId: 'event-1',
      catalogEventId: 'fund.nav.struck',
      recipientUserId: U_USER,
      channel: 'EMAIL',
      templateId: 'fund.nav.struck',
      templateVersion: '2026-09-01',
      status: 'SENT',
    },
    operationName: 'notificationDispatch',
    metadata: { source: 'engine', orgId: 'org-1', fundId: 'fund-1', audiencePolicy: 'fund-investors' },
  },
  // A nullable JSON column sent as null.
  'nullable/metadata-null': {
    operationType: 'CREATE',
    modelName: 'Order',
    recordId: 'order-3',
    changedFields: { status: 'cancel_requested' },
    metadata: null,
  },
};

/** A value in the form it was handed to the engine, with Prisma's non-JSON values tagged. */
type Described = null | boolean | number | string | Described[] | { [key: string]: Described };

function describeValue(value: unknown): Described {
  if (value === undefined) return { $undefined: true };
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return value;
  }
  if (typeof value === 'bigint') return { $bigint: value.toString() };
  if (value === Prisma.DbNull) return { $sentinel: 'DbNull' };
  if (value === Prisma.JsonNull) return { $sentinel: 'JsonNull' };
  if (value === Prisma.AnyNull) return { $sentinel: 'AnyNull' };
  if (value instanceof Date) return { $date: Number.isNaN(value.getTime()) ? 'invalid' : value.toISOString() };
  if (Prisma.Decimal.isDecimal(value)) return { $decimal: value.toFixed() };
  if (Array.isArray(value)) return value.map(describeValue);
  if (typeof value === 'object') {
    const out: { [key: string]: Described } = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) out[key] = describeValue(child);
    return out;
  }
  return { $unserializable: typeof value };
}

/** One operation as the engine would have received it. */
export interface Captured {
  model: string;
  operation: string;
  /** The operation's arguments, described. */
  args: Described;
  /** `JSON.stringify(args)`: the byte-level form compared for identity. */
  bytes: string;
}

function rowsIn(args: Record<string, unknown>): number {
  return Array.isArray(args.data) ? args.data.length : 1;
}

/** A plausible engine result, so resolvers and writers carry on as if the write ran. */
function syntheticResult(operation: string, args: Record<string, unknown>): unknown {
  switch (operation) {
    case 'createMany':
    case 'updateMany':
    case 'deleteMany':
      return { count: rowsIn(args) };
    case 'createManyAndReturn':
    case 'updateManyAndReturn':
      return Array.from({ length: rowsIn(args) }, (_, index) => ({ id: `captured-${index + 1}` }));
    case 'findMany':
      return [];
    case 'findUnique':
    case 'findUniqueOrThrow':
    case 'findFirst':
    case 'findFirstOrThrow':
      return null;
    case 'count':
      return 0;
    default:
      return { id: 'captured-row' };
  }
}

/**
 * Apply the terminal capture. Applied LAST, it runs after every extension the
 * client already carries, so it sees exactly what the engine would; it never
 * calls `query`, so nothing executes.
 */
function withEngineBoundaryCapture(client: PrismaClient, sink: Captured[]): PrismaClient {
  const extended = client.$extends({
    name: 'engine-boundary-capture',
    query: {
      $allModels: {
        $allOperations({ model, operation, args }) {
          const described = describeValue(args);
          sink.push({ model, operation, args: described, bytes: JSON.stringify(described) });
          return Promise.resolve(syntheticResult(operation, (args ?? {}) as Record<string, unknown>));
        },
      },
    },
  });
  return extended as unknown as PrismaClient;
}

/** What one scenario produced through each client. */
export interface ScenarioResult {
  /** HTTP status of the GraphQL response; 0 for a direct write. */
  status: number;
  codes: string[];
  errors: string[];
  /** Operations that reached the engine through the server's guarded client. */
  production: Captured[];
  /** The same scenario through an unextended client: what nothing redacts. */
  unguarded: Captured[];
}

type Runner = (client: PrismaClient) => Promise<{ status: number; codes: string[]; errors: string[] }>;

async function runBoth(guarded: PrismaClient, unguarded: PrismaClient, run: Runner): Promise<ScenarioResult> {
  const production: Captured[] = [];
  const baseline: Captured[] = [];
  const outcome = await run(withEngineBoundaryCapture(guarded, production));
  await run(withEngineBoundaryCapture(unguarded, baseline));
  return { ...outcome, production, unguarded: baseline };
}

function direct(write: (client: PrismaClient) => Promise<unknown>): Runner {
  return async (client) => {
    try {
      await write(client);
      return { status: 0, codes: [], errors: [] };
    } catch (error: unknown) {
      return { status: 0, codes: ['THROWN'], errors: [error instanceof Error ? error.message : String(error)] };
    }
  };
}

/** A TradingPolicy write whose requested change reaches an account's keys. */
const POLICY_ENTRY: TradingPolicyAuditEntry = {
  mutation: 'updateOneTradingPolicy',
  action: 'update',
  nestedPaths: ['data.alpacaAccount'],
  actor: { principalKind: 'server', sub: 'adaptic-engine:audit-harness', email: null, ip: null, userAgent: null, origin: null },
  changeReason: null,
  decision: 'allowed',
  authorizationReason: 'service_principal',
  effectiveMode: 'shadow',
  graphqlOperationName: null,
  requested: { data: { alpacaAccount: { update: { APIKey: { set: API_KEY }, APISecret: { set: API_SECRET } } } } },
  policies: [],
};

// -----------------------------------------------------------------------------
// Acceptance matrix: every credential shape on every write
// -----------------------------------------------------------------------------

/** A credential value, and the variable that carries it when a shape passes credentials by variable. */
class Secret {
  constructor(
    readonly variable: string,
    readonly value: string
  ) {}
}

/** The value of a credential column, whatever it holds: stored as the redaction placeholder. */
class Credential {
  constructor(readonly value: Template) {}
}

/** A JSON value passed as its own `JSON!` variable, as a client sends a JSON column. */
class JsonVariable {
  constructor(
    readonly variable: string,
    readonly value: Template
  ) {}
}

/** An enum value, written bare in a GraphQL literal. */
class EnumValue {
  constructor(readonly name: string) {}
}

/**
 * One write's arguments. Credential columns are marked with {@link Credential},
 * so what a correct row stores is derived from the template alone, never from
 * the redaction vocabulary under test.
 */
type Template =
  | null
  | boolean
  | number
  | string
  | Secret
  | Credential
  | JsonVariable
  | EnumValue
  | Template[]
  | TemplateObject;

interface TemplateObject {
  [key: string]: Template;
}

const KEY = new Secret('k', API_KEY);
const SECRET = new Secret('s', API_SECRET);
const TOKEN = new Secret('t', OAUTH_TOKEN);
const ACCOUNT = 'acct-1';

const cred = (value: Template): Credential => new Credential(value);

/** How a credential reaches the operation. */
export type CredentialShape = 'named-column' | 'variable-named' | 'nested-json' | 'graphql-args';

export const CREDENTIAL_SHAPES: readonly CredentialShape[] = [
  'named-column',
  'variable-named',
  'nested-json',
  'graphql-args',
];

/** A generated write: each argument's GraphQL type and value, in document order. */
interface WriteSpec {
  field: string;
  args: ReadonlyArray<readonly [name: string, type: string, value: Template]>;
  selection: string;
}

/** The value a template stands for, as a request variable carries it. */
function plain(value: Template): unknown {
  if (value instanceof Credential || value instanceof JsonVariable) return plain(value.value);
  if (value instanceof Secret) return value.value;
  if (value instanceof EnumValue) return value.name;
  if (Array.isArray(value)) return value.map(plain);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, plain(child)]));
  }
  return value;
}

/** What a correct audit row stores for a template: every credential column's value replaced. */
function stored(value: Template): unknown {
  if (value instanceof Credential) return REDACTED;
  if (value instanceof JsonVariable) return stored(value.value);
  if (value instanceof Secret) return value.value;
  if (value instanceof EnumValue) return value.name;
  if (Array.isArray(value)) return value.map(stored);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, stored(child)]));
  }
  return value;
}

/** The template as a GraphQL literal, credentials inline or as `$variable` references. */
function render(value: Template, credentials: 'inline' | 'variables'): string {
  if (value instanceof Credential) return render(value.value, credentials);
  if (value instanceof Secret) return credentials === 'inline' ? JSON.stringify(value.value) : `$${value.variable}`;
  if (value instanceof JsonVariable) return `$${value.variable}`;
  if (value instanceof EnumValue) return value.name;
  if (value === null) return 'null';
  if (Array.isArray(value)) return `[${value.map((item) => render(item, credentials)).join(', ')}]`;
  if (typeof value === 'object') {
    const fields = Object.entries(value).map(([key, child]) => `${key}: ${render(child, credentials)}`);
    return `{ ${fields.join(', ')} }`;
  }
  return JSON.stringify(value);
}

/** The variables a rendered template references: credentials (when passed by variable) and JSON values. */
function referencedVariables(
  value: Template,
  credentials: 'inline' | 'variables',
  found: Map<string, { type: string; value: unknown }>
): void {
  if (value instanceof Credential) return referencedVariables(value.value, credentials, found);
  if (value instanceof JsonVariable) {
    found.set(value.variable, { type: 'JSON!', value: plain(value.value) });
    return;
  }
  if (value instanceof Secret) {
    if (credentials === 'variables') found.set(value.variable, { type: 'String!', value: value.value });
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) referencedVariables(item, credentials, found);
    return;
  }
  if (value !== null && typeof value === 'object' && !(value instanceof EnumValue)) {
    for (const child of Object.values(value)) referencedVariables(child, credentials, found);
  }
}

/**
 * The operation that sends `spec` with its credentials in `shape`:
 *
 * - `named-column`: every argument is a variable named after the argument, so
 *   the credential sits under its column name in what the client sends (the
 *   generated client's own documents);
 * - `variable-named`: each credential is its own scalar variable (`$k`, `$s`,
 *   `$t`), named by the operation rather than the schema;
 * - `nested-json`: the spec carries a credential deep inside a JSON value, sent
 *   as a `JSON!` variable, with everything else inline;
 * - `graphql-args`: every value, credentials included, is written inline.
 */
function operationFor(spec: WriteSpec, shape: CredentialShape): { query: string; variables: Record<string, unknown> } {
  if (shape === 'named-column') {
    const declarations = spec.args.map(([name, type]) => `$${name}: ${type}`).join(', ');
    const passed = spec.args.map(([name]) => `${name}: $${name}`).join(', ');
    return {
      query: `mutation NamedColumn(${declarations}) { ${spec.field}(${passed}) ${spec.selection} }`,
      variables: Object.fromEntries(spec.args.map(([name, , value]) => [name, plain(value)])),
    };
  }
  const credentials = shape === 'variable-named' ? 'variables' : 'inline';
  const found = new Map<string, { type: string; value: unknown }>();
  for (const [, , value] of spec.args) referencedVariables(value, credentials, found);
  const declarations = [...found].map(([name, { type }]) => `$${name}: ${type}`);
  const passed = spec.args.map(([name, , value]) => `${name}: ${render(value, credentials)}`).join(', ');
  return {
    query: `mutation Shaped${declarations.length ? `(${declarations.join(', ')})` : ''} { ${spec.field}(${passed}) ${spec.selection} }`,
    variables: Object.fromEntries([...found].map(([name, { value }]) => [name, value])),
  };
}

/** The Prisma operation each generated field runs, and the audit type the plugin records it under. */
const FIELD_OPERATIONS: Record<string, { operation: string; auditType: 'CREATE' | 'UPDATE' }> = {
  createOne: { operation: 'create', auditType: 'CREATE' },
  createMany: { operation: 'createMany', auditType: 'CREATE' },
  createManyAndReturn: { operation: 'createManyAndReturn', auditType: 'CREATE' },
  updateOne: { operation: 'update', auditType: 'UPDATE' },
  updateMany: { operation: 'updateMany', auditType: 'UPDATE' },
  upsertOne: { operation: 'upsert', auditType: 'CREATE' },
};

/** A generated field split into its model, Prisma operation and audit type, longest prefix first. */
function fieldOperation(field: string): { model: string; operation: string; auditType: 'CREATE' | 'UPDATE' } {
  const prefix = Object.keys(FIELD_OPERATIONS)
    .sort((a, b) => b.length - a.length)
    .find((candidate) => field.startsWith(candidate));
  if (!prefix) throw new Error(`no operation for ${field}`);
  return { model: field.slice(prefix.length), ...FIELD_OPERATIONS[prefix] };
}

/** The `changedFields` a correct audit plugin row stores for `spec`: its arguments under their schema paths. */
function expectedPluginChangedFields(spec: WriteSpec): unknown {
  const args = Object.fromEntries(spec.args.map(([name, , value]) => [name, stored(value)]));
  return fieldOperation(spec.field).auditType === 'CREATE'
    ? { input: args.data ?? args }
    : { where: args.where ?? {}, data: args.data ?? {} };
}

/** The rows a correct direct AuditLog write stores for `spec`, in `data`, `create`, `update` order. */
function expectedDirectRows(spec: WriteSpec): unknown[] {
  const args = new Map(spec.args.map(([name, , value]) => [name, stored(value)]));
  return ['data', 'create', 'update'].flatMap((name) => {
    const payload = args.get(name);
    if (payload === undefined) return [];
    return Array.isArray(payload) ? payload : [payload];
  });
}

// --- the credential model the audit plugin records: AlpacaAccount ----------

const ACCOUNT_CREATE: TemplateObject = {
  APIKey: cred(KEY),
  APISecret: cred(SECRET),
  tradeAllocationPct: 7,
  user: { connect: { id: U_USER } },
};
const ACCOUNT_CREATE_MANY_ROW: TemplateObject = {
  APIKey: cred(KEY),
  APISecret: cred(SECRET),
  tradeAllocationPct: 7,
  userId: U_USER,
};
const ACCOUNT_UPDATE: TemplateObject = {
  APIKey: cred({ set: KEY }),
  APISecret: cred({ set: SECRET }),
  tradeAllocationPct: { set: 7 },
};

/**
 * The same row with a JSON column that carries a credential three levels
 * down, next to values that must be kept, when the shape is `nested-json`.
 */
function withNestedJson(row: TemplateObject, shape: CredentialShape): TemplateObject {
  if (shape !== 'nested-json') return row;
  return {
    ...row,
    configuration: new JsonVariable('cfg', {
      broker: { region: 'us-east', auth: { apiSecret: cred(SECRET) } },
      note: 'kept',
    }),
  };
}

const ACCOUNT_WHERE_UNIQUE: TemplateObject = { id: ACCOUNT };
const ACCOUNT_WHERE_MANY: TemplateObject = { userId: { equals: U_USER } };

/** Each audited AlpacaAccount write, per shape. */
const PLUGIN_WRITES: Record<string, (shape: CredentialShape) => WriteSpec> = {
  createOneAlpacaAccount: (shape) => ({
    field: 'createOneAlpacaAccount',
    args: [['data', 'AlpacaAccountCreateInput!', withNestedJson(ACCOUNT_CREATE, shape)]],
    selection: '{ id }',
  }),
  createManyAlpacaAccount: (shape) => ({
    field: 'createManyAlpacaAccount',
    args: [['data', '[AlpacaAccountCreateManyInput!]!', [withNestedJson(ACCOUNT_CREATE_MANY_ROW, shape)]]],
    selection: '{ count }',
  }),
  createManyAndReturnAlpacaAccount: (shape) => ({
    field: 'createManyAndReturnAlpacaAccount',
    args: [['data', '[AlpacaAccountCreateManyInput!]!', [withNestedJson(ACCOUNT_CREATE_MANY_ROW, shape)]]],
    selection: '{ id }',
  }),
  updateOneAlpacaAccount: (shape) => ({
    field: 'updateOneAlpacaAccount',
    args: [
      ['where', 'AlpacaAccountWhereUniqueInput!', ACCOUNT_WHERE_UNIQUE],
      ['data', 'AlpacaAccountUpdateInput!', withNestedJson(ACCOUNT_UPDATE, shape)],
    ],
    selection: '{ id }',
  }),
  updateManyAlpacaAccount: (shape) => ({
    field: 'updateManyAlpacaAccount',
    args: [
      ['where', 'AlpacaAccountWhereInput', ACCOUNT_WHERE_MANY],
      ['data', 'AlpacaAccountUpdateManyMutationInput!', withNestedJson(ACCOUNT_UPDATE, shape)],
    ],
    selection: '{ count }',
  }),
  upsertOneAlpacaAccount: (shape) => ({
    field: 'upsertOneAlpacaAccount',
    args: [
      ['where', 'AlpacaAccountWhereUniqueInput!', ACCOUNT_WHERE_UNIQUE],
      ['create', 'AlpacaAccountCreateInput!', withNestedJson(ACCOUNT_CREATE, shape)],
      ['update', 'AlpacaAccountUpdateInput!', withNestedJson(ACCOUNT_UPDATE, shape)],
    ],
    selection: '{ id }',
  }),
};

/** A credential nested in a relation write of a model that holds none on the row itself. */
const NESTED_RELATION_WRITES: Record<string, WriteSpec> = {
  createOneUser: {
    field: 'createOneUser',
    args: [['data', 'UserCreateInput!', { name: 'harness user', alpacaAccounts: { create: [{ APIKey: cred(KEY), APISecret: cred(SECRET) }] } }]],
    selection: '{ id }',
  },
  updateOneUser: {
    field: 'updateOneUser',
    args: [
      ['where', 'UserWhereUniqueInput!', { id: U_USER }],
      ['data', 'UserUpdateInput!', { alpacaAccounts: { update: [{ where: { id: ACCOUNT }, data: { APIKey: cred({ set: KEY }), APISecret: cred({ set: SECRET }) } }] } }],
    ],
    selection: '{ id }',
  },
  upsertOneUser: {
    field: 'upsertOneUser',
    args: [
      ['where', 'UserWhereUniqueInput!', { id: U_USER }],
      ['create', 'UserCreateInput!', { name: 'harness user', alpacaAccounts: { create: [{ APIKey: cred(KEY), APISecret: cred(SECRET) }] } }],
      ['update', 'UserUpdateInput!', { alpacaAccounts: { create: [{ APIKey: cred(KEY), APISecret: cred(SECRET) }] } }],
    ],
    selection: '{ id }',
  },
};

/**
 * Credential-free writes of credential models, sent as the generated client
 * sends them (each variable named after its argument). Main's recorder stored
 * the variables map; these rows must be byte-identical to that.
 */
export const CREDENTIAL_FREE_WRITES: Record<string, { query: string; variables: Record<string, unknown>; operationType: 'CREATE' | 'UPDATE' | 'DELETE' }> = {
  updateOneAlpacaAccount: {
    query: 'mutation updateOneAlpacaAccount($data: AlpacaAccountUpdateInput!, $where: AlpacaAccountWhereUniqueInput!) { updateOneAlpacaAccount(data: $data, where: $where) { id } }',
    variables: { where: { id: ACCOUNT }, data: { tradeAllocationPct: { set: 7 }, autoAllocation: { set: false } } },
    operationType: 'UPDATE',
  },
  updateManyAlpacaAccount: {
    query: 'mutation updateManyAlpacaAccount($data: AlpacaAccountUpdateManyMutationInput!, $where: AlpacaAccountWhereInput) { updateManyAlpacaAccount(data: $data, where: $where) { count } }',
    variables: { where: { userId: { equals: U_USER } }, data: { realTime: { set: true } } },
    operationType: 'UPDATE',
  },
  createOneUser: {
    query: 'mutation createOneUser($data: UserCreateInput!) { createOneUser(data: $data) { id } }',
    variables: { data: { name: 'harness user', bio: 'no credential here' } },
    operationType: 'CREATE',
  },
  upsertOneUser: {
    query: 'mutation upsertOneUser($where: UserWhereUniqueInput!, $create: UserCreateInput!, $update: UserUpdateInput!) { upsertOneUser(where: $where, create: $create, update: $update) { id } }',
    variables: { where: { id: U_USER }, create: { name: 'harness user' }, update: { name: { set: 'renamed' } } },
    operationType: 'CREATE',
  },
  deleteOneAlpacaAccount: {
    query: 'mutation deleteOneAlpacaAccount($where: AlpacaAccountWhereUniqueInput!) { deleteOneAlpacaAccount(where: $where) { id } }',
    variables: { where: { id: ACCOUNT } },
    operationType: 'DELETE',
  },
};

// --- direct writes through the generated AuditLog mutations ------------------

/** An audit row whose JSON columns carry credentials under their own names. */
const AUDIT_ROW: TemplateObject = {
  operationType: new EnumValue('UPDATE'),
  modelName: 'AlpacaAccount',
  recordId: ACCOUNT,
  changedFields: { where: { id: ACCOUNT }, data: { APIKey: cred({ set: KEY }), APISecret: cred({ set: SECRET }), label: { set: 'rotated' } } },
  metadata: { source: 'harness', refresh_token: cred(TOKEN), note: 'kept' },
};

/** An audit row whose JSON columns carry credentials deep inside, each sent as a JSON variable. */
const NESTED_AUDIT_ROW: TemplateObject = {
  operationType: new EnumValue('CREATE'),
  modelName: 'User',
  recordId: U_USER,
  changedFields: new JsonVariable('cf', {
    input: {
      name: 'n',
      accounts: { create: [{ provider: 'google', refresh_token: cred(TOKEN), access_token: cred(SECRET) }] },
      alpacaAccounts: { create: [{ APIKey: cred(KEY), APISecret: cred(SECRET), configuration: { auth: { apiSecret: cred(SECRET) } } }] },
    },
  }),
  metadata: new JsonVariable('md', { context: { session: { sessionToken: cred(TOKEN) }, linked: [{ provider: 'github', accessToken: cred(SECRET) }] }, note: 'kept' }),
};

/** A row with no credential, written beside a credential row. */
const PLAIN_AUDIT_ROW: TemplateObject = {
  operationType: new EnumValue('CREATE'),
  modelName: 'Order',
  recordId: 'order-2',
  changedFields: { status: 'cancel_requested' },
  metadata: { source: 'harness' },
};

const AUDIT_ROW_ID_WHERE: TemplateObject = { id: AUDIT_ROW_ID };

/** The credential row for a shape: the nested-JSON shape writes the nested row. */
function auditRow(shape: CredentialShape): TemplateObject {
  return shape === 'nested-json' ? NESTED_AUDIT_ROW : AUDIT_ROW;
}

/** The JSON columns of a row: what an update writes. */
function jsonColumns(row: TemplateObject): TemplateObject {
  return { changedFields: row.changedFields, metadata: row.metadata };
}

/** Each generated AuditLog write, per shape. */
const DIRECT_WRITES: Record<string, (shape: CredentialShape) => WriteSpec> = {
  createOneAuditLog: (shape) => ({
    field: 'createOneAuditLog',
    args: [['data', 'AuditLogCreateInput!', auditRow(shape)]],
    selection: '{ id }',
  }),
  createManyAuditLog: (shape) => ({
    field: 'createManyAuditLog',
    args: [['data', '[AuditLogCreateManyInput!]!', [auditRow(shape), PLAIN_AUDIT_ROW]]],
    selection: '{ count }',
  }),
  createManyAndReturnAuditLog: (shape) => ({
    field: 'createManyAndReturnAuditLog',
    args: [['data', '[AuditLogCreateManyInput!]!', [auditRow(shape), PLAIN_AUDIT_ROW]]],
    selection: '{ id }',
  }),
  updateOneAuditLog: (shape) => ({
    field: 'updateOneAuditLog',
    args: [
      ['where', 'AuditLogWhereUniqueInput!', AUDIT_ROW_ID_WHERE],
      ['data', 'AuditLogUpdateInput!', jsonColumns(auditRow(shape))],
    ],
    selection: '{ id }',
  }),
  updateManyAuditLog: (shape) => ({
    field: 'updateManyAuditLog',
    args: [
      ['where', 'AuditLogWhereInput', { modelName: { equals: 'AlpacaAccount' } }],
      ['data', 'AuditLogUpdateManyMutationInput!', jsonColumns(auditRow(shape))],
    ],
    selection: '{ count }',
  }),
  upsertOneAuditLog: (shape) => ({
    field: 'upsertOneAuditLog',
    args: [
      ['where', 'AuditLogWhereUniqueInput!', AUDIT_ROW_ID_WHERE],
      ['create', 'AuditLogCreateInput!', auditRow(shape)],
      ['update', 'AuditLogUpdateInput!', jsonColumns(auditRow(shape))],
    ],
    selection: '{ id }',
  }),
};

/** One matrix case: what the write must store, and what it did through each client. */
export interface MatrixCase {
  path: 'plugin' | 'direct';
  field: string;
  shape: CredentialShape | 'nested-relation';
  /** The model the audited write targets (plugin), or AuditLog (direct). */
  model: string;
  /** The Prisma operation the field's resolver runs. */
  operation: string;
  /** Plugin: the audit type the row is recorded under. */
  auditType?: 'CREATE' | 'UPDATE';
  /** Plugin: the stored `changedFields`; direct: the stored rows. */
  expected: unknown;
  query: string;
  result: ScenarioResult;
}

/** A credential-free write, with what the test needs to rebuild main's row for it. */
export interface CredentialFreeCase {
  variables: Record<string, unknown>;
  operationType: 'CREATE' | 'UPDATE' | 'DELETE';
  result: ScenarioResult;
}

async function main(): Promise<void> {
  process.env.DATABASE_URL = UNREACHABLE_DATABASE_URL;
  process.env.DIRECT_DATABASE_URL = UNREACHABLE_DATABASE_URL;
  const prismaModule = (await import('../../prismaClient')) as unknown as Record<string, unknown>;
  const initialSingleton = global.prisma;
  if (!initialSingleton) throw new Error('prismaClient.ts did not install global.prisma');
  const guarded: PrismaClient = initialSingleton;
  const unguarded = new PrismaClient({ datasourceUrl: UNREACHABLE_DATABASE_URL });

  let mode: MutationAuthMode = 'shadow';
  const schema = await buildSchema({
    resolvers: [AuditLogCrudResolver, AlpacaAccountCrudResolver, UserCrudResolver],
    validate: false,
  });
  installMutationAuthGuard(schema, { modeProvider: () => mode, enforcedModelsProvider: () => new Set() });
  const server = new ApolloServer({ schema, plugins: [createAuditLogPlugin(), createHttpStatusMapperPlugin()] });
  await server.start();

  const graphql =
    (query: string, variables: Record<string, unknown>, principal: BackendPrincipal | null): Runner =>
    async (client) => {
      const response = await server.executeOperation(
        { query, variables },
        {
          contextValue: {
            prisma: client,
            principal,
            user: principal ? { sub: principal.kind === 'server' ? 'server' : principal.sub } : null,
            req: { ip: '203.0.113.7', headers: { 'user-agent': 'audit-write-harness' } },
          },
        }
      );
      const body = response.body.kind === 'single' ? response.body.singleResult : null;
      const errors = body?.errors ?? [];
      return {
        status: response.http.status ?? 200,
        codes: errors.map((e) => String(e.extensions?.code)),
        errors: errors.map((e) => e.message),
      };
    };

  const results: Record<string, ScenarioResult> = {};

  for (const [field, { query, variables }] of Object.entries(WRITE_MUTATIONS)) {
    for (const { principal, mode: scenarioMode } of AUTH_MATRIX) {
      mode = scenarioMode;
      results[`gql/${field}/${principal}/${scenarioMode}`] = await runBoth(
        guarded,
        unguarded,
        graphql(query, variables, PRINCIPALS[principal])
      );
    }
  }

  mode = 'enforce';
  for (const [name, data] of Object.entries(CONSUMER_PAYLOADS)) {
    results[`consumer/${name}`] = await runBoth(guarded, unguarded, graphql(CREATE_ONE, { data }, PRINCIPALS.server));
  }

  results['server/audit-plugin'] = await runBoth(
    guarded,
    unguarded,
    graphql(
      UPDATE_ACCOUNT_KEYS,
      { where: { id: 'acct-1' }, data: { APIKey: { set: API_KEY }, APISecret: { set: API_SECRET } } },
      PRINCIPALS.server
    )
  );
  results['server/trading-policy-attempt'] = await runBoth(
    guarded,
    unguarded,
    direct((client) => writeAttemptRow(client as unknown as AuditLogWriter, POLICY_ENTRY, 'pending'))
  );
  results['direct/create'] = await runBoth(
    guarded,
    unguarded,
    direct((client) => client.auditLog.create({ data: CREDENTIAL_ROW as Prisma.AuditLogCreateInput }))
  );
  results['direct/createMany-single-row'] = await runBoth(
    guarded,
    unguarded,
    direct((client) => client.auditLog.createMany({ data: CREDENTIAL_ROW as Prisma.AuditLogCreateManyInput }))
  );
  results['direct/updateManyAndReturn'] = await runBoth(
    guarded,
    unguarded,
    direct((client) =>
      client.auditLog.updateManyAndReturn({
        where: { modelName: 'AlpacaAccount' },
        data: { changedFields: CREDENTIAL_CHANGED_FIELDS },
      })
    )
  );
  results['direct/sentinels'] = await runBoth(
    guarded,
    unguarded,
    direct((client) =>
      client.auditLog.create({
        data: { operationType: 'CREATE', modelName: 'Order', recordId: 'order-4', changedFields: Prisma.JsonNull, metadata: Prisma.DbNull },
      })
    )
  );
  results['direct/non-json-values'] = await runBoth(
    guarded,
    unguarded,
    direct((client) =>
      client.auditLog.create({
        data: {
          operationType: 'CREATE',
          modelName: 'Order',
          recordId: 'order-5',
          timestamp: new Date(ISO_NOW),
          changedFields: { at: new Date(ISO_NOW) as unknown as Prisma.InputJsonValue, nested: [{ n: 1 }, null] },
        },
      })
    )
  );
  results['direct/read-filter'] = await runBoth(
    guarded,
    unguarded,
    direct((client) => client.auditLog.findFirst({ where: { metadata: { equals: { refresh_token: OAUTH_TOKEN } } } }))
  );
  results['direct/deleteMany'] = await runBoth(
    guarded,
    unguarded,
    direct((client) => client.auditLog.deleteMany({ where: { recordId: 'acct-1' } }))
  );

  // The acceptance matrix, as the engine's service principal sends it under enforce.
  mode = 'enforce';
  const matrix: MatrixCase[] = [];
  const runCase = async (
    path: MatrixCase['path'],
    shape: MatrixCase['shape'],
    spec: WriteSpec,
    sentAs: CredentialShape
  ): Promise<void> => {
    const { model, operation, auditType } = fieldOperation(spec.field);
    const { query, variables } = operationFor(spec, sentAs);
    matrix.push({
      path,
      field: spec.field,
      shape,
      model,
      operation,
      auditType: path === 'plugin' ? auditType : undefined,
      expected: path === 'plugin' ? expectedPluginChangedFields(spec) : expectedDirectRows(spec),
      query,
      result: await runBoth(guarded, unguarded, graphql(query, variables, PRINCIPALS.server)),
    });
  };
  for (const build of Object.values(PLUGIN_WRITES)) {
    for (const shape of CREDENTIAL_SHAPES) await runCase('plugin', shape, build(shape), shape);
  }
  // A relation write's nested credentials, sent as the variables the old recorder stored raw.
  for (const spec of Object.values(NESTED_RELATION_WRITES)) {
    await runCase('plugin', 'nested-relation', spec, 'variable-named');
  }
  for (const build of Object.values(DIRECT_WRITES)) {
    for (const shape of CREDENTIAL_SHAPES) await runCase('direct', shape, build(shape), shape);
  }

  const credentialFree: Record<string, CredentialFreeCase> = {};
  for (const [field, { query, variables, operationType }] of Object.entries(CREDENTIAL_FREE_WRITES)) {
    credentialFree[field] = {
      variables,
      operationType,
      result: await runBoth(guarded, unguarded, graphql(query, variables, PRINCIPALS.server)),
    };
  }

  const reconnectPrisma = prismaModule.reconnectPrisma;
  const reconnect: { available: boolean; replaced: boolean; result: ScenarioResult | null } = {
    available: typeof reconnectPrisma === 'function',
    replaced: false,
    result: null,
  };
  if (typeof reconnectPrisma === 'function') {
    await (reconnectPrisma as () => Promise<void>)();
    const reconnected = global.prisma;
    reconnect.replaced = reconnected !== undefined && reconnected !== initialSingleton;
    if (reconnected) {
      reconnect.result = await runBoth(
        reconnected,
        unguarded,
        direct((client) => client.auditLog.create({ data: CREDENTIAL_ROW as Prisma.AuditLogCreateInput }))
      );
    }
  }

  await server.stop();
  await unguarded.$disconnect();
  await global.prisma?.$disconnect();
  process.stdout.write(
    `<<<RESULTS>>>${JSON.stringify({
      singletonIsDefaultExport: prismaModule.default === initialSingleton,
      reconnect,
      results,
      matrix,
      credentialFree,
    })}<<<END>>>\n`
  );
}

main().catch((error: unknown) => {
  process.stderr.write(`harness failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`);
  process.exit(1);
});

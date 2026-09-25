/**
 * Out-of-process harness for `credential-field-coverage.test.ts`.
 *
 * Builds the SAME schema `server.ts` serves — every generated resolver plus
 * the custom ones — with the credential-field guard installed as the first
 * global middleware, then does two things:
 *
 * 1. **Coverage walk.** Enumerates every output type, input type and enum in
 *    the built schema and reports each place a stored credential column can
 *    be read (an output field), filtered or sorted on (a predicate input key),
 *    or grouped / distincted by (an enum value) that the guard does NOT claim.
 *    A new generator output shape, a new credential column or a renamed type
 *    therefore turns CI red instead of silently widening the read surface.
 *    It also reports every credential-SHAPED output field name (secret, token,
 *    api key, password …) that is neither guarded nor on a reviewed allowlist,
 *    so a new column such as `webhookSecret` cannot ship unguarded.
 * 2. **Query shapes.** Executes aliased, fragment, nested-relation,
 *    multi-root, variable-driven and bulk-write-return queries as anonymous,
 *    user, admin and service principals against a Prisma double seeded with
 *    known secret values, and records the response body verbatim.
 *
 * Runs under ts-node because the generated resolvers need
 * `emitDecoratorMetadata`, which vitest's esbuild transform does not emit.
 *
 * Run directly: npx ts-node --transpile-only src/middleware/__tests__/credential-field-coverage.harness.ts
 */
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLScalarType,
  getNamedType,
  graphql,
  type GraphQLNamedType,
  type GraphQLSchema,
} from 'graphql';

import { resolvers } from '../../generated/typegraphql-prisma';
import {
  BrokerageAccountCredentialStatusResolver,
  OptionsGreeksHistoryCustomResolver,
  TradingSettingsResolver,
} from '../../resolvers/custom';
import type { BackendPrincipal } from '../../auth/token-verifier';
import {
  AUDIT_PAYLOAD_FIELDS,
  auditPayloadEnumFieldsFor,
  auditPayloadOutputFieldsFor,
  auditPayloadPredicateFieldsFor,
} from '../audit-payload-guard';
import {
  CREDENTIAL_FIELDS,
  createCredentialFieldGuardMiddleware,
  credentialEnumValuesFor,
  credentialOutputFieldsFor,
  credentialPredicateFieldsFor,
} from '../credential-field-guard';

export const API_KEY = 'PKCOVERAGEKEYVALUE00000000';
export const API_SECRET = 'coverage-secret-value-that-must-never-leak';
/** A literal placed in a predicate; it must never be echoed back in an error. */
export const PREDICATE_CANARY = 'predicate-canary-value-9f3c';

/**
 * Credential values inside stored AuditLog payloads, shaped like the rows the
 * unredacted audit logger wrote: `data.APIKey.set` / `data.APISecret.set` for
 * a broker-key update, nested `create` keys for a user create.
 */
export const AUDIT_KEY = 'PKAUDITCOVERAGEKEY00000000';
export const AUDIT_SECRET = 'audit-coverage-secret-that-must-never-leak';
export const AUDIT_NESTED_SECRET = 'audit-coverage-nested-secret-never-leaks';
export const AUDIT_TOKEN = 'audit-coverage-oauth-access-token';

/**
 * Output field names that LOOK like credentials but were reviewed and hold no
 * secret. Every entry needs a reason; adding one is a security review, not a
 * convenience.
 */
export const REVIEWED_NON_SECRET_OUTPUT_FIELDS: ReadonlyMap<string, string> = new Map([
  // OAuth token TYPE ("bearer"), not a token value.
  ['token_type', 'OAuth token type label, e.g. "bearer"'],
]);

/** Name fragments that mark an output field as credential-shaped. */
const CREDENTIAL_SHAPED = /(secret|password|passwd|api_?key|private_?key|(^|_)token$|[a-z]Token$|^token$)/i;

const PRINCIPALS: Record<string, BackendPrincipal | null> = {
  none: null,
  server: { kind: 'server' },
  user: { kind: 'user', sub: 'u-1', roles: ['user'] },
  admin: { kind: 'admin', sub: 'a-1', roles: ['admin'] },
};

interface ShapeScenario {
  name: string;
  query: string;
  principal: keyof typeof PRINCIPALS;
  variables?: Record<string, unknown>;
}

const Q_ALIASED = '{ a: alpacaAccounts { i: id k: APIKey s: APISecret } }';
const Q_FRAGMENT =
  '{ alpacaAccounts { ...Creds } } fragment Creds on AlpacaAccount { id APIKey APISecret }';
const Q_INLINE_FRAGMENT = '{ alpacaAccounts { ... on AlpacaAccount { id APISecret } } }';
const Q_NESTED = '{ users { id alpacaAccounts { id APIKey APISecret } } }';
const Q_MULTI_ROOT =
  '{ open: alpacaAccounts { id type } closed: alpacaAccounts { id APISecret } }';
const Q_VARIABLE_PREDICATE =
  'query Q($w: AlpacaAccountWhereInput) { alpacaAccounts(where: $w) { id } }';
const Q_CANARY_PREDICATE = `{ alpacaAccounts(where: { APISecret: { startsWith: "${PREDICATE_CANARY}" } }) { id } }`;
const Q_BULK_RETURN =
  'mutation { createManyAndReturnAlpacaAccount(data: [{ id: "acct-2", type: PAPER, APIKey: "x", APISecret: "y", userId: "u-1" }]) { id APIKey APISecret } }';
const Q_UPDATE_RETURN =
  'mutation { updateOneAlpacaAccount(where: { id: "acct-1" }, data: { realTime: { set: false } }) { id APISecret } }';
const Q_MUTATION_ORACLE =
  'mutation { updateManyAlpacaAccount(where: { APISecret: { startsWith: "c" } }, data: { realTime: { set: false } }) { count } }';

const SHAPES: ReadonlyArray<[string, string, Record<string, unknown>?]> = [
  ['aliased', Q_ALIASED],
  ['fragment', Q_FRAGMENT],
  ['inline-fragment', Q_INLINE_FRAGMENT],
  ['nested-relation', Q_NESTED],
  ['multi-root', Q_MULTI_ROOT],
  ['variable-predicate', Q_VARIABLE_PREDICATE, { w: { APISecret: { startsWith: 'c' } } }],
  ['canary-predicate', Q_CANARY_PREDICATE],
  ['bulk-return', Q_BULK_RETURN],
  ['update-return', Q_UPDATE_RETURN],
  ['mutation-oracle', Q_MUTATION_ORACLE],
];

const AUDIT_CREATE_DATA =
  '{ operationType: UPDATE, modelName: "AlpacaAccount", recordId: "acct-1", changedFields: {} }';

/** AuditLog shapes: payload outputs on every generated read and write-return path. */
const AUDIT_OUTPUT_SHAPES: ReadonlyArray<[string, string]> = [
  ['audit-root', '{ auditLogs { id changedFields metadata } }'],
  [
    'audit-aliased-fragment',
    '{ a: auditLogs { ...P } } fragment P on AuditLog { c: changedFields m: metadata }',
  ],
  ['audit-unique', '{ auditLog(where: { id: "log-1" }) { changedFields metadata } }'],
  ['audit-get', '{ getAuditLog(where: { id: "log-1" }) { changedFields metadata } }'],
  ['audit-first', '{ findFirstAuditLog { changedFields metadata } }'],
  ['audit-first-or-throw', '{ findFirstAuditLogOrThrow { changedFields metadata } }'],
  ['audit-group-by-output', '{ groupByAuditLog(by: [id]) { id changedFields metadata } }'],
  [
    'audit-bulk-return',
    `mutation { createManyAndReturnAuditLog(data: [${AUDIT_CREATE_DATA}]) { id changedFields metadata } }`,
  ],
  [
    'audit-create-return',
    `mutation { createOneAuditLog(data: ${AUDIT_CREATE_DATA}) { changedFields metadata } }`,
  ],
  [
    'audit-update-return',
    'mutation { updateOneAuditLog(where: { id: "log-1" }, data: { operationName: { set: "x" } }) { changedFields metadata } }',
  ],
  [
    'audit-upsert-return',
    `mutation { upsertOneAuditLog(where: { id: "log-1" }, create: ${AUDIT_CREATE_DATA}, update: {}) { changedFields metadata } }`,
  ],
  [
    'audit-delete-return',
    'mutation { deleteOneAuditLog(where: { id: "log-1" }) { changedFields metadata } }',
  ],
];

/** AuditLog shapes: predicates over a payload column (filter, sort, group, cursor, write oracle). */
const AUDIT_PREDICATE_SHAPES: ReadonlyArray<[string, string, Record<string, unknown>?]> = [
  [
    'audit-path-predicate',
    `{ auditLogs(where: { changedFields: { path: ["data", "APISecret", "set"], string_starts_with: "${PREDICATE_CANARY}" } }) { id } }`,
  ],
  [
    'audit-variable-predicate',
    'query Q($w: AuditLogWhereInput) { auditLogs(where: $w) { id } }',
    { w: { AND: [{ metadata: { path: ['accessToken'], string_starts_with: 'a' } }] } },
  ],
  ['audit-order-by', '{ auditLogs(orderBy: [{ changedFields: asc }]) { id } }'],
  ['audit-distinct', '{ auditLogs(distinct: [metadata]) { id } }'],
  ['audit-group-by-payload', '{ groupByAuditLog(by: [changedFields]) { id } }'],
  [
    'audit-having',
    '{ groupByAuditLog(by: [id], having: { changedFields: { path: ["data"], equals: {} } }) { id } }',
  ],
  [
    'audit-cursor',
    '{ auditLogs(cursor: { id: "log-1", changedFields: { path: ["data"], equals: {} } }) { id } }',
  ],
  [
    'audit-mutation-oracle',
    'mutation { updateManyAuditLog(where: { changedFields: { path: ["data", "APISecret", "set"], string_starts_with: "c" } }, data: { operationName: { set: "x" } }) { count } }',
  ],
];

/** A read of AuditLog that touches no payload column: the guard must not interfere. */
const AUDIT_CLEAN_SHAPES: ReadonlyArray<[string, string]> = [
  ['audit-clean-fields', '{ auditLogs { id operationName modelName recordId } }'],
];

const SCENARIOS: ShapeScenario[] = [
  ...SHAPES,
  ...AUDIT_OUTPUT_SHAPES,
  ...AUDIT_PREDICATE_SHAPES,
  ...AUDIT_CLEAN_SHAPES,
].flatMap(([shape, query, variables]) =>
  (['none', 'user', 'admin', 'server'] as const).map((principal) => ({
    name: `${shape}/${principal}`,
    query,
    principal,
    variables,
  }))
);

/** Longest credential model whose name occurs in `typeName`, if any. */
function owningModel(typeName: string): string | undefined {
  const models = [...CREDENTIAL_FIELDS.keys()].sort((a, b) => b.length - a.length);
  return models.find((m) => typeName.includes(m));
}

interface CoverageReport {
  typesWalked: number;
  uncoveredOutputs: string[];
  uncoveredPredicates: string[];
  uncoveredEnumValues: string[];
  unreviewedCredentialShapedOutputs: string[];
  guardedOutputsSeen: string[];
  uncoveredAuditPayloadOutputs: string[];
  uncoveredAuditPayloadPredicates: string[];
  uncoveredAuditPayloadEnumValues: string[];
  guardedAuditPayloadOutputsSeen: string[];
}

/** Scalars that carry a count or a flag, never a copy of a payload's content. */
const NON_VALUE_SCALARS = new Set(['Int', 'Float', 'Boolean', 'BigInt']);

/** Longest audit payload model whose name occurs in `typeName`, if any. */
function owningAuditModel(typeName: string): string | undefined {
  const models = [...AUDIT_PAYLOAD_FIELDS.keys()].sort((a, b) => b.length - a.length);
  return models.find((m) => typeName.includes(m));
}

/**
 * Every place the served schema lets a caller read (output field), filter or
 * sort on (predicate input key) or group / distinct by (enum value) an audit
 * payload column, that the audit payload guard does not claim.
 */
function walkAuditPayloadCoverage(type: GraphQLNamedType, report: CoverageReport): void {
  const model = owningAuditModel(type.name);
  const columns = model ? AUDIT_PAYLOAD_FIELDS.get(model) : undefined;
  if (!columns) return;

  if (type instanceof GraphQLObjectType) {
    const claimed = auditPayloadOutputFieldsFor(type.name);
    for (const [fieldName, field] of Object.entries(type.getFields())) {
      if (!columns.has(fieldName)) continue;
      const named = getNamedType(field.type);
      if (!(named instanceof GraphQLScalarType) || NON_VALUE_SCALARS.has(named.name)) continue;
      const ref = `${type.name}.${fieldName}`;
      if (claimed?.has(fieldName)) report.guardedAuditPayloadOutputsSeen.push(ref);
      else report.uncoveredAuditPayloadOutputs.push(ref);
    }
  } else if (type instanceof GraphQLInputObjectType) {
    if (!/(Where|OrderBy|Having)/.test(type.name)) return;
    const claimed = auditPayloadPredicateFieldsFor(type.name);
    for (const fieldName of Object.keys(type.getFields())) {
      if (columns.has(fieldName) && !claimed?.has(fieldName)) {
        report.uncoveredAuditPayloadPredicates.push(`${type.name}.${fieldName}`);
      }
    }
  } else if (type instanceof GraphQLEnumType) {
    const claimed = auditPayloadEnumFieldsFor(type.name);
    for (const value of type.getValues()) {
      if (columns.has(value.name) && !claimed?.has(value.name)) {
        report.uncoveredAuditPayloadEnumValues.push(`${type.name}.${value.name}`);
      }
    }
  }
}

/** Walk the served schema and list every credential surface the guard misses. */
function walkCoverage(schema: GraphQLSchema): CoverageReport {
  const report: CoverageReport = {
    typesWalked: 0,
    uncoveredOutputs: [],
    uncoveredPredicates: [],
    uncoveredEnumValues: [],
    unreviewedCredentialShapedOutputs: [],
    guardedOutputsSeen: [],
    uncoveredAuditPayloadOutputs: [],
    uncoveredAuditPayloadPredicates: [],
    uncoveredAuditPayloadEnumValues: [],
    guardedAuditPayloadOutputsSeen: [],
  };
  for (const type of Object.values(schema.getTypeMap())) {
    if (type.name.startsWith('__')) continue;
    report.typesWalked += 1;
    walkAuditPayloadCoverage(type, report);
    const model = owningModel(type.name);
    const credentialColumns = model ? CREDENTIAL_FIELDS.get(model) : undefined;

    if (type instanceof GraphQLObjectType) {
      const guarded = credentialOutputFieldsFor(type.name);
      for (const [fieldName, field] of Object.entries(type.getFields())) {
        const named = getNamedType(field.type);
        const carriesValue = named instanceof GraphQLScalarType && named.name === 'String';
        if (!carriesValue) continue;
        const ref = `${type.name}.${fieldName}`;
        if (guarded?.has(fieldName)) {
          report.guardedOutputsSeen.push(ref);
          continue;
        }
        if (credentialColumns?.has(fieldName)) report.uncoveredOutputs.push(ref);
        else if (
          CREDENTIAL_SHAPED.test(fieldName) &&
          !REVIEWED_NON_SECRET_OUTPUT_FIELDS.has(fieldName)
        ) {
          report.unreviewedCredentialShapedOutputs.push(ref);
        }
      }
    } else if (type instanceof GraphQLInputObjectType) {
      if (!credentialColumns) continue;
      if (!/(Where|OrderBy|Having)/.test(type.name)) continue;
      const claimed = credentialPredicateFieldsFor(type.name);
      for (const fieldName of Object.keys(type.getFields())) {
        if (credentialColumns.has(fieldName) && !claimed?.has(fieldName)) {
          report.uncoveredPredicates.push(`${type.name}.${fieldName}`);
        }
      }
    } else if (type instanceof GraphQLEnumType) {
      if (!credentialColumns) continue;
      const claimed = credentialEnumValuesFor(type.name);
      for (const value of type.getValues()) {
        if (credentialColumns.has(value.name) && !claimed?.has(value.name)) {
          report.uncoveredEnumValues.push(`${type.name}.${value.name}`);
        }
      }
    }
  }
  return report;
}

interface ShapeResult {
  codes: string[];
  json: string;
  resolverCalls: number;
}

/**
 * Marker in the error a resolver gets when it calls a Prisma delegate or
 * method the double does not provide. The test fails on any response that
 * carries it: a missing method otherwise surfaces as an ordinary resolver
 * error, which a "the secret is absent" assertion reads as a pass and a
 * "the service control receives it" assertion reports without saying why.
 */
export const DOUBLE_GAP_MARKER = 'COVERAGE_HARNESS_DOUBLE_GAP';

type DelegateDouble = Record<string, (...args: unknown[]) => unknown>;

/** Wrap the Prisma double so a missing delegate or method names itself. */
function doubleWithTripwire(
  delegates: Record<string, DelegateDouble>
): Record<string, DelegateDouble> {
  const missing = (ref: string): never => {
    throw new Error(`${DOUBLE_GAP_MARKER}: prisma.${ref} is not provided by the harness double`);
  };
  const wrapDelegate = (model: string, methods: DelegateDouble): DelegateDouble =>
    new Proxy(methods, {
      get: (target, prop) =>
        typeof prop === 'string' && !(prop in target)
          ? () => missing(`${model}.${prop}`)
          : Reflect.get(target, prop),
    });
  const wrapped = Object.fromEntries(
    Object.entries(delegates).map(([model, methods]) => [model, wrapDelegate(model, methods)])
  );
  return new Proxy(wrapped, {
    get: (target, prop) =>
      typeof prop === 'string' && !(prop in target) && prop !== 'then'
        ? wrapDelegate(prop, {})
        : Reflect.get(target, prop),
  });
}

async function main(): Promise<void> {
  let resolverCalls = 0;
  const count = <T>(value: T): Promise<T> => {
    resolverCalls += 1;
    return Promise.resolve(value);
  };
  const row = {
    id: 'acct-1',
    type: 'LIVE',
    APIKey: API_KEY,
    APISecret: API_SECRET,
    userId: 'u-1',
  };
  // The generated relation resolvers reach a parent's relation through the
  // Prisma fluent API. Which unique finder they chain from is a generator
  // detail (`findUnique` today, `findUniqueOrThrow` in other versions), so
  // the double serves both rather than pinning the harness to one release.
  // Stored AuditLog rows as the unredacted audit logger wrote them.
  const auditRows = [
    {
      id: 'log-1',
      timestamp: new Date('2026-07-07T13:48:28.802Z'),
      userId: null,
      operationType: 'UPDATE',
      modelName: 'AlpacaAccount',
      recordId: 'acct-1',
      changedFields: {
        where: { id: 'acct-1' },
        data: {
          APIKey: { set: AUDIT_KEY },
          APISecret: { set: AUDIT_SECRET },
          realTime: { set: false },
        },
      },
      operationName: 'updateOneAlpacaAccount',
      ipAddress: null,
      metadata: { graphqlOperationName: 'updateAlpacaAccount', accessToken: AUDIT_TOKEN },
    },
    {
      id: 'log-2',
      timestamp: new Date('2026-03-23T13:12:42.699Z'),
      userId: null,
      operationType: 'CREATE',
      modelName: 'User',
      recordId: 'u-2',
      changedFields: {
        input: {
          name: 'fixture user',
          alpacaAccounts: {
            connectOrCreate: [
              {
                where: { id: 'acct-2' },
                create: { type: 'PAPER', APIKey: AUDIT_KEY, APISecret: AUDIT_NESTED_SECRET },
              },
            ],
          },
        },
      },
      operationName: 'createOneUser',
      ipAddress: null,
      metadata: { graphqlOperationName: 'createUser' },
    },
  ];
  const userRelations = (): { alpacaAccounts: () => Promise<(typeof row)[]> } => ({
    alpacaAccounts: () => count([row]),
  });
  const prisma = doubleWithTripwire({
    alpacaAccount: {
      findMany: () => count([row]),
      createManyAndReturn: () => count([{ ...row, id: 'acct-2' }]),
      update: () => count(row),
      updateMany: () => count({ count: 1 }),
    },
    user: {
      findMany: () => count([{ id: 'u-1' }]),
      findUnique: userRelations,
      findUniqueOrThrow: userRelations,
    },
    auditLog: {
      findMany: () => count(auditRows),
      findUnique: () => count(auditRows[0]),
      findUniqueOrThrow: () => count(auditRows[0]),
      findFirst: () => count(auditRows[0]),
      findFirstOrThrow: () => count(auditRows[0]),
      groupBy: () => count(auditRows),
      createManyAndReturn: () => count(auditRows),
      create: () => count(auditRows[0]),
      update: () => count(auditRows[0]),
      upsert: () => count(auditRows[0]),
      delete: () => count(auditRows[1]),
      updateMany: () => count({ count: 1 }),
    },
  });

  const schema = await buildSchema({
    resolvers: [
      ...resolvers,
      OptionsGreeksHistoryCustomResolver,
      TradingSettingsResolver,
      BrokerageAccountCredentialStatusResolver,
    ],
    validate: false,
    globalMiddlewares: [createCredentialFieldGuardMiddleware({ modeProvider: () => 'enforce' })],
  });

  const coverage = walkCoverage(schema);

  const shapes: Record<string, ShapeResult> = {};
  for (const scenario of SCENARIOS) {
    resolverCalls = 0;
    const result = await graphql({
      schema,
      source: scenario.query,
      variableValues: scenario.variables,
      contextValue: {
        prisma,
        principal: PRINCIPALS[scenario.principal],
        req: { ip: '203.0.113.9', headers: { 'user-agent': 'coverage-harness' } },
      },
    });
    shapes[scenario.name] = {
      codes: (result.errors ?? []).map((e) => String(e.extensions?.code)),
      json: JSON.stringify(result),
      resolverCalls,
    };
  }

  process.stdout.write(`<<<RESULTS>>>${JSON.stringify({ coverage, shapes })}<<<END>>>\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`harness failed: ${String(error)}\n`);
  process.exit(1);
});

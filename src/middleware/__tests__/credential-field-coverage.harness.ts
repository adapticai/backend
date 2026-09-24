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

const SCENARIOS: ShapeScenario[] = SHAPES.flatMap(([shape, query, variables]) =>
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
  };
  for (const type of Object.values(schema.getTypeMap())) {
    if (type.name.startsWith('__')) continue;
    report.typesWalked += 1;
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

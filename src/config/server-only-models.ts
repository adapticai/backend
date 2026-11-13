import {
  GraphQLSchema,
  getNamedType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
} from 'graphql';

import { indexGeneratedTypes } from '../middleware/generated-type-names';

/**
 * Prisma models that are server-only: they live in the schema (so Prisma owns
 * their migrations and the client can read them) but are NEVER part of the
 * GraphQL API or the published `adaptic.*` client surface.
 *
 * typegraphql-prisma has no model-level opt-out, so the exclusion is applied at
 * every point where the generated surface is assembled:
 *   - `src/server.ts` drops the model's generated resolver classes before
 *     `buildSchema`, so no query, mutation or object type for it exists, and
 *     strips what the omit directive cannot reach from the built schema (the
 *     relation count on the parent's `_count` type and the filter inputs it
 *     drags in);
 *   - `src/modules/index.ts`, `generateSelections.ts` and `generateStrings.ts`
 *     skip it, so no CRUD functions, selection set or typeString is published;
 *   - any relation field that points at it from an exposed model carries
 *     `@TypeGraphQL.omit(output: true, input: true)` plus `GQL.SKIP=true` and
 *     `TYPESTRING.SKIP=true` in the schema.
 *
 * TradeRestatement: the trade restatement ledger. Written only by operator
 * restatement scripts inside the repair transaction; with the resolver
 * authChecker and the mutation guard both still shadow-first, a generated CRUD
 * surface would let any caller rewrite or delete the record of what was
 * restated, and expose whole prior trade rows.
 */
export const SERVER_ONLY_MODELS: readonly string[] = ['TradeRestatement'];

const SERVER_ONLY_MODEL_SET = new Set<string>(SERVER_ONLY_MODELS);

/**
 * @param modelName - A Prisma model name (PascalCase).
 * @returns Whether the model must be kept off the GraphQL/client surface.
 */
export function isServerOnlyModel(modelName: string): boolean {
  return SERVER_ONLY_MODEL_SET.has(modelName);
}

/** Suffixes typegraphql-prisma gives the per-model classes in its `resolvers` export. */
const GENERATED_RESOLVER_SUFFIXES = ['CrudResolver', 'RelationsResolver'];

/**
 * Removes the generated resolver classes of server-only models.
 *
 * @param resolvers - The generated `resolvers` array from typegraphql-prisma.
 * @returns The array without any `<Model>CrudResolver` / `<Model>RelationsResolver`
 *   whose model is server-only, non-empty as `buildSchema` requires.
 */
export function withoutServerOnlyResolvers<T extends { name: string }>(
  resolvers: readonly T[]
): [T, ...T[]] {
  const kept = resolvers.filter((resolver) => {
    for (const suffix of GENERATED_RESOLVER_SUFFIXES) {
      if (resolver.name.endsWith(suffix)) {
        return !isServerOnlyModel(resolver.name.slice(0, -suffix.length));
      }
    }
    return true;
  });
  const [first, ...rest] = kept;
  if (first === undefined) {
    throw new Error('withoutServerOnlyResolvers: no resolvers left');
  }
  return [first, ...rest];
}

/**
 * @param typeName - A GraphQL type name.
 * @returns Whether the type is a server-only model or one of its generated
 *   companions (`<Model>WhereInput`, `<Model>ListRelationFilter`, ...).
 */
export function isServerOnlyTypeName(typeName: string): boolean {
  return SERVER_ONLY_MODELS.some(
    (model) =>
      typeName === model ||
      (typeName.startsWith(model) &&
        /^[A-Z]/.test(typeName.slice(model.length)))
  );
}

/**
 * Write-only columns, by Prisma model: a caller may set them through the
 * generated create / update inputs, but no output type returns them. They are
 * read only server-side, through Prisma.
 *
 * Each column also carries `@TypeGraphQL.omit(output: true, input: ["where",
 * "orderBy"])`, `GQL.SKIP=true` and `TYPESTRING.SKIP=true` in the schema. The
 * omit directive removes the column from the model type and the predicate
 * inputs only: typegraphql-prisma still emits it on the model's `GroupBy`,
 * `MinAggregate`, `MaxAggregate` and `CountAggregate` types and on the
 * `CreateManyAndReturn` / `UpdateManyAndReturn` row types, where it would be
 * served by value. {@link withoutServerOnlySchemaSurface} removes it there.
 *
 * UserTotp: the TOTP shared secret (encrypted at rest) and the hashes of the
 * unused recovery codes. Either lets its holder pass the second factor.
 */
export const WRITE_ONLY_FIELDS: ReadonlyMap<string, ReadonlySet<string>> = new Map<
  string,
  ReadonlySet<string>
>([['UserTotp', new Set(['secretEnc', 'recoveryCodesHash'])]]);

const WRITE_ONLY_OUTPUTS = indexGeneratedTypes(WRITE_ONLY_FIELDS);

/** Suffix of the generated per-model count aggregate output type. */
const COUNT_AGGREGATE_SUFFIX = 'CountAggregate';

/**
 * @param typeName - A GraphQL output type name.
 * @returns The write-only columns that type would serve, or `undefined`.
 */
export function writeOnlyOutputFieldsFor(
  typeName: string
): ReadonlySet<string> | undefined {
  const valued = WRITE_ONLY_OUTPUTS.outputFields(typeName);
  if (valued) return valued;
  // The count aggregate returns how many rows hold a value, not the value;
  // it is removed too so no output type names a write-only column at all.
  return typeName.endsWith(COUNT_AGGREGATE_SUFFIX)
    ? WRITE_ONLY_FIELDS.get(typeName.slice(0, -COUNT_AGGREGATE_SUFFIX.length))
    : undefined;
}

/**
 * Removes every field that returns, or takes an argument of, a server-only
 * type, and every write-only column ({@link WRITE_ONLY_FIELDS}) from the
 * output types that would serve it, then rebuilds the schema so types
 * reachable only through those fields drop out of the type map (and out of
 * introspection).
 *
 * typegraphql-prisma's `@TypeGraphQL.omit` hides a relation field from the
 * model type and its inputs but still emits the relation's count on the
 * parent's `<Model>Count` type (e.g. `TradeCount.restatements(where:
 * TradeRestatementWhereInput)`), which would let a caller count and filter
 * ledger rows. Resolver functions are untouched: the rebuilt schema reuses the
 * same type objects, so middleware and auth decorators applied by `buildSchema`
 * carry over.
 *
 * @param schema - The schema returned by `buildSchema`.
 * @returns A schema with no server-only type or field.
 */
export function withoutServerOnlySchemaSurface(
  schema: GraphQLSchema
): GraphQLSchema {
  for (const type of Object.values(schema.getTypeMap())) {
    if (type.name.startsWith('__') || isServerOnlyTypeName(type.name)) {
      continue;
    }
    if (isObjectType(type) || isInterfaceType(type)) {
      const fields = type.getFields();
      const writeOnly = writeOnlyOutputFieldsFor(type.name);
      for (const [name, field] of Object.entries(fields)) {
        if (writeOnly?.has(name)) {
          delete fields[name];
          continue;
        }
        const touchesServerOnly =
          isServerOnlyTypeName(getNamedType(field.type).name) ||
          field.args.some((arg) =>
            isServerOnlyTypeName(getNamedType(arg.type).name)
          );
        if (touchesServerOnly) {
          delete fields[name];
        }
      }
    } else if (isInputObjectType(type)) {
      const fields = type.getFields();
      for (const [name, field] of Object.entries(fields)) {
        if (isServerOnlyTypeName(getNamedType(field.type).name)) {
          delete fields[name];
        }
      }
    }
  }
  // Rebuild from the root types only, so companions that were reachable solely
  // through the stripped fields (filters for the ledger's own columns) leave the
  // type map too. `buildSchema` is not given `orphanedTypes`, so every type it
  // emits is reachable from a root; nothing legitimate is lost.
  const config = schema.toConfig();
  return new GraphQLSchema({ ...config, types: [] });
}

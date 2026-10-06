import {
  GraphQLSchema,
  getNamedType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
} from 'graphql';

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
 * Removes every field that returns, or takes an argument of, a server-only
 * type, then rebuilds the schema so types reachable only through those fields
 * drop out of the type map (and out of introspection).
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
      for (const [name, field] of Object.entries(fields)) {
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

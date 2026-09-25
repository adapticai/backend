/**
 * Where the generated GraphQL schema exposes a Prisma model's columns, by
 * type-name convention.
 *
 * typegraphql-prisma names every type after its model, so a guard that must
 * cover "every way a query can observe column X of model M" can derive the
 * whole surface from the model name: the output types that carry column
 * VALUES, the input types that act as predicates over them, and the scalar
 * enum that names them in `by` / `distinct`. The rules live here, once, so
 * each guard that keys on a set of columns applies the same naming rules.
 *
 * @module middleware/generated-type-names
 */

/**
 * Output types that carry a model's column VALUES, as name suffixes on the
 * model. The `Count` aggregate is absent on purpose: it returns how many rows
 * are non-null, never a value.
 */
export const VALUE_OUTPUT_SUFFIXES = ['', 'GroupBy', 'MinAggregate', 'MaxAggregate'] as const;

/**
 * Output types that carry a model's column VALUES, as name prefixes on the
 * model. `createManyAndReturn<Model>` / `updateManyAndReturn<Model>` return
 * the written rows as their own generated type rather than as `<Model>`, so a
 * guard keyed only on the model type would serve the guarded columns of every
 * row such a mutation touches — including columns the caller did not write.
 */
export const VALUE_OUTPUT_PREFIXES = ['CreateManyAndReturn', 'UpdateManyAndReturn'] as const;

/**
 * Input-type name fragments that make a type a read predicate (filter, sort,
 * cursor, aggregate filter) rather than a write payload. A `…WhereUniqueInput`
 * is also how a mutation selects its row, so a guarded key there is an oracle
 * on a write path too.
 */
const PREDICATE_TYPE_FRAGMENTS = ['Where', 'OrderBy', 'Having'] as const;

const SCALAR_FIELD_ENUM_SUFFIX = 'ScalarFieldEnum';

/** Lookups from a generated type name to the guarded columns it exposes. */
export interface GeneratedTypeIndex {
  /** Guarded columns an output type carries as values, if any. */
  outputFields(typeName: string): ReadonlySet<string> | undefined;
  /** Guarded columns an input type's keys can reference as a predicate, if any. */
  predicateFields(typeName: string): ReadonlySet<string> | undefined;
  /** Guarded columns a `<Model>ScalarFieldEnum` can name, if it is one. */
  enumFields(typeName: string): ReadonlySet<string> | undefined;
}

/**
 * Index the generated types of every model in `fieldsByModel`.
 *
 * @param fieldsByModel - Guarded column names, by Prisma model name.
 * @returns Lookups over the generated type names.
 */
export function indexGeneratedTypes(
  fieldsByModel: ReadonlyMap<string, ReadonlySet<string>>
): GeneratedTypeIndex {
  const outputs: ReadonlyMap<string, ReadonlySet<string>> = new Map(
    [...fieldsByModel].flatMap(([model, fields]) => [
      ...VALUE_OUTPUT_SUFFIXES.map(
        (suffix) => [`${model}${suffix}`, fields] as [string, ReadonlySet<string>]
      ),
      ...VALUE_OUTPUT_PREFIXES.map(
        (prefix) => [`${prefix}${model}`, fields] as [string, ReadonlySet<string>]
      ),
    ])
  );

  // Longest-first, so the prefix match attributes
  // `AccountLinkingRequestWhereInput` to `AccountLinkingRequest`, not `Account`.
  const modelsLongestFirst = [...fieldsByModel.keys()].sort((a, b) => b.length - a.length);

  return {
    outputFields: (typeName) => outputs.get(typeName),
    // Generated names start with the model name followed by an upper-case
    // letter (`AlpacaAccountWhereInput`), so a model named `Account` does not
    // claim `AccountLinkingRequestWhereInput`.
    predicateFields: (typeName) => {
      for (const model of modelsLongestFirst) {
        if (!typeName.startsWith(model)) continue;
        const rest = typeName.slice(model.length);
        if (!/^[A-Z]/.test(rest)) continue;
        if (!PREDICATE_TYPE_FRAGMENTS.some((f) => rest.includes(f))) return undefined;
        return fieldsByModel.get(model);
      }
      return undefined;
    },
    enumFields: (typeName) =>
      typeName.endsWith(SCALAR_FIELD_ENUM_SUFFIX)
        ? fieldsByModel.get(typeName.slice(0, -SCALAR_FIELD_ENUM_SUFFIX.length))
        : undefined,
  };
}

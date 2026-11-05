/**
 * The `where` object a generated `findMany<Model>(props)` builds when the
 * caller passes no explicit `whereInput`.
 *
 * `findMany` sends a `<Model>WhereInput`, in which every scalar column is a
 * filter object (`{ equals, in, lt, ... }`). A filter the caller supplies
 * must constrain the result: dropping one silently widens the query to rows
 * that violate the caller's own predicate, and dropping all of them turns a
 * filtered call into a "requires at least one filter criterion" error. So
 * every column whose filter accepts `equals` with a plain value is mapped to
 * `{ equals: value }`, and a supplied key that cannot be expressed that way
 * (a relation, a JSON column, a key the model does not have) is refused by
 * name instead of being discarded. An explicit `whereInput` bypasses both and
 * is sent verbatim.
 *
 * `get` (a `WhereUniqueInput` lookup) deliberately keeps its own unique-field
 * builder: a unique lookup needs exactly the identifying fields, not every
 * column.
 */
import { FieldDefinition } from './types';

/**
 * Scalar filter input types whose `equals` takes the column's plain value.
 *
 * Relation filters take a nested `WhereInput`, and JSON filters compare with
 * JSON-null semantics that a plain value cannot select, so neither is
 * expressible as `{ equals: props.field }`.
 */
const EQUALS_FILTER_TYPE =
  /^(?:BigInt|Bool|DateTime|Decimal|Float|Int|String|Uuid|Enum[A-Za-z0-9]+?)(?:Nullable)?(?:List)?Filter$/;

/** Logical combinators of a `WhereInput`; never a column. */
const COMBINATORS = new Set(['AND', 'OR', 'NOT']);

/**
 * Whether a `WhereInput` field can be filtered with `{ equals: value }`.
 *
 * @param field - A field parsed from `<Model>WhereInput`.
 * @returns True for a scalar or enum column filter, false for combinators, relations and JSON.
 */
export const isEqualsFilterField = (field: FieldDefinition): boolean => {
  if (COMBINATORS.has(field.name)) return false;
  const typeName = field.type.name;
  return !typeName.includes('Relation') && EQUALS_FILTER_TYPE.test(typeName);
};

/**
 * The column names a props-only `findMany` can filter on, in declaration order.
 *
 * @param whereFields - Fields parsed from `<Model>WhereInput`.
 * @returns Names of the columns mapped to `{ equals }`.
 */
export const findManyPropsFilterFields = (
  whereFields: FieldDefinition[]
): string[] => whereFields.filter(isEqualsFilterField).map((f) => f.name);

/**
 * Emit the body of the `where` object literal for a props-only `findMany`.
 *
 * Each expressible column becomes
 * `field: <accessor>.field !== undefined ? { equals: <accessor>.field } : undefined,`
 * — the shape the generated code has always used for the columns it did
 * emit, so an already-filtered column produces the same value as before.
 *
 * @param whereFields - Fields parsed from `<Model>WhereInput`.
 * @param propsAccessor - Expression naming the props object in the generated code.
 * @param indent - Leading whitespace for each emitted line.
 * @returns Object-literal body text (no surrounding braces).
 */
export const buildFindManyWhereBody = (
  whereFields: FieldDefinition[],
  propsAccessor: string,
  indent: string = '  '
): string =>
  findManyPropsFilterFields(whereFields)
    .map((name) => {
      const accessor = `${propsAccessor}.${name}`;
      return `${indent}${name}: ${accessor} !== undefined ? {\n${indent}  equals: ${accessor} \n${indent}} : undefined,\n`;
    })
    .join('');

/**
 * Emit the statement that refuses a props key the props-only `where` cannot express.
 *
 * Runs only when no `whereInput` is supplied. A key whose value is
 * `undefined` is ignored, matching how the `where` builder treats it.
 *
 * @param modelName - PascalCase model name, used in the error message.
 * @param whereFields - Fields parsed from `<Model>WhereInput`.
 * @param indent - Leading whitespace for each emitted line.
 * @returns Statement text for the generated `findMany`.
 */
export const buildFindManyPropsGuard = (
  modelName: string,
  whereFields: FieldDefinition[],
  indent: string = '        '
): string => {
  const fields = findManyPropsFilterFields(whereFields)
    .map((name) => `'${name}'`)
    .join(', ');
  return [
    `${indent}if (!whereInput) {`,
    `${indent}  const propsFilterFields: readonly string[] = [${fields}];`,
    `${indent}  const propsRecord = props as unknown as Record<string, unknown>;`,
    `${indent}  const inexpressible = Object.keys(propsRecord).filter(`,
    `${indent}    (key) => propsRecord[key] !== undefined && !propsFilterFields.includes(key)`,
    `${indent}  );`,
    `${indent}  if (inexpressible.length > 0) {`,
    `${indent}    throw new Error(\`findMany${modelName}: filter field(s) \${inexpressible.join(', ')} are not expressible via props; pass whereInput\`);`,
    `${indent}  }`,
    `${indent}}`,
    '',
  ].join('\n');
};

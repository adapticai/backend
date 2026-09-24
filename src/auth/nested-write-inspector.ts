/**
 * Find the relation writes nested inside a mutation's arguments.
 *
 * A generated mutation writes more than its root model: `updateOneAlpacaAccount`
 * can carry `data: { tradingPolicy: { update: { realtimeTradingEnabled: … } } }`,
 * and `updateOneUser` can `connect` someone else's account onto the caller.
 * Authorization and the TradingPolicy audit trail therefore have to see every
 * nested write, not just the root field — otherwise the LIVE flag is one
 * nesting level away from both.
 *
 * The walk is TYPE-directed: typegraphql-prisma names every nested relation
 * container `<Model>CreateNested…Input` or `<Model>Update…NestedInput`, and
 * the value's GraphQL input type is known at every step, so a key that merely
 * happens to be called `update` in a JSON scalar is never mistaken for one.
 *
 * @module auth/nested-write-inspector
 */

import {
  GraphQLInputObjectType,
  GraphQLList,
  getNullableType,
  type GraphQLInputType,
  type GraphQLResolveInfo,
} from 'graphql';

/** One nested relation container found in the arguments. */
export interface NestedWrite {
  /** The model the nested container writes. */
  readonly model: string;
  /** The operation keys present on the container (`create`, `connect`, …). */
  readonly operations: readonly string[];
  /** The argument path to the container, for audit context. */
  readonly path: string;
  /**
   * The `id` of every row the container `connect`s, or `null` when any
   * connect entry selects its row by something other than `id` (and so
   * cannot be compared with a principal's subject).
   */
  readonly connectIds: readonly string[] | null;
}

/** The ids a nested `connect` selects, or `null` when any entry is not by `id`. */
function connectIdsOf(connect: unknown): string[] | null {
  if (connect === undefined) return [];
  const entries: unknown[] = Array.isArray(connect) ? connect : [connect];
  const ids: string[] = [];
  for (const entry of entries) {
    const id = entry !== null && typeof entry === 'object' ? (entry as { id?: unknown }).id : undefined;
    if (typeof id !== 'string') return null;
    ids.push(id);
  }
  return ids;
}

/**
 * The model a nested-container input type writes, or `undefined` when the
 * type is not a nested relation container.
 *
 * @param typeName - The GraphQL input type name.
 * @param modelsLongestFirst - Model names sorted longest first, so
 *   `AccountLinkingRequest…` is never attributed to `Account`.
 */
export function nestedContainerModel(
  typeName: string,
  modelsLongestFirst: readonly string[]
): string | undefined {
  const isContainer =
    typeName.endsWith('NestedInput') || /CreateNested(?:One|Many)Without\w+Input$/.test(typeName);
  if (!isContainer) return undefined;
  for (const model of modelsLongestFirst) {
    if (!typeName.startsWith(model)) continue;
    const rest = typeName.slice(model.length);
    if (rest.startsWith('Create') || rest.startsWith('Update')) return model;
  }
  return undefined;
}

function walk(
  type: GraphQLInputType,
  value: unknown,
  path: string,
  modelsLongestFirst: readonly string[],
  found: NestedWrite[]
): void {
  if (value === null || value === undefined) return;
  const nullable = getNullableType(type);

  if (nullable instanceof GraphQLList) {
    const inner = nullable.ofType as GraphQLInputType;
    const items: unknown[] = Array.isArray(value) ? value : [value];
    items.forEach((item, index) => walk(inner, item, `${path}[${index}]`, modelsLongestFirst, found));
    return;
  }

  if (!(nullable instanceof GraphQLInputObjectType) || typeof value !== 'object') return;

  const record = value as Record<string, unknown>;
  const model = nestedContainerModel(nullable.name, modelsLongestFirst);
  if (model) {
    const operations = Object.keys(record).filter((key) => record[key] !== undefined);
    found.push({ model, operations, path, connectIds: connectIdsOf(record.connect) });
  }
  const fields = nullable.getFields();
  for (const [key, child] of Object.entries(record)) {
    const def = fields[key];
    if (def && child !== undefined) {
      walk(def.type, child, `${path}.${key}`, modelsLongestFirst, found);
    }
  }
}

/**
 * Every nested relation container in a root field's arguments.
 *
 * @param info - The resolver info of the root mutation field.
 * @param args - The field's arguments.
 * @param modelsLongestFirst - Model names sorted longest first.
 * @returns The nested writes, outermost first.
 */
export function findNestedWrites(
  info: Pick<GraphQLResolveInfo, 'parentType' | 'fieldName'>,
  args: Record<string, unknown>,
  modelsLongestFirst: readonly string[]
): NestedWrite[] {
  const found: NestedWrite[] = [];
  const fieldDef = info.parentType.getFields()[info.fieldName];
  if (!fieldDef || !args) return found;
  for (const argDef of fieldDef.args) {
    walk(argDef.type, args[argDef.name], argDef.name, modelsLongestFirst, found);
  }
  return found;
}

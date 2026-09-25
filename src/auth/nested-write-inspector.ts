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
 * Each container is recorded with its parent context — the model holding the
 * relation, the relation name, whether that parent row is being created or
 * updated, its depth, and the parent row's unique selector when the
 * arguments name it — because both authorization
 * (`./nested-write-policy.ts`) and the audit trail decide each hop on its own
 * parent, never on the root.
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

/**
 * Whether the row a data object describes is being created, updated, or only
 * selected (`where`, `connect`, …). A relation container's semantics depend on
 * it: `connect` under a row being created assigns that new row, `connect`
 * under an existing row re-points it.
 */
export type WriteMode = 'create' | 'update' | 'filter';

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
  /**
   * The model whose relation field holds this container: the root model for a
   * direct relation, otherwise the model of the enclosing container. A nested
   * write is authorised against THIS model, never against the root, because a
   * walk that has crossed into another model's rows no longer carries the
   * root's ownership proof.
   */
  readonly parentModel: string;
  /** The relation field on {@link parentModel} (`tradingPolicy`, `fund`, …). */
  readonly relation: string;
  /** Whether the parent row is being created or updated by this mutation. */
  readonly parentMode: WriteMode;
  /** 1 for a relation of the root row, 2 for a relation of a row one level down, … */
  readonly depth: number;
  /**
   * The unique selector of the parent row when the arguments name it: the
   * root `where` for a depth-1 container under an update, or the `where` of a
   * to-many `update` / `upsert` entry. `null` when the parent is being
   * created, or was reached through a to-one relation (whose row is "the
   * related one", which the arguments do not identify).
   */
  readonly parentRowWhere: Readonly<Record<string, unknown>> | null;
}

/** Where the walk is: which model's data it is reading, and in what mode. */
interface WalkContext {
  readonly model: string;
  readonly mode: WriteMode;
  /** Depth of the container that owns {@link model}; 0 for the root. */
  readonly depth: number;
  readonly rowWhere: Record<string, unknown> | null;
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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
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

/** The mode a relation container's operation puts its payload in. */
function modeForContainerOperation(operation: string): WriteMode {
  if (operation === 'create' || operation === 'createMany') return 'create';
  if (operation === 'update' || operation === 'updateMany' || operation === 'upsert') return 'update';
  return 'filter';
}

/**
 * The context a field of a (non-container) input object is read in. Inside
 * the operation wrappers typegraphql-prisma generates (`{ where, data }`,
 * `{ where, create, update }`), the key names the branch; a model's own data
 * fields keep the context they are in.
 */
function contextForField(
  ctx: WalkContext,
  key: string,
  uniqueWhere: Record<string, unknown> | null
): WalkContext {
  if (key === 'where') return { ...ctx, mode: 'filter' };
  if (key === 'create') return { ...ctx, mode: 'create', rowWhere: null };
  if (key === 'update' || key === 'data') {
    return { ...ctx, mode: key === 'update' ? 'update' : ctx.mode, rowWhere: uniqueWhere ?? ctx.rowWhere };
  }
  return ctx;
}

/** The value of a `where` field typed as a unique selector, if the object has one. */
function uniqueWhereOf(
  type: GraphQLInputObjectType,
  record: Record<string, unknown>
): Record<string, unknown> | null {
  const whereField = type.getFields().where;
  if (!whereField) return null;
  const whereType = getNullableType(whereField.type);
  if (!(whereType instanceof GraphQLInputObjectType) || !whereType.name.endsWith('WhereUniqueInput')) {
    return null;
  }
  return asRecord(record.where);
}

function walk(
  type: GraphQLInputType,
  value: unknown,
  path: string,
  relation: string,
  ctx: WalkContext,
  modelsLongestFirst: readonly string[],
  found: NestedWrite[]
): void {
  if (value === null || value === undefined) return;
  const nullable = getNullableType(type);

  if (nullable instanceof GraphQLList) {
    const inner = nullable.ofType as GraphQLInputType;
    const items: unknown[] = Array.isArray(value) ? value : [value];
    items.forEach((item, index) =>
      walk(inner, item, `${path}[${index}]`, relation, ctx, modelsLongestFirst, found)
    );
    return;
  }

  if (!(nullable instanceof GraphQLInputObjectType) || typeof value !== 'object') return;

  const record = value as Record<string, unknown>;
  const fields = nullable.getFields();
  const model = nestedContainerModel(nullable.name, modelsLongestFirst);
  if (model) {
    const operations = Object.keys(record).filter((key) => record[key] !== undefined);
    found.push({
      model,
      operations,
      path,
      connectIds: connectIdsOf(record.connect),
      parentModel: ctx.model,
      relation,
      parentMode: ctx.mode,
      depth: ctx.depth + 1,
      parentRowWhere: ctx.rowWhere,
    });
    for (const operation of operations) {
      const def = fields[operation];
      if (!def) continue;
      const inner: WalkContext = {
        model,
        mode: modeForContainerOperation(operation),
        depth: ctx.depth + 1,
        rowWhere: null,
      };
      walk(def.type, record[operation], `${path}.${operation}`, relation, inner, modelsLongestFirst, found);
    }
    return;
  }

  const uniqueWhere = uniqueWhereOf(nullable, record);
  for (const [key, child] of Object.entries(record)) {
    const def = fields[key];
    if (!def || child === undefined) continue;
    walk(
      def.type,
      child,
      `${path}.${key}`,
      key,
      contextForField(ctx, key, uniqueWhere),
      modelsLongestFirst,
      found
    );
  }
}

/** The root of the walk: the mutation's own model and what it does to it. */
export interface NestedWriteRoot {
  readonly model: string;
  readonly action: 'create' | 'update' | 'upsert' | 'delete' | 'custom';
}

/** The context a root argument is read in. */
function rootContext(root: NestedWriteRoot, argName: string, args: Record<string, unknown>): WalkContext {
  const where = root.action === 'update' || root.action === 'upsert' ? asRecord(args.where) : null;
  const base = { model: root.model, depth: 0 };
  if (argName === 'create') return { ...base, mode: 'create', rowWhere: null };
  if (argName === 'update') return { ...base, mode: 'update', rowWhere: where };
  if (argName === 'data') {
    return root.action === 'create'
      ? { ...base, mode: 'create', rowWhere: null }
      : { ...base, mode: 'update', rowWhere: where };
  }
  return { ...base, mode: 'filter', rowWhere: null };
}

/**
 * Every nested relation container in a root field's arguments.
 *
 * @param info - The resolver info of the root mutation field.
 * @param args - The field's arguments.
 * @param modelsLongestFirst - Model names sorted longest first.
 * @param root - The root mutation's model and action.
 * @returns The nested writes, outermost first.
 */
export function findNestedWrites(
  info: Pick<GraphQLResolveInfo, 'parentType' | 'fieldName'>,
  args: Record<string, unknown>,
  modelsLongestFirst: readonly string[],
  root: NestedWriteRoot
): NestedWrite[] {
  const found: NestedWrite[] = [];
  const fieldDef = info.parentType.getFields()[info.fieldName];
  if (!fieldDef || !args) return found;
  for (const argDef of fieldDef.args) {
    walk(
      argDef.type,
      args[argDef.name],
      argDef.name,
      argDef.name,
      rootContext(root, argDef.name, args),
      modelsLongestFirst,
      found
    );
  }
  return found;
}

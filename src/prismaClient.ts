import { Prisma, PrismaClient } from '@prisma/client';
// Note: `@prisma/extension-accelerate` is installed and available for future
// use (per-query `cacheStrategy()` etc.). It is NOT applied here because
// basic pool multiplexing — the primary benefit we want from Accelerate —
// is activated purely by the `prisma://` DATABASE_URL scheme and does not
// require the client extension. Adding the extension would change the
// PrismaClient type surface, forcing casts throughout the audit-logger
// plugin and server context injection. Revisit if we adopt per-query
// caching strategies.
import { logger } from './utils/logger';
import { withRelationBatching } from './prisma/relation-batcher';

/**
 * Define the global type for PrismaClient to use across environments
 */
declare global {
  // This works in both browser and Node.js environments
  var prisma: PrismaClient | undefined;
}

/**
 * Default ceiling for a read bounded by nothing but table size.
 *
 * A `findMany` with no `take` materialises an entire table into this process's
 * fixed heap. That is survivable while a table is small and becomes an outage
 * when it is not: `account_decision_records` reached 1.4 GB and `audit_logs`
 * 3.8 GB, either of which exhausts the heap on a single unqualified read and
 * takes the API down for every caller, including the trading engine reading
 * its own governed policy. A relation list loaded with no `take` has exactly
 * the same shape — `alpacaAccount.alerts` for a long-lived account is an
 * unbounded child table reached through a bounded parent.
 *
 * The value sits above every result set any current caller can produce — the
 * largest is `trade.getAll` at roughly 25k rows — so it is inert for every
 * query in service today and active only for a read bounded by nothing but
 * table size.
 */
export const DEFAULT_FIND_MANY_TAKE = 50_000;

/**
 * Resolve the ceiling, allowing an operator to lower it without a deploy.
 *
 * @returns The row ceiling to apply to an unqualified read.
 */
export function resolveFindManyTake(): number {
  const raw = process.env.PRISMA_FIND_MANY_DEFAULT_TAKE;
  if (raw === undefined || raw.trim() === '') return DEFAULT_FIND_MANY_TAKE;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    logger.warn(
      'PRISMA_FIND_MANY_DEFAULT_TAKE is not a positive integer — using the built-in ceiling',
      { provided: raw, using: DEFAULT_FIND_MANY_TAKE }
    );
    return DEFAULT_FIND_MANY_TAKE;
  }
  return parsed;
}

/**
 * Separate ceiling for RELATION lists, deliberately unset by default.
 *
 * The relation ceiling is enforced by giving an unbounded relation a `take`,
 * and a `take` is not order-neutral. Measured against this repo's own schema on
 * PostgreSQL 14 with 20 child rows and no `orderBy`:
 *
 *   no take : 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19
 *   take    : 15,12,8,16,9,0,7,17,2,14,3,13,6,11,1,5,4,18,19,10
 *
 * Same rows, different order, stable across runs; with an explicit `orderBy`
 * the two are byte-identical. Prisma applies a per-parent limit with a window
 * function, and partitioning re-plans the scan. SQL guarantees no ordering
 * without `ORDER BY`, so the unbounded order was never contractual — but it is
 * what consumers observe today, and at least one reads a relation list by
 * position (the engine's signal-outcome reconciler takes `trade.actions[0]`).
 * Turning the ceiling on by default would hand that consumer a different row
 * on every read: a silent wrong answer on every relation load, not just the
 * oversized ones, which is a worse failure than the one being prevented.
 *
 * So the mechanism ships inert. Unset, relation arguments are passed through
 * untouched and the guard only OBSERVES, reporting any relation list that
 * exceeds {@link resolveFindManyTake} so the exposure is measured rather than
 * assumed. Set to a positive integer, the ceiling is enforced. What graduates
 * it: every relation read that is consumed by position carries an explicit
 * `orderBy`, at which point the bound is byte-identical to the unbounded read.
 *
 * @returns The relation-list ceiling, or undefined when only observing.
 */
export function resolveRelationTakeCeiling(): number | undefined {
  const raw = process.env.PRISMA_RELATION_TAKE_CEILING;
  if (raw === undefined || raw.trim() === '') return undefined;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    logger.warn(
      'PRISMA_RELATION_TAKE_CEILING is not a positive integer — relation lists stay unbounded and observed only',
      { provided: raw }
    );
    return undefined;
  }
  return parsed;
}

/**
 * Operations that resolve to a list of records rather than a single record.
 *
 * The distinction decides how a result is read back: a single-record operation
 * that nevertheless resolves to an array has had a fluent relation chain
 * unwrapped out of it, and the array is the relation's rows, not the model's.
 */
const LIST_RETURNING_OPERATIONS: ReadonlySet<string> = new Set([
  'findMany',
  'createManyAndReturn',
  'updateManyAndReturn',
]);

/**
 * Metadata for one relation field, taken from the runtime datamodel.
 *
 * `isList` carries the weight: only a to-many relation can return an unbounded
 * number of rows, and a `take` injected into anything else is a query the
 * engine rejects.
 */
interface RelationMeta {
  /** The model the relation points at, so nested selections can be walked. */
  readonly targetModel: string;
  /** True when the relation resolves to a list rather than a single record. */
  readonly isList: boolean;
}

/** Relation fields of one model, keyed by field name. */
type ModelRelations = ReadonlyMap<string, RelationMeta>;

let relationIndexCache: ReadonlyMap<string, ModelRelations> | undefined;

/**
 * Index every model's relation fields from the runtime datamodel.
 *
 * Built from `Prisma.dmmf`, the same description of the schema the query
 * engine itself uses, so the index cannot drift from the schema the way a
 * hand-maintained list of relations would. Computed once; the datamodel is
 * immutable for the life of the process.
 *
 * @returns Model name to its relation fields.
 */
function relationIndex(): ReadonlyMap<string, ModelRelations> {
  if (relationIndexCache) return relationIndexCache;
  const index = new Map<string, ModelRelations>();
  for (const model of Prisma.dmmf.datamodel.models) {
    const relations = new Map<string, RelationMeta>();
    for (const field of model.fields) {
      if (field.kind !== 'object') continue;
      relations.set(field.name, {
        targetModel: field.type,
        isList: field.isList,
      });
    }
    index.set(model.name, relations);
  }
  relationIndexCache = index;
  return index;
}

/**
 * True for a value that can carry Prisma arguments — a `select`/`include`
 * node, or a relation's own argument object.
 *
 * @param value - The value to test.
 * @returns Whether the value is a plain argument object.
 */
function isArgumentObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

/**
 * Raised when a relation list holds more rows than the enforced ceiling allows
 * this process to load in one read.
 *
 * It is thrown rather than resolved with a shortened list because a truncated
 * relation list is indistinguishable, to its caller, from a complete one: a
 * reconciliation or realised-P&L read that silently loses rows produces a
 * wrong number wearing the shape of a right one, which is worse than the
 * failure. The caller's remedy is to state its own `take` — an explicit bound
 * is always honoured — or to page the relation.
 *
 * This is deliberately stricter than the top-level `findMany` ceiling, which
 * truncates and warns. That ceiling was set against audited call sites and is
 * known to sit above all of them; relation lists have never been audited, so
 * one arriving at the ceiling is an unknown quantity and stays unknown to its
 * caller rather than being answered with a guess.
 */
export class RelationReadTooLargeError extends Error {
  /** The model the read was rooted at. */
  public readonly model: string;
  /** Dotted path of the relation that exceeded the ceiling, from the root. */
  public readonly relationPath: string;
  /** The ceiling that was exceeded. */
  public readonly ceiling: number;

  /**
   * @param model - The model the read was rooted at.
   * @param relationPath - Dotted path of the offending relation.
   * @param ceiling - The ceiling that was exceeded.
   */
  public constructor(model: string, relationPath: string, ceiling: number) {
    super(
      `Relation ${model}.${relationPath} holds more than ${ceiling} rows for this read. ` +
        'Loading it would materialise the whole child list into the API heap, so the read was ' +
        'refused rather than answered with a silently truncated list. Give this relation an ' +
        'explicit `take` (an explicit bound is always honoured) or page it.'
    );
    this.name = 'RelationReadTooLargeError';
    this.model = model;
    this.relationPath = relationPath;
    this.ceiling = ceiling;
  }
}

/**
 * Rewrite one `select`/`include` node so every unbounded to-many relation
 * carries a probe limit of `ceiling + 1`.
 *
 * The probe sits one row ABOVE the ceiling on purpose. A `take` of exactly the
 * ceiling cannot tell "there are exactly this many rows" from "there are more
 * and you have been truncated"; `ceiling + 1` makes that distinction exact,
 * which is what lets the guard refuse the read instead of guessing.
 *
 * @param model - Model the node selects from.
 * @param node - The `select` or `include` object to rewrite.
 * @param ceiling - Row ceiling per relation list.
 * @param path - Dotted path of `node` from the root selection.
 * @param probed - Collects the dotted paths a probe limit was injected at.
 * @returns A rewritten copy; the input is not mutated.
 */
function boundRelationSelections(
  model: string,
  node: Readonly<Record<string, unknown>>,
  ceiling: number,
  path: string,
  probed: Set<string>
): Record<string, unknown> {
  const relations = relationIndex().get(model);
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(node)) {
    const meta = relations?.get(key);
    if (!meta) {
      // A scalar field, `_count`, or a key this datamodel does not describe.
      // Anything the index does not recognise passes through untouched:
      // guessing at an unknown key is how a guard turns a working query into
      // a rejected one.
      out[key] = value;
      continue;
    }

    const childPath = path === '' ? key : `${path}.${key}`;

    if (value === true) {
      out[key] = meta.isList ? { take: ceiling + 1 } : value;
      if (meta.isList) probed.add(childPath);
      continue;
    }

    if (!isArgumentObject(value)) {
      out[key] = value;
      continue;
    }

    const child: Record<string, unknown> = { ...value };
    if (isArgumentObject(child.select)) {
      child.select = boundRelationSelections(
        meta.targetModel,
        child.select,
        ceiling,
        childPath,
        probed
      );
    }
    if (isArgumentObject(child.include)) {
      child.include = boundRelationSelections(
        meta.targetModel,
        child.include,
        ceiling,
        childPath,
        probed
      );
    }
    // An explicit `take` is always honoured: a caller that has stated how many
    // rows it wants has already bounded itself, and overriding that would be
    // the guard changing an answer rather than protecting the process.
    if (meta.isList && (child.take === undefined || child.take === null)) {
      child.take = ceiling + 1;
      probed.add(childPath);
    }
    out[key] = child;
  }

  return out;
}

/** A rewritten argument object plus the relation paths that were probed. */
export interface RelationCeilingResult {
  /** The arguments to dispatch, with probe limits injected. */
  readonly args: Record<string, unknown>;
  /** Dotted paths of the relations a probe limit was injected at. */
  readonly probed: ReadonlySet<string>;
}

/**
 * Apply the relation-list ceiling to one operation's arguments.
 *
 * Only `select` and `include` are walked. `data` is never touched — a nested
 * write is not a read and has no row ceiling to apply.
 *
 * @param model - The model the operation is rooted at.
 * @param args - The operation's arguments.
 * @param ceiling - Row ceiling per relation list, or undefined to pass the
 *   arguments through unchanged.
 * @returns The rewritten arguments and the probed relation paths.
 */
export function applyRelationCeiling(
  model: string,
  args: Readonly<Record<string, unknown>>,
  ceiling: number | undefined
): RelationCeilingResult {
  const probed = new Set<string>();
  const out: Record<string, unknown> = { ...args };
  if (ceiling === undefined) return { args: out, probed };
  if (isArgumentObject(out.select)) {
    out.select = boundRelationSelections(model, out.select, ceiling, '', probed);
  }
  if (isArgumentObject(out.include)) {
    out.include = boundRelationSelections(
      model,
      out.include,
      ceiling,
      '',
      probed
    );
  }
  return { args: out, probed };
}

/** Where a fluent relation chain's unwrapped array belongs in the selection. */
interface FluentAnchor {
  /** Model that owns the node holding the terminal relation. */
  readonly model: string;
  /** The `select`/`include` node holding the terminal relation. */
  readonly node: Readonly<Record<string, unknown>>;
  /** The terminal to-many relation's field name. */
  readonly field: string;
  /** Dotted path of `node` from the root selection. */
  readonly path: string;
}

/**
 * Locate the terminal to-many relation of a fluent chain.
 *
 * A fluent relation load (`trade.findUnique({where}).actions()`) dispatches as
 * the PARENT's `findUnique` carrying a single-key `select` for the relation,
 * and resolves to the relation's rows with the parent stripped off. To measure
 * those rows they have to be put back where the selection says they came from,
 * which means following the one key the chain descends through at each level.
 *
 * @param model - Model the node selects from.
 * @param node - The `select`/`include` node.
 * @param path - Dotted path of `node` from the root selection.
 * @returns The anchor, or undefined when the node is not a single-key chain.
 */
function resolveFluentAnchor(
  model: string,
  node: Readonly<Record<string, unknown>>,
  path: string
): FluentAnchor | undefined {
  const entries = Object.entries(node);
  if (entries.length !== 1) return undefined;
  const [key, value] = entries[0];
  const meta = relationIndex().get(model)?.get(key);
  if (!meta) return undefined;
  if (meta.isList) return { model, node, field: key, path };
  if (!isArgumentObject(value)) return undefined;
  const childPath = path === '' ? key : `${path}.${key}`;
  const nested = isArgumentObject(value.select)
    ? value.select
    : isArgumentObject(value.include)
      ? value.include
      : undefined;
  if (!nested) return undefined;
  return resolveFluentAnchor(meta.targetModel, nested, childPath);
}

/**
 * Reported when a relation list is found to hold more rows than the ceiling.
 *
 * @param relationPath - Dotted path of the relation, from the root selection.
 * @param count - Rows the relation came back with.
 */
type OversizeRelationHandler = (relationPath: string, count: number) => void;

/**
 * Walk a result against the selection that produced it and report every
 * relation list that came back above the ceiling.
 *
 * Only array lengths are read, never array contents, so the walk costs one
 * property read per selected relation per record and does not scale with the
 * number of child rows.
 *
 * @param model - The model this level of the result describes.
 * @param node - The `select`/`include` node for this level.
 * @param value - The result value for this level (a record or a list).
 * @param ceiling - Row ceiling per relation list.
 * @param path - Dotted path of `node` from the root selection.
 * @param restrictTo - Relation paths to check, or undefined to check them all.
 * @param onOversize - Called for each relation list over the ceiling.
 */
function walkRelationCounts(
  model: string,
  node: Readonly<Record<string, unknown>>,
  value: unknown,
  ceiling: number,
  path: string,
  restrictTo: ReadonlySet<string> | undefined,
  onOversize: OversizeRelationHandler
): void {
  if (Array.isArray(value)) {
    for (const element of value) {
      walkRelationCounts(
        model,
        node,
        element,
        ceiling,
        path,
        restrictTo,
        onOversize
      );
    }
    return;
  }
  if (!isArgumentObject(value)) return;

  const relations = relationIndex().get(model);
  for (const [key, argument] of Object.entries(node)) {
    const meta = relations?.get(key);
    if (!meta) continue;

    const childPath = path === '' ? key : `${path}.${key}`;
    const child: unknown = value[key];

    if (
      meta.isList &&
      (restrictTo === undefined || restrictTo.has(childPath)) &&
      Array.isArray(child) &&
      child.length > ceiling
    ) {
      onOversize(childPath, child.length);
    }

    if (!isArgumentObject(argument)) continue;
    if (isArgumentObject(argument.select)) {
      walkRelationCounts(
        meta.targetModel,
        argument.select,
        child,
        ceiling,
        childPath,
        restrictTo,
        onOversize
      );
    }
    if (isArgumentObject(argument.include)) {
      walkRelationCounts(
        meta.targetModel,
        argument.include,
        child,
        ceiling,
        childPath,
        restrictTo,
        onOversize
      );
    }
  }
}

/**
 * Relation paths already reported while only observing, so a hot path reports
 * each exposure once instead of on every read.
 */
const reportedOversizeRelations = new Set<string>();

/**
 * Clear the once-per-path observation log.
 *
 * Exists so a test can assert the reporting behaviour twice in one process.
 */
export function resetOversizeRelationReports(): void {
  reportedOversizeRelations.clear();
}

/**
 * Measure a completed read's relation lists against the ceiling.
 *
 * Handles both result shapes the client produces: a record (or list of
 * records) carrying its selected relations, and the bare relation array a
 * fluent chain resolves to with its parent stripped off.
 *
 * @param input - The operation, the arguments that produced the result, the
 *   result itself, the ceiling, the paths to restrict to, and the handler.
 */
function measureResultRelations(input: {
  /** The model the operation was rooted at. */
  readonly model: string;
  /** The operation name, which decides the result shape. */
  readonly operation: string;
  /** The arguments that produced the result. */
  readonly args: Readonly<Record<string, unknown>>;
  /** The value the query resolved to. */
  readonly result: unknown;
  /** Row ceiling per relation list. */
  readonly ceiling: number;
  /** Relation paths to check, or undefined to check them all. */
  readonly restrictTo: ReadonlySet<string> | undefined;
  /** Called for each relation list over the ceiling. */
  readonly onOversize: OversizeRelationHandler;
}): void {
  const { model, operation, args, result, ceiling, restrictTo, onOversize } =
    input;

  const selection = isArgumentObject(args.select)
    ? args.select
    : isArgumentObject(args.include)
      ? args.include
      : undefined;
  if (!selection) return;

  // A single-record operation that resolved to an array had a fluent relation
  // chain unwrapped out of it. Put the rows back under the relation the chain
  // terminates at, so one walk covers both shapes.
  if (!LIST_RETURNING_OPERATIONS.has(operation) && Array.isArray(result)) {
    const anchor = resolveFluentAnchor(model, selection, '');
    if (!anchor) return;
    walkRelationCounts(
      anchor.model,
      anchor.node,
      { [anchor.field]: result },
      ceiling,
      anchor.path,
      restrictTo,
      onOversize
    );
    return;
  }

  walkRelationCounts(
    model,
    selection,
    result,
    ceiling,
    '',
    restrictTo,
    onOversize
  );
}

/** Empty probe set, shared so the disabled path allocates nothing. */
const NO_PROBED_RELATIONS: ReadonlySet<string> = new Set<string>();

/** Inputs to {@link runGuardedOperation}. */
export interface GuardedOperationInput {
  /** The model the operation is rooted at. */
  readonly model: string;
  /** The operation name, e.g. `findMany` or `findUnique`. */
  readonly operation: string;
  /** The caller's arguments. Not mutated; copied before anything is added. */
  readonly args: Record<string, unknown>;
  /** Row ceiling for an unqualified top-level `findMany`. */
  readonly findManyCeiling: number;
  /** Ceiling to ENFORCE on relation lists, or undefined to only observe. */
  readonly relationCeiling: number | undefined;
  /** Executes the operation with the rewritten arguments. */
  readonly query: (args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Run one model operation under the unbounded-read ceilings.
 *
 * Separated from the client extension so the whole policy is reachable without
 * a database: the extension supplies Prisma's `query` continuation, a test
 * supplies its own.
 *
 * @param input - The operation, its arguments, the ceilings, and the executor.
 * @returns Whatever the executor resolved to, once it is within the ceiling.
 * @throws RelationReadTooLargeError when an ENFORCED relation ceiling is
 *   exceeded. While only observing, an oversized relation is logged and the
 *   rows are returned unchanged.
 */
export async function runGuardedOperation(
  input: GuardedOperationInput
): Promise<unknown> {
  const { model, operation, args, findManyCeiling, relationCeiling, query } =
    input;

  // Nothing is copied unless something is actually injected. This runs on
  // every model operation the process issues, and the read it exists to bound
  // is one whose cost is already CPU on the single event-loop thread.
  const relationBound =
    relationCeiling === undefined
      ? undefined
      : applyRelationCeiling(model, args, relationCeiling);
  const probed = relationBound?.probed ?? NO_PROBED_RELATIONS;
  const bounded = relationBound?.args ?? args;

  const capsTopLevel =
    operation === 'findMany' &&
    (bounded.take === undefined || bounded.take === null);
  const dispatched: Record<string, unknown> = capsTopLevel
    ? { ...bounded, take: findManyCeiling }
    : bounded;

  const result: unknown = await query(dispatched);

  if (capsTopLevel && Array.isArray(result) && result.length >= findManyCeiling) {
    logger.warn(
      'Unqualified findMany returned the ceiling row count — the result is probably truncated; give this call site an explicit take',
      { model, ceiling: findManyCeiling, returned: result.length }
    );
  }

  if (relationCeiling !== undefined) {
    if (probed.size > 0) {
      measureResultRelations({
        model,
        operation,
        args: dispatched,
        result,
        ceiling: relationCeiling,
        restrictTo: probed,
        onOversize: (relationPath) => {
          throw new RelationReadTooLargeError(
            model,
            relationPath,
            relationCeiling
          );
        },
      });
    }
    return result;
  }

  // Observation only: relation arguments were not touched, so every list is
  // complete and its length is the true exposure. Reported once per path so a
  // per-row relation resolver does not flood the log.
  measureResultRelations({
    model,
    operation,
    args: dispatched,
    result,
    ceiling: findManyCeiling,
    restrictTo: undefined,
    onOversize: (relationPath, count) => {
      const key = `${model}.${relationPath}`;
      if (reportedOversizeRelations.has(key)) return;
      reportedOversizeRelations.add(key);
      logger.warn(
        'Relation list exceeded the unbounded-read ceiling — it is loaded in full because PRISMA_RELATION_TAKE_CEILING is unset; give this relation an explicit take',
        { model, relationPath, ceiling: findManyCeiling, returned: count }
      );
    },
  });

  return result;
}

/**
 * The shape Prisma hands a `$allModels.$allOperations` query hook.
 *
 * Declared here rather than imported because Prisma's own hook type is
 * parameterised over every model and operation, and instantiating it is what
 * blows the checker's union limit.
 */
type QueryHook = (params: {
  /** Name of the model the operation is rooted at. */
  readonly model: string;
  /** Name of the operation, e.g. `findMany` or `findUnique`. */
  readonly operation: string;
  /** The caller's arguments, whatever shape the operation takes. */
  readonly args: unknown;
  /** Continues the operation with the given arguments. */
  readonly query: (args: Record<string, unknown>) => Promise<unknown>;
}) => Promise<unknown>;

/** The extension object installed by {@link withUnboundedReadGuard}. */
interface UnboundedReadExtension {
  /** Extension name, surfaced in Prisma's own diagnostics. */
  readonly name: string;
  /** Query hooks, registered across every model and operation. */
  readonly query: {
    readonly $allModels: {
      readonly $allOperations: QueryHook;
    };
  };
}

/** The one method of the client this guard needs, typed without the product. */
interface ExtendableClient {
  /**
   * Installs a client extension.
   *
   * @param extension - The extension to install.
   * @returns The extended client.
   */
  $extends(extension: UnboundedReadExtension): unknown;
}

/**
 * Apply the unbounded-read ceilings to a Prisma client.
 *
 * Two kinds of read are bounded by nothing but table size, and they reach the
 * engine as DIFFERENT operations, which is why one hook cannot cover both:
 *
 *  1. A TOP-LEVEL `findMany` with no `take`. Dispatched as `findMany`. Capped
 *     at {@link resolveFindManyTake} and warned about if it comes back full.
 *     Enforced, as it has been.
 *  2. A RELATION LIST with no `take`, however it is requested — `include`,
 *     `select`, or a fluent chain. A fluent chain does NOT dispatch as
 *     `findMany`: `trade.findUnique({where}).actions()` reaches the extension
 *     as `Trade.findUnique` carrying `select: { actions: true }`, and so does
 *     `include: { actions: true }` (pinned by the dispatch-shape test). A hook
 *     registered only on `findMany` therefore sees none of them, which is why
 *     every relation list the GraphQL API serves has been entirely unbounded
 *     despite the guard — the path that matters most in practice, because the
 *     generated relation resolvers load a relation once per parent row.
 *
 * The relation limb is OBSERVED by default and enforced only when
 * `PRISMA_RELATION_TAKE_CEILING` is set: enforcing it means giving the
 * relation a `take`, and a `take` reorders an unordered relation list. See
 * {@link resolveRelationTakeCeiling} for the measurement and the graduation
 * criterion. An explicit `take` is always honoured either way.
 *
 * @param client - The client to wrap.
 * @returns The client with the ceilings applied.
 */
export function withUnboundedReadGuard(client: PrismaClient): PrismaClient {
  const findManyCeiling = resolveFindManyTake();
  const relationCeiling = resolveRelationTakeCeiling();
  const extension: UnboundedReadExtension = {
    name: 'unbounded-read-ceiling',
    query: {
      $allModels: {
        $allOperations: ({ model, operation, args, query }) =>
          runGuardedOperation({
            model,
            operation,
            args: isArgumentObject(args) ? args : {},
            findManyCeiling,
            relationCeiling,
            query: (bounded) => query(bounded),
          }),
      },
    },
  };
  // Two assertions, both confined to this boundary.
  //
  // The first is on the way in. Prisma types `$extends` against the product of
  // every model and every operation; asking it to check an `$allOperations`
  // hook across the whole datamodel exceeds the checker's union limit outright
  // (TS2590). The hook itself is fully typed above — `QueryHook` states the
  // exact shape Prisma passes it — so the check that matters is kept and only
  // the combinatorial one is skipped.
  //
  // The second is on the way out. Prisma types an extended client as a
  // structurally distinct object even when, as here, the extension only wraps
  // query execution and adds, removes and renames nothing on the model
  // surface. The delegates callers use are the same delegates.
  const extendable = client as unknown as ExtendableClient;
  return extendable.$extends(extension) as unknown as PrismaClient;
}

/**
 * Install every client extension this process runs with, in the one order that
 * is correct.
 *
 * Prisma runs the extension installed FIRST as the OUTERMOST query hook. That
 * is a property of Prisma's extension layering, not of the JavaScript call
 * nesting, and it is pinned by an executed test (`src/tests/
 * prisma-relation-batching.test.ts`) against the installed version rather than
 * assumed. The ceiling guard must be outermost: it rewrites arguments before
 * anything else sees them and measures the value the caller finally receives,
 * and a relation batcher placed outside it would hide every fluent relation
 * load — the path the guard exists to watch — from it entirely.
 *
 * Applied at BOTH client-assignment sites. An extension installed only on the
 * initial client silently disappears on the first reconnect, which is precisely
 * when the process is already unhealthy.
 *
 * @param client - The freshly constructed client.
 * @returns The client with every extension installed.
 */
export function applyClientExtensions(client: PrismaClient): PrismaClient {
  return withRelationBatching(withUnboundedReadGuard(client));
}

/** Default statement timeout (30s) prevents hung queries from blocking pool slots indefinitely */
const DEFAULT_STATEMENT_TIMEOUT_MS = 30000;

/** Heartbeat interval: how often we verify the DB connection is alive */
const HEARTBEAT_INTERVAL_MS = 30000;

/** Consecutive heartbeat failures before triggering client reconnection */
const MAX_HEARTBEAT_FAILURES = 3;

/** Heartbeat query timeout (5s) — shorter than pool timeout to detect issues early */
const HEARTBEAT_TIMEOUT_MS = 5000;

/**
 * Connection pool size defaults per deployment tier.
 * Can be overridden via the DATABASE_POOL_SIZE environment variable.
 *
 * Production raised from 20 to 35 to give Prisma more headroom against the
 * Apollo client's `maxConcurrentOperations` budget (also lowered to 50 in
 * src/client.ts). Prior 20:100 ratio let 80 concurrent in-flight ops queue
 * on a saturated pool, producing the "DatabaseHealthCheck exhausted retries
 * (3/3)" cascades observed on Railway adaptic-os/stable. No-op for
 * deployments using Prisma Accelerate (prisma:// URL), where pooling is
 * managed at the proxy and this value is ignored.
 */
const POOL_SIZE_DEFAULTS: Record<string, number> = {
  development: 5,
  staging: 10,
  production: 35,
};

/** Connection pool timeout in milliseconds. Configurable via DATABASE_POOL_TIMEOUT_MS. */
const DEFAULT_POOL_TIMEOUT_MS = 10000;

/**
 * Resolves the connection pool size from environment variables or tier defaults.
 *
 * Priority:
 * 1. DATABASE_POOL_SIZE environment variable (explicit override)
 * 2. Tier default based on NODE_ENV (development: 5, staging: 10, production: 20)
 *
 * @returns The resolved connection pool size
 */
function resolvePoolSize(): number {
  const envPoolSize = process.env.DATABASE_POOL_SIZE;
  if (envPoolSize) {
    const parsed = parseInt(envPoolSize, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
    logger.warn(
      'Invalid DATABASE_POOL_SIZE value, falling back to tier default',
      {
        value: envPoolSize,
      }
    );
  }

  const nodeEnv = process.env.NODE_ENV || 'development';
  return POOL_SIZE_DEFAULTS[nodeEnv] || POOL_SIZE_DEFAULTS.development;
}

/**
 * Resolves the connection pool timeout from environment variables.
 *
 * @returns The resolved pool timeout in milliseconds
 */
function resolvePoolTimeout(): number {
  const envTimeout = process.env.DATABASE_POOL_TIMEOUT_MS;
  if (envTimeout) {
    const parsed = parseInt(envTimeout, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
    logger.warn(
      'Invalid DATABASE_POOL_TIMEOUT_MS value, falling back to default',
      {
        value: envTimeout,
      }
    );
  }
  return DEFAULT_POOL_TIMEOUT_MS;
}

/**
 * Constructs a DATABASE_URL with connection pool parameters appended.
 * Prisma uses URL query parameters for pool configuration when using
 * the data proxy / Accelerate.
 *
 * For direct connections (non-Accelerate), pool settings are managed
 * via the connection_limit and pool_timeout query parameters on the
 * database URL.
 *
 * @returns The database URL with pool parameters
 */
/**
 * True when the given DATABASE_URL points to Prisma Accelerate.
 * Accelerate connections use a `prisma://` scheme and handle pooling
 * at the Accelerate proxy; per-connection Postgres timeouts are not
 * valid as URL params in that case.
 */
function isAccelerateUrl(url: string): boolean {
  return url.startsWith('prisma://') || url.startsWith('prisma+postgres://');
}

function buildDatabaseUrl(): string {
  const baseUrl = process.env.DATABASE_URL || '';
  if (!baseUrl) {
    return baseUrl;
  }

  const poolSize = resolvePoolSize();
  const poolTimeout = resolvePoolTimeout();

  // Accelerate path: Accelerate manages pooling itself at the proxy. We do
  // NOT append `statement_timeout` / `idle_in_transaction_session_timeout`
  // because they are Postgres-specific parameters the Accelerate URL
  // parser would reject. Accelerate URLs carry the api_key as a query
  // param; leave them untouched (pool size is controlled via the Accelerate
  // console, not via URL).
  if (isAccelerateUrl(baseUrl)) {
    logger.info(
      'Prisma Accelerate URL detected — pooling managed by Accelerate proxy',
      {
        environment: process.env.NODE_ENV || 'development',
      }
    );
    return baseUrl;
  }

  // Direct Postgres path: append per-connection pool + timeout params.
  const separator = baseUrl.includes('?') ? '&' : '?';

  logger.info('Database connection pool configured', {
    poolSize,
    poolTimeoutMs: poolTimeout,
    environment: process.env.NODE_ENV || 'development',
  });

  const statementTimeoutMs = parseInt(
    process.env.DATABASE_STATEMENT_TIMEOUT_MS ||
      String(DEFAULT_STATEMENT_TIMEOUT_MS),
    10
  );

  return `${baseUrl}${separator}connection_limit=${poolSize}&pool_timeout=${Math.floor(poolTimeout / 1000)}&statement_timeout=${statementTimeoutMs}&idle_in_transaction_session_timeout=${statementTimeoutMs}`;
}

// Create a singleton that works in all environments
if (!global.prisma) {
  const poolSize = resolvePoolSize();

  const client = new PrismaClient({
    log: [
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
    datasources: {
      db: {
        url: buildDatabaseUrl(),
      },
    },
  });

  // Register event-based log handlers with structured error diagnostics
  client.$on('error' as never, (e: { message: string; timestamp: string }) => {
    const message = e.message || '';

    // Build structured error information for actionable diagnostics
    const errorInfo: Record<string, unknown> = {
      message,
      timestamp: e.timestamp,
      poolSize,
    };

    // Extract Prisma error code (e.g., P2002 unique constraint, P2003 foreign key)
    const prismaCodeMatch =
      message.match(/error code:\s*(P\d+)/i) || message.match(/(P\d{4})/);
    if (prismaCodeMatch) {
      errorInfo.prismaErrorCode = prismaCodeMatch[1];
    }

    // Extract Postgres error code (e.g., 23514 check constraint, 23505 unique)
    const pgCodeMatch = message.match(/(?:error code|code):\s*(\d{5})/);
    if (pgCodeMatch) {
      errorInfo.postgresErrorCode = pgCodeMatch[1];
    }

    // Extract constraint name for violation diagnostics
    const constraintMatch = message.match(/constraint\s+"([^"]+)"/);
    if (constraintMatch) {
      errorInfo.constraintName = constraintMatch[1];
    }

    // Extract model or table name
    const modelMatch = message.match(/(?:model|table|relation)\s+"?(\w+)"?/i);
    if (modelMatch) {
      errorInfo.model = modelMatch[1];
    }

    // Categorize for alerting and triage
    //
    // Two classes of "errors" are expected and handled by the caller and must
    // not pollute ERROR-level logs (they distort error budgets and trigger
    // spurious alerts):
    //
    // 1. "No record was found for a delete/update" — race condition where the
    //    target row was already removed by another worker. Engine callers
    //    handle this gracefully (see crypto-trade-execution-engine.ts and
    //    order-manager.ts deleteTrade()). Demoted to INFO.
    //
    // 2. "Inconsistent column data: Error creating UUID" — caller passed a
    //    non-UUID value to a `String @db.Uuid` column. This is a caller-side
    //    bug; the engine has been hardened to detect synthetic positionIds
    //    upstream (see engine/src/di/options-lifecycle.ts UUID_REGEX guard),
    //    but for any remaining cases, log at WARN with full diagnostics so
    //    callers can be tracked down without flooding ERROR logs.
    const isExpectedDeleteRace =
      message.includes('No record was found for a delete') ||
      message.includes('No record was found for an update');
    const isInvalidUuidInput =
      message.includes('Error creating UUID') ||
      message.includes('Inconsistent column data: Error creating UUID');

    if (isExpectedDeleteRace) {
      errorInfo.category = 'EXPECTED_RACE';
      errorInfo.handledByCaller = true;
      logger.info('Prisma expected race (record already removed)', errorInfo);
    } else if (isInvalidUuidInput) {
      errorInfo.category = 'INVALID_INPUT_FORMAT';
      errorInfo.hint =
        'Caller passed a non-UUID value to a UUID column. Validate inputs upstream.';
      logger.warn('Prisma rejected invalid UUID input', errorInfo);
    } else if (
      message.includes('pool') ||
      message.includes('connection') ||
      message.includes('timeout')
    ) {
      errorInfo.category = 'CONNECTION_POOL';
      logger.error('Database connection pool issue detected', errorInfo);
    } else if (prismaCodeMatch || pgCodeMatch) {
      errorInfo.category = 'DATA_INTEGRITY';
      logger.error('Prisma data integrity error', errorInfo);
    } else {
      errorInfo.category = 'UNKNOWN';
      logger.error('Prisma client error', errorInfo);
    }
  });

  client.$on('warn' as never, (e: { message: string }) => {
    logger.warn('Prisma client warning', { message: e.message });
  });

  // Soft-delete filtering is handled at the application/middleware level
  // via the soft-delete middleware (see src/middleware/soft-delete.ts).
  // Prisma 6 uses client extensions rather than $use() middleware.

  global.prisma = applyClientExtensions(client);
}

// Initialize a singleton PrismaClient with a connection pool that persists across requests
const prisma: PrismaClient = global.prisma;

// ---------------------------------------------------------------------------
// Connection health monitor — detects stale connections before they cause
// query hangs by periodically running a lightweight heartbeat query.
// After MAX_HEARTBEAT_FAILURES consecutive failures, the client is
// disconnected and reconnected to force Prisma to establish fresh connections.
// ---------------------------------------------------------------------------

let heartbeatFailures = 0;
let heartbeatTimer: ReturnType<typeof setInterval> | undefined;
let isReconnecting = false;

async function heartbeat(): Promise<void> {
  if (isReconnecting || !global.prisma) return;

  try {
    const start = Date.now();
    await Promise.race([
      global.prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Heartbeat timeout')),
          HEARTBEAT_TIMEOUT_MS
        )
      ),
    ]);
    const latencyMs = Date.now() - start;

    if (heartbeatFailures > 0) {
      logger.info('Database heartbeat recovered', {
        latencyMs,
        previousFailures: heartbeatFailures,
      });
    }
    heartbeatFailures = 0;
  } catch (error) {
    heartbeatFailures++;
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn('Database heartbeat failed', {
      consecutiveFailures: heartbeatFailures,
      error: errorMessage,
    });

    if (heartbeatFailures >= MAX_HEARTBEAT_FAILURES) {
      logger.error(
        'Database heartbeat exceeded failure threshold, reconnecting Prisma client',
        {
          consecutiveFailures: heartbeatFailures,
        }
      );
      await reconnectPrisma();
    }
  }
}

async function reconnectPrisma(): Promise<void> {
  if (isReconnecting) return;
  isReconnecting = true;

  try {
    // Disconnect existing client — this drops all pooled connections
    try {
      await Promise.race([
        global.prisma?.$disconnect(),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
    } catch {
      // Disconnect may fail if DB is unreachable — that's expected
    }

    // Create a fresh client with the same configuration
    const newClient = new PrismaClient({
      log: [
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
      datasources: {
        db: {
          url: buildDatabaseUrl(),
        },
      },
    });

    // Re-register error/warn handlers
    newClient.$on(
      'error' as never,
      (e: { message: string; timestamp: string }) => {
        logger.error('Prisma client error (reconnected)', {
          message: e.message,
          timestamp: e.timestamp,
        });
      }
    );
    newClient.$on('warn' as never, (e: { message: string }) => {
      logger.warn('Prisma client warning (reconnected)', {
        message: e.message,
      });
    });

    global.prisma = applyClientExtensions(newClient);
    heartbeatFailures = 0;
    logger.info('Prisma client reconnected successfully');
  } catch (error) {
    logger.error('Failed to reconnect Prisma client', {
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    isReconnecting = false;
  }
}

/**
 * Starts the periodic database heartbeat monitor.
 * Call once during server startup. The returned cleanup function
 * must be called during graceful shutdown.
 */
export function startConnectionHealthMonitor(): () => void {
  if (heartbeatTimer) return () => stopConnectionHealthMonitor();

  logger.info('Starting database connection health monitor', {
    intervalMs: HEARTBEAT_INTERVAL_MS,
    failureThreshold: MAX_HEARTBEAT_FAILURES,
  });

  heartbeatTimer = setInterval(() => {
    void heartbeat();
  }, HEARTBEAT_INTERVAL_MS);

  // Run an initial heartbeat immediately
  void heartbeat();

  return () => stopConnectionHealthMonitor();
}

/**
 * Stops the periodic heartbeat monitor. Safe to call multiple times.
 */
export function stopConnectionHealthMonitor(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = undefined;
    logger.info('Database connection health monitor stopped');
  }
}

/**
 * Disconnects the Prisma client with a timeout to prevent hanging during shutdown.
 * @param timeoutMs - Maximum time to wait for disconnect (default: 5000ms)
 */
export async function disconnectWithTimeout(timeoutMs = 5000): Promise<void> {
  stopConnectionHealthMonitor();

  if (!global.prisma) return;

  try {
    await Promise.race([
      global.prisma.$disconnect(),
      new Promise<void>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(`Prisma disconnect timed out after ${timeoutMs}ms`)
            ),
          timeoutMs
        )
      ),
    ]);
    logger.info('Database connections closed successfully');
  } catch (error) {
    logger.warn('Database disconnect did not complete cleanly', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export default prisma;

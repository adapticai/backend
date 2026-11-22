import type { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import {
  relationBatchLoadsTotal,
  relationBatchQueriesTotal,
  relationBatchSeamMissesTotal,
} from '../config/metrics';

/**
 * Largest number of parent keys folded into one batched read.
 *
 * A batch becomes a single `WHERE <key> IN (...)` whose keys are one bind
 * parameter each, against a wire-protocol ceiling of 65,535 parameters per
 * statement. Past that a statement fails outright rather than running slowly,
 * so the chunk exists to keep the batch representable — not to make it faster.
 *
 * The limit therefore sits far above any list a caller produces, because
 * splitting costs the thing batching is for. Measured on a 2,022-row read: a
 * chunk of 500 turned one read's 3 SQL statements into 11 and handed most of
 * the saving back in round trips, while a chunk above the cohort size held at
 * the same 3 statements the unbatched path issues. Prisma's own findUnique
 * compaction applies no chunking at all, so one large IN list is already the
 * shape its engine emits for this read.
 */
export const MAX_BATCH_KEYS = 20000;

/**
 * Length of the `dataPath` Prisma attaches to a single-hop fluent relation
 * load.
 *
 * `prisma.trade.findUnique({ where }).actions(args)` is dispatched as a
 * `findUnique` carrying `dataPath: ['select', 'actions']`, and the result is
 * unwrapped along that path below the extension layer, so the caller receives
 * the relation value rather than the parent row. A `findUnique` the caller
 * wrote by hand — even one selecting the same relation, and even one using
 * `include` — carries `dataPath: []`. That difference is the only thing
 * distinguishing the two, and it is what makes it safe for this extension to
 * return a relation value in place of a parent row.
 */
const FLUENT_DATA_PATH_LENGTH = 2;

/** First segment of a fluent relation load's `dataPath`. */
const FLUENT_DATA_PATH_HEAD = 'select';

/**
 * One parent-keyed relation read waiting to be folded into a batch.
 */
interface PendingLoad {
  readonly keyValue: string | number;
  readonly resolve: (value: unknown) => void;
  readonly reject: (reason: unknown) => void;
}

/**
 * A group of relation reads that differ only in the parent key, and can
 * therefore be served by one query.
 */
interface Batch {
  readonly jsModelName: string;
  readonly keyField: string;
  readonly relation: string;
  readonly relationArgs: unknown;
  readonly pending: PendingLoad[];
}

/**
 * Everything a single fluent relation load contributes to a batch.
 */
export interface RelationLoadPlan {
  /** Prisma's JavaScript name for the parent model's delegate. */
  readonly jsModelName: string;
  /** The unique field the parent was selected by. */
  readonly keyField: string;
  /** This load's value for that field. */
  readonly keyValue: string | number;
  /** The relation field being loaded. */
  readonly relation: string;
  /** The relation's own arguments, passed through untouched. */
  readonly relationArgs: unknown;
}

/**
 * Issues one batched parent read.
 *
 * Injected rather than taken from a client so the batching policy is reachable
 * without a database: production supplies the Prisma delegate, a test supplies
 * its own executor.
 */
export type BatchExecutor = (
  jsModelName: string,
  args: Record<string, unknown>
) => Promise<unknown>;

/**
 * The shape of the query-extension argument this module reads.
 *
 * Declared here rather than imported because Prisma's own hook type is
 * parameterised over every model and operation, and instantiating it is what
 * blows the checker's union limit.
 */
export interface QueryExtensionParams {
  /** Name of the model the operation is rooted at. */
  readonly model?: string;
  /** The caller's arguments, whatever shape the operation takes. */
  readonly args: unknown;
  /** Continues the operation with the given arguments. */
  readonly query: (args: unknown) => Promise<unknown>;
}

/**
 * The private per-request parameters Prisma passes alongside the public ones.
 *
 * `__internalParams` is not part of Prisma's public extension contract. Every
 * field read from it is validated at runtime and every failed validation falls
 * through to the unbatched path, so a future Prisma release that moves or
 * removes it costs throughput and never correctness.
 */
export interface InternalRequestParams {
  /** Path the result is unwrapped along; `['select', <relation>]` when fluent. */
  readonly dataPath?: unknown;
  /** Prisma's JavaScript name for the model delegate, e.g. `trade`. */
  readonly jsModelName?: unknown;
  /** Set when the operation is running inside a transaction. */
  readonly transaction?: unknown;
}

/** The extension object installed by {@link withRelationBatching}. */
interface RelationBatchExtension {
  /** Extension name, surfaced in Prisma's own diagnostics. */
  readonly name: string;
  /** Query hooks, registered across every model. */
  readonly query: {
    readonly $allModels: {
      readonly findUnique: (params: QueryExtensionParams) => Promise<unknown>;
    };
  };
}

/** The one method of the client this module needs, typed without the product. */
interface ExtendableClient {
  /**
   * Installs a client extension.
   *
   * @param extension - The extension to install.
   * @returns The extended client.
   */
  $extends(extension: RelationBatchExtension): unknown;
}

let seamLogged = false;

/**
 * Reset the once-only seam warning. Test support; production never calls it.
 */
export function resetSeamWarningForTest(): void {
  seamLogged = false;
}

/**
 * Read Prisma's private per-request parameters, validating what is used.
 *
 * @param params - The extension callback argument.
 * @returns The private parameters, or `undefined` when the seam is absent.
 */
export function readInternalParams(
  params: QueryExtensionParams
): InternalRequestParams | undefined {
  const candidate = (params as { __internalParams?: unknown }).__internalParams;
  if (typeof candidate !== 'object' || candidate === null) {
    relationBatchSeamMissesTotal.inc();
    if (!seamLogged) {
      seamLogged = true;
      logger.warn(
        'Prisma relation batching is inert: the private __internalParams seam is no longer present on the query extension callback. Relation loads still return correct results, at one client request per parent row. Re-derive the seam against the installed Prisma version.'
      );
    }
    return undefined;
  }
  return candidate as InternalRequestParams;
}

/**
 * True when the value is a plain, non-null, non-array object.
 *
 * @param value - The value to test.
 * @returns Whether the value is a plain object.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Decide whether a `findUnique` is a batchable single-hop fluent relation load.
 *
 * Every condition is a correctness precondition for replacing N parent reads
 * with one, and a failed condition means "run it the way Prisma would" rather
 * than "run it differently":
 *
 * - `dataPath` must be exactly `['select', <relation>]`. A shorter path is a
 *   caller-written `findUnique` whose result is the parent row; a longer one is
 *   a chained load whose unwrapping this batcher does not reproduce.
 * - The read must not be inside a transaction. Folding it into a query issued
 *   outside that transaction would change what it can see and whether it rolls
 *   back with the rest.
 * - The `where` must be one scalar-valued key. Prisma requires a unique
 *   selector on `findUnique`, so a single scalar key is by construction a
 *   unique field and `WHERE <key> IN (...)` selects exactly the same rows. A
 *   compound unique arrives as one object-valued key and is excluded.
 * - `args` must carry nothing beyond that `where` and the single relation
 *   `select` the fluent API generated.
 *
 * @param params - The extension callback argument.
 * @param internal - Prisma's validated private request parameters.
 * @returns A batch plan, or `undefined` when the read must not be batched.
 */
export function planRelationLoad(
  params: QueryExtensionParams,
  internal: InternalRequestParams
): RelationLoadPlan | undefined {
  if (internal.transaction !== undefined) return undefined;

  const dataPath = internal.dataPath;
  if (!Array.isArray(dataPath) || dataPath.length !== FLUENT_DATA_PATH_LENGTH) {
    return undefined;
  }
  if (dataPath[0] !== FLUENT_DATA_PATH_HEAD) return undefined;
  const relation: unknown = dataPath[1];
  if (typeof relation !== 'string' || relation.length === 0) return undefined;

  const jsModelName = internal.jsModelName;
  if (typeof jsModelName !== 'string' || jsModelName.length === 0) {
    return undefined;
  }

  const args = params.args;
  if (!isPlainObject(args)) return undefined;
  const argKeys = Object.keys(args);
  if (argKeys.length !== 2) return undefined;
  if (!argKeys.includes('where') || !argKeys.includes('select')) {
    return undefined;
  }

  const select = args.select;
  if (!isPlainObject(select)) return undefined;
  const selectKeys = Object.keys(select);
  if (selectKeys.length !== 1 || selectKeys[0] !== relation) return undefined;

  const where = args.where;
  if (!isPlainObject(where)) return undefined;
  const whereKeys = Object.keys(where);
  if (whereKeys.length !== 1) return undefined;
  const keyField = whereKeys[0];
  const keyValue = where[keyField];
  if (typeof keyValue !== 'string' && typeof keyValue !== 'number') {
    return undefined;
  }

  return {
    jsModelName,
    keyField,
    keyValue,
    relation,
    relationArgs: select[relation],
  };
}

/**
 * Build a string that is equal for two values exactly when they are
 * structurally equal.
 *
 * Object key order is not part of a Prisma argument's meaning, so the
 * serialisation sorts keys: two structurally identical argument objects written
 * in different orders must not split into two batches.
 *
 * @param value - The value to serialise.
 * @returns A stable string form of the value.
 */
export function stableKey(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'bigint') return `${value.toString()}n`;
  if (value instanceof Date) return `D${value.toISOString()}`;
  if (Array.isArray(value)) return `[${value.map(stableKey).join(',')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([k, v]) => `${JSON.stringify(k)}:${stableKey(v)}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value) ?? String(value);
}

/**
 * Build the key that decides which loads share a query.
 *
 * @param plan - The plan for one relation load.
 * @returns The batch key.
 */
export function batchKey(plan: RelationLoadPlan): string {
  return stableKey([
    plan.jsModelName,
    plan.keyField,
    plan.relation,
    stableKey(plan.relationArgs),
  ]);
}

/**
 * Split an array into chunks of at most `size` entries.
 *
 * @param items - The items to split.
 * @param size - The maximum chunk length.
 * @returns The chunks, in order.
 */
function chunk<T>(items: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

/**
 * Coalesces same-shape fluent relation loads into one query per shape.
 */
export class RelationBatcher {
  private readonly batches = new Map<string, Batch>();

  private flushScheduled = false;

  /**
   * @param execute - Issues one batched parent read.
   */
  constructor(private readonly execute: BatchExecutor) {}

  /**
   * Enqueue one relation load and return its eventual value.
   *
   * @param plan - The batch plan for this load.
   * @returns The relation value, or `null` when the parent row does not exist.
   */
  load(plan: RelationLoadPlan): Promise<unknown> {
    const key = batchKey(plan);
    let batch = this.batches.get(key);
    if (batch === undefined) {
      batch = {
        jsModelName: plan.jsModelName,
        keyField: plan.keyField,
        relation: plan.relation,
        relationArgs: plan.relationArgs,
        pending: [],
      };
      this.batches.set(key, batch);
    }

    const pending = batch.pending;
    const promise = new Promise<unknown>((resolve, reject) => {
      pending.push({ keyValue: plan.keyValue, resolve, reject });
    });
    this.scheduleFlush();
    return promise;
  }

  /**
   * Schedule the flush for the end of the current tick.
   *
   * The resolvers that produce a batch all run inside one synchronous pass of
   * the GraphQL executor, so draining the microtask queue and then deferring to
   * `process.nextTick` collects the whole list before any query is issued.
   */
  private scheduleFlush(): void {
    if (this.flushScheduled) return;
    this.flushScheduled = true;
    void Promise.resolve().then(() => {
      process.nextTick(() => {
        this.flushScheduled = false;
        const batches = [...this.batches.values()];
        this.batches.clear();
        for (const batch of batches) {
          void this.run(batch);
        }
      });
    });
  }

  /**
   * Execute one batch and settle every load waiting on it.
   *
   * A parent row that does not come back settles as `null`, which is what
   * Prisma's fluent API returns for a missing parent: the unwrapping step walks
   * `dataPath` over a `null` row. Returning `[]` instead would invent an "empty
   * relation" answer for a row that does not exist — a measured absence turned
   * into a value.
   *
   * @param batch - The batch to execute.
   */
  private async run(batch: Batch): Promise<void> {
    const keys = [...new Set(batch.pending.map((load) => load.keyValue))];
    const groups = chunk(keys, MAX_BATCH_KEYS);
    const byKey = new Map<string, Record<string, unknown>>();

    try {
      await Promise.all(
        groups.map(async (group) => {
          relationBatchQueriesTotal.inc({ model: batch.jsModelName });
          const rows: unknown = await this.execute(batch.jsModelName, {
            where: { [batch.keyField]: { in: group } },
            select: {
              [batch.keyField]: true,
              [batch.relation]: batch.relationArgs,
            },
          });
          if (!Array.isArray(rows)) {
            throw new Error(
              `Prisma relation batching expected an array from ${batch.jsModelName}.findMany`
            );
          }
          for (const row of rows) {
            if (!isPlainObject(row)) continue;
            byKey.set(String(row[batch.keyField]), row);
          }
        })
      );
    } catch (error) {
      for (const load of batch.pending) load.reject(error);
      return;
    }

    relationBatchLoadsTotal.inc(
      { model: batch.jsModelName, relation: batch.relation },
      batch.pending.length
    );

    for (const load of batch.pending) {
      const row = byKey.get(String(load.keyValue));
      load.resolve(row === undefined ? null : row[batch.relation]);
    }
  }
}

/**
 * Build the executor that issues batched reads through a Prisma client.
 *
 * @param client - The client batched reads are issued through.
 * @returns An executor bound to that client.
 */
export function clientBatchExecutor(client: PrismaClient): BatchExecutor {
  const host = client as unknown as Record<string, unknown>;
  return async (jsModelName, args) => {
    const delegate = host[jsModelName];
    if (typeof delegate !== 'object' || delegate === null) {
      throw new Error(
        `Prisma relation batching could not resolve the "${jsModelName}" model delegate`
      );
    }
    const findMany = (delegate as Record<string, unknown>).findMany;
    if (typeof findMany !== 'function') {
      throw new Error(
        `Prisma relation batching found no findMany on the "${jsModelName}" model delegate`
      );
    }
    return (
      findMany as (a: Record<string, unknown>) => Promise<unknown>
    ).call(delegate, args);
  };
}

/**
 * Fold same-shape fluent relation loads into one query per shape.
 *
 * The generated TypeGraphQL relation resolvers issue
 * `prisma.<model>.findUnique({ where: { id } }).<relation>()` once per parent
 * row, so one list field costs one Prisma client request per row. Those
 * requests are compacted into a small number of SQL statements by Prisma's own
 * query-engine batching — measured at 2 statements for 2,022 loads — so the
 * cost this removes is not round trips. It is the per-request client work:
 * call-site capture, argument deep-clone, protocol serialisation, tracing span
 * and promise, once per row. That work is synchronous on the single Node
 * thread, so it is paid in event-loop time every co-tenant request queues
 * behind.
 *
 * This extension replaces the per-row request with one parent-keyed read whose
 * nested `select` carries the relation arguments unchanged. Per-parent `take`,
 * `skip`, `orderBy`, `cursor`, `distinct` and `where` keep their per-parent
 * meaning inside a nested select, so the rows returned are the same rows: the
 * saving is request overhead, not result narrowing. Batching applies only where
 * it provably cannot change an answer; every other read runs exactly as before.
 * See {@link planRelationLoad} for the conditions.
 *
 * ORDERING, and it is load-bearing. Prisma runs the extension installed FIRST
 * as the OUTERMOST hook — pinned by an executed test against 6.19.2 for this
 * exact hook pair, because it is a property of Prisma's extension layering and
 * not of the JavaScript call order. So this must wrap an already-guarded
 * client, never the reverse: `withRelationBatching(withUnboundedReadGuard(c))`
 * leaves the ceiling guard outermost, so the guard still rewrites arguments
 * before this hook sees them and still measures the value the caller receives.
 * Inverting the two would hide every fluent relation load from the guard.
 *
 * @param client - The client to wrap. Batched reads are issued through it, so
 * every extension already installed on it still governs them.
 * @returns The client with relation batching applied.
 */
export function withRelationBatching(client: PrismaClient): PrismaClient {
  const batcher = new RelationBatcher(clientBatchExecutor(client));
  const extension: RelationBatchExtension = {
    name: 'relation-batching',
    query: {
      $allModels: {
        findUnique: async (params: QueryExtensionParams): Promise<unknown> => {
          const internal = readInternalParams(params);
          if (internal === undefined) return params.query(params.args);
          const plan = planRelationLoad(params, internal);
          if (plan === undefined) return params.query(params.args);
          return batcher.load(plan);
        },
      },
    },
  };
  const extended = (client as unknown as ExtendableClient).$extends(extension);
  // Prisma types an extended client as a structurally distinct object even
  // when, as here, the extension only wraps query execution and adds, removes
  // and renames nothing on the model surface. The delegates callers use are the
  // same delegates; the assertion states that, and is confined to this one
  // boundary rather than spread across every consumer.
  return extended as unknown as PrismaClient;
}

/**
 * Bound on unqualified `findMany` result sets.
 *
 * A `findMany` with no `take` materialises an entire table into the Node heap.
 * That is survivable while a table is small and becomes an outage when it is
 * not: this process runs with a fixed heap, and the tables it serves do not
 * stop growing. `account_decision_records` reached 1.4 GB and `audit_logs`
 * 3.8 GB, either of which exhausts the heap on a single unqualified read and
 * takes the API down for every caller, including the trading engine reading
 * its own governed policy.
 *
 * WHY A CEILING AND NOT A REJECTION. Refusing an unqualified read would surface
 * the problem immediately but would also break callers that are correct today.
 * A ceiling keeps them working and bounds the failure.
 *
 * WHY THIS CEILING CANNOT SILENTLY CHANGE AN ANSWER TODAY. It sits above every
 * result set any current caller can produce — the largest is `trade.getAll` at
 * roughly 25k rows — so no query in service reaches it. It exists for the
 * unqualified read of a table that has grown past what a heap can hold.
 *
 * WHY IT IS LOUD. Silent truncation of a query whose caller expects every row
 * is a wrong answer wearing the shape of a right one, which is worse than the
 * crash it prevents. A read that comes back exactly at the ceiling has probably
 * been truncated, so it is logged with the model and the count. That warning is
 * the signal to give that call site an explicit `take` before the ceiling ever
 * has to decide anything.
 *
 * @module prisma-find-many-guard
 */

import type { PrismaClient } from '@prisma/client';

import { logger } from './utils/logger';

/**
 * Default ceiling for an unqualified `findMany`.
 *
 * Chosen to sit above every result set current callers produce, so the ceiling
 * is inert for correct code and active only for a read that would otherwise be
 * bounded by nothing but table size.
 */
export const DEFAULT_FIND_MANY_TAKE = 50_000;

/**
 * Resolve the ceiling, allowing an operator to lower it without a deploy.
 *
 * @returns The row ceiling to apply to an unqualified `findMany`.
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
 * Apply the unqualified-`findMany` ceiling to a Prisma client.
 *
 * An explicit `take` is always honoured — a caller that has stated how many
 * rows it wants has already bounded itself, and overriding that would be this
 * guard changing an answer rather than protecting the process.
 *
 * @param client - The client to wrap.
 * @returns The client with the ceiling applied.
 */
export function withFindManyGuard(client: PrismaClient): PrismaClient {
  const ceiling = resolveFindManyTake();
  const extended = client.$extends({
    name: 'find-many-ceiling',
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          const unbounded = args.take === undefined || args.take === null;
          const bounded = unbounded ? { ...args, take: ceiling } : args;
          const rows: unknown = await query(bounded);
          if (unbounded && Array.isArray(rows) && rows.length >= ceiling) {
            logger.warn(
              'Unqualified findMany returned the ceiling row count — the result is probably truncated; give this call site an explicit take',
              { model, ceiling, returned: rows.length }
            );
          }
          return rows;
        },
      },
    },
  });
  // Prisma types an extended client as a structurally distinct object even
  // when, as here, the extension only wraps query execution and adds, removes
  // and renames nothing on the model surface. The delegates callers use are the
  // same delegates; the assertion states that, and is confined to this one
  // boundary rather than spread across every consumer.
  return extended as unknown as PrismaClient;
}

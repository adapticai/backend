import { Prisma, PrismaClient } from '@prisma/client';

/**
 * Reverts one restatement run recorded in `trade_restatements`.
 *
 * A restatement script writes, in ONE transaction, a ledger row per trade
 * (`priorRow` = `to_jsonb(trades.*)` read inside that transaction, the changed
 * column names in `fieldsChanged`, before/after pairs, `basis`, `approvedBy`)
 * and the UPDATE of `trades` it records. Reverting is the mirror image, also in
 * ONE transaction:
 *
 *   1. lock the run's live (unreverted) ledger rows; their count must equal
 *      `expectedRows`, so the operator states up front how many rows the revert
 *      will touch and the counts tie;
 *   2. refuse if any listed column is not restorable, if a later live
 *      restatement of the same trade exists (revert that one first), or if any
 *      trade no longer carries the values the run wrote (something rewrote the
 *      row since; restoring would silently clobber that later write);
 *   3. restore exactly the `fieldsChanged` columns from `priorRow`; the UPDATE
 *      must touch `expectedRows` trades;
 *   4. stamp `revertedAt` / `revertedBy` on the ledger rows (they are never
 *      deleted, so the ledger keeps both the restatement and its reversal).
 *
 * Any failed check raises, which rolls the whole transaction back. Equivalent
 * psql, for a run executed by hand (`:ref`, `:by`, `:expected` as -v vars):
 *
 *   BEGIN;
 *   SELECT count(*) FROM trade_restatements
 *    WHERE "restatementRef" = :'ref' AND "revertedAt" IS NULL FOR UPDATE;   -- must equal :expected
 *   UPDATE trades t SET
 *     "entryPrice" = CASE WHEN 'entryPrice' = ANY(r."fieldsChanged") THEN p."entryPrice" ELSE t."entryPrice" END,
 *     ... the same for pnlAmount, entryQty, entryValue, exitQty, status ...,
 *     "updatedAt" = (now() AT TIME ZONE 'UTC')
 *   FROM trade_restatements r, LATERAL jsonb_populate_record(NULL::trades, r."priorRow") p
 *   WHERE r."restatementRef" = :'ref' AND r."revertedAt" IS NULL AND t.id = r."tradeId";  -- UPDATE count must equal :expected
 *   UPDATE trade_restatements SET "revertedAt" = (now() AT TIME ZONE 'UTC'), "revertedBy" = :'by'
 *    WHERE "restatementRef" = :'ref' AND "revertedAt" IS NULL;                -- must equal :expected
 *   COMMIT;
 *
 * Server-side only; the ledger has no GraphQL surface (see
 * src/config/server-only-models.ts).
 */

/** trades columns a restatement may change, and therefore a revert may restore. */
export const RESTORABLE_TRADE_COLUMNS = [
  'entryPrice',
  'pnlAmount',
  'entryQty',
  'entryValue',
  'exitQty',
  'status',
] as const;

/** Ledger column holding the value the run wrote, per restorable trades column. */
const NEW_VALUE_COLUMN: Record<
  (typeof RESTORABLE_TRADE_COLUMNS)[number],
  string
> = {
  entryPrice: 'newEntryPrice',
  pnlAmount: 'newPnlAmount',
  entryQty: 'newEntryQty',
  entryValue: 'newEntryValue',
  exitQty: 'newExitQty',
  status: 'newStatus',
};

export interface RevertRestatementInput {
  /** The run to revert, e.g. `RST-2026-10-03-ENTRYBASIS-ADAPTIC`. */
  restatementRef: string;
  /** Number of live ledger rows (= trades) the operator expects the revert to touch. */
  expectedRows: number;
  /** Who is reverting; recorded on every ledger row. */
  revertedBy: string;
}

export interface RevertRestatementResult {
  ledgerRows: number;
  tradesRestored: number;
}

/** Raised when a revert refuses to proceed; the transaction is rolled back. */
export class RestatementRevertError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RestatementRevertError';
  }
}

const restoreAssignments = Prisma.raw(
  RESTORABLE_TRADE_COLUMNS.map(
    (column) =>
      `"${column}" = CASE WHEN '${column}' = ANY(r."fieldsChanged") THEN p."${column}" ELSE t."${column}" END`
  ).join(',\n           ')
);

const driftPredicate = Prisma.raw(
  RESTORABLE_TRADE_COLUMNS.map(
    (column) =>
      `('${column}' = ANY(r."fieldsChanged") AND t."${column}" IS DISTINCT FROM r."${NEW_VALUE_COLUMN[column]}")`
  ).join('\n            OR ')
);

const restorableColumns = Prisma.raw(
  `ARRAY[${RESTORABLE_TRADE_COLUMNS.map((c) => `'${c}'`).join(', ')}]::text[]`
);

/** A book's run is ~1k rows; Prisma's 5 s interactive-transaction default is too tight. */
const REVERT_TRANSACTION_OPTIONS = { maxWait: 10_000, timeout: 120_000 };

/**
 * Reverts a restatement run. See the module docblock for the checks.
 *
 * @param prisma - A Prisma client connected to the database holding `trades`.
 * @param input - The run, the expected row count and the reverting principal.
 * @returns The ledger rows stamped and trades restored (always equal).
 * @throws RestatementRevertError when a check fails; nothing is written.
 */
export async function revertRestatement(
  prisma: PrismaClient,
  input: RevertRestatementInput
): Promise<RevertRestatementResult> {
  const { restatementRef, expectedRows, revertedBy } = input;
  if (!Number.isInteger(expectedRows) || expectedRows <= 0) {
    throw new RestatementRevertError(
      `${restatementRef}: expectedRows must be a positive integer, got ${expectedRows}`
    );
  }
  if (revertedBy.trim() === '') {
    throw new RestatementRevertError(
      `${restatementRef}: revertedBy is required`
    );
  }

  return prisma.$transaction(async (tx) => {
    const locked = await tx.$queryRaw<Array<{ id: string }>>`
      SELECT id::text AS id FROM "trade_restatements"
       WHERE "restatementRef" = ${restatementRef} AND "revertedAt" IS NULL
       FOR UPDATE`;
    if (locked.length !== expectedRows) {
      throw new RestatementRevertError(
        `${restatementRef}: ${locked.length} live ledger rows, expected ${expectedRows}`
      );
    }

    const unrestorable = await tx.$queryRaw<Array<{ tradeId: string }>>`
      SELECT r."tradeId"::text AS "tradeId" FROM "trade_restatements" r
       WHERE r."restatementRef" = ${restatementRef} AND r."revertedAt" IS NULL
         AND NOT (r."fieldsChanged" <@ ${restorableColumns})`;
    if (unrestorable.length > 0) {
      throw new RestatementRevertError(
        `${restatementRef}: ${unrestorable.length} rows change columns outside ${RESTORABLE_TRADE_COLUMNS.join(', ')}`
      );
    }

    const superseded = await tx.$queryRaw<Array<{ tradeId: string }>>`
      SELECT r."tradeId"::text AS "tradeId" FROM "trade_restatements" r
        JOIN "trade_restatements" later
          ON later."tradeId" = r."tradeId" AND later.id <> r.id
         AND later."revertedAt" IS NULL AND later."runAt" > r."runAt"
       WHERE r."restatementRef" = ${restatementRef} AND r."revertedAt" IS NULL`;
    if (superseded.length > 0) {
      throw new RestatementRevertError(
        `${restatementRef}: ${superseded.length} trades have a later live restatement; revert it first (${superseded
          .slice(0, 5)
          .map((row) => row.tradeId)
          .join(', ')})`
      );
    }

    const drifted = await tx.$queryRaw<Array<{ tradeId: string }>>`
      SELECT r."tradeId"::text AS "tradeId"
        FROM "trade_restatements" r JOIN "trades" t ON t.id = r."tradeId"
       WHERE r."restatementRef" = ${restatementRef} AND r."revertedAt" IS NULL
         AND (${driftPredicate})`;
    if (drifted.length > 0) {
      throw new RestatementRevertError(
        `${restatementRef}: ${drifted.length} trades no longer carry the restated values (${drifted
          .slice(0, 5)
          .map((row) => row.tradeId)
          .join(', ')})`
      );
    }

    const tradesRestored = await tx.$executeRaw`
      UPDATE "trades" t
         SET ${restoreAssignments},
             "updatedAt" = (now() AT TIME ZONE 'UTC')
        FROM "trade_restatements" r,
             LATERAL jsonb_populate_record(NULL::"trades", r."priorRow") p
       WHERE r."restatementRef" = ${restatementRef} AND r."revertedAt" IS NULL
         AND t.id = r."tradeId"`;
    if (tradesRestored !== expectedRows) {
      throw new RestatementRevertError(
        `${restatementRef}: restored ${tradesRestored} trades, expected ${expectedRows}`
      );
    }

    const ledgerRows = await tx.$executeRaw`
      UPDATE "trade_restatements"
         SET "revertedAt" = (now() AT TIME ZONE 'UTC'), "revertedBy" = ${revertedBy}
       WHERE "restatementRef" = ${restatementRef} AND "revertedAt" IS NULL`;
    if (ledgerRows !== expectedRows) {
      throw new RestatementRevertError(
        `${restatementRef}: stamped ${ledgerRows} ledger rows, expected ${expectedRows}`
      );
    }

    return { ledgerRows, tradesRestored };
  }, REVERT_TRANSACTION_OPTIONS);
}

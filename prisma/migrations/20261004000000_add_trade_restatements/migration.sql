-- Trade restatement ledger.
--
-- One row per (trade, restatement run). A restatement script snapshots the whole
-- prior trades row ("priorRow"), the before/after pair of every column it
-- changes, and the evidence for the new values ("basis"), and it does so in the
-- SAME transaction as the UPDATE of trades it records: the ledger is never
-- written as a separate earlier step, so a failed or rolled-back repair leaves
-- no ledger row and a committed one always has its ledger. The first users are
-- the paper-book entry-basis restatement (2,288 mismatched COMPLETED rows,
-- refs RST-2026-10-03-ENTRYBASIS-*) and the 2026-10-02 roster-flap repair
-- (ref roster-flap-2026-10-02).
--
-- Reverting sets "revertedAt"/"revertedBy" and restores the "fieldsChanged"
-- columns from "priorRow" (src/restatements/trade-restatement-revert.ts).
-- Ledger rows are never deleted; the FK is ON DELETE RESTRICT so a restated
-- trade cannot be hard-deleted out from under its ledger.
--
-- Purely ADDITIVE: one new table, no existing table or row touched, every
-- statement guarded so a re-run is a no-op (`prisma migrate deploy` runs
-- unattended at container start). Hand-authored from the DB-free
--   prisma migrate diff --from-schema-datamodel <pre-change schema> \
--                       --to-schema-datamodel prisma/schema.prisma --script
-- with IF NOT EXISTS guards and the two CHECK constraints added by hand.
--
-- Server-only: the table is not exposed on the GraphQL API (see
-- src/config/server-only-models.ts).

-- CreateTable
CREATE TABLE IF NOT EXISTS "trade_restatements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tradeId" UUID NOT NULL,
    "alpacaAccountId" UUID NOT NULL,
    "restatementRef" TEXT NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL,
    "fieldsChanged" TEXT[],
    "priorRow" JSONB NOT NULL,
    "priorEntryPrice" DOUBLE PRECISION,
    "newEntryPrice" DOUBLE PRECISION,
    "priorPnlAmount" DOUBLE PRECISION,
    "newPnlAmount" DOUBLE PRECISION,
    "priorEntryQty" DOUBLE PRECISION,
    "newEntryQty" DOUBLE PRECISION,
    "priorEntryValue" DOUBLE PRECISION,
    "newEntryValue" DOUBLE PRECISION,
    "priorExitQty" DOUBLE PRECISION,
    "newExitQty" DOUBLE PRECISION,
    "priorStatus" "TradeStatus",
    "newStatus" "TradeStatus",
    "basis" JSONB NOT NULL,
    "approvedBy" TEXT NOT NULL,
    "executedBy" TEXT NOT NULL DEFAULT CURRENT_USER,
    "revertedAt" TIMESTAMP(3),
    "revertedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trade_restatements_pkey" PRIMARY KEY ("id"),
    -- A ledger row must name what it changed; the revert restores exactly these columns.
    CONSTRAINT "trade_restatements_fields_changed_nonempty" CHECK ("fieldsChanged" IS NOT NULL AND cardinality("fieldsChanged") > 0),
    -- A revert is attributed: revertedAt and revertedBy are set together or not at all.
    CONSTRAINT "trade_restatements_revert_attributed" CHECK (("revertedAt" IS NULL) = ("revertedBy" IS NULL))
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "trade_restatements_restatementRef_idx" ON "trade_restatements"("restatementRef");

-- CreateIndex (a re-run of the same restatement cannot double-record a trade)
CREATE UNIQUE INDEX IF NOT EXISTS "trade_restatements_tradeId_restatementRef_key" ON "trade_restatements"("tradeId", "restatementRef");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trade_restatements_tradeId_fkey') THEN
    ALTER TABLE "trade_restatements" ADD CONSTRAINT "trade_restatements_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- AccountDecisionRecord gains the firm-level signal id it evaluated, so a
-- per-account decision row joins to its signal and, through `trades.signalId`,
-- to any trade opened from that signal.
--
-- Additive only: one nullable column with no default and one index. No row is
-- read, rewritten or backfilled — historical decisions keep NULL, because
-- nothing on this database can establish which signal an old row judged.
--
-- Lock profile. A nullable ADD COLUMN with no default is a catalog-only change
-- in Postgres 11+ (no table rewrite). The CREATE INDEX takes a SHARE lock that
-- blocks writes, not reads, for the duration of the build; every existing key is
-- NULL, so the build is one heap scan plus a sort of NULLs. Idempotent guards
-- follow the repo's precedent for a nullable signal-id column and its index on a
-- hot write table (the `trades.signalId` migration), so a partial or repeated
-- apply is safe.

-- AlterTable
ALTER TABLE "account_decision_records" ADD COLUMN IF NOT EXISTS "signalId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "account_decision_records_signalId_idx" ON "account_decision_records"("signalId");

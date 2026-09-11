-- Wave F — Canonical-schema hardening (F8.3 / F8.4 / F8.2)
--
-- 100% ADDITIVE. Adds new enum types, new NULLABLE columns, and new CHECK
-- constraints. Touches NO existing column type or nullability (F8.1 Float->Decimal
-- is deliberately OUT OF SCOPE). All statements are idempotent + safe to re-apply,
-- matching this repo's hand-authored migration house style.
--
--   F8.3  TradeSide enum + NULLABLE Trade.side / TradeOutcome.side  (the NameThesis home)
--   F8.4  TradeSignalSource / DecisionPathway / ExitTier / ActionTriggerSource enums
--         + NULLABLE typed-mirror columns dual-written beside the retained free-String columns
--   F8.2  TradeStatus lifecycle CHECK constraints (added NOT VALID — enforced on NEW writes
--         only; pre-existing rows are NOT scanned, so legacy COMPLETED-with-null-pnl /
--         REJECTED-with-null-metadata rows do not fail the migration. A later migration runs
--         `VALIDATE CONSTRAINT` after those rows are backfilled/quarantined.)

-- ============================================================
-- F8.3 / F8.4 — CreateEnum (idempotent)
-- ============================================================

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "TradeSide" AS ENUM ('LONG', 'SHORT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "TradeSignalSource" AS ENUM ('ENSEMBLE', 'LLM_ONLY', 'TRANSFORMER_ONLY', 'DRIFT_FALLBACK', 'MANUAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "DecisionPathway" AS ENUM ('ML_ONLY', 'LLM_ONLY', 'HYBRID', 'FALLBACK', 'RULES', 'UNKNOWN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "ExitTier" AS ENUM ('TIER_A', 'TIER_B', 'TIER_C', 'MANUAL', 'EOD');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "ActionTriggerSource" AS ENUM ('ORIGINAL_SIGNAL', 'REUNDERWRITING', 'REVERSAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- F8.3 / F8.4 — AlterTable ADD COLUMN (NULLABLE, idempotent)
-- ============================================================

-- Trade: derived thesis side (F8.3) + typed attribution mirrors (F8.4)
ALTER TABLE "trades"
  ADD COLUMN IF NOT EXISTS "side"             "TradeSide",
  ADD COLUMN IF NOT EXISTS "signalSourceType" "TradeSignalSource",
  ADD COLUMN IF NOT EXISTS "pathwayType"      "DecisionPathway",
  ADD COLUMN IF NOT EXISTS "exitTierType"     "ExitTier";

-- Action: typed trigger-source mirror (F8.4)
ALTER TABLE "actions"
  ADD COLUMN IF NOT EXISTS "triggerSourceType" "ActionTriggerSource";

-- TradeOutcome: realized-side (F8.3) + typed signal-source mirror (F8.4).
-- NOTE: this model has no @@map, so its physical table name is the verbatim
-- model name "TradeOutcome" (confirmed against 20260325221026_trade_outcome_model).
ALTER TABLE "TradeOutcome"
  ADD COLUMN IF NOT EXISTS "side"             "TradeSide",
  ADD COLUMN IF NOT EXISTS "signalSourceType" "TradeSignalSource";

-- ============================================================
-- F8.2 — TradeStatus lifecycle CHECK constraints
--
-- Added NOT VALID: Postgres enforces them on all NEW/UPDATED rows but does NOT scan
-- pre-existing rows, and takes only a SHARE lock (no AccessExclusive full-table scan
-- stall on the hot `trades` table). This keeps the migration additive-safe even though
-- legacy COMPLETED-with-null-pnl and REJECTED/FAILED-with-null-metadata rows exist.
-- Wrapped in DO/EXCEPTION so re-application is a no-op and a prior VALIDATE is preserved.
-- ============================================================

-- A COMPLETED trade must carry a full round-trip record — no COMPLETED with null entry/exit/pnl.
DO $$ BEGIN
  ALTER TABLE "trades"
    ADD CONSTRAINT "chk_trade_completed_has_roundtrip"
    CHECK (
      "status" <> 'COMPLETED'
      OR (
        "entryPrice" IS NOT NULL
        AND "exitPrice" IS NOT NULL
        AND "entryTime" IS NOT NULL
        AND "exitTime"  IS NOT NULL
        AND "pnlAmount" IS NOT NULL
      )
    ) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- A REJECTED_BROKER / REJECTED_COMPLIANCE / FAILED trade must carry forensic rejectionMetadata
-- (SEC Rule 15c3-5 / FINRA), matching the rejectionMetadata field's own contract.
DO $$ BEGIN
  ALTER TABLE "trades"
    ADD CONSTRAINT "chk_trade_rejected_has_metadata"
    CHECK (
      "status" NOT IN ('REJECTED_BROKER', 'REJECTED_COMPLIANCE', 'FAILED')
      OR "rejectionMetadata" IS NOT NULL
    ) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

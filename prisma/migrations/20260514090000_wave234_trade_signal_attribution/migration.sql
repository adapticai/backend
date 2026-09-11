-- Wave 234 — Trade signal-source / signalId / pathway / exitTier attribution columns
-- All nullable + idempotent so the migration is safe to re-apply.

ALTER TABLE "trades"
  ADD COLUMN IF NOT EXISTS "signalSource" TEXT,
  ADD COLUMN IF NOT EXISTS "signalId"     TEXT,
  ADD COLUMN IF NOT EXISTS "pathway"      TEXT,
  ADD COLUMN IF NOT EXISTS "exitTier"     TEXT;

CREATE INDEX IF NOT EXISTS "trades_signalId_idx" ON "trades"("signalId");

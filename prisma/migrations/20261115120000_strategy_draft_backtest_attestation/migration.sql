-- Strategy draft backtest attestation (G-STR-08).
-- Additive only: one nullable column every existing row satisfies, and a
-- CHECK that a spec hash is never recorded without the backtest it belongs to.

-- AlterTable
ALTER TABLE "strategies" ADD COLUMN     "backtestSpecHash" VARCHAR(64);

-- Hand-edited: Prisma does not model CHECK constraints.
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_backtest_spec_hash_has_job"
  CHECK ("backtestSpecHash" IS NULL OR "backtestJobId" IS NOT NULL);

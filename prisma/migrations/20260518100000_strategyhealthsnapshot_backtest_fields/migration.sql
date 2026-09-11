-- Migration: Add backtest baseline stats fields to StrategyHealthSnapshot
-- These fields enable the engine's SignalDegradationObserver to compute
-- per-strategy z-score degradation against real backtest baselines.
-- All columns are nullable so legacy rows are unaffected.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'StrategyHealthSnapshot' AND column_name = 'backtestHitRate'
  ) THEN
    ALTER TABLE "StrategyHealthSnapshot" ADD COLUMN "backtestHitRate" DOUBLE PRECISION;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'StrategyHealthSnapshot' AND column_name = 'backtestHitRateStdDev'
  ) THEN
    ALTER TABLE "StrategyHealthSnapshot" ADD COLUMN "backtestHitRateStdDev" DOUBLE PRECISION;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'StrategyHealthSnapshot' AND column_name = 'backtestExpectancyStdDev'
  ) THEN
    ALTER TABLE "StrategyHealthSnapshot" ADD COLUMN "backtestExpectancyStdDev" DOUBLE PRECISION;
  END IF;
END $$;

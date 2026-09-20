-- Portfolio trailing-stop rung ladder.
--
-- Generalises the single portfolioProfitThresholdPercent/reducedPortfolioTrailPercent
-- pair into an ordered ladder, plus an optional second intraday round. All three
-- columns are nullable: NULL preserves today's single-rung behaviour exactly, so
-- the migration changes no account's protection on its own.
ALTER TABLE "trading_policies" ADD COLUMN IF NOT EXISTS "portfolioTrailRungs" JSONB;
ALTER TABLE "trading_policies" ADD COLUMN IF NOT EXISTS "portfolioAfternoonResetEt" TEXT;
ALTER TABLE "trading_policies" ADD COLUMN IF NOT EXISTS "portfolioAfternoonTrailRungs" JSONB;

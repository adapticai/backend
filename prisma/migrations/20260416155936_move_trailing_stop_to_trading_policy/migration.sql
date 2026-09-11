-- Move portfolio- and position-level trailing stop settings from AlpacaAccount
-- onto TradingPolicy. The columns on alpaca_accounts remain as legacy fallbacks
-- (engine prefers trading_policies.* and falls back to alpaca_accounts.*).

-- AlterTable
ALTER TABLE "trading_policies"
  ADD COLUMN "enablePortfolioTrailingStop"       BOOLEAN          NOT NULL DEFAULT false,
  ADD COLUMN "portfolioTrailPercent"             DOUBLE PRECISION NOT NULL DEFAULT 4.0,
  ADD COLUMN "portfolioProfitThresholdPercent"   DOUBLE PRECISION NOT NULL DEFAULT 2.0,
  ADD COLUMN "reducedPortfolioTrailPercent"      DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  ADD COLUMN "defaultTrailingStopPercentage100"  DOUBLE PRECISION NOT NULL DEFAULT 4.0,
  ADD COLUMN "firstTrailReductionThreshold100"   DOUBLE PRECISION NOT NULL DEFAULT 2.0,
  ADD COLUMN "secondTrailReductionThreshold100"  DOUBLE PRECISION NOT NULL DEFAULT 5.0,
  ADD COLUMN "firstReducedTrailPercentage100"    DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  ADD COLUMN "secondReducedTrailPercentage100"   DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  ADD COLUMN "minimumPriceChangePercent100"      DOUBLE PRECISION NOT NULL DEFAULT 0.5;

-- Copy existing values forward from alpaca_accounts to trading_policies so any
-- accounts that had non-default trailing-stop settings (including opt-ins) are
-- preserved on the canonical trading_policies row.
UPDATE "trading_policies" tp
SET
  "enablePortfolioTrailingStop"      = aa."enablePortfolioTrailingStop",
  "portfolioTrailPercent"            = aa."portfolioTrailPercent",
  "portfolioProfitThresholdPercent"  = aa."portfolioProfitThresholdPercent",
  "reducedPortfolioTrailPercent"     = aa."reducedPortfolioTrailPercent",
  "defaultTrailingStopPercentage100" = aa."defaultTrailingStopPercentage100",
  "firstTrailReductionThreshold100"  = aa."firstTrailReductionThreshold100",
  "secondTrailReductionThreshold100" = aa."secondTrailReductionThreshold100",
  "firstReducedTrailPercentage100"   = aa."firstReducedTrailPercentage100",
  "secondReducedTrailPercentage100"  = aa."secondReducedTrailPercentage100",
  "minimumPriceChangePercent100"     = aa."minimumPriceChangePercent100"
FROM "alpaca_accounts" aa
WHERE tp."alpacaAccountId" = aa.id;

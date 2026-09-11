-- Add portfolio take-profit fields to TradingPolicy (additive, nullable, defaulted).
-- Mirrors prisma/schema.prisma model TradingPolicy:
--   enablePortfolioTakeProfit          Boolean? @default(false)
--   portfolioTakeProfitThresholdPercent Float?   @default(1)
-- Safe/idempotent: nullable columns with defaults, no backfill required.

-- AlterTable
ALTER TABLE "trading_policies" ADD COLUMN IF NOT EXISTS "enablePortfolioTakeProfit" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "portfolioTakeProfitThresholdPercent" DOUBLE PRECISION DEFAULT 1;

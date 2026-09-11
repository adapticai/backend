-- AlterTable
ALTER TABLE "trading_policies" ADD COLUMN     "perTradeCryptoAllocationPct" DOUBLE PRECISION NOT NULL DEFAULT 5,
ADD COLUMN     "perTradeEquityAllocationPct" DOUBLE PRECISION NOT NULL DEFAULT 5;

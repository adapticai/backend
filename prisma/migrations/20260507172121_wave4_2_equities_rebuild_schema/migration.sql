-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TradeStatus" ADD VALUE 'REJECTED_BROKER';
ALTER TYPE "TradeStatus" ADD VALUE 'REJECTED_COMPLIANCE';
ALTER TYPE "TradeStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "amlStatus" TEXT,
ADD COLUMN     "jurisdiction" TEXT,
ADD COLUMN     "lastKycUpdate" TIMESTAMP(3),
ADD COLUMN     "riskProfile" TEXT;

-- AlterTable
ALTER TABLE "trades" ADD COLUMN     "rejectionMetadata" JSONB;

-- AlterTable
ALTER TABLE "trading_policies" ADD COLUMN     "equityWashTradeCooldownMs" INTEGER NOT NULL DEFAULT 30000;

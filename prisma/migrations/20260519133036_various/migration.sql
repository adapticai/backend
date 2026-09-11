-- AlterTable
ALTER TABLE "AccountRiskMetrics" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RiskEscalationEvent" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "StrategyHealthSnapshot" ALTER COLUMN "id" DROP DEFAULT;

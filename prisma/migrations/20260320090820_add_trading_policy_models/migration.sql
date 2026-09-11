-- CreateEnum
CREATE TYPE "AutonomyMode" AS ENUM ('ADVISORY_ONLY', 'EXECUTION_ON_APPROVAL', 'SEMI_AUTONOMOUS', 'FULLY_AUTONOMOUS', 'EMERGENCY_SAFE_MODE');

-- CreateEnum
CREATE TYPE "OverlayType" AS ENUM ('BLACK_SWAN', 'VOLATILITY_REGIME', 'SECTOR_DETERIORATION', 'DRAWDOWN_BREACH', 'CORRELATION_SPIKE', 'LIQUIDITY_STRESS', 'EXCHANGE_DEGRADATION', 'DATA_QUALITY', 'NEWS_EVENT_RISK', 'RATES_BONDS_STRESS', 'MANUAL_OVERRIDE', 'INCIDENT_RESPONSE');

-- CreateEnum
CREATE TYPE "OverlaySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "OverlayStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'DEACTIVATED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "DecisionOutcome" AS ENUM ('DO_NOTHING', 'OPEN_POSITION', 'ADD_TO_POSITION', 'REDUCE_POSITION', 'CLOSE_POSITION', 'REVERSE_POSITION', 'MODIFY_ORDERS', 'CANCEL_ORDERS', 'REBALANCE', 'MUTATE_POLICY', 'ESCALATE_FOR_APPROVAL', 'SKIP_INELIGIBLE');

-- CreateEnum
CREATE TYPE "DecisionRecordStatus" AS ENUM ('PENDING', 'EXECUTING', 'COMPLETED', 'FAILED', 'CANCELLED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "DecisionMemoryOutcome" AS ENUM ('PENDING', 'PROFITABLE', 'UNPROFITABLE', 'STOPPED_OUT', 'CANCELLED');

-- CreateTable
CREATE TABLE "trading_policies" (
    "id" UUID NOT NULL,
    "alpacaAccountId" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModifiedBy" TEXT,
    "lastModifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autonomyMode" "AutonomyMode" NOT NULL DEFAULT 'ADVISORY_ONLY',
    "realtimeTradingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "paperTradingOnly" BOOLEAN NOT NULL DEFAULT false,
    "killSwitchEnabled" BOOLEAN NOT NULL DEFAULT false,
    "autonomyPrefs" JSONB,
    "equitiesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "etfsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "cryptoEnabled" BOOLEAN NOT NULL DEFAULT false,
    "optionsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "futuresEnabled" BOOLEAN NOT NULL DEFAULT false,
    "forexEnabled" BOOLEAN NOT NULL DEFAULT false,
    "shortingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "marginEnabled" BOOLEAN NOT NULL DEFAULT false,
    "fractionalSharesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "assetUniversePrefs" JSONB,
    "maxBuyingPowerUtilPct" DOUBLE PRECISION NOT NULL DEFAULT 90,
    "cashFloorPct" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "maxGrossExposurePct" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "maxNetExposurePct" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "maxLeverage" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "maxSymbolConcentrationPct" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "maxSectorConcentrationPct" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "maxOpenPositions" INTEGER NOT NULL DEFAULT 20,
    "maxOpenOrders" INTEGER NOT NULL DEFAULT 50,
    "riskBudgetPrefs" JSONB,
    "signalConsumptionPrefs" JSONB,
    "executionPrefs" JSONB,
    "positionManagementPrefs" JSONB,
    "portfolioConstructionPrefs" JSONB,
    "macroOverlayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "sectorOverlayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "volatilityOverlayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "liquidityStressOverlayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "blackSwanProtectionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "drawdownGuardianEnabled" BOOLEAN NOT NULL DEFAULT false,
    "correlationSpikeProtectionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "newsEventRiskOverlayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "exchangeHealthOverlayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "dataQualitySentinelEnabled" BOOLEAN NOT NULL DEFAULT false,
    "overlayResponsePrefs" JSONB,
    "miniModelProvider" "LlmProvider",
    "miniModelId" TEXT,
    "normalModelProvider" "LlmProvider",
    "normalModelId" TEXT,
    "advancedModelProvider" "LlmProvider",
    "advancedModelId" TEXT,
    "modelPrefs" JSONB,
    "auditNotificationPrefs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trading_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_overlays" (
    "id" UUID NOT NULL,
    "tradingPolicyId" UUID NOT NULL,
    "overlayType" "OverlayType" NOT NULL,
    "source" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "severity" "OverlaySeverity" NOT NULL DEFAULT 'MEDIUM',
    "version" INTEGER NOT NULL DEFAULT 1,
    "mutations" JSONB NOT NULL,
    "status" "OverlayStatus" NOT NULL DEFAULT 'ACTIVE',
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "deactivatedAt" TIMESTAMP(3),
    "deactivatedBy" TEXT,
    "correlationId" TEXT,
    "triggerEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_overlays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_decision_records" (
    "id" UUID NOT NULL,
    "alpacaAccountId" UUID NOT NULL,
    "correlationId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "signalAction" TEXT NOT NULL,
    "signalConfidence" DOUBLE PRECISION NOT NULL,
    "decision" "DecisionOutcome" NOT NULL,
    "decisionRationale" TEXT,
    "decisionConfidence" DOUBLE PRECISION,
    "actionIntents" JSONB,
    "validationResults" JSONB,
    "executionResults" JSONB,
    "effectivePolicySnapshot" JSONB NOT NULL,
    "positionsSnapshot" JSONB,
    "openOrdersSnapshot" JSONB,
    "exposureSnapshot" JSONB,
    "overlaysSnapshot" JSONB,
    "modelProvider" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "modelTier" TEXT NOT NULL,
    "routingReason" TEXT,
    "tokenUsage" JSONB,
    "sessionDurationMs" INTEGER,
    "gatingDurationMs" INTEGER,
    "validationDurationMs" INTEGER,
    "executionDurationMs" INTEGER,
    "status" "DecisionRecordStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_decision_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_memory_summaries" (
    "id" UUID NOT NULL,
    "alpacaAccountId" UUID NOT NULL,
    "symbol" TEXT,
    "sector" TEXT,
    "assetClass" TEXT,
    "summary" TEXT NOT NULL,
    "keyFactors" JSONB,
    "outcome" "DecisionMemoryOutcome" NOT NULL DEFAULT 'PENDING',
    "outcomeDetails" JSONB,
    "decisionRecordId" TEXT,
    "correlationId" TEXT,
    "relevanceScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "decision_memory_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trading_policies_alpacaAccountId_key" ON "trading_policies"("alpacaAccountId");

-- CreateIndex
CREATE INDEX "policy_overlays_tradingPolicyId_status_idx" ON "policy_overlays"("tradingPolicyId", "status");

-- CreateIndex
CREATE INDEX "policy_overlays_overlayType_status_idx" ON "policy_overlays"("overlayType", "status");

-- CreateIndex
CREATE INDEX "policy_overlays_expiresAt_idx" ON "policy_overlays"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "account_decision_records_correlationId_key" ON "account_decision_records"("correlationId");

-- CreateIndex
CREATE INDEX "account_decision_records_alpacaAccountId_createdAt_idx" ON "account_decision_records"("alpacaAccountId", "createdAt");

-- CreateIndex
CREATE INDEX "account_decision_records_symbol_createdAt_idx" ON "account_decision_records"("symbol", "createdAt");

-- CreateIndex
CREATE INDEX "account_decision_records_opportunityId_idx" ON "account_decision_records"("opportunityId");

-- CreateIndex
CREATE INDEX "decision_memory_summaries_alpacaAccountId_symbol_createdAt_idx" ON "decision_memory_summaries"("alpacaAccountId", "symbol", "createdAt");

-- CreateIndex
CREATE INDEX "decision_memory_summaries_alpacaAccountId_createdAt_idx" ON "decision_memory_summaries"("alpacaAccountId", "createdAt");

-- CreateIndex
CREATE INDEX "decision_memory_summaries_expiresAt_idx" ON "decision_memory_summaries"("expiresAt");

-- AddForeignKey
ALTER TABLE "trading_policies" ADD CONSTRAINT "trading_policies_alpacaAccountId_fkey" FOREIGN KEY ("alpacaAccountId") REFERENCES "alpaca_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_overlays" ADD CONSTRAINT "policy_overlays_tradingPolicyId_fkey" FOREIGN KEY ("tradingPolicyId") REFERENCES "trading_policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

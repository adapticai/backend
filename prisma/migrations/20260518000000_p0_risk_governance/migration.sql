-- P0 risk-governance schema additions
-- Idempotent migration: ALL operations use IF NOT EXISTS / DO $$ guards so it
-- can be re-applied safely.

-- ============================================================================
-- 1. AlterEnum: AlertCategory — add GOVERNANCE
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = '"AlertCategory"'::regtype
    AND enumlabel = 'GOVERNANCE'
  ) THEN
    ALTER TYPE "AlertCategory" ADD VALUE 'GOVERNANCE';
  END IF;
END
$$;

-- ============================================================================
-- 2. CreateEnum: AccountRiskState
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AccountRiskState') THEN
    CREATE TYPE "AccountRiskState" AS ENUM ('NORMAL', 'WARN', 'THROTTLE', 'PAUSED', 'FLATTEN', 'HALT');
  END IF;
END
$$;

-- ============================================================================
-- 3. CreateEnum: StrategyState
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StrategyState') THEN
    CREATE TYPE "StrategyState" AS ENUM ('ACTIVE', 'WARN', 'THROTTLE', 'PAUSED', 'DISABLED');
  END IF;
END
$$;

-- ============================================================================
-- 4. CreateEnum: RiskEscalationReason
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RiskEscalationReason') THEN
    CREATE TYPE "RiskEscalationReason" AS ENUM (
      'DRAWDOWN_WARN', 'DRAWDOWN_THROTTLE', 'DRAWDOWN_PAUSE',
      'DAILY_LOSS_BREACH', 'WEEKLY_LOSS_BREACH', 'MONTHLY_LOSS_BREACH', 'PEAK_TO_TROUGH_BREACH',
      'BROKER_FAILURE_RATE', 'BROKER_LATENCY_SPIKE', 'BROKER_OUTAGE',
      'DATA_QUALITY_STALE', 'DATA_QUALITY_MISSING', 'DATA_QUALITY_FEED_FAIL',
      'CONCENTRATION_POSITION', 'CONCENTRATION_SECTOR', 'CONCENTRATION_FACTOR',
      'VOLATILITY_SPIKE', 'REGIME_CRISIS', 'REGIME_UNCERTAIN',
      'STRATEGY_DRAWDOWN', 'STRATEGY_EXPECTANCY_DEGRADATION', 'STRATEGY_HIT_RATE_DEGRADATION',
      'LIVE_VS_BACKTEST_DIVERGENCE', 'MODEL_CONFIDENCE_COLLAPSE', 'MODEL_DRIFT_DETECTED',
      'OPERATOR_OVERRIDE', 'OPERATOR_RECOVERY', 'OPERATOR_CLEAR',
      'SCHEDULED_MAINTENANCE', 'EMERGENCY_HALT'
    );
  END IF;
END
$$;

-- ============================================================================
-- 5. CreateEnum: RiskEscalationActor
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RiskEscalationActor') THEN
    CREATE TYPE "RiskEscalationActor" AS ENUM ('SYSTEM_OBSERVER', 'OPERATOR', 'COMPLIANCE_OFFICER', 'AUTOMATED_RECOVERY');
  END IF;
END
$$;

-- ============================================================================
-- 6. AlterTable: trading_policies — add 5 risk-governance columns
-- ============================================================================
ALTER TABLE "trading_policies"
  ADD COLUMN IF NOT EXISTS "escalationPolicyOverrides" JSONB,
  ADD COLUMN IF NOT EXISTS "currentRiskState" "AccountRiskState" NOT NULL DEFAULT 'NORMAL',
  ADD COLUMN IF NOT EXISTS "currentRiskStateAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "lastRiskStateChangedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "lastRiskEscalationEventId" UUID;

-- ============================================================================
-- 7. CreateTable: AccountRiskMetrics
-- ============================================================================
CREATE TABLE IF NOT EXISTS "AccountRiskMetrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "alpacaAccountId" UUID NOT NULL,
    "currentRiskState" "AccountRiskState" NOT NULL DEFAULT 'NORMAL',
    "currentScopeState" JSONB,
    "riskStateChangedAt" TIMESTAMP(3),
    "riskStateChangedBy" TEXT,
    "riskStateChangeReason" TEXT,
    "accountHighWaterMark" DECIMAL(20,2),
    "accountHighWaterMarkAt" TIMESTAMP(3),
    "currentEquity" DECIMAL(20,2),
    "currentDrawdownPct" DECIMAL(10,6),
    "intradayDrawdownPct" DECIMAL(10,6),
    "maxDrawdownPctLifetime" DECIMAL(10,6),
    "dailyPnlAmount" DECIMAL(20,2),
    "dailyPnlPct" DECIMAL(10,6),
    "weeklyPnlAmount" DECIMAL(20,2),
    "weeklyPnlPct" DECIMAL(10,6),
    "monthlyPnlAmount" DECIMAL(20,2),
    "monthlyPnlPct" DECIMAL(10,6),
    "peakToTroughAmount" DECIMAL(20,2),
    "peakToTroughPct" DECIMAL(10,6),
    "nextRecoveryEligibleAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AccountRiskMetrics_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AccountRiskMetrics_alpacaAccountId_key" ON "AccountRiskMetrics"("alpacaAccountId");
CREATE INDEX IF NOT EXISTS "AccountRiskMetrics_alpacaAccountId_idx" ON "AccountRiskMetrics"("alpacaAccountId");
CREATE INDEX IF NOT EXISTS "AccountRiskMetrics_currentRiskState_riskStateChangedAt_idx" ON "AccountRiskMetrics"("currentRiskState", "riskStateChangedAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'AccountRiskMetrics_alpacaAccountId_fkey'
  ) THEN
    ALTER TABLE "AccountRiskMetrics"
      ADD CONSTRAINT "AccountRiskMetrics_alpacaAccountId_fkey"
      FOREIGN KEY ("alpacaAccountId") REFERENCES "alpaca_accounts"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;

-- ============================================================================
-- 8. CreateTable: StrategyHealthSnapshot
-- ============================================================================
CREATE TABLE IF NOT EXISTS "StrategyHealthSnapshot" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "alpacaAccountId" UUID NOT NULL,
    "strategyName" TEXT NOT NULL,
    "currentState" "StrategyState" NOT NULL DEFAULT 'ACTIVE',
    "stateChangedAt" TIMESTAMP(3),
    "stateChangedReason" TEXT,
    "windowSize" INTEGER NOT NULL DEFAULT 20,
    "windowTradeCount" INTEGER NOT NULL DEFAULT 0,
    "windowHitRate" DECIMAL(10,6),
    "windowExpectancy" DECIMAL(20,6),
    "windowProfitFactor" DECIMAL(20,6),
    "windowSortino" DECIMAL(20,6),
    "windowMaxDrawdownPct" DECIMAL(10,6),
    "windowCumulativePnlAmt" DECIMAL(20,2),
    "backtestExpectancy" DECIMAL(20,6),
    "divergenceZScore" DECIMAL(10,6),
    "divergenceAlertActive" BOOLEAN NOT NULL DEFAULT false,
    "averageConfidence" DECIMAL(10,6),
    "confidenceTrend" DECIMAL(10,6),
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StrategyHealthSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "StrategyHealthSnapshot_alpacaAccountId_strategyName_key" ON "StrategyHealthSnapshot"("alpacaAccountId", "strategyName");
CREATE INDEX IF NOT EXISTS "StrategyHealthSnapshot_currentState_idx" ON "StrategyHealthSnapshot"("currentState");
CREATE INDEX IF NOT EXISTS "StrategyHealthSnapshot_alpacaAccountId_currentState_idx" ON "StrategyHealthSnapshot"("alpacaAccountId", "currentState");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'StrategyHealthSnapshot_alpacaAccountId_fkey'
  ) THEN
    ALTER TABLE "StrategyHealthSnapshot"
      ADD CONSTRAINT "StrategyHealthSnapshot_alpacaAccountId_fkey"
      FOREIGN KEY ("alpacaAccountId") REFERENCES "alpaca_accounts"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;

-- ============================================================================
-- 9. CreateTable: RiskEscalationEvent
-- ============================================================================
CREATE TABLE IF NOT EXISTS "RiskEscalationEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "alpacaAccountId" UUID,
    "scopeKind" TEXT NOT NULL,
    "scopeValue" TEXT,
    "fromState" TEXT NOT NULL,
    "toState" TEXT NOT NULL,
    "reason" "RiskEscalationReason" NOT NULL,
    "severity" "OverlaySeverity" NOT NULL,
    "triggeringObserver" TEXT,
    "observedValue" DECIMAL(20,6),
    "breachedThreshold" DECIMAL(20,6),
    "breachedThresholdKey" TEXT,
    "correlationId" TEXT,
    "triggeringEventId" TEXT,
    "actor" "RiskEscalationActor" NOT NULL,
    "actorUserId" TEXT,
    "rationale" TEXT,
    "triggeredByPolicyOverlayId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RiskEscalationEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "RiskEscalationEvent_alpacaAccountId_createdAt_idx" ON "RiskEscalationEvent"("alpacaAccountId", "createdAt");
CREATE INDEX IF NOT EXISTS "RiskEscalationEvent_scopeKind_scopeValue_createdAt_idx" ON "RiskEscalationEvent"("scopeKind", "scopeValue", "createdAt");
CREATE INDEX IF NOT EXISTS "RiskEscalationEvent_reason_severity_createdAt_idx" ON "RiskEscalationEvent"("reason", "severity", "createdAt");
CREATE INDEX IF NOT EXISTS "RiskEscalationEvent_correlationId_idx" ON "RiskEscalationEvent"("correlationId");
CREATE INDEX IF NOT EXISTS "RiskEscalationEvent_triggeredByPolicyOverlayId_idx" ON "RiskEscalationEvent"("triggeredByPolicyOverlayId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'RiskEscalationEvent_alpacaAccountId_fkey'
  ) THEN
    ALTER TABLE "RiskEscalationEvent"
      ADD CONSTRAINT "RiskEscalationEvent_alpacaAccountId_fkey"
      FOREIGN KEY ("alpacaAccountId") REFERENCES "alpaca_accounts"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END
$$;

-- ============================================================================
-- 10. AlterTable: policy_overlays — add FK to RiskEscalationEvent
-- ============================================================================
ALTER TABLE "policy_overlays"
  ADD COLUMN IF NOT EXISTS "riskEscalationEventId" UUID;

CREATE UNIQUE INDEX IF NOT EXISTS "policy_overlays_riskEscalationEventId_key" ON "policy_overlays"("riskEscalationEventId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'policy_overlays_riskEscalationEventId_fkey'
  ) THEN
    ALTER TABLE "policy_overlays"
      ADD CONSTRAINT "policy_overlays_riskEscalationEventId_fkey"
      FOREIGN KEY ("riskEscalationEventId") REFERENCES "RiskEscalationEvent"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END
$$;

-- ============================================================================
-- 11. AddForeignKey: RiskEscalationEvent.triggeredByPolicyOverlayId -> policy_overlays.id
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'RiskEscalationEvent_triggeredByPolicyOverlayId_fkey'
  ) THEN
    ALTER TABLE "RiskEscalationEvent"
      ADD CONSTRAINT "RiskEscalationEvent_triggeredByPolicyOverlayId_fkey"
      FOREIGN KEY ("triggeredByPolicyOverlayId") REFERENCES "policy_overlays"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END
$$;

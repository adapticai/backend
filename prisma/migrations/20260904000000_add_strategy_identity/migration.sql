-- Stage 2 — "a strategy gets an IDENTITY".
--
-- Purely ADDITIVE and backward-compatible: three new enums, two new tables, one
-- new NULLABLE column on `trades`, and one seeded system row. Nothing is
-- dropped, nothing is made NOT NULL, no existing row is rewritten, and the
-- `TradeStrategy` enum + `trades.strategy` column are untouched — migrating off
-- the enum is a later stage and deleting it here would break every consumer.
--
-- `trades.strategyId` is deliberately left NULL for every existing row. There
-- is no fact on this database that could establish which strategy a historical
-- trade belonged to, so backfilling it would fabricate an owner. Absence stays
-- absence.
--
-- Hand-authored (not via `prisma migrate dev`) because the configured
-- DATABASE_URL points at the live Railway production Postgres, not a dev DB —
-- this is the same practice as 20260824000000_add_econ_event_news_feed_fields.
-- The DDL below is the verbatim output of the DB-free
--   prisma migrate diff --from-schema-datamodel <pre-change schema> \
--                       --to-schema-datamodel prisma/schema.prisma --script
-- with only the seed INSERT at the bottom added by hand.
--
-- ORDERING NOTE FOR THE DEPLOY: this migration and the backend-legacy API
-- deploy must land BEFORE `@adaptic/backend-legacy` is published, because the
-- regenerated Trade selection set selects `strategyId`. Publishing first would
-- make every downstream Trade query a GRAPHQL_VALIDATION_FAILED against the
-- still-old deployed schema.

-- CreateEnum
CREATE TYPE "StrategyLifecycleState" AS ENUM ('DRAFT', 'SHADOW', 'ACTIVE', 'PAUSED', 'RETIRED');

-- CreateEnum
CREATE TYPE "StrategyOrigin" AS ENUM ('SYSTEM', 'USER', 'AI_GENERATED');

-- CreateEnum
CREATE TYPE "StrategySubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CLOSED');

-- AlterTable
ALTER TABLE "trades" ADD COLUMN     "strategyId" UUID;

-- CreateTable
CREATE TABLE "strategies" (
    "id" UUID NOT NULL,
    "key" VARCHAR(64) NOT NULL,
    "displayName" VARCHAR(128) NOT NULL,
    "description" TEXT,
    "origin" "StrategyOrigin" NOT NULL DEFAULT 'SYSTEM',
    "lifecycleState" "StrategyLifecycleState" NOT NULL DEFAULT 'DRAFT',
    "manifestHash" VARCHAR(64),
    "ownerUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategy_subscriptions" (
    "id" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "strategyId" UUID NOT NULL,
    "status" "StrategySubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "units" DECIMAL(24,10) NOT NULL DEFAULT 0,
    "costBasis" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "realizedPL" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "targetAllocationPct" DECIMAL(9,6),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "subscribedAt" TIMESTAMP(3),
    "lastRebalancedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "strategy_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "strategies_key_key" ON "strategies"("key");

-- CreateIndex
CREATE INDEX "strategies_lifecycleState_idx" ON "strategies"("lifecycleState");

-- CreateIndex
CREATE INDEX "strategies_ownerUserId_idx" ON "strategies"("ownerUserId");

-- CreateIndex
CREATE INDEX "strategy_subscriptions_accountId_idx" ON "strategy_subscriptions"("accountId");

-- CreateIndex
CREATE INDEX "strategy_subscriptions_strategyId_idx" ON "strategy_subscriptions"("strategyId");

-- CreateIndex
CREATE INDEX "strategy_subscriptions_status_idx" ON "strategy_subscriptions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "strategy_subscriptions_accountId_strategyId_key" ON "strategy_subscriptions"("accountId", "strategyId");

-- CreateIndex
CREATE INDEX "trades_strategyId_idx" ON "trades"("strategyId");

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "strategies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_subscriptions" ADD CONSTRAINT "strategy_subscriptions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "alpaca_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_subscriptions" ADD CONSTRAINT "strategy_subscriptions_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "strategies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: the ONE strategy that exists today.
--
-- `core-equity-llm-v1` is the key the engine's Tier A sleeve ledger already
-- uses (`StrategyRegistryEntry.key`, `engine/src/services/strategy-ledger/
-- types.ts :: CORE_EQUITY_STRATEGY_ID`). Seeding the same key here is what lets
-- the two tiers join; inventing a second identifier would defeat the point.
--
-- Seeded INERT, and inert for a stronger reason than the state name: NOTHING
-- reads `lifecycleState` yet, so no code path can route capital by it either
-- way. The row is seeded 'SHADOW' rather than 'ACTIVE' so that when a consumer
-- IS built, the recorded default is the conservative one, and it is seeded with
-- NO subscriptions. Merging this migration changes no trading behaviour;
-- declaring the strategy live later is a one-row UPDATE, on evidence.
--
-- `manifestHash` is left NULL on purpose. The manifest that describes what this
-- strategy runs is bound by the engine (Stage 1); writing a placeholder hash
-- here would assert a binding that does not exist.
--
-- The id is a deterministic UUIDv5 of
-- `https://adaptic.ai/strategy/core-equity-llm-v1`, so re-running this
-- migration against a database that already has the row is a no-op rather than
-- a duplicate.
INSERT INTO "strategies" (
    "id", "key", "displayName", "description",
    "origin", "lifecycleState", "manifestHash",
    "ownerUserId", "createdAt", "updatedAt"
) VALUES (
    '2cfdcdf1-14ed-51a8-83a9-818f0517ad03',
    'core-equity-llm-v1',
    'Core Equity (LLM v1)',
    'The single equities strategy the engine runs today: LLM-driven intraday entries on the US equities universe with the engine''s tiered exit framework. Transcribed as an entity so it can be owned, subscribed to, and allocated; not a new behaviour.',
    'SYSTEM',
    'SHADOW',
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("key") DO NOTHING;

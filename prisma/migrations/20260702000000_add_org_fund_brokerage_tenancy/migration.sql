-- SP2-A migration A (DDL): Organization → Fund → BrokerageAccount tenancy layer.
-- Strictly additive: 5 new enums, 5 new tables, 3 new nullable/defaulted columns
-- on "users". AlpacaAccount, TradingPolicy, and every existing table are untouched.
-- BrokerageAccount bridges to the engine via "engineAccountId" (UNIQUE, FK →
-- alpaca_accounts.id, ON DELETE SET NULL).
--
-- Every statement is guarded (IF NOT EXISTS / duplicate_object handlers) so the
-- migration is safe to re-run and lock-light: no table rewrites, no backfill here
-- (backfill lives in 20260702000001_backfill_default_org_fund_brokerage).

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "BrokerageProvider" AS ENUM ('ALPACA', 'IBKR', 'COINBASE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "BrokerageAccountType" AS ENUM ('PAPER', 'LIVE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "FundStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'LIQUIDATING', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "OrgRole" AS ENUM ('OWNER', 'ADMIN', 'PORTFOLIO_MANAGER', 'COMPLIANCE_OFFICER', 'KYC_AML_OFFICER', 'AUDITOR', 'MEMBER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "FundRole" AS ENUM ('MANAGER', 'TRADER', 'ANALYST', 'COMPLIANCE', 'AUDITOR', 'VIEWER', 'INVESTOR');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AlterTable (users): OS-client profile/onboarding scalars. All additive:
-- nullable or defaulted, no rewrite of existing rows beyond the default fill.
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "signupCategory" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "organizations" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "website" TEXT,
    "businessType" TEXT,
    "emailDomains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "jurisdiction" TEXT,
    "regulatoryStatus" TEXT,
    "description" TEXT,
    "tradingDefaults" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "org_memberships" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "OrgRole" NOT NULL DEFAULT 'MEMBER',
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "funds" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "FundStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "organizationId" UUID NOT NULL,
    "managerId" UUID,
    "operatorId" UUID,
    "inceptionDate" TIMESTAMP(3),
    "aum" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "navPerShare" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "sharesOutstanding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "highWaterMarkNav" DOUBLE PRECISION,
    "fees" JSONB,
    "terms" JSONB,
    "regulatory" JSONB,
    "serviceProviders" JSONB,
    "tradingOverrides" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "funds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "fund_assignments" (
    "id" UUID NOT NULL,
    "fundId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "FundRole" NOT NULL DEFAULT 'VIEWER',
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fund_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "brokerage_accounts" (
    "id" UUID NOT NULL,
    "provider" "BrokerageProvider" NOT NULL DEFAULT 'ALPACA',
    "type" "BrokerageAccountType" NOT NULL DEFAULT 'PAPER',
    "label" TEXT,
    "fundId" UUID NOT NULL,
    "engineAccountId" UUID,
    "apiKey" TEXT,
    "apiSecret" TEXT,
    "configuration" JSONB,
    "marketOpen" BOOLEAN NOT NULL DEFAULT false,
    "realTime" BOOLEAN NOT NULL DEFAULT false,
    "autoAllocation" BOOLEAN NOT NULL DEFAULT true,
    "minPercentageChange" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "volumeThreshold" DOUBLE PRECISION NOT NULL DEFAULT 50000,
    "cryptoTradingPairs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "enablePortfolioTrailingStop" BOOLEAN NOT NULL DEFAULT false,
    "portfolioTrailPercent" DOUBLE PRECISION NOT NULL DEFAULT 4.0,
    "portfolioProfitThresholdPercent" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "reducedPortfolioTrailPercent" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "defaultTrailingStopPercentage100" DOUBLE PRECISION NOT NULL DEFAULT 4.0,
    "firstTrailReductionThreshold100" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "secondTrailReductionThreshold100" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "firstReducedTrailPercentage100" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "secondReducedTrailPercentage100" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "minimumPriceChangePercent100" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "brokerage_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "org_memberships_userId_idx" ON "org_memberships"("userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "org_memberships_organizationId_userId_key" ON "org_memberships"("organizationId", "userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "funds_organizationId_idx" ON "funds"("organizationId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "funds_status_idx" ON "funds"("status");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "funds_organizationId_slug_key" ON "funds"("organizationId", "slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "fund_assignments_userId_idx" ON "fund_assignments"("userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "fund_assignments_fundId_userId_key" ON "fund_assignments"("fundId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "brokerage_accounts_engineAccountId_key" ON "brokerage_accounts"("engineAccountId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "brokerage_accounts_fundId_idx" ON "brokerage_accounts"("fundId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "funds" ADD CONSTRAINT "funds_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "funds" ADD CONSTRAINT "funds_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "funds" ADD CONSTRAINT "funds_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "fund_assignments" ADD CONSTRAINT "fund_assignments_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "fund_assignments" ADD CONSTRAINT "fund_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "brokerage_accounts" ADD CONSTRAINT "brokerage_accounts_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "brokerage_accounts" ADD CONSTRAINT "brokerage_accounts_engineAccountId_fkey" FOREIGN KEY ("engineAccountId") REFERENCES "alpaca_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

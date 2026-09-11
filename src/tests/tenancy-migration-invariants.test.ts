import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

// Prisma-generated enum values for the SP2 tenancy layer
import {
  BrokerageProvider as PrismaBrokerageProvider,
  BrokerageAccountType as PrismaBrokerageAccountType,
  FundStatus as PrismaFundStatus,
  OrgRole as PrismaOrgRole,
  FundRole as PrismaFundRole,
} from '@prisma/client';

/**
 * SP2-A guardrail tests for the org → fund → brokerageAccount tenancy layer.
 *
 * Two protected surfaces:
 *
 * 1. The Prisma enums generated from `prisma/schema.prisma` must keep the exact
 *    value sets the platform contract (platform-os-client packages/database
 *    types) and the engine WS layer depend on.
 * 2. The backfill migration (migration B) must stay idempotent and preserve the
 *    load-bearing invariant `brokerage_accounts.id = engineAccountId =
 *    alpaca_accounts.id`. `prisma migrate deploy` runs unattended at Railway
 *    container start, so a regression here wedges the production deploy or
 *    silently breaks `resolveEngineAccountId` and every WS subscription scoped
 *    by engineAccountId. These tests parse the committed SQL and assert the
 *    guards are present.
 */

const MIGRATIONS_DIR = join(__dirname, '..', '..', 'prisma', 'migrations');

/**
 * Reads a committed migration file by folder name, with `--` comment lines
 * stripped so assertions match executable SQL only (header prose mentions
 * guard keywords and must not inflate counts).
 *
 * @param folder - Migration folder name under `prisma/migrations/`
 * @returns The migration SQL source without comment lines
 */
function readMigration(folder: string): string {
  return readFileSync(join(MIGRATIONS_DIR, folder, 'migration.sql'), 'utf8')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');
}

const MIGRATION_A = '20260702000000_add_org_fund_brokerage_tenancy';
const MIGRATION_B = '20260702000001_backfill_default_org_fund_brokerage';

describe('Enum Sync: SP2 tenancy enums match the platform contract', () => {
  it('BrokerageProvider has expected values', () => {
    expect(Object.values(PrismaBrokerageProvider)).toEqual(['ALPACA', 'IBKR', 'COINBASE']);
  });

  it('BrokerageAccountType mirrors AlpacaAccountType values', () => {
    expect(Object.values(PrismaBrokerageAccountType)).toEqual(['PAPER', 'LIVE']);
  });

  it('FundStatus has the platform lifecycle values (operative filter is ACTIVE)', () => {
    expect(Object.values(PrismaFundStatus)).toEqual([
      'DRAFT',
      'PENDING_APPROVAL',
      'ACTIVE',
      'SUSPENDED',
      'LIQUIDATING',
      'CLOSED',
    ]);
  });

  it('OrgRole has the platform org-RBAC values', () => {
    expect(Object.values(PrismaOrgRole)).toEqual([
      'OWNER',
      'ADMIN',
      'PORTFOLIO_MANAGER',
      'COMPLIANCE_OFFICER',
      'KYC_AML_OFFICER',
      'AUDITOR',
      'MEMBER',
    ]);
  });

  it('FundRole is the superset of the platform and fund-centric design roles', () => {
    expect(Object.values(PrismaFundRole)).toEqual([
      'MANAGER',
      'TRADER',
      'ANALYST',
      'COMPLIANCE',
      'AUDITOR',
      'VIEWER',
      'INVESTOR',
    ]);
  });
});

describe('Migration A (DDL) is guarded and additive-only', () => {
  const sql = readMigration(MIGRATION_A);

  it('guards every CREATE TYPE with a duplicate_object handler', () => {
    const createTypeCount = (sql.match(/CREATE TYPE/g) ?? []).length;
    const guardCount = (sql.match(/EXCEPTION WHEN duplicate_object THEN NULL/g) ?? []).length;
    expect(createTypeCount).toBe(5);
    // 5 enum guards + 9 FK-constraint guards share the same handler pattern.
    expect(guardCount).toBeGreaterThanOrEqual(createTypeCount);
  });

  it('creates all 5 tenancy tables with IF NOT EXISTS', () => {
    for (const table of [
      'organizations',
      'org_memberships',
      'funds',
      'fund_assignments',
      'brokerage_accounts',
    ]) {
      expect(sql).toContain(`CREATE TABLE IF NOT EXISTS "${table}"`);
    }
  });

  it('adds the three users columns with IF NOT EXISTS', () => {
    expect(sql).toMatch(/ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT/);
    expect(sql).toMatch(/ADD COLUMN IF NOT EXISTS "onboardingComplete" BOOLEAN NOT NULL DEFAULT false/);
    expect(sql).toMatch(/ADD COLUMN IF NOT EXISTS "signupCategory" TEXT/);
  });

  it('declares the engineAccountId bridge as UNIQUE with ON DELETE SET NULL to alpaca_accounts', () => {
    expect(sql).toContain('CREATE UNIQUE INDEX IF NOT EXISTS "brokerage_accounts_engineAccountId_key"');
    expect(sql).toMatch(
      /"brokerage_accounts_engineAccountId_fkey" FOREIGN KEY \("engineAccountId"\) REFERENCES "alpaca_accounts"\("id"\) ON DELETE SET NULL/,
    );
  });

  it('never mutates or drops existing tables (alpaca_accounts / trading_policies untouched)', () => {
    expect(sql).not.toMatch(/ALTER TABLE "alpaca_accounts"/);
    expect(sql).not.toMatch(/ALTER TABLE "trading_policies"/);
    expect(sql).not.toMatch(/\bDROP\b/);
    expect(sql).not.toMatch(/\bDELETE FROM\b/);
  });
});

describe('Migration B (backfill) is idempotent and preserves the engineAccountId invariant', () => {
  const sql = readMigration(MIGRATION_B);

  it('guards every INSERT with ON CONFLICT DO NOTHING', () => {
    const insertCount = (sql.match(/INSERT INTO/g) ?? []).length;
    const conflictCount = (sql.match(/ON CONFLICT(?: \([^)]*\))? DO NOTHING/g) ?? []).length;
    expect(insertCount).toBe(5);
    expect(conflictCount).toBe(insertCount);
  });

  it('creates brokerage_accounts rows with id = engineAccountId = alpaca_accounts.id', () => {
    // The brokerage INSERT selects a."id" for both the PK and engineAccountId.
    const brokerageInsert = sql.slice(sql.indexOf('INSERT INTO "brokerage_accounts"'));
    const selectsAccountIdTwice = /SELECT\s+a\."id",[\s\S]*?f\."id",\s*a\."id",/m;
    expect(brokerageInsert).toMatch(selectsAccountIdTwice);
    expect(brokerageInsert).toContain("'ALPACA'");
  });

  it('uses deterministic PKs (org id = fund id = user id) so re-runs are no-ops', () => {
    const orgInsert = sql.slice(sql.indexOf('INSERT INTO "organizations"'), sql.indexOf('INSERT INTO "org_memberships"'));
    expect(orgInsert).toMatch(/SELECT\s+u\."id",/);
    const fundInsert = sql.slice(sql.indexOf('INSERT INTO "funds"'), sql.indexOf('INSERT INTO "fund_assignments"'));
    expect(fundInsert).toMatch(/SELECT\s+u\."id",/);
  });

  it('backfills the default fund as ACTIVE with OWNER membership and MANAGER assignment', () => {
    expect(sql).toContain("'ACTIVE'");
    expect(sql).toContain("'OWNER'");
    expect(sql).toContain("'MANAGER'");
    expect(sql).toContain("'fund_operator'");
  });

  it('prefers canonical TradingPolicy values over AlpacaAccount mirrors for every policy column', () => {
    for (const column of [
      'enablePortfolioTrailingStop',
      'portfolioTrailPercent',
      'portfolioProfitThresholdPercent',
      'reducedPortfolioTrailPercent',
      'defaultTrailingStopPercentage100',
      'firstTrailReductionThreshold100',
      'secondTrailReductionThreshold100',
      'firstReducedTrailPercentage100',
      'secondReducedTrailPercentage100',
      'minimumPriceChangePercent100',
    ]) {
      expect(sql).toContain(`COALESCE(tp."${column}", a."${column}")`);
    }
  });

  it('never copies broker API credentials into brokerage_accounts', () => {
    expect(sql).not.toMatch(/"APIKey"/);
    expect(sql).not.toMatch(/"APISecret"/);
    // apiKey/apiSecret must not appear in the INSERT column list.
    expect(sql).not.toMatch(/"apiKey"/);
    expect(sql).not.toMatch(/"apiSecret"/);
  });

  it('scopes onboardingComplete flip to account-owning users and stays idempotent', () => {
    const update = sql.slice(sql.indexOf('UPDATE "users"'));
    expect(update).toMatch(/SET "onboardingComplete" = true/);
    expect(update).toMatch(/WHERE u\."onboardingComplete" = false/);
    expect(update).toMatch(/EXISTS \(SELECT 1 FROM "alpaca_accounts" a WHERE a\."userId" = u\."id"\)/);
  });

  it('contains no destructive statements', () => {
    expect(sql).not.toMatch(/\bDROP\b/);
    expect(sql).not.toMatch(/\bTRUNCATE\b/);
    expect(sql).not.toMatch(/\bDELETE FROM\b/);
  });
});

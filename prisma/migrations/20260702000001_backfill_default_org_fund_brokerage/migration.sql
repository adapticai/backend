-- SP2-A migration B (backfill): default Organization / Fund / OWNER membership /
-- MANAGER assignment per account-owning user, plus one brokerage_accounts row per
-- alpaca_accounts row with the load-bearing invariant:
--
--     brokerage_accounts.id = brokerage_accounts."engineAccountId" = alpaca_accounts.id
--
-- The platform's resolveEngineAccountId returns BrokerageAccount.id today, and the
-- engine scopes WS channels by engineAccountId — this invariant makes both correct
-- for every ALPACA account without any platform change.
--
-- IDEMPOTENCY: every INSERT is guarded (deterministic keys + ON CONFLICT DO NOTHING /
-- NOT EXISTS); the UPDATE is naturally idempotent. Deterministic keys:
--   * organizations.id  = users.id   (one default org per account-owning user)
--   * funds.id          = users.id   (one default fund per default org)
--   * brokerage_accounts.id = alpaca_accounts.id
-- Reusing the owning user's uuid as the org/fund PK makes re-runs no-ops without
-- relying on slug lookups, and eliminates any cross-user slug-collision hazard
-- (a colliding display slug skips the insert instead of merging tenants).
--
-- ============================================================================
-- REHEARSAL REQUIRED BEFORE PRODUCTION DEPLOY (SP2 work item 2):
-- `prisma migrate deploy` runs UNATTENDED at Railway container start (see the
-- package.json `start` script), so this backfill executes in production on the
-- first deploy of this branch. Before merging to stable-release:
--   1. Restore a staging copy of the Railway stable Postgres.
--   2. Run `npx prisma migrate deploy` against the staging copy.
--   3. Assert the row-count invariants:
--        SELECT count(*) FROM organizations
--          WHERE id IN (SELECT DISTINCT "userId" FROM alpaca_accounts WHERE "deletedAt" IS NULL);
--          -- == count of distinct users owning a non-deleted alpaca account
--        SELECT count(*) FROM brokerage_accounts b JOIN alpaca_accounts a ON a.id = b.id;
--          -- == count of alpaca accounts whose owner has a default fund
--        SELECT count(*) FROM brokerage_accounts WHERE "engineAccountId" IS DISTINCT FROM id AND provider = 'ALPACA';
--          -- == 0 (the invariant)
--   4. Re-run `npx prisma migrate deploy` (or this file directly) a second time
--      and assert counts are unchanged (idempotency proof).
-- STATUS: rehearsed 2026-07-02 against a local ephemeral Postgres 14 cluster
-- (all 169 migrations deployed, fixtures covering active/soft-deleted accounts,
-- TradingPolicy-vs-mirror precedence, and account-less users): all invariants
-- held and a direct re-run of both migration files changed zero rows. The
-- staging rehearsal against a COPY OF THE RAILWAY STABLE DB (real data shape,
-- real volume) has NOT been run and remains mandatory before merging to
-- stable-release.
-- ============================================================================

-- Step 1: one default Organization per user owning >= 1 non-deleted alpaca account.
-- Deterministic PK (org id = user id) keys idempotency; ON CONFLICT DO NOTHING also
-- absorbs display-slug collisions (first 8 uuid hex chars) by skipping, never merging.
INSERT INTO "organizations" ("id", "name", "slug", "businessType", "createdAt", "updatedAt")
SELECT
  u."id",
  COALESCE(u."name", u."email", 'Adaptic User') || ' Organization',
  'org-' || left(u."id"::text, 8),
  'fund_operator',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "users" u
WHERE EXISTS (
        SELECT 1 FROM "alpaca_accounts" a
        WHERE a."userId" = u."id" AND a."deletedAt" IS NULL
      )
ON CONFLICT DO NOTHING;

-- Step 2: OWNER membership linking each backfilled org to its owning user.
-- Joins on the deterministic org id (= user id) so organically-created orgs
-- (random uuids) are never touched.
INSERT INTO "org_memberships" ("id", "organizationId", "userId", "role", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  o."id",
  u."id",
  'OWNER',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "users" u
JOIN "organizations" o ON o."id" = u."id"
ON CONFLICT ("organizationId", "userId") DO NOTHING;

-- Step 3: one default ACTIVE Fund per backfilled org, managed and operated by
-- the owning user. Deterministic PK (fund id = user id) keys idempotency; the
-- (organizationId, slug) unique also guards.
INSERT INTO "funds" ("id", "name", "slug", "status", "currency", "organizationId", "managerId", "operatorId", "createdAt", "updatedAt")
SELECT
  u."id",
  'Default Fund',
  'default',
  'ACTIVE',
  'USD',
  o."id",
  u."id",
  u."id",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "users" u
JOIN "organizations" o ON o."id" = u."id"
ON CONFLICT DO NOTHING;

-- Step 4: MANAGER assignment linking each backfilled default fund to its user.
INSERT INTO "fund_assignments" ("id", "fundId", "userId", "role", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  f."id",
  u."id",
  'MANAGER',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "users" u
JOIN "funds" f ON f."id" = u."id"
ON CONFLICT ("fundId", "userId") DO NOTHING;

-- Step 5: one brokerage_accounts row per alpaca_accounts row whose owner has a
-- backfilled default fund, with id = engineAccountId = alpaca_accounts.id (the
-- load-bearing invariant). Policy columns prefer the canonical TradingPolicy
-- values and fall back to the AlpacaAccount mirror columns (the same precedence
-- the engine applies at runtime); account-signal columns (marketOpen, realTime,
-- autoAllocation, minPercentageChange, volumeThreshold, cryptoTradingPairs)
-- exist only on alpaca_accounts and are copied verbatim. API credentials are
-- NOT copied: the engine remains the sole holder of Alpaca credentials, keyed
-- via engineAccountId.
INSERT INTO "brokerage_accounts" (
  "id", "provider", "type", "label", "fundId", "engineAccountId", "configuration",
  "marketOpen", "realTime", "autoAllocation", "minPercentageChange", "volumeThreshold",
  "cryptoTradingPairs", "enablePortfolioTrailingStop", "portfolioTrailPercent",
  "portfolioProfitThresholdPercent", "reducedPortfolioTrailPercent",
  "defaultTrailingStopPercentage100", "firstTrailReductionThreshold100",
  "secondTrailReductionThreshold100", "firstReducedTrailPercentage100",
  "secondReducedTrailPercentage100", "minimumPriceChangePercent100",
  "createdAt", "updatedAt", "deletedAt"
)
SELECT
  a."id",
  'ALPACA',
  a."type"::text::"BrokerageAccountType",
  'Alpaca ' || initcap(lower(a."type"::text)),
  f."id",
  a."id",
  a."configuration",
  a."marketOpen",
  a."realTime",
  a."autoAllocation",
  a."minPercentageChange",
  a."volumeThreshold",
  a."cryptoTradingPairs",
  COALESCE(tp."enablePortfolioTrailingStop", a."enablePortfolioTrailingStop"),
  COALESCE(tp."portfolioTrailPercent", a."portfolioTrailPercent"),
  COALESCE(tp."portfolioProfitThresholdPercent", a."portfolioProfitThresholdPercent"),
  COALESCE(tp."reducedPortfolioTrailPercent", a."reducedPortfolioTrailPercent"),
  COALESCE(tp."defaultTrailingStopPercentage100", a."defaultTrailingStopPercentage100"),
  COALESCE(tp."firstTrailReductionThreshold100", a."firstTrailReductionThreshold100"),
  COALESCE(tp."secondTrailReductionThreshold100", a."secondTrailReductionThreshold100"),
  COALESCE(tp."firstReducedTrailPercentage100", a."firstReducedTrailPercentage100"),
  COALESCE(tp."secondReducedTrailPercentage100", a."secondReducedTrailPercentage100"),
  COALESCE(tp."minimumPriceChangePercent100", a."minimumPriceChangePercent100"),
  a."createdAt",
  CURRENT_TIMESTAMP,
  a."deletedAt"
FROM "alpaca_accounts" a
JOIN "funds" f ON f."id" = a."userId"
LEFT JOIN "trading_policies" tp ON tp."alpacaAccountId" = a."id"
ON CONFLICT DO NOTHING;

-- Step 6: existing account-owning users have already onboarded — skip the
-- OS-client onboarding gate for them. Naturally idempotent.
UPDATE "users" u
SET "onboardingComplete" = true
WHERE u."onboardingComplete" = false
  AND EXISTS (SELECT 1 FROM "alpaca_accounts" a WHERE a."userId" = u."id");

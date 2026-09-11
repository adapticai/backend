-- Additive, backward-compatible migration.
-- Adds the real economic-calendar and news-feed domain columns that the platform
-- markets page (FIND_ECON_EVENTS / FIND_MANY_NEWS_ARTICLES) already selects and
-- orders/filters by, but which the deployed schema never defined (schema drift ->
-- GRAPHQL_VALIDATION_FAILED 400). All columns are NULLABLE (or scalar-list, which
-- defaults to empty at the client). No columns are dropped or made NOT NULL; no
-- data loss. Hand-authored (not via `prisma migrate dev`) because the configured
-- DATABASE_URL points at the live Railway production Postgres, not a dev DB — the
-- SQL below is the exact output of `prisma migrate diff` (datamodel-only, DB-free).

-- AlterTable
ALTER TABLE "economic_events" ADD COLUMN     "actual" DOUBLE PRECISION,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "eventTime" TIMESTAMP(3),
ADD COLUMN     "forecast" DOUBLE PRECISION,
ADD COLUMN     "previous" DOUBLE PRECISION,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "news" ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "relevance" DOUBLE PRECISION,
ADD COLUMN     "symbols" TEXT[];

-- CreateIndex
CREATE INDEX "economic_events_eventTime_idx" ON "economic_events"("eventTime");

-- CreateIndex
CREATE INDEX "news_publishedAt_idx" ON "news"("publishedAt");

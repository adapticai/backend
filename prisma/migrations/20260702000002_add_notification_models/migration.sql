-- SP3 W4-N migration (DDL only): notification pipeline system-of-record.
-- Strictly additive: 2 new enums, 3 new tables. No existing table is altered —
-- the User/Organization/Fund relations added in prisma/schema.prisma are
-- back-relations only (the FK columns live on the new tables).
--
-- No backfill is needed by design: catalog channel defaults are resolved at
-- dispatch time from the 88-entry notification catalog, and `always:true`
-- locks (required/security emails) are enforced in the dispatcher service
-- layer, never as NotificationPreference rows. notification_events is
-- append-only with a UNIQUE idempotencyKey so trigger retries are exactly-once.
--
-- Every statement is guarded (IF NOT EXISTS / duplicate_object handlers) so
-- the migration is safe to re-run and lock-light: no table rewrites, no data
-- statements.
--
-- ============================================================================
-- REHEARSAL: rehearsed 2026-07-02 against a local ephemeral Postgres 14
-- cluster: all migrations deploy cleanly from empty, `prisma migrate diff`
-- reports no drift between the migration history and prisma/schema.prisma,
-- and a direct re-run of this file is a no-op. As with the SP2-A tenancy
-- migrations, a staging rehearsal against a COPY OF THE RAILWAY STABLE DB
-- remains mandatory before merging to stable-release (`prisma migrate deploy`
-- runs unattended at Railway container start).
-- ============================================================================

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'PUSH', 'IN_APP');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "NotificationDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'BOUNCED', 'FAILED', 'SUPPRESSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "notification_events" (
    "id" UUID NOT NULL,
    "eventId" TEXT NOT NULL,
    "orgId" UUID,
    "fundId" UUID,
    "actorUserId" UUID,
    "payload" JSONB NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "notification_deliveries" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "recipientUserId" UUID NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateVersion" TEXT NOT NULL,
    "provider" TEXT,
    "providerMessageId" TEXT,
    "status" "NotificationDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "statusDetail" TEXT,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "notification_preferences" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "eventId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "notification_events_idempotencyKey_key" ON "notification_events"("idempotencyKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notification_events_eventId_createdAt_idx" ON "notification_events"("eventId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notification_events_orgId_idx" ON "notification_events"("orgId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notification_events_fundId_idx" ON "notification_events"("fundId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notification_deliveries_recipientUserId_createdAt_idx" ON "notification_deliveries"("recipientUserId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notification_deliveries_status_idx" ON "notification_deliveries"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notification_deliveries_providerMessageId_idx" ON "notification_deliveries"("providerMessageId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "notification_preferences_userId_eventId_channel_key" ON "notification_preferences"("userId", "eventId", "channel");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "notification_events" ADD CONSTRAINT "notification_events_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "notification_events" ADD CONSTRAINT "notification_events_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "notification_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

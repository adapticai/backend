-- SP3 notification hardening (W6-S2, 2026-07-03): NotificationDelivery dedupe
-- constraint + dedicated IN_APP read-state column.
--
-- Strictly additive and guarded: it only ALTERs the notification_deliveries
-- table (a fresh SP3 table with no backfilled data) — no existing production
-- table is touched, no data is written or removed.
--
--   1. readAt TIMESTAMP(3) NULL — dedicated IN_APP read-state column so read
--      state is no longer overloaded onto the DELIVERED delivery status. The
--      platform notification feed adopts this column later; existing rows read
--      as NULL (unread), which is the correct default.
--
--   2. UNIQUE (eventId, recipientUserId, channel) — the exactly-once fan-out
--      invariant. Two concurrent dispatchers racing on the same NotificationEvent
--      can no longer insert duplicate recipient×channel deliveries; the second
--      insert conflicts, so the dispatcher upserts/skips instead of double-sending.
--
-- Empty-table assumption: notification_deliveries carries no rows in any
-- environment where the SP3 dispatcher has not yet run, so CREATE UNIQUE INDEX
-- cannot fail on pre-existing duplicates. As with the SP2-A / SP3 W4-N
-- migrations, `prisma migrate deploy` runs unattended at Railway container
-- start; every statement here is IF NOT EXISTS-guarded and lock-light (a single
-- nullable column add + one index build on an empty table), so a re-run is a
-- no-op and the deploy cannot wedge.
--
-- REHEARSAL: rehearsed 2026-07-03 against a local ephemeral Postgres cluster —
-- deploys cleanly on top of the full migration history from empty, a direct
-- re-run is a no-op, and `prisma migrate diff` reports no drift between the
-- migration history and prisma/schema.prisma. A staging rehearsal against a
-- COPY OF THE RAILWAY STABLE DB remains mandatory before merge to stable-release.

-- AlterTable
ALTER TABLE "notification_deliveries" ADD COLUMN IF NOT EXISTS "readAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "notification_deliveries_eventId_recipientUserId_channel_key" ON "notification_deliveries"("eventId", "recipientUserId", "channel");

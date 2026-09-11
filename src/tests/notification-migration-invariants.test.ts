import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

// Prisma-generated enum values for the SP3 notification pipeline
import {
  NotificationChannel as PrismaNotificationChannel,
  NotificationDeliveryStatus as PrismaNotificationDeliveryStatus,
} from '@prisma/client';

/**
 * SP3 W4-N guardrail tests for the notification pipeline models
 * (NotificationEvent / NotificationDelivery / NotificationPreference).
 *
 * Three protected surfaces:
 *
 * 1. The Prisma enums generated from `prisma/schema.prisma` must keep the
 *    exact value sets the platform dispatcher and the notification catalog
 *    contract depend on (channel fan-out keys and delivery lifecycle states).
 * 2. The exactly-once invariant: `notification_events.idempotencyKey` is
 *    UNIQUE, so trigger sources (engine, platform actions, schedulers,
 *    billing webhooks) can retry event writes without producing duplicate
 *    notifications. The dispatcher relies on this constraint — not on
 *    application-level dedupe — so it must never be weakened.
 * 3. The migration must stay DDL-only, guarded, and additive. Catalog
 *    channel defaults and `always:true` locks are resolved in the dispatcher
 *    service layer at dispatch time, never materialised as rows, so any
 *    INSERT/UPDATE appearing in this migration is a design regression.
 *    `prisma migrate deploy` runs unattended at Railway container start, so
 *    an unguarded statement wedges the production deploy.
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

const MIGRATION = '20260702000002_add_notification_models';

describe('Enum Sync: SP3 notification enums match the catalog contract', () => {
  it('NotificationChannel has the catalog channel set (email/push/inapp)', () => {
    expect(Object.values(PrismaNotificationChannel)).toEqual(['EMAIL', 'PUSH', 'IN_APP']);
  });

  it('NotificationDeliveryStatus has the delivery lifecycle states', () => {
    expect(Object.values(PrismaNotificationDeliveryStatus)).toEqual([
      'PENDING',
      'SENT',
      'DELIVERED',
      'BOUNCED',
      'FAILED',
      'SUPPRESSED',
    ]);
  });
});

describe('Notification migration is guarded, DDL-only, and additive', () => {
  const sql = readMigration(MIGRATION);

  it('guards every CREATE TYPE with a duplicate_object handler', () => {
    const createTypeCount = (sql.match(/CREATE TYPE/g) ?? []).length;
    const guardCount = (sql.match(/EXCEPTION WHEN duplicate_object THEN NULL/g) ?? []).length;
    expect(createTypeCount).toBe(2);
    // 2 enum guards + 5 FK-constraint guards share the same handler pattern.
    expect(guardCount).toBeGreaterThanOrEqual(createTypeCount);
  });

  it('creates all 3 notification tables with IF NOT EXISTS', () => {
    for (const table of [
      'notification_events',
      'notification_deliveries',
      'notification_preferences',
    ]) {
      expect(sql).toContain(`CREATE TABLE IF NOT EXISTS "${table}"`);
    }
  });

  it('declares idempotencyKey UNIQUE (the exactly-once event-write invariant)', () => {
    expect(sql).toContain(
      'CREATE UNIQUE INDEX IF NOT EXISTS "notification_events_idempotencyKey_key"'
    );
    expect(sql).toMatch(/"idempotencyKey" TEXT NOT NULL/);
  });

  it('declares the per-user preference key UNIQUE on (userId, eventId, channel)', () => {
    expect(sql).toContain(
      'CREATE UNIQUE INDEX IF NOT EXISTS "notification_preferences_userId_eventId_channel_key"'
    );
    expect(sql).toMatch(
      /"notification_preferences"\("userId", "eventId", "channel"\)/
    );
  });

  it('cascades delivery rows with their event and scopes org/fund FKs with SET NULL', () => {
    expect(sql).toMatch(
      /"notification_deliveries_eventId_fkey" FOREIGN KEY \("eventId"\) REFERENCES "notification_events"\("id"\) ON DELETE CASCADE/
    );
    expect(sql).toMatch(
      /"notification_events_orgId_fkey" FOREIGN KEY \("orgId"\) REFERENCES "organizations"\("id"\) ON DELETE SET NULL/
    );
    expect(sql).toMatch(
      /"notification_events_fundId_fkey" FOREIGN KEY \("fundId"\) REFERENCES "funds"\("id"\) ON DELETE SET NULL/
    );
  });

  it('keeps actorUserId a plain scalar (no FK) so event rows survive user deletion', () => {
    expect(sql).toMatch(/"actorUserId" UUID/);
    expect(sql).not.toMatch(/FOREIGN KEY \("actorUserId"\)/);
  });

  it('is DDL-only: no backfill or data statements (defaults resolve at dispatch time)', () => {
    expect(sql).not.toMatch(/\bINSERT INTO\b/);
    expect(sql).not.toMatch(/\bUPDATE\s+"/);
  });

  it('only alters the new notification tables (existing tables untouched)', () => {
    const alterTargets = [...sql.matchAll(/ALTER TABLE "([^"]+)"/g)].map((m) => m[1]);
    const allowed = new Set([
      'notification_events',
      'notification_deliveries',
      'notification_preferences',
    ]);
    expect(alterTargets.length).toBeGreaterThan(0);
    for (const target of alterTargets) {
      expect(allowed.has(target)).toBe(true);
    }
  });

  it('contains no destructive statements', () => {
    expect(sql).not.toMatch(/\bDROP\b/);
    expect(sql).not.toMatch(/\bTRUNCATE\b/);
    expect(sql).not.toMatch(/\bDELETE FROM\b/);
  });
});

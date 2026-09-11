import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { Prisma } from '@prisma/client';

/**
 * W6-S2 guardrail tests for the NotificationDelivery hardening migration
 * (`20260703000000_add_notification_delivery_dedupe_readat`).
 *
 * Two protected surfaces:
 *
 * 1. The dedupe UNIQUE(eventId, recipientUserId, channel) is the exactly-once
 *    fan-out invariant: two concurrent dispatchers can no longer insert
 *    duplicate recipient×channel deliveries for one event, so the platform
 *    cannot double-send. It must never be weakened.
 * 2. The migration must stay additive, guarded, and touch only the (new,
 *    unbackfilled) notification_deliveries table — `prisma migrate deploy` runs
 *    unattended at Railway container start, so an unguarded or table-rewriting
 *    statement would wedge the production deploy.
 */

const MIGRATIONS_DIR = join(__dirname, '..', '..', 'prisma', 'migrations');

/** Reads a committed migration file with `--` comment lines stripped. */
function readMigration(folder: string): string {
  return readFileSync(join(MIGRATIONS_DIR, folder, 'migration.sql'), 'utf8')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');
}

const MIGRATION = '20260703000000_add_notification_delivery_dedupe_readat';

describe('NotificationDelivery hardening migration is additive and guarded', () => {
  const sql = readMigration(MIGRATION);

  it('adds the readAt column as a nullable TIMESTAMP, guarded with IF NOT EXISTS', () => {
    expect(sql).toMatch(
      /ALTER TABLE "notification_deliveries" ADD COLUMN IF NOT EXISTS "readAt" TIMESTAMP\(3\)/
    );
    // Nullable: no NOT NULL / DEFAULT clause on the added column.
    expect(sql).not.toMatch(/ADD COLUMN IF NOT EXISTS "readAt"[^;]*NOT NULL/);
  });

  it('declares the dedupe UNIQUE index on (eventId, recipientUserId, channel)', () => {
    expect(sql).toContain(
      'CREATE UNIQUE INDEX IF NOT EXISTS "notification_deliveries_eventId_recipientUserId_channel_key"'
    );
    expect(sql).toMatch(
      /"notification_deliveries"\("eventId", "recipientUserId", "channel"\)/
    );
  });

  it('only alters the notification_deliveries table', () => {
    const alterTargets = [...sql.matchAll(/ALTER TABLE "([^"]+)"/g)].map(
      (m) => m[1]
    );
    expect(alterTargets.length).toBeGreaterThan(0);
    for (const target of alterTargets) {
      expect(target).toBe('notification_deliveries');
    }
  });

  it('contains no destructive or data statements', () => {
    expect(sql).not.toMatch(/\bDROP\b/);
    expect(sql).not.toMatch(/\bTRUNCATE\b/);
    expect(sql).not.toMatch(/\bDELETE FROM\b/);
    expect(sql).not.toMatch(/\bINSERT INTO\b/);
    expect(sql).not.toMatch(/\bUPDATE\s+"/);
  });
});

describe('Prisma codegen picked up the additive NotificationDelivery fields', () => {
  it('exposes readAt on the generated NotificationDelivery scalar field enum', () => {
    expect(Prisma.NotificationDeliveryScalarFieldEnum).toHaveProperty('readAt');
  });
});

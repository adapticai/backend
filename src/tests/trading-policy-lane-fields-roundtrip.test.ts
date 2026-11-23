import { describe, it, expect, beforeAll } from 'vitest';
import { runTsNodeHarness } from '../middleware/__tests__/ts-node-harness';

/**
 * The TradingPolicy lane-preferences carrier through the generated GraphQL resolvers and
 * the migration's own SQL run down and up, against a real Postgres built from
 * the migration history (`trading-policy-lane-fields-roundtrip.harness.ts`).
 *
 * Needs LANE_IT_DATABASE_URL pointing at a
 * disposable migrated database, which scripts/test-db/global-setup.ts provisions on every run. Run it locally:
 *
 *   LANE_IT_DATABASE_URL=postgresql://postgres@127.0.0.1:5499/lane_it \
 *     npx vitest run src/tests/trading-policy-lane-fields-roundtrip.test.ts
 */

interface StepResult {
  data: Record<string, unknown> | null;
  errors: string[];
}

interface ColumnRow {
  column_name: string;
  is_nullable: string;
  column_default: string | null;
}

interface CatalogueSnapshot {
  columns: ColumnRow[];
  row: Record<string, unknown> | null;
}

interface Report {
  tag: string;
  steps: Record<string, StepResult>;
  downUp: Record<string, CatalogueSnapshot>;
}

const DATABASE_URL = process.env.LANE_IT_DATABASE_URL;
const HARNESS_TIMEOUT_MS = 300_000;
const LANE_KEYS = ['intradayLanePrefs'];

/** A row with the lane column removed, to compare everything else. */
function withoutLaneColumns(row: Record<string, unknown> | null): Record<string, unknown> {
  return Object.fromEntries(Object.entries(row ?? {}).filter(([key]) => !LANE_KEYS.includes(key)));
}

// The database is provisioned for every run (scripts/test-db/global-setup.ts);
// without it this suite fails rather than skips, since a skip reads as a pass.
if (!DATABASE_URL) {
  throw new Error('No database for this suite: scripts/test-db/global-setup.ts provisions one on every run.');
}

describe('TradingPolicy lane preferences against a migrated Postgres', () => {
  let report: Report;
  const policy = (name: string): Record<string, unknown> => {
    const data = report.steps[name].data ?? {};
    return (data.createOneTradingPolicy ?? data.updateOneTradingPolicy) as Record<string, unknown>;
  };

  beforeAll(async () => {
    report = await runTsNodeHarness<Report>('src/tests/trading-policy-lane-fields-roundtrip.harness.ts', HARNESS_TIMEOUT_MS);
  }, HARNESS_TIMEOUT_MS + 30_000);

  it('a policy created without the carrier reads back disarmed (null)', () => {
    expect(report.steps.created.errors).toEqual([]);
    expect(policy('created')).toMatchObject({ intradayLanePrefs: null, maxOpenPositions: 7 });
  });

  it('a written value round-trips', () => {
    expect(report.steps.armed.errors).toEqual([]);
    expect(policy('armed')).toMatchObject({ intradayLanePrefs: { armed: true, perLaneTradesPerDay: 4 } });
  });

  it('the carrier can be rewritten to armed:false', () => {
    expect(report.steps.cleared.errors).toEqual([]);
    expect(policy('cleared')).toMatchObject({ intradayLanePrefs: { armed: false } });
  });

  it('a GraphQL null clears the carrier back to unset', () => {
    expect(report.steps.prefsNull.errors).toEqual([]);
    expect(policy('prefsNull')).toMatchObject({ intradayLanePrefs: null });
  });

  it('down drops exactly the one column and leaves the rest of the row intact', () => {
    const { before, down } = report.downUp;
    expect(before.columns.map((c) => c.column_name)).toEqual(['intradayLanePrefs']);
    expect(before.row).toMatchObject({ intradayLanePrefs: { armed: true } });
    expect(down.columns).toEqual([]);
    expect(Object.keys(down.row ?? {}).filter((key) => LANE_KEYS.includes(key))).toEqual([]);
    expect(down.row).toEqual(withoutLaneColumns(before.row));
  });

  it('up re-adds it with the existing row disarmed and nothing else changed', () => {
    const { down, up } = report.downUp;
    expect(up.columns).toEqual([{ column_name: 'intradayLanePrefs', is_nullable: 'YES', column_default: null }]);
    expect(up.row).toMatchObject({ intradayLanePrefs: null });
    expect(withoutLaneColumns(up.row)).toEqual(down.row);
  });

  it('the down/up run was rolled back', () => {
    const { before, afterRollback } = report.downUp;
    expect(afterRollback.columns).toEqual(before.columns);
    expect(afterRollback.row).toMatchObject({ intradayLanePrefs: null });
  });
});

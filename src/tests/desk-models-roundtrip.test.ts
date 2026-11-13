import { describe, it, expect, beforeAll } from 'vitest';
import { runTsNodeHarness } from '../middleware/__tests__/ts-node-harness';

/**
 * Create → read → update → delete of one Follow and one DeskDecision through
 * the generated GraphQL resolvers against a real Postgres built from the
 * migration history (`desk-models-roundtrip.harness.ts`).
 *
 * Runs only when DESK_IT_DATABASE_URL points at a disposable database the
 * migrations have been applied to; CI has no database, so it is skipped there:
 *
 *   DESK_IT_DATABASE_URL=postgresql://postgres@127.0.0.1:5499/desk_it \
 *     npx vitest run src/tests/desk-models-roundtrip.test.ts
 */

interface StepResult {
  data: Record<string, unknown> | null;
  errors: string[];
}

interface RoundTripReport {
  ids: { userId: string; fundId: string; accountId: string };
  steps: Record<string, StepResult>;
}

const DATABASE_URL = process.env.DESK_IT_DATABASE_URL;
const HARNESS_TIMEOUT_MS = 300_000;

describe.skipIf(!DATABASE_URL)('desk models round-trip through the GraphQL resolvers', () => {
  let report: RoundTripReport;

  beforeAll(async () => {
    report = await runTsNodeHarness<RoundTripReport>(
      'src/tests/desk-models-roundtrip.harness.ts',
      HARNESS_TIMEOUT_MS
    );
  }, HARNESS_TIMEOUT_MS + 30_000);

  it('creates, reads, updates and deletes a Follow', () => {
    const { steps, ids } = report;
    expect(steps.followCreate.errors).toEqual([]);
    expect(steps.followCreate.data?.createOneFollow).toMatchObject({
      userId: ids.userId,
      fundId: ids.fundId,
      targetKind: 'asset',
      targetId: 'NVDA',
      level: 1,
      riskBudgetPctNav: null,
    });
    expect(steps.followRead.data?.follow).toMatchObject({ targetId: 'NVDA', level: 1 });
    expect(steps.followUpdate.data?.updateOneFollow).toMatchObject({ level: 2 });
    expect(steps.followDelete.errors).toEqual([]);
    expect(steps.followGone.data?.follow).toBeNull();
  });

  it('refuses a Follow level outside 0..2', () => {
    expect(report.steps.followLevelOutOfRange.data).toBeNull();
    expect(report.steps.followLevelOutOfRange.errors.join('\n')).toContain(
      'follows_level_range_check'
    );
  });

  it('creates, lists open, resolves and deletes a DeskDecision', () => {
    const { steps, ids } = report;
    expect(steps.decisionCreate.errors).toEqual([]);
    expect(steps.decisionCreate.data?.createOneDeskDecision).toMatchObject({
      fundId: ids.fundId,
      accountId: ids.accountId,
      ruleId: 'R-01',
      status: 'open',
      nums: [{ label: 'Size', value: '1.2% NAV' }],
      reasonRequired: true,
      decidedBy: null,
      decidedAt: null,
    });
    expect(steps.decisionOpenByIndex.data?.deskDecisions).toHaveLength(1);
    expect(steps.decisionUpdate.data?.updateOneDeskDecision).toMatchObject({
      status: 'approved',
      decidedBy: ids.userId,
      decidedAt: '2026-11-14T14:30:00.000Z',
      reason: 'Within the event budget.',
    });
    expect(steps.decisionDelete.errors).toEqual([]);
    expect(steps.decisionGone.data?.deskDecision).toBeNull();
  });
});

import { describe, it, expect, beforeAll } from 'vitest';
import { runTsNodeHarness } from '../middleware/__tests__/ts-node-harness';

/**
 * `Strategy.desk`, the `MandateRule` machine keys and the `AuditLog` ledger
 * sequence through the generated GraphQL resolvers against a real Postgres
 * built from the migration history (`desk-attribution-roundtrip.harness.ts`).
 *
 * SKIPPED IN CI: it runs only when DESK_IT_DATABASE_URL points at a
 * disposable migrated database, and CI has none. Run it locally:
 *
 *   DESK_IT_DATABASE_URL=postgresql://postgres@127.0.0.1:5499/desk_it \
 *     npx vitest run src/tests/desk-attribution-roundtrip.test.ts
 */

interface StepResult {
  data: Record<string, unknown> | null;
  errors: string[];
}

interface Report {
  tag: string;
  steps: Record<string, StepResult>;
}

const DATABASE_URL = process.env.DESK_IT_DATABASE_URL;
const HARNESS_TIMEOUT_MS = 300_000;

describe.skipIf(!DATABASE_URL)('desk attribution and ledger fields against a migrated Postgres', () => {
  let report: Report;
  const step = (name: string): StepResult => report.steps[name];

  beforeAll(async () => {
    report = await runTsNodeHarness<Report>('src/tests/desk-attribution-roundtrip.harness.ts', HARNESS_TIMEOUT_MS);
  }, HARNESS_TIMEOUT_MS + 30_000);

  it('stores a strategy desk, leaves an unassigned strategy null, and filters by desk', () => {
    expect(step('strategyAssigned').errors).toEqual([]);
    expect(step('strategyAssigned').data?.createOneStrategy).toMatchObject({ desk: 'THEMATIC' });
    expect(step('strategyUnassigned').data?.createOneStrategy).toMatchObject({ desk: null });
    expect(step('strategiesOnDesk').data?.strategies).toEqual([
      { key: `desk-attr-${report.tag}-a`, desk: 'THEMATIC' },
    ]);
  });

  it('stores a measured rule with its machine keys, and a qualitative rule without them', () => {
    expect(step('ruleMeasured').errors).toEqual([]);
    expect(step('ruleMeasured').data?.createOneMandateRule).toMatchObject({
      ruleCode: 'R-01',
      metricKey: 'GROSS_LEVERAGE',
      action: 'BLOCK',
      group: 'EXPOSURE',
      threshold: 2,
    });
    expect(step('ruleQualitative').data?.createOneMandateRule).toMatchObject({
      ruleCode: null,
      metricKey: null,
      action: null,
      group: null,
    });
  });

  it('refuses a measured rule missing its threshold or its code', () => {
    for (const name of ['ruleMetricWithoutThreshold', 'ruleMetricWithoutCode']) {
      expect(step(name).data, name).toBeNull();
      expect(step(name).errors.join('\n'), name).toContain('mandate_rules_metric_complete_check');
    }
  });

  it('refuses a blank rule code', () => {
    expect(step('ruleBlankCode').data).toBeNull();
    expect(step('ruleBlankCode').errors.join('\n')).toContain('mandate_rules_rule_code_not_blank_check');
  });

  it('keeps a rule code unique within a version and free across versions', () => {
    expect(step('ruleDuplicateCode').data).toBeNull();
    expect(step('ruleDuplicateCode').errors.join('\n')).toMatch(/Unique constraint failed/);
    expect(step('ruleSameCodeOtherVersion').errors).toEqual([]);
  });

  it('numbers ledger rows from the database in insert order and pages before a cursor', () => {
    const seq = (name: string): bigint =>
      BigInt((step(name).data?.createOneAuditLog as { ledgerSeq: string | number }).ledgerSeq);
    expect(step('ledgerFirst').errors).toEqual([]);
    expect(seq('ledgerSecond')).toBeGreaterThan(seq('ledgerFirst'));
    expect(seq('ledgerThird')).toBeGreaterThan(seq('ledgerSecond'));
    const page = step('ledgerPageBefore').data?.auditLogs as Array<{ recordId: string; ledgerSeq: string | number }>;
    expect(step('ledgerPageBefore').errors).toEqual([]);
    expect(page.map((row) => [row.recordId, BigInt(row.ledgerSeq)])).toEqual([
      [`${report.tag}-2`, seq('ledgerSecond')],
    ]);
  });

  it('does not let a caller choose a ledger position', () => {
    expect(step('ledgerCallerSuppliedSeq').data).toBeNull();
    expect(step('ledgerCallerSuppliedSeq').errors.join('\n')).toMatch(/ledgerSeq/);
  });
});

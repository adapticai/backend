import { describe, it, expect, beforeAll } from 'vitest';
import { runTsNodeHarness } from '../middleware/__tests__/ts-node-harness';

/**
 * Strategy fund tenancy (G-STR-06) through the served schema against a real
 * Postgres built from the migration history (`strategy-fund-tenancy.harness.ts`).
 * It proves what the unit suites cannot: that the read scope survives
 * TypeGraphQL's conversion into the generated input classes (a fragment the
 * classes do not carry is silently dropped and the read stops being scoped),
 * and that the `fundId` column and its foreign key exist as the migration
 * writes them.
 *
 * SKIPPED IN CI: it runs only when DESK_IT_DATABASE_URL points at a
 * disposable migrated database, and CI has none. Run it locally:
 *
 *   DESK_IT_DATABASE_URL=postgresql://postgres@127.0.0.1:5499/desk_it \
 *     npx vitest run --maxWorkers=2 src/tests/strategy-fund-tenancy.test.ts
 */

interface StepResult {
  data: Record<string, unknown> | null;
  errors: string[];
  codes: string[];
}

interface Report {
  steps: Record<string, StepResult>;
  facts: {
    fundA: string;
    fundB: string;
    prefix: string;
    created: Array<{ owner: string; fund: string | null }>;
    aliceInBAfterSave: { displayName: string; fund: string | null };
  };
}

const DATABASE_URL = process.env.DESK_IT_DATABASE_URL;
const HARNESS_TIMEOUT_MS = 300_000;

describe.skipIf(!DATABASE_URL)(
  'strategy fund tenancy against a migrated Postgres',
  () => {
    let report: Report;
    const step = (name: string): StepResult => report.steps[name];
    const keys = (name: string): string[] =>
      ((step(name).data?.strategies ?? []) as Array<{ key: string }>).map(
        (row) => row.key.slice(report.facts.prefix.length + 1)
      );

    beforeAll(async () => {
      report = await runTsNodeHarness<Report>(
        'src/tests/strategy-fund-tenancy.harness.ts',
        HARNESS_TIMEOUT_MS
      );
    }, HARNESS_TIMEOUT_MS + 30_000);

    it('stamps the fund from the input, and refuses a fund the author does not belong to', () => {
      expect(step('aliceCreatesInB').codes).toEqual(['FORBIDDEN']);
      expect(step('aliceCreatesInA').errors).toEqual([]);
      expect(step('aliceCreatesInA').data?.createStrategyDraft).toMatchObject({
        status: 'WRITTEN',
      });
      expect(step('bobCreatesInB').data?.createStrategyDraft).toMatchObject({
        status: 'WRITTEN',
      });
      expect(
        report.facts.created.sort((a, b) => a.owner.localeCompare(b.owner))
      ).toEqual([
        { owner: 'alice', fund: 'A' },
        { owner: 'bob', fund: 'B' },
      ]);
    });

    it('a member of fund A reads SYSTEM strategies and fund A drafts, never a draft in fund B', () => {
      expect(step('aliceList').errors).toEqual([]);
      expect(keys('aliceList')).toEqual(['0-system', '1-alice-in-a']);
      expect(keys('bobList')).toEqual([
        '0-system',
        '2-bob-in-b',
        '3-alice-in-b',
      ]);
      expect(step('aliceReadsBobsDraft').data).toEqual({ strategy: null });
      expect(step('aliceReadsHerDraftInB').data).toEqual({ strategy: null });
    });

    it('a member of fund A cannot write a draft in fund B, even one she authored', () => {
      expect(step('aliceSavesHerDraftInB').data?.saveStrategyDraft).toEqual({
        status: 'NOT_FOUND',
      });
      expect(report.facts.aliceInBAfterSave).toEqual({
        displayName: 'Left behind',
        fund: 'B',
      });
    });

    it('an unauthenticated caller reads only SYSTEM strategies; the service principal is unscoped', () => {
      expect(keys('anonymousList')).toEqual(['0-system']);
      expect(keys('serviceList')).toEqual([
        '0-system',
        '1-alice-in-a',
        '2-bob-in-b',
        '3-alice-in-b',
      ]);
    });
  }
);

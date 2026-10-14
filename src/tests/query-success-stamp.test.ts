import { describe, it, expect } from 'vitest';

const itUrl = process.env.HEALTH_IT_DATABASE_URL;
if (itUrl) {
  // prismaClient builds its singleton at first import, so the pool shape for
  // the integration case has to be in place before anything imports it.
  process.env.DATABASE_URL = itUrl;
  process.env.DATABASE_POOL_SIZE = '2';
  process.env.DATABASE_POOL_TIMEOUT_MS = '10000';
}

/**
 * FU-550 limb 1: the success stamp `/health` reads.
 *
 * The unit block needs no database. The integration block reproduces pool
 * saturation against a real Postgres and only runs when
 * HEALTH_IT_DATABASE_URL is set (CI has no database, so it is skipped there):
 *
 *   HEALTH_IT_DATABASE_URL=postgresql://postgres@127.0.0.1:55432/postgres \
 *     npx vitest run src/tests/query-success-stamp.test.ts
 */

describe('stampQuerySuccess', () => {
  it('records the time of a query that resolves', async () => {
    const { stampQuerySuccess, getLastQuerySucceededAt } =
      await import('../prismaClient');
    const before = Date.now();
    await expect(stampQuerySuccess(async () => 'rows')).resolves.toBe('rows');
    expect(getLastQuerySucceededAt()).toBeGreaterThanOrEqual(before);
  });

  it('leaves the stamp alone when the query rejects', async () => {
    const { stampQuerySuccess, getLastQuerySucceededAt } =
      await import('../prismaClient');
    await stampQuerySuccess(async () => 'rows');
    const stamped = getLastQuerySucceededAt();
    await expect(
      stampQuerySuccess(async () => {
        throw new Error('P2024: Timed out fetching a new connection');
      })
    ).rejects.toThrow('P2024');
    expect(getLastQuerySucceededAt()).toBe(stamped);
  });
});

describe.skipIf(!itUrl)(
  '/health readiness under a saturated pool (real Postgres)',
  () => {
    it('stays connected via recent-query while every pool connection is busy', async () => {
      const { default: prisma, getLastQuerySucceededAt } =
        await import('../prismaClient');
      const { checkDatabaseReadiness } = await import('../health');

      // A completed query through the guarded client stamps success.
      const before = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      expect(getLastQuerySucceededAt()).toBeGreaterThanOrEqual(before);

      // Occupy both pool connections, with more work queued behind them.
      const busy = Array.from(
        { length: 4 },
        () => prisma.$queryRaw`SELECT 1 AS slept FROM pg_sleep(3)`
      );
      const settled = Promise.allSettled(busy);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // The pre-FU-550 check: SELECT 1 on the shared pool now has to queue.
      const oldStyleStart = Date.now();
      const oldStyle = await Promise.race([
        prisma.$queryRaw`SELECT 1`.then(() => 'answered'),
        new Promise((resolve) => setTimeout(() => resolve('blocked'), 2_000)),
      ]);
      const oldStyleMs = Date.now() - oldStyleStart;

      // The new check answers from the stamp without waiting on the pool.
      const newStyleStart = Date.now();
      const readiness = await checkDatabaseReadiness();
      const newStyleMs = Date.now() - newStyleStart;

      expect(oldStyle).toBe('blocked');
      expect(oldStyleMs).toBeGreaterThanOrEqual(1_900);
      expect(readiness.database).toBe('connected');
      expect(readiness.databaseCheck).toBe('recent-query');
      expect(newStyleMs).toBeLessThan(50);

      // The saturating queries completing refresh the stamp themselves.
      const stampBeforeDrain = getLastQuerySucceededAt() ?? 0;
      const outcomes = await settled;
      expect(outcomes.every((o) => o.status === 'fulfilled')).toBe(true);
      expect(getLastQuerySucceededAt()).toBeGreaterThan(stampBeforeDrain);

      await prisma.$disconnect();
    }, 30_000);
  }
);

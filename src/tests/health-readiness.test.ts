import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import type { AddressInfo } from 'net';
import type { Server } from 'http';

/**
 * FU-550 limb 1: `/health` must not read a saturated-but-working pool as a
 * dead process. These tests pin the decision logic without a database: the
 * success stamp and both Prisma clients are stubbed.
 */

const mocks = vi.hoisted(() => ({
  lastSuccess: undefined as number | undefined,
  pinnedQueryRaw: vi.fn(),
}));

// The heartbeat constants and statement-timeout resolver stay real: the
// freshness window is derived from them, and the tests below pin that.
vi.mock('../prismaClient', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../prismaClient')>()),
  default: { $queryRaw: mocks.pinnedQueryRaw },
  getLastQuerySucceededAt: () => mocks.lastSuccess,
}));

import {
  checkDatabaseReadiness,
  createHealthRouter,
  DB_SUCCESS_FRESHNESS_MS,
  HEALTH_PROBE_TIMEOUT_MS,
  warnIfStatementTimeoutDefeatsFreshness,
} from '../health';
import {
  DEFAULT_STATEMENT_TIMEOUT_MS,
  HEARTBEAT_INTERVAL_MS,
  MAX_HEARTBEAT_FAILURES,
} from '../prismaClient';
import { logger } from '../utils/logger';

/**
 * A `$queryRaw` that does not settle until the test ends — a pool with no free
 * connection. Released in afterEach so an outstanding probe from one test is
 * not joined by the next.
 */
const pendingReleases: Array<() => void> = [];
const hang = (): Promise<never> =>
  new Promise<never>((_, reject) => {
    pendingReleases.push(() => reject(new Error('released by test teardown')));
  });

let liveQueryRaw: ReturnType<typeof vi.fn>;

beforeEach(() => {
  mocks.lastSuccess = undefined;
  mocks.pinnedQueryRaw.mockReset();
  liveQueryRaw = vi.fn();
  (globalThis as { prisma?: unknown }).prisma = { $queryRaw: liveQueryRaw };
});

afterEach(async () => {
  vi.useRealTimers();
  pendingReleases.splice(0).forEach((release) => release());
  // Let the released probe's settle handlers run before the next test.
  await new Promise((resolve) => setImmediate(resolve));
  delete (globalThis as { prisma?: unknown }).prisma;
});

describe('DB_SUCCESS_FRESHNESS_MS', () => {
  it('is derived from the heartbeat: 75s at the current 3 x 30s', () => {
    expect(DB_SUCCESS_FRESHNESS_MS).toBe(
      (MAX_HEARTBEAT_FAILURES - 0.5) * HEARTBEAT_INTERVAL_MS
    );
    // This value pin is the assertion that discriminates. The relation above
    // recomputes the definition from the same constants, so it can't fail.
    // If the heartbeat constants change, update 75_000 deliberately; don't delete it.
    expect(DB_SUCCESS_FRESHNESS_MS).toBe(75_000);
  });

  it('outlasts one heartbeat interval, so an idle process the heartbeat refreshes stays fresh', () => {
    expect(DB_SUCCESS_FRESHNESS_MS).toBeGreaterThan(HEARTBEAT_INTERVAL_MS);
  });

  it('expires before the heartbeat reconnects, so a dead database reads as disconnected first', () => {
    expect(DB_SUCCESS_FRESHNESS_MS).toBeLessThan(
      MAX_HEARTBEAT_FAILURES * HEARTBEAT_INTERVAL_MS
    );
  });

  it('is longer than the default statement timeout, which the saturation argument relies on', () => {
    expect(DEFAULT_STATEMENT_TIMEOUT_MS).toBeLessThan(DB_SUCCESS_FRESHNESS_MS);
  });
});

describe('warnIfStatementTimeoutDefeatsFreshness', () => {
  const savedTimeout = process.env.DATABASE_STATEMENT_TIMEOUT_MS;
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(logger, 'warn').mockImplementation(() => logger);
  });

  afterEach(() => {
    warn.mockRestore();
    if (savedTimeout === undefined) {
      delete process.env.DATABASE_STATEMENT_TIMEOUT_MS;
    } else {
      process.env.DATABASE_STATEMENT_TIMEOUT_MS = savedTimeout;
    }
  });

  it('stays quiet when the timeout is shorter than the window', () => {
    expect(warnIfStatementTimeoutDefeatsFreshness(30_000)).toBe(false);
    expect(
      warnIfStatementTimeoutDefeatsFreshness(DB_SUCCESS_FRESHNESS_MS - 1)
    ).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });

  it('warns when the timeout equals the window', () => {
    expect(
      warnIfStatementTimeoutDefeatsFreshness(DB_SUCCESS_FRESHNESS_MS)
    ).toBe(true);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('DATABASE_STATEMENT_TIMEOUT_MS'),
      {
        statementTimeoutMs: DB_SUCCESS_FRESHNESS_MS,
        freshnessWindowMs: DB_SUCCESS_FRESHNESS_MS,
      }
    );
  });

  it('warns when the timeout exceeds the window', () => {
    expect(warnIfStatementTimeoutDefeatsFreshness(120_000)).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('warns on a timeout that bounds nothing (0 disables it, NaN is unparseable)', () => {
    expect(warnIfStatementTimeoutDefeatsFreshness(0)).toBe(true);
    expect(warnIfStatementTimeoutDefeatsFreshness(Number.NaN)).toBe(true);
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('reads DATABASE_STATEMENT_TIMEOUT_MS from the environment by default', () => {
    process.env.DATABASE_STATEMENT_TIMEOUT_MS = '90000';
    expect(warnIfStatementTimeoutDefeatsFreshness()).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.any(String), {
      statementTimeoutMs: 90_000,
      freshnessWindowMs: DB_SUCCESS_FRESHNESS_MS,
    });

    warn.mockClear();
    delete process.env.DATABASE_STATEMENT_TIMEOUT_MS;
    expect(warnIfStatementTimeoutDefeatsFreshness()).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });

  it('runs when the health router is created at startup', () => {
    process.env.DATABASE_STATEMENT_TIMEOUT_MS = '75000';
    createHealthRouter();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('DATABASE_STATEMENT_TIMEOUT_MS'),
      expect.objectContaining({ statementTimeoutMs: 75_000 })
    );
  });
});

describe('checkDatabaseReadiness', () => {
  it('treats a recent completed query as connected without touching the pool', async () => {
    const now = 1_000_000;
    mocks.lastSuccess = now - 5_000;
    liveQueryRaw.mockImplementation(hang);

    const result = await checkDatabaseReadiness(now);

    expect(result).toEqual({
      database: 'connected',
      databaseCheck: 'recent-query',
      lastQuerySucceededSecondsAgo: 5,
    });
    expect(liveQueryRaw).not.toHaveBeenCalled();
    expect(mocks.pinnedQueryRaw).not.toHaveBeenCalled();
  });

  it('accepts a success exactly at the freshness boundary', async () => {
    const now = 1_000_000;
    mocks.lastSuccess = now - DB_SUCCESS_FRESHNESS_MS;
    const result = await checkDatabaseReadiness(now);
    expect(result.databaseCheck).toBe('recent-query');
    expect(liveQueryRaw).not.toHaveBeenCalled();
  });

  it('probes when the last success is stale, and reports connected if the probe answers', async () => {
    const now = Date.now();
    mocks.lastSuccess = now - DB_SUCCESS_FRESHNESS_MS - 1;
    liveQueryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const result = await checkDatabaseReadiness(now);

    expect(result.database).toBe('connected');
    expect(result.databaseCheck).toBe('probe');
    expect(liveQueryRaw).toHaveBeenCalledTimes(1);
  });

  it('probes when no query has ever succeeded, and reports disconnected if the probe rejects', async () => {
    liveQueryRaw.mockRejectedValue(new Error("Can't reach database server"));

    const result = await checkDatabaseReadiness();

    expect(result).toEqual({
      database: 'disconnected',
      databaseCheck: 'probe',
      lastQuerySucceededSecondsAgo: null,
    });
  });

  it('gives up on a probe that cannot get a connection within the probe budget', async () => {
    vi.useFakeTimers();
    liveQueryRaw.mockImplementation(hang);

    const pending = checkDatabaseReadiness();
    await vi.advanceTimersByTimeAsync(HEALTH_PROBE_TIMEOUT_MS);

    await expect(pending).resolves.toMatchObject({
      database: 'disconnected',
      databaseCheck: 'probe',
    });
  });

  it('keeps at most one probe query outstanding across concurrent checks', async () => {
    vi.useFakeTimers();
    liveQueryRaw.mockImplementation(hang);

    const checks = [
      checkDatabaseReadiness(),
      checkDatabaseReadiness(),
      checkDatabaseReadiness(),
    ];
    await vi.advanceTimersByTimeAsync(HEALTH_PROBE_TIMEOUT_MS);
    await Promise.all(checks);
    // A later check while the first probe is still queued joins it too.
    const later = checkDatabaseReadiness();
    await vi.advanceTimersByTimeAsync(HEALTH_PROBE_TIMEOUT_MS);
    await later;

    expect(liveQueryRaw).toHaveBeenCalledTimes(1);
  });

  it('probes the live global client, not the client pinned at import', async () => {
    liveQueryRaw.mockResolvedValue([]);
    mocks.pinnedQueryRaw.mockRejectedValue(new Error('client disconnected'));

    const result = await checkDatabaseReadiness();

    expect(result.database).toBe('connected');
    expect(liveQueryRaw).toHaveBeenCalledTimes(1);
    expect(mocks.pinnedQueryRaw).not.toHaveBeenCalled();
  });
});

describe('health router', () => {
  let server: Server;
  let base: string;

  beforeEach(async () => {
    const app = express();
    app.use(createHealthRouter());
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => resolve());
    });
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('GET /health returns 200 while the pool is saturated but completing work', async () => {
    mocks.lastSuccess = Date.now() - 1_000;
    liveQueryRaw.mockImplementation(hang);

    const res = await fetch(`${base}/health`);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({
      status: 'ok',
      database: 'connected',
      databaseCheck: 'recent-query',
    });
    expect(liveQueryRaw).not.toHaveBeenCalled();
  });

  it('GET /health returns 503 when nothing has succeeded recently and the probe fails', async () => {
    mocks.lastSuccess = Date.now() - DB_SUCCESS_FRESHNESS_MS - 10_000;
    liveQueryRaw.mockRejectedValue(new Error("Can't reach database server"));

    const res = await fetch(`${base}/health`);
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body).toMatchObject({
      status: 'degraded',
      database: 'disconnected',
      databaseCheck: 'probe',
    });
  });

  it('GET /livez is unchanged and never touches the database', async () => {
    liveQueryRaw.mockImplementation(hang);
    mocks.pinnedQueryRaw.mockImplementation(hang);

    const res = await fetch(`${base}/livez`);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(Object.keys(body).sort()).toEqual(
      ['service', 'status', 'timestamp', 'uptime', 'version'].sort()
    );
    expect(liveQueryRaw).not.toHaveBeenCalled();
    expect(mocks.pinnedQueryRaw).not.toHaveBeenCalled();
  });
});

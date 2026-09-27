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

vi.mock('../prismaClient', () => ({
  default: { $queryRaw: mocks.pinnedQueryRaw },
  getLastQuerySucceededAt: () => mocks.lastSuccess,
}));

import {
  checkDatabaseReadiness,
  createHealthRouter,
  DB_SUCCESS_FRESHNESS_MS,
  HEALTH_PROBE_TIMEOUT_MS,
} from '../health';

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

/**
 * The server's Prisma client carries every guard at both client assignment
 * sites: the singleton `src/prismaClient.ts` builds at import, and the client
 * `reconnectPrisma()` installs after the heartbeat gives up on the old one.
 *
 * `withClientGuards` composes three things onto a client: the query-success
 * stamp `/health` reads, the unqualified-`findMany` ceiling, and credential
 * redaction on every `AuditLog` write. Each is only as good as its presence on
 * the client actually serving requests, and a guard installed at one site only
 * disappears on the first reconnect — when the process is already unhealthy
 * and `/health` most needs a truthful stamp.
 *
 * Each test drives an operation through a site's client with a terminal
 * capture extension applied last: it records what the query engine would
 * receive and returns a synthetic result instead of executing, so nothing
 * reaches a database (the datasource is a closed loopback port). The clock is
 * pinned while an operation runs, so the stamp is asserted at the exact
 * instant that operation completed, not merely "recently".
 */
import type { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { REDACTED } from '../auth/credential-redaction';

/** A datasource no query can reach: a closed port on the loopback interface. */
const UNREACHABLE_DATABASE_URL =
  'postgresql://guards:guards@127.0.0.1:9/guards';

const API_KEY = 'PKCLIENTGUARDSKEY0000000';
const API_SECRET = 'client-guards-secret-that-must-never-persist';

/** An AuditLog row recording a broker-key rotation, keys in the clear. */
const CREDENTIAL_ROW = {
  operationType: 'UPDATE',
  modelName: 'AlpacaAccount',
  recordId: 'acct-1',
  changedFields: {
    where: { id: 'acct-1' },
    data: {
      APIKey: { set: API_KEY },
      APISecret: { set: API_SECRET },
      label: { set: 'rotated' },
    },
  },
  metadata: { source: 'client-guards-test' },
};

/** The same row as it must reach the engine: only the credential values differ. */
const REDACTED_ROW = {
  ...CREDENTIAL_ROW,
  changedFields: {
    where: { id: 'acct-1' },
    data: { APIKey: REDACTED, APISecret: REDACTED, label: { set: 'rotated' } },
  },
};

/**
 * Distinct pinned instants, one per stamped operation. All lie in the past, so
 * a stamp they leave behind can never satisfy a later real-time check.
 */
const AT = {
  singletonRaw: Date.UTC(2020, 0, 1, 0, 0, 1),
  singletonWrite: Date.UTC(2020, 0, 1, 0, 0, 2),
  singletonRead: Date.UTC(2020, 0, 1, 0, 0, 3),
  beforeFailure: Date.UTC(2020, 0, 1, 0, 0, 4),
  failure: Date.UTC(2020, 0, 1, 0, 0, 5),
  reconnectedRaw: Date.UTC(2020, 0, 1, 0, 0, 6),
  reconnectedWrite: Date.UTC(2020, 0, 1, 0, 0, 7),
} as const;

/** One operation as the query engine would have received it. */
interface Captured {
  model: string | undefined;
  operation: string;
  args: unknown;
}

/** The error a saturated pool raises, so a failed operation looks like a real one. */
const POOL_TIMEOUT =
  'P2024: Timed out fetching a new connection from the connection pool';

/**
 * Apply the terminal capture. Applied LAST, it runs after every extension the
 * client already carries, so it sees exactly what the engine would; it never
 * calls `query`, so nothing executes. With `fail`, it rejects as a saturated
 * pool does instead of returning a result.
 */
function captureLast(
  client: PrismaClient,
  sink: Captured[],
  fail = false
): PrismaClient {
  const extended = client.$extends({
    name: 'engine-boundary-capture',
    query: {
      $allOperations({ model, operation, args }) {
        sink.push({ model, operation, args });
        if (fail) return Promise.reject(new Error(POOL_TIMEOUT));
        if (operation === 'findMany' || operation.startsWith('$'))
          return Promise.resolve([]);
        return Promise.resolve({ id: 'captured-row' });
      },
    },
  });
  // Prisma types an extended client as a structurally distinct object; the
  // capture adds, removes and renames nothing on the model surface.
  return extended as unknown as PrismaClient;
}

/** Run `operation` with the wall clock pinned at `instant`. */
async function at<T>(instant: number, operation: () => Promise<T>): Promise<T> {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(instant);
  try {
    return await operation();
  } finally {
    vi.useRealTimers();
  }
}

/** The client a site installed, which must exist. */
function installed(): PrismaClient {
  const client = globalThis.prisma;
  if (!client) throw new Error('prismaClient.ts installed no global.prisma');
  return client;
}

let guards: typeof import('../prismaClient');
let savedDatabaseUrl: string | undefined;

beforeAll(async () => {
  savedDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = UNREACHABLE_DATABASE_URL;
  // The singleton is built at first import, and only when none is installed:
  // start from neither, so this file observes the import-time site itself.
  delete (globalThis as { prisma?: PrismaClient }).prisma;
  vi.resetModules();
  guards = await import('../prismaClient');
});

afterAll(async () => {
  vi.useRealTimers();
  await globalThis.prisma?.$disconnect();
  if (savedDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = savedDatabaseUrl;
});

describe('the client built at import', () => {
  it('is the default export the server hands to resolvers, plugins and guards', () => {
    expect(guards.default).toBe(installed());
  });

  it("stamps a completed raw query, the heartbeat's own SELECT 1", async () => {
    const sink: Captured[] = [];
    await at(
      AT.singletonRaw,
      () => captureLast(installed(), sink).$queryRaw`SELECT 1`
    );
    expect(sink.map((c) => c.operation)).toEqual(['$queryRaw']);
    expect(guards.getLastQuerySucceededAt()).toBe(AT.singletonRaw);
  });

  it('stores an AuditLog write redacted, and stamps it', async () => {
    const sink: Captured[] = [];
    await at(AT.singletonWrite, () =>
      captureLast(installed(), sink).auditLog.create({ data: CREDENTIAL_ROW })
    );
    expect(sink).toHaveLength(1);
    expect(sink[0]).toMatchObject({ model: 'AuditLog', operation: 'create' });
    expect(sink[0].args).toEqual({ data: REDACTED_ROW });
    expect(JSON.stringify(sink[0].args)).not.toContain(API_KEY);
    expect(JSON.stringify(sink[0].args)).not.toContain(API_SECRET);
    expect(guards.getLastQuerySucceededAt()).toBe(AT.singletonWrite);
  });

  it('bounds an unqualified findMany at the ceiling, and stamps it', async () => {
    const sink: Captured[] = [];
    await at(AT.singletonRead, () =>
      captureLast(installed(), sink).auditLog.findMany({
        where: { modelName: 'Order' },
      })
    );
    expect(sink).toHaveLength(1);
    expect(sink[0].args).toEqual({
      where: { modelName: 'Order' },
      take: guards.resolveFindManyTake(),
    });
    expect(guards.getLastQuerySucceededAt()).toBe(AT.singletonRead);
  });

  it('leaves the stamp where it was when an operation fails', async () => {
    await at(
      AT.beforeFailure,
      () => captureLast(installed(), []).$queryRaw`SELECT 1`
    );
    expect(guards.getLastQuerySucceededAt()).toBe(AT.beforeFailure);

    const sink: Captured[] = [];
    await at(AT.failure, () =>
      expect(
        captureLast(installed(), sink, true).$queryRaw`SELECT 1`
      ).rejects.toThrow('P2024')
    );
    expect(sink).toHaveLength(1);
    expect(guards.getLastQuerySucceededAt()).toBe(AT.beforeFailure);
  });
});

describe('the client reconnectPrisma() installs', () => {
  let reconnected: PrismaClient;

  beforeAll(async () => {
    const before = installed();
    await guards.reconnectPrisma();
    reconnected = installed();
    expect(reconnected).not.toBe(before);
  });

  it("stamps a completed raw query, so /health's evidence survives the reconnect", async () => {
    await at(
      AT.reconnectedRaw,
      () => captureLast(reconnected, []).$queryRaw`SELECT 1`
    );
    expect(guards.getLastQuerySucceededAt()).toBe(AT.reconnectedRaw);
  });

  it('stores an AuditLog write redacted, and stamps it', async () => {
    const sink: Captured[] = [];
    await at(AT.reconnectedWrite, () =>
      captureLast(reconnected, sink).auditLog.createMany({
        data: [CREDENTIAL_ROW],
      })
    );
    expect(sink).toHaveLength(1);
    expect(sink[0].args).toEqual({ data: [REDACTED_ROW] });
    expect(JSON.stringify(sink[0].args)).not.toContain(API_SECRET);
    expect(guards.getLastQuerySucceededAt()).toBe(AT.reconnectedWrite);
  });

  it('bounds an unqualified findMany at the ceiling', async () => {
    const sink: Captured[] = [];
    await captureLast(reconnected, sink).trade.findMany({});
    expect(sink).toHaveLength(1);
    expect(sink[0].args).toEqual({ take: guards.resolveFindManyTake() });
  });
});

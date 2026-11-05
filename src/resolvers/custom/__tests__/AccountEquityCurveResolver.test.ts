import 'reflect-metadata';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';

import { logger } from '../../../utils/logger';
import { AccountEquityCurveResolver, alpacaFetch } from '../AccountEquityCurveResolver';
import {
  AUDIT_READ_AUDIENCE,
  AUDIT_READ_ISSUER,
  AUDIT_READ_TOKEN_HEADER,
  AuditReadRefused,
  type AlpacaFetch,
} from '../account-audit-read';

/**
 * What the resolver records. The Prisma client is mocked via the GraphQL
 * context (`getPrismaFromContext` reads `ctx.prisma`), and Alpaca through the
 * `alpacaFetch` seam, so these count AuditLog rows without a database or network.
 */

const AUDIT_SECRET = 'a'.repeat(40);
const ACCOUNT_ID = '3f1c2b7e-9a4d-4e21-8b6f-0c5d7e9a1b2c';
const PAPER = { id: ACCOUNT_ID, type: 'PAPER', APIKey: 'KEY-SENTINEL', APISecret: 'SECRET-SENTINEL', configuration: { name: 'mothership' } };

const mint = (who: string, o: { secret?: string; ttl?: number; iat?: number } = {}) => {
  const iat = o.iat ?? Math.floor(Date.now() / 1000) - 5;
  return jwt.sign(
    { sub: `adaptic-audit:${who}@host:42`, iss: AUDIT_READ_ISSUER, aud: AUDIT_READ_AUDIENCE, iat, exp: iat + (o.ttl ?? 120) },
    o.secret ?? AUDIT_SECRET,
    { algorithm: 'HS256' }
  );
};

function makePrisma(account: unknown = PAPER) {
  return {
    alpacaAccount: { findFirst: vi.fn().mockResolvedValue(account) },
    auditLog: { create: vi.fn().mockResolvedValue({}) },
  };
}
type MockPrisma = ReturnType<typeof makePrisma>;

const ctx = (prisma: MockPrisma, token: string | null = mint('ethan')) =>
  ({ prisma, req: { headers: token == null ? {} : { [AUDIT_READ_TOKEN_HEADER]: token } } }) as never;

const ok = (body: unknown) => ({ ok: true, status: 200, text: async () => JSON.stringify(body) });
const healthyBroker: AlpacaFetch = async (url) =>
  url.endsWith('/v2/account')
    ? ok({ equity: '100190', last_equity: '99900' })
    : ok({ timestamp: [1000], equity: [100000] });

/** The `data` of every AuditLog row written. */
const rows = (prisma: MockPrisma) => prisma.auditLog.create.mock.calls.map((c) => c[0].data);
const refusals = (prisma: MockPrisma) => rows(prisma).filter((r) => r.metadata.outcome === 'refused');

const resolver = new AccountEquityCurveResolver();
const originalFetch = alpacaFetch.current;
let brokerCalls: string[];

beforeEach(() => {
  vi.stubEnv('AUDIT_READ_JWT_SECRET', AUDIT_SECRET);
  vi.stubEnv('AUDIT_READ_OPERATORS', 'ethan, hannah');
  brokerCalls = [];
  alpacaFetch.current = async (url, init) => {
    brokerCalls.push(url);
    return healthyBroker(url, init);
  };
});

afterEach(() => {
  vi.unstubAllEnvs();
  alpacaFetch.current = originalFetch;
});

describe('AccountEquityCurveResolver: a served read', () => {
  it('writes exactly one row, the read, before the broker is called', async () => {
    const prisma = makePrisma();
    alpacaFetch.current = async (url, init) => {
      expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
      return healthyBroker(url, init);
    };
    const out = await resolver.accountEquityCurve(ctx(prisma), ACCOUNT_ID, '2026-09-23');
    expect(out.equity).toBe(100190);
    expect(rows(prisma)).toEqual([
      expect.objectContaining({
        modelName: 'AuditRead',
        recordId: ACCOUNT_ID,
        operationName: 'accountEquityCurve',
        metadata: { operator: 'ethan', accountId: ACCOUNT_ID, op: 'accountEquityCurve', outcome: 'read', sessionDate: '2026-09-23' },
      }),
    ]);
  });
});

describe('AccountEquityCurveResolver: refusals after the token verifies', () => {
  it('unknown account id: NOT_FOUND, exactly one row with operator, account and reason, broker untouched', async () => {
    const prisma = makePrisma(null);
    const err = await resolver.accountEquityCurve(ctx(prisma), ACCOUNT_ID).catch((e) => e);
    expect(err).toBeInstanceOf(AuditReadRefused);
    expect(err.extensions.code).toBe('NOT_FOUND');
    expect(rows(prisma)).toHaveLength(1);
    expect(rows(prisma)[0]).toMatchObject({
      recordId: ACCOUNT_ID,
      metadata: { operator: 'ethan', accountId: ACCOUNT_ID, op: 'accountEquityCurve', outcome: 'refused', reason: 'ACCOUNT_NOT_FOUND' },
    });
    expect(brokerCalls).toHaveLength(0);
  });

  it('malformed account id: NOT_FOUND without a lookup, exactly one row', async () => {
    const prisma = makePrisma();
    const err = await resolver.accountEquityCurve(ctx(prisma), 'not-a-uuid').catch((e) => e);
    expect(err).toBeInstanceOf(AuditReadRefused);
    expect(err.extensions.code).toBe('NOT_FOUND');
    expect(prisma.alpacaAccount.findFirst).not.toHaveBeenCalled();
    expect(rows(prisma)).toHaveLength(1);
    expect(rows(prisma)[0].metadata).toMatchObject({ operator: 'ethan', accountId: 'not-a-uuid', reason: 'ACCOUNT_NOT_FOUND' });
  });

  it('an over-long account id is cut to the recordId column width on the row', async () => {
    const prisma = makePrisma();
    await resolver.accountEquityCurve(ctx(prisma), 'x'.repeat(1000)).catch(() => undefined);
    expect(rows(prisma)).toHaveLength(1);
    expect(rows(prisma)[0].recordId).toHaveLength(255);
  });

  it('LIVE account: FORBIDDEN, exactly one row with operator, account and reason, broker untouched', async () => {
    const prisma = makePrisma({ ...PAPER, type: 'LIVE' });
    const err = await resolver.accountEquityCurve(ctx(prisma), ACCOUNT_ID).catch((e) => e);
    expect(err).toBeInstanceOf(AuditReadRefused);
    expect(err.extensions.code).toBe('FORBIDDEN');
    expect(rows(prisma)).toHaveLength(1);
    expect(rows(prisma)[0]).toMatchObject({
      recordId: ACCOUNT_ID,
      metadata: { operator: 'ethan', accountId: ACCOUNT_ID, op: 'accountEquityCurve', outcome: 'refused', reason: 'ACCOUNT_NOT_PAPER' },
    });
    expect(brokerCalls).toHaveLength(0);
  });

  it('snapshot without equity: typed BAD_GATEWAY refusal, exactly one refusal row after the read row', async () => {
    const prisma = makePrisma();
    alpacaFetch.current = async (url) => {
      brokerCalls.push(url);
      return ok({ last_equity: '99900' });
    };
    const err = await resolver.accountEquityCurve(ctx(prisma), ACCOUNT_ID).catch((e) => e);
    expect(err).toBeInstanceOf(AuditReadRefused);
    expect(err).toMatchObject({ reason: 'SNAPSHOT_INCOMPLETE', extensions: { code: 'BAD_GATEWAY' } });
    // The key was spent, so the read row stands; the refusal is recorded once beside it.
    expect(refusals(prisma)).toHaveLength(1);
    expect(refusals(prisma)[0].metadata).toMatchObject({ operator: 'ethan', accountId: ACCOUNT_ID, reason: 'SNAPSHOT_INCOMPLETE' });
    expect(rows(prisma).map((r) => r.metadata.outcome)).toEqual(['read', 'refused']);
    expect(brokerCalls).toHaveLength(1);
  });

  it('a refusal whose row cannot be written still returns the refusal', async () => {
    const prisma = makePrisma({ ...PAPER, type: 'LIVE' });
    prisma.auditLog.create.mockRejectedValue(new Error('db down'));
    const err = await resolver.accountEquityCurve(ctx(prisma), ACCOUNT_ID).catch((e) => e);
    expect(err).toBeInstanceOf(AuditReadRefused);
    expect(err.reason).toBe('ACCOUNT_NOT_PAPER');
  });
});

describe('AccountEquityCurveResolver: keyed on the stored id', () => {
  const OTHER_ID = '7d0e4c2a-1b3f-4a5c-9e8d-6f2a1b0c3d4e';

  it('upper- and lower-case spellings of one id share one budget and write the stored id', async () => {
    const stored = { ...PAPER, id: OTHER_ID };
    const prisma = makePrisma(stored);
    const upper = OTHER_ID.toUpperCase();
    // Each read spends two requests; 40 per window is 20 reads, alternating spelling.
    for (let i = 0; i < 20; i++) {
      await resolver.accountEquityCurve(ctx(prisma), i % 2 ? upper : OTHER_ID);
    }
    const spelling = (id: string) => resolver.accountEquityCurve(ctx(prisma), id).catch((e) => e);
    expect((await spelling(upper)).extensions.code).toBe('RATE_LIMITED');
    expect((await spelling(OTHER_ID)).extensions.code).toBe('RATE_LIMITED');
    for (const r of rows(prisma)) {
      expect(r.recordId).toBe(OTHER_ID);
      expect(r.metadata.accountId).toBe(OTHER_ID);
    }
  });

  it('a refusal on a found account carries the stored id, not the caller\'s spelling', async () => {
    const prisma = makePrisma({ ...PAPER, type: 'LIVE' });
    await resolver.accountEquityCurve(ctx(prisma), ACCOUNT_ID.toUpperCase()).catch(() => undefined);
    expect(rows(prisma)).toHaveLength(1);
    expect(rows(prisma)[0].recordId).toBe(ACCOUNT_ID);
  });
});

describe('AccountEquityCurveResolver: soft-deleted accounts', () => {
  it('the lookup excludes a deleted account, so it is NOT_FOUND with a refusal row', async () => {
    const prisma = makePrisma(null);
    const err = await resolver.accountEquityCurve(ctx(prisma), ACCOUNT_ID).catch((e) => e);
    expect(prisma.alpacaAccount.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: ACCOUNT_ID, deletedAt: null } })
    );
    expect(err).toMatchObject({ reason: 'ACCOUNT_NOT_FOUND' });
    expect(rows(prisma)).toHaveLength(1);
  });
});

describe('AccountEquityCurveResolver: paths that leave no row', () => {
  it('a bad sessionDate is BAD_USER_INPUT before the lookup, with no row', async () => {
    const prisma = makePrisma();
    const err = await resolver.accountEquityCurve(ctx(prisma), ACCOUNT_ID, '23-09-2026').catch((e) => e);
    expect(err.extensions.code).toBe('BAD_USER_INPUT');
    expect(prisma.alpacaAccount.findFirst).not.toHaveBeenCalled();
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it('a failed account lookup surfaces as the error and writes no row', async () => {
    const prisma = makePrisma();
    prisma.alpacaAccount.findFirst.mockRejectedValue(new Error('db down'));
    await expect(resolver.accountEquityCurve(ctx(prisma), ACCOUNT_ID)).rejects.toThrow('db down');
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it('a broker failure after the read row leaves only that row', async () => {
    const prisma = makePrisma();
    alpacaFetch.current = async () => ({ ok: false, status: 503, text: async () => '' });
    const err = await resolver.accountEquityCurve(ctx(prisma), ACCOUNT_ID).catch((e) => e);
    expect(err.extensions.code).toBe('BAD_GATEWAY');
    expect(rows(prisma).map((r) => r.metadata.outcome)).toEqual(['read']);
  });
});

describe('AccountEquityCurveResolver: logging a failed row write', () => {
  it('keeps the error message and code, not an empty object', async () => {
    const prisma = makePrisma();
    prisma.auditLog.create.mockRejectedValue(Object.assign(new Error('connection refused'), { code: 'P1001' }));
    const spy = vi.spyOn(logger, 'error').mockImplementation(() => undefined);
    try {
      await expect(resolver.accountEquityCurve(ctx(prisma), ACCOUNT_ID)).rejects.toThrow('Audit read could not be recorded');
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('could not write the AuditLog row'),
        expect.objectContaining({ err: 'connection refused', code: 'P1001' })
      );
    } finally {
      spy.mockRestore();
    }
  });
});

describe('AccountEquityCurveResolver: a token that does not verify writes nothing', () => {
  it.each([
    ['no token', null],
    ['garbage', 'not-a-jwt'],
    ['wrong secret', mint('ethan', { secret: 's'.repeat(40) })],
    ['unlisted operator', mint('mallory')],
    ['lifetime over 300s', mint('ethan', { ttl: 301 })],
    ['expired', mint('ethan', { iat: Math.floor(Date.now() / 1000) - 1000, ttl: 300 })],
  ])('%s: refused, no row, no lookup, no broker call', async (_n, token) => {
    const prisma = makePrisma({ ...PAPER, type: 'LIVE' });
    const err = await resolver.accountEquityCurve(ctx(prisma, token), ACCOUNT_ID).catch((e) => e);
    expect(err).not.toBeInstanceOf(AuditReadRefused);
    expect(['UNAUTHENTICATED', 'FORBIDDEN']).toContain(err.extensions.code);
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
    expect(prisma.alpacaAccount.findFirst).not.toHaveBeenCalled();
    expect(brokerCalls).toHaveLength(0);
  });
});

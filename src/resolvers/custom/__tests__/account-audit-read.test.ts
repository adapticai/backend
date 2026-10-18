import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import {
  AUDIT_READ_AUDIENCE,
  AUDIT_READ_ISSUER,
  AUDIT_READ_TOKEN_HEADER,
  assertAuditRead,
  assertAccountReadable,
  auditTokenFromHeaders,
  parseSessionDate,
  readEquityCurve,
  createAccountBudgets,
  ALPACA_TIMEOUT_MS,
  type AlpacaFetch,
  type AuditAccountRow,
} from '../account-audit-read';

const AUDIT_SECRET = 'a'.repeat(40);
const SERVICE_SECRET = 's'.repeat(40);
const ENV = {
  AUDIT_READ_OPERATORS: 'ethan, hannah',
  AUDIT_READ_JWT_SECRET: AUDIT_SECRET,
  BACKEND_SERVICE_JWT_SECRET: SERVICE_SECRET,
  JWT_SECRET: 'u'.repeat(40),
};
const NOW = 1_800_000_000;
const mint = (
  who: string,
  o: { secret?: string; iss?: string; aud?: string; iat?: number; ttl?: number; sub?: string } = {}
) => {
  const iat = o.iat ?? NOW - 10;
  return jwt.sign(
    { sub: o.sub ?? `adaptic-audit:${who}@host:42`, iss: o.iss ?? AUDIT_READ_ISSUER, aud: o.aud ?? AUDIT_READ_AUDIENCE, iat, exp: iat + (o.ttl ?? 300) },
    o.secret ?? AUDIT_SECRET,
    { algorithm: 'HS256' }
  );
};
const ACCOUNT: AuditAccountRow = {
  id: 'a1', type: 'PAPER', APIKey: 'KEY-SENTINEL', APISecret: 'SECRET-SENTINEL', configuration: { name: 'mothership' },
};
const unlimited = () => {};
const ok = (body: unknown) => ({ ok: true, status: 200, text: async () => JSON.stringify(body) });

describe('assertAuditRead', () => {
  it('admits a listed operator on an audit-read token and returns who', () => {
    expect(assertAuditRead(mint('ethan'), ENV, NOW)).toBe('ethan');
  });
  it.each([
    ['null', null],
    ['undefined', undefined],
    ['empty', ''],
  ])('refuses a %s token as UNAUTHENTICATED', (_n, t) => {
    expect(() => assertAuditRead(t, ENV, NOW)).toThrow(/Authentication required/);
  });
  it.each([
    // The case the dedicated secret exists for: a holder of the service secret
    // minting an audit sub for a listed operator, with the right iss and aud.
    ['service-secret token with a listed audit sub', mint('ethan', { secret: SERVICE_SECRET }), ENV],
    ['user-secret token with a listed audit sub', mint('ethan', { secret: 'u'.repeat(40) }), ENV],
    ['the engine service token shape', jwt.sign({ sub: 'adaptic-engine:host:1', iss: 'adaptic-service', aud: 'adaptic-backend', iat: NOW, exp: NOW + 300 }, SERVICE_SECRET), ENV],
    ['wrong issuer', mint('ethan', { iss: 'adaptic-service' }), ENV],
    ['wrong audience', mint('ethan', { aud: 'adaptic-backend' }), ENV],
    ['expired', mint('ethan', { iat: NOW - 1000, ttl: 300 }), ENV],
    ['lifetime over 15 minutes', mint('ethan', { ttl: 3600 }), ENV],
    ['iat in the future', mint('ethan', { iat: NOW + 600 }), ENV],
    ['unsigned', jwt.sign({ sub: 'adaptic-audit:ethan@h:1', iss: AUDIT_READ_ISSUER, aud: AUDIT_READ_AUDIENCE, iat: NOW, exp: NOW + 60 }, '', { algorithm: 'none' }), ENV],
    ['garbage', 'not-a-jwt', ENV],
    ['unlisted operator', mint('mallory'), ENV],
    ['empty operator', mint('', { sub: 'adaptic-audit:@h:1' }), ENV],
    ['non-audit sub', mint('', { sub: 'adaptic-engine:host:1' }), ENV],
    ['unset operator list', mint('ethan'), { ...ENV, AUDIT_READ_OPERATORS: undefined }],
    ['empty operator list', mint('ethan'), { ...ENV, AUDIT_READ_OPERATORS: ' , ' }],
    ['unset secret', mint('ethan'), { ...ENV, AUDIT_READ_JWT_SECRET: undefined }],
    ['short secret', mint('ethan', { secret: 'short' }), { ...ENV, AUDIT_READ_JWT_SECRET: 'short' }],
    ['secret equal to the service secret', mint('ethan', { secret: SERVICE_SECRET }), { ...ENV, AUDIT_READ_JWT_SECRET: SERVICE_SECRET }],
    ['secret equal to the previous service secret', mint('ethan'), { ...ENV, BACKEND_SERVICE_JWT_SECRET_PREVIOUS: AUDIT_SECRET }],
    ['secret equal to the user secret', mint('ethan'), { ...ENV, JWT_SECRET: AUDIT_SECRET }],
  ])('refuses %s as FORBIDDEN', (_n, t, env) => {
    expect(() => assertAuditRead(t, env, NOW)).toThrow(/audit-read role required/);
  });
});

describe('auditTokenFromHeaders', () => {
  it('reads the dedicated header only', () => {
    expect(auditTokenFromHeaders({ [AUDIT_READ_TOKEN_HEADER]: ' t ' })).toBe('t');
    expect(auditTokenFromHeaders({ authorization: 'Bearer t' })).toBeNull();
    expect(auditTokenFromHeaders({ [AUDIT_READ_TOKEN_HEADER]: ['a', 'b'] })).toBeNull();
    expect(auditTokenFromHeaders(undefined)).toBeNull();
  });
});

describe('inputs', () => {
  it('refuses LIVE and admits PAPER', () => {
    expect(() => assertAccountReadable({ ...ACCOUNT, type: 'LIVE' })).toThrow(/PAPER-only/);
    expect(() => assertAccountReadable(ACCOUNT)).not.toThrow();
  });
  it('validates sessionDate before it reaches a URL', () => {
    expect(parseSessionDate(null)).toBeNull();
    expect(parseSessionDate('2026-09-23')).toBe('2026-09-23');
    expect(() => parseSessionDate('2026-09-23&x=1')).toThrow(/YYYY-MM-DD/);
  });
});

describe('Alpaca reads', () => {
  it('curve: sends the stored key to Alpaca, never returns it, drops null equity', async () => {
    const urls: string[] = [];
    const fetchImpl: AlpacaFetch = async (url, init) => {
      urls.push(url);
      expect(init.headers['APCA-API-KEY-ID']).toBe('KEY-SENTINEL');
      return url.endsWith('/v2/account')
        ? ok({ equity: '100190', last_equity: '99900' })
        : ok({ timestamp: [1000, 1060, 1120], equity: [100000, null, 100020] });
    };
    const out = await readEquityCurve({ account: ACCOUNT, sessionDate: '2026-09-23', nowMs: 0, fetchImpl , budget: unlimited });
    expect(urls[0]).toMatch(/^https:\/\/paper-api\.alpaca\.markets\/v2\/account$/);
    expect(urls[1]).toMatch(/date_end=2026-09-23/);
    expect(out).toMatchObject({ accountId: 'a1', accountName: 'mothership', equity: 100190, lastEquity: 99900, sessionDate: '2026-09-23' });
    expect(out.points).toEqual([{ ms: 1_000_000, equity: 100000 }, { ms: 1_120_000, equity: 100020 }]);
    expect(JSON.stringify(out)).not.toMatch(/SENTINEL/);
  });
  it('curve: the response is the account curve only, with no market or benchmark series', async () => {
    const urls: string[] = [];
    const fetchImpl: AlpacaFetch = async (url) => {
      urls.push(url);
      return url.endsWith('/v2/account')
        ? ok({ equity: '100190', last_equity: '99900' })
        : ok({ timestamp: [1000], equity: [100000] });
    };
    const out = await readEquityCurve({ account: ACCOUNT, sessionDate: null, nowMs: 0, fetchImpl, budget: unlimited });
    expect(Object.keys(out).sort()).toEqual(
      ['accountId', 'accountName', 'accountType', 'equity', 'lastEquity', 'points', 'sessionDate', 'source'].sort()
    );
    expect(out.points.every((pt) => Object.keys(pt).sort().join() === 'equity,ms')).toBe(true);
    expect(urls.every((u) => u.startsWith('https://paper-api.alpaca.markets/v2/account'))).toBe(true);
  });
  it('curve: a LIVE row never reaches the broker', async () => {
    let called = false;
    const fetchImpl: AlpacaFetch = async () => { called = true; return ok({}); };
    const live = { ...ACCOUNT, type: 'LIVE' as const };
    await expect(readEquityCurve({ account: live, sessionDate: null, nowMs: 0, fetchImpl , budget: unlimited })).rejects.toThrow(/PAPER-only/);
    expect(called).toBe(false);
  });
  it('curve: a broker failure surfaces status only, not the vendor body', async () => {
    const fetchImpl: AlpacaFetch = async () => ({ ok: false, status: 403, text: async () => 'KEY-SENTINEL rejected' });
    const err = await readEquityCurve({ account: ACCOUNT, sessionDate: null, nowMs: 0, fetchImpl , budget: unlimited }).catch((e) => e);
    expect(err.message).toBe('Broker read failed (HTTP 403)');
    expect(JSON.stringify(err.extensions)).not.toMatch(/SENTINEL/);
  });
  it('a non-JSON 200 is a BAD_GATEWAY, not a SyntaxError', async () => {
    const fetchImpl: AlpacaFetch = async () => ({ ok: true, status: 200, text: async () => '<html>maintenance</html>' });
    const err = await readEquityCurve({ account: ACCOUNT, sessionDate: null, nowMs: 0, fetchImpl, budget: unlimited }).catch((e) => e);
    expect(err.extensions.code).toBe('BAD_GATEWAY');
    expect(err.message).not.toMatch(/maintenance/);
  });
  it('every request carries a timeout signal, and a hung or aborted fetch is a BAD_GATEWAY', async () => {
    let signal: AbortSignal | undefined;
    const fetchImpl: AlpacaFetch = async (_u, init) => {
      signal = init.signal;
      throw new DOMException('aborted', 'TimeoutError');
    };
    const err = await readEquityCurve({ account: ACCOUNT, sessionDate: null, nowMs: 0, fetchImpl, budget: unlimited }).catch((e) => e);
    expect(signal).toBeInstanceOf(AbortSignal);
    expect(ALPACA_TIMEOUT_MS).toBeGreaterThan(0);
    expect(err.extensions.code).toBe('BAD_GATEWAY');
  });
});

describe('createAccountBudgets', () => {
  it('stops an account at the limit, per account, and refills after the window', () => {
    let t = 0;
    const budgets = createAccountBudgets(3, 1000, () => t);
    const book = budgets('acct-1');
    book(); book(); book();
    expect(() => book()).toThrow(/rate budget/);
    expect(() => budgets('acct-2')()).not.toThrow();
    t = 1001;
    expect(() => book()).not.toThrow();
  });
  it('shares one window across operators reading the same account', () => {
    const budgets = createAccountBudgets(2, 1000, () => 0);
    budgets('acct-1')(); budgets('acct-1')();
    expect(() => budgets('acct-1')()).toThrow(/rate budget/);
  });
  it('a curve read is cut off when the budget runs out, before the broker is hit again', async () => {
    let n = 0;
    const fetchImpl: AlpacaFetch = async () => { n++; return ok({ equity: '1', last_equity: '1' }); };
    const budget = createAccountBudgets(1, 60_000, () => 0)('acct-1');
    const err = await readEquityCurve({ account: ACCOUNT, sessionDate: null, nowMs: 0, fetchImpl, budget }).catch((e) => e);
    expect(err.extensions.code).toBe('RATE_LIMITED');
    expect(n).toBe(1);
  });
});

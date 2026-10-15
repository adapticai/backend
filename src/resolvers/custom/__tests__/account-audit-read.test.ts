import { describe, it, expect } from 'vitest';
import {
  assertAuditRead,
  assertAccountReadable,
  parseSessionDate,
  planTapeWindows,
  readEquityCurve,
  readMarketTape,
  validateTapeArgs,
  SIP_DELAY_MS,
  type AlpacaFetch,
  type AuditAccountRow,
} from '../account-audit-read';

const ENV = { AUDIT_READ_OPERATORS: 'ethan, hannah' };
const audit = (who: string) => ({ kind: 'server' as const, sub: `adaptic-audit:${who}@host:42` });
const ACCOUNT: AuditAccountRow = {
  id: 'a1', type: 'PAPER', APIKey: 'KEY-SENTINEL', APISecret: 'SECRET-SENTINEL', configuration: { name: 'mothership' },
};
const ok = (body: unknown) => ({ ok: true, status: 200, text: async () => JSON.stringify(body) });

describe('assertAuditRead', () => {
  it('admits a listed operator and returns who', () => {
    expect(assertAuditRead(audit('ethan'), ENV)).toBe('ethan');
  });
  it.each([
    ['anonymous', null],
    ['undefined', undefined],
  ])('refuses %s as UNAUTHENTICATED', (_n, p) => {
    expect(() => assertAuditRead(p, ENV)).toThrow(/Authentication required/);
  });
  it.each([
    ['unlisted operator', audit('mallory'), ENV],
    ['unset list', audit('ethan'), {}],
    ['empty list', audit('ethan'), { AUDIT_READ_OPERATORS: ' , ' }],
    ['engine service sub', { kind: 'server' as const, sub: 'adaptic-engine:host:1' }, ENV],
    ['static server token (no sub)', { kind: 'server' as const }, ENV],
    ['user', { kind: 'user' as const, sub: 'adaptic-audit:ethan@h:1', roles: ['audit-read'] }, ENV],
    ['admin', { kind: 'admin' as const, sub: 'adaptic-audit:ethan@h:1', roles: ['admin'] }, ENV],
    ['empty operator', { kind: 'server' as const, sub: 'adaptic-audit:@h:1' }, ENV],
  ])('refuses %s as FORBIDDEN', (_n, p, env) => {
    expect(() => assertAuditRead(p, env)).toThrow(/audit-read role required/);
  });
});

describe('inputs', () => {
  it('refuses LIVE without includeLive and admits it with', () => {
    expect(() => assertAccountReadable({ ...ACCOUNT, type: 'LIVE' }, false)).toThrow(/includeLive/);
    expect(() => assertAccountReadable({ ...ACCOUNT, type: 'LIVE' }, true)).not.toThrow();
  });
  it('validates sessionDate before it reaches a URL', () => {
    expect(parseSessionDate(null)).toBeNull();
    expect(parseSessionDate('2026-09-23')).toBe('2026-09-23');
    expect(() => parseSessionDate('2026-09-23&x=1')).toThrow(/YYYY-MM-DD/);
  });
  it('validates tape arguments', () => {
    const base = { symbols: ['spy', 'SPY', 'qqq'], startMs: 1, endMs: 2, feed: 'auto' };
    expect(validateTapeArgs(base).symbols).toEqual(['SPY', 'QQQ']);
    expect(() => validateTapeArgs({ ...base, feed: 'x' })).toThrow(/feed/);
    expect(() => validateTapeArgs({ ...base, symbols: [] })).toThrow(/symbols/);
    expect(() => validateTapeArgs({ ...base, symbols: ['A&B'] })).toThrow(/ticker/);
    expect(() => validateTapeArgs({ ...base, endMs: 1 })).toThrow(/endMs/);
    expect(() => validateTapeArgs({ ...base, endMs: 10 * 24 * 3_600_000 })).toThrow(/8 days/);
  });
});

describe('planTapeWindows', () => {
  const now = 10_000_000_000;
  it('auto splits SIP history from the IEX tail', () => {
    const w = planTapeWindows({ startMs: now - 3_600_000, endMs: now, nowMs: now, feed: 'auto' });
    expect(w).toEqual([
      { feed: 'sip', fromMs: now - 3_600_000, toMs: now - SIP_DELAY_MS },
      { feed: 'iex', fromMs: now - SIP_DELAY_MS, toMs: now },
    ]);
  });
  it('sip never reaches into the delayed window; iex covers all', () => {
    expect(planTapeWindows({ startMs: now - 60_000, endMs: now, nowMs: now, feed: 'sip' })).toEqual([]);
    expect(planTapeWindows({ startMs: now - 60_000, endMs: now, nowMs: now, feed: 'iex' })).toHaveLength(1);
  });
  it('nothing is planned past now', () => {
    expect(planTapeWindows({ startMs: now + 1, endMs: now + 9, nowMs: now, feed: 'auto' })).toEqual([]);
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
    const out = await readEquityCurve({ account: ACCOUNT, sessionDate: '2026-09-23', nowMs: 0, fetchImpl });
    expect(urls[0]).toMatch(/^https:\/\/paper-api\.alpaca\.markets\/v2\/account$/);
    expect(urls[1]).toMatch(/date_end=2026-09-23/);
    expect(out).toMatchObject({ accountId: 'a1', accountName: 'mothership', equity: 100190, lastEquity: 99900, sessionDate: '2026-09-23' });
    expect(out.points).toEqual([{ ms: 1_000_000, equity: 100000 }, { ms: 1_120_000, equity: 100020 }]);
    expect(JSON.stringify(out)).not.toMatch(/SENTINEL/);
  });
  it('curve: a broker failure surfaces status only, not the vendor body', async () => {
    const fetchImpl: AlpacaFetch = async () => ({ ok: false, status: 403, text: async () => 'KEY-SENTINEL rejected' });
    const err = await readEquityCurve({ account: ACCOUNT, sessionDate: null, nowMs: 0, fetchImpl }).catch((e) => e);
    expect(err.message).toBe('Broker read failed (HTTP 403)');
    expect(JSON.stringify(err.extensions)).not.toMatch(/SENTINEL/);
  });
  it('tape: pages to exhaustion, tags the feed, sorts', async () => {
    const now = Date.parse('2026-09-23T15:00:00Z');
    const bar = (t: string, c: number) => ({ t, o: c, h: c, l: c, c, v: 1 });
    const calls: string[] = [];
    const fetchImpl: AlpacaFetch = async (url) => {
      calls.push(url);
      if (url.includes('feed=iex')) return ok({ bars: { SPY: [bar('2026-09-23T14:50:00Z', 3)] }, next_page_token: null });
      return url.includes('page_token=p2')
        ? ok({ bars: { SPY: [bar('2026-09-23T14:00:00Z', 1)] }, next_page_token: null })
        : ok({ bars: { SPY: [bar('2026-09-23T14:01:00Z', 2)] }, next_page_token: 'p2' });
    };
    const out = await readMarketTape({
      account: ACCOUNT, symbols: ['SPY'], startMs: Date.parse('2026-09-23T14:00:00Z'), endMs: now, feed: 'auto', nowMs: now, fetchImpl,
    });
    expect(out.map((b) => [b.c, b.feed])).toEqual([[1, 'sip'], [2, 'sip'], [3, 'iex']]);
    expect(calls.every((u) => u.includes('adjustment=raw'))).toBe(true);
  });
});

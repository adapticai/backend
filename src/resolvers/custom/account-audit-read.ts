/**
 * Server-side audit reads of an account's equity curve and the market tape.
 *
 * The audit toolkit used to read an account's broker key and secret and call
 * Alpaca itself, which meant issuing an audit principal handed out live broker
 * credentials. These reads move the Alpaca call here: the caller names an
 * account and receives the curve or the bars, and the key never leaves this
 * process.
 *
 * Everything in this module is pure or takes its collaborators as arguments
 * (`fetchImpl`, `nowMs`), so it is unit-testable without a database or network.
 *
 * @module resolvers/custom/account-audit-read
 */
import { GraphQLError } from 'graphql';

import type { BackendPrincipal } from '../../auth/token-verifier';

/** `sub` prefix the audit toolkit mints (`adaptic-audit:<who>@<host>:<pid>`). */
export const AUDIT_SUBJECT_PREFIX = 'adaptic-audit:';

/** Env var holding the comma-separated operators admitted to the audit-read role. */
export const AUDIT_READ_OPERATORS_ENV = 'AUDIT_READ_OPERATORS';

/** SIP history on a non-real-time key lags by this long; the freshest window comes from IEX. */
export const SIP_DELAY_MS = 16 * 60_000;

/** One minute, the tape's bar size. */
export const BAR_MS = 60_000;

/** Largest tape window one call may request. */
export const MAX_TAPE_WINDOW_MS = 8 * 24 * 3_600_000;

/** Most symbols one tape call may request. */
export const MAX_TAPE_SYMBOLS = 20;

const PAGE_LIMIT = 10_000;
const MAX_PAGES = 50;
const TRADE_HOSTS = {
  PAPER: 'https://paper-api.alpaca.markets',
  LIVE: 'https://api.alpaca.markets',
} as const;
const DATA_HOST = 'https://data.alpaca.markets';

/** The stored account fields a read needs. Never returned to the caller. */
export interface AuditAccountRow {
  id: string;
  type: 'PAPER' | 'LIVE';
  APIKey: string;
  APISecret: string;
  configuration?: unknown;
}

/** A request to Alpaca with the stored key. */
export type AlpacaFetch = (url: string, init: { headers: Record<string, string> }) => Promise<{
  ok: boolean;
  status: number;
  text: () => Promise<string>;
}>;

/**
 * The audit-read role, enforced in the resolver.
 *
 * Fail-closed on purpose. A `server` principal otherwise bypasses every role
 * gate and `@Authorized()` is shadow-first, so neither can carry this. Admitted:
 * a verified service principal whose `sub` is `adaptic-audit:<who>@…` with
 * `<who>` listed in `AUDIT_READ_OPERATORS`. An unset or empty list admits
 * nobody; the engine's own service credential is not admitted.
 *
 * @param principal - The verified caller, or null/undefined when anonymous.
 * @param env - Environment to read the operator list from.
 * @returns The operator the read is attributed to.
 * @throws {GraphQLError} `UNAUTHENTICATED` without a principal, `FORBIDDEN` otherwise.
 */
export function assertAuditRead(
  principal: BackendPrincipal | null | undefined,
  env: Record<string, string | undefined> = process.env
): string {
  if (!principal) {
    throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
  }
  const forbidden = (): never => {
    throw new GraphQLError('audit-read role required', { extensions: { code: 'FORBIDDEN' } });
  };
  if (principal.kind !== 'server') return forbidden();
  const sub = principal.sub ?? '';
  if (!sub.startsWith(AUDIT_SUBJECT_PREFIX)) return forbidden();
  const who = sub.slice(AUDIT_SUBJECT_PREFIX.length).split('@')[0].trim();
  const allowed = (env[AUDIT_READ_OPERATORS_ENV] ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (who.length === 0 || !allowed.includes(who)) return forbidden();
  return who;
}

/** LIVE accounts are refused unless the caller opted in. */
export function assertAccountReadable(account: AuditAccountRow, includeLive: boolean): void {
  if (account.type !== 'PAPER' && !includeLive) {
    throw new GraphQLError(`Account ${account.id} is ${account.type}; includeLive is required`, {
      extensions: { code: 'FORBIDDEN' },
    });
  }
}

/** The ET calendar date of an instant, YYYY-MM-DD. */
export function etDateOf(ms: number): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(ms));
}

/**
 * Validate a `YYYY-MM-DD` session date.
 *
 * @throws {GraphQLError} `BAD_USER_INPUT` for anything else, so nothing the
 *   caller sends is ever spliced into a URL unchecked.
 */
export function parseSessionDate(raw: string | null | undefined): string | null {
  if (raw == null || raw === '') return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || Number.isNaN(Date.parse(`${raw}T00:00:00Z`))) {
    throw new GraphQLError('sessionDate must be YYYY-MM-DD', { extensions: { code: 'BAD_USER_INPUT' } });
  }
  return raw;
}

async function alpacaGet(
  account: AuditAccountRow,
  fetchImpl: AlpacaFetch,
  url: string
): Promise<unknown> {
  const res = await fetchImpl(url, {
    headers: { 'APCA-API-KEY-ID': account.APIKey, 'APCA-API-SECRET-KEY': account.APISecret },
  });
  const text = await res.text();
  if (!res.ok) {
    // Status and path only: the vendor body can echo request detail.
    throw new GraphQLError(`Broker read failed (HTTP ${res.status})`, {
      extensions: { code: 'BAD_GATEWAY', upstreamStatus: res.status },
    });
  }
  return text ? JSON.parse(text) : null;
}

/** The curve as returned to the caller. */
export interface EquityCurve {
  accountId: string;
  accountType: 'PAPER' | 'LIVE';
  accountName: string;
  sessionDate: string;
  points: Array<{ ms: number; equity: number }>;
  lastEquity: number;
  equity: number;
  source: string;
}

/**
 * Read one session's 1-minute equity curve and the account snapshot.
 *
 * @param p.account - The stored account row (carries the key; not returned).
 * @param p.sessionDate - Pin a past session, or null for today's ET date.
 * @param p.fetchImpl - Injected HTTP client.
 */
export async function readEquityCurve(p: {
  account: AuditAccountRow;
  sessionDate: string | null;
  nowMs: number;
  fetchImpl: AlpacaFetch;
}): Promise<EquityCurve> {
  const { account, fetchImpl } = p;
  const base = TRADE_HOSTS[account.type];
  const sessionDate = p.sessionDate ?? etDateOf(p.nowMs);

  const snap = (await alpacaGet(account, fetchImpl, `${base}/v2/account`)) as {
    equity?: string | number;
    last_equity?: string | number;
  };
  const hist = (await alpacaGet(
    account,
    fetchImpl,
    `${base}/v2/account/portfolio/history?period=1D&timeframe=1Min&intraday_reporting=market_hours&pnl_reset=per_day` +
      (p.sessionDate ? `&date_end=${p.sessionDate}` : '')
  )) as { timestamp?: number[]; equity?: Array<number | null> } | null;

  const ts = hist?.timestamp ?? [];
  const eq = hist?.equity ?? [];
  const points: EquityCurve['points'] = [];
  for (let i = 0; i < ts.length; i++) {
    const equity = eq[i];
    if (typeof equity === 'number' && Number.isFinite(equity)) points.push({ ms: ts[i] * 1000, equity });
  }
  const cfg = account.configuration as { name?: unknown } | null | undefined;
  return {
    accountId: account.id,
    accountType: account.type,
    accountName: typeof cfg?.name === 'string' && cfg.name ? cfg.name : account.id,
    sessionDate,
    points,
    lastEquity: Number(snap?.last_equity),
    equity: Number(snap?.equity),
    source: 'alpaca-portfolio-history',
  };
}

export type TapeFeed = 'auto' | 'sip' | 'iex';

/**
 * Which feed serves which part of [startMs, endMs].
 *
 * `auto`: SIP up to now minus the SIP delay, IEX for the freshest window.
 * `sip`: SIP only, clamped to what the key may see. `iex`: IEX throughout.
 */
export function planTapeWindows(p: {
  startMs: number;
  endMs: number;
  nowMs: number;
  feed: TapeFeed;
}): Array<{ feed: 'sip' | 'iex'; fromMs: number; toMs: number }> {
  const end = Math.min(p.endMs, p.nowMs);
  if (end <= p.startMs) return [];
  const split = p.nowMs - SIP_DELAY_MS;
  if (p.feed === 'iex') return [{ feed: 'iex', fromMs: p.startMs, toMs: end }];
  if (p.feed === 'sip') {
    const to = Math.min(end, split);
    return to > p.startMs ? [{ feed: 'sip', fromMs: p.startMs, toMs: to }] : [];
  }
  const out: Array<{ feed: 'sip' | 'iex'; fromMs: number; toMs: number }> = [];
  if (split > p.startMs) out.push({ feed: 'sip', fromMs: p.startMs, toMs: Math.min(end, split) });
  if (end > split) out.push({ feed: 'iex', fromMs: Math.max(p.startMs, split), toMs: end });
  return out;
}

/** One tape bar as returned to the caller. */
export interface TapeBar {
  symbol: string;
  ms: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  feed: 'sip' | 'iex';
}

/** Validate tape arguments; returns the cleaned symbol list. */
export function validateTapeArgs(p: {
  symbols: string[];
  startMs: number;
  endMs: number;
  feed: string;
}): { symbols: string[]; feed: TapeFeed } {
  const bad = (m: string): never => {
    throw new GraphQLError(m, { extensions: { code: 'BAD_USER_INPUT' } });
  };
  if (p.feed !== 'auto' && p.feed !== 'sip' && p.feed !== 'iex') bad('feed must be auto, sip or iex');
  const symbols = [...new Set(p.symbols.map((s) => s.trim().toUpperCase()))];
  if (symbols.length === 0 || symbols.length > MAX_TAPE_SYMBOLS) bad(`symbols must hold 1..${MAX_TAPE_SYMBOLS} entries`);
  if (symbols.some((s) => !/^[A-Z0-9.\-/]{1,12}$/.test(s))) bad('symbols contain an invalid ticker');
  if (!Number.isFinite(p.startMs) || !Number.isFinite(p.endMs) || p.endMs <= p.startMs) bad('endMs must be after startMs');
  if (p.endMs - p.startMs > MAX_TAPE_WINDOW_MS) bad('window exceeds 8 days');
  return { symbols, feed: p.feed as TapeFeed };
}

/**
 * Read 1-minute bars for the symbols across the planned feed windows, paged to
 * exhaustion. Bars are raw (unadjusted) and tagged with the feed that served them.
 */
export async function readMarketTape(p: {
  account: AuditAccountRow;
  symbols: string[];
  startMs: number;
  endMs: number;
  feed: TapeFeed;
  nowMs: number;
  fetchImpl: AlpacaFetch;
}): Promise<TapeBar[]> {
  const windows = planTapeWindows(p);
  const out: TapeBar[] = [];
  for (const w of windows) {
    let token: string | null = null;
    for (let page = 0; page < MAX_PAGES; page++) {
      const url =
        `${DATA_HOST}/v2/stocks/bars?symbols=${encodeURIComponent(p.symbols.join(','))}&timeframe=1Min` +
        `&start=${new Date(w.fromMs).toISOString()}&end=${new Date(w.toMs).toISOString()}` +
        `&limit=${PAGE_LIMIT}&feed=${w.feed}&adjustment=raw&sort=asc` +
        (token ? `&page_token=${encodeURIComponent(token)}` : '');
      const body = (await alpacaGet(p.account, p.fetchImpl, url)) as {
        bars?: Record<string, Array<{ t: string; o: number; h: number; l: number; c: number; v: number }>>;
        next_page_token?: string | null;
      } | null;
      for (const [symbol, bars] of Object.entries(body?.bars ?? {})) {
        for (const b of bars) out.push({ symbol, ms: Date.parse(b.t), o: b.o, h: b.h, l: b.l, c: b.c, v: b.v, feed: w.feed });
      }
      token = body?.next_page_token ?? null;
      if (!token) break;
      if (page === MAX_PAGES - 1) {
        throw new GraphQLError('Tape window too large to page', { extensions: { code: 'BAD_USER_INPUT' } });
      }
    }
  }
  out.sort((a, b) => a.ms - b.ms || (a.symbol < b.symbol ? -1 : 1));
  return out;
}

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
import jwt from 'jsonwebtoken';

import { logger } from '../../utils/logger';

/** `sub` prefix the audit toolkit mints (`adaptic-audit:<who>@<host>:<pid>`). */
export const AUDIT_SUBJECT_PREFIX = 'adaptic-audit:';

/** Env var holding the comma-separated operators admitted to the audit-read role. */
export const AUDIT_READ_OPERATORS_ENV = 'AUDIT_READ_OPERATORS';

/** Env var holding the HS256 secret that signs audit-read tokens, and nothing else. */
export const AUDIT_READ_JWT_SECRET_ENV = 'AUDIT_READ_JWT_SECRET';

/**
 * Request header the audit token travels in.
 *
 * Not `Authorization`: the shared verifier would refuse a token it cannot
 * verify with HTTP 401 before any resolver ran, and teaching it this secret
 * would make audit-read one more way to become a `server` principal. A
 * separate header keeps the two trust roots apart.
 */
export const AUDIT_READ_TOKEN_HEADER = 'x-adaptic-audit-token';

/** Issuer every audit-read token must carry. */
export const AUDIT_READ_ISSUER = 'adaptic-audit';

/** Audience every audit-read token must carry. */
export const AUDIT_READ_AUDIENCE = 'adaptic-backend:audit-read';

/** Minimum length for the audit-read secret, in characters. */
export const MINIMUM_AUDIT_SECRET_LENGTH = 32;

/** Largest lifetime (`exp - iat`) honoured on an audit-read token, seconds. */
export const MAX_AUDIT_TOKEN_LIFETIME_SEC = 900;

/** How far in the future an `iat` may sit before the token is refused, seconds. */
export const MAX_AUDIT_TOKEN_CLOCK_SKEW_SEC = 60;

/** SIP history on a non-real-time key lags by this long; the freshest window comes from IEX. */
export const SIP_DELAY_MS = 16 * 60_000;

/** One minute, the tape's bar size. */
export const BAR_MS = 60_000;

/** Largest tape window one call may request. */
export const MAX_TAPE_WINDOW_MS = 8 * 24 * 3_600_000;

/** Most symbols one tape call may request. */
export const MAX_TAPE_SYMBOLS = 20;

const PAGE_LIMIT = 10_000;

/**
 * Most pages one tape window may take. Each page is a request on the book's own
 * Alpaca key, so the ceiling is small: 8 pages of 10k bars is 80k bars, over a
 * week of one-minute bars for the 20-symbol maximum.
 */
export const MAX_PAGES = 8;

/** Upstream Alpaca requests one operator may spend per window. */
export const OPERATOR_REQUEST_BUDGET = 40;

/** Length of the per-operator budget window, ms. */
export const OPERATOR_BUDGET_WINDOW_MS = 60_000;

/** Longest one Alpaca request may take before it is abandoned, ms. */
export const ALPACA_TIMEOUT_MS = 10_000;
const PAPER_TRADE_HOST = 'https://paper-api.alpaca.markets';
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
export type AlpacaFetch = (url: string, init: { headers: Record<string, string>; signal?: AbortSignal }) => Promise<{
  ok: boolean;
  status: number;
  text: () => Promise<string>;
}>;

/** Spends upstream requests against an operator's budget; throws when it is exhausted. */
export type RequestBudget = (n?: number) => void;

/**
 * A sliding-window request budget per operator.
 *
 * Audit reads spend the book's own trading key, so one operator looping on the
 * tape must not be able to starve the engine's order traffic. State is
 * in-process: with several backend instances the effective ceiling is the
 * budget times the instance count, still bounded.
 *
 * @param limit - Requests allowed per window.
 * @param windowMs - Window length.
 * @param now - Clock, injectable for tests.
 * @returns A function that returns the operator's `RequestBudget`.
 */
export function createOperatorBudgets(
  limit: number = OPERATOR_REQUEST_BUDGET,
  windowMs: number = OPERATOR_BUDGET_WINDOW_MS,
  now: () => number = Date.now
): (operator: string) => RequestBudget {
  const spent = new Map<string, number[]>();
  return (operator) => (n = 1) => {
    const t = now();
    const live = (spent.get(operator) ?? []).filter((at) => at > t - windowMs);
    if (live.length + n > limit) {
      spent.set(operator, live);
      throw new GraphQLError('Audit read rate budget exhausted; retry shortly', {
        extensions: { code: 'RATE_LIMITED', retryAfterMs: windowMs },
      });
    }
    for (let i = 0; i < n; i++) live.push(t);
    spent.set(operator, live);
  };
}

/**
 * The audit-read token from a request's headers, or null when absent.
 *
 * A repeated header arrives as an array and is refused rather than guessed at.
 */
export function auditTokenFromHeaders(
  headers: Record<string, string | string[] | undefined> | undefined
): string | null {
  const raw = headers?.[AUDIT_READ_TOKEN_HEADER];
  if (typeof raw !== 'string') return null;
  const token = raw.trim();
  return token.length > 0 ? token : null;
}

/**
 * The audit-read role, enforced in the resolver.
 *
 * Fail-closed, and independent of the request's principal. A `server`
 * principal otherwise bypasses every role gate and `@Authorized()` is
 * shadow-first, so neither can carry this; and any holder of the shared
 * service secret can mint a `server` principal with whatever `sub` it likes.
 * So the caller must present a token signed with `AUDIT_READ_JWT_SECRET`, a
 * secret with no other use, bound to this issuer and audience, short-lived,
 * whose `sub` is `adaptic-audit:<who>@…` with `<who>` in
 * `AUDIT_READ_OPERATORS`. A token signed with any other secret is refused
 * whatever its `sub` says. An unset secret or an empty list admits nobody.
 *
 * @param token - The raw audit-read token, or null/undefined when absent.
 * @param env - Environment to read the secret and operator list from.
 * @param nowSec - Current time, seconds since the epoch.
 * @returns The operator the read is attributed to.
 * @throws {GraphQLError} `UNAUTHENTICATED` without a token, `FORBIDDEN` otherwise.
 */
export function assertAuditRead(
  token: string | null | undefined,
  env: Record<string, string | undefined> = process.env,
  nowSec: number = Math.floor(Date.now() / 1000)
): string {
  if (!token) {
    throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
  }
  const forbidden = (): never => {
    throw new GraphQLError('audit-read role required', { extensions: { code: 'FORBIDDEN' } });
  };

  const secret = (env[AUDIT_READ_JWT_SECRET_ENV] ?? '').trim();
  if (secret.length < MINIMUM_AUDIT_SECRET_LENGTH) {
    if (secret.length > 0) {
      logger.error(`[audit-read] ${AUDIT_READ_JWT_SECRET_ENV} is shorter than ${MINIMUM_AUDIT_SECRET_LENGTH} characters; audit reads are disabled.`);
    }
    return forbidden();
  }
  // Equal to any other trust root collapses the separation this secret exists for.
  const others = [
    env.BACKEND_SERVICE_JWT_SECRET,
    env.BACKEND_SERVICE_JWT_SECRET_PREVIOUS,
    env.JWT_SECRET,
    env.NEXTAUTH_SECRET,
  ].map((v) => (v ?? '').trim());
  if (others.includes(secret)) {
    logger.error(`[audit-read] ${AUDIT_READ_JWT_SECRET_ENV} equals another auth secret; audit reads are disabled until it is distinct.`);
    return forbidden();
  }

  let payload: jwt.JwtPayload;
  try {
    const verified = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      issuer: AUDIT_READ_ISSUER,
      audience: AUDIT_READ_AUDIENCE,
      clockTimestamp: nowSec,
    });
    if (typeof verified === 'string') return forbidden();
    payload = verified;
  } catch {
    return forbidden();
  }
  const { iat, exp } = payload;
  if (typeof iat !== 'number' || typeof exp !== 'number') return forbidden();
  if (exp - iat > MAX_AUDIT_TOKEN_LIFETIME_SEC || iat > nowSec + MAX_AUDIT_TOKEN_CLOCK_SKEW_SEC) return forbidden();

  const sub = typeof payload.sub === 'string' ? payload.sub : '';
  if (!sub.startsWith(AUDIT_SUBJECT_PREFIX)) return forbidden();
  const who = sub.slice(AUDIT_SUBJECT_PREFIX.length).split('@')[0].trim();
  const allowed = (env[AUDIT_READ_OPERATORS_ENV] ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (who.length === 0 || !allowed.includes(who)) return forbidden();
  return who;
}

/** Audit reads are PAPER-only; a LIVE account is refused. */
export function assertAccountReadable(account: AuditAccountRow): void {
  if (account.type !== 'PAPER') {
    throw new GraphQLError(`Account ${account.id} is ${account.type}; audit reads are PAPER-only`, {
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
  url: string,
  budget: RequestBudget
): Promise<unknown> {
  budget();
  const badGateway = (message: string, upstreamStatus?: number): never => {
    // Status only: the vendor body can echo request detail.
    throw new GraphQLError(message, { extensions: { code: 'BAD_GATEWAY', upstreamStatus } });
  };
  let res: Awaited<ReturnType<AlpacaFetch>>;
  let text: string;
  try {
    res = await fetchImpl(url, {
      headers: { 'APCA-API-KEY-ID': account.APIKey, 'APCA-API-SECRET-KEY': account.APISecret },
      signal: AbortSignal.timeout(ALPACA_TIMEOUT_MS),
    });
    text = await res.text();
  } catch {
    return badGateway('Broker read failed (no response)');
  }
  if (!res.ok) return badGateway(`Broker read failed (HTTP ${res.status})`, res.status);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return badGateway(`Broker read failed (unreadable response, HTTP ${res.status})`, res.status);
  }
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
  budget: RequestBudget;
}): Promise<EquityCurve> {
  const { account, fetchImpl, budget } = p;
  assertAccountReadable(account);
  const base = PAPER_TRADE_HOST;
  const sessionDate = p.sessionDate ?? etDateOf(p.nowMs);

  const snap = (await alpacaGet(account, fetchImpl, `${base}/v2/account`, budget)) as {
    equity?: string | number;
    last_equity?: string | number;
  };
  const hist = (await alpacaGet(
    account,
    fetchImpl,
    `${base}/v2/account/portfolio/history?period=1D&timeframe=1Min&intraday_reporting=market_hours&pnl_reset=per_day` +
      (p.sessionDate ? `&date_end=${p.sessionDate}` : ''),
    budget
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
  budget: RequestBudget;
}): Promise<TapeBar[]> {
  assertAccountReadable(p.account);
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
      const body = (await alpacaGet(p.account, p.fetchImpl, url, p.budget)) as {
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

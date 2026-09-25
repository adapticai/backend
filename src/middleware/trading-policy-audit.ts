/**
 * Attributed audit rows for every TradingPolicy write.
 *
 * `TradingPolicy` carries the switches that decide whether a brokerage account
 * trades at all — `realtimeTradingEnabled`, `paperTradingOnly`,
 * `killSwitchEnabled`, `autonomyMode` — and on a LIVE account flipping one is
 * a capital decision. The generic mutation audit plugin cannot answer "who
 * did this": it records a user id only for a UUID subject (so a service write
 * or an anonymous one is `null`), records nothing for a mutation that failed
 * or was refused, and reads the payload from `variables` (so an inline
 * argument records as empty). A LIVE-flag change that nobody can attribute is
 * the defect this module exists to close.
 *
 * Every TradingPolicy write — a root `…TradingPolicy` mutation or a nested
 * `tradingPolicy: { … }` write under another model — produces:
 *
 * 1. an `attempt` row, written BEFORE the resolver runs, carrying the actor
 *    (principal kind, subject, email, IP, user agent, origin), the caller's
 *    stated reason (`X-Adaptic-Change-Reason` header), the authorization
 *    decision and its reason, the requested change, and each touched account's
 *    type and current switch values; and
 * 2. a `result` row after it, carrying the outcome, linked by `attemptId`.
 *
 * Each touched policy is resolved from its OWN argument path: a nested write
 * that reaches a different account than the root's is recorded against that
 * account, and one whose account the arguments do not identify is recorded
 * as `unresolved` — never attributed to the root's account.
 *
 * A refused write produces only the `attempt` row (its outcome is `denied`).
 *
 * Writing the attempt row first is what makes the record durable: if the
 * attempt row cannot be written and the mutation is being enforced, the
 * mutation is refused rather than executed unattributed. The caller decides
 * that; this module reports the failure and never swallows it. The one
 * exception is a write that only DISARMS ({@link isDisarmOnlyPolicyWrite}):
 * refusing it during an AuditLog outage would block the protective direction
 * (a kill switch, `realtimeTradingEnabled = false`) exactly when the system is
 * degraded, so it is admitted, counted on
 * `graphql_mutation_audit_bypassed_total`, and logged in full at error level.
 *
 * @module middleware/trading-policy-audit
 */

import { Counter } from 'prom-client';

import { redactCredentials } from '../auth/credential-redaction';
import type { MutationAction, MutationAuthReason } from '../auth/mutation-authorization';
import type { BackendPrincipal } from '../auth/token-verifier';
import { metricsRegistry } from '../config/metrics';

/** Header a caller uses to state why it is changing a policy. */
export const CHANGE_REASON_HEADER = 'x-adaptic-change-reason';

/** Longest change reason recorded, in characters. */
const MAX_CHANGE_REASON_LENGTH = 500;

/** Longest free-text header value (user agent, origin) recorded. */
const MAX_HEADER_LENGTH = 300;

/** The switches whose change arms or disarms an account. */
export const TRADING_SWITCH_FIELDS = [
  'realtimeTradingEnabled',
  'paperTradingOnly',
  'killSwitchEnabled',
  'autonomyMode',
] as const;

/** The switch values of one policy as they stood before the write. */
export type TradingSwitches = Partial<
  Record<(typeof TRADING_SWITCH_FIELDS)[number], boolean | string | null>
>;

/**
 * How a touched policy's account was identified: read from the database
 * (`resolved`), created by this same mutation (`new_account`), or not
 * identifiable from the arguments (`unresolved`).
 */
export type PolicyResolution = 'resolved' | 'new_account' | 'unresolved';

/** A policy row the write will touch, as read before the write. */
export interface AuditedPolicyRow {
  /** Argument path of the nested write that reaches it; `null` for a root write. */
  readonly nestedPath: string | null;
  readonly resolution: PolicyResolution;
  readonly policyId: string | null;
  readonly alpacaAccountId: string | null;
  readonly accountType: string | null;
  readonly before: TradingSwitches | null;
}

/**
 * Whether a write may touch a LIVE account's switches: a resolved LIVE
 * account, or any account the guard could not identify (which may be LIVE).
 */
export function mayTouchLiveAccount(policies: readonly AuditedPolicyRow[]): boolean {
  return policies.some((p) => p.accountType === 'LIVE' || p.resolution !== 'resolved');
}

/** Who is writing, as far as the request can prove and report it. */
export interface AuditActor {
  readonly principalKind: BackendPrincipal['kind'] | 'none';
  readonly sub: string | null;
  readonly email: string | null;
  readonly ip: string | null;
  readonly userAgent: string | null;
  readonly origin: string | null;
}

/** Outcome recorded on a row. */
export type AuditOutcome = 'pending' | 'denied' | 'succeeded' | 'failed';

/** Everything recorded about one TradingPolicy write attempt. */
export interface TradingPolicyAuditEntry {
  readonly mutation: string;
  readonly action: MutationAction | 'custom';
  /** Argument paths of the nested TradingPolicy writes; empty for a root write. */
  readonly nestedPaths: readonly string[];
  readonly actor: AuditActor;
  readonly changeReason: string | null;
  readonly decision: 'allowed' | 'would_deny' | 'denied';
  readonly authorizationReason: MutationAuthReason;
  readonly effectiveMode: string;
  readonly graphqlOperationName: string | null;
  readonly requested: Record<string, unknown>;
  readonly policies: readonly AuditedPolicyRow[];
}

/** The slice of the Prisma client this module writes through. */
export interface AuditLogWriter {
  auditLog: {
    create(args: { data: Record<string, unknown> }): Promise<{ id: string }>;
  };
}

/**
 * Disarm-only TradingPolicy writes admitted without an attempt row because
 * AuditLog was unavailable under enforce. Each is also logged in full.
 */
export const mutationAuditBypassedTotal = new Counter({
  name: 'graphql_mutation_audit_bypassed_total',
  help:
    'TradingPolicy writes admitted under enforce without an attempt audit row, by reason. ' +
    'Only disarm-only writes (kill switch on, trading off, paper only, safe autonomy) qualify.',
  labelNames: ['reason'] as const,
  registers: [metricsRegistry],
});

/** Audit-row write failures, by phase. Non-zero means an unattributed write risk. */
export const mutationAuditWriteFailuresTotal = new Counter({
  name: 'graphql_mutation_audit_write_failures_total',
  help:
    'TradingPolicy audit rows that could not be written, by phase (attempt | result). ' +
    'An attempt failure under enforce refuses the mutation; under shadow the write proceeds unattributed.',
  labelNames: ['phase'] as const,
  registers: [metricsRegistry],
});

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** C0 control characters and DEL: a header carrying them could forge log or row structure. */
const FIRST_PRINTABLE = 0x20;
const DELETE = 0x7f;

function isControlCharacter(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return code < FIRST_PRINTABLE || code === DELETE;
}

/** Collapse control characters and bound the length of a header value. */
export function sanitizeHeader(value: string | string[] | undefined, max: number): string | null {
  const raw = Array.isArray(value) ? value.join(',') : value;
  if (typeof raw !== 'string') return null;
  const clean = [...raw]
    .map((ch) => (isControlCharacter(ch) ? ' ' : ch))
    .join('')
    .replace(/ {2,}/g, ' ')
    .trim();
  if (clean.length === 0) return null;
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

/** The request slice the actor is read from. */
export interface ActorRequest {
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
}

/** Build the actor record for a request. */
export function actorFor(principal: BackendPrincipal | null, req: ActorRequest | undefined): AuditActor {
  const headers = req?.headers ?? {};
  const base = {
    ip: req?.ip ?? null,
    userAgent: sanitizeHeader(headers['user-agent'], MAX_HEADER_LENGTH),
    origin: sanitizeHeader(headers.origin, MAX_HEADER_LENGTH),
  };
  if (!principal) return { principalKind: 'none', sub: null, email: null, ...base };
  if (principal.kind === 'server') {
    return { principalKind: 'server', sub: principal.sub ?? null, email: null, ...base };
  }
  return { principalKind: principal.kind, sub: principal.sub, email: principal.email ?? null, ...base };
}

/** The caller's stated reason for the change, if it gave one. */
export function changeReasonFor(req: ActorRequest | undefined): string | null {
  return sanitizeHeader(req?.headers?.[CHANGE_REASON_HEADER], MAX_CHANGE_REASON_LENGTH);
}

/** Whether a requested payload names any trading switch at any depth. */
export function touchesTradingSwitch(requested: unknown): boolean {
  if (requested === null || typeof requested !== 'object') return false;
  for (const [key, child] of Object.entries(requested as Record<string, unknown>)) {
    if ((TRADING_SWITCH_FIELDS as readonly string[]).includes(key)) return true;
    if (touchesTradingSwitch(child)) return true;
  }
  return false;
}

function operationTypeFor(action: MutationAction | 'custom'): 'CREATE' | 'UPDATE' | 'DELETE' {
  if (action === 'create') return 'CREATE';
  if (action === 'delete') return 'DELETE';
  return 'UPDATE';
}

function recordIdFor(policies: readonly AuditedPolicyRow[]): string {
  if (policies.length === 1) {
    const [row] = policies;
    if (row.policyId) return row.policyId;
    return row.alpacaAccountId ? `alpacaAccount:${row.alpacaAccountId}` : row.resolution;
  }
  return policies.length === 0 ? 'unresolved' : `bulk:${policies.length}`;
}

function rowData(
  entry: TradingPolicyAuditEntry,
  phase: 'attempt' | 'result',
  outcome: AuditOutcome,
  extra: Record<string, unknown>
): Record<string, unknown> {
  const { actor } = entry;
  return {
    userId: actor.sub !== null && UUID.test(actor.sub) ? actor.sub : null,
    operationType: operationTypeFor(entry.action),
    modelName: 'TradingPolicy',
    recordId: recordIdFor(entry.policies),
    operationName: entry.mutation,
    ipAddress: actor.ip ? actor.ip.slice(0, 45) : null,
    changedFields: redactCredentials({
      requested: entry.requested,
      nestedPaths: entry.nestedPaths,
    }) as Record<string, unknown>,
    metadata: redactCredentials({
      source: 'mutation-auth-guard',
      phase,
      outcome,
      actor,
      changeReason: entry.changeReason,
      decision: entry.decision,
      authorizationReason: entry.authorizationReason,
      effectiveMode: entry.effectiveMode,
      graphqlOperationName: entry.graphqlOperationName,
      tradingSwitchTouched: touchesTradingSwitch(entry.requested),
      accounts: entry.policies,
      ...extra,
    }) as Record<string, unknown>,
  };
}

/**
 * Write the pre-execution `attempt` row.
 *
 * @returns The new row's id.
 * @throws Whatever the database raised; the caller decides whether that
 *   refuses the mutation. The failure is counted before it propagates.
 */
export async function writeAttemptRow(
  prisma: AuditLogWriter,
  entry: TradingPolicyAuditEntry,
  outcome: 'pending' | 'denied'
): Promise<string> {
  try {
    const row = await prisma.auditLog.create({ data: rowData(entry, 'attempt', outcome, {}) });
    return row.id;
  } catch (error: unknown) {
    mutationAuditWriteFailuresTotal.inc({ phase: 'attempt' });
    throw error;
  }
}

/**
 * Write the post-execution `result` row, linked to its attempt.
 *
 * @throws Whatever the database raised, after counting it. The mutation has
 *   already run at this point; the caller logs the failure loudly because the
 *   attempt row, not this one, is the attribution of record.
 */
export async function writeResultRow(
  prisma: AuditLogWriter,
  entry: TradingPolicyAuditEntry,
  attemptId: string | null,
  outcome: 'succeeded' | 'failed',
  errorCode: string | null
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: rowData(entry, 'result', outcome, { attemptId, errorCode }),
    });
  } catch (error: unknown) {
    mutationAuditWriteFailuresTotal.inc({ phase: 'result' });
    throw error;
  }
}

/** The value each trading switch moves to when a write DISARMS it. */
const DISARMED_VALUES: Readonly<Record<(typeof TRADING_SWITCH_FIELDS)[number], ReadonlySet<unknown>>> = {
  realtimeTradingEnabled: new Set([false]),
  killSwitchEnabled: new Set([true]),
  paperTradingOnly: new Set([true]),
  autonomyMode: new Set(['ADVISORY_ONLY', 'EMERGENCY_SAFE_MODE']),
};

/** Bookkeeping fields a disarm write may also set. */
const DISARM_BOOKKEEPING_FIELDS: ReadonlySet<string> = new Set(['lastModifiedBy', 'lastModifiedAt', 'version']);

/** The value a generated update input sets: `{ set: v }` → `v`; anything else is not a plain set. */
function setValueOf(value: unknown): { readonly value: unknown } | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).filter((key) => record[key] !== undefined);
  return keys.length === 1 && keys[0] === 'set' ? { value: record.set } : null;
}

/**
 * Whether a root `updateOneTradingPolicy` only disarms: it sets at least one
 * trading switch, every switch it sets moves to its disarmed value, and every
 * other field it sets is bookkeeping (or re-states the row's own `id`). Any
 * other shape — a nested write, an upsert (which may create an armed policy),
 * a bulk write, a change to limits — is not disarm-only.
 *
 * @param target - The classified root mutation field.
 * @param args - The field's arguments.
 */
export function isDisarmOnlyPolicyWrite(
  target: { readonly model: string; readonly action: string; readonly cardinality: string },
  args: Record<string, unknown>
): boolean {
  if (target.model !== 'TradingPolicy' || target.action !== 'update' || target.cardinality !== 'one') {
    return false;
  }
  const data = args.data;
  if (data === null || typeof data !== 'object' || Array.isArray(data)) return false;
  const where = args.where as { id?: unknown } | null | undefined;
  let disarmed = 0;
  for (const [key, raw] of Object.entries(data as Record<string, unknown>)) {
    if (raw === undefined) continue;
    const set = setValueOf(raw);
    if (!set) return false;
    if (key in DISARMED_VALUES) {
      if (!DISARMED_VALUES[key as keyof typeof DISARMED_VALUES].has(set.value)) return false;
      disarmed += 1;
    } else if (!DISARM_BOOKKEEPING_FIELDS.has(key) && !(key === 'id' && where?.id === set.value)) {
      return false;
    }
  }
  return disarmed > 0;
}

/** Case-insensitive read of one key from a WebSocket `connectionParams` bag. */
function connectionParam(params: unknown, name: string): string | undefined {
  if (params === null || typeof params !== 'object') return undefined;
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (key.toLowerCase() === name && typeof value === 'string') return value;
  }
  return undefined;
}

/**
 * The actor request for a GraphQL-over-WebSocket operation, so a mutation
 * sent over `/subscriptions` is attributed like an HTTP one: IP (socket
 * remote address), user agent and origin from the upgrade request, and the
 * change reason from the upgrade request's `X-Adaptic-Change-Reason` header
 * or the connection's `connectionParams` (a browser cannot set headers on a
 * WebSocket upgrade). The reason is per connection, not per operation.
 *
 * @param extra - graphql-ws `ctx.extra` (carries the upgrade `request`).
 * @param connectionParams - graphql-ws `ctx.connectionParams`.
 */
export function wsActorRequest(extra: unknown, connectionParams: unknown): ActorRequest {
  const request =
    extra !== null && typeof extra === 'object' ? (extra as { request?: unknown }).request : undefined;
  const req = request !== null && typeof request === 'object' ? (request as Record<string, unknown>) : {};
  const rawHeaders = req.headers !== null && typeof req.headers === 'object' ? req.headers : {};
  const headers: Record<string, string | string[] | undefined> = {};
  for (const name of ['user-agent', 'origin', CHANGE_REASON_HEADER]) {
    const value = (rawHeaders as Record<string, unknown>)[name];
    if (typeof value === 'string' || Array.isArray(value)) headers[name] = value as string | string[];
  }
  headers[CHANGE_REASON_HEADER] ??= connectionParam(connectionParams, CHANGE_REASON_HEADER);
  const socket = req.socket !== null && typeof req.socket === 'object' ? (req.socket as { remoteAddress?: unknown }) : {};
  return {
    ip: typeof socket.remoteAddress === 'string' ? socket.remoteAddress : undefined,
    headers,
  };
}

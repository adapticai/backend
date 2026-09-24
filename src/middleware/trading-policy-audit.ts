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
 * A refused write produces only the `attempt` row (its outcome is `denied`).
 *
 * Writing the attempt row first is what makes the record durable: if the
 * attempt row cannot be written and the mutation is being enforced, the
 * mutation is refused rather than executed unattributed. The caller decides
 * that; this module reports the failure and never swallows it.
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

/** A policy row the write will touch, as read before the write. */
export interface AuditedPolicyRow {
  readonly policyId: string | null;
  readonly alpacaAccountId: string;
  readonly accountType: string | null;
  readonly before: TradingSwitches | null;
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
  /** Argument path of the nested write, or `null` for a root write. */
  readonly nestedPath: string | null;
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
    return row.policyId ?? `alpacaAccount:${row.alpacaAccountId}`;
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
      nestedPath: entry.nestedPath,
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

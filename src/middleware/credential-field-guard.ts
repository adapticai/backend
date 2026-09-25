/**
 * Credential-field guard: stored credentials resolve, and can be filtered or
 * sorted on, only for a verified service principal.
 *
 * ## Why this exists
 *
 * The `/graphql` context admits a request that presents no bearer token as a
 * null principal — context-level enforcement is staged per
 * `docs/security/2026-08-23-graphql-auth-enforcement-runbook.md` because live
 * callers still depend on that path. The generated Prisma types expose every
 * scalar column as a plain field, including the broker API key and secret on
 * `AlpacaAccount` and the OAuth, session and invite tokens on the auth models.
 * With a null principal admitted, those columns are readable by anyone who can
 * reach the endpoint.
 *
 * Hiding the field alone is not enough. A filter, sort or cursor over a
 * credential column is an oracle: `where: { APISecret: { startsWith: "a" } }`
 * answers "does any row match" without ever selecting the field, and a caller
 * can walk the whole secret one character at a time. `groupBy` and the
 * `_min` / `_max` aggregates return the column's value directly. So the guard
 * covers every way a query can observe a credential, not just the field.
 *
 * A stored credential is only ever needed by a service acting for the
 * platform — the engine placing an order with an account's key. No end user,
 * admin session or anonymous caller needs the raw value, so the read surface
 * admits `kind: "server"` only. Writes of a credential are governed by the
 * mutation authentication guard, not here.
 *
 * ## What is guarded
 *
 * 1. **Output** — a credential field on its model type and on that model's
 *    `GroupBy` / `MinAggregate` / `MaxAggregate` output types, and on the
 *    `CreateManyAndReturn…` / `UpdateManyAndReturn…` row types a bulk write
 *    returns.
 * 2. **Filter and sort input** — any argument that names a credential field:
 *    a key in the model's own `…Where…`, `…OrderBy…` or `…Having…` input types
 *    at any nesting depth (AND / OR / NOT, relation filters reached from other
 *    models), and a `by` / `distinct` value of the model's `ScalarFieldEnum`.
 * 3. **Copies in audit payloads** — `AuditLog` JSON payloads hold credentials
 *    copied from mutation variables. The same middleware serves them redacted
 *    to user and anonymous principals and refuses those principals predicates
 *    over them; the rules and their reasons are in `audit-payload-guard`.
 *
 * ## Modes (`CREDENTIAL_FIELD_GUARD_MODE`, read on every request)
 *
 * - `enforce` — deny with `FORBIDDEN`. This is the default, and the value any
 *   unset or unrecognised setting resolves to: a guard whose configuration
 *   cannot be read must refuse, never admit.
 * - `shadow` — resolve unchanged, but count and log every access `enforce`
 *   would deny. Exists only to confirm, before enforcing, that no legitimate
 *   caller reads a credential without a service principal.
 * - `off` — no-op.
 *
 * @module middleware/credential-field-guard
 */

import type { MiddlewareFn } from 'type-graphql';
import {
  GraphQLEnumType,
  GraphQLError,
  GraphQLInputObjectType,
  GraphQLList,
  getNullableType,
  type GraphQLInputType,
  type GraphQLResolveInfo,
} from 'graphql';
import { Counter } from 'prom-client';

import { CREDENTIAL_FIELDS } from '../auth/credential-fields';
import type { BackendPrincipal } from '../auth/token-verifier';
import { metricsRegistry } from '../config/metrics';
import { logger } from '../utils/logger';
import {
  auditPayloadOutputField,
  auditPayloadEnumFieldsFor,
  auditPayloadPredicateFieldsFor,
  readsAuditPayloadRaw,
  redactAuditPayload,
} from './audit-payload-guard';
import { indexGeneratedTypes } from './generated-type-names';
import { GuardLogThrottle } from './guard-log-throttle';

/**
 * The stored credential columns this guard serves to a service principal
 * only. Defined in `auth/credential-fields`, re-exported for existing callers.
 */
export { CREDENTIAL_FIELDS };

/** The guard's operating mode. See the module doc. */
export type CredentialFieldGuardMode = 'enforce' | 'shadow' | 'off';

/** Where the generated schema exposes each credential column. */
const CREDENTIAL_TYPES = indexGeneratedTypes(CREDENTIAL_FIELDS);

/**
 * The credential fields an input type's keys can reference as a predicate,
 * or `undefined` when it is not a credential model's predicate type.
 *
 * @internal Exported for the schema-coverage test, which walks every input
 *   type in the served schema and fails if a credential column appears in a
 *   predicate type this function does not claim.
 */
export function credentialPredicateFieldsFor(
  typeName: string
): ReadonlySet<string> | undefined {
  return CREDENTIAL_TYPES.predicateFields(typeName);
}

/**
 * The credential fields an output type exposes as values, or `undefined`.
 *
 * @internal Exported for the schema-coverage test (see above).
 */
export function credentialOutputFieldsFor(
  typeName: string
): ReadonlySet<string> | undefined {
  return CREDENTIAL_TYPES.outputFields(typeName);
}

/**
 * The credential values a `<Model>ScalarFieldEnum` can name, or `undefined`.
 *
 * @internal Exported for the schema-coverage test (see above).
 */
export function credentialEnumValuesFor(
  typeName: string
): ReadonlySet<string> | undefined {
  return CREDENTIAL_TYPES.enumFields(typeName);
}

/**
 * Every guarded column an argument names, as `TypeName.field` strings, split
 * by the rule that governs it.
 */
export interface GuardedArgumentReferences {
  /** Stored credential columns: predicates admitted for a service principal only. */
  credential: string[];
  /** Audit payload columns: predicates admitted for the raw-read principals only. */
  auditPayload: string[];
}

/**
 * Walk one argument value alongside its GraphQL input type and collect every
 * place it names a guarded column.
 *
 * Type-directed rather than key-directed: a key called `token` is a
 * credential only inside a credential model's predicate type, so an unrelated
 * input that happens to use the same key name is never flagged.
 */
function collectInputReferences(
  type: GraphQLInputType,
  value: unknown,
  found: GuardedArgumentReferences
): void {
  if (value === null || value === undefined) return;
  const nullable = getNullableType(type);

  if (nullable instanceof GraphQLList) {
    const inner = nullable.ofType as GraphQLInputType;
    const items: unknown[] = Array.isArray(value) ? value : [value];
    for (const item of items) collectInputReferences(inner, item, found);
    return;
  }

  if (nullable instanceof GraphQLEnumType) {
    if (typeof value !== 'string') return;
    if (CREDENTIAL_TYPES.enumFields(nullable.name)?.has(value)) {
      found.credential.push(`${nullable.name}.${value}`);
    }
    if (auditPayloadEnumFieldsFor(nullable.name)?.has(value)) {
      found.auditPayload.push(`${nullable.name}.${value}`);
    }
    return;
  }

  if (nullable instanceof GraphQLInputObjectType && typeof value === 'object') {
    const credential = CREDENTIAL_TYPES.predicateFields(nullable.name);
    const auditPayload = auditPayloadPredicateFieldsFor(nullable.name);
    const fieldDefs = nullable.getFields();
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (child === undefined) continue;
      if (credential?.has(key)) found.credential.push(`${nullable.name}.${key}`);
      if (auditPayload?.has(key)) found.auditPayload.push(`${nullable.name}.${key}`);
      const def = fieldDefs[key];
      if (def) collectInputReferences(def.type, child, found);
    }
  }
}

/**
 * Every guarded column a field's arguments name. Both lists are empty when
 * the field takes no arguments or names no guarded column.
 */
export function findGuardedArgumentReferences(
  info: Pick<GraphQLResolveInfo, 'parentType' | 'fieldName'>,
  args: Record<string, unknown>
): GuardedArgumentReferences {
  const found: GuardedArgumentReferences = { credential: [], auditPayload: [] };
  if (!args || Object.keys(args).length === 0) return found;
  const fieldDef = info.parentType.getFields()[info.fieldName];
  if (!fieldDef) return found;
  for (const argDef of fieldDef.args) {
    collectInputReferences(argDef.type, args[argDef.name], found);
  }
  return found;
}

/**
 * Every credential reference in a field's arguments, as `TypeName.field`
 * strings. Empty when the field takes no arguments or names no credential.
 */
export function findCredentialArgumentReferences(
  info: Pick<GraphQLResolveInfo, 'parentType' | 'fieldName'>,
  args: Record<string, unknown>
): string[] {
  return findGuardedArgumentReferences(info, args).credential;
}

/** The credential field this resolver outputs, as `TypeName.field`, if any. */
export function findCredentialOutputField(
  info: Pick<GraphQLResolveInfo, 'parentType' | 'fieldName'>
): string | undefined {
  const fields = CREDENTIAL_TYPES.outputFields(info.parentType.name);
  return fields?.has(info.fieldName)
    ? `${info.parentType.name}.${info.fieldName}`
    : undefined;
}

/**
 * Resolve the guard mode from `CREDENTIAL_FIELD_GUARD_MODE`. Anything other
 * than an explicit `shadow` or `off` enforces.
 */
export function getCredentialFieldGuardMode(): CredentialFieldGuardMode {
  const raw = (process.env.CREDENTIAL_FIELD_GUARD_MODE ?? '').trim().toLowerCase();
  if (raw === 'shadow' || raw === 'off') return raw;
  return 'enforce';
}

/** Decisions the guard records. */
type GuardDecision = 'allowed' | 'would_deny' | 'denied';

/** Where on the operation the credential was reached. */
type GuardSurface = 'output' | 'argument';

/** Principal kind as a bounded metric label; `none` is a null principal. */
type PrincipalLabel = BackendPrincipal['kind'] | 'none';

/**
 * Credential-surface accesses by surface, decision and principal kind. The
 * `would_deny` series in `shadow` is the list of callers that enforcement
 * would break; it must be empty of legitimate callers before enforcing.
 */
export const credentialFieldAccessTotal = new Counter({
  name: 'graphql_credential_field_access_total',
  help:
    'Reads of, or predicates over, stored credential columns on /graphql, by ' +
    'surface (output | argument), decision (allowed | would_deny | denied) and ' +
    'principal kind (server | admin | user | none). Only kind=server is allowed.',
  labelNames: ['surface', 'decision', 'principal_kind'] as const,
  registers: [metricsRegistry],
});

/** What a principal that reads audit payloads redacted got. */
type AuditPayloadDecision = 'unchanged' | 'redacted' | 'would_redact' | 'denied' | 'would_deny';

/**
 * Audit payload accesses by principals that read payloads redacted (user and
 * anonymous). Reads (`output`) are counted by what redaction did to them;
 * predicates (`argument`) by whether they were refused. In `shadow`,
 * `would_redact` with `carried_value="true"` counts reads that served a stored
 * credential value — the exposure enforcement closes.
 */
export const auditPayloadAccessTotal = new Counter({
  name: 'graphql_audit_payload_access_total',
  help:
    'Reads of, or predicates over, AuditLog JSON payload columns on /graphql by a principal ' +
    'that reads them redacted (user | none), by surface (output | argument), decision ' +
    '(unchanged | redacted | would_redact | denied | would_deny), principal kind, and whether ' +
    'a replaced value held anything (carried_value: true | false | n/a).',
  labelNames: ['surface', 'decision', 'principal_kind', 'carried_value'] as const,
  registers: [metricsRegistry],
});

/**
 * Longest caller-supplied value (forwarded chain, user agent, operation name,
 * service subject) a log line or throttle key keeps, in characters.
 */
const MAX_ATTRIBUTION_LENGTH = 256;

/** Truncate a caller-supplied value so a padded one cannot bloat the log or the throttle. */
function bounded(value: string): string {
  return value.slice(0, MAX_ATTRIBUTION_LENGTH);
}

/** Throttle window for the identity log line, per distinct caller key. */
const LOG_THROTTLE_MS = 10 * 60 * 1000;

/**
 * Distinct caller keys one scope (principal kind plus connection address) may
 * log per window. Well above the handful of callers one edge address carries;
 * a scope that spends it is rotating caller-supplied values, and says so.
 */
const LOG_KEYS_PER_SCOPE = 256;

/** Distinct scopes the throttle tracks per window. */
const LOG_MAX_SCOPES = 64;

const logThrottle = new GuardLogThrottle({
  windowMs: LOG_THROTTLE_MS,
  keysPerScope: LOG_KEYS_PER_SCOPE,
  maxScopes: LOG_MAX_SCOPES,
});

/**
 * Charge one decision line to the throttle. Returns whether to write the line;
 * when the scope has just spent its budget, writes the scope's single overflow
 * notice instead and returns false.
 */
function admitLogLine(scope: string, key: string, nowMs: number): boolean {
  const verdict = logThrottle.admit(scope, key, nowMs);
  if (verdict.action === 'log') return true;
  if (verdict.action === 'overflow') {
    logger.warn('[credential-field-guard] decision log budget spent for a caller scope', {
      scope: verdict.scope,
      keysPerScope: LOG_KEYS_PER_SCOPE,
      dedupWindowMs: LOG_THROTTLE_MS,
      consequence:
        'further distinct callers in this scope are not logged until the window ends; ' +
        'the decision counters still count every access',
    });
  }
  return false;
}

/** Message for a credential column reached by a non-service principal. */
const CREDENTIAL_ACCESS_MESSAGE =
  '[credential-field-guard] credential access by a non-service principal';

/** Message for a predicate over an audit payload by a principal that reads it redacted. */
const AUDIT_PAYLOAD_PREDICATE_MESSAGE =
  '[credential-field-guard] audit payload predicate by a principal that reads payloads redacted';

/** Audit payload key paths one log line lists; the count is always logged. */
const MAX_LOGGED_PATHS = 16;

/** Log a denied or would-deny access at most once per caller key per window. */
function logDecision(
  message: string,
  decision: GuardDecision,
  surface: GuardSurface,
  references: string[],
  principal: PrincipalLabel,
  info: Pick<GraphQLResolveInfo, 'operation'>,
  request: GuardRequest | undefined,
  nowMs: number
): void {
  const operationName = bounded(info.operation?.name?.value ?? '<unnamed>');
  const userAgent = bounded(headerValue(request?.headers?.['user-agent']));
  // The source is part of the key: two callers sending the same operation
  // with the same user agent (every Node `fetch` sends `node`) are different
  // callers, and a key without the source logs only the first of them per
  // window — which is exactly the attribution a pre-enforcement review of the
  // would-deny set depends on. The connection address scopes the key's budget
  // (the caller cannot set it); the forwarded chain, which the caller can,
  // only distinguishes keys inside that budget.
  const source = callerSource(request);
  const referenceKey = [...new Set(references)].sort().join(',');
  const key = `${decision}|${surface}|${referenceKey}|${operationName}|${userAgent}|${source.forwardedFor}`;
  if (!admitLogLine(`${principal}|${source.ip}`, key, nowMs)) return;
  logger.warn(message, {
    decision,
    surface,
    references,
    principalKind: principal,
    operationName,
    ip: source.ip,
    forwardedFor: source.forwardedFor,
    userAgent,
    dedupWindowMs: LOG_THROTTLE_MS,
  });
}

/**
 * Log a service principal's credential read at most once per caller key per
 * window.
 *
 * Every holder of the service secret is `kind: "server"`, so the metric alone
 * cannot say WHICH holder read a broker key. The signed credential's `sub`
 * (`adaptic-engine:<host>:<pid>`, `adaptic-platform:…`, an operator toolkit's
 * `adaptic-audit:…`) can, and it is what an operator needs to tell a known
 * service from a leaked secret. It goes to the log, not the metric label,
 * because host:pid is unbounded. A static `SERVER_AUTH_TOKEN` names no caller
 * and logs as `<unattributed>`.
 */
function logServiceRead(
  sub: string | undefined,
  reference: string,
  info: Pick<GraphQLResolveInfo, 'operation'>,
  request: GuardRequest | undefined,
  nowMs: number
): void {
  const operationName = bounded(info.operation?.name?.value ?? '<unnamed>');
  const caller = bounded(sub ?? '<unattributed>');
  const source = callerSource(request);
  const key = `allowed|${caller}|${reference}|${operationName}|${source.forwardedFor}`;
  if (!admitLogLine(`server|${source.ip}`, key, nowMs)) return;
  logger.info('[credential-field-guard] credential read by a service principal', {
    decision: 'allowed',
    serviceSub: caller,
    reference,
    operationName,
    ip: source.ip,
    forwardedFor: source.forwardedFor,
    dedupWindowMs: LOG_THROTTLE_MS,
  });
}

/**
 * Log an audit payload read that redaction changes, or would change, at most
 * once per caller key per window. The line names the key paths that held
 * credentials, never their values.
 */
function logAuditPayloadRead(
  decision: AuditPayloadDecision,
  reference: string,
  paths: ReadonlyArray<{ path: string; carriesValue: boolean }>,
  principal: PrincipalLabel,
  info: Pick<GraphQLResolveInfo, 'operation'>,
  request: GuardRequest | undefined,
  nowMs: number
): void {
  const operationName = bounded(info.operation?.name?.value ?? '<unnamed>');
  const userAgent = bounded(headerValue(request?.headers?.['user-agent']));
  const source = callerSource(request);
  const key = `payload|${decision}|${reference}|${operationName}|${userAgent}|${source.forwardedFor}`;
  if (!admitLogLine(`${principal}|${source.ip}`, key, nowMs)) return;
  logger.warn(
    '[credential-field-guard] audit payload holding credentials read by a principal that reads payloads redacted',
    {
      decision,
      reference,
      credentialPaths: paths.slice(0, MAX_LOGGED_PATHS).map((p) => bounded(p.path)),
      credentialPathCount: paths.length,
      carriedValue: paths.some((p) => p.carriesValue),
      principalKind: principal,
      operationName,
      ip: source.ip,
      forwardedFor: source.forwardedFor,
      userAgent,
      dedupWindowMs: LOG_THROTTLE_MS,
    }
  );
}

/**
 * Where a request came from, as far as this process can tell.
 *
 * `req.ip` is the address `trust proxy` resolves, and behind the production
 * edge it resolves to the edge's own pool (an operator's laptop and a hosted
 * service log the same handful of addresses), so on its own it cannot tell
 * callers apart. The raw `X-Forwarded-For` chain carries the hops the edge
 * saw. It is caller-supplied at its left end, so it is attribution evidence
 * for an operator reading the log, never an identity the guard decides on.
 */
function callerSource(request: GuardRequest | undefined): { ip: string; forwardedFor: string } {
  return {
    ip: bounded(request?.ip ?? '<none>'),
    forwardedFor: bounded(headerValue(request?.headers?.['x-forwarded-for'])),
  };
}

function headerValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value.join(',');
  return value ?? '<none>';
}

/** The slice of the Express request the guard reads for its log line. */
interface GuardRequest {
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
}

/** GraphQL context shape the guard reads. */
export interface CredentialFieldGuardContext {
  principal?: BackendPrincipal | null;
  req?: GuardRequest;
}

/** Options for {@link createCredentialFieldGuardMiddleware}, for tests. */
export interface CredentialFieldGuardOptions {
  /** Override the mode resolver (defaults to the environment). */
  modeProvider?: () => CredentialFieldGuardMode;
  /** Clock for the log throttle. */
  now?: () => number;
}

function forbidden(references: string[]): GraphQLError {
  return new GraphQLError(
    'Forbidden: stored credentials are readable only by a service principal',
    {
      extensions: {
        code: 'FORBIDDEN',
        references,
        http: { status: 403 },
      },
    }
  );
}

function forbiddenAuditPayloadPredicate(references: string[]): GraphQLError {
  return new GraphQLError(
    'Forbidden: audit payload columns can be filtered, sorted or grouped on only by a ' +
      'service or admin principal',
    {
      extensions: {
        code: 'FORBIDDEN',
        references,
        http: { status: 403 },
      },
    }
  );
}

/**
 * Create the TypeGraphQL global middleware that guards credential columns.
 *
 * Runs on every field. The hot path — a non-credential field with no
 * arguments, or any field for a service principal — returns after a map
 * lookup.
 *
 * @param options - Optional overrides for tests.
 * @returns A {@link MiddlewareFn} for `buildSchema({ globalMiddlewares })`.
 */
export function createCredentialFieldGuardMiddleware(
  options: CredentialFieldGuardOptions = {}
): MiddlewareFn<CredentialFieldGuardContext> {
  const resolveMode = options.modeProvider ?? getCredentialFieldGuardMode;
  const now = options.now ?? Date.now;

  return async ({ context, args, info }, next) => {
    const proceed = (): Promise<unknown> => next() as Promise<unknown>;

    const output = findCredentialOutputField(info);
    const principal = context.principal ?? null;
    if (principal?.kind === 'server') {
      if (output && resolveMode() !== 'off') {
        credentialFieldAccessTotal.inc({
          surface: 'output',
          decision: 'allowed',
          principal_kind: 'server',
        });
        logServiceRead(principal.sub, output, info, context.req, now());
      }
      return proceed();
    }

    const references = findGuardedArgumentReferences(info, args as Record<string, unknown>);
    // Admins read audit payloads as stored, so only user and anonymous
    // principals reach the payload rules below.
    const payloadReader = !readsAuditPayloadRaw(principal);
    const payloadOutput = payloadReader ? auditPayloadOutputField(info) : undefined;
    const payloadRefs = payloadReader ? references.auditPayload : [];
    if (
      !output &&
      references.credential.length === 0 &&
      !payloadOutput &&
      payloadRefs.length === 0
    ) {
      return proceed();
    }

    const mode = resolveMode();
    if (mode === 'off') return proceed();
    const principalLabel: PrincipalLabel = principal?.kind ?? 'none';
    const nowMs = now();
    const refusal: GuardDecision = mode === 'enforce' ? 'denied' : 'would_deny';

    if (output || references.credential.length > 0) {
      const surface: GuardSurface = output ? 'output' : 'argument';
      const credentialRefs = output ? [output, ...references.credential] : references.credential;
      credentialFieldAccessTotal.inc({
        surface,
        decision: refusal,
        principal_kind: principalLabel,
      });
      logDecision(
        CREDENTIAL_ACCESS_MESSAGE,
        refusal,
        surface,
        credentialRefs,
        principalLabel,
        info,
        context.req,
        nowMs
      );
      if (mode === 'enforce') throw forbidden(credentialRefs);
    }

    if (payloadRefs.length > 0) {
      auditPayloadAccessTotal.inc({
        surface: 'argument',
        decision: refusal,
        principal_kind: principalLabel,
        carried_value: 'n/a',
      });
      logDecision(
        AUDIT_PAYLOAD_PREDICATE_MESSAGE,
        refusal,
        'argument',
        payloadRefs,
        principalLabel,
        info,
        context.req,
        nowMs
      );
      if (mode === 'enforce') throw forbiddenAuditPayloadPredicate(payloadRefs);
    }

    if (!payloadOutput) return proceed();

    const value = await proceed();
    const { redacted, paths } = redactAuditPayload(value);
    const decision: AuditPayloadDecision =
      paths.length === 0 ? 'unchanged' : mode === 'enforce' ? 'redacted' : 'would_redact';
    auditPayloadAccessTotal.inc({
      surface: 'output',
      decision,
      principal_kind: principalLabel,
      carried_value: String(paths.some((p) => p.carriesValue)),
    });
    if (paths.length > 0) {
      logAuditPayloadRead(decision, payloadOutput, paths, principalLabel, info, context.req, nowMs);
    }
    // Under enforce the redacted copy is served even when no path was found:
    // the copy is what the rule promises, the path list only describes it.
    return mode === 'enforce' ? redacted : value;
  };
}

/** @internal Test hook: forget the log throttle state. */
export function resetCredentialFieldGuardLogThrottle(): void {
  logThrottle.reset();
}

/**
 * Mutation authorization guard: every GraphQL mutation is admitted only for a
 * principal authorised to write that model and, for a brokerage account's
 * policy or account row, that account.
 *
 * The decision itself lives in `src/auth/mutation-authorization.ts` (pure);
 * this module installs it on the built schema, resolves the ownership facts a
 * user principal's write needs, counts and logs every decision, and writes the
 * attributed TradingPolicy audit rows (`./trading-policy-audit.ts`).
 *
 * ## Why it wraps the Mutation fields instead of being a global middleware
 *
 * A TypeGraphQL global middleware is dispatched on EVERY field of every query.
 * Measured on 500 rows x 8 fields, one extra global middleware — even one that
 * returns after a single comparison — added ~0.35 us per field (4.2 → 5.6 ms
 * per query), a cost the platform's read-heavy traffic would pay for a check
 * that only ever applies to root Mutation fields. So the guard wraps the
 * `resolve` of each root Mutation field on the built schema: reads pay nothing,
 * and every mutation — generated or hand-written — is covered, because the
 * set wrapped is the schema's own Mutation type, not a list someone maintains.
 *
 * Each root field of a multi-field (batched or aliased) operation is its own
 * resolver call, so each is decided on its own: an allowed field never carries
 * a refused sibling through with it. The guard runs outside the TypeGraphQL
 * middleware chain, so it decides before the credential-field guard and the
 * tenancy scoping see the field.
 *
 * @module middleware/mutation-auth-guard
 */

import { Prisma } from '@prisma/client';
import {
  defaultFieldResolver,
  GraphQLError,
  type GraphQLField,
  type GraphQLResolveInfo,
  type GraphQLSchema,
} from 'graphql';
import { Counter } from 'prom-client';

import {
  classifyMutationField,
  effectiveModeFor,
  evaluateMutationAccess,
  getEnforcedModels,
  getMutationAuthMode,
  isNestedWriteUserWritable,
  type MutationAuthEvaluation,
  type MutationAuthMode,
  type MutationFacts,
  type MutationTarget,
} from '../auth/mutation-authorization';
import { findNestedWrites, type NestedWrite } from '../auth/nested-write-inspector';
import type { BackendPrincipal } from '../auth/token-verifier';
import { metricsRegistry } from '../config/metrics';
import { logger } from '../utils/logger';
import {
  loadTouchedAccounts,
  ownershipOf,
  type MutationAuthPrisma,
  type TouchedAccounts,
} from './mutation-account-facts';
import {
  actorFor,
  changeReasonFor,
  touchesTradingSwitch,
  writeAttemptRow,
  writeResultRow,
  type ActorRequest,
  type TradingPolicyAuditEntry,
} from './trading-policy-audit';

/** What the guard records for one mutation. */
type Decision = 'allowed' | 'would_deny' | 'denied';

/**
 * Mutation decisions by mutation field, principal kind, decision and reason.
 * Every label is bounded: the mutation field must exist in the schema to
 * reach a resolver, and the other three are closed enums. The `would_deny`
 * series is the list of callers enforcement would break.
 */
export const mutationAuthorizationTotal = new Counter({
  name: 'graphql_mutation_authorization_total',
  help:
    'GraphQL mutation authorization decisions by mutation field, principal kind ' +
    '(server | admin | user | none), decision (allowed | would_deny | denied) and reason.',
  labelNames: ['mutation', 'principal_kind', 'decision', 'reason'] as const,
  registers: [metricsRegistry],
});

/** GraphQL context shape the guard reads. */
export interface MutationAuthGuardContext {
  principal?: BackendPrincipal | null;
  prisma?: unknown;
  req?: ActorRequest;
}

/** Options for {@link createMutationAuthGuardMiddleware}; defaults read the environment. */
export interface MutationAuthGuardOptions {
  modeProvider?: () => MutationAuthMode;
  enforcedModelsProvider?: () => ReadonlySet<string>;
  models?: readonly string[];
  now?: () => number;
}

const LOG_THROTTLE_MS = 10 * 60 * 1000;
const LOG_THROTTLE_MAX_KEYS = 5_000;
const lastLoggedAt = new Map<string, number>();

/** @internal Test hook: forget the log throttle state. */
export function resetMutationAuthLogThrottle(): void {
  lastLoggedAt.clear();
}

function refusalError(evaluation: MutationAuthEvaluation): GraphQLError {
  if (evaluation.refusal === 'unauthenticated') {
    return new GraphQLError('Unauthenticated: this mutation requires a verified principal', {
      extensions: { code: 'UNAUTHENTICATED', reason: evaluation.reason, http: { status: 401 } },
    });
  }
  return new GraphQLError('Forbidden: this principal is not authorised for this mutation', {
    extensions: { code: 'FORBIDDEN', reason: evaluation.reason, http: { status: 403 } },
  });
}

function guardUnavailableError(): GraphQLError {
  return new GraphQLError('Service unavailable: this mutation could not be authorised', {
    extensions: { code: 'MUTATION_AUTH_UNAVAILABLE', http: { status: 503 } },
  });
}

function auditUnavailableError(): GraphQLError {
  return new GraphQLError(
    'Service unavailable: the audit record for this trading-policy write could not be written',
    { extensions: { code: 'AUDIT_UNAVAILABLE', http: { status: 503 } } }
  );
}

function errorCodeOf(error: unknown): string {
  if (error instanceof GraphQLError && typeof error.extensions?.code === 'string') {
    return error.extensions.code;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) return error.code;
  return error instanceof Error ? error.name : 'unknown';
}

function logRefusal(
  decision: Decision,
  target: MutationTarget,
  evaluation: MutationAuthEvaluation,
  principal: BackendPrincipal | null,
  info: Pick<GraphQLResolveInfo, 'operation'>,
  req: ActorRequest | undefined,
  nowMs: number
): void {
  const actor = actorFor(principal, req);
  const key = [decision, target.fieldName, actor.principalKind, evaluation.reason, actor.userAgent, actor.ip].join('|');
  const previous = lastLoggedAt.get(key);
  if (previous !== undefined && nowMs - previous < LOG_THROTTLE_MS) return;
  if (lastLoggedAt.size >= LOG_THROTTLE_MAX_KEYS) lastLoggedAt.clear();
  lastLoggedAt.set(key, nowMs);
  logger.warn('[mutation-auth] mutation refused by authorization policy', {
    decision,
    mutation: target.fieldName,
    model: target.model,
    reason: evaluation.reason,
    principalKind: actor.principalKind,
    principalSub: actor.sub,
    operationName: info.operation?.name?.value ?? '<unnamed>',
    ip: actor.ip,
    userAgent: actor.userAgent,
    origin: actor.origin,
    dedupWindowMs: LOG_THROTTLE_MS,
  });
}

/** Decide one mutation, resolving ownership facts only when the decision needs them. */
async function decide(
  principal: BackendPrincipal | null,
  target: MutationTarget,
  nested: readonly NestedWrite[],
  args: Record<string, unknown>,
  touched: () => Promise<TouchedAccounts>,
  prisma: MutationAuthPrisma | undefined
): Promise<MutationAuthEvaluation> {
  if (principal?.kind !== 'user') return evaluateMutationAccess(principal, target);

  const facts: MutationFacts = {
    forbiddenNestedWrites: nested
      .filter(
        (n) =>
          !isNestedWriteUserWritable(
            target.model,
            n.model,
            n.operations,
            n.connectIds !== null &&
              n.connectIds.length > 0 &&
              n.connectIds.every((id) => id === principal.sub)
          )
      )
      .map((n) => n.model),
    targetsSelf: targetsSelf(principal, args),
  };
  const first = evaluateMutationAccess(principal, target, facts);
  if (first.reason !== 'account_unresolved' || !prisma) return first;

  try {
    const ownership = await ownershipOf(prisma, principal.sub, await touched());
    return evaluateMutationAccess(principal, target, { ...facts, ownership });
  } catch (error: unknown) {
    logger.error('[mutation-auth] account ownership could not be read; refusing as unresolved', {
      mutation: target.fieldName,
      error: error instanceof Error ? error.message : String(error),
    });
    return first;
  }
}

function targetsSelf(principal: { sub: string; email?: string }, args: Record<string, unknown>): boolean {
  const where = args.where;
  if (where === null || typeof where !== 'object') return false;
  const { id, email } = where as { id?: unknown; email?: unknown };
  if (id !== undefined) return id === principal.sub;
  return principal.email !== undefined && email === principal.email;
}

/** Fields already wrapped, so installing twice never double-guards a field. */
const guardedFields = new WeakSet<GraphQLField<unknown, unknown>>();

/**
 * Wrap every root Mutation field of a built schema with the guard.
 *
 * @param schema - The schema `buildSchema` returned; mutated in place.
 * @param options - Optional overrides for tests.
 * @returns How many Mutation fields are guarded (for the boot log; zero means
 *   the schema has no Mutation type and nothing is protected).
 */
export function installMutationAuthGuard(
  schema: GraphQLSchema,
  options: MutationAuthGuardOptions = {}
): number {
  const mutationType = schema.getMutationType();
  if (!mutationType) return 0;
  const guard = createMutationGuard(options);
  let guarded = 0;
  for (const field of Object.values(mutationType.getFields())) {
    guarded += 1;
    if (guardedFields.has(field)) continue;
    const original = field.resolve ?? defaultFieldResolver;
    field.resolve = (source, args, context, info) =>
      guard(context as MutationAuthGuardContext, args, info, () =>
        Promise.resolve(original(source, args, context, info))
      );
    guardedFields.add(field);
  }
  return guarded;
}

/** The per-mutation decision + audit, closed over its configuration. */
function createMutationGuard(
  options: MutationAuthGuardOptions
): (
  context: MutationAuthGuardContext,
  args: unknown,
  info: GraphQLResolveInfo,
  proceed: () => Promise<unknown>
) => Promise<unknown> {
  const resolveMode = options.modeProvider ?? (() => getMutationAuthMode());
  const resolveEnforced = options.enforcedModelsProvider ?? (() => getEnforcedModels());
  const models = new Set(options.models ?? Object.values(Prisma.ModelName));
  const modelsLongestFirst = [...models].sort((a, b) => b.length - a.length);
  const now = options.now ?? Date.now;

  /**
   * Whether a mutation the guard could not evaluate is refused. It is when
   * anything is being enforced — globally, or any escalated model (the guard
   * cannot know the failed mutation was not one of them) — and when the
   * escalation list itself cannot be read. Only a pure-shadow or off guard
   * lets it through, because in those modes the guard refuses nothing anyway.
   */
  const failsClosedOnError = (baseMode: MutationAuthMode): boolean => {
    if (baseMode === 'enforce') return true;
    if (baseMode === 'off') return false;
    try {
      return resolveEnforced().size > 0;
    } catch {
      return true;
    }
  };

  return async (context, args, info, proceed) => {
    const principal = context.principal ?? null;
    const argRecord = (args ?? {}) as Record<string, unknown>;
    // Cast justified: the context's `prisma` is the server's PrismaClient, whose
    // delegates satisfy this structural slice; tests supply a fake of it.
    const prisma = context.prisma as MutationAuthPrisma | undefined;

    let baseMode: MutationAuthMode = 'enforce';
    let target: MutationTarget;
    let mode: MutationAuthMode;
    let nested: NestedWrite[];
    let evaluation: MutationAuthEvaluation;
    let touchedPromise: Promise<TouchedAccounts> | undefined;
    const touched = (): Promise<TouchedAccounts> => {
      touchedPromise ??= prisma
        ? loadTouchedAccounts(prisma, target, argRecord)
        : Promise.resolve({ accounts: [], policies: [] });
      return touchedPromise;
    };

    try {
      baseMode = resolveMode();
      target = classifyMutationField(info.fieldName, models);
      mode = effectiveModeFor(target.model, baseMode, resolveEnforced());
      nested = findNestedWrites(info, argRecord, modelsLongestFirst);
      evaluation =
        mode === 'off'
          ? { allowed: true, reason: 'guard_off' }
          : await decide(principal, target, nested, argRecord, touched, prisma);
    } catch (error: unknown) {
      const refuse = failsClosedOnError(baseMode);
      mutationAuthorizationTotal.inc({
        mutation: info.fieldName,
        principal_kind: principal?.kind ?? 'none',
        decision: refuse ? 'denied' : 'allowed',
        reason: 'guard_error',
      });
      logger.error('[mutation-auth] mutation could not be evaluated', {
        mutation: info.fieldName,
        refused: refuse,
        error: error instanceof Error ? error.message : String(error),
      });
      if (refuse) throw guardUnavailableError();
      return proceed();
    }
    const decision: Decision = evaluation.allowed ? 'allowed' : mode === 'enforce' ? 'denied' : 'would_deny';

    mutationAuthorizationTotal.inc({
      mutation: target.fieldName,
      principal_kind: principal?.kind ?? 'none',
      decision,
      reason: evaluation.reason,
    });
    if (decision !== 'allowed') {
      logRefusal(decision, target, evaluation, principal, info, context.req, now());
    }

    const policyNested = nested.find((n) => n.model === 'TradingPolicy');
    if (target.model !== 'TradingPolicy' && !policyNested) {
      if (decision === 'denied') throw refusalError(evaluation);
      return proceed();
    }

    return auditedPolicyWrite({
      target,
      nestedPath: target.model === 'TradingPolicy' ? null : (policyNested?.path ?? null),
      principal,
      context,
      info,
      args: argRecord,
      evaluation,
      decision,
      mode,
      prisma,
      touched,
      next: proceed,
    });
  };
}

interface AuditedWriteInput {
  target: MutationTarget;
  nestedPath: string | null;
  principal: BackendPrincipal | null;
  context: MutationAuthGuardContext;
  info: Pick<GraphQLResolveInfo, 'operation'>;
  args: Record<string, unknown>;
  evaluation: MutationAuthEvaluation;
  decision: Decision;
  mode: MutationAuthMode;
  prisma: MutationAuthPrisma | undefined;
  touched: () => Promise<TouchedAccounts>;
  next: () => Promise<unknown>;
}

async function auditedPolicyWrite(input: AuditedWriteInput): Promise<unknown> {
  const { target, principal, context, evaluation, decision, mode, prisma } = input;
  let policies: TouchedAccounts['policies'] = [];
  let policyReadFailed = false;
  try {
    policies = (await input.touched()).policies;
  } catch (error: unknown) {
    policyReadFailed = true;
    logger.error('[mutation-auth] trading-policy before-state could not be read', {
      mutation: target.fieldName,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const entry: TradingPolicyAuditEntry = {
    mutation: target.fieldName,
    action: target.action,
    nestedPath: input.nestedPath,
    actor: actorFor(principal, context.req),
    changeReason: changeReasonFor(context.req),
    decision,
    authorizationReason: evaluation.reason,
    effectiveMode: policyReadFailed ? `${mode}:before_state_unread` : mode,
    graphqlOperationName: input.info.operation?.name?.value ?? null,
    requested: input.args,
    policies,
  };

  if (policies.some((p) => p.accountType === 'LIVE') && touchesTradingSwitch(input.args)) {
    logger.warn('[mutation-auth] trading-switch write on a LIVE account', {
      mutation: target.fieldName,
      decision,
      reason: evaluation.reason,
      actor: entry.actor,
      changeReason: entry.changeReason,
      accounts: policies,
    });
  }

  if (!prisma) {
    logger.error('[mutation-auth] no database client on the context; trading-policy write is unaudited', {
      mutation: target.fieldName,
    });
    if (decision === 'denied') throw refusalError(evaluation);
    if (mode === 'enforce') throw auditUnavailableError();
    return input.next();
  }

  if (decision === 'denied') {
    try {
      await writeAttemptRow(prisma, entry, 'denied');
    } catch (error: unknown) {
      logger.error('[mutation-auth] audit row for a refused trading-policy write failed', {
        mutation: target.fieldName,
        error: error instanceof Error ? error.message : String(error),
      });
    }
    throw refusalError(evaluation);
  }

  let attemptId: string | null = null;
  try {
    attemptId = await writeAttemptRow(prisma, entry, 'pending');
  } catch (error: unknown) {
    logger.error('[mutation-auth] trading-policy attempt row could not be written', {
      mutation: target.fieldName,
      refused: mode === 'enforce',
      error: error instanceof Error ? error.message : String(error),
    });
    if (mode === 'enforce') throw auditUnavailableError();
  }

  let result: unknown;
  try {
    result = await input.next();
  } catch (error: unknown) {
    await recordResult(prisma, entry, attemptId, 'failed', errorCodeOf(error));
    throw error;
  }
  await recordResult(prisma, entry, attemptId, 'succeeded', null);
  return result;
}

async function recordResult(
  prisma: MutationAuthPrisma,
  entry: TradingPolicyAuditEntry,
  attemptId: string | null,
  outcome: 'succeeded' | 'failed',
  errorCode: string | null
): Promise<void> {
  try {
    await writeResultRow(prisma, entry, attemptId, outcome, errorCode);
  } catch (error: unknown) {
    logger.error('[mutation-auth] trading-policy result row could not be written', {
      mutation: entry.mutation,
      attemptId,
      outcome,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

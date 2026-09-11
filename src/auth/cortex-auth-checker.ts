/**
 * CORTEX-P0-001 — resolver-level authorization AuthChecker (SHADOW-FIRST).
 *
 * A TypeGraphQL {@link AuthChecker} that evaluates whether an operation WOULD be
 * allowed under resolver-level authorization, closing the residual vector called
 * out in the tenancy-scoping middleware docs: a governed model reached
 * transitively through a non-governed root, and — more broadly — any
 * `@Authorized()`-decorated field executed without a verified principal.
 *
 * CRITICAL SAFETY CONTRACT — this change is additive and default-OFF. When
 * enforcement is OFF (the default), the checker NEVER denies: it returns `true`
 * for every operation, emitting a structured warn log and incrementing a
 * Prometheus counter for any operation that enforcement WOULD deny. Live
 * behaviour is byte-identical to before this change until
 * `CORTEX_AUTHCHECKER_ENFORCE` is flipped on. Additionally, TypeGraphQL only
 * invokes an AuthChecker for fields decorated with `@Authorized()`; the
 * auto-generated typegraphql-prisma resolvers carry no such decorator, so
 * registering this checker via `buildSchema({ authChecker })` is inert at
 * runtime until decorators are added in the separate enforcement phase.
 *
 * Decision model (mirrors the token-verifier principal kinds):
 *
 *   - `server`            — trusted server-to-server caller. ALWAYS allowed; the
 *     engine + utils call the CRUD resolvers with a server principal and must
 *     retain full access, bypassing any role gate.
 *   - `admin` / `user`    — verified end-user. Allowed when the field requires no
 *     specific role, or when the principal carries one of the required roles;
 *     otherwise a would-deny with reason `insufficient_role`.
 *   - `null` (no verified principal) — a genuinely unauthenticated caller on a
 *     non-public (i.e. `@Authorized()`) operation. A would-deny with reason
 *     `unauthenticated`.
 *
 * @see src/auth/tenancy-scope.ts for the row-level (data-scope) counterpart.
 * @see src/auth/token-verifier.ts for `BackendPrincipal`.
 */

import { Counter } from 'prom-client';
import type { AuthChecker, ResolverData } from 'type-graphql';
import type { BackendPrincipal } from './token-verifier';
import { metricsRegistry } from '../config/metrics';
import { logger } from '../utils/logger';

// -----------------------------------------------------------------------------
// Enforcement flag
// -----------------------------------------------------------------------------

/**
 * Environment variable gating enforcement. When set to `true`/`1`, the checker
 * fails closed (returns `false`) for any would-deny operation. Unset or any
 * other value keeps the checker in SHADOW mode (observe + count + allow).
 */
export const CORTEX_AUTHCHECKER_ENFORCE_ENV = 'CORTEX_AUTHCHECKER_ENFORCE';

/** The `admin` role string used to satisfy admin-gated `@Authorized()` fields. */
const ADMIN_ROLE = 'admin';

/**
 * Whether resolver-level authorization enforcement is ON. Read fresh on each
 * call (a cheap env read) so the shadow→enforce graduation can be flipped
 * operationally without a process restart — the same pattern the tenancy-scoping
 * middleware uses. Defaults to OFF (shadow) for any unset/unrecognised value.
 *
 * @param env - Environment source (defaults to `process.env`); injectable for tests.
 * @returns `true` only when the flag is explicitly `true`/`1`.
 */
export function isAuthCheckerEnforced(
  env: Record<string, string | undefined> = process.env
): boolean {
  const raw = (env[CORTEX_AUTHCHECKER_ENFORCE_ENV] ?? '').trim().toLowerCase();
  return raw === 'true' || raw === '1';
}

// -----------------------------------------------------------------------------
// Would-deny classification + metric
// -----------------------------------------------------------------------------

/**
 * Finite set of reasons enforcement WOULD deny an operation. Used as the sole
 * label on {@link cortexAuthCheckerWouldDenyTotal}.
 */
export type WouldDenyReason = 'unauthenticated' | 'insufficient_role';

/**
 * Counts EVERY AuthChecker invocation, regardless of outcome (audit
 * B01-backend-legacy-07). A flat-zero {@link cortexAuthCheckerWouldDenyTotal}
 * is ambiguous on its own: it can mean "no traffic would be denied" OR "the
 * checker never ran" (no `@Authorized()` field was ever executed) — exactly the
 * false-confidence pattern that preceded the beta-net-cap fail-open. Graduation
 * rule: enforce only when this counter is > 0 and the would-deny series has
 * been observed over a full trading week.
 */
export const cortexAuthCheckerEvaluationsTotal = new Counter({
  name: 'cortex_authchecker_evaluations_total',
  help: 'Total AuthChecker invocations, any outcome (zero means no @Authorized field was executed — distinct from "no would-denies")',
  registers: [metricsRegistry],
});

/**
 * Counts operations that resolver-level authorization WOULD deny. In shadow mode
 * this is the primary signal proving whether flipping `CORTEX_AUTHCHECKER_ENFORCE`
 * to `enforce` would reject any legitimate platform or engine traffic. Labelled
 * by the discriminated {@link WouldDenyReason}.
 */
export const cortexAuthCheckerWouldDenyTotal = new Counter({
  name: 'cortex_authchecker_would_deny_total',
  help: 'Operations resolver-level authorization would deny, by reason (counted in shadow mode without denying)',
  labelNames: ['reason'] as const,
  registers: [metricsRegistry],
});

/** The outcome of evaluating whether an operation would be allowed. */
interface AuthEvaluation {
  readonly wouldAllow: boolean;
  /** Populated only when `wouldAllow` is `false`. */
  readonly reason?: WouldDenyReason;
}

/**
 * Pure evaluation of whether a principal would satisfy the required roles for an
 * operation. Performs no I/O and no logging.
 *
 * @param principal - The verified principal, or `null` for an unauthenticated caller.
 * @param requiredRoles - Roles declared on the field's `@Authorized(...)` decorator
 *   (empty when the field only requires authentication).
 * @returns The {@link AuthEvaluation}.
 */
export function evaluateWouldAllow(
  principal: BackendPrincipal | null,
  requiredRoles: readonly string[]
): AuthEvaluation {
  if (!principal) {
    return { wouldAllow: false, reason: 'unauthenticated' };
  }

  // Server-to-server callers are unconditionally allowed and bypass role gates.
  if (principal.kind === 'server') {
    return { wouldAllow: true };
  }

  // Authenticated user/admin with no specific role requirement -> allowed.
  if (requiredRoles.length === 0) {
    return { wouldAllow: true };
  }

  const principalRoles =
    principal.kind === 'admin'
      ? [...principal.roles, ADMIN_ROLE]
      : principal.roles;
  const roleSet = new Set(principalRoles);
  const hasRequiredRole = requiredRoles.some((role) => roleSet.has(role));

  return hasRequiredRole
    ? { wouldAllow: true }
    : { wouldAllow: false, reason: 'insufficient_role' };
}

// -----------------------------------------------------------------------------
// AuthChecker
// -----------------------------------------------------------------------------

/**
 * GraphQL context shape this checker reads. `principal` is the verified
 * `BackendPrincipal` attached to the context in `server.ts` (`null` for an
 * unauthenticated caller).
 */
export interface CortexAuthContext {
  principal?: BackendPrincipal | null;
}

/** Describe an operation for structured logs, without leaking arguments. */
function describeOperation(
  resolverData: ResolverData<CortexAuthContext>
): { operationType: string; operationName: string; field: string } {
  const { info } = resolverData;
  return {
    operationType: info.operation.operation,
    operationName: info.operation.name?.value ?? info.fieldName,
    field: info.fieldName,
  };
}

/**
 * The CORTEX-P0-001 AuthChecker. Register via
 * `buildSchema({ authChecker: cortexAuthChecker })`.
 *
 * SHADOW (default): a would-deny operation increments
 * {@link cortexAuthCheckerWouldDenyTotal}, emits a warn log, and RETURNS TRUE —
 * no behaviour change. ENFORCE (`CORTEX_AUTHCHECKER_ENFORCE=true`): a would-deny
 * operation is logged, the counter is incremented, and the checker RETURNS FALSE
 * (fail closed). Operations that would be allowed always return `true` with no
 * metric or log emission.
 */
export const cortexAuthChecker: AuthChecker<CortexAuthContext> = (
  resolverData,
  roles
): boolean => {
  // Unconditional: proves the checker is actually reachable (see
  // cortexAuthCheckerEvaluationsTotal TSDoc / audit B01-backend-legacy-07).
  cortexAuthCheckerEvaluationsTotal.inc();

  const principal = resolverData.context.principal ?? null;
  const evaluation = evaluateWouldAllow(principal, roles);

  if (evaluation.wouldAllow) {
    return true;
  }

  const reason = evaluation.reason ?? 'unauthenticated';
  const enforced = isAuthCheckerEnforced();
  const operation = describeOperation(resolverData);

  cortexAuthCheckerWouldDenyTotal.inc({ reason });
  logger.warn(
    enforced
      ? '[cortex-authchecker] denying operation (enforce)'
      : '[cortex-authchecker] shadow would-deny (allowing)',
    {
      ...operation,
      reason,
      enforced,
      principalKind: principal?.kind ?? 'none',
      requiredRoles: [...roles],
    }
  );

  return !enforced;
};

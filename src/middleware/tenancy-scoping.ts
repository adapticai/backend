/**
 * Row-level tenancy-scoping middleware (SP2-G7 / SOC2 hardening).
 *
 * A TypeGraphQL global middleware that restricts the auto-generated CRUD
 * resolvers for the tenancy + notification models — Organization, OrgMembership,
 * Fund, FundAssignment, BrokerageAccount, NotificationEvent,
 * NotificationDelivery, NotificationPreference — to the rows a USER-scoped
 * caller is entitled to.
 *
 * CRITICAL SAFETY CONTRACT: service (`SERVER_AUTH_TOKEN`) and admin principals
 * — and, on the staged models, unauthenticated callers, which carry no user
 * identity — are bypassed before any scoping runs, in EVERY mode. The desk
 * models (`ALWAYS_ENFORCED_MODELS` in src/auth/tenancy-scope.ts) are the
 * exception: they are scoped in every mode and refuse an unauthenticated
 * caller with `UNAUTHENTICATED`. The engine and utils call these
 * resolvers with a server principal and MUST retain full unscoped access; this
 * middleware never narrows or denies a server/admin query.
 *
 * Behaviour is gated by `TENANCY_SCOPING_MODE` (default `shadow`), mirroring the
 * engine WS channel-auth shadow→enforce rollout:
 *
 *   - `off`     — returns immediately; no classification, no entitlement lookup.
 *   - `shadow`  — executes the resolver UNCHANGED, but emits a metric and a
 *     structured log for every access that `enforce` WOULD restrict or deny.
 *   - `enforce` — AND-injects the scope predicate into read `where` clauses and
 *     raises a `FORBIDDEN` GraphQL error on cross-tenant create/upsert.
 *
 * The middleware runs on every resolver in the schema, so its first action is a
 * cheap guard: it only engages for root Query/Mutation fields whose name maps
 * to a governed model (nested relation resolvers and non-governed models return
 * immediately).
 *
 * Known scope boundary (tracked as a follow-up): scoping is applied at the root
 * operation only. A governed model reached transitively through a NON-governed
 * root (e.g. `User.orgMemberships`) is not re-scoped here; that residual vector
 * is closed by the forthcoming resolver-level `AuthChecker` (CORTEX-P0-001) and
 * by the platform's app-side authorization. The direct cross-tenant root
 * read/mutation vector called out in SP2-G7 is what this middleware closes.
 */

import type { MiddlewareFn } from 'type-graphql';
import { GraphQLError } from 'graphql';
import type { BackendPrincipal } from '../auth/token-verifier';
import {
  buildScopeWhere,
  buildWriteScopeWhere,
  classifyGovernedField,
  evaluateAccess,
  getTenancyScopingMode,
  hasCreateParent,
  injectScopeWhere,
  isAlwaysEnforced,
  parentScopedCreateInScope,
  resolveEntitlement,
  type AccessAssessment,
  type EntitlementPrismaClient,
  type Entitlement,
  type GovernedField,
  type ParentScopePrismaClient,
  type TenancyScopingMode,
  type WhereFragment,
} from '../auth/tenancy-scope';
import { tenancyScopingDecisionsTotal } from '../config/metrics';
import { logger } from '../utils/logger';

/**
 * GraphQL context shape this middleware reads. `principal` is the verified
 * `BackendPrincipal` (added to the context in `server.ts`); `prisma` is the
 * request-scoped Prisma client the generated resolvers already rely on. The
 * memoised entitlement promise is cached on the context for the request.
 */
export interface TenancyScopingContext {
  principal?: BackendPrincipal | null;
  prisma?: unknown;
  /** @internal per-request memoised entitlement resolution. */
  __tenancyEntitlement?: Promise<Entitlement>;
}

/**
 * Build a `FORBIDDEN` GraphQL error for a denied cross-tenant mutation. The
 * `http.status: 403` is honoured by the `http-status-mapper` plugin.
 */
function forbidden(message: string): GraphQLError {
  return new GraphQLError(message, {
    extensions: { code: 'FORBIDDEN', http: { status: 403 } },
  });
}

/** An `UNAUTHENTICATED` GraphQL error (HTTP 401) for an always-enforced model. */
function unauthenticated(model: string): GraphQLError {
  return new GraphQLError(`Unauthenticated: ${model} requires a verified principal`, {
    extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
  });
}

/**
 * For a create the payload cannot prove in scope on its own (a model scoped
 * by a parent row, such as an Ada message by its conversation), read the
 * parent under the caller's write scope. Any other assessment is returned as is.
 */
async function withParentScope(
  governed: GovernedField,
  assessment: AccessAssessment,
  args: { data?: unknown },
  context: TenancyScopingContext,
  entitlement: Entitlement
): Promise<AccessAssessment> {
  if (governed.opKind !== 'createScope' || assessment.decision !== 'deny') return assessment;
  if (!hasCreateParent(governed.model)) return assessment;
  const prisma = context.prisma as ParentScopePrismaClient | undefined;
  if (!prisma) return assessment;
  return (await parentScopedCreateInScope(prisma, governed.model, args.data, entitlement))
    ? { decision: 'allow', reason: 'create_parent_in_scope' }
    : assessment;
}

/**
 * Resolve (and memoise for the request) the caller's entitlement. Throws when
 * the Prisma client is missing from the context so callers can fail closed
 * under enforcement.
 */
function getEntitlement(
  context: TenancyScopingContext,
  userId: string
): Promise<Entitlement> {
  if (!context.__tenancyEntitlement) {
    const prisma = context.prisma as EntitlementPrismaClient | undefined;
    context.__tenancyEntitlement = prisma
      ? resolveEntitlement(prisma, userId)
      : Promise.reject(
          new Error('tenancy scoping: Prisma client missing from context')
        );
  }
  return context.__tenancyEntitlement;
}

/** Options for {@link createTenancyScopingMiddleware}, primarily for tests. */
export interface TenancyScopingMiddlewareOptions {
  /** Override the mode resolver (defaults to reading `TENANCY_SCOPING_MODE`). */
  modeProvider?: () => TenancyScopingMode;
}

/**
 * Create the TypeGraphQL global middleware enforcing row-level tenancy scoping.
 *
 * @param options - Optional overrides (mode provider) for testing.
 * @returns A {@link MiddlewareFn} to register via `buildSchema({ globalMiddlewares })`.
 */
export function createTenancyScopingMiddleware(
  options: TenancyScopingMiddlewareOptions = {}
): MiddlewareFn<TenancyScopingContext> {
  const resolveMode = options.modeProvider ?? getTenancyScopingMode;

  return async ({ context, args, info }, next) => {
    // `next` is typed `() => Promise<any>` by type-graphql. Widen it once to a
    // typed pass-through so returning it downstream is not an unsafe-any return.
    const proceed = (): Promise<unknown> => next() as Promise<unknown>;

    // Only the root Query/Mutation entry points are scoped. Nested relation
    // resolvers (parentType is a model) and every non-governed field short out
    // here — the cheapest possible path for the hot resolver stack.
    const parentTypeName = info.parentType?.name;
    if (parentTypeName !== 'Query' && parentTypeName !== 'Mutation') {
      return proceed();
    }
    const governed = classifyGovernedField(info.fieldName);
    if (!governed) return proceed();

    // An always-enforced (desk) model is scoped whatever the configured mode;
    // see ALWAYS_ENFORCED_MODELS for why it has no shadow or off state.
    const alwaysEnforced = isAlwaysEnforced(governed.model);
    const mode: TenancyScopingMode = alwaysEnforced ? 'enforce' : resolveMode();
    if (mode === 'off') return proceed();

    // Principal gate: service/admin callers are NEVER scoped. An
    // unauthenticated caller carries no identity to scope by: it passes on the
    // staged models and is refused on the always-enforced ones.
    const principal = context.principal;
    if (!principal) {
      if (alwaysEnforced) {
        tenancyScopingDecisionsTotal.inc({
          mode,
          model: governed.model,
          operation: info.fieldName,
          decision: 'deny',
        });
        throw unauthenticated(governed.model);
      }
      return proceed();
    }
    if (principal.kind === 'server' || principal.kind === 'admin') {
      return proceed();
    }

    // From here the principal is user-scoped.
    const userId = principal.sub;

    let entitlement: Entitlement;
    try {
      entitlement = await getEntitlement(context, userId);
    } catch (error) {
      // Fail closed under enforcement; in shadow, log and let the query run
      // unchanged so a transient resolution failure never blocks traffic while
      // we are still proving the rollout.
      const detail = error instanceof Error ? error.message : String(error);
      if (mode === 'enforce') {
        logger.error(
          '[tenancy-scope] enforce: entitlement resolution failed — denying',
          { model: governed.model, operation: info.fieldName, userId, detail }
        );
        tenancyScopingDecisionsTotal.inc({
          mode,
          model: governed.model,
          operation: info.fieldName,
          decision: 'deny',
        });
        throw forbidden('Access denied: tenancy entitlement unavailable');
      }
      logger.warn(
        '[tenancy-scope] shadow: entitlement resolution failed — allowing',
        { model: governed.model, operation: info.fieldName, userId, detail }
      );
      return proceed();
    }

    const assessment = await withParentScope(
      governed,
      evaluateAccess(
        governed,
        args as { where?: unknown; data?: unknown; create?: unknown },
        entitlement
      ),
      args as { data?: unknown },
      context,
      entitlement
    );

    tenancyScopingDecisionsTotal.inc({
      mode,
      model: governed.model,
      operation: info.fieldName,
      decision: assessment.decision,
    });

    // --- shadow: execute UNCHANGED, but log what enforce would do ------------
    if (mode === 'shadow') {
      if (assessment.decision !== 'allow') {
        logger.warn(
          '[tenancy-scope] shadow: enforce would restrict cross-tenant access',
          {
            model: governed.model,
            operation: info.fieldName,
            opKind: governed.opKind,
            decision: assessment.decision,
            reason: assessment.reason,
            userId,
            orgCount: entitlement.orgIds.length,
            fundCount: entitlement.fundIds.length,
          }
        );
      }
      return proceed();
    }

    // --- enforce -------------------------------------------------------------
    // A write (update, delete, upsert) is held to the write scope, which is
    // narrower than the read scope for models a member may read but only the
    // author may change (a shared Ada conversation).
    const scopeFor = parentTypeName === 'Mutation' ? buildWriteScopeWhere : buildScopeWhere;
    if (governed.opKind === 'whereScope') {
      const scoped = injectScopeWhere(
        (args.where as WhereFragment | undefined) ?? undefined,
        scopeFor(governed.model, entitlement)
      );
      (args as { where?: unknown }).where = scoped;
      return proceed();
    }

    // create/upsert
    if (assessment.decision === 'deny') {
      logger.warn('[tenancy-scope] enforce: denied cross-tenant mutation', {
        model: governed.model,
        operation: info.fieldName,
        opKind: governed.opKind,
        reason: assessment.reason,
        userId,
      });
      throw forbidden(
        `Access denied: ${governed.model} target is outside your organization`
      );
    }

    if (governed.opKind === 'upsertScope') {
      const scoped = injectScopeWhere(
        (args.where as WhereFragment | undefined) ?? undefined,
        scopeFor(governed.model, entitlement)
      );
      (args as { where?: unknown }).where = scoped;
    }

    return proceed();
  };
}

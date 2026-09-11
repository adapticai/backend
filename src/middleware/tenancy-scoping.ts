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
 * — and unauthenticated callers, which carry no user identity — are bypassed
 * before any scoping runs, in EVERY mode. The engine and utils call these
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
  classifyGovernedField,
  evaluateAccess,
  getTenancyScopingMode,
  injectScopeWhere,
  resolveEntitlement,
  type EntitlementPrismaClient,
  type Entitlement,
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

    const mode = resolveMode();
    if (mode === 'off') return proceed();

    // Only the root Query/Mutation entry points are scoped. Nested relation
    // resolvers (parentType is a model) and every non-governed field short out
    // here — the cheapest possible path for the hot resolver stack.
    const parentTypeName = info.parentType?.name;
    if (parentTypeName !== 'Query' && parentTypeName !== 'Mutation') {
      return proceed();
    }
    const governed = classifyGovernedField(info.fieldName);
    if (!governed) return proceed();

    // Principal gate: service/admin/unauthenticated callers are NEVER scoped.
    const principal = context.principal;
    if (
      !principal ||
      principal.kind === 'server' ||
      principal.kind === 'admin'
    ) {
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

    const assessment = evaluateAccess(
      governed,
      args as { where?: unknown; data?: unknown; create?: unknown },
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
    if (governed.opKind === 'whereScope') {
      const scoped = injectScopeWhere(
        (args.where as WhereFragment | undefined) ?? undefined,
        buildScopeWhere(governed.model, entitlement)
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
        buildScopeWhere(governed.model, entitlement)
      );
      (args as { where?: unknown }).where = scoped;
    }

    return proceed();
  };
}

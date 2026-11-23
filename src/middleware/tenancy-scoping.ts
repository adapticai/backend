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
import { GraphQLError, getNamedType, type GraphQLResolveInfo } from 'graphql';
import type { BackendPrincipal } from '../auth/token-verifier';
import {
  anonymousScopeWhere,
  buildScopeWhere,
  buildWriteScopeWhere,
  classifyGovernedField,
  evaluateAccess,
  getTenancyScopingMode,
  hasCreateParent,
  injectScopeWhere,
  investorRowVisible,
  isAlwaysEnforced,
  OFFICE_SCOPED_MODELS,
  parentScopedCreateInScope,
  resolveEntitlement,
  resolveOfficeScope,
  type AccessAssessment,
  type EntitlementPrismaClient,
  type Entitlement,
  type GovernedField,
  type OfficeScope,
  type OfficeScopePrismaClient,
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
  /** @internal per-request memoised office (entity) scope resolution. */
  __tenancyOfficeScope?: Promise<OfficeScope>;
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

/**
 * Resolve (and memoise for the request) the caller's office scope. Throws
 * when the Prisma client is missing, so the caller fails closed.
 */
function getOfficeScope(
  context: TenancyScopingContext,
  userId: string,
  now: () => Date
): Promise<OfficeScope> {
  if (!context.__tenancyOfficeScope) {
    const prisma = context.prisma as OfficeScopePrismaClient | undefined;
    context.__tenancyOfficeScope = prisma
      ? resolveOfficeScope(prisma, userId, now())
      : Promise.reject(new Error('tenancy scoping: Prisma client missing from context'));
  }
  return context.__tenancyOfficeScope;
}

/**
 * The `Investor` columns an office's entity carries that no row before
 * offices had: which office owns it, where it sits in the office's tree, and
 * its registration number. A filter or ordering on them from outside an
 * investor-scoped root would let a caller probe an entity they cannot read
 * (`holdings(where: { investor: { is: { registrationNumber: … } } })`), so a
 * user or anonymous caller may not name them there.
 */
const OFFICE_ENTITY_FILTER_KEYS: ReadonlySet<string> = new Set([
  'officeOrganizationId',
  'officeOrganization',
  'parentInvestorId',
  'parentInvestor',
  'registrationNumber',
]);

/**
 * The roots whose scope is the investor scope itself (an entity, or one of its
 * records through its entity): a filter on an office entity's columns there is
 * ANDed with that scope, so it matches only rows the reader may see.
 */
const INVESTOR_SCOPED_ROOT_MODELS: ReadonlySet<string> = new Set([
  'Investor',
  'Holding',
  'InvestorTransaction',
  'InvestorDocument',
  'TaxDocument',
]);

/** Whether a GraphQL input type filters or orders `Investor` rows. */
function isInvestorFilterType(name: string): boolean {
  return name === 'InvestorWhereInput' || name.startsWith('InvestorOrderBy');
}

/**
 * Whether a root field's arguments filter or order `Investor` rows by an
 * {@link OFFICE_ENTITY_FILTER_KEYS} column anywhere in their tree. Walks the
 * argument values against their declared input types, so a key is only
 * matched where it is an `Investor` column.
 */
export function namesOfficeEntityColumn(
  info: Pick<GraphQLResolveInfo, 'parentType' | 'fieldName'>,
  args: Record<string, unknown>
): boolean {
  // A parent type that is not a GraphQL object type has no declared arguments to walk.
  if (typeof info.parentType?.getFields !== 'function') return false;
  const field = info.parentType.getFields()[info.fieldName];
  if (!field) return false;
  const visit = (type: unknown, value: unknown): boolean => {
    if (value === null || value === undefined || typeof value !== 'object') return false;
    const named = getNamedType(type as Parameters<typeof getNamedType>[0]);
    if (!named || !('getFields' in named) || typeof named.getFields !== 'function') return false;
    const items: unknown[] = Array.isArray(value) ? value : [value];
    const fields = named.getFields() as Record<string, { type: unknown }>;
    return items.some((item) => {
      if (item === null || typeof item !== 'object') return false;
      const record = item as Record<string, unknown>;
      return Object.keys(record).some((key) => {
        if (record[key] === undefined) return false;
        if (isInvestorFilterType(named.name) && OFFICE_ENTITY_FILTER_KEYS.has(key)) return true;
        const child = fields[key];
        return child !== undefined && visit(child.type, record[key]);
      });
    });
  };
  return field.args.some((arg) => visit(arg.type, args[arg.name]));
}

/** Options for {@link createTenancyScopingMiddleware}, primarily for tests. */
export interface TenancyScopingMiddlewareOptions {
  /** Override the mode resolver (defaults to reading `TENANCY_SCOPING_MODE`). */
  modeProvider?: () => TenancyScopingMode;
  /** The clock auditor grants are judged at (defaults to the wall clock). */
  now?: () => Date;
}

/**
 * Serve a relation's `Investor` result only as far as the reader may see it:
 * a list keeps its visible rows, a single row the reader may not see is
 * `null`. Service and admin callers are never narrowed.
 */
async function visibleInvestorRelation(
  context: TenancyScopingContext,
  now: () => Date,
  proceed: () => Promise<unknown>
): Promise<unknown> {
  const principal = context.principal;
  if (principal && (principal.kind === 'server' || principal.kind === 'admin')) return proceed();
  const result = await proceed();
  if (result === null || result === undefined) return result;
  const rows: unknown[] = Array.isArray(result) ? result : [result];
  const hasOfficeRow = rows.some(
    (row) => row !== null && typeof row === 'object' && (row as { officeOrganizationId?: unknown }).officeOrganizationId !== null
  );
  // Rows no office owns are served as before, without resolving any scope.
  if (!hasOfficeRow) return result;
  let office: OfficeScope | null = null;
  if (principal) {
    try {
      office = await getOfficeScope(context, principal.sub, now);
    } catch (error) {
      logger.error('[tenancy-scope] office scope unavailable — withholding office entities', {
        userId: principal.sub,
        detail: error instanceof Error ? error.message : String(error),
      });
      office = null;
    }
  }
  const visible = (row: unknown): boolean =>
    row !== null && typeof row === 'object' && investorRowVisible(row as Record<string, unknown>, office);
  tenancyScopingDecisionsTotal.inc({ mode: 'enforce', model: 'Investor', operation: 'relation', decision: 'restrict' });
  if (Array.isArray(result)) return result.filter(visible);
  return visible(result) ? result : null;
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
  const now = options.now ?? ((): Date => new Date());

  return async ({ context, args, info }, next) => {
    // `next` is typed `() => Promise<any>` by type-graphql. Widen it once to a
    // typed pass-through so returning it downstream is not an unsafe-any return.
    const proceed = (): Promise<unknown> => next() as Promise<unknown>;

    // Only the root Query/Mutation entry points are scoped, with one
    // exception: a relation that returns `Investor` rows (an organization's
    // investors, a holding's investor, an entity's parent) is narrowed to the
    // rows the reader may see, so an office's entity is never served around
    // the root scope. Every other nested resolver and every non-governed
    // field short out here — the cheapest possible path for the hot resolver
    // stack.
    const parentTypeName = info.parentType?.name;
    if (parentTypeName !== 'Query' && parentTypeName !== 'Mutation') {
      if (info.returnType !== undefined && getNamedType(info.returnType).name === 'Investor') {
        return visibleInvestorRelation(context, now, proceed);
      }
      // A nested field with arguments (a relation's `where`, a `_count`
      // field's `where`) is held to the same filter rule as a root: counting
      // an organization's investors by registration number would probe an
      // entity the reader cannot see.
      if (args !== undefined && args !== null && Object.keys(args).length > 0) {
        const caller = context.principal;
        const privileged = caller?.kind === 'server' || caller?.kind === 'admin';
        if (!privileged && namesOfficeEntityColumn(info, args as Record<string, unknown>)) {
          tenancyScopingDecisionsTotal.inc({ mode: 'enforce', model: 'Investor', operation: info.fieldName, decision: 'deny' });
          throw forbidden("Access denied: an office entity's columns are filtered only through the investor reads");
        }
      }
      return proceed();
    }
    const governed = classifyGovernedField(info.fieldName);
    // Outside the investor-scoped roots, whose scope already holds every
    // filter to the rows the reader may see, a user or anonymous caller may
    // not filter or order by an office entity's columns (see
    // OFFICE_ENTITY_FILTER_KEYS). Decided in every mode: the columns were born
    // after the guard, so no existing caller names them.
    if (governed === null || !INVESTOR_SCOPED_ROOT_MODELS.has(governed.model)) {
      const caller = context.principal;
      const privileged = caller?.kind === 'server' || caller?.kind === 'admin';
      if (!privileged && namesOfficeEntityColumn(info, (args ?? {}) as Record<string, unknown>)) {
        tenancyScopingDecisionsTotal.inc({
          mode: 'enforce',
          model: 'Investor',
          operation: info.fieldName,
          decision: 'deny',
        });
        throw forbidden("Access denied: an office entity's columns are filtered only through the investor reads");
      }
    }
    if (!governed) return proceed();

    // An always-enforced (desk) model is scoped whatever the configured mode;
    // see ALWAYS_ENFORCED_MODELS for why it has no shadow or off state.
    const alwaysEnforced = isAlwaysEnforced(governed.model);
    const mode: TenancyScopingMode = alwaysEnforced ? 'enforce' : resolveMode();
    if (mode === 'off') return proceed();

    // Principal gate: service/admin callers are NEVER scoped. An
    // unauthenticated caller carries no identity to scope by: a model with an
    // anonymous scope (the SYSTEM strategies) narrows it to that scope, the
    // staged models pass it, and the always-enforced ones refuse it.
    const principal = context.principal;
    if (!principal) {
      const anonymousScope = anonymousScopeWhere(governed.model);
      if (anonymousScope !== null && governed.opKind === 'whereScope') {
        tenancyScopingDecisionsTotal.inc({
          mode,
          model: governed.model,
          operation: info.fieldName,
          decision: 'restrict',
        });
        (args as { where?: unknown }).where = injectScopeWhere(
          (args.where as WhereFragment | undefined) ?? undefined,
          anonymousScope
        );
        return proceed();
      }
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
    let office: OfficeScope | undefined;
    if (OFFICE_SCOPED_MODELS.has(governed.model)) {
      try {
        office = await getOfficeScope(context, userId, now);
      } catch (error) {
        logger.error('[tenancy-scope] enforce: office scope resolution failed — denying', {
          model: governed.model,
          operation: info.fieldName,
          userId,
          detail: error instanceof Error ? error.message : String(error),
        });
        throw forbidden('Access denied: office scope unavailable');
      }
    }
    if (governed.opKind === 'whereScope') {
      const scoped = injectScopeWhere(
        (args.where as WhereFragment | undefined) ?? undefined,
        scopeFor(governed.model, entitlement, office)
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
        scopeFor(governed.model, entitlement, office)
      );
      (args as { where?: unknown }).where = scoped;
    }

    return proceed();
  };
}

/**
 * Mutation authorization — pure decision logic.
 *
 * ## Why this exists
 *
 * The `/graphql` context admits a request with no bearer token as a null
 * principal (context-level enforcement is staged per
 * `docs/security/2026-08-23-graphql-auth-enforcement-runbook.md`), and the
 * generated typegraphql-prisma resolvers expose a create / update / upsert /
 * delete mutation for every model. Together that let any caller who can reach
 * the endpoint rewrite the system of record — including the
 * `TradingPolicy.realtimeTradingEnabled` flag that arms a LIVE brokerage
 * account — with nothing recording who did it.
 *
 * A write is authorised by WHO is asking and WHAT they are writing, so the
 * decision needs both the verified principal and the model the mutation lands
 * on. This module owns that decision; `src/middleware/mutation-auth-guard.ts`
 * wires it into the request lifecycle and supplies the database facts
 * (account ownership) the decision needs.
 *
 * ## Who may write what
 *
 * - `server` (the engine's service JWT, or the static server token) and
 *   `admin` may run every mutation. The engine is the system's own writer.
 * - `user` may write only where the product has an ownership model:
 *   - `account_owned` — `TradingPolicy` and `AlpacaAccount`: the account must
 *     belong to the caller, or be bound to a fund the caller is entitled to
 *     (the same OrgMembership / FundAssignment entitlement the tenancy scoping
 *     uses). Bulk actions are never user-writable: a `where` filter over many
 *     accounts has no single owner to check.
 *   - `self` — `User`: only the caller's own row, and only its profile and
 *     onboarding fields (`./user-write-content.ts`).
 *   - `tenant_scoped` — the tenancy-governed models: the row (for an update,
 *     upsert or delete) or the payload's tenant (for a create) must lie in the
 *     caller's OrgMembership / FundAssignment entitlement. The guard checks
 *     this itself, whatever `TENANCY_SCOPING_MODE` says, because fund
 *     entitlement is what authorises `account_owned` writes on fund-bridged
 *     accounts: a scope that only observes would let a caller mint the
 *     entitlement it is then checked against.
 *   - `authenticated` — user-authored content with no finer ownership model
 *     yet, restricted per model to the actions the platform performs, and for
 *     `AuditLog` and `Configuration` to content a user may author
 *     (`./user-write-content.ts`).
 *   - `resolver_authorized` — custom mutations whose resolver performs its own
 *     authorization.
 *   - everything else is `service_only`.
 * - no principal may run no mutation.
 *
 * Nested relation writes are decided hop by hop in `./nested-write-policy.ts`.
 *
 * ## Modes
 *
 * `MUTATION_AUTH_MODE`: `shadow` (count, log and audit what enforcement would
 * deny, change nothing) is the value an UNSET variable resolves to, so the
 * first deploy changes no behaviour and the would-deny series can be read
 * before anything is refused. `enforce` refuses. `off` disables the decision.
 * A value that is SET but unrecognised resolves to `enforce`: an operator who
 * tried to configure the guard and mistyped it must get a guard that refuses,
 * not one that silently observes.
 *
 * `MUTATION_AUTH_ENFORCE_MODELS` (comma-separated model names) escalates the
 * listed models to `enforce` while the global mode is `shadow`, so the
 * capital-bearing models can be contained before every browser-side platform
 * write has migrated to a verified principal. Two rules keep an escalation
 * from being bypassed:
 *
 * - a mutation is decided at the STRICTEST mode among its root model and
 *   every model its nested writes reach, so `updateOneUser → alpacaAccounts →
 *   tradingPolicy` is enforced when TradingPolicy is;
 * - escalating an account model (`TradingPolicy`, `AlpacaAccount`) escalates
 *   the entitlement-source models (`OrgMembership`, `FundAssignment`, `Fund`,
 *   `BrokerageAccount`) with it, because the account rule admits a caller on
 *   fund entitlement read from those rows.
 *
 * @module auth/mutation-authorization
 */

import type { BackendPrincipal } from './token-verifier';
import { GOVERNED_MODELS } from './tenancy-scope';

/** Operating mode of the mutation guard. See the module doc. */
export type MutationAuthMode = 'off' | 'shadow' | 'enforce';

/** Environment variable selecting the global mode. */
export const MUTATION_AUTH_MODE_ENV = 'MUTATION_AUTH_MODE';

/** Environment variable listing models escalated to `enforce`. */
export const MUTATION_AUTH_ENFORCE_MODELS_ENV = 'MUTATION_AUTH_ENFORCE_MODELS';

/**
 * Resolve the global mode. Unset or blank → `shadow`; a recognised value →
 * itself; anything else → `enforce`.
 *
 * @param env - Environment source; injectable for tests.
 * @returns The resolved {@link MutationAuthMode}.
 */
export function getMutationAuthMode(
  env: Record<string, string | undefined> = process.env
): MutationAuthMode {
  const raw = (env[MUTATION_AUTH_MODE_ENV] ?? '').trim().toLowerCase();
  if (raw.length === 0) return 'shadow';
  if (raw === 'off' || raw === 'shadow' || raw === 'enforce') return raw;
  return 'enforce';
}

/**
 * The models escalated to `enforce` by {@link MUTATION_AUTH_ENFORCE_MODELS_ENV}.
 *
 * @param env - Environment source; injectable for tests.
 * @returns The set of model names (exact, case-sensitive Prisma names).
 */
export function getEnforcedModels(
  env: Record<string, string | undefined> = process.env
): ReadonlySet<string> {
  const raw = env[MUTATION_AUTH_ENFORCE_MODELS_ENV] ?? '';
  return new Set(
    raw
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0)
  );
}

/** The models whose user writes are authorised by row ownership or fund entitlement. */
export const ACCOUNT_MODELS: readonly string[] = ['TradingPolicy', 'AlpacaAccount'];

/**
 * The models fund entitlement and the fund-to-account bridge are read from:
 * `resolveEntitlement` reads OrgMembership, Fund and FundAssignment, and a
 * BrokerageAccount binds an AlpacaAccount to its fund.
 */
export const ENTITLEMENT_SOURCE_MODELS: readonly string[] = [
  'OrgMembership',
  'FundAssignment',
  'Fund',
  'BrokerageAccount',
];

/**
 * The escalation list with its implied members: an escalated account model
 * brings every entitlement-source model with it.
 */
export function expandEnforcedModels(enforcedModels: ReadonlySet<string>): ReadonlySet<string> {
  if (!ACCOUNT_MODELS.some((model) => enforcedModels.has(model))) return enforcedModels;
  return new Set([...enforcedModels, ...ENTITLEMENT_SOURCE_MODELS]);
}

/**
 * The mode a mutation is decided in. `off` is a kill switch and wins; a
 * global `enforce` covers every model; under `shadow`, the mutation enforces
 * when ANY model it writes — the root or one reached by a nested write — is
 * escalated (directly, or through {@link expandEnforcedModels}).
 *
 * @param models - The root model and every nested write's model.
 * @param mode - The global mode.
 * @param enforcedModels - The escalation list as configured.
 */
export function effectiveModeFor(
  models: readonly string[],
  mode: MutationAuthMode,
  enforcedModels: ReadonlySet<string>
): MutationAuthMode {
  if (mode === 'off' || mode === 'enforce') return mode;
  const escalated = expandEnforcedModels(enforcedModels);
  return models.some((model) => escalated.has(model)) ? 'enforce' : 'shadow';
}

// -----------------------------------------------------------------------------
// Mutation field classification
// -----------------------------------------------------------------------------

/** What a generated mutation does to its model. */
export type MutationAction = 'create' | 'update' | 'upsert' | 'delete';

/** Whether the mutation addresses one row (by a unique `where`) or many. */
export type MutationCardinality = 'one' | 'many';

/** A mutation root field resolved onto its model. */
export interface MutationTarget {
  /** Prisma model name, or `custom:<field>` for a hand-written mutation. */
  readonly model: string;
  readonly action: MutationAction | 'custom';
  readonly cardinality: MutationCardinality;
  readonly fieldName: string;
}

/**
 * Generated mutation prefixes, longest first so `createManyAndReturn` is not
 * read as `createMany` + a model named `AndReturn…`.
 */
const GENERATED_PREFIXES: ReadonlyArray<
  readonly [string, MutationAction, MutationCardinality]
> = [
  ['createManyAndReturn', 'create', 'many'],
  ['updateManyAndReturn', 'update', 'many'],
  ['createMany', 'create', 'many'],
  ['updateMany', 'update', 'many'],
  ['deleteMany', 'delete', 'many'],
  ['createOne', 'create', 'one'],
  ['updateOne', 'update', 'one'],
  ['upsertOne', 'upsert', 'one'],
  ['deleteOne', 'delete', 'one'],
];

/**
 * Resolve a root mutation field name onto its model and action. A field that
 * is not `<prefix><KnownModel>` is a custom mutation.
 *
 * @param fieldName - `info.fieldName` of a root Mutation field.
 * @param models - Every Prisma model name.
 */
export function classifyMutationField(
  fieldName: string,
  models: ReadonlySet<string>
): MutationTarget {
  for (const [prefix, action, cardinality] of GENERATED_PREFIXES) {
    if (!fieldName.startsWith(prefix)) continue;
    const model = fieldName.slice(prefix.length);
    if (models.has(model)) return { model, action, cardinality, fieldName };
  }
  return { model: `custom:${fieldName}`, action: 'custom', cardinality: 'one', fieldName };
}

// -----------------------------------------------------------------------------
// Write policy
// -----------------------------------------------------------------------------

/** How a `user` principal may write a model. See the module doc. */
export type UserWritePolicy =
  | 'service_only'
  | 'account_owned'
  | 'self'
  | 'tenant_scoped'
  | 'authenticated'
  | 'resolver_authorized';

/** A model's user policy plus the actions a user may perform under it. */
export interface ModelWriteRule {
  readonly policy: UserWritePolicy;
  /** Actions a user may perform; absent means every action. */
  readonly userActions?: ReadonlySet<MutationAction | 'custom'>;
}

const ONLY = (...actions: Array<MutationAction | 'custom'>): ReadonlySet<MutationAction | 'custom'> =>
  new Set(actions);

/**
 * Explicit user-write rules. Every model absent here is `service_only`.
 *
 * The `authenticated` rows are the writes the platform's server routes make
 * as the signed-in user today (see the caller inventory in
 * `docs/security/2026-09-24-mutation-authorization-runbook.md`), narrowed to
 * the actions those routes perform. Each is a model with no finer ownership
 * model yet; tightening one to an ownership rule is a follow-up, never a
 * reason to widen another.
 */
export const MODEL_WRITE_RULES: ReadonlyMap<string, ModelWriteRule> = new Map<
  string,
  ModelWriteRule
>([
  ['TradingPolicy', { policy: 'account_owned', userActions: ONLY('create', 'update', 'upsert') }],
  ['AlpacaAccount', { policy: 'account_owned', userActions: ONLY('create', 'update') }],
  ['User', { policy: 'self', userActions: ONLY('update') }],
  ...GOVERNED_MODELS.map(
    (model): [string, ModelWriteRule] => [model, { policy: 'tenant_scoped' }]
  ),
  ['Configuration', { policy: 'authenticated', userActions: ONLY('upsert') }],
  ['DashboardLayout', { policy: 'authenticated', userActions: ONLY('upsert') }],
  ['Mandate', { policy: 'authenticated', userActions: ONLY('create', 'update') }],
  ['MandateVersion', { policy: 'authenticated', userActions: ONLY('update') }],
  ['MandateApproval', { policy: 'authenticated', userActions: ONLY('create') }],
  ['Alert', { policy: 'authenticated', userActions: ONLY('update') }],
  ['AuditLog', { policy: 'authenticated', userActions: ONLY('create') }],
  ['Customer', { policy: 'authenticated', userActions: ONLY('update') }],
  ['InvestorTransaction', { policy: 'authenticated', userActions: ONLY('update') }],
  ['custom:updateOrgTradingDefaults', { policy: 'resolver_authorized' }],
  ['custom:updateFundTradingOverrides', { policy: 'resolver_authorized' }],
]);

const SERVICE_ONLY: ModelWriteRule = { policy: 'service_only' };

/** The write rule for a model. */
export function ruleFor(model: string): ModelWriteRule {
  return MODEL_WRITE_RULES.get(model) ?? SERVICE_ONLY;
}

// -----------------------------------------------------------------------------
// Decision
// -----------------------------------------------------------------------------

/** Why a mutation was admitted or refused. A bounded metric label. */
export type MutationAuthReason =
  | 'guard_off'
  | 'guard_error'
  | 'service_principal'
  | 'admin_principal'
  | 'account_owner'
  | 'account_fund_entitled'
  | 'self'
  | 'tenant_scoped'
  | 'authenticated_user_model'
  | 'resolver_authorized'
  | 'unauthenticated'
  | 'model_not_user_writable'
  | 'action_not_user_writable'
  | 'bulk_not_user_writable'
  | 'not_account_owner'
  | 'account_unresolved'
  | 'not_self'
  | 'tenant_out_of_scope'
  | 'tenant_unresolved'
  | 'field_not_user_writable'
  | 'reserved_audit_source'
  | 'audit_actor_mismatch'
  | 'config_key_not_user_scoped'
  | 'nested_write_not_user_writable'
  | 'nested_entitlement_write';

/** Ownership facts the middleware resolved for an `account_owned` write. */
export type AccountOwnership =
  | { readonly kind: 'owner' }
  | { readonly kind: 'fund_entitled' }
  | { readonly kind: 'other' }
  | { readonly kind: 'unresolved' };

/** For a `tenant_scoped` write: whether the row or payload lies in the caller's entitlement. */
export type TenantScope = 'in_scope' | 'out_of_scope';

/** Everything the decision needs beyond the principal and target. */
export interface MutationFacts {
  /** For `account_owned`: whether the caller owns every account touched. */
  readonly ownership?: AccountOwnership;
  /** For `self`: whether the `where` names the caller's own row. */
  readonly targetsSelf?: boolean;
  /** For `tenant_scoped`: the guard's own scope check; absent = not yet resolved. */
  readonly tenantScope?: TenantScope;
  /** The refusal from `./nested-write-policy.ts`, if any nested write is refused. */
  readonly nestedRefusal?: 'nested_write_not_user_writable' | 'nested_entitlement_write' | null;
  /** The refusal from `./user-write-content.ts`, if the payload's content is refused. */
  readonly contentRefusal?:
    | 'field_not_user_writable'
    | 'reserved_audit_source'
    | 'audit_actor_mismatch'
    | 'config_key_not_user_scoped'
    | null;
}

/** The decision for one mutation, before the mode is applied. */
export interface MutationAuthEvaluation {
  readonly allowed: boolean;
  readonly reason: MutationAuthReason;
  /** HTTP-shaped class of a refusal: no principal (401) or wrong one (403). */
  readonly refusal?: 'unauthenticated' | 'forbidden';
}

const allow = (reason: MutationAuthReason): MutationAuthEvaluation => ({ allowed: true, reason });
const forbid = (reason: MutationAuthReason): MutationAuthEvaluation => ({
  allowed: false,
  reason,
  refusal: 'forbidden',
});

/**
 * Decide whether a principal may run a mutation. Pure; performs no I/O.
 *
 * @param principal - The verified principal, or `null` for none.
 * @param target - The classified root mutation field.
 * @param facts - Ownership facts resolved by the caller (user principals only).
 */
export function evaluateMutationAccess(
  principal: BackendPrincipal | null,
  target: MutationTarget,
  facts: MutationFacts = {}
): MutationAuthEvaluation {
  if (!principal) {
    return { allowed: false, reason: 'unauthenticated', refusal: 'unauthenticated' };
  }
  if (principal.kind === 'server') return allow('service_principal');
  if (principal.kind === 'admin') return allow('admin_principal');

  const rule = ruleFor(target.model);
  if (rule.policy === 'service_only') return forbid('model_not_user_writable');
  if (rule.userActions && !rule.userActions.has(target.action)) {
    return forbid('action_not_user_writable');
  }
  if (target.cardinality === 'many') return forbid('bulk_not_user_writable');
  if (facts.nestedRefusal) return forbid(facts.nestedRefusal);
  if (facts.contentRefusal) return forbid(facts.contentRefusal);

  switch (rule.policy) {
    case 'account_owned': {
      const ownership = facts.ownership ?? { kind: 'unresolved' };
      if (ownership.kind === 'owner') return allow('account_owner');
      if (ownership.kind === 'fund_entitled') return allow('account_fund_entitled');
      if (ownership.kind === 'other') return forbid('not_account_owner');
      return forbid('account_unresolved');
    }
    case 'self':
      return facts.targetsSelf === true ? allow('self') : forbid('not_self');
    case 'tenant_scoped':
      if (facts.tenantScope === 'in_scope') return allow('tenant_scoped');
      if (facts.tenantScope === 'out_of_scope') return forbid('tenant_out_of_scope');
      return forbid('tenant_unresolved');
    case 'authenticated':
      return allow('authenticated_user_model');
    case 'resolver_authorized':
      return allow('resolver_authorized');
  }
}

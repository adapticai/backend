/**
 * Row-level tenancy scoping — pure domain logic (SP2-G7 / SOC2 hardening).
 *
 * The auto-generated typegraphql-prisma CRUD resolvers expose the org → fund →
 * brokerageAccount tenancy graph (and the notification pipeline) to ANY
 * authenticated principal with a caller-supplied `where` clause. App-side
 * authorization (platform `fund-authorization.ts`) does not protect direct
 * GraphQL calls, so a user-scoped JWT can read/mutate another org's rows.
 *
 * This module contains the transport-agnostic decision logic used by the
 * TypeGraphQL global middleware in `src/middleware/tenancy-scoping.ts`:
 *
 *   - {@link resolveEntitlement} — turns a `userId` into the set of org and
 *     fund ids the caller is entitled to, by reading their OrgMembership and
 *     FundAssignment rows.
 *   - {@link classifyGovernedField} — maps a generated resolver field name
 *     (e.g. `funds`, `updateOneBrokerageAccount`) to the governed model and
 *     operation kind, or `null` for anything not tenancy-governed.
 *   - {@link buildScopeWhere} — the Prisma `where` fragment restricting a read
 *     to entitled rows.
 *   - {@link injectScopeWhere} — AND-composes the scope fragment onto a
 *     caller-supplied `where`, preserving any top-level unique selector so
 *     `findUnique`/`update`/`delete` keep working (Prisma extendedWhereUnique).
 *   - {@link dataInScope} — whether a create/upsert payload lands in an
 *     entitled tenant.
 *   - {@link evaluateAccess} — the shadow/enforce decision for one operation.
 *
 * By design this module imports nothing from `graphql`, `type-graphql`, or
 * `@apollo/server`; it is a pure function library the middleware wires into the
 * request lifecycle. Service (`SERVER_AUTH_TOKEN`) and admin principals are
 * NEVER passed here — the middleware bypasses them before this code runs — so
 * the engine's server-to-server `adaptic.*` traffic is never scoped.
 */

// -----------------------------------------------------------------------------
// Modes
// -----------------------------------------------------------------------------

/**
 * Operating mode for row-level tenancy scoping, mirroring the engine WS
 * channel-auth shadow→enforce rollout:
 *
 *   - `off`     — no-op; the middleware returns immediately.
 *   - `shadow`  — execute the query UNCHANGED, but log + count every access
 *                 that `enforce` WOULD restrict or deny. Used to prove the
 *                 engine service path and every legitimate platform query is
 *                 never caught before flipping to `enforce`.
 *   - `enforce` — inject the scoping predicate on reads and deny cross-tenant
 *                 create/upsert with a clear `FORBIDDEN` GraphQL error.
 */
export type TenancyScopingMode = 'off' | 'shadow' | 'enforce';

/** Default mode when `TENANCY_SCOPING_MODE` is unset or unrecognised. */
export const DEFAULT_TENANCY_SCOPING_MODE: TenancyScopingMode = 'shadow';

/**
 * Resolve the current scoping mode from `TENANCY_SCOPING_MODE`. Read fresh on
 * each call (cheap env read) so the mode can be flipped operationally without a
 * process restart — the same pattern the engine uses to graduate a shadowed
 * guard to enforcement. Unknown values fall back to the safe default (shadow),
 * which never changes query behaviour.
 *
 * @param env - Environment source (defaults to `process.env`); injectable for tests.
 * @returns The resolved {@link TenancyScopingMode}.
 */
export function getTenancyScopingMode(
  env: Record<string, string | undefined> = process.env
): TenancyScopingMode {
  const raw = (env.TENANCY_SCOPING_MODE ?? '').trim().toLowerCase();
  if (raw === 'off' || raw === 'shadow' || raw === 'enforce') {
    return raw;
  }
  return DEFAULT_TENANCY_SCOPING_MODE;
}

// -----------------------------------------------------------------------------
// Governed models + field classification
// -----------------------------------------------------------------------------

/**
 * The trading-desk models. They are tenancy-governed like the models above
 * them, and additionally ALWAYS enforced (see {@link ALWAYS_ENFORCED_MODELS}).
 *
 * Ownership: Follow, PushSubscription and UserTotp belong to a user
 * (`userId`); AdaConversation belongs to its author and is readable by the
 * fund's members only when `sharedWithOrg`; AdaMessage inherits its
 * conversation's scope; DeskDecision and AutoFollowRule belong to a fund;
 * FeatureFlagOverride belongs to a user or an organization.
 */
export const DESK_MODELS = [
  'Follow',
  'AutoFollowRule',
  'PushSubscription',
  'AdaConversation',
  'AdaMessage',
  'UserTotp',
  'DeskDecision',
  'FeatureFlagOverride',
] as const;

/**
 * The tenancy, notification and desk models subject to row-level scoping.
 * Everything else (AlpacaAccount, Trade, User, …) is intentionally out of
 * scope for this change — see the SP2-G7 gap and the follow-ups in the
 * middleware docs.
 */
export const GOVERNED_MODELS = [
  'Organization',
  'OrgMembership',
  'Fund',
  'FundAssignment',
  'BrokerageAccount',
  'NotificationEvent',
  'NotificationDelivery',
  'NotificationPreference',
  ...DESK_MODELS,
] as const;

/**
 * Governed models whose scoping is enforced in every mode, `off` included,
 * and which refuse an unauthenticated caller outright.
 *
 * `TENANCY_SCOPING_MODE` stages the rollout for models that had live traffic
 * before scoping existed: shadow proves no legitimate caller is caught before
 * enforcement can break one, and `off` rolls back to the unscoped behaviour.
 * The desk models were born after the guard and have never been served
 * unscoped, so there is no caller for shadow to protect and no unscoped
 * behaviour for `off` to restore. Holding them in shadow would only serve a
 * user's conversations, push endpoints and second-factor state to whoever
 * asks while the shadow series accumulated.
 */
export const ALWAYS_ENFORCED_MODELS: ReadonlySet<string> = new Set<string>(DESK_MODELS);

/** Whether a governed model is scoped in every mode (see {@link ALWAYS_ENFORCED_MODELS}). */
export function isAlwaysEnforced(model: string): boolean {
  return ALWAYS_ENFORCED_MODELS.has(model);
}

/** A model name subject to row-level tenancy scoping. */
export type GovernedModel = (typeof GOVERNED_MODELS)[number];

/**
 * Operation family for a governed resolver field:
 *
 *   - `whereScope`  — carries a `where` argument; enforce AND-injects the scope
 *     fragment (reads narrow to entitled rows; update/delete of a cross-tenant
 *     row raise Prisma `P2025`). Covers the find, aggregate, groupBy, update,
 *     and delete operation families.
 *   - `createScope` — carries a `data` argument; enforce denies when the target
 *     tenant is not entitled. Covers createOne/createMany/createManyAndReturn.
 *   - `upsertScope` — carries both `where` and create `data`; enforce injects
 *     the where scope AND verifies the create payload.
 */
export type GovernedOpKind = 'whereScope' | 'createScope' | 'upsertScope';

/** Resolution of a resolver field name onto its governed model + op kind. */
export interface GovernedField {
  readonly model: GovernedModel;
  readonly opKind: GovernedOpKind;
}

/**
 * The plural (findMany) GraphQL field name typegraphql-prisma generates per
 * model. Hardcoded (rather than reconstructed via a pluralization library) for
 * the 8 governed models so classification is exact and drift-proof; the
 * singular (findUnique) field name is the lower-camel model name.
 */
const PLURAL_FIELD: Record<GovernedModel, string> = {
  Organization: 'organizations',
  OrgMembership: 'orgMemberships',
  Fund: 'funds',
  FundAssignment: 'fundAssignments',
  BrokerageAccount: 'brokerageAccounts',
  NotificationEvent: 'notificationEvents',
  NotificationDelivery: 'notificationDeliveries',
  NotificationPreference: 'notificationPreferences',
  Follow: 'follows',
  AutoFollowRule: 'autoFollowRules',
  PushSubscription: 'pushSubscriptions',
  AdaConversation: 'adaConversations',
  AdaMessage: 'adaMessages',
  UserTotp: 'userTotps',
  DeskDecision: 'deskDecisions',
  FeatureFlagOverride: 'featureFlagOverrides',
};

/** Lower-camel the first character of a model name (e.g. `Fund` → `fund`). */
function lowerFirst(value: string): string {
  return value.length === 0 ? value : value[0].toLowerCase() + value.slice(1);
}

/**
 * Static map of every generated resolver field name → its governed model +
 * operation kind. Built once at module load from the model list and the
 * deterministic typegraphql-prisma naming templates.
 */
const GOVERNED_FIELD_MAP: ReadonlyMap<string, GovernedField> = (() => {
  const map = new Map<string, GovernedField>();
  for (const model of GOVERNED_MODELS) {
    const singular = lowerFirst(model);
    const whereScopeFields = [
      PLURAL_FIELD[model], // findMany
      singular, // findUnique
      `get${model}`, // findUniqueOrThrow
      `findFirst${model}`,
      `findFirst${model}OrThrow`,
      `aggregate${model}`,
      `groupBy${model}`,
      `updateOne${model}`,
      `updateMany${model}`,
      `deleteOne${model}`,
      `deleteMany${model}`,
    ];
    for (const field of whereScopeFields) {
      map.set(field, { model, opKind: 'whereScope' });
    }
    for (const field of [
      `createOne${model}`,
      `createMany${model}`,
      `createManyAndReturn${model}`,
    ]) {
      map.set(field, { model, opKind: 'createScope' });
    }
    map.set(`upsertOne${model}`, { model, opKind: 'upsertScope' });
  }
  return map;
})();

/**
 * Classify a root Query/Mutation field name as a governed tenancy operation.
 *
 * @param fieldName - The GraphQL field name (`info.fieldName`).
 * @returns The {@link GovernedField}, or `null` when the field is not governed.
 */
export function classifyGovernedField(fieldName: string): GovernedField | null {
  return GOVERNED_FIELD_MAP.get(fieldName) ?? null;
}

// -----------------------------------------------------------------------------
// Entitlement resolution
// -----------------------------------------------------------------------------

/**
 * The set of tenants a user-scoped caller is entitled to. `orgIds` come from
 * their OrgMembership rows; `fundIds` are the union of funds owned by those
 * orgs and funds they are directly assigned to via FundAssignment.
 */
export interface Entitlement {
  readonly userId: string;
  readonly orgIds: readonly string[];
  readonly fundIds: readonly string[];
}

/**
 * Minimal structural subset of the Prisma client used to resolve entitlement.
 * Declared narrowly so the resolver can be unit-tested with a fake and so this
 * pure module never depends on the generated `PrismaClient` type.
 */
export interface EntitlementPrismaClient {
  orgMembership: {
    findMany(args: {
      where: { userId: string };
      select: { organizationId: true };
    }): Promise<Array<{ organizationId: string }>>;
  };
  fund: {
    findMany(args: {
      where: { organizationId: { in: string[] } };
      select: { id: true };
    }): Promise<Array<{ id: string }>>;
  };
  fundAssignment: {
    findMany(args: {
      where: { userId: string };
      select: { fundId: true };
    }): Promise<Array<{ fundId: string }>>;
  };
}

/** De-duplicate a string array, preserving first-seen order. */
function unique(values: readonly string[]): string[] {
  return Array.from(new Set(values));
}

/**
 * Resolve the {@link Entitlement} for a user id by reading their org
 * memberships, the funds owned by those orgs, and any directly-assigned funds.
 *
 * A user with no memberships resolves to empty id sets, which makes every
 * governed read return nothing under enforcement — the correct fail-closed
 * posture for a caller entitled to no tenants.
 *
 * @param prisma - Prisma client (or a structural subset).
 * @param userId - The caller's user id (JWT `sub`).
 * @returns The resolved entitlement.
 */
export async function resolveEntitlement(
  prisma: EntitlementPrismaClient,
  userId: string
): Promise<Entitlement> {
  const memberships = await prisma.orgMembership.findMany({
    where: { userId },
    select: { organizationId: true },
  });
  const orgIds = unique(memberships.map((m) => m.organizationId));

  const [orgFunds, assignments] = await Promise.all([
    orgIds.length > 0
      ? prisma.fund.findMany({
          where: { organizationId: { in: orgIds } },
          select: { id: true },
        })
      : Promise.resolve([] as Array<{ id: string }>),
    prisma.fundAssignment.findMany({
      where: { userId },
      select: { fundId: true },
    }),
  ]);

  const fundIds = unique([
    ...orgFunds.map((f) => f.id),
    ...assignments.map((a) => a.fundId),
  ]);

  return { userId, orgIds, fundIds };
}

// -----------------------------------------------------------------------------
// Scope predicate construction + injection
// -----------------------------------------------------------------------------

/** A Prisma `where`-fragment object. */
export type WhereFragment = Record<string, unknown>;

/** The AdaConversation rows a user may READ: their own, and shared ones in an entitled fund. */
function adaConversationReadScope(ent: Entitlement, fundIds: string[]): WhereFragment {
  return {
    OR: [{ userId: { equals: ent.userId } }, { sharedWithOrg: { equals: true }, fundId: { in: fundIds } }],
  };
}

/**
 * Equality on a scalar column, in the filter-object form.
 *
 * The fragment is injected into the GraphQL `where` argument BEFORE
 * TypeGraphQL converts the arguments into the generated input classes, and
 * the column's input type there is a filter class (`UuidFilter`,
 * `StringFilter`). A bare value (`{ userId: 'u' }`) is valid Prisma but is not
 * a filter object, so the conversion turns it into an empty filter, which
 * matches every row: the scope would silently stop scoping. `{ equals }` is
 * the form both the conversion and Prisma read the same way.
 */
function eq(value: string): { equals: string } {
  return { equals: value };
}

/**
 * Build the Prisma `where` fragment that restricts reads/writes of a governed
 * model to the caller's entitled rows:
 *
 *   - Organization → `id ∈ orgIds`
 *   - OrgMembership → `organizationId ∈ orgIds`
 *   - Fund → `organizationId ∈ orgIds` OR `id ∈ fundIds` (covers assigned funds
 *     in an org the user is not a member of)
 *   - FundAssignment / BrokerageAccount → `fundId ∈ fundIds`
 *   - NotificationEvent → `orgId ∈ orgIds` OR `fundId ∈ fundIds` OR
 *     `actorUserId == userId`
 *   - NotificationDelivery → `recipientUserId == userId`
 *   - NotificationPreference → `userId == userId`
 *
 * @param model - The governed model.
 * @param ent - The caller's entitlement.
 * @returns A Prisma `where` fragment.
 */
export function buildScopeWhere(
  model: GovernedModel,
  ent: Entitlement
): WhereFragment {
  const orgIds = [...ent.orgIds];
  const fundIds = [...ent.fundIds];
  switch (model) {
    case 'Organization':
      return { id: { in: orgIds } };
    case 'OrgMembership':
      return { organizationId: { in: orgIds } };
    case 'Fund':
      return {
        OR: [{ organizationId: { in: orgIds } }, { id: { in: fundIds } }],
      };
    case 'FundAssignment':
      return { fundId: { in: fundIds } };
    case 'BrokerageAccount':
      return { fundId: { in: fundIds } };
    case 'NotificationEvent':
      return {
        OR: [
          { orgId: { in: orgIds } },
          { fundId: { in: fundIds } },
          { actorUserId: eq(ent.userId) },
        ],
      };
    case 'NotificationDelivery':
      return { recipientUserId: eq(ent.userId) };
    case 'NotificationPreference':
    case 'Follow':
    case 'PushSubscription':
    case 'UserTotp':
      return { userId: eq(ent.userId) };
    case 'AutoFollowRule':
    case 'DeskDecision':
      return { fundId: { in: fundIds } };
    case 'AdaConversation':
      return adaConversationReadScope(ent, fundIds);
    case 'AdaMessage':
      return { conversation: { is: adaConversationReadScope(ent, fundIds) } };
    case 'FeatureFlagOverride':
      return { OR: [{ userId: eq(ent.userId) }, { organizationId: { in: orgIds } }] };
  }
}

/**
 * The scope a WRITE (update, upsert, delete) must stay inside. Identical to
 * {@link buildScopeWhere} except for Ada conversations: a conversation shared
 * with the organization is readable by its members but writable only by its
 * author, and the same holds for its messages.
 *
 * @param model - The governed model.
 * @param ent - The caller's entitlement.
 * @returns A Prisma `where` fragment.
 */
export function buildWriteScopeWhere(
  model: GovernedModel,
  ent: Entitlement
): WhereFragment {
  if (model === 'AdaConversation') return { userId: eq(ent.userId) };
  if (model === 'AdaMessage') return { conversation: { is: { userId: eq(ent.userId) } } };
  return buildScopeWhere(model, ent);
}

/**
 * AND-compose a scope fragment onto a caller-supplied `where`, preserving any
 * top-level fields (including a unique selector such as `id`/`slug`) so
 * `findUnique`/`update`/`delete` remain valid under Prisma extendedWhereUnique.
 * The scope is appended to the `AND` array rather than overwriting caller keys.
 *
 * @param where - The caller-supplied `where` (may be `undefined`).
 * @param scope - The scope fragment from {@link buildScopeWhere}.
 * @returns A new `where` object with the scope ANDed in.
 */
export function injectScopeWhere(
  where: WhereFragment | undefined,
  scope: WhereFragment
): WhereFragment {
  const base: WhereFragment = where ? { ...where } : {};
  const existing = base.AND;
  const existingAnd: unknown[] = Array.isArray(existing)
    ? (existing as unknown[])
    : existing !== undefined
      ? [existing]
      : [];
  base.AND = [...existingAnd, scope];
  return base;
}

// -----------------------------------------------------------------------------
// Create-payload scope checks
// -----------------------------------------------------------------------------

/**
 * Read a foreign-key id from a create payload, supporting both the scalar form
 * (`{ organizationId: 'x' }`) and the typegraphql-prisma nested relation form
 * (`{ organization: { connect: { id: 'x' } } }`).
 */
function readConnectId(
  data: Record<string, unknown>,
  scalarField: string,
  relationField: string
): string | undefined {
  const scalar = data[scalarField];
  if (typeof scalar === 'string') return scalar;
  const relation = data[relationField];
  if (relation && typeof relation === 'object') {
    const connect = (relation as Record<string, unknown>).connect;
    if (connect && typeof connect === 'object') {
      const id = (connect as Record<string, unknown>).id;
      if (typeof id === 'string') return id;
    }
  }
  return undefined;
}

/** Whether a single create payload lands in a tenant the caller is entitled to. */
function singleDataInScope(
  model: GovernedModel,
  data: Record<string, unknown>,
  ent: Entitlement
): boolean {
  const orgIds = new Set(ent.orgIds);
  const fundIds = new Set(ent.fundIds);
  switch (model) {
    case 'Organization':
      // Self-service org creation (onboarding): the caller becomes the owner.
      // This creates a brand-new tenant, not a cross-tenant access, so it is
      // permitted. Membership creation into an EXISTING org is scoped below.
      return true;
    case 'OrgMembership': {
      const orgId = readConnectId(data, 'organizationId', 'organization');
      return orgId !== undefined && orgIds.has(orgId);
    }
    case 'Fund': {
      const orgId = readConnectId(data, 'organizationId', 'organization');
      return orgId !== undefined && orgIds.has(orgId);
    }
    case 'FundAssignment': {
      const fundId = readConnectId(data, 'fundId', 'fund');
      return fundId !== undefined && fundIds.has(fundId);
    }
    case 'BrokerageAccount': {
      const fundId = readConnectId(data, 'fundId', 'fund');
      return fundId !== undefined && fundIds.has(fundId);
    }
    case 'NotificationEvent': {
      const orgId = readConnectId(data, 'orgId', 'organization');
      const fundId = readConnectId(data, 'fundId', 'fund');
      return (
        (orgId !== undefined && orgIds.has(orgId)) ||
        (fundId !== undefined && fundIds.has(fundId)) ||
        data.actorUserId === ent.userId
      );
    }
    case 'NotificationDelivery': {
      const recipientId = readConnectId(
        data,
        'recipientUserId',
        'recipient'
      );
      return recipientId === ent.userId;
    }
    case 'NotificationPreference':
    case 'PushSubscription':
    case 'UserTotp': {
      const userId = readConnectId(data, 'userId', 'user');
      return userId === ent.userId;
    }
    case 'Follow':
    case 'AdaConversation': {
      const userId = readConnectId(data, 'userId', 'user');
      const fundId = readConnectId(data, 'fundId', 'fund');
      return userId === ent.userId && fundId !== undefined && fundIds.has(fundId);
    }
    case 'AutoFollowRule': {
      const ownerId = readConnectId(data, 'ownerId', 'owner');
      const fundId = readConnectId(data, 'fundId', 'fund');
      return ownerId === ent.userId && fundId !== undefined && fundIds.has(fundId);
    }
    case 'DeskDecision': {
      const fundId = readConnectId(data, 'fundId', 'fund');
      return fundId !== undefined && fundIds.has(fundId);
    }
    case 'FeatureFlagOverride': {
      const userId = readConnectId(data, 'userId', 'user');
      const orgId = readConnectId(data, 'organizationId', 'organization');
      if (userId !== undefined && orgId !== undefined) return false;
      return userId === ent.userId || (orgId !== undefined && orgIds.has(orgId));
    }
    case 'AdaMessage':
      // A message's tenant is its conversation's, which the payload names only
      // by id: it cannot be proven from the payload alone. The callers that can
      // read the database resolve it with {@link parentScopedCreateInScope}.
      return false;
  }
}

/** A governed model whose create payload is scoped by a parent row it references. */
interface CreateParent {
  readonly model: GovernedModel;
  readonly scalarField: string;
  readonly relationField: string;
}

const CREATE_PARENTS: Partial<Record<GovernedModel, CreateParent>> = {
  AdaMessage: { model: 'AdaConversation', scalarField: 'conversationId', relationField: 'conversation' },
};

/** Minimal delegate for reading a parent row under a scope fragment. */
export interface ParentScopeReader {
  findFirst(args: { where: WhereFragment; select: { id: true } }): Promise<{ id: string } | null>;
}

/** The parent delegates {@link parentScopedCreateInScope} reads. */
export interface ParentScopePrismaClient {
  adaConversation: ParentScopeReader;
}

/** Whether a model's create is scoped by a parent row (see {@link parentScopedCreateInScope}). */
export function hasCreateParent(model: GovernedModel): boolean {
  return CREATE_PARENTS[model] !== undefined;
}

/**
 * Whether a create payload (or every element of a createMany payload) names a
 * parent row the caller may WRITE. Used for models whose tenant is their
 * parent's, which {@link dataInScope} cannot decide from the payload alone.
 *
 * @param prisma - A client exposing the parent delegates.
 * @param model - The governed model being created.
 * @param data - The create payload (object or array).
 * @param ent - The caller's entitlement.
 * @returns `false` for a model with no parent rule, a payload naming no
 *   parent, or a parent outside the caller's write scope.
 */
export async function parentScopedCreateInScope(
  prisma: ParentScopePrismaClient,
  model: GovernedModel,
  data: unknown,
  ent: Entitlement
): Promise<boolean> {
  const parent = CREATE_PARENTS[model];
  if (!parent) return false;
  const items = Array.isArray(data) ? data : [data];
  if (items.length === 0) return false;
  const ids: string[] = [];
  for (const item of items) {
    if (item === null || typeof item !== 'object') return false;
    const id = readConnectId(item as Record<string, unknown>, parent.scalarField, parent.relationField);
    if (id === undefined) return false;
    ids.push(id);
  }
  const reader = prisma.adaConversation;
  for (const id of unique(ids)) {
    const row = await reader.findFirst({
      where: injectScopeWhere({ id }, buildWriteScopeWhere(parent.model, ent)),
      select: { id: true },
    });
    if (!row) return false;
  }
  return true;
}

/**
 * Whether a create/createMany/upsert payload is entirely within the caller's
 * entitlement. Accepts a single object or an array (createMany), requiring
 * every element to be in scope.
 *
 * @param model - The governed model.
 * @param data - The create payload (object or array).
 * @param ent - The caller's entitlement.
 * @returns `true` when every element lands in an entitled tenant.
 */
export function dataInScope(
  model: GovernedModel,
  data: unknown,
  ent: Entitlement
): boolean {
  if (Array.isArray(data)) {
    return data.every(
      (item) =>
        item !== null &&
        typeof item === 'object' &&
        singleDataInScope(model, item as Record<string, unknown>, ent)
    );
  }
  if (data === null || typeof data !== 'object') {
    // Absent/malformed payload cannot be proven in-scope → treat as out of scope.
    return false;
  }
  return singleDataInScope(model, data as Record<string, unknown>, ent);
}

// -----------------------------------------------------------------------------
// Access evaluation (shadow logging + enforce decision)
// -----------------------------------------------------------------------------

/**
 * The scoping decision for one governed operation:
 *
 *   - `allow`    — the caller-supplied filter already constrains the query
 *     within their entitlement (read), or the create payload is in scope;
 *     enforcement is a no-op and shadow mode logs nothing.
 *   - `restrict` — a read whose caller-supplied `where` does not prove it is
 *     within entitlement; enforce narrows results (shadow logs this).
 *   - `deny`     — a create/upsert whose payload targets a non-entitled tenant;
 *     enforce raises `FORBIDDEN` (shadow logs this).
 */
export type ScopeDecision = 'allow' | 'restrict' | 'deny';

/** The outcome of {@link evaluateAccess}. */
export interface AccessAssessment {
  readonly decision: ScopeDecision;
  /** Short machine-readable reason, for structured logs. */
  readonly reason: string;
}

/**
 * Extract the concrete string values a caller constrained a `where` field to,
 * supporting the scalar (`'x'`), `{ equals: 'x' }`, and `{ in: [...] }` forms.
 * Returns `undefined` when the field is unconstrained or uses a form we cannot
 * statically prove (in which case the caller is not treated as pre-scoped).
 */
function extractConstraint(
  where: WhereFragment | undefined,
  field: string
): string[] | undefined {
  if (!where) return undefined;
  const value = where[field];
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return [value];
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.equals === 'string') return [obj.equals];
    if (Array.isArray(obj.in)) {
      const strings = obj.in.filter(
        (x): x is string => typeof x === 'string'
      );
      return strings.length === obj.in.length ? strings : undefined;
    }
  }
  return undefined;
}

/** Whether every value in `values` is a member of `allowed`. */
function isSubset(values: string[], allowed: readonly string[]): boolean {
  if (values.length === 0) return false;
  const set = new Set(allowed);
  return values.every((v) => set.has(v));
}

/**
 * Whether the caller-supplied `where` already constrains a read to rows within
 * their entitlement. Used only to decide whether shadow mode should log — it is
 * a conservative heuristic over top-level fields: when it cannot prove the
 * query is pre-scoped it returns `false`, so enforce (which always injects the
 * scope) may narrow a query shadow flagged as `restrict`. It never produces a
 * false "already scoped" (which would hide a real cross-tenant access).
 */
function readAlreadyScoped(
  model: GovernedModel,
  where: WhereFragment | undefined,
  ent: Entitlement
): boolean {
  const inOrg = (field: string): boolean => {
    const c = extractConstraint(where, field);
    return c !== undefined && isSubset(c, ent.orgIds);
  };
  const inFund = (field: string): boolean => {
    const c = extractConstraint(where, field);
    return c !== undefined && isSubset(c, ent.fundIds);
  };
  const isSelf = (field: string): boolean => {
    const c = extractConstraint(where, field);
    return c !== undefined && c.length === 1 && c[0] === ent.userId;
  };
  switch (model) {
    case 'Organization':
      return inOrg('id');
    case 'OrgMembership':
      return inOrg('organizationId') || isSelf('userId');
    case 'Fund':
      return inFund('id') || inOrg('organizationId');
    case 'FundAssignment':
      return inFund('fundId') || isSelf('userId');
    case 'BrokerageAccount':
      return inFund('fundId');
    case 'NotificationEvent':
      return inOrg('orgId') || inFund('fundId') || isSelf('actorUserId');
    case 'NotificationDelivery':
      return isSelf('recipientUserId');
    case 'NotificationPreference':
    case 'PushSubscription':
    case 'UserTotp':
      return isSelf('userId');
    case 'Follow':
      return isSelf('userId') || compoundIsSelf(where, 'userId_fundId_targetKind_targetId', ent.userId);
    case 'AdaConversation':
      return isSelf('userId');
    case 'AutoFollowRule':
    case 'DeskDecision':
      return inFund('fundId');
    case 'FeatureFlagOverride':
      return isSelf('userId') || inOrg('organizationId');
    case 'AdaMessage':
      return false;
  }
}

/** Whether a compound unique selector in `where` names the caller as its `userId`. */
function compoundIsSelf(where: WhereFragment | undefined, compound: string, userId: string): boolean {
  const key = where?.[compound];
  if (key === null || typeof key !== 'object') return false;
  return (key as Record<string, unknown>).userId === userId;
}

/**
 * Evaluate the scoping decision for one governed operation. Pure: it inspects
 * the args but does not mutate them and performs no I/O.
 *
 * @param field - The classified governed field.
 * @param args - The resolver args (`where` and/or `data`).
 * @param ent - The caller's entitlement.
 * @returns The {@link AccessAssessment}.
 */
export function evaluateAccess(
  field: GovernedField,
  args: { where?: unknown; data?: unknown; create?: unknown },
  ent: Entitlement
): AccessAssessment {
  const where =
    args.where && typeof args.where === 'object'
      ? (args.where as WhereFragment)
      : undefined;

  if (field.opKind === 'whereScope') {
    return readAlreadyScoped(field.model, where, ent)
      ? { decision: 'allow', reason: 'where_within_entitlement' }
      : { decision: 'restrict', reason: 'where_not_proven_in_scope' };
  }

  if (field.opKind === 'createScope') {
    return dataInScope(field.model, args.data, ent)
      ? { decision: 'allow', reason: 'create_data_in_scope' }
      : { decision: 'deny', reason: 'create_data_out_of_scope' };
  }

  // upsertScope: verify the create payload AND require the where be pre-scoped
  // (the update path is additionally hardened by where-injection at enforce).
  // An always-enforced model is never run unscoped, so its where-injection is
  // guaranteed and carries the update side on its own: a `where` naming a row
  // outside the caller's scope matches nothing and the upsert falls through to
  // the create, which must be in scope. That lets a user upsert by a natural
  // key the scope fragment does not name (a push subscription's `endpoint`).
  const createInScope = dataInScope(field.model, args.create, ent);
  if (isAlwaysEnforced(field.model)) {
    return createInScope
      ? { decision: 'allow', reason: 'upsert_create_in_scope_where_injected' }
      : { decision: 'deny', reason: 'upsert_create_out_of_scope' };
  }
  const whereScoped = readAlreadyScoped(field.model, where, ent);
  if (createInScope && whereScoped) {
    return { decision: 'allow', reason: 'upsert_in_scope' };
  }
  return {
    decision: 'deny',
    reason: createInScope ? 'upsert_where_not_in_scope' : 'upsert_create_out_of_scope',
  };
}

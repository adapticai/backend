/**
 * Content rules for the models a `user` principal may write without a
 * row-ownership model: which FIELDS of their own `User` row they may set,
 * what an `AuditLog` row they author may claim, and which `Configuration`
 * rows are theirs. Pure; no I/O.
 *
 * - **User.** "Only your own row" is not enough when the row carries the
 *   caller's privilege (`role` is `OWNER | ADMIN | SUPERADMIN | USER`), their
 *   identity (`id`, `email`, `emailVerified`), a billing link (`customerId`,
 *   `plan`) or a stored credential (`openaiAPIKey`). A user may set only the
 *   profile and onboarding fields the platform's own routes write, and no
 *   relation at all through their row. Desk availability (`availability`,
 *   `availabilityUntil`) is the user's own statement of whether they are at
 *   the desk; deputy routing reads it, so only its owner may set it.
 * - **AuditLog.** The attributed TradingPolicy trail is identified by
 *   `metadata.source = 'mutation-auth-guard'`. A user-authored row claiming
 *   that source, or naming someone else as its `userId`, is a forged
 *   attribution record, so both are refused. `fundId` places a row in that
 *   fund's desk ledger, which is the engine's record of what the desk did and
 *   is written by the service principal; a user-authored row setting it would
 *   be served as a ledger entry of a fund the user may not even belong to, so
 *   a user may not set it at all (`ledger_fund_reserved`). A user may not tag
 *   their entry for every workspace (`audit_workspace_reserved`, see
 *   {@link USER_RESERVED_AUDIT_WORKSPACES}).
 * - **Organization.** `kind` decides whether the organization is a manager
 *   or an allocator office, and with it which workspace every member is
 *   given. Being inside the tenant (the `tenant_scoped` rule) is not
 *   authority over that, so a user may not set it on any write
 *   (`organization_kind_reserved`); the service sets it when it provisions an
 *   office. The column was born after the guard, so the refusal holds in
 *   every mode ({@link ALWAYS_ENFORCED_CONTENT_REFUSALS}).
 * - **Configuration.** The table also holds system rows (LLM alias routing,
 *   engine settings) keyed by a unique `configKey`. The platform's per-user
 *   preference rows live under `platform.web.<surface>.user.<userId>`; a user
 *   may upsert only a key in that namespace ending in their own id, and may
 *   not rename it.
 *
 * @module auth/user-write-content
 */

import type { MutationAuthMode, MutationAuthReason, MutationTarget } from './mutation-authorization';
import type { BackendPrincipal } from './token-verifier';

/** The `User` fields a user may set on their own row. */
export const USER_SELF_WRITABLE_FIELDS: ReadonlySet<string> = new Set([
  'name',
  'image',
  'avatarUrl',
  'bio',
  'jobTitle',
  'onboardingComplete',
  'signupCategory',
  'availability',
  'availabilityUntil',
]);

/** `AuditLog.metadata.source` values only the backend itself may write. */
export const RESERVED_AUDIT_SOURCES: ReadonlySet<string> = new Set(['mutation-auth-guard']);

/**
 * `AuditLog.workspace` tags a user may not put on an entry they author.
 * `SHARED` and `ORGANISATION` open an entry to every workspace of the
 * organization, across the wall between Strategy and Fund; the backend cannot
 * tell which side of the wall a user writes from, so only the service, which
 * can, tags an entry for everyone. A user may still tag their own entry with
 * their workspace (`STRATEGY`, `FUND`) or leave it untagged, which the
 * platform seals for every viewer without Strategy access.
 */
export const USER_RESERVED_AUDIT_WORKSPACES: ReadonlySet<string> = new Set(['SHARED', 'ORGANISATION']);

/** A per-user platform preference key: `platform.web.<surface>.user.<userId>`. */
const USER_CONFIG_KEY = /^platform\.web\.[a-z0-9][a-z0-9-]*\.user\.([0-9a-f-]{36})$/;

/** Why a user's write content was refused (a bounded metric label). */
export type ContentRefusal = Extract<
  MutationAuthReason,
  | 'field_not_user_writable'
  | 'reserved_audit_source'
  | 'audit_actor_mismatch'
  | 'ledger_fund_reserved'
  | 'audit_workspace_reserved'
  | 'organization_kind_reserved'
  | 'config_key_not_user_scoped'
>;

/**
 * Content refusals decided at `enforce` whatever the guard's mode: each
 * protects a column no user writer ever had, so there is no legacy writer for
 * shadow to protect, and in shadow the forged value would be served as fact.
 */
export const ALWAYS_ENFORCED_CONTENT_REFUSALS: ReadonlySet<ContentRefusal> = new Set<ContentRefusal>([
  'ledger_fund_reserved',
  'audit_workspace_reserved',
  'organization_kind_reserved',
]);

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function definedKeys(record: Record<string, unknown>): string[] {
  return Object.keys(record).filter((key) => record[key] !== undefined);
}

function userSelfRefusal(args: Record<string, unknown>): ContentRefusal | null {
  const data = asRecord(args.data);
  if (!data) return 'field_not_user_writable';
  return definedKeys(data).every((key) => USER_SELF_WRITABLE_FIELDS.has(key)) ? null : 'field_not_user_writable';
}

function auditLogRefusal(args: Record<string, unknown>, callerId: string): ContentRefusal | null {
  const data = asRecord(args.data);
  if (!data) return 'reserved_audit_source';
  const source = asRecord(data.metadata)?.source;
  if (typeof source === 'string' && RESERVED_AUDIT_SOURCES.has(source)) return 'reserved_audit_source';
  if (data.userId !== undefined && data.userId !== null && data.userId !== callerId) {
    return 'audit_actor_mismatch';
  }
  if (data.fundId !== undefined && data.fundId !== null) return 'ledger_fund_reserved';
  const workspace = data.workspace;
  if (typeof workspace === 'string' && USER_RESERVED_AUDIT_WORKSPACES.has(workspace)) return 'audit_workspace_reserved';
  return null;
}

/**
 * Columns born after the guard that carry authority: an organization's kind
 * (which workspace its members are given), a membership's entity scope
 * (which office entities its holder sees), and an entity's office and parent
 * (which office's members are served it, and where in that office's tree). A user mutation that sets one,
 * at the root or through any nested write, is decided at `enforce` whatever
 * the guard's mode: there is no legacy writer for shadow to protect, and in
 * shadow a member could widen their own scope or retype their organization
 * with only a log line to show for it. Enforcement then applies the model's
 * ordinary rule: `membership_authority` for a membership (OWNER or ADMIN of
 * the organization), `organization_kind_reserved` for the kind, `service_only`
 * for an entity, and the nested-write allowlist for any nested path.
 */
export const RESERVED_COLUMNS: ReadonlyMap<string, ReadonlySet<string>> = new Map<string, ReadonlySet<string>>([
  ['Organization', new Set(['kind'])],
  ['OrgMembership', new Set(['entityScopeAll', 'entityScopeIds'])],
  // Which office owns an entity and where it sits in the office's tree: the
  // scalar keys and the relation keys that set the same foreign keys
  // (`connect`, `create`, `disconnect`).
  ['Investor', new Set(['officeOrganizationId', 'officeOrganization', 'parentInvestorId', 'parentInvestor'])],
]);

/**
 * Whether a mutation's payload sets a {@link RESERVED_COLUMNS} column.
 *
 * @param columns - Every field the payload sets, from `findNestedWrites`.
 */
export function writesReservedColumn(columns: ReadonlyArray<{ model: string; column: string }>): boolean {
  return columns.some(({ model, column }) => RESERVED_COLUMNS.get(model)?.has(column) === true);
}

/** What {@link escalatedMutationMode} decides from. */
export interface ModeEscalationInput {
  /** The verified caller, or `null` when there is none. */
  readonly principal: Pick<BackendPrincipal, 'kind'> | null;
  /** The content refusal for a user's write ({@link userContentRefusal}), or `null`. */
  readonly contentRefusal: ContentRefusal | null;
  /** Every field the payload sets, root and nested, from `findNestedWrites`. */
  readonly columns: ReadonlyArray<{ model: string; column: string }>;
  /** The mode the guard's configuration gives the mutation's models. */
  readonly mode: MutationAuthMode;
}

/**
 * The mode a mutation is decided at, after the escalations no configuration
 * can lower:
 *
 * - a user's write whose content refusal is in
 *   {@link ALWAYS_ENFORCED_CONTENT_REFUSALS} (a forged ledger entry, a
 *   workspace-wide audit tag, an organization's kind) is decided at `enforce`,
 *   `off` included;
 * - a payload that sets a {@link RESERVED_COLUMNS} column, at the root or in
 *   any nested write, is decided at `enforce` for every principal but the
 *   service and admins.
 *
 * Every other mutation keeps its configured mode. Pure, so the escalation is
 * provable without a database or a schema.
 *
 * @param input - The caller, the content refusal, the written columns and the configured mode.
 * @returns The mode to decide the mutation at.
 */
export function escalatedMutationMode(input: ModeEscalationInput): MutationAuthMode {
  const { principal, contentRefusal, columns, mode } = input;
  if (contentRefusal !== null && ALWAYS_ENFORCED_CONTENT_REFUSALS.has(contentRefusal)) return 'enforce';
  const unprivileged = principal?.kind !== 'server' && principal?.kind !== 'admin';
  if (unprivileged && writesReservedColumn(columns)) return 'enforce';
  return mode;
}

/** `Organization` fields no user may set (see the module doc). */
export const ORGANIZATION_RESERVED_FIELDS: ReadonlySet<string> = new Set(['kind']);

function organizationRefusal(args: Record<string, unknown>): ContentRefusal | null {
  for (const payload of [args.data, args.create, args.update]) {
    const record = asRecord(payload);
    if (record && definedKeys(record).some((key) => ORGANIZATION_RESERVED_FIELDS.has(key))) {
      return 'organization_kind_reserved';
    }
  }
  return null;
}

function configurationRefusal(args: Record<string, unknown>, callerId: string): ContentRefusal | null {
  const where = asRecord(args.where);
  const key = where?.configKey;
  if (!where || typeof key !== 'string' || definedKeys(where).length !== 1) return 'config_key_not_user_scoped';
  const match = USER_CONFIG_KEY.exec(key);
  if (!match || match[1] !== callerId) return 'config_key_not_user_scoped';
  const createKey = asRecord(args.create)?.configKey;
  if (createKey !== undefined && createKey !== key) return 'config_key_not_user_scoped';
  if (asRecord(args.update)?.configKey !== undefined) return 'config_key_not_user_scoped';
  return null;
}

/**
 * The content refusal for a user's write, or `null` when the content is
 * admissible (or the model has no content rule).
 *
 * @param target - The classified root mutation field.
 * @param args - The field's arguments.
 * @param callerId - The user principal's subject.
 */
export function userContentRefusal(
  target: MutationTarget,
  args: Record<string, unknown>,
  callerId: string
): ContentRefusal | null {
  switch (target.model) {
    case 'User':
      return userSelfRefusal(args);
    case 'AuditLog':
      return auditLogRefusal(args, callerId);
    case 'Configuration':
      return configurationRefusal(args, callerId);
    case 'Organization':
      return organizationRefusal(args);
    default:
      return null;
  }
}

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
 *   relation at all through their row.
 * - **AuditLog.** The attributed TradingPolicy trail is identified by
 *   `metadata.source = 'mutation-auth-guard'`. A user-authored row claiming
 *   that source, or naming someone else as its `userId`, is a forged
 *   attribution record, so both are refused.
 * - **Configuration.** The table also holds system rows (LLM alias routing,
 *   engine settings) keyed by a unique `configKey`. The platform's per-user
 *   preference rows live under `platform.web.<surface>.user.<userId>`; a user
 *   may upsert only a key in that namespace ending in their own id, and may
 *   not rename it.
 *
 * @module auth/user-write-content
 */

import type { MutationAuthReason, MutationTarget } from './mutation-authorization';

/** The `User` fields a user may set on their own row. */
export const USER_SELF_WRITABLE_FIELDS: ReadonlySet<string> = new Set([
  'name',
  'image',
  'avatarUrl',
  'bio',
  'jobTitle',
  'onboardingComplete',
  'signupCategory',
]);

/** `AuditLog.metadata.source` values only the backend itself may write. */
export const RESERVED_AUDIT_SOURCES: ReadonlySet<string> = new Set(['mutation-auth-guard']);

/** A per-user platform preference key: `platform.web.<surface>.user.<userId>`. */
const USER_CONFIG_KEY = /^platform\.web\.[a-z0-9][a-z0-9-]*\.user\.([0-9a-f-]{36})$/;

/** Why a user's write content was refused (a bounded metric label). */
export type ContentRefusal = Extract<
  MutationAuthReason,
  'field_not_user_writable' | 'reserved_audit_source' | 'audit_actor_mismatch' | 'config_key_not_user_scoped'
>;

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
    default:
      return null;
  }
}

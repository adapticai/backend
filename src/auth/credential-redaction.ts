/**
 * Redact stored-credential values from a payload before it is persisted or
 * logged.
 *
 * The audit trail records what a mutation asked for, and a mutation that
 * writes a broker key carries the key in its arguments. An audit row is read
 * by far more people and processes than the credential column itself, so a
 * credential copied into one is a second, unguarded copy of the secret. Every
 * payload that reaches `AuditLog.changedFields` / `metadata` passes through
 * here first.
 *
 * Key-directed rather than type-directed on purpose: audit payloads are
 * persisted as JSON with no GraphQL type attached, and over-redacting a
 * non-secret that shares a credential column's name costs an audit reader one
 * field, while under-redacting leaks a key. The key set is exactly the
 * credential columns {@link CREDENTIAL_FIELDS} guards on the read side.
 *
 * @module auth/credential-redaction
 */

import { CREDENTIAL_FIELDS } from '../middleware/credential-field-guard';

/** The placeholder a redacted value is replaced with. */
export const REDACTED = '[REDACTED]';

/** Deepest nesting walked; anything deeper is replaced wholesale. */
const MAX_DEPTH = 12;

/** Every credential column name across all models. */
export const CREDENTIAL_KEY_NAMES: ReadonlySet<string> = new Set(
  [...CREDENTIAL_FIELDS.values()].flatMap((fields) => [...fields])
);

/**
 * A deep copy of `value` with every credential-named key's value replaced by
 * {@link REDACTED}. An absent or null credential value is kept as-is, so the
 * audit row still shows whether a credential was set, cleared or untouched.
 *
 * @param value - Any JSON-shaped value.
 * @returns The redacted copy.
 */
export function redactCredentials(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) return value;
  if (depth >= MAX_DEPTH) return REDACTED;
  if (Array.isArray(value)) return value.map((item) => redactCredentials(item, depth + 1));
  if (typeof value !== 'object') return value;
  if (value instanceof Date) return value.toISOString();
  const out: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    out[key] =
      CREDENTIAL_KEY_NAMES.has(key) && child !== null && child !== undefined
        ? REDACTED
        : redactCredentials(child, depth + 1);
  }
  return out;
}

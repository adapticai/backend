/**
 * Redact stored-credential values from a payload before it is persisted or
 * logged.
 *
 * The audit trail records what a mutation asked for, and a mutation that
 * writes a broker key carries the key in its arguments. An audit row is read
 * by far more people and processes than the credential column itself, so a
 * credential copied into one is a second, unguarded copy of the secret. Every
 * `AuditLog` write passes through here before it is stored, whoever makes it:
 * the server's Prisma client applies it to each row an `AuditLog` operation
 * writes (`middleware/audit-log-write-redaction`), so a writer that forgets to
 * redact cannot store a key. The audit payload guard
 * (`middleware/audit-payload-guard`) applies the same rule when a row is read,
 * which also covers rows stored before any writer redacted.
 *
 * Key-directed rather than type-directed on purpose: audit payloads are
 * persisted as JSON with no GraphQL type attached, and over-redacting a
 * non-secret that shares a credential column's name costs an audit reader one
 * field, while under-redacting leaks a key. The key set is exactly the
 * credential columns {@link CREDENTIAL_FIELDS} guards on the read side.
 *
 * @module auth/credential-redaction
 */

// From the leaf module, not the guard: the guard redacts audit payloads on
// read, so importing it here would make the two modules import each other.
import { CREDENTIAL_FIELDS } from './credential-fields';

/** The placeholder a redacted value is replaced with. */
export const REDACTED = '[REDACTED]';

/** Deepest nesting walked; anything deeper is replaced wholesale. */
const MAX_DEPTH = 12;

/** Every credential column name across all models. */
export const CREDENTIAL_KEY_NAMES: ReadonlySet<string> = new Set(
  [...CREDENTIAL_FIELDS.values()].flatMap((fields) => [...fields])
);

/**
 * Whether `value` is Prisma's field-update form of an absent value: an object
 * whose only key is `set`, holding `null` or nothing. `{ set: null }` is how a
 * Prisma update clears a nullable column, and the generated CRUD functions
 * send every clear in that form (`removeUndefinedProps` in `src/utils.ts`
 * keeps it for that reason), so it is the same statement as a bare `null`.
 */
function isClearingUpdate(value: unknown): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  if (keys.length !== 1 || keys[0] !== 'set') return false;
  const assigned = (value as Record<string, unknown>).set;
  return assigned === null || assigned === undefined;
}

/**
 * Whether a credential key's value holds nothing: absent, `null`, or a
 * clearing update ({@link isClearingUpdate}). Such a value discloses nothing,
 * and replacing it would make a revoke read like a rotation.
 */
function holdsNoValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  return isClearingUpdate(value);
}

/**
 * A deep copy of `value` with every credential-named key's value replaced by
 * {@link REDACTED}. A credential value that holds nothing (absent, `null`, or
 * an update's `{ set: null }`) is kept as-is, so the audit row still shows
 * whether a credential was set, cleared or untouched.
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
      CREDENTIAL_KEY_NAMES.has(key) && !holdsNoValue(child)
        ? REDACTED
        : redactCredentials(child, depth + 1);
  }
  return out;
}

/** One value {@link redactCredentials} replaces, located by key path. */
export interface CredentialKeyPath {
  /** Dotted key path from the payload root, array indices included. */
  path: string;
  /**
   * Whether the replaced value held anything: a non-empty string, a number or
   * a boolean somewhere inside it. A key set to `""` or `{ set: "" }` is
   * replaced all the same, but it disclosed nothing.
   */
  carriesValue: boolean;
}

/**
 * Every place {@link redactCredentials} replaces a value in `value`, in
 * traversal order. It walks by the same rules (credential key names, the
 * exemption for a value that holds nothing, the depth limit), so it is empty
 * exactly when redaction leaves the payload as it was. Paths name keys only,
 * never values.
 *
 * @param value - Any JSON-shaped value.
 * @returns The replaced locations.
 */
export function credentialKeyPaths(value: unknown, depth = 0, path = ''): CredentialKeyPath[] {
  if (value === null || value === undefined) return [];
  if (depth >= MAX_DEPTH) return [{ path: path || '<root>', carriesValue: carriesValue(value) }];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => credentialKeyPaths(item, depth + 1, joinPath(path, String(index))));
  }
  if (typeof value !== 'object' || value instanceof Date) return [];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    CREDENTIAL_KEY_NAMES.has(key) && !holdsNoValue(child)
      ? [{ path: joinPath(path, key), carriesValue: carriesValue(child) }]
      : credentialKeyPaths(child, depth + 1, joinPath(path, key))
  );
}

function joinPath(parent: string, key: string): string {
  return parent === '' ? key : `${parent}.${key}`;
}

/** Whether `value` holds a non-empty string, a number or a boolean anywhere. */
function carriesValue(value: unknown, depth = 0): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.length > 0;
  if (typeof value !== 'object') return true;
  // Too deep to inspect: assume it does, as the redaction assumes it must.
  if (depth >= MAX_DEPTH) return true;
  const children: unknown[] = Array.isArray(value) ? value : Object.values(value as Record<string, unknown>);
  return children.some((child) => carriesValue(child, depth + 1));
}

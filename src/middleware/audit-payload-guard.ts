/**
 * Audit payload guard: credential values inside `AuditLog` JSON payloads
 * reach only the principals allowed to read those payloads raw.
 *
 * ## Why this exists
 *
 * The audit trail records what each mutation asked for. An audit logger that
 * copies mutation variables verbatim stores a broker-key update's key and
 * secret in `changedFields` (`data.APIKey.set`, `data.APISecret.set`), and a
 * user create's nested account keys under
 * `input.alpacaAccounts.connectOrCreate[…].create`. Redacting payloads before
 * they are written does not reach rows already stored, and `AuditLog` is
 * readable by any principal the endpoint admits. Without this guard the
 * credential-field guard's server-only rule for a column is bypassed by
 * reading its copy in the audit trail.
 *
 * ## What it guards
 *
 * 1. **Output.** For a principal that may not read payloads raw, the value a
 *    payload column resolves to on any output type that carries it
 *    (`AuditLog`, `AuditLogGroupBy`, `CreateManyAndReturnAuditLog`, …) goes
 *    through {@link redactCredentials} before it leaves the resolver: each
 *    credential-named key's value is replaced and the rest of the payload is
 *    served as stored. The rule applies where the field resolves, so it covers
 *    root reads, aliases, fragments, bulk-write return rows and any type that
 *    nests `AuditLog`.
 * 2. **Predicates.** A filter, sort, cursor, `having`, `by` or `distinct` over
 *    a payload column is an oracle over whatever the payload holds:
 *    `changedFields: { path: ["data", "APISecret", "set"], string_starts_with: "a" }`
 *    reads a secret one character at a time without selecting it. Nothing in
 *    a JSON filter alone shows that it cannot reach a credential inside the
 *    payload, so every predicate over a payload column is refused for the
 *    same principals.
 *
 * `server` and `admin` principals read payloads raw; `user` and anonymous
 * callers read them redacted. The mode is the credential-field guard's
 * (`CREDENTIAL_FIELD_GUARD_MODE`, read per request): `shadow` serves payloads
 * as stored and counts every read that enforcement would change, `enforce`
 * redacts and refuses, `off` does neither.
 *
 * @module middleware/audit-payload-guard
 */

import type { GraphQLResolveInfo } from 'graphql';

import {
  credentialKeyPaths,
  redactCredentials,
  type CredentialKeyPath,
} from '../auth/credential-redaction';
import type { BackendPrincipal } from '../auth/token-verifier';
import { indexGeneratedTypes } from './generated-type-names';

/** JSON payload columns that can hold a copy of a credential, by model. */
export const AUDIT_PAYLOAD_FIELDS: ReadonlyMap<string, ReadonlySet<string>> = new Map<
  string,
  ReadonlySet<string>
>([['AuditLog', new Set(['changedFields', 'metadata'])]]);

/** Principal kinds that read audit payloads as stored. */
const RAW_READERS: ReadonlySet<BackendPrincipal['kind']> = new Set<BackendPrincipal['kind']>([
  'server',
  'admin',
]);

const AUDIT_PAYLOAD_TYPES = indexGeneratedTypes(AUDIT_PAYLOAD_FIELDS);

/** Whether `principal` reads audit payloads as stored. */
export function readsAuditPayloadRaw(principal: BackendPrincipal | null): boolean {
  return principal !== null && RAW_READERS.has(principal.kind);
}

/**
 * The payload columns an output type carries as values, or `undefined`.
 *
 * @internal Exported for the schema-coverage test.
 */
export function auditPayloadOutputFieldsFor(typeName: string): ReadonlySet<string> | undefined {
  return AUDIT_PAYLOAD_TYPES.outputFields(typeName);
}

/**
 * The payload columns an input type's keys can reference as a predicate, or
 * `undefined`.
 *
 * @internal Exported for the input walk and the schema-coverage test.
 */
export function auditPayloadPredicateFieldsFor(typeName: string): ReadonlySet<string> | undefined {
  return AUDIT_PAYLOAD_TYPES.predicateFields(typeName);
}

/**
 * The payload columns a `<Model>ScalarFieldEnum` can name, or `undefined`.
 *
 * @internal Exported for the input walk and the schema-coverage test.
 */
export function auditPayloadEnumFieldsFor(typeName: string): ReadonlySet<string> | undefined {
  return AUDIT_PAYLOAD_TYPES.enumFields(typeName);
}

/** The payload column this resolver outputs, as `TypeName.field`, if any. */
export function auditPayloadOutputField(
  info: Pick<GraphQLResolveInfo, 'parentType' | 'fieldName'>
): string | undefined {
  return AUDIT_PAYLOAD_TYPES.outputFields(info.parentType.name)?.has(info.fieldName)
    ? `${info.parentType.name}.${info.fieldName}`
    : undefined;
}

/** A payload as a principal that may not read it raw receives it. */
export interface AuditPayloadRedaction {
  /** The payload with every credential value replaced. */
  redacted: unknown;
  /** Where the replaced values were; empty when the payload held none. */
  paths: CredentialKeyPath[];
}

/**
 * Redact one payload value and say where its credentials were.
 *
 * @param value - The value a payload column resolved to.
 * @returns The redacted copy and the replaced key paths.
 */
export function redactAuditPayload(value: unknown): AuditPayloadRedaction {
  return { redacted: redactCredentials(value), paths: credentialKeyPaths(value) };
}

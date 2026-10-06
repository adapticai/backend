/**
 * Stored-credential values never reach an `AuditLog` row written through the
 * server's Prisma client, whoever writes it.
 *
 * ## Why this exists
 *
 * An audit row is readable far more widely than the credential column it
 * copies, so a key stored in one is a second, unguarded copy of the secret.
 * The GraphQL audit plugin (`./audit-logger`) and the TradingPolicy audit
 * trail (`./trading-policy-audit`) each redact the payload they build, but a
 * row can be written without either of them: the generated
 * `createOneAuditLog`, `createManyAuditLog`, `createManyAndReturnAuditLog`,
 * `updateOneAuditLog`, `updateManyAuditLog` and `upsertOneAuditLog` mutations
 * hand their arguments to Prisma as the caller sent them, and so would any
 * other server-side `auditLog` write. Redaction that depends on each writer
 * remembering to call it holds only for the writers that remember.
 *
 * This extension applies the redaction where every one of those paths
 * converges — the Prisma client the server hands to resolvers, plugins and
 * guards — so it holds regardless of caller. In every row an `AuditLog`
 * operation writes (under `data`, `create` or `update`, one row or many),
 * each column value that holds a credential-named key is replaced by its
 * {@link redactCredentials} copy before the query engine sees it: the same
 * function and key set the audit payload guard applies on read, so a stored
 * row is already what an unprivileged reader is served. The operation is
 * recognised by the arguments it carries rather than by its name, so a write
 * operation Prisma adds later is covered without an edit here.
 *
 * ## Why redaction by key name is enough here
 *
 * The rule recognises a credential by the name of the key that holds it, so
 * it holds when every recorded value sits under its column's own name. The
 * audit plugin, the one writer that records what callers send, resolves each
 * mutation's arguments from the executed field, so a credential passed as
 * `APIKey: $key` is recorded at `input.APIKey` rather than under the
 * operation's variable name; and the vocabulary is held to every
 * credential-shaped column in the Prisma schema by its own test. A caller
 * that writes an audit row directly and stores a credential under a name that
 * is no credential column's is not recognised: no rule keyed on names can see
 * it, and one keyed on value shapes would rewrite credential-free rows.
 *
 * ## What it leaves alone, and what it replaces without a credential
 *
 * A column value in which redaction would replace nothing
 * ({@link credentialKeyPaths} is empty) is passed on exactly as received, so
 * a row without a credential is written as the unextended client would write
 * it — including Prisma's `DbNull` / `JsonNull` sentinels and `Date` values,
 * which a redaction pass would otherwise turn into `{}` and an ISO string. A
 * credential key that holds nothing (absent, `null`, or an update's
 * `{ set: null }`) replaces nothing, so a clear stays visible as a clear.
 * Reads, deletes and filters carry no row payload and pass through untouched.
 *
 * The redaction walks a value only to a fixed depth (`MAX_DEPTH` in
 * `auth/credential-redaction`): whatever sits 12 or more levels inside a
 * column value cannot be inspected, so it is replaced with the placeholder
 * whether or not it holds a credential, and that column is not passed on
 * unchanged. Treating a value it cannot inspect as a credential is the
 * fail-closed choice, and it is the same limit the audit plugin, the
 * TradingPolicy trail and the read guard apply.
 *
 * @module middleware/audit-log-write-redaction
 */

import type { PrismaClient } from '@prisma/client';

import { credentialKeyPaths, redactCredentials } from '../auth/credential-redaction';

/** Argument keys through which a Prisma operation writes row content. */
export const ROW_PAYLOAD_ARGS = ['data', 'create', 'update'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** One row with each credential-bearing column value redacted; the same row when none is. */
function redactRow(row: unknown): unknown {
  if (!isRecord(row)) return row;
  let out: Record<string, unknown> | undefined;
  for (const [column, value] of Object.entries(row)) {
    if (credentialKeyPaths(value).length === 0) continue;
    out ??= { ...row };
    out[column] = redactCredentials(value);
  }
  return out ?? row;
}

/** A row payload (one row or many) redacted; the same payload when nothing needed it. */
function redactPayload(payload: unknown): unknown {
  if (!Array.isArray(payload)) return redactRow(payload);
  const rows = payload.map(redactRow);
  return rows.some((row, index) => row !== payload[index]) ? rows : payload;
}

/**
 * The arguments of an `AuditLog` operation with every credential value in the
 * rows it writes redacted. Returns the same object when nothing needed
 * redacting, so an operation without a credential reaches Prisma unchanged.
 *
 * @param args - The operation's arguments as Prisma received them.
 * @returns The arguments to execute.
 */
export function redactAuditLogWriteArgs<T>(args: T): T {
  if (!isRecord(args)) return args;
  let out: Record<string, unknown> | undefined;
  for (const key of ROW_PAYLOAD_ARGS) {
    const payload = args[key];
    if (payload === undefined) continue;
    const redacted = redactPayload(payload);
    if (redacted === payload) continue;
    out ??= { ...args };
    out[key] = redacted;
  }
  // Cast justified: `out` is `args` with row payloads replaced by redacted
  // copies of the same shape, so it satisfies whatever `args` satisfied.
  return (out ?? args) as T;
}

/**
 * Apply AuditLog write redaction to a Prisma client.
 *
 * @param client - The client to wrap.
 * @returns The client with every `AuditLog` write redacted.
 */
export function withAuditLogWriteRedaction(client: PrismaClient): PrismaClient {
  const extended = client.$extends({
    name: 'audit-log-write-redaction',
    query: {
      auditLog: {
        $allOperations({ args, query }) {
          return query(redactAuditLogWriteArgs(args));
        },
      },
    },
  });
  // Prisma types an extended client as a structurally distinct object even
  // though this extension only rewrites query arguments and adds, removes and
  // renames nothing on the model surface; the assertion states that at this
  // one boundary, as `withFindManyGuard` does.
  return extended as unknown as PrismaClient;
}

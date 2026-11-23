/**
 * A reserved authority column re-sent unchanged is not a write of it.
 *
 * The generated `adaptic.<model>.update(props)` client builds its payload
 * from every field of the object it is given, so a caller who fetches an
 * organization and passes it back sends `kind: { set: <its current kind> }`
 * (and a membership's `entityScopeAll` / `entityScopeIds`, an entity's office
 * and parent) whether or not they meant to change it. Those columns are
 * reserved from users ({@link RESERVED_COLUMNS}), so such an update would be
 * refused in every mode even though it changes nothing.
 *
 * Before the mutation guard decides a user's single-row update, this reads
 * the row's reserved columns and drops every reserved `set` whose value equals
 * the stored one: the write it removes is the identity, so the row the
 * mutation leaves is byte-identical with or without it. A reserved column set
 * to a DIFFERENT value is left in place for the guard to refuse, and nothing
 * is dropped for the service or an admin (they may set these columns), for a
 * bulk or upsert write, or when the row cannot be read.
 *
 * @module middleware/reserved-column-echo
 */

import { isDeepStrictEqual } from 'node:util';

import type { MutationTarget } from '../auth/mutation-authorization';
import type { BackendPrincipal } from '../auth/token-verifier';
import { RESERVED_COLUMNS } from '../auth/user-write-content';
import { logger } from '../utils/logger';

/** The narrow delegate the echo check reads a row through. */
export interface EchoRowReader {
  findUnique(args: {
    where: Record<string, unknown>;
    select: Record<string, true>;
  }): Promise<Record<string, unknown> | null>;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

/**
 * The reserved scalar keys of `data` that re-send the stored value
 * unchanged, in the `{ set: value }` form the generated client writes. Pure.
 *
 * @param model - The model being updated.
 * @param data - The update payload.
 * @param stored - The row's stored reserved columns.
 * @returns The keys whose write is the identity.
 */
export function echoedReservedKeys(
  model: string,
  data: Record<string, unknown>,
  stored: Record<string, unknown>
): string[] {
  const reserved = RESERVED_COLUMNS.get(model);
  if (!reserved) return [];
  return Object.keys(data).filter((key) => {
    if (!reserved.has(key) || !(key in stored)) return false;
    const op = asRecord(data[key]);
    if (!op || Object.keys(op).length !== 1 || !('set' in op)) return false;
    return isDeepStrictEqual(op.set, stored[key]);
  });
}

/**
 * Drop, in place, the reserved columns a user's single-row update re-sends
 * unchanged (see the module doc).
 *
 * @param principal - The verified caller.
 * @param target - The classified root mutation.
 * @param args - The mutation's arguments; `data` is edited in place.
 * @param readerFor - The row reader for a model, or `undefined` when none.
 */
export async function dropEchoedReservedColumns(
  principal: Pick<BackendPrincipal, 'kind'> | null,
  target: Pick<MutationTarget, 'model' | 'action' | 'cardinality'>,
  args: Record<string, unknown>,
  readerFor: (model: string) => EchoRowReader | undefined
): Promise<void> {
  if (principal?.kind !== 'user') return;
  if (target.action !== 'update' || target.cardinality !== 'one') return;
  const reserved = RESERVED_COLUMNS.get(target.model);
  const data = asRecord(args.data);
  const where = asRecord(args.where);
  if (!reserved || !data || !where) return;
  const scalarKeys = Object.keys(data).filter(
    (key) => reserved.has(key) && asRecord(data[key])?.set !== undefined
  );
  if (scalarKeys.length === 0) return;
  const reader = readerFor(target.model);
  if (!reader) return;
  let stored: Record<string, unknown> | null;
  try {
    stored = await reader.findUnique({
      where,
      select: Object.fromEntries(scalarKeys.map((key) => [key, true as const])),
    });
  } catch (error: unknown) {
    // An unreadable row is decided as sent, so the guard refuses the reserved
    // write: failing to read can only refuse an echo, never admit a change.
    logger.warn('[mutation-auth] reserved-column echo check could not read the row; deciding the write as sent', {
      model: target.model,
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
  if (!stored) return;
  for (const key of echoedReservedKeys(target.model, data, stored))
    delete data[key];
}

/**
 * The canonical hash of a strategy spec, which binds a recorded backtest to
 * the exact spec it was run against (`Strategy.backtestSpecHash`).
 *
 * The spec is stored as `jsonb`, which does not keep object key order, so a
 * hash over `JSON.stringify` of the stored value would change on a round trip
 * that changed nothing. The canonical form sorts object keys recursively and
 * keeps array order (array order is meaningful: a constituent list is
 * ordered). The platform computes the same form
 * (`apps/web/app/api/desk/strategies/_lib/spec-hash.ts`); both carry the same
 * fixed test vector, so a divergence in either is a red test, not a silent
 * refusal of every submission.
 *
 * @module resolvers/custom/strategy-spec-hash
 */

import { createHash } from 'node:crypto';

/**
 * The canonical JSON text of a value: object keys sorted, no whitespace.
 *
 * @param value - A JSON value.
 * @returns Its canonical text.
 * @throws {TypeError} When the value is not representable as JSON (a function,
 *   a symbol, `undefined`, or a non-finite number).
 */
export function canonicalJson(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'string' || typeof value === 'boolean')
    return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value))
      throw new TypeError('A spec number must be finite');
    return JSON.stringify(value);
  }
  if (Array.isArray(value))
    return `[${value.map((item) => canonicalJson(item)).join(',')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(',')}}`;
  }
  throw new TypeError(`A spec cannot hold a ${typeof value}`);
}

/**
 * The SHA-256 (hex) of a spec's canonical JSON.
 *
 * @param spec - The spec.
 * @returns 64 lowercase hex characters.
 */
export function specHash(spec: unknown): string {
  return createHash('sha256').update(canonicalJson(spec), 'utf8').digest('hex');
}

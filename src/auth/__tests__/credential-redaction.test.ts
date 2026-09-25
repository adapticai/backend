/**
 * The redaction vocabulary against the Prisma schema.
 *
 * Redaction is directed by key name and matches exact-case, so it protects a
 * stored column only when that column's field name is in the vocabulary. The
 * audit logger records every value under its schema path, whose last segment
 * is the field name, so the field names in `prisma/schema.prisma` are the
 * vocabulary that has to be complete. The served-schema coverage harness
 * checks output fields; this checks every column, including one a generator
 * directive might hide from output while it stays writable.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';

import { CREDENTIAL_FIELDS } from '../credential-fields';
import { REDACTED, redactCredentials } from '../credential-redaction';

const SCHEMA_PATH = resolve(__dirname, '../../../prisma/schema.prisma');

/** Column types that can hold a credential's value. */
const VALUE_TYPES: ReadonlySet<string> = new Set(['String', 'Json', 'Bytes']);

/** Same name fragments the coverage harness uses to mark an output field. */
const CREDENTIAL_SHAPED = /(secret|password|passwd|api_?key|private_?key|(^|_)token$|[a-z]Token$|^token$)/i;

interface Column {
  model: string;
  field: string;
  type: string;
}

/** Every model field whose type holds a value, as the schema declares it. */
function valueColumns(schema: string): Column[] {
  const columns: Column[] = [];
  let model: string | null = null;
  for (const line of schema.split('\n')) {
    const header = /^model\s+(\w+)\s*\{/.exec(line);
    if (header) {
      model = header[1];
      continue;
    }
    if (/^\}/.test(line)) {
      model = null;
      continue;
    }
    const field = /^\s+(\w+)\s+(\w+)(\[\])?\??(\s|$)/.exec(line);
    if (model && field && VALUE_TYPES.has(field[2])) {
      columns.push({ model, field: field[1], type: field[2] });
    }
  }
  return columns;
}

const COLUMNS = valueColumns(readFileSync(SCHEMA_PATH, 'utf8'));

describe('credential vocabulary covers the schema', () => {
  it('reads the schema it checks', () => {
    // A parser that found nothing would pass every check below.
    expect(COLUMNS.length).toBeGreaterThan(100);
    expect(COLUMNS).toContainEqual({ model: 'BrokerageAccount', field: 'apiKey', type: 'String' });
  });

  it('names every credential-shaped column under its own model', () => {
    const unguarded = COLUMNS.filter(
      ({ model, field }) =>
        CREDENTIAL_SHAPED.test(field) && !(CREDENTIAL_FIELDS.get(model)?.has(field) ?? false)
    ).map(({ model, field }) => `${model}.${field}`);

    expect(unguarded).toEqual([]);
  });

  it('names only columns the schema has, spelled as the schema spells them', () => {
    const declared = new Set(COLUMNS.map(({ model, field }) => `${model}.${field}`));
    const stale = [...CREDENTIAL_FIELDS].flatMap(([model, fields]) =>
      [...fields].map((field) => `${model}.${field}`).filter((name) => !declared.has(name))
    );

    expect(stale).toEqual([]);
  });

  it('replaces the value of every credential column, wherever it sits', () => {
    for (const [model, fields] of CREDENTIAL_FIELDS) {
      for (const field of fields) {
        const payload = { input: { [field]: 'x', nested: [{ [field]: { set: 'x' } }] } };
        expect(redactCredentials(payload), `${model}.${field}`).toEqual({
          input: { [field]: REDACTED, nested: [{ [field]: REDACTED }] },
        });
      }
    }
  });
});

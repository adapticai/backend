/**
 * Post-generation fix for natural-key where clauses.
 *
 * The code generator decides which fields go into a `WhereUniqueInput` by a
 * name heuristic (`isUniqueField` in src/modules/generator.ts), not from the
 * schema. For a model whose natural key is a compound unique, or a single
 * unique column whose name the heuristic does not list, the generated
 * update / upsert / delete / get calls therefore send filter-style fields
 * (`{ userId: { equals } }`) that Prisma's `WhereUniqueInput` cannot key on,
 * and a call without `id` fails with "needs at least one of id or ...". This
 * script rewrites those where clauses after `generate:functions` runs.
 *
 * Patched models:
 *   - EquityBar: compound `symbol_timeStamp_timespan` (filter-style `symbol`
 *     replaced inside update/upsert where blocks).
 *   - Follow: `id`, else the compound `userId_fundId_targetKind_targetId`.
 *   - PushSubscription: `id`, else the unique `endpoint`.
 *
 * A model listed here whose generated file no longer has the expected shape
 * fails the build: a silently unpatched natural key is the defect this file
 * exists to prevent.
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');

function fail(message) {
  console.error(`fix-compound-unique-keys: ${message}`);
  process.exit(1);
}

function patchEquityBar() {
  const file = path.join(SRC, 'EquityBar.ts');
  if (!fs.existsSync(file)) fail('src/EquityBar.ts not found');

  const content = fs.readFileSync(file, 'utf-8');
  let patchCount = 0;

  // Match the filter-style symbol where clause inside upsert/update where blocks:
  // the id line followed by a symbol: { equals } line.
  const brokenPattern =
    /( +where: \{\n +id: props\.id !== undefined \? props\.id : undefined,\n) +symbol: props\.symbol !== undefined \? \{\n +equals: props\.symbol *\n +\} : undefined,\n( +\},)/g;

  const replacement = (match, prefix, suffix) => {
    patchCount++;
    return `${prefix}  ...(props.symbol !== undefined && props.timeStamp !== undefined && props.timespan !== undefined ? {\n    symbol_timeStamp_timespan: {\n      symbol: props.symbol,\n      timeStamp: props.timeStamp,\n      timespan: props.timespan,\n    },\n  } : {}),\n${suffix}`;
  };

  const newContent = content.replace(brokenPattern, replacement);
  if (patchCount === 0) {
    if (content.includes('symbol_timeStamp_timespan: {')) {
      console.log('EquityBar.ts: compound key where clauses already patched');
      return;
    }
    fail('EquityBar.ts: compound key where-clause pattern not found');
  }
  fs.writeFileSync(file, newContent, 'utf-8');
  console.log(
    `EquityBar.ts: patched ${patchCount} compound unique key where clause(s)`
  );
}

/**
 * The value expression for one key field: the scalar when set, otherwise the
 * id of the relation object the generated create input connects through
 * (`user: { id }`), so a caller passing only the relation still keys on it.
 *
 * @param {{ name: string, relation?: string }} field
 */
function fieldValue(field) {
  return field.relation
    ? `(props.${field.name} !== undefined ? props.${field.name} : props.${field.relation}?.id)`
    : `props.${field.name}`;
}

/**
 * The where-clause body for a natural key: `id` when the caller passed one,
 * otherwise the natural key when every field of it is present.
 *
 * @param {{ compound: string | null, fields: Array<{ name: string, relation?: string }> }} key
 * @param {string} indent
 */
function naturalWhereBody(key, indent) {
  const allPresent = key.fields
    .map((f) => `${fieldValue(f)} !== undefined`)
    .join(' && ');
  const lines = [`${indent}id: props.id !== undefined ? props.id : undefined,`];
  if (key.compound) {
    lines.push(`${indent}...(props.id === undefined && ${allPresent} ? {`);
    lines.push(`${indent}  ${key.compound}: {`);
    for (const f of key.fields) {
      lines.push(`${indent}    ${f.name}: ${fieldValue(f)},`);
    }
    lines.push(`${indent}  },`);
    lines.push(`${indent}} : {}),`);
  } else {
    const [f] = key.fields;
    const value = fieldValue(f);
    lines.push(
      `${indent}${f.name}: props.id === undefined && ${value} !== undefined ? ${value} : undefined,`
    );
  }
  return lines.join('\n');
}

/** Index of the `}` closing the `{` at `open`. */
function matchingBrace(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

const WHERE_OPEN = /where: (?:whereInput \? whereInput : )?\{/;

/**
 * Rewrite the top-level `where` of every operation in a model file that takes
 * a `<Model>WhereUniqueInput!` (updateOne, upsertOne, deleteOne, get).
 *
 * @param {string} model
 * @param {{ compound: string | null, fields: Array<{ name: string, relation?: string }> }} key
 */
function patchNaturalKey(model, key) {
  const file = path.join(SRC, `${model}.ts`);
  if (!fs.existsSync(file)) fail(`src/${model}.ts not found`);
  let content = fs.readFileSync(file, 'utf-8');
  const marker = `$where: ${model}WhereUniqueInput!`;
  const signature = key.compound
    ? `${key.compound}: {`
    : `${key.fields[0].name}: props.id === undefined`;

  let from = 0;
  let operations = 0;
  let patched = 0;
  for (;;) {
    const at = content.indexOf(marker, from);
    if (at < 0) break;
    operations++;
    const vars = content.indexOf('const variables = {', at);
    if (vars < 0) fail(`${model}.ts: no variables block after ${marker}`);
    const whereMatch = content.slice(vars).match(WHERE_OPEN);
    if (!whereMatch || whereMatch.index === undefined)
      fail(`${model}.ts: no where block after ${marker}`);
    const open = vars + whereMatch.index + whereMatch[0].length - 1;
    const close = matchingBrace(content, open);
    if (close < 0) fail(`${model}.ts: unbalanced where block`);
    const body = content.slice(open + 1, close);
    if (body.includes(signature)) {
      from = close;
      continue;
    }
    const replacement = `{\n${naturalWhereBody(key, '            ')}\n          }`;
    content = content.slice(0, open) + replacement + content.slice(close + 1);
    patched++;
    from = open + replacement.length;
  }

  const EXPECTED_OPERATIONS = 4; // updateOne, upsertOne, deleteOne, get
  if (operations !== EXPECTED_OPERATIONS) {
    fail(
      `${model}.ts: expected ${EXPECTED_OPERATIONS} WhereUniqueInput operations, found ${operations}`
    );
  }
  fs.writeFileSync(file, content, 'utf-8');
  console.log(
    `${model}.ts: natural key where clauses patched in ${patched} of ${operations} operation(s)`
  );
}

patchEquityBar();
patchNaturalKey('Follow', {
  compound: 'userId_fundId_targetKind_targetId',
  fields: [
    { name: 'userId', relation: 'user' },
    { name: 'fundId', relation: 'fund' },
    { name: 'targetKind' },
    { name: 'targetId' },
  ],
});
patchNaturalKey('PushSubscription', {
  compound: null,
  fields: [{ name: 'endpoint' }],
});

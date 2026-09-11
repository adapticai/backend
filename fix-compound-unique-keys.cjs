/**
 * Post-generation fix for compound unique key where clauses.
 *
 * The code generator produces filter-style where clauses
 * (e.g. { symbol: { equals: value } }) for models that use compound
 * unique keys. Prisma's WhereUniqueInput requires the compound key
 * object instead. This script patches the generated files after
 * generate:functions runs.
 *
 * Currently patches: EquityBar (symbol_timeStamp_timespan)
 */

const fs = require('fs');
const path = require('path');

const EQUITY_BAR_PATH = path.join(__dirname, 'src', 'EquityBar.ts');

function patchEquityBar() {
  if (!fs.existsSync(EQUITY_BAR_PATH)) {
    console.log('EquityBar.ts not found, skipping compound key patch');
    return;
  }

  let content = fs.readFileSync(EQUITY_BAR_PATH, 'utf-8');
  let patchCount = 0;

  // Match the broken filter-style symbol where clause inside upsert/update where blocks
  // Pattern: id line followed by symbol: { equals } line — only in where blocks (not data/update blocks)
  const brokenPattern =
    /( +where: \{\n +id: props\.id !== undefined \? props\.id : undefined,\n) +symbol: props\.symbol !== undefined \? \{\n +equals: props\.symbol *\n +\} : undefined,\n( +\},)/g;

  const replacement = (match, prefix, suffix) => {
    patchCount++;
    return `${prefix}  ...(props.symbol !== undefined && props.timeStamp !== undefined && props.timespan !== undefined ? {\n    symbol_timeStamp_timespan: {\n      symbol: props.symbol,\n      timeStamp: props.timeStamp,\n      timespan: props.timespan,\n    },\n  } : {}),\n${suffix}`;
  };

  const newContent = content.replace(brokenPattern, replacement);

  if (patchCount === 0) {
    console.log(
      'EquityBar.ts: compound key where clauses already patched or pattern not found'
    );
    return;
  }

  fs.writeFileSync(EQUITY_BAR_PATH, newContent, 'utf-8');
  console.log(
    `EquityBar.ts: patched ${patchCount} compound unique key where clause(s)`
  );
}

patchEquityBar();

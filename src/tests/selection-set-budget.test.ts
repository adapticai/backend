import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

/**
 * Directory holding the generated per-model GraphQL selection sets. These
 * strings are embedded verbatim into every generated `adaptic.<model>.*`
 * operation, so their shape is the read contract the whole monorepo executes.
 */
const SELECTION_SET_DIR = path.join(__dirname, '../generated/selectionSets');

/**
 * Source of the server's own complexity ceiling. The cap is read from this file
 * rather than restated here so the budget asserted below cannot drift away from
 * the budget the server actually enforces.
 */
const COMPLEXITY_MIDDLEWARE = path.join(
  __dirname,
  '../middleware/query-complexity.ts'
);

/**
 * Reads the unauthenticated complexity ceiling from the query-complexity
 * middleware. The unauthenticated ceiling is the binding one: it is the
 * tightest limit the server applies, and a selection set above it is a
 * generated operation that fails before it executes for any caller that has not
 * yet presented a token.
 *
 * @returns The configured default unauthenticated maximum complexity.
 */
function readUnauthenticatedComplexityCap(): number {
  const src = readFileSync(COMPLEXITY_MIDDLEWARE, 'utf-8');
  const match = src.match(
    /const DEFAULT_MAX_COMPLEXITY_UNAUTHENTICATED\s*=\s*(\d+)/
  );
  if (!match) {
    throw new Error(
      'DEFAULT_MAX_COMPLEXITY_UNAUTHENTICATED not found in query-complexity middleware — ' +
        'the selection-set budget can no longer be checked against the real cap.'
    );
  }
  return Number(match[1]);
}

/**
 * Extracts the raw selection-set body from a generated module.
 *
 * @param file - Absolute path to a generated selection-set module.
 * @returns The selection-set body between the template-literal backticks.
 */
function readSelectionSet(file: string): string {
  const parts = readFileSync(file, 'utf-8').split('`');
  if (parts.length < 2) {
    throw new Error(`Generated selection set has no template literal: ${file}`);
  }
  return parts[1];
}

/**
 * Operation complexity of a query that requests one model through its generated
 * selection set.
 *
 * The server scores complexity with `simpleEstimator({ defaultComplexity: 1 })`,
 * which charges exactly one point per selected field, so the score is the field
 * count of the selection set plus one for the root field the operation selects
 * it under. Closing braces are punctuation and carry no cost.
 *
 * @param selectionSet - A generated selection-set body.
 * @returns The complexity the server will compute for an operation using it.
 */
function operationComplexity(selectionSet: string): number {
  const ROOT_FIELD_COST = 1;
  const fields = selectionSet
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line !== '}');
  return fields.length + ROOT_FIELD_COST;
}

/**
 * Names of every generated selection-set module, excluding the barrel.
 *
 * @returns Model names in directory order.
 */
function generatedModels(): string[] {
  return readdirSync(SELECTION_SET_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
    .map((f) => f.slice(0, -'.ts'.length));
}

describe('generated selection sets stay inside the server budget', () => {
  it('embeds no unbounded alert history in any read', () => {
    // AlpacaAccount.alerts is the one relation on the account whose row count
    // grows monotonically for the life of the account and is never pruned.
    // Embedded in a selection set it makes the cost and payload of an account
    // read scale with total alert history rather than with the account row, and
    // it rides transitively into every model that nests an account (User,
    // Customer, AccountRiskMetrics, StrategyHealthSnapshot). Account reads sit
    // on the live trading decision path, where a read that is O(history) is a
    // latency cliff that deepens every session. Alerts are read through the
    // Alert CRUD with an explicit account and status filter, which the
    // (alpacaAccountId, status) index serves in bounded time.
    const offenders = generatedModels().filter((model) =>
      /^\s*alerts\s*\{/m.test(
        readSelectionSet(path.join(SELECTION_SET_DIR, `${model}.ts`))
      )
    );
    expect(offenders).toEqual([]);
  });

  it('keeps every generated read under the enforced complexity ceiling', () => {
    // A selection set above the server's own ceiling is a generated operation
    // that is rejected during validation, before a resolver runs: the caller
    // gets an error where it expects a row, for every row, permanently. Growing
    // a model's relations can push a selection set over the line with no local
    // symptom, so the ceiling is asserted here against the value the server
    // enforces rather than left to be discovered in production.
    const cap = readUnauthenticatedComplexityCap();
    const overBudget = generatedModels()
      .map((model) => ({
        model,
        complexity: operationComplexity(
          readSelectionSet(path.join(SELECTION_SET_DIR, `${model}.ts`))
        ),
      }))
      .filter((entry) => entry.complexity > cap);
    expect(overBudget).toEqual([]);
  });

  it('scores complexity the way the server does', () => {
    // Pins the estimator model this budget depends on: one point per selected
    // field, nothing for closing braces, plus the root field. If the server
    // ever stops charging one point per field, this assertion is the thing that
    // has to change, and it fails loudly rather than letting the budget above
    // silently measure the wrong quantity.
    const ROOT_FIELD_COST = 1;
    const FIELDS = 4;
    expect(operationComplexity('\n  id\n  nested {\n    a\n    b\n  }\n')).toBe(
      FIELDS + ROOT_FIELD_COST
    );
  });
});

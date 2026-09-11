import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';
import { getDMMF } from '@prisma/internals';
import type { DMMF } from '@prisma/generator-helper';

/**
 * Stage-2 guardrails for the multi-strategy identity layer.
 *
 * Before Stage 2 a "strategy" was an enum label: `Trade.strategy` is a
 * `TradeStrategy` value defaulting to `TECHNICAL_ANALYSIS`, so a strategy had
 * no row, no owner, no capital, no opt-in relation and no lifecycle, and could
 * not be created at runtime. `Strategy` + `StrategySubscription` +
 * `Trade.strategyId` give it all five.
 *
 * Every assertion below protects a property that is load-bearing somewhere
 * outside this repo, and each one goes red if the schema is edited to remove
 * it:
 *
 * 1. `Strategy.key` must hold the SAME value space as the engine Tier A
 *    `StrategyRegistryEntry.key` (`String @unique @db.VarChar(64)`, e.g.
 *    `"core-equity-llm-v1"`), because the two tiers join on it. A widened,
 *    narrowed or non-unique key silently breaks that join.
 * 2. `@@unique([accountId, strategyId])` on the subscription is what makes
 *    "opted in twice" UNREPRESENTABLE rather than merely unlikely.
 * 3. `targetAllocationPct` must stay nullable WITH NO DEFAULT. The platform
 *    Strategies grid renders an absent allocation as an em-dash by explicit
 *    design; a `@default(0)` here would turn "no allocation decided" into a
 *    real 0% target and a zero-height bar — fabricated data.
 * 4. `Trade.strategyId` must stay OPTIONAL and the migration must not
 *    backfill it. Nothing on this database can establish which strategy a
 *    historical trade belonged to, so a backfill would invent an owner.
 * 5. `TradeStrategy` and `Trade.strategy` must SURVIVE. Deleting the enum
 *    here breaks every existing consumer; migrating off it is a later stage.
 * 6. `Allocation.alpacaAccountId` must stay `@unique`. That constraint is the
 *    reason the subscription is modelled on `Holding` rather than on
 *    `Allocation` — one allocation row per account, structurally. If it ever
 *    stops being unique, the rationale recorded in the schema is stale and
 *    should be re-derived rather than trusted.
 */

const SCHEMA_PATH = join(__dirname, '..', '..', 'prisma', 'schema.prisma');
const MIGRATIONS_DIR = join(__dirname, '..', '..', 'prisma', 'migrations');
const MIGRATION = '20260904000000_add_strategy_identity';

/** The one registered strategy key, shared with the engine Tier A ledger. */
const CORE_EQUITY_STRATEGY_KEY = 'core-equity-llm-v1';

let datamodel: DMMF.Datamodel;

/**
 * Look up a model in the parsed datamodel, failing loudly when absent.
 *
 * @param name - Prisma model name.
 * @returns The model node.
 */
function model(name: string): DMMF.Model {
  const found = datamodel.models.find((m) => m.name === name);
  if (!found) throw new Error(`model ${name} is missing from schema.prisma`);
  return found;
}

/**
 * Look up a field on a model, failing loudly when absent.
 *
 * @param modelName - Prisma model name.
 * @param fieldName - Field name on that model.
 * @returns The field node.
 */
function field(modelName: string, fieldName: string): DMMF.Field {
  const found = model(modelName).fields.find((f) => f.name === fieldName);
  if (!found) throw new Error(`${modelName}.${fieldName} is missing from schema.prisma`);
  return found;
}

/**
 * Read the Stage-2 migration SQL with `--` comment lines stripped, so
 * assertions match executable SQL only and the header prose (which names the
 * very things being asserted absent) cannot satisfy or defeat them.
 *
 * @returns Executable SQL of the Stage-2 migration.
 */
function migrationSql(): string {
  return readFileSync(join(MIGRATIONS_DIR, MIGRATION, 'migration.sql'), 'utf8')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');
}

beforeAll(async () => {
  const parsed = await getDMMF({ datamodel: readFileSync(SCHEMA_PATH, 'utf8') });
  datamodel = parsed.datamodel;
});

describe('Strategy is an entity, not an enum label', () => {
  it('Strategy.key is unique and shares the Tier A VarChar(64) value space', () => {
    const key = field('Strategy', 'key');
    expect(key.type).toBe('String');
    expect(key.isRequired).toBe(true);
    expect(key.isUnique).toBe(true);
    // Tier A: StrategyRegistryEntry.key is `String @unique @db.VarChar(64)`.
    expect(key.nativeType).toEqual(['VarChar', ['64']]);
    // `core-equity-llm-v1` — the key Stage 1 registered — must fit.
    expect(CORE_EQUITY_STRATEGY_KEY.length).toBeLessThanOrEqual(64);
  });

  it('Strategy carries an owner and a lifecycle, and is never live by default', () => {
    const owner = field('Strategy', 'ownerUserId');
    expect(owner.isRequired).toBe(false);

    const lifecycle = field('Strategy', 'lifecycleState');
    expect(lifecycle.type).toBe('StrategyLifecycleState');
    expect(lifecycle.default).toEqual('DRAFT');

    const lifecycleEnum = datamodel.enums.find((e) => e.name === 'StrategyLifecycleState');
    expect(lifecycleEnum?.values.map((v) => v.name)).toEqual([
      'DRAFT',
      'SHADOW',
      'ACTIVE',
      'PAUSED',
      'RETIRED',
    ]);
  });
});

describe('StrategySubscription: opting in twice is unrepresentable', () => {
  it('is keyed by a composite (accountId, strategyId) unique', () => {
    expect(model('StrategySubscription').uniqueFields).toContainEqual([
      'accountId',
      'strategyId',
    ]);
  });

  it('is modelled on Holding: Decimal money columns, not Float', () => {
    for (const name of ['units', 'costBasis', 'realizedPL'] as const) {
      const f = field('StrategySubscription', name);
      expect(f.type).toBe('Decimal');
      expect(f.isRequired).toBe(true);
    }
    expect(field('StrategySubscription', 'units').nativeType).toEqual([
      'Decimal',
      ['24', '10'],
    ]);
    expect(field('StrategySubscription', 'costBasis').nativeType).toEqual([
      'Decimal',
      ['18', '6'],
    ]);
  });

  it('targetAllocationPct is nullable with NO default so absence is never 0', () => {
    const alloc = field('StrategySubscription', 'targetAllocationPct');
    expect(alloc.isRequired).toBe(false);
    expect(alloc.hasDefaultValue).toBe(false);
    expect(alloc.default).toBeUndefined();
  });

  it('nests Strategy safely: every Strategy relation is excluded from GQL', () => {
    // `StrategySubscription.strategy` is nested in the generated selection set
    // so a subscription renders without a second round-trip. That is only safe
    // while Strategy's own relations are GQL.SKIP — otherwise the nested block
    // would drag User (a wide model) or recurse back through subscriptions.
    const relations = model('Strategy').fields.filter((f) => f.kind === 'object');
    expect(relations.map((f) => f.name).sort()).toEqual([
      'owner',
      'subscriptions',
      'trades',
    ]);
    for (const relation of relations) {
      expect(relation.documentation ?? '').toContain('GQL.SKIP=true');
    }
  });

  it('was NOT modelled on Allocation, whose account FK is structurally unique', () => {
    // The premise for choosing Holding as the template. If this ever stops
    // holding, the schema comment recording it is stale.
    expect(field('Allocation', 'alpacaAccountId').isUnique).toBe(true);
  });
});

describe('Trade gains an identity without losing the enum', () => {
  it('Trade.strategyId is optional and defaultless', () => {
    const f = field('Trade', 'strategyId');
    expect(f.isRequired).toBe(false);
    expect(f.hasDefaultValue).toBe(false);
  });

  it('TradeStrategy and Trade.strategy survive — no enum deletion', () => {
    const tradeStrategy = datamodel.enums.find((e) => e.name === 'TradeStrategy');
    expect(tradeStrategy).toBeDefined();
    expect(tradeStrategy!.values.length).toBeGreaterThan(0);

    const legacy = field('Trade', 'strategy');
    expect(legacy.type).toBe('TradeStrategy');
    expect(legacy.default).toEqual('TECHNICAL_ANALYSIS');
  });
});

describe('The Stage-2 migration is additive and fabricates nothing', () => {
  it('seeds exactly one strategy row, idempotently, in an inert state', () => {
    const sql = migrationSql();
    expect(sql.match(/INSERT INTO "strategies"/g)).toHaveLength(1);

    // Assert against the INSERT statement ALONE. The surrounding DDL contains
    // the literal 'ACTIVE' (it is a StrategyLifecycleState enum value), so a
    // whole-file assertion would be satisfied by the wrong text. The seed is
    // the last statement in the file, so slicing from its start is exact —
    // and a regex terminating on the first `;` is not, because the seeded
    // description itself contains one.
    const insert = sql.slice(sql.indexOf('INSERT INTO "strategies"')).trim();
    expect(insert.endsWith('DO NOTHING;')).toBe(true);
    expect(insert).toContain(CORE_EQUITY_STRATEGY_KEY);
    expect(insert).toContain('ON CONFLICT ("key") DO NOTHING');
    // Seeded inert: SHADOW never routes capital, so merging changes no
    // trading behaviour. Graduating it is a one-row UPDATE, not a code change.
    expect(insert).toContain("'SHADOW'");
    expect(insert).not.toContain("'ACTIVE'");
  });

  it('does not backfill Trade.strategyId and drops nothing', () => {
    const sql = migrationSql();
    expect(sql).not.toMatch(/UPDATE\s+"trades"/i);
    expect(sql).not.toMatch(/\bDROP\s+(TABLE|COLUMN|TYPE)\b/i);
    expect(sql).not.toMatch(/ALTER TABLE "trades"[\s\S]*?SET NOT NULL/i);
    // The new column must arrive nullable.
    expect(sql).toMatch(/ALTER TABLE "trades" ADD COLUMN\s+"strategyId" UUID;/);
  });
});

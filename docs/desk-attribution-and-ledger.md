# Desk attribution, mandate limit keys and the ledger sequence

The backend half of three desk contracts in platform `apps/web/docs/desk/engine-gaps.md`: desk attribution (G-DESK-01, G-ORD-01), mandate limit gauges (G-RISK-01) and the ledger feed (G-LED-01). The engine computes and serves the desk payloads; this package stores the fields those payloads are built from. Migration: `prisma/migrations/20261114110000_desk_attribution_ledger`.

## Strategy.desk

`Strategy.desk DeskType?` (`EVENT`, `THEMATIC`, `SYSTEMATIC`). Null means no operator has assigned the strategy to a desk. Nothing assigns one by default: the desk decides which autonomy matrix governs a strategy's orders and which desk's metrics its fills count toward, so an unassigned strategy stays unattributed rather than being placed on a guessed desk.

The engine attributes an order to the desk of the strategy that produced it (`Trade.strategyId` → `Strategy.desk`). The wire values in the desk contract are lowercase (`'event' | 'thematic' | 'systematic'`); the engine maps the enum to them.

Who may write it: the existing Strategy rule. Strategy is not in `MODEL_WRITE_RULES` (`src/auth/mutation-authorization.ts`), so it is `service_only` for a signed-in user, and only an admin principal (an operator) or the engine's service principal may set it. Strategy has no organization or fund column, so there is no tenant to scope a user write by. Strategy writes are decided in the guard's configured `MUTATION_AUTH_MODE`, like every model that had writers before the guard.

## MandateRule machine keys

| Field       | Type                      | Meaning                                                                                                                                                                                                          |
| ----------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ruleCode`  | `String? @db.VarChar(32)` | The code gauges and the ledger cite (`R-01`, `R-01b`). Unique per mandate version (`@@unique([mandateVersionId, ruleCode])`; nulls do not collide). Not blank (CHECK `mandate_rules_rule_code_not_blank_check`). |
| `metricKey` | `MandateMetric?`          | The measured quantity `threshold` bounds. Null for a qualitative clause.                                                                                                                                         |
| `action`    | `MandateAction?`          | `BLOCK`, `ESCALATE`, `HALT`, `DERISK` (wire `'block' \| 'escalate' \| 'halt' \| 'de-risk'`).                                                                                                                     |
| `group`     | `MandateRuleGroup?`       | `EXPOSURE`, `LOSS`, `LIQUIDITY`.                                                                                                                                                                                 |

A rule naming a `metricKey` is a limit gauge, and a gauge needs its cap, its action, its group and its code, so CHECK `mandate_rules_metric_complete_check` refuses a rule with a `metricKey` and no `threshold`, `action`, `group` or `ruleCode`. The enum columns are typed, so GraphQL refuses an unknown value before the database sees it.

`MandateMetric` lists only quantities the engine measures today, read at engine `origin/main` `8ca6167f2`:

| Value                       | Unit               | Engine computation                                                                                                                                                                     |
| --------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GROSS_LEVERAGE`            | multiple           | `src/websockets/handlers/risk-handler.ts:166-168` (gross / equity); risk-validation Stage 6 `currentLeverage` (`src/equities/orchestrate-trades/risk-validation-orchestrator.ts:2248`) |
| `NET_EXPOSURE_RATIO`        | fraction           | `risk-handler.ts:249-254` (\|net\| / gross, the `exposure_net` check)                                                                                                                  |
| `SINGLE_NAME_CONCENTRATION` | fraction of equity | `risk-handler.ts:143`; Stage 4 (`risk-validation-orchestrator.ts:1536-1560`)                                                                                                           |
| `MAX_SECTOR_CONCENTRATION`  | fraction of equity | `risk-handler.ts:153`; Stage 5 `maxSectorConcentration` (`risk-validation-orchestrator.ts:2084`)                                                                                       |
| `DAILY_LOSS`                | fraction of equity | Stage 9 `dailyPnL` against the daily-loss baseline (`risk-validation-orchestrator.ts:3651`)                                                                                            |
| `DRAWDOWN`                  | fraction           | Stage 10 `computeDrawdownFraction` from the equity high-water mark (`risk-validation-orchestrator.ts:3776`)                                                                            |
| `VAR_95`                    | currency           | `risk-handler.ts:191` (from `RiskMetricsCalculatorService`, omitted when unmeasurable)                                                                                                 |
| `VAR_99`                    | currency           | `risk-handler.ts:192`                                                                                                                                                                  |
| `EXPECTED_SHORTFALL_95`     | currency           | `risk-handler.ts:193-195`                                                                                                                                                              |
| `MARGIN_UTILIZATION`        | fraction           | `risk-handler.ts:174-179` (initial margin / equity)                                                                                                                                    |
| `OPEN_POSITIONS`            | count              | Stage 3 (`risk-validation-orchestrator.ts:1304`)                                                                                                                                       |

Left out because the engine does not measure them on a live path: ADV or volume participation (only `maxAdvParticipation` in `src/types/quantitative-types.ts:1500`, with no producer; the participation caps live in the backtest fill simulator) and the risk-handler drawdown fields, which the portfolio orchestrator passes as `undefined` (`src/services/portfolio/portfolio-orchestrator.ts:1892`) so the handler reports `0`. `DRAWDOWN` is listed because Stage 10 measures it. No `LIQUIDITY` metric exists yet; the group is there for qualitative liquidity clauses and the first measured one.

Mandate rules project into `TradingPolicy` on approval and the engine enforces `TradingPolicy`; these keys are what lets the engine report each enforced limit against the rule it came from.

## AuditLog ledger sequence

`AuditLog.fundId String? @db.Uuid` and `AuditLog.ledgerSeq BigInt? @unique`, indexed together (`@@index([fundId, ledgerSeq])`).

- `ledgerSeq` is assigned by Postgres from the sequence `audit_logs_ledger_seq` on every insert. It is omitted from the GraphQL create and update inputs (`@TypeGraphQL.omit(input: ["create", "update"])`), so neither a user nor the engine can choose a ledger position; it stays in the filter and order inputs so pages can be read.
- It is strictly increasing across all rows, and so increasing within every fund, with gaps. A dense per-fund counter would need a lock per fund on the write path of the busiest table in the database; the contract needs only monotonic ids.
- Rows written before this migration keep `ledgerSeq = NULL`. The column was added without a default and the default set afterwards, because a volatile default on `ADD COLUMN` would number every historical row in physical order, an order its timestamps do not establish.
- Like `userId`, `fundId` has no foreign key: an audit record outlives the row it names.

### How the engine reads `GET /api/v1/ledger?fundId&before&limit`

The engine writes a ledger entry as an `AuditLog` row with `fundId` set (`adaptic.auditLog.create({ ..., fundId })`), reads back the row's `ledgerSeq`, and serves it as `id: 'L-<ledgerSeq>'`. A page is one query on the generated GraphQL surface:

```graphql
query LedgerPage($fundId: String!, $before: BigInt!, $limit: Int!) {
  auditLogs(
    where: { fundId: { equals: $fundId }, ledgerSeq: { lt: $before } }
    orderBy: [{ ledgerSeq: { sort: desc } }]
    take: $limit
  ) {
    id
    timestamp
    userId
    modelName
    recordId
    operationName
    changedFields
    fundId
    ledgerSeq
  }
}
```

The first page omits the `ledgerSeq` bound. `next` is `L-<smallest ledgerSeq on the page>` when the page is full, else `null`. `adaptic.auditLog.findMany(props, client, whereInput)` takes the `where` above, but the generated helper sends neither `orderBy` nor `take`, so the engine runs the query through `getApolloClient()` directly.

Sequence values are drawn at insert, and two concurrent transactions can commit in the opposite order to the values they drew. Paging backwards with `before` is unaffected once both have committed. A live tail must not treat "highest id seen" as a watermark: it takes new entries from the `ledger:entry:new` event and dedupes by id.

The `tier`, `actor` and `text` fields of `LedgerEntry` are the engine's to derive from the row; this change adds no column for them.

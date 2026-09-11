-- Investor capital ledger: money and unit quantities move from DOUBLE
-- PRECISION to fixed-point NUMERIC (audit B01-backend-legacy-05). Float
-- accumulation on a capital ledger drifts (0.1+0.2 class errors compound
-- across subscriptions/redemptions/NAV math); NUMERIC is exact.
--  - currency amounts:      NUMERIC(18,6)  (sub-cent precision, 1e12 headroom)
--  - NAV per unit:          NUMERIC(18,8)
--  - fund units:            NUMERIC(24,10)
-- USING casts are exact for every representable double; tables shipped
-- 2026-07-10 and carry no production data volume that would make a
-- table-rewrite lock material.

ALTER TABLE "holdings"
  ALTER COLUMN "units" TYPE NUMERIC(24,10) USING "units"::numeric(24,10),
  ALTER COLUMN "units" SET DEFAULT 0,
  ALTER COLUMN "costBasis" TYPE NUMERIC(18,6) USING "costBasis"::numeric(18,6),
  ALTER COLUMN "costBasis" SET DEFAULT 0,
  ALTER COLUMN "realizedPL" TYPE NUMERIC(18,6) USING "realizedPL"::numeric(18,6),
  ALTER COLUMN "realizedPL" SET DEFAULT 0,
  ALTER COLUMN "distributionsPaid" TYPE NUMERIC(18,6) USING "distributionsPaid"::numeric(18,6),
  ALTER COLUMN "distributionsPaid" SET DEFAULT 0;

ALTER TABLE "investor_transactions"
  ALTER COLUMN "amount" TYPE NUMERIC(18,6) USING "amount"::numeric(18,6),
  ALTER COLUMN "units" TYPE NUMERIC(24,10) USING "units"::numeric(24,10),
  ALTER COLUMN "requestNav" TYPE NUMERIC(18,8) USING "requestNav"::numeric(18,8),
  ALTER COLUMN "executionNav" TYPE NUMERIC(18,8) USING "executionNav"::numeric(18,8),
  ALTER COLUMN "executedUnits" TYPE NUMERIC(24,10) USING "executedUnits"::numeric(24,10),
  ALTER COLUMN "fees" TYPE NUMERIC(18,6) USING "fees"::numeric(18,6),
  ALTER COLUMN "netAmount" TYPE NUMERIC(18,6) USING "netAmount"::numeric(18,6);

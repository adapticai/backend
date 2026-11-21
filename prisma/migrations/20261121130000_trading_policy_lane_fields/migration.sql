-- Carry the per-account multi-lane intraday controls on TradingPolicy.
--
-- laneTradingEnabled             the per-account opt-in. NOT NULL DEFAULT false,
--                                so every existing row reads false and stays
--                                disarmed.
-- laneMaxEntriesPerSymbolPerDay  the per-symbol, per-session entry cap. Nullable
--                                with no default: NULL means no cap was set,
--                                and a lane refuses to arm on such an account.
-- intradayLanePrefs              the lane preference object. Nullable with no
--                                default: NULL means the lanes are disarmed.
--
-- Additive only: no existing column is retyped or dropped and no row is
-- updated. On PostgreSQL 11+ an ADD COLUMN with a constant default is
-- catalogue-only, so this takes no table rewrite. Reversal:
--   ALTER TABLE "trading_policies" DROP COLUMN "intradayLanePrefs",
--     DROP COLUMN "laneMaxEntriesPerSymbolPerDay", DROP COLUMN "laneTradingEnabled";

-- AlterTable
ALTER TABLE "trading_policies" ADD COLUMN     "intradayLanePrefs" JSONB,
ADD COLUMN     "laneMaxEntriesPerSymbolPerDay" INTEGER,
ADD COLUMN     "laneTradingEnabled" BOOLEAN NOT NULL DEFAULT false;

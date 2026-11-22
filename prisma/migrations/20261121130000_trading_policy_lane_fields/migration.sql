-- Carry the per-account multi-lane intraday preferences on TradingPolicy.
--
-- intradayLanePrefs  the single carrier of the lane opt-in and the per-lane
--                    caps. Nullable with no default: NULL means the lanes are
--                    disarmed for the account.
--
-- Additive only: no existing column is retyped or dropped and no row is
-- updated. A nullable ADD COLUMN with no default is catalogue-only, so this
-- takes no table rewrite. Reversal:
--   ALTER TABLE "trading_policies" DROP COLUMN "intradayLanePrefs";

-- AlterTable
ALTER TABLE "trading_policies" ADD COLUMN     "intradayLanePrefs" JSONB;

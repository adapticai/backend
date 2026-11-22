/**
 * Narrow, hand-written reads of fields that the generated selection sets
 * deliberately leave out (`GQL.SKIP`). Each read selects only its own field and
 * the row's identity, so it fails alone and cannot take a generated read down
 * with it.
 *
 * @module readers
 */
export {
  readIntradayLanePrefs,
  INTRADAY_LANE_PREFS_SELECTION,
  type IntradayLanePrefsRow,
} from './intraday-lane-prefs';

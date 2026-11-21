/**
 * The read of one account's multi-lane intraday preferences
 * (`TradingPolicy.intradayLanePrefs`).
 *
 * The field is excluded from every generated selection set (`GQL.SKIP`). A
 * GraphQL server whose schema predates the column rejects the WHOLE operation
 * that selects it, and the generated TradingPolicy and AlpacaAccount selection
 * sets carry the engine's order-chokepoint policy read and its broker-credential
 * read. Leaving the field out of those reads keeps them working against a
 * server whether or not the migration has run. This read is the only place the
 * field is selected, so a server without the column fails this read alone.
 *
 * The read never turns a failure into a value. A transport or GraphQL error
 * throws, and so does an answer that omits the field. Only a backend that
 * answers "no policy row" yields `null`. The consumer (the engine's lane-arming
 * resolver) maps every one of these outcomes to "lanes disarmed". It never
 * blocks an exit, because the preferences govern entries only.
 *
 * @module readers/intraday-lane-prefs
 */
import type { TradingPolicy as TradingPolicyType } from '../generated/typegraphql-prisma/models/TradingPolicy';
import { getApolloClient, getApolloModules, type ApolloClientType, type NormalizedCacheObject } from '../client';

/** The fields this read selects, and nothing else. */
export const INTRADAY_LANE_PREFS_SELECTION = 'id alpacaAccountId intradayLanePrefs';

/** The backend's error message when no TradingPolicy row matches. */
const NO_POLICY_MESSAGE = 'No TradingPolicy found';

/** One account's lane preferences, as stored. */
export interface IntradayLanePrefsRow {
  /** The TradingPolicy row id. */
  readonly policyId: string;
  /** The account the policy governs. */
  readonly alpacaAccountId: string;
  /** The stored preferences; `null` when none are set (lanes disarmed). */
  readonly intradayLanePrefs: Exclude<TradingPolicyType['intradayLanePrefs'], undefined>;
}

/** The shape of the `getTradingPolicy` answer this read accepts. */
function rowOf(value: unknown): IntradayLanePrefsRow {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('readIntradayLanePrefs: the backend answered with no policy object');
  }
  const record = value as Record<string, unknown>;
  if (typeof record.id !== 'string' || typeof record.alpacaAccountId !== 'string') {
    throw new Error('readIntradayLanePrefs: the policy answer has no id or alpacaAccountId');
  }
  if (!('intradayLanePrefs' in record) || record.intradayLanePrefs === undefined) {
    throw new Error('readIntradayLanePrefs: the policy answer omits intradayLanePrefs');
  }
  return {
    policyId: record.id,
    alpacaAccountId: record.alpacaAccountId,
    intradayLanePrefs: record.intradayLanePrefs as IntradayLanePrefsRow['intradayLanePrefs'],
  };
}

/**
 * Read one account's lane preferences.
 *
 * @param alpacaAccountId - The account whose TradingPolicy to read.
 * @param globalClient - The backend client; the shared client when omitted.
 * @returns The stored preferences, or `null` when the account has no
 *   TradingPolicy row.
 * @throws When the backend fails, answers with errors (including a server
 *   whose schema predates the column), or answers without the field.
 */
export async function readIntradayLanePrefs(
  alpacaAccountId: string,
  globalClient?: ApolloClientType<NormalizedCacheObject>
): Promise<IntradayLanePrefsRow | null> {
  const [modules, client] = await Promise.all([
    getApolloModules(),
    globalClient ? Promise.resolve(globalClient) : getApolloClient(),
  ]);
  const query = modules.gql`
    query readIntradayLanePrefs($where: TradingPolicyWhereUniqueInput!) {
      getTradingPolicy(where: $where) {
        ${INTRADAY_LANE_PREFS_SELECTION}
      }
    }`;
  let response: { data?: { getTradingPolicy?: unknown } | null; errors?: ReadonlyArray<{ message: string }> };
  try {
    response = await client.query({
      query,
      variables: { where: { alpacaAccountId } },
      fetchPolicy: 'network-only',
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === NO_POLICY_MESSAGE) return null;
    throw error;
  }
  if (response.errors && response.errors.length > 0) {
    if (response.errors[0].message === NO_POLICY_MESSAGE) return null;
    throw new Error(`readIntradayLanePrefs: ${response.errors[0].message}`);
  }
  const policy = response.data?.getTradingPolicy;
  if (policy === null) return null;
  if (policy === undefined) {
    throw new Error('readIntradayLanePrefs: the backend answered with no getTradingPolicy field');
  }
  return rowOf(policy);
}

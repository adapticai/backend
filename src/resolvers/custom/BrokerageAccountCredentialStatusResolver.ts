/**
 * `BrokerageAccount.hasApiCredentials` — whether an account's broker API key
 * and secret are both stored, without reading either one.
 *
 * The credential columns are readable only by a service principal (see
 * `src/middleware/credential-field-guard.ts`), yet a client legitimately needs
 * to show whether an account is configured. Selecting the secret to test it
 * for emptiness would put the secret on the wire for a yes/no answer, so the
 * answer is computed here, where the row is already in memory, and only the
 * boolean leaves the server.
 *
 * @module resolvers/custom/BrokerageAccountCredentialStatusResolver
 */
import * as TypeGraphQL from 'type-graphql';

import { BrokerageAccount } from '../../generated/typegraphql-prisma/models/BrokerageAccount';

/** The two credential columns this resolver inspects on the parent row. */
type CredentialColumns = Pick<BrokerageAccount, 'apiKey' | 'apiSecret'>;

/**
 * True only when both credential columns hold a non-blank value.
 *
 * @param account - The parent row as the generated resolvers loaded it.
 * @returns Whether the account can authenticate to its broker.
 */
export function hasStoredApiCredentials(account: CredentialColumns): boolean {
  const present = (value: string | null | undefined): boolean =>
    typeof value === 'string' && value.trim().length > 0;
  return present(account.apiKey) && present(account.apiSecret);
}

/** Adds the computed `hasApiCredentials` field to `BrokerageAccount`. */
@TypeGraphQL.Resolver(() => BrokerageAccount)
export class BrokerageAccountCredentialStatusResolver {
  /**
   * Whether both the API key and secret are stored for this account.
   *
   * @param account - The parent `BrokerageAccount` row.
   * @returns `true` when both credential columns are non-blank.
   */
  @TypeGraphQL.FieldResolver(() => Boolean, {
    description:
      'Whether both broker API credential columns are stored. Readable by any caller that can read the account; the credentials themselves are not.',
  })
  hasApiCredentials(@TypeGraphQL.Root() account: BrokerageAccount): boolean {
    return hasStoredApiCredentials(account);
  }
}

import * as TypeGraphQL from 'type-graphql';

/**
 * Server-only credential material for a single {@link AlpacaAccount}.
 *
 * CORTEX-P0-001 (phase-2 readiness). This object type exists so that the engine
 * can eventually fetch Alpaca API credentials through a dedicated,
 * server-principal-gated query ({@link AlpacaAccountCredentialsResolver}) rather
 * than reading the ordinary `AlpacaAccount.APIKey` / `APISecret` fields that any
 * authenticated caller can currently select. It is the migration target that
 * MUST exist before those ordinary fields can be excised from the schema.
 *
 * Scope note: the fields returned here mirror exactly the credential columns the
 * engine reads off `AlpacaAccount` (`APIKey`, `APISecret`, plus the `type`
 * discriminator that selects the Alpaca base URL). OAuth-linked broker tokens
 * live on the separate `LinkedProvider` model and follow the same
 * server-only-resolver → excise pattern in a later, independent step (see the
 * enablement doc); they are intentionally out of scope for this object type so
 * it does not reference columns `AlpacaAccount` does not own.
 *
 * This type is NEVER exposed on a user-facing relation. It is returned only by
 * the `alpacaAccountCredentials` query, and only to a `server` principal. It is
 * intentionally not registered as a Prisma relation and carries no `@Authorized`
 * decorator — the resolver enforces the server-principal gate directly and fails
 * closed, independent of the (still shadow-mode) CORTEX authChecker.
 */
@TypeGraphQL.ObjectType('AlpacaAccountCredentials', {})
export class AlpacaAccountCredentials {
  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
    description: 'Identifier of the AlpacaAccount these credentials belong to.',
  })
  accountId!: string;

  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
    description:
      'Account type discriminator (PAPER or LIVE) — selects the Alpaca base URL.',
  })
  type!: string;

  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
    description: 'Alpaca API key used to authenticate broker requests.',
  })
  APIKey!: string;

  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
    description: 'Alpaca API secret used to authenticate broker requests.',
  })
  APISecret!: string;
}

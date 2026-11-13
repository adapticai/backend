# Desk preferences (DAT-013)

Desk preferences are not a model. They are one `Configuration` row per user, in the per-user preference namespace the platform already uses for chart, trading and notification preferences. A dedicated `UserPreference` table was considered and dropped: it would have been a fourth store for the same class of data, and the `Configuration` namespace is already user-writable under a guard.

## Key

```text
platform.web.desk-preferences.user.<userId>
```

`<userId>` is the backend `User.id` (a lowercase UUID) of the signed-in user. The key matches the per-user pattern in `src/auth/user-write-content.ts` (`USER_CONFIG_KEY`, `^platform\.web\.[a-z0-9][a-z0-9-]*\.user\.([0-9a-f-]{36})$`), so a `user` principal may upsert it only when `<userId>` is their own id (`src/tests/desk-preferences-key.test.ts` proves both directions).

## Row

| Column        | Value                                                         |
| ------------- | ------------------------------------------------------------- |
| `configKey`   | the key above                                                 |
| `type`        | `USER_PREFERENCE`                                             |
| `scope`       | `platform-web`                                                |
| `description` | `Per-user trading desk preferences, managed by the platform.` |
| `configValue` | the document below                                            |

## Value

```ts
interface DeskPreferencesV1 {
  version: 1;
  /** Colour theme (TOK-004). */
  theme?: 'dark' | 'light';
  /** The three account-menu quick toggles (SHL-006). */
  notifications?: {
    pushEscalations?: boolean;
    dailyDigest?: boolean;
    soundOnDecision?: boolean;
  };
  /** The last Markets lens and its filters. */
  markets?: {
    lens?: string;
    filters?: Record<string, string | string[] | boolean>;
  };
  /** Chart timeframe and overlays. */
  charts?: {
    timeframe?: string;
    overlays?: string[];
  };
}
```

Every member except `version` is optional. An absent member means the user has not chosen; the platform applies its own default and never writes the default back as though the user had chosen it. `version` lets a later shape be told apart from this one.

Availability is not a preference: it is `User.availability` / `User.availabilityUntil` (G-USR-01), because deputy routing on the server reads it.

## Reading and writing

Read:

```graphql
query ($configKey: String!) {
  configuration(where: { configKey: $configKey }) {
    id
    configValue
  }
}
```

`null` means the user has never saved preferences.

Write, as the signed-in user. The guard admits it only when `where` names exactly the key, `create.configKey` is the same key, and `update` does not set `configKey`:

```graphql
mutation ($configKey: String!, $configValue: JSON!) {
  upsertOneConfiguration(
    where: { configKey: $configKey }
    create: {
      configKey: $configKey
      configValue: $configValue
      type: USER_PREFERENCE
      scope: "platform-web"
      description: "Per-user trading desk preferences, managed by the platform."
    }
    update: { configValue: $configValue }
  ) {
    id
  }
}
```

The write replaces `configValue` whole, so the caller reads, merges and writes the full document.

## Known boundary

`Configuration` has no `userId` column, so the tenancy middleware does not scope its reads: an authenticated caller who knows another user's id can read that user's key. The platform route derives the key from the session and never accepts one from the client, so the platform surface does not expose it; the raw GraphQL read is the same boundary the chart, trading and notification preference rows already have.

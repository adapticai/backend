# Custom GraphQL Resolvers

This document describes the custom GraphQL resolvers added to backend-legacy.

## OptionsGreeksHistory System Summary

A custom aggregation resolver that provides system-wide statistics for Greeks history data.

### Location

- **Resolver**: `src/resolvers/custom/OptionsGreeksHistoryCustomResolver.ts`
- **Output Type**: `src/resolvers/custom/OptionsGreeksHistorySystemSummary.ts`

### GraphQL Query

```graphql
query GetOptionsGreeksHistorySystemSummary {
  optionsGreeksHistorySystemSummary {
    totalAccounts
    totalSnapshots
    oldestSnapshot
    newestSnapshot
  }
}
```

### Response Type

```typescript
{
  totalAccounts: number; // Total number of unique contracts with Greeks history
  totalSnapshots: number; // Total number of Greeks snapshots across all contracts
  oldestSnapshot: Date | null; // Timestamp of the oldest Greeks snapshot
  newestSnapshot: Date | null; // Timestamp of the newest Greeks snapshot
}
```

### SQL Equivalent

```sql
SELECT
  COUNT(DISTINCT contract_id) as total_accounts,
  COUNT(*) as total_snapshots,
  MIN(timestamp) as oldest_snapshot,
  MAX(timestamp) as newest_snapshot
FROM options_greeks_history
```

### Usage from @adaptic/backend Package

```typescript
import { OptionsGreeksHistoryCustomResolver } from '@adaptic/backend';

// The resolver is automatically registered with the GraphQL server
// Use the GraphQL query above to access the data
```

### Server Integration

The custom resolver is automatically included in the GraphQL schema through:

```typescript
// src/server.ts
import { OptionsGreeksHistoryCustomResolver } from './resolvers/custom';

const schema = await buildSchema({
  resolvers: [...resolvers, OptionsGreeksHistoryCustomResolver],
  validate: false,
});
```

## Access reads (AG-29, GAP-MO-ORG-02)

`src/resolvers/custom/AllocatorAccessResolver.ts`, rules in `allocator-access-service.ts` and `src/auth/allocator-access.ts`. Each is refused with `UNAUTHENTICATED` for no principal and `BAD_USER_INPUT` for a malformed id, logged (`[access-read]`) and counted (`access_reads_total{query,principal_kind,outcome}`).

```graphql
activeAuditorGrants(officeOrganizationId: String, userId: String): [AuditorGrant!]!
activeRoleAssignments(organizationId: String, userId: String): [RoleAssignment!]!
officeEntities(officeOrganizationId: String!, userId: String): [OfficeEntity!]!
```

- **Active** is decided at the server's clock: a grant while `revokedAt` is null and now is strictly before `expiresAt` (`periodFrom`..`periodTo` is the audited period, not validity); an assignment from `startsAt` (inclusive) to `endsAt` (exclusive), open-ended when null. The generated `auditorGrants` / `roleAssignments` reads return the history, revoked and expired rows included.
- A **user** reads only rows of their own organizations, and only their own entity view. The **service** and **admin** principals read unscoped and name the viewer of `officeEntities` with `userId`.
- **Entity scope fails closed**: `officeEntities` returns the office's (non-deleted) entities in the viewer's `OrgMembership` scope — every entity only when `entityScopeAll` is true, otherwise exactly `entityScopeIds` — widened by the entities their active auditor grants for that office name. No membership and no active grant, or `entityScopeAll = false` with an empty list, is no entity.

### Adding New Custom Resolvers

To add a new custom resolver:

1. **Create the resolver file** in `/src/resolvers/custom/YourCustomResolver.ts`
2. **Create output types** if needed in `/src/resolvers/custom/YourOutputType.ts`
3. **Export from index** in `/src/resolvers/custom/index.ts`
4. **Register in server** by adding to the resolvers array in `/src/server.ts`
5. **Rebuild** using `yarn build`

The custom resolvers will be automatically exported from the package.

### Build Process

The custom resolvers are:

1. Compiled by TypeScript during `yarn build`
2. Exported through `/src/index.ts` (auto-generated)
3. Available through the `@adaptic/backend` package
4. Automatically registered with the GraphQL server

### Notes

- Custom resolvers follow the same pattern as auto-generated TypeGraphQL Prisma resolvers
- Use `@TypeGraphQL.Resolver()`, `@TypeGraphQL.Query()`, and `@TypeGraphQL.ObjectType()` decorators
- Access Prisma client through `getPrismaFromContext(ctx)`
- All custom resolvers are exported from the package for reuse in other services

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

### Usage from @adaptic/backend-legacy Package

```typescript
import { OptionsGreeksHistoryCustomResolver } from '@adaptic/backend-legacy';

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
3. Available through the `@adaptic/backend-legacy` package
4. Automatically registered with the GraphQL server

### Notes

- Custom resolvers follow the same pattern as auto-generated TypeGraphQL Prisma resolvers
- Use `@TypeGraphQL.Resolver()`, `@TypeGraphQL.Query()`, and `@TypeGraphQL.ObjectType()` decorators
- Access Prisma client through `getPrismaFromContext(ctx)`
- All custom resolvers are exported from the package for reuse in other services

# GraphQL Security Plugins

This directory contains security and operational plugins for Apollo Server.

## Available Plugins

### 1. Query Depth Limiter (`query-depth-limiter.ts`)

Prevents overly complex queries that could cause performance issues by limiting the maximum depth of nested fields in GraphQL queries.

**Features:**

- Configurable maximum query depth (default: 6, via `GRAPHQL_MAX_DEPTH` env var)
- Handles fragments (both named and inline)
- Prevents circular fragment recursion
- Logs rejected queries with user context
- Returns clear error messages

**Integration:**

```typescript
import { queryDepthLimiterPlugin } from './plugins/query-depth-limiter';

const server = new ApolloServer({
  schema,
  plugins: [
    queryDepthLimiterPlugin({ maxDepth: 6 }), // Optional: override env var
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // ... other plugins
  ],
});
```

**Configuration:**

Set the `GRAPHQL_MAX_DEPTH` environment variable in your `.env` file:

```bash
GRAPHQL_MAX_DEPTH=6
```

**Error Response:**

When a query exceeds the depth limit, clients receive:

```json
{
  "errors": [
    {
      "message": "Query depth of 8 exceeds maximum allowed depth of 6",
      "extensions": {
        "code": "QUERY_DEPTH_LIMIT_EXCEEDED",
        "depth": 8,
        "maxDepth": 6
      }
    }
  ]
}
```

### 2. Error Sanitizer (`error-sanitizer.ts`)

Sanitizes error messages to prevent information leakage in production while maintaining helpful debugging in development.

**Features:**

- Strips stack traces in production
- Replaces internal error messages with generic "Internal server error"
- Preserves safe validation errors (e.g., `BAD_USER_INPUT`, `GRAPHQL_VALIDATION_FAILED`)
- Logs full error details server-side
- Includes request IDs for debugging

**Integration:**

```typescript
import { createErrorSanitizer } from './plugins/error-sanitizer';

const server = new ApolloServer({
  schema,
  formatError: createErrorSanitizer(),
  plugins: [
    // ... plugins
  ],
});
```

**Behavior:**

| Environment | Internal Errors         | Validation Errors | Stack Traces | Logging                    |
| ----------- | ----------------------- | ----------------- | ------------ | -------------------------- |
| Development | Full details            | Full details      | Included     | Full details               |
| Production  | "Internal server error" | Original message  | Stripped     | Full details (server-side) |

**Safe Error Codes:**

The following error codes are considered safe and will be returned as-is:

- `GRAPHQL_PARSE_FAILED`
- `GRAPHQL_VALIDATION_FAILED`
- `BAD_USER_INPUT`
- `UNAUTHENTICATED`
- `FORBIDDEN`
- `QUERY_DEPTH_LIMIT_EXCEEDED`

## Complete Integration Example

Replace the existing formatError and plugins in `src/server.ts`:

```typescript
import { queryDepthLimiterPlugin } from './plugins/query-depth-limiter';
import { createErrorSanitizer } from './plugins/error-sanitizer';

const server = new ApolloServer({
  schema,
  introspection: true,
  plugins: [
    queryDepthLimiterPlugin(),
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
  formatError: createErrorSanitizer(),
});
```

## Testing

### Test Query Depth Limiter

```graphql
# This query has depth 3
query TestDepth {
  user {
    posts {
      comments {
        text
      }
    }
  }
}
```

### Test Error Sanitization

Set `NODE_ENV=production` and trigger an internal error to verify sanitization.

## Logging

Both plugins log important information:

**Query Depth Limiter:**

```
[QueryDepthLimiter] Query rejected {
  depth: 8,
  maxDepth: 6,
  queryName: "GetUser",
  userId: "user123",
  requestId: "abc-123",
  query: "query GetUser { ... }"
}
```

**Error Sanitizer:**

```
[GraphQL Error] {
  message: "Cannot read property 'x' of undefined",
  code: "INTERNAL_SERVER_ERROR",
  userId: "user123",
  requestId: "abc-123",
  path: ["user", "profile"],
  stack: "Error: Cannot read property..."
}
```

## Best Practices

1. Set appropriate `GRAPHQL_MAX_DEPTH` based on your schema complexity
2. Always include `X-Request-ID` header for better debugging
3. Monitor rejected queries to identify potential API abuse
4. Review sanitized errors periodically to ensure no information leakage

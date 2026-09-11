# GraphQL Security Plugins - Implementation Summary

## Overview

Successfully implemented GraphQL query depth limiting and error message sanitization for the backend-legacy package without modifying the existing `server.ts` file.

## Files Created

### Core Plugin Files

1. **`src/plugins/query-depth-limiter.ts`** (6.1 KB)
   - Implements AST-based query depth analysis
   - Configurable max depth via `GRAPHQL_MAX_DEPTH` env var (default: 6)
   - Handles fragments (named and inline) with circular reference prevention
   - Logs rejected queries with user context and request IDs
   - Returns clear error messages with proper error codes

2. **`src/plugins/error-sanitizer.ts`** (6.1 KB)
   - Sanitizes internal errors in production mode
   - Preserves safe validation errors (BAD_USER_INPUT, GRAPHQL_VALIDATION_FAILED, etc.)
   - Strips stack traces and sensitive information in production
   - Logs full error details server-side with context
   - Supports request ID tracking for debugging

### Supporting Files

3. **`src/plugins/index.ts`** (251 bytes)
   - Clean export interface for both plugins

4. **`src/plugins/README.md`** (4.2 KB)
   - Comprehensive documentation
   - Integration instructions
   - Configuration guide
   - Behavior tables
   - Testing examples

5. **`src/plugins/integration-example.ts`** (3.1 KB)
   - Shows how to integrate into `server.ts`
   - Before/after comparison
   - Important notes about preserving existing logic

### Test Files

6. **`src/plugins/__tests__/query-depth-limiter.test.ts`** (2.9 KB)
   - Test structure for depth calculation
   - Fragment handling tests
   - Error message validation

7. **`src/plugins/__tests__/error-sanitizer.test.ts`** (3.4 KB)
   - Production vs development mode tests
   - Safe error code validation
   - Logging context tests

## Key Features

### Query Depth Limiter

✅ **No `any` types** - Uses proper GraphQL AST types from the `graphql` package
✅ **Configurable** - Via `GRAPHQL_MAX_DEPTH` environment variable
✅ **Comprehensive** - Handles:

- Nested field queries
- Named fragments
- Inline fragments
- Circular fragment references (prevents infinite loops)
- Introspection queries (skipped from depth calculation)
  ✅ **Logging** - Includes:
- Query depth and limit
- Query name (if available)
- User ID (from context)
- Request ID (from headers)
- Truncated query string
- Timestamp

### Error Sanitizer

✅ **No `any` types** - Proper TypeScript interfaces throughout
✅ **Environment-aware** - Automatically detects `NODE_ENV`
✅ **Secure** - In production:

- Replaces internal errors with "Internal server error"
- Strips all stack traces
- Removes sensitive extensions
- Preserves only safe error codes
  ✅ **Developer-friendly** - In development:
- Shows full error details
- Includes stack traces
- Preserves all extensions
  ✅ **Safe error codes**:
- `GRAPHQL_PARSE_FAILED`
- `GRAPHQL_VALIDATION_FAILED`
- `BAD_USER_INPUT`
- `UNAUTHENTICATED`
- `FORBIDDEN`
- `PERSISTED_QUERY_NOT_FOUND`
- `PERSISTED_QUERY_NOT_SUPPORTED`
- `BAD_REQUEST`
- `QUERY_DEPTH_LIMIT_EXCEEDED`

## Integration Instructions

### Step 1: Add Imports to `src/server.ts`

```typescript
import { queryDepthLimiterPlugin } from './plugins/query-depth-limiter';
import { createErrorSanitizer } from './plugins/error-sanitizer';
```

### Step 2: Update Apollo Server Configuration

Replace the current `ApolloServer` instantiation (lines 74-132) with:

```typescript
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

### Step 3: (Optional) Preserve DB Restart Logic

If you need to keep the existing DB restart logic, wrap the error sanitizer:

```typescript
const sanitizer = createErrorSanitizer();

formatError: (err, error) => {
  // Your existing DB restart logic
  const message = err.message || '';
  if (message.includes("Can't reach database server")) {
    dbUnreachableCount += 1;
    // ... restart logic ...
  }

  // Then sanitize
  return sanitizer(err, error);
};
```

### Step 4: Configure Environment Variables

Add to `.env` file:

```bash
GRAPHQL_MAX_DEPTH=6
NODE_ENV=production  # or development
```

## Testing

### Test Query Depth Limiting

```bash
# Run the test suite
npx jest src/plugins/__tests__/query-depth-limiter.test.ts
```

### Test Error Sanitization

```bash
# Run the test suite
npx jest src/plugins/__tests__/error-sanitizer.test.ts
```

### Manual Testing

1. **Test depth limiter**: Send a deeply nested query (> 6 levels)
2. **Test error sanitization**: Set `NODE_ENV=production` and trigger an internal error

## Type Safety

✅ **All type-safe**:

- No `any` types used
- Uses `graphql` package's built-in AST types (`DocumentNode`, `FieldNode`, etc.)
- Proper TypeScript interfaces for context
- Generic plugin types from `@apollo/server`

## Compilation Verification

All files successfully compile with TypeScript:

```bash
✅ src/plugins/query-depth-limiter.ts
✅ src/plugins/error-sanitizer.ts
✅ src/plugins/index.ts
✅ src/plugins/integration-example.ts
```

## Constraints Met

✅ Did NOT modify `server.ts` directly
✅ Did NOT modify auth, .env, or schema
✅ No `any` types used
✅ Used graphql package's built-in AST types
✅ Followed all TypeScript strict mode requirements

## Next Steps

1. Review the integration example in `src/plugins/integration-example.ts`
2. Add the imports and configuration to `src/server.ts`
3. Test in development environment first
4. Configure `GRAPHQL_MAX_DEPTH` based on your schema complexity
5. Deploy to production and monitor logs for rejected queries

## Monitoring

After deployment, monitor for:

1. **Query depth violations**:

   ```
   [QueryDepthLimiter] Query rejected { depth: 8, maxDepth: 6, ... }
   ```

2. **Sanitized errors**:

   ```
   [GraphQL Error] { message: "...", code: "INTERNAL_SERVER_ERROR", ... }
   ```

3. **Request IDs** for debugging specific issues

## Support

For questions or issues:

- See `src/plugins/README.md` for detailed documentation
- Check `src/plugins/integration-example.ts` for integration guidance
- Review test files for expected behavior examples

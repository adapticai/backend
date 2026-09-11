# Integration Guide: GraphQL Validation Plugin

This guide shows how to integrate the validation plugin into `server.ts`.

## Step 1: Import the validation plugin

Add this import at the top of `src/server.ts`:

```typescript
import { createValidationPlugin } from './middleware/graphql-validation-plugin';
```

## Step 2: Add plugin to Apollo Server

Modify the `ApolloServer` initialization to include the validation plugin:

```typescript
const server = new ApolloServer({
  schema,
  introspection: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    createValidationPlugin(), // ← Add this line
  ],
  formatError: (err) => {
    // Existing error formatting code...
  },
});
```

## Complete Example

Here's what the relevant section of `server.ts` should look like:

```typescript
// Add import near other imports
import { createValidationPlugin } from './middleware/graphql-validation-plugin';

// Inside startServer() function
const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [...resolvers, OptionsGreeksHistoryCustomResolver],
    validate: false,
  });

  const app = express();
  const httpServer = createServer(app);

  app.use('/api', (req, res, next) =>
    authMiddleware(req as AuthenticatedRequest, res, next)
  );

  const server = new ApolloServer({
    schema,
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      createValidationPlugin(), // ← Add validation plugin
    ],
    formatError: (err) => {
      console.error('GraphQL Error:', JSON.stringify(err, null, 2));

      // Check if this error is due to unreachable DB
      const message = err.message || '';
      if (message.includes("Can't reach database server")) {
        // ... existing error handling code ...
      } else {
        dbUnreachableCount = 0;
      }

      return {
        message: err.message,
        locations: err.locations,
        path: err.path,
        extensions: {
          code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
          // Validation errors will be automatically included in extensions
          ...(err.extensions?.validationErrors && {
            validationErrors: err.extensions.validationErrors,
          }),
        },
      };
    },
  });

  await server.start();
  // ... rest of server setup ...
};
```

## Step 3: Test the integration

After integration, test with a mutation that includes invalid data:

```graphql
mutation {
  createOneConfiguration(
    data: {
      tradeAllocationPct: 150 # Invalid: > 100
      quantity: -5 # Invalid: negative
      name: "" # Invalid: empty
    }
  ) {
    id
  }
}
```

Expected response:

```json
{
  "errors": [
    {
      "message": "Input validation failed for 3 fields",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "validationErrors": [
          {
            "field": "data.tradeAllocationPct",
            "value": 150,
            "message": "Must be between 0 and 100",
            "constraint": "range"
          },
          {
            "field": "data.quantity",
            "value": -5,
            "message": "Must be greater than 0",
            "constraint": "positive"
          },
          {
            "field": "data.name",
            "value": "",
            "message": "Must not be empty",
            "constraint": "notEmpty"
          }
        ]
      }
    }
  ]
}
```

## Step 4: Update client-side error handling (optional)

Your frontend can now parse and display field-level validation errors:

```typescript
// Frontend error handling example
if (error.extensions?.code === 'BAD_USER_INPUT') {
  const validationErrors = error.extensions.validationErrors;

  validationErrors.forEach((err) => {
    // Display error next to the relevant field
    displayFieldError(err.field, err.message);
  });
}
```

## Validation Rules Reference

The plugin automatically validates these field patterns:

| Field Pattern                  | Validation     | Example Fields                     |
| ------------------------------ | -------------- | ---------------------------------- |
| `*Pct`                         | 0-100          | `allocationPct`, `tradePct`        |
| `*Percent`, `*Percentage`      | 0-100          | `tradePercent`, `profitPercentage` |
| `quantity`                     | > 0            | `quantity`                         |
| `*Threshold`                   | > 0 (allows 0) | `volumeThreshold`                  |
| `count`                        | > 0            | `count`                            |
| `name`, `title`, `description` | Non-empty      | `name`, `title`                    |
| `symbol`, `type`, `status`     | Non-empty      | `symbol`, `type`                   |

## Customization

To add custom validation rules, modify `VALIDATION_RULES` in `src/middleware/graphql-validation-plugin.ts`:

```typescript
const VALIDATION_RULES: FieldValidationRule[] = [
  // ... existing rules ...

  // Add your custom rule
  {
    pattern: /^myCustomField$/i,
    validator: (value, fieldName) => {
      if (typeof value === 'number' && value < 0) {
        throw new ValidationError('Invalid value', [
          {
            field: fieldName,
            value,
            message: 'Must be non-negative',
            constraint: 'minimum',
          },
        ]);
      }
    },
    description: 'Custom field validation',
  },
];
```

## Troubleshooting

### Validation not running

- Ensure the plugin is added to the `plugins` array in ApolloServer
- Verify the operation is a mutation (not query)
- Check that field names match validation patterns

### False positives

- Review `VALIDATION_RULES` patterns in `graphql-validation-plugin.ts`
- Consider if the field should be optional (nullable)
- Add custom logic in resolver for complex validation

### Need to skip validation for specific mutations

Create a custom plugin wrapper:

```typescript
function createValidationPluginWithExclusions(excludeOperations: string[]) {
  return {
    async requestDidStart() {
      return {
        async didResolveOperation(requestContext) {
          const operationName = requestContext.operation.name?.value;
          if (operationName && excludeOperations.includes(operationName)) {
            return; // Skip validation
          }

          // Run normal validation
          const plugin = createValidationPlugin();
          const listener = await plugin.requestDidStart!();
          return listener.didResolveOperation!(requestContext);
        },
      };
    },
  };
}
```

## Performance Impact

The validation plugin has minimal performance impact:

- Runs only on mutations (queries are skipped)
- Validates before resolver execution (prevents unnecessary DB calls)
- No regex compilation on every request (patterns are pre-compiled)
- Short-circuits on first validation error per field

## Next Steps

1. Integrate the plugin into `server.ts`
2. Test with existing mutations
3. Monitor error logs for validation failures
4. Update frontend to display field-level errors
5. Add custom validation rules as needed

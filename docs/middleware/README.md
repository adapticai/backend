# GraphQL Input Validation Middleware

This directory contains input validation middleware for GraphQL mutations, providing automatic validation of common field patterns before resolver execution.

## Components

### 1. `input-validator.ts`

Core validation functions for common data types and patterns.

**Available Validators:**

- `validatePercentage(value, fieldName)` - Validates 0-100 range
- `validatePositiveNumber(value, fieldName)` - Validates value > 0
- `validateEmail(value)` - Validates email format
- `validateUrl(value)` - Validates URL format
- `validateNonEmpty(value, fieldName)` - Validates non-empty strings
- `validateConfidenceScore(value)` - Validates 0-1 range
- `validateFields(validations)` - Batch validation with error accumulation

**Example Usage:**

```typescript
import {
  validatePercentage,
  validatePositiveNumber,
} from './middleware/input-validator';

// Single field validation
try {
  validatePercentage(allocationPct, 'allocationPct');
  validatePositiveNumber(quantity, 'quantity');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.fields); // Array of validation errors
  }
}

// Multiple field validation
import { validateFields } from './middleware/input-validator';

validateFields([
  () => validatePercentage(data.allocationPct, 'allocationPct'),
  () => validatePositiveNumber(data.quantity, 'quantity'),
  () => validateNonEmpty(data.name, 'name'),
]);
```

### 2. `graphql-validation-plugin.ts`

Apollo Server plugin that automatically validates mutation inputs based on field name patterns.

**Validation Rules:**

The plugin applies validation rules based on field name patterns:

| Pattern                                                    | Validation                 | Examples                            |
| ---------------------------------------------------------- | -------------------------- | ----------------------------------- |
| `*Pct`                                                     | 0-100 percentage           | `allocationPct`, `tradePct`         |
| `*Percent`, `*Percentage`                                  | 0-100 percentage           | `tradePercent`, `profitPercentage`  |
| `quantity`                                                 | Positive number            | `quantity`                          |
| `*Threshold`                                               | Positive number (allows 0) | `volumeThreshold`, `priceThreshold` |
| `count`                                                    | Positive number            | `count`                             |
| `name`, `title`, `description`, `symbol`, `type`, `status` | Non-empty string           | `name`, `title`                     |

**Integration:**

Add the plugin to your Apollo Server configuration in `server.ts`:

```typescript
import { createValidationPlugin } from './middleware/graphql-validation-plugin';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

const server = new ApolloServer({
  schema,
  introspection: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    createValidationPlugin(), // Add validation plugin
  ],
  formatError: (err) => {
    // Existing error formatting...
  },
});
```

## Error Response Format

When validation fails, the plugin returns a GraphQL error with detailed field information:

```json
{
  "errors": [
    {
      "message": "Input validation failed for 2 fields",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "validationErrors": [
          {
            "field": "allocationPct",
            "value": 150,
            "message": "Must be between 0 and 100",
            "constraint": "range"
          },
          {
            "field": "quantity",
            "value": -5,
            "message": "Must be greater than 0",
            "constraint": "positive"
          }
        ]
      }
    }
  ]
}
```

## Features

- **Automatic Validation**: Validates mutation inputs before resolver execution
- **Pattern-Based Rules**: Applies rules based on field name patterns
- **Nested Object Support**: Recursively validates nested input objects
- **Multiple Error Reporting**: Reports all validation errors at once
- **Zero Overhead for Queries**: Only validates mutations
- **Type-Safe**: Full TypeScript support with proper type definitions
- **GraphQL-Compatible**: Returns standard GraphQL error format

## Adding Custom Validation Rules

To add custom validation rules, edit `VALIDATION_RULES` in `graphql-validation-plugin.ts`:

```typescript
const VALIDATION_RULES: FieldValidationRule[] = [
  // ... existing rules ...
  {
    pattern: /^customField$/i,
    validator: (value, fieldName) => {
      if (typeof value === 'number' && value < 10) {
        throw new ValidationError('Custom validation failed', [
          {
            field: fieldName,
            value,
            message: 'Must be at least 10',
            constraint: 'minimum',
          },
        ]);
      }
    },
    description: 'Custom field validation',
  },
];
```

## Testing

Run the test suite to verify validation behavior:

```bash
npm test src/tests/input-validator.test.ts
npm test src/tests/graphql-validation-plugin.test.ts
```

## Benefits

1. **Data Integrity**: Ensures invalid data never reaches resolvers or database
2. **Better UX**: Returns field-level errors for better client-side error handling
3. **Reduced Code**: Eliminates repetitive validation code in resolvers
4. **Consistency**: Applies same validation rules across all mutations
5. **Performance**: Validates before resolver execution, saving database calls

## Migration Notes

- The plugin does NOT modify generated resolvers
- Existing custom resolvers can still implement additional validation
- The plugin runs BEFORE authentication checks in resolvers
- Null and undefined values are skipped (optional fields remain optional)

## Type Safety

All validation functions are fully typed and do not use `any`:

```typescript
// ✅ Type-safe validation
function validatePercentage(value: number, fieldName: string): void;

// ✅ Type-safe error handling
interface ValidationErrorDetail {
  field: string;
  value: unknown;
  message: string;
  constraint: string;
}
```

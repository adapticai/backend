import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { GraphQLError } from 'graphql';
import {
  validatePercentage,
  validatePositiveNumber,
  validateNonEmpty,
  ValidationError,
  ValidationErrorDetail,
} from './input-validator';
import { logger } from '../utils/logger';

/**
 * Validation execution mode for the GraphQL mutation-input plugin.
 *
 * - `scoped` (default) — validates ONLY top-level scalar input fields of each
 *   mutation variable (unwrapping single-key Prisma atomic `{ set: <scalar> }`
 *   update wrappers). Nested objects — relation create/connect inputs and
 *   opaque Json audit columns such as `effectivePolicySnapshot` — are engine-
 *   or Prisma-validated payloads, not user input, and are never recursed into.
 *   Range rules apply only to fields whose schema domain is genuinely bounded.
 * - `legacy` — the pre-2026-07 behavior: name-pattern heuristics applied
 *   recursively to every nested non-array object of every mutation variable.
 *   Retained solely as an operational rollback lever.
 * - `off` — disables mutation-input validation entirely (kill switch).
 */
export type ValidationMode = 'scoped' | 'legacy' | 'off';

/**
 * Environment variable controlling the plugin mode. Accepted values:
 * `scoped` | `legacy` | `off`. Unset or unrecognized values resolve to
 * `scoped`.
 */
export const VALIDATION_MODE_ENV_VAR = 'GRAPHQL_VALIDATION_MODE';

/**
 * Resolves the active validation mode from the environment.
 *
 * @returns The configured {@link ValidationMode}, defaulting to `scoped`.
 */
export function resolveValidationMode(): ValidationMode {
  const raw = process.env[VALIDATION_MODE_ENV_VAR]?.trim().toLowerCase();
  if (raw === 'legacy' || raw === 'off' || raw === 'scoped') {
    return raw;
  }
  if (raw !== undefined && raw !== '') {
    logger.warn(
      `Unrecognized ${VALIDATION_MODE_ENV_VAR} value; defaulting to 'scoped'`,
      { value: raw }
    );
  }
  return 'scoped';
}

/**
 * Exact schema field names whose domain is genuinely a bounded share-of-a-whole
 * percentage in `[0, 100]`.
 *
 * This is intentionally an explicit allowlist rather than a `/.*Pct$/` name
 * pattern: many `*Pct` / `*Percent` fields in the Prisma schema are NOT
 * bounded percentages — `maxGrossExposurePct` / `maxNetExposurePct` are
 * leverage-denominated (200 = 2x gross is a legitimate production value) and
 * PnL/return/drawdown fields (`dailyPnlPct`, `netReturnPct`, `changePercent`,
 * `peakToTroughPct`, …) are signed. A blanket 0-100 rule on the name pattern
 * rejected 100% of AccountDecisionRecord writes embedding a leverage policy
 * snapshot (TM-01, 2026-07-01).
 */
export const BOUNDED_PERCENTAGE_FIELDS: ReadonlySet<string> = new Set([
  'maxBuyingPowerUtilPct',
  'cashFloorPct',
  'maxSymbolConcentrationPct',
  'maxSectorConcentrationPct',
  'perTradeEquityAllocationPct',
  'perTradeCryptoAllocationPct',
  'cryptoTradeAllocationPct',
  'tradeAllocationPct',
  'trafficSplitControlPercent',
  'trafficSplitTreatmentPercent',
]);

/**
 * Lower-cased field names that must be non-empty strings when present as
 * top-level scalar inputs.
 */
export const REQUIRED_NON_EMPTY_STRING_FIELDS: ReadonlySet<string> = new Set([
  'name',
  'title',
  'description',
  'symbol',
  'type',
  'status',
]);

/**
 * Lower-cased field names that must be strictly positive numbers when present
 * as top-level scalar inputs. Note: `*Threshold` fields are deliberately NOT
 * validated — thresholds are legitimately signed (e.g. reversal-blackout and
 * drawdown-breach thresholds are negative).
 */
export const POSITIVE_NUMBER_FIELDS: ReadonlySet<string> = new Set([
  'quantity',
]);

/**
 * Field validation rules mapped by field name patterns (legacy mode only).
 */
interface FieldValidationRule {
  pattern: RegExp;
  validator: (value: unknown, fieldName: string) => void;
  description: string;
}

/**
 * Legacy name-pattern validation rules. Preserved verbatim for the `legacy`
 * rollback mode; the default `scoped` mode does NOT use these (the `.*Pct$`,
 * `.*Percent$`, and `.*Threshold$` heuristics reject legitimate leverage-
 * denominated and signed values).
 */
const VALIDATION_RULES: FieldValidationRule[] = [
  // Percentage fields (0-100)
  {
    pattern: /.*Pct$/i,
    validator: (value, fieldName) => {
      if (typeof value === 'number') {
        validatePercentage(value, fieldName);
      }
    },
    description: 'Percentage fields ending with Pct',
  },
  {
    pattern: /.*Percent(age)?$/i,
    validator: (value, fieldName) => {
      if (typeof value === 'number') {
        validatePercentage(value, fieldName);
      }
    },
    description: 'Percentage fields ending with Percent or Percentage',
  },
  // Quantity fields (must be positive)
  {
    pattern: /^quantity$/i,
    validator: (value, fieldName) => {
      if (typeof value === 'number') {
        validatePositiveNumber(value, fieldName);
      }
    },
    description: 'Quantity fields',
  },
  {
    pattern: /.*Threshold$/i,
    validator: (value, fieldName) => {
      if (typeof value === 'number' && value !== 0) {
        validatePositiveNumber(value, fieldName);
      }
    },
    description: 'Threshold fields',
  },
  {
    pattern: /^count$/i,
    validator: (value, fieldName) => {
      if (typeof value === 'number') {
        validatePositiveNumber(value, fieldName);
      }
    },
    description: 'Count fields',
  },
  // Required string fields (non-empty)
  {
    pattern: /^(name|title|description|symbol|type|status)$/i,
    validator: (value, fieldName) => {
      if (typeof value === 'string') {
        validateNonEmpty(value, fieldName);
      }
    },
    description: 'Common required string fields',
  },
];

/**
 * Returns true when the value is a plain (non-array) object.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Collects a validator's {@link ValidationError} field details into `errors`.
 */
function collectValidation(
  errors: ValidationErrorDetail[],
  validate: () => void
): void {
  try {
    validate();
  } catch (error) {
    if (error instanceof ValidationError) {
      errors.push(...error.fields);
    } else {
      throw error;
    }
  }
}

/**
 * Validates ONLY the top-level scalar fields of a mutation input object
 * (scoped mode). Prisma atomic update wrappers of the shape
 * `{ set: <scalar> }` are unwrapped one level so `updateOne*` inputs receive
 * the same scrutiny as `createOne*` inputs. All other nested objects and all
 * arrays are out of scope by design: they are relation inputs or opaque
 * Json-typed columns whose contents are validated by Prisma / the producing
 * service, and name-pattern rules applied inside them reject legitimate data.
 */
function validateTopLevelFields(
  obj: Record<string, unknown>,
  path: string
): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  for (const [key, rawValue] of Object.entries(obj)) {
    if (rawValue === null || rawValue === undefined) {
      continue;
    }

    let value: unknown = rawValue;
    if (isPlainObject(rawValue)) {
      const keys = Object.keys(rawValue);
      const isAtomicSetWrapper =
        keys.length === 1 &&
        keys[0] === 'set' &&
        !isPlainObject(rawValue.set) &&
        !Array.isArray(rawValue.set);
      if (!isAtomicSetWrapper) {
        continue;
      }
      value = rawValue.set;
      if (value === null || value === undefined) {
        continue;
      }
    }
    if (Array.isArray(value)) {
      continue;
    }

    const fieldPath = path ? `${path}.${key}` : key;
    const lowerKey = key.toLowerCase();

    if (BOUNDED_PERCENTAGE_FIELDS.has(key) && typeof value === 'number') {
      collectValidation(errors, () =>
        validatePercentage(value as number, fieldPath)
      );
    } else if (
      POSITIVE_NUMBER_FIELDS.has(lowerKey) &&
      typeof value === 'number'
    ) {
      collectValidation(errors, () =>
        validatePositiveNumber(value as number, fieldPath)
      );
    } else if (
      REQUIRED_NON_EMPTY_STRING_FIELDS.has(lowerKey) &&
      typeof value === 'string'
    ) {
      collectValidation(errors, () =>
        validateNonEmpty(value as string, fieldPath)
      );
    }
  }

  return errors;
}

/**
 * Recursively validates an object's fields based on the legacy name-pattern
 * rules (legacy mode only).
 */
function validateObject(
  obj: Record<string, unknown>,
  path: string = ''
): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fieldPath = path ? `${path}.${key}` : key;

    // Skip null or undefined values
    if (value === null || value === undefined) {
      continue;
    }

    // Recursively validate nested objects
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nestedErrors = validateObject(
        value as Record<string, unknown>,
        fieldPath
      );
      errors.push(...nestedErrors);
      continue;
    }

    // Apply validation rules to the field
    for (const rule of VALIDATION_RULES) {
      if (rule.pattern.test(key)) {
        collectValidation(errors, () => rule.validator(value, fieldPath));
        break; // Only apply the first matching rule
      }
    }
  }

  return errors;
}

/**
 * Apollo Server plugin that validates GraphQL mutation inputs before they
 * reach the resolver.
 *
 * The active {@link ValidationMode} is resolved from the
 * `GRAPHQL_VALIDATION_MODE` environment variable at request time (defaulting
 * to `scoped`) unless an explicit `modeOverride` is supplied.
 *
 * @param modeOverride - Optional fixed mode, primarily for tests; when
 *   omitted the mode is re-resolved from the environment on each request so
 *   the toggle can be flipped without code changes.
 *
 * @example
 * ```typescript
 * const server = new ApolloServer({
 *   schema,
 *   plugins: [
 *     ApolloServerPluginDrainHttpServer({ httpServer }),
 *     createValidationPlugin(),
 *   ],
 * });
 * ```
 */
export function createValidationPlugin(
  modeOverride?: ValidationMode
): ApolloServerPlugin {
  return {
    async requestDidStart(): Promise<
      GraphQLRequestListener<Record<string, unknown>>
    > {
      return {
        async didResolveOperation(requestContext) {
          const mode = modeOverride ?? resolveValidationMode();
          if (mode === 'off') {
            return;
          }

          const { operation, request } = requestContext;

          // Only validate mutations
          if (!operation || operation.operation !== 'mutation') {
            return;
          }

          const variables = request.variables || {};
          const errors: ValidationErrorDetail[] = [];
          const validateFn =
            mode === 'legacy' ? validateObject : validateTopLevelFields;

          // Validate each mutation's variables
          for (const [variableName, variableValue] of Object.entries(
            variables
          )) {
            if (variableValue && typeof variableValue === 'object') {
              // Check if this is a data object (common pattern in mutations)
              const dataObj = variableValue as Record<string, unknown>;

              if ('data' in dataObj && typeof dataObj.data === 'object') {
                errors.push(
                  ...validateFn(
                    dataObj.data as Record<string, unknown>,
                    variableName
                  )
                );
              } else {
                errors.push(...validateFn(dataObj, variableName));
              }
            }
          }

          // If there are validation errors, throw before resolver execution
          if (errors.length > 0) {
            const fieldList = errors.map((e) => e.field).join(', ');
            throw new GraphQLError(
              `Input validation failed for ${errors.length} field${errors.length > 1 ? 's' : ''}: ${fieldList}`,
              {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  validationErrors: errors,
                },
              }
            );
          }
        },
      };
    },
  };
}

/**
 * Export legacy validation rules for testing and documentation.
 */
export { VALIDATION_RULES };

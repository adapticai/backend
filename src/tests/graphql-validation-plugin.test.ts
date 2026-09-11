import { GraphQLError } from 'graphql';
import {
  createValidationPlugin,
  resolveValidationMode,
  BOUNDED_PERCENTAGE_FIELDS,
  VALIDATION_MODE_ENV_VAR,
  VALIDATION_RULES,
} from '../middleware/graphql-validation-plugin';
import type { ValidationMode } from '../middleware/graphql-validation-plugin';
import type { ValidationErrorDetail } from '../middleware/input-validator';

/**
 * Minimal shape of the Apollo Server didResolveOperation request context that
 * the validation plugin actually reads. Tests construct lightweight fixtures
 * rather than full Apollo Server contexts, so we use this Parameters-derived
 * type to cast through the structural gap without resorting to `any`.
 */
type DidResolveOperationContext = Parameters<
  NonNullable<
    Awaited<
      ReturnType<
        NonNullable<
          ReturnType<typeof createValidationPlugin>['requestDidStart']
        >
      >
    >['didResolveOperation']
  >
>[0];

/**
 * Builds a listener for the given mode and runs didResolveOperation against a
 * mutation carrying the provided variables.
 */
async function runValidation(
  mode: ValidationMode | undefined,
  variables: Record<string, unknown>,
  operation: 'mutation' | 'query' = 'mutation'
): Promise<void> {
  const plugin = createValidationPlugin(mode);
  const listener = await plugin.requestDidStart!();
  const requestContext = {
    operation: { operation },
    request: { variables },
  };
  await listener!.didResolveOperation!(
    requestContext as unknown as DidResolveOperationContext
  );
}

describe('GraphQL Validation Plugin', () => {
  describe('resolveValidationMode', () => {
    const originalEnv = process.env[VALIDATION_MODE_ENV_VAR];

    afterEach(() => {
      if (originalEnv === undefined) {
        delete process.env[VALIDATION_MODE_ENV_VAR];
      } else {
        process.env[VALIDATION_MODE_ENV_VAR] = originalEnv;
      }
    });

    it('defaults to scoped when the env var is unset', () => {
      delete process.env[VALIDATION_MODE_ENV_VAR];
      expect(resolveValidationMode()).toBe('scoped');
    });

    it('honors legacy and off values', () => {
      process.env[VALIDATION_MODE_ENV_VAR] = 'legacy';
      expect(resolveValidationMode()).toBe('legacy');
      process.env[VALIDATION_MODE_ENV_VAR] = 'off';
      expect(resolveValidationMode()).toBe('off');
    });

    it('falls back to scoped on unrecognized values', () => {
      process.env[VALIDATION_MODE_ENV_VAR] = 'nonsense';
      expect(resolveValidationMode()).toBe('scoped');
    });
  });

  describe('createValidationPlugin', () => {
    it('should create a valid Apollo Server plugin', () => {
      const plugin = createValidationPlugin();
      expect(plugin).toBeDefined();
      expect(typeof plugin.requestDidStart).toBe('function');
    });
  });

  describe('scoped mode (default)', () => {
    it('skips validation for queries', async () => {
      await expect(
        runValidation('scoped', { data: { cashFloorPct: 150 } }, 'query')
      ).resolves.not.toThrow();
    });

    it('accepts an AccountDecisionRecord-shaped payload embedding leverage percentages in a Json snapshot (TM-01 regression)', async () => {
      await expect(
        runValidation('scoped', {
          data: {
            symbol: 'AAPL',
            assetClass: 'us_equity',
            signalAction: 'buy',
            status: 'PENDING',
            effectivePolicySnapshot: {
              policy: {
                maxGrossExposurePct: 200,
                maxNetExposurePct: 200,
                symbol: '',
              },
            },
          },
        })
      ).resolves.not.toThrow();
    });

    it('accepts leverage-denominated Pct fields above 100 at top level', async () => {
      await expect(
        runValidation('scoped', {
          data: { maxGrossExposurePct: 380, maxNetExposurePct: 200 },
        })
      ).resolves.not.toThrow();
    });

    it('accepts signed PnL/return percentage fields', async () => {
      await expect(
        runValidation('scoped', {
          data: { dailyPnlPct: -3.2, netReturnPct: -12.5, changePercent: -4 },
        })
      ).resolves.not.toThrow();
    });

    it('accepts signed threshold fields (thresholds are legitimately negative)', async () => {
      await expect(
        runValidation('scoped', { data: { volumeThreshold: -1000 } })
      ).resolves.not.toThrow();
    });

    it('rejects genuinely bounded percentage fields outside 0-100', async () => {
      await expect(
        runValidation('scoped', { data: { cashFloorPct: 150 } })
      ).rejects.toThrow(GraphQLError);
    });

    it('rejects bounded percentage violations inside Prisma { set } update wrappers', async () => {
      await expect(
        runValidation('scoped', {
          data: { maxSymbolConcentrationPct: { set: 150 } },
        })
      ).rejects.toThrow(GraphQLError);
    });

    it('accepts valid values inside Prisma { set } update wrappers', async () => {
      await expect(
        runValidation('scoped', {
          data: { cashFloorPct: { set: 25 }, symbol: { set: 'MSFT' } },
        })
      ).resolves.not.toThrow();
    });

    it('rejects empty top-level required strings', async () => {
      try {
        await runValidation('scoped', { data: { symbol: '', quantity: -5 } });
        throw new Error('Should have thrown GraphQLError');
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        if (error instanceof GraphQLError) {
          expect(error.extensions.code).toBe('BAD_USER_INPUT');
          const details = error.extensions
            .validationErrors as ValidationErrorDetail[];
          expect(details.length).toBe(2);
          expect(error.message).toContain('data.symbol');
        }
      }
    });

    it('does not recurse into nested relation or Json inputs', async () => {
      await expect(
        runValidation('scoped', {
          data: {
            portfolio: { allocation: { cashFloorPct: 150, symbol: '' } },
          },
        })
      ).resolves.not.toThrow();
    });

    it('skips null and undefined values', async () => {
      await expect(
        runValidation('scoped', {
          data: { cashFloorPct: null, quantity: undefined, name: 'Valid' },
        })
      ).resolves.not.toThrow();
    });

    it('handles empty and missing variables', async () => {
      await expect(runValidation('scoped', {})).resolves.not.toThrow();
      const plugin = createValidationPlugin('scoped');
      const listener = await plugin.requestDidStart!();
      await expect(
        listener!.didResolveOperation!({
          operation: { operation: 'mutation' },
          request: {},
        } as unknown as DidResolveOperationContext)
      ).resolves.not.toThrow();
    });
  });

  describe('off mode', () => {
    it('accepts payloads that would fail in every other mode', async () => {
      await expect(
        runValidation('off', {
          data: { cashFloorPct: 150, symbol: '', quantity: -5 },
        })
      ).resolves.not.toThrow();
    });
  });

  describe('legacy mode (rollback lever)', () => {
    it('retains the legacy name-pattern rule set', () => {
      const percentageRules = VALIDATION_RULES.filter(
        (rule) =>
          rule.pattern.test('allocationPct') ||
          rule.pattern.test('percentage') ||
          rule.pattern.test('tradePercent')
      );
      expect(percentageRules.length).toBeGreaterThan(0);
      expect(
        VALIDATION_RULES.some((rule) => rule.pattern.test('quantity'))
      ).toBe(true);
      expect(
        VALIDATION_RULES.some((rule) => rule.pattern.test('volumeThreshold'))
      ).toBe(true);
    });

    it('still rejects pattern-matched percentage fields recursively', async () => {
      await expect(
        runValidation('legacy', {
          data: { portfolio: { allocation: { stocksPct: 150 } } },
        })
      ).rejects.toThrow(GraphQLError);
    });

    it('still rejects the AccountDecisionRecord leverage snapshot (documented legacy defect)', async () => {
      await expect(
        runValidation('legacy', {
          data: {
            symbol: 'AAPL',
            effectivePolicySnapshot: {
              policy: { maxGrossExposurePct: 200 },
            },
          },
        })
      ).rejects.toThrow(GraphQLError);
    });

    it('reports all accumulated errors', async () => {
      try {
        await runValidation('legacy', {
          data: { tradeAllocationPct: 150, quantity: -10, name: '' },
        });
        throw new Error('Should have thrown GraphQLError');
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        if (error instanceof GraphQLError) {
          const details = error.extensions
            .validationErrors as ValidationErrorDetail[];
          expect(details.length).toBeGreaterThanOrEqual(2);
        }
      }
    });
  });

  describe('BOUNDED_PERCENTAGE_FIELDS', () => {
    it('excludes leverage-denominated and signed percentage fields', () => {
      expect(BOUNDED_PERCENTAGE_FIELDS.has('maxGrossExposurePct')).toBe(false);
      expect(BOUNDED_PERCENTAGE_FIELDS.has('maxNetExposurePct')).toBe(false);
      expect(BOUNDED_PERCENTAGE_FIELDS.has('dailyPnlPct')).toBe(false);
      expect(BOUNDED_PERCENTAGE_FIELDS.has('netReturnPct')).toBe(false);
    });

    it('includes genuine share-of-a-whole fields', () => {
      expect(BOUNDED_PERCENTAGE_FIELDS.has('cashFloorPct')).toBe(true);
      expect(BOUNDED_PERCENTAGE_FIELDS.has('maxBuyingPowerUtilPct')).toBe(
        true
      );
    });
  });
});

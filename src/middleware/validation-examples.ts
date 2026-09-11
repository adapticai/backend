/**
 * Example usage of validation functions in custom resolvers
 *
 * This file demonstrates how to use the validation utilities
 * in custom resolver implementations.
 */

import * as TypeGraphQL from 'type-graphql';
import {
  validatePercentage,
  validatePositiveNumber,
  validateFields,
  ValidationError,
} from './input-validator';

/**
 * Example: Portfolio allocation input with validation
 */
@TypeGraphQL.InputType()
class PortfolioAllocationInput {
  @TypeGraphQL.Field(() => TypeGraphQL.Float)
  equitiesPct!: number;

  @TypeGraphQL.Field(() => TypeGraphQL.Float)
  optionsPct!: number;

  @TypeGraphQL.Field(() => TypeGraphQL.Float)
  cryptoPct!: number;

  @TypeGraphQL.Field(() => String)
  portfolioName!: string;
}

/**
 * Example: Trade configuration input with validation
 */
@TypeGraphQL.InputType()
class TradeConfigurationInput {
  @TypeGraphQL.Field(() => TypeGraphQL.Float)
  tradeAllocationPct!: number;

  @TypeGraphQL.Field(() => TypeGraphQL.Float)
  minPercentageChange!: number;

  @TypeGraphQL.Field(() => TypeGraphQL.Float)
  volumeThreshold!: number;

  @TypeGraphQL.Field(() => TypeGraphQL.Int)
  quantity!: number;
}

/**
 * Example resolver demonstrating manual validation in custom resolvers
 *
 * Note: With the validation plugin enabled, these validations happen
 * automatically. This example shows how to add ADDITIONAL custom validation
 * logic beyond the automatic pattern-based validation.
 */
@TypeGraphQL.Resolver()
export class ValidationExamplesResolver {
  /**
   * Example 1: Basic field validation in a mutation
   */
  @TypeGraphQL.Mutation(() => Boolean)
  async updatePortfolioAllocation(
    @TypeGraphQL.Arg('input') input: PortfolioAllocationInput
  ): Promise<boolean> {
    // The validation plugin will automatically validate:
    // - equitiesPct (0-100)
    // - optionsPct (0-100)
    // - cryptoPct (0-100)
    // - portfolioName (non-empty)

    // Add custom business logic validation
    const totalAllocation =
      input.equitiesPct + input.optionsPct + input.cryptoPct;
    if (totalAllocation !== 100) {
      throw new ValidationError('Total allocation must equal 100%', [
        {
          field: 'totalAllocation',
          value: totalAllocation,
          message:
            'Sum of equitiesPct, optionsPct, and cryptoPct must equal 100',
          constraint: 'sum',
        },
      ]);
    }

    // Resolver implementation...
    return true;
  }

  /**
   * Example 2: Batch validation using validateFields
   */
  @TypeGraphQL.Mutation(() => Boolean)
  async updateTradeConfiguration(
    @TypeGraphQL.Arg('input') input: TradeConfigurationInput
  ): Promise<boolean> {
    // The validation plugin handles basic validation automatically.
    // Use validateFields for additional custom validations.

    // ValidationError is automatically formatted by Apollo Server
    validateFields([
      // Custom validation: minPercentageChange should be less than tradeAllocationPct
      () => {
        if (input.minPercentageChange >= input.tradeAllocationPct) {
          throw new ValidationError('Invalid configuration', [
            {
              field: 'minPercentageChange',
              value: input.minPercentageChange,
              message: 'Must be less than tradeAllocationPct',
              constraint: 'comparison',
            },
          ]);
        }
      },
    ]);

    // Resolver implementation...
    return true;
  }

  /**
   * Example 3: Conditional validation based on business logic
   */
  @TypeGraphQL.Mutation(() => Boolean)
  async createTrade(
    @TypeGraphQL.Arg('quantity') quantity: number,
    @TypeGraphQL.Arg('isPremiumUser') isPremiumUser: boolean
  ): Promise<boolean> {
    // Basic validation happens automatically via plugin

    // Add conditional validation based on user type
    if (!isPremiumUser && quantity > 1000) {
      throw new ValidationError('Quantity limit exceeded', [
        {
          field: 'quantity',
          value: quantity,
          message: 'Non-premium users are limited to 1000 units per trade',
          constraint: 'userLimit',
        },
      ]);
    }

    // Resolver implementation...
    return true;
  }

  /**
   * Example 4: Validating related fields together
   */
  @TypeGraphQL.Mutation(() => Boolean)
  async setTradingThresholds(
    @TypeGraphQL.Arg('minPrice') minPrice: number,
    @TypeGraphQL.Arg('maxPrice') maxPrice: number,
    @TypeGraphQL.Arg('targetPrice') targetPrice: number
  ): Promise<boolean> {
    // Automatic validation ensures all are positive numbers

    // Custom validation for related fields
    if (minPrice >= maxPrice) {
      throw new ValidationError('Invalid price range', [
        {
          field: 'minPrice',
          value: minPrice,
          message: 'minPrice must be less than maxPrice',
          constraint: 'range',
        },
      ]);
    }

    if (targetPrice < minPrice || targetPrice > maxPrice) {
      throw new ValidationError('Invalid target price', [
        {
          field: 'targetPrice',
          value: targetPrice,
          message: 'targetPrice must be between minPrice and maxPrice',
          constraint: 'range',
        },
      ]);
    }

    // Resolver implementation...
    return true;
  }

  /**
   * Example 5: Using manual validation for non-standard field names
   */
  @TypeGraphQL.Mutation(() => Boolean)
  async updateCustomSettings(
    @TypeGraphQL.Arg('customAllocation') customAllocation: number,
    @TypeGraphQL.Arg('customQuantity') customQuantity: number
  ): Promise<boolean> {
    // These field names don't match the automatic validation patterns,
    // so we validate manually
    validatePercentage(customAllocation, 'customAllocation');
    validatePositiveNumber(customQuantity, 'customQuantity');

    // Resolver implementation...
    return true;
  }

  /**
   * Example 6: Accumulating multiple validation errors
   */
  @TypeGraphQL.Mutation(() => Boolean)
  async bulkUpdateAllocations(
    @TypeGraphQL.Arg('allocations', () => [PortfolioAllocationInput])
    allocations: PortfolioAllocationInput[]
  ): Promise<boolean> {
    // Validate each allocation
    // The plugin validates each item's fields automatically

    // Add custom cross-item validation
    const totalItems = allocations.length;
    if (totalItems === 0) {
      throw new ValidationError('Empty allocations array', [
        {
          field: 'allocations',
          value: totalItems,
          message: 'Must provide at least one allocation',
          constraint: 'notEmpty',
        },
      ]);
    }

    if (totalItems > 100) {
      throw new ValidationError('Too many allocations', [
        {
          field: 'allocations',
          value: totalItems,
          message: 'Maximum 100 allocations per request',
          constraint: 'maxLength',
        },
      ]);
    }

    // Resolver implementation...
    return true;
  }
}

/**
 * Example: Reusable validation functions for complex business rules
 */
export class CustomValidators {
  /**
   * Validates that portfolio allocations sum to 100%
   */
  static validatePortfolioAllocationSum(
    equities: number,
    options: number,
    crypto: number
  ): void {
    const total = equities + options + crypto;
    if (Math.abs(total - 100) > 0.01) {
      // Allow small floating point errors
      throw new ValidationError('Invalid portfolio allocation', [
        {
          field: 'totalAllocation',
          value: total,
          message: 'Total allocation must equal 100%',
          constraint: 'sum',
        },
      ]);
    }
  }

  /**
   * Validates that a price is within acceptable market bounds
   */
  static validateMarketPrice(price: number, fieldName: string): void {
    validatePositiveNumber(price, fieldName);

    // Additional market-specific validation
    if (price > 1000000) {
      throw new ValidationError('Price exceeds maximum', [
        {
          field: fieldName,
          value: price,
          message: 'Price cannot exceed $1,000,000',
          constraint: 'maximum',
        },
      ]);
    }
  }

  /**
   * Validates Greeks values are within expected ranges
   */
  static validateGreeks(
    delta: number,
    gamma: number,
    theta: number,
    vega: number
  ): void {
    validateFields([
      () => {
        if (delta < -1 || delta > 1) {
          throw new ValidationError('Invalid delta', [
            {
              field: 'delta',
              value: delta,
              message: 'Delta must be between -1 and 1',
              constraint: 'range',
            },
          ]);
        }
      },
      () => {
        if (gamma < 0) {
          throw new ValidationError('Invalid gamma', [
            {
              field: 'gamma',
              value: gamma,
              message: 'Gamma must be non-negative',
              constraint: 'minimum',
            },
          ]);
        }
      },
      () => {
        if (theta > 0) {
          throw new ValidationError('Invalid theta', [
            {
              field: 'theta',
              value: theta,
              message: 'Theta must be negative or zero',
              constraint: 'maximum',
            },
          ]);
        }
      },
      () => {
        if (vega < 0) {
          throw new ValidationError('Invalid vega', [
            {
              field: 'vega',
              value: vega,
              message: 'Vega must be non-negative',
              constraint: 'minimum',
            },
          ]);
        }
      },
    ]);
  }
}

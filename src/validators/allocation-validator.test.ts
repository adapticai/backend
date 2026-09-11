import {
  validateAllocationPercentages,
  assertValidAllocation,
  AllocationValues,
} from './allocation-validator';

describe('Allocation Validator', () => {
  describe('validateAllocationPercentages', () => {
    it('should validate correct allocation that sums to 100%', () => {
      const allocation: AllocationValues = {
        equities: 70,
        optionsContracts: 5,
        futures: 0,
        etfs: 10,
        forex: 0,
        crypto: 15,
      };

      const result = validateAllocationPercentages(allocation);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate with default values when fields are undefined', () => {
      const allocation: AllocationValues = {};

      const result = validateAllocationPercentages(allocation);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept allocation within floating point tolerance (99.99%)', () => {
      const allocation: AllocationValues = {
        equities: 69.99,
        optionsContracts: 5,
        futures: 0,
        etfs: 10,
        forex: 0,
        crypto: 15,
      };

      const result = validateAllocationPercentages(allocation);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept allocation within floating point tolerance (100.01%)', () => {
      const allocation: AllocationValues = {
        equities: 70.01,
        optionsContracts: 5,
        futures: 0,
        etfs: 10,
        forex: 0,
        crypto: 15,
      };

      const result = validateAllocationPercentages(allocation);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject allocation that does not sum to 100%', () => {
      const allocation: AllocationValues = {
        equities: 60,
        optionsContracts: 5,
        futures: 0,
        etfs: 10,
        forex: 0,
        crypto: 15,
      };

      const result = validateAllocationPercentages(allocation);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('allocation');
      expect(result.errors[0].message).toContain('must sum to 100%');
      expect(result.errors[0].message).toContain('90.00');
    });

    it('should reject allocation with negative values', () => {
      const allocation: AllocationValues = {
        equities: 105,
        optionsContracts: 5,
        futures: -5,
        etfs: 10,
        forex: 0,
        crypto: -15,
      };

      const result = validateAllocationPercentages(allocation);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      const negativeErrors = result.errors.filter((error) =>
        error.message.includes('cannot be negative')
      );
      expect(negativeErrors).toHaveLength(2);
      expect(negativeErrors.map((e) => e.field)).toContain('futures');
      expect(negativeErrors.map((e) => e.field)).toContain('crypto');
    });

    it('should reject allocation with non-numeric values', () => {
      // Intentionally violate AllocationValues at runtime to exercise the
      // defensive numeric check inside validateAllocationPercentages.
      const allocation = {
        equities: 'invalid',
        optionsContracts: 5,
        futures: 0,
        etfs: 10,
        forex: 0,
        crypto: 15,
      } as unknown as AllocationValues;

      const result = validateAllocationPercentages(allocation);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('equities');
      expect(result.errors[0].message).toContain('must be a valid number');
    });

    it('should reject allocation with NaN values', () => {
      const allocation: AllocationValues = {
        equities: NaN,
        optionsContracts: 5,
        futures: 0,
        etfs: 10,
        forex: 0,
        crypto: 15,
      };

      const result = validateAllocationPercentages(allocation);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('equities');
      expect(result.errors[0].message).toContain('must be a valid number');
    });

    it('should handle multiple validation errors', () => {
      const allocation: AllocationValues = {
        equities: -10,
        optionsContracts: 5,
        futures: 0,
        etfs: 10,
        forex: 0,
        crypto: 15,
      };

      const result = validateAllocationPercentages(allocation);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);

      const hasNegativeError = result.errors.some(
        (error) =>
          error.field === 'equities' &&
          error.message.includes('cannot be negative')
      );
      const hasSumError = result.errors.some(
        (error) =>
          error.field === 'allocation' &&
          error.message.includes('must sum to 100%')
      );

      expect(hasNegativeError).toBe(true);
      expect(hasSumError).toBe(true);
    });
  });

  describe('assertValidAllocation', () => {
    it('should not throw for valid allocation', () => {
      const allocation: AllocationValues = {
        equities: 70,
        optionsContracts: 5,
        futures: 0,
        etfs: 10,
        forex: 0,
        crypto: 15,
      };

      expect(() => assertValidAllocation(allocation)).not.toThrow();
    });

    it('should throw for invalid allocation', () => {
      const allocation: AllocationValues = {
        equities: 60,
        optionsContracts: 5,
        futures: 0,
        etfs: 10,
        forex: 0,
        crypto: 15,
      };

      expect(() => assertValidAllocation(allocation)).toThrow(
        'Allocation validation failed'
      );
    });

    it('should include detailed error message', () => {
      const allocation: AllocationValues = {
        equities: -10,
        optionsContracts: 5,
        futures: 0,
        etfs: 10,
        forex: 0,
        crypto: 15,
      };

      expect(() => assertValidAllocation(allocation)).toThrow(
        /equities.*cannot be negative/
      );
    });
  });
});

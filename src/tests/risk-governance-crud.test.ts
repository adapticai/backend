import { describe, it, expect } from 'vitest';
import adaptic from '../index';

/**
 * Smoke tests for the risk-governance CRUD function exports.
 *
 * These tests verify that the three risk-governance models introduced in Task B6
 * — AccountRiskMetrics, StrategyHealthSnapshot, RiskEscalationEvent — are
 * correctly exposed on the `adaptic` default export and that every expected CRUD
 * method is present and is a function. No network calls are made; these are
 * pure surface-area assertions.
 */
describe('risk-governance CRUD function exports', () => {
  const EXPECTED_METHODS = [
    'create',
    'createMany',
    'update',
    'updateMany',
    'upsert',
    'delete',
    'get',
    'getAll',
    'findMany',
  ] as const;

  describe('adaptic.accountRiskMetrics', () => {
    it('is exported on the adaptic namespace', () => {
      expect(adaptic.accountRiskMetrics).toBeDefined();
      expect(typeof adaptic.accountRiskMetrics).toBe('object');
    });

    it.each(EXPECTED_METHODS)('exposes method: %s', (method) => {
      expect(typeof adaptic.accountRiskMetrics[method]).toBe('function');
    });
  });

  describe('adaptic.strategyHealthSnapshot', () => {
    it('is exported on the adaptic namespace', () => {
      expect(adaptic.strategyHealthSnapshot).toBeDefined();
      expect(typeof adaptic.strategyHealthSnapshot).toBe('object');
    });

    it.each(EXPECTED_METHODS)('exposes method: %s', (method) => {
      expect(typeof adaptic.strategyHealthSnapshot[method]).toBe('function');
    });
  });

  describe('adaptic.riskEscalationEvent', () => {
    it('is exported on the adaptic namespace', () => {
      expect(adaptic.riskEscalationEvent).toBeDefined();
      expect(typeof adaptic.riskEscalationEvent).toBe('object');
    });

    it.each(EXPECTED_METHODS)('exposes method: %s', (method) => {
      expect(typeof adaptic.riskEscalationEvent[method]).toBe('function');
    });
  });
});

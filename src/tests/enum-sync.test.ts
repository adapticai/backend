import { describe, it, expect } from 'vitest';

// Prisma-generated enum values
import {
  AutonomyMode as PrismaAutonomyMode,
  OverlayType as PrismaOverlayType,
  OverlaySeverity as PrismaOverlaySeverity,
  OverlayStatus as PrismaOverlayStatus,
  DecisionOutcome as PrismaDecisionOutcome,
  DecisionRecordStatus as PrismaDecisionRecordStatus,
  DecisionMemoryOutcome as PrismaDecisionMemoryOutcome,
} from '@prisma/client';

// Mirror enums from @adaptic/utils
import {
  AutonomyMode as UtilsAutonomyMode,
  OverlayType as UtilsOverlayType,
  OverlaySeverity as UtilsOverlaySeverity,
  OverlayStatus as UtilsOverlayStatus,
  DecisionOutcome as UtilsDecisionOutcome,
  DecisionRecordStatus as UtilsDecisionRecordStatus,
  DecisionMemoryOutcome as UtilsDecisionMemoryOutcome,
} from '@adaptic/utils';

describe('Enum Sync: Prisma enums match expected values', () => {
  it('AutonomyMode has expected values', () => {
    const values = Object.values(PrismaAutonomyMode);
    expect(values).toContain('ADVISORY_ONLY');
    expect(values).toContain('EXECUTION_ON_APPROVAL');
    expect(values).toContain('SEMI_AUTONOMOUS');
    expect(values).toContain('FULLY_AUTONOMOUS');
    expect(values).toContain('EMERGENCY_SAFE_MODE');
    expect(values).toHaveLength(5);
  });

  it('OverlayType has expected values', () => {
    const values = Object.values(PrismaOverlayType);
    expect(values).toContain('BLACK_SWAN');
    expect(values).toContain('VOLATILITY_REGIME');
    expect(values).toContain('SECTOR_DETERIORATION');
    expect(values).toHaveLength(12);
  });

  it('OverlaySeverity has expected values', () => {
    const values = Object.values(PrismaOverlaySeverity);
    expect(values).toEqual(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
  });

  it('OverlayStatus has expected values', () => {
    const values = Object.values(PrismaOverlayStatus);
    expect(values).toEqual(['ACTIVE', 'EXPIRED', 'DEACTIVATED', 'SUPERSEDED']);
  });

  it('DecisionOutcome has expected values', () => {
    const values = Object.values(PrismaDecisionOutcome);
    expect(values).toContain('DO_NOTHING');
    expect(values).toContain('OPEN_POSITION');
    expect(values).toContain('ESCALATE_FOR_APPROVAL');
    expect(values).toHaveLength(12);
  });

  it('DecisionRecordStatus has expected values', () => {
    const values = Object.values(PrismaDecisionRecordStatus);
    expect(values).toEqual([
      'PENDING',
      'EXECUTING',
      'COMPLETED',
      'FAILED',
      'CANCELLED',
      'ESCALATED',
    ]);
  });

  it('DecisionMemoryOutcome has expected values', () => {
    const values = Object.values(PrismaDecisionMemoryOutcome);
    expect(values).toEqual([
      'PENDING',
      'PROFITABLE',
      'UNPROFITABLE',
      'STOPPED_OUT',
      'CANCELLED',
    ]);
  });
});

describe('Enum Sync: Prisma enums match @adaptic/utils mirror enums', () => {
  it('AutonomyMode matches @adaptic/utils', () => {
    expect(Object.values(PrismaAutonomyMode).sort()).toEqual(
      Object.values(UtilsAutonomyMode).sort()
    );
  });

  it('OverlayType matches @adaptic/utils', () => {
    expect(Object.values(PrismaOverlayType).sort()).toEqual(
      Object.values(UtilsOverlayType).sort()
    );
  });

  it('OverlaySeverity matches @adaptic/utils', () => {
    expect(Object.values(PrismaOverlaySeverity).sort()).toEqual(
      Object.values(UtilsOverlaySeverity).sort()
    );
  });

  it('OverlayStatus matches @adaptic/utils', () => {
    expect(Object.values(PrismaOverlayStatus).sort()).toEqual(
      Object.values(UtilsOverlayStatus).sort()
    );
  });

  it('DecisionOutcome matches @adaptic/utils', () => {
    expect(Object.values(PrismaDecisionOutcome).sort()).toEqual(
      Object.values(UtilsDecisionOutcome).sort()
    );
  });

  it('DecisionRecordStatus matches @adaptic/utils', () => {
    expect(Object.values(PrismaDecisionRecordStatus).sort()).toEqual(
      Object.values(UtilsDecisionRecordStatus).sort()
    );
  });

  it('DecisionMemoryOutcome matches @adaptic/utils', () => {
    expect(Object.values(PrismaDecisionMemoryOutcome).sort()).toEqual(
      Object.values(UtilsDecisionMemoryOutcome).sort()
    );
  });
});

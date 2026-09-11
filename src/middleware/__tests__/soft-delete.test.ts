import { describe, it, expect, vi } from 'vitest';
import {
  SOFT_DELETE_MODELS,
  softDeleteFilter,
  deletedOnlyFilter,
  isSoftDeleteModel,
  softDeleteRecord,
  restoreRecord,
  hardDelete,
} from '../soft-delete';

describe('Soft Delete Utilities', () => {
  describe('SOFT_DELETE_MODELS', () => {
    it('should include the expected models', () => {
      expect(SOFT_DELETE_MODELS.has('User')).toBe(true);
      expect(SOFT_DELETE_MODELS.has('AlpacaAccount')).toBe(true);
      expect(SOFT_DELETE_MODELS.has('Trade')).toBe(true);
      expect(SOFT_DELETE_MODELS.has('Action')).toBe(true);
    });

    it('should not include non-soft-delete models', () => {
      expect(SOFT_DELETE_MODELS.has('Alert')).toBe(false);
      expect(SOFT_DELETE_MODELS.has('Session')).toBe(false);
      expect(SOFT_DELETE_MODELS.has('AuditLog')).toBe(false);
      expect(SOFT_DELETE_MODELS.has('Asset')).toBe(false);
    });

    it('should contain exactly 4 models', () => {
      expect(SOFT_DELETE_MODELS.size).toBe(4);
    });
  });

  describe('softDeleteFilter', () => {
    it('should return deletedAt: null by default', () => {
      const filter = softDeleteFilter();
      expect(filter).toEqual({ deletedAt: null });
    });

    it('should return empty object when includeDeleted is true', () => {
      const filter = softDeleteFilter(true);
      expect(filter).toEqual({});
    });

    it('should return deletedAt: null when includeDeleted is false', () => {
      const filter = softDeleteFilter(false);
      expect(filter).toEqual({ deletedAt: null });
    });

    it('should be spreadable into a where clause', () => {
      const where = { role: 'USER', ...softDeleteFilter() };
      expect(where).toEqual({ role: 'USER', deletedAt: null });
    });

    it('should not add deletedAt filter when including deleted', () => {
      const where = { role: 'ADMIN', ...softDeleteFilter(true) };
      expect(where).toEqual({ role: 'ADMIN' });
    });
  });

  describe('deletedOnlyFilter', () => {
    it('should return a filter for only soft-deleted records', () => {
      const filter = deletedOnlyFilter();
      expect(filter).toEqual({ deletedAt: { not: null } });
    });

    it('should be spreadable into a where clause', () => {
      const where = { role: 'USER', ...deletedOnlyFilter() };
      expect(where).toEqual({ role: 'USER', deletedAt: { not: null } });
    });
  });

  describe('isSoftDeleteModel', () => {
    it('should return true for models with soft delete support', () => {
      expect(isSoftDeleteModel('User')).toBe(true);
      expect(isSoftDeleteModel('AlpacaAccount')).toBe(true);
      expect(isSoftDeleteModel('Trade')).toBe(true);
      expect(isSoftDeleteModel('Action')).toBe(true);
    });

    it('should return false for models without soft delete support', () => {
      expect(isSoftDeleteModel('Alert')).toBe(false);
      expect(isSoftDeleteModel('Session')).toBe(false);
      expect(isSoftDeleteModel('AuditLog')).toBe(false);
      expect(isSoftDeleteModel('Asset')).toBe(false);
      expect(isSoftDeleteModel('Customer')).toBe(false);
    });

    it('should return false for empty or unknown model names', () => {
      expect(isSoftDeleteModel('')).toBe(false);
      expect(isSoftDeleteModel('NonExistentModel')).toBe(false);
    });
  });

  describe('softDeleteRecord', () => {
    it('should call update with deletedAt set to current date', async () => {
      const mockUpdate = vi
        .fn()
        .mockResolvedValue({ id: 'user-123', deletedAt: new Date() });
      const mockDelegate = { update: mockUpdate };

      await softDeleteRecord(mockDelegate, 'user-123', 'User');

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      const callArgs = mockUpdate.mock.calls[0][0];
      expect(callArgs.where).toEqual({ id: 'user-123' });
      expect(callArgs.data.deletedAt).toBeInstanceOf(Date);
    });

    it('should return the updated record', async () => {
      const expectedResult = { id: 'trade-456', deletedAt: new Date() };
      const mockUpdate = vi.fn().mockResolvedValue(expectedResult);
      const mockDelegate = { update: mockUpdate };

      const result = await softDeleteRecord(mockDelegate, 'trade-456', 'Trade');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('restoreRecord', () => {
    it('should call update with deletedAt set to null', async () => {
      const mockUpdate = vi
        .fn()
        .mockResolvedValue({ id: 'user-123', deletedAt: null });
      const mockDelegate = { update: mockUpdate };

      await restoreRecord(mockDelegate, 'user-123', 'User');

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { deletedAt: null },
      });
    });

    it('should return the restored record', async () => {
      const expectedResult = { id: 'action-789', deletedAt: null };
      const mockUpdate = vi.fn().mockResolvedValue(expectedResult);
      const mockDelegate = { update: mockUpdate };

      const result = await restoreRecord(mockDelegate, 'action-789', 'Action');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('hardDelete', () => {
    it('should execute raw SQL delete for supported models', async () => {
      const mockExecuteRawUnsafe = vi.fn().mockResolvedValue(1);
      const mockPrisma = { $executeRawUnsafe: mockExecuteRawUnsafe };

      const result = await hardDelete(mockPrisma, 'User', 'user-123');

      expect(result).toBe(1);
      expect(mockExecuteRawUnsafe).toHaveBeenCalledWith(
        'DELETE FROM "users" WHERE "id" = $1',
        'user-123'
      );
    });

    it('should use correct table names for each model', async () => {
      const mockExecuteRawUnsafe = vi.fn().mockResolvedValue(1);
      const mockPrisma = { $executeRawUnsafe: mockExecuteRawUnsafe };

      const modelTablePairs: Array<[string, string]> = [
        ['User', 'users'],
        ['AlpacaAccount', 'alpaca_accounts'],
        ['Trade', 'trades'],
        ['Action', 'actions'],
      ];

      for (const [model, table] of modelTablePairs) {
        mockExecuteRawUnsafe.mockClear();
        await hardDelete(mockPrisma, model, 'test-id');
        expect(mockExecuteRawUnsafe).toHaveBeenCalledWith(
          `DELETE FROM "${table}" WHERE "id" = $1`,
          'test-id'
        );
      }
    });

    it('should throw an error for unsupported models', async () => {
      const mockPrisma = { $executeRawUnsafe: vi.fn() };

      await expect(
        hardDelete(mockPrisma, 'Alert', 'alert-123')
      ).rejects.toThrow('Model "Alert" does not support hard delete');
      expect(mockPrisma.$executeRawUnsafe).not.toHaveBeenCalled();
    });

    it('should return the count of deleted rows', async () => {
      const mockExecuteRawUnsafe = vi.fn().mockResolvedValue(0);
      const mockPrisma = { $executeRawUnsafe: mockExecuteRawUnsafe };

      const result = await hardDelete(mockPrisma, 'User', 'non-existent-id');
      expect(result).toBe(0);
    });
  });
});

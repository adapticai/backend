/**
 * Soft Delete Utilities
 *
 * Provides utilities for soft-delete behavior on critical models.
 * Instead of removing records from the database, a `deletedAt` timestamp
 * is set, and query helpers filter out soft-deleted records by default.
 *
 * Models with soft delete support: User, AlpacaAccount, Trade, Action
 *
 * Usage patterns:
 * 1. Use `softDeleteFilter()` in where clauses to exclude deleted records
 * 2. Use `softDeleteRecord()` to soft-delete a record (set deletedAt)
 * 3. Use `hardDelete()` for permanent administrative deletion
 * 4. Pass `includeDeleted: true` to admin queries to see all records
 *
 * Note: Prisma 6 removed the $use() middleware API. Soft delete behavior
 * is implemented via utility functions called from resolvers and services.
 */

import { logger } from '../utils/logger';

/**
 * Models that support soft deletion via the deletedAt field.
 * Only these models have the deletedAt column in the database.
 */
const SOFT_DELETE_MODELS = new Set([
  'User',
  'AlpacaAccount',
  'Trade',
  'Action',
]);

/**
 * Returns a where clause filter that excludes soft-deleted records.
 * Can be spread into any Prisma where clause for soft-delete-aware queries.
 *
 * @param includeDeleted - When true, returns an empty filter (includes deleted records)
 * @returns An object to spread into a Prisma where clause
 *
 * @example
 * ```typescript
 * // Exclude soft-deleted users (default)
 * const users = await prisma.user.findMany({
 *   where: { role: 'USER', ...softDeleteFilter() },
 * });
 *
 * // Include soft-deleted users (admin query)
 * const allUsers = await prisma.user.findMany({
 *   where: { role: 'USER', ...softDeleteFilter(true) },
 * });
 * ```
 */
function softDeleteFilter(includeDeleted = false): { deletedAt?: null } {
  if (includeDeleted) {
    return {};
  }
  return { deletedAt: null };
}

/**
 * Returns a where clause filter for finding only soft-deleted records.
 * Useful for admin interfaces that need to list deleted records for restoration.
 *
 * @returns An object to spread into a Prisma where clause
 *
 * @example
 * ```typescript
 * // Find only soft-deleted users
 * const deletedUsers = await prisma.user.findMany({
 *   where: { ...deletedOnlyFilter() },
 * });
 * ```
 */
function deletedOnlyFilter(): { deletedAt: { not: null } } {
  return { deletedAt: { not: null } };
}

/**
 * Checks whether a given model supports soft deletion.
 *
 * @param modelName - The Prisma model name (PascalCase)
 * @returns True if the model has a deletedAt field
 */
function isSoftDeleteModel(modelName: string): boolean {
  return SOFT_DELETE_MODELS.has(modelName);
}

/** Minimal Prisma delegate interface for soft-delete operations */
interface PrismaModelDelegate {
  update: (args: {
    where: { id: string };
    data: { deletedAt: Date };
  }) => Promise<unknown>;
}

/**
 * Soft-deletes a record by setting its deletedAt timestamp.
 * This is the recommended way to "delete" records in soft-delete-enabled models.
 *
 * @param delegate - The Prisma model delegate (e.g., prisma.user)
 * @param id - The record ID to soft-delete
 * @param modelName - The model name for logging purposes
 * @returns The updated record
 *
 * @example
 * ```typescript
 * // Soft-delete a user
 * await softDeleteRecord(prisma.user, 'user-123', 'User');
 * ```
 */
async function softDeleteRecord(
  delegate: PrismaModelDelegate,
  id: string,
  modelName: string
): Promise<unknown> {
  logger.info('Soft delete: Setting deletedAt on record', {
    model: modelName,
    id,
  });
  return delegate.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

/** Minimal Prisma delegate interface for restore operations */
interface PrismaRestoreDelegate {
  update: (args: {
    where: { id: string };
    data: { deletedAt: null };
  }) => Promise<unknown>;
}

/**
 * Restores a soft-deleted record by clearing its deletedAt timestamp.
 *
 * @param delegate - The Prisma model delegate (e.g., prisma.user)
 * @param id - The record ID to restore
 * @param modelName - The model name for logging purposes
 * @returns The updated record
 *
 * @example
 * ```typescript
 * // Restore a soft-deleted user
 * await restoreRecord(prisma.user, 'user-123', 'User');
 * ```
 */
async function restoreRecord(
  delegate: PrismaRestoreDelegate,
  id: string,
  modelName: string
): Promise<unknown> {
  logger.info('Soft delete: Restoring record (clearing deletedAt)', {
    model: modelName,
    id,
  });
  return delegate.update({
    where: { id },
    data: { deletedAt: null },
  });
}

/**
 * Mapping from model names to their database table names.
 * Used for raw SQL hard-delete operations.
 */
const TABLE_NAME_MAP: Record<string, string> = {
  User: 'users',
  AlpacaAccount: 'alpaca_accounts',
  Trade: 'trades',
  Action: 'actions',
};

/**
 * Permanently deletes a record from the database.
 * This bypasses soft delete and removes the row entirely.
 * Should only be used for administrative cleanup operations.
 *
 * @param prisma - The Prisma client instance (with $executeRawUnsafe)
 * @param model - The model name (PascalCase)
 * @param id - The record ID to permanently delete
 * @returns The number of rows deleted
 *
 * @example
 * ```typescript
 * // Permanently delete a soft-deleted user
 * const deleted = await hardDelete(prisma, 'User', 'user-123');
 * ```
 */
async function hardDelete(
  prisma: {
    $executeRawUnsafe: (query: string, ...values: unknown[]) => Promise<number>;
  },
  model: string,
  id: string
): Promise<number> {
  const tableName = TABLE_NAME_MAP[model];
  if (!tableName) {
    throw new Error(`Model "${model}" does not support hard delete`);
  }

  logger.warn('Hard delete: Permanently removing record', { model, id });
  return prisma.$executeRawUnsafe(
    `DELETE FROM "${tableName}" WHERE "id" = $1`,
    id
  );
}

export {
  SOFT_DELETE_MODELS,
  softDeleteFilter,
  deletedOnlyFilter,
  isSoftDeleteModel,
  softDeleteRecord,
  restoreRecord,
  hardDelete,
};

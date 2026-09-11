import { describe, it, expect } from 'vitest';
import {
  parseMutationOperation,
  extractUserId,
  extractRecordId,
  extractChangedFields,
} from '../audit-logger';

describe('parseMutationOperation', () => {
  it('should parse createOne operations', () => {
    const result = parseMutationOperation('createOneUser');
    expect(result).toEqual({
      operationType: 'CREATE',
      modelName: 'User',
      operationName: 'createOneUser',
    });
  });

  it('should parse createMany operations', () => {
    const result = parseMutationOperation('createManyTrade');
    expect(result).toEqual({
      operationType: 'CREATE',
      modelName: 'Trade',
      operationName: 'createManyTrade',
    });
  });

  it('should parse updateOne operations', () => {
    const result = parseMutationOperation('updateOneAlpacaAccount');
    expect(result).toEqual({
      operationType: 'UPDATE',
      modelName: 'AlpacaAccount',
      operationName: 'updateOneAlpacaAccount',
    });
  });

  it('should parse updateMany operations', () => {
    const result = parseMutationOperation('updateManyAction');
    expect(result).toEqual({
      operationType: 'UPDATE',
      modelName: 'Action',
      operationName: 'updateManyAction',
    });
  });

  it('should parse deleteOne operations', () => {
    const result = parseMutationOperation('deleteOneUser');
    expect(result).toEqual({
      operationType: 'DELETE',
      modelName: 'User',
      operationName: 'deleteOneUser',
    });
  });

  it('should parse deleteMany operations', () => {
    const result = parseMutationOperation('deleteManyTrade');
    expect(result).toEqual({
      operationType: 'DELETE',
      modelName: 'Trade',
      operationName: 'deleteManyTrade',
    });
  });

  it('should parse upsertOne as CREATE', () => {
    const result = parseMutationOperation('upsertOneUser');
    expect(result).toEqual({
      operationType: 'CREATE',
      modelName: 'User',
      operationName: 'upsertOneUser',
    });
  });

  it('should return null for unrecognized operations', () => {
    expect(parseMutationOperation('findManyUser')).toBeNull();
    expect(parseMutationOperation('randomOperation')).toBeNull();
    expect(parseMutationOperation('')).toBeNull();
  });

  it('should return null for query operations', () => {
    expect(parseMutationOperation('user')).toBeNull();
    expect(parseMutationOperation('users')).toBeNull();
    expect(parseMutationOperation('findUniqueUser')).toBeNull();
  });
});

describe('extractUserId', () => {
  // The AuditLog.userId column is typed `String? @db.Uuid` in the Prisma
  // schema. Since 2026-03-18 (commit 4435f30) extractUserId validates the
  // raw id against a UUID regex and returns null for non-UUID values, so
  // that Prisma.auditLog.create() never receives a malformed UUID (which
  // would throw at the database boundary and fail the mutation request).
  const UUID_A = '11111111-2222-3333-4444-555555555555';
  const UUID_B = '99999999-8888-7777-6666-aaaaaaaaaaaa';

  it('should extract sub from user object when sub is a UUID', () => {
    expect(extractUserId({ sub: UUID_A })).toBe(UUID_A);
  });

  it('should extract id from user object when sub is missing and id is a UUID', () => {
    expect(extractUserId({ id: UUID_A })).toBe(UUID_A);
  });

  it('should prefer sub over id when both are UUIDs', () => {
    expect(extractUserId({ sub: UUID_A, id: UUID_B })).toBe(UUID_A);
  });

  it('should return the string directly for string users when it is a UUID', () => {
    expect(extractUserId(UUID_A)).toBe(UUID_A);
  });

  it('should return null for null or undefined', () => {
    expect(extractUserId(null)).toBeNull();
    expect(extractUserId(undefined)).toBeNull();
  });

  it('should return null for user object with no id fields', () => {
    expect(extractUserId({ name: 'John' })).toBeNull();
  });

  it('should return null for non-UUID sub values (e.g. Auth0-style ids)', () => {
    expect(extractUserId({ sub: 'auth0|123456' })).toBeNull();
    expect(extractUserId({ sub: 'user-123' })).toBeNull();
  });

  it('should return null for non-UUID id values', () => {
    expect(extractUserId({ id: 'not-a-uuid' })).toBeNull();
  });

  it('should return null for non-UUID raw string users', () => {
    expect(extractUserId('user-string')).toBeNull();
  });

  it('should accept uppercase UUIDs (case-insensitive regex)', () => {
    expect(extractUserId(UUID_A.toUpperCase())).toBe(UUID_A.toUpperCase());
  });
});

describe('extractRecordId', () => {
  it('should extract id from mutation result', () => {
    const data = {
      createOneUser: { id: 'abc-123', name: 'Test' },
    };
    expect(extractRecordId(data)).toBe('abc-123');
  });

  it('should return unknown for null data', () => {
    expect(extractRecordId(null)).toBe('unknown');
    expect(extractRecordId(undefined)).toBe('unknown');
  });

  it('should return unknown for empty data', () => {
    expect(extractRecordId({})).toBe('unknown');
  });

  it('should return unknown when result has no id field', () => {
    const data = {
      createOneUser: { name: 'Test' },
    };
    expect(extractRecordId(data)).toBe('unknown');
  });

  it('should handle primitive result values', () => {
    const data = { count: 5 };
    expect(extractRecordId(data)).toBe('unknown');
  });
});

describe('extractChangedFields', () => {
  it('should extract input data for CREATE operations', () => {
    const variables = {
      data: { name: 'John', email: 'john@example.com' },
    };
    const result = extractChangedFields('CREATE', variables);
    expect(result).toEqual({
      input: { name: 'John', email: 'john@example.com' },
    });
  });

  it('should extract where and data for UPDATE operations', () => {
    const variables = {
      where: { id: 'abc-123' },
      data: { name: 'Updated Name' },
    };
    const result = extractChangedFields('UPDATE', variables);
    expect(result).toEqual({
      where: { id: 'abc-123' },
      data: { name: 'Updated Name' },
    });
  });

  it('should extract where clause for DELETE operations', () => {
    const variables = {
      where: { id: 'abc-123' },
    };
    const result = extractChangedFields('DELETE', variables);
    expect(result).toEqual({
      where: { id: 'abc-123' },
    });
  });

  it('should return empty object for null variables', () => {
    expect(extractChangedFields('CREATE', null)).toEqual({});
    expect(extractChangedFields('UPDATE', undefined)).toEqual({});
  });

  it('should use entire variables as input when data field is missing for CREATE', () => {
    const variables = { name: 'Direct Input' };
    const result = extractChangedFields('CREATE', variables);
    expect(result).toEqual({
      input: { name: 'Direct Input' },
    });
  });
});

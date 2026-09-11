import { describe, it, expect } from 'vitest';
import { removeUndefinedProps } from '../utils';

describe('removeUndefinedProps', () => {
  it('should remove undefined properties from a flat object', () => {
    const input = { a: 1, b: undefined, c: 'hello' };
    const result = removeUndefinedProps(input);
    expect(result).toEqual({ a: 1, c: 'hello' });
  });

  // This case previously asserted that null was REMOVED, which is how the
  // defect survived: the behaviour was pinned as intended. In a Prisma update
  // an omitted field is left alone and `{ set: null }` clears it, so dropping
  // null makes clearing a field impossible on every generated model — the
  // mutation returns the unchanged row and reports success.
  it('should preserve null properties, which mean "set this to null"', () => {
    const input = { a: 1, b: null, c: 'hello' };
    const result = removeUndefinedProps(input);
    expect(result).toEqual({ a: 1, b: null, c: 'hello' });
  });

  it('should preserve a Prisma set-null operation so a field can be cleared', () => {
    // The exact shape the generated CRUD functions build for
    // `update({ id, advancedModelId: null })`. Before the fix this reduced to
    // `{ where: { id }, data: { id: { set: id } } }` — the field silently gone.
    const input = {
      where: { id: 'policy-1' },
      data: {
        id: { set: 'policy-1' },
        advancedModelId: { set: null },
        advancedModelProvider: { set: null },
        untouched: undefined,
      },
    };
    const result = removeUndefinedProps(input);
    expect(result).toEqual({
      where: { id: 'policy-1' },
      data: {
        id: { set: 'policy-1' },
        advancedModelId: { set: null },
        advancedModelProvider: { set: null },
      },
    });
  });

  it('should still distinguish undefined from null on the same object', () => {
    const input = { cleared: null, untouched: undefined, kept: 'v' };
    const result = removeUndefinedProps(input);
    expect(result).toEqual({ cleared: null, kept: 'v' });
    expect(Object.prototype.hasOwnProperty.call(result, 'untouched')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(result, 'cleared')).toBe(true);
  });

  it('should handle nested objects recursively', () => {
    const input = {
      a: 1,
      b: {
        c: undefined,
        d: 'value',
        e: {
          f: undefined,
          g: 42,
        },
      },
    };
    const result = removeUndefinedProps(input);
    expect(result).toEqual({
      a: 1,
      b: {
        d: 'value',
        e: {
          g: 42,
        },
      },
    });
  });

  it('should filter arrays removing undefined and null items', () => {
    const input = [1, undefined, 'hello', null, 42];
    const result = removeUndefinedProps(input);
    expect(result).toEqual([1, 'hello', 42]);
  });

  it('should remove empty objects from arrays', () => {
    const input = [{ a: undefined }, { b: 1 }];
    const result = removeUndefinedProps(input);
    expect(result).toEqual([{ b: 1 }]);
  });

  it('should return primitives unchanged', () => {
    expect(removeUndefinedProps(42)).toBe(42);
    expect(removeUndefinedProps('hello')).toBe('hello');
    expect(removeUndefinedProps(true)).toBe(true);
    expect(removeUndefinedProps(false)).toBe(false);
  });

  it('should return undefined for null input', () => {
    expect(removeUndefinedProps(null)).toBeUndefined();
  });

  it('should return undefined for undefined input', () => {
    expect(removeUndefinedProps(undefined)).toBeUndefined();
  });

  it('should retain only id field within where clause when id is present', () => {
    const input = {
      where: {
        id: 'abc-123',
        name: 'test',
        email: 'test@example.com',
      },
    };
    const result = removeUndefinedProps(input);
    expect(result).toEqual({
      where: {
        id: 'abc-123',
      },
    });
  });

  it('should process where clause normally when id is not present', () => {
    const input = {
      where: {
        name: 'test',
        email: 'test@example.com',
      },
    };
    const result = removeUndefinedProps(input);
    expect(result).toEqual({
      where: {
        name: 'test',
        email: 'test@example.com',
      },
    });
  });

  it('should remove empty nested objects', () => {
    const input = {
      a: 1,
      b: {
        c: undefined,
      },
    };
    const result = removeUndefinedProps(input);
    expect(result).toEqual({ a: 1 });
  });

  it('should handle deeply nested structures', () => {
    const input = {
      data: {
        user: {
          name: 'John',
          settings: {
            theme: undefined,
            language: 'en',
          },
        },
      },
    };
    const result = removeUndefinedProps(input);
    expect(result).toEqual({
      data: {
        user: {
          name: 'John',
          settings: {
            language: 'en',
          },
        },
      },
    });
  });
});

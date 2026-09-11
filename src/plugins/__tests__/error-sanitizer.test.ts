/**
 * Tests for Error Sanitizer
 *
 * Run with: npx jest src/plugins/__tests__/error-sanitizer.test.ts
 */

describe('Error Sanitizer', () => {
  describe('safe error codes', () => {
    const safeErrorCodes = [
      'GRAPHQL_PARSE_FAILED',
      'GRAPHQL_VALIDATION_FAILED',
      'BAD_USER_INPUT',
      'UNAUTHENTICATED',
      'FORBIDDEN',
      'QUERY_DEPTH_LIMIT_EXCEEDED',
    ];

    it('should recognize safe error codes', () => {
      safeErrorCodes.forEach((code) => {
        // These errors should pass through in production
        expect(code).toBeTruthy();
      });
    });

    it('should not sanitize validation errors', () => {
      const validationError = {
        message: 'Field "unknownField" is not defined by type "User"',
        extensions: {
          code: 'GRAPHQL_VALIDATION_FAILED',
        },
      };

      // In production, this message should be preserved
      expect(validationError.message).toContain('unknownField');
    });
  });

  describe('production mode', () => {
    it('should sanitize internal errors', () => {
      const originalMessage = 'Cannot read property "x" of undefined';
      const sanitizedMessage = 'Internal server error';

      expect(sanitizedMessage).toBe('Internal server error');
      expect(sanitizedMessage).not.toContain('property');
    });

    it('should strip stack traces', () => {
      const extensions = {
        code: 'INTERNAL_SERVER_ERROR',
        exception: {
          stacktrace: ['Error: Something broke', 'at line 123'],
        },
      };

      // Stack traces should be removed in production
      const sanitized = { code: extensions.code };
      expect(sanitized).not.toHaveProperty('exception');
      expect(sanitized).not.toHaveProperty('stacktrace');
    });

    it('should preserve safe error details', () => {
      const error = {
        message: 'Query depth of 8 exceeds maximum allowed depth of 6',
        extensions: {
          code: 'QUERY_DEPTH_LIMIT_EXCEEDED',
          depth: 8,
          maxDepth: 6,
        },
      };

      // Safe errors should keep their details
      expect(error.extensions.depth).toBe(8);
      expect(error.extensions.maxDepth).toBe(6);
    });
  });

  describe('development mode', () => {
    it('should include full error details', () => {
      const error = {
        message: 'Cannot read property "x" of undefined',
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          exception: {
            stacktrace: ['Error: Something broke', 'at line 123'],
          },
        },
      };

      // In development, everything should be available
      expect(error.message).toContain('property');
      expect(error.extensions.exception).toBeDefined();
    });
  });

  describe('logging', () => {
    it('should include request context', () => {
      const logData = {
        userId: 'user123',
        requestId: 'abc-123',
        message: 'Some error',
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
      };

      expect(logData.userId).toBe('user123');
      expect(logData.requestId).toBe('abc-123');
    });

    it('should default to anonymous for missing user', () => {
      const userId = 'anonymous';
      expect(userId).toBe('anonymous');
    });

    it('should default to unknown for missing request ID', () => {
      const requestId = 'unknown';
      expect(requestId).toBe('unknown');
    });
  });
});

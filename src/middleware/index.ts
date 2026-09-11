/**
 * Middleware Index
 *
 * Provides GraphQL mutation input validation, audit logging,
 * soft-delete handling, and authentication middleware.
 */

// Export validation functions
export {
  validatePercentage,
  validatePositiveNumber,
  validateEmail,
  validateUrl,
  validateNonEmpty,
  validateConfidenceScore,
  validateFields,
  ValidationError,
  ValidationErrorDetail,
} from './input-validator';

// Export GraphQL validation plugin
export {
  createValidationPlugin,
  resolveValidationMode,
  ValidationMode,
  VALIDATION_MODE_ENV_VAR,
  BOUNDED_PERCENTAGE_FIELDS,
  REQUIRED_NON_EMPTY_STRING_FIELDS,
  POSITIVE_NUMBER_FIELDS,
  VALIDATION_RULES,
} from './graphql-validation-plugin';

// Export authentication middleware
export { authMiddleware, AuthenticatedRequest } from './auth';

// Export audit logging plugin
export {
  createAuditLogPlugin,
  parseMutationOperation,
  extractUserId,
  extractRecordId,
  extractChangedFields,
} from './audit-logger';

// Export soft-delete utilities
export {
  SOFT_DELETE_MODELS,
  softDeleteFilter,
  deletedOnlyFilter,
  isSoftDeleteModel,
  softDeleteRecord,
  restoreRecord,
  hardDelete,
} from './soft-delete';

// Export example validators for reference
export { CustomValidators } from './validation-examples';

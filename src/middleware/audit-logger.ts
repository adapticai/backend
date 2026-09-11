/**
 * Audit Logging Middleware
 *
 * Captures all GraphQL mutations and records an append-only audit trail.
 * Each audit log entry includes: user ID (from JWT context), timestamp,
 * operation type, model name, record ID, and changed fields.
 *
 * This middleware is implemented as an Apollo Server plugin that intercepts
 * mutation operations and logs them to the AuditLog table.
 */

import type {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from '@apollo/server';
import type { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

/** Represents the user object decoded from JWT context */
interface AuditUser {
  sub?: string;
  id?: string;
  name?: string;
  role?: string;
  provider?: string;
}

/** Context shape expected by the audit logger plugin */
interface AuditContext {
  prisma: PrismaClient;
  user?: AuditUser | string | null;
  req?: {
    ip?: string;
    headers?: Record<string, string | string[] | undefined>;
  };
}

/** Fields extracted from a GraphQL mutation for audit logging */
interface MutationAuditData {
  operationType: 'CREATE' | 'UPDATE' | 'DELETE';
  modelName: string;
  operationName: string;
}

/** List of models that are excluded from audit logging (e.g., the audit log itself) */
const EXCLUDED_MODELS = new Set([
  'AuditLog',
  'Session',
  'VerificationToken',
  'Authenticator',
]);

/**
 * Extracts the model name and operation type from a GraphQL mutation operation name.
 * TypeGraphQL-Prisma generates mutations with names like:
 *   createOneUser, updateOneUser, deleteOneUser,
 *   createManyUser, updateManyUser, deleteManyUser,
 *   upsertOneUser
 *
 * @param operationName - The name of the GraphQL field being executed
 * @returns Parsed mutation data or null if not a recognized mutation pattern
 */
function parseMutationOperation(
  operationName: string
): MutationAuditData | null {
  const createPattern = /^(createOne|createMany|upsertOne)(\w+)$/;
  const updatePattern = /^(updateOne|updateMany|upsertOne)(\w+)$/;
  const deletePattern = /^(deleteOne|deleteMany)(\w+)$/;

  let match = createPattern.exec(operationName);
  if (match) {
    return {
      operationType: 'CREATE',
      modelName: match[2],
      operationName,
    };
  }

  match = updatePattern.exec(operationName);
  if (match) {
    return {
      operationType: 'UPDATE',
      modelName: match[2],
      operationName,
    };
  }

  match = deletePattern.exec(operationName);
  if (match) {
    return {
      operationType: 'DELETE',
      modelName: match[2],
      operationName,
    };
  }

  return null;
}

/**
 * Extracts the user ID from the context user object.
 * Handles both JWT-decoded objects and raw string tokens.
 *
 * The result must be a syntactically valid UUID because the
 * `AuditLog.userId` column is typed `String? @db.Uuid` in the Prisma
 * schema. Non-UUID values (e.g. Auth0-style `sub` like `auth0|abc`) are
 * coerced to `null` so the downstream `auditLog.create()` does not fail
 * at the Postgres boundary and abort the originating mutation.
 *
 * @param user - The user object from GraphQL context
 * @returns The user ID string when a valid UUID, otherwise null
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function extractUserId(
  user: AuditUser | string | null | undefined
): string | null {
  if (!user) return null;
  const rawId = typeof user === 'string' ? user : user.sub || user.id || null;
  if (!rawId) return null;
  return UUID_REGEX.test(rawId) ? rawId : null;
}

/**
 * Extracts the record ID from the mutation result data.
 * Looks for 'id' field in the top-level result object.
 *
 * @param data - The result data from the mutation
 * @returns The record ID as a string, or 'unknown'
 */
function extractRecordId(
  data: Record<string, unknown> | null | undefined
): string {
  if (!data) return 'unknown';

  // The result is typically nested under the mutation name
  const values = Object.values(data);
  if (values.length === 0) return 'unknown';

  const result = values[0];
  if (
    result &&
    typeof result === 'object' &&
    'id' in (result as Record<string, unknown>)
  ) {
    return String((result as Record<string, unknown>).id);
  }

  return 'unknown';
}

/**
 * Extracts changed fields from the mutation variables.
 * For create operations, captures all input data.
 * For update operations, captures the data being set.
 * For delete operations, captures the where clause.
 *
 * @param operationType - The type of mutation operation
 * @param variables - The GraphQL variables passed to the mutation
 * @returns A JSON-serializable object representing the changed fields
 */
function extractChangedFields(
  operationType: 'CREATE' | 'UPDATE' | 'DELETE',
  variables: Record<string, unknown> | null | undefined
): Record<string, unknown> {
  if (!variables) return {};

  switch (operationType) {
    case 'CREATE':
      return { input: variables.data || variables };
    case 'UPDATE':
      return {
        where: variables.where || {},
        data: variables.data || {},
      };
    case 'DELETE':
      return { where: variables.where || {} };
    default:
      return variables;
  }
}

/**
 * Creates an Apollo Server plugin that logs all mutations to the AuditLog table.
 *
 * The plugin intercepts the willSendResponse lifecycle event to capture
 * mutation results after they have been processed by the resolvers.
 * Only successful mutations are logged (errors are not audited here).
 *
 * @returns An Apollo Server plugin instance
 */
export function createAuditLogPlugin(): ApolloServerPlugin<AuditContext> {
  return {
    async requestDidStart(
      _requestContext: GraphQLRequestContext<AuditContext>
    ): Promise<GraphQLRequestListener<AuditContext> | void> {
      return {
        async willSendResponse(requestContext) {
          const { contextValue, response, request, document } = requestContext;

          // Only audit mutations
          if (!document) return;

          const definitions = document.definitions;
          const operationDef = definitions.find(
            (def) =>
              def.kind === 'OperationDefinition' && def.operation === 'mutation'
          );

          if (!operationDef || operationDef.kind !== 'OperationDefinition')
            return;

          // Skip if there were errors (we only audit successful mutations)
          if (
            response.body.kind === 'single' &&
            response.body.singleResult.errors?.length
          ) {
            return;
          }

          const prisma = contextValue.prisma;
          if (!prisma) {
            logger.warn('Audit logger: Prisma client not available in context');
            return;
          }

          // Extract mutation field names from the selection set
          const selections = operationDef.selectionSet.selections;

          for (const selection of selections) {
            if (selection.kind !== 'Field') continue;

            const fieldName = selection.name.value;
            const auditData = parseMutationOperation(fieldName);

            if (!auditData) continue;
            if (EXCLUDED_MODELS.has(auditData.modelName)) continue;

            const userId = extractUserId(contextValue.user);
            const variables = request.variables as
              | Record<string, unknown>
              | null
              | undefined;
            const changedFields = extractChangedFields(
              auditData.operationType,
              variables
            );

            // Extract record ID from response data
            let recordId = 'unknown';
            if (
              response.body.kind === 'single' &&
              response.body.singleResult.data
            ) {
              recordId = extractRecordId(
                response.body.singleResult.data as Record<string, unknown>
              );
            }

            // Extract IP address from request context
            const ipAddress =
              contextValue.req?.ip ||
              (contextValue.req?.headers?.['x-forwarded-for'] as
                | string
                | undefined) ||
              null;

            try {
              const prismaRecord = prisma as unknown as Record<string, unknown>;
              if (prismaRecord.auditLog) {
                const auditLogDelegate = prismaRecord.auditLog as {
                  create: (args: {
                    data: Record<string, unknown>;
                  }) => Promise<unknown>;
                };
                await auditLogDelegate.create({
                  data: {
                    userId,
                    operationType: auditData.operationType,
                    modelName: auditData.modelName,
                    recordId,
                    changedFields,
                    operationName: auditData.operationName,
                    ipAddress,
                    metadata: {
                      graphqlOperationName: request.operationName || null,
                    },
                  },
                });
              } else {
                logger.warn(
                  'Audit logger: AuditLog model not available on Prisma client'
                );
              }
            } catch (error) {
              // Audit logging failures should never break the main request
              logger.error('Audit logger: Failed to write audit log entry', {
                error: error instanceof Error ? error.message : String(error),
                modelName: auditData.modelName,
                operationType: auditData.operationType,
              });
            }
          }
        },
      };
    },
  };
}

export {
  parseMutationOperation,
  extractUserId,
  extractRecordId,
  extractChangedFields,
};

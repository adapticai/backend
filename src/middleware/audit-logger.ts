/**
 * Audit Logging Middleware
 *
 * Captures all GraphQL mutations and records an append-only audit trail.
 * Each audit log entry includes: user ID (from JWT context), timestamp,
 * operation type, model name, record ID, and changed fields. The changed
 * fields are the executed field's own arguments, each under its schema path,
 * with stored-credential values redacted.
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
import {
  valueFromASTUntyped,
  type DirectiveNode,
  type DocumentNode,
  type FieldNode,
  type FragmentDefinitionNode,
  type OperationDefinitionNode,
  type SelectionSetNode,
} from 'graphql';
import { redactCredentials } from '../auth/credential-redaction';
import type { BackendPrincipal } from '../auth/token-verifier';
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
  /** The verified principal, when the request presented one. */
  principal?: BackendPrincipal | null;
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
 * @param responseKey - The audited field's response key (its alias, else its
 *   name). An operation with several mutation fields returns one result per
 *   key; without a key the first result is read.
 * @returns The record ID as a string, or 'unknown'
 */
function extractRecordId(
  data: Record<string, unknown> | null | undefined,
  responseKey?: string
): string {
  if (!data) return 'unknown';

  // The result is typically nested under the mutation name
  const values = Object.values(data);
  if (values.length === 0) return 'unknown';

  const result = responseKey === undefined ? values[0] : data[responseKey];
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
 * Extracts changed fields from the audited field's arguments.
 * For create operations, captures all input data.
 * For update operations, captures the data being set.
 * For delete operations, captures the where clause.
 *
 * Stored-credential values (broker keys, OAuth / session / invite tokens) are
 * replaced with a placeholder: an audit row is readable far more widely than
 * the credential column, so a key copied into one is an unguarded second copy
 * of the secret. The replacement is directed by key name, so it holds only
 * because every value here sits under its schema path (see
 * {@link resolveFieldArguments}).
 *
 * @param operationType - The type of mutation operation
 * @param args - The audited field's arguments, by schema argument name
 * @returns A JSON-serializable object representing the changed fields
 */
function extractChangedFields(
  operationType: 'CREATE' | 'UPDATE' | 'DELETE',
  args: Record<string, unknown> | null | undefined
): Record<string, unknown> {
  if (!args) return {};

  const fields = ((): Record<string, unknown> => {
    switch (operationType) {
      case 'CREATE':
        return { input: args.data || args };
      case 'UPDATE':
        return {
          where: args.where || {},
          data: args.data || {},
        };
      case 'DELETE':
        return { where: args.where || {} };
      default:
        return args;
    }
  })();
  return redactCredentials(fields) as Record<string, unknown>;
}

/**
 * The operation's variable values as execution sees them: the request's
 * values, plus the operation's declared default for each variable the request
 * omitted. Held in a prototype-free map so a variable reference can only ever
 * read a value the request or the operation supplied.
 *
 * @param operation - The executed operation
 * @param variables - The request's variable values
 * @returns The effective variable values
 */
function operationVariables(
  operation: OperationDefinitionNode,
  variables: Record<string, unknown> | null | undefined
): Record<string, unknown> {
  const values: Record<string, unknown> = Object.assign(
    Object.create(null) as Record<string, unknown>,
    variables ?? {}
  );
  for (const definition of operation.variableDefinitions ?? []) {
    const name = definition.variable.name.value;
    if (definition.defaultValue && !(name in values)) {
      values[name] = valueFromASTUntyped(definition.defaultValue);
    }
  }
  return values;
}

/**
 * The value of each argument the field passes, under the argument's schema
 * name, with every variable reference replaced by its value.
 *
 * This is what the audit row records, rather than the request's variables
 * map: a variable is named by the calling operation, not by the schema, so a
 * credential passed as `$key` into `data: { apiKey: $key }` would be stored
 * under `key`, where no key-directed redaction can recognise it. Resolved
 * against the field, the same value sits at `data.apiKey`, the column's own
 * name, whatever the operation called its variables. It also records
 * arguments written inline, which a variables map does not carry at all.
 *
 * @param field - The audited root field
 * @param variables - The effective variable values ({@link operationVariables})
 * @returns The field's arguments, by schema argument name
 */
function resolveFieldArguments(
  field: FieldNode,
  variables: Record<string, unknown>
): Record<string, unknown> {
  const args: Record<string, unknown> = {};
  for (const argument of field.arguments ?? []) {
    args[argument.name.value] = valueFromASTUntyped(argument.value, variables);
  }
  return args;
}

/** Whether `@skip` / `@include` leave a selection in the executed operation. */
function isIncluded(
  directives: readonly DirectiveNode[] | undefined,
  variables: Record<string, unknown>
): boolean {
  for (const directive of directives ?? []) {
    const name = directive.name.value;
    if (name !== 'skip' && name !== 'include') continue;
    const condition = directive.arguments?.find((argument) => argument.name.value === 'if');
    const value = condition ? valueFromASTUntyped(condition.value, variables) : undefined;
    if (name === 'skip' && value === true) return false;
    if (name === 'include' && value === false) return false;
  }
  return true;
}

/**
 * The root fields an operation executes, by response key (alias, else name),
 * in execution order, following the rules graphql-js applies when it collects
 * them: inline fragments and fragment spreads are entered, `@skip` /
 * `@include` are honoured, each fragment is entered once, and a response key
 * keeps its first field node, which is the one graphql-js reads arguments
 * from. Fragment type conditions are not checked: at the root of a validated
 * operation every fragment is on the root type.
 *
 * @param selectionSet - The operation's (or a root fragment's) selection set
 * @param fragments - The document's fragment definitions, by name
 * @param variables - The effective variable values
 * @param fields - Accumulator for the recursion
 * @param visitedFragments - Fragments already entered
 * @returns Each executed root field node, by response key
 */
function collectRootFields(
  selectionSet: SelectionSetNode,
  fragments: ReadonlyMap<string, FragmentDefinitionNode>,
  variables: Record<string, unknown>,
  fields: Map<string, FieldNode> = new Map(),
  visitedFragments: Set<string> = new Set()
): Map<string, FieldNode> {
  for (const selection of selectionSet.selections) {
    if (!isIncluded(selection.directives, variables)) continue;
    if (selection.kind === 'Field') {
      const responseKey = selection.alias?.value ?? selection.name.value;
      if (!fields.has(responseKey)) fields.set(responseKey, selection);
    } else if (selection.kind === 'InlineFragment') {
      collectRootFields(selection.selectionSet, fragments, variables, fields, visitedFragments);
    } else {
      const fragmentName = selection.name.value;
      const fragment = fragments.get(fragmentName);
      if (fragment && !visitedFragments.has(fragmentName)) {
        visitedFragments.add(fragmentName);
        collectRootFields(fragment.selectionSet, fragments, variables, fields, visitedFragments);
      }
    }
  }
  return fields;
}

/** The document's fragment definitions, by name. */
function fragmentsOf(document: DocumentNode): Map<string, FragmentDefinitionNode> {
  const fragments = new Map<string, FragmentDefinitionNode>();
  for (const definition of document.definitions) {
    if (definition.kind === 'FragmentDefinition') {
      fragments.set(definition.name.value, definition);
    }
  }
  return fragments;
}

/**
 * The acting principal as recorded on an audit row. `userId` holds only a
 * UUID subject, so a service or anonymous write needs its identity here or
 * the row cannot say who made it.
 */
function principalMetadata(
  principal: BackendPrincipal | null | undefined
): { principalKind: string; principalSub: string | null } {
  if (!principal) return { principalKind: 'none', principalSub: null };
  if (principal.kind === 'server') {
    return { principalKind: 'server', principalSub: principal.sub ?? null };
  }
  return { principalKind: principal.kind, principalSub: principal.sub };
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
          const { contextValue, response, request, document, operation } =
            requestContext;

          // Only audit mutations, and only the operation that executed: a
          // document can define several, and `operationName` picks one.
          if (!document || !operation || operation.operation !== 'mutation') {
            return;
          }

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

          const variables = operationVariables(
            operation,
            request.variables as Record<string, unknown> | null | undefined
          );
          const rootFields = collectRootFields(
            operation.selectionSet,
            fragmentsOf(document),
            variables
          );

          for (const [responseKey, field] of rootFields) {
            const fieldName = field.name.value;
            const auditData = parseMutationOperation(fieldName);

            if (!auditData) continue;
            if (EXCLUDED_MODELS.has(auditData.modelName)) continue;

            const userId = extractUserId(contextValue.user);
            const changedFields = extractChangedFields(
              auditData.operationType,
              resolveFieldArguments(field, variables)
            );

            // Extract record ID from response data
            let recordId = 'unknown';
            if (
              response.body.kind === 'single' &&
              response.body.singleResult.data
            ) {
              recordId = extractRecordId(
                response.body.singleResult.data as Record<string, unknown>,
                responseKey
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
                      ...principalMetadata(contextValue.principal),
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
  operationVariables,
  resolveFieldArguments,
  collectRootFields,
  principalMetadata,
};

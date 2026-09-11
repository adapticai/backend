
  
import { AccountDecisionRecord as AccountDecisionRecordType } from './generated/typegraphql-prisma/models/AccountDecisionRecord';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the AccountDecisionRecord model.
   */

  const selectionSet = `
    
  id
  alpacaAccountId
  correlationId
  opportunityId
  symbol
  assetClass
  signalAction
  signalConfidence
  decision
  decisionRationale
  decisionConfidence
  actionIntents
  validationResults
  executionResults
  effectivePolicySnapshot
  positionsSnapshot
  openOrdersSnapshot
  exposureSnapshot
  overlaysSnapshot
  modelProvider
  modelId
  modelTier
  routingReason
  tokenUsage
  sessionDurationMs
  gatingDurationMs
  validationDurationMs
  executionDurationMs
  status
  createdAt
  updatedAt

  `;

  export const AccountDecisionRecord = {

    /**
     * Create a new AccountDecisionRecord record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created AccountDecisionRecord or null.
     */

    /**
     * Create a new AccountDecisionRecord record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created AccountDecisionRecord or null.
     */
    async create(props: AccountDecisionRecordType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<AccountDecisionRecordType> {
      // Maximum number of retries for database connection issues
      const MAX_RETRIES = 3;
      let retryCount = 0;
      let lastError: unknown = null;

      // Retry loop to handle potential database connection issues
      while (retryCount < MAX_RETRIES) {
        try {
          const [modules, client] = await Promise.all([
            getApolloModules(),
            globalClient
              ? Promise.resolve(globalClient)
              : getApolloClient()
          ]);

          const { gql, ApolloError } = modules;

          const CREATE_ONE_ACCOUNTDECISIONRECORD = gql`
              mutation createOneAccountDecisionRecord($data: AccountDecisionRecordCreateInput!) {
                createOneAccountDecisionRecord(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                alpacaAccountId: props.alpacaAccountId !== undefined ? props.alpacaAccountId : undefined,
  correlationId: props.correlationId !== undefined ? props.correlationId : undefined,
  opportunityId: props.opportunityId !== undefined ? props.opportunityId : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  assetClass: props.assetClass !== undefined ? props.assetClass : undefined,
  signalAction: props.signalAction !== undefined ? props.signalAction : undefined,
  signalConfidence: props.signalConfidence !== undefined ? props.signalConfidence : undefined,
  decision: props.decision !== undefined ? props.decision : undefined,
  decisionRationale: props.decisionRationale !== undefined ? props.decisionRationale : undefined,
  decisionConfidence: props.decisionConfidence !== undefined ? props.decisionConfidence : undefined,
  actionIntents: props.actionIntents !== undefined ? props.actionIntents : undefined,
  validationResults: props.validationResults !== undefined ? props.validationResults : undefined,
  executionResults: props.executionResults !== undefined ? props.executionResults : undefined,
  effectivePolicySnapshot: props.effectivePolicySnapshot !== undefined ? props.effectivePolicySnapshot : undefined,
  positionsSnapshot: props.positionsSnapshot !== undefined ? props.positionsSnapshot : undefined,
  openOrdersSnapshot: props.openOrdersSnapshot !== undefined ? props.openOrdersSnapshot : undefined,
  exposureSnapshot: props.exposureSnapshot !== undefined ? props.exposureSnapshot : undefined,
  overlaysSnapshot: props.overlaysSnapshot !== undefined ? props.overlaysSnapshot : undefined,
  modelProvider: props.modelProvider !== undefined ? props.modelProvider : undefined,
  modelId: props.modelId !== undefined ? props.modelId : undefined,
  modelTier: props.modelTier !== undefined ? props.modelTier : undefined,
  routingReason: props.routingReason !== undefined ? props.routingReason : undefined,
  tokenUsage: props.tokenUsage !== undefined ? props.tokenUsage : undefined,
  sessionDurationMs: props.sessionDurationMs !== undefined ? props.sessionDurationMs : undefined,
  gatingDurationMs: props.gatingDurationMs !== undefined ? props.gatingDurationMs : undefined,
  validationDurationMs: props.validationDurationMs !== undefined ? props.validationDurationMs : undefined,
  executionDurationMs: props.executionDurationMs !== undefined ? props.executionDurationMs : undefined,
  status: props.status !== undefined ? props.status : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_ACCOUNTDECISIONRECORD,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneAccountDecisionRecord) {
            return response.data.createOneAccountDecisionRecord;
          } else {
            return null as unknown as AccountDecisionRecordType;
          }
        } catch (caughtError: unknown) {
          const error = caughtError as Error & { networkError?: { message?: string } };
          lastError = error;

          // Check for constraint violations FIRST - these are NEVER retryable
          const isConstraintViolation =
            error.message?.includes('violates check constraint') ||
            error.message?.includes('violates unique constraint') ||
            error.message?.includes('violates foreign key constraint') ||
            error.message?.includes('unique constraint') ||
            error.message?.includes('23514') ||
            error.message?.includes('23505') ||
            error.message?.includes('P2002') ||
            error.message?.includes('P2003');

          if (isConstraintViolation) {
            const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
            logger.error("Non-retryable constraint violation in createOneAccountDecisionRecord", {
              operation: 'createOneAccountDecisionRecord',
              model: 'AccountDecisionRecord',
              error: String(error),
              constraintName: constraintMatch ? constraintMatch[1] : undefined,
              errorCategory: 'CONSTRAINT_VIOLATION',
              isRetryable: false,
            });
            throw error;
          }

          // Check if this is a database connection error that we should retry.
          // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
          // pool exhaustion, and transient gateway statuses. Must stay consistent
          // with the transient classifier in client.ts (onError link + enqueueOperation).
          const isConnectionError =
            error.message?.includes('Server has closed the connection') ||
            error.message?.includes('Cannot reach database server') ||
            error.message?.includes('Connection timed out') ||
            error.message?.includes('aborted due to timeout') ||
            error.message?.includes('TimeoutError') ||
            error.message?.includes('fetch failed') ||
            error.message?.includes('socket hang up') ||
            error.message?.includes('ECONNRESET') ||
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ETIMEDOUT') ||
            error.message?.includes('Connection pool timeout') ||
            error.message?.includes('P2024') ||
            error.message?.includes('status code 408') ||
            error.message?.includes('status code 502') ||
            error.message?.includes('status code 503') ||
            error.message?.includes('status code 504') ||
            error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
            (error.networkError && (
              error.networkError.message?.includes('Failed to fetch') ||
              error.networkError.message?.includes('fetch failed') ||
              error.networkError.message?.includes('aborted due to timeout') ||
              error.networkError.message?.includes('TimeoutError')
            ));

          if (isConnectionError && retryCount < MAX_RETRIES - 1) {
            retryCount++;
            const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
            logger.warn("Database connection error in createOneAccountDecisionRecord, retrying...", {
              operation: 'createOneAccountDecisionRecord',
              model: 'AccountDecisionRecord',
              attempt: retryCount,
              maxRetries: MAX_RETRIES,
            });
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          // Log structured error details and rethrow.
          // Demote transient failures to WARN with explicit transient+recoveryHint
          // metadata so log analytics can distinguish recoverable upstream retries
          // from true defects.
          if (isConnectionError) {
            logger.warn("Database create operation failed (transient after retries)", {
              operation: 'createOneAccountDecisionRecord',
              model: 'AccountDecisionRecord',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneAccountDecisionRecord',
              model: 'AccountDecisionRecord',
              error: String(error),
              isRetryable: false,
            });
          }
          throw error;
        }
      }

      // If we exhausted retries, throw the last error
      throw lastError;
    },

  /**
   * Create multiple AccountDecisionRecord records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of AccountDecisionRecord objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: AccountDecisionRecordType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const CREATE_MANY_ACCOUNTDECISIONRECORD = gql`
          mutation createManyAccountDecisionRecord($data: [AccountDecisionRecordCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyAccountDecisionRecord(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      alpacaAccountId: prop.alpacaAccountId !== undefined ? prop.alpacaAccountId : undefined,
  correlationId: prop.correlationId !== undefined ? prop.correlationId : undefined,
  opportunityId: prop.opportunityId !== undefined ? prop.opportunityId : undefined,
  symbol: prop.symbol !== undefined ? prop.symbol : undefined,
  assetClass: prop.assetClass !== undefined ? prop.assetClass : undefined,
  signalAction: prop.signalAction !== undefined ? prop.signalAction : undefined,
  signalConfidence: prop.signalConfidence !== undefined ? prop.signalConfidence : undefined,
  decision: prop.decision !== undefined ? prop.decision : undefined,
  decisionRationale: prop.decisionRationale !== undefined ? prop.decisionRationale : undefined,
  decisionConfidence: prop.decisionConfidence !== undefined ? prop.decisionConfidence : undefined,
  actionIntents: prop.actionIntents !== undefined ? prop.actionIntents : undefined,
  validationResults: prop.validationResults !== undefined ? prop.validationResults : undefined,
  executionResults: prop.executionResults !== undefined ? prop.executionResults : undefined,
  effectivePolicySnapshot: prop.effectivePolicySnapshot !== undefined ? prop.effectivePolicySnapshot : undefined,
  positionsSnapshot: prop.positionsSnapshot !== undefined ? prop.positionsSnapshot : undefined,
  openOrdersSnapshot: prop.openOrdersSnapshot !== undefined ? prop.openOrdersSnapshot : undefined,
  exposureSnapshot: prop.exposureSnapshot !== undefined ? prop.exposureSnapshot : undefined,
  overlaysSnapshot: prop.overlaysSnapshot !== undefined ? prop.overlaysSnapshot : undefined,
  modelProvider: prop.modelProvider !== undefined ? prop.modelProvider : undefined,
  modelId: prop.modelId !== undefined ? prop.modelId : undefined,
  modelTier: prop.modelTier !== undefined ? prop.modelTier : undefined,
  routingReason: prop.routingReason !== undefined ? prop.routingReason : undefined,
  tokenUsage: prop.tokenUsage !== undefined ? prop.tokenUsage : undefined,
  sessionDurationMs: prop.sessionDurationMs !== undefined ? prop.sessionDurationMs : undefined,
  gatingDurationMs: prop.gatingDurationMs !== undefined ? prop.gatingDurationMs : undefined,
  validationDurationMs: prop.validationDurationMs !== undefined ? prop.validationDurationMs : undefined,
  executionDurationMs: prop.executionDurationMs !== undefined ? prop.executionDurationMs : undefined,
  status: prop.status !== undefined ? prop.status : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_ACCOUNTDECISIONRECORD,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyAccountDecisionRecord) {
          return response.data.createManyAccountDecisionRecord;
        } else {
          return null;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
          logger.warn("Duplicate key in createManyAccountDecisionRecord (expected during overlapping fetches)", {
            operation: 'createManyAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in createManyAccountDecisionRecord, retrying...", {
            operation: 'createManyAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Update a single AccountDecisionRecord record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated AccountDecisionRecord or null.
   */
  async update(props: AccountDecisionRecordType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<AccountDecisionRecordType> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const UPDATE_ONE_ACCOUNTDECISIONRECORD = gql`
          mutation updateOneAccountDecisionRecord($data: AccountDecisionRecordUpdateInput!, $where: AccountDecisionRecordWhereUniqueInput!) {
            updateOneAccountDecisionRecord(data: $data, where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
      },
          data: {
      id: props.id !== undefined ? {
            set: props.id 
           } : undefined,
  alpacaAccountId: props.alpacaAccountId !== undefined ? {
            set: props.alpacaAccountId 
           } : undefined,
  correlationId: props.correlationId !== undefined ? {
            set: props.correlationId 
           } : undefined,
  opportunityId: props.opportunityId !== undefined ? {
            set: props.opportunityId 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  assetClass: props.assetClass !== undefined ? {
            set: props.assetClass 
           } : undefined,
  signalAction: props.signalAction !== undefined ? {
            set: props.signalAction 
           } : undefined,
  signalConfidence: props.signalConfidence !== undefined ? {
            set: props.signalConfidence 
           } : undefined,
  decision: props.decision !== undefined ? {
            set: props.decision 
           } : undefined,
  decisionRationale: props.decisionRationale !== undefined ? {
            set: props.decisionRationale 
           } : undefined,
  decisionConfidence: props.decisionConfidence !== undefined ? {
            set: props.decisionConfidence 
           } : undefined,
  actionIntents: props.actionIntents !== undefined ? props.actionIntents : undefined,
  validationResults: props.validationResults !== undefined ? props.validationResults : undefined,
  executionResults: props.executionResults !== undefined ? props.executionResults : undefined,
  effectivePolicySnapshot: props.effectivePolicySnapshot !== undefined ? props.effectivePolicySnapshot : undefined,
  positionsSnapshot: props.positionsSnapshot !== undefined ? props.positionsSnapshot : undefined,
  openOrdersSnapshot: props.openOrdersSnapshot !== undefined ? props.openOrdersSnapshot : undefined,
  exposureSnapshot: props.exposureSnapshot !== undefined ? props.exposureSnapshot : undefined,
  overlaysSnapshot: props.overlaysSnapshot !== undefined ? props.overlaysSnapshot : undefined,
  modelProvider: props.modelProvider !== undefined ? {
            set: props.modelProvider 
           } : undefined,
  modelId: props.modelId !== undefined ? {
            set: props.modelId 
           } : undefined,
  modelTier: props.modelTier !== undefined ? {
            set: props.modelTier 
           } : undefined,
  routingReason: props.routingReason !== undefined ? {
            set: props.routingReason 
           } : undefined,
  tokenUsage: props.tokenUsage !== undefined ? props.tokenUsage : undefined,
  sessionDurationMs: props.sessionDurationMs !== undefined ? {
            set: props.sessionDurationMs 
           } : undefined,
  gatingDurationMs: props.gatingDurationMs !== undefined ? {
            set: props.gatingDurationMs 
           } : undefined,
  validationDurationMs: props.validationDurationMs !== undefined ? {
            set: props.validationDurationMs 
           } : undefined,
  executionDurationMs: props.executionDurationMs !== undefined ? {
            set: props.executionDurationMs 
           } : undefined,
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_ACCOUNTDECISIONRECORD,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneAccountDecisionRecord) {
          return response.data.updateOneAccountDecisionRecord;
        } else {
          return null as unknown as AccountDecisionRecordType;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in updateOneAccountDecisionRecord", {
            operation: 'updateOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            recordId: props.id,
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in updateOneAccountDecisionRecord, retrying...", {
            operation: 'updateOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
            recordId: props.id,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database update operation failed (transient after retries)", {
            operation: 'updateOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            recordId: props.id,
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Upsert a single AccountDecisionRecord record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated AccountDecisionRecord or null.
   */
  async upsert(props: AccountDecisionRecordType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<AccountDecisionRecordType> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const UPSERT_ONE_ACCOUNTDECISIONRECORD = gql`
          mutation upsertOneAccountDecisionRecord($where: AccountDecisionRecordWhereUniqueInput!, $create: AccountDecisionRecordCreateInput!, $update: AccountDecisionRecordUpdateInput!) {
            upsertOneAccountDecisionRecord(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  correlationId: props.correlationId !== undefined ? props.correlationId : undefined,
  alpacaAccountId: props.alpacaAccountId !== undefined ? {
    equals: props.alpacaAccountId 
  } : undefined,
  opportunityId: props.opportunityId !== undefined ? {
    equals: props.opportunityId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
  modelId: props.modelId !== undefined ? {
    equals: props.modelId 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
      },
          create: {
        alpacaAccountId: props.alpacaAccountId !== undefined ? props.alpacaAccountId : undefined,
  correlationId: props.correlationId !== undefined ? props.correlationId : undefined,
  opportunityId: props.opportunityId !== undefined ? props.opportunityId : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  assetClass: props.assetClass !== undefined ? props.assetClass : undefined,
  signalAction: props.signalAction !== undefined ? props.signalAction : undefined,
  signalConfidence: props.signalConfidence !== undefined ? props.signalConfidence : undefined,
  decision: props.decision !== undefined ? props.decision : undefined,
  decisionRationale: props.decisionRationale !== undefined ? props.decisionRationale : undefined,
  decisionConfidence: props.decisionConfidence !== undefined ? props.decisionConfidence : undefined,
  actionIntents: props.actionIntents !== undefined ? props.actionIntents : undefined,
  validationResults: props.validationResults !== undefined ? props.validationResults : undefined,
  executionResults: props.executionResults !== undefined ? props.executionResults : undefined,
  effectivePolicySnapshot: props.effectivePolicySnapshot !== undefined ? props.effectivePolicySnapshot : undefined,
  positionsSnapshot: props.positionsSnapshot !== undefined ? props.positionsSnapshot : undefined,
  openOrdersSnapshot: props.openOrdersSnapshot !== undefined ? props.openOrdersSnapshot : undefined,
  exposureSnapshot: props.exposureSnapshot !== undefined ? props.exposureSnapshot : undefined,
  overlaysSnapshot: props.overlaysSnapshot !== undefined ? props.overlaysSnapshot : undefined,
  modelProvider: props.modelProvider !== undefined ? props.modelProvider : undefined,
  modelId: props.modelId !== undefined ? props.modelId : undefined,
  modelTier: props.modelTier !== undefined ? props.modelTier : undefined,
  routingReason: props.routingReason !== undefined ? props.routingReason : undefined,
  tokenUsage: props.tokenUsage !== undefined ? props.tokenUsage : undefined,
  sessionDurationMs: props.sessionDurationMs !== undefined ? props.sessionDurationMs : undefined,
  gatingDurationMs: props.gatingDurationMs !== undefined ? props.gatingDurationMs : undefined,
  validationDurationMs: props.validationDurationMs !== undefined ? props.validationDurationMs : undefined,
  executionDurationMs: props.executionDurationMs !== undefined ? props.executionDurationMs : undefined,
  status: props.status !== undefined ? props.status : undefined,
      },
          update: {
      alpacaAccountId: props.alpacaAccountId !== undefined ? {
            set: props.alpacaAccountId 
           } : undefined,
  correlationId: props.correlationId !== undefined ? {
            set: props.correlationId 
           } : undefined,
  opportunityId: props.opportunityId !== undefined ? {
            set: props.opportunityId 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  assetClass: props.assetClass !== undefined ? {
            set: props.assetClass 
           } : undefined,
  signalAction: props.signalAction !== undefined ? {
            set: props.signalAction 
           } : undefined,
  signalConfidence: props.signalConfidence !== undefined ? {
            set: props.signalConfidence 
           } : undefined,
  decision: props.decision !== undefined ? {
            set: props.decision 
           } : undefined,
  decisionRationale: props.decisionRationale !== undefined ? {
            set: props.decisionRationale 
           } : undefined,
  decisionConfidence: props.decisionConfidence !== undefined ? {
            set: props.decisionConfidence 
           } : undefined,
  actionIntents: props.actionIntents !== undefined ? props.actionIntents : undefined,
  validationResults: props.validationResults !== undefined ? props.validationResults : undefined,
  executionResults: props.executionResults !== undefined ? props.executionResults : undefined,
  effectivePolicySnapshot: props.effectivePolicySnapshot !== undefined ? props.effectivePolicySnapshot : undefined,
  positionsSnapshot: props.positionsSnapshot !== undefined ? props.positionsSnapshot : undefined,
  openOrdersSnapshot: props.openOrdersSnapshot !== undefined ? props.openOrdersSnapshot : undefined,
  exposureSnapshot: props.exposureSnapshot !== undefined ? props.exposureSnapshot : undefined,
  overlaysSnapshot: props.overlaysSnapshot !== undefined ? props.overlaysSnapshot : undefined,
  modelProvider: props.modelProvider !== undefined ? {
            set: props.modelProvider 
           } : undefined,
  modelId: props.modelId !== undefined ? {
            set: props.modelId 
           } : undefined,
  modelTier: props.modelTier !== undefined ? {
            set: props.modelTier 
           } : undefined,
  routingReason: props.routingReason !== undefined ? {
            set: props.routingReason 
           } : undefined,
  tokenUsage: props.tokenUsage !== undefined ? props.tokenUsage : undefined,
  sessionDurationMs: props.sessionDurationMs !== undefined ? {
            set: props.sessionDurationMs 
           } : undefined,
  gatingDurationMs: props.gatingDurationMs !== undefined ? {
            set: props.gatingDurationMs 
           } : undefined,
  validationDurationMs: props.validationDurationMs !== undefined ? {
            set: props.validationDurationMs 
           } : undefined,
  executionDurationMs: props.executionDurationMs !== undefined ? {
            set: props.executionDurationMs 
           } : undefined,
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_ACCOUNTDECISIONRECORD,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneAccountDecisionRecord) {
          return response.data.upsertOneAccountDecisionRecord;
        } else {
          return null as unknown as AccountDecisionRecordType;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in upsertOneAccountDecisionRecord", {
            operation: 'upsertOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            recordId: props.id,
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in upsertOneAccountDecisionRecord, retrying...", {
            operation: 'upsertOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
            recordId: props.id,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database upsert operation failed (transient after retries)", {
            operation: 'upsertOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            recordId: props.id,
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Update multiple AccountDecisionRecord records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of AccountDecisionRecord objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: AccountDecisionRecordType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const UPDATE_MANY_ACCOUNTDECISIONRECORD = gql`
          mutation updateManyAccountDecisionRecord($data: [AccountDecisionRecordCreateManyInput!]!) {
            updateManyAccountDecisionRecord(data: $data) {
              count
            }
          }`;

        const variables = props.map(prop => ({
          where: {
              id: prop.id !== undefined ? prop.id : undefined,

          },
          data: {
              id: prop.id !== undefined ? {
            set: prop.id 
           } : undefined,
  alpacaAccountId: prop.alpacaAccountId !== undefined ? {
            set: prop.alpacaAccountId 
           } : undefined,
  correlationId: prop.correlationId !== undefined ? {
            set: prop.correlationId 
           } : undefined,
  opportunityId: prop.opportunityId !== undefined ? {
            set: prop.opportunityId 
           } : undefined,
  symbol: prop.symbol !== undefined ? {
            set: prop.symbol 
           } : undefined,
  assetClass: prop.assetClass !== undefined ? {
            set: prop.assetClass 
           } : undefined,
  signalAction: prop.signalAction !== undefined ? {
            set: prop.signalAction 
           } : undefined,
  signalConfidence: prop.signalConfidence !== undefined ? {
            set: prop.signalConfidence 
           } : undefined,
  decision: prop.decision !== undefined ? {
            set: prop.decision 
           } : undefined,
  decisionRationale: prop.decisionRationale !== undefined ? {
            set: prop.decisionRationale 
           } : undefined,
  decisionConfidence: prop.decisionConfidence !== undefined ? {
            set: prop.decisionConfidence 
           } : undefined,
  actionIntents: prop.actionIntents !== undefined ? prop.actionIntents : undefined,
  validationResults: prop.validationResults !== undefined ? prop.validationResults : undefined,
  executionResults: prop.executionResults !== undefined ? prop.executionResults : undefined,
  effectivePolicySnapshot: prop.effectivePolicySnapshot !== undefined ? prop.effectivePolicySnapshot : undefined,
  positionsSnapshot: prop.positionsSnapshot !== undefined ? prop.positionsSnapshot : undefined,
  openOrdersSnapshot: prop.openOrdersSnapshot !== undefined ? prop.openOrdersSnapshot : undefined,
  exposureSnapshot: prop.exposureSnapshot !== undefined ? prop.exposureSnapshot : undefined,
  overlaysSnapshot: prop.overlaysSnapshot !== undefined ? prop.overlaysSnapshot : undefined,
  modelProvider: prop.modelProvider !== undefined ? {
            set: prop.modelProvider 
           } : undefined,
  modelId: prop.modelId !== undefined ? {
            set: prop.modelId 
           } : undefined,
  modelTier: prop.modelTier !== undefined ? {
            set: prop.modelTier 
           } : undefined,
  routingReason: prop.routingReason !== undefined ? {
            set: prop.routingReason 
           } : undefined,
  tokenUsage: prop.tokenUsage !== undefined ? prop.tokenUsage : undefined,
  sessionDurationMs: prop.sessionDurationMs !== undefined ? {
            set: prop.sessionDurationMs 
           } : undefined,
  gatingDurationMs: prop.gatingDurationMs !== undefined ? {
            set: prop.gatingDurationMs 
           } : undefined,
  validationDurationMs: prop.validationDurationMs !== undefined ? {
            set: prop.validationDurationMs 
           } : undefined,
  executionDurationMs: prop.executionDurationMs !== undefined ? {
            set: prop.executionDurationMs 
           } : undefined,
  status: prop.status !== undefined ? {
            set: prop.status 
           } : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,

          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_ACCOUNTDECISIONRECORD,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyAccountDecisionRecord) {
          return response.data.updateManyAccountDecisionRecord;
        } else {
          return null;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in updateManyAccountDecisionRecord", {
            operation: 'updateManyAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in updateManyAccountDecisionRecord, retrying...", {
            operation: 'updateManyAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Delete a single AccountDecisionRecord record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted AccountDecisionRecord or null.
   */
  async delete(props: AccountDecisionRecordType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<AccountDecisionRecordType> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const DELETE_ONE_ACCOUNTDECISIONRECORD = gql`
          mutation deleteOneAccountDecisionRecord($where: AccountDecisionRecordWhereUniqueInput!) {
            deleteOneAccountDecisionRecord(where: $where) {
              id
            }
          }`;

        const variables = {
          where: {
            id: props.id ? props.id : undefined,
          }
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: DELETE_ONE_ACCOUNTDECISIONRECORD,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneAccountDecisionRecord) {
          return response.data.deleteOneAccountDecisionRecord;
        } else {
          return null as unknown as AccountDecisionRecordType;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        // (e.g., foreign key constraints preventing deletion)
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('23503') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003') ||
          error.message?.includes('P2014');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in deleteOneAccountDecisionRecord", {
            operation: 'deleteOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            recordId: props.id,
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in deleteOneAccountDecisionRecord, retrying...", {
            operation: 'deleteOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
            recordId: props.id,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database delete operation failed (transient after retries)", {
            operation: 'deleteOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            recordId: props.id,
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Retrieve a single AccountDecisionRecord record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved AccountDecisionRecord or null.
   */
  async get(props: AccountDecisionRecordType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<AccountDecisionRecordType | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const GET_ACCOUNTDECISIONRECORD = gql`
          query getAccountDecisionRecord($where: AccountDecisionRecordWhereUniqueInput!) {
            getAccountDecisionRecord(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  correlationId: props.correlationId !== undefined ? props.correlationId : undefined,
  alpacaAccountId: props.alpacaAccountId !== undefined ? {
    equals: props.alpacaAccountId 
  } : undefined,
  opportunityId: props.opportunityId !== undefined ? {
    equals: props.opportunityId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
  modelId: props.modelId !== undefined ? {
    equals: props.modelId 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_ACCOUNTDECISIONRECORD,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getAccountDecisionRecord ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No AccountDecisionRecord found') {
          return null;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in getAccountDecisionRecord, retrying...", {
            operation: 'getAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Retrieve all AccountDecisionRecords records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of AccountDecisionRecord records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<AccountDecisionRecordType[] | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const GET_ALL_ACCOUNTDECISIONRECORD = gql`
          query getAllAccountDecisionRecord {
            accountDecisionRecords {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_ACCOUNTDECISIONRECORD,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.accountDecisionRecords ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No AccountDecisionRecord found') {
          return null;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in getAllAccountDecisionRecord, retrying...", {
            operation: 'getAllAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Find multiple AccountDecisionRecord records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found AccountDecisionRecord records or null.
   */
  async findMany(props: AccountDecisionRecordType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<AccountDecisionRecordType[] | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const FIND_MANY_ACCOUNTDECISIONRECORD = gql`
          query findManyAccountDecisionRecord($where: AccountDecisionRecordWhereInput!) {
            accountDecisionRecords(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
  alpacaAccountId: props.alpacaAccountId !== undefined ? {
    equals: props.alpacaAccountId 
  } : undefined,
  correlationId: props.correlationId !== undefined ? {
    equals: props.correlationId 
  } : undefined,
  opportunityId: props.opportunityId !== undefined ? {
    equals: props.opportunityId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
  modelId: props.modelId !== undefined ? {
    equals: props.modelId 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyAccountDecisionRecord requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_ACCOUNTDECISIONRECORD,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.accountDecisionRecords) {
          return response.data.accountDecisionRecords;
        } else {
          return [] as AccountDecisionRecordType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No AccountDecisionRecord found') {
          return null;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in findManyAccountDecisionRecord, retrying...", {
            operation: 'findManyAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyAccountDecisionRecord',
            model: 'AccountDecisionRecord',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  }
};

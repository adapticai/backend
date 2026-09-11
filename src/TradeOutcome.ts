
  
import { TradeOutcome as TradeOutcomeType } from './generated/typegraphql-prisma/models/TradeOutcome';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the TradeOutcome model.
   */

  const selectionSet = `
    
  id
  tradeId
  symbol
  side
  assetClass
  accountId
  entryPrice
  exitPrice
  entryTimestamp
  exitTimestamp
  holdDurationMinutes
  exitReason
  grossReturnPct
  netReturnPct
  maxAdverseExcursionPct
  maxFavorableExcursionPct
  signalSource
  signalSourceType
  transformerConfidence
  llmConfidence
  ensembleConfidence
  ensembleWeight
  regimeAtEntry
  featureSnapshot
  createdAt
  updatedAt

  `;

  export const TradeOutcome = {

    /**
     * Create a new TradeOutcome record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created TradeOutcome or null.
     */

    /**
     * Create a new TradeOutcome record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created TradeOutcome or null.
     */
    async create(props: TradeOutcomeType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<TradeOutcomeType> {
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

          const CREATE_ONE_TRADEOUTCOME = gql`
              mutation createOneTradeOutcome($data: TradeOutcomeCreateInput!) {
                createOneTradeOutcome(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                tradeId: props.tradeId !== undefined ? props.tradeId : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  side: props.side !== undefined ? props.side : undefined,
  assetClass: props.assetClass !== undefined ? props.assetClass : undefined,
  accountId: props.accountId !== undefined ? props.accountId : undefined,
  entryPrice: props.entryPrice !== undefined ? props.entryPrice : undefined,
  exitPrice: props.exitPrice !== undefined ? props.exitPrice : undefined,
  entryTimestamp: props.entryTimestamp !== undefined ? props.entryTimestamp : undefined,
  exitTimestamp: props.exitTimestamp !== undefined ? props.exitTimestamp : undefined,
  holdDurationMinutes: props.holdDurationMinutes !== undefined ? props.holdDurationMinutes : undefined,
  exitReason: props.exitReason !== undefined ? props.exitReason : undefined,
  grossReturnPct: props.grossReturnPct !== undefined ? props.grossReturnPct : undefined,
  netReturnPct: props.netReturnPct !== undefined ? props.netReturnPct : undefined,
  maxAdverseExcursionPct: props.maxAdverseExcursionPct !== undefined ? props.maxAdverseExcursionPct : undefined,
  maxFavorableExcursionPct: props.maxFavorableExcursionPct !== undefined ? props.maxFavorableExcursionPct : undefined,
  signalSource: props.signalSource !== undefined ? props.signalSource : undefined,
  signalSourceType: props.signalSourceType !== undefined ? props.signalSourceType : undefined,
  transformerConfidence: props.transformerConfidence !== undefined ? props.transformerConfidence : undefined,
  llmConfidence: props.llmConfidence !== undefined ? props.llmConfidence : undefined,
  ensembleConfidence: props.ensembleConfidence !== undefined ? props.ensembleConfidence : undefined,
  ensembleWeight: props.ensembleWeight !== undefined ? props.ensembleWeight : undefined,
  regimeAtEntry: props.regimeAtEntry !== undefined ? props.regimeAtEntry : undefined,
  featureSnapshot: props.featureSnapshot !== undefined ? props.featureSnapshot : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_TRADEOUTCOME,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneTradeOutcome) {
            return response.data.createOneTradeOutcome;
          } else {
            return null as unknown as TradeOutcomeType;
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
            logger.error("Non-retryable constraint violation in createOneTradeOutcome", {
              operation: 'createOneTradeOutcome',
              model: 'TradeOutcome',
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
            logger.warn("Database connection error in createOneTradeOutcome, retrying...", {
              operation: 'createOneTradeOutcome',
              model: 'TradeOutcome',
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
              operation: 'createOneTradeOutcome',
              model: 'TradeOutcome',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneTradeOutcome',
              model: 'TradeOutcome',
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
   * Create multiple TradeOutcome records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of TradeOutcome objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: TradeOutcomeType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_TRADEOUTCOME = gql`
          mutation createManyTradeOutcome($data: [TradeOutcomeCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyTradeOutcome(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      tradeId: prop.tradeId !== undefined ? prop.tradeId : undefined,
  symbol: prop.symbol !== undefined ? prop.symbol : undefined,
  side: prop.side !== undefined ? prop.side : undefined,
  assetClass: prop.assetClass !== undefined ? prop.assetClass : undefined,
  accountId: prop.accountId !== undefined ? prop.accountId : undefined,
  entryPrice: prop.entryPrice !== undefined ? prop.entryPrice : undefined,
  exitPrice: prop.exitPrice !== undefined ? prop.exitPrice : undefined,
  entryTimestamp: prop.entryTimestamp !== undefined ? prop.entryTimestamp : undefined,
  exitTimestamp: prop.exitTimestamp !== undefined ? prop.exitTimestamp : undefined,
  holdDurationMinutes: prop.holdDurationMinutes !== undefined ? prop.holdDurationMinutes : undefined,
  exitReason: prop.exitReason !== undefined ? prop.exitReason : undefined,
  grossReturnPct: prop.grossReturnPct !== undefined ? prop.grossReturnPct : undefined,
  netReturnPct: prop.netReturnPct !== undefined ? prop.netReturnPct : undefined,
  maxAdverseExcursionPct: prop.maxAdverseExcursionPct !== undefined ? prop.maxAdverseExcursionPct : undefined,
  maxFavorableExcursionPct: prop.maxFavorableExcursionPct !== undefined ? prop.maxFavorableExcursionPct : undefined,
  signalSource: prop.signalSource !== undefined ? prop.signalSource : undefined,
  signalSourceType: prop.signalSourceType !== undefined ? prop.signalSourceType : undefined,
  transformerConfidence: prop.transformerConfidence !== undefined ? prop.transformerConfidence : undefined,
  llmConfidence: prop.llmConfidence !== undefined ? prop.llmConfidence : undefined,
  ensembleConfidence: prop.ensembleConfidence !== undefined ? prop.ensembleConfidence : undefined,
  ensembleWeight: prop.ensembleWeight !== undefined ? prop.ensembleWeight : undefined,
  regimeAtEntry: prop.regimeAtEntry !== undefined ? prop.regimeAtEntry : undefined,
  featureSnapshot: prop.featureSnapshot !== undefined ? prop.featureSnapshot : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_TRADEOUTCOME,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyTradeOutcome) {
          return response.data.createManyTradeOutcome;
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
          logger.warn("Duplicate key in createManyTradeOutcome (expected during overlapping fetches)", {
            operation: 'createManyTradeOutcome',
            model: 'TradeOutcome',
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
          logger.warn("Database connection error in createManyTradeOutcome, retrying...", {
            operation: 'createManyTradeOutcome',
            model: 'TradeOutcome',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyTradeOutcome',
            model: 'TradeOutcome',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyTradeOutcome',
            model: 'TradeOutcome',
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
   * Update a single TradeOutcome record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated TradeOutcome or null.
   */
  async update(props: TradeOutcomeType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<TradeOutcomeType> {
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

        const UPDATE_ONE_TRADEOUTCOME = gql`
          mutation updateOneTradeOutcome($data: TradeOutcomeUpdateInput!, $where: TradeOutcomeWhereUniqueInput!) {
            updateOneTradeOutcome(data: $data, where: $where) {
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
  tradeId: props.tradeId !== undefined ? {
            set: props.tradeId 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  side: props.side !== undefined ? {
            set: props.side 
           } : undefined,
  assetClass: props.assetClass !== undefined ? {
            set: props.assetClass 
           } : undefined,
  accountId: props.accountId !== undefined ? {
            set: props.accountId 
           } : undefined,
  entryPrice: props.entryPrice !== undefined ? {
            set: props.entryPrice 
           } : undefined,
  exitPrice: props.exitPrice !== undefined ? {
            set: props.exitPrice 
           } : undefined,
  entryTimestamp: props.entryTimestamp !== undefined ? {
            set: props.entryTimestamp 
           } : undefined,
  exitTimestamp: props.exitTimestamp !== undefined ? {
            set: props.exitTimestamp 
           } : undefined,
  holdDurationMinutes: props.holdDurationMinutes !== undefined ? {
            set: props.holdDurationMinutes 
           } : undefined,
  exitReason: props.exitReason !== undefined ? {
            set: props.exitReason 
           } : undefined,
  grossReturnPct: props.grossReturnPct !== undefined ? {
            set: props.grossReturnPct 
           } : undefined,
  netReturnPct: props.netReturnPct !== undefined ? {
            set: props.netReturnPct 
           } : undefined,
  maxAdverseExcursionPct: props.maxAdverseExcursionPct !== undefined ? {
            set: props.maxAdverseExcursionPct 
           } : undefined,
  maxFavorableExcursionPct: props.maxFavorableExcursionPct !== undefined ? {
            set: props.maxFavorableExcursionPct 
           } : undefined,
  signalSource: props.signalSource !== undefined ? {
            set: props.signalSource 
           } : undefined,
  signalSourceType: props.signalSourceType !== undefined ? {
            set: props.signalSourceType 
           } : undefined,
  transformerConfidence: props.transformerConfidence !== undefined ? {
            set: props.transformerConfidence 
           } : undefined,
  llmConfidence: props.llmConfidence !== undefined ? {
            set: props.llmConfidence 
           } : undefined,
  ensembleConfidence: props.ensembleConfidence !== undefined ? {
            set: props.ensembleConfidence 
           } : undefined,
  ensembleWeight: props.ensembleWeight !== undefined ? {
            set: props.ensembleWeight 
           } : undefined,
  regimeAtEntry: props.regimeAtEntry !== undefined ? {
            set: props.regimeAtEntry 
           } : undefined,
  featureSnapshot: props.featureSnapshot !== undefined ? props.featureSnapshot : undefined,
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
          mutation: UPDATE_ONE_TRADEOUTCOME,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneTradeOutcome) {
          return response.data.updateOneTradeOutcome;
        } else {
          return null as unknown as TradeOutcomeType;
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
          logger.error("Non-retryable constraint violation in updateOneTradeOutcome", {
            operation: 'updateOneTradeOutcome',
            model: 'TradeOutcome',
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
          logger.warn("Database connection error in updateOneTradeOutcome, retrying...", {
            operation: 'updateOneTradeOutcome',
            model: 'TradeOutcome',
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
            operation: 'updateOneTradeOutcome',
            model: 'TradeOutcome',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneTradeOutcome',
            model: 'TradeOutcome',
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
   * Upsert a single TradeOutcome record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated TradeOutcome or null.
   */
  async upsert(props: TradeOutcomeType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<TradeOutcomeType> {
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

        const UPSERT_ONE_TRADEOUTCOME = gql`
          mutation upsertOneTradeOutcome($where: TradeOutcomeWhereUniqueInput!, $create: TradeOutcomeCreateInput!, $update: TradeOutcomeUpdateInput!) {
            upsertOneTradeOutcome(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  tradeId: props.tradeId !== undefined ? {
    equals: props.tradeId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
  accountId: props.accountId !== undefined ? {
    equals: props.accountId 
  } : undefined,
      },
          create: {
        tradeId: props.tradeId !== undefined ? props.tradeId : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  side: props.side !== undefined ? props.side : undefined,
  assetClass: props.assetClass !== undefined ? props.assetClass : undefined,
  accountId: props.accountId !== undefined ? props.accountId : undefined,
  entryPrice: props.entryPrice !== undefined ? props.entryPrice : undefined,
  exitPrice: props.exitPrice !== undefined ? props.exitPrice : undefined,
  entryTimestamp: props.entryTimestamp !== undefined ? props.entryTimestamp : undefined,
  exitTimestamp: props.exitTimestamp !== undefined ? props.exitTimestamp : undefined,
  holdDurationMinutes: props.holdDurationMinutes !== undefined ? props.holdDurationMinutes : undefined,
  exitReason: props.exitReason !== undefined ? props.exitReason : undefined,
  grossReturnPct: props.grossReturnPct !== undefined ? props.grossReturnPct : undefined,
  netReturnPct: props.netReturnPct !== undefined ? props.netReturnPct : undefined,
  maxAdverseExcursionPct: props.maxAdverseExcursionPct !== undefined ? props.maxAdverseExcursionPct : undefined,
  maxFavorableExcursionPct: props.maxFavorableExcursionPct !== undefined ? props.maxFavorableExcursionPct : undefined,
  signalSource: props.signalSource !== undefined ? props.signalSource : undefined,
  signalSourceType: props.signalSourceType !== undefined ? props.signalSourceType : undefined,
  transformerConfidence: props.transformerConfidence !== undefined ? props.transformerConfidence : undefined,
  llmConfidence: props.llmConfidence !== undefined ? props.llmConfidence : undefined,
  ensembleConfidence: props.ensembleConfidence !== undefined ? props.ensembleConfidence : undefined,
  ensembleWeight: props.ensembleWeight !== undefined ? props.ensembleWeight : undefined,
  regimeAtEntry: props.regimeAtEntry !== undefined ? props.regimeAtEntry : undefined,
  featureSnapshot: props.featureSnapshot !== undefined ? props.featureSnapshot : undefined,
      },
          update: {
      tradeId: props.tradeId !== undefined ? {
            set: props.tradeId 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  side: props.side !== undefined ? {
            set: props.side 
           } : undefined,
  assetClass: props.assetClass !== undefined ? {
            set: props.assetClass 
           } : undefined,
  accountId: props.accountId !== undefined ? {
            set: props.accountId 
           } : undefined,
  entryPrice: props.entryPrice !== undefined ? {
            set: props.entryPrice 
           } : undefined,
  exitPrice: props.exitPrice !== undefined ? {
            set: props.exitPrice 
           } : undefined,
  entryTimestamp: props.entryTimestamp !== undefined ? {
            set: props.entryTimestamp 
           } : undefined,
  exitTimestamp: props.exitTimestamp !== undefined ? {
            set: props.exitTimestamp 
           } : undefined,
  holdDurationMinutes: props.holdDurationMinutes !== undefined ? {
            set: props.holdDurationMinutes 
           } : undefined,
  exitReason: props.exitReason !== undefined ? {
            set: props.exitReason 
           } : undefined,
  grossReturnPct: props.grossReturnPct !== undefined ? {
            set: props.grossReturnPct 
           } : undefined,
  netReturnPct: props.netReturnPct !== undefined ? {
            set: props.netReturnPct 
           } : undefined,
  maxAdverseExcursionPct: props.maxAdverseExcursionPct !== undefined ? {
            set: props.maxAdverseExcursionPct 
           } : undefined,
  maxFavorableExcursionPct: props.maxFavorableExcursionPct !== undefined ? {
            set: props.maxFavorableExcursionPct 
           } : undefined,
  signalSource: props.signalSource !== undefined ? {
            set: props.signalSource 
           } : undefined,
  signalSourceType: props.signalSourceType !== undefined ? {
            set: props.signalSourceType 
           } : undefined,
  transformerConfidence: props.transformerConfidence !== undefined ? {
            set: props.transformerConfidence 
           } : undefined,
  llmConfidence: props.llmConfidence !== undefined ? {
            set: props.llmConfidence 
           } : undefined,
  ensembleConfidence: props.ensembleConfidence !== undefined ? {
            set: props.ensembleConfidence 
           } : undefined,
  ensembleWeight: props.ensembleWeight !== undefined ? {
            set: props.ensembleWeight 
           } : undefined,
  regimeAtEntry: props.regimeAtEntry !== undefined ? {
            set: props.regimeAtEntry 
           } : undefined,
  featureSnapshot: props.featureSnapshot !== undefined ? props.featureSnapshot : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_TRADEOUTCOME,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneTradeOutcome) {
          return response.data.upsertOneTradeOutcome;
        } else {
          return null as unknown as TradeOutcomeType;
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
          logger.error("Non-retryable constraint violation in upsertOneTradeOutcome", {
            operation: 'upsertOneTradeOutcome',
            model: 'TradeOutcome',
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
          logger.warn("Database connection error in upsertOneTradeOutcome, retrying...", {
            operation: 'upsertOneTradeOutcome',
            model: 'TradeOutcome',
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
            operation: 'upsertOneTradeOutcome',
            model: 'TradeOutcome',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneTradeOutcome',
            model: 'TradeOutcome',
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
   * Update multiple TradeOutcome records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of TradeOutcome objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: TradeOutcomeType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_TRADEOUTCOME = gql`
          mutation updateManyTradeOutcome($data: [TradeOutcomeCreateManyInput!]!) {
            updateManyTradeOutcome(data: $data) {
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
  tradeId: prop.tradeId !== undefined ? {
            set: prop.tradeId 
           } : undefined,
  symbol: prop.symbol !== undefined ? {
            set: prop.symbol 
           } : undefined,
  side: prop.side !== undefined ? {
            set: prop.side 
           } : undefined,
  assetClass: prop.assetClass !== undefined ? {
            set: prop.assetClass 
           } : undefined,
  accountId: prop.accountId !== undefined ? {
            set: prop.accountId 
           } : undefined,
  entryPrice: prop.entryPrice !== undefined ? {
            set: prop.entryPrice 
           } : undefined,
  exitPrice: prop.exitPrice !== undefined ? {
            set: prop.exitPrice 
           } : undefined,
  entryTimestamp: prop.entryTimestamp !== undefined ? {
            set: prop.entryTimestamp 
           } : undefined,
  exitTimestamp: prop.exitTimestamp !== undefined ? {
            set: prop.exitTimestamp 
           } : undefined,
  holdDurationMinutes: prop.holdDurationMinutes !== undefined ? {
            set: prop.holdDurationMinutes 
           } : undefined,
  exitReason: prop.exitReason !== undefined ? {
            set: prop.exitReason 
           } : undefined,
  grossReturnPct: prop.grossReturnPct !== undefined ? {
            set: prop.grossReturnPct 
           } : undefined,
  netReturnPct: prop.netReturnPct !== undefined ? {
            set: prop.netReturnPct 
           } : undefined,
  maxAdverseExcursionPct: prop.maxAdverseExcursionPct !== undefined ? {
            set: prop.maxAdverseExcursionPct 
           } : undefined,
  maxFavorableExcursionPct: prop.maxFavorableExcursionPct !== undefined ? {
            set: prop.maxFavorableExcursionPct 
           } : undefined,
  signalSource: prop.signalSource !== undefined ? {
            set: prop.signalSource 
           } : undefined,
  signalSourceType: prop.signalSourceType !== undefined ? {
            set: prop.signalSourceType 
           } : undefined,
  transformerConfidence: prop.transformerConfidence !== undefined ? {
            set: prop.transformerConfidence 
           } : undefined,
  llmConfidence: prop.llmConfidence !== undefined ? {
            set: prop.llmConfidence 
           } : undefined,
  ensembleConfidence: prop.ensembleConfidence !== undefined ? {
            set: prop.ensembleConfidence 
           } : undefined,
  ensembleWeight: prop.ensembleWeight !== undefined ? {
            set: prop.ensembleWeight 
           } : undefined,
  regimeAtEntry: prop.regimeAtEntry !== undefined ? {
            set: prop.regimeAtEntry 
           } : undefined,
  featureSnapshot: prop.featureSnapshot !== undefined ? prop.featureSnapshot : undefined,
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
          mutation: UPDATE_MANY_TRADEOUTCOME,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyTradeOutcome) {
          return response.data.updateManyTradeOutcome;
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
          logger.error("Non-retryable constraint violation in updateManyTradeOutcome", {
            operation: 'updateManyTradeOutcome',
            model: 'TradeOutcome',
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
          logger.warn("Database connection error in updateManyTradeOutcome, retrying...", {
            operation: 'updateManyTradeOutcome',
            model: 'TradeOutcome',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyTradeOutcome',
            model: 'TradeOutcome',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyTradeOutcome',
            model: 'TradeOutcome',
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
   * Delete a single TradeOutcome record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted TradeOutcome or null.
   */
  async delete(props: TradeOutcomeType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<TradeOutcomeType> {
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

        const DELETE_ONE_TRADEOUTCOME = gql`
          mutation deleteOneTradeOutcome($where: TradeOutcomeWhereUniqueInput!) {
            deleteOneTradeOutcome(where: $where) {
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
          mutation: DELETE_ONE_TRADEOUTCOME,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneTradeOutcome) {
          return response.data.deleteOneTradeOutcome;
        } else {
          return null as unknown as TradeOutcomeType;
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
          logger.error("Non-retryable constraint violation in deleteOneTradeOutcome", {
            operation: 'deleteOneTradeOutcome',
            model: 'TradeOutcome',
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
          logger.warn("Database connection error in deleteOneTradeOutcome, retrying...", {
            operation: 'deleteOneTradeOutcome',
            model: 'TradeOutcome',
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
            operation: 'deleteOneTradeOutcome',
            model: 'TradeOutcome',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneTradeOutcome',
            model: 'TradeOutcome',
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
   * Retrieve a single TradeOutcome record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved TradeOutcome or null.
   */
  async get(props: TradeOutcomeType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<TradeOutcomeType | null> {
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

        const GET_TRADEOUTCOME = gql`
          query getTradeOutcome($where: TradeOutcomeWhereUniqueInput!) {
            getTradeOutcome(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  tradeId: props.tradeId !== undefined ? {
    equals: props.tradeId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
  accountId: props.accountId !== undefined ? {
    equals: props.accountId 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_TRADEOUTCOME,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getTradeOutcome ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No TradeOutcome found') {
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
          logger.warn("Database connection error in getTradeOutcome, retrying...", {
            operation: 'getTradeOutcome',
            model: 'TradeOutcome',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getTradeOutcome',
            model: 'TradeOutcome',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getTradeOutcome',
            model: 'TradeOutcome',
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
   * Retrieve all TradeOutcomes records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of TradeOutcome records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<TradeOutcomeType[] | null> {
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

        const GET_ALL_TRADEOUTCOME = gql`
          query getAllTradeOutcome {
            tradeOutcomes {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_TRADEOUTCOME,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.tradeOutcomes ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No TradeOutcome found') {
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
          logger.warn("Database connection error in getAllTradeOutcome, retrying...", {
            operation: 'getAllTradeOutcome',
            model: 'TradeOutcome',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllTradeOutcome',
            model: 'TradeOutcome',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllTradeOutcome',
            model: 'TradeOutcome',
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
   * Find multiple TradeOutcome records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found TradeOutcome records or null.
   */
  async findMany(props: TradeOutcomeType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<TradeOutcomeType[] | null> {
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

        const FIND_MANY_TRADEOUTCOME = gql`
          query findManyTradeOutcome($where: TradeOutcomeWhereInput!) {
            tradeOutcomes(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
  tradeId: props.tradeId !== undefined ? {
    equals: props.tradeId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
  accountId: props.accountId !== undefined ? {
    equals: props.accountId 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyTradeOutcome requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_TRADEOUTCOME,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.tradeOutcomes) {
          return response.data.tradeOutcomes;
        } else {
          return [] as TradeOutcomeType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No TradeOutcome found') {
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
          logger.warn("Database connection error in findManyTradeOutcome, retrying...", {
            operation: 'findManyTradeOutcome',
            model: 'TradeOutcome',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyTradeOutcome',
            model: 'TradeOutcome',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyTradeOutcome',
            model: 'TradeOutcome',
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

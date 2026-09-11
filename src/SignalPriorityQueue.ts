
  
import { SignalPriorityQueue as SignalPriorityQueueType } from './generated/typegraphql-prisma/models/SignalPriorityQueue';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the SignalPriorityQueue model.
   */

  const selectionSet = `
    
  id
  timestamp
  signalId
  symbol
  signalType
  generatorSource
  priorityScore
  generatorWinRate
  generatorSharpe
  priorityTier
  scoreComponents
  queuePosition
  status
  queuedAt
  processingStartedAt
  processingCompletedAt
  timeInQueueMs
  signalConfidence
  signalData
  updatedAt

  `;

  export const SignalPriorityQueue = {

    /**
     * Create a new SignalPriorityQueue record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created SignalPriorityQueue or null.
     */

    /**
     * Create a new SignalPriorityQueue record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created SignalPriorityQueue or null.
     */
    async create(props: SignalPriorityQueueType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<SignalPriorityQueueType> {
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

          const CREATE_ONE_SIGNALPRIORITYQUEUE = gql`
              mutation createOneSignalPriorityQueue($data: SignalPriorityQueueCreateInput!) {
                createOneSignalPriorityQueue(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  signalId: props.signalId !== undefined ? props.signalId : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  signalType: props.signalType !== undefined ? props.signalType : undefined,
  generatorSource: props.generatorSource !== undefined ? props.generatorSource : undefined,
  priorityScore: props.priorityScore !== undefined ? props.priorityScore : undefined,
  generatorWinRate: props.generatorWinRate !== undefined ? props.generatorWinRate : undefined,
  generatorSharpe: props.generatorSharpe !== undefined ? props.generatorSharpe : undefined,
  priorityTier: props.priorityTier !== undefined ? props.priorityTier : undefined,
  scoreComponents: props.scoreComponents !== undefined ? props.scoreComponents : undefined,
  queuePosition: props.queuePosition !== undefined ? props.queuePosition : undefined,
  status: props.status !== undefined ? props.status : undefined,
  queuedAt: props.queuedAt !== undefined ? props.queuedAt : undefined,
  processingStartedAt: props.processingStartedAt !== undefined ? props.processingStartedAt : undefined,
  processingCompletedAt: props.processingCompletedAt !== undefined ? props.processingCompletedAt : undefined,
  timeInQueueMs: props.timeInQueueMs !== undefined ? props.timeInQueueMs : undefined,
  signalConfidence: props.signalConfidence !== undefined ? props.signalConfidence : undefined,
  signalData: props.signalData !== undefined ? props.signalData : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_SIGNALPRIORITYQUEUE,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneSignalPriorityQueue) {
            return response.data.createOneSignalPriorityQueue;
          } else {
            return null as unknown as SignalPriorityQueueType;
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
            logger.error("Non-retryable constraint violation in createOneSignalPriorityQueue", {
              operation: 'createOneSignalPriorityQueue',
              model: 'SignalPriorityQueue',
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
            logger.warn("Database connection error in createOneSignalPriorityQueue, retrying...", {
              operation: 'createOneSignalPriorityQueue',
              model: 'SignalPriorityQueue',
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
              operation: 'createOneSignalPriorityQueue',
              model: 'SignalPriorityQueue',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneSignalPriorityQueue',
              model: 'SignalPriorityQueue',
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
   * Create multiple SignalPriorityQueue records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of SignalPriorityQueue objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: SignalPriorityQueueType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_SIGNALPRIORITYQUEUE = gql`
          mutation createManySignalPriorityQueue($data: [SignalPriorityQueueCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManySignalPriorityQueue(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      timestamp: prop.timestamp !== undefined ? prop.timestamp : undefined,
  signalId: prop.signalId !== undefined ? prop.signalId : undefined,
  symbol: prop.symbol !== undefined ? prop.symbol : undefined,
  signalType: prop.signalType !== undefined ? prop.signalType : undefined,
  generatorSource: prop.generatorSource !== undefined ? prop.generatorSource : undefined,
  priorityScore: prop.priorityScore !== undefined ? prop.priorityScore : undefined,
  generatorWinRate: prop.generatorWinRate !== undefined ? prop.generatorWinRate : undefined,
  generatorSharpe: prop.generatorSharpe !== undefined ? prop.generatorSharpe : undefined,
  priorityTier: prop.priorityTier !== undefined ? prop.priorityTier : undefined,
  scoreComponents: prop.scoreComponents !== undefined ? prop.scoreComponents : undefined,
  queuePosition: prop.queuePosition !== undefined ? prop.queuePosition : undefined,
  status: prop.status !== undefined ? prop.status : undefined,
  queuedAt: prop.queuedAt !== undefined ? prop.queuedAt : undefined,
  processingStartedAt: prop.processingStartedAt !== undefined ? prop.processingStartedAt : undefined,
  processingCompletedAt: prop.processingCompletedAt !== undefined ? prop.processingCompletedAt : undefined,
  timeInQueueMs: prop.timeInQueueMs !== undefined ? prop.timeInQueueMs : undefined,
  signalConfidence: prop.signalConfidence !== undefined ? prop.signalConfidence : undefined,
  signalData: prop.signalData !== undefined ? prop.signalData : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_SIGNALPRIORITYQUEUE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManySignalPriorityQueue) {
          return response.data.createManySignalPriorityQueue;
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
          logger.warn("Duplicate key in createManySignalPriorityQueue (expected during overlapping fetches)", {
            operation: 'createManySignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
          logger.warn("Database connection error in createManySignalPriorityQueue, retrying...", {
            operation: 'createManySignalPriorityQueue',
            model: 'SignalPriorityQueue',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManySignalPriorityQueue',
            model: 'SignalPriorityQueue',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManySignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
   * Update a single SignalPriorityQueue record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated SignalPriorityQueue or null.
   */
  async update(props: SignalPriorityQueueType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<SignalPriorityQueueType> {
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

        const UPDATE_ONE_SIGNALPRIORITYQUEUE = gql`
          mutation updateOneSignalPriorityQueue($data: SignalPriorityQueueUpdateInput!, $where: SignalPriorityQueueWhereUniqueInput!) {
            updateOneSignalPriorityQueue(data: $data, where: $where) {
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
  timestamp: props.timestamp !== undefined ? {
            set: props.timestamp 
           } : undefined,
  signalId: props.signalId !== undefined ? {
            set: props.signalId 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  signalType: props.signalType !== undefined ? {
            set: props.signalType 
           } : undefined,
  generatorSource: props.generatorSource !== undefined ? {
            set: props.generatorSource 
           } : undefined,
  priorityScore: props.priorityScore !== undefined ? {
            set: props.priorityScore 
           } : undefined,
  generatorWinRate: props.generatorWinRate !== undefined ? {
            set: props.generatorWinRate 
           } : undefined,
  generatorSharpe: props.generatorSharpe !== undefined ? {
            set: props.generatorSharpe 
           } : undefined,
  priorityTier: props.priorityTier !== undefined ? {
            set: props.priorityTier 
           } : undefined,
  scoreComponents: props.scoreComponents !== undefined ? props.scoreComponents : undefined,
  queuePosition: props.queuePosition !== undefined ? {
            set: props.queuePosition 
           } : undefined,
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
  queuedAt: props.queuedAt !== undefined ? {
            set: props.queuedAt 
           } : undefined,
  processingStartedAt: props.processingStartedAt !== undefined ? {
            set: props.processingStartedAt 
           } : undefined,
  processingCompletedAt: props.processingCompletedAt !== undefined ? {
            set: props.processingCompletedAt 
           } : undefined,
  timeInQueueMs: props.timeInQueueMs !== undefined ? {
            set: props.timeInQueueMs 
           } : undefined,
  signalConfidence: props.signalConfidence !== undefined ? {
            set: props.signalConfidence 
           } : undefined,
  signalData: props.signalData !== undefined ? props.signalData : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_SIGNALPRIORITYQUEUE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneSignalPriorityQueue) {
          return response.data.updateOneSignalPriorityQueue;
        } else {
          return null as unknown as SignalPriorityQueueType;
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
          logger.error("Non-retryable constraint violation in updateOneSignalPriorityQueue", {
            operation: 'updateOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
          logger.warn("Database connection error in updateOneSignalPriorityQueue, retrying...", {
            operation: 'updateOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
            operation: 'updateOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
   * Upsert a single SignalPriorityQueue record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated SignalPriorityQueue or null.
   */
  async upsert(props: SignalPriorityQueueType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<SignalPriorityQueueType> {
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

        const UPSERT_ONE_SIGNALPRIORITYQUEUE = gql`
          mutation upsertOneSignalPriorityQueue($where: SignalPriorityQueueWhereUniqueInput!, $create: SignalPriorityQueueCreateInput!, $update: SignalPriorityQueueUpdateInput!) {
            upsertOneSignalPriorityQueue(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  signalId: props.signalId !== undefined ? props.signalId : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
      },
          create: {
        timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  signalId: props.signalId !== undefined ? props.signalId : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  signalType: props.signalType !== undefined ? props.signalType : undefined,
  generatorSource: props.generatorSource !== undefined ? props.generatorSource : undefined,
  priorityScore: props.priorityScore !== undefined ? props.priorityScore : undefined,
  generatorWinRate: props.generatorWinRate !== undefined ? props.generatorWinRate : undefined,
  generatorSharpe: props.generatorSharpe !== undefined ? props.generatorSharpe : undefined,
  priorityTier: props.priorityTier !== undefined ? props.priorityTier : undefined,
  scoreComponents: props.scoreComponents !== undefined ? props.scoreComponents : undefined,
  queuePosition: props.queuePosition !== undefined ? props.queuePosition : undefined,
  status: props.status !== undefined ? props.status : undefined,
  queuedAt: props.queuedAt !== undefined ? props.queuedAt : undefined,
  processingStartedAt: props.processingStartedAt !== undefined ? props.processingStartedAt : undefined,
  processingCompletedAt: props.processingCompletedAt !== undefined ? props.processingCompletedAt : undefined,
  timeInQueueMs: props.timeInQueueMs !== undefined ? props.timeInQueueMs : undefined,
  signalConfidence: props.signalConfidence !== undefined ? props.signalConfidence : undefined,
  signalData: props.signalData !== undefined ? props.signalData : undefined,
      },
          update: {
      timestamp: props.timestamp !== undefined ? {
            set: props.timestamp 
           } : undefined,
  signalId: props.signalId !== undefined ? {
            set: props.signalId 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  signalType: props.signalType !== undefined ? {
            set: props.signalType 
           } : undefined,
  generatorSource: props.generatorSource !== undefined ? {
            set: props.generatorSource 
           } : undefined,
  priorityScore: props.priorityScore !== undefined ? {
            set: props.priorityScore 
           } : undefined,
  generatorWinRate: props.generatorWinRate !== undefined ? {
            set: props.generatorWinRate 
           } : undefined,
  generatorSharpe: props.generatorSharpe !== undefined ? {
            set: props.generatorSharpe 
           } : undefined,
  priorityTier: props.priorityTier !== undefined ? {
            set: props.priorityTier 
           } : undefined,
  scoreComponents: props.scoreComponents !== undefined ? props.scoreComponents : undefined,
  queuePosition: props.queuePosition !== undefined ? {
            set: props.queuePosition 
           } : undefined,
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
  queuedAt: props.queuedAt !== undefined ? {
            set: props.queuedAt 
           } : undefined,
  processingStartedAt: props.processingStartedAt !== undefined ? {
            set: props.processingStartedAt 
           } : undefined,
  processingCompletedAt: props.processingCompletedAt !== undefined ? {
            set: props.processingCompletedAt 
           } : undefined,
  timeInQueueMs: props.timeInQueueMs !== undefined ? {
            set: props.timeInQueueMs 
           } : undefined,
  signalConfidence: props.signalConfidence !== undefined ? {
            set: props.signalConfidence 
           } : undefined,
  signalData: props.signalData !== undefined ? props.signalData : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_SIGNALPRIORITYQUEUE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneSignalPriorityQueue) {
          return response.data.upsertOneSignalPriorityQueue;
        } else {
          return null as unknown as SignalPriorityQueueType;
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
          logger.error("Non-retryable constraint violation in upsertOneSignalPriorityQueue", {
            operation: 'upsertOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
          logger.warn("Database connection error in upsertOneSignalPriorityQueue, retrying...", {
            operation: 'upsertOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
            operation: 'upsertOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
   * Update multiple SignalPriorityQueue records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of SignalPriorityQueue objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: SignalPriorityQueueType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_SIGNALPRIORITYQUEUE = gql`
          mutation updateManySignalPriorityQueue($data: [SignalPriorityQueueCreateManyInput!]!) {
            updateManySignalPriorityQueue(data: $data) {
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
  timestamp: prop.timestamp !== undefined ? {
            set: prop.timestamp 
           } : undefined,
  signalId: prop.signalId !== undefined ? {
            set: prop.signalId 
           } : undefined,
  symbol: prop.symbol !== undefined ? {
            set: prop.symbol 
           } : undefined,
  signalType: prop.signalType !== undefined ? {
            set: prop.signalType 
           } : undefined,
  generatorSource: prop.generatorSource !== undefined ? {
            set: prop.generatorSource 
           } : undefined,
  priorityScore: prop.priorityScore !== undefined ? {
            set: prop.priorityScore 
           } : undefined,
  generatorWinRate: prop.generatorWinRate !== undefined ? {
            set: prop.generatorWinRate 
           } : undefined,
  generatorSharpe: prop.generatorSharpe !== undefined ? {
            set: prop.generatorSharpe 
           } : undefined,
  priorityTier: prop.priorityTier !== undefined ? {
            set: prop.priorityTier 
           } : undefined,
  scoreComponents: prop.scoreComponents !== undefined ? prop.scoreComponents : undefined,
  queuePosition: prop.queuePosition !== undefined ? {
            set: prop.queuePosition 
           } : undefined,
  status: prop.status !== undefined ? {
            set: prop.status 
           } : undefined,
  queuedAt: prop.queuedAt !== undefined ? {
            set: prop.queuedAt 
           } : undefined,
  processingStartedAt: prop.processingStartedAt !== undefined ? {
            set: prop.processingStartedAt 
           } : undefined,
  processingCompletedAt: prop.processingCompletedAt !== undefined ? {
            set: prop.processingCompletedAt 
           } : undefined,
  timeInQueueMs: prop.timeInQueueMs !== undefined ? {
            set: prop.timeInQueueMs 
           } : undefined,
  signalConfidence: prop.signalConfidence !== undefined ? {
            set: prop.signalConfidence 
           } : undefined,
  signalData: prop.signalData !== undefined ? prop.signalData : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,

          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_SIGNALPRIORITYQUEUE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManySignalPriorityQueue) {
          return response.data.updateManySignalPriorityQueue;
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
          logger.error("Non-retryable constraint violation in updateManySignalPriorityQueue", {
            operation: 'updateManySignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
          logger.warn("Database connection error in updateManySignalPriorityQueue, retrying...", {
            operation: 'updateManySignalPriorityQueue',
            model: 'SignalPriorityQueue',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManySignalPriorityQueue',
            model: 'SignalPriorityQueue',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManySignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
   * Delete a single SignalPriorityQueue record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted SignalPriorityQueue or null.
   */
  async delete(props: SignalPriorityQueueType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<SignalPriorityQueueType> {
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

        const DELETE_ONE_SIGNALPRIORITYQUEUE = gql`
          mutation deleteOneSignalPriorityQueue($where: SignalPriorityQueueWhereUniqueInput!) {
            deleteOneSignalPriorityQueue(where: $where) {
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
          mutation: DELETE_ONE_SIGNALPRIORITYQUEUE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneSignalPriorityQueue) {
          return response.data.deleteOneSignalPriorityQueue;
        } else {
          return null as unknown as SignalPriorityQueueType;
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
          logger.error("Non-retryable constraint violation in deleteOneSignalPriorityQueue", {
            operation: 'deleteOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
          logger.warn("Database connection error in deleteOneSignalPriorityQueue, retrying...", {
            operation: 'deleteOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
            operation: 'deleteOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneSignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
   * Retrieve a single SignalPriorityQueue record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved SignalPriorityQueue or null.
   */
  async get(props: SignalPriorityQueueType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<SignalPriorityQueueType | null> {
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

        const GET_SIGNALPRIORITYQUEUE = gql`
          query getSignalPriorityQueue($where: SignalPriorityQueueWhereUniqueInput!) {
            getSignalPriorityQueue(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  signalId: props.signalId !== undefined ? props.signalId : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_SIGNALPRIORITYQUEUE,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getSignalPriorityQueue ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No SignalPriorityQueue found') {
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
          logger.warn("Database connection error in getSignalPriorityQueue, retrying...", {
            operation: 'getSignalPriorityQueue',
            model: 'SignalPriorityQueue',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getSignalPriorityQueue',
            model: 'SignalPriorityQueue',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getSignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
   * Retrieve all SignalPriorityQueues records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of SignalPriorityQueue records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<SignalPriorityQueueType[] | null> {
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

        const GET_ALL_SIGNALPRIORITYQUEUE = gql`
          query getAllSignalPriorityQueue {
            signalPriorityQueues {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_SIGNALPRIORITYQUEUE,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.signalPriorityQueues ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No SignalPriorityQueue found') {
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
          logger.warn("Database connection error in getAllSignalPriorityQueue, retrying...", {
            operation: 'getAllSignalPriorityQueue',
            model: 'SignalPriorityQueue',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllSignalPriorityQueue',
            model: 'SignalPriorityQueue',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllSignalPriorityQueue',
            model: 'SignalPriorityQueue',
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
   * Find multiple SignalPriorityQueue records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found SignalPriorityQueue records or null.
   */
  async findMany(props: SignalPriorityQueueType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<SignalPriorityQueueType[] | null> {
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

        const FIND_MANY_SIGNALPRIORITYQUEUE = gql`
          query findManySignalPriorityQueue($where: SignalPriorityQueueWhereInput!) {
            signalPriorityQueues(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
  signalId: props.signalId !== undefined ? {
    equals: props.signalId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
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
          throw new Error(`findManySignalPriorityQueue requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_SIGNALPRIORITYQUEUE,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.signalPriorityQueues) {
          return response.data.signalPriorityQueues;
        } else {
          return [] as SignalPriorityQueueType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No SignalPriorityQueue found') {
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
          logger.warn("Database connection error in findManySignalPriorityQueue, retrying...", {
            operation: 'findManySignalPriorityQueue',
            model: 'SignalPriorityQueue',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManySignalPriorityQueue',
            model: 'SignalPriorityQueue',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManySignalPriorityQueue',
            model: 'SignalPriorityQueue',
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

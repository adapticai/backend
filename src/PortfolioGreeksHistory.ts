
  
import { PortfolioGreeksHistory as PortfolioGreeksHistoryType } from './generated/typegraphql-prisma/models/PortfolioGreeksHistory';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the PortfolioGreeksHistory model.
   */

  const selectionSet = `
    
  id
  accountId
  timestamp
  contractId
  symbol
  underlying
  delta
  gamma
  theta
  vega
  rho
  source

  `;

  export const PortfolioGreeksHistory = {

    /**
     * Create a new PortfolioGreeksHistory record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created PortfolioGreeksHistory or null.
     */

    /**
     * Create a new PortfolioGreeksHistory record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created PortfolioGreeksHistory or null.
     */
    async create(props: PortfolioGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<PortfolioGreeksHistoryType> {
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

          const CREATE_ONE_PORTFOLIOGREEKSHISTORY = gql`
              mutation createOnePortfolioGreeksHistory($data: PortfolioGreeksHistoryCreateInput!) {
                createOnePortfolioGreeksHistory(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                accountId: props.accountId !== undefined ? props.accountId : undefined,
  timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  contractId: props.contractId !== undefined ? props.contractId : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  underlying: props.underlying !== undefined ? props.underlying : undefined,
  delta: props.delta !== undefined ? props.delta : undefined,
  gamma: props.gamma !== undefined ? props.gamma : undefined,
  theta: props.theta !== undefined ? props.theta : undefined,
  vega: props.vega !== undefined ? props.vega : undefined,
  rho: props.rho !== undefined ? props.rho : undefined,
  totalDelta: props.totalDelta !== undefined ? props.totalDelta : undefined,
  totalGamma: props.totalGamma !== undefined ? props.totalGamma : undefined,
  totalTheta: props.totalTheta !== undefined ? props.totalTheta : undefined,
  totalVega: props.totalVega !== undefined ? props.totalVega : undefined,
  totalRho: props.totalRho !== undefined ? props.totalRho : undefined,
  positionCount: props.positionCount !== undefined ? props.positionCount : undefined,
  underlyingSymbols: props.underlyingSymbols !== undefined ? props.underlyingSymbols : undefined,
  expirationDates: props.expirationDates !== undefined ? props.expirationDates : undefined,
  marketHours: props.marketHours !== undefined ? props.marketHours : undefined,
  vix: props.vix !== undefined ? props.vix : undefined,
  spyPrice: props.spyPrice !== undefined ? props.spyPrice : undefined,
  source: props.source !== undefined ? props.source : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_PORTFOLIOGREEKSHISTORY,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOnePortfolioGreeksHistory) {
            return response.data.createOnePortfolioGreeksHistory;
          } else {
            return null as unknown as PortfolioGreeksHistoryType;
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
            logger.error("Non-retryable constraint violation in createOnePortfolioGreeksHistory", {
              operation: 'createOnePortfolioGreeksHistory',
              model: 'PortfolioGreeksHistory',
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
            logger.warn("Database connection error in createOnePortfolioGreeksHistory, retrying...", {
              operation: 'createOnePortfolioGreeksHistory',
              model: 'PortfolioGreeksHistory',
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
              operation: 'createOnePortfolioGreeksHistory',
              model: 'PortfolioGreeksHistory',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOnePortfolioGreeksHistory',
              model: 'PortfolioGreeksHistory',
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
   * Create multiple PortfolioGreeksHistory records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of PortfolioGreeksHistory objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: PortfolioGreeksHistoryType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_PORTFOLIOGREEKSHISTORY = gql`
          mutation createManyPortfolioGreeksHistory($data: [PortfolioGreeksHistoryCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyPortfolioGreeksHistory(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      accountId: prop.accountId !== undefined ? prop.accountId : undefined,
  timestamp: prop.timestamp !== undefined ? prop.timestamp : undefined,
  contractId: prop.contractId !== undefined ? prop.contractId : undefined,
  symbol: prop.symbol !== undefined ? prop.symbol : undefined,
  underlying: prop.underlying !== undefined ? prop.underlying : undefined,
  delta: prop.delta !== undefined ? prop.delta : undefined,
  gamma: prop.gamma !== undefined ? prop.gamma : undefined,
  theta: prop.theta !== undefined ? prop.theta : undefined,
  vega: prop.vega !== undefined ? prop.vega : undefined,
  rho: prop.rho !== undefined ? prop.rho : undefined,
  totalDelta: prop.totalDelta !== undefined ? prop.totalDelta : undefined,
  totalGamma: prop.totalGamma !== undefined ? prop.totalGamma : undefined,
  totalTheta: prop.totalTheta !== undefined ? prop.totalTheta : undefined,
  totalVega: prop.totalVega !== undefined ? prop.totalVega : undefined,
  totalRho: prop.totalRho !== undefined ? prop.totalRho : undefined,
  positionCount: prop.positionCount !== undefined ? prop.positionCount : undefined,
  underlyingSymbols: prop.underlyingSymbols !== undefined ? prop.underlyingSymbols : undefined,
  expirationDates: prop.expirationDates !== undefined ? prop.expirationDates : undefined,
  marketHours: prop.marketHours !== undefined ? prop.marketHours : undefined,
  vix: prop.vix !== undefined ? prop.vix : undefined,
  spyPrice: prop.spyPrice !== undefined ? prop.spyPrice : undefined,
  source: prop.source !== undefined ? prop.source : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_PORTFOLIOGREEKSHISTORY,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyPortfolioGreeksHistory) {
          return response.data.createManyPortfolioGreeksHistory;
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
          logger.warn("Duplicate key in createManyPortfolioGreeksHistory (expected during overlapping fetches)", {
            operation: 'createManyPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
          logger.warn("Database connection error in createManyPortfolioGreeksHistory, retrying...", {
            operation: 'createManyPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
   * Update a single PortfolioGreeksHistory record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated PortfolioGreeksHistory or null.
   */
  async update(props: PortfolioGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<PortfolioGreeksHistoryType> {
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

        const UPDATE_ONE_PORTFOLIOGREEKSHISTORY = gql`
          mutation updateOnePortfolioGreeksHistory($data: PortfolioGreeksHistoryUpdateInput!, $where: PortfolioGreeksHistoryWhereUniqueInput!) {
            updateOnePortfolioGreeksHistory(data: $data, where: $where) {
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
  accountId: props.accountId !== undefined ? {
            set: props.accountId 
           } : undefined,
  timestamp: props.timestamp !== undefined ? {
            set: props.timestamp 
           } : undefined,
  contractId: props.contractId !== undefined ? {
            set: props.contractId 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  underlying: props.underlying !== undefined ? {
            set: props.underlying 
           } : undefined,
  delta: props.delta !== undefined ? {
            set: props.delta 
           } : undefined,
  gamma: props.gamma !== undefined ? {
            set: props.gamma 
           } : undefined,
  theta: props.theta !== undefined ? {
            set: props.theta 
           } : undefined,
  vega: props.vega !== undefined ? {
            set: props.vega 
           } : undefined,
  rho: props.rho !== undefined ? {
            set: props.rho 
           } : undefined,
  totalDelta: props.totalDelta !== undefined ? {
            set: props.totalDelta 
           } : undefined,
  totalGamma: props.totalGamma !== undefined ? {
            set: props.totalGamma 
           } : undefined,
  totalTheta: props.totalTheta !== undefined ? {
            set: props.totalTheta 
           } : undefined,
  totalVega: props.totalVega !== undefined ? {
            set: props.totalVega 
           } : undefined,
  totalRho: props.totalRho !== undefined ? {
            set: props.totalRho 
           } : undefined,
  positionCount: props.positionCount !== undefined ? {
            set: props.positionCount 
           } : undefined,
  underlyingSymbols: props.underlyingSymbols !== undefined ? props.underlyingSymbols : undefined,
  expirationDates: props.expirationDates !== undefined ? props.expirationDates : undefined,
  marketHours: props.marketHours !== undefined ? {
            set: props.marketHours 
           } : undefined,
  vix: props.vix !== undefined ? {
            set: props.vix 
           } : undefined,
  spyPrice: props.spyPrice !== undefined ? {
            set: props.spyPrice 
           } : undefined,
  source: props.source !== undefined ? {
            set: props.source 
           } : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_PORTFOLIOGREEKSHISTORY,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOnePortfolioGreeksHistory) {
          return response.data.updateOnePortfolioGreeksHistory;
        } else {
          return null as unknown as PortfolioGreeksHistoryType;
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
          logger.error("Non-retryable constraint violation in updateOnePortfolioGreeksHistory", {
            operation: 'updateOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
          logger.warn("Database connection error in updateOnePortfolioGreeksHistory, retrying...", {
            operation: 'updateOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
            operation: 'updateOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
   * Upsert a single PortfolioGreeksHistory record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated PortfolioGreeksHistory or null.
   */
  async upsert(props: PortfolioGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<PortfolioGreeksHistoryType> {
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

        const UPSERT_ONE_PORTFOLIOGREEKSHISTORY = gql`
          mutation upsertOnePortfolioGreeksHistory($where: PortfolioGreeksHistoryWhereUniqueInput!, $create: PortfolioGreeksHistoryCreateInput!, $update: PortfolioGreeksHistoryUpdateInput!) {
            upsertOnePortfolioGreeksHistory(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  accountId: props.accountId !== undefined ? {
    equals: props.accountId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
      },
          create: {
        accountId: props.accountId !== undefined ? props.accountId : undefined,
  timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  contractId: props.contractId !== undefined ? props.contractId : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  underlying: props.underlying !== undefined ? props.underlying : undefined,
  delta: props.delta !== undefined ? props.delta : undefined,
  gamma: props.gamma !== undefined ? props.gamma : undefined,
  theta: props.theta !== undefined ? props.theta : undefined,
  vega: props.vega !== undefined ? props.vega : undefined,
  rho: props.rho !== undefined ? props.rho : undefined,
  totalDelta: props.totalDelta !== undefined ? props.totalDelta : undefined,
  totalGamma: props.totalGamma !== undefined ? props.totalGamma : undefined,
  totalTheta: props.totalTheta !== undefined ? props.totalTheta : undefined,
  totalVega: props.totalVega !== undefined ? props.totalVega : undefined,
  totalRho: props.totalRho !== undefined ? props.totalRho : undefined,
  positionCount: props.positionCount !== undefined ? props.positionCount : undefined,
  underlyingSymbols: props.underlyingSymbols !== undefined ? props.underlyingSymbols : undefined,
  expirationDates: props.expirationDates !== undefined ? props.expirationDates : undefined,
  marketHours: props.marketHours !== undefined ? props.marketHours : undefined,
  vix: props.vix !== undefined ? props.vix : undefined,
  spyPrice: props.spyPrice !== undefined ? props.spyPrice : undefined,
  source: props.source !== undefined ? props.source : undefined,
      },
          update: {
      accountId: props.accountId !== undefined ? {
            set: props.accountId 
           } : undefined,
  timestamp: props.timestamp !== undefined ? {
            set: props.timestamp 
           } : undefined,
  contractId: props.contractId !== undefined ? {
            set: props.contractId 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  underlying: props.underlying !== undefined ? {
            set: props.underlying 
           } : undefined,
  delta: props.delta !== undefined ? {
            set: props.delta 
           } : undefined,
  gamma: props.gamma !== undefined ? {
            set: props.gamma 
           } : undefined,
  theta: props.theta !== undefined ? {
            set: props.theta 
           } : undefined,
  vega: props.vega !== undefined ? {
            set: props.vega 
           } : undefined,
  rho: props.rho !== undefined ? {
            set: props.rho 
           } : undefined,
  totalDelta: props.totalDelta !== undefined ? {
            set: props.totalDelta 
           } : undefined,
  totalGamma: props.totalGamma !== undefined ? {
            set: props.totalGamma 
           } : undefined,
  totalTheta: props.totalTheta !== undefined ? {
            set: props.totalTheta 
           } : undefined,
  totalVega: props.totalVega !== undefined ? {
            set: props.totalVega 
           } : undefined,
  totalRho: props.totalRho !== undefined ? {
            set: props.totalRho 
           } : undefined,
  positionCount: props.positionCount !== undefined ? {
            set: props.positionCount 
           } : undefined,
  underlyingSymbols: props.underlyingSymbols !== undefined ? props.underlyingSymbols : undefined,
  expirationDates: props.expirationDates !== undefined ? props.expirationDates : undefined,
  marketHours: props.marketHours !== undefined ? {
            set: props.marketHours 
           } : undefined,
  vix: props.vix !== undefined ? {
            set: props.vix 
           } : undefined,
  spyPrice: props.spyPrice !== undefined ? {
            set: props.spyPrice 
           } : undefined,
  source: props.source !== undefined ? {
            set: props.source 
           } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_PORTFOLIOGREEKSHISTORY,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOnePortfolioGreeksHistory) {
          return response.data.upsertOnePortfolioGreeksHistory;
        } else {
          return null as unknown as PortfolioGreeksHistoryType;
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
          logger.error("Non-retryable constraint violation in upsertOnePortfolioGreeksHistory", {
            operation: 'upsertOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
          logger.warn("Database connection error in upsertOnePortfolioGreeksHistory, retrying...", {
            operation: 'upsertOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
            operation: 'upsertOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
   * Update multiple PortfolioGreeksHistory records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of PortfolioGreeksHistory objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: PortfolioGreeksHistoryType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_PORTFOLIOGREEKSHISTORY = gql`
          mutation updateManyPortfolioGreeksHistory($data: [PortfolioGreeksHistoryCreateManyInput!]!) {
            updateManyPortfolioGreeksHistory(data: $data) {
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
  accountId: prop.accountId !== undefined ? {
            set: prop.accountId 
           } : undefined,
  timestamp: prop.timestamp !== undefined ? {
            set: prop.timestamp 
           } : undefined,
  contractId: prop.contractId !== undefined ? {
            set: prop.contractId 
           } : undefined,
  symbol: prop.symbol !== undefined ? {
            set: prop.symbol 
           } : undefined,
  underlying: prop.underlying !== undefined ? {
            set: prop.underlying 
           } : undefined,
  delta: prop.delta !== undefined ? {
            set: prop.delta 
           } : undefined,
  gamma: prop.gamma !== undefined ? {
            set: prop.gamma 
           } : undefined,
  theta: prop.theta !== undefined ? {
            set: prop.theta 
           } : undefined,
  vega: prop.vega !== undefined ? {
            set: prop.vega 
           } : undefined,
  rho: prop.rho !== undefined ? {
            set: prop.rho 
           } : undefined,
  totalDelta: prop.totalDelta !== undefined ? {
            set: prop.totalDelta 
           } : undefined,
  totalGamma: prop.totalGamma !== undefined ? {
            set: prop.totalGamma 
           } : undefined,
  totalTheta: prop.totalTheta !== undefined ? {
            set: prop.totalTheta 
           } : undefined,
  totalVega: prop.totalVega !== undefined ? {
            set: prop.totalVega 
           } : undefined,
  totalRho: prop.totalRho !== undefined ? {
            set: prop.totalRho 
           } : undefined,
  positionCount: prop.positionCount !== undefined ? {
            set: prop.positionCount 
           } : undefined,
  underlyingSymbols: prop.underlyingSymbols !== undefined ? prop.underlyingSymbols : undefined,
  expirationDates: prop.expirationDates !== undefined ? prop.expirationDates : undefined,
  marketHours: prop.marketHours !== undefined ? {
            set: prop.marketHours 
           } : undefined,
  vix: prop.vix !== undefined ? {
            set: prop.vix 
           } : undefined,
  spyPrice: prop.spyPrice !== undefined ? {
            set: prop.spyPrice 
           } : undefined,
  source: prop.source !== undefined ? {
            set: prop.source 
           } : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,

          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_PORTFOLIOGREEKSHISTORY,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyPortfolioGreeksHistory) {
          return response.data.updateManyPortfolioGreeksHistory;
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
          logger.error("Non-retryable constraint violation in updateManyPortfolioGreeksHistory", {
            operation: 'updateManyPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
          logger.warn("Database connection error in updateManyPortfolioGreeksHistory, retrying...", {
            operation: 'updateManyPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
   * Delete a single PortfolioGreeksHistory record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted PortfolioGreeksHistory or null.
   */
  async delete(props: PortfolioGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<PortfolioGreeksHistoryType> {
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

        const DELETE_ONE_PORTFOLIOGREEKSHISTORY = gql`
          mutation deleteOnePortfolioGreeksHistory($where: PortfolioGreeksHistoryWhereUniqueInput!) {
            deleteOnePortfolioGreeksHistory(where: $where) {
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
          mutation: DELETE_ONE_PORTFOLIOGREEKSHISTORY,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOnePortfolioGreeksHistory) {
          return response.data.deleteOnePortfolioGreeksHistory;
        } else {
          return null as unknown as PortfolioGreeksHistoryType;
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
          logger.error("Non-retryable constraint violation in deleteOnePortfolioGreeksHistory", {
            operation: 'deleteOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
          logger.warn("Database connection error in deleteOnePortfolioGreeksHistory, retrying...", {
            operation: 'deleteOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
            operation: 'deleteOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOnePortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
   * Retrieve a single PortfolioGreeksHistory record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved PortfolioGreeksHistory or null.
   */
  async get(props: PortfolioGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<PortfolioGreeksHistoryType | null> {
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

        const GET_PORTFOLIOGREEKSHISTORY = gql`
          query getPortfolioGreeksHistory($where: PortfolioGreeksHistoryWhereUniqueInput!) {
            getPortfolioGreeksHistory(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  accountId: props.accountId !== undefined ? {
    equals: props.accountId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_PORTFOLIOGREEKSHISTORY,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getPortfolioGreeksHistory ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No PortfolioGreeksHistory found') {
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
          logger.warn("Database connection error in getPortfolioGreeksHistory, retrying...", {
            operation: 'getPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
   * Retrieve all PortfolioGreeksHistories records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of PortfolioGreeksHistory records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<PortfolioGreeksHistoryType[] | null> {
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

        const GET_ALL_PORTFOLIOGREEKSHISTORY = gql`
          query getAllPortfolioGreeksHistory {
            portfolioGreeksHistories {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_PORTFOLIOGREEKSHISTORY,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.portfolioGreeksHistories ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No PortfolioGreeksHistory found') {
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
          logger.warn("Database connection error in getAllPortfolioGreeksHistory, retrying...", {
            operation: 'getAllPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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
   * Find multiple PortfolioGreeksHistory records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found PortfolioGreeksHistory records or null.
   */
  async findMany(props: PortfolioGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<PortfolioGreeksHistoryType[] | null> {
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

        const FIND_MANY_PORTFOLIOGREEKSHISTORY = gql`
          query findManyPortfolioGreeksHistory($where: PortfolioGreeksHistoryWhereInput!) {
            portfolioGreeksHistories(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
  accountId: props.accountId !== undefined ? {
    equals: props.accountId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyPortfolioGreeksHistory requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_PORTFOLIOGREEKSHISTORY,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.portfolioGreeksHistories) {
          return response.data.portfolioGreeksHistories;
        } else {
          return [] as PortfolioGreeksHistoryType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No PortfolioGreeksHistory found') {
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
          logger.warn("Database connection error in findManyPortfolioGreeksHistory, retrying...", {
            operation: 'findManyPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyPortfolioGreeksHistory',
            model: 'PortfolioGreeksHistory',
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

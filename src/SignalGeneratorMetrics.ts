
  
import { SignalGeneratorMetrics as SignalGeneratorMetricsType } from './generated/typegraphql-prisma/models/SignalGeneratorMetrics';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the SignalGeneratorMetrics model.
   */

  const selectionSet = `
    
  id
  timestamp
  generatorSource
  symbol
  totalSignals
  successfulSignals
  failedSignals
  winRate
  sharpeRatio
  profitFactor
  averageReturn
  maxDrawdown
  averageTimeToProfit
  calibrationAccuracy
  performanceTrend
  lookbackPeriodDays
  healthScore
  healthStatus
  healthIssues
  updatedAt

  `;

  export const SignalGeneratorMetrics = {

    /**
     * Create a new SignalGeneratorMetrics record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created SignalGeneratorMetrics or null.
     */

    /**
     * Create a new SignalGeneratorMetrics record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created SignalGeneratorMetrics or null.
     */
    async create(props: SignalGeneratorMetricsType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<SignalGeneratorMetricsType> {
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

          const CREATE_ONE_SIGNALGENERATORMETRICS = gql`
              mutation createOneSignalGeneratorMetrics($data: SignalGeneratorMetricsCreateInput!) {
                createOneSignalGeneratorMetrics(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  generatorSource: props.generatorSource !== undefined ? props.generatorSource : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  totalSignals: props.totalSignals !== undefined ? props.totalSignals : undefined,
  successfulSignals: props.successfulSignals !== undefined ? props.successfulSignals : undefined,
  failedSignals: props.failedSignals !== undefined ? props.failedSignals : undefined,
  winRate: props.winRate !== undefined ? props.winRate : undefined,
  sharpeRatio: props.sharpeRatio !== undefined ? props.sharpeRatio : undefined,
  profitFactor: props.profitFactor !== undefined ? props.profitFactor : undefined,
  averageReturn: props.averageReturn !== undefined ? props.averageReturn : undefined,
  maxDrawdown: props.maxDrawdown !== undefined ? props.maxDrawdown : undefined,
  averageTimeToProfit: props.averageTimeToProfit !== undefined ? props.averageTimeToProfit : undefined,
  calibrationAccuracy: props.calibrationAccuracy !== undefined ? props.calibrationAccuracy : undefined,
  performanceTrend: props.performanceTrend !== undefined ? props.performanceTrend : undefined,
  lookbackPeriodDays: props.lookbackPeriodDays !== undefined ? props.lookbackPeriodDays : undefined,
  healthScore: props.healthScore !== undefined ? props.healthScore : undefined,
  healthStatus: props.healthStatus !== undefined ? props.healthStatus : undefined,
  healthIssues: props.healthIssues !== undefined ? props.healthIssues : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_SIGNALGENERATORMETRICS,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneSignalGeneratorMetrics) {
            return response.data.createOneSignalGeneratorMetrics;
          } else {
            return null as unknown as SignalGeneratorMetricsType;
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
            logger.error("Non-retryable constraint violation in createOneSignalGeneratorMetrics", {
              operation: 'createOneSignalGeneratorMetrics',
              model: 'SignalGeneratorMetrics',
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
            logger.warn("Database connection error in createOneSignalGeneratorMetrics, retrying...", {
              operation: 'createOneSignalGeneratorMetrics',
              model: 'SignalGeneratorMetrics',
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
              operation: 'createOneSignalGeneratorMetrics',
              model: 'SignalGeneratorMetrics',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneSignalGeneratorMetrics',
              model: 'SignalGeneratorMetrics',
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
   * Create multiple SignalGeneratorMetrics records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of SignalGeneratorMetrics objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: SignalGeneratorMetricsType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_SIGNALGENERATORMETRICS = gql`
          mutation createManySignalGeneratorMetrics($data: [SignalGeneratorMetricsCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManySignalGeneratorMetrics(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      timestamp: prop.timestamp !== undefined ? prop.timestamp : undefined,
  generatorSource: prop.generatorSource !== undefined ? prop.generatorSource : undefined,
  symbol: prop.symbol !== undefined ? prop.symbol : undefined,
  totalSignals: prop.totalSignals !== undefined ? prop.totalSignals : undefined,
  successfulSignals: prop.successfulSignals !== undefined ? prop.successfulSignals : undefined,
  failedSignals: prop.failedSignals !== undefined ? prop.failedSignals : undefined,
  winRate: prop.winRate !== undefined ? prop.winRate : undefined,
  sharpeRatio: prop.sharpeRatio !== undefined ? prop.sharpeRatio : undefined,
  profitFactor: prop.profitFactor !== undefined ? prop.profitFactor : undefined,
  averageReturn: prop.averageReturn !== undefined ? prop.averageReturn : undefined,
  maxDrawdown: prop.maxDrawdown !== undefined ? prop.maxDrawdown : undefined,
  averageTimeToProfit: prop.averageTimeToProfit !== undefined ? prop.averageTimeToProfit : undefined,
  calibrationAccuracy: prop.calibrationAccuracy !== undefined ? prop.calibrationAccuracy : undefined,
  performanceTrend: prop.performanceTrend !== undefined ? prop.performanceTrend : undefined,
  lookbackPeriodDays: prop.lookbackPeriodDays !== undefined ? prop.lookbackPeriodDays : undefined,
  healthScore: prop.healthScore !== undefined ? prop.healthScore : undefined,
  healthStatus: prop.healthStatus !== undefined ? prop.healthStatus : undefined,
  healthIssues: prop.healthIssues !== undefined ? prop.healthIssues : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_SIGNALGENERATORMETRICS,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManySignalGeneratorMetrics) {
          return response.data.createManySignalGeneratorMetrics;
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
          logger.warn("Duplicate key in createManySignalGeneratorMetrics (expected during overlapping fetches)", {
            operation: 'createManySignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
          logger.warn("Database connection error in createManySignalGeneratorMetrics, retrying...", {
            operation: 'createManySignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManySignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManySignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
   * Update a single SignalGeneratorMetrics record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated SignalGeneratorMetrics or null.
   */
  async update(props: SignalGeneratorMetricsType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<SignalGeneratorMetricsType> {
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

        const UPDATE_ONE_SIGNALGENERATORMETRICS = gql`
          mutation updateOneSignalGeneratorMetrics($data: SignalGeneratorMetricsUpdateInput!, $where: SignalGeneratorMetricsWhereUniqueInput!) {
            updateOneSignalGeneratorMetrics(data: $data, where: $where) {
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
  generatorSource: props.generatorSource !== undefined ? {
            set: props.generatorSource 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  totalSignals: props.totalSignals !== undefined ? {
            set: props.totalSignals 
           } : undefined,
  successfulSignals: props.successfulSignals !== undefined ? {
            set: props.successfulSignals 
           } : undefined,
  failedSignals: props.failedSignals !== undefined ? {
            set: props.failedSignals 
           } : undefined,
  winRate: props.winRate !== undefined ? {
            set: props.winRate 
           } : undefined,
  sharpeRatio: props.sharpeRatio !== undefined ? {
            set: props.sharpeRatio 
           } : undefined,
  profitFactor: props.profitFactor !== undefined ? {
            set: props.profitFactor 
           } : undefined,
  averageReturn: props.averageReturn !== undefined ? {
            set: props.averageReturn 
           } : undefined,
  maxDrawdown: props.maxDrawdown !== undefined ? {
            set: props.maxDrawdown 
           } : undefined,
  averageTimeToProfit: props.averageTimeToProfit !== undefined ? {
            set: props.averageTimeToProfit 
           } : undefined,
  calibrationAccuracy: props.calibrationAccuracy !== undefined ? {
            set: props.calibrationAccuracy 
           } : undefined,
  performanceTrend: props.performanceTrend !== undefined ? {
            set: props.performanceTrend 
           } : undefined,
  lookbackPeriodDays: props.lookbackPeriodDays !== undefined ? {
            set: props.lookbackPeriodDays 
           } : undefined,
  healthScore: props.healthScore !== undefined ? {
            set: props.healthScore 
           } : undefined,
  healthStatus: props.healthStatus !== undefined ? {
            set: props.healthStatus 
           } : undefined,
  healthIssues: props.healthIssues !== undefined ? props.healthIssues : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_SIGNALGENERATORMETRICS,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneSignalGeneratorMetrics) {
          return response.data.updateOneSignalGeneratorMetrics;
        } else {
          return null as unknown as SignalGeneratorMetricsType;
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
          logger.error("Non-retryable constraint violation in updateOneSignalGeneratorMetrics", {
            operation: 'updateOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
          logger.warn("Database connection error in updateOneSignalGeneratorMetrics, retrying...", {
            operation: 'updateOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
            operation: 'updateOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
   * Upsert a single SignalGeneratorMetrics record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated SignalGeneratorMetrics or null.
   */
  async upsert(props: SignalGeneratorMetricsType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<SignalGeneratorMetricsType> {
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

        const UPSERT_ONE_SIGNALGENERATORMETRICS = gql`
          mutation upsertOneSignalGeneratorMetrics($where: SignalGeneratorMetricsWhereUniqueInput!, $create: SignalGeneratorMetricsCreateInput!, $update: SignalGeneratorMetricsUpdateInput!) {
            upsertOneSignalGeneratorMetrics(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
      },
          create: {
        timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  generatorSource: props.generatorSource !== undefined ? props.generatorSource : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  totalSignals: props.totalSignals !== undefined ? props.totalSignals : undefined,
  successfulSignals: props.successfulSignals !== undefined ? props.successfulSignals : undefined,
  failedSignals: props.failedSignals !== undefined ? props.failedSignals : undefined,
  winRate: props.winRate !== undefined ? props.winRate : undefined,
  sharpeRatio: props.sharpeRatio !== undefined ? props.sharpeRatio : undefined,
  profitFactor: props.profitFactor !== undefined ? props.profitFactor : undefined,
  averageReturn: props.averageReturn !== undefined ? props.averageReturn : undefined,
  maxDrawdown: props.maxDrawdown !== undefined ? props.maxDrawdown : undefined,
  averageTimeToProfit: props.averageTimeToProfit !== undefined ? props.averageTimeToProfit : undefined,
  calibrationAccuracy: props.calibrationAccuracy !== undefined ? props.calibrationAccuracy : undefined,
  performanceTrend: props.performanceTrend !== undefined ? props.performanceTrend : undefined,
  lookbackPeriodDays: props.lookbackPeriodDays !== undefined ? props.lookbackPeriodDays : undefined,
  healthScore: props.healthScore !== undefined ? props.healthScore : undefined,
  healthStatus: props.healthStatus !== undefined ? props.healthStatus : undefined,
  healthIssues: props.healthIssues !== undefined ? props.healthIssues : undefined,
      },
          update: {
      timestamp: props.timestamp !== undefined ? {
            set: props.timestamp 
           } : undefined,
  generatorSource: props.generatorSource !== undefined ? {
            set: props.generatorSource 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  totalSignals: props.totalSignals !== undefined ? {
            set: props.totalSignals 
           } : undefined,
  successfulSignals: props.successfulSignals !== undefined ? {
            set: props.successfulSignals 
           } : undefined,
  failedSignals: props.failedSignals !== undefined ? {
            set: props.failedSignals 
           } : undefined,
  winRate: props.winRate !== undefined ? {
            set: props.winRate 
           } : undefined,
  sharpeRatio: props.sharpeRatio !== undefined ? {
            set: props.sharpeRatio 
           } : undefined,
  profitFactor: props.profitFactor !== undefined ? {
            set: props.profitFactor 
           } : undefined,
  averageReturn: props.averageReturn !== undefined ? {
            set: props.averageReturn 
           } : undefined,
  maxDrawdown: props.maxDrawdown !== undefined ? {
            set: props.maxDrawdown 
           } : undefined,
  averageTimeToProfit: props.averageTimeToProfit !== undefined ? {
            set: props.averageTimeToProfit 
           } : undefined,
  calibrationAccuracy: props.calibrationAccuracy !== undefined ? {
            set: props.calibrationAccuracy 
           } : undefined,
  performanceTrend: props.performanceTrend !== undefined ? {
            set: props.performanceTrend 
           } : undefined,
  lookbackPeriodDays: props.lookbackPeriodDays !== undefined ? {
            set: props.lookbackPeriodDays 
           } : undefined,
  healthScore: props.healthScore !== undefined ? {
            set: props.healthScore 
           } : undefined,
  healthStatus: props.healthStatus !== undefined ? {
            set: props.healthStatus 
           } : undefined,
  healthIssues: props.healthIssues !== undefined ? props.healthIssues : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_SIGNALGENERATORMETRICS,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneSignalGeneratorMetrics) {
          return response.data.upsertOneSignalGeneratorMetrics;
        } else {
          return null as unknown as SignalGeneratorMetricsType;
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
          logger.error("Non-retryable constraint violation in upsertOneSignalGeneratorMetrics", {
            operation: 'upsertOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
          logger.warn("Database connection error in upsertOneSignalGeneratorMetrics, retrying...", {
            operation: 'upsertOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
            operation: 'upsertOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
   * Update multiple SignalGeneratorMetrics records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of SignalGeneratorMetrics objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: SignalGeneratorMetricsType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_SIGNALGENERATORMETRICS = gql`
          mutation updateManySignalGeneratorMetrics($data: [SignalGeneratorMetricsCreateManyInput!]!) {
            updateManySignalGeneratorMetrics(data: $data) {
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
  generatorSource: prop.generatorSource !== undefined ? {
            set: prop.generatorSource 
           } : undefined,
  symbol: prop.symbol !== undefined ? {
            set: prop.symbol 
           } : undefined,
  totalSignals: prop.totalSignals !== undefined ? {
            set: prop.totalSignals 
           } : undefined,
  successfulSignals: prop.successfulSignals !== undefined ? {
            set: prop.successfulSignals 
           } : undefined,
  failedSignals: prop.failedSignals !== undefined ? {
            set: prop.failedSignals 
           } : undefined,
  winRate: prop.winRate !== undefined ? {
            set: prop.winRate 
           } : undefined,
  sharpeRatio: prop.sharpeRatio !== undefined ? {
            set: prop.sharpeRatio 
           } : undefined,
  profitFactor: prop.profitFactor !== undefined ? {
            set: prop.profitFactor 
           } : undefined,
  averageReturn: prop.averageReturn !== undefined ? {
            set: prop.averageReturn 
           } : undefined,
  maxDrawdown: prop.maxDrawdown !== undefined ? {
            set: prop.maxDrawdown 
           } : undefined,
  averageTimeToProfit: prop.averageTimeToProfit !== undefined ? {
            set: prop.averageTimeToProfit 
           } : undefined,
  calibrationAccuracy: prop.calibrationAccuracy !== undefined ? {
            set: prop.calibrationAccuracy 
           } : undefined,
  performanceTrend: prop.performanceTrend !== undefined ? {
            set: prop.performanceTrend 
           } : undefined,
  lookbackPeriodDays: prop.lookbackPeriodDays !== undefined ? {
            set: prop.lookbackPeriodDays 
           } : undefined,
  healthScore: prop.healthScore !== undefined ? {
            set: prop.healthScore 
           } : undefined,
  healthStatus: prop.healthStatus !== undefined ? {
            set: prop.healthStatus 
           } : undefined,
  healthIssues: prop.healthIssues !== undefined ? prop.healthIssues : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,

          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_SIGNALGENERATORMETRICS,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManySignalGeneratorMetrics) {
          return response.data.updateManySignalGeneratorMetrics;
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
          logger.error("Non-retryable constraint violation in updateManySignalGeneratorMetrics", {
            operation: 'updateManySignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
          logger.warn("Database connection error in updateManySignalGeneratorMetrics, retrying...", {
            operation: 'updateManySignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManySignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManySignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
   * Delete a single SignalGeneratorMetrics record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted SignalGeneratorMetrics or null.
   */
  async delete(props: SignalGeneratorMetricsType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<SignalGeneratorMetricsType> {
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

        const DELETE_ONE_SIGNALGENERATORMETRICS = gql`
          mutation deleteOneSignalGeneratorMetrics($where: SignalGeneratorMetricsWhereUniqueInput!) {
            deleteOneSignalGeneratorMetrics(where: $where) {
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
          mutation: DELETE_ONE_SIGNALGENERATORMETRICS,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneSignalGeneratorMetrics) {
          return response.data.deleteOneSignalGeneratorMetrics;
        } else {
          return null as unknown as SignalGeneratorMetricsType;
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
          logger.error("Non-retryable constraint violation in deleteOneSignalGeneratorMetrics", {
            operation: 'deleteOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
          logger.warn("Database connection error in deleteOneSignalGeneratorMetrics, retrying...", {
            operation: 'deleteOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
            operation: 'deleteOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
   * Retrieve a single SignalGeneratorMetrics record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved SignalGeneratorMetrics or null.
   */
  async get(props: SignalGeneratorMetricsType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<SignalGeneratorMetricsType | null> {
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

        const GET_SIGNALGENERATORMETRICS = gql`
          query getSignalGeneratorMetrics($where: SignalGeneratorMetricsWhereUniqueInput!) {
            getSignalGeneratorMetrics(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_SIGNALGENERATORMETRICS,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getSignalGeneratorMetrics ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No SignalGeneratorMetrics found') {
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
          logger.warn("Database connection error in getSignalGeneratorMetrics, retrying...", {
            operation: 'getSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
   * Retrieve all SignalGeneratorMetrics records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of SignalGeneratorMetrics records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<SignalGeneratorMetricsType[] | null> {
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

        const GET_ALL_SIGNALGENERATORMETRICS = gql`
          query getAllSignalGeneratorMetrics {
            signalGeneratorMetrics {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_SIGNALGENERATORMETRICS,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.signalGeneratorMetrics ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No SignalGeneratorMetrics found') {
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
          logger.warn("Database connection error in getAllSignalGeneratorMetrics, retrying...", {
            operation: 'getAllSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllSignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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
   * Find multiple SignalGeneratorMetrics records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found SignalGeneratorMetrics records or null.
   */
  async findMany(props: SignalGeneratorMetricsType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<SignalGeneratorMetricsType[] | null> {
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

        const FIND_MANY_SIGNALGENERATORMETRICS = gql`
          query findManySignalGeneratorMetrics($where: SignalGeneratorMetricsWhereInput!) {
            signalGeneratorMetrics(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
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
          throw new Error(`findManySignalGeneratorMetrics requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_SIGNALGENERATORMETRICS,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.signalGeneratorMetrics) {
          return response.data.signalGeneratorMetrics;
        } else {
          return [] as SignalGeneratorMetricsType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No SignalGeneratorMetrics found') {
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
          logger.warn("Database connection error in findManySignalGeneratorMetrics, retrying...", {
            operation: 'findManySignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManySignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManySignalGeneratorMetrics',
            model: 'SignalGeneratorMetrics',
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

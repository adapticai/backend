
  
import { MLTrainingData as MLTrainingDataType } from './generated/typegraphql-prisma/models/MLTrainingData';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the MLTrainingData model.
   */

  const selectionSet = `
    
  id
  signalId
  symbol
  signalType
  signalStrength
  predictedConfidence
  actualOutcomeSuccess
  actualOutcomeProfitLoss
  actualOutcomeReturnPercent
  actualOutcomeSharpeRatio
  actualOutcomeMaxDrawdown
  actualOutcomeDaysHeld
  actualOutcomeExitReason
  actualOutcomeQuality
  entryPrice
  exitPrice
  entryTime
  exitTime
  holdingPeriod
  returnPercent
  maxDrawdown
  maxGain
  volatilityDuringHold
  marketContextRegime
  marketContextVolatility
  marketContextSentiment
  marketContextVolume
  marketContextCorrelation
  marketContextBreadth
  signalFeatures
  executionMetricsLatency
  executionMetricsSlippage
  executionMetricsMarketImpact
  executionMetricsTimingAccuracy
  executionMetricsFillQuality
  executionMetricsOrderSize
  executionMetricsLiquidityScore
  slippageAnalysisExpected
  slippageAnalysisActual
  slippageAnalysisDifference
  slippageAnalysisMarketConditions
  slippageAnalysisTimeOfExecution
  slippageAnalysisVolumeAtExecution
  slippageAnalysisSpreadAtExecution
  attributionAlphaGeneration
  attributionBetaExposure
  attributionFactorExposures
  attributionSkillVsLuck
  attributionInformationRatio
  createdAt
  updatedAt

  `;

  export const MLTrainingData = {

    /**
     * Create a new MLTrainingData record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created MLTrainingData or null.
     */

    /**
     * Create a new MLTrainingData record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created MLTrainingData or null.
     */
    async create(props: MLTrainingDataType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<MLTrainingDataType> {
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

          const CREATE_ONE_MLTRAININGDATA = gql`
              mutation createOneMLTrainingData($data: MLTrainingDataCreateInput!) {
                createOneMLTrainingData(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                signalId: props.signalId !== undefined ? props.signalId : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  signalType: props.signalType !== undefined ? props.signalType : undefined,
  signalStrength: props.signalStrength !== undefined ? props.signalStrength : undefined,
  predictedConfidence: props.predictedConfidence !== undefined ? props.predictedConfidence : undefined,
  actualOutcomeSuccess: props.actualOutcomeSuccess !== undefined ? props.actualOutcomeSuccess : undefined,
  actualOutcomeProfitLoss: props.actualOutcomeProfitLoss !== undefined ? props.actualOutcomeProfitLoss : undefined,
  actualOutcomeReturnPercent: props.actualOutcomeReturnPercent !== undefined ? props.actualOutcomeReturnPercent : undefined,
  actualOutcomeSharpeRatio: props.actualOutcomeSharpeRatio !== undefined ? props.actualOutcomeSharpeRatio : undefined,
  actualOutcomeMaxDrawdown: props.actualOutcomeMaxDrawdown !== undefined ? props.actualOutcomeMaxDrawdown : undefined,
  actualOutcomeDaysHeld: props.actualOutcomeDaysHeld !== undefined ? props.actualOutcomeDaysHeld : undefined,
  actualOutcomeExitReason: props.actualOutcomeExitReason !== undefined ? props.actualOutcomeExitReason : undefined,
  actualOutcomeQuality: props.actualOutcomeQuality !== undefined ? props.actualOutcomeQuality : undefined,
  entryPrice: props.entryPrice !== undefined ? props.entryPrice : undefined,
  exitPrice: props.exitPrice !== undefined ? props.exitPrice : undefined,
  entryTime: props.entryTime !== undefined ? props.entryTime : undefined,
  exitTime: props.exitTime !== undefined ? props.exitTime : undefined,
  holdingPeriod: props.holdingPeriod !== undefined ? props.holdingPeriod : undefined,
  returnPercent: props.returnPercent !== undefined ? props.returnPercent : undefined,
  maxDrawdown: props.maxDrawdown !== undefined ? props.maxDrawdown : undefined,
  maxGain: props.maxGain !== undefined ? props.maxGain : undefined,
  volatilityDuringHold: props.volatilityDuringHold !== undefined ? props.volatilityDuringHold : undefined,
  marketContextRegime: props.marketContextRegime !== undefined ? props.marketContextRegime : undefined,
  marketContextVolatility: props.marketContextVolatility !== undefined ? props.marketContextVolatility : undefined,
  marketContextSentiment: props.marketContextSentiment !== undefined ? props.marketContextSentiment : undefined,
  marketContextVolume: props.marketContextVolume !== undefined ? props.marketContextVolume : undefined,
  marketContextCorrelation: props.marketContextCorrelation !== undefined ? props.marketContextCorrelation : undefined,
  marketContextBreadth: props.marketContextBreadth !== undefined ? props.marketContextBreadth : undefined,
  signalFeatures: props.signalFeatures !== undefined ? props.signalFeatures : undefined,
  executionMetricsLatency: props.executionMetricsLatency !== undefined ? props.executionMetricsLatency : undefined,
  executionMetricsSlippage: props.executionMetricsSlippage !== undefined ? props.executionMetricsSlippage : undefined,
  executionMetricsMarketImpact: props.executionMetricsMarketImpact !== undefined ? props.executionMetricsMarketImpact : undefined,
  executionMetricsTimingAccuracy: props.executionMetricsTimingAccuracy !== undefined ? props.executionMetricsTimingAccuracy : undefined,
  executionMetricsFillQuality: props.executionMetricsFillQuality !== undefined ? props.executionMetricsFillQuality : undefined,
  executionMetricsOrderSize: props.executionMetricsOrderSize !== undefined ? props.executionMetricsOrderSize : undefined,
  executionMetricsLiquidityScore: props.executionMetricsLiquidityScore !== undefined ? props.executionMetricsLiquidityScore : undefined,
  slippageAnalysisExpected: props.slippageAnalysisExpected !== undefined ? props.slippageAnalysisExpected : undefined,
  slippageAnalysisActual: props.slippageAnalysisActual !== undefined ? props.slippageAnalysisActual : undefined,
  slippageAnalysisDifference: props.slippageAnalysisDifference !== undefined ? props.slippageAnalysisDifference : undefined,
  slippageAnalysisMarketConditions: props.slippageAnalysisMarketConditions !== undefined ? props.slippageAnalysisMarketConditions : undefined,
  slippageAnalysisTimeOfExecution: props.slippageAnalysisTimeOfExecution !== undefined ? props.slippageAnalysisTimeOfExecution : undefined,
  slippageAnalysisVolumeAtExecution: props.slippageAnalysisVolumeAtExecution !== undefined ? props.slippageAnalysisVolumeAtExecution : undefined,
  slippageAnalysisSpreadAtExecution: props.slippageAnalysisSpreadAtExecution !== undefined ? props.slippageAnalysisSpreadAtExecution : undefined,
  attributionAlphaGeneration: props.attributionAlphaGeneration !== undefined ? props.attributionAlphaGeneration : undefined,
  attributionBetaExposure: props.attributionBetaExposure !== undefined ? props.attributionBetaExposure : undefined,
  attributionFactorExposures: props.attributionFactorExposures !== undefined ? props.attributionFactorExposures : undefined,
  attributionSkillVsLuck: props.attributionSkillVsLuck !== undefined ? props.attributionSkillVsLuck : undefined,
  attributionInformationRatio: props.attributionInformationRatio !== undefined ? props.attributionInformationRatio : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_MLTRAININGDATA,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneMLTrainingData) {
            return response.data.createOneMLTrainingData;
          } else {
            return null as unknown as MLTrainingDataType;
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
            logger.error("Non-retryable constraint violation in createOneMLTrainingData", {
              operation: 'createOneMLTrainingData',
              model: 'MLTrainingData',
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
            logger.warn("Database connection error in createOneMLTrainingData, retrying...", {
              operation: 'createOneMLTrainingData',
              model: 'MLTrainingData',
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
              operation: 'createOneMLTrainingData',
              model: 'MLTrainingData',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneMLTrainingData',
              model: 'MLTrainingData',
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
   * Create multiple MLTrainingData records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of MLTrainingData objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: MLTrainingDataType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_MLTRAININGDATA = gql`
          mutation createManyMLTrainingData($data: [MLTrainingDataCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyMLTrainingData(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      signalId: prop.signalId !== undefined ? prop.signalId : undefined,
  symbol: prop.symbol !== undefined ? prop.symbol : undefined,
  signalType: prop.signalType !== undefined ? prop.signalType : undefined,
  signalStrength: prop.signalStrength !== undefined ? prop.signalStrength : undefined,
  predictedConfidence: prop.predictedConfidence !== undefined ? prop.predictedConfidence : undefined,
  actualOutcomeSuccess: prop.actualOutcomeSuccess !== undefined ? prop.actualOutcomeSuccess : undefined,
  actualOutcomeProfitLoss: prop.actualOutcomeProfitLoss !== undefined ? prop.actualOutcomeProfitLoss : undefined,
  actualOutcomeReturnPercent: prop.actualOutcomeReturnPercent !== undefined ? prop.actualOutcomeReturnPercent : undefined,
  actualOutcomeSharpeRatio: prop.actualOutcomeSharpeRatio !== undefined ? prop.actualOutcomeSharpeRatio : undefined,
  actualOutcomeMaxDrawdown: prop.actualOutcomeMaxDrawdown !== undefined ? prop.actualOutcomeMaxDrawdown : undefined,
  actualOutcomeDaysHeld: prop.actualOutcomeDaysHeld !== undefined ? prop.actualOutcomeDaysHeld : undefined,
  actualOutcomeExitReason: prop.actualOutcomeExitReason !== undefined ? prop.actualOutcomeExitReason : undefined,
  actualOutcomeQuality: prop.actualOutcomeQuality !== undefined ? prop.actualOutcomeQuality : undefined,
  entryPrice: prop.entryPrice !== undefined ? prop.entryPrice : undefined,
  exitPrice: prop.exitPrice !== undefined ? prop.exitPrice : undefined,
  entryTime: prop.entryTime !== undefined ? prop.entryTime : undefined,
  exitTime: prop.exitTime !== undefined ? prop.exitTime : undefined,
  holdingPeriod: prop.holdingPeriod !== undefined ? prop.holdingPeriod : undefined,
  returnPercent: prop.returnPercent !== undefined ? prop.returnPercent : undefined,
  maxDrawdown: prop.maxDrawdown !== undefined ? prop.maxDrawdown : undefined,
  maxGain: prop.maxGain !== undefined ? prop.maxGain : undefined,
  volatilityDuringHold: prop.volatilityDuringHold !== undefined ? prop.volatilityDuringHold : undefined,
  marketContextRegime: prop.marketContextRegime !== undefined ? prop.marketContextRegime : undefined,
  marketContextVolatility: prop.marketContextVolatility !== undefined ? prop.marketContextVolatility : undefined,
  marketContextSentiment: prop.marketContextSentiment !== undefined ? prop.marketContextSentiment : undefined,
  marketContextVolume: prop.marketContextVolume !== undefined ? prop.marketContextVolume : undefined,
  marketContextCorrelation: prop.marketContextCorrelation !== undefined ? prop.marketContextCorrelation : undefined,
  marketContextBreadth: prop.marketContextBreadth !== undefined ? prop.marketContextBreadth : undefined,
  signalFeatures: prop.signalFeatures !== undefined ? prop.signalFeatures : undefined,
  executionMetricsLatency: prop.executionMetricsLatency !== undefined ? prop.executionMetricsLatency : undefined,
  executionMetricsSlippage: prop.executionMetricsSlippage !== undefined ? prop.executionMetricsSlippage : undefined,
  executionMetricsMarketImpact: prop.executionMetricsMarketImpact !== undefined ? prop.executionMetricsMarketImpact : undefined,
  executionMetricsTimingAccuracy: prop.executionMetricsTimingAccuracy !== undefined ? prop.executionMetricsTimingAccuracy : undefined,
  executionMetricsFillQuality: prop.executionMetricsFillQuality !== undefined ? prop.executionMetricsFillQuality : undefined,
  executionMetricsOrderSize: prop.executionMetricsOrderSize !== undefined ? prop.executionMetricsOrderSize : undefined,
  executionMetricsLiquidityScore: prop.executionMetricsLiquidityScore !== undefined ? prop.executionMetricsLiquidityScore : undefined,
  slippageAnalysisExpected: prop.slippageAnalysisExpected !== undefined ? prop.slippageAnalysisExpected : undefined,
  slippageAnalysisActual: prop.slippageAnalysisActual !== undefined ? prop.slippageAnalysisActual : undefined,
  slippageAnalysisDifference: prop.slippageAnalysisDifference !== undefined ? prop.slippageAnalysisDifference : undefined,
  slippageAnalysisMarketConditions: prop.slippageAnalysisMarketConditions !== undefined ? prop.slippageAnalysisMarketConditions : undefined,
  slippageAnalysisTimeOfExecution: prop.slippageAnalysisTimeOfExecution !== undefined ? prop.slippageAnalysisTimeOfExecution : undefined,
  slippageAnalysisVolumeAtExecution: prop.slippageAnalysisVolumeAtExecution !== undefined ? prop.slippageAnalysisVolumeAtExecution : undefined,
  slippageAnalysisSpreadAtExecution: prop.slippageAnalysisSpreadAtExecution !== undefined ? prop.slippageAnalysisSpreadAtExecution : undefined,
  attributionAlphaGeneration: prop.attributionAlphaGeneration !== undefined ? prop.attributionAlphaGeneration : undefined,
  attributionBetaExposure: prop.attributionBetaExposure !== undefined ? prop.attributionBetaExposure : undefined,
  attributionFactorExposures: prop.attributionFactorExposures !== undefined ? prop.attributionFactorExposures : undefined,
  attributionSkillVsLuck: prop.attributionSkillVsLuck !== undefined ? prop.attributionSkillVsLuck : undefined,
  attributionInformationRatio: prop.attributionInformationRatio !== undefined ? prop.attributionInformationRatio : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_MLTRAININGDATA,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyMLTrainingData) {
          return response.data.createManyMLTrainingData;
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
          logger.warn("Duplicate key in createManyMLTrainingData (expected during overlapping fetches)", {
            operation: 'createManyMLTrainingData',
            model: 'MLTrainingData',
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
          logger.warn("Database connection error in createManyMLTrainingData, retrying...", {
            operation: 'createManyMLTrainingData',
            model: 'MLTrainingData',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyMLTrainingData',
            model: 'MLTrainingData',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyMLTrainingData',
            model: 'MLTrainingData',
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
   * Update a single MLTrainingData record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated MLTrainingData or null.
   */
  async update(props: MLTrainingDataType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<MLTrainingDataType> {
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

        const UPDATE_ONE_MLTRAININGDATA = gql`
          mutation updateOneMLTrainingData($data: MLTrainingDataUpdateInput!, $where: MLTrainingDataWhereUniqueInput!) {
            updateOneMLTrainingData(data: $data, where: $where) {
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
  signalId: props.signalId !== undefined ? {
            set: props.signalId 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  signalType: props.signalType !== undefined ? {
            set: props.signalType 
           } : undefined,
  signalStrength: props.signalStrength !== undefined ? {
            set: props.signalStrength 
           } : undefined,
  predictedConfidence: props.predictedConfidence !== undefined ? {
            set: props.predictedConfidence 
           } : undefined,
  actualOutcomeSuccess: props.actualOutcomeSuccess !== undefined ? {
            set: props.actualOutcomeSuccess 
           } : undefined,
  actualOutcomeProfitLoss: props.actualOutcomeProfitLoss !== undefined ? {
            set: props.actualOutcomeProfitLoss 
           } : undefined,
  actualOutcomeReturnPercent: props.actualOutcomeReturnPercent !== undefined ? {
            set: props.actualOutcomeReturnPercent 
           } : undefined,
  actualOutcomeSharpeRatio: props.actualOutcomeSharpeRatio !== undefined ? {
            set: props.actualOutcomeSharpeRatio 
           } : undefined,
  actualOutcomeMaxDrawdown: props.actualOutcomeMaxDrawdown !== undefined ? {
            set: props.actualOutcomeMaxDrawdown 
           } : undefined,
  actualOutcomeDaysHeld: props.actualOutcomeDaysHeld !== undefined ? {
            set: props.actualOutcomeDaysHeld 
           } : undefined,
  actualOutcomeExitReason: props.actualOutcomeExitReason !== undefined ? {
            set: props.actualOutcomeExitReason 
           } : undefined,
  actualOutcomeQuality: props.actualOutcomeQuality !== undefined ? {
            set: props.actualOutcomeQuality 
           } : undefined,
  entryPrice: props.entryPrice !== undefined ? {
            set: props.entryPrice 
           } : undefined,
  exitPrice: props.exitPrice !== undefined ? {
            set: props.exitPrice 
           } : undefined,
  entryTime: props.entryTime !== undefined ? {
            set: props.entryTime 
           } : undefined,
  exitTime: props.exitTime !== undefined ? {
            set: props.exitTime 
           } : undefined,
  holdingPeriod: props.holdingPeriod !== undefined ? {
            set: props.holdingPeriod 
           } : undefined,
  returnPercent: props.returnPercent !== undefined ? {
            set: props.returnPercent 
           } : undefined,
  maxDrawdown: props.maxDrawdown !== undefined ? {
            set: props.maxDrawdown 
           } : undefined,
  maxGain: props.maxGain !== undefined ? {
            set: props.maxGain 
           } : undefined,
  volatilityDuringHold: props.volatilityDuringHold !== undefined ? {
            set: props.volatilityDuringHold 
           } : undefined,
  marketContextRegime: props.marketContextRegime !== undefined ? {
            set: props.marketContextRegime 
           } : undefined,
  marketContextVolatility: props.marketContextVolatility !== undefined ? {
            set: props.marketContextVolatility 
           } : undefined,
  marketContextSentiment: props.marketContextSentiment !== undefined ? {
            set: props.marketContextSentiment 
           } : undefined,
  marketContextVolume: props.marketContextVolume !== undefined ? {
            set: props.marketContextVolume 
           } : undefined,
  marketContextCorrelation: props.marketContextCorrelation !== undefined ? {
            set: props.marketContextCorrelation 
           } : undefined,
  marketContextBreadth: props.marketContextBreadth !== undefined ? {
            set: props.marketContextBreadth 
           } : undefined,
  signalFeatures: props.signalFeatures !== undefined ? props.signalFeatures : undefined,
  executionMetricsLatency: props.executionMetricsLatency !== undefined ? {
            set: props.executionMetricsLatency 
           } : undefined,
  executionMetricsSlippage: props.executionMetricsSlippage !== undefined ? {
            set: props.executionMetricsSlippage 
           } : undefined,
  executionMetricsMarketImpact: props.executionMetricsMarketImpact !== undefined ? {
            set: props.executionMetricsMarketImpact 
           } : undefined,
  executionMetricsTimingAccuracy: props.executionMetricsTimingAccuracy !== undefined ? {
            set: props.executionMetricsTimingAccuracy 
           } : undefined,
  executionMetricsFillQuality: props.executionMetricsFillQuality !== undefined ? {
            set: props.executionMetricsFillQuality 
           } : undefined,
  executionMetricsOrderSize: props.executionMetricsOrderSize !== undefined ? {
            set: props.executionMetricsOrderSize 
           } : undefined,
  executionMetricsLiquidityScore: props.executionMetricsLiquidityScore !== undefined ? {
            set: props.executionMetricsLiquidityScore 
           } : undefined,
  slippageAnalysisExpected: props.slippageAnalysisExpected !== undefined ? {
            set: props.slippageAnalysisExpected 
           } : undefined,
  slippageAnalysisActual: props.slippageAnalysisActual !== undefined ? {
            set: props.slippageAnalysisActual 
           } : undefined,
  slippageAnalysisDifference: props.slippageAnalysisDifference !== undefined ? {
            set: props.slippageAnalysisDifference 
           } : undefined,
  slippageAnalysisMarketConditions: props.slippageAnalysisMarketConditions !== undefined ? {
            set: props.slippageAnalysisMarketConditions 
           } : undefined,
  slippageAnalysisTimeOfExecution: props.slippageAnalysisTimeOfExecution !== undefined ? {
            set: props.slippageAnalysisTimeOfExecution 
           } : undefined,
  slippageAnalysisVolumeAtExecution: props.slippageAnalysisVolumeAtExecution !== undefined ? {
            set: props.slippageAnalysisVolumeAtExecution 
           } : undefined,
  slippageAnalysisSpreadAtExecution: props.slippageAnalysisSpreadAtExecution !== undefined ? {
            set: props.slippageAnalysisSpreadAtExecution 
           } : undefined,
  attributionAlphaGeneration: props.attributionAlphaGeneration !== undefined ? {
            set: props.attributionAlphaGeneration 
           } : undefined,
  attributionBetaExposure: props.attributionBetaExposure !== undefined ? {
            set: props.attributionBetaExposure 
           } : undefined,
  attributionFactorExposures: props.attributionFactorExposures !== undefined ? props.attributionFactorExposures : undefined,
  attributionSkillVsLuck: props.attributionSkillVsLuck !== undefined ? {
            set: props.attributionSkillVsLuck 
           } : undefined,
  attributionInformationRatio: props.attributionInformationRatio !== undefined ? {
            set: props.attributionInformationRatio 
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
          mutation: UPDATE_ONE_MLTRAININGDATA,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneMLTrainingData) {
          return response.data.updateOneMLTrainingData;
        } else {
          return null as unknown as MLTrainingDataType;
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
          logger.error("Non-retryable constraint violation in updateOneMLTrainingData", {
            operation: 'updateOneMLTrainingData',
            model: 'MLTrainingData',
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
          logger.warn("Database connection error in updateOneMLTrainingData, retrying...", {
            operation: 'updateOneMLTrainingData',
            model: 'MLTrainingData',
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
            operation: 'updateOneMLTrainingData',
            model: 'MLTrainingData',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneMLTrainingData',
            model: 'MLTrainingData',
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
   * Upsert a single MLTrainingData record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated MLTrainingData or null.
   */
  async upsert(props: MLTrainingDataType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<MLTrainingDataType> {
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

        const UPSERT_ONE_MLTRAININGDATA = gql`
          mutation upsertOneMLTrainingData($where: MLTrainingDataWhereUniqueInput!, $create: MLTrainingDataCreateInput!, $update: MLTrainingDataUpdateInput!) {
            upsertOneMLTrainingData(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  signalId: props.signalId !== undefined ? {
    equals: props.signalId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
      },
          create: {
        signalId: props.signalId !== undefined ? props.signalId : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  signalType: props.signalType !== undefined ? props.signalType : undefined,
  signalStrength: props.signalStrength !== undefined ? props.signalStrength : undefined,
  predictedConfidence: props.predictedConfidence !== undefined ? props.predictedConfidence : undefined,
  actualOutcomeSuccess: props.actualOutcomeSuccess !== undefined ? props.actualOutcomeSuccess : undefined,
  actualOutcomeProfitLoss: props.actualOutcomeProfitLoss !== undefined ? props.actualOutcomeProfitLoss : undefined,
  actualOutcomeReturnPercent: props.actualOutcomeReturnPercent !== undefined ? props.actualOutcomeReturnPercent : undefined,
  actualOutcomeSharpeRatio: props.actualOutcomeSharpeRatio !== undefined ? props.actualOutcomeSharpeRatio : undefined,
  actualOutcomeMaxDrawdown: props.actualOutcomeMaxDrawdown !== undefined ? props.actualOutcomeMaxDrawdown : undefined,
  actualOutcomeDaysHeld: props.actualOutcomeDaysHeld !== undefined ? props.actualOutcomeDaysHeld : undefined,
  actualOutcomeExitReason: props.actualOutcomeExitReason !== undefined ? props.actualOutcomeExitReason : undefined,
  actualOutcomeQuality: props.actualOutcomeQuality !== undefined ? props.actualOutcomeQuality : undefined,
  entryPrice: props.entryPrice !== undefined ? props.entryPrice : undefined,
  exitPrice: props.exitPrice !== undefined ? props.exitPrice : undefined,
  entryTime: props.entryTime !== undefined ? props.entryTime : undefined,
  exitTime: props.exitTime !== undefined ? props.exitTime : undefined,
  holdingPeriod: props.holdingPeriod !== undefined ? props.holdingPeriod : undefined,
  returnPercent: props.returnPercent !== undefined ? props.returnPercent : undefined,
  maxDrawdown: props.maxDrawdown !== undefined ? props.maxDrawdown : undefined,
  maxGain: props.maxGain !== undefined ? props.maxGain : undefined,
  volatilityDuringHold: props.volatilityDuringHold !== undefined ? props.volatilityDuringHold : undefined,
  marketContextRegime: props.marketContextRegime !== undefined ? props.marketContextRegime : undefined,
  marketContextVolatility: props.marketContextVolatility !== undefined ? props.marketContextVolatility : undefined,
  marketContextSentiment: props.marketContextSentiment !== undefined ? props.marketContextSentiment : undefined,
  marketContextVolume: props.marketContextVolume !== undefined ? props.marketContextVolume : undefined,
  marketContextCorrelation: props.marketContextCorrelation !== undefined ? props.marketContextCorrelation : undefined,
  marketContextBreadth: props.marketContextBreadth !== undefined ? props.marketContextBreadth : undefined,
  signalFeatures: props.signalFeatures !== undefined ? props.signalFeatures : undefined,
  executionMetricsLatency: props.executionMetricsLatency !== undefined ? props.executionMetricsLatency : undefined,
  executionMetricsSlippage: props.executionMetricsSlippage !== undefined ? props.executionMetricsSlippage : undefined,
  executionMetricsMarketImpact: props.executionMetricsMarketImpact !== undefined ? props.executionMetricsMarketImpact : undefined,
  executionMetricsTimingAccuracy: props.executionMetricsTimingAccuracy !== undefined ? props.executionMetricsTimingAccuracy : undefined,
  executionMetricsFillQuality: props.executionMetricsFillQuality !== undefined ? props.executionMetricsFillQuality : undefined,
  executionMetricsOrderSize: props.executionMetricsOrderSize !== undefined ? props.executionMetricsOrderSize : undefined,
  executionMetricsLiquidityScore: props.executionMetricsLiquidityScore !== undefined ? props.executionMetricsLiquidityScore : undefined,
  slippageAnalysisExpected: props.slippageAnalysisExpected !== undefined ? props.slippageAnalysisExpected : undefined,
  slippageAnalysisActual: props.slippageAnalysisActual !== undefined ? props.slippageAnalysisActual : undefined,
  slippageAnalysisDifference: props.slippageAnalysisDifference !== undefined ? props.slippageAnalysisDifference : undefined,
  slippageAnalysisMarketConditions: props.slippageAnalysisMarketConditions !== undefined ? props.slippageAnalysisMarketConditions : undefined,
  slippageAnalysisTimeOfExecution: props.slippageAnalysisTimeOfExecution !== undefined ? props.slippageAnalysisTimeOfExecution : undefined,
  slippageAnalysisVolumeAtExecution: props.slippageAnalysisVolumeAtExecution !== undefined ? props.slippageAnalysisVolumeAtExecution : undefined,
  slippageAnalysisSpreadAtExecution: props.slippageAnalysisSpreadAtExecution !== undefined ? props.slippageAnalysisSpreadAtExecution : undefined,
  attributionAlphaGeneration: props.attributionAlphaGeneration !== undefined ? props.attributionAlphaGeneration : undefined,
  attributionBetaExposure: props.attributionBetaExposure !== undefined ? props.attributionBetaExposure : undefined,
  attributionFactorExposures: props.attributionFactorExposures !== undefined ? props.attributionFactorExposures : undefined,
  attributionSkillVsLuck: props.attributionSkillVsLuck !== undefined ? props.attributionSkillVsLuck : undefined,
  attributionInformationRatio: props.attributionInformationRatio !== undefined ? props.attributionInformationRatio : undefined,
      },
          update: {
      signalId: props.signalId !== undefined ? {
            set: props.signalId 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  signalType: props.signalType !== undefined ? {
            set: props.signalType 
           } : undefined,
  signalStrength: props.signalStrength !== undefined ? {
            set: props.signalStrength 
           } : undefined,
  predictedConfidence: props.predictedConfidence !== undefined ? {
            set: props.predictedConfidence 
           } : undefined,
  actualOutcomeSuccess: props.actualOutcomeSuccess !== undefined ? {
            set: props.actualOutcomeSuccess 
           } : undefined,
  actualOutcomeProfitLoss: props.actualOutcomeProfitLoss !== undefined ? {
            set: props.actualOutcomeProfitLoss 
           } : undefined,
  actualOutcomeReturnPercent: props.actualOutcomeReturnPercent !== undefined ? {
            set: props.actualOutcomeReturnPercent 
           } : undefined,
  actualOutcomeSharpeRatio: props.actualOutcomeSharpeRatio !== undefined ? {
            set: props.actualOutcomeSharpeRatio 
           } : undefined,
  actualOutcomeMaxDrawdown: props.actualOutcomeMaxDrawdown !== undefined ? {
            set: props.actualOutcomeMaxDrawdown 
           } : undefined,
  actualOutcomeDaysHeld: props.actualOutcomeDaysHeld !== undefined ? {
            set: props.actualOutcomeDaysHeld 
           } : undefined,
  actualOutcomeExitReason: props.actualOutcomeExitReason !== undefined ? {
            set: props.actualOutcomeExitReason 
           } : undefined,
  actualOutcomeQuality: props.actualOutcomeQuality !== undefined ? {
            set: props.actualOutcomeQuality 
           } : undefined,
  entryPrice: props.entryPrice !== undefined ? {
            set: props.entryPrice 
           } : undefined,
  exitPrice: props.exitPrice !== undefined ? {
            set: props.exitPrice 
           } : undefined,
  entryTime: props.entryTime !== undefined ? {
            set: props.entryTime 
           } : undefined,
  exitTime: props.exitTime !== undefined ? {
            set: props.exitTime 
           } : undefined,
  holdingPeriod: props.holdingPeriod !== undefined ? {
            set: props.holdingPeriod 
           } : undefined,
  returnPercent: props.returnPercent !== undefined ? {
            set: props.returnPercent 
           } : undefined,
  maxDrawdown: props.maxDrawdown !== undefined ? {
            set: props.maxDrawdown 
           } : undefined,
  maxGain: props.maxGain !== undefined ? {
            set: props.maxGain 
           } : undefined,
  volatilityDuringHold: props.volatilityDuringHold !== undefined ? {
            set: props.volatilityDuringHold 
           } : undefined,
  marketContextRegime: props.marketContextRegime !== undefined ? {
            set: props.marketContextRegime 
           } : undefined,
  marketContextVolatility: props.marketContextVolatility !== undefined ? {
            set: props.marketContextVolatility 
           } : undefined,
  marketContextSentiment: props.marketContextSentiment !== undefined ? {
            set: props.marketContextSentiment 
           } : undefined,
  marketContextVolume: props.marketContextVolume !== undefined ? {
            set: props.marketContextVolume 
           } : undefined,
  marketContextCorrelation: props.marketContextCorrelation !== undefined ? {
            set: props.marketContextCorrelation 
           } : undefined,
  marketContextBreadth: props.marketContextBreadth !== undefined ? {
            set: props.marketContextBreadth 
           } : undefined,
  signalFeatures: props.signalFeatures !== undefined ? props.signalFeatures : undefined,
  executionMetricsLatency: props.executionMetricsLatency !== undefined ? {
            set: props.executionMetricsLatency 
           } : undefined,
  executionMetricsSlippage: props.executionMetricsSlippage !== undefined ? {
            set: props.executionMetricsSlippage 
           } : undefined,
  executionMetricsMarketImpact: props.executionMetricsMarketImpact !== undefined ? {
            set: props.executionMetricsMarketImpact 
           } : undefined,
  executionMetricsTimingAccuracy: props.executionMetricsTimingAccuracy !== undefined ? {
            set: props.executionMetricsTimingAccuracy 
           } : undefined,
  executionMetricsFillQuality: props.executionMetricsFillQuality !== undefined ? {
            set: props.executionMetricsFillQuality 
           } : undefined,
  executionMetricsOrderSize: props.executionMetricsOrderSize !== undefined ? {
            set: props.executionMetricsOrderSize 
           } : undefined,
  executionMetricsLiquidityScore: props.executionMetricsLiquidityScore !== undefined ? {
            set: props.executionMetricsLiquidityScore 
           } : undefined,
  slippageAnalysisExpected: props.slippageAnalysisExpected !== undefined ? {
            set: props.slippageAnalysisExpected 
           } : undefined,
  slippageAnalysisActual: props.slippageAnalysisActual !== undefined ? {
            set: props.slippageAnalysisActual 
           } : undefined,
  slippageAnalysisDifference: props.slippageAnalysisDifference !== undefined ? {
            set: props.slippageAnalysisDifference 
           } : undefined,
  slippageAnalysisMarketConditions: props.slippageAnalysisMarketConditions !== undefined ? {
            set: props.slippageAnalysisMarketConditions 
           } : undefined,
  slippageAnalysisTimeOfExecution: props.slippageAnalysisTimeOfExecution !== undefined ? {
            set: props.slippageAnalysisTimeOfExecution 
           } : undefined,
  slippageAnalysisVolumeAtExecution: props.slippageAnalysisVolumeAtExecution !== undefined ? {
            set: props.slippageAnalysisVolumeAtExecution 
           } : undefined,
  slippageAnalysisSpreadAtExecution: props.slippageAnalysisSpreadAtExecution !== undefined ? {
            set: props.slippageAnalysisSpreadAtExecution 
           } : undefined,
  attributionAlphaGeneration: props.attributionAlphaGeneration !== undefined ? {
            set: props.attributionAlphaGeneration 
           } : undefined,
  attributionBetaExposure: props.attributionBetaExposure !== undefined ? {
            set: props.attributionBetaExposure 
           } : undefined,
  attributionFactorExposures: props.attributionFactorExposures !== undefined ? props.attributionFactorExposures : undefined,
  attributionSkillVsLuck: props.attributionSkillVsLuck !== undefined ? {
            set: props.attributionSkillVsLuck 
           } : undefined,
  attributionInformationRatio: props.attributionInformationRatio !== undefined ? {
            set: props.attributionInformationRatio 
           } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_MLTRAININGDATA,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneMLTrainingData) {
          return response.data.upsertOneMLTrainingData;
        } else {
          return null as unknown as MLTrainingDataType;
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
          logger.error("Non-retryable constraint violation in upsertOneMLTrainingData", {
            operation: 'upsertOneMLTrainingData',
            model: 'MLTrainingData',
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
          logger.warn("Database connection error in upsertOneMLTrainingData, retrying...", {
            operation: 'upsertOneMLTrainingData',
            model: 'MLTrainingData',
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
            operation: 'upsertOneMLTrainingData',
            model: 'MLTrainingData',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneMLTrainingData',
            model: 'MLTrainingData',
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
   * Update multiple MLTrainingData records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of MLTrainingData objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: MLTrainingDataType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_MLTRAININGDATA = gql`
          mutation updateManyMLTrainingData($data: [MLTrainingDataCreateManyInput!]!) {
            updateManyMLTrainingData(data: $data) {
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
  signalId: prop.signalId !== undefined ? {
            set: prop.signalId 
           } : undefined,
  symbol: prop.symbol !== undefined ? {
            set: prop.symbol 
           } : undefined,
  signalType: prop.signalType !== undefined ? {
            set: prop.signalType 
           } : undefined,
  signalStrength: prop.signalStrength !== undefined ? {
            set: prop.signalStrength 
           } : undefined,
  predictedConfidence: prop.predictedConfidence !== undefined ? {
            set: prop.predictedConfidence 
           } : undefined,
  actualOutcomeSuccess: prop.actualOutcomeSuccess !== undefined ? {
            set: prop.actualOutcomeSuccess 
           } : undefined,
  actualOutcomeProfitLoss: prop.actualOutcomeProfitLoss !== undefined ? {
            set: prop.actualOutcomeProfitLoss 
           } : undefined,
  actualOutcomeReturnPercent: prop.actualOutcomeReturnPercent !== undefined ? {
            set: prop.actualOutcomeReturnPercent 
           } : undefined,
  actualOutcomeSharpeRatio: prop.actualOutcomeSharpeRatio !== undefined ? {
            set: prop.actualOutcomeSharpeRatio 
           } : undefined,
  actualOutcomeMaxDrawdown: prop.actualOutcomeMaxDrawdown !== undefined ? {
            set: prop.actualOutcomeMaxDrawdown 
           } : undefined,
  actualOutcomeDaysHeld: prop.actualOutcomeDaysHeld !== undefined ? {
            set: prop.actualOutcomeDaysHeld 
           } : undefined,
  actualOutcomeExitReason: prop.actualOutcomeExitReason !== undefined ? {
            set: prop.actualOutcomeExitReason 
           } : undefined,
  actualOutcomeQuality: prop.actualOutcomeQuality !== undefined ? {
            set: prop.actualOutcomeQuality 
           } : undefined,
  entryPrice: prop.entryPrice !== undefined ? {
            set: prop.entryPrice 
           } : undefined,
  exitPrice: prop.exitPrice !== undefined ? {
            set: prop.exitPrice 
           } : undefined,
  entryTime: prop.entryTime !== undefined ? {
            set: prop.entryTime 
           } : undefined,
  exitTime: prop.exitTime !== undefined ? {
            set: prop.exitTime 
           } : undefined,
  holdingPeriod: prop.holdingPeriod !== undefined ? {
            set: prop.holdingPeriod 
           } : undefined,
  returnPercent: prop.returnPercent !== undefined ? {
            set: prop.returnPercent 
           } : undefined,
  maxDrawdown: prop.maxDrawdown !== undefined ? {
            set: prop.maxDrawdown 
           } : undefined,
  maxGain: prop.maxGain !== undefined ? {
            set: prop.maxGain 
           } : undefined,
  volatilityDuringHold: prop.volatilityDuringHold !== undefined ? {
            set: prop.volatilityDuringHold 
           } : undefined,
  marketContextRegime: prop.marketContextRegime !== undefined ? {
            set: prop.marketContextRegime 
           } : undefined,
  marketContextVolatility: prop.marketContextVolatility !== undefined ? {
            set: prop.marketContextVolatility 
           } : undefined,
  marketContextSentiment: prop.marketContextSentiment !== undefined ? {
            set: prop.marketContextSentiment 
           } : undefined,
  marketContextVolume: prop.marketContextVolume !== undefined ? {
            set: prop.marketContextVolume 
           } : undefined,
  marketContextCorrelation: prop.marketContextCorrelation !== undefined ? {
            set: prop.marketContextCorrelation 
           } : undefined,
  marketContextBreadth: prop.marketContextBreadth !== undefined ? {
            set: prop.marketContextBreadth 
           } : undefined,
  signalFeatures: prop.signalFeatures !== undefined ? prop.signalFeatures : undefined,
  executionMetricsLatency: prop.executionMetricsLatency !== undefined ? {
            set: prop.executionMetricsLatency 
           } : undefined,
  executionMetricsSlippage: prop.executionMetricsSlippage !== undefined ? {
            set: prop.executionMetricsSlippage 
           } : undefined,
  executionMetricsMarketImpact: prop.executionMetricsMarketImpact !== undefined ? {
            set: prop.executionMetricsMarketImpact 
           } : undefined,
  executionMetricsTimingAccuracy: prop.executionMetricsTimingAccuracy !== undefined ? {
            set: prop.executionMetricsTimingAccuracy 
           } : undefined,
  executionMetricsFillQuality: prop.executionMetricsFillQuality !== undefined ? {
            set: prop.executionMetricsFillQuality 
           } : undefined,
  executionMetricsOrderSize: prop.executionMetricsOrderSize !== undefined ? {
            set: prop.executionMetricsOrderSize 
           } : undefined,
  executionMetricsLiquidityScore: prop.executionMetricsLiquidityScore !== undefined ? {
            set: prop.executionMetricsLiquidityScore 
           } : undefined,
  slippageAnalysisExpected: prop.slippageAnalysisExpected !== undefined ? {
            set: prop.slippageAnalysisExpected 
           } : undefined,
  slippageAnalysisActual: prop.slippageAnalysisActual !== undefined ? {
            set: prop.slippageAnalysisActual 
           } : undefined,
  slippageAnalysisDifference: prop.slippageAnalysisDifference !== undefined ? {
            set: prop.slippageAnalysisDifference 
           } : undefined,
  slippageAnalysisMarketConditions: prop.slippageAnalysisMarketConditions !== undefined ? {
            set: prop.slippageAnalysisMarketConditions 
           } : undefined,
  slippageAnalysisTimeOfExecution: prop.slippageAnalysisTimeOfExecution !== undefined ? {
            set: prop.slippageAnalysisTimeOfExecution 
           } : undefined,
  slippageAnalysisVolumeAtExecution: prop.slippageAnalysisVolumeAtExecution !== undefined ? {
            set: prop.slippageAnalysisVolumeAtExecution 
           } : undefined,
  slippageAnalysisSpreadAtExecution: prop.slippageAnalysisSpreadAtExecution !== undefined ? {
            set: prop.slippageAnalysisSpreadAtExecution 
           } : undefined,
  attributionAlphaGeneration: prop.attributionAlphaGeneration !== undefined ? {
            set: prop.attributionAlphaGeneration 
           } : undefined,
  attributionBetaExposure: prop.attributionBetaExposure !== undefined ? {
            set: prop.attributionBetaExposure 
           } : undefined,
  attributionFactorExposures: prop.attributionFactorExposures !== undefined ? prop.attributionFactorExposures : undefined,
  attributionSkillVsLuck: prop.attributionSkillVsLuck !== undefined ? {
            set: prop.attributionSkillVsLuck 
           } : undefined,
  attributionInformationRatio: prop.attributionInformationRatio !== undefined ? {
            set: prop.attributionInformationRatio 
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
          mutation: UPDATE_MANY_MLTRAININGDATA,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyMLTrainingData) {
          return response.data.updateManyMLTrainingData;
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
          logger.error("Non-retryable constraint violation in updateManyMLTrainingData", {
            operation: 'updateManyMLTrainingData',
            model: 'MLTrainingData',
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
          logger.warn("Database connection error in updateManyMLTrainingData, retrying...", {
            operation: 'updateManyMLTrainingData',
            model: 'MLTrainingData',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyMLTrainingData',
            model: 'MLTrainingData',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyMLTrainingData',
            model: 'MLTrainingData',
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
   * Delete a single MLTrainingData record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted MLTrainingData or null.
   */
  async delete(props: MLTrainingDataType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<MLTrainingDataType> {
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

        const DELETE_ONE_MLTRAININGDATA = gql`
          mutation deleteOneMLTrainingData($where: MLTrainingDataWhereUniqueInput!) {
            deleteOneMLTrainingData(where: $where) {
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
          mutation: DELETE_ONE_MLTRAININGDATA,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneMLTrainingData) {
          return response.data.deleteOneMLTrainingData;
        } else {
          return null as unknown as MLTrainingDataType;
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
          logger.error("Non-retryable constraint violation in deleteOneMLTrainingData", {
            operation: 'deleteOneMLTrainingData',
            model: 'MLTrainingData',
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
          logger.warn("Database connection error in deleteOneMLTrainingData, retrying...", {
            operation: 'deleteOneMLTrainingData',
            model: 'MLTrainingData',
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
            operation: 'deleteOneMLTrainingData',
            model: 'MLTrainingData',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneMLTrainingData',
            model: 'MLTrainingData',
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
   * Retrieve a single MLTrainingData record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved MLTrainingData or null.
   */
  async get(props: MLTrainingDataType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<MLTrainingDataType | null> {
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

        const GET_MLTRAININGDATA = gql`
          query getMLTrainingData($where: MLTrainingDataWhereUniqueInput!) {
            getMLTrainingData(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  signalId: props.signalId !== undefined ? {
    equals: props.signalId 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_MLTRAININGDATA,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getMLTrainingData ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No MLTrainingData found') {
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
          logger.warn("Database connection error in getMLTrainingData, retrying...", {
            operation: 'getMLTrainingData',
            model: 'MLTrainingData',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getMLTrainingData',
            model: 'MLTrainingData',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getMLTrainingData',
            model: 'MLTrainingData',
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
   * Retrieve all MLTrainingData records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of MLTrainingData records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<MLTrainingDataType[] | null> {
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

        const GET_ALL_MLTRAININGDATA = gql`
          query getAllMLTrainingData {
            mLTrainingData {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_MLTRAININGDATA,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.mLTrainingData ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No MLTrainingData found') {
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
          logger.warn("Database connection error in getAllMLTrainingData, retrying...", {
            operation: 'getAllMLTrainingData',
            model: 'MLTrainingData',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllMLTrainingData',
            model: 'MLTrainingData',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllMLTrainingData',
            model: 'MLTrainingData',
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
   * Find multiple MLTrainingData records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found MLTrainingData records or null.
   */
  async findMany(props: MLTrainingDataType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<MLTrainingDataType[] | null> {
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

        const FIND_MANY_MLTRAININGDATA = gql`
          query findManyMLTrainingData($where: MLTrainingDataWhereInput!) {
            mLTrainingData(where: $where) {
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
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyMLTrainingData requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_MLTRAININGDATA,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.mLTrainingData) {
          return response.data.mLTrainingData;
        } else {
          return [] as MLTrainingDataType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No MLTrainingData found') {
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
          logger.warn("Database connection error in findManyMLTrainingData, retrying...", {
            operation: 'findManyMLTrainingData',
            model: 'MLTrainingData',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyMLTrainingData',
            model: 'MLTrainingData',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyMLTrainingData',
            model: 'MLTrainingData',
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

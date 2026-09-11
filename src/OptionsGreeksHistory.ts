
  
import { OptionsGreeksHistory as OptionsGreeksHistoryType } from './generated/typegraphql-prisma/models/OptionsGreeksHistory';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the OptionsGreeksHistory model.
   */

  const selectionSet = `
    
  id
  contractId
  contract {
    id
    symbol
    contractSymbol
    optionType
    strikePrice
    expirationDate
    daysToExpiration
    lastPrice
    bidPrice
    askPrice
    midPrice
    bidSize
    askSize
    volume
    openInterest
    impliedVolatility
    delta
    gamma
    theta
    vega
    rho
    inTheMoney
    intrinsicValue
    extrinsicValue
    theoreticalPrice
    underlyingPrice
    metadata
    dataTimestamp
    createdAt
    updatedAt
  }
  timestamp
  underlyingPrice
  optionPrice
  bidPrice
  askPrice
  impliedVolatility
  delta
  gamma
  theta
  vega
  rho
  volume
  openInterest
  daysToExpiration
  intrinsicValue
  extrinsicValue
  metadata
  createdAt

  `;

  export const OptionsGreeksHistory = {

    /**
     * Create a new OptionsGreeksHistory record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created OptionsGreeksHistory or null.
     */

    /**
     * Create a new OptionsGreeksHistory record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created OptionsGreeksHistory or null.
     */
    async create(props: OptionsGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsGreeksHistoryType> {
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

          const CREATE_ONE_OPTIONSGREEKSHISTORY = gql`
              mutation createOneOptionsGreeksHistory($data: OptionsGreeksHistoryCreateInput!) {
                createOneOptionsGreeksHistory(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  underlyingPrice: props.underlyingPrice !== undefined ? props.underlyingPrice : undefined,
  optionPrice: props.optionPrice !== undefined ? props.optionPrice : undefined,
  bidPrice: props.bidPrice !== undefined ? props.bidPrice : undefined,
  askPrice: props.askPrice !== undefined ? props.askPrice : undefined,
  impliedVolatility: props.impliedVolatility !== undefined ? props.impliedVolatility : undefined,
  delta: props.delta !== undefined ? props.delta : undefined,
  gamma: props.gamma !== undefined ? props.gamma : undefined,
  theta: props.theta !== undefined ? props.theta : undefined,
  vega: props.vega !== undefined ? props.vega : undefined,
  rho: props.rho !== undefined ? props.rho : undefined,
  volume: props.volume !== undefined ? props.volume : undefined,
  openInterest: props.openInterest !== undefined ? props.openInterest : undefined,
  daysToExpiration: props.daysToExpiration !== undefined ? props.daysToExpiration : undefined,
  intrinsicValue: props.intrinsicValue !== undefined ? props.intrinsicValue : undefined,
  extrinsicValue: props.extrinsicValue !== undefined ? props.extrinsicValue : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  contract: props.contract ? 
    typeof props.contract === 'object' && Object.keys(props.contract).length === 1 && Object.keys(props.contract)[0] === 'id'
    ? { connect: {
        id: props.contract.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.contract.id !== undefined ? props.contract.id : undefined,
        symbol: props.contract.symbol !== undefined ? {
            equals: props.contract.symbol 
           } : undefined,
      },
      create: {
        symbol: props.contract.symbol !== undefined ? props.contract.symbol : undefined,
        contractSymbol: props.contract.contractSymbol !== undefined ? props.contract.contractSymbol : undefined,
        optionType: props.contract.optionType !== undefined ? props.contract.optionType : undefined,
        strikePrice: props.contract.strikePrice !== undefined ? props.contract.strikePrice : undefined,
        expirationDate: props.contract.expirationDate !== undefined ? props.contract.expirationDate : undefined,
        daysToExpiration: props.contract.daysToExpiration !== undefined ? props.contract.daysToExpiration : undefined,
        lastPrice: props.contract.lastPrice !== undefined ? props.contract.lastPrice : undefined,
        bidPrice: props.contract.bidPrice !== undefined ? props.contract.bidPrice : undefined,
        askPrice: props.contract.askPrice !== undefined ? props.contract.askPrice : undefined,
        midPrice: props.contract.midPrice !== undefined ? props.contract.midPrice : undefined,
        bidSize: props.contract.bidSize !== undefined ? props.contract.bidSize : undefined,
        askSize: props.contract.askSize !== undefined ? props.contract.askSize : undefined,
        volume: props.contract.volume !== undefined ? props.contract.volume : undefined,
        openInterest: props.contract.openInterest !== undefined ? props.contract.openInterest : undefined,
        impliedVolatility: props.contract.impliedVolatility !== undefined ? props.contract.impliedVolatility : undefined,
        delta: props.contract.delta !== undefined ? props.contract.delta : undefined,
        gamma: props.contract.gamma !== undefined ? props.contract.gamma : undefined,
        theta: props.contract.theta !== undefined ? props.contract.theta : undefined,
        vega: props.contract.vega !== undefined ? props.contract.vega : undefined,
        rho: props.contract.rho !== undefined ? props.contract.rho : undefined,
        inTheMoney: props.contract.inTheMoney !== undefined ? props.contract.inTheMoney : undefined,
        intrinsicValue: props.contract.intrinsicValue !== undefined ? props.contract.intrinsicValue : undefined,
        extrinsicValue: props.contract.extrinsicValue !== undefined ? props.contract.extrinsicValue : undefined,
        theoreticalPrice: props.contract.theoreticalPrice !== undefined ? props.contract.theoreticalPrice : undefined,
        underlyingPrice: props.contract.underlyingPrice !== undefined ? props.contract.underlyingPrice : undefined,
        metadata: props.contract.metadata !== undefined ? props.contract.metadata : undefined,
        dataTimestamp: props.contract.dataTimestamp !== undefined ? props.contract.dataTimestamp : undefined,
    positions: props.contract.positions ? 
      Array.isArray(props.contract.positions) && props.contract.positions.length > 0 &&  props.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.positions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.positions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId 
             } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          status: item.status !== undefined ? item.status : undefined,
          openingSide: item.openingSide !== undefined ? item.openingSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          entryPrice: item.entryPrice !== undefined ? item.entryPrice : undefined,
          entryCost: item.entryCost !== undefined ? item.entryCost : undefined,
          entryTime: item.entryTime !== undefined ? item.entryTime : undefined,
          exitPrice: item.exitPrice !== undefined ? item.exitPrice : undefined,
          exitValue: item.exitValue !== undefined ? item.exitValue : undefined,
          exitTime: item.exitTime !== undefined ? item.exitTime : undefined,
          currentPrice: item.currentPrice !== undefined ? item.currentPrice : undefined,
          currentValue: item.currentValue !== undefined ? item.currentValue : undefined,
          unrealizedPnL: item.unrealizedPnL !== undefined ? item.unrealizedPnL : undefined,
          unrealizedPnLPercent: item.unrealizedPnLPercent !== undefined ? item.unrealizedPnLPercent : undefined,
          realizedPnL: item.realizedPnL !== undefined ? item.realizedPnL : undefined,
          realizedPnLPercent: item.realizedPnLPercent !== undefined ? item.realizedPnLPercent : undefined,
          totalFees: item.totalFees !== undefined ? item.totalFees : undefined,
          currentDelta: item.currentDelta !== undefined ? item.currentDelta : undefined,
          currentGamma: item.currentGamma !== undefined ? item.currentGamma : undefined,
          currentTheta: item.currentTheta !== undefined ? item.currentTheta : undefined,
          currentVega: item.currentVega !== undefined ? item.currentVega : undefined,
          currentRho: item.currentRho !== undefined ? item.currentRho : undefined,
          currentImpliedVolatility: item.currentImpliedVolatility !== undefined ? item.currentImpliedVolatility : undefined,
          daysHeld: item.daysHeld !== undefined ? item.daysHeld : undefined,
          exitReason: item.exitReason !== undefined ? item.exitReason : undefined,
          strategyType: item.strategyType !== undefined ? item.strategyType : undefined,
          tradeId: item.tradeId !== undefined ? item.tradeId : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
          lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
          exitThresholds: item.exitThresholds !== undefined ? item.exitThresholds : undefined,
          linkedRollId: item.linkedRollId !== undefined ? item.linkedRollId : undefined,
      executions: item.executions ? 
        Array.isArray(item.executions) && item.executions.length > 0 &&  item.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.executions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                equals: item.alpacaAccountId 
               } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                equals: item.brokerOrderId 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
            executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
            quantity: item.quantity !== undefined ? item.quantity : undefined,
            executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
            executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
            orderType: item.orderType !== undefined ? item.orderType : undefined,
            limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
            stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
            timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
            venue: item.venue !== undefined ? item.venue : undefined,
            slippage: item.slippage !== undefined ? item.slippage : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      lifecycleEvents: item.lifecycleEvents ? 
        Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.lifecycleEvents.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
          },
          create: {
            fromState: item.fromState !== undefined ? item.fromState : undefined,
            toState: item.toState !== undefined ? item.toState : undefined,
            trigger: item.trigger !== undefined ? item.trigger : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    executions: props.contract.executions ? 
      Array.isArray(props.contract.executions) && props.contract.executions.length > 0 &&  props.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.executions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.executions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          positionId: item.positionId !== undefined ? {
              equals: item.positionId 
             } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId 
             } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId 
             } : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? {
              equals: item.brokerOrderId 
             } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
          executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
          executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
          fees: item.fees !== undefined ? item.fees : undefined,
          executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
          underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
          deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
          gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
          thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
          vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
          rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
          impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
          orderType: item.orderType !== undefined ? item.orderType : undefined,
          limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
          stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
          timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
          venue: item.venue !== undefined ? item.venue : undefined,
          slippage: item.slippage !== undefined ? item.slippage : undefined,
          notes: item.notes !== undefined ? item.notes : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
      position: item.position ? 
        typeof item.position === 'object' && Object.keys(item.position).length === 1 && Object.keys(item.position)[0] === 'id'
    ? { connect: {
            id: item.position.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.id !== undefined ? item.position.id : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                equals: item.position.alpacaAccountId 
               } : undefined,
            contractId: item.position.contractId !== undefined ? {
                equals: item.position.contractId 
               } : undefined,
            status: item.position.status !== undefined ? {
                equals: item.position.status 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? item.position.alpacaAccountId : undefined,
            status: item.position.status !== undefined ? item.position.status : undefined,
            openingSide: item.position.openingSide !== undefined ? item.position.openingSide : undefined,
            quantity: item.position.quantity !== undefined ? item.position.quantity : undefined,
            entryPrice: item.position.entryPrice !== undefined ? item.position.entryPrice : undefined,
            entryCost: item.position.entryCost !== undefined ? item.position.entryCost : undefined,
            entryTime: item.position.entryTime !== undefined ? item.position.entryTime : undefined,
            exitPrice: item.position.exitPrice !== undefined ? item.position.exitPrice : undefined,
            exitValue: item.position.exitValue !== undefined ? item.position.exitValue : undefined,
            exitTime: item.position.exitTime !== undefined ? item.position.exitTime : undefined,
            currentPrice: item.position.currentPrice !== undefined ? item.position.currentPrice : undefined,
            currentValue: item.position.currentValue !== undefined ? item.position.currentValue : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? item.position.unrealizedPnL : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? item.position.unrealizedPnLPercent : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? item.position.realizedPnL : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? item.position.realizedPnLPercent : undefined,
            totalFees: item.position.totalFees !== undefined ? item.position.totalFees : undefined,
            currentDelta: item.position.currentDelta !== undefined ? item.position.currentDelta : undefined,
            currentGamma: item.position.currentGamma !== undefined ? item.position.currentGamma : undefined,
            currentTheta: item.position.currentTheta !== undefined ? item.position.currentTheta : undefined,
            currentVega: item.position.currentVega !== undefined ? item.position.currentVega : undefined,
            currentRho: item.position.currentRho !== undefined ? item.position.currentRho : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? item.position.currentImpliedVolatility : undefined,
            daysHeld: item.position.daysHeld !== undefined ? item.position.daysHeld : undefined,
            exitReason: item.position.exitReason !== undefined ? item.position.exitReason : undefined,
            strategyType: item.position.strategyType !== undefined ? item.position.strategyType : undefined,
            tradeId: item.position.tradeId !== undefined ? item.position.tradeId : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? item.position.lifecycleState : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? item.position.linkedRollId : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
    }
  } : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_OPTIONSGREEKSHISTORY,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneOptionsGreeksHistory) {
            return response.data.createOneOptionsGreeksHistory;
          } else {
            return null as unknown as OptionsGreeksHistoryType;
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
            logger.error("Non-retryable constraint violation in createOneOptionsGreeksHistory", {
              operation: 'createOneOptionsGreeksHistory',
              model: 'OptionsGreeksHistory',
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
            logger.warn("Database connection error in createOneOptionsGreeksHistory, retrying...", {
              operation: 'createOneOptionsGreeksHistory',
              model: 'OptionsGreeksHistory',
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
              operation: 'createOneOptionsGreeksHistory',
              model: 'OptionsGreeksHistory',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneOptionsGreeksHistory',
              model: 'OptionsGreeksHistory',
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
   * Create multiple OptionsGreeksHistory records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of OptionsGreeksHistory objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: OptionsGreeksHistoryType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_OPTIONSGREEKSHISTORY = gql`
          mutation createManyOptionsGreeksHistory($data: [OptionsGreeksHistoryCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyOptionsGreeksHistory(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      contractId: prop.contractId !== undefined ? prop.contractId : undefined,
  timestamp: prop.timestamp !== undefined ? prop.timestamp : undefined,
  underlyingPrice: prop.underlyingPrice !== undefined ? prop.underlyingPrice : undefined,
  optionPrice: prop.optionPrice !== undefined ? prop.optionPrice : undefined,
  bidPrice: prop.bidPrice !== undefined ? prop.bidPrice : undefined,
  askPrice: prop.askPrice !== undefined ? prop.askPrice : undefined,
  impliedVolatility: prop.impliedVolatility !== undefined ? prop.impliedVolatility : undefined,
  delta: prop.delta !== undefined ? prop.delta : undefined,
  gamma: prop.gamma !== undefined ? prop.gamma : undefined,
  theta: prop.theta !== undefined ? prop.theta : undefined,
  vega: prop.vega !== undefined ? prop.vega : undefined,
  rho: prop.rho !== undefined ? prop.rho : undefined,
  volume: prop.volume !== undefined ? prop.volume : undefined,
  openInterest: prop.openInterest !== undefined ? prop.openInterest : undefined,
  daysToExpiration: prop.daysToExpiration !== undefined ? prop.daysToExpiration : undefined,
  intrinsicValue: prop.intrinsicValue !== undefined ? prop.intrinsicValue : undefined,
  extrinsicValue: prop.extrinsicValue !== undefined ? prop.extrinsicValue : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_OPTIONSGREEKSHISTORY,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyOptionsGreeksHistory) {
          return response.data.createManyOptionsGreeksHistory;
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
          logger.warn("Duplicate key in createManyOptionsGreeksHistory (expected during overlapping fetches)", {
            operation: 'createManyOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
          logger.warn("Database connection error in createManyOptionsGreeksHistory, retrying...", {
            operation: 'createManyOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
   * Update a single OptionsGreeksHistory record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated OptionsGreeksHistory or null.
   */
  async update(props: OptionsGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsGreeksHistoryType> {
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

        const UPDATE_ONE_OPTIONSGREEKSHISTORY = gql`
          mutation updateOneOptionsGreeksHistory($data: OptionsGreeksHistoryUpdateInput!, $where: OptionsGreeksHistoryWhereUniqueInput!) {
            updateOneOptionsGreeksHistory(data: $data, where: $where) {
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
  underlyingPrice: props.underlyingPrice !== undefined ? {
            set: props.underlyingPrice 
           } : undefined,
  optionPrice: props.optionPrice !== undefined ? {
            set: props.optionPrice 
           } : undefined,
  bidPrice: props.bidPrice !== undefined ? {
            set: props.bidPrice 
           } : undefined,
  askPrice: props.askPrice !== undefined ? {
            set: props.askPrice 
           } : undefined,
  impliedVolatility: props.impliedVolatility !== undefined ? {
            set: props.impliedVolatility 
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
  volume: props.volume !== undefined ? {
            set: props.volume 
           } : undefined,
  openInterest: props.openInterest !== undefined ? {
            set: props.openInterest 
           } : undefined,
  daysToExpiration: props.daysToExpiration !== undefined ? {
            set: props.daysToExpiration 
           } : undefined,
  intrinsicValue: props.intrinsicValue !== undefined ? {
            set: props.intrinsicValue 
           } : undefined,
  extrinsicValue: props.extrinsicValue !== undefined ? {
            set: props.extrinsicValue 
           } : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  contract: props.contract ? 
  typeof props.contract === 'object' && Object.keys(props.contract).length === 1 && (Object.keys(props.contract)[0] === 'id' || Object.keys(props.contract)[0] === 'symbol')
? {
  connect: {
    id: props.contract.id
  }
} : { upsert: {
      where: {
        id: props.contract.id !== undefined ? {
            equals: props.contract.id
          } : undefined,
        symbol: props.contract.symbol !== undefined ? {
            equals: props.contract.symbol
          } : undefined,
      },
      update: {
        id: props.contract.id !== undefined ? {
            set: props.contract.id
          } : undefined,
        symbol: props.contract.symbol !== undefined ? {
            set: props.contract.symbol
          } : undefined,
        contractSymbol: props.contract.contractSymbol !== undefined ? {
            set: props.contract.contractSymbol
          } : undefined,
        optionType: props.contract.optionType !== undefined ? {
            set: props.contract.optionType
          } : undefined,
        strikePrice: props.contract.strikePrice !== undefined ? {
            set: props.contract.strikePrice
          } : undefined,
        expirationDate: props.contract.expirationDate !== undefined ? {
            set: props.contract.expirationDate
          } : undefined,
        daysToExpiration: props.contract.daysToExpiration !== undefined ? {
            set: props.contract.daysToExpiration
          } : undefined,
        lastPrice: props.contract.lastPrice !== undefined ? {
            set: props.contract.lastPrice
          } : undefined,
        bidPrice: props.contract.bidPrice !== undefined ? {
            set: props.contract.bidPrice
          } : undefined,
        askPrice: props.contract.askPrice !== undefined ? {
            set: props.contract.askPrice
          } : undefined,
        midPrice: props.contract.midPrice !== undefined ? {
            set: props.contract.midPrice
          } : undefined,
        bidSize: props.contract.bidSize !== undefined ? {
            set: props.contract.bidSize
          } : undefined,
        askSize: props.contract.askSize !== undefined ? {
            set: props.contract.askSize
          } : undefined,
        volume: props.contract.volume !== undefined ? {
            set: props.contract.volume
          } : undefined,
        openInterest: props.contract.openInterest !== undefined ? {
            set: props.contract.openInterest
          } : undefined,
        impliedVolatility: props.contract.impliedVolatility !== undefined ? {
            set: props.contract.impliedVolatility
          } : undefined,
        delta: props.contract.delta !== undefined ? {
            set: props.contract.delta
          } : undefined,
        gamma: props.contract.gamma !== undefined ? {
            set: props.contract.gamma
          } : undefined,
        theta: props.contract.theta !== undefined ? {
            set: props.contract.theta
          } : undefined,
        vega: props.contract.vega !== undefined ? {
            set: props.contract.vega
          } : undefined,
        rho: props.contract.rho !== undefined ? {
            set: props.contract.rho
          } : undefined,
        inTheMoney: props.contract.inTheMoney !== undefined ? {
            set: props.contract.inTheMoney
          } : undefined,
        intrinsicValue: props.contract.intrinsicValue !== undefined ? {
            set: props.contract.intrinsicValue
          } : undefined,
        extrinsicValue: props.contract.extrinsicValue !== undefined ? {
            set: props.contract.extrinsicValue
          } : undefined,
        theoreticalPrice: props.contract.theoreticalPrice !== undefined ? {
            set: props.contract.theoreticalPrice
          } : undefined,
        underlyingPrice: props.contract.underlyingPrice !== undefined ? {
            set: props.contract.underlyingPrice
          } : undefined,
        metadata: props.contract.metadata !== undefined ? props.contract.metadata : undefined,
        dataTimestamp: props.contract.dataTimestamp !== undefined ? {
            set: props.contract.dataTimestamp
          } : undefined,
    positions: props.contract.positions ? 
    Array.isArray(props.contract.positions) && props.contract.positions.length > 0 && props.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.contract.positions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.contract.positions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId
            } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          tradeId: item.tradeId !== undefined ? {
              equals: item.tradeId
            } : undefined,
          linkedRollId: item.linkedRollId !== undefined ? {
              equals: item.linkedRollId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              set: item.alpacaAccountId
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          openingSide: item.openingSide !== undefined ? {
              set: item.openingSide
            } : undefined,
          quantity: item.quantity !== undefined ? {
              set: item.quantity
            } : undefined,
          entryPrice: item.entryPrice !== undefined ? {
              set: item.entryPrice
            } : undefined,
          entryCost: item.entryCost !== undefined ? {
              set: item.entryCost
            } : undefined,
          entryTime: item.entryTime !== undefined ? {
              set: item.entryTime
            } : undefined,
          exitPrice: item.exitPrice !== undefined ? {
              set: item.exitPrice
            } : undefined,
          exitValue: item.exitValue !== undefined ? {
              set: item.exitValue
            } : undefined,
          exitTime: item.exitTime !== undefined ? {
              set: item.exitTime
            } : undefined,
          currentPrice: item.currentPrice !== undefined ? {
              set: item.currentPrice
            } : undefined,
          currentValue: item.currentValue !== undefined ? {
              set: item.currentValue
            } : undefined,
          unrealizedPnL: item.unrealizedPnL !== undefined ? {
              set: item.unrealizedPnL
            } : undefined,
          unrealizedPnLPercent: item.unrealizedPnLPercent !== undefined ? {
              set: item.unrealizedPnLPercent
            } : undefined,
          realizedPnL: item.realizedPnL !== undefined ? {
              set: item.realizedPnL
            } : undefined,
          realizedPnLPercent: item.realizedPnLPercent !== undefined ? {
              set: item.realizedPnLPercent
            } : undefined,
          totalFees: item.totalFees !== undefined ? {
              set: item.totalFees
            } : undefined,
          currentDelta: item.currentDelta !== undefined ? {
              set: item.currentDelta
            } : undefined,
          currentGamma: item.currentGamma !== undefined ? {
              set: item.currentGamma
            } : undefined,
          currentTheta: item.currentTheta !== undefined ? {
              set: item.currentTheta
            } : undefined,
          currentVega: item.currentVega !== undefined ? {
              set: item.currentVega
            } : undefined,
          currentRho: item.currentRho !== undefined ? {
              set: item.currentRho
            } : undefined,
          currentImpliedVolatility: item.currentImpliedVolatility !== undefined ? {
              set: item.currentImpliedVolatility
            } : undefined,
          daysHeld: item.daysHeld !== undefined ? {
              set: item.daysHeld
            } : undefined,
          exitReason: item.exitReason !== undefined ? {
              set: item.exitReason
            } : undefined,
          strategyType: item.strategyType !== undefined ? {
              set: item.strategyType
            } : undefined,
          tradeId: item.tradeId !== undefined ? {
              set: item.tradeId
            } : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
          lifecycleState: item.lifecycleState !== undefined ? {
              set: item.lifecycleState
            } : undefined,
          exitThresholds: item.exitThresholds !== undefined ? item.exitThresholds : undefined,
          linkedRollId: item.linkedRollId !== undefined ? {
              set: item.linkedRollId
            } : undefined,
      executions: item.executions ? 
      Array.isArray(item.executions) && item.executions.length > 0 && item.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.executions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.executions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId
              } : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId
              } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                equals: item.alpacaAccountId
              } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                equals: item.brokerOrderId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                set: item.alpacaAccountId
              } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                set: item.brokerOrderId
              } : undefined,
            executionSide: item.executionSide !== undefined ? {
                set: item.executionSide
              } : undefined,
            quantity: item.quantity !== undefined ? {
                set: item.quantity
              } : undefined,
            executionPrice: item.executionPrice !== undefined ? {
                set: item.executionPrice
              } : undefined,
            executionValue: item.executionValue !== undefined ? {
                set: item.executionValue
              } : undefined,
            fees: item.fees !== undefined ? {
                set: item.fees
              } : undefined,
            executionTime: item.executionTime !== undefined ? {
                set: item.executionTime
              } : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? {
                set: item.underlyingPriceAtExecution
              } : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? {
                set: item.deltaAtExecution
              } : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? {
                set: item.gammaAtExecution
              } : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? {
                set: item.thetaAtExecution
              } : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? {
                set: item.vegaAtExecution
              } : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? {
                set: item.rhoAtExecution
              } : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? {
                set: item.impliedVolatilityAtExecution
              } : undefined,
            orderType: item.orderType !== undefined ? {
                set: item.orderType
              } : undefined,
            limitPrice: item.limitPrice !== undefined ? {
                set: item.limitPrice
              } : undefined,
            stopPrice: item.stopPrice !== undefined ? {
                set: item.stopPrice
              } : undefined,
            timeInForce: item.timeInForce !== undefined ? {
                set: item.timeInForce
              } : undefined,
            venue: item.venue !== undefined ? {
                set: item.venue
              } : undefined,
            slippage: item.slippage !== undefined ? {
                set: item.slippage
              } : undefined,
            notes: item.notes !== undefined ? {
                set: item.notes
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
            executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
            quantity: item.quantity !== undefined ? item.quantity : undefined,
            executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
            executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
            orderType: item.orderType !== undefined ? item.orderType : undefined,
            limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
            stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
            timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
            venue: item.venue !== undefined ? item.venue : undefined,
            slippage: item.slippage !== undefined ? item.slippage : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      lifecycleEvents: item.lifecycleEvents ? 
      Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 && item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.lifecycleEvents.map((item) => ({
        id: item.id
      }))
} : { upsert: item.lifecycleEvents.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            fromState: item.fromState !== undefined ? {
                set: item.fromState
              } : undefined,
            toState: item.toState !== undefined ? {
                set: item.toState
              } : undefined,
            trigger: item.trigger !== undefined ? {
                set: item.trigger
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            fromState: item.fromState !== undefined ? item.fromState : undefined,
            toState: item.toState !== undefined ? item.toState : undefined,
            trigger: item.trigger !== undefined ? item.trigger : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          status: item.status !== undefined ? item.status : undefined,
          openingSide: item.openingSide !== undefined ? item.openingSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          entryPrice: item.entryPrice !== undefined ? item.entryPrice : undefined,
          entryCost: item.entryCost !== undefined ? item.entryCost : undefined,
          entryTime: item.entryTime !== undefined ? item.entryTime : undefined,
          exitPrice: item.exitPrice !== undefined ? item.exitPrice : undefined,
          exitValue: item.exitValue !== undefined ? item.exitValue : undefined,
          exitTime: item.exitTime !== undefined ? item.exitTime : undefined,
          currentPrice: item.currentPrice !== undefined ? item.currentPrice : undefined,
          currentValue: item.currentValue !== undefined ? item.currentValue : undefined,
          unrealizedPnL: item.unrealizedPnL !== undefined ? item.unrealizedPnL : undefined,
          unrealizedPnLPercent: item.unrealizedPnLPercent !== undefined ? item.unrealizedPnLPercent : undefined,
          realizedPnL: item.realizedPnL !== undefined ? item.realizedPnL : undefined,
          realizedPnLPercent: item.realizedPnLPercent !== undefined ? item.realizedPnLPercent : undefined,
          totalFees: item.totalFees !== undefined ? item.totalFees : undefined,
          currentDelta: item.currentDelta !== undefined ? item.currentDelta : undefined,
          currentGamma: item.currentGamma !== undefined ? item.currentGamma : undefined,
          currentTheta: item.currentTheta !== undefined ? item.currentTheta : undefined,
          currentVega: item.currentVega !== undefined ? item.currentVega : undefined,
          currentRho: item.currentRho !== undefined ? item.currentRho : undefined,
          currentImpliedVolatility: item.currentImpliedVolatility !== undefined ? item.currentImpliedVolatility : undefined,
          daysHeld: item.daysHeld !== undefined ? item.daysHeld : undefined,
          exitReason: item.exitReason !== undefined ? item.exitReason : undefined,
          strategyType: item.strategyType !== undefined ? item.strategyType : undefined,
          tradeId: item.tradeId !== undefined ? item.tradeId : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
          lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
          exitThresholds: item.exitThresholds !== undefined ? item.exitThresholds : undefined,
          linkedRollId: item.linkedRollId !== undefined ? item.linkedRollId : undefined,
      executions: item.executions ? 
        Array.isArray(item.executions) && item.executions.length > 0 &&  item.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.executions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                equals: item.alpacaAccountId 
               } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                equals: item.brokerOrderId 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
            executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
            quantity: item.quantity !== undefined ? item.quantity : undefined,
            executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
            executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
            orderType: item.orderType !== undefined ? item.orderType : undefined,
            limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
            stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
            timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
            venue: item.venue !== undefined ? item.venue : undefined,
            slippage: item.slippage !== undefined ? item.slippage : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      lifecycleEvents: item.lifecycleEvents ? 
        Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.lifecycleEvents.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
          },
          create: {
            fromState: item.fromState !== undefined ? item.fromState : undefined,
            toState: item.toState !== undefined ? item.toState : undefined,
            trigger: item.trigger !== undefined ? item.trigger : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    executions: props.contract.executions ? 
    Array.isArray(props.contract.executions) && props.contract.executions.length > 0 && props.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.contract.executions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.contract.executions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          positionId: item.positionId !== undefined ? {
              equals: item.positionId
            } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId
            } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId
            } : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? {
              equals: item.brokerOrderId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              set: item.alpacaAccountId
            } : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? {
              set: item.brokerOrderId
            } : undefined,
          executionSide: item.executionSide !== undefined ? {
              set: item.executionSide
            } : undefined,
          quantity: item.quantity !== undefined ? {
              set: item.quantity
            } : undefined,
          executionPrice: item.executionPrice !== undefined ? {
              set: item.executionPrice
            } : undefined,
          executionValue: item.executionValue !== undefined ? {
              set: item.executionValue
            } : undefined,
          fees: item.fees !== undefined ? {
              set: item.fees
            } : undefined,
          executionTime: item.executionTime !== undefined ? {
              set: item.executionTime
            } : undefined,
          underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? {
              set: item.underlyingPriceAtExecution
            } : undefined,
          deltaAtExecution: item.deltaAtExecution !== undefined ? {
              set: item.deltaAtExecution
            } : undefined,
          gammaAtExecution: item.gammaAtExecution !== undefined ? {
              set: item.gammaAtExecution
            } : undefined,
          thetaAtExecution: item.thetaAtExecution !== undefined ? {
              set: item.thetaAtExecution
            } : undefined,
          vegaAtExecution: item.vegaAtExecution !== undefined ? {
              set: item.vegaAtExecution
            } : undefined,
          rhoAtExecution: item.rhoAtExecution !== undefined ? {
              set: item.rhoAtExecution
            } : undefined,
          impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? {
              set: item.impliedVolatilityAtExecution
            } : undefined,
          orderType: item.orderType !== undefined ? {
              set: item.orderType
            } : undefined,
          limitPrice: item.limitPrice !== undefined ? {
              set: item.limitPrice
            } : undefined,
          stopPrice: item.stopPrice !== undefined ? {
              set: item.stopPrice
            } : undefined,
          timeInForce: item.timeInForce !== undefined ? {
              set: item.timeInForce
            } : undefined,
          venue: item.venue !== undefined ? {
              set: item.venue
            } : undefined,
          slippage: item.slippage !== undefined ? {
              set: item.slippage
            } : undefined,
          notes: item.notes !== undefined ? {
              set: item.notes
            } : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
      position: item.position ? 
      typeof item.position === 'object' && Object.keys(item.position).length === 1 && (Object.keys(item.position)[0] === 'id' || Object.keys(item.position)[0] === 'symbol')
? {
      connect: {
        id: item.position.id
      }
} : { upsert: {
          where: {
            id: item.position.id !== undefined ? {
                equals: item.position.id
              } : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                equals: item.position.alpacaAccountId
              } : undefined,
            contractId: item.position.contractId !== undefined ? {
                equals: item.position.contractId
              } : undefined,
            status: item.position.status !== undefined ? {
                equals: item.position.status
              } : undefined,
            tradeId: item.position.tradeId !== undefined ? {
                equals: item.position.tradeId
              } : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? {
                equals: item.position.linkedRollId
              } : undefined,
          },
          update: {
            id: item.position.id !== undefined ? {
                set: item.position.id
              } : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                set: item.position.alpacaAccountId
              } : undefined,
            status: item.position.status !== undefined ? {
                set: item.position.status
              } : undefined,
            openingSide: item.position.openingSide !== undefined ? {
                set: item.position.openingSide
              } : undefined,
            quantity: item.position.quantity !== undefined ? {
                set: item.position.quantity
              } : undefined,
            entryPrice: item.position.entryPrice !== undefined ? {
                set: item.position.entryPrice
              } : undefined,
            entryCost: item.position.entryCost !== undefined ? {
                set: item.position.entryCost
              } : undefined,
            entryTime: item.position.entryTime !== undefined ? {
                set: item.position.entryTime
              } : undefined,
            exitPrice: item.position.exitPrice !== undefined ? {
                set: item.position.exitPrice
              } : undefined,
            exitValue: item.position.exitValue !== undefined ? {
                set: item.position.exitValue
              } : undefined,
            exitTime: item.position.exitTime !== undefined ? {
                set: item.position.exitTime
              } : undefined,
            currentPrice: item.position.currentPrice !== undefined ? {
                set: item.position.currentPrice
              } : undefined,
            currentValue: item.position.currentValue !== undefined ? {
                set: item.position.currentValue
              } : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? {
                set: item.position.unrealizedPnL
              } : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? {
                set: item.position.unrealizedPnLPercent
              } : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? {
                set: item.position.realizedPnL
              } : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? {
                set: item.position.realizedPnLPercent
              } : undefined,
            totalFees: item.position.totalFees !== undefined ? {
                set: item.position.totalFees
              } : undefined,
            currentDelta: item.position.currentDelta !== undefined ? {
                set: item.position.currentDelta
              } : undefined,
            currentGamma: item.position.currentGamma !== undefined ? {
                set: item.position.currentGamma
              } : undefined,
            currentTheta: item.position.currentTheta !== undefined ? {
                set: item.position.currentTheta
              } : undefined,
            currentVega: item.position.currentVega !== undefined ? {
                set: item.position.currentVega
              } : undefined,
            currentRho: item.position.currentRho !== undefined ? {
                set: item.position.currentRho
              } : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? {
                set: item.position.currentImpliedVolatility
              } : undefined,
            daysHeld: item.position.daysHeld !== undefined ? {
                set: item.position.daysHeld
              } : undefined,
            exitReason: item.position.exitReason !== undefined ? {
                set: item.position.exitReason
              } : undefined,
            strategyType: item.position.strategyType !== undefined ? {
                set: item.position.strategyType
              } : undefined,
            tradeId: item.position.tradeId !== undefined ? {
                set: item.position.tradeId
              } : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? {
                set: item.position.lifecycleState
              } : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? {
                set: item.position.linkedRollId
              } : undefined,
          },
          create: {
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? item.position.alpacaAccountId : undefined,
            status: item.position.status !== undefined ? item.position.status : undefined,
            openingSide: item.position.openingSide !== undefined ? item.position.openingSide : undefined,
            quantity: item.position.quantity !== undefined ? item.position.quantity : undefined,
            entryPrice: item.position.entryPrice !== undefined ? item.position.entryPrice : undefined,
            entryCost: item.position.entryCost !== undefined ? item.position.entryCost : undefined,
            entryTime: item.position.entryTime !== undefined ? item.position.entryTime : undefined,
            exitPrice: item.position.exitPrice !== undefined ? item.position.exitPrice : undefined,
            exitValue: item.position.exitValue !== undefined ? item.position.exitValue : undefined,
            exitTime: item.position.exitTime !== undefined ? item.position.exitTime : undefined,
            currentPrice: item.position.currentPrice !== undefined ? item.position.currentPrice : undefined,
            currentValue: item.position.currentValue !== undefined ? item.position.currentValue : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? item.position.unrealizedPnL : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? item.position.unrealizedPnLPercent : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? item.position.realizedPnL : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? item.position.realizedPnLPercent : undefined,
            totalFees: item.position.totalFees !== undefined ? item.position.totalFees : undefined,
            currentDelta: item.position.currentDelta !== undefined ? item.position.currentDelta : undefined,
            currentGamma: item.position.currentGamma !== undefined ? item.position.currentGamma : undefined,
            currentTheta: item.position.currentTheta !== undefined ? item.position.currentTheta : undefined,
            currentVega: item.position.currentVega !== undefined ? item.position.currentVega : undefined,
            currentRho: item.position.currentRho !== undefined ? item.position.currentRho : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? item.position.currentImpliedVolatility : undefined,
            daysHeld: item.position.daysHeld !== undefined ? item.position.daysHeld : undefined,
            exitReason: item.position.exitReason !== undefined ? item.position.exitReason : undefined,
            strategyType: item.position.strategyType !== undefined ? item.position.strategyType : undefined,
            tradeId: item.position.tradeId !== undefined ? item.position.tradeId : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? item.position.lifecycleState : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? item.position.linkedRollId : undefined,
          },
        }
      } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
          executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
          executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
          fees: item.fees !== undefined ? item.fees : undefined,
          executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
          underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
          deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
          gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
          thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
          vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
          rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
          impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
          orderType: item.orderType !== undefined ? item.orderType : undefined,
          limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
          stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
          timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
          venue: item.venue !== undefined ? item.venue : undefined,
          slippage: item.slippage !== undefined ? item.slippage : undefined,
          notes: item.notes !== undefined ? item.notes : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
      position: item.position ? 
        typeof item.position === 'object' && Object.keys(item.position).length === 1 && Object.keys(item.position)[0] === 'id'
    ? { connect: {
            id: item.position.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.id !== undefined ? item.position.id : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                equals: item.position.alpacaAccountId 
               } : undefined,
            contractId: item.position.contractId !== undefined ? {
                equals: item.position.contractId 
               } : undefined,
            status: item.position.status !== undefined ? {
                equals: item.position.status 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? item.position.alpacaAccountId : undefined,
            status: item.position.status !== undefined ? item.position.status : undefined,
            openingSide: item.position.openingSide !== undefined ? item.position.openingSide : undefined,
            quantity: item.position.quantity !== undefined ? item.position.quantity : undefined,
            entryPrice: item.position.entryPrice !== undefined ? item.position.entryPrice : undefined,
            entryCost: item.position.entryCost !== undefined ? item.position.entryCost : undefined,
            entryTime: item.position.entryTime !== undefined ? item.position.entryTime : undefined,
            exitPrice: item.position.exitPrice !== undefined ? item.position.exitPrice : undefined,
            exitValue: item.position.exitValue !== undefined ? item.position.exitValue : undefined,
            exitTime: item.position.exitTime !== undefined ? item.position.exitTime : undefined,
            currentPrice: item.position.currentPrice !== undefined ? item.position.currentPrice : undefined,
            currentValue: item.position.currentValue !== undefined ? item.position.currentValue : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? item.position.unrealizedPnL : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? item.position.unrealizedPnLPercent : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? item.position.realizedPnL : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? item.position.realizedPnLPercent : undefined,
            totalFees: item.position.totalFees !== undefined ? item.position.totalFees : undefined,
            currentDelta: item.position.currentDelta !== undefined ? item.position.currentDelta : undefined,
            currentGamma: item.position.currentGamma !== undefined ? item.position.currentGamma : undefined,
            currentTheta: item.position.currentTheta !== undefined ? item.position.currentTheta : undefined,
            currentVega: item.position.currentVega !== undefined ? item.position.currentVega : undefined,
            currentRho: item.position.currentRho !== undefined ? item.position.currentRho : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? item.position.currentImpliedVolatility : undefined,
            daysHeld: item.position.daysHeld !== undefined ? item.position.daysHeld : undefined,
            exitReason: item.position.exitReason !== undefined ? item.position.exitReason : undefined,
            strategyType: item.position.strategyType !== undefined ? item.position.strategyType : undefined,
            tradeId: item.position.tradeId !== undefined ? item.position.tradeId : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? item.position.lifecycleState : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? item.position.linkedRollId : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        symbol: props.contract.symbol !== undefined ? props.contract.symbol : undefined,
        contractSymbol: props.contract.contractSymbol !== undefined ? props.contract.contractSymbol : undefined,
        optionType: props.contract.optionType !== undefined ? props.contract.optionType : undefined,
        strikePrice: props.contract.strikePrice !== undefined ? props.contract.strikePrice : undefined,
        expirationDate: props.contract.expirationDate !== undefined ? props.contract.expirationDate : undefined,
        daysToExpiration: props.contract.daysToExpiration !== undefined ? props.contract.daysToExpiration : undefined,
        lastPrice: props.contract.lastPrice !== undefined ? props.contract.lastPrice : undefined,
        bidPrice: props.contract.bidPrice !== undefined ? props.contract.bidPrice : undefined,
        askPrice: props.contract.askPrice !== undefined ? props.contract.askPrice : undefined,
        midPrice: props.contract.midPrice !== undefined ? props.contract.midPrice : undefined,
        bidSize: props.contract.bidSize !== undefined ? props.contract.bidSize : undefined,
        askSize: props.contract.askSize !== undefined ? props.contract.askSize : undefined,
        volume: props.contract.volume !== undefined ? props.contract.volume : undefined,
        openInterest: props.contract.openInterest !== undefined ? props.contract.openInterest : undefined,
        impliedVolatility: props.contract.impliedVolatility !== undefined ? props.contract.impliedVolatility : undefined,
        delta: props.contract.delta !== undefined ? props.contract.delta : undefined,
        gamma: props.contract.gamma !== undefined ? props.contract.gamma : undefined,
        theta: props.contract.theta !== undefined ? props.contract.theta : undefined,
        vega: props.contract.vega !== undefined ? props.contract.vega : undefined,
        rho: props.contract.rho !== undefined ? props.contract.rho : undefined,
        inTheMoney: props.contract.inTheMoney !== undefined ? props.contract.inTheMoney : undefined,
        intrinsicValue: props.contract.intrinsicValue !== undefined ? props.contract.intrinsicValue : undefined,
        extrinsicValue: props.contract.extrinsicValue !== undefined ? props.contract.extrinsicValue : undefined,
        theoreticalPrice: props.contract.theoreticalPrice !== undefined ? props.contract.theoreticalPrice : undefined,
        underlyingPrice: props.contract.underlyingPrice !== undefined ? props.contract.underlyingPrice : undefined,
        metadata: props.contract.metadata !== undefined ? props.contract.metadata : undefined,
        dataTimestamp: props.contract.dataTimestamp !== undefined ? props.contract.dataTimestamp : undefined,
    positions: props.contract.positions ? 
      Array.isArray(props.contract.positions) && props.contract.positions.length > 0 &&  props.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.positions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.positions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId 
             } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          status: item.status !== undefined ? item.status : undefined,
          openingSide: item.openingSide !== undefined ? item.openingSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          entryPrice: item.entryPrice !== undefined ? item.entryPrice : undefined,
          entryCost: item.entryCost !== undefined ? item.entryCost : undefined,
          entryTime: item.entryTime !== undefined ? item.entryTime : undefined,
          exitPrice: item.exitPrice !== undefined ? item.exitPrice : undefined,
          exitValue: item.exitValue !== undefined ? item.exitValue : undefined,
          exitTime: item.exitTime !== undefined ? item.exitTime : undefined,
          currentPrice: item.currentPrice !== undefined ? item.currentPrice : undefined,
          currentValue: item.currentValue !== undefined ? item.currentValue : undefined,
          unrealizedPnL: item.unrealizedPnL !== undefined ? item.unrealizedPnL : undefined,
          unrealizedPnLPercent: item.unrealizedPnLPercent !== undefined ? item.unrealizedPnLPercent : undefined,
          realizedPnL: item.realizedPnL !== undefined ? item.realizedPnL : undefined,
          realizedPnLPercent: item.realizedPnLPercent !== undefined ? item.realizedPnLPercent : undefined,
          totalFees: item.totalFees !== undefined ? item.totalFees : undefined,
          currentDelta: item.currentDelta !== undefined ? item.currentDelta : undefined,
          currentGamma: item.currentGamma !== undefined ? item.currentGamma : undefined,
          currentTheta: item.currentTheta !== undefined ? item.currentTheta : undefined,
          currentVega: item.currentVega !== undefined ? item.currentVega : undefined,
          currentRho: item.currentRho !== undefined ? item.currentRho : undefined,
          currentImpliedVolatility: item.currentImpliedVolatility !== undefined ? item.currentImpliedVolatility : undefined,
          daysHeld: item.daysHeld !== undefined ? item.daysHeld : undefined,
          exitReason: item.exitReason !== undefined ? item.exitReason : undefined,
          strategyType: item.strategyType !== undefined ? item.strategyType : undefined,
          tradeId: item.tradeId !== undefined ? item.tradeId : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
          lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
          exitThresholds: item.exitThresholds !== undefined ? item.exitThresholds : undefined,
          linkedRollId: item.linkedRollId !== undefined ? item.linkedRollId : undefined,
      executions: item.executions ? 
        Array.isArray(item.executions) && item.executions.length > 0 &&  item.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.executions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                equals: item.alpacaAccountId 
               } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                equals: item.brokerOrderId 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
            executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
            quantity: item.quantity !== undefined ? item.quantity : undefined,
            executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
            executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
            orderType: item.orderType !== undefined ? item.orderType : undefined,
            limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
            stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
            timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
            venue: item.venue !== undefined ? item.venue : undefined,
            slippage: item.slippage !== undefined ? item.slippage : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      lifecycleEvents: item.lifecycleEvents ? 
        Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.lifecycleEvents.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
          },
          create: {
            fromState: item.fromState !== undefined ? item.fromState : undefined,
            toState: item.toState !== undefined ? item.toState : undefined,
            trigger: item.trigger !== undefined ? item.trigger : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    executions: props.contract.executions ? 
      Array.isArray(props.contract.executions) && props.contract.executions.length > 0 &&  props.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.executions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.executions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          positionId: item.positionId !== undefined ? {
              equals: item.positionId 
             } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId 
             } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId 
             } : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? {
              equals: item.brokerOrderId 
             } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
          executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
          executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
          fees: item.fees !== undefined ? item.fees : undefined,
          executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
          underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
          deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
          gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
          thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
          vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
          rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
          impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
          orderType: item.orderType !== undefined ? item.orderType : undefined,
          limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
          stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
          timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
          venue: item.venue !== undefined ? item.venue : undefined,
          slippage: item.slippage !== undefined ? item.slippage : undefined,
          notes: item.notes !== undefined ? item.notes : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
      position: item.position ? 
        typeof item.position === 'object' && Object.keys(item.position).length === 1 && Object.keys(item.position)[0] === 'id'
    ? { connect: {
            id: item.position.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.id !== undefined ? item.position.id : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                equals: item.position.alpacaAccountId 
               } : undefined,
            contractId: item.position.contractId !== undefined ? {
                equals: item.position.contractId 
               } : undefined,
            status: item.position.status !== undefined ? {
                equals: item.position.status 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? item.position.alpacaAccountId : undefined,
            status: item.position.status !== undefined ? item.position.status : undefined,
            openingSide: item.position.openingSide !== undefined ? item.position.openingSide : undefined,
            quantity: item.position.quantity !== undefined ? item.position.quantity : undefined,
            entryPrice: item.position.entryPrice !== undefined ? item.position.entryPrice : undefined,
            entryCost: item.position.entryCost !== undefined ? item.position.entryCost : undefined,
            entryTime: item.position.entryTime !== undefined ? item.position.entryTime : undefined,
            exitPrice: item.position.exitPrice !== undefined ? item.position.exitPrice : undefined,
            exitValue: item.position.exitValue !== undefined ? item.position.exitValue : undefined,
            exitTime: item.position.exitTime !== undefined ? item.position.exitTime : undefined,
            currentPrice: item.position.currentPrice !== undefined ? item.position.currentPrice : undefined,
            currentValue: item.position.currentValue !== undefined ? item.position.currentValue : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? item.position.unrealizedPnL : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? item.position.unrealizedPnLPercent : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? item.position.realizedPnL : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? item.position.realizedPnLPercent : undefined,
            totalFees: item.position.totalFees !== undefined ? item.position.totalFees : undefined,
            currentDelta: item.position.currentDelta !== undefined ? item.position.currentDelta : undefined,
            currentGamma: item.position.currentGamma !== undefined ? item.position.currentGamma : undefined,
            currentTheta: item.position.currentTheta !== undefined ? item.position.currentTheta : undefined,
            currentVega: item.position.currentVega !== undefined ? item.position.currentVega : undefined,
            currentRho: item.position.currentRho !== undefined ? item.position.currentRho : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? item.position.currentImpliedVolatility : undefined,
            daysHeld: item.position.daysHeld !== undefined ? item.position.daysHeld : undefined,
            exitReason: item.position.exitReason !== undefined ? item.position.exitReason : undefined,
            strategyType: item.position.strategyType !== undefined ? item.position.strategyType : undefined,
            tradeId: item.position.tradeId !== undefined ? item.position.tradeId : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? item.position.lifecycleState : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? item.position.linkedRollId : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
    }
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_OPTIONSGREEKSHISTORY,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneOptionsGreeksHistory) {
          return response.data.updateOneOptionsGreeksHistory;
        } else {
          return null as unknown as OptionsGreeksHistoryType;
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
          logger.error("Non-retryable constraint violation in updateOneOptionsGreeksHistory", {
            operation: 'updateOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
          logger.warn("Database connection error in updateOneOptionsGreeksHistory, retrying...", {
            operation: 'updateOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
            operation: 'updateOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
   * Upsert a single OptionsGreeksHistory record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated OptionsGreeksHistory or null.
   */
  async upsert(props: OptionsGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsGreeksHistoryType> {
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

        const UPSERT_ONE_OPTIONSGREEKSHISTORY = gql`
          mutation upsertOneOptionsGreeksHistory($where: OptionsGreeksHistoryWhereUniqueInput!, $create: OptionsGreeksHistoryCreateInput!, $update: OptionsGreeksHistoryUpdateInput!) {
            upsertOneOptionsGreeksHistory(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  contractId: props.contractId !== undefined ? {
    equals: props.contractId 
  } : undefined,
      },
          create: {
        timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  underlyingPrice: props.underlyingPrice !== undefined ? props.underlyingPrice : undefined,
  optionPrice: props.optionPrice !== undefined ? props.optionPrice : undefined,
  bidPrice: props.bidPrice !== undefined ? props.bidPrice : undefined,
  askPrice: props.askPrice !== undefined ? props.askPrice : undefined,
  impliedVolatility: props.impliedVolatility !== undefined ? props.impliedVolatility : undefined,
  delta: props.delta !== undefined ? props.delta : undefined,
  gamma: props.gamma !== undefined ? props.gamma : undefined,
  theta: props.theta !== undefined ? props.theta : undefined,
  vega: props.vega !== undefined ? props.vega : undefined,
  rho: props.rho !== undefined ? props.rho : undefined,
  volume: props.volume !== undefined ? props.volume : undefined,
  openInterest: props.openInterest !== undefined ? props.openInterest : undefined,
  daysToExpiration: props.daysToExpiration !== undefined ? props.daysToExpiration : undefined,
  intrinsicValue: props.intrinsicValue !== undefined ? props.intrinsicValue : undefined,
  extrinsicValue: props.extrinsicValue !== undefined ? props.extrinsicValue : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  contract: props.contract ? 
    typeof props.contract === 'object' && Object.keys(props.contract).length === 1 && Object.keys(props.contract)[0] === 'id'
    ? { connect: {
        id: props.contract.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.contract.id !== undefined ? props.contract.id : undefined,
        symbol: props.contract.symbol !== undefined ? {
            equals: props.contract.symbol 
           } : undefined,
      },
      create: {
        symbol: props.contract.symbol !== undefined ? props.contract.symbol : undefined,
        contractSymbol: props.contract.contractSymbol !== undefined ? props.contract.contractSymbol : undefined,
        optionType: props.contract.optionType !== undefined ? props.contract.optionType : undefined,
        strikePrice: props.contract.strikePrice !== undefined ? props.contract.strikePrice : undefined,
        expirationDate: props.contract.expirationDate !== undefined ? props.contract.expirationDate : undefined,
        daysToExpiration: props.contract.daysToExpiration !== undefined ? props.contract.daysToExpiration : undefined,
        lastPrice: props.contract.lastPrice !== undefined ? props.contract.lastPrice : undefined,
        bidPrice: props.contract.bidPrice !== undefined ? props.contract.bidPrice : undefined,
        askPrice: props.contract.askPrice !== undefined ? props.contract.askPrice : undefined,
        midPrice: props.contract.midPrice !== undefined ? props.contract.midPrice : undefined,
        bidSize: props.contract.bidSize !== undefined ? props.contract.bidSize : undefined,
        askSize: props.contract.askSize !== undefined ? props.contract.askSize : undefined,
        volume: props.contract.volume !== undefined ? props.contract.volume : undefined,
        openInterest: props.contract.openInterest !== undefined ? props.contract.openInterest : undefined,
        impliedVolatility: props.contract.impliedVolatility !== undefined ? props.contract.impliedVolatility : undefined,
        delta: props.contract.delta !== undefined ? props.contract.delta : undefined,
        gamma: props.contract.gamma !== undefined ? props.contract.gamma : undefined,
        theta: props.contract.theta !== undefined ? props.contract.theta : undefined,
        vega: props.contract.vega !== undefined ? props.contract.vega : undefined,
        rho: props.contract.rho !== undefined ? props.contract.rho : undefined,
        inTheMoney: props.contract.inTheMoney !== undefined ? props.contract.inTheMoney : undefined,
        intrinsicValue: props.contract.intrinsicValue !== undefined ? props.contract.intrinsicValue : undefined,
        extrinsicValue: props.contract.extrinsicValue !== undefined ? props.contract.extrinsicValue : undefined,
        theoreticalPrice: props.contract.theoreticalPrice !== undefined ? props.contract.theoreticalPrice : undefined,
        underlyingPrice: props.contract.underlyingPrice !== undefined ? props.contract.underlyingPrice : undefined,
        metadata: props.contract.metadata !== undefined ? props.contract.metadata : undefined,
        dataTimestamp: props.contract.dataTimestamp !== undefined ? props.contract.dataTimestamp : undefined,
    positions: props.contract.positions ? 
      Array.isArray(props.contract.positions) && props.contract.positions.length > 0 &&  props.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.positions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.positions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId 
             } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          status: item.status !== undefined ? item.status : undefined,
          openingSide: item.openingSide !== undefined ? item.openingSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          entryPrice: item.entryPrice !== undefined ? item.entryPrice : undefined,
          entryCost: item.entryCost !== undefined ? item.entryCost : undefined,
          entryTime: item.entryTime !== undefined ? item.entryTime : undefined,
          exitPrice: item.exitPrice !== undefined ? item.exitPrice : undefined,
          exitValue: item.exitValue !== undefined ? item.exitValue : undefined,
          exitTime: item.exitTime !== undefined ? item.exitTime : undefined,
          currentPrice: item.currentPrice !== undefined ? item.currentPrice : undefined,
          currentValue: item.currentValue !== undefined ? item.currentValue : undefined,
          unrealizedPnL: item.unrealizedPnL !== undefined ? item.unrealizedPnL : undefined,
          unrealizedPnLPercent: item.unrealizedPnLPercent !== undefined ? item.unrealizedPnLPercent : undefined,
          realizedPnL: item.realizedPnL !== undefined ? item.realizedPnL : undefined,
          realizedPnLPercent: item.realizedPnLPercent !== undefined ? item.realizedPnLPercent : undefined,
          totalFees: item.totalFees !== undefined ? item.totalFees : undefined,
          currentDelta: item.currentDelta !== undefined ? item.currentDelta : undefined,
          currentGamma: item.currentGamma !== undefined ? item.currentGamma : undefined,
          currentTheta: item.currentTheta !== undefined ? item.currentTheta : undefined,
          currentVega: item.currentVega !== undefined ? item.currentVega : undefined,
          currentRho: item.currentRho !== undefined ? item.currentRho : undefined,
          currentImpliedVolatility: item.currentImpliedVolatility !== undefined ? item.currentImpliedVolatility : undefined,
          daysHeld: item.daysHeld !== undefined ? item.daysHeld : undefined,
          exitReason: item.exitReason !== undefined ? item.exitReason : undefined,
          strategyType: item.strategyType !== undefined ? item.strategyType : undefined,
          tradeId: item.tradeId !== undefined ? item.tradeId : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
          lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
          exitThresholds: item.exitThresholds !== undefined ? item.exitThresholds : undefined,
          linkedRollId: item.linkedRollId !== undefined ? item.linkedRollId : undefined,
      executions: item.executions ? 
        Array.isArray(item.executions) && item.executions.length > 0 &&  item.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.executions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                equals: item.alpacaAccountId 
               } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                equals: item.brokerOrderId 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
            executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
            quantity: item.quantity !== undefined ? item.quantity : undefined,
            executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
            executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
            orderType: item.orderType !== undefined ? item.orderType : undefined,
            limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
            stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
            timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
            venue: item.venue !== undefined ? item.venue : undefined,
            slippage: item.slippage !== undefined ? item.slippage : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      lifecycleEvents: item.lifecycleEvents ? 
        Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.lifecycleEvents.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
          },
          create: {
            fromState: item.fromState !== undefined ? item.fromState : undefined,
            toState: item.toState !== undefined ? item.toState : undefined,
            trigger: item.trigger !== undefined ? item.trigger : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    executions: props.contract.executions ? 
      Array.isArray(props.contract.executions) && props.contract.executions.length > 0 &&  props.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.executions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.executions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          positionId: item.positionId !== undefined ? {
              equals: item.positionId 
             } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId 
             } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId 
             } : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? {
              equals: item.brokerOrderId 
             } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
          executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
          executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
          fees: item.fees !== undefined ? item.fees : undefined,
          executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
          underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
          deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
          gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
          thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
          vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
          rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
          impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
          orderType: item.orderType !== undefined ? item.orderType : undefined,
          limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
          stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
          timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
          venue: item.venue !== undefined ? item.venue : undefined,
          slippage: item.slippage !== undefined ? item.slippage : undefined,
          notes: item.notes !== undefined ? item.notes : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
      position: item.position ? 
        typeof item.position === 'object' && Object.keys(item.position).length === 1 && Object.keys(item.position)[0] === 'id'
    ? { connect: {
            id: item.position.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.id !== undefined ? item.position.id : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                equals: item.position.alpacaAccountId 
               } : undefined,
            contractId: item.position.contractId !== undefined ? {
                equals: item.position.contractId 
               } : undefined,
            status: item.position.status !== undefined ? {
                equals: item.position.status 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? item.position.alpacaAccountId : undefined,
            status: item.position.status !== undefined ? item.position.status : undefined,
            openingSide: item.position.openingSide !== undefined ? item.position.openingSide : undefined,
            quantity: item.position.quantity !== undefined ? item.position.quantity : undefined,
            entryPrice: item.position.entryPrice !== undefined ? item.position.entryPrice : undefined,
            entryCost: item.position.entryCost !== undefined ? item.position.entryCost : undefined,
            entryTime: item.position.entryTime !== undefined ? item.position.entryTime : undefined,
            exitPrice: item.position.exitPrice !== undefined ? item.position.exitPrice : undefined,
            exitValue: item.position.exitValue !== undefined ? item.position.exitValue : undefined,
            exitTime: item.position.exitTime !== undefined ? item.position.exitTime : undefined,
            currentPrice: item.position.currentPrice !== undefined ? item.position.currentPrice : undefined,
            currentValue: item.position.currentValue !== undefined ? item.position.currentValue : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? item.position.unrealizedPnL : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? item.position.unrealizedPnLPercent : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? item.position.realizedPnL : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? item.position.realizedPnLPercent : undefined,
            totalFees: item.position.totalFees !== undefined ? item.position.totalFees : undefined,
            currentDelta: item.position.currentDelta !== undefined ? item.position.currentDelta : undefined,
            currentGamma: item.position.currentGamma !== undefined ? item.position.currentGamma : undefined,
            currentTheta: item.position.currentTheta !== undefined ? item.position.currentTheta : undefined,
            currentVega: item.position.currentVega !== undefined ? item.position.currentVega : undefined,
            currentRho: item.position.currentRho !== undefined ? item.position.currentRho : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? item.position.currentImpliedVolatility : undefined,
            daysHeld: item.position.daysHeld !== undefined ? item.position.daysHeld : undefined,
            exitReason: item.position.exitReason !== undefined ? item.position.exitReason : undefined,
            strategyType: item.position.strategyType !== undefined ? item.position.strategyType : undefined,
            tradeId: item.position.tradeId !== undefined ? item.position.tradeId : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? item.position.lifecycleState : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? item.position.linkedRollId : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
    }
  } : undefined,
      },
          update: {
      timestamp: props.timestamp !== undefined ? {
            set: props.timestamp 
           } : undefined,
  underlyingPrice: props.underlyingPrice !== undefined ? {
            set: props.underlyingPrice 
           } : undefined,
  optionPrice: props.optionPrice !== undefined ? {
            set: props.optionPrice 
           } : undefined,
  bidPrice: props.bidPrice !== undefined ? {
            set: props.bidPrice 
           } : undefined,
  askPrice: props.askPrice !== undefined ? {
            set: props.askPrice 
           } : undefined,
  impliedVolatility: props.impliedVolatility !== undefined ? {
            set: props.impliedVolatility 
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
  volume: props.volume !== undefined ? {
            set: props.volume 
           } : undefined,
  openInterest: props.openInterest !== undefined ? {
            set: props.openInterest 
           } : undefined,
  daysToExpiration: props.daysToExpiration !== undefined ? {
            set: props.daysToExpiration 
           } : undefined,
  intrinsicValue: props.intrinsicValue !== undefined ? {
            set: props.intrinsicValue 
           } : undefined,
  extrinsicValue: props.extrinsicValue !== undefined ? {
            set: props.extrinsicValue 
           } : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  contract: props.contract ? 
  typeof props.contract === 'object' && Object.keys(props.contract).length === 1 && (Object.keys(props.contract)[0] === 'id' || Object.keys(props.contract)[0] === 'symbol')
? {
  connect: {
    id: props.contract.id
  }
} : { upsert: {
      where: {
        id: props.contract.id !== undefined ? {
            equals: props.contract.id
          } : undefined,
        symbol: props.contract.symbol !== undefined ? {
            equals: props.contract.symbol
          } : undefined,
      },
      update: {
        id: props.contract.id !== undefined ? {
            set: props.contract.id
          } : undefined,
        symbol: props.contract.symbol !== undefined ? {
            set: props.contract.symbol
          } : undefined,
        contractSymbol: props.contract.contractSymbol !== undefined ? {
            set: props.contract.contractSymbol
          } : undefined,
        optionType: props.contract.optionType !== undefined ? {
            set: props.contract.optionType
          } : undefined,
        strikePrice: props.contract.strikePrice !== undefined ? {
            set: props.contract.strikePrice
          } : undefined,
        expirationDate: props.contract.expirationDate !== undefined ? {
            set: props.contract.expirationDate
          } : undefined,
        daysToExpiration: props.contract.daysToExpiration !== undefined ? {
            set: props.contract.daysToExpiration
          } : undefined,
        lastPrice: props.contract.lastPrice !== undefined ? {
            set: props.contract.lastPrice
          } : undefined,
        bidPrice: props.contract.bidPrice !== undefined ? {
            set: props.contract.bidPrice
          } : undefined,
        askPrice: props.contract.askPrice !== undefined ? {
            set: props.contract.askPrice
          } : undefined,
        midPrice: props.contract.midPrice !== undefined ? {
            set: props.contract.midPrice
          } : undefined,
        bidSize: props.contract.bidSize !== undefined ? {
            set: props.contract.bidSize
          } : undefined,
        askSize: props.contract.askSize !== undefined ? {
            set: props.contract.askSize
          } : undefined,
        volume: props.contract.volume !== undefined ? {
            set: props.contract.volume
          } : undefined,
        openInterest: props.contract.openInterest !== undefined ? {
            set: props.contract.openInterest
          } : undefined,
        impliedVolatility: props.contract.impliedVolatility !== undefined ? {
            set: props.contract.impliedVolatility
          } : undefined,
        delta: props.contract.delta !== undefined ? {
            set: props.contract.delta
          } : undefined,
        gamma: props.contract.gamma !== undefined ? {
            set: props.contract.gamma
          } : undefined,
        theta: props.contract.theta !== undefined ? {
            set: props.contract.theta
          } : undefined,
        vega: props.contract.vega !== undefined ? {
            set: props.contract.vega
          } : undefined,
        rho: props.contract.rho !== undefined ? {
            set: props.contract.rho
          } : undefined,
        inTheMoney: props.contract.inTheMoney !== undefined ? {
            set: props.contract.inTheMoney
          } : undefined,
        intrinsicValue: props.contract.intrinsicValue !== undefined ? {
            set: props.contract.intrinsicValue
          } : undefined,
        extrinsicValue: props.contract.extrinsicValue !== undefined ? {
            set: props.contract.extrinsicValue
          } : undefined,
        theoreticalPrice: props.contract.theoreticalPrice !== undefined ? {
            set: props.contract.theoreticalPrice
          } : undefined,
        underlyingPrice: props.contract.underlyingPrice !== undefined ? {
            set: props.contract.underlyingPrice
          } : undefined,
        metadata: props.contract.metadata !== undefined ? props.contract.metadata : undefined,
        dataTimestamp: props.contract.dataTimestamp !== undefined ? {
            set: props.contract.dataTimestamp
          } : undefined,
    positions: props.contract.positions ? 
    Array.isArray(props.contract.positions) && props.contract.positions.length > 0 && props.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.contract.positions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.contract.positions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId
            } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          tradeId: item.tradeId !== undefined ? {
              equals: item.tradeId
            } : undefined,
          linkedRollId: item.linkedRollId !== undefined ? {
              equals: item.linkedRollId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              set: item.alpacaAccountId
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          openingSide: item.openingSide !== undefined ? {
              set: item.openingSide
            } : undefined,
          quantity: item.quantity !== undefined ? {
              set: item.quantity
            } : undefined,
          entryPrice: item.entryPrice !== undefined ? {
              set: item.entryPrice
            } : undefined,
          entryCost: item.entryCost !== undefined ? {
              set: item.entryCost
            } : undefined,
          entryTime: item.entryTime !== undefined ? {
              set: item.entryTime
            } : undefined,
          exitPrice: item.exitPrice !== undefined ? {
              set: item.exitPrice
            } : undefined,
          exitValue: item.exitValue !== undefined ? {
              set: item.exitValue
            } : undefined,
          exitTime: item.exitTime !== undefined ? {
              set: item.exitTime
            } : undefined,
          currentPrice: item.currentPrice !== undefined ? {
              set: item.currentPrice
            } : undefined,
          currentValue: item.currentValue !== undefined ? {
              set: item.currentValue
            } : undefined,
          unrealizedPnL: item.unrealizedPnL !== undefined ? {
              set: item.unrealizedPnL
            } : undefined,
          unrealizedPnLPercent: item.unrealizedPnLPercent !== undefined ? {
              set: item.unrealizedPnLPercent
            } : undefined,
          realizedPnL: item.realizedPnL !== undefined ? {
              set: item.realizedPnL
            } : undefined,
          realizedPnLPercent: item.realizedPnLPercent !== undefined ? {
              set: item.realizedPnLPercent
            } : undefined,
          totalFees: item.totalFees !== undefined ? {
              set: item.totalFees
            } : undefined,
          currentDelta: item.currentDelta !== undefined ? {
              set: item.currentDelta
            } : undefined,
          currentGamma: item.currentGamma !== undefined ? {
              set: item.currentGamma
            } : undefined,
          currentTheta: item.currentTheta !== undefined ? {
              set: item.currentTheta
            } : undefined,
          currentVega: item.currentVega !== undefined ? {
              set: item.currentVega
            } : undefined,
          currentRho: item.currentRho !== undefined ? {
              set: item.currentRho
            } : undefined,
          currentImpliedVolatility: item.currentImpliedVolatility !== undefined ? {
              set: item.currentImpliedVolatility
            } : undefined,
          daysHeld: item.daysHeld !== undefined ? {
              set: item.daysHeld
            } : undefined,
          exitReason: item.exitReason !== undefined ? {
              set: item.exitReason
            } : undefined,
          strategyType: item.strategyType !== undefined ? {
              set: item.strategyType
            } : undefined,
          tradeId: item.tradeId !== undefined ? {
              set: item.tradeId
            } : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
          lifecycleState: item.lifecycleState !== undefined ? {
              set: item.lifecycleState
            } : undefined,
          exitThresholds: item.exitThresholds !== undefined ? item.exitThresholds : undefined,
          linkedRollId: item.linkedRollId !== undefined ? {
              set: item.linkedRollId
            } : undefined,
      executions: item.executions ? 
      Array.isArray(item.executions) && item.executions.length > 0 && item.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.executions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.executions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId
              } : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId
              } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                equals: item.alpacaAccountId
              } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                equals: item.brokerOrderId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                set: item.alpacaAccountId
              } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                set: item.brokerOrderId
              } : undefined,
            executionSide: item.executionSide !== undefined ? {
                set: item.executionSide
              } : undefined,
            quantity: item.quantity !== undefined ? {
                set: item.quantity
              } : undefined,
            executionPrice: item.executionPrice !== undefined ? {
                set: item.executionPrice
              } : undefined,
            executionValue: item.executionValue !== undefined ? {
                set: item.executionValue
              } : undefined,
            fees: item.fees !== undefined ? {
                set: item.fees
              } : undefined,
            executionTime: item.executionTime !== undefined ? {
                set: item.executionTime
              } : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? {
                set: item.underlyingPriceAtExecution
              } : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? {
                set: item.deltaAtExecution
              } : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? {
                set: item.gammaAtExecution
              } : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? {
                set: item.thetaAtExecution
              } : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? {
                set: item.vegaAtExecution
              } : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? {
                set: item.rhoAtExecution
              } : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? {
                set: item.impliedVolatilityAtExecution
              } : undefined,
            orderType: item.orderType !== undefined ? {
                set: item.orderType
              } : undefined,
            limitPrice: item.limitPrice !== undefined ? {
                set: item.limitPrice
              } : undefined,
            stopPrice: item.stopPrice !== undefined ? {
                set: item.stopPrice
              } : undefined,
            timeInForce: item.timeInForce !== undefined ? {
                set: item.timeInForce
              } : undefined,
            venue: item.venue !== undefined ? {
                set: item.venue
              } : undefined,
            slippage: item.slippage !== undefined ? {
                set: item.slippage
              } : undefined,
            notes: item.notes !== undefined ? {
                set: item.notes
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
            executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
            quantity: item.quantity !== undefined ? item.quantity : undefined,
            executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
            executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
            orderType: item.orderType !== undefined ? item.orderType : undefined,
            limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
            stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
            timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
            venue: item.venue !== undefined ? item.venue : undefined,
            slippage: item.slippage !== undefined ? item.slippage : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      lifecycleEvents: item.lifecycleEvents ? 
      Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 && item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.lifecycleEvents.map((item) => ({
        id: item.id
      }))
} : { upsert: item.lifecycleEvents.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            fromState: item.fromState !== undefined ? {
                set: item.fromState
              } : undefined,
            toState: item.toState !== undefined ? {
                set: item.toState
              } : undefined,
            trigger: item.trigger !== undefined ? {
                set: item.trigger
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            fromState: item.fromState !== undefined ? item.fromState : undefined,
            toState: item.toState !== undefined ? item.toState : undefined,
            trigger: item.trigger !== undefined ? item.trigger : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          status: item.status !== undefined ? item.status : undefined,
          openingSide: item.openingSide !== undefined ? item.openingSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          entryPrice: item.entryPrice !== undefined ? item.entryPrice : undefined,
          entryCost: item.entryCost !== undefined ? item.entryCost : undefined,
          entryTime: item.entryTime !== undefined ? item.entryTime : undefined,
          exitPrice: item.exitPrice !== undefined ? item.exitPrice : undefined,
          exitValue: item.exitValue !== undefined ? item.exitValue : undefined,
          exitTime: item.exitTime !== undefined ? item.exitTime : undefined,
          currentPrice: item.currentPrice !== undefined ? item.currentPrice : undefined,
          currentValue: item.currentValue !== undefined ? item.currentValue : undefined,
          unrealizedPnL: item.unrealizedPnL !== undefined ? item.unrealizedPnL : undefined,
          unrealizedPnLPercent: item.unrealizedPnLPercent !== undefined ? item.unrealizedPnLPercent : undefined,
          realizedPnL: item.realizedPnL !== undefined ? item.realizedPnL : undefined,
          realizedPnLPercent: item.realizedPnLPercent !== undefined ? item.realizedPnLPercent : undefined,
          totalFees: item.totalFees !== undefined ? item.totalFees : undefined,
          currentDelta: item.currentDelta !== undefined ? item.currentDelta : undefined,
          currentGamma: item.currentGamma !== undefined ? item.currentGamma : undefined,
          currentTheta: item.currentTheta !== undefined ? item.currentTheta : undefined,
          currentVega: item.currentVega !== undefined ? item.currentVega : undefined,
          currentRho: item.currentRho !== undefined ? item.currentRho : undefined,
          currentImpliedVolatility: item.currentImpliedVolatility !== undefined ? item.currentImpliedVolatility : undefined,
          daysHeld: item.daysHeld !== undefined ? item.daysHeld : undefined,
          exitReason: item.exitReason !== undefined ? item.exitReason : undefined,
          strategyType: item.strategyType !== undefined ? item.strategyType : undefined,
          tradeId: item.tradeId !== undefined ? item.tradeId : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
          lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
          exitThresholds: item.exitThresholds !== undefined ? item.exitThresholds : undefined,
          linkedRollId: item.linkedRollId !== undefined ? item.linkedRollId : undefined,
      executions: item.executions ? 
        Array.isArray(item.executions) && item.executions.length > 0 &&  item.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.executions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                equals: item.alpacaAccountId 
               } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                equals: item.brokerOrderId 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
            executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
            quantity: item.quantity !== undefined ? item.quantity : undefined,
            executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
            executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
            orderType: item.orderType !== undefined ? item.orderType : undefined,
            limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
            stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
            timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
            venue: item.venue !== undefined ? item.venue : undefined,
            slippage: item.slippage !== undefined ? item.slippage : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      lifecycleEvents: item.lifecycleEvents ? 
        Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.lifecycleEvents.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
          },
          create: {
            fromState: item.fromState !== undefined ? item.fromState : undefined,
            toState: item.toState !== undefined ? item.toState : undefined,
            trigger: item.trigger !== undefined ? item.trigger : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    executions: props.contract.executions ? 
    Array.isArray(props.contract.executions) && props.contract.executions.length > 0 && props.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.contract.executions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.contract.executions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          positionId: item.positionId !== undefined ? {
              equals: item.positionId
            } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId
            } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId
            } : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? {
              equals: item.brokerOrderId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              set: item.alpacaAccountId
            } : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? {
              set: item.brokerOrderId
            } : undefined,
          executionSide: item.executionSide !== undefined ? {
              set: item.executionSide
            } : undefined,
          quantity: item.quantity !== undefined ? {
              set: item.quantity
            } : undefined,
          executionPrice: item.executionPrice !== undefined ? {
              set: item.executionPrice
            } : undefined,
          executionValue: item.executionValue !== undefined ? {
              set: item.executionValue
            } : undefined,
          fees: item.fees !== undefined ? {
              set: item.fees
            } : undefined,
          executionTime: item.executionTime !== undefined ? {
              set: item.executionTime
            } : undefined,
          underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? {
              set: item.underlyingPriceAtExecution
            } : undefined,
          deltaAtExecution: item.deltaAtExecution !== undefined ? {
              set: item.deltaAtExecution
            } : undefined,
          gammaAtExecution: item.gammaAtExecution !== undefined ? {
              set: item.gammaAtExecution
            } : undefined,
          thetaAtExecution: item.thetaAtExecution !== undefined ? {
              set: item.thetaAtExecution
            } : undefined,
          vegaAtExecution: item.vegaAtExecution !== undefined ? {
              set: item.vegaAtExecution
            } : undefined,
          rhoAtExecution: item.rhoAtExecution !== undefined ? {
              set: item.rhoAtExecution
            } : undefined,
          impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? {
              set: item.impliedVolatilityAtExecution
            } : undefined,
          orderType: item.orderType !== undefined ? {
              set: item.orderType
            } : undefined,
          limitPrice: item.limitPrice !== undefined ? {
              set: item.limitPrice
            } : undefined,
          stopPrice: item.stopPrice !== undefined ? {
              set: item.stopPrice
            } : undefined,
          timeInForce: item.timeInForce !== undefined ? {
              set: item.timeInForce
            } : undefined,
          venue: item.venue !== undefined ? {
              set: item.venue
            } : undefined,
          slippage: item.slippage !== undefined ? {
              set: item.slippage
            } : undefined,
          notes: item.notes !== undefined ? {
              set: item.notes
            } : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
      position: item.position ? 
      typeof item.position === 'object' && Object.keys(item.position).length === 1 && (Object.keys(item.position)[0] === 'id' || Object.keys(item.position)[0] === 'symbol')
? {
      connect: {
        id: item.position.id
      }
} : { upsert: {
          where: {
            id: item.position.id !== undefined ? {
                equals: item.position.id
              } : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                equals: item.position.alpacaAccountId
              } : undefined,
            contractId: item.position.contractId !== undefined ? {
                equals: item.position.contractId
              } : undefined,
            status: item.position.status !== undefined ? {
                equals: item.position.status
              } : undefined,
            tradeId: item.position.tradeId !== undefined ? {
                equals: item.position.tradeId
              } : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? {
                equals: item.position.linkedRollId
              } : undefined,
          },
          update: {
            id: item.position.id !== undefined ? {
                set: item.position.id
              } : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                set: item.position.alpacaAccountId
              } : undefined,
            status: item.position.status !== undefined ? {
                set: item.position.status
              } : undefined,
            openingSide: item.position.openingSide !== undefined ? {
                set: item.position.openingSide
              } : undefined,
            quantity: item.position.quantity !== undefined ? {
                set: item.position.quantity
              } : undefined,
            entryPrice: item.position.entryPrice !== undefined ? {
                set: item.position.entryPrice
              } : undefined,
            entryCost: item.position.entryCost !== undefined ? {
                set: item.position.entryCost
              } : undefined,
            entryTime: item.position.entryTime !== undefined ? {
                set: item.position.entryTime
              } : undefined,
            exitPrice: item.position.exitPrice !== undefined ? {
                set: item.position.exitPrice
              } : undefined,
            exitValue: item.position.exitValue !== undefined ? {
                set: item.position.exitValue
              } : undefined,
            exitTime: item.position.exitTime !== undefined ? {
                set: item.position.exitTime
              } : undefined,
            currentPrice: item.position.currentPrice !== undefined ? {
                set: item.position.currentPrice
              } : undefined,
            currentValue: item.position.currentValue !== undefined ? {
                set: item.position.currentValue
              } : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? {
                set: item.position.unrealizedPnL
              } : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? {
                set: item.position.unrealizedPnLPercent
              } : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? {
                set: item.position.realizedPnL
              } : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? {
                set: item.position.realizedPnLPercent
              } : undefined,
            totalFees: item.position.totalFees !== undefined ? {
                set: item.position.totalFees
              } : undefined,
            currentDelta: item.position.currentDelta !== undefined ? {
                set: item.position.currentDelta
              } : undefined,
            currentGamma: item.position.currentGamma !== undefined ? {
                set: item.position.currentGamma
              } : undefined,
            currentTheta: item.position.currentTheta !== undefined ? {
                set: item.position.currentTheta
              } : undefined,
            currentVega: item.position.currentVega !== undefined ? {
                set: item.position.currentVega
              } : undefined,
            currentRho: item.position.currentRho !== undefined ? {
                set: item.position.currentRho
              } : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? {
                set: item.position.currentImpliedVolatility
              } : undefined,
            daysHeld: item.position.daysHeld !== undefined ? {
                set: item.position.daysHeld
              } : undefined,
            exitReason: item.position.exitReason !== undefined ? {
                set: item.position.exitReason
              } : undefined,
            strategyType: item.position.strategyType !== undefined ? {
                set: item.position.strategyType
              } : undefined,
            tradeId: item.position.tradeId !== undefined ? {
                set: item.position.tradeId
              } : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? {
                set: item.position.lifecycleState
              } : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? {
                set: item.position.linkedRollId
              } : undefined,
          },
          create: {
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? item.position.alpacaAccountId : undefined,
            status: item.position.status !== undefined ? item.position.status : undefined,
            openingSide: item.position.openingSide !== undefined ? item.position.openingSide : undefined,
            quantity: item.position.quantity !== undefined ? item.position.quantity : undefined,
            entryPrice: item.position.entryPrice !== undefined ? item.position.entryPrice : undefined,
            entryCost: item.position.entryCost !== undefined ? item.position.entryCost : undefined,
            entryTime: item.position.entryTime !== undefined ? item.position.entryTime : undefined,
            exitPrice: item.position.exitPrice !== undefined ? item.position.exitPrice : undefined,
            exitValue: item.position.exitValue !== undefined ? item.position.exitValue : undefined,
            exitTime: item.position.exitTime !== undefined ? item.position.exitTime : undefined,
            currentPrice: item.position.currentPrice !== undefined ? item.position.currentPrice : undefined,
            currentValue: item.position.currentValue !== undefined ? item.position.currentValue : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? item.position.unrealizedPnL : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? item.position.unrealizedPnLPercent : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? item.position.realizedPnL : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? item.position.realizedPnLPercent : undefined,
            totalFees: item.position.totalFees !== undefined ? item.position.totalFees : undefined,
            currentDelta: item.position.currentDelta !== undefined ? item.position.currentDelta : undefined,
            currentGamma: item.position.currentGamma !== undefined ? item.position.currentGamma : undefined,
            currentTheta: item.position.currentTheta !== undefined ? item.position.currentTheta : undefined,
            currentVega: item.position.currentVega !== undefined ? item.position.currentVega : undefined,
            currentRho: item.position.currentRho !== undefined ? item.position.currentRho : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? item.position.currentImpliedVolatility : undefined,
            daysHeld: item.position.daysHeld !== undefined ? item.position.daysHeld : undefined,
            exitReason: item.position.exitReason !== undefined ? item.position.exitReason : undefined,
            strategyType: item.position.strategyType !== undefined ? item.position.strategyType : undefined,
            tradeId: item.position.tradeId !== undefined ? item.position.tradeId : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? item.position.lifecycleState : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? item.position.linkedRollId : undefined,
          },
        }
      } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
          executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
          executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
          fees: item.fees !== undefined ? item.fees : undefined,
          executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
          underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
          deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
          gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
          thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
          vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
          rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
          impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
          orderType: item.orderType !== undefined ? item.orderType : undefined,
          limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
          stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
          timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
          venue: item.venue !== undefined ? item.venue : undefined,
          slippage: item.slippage !== undefined ? item.slippage : undefined,
          notes: item.notes !== undefined ? item.notes : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
      position: item.position ? 
        typeof item.position === 'object' && Object.keys(item.position).length === 1 && Object.keys(item.position)[0] === 'id'
    ? { connect: {
            id: item.position.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.id !== undefined ? item.position.id : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                equals: item.position.alpacaAccountId 
               } : undefined,
            contractId: item.position.contractId !== undefined ? {
                equals: item.position.contractId 
               } : undefined,
            status: item.position.status !== undefined ? {
                equals: item.position.status 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? item.position.alpacaAccountId : undefined,
            status: item.position.status !== undefined ? item.position.status : undefined,
            openingSide: item.position.openingSide !== undefined ? item.position.openingSide : undefined,
            quantity: item.position.quantity !== undefined ? item.position.quantity : undefined,
            entryPrice: item.position.entryPrice !== undefined ? item.position.entryPrice : undefined,
            entryCost: item.position.entryCost !== undefined ? item.position.entryCost : undefined,
            entryTime: item.position.entryTime !== undefined ? item.position.entryTime : undefined,
            exitPrice: item.position.exitPrice !== undefined ? item.position.exitPrice : undefined,
            exitValue: item.position.exitValue !== undefined ? item.position.exitValue : undefined,
            exitTime: item.position.exitTime !== undefined ? item.position.exitTime : undefined,
            currentPrice: item.position.currentPrice !== undefined ? item.position.currentPrice : undefined,
            currentValue: item.position.currentValue !== undefined ? item.position.currentValue : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? item.position.unrealizedPnL : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? item.position.unrealizedPnLPercent : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? item.position.realizedPnL : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? item.position.realizedPnLPercent : undefined,
            totalFees: item.position.totalFees !== undefined ? item.position.totalFees : undefined,
            currentDelta: item.position.currentDelta !== undefined ? item.position.currentDelta : undefined,
            currentGamma: item.position.currentGamma !== undefined ? item.position.currentGamma : undefined,
            currentTheta: item.position.currentTheta !== undefined ? item.position.currentTheta : undefined,
            currentVega: item.position.currentVega !== undefined ? item.position.currentVega : undefined,
            currentRho: item.position.currentRho !== undefined ? item.position.currentRho : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? item.position.currentImpliedVolatility : undefined,
            daysHeld: item.position.daysHeld !== undefined ? item.position.daysHeld : undefined,
            exitReason: item.position.exitReason !== undefined ? item.position.exitReason : undefined,
            strategyType: item.position.strategyType !== undefined ? item.position.strategyType : undefined,
            tradeId: item.position.tradeId !== undefined ? item.position.tradeId : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? item.position.lifecycleState : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? item.position.linkedRollId : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        symbol: props.contract.symbol !== undefined ? props.contract.symbol : undefined,
        contractSymbol: props.contract.contractSymbol !== undefined ? props.contract.contractSymbol : undefined,
        optionType: props.contract.optionType !== undefined ? props.contract.optionType : undefined,
        strikePrice: props.contract.strikePrice !== undefined ? props.contract.strikePrice : undefined,
        expirationDate: props.contract.expirationDate !== undefined ? props.contract.expirationDate : undefined,
        daysToExpiration: props.contract.daysToExpiration !== undefined ? props.contract.daysToExpiration : undefined,
        lastPrice: props.contract.lastPrice !== undefined ? props.contract.lastPrice : undefined,
        bidPrice: props.contract.bidPrice !== undefined ? props.contract.bidPrice : undefined,
        askPrice: props.contract.askPrice !== undefined ? props.contract.askPrice : undefined,
        midPrice: props.contract.midPrice !== undefined ? props.contract.midPrice : undefined,
        bidSize: props.contract.bidSize !== undefined ? props.contract.bidSize : undefined,
        askSize: props.contract.askSize !== undefined ? props.contract.askSize : undefined,
        volume: props.contract.volume !== undefined ? props.contract.volume : undefined,
        openInterest: props.contract.openInterest !== undefined ? props.contract.openInterest : undefined,
        impliedVolatility: props.contract.impliedVolatility !== undefined ? props.contract.impliedVolatility : undefined,
        delta: props.contract.delta !== undefined ? props.contract.delta : undefined,
        gamma: props.contract.gamma !== undefined ? props.contract.gamma : undefined,
        theta: props.contract.theta !== undefined ? props.contract.theta : undefined,
        vega: props.contract.vega !== undefined ? props.contract.vega : undefined,
        rho: props.contract.rho !== undefined ? props.contract.rho : undefined,
        inTheMoney: props.contract.inTheMoney !== undefined ? props.contract.inTheMoney : undefined,
        intrinsicValue: props.contract.intrinsicValue !== undefined ? props.contract.intrinsicValue : undefined,
        extrinsicValue: props.contract.extrinsicValue !== undefined ? props.contract.extrinsicValue : undefined,
        theoreticalPrice: props.contract.theoreticalPrice !== undefined ? props.contract.theoreticalPrice : undefined,
        underlyingPrice: props.contract.underlyingPrice !== undefined ? props.contract.underlyingPrice : undefined,
        metadata: props.contract.metadata !== undefined ? props.contract.metadata : undefined,
        dataTimestamp: props.contract.dataTimestamp !== undefined ? props.contract.dataTimestamp : undefined,
    positions: props.contract.positions ? 
      Array.isArray(props.contract.positions) && props.contract.positions.length > 0 &&  props.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.positions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.positions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId 
             } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          status: item.status !== undefined ? item.status : undefined,
          openingSide: item.openingSide !== undefined ? item.openingSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          entryPrice: item.entryPrice !== undefined ? item.entryPrice : undefined,
          entryCost: item.entryCost !== undefined ? item.entryCost : undefined,
          entryTime: item.entryTime !== undefined ? item.entryTime : undefined,
          exitPrice: item.exitPrice !== undefined ? item.exitPrice : undefined,
          exitValue: item.exitValue !== undefined ? item.exitValue : undefined,
          exitTime: item.exitTime !== undefined ? item.exitTime : undefined,
          currentPrice: item.currentPrice !== undefined ? item.currentPrice : undefined,
          currentValue: item.currentValue !== undefined ? item.currentValue : undefined,
          unrealizedPnL: item.unrealizedPnL !== undefined ? item.unrealizedPnL : undefined,
          unrealizedPnLPercent: item.unrealizedPnLPercent !== undefined ? item.unrealizedPnLPercent : undefined,
          realizedPnL: item.realizedPnL !== undefined ? item.realizedPnL : undefined,
          realizedPnLPercent: item.realizedPnLPercent !== undefined ? item.realizedPnLPercent : undefined,
          totalFees: item.totalFees !== undefined ? item.totalFees : undefined,
          currentDelta: item.currentDelta !== undefined ? item.currentDelta : undefined,
          currentGamma: item.currentGamma !== undefined ? item.currentGamma : undefined,
          currentTheta: item.currentTheta !== undefined ? item.currentTheta : undefined,
          currentVega: item.currentVega !== undefined ? item.currentVega : undefined,
          currentRho: item.currentRho !== undefined ? item.currentRho : undefined,
          currentImpliedVolatility: item.currentImpliedVolatility !== undefined ? item.currentImpliedVolatility : undefined,
          daysHeld: item.daysHeld !== undefined ? item.daysHeld : undefined,
          exitReason: item.exitReason !== undefined ? item.exitReason : undefined,
          strategyType: item.strategyType !== undefined ? item.strategyType : undefined,
          tradeId: item.tradeId !== undefined ? item.tradeId : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
          lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
          exitThresholds: item.exitThresholds !== undefined ? item.exitThresholds : undefined,
          linkedRollId: item.linkedRollId !== undefined ? item.linkedRollId : undefined,
      executions: item.executions ? 
        Array.isArray(item.executions) && item.executions.length > 0 &&  item.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.executions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                equals: item.alpacaAccountId 
               } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                equals: item.brokerOrderId 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
            executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
            quantity: item.quantity !== undefined ? item.quantity : undefined,
            executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
            executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
            orderType: item.orderType !== undefined ? item.orderType : undefined,
            limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
            stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
            timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
            venue: item.venue !== undefined ? item.venue : undefined,
            slippage: item.slippage !== undefined ? item.slippage : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      lifecycleEvents: item.lifecycleEvents ? 
        Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.lifecycleEvents.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
          },
          create: {
            fromState: item.fromState !== undefined ? item.fromState : undefined,
            toState: item.toState !== undefined ? item.toState : undefined,
            trigger: item.trigger !== undefined ? item.trigger : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    executions: props.contract.executions ? 
      Array.isArray(props.contract.executions) && props.contract.executions.length > 0 &&  props.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.executions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.executions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          positionId: item.positionId !== undefined ? {
              equals: item.positionId 
             } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId 
             } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId 
             } : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? {
              equals: item.brokerOrderId 
             } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
          executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
          executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
          fees: item.fees !== undefined ? item.fees : undefined,
          executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
          underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
          deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
          gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
          thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
          vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
          rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
          impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
          orderType: item.orderType !== undefined ? item.orderType : undefined,
          limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
          stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
          timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
          venue: item.venue !== undefined ? item.venue : undefined,
          slippage: item.slippage !== undefined ? item.slippage : undefined,
          notes: item.notes !== undefined ? item.notes : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
      position: item.position ? 
        typeof item.position === 'object' && Object.keys(item.position).length === 1 && Object.keys(item.position)[0] === 'id'
    ? { connect: {
            id: item.position.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.id !== undefined ? item.position.id : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                equals: item.position.alpacaAccountId 
               } : undefined,
            contractId: item.position.contractId !== undefined ? {
                equals: item.position.contractId 
               } : undefined,
            status: item.position.status !== undefined ? {
                equals: item.position.status 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? item.position.alpacaAccountId : undefined,
            status: item.position.status !== undefined ? item.position.status : undefined,
            openingSide: item.position.openingSide !== undefined ? item.position.openingSide : undefined,
            quantity: item.position.quantity !== undefined ? item.position.quantity : undefined,
            entryPrice: item.position.entryPrice !== undefined ? item.position.entryPrice : undefined,
            entryCost: item.position.entryCost !== undefined ? item.position.entryCost : undefined,
            entryTime: item.position.entryTime !== undefined ? item.position.entryTime : undefined,
            exitPrice: item.position.exitPrice !== undefined ? item.position.exitPrice : undefined,
            exitValue: item.position.exitValue !== undefined ? item.position.exitValue : undefined,
            exitTime: item.position.exitTime !== undefined ? item.position.exitTime : undefined,
            currentPrice: item.position.currentPrice !== undefined ? item.position.currentPrice : undefined,
            currentValue: item.position.currentValue !== undefined ? item.position.currentValue : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? item.position.unrealizedPnL : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? item.position.unrealizedPnLPercent : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? item.position.realizedPnL : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? item.position.realizedPnLPercent : undefined,
            totalFees: item.position.totalFees !== undefined ? item.position.totalFees : undefined,
            currentDelta: item.position.currentDelta !== undefined ? item.position.currentDelta : undefined,
            currentGamma: item.position.currentGamma !== undefined ? item.position.currentGamma : undefined,
            currentTheta: item.position.currentTheta !== undefined ? item.position.currentTheta : undefined,
            currentVega: item.position.currentVega !== undefined ? item.position.currentVega : undefined,
            currentRho: item.position.currentRho !== undefined ? item.position.currentRho : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? item.position.currentImpliedVolatility : undefined,
            daysHeld: item.position.daysHeld !== undefined ? item.position.daysHeld : undefined,
            exitReason: item.position.exitReason !== undefined ? item.position.exitReason : undefined,
            strategyType: item.position.strategyType !== undefined ? item.position.strategyType : undefined,
            tradeId: item.position.tradeId !== undefined ? item.position.tradeId : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? item.position.lifecycleState : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? item.position.linkedRollId : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
    }
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_OPTIONSGREEKSHISTORY,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneOptionsGreeksHistory) {
          return response.data.upsertOneOptionsGreeksHistory;
        } else {
          return null as unknown as OptionsGreeksHistoryType;
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
          logger.error("Non-retryable constraint violation in upsertOneOptionsGreeksHistory", {
            operation: 'upsertOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
          logger.warn("Database connection error in upsertOneOptionsGreeksHistory, retrying...", {
            operation: 'upsertOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
            operation: 'upsertOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
   * Update multiple OptionsGreeksHistory records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of OptionsGreeksHistory objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: OptionsGreeksHistoryType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_OPTIONSGREEKSHISTORY = gql`
          mutation updateManyOptionsGreeksHistory($data: [OptionsGreeksHistoryCreateManyInput!]!) {
            updateManyOptionsGreeksHistory(data: $data) {
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
  underlyingPrice: prop.underlyingPrice !== undefined ? {
            set: prop.underlyingPrice 
           } : undefined,
  optionPrice: prop.optionPrice !== undefined ? {
            set: prop.optionPrice 
           } : undefined,
  bidPrice: prop.bidPrice !== undefined ? {
            set: prop.bidPrice 
           } : undefined,
  askPrice: prop.askPrice !== undefined ? {
            set: prop.askPrice 
           } : undefined,
  impliedVolatility: prop.impliedVolatility !== undefined ? {
            set: prop.impliedVolatility 
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
  volume: prop.volume !== undefined ? {
            set: prop.volume 
           } : undefined,
  openInterest: prop.openInterest !== undefined ? {
            set: prop.openInterest 
           } : undefined,
  daysToExpiration: prop.daysToExpiration !== undefined ? {
            set: prop.daysToExpiration 
           } : undefined,
  intrinsicValue: prop.intrinsicValue !== undefined ? {
            set: prop.intrinsicValue 
           } : undefined,
  extrinsicValue: prop.extrinsicValue !== undefined ? {
            set: prop.extrinsicValue 
           } : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  contract: prop.contract ? 
  typeof prop.contract === 'object' && Object.keys(prop.contract).length === 1 && (Object.keys(prop.contract)[0] === 'id' || Object.keys(prop.contract)[0] === 'symbol')
? {
  connect: {
    id: prop.contract.id
  }
} : { upsert: {
      where: {
        id: prop.contract.id !== undefined ? {
            equals: prop.contract.id
          } : undefined,
        symbol: prop.contract.symbol !== undefined ? {
            equals: prop.contract.symbol
          } : undefined,
      },
      update: {
        id: prop.contract.id !== undefined ? {
            set: prop.contract.id
          } : undefined,
        symbol: prop.contract.symbol !== undefined ? {
            set: prop.contract.symbol
          } : undefined,
        contractSymbol: prop.contract.contractSymbol !== undefined ? {
            set: prop.contract.contractSymbol
          } : undefined,
        optionType: prop.contract.optionType !== undefined ? {
            set: prop.contract.optionType
          } : undefined,
        strikePrice: prop.contract.strikePrice !== undefined ? {
            set: prop.contract.strikePrice
          } : undefined,
        expirationDate: prop.contract.expirationDate !== undefined ? {
            set: prop.contract.expirationDate
          } : undefined,
        daysToExpiration: prop.contract.daysToExpiration !== undefined ? {
            set: prop.contract.daysToExpiration
          } : undefined,
        lastPrice: prop.contract.lastPrice !== undefined ? {
            set: prop.contract.lastPrice
          } : undefined,
        bidPrice: prop.contract.bidPrice !== undefined ? {
            set: prop.contract.bidPrice
          } : undefined,
        askPrice: prop.contract.askPrice !== undefined ? {
            set: prop.contract.askPrice
          } : undefined,
        midPrice: prop.contract.midPrice !== undefined ? {
            set: prop.contract.midPrice
          } : undefined,
        bidSize: prop.contract.bidSize !== undefined ? {
            set: prop.contract.bidSize
          } : undefined,
        askSize: prop.contract.askSize !== undefined ? {
            set: prop.contract.askSize
          } : undefined,
        volume: prop.contract.volume !== undefined ? {
            set: prop.contract.volume
          } : undefined,
        openInterest: prop.contract.openInterest !== undefined ? {
            set: prop.contract.openInterest
          } : undefined,
        impliedVolatility: prop.contract.impliedVolatility !== undefined ? {
            set: prop.contract.impliedVolatility
          } : undefined,
        delta: prop.contract.delta !== undefined ? {
            set: prop.contract.delta
          } : undefined,
        gamma: prop.contract.gamma !== undefined ? {
            set: prop.contract.gamma
          } : undefined,
        theta: prop.contract.theta !== undefined ? {
            set: prop.contract.theta
          } : undefined,
        vega: prop.contract.vega !== undefined ? {
            set: prop.contract.vega
          } : undefined,
        rho: prop.contract.rho !== undefined ? {
            set: prop.contract.rho
          } : undefined,
        inTheMoney: prop.contract.inTheMoney !== undefined ? {
            set: prop.contract.inTheMoney
          } : undefined,
        intrinsicValue: prop.contract.intrinsicValue !== undefined ? {
            set: prop.contract.intrinsicValue
          } : undefined,
        extrinsicValue: prop.contract.extrinsicValue !== undefined ? {
            set: prop.contract.extrinsicValue
          } : undefined,
        theoreticalPrice: prop.contract.theoreticalPrice !== undefined ? {
            set: prop.contract.theoreticalPrice
          } : undefined,
        underlyingPrice: prop.contract.underlyingPrice !== undefined ? {
            set: prop.contract.underlyingPrice
          } : undefined,
        metadata: prop.contract.metadata !== undefined ? prop.contract.metadata : undefined,
        dataTimestamp: prop.contract.dataTimestamp !== undefined ? {
            set: prop.contract.dataTimestamp
          } : undefined,
    positions: prop.contract.positions ? 
    Array.isArray(prop.contract.positions) && prop.contract.positions.length > 0 && prop.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.contract.positions.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.contract.positions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId
            } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
          tradeId: item.tradeId !== undefined ? {
              equals: item.tradeId
            } : undefined,
          linkedRollId: item.linkedRollId !== undefined ? {
              equals: item.linkedRollId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              set: item.alpacaAccountId
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          openingSide: item.openingSide !== undefined ? {
              set: item.openingSide
            } : undefined,
          quantity: item.quantity !== undefined ? {
              set: item.quantity
            } : undefined,
          entryPrice: item.entryPrice !== undefined ? {
              set: item.entryPrice
            } : undefined,
          entryCost: item.entryCost !== undefined ? {
              set: item.entryCost
            } : undefined,
          entryTime: item.entryTime !== undefined ? {
              set: item.entryTime
            } : undefined,
          exitPrice: item.exitPrice !== undefined ? {
              set: item.exitPrice
            } : undefined,
          exitValue: item.exitValue !== undefined ? {
              set: item.exitValue
            } : undefined,
          exitTime: item.exitTime !== undefined ? {
              set: item.exitTime
            } : undefined,
          currentPrice: item.currentPrice !== undefined ? {
              set: item.currentPrice
            } : undefined,
          currentValue: item.currentValue !== undefined ? {
              set: item.currentValue
            } : undefined,
          unrealizedPnL: item.unrealizedPnL !== undefined ? {
              set: item.unrealizedPnL
            } : undefined,
          unrealizedPnLPercent: item.unrealizedPnLPercent !== undefined ? {
              set: item.unrealizedPnLPercent
            } : undefined,
          realizedPnL: item.realizedPnL !== undefined ? {
              set: item.realizedPnL
            } : undefined,
          realizedPnLPercent: item.realizedPnLPercent !== undefined ? {
              set: item.realizedPnLPercent
            } : undefined,
          totalFees: item.totalFees !== undefined ? {
              set: item.totalFees
            } : undefined,
          currentDelta: item.currentDelta !== undefined ? {
              set: item.currentDelta
            } : undefined,
          currentGamma: item.currentGamma !== undefined ? {
              set: item.currentGamma
            } : undefined,
          currentTheta: item.currentTheta !== undefined ? {
              set: item.currentTheta
            } : undefined,
          currentVega: item.currentVega !== undefined ? {
              set: item.currentVega
            } : undefined,
          currentRho: item.currentRho !== undefined ? {
              set: item.currentRho
            } : undefined,
          currentImpliedVolatility: item.currentImpliedVolatility !== undefined ? {
              set: item.currentImpliedVolatility
            } : undefined,
          daysHeld: item.daysHeld !== undefined ? {
              set: item.daysHeld
            } : undefined,
          exitReason: item.exitReason !== undefined ? {
              set: item.exitReason
            } : undefined,
          strategyType: item.strategyType !== undefined ? {
              set: item.strategyType
            } : undefined,
          tradeId: item.tradeId !== undefined ? {
              set: item.tradeId
            } : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
          lifecycleState: item.lifecycleState !== undefined ? {
              set: item.lifecycleState
            } : undefined,
          exitThresholds: item.exitThresholds !== undefined ? item.exitThresholds : undefined,
          linkedRollId: item.linkedRollId !== undefined ? {
              set: item.linkedRollId
            } : undefined,
      executions: item.executions ? 
      Array.isArray(item.executions) && item.executions.length > 0 && item.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.executions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.executions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId
              } : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId
              } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                equals: item.alpacaAccountId
              } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                equals: item.brokerOrderId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                set: item.alpacaAccountId
              } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                set: item.brokerOrderId
              } : undefined,
            executionSide: item.executionSide !== undefined ? {
                set: item.executionSide
              } : undefined,
            quantity: item.quantity !== undefined ? {
                set: item.quantity
              } : undefined,
            executionPrice: item.executionPrice !== undefined ? {
                set: item.executionPrice
              } : undefined,
            executionValue: item.executionValue !== undefined ? {
                set: item.executionValue
              } : undefined,
            fees: item.fees !== undefined ? {
                set: item.fees
              } : undefined,
            executionTime: item.executionTime !== undefined ? {
                set: item.executionTime
              } : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? {
                set: item.underlyingPriceAtExecution
              } : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? {
                set: item.deltaAtExecution
              } : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? {
                set: item.gammaAtExecution
              } : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? {
                set: item.thetaAtExecution
              } : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? {
                set: item.vegaAtExecution
              } : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? {
                set: item.rhoAtExecution
              } : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? {
                set: item.impliedVolatilityAtExecution
              } : undefined,
            orderType: item.orderType !== undefined ? {
                set: item.orderType
              } : undefined,
            limitPrice: item.limitPrice !== undefined ? {
                set: item.limitPrice
              } : undefined,
            stopPrice: item.stopPrice !== undefined ? {
                set: item.stopPrice
              } : undefined,
            timeInForce: item.timeInForce !== undefined ? {
                set: item.timeInForce
              } : undefined,
            venue: item.venue !== undefined ? {
                set: item.venue
              } : undefined,
            slippage: item.slippage !== undefined ? {
                set: item.slippage
              } : undefined,
            notes: item.notes !== undefined ? {
                set: item.notes
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
            executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
            quantity: item.quantity !== undefined ? item.quantity : undefined,
            executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
            executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
            orderType: item.orderType !== undefined ? item.orderType : undefined,
            limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
            stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
            timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
            venue: item.venue !== undefined ? item.venue : undefined,
            slippage: item.slippage !== undefined ? item.slippage : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      lifecycleEvents: item.lifecycleEvents ? 
      Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 && item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.lifecycleEvents.map((item) => ({
        id: item.id
      }))
} : { upsert: item.lifecycleEvents.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            fromState: item.fromState !== undefined ? {
                set: item.fromState
              } : undefined,
            toState: item.toState !== undefined ? {
                set: item.toState
              } : undefined,
            trigger: item.trigger !== undefined ? {
                set: item.trigger
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            fromState: item.fromState !== undefined ? item.fromState : undefined,
            toState: item.toState !== undefined ? item.toState : undefined,
            trigger: item.trigger !== undefined ? item.trigger : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          status: item.status !== undefined ? item.status : undefined,
          openingSide: item.openingSide !== undefined ? item.openingSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          entryPrice: item.entryPrice !== undefined ? item.entryPrice : undefined,
          entryCost: item.entryCost !== undefined ? item.entryCost : undefined,
          entryTime: item.entryTime !== undefined ? item.entryTime : undefined,
          exitPrice: item.exitPrice !== undefined ? item.exitPrice : undefined,
          exitValue: item.exitValue !== undefined ? item.exitValue : undefined,
          exitTime: item.exitTime !== undefined ? item.exitTime : undefined,
          currentPrice: item.currentPrice !== undefined ? item.currentPrice : undefined,
          currentValue: item.currentValue !== undefined ? item.currentValue : undefined,
          unrealizedPnL: item.unrealizedPnL !== undefined ? item.unrealizedPnL : undefined,
          unrealizedPnLPercent: item.unrealizedPnLPercent !== undefined ? item.unrealizedPnLPercent : undefined,
          realizedPnL: item.realizedPnL !== undefined ? item.realizedPnL : undefined,
          realizedPnLPercent: item.realizedPnLPercent !== undefined ? item.realizedPnLPercent : undefined,
          totalFees: item.totalFees !== undefined ? item.totalFees : undefined,
          currentDelta: item.currentDelta !== undefined ? item.currentDelta : undefined,
          currentGamma: item.currentGamma !== undefined ? item.currentGamma : undefined,
          currentTheta: item.currentTheta !== undefined ? item.currentTheta : undefined,
          currentVega: item.currentVega !== undefined ? item.currentVega : undefined,
          currentRho: item.currentRho !== undefined ? item.currentRho : undefined,
          currentImpliedVolatility: item.currentImpliedVolatility !== undefined ? item.currentImpliedVolatility : undefined,
          daysHeld: item.daysHeld !== undefined ? item.daysHeld : undefined,
          exitReason: item.exitReason !== undefined ? item.exitReason : undefined,
          strategyType: item.strategyType !== undefined ? item.strategyType : undefined,
          tradeId: item.tradeId !== undefined ? item.tradeId : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
          lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
          exitThresholds: item.exitThresholds !== undefined ? item.exitThresholds : undefined,
          linkedRollId: item.linkedRollId !== undefined ? item.linkedRollId : undefined,
      executions: item.executions ? 
        Array.isArray(item.executions) && item.executions.length > 0 &&  item.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.executions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                equals: item.alpacaAccountId 
               } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                equals: item.brokerOrderId 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
            executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
            quantity: item.quantity !== undefined ? item.quantity : undefined,
            executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
            executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
            orderType: item.orderType !== undefined ? item.orderType : undefined,
            limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
            stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
            timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
            venue: item.venue !== undefined ? item.venue : undefined,
            slippage: item.slippage !== undefined ? item.slippage : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      lifecycleEvents: item.lifecycleEvents ? 
        Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.lifecycleEvents.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
          },
          create: {
            fromState: item.fromState !== undefined ? item.fromState : undefined,
            toState: item.toState !== undefined ? item.toState : undefined,
            trigger: item.trigger !== undefined ? item.trigger : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    executions: prop.contract.executions ? 
    Array.isArray(prop.contract.executions) && prop.contract.executions.length > 0 && prop.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.contract.executions.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.contract.executions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          positionId: item.positionId !== undefined ? {
              equals: item.positionId
            } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId
            } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId
            } : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? {
              equals: item.brokerOrderId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              set: item.alpacaAccountId
            } : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? {
              set: item.brokerOrderId
            } : undefined,
          executionSide: item.executionSide !== undefined ? {
              set: item.executionSide
            } : undefined,
          quantity: item.quantity !== undefined ? {
              set: item.quantity
            } : undefined,
          executionPrice: item.executionPrice !== undefined ? {
              set: item.executionPrice
            } : undefined,
          executionValue: item.executionValue !== undefined ? {
              set: item.executionValue
            } : undefined,
          fees: item.fees !== undefined ? {
              set: item.fees
            } : undefined,
          executionTime: item.executionTime !== undefined ? {
              set: item.executionTime
            } : undefined,
          underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? {
              set: item.underlyingPriceAtExecution
            } : undefined,
          deltaAtExecution: item.deltaAtExecution !== undefined ? {
              set: item.deltaAtExecution
            } : undefined,
          gammaAtExecution: item.gammaAtExecution !== undefined ? {
              set: item.gammaAtExecution
            } : undefined,
          thetaAtExecution: item.thetaAtExecution !== undefined ? {
              set: item.thetaAtExecution
            } : undefined,
          vegaAtExecution: item.vegaAtExecution !== undefined ? {
              set: item.vegaAtExecution
            } : undefined,
          rhoAtExecution: item.rhoAtExecution !== undefined ? {
              set: item.rhoAtExecution
            } : undefined,
          impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? {
              set: item.impliedVolatilityAtExecution
            } : undefined,
          orderType: item.orderType !== undefined ? {
              set: item.orderType
            } : undefined,
          limitPrice: item.limitPrice !== undefined ? {
              set: item.limitPrice
            } : undefined,
          stopPrice: item.stopPrice !== undefined ? {
              set: item.stopPrice
            } : undefined,
          timeInForce: item.timeInForce !== undefined ? {
              set: item.timeInForce
            } : undefined,
          venue: item.venue !== undefined ? {
              set: item.venue
            } : undefined,
          slippage: item.slippage !== undefined ? {
              set: item.slippage
            } : undefined,
          notes: item.notes !== undefined ? {
              set: item.notes
            } : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
      position: item.position ? 
      typeof item.position === 'object' && Object.keys(item.position).length === 1 && (Object.keys(item.position)[0] === 'id' || Object.keys(item.position)[0] === 'symbol')
? {
      connect: {
        id: item.position.id
      }
} : { upsert: {
          where: {
            id: item.position.id !== undefined ? {
                equals: item.position.id
              } : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                equals: item.position.alpacaAccountId
              } : undefined,
            contractId: item.position.contractId !== undefined ? {
                equals: item.position.contractId
              } : undefined,
            status: item.position.status !== undefined ? {
                equals: item.position.status
              } : undefined,
            tradeId: item.position.tradeId !== undefined ? {
                equals: item.position.tradeId
              } : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? {
                equals: item.position.linkedRollId
              } : undefined,
          },
          update: {
            id: item.position.id !== undefined ? {
                set: item.position.id
              } : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                set: item.position.alpacaAccountId
              } : undefined,
            status: item.position.status !== undefined ? {
                set: item.position.status
              } : undefined,
            openingSide: item.position.openingSide !== undefined ? {
                set: item.position.openingSide
              } : undefined,
            quantity: item.position.quantity !== undefined ? {
                set: item.position.quantity
              } : undefined,
            entryPrice: item.position.entryPrice !== undefined ? {
                set: item.position.entryPrice
              } : undefined,
            entryCost: item.position.entryCost !== undefined ? {
                set: item.position.entryCost
              } : undefined,
            entryTime: item.position.entryTime !== undefined ? {
                set: item.position.entryTime
              } : undefined,
            exitPrice: item.position.exitPrice !== undefined ? {
                set: item.position.exitPrice
              } : undefined,
            exitValue: item.position.exitValue !== undefined ? {
                set: item.position.exitValue
              } : undefined,
            exitTime: item.position.exitTime !== undefined ? {
                set: item.position.exitTime
              } : undefined,
            currentPrice: item.position.currentPrice !== undefined ? {
                set: item.position.currentPrice
              } : undefined,
            currentValue: item.position.currentValue !== undefined ? {
                set: item.position.currentValue
              } : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? {
                set: item.position.unrealizedPnL
              } : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? {
                set: item.position.unrealizedPnLPercent
              } : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? {
                set: item.position.realizedPnL
              } : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? {
                set: item.position.realizedPnLPercent
              } : undefined,
            totalFees: item.position.totalFees !== undefined ? {
                set: item.position.totalFees
              } : undefined,
            currentDelta: item.position.currentDelta !== undefined ? {
                set: item.position.currentDelta
              } : undefined,
            currentGamma: item.position.currentGamma !== undefined ? {
                set: item.position.currentGamma
              } : undefined,
            currentTheta: item.position.currentTheta !== undefined ? {
                set: item.position.currentTheta
              } : undefined,
            currentVega: item.position.currentVega !== undefined ? {
                set: item.position.currentVega
              } : undefined,
            currentRho: item.position.currentRho !== undefined ? {
                set: item.position.currentRho
              } : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? {
                set: item.position.currentImpliedVolatility
              } : undefined,
            daysHeld: item.position.daysHeld !== undefined ? {
                set: item.position.daysHeld
              } : undefined,
            exitReason: item.position.exitReason !== undefined ? {
                set: item.position.exitReason
              } : undefined,
            strategyType: item.position.strategyType !== undefined ? {
                set: item.position.strategyType
              } : undefined,
            tradeId: item.position.tradeId !== undefined ? {
                set: item.position.tradeId
              } : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? {
                set: item.position.lifecycleState
              } : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? {
                set: item.position.linkedRollId
              } : undefined,
          },
          create: {
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? item.position.alpacaAccountId : undefined,
            status: item.position.status !== undefined ? item.position.status : undefined,
            openingSide: item.position.openingSide !== undefined ? item.position.openingSide : undefined,
            quantity: item.position.quantity !== undefined ? item.position.quantity : undefined,
            entryPrice: item.position.entryPrice !== undefined ? item.position.entryPrice : undefined,
            entryCost: item.position.entryCost !== undefined ? item.position.entryCost : undefined,
            entryTime: item.position.entryTime !== undefined ? item.position.entryTime : undefined,
            exitPrice: item.position.exitPrice !== undefined ? item.position.exitPrice : undefined,
            exitValue: item.position.exitValue !== undefined ? item.position.exitValue : undefined,
            exitTime: item.position.exitTime !== undefined ? item.position.exitTime : undefined,
            currentPrice: item.position.currentPrice !== undefined ? item.position.currentPrice : undefined,
            currentValue: item.position.currentValue !== undefined ? item.position.currentValue : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? item.position.unrealizedPnL : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? item.position.unrealizedPnLPercent : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? item.position.realizedPnL : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? item.position.realizedPnLPercent : undefined,
            totalFees: item.position.totalFees !== undefined ? item.position.totalFees : undefined,
            currentDelta: item.position.currentDelta !== undefined ? item.position.currentDelta : undefined,
            currentGamma: item.position.currentGamma !== undefined ? item.position.currentGamma : undefined,
            currentTheta: item.position.currentTheta !== undefined ? item.position.currentTheta : undefined,
            currentVega: item.position.currentVega !== undefined ? item.position.currentVega : undefined,
            currentRho: item.position.currentRho !== undefined ? item.position.currentRho : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? item.position.currentImpliedVolatility : undefined,
            daysHeld: item.position.daysHeld !== undefined ? item.position.daysHeld : undefined,
            exitReason: item.position.exitReason !== undefined ? item.position.exitReason : undefined,
            strategyType: item.position.strategyType !== undefined ? item.position.strategyType : undefined,
            tradeId: item.position.tradeId !== undefined ? item.position.tradeId : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? item.position.lifecycleState : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? item.position.linkedRollId : undefined,
          },
        }
      } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
          executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
          executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
          fees: item.fees !== undefined ? item.fees : undefined,
          executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
          underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
          deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
          gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
          thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
          vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
          rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
          impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
          orderType: item.orderType !== undefined ? item.orderType : undefined,
          limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
          stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
          timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
          venue: item.venue !== undefined ? item.venue : undefined,
          slippage: item.slippage !== undefined ? item.slippage : undefined,
          notes: item.notes !== undefined ? item.notes : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
      position: item.position ? 
        typeof item.position === 'object' && Object.keys(item.position).length === 1 && Object.keys(item.position)[0] === 'id'
    ? { connect: {
            id: item.position.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.id !== undefined ? item.position.id : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                equals: item.position.alpacaAccountId 
               } : undefined,
            contractId: item.position.contractId !== undefined ? {
                equals: item.position.contractId 
               } : undefined,
            status: item.position.status !== undefined ? {
                equals: item.position.status 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? item.position.alpacaAccountId : undefined,
            status: item.position.status !== undefined ? item.position.status : undefined,
            openingSide: item.position.openingSide !== undefined ? item.position.openingSide : undefined,
            quantity: item.position.quantity !== undefined ? item.position.quantity : undefined,
            entryPrice: item.position.entryPrice !== undefined ? item.position.entryPrice : undefined,
            entryCost: item.position.entryCost !== undefined ? item.position.entryCost : undefined,
            entryTime: item.position.entryTime !== undefined ? item.position.entryTime : undefined,
            exitPrice: item.position.exitPrice !== undefined ? item.position.exitPrice : undefined,
            exitValue: item.position.exitValue !== undefined ? item.position.exitValue : undefined,
            exitTime: item.position.exitTime !== undefined ? item.position.exitTime : undefined,
            currentPrice: item.position.currentPrice !== undefined ? item.position.currentPrice : undefined,
            currentValue: item.position.currentValue !== undefined ? item.position.currentValue : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? item.position.unrealizedPnL : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? item.position.unrealizedPnLPercent : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? item.position.realizedPnL : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? item.position.realizedPnLPercent : undefined,
            totalFees: item.position.totalFees !== undefined ? item.position.totalFees : undefined,
            currentDelta: item.position.currentDelta !== undefined ? item.position.currentDelta : undefined,
            currentGamma: item.position.currentGamma !== undefined ? item.position.currentGamma : undefined,
            currentTheta: item.position.currentTheta !== undefined ? item.position.currentTheta : undefined,
            currentVega: item.position.currentVega !== undefined ? item.position.currentVega : undefined,
            currentRho: item.position.currentRho !== undefined ? item.position.currentRho : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? item.position.currentImpliedVolatility : undefined,
            daysHeld: item.position.daysHeld !== undefined ? item.position.daysHeld : undefined,
            exitReason: item.position.exitReason !== undefined ? item.position.exitReason : undefined,
            strategyType: item.position.strategyType !== undefined ? item.position.strategyType : undefined,
            tradeId: item.position.tradeId !== undefined ? item.position.tradeId : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? item.position.lifecycleState : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? item.position.linkedRollId : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        symbol: prop.contract.symbol !== undefined ? prop.contract.symbol : undefined,
        contractSymbol: prop.contract.contractSymbol !== undefined ? prop.contract.contractSymbol : undefined,
        optionType: prop.contract.optionType !== undefined ? prop.contract.optionType : undefined,
        strikePrice: prop.contract.strikePrice !== undefined ? prop.contract.strikePrice : undefined,
        expirationDate: prop.contract.expirationDate !== undefined ? prop.contract.expirationDate : undefined,
        daysToExpiration: prop.contract.daysToExpiration !== undefined ? prop.contract.daysToExpiration : undefined,
        lastPrice: prop.contract.lastPrice !== undefined ? prop.contract.lastPrice : undefined,
        bidPrice: prop.contract.bidPrice !== undefined ? prop.contract.bidPrice : undefined,
        askPrice: prop.contract.askPrice !== undefined ? prop.contract.askPrice : undefined,
        midPrice: prop.contract.midPrice !== undefined ? prop.contract.midPrice : undefined,
        bidSize: prop.contract.bidSize !== undefined ? prop.contract.bidSize : undefined,
        askSize: prop.contract.askSize !== undefined ? prop.contract.askSize : undefined,
        volume: prop.contract.volume !== undefined ? prop.contract.volume : undefined,
        openInterest: prop.contract.openInterest !== undefined ? prop.contract.openInterest : undefined,
        impliedVolatility: prop.contract.impliedVolatility !== undefined ? prop.contract.impliedVolatility : undefined,
        delta: prop.contract.delta !== undefined ? prop.contract.delta : undefined,
        gamma: prop.contract.gamma !== undefined ? prop.contract.gamma : undefined,
        theta: prop.contract.theta !== undefined ? prop.contract.theta : undefined,
        vega: prop.contract.vega !== undefined ? prop.contract.vega : undefined,
        rho: prop.contract.rho !== undefined ? prop.contract.rho : undefined,
        inTheMoney: prop.contract.inTheMoney !== undefined ? prop.contract.inTheMoney : undefined,
        intrinsicValue: prop.contract.intrinsicValue !== undefined ? prop.contract.intrinsicValue : undefined,
        extrinsicValue: prop.contract.extrinsicValue !== undefined ? prop.contract.extrinsicValue : undefined,
        theoreticalPrice: prop.contract.theoreticalPrice !== undefined ? prop.contract.theoreticalPrice : undefined,
        underlyingPrice: prop.contract.underlyingPrice !== undefined ? prop.contract.underlyingPrice : undefined,
        metadata: prop.contract.metadata !== undefined ? prop.contract.metadata : undefined,
        dataTimestamp: prop.contract.dataTimestamp !== undefined ? prop.contract.dataTimestamp : undefined,
    positions: prop.contract.positions ? 
      Array.isArray(prop.contract.positions) && prop.contract.positions.length > 0 &&  prop.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.contract.positions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.contract.positions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId 
             } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          status: item.status !== undefined ? item.status : undefined,
          openingSide: item.openingSide !== undefined ? item.openingSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          entryPrice: item.entryPrice !== undefined ? item.entryPrice : undefined,
          entryCost: item.entryCost !== undefined ? item.entryCost : undefined,
          entryTime: item.entryTime !== undefined ? item.entryTime : undefined,
          exitPrice: item.exitPrice !== undefined ? item.exitPrice : undefined,
          exitValue: item.exitValue !== undefined ? item.exitValue : undefined,
          exitTime: item.exitTime !== undefined ? item.exitTime : undefined,
          currentPrice: item.currentPrice !== undefined ? item.currentPrice : undefined,
          currentValue: item.currentValue !== undefined ? item.currentValue : undefined,
          unrealizedPnL: item.unrealizedPnL !== undefined ? item.unrealizedPnL : undefined,
          unrealizedPnLPercent: item.unrealizedPnLPercent !== undefined ? item.unrealizedPnLPercent : undefined,
          realizedPnL: item.realizedPnL !== undefined ? item.realizedPnL : undefined,
          realizedPnLPercent: item.realizedPnLPercent !== undefined ? item.realizedPnLPercent : undefined,
          totalFees: item.totalFees !== undefined ? item.totalFees : undefined,
          currentDelta: item.currentDelta !== undefined ? item.currentDelta : undefined,
          currentGamma: item.currentGamma !== undefined ? item.currentGamma : undefined,
          currentTheta: item.currentTheta !== undefined ? item.currentTheta : undefined,
          currentVega: item.currentVega !== undefined ? item.currentVega : undefined,
          currentRho: item.currentRho !== undefined ? item.currentRho : undefined,
          currentImpliedVolatility: item.currentImpliedVolatility !== undefined ? item.currentImpliedVolatility : undefined,
          daysHeld: item.daysHeld !== undefined ? item.daysHeld : undefined,
          exitReason: item.exitReason !== undefined ? item.exitReason : undefined,
          strategyType: item.strategyType !== undefined ? item.strategyType : undefined,
          tradeId: item.tradeId !== undefined ? item.tradeId : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
          lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
          exitThresholds: item.exitThresholds !== undefined ? item.exitThresholds : undefined,
          linkedRollId: item.linkedRollId !== undefined ? item.linkedRollId : undefined,
      executions: item.executions ? 
        Array.isArray(item.executions) && item.executions.length > 0 &&  item.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.executions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
            alpacaAccountId: item.alpacaAccountId !== undefined ? {
                equals: item.alpacaAccountId 
               } : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? {
                equals: item.brokerOrderId 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
            brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
            executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
            quantity: item.quantity !== undefined ? item.quantity : undefined,
            executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
            executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
            underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
            deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
            gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
            thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
            vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
            rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
            impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
            orderType: item.orderType !== undefined ? item.orderType : undefined,
            limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
            stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
            timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
            venue: item.venue !== undefined ? item.venue : undefined,
            slippage: item.slippage !== undefined ? item.slippage : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      lifecycleEvents: item.lifecycleEvents ? 
        Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.lifecycleEvents.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            positionId: item.positionId !== undefined ? {
                equals: item.positionId 
               } : undefined,
          },
          create: {
            fromState: item.fromState !== undefined ? item.fromState : undefined,
            toState: item.toState !== undefined ? item.toState : undefined,
            trigger: item.trigger !== undefined ? item.trigger : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
      }))
    } : undefined,
    executions: prop.contract.executions ? 
      Array.isArray(prop.contract.executions) && prop.contract.executions.length > 0 &&  prop.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.contract.executions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.contract.executions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          positionId: item.positionId !== undefined ? {
              equals: item.positionId 
             } : undefined,
          contractId: item.contractId !== undefined ? {
              equals: item.contractId 
             } : undefined,
          alpacaAccountId: item.alpacaAccountId !== undefined ? {
              equals: item.alpacaAccountId 
             } : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? {
              equals: item.brokerOrderId 
             } : undefined,
        },
        create: {
          alpacaAccountId: item.alpacaAccountId !== undefined ? item.alpacaAccountId : undefined,
          brokerOrderId: item.brokerOrderId !== undefined ? item.brokerOrderId : undefined,
          executionSide: item.executionSide !== undefined ? item.executionSide : undefined,
          quantity: item.quantity !== undefined ? item.quantity : undefined,
          executionPrice: item.executionPrice !== undefined ? item.executionPrice : undefined,
          executionValue: item.executionValue !== undefined ? item.executionValue : undefined,
          fees: item.fees !== undefined ? item.fees : undefined,
          executionTime: item.executionTime !== undefined ? item.executionTime : undefined,
          underlyingPriceAtExecution: item.underlyingPriceAtExecution !== undefined ? item.underlyingPriceAtExecution : undefined,
          deltaAtExecution: item.deltaAtExecution !== undefined ? item.deltaAtExecution : undefined,
          gammaAtExecution: item.gammaAtExecution !== undefined ? item.gammaAtExecution : undefined,
          thetaAtExecution: item.thetaAtExecution !== undefined ? item.thetaAtExecution : undefined,
          vegaAtExecution: item.vegaAtExecution !== undefined ? item.vegaAtExecution : undefined,
          rhoAtExecution: item.rhoAtExecution !== undefined ? item.rhoAtExecution : undefined,
          impliedVolatilityAtExecution: item.impliedVolatilityAtExecution !== undefined ? item.impliedVolatilityAtExecution : undefined,
          orderType: item.orderType !== undefined ? item.orderType : undefined,
          limitPrice: item.limitPrice !== undefined ? item.limitPrice : undefined,
          stopPrice: item.stopPrice !== undefined ? item.stopPrice : undefined,
          timeInForce: item.timeInForce !== undefined ? item.timeInForce : undefined,
          venue: item.venue !== undefined ? item.venue : undefined,
          slippage: item.slippage !== undefined ? item.slippage : undefined,
          notes: item.notes !== undefined ? item.notes : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
      position: item.position ? 
        typeof item.position === 'object' && Object.keys(item.position).length === 1 && Object.keys(item.position)[0] === 'id'
    ? { connect: {
            id: item.position.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.id !== undefined ? item.position.id : undefined,
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? {
                equals: item.position.alpacaAccountId 
               } : undefined,
            contractId: item.position.contractId !== undefined ? {
                equals: item.position.contractId 
               } : undefined,
            status: item.position.status !== undefined ? {
                equals: item.position.status 
               } : undefined,
          },
          create: {
            alpacaAccountId: item.position.alpacaAccountId !== undefined ? item.position.alpacaAccountId : undefined,
            status: item.position.status !== undefined ? item.position.status : undefined,
            openingSide: item.position.openingSide !== undefined ? item.position.openingSide : undefined,
            quantity: item.position.quantity !== undefined ? item.position.quantity : undefined,
            entryPrice: item.position.entryPrice !== undefined ? item.position.entryPrice : undefined,
            entryCost: item.position.entryCost !== undefined ? item.position.entryCost : undefined,
            entryTime: item.position.entryTime !== undefined ? item.position.entryTime : undefined,
            exitPrice: item.position.exitPrice !== undefined ? item.position.exitPrice : undefined,
            exitValue: item.position.exitValue !== undefined ? item.position.exitValue : undefined,
            exitTime: item.position.exitTime !== undefined ? item.position.exitTime : undefined,
            currentPrice: item.position.currentPrice !== undefined ? item.position.currentPrice : undefined,
            currentValue: item.position.currentValue !== undefined ? item.position.currentValue : undefined,
            unrealizedPnL: item.position.unrealizedPnL !== undefined ? item.position.unrealizedPnL : undefined,
            unrealizedPnLPercent: item.position.unrealizedPnLPercent !== undefined ? item.position.unrealizedPnLPercent : undefined,
            realizedPnL: item.position.realizedPnL !== undefined ? item.position.realizedPnL : undefined,
            realizedPnLPercent: item.position.realizedPnLPercent !== undefined ? item.position.realizedPnLPercent : undefined,
            totalFees: item.position.totalFees !== undefined ? item.position.totalFees : undefined,
            currentDelta: item.position.currentDelta !== undefined ? item.position.currentDelta : undefined,
            currentGamma: item.position.currentGamma !== undefined ? item.position.currentGamma : undefined,
            currentTheta: item.position.currentTheta !== undefined ? item.position.currentTheta : undefined,
            currentVega: item.position.currentVega !== undefined ? item.position.currentVega : undefined,
            currentRho: item.position.currentRho !== undefined ? item.position.currentRho : undefined,
            currentImpliedVolatility: item.position.currentImpliedVolatility !== undefined ? item.position.currentImpliedVolatility : undefined,
            daysHeld: item.position.daysHeld !== undefined ? item.position.daysHeld : undefined,
            exitReason: item.position.exitReason !== undefined ? item.position.exitReason : undefined,
            strategyType: item.position.strategyType !== undefined ? item.position.strategyType : undefined,
            tradeId: item.position.tradeId !== undefined ? item.position.tradeId : undefined,
            metadata: item.position.metadata !== undefined ? item.position.metadata : undefined,
            lifecycleState: item.position.lifecycleState !== undefined ? item.position.lifecycleState : undefined,
            exitThresholds: item.position.exitThresholds !== undefined ? item.position.exitThresholds : undefined,
            linkedRollId: item.position.linkedRollId !== undefined ? item.position.linkedRollId : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
    }
  } : undefined,

          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_OPTIONSGREEKSHISTORY,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyOptionsGreeksHistory) {
          return response.data.updateManyOptionsGreeksHistory;
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
          logger.error("Non-retryable constraint violation in updateManyOptionsGreeksHistory", {
            operation: 'updateManyOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
          logger.warn("Database connection error in updateManyOptionsGreeksHistory, retrying...", {
            operation: 'updateManyOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
   * Delete a single OptionsGreeksHistory record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted OptionsGreeksHistory or null.
   */
  async delete(props: OptionsGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsGreeksHistoryType> {
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

        const DELETE_ONE_OPTIONSGREEKSHISTORY = gql`
          mutation deleteOneOptionsGreeksHistory($where: OptionsGreeksHistoryWhereUniqueInput!) {
            deleteOneOptionsGreeksHistory(where: $where) {
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
          mutation: DELETE_ONE_OPTIONSGREEKSHISTORY,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneOptionsGreeksHistory) {
          return response.data.deleteOneOptionsGreeksHistory;
        } else {
          return null as unknown as OptionsGreeksHistoryType;
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
          logger.error("Non-retryable constraint violation in deleteOneOptionsGreeksHistory", {
            operation: 'deleteOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
          logger.warn("Database connection error in deleteOneOptionsGreeksHistory, retrying...", {
            operation: 'deleteOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
            operation: 'deleteOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
   * Retrieve a single OptionsGreeksHistory record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved OptionsGreeksHistory or null.
   */
  async get(props: OptionsGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<OptionsGreeksHistoryType | null> {
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

        const GET_OPTIONSGREEKSHISTORY = gql`
          query getOptionsGreeksHistory($where: OptionsGreeksHistoryWhereUniqueInput!) {
            getOptionsGreeksHistory(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  contractId: props.contractId !== undefined ? {
    equals: props.contractId 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_OPTIONSGREEKSHISTORY,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getOptionsGreeksHistory ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsGreeksHistory found') {
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
          logger.warn("Database connection error in getOptionsGreeksHistory, retrying...", {
            operation: 'getOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
   * Retrieve all OptionsGreeksHistories records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of OptionsGreeksHistory records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsGreeksHistoryType[] | null> {
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

        const GET_ALL_OPTIONSGREEKSHISTORY = gql`
          query getAllOptionsGreeksHistory {
            optionsGreeksHistories {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_OPTIONSGREEKSHISTORY,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.optionsGreeksHistories ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsGreeksHistory found') {
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
          logger.warn("Database connection error in getAllOptionsGreeksHistory, retrying...", {
            operation: 'getAllOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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
   * Find multiple OptionsGreeksHistory records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found OptionsGreeksHistory records or null.
   */
  async findMany(props: OptionsGreeksHistoryType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<OptionsGreeksHistoryType[] | null> {
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

        const FIND_MANY_OPTIONSGREEKSHISTORY = gql`
          query findManyOptionsGreeksHistory($where: OptionsGreeksHistoryWhereInput!) {
            optionsGreeksHistories(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
  contractId: props.contractId !== undefined ? {
    equals: props.contractId 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyOptionsGreeksHistory requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_OPTIONSGREEKSHISTORY,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.optionsGreeksHistories) {
          return response.data.optionsGreeksHistories;
        } else {
          return [] as OptionsGreeksHistoryType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsGreeksHistory found') {
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
          logger.warn("Database connection error in findManyOptionsGreeksHistory, retrying...", {
            operation: 'findManyOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyOptionsGreeksHistory',
            model: 'OptionsGreeksHistory',
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

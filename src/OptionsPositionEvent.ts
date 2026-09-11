
  
import { OptionsPositionEvent as OptionsPositionEventType } from './generated/typegraphql-prisma/models/OptionsPositionEvent';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the OptionsPositionEvent model.
   */

  const selectionSet = `
    
  id
  positionId
  position {
    id
    alpacaAccountId
    contractId
    status
    openingSide
    quantity
    entryPrice
    entryCost
    entryTime
    exitPrice
    exitValue
    exitTime
    currentPrice
    currentValue
    unrealizedPnL
    unrealizedPnLPercent
    realizedPnL
    realizedPnLPercent
    totalFees
    currentDelta
    currentGamma
    currentTheta
    currentVega
    currentRho
    currentImpliedVolatility
    daysHeld
    exitReason
    strategyType
    tradeId
    metadata
    lifecycleState
    exitThresholds
    linkedRollId
    createdAt
    updatedAt
  }
  fromState
  toState
  trigger
  metadata
  createdAt

  `;

  export const OptionsPositionEvent = {

    /**
     * Create a new OptionsPositionEvent record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created OptionsPositionEvent or null.
     */

    /**
     * Create a new OptionsPositionEvent record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created OptionsPositionEvent or null.
     */
    async create(props: OptionsPositionEventType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsPositionEventType> {
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

          const CREATE_ONE_OPTIONSPOSITIONEVENT = gql`
              mutation createOneOptionsPositionEvent($data: OptionsPositionEventCreateInput!) {
                createOneOptionsPositionEvent(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                fromState: props.fromState !== undefined ? props.fromState : undefined,
  toState: props.toState !== undefined ? props.toState : undefined,
  trigger: props.trigger !== undefined ? props.trigger : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  position: props.position ? 
    typeof props.position === 'object' && Object.keys(props.position).length === 1 && Object.keys(props.position)[0] === 'id'
    ? { connect: {
        id: props.position.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.position.id !== undefined ? props.position.id : undefined,
        alpacaAccountId: props.position.alpacaAccountId !== undefined ? {
            equals: props.position.alpacaAccountId 
           } : undefined,
        contractId: props.position.contractId !== undefined ? {
            equals: props.position.contractId 
           } : undefined,
        status: props.position.status !== undefined ? {
            equals: props.position.status 
           } : undefined,
      },
      create: {
        alpacaAccountId: props.position.alpacaAccountId !== undefined ? props.position.alpacaAccountId : undefined,
        status: props.position.status !== undefined ? props.position.status : undefined,
        openingSide: props.position.openingSide !== undefined ? props.position.openingSide : undefined,
        quantity: props.position.quantity !== undefined ? props.position.quantity : undefined,
        entryPrice: props.position.entryPrice !== undefined ? props.position.entryPrice : undefined,
        entryCost: props.position.entryCost !== undefined ? props.position.entryCost : undefined,
        entryTime: props.position.entryTime !== undefined ? props.position.entryTime : undefined,
        exitPrice: props.position.exitPrice !== undefined ? props.position.exitPrice : undefined,
        exitValue: props.position.exitValue !== undefined ? props.position.exitValue : undefined,
        exitTime: props.position.exitTime !== undefined ? props.position.exitTime : undefined,
        currentPrice: props.position.currentPrice !== undefined ? props.position.currentPrice : undefined,
        currentValue: props.position.currentValue !== undefined ? props.position.currentValue : undefined,
        unrealizedPnL: props.position.unrealizedPnL !== undefined ? props.position.unrealizedPnL : undefined,
        unrealizedPnLPercent: props.position.unrealizedPnLPercent !== undefined ? props.position.unrealizedPnLPercent : undefined,
        realizedPnL: props.position.realizedPnL !== undefined ? props.position.realizedPnL : undefined,
        realizedPnLPercent: props.position.realizedPnLPercent !== undefined ? props.position.realizedPnLPercent : undefined,
        totalFees: props.position.totalFees !== undefined ? props.position.totalFees : undefined,
        currentDelta: props.position.currentDelta !== undefined ? props.position.currentDelta : undefined,
        currentGamma: props.position.currentGamma !== undefined ? props.position.currentGamma : undefined,
        currentTheta: props.position.currentTheta !== undefined ? props.position.currentTheta : undefined,
        currentVega: props.position.currentVega !== undefined ? props.position.currentVega : undefined,
        currentRho: props.position.currentRho !== undefined ? props.position.currentRho : undefined,
        currentImpliedVolatility: props.position.currentImpliedVolatility !== undefined ? props.position.currentImpliedVolatility : undefined,
        daysHeld: props.position.daysHeld !== undefined ? props.position.daysHeld : undefined,
        exitReason: props.position.exitReason !== undefined ? props.position.exitReason : undefined,
        strategyType: props.position.strategyType !== undefined ? props.position.strategyType : undefined,
        tradeId: props.position.tradeId !== undefined ? props.position.tradeId : undefined,
        metadata: props.position.metadata !== undefined ? props.position.metadata : undefined,
        lifecycleState: props.position.lifecycleState !== undefined ? props.position.lifecycleState : undefined,
        exitThresholds: props.position.exitThresholds !== undefined ? props.position.exitThresholds : undefined,
        linkedRollId: props.position.linkedRollId !== undefined ? props.position.linkedRollId : undefined,
    contract: props.position.contract ? 
      typeof props.position.contract === 'object' && Object.keys(props.position.contract).length === 1 && Object.keys(props.position.contract)[0] === 'id'
    ? { connect: {
          id: props.position.contract.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.position.contract.id !== undefined ? props.position.contract.id : undefined,
          symbol: props.position.contract.symbol !== undefined ? {
              equals: props.position.contract.symbol 
             } : undefined,
        },
        create: {
          symbol: props.position.contract.symbol !== undefined ? props.position.contract.symbol : undefined,
          contractSymbol: props.position.contract.contractSymbol !== undefined ? props.position.contract.contractSymbol : undefined,
          optionType: props.position.contract.optionType !== undefined ? props.position.contract.optionType : undefined,
          strikePrice: props.position.contract.strikePrice !== undefined ? props.position.contract.strikePrice : undefined,
          expirationDate: props.position.contract.expirationDate !== undefined ? props.position.contract.expirationDate : undefined,
          daysToExpiration: props.position.contract.daysToExpiration !== undefined ? props.position.contract.daysToExpiration : undefined,
          lastPrice: props.position.contract.lastPrice !== undefined ? props.position.contract.lastPrice : undefined,
          bidPrice: props.position.contract.bidPrice !== undefined ? props.position.contract.bidPrice : undefined,
          askPrice: props.position.contract.askPrice !== undefined ? props.position.contract.askPrice : undefined,
          midPrice: props.position.contract.midPrice !== undefined ? props.position.contract.midPrice : undefined,
          bidSize: props.position.contract.bidSize !== undefined ? props.position.contract.bidSize : undefined,
          askSize: props.position.contract.askSize !== undefined ? props.position.contract.askSize : undefined,
          volume: props.position.contract.volume !== undefined ? props.position.contract.volume : undefined,
          openInterest: props.position.contract.openInterest !== undefined ? props.position.contract.openInterest : undefined,
          impliedVolatility: props.position.contract.impliedVolatility !== undefined ? props.position.contract.impliedVolatility : undefined,
          delta: props.position.contract.delta !== undefined ? props.position.contract.delta : undefined,
          gamma: props.position.contract.gamma !== undefined ? props.position.contract.gamma : undefined,
          theta: props.position.contract.theta !== undefined ? props.position.contract.theta : undefined,
          vega: props.position.contract.vega !== undefined ? props.position.contract.vega : undefined,
          rho: props.position.contract.rho !== undefined ? props.position.contract.rho : undefined,
          inTheMoney: props.position.contract.inTheMoney !== undefined ? props.position.contract.inTheMoney : undefined,
          intrinsicValue: props.position.contract.intrinsicValue !== undefined ? props.position.contract.intrinsicValue : undefined,
          extrinsicValue: props.position.contract.extrinsicValue !== undefined ? props.position.contract.extrinsicValue : undefined,
          theoreticalPrice: props.position.contract.theoreticalPrice !== undefined ? props.position.contract.theoreticalPrice : undefined,
          underlyingPrice: props.position.contract.underlyingPrice !== undefined ? props.position.contract.underlyingPrice : undefined,
          metadata: props.position.contract.metadata !== undefined ? props.position.contract.metadata : undefined,
          dataTimestamp: props.position.contract.dataTimestamp !== undefined ? props.position.contract.dataTimestamp : undefined,
      greeksHistory: props.position.contract.greeksHistory ? 
        Array.isArray(props.position.contract.greeksHistory) && props.position.contract.greeksHistory.length > 0 &&  props.position.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.greeksHistory.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
          },
          create: {
            timestamp: item.timestamp !== undefined ? item.timestamp : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? item.underlyingPrice : undefined,
            optionPrice: item.optionPrice !== undefined ? item.optionPrice : undefined,
            bidPrice: item.bidPrice !== undefined ? item.bidPrice : undefined,
            askPrice: item.askPrice !== undefined ? item.askPrice : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? item.impliedVolatility : undefined,
            delta: item.delta !== undefined ? item.delta : undefined,
            gamma: item.gamma !== undefined ? item.gamma : undefined,
            theta: item.theta !== undefined ? item.theta : undefined,
            vega: item.vega !== undefined ? item.vega : undefined,
            rho: item.rho !== undefined ? item.rho : undefined,
            volume: item.volume !== undefined ? item.volume : undefined,
            openInterest: item.openInterest !== undefined ? item.openInterest : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? item.daysToExpiration : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? item.intrinsicValue : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? item.extrinsicValue : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      executions: props.position.contract.executions ? 
        Array.isArray(props.position.contract.executions) && props.position.contract.executions.length > 0 &&  props.position.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.executions.map((item) => ({
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
        },
      }
    } : undefined,
    executions: props.position.executions ? 
      Array.isArray(props.position.executions) && props.position.executions.length > 0 &&  props.position.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.position.executions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.position.executions.map((item) => ({
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
      contract: item.contract ? 
        typeof item.contract === 'object' && Object.keys(item.contract).length === 1 && Object.keys(item.contract)[0] === 'id'
    ? { connect: {
            id: item.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.contract.id !== undefined ? item.contract.id : undefined,
            symbol: item.contract.symbol !== undefined ? {
                equals: item.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.contract.symbol !== undefined ? item.contract.symbol : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? item.contract.contractSymbol : undefined,
            optionType: item.contract.optionType !== undefined ? item.contract.optionType : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? item.contract.strikePrice : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? item.contract.expirationDate : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? item.contract.daysToExpiration : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? item.contract.lastPrice : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? item.contract.bidPrice : undefined,
            askPrice: item.contract.askPrice !== undefined ? item.contract.askPrice : undefined,
            midPrice: item.contract.midPrice !== undefined ? item.contract.midPrice : undefined,
            bidSize: item.contract.bidSize !== undefined ? item.contract.bidSize : undefined,
            askSize: item.contract.askSize !== undefined ? item.contract.askSize : undefined,
            volume: item.contract.volume !== undefined ? item.contract.volume : undefined,
            openInterest: item.contract.openInterest !== undefined ? item.contract.openInterest : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? item.contract.impliedVolatility : undefined,
            delta: item.contract.delta !== undefined ? item.contract.delta : undefined,
            gamma: item.contract.gamma !== undefined ? item.contract.gamma : undefined,
            theta: item.contract.theta !== undefined ? item.contract.theta : undefined,
            vega: item.contract.vega !== undefined ? item.contract.vega : undefined,
            rho: item.contract.rho !== undefined ? item.contract.rho : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? item.contract.inTheMoney : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? item.contract.intrinsicValue : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? item.contract.extrinsicValue : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? item.contract.theoreticalPrice : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? item.contract.underlyingPrice : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? item.contract.dataTimestamp : undefined,
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
            mutation: CREATE_ONE_OPTIONSPOSITIONEVENT,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneOptionsPositionEvent) {
            return response.data.createOneOptionsPositionEvent;
          } else {
            return null as unknown as OptionsPositionEventType;
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
            logger.error("Non-retryable constraint violation in createOneOptionsPositionEvent", {
              operation: 'createOneOptionsPositionEvent',
              model: 'OptionsPositionEvent',
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
            logger.warn("Database connection error in createOneOptionsPositionEvent, retrying...", {
              operation: 'createOneOptionsPositionEvent',
              model: 'OptionsPositionEvent',
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
              operation: 'createOneOptionsPositionEvent',
              model: 'OptionsPositionEvent',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneOptionsPositionEvent',
              model: 'OptionsPositionEvent',
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
   * Create multiple OptionsPositionEvent records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of OptionsPositionEvent objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: OptionsPositionEventType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_OPTIONSPOSITIONEVENT = gql`
          mutation createManyOptionsPositionEvent($data: [OptionsPositionEventCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyOptionsPositionEvent(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      positionId: prop.positionId !== undefined ? prop.positionId : undefined,
  fromState: prop.fromState !== undefined ? prop.fromState : undefined,
  toState: prop.toState !== undefined ? prop.toState : undefined,
  trigger: prop.trigger !== undefined ? prop.trigger : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_OPTIONSPOSITIONEVENT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyOptionsPositionEvent) {
          return response.data.createManyOptionsPositionEvent;
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
          logger.warn("Duplicate key in createManyOptionsPositionEvent (expected during overlapping fetches)", {
            operation: 'createManyOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
          logger.warn("Database connection error in createManyOptionsPositionEvent, retrying...", {
            operation: 'createManyOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
   * Update a single OptionsPositionEvent record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated OptionsPositionEvent or null.
   */
  async update(props: OptionsPositionEventType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsPositionEventType> {
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

        const UPDATE_ONE_OPTIONSPOSITIONEVENT = gql`
          mutation updateOneOptionsPositionEvent($data: OptionsPositionEventUpdateInput!, $where: OptionsPositionEventWhereUniqueInput!) {
            updateOneOptionsPositionEvent(data: $data, where: $where) {
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
  fromState: props.fromState !== undefined ? {
            set: props.fromState 
           } : undefined,
  toState: props.toState !== undefined ? {
            set: props.toState 
           } : undefined,
  trigger: props.trigger !== undefined ? {
            set: props.trigger 
           } : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  position: props.position ? 
  typeof props.position === 'object' && Object.keys(props.position).length === 1 && (Object.keys(props.position)[0] === 'id' || Object.keys(props.position)[0] === 'symbol')
? {
  connect: {
    id: props.position.id
  }
} : { upsert: {
      where: {
        id: props.position.id !== undefined ? {
            equals: props.position.id
          } : undefined,
        alpacaAccountId: props.position.alpacaAccountId !== undefined ? {
            equals: props.position.alpacaAccountId
          } : undefined,
        contractId: props.position.contractId !== undefined ? {
            equals: props.position.contractId
          } : undefined,
        status: props.position.status !== undefined ? {
            equals: props.position.status
          } : undefined,
        tradeId: props.position.tradeId !== undefined ? {
            equals: props.position.tradeId
          } : undefined,
        linkedRollId: props.position.linkedRollId !== undefined ? {
            equals: props.position.linkedRollId
          } : undefined,
      },
      update: {
        id: props.position.id !== undefined ? {
            set: props.position.id
          } : undefined,
        alpacaAccountId: props.position.alpacaAccountId !== undefined ? {
            set: props.position.alpacaAccountId
          } : undefined,
        status: props.position.status !== undefined ? {
            set: props.position.status
          } : undefined,
        openingSide: props.position.openingSide !== undefined ? {
            set: props.position.openingSide
          } : undefined,
        quantity: props.position.quantity !== undefined ? {
            set: props.position.quantity
          } : undefined,
        entryPrice: props.position.entryPrice !== undefined ? {
            set: props.position.entryPrice
          } : undefined,
        entryCost: props.position.entryCost !== undefined ? {
            set: props.position.entryCost
          } : undefined,
        entryTime: props.position.entryTime !== undefined ? {
            set: props.position.entryTime
          } : undefined,
        exitPrice: props.position.exitPrice !== undefined ? {
            set: props.position.exitPrice
          } : undefined,
        exitValue: props.position.exitValue !== undefined ? {
            set: props.position.exitValue
          } : undefined,
        exitTime: props.position.exitTime !== undefined ? {
            set: props.position.exitTime
          } : undefined,
        currentPrice: props.position.currentPrice !== undefined ? {
            set: props.position.currentPrice
          } : undefined,
        currentValue: props.position.currentValue !== undefined ? {
            set: props.position.currentValue
          } : undefined,
        unrealizedPnL: props.position.unrealizedPnL !== undefined ? {
            set: props.position.unrealizedPnL
          } : undefined,
        unrealizedPnLPercent: props.position.unrealizedPnLPercent !== undefined ? {
            set: props.position.unrealizedPnLPercent
          } : undefined,
        realizedPnL: props.position.realizedPnL !== undefined ? {
            set: props.position.realizedPnL
          } : undefined,
        realizedPnLPercent: props.position.realizedPnLPercent !== undefined ? {
            set: props.position.realizedPnLPercent
          } : undefined,
        totalFees: props.position.totalFees !== undefined ? {
            set: props.position.totalFees
          } : undefined,
        currentDelta: props.position.currentDelta !== undefined ? {
            set: props.position.currentDelta
          } : undefined,
        currentGamma: props.position.currentGamma !== undefined ? {
            set: props.position.currentGamma
          } : undefined,
        currentTheta: props.position.currentTheta !== undefined ? {
            set: props.position.currentTheta
          } : undefined,
        currentVega: props.position.currentVega !== undefined ? {
            set: props.position.currentVega
          } : undefined,
        currentRho: props.position.currentRho !== undefined ? {
            set: props.position.currentRho
          } : undefined,
        currentImpliedVolatility: props.position.currentImpliedVolatility !== undefined ? {
            set: props.position.currentImpliedVolatility
          } : undefined,
        daysHeld: props.position.daysHeld !== undefined ? {
            set: props.position.daysHeld
          } : undefined,
        exitReason: props.position.exitReason !== undefined ? {
            set: props.position.exitReason
          } : undefined,
        strategyType: props.position.strategyType !== undefined ? {
            set: props.position.strategyType
          } : undefined,
        tradeId: props.position.tradeId !== undefined ? {
            set: props.position.tradeId
          } : undefined,
        metadata: props.position.metadata !== undefined ? props.position.metadata : undefined,
        lifecycleState: props.position.lifecycleState !== undefined ? {
            set: props.position.lifecycleState
          } : undefined,
        exitThresholds: props.position.exitThresholds !== undefined ? props.position.exitThresholds : undefined,
        linkedRollId: props.position.linkedRollId !== undefined ? {
            set: props.position.linkedRollId
          } : undefined,
    contract: props.position.contract ? 
    typeof props.position.contract === 'object' && Object.keys(props.position.contract).length === 1 && (Object.keys(props.position.contract)[0] === 'id' || Object.keys(props.position.contract)[0] === 'symbol')
? {
    connect: {
      id: props.position.contract.id
    }
} : { upsert: {
        where: {
          id: props.position.contract.id !== undefined ? {
              equals: props.position.contract.id
            } : undefined,
          symbol: props.position.contract.symbol !== undefined ? {
              equals: props.position.contract.symbol
            } : undefined,
        },
        update: {
          id: props.position.contract.id !== undefined ? {
              set: props.position.contract.id
            } : undefined,
          symbol: props.position.contract.symbol !== undefined ? {
              set: props.position.contract.symbol
            } : undefined,
          contractSymbol: props.position.contract.contractSymbol !== undefined ? {
              set: props.position.contract.contractSymbol
            } : undefined,
          optionType: props.position.contract.optionType !== undefined ? {
              set: props.position.contract.optionType
            } : undefined,
          strikePrice: props.position.contract.strikePrice !== undefined ? {
              set: props.position.contract.strikePrice
            } : undefined,
          expirationDate: props.position.contract.expirationDate !== undefined ? {
              set: props.position.contract.expirationDate
            } : undefined,
          daysToExpiration: props.position.contract.daysToExpiration !== undefined ? {
              set: props.position.contract.daysToExpiration
            } : undefined,
          lastPrice: props.position.contract.lastPrice !== undefined ? {
              set: props.position.contract.lastPrice
            } : undefined,
          bidPrice: props.position.contract.bidPrice !== undefined ? {
              set: props.position.contract.bidPrice
            } : undefined,
          askPrice: props.position.contract.askPrice !== undefined ? {
              set: props.position.contract.askPrice
            } : undefined,
          midPrice: props.position.contract.midPrice !== undefined ? {
              set: props.position.contract.midPrice
            } : undefined,
          bidSize: props.position.contract.bidSize !== undefined ? {
              set: props.position.contract.bidSize
            } : undefined,
          askSize: props.position.contract.askSize !== undefined ? {
              set: props.position.contract.askSize
            } : undefined,
          volume: props.position.contract.volume !== undefined ? {
              set: props.position.contract.volume
            } : undefined,
          openInterest: props.position.contract.openInterest !== undefined ? {
              set: props.position.contract.openInterest
            } : undefined,
          impliedVolatility: props.position.contract.impliedVolatility !== undefined ? {
              set: props.position.contract.impliedVolatility
            } : undefined,
          delta: props.position.contract.delta !== undefined ? {
              set: props.position.contract.delta
            } : undefined,
          gamma: props.position.contract.gamma !== undefined ? {
              set: props.position.contract.gamma
            } : undefined,
          theta: props.position.contract.theta !== undefined ? {
              set: props.position.contract.theta
            } : undefined,
          vega: props.position.contract.vega !== undefined ? {
              set: props.position.contract.vega
            } : undefined,
          rho: props.position.contract.rho !== undefined ? {
              set: props.position.contract.rho
            } : undefined,
          inTheMoney: props.position.contract.inTheMoney !== undefined ? {
              set: props.position.contract.inTheMoney
            } : undefined,
          intrinsicValue: props.position.contract.intrinsicValue !== undefined ? {
              set: props.position.contract.intrinsicValue
            } : undefined,
          extrinsicValue: props.position.contract.extrinsicValue !== undefined ? {
              set: props.position.contract.extrinsicValue
            } : undefined,
          theoreticalPrice: props.position.contract.theoreticalPrice !== undefined ? {
              set: props.position.contract.theoreticalPrice
            } : undefined,
          underlyingPrice: props.position.contract.underlyingPrice !== undefined ? {
              set: props.position.contract.underlyingPrice
            } : undefined,
          metadata: props.position.contract.metadata !== undefined ? props.position.contract.metadata : undefined,
          dataTimestamp: props.position.contract.dataTimestamp !== undefined ? {
              set: props.position.contract.dataTimestamp
            } : undefined,
      greeksHistory: props.position.contract.greeksHistory ? 
      Array.isArray(props.position.contract.greeksHistory) && props.position.contract.greeksHistory.length > 0 && props.position.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.position.contract.greeksHistory.map((item) => ({
        id: item.id
      }))
} : { upsert: props.position.contract.greeksHistory.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            timestamp: item.timestamp !== undefined ? {
                set: item.timestamp
              } : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? {
                set: item.underlyingPrice
              } : undefined,
            optionPrice: item.optionPrice !== undefined ? {
                set: item.optionPrice
              } : undefined,
            bidPrice: item.bidPrice !== undefined ? {
                set: item.bidPrice
              } : undefined,
            askPrice: item.askPrice !== undefined ? {
                set: item.askPrice
              } : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? {
                set: item.impliedVolatility
              } : undefined,
            delta: item.delta !== undefined ? {
                set: item.delta
              } : undefined,
            gamma: item.gamma !== undefined ? {
                set: item.gamma
              } : undefined,
            theta: item.theta !== undefined ? {
                set: item.theta
              } : undefined,
            vega: item.vega !== undefined ? {
                set: item.vega
              } : undefined,
            rho: item.rho !== undefined ? {
                set: item.rho
              } : undefined,
            volume: item.volume !== undefined ? {
                set: item.volume
              } : undefined,
            openInterest: item.openInterest !== undefined ? {
                set: item.openInterest
              } : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? {
                set: item.daysToExpiration
              } : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? {
                set: item.intrinsicValue
              } : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? {
                set: item.extrinsicValue
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            timestamp: item.timestamp !== undefined ? item.timestamp : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? item.underlyingPrice : undefined,
            optionPrice: item.optionPrice !== undefined ? item.optionPrice : undefined,
            bidPrice: item.bidPrice !== undefined ? item.bidPrice : undefined,
            askPrice: item.askPrice !== undefined ? item.askPrice : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? item.impliedVolatility : undefined,
            delta: item.delta !== undefined ? item.delta : undefined,
            gamma: item.gamma !== undefined ? item.gamma : undefined,
            theta: item.theta !== undefined ? item.theta : undefined,
            vega: item.vega !== undefined ? item.vega : undefined,
            rho: item.rho !== undefined ? item.rho : undefined,
            volume: item.volume !== undefined ? item.volume : undefined,
            openInterest: item.openInterest !== undefined ? item.openInterest : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? item.daysToExpiration : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? item.intrinsicValue : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? item.extrinsicValue : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      executions: props.position.contract.executions ? 
      Array.isArray(props.position.contract.executions) && props.position.contract.executions.length > 0 && props.position.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.position.contract.executions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.position.contract.executions.map((item) => ({
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
        },
        create: {
          symbol: props.position.contract.symbol !== undefined ? props.position.contract.symbol : undefined,
          contractSymbol: props.position.contract.contractSymbol !== undefined ? props.position.contract.contractSymbol : undefined,
          optionType: props.position.contract.optionType !== undefined ? props.position.contract.optionType : undefined,
          strikePrice: props.position.contract.strikePrice !== undefined ? props.position.contract.strikePrice : undefined,
          expirationDate: props.position.contract.expirationDate !== undefined ? props.position.contract.expirationDate : undefined,
          daysToExpiration: props.position.contract.daysToExpiration !== undefined ? props.position.contract.daysToExpiration : undefined,
          lastPrice: props.position.contract.lastPrice !== undefined ? props.position.contract.lastPrice : undefined,
          bidPrice: props.position.contract.bidPrice !== undefined ? props.position.contract.bidPrice : undefined,
          askPrice: props.position.contract.askPrice !== undefined ? props.position.contract.askPrice : undefined,
          midPrice: props.position.contract.midPrice !== undefined ? props.position.contract.midPrice : undefined,
          bidSize: props.position.contract.bidSize !== undefined ? props.position.contract.bidSize : undefined,
          askSize: props.position.contract.askSize !== undefined ? props.position.contract.askSize : undefined,
          volume: props.position.contract.volume !== undefined ? props.position.contract.volume : undefined,
          openInterest: props.position.contract.openInterest !== undefined ? props.position.contract.openInterest : undefined,
          impliedVolatility: props.position.contract.impliedVolatility !== undefined ? props.position.contract.impliedVolatility : undefined,
          delta: props.position.contract.delta !== undefined ? props.position.contract.delta : undefined,
          gamma: props.position.contract.gamma !== undefined ? props.position.contract.gamma : undefined,
          theta: props.position.contract.theta !== undefined ? props.position.contract.theta : undefined,
          vega: props.position.contract.vega !== undefined ? props.position.contract.vega : undefined,
          rho: props.position.contract.rho !== undefined ? props.position.contract.rho : undefined,
          inTheMoney: props.position.contract.inTheMoney !== undefined ? props.position.contract.inTheMoney : undefined,
          intrinsicValue: props.position.contract.intrinsicValue !== undefined ? props.position.contract.intrinsicValue : undefined,
          extrinsicValue: props.position.contract.extrinsicValue !== undefined ? props.position.contract.extrinsicValue : undefined,
          theoreticalPrice: props.position.contract.theoreticalPrice !== undefined ? props.position.contract.theoreticalPrice : undefined,
          underlyingPrice: props.position.contract.underlyingPrice !== undefined ? props.position.contract.underlyingPrice : undefined,
          metadata: props.position.contract.metadata !== undefined ? props.position.contract.metadata : undefined,
          dataTimestamp: props.position.contract.dataTimestamp !== undefined ? props.position.contract.dataTimestamp : undefined,
      greeksHistory: props.position.contract.greeksHistory ? 
        Array.isArray(props.position.contract.greeksHistory) && props.position.contract.greeksHistory.length > 0 &&  props.position.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.greeksHistory.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
          },
          create: {
            timestamp: item.timestamp !== undefined ? item.timestamp : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? item.underlyingPrice : undefined,
            optionPrice: item.optionPrice !== undefined ? item.optionPrice : undefined,
            bidPrice: item.bidPrice !== undefined ? item.bidPrice : undefined,
            askPrice: item.askPrice !== undefined ? item.askPrice : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? item.impliedVolatility : undefined,
            delta: item.delta !== undefined ? item.delta : undefined,
            gamma: item.gamma !== undefined ? item.gamma : undefined,
            theta: item.theta !== undefined ? item.theta : undefined,
            vega: item.vega !== undefined ? item.vega : undefined,
            rho: item.rho !== undefined ? item.rho : undefined,
            volume: item.volume !== undefined ? item.volume : undefined,
            openInterest: item.openInterest !== undefined ? item.openInterest : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? item.daysToExpiration : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? item.intrinsicValue : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? item.extrinsicValue : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      executions: props.position.contract.executions ? 
        Array.isArray(props.position.contract.executions) && props.position.contract.executions.length > 0 &&  props.position.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.executions.map((item) => ({
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
        },
      }
    } : undefined,
    executions: props.position.executions ? 
    Array.isArray(props.position.executions) && props.position.executions.length > 0 && props.position.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.position.executions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.position.executions.map((item) => ({
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
      contract: item.contract ? 
      typeof item.contract === 'object' && Object.keys(item.contract).length === 1 && (Object.keys(item.contract)[0] === 'id' || Object.keys(item.contract)[0] === 'symbol')
? {
      connect: {
        id: item.contract.id
      }
} : { upsert: {
          where: {
            id: item.contract.id !== undefined ? {
                equals: item.contract.id
              } : undefined,
            symbol: item.contract.symbol !== undefined ? {
                equals: item.contract.symbol
              } : undefined,
          },
          update: {
            id: item.contract.id !== undefined ? {
                set: item.contract.id
              } : undefined,
            symbol: item.contract.symbol !== undefined ? {
                set: item.contract.symbol
              } : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? {
                set: item.contract.contractSymbol
              } : undefined,
            optionType: item.contract.optionType !== undefined ? {
                set: item.contract.optionType
              } : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? {
                set: item.contract.strikePrice
              } : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? {
                set: item.contract.expirationDate
              } : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? {
                set: item.contract.daysToExpiration
              } : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? {
                set: item.contract.lastPrice
              } : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? {
                set: item.contract.bidPrice
              } : undefined,
            askPrice: item.contract.askPrice !== undefined ? {
                set: item.contract.askPrice
              } : undefined,
            midPrice: item.contract.midPrice !== undefined ? {
                set: item.contract.midPrice
              } : undefined,
            bidSize: item.contract.bidSize !== undefined ? {
                set: item.contract.bidSize
              } : undefined,
            askSize: item.contract.askSize !== undefined ? {
                set: item.contract.askSize
              } : undefined,
            volume: item.contract.volume !== undefined ? {
                set: item.contract.volume
              } : undefined,
            openInterest: item.contract.openInterest !== undefined ? {
                set: item.contract.openInterest
              } : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? {
                set: item.contract.impliedVolatility
              } : undefined,
            delta: item.contract.delta !== undefined ? {
                set: item.contract.delta
              } : undefined,
            gamma: item.contract.gamma !== undefined ? {
                set: item.contract.gamma
              } : undefined,
            theta: item.contract.theta !== undefined ? {
                set: item.contract.theta
              } : undefined,
            vega: item.contract.vega !== undefined ? {
                set: item.contract.vega
              } : undefined,
            rho: item.contract.rho !== undefined ? {
                set: item.contract.rho
              } : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? {
                set: item.contract.inTheMoney
              } : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? {
                set: item.contract.intrinsicValue
              } : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? {
                set: item.contract.extrinsicValue
              } : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? {
                set: item.contract.theoreticalPrice
              } : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? {
                set: item.contract.underlyingPrice
              } : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? {
                set: item.contract.dataTimestamp
              } : undefined,
          },
          create: {
            symbol: item.contract.symbol !== undefined ? item.contract.symbol : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? item.contract.contractSymbol : undefined,
            optionType: item.contract.optionType !== undefined ? item.contract.optionType : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? item.contract.strikePrice : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? item.contract.expirationDate : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? item.contract.daysToExpiration : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? item.contract.lastPrice : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? item.contract.bidPrice : undefined,
            askPrice: item.contract.askPrice !== undefined ? item.contract.askPrice : undefined,
            midPrice: item.contract.midPrice !== undefined ? item.contract.midPrice : undefined,
            bidSize: item.contract.bidSize !== undefined ? item.contract.bidSize : undefined,
            askSize: item.contract.askSize !== undefined ? item.contract.askSize : undefined,
            volume: item.contract.volume !== undefined ? item.contract.volume : undefined,
            openInterest: item.contract.openInterest !== undefined ? item.contract.openInterest : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? item.contract.impliedVolatility : undefined,
            delta: item.contract.delta !== undefined ? item.contract.delta : undefined,
            gamma: item.contract.gamma !== undefined ? item.contract.gamma : undefined,
            theta: item.contract.theta !== undefined ? item.contract.theta : undefined,
            vega: item.contract.vega !== undefined ? item.contract.vega : undefined,
            rho: item.contract.rho !== undefined ? item.contract.rho : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? item.contract.inTheMoney : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? item.contract.intrinsicValue : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? item.contract.extrinsicValue : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? item.contract.theoreticalPrice : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? item.contract.underlyingPrice : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? item.contract.dataTimestamp : undefined,
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
      contract: item.contract ? 
        typeof item.contract === 'object' && Object.keys(item.contract).length === 1 && Object.keys(item.contract)[0] === 'id'
    ? { connect: {
            id: item.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.contract.id !== undefined ? item.contract.id : undefined,
            symbol: item.contract.symbol !== undefined ? {
                equals: item.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.contract.symbol !== undefined ? item.contract.symbol : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? item.contract.contractSymbol : undefined,
            optionType: item.contract.optionType !== undefined ? item.contract.optionType : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? item.contract.strikePrice : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? item.contract.expirationDate : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? item.contract.daysToExpiration : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? item.contract.lastPrice : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? item.contract.bidPrice : undefined,
            askPrice: item.contract.askPrice !== undefined ? item.contract.askPrice : undefined,
            midPrice: item.contract.midPrice !== undefined ? item.contract.midPrice : undefined,
            bidSize: item.contract.bidSize !== undefined ? item.contract.bidSize : undefined,
            askSize: item.contract.askSize !== undefined ? item.contract.askSize : undefined,
            volume: item.contract.volume !== undefined ? item.contract.volume : undefined,
            openInterest: item.contract.openInterest !== undefined ? item.contract.openInterest : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? item.contract.impliedVolatility : undefined,
            delta: item.contract.delta !== undefined ? item.contract.delta : undefined,
            gamma: item.contract.gamma !== undefined ? item.contract.gamma : undefined,
            theta: item.contract.theta !== undefined ? item.contract.theta : undefined,
            vega: item.contract.vega !== undefined ? item.contract.vega : undefined,
            rho: item.contract.rho !== undefined ? item.contract.rho : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? item.contract.inTheMoney : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? item.contract.intrinsicValue : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? item.contract.extrinsicValue : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? item.contract.theoreticalPrice : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? item.contract.underlyingPrice : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? item.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        alpacaAccountId: props.position.alpacaAccountId !== undefined ? props.position.alpacaAccountId : undefined,
        status: props.position.status !== undefined ? props.position.status : undefined,
        openingSide: props.position.openingSide !== undefined ? props.position.openingSide : undefined,
        quantity: props.position.quantity !== undefined ? props.position.quantity : undefined,
        entryPrice: props.position.entryPrice !== undefined ? props.position.entryPrice : undefined,
        entryCost: props.position.entryCost !== undefined ? props.position.entryCost : undefined,
        entryTime: props.position.entryTime !== undefined ? props.position.entryTime : undefined,
        exitPrice: props.position.exitPrice !== undefined ? props.position.exitPrice : undefined,
        exitValue: props.position.exitValue !== undefined ? props.position.exitValue : undefined,
        exitTime: props.position.exitTime !== undefined ? props.position.exitTime : undefined,
        currentPrice: props.position.currentPrice !== undefined ? props.position.currentPrice : undefined,
        currentValue: props.position.currentValue !== undefined ? props.position.currentValue : undefined,
        unrealizedPnL: props.position.unrealizedPnL !== undefined ? props.position.unrealizedPnL : undefined,
        unrealizedPnLPercent: props.position.unrealizedPnLPercent !== undefined ? props.position.unrealizedPnLPercent : undefined,
        realizedPnL: props.position.realizedPnL !== undefined ? props.position.realizedPnL : undefined,
        realizedPnLPercent: props.position.realizedPnLPercent !== undefined ? props.position.realizedPnLPercent : undefined,
        totalFees: props.position.totalFees !== undefined ? props.position.totalFees : undefined,
        currentDelta: props.position.currentDelta !== undefined ? props.position.currentDelta : undefined,
        currentGamma: props.position.currentGamma !== undefined ? props.position.currentGamma : undefined,
        currentTheta: props.position.currentTheta !== undefined ? props.position.currentTheta : undefined,
        currentVega: props.position.currentVega !== undefined ? props.position.currentVega : undefined,
        currentRho: props.position.currentRho !== undefined ? props.position.currentRho : undefined,
        currentImpliedVolatility: props.position.currentImpliedVolatility !== undefined ? props.position.currentImpliedVolatility : undefined,
        daysHeld: props.position.daysHeld !== undefined ? props.position.daysHeld : undefined,
        exitReason: props.position.exitReason !== undefined ? props.position.exitReason : undefined,
        strategyType: props.position.strategyType !== undefined ? props.position.strategyType : undefined,
        tradeId: props.position.tradeId !== undefined ? props.position.tradeId : undefined,
        metadata: props.position.metadata !== undefined ? props.position.metadata : undefined,
        lifecycleState: props.position.lifecycleState !== undefined ? props.position.lifecycleState : undefined,
        exitThresholds: props.position.exitThresholds !== undefined ? props.position.exitThresholds : undefined,
        linkedRollId: props.position.linkedRollId !== undefined ? props.position.linkedRollId : undefined,
    contract: props.position.contract ? 
      typeof props.position.contract === 'object' && Object.keys(props.position.contract).length === 1 && Object.keys(props.position.contract)[0] === 'id'
    ? { connect: {
          id: props.position.contract.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.position.contract.id !== undefined ? props.position.contract.id : undefined,
          symbol: props.position.contract.symbol !== undefined ? {
              equals: props.position.contract.symbol 
             } : undefined,
        },
        create: {
          symbol: props.position.contract.symbol !== undefined ? props.position.contract.symbol : undefined,
          contractSymbol: props.position.contract.contractSymbol !== undefined ? props.position.contract.contractSymbol : undefined,
          optionType: props.position.contract.optionType !== undefined ? props.position.contract.optionType : undefined,
          strikePrice: props.position.contract.strikePrice !== undefined ? props.position.contract.strikePrice : undefined,
          expirationDate: props.position.contract.expirationDate !== undefined ? props.position.contract.expirationDate : undefined,
          daysToExpiration: props.position.contract.daysToExpiration !== undefined ? props.position.contract.daysToExpiration : undefined,
          lastPrice: props.position.contract.lastPrice !== undefined ? props.position.contract.lastPrice : undefined,
          bidPrice: props.position.contract.bidPrice !== undefined ? props.position.contract.bidPrice : undefined,
          askPrice: props.position.contract.askPrice !== undefined ? props.position.contract.askPrice : undefined,
          midPrice: props.position.contract.midPrice !== undefined ? props.position.contract.midPrice : undefined,
          bidSize: props.position.contract.bidSize !== undefined ? props.position.contract.bidSize : undefined,
          askSize: props.position.contract.askSize !== undefined ? props.position.contract.askSize : undefined,
          volume: props.position.contract.volume !== undefined ? props.position.contract.volume : undefined,
          openInterest: props.position.contract.openInterest !== undefined ? props.position.contract.openInterest : undefined,
          impliedVolatility: props.position.contract.impliedVolatility !== undefined ? props.position.contract.impliedVolatility : undefined,
          delta: props.position.contract.delta !== undefined ? props.position.contract.delta : undefined,
          gamma: props.position.contract.gamma !== undefined ? props.position.contract.gamma : undefined,
          theta: props.position.contract.theta !== undefined ? props.position.contract.theta : undefined,
          vega: props.position.contract.vega !== undefined ? props.position.contract.vega : undefined,
          rho: props.position.contract.rho !== undefined ? props.position.contract.rho : undefined,
          inTheMoney: props.position.contract.inTheMoney !== undefined ? props.position.contract.inTheMoney : undefined,
          intrinsicValue: props.position.contract.intrinsicValue !== undefined ? props.position.contract.intrinsicValue : undefined,
          extrinsicValue: props.position.contract.extrinsicValue !== undefined ? props.position.contract.extrinsicValue : undefined,
          theoreticalPrice: props.position.contract.theoreticalPrice !== undefined ? props.position.contract.theoreticalPrice : undefined,
          underlyingPrice: props.position.contract.underlyingPrice !== undefined ? props.position.contract.underlyingPrice : undefined,
          metadata: props.position.contract.metadata !== undefined ? props.position.contract.metadata : undefined,
          dataTimestamp: props.position.contract.dataTimestamp !== undefined ? props.position.contract.dataTimestamp : undefined,
      greeksHistory: props.position.contract.greeksHistory ? 
        Array.isArray(props.position.contract.greeksHistory) && props.position.contract.greeksHistory.length > 0 &&  props.position.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.greeksHistory.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
          },
          create: {
            timestamp: item.timestamp !== undefined ? item.timestamp : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? item.underlyingPrice : undefined,
            optionPrice: item.optionPrice !== undefined ? item.optionPrice : undefined,
            bidPrice: item.bidPrice !== undefined ? item.bidPrice : undefined,
            askPrice: item.askPrice !== undefined ? item.askPrice : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? item.impliedVolatility : undefined,
            delta: item.delta !== undefined ? item.delta : undefined,
            gamma: item.gamma !== undefined ? item.gamma : undefined,
            theta: item.theta !== undefined ? item.theta : undefined,
            vega: item.vega !== undefined ? item.vega : undefined,
            rho: item.rho !== undefined ? item.rho : undefined,
            volume: item.volume !== undefined ? item.volume : undefined,
            openInterest: item.openInterest !== undefined ? item.openInterest : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? item.daysToExpiration : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? item.intrinsicValue : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? item.extrinsicValue : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      executions: props.position.contract.executions ? 
        Array.isArray(props.position.contract.executions) && props.position.contract.executions.length > 0 &&  props.position.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.executions.map((item) => ({
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
        },
      }
    } : undefined,
    executions: props.position.executions ? 
      Array.isArray(props.position.executions) && props.position.executions.length > 0 &&  props.position.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.position.executions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.position.executions.map((item) => ({
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
      contract: item.contract ? 
        typeof item.contract === 'object' && Object.keys(item.contract).length === 1 && Object.keys(item.contract)[0] === 'id'
    ? { connect: {
            id: item.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.contract.id !== undefined ? item.contract.id : undefined,
            symbol: item.contract.symbol !== undefined ? {
                equals: item.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.contract.symbol !== undefined ? item.contract.symbol : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? item.contract.contractSymbol : undefined,
            optionType: item.contract.optionType !== undefined ? item.contract.optionType : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? item.contract.strikePrice : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? item.contract.expirationDate : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? item.contract.daysToExpiration : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? item.contract.lastPrice : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? item.contract.bidPrice : undefined,
            askPrice: item.contract.askPrice !== undefined ? item.contract.askPrice : undefined,
            midPrice: item.contract.midPrice !== undefined ? item.contract.midPrice : undefined,
            bidSize: item.contract.bidSize !== undefined ? item.contract.bidSize : undefined,
            askSize: item.contract.askSize !== undefined ? item.contract.askSize : undefined,
            volume: item.contract.volume !== undefined ? item.contract.volume : undefined,
            openInterest: item.contract.openInterest !== undefined ? item.contract.openInterest : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? item.contract.impliedVolatility : undefined,
            delta: item.contract.delta !== undefined ? item.contract.delta : undefined,
            gamma: item.contract.gamma !== undefined ? item.contract.gamma : undefined,
            theta: item.contract.theta !== undefined ? item.contract.theta : undefined,
            vega: item.contract.vega !== undefined ? item.contract.vega : undefined,
            rho: item.contract.rho !== undefined ? item.contract.rho : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? item.contract.inTheMoney : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? item.contract.intrinsicValue : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? item.contract.extrinsicValue : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? item.contract.theoreticalPrice : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? item.contract.underlyingPrice : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? item.contract.dataTimestamp : undefined,
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
          mutation: UPDATE_ONE_OPTIONSPOSITIONEVENT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneOptionsPositionEvent) {
          return response.data.updateOneOptionsPositionEvent;
        } else {
          return null as unknown as OptionsPositionEventType;
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
          logger.error("Non-retryable constraint violation in updateOneOptionsPositionEvent", {
            operation: 'updateOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
          logger.warn("Database connection error in updateOneOptionsPositionEvent, retrying...", {
            operation: 'updateOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
            operation: 'updateOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
   * Upsert a single OptionsPositionEvent record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated OptionsPositionEvent or null.
   */
  async upsert(props: OptionsPositionEventType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsPositionEventType> {
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

        const UPSERT_ONE_OPTIONSPOSITIONEVENT = gql`
          mutation upsertOneOptionsPositionEvent($where: OptionsPositionEventWhereUniqueInput!, $create: OptionsPositionEventCreateInput!, $update: OptionsPositionEventUpdateInput!) {
            upsertOneOptionsPositionEvent(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  positionId: props.positionId !== undefined ? {
    equals: props.positionId 
  } : undefined,
      },
          create: {
        fromState: props.fromState !== undefined ? props.fromState : undefined,
  toState: props.toState !== undefined ? props.toState : undefined,
  trigger: props.trigger !== undefined ? props.trigger : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  position: props.position ? 
    typeof props.position === 'object' && Object.keys(props.position).length === 1 && Object.keys(props.position)[0] === 'id'
    ? { connect: {
        id: props.position.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.position.id !== undefined ? props.position.id : undefined,
        alpacaAccountId: props.position.alpacaAccountId !== undefined ? {
            equals: props.position.alpacaAccountId 
           } : undefined,
        contractId: props.position.contractId !== undefined ? {
            equals: props.position.contractId 
           } : undefined,
        status: props.position.status !== undefined ? {
            equals: props.position.status 
           } : undefined,
      },
      create: {
        alpacaAccountId: props.position.alpacaAccountId !== undefined ? props.position.alpacaAccountId : undefined,
        status: props.position.status !== undefined ? props.position.status : undefined,
        openingSide: props.position.openingSide !== undefined ? props.position.openingSide : undefined,
        quantity: props.position.quantity !== undefined ? props.position.quantity : undefined,
        entryPrice: props.position.entryPrice !== undefined ? props.position.entryPrice : undefined,
        entryCost: props.position.entryCost !== undefined ? props.position.entryCost : undefined,
        entryTime: props.position.entryTime !== undefined ? props.position.entryTime : undefined,
        exitPrice: props.position.exitPrice !== undefined ? props.position.exitPrice : undefined,
        exitValue: props.position.exitValue !== undefined ? props.position.exitValue : undefined,
        exitTime: props.position.exitTime !== undefined ? props.position.exitTime : undefined,
        currentPrice: props.position.currentPrice !== undefined ? props.position.currentPrice : undefined,
        currentValue: props.position.currentValue !== undefined ? props.position.currentValue : undefined,
        unrealizedPnL: props.position.unrealizedPnL !== undefined ? props.position.unrealizedPnL : undefined,
        unrealizedPnLPercent: props.position.unrealizedPnLPercent !== undefined ? props.position.unrealizedPnLPercent : undefined,
        realizedPnL: props.position.realizedPnL !== undefined ? props.position.realizedPnL : undefined,
        realizedPnLPercent: props.position.realizedPnLPercent !== undefined ? props.position.realizedPnLPercent : undefined,
        totalFees: props.position.totalFees !== undefined ? props.position.totalFees : undefined,
        currentDelta: props.position.currentDelta !== undefined ? props.position.currentDelta : undefined,
        currentGamma: props.position.currentGamma !== undefined ? props.position.currentGamma : undefined,
        currentTheta: props.position.currentTheta !== undefined ? props.position.currentTheta : undefined,
        currentVega: props.position.currentVega !== undefined ? props.position.currentVega : undefined,
        currentRho: props.position.currentRho !== undefined ? props.position.currentRho : undefined,
        currentImpliedVolatility: props.position.currentImpliedVolatility !== undefined ? props.position.currentImpliedVolatility : undefined,
        daysHeld: props.position.daysHeld !== undefined ? props.position.daysHeld : undefined,
        exitReason: props.position.exitReason !== undefined ? props.position.exitReason : undefined,
        strategyType: props.position.strategyType !== undefined ? props.position.strategyType : undefined,
        tradeId: props.position.tradeId !== undefined ? props.position.tradeId : undefined,
        metadata: props.position.metadata !== undefined ? props.position.metadata : undefined,
        lifecycleState: props.position.lifecycleState !== undefined ? props.position.lifecycleState : undefined,
        exitThresholds: props.position.exitThresholds !== undefined ? props.position.exitThresholds : undefined,
        linkedRollId: props.position.linkedRollId !== undefined ? props.position.linkedRollId : undefined,
    contract: props.position.contract ? 
      typeof props.position.contract === 'object' && Object.keys(props.position.contract).length === 1 && Object.keys(props.position.contract)[0] === 'id'
    ? { connect: {
          id: props.position.contract.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.position.contract.id !== undefined ? props.position.contract.id : undefined,
          symbol: props.position.contract.symbol !== undefined ? {
              equals: props.position.contract.symbol 
             } : undefined,
        },
        create: {
          symbol: props.position.contract.symbol !== undefined ? props.position.contract.symbol : undefined,
          contractSymbol: props.position.contract.contractSymbol !== undefined ? props.position.contract.contractSymbol : undefined,
          optionType: props.position.contract.optionType !== undefined ? props.position.contract.optionType : undefined,
          strikePrice: props.position.contract.strikePrice !== undefined ? props.position.contract.strikePrice : undefined,
          expirationDate: props.position.contract.expirationDate !== undefined ? props.position.contract.expirationDate : undefined,
          daysToExpiration: props.position.contract.daysToExpiration !== undefined ? props.position.contract.daysToExpiration : undefined,
          lastPrice: props.position.contract.lastPrice !== undefined ? props.position.contract.lastPrice : undefined,
          bidPrice: props.position.contract.bidPrice !== undefined ? props.position.contract.bidPrice : undefined,
          askPrice: props.position.contract.askPrice !== undefined ? props.position.contract.askPrice : undefined,
          midPrice: props.position.contract.midPrice !== undefined ? props.position.contract.midPrice : undefined,
          bidSize: props.position.contract.bidSize !== undefined ? props.position.contract.bidSize : undefined,
          askSize: props.position.contract.askSize !== undefined ? props.position.contract.askSize : undefined,
          volume: props.position.contract.volume !== undefined ? props.position.contract.volume : undefined,
          openInterest: props.position.contract.openInterest !== undefined ? props.position.contract.openInterest : undefined,
          impliedVolatility: props.position.contract.impliedVolatility !== undefined ? props.position.contract.impliedVolatility : undefined,
          delta: props.position.contract.delta !== undefined ? props.position.contract.delta : undefined,
          gamma: props.position.contract.gamma !== undefined ? props.position.contract.gamma : undefined,
          theta: props.position.contract.theta !== undefined ? props.position.contract.theta : undefined,
          vega: props.position.contract.vega !== undefined ? props.position.contract.vega : undefined,
          rho: props.position.contract.rho !== undefined ? props.position.contract.rho : undefined,
          inTheMoney: props.position.contract.inTheMoney !== undefined ? props.position.contract.inTheMoney : undefined,
          intrinsicValue: props.position.contract.intrinsicValue !== undefined ? props.position.contract.intrinsicValue : undefined,
          extrinsicValue: props.position.contract.extrinsicValue !== undefined ? props.position.contract.extrinsicValue : undefined,
          theoreticalPrice: props.position.contract.theoreticalPrice !== undefined ? props.position.contract.theoreticalPrice : undefined,
          underlyingPrice: props.position.contract.underlyingPrice !== undefined ? props.position.contract.underlyingPrice : undefined,
          metadata: props.position.contract.metadata !== undefined ? props.position.contract.metadata : undefined,
          dataTimestamp: props.position.contract.dataTimestamp !== undefined ? props.position.contract.dataTimestamp : undefined,
      greeksHistory: props.position.contract.greeksHistory ? 
        Array.isArray(props.position.contract.greeksHistory) && props.position.contract.greeksHistory.length > 0 &&  props.position.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.greeksHistory.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
          },
          create: {
            timestamp: item.timestamp !== undefined ? item.timestamp : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? item.underlyingPrice : undefined,
            optionPrice: item.optionPrice !== undefined ? item.optionPrice : undefined,
            bidPrice: item.bidPrice !== undefined ? item.bidPrice : undefined,
            askPrice: item.askPrice !== undefined ? item.askPrice : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? item.impliedVolatility : undefined,
            delta: item.delta !== undefined ? item.delta : undefined,
            gamma: item.gamma !== undefined ? item.gamma : undefined,
            theta: item.theta !== undefined ? item.theta : undefined,
            vega: item.vega !== undefined ? item.vega : undefined,
            rho: item.rho !== undefined ? item.rho : undefined,
            volume: item.volume !== undefined ? item.volume : undefined,
            openInterest: item.openInterest !== undefined ? item.openInterest : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? item.daysToExpiration : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? item.intrinsicValue : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? item.extrinsicValue : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      executions: props.position.contract.executions ? 
        Array.isArray(props.position.contract.executions) && props.position.contract.executions.length > 0 &&  props.position.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.executions.map((item) => ({
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
        },
      }
    } : undefined,
    executions: props.position.executions ? 
      Array.isArray(props.position.executions) && props.position.executions.length > 0 &&  props.position.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.position.executions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.position.executions.map((item) => ({
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
      contract: item.contract ? 
        typeof item.contract === 'object' && Object.keys(item.contract).length === 1 && Object.keys(item.contract)[0] === 'id'
    ? { connect: {
            id: item.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.contract.id !== undefined ? item.contract.id : undefined,
            symbol: item.contract.symbol !== undefined ? {
                equals: item.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.contract.symbol !== undefined ? item.contract.symbol : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? item.contract.contractSymbol : undefined,
            optionType: item.contract.optionType !== undefined ? item.contract.optionType : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? item.contract.strikePrice : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? item.contract.expirationDate : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? item.contract.daysToExpiration : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? item.contract.lastPrice : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? item.contract.bidPrice : undefined,
            askPrice: item.contract.askPrice !== undefined ? item.contract.askPrice : undefined,
            midPrice: item.contract.midPrice !== undefined ? item.contract.midPrice : undefined,
            bidSize: item.contract.bidSize !== undefined ? item.contract.bidSize : undefined,
            askSize: item.contract.askSize !== undefined ? item.contract.askSize : undefined,
            volume: item.contract.volume !== undefined ? item.contract.volume : undefined,
            openInterest: item.contract.openInterest !== undefined ? item.contract.openInterest : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? item.contract.impliedVolatility : undefined,
            delta: item.contract.delta !== undefined ? item.contract.delta : undefined,
            gamma: item.contract.gamma !== undefined ? item.contract.gamma : undefined,
            theta: item.contract.theta !== undefined ? item.contract.theta : undefined,
            vega: item.contract.vega !== undefined ? item.contract.vega : undefined,
            rho: item.contract.rho !== undefined ? item.contract.rho : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? item.contract.inTheMoney : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? item.contract.intrinsicValue : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? item.contract.extrinsicValue : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? item.contract.theoreticalPrice : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? item.contract.underlyingPrice : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? item.contract.dataTimestamp : undefined,
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
      fromState: props.fromState !== undefined ? {
            set: props.fromState 
           } : undefined,
  toState: props.toState !== undefined ? {
            set: props.toState 
           } : undefined,
  trigger: props.trigger !== undefined ? {
            set: props.trigger 
           } : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  position: props.position ? 
  typeof props.position === 'object' && Object.keys(props.position).length === 1 && (Object.keys(props.position)[0] === 'id' || Object.keys(props.position)[0] === 'symbol')
? {
  connect: {
    id: props.position.id
  }
} : { upsert: {
      where: {
        id: props.position.id !== undefined ? {
            equals: props.position.id
          } : undefined,
        alpacaAccountId: props.position.alpacaAccountId !== undefined ? {
            equals: props.position.alpacaAccountId
          } : undefined,
        contractId: props.position.contractId !== undefined ? {
            equals: props.position.contractId
          } : undefined,
        status: props.position.status !== undefined ? {
            equals: props.position.status
          } : undefined,
        tradeId: props.position.tradeId !== undefined ? {
            equals: props.position.tradeId
          } : undefined,
        linkedRollId: props.position.linkedRollId !== undefined ? {
            equals: props.position.linkedRollId
          } : undefined,
      },
      update: {
        id: props.position.id !== undefined ? {
            set: props.position.id
          } : undefined,
        alpacaAccountId: props.position.alpacaAccountId !== undefined ? {
            set: props.position.alpacaAccountId
          } : undefined,
        status: props.position.status !== undefined ? {
            set: props.position.status
          } : undefined,
        openingSide: props.position.openingSide !== undefined ? {
            set: props.position.openingSide
          } : undefined,
        quantity: props.position.quantity !== undefined ? {
            set: props.position.quantity
          } : undefined,
        entryPrice: props.position.entryPrice !== undefined ? {
            set: props.position.entryPrice
          } : undefined,
        entryCost: props.position.entryCost !== undefined ? {
            set: props.position.entryCost
          } : undefined,
        entryTime: props.position.entryTime !== undefined ? {
            set: props.position.entryTime
          } : undefined,
        exitPrice: props.position.exitPrice !== undefined ? {
            set: props.position.exitPrice
          } : undefined,
        exitValue: props.position.exitValue !== undefined ? {
            set: props.position.exitValue
          } : undefined,
        exitTime: props.position.exitTime !== undefined ? {
            set: props.position.exitTime
          } : undefined,
        currentPrice: props.position.currentPrice !== undefined ? {
            set: props.position.currentPrice
          } : undefined,
        currentValue: props.position.currentValue !== undefined ? {
            set: props.position.currentValue
          } : undefined,
        unrealizedPnL: props.position.unrealizedPnL !== undefined ? {
            set: props.position.unrealizedPnL
          } : undefined,
        unrealizedPnLPercent: props.position.unrealizedPnLPercent !== undefined ? {
            set: props.position.unrealizedPnLPercent
          } : undefined,
        realizedPnL: props.position.realizedPnL !== undefined ? {
            set: props.position.realizedPnL
          } : undefined,
        realizedPnLPercent: props.position.realizedPnLPercent !== undefined ? {
            set: props.position.realizedPnLPercent
          } : undefined,
        totalFees: props.position.totalFees !== undefined ? {
            set: props.position.totalFees
          } : undefined,
        currentDelta: props.position.currentDelta !== undefined ? {
            set: props.position.currentDelta
          } : undefined,
        currentGamma: props.position.currentGamma !== undefined ? {
            set: props.position.currentGamma
          } : undefined,
        currentTheta: props.position.currentTheta !== undefined ? {
            set: props.position.currentTheta
          } : undefined,
        currentVega: props.position.currentVega !== undefined ? {
            set: props.position.currentVega
          } : undefined,
        currentRho: props.position.currentRho !== undefined ? {
            set: props.position.currentRho
          } : undefined,
        currentImpliedVolatility: props.position.currentImpliedVolatility !== undefined ? {
            set: props.position.currentImpliedVolatility
          } : undefined,
        daysHeld: props.position.daysHeld !== undefined ? {
            set: props.position.daysHeld
          } : undefined,
        exitReason: props.position.exitReason !== undefined ? {
            set: props.position.exitReason
          } : undefined,
        strategyType: props.position.strategyType !== undefined ? {
            set: props.position.strategyType
          } : undefined,
        tradeId: props.position.tradeId !== undefined ? {
            set: props.position.tradeId
          } : undefined,
        metadata: props.position.metadata !== undefined ? props.position.metadata : undefined,
        lifecycleState: props.position.lifecycleState !== undefined ? {
            set: props.position.lifecycleState
          } : undefined,
        exitThresholds: props.position.exitThresholds !== undefined ? props.position.exitThresholds : undefined,
        linkedRollId: props.position.linkedRollId !== undefined ? {
            set: props.position.linkedRollId
          } : undefined,
    contract: props.position.contract ? 
    typeof props.position.contract === 'object' && Object.keys(props.position.contract).length === 1 && (Object.keys(props.position.contract)[0] === 'id' || Object.keys(props.position.contract)[0] === 'symbol')
? {
    connect: {
      id: props.position.contract.id
    }
} : { upsert: {
        where: {
          id: props.position.contract.id !== undefined ? {
              equals: props.position.contract.id
            } : undefined,
          symbol: props.position.contract.symbol !== undefined ? {
              equals: props.position.contract.symbol
            } : undefined,
        },
        update: {
          id: props.position.contract.id !== undefined ? {
              set: props.position.contract.id
            } : undefined,
          symbol: props.position.contract.symbol !== undefined ? {
              set: props.position.contract.symbol
            } : undefined,
          contractSymbol: props.position.contract.contractSymbol !== undefined ? {
              set: props.position.contract.contractSymbol
            } : undefined,
          optionType: props.position.contract.optionType !== undefined ? {
              set: props.position.contract.optionType
            } : undefined,
          strikePrice: props.position.contract.strikePrice !== undefined ? {
              set: props.position.contract.strikePrice
            } : undefined,
          expirationDate: props.position.contract.expirationDate !== undefined ? {
              set: props.position.contract.expirationDate
            } : undefined,
          daysToExpiration: props.position.contract.daysToExpiration !== undefined ? {
              set: props.position.contract.daysToExpiration
            } : undefined,
          lastPrice: props.position.contract.lastPrice !== undefined ? {
              set: props.position.contract.lastPrice
            } : undefined,
          bidPrice: props.position.contract.bidPrice !== undefined ? {
              set: props.position.contract.bidPrice
            } : undefined,
          askPrice: props.position.contract.askPrice !== undefined ? {
              set: props.position.contract.askPrice
            } : undefined,
          midPrice: props.position.contract.midPrice !== undefined ? {
              set: props.position.contract.midPrice
            } : undefined,
          bidSize: props.position.contract.bidSize !== undefined ? {
              set: props.position.contract.bidSize
            } : undefined,
          askSize: props.position.contract.askSize !== undefined ? {
              set: props.position.contract.askSize
            } : undefined,
          volume: props.position.contract.volume !== undefined ? {
              set: props.position.contract.volume
            } : undefined,
          openInterest: props.position.contract.openInterest !== undefined ? {
              set: props.position.contract.openInterest
            } : undefined,
          impliedVolatility: props.position.contract.impliedVolatility !== undefined ? {
              set: props.position.contract.impliedVolatility
            } : undefined,
          delta: props.position.contract.delta !== undefined ? {
              set: props.position.contract.delta
            } : undefined,
          gamma: props.position.contract.gamma !== undefined ? {
              set: props.position.contract.gamma
            } : undefined,
          theta: props.position.contract.theta !== undefined ? {
              set: props.position.contract.theta
            } : undefined,
          vega: props.position.contract.vega !== undefined ? {
              set: props.position.contract.vega
            } : undefined,
          rho: props.position.contract.rho !== undefined ? {
              set: props.position.contract.rho
            } : undefined,
          inTheMoney: props.position.contract.inTheMoney !== undefined ? {
              set: props.position.contract.inTheMoney
            } : undefined,
          intrinsicValue: props.position.contract.intrinsicValue !== undefined ? {
              set: props.position.contract.intrinsicValue
            } : undefined,
          extrinsicValue: props.position.contract.extrinsicValue !== undefined ? {
              set: props.position.contract.extrinsicValue
            } : undefined,
          theoreticalPrice: props.position.contract.theoreticalPrice !== undefined ? {
              set: props.position.contract.theoreticalPrice
            } : undefined,
          underlyingPrice: props.position.contract.underlyingPrice !== undefined ? {
              set: props.position.contract.underlyingPrice
            } : undefined,
          metadata: props.position.contract.metadata !== undefined ? props.position.contract.metadata : undefined,
          dataTimestamp: props.position.contract.dataTimestamp !== undefined ? {
              set: props.position.contract.dataTimestamp
            } : undefined,
      greeksHistory: props.position.contract.greeksHistory ? 
      Array.isArray(props.position.contract.greeksHistory) && props.position.contract.greeksHistory.length > 0 && props.position.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.position.contract.greeksHistory.map((item) => ({
        id: item.id
      }))
} : { upsert: props.position.contract.greeksHistory.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            timestamp: item.timestamp !== undefined ? {
                set: item.timestamp
              } : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? {
                set: item.underlyingPrice
              } : undefined,
            optionPrice: item.optionPrice !== undefined ? {
                set: item.optionPrice
              } : undefined,
            bidPrice: item.bidPrice !== undefined ? {
                set: item.bidPrice
              } : undefined,
            askPrice: item.askPrice !== undefined ? {
                set: item.askPrice
              } : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? {
                set: item.impliedVolatility
              } : undefined,
            delta: item.delta !== undefined ? {
                set: item.delta
              } : undefined,
            gamma: item.gamma !== undefined ? {
                set: item.gamma
              } : undefined,
            theta: item.theta !== undefined ? {
                set: item.theta
              } : undefined,
            vega: item.vega !== undefined ? {
                set: item.vega
              } : undefined,
            rho: item.rho !== undefined ? {
                set: item.rho
              } : undefined,
            volume: item.volume !== undefined ? {
                set: item.volume
              } : undefined,
            openInterest: item.openInterest !== undefined ? {
                set: item.openInterest
              } : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? {
                set: item.daysToExpiration
              } : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? {
                set: item.intrinsicValue
              } : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? {
                set: item.extrinsicValue
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            timestamp: item.timestamp !== undefined ? item.timestamp : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? item.underlyingPrice : undefined,
            optionPrice: item.optionPrice !== undefined ? item.optionPrice : undefined,
            bidPrice: item.bidPrice !== undefined ? item.bidPrice : undefined,
            askPrice: item.askPrice !== undefined ? item.askPrice : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? item.impliedVolatility : undefined,
            delta: item.delta !== undefined ? item.delta : undefined,
            gamma: item.gamma !== undefined ? item.gamma : undefined,
            theta: item.theta !== undefined ? item.theta : undefined,
            vega: item.vega !== undefined ? item.vega : undefined,
            rho: item.rho !== undefined ? item.rho : undefined,
            volume: item.volume !== undefined ? item.volume : undefined,
            openInterest: item.openInterest !== undefined ? item.openInterest : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? item.daysToExpiration : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? item.intrinsicValue : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? item.extrinsicValue : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      executions: props.position.contract.executions ? 
      Array.isArray(props.position.contract.executions) && props.position.contract.executions.length > 0 && props.position.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.position.contract.executions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.position.contract.executions.map((item) => ({
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
        },
        create: {
          symbol: props.position.contract.symbol !== undefined ? props.position.contract.symbol : undefined,
          contractSymbol: props.position.contract.contractSymbol !== undefined ? props.position.contract.contractSymbol : undefined,
          optionType: props.position.contract.optionType !== undefined ? props.position.contract.optionType : undefined,
          strikePrice: props.position.contract.strikePrice !== undefined ? props.position.contract.strikePrice : undefined,
          expirationDate: props.position.contract.expirationDate !== undefined ? props.position.contract.expirationDate : undefined,
          daysToExpiration: props.position.contract.daysToExpiration !== undefined ? props.position.contract.daysToExpiration : undefined,
          lastPrice: props.position.contract.lastPrice !== undefined ? props.position.contract.lastPrice : undefined,
          bidPrice: props.position.contract.bidPrice !== undefined ? props.position.contract.bidPrice : undefined,
          askPrice: props.position.contract.askPrice !== undefined ? props.position.contract.askPrice : undefined,
          midPrice: props.position.contract.midPrice !== undefined ? props.position.contract.midPrice : undefined,
          bidSize: props.position.contract.bidSize !== undefined ? props.position.contract.bidSize : undefined,
          askSize: props.position.contract.askSize !== undefined ? props.position.contract.askSize : undefined,
          volume: props.position.contract.volume !== undefined ? props.position.contract.volume : undefined,
          openInterest: props.position.contract.openInterest !== undefined ? props.position.contract.openInterest : undefined,
          impliedVolatility: props.position.contract.impliedVolatility !== undefined ? props.position.contract.impliedVolatility : undefined,
          delta: props.position.contract.delta !== undefined ? props.position.contract.delta : undefined,
          gamma: props.position.contract.gamma !== undefined ? props.position.contract.gamma : undefined,
          theta: props.position.contract.theta !== undefined ? props.position.contract.theta : undefined,
          vega: props.position.contract.vega !== undefined ? props.position.contract.vega : undefined,
          rho: props.position.contract.rho !== undefined ? props.position.contract.rho : undefined,
          inTheMoney: props.position.contract.inTheMoney !== undefined ? props.position.contract.inTheMoney : undefined,
          intrinsicValue: props.position.contract.intrinsicValue !== undefined ? props.position.contract.intrinsicValue : undefined,
          extrinsicValue: props.position.contract.extrinsicValue !== undefined ? props.position.contract.extrinsicValue : undefined,
          theoreticalPrice: props.position.contract.theoreticalPrice !== undefined ? props.position.contract.theoreticalPrice : undefined,
          underlyingPrice: props.position.contract.underlyingPrice !== undefined ? props.position.contract.underlyingPrice : undefined,
          metadata: props.position.contract.metadata !== undefined ? props.position.contract.metadata : undefined,
          dataTimestamp: props.position.contract.dataTimestamp !== undefined ? props.position.contract.dataTimestamp : undefined,
      greeksHistory: props.position.contract.greeksHistory ? 
        Array.isArray(props.position.contract.greeksHistory) && props.position.contract.greeksHistory.length > 0 &&  props.position.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.greeksHistory.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
          },
          create: {
            timestamp: item.timestamp !== undefined ? item.timestamp : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? item.underlyingPrice : undefined,
            optionPrice: item.optionPrice !== undefined ? item.optionPrice : undefined,
            bidPrice: item.bidPrice !== undefined ? item.bidPrice : undefined,
            askPrice: item.askPrice !== undefined ? item.askPrice : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? item.impliedVolatility : undefined,
            delta: item.delta !== undefined ? item.delta : undefined,
            gamma: item.gamma !== undefined ? item.gamma : undefined,
            theta: item.theta !== undefined ? item.theta : undefined,
            vega: item.vega !== undefined ? item.vega : undefined,
            rho: item.rho !== undefined ? item.rho : undefined,
            volume: item.volume !== undefined ? item.volume : undefined,
            openInterest: item.openInterest !== undefined ? item.openInterest : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? item.daysToExpiration : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? item.intrinsicValue : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? item.extrinsicValue : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      executions: props.position.contract.executions ? 
        Array.isArray(props.position.contract.executions) && props.position.contract.executions.length > 0 &&  props.position.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.executions.map((item) => ({
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
        },
      }
    } : undefined,
    executions: props.position.executions ? 
    Array.isArray(props.position.executions) && props.position.executions.length > 0 && props.position.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.position.executions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.position.executions.map((item) => ({
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
      contract: item.contract ? 
      typeof item.contract === 'object' && Object.keys(item.contract).length === 1 && (Object.keys(item.contract)[0] === 'id' || Object.keys(item.contract)[0] === 'symbol')
? {
      connect: {
        id: item.contract.id
      }
} : { upsert: {
          where: {
            id: item.contract.id !== undefined ? {
                equals: item.contract.id
              } : undefined,
            symbol: item.contract.symbol !== undefined ? {
                equals: item.contract.symbol
              } : undefined,
          },
          update: {
            id: item.contract.id !== undefined ? {
                set: item.contract.id
              } : undefined,
            symbol: item.contract.symbol !== undefined ? {
                set: item.contract.symbol
              } : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? {
                set: item.contract.contractSymbol
              } : undefined,
            optionType: item.contract.optionType !== undefined ? {
                set: item.contract.optionType
              } : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? {
                set: item.contract.strikePrice
              } : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? {
                set: item.contract.expirationDate
              } : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? {
                set: item.contract.daysToExpiration
              } : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? {
                set: item.contract.lastPrice
              } : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? {
                set: item.contract.bidPrice
              } : undefined,
            askPrice: item.contract.askPrice !== undefined ? {
                set: item.contract.askPrice
              } : undefined,
            midPrice: item.contract.midPrice !== undefined ? {
                set: item.contract.midPrice
              } : undefined,
            bidSize: item.contract.bidSize !== undefined ? {
                set: item.contract.bidSize
              } : undefined,
            askSize: item.contract.askSize !== undefined ? {
                set: item.contract.askSize
              } : undefined,
            volume: item.contract.volume !== undefined ? {
                set: item.contract.volume
              } : undefined,
            openInterest: item.contract.openInterest !== undefined ? {
                set: item.contract.openInterest
              } : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? {
                set: item.contract.impliedVolatility
              } : undefined,
            delta: item.contract.delta !== undefined ? {
                set: item.contract.delta
              } : undefined,
            gamma: item.contract.gamma !== undefined ? {
                set: item.contract.gamma
              } : undefined,
            theta: item.contract.theta !== undefined ? {
                set: item.contract.theta
              } : undefined,
            vega: item.contract.vega !== undefined ? {
                set: item.contract.vega
              } : undefined,
            rho: item.contract.rho !== undefined ? {
                set: item.contract.rho
              } : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? {
                set: item.contract.inTheMoney
              } : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? {
                set: item.contract.intrinsicValue
              } : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? {
                set: item.contract.extrinsicValue
              } : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? {
                set: item.contract.theoreticalPrice
              } : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? {
                set: item.contract.underlyingPrice
              } : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? {
                set: item.contract.dataTimestamp
              } : undefined,
          },
          create: {
            symbol: item.contract.symbol !== undefined ? item.contract.symbol : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? item.contract.contractSymbol : undefined,
            optionType: item.contract.optionType !== undefined ? item.contract.optionType : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? item.contract.strikePrice : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? item.contract.expirationDate : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? item.contract.daysToExpiration : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? item.contract.lastPrice : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? item.contract.bidPrice : undefined,
            askPrice: item.contract.askPrice !== undefined ? item.contract.askPrice : undefined,
            midPrice: item.contract.midPrice !== undefined ? item.contract.midPrice : undefined,
            bidSize: item.contract.bidSize !== undefined ? item.contract.bidSize : undefined,
            askSize: item.contract.askSize !== undefined ? item.contract.askSize : undefined,
            volume: item.contract.volume !== undefined ? item.contract.volume : undefined,
            openInterest: item.contract.openInterest !== undefined ? item.contract.openInterest : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? item.contract.impliedVolatility : undefined,
            delta: item.contract.delta !== undefined ? item.contract.delta : undefined,
            gamma: item.contract.gamma !== undefined ? item.contract.gamma : undefined,
            theta: item.contract.theta !== undefined ? item.contract.theta : undefined,
            vega: item.contract.vega !== undefined ? item.contract.vega : undefined,
            rho: item.contract.rho !== undefined ? item.contract.rho : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? item.contract.inTheMoney : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? item.contract.intrinsicValue : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? item.contract.extrinsicValue : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? item.contract.theoreticalPrice : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? item.contract.underlyingPrice : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? item.contract.dataTimestamp : undefined,
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
      contract: item.contract ? 
        typeof item.contract === 'object' && Object.keys(item.contract).length === 1 && Object.keys(item.contract)[0] === 'id'
    ? { connect: {
            id: item.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.contract.id !== undefined ? item.contract.id : undefined,
            symbol: item.contract.symbol !== undefined ? {
                equals: item.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.contract.symbol !== undefined ? item.contract.symbol : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? item.contract.contractSymbol : undefined,
            optionType: item.contract.optionType !== undefined ? item.contract.optionType : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? item.contract.strikePrice : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? item.contract.expirationDate : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? item.contract.daysToExpiration : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? item.contract.lastPrice : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? item.contract.bidPrice : undefined,
            askPrice: item.contract.askPrice !== undefined ? item.contract.askPrice : undefined,
            midPrice: item.contract.midPrice !== undefined ? item.contract.midPrice : undefined,
            bidSize: item.contract.bidSize !== undefined ? item.contract.bidSize : undefined,
            askSize: item.contract.askSize !== undefined ? item.contract.askSize : undefined,
            volume: item.contract.volume !== undefined ? item.contract.volume : undefined,
            openInterest: item.contract.openInterest !== undefined ? item.contract.openInterest : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? item.contract.impliedVolatility : undefined,
            delta: item.contract.delta !== undefined ? item.contract.delta : undefined,
            gamma: item.contract.gamma !== undefined ? item.contract.gamma : undefined,
            theta: item.contract.theta !== undefined ? item.contract.theta : undefined,
            vega: item.contract.vega !== undefined ? item.contract.vega : undefined,
            rho: item.contract.rho !== undefined ? item.contract.rho : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? item.contract.inTheMoney : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? item.contract.intrinsicValue : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? item.contract.extrinsicValue : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? item.contract.theoreticalPrice : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? item.contract.underlyingPrice : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? item.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        alpacaAccountId: props.position.alpacaAccountId !== undefined ? props.position.alpacaAccountId : undefined,
        status: props.position.status !== undefined ? props.position.status : undefined,
        openingSide: props.position.openingSide !== undefined ? props.position.openingSide : undefined,
        quantity: props.position.quantity !== undefined ? props.position.quantity : undefined,
        entryPrice: props.position.entryPrice !== undefined ? props.position.entryPrice : undefined,
        entryCost: props.position.entryCost !== undefined ? props.position.entryCost : undefined,
        entryTime: props.position.entryTime !== undefined ? props.position.entryTime : undefined,
        exitPrice: props.position.exitPrice !== undefined ? props.position.exitPrice : undefined,
        exitValue: props.position.exitValue !== undefined ? props.position.exitValue : undefined,
        exitTime: props.position.exitTime !== undefined ? props.position.exitTime : undefined,
        currentPrice: props.position.currentPrice !== undefined ? props.position.currentPrice : undefined,
        currentValue: props.position.currentValue !== undefined ? props.position.currentValue : undefined,
        unrealizedPnL: props.position.unrealizedPnL !== undefined ? props.position.unrealizedPnL : undefined,
        unrealizedPnLPercent: props.position.unrealizedPnLPercent !== undefined ? props.position.unrealizedPnLPercent : undefined,
        realizedPnL: props.position.realizedPnL !== undefined ? props.position.realizedPnL : undefined,
        realizedPnLPercent: props.position.realizedPnLPercent !== undefined ? props.position.realizedPnLPercent : undefined,
        totalFees: props.position.totalFees !== undefined ? props.position.totalFees : undefined,
        currentDelta: props.position.currentDelta !== undefined ? props.position.currentDelta : undefined,
        currentGamma: props.position.currentGamma !== undefined ? props.position.currentGamma : undefined,
        currentTheta: props.position.currentTheta !== undefined ? props.position.currentTheta : undefined,
        currentVega: props.position.currentVega !== undefined ? props.position.currentVega : undefined,
        currentRho: props.position.currentRho !== undefined ? props.position.currentRho : undefined,
        currentImpliedVolatility: props.position.currentImpliedVolatility !== undefined ? props.position.currentImpliedVolatility : undefined,
        daysHeld: props.position.daysHeld !== undefined ? props.position.daysHeld : undefined,
        exitReason: props.position.exitReason !== undefined ? props.position.exitReason : undefined,
        strategyType: props.position.strategyType !== undefined ? props.position.strategyType : undefined,
        tradeId: props.position.tradeId !== undefined ? props.position.tradeId : undefined,
        metadata: props.position.metadata !== undefined ? props.position.metadata : undefined,
        lifecycleState: props.position.lifecycleState !== undefined ? props.position.lifecycleState : undefined,
        exitThresholds: props.position.exitThresholds !== undefined ? props.position.exitThresholds : undefined,
        linkedRollId: props.position.linkedRollId !== undefined ? props.position.linkedRollId : undefined,
    contract: props.position.contract ? 
      typeof props.position.contract === 'object' && Object.keys(props.position.contract).length === 1 && Object.keys(props.position.contract)[0] === 'id'
    ? { connect: {
          id: props.position.contract.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.position.contract.id !== undefined ? props.position.contract.id : undefined,
          symbol: props.position.contract.symbol !== undefined ? {
              equals: props.position.contract.symbol 
             } : undefined,
        },
        create: {
          symbol: props.position.contract.symbol !== undefined ? props.position.contract.symbol : undefined,
          contractSymbol: props.position.contract.contractSymbol !== undefined ? props.position.contract.contractSymbol : undefined,
          optionType: props.position.contract.optionType !== undefined ? props.position.contract.optionType : undefined,
          strikePrice: props.position.contract.strikePrice !== undefined ? props.position.contract.strikePrice : undefined,
          expirationDate: props.position.contract.expirationDate !== undefined ? props.position.contract.expirationDate : undefined,
          daysToExpiration: props.position.contract.daysToExpiration !== undefined ? props.position.contract.daysToExpiration : undefined,
          lastPrice: props.position.contract.lastPrice !== undefined ? props.position.contract.lastPrice : undefined,
          bidPrice: props.position.contract.bidPrice !== undefined ? props.position.contract.bidPrice : undefined,
          askPrice: props.position.contract.askPrice !== undefined ? props.position.contract.askPrice : undefined,
          midPrice: props.position.contract.midPrice !== undefined ? props.position.contract.midPrice : undefined,
          bidSize: props.position.contract.bidSize !== undefined ? props.position.contract.bidSize : undefined,
          askSize: props.position.contract.askSize !== undefined ? props.position.contract.askSize : undefined,
          volume: props.position.contract.volume !== undefined ? props.position.contract.volume : undefined,
          openInterest: props.position.contract.openInterest !== undefined ? props.position.contract.openInterest : undefined,
          impliedVolatility: props.position.contract.impliedVolatility !== undefined ? props.position.contract.impliedVolatility : undefined,
          delta: props.position.contract.delta !== undefined ? props.position.contract.delta : undefined,
          gamma: props.position.contract.gamma !== undefined ? props.position.contract.gamma : undefined,
          theta: props.position.contract.theta !== undefined ? props.position.contract.theta : undefined,
          vega: props.position.contract.vega !== undefined ? props.position.contract.vega : undefined,
          rho: props.position.contract.rho !== undefined ? props.position.contract.rho : undefined,
          inTheMoney: props.position.contract.inTheMoney !== undefined ? props.position.contract.inTheMoney : undefined,
          intrinsicValue: props.position.contract.intrinsicValue !== undefined ? props.position.contract.intrinsicValue : undefined,
          extrinsicValue: props.position.contract.extrinsicValue !== undefined ? props.position.contract.extrinsicValue : undefined,
          theoreticalPrice: props.position.contract.theoreticalPrice !== undefined ? props.position.contract.theoreticalPrice : undefined,
          underlyingPrice: props.position.contract.underlyingPrice !== undefined ? props.position.contract.underlyingPrice : undefined,
          metadata: props.position.contract.metadata !== undefined ? props.position.contract.metadata : undefined,
          dataTimestamp: props.position.contract.dataTimestamp !== undefined ? props.position.contract.dataTimestamp : undefined,
      greeksHistory: props.position.contract.greeksHistory ? 
        Array.isArray(props.position.contract.greeksHistory) && props.position.contract.greeksHistory.length > 0 &&  props.position.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.greeksHistory.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
          },
          create: {
            timestamp: item.timestamp !== undefined ? item.timestamp : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? item.underlyingPrice : undefined,
            optionPrice: item.optionPrice !== undefined ? item.optionPrice : undefined,
            bidPrice: item.bidPrice !== undefined ? item.bidPrice : undefined,
            askPrice: item.askPrice !== undefined ? item.askPrice : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? item.impliedVolatility : undefined,
            delta: item.delta !== undefined ? item.delta : undefined,
            gamma: item.gamma !== undefined ? item.gamma : undefined,
            theta: item.theta !== undefined ? item.theta : undefined,
            vega: item.vega !== undefined ? item.vega : undefined,
            rho: item.rho !== undefined ? item.rho : undefined,
            volume: item.volume !== undefined ? item.volume : undefined,
            openInterest: item.openInterest !== undefined ? item.openInterest : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? item.daysToExpiration : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? item.intrinsicValue : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? item.extrinsicValue : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      executions: props.position.contract.executions ? 
        Array.isArray(props.position.contract.executions) && props.position.contract.executions.length > 0 &&  props.position.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.position.contract.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.position.contract.executions.map((item) => ({
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
        },
      }
    } : undefined,
    executions: props.position.executions ? 
      Array.isArray(props.position.executions) && props.position.executions.length > 0 &&  props.position.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.position.executions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.position.executions.map((item) => ({
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
      contract: item.contract ? 
        typeof item.contract === 'object' && Object.keys(item.contract).length === 1 && Object.keys(item.contract)[0] === 'id'
    ? { connect: {
            id: item.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.contract.id !== undefined ? item.contract.id : undefined,
            symbol: item.contract.symbol !== undefined ? {
                equals: item.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.contract.symbol !== undefined ? item.contract.symbol : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? item.contract.contractSymbol : undefined,
            optionType: item.contract.optionType !== undefined ? item.contract.optionType : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? item.contract.strikePrice : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? item.contract.expirationDate : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? item.contract.daysToExpiration : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? item.contract.lastPrice : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? item.contract.bidPrice : undefined,
            askPrice: item.contract.askPrice !== undefined ? item.contract.askPrice : undefined,
            midPrice: item.contract.midPrice !== undefined ? item.contract.midPrice : undefined,
            bidSize: item.contract.bidSize !== undefined ? item.contract.bidSize : undefined,
            askSize: item.contract.askSize !== undefined ? item.contract.askSize : undefined,
            volume: item.contract.volume !== undefined ? item.contract.volume : undefined,
            openInterest: item.contract.openInterest !== undefined ? item.contract.openInterest : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? item.contract.impliedVolatility : undefined,
            delta: item.contract.delta !== undefined ? item.contract.delta : undefined,
            gamma: item.contract.gamma !== undefined ? item.contract.gamma : undefined,
            theta: item.contract.theta !== undefined ? item.contract.theta : undefined,
            vega: item.contract.vega !== undefined ? item.contract.vega : undefined,
            rho: item.contract.rho !== undefined ? item.contract.rho : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? item.contract.inTheMoney : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? item.contract.intrinsicValue : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? item.contract.extrinsicValue : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? item.contract.theoreticalPrice : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? item.contract.underlyingPrice : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? item.contract.dataTimestamp : undefined,
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
          mutation: UPSERT_ONE_OPTIONSPOSITIONEVENT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneOptionsPositionEvent) {
          return response.data.upsertOneOptionsPositionEvent;
        } else {
          return null as unknown as OptionsPositionEventType;
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
          logger.error("Non-retryable constraint violation in upsertOneOptionsPositionEvent", {
            operation: 'upsertOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
          logger.warn("Database connection error in upsertOneOptionsPositionEvent, retrying...", {
            operation: 'upsertOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
            operation: 'upsertOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
   * Update multiple OptionsPositionEvent records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of OptionsPositionEvent objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: OptionsPositionEventType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_OPTIONSPOSITIONEVENT = gql`
          mutation updateManyOptionsPositionEvent($data: [OptionsPositionEventCreateManyInput!]!) {
            updateManyOptionsPositionEvent(data: $data) {
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
  fromState: prop.fromState !== undefined ? {
            set: prop.fromState 
           } : undefined,
  toState: prop.toState !== undefined ? {
            set: prop.toState 
           } : undefined,
  trigger: prop.trigger !== undefined ? {
            set: prop.trigger 
           } : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  position: prop.position ? 
  typeof prop.position === 'object' && Object.keys(prop.position).length === 1 && (Object.keys(prop.position)[0] === 'id' || Object.keys(prop.position)[0] === 'symbol')
? {
  connect: {
    id: prop.position.id
  }
} : { upsert: {
      where: {
        id: prop.position.id !== undefined ? {
            equals: prop.position.id
          } : undefined,
        alpacaAccountId: prop.position.alpacaAccountId !== undefined ? {
            equals: prop.position.alpacaAccountId
          } : undefined,
        contractId: prop.position.contractId !== undefined ? {
            equals: prop.position.contractId
          } : undefined,
        status: prop.position.status !== undefined ? {
            equals: prop.position.status
          } : undefined,
        tradeId: prop.position.tradeId !== undefined ? {
            equals: prop.position.tradeId
          } : undefined,
        linkedRollId: prop.position.linkedRollId !== undefined ? {
            equals: prop.position.linkedRollId
          } : undefined,
      },
      update: {
        id: prop.position.id !== undefined ? {
            set: prop.position.id
          } : undefined,
        alpacaAccountId: prop.position.alpacaAccountId !== undefined ? {
            set: prop.position.alpacaAccountId
          } : undefined,
        status: prop.position.status !== undefined ? {
            set: prop.position.status
          } : undefined,
        openingSide: prop.position.openingSide !== undefined ? {
            set: prop.position.openingSide
          } : undefined,
        quantity: prop.position.quantity !== undefined ? {
            set: prop.position.quantity
          } : undefined,
        entryPrice: prop.position.entryPrice !== undefined ? {
            set: prop.position.entryPrice
          } : undefined,
        entryCost: prop.position.entryCost !== undefined ? {
            set: prop.position.entryCost
          } : undefined,
        entryTime: prop.position.entryTime !== undefined ? {
            set: prop.position.entryTime
          } : undefined,
        exitPrice: prop.position.exitPrice !== undefined ? {
            set: prop.position.exitPrice
          } : undefined,
        exitValue: prop.position.exitValue !== undefined ? {
            set: prop.position.exitValue
          } : undefined,
        exitTime: prop.position.exitTime !== undefined ? {
            set: prop.position.exitTime
          } : undefined,
        currentPrice: prop.position.currentPrice !== undefined ? {
            set: prop.position.currentPrice
          } : undefined,
        currentValue: prop.position.currentValue !== undefined ? {
            set: prop.position.currentValue
          } : undefined,
        unrealizedPnL: prop.position.unrealizedPnL !== undefined ? {
            set: prop.position.unrealizedPnL
          } : undefined,
        unrealizedPnLPercent: prop.position.unrealizedPnLPercent !== undefined ? {
            set: prop.position.unrealizedPnLPercent
          } : undefined,
        realizedPnL: prop.position.realizedPnL !== undefined ? {
            set: prop.position.realizedPnL
          } : undefined,
        realizedPnLPercent: prop.position.realizedPnLPercent !== undefined ? {
            set: prop.position.realizedPnLPercent
          } : undefined,
        totalFees: prop.position.totalFees !== undefined ? {
            set: prop.position.totalFees
          } : undefined,
        currentDelta: prop.position.currentDelta !== undefined ? {
            set: prop.position.currentDelta
          } : undefined,
        currentGamma: prop.position.currentGamma !== undefined ? {
            set: prop.position.currentGamma
          } : undefined,
        currentTheta: prop.position.currentTheta !== undefined ? {
            set: prop.position.currentTheta
          } : undefined,
        currentVega: prop.position.currentVega !== undefined ? {
            set: prop.position.currentVega
          } : undefined,
        currentRho: prop.position.currentRho !== undefined ? {
            set: prop.position.currentRho
          } : undefined,
        currentImpliedVolatility: prop.position.currentImpliedVolatility !== undefined ? {
            set: prop.position.currentImpliedVolatility
          } : undefined,
        daysHeld: prop.position.daysHeld !== undefined ? {
            set: prop.position.daysHeld
          } : undefined,
        exitReason: prop.position.exitReason !== undefined ? {
            set: prop.position.exitReason
          } : undefined,
        strategyType: prop.position.strategyType !== undefined ? {
            set: prop.position.strategyType
          } : undefined,
        tradeId: prop.position.tradeId !== undefined ? {
            set: prop.position.tradeId
          } : undefined,
        metadata: prop.position.metadata !== undefined ? prop.position.metadata : undefined,
        lifecycleState: prop.position.lifecycleState !== undefined ? {
            set: prop.position.lifecycleState
          } : undefined,
        exitThresholds: prop.position.exitThresholds !== undefined ? prop.position.exitThresholds : undefined,
        linkedRollId: prop.position.linkedRollId !== undefined ? {
            set: prop.position.linkedRollId
          } : undefined,
    contract: prop.position.contract ? 
    typeof prop.position.contract === 'object' && Object.keys(prop.position.contract).length === 1 && (Object.keys(prop.position.contract)[0] === 'id' || Object.keys(prop.position.contract)[0] === 'symbol')
? {
    connect: {
      id: prop.position.contract.id
    }
} : { upsert: {
        where: {
          id: prop.position.contract.id !== undefined ? {
              equals: prop.position.contract.id
            } : undefined,
          symbol: prop.position.contract.symbol !== undefined ? {
              equals: prop.position.contract.symbol
            } : undefined,
        },
        update: {
          id: prop.position.contract.id !== undefined ? {
              set: prop.position.contract.id
            } : undefined,
          symbol: prop.position.contract.symbol !== undefined ? {
              set: prop.position.contract.symbol
            } : undefined,
          contractSymbol: prop.position.contract.contractSymbol !== undefined ? {
              set: prop.position.contract.contractSymbol
            } : undefined,
          optionType: prop.position.contract.optionType !== undefined ? {
              set: prop.position.contract.optionType
            } : undefined,
          strikePrice: prop.position.contract.strikePrice !== undefined ? {
              set: prop.position.contract.strikePrice
            } : undefined,
          expirationDate: prop.position.contract.expirationDate !== undefined ? {
              set: prop.position.contract.expirationDate
            } : undefined,
          daysToExpiration: prop.position.contract.daysToExpiration !== undefined ? {
              set: prop.position.contract.daysToExpiration
            } : undefined,
          lastPrice: prop.position.contract.lastPrice !== undefined ? {
              set: prop.position.contract.lastPrice
            } : undefined,
          bidPrice: prop.position.contract.bidPrice !== undefined ? {
              set: prop.position.contract.bidPrice
            } : undefined,
          askPrice: prop.position.contract.askPrice !== undefined ? {
              set: prop.position.contract.askPrice
            } : undefined,
          midPrice: prop.position.contract.midPrice !== undefined ? {
              set: prop.position.contract.midPrice
            } : undefined,
          bidSize: prop.position.contract.bidSize !== undefined ? {
              set: prop.position.contract.bidSize
            } : undefined,
          askSize: prop.position.contract.askSize !== undefined ? {
              set: prop.position.contract.askSize
            } : undefined,
          volume: prop.position.contract.volume !== undefined ? {
              set: prop.position.contract.volume
            } : undefined,
          openInterest: prop.position.contract.openInterest !== undefined ? {
              set: prop.position.contract.openInterest
            } : undefined,
          impliedVolatility: prop.position.contract.impliedVolatility !== undefined ? {
              set: prop.position.contract.impliedVolatility
            } : undefined,
          delta: prop.position.contract.delta !== undefined ? {
              set: prop.position.contract.delta
            } : undefined,
          gamma: prop.position.contract.gamma !== undefined ? {
              set: prop.position.contract.gamma
            } : undefined,
          theta: prop.position.contract.theta !== undefined ? {
              set: prop.position.contract.theta
            } : undefined,
          vega: prop.position.contract.vega !== undefined ? {
              set: prop.position.contract.vega
            } : undefined,
          rho: prop.position.contract.rho !== undefined ? {
              set: prop.position.contract.rho
            } : undefined,
          inTheMoney: prop.position.contract.inTheMoney !== undefined ? {
              set: prop.position.contract.inTheMoney
            } : undefined,
          intrinsicValue: prop.position.contract.intrinsicValue !== undefined ? {
              set: prop.position.contract.intrinsicValue
            } : undefined,
          extrinsicValue: prop.position.contract.extrinsicValue !== undefined ? {
              set: prop.position.contract.extrinsicValue
            } : undefined,
          theoreticalPrice: prop.position.contract.theoreticalPrice !== undefined ? {
              set: prop.position.contract.theoreticalPrice
            } : undefined,
          underlyingPrice: prop.position.contract.underlyingPrice !== undefined ? {
              set: prop.position.contract.underlyingPrice
            } : undefined,
          metadata: prop.position.contract.metadata !== undefined ? prop.position.contract.metadata : undefined,
          dataTimestamp: prop.position.contract.dataTimestamp !== undefined ? {
              set: prop.position.contract.dataTimestamp
            } : undefined,
      greeksHistory: prop.position.contract.greeksHistory ? 
      Array.isArray(prop.position.contract.greeksHistory) && prop.position.contract.greeksHistory.length > 0 && prop.position.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.position.contract.greeksHistory.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.position.contract.greeksHistory.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            timestamp: item.timestamp !== undefined ? {
                set: item.timestamp
              } : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? {
                set: item.underlyingPrice
              } : undefined,
            optionPrice: item.optionPrice !== undefined ? {
                set: item.optionPrice
              } : undefined,
            bidPrice: item.bidPrice !== undefined ? {
                set: item.bidPrice
              } : undefined,
            askPrice: item.askPrice !== undefined ? {
                set: item.askPrice
              } : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? {
                set: item.impliedVolatility
              } : undefined,
            delta: item.delta !== undefined ? {
                set: item.delta
              } : undefined,
            gamma: item.gamma !== undefined ? {
                set: item.gamma
              } : undefined,
            theta: item.theta !== undefined ? {
                set: item.theta
              } : undefined,
            vega: item.vega !== undefined ? {
                set: item.vega
              } : undefined,
            rho: item.rho !== undefined ? {
                set: item.rho
              } : undefined,
            volume: item.volume !== undefined ? {
                set: item.volume
              } : undefined,
            openInterest: item.openInterest !== undefined ? {
                set: item.openInterest
              } : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? {
                set: item.daysToExpiration
              } : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? {
                set: item.intrinsicValue
              } : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? {
                set: item.extrinsicValue
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            timestamp: item.timestamp !== undefined ? item.timestamp : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? item.underlyingPrice : undefined,
            optionPrice: item.optionPrice !== undefined ? item.optionPrice : undefined,
            bidPrice: item.bidPrice !== undefined ? item.bidPrice : undefined,
            askPrice: item.askPrice !== undefined ? item.askPrice : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? item.impliedVolatility : undefined,
            delta: item.delta !== undefined ? item.delta : undefined,
            gamma: item.gamma !== undefined ? item.gamma : undefined,
            theta: item.theta !== undefined ? item.theta : undefined,
            vega: item.vega !== undefined ? item.vega : undefined,
            rho: item.rho !== undefined ? item.rho : undefined,
            volume: item.volume !== undefined ? item.volume : undefined,
            openInterest: item.openInterest !== undefined ? item.openInterest : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? item.daysToExpiration : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? item.intrinsicValue : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? item.extrinsicValue : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      executions: prop.position.contract.executions ? 
      Array.isArray(prop.position.contract.executions) && prop.position.contract.executions.length > 0 && prop.position.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.position.contract.executions.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.position.contract.executions.map((item) => ({
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
        },
        create: {
          symbol: prop.position.contract.symbol !== undefined ? prop.position.contract.symbol : undefined,
          contractSymbol: prop.position.contract.contractSymbol !== undefined ? prop.position.contract.contractSymbol : undefined,
          optionType: prop.position.contract.optionType !== undefined ? prop.position.contract.optionType : undefined,
          strikePrice: prop.position.contract.strikePrice !== undefined ? prop.position.contract.strikePrice : undefined,
          expirationDate: prop.position.contract.expirationDate !== undefined ? prop.position.contract.expirationDate : undefined,
          daysToExpiration: prop.position.contract.daysToExpiration !== undefined ? prop.position.contract.daysToExpiration : undefined,
          lastPrice: prop.position.contract.lastPrice !== undefined ? prop.position.contract.lastPrice : undefined,
          bidPrice: prop.position.contract.bidPrice !== undefined ? prop.position.contract.bidPrice : undefined,
          askPrice: prop.position.contract.askPrice !== undefined ? prop.position.contract.askPrice : undefined,
          midPrice: prop.position.contract.midPrice !== undefined ? prop.position.contract.midPrice : undefined,
          bidSize: prop.position.contract.bidSize !== undefined ? prop.position.contract.bidSize : undefined,
          askSize: prop.position.contract.askSize !== undefined ? prop.position.contract.askSize : undefined,
          volume: prop.position.contract.volume !== undefined ? prop.position.contract.volume : undefined,
          openInterest: prop.position.contract.openInterest !== undefined ? prop.position.contract.openInterest : undefined,
          impliedVolatility: prop.position.contract.impliedVolatility !== undefined ? prop.position.contract.impliedVolatility : undefined,
          delta: prop.position.contract.delta !== undefined ? prop.position.contract.delta : undefined,
          gamma: prop.position.contract.gamma !== undefined ? prop.position.contract.gamma : undefined,
          theta: prop.position.contract.theta !== undefined ? prop.position.contract.theta : undefined,
          vega: prop.position.contract.vega !== undefined ? prop.position.contract.vega : undefined,
          rho: prop.position.contract.rho !== undefined ? prop.position.contract.rho : undefined,
          inTheMoney: prop.position.contract.inTheMoney !== undefined ? prop.position.contract.inTheMoney : undefined,
          intrinsicValue: prop.position.contract.intrinsicValue !== undefined ? prop.position.contract.intrinsicValue : undefined,
          extrinsicValue: prop.position.contract.extrinsicValue !== undefined ? prop.position.contract.extrinsicValue : undefined,
          theoreticalPrice: prop.position.contract.theoreticalPrice !== undefined ? prop.position.contract.theoreticalPrice : undefined,
          underlyingPrice: prop.position.contract.underlyingPrice !== undefined ? prop.position.contract.underlyingPrice : undefined,
          metadata: prop.position.contract.metadata !== undefined ? prop.position.contract.metadata : undefined,
          dataTimestamp: prop.position.contract.dataTimestamp !== undefined ? prop.position.contract.dataTimestamp : undefined,
      greeksHistory: prop.position.contract.greeksHistory ? 
        Array.isArray(prop.position.contract.greeksHistory) && prop.position.contract.greeksHistory.length > 0 &&  prop.position.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.position.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.position.contract.greeksHistory.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
          },
          create: {
            timestamp: item.timestamp !== undefined ? item.timestamp : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? item.underlyingPrice : undefined,
            optionPrice: item.optionPrice !== undefined ? item.optionPrice : undefined,
            bidPrice: item.bidPrice !== undefined ? item.bidPrice : undefined,
            askPrice: item.askPrice !== undefined ? item.askPrice : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? item.impliedVolatility : undefined,
            delta: item.delta !== undefined ? item.delta : undefined,
            gamma: item.gamma !== undefined ? item.gamma : undefined,
            theta: item.theta !== undefined ? item.theta : undefined,
            vega: item.vega !== undefined ? item.vega : undefined,
            rho: item.rho !== undefined ? item.rho : undefined,
            volume: item.volume !== undefined ? item.volume : undefined,
            openInterest: item.openInterest !== undefined ? item.openInterest : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? item.daysToExpiration : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? item.intrinsicValue : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? item.extrinsicValue : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      executions: prop.position.contract.executions ? 
        Array.isArray(prop.position.contract.executions) && prop.position.contract.executions.length > 0 &&  prop.position.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.position.contract.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.position.contract.executions.map((item) => ({
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
        },
      }
    } : undefined,
    executions: prop.position.executions ? 
    Array.isArray(prop.position.executions) && prop.position.executions.length > 0 && prop.position.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.position.executions.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.position.executions.map((item) => ({
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
      contract: item.contract ? 
      typeof item.contract === 'object' && Object.keys(item.contract).length === 1 && (Object.keys(item.contract)[0] === 'id' || Object.keys(item.contract)[0] === 'symbol')
? {
      connect: {
        id: item.contract.id
      }
} : { upsert: {
          where: {
            id: item.contract.id !== undefined ? {
                equals: item.contract.id
              } : undefined,
            symbol: item.contract.symbol !== undefined ? {
                equals: item.contract.symbol
              } : undefined,
          },
          update: {
            id: item.contract.id !== undefined ? {
                set: item.contract.id
              } : undefined,
            symbol: item.contract.symbol !== undefined ? {
                set: item.contract.symbol
              } : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? {
                set: item.contract.contractSymbol
              } : undefined,
            optionType: item.contract.optionType !== undefined ? {
                set: item.contract.optionType
              } : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? {
                set: item.contract.strikePrice
              } : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? {
                set: item.contract.expirationDate
              } : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? {
                set: item.contract.daysToExpiration
              } : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? {
                set: item.contract.lastPrice
              } : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? {
                set: item.contract.bidPrice
              } : undefined,
            askPrice: item.contract.askPrice !== undefined ? {
                set: item.contract.askPrice
              } : undefined,
            midPrice: item.contract.midPrice !== undefined ? {
                set: item.contract.midPrice
              } : undefined,
            bidSize: item.contract.bidSize !== undefined ? {
                set: item.contract.bidSize
              } : undefined,
            askSize: item.contract.askSize !== undefined ? {
                set: item.contract.askSize
              } : undefined,
            volume: item.contract.volume !== undefined ? {
                set: item.contract.volume
              } : undefined,
            openInterest: item.contract.openInterest !== undefined ? {
                set: item.contract.openInterest
              } : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? {
                set: item.contract.impliedVolatility
              } : undefined,
            delta: item.contract.delta !== undefined ? {
                set: item.contract.delta
              } : undefined,
            gamma: item.contract.gamma !== undefined ? {
                set: item.contract.gamma
              } : undefined,
            theta: item.contract.theta !== undefined ? {
                set: item.contract.theta
              } : undefined,
            vega: item.contract.vega !== undefined ? {
                set: item.contract.vega
              } : undefined,
            rho: item.contract.rho !== undefined ? {
                set: item.contract.rho
              } : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? {
                set: item.contract.inTheMoney
              } : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? {
                set: item.contract.intrinsicValue
              } : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? {
                set: item.contract.extrinsicValue
              } : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? {
                set: item.contract.theoreticalPrice
              } : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? {
                set: item.contract.underlyingPrice
              } : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? {
                set: item.contract.dataTimestamp
              } : undefined,
          },
          create: {
            symbol: item.contract.symbol !== undefined ? item.contract.symbol : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? item.contract.contractSymbol : undefined,
            optionType: item.contract.optionType !== undefined ? item.contract.optionType : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? item.contract.strikePrice : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? item.contract.expirationDate : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? item.contract.daysToExpiration : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? item.contract.lastPrice : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? item.contract.bidPrice : undefined,
            askPrice: item.contract.askPrice !== undefined ? item.contract.askPrice : undefined,
            midPrice: item.contract.midPrice !== undefined ? item.contract.midPrice : undefined,
            bidSize: item.contract.bidSize !== undefined ? item.contract.bidSize : undefined,
            askSize: item.contract.askSize !== undefined ? item.contract.askSize : undefined,
            volume: item.contract.volume !== undefined ? item.contract.volume : undefined,
            openInterest: item.contract.openInterest !== undefined ? item.contract.openInterest : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? item.contract.impliedVolatility : undefined,
            delta: item.contract.delta !== undefined ? item.contract.delta : undefined,
            gamma: item.contract.gamma !== undefined ? item.contract.gamma : undefined,
            theta: item.contract.theta !== undefined ? item.contract.theta : undefined,
            vega: item.contract.vega !== undefined ? item.contract.vega : undefined,
            rho: item.contract.rho !== undefined ? item.contract.rho : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? item.contract.inTheMoney : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? item.contract.intrinsicValue : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? item.contract.extrinsicValue : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? item.contract.theoreticalPrice : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? item.contract.underlyingPrice : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? item.contract.dataTimestamp : undefined,
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
      contract: item.contract ? 
        typeof item.contract === 'object' && Object.keys(item.contract).length === 1 && Object.keys(item.contract)[0] === 'id'
    ? { connect: {
            id: item.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.contract.id !== undefined ? item.contract.id : undefined,
            symbol: item.contract.symbol !== undefined ? {
                equals: item.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.contract.symbol !== undefined ? item.contract.symbol : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? item.contract.contractSymbol : undefined,
            optionType: item.contract.optionType !== undefined ? item.contract.optionType : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? item.contract.strikePrice : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? item.contract.expirationDate : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? item.contract.daysToExpiration : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? item.contract.lastPrice : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? item.contract.bidPrice : undefined,
            askPrice: item.contract.askPrice !== undefined ? item.contract.askPrice : undefined,
            midPrice: item.contract.midPrice !== undefined ? item.contract.midPrice : undefined,
            bidSize: item.contract.bidSize !== undefined ? item.contract.bidSize : undefined,
            askSize: item.contract.askSize !== undefined ? item.contract.askSize : undefined,
            volume: item.contract.volume !== undefined ? item.contract.volume : undefined,
            openInterest: item.contract.openInterest !== undefined ? item.contract.openInterest : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? item.contract.impliedVolatility : undefined,
            delta: item.contract.delta !== undefined ? item.contract.delta : undefined,
            gamma: item.contract.gamma !== undefined ? item.contract.gamma : undefined,
            theta: item.contract.theta !== undefined ? item.contract.theta : undefined,
            vega: item.contract.vega !== undefined ? item.contract.vega : undefined,
            rho: item.contract.rho !== undefined ? item.contract.rho : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? item.contract.inTheMoney : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? item.contract.intrinsicValue : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? item.contract.extrinsicValue : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? item.contract.theoreticalPrice : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? item.contract.underlyingPrice : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? item.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        alpacaAccountId: prop.position.alpacaAccountId !== undefined ? prop.position.alpacaAccountId : undefined,
        status: prop.position.status !== undefined ? prop.position.status : undefined,
        openingSide: prop.position.openingSide !== undefined ? prop.position.openingSide : undefined,
        quantity: prop.position.quantity !== undefined ? prop.position.quantity : undefined,
        entryPrice: prop.position.entryPrice !== undefined ? prop.position.entryPrice : undefined,
        entryCost: prop.position.entryCost !== undefined ? prop.position.entryCost : undefined,
        entryTime: prop.position.entryTime !== undefined ? prop.position.entryTime : undefined,
        exitPrice: prop.position.exitPrice !== undefined ? prop.position.exitPrice : undefined,
        exitValue: prop.position.exitValue !== undefined ? prop.position.exitValue : undefined,
        exitTime: prop.position.exitTime !== undefined ? prop.position.exitTime : undefined,
        currentPrice: prop.position.currentPrice !== undefined ? prop.position.currentPrice : undefined,
        currentValue: prop.position.currentValue !== undefined ? prop.position.currentValue : undefined,
        unrealizedPnL: prop.position.unrealizedPnL !== undefined ? prop.position.unrealizedPnL : undefined,
        unrealizedPnLPercent: prop.position.unrealizedPnLPercent !== undefined ? prop.position.unrealizedPnLPercent : undefined,
        realizedPnL: prop.position.realizedPnL !== undefined ? prop.position.realizedPnL : undefined,
        realizedPnLPercent: prop.position.realizedPnLPercent !== undefined ? prop.position.realizedPnLPercent : undefined,
        totalFees: prop.position.totalFees !== undefined ? prop.position.totalFees : undefined,
        currentDelta: prop.position.currentDelta !== undefined ? prop.position.currentDelta : undefined,
        currentGamma: prop.position.currentGamma !== undefined ? prop.position.currentGamma : undefined,
        currentTheta: prop.position.currentTheta !== undefined ? prop.position.currentTheta : undefined,
        currentVega: prop.position.currentVega !== undefined ? prop.position.currentVega : undefined,
        currentRho: prop.position.currentRho !== undefined ? prop.position.currentRho : undefined,
        currentImpliedVolatility: prop.position.currentImpliedVolatility !== undefined ? prop.position.currentImpliedVolatility : undefined,
        daysHeld: prop.position.daysHeld !== undefined ? prop.position.daysHeld : undefined,
        exitReason: prop.position.exitReason !== undefined ? prop.position.exitReason : undefined,
        strategyType: prop.position.strategyType !== undefined ? prop.position.strategyType : undefined,
        tradeId: prop.position.tradeId !== undefined ? prop.position.tradeId : undefined,
        metadata: prop.position.metadata !== undefined ? prop.position.metadata : undefined,
        lifecycleState: prop.position.lifecycleState !== undefined ? prop.position.lifecycleState : undefined,
        exitThresholds: prop.position.exitThresholds !== undefined ? prop.position.exitThresholds : undefined,
        linkedRollId: prop.position.linkedRollId !== undefined ? prop.position.linkedRollId : undefined,
    contract: prop.position.contract ? 
      typeof prop.position.contract === 'object' && Object.keys(prop.position.contract).length === 1 && Object.keys(prop.position.contract)[0] === 'id'
    ? { connect: {
          id: prop.position.contract.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: prop.position.contract.id !== undefined ? prop.position.contract.id : undefined,
          symbol: prop.position.contract.symbol !== undefined ? {
              equals: prop.position.contract.symbol 
             } : undefined,
        },
        create: {
          symbol: prop.position.contract.symbol !== undefined ? prop.position.contract.symbol : undefined,
          contractSymbol: prop.position.contract.contractSymbol !== undefined ? prop.position.contract.contractSymbol : undefined,
          optionType: prop.position.contract.optionType !== undefined ? prop.position.contract.optionType : undefined,
          strikePrice: prop.position.contract.strikePrice !== undefined ? prop.position.contract.strikePrice : undefined,
          expirationDate: prop.position.contract.expirationDate !== undefined ? prop.position.contract.expirationDate : undefined,
          daysToExpiration: prop.position.contract.daysToExpiration !== undefined ? prop.position.contract.daysToExpiration : undefined,
          lastPrice: prop.position.contract.lastPrice !== undefined ? prop.position.contract.lastPrice : undefined,
          bidPrice: prop.position.contract.bidPrice !== undefined ? prop.position.contract.bidPrice : undefined,
          askPrice: prop.position.contract.askPrice !== undefined ? prop.position.contract.askPrice : undefined,
          midPrice: prop.position.contract.midPrice !== undefined ? prop.position.contract.midPrice : undefined,
          bidSize: prop.position.contract.bidSize !== undefined ? prop.position.contract.bidSize : undefined,
          askSize: prop.position.contract.askSize !== undefined ? prop.position.contract.askSize : undefined,
          volume: prop.position.contract.volume !== undefined ? prop.position.contract.volume : undefined,
          openInterest: prop.position.contract.openInterest !== undefined ? prop.position.contract.openInterest : undefined,
          impliedVolatility: prop.position.contract.impliedVolatility !== undefined ? prop.position.contract.impliedVolatility : undefined,
          delta: prop.position.contract.delta !== undefined ? prop.position.contract.delta : undefined,
          gamma: prop.position.contract.gamma !== undefined ? prop.position.contract.gamma : undefined,
          theta: prop.position.contract.theta !== undefined ? prop.position.contract.theta : undefined,
          vega: prop.position.contract.vega !== undefined ? prop.position.contract.vega : undefined,
          rho: prop.position.contract.rho !== undefined ? prop.position.contract.rho : undefined,
          inTheMoney: prop.position.contract.inTheMoney !== undefined ? prop.position.contract.inTheMoney : undefined,
          intrinsicValue: prop.position.contract.intrinsicValue !== undefined ? prop.position.contract.intrinsicValue : undefined,
          extrinsicValue: prop.position.contract.extrinsicValue !== undefined ? prop.position.contract.extrinsicValue : undefined,
          theoreticalPrice: prop.position.contract.theoreticalPrice !== undefined ? prop.position.contract.theoreticalPrice : undefined,
          underlyingPrice: prop.position.contract.underlyingPrice !== undefined ? prop.position.contract.underlyingPrice : undefined,
          metadata: prop.position.contract.metadata !== undefined ? prop.position.contract.metadata : undefined,
          dataTimestamp: prop.position.contract.dataTimestamp !== undefined ? prop.position.contract.dataTimestamp : undefined,
      greeksHistory: prop.position.contract.greeksHistory ? 
        Array.isArray(prop.position.contract.greeksHistory) && prop.position.contract.greeksHistory.length > 0 &&  prop.position.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.position.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.position.contract.greeksHistory.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            contractId: item.contractId !== undefined ? {
                equals: item.contractId 
               } : undefined,
          },
          create: {
            timestamp: item.timestamp !== undefined ? item.timestamp : undefined,
            underlyingPrice: item.underlyingPrice !== undefined ? item.underlyingPrice : undefined,
            optionPrice: item.optionPrice !== undefined ? item.optionPrice : undefined,
            bidPrice: item.bidPrice !== undefined ? item.bidPrice : undefined,
            askPrice: item.askPrice !== undefined ? item.askPrice : undefined,
            impliedVolatility: item.impliedVolatility !== undefined ? item.impliedVolatility : undefined,
            delta: item.delta !== undefined ? item.delta : undefined,
            gamma: item.gamma !== undefined ? item.gamma : undefined,
            theta: item.theta !== undefined ? item.theta : undefined,
            vega: item.vega !== undefined ? item.vega : undefined,
            rho: item.rho !== undefined ? item.rho : undefined,
            volume: item.volume !== undefined ? item.volume : undefined,
            openInterest: item.openInterest !== undefined ? item.openInterest : undefined,
            daysToExpiration: item.daysToExpiration !== undefined ? item.daysToExpiration : undefined,
            intrinsicValue: item.intrinsicValue !== undefined ? item.intrinsicValue : undefined,
            extrinsicValue: item.extrinsicValue !== undefined ? item.extrinsicValue : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
      executions: prop.position.contract.executions ? 
        Array.isArray(prop.position.contract.executions) && prop.position.contract.executions.length > 0 &&  prop.position.contract.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.position.contract.executions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.position.contract.executions.map((item) => ({
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
        },
      }
    } : undefined,
    executions: prop.position.executions ? 
      Array.isArray(prop.position.executions) && prop.position.executions.length > 0 &&  prop.position.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.position.executions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.position.executions.map((item) => ({
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
      contract: item.contract ? 
        typeof item.contract === 'object' && Object.keys(item.contract).length === 1 && Object.keys(item.contract)[0] === 'id'
    ? { connect: {
            id: item.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.contract.id !== undefined ? item.contract.id : undefined,
            symbol: item.contract.symbol !== undefined ? {
                equals: item.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.contract.symbol !== undefined ? item.contract.symbol : undefined,
            contractSymbol: item.contract.contractSymbol !== undefined ? item.contract.contractSymbol : undefined,
            optionType: item.contract.optionType !== undefined ? item.contract.optionType : undefined,
            strikePrice: item.contract.strikePrice !== undefined ? item.contract.strikePrice : undefined,
            expirationDate: item.contract.expirationDate !== undefined ? item.contract.expirationDate : undefined,
            daysToExpiration: item.contract.daysToExpiration !== undefined ? item.contract.daysToExpiration : undefined,
            lastPrice: item.contract.lastPrice !== undefined ? item.contract.lastPrice : undefined,
            bidPrice: item.contract.bidPrice !== undefined ? item.contract.bidPrice : undefined,
            askPrice: item.contract.askPrice !== undefined ? item.contract.askPrice : undefined,
            midPrice: item.contract.midPrice !== undefined ? item.contract.midPrice : undefined,
            bidSize: item.contract.bidSize !== undefined ? item.contract.bidSize : undefined,
            askSize: item.contract.askSize !== undefined ? item.contract.askSize : undefined,
            volume: item.contract.volume !== undefined ? item.contract.volume : undefined,
            openInterest: item.contract.openInterest !== undefined ? item.contract.openInterest : undefined,
            impliedVolatility: item.contract.impliedVolatility !== undefined ? item.contract.impliedVolatility : undefined,
            delta: item.contract.delta !== undefined ? item.contract.delta : undefined,
            gamma: item.contract.gamma !== undefined ? item.contract.gamma : undefined,
            theta: item.contract.theta !== undefined ? item.contract.theta : undefined,
            vega: item.contract.vega !== undefined ? item.contract.vega : undefined,
            rho: item.contract.rho !== undefined ? item.contract.rho : undefined,
            inTheMoney: item.contract.inTheMoney !== undefined ? item.contract.inTheMoney : undefined,
            intrinsicValue: item.contract.intrinsicValue !== undefined ? item.contract.intrinsicValue : undefined,
            extrinsicValue: item.contract.extrinsicValue !== undefined ? item.contract.extrinsicValue : undefined,
            theoreticalPrice: item.contract.theoreticalPrice !== undefined ? item.contract.theoreticalPrice : undefined,
            underlyingPrice: item.contract.underlyingPrice !== undefined ? item.contract.underlyingPrice : undefined,
            metadata: item.contract.metadata !== undefined ? item.contract.metadata : undefined,
            dataTimestamp: item.contract.dataTimestamp !== undefined ? item.contract.dataTimestamp : undefined,
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
          mutation: UPDATE_MANY_OPTIONSPOSITIONEVENT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyOptionsPositionEvent) {
          return response.data.updateManyOptionsPositionEvent;
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
          logger.error("Non-retryable constraint violation in updateManyOptionsPositionEvent", {
            operation: 'updateManyOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
          logger.warn("Database connection error in updateManyOptionsPositionEvent, retrying...", {
            operation: 'updateManyOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
   * Delete a single OptionsPositionEvent record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted OptionsPositionEvent or null.
   */
  async delete(props: OptionsPositionEventType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsPositionEventType> {
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

        const DELETE_ONE_OPTIONSPOSITIONEVENT = gql`
          mutation deleteOneOptionsPositionEvent($where: OptionsPositionEventWhereUniqueInput!) {
            deleteOneOptionsPositionEvent(where: $where) {
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
          mutation: DELETE_ONE_OPTIONSPOSITIONEVENT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneOptionsPositionEvent) {
          return response.data.deleteOneOptionsPositionEvent;
        } else {
          return null as unknown as OptionsPositionEventType;
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
          logger.error("Non-retryable constraint violation in deleteOneOptionsPositionEvent", {
            operation: 'deleteOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
          logger.warn("Database connection error in deleteOneOptionsPositionEvent, retrying...", {
            operation: 'deleteOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
            operation: 'deleteOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
   * Retrieve a single OptionsPositionEvent record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved OptionsPositionEvent or null.
   */
  async get(props: OptionsPositionEventType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<OptionsPositionEventType | null> {
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

        const GET_OPTIONSPOSITIONEVENT = gql`
          query getOptionsPositionEvent($where: OptionsPositionEventWhereUniqueInput!) {
            getOptionsPositionEvent(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  positionId: props.positionId !== undefined ? {
    equals: props.positionId 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_OPTIONSPOSITIONEVENT,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getOptionsPositionEvent ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsPositionEvent found') {
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
          logger.warn("Database connection error in getOptionsPositionEvent, retrying...", {
            operation: 'getOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
   * Retrieve all OptionsPositionEvents records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of OptionsPositionEvent records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsPositionEventType[] | null> {
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

        const GET_ALL_OPTIONSPOSITIONEVENT = gql`
          query getAllOptionsPositionEvent {
            optionsPositionEvents {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_OPTIONSPOSITIONEVENT,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.optionsPositionEvents ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsPositionEvent found') {
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
          logger.warn("Database connection error in getAllOptionsPositionEvent, retrying...", {
            operation: 'getAllOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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
   * Find multiple OptionsPositionEvent records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found OptionsPositionEvent records or null.
   */
  async findMany(props: OptionsPositionEventType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<OptionsPositionEventType[] | null> {
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

        const FIND_MANY_OPTIONSPOSITIONEVENT = gql`
          query findManyOptionsPositionEvent($where: OptionsPositionEventWhereInput!) {
            optionsPositionEvents(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
  positionId: props.positionId !== undefined ? {
    equals: props.positionId 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyOptionsPositionEvent requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_OPTIONSPOSITIONEVENT,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.optionsPositionEvents) {
          return response.data.optionsPositionEvents;
        } else {
          return [] as OptionsPositionEventType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsPositionEvent found') {
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
          logger.warn("Database connection error in findManyOptionsPositionEvent, retrying...", {
            operation: 'findManyOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyOptionsPositionEvent',
            model: 'OptionsPositionEvent',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyOptionsPositionEvent',
            model: 'OptionsPositionEvent',
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

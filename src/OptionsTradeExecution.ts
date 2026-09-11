
  
import { OptionsTradeExecution as OptionsTradeExecutionType } from './generated/typegraphql-prisma/models/OptionsTradeExecution';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the OptionsTradeExecution model.
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
    lifecycleEvents {
      id
      positionId
      fromState
      toState
      trigger
      metadata
      createdAt
    }
  }
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
  alpacaAccountId
  brokerOrderId
  executionSide
  quantity
  executionPrice
  executionValue
  fees
  executionTime
  underlyingPriceAtExecution
  deltaAtExecution
  gammaAtExecution
  thetaAtExecution
  vegaAtExecution
  rhoAtExecution
  impliedVolatilityAtExecution
  orderType
  limitPrice
  stopPrice
  timeInForce
  venue
  slippage
  notes
  metadata
  createdAt
  updatedAt

  `;

  export const OptionsTradeExecution = {

    /**
     * Create a new OptionsTradeExecution record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created OptionsTradeExecution or null.
     */

    /**
     * Create a new OptionsTradeExecution record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created OptionsTradeExecution or null.
     */
    async create(props: OptionsTradeExecutionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsTradeExecutionType> {
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

          const CREATE_ONE_OPTIONSTRADEEXECUTION = gql`
              mutation createOneOptionsTradeExecution($data: OptionsTradeExecutionCreateInput!) {
                createOneOptionsTradeExecution(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                alpacaAccountId: props.alpacaAccountId !== undefined ? props.alpacaAccountId : undefined,
  brokerOrderId: props.brokerOrderId !== undefined ? props.brokerOrderId : undefined,
  executionSide: props.executionSide !== undefined ? props.executionSide : undefined,
  quantity: props.quantity !== undefined ? props.quantity : undefined,
  executionPrice: props.executionPrice !== undefined ? props.executionPrice : undefined,
  executionValue: props.executionValue !== undefined ? props.executionValue : undefined,
  fees: props.fees !== undefined ? props.fees : undefined,
  executionTime: props.executionTime !== undefined ? props.executionTime : undefined,
  underlyingPriceAtExecution: props.underlyingPriceAtExecution !== undefined ? props.underlyingPriceAtExecution : undefined,
  deltaAtExecution: props.deltaAtExecution !== undefined ? props.deltaAtExecution : undefined,
  gammaAtExecution: props.gammaAtExecution !== undefined ? props.gammaAtExecution : undefined,
  thetaAtExecution: props.thetaAtExecution !== undefined ? props.thetaAtExecution : undefined,
  vegaAtExecution: props.vegaAtExecution !== undefined ? props.vegaAtExecution : undefined,
  rhoAtExecution: props.rhoAtExecution !== undefined ? props.rhoAtExecution : undefined,
  impliedVolatilityAtExecution: props.impliedVolatilityAtExecution !== undefined ? props.impliedVolatilityAtExecution : undefined,
  orderType: props.orderType !== undefined ? props.orderType : undefined,
  limitPrice: props.limitPrice !== undefined ? props.limitPrice : undefined,
  stopPrice: props.stopPrice !== undefined ? props.stopPrice : undefined,
  timeInForce: props.timeInForce !== undefined ? props.timeInForce : undefined,
  venue: props.venue !== undefined ? props.venue : undefined,
  slippage: props.slippage !== undefined ? props.slippage : undefined,
  notes: props.notes !== undefined ? props.notes : undefined,
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
    lifecycleEvents: props.position.lifecycleEvents ? 
      Array.isArray(props.position.lifecycleEvents) && props.position.lifecycleEvents.length > 0 &&  props.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.position.lifecycleEvents.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.position.lifecycleEvents.map((item) => ({
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
    }
  } : undefined,
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
    greeksHistory: props.contract.greeksHistory ? 
      Array.isArray(props.contract.greeksHistory) && props.contract.greeksHistory.length > 0 &&  props.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.greeksHistory.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.greeksHistory.map((item) => ({
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
      },
    }
  } : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_OPTIONSTRADEEXECUTION,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneOptionsTradeExecution) {
            return response.data.createOneOptionsTradeExecution;
          } else {
            return null as unknown as OptionsTradeExecutionType;
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
            logger.error("Non-retryable constraint violation in createOneOptionsTradeExecution", {
              operation: 'createOneOptionsTradeExecution',
              model: 'OptionsTradeExecution',
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
            logger.warn("Database connection error in createOneOptionsTradeExecution, retrying...", {
              operation: 'createOneOptionsTradeExecution',
              model: 'OptionsTradeExecution',
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
              operation: 'createOneOptionsTradeExecution',
              model: 'OptionsTradeExecution',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneOptionsTradeExecution',
              model: 'OptionsTradeExecution',
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
   * Create multiple OptionsTradeExecution records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of OptionsTradeExecution objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: OptionsTradeExecutionType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_OPTIONSTRADEEXECUTION = gql`
          mutation createManyOptionsTradeExecution($data: [OptionsTradeExecutionCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyOptionsTradeExecution(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      positionId: prop.positionId !== undefined ? prop.positionId : undefined,
  contractId: prop.contractId !== undefined ? prop.contractId : undefined,
  alpacaAccountId: prop.alpacaAccountId !== undefined ? prop.alpacaAccountId : undefined,
  brokerOrderId: prop.brokerOrderId !== undefined ? prop.brokerOrderId : undefined,
  executionSide: prop.executionSide !== undefined ? prop.executionSide : undefined,
  quantity: prop.quantity !== undefined ? prop.quantity : undefined,
  executionPrice: prop.executionPrice !== undefined ? prop.executionPrice : undefined,
  executionValue: prop.executionValue !== undefined ? prop.executionValue : undefined,
  fees: prop.fees !== undefined ? prop.fees : undefined,
  executionTime: prop.executionTime !== undefined ? prop.executionTime : undefined,
  underlyingPriceAtExecution: prop.underlyingPriceAtExecution !== undefined ? prop.underlyingPriceAtExecution : undefined,
  deltaAtExecution: prop.deltaAtExecution !== undefined ? prop.deltaAtExecution : undefined,
  gammaAtExecution: prop.gammaAtExecution !== undefined ? prop.gammaAtExecution : undefined,
  thetaAtExecution: prop.thetaAtExecution !== undefined ? prop.thetaAtExecution : undefined,
  vegaAtExecution: prop.vegaAtExecution !== undefined ? prop.vegaAtExecution : undefined,
  rhoAtExecution: prop.rhoAtExecution !== undefined ? prop.rhoAtExecution : undefined,
  impliedVolatilityAtExecution: prop.impliedVolatilityAtExecution !== undefined ? prop.impliedVolatilityAtExecution : undefined,
  orderType: prop.orderType !== undefined ? prop.orderType : undefined,
  limitPrice: prop.limitPrice !== undefined ? prop.limitPrice : undefined,
  stopPrice: prop.stopPrice !== undefined ? prop.stopPrice : undefined,
  timeInForce: prop.timeInForce !== undefined ? prop.timeInForce : undefined,
  venue: prop.venue !== undefined ? prop.venue : undefined,
  slippage: prop.slippage !== undefined ? prop.slippage : undefined,
  notes: prop.notes !== undefined ? prop.notes : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_OPTIONSTRADEEXECUTION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyOptionsTradeExecution) {
          return response.data.createManyOptionsTradeExecution;
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
          logger.warn("Duplicate key in createManyOptionsTradeExecution (expected during overlapping fetches)", {
            operation: 'createManyOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
          logger.warn("Database connection error in createManyOptionsTradeExecution, retrying...", {
            operation: 'createManyOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
   * Update a single OptionsTradeExecution record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated OptionsTradeExecution or null.
   */
  async update(props: OptionsTradeExecutionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsTradeExecutionType> {
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

        const UPDATE_ONE_OPTIONSTRADEEXECUTION = gql`
          mutation updateOneOptionsTradeExecution($data: OptionsTradeExecutionUpdateInput!, $where: OptionsTradeExecutionWhereUniqueInput!) {
            updateOneOptionsTradeExecution(data: $data, where: $where) {
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
  brokerOrderId: props.brokerOrderId !== undefined ? {
            set: props.brokerOrderId 
           } : undefined,
  executionSide: props.executionSide !== undefined ? {
            set: props.executionSide 
           } : undefined,
  quantity: props.quantity !== undefined ? {
            set: props.quantity 
           } : undefined,
  executionPrice: props.executionPrice !== undefined ? {
            set: props.executionPrice 
           } : undefined,
  executionValue: props.executionValue !== undefined ? {
            set: props.executionValue 
           } : undefined,
  fees: props.fees !== undefined ? {
            set: props.fees 
           } : undefined,
  executionTime: props.executionTime !== undefined ? {
            set: props.executionTime 
           } : undefined,
  underlyingPriceAtExecution: props.underlyingPriceAtExecution !== undefined ? {
            set: props.underlyingPriceAtExecution 
           } : undefined,
  deltaAtExecution: props.deltaAtExecution !== undefined ? {
            set: props.deltaAtExecution 
           } : undefined,
  gammaAtExecution: props.gammaAtExecution !== undefined ? {
            set: props.gammaAtExecution 
           } : undefined,
  thetaAtExecution: props.thetaAtExecution !== undefined ? {
            set: props.thetaAtExecution 
           } : undefined,
  vegaAtExecution: props.vegaAtExecution !== undefined ? {
            set: props.vegaAtExecution 
           } : undefined,
  rhoAtExecution: props.rhoAtExecution !== undefined ? {
            set: props.rhoAtExecution 
           } : undefined,
  impliedVolatilityAtExecution: props.impliedVolatilityAtExecution !== undefined ? {
            set: props.impliedVolatilityAtExecution 
           } : undefined,
  orderType: props.orderType !== undefined ? {
            set: props.orderType 
           } : undefined,
  limitPrice: props.limitPrice !== undefined ? {
            set: props.limitPrice 
           } : undefined,
  stopPrice: props.stopPrice !== undefined ? {
            set: props.stopPrice 
           } : undefined,
  timeInForce: props.timeInForce !== undefined ? {
            set: props.timeInForce 
           } : undefined,
  venue: props.venue !== undefined ? {
            set: props.venue 
           } : undefined,
  slippage: props.slippage !== undefined ? {
            set: props.slippage 
           } : undefined,
  notes: props.notes !== undefined ? {
            set: props.notes 
           } : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
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
    lifecycleEvents: props.position.lifecycleEvents ? 
    Array.isArray(props.position.lifecycleEvents) && props.position.lifecycleEvents.length > 0 && props.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.position.lifecycleEvents.map((item) => ({
      id: item.id
    }))
} : { upsert: props.position.lifecycleEvents.map((item) => ({
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
    lifecycleEvents: props.position.lifecycleEvents ? 
      Array.isArray(props.position.lifecycleEvents) && props.position.lifecycleEvents.length > 0 &&  props.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.position.lifecycleEvents.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.position.lifecycleEvents.map((item) => ({
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
    }
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
    greeksHistory: props.contract.greeksHistory ? 
    Array.isArray(props.contract.greeksHistory) && props.contract.greeksHistory.length > 0 && props.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.contract.greeksHistory.map((item) => ({
      id: item.id
    }))
} : { upsert: props.contract.greeksHistory.map((item) => ({
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
    greeksHistory: props.contract.greeksHistory ? 
      Array.isArray(props.contract.greeksHistory) && props.contract.greeksHistory.length > 0 &&  props.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.greeksHistory.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.greeksHistory.map((item) => ({
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
      },
    }
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_OPTIONSTRADEEXECUTION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneOptionsTradeExecution) {
          return response.data.updateOneOptionsTradeExecution;
        } else {
          return null as unknown as OptionsTradeExecutionType;
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
          logger.error("Non-retryable constraint violation in updateOneOptionsTradeExecution", {
            operation: 'updateOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
          logger.warn("Database connection error in updateOneOptionsTradeExecution, retrying...", {
            operation: 'updateOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
            operation: 'updateOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
   * Upsert a single OptionsTradeExecution record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated OptionsTradeExecution or null.
   */
  async upsert(props: OptionsTradeExecutionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsTradeExecutionType> {
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

        const UPSERT_ONE_OPTIONSTRADEEXECUTION = gql`
          mutation upsertOneOptionsTradeExecution($where: OptionsTradeExecutionWhereUniqueInput!, $create: OptionsTradeExecutionCreateInput!, $update: OptionsTradeExecutionUpdateInput!) {
            upsertOneOptionsTradeExecution(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  positionId: props.positionId !== undefined ? {
    equals: props.positionId 
  } : undefined,
  contractId: props.contractId !== undefined ? {
    equals: props.contractId 
  } : undefined,
  alpacaAccountId: props.alpacaAccountId !== undefined ? {
    equals: props.alpacaAccountId 
  } : undefined,
  brokerOrderId: props.brokerOrderId !== undefined ? {
    equals: props.brokerOrderId 
  } : undefined,
      },
          create: {
        alpacaAccountId: props.alpacaAccountId !== undefined ? props.alpacaAccountId : undefined,
  brokerOrderId: props.brokerOrderId !== undefined ? props.brokerOrderId : undefined,
  executionSide: props.executionSide !== undefined ? props.executionSide : undefined,
  quantity: props.quantity !== undefined ? props.quantity : undefined,
  executionPrice: props.executionPrice !== undefined ? props.executionPrice : undefined,
  executionValue: props.executionValue !== undefined ? props.executionValue : undefined,
  fees: props.fees !== undefined ? props.fees : undefined,
  executionTime: props.executionTime !== undefined ? props.executionTime : undefined,
  underlyingPriceAtExecution: props.underlyingPriceAtExecution !== undefined ? props.underlyingPriceAtExecution : undefined,
  deltaAtExecution: props.deltaAtExecution !== undefined ? props.deltaAtExecution : undefined,
  gammaAtExecution: props.gammaAtExecution !== undefined ? props.gammaAtExecution : undefined,
  thetaAtExecution: props.thetaAtExecution !== undefined ? props.thetaAtExecution : undefined,
  vegaAtExecution: props.vegaAtExecution !== undefined ? props.vegaAtExecution : undefined,
  rhoAtExecution: props.rhoAtExecution !== undefined ? props.rhoAtExecution : undefined,
  impliedVolatilityAtExecution: props.impliedVolatilityAtExecution !== undefined ? props.impliedVolatilityAtExecution : undefined,
  orderType: props.orderType !== undefined ? props.orderType : undefined,
  limitPrice: props.limitPrice !== undefined ? props.limitPrice : undefined,
  stopPrice: props.stopPrice !== undefined ? props.stopPrice : undefined,
  timeInForce: props.timeInForce !== undefined ? props.timeInForce : undefined,
  venue: props.venue !== undefined ? props.venue : undefined,
  slippage: props.slippage !== undefined ? props.slippage : undefined,
  notes: props.notes !== undefined ? props.notes : undefined,
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
    lifecycleEvents: props.position.lifecycleEvents ? 
      Array.isArray(props.position.lifecycleEvents) && props.position.lifecycleEvents.length > 0 &&  props.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.position.lifecycleEvents.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.position.lifecycleEvents.map((item) => ({
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
    }
  } : undefined,
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
    greeksHistory: props.contract.greeksHistory ? 
      Array.isArray(props.contract.greeksHistory) && props.contract.greeksHistory.length > 0 &&  props.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.greeksHistory.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.greeksHistory.map((item) => ({
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
      },
    }
  } : undefined,
      },
          update: {
      alpacaAccountId: props.alpacaAccountId !== undefined ? {
            set: props.alpacaAccountId 
           } : undefined,
  brokerOrderId: props.brokerOrderId !== undefined ? {
            set: props.brokerOrderId 
           } : undefined,
  executionSide: props.executionSide !== undefined ? {
            set: props.executionSide 
           } : undefined,
  quantity: props.quantity !== undefined ? {
            set: props.quantity 
           } : undefined,
  executionPrice: props.executionPrice !== undefined ? {
            set: props.executionPrice 
           } : undefined,
  executionValue: props.executionValue !== undefined ? {
            set: props.executionValue 
           } : undefined,
  fees: props.fees !== undefined ? {
            set: props.fees 
           } : undefined,
  executionTime: props.executionTime !== undefined ? {
            set: props.executionTime 
           } : undefined,
  underlyingPriceAtExecution: props.underlyingPriceAtExecution !== undefined ? {
            set: props.underlyingPriceAtExecution 
           } : undefined,
  deltaAtExecution: props.deltaAtExecution !== undefined ? {
            set: props.deltaAtExecution 
           } : undefined,
  gammaAtExecution: props.gammaAtExecution !== undefined ? {
            set: props.gammaAtExecution 
           } : undefined,
  thetaAtExecution: props.thetaAtExecution !== undefined ? {
            set: props.thetaAtExecution 
           } : undefined,
  vegaAtExecution: props.vegaAtExecution !== undefined ? {
            set: props.vegaAtExecution 
           } : undefined,
  rhoAtExecution: props.rhoAtExecution !== undefined ? {
            set: props.rhoAtExecution 
           } : undefined,
  impliedVolatilityAtExecution: props.impliedVolatilityAtExecution !== undefined ? {
            set: props.impliedVolatilityAtExecution 
           } : undefined,
  orderType: props.orderType !== undefined ? {
            set: props.orderType 
           } : undefined,
  limitPrice: props.limitPrice !== undefined ? {
            set: props.limitPrice 
           } : undefined,
  stopPrice: props.stopPrice !== undefined ? {
            set: props.stopPrice 
           } : undefined,
  timeInForce: props.timeInForce !== undefined ? {
            set: props.timeInForce 
           } : undefined,
  venue: props.venue !== undefined ? {
            set: props.venue 
           } : undefined,
  slippage: props.slippage !== undefined ? {
            set: props.slippage 
           } : undefined,
  notes: props.notes !== undefined ? {
            set: props.notes 
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
    lifecycleEvents: props.position.lifecycleEvents ? 
    Array.isArray(props.position.lifecycleEvents) && props.position.lifecycleEvents.length > 0 && props.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.position.lifecycleEvents.map((item) => ({
      id: item.id
    }))
} : { upsert: props.position.lifecycleEvents.map((item) => ({
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
    lifecycleEvents: props.position.lifecycleEvents ? 
      Array.isArray(props.position.lifecycleEvents) && props.position.lifecycleEvents.length > 0 &&  props.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.position.lifecycleEvents.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.position.lifecycleEvents.map((item) => ({
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
    }
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
    greeksHistory: props.contract.greeksHistory ? 
    Array.isArray(props.contract.greeksHistory) && props.contract.greeksHistory.length > 0 && props.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.contract.greeksHistory.map((item) => ({
      id: item.id
    }))
} : { upsert: props.contract.greeksHistory.map((item) => ({
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
    greeksHistory: props.contract.greeksHistory ? 
      Array.isArray(props.contract.greeksHistory) && props.contract.greeksHistory.length > 0 &&  props.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.contract.greeksHistory.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.contract.greeksHistory.map((item) => ({
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
      },
    }
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_OPTIONSTRADEEXECUTION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneOptionsTradeExecution) {
          return response.data.upsertOneOptionsTradeExecution;
        } else {
          return null as unknown as OptionsTradeExecutionType;
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
          logger.error("Non-retryable constraint violation in upsertOneOptionsTradeExecution", {
            operation: 'upsertOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
          logger.warn("Database connection error in upsertOneOptionsTradeExecution, retrying...", {
            operation: 'upsertOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
            operation: 'upsertOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
   * Update multiple OptionsTradeExecution records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of OptionsTradeExecution objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: OptionsTradeExecutionType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_OPTIONSTRADEEXECUTION = gql`
          mutation updateManyOptionsTradeExecution($data: [OptionsTradeExecutionCreateManyInput!]!) {
            updateManyOptionsTradeExecution(data: $data) {
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
  brokerOrderId: prop.brokerOrderId !== undefined ? {
            set: prop.brokerOrderId 
           } : undefined,
  executionSide: prop.executionSide !== undefined ? {
            set: prop.executionSide 
           } : undefined,
  quantity: prop.quantity !== undefined ? {
            set: prop.quantity 
           } : undefined,
  executionPrice: prop.executionPrice !== undefined ? {
            set: prop.executionPrice 
           } : undefined,
  executionValue: prop.executionValue !== undefined ? {
            set: prop.executionValue 
           } : undefined,
  fees: prop.fees !== undefined ? {
            set: prop.fees 
           } : undefined,
  executionTime: prop.executionTime !== undefined ? {
            set: prop.executionTime 
           } : undefined,
  underlyingPriceAtExecution: prop.underlyingPriceAtExecution !== undefined ? {
            set: prop.underlyingPriceAtExecution 
           } : undefined,
  deltaAtExecution: prop.deltaAtExecution !== undefined ? {
            set: prop.deltaAtExecution 
           } : undefined,
  gammaAtExecution: prop.gammaAtExecution !== undefined ? {
            set: prop.gammaAtExecution 
           } : undefined,
  thetaAtExecution: prop.thetaAtExecution !== undefined ? {
            set: prop.thetaAtExecution 
           } : undefined,
  vegaAtExecution: prop.vegaAtExecution !== undefined ? {
            set: prop.vegaAtExecution 
           } : undefined,
  rhoAtExecution: prop.rhoAtExecution !== undefined ? {
            set: prop.rhoAtExecution 
           } : undefined,
  impliedVolatilityAtExecution: prop.impliedVolatilityAtExecution !== undefined ? {
            set: prop.impliedVolatilityAtExecution 
           } : undefined,
  orderType: prop.orderType !== undefined ? {
            set: prop.orderType 
           } : undefined,
  limitPrice: prop.limitPrice !== undefined ? {
            set: prop.limitPrice 
           } : undefined,
  stopPrice: prop.stopPrice !== undefined ? {
            set: prop.stopPrice 
           } : undefined,
  timeInForce: prop.timeInForce !== undefined ? {
            set: prop.timeInForce 
           } : undefined,
  venue: prop.venue !== undefined ? {
            set: prop.venue 
           } : undefined,
  slippage: prop.slippage !== undefined ? {
            set: prop.slippage 
           } : undefined,
  notes: prop.notes !== undefined ? {
            set: prop.notes 
           } : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
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
    lifecycleEvents: prop.position.lifecycleEvents ? 
    Array.isArray(prop.position.lifecycleEvents) && prop.position.lifecycleEvents.length > 0 && prop.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.position.lifecycleEvents.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.position.lifecycleEvents.map((item) => ({
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
    lifecycleEvents: prop.position.lifecycleEvents ? 
      Array.isArray(prop.position.lifecycleEvents) && prop.position.lifecycleEvents.length > 0 &&  prop.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.position.lifecycleEvents.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.position.lifecycleEvents.map((item) => ({
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
    }
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
    greeksHistory: prop.contract.greeksHistory ? 
    Array.isArray(prop.contract.greeksHistory) && prop.contract.greeksHistory.length > 0 && prop.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.contract.greeksHistory.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.contract.greeksHistory.map((item) => ({
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
    greeksHistory: prop.contract.greeksHistory ? 
      Array.isArray(prop.contract.greeksHistory) && prop.contract.greeksHistory.length > 0 &&  prop.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.contract.greeksHistory.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.contract.greeksHistory.map((item) => ({
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
      },
    }
  } : undefined,

          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_OPTIONSTRADEEXECUTION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyOptionsTradeExecution) {
          return response.data.updateManyOptionsTradeExecution;
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
          logger.error("Non-retryable constraint violation in updateManyOptionsTradeExecution", {
            operation: 'updateManyOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
          logger.warn("Database connection error in updateManyOptionsTradeExecution, retrying...", {
            operation: 'updateManyOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
   * Delete a single OptionsTradeExecution record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted OptionsTradeExecution or null.
   */
  async delete(props: OptionsTradeExecutionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsTradeExecutionType> {
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

        const DELETE_ONE_OPTIONSTRADEEXECUTION = gql`
          mutation deleteOneOptionsTradeExecution($where: OptionsTradeExecutionWhereUniqueInput!) {
            deleteOneOptionsTradeExecution(where: $where) {
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
          mutation: DELETE_ONE_OPTIONSTRADEEXECUTION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneOptionsTradeExecution) {
          return response.data.deleteOneOptionsTradeExecution;
        } else {
          return null as unknown as OptionsTradeExecutionType;
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
          logger.error("Non-retryable constraint violation in deleteOneOptionsTradeExecution", {
            operation: 'deleteOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
          logger.warn("Database connection error in deleteOneOptionsTradeExecution, retrying...", {
            operation: 'deleteOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
            operation: 'deleteOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
   * Retrieve a single OptionsTradeExecution record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved OptionsTradeExecution or null.
   */
  async get(props: OptionsTradeExecutionType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<OptionsTradeExecutionType | null> {
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

        const GET_OPTIONSTRADEEXECUTION = gql`
          query getOptionsTradeExecution($where: OptionsTradeExecutionWhereUniqueInput!) {
            getOptionsTradeExecution(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  positionId: props.positionId !== undefined ? {
    equals: props.positionId 
  } : undefined,
  contractId: props.contractId !== undefined ? {
    equals: props.contractId 
  } : undefined,
  alpacaAccountId: props.alpacaAccountId !== undefined ? {
    equals: props.alpacaAccountId 
  } : undefined,
  brokerOrderId: props.brokerOrderId !== undefined ? {
    equals: props.brokerOrderId 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_OPTIONSTRADEEXECUTION,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getOptionsTradeExecution ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsTradeExecution found') {
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
          logger.warn("Database connection error in getOptionsTradeExecution, retrying...", {
            operation: 'getOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
   * Retrieve all OptionsTradeExecutions records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of OptionsTradeExecution records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsTradeExecutionType[] | null> {
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

        const GET_ALL_OPTIONSTRADEEXECUTION = gql`
          query getAllOptionsTradeExecution {
            optionsTradeExecutions {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_OPTIONSTRADEEXECUTION,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.optionsTradeExecutions ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsTradeExecution found') {
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
          logger.warn("Database connection error in getAllOptionsTradeExecution, retrying...", {
            operation: 'getAllOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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
   * Find multiple OptionsTradeExecution records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found OptionsTradeExecution records or null.
   */
  async findMany(props: OptionsTradeExecutionType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<OptionsTradeExecutionType[] | null> {
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

        const FIND_MANY_OPTIONSTRADEEXECUTION = gql`
          query findManyOptionsTradeExecution($where: OptionsTradeExecutionWhereInput!) {
            optionsTradeExecutions(where: $where) {
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
  contractId: props.contractId !== undefined ? {
    equals: props.contractId 
  } : undefined,
  alpacaAccountId: props.alpacaAccountId !== undefined ? {
    equals: props.alpacaAccountId 
  } : undefined,
  brokerOrderId: props.brokerOrderId !== undefined ? {
    equals: props.brokerOrderId 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyOptionsTradeExecution requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_OPTIONSTRADEEXECUTION,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.optionsTradeExecutions) {
          return response.data.optionsTradeExecutions;
        } else {
          return [] as OptionsTradeExecutionType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsTradeExecution found') {
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
          logger.warn("Database connection error in findManyOptionsTradeExecution, retrying...", {
            operation: 'findManyOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyOptionsTradeExecution',
            model: 'OptionsTradeExecution',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyOptionsTradeExecution',
            model: 'OptionsTradeExecution',
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

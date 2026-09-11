
  
import { OptionsContract as OptionsContractType } from './generated/typegraphql-prisma/models/OptionsContract';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the OptionsContract model.
   */

  const selectionSet = `
    
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
  positions {
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
  greeksHistory {
    id
    contractId
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
  }
  executions {
    id
    positionId
    contractId
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
  }

  `;

  export const OptionsContract = {

    /**
     * Create a new OptionsContract record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created OptionsContract or null.
     */

    /**
     * Create a new OptionsContract record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created OptionsContract or null.
     */
    async create(props: OptionsContractType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsContractType> {
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

          const CREATE_ONE_OPTIONSCONTRACT = gql`
              mutation createOneOptionsContract($data: OptionsContractCreateInput!) {
                createOneOptionsContract(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                symbol: props.symbol !== undefined ? props.symbol : undefined,
  contractSymbol: props.contractSymbol !== undefined ? props.contractSymbol : undefined,
  optionType: props.optionType !== undefined ? props.optionType : undefined,
  strikePrice: props.strikePrice !== undefined ? props.strikePrice : undefined,
  expirationDate: props.expirationDate !== undefined ? props.expirationDate : undefined,
  daysToExpiration: props.daysToExpiration !== undefined ? props.daysToExpiration : undefined,
  lastPrice: props.lastPrice !== undefined ? props.lastPrice : undefined,
  bidPrice: props.bidPrice !== undefined ? props.bidPrice : undefined,
  askPrice: props.askPrice !== undefined ? props.askPrice : undefined,
  midPrice: props.midPrice !== undefined ? props.midPrice : undefined,
  bidSize: props.bidSize !== undefined ? props.bidSize : undefined,
  askSize: props.askSize !== undefined ? props.askSize : undefined,
  volume: props.volume !== undefined ? props.volume : undefined,
  openInterest: props.openInterest !== undefined ? props.openInterest : undefined,
  impliedVolatility: props.impliedVolatility !== undefined ? props.impliedVolatility : undefined,
  delta: props.delta !== undefined ? props.delta : undefined,
  gamma: props.gamma !== undefined ? props.gamma : undefined,
  theta: props.theta !== undefined ? props.theta : undefined,
  vega: props.vega !== undefined ? props.vega : undefined,
  rho: props.rho !== undefined ? props.rho : undefined,
  inTheMoney: props.inTheMoney !== undefined ? props.inTheMoney : undefined,
  intrinsicValue: props.intrinsicValue !== undefined ? props.intrinsicValue : undefined,
  extrinsicValue: props.extrinsicValue !== undefined ? props.extrinsicValue : undefined,
  theoreticalPrice: props.theoreticalPrice !== undefined ? props.theoreticalPrice : undefined,
  underlyingPrice: props.underlyingPrice !== undefined ? props.underlyingPrice : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  dataTimestamp: props.dataTimestamp !== undefined ? props.dataTimestamp : undefined,
  positions: props.positions ? 
    Array.isArray(props.positions) && props.positions.length > 0 &&  props.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.positions.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.positions.map((item) => ({
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
        connect:      item.executions.map((item) => ({
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
    lifecycleEvents: item.lifecycleEvents ? 
      Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      item.lifecycleEvents.map((item) => ({
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
  greeksHistory: props.greeksHistory ? 
    Array.isArray(props.greeksHistory) && props.greeksHistory.length > 0 &&  props.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.greeksHistory.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.greeksHistory.map((item) => ({
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
  executions: props.executions ? 
    Array.isArray(props.executions) && props.executions.length > 0 &&  props.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.executions.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.executions.map((item) => ({
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
      contract: item.position.contract ? 
        typeof item.position.contract === 'object' && Object.keys(item.position.contract).length === 1 && Object.keys(item.position.contract)[0] === 'id'
    ? { connect: {
            id: item.position.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.contract.id !== undefined ? item.position.contract.id : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                equals: item.position.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.position.contract.symbol !== undefined ? item.position.contract.symbol : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? item.position.contract.contractSymbol : undefined,
            optionType: item.position.contract.optionType !== undefined ? item.position.contract.optionType : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? item.position.contract.strikePrice : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? item.position.contract.expirationDate : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? item.position.contract.daysToExpiration : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? item.position.contract.lastPrice : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? item.position.contract.bidPrice : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? item.position.contract.askPrice : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? item.position.contract.midPrice : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? item.position.contract.bidSize : undefined,
            askSize: item.position.contract.askSize !== undefined ? item.position.contract.askSize : undefined,
            volume: item.position.contract.volume !== undefined ? item.position.contract.volume : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? item.position.contract.openInterest : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? item.position.contract.impliedVolatility : undefined,
            delta: item.position.contract.delta !== undefined ? item.position.contract.delta : undefined,
            gamma: item.position.contract.gamma !== undefined ? item.position.contract.gamma : undefined,
            theta: item.position.contract.theta !== undefined ? item.position.contract.theta : undefined,
            vega: item.position.contract.vega !== undefined ? item.position.contract.vega : undefined,
            rho: item.position.contract.rho !== undefined ? item.position.contract.rho : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? item.position.contract.inTheMoney : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? item.position.contract.intrinsicValue : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? item.position.contract.extrinsicValue : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? item.position.contract.theoreticalPrice : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? item.position.contract.underlyingPrice : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? item.position.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
      lifecycleEvents: item.position.lifecycleEvents ? 
        Array.isArray(item.position.lifecycleEvents) && item.position.lifecycleEvents.length > 0 &&  item.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.position.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.position.lifecycleEvents.map((item) => ({
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
      },
    }))
  } : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_OPTIONSCONTRACT,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneOptionsContract) {
            return response.data.createOneOptionsContract;
          } else {
            return null as unknown as OptionsContractType;
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
            logger.error("Non-retryable constraint violation in createOneOptionsContract", {
              operation: 'createOneOptionsContract',
              model: 'OptionsContract',
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
            logger.warn("Database connection error in createOneOptionsContract, retrying...", {
              operation: 'createOneOptionsContract',
              model: 'OptionsContract',
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
              operation: 'createOneOptionsContract',
              model: 'OptionsContract',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneOptionsContract',
              model: 'OptionsContract',
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
   * Create multiple OptionsContract records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of OptionsContract objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: OptionsContractType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_OPTIONSCONTRACT = gql`
          mutation createManyOptionsContract($data: [OptionsContractCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyOptionsContract(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      symbol: prop.symbol !== undefined ? prop.symbol : undefined,
  contractSymbol: prop.contractSymbol !== undefined ? prop.contractSymbol : undefined,
  optionType: prop.optionType !== undefined ? prop.optionType : undefined,
  strikePrice: prop.strikePrice !== undefined ? prop.strikePrice : undefined,
  expirationDate: prop.expirationDate !== undefined ? prop.expirationDate : undefined,
  daysToExpiration: prop.daysToExpiration !== undefined ? prop.daysToExpiration : undefined,
  lastPrice: prop.lastPrice !== undefined ? prop.lastPrice : undefined,
  bidPrice: prop.bidPrice !== undefined ? prop.bidPrice : undefined,
  askPrice: prop.askPrice !== undefined ? prop.askPrice : undefined,
  midPrice: prop.midPrice !== undefined ? prop.midPrice : undefined,
  bidSize: prop.bidSize !== undefined ? prop.bidSize : undefined,
  askSize: prop.askSize !== undefined ? prop.askSize : undefined,
  volume: prop.volume !== undefined ? prop.volume : undefined,
  openInterest: prop.openInterest !== undefined ? prop.openInterest : undefined,
  impliedVolatility: prop.impliedVolatility !== undefined ? prop.impliedVolatility : undefined,
  delta: prop.delta !== undefined ? prop.delta : undefined,
  gamma: prop.gamma !== undefined ? prop.gamma : undefined,
  theta: prop.theta !== undefined ? prop.theta : undefined,
  vega: prop.vega !== undefined ? prop.vega : undefined,
  rho: prop.rho !== undefined ? prop.rho : undefined,
  inTheMoney: prop.inTheMoney !== undefined ? prop.inTheMoney : undefined,
  intrinsicValue: prop.intrinsicValue !== undefined ? prop.intrinsicValue : undefined,
  extrinsicValue: prop.extrinsicValue !== undefined ? prop.extrinsicValue : undefined,
  theoreticalPrice: prop.theoreticalPrice !== undefined ? prop.theoreticalPrice : undefined,
  underlyingPrice: prop.underlyingPrice !== undefined ? prop.underlyingPrice : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
  dataTimestamp: prop.dataTimestamp !== undefined ? prop.dataTimestamp : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_OPTIONSCONTRACT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyOptionsContract) {
          return response.data.createManyOptionsContract;
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
          logger.warn("Duplicate key in createManyOptionsContract (expected during overlapping fetches)", {
            operation: 'createManyOptionsContract',
            model: 'OptionsContract',
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
          logger.warn("Database connection error in createManyOptionsContract, retrying...", {
            operation: 'createManyOptionsContract',
            model: 'OptionsContract',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyOptionsContract',
            model: 'OptionsContract',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyOptionsContract',
            model: 'OptionsContract',
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
   * Update a single OptionsContract record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated OptionsContract or null.
   */
  async update(props: OptionsContractType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsContractType> {
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

        const UPDATE_ONE_OPTIONSCONTRACT = gql`
          mutation updateOneOptionsContract($data: OptionsContractUpdateInput!, $where: OptionsContractWhereUniqueInput!) {
            updateOneOptionsContract(data: $data, where: $where) {
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
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  contractSymbol: props.contractSymbol !== undefined ? {
            set: props.contractSymbol 
           } : undefined,
  optionType: props.optionType !== undefined ? {
            set: props.optionType 
           } : undefined,
  strikePrice: props.strikePrice !== undefined ? {
            set: props.strikePrice 
           } : undefined,
  expirationDate: props.expirationDate !== undefined ? {
            set: props.expirationDate 
           } : undefined,
  daysToExpiration: props.daysToExpiration !== undefined ? {
            set: props.daysToExpiration 
           } : undefined,
  lastPrice: props.lastPrice !== undefined ? {
            set: props.lastPrice 
           } : undefined,
  bidPrice: props.bidPrice !== undefined ? {
            set: props.bidPrice 
           } : undefined,
  askPrice: props.askPrice !== undefined ? {
            set: props.askPrice 
           } : undefined,
  midPrice: props.midPrice !== undefined ? {
            set: props.midPrice 
           } : undefined,
  bidSize: props.bidSize !== undefined ? {
            set: props.bidSize 
           } : undefined,
  askSize: props.askSize !== undefined ? {
            set: props.askSize 
           } : undefined,
  volume: props.volume !== undefined ? {
            set: props.volume 
           } : undefined,
  openInterest: props.openInterest !== undefined ? {
            set: props.openInterest 
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
  inTheMoney: props.inTheMoney !== undefined ? {
            set: props.inTheMoney 
           } : undefined,
  intrinsicValue: props.intrinsicValue !== undefined ? {
            set: props.intrinsicValue 
           } : undefined,
  extrinsicValue: props.extrinsicValue !== undefined ? {
            set: props.extrinsicValue 
           } : undefined,
  theoreticalPrice: props.theoreticalPrice !== undefined ? {
            set: props.theoreticalPrice 
           } : undefined,
  underlyingPrice: props.underlyingPrice !== undefined ? {
            set: props.underlyingPrice 
           } : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  dataTimestamp: props.dataTimestamp !== undefined ? {
            set: props.dataTimestamp 
           } : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
  positions: props.positions ? 
  Array.isArray(props.positions) && props.positions.length > 0 && props.positions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.positions.map((item) => ({
    id: item.id
  }))
} : { upsert: props.positions.map((item) => ({
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
        connect:      item.executions.map((item) => ({
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
    lifecycleEvents: item.lifecycleEvents ? 
      Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      item.lifecycleEvents.map((item) => ({
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
  greeksHistory: props.greeksHistory ? 
  Array.isArray(props.greeksHistory) && props.greeksHistory.length > 0 && props.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.greeksHistory.map((item) => ({
    id: item.id
  }))
} : { upsert: props.greeksHistory.map((item) => ({
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
  executions: props.executions ? 
  Array.isArray(props.executions) && props.executions.length > 0 && props.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.executions.map((item) => ({
    id: item.id
  }))
} : { upsert: props.executions.map((item) => ({
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
      contract: item.position.contract ? 
      typeof item.position.contract === 'object' && Object.keys(item.position.contract).length === 1 && (Object.keys(item.position.contract)[0] === 'id' || Object.keys(item.position.contract)[0] === 'symbol')
? {
      connect: {
        id: item.position.contract.id
      }
} : { upsert: {
          where: {
            id: item.position.contract.id !== undefined ? {
                equals: item.position.contract.id
              } : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                equals: item.position.contract.symbol
              } : undefined,
          },
          update: {
            id: item.position.contract.id !== undefined ? {
                set: item.position.contract.id
              } : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                set: item.position.contract.symbol
              } : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? {
                set: item.position.contract.contractSymbol
              } : undefined,
            optionType: item.position.contract.optionType !== undefined ? {
                set: item.position.contract.optionType
              } : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? {
                set: item.position.contract.strikePrice
              } : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? {
                set: item.position.contract.expirationDate
              } : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? {
                set: item.position.contract.daysToExpiration
              } : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? {
                set: item.position.contract.lastPrice
              } : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? {
                set: item.position.contract.bidPrice
              } : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? {
                set: item.position.contract.askPrice
              } : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? {
                set: item.position.contract.midPrice
              } : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? {
                set: item.position.contract.bidSize
              } : undefined,
            askSize: item.position.contract.askSize !== undefined ? {
                set: item.position.contract.askSize
              } : undefined,
            volume: item.position.contract.volume !== undefined ? {
                set: item.position.contract.volume
              } : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? {
                set: item.position.contract.openInterest
              } : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? {
                set: item.position.contract.impliedVolatility
              } : undefined,
            delta: item.position.contract.delta !== undefined ? {
                set: item.position.contract.delta
              } : undefined,
            gamma: item.position.contract.gamma !== undefined ? {
                set: item.position.contract.gamma
              } : undefined,
            theta: item.position.contract.theta !== undefined ? {
                set: item.position.contract.theta
              } : undefined,
            vega: item.position.contract.vega !== undefined ? {
                set: item.position.contract.vega
              } : undefined,
            rho: item.position.contract.rho !== undefined ? {
                set: item.position.contract.rho
              } : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? {
                set: item.position.contract.inTheMoney
              } : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? {
                set: item.position.contract.intrinsicValue
              } : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? {
                set: item.position.contract.extrinsicValue
              } : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? {
                set: item.position.contract.theoreticalPrice
              } : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? {
                set: item.position.contract.underlyingPrice
              } : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? {
                set: item.position.contract.dataTimestamp
              } : undefined,
          },
          create: {
            symbol: item.position.contract.symbol !== undefined ? item.position.contract.symbol : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? item.position.contract.contractSymbol : undefined,
            optionType: item.position.contract.optionType !== undefined ? item.position.contract.optionType : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? item.position.contract.strikePrice : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? item.position.contract.expirationDate : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? item.position.contract.daysToExpiration : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? item.position.contract.lastPrice : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? item.position.contract.bidPrice : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? item.position.contract.askPrice : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? item.position.contract.midPrice : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? item.position.contract.bidSize : undefined,
            askSize: item.position.contract.askSize !== undefined ? item.position.contract.askSize : undefined,
            volume: item.position.contract.volume !== undefined ? item.position.contract.volume : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? item.position.contract.openInterest : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? item.position.contract.impliedVolatility : undefined,
            delta: item.position.contract.delta !== undefined ? item.position.contract.delta : undefined,
            gamma: item.position.contract.gamma !== undefined ? item.position.contract.gamma : undefined,
            theta: item.position.contract.theta !== undefined ? item.position.contract.theta : undefined,
            vega: item.position.contract.vega !== undefined ? item.position.contract.vega : undefined,
            rho: item.position.contract.rho !== undefined ? item.position.contract.rho : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? item.position.contract.inTheMoney : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? item.position.contract.intrinsicValue : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? item.position.contract.extrinsicValue : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? item.position.contract.theoreticalPrice : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? item.position.contract.underlyingPrice : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? item.position.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
      lifecycleEvents: item.position.lifecycleEvents ? 
      Array.isArray(item.position.lifecycleEvents) && item.position.lifecycleEvents.length > 0 && item.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.position.lifecycleEvents.map((item) => ({
        id: item.id
      }))
} : { upsert: item.position.lifecycleEvents.map((item) => ({
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
      contract: item.position.contract ? 
        typeof item.position.contract === 'object' && Object.keys(item.position.contract).length === 1 && Object.keys(item.position.contract)[0] === 'id'
    ? { connect: {
            id: item.position.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.contract.id !== undefined ? item.position.contract.id : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                equals: item.position.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.position.contract.symbol !== undefined ? item.position.contract.symbol : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? item.position.contract.contractSymbol : undefined,
            optionType: item.position.contract.optionType !== undefined ? item.position.contract.optionType : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? item.position.contract.strikePrice : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? item.position.contract.expirationDate : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? item.position.contract.daysToExpiration : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? item.position.contract.lastPrice : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? item.position.contract.bidPrice : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? item.position.contract.askPrice : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? item.position.contract.midPrice : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? item.position.contract.bidSize : undefined,
            askSize: item.position.contract.askSize !== undefined ? item.position.contract.askSize : undefined,
            volume: item.position.contract.volume !== undefined ? item.position.contract.volume : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? item.position.contract.openInterest : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? item.position.contract.impliedVolatility : undefined,
            delta: item.position.contract.delta !== undefined ? item.position.contract.delta : undefined,
            gamma: item.position.contract.gamma !== undefined ? item.position.contract.gamma : undefined,
            theta: item.position.contract.theta !== undefined ? item.position.contract.theta : undefined,
            vega: item.position.contract.vega !== undefined ? item.position.contract.vega : undefined,
            rho: item.position.contract.rho !== undefined ? item.position.contract.rho : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? item.position.contract.inTheMoney : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? item.position.contract.intrinsicValue : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? item.position.contract.extrinsicValue : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? item.position.contract.theoreticalPrice : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? item.position.contract.underlyingPrice : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? item.position.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
      lifecycleEvents: item.position.lifecycleEvents ? 
        Array.isArray(item.position.lifecycleEvents) && item.position.lifecycleEvents.length > 0 &&  item.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.position.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.position.lifecycleEvents.map((item) => ({
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
      contract: item.position.contract ? 
        typeof item.position.contract === 'object' && Object.keys(item.position.contract).length === 1 && Object.keys(item.position.contract)[0] === 'id'
    ? { connect: {
            id: item.position.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.contract.id !== undefined ? item.position.contract.id : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                equals: item.position.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.position.contract.symbol !== undefined ? item.position.contract.symbol : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? item.position.contract.contractSymbol : undefined,
            optionType: item.position.contract.optionType !== undefined ? item.position.contract.optionType : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? item.position.contract.strikePrice : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? item.position.contract.expirationDate : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? item.position.contract.daysToExpiration : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? item.position.contract.lastPrice : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? item.position.contract.bidPrice : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? item.position.contract.askPrice : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? item.position.contract.midPrice : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? item.position.contract.bidSize : undefined,
            askSize: item.position.contract.askSize !== undefined ? item.position.contract.askSize : undefined,
            volume: item.position.contract.volume !== undefined ? item.position.contract.volume : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? item.position.contract.openInterest : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? item.position.contract.impliedVolatility : undefined,
            delta: item.position.contract.delta !== undefined ? item.position.contract.delta : undefined,
            gamma: item.position.contract.gamma !== undefined ? item.position.contract.gamma : undefined,
            theta: item.position.contract.theta !== undefined ? item.position.contract.theta : undefined,
            vega: item.position.contract.vega !== undefined ? item.position.contract.vega : undefined,
            rho: item.position.contract.rho !== undefined ? item.position.contract.rho : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? item.position.contract.inTheMoney : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? item.position.contract.intrinsicValue : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? item.position.contract.extrinsicValue : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? item.position.contract.theoreticalPrice : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? item.position.contract.underlyingPrice : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? item.position.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
      lifecycleEvents: item.position.lifecycleEvents ? 
        Array.isArray(item.position.lifecycleEvents) && item.position.lifecycleEvents.length > 0 &&  item.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.position.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.position.lifecycleEvents.map((item) => ({
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
      },
    }))
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_OPTIONSCONTRACT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneOptionsContract) {
          return response.data.updateOneOptionsContract;
        } else {
          return null as unknown as OptionsContractType;
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
          logger.error("Non-retryable constraint violation in updateOneOptionsContract", {
            operation: 'updateOneOptionsContract',
            model: 'OptionsContract',
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
          logger.warn("Database connection error in updateOneOptionsContract, retrying...", {
            operation: 'updateOneOptionsContract',
            model: 'OptionsContract',
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
            operation: 'updateOneOptionsContract',
            model: 'OptionsContract',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneOptionsContract',
            model: 'OptionsContract',
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
   * Upsert a single OptionsContract record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated OptionsContract or null.
   */
  async upsert(props: OptionsContractType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsContractType> {
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

        const UPSERT_ONE_OPTIONSCONTRACT = gql`
          mutation upsertOneOptionsContract($where: OptionsContractWhereUniqueInput!, $create: OptionsContractCreateInput!, $update: OptionsContractUpdateInput!) {
            upsertOneOptionsContract(where: $where, create: $create, update: $update) {
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
        symbol: props.symbol !== undefined ? props.symbol : undefined,
  contractSymbol: props.contractSymbol !== undefined ? props.contractSymbol : undefined,
  optionType: props.optionType !== undefined ? props.optionType : undefined,
  strikePrice: props.strikePrice !== undefined ? props.strikePrice : undefined,
  expirationDate: props.expirationDate !== undefined ? props.expirationDate : undefined,
  daysToExpiration: props.daysToExpiration !== undefined ? props.daysToExpiration : undefined,
  lastPrice: props.lastPrice !== undefined ? props.lastPrice : undefined,
  bidPrice: props.bidPrice !== undefined ? props.bidPrice : undefined,
  askPrice: props.askPrice !== undefined ? props.askPrice : undefined,
  midPrice: props.midPrice !== undefined ? props.midPrice : undefined,
  bidSize: props.bidSize !== undefined ? props.bidSize : undefined,
  askSize: props.askSize !== undefined ? props.askSize : undefined,
  volume: props.volume !== undefined ? props.volume : undefined,
  openInterest: props.openInterest !== undefined ? props.openInterest : undefined,
  impliedVolatility: props.impliedVolatility !== undefined ? props.impliedVolatility : undefined,
  delta: props.delta !== undefined ? props.delta : undefined,
  gamma: props.gamma !== undefined ? props.gamma : undefined,
  theta: props.theta !== undefined ? props.theta : undefined,
  vega: props.vega !== undefined ? props.vega : undefined,
  rho: props.rho !== undefined ? props.rho : undefined,
  inTheMoney: props.inTheMoney !== undefined ? props.inTheMoney : undefined,
  intrinsicValue: props.intrinsicValue !== undefined ? props.intrinsicValue : undefined,
  extrinsicValue: props.extrinsicValue !== undefined ? props.extrinsicValue : undefined,
  theoreticalPrice: props.theoreticalPrice !== undefined ? props.theoreticalPrice : undefined,
  underlyingPrice: props.underlyingPrice !== undefined ? props.underlyingPrice : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  dataTimestamp: props.dataTimestamp !== undefined ? props.dataTimestamp : undefined,
  positions: props.positions ? 
    Array.isArray(props.positions) && props.positions.length > 0 &&  props.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.positions.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.positions.map((item) => ({
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
        connect:      item.executions.map((item) => ({
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
    lifecycleEvents: item.lifecycleEvents ? 
      Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      item.lifecycleEvents.map((item) => ({
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
  greeksHistory: props.greeksHistory ? 
    Array.isArray(props.greeksHistory) && props.greeksHistory.length > 0 &&  props.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.greeksHistory.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.greeksHistory.map((item) => ({
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
  executions: props.executions ? 
    Array.isArray(props.executions) && props.executions.length > 0 &&  props.executions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.executions.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.executions.map((item) => ({
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
      contract: item.position.contract ? 
        typeof item.position.contract === 'object' && Object.keys(item.position.contract).length === 1 && Object.keys(item.position.contract)[0] === 'id'
    ? { connect: {
            id: item.position.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.contract.id !== undefined ? item.position.contract.id : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                equals: item.position.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.position.contract.symbol !== undefined ? item.position.contract.symbol : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? item.position.contract.contractSymbol : undefined,
            optionType: item.position.contract.optionType !== undefined ? item.position.contract.optionType : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? item.position.contract.strikePrice : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? item.position.contract.expirationDate : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? item.position.contract.daysToExpiration : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? item.position.contract.lastPrice : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? item.position.contract.bidPrice : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? item.position.contract.askPrice : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? item.position.contract.midPrice : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? item.position.contract.bidSize : undefined,
            askSize: item.position.contract.askSize !== undefined ? item.position.contract.askSize : undefined,
            volume: item.position.contract.volume !== undefined ? item.position.contract.volume : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? item.position.contract.openInterest : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? item.position.contract.impliedVolatility : undefined,
            delta: item.position.contract.delta !== undefined ? item.position.contract.delta : undefined,
            gamma: item.position.contract.gamma !== undefined ? item.position.contract.gamma : undefined,
            theta: item.position.contract.theta !== undefined ? item.position.contract.theta : undefined,
            vega: item.position.contract.vega !== undefined ? item.position.contract.vega : undefined,
            rho: item.position.contract.rho !== undefined ? item.position.contract.rho : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? item.position.contract.inTheMoney : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? item.position.contract.intrinsicValue : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? item.position.contract.extrinsicValue : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? item.position.contract.theoreticalPrice : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? item.position.contract.underlyingPrice : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? item.position.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
      lifecycleEvents: item.position.lifecycleEvents ? 
        Array.isArray(item.position.lifecycleEvents) && item.position.lifecycleEvents.length > 0 &&  item.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.position.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.position.lifecycleEvents.map((item) => ({
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
      },
    }))
  } : undefined,
      },
          update: {
      symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  contractSymbol: props.contractSymbol !== undefined ? {
            set: props.contractSymbol 
           } : undefined,
  optionType: props.optionType !== undefined ? {
            set: props.optionType 
           } : undefined,
  strikePrice: props.strikePrice !== undefined ? {
            set: props.strikePrice 
           } : undefined,
  expirationDate: props.expirationDate !== undefined ? {
            set: props.expirationDate 
           } : undefined,
  daysToExpiration: props.daysToExpiration !== undefined ? {
            set: props.daysToExpiration 
           } : undefined,
  lastPrice: props.lastPrice !== undefined ? {
            set: props.lastPrice 
           } : undefined,
  bidPrice: props.bidPrice !== undefined ? {
            set: props.bidPrice 
           } : undefined,
  askPrice: props.askPrice !== undefined ? {
            set: props.askPrice 
           } : undefined,
  midPrice: props.midPrice !== undefined ? {
            set: props.midPrice 
           } : undefined,
  bidSize: props.bidSize !== undefined ? {
            set: props.bidSize 
           } : undefined,
  askSize: props.askSize !== undefined ? {
            set: props.askSize 
           } : undefined,
  volume: props.volume !== undefined ? {
            set: props.volume 
           } : undefined,
  openInterest: props.openInterest !== undefined ? {
            set: props.openInterest 
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
  inTheMoney: props.inTheMoney !== undefined ? {
            set: props.inTheMoney 
           } : undefined,
  intrinsicValue: props.intrinsicValue !== undefined ? {
            set: props.intrinsicValue 
           } : undefined,
  extrinsicValue: props.extrinsicValue !== undefined ? {
            set: props.extrinsicValue 
           } : undefined,
  theoreticalPrice: props.theoreticalPrice !== undefined ? {
            set: props.theoreticalPrice 
           } : undefined,
  underlyingPrice: props.underlyingPrice !== undefined ? {
            set: props.underlyingPrice 
           } : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  dataTimestamp: props.dataTimestamp !== undefined ? {
            set: props.dataTimestamp 
           } : undefined,
  positions: props.positions ? 
  Array.isArray(props.positions) && props.positions.length > 0 && props.positions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.positions.map((item) => ({
    id: item.id
  }))
} : { upsert: props.positions.map((item) => ({
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
        connect:      item.executions.map((item) => ({
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
    lifecycleEvents: item.lifecycleEvents ? 
      Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      item.lifecycleEvents.map((item) => ({
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
  greeksHistory: props.greeksHistory ? 
  Array.isArray(props.greeksHistory) && props.greeksHistory.length > 0 && props.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.greeksHistory.map((item) => ({
    id: item.id
  }))
} : { upsert: props.greeksHistory.map((item) => ({
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
  executions: props.executions ? 
  Array.isArray(props.executions) && props.executions.length > 0 && props.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.executions.map((item) => ({
    id: item.id
  }))
} : { upsert: props.executions.map((item) => ({
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
      contract: item.position.contract ? 
      typeof item.position.contract === 'object' && Object.keys(item.position.contract).length === 1 && (Object.keys(item.position.contract)[0] === 'id' || Object.keys(item.position.contract)[0] === 'symbol')
? {
      connect: {
        id: item.position.contract.id
      }
} : { upsert: {
          where: {
            id: item.position.contract.id !== undefined ? {
                equals: item.position.contract.id
              } : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                equals: item.position.contract.symbol
              } : undefined,
          },
          update: {
            id: item.position.contract.id !== undefined ? {
                set: item.position.contract.id
              } : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                set: item.position.contract.symbol
              } : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? {
                set: item.position.contract.contractSymbol
              } : undefined,
            optionType: item.position.contract.optionType !== undefined ? {
                set: item.position.contract.optionType
              } : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? {
                set: item.position.contract.strikePrice
              } : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? {
                set: item.position.contract.expirationDate
              } : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? {
                set: item.position.contract.daysToExpiration
              } : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? {
                set: item.position.contract.lastPrice
              } : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? {
                set: item.position.contract.bidPrice
              } : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? {
                set: item.position.contract.askPrice
              } : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? {
                set: item.position.contract.midPrice
              } : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? {
                set: item.position.contract.bidSize
              } : undefined,
            askSize: item.position.contract.askSize !== undefined ? {
                set: item.position.contract.askSize
              } : undefined,
            volume: item.position.contract.volume !== undefined ? {
                set: item.position.contract.volume
              } : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? {
                set: item.position.contract.openInterest
              } : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? {
                set: item.position.contract.impliedVolatility
              } : undefined,
            delta: item.position.contract.delta !== undefined ? {
                set: item.position.contract.delta
              } : undefined,
            gamma: item.position.contract.gamma !== undefined ? {
                set: item.position.contract.gamma
              } : undefined,
            theta: item.position.contract.theta !== undefined ? {
                set: item.position.contract.theta
              } : undefined,
            vega: item.position.contract.vega !== undefined ? {
                set: item.position.contract.vega
              } : undefined,
            rho: item.position.contract.rho !== undefined ? {
                set: item.position.contract.rho
              } : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? {
                set: item.position.contract.inTheMoney
              } : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? {
                set: item.position.contract.intrinsicValue
              } : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? {
                set: item.position.contract.extrinsicValue
              } : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? {
                set: item.position.contract.theoreticalPrice
              } : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? {
                set: item.position.contract.underlyingPrice
              } : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? {
                set: item.position.contract.dataTimestamp
              } : undefined,
          },
          create: {
            symbol: item.position.contract.symbol !== undefined ? item.position.contract.symbol : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? item.position.contract.contractSymbol : undefined,
            optionType: item.position.contract.optionType !== undefined ? item.position.contract.optionType : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? item.position.contract.strikePrice : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? item.position.contract.expirationDate : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? item.position.contract.daysToExpiration : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? item.position.contract.lastPrice : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? item.position.contract.bidPrice : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? item.position.contract.askPrice : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? item.position.contract.midPrice : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? item.position.contract.bidSize : undefined,
            askSize: item.position.contract.askSize !== undefined ? item.position.contract.askSize : undefined,
            volume: item.position.contract.volume !== undefined ? item.position.contract.volume : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? item.position.contract.openInterest : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? item.position.contract.impliedVolatility : undefined,
            delta: item.position.contract.delta !== undefined ? item.position.contract.delta : undefined,
            gamma: item.position.contract.gamma !== undefined ? item.position.contract.gamma : undefined,
            theta: item.position.contract.theta !== undefined ? item.position.contract.theta : undefined,
            vega: item.position.contract.vega !== undefined ? item.position.contract.vega : undefined,
            rho: item.position.contract.rho !== undefined ? item.position.contract.rho : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? item.position.contract.inTheMoney : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? item.position.contract.intrinsicValue : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? item.position.contract.extrinsicValue : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? item.position.contract.theoreticalPrice : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? item.position.contract.underlyingPrice : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? item.position.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
      lifecycleEvents: item.position.lifecycleEvents ? 
      Array.isArray(item.position.lifecycleEvents) && item.position.lifecycleEvents.length > 0 && item.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.position.lifecycleEvents.map((item) => ({
        id: item.id
      }))
} : { upsert: item.position.lifecycleEvents.map((item) => ({
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
      contract: item.position.contract ? 
        typeof item.position.contract === 'object' && Object.keys(item.position.contract).length === 1 && Object.keys(item.position.contract)[0] === 'id'
    ? { connect: {
            id: item.position.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.contract.id !== undefined ? item.position.contract.id : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                equals: item.position.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.position.contract.symbol !== undefined ? item.position.contract.symbol : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? item.position.contract.contractSymbol : undefined,
            optionType: item.position.contract.optionType !== undefined ? item.position.contract.optionType : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? item.position.contract.strikePrice : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? item.position.contract.expirationDate : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? item.position.contract.daysToExpiration : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? item.position.contract.lastPrice : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? item.position.contract.bidPrice : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? item.position.contract.askPrice : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? item.position.contract.midPrice : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? item.position.contract.bidSize : undefined,
            askSize: item.position.contract.askSize !== undefined ? item.position.contract.askSize : undefined,
            volume: item.position.contract.volume !== undefined ? item.position.contract.volume : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? item.position.contract.openInterest : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? item.position.contract.impliedVolatility : undefined,
            delta: item.position.contract.delta !== undefined ? item.position.contract.delta : undefined,
            gamma: item.position.contract.gamma !== undefined ? item.position.contract.gamma : undefined,
            theta: item.position.contract.theta !== undefined ? item.position.contract.theta : undefined,
            vega: item.position.contract.vega !== undefined ? item.position.contract.vega : undefined,
            rho: item.position.contract.rho !== undefined ? item.position.contract.rho : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? item.position.contract.inTheMoney : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? item.position.contract.intrinsicValue : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? item.position.contract.extrinsicValue : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? item.position.contract.theoreticalPrice : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? item.position.contract.underlyingPrice : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? item.position.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
      lifecycleEvents: item.position.lifecycleEvents ? 
        Array.isArray(item.position.lifecycleEvents) && item.position.lifecycleEvents.length > 0 &&  item.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.position.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.position.lifecycleEvents.map((item) => ({
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
      contract: item.position.contract ? 
        typeof item.position.contract === 'object' && Object.keys(item.position.contract).length === 1 && Object.keys(item.position.contract)[0] === 'id'
    ? { connect: {
            id: item.position.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.contract.id !== undefined ? item.position.contract.id : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                equals: item.position.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.position.contract.symbol !== undefined ? item.position.contract.symbol : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? item.position.contract.contractSymbol : undefined,
            optionType: item.position.contract.optionType !== undefined ? item.position.contract.optionType : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? item.position.contract.strikePrice : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? item.position.contract.expirationDate : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? item.position.contract.daysToExpiration : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? item.position.contract.lastPrice : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? item.position.contract.bidPrice : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? item.position.contract.askPrice : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? item.position.contract.midPrice : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? item.position.contract.bidSize : undefined,
            askSize: item.position.contract.askSize !== undefined ? item.position.contract.askSize : undefined,
            volume: item.position.contract.volume !== undefined ? item.position.contract.volume : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? item.position.contract.openInterest : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? item.position.contract.impliedVolatility : undefined,
            delta: item.position.contract.delta !== undefined ? item.position.contract.delta : undefined,
            gamma: item.position.contract.gamma !== undefined ? item.position.contract.gamma : undefined,
            theta: item.position.contract.theta !== undefined ? item.position.contract.theta : undefined,
            vega: item.position.contract.vega !== undefined ? item.position.contract.vega : undefined,
            rho: item.position.contract.rho !== undefined ? item.position.contract.rho : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? item.position.contract.inTheMoney : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? item.position.contract.intrinsicValue : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? item.position.contract.extrinsicValue : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? item.position.contract.theoreticalPrice : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? item.position.contract.underlyingPrice : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? item.position.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
      lifecycleEvents: item.position.lifecycleEvents ? 
        Array.isArray(item.position.lifecycleEvents) && item.position.lifecycleEvents.length > 0 &&  item.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.position.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.position.lifecycleEvents.map((item) => ({
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
      },
    }))
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_OPTIONSCONTRACT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneOptionsContract) {
          return response.data.upsertOneOptionsContract;
        } else {
          return null as unknown as OptionsContractType;
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
          logger.error("Non-retryable constraint violation in upsertOneOptionsContract", {
            operation: 'upsertOneOptionsContract',
            model: 'OptionsContract',
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
          logger.warn("Database connection error in upsertOneOptionsContract, retrying...", {
            operation: 'upsertOneOptionsContract',
            model: 'OptionsContract',
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
            operation: 'upsertOneOptionsContract',
            model: 'OptionsContract',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneOptionsContract',
            model: 'OptionsContract',
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
   * Update multiple OptionsContract records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of OptionsContract objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: OptionsContractType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_OPTIONSCONTRACT = gql`
          mutation updateManyOptionsContract($data: [OptionsContractCreateManyInput!]!) {
            updateManyOptionsContract(data: $data) {
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
  symbol: prop.symbol !== undefined ? {
            set: prop.symbol 
           } : undefined,
  contractSymbol: prop.contractSymbol !== undefined ? {
            set: prop.contractSymbol 
           } : undefined,
  optionType: prop.optionType !== undefined ? {
            set: prop.optionType 
           } : undefined,
  strikePrice: prop.strikePrice !== undefined ? {
            set: prop.strikePrice 
           } : undefined,
  expirationDate: prop.expirationDate !== undefined ? {
            set: prop.expirationDate 
           } : undefined,
  daysToExpiration: prop.daysToExpiration !== undefined ? {
            set: prop.daysToExpiration 
           } : undefined,
  lastPrice: prop.lastPrice !== undefined ? {
            set: prop.lastPrice 
           } : undefined,
  bidPrice: prop.bidPrice !== undefined ? {
            set: prop.bidPrice 
           } : undefined,
  askPrice: prop.askPrice !== undefined ? {
            set: prop.askPrice 
           } : undefined,
  midPrice: prop.midPrice !== undefined ? {
            set: prop.midPrice 
           } : undefined,
  bidSize: prop.bidSize !== undefined ? {
            set: prop.bidSize 
           } : undefined,
  askSize: prop.askSize !== undefined ? {
            set: prop.askSize 
           } : undefined,
  volume: prop.volume !== undefined ? {
            set: prop.volume 
           } : undefined,
  openInterest: prop.openInterest !== undefined ? {
            set: prop.openInterest 
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
  inTheMoney: prop.inTheMoney !== undefined ? {
            set: prop.inTheMoney 
           } : undefined,
  intrinsicValue: prop.intrinsicValue !== undefined ? {
            set: prop.intrinsicValue 
           } : undefined,
  extrinsicValue: prop.extrinsicValue !== undefined ? {
            set: prop.extrinsicValue 
           } : undefined,
  theoreticalPrice: prop.theoreticalPrice !== undefined ? {
            set: prop.theoreticalPrice 
           } : undefined,
  underlyingPrice: prop.underlyingPrice !== undefined ? {
            set: prop.underlyingPrice 
           } : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
  dataTimestamp: prop.dataTimestamp !== undefined ? {
            set: prop.dataTimestamp 
           } : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,
  positions: prop.positions ? 
  Array.isArray(prop.positions) && prop.positions.length > 0 && prop.positions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: prop.positions.map((item) => ({
    id: item.id
  }))
} : { upsert: prop.positions.map((item) => ({
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
        connect:      item.executions.map((item) => ({
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
    lifecycleEvents: item.lifecycleEvents ? 
      Array.isArray(item.lifecycleEvents) && item.lifecycleEvents.length > 0 &&  item.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      item.lifecycleEvents.map((item) => ({
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
  greeksHistory: prop.greeksHistory ? 
  Array.isArray(prop.greeksHistory) && prop.greeksHistory.length > 0 && prop.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: prop.greeksHistory.map((item) => ({
    id: item.id
  }))
} : { upsert: prop.greeksHistory.map((item) => ({
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
  executions: prop.executions ? 
  Array.isArray(prop.executions) && prop.executions.length > 0 && prop.executions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: prop.executions.map((item) => ({
    id: item.id
  }))
} : { upsert: prop.executions.map((item) => ({
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
      contract: item.position.contract ? 
      typeof item.position.contract === 'object' && Object.keys(item.position.contract).length === 1 && (Object.keys(item.position.contract)[0] === 'id' || Object.keys(item.position.contract)[0] === 'symbol')
? {
      connect: {
        id: item.position.contract.id
      }
} : { upsert: {
          where: {
            id: item.position.contract.id !== undefined ? {
                equals: item.position.contract.id
              } : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                equals: item.position.contract.symbol
              } : undefined,
          },
          update: {
            id: item.position.contract.id !== undefined ? {
                set: item.position.contract.id
              } : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                set: item.position.contract.symbol
              } : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? {
                set: item.position.contract.contractSymbol
              } : undefined,
            optionType: item.position.contract.optionType !== undefined ? {
                set: item.position.contract.optionType
              } : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? {
                set: item.position.contract.strikePrice
              } : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? {
                set: item.position.contract.expirationDate
              } : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? {
                set: item.position.contract.daysToExpiration
              } : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? {
                set: item.position.contract.lastPrice
              } : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? {
                set: item.position.contract.bidPrice
              } : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? {
                set: item.position.contract.askPrice
              } : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? {
                set: item.position.contract.midPrice
              } : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? {
                set: item.position.contract.bidSize
              } : undefined,
            askSize: item.position.contract.askSize !== undefined ? {
                set: item.position.contract.askSize
              } : undefined,
            volume: item.position.contract.volume !== undefined ? {
                set: item.position.contract.volume
              } : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? {
                set: item.position.contract.openInterest
              } : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? {
                set: item.position.contract.impliedVolatility
              } : undefined,
            delta: item.position.contract.delta !== undefined ? {
                set: item.position.contract.delta
              } : undefined,
            gamma: item.position.contract.gamma !== undefined ? {
                set: item.position.contract.gamma
              } : undefined,
            theta: item.position.contract.theta !== undefined ? {
                set: item.position.contract.theta
              } : undefined,
            vega: item.position.contract.vega !== undefined ? {
                set: item.position.contract.vega
              } : undefined,
            rho: item.position.contract.rho !== undefined ? {
                set: item.position.contract.rho
              } : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? {
                set: item.position.contract.inTheMoney
              } : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? {
                set: item.position.contract.intrinsicValue
              } : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? {
                set: item.position.contract.extrinsicValue
              } : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? {
                set: item.position.contract.theoreticalPrice
              } : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? {
                set: item.position.contract.underlyingPrice
              } : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? {
                set: item.position.contract.dataTimestamp
              } : undefined,
          },
          create: {
            symbol: item.position.contract.symbol !== undefined ? item.position.contract.symbol : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? item.position.contract.contractSymbol : undefined,
            optionType: item.position.contract.optionType !== undefined ? item.position.contract.optionType : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? item.position.contract.strikePrice : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? item.position.contract.expirationDate : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? item.position.contract.daysToExpiration : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? item.position.contract.lastPrice : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? item.position.contract.bidPrice : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? item.position.contract.askPrice : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? item.position.contract.midPrice : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? item.position.contract.bidSize : undefined,
            askSize: item.position.contract.askSize !== undefined ? item.position.contract.askSize : undefined,
            volume: item.position.contract.volume !== undefined ? item.position.contract.volume : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? item.position.contract.openInterest : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? item.position.contract.impliedVolatility : undefined,
            delta: item.position.contract.delta !== undefined ? item.position.contract.delta : undefined,
            gamma: item.position.contract.gamma !== undefined ? item.position.contract.gamma : undefined,
            theta: item.position.contract.theta !== undefined ? item.position.contract.theta : undefined,
            vega: item.position.contract.vega !== undefined ? item.position.contract.vega : undefined,
            rho: item.position.contract.rho !== undefined ? item.position.contract.rho : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? item.position.contract.inTheMoney : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? item.position.contract.intrinsicValue : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? item.position.contract.extrinsicValue : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? item.position.contract.theoreticalPrice : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? item.position.contract.underlyingPrice : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? item.position.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
      lifecycleEvents: item.position.lifecycleEvents ? 
      Array.isArray(item.position.lifecycleEvents) && item.position.lifecycleEvents.length > 0 && item.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.position.lifecycleEvents.map((item) => ({
        id: item.id
      }))
} : { upsert: item.position.lifecycleEvents.map((item) => ({
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
      contract: item.position.contract ? 
        typeof item.position.contract === 'object' && Object.keys(item.position.contract).length === 1 && Object.keys(item.position.contract)[0] === 'id'
    ? { connect: {
            id: item.position.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.contract.id !== undefined ? item.position.contract.id : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                equals: item.position.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.position.contract.symbol !== undefined ? item.position.contract.symbol : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? item.position.contract.contractSymbol : undefined,
            optionType: item.position.contract.optionType !== undefined ? item.position.contract.optionType : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? item.position.contract.strikePrice : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? item.position.contract.expirationDate : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? item.position.contract.daysToExpiration : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? item.position.contract.lastPrice : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? item.position.contract.bidPrice : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? item.position.contract.askPrice : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? item.position.contract.midPrice : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? item.position.contract.bidSize : undefined,
            askSize: item.position.contract.askSize !== undefined ? item.position.contract.askSize : undefined,
            volume: item.position.contract.volume !== undefined ? item.position.contract.volume : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? item.position.contract.openInterest : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? item.position.contract.impliedVolatility : undefined,
            delta: item.position.contract.delta !== undefined ? item.position.contract.delta : undefined,
            gamma: item.position.contract.gamma !== undefined ? item.position.contract.gamma : undefined,
            theta: item.position.contract.theta !== undefined ? item.position.contract.theta : undefined,
            vega: item.position.contract.vega !== undefined ? item.position.contract.vega : undefined,
            rho: item.position.contract.rho !== undefined ? item.position.contract.rho : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? item.position.contract.inTheMoney : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? item.position.contract.intrinsicValue : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? item.position.contract.extrinsicValue : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? item.position.contract.theoreticalPrice : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? item.position.contract.underlyingPrice : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? item.position.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
      lifecycleEvents: item.position.lifecycleEvents ? 
        Array.isArray(item.position.lifecycleEvents) && item.position.lifecycleEvents.length > 0 &&  item.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.position.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.position.lifecycleEvents.map((item) => ({
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
      contract: item.position.contract ? 
        typeof item.position.contract === 'object' && Object.keys(item.position.contract).length === 1 && Object.keys(item.position.contract)[0] === 'id'
    ? { connect: {
            id: item.position.contract.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.position.contract.id !== undefined ? item.position.contract.id : undefined,
            symbol: item.position.contract.symbol !== undefined ? {
                equals: item.position.contract.symbol 
               } : undefined,
          },
          create: {
            symbol: item.position.contract.symbol !== undefined ? item.position.contract.symbol : undefined,
            contractSymbol: item.position.contract.contractSymbol !== undefined ? item.position.contract.contractSymbol : undefined,
            optionType: item.position.contract.optionType !== undefined ? item.position.contract.optionType : undefined,
            strikePrice: item.position.contract.strikePrice !== undefined ? item.position.contract.strikePrice : undefined,
            expirationDate: item.position.contract.expirationDate !== undefined ? item.position.contract.expirationDate : undefined,
            daysToExpiration: item.position.contract.daysToExpiration !== undefined ? item.position.contract.daysToExpiration : undefined,
            lastPrice: item.position.contract.lastPrice !== undefined ? item.position.contract.lastPrice : undefined,
            bidPrice: item.position.contract.bidPrice !== undefined ? item.position.contract.bidPrice : undefined,
            askPrice: item.position.contract.askPrice !== undefined ? item.position.contract.askPrice : undefined,
            midPrice: item.position.contract.midPrice !== undefined ? item.position.contract.midPrice : undefined,
            bidSize: item.position.contract.bidSize !== undefined ? item.position.contract.bidSize : undefined,
            askSize: item.position.contract.askSize !== undefined ? item.position.contract.askSize : undefined,
            volume: item.position.contract.volume !== undefined ? item.position.contract.volume : undefined,
            openInterest: item.position.contract.openInterest !== undefined ? item.position.contract.openInterest : undefined,
            impliedVolatility: item.position.contract.impliedVolatility !== undefined ? item.position.contract.impliedVolatility : undefined,
            delta: item.position.contract.delta !== undefined ? item.position.contract.delta : undefined,
            gamma: item.position.contract.gamma !== undefined ? item.position.contract.gamma : undefined,
            theta: item.position.contract.theta !== undefined ? item.position.contract.theta : undefined,
            vega: item.position.contract.vega !== undefined ? item.position.contract.vega : undefined,
            rho: item.position.contract.rho !== undefined ? item.position.contract.rho : undefined,
            inTheMoney: item.position.contract.inTheMoney !== undefined ? item.position.contract.inTheMoney : undefined,
            intrinsicValue: item.position.contract.intrinsicValue !== undefined ? item.position.contract.intrinsicValue : undefined,
            extrinsicValue: item.position.contract.extrinsicValue !== undefined ? item.position.contract.extrinsicValue : undefined,
            theoreticalPrice: item.position.contract.theoreticalPrice !== undefined ? item.position.contract.theoreticalPrice : undefined,
            underlyingPrice: item.position.contract.underlyingPrice !== undefined ? item.position.contract.underlyingPrice : undefined,
            metadata: item.position.contract.metadata !== undefined ? item.position.contract.metadata : undefined,
            dataTimestamp: item.position.contract.dataTimestamp !== undefined ? item.position.contract.dataTimestamp : undefined,
          },
        }
      } : undefined,
      lifecycleEvents: item.position.lifecycleEvents ? 
        Array.isArray(item.position.lifecycleEvents) && item.position.lifecycleEvents.length > 0 &&  item.position.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.position.lifecycleEvents.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.position.lifecycleEvents.map((item) => ({
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
      },
    }))
  } : undefined,

          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_OPTIONSCONTRACT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyOptionsContract) {
          return response.data.updateManyOptionsContract;
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
          logger.error("Non-retryable constraint violation in updateManyOptionsContract", {
            operation: 'updateManyOptionsContract',
            model: 'OptionsContract',
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
          logger.warn("Database connection error in updateManyOptionsContract, retrying...", {
            operation: 'updateManyOptionsContract',
            model: 'OptionsContract',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyOptionsContract',
            model: 'OptionsContract',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyOptionsContract',
            model: 'OptionsContract',
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
   * Delete a single OptionsContract record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted OptionsContract or null.
   */
  async delete(props: OptionsContractType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsContractType> {
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

        const DELETE_ONE_OPTIONSCONTRACT = gql`
          mutation deleteOneOptionsContract($where: OptionsContractWhereUniqueInput!) {
            deleteOneOptionsContract(where: $where) {
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
          mutation: DELETE_ONE_OPTIONSCONTRACT,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneOptionsContract) {
          return response.data.deleteOneOptionsContract;
        } else {
          return null as unknown as OptionsContractType;
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
          logger.error("Non-retryable constraint violation in deleteOneOptionsContract", {
            operation: 'deleteOneOptionsContract',
            model: 'OptionsContract',
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
          logger.warn("Database connection error in deleteOneOptionsContract, retrying...", {
            operation: 'deleteOneOptionsContract',
            model: 'OptionsContract',
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
            operation: 'deleteOneOptionsContract',
            model: 'OptionsContract',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneOptionsContract',
            model: 'OptionsContract',
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
   * Retrieve a single OptionsContract record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved OptionsContract or null.
   */
  async get(props: OptionsContractType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<OptionsContractType | null> {
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

        const GET_OPTIONSCONTRACT = gql`
          query getOptionsContract($where: OptionsContractWhereUniqueInput!) {
            getOptionsContract(where: $where) {
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
          query: GET_OPTIONSCONTRACT,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getOptionsContract ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsContract found') {
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
          logger.warn("Database connection error in getOptionsContract, retrying...", {
            operation: 'getOptionsContract',
            model: 'OptionsContract',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getOptionsContract',
            model: 'OptionsContract',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getOptionsContract',
            model: 'OptionsContract',
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
   * Retrieve all OptionsContracts records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of OptionsContract records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsContractType[] | null> {
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

        const GET_ALL_OPTIONSCONTRACT = gql`
          query getAllOptionsContract {
            optionsContracts {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_OPTIONSCONTRACT,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.optionsContracts ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsContract found') {
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
          logger.warn("Database connection error in getAllOptionsContract, retrying...", {
            operation: 'getAllOptionsContract',
            model: 'OptionsContract',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllOptionsContract',
            model: 'OptionsContract',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllOptionsContract',
            model: 'OptionsContract',
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
   * Find multiple OptionsContract records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found OptionsContract records or null.
   */
  async findMany(props: OptionsContractType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<OptionsContractType[] | null> {
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

        const FIND_MANY_OPTIONSCONTRACT = gql`
          query findManyOptionsContract($where: OptionsContractWhereInput!) {
            optionsContracts(where: $where) {
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
          throw new Error(`findManyOptionsContract requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_OPTIONSCONTRACT,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.optionsContracts) {
          return response.data.optionsContracts;
        } else {
          return [] as OptionsContractType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsContract found') {
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
          logger.warn("Database connection error in findManyOptionsContract, retrying...", {
            operation: 'findManyOptionsContract',
            model: 'OptionsContract',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyOptionsContract',
            model: 'OptionsContract',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyOptionsContract',
            model: 'OptionsContract',
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

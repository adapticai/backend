
  
import { OptionsPosition as OptionsPositionType } from './generated/typegraphql-prisma/models/OptionsPosition';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the OptionsPosition model.
   */

  const selectionSet = `
    
  id
  alpacaAccountId
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
  lifecycleEvents {
    id
    positionId
    fromState
    toState
    trigger
    metadata
    createdAt
  }

  `;

  export const OptionsPosition = {

    /**
     * Create a new OptionsPosition record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created OptionsPosition or null.
     */

    /**
     * Create a new OptionsPosition record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created OptionsPosition or null.
     */
    async create(props: OptionsPositionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsPositionType> {
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

          const CREATE_ONE_OPTIONSPOSITION = gql`
              mutation createOneOptionsPosition($data: OptionsPositionCreateInput!) {
                createOneOptionsPosition(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                alpacaAccountId: props.alpacaAccountId !== undefined ? props.alpacaAccountId : undefined,
  status: props.status !== undefined ? props.status : undefined,
  openingSide: props.openingSide !== undefined ? props.openingSide : undefined,
  quantity: props.quantity !== undefined ? props.quantity : undefined,
  entryPrice: props.entryPrice !== undefined ? props.entryPrice : undefined,
  entryCost: props.entryCost !== undefined ? props.entryCost : undefined,
  entryTime: props.entryTime !== undefined ? props.entryTime : undefined,
  exitPrice: props.exitPrice !== undefined ? props.exitPrice : undefined,
  exitValue: props.exitValue !== undefined ? props.exitValue : undefined,
  exitTime: props.exitTime !== undefined ? props.exitTime : undefined,
  currentPrice: props.currentPrice !== undefined ? props.currentPrice : undefined,
  currentValue: props.currentValue !== undefined ? props.currentValue : undefined,
  unrealizedPnL: props.unrealizedPnL !== undefined ? props.unrealizedPnL : undefined,
  unrealizedPnLPercent: props.unrealizedPnLPercent !== undefined ? props.unrealizedPnLPercent : undefined,
  realizedPnL: props.realizedPnL !== undefined ? props.realizedPnL : undefined,
  realizedPnLPercent: props.realizedPnLPercent !== undefined ? props.realizedPnLPercent : undefined,
  totalFees: props.totalFees !== undefined ? props.totalFees : undefined,
  currentDelta: props.currentDelta !== undefined ? props.currentDelta : undefined,
  currentGamma: props.currentGamma !== undefined ? props.currentGamma : undefined,
  currentTheta: props.currentTheta !== undefined ? props.currentTheta : undefined,
  currentVega: props.currentVega !== undefined ? props.currentVega : undefined,
  currentRho: props.currentRho !== undefined ? props.currentRho : undefined,
  currentImpliedVolatility: props.currentImpliedVolatility !== undefined ? props.currentImpliedVolatility : undefined,
  daysHeld: props.daysHeld !== undefined ? props.daysHeld : undefined,
  exitReason: props.exitReason !== undefined ? props.exitReason : undefined,
  strategyType: props.strategyType !== undefined ? props.strategyType : undefined,
  tradeId: props.tradeId !== undefined ? props.tradeId : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  lifecycleState: props.lifecycleState !== undefined ? props.lifecycleState : undefined,
  exitThresholds: props.exitThresholds !== undefined ? props.exitThresholds : undefined,
  linkedRollId: props.linkedRollId !== undefined ? props.linkedRollId : undefined,
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
      positions: item.contract.positions ? 
        Array.isArray(item.contract.positions) && item.contract.positions.length > 0 &&  item.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.positions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.positions.map((item) => ({
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
          },
        }))
      } : undefined,
      greeksHistory: item.contract.greeksHistory ? 
        Array.isArray(item.contract.greeksHistory) && item.contract.greeksHistory.length > 0 &&  item.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.greeksHistory.map((item) => ({
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
    }))
  } : undefined,
  lifecycleEvents: props.lifecycleEvents ? 
    Array.isArray(props.lifecycleEvents) && props.lifecycleEvents.length > 0 &&  props.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.lifecycleEvents.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.lifecycleEvents.map((item) => ({
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
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_OPTIONSPOSITION,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneOptionsPosition) {
            return response.data.createOneOptionsPosition;
          } else {
            return null as unknown as OptionsPositionType;
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
            logger.error("Non-retryable constraint violation in createOneOptionsPosition", {
              operation: 'createOneOptionsPosition',
              model: 'OptionsPosition',
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
            logger.warn("Database connection error in createOneOptionsPosition, retrying...", {
              operation: 'createOneOptionsPosition',
              model: 'OptionsPosition',
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
              operation: 'createOneOptionsPosition',
              model: 'OptionsPosition',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneOptionsPosition',
              model: 'OptionsPosition',
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
   * Create multiple OptionsPosition records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of OptionsPosition objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: OptionsPositionType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_OPTIONSPOSITION = gql`
          mutation createManyOptionsPosition($data: [OptionsPositionCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyOptionsPosition(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      alpacaAccountId: prop.alpacaAccountId !== undefined ? prop.alpacaAccountId : undefined,
  contractId: prop.contractId !== undefined ? prop.contractId : undefined,
  status: prop.status !== undefined ? prop.status : undefined,
  openingSide: prop.openingSide !== undefined ? prop.openingSide : undefined,
  quantity: prop.quantity !== undefined ? prop.quantity : undefined,
  entryPrice: prop.entryPrice !== undefined ? prop.entryPrice : undefined,
  entryCost: prop.entryCost !== undefined ? prop.entryCost : undefined,
  entryTime: prop.entryTime !== undefined ? prop.entryTime : undefined,
  exitPrice: prop.exitPrice !== undefined ? prop.exitPrice : undefined,
  exitValue: prop.exitValue !== undefined ? prop.exitValue : undefined,
  exitTime: prop.exitTime !== undefined ? prop.exitTime : undefined,
  currentPrice: prop.currentPrice !== undefined ? prop.currentPrice : undefined,
  currentValue: prop.currentValue !== undefined ? prop.currentValue : undefined,
  unrealizedPnL: prop.unrealizedPnL !== undefined ? prop.unrealizedPnL : undefined,
  unrealizedPnLPercent: prop.unrealizedPnLPercent !== undefined ? prop.unrealizedPnLPercent : undefined,
  realizedPnL: prop.realizedPnL !== undefined ? prop.realizedPnL : undefined,
  realizedPnLPercent: prop.realizedPnLPercent !== undefined ? prop.realizedPnLPercent : undefined,
  totalFees: prop.totalFees !== undefined ? prop.totalFees : undefined,
  currentDelta: prop.currentDelta !== undefined ? prop.currentDelta : undefined,
  currentGamma: prop.currentGamma !== undefined ? prop.currentGamma : undefined,
  currentTheta: prop.currentTheta !== undefined ? prop.currentTheta : undefined,
  currentVega: prop.currentVega !== undefined ? prop.currentVega : undefined,
  currentRho: prop.currentRho !== undefined ? prop.currentRho : undefined,
  currentImpliedVolatility: prop.currentImpliedVolatility !== undefined ? prop.currentImpliedVolatility : undefined,
  daysHeld: prop.daysHeld !== undefined ? prop.daysHeld : undefined,
  exitReason: prop.exitReason !== undefined ? prop.exitReason : undefined,
  strategyType: prop.strategyType !== undefined ? prop.strategyType : undefined,
  tradeId: prop.tradeId !== undefined ? prop.tradeId : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
  lifecycleState: prop.lifecycleState !== undefined ? prop.lifecycleState : undefined,
  exitThresholds: prop.exitThresholds !== undefined ? prop.exitThresholds : undefined,
  linkedRollId: prop.linkedRollId !== undefined ? prop.linkedRollId : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_OPTIONSPOSITION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyOptionsPosition) {
          return response.data.createManyOptionsPosition;
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
          logger.warn("Duplicate key in createManyOptionsPosition (expected during overlapping fetches)", {
            operation: 'createManyOptionsPosition',
            model: 'OptionsPosition',
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
          logger.warn("Database connection error in createManyOptionsPosition, retrying...", {
            operation: 'createManyOptionsPosition',
            model: 'OptionsPosition',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyOptionsPosition',
            model: 'OptionsPosition',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyOptionsPosition',
            model: 'OptionsPosition',
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
   * Update a single OptionsPosition record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated OptionsPosition or null.
   */
  async update(props: OptionsPositionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsPositionType> {
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

        const UPDATE_ONE_OPTIONSPOSITION = gql`
          mutation updateOneOptionsPosition($data: OptionsPositionUpdateInput!, $where: OptionsPositionWhereUniqueInput!) {
            updateOneOptionsPosition(data: $data, where: $where) {
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
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
  openingSide: props.openingSide !== undefined ? {
            set: props.openingSide 
           } : undefined,
  quantity: props.quantity !== undefined ? {
            set: props.quantity 
           } : undefined,
  entryPrice: props.entryPrice !== undefined ? {
            set: props.entryPrice 
           } : undefined,
  entryCost: props.entryCost !== undefined ? {
            set: props.entryCost 
           } : undefined,
  entryTime: props.entryTime !== undefined ? {
            set: props.entryTime 
           } : undefined,
  exitPrice: props.exitPrice !== undefined ? {
            set: props.exitPrice 
           } : undefined,
  exitValue: props.exitValue !== undefined ? {
            set: props.exitValue 
           } : undefined,
  exitTime: props.exitTime !== undefined ? {
            set: props.exitTime 
           } : undefined,
  currentPrice: props.currentPrice !== undefined ? {
            set: props.currentPrice 
           } : undefined,
  currentValue: props.currentValue !== undefined ? {
            set: props.currentValue 
           } : undefined,
  unrealizedPnL: props.unrealizedPnL !== undefined ? {
            set: props.unrealizedPnL 
           } : undefined,
  unrealizedPnLPercent: props.unrealizedPnLPercent !== undefined ? {
            set: props.unrealizedPnLPercent 
           } : undefined,
  realizedPnL: props.realizedPnL !== undefined ? {
            set: props.realizedPnL 
           } : undefined,
  realizedPnLPercent: props.realizedPnLPercent !== undefined ? {
            set: props.realizedPnLPercent 
           } : undefined,
  totalFees: props.totalFees !== undefined ? {
            set: props.totalFees 
           } : undefined,
  currentDelta: props.currentDelta !== undefined ? {
            set: props.currentDelta 
           } : undefined,
  currentGamma: props.currentGamma !== undefined ? {
            set: props.currentGamma 
           } : undefined,
  currentTheta: props.currentTheta !== undefined ? {
            set: props.currentTheta 
           } : undefined,
  currentVega: props.currentVega !== undefined ? {
            set: props.currentVega 
           } : undefined,
  currentRho: props.currentRho !== undefined ? {
            set: props.currentRho 
           } : undefined,
  currentImpliedVolatility: props.currentImpliedVolatility !== undefined ? {
            set: props.currentImpliedVolatility 
           } : undefined,
  daysHeld: props.daysHeld !== undefined ? {
            set: props.daysHeld 
           } : undefined,
  exitReason: props.exitReason !== undefined ? {
            set: props.exitReason 
           } : undefined,
  strategyType: props.strategyType !== undefined ? {
            set: props.strategyType 
           } : undefined,
  tradeId: props.tradeId !== undefined ? {
            set: props.tradeId 
           } : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  lifecycleState: props.lifecycleState !== undefined ? {
            set: props.lifecycleState 
           } : undefined,
  exitThresholds: props.exitThresholds !== undefined ? props.exitThresholds : undefined,
  linkedRollId: props.linkedRollId !== undefined ? {
            set: props.linkedRollId 
           } : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
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
      positions: item.contract.positions ? 
      Array.isArray(item.contract.positions) && item.contract.positions.length > 0 && item.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.contract.positions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.contract.positions.map((item) => ({
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
          },
        }))
      } : undefined,
      greeksHistory: item.contract.greeksHistory ? 
      Array.isArray(item.contract.greeksHistory) && item.contract.greeksHistory.length > 0 && item.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.contract.greeksHistory.map((item) => ({
        id: item.id
      }))
} : { upsert: item.contract.greeksHistory.map((item) => ({
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
      positions: item.contract.positions ? 
        Array.isArray(item.contract.positions) && item.contract.positions.length > 0 &&  item.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.positions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.positions.map((item) => ({
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
          },
        }))
      } : undefined,
      greeksHistory: item.contract.greeksHistory ? 
        Array.isArray(item.contract.greeksHistory) && item.contract.greeksHistory.length > 0 &&  item.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.greeksHistory.map((item) => ({
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
      positions: item.contract.positions ? 
        Array.isArray(item.contract.positions) && item.contract.positions.length > 0 &&  item.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.positions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.positions.map((item) => ({
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
          },
        }))
      } : undefined,
      greeksHistory: item.contract.greeksHistory ? 
        Array.isArray(item.contract.greeksHistory) && item.contract.greeksHistory.length > 0 &&  item.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.greeksHistory.map((item) => ({
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
    }))
  } : undefined,
  lifecycleEvents: props.lifecycleEvents ? 
  Array.isArray(props.lifecycleEvents) && props.lifecycleEvents.length > 0 && props.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.lifecycleEvents.map((item) => ({
    id: item.id
  }))
} : { upsert: props.lifecycleEvents.map((item) => ({
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
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_OPTIONSPOSITION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneOptionsPosition) {
          return response.data.updateOneOptionsPosition;
        } else {
          return null as unknown as OptionsPositionType;
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
          logger.error("Non-retryable constraint violation in updateOneOptionsPosition", {
            operation: 'updateOneOptionsPosition',
            model: 'OptionsPosition',
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
          logger.warn("Database connection error in updateOneOptionsPosition, retrying...", {
            operation: 'updateOneOptionsPosition',
            model: 'OptionsPosition',
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
            operation: 'updateOneOptionsPosition',
            model: 'OptionsPosition',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneOptionsPosition',
            model: 'OptionsPosition',
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
   * Upsert a single OptionsPosition record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated OptionsPosition or null.
   */
  async upsert(props: OptionsPositionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsPositionType> {
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

        const UPSERT_ONE_OPTIONSPOSITION = gql`
          mutation upsertOneOptionsPosition($where: OptionsPositionWhereUniqueInput!, $create: OptionsPositionCreateInput!, $update: OptionsPositionUpdateInput!) {
            upsertOneOptionsPosition(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  alpacaAccountId: props.alpacaAccountId !== undefined ? {
    equals: props.alpacaAccountId 
  } : undefined,
  contractId: props.contractId !== undefined ? {
    equals: props.contractId 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
      },
          create: {
        alpacaAccountId: props.alpacaAccountId !== undefined ? props.alpacaAccountId : undefined,
  status: props.status !== undefined ? props.status : undefined,
  openingSide: props.openingSide !== undefined ? props.openingSide : undefined,
  quantity: props.quantity !== undefined ? props.quantity : undefined,
  entryPrice: props.entryPrice !== undefined ? props.entryPrice : undefined,
  entryCost: props.entryCost !== undefined ? props.entryCost : undefined,
  entryTime: props.entryTime !== undefined ? props.entryTime : undefined,
  exitPrice: props.exitPrice !== undefined ? props.exitPrice : undefined,
  exitValue: props.exitValue !== undefined ? props.exitValue : undefined,
  exitTime: props.exitTime !== undefined ? props.exitTime : undefined,
  currentPrice: props.currentPrice !== undefined ? props.currentPrice : undefined,
  currentValue: props.currentValue !== undefined ? props.currentValue : undefined,
  unrealizedPnL: props.unrealizedPnL !== undefined ? props.unrealizedPnL : undefined,
  unrealizedPnLPercent: props.unrealizedPnLPercent !== undefined ? props.unrealizedPnLPercent : undefined,
  realizedPnL: props.realizedPnL !== undefined ? props.realizedPnL : undefined,
  realizedPnLPercent: props.realizedPnLPercent !== undefined ? props.realizedPnLPercent : undefined,
  totalFees: props.totalFees !== undefined ? props.totalFees : undefined,
  currentDelta: props.currentDelta !== undefined ? props.currentDelta : undefined,
  currentGamma: props.currentGamma !== undefined ? props.currentGamma : undefined,
  currentTheta: props.currentTheta !== undefined ? props.currentTheta : undefined,
  currentVega: props.currentVega !== undefined ? props.currentVega : undefined,
  currentRho: props.currentRho !== undefined ? props.currentRho : undefined,
  currentImpliedVolatility: props.currentImpliedVolatility !== undefined ? props.currentImpliedVolatility : undefined,
  daysHeld: props.daysHeld !== undefined ? props.daysHeld : undefined,
  exitReason: props.exitReason !== undefined ? props.exitReason : undefined,
  strategyType: props.strategyType !== undefined ? props.strategyType : undefined,
  tradeId: props.tradeId !== undefined ? props.tradeId : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  lifecycleState: props.lifecycleState !== undefined ? props.lifecycleState : undefined,
  exitThresholds: props.exitThresholds !== undefined ? props.exitThresholds : undefined,
  linkedRollId: props.linkedRollId !== undefined ? props.linkedRollId : undefined,
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
      positions: item.contract.positions ? 
        Array.isArray(item.contract.positions) && item.contract.positions.length > 0 &&  item.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.positions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.positions.map((item) => ({
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
          },
        }))
      } : undefined,
      greeksHistory: item.contract.greeksHistory ? 
        Array.isArray(item.contract.greeksHistory) && item.contract.greeksHistory.length > 0 &&  item.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.greeksHistory.map((item) => ({
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
    }))
  } : undefined,
  lifecycleEvents: props.lifecycleEvents ? 
    Array.isArray(props.lifecycleEvents) && props.lifecycleEvents.length > 0 &&  props.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.lifecycleEvents.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.lifecycleEvents.map((item) => ({
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
          update: {
      alpacaAccountId: props.alpacaAccountId !== undefined ? {
            set: props.alpacaAccountId 
           } : undefined,
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
  openingSide: props.openingSide !== undefined ? {
            set: props.openingSide 
           } : undefined,
  quantity: props.quantity !== undefined ? {
            set: props.quantity 
           } : undefined,
  entryPrice: props.entryPrice !== undefined ? {
            set: props.entryPrice 
           } : undefined,
  entryCost: props.entryCost !== undefined ? {
            set: props.entryCost 
           } : undefined,
  entryTime: props.entryTime !== undefined ? {
            set: props.entryTime 
           } : undefined,
  exitPrice: props.exitPrice !== undefined ? {
            set: props.exitPrice 
           } : undefined,
  exitValue: props.exitValue !== undefined ? {
            set: props.exitValue 
           } : undefined,
  exitTime: props.exitTime !== undefined ? {
            set: props.exitTime 
           } : undefined,
  currentPrice: props.currentPrice !== undefined ? {
            set: props.currentPrice 
           } : undefined,
  currentValue: props.currentValue !== undefined ? {
            set: props.currentValue 
           } : undefined,
  unrealizedPnL: props.unrealizedPnL !== undefined ? {
            set: props.unrealizedPnL 
           } : undefined,
  unrealizedPnLPercent: props.unrealizedPnLPercent !== undefined ? {
            set: props.unrealizedPnLPercent 
           } : undefined,
  realizedPnL: props.realizedPnL !== undefined ? {
            set: props.realizedPnL 
           } : undefined,
  realizedPnLPercent: props.realizedPnLPercent !== undefined ? {
            set: props.realizedPnLPercent 
           } : undefined,
  totalFees: props.totalFees !== undefined ? {
            set: props.totalFees 
           } : undefined,
  currentDelta: props.currentDelta !== undefined ? {
            set: props.currentDelta 
           } : undefined,
  currentGamma: props.currentGamma !== undefined ? {
            set: props.currentGamma 
           } : undefined,
  currentTheta: props.currentTheta !== undefined ? {
            set: props.currentTheta 
           } : undefined,
  currentVega: props.currentVega !== undefined ? {
            set: props.currentVega 
           } : undefined,
  currentRho: props.currentRho !== undefined ? {
            set: props.currentRho 
           } : undefined,
  currentImpliedVolatility: props.currentImpliedVolatility !== undefined ? {
            set: props.currentImpliedVolatility 
           } : undefined,
  daysHeld: props.daysHeld !== undefined ? {
            set: props.daysHeld 
           } : undefined,
  exitReason: props.exitReason !== undefined ? {
            set: props.exitReason 
           } : undefined,
  strategyType: props.strategyType !== undefined ? {
            set: props.strategyType 
           } : undefined,
  tradeId: props.tradeId !== undefined ? {
            set: props.tradeId 
           } : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  lifecycleState: props.lifecycleState !== undefined ? {
            set: props.lifecycleState 
           } : undefined,
  exitThresholds: props.exitThresholds !== undefined ? props.exitThresholds : undefined,
  linkedRollId: props.linkedRollId !== undefined ? {
            set: props.linkedRollId 
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
      positions: item.contract.positions ? 
      Array.isArray(item.contract.positions) && item.contract.positions.length > 0 && item.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.contract.positions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.contract.positions.map((item) => ({
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
          },
        }))
      } : undefined,
      greeksHistory: item.contract.greeksHistory ? 
      Array.isArray(item.contract.greeksHistory) && item.contract.greeksHistory.length > 0 && item.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.contract.greeksHistory.map((item) => ({
        id: item.id
      }))
} : { upsert: item.contract.greeksHistory.map((item) => ({
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
      positions: item.contract.positions ? 
        Array.isArray(item.contract.positions) && item.contract.positions.length > 0 &&  item.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.positions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.positions.map((item) => ({
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
          },
        }))
      } : undefined,
      greeksHistory: item.contract.greeksHistory ? 
        Array.isArray(item.contract.greeksHistory) && item.contract.greeksHistory.length > 0 &&  item.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.greeksHistory.map((item) => ({
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
      positions: item.contract.positions ? 
        Array.isArray(item.contract.positions) && item.contract.positions.length > 0 &&  item.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.positions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.positions.map((item) => ({
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
          },
        }))
      } : undefined,
      greeksHistory: item.contract.greeksHistory ? 
        Array.isArray(item.contract.greeksHistory) && item.contract.greeksHistory.length > 0 &&  item.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.greeksHistory.map((item) => ({
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
    }))
  } : undefined,
  lifecycleEvents: props.lifecycleEvents ? 
  Array.isArray(props.lifecycleEvents) && props.lifecycleEvents.length > 0 && props.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.lifecycleEvents.map((item) => ({
    id: item.id
  }))
} : { upsert: props.lifecycleEvents.map((item) => ({
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
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_OPTIONSPOSITION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneOptionsPosition) {
          return response.data.upsertOneOptionsPosition;
        } else {
          return null as unknown as OptionsPositionType;
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
          logger.error("Non-retryable constraint violation in upsertOneOptionsPosition", {
            operation: 'upsertOneOptionsPosition',
            model: 'OptionsPosition',
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
          logger.warn("Database connection error in upsertOneOptionsPosition, retrying...", {
            operation: 'upsertOneOptionsPosition',
            model: 'OptionsPosition',
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
            operation: 'upsertOneOptionsPosition',
            model: 'OptionsPosition',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneOptionsPosition',
            model: 'OptionsPosition',
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
   * Update multiple OptionsPosition records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of OptionsPosition objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: OptionsPositionType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_OPTIONSPOSITION = gql`
          mutation updateManyOptionsPosition($data: [OptionsPositionCreateManyInput!]!) {
            updateManyOptionsPosition(data: $data) {
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
  status: prop.status !== undefined ? {
            set: prop.status 
           } : undefined,
  openingSide: prop.openingSide !== undefined ? {
            set: prop.openingSide 
           } : undefined,
  quantity: prop.quantity !== undefined ? {
            set: prop.quantity 
           } : undefined,
  entryPrice: prop.entryPrice !== undefined ? {
            set: prop.entryPrice 
           } : undefined,
  entryCost: prop.entryCost !== undefined ? {
            set: prop.entryCost 
           } : undefined,
  entryTime: prop.entryTime !== undefined ? {
            set: prop.entryTime 
           } : undefined,
  exitPrice: prop.exitPrice !== undefined ? {
            set: prop.exitPrice 
           } : undefined,
  exitValue: prop.exitValue !== undefined ? {
            set: prop.exitValue 
           } : undefined,
  exitTime: prop.exitTime !== undefined ? {
            set: prop.exitTime 
           } : undefined,
  currentPrice: prop.currentPrice !== undefined ? {
            set: prop.currentPrice 
           } : undefined,
  currentValue: prop.currentValue !== undefined ? {
            set: prop.currentValue 
           } : undefined,
  unrealizedPnL: prop.unrealizedPnL !== undefined ? {
            set: prop.unrealizedPnL 
           } : undefined,
  unrealizedPnLPercent: prop.unrealizedPnLPercent !== undefined ? {
            set: prop.unrealizedPnLPercent 
           } : undefined,
  realizedPnL: prop.realizedPnL !== undefined ? {
            set: prop.realizedPnL 
           } : undefined,
  realizedPnLPercent: prop.realizedPnLPercent !== undefined ? {
            set: prop.realizedPnLPercent 
           } : undefined,
  totalFees: prop.totalFees !== undefined ? {
            set: prop.totalFees 
           } : undefined,
  currentDelta: prop.currentDelta !== undefined ? {
            set: prop.currentDelta 
           } : undefined,
  currentGamma: prop.currentGamma !== undefined ? {
            set: prop.currentGamma 
           } : undefined,
  currentTheta: prop.currentTheta !== undefined ? {
            set: prop.currentTheta 
           } : undefined,
  currentVega: prop.currentVega !== undefined ? {
            set: prop.currentVega 
           } : undefined,
  currentRho: prop.currentRho !== undefined ? {
            set: prop.currentRho 
           } : undefined,
  currentImpliedVolatility: prop.currentImpliedVolatility !== undefined ? {
            set: prop.currentImpliedVolatility 
           } : undefined,
  daysHeld: prop.daysHeld !== undefined ? {
            set: prop.daysHeld 
           } : undefined,
  exitReason: prop.exitReason !== undefined ? {
            set: prop.exitReason 
           } : undefined,
  strategyType: prop.strategyType !== undefined ? {
            set: prop.strategyType 
           } : undefined,
  tradeId: prop.tradeId !== undefined ? {
            set: prop.tradeId 
           } : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
  lifecycleState: prop.lifecycleState !== undefined ? {
            set: prop.lifecycleState 
           } : undefined,
  exitThresholds: prop.exitThresholds !== undefined ? prop.exitThresholds : undefined,
  linkedRollId: prop.linkedRollId !== undefined ? {
            set: prop.linkedRollId 
           } : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
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
      positions: item.contract.positions ? 
      Array.isArray(item.contract.positions) && item.contract.positions.length > 0 && item.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.contract.positions.map((item) => ({
        id: item.id
      }))
} : { upsert: item.contract.positions.map((item) => ({
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
          },
        }))
      } : undefined,
      greeksHistory: item.contract.greeksHistory ? 
      Array.isArray(item.contract.greeksHistory) && item.contract.greeksHistory.length > 0 && item.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.contract.greeksHistory.map((item) => ({
        id: item.id
      }))
} : { upsert: item.contract.greeksHistory.map((item) => ({
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
      positions: item.contract.positions ? 
        Array.isArray(item.contract.positions) && item.contract.positions.length > 0 &&  item.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.positions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.positions.map((item) => ({
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
          },
        }))
      } : undefined,
      greeksHistory: item.contract.greeksHistory ? 
        Array.isArray(item.contract.greeksHistory) && item.contract.greeksHistory.length > 0 &&  item.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.greeksHistory.map((item) => ({
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
      positions: item.contract.positions ? 
        Array.isArray(item.contract.positions) && item.contract.positions.length > 0 &&  item.contract.positions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.positions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.positions.map((item) => ({
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
          },
        }))
      } : undefined,
      greeksHistory: item.contract.greeksHistory ? 
        Array.isArray(item.contract.greeksHistory) && item.contract.greeksHistory.length > 0 &&  item.contract.greeksHistory.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.contract.greeksHistory.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.contract.greeksHistory.map((item) => ({
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
    }))
  } : undefined,
  lifecycleEvents: prop.lifecycleEvents ? 
  Array.isArray(prop.lifecycleEvents) && prop.lifecycleEvents.length > 0 && prop.lifecycleEvents.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: prop.lifecycleEvents.map((item) => ({
    id: item.id
  }))
} : { upsert: prop.lifecycleEvents.map((item) => ({
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
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_OPTIONSPOSITION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyOptionsPosition) {
          return response.data.updateManyOptionsPosition;
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
          logger.error("Non-retryable constraint violation in updateManyOptionsPosition", {
            operation: 'updateManyOptionsPosition',
            model: 'OptionsPosition',
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
          logger.warn("Database connection error in updateManyOptionsPosition, retrying...", {
            operation: 'updateManyOptionsPosition',
            model: 'OptionsPosition',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyOptionsPosition',
            model: 'OptionsPosition',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyOptionsPosition',
            model: 'OptionsPosition',
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
   * Delete a single OptionsPosition record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted OptionsPosition or null.
   */
  async delete(props: OptionsPositionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsPositionType> {
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

        const DELETE_ONE_OPTIONSPOSITION = gql`
          mutation deleteOneOptionsPosition($where: OptionsPositionWhereUniqueInput!) {
            deleteOneOptionsPosition(where: $where) {
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
          mutation: DELETE_ONE_OPTIONSPOSITION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneOptionsPosition) {
          return response.data.deleteOneOptionsPosition;
        } else {
          return null as unknown as OptionsPositionType;
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
          logger.error("Non-retryable constraint violation in deleteOneOptionsPosition", {
            operation: 'deleteOneOptionsPosition',
            model: 'OptionsPosition',
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
          logger.warn("Database connection error in deleteOneOptionsPosition, retrying...", {
            operation: 'deleteOneOptionsPosition',
            model: 'OptionsPosition',
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
            operation: 'deleteOneOptionsPosition',
            model: 'OptionsPosition',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneOptionsPosition',
            model: 'OptionsPosition',
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
   * Retrieve a single OptionsPosition record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved OptionsPosition or null.
   */
  async get(props: OptionsPositionType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<OptionsPositionType | null> {
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

        const GET_OPTIONSPOSITION = gql`
          query getOptionsPosition($where: OptionsPositionWhereUniqueInput!) {
            getOptionsPosition(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  alpacaAccountId: props.alpacaAccountId !== undefined ? {
    equals: props.alpacaAccountId 
  } : undefined,
  contractId: props.contractId !== undefined ? {
    equals: props.contractId 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_OPTIONSPOSITION,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getOptionsPosition ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsPosition found') {
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
          logger.warn("Database connection error in getOptionsPosition, retrying...", {
            operation: 'getOptionsPosition',
            model: 'OptionsPosition',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getOptionsPosition',
            model: 'OptionsPosition',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getOptionsPosition',
            model: 'OptionsPosition',
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
   * Retrieve all OptionsPositions records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of OptionsPosition records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<OptionsPositionType[] | null> {
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

        const GET_ALL_OPTIONSPOSITION = gql`
          query getAllOptionsPosition {
            optionsPositions {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_OPTIONSPOSITION,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.optionsPositions ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsPosition found') {
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
          logger.warn("Database connection error in getAllOptionsPosition, retrying...", {
            operation: 'getAllOptionsPosition',
            model: 'OptionsPosition',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllOptionsPosition',
            model: 'OptionsPosition',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllOptionsPosition',
            model: 'OptionsPosition',
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
   * Find multiple OptionsPosition records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found OptionsPosition records or null.
   */
  async findMany(props: OptionsPositionType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<OptionsPositionType[] | null> {
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

        const FIND_MANY_OPTIONSPOSITION = gql`
          query findManyOptionsPosition($where: OptionsPositionWhereInput!) {
            optionsPositions(where: $where) {
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
  contractId: props.contractId !== undefined ? {
    equals: props.contractId 
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
          throw new Error(`findManyOptionsPosition requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_OPTIONSPOSITION,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.optionsPositions) {
          return response.data.optionsPositions;
        } else {
          return [] as OptionsPositionType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No OptionsPosition found') {
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
          logger.warn("Database connection error in findManyOptionsPosition, retrying...", {
            operation: 'findManyOptionsPosition',
            model: 'OptionsPosition',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyOptionsPosition',
            model: 'OptionsPosition',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyOptionsPosition',
            model: 'OptionsPosition',
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

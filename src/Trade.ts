
  
import { Trade as TradeType } from './generated/typegraphql-prisma/models/Trade';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the Trade model.
   */

  const selectionSet = `
    
  id
  alpacaAccountId
  signal
  strategy
  analysis
  summary
  confidence
  timestamp
  createdAt
  updatedAt
  status
  deletedAt
  symbol
  side
  actions {
    id
    sequence
    tradeId
    type
    primary
    note
    status
    createdAt
    updatedAt
    deletedAt
    alpacaOrderId
    supersededActionId
    triggerSource
    triggerSourceType
  }
  entryPrice
  exitPrice
  entryQty
  exitQty
  entryValue
  exitValue
  entryTime
  exitTime
  pnlAmount
  pnlPercent
  durationMinutes
  marketPhase
  marketVolatility
  sessionHorizonMinutes
  thresholdsJson
  thesisVersion
  lastReunderwrittenAt
  supersededById
  rejectionMetadata
  signalSource
  signalSourceType
  signalId
  pathway
  pathwayType
  exitTier
  exitTierType
  strategyId

  `;

  export const Trade = {

    /**
     * Create a new Trade record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created Trade or null.
     */

    /**
     * Create a new Trade record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created Trade or null.
     */
    async create(props: TradeType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<TradeType> {
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

          const CREATE_ONE_TRADE = gql`
              mutation createOneTrade($data: TradeCreateInput!) {
                createOneTrade(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                alpacaAccountId: props.alpacaAccountId !== undefined ? props.alpacaAccountId : undefined,
  signal: props.signal !== undefined ? props.signal : undefined,
  strategy: props.strategy !== undefined ? props.strategy : undefined,
  analysis: props.analysis !== undefined ? props.analysis : undefined,
  summary: props.summary !== undefined ? props.summary : undefined,
  confidence: props.confidence !== undefined ? props.confidence : undefined,
  timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  status: props.status !== undefined ? props.status : undefined,
  deletedAt: props.deletedAt !== undefined ? props.deletedAt : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  side: props.side !== undefined ? props.side : undefined,
  entryPrice: props.entryPrice !== undefined ? props.entryPrice : undefined,
  exitPrice: props.exitPrice !== undefined ? props.exitPrice : undefined,
  entryQty: props.entryQty !== undefined ? props.entryQty : undefined,
  exitQty: props.exitQty !== undefined ? props.exitQty : undefined,
  entryValue: props.entryValue !== undefined ? props.entryValue : undefined,
  exitValue: props.exitValue !== undefined ? props.exitValue : undefined,
  entryTime: props.entryTime !== undefined ? props.entryTime : undefined,
  exitTime: props.exitTime !== undefined ? props.exitTime : undefined,
  pnlAmount: props.pnlAmount !== undefined ? props.pnlAmount : undefined,
  pnlPercent: props.pnlPercent !== undefined ? props.pnlPercent : undefined,
  durationMinutes: props.durationMinutes !== undefined ? props.durationMinutes : undefined,
  marketPhase: props.marketPhase !== undefined ? props.marketPhase : undefined,
  marketVolatility: props.marketVolatility !== undefined ? props.marketVolatility : undefined,
  sessionHorizonMinutes: props.sessionHorizonMinutes !== undefined ? props.sessionHorizonMinutes : undefined,
  thresholdsJson: props.thresholdsJson !== undefined ? props.thresholdsJson : undefined,
  thesisVersion: props.thesisVersion !== undefined ? props.thesisVersion : undefined,
  lastReunderwrittenAt: props.lastReunderwrittenAt !== undefined ? props.lastReunderwrittenAt : undefined,
  supersededById: props.supersededById !== undefined ? props.supersededById : undefined,
  rejectionMetadata: props.rejectionMetadata !== undefined ? props.rejectionMetadata : undefined,
  signalSource: props.signalSource !== undefined ? props.signalSource : undefined,
  signalSourceType: props.signalSourceType !== undefined ? props.signalSourceType : undefined,
  signalId: props.signalId !== undefined ? props.signalId : undefined,
  pathway: props.pathway !== undefined ? props.pathway : undefined,
  pathwayType: props.pathwayType !== undefined ? props.pathwayType : undefined,
  exitTier: props.exitTier !== undefined ? props.exitTier : undefined,
  exitTierType: props.exitTierType !== undefined ? props.exitTierType : undefined,
  actions: props.actions ? 
    Array.isArray(props.actions) && props.actions.length > 0 &&  props.actions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.actions.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.actions.map((item) => ({
      where: {
        id: item.id !== undefined ? item.id : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? item.alpacaOrderId : undefined,
        tradeId: item.tradeId !== undefined ? {
            equals: item.tradeId 
           } : undefined,
        type: item.type !== undefined ? {
            equals: item.type 
           } : undefined,
        status: item.status !== undefined ? {
            equals: item.status 
           } : undefined,
      },
      create: {
        sequence: item.sequence !== undefined ? item.sequence : undefined,
        type: item.type !== undefined ? item.type : undefined,
        primary: item.primary !== undefined ? item.primary : undefined,
        note: item.note !== undefined ? item.note : undefined,
        status: item.status !== undefined ? item.status : undefined,
        deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? item.alpacaOrderId : undefined,
        supersededActionId: item.supersededActionId !== undefined ? item.supersededActionId : undefined,
        triggerSource: item.triggerSource !== undefined ? item.triggerSource : undefined,
        triggerSourceType: item.triggerSourceType !== undefined ? item.triggerSourceType : undefined,
      },
    }))
  } : undefined,
  strategyRef: props.strategyRef ? 
    typeof props.strategyRef === 'object' && Object.keys(props.strategyRef).length === 1 && Object.keys(props.strategyRef)[0] === 'id'
    ? { connect: {
        id: props.strategyRef.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.strategyRef.id !== undefined ? props.strategyRef.id : undefined,
        key: props.strategyRef.key !== undefined ? props.strategyRef.key : undefined,
      },
      create: {
        key: props.strategyRef.key !== undefined ? props.strategyRef.key : undefined,
        displayName: props.strategyRef.displayName !== undefined ? props.strategyRef.displayName : undefined,
        description: props.strategyRef.description !== undefined ? props.strategyRef.description : undefined,
        origin: props.strategyRef.origin !== undefined ? props.strategyRef.origin : undefined,
        lifecycleState: props.strategyRef.lifecycleState !== undefined ? props.strategyRef.lifecycleState : undefined,
        manifestHash: props.strategyRef.manifestHash !== undefined ? props.strategyRef.manifestHash : undefined,
        deletedAt: props.strategyRef.deletedAt !== undefined ? props.strategyRef.deletedAt : undefined,
    owner: props.strategyRef.owner ? 
      typeof props.strategyRef.owner === 'object' && Object.keys(props.strategyRef.owner).length === 1 && Object.keys(props.strategyRef.owner)[0] === 'id'
    ? { connect: {
          id: props.strategyRef.owner.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.strategyRef.owner.id !== undefined ? props.strategyRef.owner.id : undefined,
          email: props.strategyRef.owner.email !== undefined ? props.strategyRef.owner.email : undefined,
          name: props.strategyRef.owner.name !== undefined ? {
              equals: props.strategyRef.owner.name 
             } : undefined,
        },
        create: {
          name: props.strategyRef.owner.name !== undefined ? props.strategyRef.owner.name : undefined,
          email: props.strategyRef.owner.email !== undefined ? props.strategyRef.owner.email : undefined,
          emailVerified: props.strategyRef.owner.emailVerified !== undefined ? props.strategyRef.owner.emailVerified : undefined,
          image: props.strategyRef.owner.image !== undefined ? props.strategyRef.owner.image : undefined,
          avatarUrl: props.strategyRef.owner.avatarUrl !== undefined ? props.strategyRef.owner.avatarUrl : undefined,
          onboardingComplete: props.strategyRef.owner.onboardingComplete !== undefined ? props.strategyRef.owner.onboardingComplete : undefined,
          signupCategory: props.strategyRef.owner.signupCategory !== undefined ? props.strategyRef.owner.signupCategory : undefined,
          deletedAt: props.strategyRef.owner.deletedAt !== undefined ? props.strategyRef.owner.deletedAt : undefined,
          role: props.strategyRef.owner.role !== undefined ? props.strategyRef.owner.role : undefined,
          bio: props.strategyRef.owner.bio !== undefined ? props.strategyRef.owner.bio : undefined,
          jobTitle: props.strategyRef.owner.jobTitle !== undefined ? props.strategyRef.owner.jobTitle : undefined,
          currentAccount: props.strategyRef.owner.currentAccount !== undefined ? props.strategyRef.owner.currentAccount : undefined,
          plan: props.strategyRef.owner.plan !== undefined ? props.strategyRef.owner.plan : undefined,
          openaiAPIKey: props.strategyRef.owner.openaiAPIKey !== undefined ? props.strategyRef.owner.openaiAPIKey : undefined,
          openaiModel: props.strategyRef.owner.openaiModel !== undefined ? props.strategyRef.owner.openaiModel : undefined,
      customer: props.strategyRef.owner.customer ? 
        typeof props.strategyRef.owner.customer === 'object' && Object.keys(props.strategyRef.owner.customer).length === 1 && Object.keys(props.strategyRef.owner.customer)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.customer.id !== undefined ? props.strategyRef.owner.customer.id : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? {
                equals: props.strategyRef.owner.customer.authUserId 
               } : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? {
                equals: props.strategyRef.owner.customer.name 
               } : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? props.strategyRef.owner.customer.authUserId : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? props.strategyRef.owner.customer.name : undefined,
            plan: props.strategyRef.owner.customer.plan !== undefined ? props.strategyRef.owner.customer.plan : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? props.strategyRef.owner.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? props.strategyRef.owner.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.strategyRef.owner.customer.jurisdiction !== undefined ? props.strategyRef.owner.customer.jurisdiction : undefined,
            riskProfile: props.strategyRef.owner.customer.riskProfile !== undefined ? props.strategyRef.owner.customer.riskProfile : undefined,
            amlStatus: props.strategyRef.owner.customer.amlStatus !== undefined ? props.strategyRef.owner.customer.amlStatus : undefined,
            lastKycUpdate: props.strategyRef.owner.customer.lastKycUpdate !== undefined ? props.strategyRef.owner.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.strategyRef.owner.accounts ? 
        Array.isArray(props.strategyRef.owner.accounts) && props.strategyRef.owner.accounts.length > 0 &&  props.strategyRef.owner.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            refresh_token: item.refresh_token !== undefined ? item.refresh_token : undefined,
            access_token: item.access_token !== undefined ? item.access_token : undefined,
            expires_at: item.expires_at !== undefined ? item.expires_at : undefined,
            token_type: item.token_type !== undefined ? item.token_type : undefined,
            scope: item.scope !== undefined ? item.scope : undefined,
            id_token: item.id_token !== undefined ? item.id_token : undefined,
            session_state: item.session_state !== undefined ? item.session_state : undefined,
          },
        }))
      } : undefined,
      sessions: props.strategyRef.owner.sessions ? 
        Array.isArray(props.strategyRef.owner.sessions) && props.strategyRef.owner.sessions.length > 0 &&  props.strategyRef.owner.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.sessions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            sessionToken: item.sessionToken !== undefined ? item.sessionToken : undefined,
            expires: item.expires !== undefined ? item.expires : undefined,
          },
        }))
      } : undefined,
      authenticators: props.strategyRef.owner.authenticators ? 
        Array.isArray(props.strategyRef.owner.authenticators) && props.strategyRef.owner.authenticators.length > 0 &&  props.strategyRef.owner.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authenticators.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            credentialID: item.credentialID !== undefined ? item.credentialID : undefined,
            publicKey: item.publicKey !== undefined ? item.publicKey : undefined,
            counter: item.counter !== undefined ? item.counter : undefined,
          },
        }))
      } : undefined,
      alpacaAccounts: props.strategyRef.owner.alpacaAccounts ? 
        Array.isArray(props.strategyRef.owner.alpacaAccounts) && props.strategyRef.owner.alpacaAccounts.length > 0 &&  props.strategyRef.owner.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.alpacaAccounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            APIKey: item.APIKey !== undefined ? item.APIKey : undefined,
            APISecret: item.APISecret !== undefined ? item.APISecret : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? item.marketOpen : undefined,
            realTime: item.realTime !== undefined ? item.realTime : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? item.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? item.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? item.tradeAllocationPct : undefined,
            autoAllocation: item.autoAllocation !== undefined ? item.autoAllocation : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? item.minPercentageChange : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? item.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? item.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? item.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? item.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? item.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? item.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? item.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? item.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? item.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? item.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? item.minimumPriceChangePercent100 : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      linkedProviders: props.strategyRef.owner.linkedProviders ? 
        Array.isArray(props.strategyRef.owner.linkedProviders) && props.strategyRef.owner.linkedProviders.length > 0 &&  props.strategyRef.owner.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.linkedProviders.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
          },
          create: {
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            email: item.email !== undefined ? item.email : undefined,
            accessToken: item.accessToken !== undefined ? item.accessToken : undefined,
            refreshToken: item.refreshToken !== undefined ? item.refreshToken : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            linkedAt: item.linkedAt !== undefined ? item.linkedAt : undefined,
          },
        }))
      } : undefined,
      accountLinkingRequests: props.strategyRef.owner.accountLinkingRequests ? 
        Array.isArray(props.strategyRef.owner.accountLinkingRequests) && props.strategyRef.owner.accountLinkingRequests.length > 0 &&  props.strategyRef.owner.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accountLinkingRequests.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            verificationToken: item.verificationToken !== undefined ? item.verificationToken : undefined,
            userAgent: item.userAgent !== undefined ? item.userAgent : undefined,
            ipAddress: item.ipAddress !== undefined ? item.ipAddress : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            verifiedAt: item.verifiedAt !== undefined ? item.verifiedAt : undefined,
            approvedAt: item.approvedAt !== undefined ? item.approvedAt : undefined,
            rejectedAt: item.rejectedAt !== undefined ? item.rejectedAt : undefined,
          },
        }))
      } : undefined,
      reviewedWaitlistEntries: props.strategyRef.owner.reviewedWaitlistEntries ? 
        Array.isArray(props.strategyRef.owner.reviewedWaitlistEntries) && props.strategyRef.owner.reviewedWaitlistEntries.length > 0 &&  props.strategyRef.owner.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            email: item.email !== undefined ? item.email : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            fullName: item.fullName !== undefined ? item.fullName : undefined,
            companyName: item.companyName !== undefined ? item.companyName : undefined,
            companyWebsite: item.companyWebsite !== undefined ? item.companyWebsite : undefined,
            jobRole: item.jobRole !== undefined ? item.jobRole : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? item.professionalInvestorConfirmed : undefined,
            status: item.status !== undefined ? item.status : undefined,
            queuePosition: item.queuePosition !== undefined ? item.queuePosition : undefined,
            reviewedAt: item.reviewedAt !== undefined ? item.reviewedAt : undefined,
          },
        }))
      } : undefined,
      llmConfiguration: props.strategyRef.owner.llmConfiguration ? 
        typeof props.strategyRef.owner.llmConfiguration === 'object' && Object.keys(props.strategyRef.owner.llmConfiguration).length === 1 && Object.keys(props.strategyRef.owner.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.llmConfiguration.id !== undefined ? props.strategyRef.owner.llmConfiguration.id : undefined,
            userId: props.strategyRef.owner.llmConfiguration.userId !== undefined ? props.strategyRef.owner.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? props.strategyRef.owner.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? props.strategyRef.owner.llmConfiguration.miniProvider : undefined,
            normalProvider: props.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? props.strategyRef.owner.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? props.strategyRef.owner.llmConfiguration.advancedProvider : undefined,
            miniModel: props.strategyRef.owner.llmConfiguration.miniModel !== undefined ? props.strategyRef.owner.llmConfiguration.miniModel : undefined,
            normalModel: props.strategyRef.owner.llmConfiguration.normalModel !== undefined ? props.strategyRef.owner.llmConfiguration.normalModel : undefined,
            advancedModel: props.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? props.strategyRef.owner.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.strategyRef.owner.orgMemberships ? 
        Array.isArray(props.strategyRef.owner.orgMemberships) && props.strategyRef.owner.orgMemberships.length > 0 &&  props.strategyRef.owner.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.orgMemberships.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      fundAssignments: props.strategyRef.owner.fundAssignments ? 
        Array.isArray(props.strategyRef.owner.fundAssignments) && props.strategyRef.owner.fundAssignments.length > 0 &&  props.strategyRef.owner.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.fundAssignments.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      managedFunds: props.strategyRef.owner.managedFunds ? 
        Array.isArray(props.strategyRef.owner.managedFunds) && props.strategyRef.owner.managedFunds.length > 0 &&  props.strategyRef.owner.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.managedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      operatedFunds: props.strategyRef.owner.operatedFunds ? 
        Array.isArray(props.strategyRef.owner.operatedFunds) && props.strategyRef.owner.operatedFunds.length > 0 &&  props.strategyRef.owner.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.operatedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      ownedMandates: props.strategyRef.owner.ownedMandates ? 
        Array.isArray(props.strategyRef.owner.ownedMandates) && props.strategyRef.owner.ownedMandates.length > 0 &&  props.strategyRef.owner.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.ownedMandates.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            activeVersionId: item.activeVersionId !== undefined ? item.activeVersionId : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            scopeKind: item.scopeKind !== undefined ? item.scopeKind : undefined,
            klass: item.klass !== undefined ? item.klass : undefined,
            name: item.name !== undefined ? item.name : undefined,
            personaScope: item.personaScope !== undefined ? item.personaScope : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      authoredMandateVersions: props.strategyRef.owner.authoredMandateVersions ? 
        Array.isArray(props.strategyRef.owner.authoredMandateVersions) && props.strategyRef.owner.authoredMandateVersions.length > 0 &&  props.strategyRef.owner.authoredMandateVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authoredMandateVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authoredMandateVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateId: item.mandateId !== undefined ? {
                equals: item.mandateId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            versionLabel: item.versionLabel !== undefined ? item.versionLabel : undefined,
            versionSeq: item.versionSeq !== undefined ? item.versionSeq : undefined,
            status: item.status !== undefined ? item.status : undefined,
            summary: item.summary !== undefined ? item.summary : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
        }))
      } : undefined,
      mandateApprovalsDecided: props.strategyRef.owner.mandateApprovalsDecided ? 
        Array.isArray(props.strategyRef.owner.mandateApprovalsDecided) && props.strategyRef.owner.mandateApprovalsDecided.length > 0 &&  props.strategyRef.owner.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateVersionId: item.mandateVersionId !== undefined ? {
                equals: item.mandateVersionId 
               } : undefined,
            correlationId: item.correlationId !== undefined ? {
                equals: item.correlationId 
               } : undefined,
          },
          create: {
            action: item.action !== undefined ? item.action : undefined,
            decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
            rationale: item.rationale !== undefined ? item.rationale : undefined,
            correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
          },
        }))
      } : undefined,
      investorProfiles: props.strategyRef.owner.investorProfiles ? 
        Array.isArray(props.strategyRef.owner.investorProfiles) && props.strategyRef.owner.investorProfiles.length > 0 &&  props.strategyRef.owner.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.investorProfiles.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            email: item.email !== undefined ? item.email : undefined,
            type: item.type !== undefined ? item.type : undefined,
            status: item.status !== undefined ? item.status : undefined,
            kycStatus: item.kycStatus !== undefined ? item.kycStatus : undefined,
            jurisdiction: item.jurisdiction !== undefined ? item.jurisdiction : undefined,
            joinedAt: item.joinedAt !== undefined ? item.joinedAt : undefined,
            externalRef: item.externalRef !== undefined ? item.externalRef : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      notificationDeliveries: props.strategyRef.owner.notificationDeliveries ? 
        Array.isArray(props.strategyRef.owner.notificationDeliveries) && props.strategyRef.owner.notificationDeliveries.length > 0 &&  props.strategyRef.owner.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationDeliveries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
            recipientUserId: item.recipientUserId !== undefined ? {
                equals: item.recipientUserId 
               } : undefined,
            templateId: item.templateId !== undefined ? {
                equals: item.templateId 
               } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                equals: item.providerMessageId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            channel: item.channel !== undefined ? item.channel : undefined,
            templateId: item.templateId !== undefined ? item.templateId : undefined,
            templateVersion: item.templateVersion !== undefined ? item.templateVersion : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerMessageId: item.providerMessageId !== undefined ? item.providerMessageId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            statusDetail: item.statusDetail !== undefined ? item.statusDetail : undefined,
            sentAt: item.sentAt !== undefined ? item.sentAt : undefined,
            deliveredAt: item.deliveredAt !== undefined ? item.deliveredAt : undefined,
            readAt: item.readAt !== undefined ? item.readAt : undefined,
          },
        }))
      } : undefined,
      notificationPreferences: props.strategyRef.owner.notificationPreferences ? 
        Array.isArray(props.strategyRef.owner.notificationPreferences) && props.strategyRef.owner.notificationPreferences.length > 0 &&  props.strategyRef.owner.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationPreferences.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
          },
          create: {
            eventId: item.eventId !== undefined ? item.eventId : undefined,
            channel: item.channel !== undefined ? item.channel : undefined,
            enabled: item.enabled !== undefined ? item.enabled : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    subscriptions: props.strategyRef.subscriptions ? 
      Array.isArray(props.strategyRef.subscriptions) && props.strategyRef.subscriptions.length > 0 &&  props.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.strategyRef.subscriptions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.strategyRef.subscriptions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          accountId: item.accountId !== undefined ? {
              equals: item.accountId 
             } : undefined,
          strategyId: item.strategyId !== undefined ? {
              equals: item.strategyId 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          status: item.status !== undefined ? item.status : undefined,
          units: item.units !== undefined ? item.units : undefined,
          costBasis: item.costBasis !== undefined ? item.costBasis : undefined,
          realizedPL: item.realizedPL !== undefined ? item.realizedPL : undefined,
          targetAllocationPct: item.targetAllocationPct !== undefined ? item.targetAllocationPct : undefined,
          currency: item.currency !== undefined ? item.currency : undefined,
          subscribedAt: item.subscribedAt !== undefined ? item.subscribedAt : undefined,
          lastRebalancedAt: item.lastRebalancedAt !== undefined ? item.lastRebalancedAt : undefined,
          deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
      account: item.account ? 
        typeof item.account === 'object' && Object.keys(item.account).length === 1 && Object.keys(item.account)[0] === 'id'
    ? { connect: {
            id: item.account.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.account.id !== undefined ? item.account.id : undefined,
            type: item.account.type !== undefined ? {
                equals: item.account.type 
               } : undefined,
            userId: item.account.userId !== undefined ? {
                equals: item.account.userId 
               } : undefined,
          },
          create: {
            type: item.account.type !== undefined ? item.account.type : undefined,
            APIKey: item.account.APIKey !== undefined ? item.account.APIKey : undefined,
            APISecret: item.account.APISecret !== undefined ? item.account.APISecret : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? item.account.marketOpen : undefined,
            realTime: item.account.realTime !== undefined ? item.account.realTime : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? item.account.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? item.account.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? item.account.tradeAllocationPct : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? item.account.autoAllocation : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? item.account.minPercentageChange : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? item.account.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? item.account.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? item.account.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? item.account.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? item.account.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? item.account.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? item.account.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? item.account.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? item.account.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? item.account.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? item.account.minimumPriceChangePercent100 : undefined,
            deletedAt: item.account.deletedAt !== undefined ? item.account.deletedAt : undefined,
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
            mutation: CREATE_ONE_TRADE,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneTrade) {
            return response.data.createOneTrade;
          } else {
            return null as unknown as TradeType;
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
            logger.error("Non-retryable constraint violation in createOneTrade", {
              operation: 'createOneTrade',
              model: 'Trade',
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
            logger.warn("Database connection error in createOneTrade, retrying...", {
              operation: 'createOneTrade',
              model: 'Trade',
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
              operation: 'createOneTrade',
              model: 'Trade',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneTrade',
              model: 'Trade',
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
   * Create multiple Trade records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of Trade objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: TradeType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_TRADE = gql`
          mutation createManyTrade($data: [TradeCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyTrade(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      alpacaAccountId: prop.alpacaAccountId !== undefined ? prop.alpacaAccountId : undefined,
  signal: prop.signal !== undefined ? prop.signal : undefined,
  strategy: prop.strategy !== undefined ? prop.strategy : undefined,
  analysis: prop.analysis !== undefined ? prop.analysis : undefined,
  summary: prop.summary !== undefined ? prop.summary : undefined,
  confidence: prop.confidence !== undefined ? prop.confidence : undefined,
  timestamp: prop.timestamp !== undefined ? prop.timestamp : undefined,
  status: prop.status !== undefined ? prop.status : undefined,
  deletedAt: prop.deletedAt !== undefined ? prop.deletedAt : undefined,
  symbol: prop.symbol !== undefined ? prop.symbol : undefined,
  side: prop.side !== undefined ? prop.side : undefined,
  entryPrice: prop.entryPrice !== undefined ? prop.entryPrice : undefined,
  exitPrice: prop.exitPrice !== undefined ? prop.exitPrice : undefined,
  entryQty: prop.entryQty !== undefined ? prop.entryQty : undefined,
  exitQty: prop.exitQty !== undefined ? prop.exitQty : undefined,
  entryValue: prop.entryValue !== undefined ? prop.entryValue : undefined,
  exitValue: prop.exitValue !== undefined ? prop.exitValue : undefined,
  entryTime: prop.entryTime !== undefined ? prop.entryTime : undefined,
  exitTime: prop.exitTime !== undefined ? prop.exitTime : undefined,
  pnlAmount: prop.pnlAmount !== undefined ? prop.pnlAmount : undefined,
  pnlPercent: prop.pnlPercent !== undefined ? prop.pnlPercent : undefined,
  durationMinutes: prop.durationMinutes !== undefined ? prop.durationMinutes : undefined,
  marketPhase: prop.marketPhase !== undefined ? prop.marketPhase : undefined,
  marketVolatility: prop.marketVolatility !== undefined ? prop.marketVolatility : undefined,
  sessionHorizonMinutes: prop.sessionHorizonMinutes !== undefined ? prop.sessionHorizonMinutes : undefined,
  thresholdsJson: prop.thresholdsJson !== undefined ? prop.thresholdsJson : undefined,
  thesisVersion: prop.thesisVersion !== undefined ? prop.thesisVersion : undefined,
  lastReunderwrittenAt: prop.lastReunderwrittenAt !== undefined ? prop.lastReunderwrittenAt : undefined,
  supersededById: prop.supersededById !== undefined ? prop.supersededById : undefined,
  rejectionMetadata: prop.rejectionMetadata !== undefined ? prop.rejectionMetadata : undefined,
  signalSource: prop.signalSource !== undefined ? prop.signalSource : undefined,
  signalSourceType: prop.signalSourceType !== undefined ? prop.signalSourceType : undefined,
  signalId: prop.signalId !== undefined ? prop.signalId : undefined,
  pathway: prop.pathway !== undefined ? prop.pathway : undefined,
  pathwayType: prop.pathwayType !== undefined ? prop.pathwayType : undefined,
  exitTier: prop.exitTier !== undefined ? prop.exitTier : undefined,
  exitTierType: prop.exitTierType !== undefined ? prop.exitTierType : undefined,
  strategyId: prop.strategyId !== undefined ? prop.strategyId : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_TRADE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyTrade) {
          return response.data.createManyTrade;
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
          logger.warn("Duplicate key in createManyTrade (expected during overlapping fetches)", {
            operation: 'createManyTrade',
            model: 'Trade',
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
          logger.warn("Database connection error in createManyTrade, retrying...", {
            operation: 'createManyTrade',
            model: 'Trade',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyTrade',
            model: 'Trade',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyTrade',
            model: 'Trade',
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
   * Update a single Trade record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated Trade or null.
   */
  async update(props: TradeType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<TradeType> {
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

        const UPDATE_ONE_TRADE = gql`
          mutation updateOneTrade($data: TradeUpdateInput!, $where: TradeWhereUniqueInput!) {
            updateOneTrade(data: $data, where: $where) {
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
  signal: props.signal !== undefined ? {
            set: props.signal 
           } : undefined,
  strategy: props.strategy !== undefined ? {
            set: props.strategy 
           } : undefined,
  analysis: props.analysis !== undefined ? {
            set: props.analysis 
           } : undefined,
  summary: props.summary !== undefined ? {
            set: props.summary 
           } : undefined,
  confidence: props.confidence !== undefined ? {
            set: props.confidence 
           } : undefined,
  timestamp: props.timestamp !== undefined ? {
            set: props.timestamp 
           } : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
  deletedAt: props.deletedAt !== undefined ? {
            set: props.deletedAt 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  side: props.side !== undefined ? {
            set: props.side 
           } : undefined,
  entryPrice: props.entryPrice !== undefined ? {
            set: props.entryPrice 
           } : undefined,
  exitPrice: props.exitPrice !== undefined ? {
            set: props.exitPrice 
           } : undefined,
  entryQty: props.entryQty !== undefined ? {
            set: props.entryQty 
           } : undefined,
  exitQty: props.exitQty !== undefined ? {
            set: props.exitQty 
           } : undefined,
  entryValue: props.entryValue !== undefined ? {
            set: props.entryValue 
           } : undefined,
  exitValue: props.exitValue !== undefined ? {
            set: props.exitValue 
           } : undefined,
  entryTime: props.entryTime !== undefined ? {
            set: props.entryTime 
           } : undefined,
  exitTime: props.exitTime !== undefined ? {
            set: props.exitTime 
           } : undefined,
  pnlAmount: props.pnlAmount !== undefined ? {
            set: props.pnlAmount 
           } : undefined,
  pnlPercent: props.pnlPercent !== undefined ? {
            set: props.pnlPercent 
           } : undefined,
  durationMinutes: props.durationMinutes !== undefined ? {
            set: props.durationMinutes 
           } : undefined,
  marketPhase: props.marketPhase !== undefined ? {
            set: props.marketPhase 
           } : undefined,
  marketVolatility: props.marketVolatility !== undefined ? {
            set: props.marketVolatility 
           } : undefined,
  sessionHorizonMinutes: props.sessionHorizonMinutes !== undefined ? {
            set: props.sessionHorizonMinutes 
           } : undefined,
  thresholdsJson: props.thresholdsJson !== undefined ? {
            set: props.thresholdsJson 
           } : undefined,
  thesisVersion: props.thesisVersion !== undefined ? {
            set: props.thesisVersion 
           } : undefined,
  lastReunderwrittenAt: props.lastReunderwrittenAt !== undefined ? {
            set: props.lastReunderwrittenAt 
           } : undefined,
  supersededById: props.supersededById !== undefined ? {
            set: props.supersededById 
           } : undefined,
  rejectionMetadata: props.rejectionMetadata !== undefined ? props.rejectionMetadata : undefined,
  signalSource: props.signalSource !== undefined ? {
            set: props.signalSource 
           } : undefined,
  signalSourceType: props.signalSourceType !== undefined ? {
            set: props.signalSourceType 
           } : undefined,
  signalId: props.signalId !== undefined ? {
            set: props.signalId 
           } : undefined,
  pathway: props.pathway !== undefined ? {
            set: props.pathway 
           } : undefined,
  pathwayType: props.pathwayType !== undefined ? {
            set: props.pathwayType 
           } : undefined,
  exitTier: props.exitTier !== undefined ? {
            set: props.exitTier 
           } : undefined,
  exitTierType: props.exitTierType !== undefined ? {
            set: props.exitTierType 
           } : undefined,
  actions: props.actions ? 
  Array.isArray(props.actions) && props.actions.length > 0 && props.actions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.actions.map((item) => ({
    id: item.id
  }))
} : { upsert: props.actions.map((item) => ({
      where: {
        id: item.id !== undefined ? item.id : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? item.alpacaOrderId : undefined,
        tradeId: item.tradeId !== undefined ? {
            equals: item.tradeId
          } : undefined,
        type: item.type !== undefined ? {
            equals: item.type
          } : undefined,
        status: item.status !== undefined ? {
            equals: item.status
          } : undefined,
        supersededActionId: item.supersededActionId !== undefined ? {
            equals: item.supersededActionId
          } : undefined,
      },
      update: {
        id: item.id !== undefined ? {
            set: item.id
          } : undefined,
        sequence: item.sequence !== undefined ? {
            set: item.sequence
          } : undefined,
        type: item.type !== undefined ? {
            set: item.type
          } : undefined,
        primary: item.primary !== undefined ? {
            set: item.primary
          } : undefined,
        note: item.note !== undefined ? {
            set: item.note
          } : undefined,
        status: item.status !== undefined ? {
            set: item.status
          } : undefined,
        deletedAt: item.deletedAt !== undefined ? {
            set: item.deletedAt
          } : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? {
            set: item.alpacaOrderId
          } : undefined,
        supersededActionId: item.supersededActionId !== undefined ? {
            set: item.supersededActionId
          } : undefined,
        triggerSource: item.triggerSource !== undefined ? {
            set: item.triggerSource
          } : undefined,
        triggerSourceType: item.triggerSourceType !== undefined ? {
            set: item.triggerSourceType
          } : undefined,
      },
      create: {
        sequence: item.sequence !== undefined ? item.sequence : undefined,
        type: item.type !== undefined ? item.type : undefined,
        primary: item.primary !== undefined ? item.primary : undefined,
        note: item.note !== undefined ? item.note : undefined,
        status: item.status !== undefined ? item.status : undefined,
        deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? item.alpacaOrderId : undefined,
        supersededActionId: item.supersededActionId !== undefined ? item.supersededActionId : undefined,
        triggerSource: item.triggerSource !== undefined ? item.triggerSource : undefined,
        triggerSourceType: item.triggerSourceType !== undefined ? item.triggerSourceType : undefined,
      },
    }))
  } : undefined,
  strategyRef: props.strategyRef ? 
  typeof props.strategyRef === 'object' && Object.keys(props.strategyRef).length === 1 && (Object.keys(props.strategyRef)[0] === 'id' || Object.keys(props.strategyRef)[0] === 'symbol')
? {
  connect: {
    id: props.strategyRef.id
  }
} : { upsert: {
      where: {
        id: props.strategyRef.id !== undefined ? {
            equals: props.strategyRef.id
          } : undefined,
        key: props.strategyRef.key !== undefined ? {
            equals: props.strategyRef.key
          } : undefined,
        ownerUserId: props.strategyRef.ownerUserId !== undefined ? {
            equals: props.strategyRef.ownerUserId
          } : undefined,
      },
      update: {
        id: props.strategyRef.id !== undefined ? {
            set: props.strategyRef.id
          } : undefined,
        key: props.strategyRef.key !== undefined ? {
            set: props.strategyRef.key
          } : undefined,
        displayName: props.strategyRef.displayName !== undefined ? {
            set: props.strategyRef.displayName
          } : undefined,
        description: props.strategyRef.description !== undefined ? {
            set: props.strategyRef.description
          } : undefined,
        origin: props.strategyRef.origin !== undefined ? {
            set: props.strategyRef.origin
          } : undefined,
        lifecycleState: props.strategyRef.lifecycleState !== undefined ? {
            set: props.strategyRef.lifecycleState
          } : undefined,
        manifestHash: props.strategyRef.manifestHash !== undefined ? {
            set: props.strategyRef.manifestHash
          } : undefined,
        deletedAt: props.strategyRef.deletedAt !== undefined ? {
            set: props.strategyRef.deletedAt
          } : undefined,
    owner: props.strategyRef.owner ? 
    typeof props.strategyRef.owner === 'object' && Object.keys(props.strategyRef.owner).length === 1 && (Object.keys(props.strategyRef.owner)[0] === 'id' || Object.keys(props.strategyRef.owner)[0] === 'symbol')
? {
    connect: {
      id: props.strategyRef.owner.id
    }
} : { upsert: {
        where: {
          id: props.strategyRef.owner.id !== undefined ? {
              equals: props.strategyRef.owner.id
            } : undefined,
          name: props.strategyRef.owner.name !== undefined ? {
              equals: props.strategyRef.owner.name
            } : undefined,
          email: props.strategyRef.owner.email !== undefined ? {
              equals: props.strategyRef.owner.email
            } : undefined,
          customerId: props.strategyRef.owner.customerId !== undefined ? {
              equals: props.strategyRef.owner.customerId
            } : undefined,
        },
        update: {
          id: props.strategyRef.owner.id !== undefined ? {
              set: props.strategyRef.owner.id
            } : undefined,
          name: props.strategyRef.owner.name !== undefined ? {
              set: props.strategyRef.owner.name
            } : undefined,
          email: props.strategyRef.owner.email !== undefined ? {
              set: props.strategyRef.owner.email
            } : undefined,
          emailVerified: props.strategyRef.owner.emailVerified !== undefined ? {
              set: props.strategyRef.owner.emailVerified
            } : undefined,
          image: props.strategyRef.owner.image !== undefined ? {
              set: props.strategyRef.owner.image
            } : undefined,
          avatarUrl: props.strategyRef.owner.avatarUrl !== undefined ? {
              set: props.strategyRef.owner.avatarUrl
            } : undefined,
          onboardingComplete: props.strategyRef.owner.onboardingComplete !== undefined ? {
              set: props.strategyRef.owner.onboardingComplete
            } : undefined,
          signupCategory: props.strategyRef.owner.signupCategory !== undefined ? {
              set: props.strategyRef.owner.signupCategory
            } : undefined,
          deletedAt: props.strategyRef.owner.deletedAt !== undefined ? {
              set: props.strategyRef.owner.deletedAt
            } : undefined,
          role: props.strategyRef.owner.role !== undefined ? {
              set: props.strategyRef.owner.role
            } : undefined,
          bio: props.strategyRef.owner.bio !== undefined ? {
              set: props.strategyRef.owner.bio
            } : undefined,
          jobTitle: props.strategyRef.owner.jobTitle !== undefined ? {
              set: props.strategyRef.owner.jobTitle
            } : undefined,
          currentAccount: props.strategyRef.owner.currentAccount !== undefined ? {
              set: props.strategyRef.owner.currentAccount
            } : undefined,
          plan: props.strategyRef.owner.plan !== undefined ? {
              set: props.strategyRef.owner.plan
            } : undefined,
          openaiAPIKey: props.strategyRef.owner.openaiAPIKey !== undefined ? {
              set: props.strategyRef.owner.openaiAPIKey
            } : undefined,
          openaiModel: props.strategyRef.owner.openaiModel !== undefined ? {
              set: props.strategyRef.owner.openaiModel
            } : undefined,
      customer: props.strategyRef.owner.customer ? 
      typeof props.strategyRef.owner.customer === 'object' && Object.keys(props.strategyRef.owner.customer).length === 1 && (Object.keys(props.strategyRef.owner.customer)[0] === 'id' || Object.keys(props.strategyRef.owner.customer)[0] === 'symbol')
? {
      connect: {
        id: props.strategyRef.owner.customer.id
      }
} : { upsert: {
          where: {
            id: props.strategyRef.owner.customer.id !== undefined ? {
                equals: props.strategyRef.owner.customer.id
              } : undefined,
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? {
                equals: props.strategyRef.owner.customer.authUserId
              } : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? {
                equals: props.strategyRef.owner.customer.name
              } : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripePriceId
              } : undefined,
          },
          update: {
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? {
                set: props.strategyRef.owner.customer.authUserId
              } : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? {
                set: props.strategyRef.owner.customer.name
              } : undefined,
            plan: props.strategyRef.owner.customer.plan !== undefined ? {
                set: props.strategyRef.owner.customer.plan
              } : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? {
                set: props.strategyRef.owner.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? {
                set: props.strategyRef.owner.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? {
                set: props.strategyRef.owner.customer.stripePriceId
              } : undefined,
            stripeCurrentPeriodEnd: props.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? {
                set: props.strategyRef.owner.customer.stripeCurrentPeriodEnd
              } : undefined,
            jurisdiction: props.strategyRef.owner.customer.jurisdiction !== undefined ? {
                set: props.strategyRef.owner.customer.jurisdiction
              } : undefined,
            riskProfile: props.strategyRef.owner.customer.riskProfile !== undefined ? {
                set: props.strategyRef.owner.customer.riskProfile
              } : undefined,
            amlStatus: props.strategyRef.owner.customer.amlStatus !== undefined ? {
                set: props.strategyRef.owner.customer.amlStatus
              } : undefined,
            lastKycUpdate: props.strategyRef.owner.customer.lastKycUpdate !== undefined ? {
                set: props.strategyRef.owner.customer.lastKycUpdate
              } : undefined,
          },
          create: {
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? props.strategyRef.owner.customer.authUserId : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? props.strategyRef.owner.customer.name : undefined,
            plan: props.strategyRef.owner.customer.plan !== undefined ? props.strategyRef.owner.customer.plan : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? props.strategyRef.owner.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? props.strategyRef.owner.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.strategyRef.owner.customer.jurisdiction !== undefined ? props.strategyRef.owner.customer.jurisdiction : undefined,
            riskProfile: props.strategyRef.owner.customer.riskProfile !== undefined ? props.strategyRef.owner.customer.riskProfile : undefined,
            amlStatus: props.strategyRef.owner.customer.amlStatus !== undefined ? props.strategyRef.owner.customer.amlStatus : undefined,
            lastKycUpdate: props.strategyRef.owner.customer.lastKycUpdate !== undefined ? props.strategyRef.owner.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.strategyRef.owner.accounts ? 
      Array.isArray(props.strategyRef.owner.accounts) && props.strategyRef.owner.accounts.length > 0 && props.strategyRef.owner.accounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.accounts.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.accounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            type: item.type !== undefined ? {
                equals: item.type
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            type: item.type !== undefined ? {
                set: item.type
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                set: item.providerAccountId
              } : undefined,
            refresh_token: item.refresh_token !== undefined ? {
                set: item.refresh_token
              } : undefined,
            access_token: item.access_token !== undefined ? {
                set: item.access_token
              } : undefined,
            expires_at: item.expires_at !== undefined ? {
                set: item.expires_at
              } : undefined,
            token_type: item.token_type !== undefined ? {
                set: item.token_type
              } : undefined,
            scope: item.scope !== undefined ? {
                set: item.scope
              } : undefined,
            id_token: item.id_token !== undefined ? {
                set: item.id_token
              } : undefined,
            session_state: item.session_state !== undefined ? {
                set: item.session_state
              } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            refresh_token: item.refresh_token !== undefined ? item.refresh_token : undefined,
            access_token: item.access_token !== undefined ? item.access_token : undefined,
            expires_at: item.expires_at !== undefined ? item.expires_at : undefined,
            token_type: item.token_type !== undefined ? item.token_type : undefined,
            scope: item.scope !== undefined ? item.scope : undefined,
            id_token: item.id_token !== undefined ? item.id_token : undefined,
            session_state: item.session_state !== undefined ? item.session_state : undefined,
          },
        }))
      } : undefined,
      sessions: props.strategyRef.owner.sessions ? 
      Array.isArray(props.strategyRef.owner.sessions) && props.strategyRef.owner.sessions.length > 0 && props.strategyRef.owner.sessions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.sessions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.sessions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            sessionToken: item.sessionToken !== undefined ? {
                set: item.sessionToken
              } : undefined,
            expires: item.expires !== undefined ? {
                set: item.expires
              } : undefined,
          },
          create: {
            sessionToken: item.sessionToken !== undefined ? item.sessionToken : undefined,
            expires: item.expires !== undefined ? item.expires : undefined,
          },
        }))
      } : undefined,
      authenticators: props.strategyRef.owner.authenticators ? 
      Array.isArray(props.strategyRef.owner.authenticators) && props.strategyRef.owner.authenticators.length > 0 && props.strategyRef.owner.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.authenticators.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.authenticators.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            credentialID: item.credentialID !== undefined ? {
                set: item.credentialID
              } : undefined,
            publicKey: item.publicKey !== undefined ? {
                set: item.publicKey
              } : undefined,
            counter: item.counter !== undefined ? {
                set: item.counter
              } : undefined,
          },
          create: {
            credentialID: item.credentialID !== undefined ? item.credentialID : undefined,
            publicKey: item.publicKey !== undefined ? item.publicKey : undefined,
            counter: item.counter !== undefined ? item.counter : undefined,
          },
        }))
      } : undefined,
      alpacaAccounts: props.strategyRef.owner.alpacaAccounts ? 
      Array.isArray(props.strategyRef.owner.alpacaAccounts) && props.strategyRef.owner.alpacaAccounts.length > 0 && props.strategyRef.owner.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.alpacaAccounts.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.alpacaAccounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            type: item.type !== undefined ? {
                equals: item.type
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            type: item.type !== undefined ? {
                set: item.type
              } : undefined,
            APIKey: item.APIKey !== undefined ? {
                set: item.APIKey
              } : undefined,
            APISecret: item.APISecret !== undefined ? {
                set: item.APISecret
              } : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? {
                set: item.marketOpen
              } : undefined,
            realTime: item.realTime !== undefined ? {
                set: item.realTime
              } : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? {
                set: item.cryptoTradingEnabled
              } : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs
              } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? {
                set: item.cryptoTradeAllocationPct
              } : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? {
                set: item.tradeAllocationPct
              } : undefined,
            autoAllocation: item.autoAllocation !== undefined ? {
                set: item.autoAllocation
              } : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? {
                set: item.minPercentageChange
              } : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? {
                set: item.volumeThreshold
              } : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? {
                set: item.enablePortfolioTrailingStop
              } : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? {
                set: item.portfolioTrailPercent
              } : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? {
                set: item.portfolioProfitThresholdPercent
              } : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? {
                set: item.reducedPortfolioTrailPercent
              } : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? {
                set: item.defaultTrailingStopPercentage100
              } : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? {
                set: item.firstTrailReductionThreshold100
              } : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? {
                set: item.secondTrailReductionThreshold100
              } : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? {
                set: item.firstReducedTrailPercentage100
              } : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? {
                set: item.secondReducedTrailPercentage100
              } : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? {
                set: item.minimumPriceChangePercent100
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            APIKey: item.APIKey !== undefined ? item.APIKey : undefined,
            APISecret: item.APISecret !== undefined ? item.APISecret : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? item.marketOpen : undefined,
            realTime: item.realTime !== undefined ? item.realTime : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? item.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? item.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? item.tradeAllocationPct : undefined,
            autoAllocation: item.autoAllocation !== undefined ? item.autoAllocation : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? item.minPercentageChange : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? item.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? item.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? item.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? item.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? item.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? item.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? item.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? item.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? item.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? item.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? item.minimumPriceChangePercent100 : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      linkedProviders: props.strategyRef.owner.linkedProviders ? 
      Array.isArray(props.strategyRef.owner.linkedProviders) && props.strategyRef.owner.linkedProviders.length > 0 && props.strategyRef.owner.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.linkedProviders.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.linkedProviders.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId
              } : undefined,
            email: item.email !== undefined ? {
                equals: item.email
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                set: item.providerAccountId
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            accessToken: item.accessToken !== undefined ? {
                set: item.accessToken
              } : undefined,
            refreshToken: item.refreshToken !== undefined ? {
                set: item.refreshToken
              } : undefined,
            expiresAt: item.expiresAt !== undefined ? {
                set: item.expiresAt
              } : undefined,
            linkedAt: item.linkedAt !== undefined ? {
                set: item.linkedAt
              } : undefined,
          },
          create: {
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            email: item.email !== undefined ? item.email : undefined,
            accessToken: item.accessToken !== undefined ? item.accessToken : undefined,
            refreshToken: item.refreshToken !== undefined ? item.refreshToken : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            linkedAt: item.linkedAt !== undefined ? item.linkedAt : undefined,
          },
        }))
      } : undefined,
      accountLinkingRequests: props.strategyRef.owner.accountLinkingRequests ? 
      Array.isArray(props.strategyRef.owner.accountLinkingRequests) && props.strategyRef.owner.accountLinkingRequests.length > 0 && props.strategyRef.owner.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.accountLinkingRequests.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.accountLinkingRequests.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            email: item.email !== undefined ? {
                equals: item.email
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                set: item.providerAccountId
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            verificationToken: item.verificationToken !== undefined ? {
                set: item.verificationToken
              } : undefined,
            userAgent: item.userAgent !== undefined ? {
                set: item.userAgent
              } : undefined,
            ipAddress: item.ipAddress !== undefined ? {
                set: item.ipAddress
              } : undefined,
            expiresAt: item.expiresAt !== undefined ? {
                set: item.expiresAt
              } : undefined,
            verifiedAt: item.verifiedAt !== undefined ? {
                set: item.verifiedAt
              } : undefined,
            approvedAt: item.approvedAt !== undefined ? {
                set: item.approvedAt
              } : undefined,
            rejectedAt: item.rejectedAt !== undefined ? {
                set: item.rejectedAt
              } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            verificationToken: item.verificationToken !== undefined ? item.verificationToken : undefined,
            userAgent: item.userAgent !== undefined ? item.userAgent : undefined,
            ipAddress: item.ipAddress !== undefined ? item.ipAddress : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            verifiedAt: item.verifiedAt !== undefined ? item.verifiedAt : undefined,
            approvedAt: item.approvedAt !== undefined ? item.approvedAt : undefined,
            rejectedAt: item.rejectedAt !== undefined ? item.rejectedAt : undefined,
          },
        }))
      } : undefined,
      reviewedWaitlistEntries: props.strategyRef.owner.reviewedWaitlistEntries ? 
      Array.isArray(props.strategyRef.owner.reviewedWaitlistEntries) && props.strategyRef.owner.reviewedWaitlistEntries.length > 0 && props.strategyRef.owner.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            email: item.email !== undefined ? item.email : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            reviewedById: item.reviewedById !== undefined ? {
                equals: item.reviewedById
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            fullName: item.fullName !== undefined ? {
                set: item.fullName
              } : undefined,
            companyName: item.companyName !== undefined ? {
                set: item.companyName
              } : undefined,
            companyWebsite: item.companyWebsite !== undefined ? {
                set: item.companyWebsite
              } : undefined,
            jobRole: item.jobRole !== undefined ? {
                set: item.jobRole
              } : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? {
                set: item.professionalInvestorConfirmed
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            queuePosition: item.queuePosition !== undefined ? {
                set: item.queuePosition
              } : undefined,
            reviewedAt: item.reviewedAt !== undefined ? {
                set: item.reviewedAt
              } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            fullName: item.fullName !== undefined ? item.fullName : undefined,
            companyName: item.companyName !== undefined ? item.companyName : undefined,
            companyWebsite: item.companyWebsite !== undefined ? item.companyWebsite : undefined,
            jobRole: item.jobRole !== undefined ? item.jobRole : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? item.professionalInvestorConfirmed : undefined,
            status: item.status !== undefined ? item.status : undefined,
            queuePosition: item.queuePosition !== undefined ? item.queuePosition : undefined,
            reviewedAt: item.reviewedAt !== undefined ? item.reviewedAt : undefined,
          },
        }))
      } : undefined,
      llmConfiguration: props.strategyRef.owner.llmConfiguration ? 
      typeof props.strategyRef.owner.llmConfiguration === 'object' && Object.keys(props.strategyRef.owner.llmConfiguration).length === 1 && (Object.keys(props.strategyRef.owner.llmConfiguration)[0] === 'id' || Object.keys(props.strategyRef.owner.llmConfiguration)[0] === 'symbol')
? {
      connect: {
        id: props.strategyRef.owner.llmConfiguration.id
      }
} : { upsert: {
          where: {
            id: props.strategyRef.owner.llmConfiguration.id !== undefined ? {
                equals: props.strategyRef.owner.llmConfiguration.id
              } : undefined,
            userId: props.strategyRef.owner.llmConfiguration.userId !== undefined ? {
                equals: props.strategyRef.owner.llmConfiguration.userId
              } : undefined,
          },
          update: {
            id: props.strategyRef.owner.llmConfiguration.id !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.id
              } : undefined,
            defaultProvider: props.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.defaultProvider
              } : undefined,
            miniProvider: props.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.miniProvider
              } : undefined,
            normalProvider: props.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.normalProvider
              } : undefined,
            advancedProvider: props.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.advancedProvider
              } : undefined,
            miniModel: props.strategyRef.owner.llmConfiguration.miniModel !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.miniModel
              } : undefined,
            normalModel: props.strategyRef.owner.llmConfiguration.normalModel !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.normalModel
              } : undefined,
            advancedModel: props.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.advancedModel
              } : undefined,
            openaiApiKey: props.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.openaiApiKey
              } : undefined,
            anthropicApiKey: props.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.anthropicApiKey
              } : undefined,
            deepseekApiKey: props.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.deepseekApiKey
              } : undefined,
            kimiApiKey: props.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.kimiApiKey
              } : undefined,
            qwenApiKey: props.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.qwenApiKey
              } : undefined,
            xaiApiKey: props.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.xaiApiKey
              } : undefined,
            geminiApiKey: props.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.geminiApiKey
              } : undefined,
            deepinfraApiKey: props.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.deepinfraApiKey
              } : undefined,
          },
          create: {
            defaultProvider: props.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? props.strategyRef.owner.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? props.strategyRef.owner.llmConfiguration.miniProvider : undefined,
            normalProvider: props.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? props.strategyRef.owner.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? props.strategyRef.owner.llmConfiguration.advancedProvider : undefined,
            miniModel: props.strategyRef.owner.llmConfiguration.miniModel !== undefined ? props.strategyRef.owner.llmConfiguration.miniModel : undefined,
            normalModel: props.strategyRef.owner.llmConfiguration.normalModel !== undefined ? props.strategyRef.owner.llmConfiguration.normalModel : undefined,
            advancedModel: props.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? props.strategyRef.owner.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.strategyRef.owner.orgMemberships ? 
      Array.isArray(props.strategyRef.owner.orgMemberships) && props.strategyRef.owner.orgMemberships.length > 0 && props.strategyRef.owner.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.orgMemberships.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.orgMemberships.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            role: item.role !== undefined ? {
                set: item.role
              } : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions
              } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      fundAssignments: props.strategyRef.owner.fundAssignments ? 
      Array.isArray(props.strategyRef.owner.fundAssignments) && props.strategyRef.owner.fundAssignments.length > 0 && props.strategyRef.owner.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.fundAssignments.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.fundAssignments.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            role: item.role !== undefined ? {
                set: item.role
              } : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions
              } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      managedFunds: props.strategyRef.owner.managedFunds ? 
      Array.isArray(props.strategyRef.owner.managedFunds) && props.strategyRef.owner.managedFunds.length > 0 && props.strategyRef.owner.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.managedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.managedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            managerId: item.managerId !== undefined ? {
                equals: item.managerId
              } : undefined,
            operatorId: item.operatorId !== undefined ? {
                equals: item.operatorId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                set: item.slug
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            currency: item.currency !== undefined ? {
                set: item.currency
              } : undefined,
            inceptionDate: item.inceptionDate !== undefined ? {
                set: item.inceptionDate
              } : undefined,
            aum: item.aum !== undefined ? {
                set: item.aum
              } : undefined,
            navPerShare: item.navPerShare !== undefined ? {
                set: item.navPerShare
              } : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? {
                set: item.sharesOutstanding
              } : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? {
                set: item.highWaterMarkNav
              } : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      operatedFunds: props.strategyRef.owner.operatedFunds ? 
      Array.isArray(props.strategyRef.owner.operatedFunds) && props.strategyRef.owner.operatedFunds.length > 0 && props.strategyRef.owner.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.operatedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.operatedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            managerId: item.managerId !== undefined ? {
                equals: item.managerId
              } : undefined,
            operatorId: item.operatorId !== undefined ? {
                equals: item.operatorId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                set: item.slug
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            currency: item.currency !== undefined ? {
                set: item.currency
              } : undefined,
            inceptionDate: item.inceptionDate !== undefined ? {
                set: item.inceptionDate
              } : undefined,
            aum: item.aum !== undefined ? {
                set: item.aum
              } : undefined,
            navPerShare: item.navPerShare !== undefined ? {
                set: item.navPerShare
              } : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? {
                set: item.sharesOutstanding
              } : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? {
                set: item.highWaterMarkNav
              } : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      ownedMandates: props.strategyRef.owner.ownedMandates ? 
      Array.isArray(props.strategyRef.owner.ownedMandates) && props.strategyRef.owner.ownedMandates.length > 0 && props.strategyRef.owner.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.ownedMandates.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.ownedMandates.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            activeVersionId: item.activeVersionId !== undefined ? item.activeVersionId : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId
              } : undefined,
            ownerId: item.ownerId !== undefined ? {
                equals: item.ownerId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            scopeKind: item.scopeKind !== undefined ? {
                set: item.scopeKind
              } : undefined,
            klass: item.klass !== undefined ? {
                set: item.klass
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            personaScope: item.personaScope !== undefined ? {
                set: item.personaScope
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            scopeKind: item.scopeKind !== undefined ? item.scopeKind : undefined,
            klass: item.klass !== undefined ? item.klass : undefined,
            name: item.name !== undefined ? item.name : undefined,
            personaScope: item.personaScope !== undefined ? item.personaScope : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      authoredMandateVersions: props.strategyRef.owner.authoredMandateVersions ? 
      Array.isArray(props.strategyRef.owner.authoredMandateVersions) && props.strategyRef.owner.authoredMandateVersions.length > 0 && props.strategyRef.owner.authoredMandateVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.authoredMandateVersions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.authoredMandateVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateId: item.mandateId !== undefined ? {
                equals: item.mandateId
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            authoredById: item.authoredById !== undefined ? {
                equals: item.authoredById
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            versionLabel: item.versionLabel !== undefined ? {
                set: item.versionLabel
              } : undefined,
            versionSeq: item.versionSeq !== undefined ? {
                set: item.versionSeq
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            summary: item.summary !== undefined ? {
                set: item.summary
              } : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
          create: {
            versionLabel: item.versionLabel !== undefined ? item.versionLabel : undefined,
            versionSeq: item.versionSeq !== undefined ? item.versionSeq : undefined,
            status: item.status !== undefined ? item.status : undefined,
            summary: item.summary !== undefined ? item.summary : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
        }))
      } : undefined,
      mandateApprovalsDecided: props.strategyRef.owner.mandateApprovalsDecided ? 
      Array.isArray(props.strategyRef.owner.mandateApprovalsDecided) && props.strategyRef.owner.mandateApprovalsDecided.length > 0 && props.strategyRef.owner.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateVersionId: item.mandateVersionId !== undefined ? {
                equals: item.mandateVersionId
              } : undefined,
            decidedByUserId: item.decidedByUserId !== undefined ? {
                equals: item.decidedByUserId
              } : undefined,
            correlationId: item.correlationId !== undefined ? {
                equals: item.correlationId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            action: item.action !== undefined ? {
                set: item.action
              } : undefined,
            decidedByRole: item.decidedByRole !== undefined ? {
                set: item.decidedByRole
              } : undefined,
            rationale: item.rationale !== undefined ? {
                set: item.rationale
              } : undefined,
            correlationId: item.correlationId !== undefined ? {
                set: item.correlationId
              } : undefined,
          },
          create: {
            action: item.action !== undefined ? item.action : undefined,
            decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
            rationale: item.rationale !== undefined ? item.rationale : undefined,
            correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
          },
        }))
      } : undefined,
      investorProfiles: props.strategyRef.owner.investorProfiles ? 
      Array.isArray(props.strategyRef.owner.investorProfiles) && props.strategyRef.owner.investorProfiles.length > 0 && props.strategyRef.owner.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.investorProfiles.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.investorProfiles.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            customerId: item.customerId !== undefined ? {
                equals: item.customerId
              } : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            email: item.email !== undefined ? {
                equals: item.email
              } : undefined,
            type: item.type !== undefined ? {
                equals: item.type
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            type: item.type !== undefined ? {
                set: item.type
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            kycStatus: item.kycStatus !== undefined ? {
                set: item.kycStatus
              } : undefined,
            jurisdiction: item.jurisdiction !== undefined ? {
                set: item.jurisdiction
              } : undefined,
            joinedAt: item.joinedAt !== undefined ? {
                set: item.joinedAt
              } : undefined,
            externalRef: item.externalRef !== undefined ? {
                set: item.externalRef
              } : undefined,
            notes: item.notes !== undefined ? {
                set: item.notes
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            email: item.email !== undefined ? item.email : undefined,
            type: item.type !== undefined ? item.type : undefined,
            status: item.status !== undefined ? item.status : undefined,
            kycStatus: item.kycStatus !== undefined ? item.kycStatus : undefined,
            jurisdiction: item.jurisdiction !== undefined ? item.jurisdiction : undefined,
            joinedAt: item.joinedAt !== undefined ? item.joinedAt : undefined,
            externalRef: item.externalRef !== undefined ? item.externalRef : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      notificationDeliveries: props.strategyRef.owner.notificationDeliveries ? 
      Array.isArray(props.strategyRef.owner.notificationDeliveries) && props.strategyRef.owner.notificationDeliveries.length > 0 && props.strategyRef.owner.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.notificationDeliveries.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.notificationDeliveries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId
              } : undefined,
            recipientUserId: item.recipientUserId !== undefined ? {
                equals: item.recipientUserId
              } : undefined,
            templateId: item.templateId !== undefined ? {
                equals: item.templateId
              } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                equals: item.providerMessageId
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            channel: item.channel !== undefined ? {
                set: item.channel
              } : undefined,
            templateId: item.templateId !== undefined ? {
                set: item.templateId
              } : undefined,
            templateVersion: item.templateVersion !== undefined ? {
                set: item.templateVersion
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                set: item.providerMessageId
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            statusDetail: item.statusDetail !== undefined ? {
                set: item.statusDetail
              } : undefined,
            sentAt: item.sentAt !== undefined ? {
                set: item.sentAt
              } : undefined,
            deliveredAt: item.deliveredAt !== undefined ? {
                set: item.deliveredAt
              } : undefined,
            readAt: item.readAt !== undefined ? {
                set: item.readAt
              } : undefined,
          },
          create: {
            channel: item.channel !== undefined ? item.channel : undefined,
            templateId: item.templateId !== undefined ? item.templateId : undefined,
            templateVersion: item.templateVersion !== undefined ? item.templateVersion : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerMessageId: item.providerMessageId !== undefined ? item.providerMessageId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            statusDetail: item.statusDetail !== undefined ? item.statusDetail : undefined,
            sentAt: item.sentAt !== undefined ? item.sentAt : undefined,
            deliveredAt: item.deliveredAt !== undefined ? item.deliveredAt : undefined,
            readAt: item.readAt !== undefined ? item.readAt : undefined,
          },
        }))
      } : undefined,
      notificationPreferences: props.strategyRef.owner.notificationPreferences ? 
      Array.isArray(props.strategyRef.owner.notificationPreferences) && props.strategyRef.owner.notificationPreferences.length > 0 && props.strategyRef.owner.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.notificationPreferences.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.notificationPreferences.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            eventId: item.eventId !== undefined ? {
                set: item.eventId
              } : undefined,
            channel: item.channel !== undefined ? {
                set: item.channel
              } : undefined,
            enabled: item.enabled !== undefined ? {
                set: item.enabled
              } : undefined,
          },
          create: {
            eventId: item.eventId !== undefined ? item.eventId : undefined,
            channel: item.channel !== undefined ? item.channel : undefined,
            enabled: item.enabled !== undefined ? item.enabled : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          name: props.strategyRef.owner.name !== undefined ? props.strategyRef.owner.name : undefined,
          email: props.strategyRef.owner.email !== undefined ? props.strategyRef.owner.email : undefined,
          emailVerified: props.strategyRef.owner.emailVerified !== undefined ? props.strategyRef.owner.emailVerified : undefined,
          image: props.strategyRef.owner.image !== undefined ? props.strategyRef.owner.image : undefined,
          avatarUrl: props.strategyRef.owner.avatarUrl !== undefined ? props.strategyRef.owner.avatarUrl : undefined,
          onboardingComplete: props.strategyRef.owner.onboardingComplete !== undefined ? props.strategyRef.owner.onboardingComplete : undefined,
          signupCategory: props.strategyRef.owner.signupCategory !== undefined ? props.strategyRef.owner.signupCategory : undefined,
          deletedAt: props.strategyRef.owner.deletedAt !== undefined ? props.strategyRef.owner.deletedAt : undefined,
          role: props.strategyRef.owner.role !== undefined ? props.strategyRef.owner.role : undefined,
          bio: props.strategyRef.owner.bio !== undefined ? props.strategyRef.owner.bio : undefined,
          jobTitle: props.strategyRef.owner.jobTitle !== undefined ? props.strategyRef.owner.jobTitle : undefined,
          currentAccount: props.strategyRef.owner.currentAccount !== undefined ? props.strategyRef.owner.currentAccount : undefined,
          plan: props.strategyRef.owner.plan !== undefined ? props.strategyRef.owner.plan : undefined,
          openaiAPIKey: props.strategyRef.owner.openaiAPIKey !== undefined ? props.strategyRef.owner.openaiAPIKey : undefined,
          openaiModel: props.strategyRef.owner.openaiModel !== undefined ? props.strategyRef.owner.openaiModel : undefined,
      customer: props.strategyRef.owner.customer ? 
        typeof props.strategyRef.owner.customer === 'object' && Object.keys(props.strategyRef.owner.customer).length === 1 && Object.keys(props.strategyRef.owner.customer)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.customer.id !== undefined ? props.strategyRef.owner.customer.id : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? {
                equals: props.strategyRef.owner.customer.authUserId 
               } : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? {
                equals: props.strategyRef.owner.customer.name 
               } : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? props.strategyRef.owner.customer.authUserId : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? props.strategyRef.owner.customer.name : undefined,
            plan: props.strategyRef.owner.customer.plan !== undefined ? props.strategyRef.owner.customer.plan : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? props.strategyRef.owner.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? props.strategyRef.owner.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.strategyRef.owner.customer.jurisdiction !== undefined ? props.strategyRef.owner.customer.jurisdiction : undefined,
            riskProfile: props.strategyRef.owner.customer.riskProfile !== undefined ? props.strategyRef.owner.customer.riskProfile : undefined,
            amlStatus: props.strategyRef.owner.customer.amlStatus !== undefined ? props.strategyRef.owner.customer.amlStatus : undefined,
            lastKycUpdate: props.strategyRef.owner.customer.lastKycUpdate !== undefined ? props.strategyRef.owner.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.strategyRef.owner.accounts ? 
        Array.isArray(props.strategyRef.owner.accounts) && props.strategyRef.owner.accounts.length > 0 &&  props.strategyRef.owner.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            refresh_token: item.refresh_token !== undefined ? item.refresh_token : undefined,
            access_token: item.access_token !== undefined ? item.access_token : undefined,
            expires_at: item.expires_at !== undefined ? item.expires_at : undefined,
            token_type: item.token_type !== undefined ? item.token_type : undefined,
            scope: item.scope !== undefined ? item.scope : undefined,
            id_token: item.id_token !== undefined ? item.id_token : undefined,
            session_state: item.session_state !== undefined ? item.session_state : undefined,
          },
        }))
      } : undefined,
      sessions: props.strategyRef.owner.sessions ? 
        Array.isArray(props.strategyRef.owner.sessions) && props.strategyRef.owner.sessions.length > 0 &&  props.strategyRef.owner.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.sessions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            sessionToken: item.sessionToken !== undefined ? item.sessionToken : undefined,
            expires: item.expires !== undefined ? item.expires : undefined,
          },
        }))
      } : undefined,
      authenticators: props.strategyRef.owner.authenticators ? 
        Array.isArray(props.strategyRef.owner.authenticators) && props.strategyRef.owner.authenticators.length > 0 &&  props.strategyRef.owner.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authenticators.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            credentialID: item.credentialID !== undefined ? item.credentialID : undefined,
            publicKey: item.publicKey !== undefined ? item.publicKey : undefined,
            counter: item.counter !== undefined ? item.counter : undefined,
          },
        }))
      } : undefined,
      alpacaAccounts: props.strategyRef.owner.alpacaAccounts ? 
        Array.isArray(props.strategyRef.owner.alpacaAccounts) && props.strategyRef.owner.alpacaAccounts.length > 0 &&  props.strategyRef.owner.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.alpacaAccounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            APIKey: item.APIKey !== undefined ? item.APIKey : undefined,
            APISecret: item.APISecret !== undefined ? item.APISecret : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? item.marketOpen : undefined,
            realTime: item.realTime !== undefined ? item.realTime : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? item.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? item.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? item.tradeAllocationPct : undefined,
            autoAllocation: item.autoAllocation !== undefined ? item.autoAllocation : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? item.minPercentageChange : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? item.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? item.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? item.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? item.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? item.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? item.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? item.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? item.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? item.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? item.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? item.minimumPriceChangePercent100 : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      linkedProviders: props.strategyRef.owner.linkedProviders ? 
        Array.isArray(props.strategyRef.owner.linkedProviders) && props.strategyRef.owner.linkedProviders.length > 0 &&  props.strategyRef.owner.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.linkedProviders.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
          },
          create: {
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            email: item.email !== undefined ? item.email : undefined,
            accessToken: item.accessToken !== undefined ? item.accessToken : undefined,
            refreshToken: item.refreshToken !== undefined ? item.refreshToken : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            linkedAt: item.linkedAt !== undefined ? item.linkedAt : undefined,
          },
        }))
      } : undefined,
      accountLinkingRequests: props.strategyRef.owner.accountLinkingRequests ? 
        Array.isArray(props.strategyRef.owner.accountLinkingRequests) && props.strategyRef.owner.accountLinkingRequests.length > 0 &&  props.strategyRef.owner.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accountLinkingRequests.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            verificationToken: item.verificationToken !== undefined ? item.verificationToken : undefined,
            userAgent: item.userAgent !== undefined ? item.userAgent : undefined,
            ipAddress: item.ipAddress !== undefined ? item.ipAddress : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            verifiedAt: item.verifiedAt !== undefined ? item.verifiedAt : undefined,
            approvedAt: item.approvedAt !== undefined ? item.approvedAt : undefined,
            rejectedAt: item.rejectedAt !== undefined ? item.rejectedAt : undefined,
          },
        }))
      } : undefined,
      reviewedWaitlistEntries: props.strategyRef.owner.reviewedWaitlistEntries ? 
        Array.isArray(props.strategyRef.owner.reviewedWaitlistEntries) && props.strategyRef.owner.reviewedWaitlistEntries.length > 0 &&  props.strategyRef.owner.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            email: item.email !== undefined ? item.email : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            fullName: item.fullName !== undefined ? item.fullName : undefined,
            companyName: item.companyName !== undefined ? item.companyName : undefined,
            companyWebsite: item.companyWebsite !== undefined ? item.companyWebsite : undefined,
            jobRole: item.jobRole !== undefined ? item.jobRole : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? item.professionalInvestorConfirmed : undefined,
            status: item.status !== undefined ? item.status : undefined,
            queuePosition: item.queuePosition !== undefined ? item.queuePosition : undefined,
            reviewedAt: item.reviewedAt !== undefined ? item.reviewedAt : undefined,
          },
        }))
      } : undefined,
      llmConfiguration: props.strategyRef.owner.llmConfiguration ? 
        typeof props.strategyRef.owner.llmConfiguration === 'object' && Object.keys(props.strategyRef.owner.llmConfiguration).length === 1 && Object.keys(props.strategyRef.owner.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.llmConfiguration.id !== undefined ? props.strategyRef.owner.llmConfiguration.id : undefined,
            userId: props.strategyRef.owner.llmConfiguration.userId !== undefined ? props.strategyRef.owner.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? props.strategyRef.owner.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? props.strategyRef.owner.llmConfiguration.miniProvider : undefined,
            normalProvider: props.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? props.strategyRef.owner.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? props.strategyRef.owner.llmConfiguration.advancedProvider : undefined,
            miniModel: props.strategyRef.owner.llmConfiguration.miniModel !== undefined ? props.strategyRef.owner.llmConfiguration.miniModel : undefined,
            normalModel: props.strategyRef.owner.llmConfiguration.normalModel !== undefined ? props.strategyRef.owner.llmConfiguration.normalModel : undefined,
            advancedModel: props.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? props.strategyRef.owner.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.strategyRef.owner.orgMemberships ? 
        Array.isArray(props.strategyRef.owner.orgMemberships) && props.strategyRef.owner.orgMemberships.length > 0 &&  props.strategyRef.owner.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.orgMemberships.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      fundAssignments: props.strategyRef.owner.fundAssignments ? 
        Array.isArray(props.strategyRef.owner.fundAssignments) && props.strategyRef.owner.fundAssignments.length > 0 &&  props.strategyRef.owner.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.fundAssignments.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      managedFunds: props.strategyRef.owner.managedFunds ? 
        Array.isArray(props.strategyRef.owner.managedFunds) && props.strategyRef.owner.managedFunds.length > 0 &&  props.strategyRef.owner.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.managedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      operatedFunds: props.strategyRef.owner.operatedFunds ? 
        Array.isArray(props.strategyRef.owner.operatedFunds) && props.strategyRef.owner.operatedFunds.length > 0 &&  props.strategyRef.owner.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.operatedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      ownedMandates: props.strategyRef.owner.ownedMandates ? 
        Array.isArray(props.strategyRef.owner.ownedMandates) && props.strategyRef.owner.ownedMandates.length > 0 &&  props.strategyRef.owner.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.ownedMandates.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            activeVersionId: item.activeVersionId !== undefined ? item.activeVersionId : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            scopeKind: item.scopeKind !== undefined ? item.scopeKind : undefined,
            klass: item.klass !== undefined ? item.klass : undefined,
            name: item.name !== undefined ? item.name : undefined,
            personaScope: item.personaScope !== undefined ? item.personaScope : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      authoredMandateVersions: props.strategyRef.owner.authoredMandateVersions ? 
        Array.isArray(props.strategyRef.owner.authoredMandateVersions) && props.strategyRef.owner.authoredMandateVersions.length > 0 &&  props.strategyRef.owner.authoredMandateVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authoredMandateVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authoredMandateVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateId: item.mandateId !== undefined ? {
                equals: item.mandateId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            versionLabel: item.versionLabel !== undefined ? item.versionLabel : undefined,
            versionSeq: item.versionSeq !== undefined ? item.versionSeq : undefined,
            status: item.status !== undefined ? item.status : undefined,
            summary: item.summary !== undefined ? item.summary : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
        }))
      } : undefined,
      mandateApprovalsDecided: props.strategyRef.owner.mandateApprovalsDecided ? 
        Array.isArray(props.strategyRef.owner.mandateApprovalsDecided) && props.strategyRef.owner.mandateApprovalsDecided.length > 0 &&  props.strategyRef.owner.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateVersionId: item.mandateVersionId !== undefined ? {
                equals: item.mandateVersionId 
               } : undefined,
            correlationId: item.correlationId !== undefined ? {
                equals: item.correlationId 
               } : undefined,
          },
          create: {
            action: item.action !== undefined ? item.action : undefined,
            decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
            rationale: item.rationale !== undefined ? item.rationale : undefined,
            correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
          },
        }))
      } : undefined,
      investorProfiles: props.strategyRef.owner.investorProfiles ? 
        Array.isArray(props.strategyRef.owner.investorProfiles) && props.strategyRef.owner.investorProfiles.length > 0 &&  props.strategyRef.owner.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.investorProfiles.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            email: item.email !== undefined ? item.email : undefined,
            type: item.type !== undefined ? item.type : undefined,
            status: item.status !== undefined ? item.status : undefined,
            kycStatus: item.kycStatus !== undefined ? item.kycStatus : undefined,
            jurisdiction: item.jurisdiction !== undefined ? item.jurisdiction : undefined,
            joinedAt: item.joinedAt !== undefined ? item.joinedAt : undefined,
            externalRef: item.externalRef !== undefined ? item.externalRef : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      notificationDeliveries: props.strategyRef.owner.notificationDeliveries ? 
        Array.isArray(props.strategyRef.owner.notificationDeliveries) && props.strategyRef.owner.notificationDeliveries.length > 0 &&  props.strategyRef.owner.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationDeliveries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
            recipientUserId: item.recipientUserId !== undefined ? {
                equals: item.recipientUserId 
               } : undefined,
            templateId: item.templateId !== undefined ? {
                equals: item.templateId 
               } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                equals: item.providerMessageId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            channel: item.channel !== undefined ? item.channel : undefined,
            templateId: item.templateId !== undefined ? item.templateId : undefined,
            templateVersion: item.templateVersion !== undefined ? item.templateVersion : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerMessageId: item.providerMessageId !== undefined ? item.providerMessageId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            statusDetail: item.statusDetail !== undefined ? item.statusDetail : undefined,
            sentAt: item.sentAt !== undefined ? item.sentAt : undefined,
            deliveredAt: item.deliveredAt !== undefined ? item.deliveredAt : undefined,
            readAt: item.readAt !== undefined ? item.readAt : undefined,
          },
        }))
      } : undefined,
      notificationPreferences: props.strategyRef.owner.notificationPreferences ? 
        Array.isArray(props.strategyRef.owner.notificationPreferences) && props.strategyRef.owner.notificationPreferences.length > 0 &&  props.strategyRef.owner.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationPreferences.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
          },
          create: {
            eventId: item.eventId !== undefined ? item.eventId : undefined,
            channel: item.channel !== undefined ? item.channel : undefined,
            enabled: item.enabled !== undefined ? item.enabled : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    subscriptions: props.strategyRef.subscriptions ? 
    Array.isArray(props.strategyRef.subscriptions) && props.strategyRef.subscriptions.length > 0 && props.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.strategyRef.subscriptions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.strategyRef.subscriptions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          accountId: item.accountId !== undefined ? {
              equals: item.accountId
            } : undefined,
          strategyId: item.strategyId !== undefined ? {
              equals: item.strategyId
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          units: item.units !== undefined ? {
              set: item.units
            } : undefined,
          costBasis: item.costBasis !== undefined ? {
              set: item.costBasis
            } : undefined,
          realizedPL: item.realizedPL !== undefined ? {
              set: item.realizedPL
            } : undefined,
          targetAllocationPct: item.targetAllocationPct !== undefined ? {
              set: item.targetAllocationPct
            } : undefined,
          currency: item.currency !== undefined ? {
              set: item.currency
            } : undefined,
          subscribedAt: item.subscribedAt !== undefined ? {
              set: item.subscribedAt
            } : undefined,
          lastRebalancedAt: item.lastRebalancedAt !== undefined ? {
              set: item.lastRebalancedAt
            } : undefined,
          deletedAt: item.deletedAt !== undefined ? {
              set: item.deletedAt
            } : undefined,
      account: item.account ? 
      typeof item.account === 'object' && Object.keys(item.account).length === 1 && (Object.keys(item.account)[0] === 'id' || Object.keys(item.account)[0] === 'symbol')
? {
      connect: {
        id: item.account.id
      }
} : { upsert: {
          where: {
            id: item.account.id !== undefined ? {
                equals: item.account.id
              } : undefined,
            type: item.account.type !== undefined ? {
                equals: item.account.type
              } : undefined,
            userId: item.account.userId !== undefined ? {
                equals: item.account.userId
              } : undefined,
          },
          update: {
            id: item.account.id !== undefined ? {
                set: item.account.id
              } : undefined,
            type: item.account.type !== undefined ? {
                set: item.account.type
              } : undefined,
            APIKey: item.account.APIKey !== undefined ? {
                set: item.account.APIKey
              } : undefined,
            APISecret: item.account.APISecret !== undefined ? {
                set: item.account.APISecret
              } : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? {
                set: item.account.marketOpen
              } : undefined,
            realTime: item.account.realTime !== undefined ? {
                set: item.account.realTime
              } : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? {
                set: item.account.cryptoTradingEnabled
              } : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs
              } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? {
                set: item.account.cryptoTradeAllocationPct
              } : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? {
                set: item.account.tradeAllocationPct
              } : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? {
                set: item.account.autoAllocation
              } : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? {
                set: item.account.minPercentageChange
              } : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? {
                set: item.account.volumeThreshold
              } : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? {
                set: item.account.enablePortfolioTrailingStop
              } : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? {
                set: item.account.portfolioTrailPercent
              } : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? {
                set: item.account.portfolioProfitThresholdPercent
              } : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? {
                set: item.account.reducedPortfolioTrailPercent
              } : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? {
                set: item.account.defaultTrailingStopPercentage100
              } : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? {
                set: item.account.firstTrailReductionThreshold100
              } : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? {
                set: item.account.secondTrailReductionThreshold100
              } : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? {
                set: item.account.firstReducedTrailPercentage100
              } : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? {
                set: item.account.secondReducedTrailPercentage100
              } : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? {
                set: item.account.minimumPriceChangePercent100
              } : undefined,
            deletedAt: item.account.deletedAt !== undefined ? {
                set: item.account.deletedAt
              } : undefined,
          },
          create: {
            type: item.account.type !== undefined ? item.account.type : undefined,
            APIKey: item.account.APIKey !== undefined ? item.account.APIKey : undefined,
            APISecret: item.account.APISecret !== undefined ? item.account.APISecret : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? item.account.marketOpen : undefined,
            realTime: item.account.realTime !== undefined ? item.account.realTime : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? item.account.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? item.account.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? item.account.tradeAllocationPct : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? item.account.autoAllocation : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? item.account.minPercentageChange : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? item.account.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? item.account.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? item.account.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? item.account.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? item.account.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? item.account.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? item.account.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? item.account.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? item.account.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? item.account.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? item.account.minimumPriceChangePercent100 : undefined,
            deletedAt: item.account.deletedAt !== undefined ? item.account.deletedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          status: item.status !== undefined ? item.status : undefined,
          units: item.units !== undefined ? item.units : undefined,
          costBasis: item.costBasis !== undefined ? item.costBasis : undefined,
          realizedPL: item.realizedPL !== undefined ? item.realizedPL : undefined,
          targetAllocationPct: item.targetAllocationPct !== undefined ? item.targetAllocationPct : undefined,
          currency: item.currency !== undefined ? item.currency : undefined,
          subscribedAt: item.subscribedAt !== undefined ? item.subscribedAt : undefined,
          lastRebalancedAt: item.lastRebalancedAt !== undefined ? item.lastRebalancedAt : undefined,
          deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
      account: item.account ? 
        typeof item.account === 'object' && Object.keys(item.account).length === 1 && Object.keys(item.account)[0] === 'id'
    ? { connect: {
            id: item.account.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.account.id !== undefined ? item.account.id : undefined,
            type: item.account.type !== undefined ? {
                equals: item.account.type 
               } : undefined,
            userId: item.account.userId !== undefined ? {
                equals: item.account.userId 
               } : undefined,
          },
          create: {
            type: item.account.type !== undefined ? item.account.type : undefined,
            APIKey: item.account.APIKey !== undefined ? item.account.APIKey : undefined,
            APISecret: item.account.APISecret !== undefined ? item.account.APISecret : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? item.account.marketOpen : undefined,
            realTime: item.account.realTime !== undefined ? item.account.realTime : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? item.account.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? item.account.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? item.account.tradeAllocationPct : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? item.account.autoAllocation : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? item.account.minPercentageChange : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? item.account.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? item.account.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? item.account.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? item.account.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? item.account.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? item.account.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? item.account.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? item.account.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? item.account.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? item.account.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? item.account.minimumPriceChangePercent100 : undefined,
            deletedAt: item.account.deletedAt !== undefined ? item.account.deletedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        key: props.strategyRef.key !== undefined ? props.strategyRef.key : undefined,
        displayName: props.strategyRef.displayName !== undefined ? props.strategyRef.displayName : undefined,
        description: props.strategyRef.description !== undefined ? props.strategyRef.description : undefined,
        origin: props.strategyRef.origin !== undefined ? props.strategyRef.origin : undefined,
        lifecycleState: props.strategyRef.lifecycleState !== undefined ? props.strategyRef.lifecycleState : undefined,
        manifestHash: props.strategyRef.manifestHash !== undefined ? props.strategyRef.manifestHash : undefined,
        deletedAt: props.strategyRef.deletedAt !== undefined ? props.strategyRef.deletedAt : undefined,
    owner: props.strategyRef.owner ? 
      typeof props.strategyRef.owner === 'object' && Object.keys(props.strategyRef.owner).length === 1 && Object.keys(props.strategyRef.owner)[0] === 'id'
    ? { connect: {
          id: props.strategyRef.owner.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.strategyRef.owner.id !== undefined ? props.strategyRef.owner.id : undefined,
          email: props.strategyRef.owner.email !== undefined ? props.strategyRef.owner.email : undefined,
          name: props.strategyRef.owner.name !== undefined ? {
              equals: props.strategyRef.owner.name 
             } : undefined,
        },
        create: {
          name: props.strategyRef.owner.name !== undefined ? props.strategyRef.owner.name : undefined,
          email: props.strategyRef.owner.email !== undefined ? props.strategyRef.owner.email : undefined,
          emailVerified: props.strategyRef.owner.emailVerified !== undefined ? props.strategyRef.owner.emailVerified : undefined,
          image: props.strategyRef.owner.image !== undefined ? props.strategyRef.owner.image : undefined,
          avatarUrl: props.strategyRef.owner.avatarUrl !== undefined ? props.strategyRef.owner.avatarUrl : undefined,
          onboardingComplete: props.strategyRef.owner.onboardingComplete !== undefined ? props.strategyRef.owner.onboardingComplete : undefined,
          signupCategory: props.strategyRef.owner.signupCategory !== undefined ? props.strategyRef.owner.signupCategory : undefined,
          deletedAt: props.strategyRef.owner.deletedAt !== undefined ? props.strategyRef.owner.deletedAt : undefined,
          role: props.strategyRef.owner.role !== undefined ? props.strategyRef.owner.role : undefined,
          bio: props.strategyRef.owner.bio !== undefined ? props.strategyRef.owner.bio : undefined,
          jobTitle: props.strategyRef.owner.jobTitle !== undefined ? props.strategyRef.owner.jobTitle : undefined,
          currentAccount: props.strategyRef.owner.currentAccount !== undefined ? props.strategyRef.owner.currentAccount : undefined,
          plan: props.strategyRef.owner.plan !== undefined ? props.strategyRef.owner.plan : undefined,
          openaiAPIKey: props.strategyRef.owner.openaiAPIKey !== undefined ? props.strategyRef.owner.openaiAPIKey : undefined,
          openaiModel: props.strategyRef.owner.openaiModel !== undefined ? props.strategyRef.owner.openaiModel : undefined,
      customer: props.strategyRef.owner.customer ? 
        typeof props.strategyRef.owner.customer === 'object' && Object.keys(props.strategyRef.owner.customer).length === 1 && Object.keys(props.strategyRef.owner.customer)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.customer.id !== undefined ? props.strategyRef.owner.customer.id : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? {
                equals: props.strategyRef.owner.customer.authUserId 
               } : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? {
                equals: props.strategyRef.owner.customer.name 
               } : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? props.strategyRef.owner.customer.authUserId : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? props.strategyRef.owner.customer.name : undefined,
            plan: props.strategyRef.owner.customer.plan !== undefined ? props.strategyRef.owner.customer.plan : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? props.strategyRef.owner.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? props.strategyRef.owner.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.strategyRef.owner.customer.jurisdiction !== undefined ? props.strategyRef.owner.customer.jurisdiction : undefined,
            riskProfile: props.strategyRef.owner.customer.riskProfile !== undefined ? props.strategyRef.owner.customer.riskProfile : undefined,
            amlStatus: props.strategyRef.owner.customer.amlStatus !== undefined ? props.strategyRef.owner.customer.amlStatus : undefined,
            lastKycUpdate: props.strategyRef.owner.customer.lastKycUpdate !== undefined ? props.strategyRef.owner.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.strategyRef.owner.accounts ? 
        Array.isArray(props.strategyRef.owner.accounts) && props.strategyRef.owner.accounts.length > 0 &&  props.strategyRef.owner.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            refresh_token: item.refresh_token !== undefined ? item.refresh_token : undefined,
            access_token: item.access_token !== undefined ? item.access_token : undefined,
            expires_at: item.expires_at !== undefined ? item.expires_at : undefined,
            token_type: item.token_type !== undefined ? item.token_type : undefined,
            scope: item.scope !== undefined ? item.scope : undefined,
            id_token: item.id_token !== undefined ? item.id_token : undefined,
            session_state: item.session_state !== undefined ? item.session_state : undefined,
          },
        }))
      } : undefined,
      sessions: props.strategyRef.owner.sessions ? 
        Array.isArray(props.strategyRef.owner.sessions) && props.strategyRef.owner.sessions.length > 0 &&  props.strategyRef.owner.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.sessions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            sessionToken: item.sessionToken !== undefined ? item.sessionToken : undefined,
            expires: item.expires !== undefined ? item.expires : undefined,
          },
        }))
      } : undefined,
      authenticators: props.strategyRef.owner.authenticators ? 
        Array.isArray(props.strategyRef.owner.authenticators) && props.strategyRef.owner.authenticators.length > 0 &&  props.strategyRef.owner.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authenticators.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            credentialID: item.credentialID !== undefined ? item.credentialID : undefined,
            publicKey: item.publicKey !== undefined ? item.publicKey : undefined,
            counter: item.counter !== undefined ? item.counter : undefined,
          },
        }))
      } : undefined,
      alpacaAccounts: props.strategyRef.owner.alpacaAccounts ? 
        Array.isArray(props.strategyRef.owner.alpacaAccounts) && props.strategyRef.owner.alpacaAccounts.length > 0 &&  props.strategyRef.owner.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.alpacaAccounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            APIKey: item.APIKey !== undefined ? item.APIKey : undefined,
            APISecret: item.APISecret !== undefined ? item.APISecret : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? item.marketOpen : undefined,
            realTime: item.realTime !== undefined ? item.realTime : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? item.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? item.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? item.tradeAllocationPct : undefined,
            autoAllocation: item.autoAllocation !== undefined ? item.autoAllocation : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? item.minPercentageChange : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? item.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? item.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? item.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? item.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? item.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? item.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? item.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? item.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? item.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? item.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? item.minimumPriceChangePercent100 : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      linkedProviders: props.strategyRef.owner.linkedProviders ? 
        Array.isArray(props.strategyRef.owner.linkedProviders) && props.strategyRef.owner.linkedProviders.length > 0 &&  props.strategyRef.owner.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.linkedProviders.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
          },
          create: {
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            email: item.email !== undefined ? item.email : undefined,
            accessToken: item.accessToken !== undefined ? item.accessToken : undefined,
            refreshToken: item.refreshToken !== undefined ? item.refreshToken : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            linkedAt: item.linkedAt !== undefined ? item.linkedAt : undefined,
          },
        }))
      } : undefined,
      accountLinkingRequests: props.strategyRef.owner.accountLinkingRequests ? 
        Array.isArray(props.strategyRef.owner.accountLinkingRequests) && props.strategyRef.owner.accountLinkingRequests.length > 0 &&  props.strategyRef.owner.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accountLinkingRequests.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            verificationToken: item.verificationToken !== undefined ? item.verificationToken : undefined,
            userAgent: item.userAgent !== undefined ? item.userAgent : undefined,
            ipAddress: item.ipAddress !== undefined ? item.ipAddress : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            verifiedAt: item.verifiedAt !== undefined ? item.verifiedAt : undefined,
            approvedAt: item.approvedAt !== undefined ? item.approvedAt : undefined,
            rejectedAt: item.rejectedAt !== undefined ? item.rejectedAt : undefined,
          },
        }))
      } : undefined,
      reviewedWaitlistEntries: props.strategyRef.owner.reviewedWaitlistEntries ? 
        Array.isArray(props.strategyRef.owner.reviewedWaitlistEntries) && props.strategyRef.owner.reviewedWaitlistEntries.length > 0 &&  props.strategyRef.owner.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            email: item.email !== undefined ? item.email : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            fullName: item.fullName !== undefined ? item.fullName : undefined,
            companyName: item.companyName !== undefined ? item.companyName : undefined,
            companyWebsite: item.companyWebsite !== undefined ? item.companyWebsite : undefined,
            jobRole: item.jobRole !== undefined ? item.jobRole : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? item.professionalInvestorConfirmed : undefined,
            status: item.status !== undefined ? item.status : undefined,
            queuePosition: item.queuePosition !== undefined ? item.queuePosition : undefined,
            reviewedAt: item.reviewedAt !== undefined ? item.reviewedAt : undefined,
          },
        }))
      } : undefined,
      llmConfiguration: props.strategyRef.owner.llmConfiguration ? 
        typeof props.strategyRef.owner.llmConfiguration === 'object' && Object.keys(props.strategyRef.owner.llmConfiguration).length === 1 && Object.keys(props.strategyRef.owner.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.llmConfiguration.id !== undefined ? props.strategyRef.owner.llmConfiguration.id : undefined,
            userId: props.strategyRef.owner.llmConfiguration.userId !== undefined ? props.strategyRef.owner.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? props.strategyRef.owner.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? props.strategyRef.owner.llmConfiguration.miniProvider : undefined,
            normalProvider: props.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? props.strategyRef.owner.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? props.strategyRef.owner.llmConfiguration.advancedProvider : undefined,
            miniModel: props.strategyRef.owner.llmConfiguration.miniModel !== undefined ? props.strategyRef.owner.llmConfiguration.miniModel : undefined,
            normalModel: props.strategyRef.owner.llmConfiguration.normalModel !== undefined ? props.strategyRef.owner.llmConfiguration.normalModel : undefined,
            advancedModel: props.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? props.strategyRef.owner.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.strategyRef.owner.orgMemberships ? 
        Array.isArray(props.strategyRef.owner.orgMemberships) && props.strategyRef.owner.orgMemberships.length > 0 &&  props.strategyRef.owner.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.orgMemberships.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      fundAssignments: props.strategyRef.owner.fundAssignments ? 
        Array.isArray(props.strategyRef.owner.fundAssignments) && props.strategyRef.owner.fundAssignments.length > 0 &&  props.strategyRef.owner.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.fundAssignments.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      managedFunds: props.strategyRef.owner.managedFunds ? 
        Array.isArray(props.strategyRef.owner.managedFunds) && props.strategyRef.owner.managedFunds.length > 0 &&  props.strategyRef.owner.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.managedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      operatedFunds: props.strategyRef.owner.operatedFunds ? 
        Array.isArray(props.strategyRef.owner.operatedFunds) && props.strategyRef.owner.operatedFunds.length > 0 &&  props.strategyRef.owner.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.operatedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      ownedMandates: props.strategyRef.owner.ownedMandates ? 
        Array.isArray(props.strategyRef.owner.ownedMandates) && props.strategyRef.owner.ownedMandates.length > 0 &&  props.strategyRef.owner.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.ownedMandates.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            activeVersionId: item.activeVersionId !== undefined ? item.activeVersionId : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            scopeKind: item.scopeKind !== undefined ? item.scopeKind : undefined,
            klass: item.klass !== undefined ? item.klass : undefined,
            name: item.name !== undefined ? item.name : undefined,
            personaScope: item.personaScope !== undefined ? item.personaScope : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      authoredMandateVersions: props.strategyRef.owner.authoredMandateVersions ? 
        Array.isArray(props.strategyRef.owner.authoredMandateVersions) && props.strategyRef.owner.authoredMandateVersions.length > 0 &&  props.strategyRef.owner.authoredMandateVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authoredMandateVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authoredMandateVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateId: item.mandateId !== undefined ? {
                equals: item.mandateId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            versionLabel: item.versionLabel !== undefined ? item.versionLabel : undefined,
            versionSeq: item.versionSeq !== undefined ? item.versionSeq : undefined,
            status: item.status !== undefined ? item.status : undefined,
            summary: item.summary !== undefined ? item.summary : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
        }))
      } : undefined,
      mandateApprovalsDecided: props.strategyRef.owner.mandateApprovalsDecided ? 
        Array.isArray(props.strategyRef.owner.mandateApprovalsDecided) && props.strategyRef.owner.mandateApprovalsDecided.length > 0 &&  props.strategyRef.owner.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateVersionId: item.mandateVersionId !== undefined ? {
                equals: item.mandateVersionId 
               } : undefined,
            correlationId: item.correlationId !== undefined ? {
                equals: item.correlationId 
               } : undefined,
          },
          create: {
            action: item.action !== undefined ? item.action : undefined,
            decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
            rationale: item.rationale !== undefined ? item.rationale : undefined,
            correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
          },
        }))
      } : undefined,
      investorProfiles: props.strategyRef.owner.investorProfiles ? 
        Array.isArray(props.strategyRef.owner.investorProfiles) && props.strategyRef.owner.investorProfiles.length > 0 &&  props.strategyRef.owner.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.investorProfiles.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            email: item.email !== undefined ? item.email : undefined,
            type: item.type !== undefined ? item.type : undefined,
            status: item.status !== undefined ? item.status : undefined,
            kycStatus: item.kycStatus !== undefined ? item.kycStatus : undefined,
            jurisdiction: item.jurisdiction !== undefined ? item.jurisdiction : undefined,
            joinedAt: item.joinedAt !== undefined ? item.joinedAt : undefined,
            externalRef: item.externalRef !== undefined ? item.externalRef : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      notificationDeliveries: props.strategyRef.owner.notificationDeliveries ? 
        Array.isArray(props.strategyRef.owner.notificationDeliveries) && props.strategyRef.owner.notificationDeliveries.length > 0 &&  props.strategyRef.owner.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationDeliveries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
            recipientUserId: item.recipientUserId !== undefined ? {
                equals: item.recipientUserId 
               } : undefined,
            templateId: item.templateId !== undefined ? {
                equals: item.templateId 
               } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                equals: item.providerMessageId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            channel: item.channel !== undefined ? item.channel : undefined,
            templateId: item.templateId !== undefined ? item.templateId : undefined,
            templateVersion: item.templateVersion !== undefined ? item.templateVersion : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerMessageId: item.providerMessageId !== undefined ? item.providerMessageId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            statusDetail: item.statusDetail !== undefined ? item.statusDetail : undefined,
            sentAt: item.sentAt !== undefined ? item.sentAt : undefined,
            deliveredAt: item.deliveredAt !== undefined ? item.deliveredAt : undefined,
            readAt: item.readAt !== undefined ? item.readAt : undefined,
          },
        }))
      } : undefined,
      notificationPreferences: props.strategyRef.owner.notificationPreferences ? 
        Array.isArray(props.strategyRef.owner.notificationPreferences) && props.strategyRef.owner.notificationPreferences.length > 0 &&  props.strategyRef.owner.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationPreferences.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
          },
          create: {
            eventId: item.eventId !== undefined ? item.eventId : undefined,
            channel: item.channel !== undefined ? item.channel : undefined,
            enabled: item.enabled !== undefined ? item.enabled : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    subscriptions: props.strategyRef.subscriptions ? 
      Array.isArray(props.strategyRef.subscriptions) && props.strategyRef.subscriptions.length > 0 &&  props.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.strategyRef.subscriptions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.strategyRef.subscriptions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          accountId: item.accountId !== undefined ? {
              equals: item.accountId 
             } : undefined,
          strategyId: item.strategyId !== undefined ? {
              equals: item.strategyId 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          status: item.status !== undefined ? item.status : undefined,
          units: item.units !== undefined ? item.units : undefined,
          costBasis: item.costBasis !== undefined ? item.costBasis : undefined,
          realizedPL: item.realizedPL !== undefined ? item.realizedPL : undefined,
          targetAllocationPct: item.targetAllocationPct !== undefined ? item.targetAllocationPct : undefined,
          currency: item.currency !== undefined ? item.currency : undefined,
          subscribedAt: item.subscribedAt !== undefined ? item.subscribedAt : undefined,
          lastRebalancedAt: item.lastRebalancedAt !== undefined ? item.lastRebalancedAt : undefined,
          deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
      account: item.account ? 
        typeof item.account === 'object' && Object.keys(item.account).length === 1 && Object.keys(item.account)[0] === 'id'
    ? { connect: {
            id: item.account.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.account.id !== undefined ? item.account.id : undefined,
            type: item.account.type !== undefined ? {
                equals: item.account.type 
               } : undefined,
            userId: item.account.userId !== undefined ? {
                equals: item.account.userId 
               } : undefined,
          },
          create: {
            type: item.account.type !== undefined ? item.account.type : undefined,
            APIKey: item.account.APIKey !== undefined ? item.account.APIKey : undefined,
            APISecret: item.account.APISecret !== undefined ? item.account.APISecret : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? item.account.marketOpen : undefined,
            realTime: item.account.realTime !== undefined ? item.account.realTime : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? item.account.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? item.account.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? item.account.tradeAllocationPct : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? item.account.autoAllocation : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? item.account.minPercentageChange : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? item.account.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? item.account.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? item.account.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? item.account.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? item.account.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? item.account.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? item.account.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? item.account.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? item.account.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? item.account.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? item.account.minimumPriceChangePercent100 : undefined,
            deletedAt: item.account.deletedAt !== undefined ? item.account.deletedAt : undefined,
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
          mutation: UPDATE_ONE_TRADE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneTrade) {
          return response.data.updateOneTrade;
        } else {
          return null as unknown as TradeType;
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
          logger.error("Non-retryable constraint violation in updateOneTrade", {
            operation: 'updateOneTrade',
            model: 'Trade',
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
          logger.warn("Database connection error in updateOneTrade, retrying...", {
            operation: 'updateOneTrade',
            model: 'Trade',
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
            operation: 'updateOneTrade',
            model: 'Trade',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneTrade',
            model: 'Trade',
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
   * Upsert a single Trade record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated Trade or null.
   */
  async upsert(props: TradeType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<TradeType> {
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

        const UPSERT_ONE_TRADE = gql`
          mutation upsertOneTrade($where: TradeWhereUniqueInput!, $create: TradeCreateInput!, $update: TradeUpdateInput!) {
            upsertOneTrade(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  alpacaAccountId: props.alpacaAccountId !== undefined ? {
    equals: props.alpacaAccountId 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
  signalId: props.signalId !== undefined ? {
    equals: props.signalId 
  } : undefined,
      },
          create: {
        alpacaAccountId: props.alpacaAccountId !== undefined ? props.alpacaAccountId : undefined,
  signal: props.signal !== undefined ? props.signal : undefined,
  strategy: props.strategy !== undefined ? props.strategy : undefined,
  analysis: props.analysis !== undefined ? props.analysis : undefined,
  summary: props.summary !== undefined ? props.summary : undefined,
  confidence: props.confidence !== undefined ? props.confidence : undefined,
  timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  status: props.status !== undefined ? props.status : undefined,
  deletedAt: props.deletedAt !== undefined ? props.deletedAt : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  side: props.side !== undefined ? props.side : undefined,
  entryPrice: props.entryPrice !== undefined ? props.entryPrice : undefined,
  exitPrice: props.exitPrice !== undefined ? props.exitPrice : undefined,
  entryQty: props.entryQty !== undefined ? props.entryQty : undefined,
  exitQty: props.exitQty !== undefined ? props.exitQty : undefined,
  entryValue: props.entryValue !== undefined ? props.entryValue : undefined,
  exitValue: props.exitValue !== undefined ? props.exitValue : undefined,
  entryTime: props.entryTime !== undefined ? props.entryTime : undefined,
  exitTime: props.exitTime !== undefined ? props.exitTime : undefined,
  pnlAmount: props.pnlAmount !== undefined ? props.pnlAmount : undefined,
  pnlPercent: props.pnlPercent !== undefined ? props.pnlPercent : undefined,
  durationMinutes: props.durationMinutes !== undefined ? props.durationMinutes : undefined,
  marketPhase: props.marketPhase !== undefined ? props.marketPhase : undefined,
  marketVolatility: props.marketVolatility !== undefined ? props.marketVolatility : undefined,
  sessionHorizonMinutes: props.sessionHorizonMinutes !== undefined ? props.sessionHorizonMinutes : undefined,
  thresholdsJson: props.thresholdsJson !== undefined ? props.thresholdsJson : undefined,
  thesisVersion: props.thesisVersion !== undefined ? props.thesisVersion : undefined,
  lastReunderwrittenAt: props.lastReunderwrittenAt !== undefined ? props.lastReunderwrittenAt : undefined,
  supersededById: props.supersededById !== undefined ? props.supersededById : undefined,
  rejectionMetadata: props.rejectionMetadata !== undefined ? props.rejectionMetadata : undefined,
  signalSource: props.signalSource !== undefined ? props.signalSource : undefined,
  signalSourceType: props.signalSourceType !== undefined ? props.signalSourceType : undefined,
  signalId: props.signalId !== undefined ? props.signalId : undefined,
  pathway: props.pathway !== undefined ? props.pathway : undefined,
  pathwayType: props.pathwayType !== undefined ? props.pathwayType : undefined,
  exitTier: props.exitTier !== undefined ? props.exitTier : undefined,
  exitTierType: props.exitTierType !== undefined ? props.exitTierType : undefined,
  actions: props.actions ? 
    Array.isArray(props.actions) && props.actions.length > 0 &&  props.actions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.actions.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.actions.map((item) => ({
      where: {
        id: item.id !== undefined ? item.id : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? item.alpacaOrderId : undefined,
        tradeId: item.tradeId !== undefined ? {
            equals: item.tradeId 
           } : undefined,
        type: item.type !== undefined ? {
            equals: item.type 
           } : undefined,
        status: item.status !== undefined ? {
            equals: item.status 
           } : undefined,
      },
      create: {
        sequence: item.sequence !== undefined ? item.sequence : undefined,
        type: item.type !== undefined ? item.type : undefined,
        primary: item.primary !== undefined ? item.primary : undefined,
        note: item.note !== undefined ? item.note : undefined,
        status: item.status !== undefined ? item.status : undefined,
        deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? item.alpacaOrderId : undefined,
        supersededActionId: item.supersededActionId !== undefined ? item.supersededActionId : undefined,
        triggerSource: item.triggerSource !== undefined ? item.triggerSource : undefined,
        triggerSourceType: item.triggerSourceType !== undefined ? item.triggerSourceType : undefined,
      },
    }))
  } : undefined,
  strategyRef: props.strategyRef ? 
    typeof props.strategyRef === 'object' && Object.keys(props.strategyRef).length === 1 && Object.keys(props.strategyRef)[0] === 'id'
    ? { connect: {
        id: props.strategyRef.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.strategyRef.id !== undefined ? props.strategyRef.id : undefined,
        key: props.strategyRef.key !== undefined ? props.strategyRef.key : undefined,
      },
      create: {
        key: props.strategyRef.key !== undefined ? props.strategyRef.key : undefined,
        displayName: props.strategyRef.displayName !== undefined ? props.strategyRef.displayName : undefined,
        description: props.strategyRef.description !== undefined ? props.strategyRef.description : undefined,
        origin: props.strategyRef.origin !== undefined ? props.strategyRef.origin : undefined,
        lifecycleState: props.strategyRef.lifecycleState !== undefined ? props.strategyRef.lifecycleState : undefined,
        manifestHash: props.strategyRef.manifestHash !== undefined ? props.strategyRef.manifestHash : undefined,
        deletedAt: props.strategyRef.deletedAt !== undefined ? props.strategyRef.deletedAt : undefined,
    owner: props.strategyRef.owner ? 
      typeof props.strategyRef.owner === 'object' && Object.keys(props.strategyRef.owner).length === 1 && Object.keys(props.strategyRef.owner)[0] === 'id'
    ? { connect: {
          id: props.strategyRef.owner.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.strategyRef.owner.id !== undefined ? props.strategyRef.owner.id : undefined,
          email: props.strategyRef.owner.email !== undefined ? props.strategyRef.owner.email : undefined,
          name: props.strategyRef.owner.name !== undefined ? {
              equals: props.strategyRef.owner.name 
             } : undefined,
        },
        create: {
          name: props.strategyRef.owner.name !== undefined ? props.strategyRef.owner.name : undefined,
          email: props.strategyRef.owner.email !== undefined ? props.strategyRef.owner.email : undefined,
          emailVerified: props.strategyRef.owner.emailVerified !== undefined ? props.strategyRef.owner.emailVerified : undefined,
          image: props.strategyRef.owner.image !== undefined ? props.strategyRef.owner.image : undefined,
          avatarUrl: props.strategyRef.owner.avatarUrl !== undefined ? props.strategyRef.owner.avatarUrl : undefined,
          onboardingComplete: props.strategyRef.owner.onboardingComplete !== undefined ? props.strategyRef.owner.onboardingComplete : undefined,
          signupCategory: props.strategyRef.owner.signupCategory !== undefined ? props.strategyRef.owner.signupCategory : undefined,
          deletedAt: props.strategyRef.owner.deletedAt !== undefined ? props.strategyRef.owner.deletedAt : undefined,
          role: props.strategyRef.owner.role !== undefined ? props.strategyRef.owner.role : undefined,
          bio: props.strategyRef.owner.bio !== undefined ? props.strategyRef.owner.bio : undefined,
          jobTitle: props.strategyRef.owner.jobTitle !== undefined ? props.strategyRef.owner.jobTitle : undefined,
          currentAccount: props.strategyRef.owner.currentAccount !== undefined ? props.strategyRef.owner.currentAccount : undefined,
          plan: props.strategyRef.owner.plan !== undefined ? props.strategyRef.owner.plan : undefined,
          openaiAPIKey: props.strategyRef.owner.openaiAPIKey !== undefined ? props.strategyRef.owner.openaiAPIKey : undefined,
          openaiModel: props.strategyRef.owner.openaiModel !== undefined ? props.strategyRef.owner.openaiModel : undefined,
      customer: props.strategyRef.owner.customer ? 
        typeof props.strategyRef.owner.customer === 'object' && Object.keys(props.strategyRef.owner.customer).length === 1 && Object.keys(props.strategyRef.owner.customer)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.customer.id !== undefined ? props.strategyRef.owner.customer.id : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? {
                equals: props.strategyRef.owner.customer.authUserId 
               } : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? {
                equals: props.strategyRef.owner.customer.name 
               } : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? props.strategyRef.owner.customer.authUserId : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? props.strategyRef.owner.customer.name : undefined,
            plan: props.strategyRef.owner.customer.plan !== undefined ? props.strategyRef.owner.customer.plan : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? props.strategyRef.owner.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? props.strategyRef.owner.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.strategyRef.owner.customer.jurisdiction !== undefined ? props.strategyRef.owner.customer.jurisdiction : undefined,
            riskProfile: props.strategyRef.owner.customer.riskProfile !== undefined ? props.strategyRef.owner.customer.riskProfile : undefined,
            amlStatus: props.strategyRef.owner.customer.amlStatus !== undefined ? props.strategyRef.owner.customer.amlStatus : undefined,
            lastKycUpdate: props.strategyRef.owner.customer.lastKycUpdate !== undefined ? props.strategyRef.owner.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.strategyRef.owner.accounts ? 
        Array.isArray(props.strategyRef.owner.accounts) && props.strategyRef.owner.accounts.length > 0 &&  props.strategyRef.owner.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            refresh_token: item.refresh_token !== undefined ? item.refresh_token : undefined,
            access_token: item.access_token !== undefined ? item.access_token : undefined,
            expires_at: item.expires_at !== undefined ? item.expires_at : undefined,
            token_type: item.token_type !== undefined ? item.token_type : undefined,
            scope: item.scope !== undefined ? item.scope : undefined,
            id_token: item.id_token !== undefined ? item.id_token : undefined,
            session_state: item.session_state !== undefined ? item.session_state : undefined,
          },
        }))
      } : undefined,
      sessions: props.strategyRef.owner.sessions ? 
        Array.isArray(props.strategyRef.owner.sessions) && props.strategyRef.owner.sessions.length > 0 &&  props.strategyRef.owner.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.sessions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            sessionToken: item.sessionToken !== undefined ? item.sessionToken : undefined,
            expires: item.expires !== undefined ? item.expires : undefined,
          },
        }))
      } : undefined,
      authenticators: props.strategyRef.owner.authenticators ? 
        Array.isArray(props.strategyRef.owner.authenticators) && props.strategyRef.owner.authenticators.length > 0 &&  props.strategyRef.owner.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authenticators.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            credentialID: item.credentialID !== undefined ? item.credentialID : undefined,
            publicKey: item.publicKey !== undefined ? item.publicKey : undefined,
            counter: item.counter !== undefined ? item.counter : undefined,
          },
        }))
      } : undefined,
      alpacaAccounts: props.strategyRef.owner.alpacaAccounts ? 
        Array.isArray(props.strategyRef.owner.alpacaAccounts) && props.strategyRef.owner.alpacaAccounts.length > 0 &&  props.strategyRef.owner.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.alpacaAccounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            APIKey: item.APIKey !== undefined ? item.APIKey : undefined,
            APISecret: item.APISecret !== undefined ? item.APISecret : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? item.marketOpen : undefined,
            realTime: item.realTime !== undefined ? item.realTime : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? item.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? item.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? item.tradeAllocationPct : undefined,
            autoAllocation: item.autoAllocation !== undefined ? item.autoAllocation : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? item.minPercentageChange : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? item.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? item.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? item.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? item.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? item.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? item.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? item.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? item.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? item.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? item.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? item.minimumPriceChangePercent100 : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      linkedProviders: props.strategyRef.owner.linkedProviders ? 
        Array.isArray(props.strategyRef.owner.linkedProviders) && props.strategyRef.owner.linkedProviders.length > 0 &&  props.strategyRef.owner.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.linkedProviders.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
          },
          create: {
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            email: item.email !== undefined ? item.email : undefined,
            accessToken: item.accessToken !== undefined ? item.accessToken : undefined,
            refreshToken: item.refreshToken !== undefined ? item.refreshToken : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            linkedAt: item.linkedAt !== undefined ? item.linkedAt : undefined,
          },
        }))
      } : undefined,
      accountLinkingRequests: props.strategyRef.owner.accountLinkingRequests ? 
        Array.isArray(props.strategyRef.owner.accountLinkingRequests) && props.strategyRef.owner.accountLinkingRequests.length > 0 &&  props.strategyRef.owner.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accountLinkingRequests.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            verificationToken: item.verificationToken !== undefined ? item.verificationToken : undefined,
            userAgent: item.userAgent !== undefined ? item.userAgent : undefined,
            ipAddress: item.ipAddress !== undefined ? item.ipAddress : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            verifiedAt: item.verifiedAt !== undefined ? item.verifiedAt : undefined,
            approvedAt: item.approvedAt !== undefined ? item.approvedAt : undefined,
            rejectedAt: item.rejectedAt !== undefined ? item.rejectedAt : undefined,
          },
        }))
      } : undefined,
      reviewedWaitlistEntries: props.strategyRef.owner.reviewedWaitlistEntries ? 
        Array.isArray(props.strategyRef.owner.reviewedWaitlistEntries) && props.strategyRef.owner.reviewedWaitlistEntries.length > 0 &&  props.strategyRef.owner.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            email: item.email !== undefined ? item.email : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            fullName: item.fullName !== undefined ? item.fullName : undefined,
            companyName: item.companyName !== undefined ? item.companyName : undefined,
            companyWebsite: item.companyWebsite !== undefined ? item.companyWebsite : undefined,
            jobRole: item.jobRole !== undefined ? item.jobRole : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? item.professionalInvestorConfirmed : undefined,
            status: item.status !== undefined ? item.status : undefined,
            queuePosition: item.queuePosition !== undefined ? item.queuePosition : undefined,
            reviewedAt: item.reviewedAt !== undefined ? item.reviewedAt : undefined,
          },
        }))
      } : undefined,
      llmConfiguration: props.strategyRef.owner.llmConfiguration ? 
        typeof props.strategyRef.owner.llmConfiguration === 'object' && Object.keys(props.strategyRef.owner.llmConfiguration).length === 1 && Object.keys(props.strategyRef.owner.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.llmConfiguration.id !== undefined ? props.strategyRef.owner.llmConfiguration.id : undefined,
            userId: props.strategyRef.owner.llmConfiguration.userId !== undefined ? props.strategyRef.owner.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? props.strategyRef.owner.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? props.strategyRef.owner.llmConfiguration.miniProvider : undefined,
            normalProvider: props.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? props.strategyRef.owner.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? props.strategyRef.owner.llmConfiguration.advancedProvider : undefined,
            miniModel: props.strategyRef.owner.llmConfiguration.miniModel !== undefined ? props.strategyRef.owner.llmConfiguration.miniModel : undefined,
            normalModel: props.strategyRef.owner.llmConfiguration.normalModel !== undefined ? props.strategyRef.owner.llmConfiguration.normalModel : undefined,
            advancedModel: props.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? props.strategyRef.owner.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.strategyRef.owner.orgMemberships ? 
        Array.isArray(props.strategyRef.owner.orgMemberships) && props.strategyRef.owner.orgMemberships.length > 0 &&  props.strategyRef.owner.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.orgMemberships.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      fundAssignments: props.strategyRef.owner.fundAssignments ? 
        Array.isArray(props.strategyRef.owner.fundAssignments) && props.strategyRef.owner.fundAssignments.length > 0 &&  props.strategyRef.owner.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.fundAssignments.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      managedFunds: props.strategyRef.owner.managedFunds ? 
        Array.isArray(props.strategyRef.owner.managedFunds) && props.strategyRef.owner.managedFunds.length > 0 &&  props.strategyRef.owner.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.managedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      operatedFunds: props.strategyRef.owner.operatedFunds ? 
        Array.isArray(props.strategyRef.owner.operatedFunds) && props.strategyRef.owner.operatedFunds.length > 0 &&  props.strategyRef.owner.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.operatedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      ownedMandates: props.strategyRef.owner.ownedMandates ? 
        Array.isArray(props.strategyRef.owner.ownedMandates) && props.strategyRef.owner.ownedMandates.length > 0 &&  props.strategyRef.owner.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.ownedMandates.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            activeVersionId: item.activeVersionId !== undefined ? item.activeVersionId : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            scopeKind: item.scopeKind !== undefined ? item.scopeKind : undefined,
            klass: item.klass !== undefined ? item.klass : undefined,
            name: item.name !== undefined ? item.name : undefined,
            personaScope: item.personaScope !== undefined ? item.personaScope : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      authoredMandateVersions: props.strategyRef.owner.authoredMandateVersions ? 
        Array.isArray(props.strategyRef.owner.authoredMandateVersions) && props.strategyRef.owner.authoredMandateVersions.length > 0 &&  props.strategyRef.owner.authoredMandateVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authoredMandateVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authoredMandateVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateId: item.mandateId !== undefined ? {
                equals: item.mandateId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            versionLabel: item.versionLabel !== undefined ? item.versionLabel : undefined,
            versionSeq: item.versionSeq !== undefined ? item.versionSeq : undefined,
            status: item.status !== undefined ? item.status : undefined,
            summary: item.summary !== undefined ? item.summary : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
        }))
      } : undefined,
      mandateApprovalsDecided: props.strategyRef.owner.mandateApprovalsDecided ? 
        Array.isArray(props.strategyRef.owner.mandateApprovalsDecided) && props.strategyRef.owner.mandateApprovalsDecided.length > 0 &&  props.strategyRef.owner.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateVersionId: item.mandateVersionId !== undefined ? {
                equals: item.mandateVersionId 
               } : undefined,
            correlationId: item.correlationId !== undefined ? {
                equals: item.correlationId 
               } : undefined,
          },
          create: {
            action: item.action !== undefined ? item.action : undefined,
            decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
            rationale: item.rationale !== undefined ? item.rationale : undefined,
            correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
          },
        }))
      } : undefined,
      investorProfiles: props.strategyRef.owner.investorProfiles ? 
        Array.isArray(props.strategyRef.owner.investorProfiles) && props.strategyRef.owner.investorProfiles.length > 0 &&  props.strategyRef.owner.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.investorProfiles.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            email: item.email !== undefined ? item.email : undefined,
            type: item.type !== undefined ? item.type : undefined,
            status: item.status !== undefined ? item.status : undefined,
            kycStatus: item.kycStatus !== undefined ? item.kycStatus : undefined,
            jurisdiction: item.jurisdiction !== undefined ? item.jurisdiction : undefined,
            joinedAt: item.joinedAt !== undefined ? item.joinedAt : undefined,
            externalRef: item.externalRef !== undefined ? item.externalRef : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      notificationDeliveries: props.strategyRef.owner.notificationDeliveries ? 
        Array.isArray(props.strategyRef.owner.notificationDeliveries) && props.strategyRef.owner.notificationDeliveries.length > 0 &&  props.strategyRef.owner.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationDeliveries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
            recipientUserId: item.recipientUserId !== undefined ? {
                equals: item.recipientUserId 
               } : undefined,
            templateId: item.templateId !== undefined ? {
                equals: item.templateId 
               } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                equals: item.providerMessageId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            channel: item.channel !== undefined ? item.channel : undefined,
            templateId: item.templateId !== undefined ? item.templateId : undefined,
            templateVersion: item.templateVersion !== undefined ? item.templateVersion : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerMessageId: item.providerMessageId !== undefined ? item.providerMessageId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            statusDetail: item.statusDetail !== undefined ? item.statusDetail : undefined,
            sentAt: item.sentAt !== undefined ? item.sentAt : undefined,
            deliveredAt: item.deliveredAt !== undefined ? item.deliveredAt : undefined,
            readAt: item.readAt !== undefined ? item.readAt : undefined,
          },
        }))
      } : undefined,
      notificationPreferences: props.strategyRef.owner.notificationPreferences ? 
        Array.isArray(props.strategyRef.owner.notificationPreferences) && props.strategyRef.owner.notificationPreferences.length > 0 &&  props.strategyRef.owner.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationPreferences.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
          },
          create: {
            eventId: item.eventId !== undefined ? item.eventId : undefined,
            channel: item.channel !== undefined ? item.channel : undefined,
            enabled: item.enabled !== undefined ? item.enabled : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    subscriptions: props.strategyRef.subscriptions ? 
      Array.isArray(props.strategyRef.subscriptions) && props.strategyRef.subscriptions.length > 0 &&  props.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.strategyRef.subscriptions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.strategyRef.subscriptions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          accountId: item.accountId !== undefined ? {
              equals: item.accountId 
             } : undefined,
          strategyId: item.strategyId !== undefined ? {
              equals: item.strategyId 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          status: item.status !== undefined ? item.status : undefined,
          units: item.units !== undefined ? item.units : undefined,
          costBasis: item.costBasis !== undefined ? item.costBasis : undefined,
          realizedPL: item.realizedPL !== undefined ? item.realizedPL : undefined,
          targetAllocationPct: item.targetAllocationPct !== undefined ? item.targetAllocationPct : undefined,
          currency: item.currency !== undefined ? item.currency : undefined,
          subscribedAt: item.subscribedAt !== undefined ? item.subscribedAt : undefined,
          lastRebalancedAt: item.lastRebalancedAt !== undefined ? item.lastRebalancedAt : undefined,
          deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
      account: item.account ? 
        typeof item.account === 'object' && Object.keys(item.account).length === 1 && Object.keys(item.account)[0] === 'id'
    ? { connect: {
            id: item.account.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.account.id !== undefined ? item.account.id : undefined,
            type: item.account.type !== undefined ? {
                equals: item.account.type 
               } : undefined,
            userId: item.account.userId !== undefined ? {
                equals: item.account.userId 
               } : undefined,
          },
          create: {
            type: item.account.type !== undefined ? item.account.type : undefined,
            APIKey: item.account.APIKey !== undefined ? item.account.APIKey : undefined,
            APISecret: item.account.APISecret !== undefined ? item.account.APISecret : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? item.account.marketOpen : undefined,
            realTime: item.account.realTime !== undefined ? item.account.realTime : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? item.account.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? item.account.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? item.account.tradeAllocationPct : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? item.account.autoAllocation : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? item.account.minPercentageChange : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? item.account.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? item.account.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? item.account.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? item.account.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? item.account.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? item.account.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? item.account.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? item.account.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? item.account.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? item.account.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? item.account.minimumPriceChangePercent100 : undefined,
            deletedAt: item.account.deletedAt !== undefined ? item.account.deletedAt : undefined,
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
      alpacaAccountId: props.alpacaAccountId !== undefined ? {
            set: props.alpacaAccountId 
           } : undefined,
  signal: props.signal !== undefined ? {
            set: props.signal 
           } : undefined,
  strategy: props.strategy !== undefined ? {
            set: props.strategy 
           } : undefined,
  analysis: props.analysis !== undefined ? {
            set: props.analysis 
           } : undefined,
  summary: props.summary !== undefined ? {
            set: props.summary 
           } : undefined,
  confidence: props.confidence !== undefined ? {
            set: props.confidence 
           } : undefined,
  timestamp: props.timestamp !== undefined ? {
            set: props.timestamp 
           } : undefined,
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
  deletedAt: props.deletedAt !== undefined ? {
            set: props.deletedAt 
           } : undefined,
  symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  side: props.side !== undefined ? {
            set: props.side 
           } : undefined,
  entryPrice: props.entryPrice !== undefined ? {
            set: props.entryPrice 
           } : undefined,
  exitPrice: props.exitPrice !== undefined ? {
            set: props.exitPrice 
           } : undefined,
  entryQty: props.entryQty !== undefined ? {
            set: props.entryQty 
           } : undefined,
  exitQty: props.exitQty !== undefined ? {
            set: props.exitQty 
           } : undefined,
  entryValue: props.entryValue !== undefined ? {
            set: props.entryValue 
           } : undefined,
  exitValue: props.exitValue !== undefined ? {
            set: props.exitValue 
           } : undefined,
  entryTime: props.entryTime !== undefined ? {
            set: props.entryTime 
           } : undefined,
  exitTime: props.exitTime !== undefined ? {
            set: props.exitTime 
           } : undefined,
  pnlAmount: props.pnlAmount !== undefined ? {
            set: props.pnlAmount 
           } : undefined,
  pnlPercent: props.pnlPercent !== undefined ? {
            set: props.pnlPercent 
           } : undefined,
  durationMinutes: props.durationMinutes !== undefined ? {
            set: props.durationMinutes 
           } : undefined,
  marketPhase: props.marketPhase !== undefined ? {
            set: props.marketPhase 
           } : undefined,
  marketVolatility: props.marketVolatility !== undefined ? {
            set: props.marketVolatility 
           } : undefined,
  sessionHorizonMinutes: props.sessionHorizonMinutes !== undefined ? {
            set: props.sessionHorizonMinutes 
           } : undefined,
  thresholdsJson: props.thresholdsJson !== undefined ? {
            set: props.thresholdsJson 
           } : undefined,
  thesisVersion: props.thesisVersion !== undefined ? {
            set: props.thesisVersion 
           } : undefined,
  lastReunderwrittenAt: props.lastReunderwrittenAt !== undefined ? {
            set: props.lastReunderwrittenAt 
           } : undefined,
  supersededById: props.supersededById !== undefined ? {
            set: props.supersededById 
           } : undefined,
  rejectionMetadata: props.rejectionMetadata !== undefined ? props.rejectionMetadata : undefined,
  signalSource: props.signalSource !== undefined ? {
            set: props.signalSource 
           } : undefined,
  signalSourceType: props.signalSourceType !== undefined ? {
            set: props.signalSourceType 
           } : undefined,
  signalId: props.signalId !== undefined ? {
            set: props.signalId 
           } : undefined,
  pathway: props.pathway !== undefined ? {
            set: props.pathway 
           } : undefined,
  pathwayType: props.pathwayType !== undefined ? {
            set: props.pathwayType 
           } : undefined,
  exitTier: props.exitTier !== undefined ? {
            set: props.exitTier 
           } : undefined,
  exitTierType: props.exitTierType !== undefined ? {
            set: props.exitTierType 
           } : undefined,
  actions: props.actions ? 
  Array.isArray(props.actions) && props.actions.length > 0 && props.actions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.actions.map((item) => ({
    id: item.id
  }))
} : { upsert: props.actions.map((item) => ({
      where: {
        id: item.id !== undefined ? item.id : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? item.alpacaOrderId : undefined,
        tradeId: item.tradeId !== undefined ? {
            equals: item.tradeId
          } : undefined,
        type: item.type !== undefined ? {
            equals: item.type
          } : undefined,
        status: item.status !== undefined ? {
            equals: item.status
          } : undefined,
        supersededActionId: item.supersededActionId !== undefined ? {
            equals: item.supersededActionId
          } : undefined,
      },
      update: {
        id: item.id !== undefined ? {
            set: item.id
          } : undefined,
        sequence: item.sequence !== undefined ? {
            set: item.sequence
          } : undefined,
        type: item.type !== undefined ? {
            set: item.type
          } : undefined,
        primary: item.primary !== undefined ? {
            set: item.primary
          } : undefined,
        note: item.note !== undefined ? {
            set: item.note
          } : undefined,
        status: item.status !== undefined ? {
            set: item.status
          } : undefined,
        deletedAt: item.deletedAt !== undefined ? {
            set: item.deletedAt
          } : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? {
            set: item.alpacaOrderId
          } : undefined,
        supersededActionId: item.supersededActionId !== undefined ? {
            set: item.supersededActionId
          } : undefined,
        triggerSource: item.triggerSource !== undefined ? {
            set: item.triggerSource
          } : undefined,
        triggerSourceType: item.triggerSourceType !== undefined ? {
            set: item.triggerSourceType
          } : undefined,
      },
      create: {
        sequence: item.sequence !== undefined ? item.sequence : undefined,
        type: item.type !== undefined ? item.type : undefined,
        primary: item.primary !== undefined ? item.primary : undefined,
        note: item.note !== undefined ? item.note : undefined,
        status: item.status !== undefined ? item.status : undefined,
        deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? item.alpacaOrderId : undefined,
        supersededActionId: item.supersededActionId !== undefined ? item.supersededActionId : undefined,
        triggerSource: item.triggerSource !== undefined ? item.triggerSource : undefined,
        triggerSourceType: item.triggerSourceType !== undefined ? item.triggerSourceType : undefined,
      },
    }))
  } : undefined,
  strategyRef: props.strategyRef ? 
  typeof props.strategyRef === 'object' && Object.keys(props.strategyRef).length === 1 && (Object.keys(props.strategyRef)[0] === 'id' || Object.keys(props.strategyRef)[0] === 'symbol')
? {
  connect: {
    id: props.strategyRef.id
  }
} : { upsert: {
      where: {
        id: props.strategyRef.id !== undefined ? {
            equals: props.strategyRef.id
          } : undefined,
        key: props.strategyRef.key !== undefined ? {
            equals: props.strategyRef.key
          } : undefined,
        ownerUserId: props.strategyRef.ownerUserId !== undefined ? {
            equals: props.strategyRef.ownerUserId
          } : undefined,
      },
      update: {
        id: props.strategyRef.id !== undefined ? {
            set: props.strategyRef.id
          } : undefined,
        key: props.strategyRef.key !== undefined ? {
            set: props.strategyRef.key
          } : undefined,
        displayName: props.strategyRef.displayName !== undefined ? {
            set: props.strategyRef.displayName
          } : undefined,
        description: props.strategyRef.description !== undefined ? {
            set: props.strategyRef.description
          } : undefined,
        origin: props.strategyRef.origin !== undefined ? {
            set: props.strategyRef.origin
          } : undefined,
        lifecycleState: props.strategyRef.lifecycleState !== undefined ? {
            set: props.strategyRef.lifecycleState
          } : undefined,
        manifestHash: props.strategyRef.manifestHash !== undefined ? {
            set: props.strategyRef.manifestHash
          } : undefined,
        deletedAt: props.strategyRef.deletedAt !== undefined ? {
            set: props.strategyRef.deletedAt
          } : undefined,
    owner: props.strategyRef.owner ? 
    typeof props.strategyRef.owner === 'object' && Object.keys(props.strategyRef.owner).length === 1 && (Object.keys(props.strategyRef.owner)[0] === 'id' || Object.keys(props.strategyRef.owner)[0] === 'symbol')
? {
    connect: {
      id: props.strategyRef.owner.id
    }
} : { upsert: {
        where: {
          id: props.strategyRef.owner.id !== undefined ? {
              equals: props.strategyRef.owner.id
            } : undefined,
          name: props.strategyRef.owner.name !== undefined ? {
              equals: props.strategyRef.owner.name
            } : undefined,
          email: props.strategyRef.owner.email !== undefined ? {
              equals: props.strategyRef.owner.email
            } : undefined,
          customerId: props.strategyRef.owner.customerId !== undefined ? {
              equals: props.strategyRef.owner.customerId
            } : undefined,
        },
        update: {
          id: props.strategyRef.owner.id !== undefined ? {
              set: props.strategyRef.owner.id
            } : undefined,
          name: props.strategyRef.owner.name !== undefined ? {
              set: props.strategyRef.owner.name
            } : undefined,
          email: props.strategyRef.owner.email !== undefined ? {
              set: props.strategyRef.owner.email
            } : undefined,
          emailVerified: props.strategyRef.owner.emailVerified !== undefined ? {
              set: props.strategyRef.owner.emailVerified
            } : undefined,
          image: props.strategyRef.owner.image !== undefined ? {
              set: props.strategyRef.owner.image
            } : undefined,
          avatarUrl: props.strategyRef.owner.avatarUrl !== undefined ? {
              set: props.strategyRef.owner.avatarUrl
            } : undefined,
          onboardingComplete: props.strategyRef.owner.onboardingComplete !== undefined ? {
              set: props.strategyRef.owner.onboardingComplete
            } : undefined,
          signupCategory: props.strategyRef.owner.signupCategory !== undefined ? {
              set: props.strategyRef.owner.signupCategory
            } : undefined,
          deletedAt: props.strategyRef.owner.deletedAt !== undefined ? {
              set: props.strategyRef.owner.deletedAt
            } : undefined,
          role: props.strategyRef.owner.role !== undefined ? {
              set: props.strategyRef.owner.role
            } : undefined,
          bio: props.strategyRef.owner.bio !== undefined ? {
              set: props.strategyRef.owner.bio
            } : undefined,
          jobTitle: props.strategyRef.owner.jobTitle !== undefined ? {
              set: props.strategyRef.owner.jobTitle
            } : undefined,
          currentAccount: props.strategyRef.owner.currentAccount !== undefined ? {
              set: props.strategyRef.owner.currentAccount
            } : undefined,
          plan: props.strategyRef.owner.plan !== undefined ? {
              set: props.strategyRef.owner.plan
            } : undefined,
          openaiAPIKey: props.strategyRef.owner.openaiAPIKey !== undefined ? {
              set: props.strategyRef.owner.openaiAPIKey
            } : undefined,
          openaiModel: props.strategyRef.owner.openaiModel !== undefined ? {
              set: props.strategyRef.owner.openaiModel
            } : undefined,
      customer: props.strategyRef.owner.customer ? 
      typeof props.strategyRef.owner.customer === 'object' && Object.keys(props.strategyRef.owner.customer).length === 1 && (Object.keys(props.strategyRef.owner.customer)[0] === 'id' || Object.keys(props.strategyRef.owner.customer)[0] === 'symbol')
? {
      connect: {
        id: props.strategyRef.owner.customer.id
      }
} : { upsert: {
          where: {
            id: props.strategyRef.owner.customer.id !== undefined ? {
                equals: props.strategyRef.owner.customer.id
              } : undefined,
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? {
                equals: props.strategyRef.owner.customer.authUserId
              } : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? {
                equals: props.strategyRef.owner.customer.name
              } : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripePriceId
              } : undefined,
          },
          update: {
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? {
                set: props.strategyRef.owner.customer.authUserId
              } : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? {
                set: props.strategyRef.owner.customer.name
              } : undefined,
            plan: props.strategyRef.owner.customer.plan !== undefined ? {
                set: props.strategyRef.owner.customer.plan
              } : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? {
                set: props.strategyRef.owner.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? {
                set: props.strategyRef.owner.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? {
                set: props.strategyRef.owner.customer.stripePriceId
              } : undefined,
            stripeCurrentPeriodEnd: props.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? {
                set: props.strategyRef.owner.customer.stripeCurrentPeriodEnd
              } : undefined,
            jurisdiction: props.strategyRef.owner.customer.jurisdiction !== undefined ? {
                set: props.strategyRef.owner.customer.jurisdiction
              } : undefined,
            riskProfile: props.strategyRef.owner.customer.riskProfile !== undefined ? {
                set: props.strategyRef.owner.customer.riskProfile
              } : undefined,
            amlStatus: props.strategyRef.owner.customer.amlStatus !== undefined ? {
                set: props.strategyRef.owner.customer.amlStatus
              } : undefined,
            lastKycUpdate: props.strategyRef.owner.customer.lastKycUpdate !== undefined ? {
                set: props.strategyRef.owner.customer.lastKycUpdate
              } : undefined,
          },
          create: {
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? props.strategyRef.owner.customer.authUserId : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? props.strategyRef.owner.customer.name : undefined,
            plan: props.strategyRef.owner.customer.plan !== undefined ? props.strategyRef.owner.customer.plan : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? props.strategyRef.owner.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? props.strategyRef.owner.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.strategyRef.owner.customer.jurisdiction !== undefined ? props.strategyRef.owner.customer.jurisdiction : undefined,
            riskProfile: props.strategyRef.owner.customer.riskProfile !== undefined ? props.strategyRef.owner.customer.riskProfile : undefined,
            amlStatus: props.strategyRef.owner.customer.amlStatus !== undefined ? props.strategyRef.owner.customer.amlStatus : undefined,
            lastKycUpdate: props.strategyRef.owner.customer.lastKycUpdate !== undefined ? props.strategyRef.owner.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.strategyRef.owner.accounts ? 
      Array.isArray(props.strategyRef.owner.accounts) && props.strategyRef.owner.accounts.length > 0 && props.strategyRef.owner.accounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.accounts.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.accounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            type: item.type !== undefined ? {
                equals: item.type
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            type: item.type !== undefined ? {
                set: item.type
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                set: item.providerAccountId
              } : undefined,
            refresh_token: item.refresh_token !== undefined ? {
                set: item.refresh_token
              } : undefined,
            access_token: item.access_token !== undefined ? {
                set: item.access_token
              } : undefined,
            expires_at: item.expires_at !== undefined ? {
                set: item.expires_at
              } : undefined,
            token_type: item.token_type !== undefined ? {
                set: item.token_type
              } : undefined,
            scope: item.scope !== undefined ? {
                set: item.scope
              } : undefined,
            id_token: item.id_token !== undefined ? {
                set: item.id_token
              } : undefined,
            session_state: item.session_state !== undefined ? {
                set: item.session_state
              } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            refresh_token: item.refresh_token !== undefined ? item.refresh_token : undefined,
            access_token: item.access_token !== undefined ? item.access_token : undefined,
            expires_at: item.expires_at !== undefined ? item.expires_at : undefined,
            token_type: item.token_type !== undefined ? item.token_type : undefined,
            scope: item.scope !== undefined ? item.scope : undefined,
            id_token: item.id_token !== undefined ? item.id_token : undefined,
            session_state: item.session_state !== undefined ? item.session_state : undefined,
          },
        }))
      } : undefined,
      sessions: props.strategyRef.owner.sessions ? 
      Array.isArray(props.strategyRef.owner.sessions) && props.strategyRef.owner.sessions.length > 0 && props.strategyRef.owner.sessions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.sessions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.sessions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            sessionToken: item.sessionToken !== undefined ? {
                set: item.sessionToken
              } : undefined,
            expires: item.expires !== undefined ? {
                set: item.expires
              } : undefined,
          },
          create: {
            sessionToken: item.sessionToken !== undefined ? item.sessionToken : undefined,
            expires: item.expires !== undefined ? item.expires : undefined,
          },
        }))
      } : undefined,
      authenticators: props.strategyRef.owner.authenticators ? 
      Array.isArray(props.strategyRef.owner.authenticators) && props.strategyRef.owner.authenticators.length > 0 && props.strategyRef.owner.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.authenticators.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.authenticators.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            credentialID: item.credentialID !== undefined ? {
                set: item.credentialID
              } : undefined,
            publicKey: item.publicKey !== undefined ? {
                set: item.publicKey
              } : undefined,
            counter: item.counter !== undefined ? {
                set: item.counter
              } : undefined,
          },
          create: {
            credentialID: item.credentialID !== undefined ? item.credentialID : undefined,
            publicKey: item.publicKey !== undefined ? item.publicKey : undefined,
            counter: item.counter !== undefined ? item.counter : undefined,
          },
        }))
      } : undefined,
      alpacaAccounts: props.strategyRef.owner.alpacaAccounts ? 
      Array.isArray(props.strategyRef.owner.alpacaAccounts) && props.strategyRef.owner.alpacaAccounts.length > 0 && props.strategyRef.owner.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.alpacaAccounts.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.alpacaAccounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            type: item.type !== undefined ? {
                equals: item.type
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            type: item.type !== undefined ? {
                set: item.type
              } : undefined,
            APIKey: item.APIKey !== undefined ? {
                set: item.APIKey
              } : undefined,
            APISecret: item.APISecret !== undefined ? {
                set: item.APISecret
              } : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? {
                set: item.marketOpen
              } : undefined,
            realTime: item.realTime !== undefined ? {
                set: item.realTime
              } : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? {
                set: item.cryptoTradingEnabled
              } : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs
              } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? {
                set: item.cryptoTradeAllocationPct
              } : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? {
                set: item.tradeAllocationPct
              } : undefined,
            autoAllocation: item.autoAllocation !== undefined ? {
                set: item.autoAllocation
              } : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? {
                set: item.minPercentageChange
              } : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? {
                set: item.volumeThreshold
              } : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? {
                set: item.enablePortfolioTrailingStop
              } : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? {
                set: item.portfolioTrailPercent
              } : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? {
                set: item.portfolioProfitThresholdPercent
              } : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? {
                set: item.reducedPortfolioTrailPercent
              } : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? {
                set: item.defaultTrailingStopPercentage100
              } : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? {
                set: item.firstTrailReductionThreshold100
              } : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? {
                set: item.secondTrailReductionThreshold100
              } : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? {
                set: item.firstReducedTrailPercentage100
              } : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? {
                set: item.secondReducedTrailPercentage100
              } : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? {
                set: item.minimumPriceChangePercent100
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            APIKey: item.APIKey !== undefined ? item.APIKey : undefined,
            APISecret: item.APISecret !== undefined ? item.APISecret : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? item.marketOpen : undefined,
            realTime: item.realTime !== undefined ? item.realTime : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? item.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? item.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? item.tradeAllocationPct : undefined,
            autoAllocation: item.autoAllocation !== undefined ? item.autoAllocation : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? item.minPercentageChange : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? item.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? item.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? item.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? item.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? item.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? item.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? item.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? item.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? item.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? item.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? item.minimumPriceChangePercent100 : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      linkedProviders: props.strategyRef.owner.linkedProviders ? 
      Array.isArray(props.strategyRef.owner.linkedProviders) && props.strategyRef.owner.linkedProviders.length > 0 && props.strategyRef.owner.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.linkedProviders.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.linkedProviders.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId
              } : undefined,
            email: item.email !== undefined ? {
                equals: item.email
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                set: item.providerAccountId
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            accessToken: item.accessToken !== undefined ? {
                set: item.accessToken
              } : undefined,
            refreshToken: item.refreshToken !== undefined ? {
                set: item.refreshToken
              } : undefined,
            expiresAt: item.expiresAt !== undefined ? {
                set: item.expiresAt
              } : undefined,
            linkedAt: item.linkedAt !== undefined ? {
                set: item.linkedAt
              } : undefined,
          },
          create: {
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            email: item.email !== undefined ? item.email : undefined,
            accessToken: item.accessToken !== undefined ? item.accessToken : undefined,
            refreshToken: item.refreshToken !== undefined ? item.refreshToken : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            linkedAt: item.linkedAt !== undefined ? item.linkedAt : undefined,
          },
        }))
      } : undefined,
      accountLinkingRequests: props.strategyRef.owner.accountLinkingRequests ? 
      Array.isArray(props.strategyRef.owner.accountLinkingRequests) && props.strategyRef.owner.accountLinkingRequests.length > 0 && props.strategyRef.owner.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.accountLinkingRequests.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.accountLinkingRequests.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            email: item.email !== undefined ? {
                equals: item.email
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                set: item.providerAccountId
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            verificationToken: item.verificationToken !== undefined ? {
                set: item.verificationToken
              } : undefined,
            userAgent: item.userAgent !== undefined ? {
                set: item.userAgent
              } : undefined,
            ipAddress: item.ipAddress !== undefined ? {
                set: item.ipAddress
              } : undefined,
            expiresAt: item.expiresAt !== undefined ? {
                set: item.expiresAt
              } : undefined,
            verifiedAt: item.verifiedAt !== undefined ? {
                set: item.verifiedAt
              } : undefined,
            approvedAt: item.approvedAt !== undefined ? {
                set: item.approvedAt
              } : undefined,
            rejectedAt: item.rejectedAt !== undefined ? {
                set: item.rejectedAt
              } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            verificationToken: item.verificationToken !== undefined ? item.verificationToken : undefined,
            userAgent: item.userAgent !== undefined ? item.userAgent : undefined,
            ipAddress: item.ipAddress !== undefined ? item.ipAddress : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            verifiedAt: item.verifiedAt !== undefined ? item.verifiedAt : undefined,
            approvedAt: item.approvedAt !== undefined ? item.approvedAt : undefined,
            rejectedAt: item.rejectedAt !== undefined ? item.rejectedAt : undefined,
          },
        }))
      } : undefined,
      reviewedWaitlistEntries: props.strategyRef.owner.reviewedWaitlistEntries ? 
      Array.isArray(props.strategyRef.owner.reviewedWaitlistEntries) && props.strategyRef.owner.reviewedWaitlistEntries.length > 0 && props.strategyRef.owner.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            email: item.email !== undefined ? item.email : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            reviewedById: item.reviewedById !== undefined ? {
                equals: item.reviewedById
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            fullName: item.fullName !== undefined ? {
                set: item.fullName
              } : undefined,
            companyName: item.companyName !== undefined ? {
                set: item.companyName
              } : undefined,
            companyWebsite: item.companyWebsite !== undefined ? {
                set: item.companyWebsite
              } : undefined,
            jobRole: item.jobRole !== undefined ? {
                set: item.jobRole
              } : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? {
                set: item.professionalInvestorConfirmed
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            queuePosition: item.queuePosition !== undefined ? {
                set: item.queuePosition
              } : undefined,
            reviewedAt: item.reviewedAt !== undefined ? {
                set: item.reviewedAt
              } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            fullName: item.fullName !== undefined ? item.fullName : undefined,
            companyName: item.companyName !== undefined ? item.companyName : undefined,
            companyWebsite: item.companyWebsite !== undefined ? item.companyWebsite : undefined,
            jobRole: item.jobRole !== undefined ? item.jobRole : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? item.professionalInvestorConfirmed : undefined,
            status: item.status !== undefined ? item.status : undefined,
            queuePosition: item.queuePosition !== undefined ? item.queuePosition : undefined,
            reviewedAt: item.reviewedAt !== undefined ? item.reviewedAt : undefined,
          },
        }))
      } : undefined,
      llmConfiguration: props.strategyRef.owner.llmConfiguration ? 
      typeof props.strategyRef.owner.llmConfiguration === 'object' && Object.keys(props.strategyRef.owner.llmConfiguration).length === 1 && (Object.keys(props.strategyRef.owner.llmConfiguration)[0] === 'id' || Object.keys(props.strategyRef.owner.llmConfiguration)[0] === 'symbol')
? {
      connect: {
        id: props.strategyRef.owner.llmConfiguration.id
      }
} : { upsert: {
          where: {
            id: props.strategyRef.owner.llmConfiguration.id !== undefined ? {
                equals: props.strategyRef.owner.llmConfiguration.id
              } : undefined,
            userId: props.strategyRef.owner.llmConfiguration.userId !== undefined ? {
                equals: props.strategyRef.owner.llmConfiguration.userId
              } : undefined,
          },
          update: {
            id: props.strategyRef.owner.llmConfiguration.id !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.id
              } : undefined,
            defaultProvider: props.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.defaultProvider
              } : undefined,
            miniProvider: props.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.miniProvider
              } : undefined,
            normalProvider: props.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.normalProvider
              } : undefined,
            advancedProvider: props.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.advancedProvider
              } : undefined,
            miniModel: props.strategyRef.owner.llmConfiguration.miniModel !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.miniModel
              } : undefined,
            normalModel: props.strategyRef.owner.llmConfiguration.normalModel !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.normalModel
              } : undefined,
            advancedModel: props.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.advancedModel
              } : undefined,
            openaiApiKey: props.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.openaiApiKey
              } : undefined,
            anthropicApiKey: props.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.anthropicApiKey
              } : undefined,
            deepseekApiKey: props.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.deepseekApiKey
              } : undefined,
            kimiApiKey: props.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.kimiApiKey
              } : undefined,
            qwenApiKey: props.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.qwenApiKey
              } : undefined,
            xaiApiKey: props.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.xaiApiKey
              } : undefined,
            geminiApiKey: props.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.geminiApiKey
              } : undefined,
            deepinfraApiKey: props.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? {
                set: props.strategyRef.owner.llmConfiguration.deepinfraApiKey
              } : undefined,
          },
          create: {
            defaultProvider: props.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? props.strategyRef.owner.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? props.strategyRef.owner.llmConfiguration.miniProvider : undefined,
            normalProvider: props.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? props.strategyRef.owner.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? props.strategyRef.owner.llmConfiguration.advancedProvider : undefined,
            miniModel: props.strategyRef.owner.llmConfiguration.miniModel !== undefined ? props.strategyRef.owner.llmConfiguration.miniModel : undefined,
            normalModel: props.strategyRef.owner.llmConfiguration.normalModel !== undefined ? props.strategyRef.owner.llmConfiguration.normalModel : undefined,
            advancedModel: props.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? props.strategyRef.owner.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.strategyRef.owner.orgMemberships ? 
      Array.isArray(props.strategyRef.owner.orgMemberships) && props.strategyRef.owner.orgMemberships.length > 0 && props.strategyRef.owner.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.orgMemberships.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.orgMemberships.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            role: item.role !== undefined ? {
                set: item.role
              } : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions
              } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      fundAssignments: props.strategyRef.owner.fundAssignments ? 
      Array.isArray(props.strategyRef.owner.fundAssignments) && props.strategyRef.owner.fundAssignments.length > 0 && props.strategyRef.owner.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.fundAssignments.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.fundAssignments.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            role: item.role !== undefined ? {
                set: item.role
              } : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions
              } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      managedFunds: props.strategyRef.owner.managedFunds ? 
      Array.isArray(props.strategyRef.owner.managedFunds) && props.strategyRef.owner.managedFunds.length > 0 && props.strategyRef.owner.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.managedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.managedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            managerId: item.managerId !== undefined ? {
                equals: item.managerId
              } : undefined,
            operatorId: item.operatorId !== undefined ? {
                equals: item.operatorId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                set: item.slug
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            currency: item.currency !== undefined ? {
                set: item.currency
              } : undefined,
            inceptionDate: item.inceptionDate !== undefined ? {
                set: item.inceptionDate
              } : undefined,
            aum: item.aum !== undefined ? {
                set: item.aum
              } : undefined,
            navPerShare: item.navPerShare !== undefined ? {
                set: item.navPerShare
              } : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? {
                set: item.sharesOutstanding
              } : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? {
                set: item.highWaterMarkNav
              } : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      operatedFunds: props.strategyRef.owner.operatedFunds ? 
      Array.isArray(props.strategyRef.owner.operatedFunds) && props.strategyRef.owner.operatedFunds.length > 0 && props.strategyRef.owner.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.operatedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.operatedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            managerId: item.managerId !== undefined ? {
                equals: item.managerId
              } : undefined,
            operatorId: item.operatorId !== undefined ? {
                equals: item.operatorId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                set: item.slug
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            currency: item.currency !== undefined ? {
                set: item.currency
              } : undefined,
            inceptionDate: item.inceptionDate !== undefined ? {
                set: item.inceptionDate
              } : undefined,
            aum: item.aum !== undefined ? {
                set: item.aum
              } : undefined,
            navPerShare: item.navPerShare !== undefined ? {
                set: item.navPerShare
              } : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? {
                set: item.sharesOutstanding
              } : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? {
                set: item.highWaterMarkNav
              } : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      ownedMandates: props.strategyRef.owner.ownedMandates ? 
      Array.isArray(props.strategyRef.owner.ownedMandates) && props.strategyRef.owner.ownedMandates.length > 0 && props.strategyRef.owner.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.ownedMandates.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.ownedMandates.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            activeVersionId: item.activeVersionId !== undefined ? item.activeVersionId : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId
              } : undefined,
            ownerId: item.ownerId !== undefined ? {
                equals: item.ownerId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            scopeKind: item.scopeKind !== undefined ? {
                set: item.scopeKind
              } : undefined,
            klass: item.klass !== undefined ? {
                set: item.klass
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            personaScope: item.personaScope !== undefined ? {
                set: item.personaScope
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            scopeKind: item.scopeKind !== undefined ? item.scopeKind : undefined,
            klass: item.klass !== undefined ? item.klass : undefined,
            name: item.name !== undefined ? item.name : undefined,
            personaScope: item.personaScope !== undefined ? item.personaScope : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      authoredMandateVersions: props.strategyRef.owner.authoredMandateVersions ? 
      Array.isArray(props.strategyRef.owner.authoredMandateVersions) && props.strategyRef.owner.authoredMandateVersions.length > 0 && props.strategyRef.owner.authoredMandateVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.authoredMandateVersions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.authoredMandateVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateId: item.mandateId !== undefined ? {
                equals: item.mandateId
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            authoredById: item.authoredById !== undefined ? {
                equals: item.authoredById
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            versionLabel: item.versionLabel !== undefined ? {
                set: item.versionLabel
              } : undefined,
            versionSeq: item.versionSeq !== undefined ? {
                set: item.versionSeq
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            summary: item.summary !== undefined ? {
                set: item.summary
              } : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
          create: {
            versionLabel: item.versionLabel !== undefined ? item.versionLabel : undefined,
            versionSeq: item.versionSeq !== undefined ? item.versionSeq : undefined,
            status: item.status !== undefined ? item.status : undefined,
            summary: item.summary !== undefined ? item.summary : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
        }))
      } : undefined,
      mandateApprovalsDecided: props.strategyRef.owner.mandateApprovalsDecided ? 
      Array.isArray(props.strategyRef.owner.mandateApprovalsDecided) && props.strategyRef.owner.mandateApprovalsDecided.length > 0 && props.strategyRef.owner.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateVersionId: item.mandateVersionId !== undefined ? {
                equals: item.mandateVersionId
              } : undefined,
            decidedByUserId: item.decidedByUserId !== undefined ? {
                equals: item.decidedByUserId
              } : undefined,
            correlationId: item.correlationId !== undefined ? {
                equals: item.correlationId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            action: item.action !== undefined ? {
                set: item.action
              } : undefined,
            decidedByRole: item.decidedByRole !== undefined ? {
                set: item.decidedByRole
              } : undefined,
            rationale: item.rationale !== undefined ? {
                set: item.rationale
              } : undefined,
            correlationId: item.correlationId !== undefined ? {
                set: item.correlationId
              } : undefined,
          },
          create: {
            action: item.action !== undefined ? item.action : undefined,
            decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
            rationale: item.rationale !== undefined ? item.rationale : undefined,
            correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
          },
        }))
      } : undefined,
      investorProfiles: props.strategyRef.owner.investorProfiles ? 
      Array.isArray(props.strategyRef.owner.investorProfiles) && props.strategyRef.owner.investorProfiles.length > 0 && props.strategyRef.owner.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.investorProfiles.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.investorProfiles.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            customerId: item.customerId !== undefined ? {
                equals: item.customerId
              } : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            email: item.email !== undefined ? {
                equals: item.email
              } : undefined,
            type: item.type !== undefined ? {
                equals: item.type
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            type: item.type !== undefined ? {
                set: item.type
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            kycStatus: item.kycStatus !== undefined ? {
                set: item.kycStatus
              } : undefined,
            jurisdiction: item.jurisdiction !== undefined ? {
                set: item.jurisdiction
              } : undefined,
            joinedAt: item.joinedAt !== undefined ? {
                set: item.joinedAt
              } : undefined,
            externalRef: item.externalRef !== undefined ? {
                set: item.externalRef
              } : undefined,
            notes: item.notes !== undefined ? {
                set: item.notes
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            email: item.email !== undefined ? item.email : undefined,
            type: item.type !== undefined ? item.type : undefined,
            status: item.status !== undefined ? item.status : undefined,
            kycStatus: item.kycStatus !== undefined ? item.kycStatus : undefined,
            jurisdiction: item.jurisdiction !== undefined ? item.jurisdiction : undefined,
            joinedAt: item.joinedAt !== undefined ? item.joinedAt : undefined,
            externalRef: item.externalRef !== undefined ? item.externalRef : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      notificationDeliveries: props.strategyRef.owner.notificationDeliveries ? 
      Array.isArray(props.strategyRef.owner.notificationDeliveries) && props.strategyRef.owner.notificationDeliveries.length > 0 && props.strategyRef.owner.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.notificationDeliveries.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.notificationDeliveries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId
              } : undefined,
            recipientUserId: item.recipientUserId !== undefined ? {
                equals: item.recipientUserId
              } : undefined,
            templateId: item.templateId !== undefined ? {
                equals: item.templateId
              } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                equals: item.providerMessageId
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            channel: item.channel !== undefined ? {
                set: item.channel
              } : undefined,
            templateId: item.templateId !== undefined ? {
                set: item.templateId
              } : undefined,
            templateVersion: item.templateVersion !== undefined ? {
                set: item.templateVersion
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                set: item.providerMessageId
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            statusDetail: item.statusDetail !== undefined ? {
                set: item.statusDetail
              } : undefined,
            sentAt: item.sentAt !== undefined ? {
                set: item.sentAt
              } : undefined,
            deliveredAt: item.deliveredAt !== undefined ? {
                set: item.deliveredAt
              } : undefined,
            readAt: item.readAt !== undefined ? {
                set: item.readAt
              } : undefined,
          },
          create: {
            channel: item.channel !== undefined ? item.channel : undefined,
            templateId: item.templateId !== undefined ? item.templateId : undefined,
            templateVersion: item.templateVersion !== undefined ? item.templateVersion : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerMessageId: item.providerMessageId !== undefined ? item.providerMessageId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            statusDetail: item.statusDetail !== undefined ? item.statusDetail : undefined,
            sentAt: item.sentAt !== undefined ? item.sentAt : undefined,
            deliveredAt: item.deliveredAt !== undefined ? item.deliveredAt : undefined,
            readAt: item.readAt !== undefined ? item.readAt : undefined,
          },
        }))
      } : undefined,
      notificationPreferences: props.strategyRef.owner.notificationPreferences ? 
      Array.isArray(props.strategyRef.owner.notificationPreferences) && props.strategyRef.owner.notificationPreferences.length > 0 && props.strategyRef.owner.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.strategyRef.owner.notificationPreferences.map((item) => ({
        id: item.id
      }))
} : { upsert: props.strategyRef.owner.notificationPreferences.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            eventId: item.eventId !== undefined ? {
                set: item.eventId
              } : undefined,
            channel: item.channel !== undefined ? {
                set: item.channel
              } : undefined,
            enabled: item.enabled !== undefined ? {
                set: item.enabled
              } : undefined,
          },
          create: {
            eventId: item.eventId !== undefined ? item.eventId : undefined,
            channel: item.channel !== undefined ? item.channel : undefined,
            enabled: item.enabled !== undefined ? item.enabled : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          name: props.strategyRef.owner.name !== undefined ? props.strategyRef.owner.name : undefined,
          email: props.strategyRef.owner.email !== undefined ? props.strategyRef.owner.email : undefined,
          emailVerified: props.strategyRef.owner.emailVerified !== undefined ? props.strategyRef.owner.emailVerified : undefined,
          image: props.strategyRef.owner.image !== undefined ? props.strategyRef.owner.image : undefined,
          avatarUrl: props.strategyRef.owner.avatarUrl !== undefined ? props.strategyRef.owner.avatarUrl : undefined,
          onboardingComplete: props.strategyRef.owner.onboardingComplete !== undefined ? props.strategyRef.owner.onboardingComplete : undefined,
          signupCategory: props.strategyRef.owner.signupCategory !== undefined ? props.strategyRef.owner.signupCategory : undefined,
          deletedAt: props.strategyRef.owner.deletedAt !== undefined ? props.strategyRef.owner.deletedAt : undefined,
          role: props.strategyRef.owner.role !== undefined ? props.strategyRef.owner.role : undefined,
          bio: props.strategyRef.owner.bio !== undefined ? props.strategyRef.owner.bio : undefined,
          jobTitle: props.strategyRef.owner.jobTitle !== undefined ? props.strategyRef.owner.jobTitle : undefined,
          currentAccount: props.strategyRef.owner.currentAccount !== undefined ? props.strategyRef.owner.currentAccount : undefined,
          plan: props.strategyRef.owner.plan !== undefined ? props.strategyRef.owner.plan : undefined,
          openaiAPIKey: props.strategyRef.owner.openaiAPIKey !== undefined ? props.strategyRef.owner.openaiAPIKey : undefined,
          openaiModel: props.strategyRef.owner.openaiModel !== undefined ? props.strategyRef.owner.openaiModel : undefined,
      customer: props.strategyRef.owner.customer ? 
        typeof props.strategyRef.owner.customer === 'object' && Object.keys(props.strategyRef.owner.customer).length === 1 && Object.keys(props.strategyRef.owner.customer)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.customer.id !== undefined ? props.strategyRef.owner.customer.id : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? {
                equals: props.strategyRef.owner.customer.authUserId 
               } : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? {
                equals: props.strategyRef.owner.customer.name 
               } : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? props.strategyRef.owner.customer.authUserId : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? props.strategyRef.owner.customer.name : undefined,
            plan: props.strategyRef.owner.customer.plan !== undefined ? props.strategyRef.owner.customer.plan : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? props.strategyRef.owner.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? props.strategyRef.owner.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.strategyRef.owner.customer.jurisdiction !== undefined ? props.strategyRef.owner.customer.jurisdiction : undefined,
            riskProfile: props.strategyRef.owner.customer.riskProfile !== undefined ? props.strategyRef.owner.customer.riskProfile : undefined,
            amlStatus: props.strategyRef.owner.customer.amlStatus !== undefined ? props.strategyRef.owner.customer.amlStatus : undefined,
            lastKycUpdate: props.strategyRef.owner.customer.lastKycUpdate !== undefined ? props.strategyRef.owner.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.strategyRef.owner.accounts ? 
        Array.isArray(props.strategyRef.owner.accounts) && props.strategyRef.owner.accounts.length > 0 &&  props.strategyRef.owner.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            refresh_token: item.refresh_token !== undefined ? item.refresh_token : undefined,
            access_token: item.access_token !== undefined ? item.access_token : undefined,
            expires_at: item.expires_at !== undefined ? item.expires_at : undefined,
            token_type: item.token_type !== undefined ? item.token_type : undefined,
            scope: item.scope !== undefined ? item.scope : undefined,
            id_token: item.id_token !== undefined ? item.id_token : undefined,
            session_state: item.session_state !== undefined ? item.session_state : undefined,
          },
        }))
      } : undefined,
      sessions: props.strategyRef.owner.sessions ? 
        Array.isArray(props.strategyRef.owner.sessions) && props.strategyRef.owner.sessions.length > 0 &&  props.strategyRef.owner.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.sessions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            sessionToken: item.sessionToken !== undefined ? item.sessionToken : undefined,
            expires: item.expires !== undefined ? item.expires : undefined,
          },
        }))
      } : undefined,
      authenticators: props.strategyRef.owner.authenticators ? 
        Array.isArray(props.strategyRef.owner.authenticators) && props.strategyRef.owner.authenticators.length > 0 &&  props.strategyRef.owner.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authenticators.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            credentialID: item.credentialID !== undefined ? item.credentialID : undefined,
            publicKey: item.publicKey !== undefined ? item.publicKey : undefined,
            counter: item.counter !== undefined ? item.counter : undefined,
          },
        }))
      } : undefined,
      alpacaAccounts: props.strategyRef.owner.alpacaAccounts ? 
        Array.isArray(props.strategyRef.owner.alpacaAccounts) && props.strategyRef.owner.alpacaAccounts.length > 0 &&  props.strategyRef.owner.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.alpacaAccounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            APIKey: item.APIKey !== undefined ? item.APIKey : undefined,
            APISecret: item.APISecret !== undefined ? item.APISecret : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? item.marketOpen : undefined,
            realTime: item.realTime !== undefined ? item.realTime : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? item.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? item.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? item.tradeAllocationPct : undefined,
            autoAllocation: item.autoAllocation !== undefined ? item.autoAllocation : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? item.minPercentageChange : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? item.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? item.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? item.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? item.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? item.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? item.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? item.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? item.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? item.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? item.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? item.minimumPriceChangePercent100 : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      linkedProviders: props.strategyRef.owner.linkedProviders ? 
        Array.isArray(props.strategyRef.owner.linkedProviders) && props.strategyRef.owner.linkedProviders.length > 0 &&  props.strategyRef.owner.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.linkedProviders.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
          },
          create: {
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            email: item.email !== undefined ? item.email : undefined,
            accessToken: item.accessToken !== undefined ? item.accessToken : undefined,
            refreshToken: item.refreshToken !== undefined ? item.refreshToken : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            linkedAt: item.linkedAt !== undefined ? item.linkedAt : undefined,
          },
        }))
      } : undefined,
      accountLinkingRequests: props.strategyRef.owner.accountLinkingRequests ? 
        Array.isArray(props.strategyRef.owner.accountLinkingRequests) && props.strategyRef.owner.accountLinkingRequests.length > 0 &&  props.strategyRef.owner.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accountLinkingRequests.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            verificationToken: item.verificationToken !== undefined ? item.verificationToken : undefined,
            userAgent: item.userAgent !== undefined ? item.userAgent : undefined,
            ipAddress: item.ipAddress !== undefined ? item.ipAddress : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            verifiedAt: item.verifiedAt !== undefined ? item.verifiedAt : undefined,
            approvedAt: item.approvedAt !== undefined ? item.approvedAt : undefined,
            rejectedAt: item.rejectedAt !== undefined ? item.rejectedAt : undefined,
          },
        }))
      } : undefined,
      reviewedWaitlistEntries: props.strategyRef.owner.reviewedWaitlistEntries ? 
        Array.isArray(props.strategyRef.owner.reviewedWaitlistEntries) && props.strategyRef.owner.reviewedWaitlistEntries.length > 0 &&  props.strategyRef.owner.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            email: item.email !== undefined ? item.email : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            fullName: item.fullName !== undefined ? item.fullName : undefined,
            companyName: item.companyName !== undefined ? item.companyName : undefined,
            companyWebsite: item.companyWebsite !== undefined ? item.companyWebsite : undefined,
            jobRole: item.jobRole !== undefined ? item.jobRole : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? item.professionalInvestorConfirmed : undefined,
            status: item.status !== undefined ? item.status : undefined,
            queuePosition: item.queuePosition !== undefined ? item.queuePosition : undefined,
            reviewedAt: item.reviewedAt !== undefined ? item.reviewedAt : undefined,
          },
        }))
      } : undefined,
      llmConfiguration: props.strategyRef.owner.llmConfiguration ? 
        typeof props.strategyRef.owner.llmConfiguration === 'object' && Object.keys(props.strategyRef.owner.llmConfiguration).length === 1 && Object.keys(props.strategyRef.owner.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.llmConfiguration.id !== undefined ? props.strategyRef.owner.llmConfiguration.id : undefined,
            userId: props.strategyRef.owner.llmConfiguration.userId !== undefined ? props.strategyRef.owner.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? props.strategyRef.owner.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? props.strategyRef.owner.llmConfiguration.miniProvider : undefined,
            normalProvider: props.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? props.strategyRef.owner.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? props.strategyRef.owner.llmConfiguration.advancedProvider : undefined,
            miniModel: props.strategyRef.owner.llmConfiguration.miniModel !== undefined ? props.strategyRef.owner.llmConfiguration.miniModel : undefined,
            normalModel: props.strategyRef.owner.llmConfiguration.normalModel !== undefined ? props.strategyRef.owner.llmConfiguration.normalModel : undefined,
            advancedModel: props.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? props.strategyRef.owner.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.strategyRef.owner.orgMemberships ? 
        Array.isArray(props.strategyRef.owner.orgMemberships) && props.strategyRef.owner.orgMemberships.length > 0 &&  props.strategyRef.owner.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.orgMemberships.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      fundAssignments: props.strategyRef.owner.fundAssignments ? 
        Array.isArray(props.strategyRef.owner.fundAssignments) && props.strategyRef.owner.fundAssignments.length > 0 &&  props.strategyRef.owner.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.fundAssignments.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      managedFunds: props.strategyRef.owner.managedFunds ? 
        Array.isArray(props.strategyRef.owner.managedFunds) && props.strategyRef.owner.managedFunds.length > 0 &&  props.strategyRef.owner.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.managedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      operatedFunds: props.strategyRef.owner.operatedFunds ? 
        Array.isArray(props.strategyRef.owner.operatedFunds) && props.strategyRef.owner.operatedFunds.length > 0 &&  props.strategyRef.owner.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.operatedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      ownedMandates: props.strategyRef.owner.ownedMandates ? 
        Array.isArray(props.strategyRef.owner.ownedMandates) && props.strategyRef.owner.ownedMandates.length > 0 &&  props.strategyRef.owner.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.ownedMandates.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            activeVersionId: item.activeVersionId !== undefined ? item.activeVersionId : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            scopeKind: item.scopeKind !== undefined ? item.scopeKind : undefined,
            klass: item.klass !== undefined ? item.klass : undefined,
            name: item.name !== undefined ? item.name : undefined,
            personaScope: item.personaScope !== undefined ? item.personaScope : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      authoredMandateVersions: props.strategyRef.owner.authoredMandateVersions ? 
        Array.isArray(props.strategyRef.owner.authoredMandateVersions) && props.strategyRef.owner.authoredMandateVersions.length > 0 &&  props.strategyRef.owner.authoredMandateVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authoredMandateVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authoredMandateVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateId: item.mandateId !== undefined ? {
                equals: item.mandateId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            versionLabel: item.versionLabel !== undefined ? item.versionLabel : undefined,
            versionSeq: item.versionSeq !== undefined ? item.versionSeq : undefined,
            status: item.status !== undefined ? item.status : undefined,
            summary: item.summary !== undefined ? item.summary : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
        }))
      } : undefined,
      mandateApprovalsDecided: props.strategyRef.owner.mandateApprovalsDecided ? 
        Array.isArray(props.strategyRef.owner.mandateApprovalsDecided) && props.strategyRef.owner.mandateApprovalsDecided.length > 0 &&  props.strategyRef.owner.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateVersionId: item.mandateVersionId !== undefined ? {
                equals: item.mandateVersionId 
               } : undefined,
            correlationId: item.correlationId !== undefined ? {
                equals: item.correlationId 
               } : undefined,
          },
          create: {
            action: item.action !== undefined ? item.action : undefined,
            decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
            rationale: item.rationale !== undefined ? item.rationale : undefined,
            correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
          },
        }))
      } : undefined,
      investorProfiles: props.strategyRef.owner.investorProfiles ? 
        Array.isArray(props.strategyRef.owner.investorProfiles) && props.strategyRef.owner.investorProfiles.length > 0 &&  props.strategyRef.owner.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.investorProfiles.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            email: item.email !== undefined ? item.email : undefined,
            type: item.type !== undefined ? item.type : undefined,
            status: item.status !== undefined ? item.status : undefined,
            kycStatus: item.kycStatus !== undefined ? item.kycStatus : undefined,
            jurisdiction: item.jurisdiction !== undefined ? item.jurisdiction : undefined,
            joinedAt: item.joinedAt !== undefined ? item.joinedAt : undefined,
            externalRef: item.externalRef !== undefined ? item.externalRef : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      notificationDeliveries: props.strategyRef.owner.notificationDeliveries ? 
        Array.isArray(props.strategyRef.owner.notificationDeliveries) && props.strategyRef.owner.notificationDeliveries.length > 0 &&  props.strategyRef.owner.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationDeliveries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
            recipientUserId: item.recipientUserId !== undefined ? {
                equals: item.recipientUserId 
               } : undefined,
            templateId: item.templateId !== undefined ? {
                equals: item.templateId 
               } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                equals: item.providerMessageId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            channel: item.channel !== undefined ? item.channel : undefined,
            templateId: item.templateId !== undefined ? item.templateId : undefined,
            templateVersion: item.templateVersion !== undefined ? item.templateVersion : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerMessageId: item.providerMessageId !== undefined ? item.providerMessageId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            statusDetail: item.statusDetail !== undefined ? item.statusDetail : undefined,
            sentAt: item.sentAt !== undefined ? item.sentAt : undefined,
            deliveredAt: item.deliveredAt !== undefined ? item.deliveredAt : undefined,
            readAt: item.readAt !== undefined ? item.readAt : undefined,
          },
        }))
      } : undefined,
      notificationPreferences: props.strategyRef.owner.notificationPreferences ? 
        Array.isArray(props.strategyRef.owner.notificationPreferences) && props.strategyRef.owner.notificationPreferences.length > 0 &&  props.strategyRef.owner.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationPreferences.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
          },
          create: {
            eventId: item.eventId !== undefined ? item.eventId : undefined,
            channel: item.channel !== undefined ? item.channel : undefined,
            enabled: item.enabled !== undefined ? item.enabled : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    subscriptions: props.strategyRef.subscriptions ? 
    Array.isArray(props.strategyRef.subscriptions) && props.strategyRef.subscriptions.length > 0 && props.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.strategyRef.subscriptions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.strategyRef.subscriptions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          accountId: item.accountId !== undefined ? {
              equals: item.accountId
            } : undefined,
          strategyId: item.strategyId !== undefined ? {
              equals: item.strategyId
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          units: item.units !== undefined ? {
              set: item.units
            } : undefined,
          costBasis: item.costBasis !== undefined ? {
              set: item.costBasis
            } : undefined,
          realizedPL: item.realizedPL !== undefined ? {
              set: item.realizedPL
            } : undefined,
          targetAllocationPct: item.targetAllocationPct !== undefined ? {
              set: item.targetAllocationPct
            } : undefined,
          currency: item.currency !== undefined ? {
              set: item.currency
            } : undefined,
          subscribedAt: item.subscribedAt !== undefined ? {
              set: item.subscribedAt
            } : undefined,
          lastRebalancedAt: item.lastRebalancedAt !== undefined ? {
              set: item.lastRebalancedAt
            } : undefined,
          deletedAt: item.deletedAt !== undefined ? {
              set: item.deletedAt
            } : undefined,
      account: item.account ? 
      typeof item.account === 'object' && Object.keys(item.account).length === 1 && (Object.keys(item.account)[0] === 'id' || Object.keys(item.account)[0] === 'symbol')
? {
      connect: {
        id: item.account.id
      }
} : { upsert: {
          where: {
            id: item.account.id !== undefined ? {
                equals: item.account.id
              } : undefined,
            type: item.account.type !== undefined ? {
                equals: item.account.type
              } : undefined,
            userId: item.account.userId !== undefined ? {
                equals: item.account.userId
              } : undefined,
          },
          update: {
            id: item.account.id !== undefined ? {
                set: item.account.id
              } : undefined,
            type: item.account.type !== undefined ? {
                set: item.account.type
              } : undefined,
            APIKey: item.account.APIKey !== undefined ? {
                set: item.account.APIKey
              } : undefined,
            APISecret: item.account.APISecret !== undefined ? {
                set: item.account.APISecret
              } : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? {
                set: item.account.marketOpen
              } : undefined,
            realTime: item.account.realTime !== undefined ? {
                set: item.account.realTime
              } : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? {
                set: item.account.cryptoTradingEnabled
              } : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs
              } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? {
                set: item.account.cryptoTradeAllocationPct
              } : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? {
                set: item.account.tradeAllocationPct
              } : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? {
                set: item.account.autoAllocation
              } : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? {
                set: item.account.minPercentageChange
              } : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? {
                set: item.account.volumeThreshold
              } : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? {
                set: item.account.enablePortfolioTrailingStop
              } : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? {
                set: item.account.portfolioTrailPercent
              } : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? {
                set: item.account.portfolioProfitThresholdPercent
              } : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? {
                set: item.account.reducedPortfolioTrailPercent
              } : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? {
                set: item.account.defaultTrailingStopPercentage100
              } : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? {
                set: item.account.firstTrailReductionThreshold100
              } : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? {
                set: item.account.secondTrailReductionThreshold100
              } : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? {
                set: item.account.firstReducedTrailPercentage100
              } : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? {
                set: item.account.secondReducedTrailPercentage100
              } : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? {
                set: item.account.minimumPriceChangePercent100
              } : undefined,
            deletedAt: item.account.deletedAt !== undefined ? {
                set: item.account.deletedAt
              } : undefined,
          },
          create: {
            type: item.account.type !== undefined ? item.account.type : undefined,
            APIKey: item.account.APIKey !== undefined ? item.account.APIKey : undefined,
            APISecret: item.account.APISecret !== undefined ? item.account.APISecret : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? item.account.marketOpen : undefined,
            realTime: item.account.realTime !== undefined ? item.account.realTime : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? item.account.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? item.account.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? item.account.tradeAllocationPct : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? item.account.autoAllocation : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? item.account.minPercentageChange : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? item.account.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? item.account.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? item.account.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? item.account.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? item.account.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? item.account.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? item.account.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? item.account.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? item.account.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? item.account.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? item.account.minimumPriceChangePercent100 : undefined,
            deletedAt: item.account.deletedAt !== undefined ? item.account.deletedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          status: item.status !== undefined ? item.status : undefined,
          units: item.units !== undefined ? item.units : undefined,
          costBasis: item.costBasis !== undefined ? item.costBasis : undefined,
          realizedPL: item.realizedPL !== undefined ? item.realizedPL : undefined,
          targetAllocationPct: item.targetAllocationPct !== undefined ? item.targetAllocationPct : undefined,
          currency: item.currency !== undefined ? item.currency : undefined,
          subscribedAt: item.subscribedAt !== undefined ? item.subscribedAt : undefined,
          lastRebalancedAt: item.lastRebalancedAt !== undefined ? item.lastRebalancedAt : undefined,
          deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
      account: item.account ? 
        typeof item.account === 'object' && Object.keys(item.account).length === 1 && Object.keys(item.account)[0] === 'id'
    ? { connect: {
            id: item.account.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.account.id !== undefined ? item.account.id : undefined,
            type: item.account.type !== undefined ? {
                equals: item.account.type 
               } : undefined,
            userId: item.account.userId !== undefined ? {
                equals: item.account.userId 
               } : undefined,
          },
          create: {
            type: item.account.type !== undefined ? item.account.type : undefined,
            APIKey: item.account.APIKey !== undefined ? item.account.APIKey : undefined,
            APISecret: item.account.APISecret !== undefined ? item.account.APISecret : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? item.account.marketOpen : undefined,
            realTime: item.account.realTime !== undefined ? item.account.realTime : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? item.account.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? item.account.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? item.account.tradeAllocationPct : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? item.account.autoAllocation : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? item.account.minPercentageChange : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? item.account.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? item.account.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? item.account.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? item.account.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? item.account.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? item.account.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? item.account.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? item.account.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? item.account.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? item.account.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? item.account.minimumPriceChangePercent100 : undefined,
            deletedAt: item.account.deletedAt !== undefined ? item.account.deletedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        key: props.strategyRef.key !== undefined ? props.strategyRef.key : undefined,
        displayName: props.strategyRef.displayName !== undefined ? props.strategyRef.displayName : undefined,
        description: props.strategyRef.description !== undefined ? props.strategyRef.description : undefined,
        origin: props.strategyRef.origin !== undefined ? props.strategyRef.origin : undefined,
        lifecycleState: props.strategyRef.lifecycleState !== undefined ? props.strategyRef.lifecycleState : undefined,
        manifestHash: props.strategyRef.manifestHash !== undefined ? props.strategyRef.manifestHash : undefined,
        deletedAt: props.strategyRef.deletedAt !== undefined ? props.strategyRef.deletedAt : undefined,
    owner: props.strategyRef.owner ? 
      typeof props.strategyRef.owner === 'object' && Object.keys(props.strategyRef.owner).length === 1 && Object.keys(props.strategyRef.owner)[0] === 'id'
    ? { connect: {
          id: props.strategyRef.owner.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.strategyRef.owner.id !== undefined ? props.strategyRef.owner.id : undefined,
          email: props.strategyRef.owner.email !== undefined ? props.strategyRef.owner.email : undefined,
          name: props.strategyRef.owner.name !== undefined ? {
              equals: props.strategyRef.owner.name 
             } : undefined,
        },
        create: {
          name: props.strategyRef.owner.name !== undefined ? props.strategyRef.owner.name : undefined,
          email: props.strategyRef.owner.email !== undefined ? props.strategyRef.owner.email : undefined,
          emailVerified: props.strategyRef.owner.emailVerified !== undefined ? props.strategyRef.owner.emailVerified : undefined,
          image: props.strategyRef.owner.image !== undefined ? props.strategyRef.owner.image : undefined,
          avatarUrl: props.strategyRef.owner.avatarUrl !== undefined ? props.strategyRef.owner.avatarUrl : undefined,
          onboardingComplete: props.strategyRef.owner.onboardingComplete !== undefined ? props.strategyRef.owner.onboardingComplete : undefined,
          signupCategory: props.strategyRef.owner.signupCategory !== undefined ? props.strategyRef.owner.signupCategory : undefined,
          deletedAt: props.strategyRef.owner.deletedAt !== undefined ? props.strategyRef.owner.deletedAt : undefined,
          role: props.strategyRef.owner.role !== undefined ? props.strategyRef.owner.role : undefined,
          bio: props.strategyRef.owner.bio !== undefined ? props.strategyRef.owner.bio : undefined,
          jobTitle: props.strategyRef.owner.jobTitle !== undefined ? props.strategyRef.owner.jobTitle : undefined,
          currentAccount: props.strategyRef.owner.currentAccount !== undefined ? props.strategyRef.owner.currentAccount : undefined,
          plan: props.strategyRef.owner.plan !== undefined ? props.strategyRef.owner.plan : undefined,
          openaiAPIKey: props.strategyRef.owner.openaiAPIKey !== undefined ? props.strategyRef.owner.openaiAPIKey : undefined,
          openaiModel: props.strategyRef.owner.openaiModel !== undefined ? props.strategyRef.owner.openaiModel : undefined,
      customer: props.strategyRef.owner.customer ? 
        typeof props.strategyRef.owner.customer === 'object' && Object.keys(props.strategyRef.owner.customer).length === 1 && Object.keys(props.strategyRef.owner.customer)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.customer.id !== undefined ? props.strategyRef.owner.customer.id : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? {
                equals: props.strategyRef.owner.customer.authUserId 
               } : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? {
                equals: props.strategyRef.owner.customer.name 
               } : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? {
                equals: props.strategyRef.owner.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.strategyRef.owner.customer.authUserId !== undefined ? props.strategyRef.owner.customer.authUserId : undefined,
            name: props.strategyRef.owner.customer.name !== undefined ? props.strategyRef.owner.customer.name : undefined,
            plan: props.strategyRef.owner.customer.plan !== undefined ? props.strategyRef.owner.customer.plan : undefined,
            stripeCustomerId: props.strategyRef.owner.customer.stripeCustomerId !== undefined ? props.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? props.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.strategyRef.owner.customer.stripePriceId !== undefined ? props.strategyRef.owner.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? props.strategyRef.owner.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.strategyRef.owner.customer.jurisdiction !== undefined ? props.strategyRef.owner.customer.jurisdiction : undefined,
            riskProfile: props.strategyRef.owner.customer.riskProfile !== undefined ? props.strategyRef.owner.customer.riskProfile : undefined,
            amlStatus: props.strategyRef.owner.customer.amlStatus !== undefined ? props.strategyRef.owner.customer.amlStatus : undefined,
            lastKycUpdate: props.strategyRef.owner.customer.lastKycUpdate !== undefined ? props.strategyRef.owner.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.strategyRef.owner.accounts ? 
        Array.isArray(props.strategyRef.owner.accounts) && props.strategyRef.owner.accounts.length > 0 &&  props.strategyRef.owner.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            refresh_token: item.refresh_token !== undefined ? item.refresh_token : undefined,
            access_token: item.access_token !== undefined ? item.access_token : undefined,
            expires_at: item.expires_at !== undefined ? item.expires_at : undefined,
            token_type: item.token_type !== undefined ? item.token_type : undefined,
            scope: item.scope !== undefined ? item.scope : undefined,
            id_token: item.id_token !== undefined ? item.id_token : undefined,
            session_state: item.session_state !== undefined ? item.session_state : undefined,
          },
        }))
      } : undefined,
      sessions: props.strategyRef.owner.sessions ? 
        Array.isArray(props.strategyRef.owner.sessions) && props.strategyRef.owner.sessions.length > 0 &&  props.strategyRef.owner.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.sessions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            sessionToken: item.sessionToken !== undefined ? item.sessionToken : undefined,
            expires: item.expires !== undefined ? item.expires : undefined,
          },
        }))
      } : undefined,
      authenticators: props.strategyRef.owner.authenticators ? 
        Array.isArray(props.strategyRef.owner.authenticators) && props.strategyRef.owner.authenticators.length > 0 &&  props.strategyRef.owner.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authenticators.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            credentialID: item.credentialID !== undefined ? item.credentialID : undefined,
            publicKey: item.publicKey !== undefined ? item.publicKey : undefined,
            counter: item.counter !== undefined ? item.counter : undefined,
          },
        }))
      } : undefined,
      alpacaAccounts: props.strategyRef.owner.alpacaAccounts ? 
        Array.isArray(props.strategyRef.owner.alpacaAccounts) && props.strategyRef.owner.alpacaAccounts.length > 0 &&  props.strategyRef.owner.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.alpacaAccounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            APIKey: item.APIKey !== undefined ? item.APIKey : undefined,
            APISecret: item.APISecret !== undefined ? item.APISecret : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? item.marketOpen : undefined,
            realTime: item.realTime !== undefined ? item.realTime : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? item.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? item.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? item.tradeAllocationPct : undefined,
            autoAllocation: item.autoAllocation !== undefined ? item.autoAllocation : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? item.minPercentageChange : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? item.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? item.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? item.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? item.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? item.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? item.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? item.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? item.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? item.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? item.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? item.minimumPriceChangePercent100 : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      linkedProviders: props.strategyRef.owner.linkedProviders ? 
        Array.isArray(props.strategyRef.owner.linkedProviders) && props.strategyRef.owner.linkedProviders.length > 0 &&  props.strategyRef.owner.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.linkedProviders.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
          },
          create: {
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            email: item.email !== undefined ? item.email : undefined,
            accessToken: item.accessToken !== undefined ? item.accessToken : undefined,
            refreshToken: item.refreshToken !== undefined ? item.refreshToken : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            linkedAt: item.linkedAt !== undefined ? item.linkedAt : undefined,
          },
        }))
      } : undefined,
      accountLinkingRequests: props.strategyRef.owner.accountLinkingRequests ? 
        Array.isArray(props.strategyRef.owner.accountLinkingRequests) && props.strategyRef.owner.accountLinkingRequests.length > 0 &&  props.strategyRef.owner.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.accountLinkingRequests.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            verificationToken: item.verificationToken !== undefined ? item.verificationToken : undefined,
            userAgent: item.userAgent !== undefined ? item.userAgent : undefined,
            ipAddress: item.ipAddress !== undefined ? item.ipAddress : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            verifiedAt: item.verifiedAt !== undefined ? item.verifiedAt : undefined,
            approvedAt: item.approvedAt !== undefined ? item.approvedAt : undefined,
            rejectedAt: item.rejectedAt !== undefined ? item.rejectedAt : undefined,
          },
        }))
      } : undefined,
      reviewedWaitlistEntries: props.strategyRef.owner.reviewedWaitlistEntries ? 
        Array.isArray(props.strategyRef.owner.reviewedWaitlistEntries) && props.strategyRef.owner.reviewedWaitlistEntries.length > 0 &&  props.strategyRef.owner.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            email: item.email !== undefined ? item.email : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            fullName: item.fullName !== undefined ? item.fullName : undefined,
            companyName: item.companyName !== undefined ? item.companyName : undefined,
            companyWebsite: item.companyWebsite !== undefined ? item.companyWebsite : undefined,
            jobRole: item.jobRole !== undefined ? item.jobRole : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? item.professionalInvestorConfirmed : undefined,
            status: item.status !== undefined ? item.status : undefined,
            queuePosition: item.queuePosition !== undefined ? item.queuePosition : undefined,
            reviewedAt: item.reviewedAt !== undefined ? item.reviewedAt : undefined,
          },
        }))
      } : undefined,
      llmConfiguration: props.strategyRef.owner.llmConfiguration ? 
        typeof props.strategyRef.owner.llmConfiguration === 'object' && Object.keys(props.strategyRef.owner.llmConfiguration).length === 1 && Object.keys(props.strategyRef.owner.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.strategyRef.owner.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.strategyRef.owner.llmConfiguration.id !== undefined ? props.strategyRef.owner.llmConfiguration.id : undefined,
            userId: props.strategyRef.owner.llmConfiguration.userId !== undefined ? props.strategyRef.owner.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? props.strategyRef.owner.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? props.strategyRef.owner.llmConfiguration.miniProvider : undefined,
            normalProvider: props.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? props.strategyRef.owner.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? props.strategyRef.owner.llmConfiguration.advancedProvider : undefined,
            miniModel: props.strategyRef.owner.llmConfiguration.miniModel !== undefined ? props.strategyRef.owner.llmConfiguration.miniModel : undefined,
            normalModel: props.strategyRef.owner.llmConfiguration.normalModel !== undefined ? props.strategyRef.owner.llmConfiguration.normalModel : undefined,
            advancedModel: props.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? props.strategyRef.owner.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? props.strategyRef.owner.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.strategyRef.owner.orgMemberships ? 
        Array.isArray(props.strategyRef.owner.orgMemberships) && props.strategyRef.owner.orgMemberships.length > 0 &&  props.strategyRef.owner.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.orgMemberships.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      fundAssignments: props.strategyRef.owner.fundAssignments ? 
        Array.isArray(props.strategyRef.owner.fundAssignments) && props.strategyRef.owner.fundAssignments.length > 0 &&  props.strategyRef.owner.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.fundAssignments.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      managedFunds: props.strategyRef.owner.managedFunds ? 
        Array.isArray(props.strategyRef.owner.managedFunds) && props.strategyRef.owner.managedFunds.length > 0 &&  props.strategyRef.owner.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.managedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      operatedFunds: props.strategyRef.owner.operatedFunds ? 
        Array.isArray(props.strategyRef.owner.operatedFunds) && props.strategyRef.owner.operatedFunds.length > 0 &&  props.strategyRef.owner.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.operatedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      ownedMandates: props.strategyRef.owner.ownedMandates ? 
        Array.isArray(props.strategyRef.owner.ownedMandates) && props.strategyRef.owner.ownedMandates.length > 0 &&  props.strategyRef.owner.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.ownedMandates.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            activeVersionId: item.activeVersionId !== undefined ? item.activeVersionId : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            scopeKind: item.scopeKind !== undefined ? item.scopeKind : undefined,
            klass: item.klass !== undefined ? item.klass : undefined,
            name: item.name !== undefined ? item.name : undefined,
            personaScope: item.personaScope !== undefined ? item.personaScope : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      authoredMandateVersions: props.strategyRef.owner.authoredMandateVersions ? 
        Array.isArray(props.strategyRef.owner.authoredMandateVersions) && props.strategyRef.owner.authoredMandateVersions.length > 0 &&  props.strategyRef.owner.authoredMandateVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.authoredMandateVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.authoredMandateVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateId: item.mandateId !== undefined ? {
                equals: item.mandateId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            versionLabel: item.versionLabel !== undefined ? item.versionLabel : undefined,
            versionSeq: item.versionSeq !== undefined ? item.versionSeq : undefined,
            status: item.status !== undefined ? item.status : undefined,
            summary: item.summary !== undefined ? item.summary : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
        }))
      } : undefined,
      mandateApprovalsDecided: props.strategyRef.owner.mandateApprovalsDecided ? 
        Array.isArray(props.strategyRef.owner.mandateApprovalsDecided) && props.strategyRef.owner.mandateApprovalsDecided.length > 0 &&  props.strategyRef.owner.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateVersionId: item.mandateVersionId !== undefined ? {
                equals: item.mandateVersionId 
               } : undefined,
            correlationId: item.correlationId !== undefined ? {
                equals: item.correlationId 
               } : undefined,
          },
          create: {
            action: item.action !== undefined ? item.action : undefined,
            decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
            rationale: item.rationale !== undefined ? item.rationale : undefined,
            correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
          },
        }))
      } : undefined,
      investorProfiles: props.strategyRef.owner.investorProfiles ? 
        Array.isArray(props.strategyRef.owner.investorProfiles) && props.strategyRef.owner.investorProfiles.length > 0 &&  props.strategyRef.owner.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.investorProfiles.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            email: item.email !== undefined ? item.email : undefined,
            type: item.type !== undefined ? item.type : undefined,
            status: item.status !== undefined ? item.status : undefined,
            kycStatus: item.kycStatus !== undefined ? item.kycStatus : undefined,
            jurisdiction: item.jurisdiction !== undefined ? item.jurisdiction : undefined,
            joinedAt: item.joinedAt !== undefined ? item.joinedAt : undefined,
            externalRef: item.externalRef !== undefined ? item.externalRef : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      notificationDeliveries: props.strategyRef.owner.notificationDeliveries ? 
        Array.isArray(props.strategyRef.owner.notificationDeliveries) && props.strategyRef.owner.notificationDeliveries.length > 0 &&  props.strategyRef.owner.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationDeliveries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
            recipientUserId: item.recipientUserId !== undefined ? {
                equals: item.recipientUserId 
               } : undefined,
            templateId: item.templateId !== undefined ? {
                equals: item.templateId 
               } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                equals: item.providerMessageId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            channel: item.channel !== undefined ? item.channel : undefined,
            templateId: item.templateId !== undefined ? item.templateId : undefined,
            templateVersion: item.templateVersion !== undefined ? item.templateVersion : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerMessageId: item.providerMessageId !== undefined ? item.providerMessageId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            statusDetail: item.statusDetail !== undefined ? item.statusDetail : undefined,
            sentAt: item.sentAt !== undefined ? item.sentAt : undefined,
            deliveredAt: item.deliveredAt !== undefined ? item.deliveredAt : undefined,
            readAt: item.readAt !== undefined ? item.readAt : undefined,
          },
        }))
      } : undefined,
      notificationPreferences: props.strategyRef.owner.notificationPreferences ? 
        Array.isArray(props.strategyRef.owner.notificationPreferences) && props.strategyRef.owner.notificationPreferences.length > 0 &&  props.strategyRef.owner.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.strategyRef.owner.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.strategyRef.owner.notificationPreferences.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
          },
          create: {
            eventId: item.eventId !== undefined ? item.eventId : undefined,
            channel: item.channel !== undefined ? item.channel : undefined,
            enabled: item.enabled !== undefined ? item.enabled : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    subscriptions: props.strategyRef.subscriptions ? 
      Array.isArray(props.strategyRef.subscriptions) && props.strategyRef.subscriptions.length > 0 &&  props.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.strategyRef.subscriptions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.strategyRef.subscriptions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          accountId: item.accountId !== undefined ? {
              equals: item.accountId 
             } : undefined,
          strategyId: item.strategyId !== undefined ? {
              equals: item.strategyId 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          status: item.status !== undefined ? item.status : undefined,
          units: item.units !== undefined ? item.units : undefined,
          costBasis: item.costBasis !== undefined ? item.costBasis : undefined,
          realizedPL: item.realizedPL !== undefined ? item.realizedPL : undefined,
          targetAllocationPct: item.targetAllocationPct !== undefined ? item.targetAllocationPct : undefined,
          currency: item.currency !== undefined ? item.currency : undefined,
          subscribedAt: item.subscribedAt !== undefined ? item.subscribedAt : undefined,
          lastRebalancedAt: item.lastRebalancedAt !== undefined ? item.lastRebalancedAt : undefined,
          deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
      account: item.account ? 
        typeof item.account === 'object' && Object.keys(item.account).length === 1 && Object.keys(item.account)[0] === 'id'
    ? { connect: {
            id: item.account.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.account.id !== undefined ? item.account.id : undefined,
            type: item.account.type !== undefined ? {
                equals: item.account.type 
               } : undefined,
            userId: item.account.userId !== undefined ? {
                equals: item.account.userId 
               } : undefined,
          },
          create: {
            type: item.account.type !== undefined ? item.account.type : undefined,
            APIKey: item.account.APIKey !== undefined ? item.account.APIKey : undefined,
            APISecret: item.account.APISecret !== undefined ? item.account.APISecret : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? item.account.marketOpen : undefined,
            realTime: item.account.realTime !== undefined ? item.account.realTime : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? item.account.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? item.account.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? item.account.tradeAllocationPct : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? item.account.autoAllocation : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? item.account.minPercentageChange : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? item.account.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? item.account.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? item.account.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? item.account.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? item.account.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? item.account.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? item.account.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? item.account.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? item.account.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? item.account.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? item.account.minimumPriceChangePercent100 : undefined,
            deletedAt: item.account.deletedAt !== undefined ? item.account.deletedAt : undefined,
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
          mutation: UPSERT_ONE_TRADE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneTrade) {
          return response.data.upsertOneTrade;
        } else {
          return null as unknown as TradeType;
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
          logger.error("Non-retryable constraint violation in upsertOneTrade", {
            operation: 'upsertOneTrade',
            model: 'Trade',
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
          logger.warn("Database connection error in upsertOneTrade, retrying...", {
            operation: 'upsertOneTrade',
            model: 'Trade',
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
            operation: 'upsertOneTrade',
            model: 'Trade',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneTrade',
            model: 'Trade',
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
   * Update multiple Trade records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of Trade objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: TradeType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_TRADE = gql`
          mutation updateManyTrade($data: [TradeCreateManyInput!]!) {
            updateManyTrade(data: $data) {
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
  signal: prop.signal !== undefined ? {
            set: prop.signal 
           } : undefined,
  strategy: prop.strategy !== undefined ? {
            set: prop.strategy 
           } : undefined,
  analysis: prop.analysis !== undefined ? {
            set: prop.analysis 
           } : undefined,
  summary: prop.summary !== undefined ? {
            set: prop.summary 
           } : undefined,
  confidence: prop.confidence !== undefined ? {
            set: prop.confidence 
           } : undefined,
  timestamp: prop.timestamp !== undefined ? {
            set: prop.timestamp 
           } : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,
  status: prop.status !== undefined ? {
            set: prop.status 
           } : undefined,
  deletedAt: prop.deletedAt !== undefined ? {
            set: prop.deletedAt 
           } : undefined,
  symbol: prop.symbol !== undefined ? {
            set: prop.symbol 
           } : undefined,
  side: prop.side !== undefined ? {
            set: prop.side 
           } : undefined,
  entryPrice: prop.entryPrice !== undefined ? {
            set: prop.entryPrice 
           } : undefined,
  exitPrice: prop.exitPrice !== undefined ? {
            set: prop.exitPrice 
           } : undefined,
  entryQty: prop.entryQty !== undefined ? {
            set: prop.entryQty 
           } : undefined,
  exitQty: prop.exitQty !== undefined ? {
            set: prop.exitQty 
           } : undefined,
  entryValue: prop.entryValue !== undefined ? {
            set: prop.entryValue 
           } : undefined,
  exitValue: prop.exitValue !== undefined ? {
            set: prop.exitValue 
           } : undefined,
  entryTime: prop.entryTime !== undefined ? {
            set: prop.entryTime 
           } : undefined,
  exitTime: prop.exitTime !== undefined ? {
            set: prop.exitTime 
           } : undefined,
  pnlAmount: prop.pnlAmount !== undefined ? {
            set: prop.pnlAmount 
           } : undefined,
  pnlPercent: prop.pnlPercent !== undefined ? {
            set: prop.pnlPercent 
           } : undefined,
  durationMinutes: prop.durationMinutes !== undefined ? {
            set: prop.durationMinutes 
           } : undefined,
  marketPhase: prop.marketPhase !== undefined ? {
            set: prop.marketPhase 
           } : undefined,
  marketVolatility: prop.marketVolatility !== undefined ? {
            set: prop.marketVolatility 
           } : undefined,
  sessionHorizonMinutes: prop.sessionHorizonMinutes !== undefined ? {
            set: prop.sessionHorizonMinutes 
           } : undefined,
  thresholdsJson: prop.thresholdsJson !== undefined ? {
            set: prop.thresholdsJson 
           } : undefined,
  thesisVersion: prop.thesisVersion !== undefined ? {
            set: prop.thesisVersion 
           } : undefined,
  lastReunderwrittenAt: prop.lastReunderwrittenAt !== undefined ? {
            set: prop.lastReunderwrittenAt 
           } : undefined,
  supersededById: prop.supersededById !== undefined ? {
            set: prop.supersededById 
           } : undefined,
  rejectionMetadata: prop.rejectionMetadata !== undefined ? prop.rejectionMetadata : undefined,
  signalSource: prop.signalSource !== undefined ? {
            set: prop.signalSource 
           } : undefined,
  signalSourceType: prop.signalSourceType !== undefined ? {
            set: prop.signalSourceType 
           } : undefined,
  signalId: prop.signalId !== undefined ? {
            set: prop.signalId 
           } : undefined,
  pathway: prop.pathway !== undefined ? {
            set: prop.pathway 
           } : undefined,
  pathwayType: prop.pathwayType !== undefined ? {
            set: prop.pathwayType 
           } : undefined,
  exitTier: prop.exitTier !== undefined ? {
            set: prop.exitTier 
           } : undefined,
  exitTierType: prop.exitTierType !== undefined ? {
            set: prop.exitTierType 
           } : undefined,
  actions: prop.actions ? 
  Array.isArray(prop.actions) && prop.actions.length > 0 && prop.actions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: prop.actions.map((item) => ({
    id: item.id
  }))
} : { upsert: prop.actions.map((item) => ({
      where: {
        id: item.id !== undefined ? item.id : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? item.alpacaOrderId : undefined,
        tradeId: item.tradeId !== undefined ? {
            equals: item.tradeId
          } : undefined,
        type: item.type !== undefined ? {
            equals: item.type
          } : undefined,
        status: item.status !== undefined ? {
            equals: item.status
          } : undefined,
        supersededActionId: item.supersededActionId !== undefined ? {
            equals: item.supersededActionId
          } : undefined,
      },
      update: {
        id: item.id !== undefined ? {
            set: item.id
          } : undefined,
        sequence: item.sequence !== undefined ? {
            set: item.sequence
          } : undefined,
        type: item.type !== undefined ? {
            set: item.type
          } : undefined,
        primary: item.primary !== undefined ? {
            set: item.primary
          } : undefined,
        note: item.note !== undefined ? {
            set: item.note
          } : undefined,
        status: item.status !== undefined ? {
            set: item.status
          } : undefined,
        deletedAt: item.deletedAt !== undefined ? {
            set: item.deletedAt
          } : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? {
            set: item.alpacaOrderId
          } : undefined,
        supersededActionId: item.supersededActionId !== undefined ? {
            set: item.supersededActionId
          } : undefined,
        triggerSource: item.triggerSource !== undefined ? {
            set: item.triggerSource
          } : undefined,
        triggerSourceType: item.triggerSourceType !== undefined ? {
            set: item.triggerSourceType
          } : undefined,
      },
      create: {
        sequence: item.sequence !== undefined ? item.sequence : undefined,
        type: item.type !== undefined ? item.type : undefined,
        primary: item.primary !== undefined ? item.primary : undefined,
        note: item.note !== undefined ? item.note : undefined,
        status: item.status !== undefined ? item.status : undefined,
        deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
        alpacaOrderId: item.alpacaOrderId !== undefined ? item.alpacaOrderId : undefined,
        supersededActionId: item.supersededActionId !== undefined ? item.supersededActionId : undefined,
        triggerSource: item.triggerSource !== undefined ? item.triggerSource : undefined,
        triggerSourceType: item.triggerSourceType !== undefined ? item.triggerSourceType : undefined,
      },
    }))
  } : undefined,
  strategyRef: prop.strategyRef ? 
  typeof prop.strategyRef === 'object' && Object.keys(prop.strategyRef).length === 1 && (Object.keys(prop.strategyRef)[0] === 'id' || Object.keys(prop.strategyRef)[0] === 'symbol')
? {
  connect: {
    id: prop.strategyRef.id
  }
} : { upsert: {
      where: {
        id: prop.strategyRef.id !== undefined ? {
            equals: prop.strategyRef.id
          } : undefined,
        key: prop.strategyRef.key !== undefined ? {
            equals: prop.strategyRef.key
          } : undefined,
        ownerUserId: prop.strategyRef.ownerUserId !== undefined ? {
            equals: prop.strategyRef.ownerUserId
          } : undefined,
      },
      update: {
        id: prop.strategyRef.id !== undefined ? {
            set: prop.strategyRef.id
          } : undefined,
        key: prop.strategyRef.key !== undefined ? {
            set: prop.strategyRef.key
          } : undefined,
        displayName: prop.strategyRef.displayName !== undefined ? {
            set: prop.strategyRef.displayName
          } : undefined,
        description: prop.strategyRef.description !== undefined ? {
            set: prop.strategyRef.description
          } : undefined,
        origin: prop.strategyRef.origin !== undefined ? {
            set: prop.strategyRef.origin
          } : undefined,
        lifecycleState: prop.strategyRef.lifecycleState !== undefined ? {
            set: prop.strategyRef.lifecycleState
          } : undefined,
        manifestHash: prop.strategyRef.manifestHash !== undefined ? {
            set: prop.strategyRef.manifestHash
          } : undefined,
        deletedAt: prop.strategyRef.deletedAt !== undefined ? {
            set: prop.strategyRef.deletedAt
          } : undefined,
    owner: prop.strategyRef.owner ? 
    typeof prop.strategyRef.owner === 'object' && Object.keys(prop.strategyRef.owner).length === 1 && (Object.keys(prop.strategyRef.owner)[0] === 'id' || Object.keys(prop.strategyRef.owner)[0] === 'symbol')
? {
    connect: {
      id: prop.strategyRef.owner.id
    }
} : { upsert: {
        where: {
          id: prop.strategyRef.owner.id !== undefined ? {
              equals: prop.strategyRef.owner.id
            } : undefined,
          name: prop.strategyRef.owner.name !== undefined ? {
              equals: prop.strategyRef.owner.name
            } : undefined,
          email: prop.strategyRef.owner.email !== undefined ? {
              equals: prop.strategyRef.owner.email
            } : undefined,
          customerId: prop.strategyRef.owner.customerId !== undefined ? {
              equals: prop.strategyRef.owner.customerId
            } : undefined,
        },
        update: {
          id: prop.strategyRef.owner.id !== undefined ? {
              set: prop.strategyRef.owner.id
            } : undefined,
          name: prop.strategyRef.owner.name !== undefined ? {
              set: prop.strategyRef.owner.name
            } : undefined,
          email: prop.strategyRef.owner.email !== undefined ? {
              set: prop.strategyRef.owner.email
            } : undefined,
          emailVerified: prop.strategyRef.owner.emailVerified !== undefined ? {
              set: prop.strategyRef.owner.emailVerified
            } : undefined,
          image: prop.strategyRef.owner.image !== undefined ? {
              set: prop.strategyRef.owner.image
            } : undefined,
          avatarUrl: prop.strategyRef.owner.avatarUrl !== undefined ? {
              set: prop.strategyRef.owner.avatarUrl
            } : undefined,
          onboardingComplete: prop.strategyRef.owner.onboardingComplete !== undefined ? {
              set: prop.strategyRef.owner.onboardingComplete
            } : undefined,
          signupCategory: prop.strategyRef.owner.signupCategory !== undefined ? {
              set: prop.strategyRef.owner.signupCategory
            } : undefined,
          deletedAt: prop.strategyRef.owner.deletedAt !== undefined ? {
              set: prop.strategyRef.owner.deletedAt
            } : undefined,
          role: prop.strategyRef.owner.role !== undefined ? {
              set: prop.strategyRef.owner.role
            } : undefined,
          bio: prop.strategyRef.owner.bio !== undefined ? {
              set: prop.strategyRef.owner.bio
            } : undefined,
          jobTitle: prop.strategyRef.owner.jobTitle !== undefined ? {
              set: prop.strategyRef.owner.jobTitle
            } : undefined,
          currentAccount: prop.strategyRef.owner.currentAccount !== undefined ? {
              set: prop.strategyRef.owner.currentAccount
            } : undefined,
          plan: prop.strategyRef.owner.plan !== undefined ? {
              set: prop.strategyRef.owner.plan
            } : undefined,
          openaiAPIKey: prop.strategyRef.owner.openaiAPIKey !== undefined ? {
              set: prop.strategyRef.owner.openaiAPIKey
            } : undefined,
          openaiModel: prop.strategyRef.owner.openaiModel !== undefined ? {
              set: prop.strategyRef.owner.openaiModel
            } : undefined,
      customer: prop.strategyRef.owner.customer ? 
      typeof prop.strategyRef.owner.customer === 'object' && Object.keys(prop.strategyRef.owner.customer).length === 1 && (Object.keys(prop.strategyRef.owner.customer)[0] === 'id' || Object.keys(prop.strategyRef.owner.customer)[0] === 'symbol')
? {
      connect: {
        id: prop.strategyRef.owner.customer.id
      }
} : { upsert: {
          where: {
            id: prop.strategyRef.owner.customer.id !== undefined ? {
                equals: prop.strategyRef.owner.customer.id
              } : undefined,
            authUserId: prop.strategyRef.owner.customer.authUserId !== undefined ? {
                equals: prop.strategyRef.owner.customer.authUserId
              } : undefined,
            name: prop.strategyRef.owner.customer.name !== undefined ? {
                equals: prop.strategyRef.owner.customer.name
              } : undefined,
            stripeCustomerId: prop.strategyRef.owner.customer.stripeCustomerId !== undefined ? {
                equals: prop.strategyRef.owner.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: prop.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? {
                equals: prop.strategyRef.owner.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: prop.strategyRef.owner.customer.stripePriceId !== undefined ? {
                equals: prop.strategyRef.owner.customer.stripePriceId
              } : undefined,
          },
          update: {
            authUserId: prop.strategyRef.owner.customer.authUserId !== undefined ? {
                set: prop.strategyRef.owner.customer.authUserId
              } : undefined,
            name: prop.strategyRef.owner.customer.name !== undefined ? {
                set: prop.strategyRef.owner.customer.name
              } : undefined,
            plan: prop.strategyRef.owner.customer.plan !== undefined ? {
                set: prop.strategyRef.owner.customer.plan
              } : undefined,
            stripeCustomerId: prop.strategyRef.owner.customer.stripeCustomerId !== undefined ? {
                set: prop.strategyRef.owner.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: prop.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? {
                set: prop.strategyRef.owner.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: prop.strategyRef.owner.customer.stripePriceId !== undefined ? {
                set: prop.strategyRef.owner.customer.stripePriceId
              } : undefined,
            stripeCurrentPeriodEnd: prop.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? {
                set: prop.strategyRef.owner.customer.stripeCurrentPeriodEnd
              } : undefined,
            jurisdiction: prop.strategyRef.owner.customer.jurisdiction !== undefined ? {
                set: prop.strategyRef.owner.customer.jurisdiction
              } : undefined,
            riskProfile: prop.strategyRef.owner.customer.riskProfile !== undefined ? {
                set: prop.strategyRef.owner.customer.riskProfile
              } : undefined,
            amlStatus: prop.strategyRef.owner.customer.amlStatus !== undefined ? {
                set: prop.strategyRef.owner.customer.amlStatus
              } : undefined,
            lastKycUpdate: prop.strategyRef.owner.customer.lastKycUpdate !== undefined ? {
                set: prop.strategyRef.owner.customer.lastKycUpdate
              } : undefined,
          },
          create: {
            authUserId: prop.strategyRef.owner.customer.authUserId !== undefined ? prop.strategyRef.owner.customer.authUserId : undefined,
            name: prop.strategyRef.owner.customer.name !== undefined ? prop.strategyRef.owner.customer.name : undefined,
            plan: prop.strategyRef.owner.customer.plan !== undefined ? prop.strategyRef.owner.customer.plan : undefined,
            stripeCustomerId: prop.strategyRef.owner.customer.stripeCustomerId !== undefined ? prop.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: prop.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? prop.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            stripePriceId: prop.strategyRef.owner.customer.stripePriceId !== undefined ? prop.strategyRef.owner.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: prop.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? prop.strategyRef.owner.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: prop.strategyRef.owner.customer.jurisdiction !== undefined ? prop.strategyRef.owner.customer.jurisdiction : undefined,
            riskProfile: prop.strategyRef.owner.customer.riskProfile !== undefined ? prop.strategyRef.owner.customer.riskProfile : undefined,
            amlStatus: prop.strategyRef.owner.customer.amlStatus !== undefined ? prop.strategyRef.owner.customer.amlStatus : undefined,
            lastKycUpdate: prop.strategyRef.owner.customer.lastKycUpdate !== undefined ? prop.strategyRef.owner.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: prop.strategyRef.owner.accounts ? 
      Array.isArray(prop.strategyRef.owner.accounts) && prop.strategyRef.owner.accounts.length > 0 && prop.strategyRef.owner.accounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.accounts.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.accounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            type: item.type !== undefined ? {
                equals: item.type
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            type: item.type !== undefined ? {
                set: item.type
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                set: item.providerAccountId
              } : undefined,
            refresh_token: item.refresh_token !== undefined ? {
                set: item.refresh_token
              } : undefined,
            access_token: item.access_token !== undefined ? {
                set: item.access_token
              } : undefined,
            expires_at: item.expires_at !== undefined ? {
                set: item.expires_at
              } : undefined,
            token_type: item.token_type !== undefined ? {
                set: item.token_type
              } : undefined,
            scope: item.scope !== undefined ? {
                set: item.scope
              } : undefined,
            id_token: item.id_token !== undefined ? {
                set: item.id_token
              } : undefined,
            session_state: item.session_state !== undefined ? {
                set: item.session_state
              } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            refresh_token: item.refresh_token !== undefined ? item.refresh_token : undefined,
            access_token: item.access_token !== undefined ? item.access_token : undefined,
            expires_at: item.expires_at !== undefined ? item.expires_at : undefined,
            token_type: item.token_type !== undefined ? item.token_type : undefined,
            scope: item.scope !== undefined ? item.scope : undefined,
            id_token: item.id_token !== undefined ? item.id_token : undefined,
            session_state: item.session_state !== undefined ? item.session_state : undefined,
          },
        }))
      } : undefined,
      sessions: prop.strategyRef.owner.sessions ? 
      Array.isArray(prop.strategyRef.owner.sessions) && prop.strategyRef.owner.sessions.length > 0 && prop.strategyRef.owner.sessions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.sessions.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.sessions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            sessionToken: item.sessionToken !== undefined ? {
                set: item.sessionToken
              } : undefined,
            expires: item.expires !== undefined ? {
                set: item.expires
              } : undefined,
          },
          create: {
            sessionToken: item.sessionToken !== undefined ? item.sessionToken : undefined,
            expires: item.expires !== undefined ? item.expires : undefined,
          },
        }))
      } : undefined,
      authenticators: prop.strategyRef.owner.authenticators ? 
      Array.isArray(prop.strategyRef.owner.authenticators) && prop.strategyRef.owner.authenticators.length > 0 && prop.strategyRef.owner.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.authenticators.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.authenticators.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            credentialID: item.credentialID !== undefined ? {
                set: item.credentialID
              } : undefined,
            publicKey: item.publicKey !== undefined ? {
                set: item.publicKey
              } : undefined,
            counter: item.counter !== undefined ? {
                set: item.counter
              } : undefined,
          },
          create: {
            credentialID: item.credentialID !== undefined ? item.credentialID : undefined,
            publicKey: item.publicKey !== undefined ? item.publicKey : undefined,
            counter: item.counter !== undefined ? item.counter : undefined,
          },
        }))
      } : undefined,
      alpacaAccounts: prop.strategyRef.owner.alpacaAccounts ? 
      Array.isArray(prop.strategyRef.owner.alpacaAccounts) && prop.strategyRef.owner.alpacaAccounts.length > 0 && prop.strategyRef.owner.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.alpacaAccounts.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.alpacaAccounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            type: item.type !== undefined ? {
                equals: item.type
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            type: item.type !== undefined ? {
                set: item.type
              } : undefined,
            APIKey: item.APIKey !== undefined ? {
                set: item.APIKey
              } : undefined,
            APISecret: item.APISecret !== undefined ? {
                set: item.APISecret
              } : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? {
                set: item.marketOpen
              } : undefined,
            realTime: item.realTime !== undefined ? {
                set: item.realTime
              } : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? {
                set: item.cryptoTradingEnabled
              } : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs
              } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? {
                set: item.cryptoTradeAllocationPct
              } : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? {
                set: item.tradeAllocationPct
              } : undefined,
            autoAllocation: item.autoAllocation !== undefined ? {
                set: item.autoAllocation
              } : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? {
                set: item.minPercentageChange
              } : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? {
                set: item.volumeThreshold
              } : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? {
                set: item.enablePortfolioTrailingStop
              } : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? {
                set: item.portfolioTrailPercent
              } : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? {
                set: item.portfolioProfitThresholdPercent
              } : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? {
                set: item.reducedPortfolioTrailPercent
              } : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? {
                set: item.defaultTrailingStopPercentage100
              } : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? {
                set: item.firstTrailReductionThreshold100
              } : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? {
                set: item.secondTrailReductionThreshold100
              } : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? {
                set: item.firstReducedTrailPercentage100
              } : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? {
                set: item.secondReducedTrailPercentage100
              } : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? {
                set: item.minimumPriceChangePercent100
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            APIKey: item.APIKey !== undefined ? item.APIKey : undefined,
            APISecret: item.APISecret !== undefined ? item.APISecret : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? item.marketOpen : undefined,
            realTime: item.realTime !== undefined ? item.realTime : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? item.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? item.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? item.tradeAllocationPct : undefined,
            autoAllocation: item.autoAllocation !== undefined ? item.autoAllocation : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? item.minPercentageChange : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? item.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? item.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? item.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? item.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? item.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? item.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? item.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? item.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? item.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? item.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? item.minimumPriceChangePercent100 : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      linkedProviders: prop.strategyRef.owner.linkedProviders ? 
      Array.isArray(prop.strategyRef.owner.linkedProviders) && prop.strategyRef.owner.linkedProviders.length > 0 && prop.strategyRef.owner.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.linkedProviders.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.linkedProviders.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId
              } : undefined,
            email: item.email !== undefined ? {
                equals: item.email
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                set: item.providerAccountId
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            accessToken: item.accessToken !== undefined ? {
                set: item.accessToken
              } : undefined,
            refreshToken: item.refreshToken !== undefined ? {
                set: item.refreshToken
              } : undefined,
            expiresAt: item.expiresAt !== undefined ? {
                set: item.expiresAt
              } : undefined,
            linkedAt: item.linkedAt !== undefined ? {
                set: item.linkedAt
              } : undefined,
          },
          create: {
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            email: item.email !== undefined ? item.email : undefined,
            accessToken: item.accessToken !== undefined ? item.accessToken : undefined,
            refreshToken: item.refreshToken !== undefined ? item.refreshToken : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            linkedAt: item.linkedAt !== undefined ? item.linkedAt : undefined,
          },
        }))
      } : undefined,
      accountLinkingRequests: prop.strategyRef.owner.accountLinkingRequests ? 
      Array.isArray(prop.strategyRef.owner.accountLinkingRequests) && prop.strategyRef.owner.accountLinkingRequests.length > 0 && prop.strategyRef.owner.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.accountLinkingRequests.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.accountLinkingRequests.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            email: item.email !== undefined ? {
                equals: item.email
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                set: item.providerAccountId
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            verificationToken: item.verificationToken !== undefined ? {
                set: item.verificationToken
              } : undefined,
            userAgent: item.userAgent !== undefined ? {
                set: item.userAgent
              } : undefined,
            ipAddress: item.ipAddress !== undefined ? {
                set: item.ipAddress
              } : undefined,
            expiresAt: item.expiresAt !== undefined ? {
                set: item.expiresAt
              } : undefined,
            verifiedAt: item.verifiedAt !== undefined ? {
                set: item.verifiedAt
              } : undefined,
            approvedAt: item.approvedAt !== undefined ? {
                set: item.approvedAt
              } : undefined,
            rejectedAt: item.rejectedAt !== undefined ? {
                set: item.rejectedAt
              } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            verificationToken: item.verificationToken !== undefined ? item.verificationToken : undefined,
            userAgent: item.userAgent !== undefined ? item.userAgent : undefined,
            ipAddress: item.ipAddress !== undefined ? item.ipAddress : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            verifiedAt: item.verifiedAt !== undefined ? item.verifiedAt : undefined,
            approvedAt: item.approvedAt !== undefined ? item.approvedAt : undefined,
            rejectedAt: item.rejectedAt !== undefined ? item.rejectedAt : undefined,
          },
        }))
      } : undefined,
      reviewedWaitlistEntries: prop.strategyRef.owner.reviewedWaitlistEntries ? 
      Array.isArray(prop.strategyRef.owner.reviewedWaitlistEntries) && prop.strategyRef.owner.reviewedWaitlistEntries.length > 0 && prop.strategyRef.owner.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            email: item.email !== undefined ? item.email : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            reviewedById: item.reviewedById !== undefined ? {
                equals: item.reviewedById
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            fullName: item.fullName !== undefined ? {
                set: item.fullName
              } : undefined,
            companyName: item.companyName !== undefined ? {
                set: item.companyName
              } : undefined,
            companyWebsite: item.companyWebsite !== undefined ? {
                set: item.companyWebsite
              } : undefined,
            jobRole: item.jobRole !== undefined ? {
                set: item.jobRole
              } : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? {
                set: item.professionalInvestorConfirmed
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            queuePosition: item.queuePosition !== undefined ? {
                set: item.queuePosition
              } : undefined,
            reviewedAt: item.reviewedAt !== undefined ? {
                set: item.reviewedAt
              } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            fullName: item.fullName !== undefined ? item.fullName : undefined,
            companyName: item.companyName !== undefined ? item.companyName : undefined,
            companyWebsite: item.companyWebsite !== undefined ? item.companyWebsite : undefined,
            jobRole: item.jobRole !== undefined ? item.jobRole : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? item.professionalInvestorConfirmed : undefined,
            status: item.status !== undefined ? item.status : undefined,
            queuePosition: item.queuePosition !== undefined ? item.queuePosition : undefined,
            reviewedAt: item.reviewedAt !== undefined ? item.reviewedAt : undefined,
          },
        }))
      } : undefined,
      llmConfiguration: prop.strategyRef.owner.llmConfiguration ? 
      typeof prop.strategyRef.owner.llmConfiguration === 'object' && Object.keys(prop.strategyRef.owner.llmConfiguration).length === 1 && (Object.keys(prop.strategyRef.owner.llmConfiguration)[0] === 'id' || Object.keys(prop.strategyRef.owner.llmConfiguration)[0] === 'symbol')
? {
      connect: {
        id: prop.strategyRef.owner.llmConfiguration.id
      }
} : { upsert: {
          where: {
            id: prop.strategyRef.owner.llmConfiguration.id !== undefined ? {
                equals: prop.strategyRef.owner.llmConfiguration.id
              } : undefined,
            userId: prop.strategyRef.owner.llmConfiguration.userId !== undefined ? {
                equals: prop.strategyRef.owner.llmConfiguration.userId
              } : undefined,
          },
          update: {
            id: prop.strategyRef.owner.llmConfiguration.id !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.id
              } : undefined,
            defaultProvider: prop.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.defaultProvider
              } : undefined,
            miniProvider: prop.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.miniProvider
              } : undefined,
            normalProvider: prop.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.normalProvider
              } : undefined,
            advancedProvider: prop.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.advancedProvider
              } : undefined,
            miniModel: prop.strategyRef.owner.llmConfiguration.miniModel !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.miniModel
              } : undefined,
            normalModel: prop.strategyRef.owner.llmConfiguration.normalModel !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.normalModel
              } : undefined,
            advancedModel: prop.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.advancedModel
              } : undefined,
            openaiApiKey: prop.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.openaiApiKey
              } : undefined,
            anthropicApiKey: prop.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.anthropicApiKey
              } : undefined,
            deepseekApiKey: prop.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.deepseekApiKey
              } : undefined,
            kimiApiKey: prop.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.kimiApiKey
              } : undefined,
            qwenApiKey: prop.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.qwenApiKey
              } : undefined,
            xaiApiKey: prop.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.xaiApiKey
              } : undefined,
            geminiApiKey: prop.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.geminiApiKey
              } : undefined,
            deepinfraApiKey: prop.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? {
                set: prop.strategyRef.owner.llmConfiguration.deepinfraApiKey
              } : undefined,
          },
          create: {
            defaultProvider: prop.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.defaultProvider : undefined,
            miniProvider: prop.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.miniProvider : undefined,
            normalProvider: prop.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.normalProvider : undefined,
            advancedProvider: prop.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.advancedProvider : undefined,
            miniModel: prop.strategyRef.owner.llmConfiguration.miniModel !== undefined ? prop.strategyRef.owner.llmConfiguration.miniModel : undefined,
            normalModel: prop.strategyRef.owner.llmConfiguration.normalModel !== undefined ? prop.strategyRef.owner.llmConfiguration.normalModel : undefined,
            advancedModel: prop.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? prop.strategyRef.owner.llmConfiguration.advancedModel : undefined,
            openaiApiKey: prop.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: prop.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: prop.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: prop.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: prop.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: prop.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: prop.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: prop.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: prop.strategyRef.owner.orgMemberships ? 
      Array.isArray(prop.strategyRef.owner.orgMemberships) && prop.strategyRef.owner.orgMemberships.length > 0 && prop.strategyRef.owner.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.orgMemberships.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.orgMemberships.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            role: item.role !== undefined ? {
                set: item.role
              } : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions
              } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      fundAssignments: prop.strategyRef.owner.fundAssignments ? 
      Array.isArray(prop.strategyRef.owner.fundAssignments) && prop.strategyRef.owner.fundAssignments.length > 0 && prop.strategyRef.owner.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.fundAssignments.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.fundAssignments.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            role: item.role !== undefined ? {
                set: item.role
              } : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions
              } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      managedFunds: prop.strategyRef.owner.managedFunds ? 
      Array.isArray(prop.strategyRef.owner.managedFunds) && prop.strategyRef.owner.managedFunds.length > 0 && prop.strategyRef.owner.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.managedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.managedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            managerId: item.managerId !== undefined ? {
                equals: item.managerId
              } : undefined,
            operatorId: item.operatorId !== undefined ? {
                equals: item.operatorId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                set: item.slug
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            currency: item.currency !== undefined ? {
                set: item.currency
              } : undefined,
            inceptionDate: item.inceptionDate !== undefined ? {
                set: item.inceptionDate
              } : undefined,
            aum: item.aum !== undefined ? {
                set: item.aum
              } : undefined,
            navPerShare: item.navPerShare !== undefined ? {
                set: item.navPerShare
              } : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? {
                set: item.sharesOutstanding
              } : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? {
                set: item.highWaterMarkNav
              } : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      operatedFunds: prop.strategyRef.owner.operatedFunds ? 
      Array.isArray(prop.strategyRef.owner.operatedFunds) && prop.strategyRef.owner.operatedFunds.length > 0 && prop.strategyRef.owner.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.operatedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.operatedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            managerId: item.managerId !== undefined ? {
                equals: item.managerId
              } : undefined,
            operatorId: item.operatorId !== undefined ? {
                equals: item.operatorId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            slug: item.slug !== undefined ? {
                set: item.slug
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            currency: item.currency !== undefined ? {
                set: item.currency
              } : undefined,
            inceptionDate: item.inceptionDate !== undefined ? {
                set: item.inceptionDate
              } : undefined,
            aum: item.aum !== undefined ? {
                set: item.aum
              } : undefined,
            navPerShare: item.navPerShare !== undefined ? {
                set: item.navPerShare
              } : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? {
                set: item.sharesOutstanding
              } : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? {
                set: item.highWaterMarkNav
              } : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      ownedMandates: prop.strategyRef.owner.ownedMandates ? 
      Array.isArray(prop.strategyRef.owner.ownedMandates) && prop.strategyRef.owner.ownedMandates.length > 0 && prop.strategyRef.owner.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.ownedMandates.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.ownedMandates.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            activeVersionId: item.activeVersionId !== undefined ? item.activeVersionId : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId
              } : undefined,
            ownerId: item.ownerId !== undefined ? {
                equals: item.ownerId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            scopeKind: item.scopeKind !== undefined ? {
                set: item.scopeKind
              } : undefined,
            klass: item.klass !== undefined ? {
                set: item.klass
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            personaScope: item.personaScope !== undefined ? {
                set: item.personaScope
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            scopeKind: item.scopeKind !== undefined ? item.scopeKind : undefined,
            klass: item.klass !== undefined ? item.klass : undefined,
            name: item.name !== undefined ? item.name : undefined,
            personaScope: item.personaScope !== undefined ? item.personaScope : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      authoredMandateVersions: prop.strategyRef.owner.authoredMandateVersions ? 
      Array.isArray(prop.strategyRef.owner.authoredMandateVersions) && prop.strategyRef.owner.authoredMandateVersions.length > 0 && prop.strategyRef.owner.authoredMandateVersions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.authoredMandateVersions.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.authoredMandateVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateId: item.mandateId !== undefined ? {
                equals: item.mandateId
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
            authoredById: item.authoredById !== undefined ? {
                equals: item.authoredById
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            versionLabel: item.versionLabel !== undefined ? {
                set: item.versionLabel
              } : undefined,
            versionSeq: item.versionSeq !== undefined ? {
                set: item.versionSeq
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            summary: item.summary !== undefined ? {
                set: item.summary
              } : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
          create: {
            versionLabel: item.versionLabel !== undefined ? item.versionLabel : undefined,
            versionSeq: item.versionSeq !== undefined ? item.versionSeq : undefined,
            status: item.status !== undefined ? item.status : undefined,
            summary: item.summary !== undefined ? item.summary : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
        }))
      } : undefined,
      mandateApprovalsDecided: prop.strategyRef.owner.mandateApprovalsDecided ? 
      Array.isArray(prop.strategyRef.owner.mandateApprovalsDecided) && prop.strategyRef.owner.mandateApprovalsDecided.length > 0 && prop.strategyRef.owner.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateVersionId: item.mandateVersionId !== undefined ? {
                equals: item.mandateVersionId
              } : undefined,
            decidedByUserId: item.decidedByUserId !== undefined ? {
                equals: item.decidedByUserId
              } : undefined,
            correlationId: item.correlationId !== undefined ? {
                equals: item.correlationId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            action: item.action !== undefined ? {
                set: item.action
              } : undefined,
            decidedByRole: item.decidedByRole !== undefined ? {
                set: item.decidedByRole
              } : undefined,
            rationale: item.rationale !== undefined ? {
                set: item.rationale
              } : undefined,
            correlationId: item.correlationId !== undefined ? {
                set: item.correlationId
              } : undefined,
          },
          create: {
            action: item.action !== undefined ? item.action : undefined,
            decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
            rationale: item.rationale !== undefined ? item.rationale : undefined,
            correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
          },
        }))
      } : undefined,
      investorProfiles: prop.strategyRef.owner.investorProfiles ? 
      Array.isArray(prop.strategyRef.owner.investorProfiles) && prop.strategyRef.owner.investorProfiles.length > 0 && prop.strategyRef.owner.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.investorProfiles.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.investorProfiles.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId
              } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            customerId: item.customerId !== undefined ? {
                equals: item.customerId
              } : undefined,
            name: item.name !== undefined ? {
                equals: item.name
              } : undefined,
            email: item.email !== undefined ? {
                equals: item.email
              } : undefined,
            type: item.type !== undefined ? {
                equals: item.type
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            name: item.name !== undefined ? {
                set: item.name
              } : undefined,
            email: item.email !== undefined ? {
                set: item.email
              } : undefined,
            type: item.type !== undefined ? {
                set: item.type
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            kycStatus: item.kycStatus !== undefined ? {
                set: item.kycStatus
              } : undefined,
            jurisdiction: item.jurisdiction !== undefined ? {
                set: item.jurisdiction
              } : undefined,
            joinedAt: item.joinedAt !== undefined ? {
                set: item.joinedAt
              } : undefined,
            externalRef: item.externalRef !== undefined ? {
                set: item.externalRef
              } : undefined,
            notes: item.notes !== undefined ? {
                set: item.notes
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            email: item.email !== undefined ? item.email : undefined,
            type: item.type !== undefined ? item.type : undefined,
            status: item.status !== undefined ? item.status : undefined,
            kycStatus: item.kycStatus !== undefined ? item.kycStatus : undefined,
            jurisdiction: item.jurisdiction !== undefined ? item.jurisdiction : undefined,
            joinedAt: item.joinedAt !== undefined ? item.joinedAt : undefined,
            externalRef: item.externalRef !== undefined ? item.externalRef : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      notificationDeliveries: prop.strategyRef.owner.notificationDeliveries ? 
      Array.isArray(prop.strategyRef.owner.notificationDeliveries) && prop.strategyRef.owner.notificationDeliveries.length > 0 && prop.strategyRef.owner.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.notificationDeliveries.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.notificationDeliveries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId
              } : undefined,
            recipientUserId: item.recipientUserId !== undefined ? {
                equals: item.recipientUserId
              } : undefined,
            templateId: item.templateId !== undefined ? {
                equals: item.templateId
              } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                equals: item.providerMessageId
              } : undefined,
            status: item.status !== undefined ? {
                equals: item.status
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            channel: item.channel !== undefined ? {
                set: item.channel
              } : undefined,
            templateId: item.templateId !== undefined ? {
                set: item.templateId
              } : undefined,
            templateVersion: item.templateVersion !== undefined ? {
                set: item.templateVersion
              } : undefined,
            provider: item.provider !== undefined ? {
                set: item.provider
              } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                set: item.providerMessageId
              } : undefined,
            status: item.status !== undefined ? {
                set: item.status
              } : undefined,
            statusDetail: item.statusDetail !== undefined ? {
                set: item.statusDetail
              } : undefined,
            sentAt: item.sentAt !== undefined ? {
                set: item.sentAt
              } : undefined,
            deliveredAt: item.deliveredAt !== undefined ? {
                set: item.deliveredAt
              } : undefined,
            readAt: item.readAt !== undefined ? {
                set: item.readAt
              } : undefined,
          },
          create: {
            channel: item.channel !== undefined ? item.channel : undefined,
            templateId: item.templateId !== undefined ? item.templateId : undefined,
            templateVersion: item.templateVersion !== undefined ? item.templateVersion : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerMessageId: item.providerMessageId !== undefined ? item.providerMessageId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            statusDetail: item.statusDetail !== undefined ? item.statusDetail : undefined,
            sentAt: item.sentAt !== undefined ? item.sentAt : undefined,
            deliveredAt: item.deliveredAt !== undefined ? item.deliveredAt : undefined,
            readAt: item.readAt !== undefined ? item.readAt : undefined,
          },
        }))
      } : undefined,
      notificationPreferences: prop.strategyRef.owner.notificationPreferences ? 
      Array.isArray(prop.strategyRef.owner.notificationPreferences) && prop.strategyRef.owner.notificationPreferences.length > 0 && prop.strategyRef.owner.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.strategyRef.owner.notificationPreferences.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.strategyRef.owner.notificationPreferences.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId
              } : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            eventId: item.eventId !== undefined ? {
                set: item.eventId
              } : undefined,
            channel: item.channel !== undefined ? {
                set: item.channel
              } : undefined,
            enabled: item.enabled !== undefined ? {
                set: item.enabled
              } : undefined,
          },
          create: {
            eventId: item.eventId !== undefined ? item.eventId : undefined,
            channel: item.channel !== undefined ? item.channel : undefined,
            enabled: item.enabled !== undefined ? item.enabled : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          name: prop.strategyRef.owner.name !== undefined ? prop.strategyRef.owner.name : undefined,
          email: prop.strategyRef.owner.email !== undefined ? prop.strategyRef.owner.email : undefined,
          emailVerified: prop.strategyRef.owner.emailVerified !== undefined ? prop.strategyRef.owner.emailVerified : undefined,
          image: prop.strategyRef.owner.image !== undefined ? prop.strategyRef.owner.image : undefined,
          avatarUrl: prop.strategyRef.owner.avatarUrl !== undefined ? prop.strategyRef.owner.avatarUrl : undefined,
          onboardingComplete: prop.strategyRef.owner.onboardingComplete !== undefined ? prop.strategyRef.owner.onboardingComplete : undefined,
          signupCategory: prop.strategyRef.owner.signupCategory !== undefined ? prop.strategyRef.owner.signupCategory : undefined,
          deletedAt: prop.strategyRef.owner.deletedAt !== undefined ? prop.strategyRef.owner.deletedAt : undefined,
          role: prop.strategyRef.owner.role !== undefined ? prop.strategyRef.owner.role : undefined,
          bio: prop.strategyRef.owner.bio !== undefined ? prop.strategyRef.owner.bio : undefined,
          jobTitle: prop.strategyRef.owner.jobTitle !== undefined ? prop.strategyRef.owner.jobTitle : undefined,
          currentAccount: prop.strategyRef.owner.currentAccount !== undefined ? prop.strategyRef.owner.currentAccount : undefined,
          plan: prop.strategyRef.owner.plan !== undefined ? prop.strategyRef.owner.plan : undefined,
          openaiAPIKey: prop.strategyRef.owner.openaiAPIKey !== undefined ? prop.strategyRef.owner.openaiAPIKey : undefined,
          openaiModel: prop.strategyRef.owner.openaiModel !== undefined ? prop.strategyRef.owner.openaiModel : undefined,
      customer: prop.strategyRef.owner.customer ? 
        typeof prop.strategyRef.owner.customer === 'object' && Object.keys(prop.strategyRef.owner.customer).length === 1 && Object.keys(prop.strategyRef.owner.customer)[0] === 'id'
    ? { connect: {
            id: prop.strategyRef.owner.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.strategyRef.owner.customer.id !== undefined ? prop.strategyRef.owner.customer.id : undefined,
            stripeCustomerId: prop.strategyRef.owner.customer.stripeCustomerId !== undefined ? prop.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: prop.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? prop.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            authUserId: prop.strategyRef.owner.customer.authUserId !== undefined ? {
                equals: prop.strategyRef.owner.customer.authUserId 
               } : undefined,
            name: prop.strategyRef.owner.customer.name !== undefined ? {
                equals: prop.strategyRef.owner.customer.name 
               } : undefined,
            stripePriceId: prop.strategyRef.owner.customer.stripePriceId !== undefined ? {
                equals: prop.strategyRef.owner.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: prop.strategyRef.owner.customer.authUserId !== undefined ? prop.strategyRef.owner.customer.authUserId : undefined,
            name: prop.strategyRef.owner.customer.name !== undefined ? prop.strategyRef.owner.customer.name : undefined,
            plan: prop.strategyRef.owner.customer.plan !== undefined ? prop.strategyRef.owner.customer.plan : undefined,
            stripeCustomerId: prop.strategyRef.owner.customer.stripeCustomerId !== undefined ? prop.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: prop.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? prop.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            stripePriceId: prop.strategyRef.owner.customer.stripePriceId !== undefined ? prop.strategyRef.owner.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: prop.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? prop.strategyRef.owner.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: prop.strategyRef.owner.customer.jurisdiction !== undefined ? prop.strategyRef.owner.customer.jurisdiction : undefined,
            riskProfile: prop.strategyRef.owner.customer.riskProfile !== undefined ? prop.strategyRef.owner.customer.riskProfile : undefined,
            amlStatus: prop.strategyRef.owner.customer.amlStatus !== undefined ? prop.strategyRef.owner.customer.amlStatus : undefined,
            lastKycUpdate: prop.strategyRef.owner.customer.lastKycUpdate !== undefined ? prop.strategyRef.owner.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: prop.strategyRef.owner.accounts ? 
        Array.isArray(prop.strategyRef.owner.accounts) && prop.strategyRef.owner.accounts.length > 0 &&  prop.strategyRef.owner.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.accounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            refresh_token: item.refresh_token !== undefined ? item.refresh_token : undefined,
            access_token: item.access_token !== undefined ? item.access_token : undefined,
            expires_at: item.expires_at !== undefined ? item.expires_at : undefined,
            token_type: item.token_type !== undefined ? item.token_type : undefined,
            scope: item.scope !== undefined ? item.scope : undefined,
            id_token: item.id_token !== undefined ? item.id_token : undefined,
            session_state: item.session_state !== undefined ? item.session_state : undefined,
          },
        }))
      } : undefined,
      sessions: prop.strategyRef.owner.sessions ? 
        Array.isArray(prop.strategyRef.owner.sessions) && prop.strategyRef.owner.sessions.length > 0 &&  prop.strategyRef.owner.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.sessions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            sessionToken: item.sessionToken !== undefined ? item.sessionToken : undefined,
            expires: item.expires !== undefined ? item.expires : undefined,
          },
        }))
      } : undefined,
      authenticators: prop.strategyRef.owner.authenticators ? 
        Array.isArray(prop.strategyRef.owner.authenticators) && prop.strategyRef.owner.authenticators.length > 0 &&  prop.strategyRef.owner.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.authenticators.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            credentialID: item.credentialID !== undefined ? item.credentialID : undefined,
            publicKey: item.publicKey !== undefined ? item.publicKey : undefined,
            counter: item.counter !== undefined ? item.counter : undefined,
          },
        }))
      } : undefined,
      alpacaAccounts: prop.strategyRef.owner.alpacaAccounts ? 
        Array.isArray(prop.strategyRef.owner.alpacaAccounts) && prop.strategyRef.owner.alpacaAccounts.length > 0 &&  prop.strategyRef.owner.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.alpacaAccounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            APIKey: item.APIKey !== undefined ? item.APIKey : undefined,
            APISecret: item.APISecret !== undefined ? item.APISecret : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? item.marketOpen : undefined,
            realTime: item.realTime !== undefined ? item.realTime : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? item.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? item.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? item.tradeAllocationPct : undefined,
            autoAllocation: item.autoAllocation !== undefined ? item.autoAllocation : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? item.minPercentageChange : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? item.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? item.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? item.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? item.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? item.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? item.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? item.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? item.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? item.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? item.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? item.minimumPriceChangePercent100 : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      linkedProviders: prop.strategyRef.owner.linkedProviders ? 
        Array.isArray(prop.strategyRef.owner.linkedProviders) && prop.strategyRef.owner.linkedProviders.length > 0 &&  prop.strategyRef.owner.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.linkedProviders.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
          },
          create: {
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            email: item.email !== undefined ? item.email : undefined,
            accessToken: item.accessToken !== undefined ? item.accessToken : undefined,
            refreshToken: item.refreshToken !== undefined ? item.refreshToken : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            linkedAt: item.linkedAt !== undefined ? item.linkedAt : undefined,
          },
        }))
      } : undefined,
      accountLinkingRequests: prop.strategyRef.owner.accountLinkingRequests ? 
        Array.isArray(prop.strategyRef.owner.accountLinkingRequests) && prop.strategyRef.owner.accountLinkingRequests.length > 0 &&  prop.strategyRef.owner.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.accountLinkingRequests.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            verificationToken: item.verificationToken !== undefined ? item.verificationToken : undefined,
            userAgent: item.userAgent !== undefined ? item.userAgent : undefined,
            ipAddress: item.ipAddress !== undefined ? item.ipAddress : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            verifiedAt: item.verifiedAt !== undefined ? item.verifiedAt : undefined,
            approvedAt: item.approvedAt !== undefined ? item.approvedAt : undefined,
            rejectedAt: item.rejectedAt !== undefined ? item.rejectedAt : undefined,
          },
        }))
      } : undefined,
      reviewedWaitlistEntries: prop.strategyRef.owner.reviewedWaitlistEntries ? 
        Array.isArray(prop.strategyRef.owner.reviewedWaitlistEntries) && prop.strategyRef.owner.reviewedWaitlistEntries.length > 0 &&  prop.strategyRef.owner.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            email: item.email !== undefined ? item.email : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            fullName: item.fullName !== undefined ? item.fullName : undefined,
            companyName: item.companyName !== undefined ? item.companyName : undefined,
            companyWebsite: item.companyWebsite !== undefined ? item.companyWebsite : undefined,
            jobRole: item.jobRole !== undefined ? item.jobRole : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? item.professionalInvestorConfirmed : undefined,
            status: item.status !== undefined ? item.status : undefined,
            queuePosition: item.queuePosition !== undefined ? item.queuePosition : undefined,
            reviewedAt: item.reviewedAt !== undefined ? item.reviewedAt : undefined,
          },
        }))
      } : undefined,
      llmConfiguration: prop.strategyRef.owner.llmConfiguration ? 
        typeof prop.strategyRef.owner.llmConfiguration === 'object' && Object.keys(prop.strategyRef.owner.llmConfiguration).length === 1 && Object.keys(prop.strategyRef.owner.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: prop.strategyRef.owner.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.strategyRef.owner.llmConfiguration.id !== undefined ? prop.strategyRef.owner.llmConfiguration.id : undefined,
            userId: prop.strategyRef.owner.llmConfiguration.userId !== undefined ? prop.strategyRef.owner.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: prop.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.defaultProvider : undefined,
            miniProvider: prop.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.miniProvider : undefined,
            normalProvider: prop.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.normalProvider : undefined,
            advancedProvider: prop.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.advancedProvider : undefined,
            miniModel: prop.strategyRef.owner.llmConfiguration.miniModel !== undefined ? prop.strategyRef.owner.llmConfiguration.miniModel : undefined,
            normalModel: prop.strategyRef.owner.llmConfiguration.normalModel !== undefined ? prop.strategyRef.owner.llmConfiguration.normalModel : undefined,
            advancedModel: prop.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? prop.strategyRef.owner.llmConfiguration.advancedModel : undefined,
            openaiApiKey: prop.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: prop.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: prop.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: prop.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: prop.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: prop.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: prop.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: prop.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: prop.strategyRef.owner.orgMemberships ? 
        Array.isArray(prop.strategyRef.owner.orgMemberships) && prop.strategyRef.owner.orgMemberships.length > 0 &&  prop.strategyRef.owner.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.orgMemberships.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      fundAssignments: prop.strategyRef.owner.fundAssignments ? 
        Array.isArray(prop.strategyRef.owner.fundAssignments) && prop.strategyRef.owner.fundAssignments.length > 0 &&  prop.strategyRef.owner.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.fundAssignments.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      managedFunds: prop.strategyRef.owner.managedFunds ? 
        Array.isArray(prop.strategyRef.owner.managedFunds) && prop.strategyRef.owner.managedFunds.length > 0 &&  prop.strategyRef.owner.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.managedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      operatedFunds: prop.strategyRef.owner.operatedFunds ? 
        Array.isArray(prop.strategyRef.owner.operatedFunds) && prop.strategyRef.owner.operatedFunds.length > 0 &&  prop.strategyRef.owner.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.operatedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      ownedMandates: prop.strategyRef.owner.ownedMandates ? 
        Array.isArray(prop.strategyRef.owner.ownedMandates) && prop.strategyRef.owner.ownedMandates.length > 0 &&  prop.strategyRef.owner.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.ownedMandates.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            activeVersionId: item.activeVersionId !== undefined ? item.activeVersionId : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            scopeKind: item.scopeKind !== undefined ? item.scopeKind : undefined,
            klass: item.klass !== undefined ? item.klass : undefined,
            name: item.name !== undefined ? item.name : undefined,
            personaScope: item.personaScope !== undefined ? item.personaScope : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      authoredMandateVersions: prop.strategyRef.owner.authoredMandateVersions ? 
        Array.isArray(prop.strategyRef.owner.authoredMandateVersions) && prop.strategyRef.owner.authoredMandateVersions.length > 0 &&  prop.strategyRef.owner.authoredMandateVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.authoredMandateVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.authoredMandateVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateId: item.mandateId !== undefined ? {
                equals: item.mandateId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            versionLabel: item.versionLabel !== undefined ? item.versionLabel : undefined,
            versionSeq: item.versionSeq !== undefined ? item.versionSeq : undefined,
            status: item.status !== undefined ? item.status : undefined,
            summary: item.summary !== undefined ? item.summary : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
        }))
      } : undefined,
      mandateApprovalsDecided: prop.strategyRef.owner.mandateApprovalsDecided ? 
        Array.isArray(prop.strategyRef.owner.mandateApprovalsDecided) && prop.strategyRef.owner.mandateApprovalsDecided.length > 0 &&  prop.strategyRef.owner.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateVersionId: item.mandateVersionId !== undefined ? {
                equals: item.mandateVersionId 
               } : undefined,
            correlationId: item.correlationId !== undefined ? {
                equals: item.correlationId 
               } : undefined,
          },
          create: {
            action: item.action !== undefined ? item.action : undefined,
            decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
            rationale: item.rationale !== undefined ? item.rationale : undefined,
            correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
          },
        }))
      } : undefined,
      investorProfiles: prop.strategyRef.owner.investorProfiles ? 
        Array.isArray(prop.strategyRef.owner.investorProfiles) && prop.strategyRef.owner.investorProfiles.length > 0 &&  prop.strategyRef.owner.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.investorProfiles.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            email: item.email !== undefined ? item.email : undefined,
            type: item.type !== undefined ? item.type : undefined,
            status: item.status !== undefined ? item.status : undefined,
            kycStatus: item.kycStatus !== undefined ? item.kycStatus : undefined,
            jurisdiction: item.jurisdiction !== undefined ? item.jurisdiction : undefined,
            joinedAt: item.joinedAt !== undefined ? item.joinedAt : undefined,
            externalRef: item.externalRef !== undefined ? item.externalRef : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      notificationDeliveries: prop.strategyRef.owner.notificationDeliveries ? 
        Array.isArray(prop.strategyRef.owner.notificationDeliveries) && prop.strategyRef.owner.notificationDeliveries.length > 0 &&  prop.strategyRef.owner.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.notificationDeliveries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
            recipientUserId: item.recipientUserId !== undefined ? {
                equals: item.recipientUserId 
               } : undefined,
            templateId: item.templateId !== undefined ? {
                equals: item.templateId 
               } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                equals: item.providerMessageId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            channel: item.channel !== undefined ? item.channel : undefined,
            templateId: item.templateId !== undefined ? item.templateId : undefined,
            templateVersion: item.templateVersion !== undefined ? item.templateVersion : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerMessageId: item.providerMessageId !== undefined ? item.providerMessageId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            statusDetail: item.statusDetail !== undefined ? item.statusDetail : undefined,
            sentAt: item.sentAt !== undefined ? item.sentAt : undefined,
            deliveredAt: item.deliveredAt !== undefined ? item.deliveredAt : undefined,
            readAt: item.readAt !== undefined ? item.readAt : undefined,
          },
        }))
      } : undefined,
      notificationPreferences: prop.strategyRef.owner.notificationPreferences ? 
        Array.isArray(prop.strategyRef.owner.notificationPreferences) && prop.strategyRef.owner.notificationPreferences.length > 0 &&  prop.strategyRef.owner.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.notificationPreferences.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
          },
          create: {
            eventId: item.eventId !== undefined ? item.eventId : undefined,
            channel: item.channel !== undefined ? item.channel : undefined,
            enabled: item.enabled !== undefined ? item.enabled : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    subscriptions: prop.strategyRef.subscriptions ? 
    Array.isArray(prop.strategyRef.subscriptions) && prop.strategyRef.subscriptions.length > 0 && prop.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.strategyRef.subscriptions.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.strategyRef.subscriptions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          accountId: item.accountId !== undefined ? {
              equals: item.accountId
            } : undefined,
          strategyId: item.strategyId !== undefined ? {
              equals: item.strategyId
            } : undefined,
          status: item.status !== undefined ? {
              equals: item.status
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          status: item.status !== undefined ? {
              set: item.status
            } : undefined,
          units: item.units !== undefined ? {
              set: item.units
            } : undefined,
          costBasis: item.costBasis !== undefined ? {
              set: item.costBasis
            } : undefined,
          realizedPL: item.realizedPL !== undefined ? {
              set: item.realizedPL
            } : undefined,
          targetAllocationPct: item.targetAllocationPct !== undefined ? {
              set: item.targetAllocationPct
            } : undefined,
          currency: item.currency !== undefined ? {
              set: item.currency
            } : undefined,
          subscribedAt: item.subscribedAt !== undefined ? {
              set: item.subscribedAt
            } : undefined,
          lastRebalancedAt: item.lastRebalancedAt !== undefined ? {
              set: item.lastRebalancedAt
            } : undefined,
          deletedAt: item.deletedAt !== undefined ? {
              set: item.deletedAt
            } : undefined,
      account: item.account ? 
      typeof item.account === 'object' && Object.keys(item.account).length === 1 && (Object.keys(item.account)[0] === 'id' || Object.keys(item.account)[0] === 'symbol')
? {
      connect: {
        id: item.account.id
      }
} : { upsert: {
          where: {
            id: item.account.id !== undefined ? {
                equals: item.account.id
              } : undefined,
            type: item.account.type !== undefined ? {
                equals: item.account.type
              } : undefined,
            userId: item.account.userId !== undefined ? {
                equals: item.account.userId
              } : undefined,
          },
          update: {
            id: item.account.id !== undefined ? {
                set: item.account.id
              } : undefined,
            type: item.account.type !== undefined ? {
                set: item.account.type
              } : undefined,
            APIKey: item.account.APIKey !== undefined ? {
                set: item.account.APIKey
              } : undefined,
            APISecret: item.account.APISecret !== undefined ? {
                set: item.account.APISecret
              } : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? {
                set: item.account.marketOpen
              } : undefined,
            realTime: item.account.realTime !== undefined ? {
                set: item.account.realTime
              } : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? {
                set: item.account.cryptoTradingEnabled
              } : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs
              } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? {
                set: item.account.cryptoTradeAllocationPct
              } : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? {
                set: item.account.tradeAllocationPct
              } : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? {
                set: item.account.autoAllocation
              } : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? {
                set: item.account.minPercentageChange
              } : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? {
                set: item.account.volumeThreshold
              } : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? {
                set: item.account.enablePortfolioTrailingStop
              } : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? {
                set: item.account.portfolioTrailPercent
              } : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? {
                set: item.account.portfolioProfitThresholdPercent
              } : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? {
                set: item.account.reducedPortfolioTrailPercent
              } : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? {
                set: item.account.defaultTrailingStopPercentage100
              } : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? {
                set: item.account.firstTrailReductionThreshold100
              } : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? {
                set: item.account.secondTrailReductionThreshold100
              } : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? {
                set: item.account.firstReducedTrailPercentage100
              } : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? {
                set: item.account.secondReducedTrailPercentage100
              } : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? {
                set: item.account.minimumPriceChangePercent100
              } : undefined,
            deletedAt: item.account.deletedAt !== undefined ? {
                set: item.account.deletedAt
              } : undefined,
          },
          create: {
            type: item.account.type !== undefined ? item.account.type : undefined,
            APIKey: item.account.APIKey !== undefined ? item.account.APIKey : undefined,
            APISecret: item.account.APISecret !== undefined ? item.account.APISecret : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? item.account.marketOpen : undefined,
            realTime: item.account.realTime !== undefined ? item.account.realTime : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? item.account.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? item.account.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? item.account.tradeAllocationPct : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? item.account.autoAllocation : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? item.account.minPercentageChange : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? item.account.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? item.account.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? item.account.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? item.account.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? item.account.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? item.account.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? item.account.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? item.account.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? item.account.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? item.account.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? item.account.minimumPriceChangePercent100 : undefined,
            deletedAt: item.account.deletedAt !== undefined ? item.account.deletedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          status: item.status !== undefined ? item.status : undefined,
          units: item.units !== undefined ? item.units : undefined,
          costBasis: item.costBasis !== undefined ? item.costBasis : undefined,
          realizedPL: item.realizedPL !== undefined ? item.realizedPL : undefined,
          targetAllocationPct: item.targetAllocationPct !== undefined ? item.targetAllocationPct : undefined,
          currency: item.currency !== undefined ? item.currency : undefined,
          subscribedAt: item.subscribedAt !== undefined ? item.subscribedAt : undefined,
          lastRebalancedAt: item.lastRebalancedAt !== undefined ? item.lastRebalancedAt : undefined,
          deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
      account: item.account ? 
        typeof item.account === 'object' && Object.keys(item.account).length === 1 && Object.keys(item.account)[0] === 'id'
    ? { connect: {
            id: item.account.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.account.id !== undefined ? item.account.id : undefined,
            type: item.account.type !== undefined ? {
                equals: item.account.type 
               } : undefined,
            userId: item.account.userId !== undefined ? {
                equals: item.account.userId 
               } : undefined,
          },
          create: {
            type: item.account.type !== undefined ? item.account.type : undefined,
            APIKey: item.account.APIKey !== undefined ? item.account.APIKey : undefined,
            APISecret: item.account.APISecret !== undefined ? item.account.APISecret : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? item.account.marketOpen : undefined,
            realTime: item.account.realTime !== undefined ? item.account.realTime : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? item.account.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? item.account.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? item.account.tradeAllocationPct : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? item.account.autoAllocation : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? item.account.minPercentageChange : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? item.account.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? item.account.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? item.account.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? item.account.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? item.account.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? item.account.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? item.account.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? item.account.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? item.account.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? item.account.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? item.account.minimumPriceChangePercent100 : undefined,
            deletedAt: item.account.deletedAt !== undefined ? item.account.deletedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        key: prop.strategyRef.key !== undefined ? prop.strategyRef.key : undefined,
        displayName: prop.strategyRef.displayName !== undefined ? prop.strategyRef.displayName : undefined,
        description: prop.strategyRef.description !== undefined ? prop.strategyRef.description : undefined,
        origin: prop.strategyRef.origin !== undefined ? prop.strategyRef.origin : undefined,
        lifecycleState: prop.strategyRef.lifecycleState !== undefined ? prop.strategyRef.lifecycleState : undefined,
        manifestHash: prop.strategyRef.manifestHash !== undefined ? prop.strategyRef.manifestHash : undefined,
        deletedAt: prop.strategyRef.deletedAt !== undefined ? prop.strategyRef.deletedAt : undefined,
    owner: prop.strategyRef.owner ? 
      typeof prop.strategyRef.owner === 'object' && Object.keys(prop.strategyRef.owner).length === 1 && Object.keys(prop.strategyRef.owner)[0] === 'id'
    ? { connect: {
          id: prop.strategyRef.owner.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: prop.strategyRef.owner.id !== undefined ? prop.strategyRef.owner.id : undefined,
          email: prop.strategyRef.owner.email !== undefined ? prop.strategyRef.owner.email : undefined,
          name: prop.strategyRef.owner.name !== undefined ? {
              equals: prop.strategyRef.owner.name 
             } : undefined,
        },
        create: {
          name: prop.strategyRef.owner.name !== undefined ? prop.strategyRef.owner.name : undefined,
          email: prop.strategyRef.owner.email !== undefined ? prop.strategyRef.owner.email : undefined,
          emailVerified: prop.strategyRef.owner.emailVerified !== undefined ? prop.strategyRef.owner.emailVerified : undefined,
          image: prop.strategyRef.owner.image !== undefined ? prop.strategyRef.owner.image : undefined,
          avatarUrl: prop.strategyRef.owner.avatarUrl !== undefined ? prop.strategyRef.owner.avatarUrl : undefined,
          onboardingComplete: prop.strategyRef.owner.onboardingComplete !== undefined ? prop.strategyRef.owner.onboardingComplete : undefined,
          signupCategory: prop.strategyRef.owner.signupCategory !== undefined ? prop.strategyRef.owner.signupCategory : undefined,
          deletedAt: prop.strategyRef.owner.deletedAt !== undefined ? prop.strategyRef.owner.deletedAt : undefined,
          role: prop.strategyRef.owner.role !== undefined ? prop.strategyRef.owner.role : undefined,
          bio: prop.strategyRef.owner.bio !== undefined ? prop.strategyRef.owner.bio : undefined,
          jobTitle: prop.strategyRef.owner.jobTitle !== undefined ? prop.strategyRef.owner.jobTitle : undefined,
          currentAccount: prop.strategyRef.owner.currentAccount !== undefined ? prop.strategyRef.owner.currentAccount : undefined,
          plan: prop.strategyRef.owner.plan !== undefined ? prop.strategyRef.owner.plan : undefined,
          openaiAPIKey: prop.strategyRef.owner.openaiAPIKey !== undefined ? prop.strategyRef.owner.openaiAPIKey : undefined,
          openaiModel: prop.strategyRef.owner.openaiModel !== undefined ? prop.strategyRef.owner.openaiModel : undefined,
      customer: prop.strategyRef.owner.customer ? 
        typeof prop.strategyRef.owner.customer === 'object' && Object.keys(prop.strategyRef.owner.customer).length === 1 && Object.keys(prop.strategyRef.owner.customer)[0] === 'id'
    ? { connect: {
            id: prop.strategyRef.owner.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.strategyRef.owner.customer.id !== undefined ? prop.strategyRef.owner.customer.id : undefined,
            stripeCustomerId: prop.strategyRef.owner.customer.stripeCustomerId !== undefined ? prop.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: prop.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? prop.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            authUserId: prop.strategyRef.owner.customer.authUserId !== undefined ? {
                equals: prop.strategyRef.owner.customer.authUserId 
               } : undefined,
            name: prop.strategyRef.owner.customer.name !== undefined ? {
                equals: prop.strategyRef.owner.customer.name 
               } : undefined,
            stripePriceId: prop.strategyRef.owner.customer.stripePriceId !== undefined ? {
                equals: prop.strategyRef.owner.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: prop.strategyRef.owner.customer.authUserId !== undefined ? prop.strategyRef.owner.customer.authUserId : undefined,
            name: prop.strategyRef.owner.customer.name !== undefined ? prop.strategyRef.owner.customer.name : undefined,
            plan: prop.strategyRef.owner.customer.plan !== undefined ? prop.strategyRef.owner.customer.plan : undefined,
            stripeCustomerId: prop.strategyRef.owner.customer.stripeCustomerId !== undefined ? prop.strategyRef.owner.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: prop.strategyRef.owner.customer.stripeSubscriptionId !== undefined ? prop.strategyRef.owner.customer.stripeSubscriptionId : undefined,
            stripePriceId: prop.strategyRef.owner.customer.stripePriceId !== undefined ? prop.strategyRef.owner.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: prop.strategyRef.owner.customer.stripeCurrentPeriodEnd !== undefined ? prop.strategyRef.owner.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: prop.strategyRef.owner.customer.jurisdiction !== undefined ? prop.strategyRef.owner.customer.jurisdiction : undefined,
            riskProfile: prop.strategyRef.owner.customer.riskProfile !== undefined ? prop.strategyRef.owner.customer.riskProfile : undefined,
            amlStatus: prop.strategyRef.owner.customer.amlStatus !== undefined ? prop.strategyRef.owner.customer.amlStatus : undefined,
            lastKycUpdate: prop.strategyRef.owner.customer.lastKycUpdate !== undefined ? prop.strategyRef.owner.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: prop.strategyRef.owner.accounts ? 
        Array.isArray(prop.strategyRef.owner.accounts) && prop.strategyRef.owner.accounts.length > 0 &&  prop.strategyRef.owner.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.accounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            refresh_token: item.refresh_token !== undefined ? item.refresh_token : undefined,
            access_token: item.access_token !== undefined ? item.access_token : undefined,
            expires_at: item.expires_at !== undefined ? item.expires_at : undefined,
            token_type: item.token_type !== undefined ? item.token_type : undefined,
            scope: item.scope !== undefined ? item.scope : undefined,
            id_token: item.id_token !== undefined ? item.id_token : undefined,
            session_state: item.session_state !== undefined ? item.session_state : undefined,
          },
        }))
      } : undefined,
      sessions: prop.strategyRef.owner.sessions ? 
        Array.isArray(prop.strategyRef.owner.sessions) && prop.strategyRef.owner.sessions.length > 0 &&  prop.strategyRef.owner.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.sessions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            sessionToken: item.sessionToken !== undefined ? item.sessionToken : undefined,
            expires: item.expires !== undefined ? item.expires : undefined,
          },
        }))
      } : undefined,
      authenticators: prop.strategyRef.owner.authenticators ? 
        Array.isArray(prop.strategyRef.owner.authenticators) && prop.strategyRef.owner.authenticators.length > 0 &&  prop.strategyRef.owner.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.authenticators.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            credentialID: item.credentialID !== undefined ? item.credentialID : undefined,
            publicKey: item.publicKey !== undefined ? item.publicKey : undefined,
            counter: item.counter !== undefined ? item.counter : undefined,
          },
        }))
      } : undefined,
      alpacaAccounts: prop.strategyRef.owner.alpacaAccounts ? 
        Array.isArray(prop.strategyRef.owner.alpacaAccounts) && prop.strategyRef.owner.alpacaAccounts.length > 0 &&  prop.strategyRef.owner.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.alpacaAccounts.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            type: item.type !== undefined ? item.type : undefined,
            APIKey: item.APIKey !== undefined ? item.APIKey : undefined,
            APISecret: item.APISecret !== undefined ? item.APISecret : undefined,
            configuration: item.configuration !== undefined ? item.configuration : undefined,
            marketOpen: item.marketOpen !== undefined ? item.marketOpen : undefined,
            realTime: item.realTime !== undefined ? item.realTime : undefined,
            cryptoTradingEnabled: item.cryptoTradingEnabled !== undefined ? item.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.cryptoTradingPairs !== undefined ? {
                set: item.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.cryptoTradeAllocationPct !== undefined ? item.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.tradeAllocationPct !== undefined ? item.tradeAllocationPct : undefined,
            autoAllocation: item.autoAllocation !== undefined ? item.autoAllocation : undefined,
            minPercentageChange: item.minPercentageChange !== undefined ? item.minPercentageChange : undefined,
            volumeThreshold: item.volumeThreshold !== undefined ? item.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.enablePortfolioTrailingStop !== undefined ? item.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.portfolioTrailPercent !== undefined ? item.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.portfolioProfitThresholdPercent !== undefined ? item.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.reducedPortfolioTrailPercent !== undefined ? item.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.defaultTrailingStopPercentage100 !== undefined ? item.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.firstTrailReductionThreshold100 !== undefined ? item.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.secondTrailReductionThreshold100 !== undefined ? item.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.firstReducedTrailPercentage100 !== undefined ? item.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.secondReducedTrailPercentage100 !== undefined ? item.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.minimumPriceChangePercent100 !== undefined ? item.minimumPriceChangePercent100 : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      linkedProviders: prop.strategyRef.owner.linkedProviders ? 
        Array.isArray(prop.strategyRef.owner.linkedProviders) && prop.strategyRef.owner.linkedProviders.length > 0 &&  prop.strategyRef.owner.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.linkedProviders.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
          },
          create: {
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            email: item.email !== undefined ? item.email : undefined,
            accessToken: item.accessToken !== undefined ? item.accessToken : undefined,
            refreshToken: item.refreshToken !== undefined ? item.refreshToken : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            linkedAt: item.linkedAt !== undefined ? item.linkedAt : undefined,
          },
        }))
      } : undefined,
      accountLinkingRequests: prop.strategyRef.owner.accountLinkingRequests ? 
        Array.isArray(prop.strategyRef.owner.accountLinkingRequests) && prop.strategyRef.owner.accountLinkingRequests.length > 0 &&  prop.strategyRef.owner.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.accountLinkingRequests.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            providerAccountId: item.providerAccountId !== undefined ? {
                equals: item.providerAccountId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerAccountId: item.providerAccountId !== undefined ? item.providerAccountId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            verificationToken: item.verificationToken !== undefined ? item.verificationToken : undefined,
            userAgent: item.userAgent !== undefined ? item.userAgent : undefined,
            ipAddress: item.ipAddress !== undefined ? item.ipAddress : undefined,
            expiresAt: item.expiresAt !== undefined ? item.expiresAt : undefined,
            verifiedAt: item.verifiedAt !== undefined ? item.verifiedAt : undefined,
            approvedAt: item.approvedAt !== undefined ? item.approvedAt : undefined,
            rejectedAt: item.rejectedAt !== undefined ? item.rejectedAt : undefined,
          },
        }))
      } : undefined,
      reviewedWaitlistEntries: prop.strategyRef.owner.reviewedWaitlistEntries ? 
        Array.isArray(prop.strategyRef.owner.reviewedWaitlistEntries) && prop.strategyRef.owner.reviewedWaitlistEntries.length > 0 &&  prop.strategyRef.owner.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.reviewedWaitlistEntries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            email: item.email !== undefined ? item.email : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            email: item.email !== undefined ? item.email : undefined,
            fullName: item.fullName !== undefined ? item.fullName : undefined,
            companyName: item.companyName !== undefined ? item.companyName : undefined,
            companyWebsite: item.companyWebsite !== undefined ? item.companyWebsite : undefined,
            jobRole: item.jobRole !== undefined ? item.jobRole : undefined,
            professionalInvestorConfirmed: item.professionalInvestorConfirmed !== undefined ? item.professionalInvestorConfirmed : undefined,
            status: item.status !== undefined ? item.status : undefined,
            queuePosition: item.queuePosition !== undefined ? item.queuePosition : undefined,
            reviewedAt: item.reviewedAt !== undefined ? item.reviewedAt : undefined,
          },
        }))
      } : undefined,
      llmConfiguration: prop.strategyRef.owner.llmConfiguration ? 
        typeof prop.strategyRef.owner.llmConfiguration === 'object' && Object.keys(prop.strategyRef.owner.llmConfiguration).length === 1 && Object.keys(prop.strategyRef.owner.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: prop.strategyRef.owner.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.strategyRef.owner.llmConfiguration.id !== undefined ? prop.strategyRef.owner.llmConfiguration.id : undefined,
            userId: prop.strategyRef.owner.llmConfiguration.userId !== undefined ? prop.strategyRef.owner.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: prop.strategyRef.owner.llmConfiguration.defaultProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.defaultProvider : undefined,
            miniProvider: prop.strategyRef.owner.llmConfiguration.miniProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.miniProvider : undefined,
            normalProvider: prop.strategyRef.owner.llmConfiguration.normalProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.normalProvider : undefined,
            advancedProvider: prop.strategyRef.owner.llmConfiguration.advancedProvider !== undefined ? prop.strategyRef.owner.llmConfiguration.advancedProvider : undefined,
            miniModel: prop.strategyRef.owner.llmConfiguration.miniModel !== undefined ? prop.strategyRef.owner.llmConfiguration.miniModel : undefined,
            normalModel: prop.strategyRef.owner.llmConfiguration.normalModel !== undefined ? prop.strategyRef.owner.llmConfiguration.normalModel : undefined,
            advancedModel: prop.strategyRef.owner.llmConfiguration.advancedModel !== undefined ? prop.strategyRef.owner.llmConfiguration.advancedModel : undefined,
            openaiApiKey: prop.strategyRef.owner.llmConfiguration.openaiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: prop.strategyRef.owner.llmConfiguration.anthropicApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: prop.strategyRef.owner.llmConfiguration.deepseekApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: prop.strategyRef.owner.llmConfiguration.kimiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: prop.strategyRef.owner.llmConfiguration.qwenApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: prop.strategyRef.owner.llmConfiguration.xaiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: prop.strategyRef.owner.llmConfiguration.geminiApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: prop.strategyRef.owner.llmConfiguration.deepinfraApiKey !== undefined ? prop.strategyRef.owner.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: prop.strategyRef.owner.orgMemberships ? 
        Array.isArray(prop.strategyRef.owner.orgMemberships) && prop.strategyRef.owner.orgMemberships.length > 0 &&  prop.strategyRef.owner.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.orgMemberships.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      fundAssignments: prop.strategyRef.owner.fundAssignments ? 
        Array.isArray(prop.strategyRef.owner.fundAssignments) && prop.strategyRef.owner.fundAssignments.length > 0 &&  prop.strategyRef.owner.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.fundAssignments.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            fundId: item.fundId !== undefined ? {
                equals: item.fundId 
               } : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
          },
          create: {
            role: item.role !== undefined ? item.role : undefined,
            permissions: item.permissions !== undefined ? {
                set: item.permissions 
               } : undefined,
          },
        }))
      } : undefined,
      managedFunds: prop.strategyRef.owner.managedFunds ? 
        Array.isArray(prop.strategyRef.owner.managedFunds) && prop.strategyRef.owner.managedFunds.length > 0 &&  prop.strategyRef.owner.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.managedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      operatedFunds: prop.strategyRef.owner.operatedFunds ? 
        Array.isArray(prop.strategyRef.owner.operatedFunds) && prop.strategyRef.owner.operatedFunds.length > 0 &&  prop.strategyRef.owner.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.operatedFunds.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            slug: item.slug !== undefined ? {
                equals: item.slug 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            slug: item.slug !== undefined ? item.slug : undefined,
            description: item.description !== undefined ? item.description : undefined,
            status: item.status !== undefined ? item.status : undefined,
            currency: item.currency !== undefined ? item.currency : undefined,
            inceptionDate: item.inceptionDate !== undefined ? item.inceptionDate : undefined,
            aum: item.aum !== undefined ? item.aum : undefined,
            navPerShare: item.navPerShare !== undefined ? item.navPerShare : undefined,
            sharesOutstanding: item.sharesOutstanding !== undefined ? item.sharesOutstanding : undefined,
            highWaterMarkNav: item.highWaterMarkNav !== undefined ? item.highWaterMarkNav : undefined,
            fees: item.fees !== undefined ? item.fees : undefined,
            terms: item.terms !== undefined ? item.terms : undefined,
            regulatory: item.regulatory !== undefined ? item.regulatory : undefined,
            serviceProviders: item.serviceProviders !== undefined ? item.serviceProviders : undefined,
            tradingOverrides: item.tradingOverrides !== undefined ? item.tradingOverrides : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      ownedMandates: prop.strategyRef.owner.ownedMandates ? 
        Array.isArray(prop.strategyRef.owner.ownedMandates) && prop.strategyRef.owner.ownedMandates.length > 0 &&  prop.strategyRef.owner.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.ownedMandates.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            activeVersionId: item.activeVersionId !== undefined ? item.activeVersionId : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
          },
          create: {
            scopeKind: item.scopeKind !== undefined ? item.scopeKind : undefined,
            klass: item.klass !== undefined ? item.klass : undefined,
            name: item.name !== undefined ? item.name : undefined,
            personaScope: item.personaScope !== undefined ? item.personaScope : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      authoredMandateVersions: prop.strategyRef.owner.authoredMandateVersions ? 
        Array.isArray(prop.strategyRef.owner.authoredMandateVersions) && prop.strategyRef.owner.authoredMandateVersions.length > 0 &&  prop.strategyRef.owner.authoredMandateVersions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.authoredMandateVersions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.authoredMandateVersions.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateId: item.mandateId !== undefined ? {
                equals: item.mandateId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            versionLabel: item.versionLabel !== undefined ? item.versionLabel : undefined,
            versionSeq: item.versionSeq !== undefined ? item.versionSeq : undefined,
            status: item.status !== undefined ? item.status : undefined,
            summary: item.summary !== undefined ? item.summary : undefined,
            charterBody: item.charterBody !== undefined ? item.charterBody : undefined,
          },
        }))
      } : undefined,
      mandateApprovalsDecided: prop.strategyRef.owner.mandateApprovalsDecided ? 
        Array.isArray(prop.strategyRef.owner.mandateApprovalsDecided) && prop.strategyRef.owner.mandateApprovalsDecided.length > 0 &&  prop.strategyRef.owner.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.mandateApprovalsDecided.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            mandateVersionId: item.mandateVersionId !== undefined ? {
                equals: item.mandateVersionId 
               } : undefined,
            correlationId: item.correlationId !== undefined ? {
                equals: item.correlationId 
               } : undefined,
          },
          create: {
            action: item.action !== undefined ? item.action : undefined,
            decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
            rationale: item.rationale !== undefined ? item.rationale : undefined,
            correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
          },
        }))
      } : undefined,
      investorProfiles: prop.strategyRef.owner.investorProfiles ? 
        Array.isArray(prop.strategyRef.owner.investorProfiles) && prop.strategyRef.owner.investorProfiles.length > 0 &&  prop.strategyRef.owner.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.investorProfiles.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            organizationId: item.organizationId !== undefined ? {
                equals: item.organizationId 
               } : undefined,
            name: item.name !== undefined ? {
                equals: item.name 
               } : undefined,
            email: item.email !== undefined ? {
                equals: item.email 
               } : undefined,
            type: item.type !== undefined ? {
                equals: item.type 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            name: item.name !== undefined ? item.name : undefined,
            email: item.email !== undefined ? item.email : undefined,
            type: item.type !== undefined ? item.type : undefined,
            status: item.status !== undefined ? item.status : undefined,
            kycStatus: item.kycStatus !== undefined ? item.kycStatus : undefined,
            jurisdiction: item.jurisdiction !== undefined ? item.jurisdiction : undefined,
            joinedAt: item.joinedAt !== undefined ? item.joinedAt : undefined,
            externalRef: item.externalRef !== undefined ? item.externalRef : undefined,
            notes: item.notes !== undefined ? item.notes : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
      notificationDeliveries: prop.strategyRef.owner.notificationDeliveries ? 
        Array.isArray(prop.strategyRef.owner.notificationDeliveries) && prop.strategyRef.owner.notificationDeliveries.length > 0 &&  prop.strategyRef.owner.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.notificationDeliveries.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
            recipientUserId: item.recipientUserId !== undefined ? {
                equals: item.recipientUserId 
               } : undefined,
            templateId: item.templateId !== undefined ? {
                equals: item.templateId 
               } : undefined,
            providerMessageId: item.providerMessageId !== undefined ? {
                equals: item.providerMessageId 
               } : undefined,
            status: item.status !== undefined ? {
                equals: item.status 
               } : undefined,
          },
          create: {
            channel: item.channel !== undefined ? item.channel : undefined,
            templateId: item.templateId !== undefined ? item.templateId : undefined,
            templateVersion: item.templateVersion !== undefined ? item.templateVersion : undefined,
            provider: item.provider !== undefined ? item.provider : undefined,
            providerMessageId: item.providerMessageId !== undefined ? item.providerMessageId : undefined,
            status: item.status !== undefined ? item.status : undefined,
            statusDetail: item.statusDetail !== undefined ? item.statusDetail : undefined,
            sentAt: item.sentAt !== undefined ? item.sentAt : undefined,
            deliveredAt: item.deliveredAt !== undefined ? item.deliveredAt : undefined,
            readAt: item.readAt !== undefined ? item.readAt : undefined,
          },
        }))
      } : undefined,
      notificationPreferences: prop.strategyRef.owner.notificationPreferences ? 
        Array.isArray(prop.strategyRef.owner.notificationPreferences) && prop.strategyRef.owner.notificationPreferences.length > 0 &&  prop.strategyRef.owner.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.strategyRef.owner.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.strategyRef.owner.notificationPreferences.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            userId: item.userId !== undefined ? {
                equals: item.userId 
               } : undefined,
            eventId: item.eventId !== undefined ? {
                equals: item.eventId 
               } : undefined,
          },
          create: {
            eventId: item.eventId !== undefined ? item.eventId : undefined,
            channel: item.channel !== undefined ? item.channel : undefined,
            enabled: item.enabled !== undefined ? item.enabled : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    subscriptions: prop.strategyRef.subscriptions ? 
      Array.isArray(prop.strategyRef.subscriptions) && prop.strategyRef.subscriptions.length > 0 &&  prop.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.strategyRef.subscriptions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.strategyRef.subscriptions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          accountId: item.accountId !== undefined ? {
              equals: item.accountId 
             } : undefined,
          strategyId: item.strategyId !== undefined ? {
              equals: item.strategyId 
             } : undefined,
          status: item.status !== undefined ? {
              equals: item.status 
             } : undefined,
        },
        create: {
          status: item.status !== undefined ? item.status : undefined,
          units: item.units !== undefined ? item.units : undefined,
          costBasis: item.costBasis !== undefined ? item.costBasis : undefined,
          realizedPL: item.realizedPL !== undefined ? item.realizedPL : undefined,
          targetAllocationPct: item.targetAllocationPct !== undefined ? item.targetAllocationPct : undefined,
          currency: item.currency !== undefined ? item.currency : undefined,
          subscribedAt: item.subscribedAt !== undefined ? item.subscribedAt : undefined,
          lastRebalancedAt: item.lastRebalancedAt !== undefined ? item.lastRebalancedAt : undefined,
          deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
      account: item.account ? 
        typeof item.account === 'object' && Object.keys(item.account).length === 1 && Object.keys(item.account)[0] === 'id'
    ? { connect: {
            id: item.account.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.account.id !== undefined ? item.account.id : undefined,
            type: item.account.type !== undefined ? {
                equals: item.account.type 
               } : undefined,
            userId: item.account.userId !== undefined ? {
                equals: item.account.userId 
               } : undefined,
          },
          create: {
            type: item.account.type !== undefined ? item.account.type : undefined,
            APIKey: item.account.APIKey !== undefined ? item.account.APIKey : undefined,
            APISecret: item.account.APISecret !== undefined ? item.account.APISecret : undefined,
            configuration: item.account.configuration !== undefined ? item.account.configuration : undefined,
            marketOpen: item.account.marketOpen !== undefined ? item.account.marketOpen : undefined,
            realTime: item.account.realTime !== undefined ? item.account.realTime : undefined,
            cryptoTradingEnabled: item.account.cryptoTradingEnabled !== undefined ? item.account.cryptoTradingEnabled : undefined,
            cryptoTradingPairs: item.account.cryptoTradingPairs !== undefined ? {
                set: item.account.cryptoTradingPairs 
               } : undefined,
            cryptoTradeAllocationPct: item.account.cryptoTradeAllocationPct !== undefined ? item.account.cryptoTradeAllocationPct : undefined,
            tradeAllocationPct: item.account.tradeAllocationPct !== undefined ? item.account.tradeAllocationPct : undefined,
            autoAllocation: item.account.autoAllocation !== undefined ? item.account.autoAllocation : undefined,
            minPercentageChange: item.account.minPercentageChange !== undefined ? item.account.minPercentageChange : undefined,
            volumeThreshold: item.account.volumeThreshold !== undefined ? item.account.volumeThreshold : undefined,
            enablePortfolioTrailingStop: item.account.enablePortfolioTrailingStop !== undefined ? item.account.enablePortfolioTrailingStop : undefined,
            portfolioTrailPercent: item.account.portfolioTrailPercent !== undefined ? item.account.portfolioTrailPercent : undefined,
            portfolioProfitThresholdPercent: item.account.portfolioProfitThresholdPercent !== undefined ? item.account.portfolioProfitThresholdPercent : undefined,
            reducedPortfolioTrailPercent: item.account.reducedPortfolioTrailPercent !== undefined ? item.account.reducedPortfolioTrailPercent : undefined,
            defaultTrailingStopPercentage100: item.account.defaultTrailingStopPercentage100 !== undefined ? item.account.defaultTrailingStopPercentage100 : undefined,
            firstTrailReductionThreshold100: item.account.firstTrailReductionThreshold100 !== undefined ? item.account.firstTrailReductionThreshold100 : undefined,
            secondTrailReductionThreshold100: item.account.secondTrailReductionThreshold100 !== undefined ? item.account.secondTrailReductionThreshold100 : undefined,
            firstReducedTrailPercentage100: item.account.firstReducedTrailPercentage100 !== undefined ? item.account.firstReducedTrailPercentage100 : undefined,
            secondReducedTrailPercentage100: item.account.secondReducedTrailPercentage100 !== undefined ? item.account.secondReducedTrailPercentage100 : undefined,
            minimumPriceChangePercent100: item.account.minimumPriceChangePercent100 !== undefined ? item.account.minimumPriceChangePercent100 : undefined,
            deletedAt: item.account.deletedAt !== undefined ? item.account.deletedAt : undefined,
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
          mutation: UPDATE_MANY_TRADE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyTrade) {
          return response.data.updateManyTrade;
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
          logger.error("Non-retryable constraint violation in updateManyTrade", {
            operation: 'updateManyTrade',
            model: 'Trade',
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
          logger.warn("Database connection error in updateManyTrade, retrying...", {
            operation: 'updateManyTrade',
            model: 'Trade',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyTrade',
            model: 'Trade',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyTrade',
            model: 'Trade',
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
   * Delete a single Trade record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted Trade or null.
   */
  async delete(props: TradeType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<TradeType> {
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

        const DELETE_ONE_TRADE = gql`
          mutation deleteOneTrade($where: TradeWhereUniqueInput!) {
            deleteOneTrade(where: $where) {
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
          mutation: DELETE_ONE_TRADE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneTrade) {
          return response.data.deleteOneTrade;
        } else {
          return null as unknown as TradeType;
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
          logger.error("Non-retryable constraint violation in deleteOneTrade", {
            operation: 'deleteOneTrade',
            model: 'Trade',
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
          logger.warn("Database connection error in deleteOneTrade, retrying...", {
            operation: 'deleteOneTrade',
            model: 'Trade',
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
            operation: 'deleteOneTrade',
            model: 'Trade',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneTrade',
            model: 'Trade',
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
   * Retrieve a single Trade record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved Trade or null.
   */
  async get(props: TradeType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<TradeType | null> {
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

        const GET_TRADE = gql`
          query getTrade($where: TradeWhereUniqueInput!) {
            getTrade(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  alpacaAccountId: props.alpacaAccountId !== undefined ? {
    equals: props.alpacaAccountId 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
  signalId: props.signalId !== undefined ? {
    equals: props.signalId 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_TRADE,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getTrade ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No Trade found') {
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
          logger.warn("Database connection error in getTrade, retrying...", {
            operation: 'getTrade',
            model: 'Trade',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getTrade',
            model: 'Trade',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getTrade',
            model: 'Trade',
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
   * Retrieve all Trades records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of Trade records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<TradeType[] | null> {
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

        const GET_ALL_TRADE = gql`
          query getAllTrade {
            trades {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_TRADE,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.trades ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No Trade found') {
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
          logger.warn("Database connection error in getAllTrade, retrying...", {
            operation: 'getAllTrade',
            model: 'Trade',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllTrade',
            model: 'Trade',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllTrade',
            model: 'Trade',
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
   * Find multiple Trade records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found Trade records or null.
   */
  async findMany(props: TradeType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<TradeType[] | null> {
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

        const FIND_MANY_TRADE = gql`
          query findManyTrade($where: TradeWhereInput!) {
            trades(where: $where) {
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
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
  symbol: props.symbol !== undefined ? {
    equals: props.symbol 
  } : undefined,
  signalId: props.signalId !== undefined ? {
    equals: props.signalId 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyTrade requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_TRADE,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.trades) {
          return response.data.trades;
        } else {
          return [] as TradeType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No Trade found') {
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
          logger.warn("Database connection error in findManyTrade, retrying...", {
            operation: 'findManyTrade',
            model: 'Trade',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyTrade',
            model: 'Trade',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyTrade',
            model: 'Trade',
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

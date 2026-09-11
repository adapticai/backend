
  
import { MandateRule as MandateRuleType } from './generated/typegraphql-prisma/models/MandateRule';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the MandateRule model.
   */

  const selectionSet = `
    
  id
  mandateVersionId
  mandateVersion {
    id
    mandateId
    versionLabel
    versionSeq
    status
    summary
    charterBody
    authoredById
    createdAt
    updatedAt
  }
  sectionId
  label
  detail
  control
  threshold
  unit
  limitKind
  orderIdx
  createdAt
  updatedAt

  `;

  export const MandateRule = {

    /**
     * Create a new MandateRule record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created MandateRule or null.
     */

    /**
     * Create a new MandateRule record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created MandateRule or null.
     */
    async create(props: MandateRuleType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<MandateRuleType> {
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

          const CREATE_ONE_MANDATERULE = gql`
              mutation createOneMandateRule($data: MandateRuleCreateInput!) {
                createOneMandateRule(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                sectionId: props.sectionId !== undefined ? props.sectionId : undefined,
  label: props.label !== undefined ? props.label : undefined,
  detail: props.detail !== undefined ? props.detail : undefined,
  control: props.control !== undefined ? props.control : undefined,
  threshold: props.threshold !== undefined ? props.threshold : undefined,
  unit: props.unit !== undefined ? props.unit : undefined,
  limitKind: props.limitKind !== undefined ? props.limitKind : undefined,
  orderIdx: props.orderIdx !== undefined ? props.orderIdx : undefined,
  mandateVersion: props.mandateVersion ? 
    typeof props.mandateVersion === 'object' && Object.keys(props.mandateVersion).length === 1 && Object.keys(props.mandateVersion)[0] === 'id'
    ? { connect: {
        id: props.mandateVersion.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.mandateVersion.id !== undefined ? props.mandateVersion.id : undefined,
        mandateId: props.mandateVersion.mandateId !== undefined ? {
            equals: props.mandateVersion.mandateId 
           } : undefined,
        status: props.mandateVersion.status !== undefined ? {
            equals: props.mandateVersion.status 
           } : undefined,
      },
      create: {
        versionLabel: props.mandateVersion.versionLabel !== undefined ? props.mandateVersion.versionLabel : undefined,
        versionSeq: props.mandateVersion.versionSeq !== undefined ? props.mandateVersion.versionSeq : undefined,
        status: props.mandateVersion.status !== undefined ? props.mandateVersion.status : undefined,
        summary: props.mandateVersion.summary !== undefined ? props.mandateVersion.summary : undefined,
        charterBody: props.mandateVersion.charterBody !== undefined ? props.mandateVersion.charterBody : undefined,
    mandate: props.mandateVersion.mandate ? 
      typeof props.mandateVersion.mandate === 'object' && Object.keys(props.mandateVersion.mandate).length === 1 && Object.keys(props.mandateVersion.mandate)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.mandate.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.mandate.id !== undefined ? props.mandateVersion.mandate.id : undefined,
          activeVersionId: props.mandateVersion.mandate.activeVersionId !== undefined ? props.mandateVersion.mandate.activeVersionId : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? {
              equals: props.mandateVersion.mandate.name 
             } : undefined,
          organizationId: props.mandateVersion.mandate.organizationId !== undefined ? {
              equals: props.mandateVersion.mandate.organizationId 
             } : undefined,
        },
        create: {
          scopeKind: props.mandateVersion.mandate.scopeKind !== undefined ? props.mandateVersion.mandate.scopeKind : undefined,
          klass: props.mandateVersion.mandate.klass !== undefined ? props.mandateVersion.mandate.klass : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? props.mandateVersion.mandate.name : undefined,
          personaScope: props.mandateVersion.mandate.personaScope !== undefined ? props.mandateVersion.mandate.personaScope : undefined,
          deletedAt: props.mandateVersion.mandate.deletedAt !== undefined ? props.mandateVersion.mandate.deletedAt : undefined,
      organization: props.mandateVersion.mandate.organization ? 
        typeof props.mandateVersion.mandate.organization === 'object' && Object.keys(props.mandateVersion.mandate.organization).length === 1 && Object.keys(props.mandateVersion.mandate.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.organization.id !== undefined ? props.mandateVersion.mandate.organization.id : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            name: props.mandateVersion.mandate.organization.name !== undefined ? {
                equals: props.mandateVersion.mandate.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.organization.name !== undefined ? props.mandateVersion.mandate.organization.name : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            logoUrl: props.mandateVersion.mandate.organization.logoUrl !== undefined ? props.mandateVersion.mandate.organization.logoUrl : undefined,
            website: props.mandateVersion.mandate.organization.website !== undefined ? props.mandateVersion.mandate.organization.website : undefined,
            businessType: props.mandateVersion.mandate.organization.businessType !== undefined ? props.mandateVersion.mandate.organization.businessType : undefined,
            emailDomains: props.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.mandate.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.mandate.organization.jurisdiction !== undefined ? props.mandateVersion.mandate.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? props.mandateVersion.mandate.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.mandate.organization.description !== undefined ? props.mandateVersion.mandate.organization.description : undefined,
            tradingDefaults: props.mandateVersion.mandate.organization.tradingDefaults !== undefined ? props.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.mandate.organization.deletedAt !== undefined ? props.mandateVersion.mandate.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.mandate.fund ? 
        typeof props.mandateVersion.mandate.fund === 'object' && Object.keys(props.mandateVersion.mandate.fund).length === 1 && Object.keys(props.mandateVersion.mandate.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.fund.id !== undefined ? props.mandateVersion.mandate.fund.id : undefined,
            name: props.mandateVersion.mandate.fund.name !== undefined ? {
                equals: props.mandateVersion.mandate.fund.name 
               } : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? {
                equals: props.mandateVersion.mandate.fund.slug 
               } : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? {
                equals: props.mandateVersion.mandate.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.mandate.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.fund.name !== undefined ? props.mandateVersion.mandate.fund.name : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? props.mandateVersion.mandate.fund.slug : undefined,
            description: props.mandateVersion.mandate.fund.description !== undefined ? props.mandateVersion.mandate.fund.description : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? props.mandateVersion.mandate.fund.status : undefined,
            currency: props.mandateVersion.mandate.fund.currency !== undefined ? props.mandateVersion.mandate.fund.currency : undefined,
            inceptionDate: props.mandateVersion.mandate.fund.inceptionDate !== undefined ? props.mandateVersion.mandate.fund.inceptionDate : undefined,
            aum: props.mandateVersion.mandate.fund.aum !== undefined ? props.mandateVersion.mandate.fund.aum : undefined,
            navPerShare: props.mandateVersion.mandate.fund.navPerShare !== undefined ? props.mandateVersion.mandate.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? props.mandateVersion.mandate.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? props.mandateVersion.mandate.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.mandate.fund.fees !== undefined ? props.mandateVersion.mandate.fund.fees : undefined,
            terms: props.mandateVersion.mandate.fund.terms !== undefined ? props.mandateVersion.mandate.fund.terms : undefined,
            regulatory: props.mandateVersion.mandate.fund.regulatory !== undefined ? props.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.mandate.fund.serviceProviders !== undefined ? props.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.mandate.fund.tradingOverrides !== undefined ? props.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.mandate.fund.deletedAt !== undefined ? props.mandateVersion.mandate.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.mandate.owner ? 
        typeof props.mandateVersion.mandate.owner === 'object' && Object.keys(props.mandateVersion.mandate.owner).length === 1 && Object.keys(props.mandateVersion.mandate.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.owner.id !== undefined ? props.mandateVersion.mandate.owner.id : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            name: props.mandateVersion.mandate.owner.name !== undefined ? {
                equals: props.mandateVersion.mandate.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.owner.name !== undefined ? props.mandateVersion.mandate.owner.name : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            emailVerified: props.mandateVersion.mandate.owner.emailVerified !== undefined ? props.mandateVersion.mandate.owner.emailVerified : undefined,
            image: props.mandateVersion.mandate.owner.image !== undefined ? props.mandateVersion.mandate.owner.image : undefined,
            avatarUrl: props.mandateVersion.mandate.owner.avatarUrl !== undefined ? props.mandateVersion.mandate.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.mandate.owner.onboardingComplete !== undefined ? props.mandateVersion.mandate.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.mandate.owner.signupCategory !== undefined ? props.mandateVersion.mandate.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.mandate.owner.deletedAt !== undefined ? props.mandateVersion.mandate.owner.deletedAt : undefined,
            role: props.mandateVersion.mandate.owner.role !== undefined ? props.mandateVersion.mandate.owner.role : undefined,
            bio: props.mandateVersion.mandate.owner.bio !== undefined ? props.mandateVersion.mandate.owner.bio : undefined,
            jobTitle: props.mandateVersion.mandate.owner.jobTitle !== undefined ? props.mandateVersion.mandate.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.mandate.owner.currentAccount !== undefined ? props.mandateVersion.mandate.owner.currentAccount : undefined,
            plan: props.mandateVersion.mandate.owner.plan !== undefined ? props.mandateVersion.mandate.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? props.mandateVersion.mandate.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.mandate.owner.openaiModel !== undefined ? props.mandateVersion.mandate.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      activeVersion: props.mandateVersion.mandate.activeVersion ? 
        typeof props.mandateVersion.mandate.activeVersion === 'object' && Object.keys(props.mandateVersion.mandate.activeVersion).length === 1 && Object.keys(props.mandateVersion.mandate.activeVersion)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.activeVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.activeVersion.id !== undefined ? props.mandateVersion.mandate.activeVersion.id : undefined,
            mandateId: props.mandateVersion.mandate.activeVersion.mandateId !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.mandateId 
               } : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.status 
               } : undefined,
          },
          create: {
            versionLabel: props.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? props.mandateVersion.mandate.activeVersion.versionLabel : undefined,
            versionSeq: props.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? props.mandateVersion.mandate.activeVersion.versionSeq : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? props.mandateVersion.mandate.activeVersion.status : undefined,
            summary: props.mandateVersion.mandate.activeVersion.summary !== undefined ? props.mandateVersion.mandate.activeVersion.summary : undefined,
            charterBody: props.mandateVersion.mandate.activeVersion.charterBody !== undefined ? props.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
        }
      } : undefined,
        },
      }
    } : undefined,
    authoredBy: props.mandateVersion.authoredBy ? 
      typeof props.mandateVersion.authoredBy === 'object' && Object.keys(props.mandateVersion.authoredBy).length === 1 && Object.keys(props.mandateVersion.authoredBy)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.authoredBy.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.authoredBy.id !== undefined ? props.mandateVersion.authoredBy.id : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? props.mandateVersion.authoredBy.email : undefined,
          name: props.mandateVersion.authoredBy.name !== undefined ? {
              equals: props.mandateVersion.authoredBy.name 
             } : undefined,
        },
        create: {
          name: props.mandateVersion.authoredBy.name !== undefined ? props.mandateVersion.authoredBy.name : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? props.mandateVersion.authoredBy.email : undefined,
          emailVerified: props.mandateVersion.authoredBy.emailVerified !== undefined ? props.mandateVersion.authoredBy.emailVerified : undefined,
          image: props.mandateVersion.authoredBy.image !== undefined ? props.mandateVersion.authoredBy.image : undefined,
          avatarUrl: props.mandateVersion.authoredBy.avatarUrl !== undefined ? props.mandateVersion.authoredBy.avatarUrl : undefined,
          onboardingComplete: props.mandateVersion.authoredBy.onboardingComplete !== undefined ? props.mandateVersion.authoredBy.onboardingComplete : undefined,
          signupCategory: props.mandateVersion.authoredBy.signupCategory !== undefined ? props.mandateVersion.authoredBy.signupCategory : undefined,
          deletedAt: props.mandateVersion.authoredBy.deletedAt !== undefined ? props.mandateVersion.authoredBy.deletedAt : undefined,
          role: props.mandateVersion.authoredBy.role !== undefined ? props.mandateVersion.authoredBy.role : undefined,
          bio: props.mandateVersion.authoredBy.bio !== undefined ? props.mandateVersion.authoredBy.bio : undefined,
          jobTitle: props.mandateVersion.authoredBy.jobTitle !== undefined ? props.mandateVersion.authoredBy.jobTitle : undefined,
          currentAccount: props.mandateVersion.authoredBy.currentAccount !== undefined ? props.mandateVersion.authoredBy.currentAccount : undefined,
          plan: props.mandateVersion.authoredBy.plan !== undefined ? props.mandateVersion.authoredBy.plan : undefined,
          openaiAPIKey: props.mandateVersion.authoredBy.openaiAPIKey !== undefined ? props.mandateVersion.authoredBy.openaiAPIKey : undefined,
          openaiModel: props.mandateVersion.authoredBy.openaiModel !== undefined ? props.mandateVersion.authoredBy.openaiModel : undefined,
      customer: props.mandateVersion.authoredBy.customer ? 
        typeof props.mandateVersion.authoredBy.customer === 'object' && Object.keys(props.mandateVersion.authoredBy.customer).length === 1 && Object.keys(props.mandateVersion.authoredBy.customer)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.customer.id !== undefined ? props.mandateVersion.authoredBy.customer.id : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.authUserId 
               } : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.name 
               } : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? props.mandateVersion.authoredBy.customer.authUserId : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? props.mandateVersion.authoredBy.customer.name : undefined,
            plan: props.mandateVersion.authoredBy.customer.plan !== undefined ? props.mandateVersion.authoredBy.customer.plan : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? props.mandateVersion.authoredBy.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? props.mandateVersion.authoredBy.customer.jurisdiction : undefined,
            riskProfile: props.mandateVersion.authoredBy.customer.riskProfile !== undefined ? props.mandateVersion.authoredBy.customer.riskProfile : undefined,
            amlStatus: props.mandateVersion.authoredBy.customer.amlStatus !== undefined ? props.mandateVersion.authoredBy.customer.amlStatus : undefined,
            lastKycUpdate: props.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? props.mandateVersion.authoredBy.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.mandateVersion.authoredBy.accounts ? 
        Array.isArray(props.mandateVersion.authoredBy.accounts) && props.mandateVersion.authoredBy.accounts.length > 0 &&  props.mandateVersion.authoredBy.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accounts.map((item) => ({
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
      sessions: props.mandateVersion.authoredBy.sessions ? 
        Array.isArray(props.mandateVersion.authoredBy.sessions) && props.mandateVersion.authoredBy.sessions.length > 0 &&  props.mandateVersion.authoredBy.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.sessions.map((item) => ({
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
      authenticators: props.mandateVersion.authoredBy.authenticators ? 
        Array.isArray(props.mandateVersion.authoredBy.authenticators) && props.mandateVersion.authoredBy.authenticators.length > 0 &&  props.mandateVersion.authoredBy.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.authenticators.map((item) => ({
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
      alpacaAccounts: props.mandateVersion.authoredBy.alpacaAccounts ? 
        Array.isArray(props.mandateVersion.authoredBy.alpacaAccounts) && props.mandateVersion.authoredBy.alpacaAccounts.length > 0 &&  props.mandateVersion.authoredBy.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
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
      linkedProviders: props.mandateVersion.authoredBy.linkedProviders ? 
        Array.isArray(props.mandateVersion.authoredBy.linkedProviders) && props.mandateVersion.authoredBy.linkedProviders.length > 0 &&  props.mandateVersion.authoredBy.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
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
      accountLinkingRequests: props.mandateVersion.authoredBy.accountLinkingRequests ? 
        Array.isArray(props.mandateVersion.authoredBy.accountLinkingRequests) && props.mandateVersion.authoredBy.accountLinkingRequests.length > 0 &&  props.mandateVersion.authoredBy.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
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
      reviewedWaitlistEntries: props.mandateVersion.authoredBy.reviewedWaitlistEntries ? 
        Array.isArray(props.mandateVersion.authoredBy.reviewedWaitlistEntries) && props.mandateVersion.authoredBy.reviewedWaitlistEntries.length > 0 &&  props.mandateVersion.authoredBy.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
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
      llmConfiguration: props.mandateVersion.authoredBy.llmConfiguration ? 
        typeof props.mandateVersion.authoredBy.llmConfiguration === 'object' && Object.keys(props.mandateVersion.authoredBy.llmConfiguration).length === 1 && Object.keys(props.mandateVersion.authoredBy.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.id : undefined,
            userId: props.mandateVersion.authoredBy.llmConfiguration.userId !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniProvider : undefined,
            normalProvider: props.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedProvider : undefined,
            miniModel: props.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniModel : undefined,
            normalModel: props.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalModel : undefined,
            advancedModel: props.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.mandateVersion.authoredBy.orgMemberships ? 
        Array.isArray(props.mandateVersion.authoredBy.orgMemberships) && props.mandateVersion.authoredBy.orgMemberships.length > 0 &&  props.mandateVersion.authoredBy.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
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
      fundAssignments: props.mandateVersion.authoredBy.fundAssignments ? 
        Array.isArray(props.mandateVersion.authoredBy.fundAssignments) && props.mandateVersion.authoredBy.fundAssignments.length > 0 &&  props.mandateVersion.authoredBy.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
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
      managedFunds: props.mandateVersion.authoredBy.managedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.managedFunds) && props.mandateVersion.authoredBy.managedFunds.length > 0 &&  props.mandateVersion.authoredBy.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.managedFunds.map((item) => ({
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
      operatedFunds: props.mandateVersion.authoredBy.operatedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.operatedFunds) && props.mandateVersion.authoredBy.operatedFunds.length > 0 &&  props.mandateVersion.authoredBy.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
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
      ownedMandates: props.mandateVersion.authoredBy.ownedMandates ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedMandates) && props.mandateVersion.authoredBy.ownedMandates.length > 0 &&  props.mandateVersion.authoredBy.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
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
      mandateApprovalsDecided: props.mandateVersion.authoredBy.mandateApprovalsDecided ? 
        Array.isArray(props.mandateVersion.authoredBy.mandateApprovalsDecided) && props.mandateVersion.authoredBy.mandateApprovalsDecided.length > 0 &&  props.mandateVersion.authoredBy.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
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
      investorProfiles: props.mandateVersion.authoredBy.investorProfiles ? 
        Array.isArray(props.mandateVersion.authoredBy.investorProfiles) && props.mandateVersion.authoredBy.investorProfiles.length > 0 &&  props.mandateVersion.authoredBy.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
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
      notificationDeliveries: props.mandateVersion.authoredBy.notificationDeliveries ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationDeliveries) && props.mandateVersion.authoredBy.notificationDeliveries.length > 0 &&  props.mandateVersion.authoredBy.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
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
      notificationPreferences: props.mandateVersion.authoredBy.notificationPreferences ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationPreferences) && props.mandateVersion.authoredBy.notificationPreferences.length > 0 &&  props.mandateVersion.authoredBy.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
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
      ownedStrategies: props.mandateVersion.authoredBy.ownedStrategies ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedStrategies) && props.mandateVersion.authoredBy.ownedStrategies.length > 0 &&  props.mandateVersion.authoredBy.ownedStrategies.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            key: item.key !== undefined ? item.key : undefined,
          },
          create: {
            key: item.key !== undefined ? item.key : undefined,
            displayName: item.displayName !== undefined ? item.displayName : undefined,
            description: item.description !== undefined ? item.description : undefined,
            origin: item.origin !== undefined ? item.origin : undefined,
            lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
            manifestHash: item.manifestHash !== undefined ? item.manifestHash : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    approvals: props.mandateVersion.approvals ? 
      Array.isArray(props.mandateVersion.approvals) && props.mandateVersion.approvals.length > 0 &&  props.mandateVersion.approvals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.mandateVersion.approvals.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.mandateVersion.approvals.map((item) => ({
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
      decidedBy: item.decidedBy ? 
        typeof item.decidedBy === 'object' && Object.keys(item.decidedBy).length === 1 && Object.keys(item.decidedBy)[0] === 'id'
    ? { connect: {
            id: item.decidedBy.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.decidedBy.id !== undefined ? item.decidedBy.id : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            name: item.decidedBy.name !== undefined ? {
                equals: item.decidedBy.name 
               } : undefined,
          },
          create: {
            name: item.decidedBy.name !== undefined ? item.decidedBy.name : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? item.decidedBy.emailVerified : undefined,
            image: item.decidedBy.image !== undefined ? item.decidedBy.image : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? item.decidedBy.avatarUrl : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? item.decidedBy.onboardingComplete : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? item.decidedBy.signupCategory : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? item.decidedBy.deletedAt : undefined,
            role: item.decidedBy.role !== undefined ? item.decidedBy.role : undefined,
            bio: item.decidedBy.bio !== undefined ? item.decidedBy.bio : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? item.decidedBy.jobTitle : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? item.decidedBy.currentAccount : undefined,
            plan: item.decidedBy.plan !== undefined ? item.decidedBy.plan : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? item.decidedBy.openaiAPIKey : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? item.decidedBy.openaiModel : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    activeFor: props.mandateVersion.activeFor ? 
      typeof props.mandateVersion.activeFor === 'object' && Object.keys(props.mandateVersion.activeFor).length === 1 && Object.keys(props.mandateVersion.activeFor)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.activeFor.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.activeFor.id !== undefined ? props.mandateVersion.activeFor.id : undefined,
          activeVersionId: props.mandateVersion.activeFor.activeVersionId !== undefined ? props.mandateVersion.activeFor.activeVersionId : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? {
              equals: props.mandateVersion.activeFor.name 
             } : undefined,
          organizationId: props.mandateVersion.activeFor.organizationId !== undefined ? {
              equals: props.mandateVersion.activeFor.organizationId 
             } : undefined,
        },
        create: {
          scopeKind: props.mandateVersion.activeFor.scopeKind !== undefined ? props.mandateVersion.activeFor.scopeKind : undefined,
          klass: props.mandateVersion.activeFor.klass !== undefined ? props.mandateVersion.activeFor.klass : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? props.mandateVersion.activeFor.name : undefined,
          personaScope: props.mandateVersion.activeFor.personaScope !== undefined ? props.mandateVersion.activeFor.personaScope : undefined,
          deletedAt: props.mandateVersion.activeFor.deletedAt !== undefined ? props.mandateVersion.activeFor.deletedAt : undefined,
      organization: props.mandateVersion.activeFor.organization ? 
        typeof props.mandateVersion.activeFor.organization === 'object' && Object.keys(props.mandateVersion.activeFor.organization).length === 1 && Object.keys(props.mandateVersion.activeFor.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.organization.id !== undefined ? props.mandateVersion.activeFor.organization.id : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            name: props.mandateVersion.activeFor.organization.name !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.organization.name !== undefined ? props.mandateVersion.activeFor.organization.name : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            logoUrl: props.mandateVersion.activeFor.organization.logoUrl !== undefined ? props.mandateVersion.activeFor.organization.logoUrl : undefined,
            website: props.mandateVersion.activeFor.organization.website !== undefined ? props.mandateVersion.activeFor.organization.website : undefined,
            businessType: props.mandateVersion.activeFor.organization.businessType !== undefined ? props.mandateVersion.activeFor.organization.businessType : undefined,
            emailDomains: props.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.activeFor.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.activeFor.organization.jurisdiction !== undefined ? props.mandateVersion.activeFor.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? props.mandateVersion.activeFor.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.activeFor.organization.description !== undefined ? props.mandateVersion.activeFor.organization.description : undefined,
            tradingDefaults: props.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? props.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.activeFor.organization.deletedAt !== undefined ? props.mandateVersion.activeFor.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.activeFor.fund ? 
        typeof props.mandateVersion.activeFor.fund === 'object' && Object.keys(props.mandateVersion.activeFor.fund).length === 1 && Object.keys(props.mandateVersion.activeFor.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.fund.id !== undefined ? props.mandateVersion.activeFor.fund.id : undefined,
            name: props.mandateVersion.activeFor.fund.name !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.name 
               } : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.slug 
               } : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.activeFor.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.fund.name !== undefined ? props.mandateVersion.activeFor.fund.name : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? props.mandateVersion.activeFor.fund.slug : undefined,
            description: props.mandateVersion.activeFor.fund.description !== undefined ? props.mandateVersion.activeFor.fund.description : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? props.mandateVersion.activeFor.fund.status : undefined,
            currency: props.mandateVersion.activeFor.fund.currency !== undefined ? props.mandateVersion.activeFor.fund.currency : undefined,
            inceptionDate: props.mandateVersion.activeFor.fund.inceptionDate !== undefined ? props.mandateVersion.activeFor.fund.inceptionDate : undefined,
            aum: props.mandateVersion.activeFor.fund.aum !== undefined ? props.mandateVersion.activeFor.fund.aum : undefined,
            navPerShare: props.mandateVersion.activeFor.fund.navPerShare !== undefined ? props.mandateVersion.activeFor.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? props.mandateVersion.activeFor.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? props.mandateVersion.activeFor.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.activeFor.fund.fees !== undefined ? props.mandateVersion.activeFor.fund.fees : undefined,
            terms: props.mandateVersion.activeFor.fund.terms !== undefined ? props.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: props.mandateVersion.activeFor.fund.regulatory !== undefined ? props.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.activeFor.fund.serviceProviders !== undefined ? props.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? props.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.activeFor.fund.deletedAt !== undefined ? props.mandateVersion.activeFor.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.activeFor.owner ? 
        typeof props.mandateVersion.activeFor.owner === 'object' && Object.keys(props.mandateVersion.activeFor.owner).length === 1 && Object.keys(props.mandateVersion.activeFor.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.owner.id !== undefined ? props.mandateVersion.activeFor.owner.id : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            name: props.mandateVersion.activeFor.owner.name !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.owner.name !== undefined ? props.mandateVersion.activeFor.owner.name : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            emailVerified: props.mandateVersion.activeFor.owner.emailVerified !== undefined ? props.mandateVersion.activeFor.owner.emailVerified : undefined,
            image: props.mandateVersion.activeFor.owner.image !== undefined ? props.mandateVersion.activeFor.owner.image : undefined,
            avatarUrl: props.mandateVersion.activeFor.owner.avatarUrl !== undefined ? props.mandateVersion.activeFor.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? props.mandateVersion.activeFor.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.activeFor.owner.signupCategory !== undefined ? props.mandateVersion.activeFor.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.activeFor.owner.deletedAt !== undefined ? props.mandateVersion.activeFor.owner.deletedAt : undefined,
            role: props.mandateVersion.activeFor.owner.role !== undefined ? props.mandateVersion.activeFor.owner.role : undefined,
            bio: props.mandateVersion.activeFor.owner.bio !== undefined ? props.mandateVersion.activeFor.owner.bio : undefined,
            jobTitle: props.mandateVersion.activeFor.owner.jobTitle !== undefined ? props.mandateVersion.activeFor.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.activeFor.owner.currentAccount !== undefined ? props.mandateVersion.activeFor.owner.currentAccount : undefined,
            plan: props.mandateVersion.activeFor.owner.plan !== undefined ? props.mandateVersion.activeFor.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? props.mandateVersion.activeFor.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.activeFor.owner.openaiModel !== undefined ? props.mandateVersion.activeFor.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      versions: props.mandateVersion.activeFor.versions ? 
        Array.isArray(props.mandateVersion.activeFor.versions) && props.mandateVersion.activeFor.versions.length > 0 &&  props.mandateVersion.activeFor.versions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.activeFor.versions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.activeFor.versions.map((item) => ({
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
        },
      }
    } : undefined,
      },
    }
  } : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_MANDATERULE,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneMandateRule) {
            return response.data.createOneMandateRule;
          } else {
            return null as unknown as MandateRuleType;
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
            logger.error("Non-retryable constraint violation in createOneMandateRule", {
              operation: 'createOneMandateRule',
              model: 'MandateRule',
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
            logger.warn("Database connection error in createOneMandateRule, retrying...", {
              operation: 'createOneMandateRule',
              model: 'MandateRule',
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
              operation: 'createOneMandateRule',
              model: 'MandateRule',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneMandateRule',
              model: 'MandateRule',
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
   * Create multiple MandateRule records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of MandateRule objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: MandateRuleType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_MANDATERULE = gql`
          mutation createManyMandateRule($data: [MandateRuleCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyMandateRule(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      mandateVersionId: prop.mandateVersionId !== undefined ? prop.mandateVersionId : undefined,
  sectionId: prop.sectionId !== undefined ? prop.sectionId : undefined,
  label: prop.label !== undefined ? prop.label : undefined,
  detail: prop.detail !== undefined ? prop.detail : undefined,
  control: prop.control !== undefined ? prop.control : undefined,
  threshold: prop.threshold !== undefined ? prop.threshold : undefined,
  unit: prop.unit !== undefined ? prop.unit : undefined,
  limitKind: prop.limitKind !== undefined ? prop.limitKind : undefined,
  orderIdx: prop.orderIdx !== undefined ? prop.orderIdx : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_MANDATERULE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyMandateRule) {
          return response.data.createManyMandateRule;
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
          logger.warn("Duplicate key in createManyMandateRule (expected during overlapping fetches)", {
            operation: 'createManyMandateRule',
            model: 'MandateRule',
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
          logger.warn("Database connection error in createManyMandateRule, retrying...", {
            operation: 'createManyMandateRule',
            model: 'MandateRule',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyMandateRule',
            model: 'MandateRule',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyMandateRule',
            model: 'MandateRule',
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
   * Update a single MandateRule record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated MandateRule or null.
   */
  async update(props: MandateRuleType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<MandateRuleType> {
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

        const UPDATE_ONE_MANDATERULE = gql`
          mutation updateOneMandateRule($data: MandateRuleUpdateInput!, $where: MandateRuleWhereUniqueInput!) {
            updateOneMandateRule(data: $data, where: $where) {
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
  sectionId: props.sectionId !== undefined ? {
            set: props.sectionId 
           } : undefined,
  label: props.label !== undefined ? {
            set: props.label 
           } : undefined,
  detail: props.detail !== undefined ? {
            set: props.detail 
           } : undefined,
  control: props.control !== undefined ? {
            set: props.control 
           } : undefined,
  threshold: props.threshold !== undefined ? {
            set: props.threshold 
           } : undefined,
  unit: props.unit !== undefined ? {
            set: props.unit 
           } : undefined,
  limitKind: props.limitKind !== undefined ? {
            set: props.limitKind 
           } : undefined,
  orderIdx: props.orderIdx !== undefined ? {
            set: props.orderIdx 
           } : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
  mandateVersion: props.mandateVersion ? 
  typeof props.mandateVersion === 'object' && Object.keys(props.mandateVersion).length === 1 && (Object.keys(props.mandateVersion)[0] === 'id' || Object.keys(props.mandateVersion)[0] === 'symbol')
? {
  connect: {
    id: props.mandateVersion.id
  }
} : { upsert: {
      where: {
        id: props.mandateVersion.id !== undefined ? {
            equals: props.mandateVersion.id
          } : undefined,
        mandateId: props.mandateVersion.mandateId !== undefined ? {
            equals: props.mandateVersion.mandateId
          } : undefined,
        status: props.mandateVersion.status !== undefined ? {
            equals: props.mandateVersion.status
          } : undefined,
        authoredById: props.mandateVersion.authoredById !== undefined ? {
            equals: props.mandateVersion.authoredById
          } : undefined,
      },
      update: {
        id: props.mandateVersion.id !== undefined ? {
            set: props.mandateVersion.id
          } : undefined,
        versionLabel: props.mandateVersion.versionLabel !== undefined ? {
            set: props.mandateVersion.versionLabel
          } : undefined,
        versionSeq: props.mandateVersion.versionSeq !== undefined ? {
            set: props.mandateVersion.versionSeq
          } : undefined,
        status: props.mandateVersion.status !== undefined ? {
            set: props.mandateVersion.status
          } : undefined,
        summary: props.mandateVersion.summary !== undefined ? {
            set: props.mandateVersion.summary
          } : undefined,
        charterBody: props.mandateVersion.charterBody !== undefined ? props.mandateVersion.charterBody : undefined,
    mandate: props.mandateVersion.mandate ? 
    typeof props.mandateVersion.mandate === 'object' && Object.keys(props.mandateVersion.mandate).length === 1 && (Object.keys(props.mandateVersion.mandate)[0] === 'id' || Object.keys(props.mandateVersion.mandate)[0] === 'symbol')
? {
    connect: {
      id: props.mandateVersion.mandate.id
    }
} : { upsert: {
        where: {
          id: props.mandateVersion.mandate.id !== undefined ? {
              equals: props.mandateVersion.mandate.id
            } : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? {
              equals: props.mandateVersion.mandate.name
            } : undefined,
          organizationId: props.mandateVersion.mandate.organizationId !== undefined ? {
              equals: props.mandateVersion.mandate.organizationId
            } : undefined,
          fundId: props.mandateVersion.mandate.fundId !== undefined ? {
              equals: props.mandateVersion.mandate.fundId
            } : undefined,
          ownerId: props.mandateVersion.mandate.ownerId !== undefined ? {
              equals: props.mandateVersion.mandate.ownerId
            } : undefined,
          activeVersionId: props.mandateVersion.mandate.activeVersionId !== undefined ? {
              equals: props.mandateVersion.mandate.activeVersionId
            } : undefined,
        },
        update: {
          id: props.mandateVersion.mandate.id !== undefined ? {
              set: props.mandateVersion.mandate.id
            } : undefined,
          scopeKind: props.mandateVersion.mandate.scopeKind !== undefined ? {
              set: props.mandateVersion.mandate.scopeKind
            } : undefined,
          klass: props.mandateVersion.mandate.klass !== undefined ? {
              set: props.mandateVersion.mandate.klass
            } : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? {
              set: props.mandateVersion.mandate.name
            } : undefined,
          personaScope: props.mandateVersion.mandate.personaScope !== undefined ? {
              set: props.mandateVersion.mandate.personaScope
            } : undefined,
          deletedAt: props.mandateVersion.mandate.deletedAt !== undefined ? {
              set: props.mandateVersion.mandate.deletedAt
            } : undefined,
      organization: props.mandateVersion.mandate.organization ? 
      typeof props.mandateVersion.mandate.organization === 'object' && Object.keys(props.mandateVersion.mandate.organization).length === 1 && (Object.keys(props.mandateVersion.mandate.organization)[0] === 'id' || Object.keys(props.mandateVersion.mandate.organization)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.mandate.organization.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.mandate.organization.id !== undefined ? {
                equals: props.mandateVersion.mandate.organization.id
              } : undefined,
            name: props.mandateVersion.mandate.organization.name !== undefined ? {
                equals: props.mandateVersion.mandate.organization.name
              } : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? {
                equals: props.mandateVersion.mandate.organization.slug
              } : undefined,
          },
          update: {
            id: props.mandateVersion.mandate.organization.id !== undefined ? {
                set: props.mandateVersion.mandate.organization.id
              } : undefined,
            name: props.mandateVersion.mandate.organization.name !== undefined ? {
                set: props.mandateVersion.mandate.organization.name
              } : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? {
                set: props.mandateVersion.mandate.organization.slug
              } : undefined,
            logoUrl: props.mandateVersion.mandate.organization.logoUrl !== undefined ? {
                set: props.mandateVersion.mandate.organization.logoUrl
              } : undefined,
            website: props.mandateVersion.mandate.organization.website !== undefined ? {
                set: props.mandateVersion.mandate.organization.website
              } : undefined,
            businessType: props.mandateVersion.mandate.organization.businessType !== undefined ? {
                set: props.mandateVersion.mandate.organization.businessType
              } : undefined,
            emailDomains: props.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.mandate.organization.emailDomains
              } : undefined,
            jurisdiction: props.mandateVersion.mandate.organization.jurisdiction !== undefined ? {
                set: props.mandateVersion.mandate.organization.jurisdiction
              } : undefined,
            regulatoryStatus: props.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? {
                set: props.mandateVersion.mandate.organization.regulatoryStatus
              } : undefined,
            description: props.mandateVersion.mandate.organization.description !== undefined ? {
                set: props.mandateVersion.mandate.organization.description
              } : undefined,
            tradingDefaults: props.mandateVersion.mandate.organization.tradingDefaults !== undefined ? props.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.mandate.organization.deletedAt !== undefined ? {
                set: props.mandateVersion.mandate.organization.deletedAt
              } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.organization.name !== undefined ? props.mandateVersion.mandate.organization.name : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            logoUrl: props.mandateVersion.mandate.organization.logoUrl !== undefined ? props.mandateVersion.mandate.organization.logoUrl : undefined,
            website: props.mandateVersion.mandate.organization.website !== undefined ? props.mandateVersion.mandate.organization.website : undefined,
            businessType: props.mandateVersion.mandate.organization.businessType !== undefined ? props.mandateVersion.mandate.organization.businessType : undefined,
            emailDomains: props.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.mandate.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.mandate.organization.jurisdiction !== undefined ? props.mandateVersion.mandate.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? props.mandateVersion.mandate.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.mandate.organization.description !== undefined ? props.mandateVersion.mandate.organization.description : undefined,
            tradingDefaults: props.mandateVersion.mandate.organization.tradingDefaults !== undefined ? props.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.mandate.organization.deletedAt !== undefined ? props.mandateVersion.mandate.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.mandate.fund ? 
      typeof props.mandateVersion.mandate.fund === 'object' && Object.keys(props.mandateVersion.mandate.fund).length === 1 && (Object.keys(props.mandateVersion.mandate.fund)[0] === 'id' || Object.keys(props.mandateVersion.mandate.fund)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.mandate.fund.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.mandate.fund.id !== undefined ? {
                equals: props.mandateVersion.mandate.fund.id
              } : undefined,
            name: props.mandateVersion.mandate.fund.name !== undefined ? {
                equals: props.mandateVersion.mandate.fund.name
              } : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? {
                equals: props.mandateVersion.mandate.fund.slug
              } : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? {
                equals: props.mandateVersion.mandate.fund.status
              } : undefined,
            organizationId: props.mandateVersion.mandate.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.organizationId
              } : undefined,
            managerId: props.mandateVersion.mandate.fund.managerId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.managerId
              } : undefined,
            operatorId: props.mandateVersion.mandate.fund.operatorId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.operatorId
              } : undefined,
          },
          update: {
            id: props.mandateVersion.mandate.fund.id !== undefined ? {
                set: props.mandateVersion.mandate.fund.id
              } : undefined,
            name: props.mandateVersion.mandate.fund.name !== undefined ? {
                set: props.mandateVersion.mandate.fund.name
              } : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? {
                set: props.mandateVersion.mandate.fund.slug
              } : undefined,
            description: props.mandateVersion.mandate.fund.description !== undefined ? {
                set: props.mandateVersion.mandate.fund.description
              } : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? {
                set: props.mandateVersion.mandate.fund.status
              } : undefined,
            currency: props.mandateVersion.mandate.fund.currency !== undefined ? {
                set: props.mandateVersion.mandate.fund.currency
              } : undefined,
            inceptionDate: props.mandateVersion.mandate.fund.inceptionDate !== undefined ? {
                set: props.mandateVersion.mandate.fund.inceptionDate
              } : undefined,
            aum: props.mandateVersion.mandate.fund.aum !== undefined ? {
                set: props.mandateVersion.mandate.fund.aum
              } : undefined,
            navPerShare: props.mandateVersion.mandate.fund.navPerShare !== undefined ? {
                set: props.mandateVersion.mandate.fund.navPerShare
              } : undefined,
            sharesOutstanding: props.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? {
                set: props.mandateVersion.mandate.fund.sharesOutstanding
              } : undefined,
            highWaterMarkNav: props.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? {
                set: props.mandateVersion.mandate.fund.highWaterMarkNav
              } : undefined,
            fees: props.mandateVersion.mandate.fund.fees !== undefined ? props.mandateVersion.mandate.fund.fees : undefined,
            terms: props.mandateVersion.mandate.fund.terms !== undefined ? props.mandateVersion.mandate.fund.terms : undefined,
            regulatory: props.mandateVersion.mandate.fund.regulatory !== undefined ? props.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.mandate.fund.serviceProviders !== undefined ? props.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.mandate.fund.tradingOverrides !== undefined ? props.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.mandate.fund.deletedAt !== undefined ? {
                set: props.mandateVersion.mandate.fund.deletedAt
              } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.fund.name !== undefined ? props.mandateVersion.mandate.fund.name : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? props.mandateVersion.mandate.fund.slug : undefined,
            description: props.mandateVersion.mandate.fund.description !== undefined ? props.mandateVersion.mandate.fund.description : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? props.mandateVersion.mandate.fund.status : undefined,
            currency: props.mandateVersion.mandate.fund.currency !== undefined ? props.mandateVersion.mandate.fund.currency : undefined,
            inceptionDate: props.mandateVersion.mandate.fund.inceptionDate !== undefined ? props.mandateVersion.mandate.fund.inceptionDate : undefined,
            aum: props.mandateVersion.mandate.fund.aum !== undefined ? props.mandateVersion.mandate.fund.aum : undefined,
            navPerShare: props.mandateVersion.mandate.fund.navPerShare !== undefined ? props.mandateVersion.mandate.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? props.mandateVersion.mandate.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? props.mandateVersion.mandate.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.mandate.fund.fees !== undefined ? props.mandateVersion.mandate.fund.fees : undefined,
            terms: props.mandateVersion.mandate.fund.terms !== undefined ? props.mandateVersion.mandate.fund.terms : undefined,
            regulatory: props.mandateVersion.mandate.fund.regulatory !== undefined ? props.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.mandate.fund.serviceProviders !== undefined ? props.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.mandate.fund.tradingOverrides !== undefined ? props.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.mandate.fund.deletedAt !== undefined ? props.mandateVersion.mandate.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.mandate.owner ? 
      typeof props.mandateVersion.mandate.owner === 'object' && Object.keys(props.mandateVersion.mandate.owner).length === 1 && (Object.keys(props.mandateVersion.mandate.owner)[0] === 'id' || Object.keys(props.mandateVersion.mandate.owner)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.mandate.owner.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.mandate.owner.id !== undefined ? {
                equals: props.mandateVersion.mandate.owner.id
              } : undefined,
            name: props.mandateVersion.mandate.owner.name !== undefined ? {
                equals: props.mandateVersion.mandate.owner.name
              } : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? {
                equals: props.mandateVersion.mandate.owner.email
              } : undefined,
            customerId: props.mandateVersion.mandate.owner.customerId !== undefined ? {
                equals: props.mandateVersion.mandate.owner.customerId
              } : undefined,
          },
          update: {
            id: props.mandateVersion.mandate.owner.id !== undefined ? {
                set: props.mandateVersion.mandate.owner.id
              } : undefined,
            name: props.mandateVersion.mandate.owner.name !== undefined ? {
                set: props.mandateVersion.mandate.owner.name
              } : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? {
                set: props.mandateVersion.mandate.owner.email
              } : undefined,
            emailVerified: props.mandateVersion.mandate.owner.emailVerified !== undefined ? {
                set: props.mandateVersion.mandate.owner.emailVerified
              } : undefined,
            image: props.mandateVersion.mandate.owner.image !== undefined ? {
                set: props.mandateVersion.mandate.owner.image
              } : undefined,
            avatarUrl: props.mandateVersion.mandate.owner.avatarUrl !== undefined ? {
                set: props.mandateVersion.mandate.owner.avatarUrl
              } : undefined,
            onboardingComplete: props.mandateVersion.mandate.owner.onboardingComplete !== undefined ? {
                set: props.mandateVersion.mandate.owner.onboardingComplete
              } : undefined,
            signupCategory: props.mandateVersion.mandate.owner.signupCategory !== undefined ? {
                set: props.mandateVersion.mandate.owner.signupCategory
              } : undefined,
            deletedAt: props.mandateVersion.mandate.owner.deletedAt !== undefined ? {
                set: props.mandateVersion.mandate.owner.deletedAt
              } : undefined,
            role: props.mandateVersion.mandate.owner.role !== undefined ? {
                set: props.mandateVersion.mandate.owner.role
              } : undefined,
            bio: props.mandateVersion.mandate.owner.bio !== undefined ? {
                set: props.mandateVersion.mandate.owner.bio
              } : undefined,
            jobTitle: props.mandateVersion.mandate.owner.jobTitle !== undefined ? {
                set: props.mandateVersion.mandate.owner.jobTitle
              } : undefined,
            currentAccount: props.mandateVersion.mandate.owner.currentAccount !== undefined ? {
                set: props.mandateVersion.mandate.owner.currentAccount
              } : undefined,
            plan: props.mandateVersion.mandate.owner.plan !== undefined ? {
                set: props.mandateVersion.mandate.owner.plan
              } : undefined,
            openaiAPIKey: props.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? {
                set: props.mandateVersion.mandate.owner.openaiAPIKey
              } : undefined,
            openaiModel: props.mandateVersion.mandate.owner.openaiModel !== undefined ? {
                set: props.mandateVersion.mandate.owner.openaiModel
              } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.owner.name !== undefined ? props.mandateVersion.mandate.owner.name : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            emailVerified: props.mandateVersion.mandate.owner.emailVerified !== undefined ? props.mandateVersion.mandate.owner.emailVerified : undefined,
            image: props.mandateVersion.mandate.owner.image !== undefined ? props.mandateVersion.mandate.owner.image : undefined,
            avatarUrl: props.mandateVersion.mandate.owner.avatarUrl !== undefined ? props.mandateVersion.mandate.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.mandate.owner.onboardingComplete !== undefined ? props.mandateVersion.mandate.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.mandate.owner.signupCategory !== undefined ? props.mandateVersion.mandate.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.mandate.owner.deletedAt !== undefined ? props.mandateVersion.mandate.owner.deletedAt : undefined,
            role: props.mandateVersion.mandate.owner.role !== undefined ? props.mandateVersion.mandate.owner.role : undefined,
            bio: props.mandateVersion.mandate.owner.bio !== undefined ? props.mandateVersion.mandate.owner.bio : undefined,
            jobTitle: props.mandateVersion.mandate.owner.jobTitle !== undefined ? props.mandateVersion.mandate.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.mandate.owner.currentAccount !== undefined ? props.mandateVersion.mandate.owner.currentAccount : undefined,
            plan: props.mandateVersion.mandate.owner.plan !== undefined ? props.mandateVersion.mandate.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? props.mandateVersion.mandate.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.mandate.owner.openaiModel !== undefined ? props.mandateVersion.mandate.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      activeVersion: props.mandateVersion.mandate.activeVersion ? 
      typeof props.mandateVersion.mandate.activeVersion === 'object' && Object.keys(props.mandateVersion.mandate.activeVersion).length === 1 && (Object.keys(props.mandateVersion.mandate.activeVersion)[0] === 'id' || Object.keys(props.mandateVersion.mandate.activeVersion)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.mandate.activeVersion.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.mandate.activeVersion.id !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.id
              } : undefined,
            mandateId: props.mandateVersion.mandate.activeVersion.mandateId !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.mandateId
              } : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.status
              } : undefined,
            authoredById: props.mandateVersion.mandate.activeVersion.authoredById !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.authoredById
              } : undefined,
          },
          update: {
            id: props.mandateVersion.mandate.activeVersion.id !== undefined ? {
                set: props.mandateVersion.mandate.activeVersion.id
              } : undefined,
            versionLabel: props.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? {
                set: props.mandateVersion.mandate.activeVersion.versionLabel
              } : undefined,
            versionSeq: props.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? {
                set: props.mandateVersion.mandate.activeVersion.versionSeq
              } : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? {
                set: props.mandateVersion.mandate.activeVersion.status
              } : undefined,
            summary: props.mandateVersion.mandate.activeVersion.summary !== undefined ? {
                set: props.mandateVersion.mandate.activeVersion.summary
              } : undefined,
            charterBody: props.mandateVersion.mandate.activeVersion.charterBody !== undefined ? props.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
          create: {
            versionLabel: props.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? props.mandateVersion.mandate.activeVersion.versionLabel : undefined,
            versionSeq: props.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? props.mandateVersion.mandate.activeVersion.versionSeq : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? props.mandateVersion.mandate.activeVersion.status : undefined,
            summary: props.mandateVersion.mandate.activeVersion.summary !== undefined ? props.mandateVersion.mandate.activeVersion.summary : undefined,
            charterBody: props.mandateVersion.mandate.activeVersion.charterBody !== undefined ? props.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
        }
      } : undefined,
        },
        create: {
          scopeKind: props.mandateVersion.mandate.scopeKind !== undefined ? props.mandateVersion.mandate.scopeKind : undefined,
          klass: props.mandateVersion.mandate.klass !== undefined ? props.mandateVersion.mandate.klass : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? props.mandateVersion.mandate.name : undefined,
          personaScope: props.mandateVersion.mandate.personaScope !== undefined ? props.mandateVersion.mandate.personaScope : undefined,
          deletedAt: props.mandateVersion.mandate.deletedAt !== undefined ? props.mandateVersion.mandate.deletedAt : undefined,
      organization: props.mandateVersion.mandate.organization ? 
        typeof props.mandateVersion.mandate.organization === 'object' && Object.keys(props.mandateVersion.mandate.organization).length === 1 && Object.keys(props.mandateVersion.mandate.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.organization.id !== undefined ? props.mandateVersion.mandate.organization.id : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            name: props.mandateVersion.mandate.organization.name !== undefined ? {
                equals: props.mandateVersion.mandate.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.organization.name !== undefined ? props.mandateVersion.mandate.organization.name : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            logoUrl: props.mandateVersion.mandate.organization.logoUrl !== undefined ? props.mandateVersion.mandate.organization.logoUrl : undefined,
            website: props.mandateVersion.mandate.organization.website !== undefined ? props.mandateVersion.mandate.organization.website : undefined,
            businessType: props.mandateVersion.mandate.organization.businessType !== undefined ? props.mandateVersion.mandate.organization.businessType : undefined,
            emailDomains: props.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.mandate.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.mandate.organization.jurisdiction !== undefined ? props.mandateVersion.mandate.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? props.mandateVersion.mandate.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.mandate.organization.description !== undefined ? props.mandateVersion.mandate.organization.description : undefined,
            tradingDefaults: props.mandateVersion.mandate.organization.tradingDefaults !== undefined ? props.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.mandate.organization.deletedAt !== undefined ? props.mandateVersion.mandate.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.mandate.fund ? 
        typeof props.mandateVersion.mandate.fund === 'object' && Object.keys(props.mandateVersion.mandate.fund).length === 1 && Object.keys(props.mandateVersion.mandate.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.fund.id !== undefined ? props.mandateVersion.mandate.fund.id : undefined,
            name: props.mandateVersion.mandate.fund.name !== undefined ? {
                equals: props.mandateVersion.mandate.fund.name 
               } : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? {
                equals: props.mandateVersion.mandate.fund.slug 
               } : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? {
                equals: props.mandateVersion.mandate.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.mandate.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.fund.name !== undefined ? props.mandateVersion.mandate.fund.name : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? props.mandateVersion.mandate.fund.slug : undefined,
            description: props.mandateVersion.mandate.fund.description !== undefined ? props.mandateVersion.mandate.fund.description : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? props.mandateVersion.mandate.fund.status : undefined,
            currency: props.mandateVersion.mandate.fund.currency !== undefined ? props.mandateVersion.mandate.fund.currency : undefined,
            inceptionDate: props.mandateVersion.mandate.fund.inceptionDate !== undefined ? props.mandateVersion.mandate.fund.inceptionDate : undefined,
            aum: props.mandateVersion.mandate.fund.aum !== undefined ? props.mandateVersion.mandate.fund.aum : undefined,
            navPerShare: props.mandateVersion.mandate.fund.navPerShare !== undefined ? props.mandateVersion.mandate.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? props.mandateVersion.mandate.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? props.mandateVersion.mandate.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.mandate.fund.fees !== undefined ? props.mandateVersion.mandate.fund.fees : undefined,
            terms: props.mandateVersion.mandate.fund.terms !== undefined ? props.mandateVersion.mandate.fund.terms : undefined,
            regulatory: props.mandateVersion.mandate.fund.regulatory !== undefined ? props.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.mandate.fund.serviceProviders !== undefined ? props.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.mandate.fund.tradingOverrides !== undefined ? props.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.mandate.fund.deletedAt !== undefined ? props.mandateVersion.mandate.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.mandate.owner ? 
        typeof props.mandateVersion.mandate.owner === 'object' && Object.keys(props.mandateVersion.mandate.owner).length === 1 && Object.keys(props.mandateVersion.mandate.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.owner.id !== undefined ? props.mandateVersion.mandate.owner.id : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            name: props.mandateVersion.mandate.owner.name !== undefined ? {
                equals: props.mandateVersion.mandate.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.owner.name !== undefined ? props.mandateVersion.mandate.owner.name : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            emailVerified: props.mandateVersion.mandate.owner.emailVerified !== undefined ? props.mandateVersion.mandate.owner.emailVerified : undefined,
            image: props.mandateVersion.mandate.owner.image !== undefined ? props.mandateVersion.mandate.owner.image : undefined,
            avatarUrl: props.mandateVersion.mandate.owner.avatarUrl !== undefined ? props.mandateVersion.mandate.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.mandate.owner.onboardingComplete !== undefined ? props.mandateVersion.mandate.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.mandate.owner.signupCategory !== undefined ? props.mandateVersion.mandate.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.mandate.owner.deletedAt !== undefined ? props.mandateVersion.mandate.owner.deletedAt : undefined,
            role: props.mandateVersion.mandate.owner.role !== undefined ? props.mandateVersion.mandate.owner.role : undefined,
            bio: props.mandateVersion.mandate.owner.bio !== undefined ? props.mandateVersion.mandate.owner.bio : undefined,
            jobTitle: props.mandateVersion.mandate.owner.jobTitle !== undefined ? props.mandateVersion.mandate.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.mandate.owner.currentAccount !== undefined ? props.mandateVersion.mandate.owner.currentAccount : undefined,
            plan: props.mandateVersion.mandate.owner.plan !== undefined ? props.mandateVersion.mandate.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? props.mandateVersion.mandate.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.mandate.owner.openaiModel !== undefined ? props.mandateVersion.mandate.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      activeVersion: props.mandateVersion.mandate.activeVersion ? 
        typeof props.mandateVersion.mandate.activeVersion === 'object' && Object.keys(props.mandateVersion.mandate.activeVersion).length === 1 && Object.keys(props.mandateVersion.mandate.activeVersion)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.activeVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.activeVersion.id !== undefined ? props.mandateVersion.mandate.activeVersion.id : undefined,
            mandateId: props.mandateVersion.mandate.activeVersion.mandateId !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.mandateId 
               } : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.status 
               } : undefined,
          },
          create: {
            versionLabel: props.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? props.mandateVersion.mandate.activeVersion.versionLabel : undefined,
            versionSeq: props.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? props.mandateVersion.mandate.activeVersion.versionSeq : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? props.mandateVersion.mandate.activeVersion.status : undefined,
            summary: props.mandateVersion.mandate.activeVersion.summary !== undefined ? props.mandateVersion.mandate.activeVersion.summary : undefined,
            charterBody: props.mandateVersion.mandate.activeVersion.charterBody !== undefined ? props.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
        }
      } : undefined,
        },
      }
    } : undefined,
    authoredBy: props.mandateVersion.authoredBy ? 
    typeof props.mandateVersion.authoredBy === 'object' && Object.keys(props.mandateVersion.authoredBy).length === 1 && (Object.keys(props.mandateVersion.authoredBy)[0] === 'id' || Object.keys(props.mandateVersion.authoredBy)[0] === 'symbol')
? {
    connect: {
      id: props.mandateVersion.authoredBy.id
    }
} : { upsert: {
        where: {
          id: props.mandateVersion.authoredBy.id !== undefined ? {
              equals: props.mandateVersion.authoredBy.id
            } : undefined,
          name: props.mandateVersion.authoredBy.name !== undefined ? {
              equals: props.mandateVersion.authoredBy.name
            } : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? {
              equals: props.mandateVersion.authoredBy.email
            } : undefined,
          customerId: props.mandateVersion.authoredBy.customerId !== undefined ? {
              equals: props.mandateVersion.authoredBy.customerId
            } : undefined,
        },
        update: {
          id: props.mandateVersion.authoredBy.id !== undefined ? {
              set: props.mandateVersion.authoredBy.id
            } : undefined,
          name: props.mandateVersion.authoredBy.name !== undefined ? {
              set: props.mandateVersion.authoredBy.name
            } : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? {
              set: props.mandateVersion.authoredBy.email
            } : undefined,
          emailVerified: props.mandateVersion.authoredBy.emailVerified !== undefined ? {
              set: props.mandateVersion.authoredBy.emailVerified
            } : undefined,
          image: props.mandateVersion.authoredBy.image !== undefined ? {
              set: props.mandateVersion.authoredBy.image
            } : undefined,
          avatarUrl: props.mandateVersion.authoredBy.avatarUrl !== undefined ? {
              set: props.mandateVersion.authoredBy.avatarUrl
            } : undefined,
          onboardingComplete: props.mandateVersion.authoredBy.onboardingComplete !== undefined ? {
              set: props.mandateVersion.authoredBy.onboardingComplete
            } : undefined,
          signupCategory: props.mandateVersion.authoredBy.signupCategory !== undefined ? {
              set: props.mandateVersion.authoredBy.signupCategory
            } : undefined,
          deletedAt: props.mandateVersion.authoredBy.deletedAt !== undefined ? {
              set: props.mandateVersion.authoredBy.deletedAt
            } : undefined,
          role: props.mandateVersion.authoredBy.role !== undefined ? {
              set: props.mandateVersion.authoredBy.role
            } : undefined,
          bio: props.mandateVersion.authoredBy.bio !== undefined ? {
              set: props.mandateVersion.authoredBy.bio
            } : undefined,
          jobTitle: props.mandateVersion.authoredBy.jobTitle !== undefined ? {
              set: props.mandateVersion.authoredBy.jobTitle
            } : undefined,
          currentAccount: props.mandateVersion.authoredBy.currentAccount !== undefined ? {
              set: props.mandateVersion.authoredBy.currentAccount
            } : undefined,
          plan: props.mandateVersion.authoredBy.plan !== undefined ? {
              set: props.mandateVersion.authoredBy.plan
            } : undefined,
          openaiAPIKey: props.mandateVersion.authoredBy.openaiAPIKey !== undefined ? {
              set: props.mandateVersion.authoredBy.openaiAPIKey
            } : undefined,
          openaiModel: props.mandateVersion.authoredBy.openaiModel !== undefined ? {
              set: props.mandateVersion.authoredBy.openaiModel
            } : undefined,
      customer: props.mandateVersion.authoredBy.customer ? 
      typeof props.mandateVersion.authoredBy.customer === 'object' && Object.keys(props.mandateVersion.authoredBy.customer).length === 1 && (Object.keys(props.mandateVersion.authoredBy.customer)[0] === 'id' || Object.keys(props.mandateVersion.authoredBy.customer)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.authoredBy.customer.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.authoredBy.customer.id !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.id
              } : undefined,
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.authUserId
              } : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.name
              } : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripePriceId
              } : undefined,
          },
          update: {
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.authUserId
              } : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.name
              } : undefined,
            plan: props.mandateVersion.authoredBy.customer.plan !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.plan
              } : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.stripePriceId
              } : undefined,
            stripeCurrentPeriodEnd: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd
              } : undefined,
            jurisdiction: props.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.jurisdiction
              } : undefined,
            riskProfile: props.mandateVersion.authoredBy.customer.riskProfile !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.riskProfile
              } : undefined,
            amlStatus: props.mandateVersion.authoredBy.customer.amlStatus !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.amlStatus
              } : undefined,
            lastKycUpdate: props.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.lastKycUpdate
              } : undefined,
          },
          create: {
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? props.mandateVersion.authoredBy.customer.authUserId : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? props.mandateVersion.authoredBy.customer.name : undefined,
            plan: props.mandateVersion.authoredBy.customer.plan !== undefined ? props.mandateVersion.authoredBy.customer.plan : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? props.mandateVersion.authoredBy.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? props.mandateVersion.authoredBy.customer.jurisdiction : undefined,
            riskProfile: props.mandateVersion.authoredBy.customer.riskProfile !== undefined ? props.mandateVersion.authoredBy.customer.riskProfile : undefined,
            amlStatus: props.mandateVersion.authoredBy.customer.amlStatus !== undefined ? props.mandateVersion.authoredBy.customer.amlStatus : undefined,
            lastKycUpdate: props.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? props.mandateVersion.authoredBy.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.mandateVersion.authoredBy.accounts ? 
      Array.isArray(props.mandateVersion.authoredBy.accounts) && props.mandateVersion.authoredBy.accounts.length > 0 && props.mandateVersion.authoredBy.accounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.accounts.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.accounts.map((item) => ({
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
      sessions: props.mandateVersion.authoredBy.sessions ? 
      Array.isArray(props.mandateVersion.authoredBy.sessions) && props.mandateVersion.authoredBy.sessions.length > 0 && props.mandateVersion.authoredBy.sessions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.sessions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.sessions.map((item) => ({
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
      authenticators: props.mandateVersion.authoredBy.authenticators ? 
      Array.isArray(props.mandateVersion.authoredBy.authenticators) && props.mandateVersion.authoredBy.authenticators.length > 0 && props.mandateVersion.authoredBy.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.authenticators.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.authenticators.map((item) => ({
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
      alpacaAccounts: props.mandateVersion.authoredBy.alpacaAccounts ? 
      Array.isArray(props.mandateVersion.authoredBy.alpacaAccounts) && props.mandateVersion.authoredBy.alpacaAccounts.length > 0 && props.mandateVersion.authoredBy.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
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
      linkedProviders: props.mandateVersion.authoredBy.linkedProviders ? 
      Array.isArray(props.mandateVersion.authoredBy.linkedProviders) && props.mandateVersion.authoredBy.linkedProviders.length > 0 && props.mandateVersion.authoredBy.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
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
      accountLinkingRequests: props.mandateVersion.authoredBy.accountLinkingRequests ? 
      Array.isArray(props.mandateVersion.authoredBy.accountLinkingRequests) && props.mandateVersion.authoredBy.accountLinkingRequests.length > 0 && props.mandateVersion.authoredBy.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
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
      reviewedWaitlistEntries: props.mandateVersion.authoredBy.reviewedWaitlistEntries ? 
      Array.isArray(props.mandateVersion.authoredBy.reviewedWaitlistEntries) && props.mandateVersion.authoredBy.reviewedWaitlistEntries.length > 0 && props.mandateVersion.authoredBy.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
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
      llmConfiguration: props.mandateVersion.authoredBy.llmConfiguration ? 
      typeof props.mandateVersion.authoredBy.llmConfiguration === 'object' && Object.keys(props.mandateVersion.authoredBy.llmConfiguration).length === 1 && (Object.keys(props.mandateVersion.authoredBy.llmConfiguration)[0] === 'id' || Object.keys(props.mandateVersion.authoredBy.llmConfiguration)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.authoredBy.llmConfiguration.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? {
                equals: props.mandateVersion.authoredBy.llmConfiguration.id
              } : undefined,
            userId: props.mandateVersion.authoredBy.llmConfiguration.userId !== undefined ? {
                equals: props.mandateVersion.authoredBy.llmConfiguration.userId
              } : undefined,
          },
          update: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.id
              } : undefined,
            defaultProvider: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider
              } : undefined,
            miniProvider: props.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.miniProvider
              } : undefined,
            normalProvider: props.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.normalProvider
              } : undefined,
            advancedProvider: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider
              } : undefined,
            miniModel: props.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.miniModel
              } : undefined,
            normalModel: props.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.normalModel
              } : undefined,
            advancedModel: props.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.advancedModel
              } : undefined,
            openaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey
              } : undefined,
            anthropicApiKey: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey
              } : undefined,
            deepseekApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey
              } : undefined,
            kimiApiKey: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey
              } : undefined,
            qwenApiKey: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey
              } : undefined,
            xaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey
              } : undefined,
            geminiApiKey: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey
              } : undefined,
            deepinfraApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey
              } : undefined,
          },
          create: {
            defaultProvider: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniProvider : undefined,
            normalProvider: props.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedProvider : undefined,
            miniModel: props.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniModel : undefined,
            normalModel: props.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalModel : undefined,
            advancedModel: props.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.mandateVersion.authoredBy.orgMemberships ? 
      Array.isArray(props.mandateVersion.authoredBy.orgMemberships) && props.mandateVersion.authoredBy.orgMemberships.length > 0 && props.mandateVersion.authoredBy.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
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
      fundAssignments: props.mandateVersion.authoredBy.fundAssignments ? 
      Array.isArray(props.mandateVersion.authoredBy.fundAssignments) && props.mandateVersion.authoredBy.fundAssignments.length > 0 && props.mandateVersion.authoredBy.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
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
      managedFunds: props.mandateVersion.authoredBy.managedFunds ? 
      Array.isArray(props.mandateVersion.authoredBy.managedFunds) && props.mandateVersion.authoredBy.managedFunds.length > 0 && props.mandateVersion.authoredBy.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.managedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.managedFunds.map((item) => ({
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
      operatedFunds: props.mandateVersion.authoredBy.operatedFunds ? 
      Array.isArray(props.mandateVersion.authoredBy.operatedFunds) && props.mandateVersion.authoredBy.operatedFunds.length > 0 && props.mandateVersion.authoredBy.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
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
      ownedMandates: props.mandateVersion.authoredBy.ownedMandates ? 
      Array.isArray(props.mandateVersion.authoredBy.ownedMandates) && props.mandateVersion.authoredBy.ownedMandates.length > 0 && props.mandateVersion.authoredBy.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
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
      mandateApprovalsDecided: props.mandateVersion.authoredBy.mandateApprovalsDecided ? 
      Array.isArray(props.mandateVersion.authoredBy.mandateApprovalsDecided) && props.mandateVersion.authoredBy.mandateApprovalsDecided.length > 0 && props.mandateVersion.authoredBy.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
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
      investorProfiles: props.mandateVersion.authoredBy.investorProfiles ? 
      Array.isArray(props.mandateVersion.authoredBy.investorProfiles) && props.mandateVersion.authoredBy.investorProfiles.length > 0 && props.mandateVersion.authoredBy.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
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
      notificationDeliveries: props.mandateVersion.authoredBy.notificationDeliveries ? 
      Array.isArray(props.mandateVersion.authoredBy.notificationDeliveries) && props.mandateVersion.authoredBy.notificationDeliveries.length > 0 && props.mandateVersion.authoredBy.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
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
      notificationPreferences: props.mandateVersion.authoredBy.notificationPreferences ? 
      Array.isArray(props.mandateVersion.authoredBy.notificationPreferences) && props.mandateVersion.authoredBy.notificationPreferences.length > 0 && props.mandateVersion.authoredBy.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
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
      ownedStrategies: props.mandateVersion.authoredBy.ownedStrategies ? 
      Array.isArray(props.mandateVersion.authoredBy.ownedStrategies) && props.mandateVersion.authoredBy.ownedStrategies.length > 0 && props.mandateVersion.authoredBy.ownedStrategies.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            key: item.key !== undefined ? item.key : undefined,
            ownerUserId: item.ownerUserId !== undefined ? {
                equals: item.ownerUserId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            key: item.key !== undefined ? {
                set: item.key
              } : undefined,
            displayName: item.displayName !== undefined ? {
                set: item.displayName
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            origin: item.origin !== undefined ? {
                set: item.origin
              } : undefined,
            lifecycleState: item.lifecycleState !== undefined ? {
                set: item.lifecycleState
              } : undefined,
            manifestHash: item.manifestHash !== undefined ? {
                set: item.manifestHash
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            key: item.key !== undefined ? item.key : undefined,
            displayName: item.displayName !== undefined ? item.displayName : undefined,
            description: item.description !== undefined ? item.description : undefined,
            origin: item.origin !== undefined ? item.origin : undefined,
            lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
            manifestHash: item.manifestHash !== undefined ? item.manifestHash : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          name: props.mandateVersion.authoredBy.name !== undefined ? props.mandateVersion.authoredBy.name : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? props.mandateVersion.authoredBy.email : undefined,
          emailVerified: props.mandateVersion.authoredBy.emailVerified !== undefined ? props.mandateVersion.authoredBy.emailVerified : undefined,
          image: props.mandateVersion.authoredBy.image !== undefined ? props.mandateVersion.authoredBy.image : undefined,
          avatarUrl: props.mandateVersion.authoredBy.avatarUrl !== undefined ? props.mandateVersion.authoredBy.avatarUrl : undefined,
          onboardingComplete: props.mandateVersion.authoredBy.onboardingComplete !== undefined ? props.mandateVersion.authoredBy.onboardingComplete : undefined,
          signupCategory: props.mandateVersion.authoredBy.signupCategory !== undefined ? props.mandateVersion.authoredBy.signupCategory : undefined,
          deletedAt: props.mandateVersion.authoredBy.deletedAt !== undefined ? props.mandateVersion.authoredBy.deletedAt : undefined,
          role: props.mandateVersion.authoredBy.role !== undefined ? props.mandateVersion.authoredBy.role : undefined,
          bio: props.mandateVersion.authoredBy.bio !== undefined ? props.mandateVersion.authoredBy.bio : undefined,
          jobTitle: props.mandateVersion.authoredBy.jobTitle !== undefined ? props.mandateVersion.authoredBy.jobTitle : undefined,
          currentAccount: props.mandateVersion.authoredBy.currentAccount !== undefined ? props.mandateVersion.authoredBy.currentAccount : undefined,
          plan: props.mandateVersion.authoredBy.plan !== undefined ? props.mandateVersion.authoredBy.plan : undefined,
          openaiAPIKey: props.mandateVersion.authoredBy.openaiAPIKey !== undefined ? props.mandateVersion.authoredBy.openaiAPIKey : undefined,
          openaiModel: props.mandateVersion.authoredBy.openaiModel !== undefined ? props.mandateVersion.authoredBy.openaiModel : undefined,
      customer: props.mandateVersion.authoredBy.customer ? 
        typeof props.mandateVersion.authoredBy.customer === 'object' && Object.keys(props.mandateVersion.authoredBy.customer).length === 1 && Object.keys(props.mandateVersion.authoredBy.customer)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.customer.id !== undefined ? props.mandateVersion.authoredBy.customer.id : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.authUserId 
               } : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.name 
               } : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? props.mandateVersion.authoredBy.customer.authUserId : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? props.mandateVersion.authoredBy.customer.name : undefined,
            plan: props.mandateVersion.authoredBy.customer.plan !== undefined ? props.mandateVersion.authoredBy.customer.plan : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? props.mandateVersion.authoredBy.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? props.mandateVersion.authoredBy.customer.jurisdiction : undefined,
            riskProfile: props.mandateVersion.authoredBy.customer.riskProfile !== undefined ? props.mandateVersion.authoredBy.customer.riskProfile : undefined,
            amlStatus: props.mandateVersion.authoredBy.customer.amlStatus !== undefined ? props.mandateVersion.authoredBy.customer.amlStatus : undefined,
            lastKycUpdate: props.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? props.mandateVersion.authoredBy.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.mandateVersion.authoredBy.accounts ? 
        Array.isArray(props.mandateVersion.authoredBy.accounts) && props.mandateVersion.authoredBy.accounts.length > 0 &&  props.mandateVersion.authoredBy.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accounts.map((item) => ({
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
      sessions: props.mandateVersion.authoredBy.sessions ? 
        Array.isArray(props.mandateVersion.authoredBy.sessions) && props.mandateVersion.authoredBy.sessions.length > 0 &&  props.mandateVersion.authoredBy.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.sessions.map((item) => ({
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
      authenticators: props.mandateVersion.authoredBy.authenticators ? 
        Array.isArray(props.mandateVersion.authoredBy.authenticators) && props.mandateVersion.authoredBy.authenticators.length > 0 &&  props.mandateVersion.authoredBy.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.authenticators.map((item) => ({
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
      alpacaAccounts: props.mandateVersion.authoredBy.alpacaAccounts ? 
        Array.isArray(props.mandateVersion.authoredBy.alpacaAccounts) && props.mandateVersion.authoredBy.alpacaAccounts.length > 0 &&  props.mandateVersion.authoredBy.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
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
      linkedProviders: props.mandateVersion.authoredBy.linkedProviders ? 
        Array.isArray(props.mandateVersion.authoredBy.linkedProviders) && props.mandateVersion.authoredBy.linkedProviders.length > 0 &&  props.mandateVersion.authoredBy.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
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
      accountLinkingRequests: props.mandateVersion.authoredBy.accountLinkingRequests ? 
        Array.isArray(props.mandateVersion.authoredBy.accountLinkingRequests) && props.mandateVersion.authoredBy.accountLinkingRequests.length > 0 &&  props.mandateVersion.authoredBy.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
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
      reviewedWaitlistEntries: props.mandateVersion.authoredBy.reviewedWaitlistEntries ? 
        Array.isArray(props.mandateVersion.authoredBy.reviewedWaitlistEntries) && props.mandateVersion.authoredBy.reviewedWaitlistEntries.length > 0 &&  props.mandateVersion.authoredBy.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
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
      llmConfiguration: props.mandateVersion.authoredBy.llmConfiguration ? 
        typeof props.mandateVersion.authoredBy.llmConfiguration === 'object' && Object.keys(props.mandateVersion.authoredBy.llmConfiguration).length === 1 && Object.keys(props.mandateVersion.authoredBy.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.id : undefined,
            userId: props.mandateVersion.authoredBy.llmConfiguration.userId !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniProvider : undefined,
            normalProvider: props.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedProvider : undefined,
            miniModel: props.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniModel : undefined,
            normalModel: props.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalModel : undefined,
            advancedModel: props.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.mandateVersion.authoredBy.orgMemberships ? 
        Array.isArray(props.mandateVersion.authoredBy.orgMemberships) && props.mandateVersion.authoredBy.orgMemberships.length > 0 &&  props.mandateVersion.authoredBy.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
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
      fundAssignments: props.mandateVersion.authoredBy.fundAssignments ? 
        Array.isArray(props.mandateVersion.authoredBy.fundAssignments) && props.mandateVersion.authoredBy.fundAssignments.length > 0 &&  props.mandateVersion.authoredBy.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
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
      managedFunds: props.mandateVersion.authoredBy.managedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.managedFunds) && props.mandateVersion.authoredBy.managedFunds.length > 0 &&  props.mandateVersion.authoredBy.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.managedFunds.map((item) => ({
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
      operatedFunds: props.mandateVersion.authoredBy.operatedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.operatedFunds) && props.mandateVersion.authoredBy.operatedFunds.length > 0 &&  props.mandateVersion.authoredBy.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
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
      ownedMandates: props.mandateVersion.authoredBy.ownedMandates ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedMandates) && props.mandateVersion.authoredBy.ownedMandates.length > 0 &&  props.mandateVersion.authoredBy.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
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
      mandateApprovalsDecided: props.mandateVersion.authoredBy.mandateApprovalsDecided ? 
        Array.isArray(props.mandateVersion.authoredBy.mandateApprovalsDecided) && props.mandateVersion.authoredBy.mandateApprovalsDecided.length > 0 &&  props.mandateVersion.authoredBy.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
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
      investorProfiles: props.mandateVersion.authoredBy.investorProfiles ? 
        Array.isArray(props.mandateVersion.authoredBy.investorProfiles) && props.mandateVersion.authoredBy.investorProfiles.length > 0 &&  props.mandateVersion.authoredBy.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
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
      notificationDeliveries: props.mandateVersion.authoredBy.notificationDeliveries ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationDeliveries) && props.mandateVersion.authoredBy.notificationDeliveries.length > 0 &&  props.mandateVersion.authoredBy.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
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
      notificationPreferences: props.mandateVersion.authoredBy.notificationPreferences ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationPreferences) && props.mandateVersion.authoredBy.notificationPreferences.length > 0 &&  props.mandateVersion.authoredBy.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
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
      ownedStrategies: props.mandateVersion.authoredBy.ownedStrategies ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedStrategies) && props.mandateVersion.authoredBy.ownedStrategies.length > 0 &&  props.mandateVersion.authoredBy.ownedStrategies.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            key: item.key !== undefined ? item.key : undefined,
          },
          create: {
            key: item.key !== undefined ? item.key : undefined,
            displayName: item.displayName !== undefined ? item.displayName : undefined,
            description: item.description !== undefined ? item.description : undefined,
            origin: item.origin !== undefined ? item.origin : undefined,
            lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
            manifestHash: item.manifestHash !== undefined ? item.manifestHash : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    approvals: props.mandateVersion.approvals ? 
    Array.isArray(props.mandateVersion.approvals) && props.mandateVersion.approvals.length > 0 && props.mandateVersion.approvals.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.mandateVersion.approvals.map((item) => ({
      id: item.id
    }))
} : { upsert: props.mandateVersion.approvals.map((item) => ({
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
      decidedBy: item.decidedBy ? 
      typeof item.decidedBy === 'object' && Object.keys(item.decidedBy).length === 1 && (Object.keys(item.decidedBy)[0] === 'id' || Object.keys(item.decidedBy)[0] === 'symbol')
? {
      connect: {
        id: item.decidedBy.id
      }
} : { upsert: {
          where: {
            id: item.decidedBy.id !== undefined ? {
                equals: item.decidedBy.id
              } : undefined,
            name: item.decidedBy.name !== undefined ? {
                equals: item.decidedBy.name
              } : undefined,
            email: item.decidedBy.email !== undefined ? {
                equals: item.decidedBy.email
              } : undefined,
            customerId: item.decidedBy.customerId !== undefined ? {
                equals: item.decidedBy.customerId
              } : undefined,
          },
          update: {
            id: item.decidedBy.id !== undefined ? {
                set: item.decidedBy.id
              } : undefined,
            name: item.decidedBy.name !== undefined ? {
                set: item.decidedBy.name
              } : undefined,
            email: item.decidedBy.email !== undefined ? {
                set: item.decidedBy.email
              } : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? {
                set: item.decidedBy.emailVerified
              } : undefined,
            image: item.decidedBy.image !== undefined ? {
                set: item.decidedBy.image
              } : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? {
                set: item.decidedBy.avatarUrl
              } : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? {
                set: item.decidedBy.onboardingComplete
              } : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? {
                set: item.decidedBy.signupCategory
              } : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? {
                set: item.decidedBy.deletedAt
              } : undefined,
            role: item.decidedBy.role !== undefined ? {
                set: item.decidedBy.role
              } : undefined,
            bio: item.decidedBy.bio !== undefined ? {
                set: item.decidedBy.bio
              } : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? {
                set: item.decidedBy.jobTitle
              } : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? {
                set: item.decidedBy.currentAccount
              } : undefined,
            plan: item.decidedBy.plan !== undefined ? {
                set: item.decidedBy.plan
              } : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? {
                set: item.decidedBy.openaiAPIKey
              } : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? {
                set: item.decidedBy.openaiModel
              } : undefined,
          },
          create: {
            name: item.decidedBy.name !== undefined ? item.decidedBy.name : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? item.decidedBy.emailVerified : undefined,
            image: item.decidedBy.image !== undefined ? item.decidedBy.image : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? item.decidedBy.avatarUrl : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? item.decidedBy.onboardingComplete : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? item.decidedBy.signupCategory : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? item.decidedBy.deletedAt : undefined,
            role: item.decidedBy.role !== undefined ? item.decidedBy.role : undefined,
            bio: item.decidedBy.bio !== undefined ? item.decidedBy.bio : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? item.decidedBy.jobTitle : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? item.decidedBy.currentAccount : undefined,
            plan: item.decidedBy.plan !== undefined ? item.decidedBy.plan : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? item.decidedBy.openaiAPIKey : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? item.decidedBy.openaiModel : undefined,
          },
        }
      } : undefined,
        },
        create: {
          action: item.action !== undefined ? item.action : undefined,
          decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
          rationale: item.rationale !== undefined ? item.rationale : undefined,
          correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
      decidedBy: item.decidedBy ? 
        typeof item.decidedBy === 'object' && Object.keys(item.decidedBy).length === 1 && Object.keys(item.decidedBy)[0] === 'id'
    ? { connect: {
            id: item.decidedBy.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.decidedBy.id !== undefined ? item.decidedBy.id : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            name: item.decidedBy.name !== undefined ? {
                equals: item.decidedBy.name 
               } : undefined,
          },
          create: {
            name: item.decidedBy.name !== undefined ? item.decidedBy.name : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? item.decidedBy.emailVerified : undefined,
            image: item.decidedBy.image !== undefined ? item.decidedBy.image : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? item.decidedBy.avatarUrl : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? item.decidedBy.onboardingComplete : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? item.decidedBy.signupCategory : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? item.decidedBy.deletedAt : undefined,
            role: item.decidedBy.role !== undefined ? item.decidedBy.role : undefined,
            bio: item.decidedBy.bio !== undefined ? item.decidedBy.bio : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? item.decidedBy.jobTitle : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? item.decidedBy.currentAccount : undefined,
            plan: item.decidedBy.plan !== undefined ? item.decidedBy.plan : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? item.decidedBy.openaiAPIKey : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? item.decidedBy.openaiModel : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    activeFor: props.mandateVersion.activeFor ? 
    typeof props.mandateVersion.activeFor === 'object' && Object.keys(props.mandateVersion.activeFor).length === 1 && (Object.keys(props.mandateVersion.activeFor)[0] === 'id' || Object.keys(props.mandateVersion.activeFor)[0] === 'symbol')
? {
    connect: {
      id: props.mandateVersion.activeFor.id
    }
} : { upsert: {
        where: {
          id: props.mandateVersion.activeFor.id !== undefined ? {
              equals: props.mandateVersion.activeFor.id
            } : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? {
              equals: props.mandateVersion.activeFor.name
            } : undefined,
          organizationId: props.mandateVersion.activeFor.organizationId !== undefined ? {
              equals: props.mandateVersion.activeFor.organizationId
            } : undefined,
          fundId: props.mandateVersion.activeFor.fundId !== undefined ? {
              equals: props.mandateVersion.activeFor.fundId
            } : undefined,
          ownerId: props.mandateVersion.activeFor.ownerId !== undefined ? {
              equals: props.mandateVersion.activeFor.ownerId
            } : undefined,
          activeVersionId: props.mandateVersion.activeFor.activeVersionId !== undefined ? {
              equals: props.mandateVersion.activeFor.activeVersionId
            } : undefined,
        },
        update: {
          id: props.mandateVersion.activeFor.id !== undefined ? {
              set: props.mandateVersion.activeFor.id
            } : undefined,
          scopeKind: props.mandateVersion.activeFor.scopeKind !== undefined ? {
              set: props.mandateVersion.activeFor.scopeKind
            } : undefined,
          klass: props.mandateVersion.activeFor.klass !== undefined ? {
              set: props.mandateVersion.activeFor.klass
            } : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? {
              set: props.mandateVersion.activeFor.name
            } : undefined,
          personaScope: props.mandateVersion.activeFor.personaScope !== undefined ? {
              set: props.mandateVersion.activeFor.personaScope
            } : undefined,
          deletedAt: props.mandateVersion.activeFor.deletedAt !== undefined ? {
              set: props.mandateVersion.activeFor.deletedAt
            } : undefined,
      organization: props.mandateVersion.activeFor.organization ? 
      typeof props.mandateVersion.activeFor.organization === 'object' && Object.keys(props.mandateVersion.activeFor.organization).length === 1 && (Object.keys(props.mandateVersion.activeFor.organization)[0] === 'id' || Object.keys(props.mandateVersion.activeFor.organization)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.activeFor.organization.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.activeFor.organization.id !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.id
              } : undefined,
            name: props.mandateVersion.activeFor.organization.name !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.name
              } : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.slug
              } : undefined,
          },
          update: {
            id: props.mandateVersion.activeFor.organization.id !== undefined ? {
                set: props.mandateVersion.activeFor.organization.id
              } : undefined,
            name: props.mandateVersion.activeFor.organization.name !== undefined ? {
                set: props.mandateVersion.activeFor.organization.name
              } : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? {
                set: props.mandateVersion.activeFor.organization.slug
              } : undefined,
            logoUrl: props.mandateVersion.activeFor.organization.logoUrl !== undefined ? {
                set: props.mandateVersion.activeFor.organization.logoUrl
              } : undefined,
            website: props.mandateVersion.activeFor.organization.website !== undefined ? {
                set: props.mandateVersion.activeFor.organization.website
              } : undefined,
            businessType: props.mandateVersion.activeFor.organization.businessType !== undefined ? {
                set: props.mandateVersion.activeFor.organization.businessType
              } : undefined,
            emailDomains: props.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.activeFor.organization.emailDomains
              } : undefined,
            jurisdiction: props.mandateVersion.activeFor.organization.jurisdiction !== undefined ? {
                set: props.mandateVersion.activeFor.organization.jurisdiction
              } : undefined,
            regulatoryStatus: props.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? {
                set: props.mandateVersion.activeFor.organization.regulatoryStatus
              } : undefined,
            description: props.mandateVersion.activeFor.organization.description !== undefined ? {
                set: props.mandateVersion.activeFor.organization.description
              } : undefined,
            tradingDefaults: props.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? props.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.activeFor.organization.deletedAt !== undefined ? {
                set: props.mandateVersion.activeFor.organization.deletedAt
              } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.organization.name !== undefined ? props.mandateVersion.activeFor.organization.name : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            logoUrl: props.mandateVersion.activeFor.organization.logoUrl !== undefined ? props.mandateVersion.activeFor.organization.logoUrl : undefined,
            website: props.mandateVersion.activeFor.organization.website !== undefined ? props.mandateVersion.activeFor.organization.website : undefined,
            businessType: props.mandateVersion.activeFor.organization.businessType !== undefined ? props.mandateVersion.activeFor.organization.businessType : undefined,
            emailDomains: props.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.activeFor.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.activeFor.organization.jurisdiction !== undefined ? props.mandateVersion.activeFor.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? props.mandateVersion.activeFor.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.activeFor.organization.description !== undefined ? props.mandateVersion.activeFor.organization.description : undefined,
            tradingDefaults: props.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? props.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.activeFor.organization.deletedAt !== undefined ? props.mandateVersion.activeFor.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.activeFor.fund ? 
      typeof props.mandateVersion.activeFor.fund === 'object' && Object.keys(props.mandateVersion.activeFor.fund).length === 1 && (Object.keys(props.mandateVersion.activeFor.fund)[0] === 'id' || Object.keys(props.mandateVersion.activeFor.fund)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.activeFor.fund.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.activeFor.fund.id !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.id
              } : undefined,
            name: props.mandateVersion.activeFor.fund.name !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.name
              } : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.slug
              } : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.status
              } : undefined,
            organizationId: props.mandateVersion.activeFor.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.organizationId
              } : undefined,
            managerId: props.mandateVersion.activeFor.fund.managerId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.managerId
              } : undefined,
            operatorId: props.mandateVersion.activeFor.fund.operatorId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.operatorId
              } : undefined,
          },
          update: {
            id: props.mandateVersion.activeFor.fund.id !== undefined ? {
                set: props.mandateVersion.activeFor.fund.id
              } : undefined,
            name: props.mandateVersion.activeFor.fund.name !== undefined ? {
                set: props.mandateVersion.activeFor.fund.name
              } : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? {
                set: props.mandateVersion.activeFor.fund.slug
              } : undefined,
            description: props.mandateVersion.activeFor.fund.description !== undefined ? {
                set: props.mandateVersion.activeFor.fund.description
              } : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? {
                set: props.mandateVersion.activeFor.fund.status
              } : undefined,
            currency: props.mandateVersion.activeFor.fund.currency !== undefined ? {
                set: props.mandateVersion.activeFor.fund.currency
              } : undefined,
            inceptionDate: props.mandateVersion.activeFor.fund.inceptionDate !== undefined ? {
                set: props.mandateVersion.activeFor.fund.inceptionDate
              } : undefined,
            aum: props.mandateVersion.activeFor.fund.aum !== undefined ? {
                set: props.mandateVersion.activeFor.fund.aum
              } : undefined,
            navPerShare: props.mandateVersion.activeFor.fund.navPerShare !== undefined ? {
                set: props.mandateVersion.activeFor.fund.navPerShare
              } : undefined,
            sharesOutstanding: props.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? {
                set: props.mandateVersion.activeFor.fund.sharesOutstanding
              } : undefined,
            highWaterMarkNav: props.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? {
                set: props.mandateVersion.activeFor.fund.highWaterMarkNav
              } : undefined,
            fees: props.mandateVersion.activeFor.fund.fees !== undefined ? props.mandateVersion.activeFor.fund.fees : undefined,
            terms: props.mandateVersion.activeFor.fund.terms !== undefined ? props.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: props.mandateVersion.activeFor.fund.regulatory !== undefined ? props.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.activeFor.fund.serviceProviders !== undefined ? props.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? props.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.activeFor.fund.deletedAt !== undefined ? {
                set: props.mandateVersion.activeFor.fund.deletedAt
              } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.fund.name !== undefined ? props.mandateVersion.activeFor.fund.name : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? props.mandateVersion.activeFor.fund.slug : undefined,
            description: props.mandateVersion.activeFor.fund.description !== undefined ? props.mandateVersion.activeFor.fund.description : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? props.mandateVersion.activeFor.fund.status : undefined,
            currency: props.mandateVersion.activeFor.fund.currency !== undefined ? props.mandateVersion.activeFor.fund.currency : undefined,
            inceptionDate: props.mandateVersion.activeFor.fund.inceptionDate !== undefined ? props.mandateVersion.activeFor.fund.inceptionDate : undefined,
            aum: props.mandateVersion.activeFor.fund.aum !== undefined ? props.mandateVersion.activeFor.fund.aum : undefined,
            navPerShare: props.mandateVersion.activeFor.fund.navPerShare !== undefined ? props.mandateVersion.activeFor.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? props.mandateVersion.activeFor.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? props.mandateVersion.activeFor.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.activeFor.fund.fees !== undefined ? props.mandateVersion.activeFor.fund.fees : undefined,
            terms: props.mandateVersion.activeFor.fund.terms !== undefined ? props.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: props.mandateVersion.activeFor.fund.regulatory !== undefined ? props.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.activeFor.fund.serviceProviders !== undefined ? props.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? props.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.activeFor.fund.deletedAt !== undefined ? props.mandateVersion.activeFor.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.activeFor.owner ? 
      typeof props.mandateVersion.activeFor.owner === 'object' && Object.keys(props.mandateVersion.activeFor.owner).length === 1 && (Object.keys(props.mandateVersion.activeFor.owner)[0] === 'id' || Object.keys(props.mandateVersion.activeFor.owner)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.activeFor.owner.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.activeFor.owner.id !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.id
              } : undefined,
            name: props.mandateVersion.activeFor.owner.name !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.name
              } : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.email
              } : undefined,
            customerId: props.mandateVersion.activeFor.owner.customerId !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.customerId
              } : undefined,
          },
          update: {
            id: props.mandateVersion.activeFor.owner.id !== undefined ? {
                set: props.mandateVersion.activeFor.owner.id
              } : undefined,
            name: props.mandateVersion.activeFor.owner.name !== undefined ? {
                set: props.mandateVersion.activeFor.owner.name
              } : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? {
                set: props.mandateVersion.activeFor.owner.email
              } : undefined,
            emailVerified: props.mandateVersion.activeFor.owner.emailVerified !== undefined ? {
                set: props.mandateVersion.activeFor.owner.emailVerified
              } : undefined,
            image: props.mandateVersion.activeFor.owner.image !== undefined ? {
                set: props.mandateVersion.activeFor.owner.image
              } : undefined,
            avatarUrl: props.mandateVersion.activeFor.owner.avatarUrl !== undefined ? {
                set: props.mandateVersion.activeFor.owner.avatarUrl
              } : undefined,
            onboardingComplete: props.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? {
                set: props.mandateVersion.activeFor.owner.onboardingComplete
              } : undefined,
            signupCategory: props.mandateVersion.activeFor.owner.signupCategory !== undefined ? {
                set: props.mandateVersion.activeFor.owner.signupCategory
              } : undefined,
            deletedAt: props.mandateVersion.activeFor.owner.deletedAt !== undefined ? {
                set: props.mandateVersion.activeFor.owner.deletedAt
              } : undefined,
            role: props.mandateVersion.activeFor.owner.role !== undefined ? {
                set: props.mandateVersion.activeFor.owner.role
              } : undefined,
            bio: props.mandateVersion.activeFor.owner.bio !== undefined ? {
                set: props.mandateVersion.activeFor.owner.bio
              } : undefined,
            jobTitle: props.mandateVersion.activeFor.owner.jobTitle !== undefined ? {
                set: props.mandateVersion.activeFor.owner.jobTitle
              } : undefined,
            currentAccount: props.mandateVersion.activeFor.owner.currentAccount !== undefined ? {
                set: props.mandateVersion.activeFor.owner.currentAccount
              } : undefined,
            plan: props.mandateVersion.activeFor.owner.plan !== undefined ? {
                set: props.mandateVersion.activeFor.owner.plan
              } : undefined,
            openaiAPIKey: props.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? {
                set: props.mandateVersion.activeFor.owner.openaiAPIKey
              } : undefined,
            openaiModel: props.mandateVersion.activeFor.owner.openaiModel !== undefined ? {
                set: props.mandateVersion.activeFor.owner.openaiModel
              } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.owner.name !== undefined ? props.mandateVersion.activeFor.owner.name : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            emailVerified: props.mandateVersion.activeFor.owner.emailVerified !== undefined ? props.mandateVersion.activeFor.owner.emailVerified : undefined,
            image: props.mandateVersion.activeFor.owner.image !== undefined ? props.mandateVersion.activeFor.owner.image : undefined,
            avatarUrl: props.mandateVersion.activeFor.owner.avatarUrl !== undefined ? props.mandateVersion.activeFor.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? props.mandateVersion.activeFor.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.activeFor.owner.signupCategory !== undefined ? props.mandateVersion.activeFor.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.activeFor.owner.deletedAt !== undefined ? props.mandateVersion.activeFor.owner.deletedAt : undefined,
            role: props.mandateVersion.activeFor.owner.role !== undefined ? props.mandateVersion.activeFor.owner.role : undefined,
            bio: props.mandateVersion.activeFor.owner.bio !== undefined ? props.mandateVersion.activeFor.owner.bio : undefined,
            jobTitle: props.mandateVersion.activeFor.owner.jobTitle !== undefined ? props.mandateVersion.activeFor.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.activeFor.owner.currentAccount !== undefined ? props.mandateVersion.activeFor.owner.currentAccount : undefined,
            plan: props.mandateVersion.activeFor.owner.plan !== undefined ? props.mandateVersion.activeFor.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? props.mandateVersion.activeFor.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.activeFor.owner.openaiModel !== undefined ? props.mandateVersion.activeFor.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      versions: props.mandateVersion.activeFor.versions ? 
      Array.isArray(props.mandateVersion.activeFor.versions) && props.mandateVersion.activeFor.versions.length > 0 && props.mandateVersion.activeFor.versions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.activeFor.versions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.activeFor.versions.map((item) => ({
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
        },
        create: {
          scopeKind: props.mandateVersion.activeFor.scopeKind !== undefined ? props.mandateVersion.activeFor.scopeKind : undefined,
          klass: props.mandateVersion.activeFor.klass !== undefined ? props.mandateVersion.activeFor.klass : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? props.mandateVersion.activeFor.name : undefined,
          personaScope: props.mandateVersion.activeFor.personaScope !== undefined ? props.mandateVersion.activeFor.personaScope : undefined,
          deletedAt: props.mandateVersion.activeFor.deletedAt !== undefined ? props.mandateVersion.activeFor.deletedAt : undefined,
      organization: props.mandateVersion.activeFor.organization ? 
        typeof props.mandateVersion.activeFor.organization === 'object' && Object.keys(props.mandateVersion.activeFor.organization).length === 1 && Object.keys(props.mandateVersion.activeFor.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.organization.id !== undefined ? props.mandateVersion.activeFor.organization.id : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            name: props.mandateVersion.activeFor.organization.name !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.organization.name !== undefined ? props.mandateVersion.activeFor.organization.name : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            logoUrl: props.mandateVersion.activeFor.organization.logoUrl !== undefined ? props.mandateVersion.activeFor.organization.logoUrl : undefined,
            website: props.mandateVersion.activeFor.organization.website !== undefined ? props.mandateVersion.activeFor.organization.website : undefined,
            businessType: props.mandateVersion.activeFor.organization.businessType !== undefined ? props.mandateVersion.activeFor.organization.businessType : undefined,
            emailDomains: props.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.activeFor.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.activeFor.organization.jurisdiction !== undefined ? props.mandateVersion.activeFor.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? props.mandateVersion.activeFor.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.activeFor.organization.description !== undefined ? props.mandateVersion.activeFor.organization.description : undefined,
            tradingDefaults: props.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? props.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.activeFor.organization.deletedAt !== undefined ? props.mandateVersion.activeFor.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.activeFor.fund ? 
        typeof props.mandateVersion.activeFor.fund === 'object' && Object.keys(props.mandateVersion.activeFor.fund).length === 1 && Object.keys(props.mandateVersion.activeFor.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.fund.id !== undefined ? props.mandateVersion.activeFor.fund.id : undefined,
            name: props.mandateVersion.activeFor.fund.name !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.name 
               } : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.slug 
               } : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.activeFor.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.fund.name !== undefined ? props.mandateVersion.activeFor.fund.name : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? props.mandateVersion.activeFor.fund.slug : undefined,
            description: props.mandateVersion.activeFor.fund.description !== undefined ? props.mandateVersion.activeFor.fund.description : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? props.mandateVersion.activeFor.fund.status : undefined,
            currency: props.mandateVersion.activeFor.fund.currency !== undefined ? props.mandateVersion.activeFor.fund.currency : undefined,
            inceptionDate: props.mandateVersion.activeFor.fund.inceptionDate !== undefined ? props.mandateVersion.activeFor.fund.inceptionDate : undefined,
            aum: props.mandateVersion.activeFor.fund.aum !== undefined ? props.mandateVersion.activeFor.fund.aum : undefined,
            navPerShare: props.mandateVersion.activeFor.fund.navPerShare !== undefined ? props.mandateVersion.activeFor.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? props.mandateVersion.activeFor.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? props.mandateVersion.activeFor.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.activeFor.fund.fees !== undefined ? props.mandateVersion.activeFor.fund.fees : undefined,
            terms: props.mandateVersion.activeFor.fund.terms !== undefined ? props.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: props.mandateVersion.activeFor.fund.regulatory !== undefined ? props.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.activeFor.fund.serviceProviders !== undefined ? props.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? props.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.activeFor.fund.deletedAt !== undefined ? props.mandateVersion.activeFor.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.activeFor.owner ? 
        typeof props.mandateVersion.activeFor.owner === 'object' && Object.keys(props.mandateVersion.activeFor.owner).length === 1 && Object.keys(props.mandateVersion.activeFor.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.owner.id !== undefined ? props.mandateVersion.activeFor.owner.id : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            name: props.mandateVersion.activeFor.owner.name !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.owner.name !== undefined ? props.mandateVersion.activeFor.owner.name : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            emailVerified: props.mandateVersion.activeFor.owner.emailVerified !== undefined ? props.mandateVersion.activeFor.owner.emailVerified : undefined,
            image: props.mandateVersion.activeFor.owner.image !== undefined ? props.mandateVersion.activeFor.owner.image : undefined,
            avatarUrl: props.mandateVersion.activeFor.owner.avatarUrl !== undefined ? props.mandateVersion.activeFor.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? props.mandateVersion.activeFor.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.activeFor.owner.signupCategory !== undefined ? props.mandateVersion.activeFor.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.activeFor.owner.deletedAt !== undefined ? props.mandateVersion.activeFor.owner.deletedAt : undefined,
            role: props.mandateVersion.activeFor.owner.role !== undefined ? props.mandateVersion.activeFor.owner.role : undefined,
            bio: props.mandateVersion.activeFor.owner.bio !== undefined ? props.mandateVersion.activeFor.owner.bio : undefined,
            jobTitle: props.mandateVersion.activeFor.owner.jobTitle !== undefined ? props.mandateVersion.activeFor.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.activeFor.owner.currentAccount !== undefined ? props.mandateVersion.activeFor.owner.currentAccount : undefined,
            plan: props.mandateVersion.activeFor.owner.plan !== undefined ? props.mandateVersion.activeFor.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? props.mandateVersion.activeFor.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.activeFor.owner.openaiModel !== undefined ? props.mandateVersion.activeFor.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      versions: props.mandateVersion.activeFor.versions ? 
        Array.isArray(props.mandateVersion.activeFor.versions) && props.mandateVersion.activeFor.versions.length > 0 &&  props.mandateVersion.activeFor.versions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.activeFor.versions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.activeFor.versions.map((item) => ({
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
        },
      }
    } : undefined,
      },
      create: {
        versionLabel: props.mandateVersion.versionLabel !== undefined ? props.mandateVersion.versionLabel : undefined,
        versionSeq: props.mandateVersion.versionSeq !== undefined ? props.mandateVersion.versionSeq : undefined,
        status: props.mandateVersion.status !== undefined ? props.mandateVersion.status : undefined,
        summary: props.mandateVersion.summary !== undefined ? props.mandateVersion.summary : undefined,
        charterBody: props.mandateVersion.charterBody !== undefined ? props.mandateVersion.charterBody : undefined,
    mandate: props.mandateVersion.mandate ? 
      typeof props.mandateVersion.mandate === 'object' && Object.keys(props.mandateVersion.mandate).length === 1 && Object.keys(props.mandateVersion.mandate)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.mandate.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.mandate.id !== undefined ? props.mandateVersion.mandate.id : undefined,
          activeVersionId: props.mandateVersion.mandate.activeVersionId !== undefined ? props.mandateVersion.mandate.activeVersionId : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? {
              equals: props.mandateVersion.mandate.name 
             } : undefined,
          organizationId: props.mandateVersion.mandate.organizationId !== undefined ? {
              equals: props.mandateVersion.mandate.organizationId 
             } : undefined,
        },
        create: {
          scopeKind: props.mandateVersion.mandate.scopeKind !== undefined ? props.mandateVersion.mandate.scopeKind : undefined,
          klass: props.mandateVersion.mandate.klass !== undefined ? props.mandateVersion.mandate.klass : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? props.mandateVersion.mandate.name : undefined,
          personaScope: props.mandateVersion.mandate.personaScope !== undefined ? props.mandateVersion.mandate.personaScope : undefined,
          deletedAt: props.mandateVersion.mandate.deletedAt !== undefined ? props.mandateVersion.mandate.deletedAt : undefined,
      organization: props.mandateVersion.mandate.organization ? 
        typeof props.mandateVersion.mandate.organization === 'object' && Object.keys(props.mandateVersion.mandate.organization).length === 1 && Object.keys(props.mandateVersion.mandate.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.organization.id !== undefined ? props.mandateVersion.mandate.organization.id : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            name: props.mandateVersion.mandate.organization.name !== undefined ? {
                equals: props.mandateVersion.mandate.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.organization.name !== undefined ? props.mandateVersion.mandate.organization.name : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            logoUrl: props.mandateVersion.mandate.organization.logoUrl !== undefined ? props.mandateVersion.mandate.organization.logoUrl : undefined,
            website: props.mandateVersion.mandate.organization.website !== undefined ? props.mandateVersion.mandate.organization.website : undefined,
            businessType: props.mandateVersion.mandate.organization.businessType !== undefined ? props.mandateVersion.mandate.organization.businessType : undefined,
            emailDomains: props.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.mandate.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.mandate.organization.jurisdiction !== undefined ? props.mandateVersion.mandate.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? props.mandateVersion.mandate.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.mandate.organization.description !== undefined ? props.mandateVersion.mandate.organization.description : undefined,
            tradingDefaults: props.mandateVersion.mandate.organization.tradingDefaults !== undefined ? props.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.mandate.organization.deletedAt !== undefined ? props.mandateVersion.mandate.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.mandate.fund ? 
        typeof props.mandateVersion.mandate.fund === 'object' && Object.keys(props.mandateVersion.mandate.fund).length === 1 && Object.keys(props.mandateVersion.mandate.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.fund.id !== undefined ? props.mandateVersion.mandate.fund.id : undefined,
            name: props.mandateVersion.mandate.fund.name !== undefined ? {
                equals: props.mandateVersion.mandate.fund.name 
               } : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? {
                equals: props.mandateVersion.mandate.fund.slug 
               } : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? {
                equals: props.mandateVersion.mandate.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.mandate.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.fund.name !== undefined ? props.mandateVersion.mandate.fund.name : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? props.mandateVersion.mandate.fund.slug : undefined,
            description: props.mandateVersion.mandate.fund.description !== undefined ? props.mandateVersion.mandate.fund.description : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? props.mandateVersion.mandate.fund.status : undefined,
            currency: props.mandateVersion.mandate.fund.currency !== undefined ? props.mandateVersion.mandate.fund.currency : undefined,
            inceptionDate: props.mandateVersion.mandate.fund.inceptionDate !== undefined ? props.mandateVersion.mandate.fund.inceptionDate : undefined,
            aum: props.mandateVersion.mandate.fund.aum !== undefined ? props.mandateVersion.mandate.fund.aum : undefined,
            navPerShare: props.mandateVersion.mandate.fund.navPerShare !== undefined ? props.mandateVersion.mandate.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? props.mandateVersion.mandate.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? props.mandateVersion.mandate.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.mandate.fund.fees !== undefined ? props.mandateVersion.mandate.fund.fees : undefined,
            terms: props.mandateVersion.mandate.fund.terms !== undefined ? props.mandateVersion.mandate.fund.terms : undefined,
            regulatory: props.mandateVersion.mandate.fund.regulatory !== undefined ? props.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.mandate.fund.serviceProviders !== undefined ? props.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.mandate.fund.tradingOverrides !== undefined ? props.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.mandate.fund.deletedAt !== undefined ? props.mandateVersion.mandate.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.mandate.owner ? 
        typeof props.mandateVersion.mandate.owner === 'object' && Object.keys(props.mandateVersion.mandate.owner).length === 1 && Object.keys(props.mandateVersion.mandate.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.owner.id !== undefined ? props.mandateVersion.mandate.owner.id : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            name: props.mandateVersion.mandate.owner.name !== undefined ? {
                equals: props.mandateVersion.mandate.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.owner.name !== undefined ? props.mandateVersion.mandate.owner.name : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            emailVerified: props.mandateVersion.mandate.owner.emailVerified !== undefined ? props.mandateVersion.mandate.owner.emailVerified : undefined,
            image: props.mandateVersion.mandate.owner.image !== undefined ? props.mandateVersion.mandate.owner.image : undefined,
            avatarUrl: props.mandateVersion.mandate.owner.avatarUrl !== undefined ? props.mandateVersion.mandate.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.mandate.owner.onboardingComplete !== undefined ? props.mandateVersion.mandate.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.mandate.owner.signupCategory !== undefined ? props.mandateVersion.mandate.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.mandate.owner.deletedAt !== undefined ? props.mandateVersion.mandate.owner.deletedAt : undefined,
            role: props.mandateVersion.mandate.owner.role !== undefined ? props.mandateVersion.mandate.owner.role : undefined,
            bio: props.mandateVersion.mandate.owner.bio !== undefined ? props.mandateVersion.mandate.owner.bio : undefined,
            jobTitle: props.mandateVersion.mandate.owner.jobTitle !== undefined ? props.mandateVersion.mandate.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.mandate.owner.currentAccount !== undefined ? props.mandateVersion.mandate.owner.currentAccount : undefined,
            plan: props.mandateVersion.mandate.owner.plan !== undefined ? props.mandateVersion.mandate.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? props.mandateVersion.mandate.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.mandate.owner.openaiModel !== undefined ? props.mandateVersion.mandate.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      activeVersion: props.mandateVersion.mandate.activeVersion ? 
        typeof props.mandateVersion.mandate.activeVersion === 'object' && Object.keys(props.mandateVersion.mandate.activeVersion).length === 1 && Object.keys(props.mandateVersion.mandate.activeVersion)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.activeVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.activeVersion.id !== undefined ? props.mandateVersion.mandate.activeVersion.id : undefined,
            mandateId: props.mandateVersion.mandate.activeVersion.mandateId !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.mandateId 
               } : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.status 
               } : undefined,
          },
          create: {
            versionLabel: props.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? props.mandateVersion.mandate.activeVersion.versionLabel : undefined,
            versionSeq: props.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? props.mandateVersion.mandate.activeVersion.versionSeq : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? props.mandateVersion.mandate.activeVersion.status : undefined,
            summary: props.mandateVersion.mandate.activeVersion.summary !== undefined ? props.mandateVersion.mandate.activeVersion.summary : undefined,
            charterBody: props.mandateVersion.mandate.activeVersion.charterBody !== undefined ? props.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
        }
      } : undefined,
        },
      }
    } : undefined,
    authoredBy: props.mandateVersion.authoredBy ? 
      typeof props.mandateVersion.authoredBy === 'object' && Object.keys(props.mandateVersion.authoredBy).length === 1 && Object.keys(props.mandateVersion.authoredBy)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.authoredBy.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.authoredBy.id !== undefined ? props.mandateVersion.authoredBy.id : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? props.mandateVersion.authoredBy.email : undefined,
          name: props.mandateVersion.authoredBy.name !== undefined ? {
              equals: props.mandateVersion.authoredBy.name 
             } : undefined,
        },
        create: {
          name: props.mandateVersion.authoredBy.name !== undefined ? props.mandateVersion.authoredBy.name : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? props.mandateVersion.authoredBy.email : undefined,
          emailVerified: props.mandateVersion.authoredBy.emailVerified !== undefined ? props.mandateVersion.authoredBy.emailVerified : undefined,
          image: props.mandateVersion.authoredBy.image !== undefined ? props.mandateVersion.authoredBy.image : undefined,
          avatarUrl: props.mandateVersion.authoredBy.avatarUrl !== undefined ? props.mandateVersion.authoredBy.avatarUrl : undefined,
          onboardingComplete: props.mandateVersion.authoredBy.onboardingComplete !== undefined ? props.mandateVersion.authoredBy.onboardingComplete : undefined,
          signupCategory: props.mandateVersion.authoredBy.signupCategory !== undefined ? props.mandateVersion.authoredBy.signupCategory : undefined,
          deletedAt: props.mandateVersion.authoredBy.deletedAt !== undefined ? props.mandateVersion.authoredBy.deletedAt : undefined,
          role: props.mandateVersion.authoredBy.role !== undefined ? props.mandateVersion.authoredBy.role : undefined,
          bio: props.mandateVersion.authoredBy.bio !== undefined ? props.mandateVersion.authoredBy.bio : undefined,
          jobTitle: props.mandateVersion.authoredBy.jobTitle !== undefined ? props.mandateVersion.authoredBy.jobTitle : undefined,
          currentAccount: props.mandateVersion.authoredBy.currentAccount !== undefined ? props.mandateVersion.authoredBy.currentAccount : undefined,
          plan: props.mandateVersion.authoredBy.plan !== undefined ? props.mandateVersion.authoredBy.plan : undefined,
          openaiAPIKey: props.mandateVersion.authoredBy.openaiAPIKey !== undefined ? props.mandateVersion.authoredBy.openaiAPIKey : undefined,
          openaiModel: props.mandateVersion.authoredBy.openaiModel !== undefined ? props.mandateVersion.authoredBy.openaiModel : undefined,
      customer: props.mandateVersion.authoredBy.customer ? 
        typeof props.mandateVersion.authoredBy.customer === 'object' && Object.keys(props.mandateVersion.authoredBy.customer).length === 1 && Object.keys(props.mandateVersion.authoredBy.customer)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.customer.id !== undefined ? props.mandateVersion.authoredBy.customer.id : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.authUserId 
               } : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.name 
               } : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? props.mandateVersion.authoredBy.customer.authUserId : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? props.mandateVersion.authoredBy.customer.name : undefined,
            plan: props.mandateVersion.authoredBy.customer.plan !== undefined ? props.mandateVersion.authoredBy.customer.plan : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? props.mandateVersion.authoredBy.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? props.mandateVersion.authoredBy.customer.jurisdiction : undefined,
            riskProfile: props.mandateVersion.authoredBy.customer.riskProfile !== undefined ? props.mandateVersion.authoredBy.customer.riskProfile : undefined,
            amlStatus: props.mandateVersion.authoredBy.customer.amlStatus !== undefined ? props.mandateVersion.authoredBy.customer.amlStatus : undefined,
            lastKycUpdate: props.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? props.mandateVersion.authoredBy.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.mandateVersion.authoredBy.accounts ? 
        Array.isArray(props.mandateVersion.authoredBy.accounts) && props.mandateVersion.authoredBy.accounts.length > 0 &&  props.mandateVersion.authoredBy.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accounts.map((item) => ({
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
      sessions: props.mandateVersion.authoredBy.sessions ? 
        Array.isArray(props.mandateVersion.authoredBy.sessions) && props.mandateVersion.authoredBy.sessions.length > 0 &&  props.mandateVersion.authoredBy.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.sessions.map((item) => ({
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
      authenticators: props.mandateVersion.authoredBy.authenticators ? 
        Array.isArray(props.mandateVersion.authoredBy.authenticators) && props.mandateVersion.authoredBy.authenticators.length > 0 &&  props.mandateVersion.authoredBy.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.authenticators.map((item) => ({
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
      alpacaAccounts: props.mandateVersion.authoredBy.alpacaAccounts ? 
        Array.isArray(props.mandateVersion.authoredBy.alpacaAccounts) && props.mandateVersion.authoredBy.alpacaAccounts.length > 0 &&  props.mandateVersion.authoredBy.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
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
      linkedProviders: props.mandateVersion.authoredBy.linkedProviders ? 
        Array.isArray(props.mandateVersion.authoredBy.linkedProviders) && props.mandateVersion.authoredBy.linkedProviders.length > 0 &&  props.mandateVersion.authoredBy.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
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
      accountLinkingRequests: props.mandateVersion.authoredBy.accountLinkingRequests ? 
        Array.isArray(props.mandateVersion.authoredBy.accountLinkingRequests) && props.mandateVersion.authoredBy.accountLinkingRequests.length > 0 &&  props.mandateVersion.authoredBy.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
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
      reviewedWaitlistEntries: props.mandateVersion.authoredBy.reviewedWaitlistEntries ? 
        Array.isArray(props.mandateVersion.authoredBy.reviewedWaitlistEntries) && props.mandateVersion.authoredBy.reviewedWaitlistEntries.length > 0 &&  props.mandateVersion.authoredBy.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
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
      llmConfiguration: props.mandateVersion.authoredBy.llmConfiguration ? 
        typeof props.mandateVersion.authoredBy.llmConfiguration === 'object' && Object.keys(props.mandateVersion.authoredBy.llmConfiguration).length === 1 && Object.keys(props.mandateVersion.authoredBy.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.id : undefined,
            userId: props.mandateVersion.authoredBy.llmConfiguration.userId !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniProvider : undefined,
            normalProvider: props.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedProvider : undefined,
            miniModel: props.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniModel : undefined,
            normalModel: props.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalModel : undefined,
            advancedModel: props.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.mandateVersion.authoredBy.orgMemberships ? 
        Array.isArray(props.mandateVersion.authoredBy.orgMemberships) && props.mandateVersion.authoredBy.orgMemberships.length > 0 &&  props.mandateVersion.authoredBy.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
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
      fundAssignments: props.mandateVersion.authoredBy.fundAssignments ? 
        Array.isArray(props.mandateVersion.authoredBy.fundAssignments) && props.mandateVersion.authoredBy.fundAssignments.length > 0 &&  props.mandateVersion.authoredBy.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
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
      managedFunds: props.mandateVersion.authoredBy.managedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.managedFunds) && props.mandateVersion.authoredBy.managedFunds.length > 0 &&  props.mandateVersion.authoredBy.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.managedFunds.map((item) => ({
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
      operatedFunds: props.mandateVersion.authoredBy.operatedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.operatedFunds) && props.mandateVersion.authoredBy.operatedFunds.length > 0 &&  props.mandateVersion.authoredBy.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
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
      ownedMandates: props.mandateVersion.authoredBy.ownedMandates ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedMandates) && props.mandateVersion.authoredBy.ownedMandates.length > 0 &&  props.mandateVersion.authoredBy.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
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
      mandateApprovalsDecided: props.mandateVersion.authoredBy.mandateApprovalsDecided ? 
        Array.isArray(props.mandateVersion.authoredBy.mandateApprovalsDecided) && props.mandateVersion.authoredBy.mandateApprovalsDecided.length > 0 &&  props.mandateVersion.authoredBy.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
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
      investorProfiles: props.mandateVersion.authoredBy.investorProfiles ? 
        Array.isArray(props.mandateVersion.authoredBy.investorProfiles) && props.mandateVersion.authoredBy.investorProfiles.length > 0 &&  props.mandateVersion.authoredBy.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
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
      notificationDeliveries: props.mandateVersion.authoredBy.notificationDeliveries ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationDeliveries) && props.mandateVersion.authoredBy.notificationDeliveries.length > 0 &&  props.mandateVersion.authoredBy.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
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
      notificationPreferences: props.mandateVersion.authoredBy.notificationPreferences ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationPreferences) && props.mandateVersion.authoredBy.notificationPreferences.length > 0 &&  props.mandateVersion.authoredBy.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
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
      ownedStrategies: props.mandateVersion.authoredBy.ownedStrategies ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedStrategies) && props.mandateVersion.authoredBy.ownedStrategies.length > 0 &&  props.mandateVersion.authoredBy.ownedStrategies.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            key: item.key !== undefined ? item.key : undefined,
          },
          create: {
            key: item.key !== undefined ? item.key : undefined,
            displayName: item.displayName !== undefined ? item.displayName : undefined,
            description: item.description !== undefined ? item.description : undefined,
            origin: item.origin !== undefined ? item.origin : undefined,
            lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
            manifestHash: item.manifestHash !== undefined ? item.manifestHash : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    approvals: props.mandateVersion.approvals ? 
      Array.isArray(props.mandateVersion.approvals) && props.mandateVersion.approvals.length > 0 &&  props.mandateVersion.approvals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.mandateVersion.approvals.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.mandateVersion.approvals.map((item) => ({
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
      decidedBy: item.decidedBy ? 
        typeof item.decidedBy === 'object' && Object.keys(item.decidedBy).length === 1 && Object.keys(item.decidedBy)[0] === 'id'
    ? { connect: {
            id: item.decidedBy.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.decidedBy.id !== undefined ? item.decidedBy.id : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            name: item.decidedBy.name !== undefined ? {
                equals: item.decidedBy.name 
               } : undefined,
          },
          create: {
            name: item.decidedBy.name !== undefined ? item.decidedBy.name : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? item.decidedBy.emailVerified : undefined,
            image: item.decidedBy.image !== undefined ? item.decidedBy.image : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? item.decidedBy.avatarUrl : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? item.decidedBy.onboardingComplete : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? item.decidedBy.signupCategory : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? item.decidedBy.deletedAt : undefined,
            role: item.decidedBy.role !== undefined ? item.decidedBy.role : undefined,
            bio: item.decidedBy.bio !== undefined ? item.decidedBy.bio : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? item.decidedBy.jobTitle : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? item.decidedBy.currentAccount : undefined,
            plan: item.decidedBy.plan !== undefined ? item.decidedBy.plan : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? item.decidedBy.openaiAPIKey : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? item.decidedBy.openaiModel : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    activeFor: props.mandateVersion.activeFor ? 
      typeof props.mandateVersion.activeFor === 'object' && Object.keys(props.mandateVersion.activeFor).length === 1 && Object.keys(props.mandateVersion.activeFor)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.activeFor.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.activeFor.id !== undefined ? props.mandateVersion.activeFor.id : undefined,
          activeVersionId: props.mandateVersion.activeFor.activeVersionId !== undefined ? props.mandateVersion.activeFor.activeVersionId : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? {
              equals: props.mandateVersion.activeFor.name 
             } : undefined,
          organizationId: props.mandateVersion.activeFor.organizationId !== undefined ? {
              equals: props.mandateVersion.activeFor.organizationId 
             } : undefined,
        },
        create: {
          scopeKind: props.mandateVersion.activeFor.scopeKind !== undefined ? props.mandateVersion.activeFor.scopeKind : undefined,
          klass: props.mandateVersion.activeFor.klass !== undefined ? props.mandateVersion.activeFor.klass : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? props.mandateVersion.activeFor.name : undefined,
          personaScope: props.mandateVersion.activeFor.personaScope !== undefined ? props.mandateVersion.activeFor.personaScope : undefined,
          deletedAt: props.mandateVersion.activeFor.deletedAt !== undefined ? props.mandateVersion.activeFor.deletedAt : undefined,
      organization: props.mandateVersion.activeFor.organization ? 
        typeof props.mandateVersion.activeFor.organization === 'object' && Object.keys(props.mandateVersion.activeFor.organization).length === 1 && Object.keys(props.mandateVersion.activeFor.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.organization.id !== undefined ? props.mandateVersion.activeFor.organization.id : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            name: props.mandateVersion.activeFor.organization.name !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.organization.name !== undefined ? props.mandateVersion.activeFor.organization.name : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            logoUrl: props.mandateVersion.activeFor.organization.logoUrl !== undefined ? props.mandateVersion.activeFor.organization.logoUrl : undefined,
            website: props.mandateVersion.activeFor.organization.website !== undefined ? props.mandateVersion.activeFor.organization.website : undefined,
            businessType: props.mandateVersion.activeFor.organization.businessType !== undefined ? props.mandateVersion.activeFor.organization.businessType : undefined,
            emailDomains: props.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.activeFor.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.activeFor.organization.jurisdiction !== undefined ? props.mandateVersion.activeFor.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? props.mandateVersion.activeFor.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.activeFor.organization.description !== undefined ? props.mandateVersion.activeFor.organization.description : undefined,
            tradingDefaults: props.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? props.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.activeFor.organization.deletedAt !== undefined ? props.mandateVersion.activeFor.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.activeFor.fund ? 
        typeof props.mandateVersion.activeFor.fund === 'object' && Object.keys(props.mandateVersion.activeFor.fund).length === 1 && Object.keys(props.mandateVersion.activeFor.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.fund.id !== undefined ? props.mandateVersion.activeFor.fund.id : undefined,
            name: props.mandateVersion.activeFor.fund.name !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.name 
               } : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.slug 
               } : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.activeFor.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.fund.name !== undefined ? props.mandateVersion.activeFor.fund.name : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? props.mandateVersion.activeFor.fund.slug : undefined,
            description: props.mandateVersion.activeFor.fund.description !== undefined ? props.mandateVersion.activeFor.fund.description : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? props.mandateVersion.activeFor.fund.status : undefined,
            currency: props.mandateVersion.activeFor.fund.currency !== undefined ? props.mandateVersion.activeFor.fund.currency : undefined,
            inceptionDate: props.mandateVersion.activeFor.fund.inceptionDate !== undefined ? props.mandateVersion.activeFor.fund.inceptionDate : undefined,
            aum: props.mandateVersion.activeFor.fund.aum !== undefined ? props.mandateVersion.activeFor.fund.aum : undefined,
            navPerShare: props.mandateVersion.activeFor.fund.navPerShare !== undefined ? props.mandateVersion.activeFor.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? props.mandateVersion.activeFor.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? props.mandateVersion.activeFor.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.activeFor.fund.fees !== undefined ? props.mandateVersion.activeFor.fund.fees : undefined,
            terms: props.mandateVersion.activeFor.fund.terms !== undefined ? props.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: props.mandateVersion.activeFor.fund.regulatory !== undefined ? props.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.activeFor.fund.serviceProviders !== undefined ? props.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? props.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.activeFor.fund.deletedAt !== undefined ? props.mandateVersion.activeFor.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.activeFor.owner ? 
        typeof props.mandateVersion.activeFor.owner === 'object' && Object.keys(props.mandateVersion.activeFor.owner).length === 1 && Object.keys(props.mandateVersion.activeFor.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.owner.id !== undefined ? props.mandateVersion.activeFor.owner.id : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            name: props.mandateVersion.activeFor.owner.name !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.owner.name !== undefined ? props.mandateVersion.activeFor.owner.name : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            emailVerified: props.mandateVersion.activeFor.owner.emailVerified !== undefined ? props.mandateVersion.activeFor.owner.emailVerified : undefined,
            image: props.mandateVersion.activeFor.owner.image !== undefined ? props.mandateVersion.activeFor.owner.image : undefined,
            avatarUrl: props.mandateVersion.activeFor.owner.avatarUrl !== undefined ? props.mandateVersion.activeFor.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? props.mandateVersion.activeFor.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.activeFor.owner.signupCategory !== undefined ? props.mandateVersion.activeFor.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.activeFor.owner.deletedAt !== undefined ? props.mandateVersion.activeFor.owner.deletedAt : undefined,
            role: props.mandateVersion.activeFor.owner.role !== undefined ? props.mandateVersion.activeFor.owner.role : undefined,
            bio: props.mandateVersion.activeFor.owner.bio !== undefined ? props.mandateVersion.activeFor.owner.bio : undefined,
            jobTitle: props.mandateVersion.activeFor.owner.jobTitle !== undefined ? props.mandateVersion.activeFor.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.activeFor.owner.currentAccount !== undefined ? props.mandateVersion.activeFor.owner.currentAccount : undefined,
            plan: props.mandateVersion.activeFor.owner.plan !== undefined ? props.mandateVersion.activeFor.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? props.mandateVersion.activeFor.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.activeFor.owner.openaiModel !== undefined ? props.mandateVersion.activeFor.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      versions: props.mandateVersion.activeFor.versions ? 
        Array.isArray(props.mandateVersion.activeFor.versions) && props.mandateVersion.activeFor.versions.length > 0 &&  props.mandateVersion.activeFor.versions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.activeFor.versions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.activeFor.versions.map((item) => ({
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
        },
      }
    } : undefined,
      },
    }
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_MANDATERULE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneMandateRule) {
          return response.data.updateOneMandateRule;
        } else {
          return null as unknown as MandateRuleType;
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
          logger.error("Non-retryable constraint violation in updateOneMandateRule", {
            operation: 'updateOneMandateRule',
            model: 'MandateRule',
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
          logger.warn("Database connection error in updateOneMandateRule, retrying...", {
            operation: 'updateOneMandateRule',
            model: 'MandateRule',
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
            operation: 'updateOneMandateRule',
            model: 'MandateRule',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneMandateRule',
            model: 'MandateRule',
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
   * Upsert a single MandateRule record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated MandateRule or null.
   */
  async upsert(props: MandateRuleType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<MandateRuleType> {
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

        const UPSERT_ONE_MANDATERULE = gql`
          mutation upsertOneMandateRule($where: MandateRuleWhereUniqueInput!, $create: MandateRuleCreateInput!, $update: MandateRuleUpdateInput!) {
            upsertOneMandateRule(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  mandateVersionId: props.mandateVersionId !== undefined ? {
    equals: props.mandateVersionId 
  } : undefined,
  sectionId: props.sectionId !== undefined ? {
    equals: props.sectionId 
  } : undefined,
  orderIdx: props.orderIdx !== undefined ? {
    equals: props.orderIdx 
  } : undefined,
      },
          create: {
        sectionId: props.sectionId !== undefined ? props.sectionId : undefined,
  label: props.label !== undefined ? props.label : undefined,
  detail: props.detail !== undefined ? props.detail : undefined,
  control: props.control !== undefined ? props.control : undefined,
  threshold: props.threshold !== undefined ? props.threshold : undefined,
  unit: props.unit !== undefined ? props.unit : undefined,
  limitKind: props.limitKind !== undefined ? props.limitKind : undefined,
  orderIdx: props.orderIdx !== undefined ? props.orderIdx : undefined,
  mandateVersion: props.mandateVersion ? 
    typeof props.mandateVersion === 'object' && Object.keys(props.mandateVersion).length === 1 && Object.keys(props.mandateVersion)[0] === 'id'
    ? { connect: {
        id: props.mandateVersion.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.mandateVersion.id !== undefined ? props.mandateVersion.id : undefined,
        mandateId: props.mandateVersion.mandateId !== undefined ? {
            equals: props.mandateVersion.mandateId 
           } : undefined,
        status: props.mandateVersion.status !== undefined ? {
            equals: props.mandateVersion.status 
           } : undefined,
      },
      create: {
        versionLabel: props.mandateVersion.versionLabel !== undefined ? props.mandateVersion.versionLabel : undefined,
        versionSeq: props.mandateVersion.versionSeq !== undefined ? props.mandateVersion.versionSeq : undefined,
        status: props.mandateVersion.status !== undefined ? props.mandateVersion.status : undefined,
        summary: props.mandateVersion.summary !== undefined ? props.mandateVersion.summary : undefined,
        charterBody: props.mandateVersion.charterBody !== undefined ? props.mandateVersion.charterBody : undefined,
    mandate: props.mandateVersion.mandate ? 
      typeof props.mandateVersion.mandate === 'object' && Object.keys(props.mandateVersion.mandate).length === 1 && Object.keys(props.mandateVersion.mandate)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.mandate.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.mandate.id !== undefined ? props.mandateVersion.mandate.id : undefined,
          activeVersionId: props.mandateVersion.mandate.activeVersionId !== undefined ? props.mandateVersion.mandate.activeVersionId : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? {
              equals: props.mandateVersion.mandate.name 
             } : undefined,
          organizationId: props.mandateVersion.mandate.organizationId !== undefined ? {
              equals: props.mandateVersion.mandate.organizationId 
             } : undefined,
        },
        create: {
          scopeKind: props.mandateVersion.mandate.scopeKind !== undefined ? props.mandateVersion.mandate.scopeKind : undefined,
          klass: props.mandateVersion.mandate.klass !== undefined ? props.mandateVersion.mandate.klass : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? props.mandateVersion.mandate.name : undefined,
          personaScope: props.mandateVersion.mandate.personaScope !== undefined ? props.mandateVersion.mandate.personaScope : undefined,
          deletedAt: props.mandateVersion.mandate.deletedAt !== undefined ? props.mandateVersion.mandate.deletedAt : undefined,
      organization: props.mandateVersion.mandate.organization ? 
        typeof props.mandateVersion.mandate.organization === 'object' && Object.keys(props.mandateVersion.mandate.organization).length === 1 && Object.keys(props.mandateVersion.mandate.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.organization.id !== undefined ? props.mandateVersion.mandate.organization.id : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            name: props.mandateVersion.mandate.organization.name !== undefined ? {
                equals: props.mandateVersion.mandate.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.organization.name !== undefined ? props.mandateVersion.mandate.organization.name : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            logoUrl: props.mandateVersion.mandate.organization.logoUrl !== undefined ? props.mandateVersion.mandate.organization.logoUrl : undefined,
            website: props.mandateVersion.mandate.organization.website !== undefined ? props.mandateVersion.mandate.organization.website : undefined,
            businessType: props.mandateVersion.mandate.organization.businessType !== undefined ? props.mandateVersion.mandate.organization.businessType : undefined,
            emailDomains: props.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.mandate.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.mandate.organization.jurisdiction !== undefined ? props.mandateVersion.mandate.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? props.mandateVersion.mandate.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.mandate.organization.description !== undefined ? props.mandateVersion.mandate.organization.description : undefined,
            tradingDefaults: props.mandateVersion.mandate.organization.tradingDefaults !== undefined ? props.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.mandate.organization.deletedAt !== undefined ? props.mandateVersion.mandate.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.mandate.fund ? 
        typeof props.mandateVersion.mandate.fund === 'object' && Object.keys(props.mandateVersion.mandate.fund).length === 1 && Object.keys(props.mandateVersion.mandate.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.fund.id !== undefined ? props.mandateVersion.mandate.fund.id : undefined,
            name: props.mandateVersion.mandate.fund.name !== undefined ? {
                equals: props.mandateVersion.mandate.fund.name 
               } : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? {
                equals: props.mandateVersion.mandate.fund.slug 
               } : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? {
                equals: props.mandateVersion.mandate.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.mandate.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.fund.name !== undefined ? props.mandateVersion.mandate.fund.name : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? props.mandateVersion.mandate.fund.slug : undefined,
            description: props.mandateVersion.mandate.fund.description !== undefined ? props.mandateVersion.mandate.fund.description : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? props.mandateVersion.mandate.fund.status : undefined,
            currency: props.mandateVersion.mandate.fund.currency !== undefined ? props.mandateVersion.mandate.fund.currency : undefined,
            inceptionDate: props.mandateVersion.mandate.fund.inceptionDate !== undefined ? props.mandateVersion.mandate.fund.inceptionDate : undefined,
            aum: props.mandateVersion.mandate.fund.aum !== undefined ? props.mandateVersion.mandate.fund.aum : undefined,
            navPerShare: props.mandateVersion.mandate.fund.navPerShare !== undefined ? props.mandateVersion.mandate.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? props.mandateVersion.mandate.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? props.mandateVersion.mandate.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.mandate.fund.fees !== undefined ? props.mandateVersion.mandate.fund.fees : undefined,
            terms: props.mandateVersion.mandate.fund.terms !== undefined ? props.mandateVersion.mandate.fund.terms : undefined,
            regulatory: props.mandateVersion.mandate.fund.regulatory !== undefined ? props.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.mandate.fund.serviceProviders !== undefined ? props.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.mandate.fund.tradingOverrides !== undefined ? props.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.mandate.fund.deletedAt !== undefined ? props.mandateVersion.mandate.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.mandate.owner ? 
        typeof props.mandateVersion.mandate.owner === 'object' && Object.keys(props.mandateVersion.mandate.owner).length === 1 && Object.keys(props.mandateVersion.mandate.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.owner.id !== undefined ? props.mandateVersion.mandate.owner.id : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            name: props.mandateVersion.mandate.owner.name !== undefined ? {
                equals: props.mandateVersion.mandate.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.owner.name !== undefined ? props.mandateVersion.mandate.owner.name : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            emailVerified: props.mandateVersion.mandate.owner.emailVerified !== undefined ? props.mandateVersion.mandate.owner.emailVerified : undefined,
            image: props.mandateVersion.mandate.owner.image !== undefined ? props.mandateVersion.mandate.owner.image : undefined,
            avatarUrl: props.mandateVersion.mandate.owner.avatarUrl !== undefined ? props.mandateVersion.mandate.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.mandate.owner.onboardingComplete !== undefined ? props.mandateVersion.mandate.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.mandate.owner.signupCategory !== undefined ? props.mandateVersion.mandate.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.mandate.owner.deletedAt !== undefined ? props.mandateVersion.mandate.owner.deletedAt : undefined,
            role: props.mandateVersion.mandate.owner.role !== undefined ? props.mandateVersion.mandate.owner.role : undefined,
            bio: props.mandateVersion.mandate.owner.bio !== undefined ? props.mandateVersion.mandate.owner.bio : undefined,
            jobTitle: props.mandateVersion.mandate.owner.jobTitle !== undefined ? props.mandateVersion.mandate.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.mandate.owner.currentAccount !== undefined ? props.mandateVersion.mandate.owner.currentAccount : undefined,
            plan: props.mandateVersion.mandate.owner.plan !== undefined ? props.mandateVersion.mandate.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? props.mandateVersion.mandate.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.mandate.owner.openaiModel !== undefined ? props.mandateVersion.mandate.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      activeVersion: props.mandateVersion.mandate.activeVersion ? 
        typeof props.mandateVersion.mandate.activeVersion === 'object' && Object.keys(props.mandateVersion.mandate.activeVersion).length === 1 && Object.keys(props.mandateVersion.mandate.activeVersion)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.activeVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.activeVersion.id !== undefined ? props.mandateVersion.mandate.activeVersion.id : undefined,
            mandateId: props.mandateVersion.mandate.activeVersion.mandateId !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.mandateId 
               } : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.status 
               } : undefined,
          },
          create: {
            versionLabel: props.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? props.mandateVersion.mandate.activeVersion.versionLabel : undefined,
            versionSeq: props.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? props.mandateVersion.mandate.activeVersion.versionSeq : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? props.mandateVersion.mandate.activeVersion.status : undefined,
            summary: props.mandateVersion.mandate.activeVersion.summary !== undefined ? props.mandateVersion.mandate.activeVersion.summary : undefined,
            charterBody: props.mandateVersion.mandate.activeVersion.charterBody !== undefined ? props.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
        }
      } : undefined,
        },
      }
    } : undefined,
    authoredBy: props.mandateVersion.authoredBy ? 
      typeof props.mandateVersion.authoredBy === 'object' && Object.keys(props.mandateVersion.authoredBy).length === 1 && Object.keys(props.mandateVersion.authoredBy)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.authoredBy.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.authoredBy.id !== undefined ? props.mandateVersion.authoredBy.id : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? props.mandateVersion.authoredBy.email : undefined,
          name: props.mandateVersion.authoredBy.name !== undefined ? {
              equals: props.mandateVersion.authoredBy.name 
             } : undefined,
        },
        create: {
          name: props.mandateVersion.authoredBy.name !== undefined ? props.mandateVersion.authoredBy.name : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? props.mandateVersion.authoredBy.email : undefined,
          emailVerified: props.mandateVersion.authoredBy.emailVerified !== undefined ? props.mandateVersion.authoredBy.emailVerified : undefined,
          image: props.mandateVersion.authoredBy.image !== undefined ? props.mandateVersion.authoredBy.image : undefined,
          avatarUrl: props.mandateVersion.authoredBy.avatarUrl !== undefined ? props.mandateVersion.authoredBy.avatarUrl : undefined,
          onboardingComplete: props.mandateVersion.authoredBy.onboardingComplete !== undefined ? props.mandateVersion.authoredBy.onboardingComplete : undefined,
          signupCategory: props.mandateVersion.authoredBy.signupCategory !== undefined ? props.mandateVersion.authoredBy.signupCategory : undefined,
          deletedAt: props.mandateVersion.authoredBy.deletedAt !== undefined ? props.mandateVersion.authoredBy.deletedAt : undefined,
          role: props.mandateVersion.authoredBy.role !== undefined ? props.mandateVersion.authoredBy.role : undefined,
          bio: props.mandateVersion.authoredBy.bio !== undefined ? props.mandateVersion.authoredBy.bio : undefined,
          jobTitle: props.mandateVersion.authoredBy.jobTitle !== undefined ? props.mandateVersion.authoredBy.jobTitle : undefined,
          currentAccount: props.mandateVersion.authoredBy.currentAccount !== undefined ? props.mandateVersion.authoredBy.currentAccount : undefined,
          plan: props.mandateVersion.authoredBy.plan !== undefined ? props.mandateVersion.authoredBy.plan : undefined,
          openaiAPIKey: props.mandateVersion.authoredBy.openaiAPIKey !== undefined ? props.mandateVersion.authoredBy.openaiAPIKey : undefined,
          openaiModel: props.mandateVersion.authoredBy.openaiModel !== undefined ? props.mandateVersion.authoredBy.openaiModel : undefined,
      customer: props.mandateVersion.authoredBy.customer ? 
        typeof props.mandateVersion.authoredBy.customer === 'object' && Object.keys(props.mandateVersion.authoredBy.customer).length === 1 && Object.keys(props.mandateVersion.authoredBy.customer)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.customer.id !== undefined ? props.mandateVersion.authoredBy.customer.id : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.authUserId 
               } : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.name 
               } : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? props.mandateVersion.authoredBy.customer.authUserId : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? props.mandateVersion.authoredBy.customer.name : undefined,
            plan: props.mandateVersion.authoredBy.customer.plan !== undefined ? props.mandateVersion.authoredBy.customer.plan : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? props.mandateVersion.authoredBy.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? props.mandateVersion.authoredBy.customer.jurisdiction : undefined,
            riskProfile: props.mandateVersion.authoredBy.customer.riskProfile !== undefined ? props.mandateVersion.authoredBy.customer.riskProfile : undefined,
            amlStatus: props.mandateVersion.authoredBy.customer.amlStatus !== undefined ? props.mandateVersion.authoredBy.customer.amlStatus : undefined,
            lastKycUpdate: props.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? props.mandateVersion.authoredBy.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.mandateVersion.authoredBy.accounts ? 
        Array.isArray(props.mandateVersion.authoredBy.accounts) && props.mandateVersion.authoredBy.accounts.length > 0 &&  props.mandateVersion.authoredBy.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accounts.map((item) => ({
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
      sessions: props.mandateVersion.authoredBy.sessions ? 
        Array.isArray(props.mandateVersion.authoredBy.sessions) && props.mandateVersion.authoredBy.sessions.length > 0 &&  props.mandateVersion.authoredBy.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.sessions.map((item) => ({
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
      authenticators: props.mandateVersion.authoredBy.authenticators ? 
        Array.isArray(props.mandateVersion.authoredBy.authenticators) && props.mandateVersion.authoredBy.authenticators.length > 0 &&  props.mandateVersion.authoredBy.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.authenticators.map((item) => ({
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
      alpacaAccounts: props.mandateVersion.authoredBy.alpacaAccounts ? 
        Array.isArray(props.mandateVersion.authoredBy.alpacaAccounts) && props.mandateVersion.authoredBy.alpacaAccounts.length > 0 &&  props.mandateVersion.authoredBy.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
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
      linkedProviders: props.mandateVersion.authoredBy.linkedProviders ? 
        Array.isArray(props.mandateVersion.authoredBy.linkedProviders) && props.mandateVersion.authoredBy.linkedProviders.length > 0 &&  props.mandateVersion.authoredBy.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
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
      accountLinkingRequests: props.mandateVersion.authoredBy.accountLinkingRequests ? 
        Array.isArray(props.mandateVersion.authoredBy.accountLinkingRequests) && props.mandateVersion.authoredBy.accountLinkingRequests.length > 0 &&  props.mandateVersion.authoredBy.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
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
      reviewedWaitlistEntries: props.mandateVersion.authoredBy.reviewedWaitlistEntries ? 
        Array.isArray(props.mandateVersion.authoredBy.reviewedWaitlistEntries) && props.mandateVersion.authoredBy.reviewedWaitlistEntries.length > 0 &&  props.mandateVersion.authoredBy.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
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
      llmConfiguration: props.mandateVersion.authoredBy.llmConfiguration ? 
        typeof props.mandateVersion.authoredBy.llmConfiguration === 'object' && Object.keys(props.mandateVersion.authoredBy.llmConfiguration).length === 1 && Object.keys(props.mandateVersion.authoredBy.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.id : undefined,
            userId: props.mandateVersion.authoredBy.llmConfiguration.userId !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniProvider : undefined,
            normalProvider: props.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedProvider : undefined,
            miniModel: props.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniModel : undefined,
            normalModel: props.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalModel : undefined,
            advancedModel: props.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.mandateVersion.authoredBy.orgMemberships ? 
        Array.isArray(props.mandateVersion.authoredBy.orgMemberships) && props.mandateVersion.authoredBy.orgMemberships.length > 0 &&  props.mandateVersion.authoredBy.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
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
      fundAssignments: props.mandateVersion.authoredBy.fundAssignments ? 
        Array.isArray(props.mandateVersion.authoredBy.fundAssignments) && props.mandateVersion.authoredBy.fundAssignments.length > 0 &&  props.mandateVersion.authoredBy.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
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
      managedFunds: props.mandateVersion.authoredBy.managedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.managedFunds) && props.mandateVersion.authoredBy.managedFunds.length > 0 &&  props.mandateVersion.authoredBy.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.managedFunds.map((item) => ({
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
      operatedFunds: props.mandateVersion.authoredBy.operatedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.operatedFunds) && props.mandateVersion.authoredBy.operatedFunds.length > 0 &&  props.mandateVersion.authoredBy.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
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
      ownedMandates: props.mandateVersion.authoredBy.ownedMandates ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedMandates) && props.mandateVersion.authoredBy.ownedMandates.length > 0 &&  props.mandateVersion.authoredBy.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
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
      mandateApprovalsDecided: props.mandateVersion.authoredBy.mandateApprovalsDecided ? 
        Array.isArray(props.mandateVersion.authoredBy.mandateApprovalsDecided) && props.mandateVersion.authoredBy.mandateApprovalsDecided.length > 0 &&  props.mandateVersion.authoredBy.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
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
      investorProfiles: props.mandateVersion.authoredBy.investorProfiles ? 
        Array.isArray(props.mandateVersion.authoredBy.investorProfiles) && props.mandateVersion.authoredBy.investorProfiles.length > 0 &&  props.mandateVersion.authoredBy.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
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
      notificationDeliveries: props.mandateVersion.authoredBy.notificationDeliveries ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationDeliveries) && props.mandateVersion.authoredBy.notificationDeliveries.length > 0 &&  props.mandateVersion.authoredBy.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
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
      notificationPreferences: props.mandateVersion.authoredBy.notificationPreferences ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationPreferences) && props.mandateVersion.authoredBy.notificationPreferences.length > 0 &&  props.mandateVersion.authoredBy.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
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
      ownedStrategies: props.mandateVersion.authoredBy.ownedStrategies ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedStrategies) && props.mandateVersion.authoredBy.ownedStrategies.length > 0 &&  props.mandateVersion.authoredBy.ownedStrategies.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            key: item.key !== undefined ? item.key : undefined,
          },
          create: {
            key: item.key !== undefined ? item.key : undefined,
            displayName: item.displayName !== undefined ? item.displayName : undefined,
            description: item.description !== undefined ? item.description : undefined,
            origin: item.origin !== undefined ? item.origin : undefined,
            lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
            manifestHash: item.manifestHash !== undefined ? item.manifestHash : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    approvals: props.mandateVersion.approvals ? 
      Array.isArray(props.mandateVersion.approvals) && props.mandateVersion.approvals.length > 0 &&  props.mandateVersion.approvals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.mandateVersion.approvals.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.mandateVersion.approvals.map((item) => ({
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
      decidedBy: item.decidedBy ? 
        typeof item.decidedBy === 'object' && Object.keys(item.decidedBy).length === 1 && Object.keys(item.decidedBy)[0] === 'id'
    ? { connect: {
            id: item.decidedBy.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.decidedBy.id !== undefined ? item.decidedBy.id : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            name: item.decidedBy.name !== undefined ? {
                equals: item.decidedBy.name 
               } : undefined,
          },
          create: {
            name: item.decidedBy.name !== undefined ? item.decidedBy.name : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? item.decidedBy.emailVerified : undefined,
            image: item.decidedBy.image !== undefined ? item.decidedBy.image : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? item.decidedBy.avatarUrl : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? item.decidedBy.onboardingComplete : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? item.decidedBy.signupCategory : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? item.decidedBy.deletedAt : undefined,
            role: item.decidedBy.role !== undefined ? item.decidedBy.role : undefined,
            bio: item.decidedBy.bio !== undefined ? item.decidedBy.bio : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? item.decidedBy.jobTitle : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? item.decidedBy.currentAccount : undefined,
            plan: item.decidedBy.plan !== undefined ? item.decidedBy.plan : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? item.decidedBy.openaiAPIKey : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? item.decidedBy.openaiModel : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    activeFor: props.mandateVersion.activeFor ? 
      typeof props.mandateVersion.activeFor === 'object' && Object.keys(props.mandateVersion.activeFor).length === 1 && Object.keys(props.mandateVersion.activeFor)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.activeFor.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.activeFor.id !== undefined ? props.mandateVersion.activeFor.id : undefined,
          activeVersionId: props.mandateVersion.activeFor.activeVersionId !== undefined ? props.mandateVersion.activeFor.activeVersionId : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? {
              equals: props.mandateVersion.activeFor.name 
             } : undefined,
          organizationId: props.mandateVersion.activeFor.organizationId !== undefined ? {
              equals: props.mandateVersion.activeFor.organizationId 
             } : undefined,
        },
        create: {
          scopeKind: props.mandateVersion.activeFor.scopeKind !== undefined ? props.mandateVersion.activeFor.scopeKind : undefined,
          klass: props.mandateVersion.activeFor.klass !== undefined ? props.mandateVersion.activeFor.klass : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? props.mandateVersion.activeFor.name : undefined,
          personaScope: props.mandateVersion.activeFor.personaScope !== undefined ? props.mandateVersion.activeFor.personaScope : undefined,
          deletedAt: props.mandateVersion.activeFor.deletedAt !== undefined ? props.mandateVersion.activeFor.deletedAt : undefined,
      organization: props.mandateVersion.activeFor.organization ? 
        typeof props.mandateVersion.activeFor.organization === 'object' && Object.keys(props.mandateVersion.activeFor.organization).length === 1 && Object.keys(props.mandateVersion.activeFor.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.organization.id !== undefined ? props.mandateVersion.activeFor.organization.id : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            name: props.mandateVersion.activeFor.organization.name !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.organization.name !== undefined ? props.mandateVersion.activeFor.organization.name : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            logoUrl: props.mandateVersion.activeFor.organization.logoUrl !== undefined ? props.mandateVersion.activeFor.organization.logoUrl : undefined,
            website: props.mandateVersion.activeFor.organization.website !== undefined ? props.mandateVersion.activeFor.organization.website : undefined,
            businessType: props.mandateVersion.activeFor.organization.businessType !== undefined ? props.mandateVersion.activeFor.organization.businessType : undefined,
            emailDomains: props.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.activeFor.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.activeFor.organization.jurisdiction !== undefined ? props.mandateVersion.activeFor.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? props.mandateVersion.activeFor.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.activeFor.organization.description !== undefined ? props.mandateVersion.activeFor.organization.description : undefined,
            tradingDefaults: props.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? props.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.activeFor.organization.deletedAt !== undefined ? props.mandateVersion.activeFor.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.activeFor.fund ? 
        typeof props.mandateVersion.activeFor.fund === 'object' && Object.keys(props.mandateVersion.activeFor.fund).length === 1 && Object.keys(props.mandateVersion.activeFor.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.fund.id !== undefined ? props.mandateVersion.activeFor.fund.id : undefined,
            name: props.mandateVersion.activeFor.fund.name !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.name 
               } : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.slug 
               } : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.activeFor.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.fund.name !== undefined ? props.mandateVersion.activeFor.fund.name : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? props.mandateVersion.activeFor.fund.slug : undefined,
            description: props.mandateVersion.activeFor.fund.description !== undefined ? props.mandateVersion.activeFor.fund.description : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? props.mandateVersion.activeFor.fund.status : undefined,
            currency: props.mandateVersion.activeFor.fund.currency !== undefined ? props.mandateVersion.activeFor.fund.currency : undefined,
            inceptionDate: props.mandateVersion.activeFor.fund.inceptionDate !== undefined ? props.mandateVersion.activeFor.fund.inceptionDate : undefined,
            aum: props.mandateVersion.activeFor.fund.aum !== undefined ? props.mandateVersion.activeFor.fund.aum : undefined,
            navPerShare: props.mandateVersion.activeFor.fund.navPerShare !== undefined ? props.mandateVersion.activeFor.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? props.mandateVersion.activeFor.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? props.mandateVersion.activeFor.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.activeFor.fund.fees !== undefined ? props.mandateVersion.activeFor.fund.fees : undefined,
            terms: props.mandateVersion.activeFor.fund.terms !== undefined ? props.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: props.mandateVersion.activeFor.fund.regulatory !== undefined ? props.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.activeFor.fund.serviceProviders !== undefined ? props.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? props.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.activeFor.fund.deletedAt !== undefined ? props.mandateVersion.activeFor.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.activeFor.owner ? 
        typeof props.mandateVersion.activeFor.owner === 'object' && Object.keys(props.mandateVersion.activeFor.owner).length === 1 && Object.keys(props.mandateVersion.activeFor.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.owner.id !== undefined ? props.mandateVersion.activeFor.owner.id : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            name: props.mandateVersion.activeFor.owner.name !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.owner.name !== undefined ? props.mandateVersion.activeFor.owner.name : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            emailVerified: props.mandateVersion.activeFor.owner.emailVerified !== undefined ? props.mandateVersion.activeFor.owner.emailVerified : undefined,
            image: props.mandateVersion.activeFor.owner.image !== undefined ? props.mandateVersion.activeFor.owner.image : undefined,
            avatarUrl: props.mandateVersion.activeFor.owner.avatarUrl !== undefined ? props.mandateVersion.activeFor.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? props.mandateVersion.activeFor.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.activeFor.owner.signupCategory !== undefined ? props.mandateVersion.activeFor.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.activeFor.owner.deletedAt !== undefined ? props.mandateVersion.activeFor.owner.deletedAt : undefined,
            role: props.mandateVersion.activeFor.owner.role !== undefined ? props.mandateVersion.activeFor.owner.role : undefined,
            bio: props.mandateVersion.activeFor.owner.bio !== undefined ? props.mandateVersion.activeFor.owner.bio : undefined,
            jobTitle: props.mandateVersion.activeFor.owner.jobTitle !== undefined ? props.mandateVersion.activeFor.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.activeFor.owner.currentAccount !== undefined ? props.mandateVersion.activeFor.owner.currentAccount : undefined,
            plan: props.mandateVersion.activeFor.owner.plan !== undefined ? props.mandateVersion.activeFor.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? props.mandateVersion.activeFor.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.activeFor.owner.openaiModel !== undefined ? props.mandateVersion.activeFor.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      versions: props.mandateVersion.activeFor.versions ? 
        Array.isArray(props.mandateVersion.activeFor.versions) && props.mandateVersion.activeFor.versions.length > 0 &&  props.mandateVersion.activeFor.versions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.activeFor.versions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.activeFor.versions.map((item) => ({
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
        },
      }
    } : undefined,
      },
    }
  } : undefined,
      },
          update: {
      sectionId: props.sectionId !== undefined ? {
            set: props.sectionId 
           } : undefined,
  label: props.label !== undefined ? {
            set: props.label 
           } : undefined,
  detail: props.detail !== undefined ? {
            set: props.detail 
           } : undefined,
  control: props.control !== undefined ? {
            set: props.control 
           } : undefined,
  threshold: props.threshold !== undefined ? {
            set: props.threshold 
           } : undefined,
  unit: props.unit !== undefined ? {
            set: props.unit 
           } : undefined,
  limitKind: props.limitKind !== undefined ? {
            set: props.limitKind 
           } : undefined,
  orderIdx: props.orderIdx !== undefined ? {
            set: props.orderIdx 
           } : undefined,
  mandateVersion: props.mandateVersion ? 
  typeof props.mandateVersion === 'object' && Object.keys(props.mandateVersion).length === 1 && (Object.keys(props.mandateVersion)[0] === 'id' || Object.keys(props.mandateVersion)[0] === 'symbol')
? {
  connect: {
    id: props.mandateVersion.id
  }
} : { upsert: {
      where: {
        id: props.mandateVersion.id !== undefined ? {
            equals: props.mandateVersion.id
          } : undefined,
        mandateId: props.mandateVersion.mandateId !== undefined ? {
            equals: props.mandateVersion.mandateId
          } : undefined,
        status: props.mandateVersion.status !== undefined ? {
            equals: props.mandateVersion.status
          } : undefined,
        authoredById: props.mandateVersion.authoredById !== undefined ? {
            equals: props.mandateVersion.authoredById
          } : undefined,
      },
      update: {
        id: props.mandateVersion.id !== undefined ? {
            set: props.mandateVersion.id
          } : undefined,
        versionLabel: props.mandateVersion.versionLabel !== undefined ? {
            set: props.mandateVersion.versionLabel
          } : undefined,
        versionSeq: props.mandateVersion.versionSeq !== undefined ? {
            set: props.mandateVersion.versionSeq
          } : undefined,
        status: props.mandateVersion.status !== undefined ? {
            set: props.mandateVersion.status
          } : undefined,
        summary: props.mandateVersion.summary !== undefined ? {
            set: props.mandateVersion.summary
          } : undefined,
        charterBody: props.mandateVersion.charterBody !== undefined ? props.mandateVersion.charterBody : undefined,
    mandate: props.mandateVersion.mandate ? 
    typeof props.mandateVersion.mandate === 'object' && Object.keys(props.mandateVersion.mandate).length === 1 && (Object.keys(props.mandateVersion.mandate)[0] === 'id' || Object.keys(props.mandateVersion.mandate)[0] === 'symbol')
? {
    connect: {
      id: props.mandateVersion.mandate.id
    }
} : { upsert: {
        where: {
          id: props.mandateVersion.mandate.id !== undefined ? {
              equals: props.mandateVersion.mandate.id
            } : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? {
              equals: props.mandateVersion.mandate.name
            } : undefined,
          organizationId: props.mandateVersion.mandate.organizationId !== undefined ? {
              equals: props.mandateVersion.mandate.organizationId
            } : undefined,
          fundId: props.mandateVersion.mandate.fundId !== undefined ? {
              equals: props.mandateVersion.mandate.fundId
            } : undefined,
          ownerId: props.mandateVersion.mandate.ownerId !== undefined ? {
              equals: props.mandateVersion.mandate.ownerId
            } : undefined,
          activeVersionId: props.mandateVersion.mandate.activeVersionId !== undefined ? {
              equals: props.mandateVersion.mandate.activeVersionId
            } : undefined,
        },
        update: {
          id: props.mandateVersion.mandate.id !== undefined ? {
              set: props.mandateVersion.mandate.id
            } : undefined,
          scopeKind: props.mandateVersion.mandate.scopeKind !== undefined ? {
              set: props.mandateVersion.mandate.scopeKind
            } : undefined,
          klass: props.mandateVersion.mandate.klass !== undefined ? {
              set: props.mandateVersion.mandate.klass
            } : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? {
              set: props.mandateVersion.mandate.name
            } : undefined,
          personaScope: props.mandateVersion.mandate.personaScope !== undefined ? {
              set: props.mandateVersion.mandate.personaScope
            } : undefined,
          deletedAt: props.mandateVersion.mandate.deletedAt !== undefined ? {
              set: props.mandateVersion.mandate.deletedAt
            } : undefined,
      organization: props.mandateVersion.mandate.organization ? 
      typeof props.mandateVersion.mandate.organization === 'object' && Object.keys(props.mandateVersion.mandate.organization).length === 1 && (Object.keys(props.mandateVersion.mandate.organization)[0] === 'id' || Object.keys(props.mandateVersion.mandate.organization)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.mandate.organization.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.mandate.organization.id !== undefined ? {
                equals: props.mandateVersion.mandate.organization.id
              } : undefined,
            name: props.mandateVersion.mandate.organization.name !== undefined ? {
                equals: props.mandateVersion.mandate.organization.name
              } : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? {
                equals: props.mandateVersion.mandate.organization.slug
              } : undefined,
          },
          update: {
            id: props.mandateVersion.mandate.organization.id !== undefined ? {
                set: props.mandateVersion.mandate.organization.id
              } : undefined,
            name: props.mandateVersion.mandate.organization.name !== undefined ? {
                set: props.mandateVersion.mandate.organization.name
              } : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? {
                set: props.mandateVersion.mandate.organization.slug
              } : undefined,
            logoUrl: props.mandateVersion.mandate.organization.logoUrl !== undefined ? {
                set: props.mandateVersion.mandate.organization.logoUrl
              } : undefined,
            website: props.mandateVersion.mandate.organization.website !== undefined ? {
                set: props.mandateVersion.mandate.organization.website
              } : undefined,
            businessType: props.mandateVersion.mandate.organization.businessType !== undefined ? {
                set: props.mandateVersion.mandate.organization.businessType
              } : undefined,
            emailDomains: props.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.mandate.organization.emailDomains
              } : undefined,
            jurisdiction: props.mandateVersion.mandate.organization.jurisdiction !== undefined ? {
                set: props.mandateVersion.mandate.organization.jurisdiction
              } : undefined,
            regulatoryStatus: props.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? {
                set: props.mandateVersion.mandate.organization.regulatoryStatus
              } : undefined,
            description: props.mandateVersion.mandate.organization.description !== undefined ? {
                set: props.mandateVersion.mandate.organization.description
              } : undefined,
            tradingDefaults: props.mandateVersion.mandate.organization.tradingDefaults !== undefined ? props.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.mandate.organization.deletedAt !== undefined ? {
                set: props.mandateVersion.mandate.organization.deletedAt
              } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.organization.name !== undefined ? props.mandateVersion.mandate.organization.name : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            logoUrl: props.mandateVersion.mandate.organization.logoUrl !== undefined ? props.mandateVersion.mandate.organization.logoUrl : undefined,
            website: props.mandateVersion.mandate.organization.website !== undefined ? props.mandateVersion.mandate.organization.website : undefined,
            businessType: props.mandateVersion.mandate.organization.businessType !== undefined ? props.mandateVersion.mandate.organization.businessType : undefined,
            emailDomains: props.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.mandate.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.mandate.organization.jurisdiction !== undefined ? props.mandateVersion.mandate.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? props.mandateVersion.mandate.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.mandate.organization.description !== undefined ? props.mandateVersion.mandate.organization.description : undefined,
            tradingDefaults: props.mandateVersion.mandate.organization.tradingDefaults !== undefined ? props.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.mandate.organization.deletedAt !== undefined ? props.mandateVersion.mandate.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.mandate.fund ? 
      typeof props.mandateVersion.mandate.fund === 'object' && Object.keys(props.mandateVersion.mandate.fund).length === 1 && (Object.keys(props.mandateVersion.mandate.fund)[0] === 'id' || Object.keys(props.mandateVersion.mandate.fund)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.mandate.fund.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.mandate.fund.id !== undefined ? {
                equals: props.mandateVersion.mandate.fund.id
              } : undefined,
            name: props.mandateVersion.mandate.fund.name !== undefined ? {
                equals: props.mandateVersion.mandate.fund.name
              } : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? {
                equals: props.mandateVersion.mandate.fund.slug
              } : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? {
                equals: props.mandateVersion.mandate.fund.status
              } : undefined,
            organizationId: props.mandateVersion.mandate.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.organizationId
              } : undefined,
            managerId: props.mandateVersion.mandate.fund.managerId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.managerId
              } : undefined,
            operatorId: props.mandateVersion.mandate.fund.operatorId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.operatorId
              } : undefined,
          },
          update: {
            id: props.mandateVersion.mandate.fund.id !== undefined ? {
                set: props.mandateVersion.mandate.fund.id
              } : undefined,
            name: props.mandateVersion.mandate.fund.name !== undefined ? {
                set: props.mandateVersion.mandate.fund.name
              } : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? {
                set: props.mandateVersion.mandate.fund.slug
              } : undefined,
            description: props.mandateVersion.mandate.fund.description !== undefined ? {
                set: props.mandateVersion.mandate.fund.description
              } : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? {
                set: props.mandateVersion.mandate.fund.status
              } : undefined,
            currency: props.mandateVersion.mandate.fund.currency !== undefined ? {
                set: props.mandateVersion.mandate.fund.currency
              } : undefined,
            inceptionDate: props.mandateVersion.mandate.fund.inceptionDate !== undefined ? {
                set: props.mandateVersion.mandate.fund.inceptionDate
              } : undefined,
            aum: props.mandateVersion.mandate.fund.aum !== undefined ? {
                set: props.mandateVersion.mandate.fund.aum
              } : undefined,
            navPerShare: props.mandateVersion.mandate.fund.navPerShare !== undefined ? {
                set: props.mandateVersion.mandate.fund.navPerShare
              } : undefined,
            sharesOutstanding: props.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? {
                set: props.mandateVersion.mandate.fund.sharesOutstanding
              } : undefined,
            highWaterMarkNav: props.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? {
                set: props.mandateVersion.mandate.fund.highWaterMarkNav
              } : undefined,
            fees: props.mandateVersion.mandate.fund.fees !== undefined ? props.mandateVersion.mandate.fund.fees : undefined,
            terms: props.mandateVersion.mandate.fund.terms !== undefined ? props.mandateVersion.mandate.fund.terms : undefined,
            regulatory: props.mandateVersion.mandate.fund.regulatory !== undefined ? props.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.mandate.fund.serviceProviders !== undefined ? props.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.mandate.fund.tradingOverrides !== undefined ? props.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.mandate.fund.deletedAt !== undefined ? {
                set: props.mandateVersion.mandate.fund.deletedAt
              } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.fund.name !== undefined ? props.mandateVersion.mandate.fund.name : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? props.mandateVersion.mandate.fund.slug : undefined,
            description: props.mandateVersion.mandate.fund.description !== undefined ? props.mandateVersion.mandate.fund.description : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? props.mandateVersion.mandate.fund.status : undefined,
            currency: props.mandateVersion.mandate.fund.currency !== undefined ? props.mandateVersion.mandate.fund.currency : undefined,
            inceptionDate: props.mandateVersion.mandate.fund.inceptionDate !== undefined ? props.mandateVersion.mandate.fund.inceptionDate : undefined,
            aum: props.mandateVersion.mandate.fund.aum !== undefined ? props.mandateVersion.mandate.fund.aum : undefined,
            navPerShare: props.mandateVersion.mandate.fund.navPerShare !== undefined ? props.mandateVersion.mandate.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? props.mandateVersion.mandate.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? props.mandateVersion.mandate.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.mandate.fund.fees !== undefined ? props.mandateVersion.mandate.fund.fees : undefined,
            terms: props.mandateVersion.mandate.fund.terms !== undefined ? props.mandateVersion.mandate.fund.terms : undefined,
            regulatory: props.mandateVersion.mandate.fund.regulatory !== undefined ? props.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.mandate.fund.serviceProviders !== undefined ? props.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.mandate.fund.tradingOverrides !== undefined ? props.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.mandate.fund.deletedAt !== undefined ? props.mandateVersion.mandate.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.mandate.owner ? 
      typeof props.mandateVersion.mandate.owner === 'object' && Object.keys(props.mandateVersion.mandate.owner).length === 1 && (Object.keys(props.mandateVersion.mandate.owner)[0] === 'id' || Object.keys(props.mandateVersion.mandate.owner)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.mandate.owner.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.mandate.owner.id !== undefined ? {
                equals: props.mandateVersion.mandate.owner.id
              } : undefined,
            name: props.mandateVersion.mandate.owner.name !== undefined ? {
                equals: props.mandateVersion.mandate.owner.name
              } : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? {
                equals: props.mandateVersion.mandate.owner.email
              } : undefined,
            customerId: props.mandateVersion.mandate.owner.customerId !== undefined ? {
                equals: props.mandateVersion.mandate.owner.customerId
              } : undefined,
          },
          update: {
            id: props.mandateVersion.mandate.owner.id !== undefined ? {
                set: props.mandateVersion.mandate.owner.id
              } : undefined,
            name: props.mandateVersion.mandate.owner.name !== undefined ? {
                set: props.mandateVersion.mandate.owner.name
              } : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? {
                set: props.mandateVersion.mandate.owner.email
              } : undefined,
            emailVerified: props.mandateVersion.mandate.owner.emailVerified !== undefined ? {
                set: props.mandateVersion.mandate.owner.emailVerified
              } : undefined,
            image: props.mandateVersion.mandate.owner.image !== undefined ? {
                set: props.mandateVersion.mandate.owner.image
              } : undefined,
            avatarUrl: props.mandateVersion.mandate.owner.avatarUrl !== undefined ? {
                set: props.mandateVersion.mandate.owner.avatarUrl
              } : undefined,
            onboardingComplete: props.mandateVersion.mandate.owner.onboardingComplete !== undefined ? {
                set: props.mandateVersion.mandate.owner.onboardingComplete
              } : undefined,
            signupCategory: props.mandateVersion.mandate.owner.signupCategory !== undefined ? {
                set: props.mandateVersion.mandate.owner.signupCategory
              } : undefined,
            deletedAt: props.mandateVersion.mandate.owner.deletedAt !== undefined ? {
                set: props.mandateVersion.mandate.owner.deletedAt
              } : undefined,
            role: props.mandateVersion.mandate.owner.role !== undefined ? {
                set: props.mandateVersion.mandate.owner.role
              } : undefined,
            bio: props.mandateVersion.mandate.owner.bio !== undefined ? {
                set: props.mandateVersion.mandate.owner.bio
              } : undefined,
            jobTitle: props.mandateVersion.mandate.owner.jobTitle !== undefined ? {
                set: props.mandateVersion.mandate.owner.jobTitle
              } : undefined,
            currentAccount: props.mandateVersion.mandate.owner.currentAccount !== undefined ? {
                set: props.mandateVersion.mandate.owner.currentAccount
              } : undefined,
            plan: props.mandateVersion.mandate.owner.plan !== undefined ? {
                set: props.mandateVersion.mandate.owner.plan
              } : undefined,
            openaiAPIKey: props.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? {
                set: props.mandateVersion.mandate.owner.openaiAPIKey
              } : undefined,
            openaiModel: props.mandateVersion.mandate.owner.openaiModel !== undefined ? {
                set: props.mandateVersion.mandate.owner.openaiModel
              } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.owner.name !== undefined ? props.mandateVersion.mandate.owner.name : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            emailVerified: props.mandateVersion.mandate.owner.emailVerified !== undefined ? props.mandateVersion.mandate.owner.emailVerified : undefined,
            image: props.mandateVersion.mandate.owner.image !== undefined ? props.mandateVersion.mandate.owner.image : undefined,
            avatarUrl: props.mandateVersion.mandate.owner.avatarUrl !== undefined ? props.mandateVersion.mandate.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.mandate.owner.onboardingComplete !== undefined ? props.mandateVersion.mandate.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.mandate.owner.signupCategory !== undefined ? props.mandateVersion.mandate.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.mandate.owner.deletedAt !== undefined ? props.mandateVersion.mandate.owner.deletedAt : undefined,
            role: props.mandateVersion.mandate.owner.role !== undefined ? props.mandateVersion.mandate.owner.role : undefined,
            bio: props.mandateVersion.mandate.owner.bio !== undefined ? props.mandateVersion.mandate.owner.bio : undefined,
            jobTitle: props.mandateVersion.mandate.owner.jobTitle !== undefined ? props.mandateVersion.mandate.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.mandate.owner.currentAccount !== undefined ? props.mandateVersion.mandate.owner.currentAccount : undefined,
            plan: props.mandateVersion.mandate.owner.plan !== undefined ? props.mandateVersion.mandate.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? props.mandateVersion.mandate.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.mandate.owner.openaiModel !== undefined ? props.mandateVersion.mandate.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      activeVersion: props.mandateVersion.mandate.activeVersion ? 
      typeof props.mandateVersion.mandate.activeVersion === 'object' && Object.keys(props.mandateVersion.mandate.activeVersion).length === 1 && (Object.keys(props.mandateVersion.mandate.activeVersion)[0] === 'id' || Object.keys(props.mandateVersion.mandate.activeVersion)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.mandate.activeVersion.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.mandate.activeVersion.id !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.id
              } : undefined,
            mandateId: props.mandateVersion.mandate.activeVersion.mandateId !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.mandateId
              } : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.status
              } : undefined,
            authoredById: props.mandateVersion.mandate.activeVersion.authoredById !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.authoredById
              } : undefined,
          },
          update: {
            id: props.mandateVersion.mandate.activeVersion.id !== undefined ? {
                set: props.mandateVersion.mandate.activeVersion.id
              } : undefined,
            versionLabel: props.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? {
                set: props.mandateVersion.mandate.activeVersion.versionLabel
              } : undefined,
            versionSeq: props.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? {
                set: props.mandateVersion.mandate.activeVersion.versionSeq
              } : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? {
                set: props.mandateVersion.mandate.activeVersion.status
              } : undefined,
            summary: props.mandateVersion.mandate.activeVersion.summary !== undefined ? {
                set: props.mandateVersion.mandate.activeVersion.summary
              } : undefined,
            charterBody: props.mandateVersion.mandate.activeVersion.charterBody !== undefined ? props.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
          create: {
            versionLabel: props.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? props.mandateVersion.mandate.activeVersion.versionLabel : undefined,
            versionSeq: props.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? props.mandateVersion.mandate.activeVersion.versionSeq : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? props.mandateVersion.mandate.activeVersion.status : undefined,
            summary: props.mandateVersion.mandate.activeVersion.summary !== undefined ? props.mandateVersion.mandate.activeVersion.summary : undefined,
            charterBody: props.mandateVersion.mandate.activeVersion.charterBody !== undefined ? props.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
        }
      } : undefined,
        },
        create: {
          scopeKind: props.mandateVersion.mandate.scopeKind !== undefined ? props.mandateVersion.mandate.scopeKind : undefined,
          klass: props.mandateVersion.mandate.klass !== undefined ? props.mandateVersion.mandate.klass : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? props.mandateVersion.mandate.name : undefined,
          personaScope: props.mandateVersion.mandate.personaScope !== undefined ? props.mandateVersion.mandate.personaScope : undefined,
          deletedAt: props.mandateVersion.mandate.deletedAt !== undefined ? props.mandateVersion.mandate.deletedAt : undefined,
      organization: props.mandateVersion.mandate.organization ? 
        typeof props.mandateVersion.mandate.organization === 'object' && Object.keys(props.mandateVersion.mandate.organization).length === 1 && Object.keys(props.mandateVersion.mandate.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.organization.id !== undefined ? props.mandateVersion.mandate.organization.id : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            name: props.mandateVersion.mandate.organization.name !== undefined ? {
                equals: props.mandateVersion.mandate.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.organization.name !== undefined ? props.mandateVersion.mandate.organization.name : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            logoUrl: props.mandateVersion.mandate.organization.logoUrl !== undefined ? props.mandateVersion.mandate.organization.logoUrl : undefined,
            website: props.mandateVersion.mandate.organization.website !== undefined ? props.mandateVersion.mandate.organization.website : undefined,
            businessType: props.mandateVersion.mandate.organization.businessType !== undefined ? props.mandateVersion.mandate.organization.businessType : undefined,
            emailDomains: props.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.mandate.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.mandate.organization.jurisdiction !== undefined ? props.mandateVersion.mandate.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? props.mandateVersion.mandate.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.mandate.organization.description !== undefined ? props.mandateVersion.mandate.organization.description : undefined,
            tradingDefaults: props.mandateVersion.mandate.organization.tradingDefaults !== undefined ? props.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.mandate.organization.deletedAt !== undefined ? props.mandateVersion.mandate.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.mandate.fund ? 
        typeof props.mandateVersion.mandate.fund === 'object' && Object.keys(props.mandateVersion.mandate.fund).length === 1 && Object.keys(props.mandateVersion.mandate.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.fund.id !== undefined ? props.mandateVersion.mandate.fund.id : undefined,
            name: props.mandateVersion.mandate.fund.name !== undefined ? {
                equals: props.mandateVersion.mandate.fund.name 
               } : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? {
                equals: props.mandateVersion.mandate.fund.slug 
               } : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? {
                equals: props.mandateVersion.mandate.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.mandate.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.fund.name !== undefined ? props.mandateVersion.mandate.fund.name : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? props.mandateVersion.mandate.fund.slug : undefined,
            description: props.mandateVersion.mandate.fund.description !== undefined ? props.mandateVersion.mandate.fund.description : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? props.mandateVersion.mandate.fund.status : undefined,
            currency: props.mandateVersion.mandate.fund.currency !== undefined ? props.mandateVersion.mandate.fund.currency : undefined,
            inceptionDate: props.mandateVersion.mandate.fund.inceptionDate !== undefined ? props.mandateVersion.mandate.fund.inceptionDate : undefined,
            aum: props.mandateVersion.mandate.fund.aum !== undefined ? props.mandateVersion.mandate.fund.aum : undefined,
            navPerShare: props.mandateVersion.mandate.fund.navPerShare !== undefined ? props.mandateVersion.mandate.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? props.mandateVersion.mandate.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? props.mandateVersion.mandate.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.mandate.fund.fees !== undefined ? props.mandateVersion.mandate.fund.fees : undefined,
            terms: props.mandateVersion.mandate.fund.terms !== undefined ? props.mandateVersion.mandate.fund.terms : undefined,
            regulatory: props.mandateVersion.mandate.fund.regulatory !== undefined ? props.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.mandate.fund.serviceProviders !== undefined ? props.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.mandate.fund.tradingOverrides !== undefined ? props.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.mandate.fund.deletedAt !== undefined ? props.mandateVersion.mandate.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.mandate.owner ? 
        typeof props.mandateVersion.mandate.owner === 'object' && Object.keys(props.mandateVersion.mandate.owner).length === 1 && Object.keys(props.mandateVersion.mandate.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.owner.id !== undefined ? props.mandateVersion.mandate.owner.id : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            name: props.mandateVersion.mandate.owner.name !== undefined ? {
                equals: props.mandateVersion.mandate.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.owner.name !== undefined ? props.mandateVersion.mandate.owner.name : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            emailVerified: props.mandateVersion.mandate.owner.emailVerified !== undefined ? props.mandateVersion.mandate.owner.emailVerified : undefined,
            image: props.mandateVersion.mandate.owner.image !== undefined ? props.mandateVersion.mandate.owner.image : undefined,
            avatarUrl: props.mandateVersion.mandate.owner.avatarUrl !== undefined ? props.mandateVersion.mandate.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.mandate.owner.onboardingComplete !== undefined ? props.mandateVersion.mandate.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.mandate.owner.signupCategory !== undefined ? props.mandateVersion.mandate.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.mandate.owner.deletedAt !== undefined ? props.mandateVersion.mandate.owner.deletedAt : undefined,
            role: props.mandateVersion.mandate.owner.role !== undefined ? props.mandateVersion.mandate.owner.role : undefined,
            bio: props.mandateVersion.mandate.owner.bio !== undefined ? props.mandateVersion.mandate.owner.bio : undefined,
            jobTitle: props.mandateVersion.mandate.owner.jobTitle !== undefined ? props.mandateVersion.mandate.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.mandate.owner.currentAccount !== undefined ? props.mandateVersion.mandate.owner.currentAccount : undefined,
            plan: props.mandateVersion.mandate.owner.plan !== undefined ? props.mandateVersion.mandate.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? props.mandateVersion.mandate.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.mandate.owner.openaiModel !== undefined ? props.mandateVersion.mandate.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      activeVersion: props.mandateVersion.mandate.activeVersion ? 
        typeof props.mandateVersion.mandate.activeVersion === 'object' && Object.keys(props.mandateVersion.mandate.activeVersion).length === 1 && Object.keys(props.mandateVersion.mandate.activeVersion)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.activeVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.activeVersion.id !== undefined ? props.mandateVersion.mandate.activeVersion.id : undefined,
            mandateId: props.mandateVersion.mandate.activeVersion.mandateId !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.mandateId 
               } : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.status 
               } : undefined,
          },
          create: {
            versionLabel: props.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? props.mandateVersion.mandate.activeVersion.versionLabel : undefined,
            versionSeq: props.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? props.mandateVersion.mandate.activeVersion.versionSeq : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? props.mandateVersion.mandate.activeVersion.status : undefined,
            summary: props.mandateVersion.mandate.activeVersion.summary !== undefined ? props.mandateVersion.mandate.activeVersion.summary : undefined,
            charterBody: props.mandateVersion.mandate.activeVersion.charterBody !== undefined ? props.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
        }
      } : undefined,
        },
      }
    } : undefined,
    authoredBy: props.mandateVersion.authoredBy ? 
    typeof props.mandateVersion.authoredBy === 'object' && Object.keys(props.mandateVersion.authoredBy).length === 1 && (Object.keys(props.mandateVersion.authoredBy)[0] === 'id' || Object.keys(props.mandateVersion.authoredBy)[0] === 'symbol')
? {
    connect: {
      id: props.mandateVersion.authoredBy.id
    }
} : { upsert: {
        where: {
          id: props.mandateVersion.authoredBy.id !== undefined ? {
              equals: props.mandateVersion.authoredBy.id
            } : undefined,
          name: props.mandateVersion.authoredBy.name !== undefined ? {
              equals: props.mandateVersion.authoredBy.name
            } : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? {
              equals: props.mandateVersion.authoredBy.email
            } : undefined,
          customerId: props.mandateVersion.authoredBy.customerId !== undefined ? {
              equals: props.mandateVersion.authoredBy.customerId
            } : undefined,
        },
        update: {
          id: props.mandateVersion.authoredBy.id !== undefined ? {
              set: props.mandateVersion.authoredBy.id
            } : undefined,
          name: props.mandateVersion.authoredBy.name !== undefined ? {
              set: props.mandateVersion.authoredBy.name
            } : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? {
              set: props.mandateVersion.authoredBy.email
            } : undefined,
          emailVerified: props.mandateVersion.authoredBy.emailVerified !== undefined ? {
              set: props.mandateVersion.authoredBy.emailVerified
            } : undefined,
          image: props.mandateVersion.authoredBy.image !== undefined ? {
              set: props.mandateVersion.authoredBy.image
            } : undefined,
          avatarUrl: props.mandateVersion.authoredBy.avatarUrl !== undefined ? {
              set: props.mandateVersion.authoredBy.avatarUrl
            } : undefined,
          onboardingComplete: props.mandateVersion.authoredBy.onboardingComplete !== undefined ? {
              set: props.mandateVersion.authoredBy.onboardingComplete
            } : undefined,
          signupCategory: props.mandateVersion.authoredBy.signupCategory !== undefined ? {
              set: props.mandateVersion.authoredBy.signupCategory
            } : undefined,
          deletedAt: props.mandateVersion.authoredBy.deletedAt !== undefined ? {
              set: props.mandateVersion.authoredBy.deletedAt
            } : undefined,
          role: props.mandateVersion.authoredBy.role !== undefined ? {
              set: props.mandateVersion.authoredBy.role
            } : undefined,
          bio: props.mandateVersion.authoredBy.bio !== undefined ? {
              set: props.mandateVersion.authoredBy.bio
            } : undefined,
          jobTitle: props.mandateVersion.authoredBy.jobTitle !== undefined ? {
              set: props.mandateVersion.authoredBy.jobTitle
            } : undefined,
          currentAccount: props.mandateVersion.authoredBy.currentAccount !== undefined ? {
              set: props.mandateVersion.authoredBy.currentAccount
            } : undefined,
          plan: props.mandateVersion.authoredBy.plan !== undefined ? {
              set: props.mandateVersion.authoredBy.plan
            } : undefined,
          openaiAPIKey: props.mandateVersion.authoredBy.openaiAPIKey !== undefined ? {
              set: props.mandateVersion.authoredBy.openaiAPIKey
            } : undefined,
          openaiModel: props.mandateVersion.authoredBy.openaiModel !== undefined ? {
              set: props.mandateVersion.authoredBy.openaiModel
            } : undefined,
      customer: props.mandateVersion.authoredBy.customer ? 
      typeof props.mandateVersion.authoredBy.customer === 'object' && Object.keys(props.mandateVersion.authoredBy.customer).length === 1 && (Object.keys(props.mandateVersion.authoredBy.customer)[0] === 'id' || Object.keys(props.mandateVersion.authoredBy.customer)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.authoredBy.customer.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.authoredBy.customer.id !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.id
              } : undefined,
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.authUserId
              } : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.name
              } : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripePriceId
              } : undefined,
          },
          update: {
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.authUserId
              } : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.name
              } : undefined,
            plan: props.mandateVersion.authoredBy.customer.plan !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.plan
              } : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.stripePriceId
              } : undefined,
            stripeCurrentPeriodEnd: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd
              } : undefined,
            jurisdiction: props.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.jurisdiction
              } : undefined,
            riskProfile: props.mandateVersion.authoredBy.customer.riskProfile !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.riskProfile
              } : undefined,
            amlStatus: props.mandateVersion.authoredBy.customer.amlStatus !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.amlStatus
              } : undefined,
            lastKycUpdate: props.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? {
                set: props.mandateVersion.authoredBy.customer.lastKycUpdate
              } : undefined,
          },
          create: {
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? props.mandateVersion.authoredBy.customer.authUserId : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? props.mandateVersion.authoredBy.customer.name : undefined,
            plan: props.mandateVersion.authoredBy.customer.plan !== undefined ? props.mandateVersion.authoredBy.customer.plan : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? props.mandateVersion.authoredBy.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? props.mandateVersion.authoredBy.customer.jurisdiction : undefined,
            riskProfile: props.mandateVersion.authoredBy.customer.riskProfile !== undefined ? props.mandateVersion.authoredBy.customer.riskProfile : undefined,
            amlStatus: props.mandateVersion.authoredBy.customer.amlStatus !== undefined ? props.mandateVersion.authoredBy.customer.amlStatus : undefined,
            lastKycUpdate: props.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? props.mandateVersion.authoredBy.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.mandateVersion.authoredBy.accounts ? 
      Array.isArray(props.mandateVersion.authoredBy.accounts) && props.mandateVersion.authoredBy.accounts.length > 0 && props.mandateVersion.authoredBy.accounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.accounts.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.accounts.map((item) => ({
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
      sessions: props.mandateVersion.authoredBy.sessions ? 
      Array.isArray(props.mandateVersion.authoredBy.sessions) && props.mandateVersion.authoredBy.sessions.length > 0 && props.mandateVersion.authoredBy.sessions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.sessions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.sessions.map((item) => ({
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
      authenticators: props.mandateVersion.authoredBy.authenticators ? 
      Array.isArray(props.mandateVersion.authoredBy.authenticators) && props.mandateVersion.authoredBy.authenticators.length > 0 && props.mandateVersion.authoredBy.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.authenticators.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.authenticators.map((item) => ({
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
      alpacaAccounts: props.mandateVersion.authoredBy.alpacaAccounts ? 
      Array.isArray(props.mandateVersion.authoredBy.alpacaAccounts) && props.mandateVersion.authoredBy.alpacaAccounts.length > 0 && props.mandateVersion.authoredBy.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
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
      linkedProviders: props.mandateVersion.authoredBy.linkedProviders ? 
      Array.isArray(props.mandateVersion.authoredBy.linkedProviders) && props.mandateVersion.authoredBy.linkedProviders.length > 0 && props.mandateVersion.authoredBy.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
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
      accountLinkingRequests: props.mandateVersion.authoredBy.accountLinkingRequests ? 
      Array.isArray(props.mandateVersion.authoredBy.accountLinkingRequests) && props.mandateVersion.authoredBy.accountLinkingRequests.length > 0 && props.mandateVersion.authoredBy.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
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
      reviewedWaitlistEntries: props.mandateVersion.authoredBy.reviewedWaitlistEntries ? 
      Array.isArray(props.mandateVersion.authoredBy.reviewedWaitlistEntries) && props.mandateVersion.authoredBy.reviewedWaitlistEntries.length > 0 && props.mandateVersion.authoredBy.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
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
      llmConfiguration: props.mandateVersion.authoredBy.llmConfiguration ? 
      typeof props.mandateVersion.authoredBy.llmConfiguration === 'object' && Object.keys(props.mandateVersion.authoredBy.llmConfiguration).length === 1 && (Object.keys(props.mandateVersion.authoredBy.llmConfiguration)[0] === 'id' || Object.keys(props.mandateVersion.authoredBy.llmConfiguration)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.authoredBy.llmConfiguration.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? {
                equals: props.mandateVersion.authoredBy.llmConfiguration.id
              } : undefined,
            userId: props.mandateVersion.authoredBy.llmConfiguration.userId !== undefined ? {
                equals: props.mandateVersion.authoredBy.llmConfiguration.userId
              } : undefined,
          },
          update: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.id
              } : undefined,
            defaultProvider: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider
              } : undefined,
            miniProvider: props.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.miniProvider
              } : undefined,
            normalProvider: props.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.normalProvider
              } : undefined,
            advancedProvider: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider
              } : undefined,
            miniModel: props.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.miniModel
              } : undefined,
            normalModel: props.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.normalModel
              } : undefined,
            advancedModel: props.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.advancedModel
              } : undefined,
            openaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey
              } : undefined,
            anthropicApiKey: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey
              } : undefined,
            deepseekApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey
              } : undefined,
            kimiApiKey: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey
              } : undefined,
            qwenApiKey: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey
              } : undefined,
            xaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey
              } : undefined,
            geminiApiKey: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey
              } : undefined,
            deepinfraApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? {
                set: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey
              } : undefined,
          },
          create: {
            defaultProvider: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniProvider : undefined,
            normalProvider: props.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedProvider : undefined,
            miniModel: props.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniModel : undefined,
            normalModel: props.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalModel : undefined,
            advancedModel: props.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.mandateVersion.authoredBy.orgMemberships ? 
      Array.isArray(props.mandateVersion.authoredBy.orgMemberships) && props.mandateVersion.authoredBy.orgMemberships.length > 0 && props.mandateVersion.authoredBy.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
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
      fundAssignments: props.mandateVersion.authoredBy.fundAssignments ? 
      Array.isArray(props.mandateVersion.authoredBy.fundAssignments) && props.mandateVersion.authoredBy.fundAssignments.length > 0 && props.mandateVersion.authoredBy.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
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
      managedFunds: props.mandateVersion.authoredBy.managedFunds ? 
      Array.isArray(props.mandateVersion.authoredBy.managedFunds) && props.mandateVersion.authoredBy.managedFunds.length > 0 && props.mandateVersion.authoredBy.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.managedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.managedFunds.map((item) => ({
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
      operatedFunds: props.mandateVersion.authoredBy.operatedFunds ? 
      Array.isArray(props.mandateVersion.authoredBy.operatedFunds) && props.mandateVersion.authoredBy.operatedFunds.length > 0 && props.mandateVersion.authoredBy.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
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
      ownedMandates: props.mandateVersion.authoredBy.ownedMandates ? 
      Array.isArray(props.mandateVersion.authoredBy.ownedMandates) && props.mandateVersion.authoredBy.ownedMandates.length > 0 && props.mandateVersion.authoredBy.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
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
      mandateApprovalsDecided: props.mandateVersion.authoredBy.mandateApprovalsDecided ? 
      Array.isArray(props.mandateVersion.authoredBy.mandateApprovalsDecided) && props.mandateVersion.authoredBy.mandateApprovalsDecided.length > 0 && props.mandateVersion.authoredBy.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
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
      investorProfiles: props.mandateVersion.authoredBy.investorProfiles ? 
      Array.isArray(props.mandateVersion.authoredBy.investorProfiles) && props.mandateVersion.authoredBy.investorProfiles.length > 0 && props.mandateVersion.authoredBy.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
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
      notificationDeliveries: props.mandateVersion.authoredBy.notificationDeliveries ? 
      Array.isArray(props.mandateVersion.authoredBy.notificationDeliveries) && props.mandateVersion.authoredBy.notificationDeliveries.length > 0 && props.mandateVersion.authoredBy.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
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
      notificationPreferences: props.mandateVersion.authoredBy.notificationPreferences ? 
      Array.isArray(props.mandateVersion.authoredBy.notificationPreferences) && props.mandateVersion.authoredBy.notificationPreferences.length > 0 && props.mandateVersion.authoredBy.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
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
      ownedStrategies: props.mandateVersion.authoredBy.ownedStrategies ? 
      Array.isArray(props.mandateVersion.authoredBy.ownedStrategies) && props.mandateVersion.authoredBy.ownedStrategies.length > 0 && props.mandateVersion.authoredBy.ownedStrategies.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            key: item.key !== undefined ? item.key : undefined,
            ownerUserId: item.ownerUserId !== undefined ? {
                equals: item.ownerUserId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            key: item.key !== undefined ? {
                set: item.key
              } : undefined,
            displayName: item.displayName !== undefined ? {
                set: item.displayName
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            origin: item.origin !== undefined ? {
                set: item.origin
              } : undefined,
            lifecycleState: item.lifecycleState !== undefined ? {
                set: item.lifecycleState
              } : undefined,
            manifestHash: item.manifestHash !== undefined ? {
                set: item.manifestHash
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            key: item.key !== undefined ? item.key : undefined,
            displayName: item.displayName !== undefined ? item.displayName : undefined,
            description: item.description !== undefined ? item.description : undefined,
            origin: item.origin !== undefined ? item.origin : undefined,
            lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
            manifestHash: item.manifestHash !== undefined ? item.manifestHash : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          name: props.mandateVersion.authoredBy.name !== undefined ? props.mandateVersion.authoredBy.name : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? props.mandateVersion.authoredBy.email : undefined,
          emailVerified: props.mandateVersion.authoredBy.emailVerified !== undefined ? props.mandateVersion.authoredBy.emailVerified : undefined,
          image: props.mandateVersion.authoredBy.image !== undefined ? props.mandateVersion.authoredBy.image : undefined,
          avatarUrl: props.mandateVersion.authoredBy.avatarUrl !== undefined ? props.mandateVersion.authoredBy.avatarUrl : undefined,
          onboardingComplete: props.mandateVersion.authoredBy.onboardingComplete !== undefined ? props.mandateVersion.authoredBy.onboardingComplete : undefined,
          signupCategory: props.mandateVersion.authoredBy.signupCategory !== undefined ? props.mandateVersion.authoredBy.signupCategory : undefined,
          deletedAt: props.mandateVersion.authoredBy.deletedAt !== undefined ? props.mandateVersion.authoredBy.deletedAt : undefined,
          role: props.mandateVersion.authoredBy.role !== undefined ? props.mandateVersion.authoredBy.role : undefined,
          bio: props.mandateVersion.authoredBy.bio !== undefined ? props.mandateVersion.authoredBy.bio : undefined,
          jobTitle: props.mandateVersion.authoredBy.jobTitle !== undefined ? props.mandateVersion.authoredBy.jobTitle : undefined,
          currentAccount: props.mandateVersion.authoredBy.currentAccount !== undefined ? props.mandateVersion.authoredBy.currentAccount : undefined,
          plan: props.mandateVersion.authoredBy.plan !== undefined ? props.mandateVersion.authoredBy.plan : undefined,
          openaiAPIKey: props.mandateVersion.authoredBy.openaiAPIKey !== undefined ? props.mandateVersion.authoredBy.openaiAPIKey : undefined,
          openaiModel: props.mandateVersion.authoredBy.openaiModel !== undefined ? props.mandateVersion.authoredBy.openaiModel : undefined,
      customer: props.mandateVersion.authoredBy.customer ? 
        typeof props.mandateVersion.authoredBy.customer === 'object' && Object.keys(props.mandateVersion.authoredBy.customer).length === 1 && Object.keys(props.mandateVersion.authoredBy.customer)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.customer.id !== undefined ? props.mandateVersion.authoredBy.customer.id : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.authUserId 
               } : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.name 
               } : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? props.mandateVersion.authoredBy.customer.authUserId : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? props.mandateVersion.authoredBy.customer.name : undefined,
            plan: props.mandateVersion.authoredBy.customer.plan !== undefined ? props.mandateVersion.authoredBy.customer.plan : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? props.mandateVersion.authoredBy.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? props.mandateVersion.authoredBy.customer.jurisdiction : undefined,
            riskProfile: props.mandateVersion.authoredBy.customer.riskProfile !== undefined ? props.mandateVersion.authoredBy.customer.riskProfile : undefined,
            amlStatus: props.mandateVersion.authoredBy.customer.amlStatus !== undefined ? props.mandateVersion.authoredBy.customer.amlStatus : undefined,
            lastKycUpdate: props.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? props.mandateVersion.authoredBy.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.mandateVersion.authoredBy.accounts ? 
        Array.isArray(props.mandateVersion.authoredBy.accounts) && props.mandateVersion.authoredBy.accounts.length > 0 &&  props.mandateVersion.authoredBy.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accounts.map((item) => ({
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
      sessions: props.mandateVersion.authoredBy.sessions ? 
        Array.isArray(props.mandateVersion.authoredBy.sessions) && props.mandateVersion.authoredBy.sessions.length > 0 &&  props.mandateVersion.authoredBy.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.sessions.map((item) => ({
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
      authenticators: props.mandateVersion.authoredBy.authenticators ? 
        Array.isArray(props.mandateVersion.authoredBy.authenticators) && props.mandateVersion.authoredBy.authenticators.length > 0 &&  props.mandateVersion.authoredBy.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.authenticators.map((item) => ({
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
      alpacaAccounts: props.mandateVersion.authoredBy.alpacaAccounts ? 
        Array.isArray(props.mandateVersion.authoredBy.alpacaAccounts) && props.mandateVersion.authoredBy.alpacaAccounts.length > 0 &&  props.mandateVersion.authoredBy.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
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
      linkedProviders: props.mandateVersion.authoredBy.linkedProviders ? 
        Array.isArray(props.mandateVersion.authoredBy.linkedProviders) && props.mandateVersion.authoredBy.linkedProviders.length > 0 &&  props.mandateVersion.authoredBy.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
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
      accountLinkingRequests: props.mandateVersion.authoredBy.accountLinkingRequests ? 
        Array.isArray(props.mandateVersion.authoredBy.accountLinkingRequests) && props.mandateVersion.authoredBy.accountLinkingRequests.length > 0 &&  props.mandateVersion.authoredBy.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
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
      reviewedWaitlistEntries: props.mandateVersion.authoredBy.reviewedWaitlistEntries ? 
        Array.isArray(props.mandateVersion.authoredBy.reviewedWaitlistEntries) && props.mandateVersion.authoredBy.reviewedWaitlistEntries.length > 0 &&  props.mandateVersion.authoredBy.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
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
      llmConfiguration: props.mandateVersion.authoredBy.llmConfiguration ? 
        typeof props.mandateVersion.authoredBy.llmConfiguration === 'object' && Object.keys(props.mandateVersion.authoredBy.llmConfiguration).length === 1 && Object.keys(props.mandateVersion.authoredBy.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.id : undefined,
            userId: props.mandateVersion.authoredBy.llmConfiguration.userId !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniProvider : undefined,
            normalProvider: props.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedProvider : undefined,
            miniModel: props.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniModel : undefined,
            normalModel: props.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalModel : undefined,
            advancedModel: props.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.mandateVersion.authoredBy.orgMemberships ? 
        Array.isArray(props.mandateVersion.authoredBy.orgMemberships) && props.mandateVersion.authoredBy.orgMemberships.length > 0 &&  props.mandateVersion.authoredBy.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
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
      fundAssignments: props.mandateVersion.authoredBy.fundAssignments ? 
        Array.isArray(props.mandateVersion.authoredBy.fundAssignments) && props.mandateVersion.authoredBy.fundAssignments.length > 0 &&  props.mandateVersion.authoredBy.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
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
      managedFunds: props.mandateVersion.authoredBy.managedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.managedFunds) && props.mandateVersion.authoredBy.managedFunds.length > 0 &&  props.mandateVersion.authoredBy.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.managedFunds.map((item) => ({
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
      operatedFunds: props.mandateVersion.authoredBy.operatedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.operatedFunds) && props.mandateVersion.authoredBy.operatedFunds.length > 0 &&  props.mandateVersion.authoredBy.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
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
      ownedMandates: props.mandateVersion.authoredBy.ownedMandates ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedMandates) && props.mandateVersion.authoredBy.ownedMandates.length > 0 &&  props.mandateVersion.authoredBy.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
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
      mandateApprovalsDecided: props.mandateVersion.authoredBy.mandateApprovalsDecided ? 
        Array.isArray(props.mandateVersion.authoredBy.mandateApprovalsDecided) && props.mandateVersion.authoredBy.mandateApprovalsDecided.length > 0 &&  props.mandateVersion.authoredBy.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
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
      investorProfiles: props.mandateVersion.authoredBy.investorProfiles ? 
        Array.isArray(props.mandateVersion.authoredBy.investorProfiles) && props.mandateVersion.authoredBy.investorProfiles.length > 0 &&  props.mandateVersion.authoredBy.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
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
      notificationDeliveries: props.mandateVersion.authoredBy.notificationDeliveries ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationDeliveries) && props.mandateVersion.authoredBy.notificationDeliveries.length > 0 &&  props.mandateVersion.authoredBy.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
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
      notificationPreferences: props.mandateVersion.authoredBy.notificationPreferences ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationPreferences) && props.mandateVersion.authoredBy.notificationPreferences.length > 0 &&  props.mandateVersion.authoredBy.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
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
      ownedStrategies: props.mandateVersion.authoredBy.ownedStrategies ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedStrategies) && props.mandateVersion.authoredBy.ownedStrategies.length > 0 &&  props.mandateVersion.authoredBy.ownedStrategies.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            key: item.key !== undefined ? item.key : undefined,
          },
          create: {
            key: item.key !== undefined ? item.key : undefined,
            displayName: item.displayName !== undefined ? item.displayName : undefined,
            description: item.description !== undefined ? item.description : undefined,
            origin: item.origin !== undefined ? item.origin : undefined,
            lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
            manifestHash: item.manifestHash !== undefined ? item.manifestHash : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    approvals: props.mandateVersion.approvals ? 
    Array.isArray(props.mandateVersion.approvals) && props.mandateVersion.approvals.length > 0 && props.mandateVersion.approvals.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.mandateVersion.approvals.map((item) => ({
      id: item.id
    }))
} : { upsert: props.mandateVersion.approvals.map((item) => ({
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
      decidedBy: item.decidedBy ? 
      typeof item.decidedBy === 'object' && Object.keys(item.decidedBy).length === 1 && (Object.keys(item.decidedBy)[0] === 'id' || Object.keys(item.decidedBy)[0] === 'symbol')
? {
      connect: {
        id: item.decidedBy.id
      }
} : { upsert: {
          where: {
            id: item.decidedBy.id !== undefined ? {
                equals: item.decidedBy.id
              } : undefined,
            name: item.decidedBy.name !== undefined ? {
                equals: item.decidedBy.name
              } : undefined,
            email: item.decidedBy.email !== undefined ? {
                equals: item.decidedBy.email
              } : undefined,
            customerId: item.decidedBy.customerId !== undefined ? {
                equals: item.decidedBy.customerId
              } : undefined,
          },
          update: {
            id: item.decidedBy.id !== undefined ? {
                set: item.decidedBy.id
              } : undefined,
            name: item.decidedBy.name !== undefined ? {
                set: item.decidedBy.name
              } : undefined,
            email: item.decidedBy.email !== undefined ? {
                set: item.decidedBy.email
              } : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? {
                set: item.decidedBy.emailVerified
              } : undefined,
            image: item.decidedBy.image !== undefined ? {
                set: item.decidedBy.image
              } : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? {
                set: item.decidedBy.avatarUrl
              } : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? {
                set: item.decidedBy.onboardingComplete
              } : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? {
                set: item.decidedBy.signupCategory
              } : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? {
                set: item.decidedBy.deletedAt
              } : undefined,
            role: item.decidedBy.role !== undefined ? {
                set: item.decidedBy.role
              } : undefined,
            bio: item.decidedBy.bio !== undefined ? {
                set: item.decidedBy.bio
              } : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? {
                set: item.decidedBy.jobTitle
              } : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? {
                set: item.decidedBy.currentAccount
              } : undefined,
            plan: item.decidedBy.plan !== undefined ? {
                set: item.decidedBy.plan
              } : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? {
                set: item.decidedBy.openaiAPIKey
              } : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? {
                set: item.decidedBy.openaiModel
              } : undefined,
          },
          create: {
            name: item.decidedBy.name !== undefined ? item.decidedBy.name : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? item.decidedBy.emailVerified : undefined,
            image: item.decidedBy.image !== undefined ? item.decidedBy.image : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? item.decidedBy.avatarUrl : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? item.decidedBy.onboardingComplete : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? item.decidedBy.signupCategory : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? item.decidedBy.deletedAt : undefined,
            role: item.decidedBy.role !== undefined ? item.decidedBy.role : undefined,
            bio: item.decidedBy.bio !== undefined ? item.decidedBy.bio : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? item.decidedBy.jobTitle : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? item.decidedBy.currentAccount : undefined,
            plan: item.decidedBy.plan !== undefined ? item.decidedBy.plan : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? item.decidedBy.openaiAPIKey : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? item.decidedBy.openaiModel : undefined,
          },
        }
      } : undefined,
        },
        create: {
          action: item.action !== undefined ? item.action : undefined,
          decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
          rationale: item.rationale !== undefined ? item.rationale : undefined,
          correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
      decidedBy: item.decidedBy ? 
        typeof item.decidedBy === 'object' && Object.keys(item.decidedBy).length === 1 && Object.keys(item.decidedBy)[0] === 'id'
    ? { connect: {
            id: item.decidedBy.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.decidedBy.id !== undefined ? item.decidedBy.id : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            name: item.decidedBy.name !== undefined ? {
                equals: item.decidedBy.name 
               } : undefined,
          },
          create: {
            name: item.decidedBy.name !== undefined ? item.decidedBy.name : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? item.decidedBy.emailVerified : undefined,
            image: item.decidedBy.image !== undefined ? item.decidedBy.image : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? item.decidedBy.avatarUrl : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? item.decidedBy.onboardingComplete : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? item.decidedBy.signupCategory : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? item.decidedBy.deletedAt : undefined,
            role: item.decidedBy.role !== undefined ? item.decidedBy.role : undefined,
            bio: item.decidedBy.bio !== undefined ? item.decidedBy.bio : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? item.decidedBy.jobTitle : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? item.decidedBy.currentAccount : undefined,
            plan: item.decidedBy.plan !== undefined ? item.decidedBy.plan : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? item.decidedBy.openaiAPIKey : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? item.decidedBy.openaiModel : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    activeFor: props.mandateVersion.activeFor ? 
    typeof props.mandateVersion.activeFor === 'object' && Object.keys(props.mandateVersion.activeFor).length === 1 && (Object.keys(props.mandateVersion.activeFor)[0] === 'id' || Object.keys(props.mandateVersion.activeFor)[0] === 'symbol')
? {
    connect: {
      id: props.mandateVersion.activeFor.id
    }
} : { upsert: {
        where: {
          id: props.mandateVersion.activeFor.id !== undefined ? {
              equals: props.mandateVersion.activeFor.id
            } : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? {
              equals: props.mandateVersion.activeFor.name
            } : undefined,
          organizationId: props.mandateVersion.activeFor.organizationId !== undefined ? {
              equals: props.mandateVersion.activeFor.organizationId
            } : undefined,
          fundId: props.mandateVersion.activeFor.fundId !== undefined ? {
              equals: props.mandateVersion.activeFor.fundId
            } : undefined,
          ownerId: props.mandateVersion.activeFor.ownerId !== undefined ? {
              equals: props.mandateVersion.activeFor.ownerId
            } : undefined,
          activeVersionId: props.mandateVersion.activeFor.activeVersionId !== undefined ? {
              equals: props.mandateVersion.activeFor.activeVersionId
            } : undefined,
        },
        update: {
          id: props.mandateVersion.activeFor.id !== undefined ? {
              set: props.mandateVersion.activeFor.id
            } : undefined,
          scopeKind: props.mandateVersion.activeFor.scopeKind !== undefined ? {
              set: props.mandateVersion.activeFor.scopeKind
            } : undefined,
          klass: props.mandateVersion.activeFor.klass !== undefined ? {
              set: props.mandateVersion.activeFor.klass
            } : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? {
              set: props.mandateVersion.activeFor.name
            } : undefined,
          personaScope: props.mandateVersion.activeFor.personaScope !== undefined ? {
              set: props.mandateVersion.activeFor.personaScope
            } : undefined,
          deletedAt: props.mandateVersion.activeFor.deletedAt !== undefined ? {
              set: props.mandateVersion.activeFor.deletedAt
            } : undefined,
      organization: props.mandateVersion.activeFor.organization ? 
      typeof props.mandateVersion.activeFor.organization === 'object' && Object.keys(props.mandateVersion.activeFor.organization).length === 1 && (Object.keys(props.mandateVersion.activeFor.organization)[0] === 'id' || Object.keys(props.mandateVersion.activeFor.organization)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.activeFor.organization.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.activeFor.organization.id !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.id
              } : undefined,
            name: props.mandateVersion.activeFor.organization.name !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.name
              } : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.slug
              } : undefined,
          },
          update: {
            id: props.mandateVersion.activeFor.organization.id !== undefined ? {
                set: props.mandateVersion.activeFor.organization.id
              } : undefined,
            name: props.mandateVersion.activeFor.organization.name !== undefined ? {
                set: props.mandateVersion.activeFor.organization.name
              } : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? {
                set: props.mandateVersion.activeFor.organization.slug
              } : undefined,
            logoUrl: props.mandateVersion.activeFor.organization.logoUrl !== undefined ? {
                set: props.mandateVersion.activeFor.organization.logoUrl
              } : undefined,
            website: props.mandateVersion.activeFor.organization.website !== undefined ? {
                set: props.mandateVersion.activeFor.organization.website
              } : undefined,
            businessType: props.mandateVersion.activeFor.organization.businessType !== undefined ? {
                set: props.mandateVersion.activeFor.organization.businessType
              } : undefined,
            emailDomains: props.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.activeFor.organization.emailDomains
              } : undefined,
            jurisdiction: props.mandateVersion.activeFor.organization.jurisdiction !== undefined ? {
                set: props.mandateVersion.activeFor.organization.jurisdiction
              } : undefined,
            regulatoryStatus: props.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? {
                set: props.mandateVersion.activeFor.organization.regulatoryStatus
              } : undefined,
            description: props.mandateVersion.activeFor.organization.description !== undefined ? {
                set: props.mandateVersion.activeFor.organization.description
              } : undefined,
            tradingDefaults: props.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? props.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.activeFor.organization.deletedAt !== undefined ? {
                set: props.mandateVersion.activeFor.organization.deletedAt
              } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.organization.name !== undefined ? props.mandateVersion.activeFor.organization.name : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            logoUrl: props.mandateVersion.activeFor.organization.logoUrl !== undefined ? props.mandateVersion.activeFor.organization.logoUrl : undefined,
            website: props.mandateVersion.activeFor.organization.website !== undefined ? props.mandateVersion.activeFor.organization.website : undefined,
            businessType: props.mandateVersion.activeFor.organization.businessType !== undefined ? props.mandateVersion.activeFor.organization.businessType : undefined,
            emailDomains: props.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.activeFor.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.activeFor.organization.jurisdiction !== undefined ? props.mandateVersion.activeFor.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? props.mandateVersion.activeFor.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.activeFor.organization.description !== undefined ? props.mandateVersion.activeFor.organization.description : undefined,
            tradingDefaults: props.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? props.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.activeFor.organization.deletedAt !== undefined ? props.mandateVersion.activeFor.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.activeFor.fund ? 
      typeof props.mandateVersion.activeFor.fund === 'object' && Object.keys(props.mandateVersion.activeFor.fund).length === 1 && (Object.keys(props.mandateVersion.activeFor.fund)[0] === 'id' || Object.keys(props.mandateVersion.activeFor.fund)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.activeFor.fund.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.activeFor.fund.id !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.id
              } : undefined,
            name: props.mandateVersion.activeFor.fund.name !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.name
              } : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.slug
              } : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.status
              } : undefined,
            organizationId: props.mandateVersion.activeFor.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.organizationId
              } : undefined,
            managerId: props.mandateVersion.activeFor.fund.managerId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.managerId
              } : undefined,
            operatorId: props.mandateVersion.activeFor.fund.operatorId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.operatorId
              } : undefined,
          },
          update: {
            id: props.mandateVersion.activeFor.fund.id !== undefined ? {
                set: props.mandateVersion.activeFor.fund.id
              } : undefined,
            name: props.mandateVersion.activeFor.fund.name !== undefined ? {
                set: props.mandateVersion.activeFor.fund.name
              } : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? {
                set: props.mandateVersion.activeFor.fund.slug
              } : undefined,
            description: props.mandateVersion.activeFor.fund.description !== undefined ? {
                set: props.mandateVersion.activeFor.fund.description
              } : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? {
                set: props.mandateVersion.activeFor.fund.status
              } : undefined,
            currency: props.mandateVersion.activeFor.fund.currency !== undefined ? {
                set: props.mandateVersion.activeFor.fund.currency
              } : undefined,
            inceptionDate: props.mandateVersion.activeFor.fund.inceptionDate !== undefined ? {
                set: props.mandateVersion.activeFor.fund.inceptionDate
              } : undefined,
            aum: props.mandateVersion.activeFor.fund.aum !== undefined ? {
                set: props.mandateVersion.activeFor.fund.aum
              } : undefined,
            navPerShare: props.mandateVersion.activeFor.fund.navPerShare !== undefined ? {
                set: props.mandateVersion.activeFor.fund.navPerShare
              } : undefined,
            sharesOutstanding: props.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? {
                set: props.mandateVersion.activeFor.fund.sharesOutstanding
              } : undefined,
            highWaterMarkNav: props.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? {
                set: props.mandateVersion.activeFor.fund.highWaterMarkNav
              } : undefined,
            fees: props.mandateVersion.activeFor.fund.fees !== undefined ? props.mandateVersion.activeFor.fund.fees : undefined,
            terms: props.mandateVersion.activeFor.fund.terms !== undefined ? props.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: props.mandateVersion.activeFor.fund.regulatory !== undefined ? props.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.activeFor.fund.serviceProviders !== undefined ? props.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? props.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.activeFor.fund.deletedAt !== undefined ? {
                set: props.mandateVersion.activeFor.fund.deletedAt
              } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.fund.name !== undefined ? props.mandateVersion.activeFor.fund.name : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? props.mandateVersion.activeFor.fund.slug : undefined,
            description: props.mandateVersion.activeFor.fund.description !== undefined ? props.mandateVersion.activeFor.fund.description : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? props.mandateVersion.activeFor.fund.status : undefined,
            currency: props.mandateVersion.activeFor.fund.currency !== undefined ? props.mandateVersion.activeFor.fund.currency : undefined,
            inceptionDate: props.mandateVersion.activeFor.fund.inceptionDate !== undefined ? props.mandateVersion.activeFor.fund.inceptionDate : undefined,
            aum: props.mandateVersion.activeFor.fund.aum !== undefined ? props.mandateVersion.activeFor.fund.aum : undefined,
            navPerShare: props.mandateVersion.activeFor.fund.navPerShare !== undefined ? props.mandateVersion.activeFor.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? props.mandateVersion.activeFor.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? props.mandateVersion.activeFor.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.activeFor.fund.fees !== undefined ? props.mandateVersion.activeFor.fund.fees : undefined,
            terms: props.mandateVersion.activeFor.fund.terms !== undefined ? props.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: props.mandateVersion.activeFor.fund.regulatory !== undefined ? props.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.activeFor.fund.serviceProviders !== undefined ? props.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? props.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.activeFor.fund.deletedAt !== undefined ? props.mandateVersion.activeFor.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.activeFor.owner ? 
      typeof props.mandateVersion.activeFor.owner === 'object' && Object.keys(props.mandateVersion.activeFor.owner).length === 1 && (Object.keys(props.mandateVersion.activeFor.owner)[0] === 'id' || Object.keys(props.mandateVersion.activeFor.owner)[0] === 'symbol')
? {
      connect: {
        id: props.mandateVersion.activeFor.owner.id
      }
} : { upsert: {
          where: {
            id: props.mandateVersion.activeFor.owner.id !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.id
              } : undefined,
            name: props.mandateVersion.activeFor.owner.name !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.name
              } : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.email
              } : undefined,
            customerId: props.mandateVersion.activeFor.owner.customerId !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.customerId
              } : undefined,
          },
          update: {
            id: props.mandateVersion.activeFor.owner.id !== undefined ? {
                set: props.mandateVersion.activeFor.owner.id
              } : undefined,
            name: props.mandateVersion.activeFor.owner.name !== undefined ? {
                set: props.mandateVersion.activeFor.owner.name
              } : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? {
                set: props.mandateVersion.activeFor.owner.email
              } : undefined,
            emailVerified: props.mandateVersion.activeFor.owner.emailVerified !== undefined ? {
                set: props.mandateVersion.activeFor.owner.emailVerified
              } : undefined,
            image: props.mandateVersion.activeFor.owner.image !== undefined ? {
                set: props.mandateVersion.activeFor.owner.image
              } : undefined,
            avatarUrl: props.mandateVersion.activeFor.owner.avatarUrl !== undefined ? {
                set: props.mandateVersion.activeFor.owner.avatarUrl
              } : undefined,
            onboardingComplete: props.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? {
                set: props.mandateVersion.activeFor.owner.onboardingComplete
              } : undefined,
            signupCategory: props.mandateVersion.activeFor.owner.signupCategory !== undefined ? {
                set: props.mandateVersion.activeFor.owner.signupCategory
              } : undefined,
            deletedAt: props.mandateVersion.activeFor.owner.deletedAt !== undefined ? {
                set: props.mandateVersion.activeFor.owner.deletedAt
              } : undefined,
            role: props.mandateVersion.activeFor.owner.role !== undefined ? {
                set: props.mandateVersion.activeFor.owner.role
              } : undefined,
            bio: props.mandateVersion.activeFor.owner.bio !== undefined ? {
                set: props.mandateVersion.activeFor.owner.bio
              } : undefined,
            jobTitle: props.mandateVersion.activeFor.owner.jobTitle !== undefined ? {
                set: props.mandateVersion.activeFor.owner.jobTitle
              } : undefined,
            currentAccount: props.mandateVersion.activeFor.owner.currentAccount !== undefined ? {
                set: props.mandateVersion.activeFor.owner.currentAccount
              } : undefined,
            plan: props.mandateVersion.activeFor.owner.plan !== undefined ? {
                set: props.mandateVersion.activeFor.owner.plan
              } : undefined,
            openaiAPIKey: props.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? {
                set: props.mandateVersion.activeFor.owner.openaiAPIKey
              } : undefined,
            openaiModel: props.mandateVersion.activeFor.owner.openaiModel !== undefined ? {
                set: props.mandateVersion.activeFor.owner.openaiModel
              } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.owner.name !== undefined ? props.mandateVersion.activeFor.owner.name : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            emailVerified: props.mandateVersion.activeFor.owner.emailVerified !== undefined ? props.mandateVersion.activeFor.owner.emailVerified : undefined,
            image: props.mandateVersion.activeFor.owner.image !== undefined ? props.mandateVersion.activeFor.owner.image : undefined,
            avatarUrl: props.mandateVersion.activeFor.owner.avatarUrl !== undefined ? props.mandateVersion.activeFor.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? props.mandateVersion.activeFor.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.activeFor.owner.signupCategory !== undefined ? props.mandateVersion.activeFor.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.activeFor.owner.deletedAt !== undefined ? props.mandateVersion.activeFor.owner.deletedAt : undefined,
            role: props.mandateVersion.activeFor.owner.role !== undefined ? props.mandateVersion.activeFor.owner.role : undefined,
            bio: props.mandateVersion.activeFor.owner.bio !== undefined ? props.mandateVersion.activeFor.owner.bio : undefined,
            jobTitle: props.mandateVersion.activeFor.owner.jobTitle !== undefined ? props.mandateVersion.activeFor.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.activeFor.owner.currentAccount !== undefined ? props.mandateVersion.activeFor.owner.currentAccount : undefined,
            plan: props.mandateVersion.activeFor.owner.plan !== undefined ? props.mandateVersion.activeFor.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? props.mandateVersion.activeFor.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.activeFor.owner.openaiModel !== undefined ? props.mandateVersion.activeFor.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      versions: props.mandateVersion.activeFor.versions ? 
      Array.isArray(props.mandateVersion.activeFor.versions) && props.mandateVersion.activeFor.versions.length > 0 && props.mandateVersion.activeFor.versions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.mandateVersion.activeFor.versions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.mandateVersion.activeFor.versions.map((item) => ({
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
        },
        create: {
          scopeKind: props.mandateVersion.activeFor.scopeKind !== undefined ? props.mandateVersion.activeFor.scopeKind : undefined,
          klass: props.mandateVersion.activeFor.klass !== undefined ? props.mandateVersion.activeFor.klass : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? props.mandateVersion.activeFor.name : undefined,
          personaScope: props.mandateVersion.activeFor.personaScope !== undefined ? props.mandateVersion.activeFor.personaScope : undefined,
          deletedAt: props.mandateVersion.activeFor.deletedAt !== undefined ? props.mandateVersion.activeFor.deletedAt : undefined,
      organization: props.mandateVersion.activeFor.organization ? 
        typeof props.mandateVersion.activeFor.organization === 'object' && Object.keys(props.mandateVersion.activeFor.organization).length === 1 && Object.keys(props.mandateVersion.activeFor.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.organization.id !== undefined ? props.mandateVersion.activeFor.organization.id : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            name: props.mandateVersion.activeFor.organization.name !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.organization.name !== undefined ? props.mandateVersion.activeFor.organization.name : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            logoUrl: props.mandateVersion.activeFor.organization.logoUrl !== undefined ? props.mandateVersion.activeFor.organization.logoUrl : undefined,
            website: props.mandateVersion.activeFor.organization.website !== undefined ? props.mandateVersion.activeFor.organization.website : undefined,
            businessType: props.mandateVersion.activeFor.organization.businessType !== undefined ? props.mandateVersion.activeFor.organization.businessType : undefined,
            emailDomains: props.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.activeFor.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.activeFor.organization.jurisdiction !== undefined ? props.mandateVersion.activeFor.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? props.mandateVersion.activeFor.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.activeFor.organization.description !== undefined ? props.mandateVersion.activeFor.organization.description : undefined,
            tradingDefaults: props.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? props.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.activeFor.organization.deletedAt !== undefined ? props.mandateVersion.activeFor.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.activeFor.fund ? 
        typeof props.mandateVersion.activeFor.fund === 'object' && Object.keys(props.mandateVersion.activeFor.fund).length === 1 && Object.keys(props.mandateVersion.activeFor.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.fund.id !== undefined ? props.mandateVersion.activeFor.fund.id : undefined,
            name: props.mandateVersion.activeFor.fund.name !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.name 
               } : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.slug 
               } : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.activeFor.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.fund.name !== undefined ? props.mandateVersion.activeFor.fund.name : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? props.mandateVersion.activeFor.fund.slug : undefined,
            description: props.mandateVersion.activeFor.fund.description !== undefined ? props.mandateVersion.activeFor.fund.description : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? props.mandateVersion.activeFor.fund.status : undefined,
            currency: props.mandateVersion.activeFor.fund.currency !== undefined ? props.mandateVersion.activeFor.fund.currency : undefined,
            inceptionDate: props.mandateVersion.activeFor.fund.inceptionDate !== undefined ? props.mandateVersion.activeFor.fund.inceptionDate : undefined,
            aum: props.mandateVersion.activeFor.fund.aum !== undefined ? props.mandateVersion.activeFor.fund.aum : undefined,
            navPerShare: props.mandateVersion.activeFor.fund.navPerShare !== undefined ? props.mandateVersion.activeFor.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? props.mandateVersion.activeFor.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? props.mandateVersion.activeFor.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.activeFor.fund.fees !== undefined ? props.mandateVersion.activeFor.fund.fees : undefined,
            terms: props.mandateVersion.activeFor.fund.terms !== undefined ? props.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: props.mandateVersion.activeFor.fund.regulatory !== undefined ? props.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.activeFor.fund.serviceProviders !== undefined ? props.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? props.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.activeFor.fund.deletedAt !== undefined ? props.mandateVersion.activeFor.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.activeFor.owner ? 
        typeof props.mandateVersion.activeFor.owner === 'object' && Object.keys(props.mandateVersion.activeFor.owner).length === 1 && Object.keys(props.mandateVersion.activeFor.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.owner.id !== undefined ? props.mandateVersion.activeFor.owner.id : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            name: props.mandateVersion.activeFor.owner.name !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.owner.name !== undefined ? props.mandateVersion.activeFor.owner.name : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            emailVerified: props.mandateVersion.activeFor.owner.emailVerified !== undefined ? props.mandateVersion.activeFor.owner.emailVerified : undefined,
            image: props.mandateVersion.activeFor.owner.image !== undefined ? props.mandateVersion.activeFor.owner.image : undefined,
            avatarUrl: props.mandateVersion.activeFor.owner.avatarUrl !== undefined ? props.mandateVersion.activeFor.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? props.mandateVersion.activeFor.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.activeFor.owner.signupCategory !== undefined ? props.mandateVersion.activeFor.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.activeFor.owner.deletedAt !== undefined ? props.mandateVersion.activeFor.owner.deletedAt : undefined,
            role: props.mandateVersion.activeFor.owner.role !== undefined ? props.mandateVersion.activeFor.owner.role : undefined,
            bio: props.mandateVersion.activeFor.owner.bio !== undefined ? props.mandateVersion.activeFor.owner.bio : undefined,
            jobTitle: props.mandateVersion.activeFor.owner.jobTitle !== undefined ? props.mandateVersion.activeFor.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.activeFor.owner.currentAccount !== undefined ? props.mandateVersion.activeFor.owner.currentAccount : undefined,
            plan: props.mandateVersion.activeFor.owner.plan !== undefined ? props.mandateVersion.activeFor.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? props.mandateVersion.activeFor.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.activeFor.owner.openaiModel !== undefined ? props.mandateVersion.activeFor.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      versions: props.mandateVersion.activeFor.versions ? 
        Array.isArray(props.mandateVersion.activeFor.versions) && props.mandateVersion.activeFor.versions.length > 0 &&  props.mandateVersion.activeFor.versions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.activeFor.versions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.activeFor.versions.map((item) => ({
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
        },
      }
    } : undefined,
      },
      create: {
        versionLabel: props.mandateVersion.versionLabel !== undefined ? props.mandateVersion.versionLabel : undefined,
        versionSeq: props.mandateVersion.versionSeq !== undefined ? props.mandateVersion.versionSeq : undefined,
        status: props.mandateVersion.status !== undefined ? props.mandateVersion.status : undefined,
        summary: props.mandateVersion.summary !== undefined ? props.mandateVersion.summary : undefined,
        charterBody: props.mandateVersion.charterBody !== undefined ? props.mandateVersion.charterBody : undefined,
    mandate: props.mandateVersion.mandate ? 
      typeof props.mandateVersion.mandate === 'object' && Object.keys(props.mandateVersion.mandate).length === 1 && Object.keys(props.mandateVersion.mandate)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.mandate.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.mandate.id !== undefined ? props.mandateVersion.mandate.id : undefined,
          activeVersionId: props.mandateVersion.mandate.activeVersionId !== undefined ? props.mandateVersion.mandate.activeVersionId : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? {
              equals: props.mandateVersion.mandate.name 
             } : undefined,
          organizationId: props.mandateVersion.mandate.organizationId !== undefined ? {
              equals: props.mandateVersion.mandate.organizationId 
             } : undefined,
        },
        create: {
          scopeKind: props.mandateVersion.mandate.scopeKind !== undefined ? props.mandateVersion.mandate.scopeKind : undefined,
          klass: props.mandateVersion.mandate.klass !== undefined ? props.mandateVersion.mandate.klass : undefined,
          name: props.mandateVersion.mandate.name !== undefined ? props.mandateVersion.mandate.name : undefined,
          personaScope: props.mandateVersion.mandate.personaScope !== undefined ? props.mandateVersion.mandate.personaScope : undefined,
          deletedAt: props.mandateVersion.mandate.deletedAt !== undefined ? props.mandateVersion.mandate.deletedAt : undefined,
      organization: props.mandateVersion.mandate.organization ? 
        typeof props.mandateVersion.mandate.organization === 'object' && Object.keys(props.mandateVersion.mandate.organization).length === 1 && Object.keys(props.mandateVersion.mandate.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.organization.id !== undefined ? props.mandateVersion.mandate.organization.id : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            name: props.mandateVersion.mandate.organization.name !== undefined ? {
                equals: props.mandateVersion.mandate.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.organization.name !== undefined ? props.mandateVersion.mandate.organization.name : undefined,
            slug: props.mandateVersion.mandate.organization.slug !== undefined ? props.mandateVersion.mandate.organization.slug : undefined,
            logoUrl: props.mandateVersion.mandate.organization.logoUrl !== undefined ? props.mandateVersion.mandate.organization.logoUrl : undefined,
            website: props.mandateVersion.mandate.organization.website !== undefined ? props.mandateVersion.mandate.organization.website : undefined,
            businessType: props.mandateVersion.mandate.organization.businessType !== undefined ? props.mandateVersion.mandate.organization.businessType : undefined,
            emailDomains: props.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.mandate.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.mandate.organization.jurisdiction !== undefined ? props.mandateVersion.mandate.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? props.mandateVersion.mandate.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.mandate.organization.description !== undefined ? props.mandateVersion.mandate.organization.description : undefined,
            tradingDefaults: props.mandateVersion.mandate.organization.tradingDefaults !== undefined ? props.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.mandate.organization.deletedAt !== undefined ? props.mandateVersion.mandate.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.mandate.fund ? 
        typeof props.mandateVersion.mandate.fund === 'object' && Object.keys(props.mandateVersion.mandate.fund).length === 1 && Object.keys(props.mandateVersion.mandate.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.fund.id !== undefined ? props.mandateVersion.mandate.fund.id : undefined,
            name: props.mandateVersion.mandate.fund.name !== undefined ? {
                equals: props.mandateVersion.mandate.fund.name 
               } : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? {
                equals: props.mandateVersion.mandate.fund.slug 
               } : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? {
                equals: props.mandateVersion.mandate.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.mandate.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.mandate.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.fund.name !== undefined ? props.mandateVersion.mandate.fund.name : undefined,
            slug: props.mandateVersion.mandate.fund.slug !== undefined ? props.mandateVersion.mandate.fund.slug : undefined,
            description: props.mandateVersion.mandate.fund.description !== undefined ? props.mandateVersion.mandate.fund.description : undefined,
            status: props.mandateVersion.mandate.fund.status !== undefined ? props.mandateVersion.mandate.fund.status : undefined,
            currency: props.mandateVersion.mandate.fund.currency !== undefined ? props.mandateVersion.mandate.fund.currency : undefined,
            inceptionDate: props.mandateVersion.mandate.fund.inceptionDate !== undefined ? props.mandateVersion.mandate.fund.inceptionDate : undefined,
            aum: props.mandateVersion.mandate.fund.aum !== undefined ? props.mandateVersion.mandate.fund.aum : undefined,
            navPerShare: props.mandateVersion.mandate.fund.navPerShare !== undefined ? props.mandateVersion.mandate.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? props.mandateVersion.mandate.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? props.mandateVersion.mandate.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.mandate.fund.fees !== undefined ? props.mandateVersion.mandate.fund.fees : undefined,
            terms: props.mandateVersion.mandate.fund.terms !== undefined ? props.mandateVersion.mandate.fund.terms : undefined,
            regulatory: props.mandateVersion.mandate.fund.regulatory !== undefined ? props.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.mandate.fund.serviceProviders !== undefined ? props.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.mandate.fund.tradingOverrides !== undefined ? props.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.mandate.fund.deletedAt !== undefined ? props.mandateVersion.mandate.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.mandate.owner ? 
        typeof props.mandateVersion.mandate.owner === 'object' && Object.keys(props.mandateVersion.mandate.owner).length === 1 && Object.keys(props.mandateVersion.mandate.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.owner.id !== undefined ? props.mandateVersion.mandate.owner.id : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            name: props.mandateVersion.mandate.owner.name !== undefined ? {
                equals: props.mandateVersion.mandate.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.mandate.owner.name !== undefined ? props.mandateVersion.mandate.owner.name : undefined,
            email: props.mandateVersion.mandate.owner.email !== undefined ? props.mandateVersion.mandate.owner.email : undefined,
            emailVerified: props.mandateVersion.mandate.owner.emailVerified !== undefined ? props.mandateVersion.mandate.owner.emailVerified : undefined,
            image: props.mandateVersion.mandate.owner.image !== undefined ? props.mandateVersion.mandate.owner.image : undefined,
            avatarUrl: props.mandateVersion.mandate.owner.avatarUrl !== undefined ? props.mandateVersion.mandate.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.mandate.owner.onboardingComplete !== undefined ? props.mandateVersion.mandate.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.mandate.owner.signupCategory !== undefined ? props.mandateVersion.mandate.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.mandate.owner.deletedAt !== undefined ? props.mandateVersion.mandate.owner.deletedAt : undefined,
            role: props.mandateVersion.mandate.owner.role !== undefined ? props.mandateVersion.mandate.owner.role : undefined,
            bio: props.mandateVersion.mandate.owner.bio !== undefined ? props.mandateVersion.mandate.owner.bio : undefined,
            jobTitle: props.mandateVersion.mandate.owner.jobTitle !== undefined ? props.mandateVersion.mandate.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.mandate.owner.currentAccount !== undefined ? props.mandateVersion.mandate.owner.currentAccount : undefined,
            plan: props.mandateVersion.mandate.owner.plan !== undefined ? props.mandateVersion.mandate.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? props.mandateVersion.mandate.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.mandate.owner.openaiModel !== undefined ? props.mandateVersion.mandate.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      activeVersion: props.mandateVersion.mandate.activeVersion ? 
        typeof props.mandateVersion.mandate.activeVersion === 'object' && Object.keys(props.mandateVersion.mandate.activeVersion).length === 1 && Object.keys(props.mandateVersion.mandate.activeVersion)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.mandate.activeVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.mandate.activeVersion.id !== undefined ? props.mandateVersion.mandate.activeVersion.id : undefined,
            mandateId: props.mandateVersion.mandate.activeVersion.mandateId !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.mandateId 
               } : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? {
                equals: props.mandateVersion.mandate.activeVersion.status 
               } : undefined,
          },
          create: {
            versionLabel: props.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? props.mandateVersion.mandate.activeVersion.versionLabel : undefined,
            versionSeq: props.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? props.mandateVersion.mandate.activeVersion.versionSeq : undefined,
            status: props.mandateVersion.mandate.activeVersion.status !== undefined ? props.mandateVersion.mandate.activeVersion.status : undefined,
            summary: props.mandateVersion.mandate.activeVersion.summary !== undefined ? props.mandateVersion.mandate.activeVersion.summary : undefined,
            charterBody: props.mandateVersion.mandate.activeVersion.charterBody !== undefined ? props.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
        }
      } : undefined,
        },
      }
    } : undefined,
    authoredBy: props.mandateVersion.authoredBy ? 
      typeof props.mandateVersion.authoredBy === 'object' && Object.keys(props.mandateVersion.authoredBy).length === 1 && Object.keys(props.mandateVersion.authoredBy)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.authoredBy.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.authoredBy.id !== undefined ? props.mandateVersion.authoredBy.id : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? props.mandateVersion.authoredBy.email : undefined,
          name: props.mandateVersion.authoredBy.name !== undefined ? {
              equals: props.mandateVersion.authoredBy.name 
             } : undefined,
        },
        create: {
          name: props.mandateVersion.authoredBy.name !== undefined ? props.mandateVersion.authoredBy.name : undefined,
          email: props.mandateVersion.authoredBy.email !== undefined ? props.mandateVersion.authoredBy.email : undefined,
          emailVerified: props.mandateVersion.authoredBy.emailVerified !== undefined ? props.mandateVersion.authoredBy.emailVerified : undefined,
          image: props.mandateVersion.authoredBy.image !== undefined ? props.mandateVersion.authoredBy.image : undefined,
          avatarUrl: props.mandateVersion.authoredBy.avatarUrl !== undefined ? props.mandateVersion.authoredBy.avatarUrl : undefined,
          onboardingComplete: props.mandateVersion.authoredBy.onboardingComplete !== undefined ? props.mandateVersion.authoredBy.onboardingComplete : undefined,
          signupCategory: props.mandateVersion.authoredBy.signupCategory !== undefined ? props.mandateVersion.authoredBy.signupCategory : undefined,
          deletedAt: props.mandateVersion.authoredBy.deletedAt !== undefined ? props.mandateVersion.authoredBy.deletedAt : undefined,
          role: props.mandateVersion.authoredBy.role !== undefined ? props.mandateVersion.authoredBy.role : undefined,
          bio: props.mandateVersion.authoredBy.bio !== undefined ? props.mandateVersion.authoredBy.bio : undefined,
          jobTitle: props.mandateVersion.authoredBy.jobTitle !== undefined ? props.mandateVersion.authoredBy.jobTitle : undefined,
          currentAccount: props.mandateVersion.authoredBy.currentAccount !== undefined ? props.mandateVersion.authoredBy.currentAccount : undefined,
          plan: props.mandateVersion.authoredBy.plan !== undefined ? props.mandateVersion.authoredBy.plan : undefined,
          openaiAPIKey: props.mandateVersion.authoredBy.openaiAPIKey !== undefined ? props.mandateVersion.authoredBy.openaiAPIKey : undefined,
          openaiModel: props.mandateVersion.authoredBy.openaiModel !== undefined ? props.mandateVersion.authoredBy.openaiModel : undefined,
      customer: props.mandateVersion.authoredBy.customer ? 
        typeof props.mandateVersion.authoredBy.customer === 'object' && Object.keys(props.mandateVersion.authoredBy.customer).length === 1 && Object.keys(props.mandateVersion.authoredBy.customer)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.customer.id !== undefined ? props.mandateVersion.authoredBy.customer.id : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.authUserId 
               } : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.name 
               } : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                equals: props.mandateVersion.authoredBy.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: props.mandateVersion.authoredBy.customer.authUserId !== undefined ? props.mandateVersion.authoredBy.customer.authUserId : undefined,
            name: props.mandateVersion.authoredBy.customer.name !== undefined ? props.mandateVersion.authoredBy.customer.name : undefined,
            plan: props.mandateVersion.authoredBy.customer.plan !== undefined ? props.mandateVersion.authoredBy.customer.plan : undefined,
            stripeCustomerId: props.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? props.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: props.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? props.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            stripePriceId: props.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? props.mandateVersion.authoredBy.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? props.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: props.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? props.mandateVersion.authoredBy.customer.jurisdiction : undefined,
            riskProfile: props.mandateVersion.authoredBy.customer.riskProfile !== undefined ? props.mandateVersion.authoredBy.customer.riskProfile : undefined,
            amlStatus: props.mandateVersion.authoredBy.customer.amlStatus !== undefined ? props.mandateVersion.authoredBy.customer.amlStatus : undefined,
            lastKycUpdate: props.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? props.mandateVersion.authoredBy.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: props.mandateVersion.authoredBy.accounts ? 
        Array.isArray(props.mandateVersion.authoredBy.accounts) && props.mandateVersion.authoredBy.accounts.length > 0 &&  props.mandateVersion.authoredBy.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accounts.map((item) => ({
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
      sessions: props.mandateVersion.authoredBy.sessions ? 
        Array.isArray(props.mandateVersion.authoredBy.sessions) && props.mandateVersion.authoredBy.sessions.length > 0 &&  props.mandateVersion.authoredBy.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.sessions.map((item) => ({
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
      authenticators: props.mandateVersion.authoredBy.authenticators ? 
        Array.isArray(props.mandateVersion.authoredBy.authenticators) && props.mandateVersion.authoredBy.authenticators.length > 0 &&  props.mandateVersion.authoredBy.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.authenticators.map((item) => ({
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
      alpacaAccounts: props.mandateVersion.authoredBy.alpacaAccounts ? 
        Array.isArray(props.mandateVersion.authoredBy.alpacaAccounts) && props.mandateVersion.authoredBy.alpacaAccounts.length > 0 &&  props.mandateVersion.authoredBy.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
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
      linkedProviders: props.mandateVersion.authoredBy.linkedProviders ? 
        Array.isArray(props.mandateVersion.authoredBy.linkedProviders) && props.mandateVersion.authoredBy.linkedProviders.length > 0 &&  props.mandateVersion.authoredBy.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.linkedProviders.map((item) => ({
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
      accountLinkingRequests: props.mandateVersion.authoredBy.accountLinkingRequests ? 
        Array.isArray(props.mandateVersion.authoredBy.accountLinkingRequests) && props.mandateVersion.authoredBy.accountLinkingRequests.length > 0 &&  props.mandateVersion.authoredBy.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
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
      reviewedWaitlistEntries: props.mandateVersion.authoredBy.reviewedWaitlistEntries ? 
        Array.isArray(props.mandateVersion.authoredBy.reviewedWaitlistEntries) && props.mandateVersion.authoredBy.reviewedWaitlistEntries.length > 0 &&  props.mandateVersion.authoredBy.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
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
      llmConfiguration: props.mandateVersion.authoredBy.llmConfiguration ? 
        typeof props.mandateVersion.authoredBy.llmConfiguration === 'object' && Object.keys(props.mandateVersion.authoredBy.llmConfiguration).length === 1 && Object.keys(props.mandateVersion.authoredBy.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.id : undefined,
            userId: props.mandateVersion.authoredBy.llmConfiguration.userId !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: props.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.defaultProvider : undefined,
            miniProvider: props.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniProvider : undefined,
            normalProvider: props.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalProvider : undefined,
            advancedProvider: props.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedProvider : undefined,
            miniModel: props.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.miniModel : undefined,
            normalModel: props.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.normalModel : undefined,
            advancedModel: props.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.advancedModel : undefined,
            openaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? props.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: props.mandateVersion.authoredBy.orgMemberships ? 
        Array.isArray(props.mandateVersion.authoredBy.orgMemberships) && props.mandateVersion.authoredBy.orgMemberships.length > 0 &&  props.mandateVersion.authoredBy.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.orgMemberships.map((item) => ({
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
      fundAssignments: props.mandateVersion.authoredBy.fundAssignments ? 
        Array.isArray(props.mandateVersion.authoredBy.fundAssignments) && props.mandateVersion.authoredBy.fundAssignments.length > 0 &&  props.mandateVersion.authoredBy.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.fundAssignments.map((item) => ({
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
      managedFunds: props.mandateVersion.authoredBy.managedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.managedFunds) && props.mandateVersion.authoredBy.managedFunds.length > 0 &&  props.mandateVersion.authoredBy.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.managedFunds.map((item) => ({
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
      operatedFunds: props.mandateVersion.authoredBy.operatedFunds ? 
        Array.isArray(props.mandateVersion.authoredBy.operatedFunds) && props.mandateVersion.authoredBy.operatedFunds.length > 0 &&  props.mandateVersion.authoredBy.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.operatedFunds.map((item) => ({
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
      ownedMandates: props.mandateVersion.authoredBy.ownedMandates ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedMandates) && props.mandateVersion.authoredBy.ownedMandates.length > 0 &&  props.mandateVersion.authoredBy.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedMandates.map((item) => ({
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
      mandateApprovalsDecided: props.mandateVersion.authoredBy.mandateApprovalsDecided ? 
        Array.isArray(props.mandateVersion.authoredBy.mandateApprovalsDecided) && props.mandateVersion.authoredBy.mandateApprovalsDecided.length > 0 &&  props.mandateVersion.authoredBy.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
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
      investorProfiles: props.mandateVersion.authoredBy.investorProfiles ? 
        Array.isArray(props.mandateVersion.authoredBy.investorProfiles) && props.mandateVersion.authoredBy.investorProfiles.length > 0 &&  props.mandateVersion.authoredBy.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.investorProfiles.map((item) => ({
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
      notificationDeliveries: props.mandateVersion.authoredBy.notificationDeliveries ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationDeliveries) && props.mandateVersion.authoredBy.notificationDeliveries.length > 0 &&  props.mandateVersion.authoredBy.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
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
      notificationPreferences: props.mandateVersion.authoredBy.notificationPreferences ? 
        Array.isArray(props.mandateVersion.authoredBy.notificationPreferences) && props.mandateVersion.authoredBy.notificationPreferences.length > 0 &&  props.mandateVersion.authoredBy.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
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
      ownedStrategies: props.mandateVersion.authoredBy.ownedStrategies ? 
        Array.isArray(props.mandateVersion.authoredBy.ownedStrategies) && props.mandateVersion.authoredBy.ownedStrategies.length > 0 &&  props.mandateVersion.authoredBy.ownedStrategies.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            key: item.key !== undefined ? item.key : undefined,
          },
          create: {
            key: item.key !== undefined ? item.key : undefined,
            displayName: item.displayName !== undefined ? item.displayName : undefined,
            description: item.description !== undefined ? item.description : undefined,
            origin: item.origin !== undefined ? item.origin : undefined,
            lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
            manifestHash: item.manifestHash !== undefined ? item.manifestHash : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    approvals: props.mandateVersion.approvals ? 
      Array.isArray(props.mandateVersion.approvals) && props.mandateVersion.approvals.length > 0 &&  props.mandateVersion.approvals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.mandateVersion.approvals.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.mandateVersion.approvals.map((item) => ({
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
      decidedBy: item.decidedBy ? 
        typeof item.decidedBy === 'object' && Object.keys(item.decidedBy).length === 1 && Object.keys(item.decidedBy)[0] === 'id'
    ? { connect: {
            id: item.decidedBy.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.decidedBy.id !== undefined ? item.decidedBy.id : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            name: item.decidedBy.name !== undefined ? {
                equals: item.decidedBy.name 
               } : undefined,
          },
          create: {
            name: item.decidedBy.name !== undefined ? item.decidedBy.name : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? item.decidedBy.emailVerified : undefined,
            image: item.decidedBy.image !== undefined ? item.decidedBy.image : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? item.decidedBy.avatarUrl : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? item.decidedBy.onboardingComplete : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? item.decidedBy.signupCategory : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? item.decidedBy.deletedAt : undefined,
            role: item.decidedBy.role !== undefined ? item.decidedBy.role : undefined,
            bio: item.decidedBy.bio !== undefined ? item.decidedBy.bio : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? item.decidedBy.jobTitle : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? item.decidedBy.currentAccount : undefined,
            plan: item.decidedBy.plan !== undefined ? item.decidedBy.plan : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? item.decidedBy.openaiAPIKey : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? item.decidedBy.openaiModel : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    activeFor: props.mandateVersion.activeFor ? 
      typeof props.mandateVersion.activeFor === 'object' && Object.keys(props.mandateVersion.activeFor).length === 1 && Object.keys(props.mandateVersion.activeFor)[0] === 'id'
    ? { connect: {
          id: props.mandateVersion.activeFor.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.mandateVersion.activeFor.id !== undefined ? props.mandateVersion.activeFor.id : undefined,
          activeVersionId: props.mandateVersion.activeFor.activeVersionId !== undefined ? props.mandateVersion.activeFor.activeVersionId : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? {
              equals: props.mandateVersion.activeFor.name 
             } : undefined,
          organizationId: props.mandateVersion.activeFor.organizationId !== undefined ? {
              equals: props.mandateVersion.activeFor.organizationId 
             } : undefined,
        },
        create: {
          scopeKind: props.mandateVersion.activeFor.scopeKind !== undefined ? props.mandateVersion.activeFor.scopeKind : undefined,
          klass: props.mandateVersion.activeFor.klass !== undefined ? props.mandateVersion.activeFor.klass : undefined,
          name: props.mandateVersion.activeFor.name !== undefined ? props.mandateVersion.activeFor.name : undefined,
          personaScope: props.mandateVersion.activeFor.personaScope !== undefined ? props.mandateVersion.activeFor.personaScope : undefined,
          deletedAt: props.mandateVersion.activeFor.deletedAt !== undefined ? props.mandateVersion.activeFor.deletedAt : undefined,
      organization: props.mandateVersion.activeFor.organization ? 
        typeof props.mandateVersion.activeFor.organization === 'object' && Object.keys(props.mandateVersion.activeFor.organization).length === 1 && Object.keys(props.mandateVersion.activeFor.organization)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.organization.id !== undefined ? props.mandateVersion.activeFor.organization.id : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            name: props.mandateVersion.activeFor.organization.name !== undefined ? {
                equals: props.mandateVersion.activeFor.organization.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.organization.name !== undefined ? props.mandateVersion.activeFor.organization.name : undefined,
            slug: props.mandateVersion.activeFor.organization.slug !== undefined ? props.mandateVersion.activeFor.organization.slug : undefined,
            logoUrl: props.mandateVersion.activeFor.organization.logoUrl !== undefined ? props.mandateVersion.activeFor.organization.logoUrl : undefined,
            website: props.mandateVersion.activeFor.organization.website !== undefined ? props.mandateVersion.activeFor.organization.website : undefined,
            businessType: props.mandateVersion.activeFor.organization.businessType !== undefined ? props.mandateVersion.activeFor.organization.businessType : undefined,
            emailDomains: props.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: props.mandateVersion.activeFor.organization.emailDomains 
               } : undefined,
            jurisdiction: props.mandateVersion.activeFor.organization.jurisdiction !== undefined ? props.mandateVersion.activeFor.organization.jurisdiction : undefined,
            regulatoryStatus: props.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? props.mandateVersion.activeFor.organization.regulatoryStatus : undefined,
            description: props.mandateVersion.activeFor.organization.description !== undefined ? props.mandateVersion.activeFor.organization.description : undefined,
            tradingDefaults: props.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? props.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: props.mandateVersion.activeFor.organization.deletedAt !== undefined ? props.mandateVersion.activeFor.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: props.mandateVersion.activeFor.fund ? 
        typeof props.mandateVersion.activeFor.fund === 'object' && Object.keys(props.mandateVersion.activeFor.fund).length === 1 && Object.keys(props.mandateVersion.activeFor.fund)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.fund.id !== undefined ? props.mandateVersion.activeFor.fund.id : undefined,
            name: props.mandateVersion.activeFor.fund.name !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.name 
               } : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.slug 
               } : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.status 
               } : undefined,
            organizationId: props.mandateVersion.activeFor.fund.organizationId !== undefined ? {
                equals: props.mandateVersion.activeFor.fund.organizationId 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.fund.name !== undefined ? props.mandateVersion.activeFor.fund.name : undefined,
            slug: props.mandateVersion.activeFor.fund.slug !== undefined ? props.mandateVersion.activeFor.fund.slug : undefined,
            description: props.mandateVersion.activeFor.fund.description !== undefined ? props.mandateVersion.activeFor.fund.description : undefined,
            status: props.mandateVersion.activeFor.fund.status !== undefined ? props.mandateVersion.activeFor.fund.status : undefined,
            currency: props.mandateVersion.activeFor.fund.currency !== undefined ? props.mandateVersion.activeFor.fund.currency : undefined,
            inceptionDate: props.mandateVersion.activeFor.fund.inceptionDate !== undefined ? props.mandateVersion.activeFor.fund.inceptionDate : undefined,
            aum: props.mandateVersion.activeFor.fund.aum !== undefined ? props.mandateVersion.activeFor.fund.aum : undefined,
            navPerShare: props.mandateVersion.activeFor.fund.navPerShare !== undefined ? props.mandateVersion.activeFor.fund.navPerShare : undefined,
            sharesOutstanding: props.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? props.mandateVersion.activeFor.fund.sharesOutstanding : undefined,
            highWaterMarkNav: props.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? props.mandateVersion.activeFor.fund.highWaterMarkNav : undefined,
            fees: props.mandateVersion.activeFor.fund.fees !== undefined ? props.mandateVersion.activeFor.fund.fees : undefined,
            terms: props.mandateVersion.activeFor.fund.terms !== undefined ? props.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: props.mandateVersion.activeFor.fund.regulatory !== undefined ? props.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: props.mandateVersion.activeFor.fund.serviceProviders !== undefined ? props.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: props.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? props.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: props.mandateVersion.activeFor.fund.deletedAt !== undefined ? props.mandateVersion.activeFor.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: props.mandateVersion.activeFor.owner ? 
        typeof props.mandateVersion.activeFor.owner === 'object' && Object.keys(props.mandateVersion.activeFor.owner).length === 1 && Object.keys(props.mandateVersion.activeFor.owner)[0] === 'id'
    ? { connect: {
            id: props.mandateVersion.activeFor.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.mandateVersion.activeFor.owner.id !== undefined ? props.mandateVersion.activeFor.owner.id : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            name: props.mandateVersion.activeFor.owner.name !== undefined ? {
                equals: props.mandateVersion.activeFor.owner.name 
               } : undefined,
          },
          create: {
            name: props.mandateVersion.activeFor.owner.name !== undefined ? props.mandateVersion.activeFor.owner.name : undefined,
            email: props.mandateVersion.activeFor.owner.email !== undefined ? props.mandateVersion.activeFor.owner.email : undefined,
            emailVerified: props.mandateVersion.activeFor.owner.emailVerified !== undefined ? props.mandateVersion.activeFor.owner.emailVerified : undefined,
            image: props.mandateVersion.activeFor.owner.image !== undefined ? props.mandateVersion.activeFor.owner.image : undefined,
            avatarUrl: props.mandateVersion.activeFor.owner.avatarUrl !== undefined ? props.mandateVersion.activeFor.owner.avatarUrl : undefined,
            onboardingComplete: props.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? props.mandateVersion.activeFor.owner.onboardingComplete : undefined,
            signupCategory: props.mandateVersion.activeFor.owner.signupCategory !== undefined ? props.mandateVersion.activeFor.owner.signupCategory : undefined,
            deletedAt: props.mandateVersion.activeFor.owner.deletedAt !== undefined ? props.mandateVersion.activeFor.owner.deletedAt : undefined,
            role: props.mandateVersion.activeFor.owner.role !== undefined ? props.mandateVersion.activeFor.owner.role : undefined,
            bio: props.mandateVersion.activeFor.owner.bio !== undefined ? props.mandateVersion.activeFor.owner.bio : undefined,
            jobTitle: props.mandateVersion.activeFor.owner.jobTitle !== undefined ? props.mandateVersion.activeFor.owner.jobTitle : undefined,
            currentAccount: props.mandateVersion.activeFor.owner.currentAccount !== undefined ? props.mandateVersion.activeFor.owner.currentAccount : undefined,
            plan: props.mandateVersion.activeFor.owner.plan !== undefined ? props.mandateVersion.activeFor.owner.plan : undefined,
            openaiAPIKey: props.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? props.mandateVersion.activeFor.owner.openaiAPIKey : undefined,
            openaiModel: props.mandateVersion.activeFor.owner.openaiModel !== undefined ? props.mandateVersion.activeFor.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      versions: props.mandateVersion.activeFor.versions ? 
        Array.isArray(props.mandateVersion.activeFor.versions) && props.mandateVersion.activeFor.versions.length > 0 &&  props.mandateVersion.activeFor.versions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.mandateVersion.activeFor.versions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.mandateVersion.activeFor.versions.map((item) => ({
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
        },
      }
    } : undefined,
      },
    }
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_MANDATERULE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneMandateRule) {
          return response.data.upsertOneMandateRule;
        } else {
          return null as unknown as MandateRuleType;
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
          logger.error("Non-retryable constraint violation in upsertOneMandateRule", {
            operation: 'upsertOneMandateRule',
            model: 'MandateRule',
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
          logger.warn("Database connection error in upsertOneMandateRule, retrying...", {
            operation: 'upsertOneMandateRule',
            model: 'MandateRule',
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
            operation: 'upsertOneMandateRule',
            model: 'MandateRule',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneMandateRule',
            model: 'MandateRule',
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
   * Update multiple MandateRule records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of MandateRule objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: MandateRuleType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_MANDATERULE = gql`
          mutation updateManyMandateRule($data: [MandateRuleCreateManyInput!]!) {
            updateManyMandateRule(data: $data) {
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
  sectionId: prop.sectionId !== undefined ? {
            set: prop.sectionId 
           } : undefined,
  label: prop.label !== undefined ? {
            set: prop.label 
           } : undefined,
  detail: prop.detail !== undefined ? {
            set: prop.detail 
           } : undefined,
  control: prop.control !== undefined ? {
            set: prop.control 
           } : undefined,
  threshold: prop.threshold !== undefined ? {
            set: prop.threshold 
           } : undefined,
  unit: prop.unit !== undefined ? {
            set: prop.unit 
           } : undefined,
  limitKind: prop.limitKind !== undefined ? {
            set: prop.limitKind 
           } : undefined,
  orderIdx: prop.orderIdx !== undefined ? {
            set: prop.orderIdx 
           } : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,
  mandateVersion: prop.mandateVersion ? 
  typeof prop.mandateVersion === 'object' && Object.keys(prop.mandateVersion).length === 1 && (Object.keys(prop.mandateVersion)[0] === 'id' || Object.keys(prop.mandateVersion)[0] === 'symbol')
? {
  connect: {
    id: prop.mandateVersion.id
  }
} : { upsert: {
      where: {
        id: prop.mandateVersion.id !== undefined ? {
            equals: prop.mandateVersion.id
          } : undefined,
        mandateId: prop.mandateVersion.mandateId !== undefined ? {
            equals: prop.mandateVersion.mandateId
          } : undefined,
        status: prop.mandateVersion.status !== undefined ? {
            equals: prop.mandateVersion.status
          } : undefined,
        authoredById: prop.mandateVersion.authoredById !== undefined ? {
            equals: prop.mandateVersion.authoredById
          } : undefined,
      },
      update: {
        id: prop.mandateVersion.id !== undefined ? {
            set: prop.mandateVersion.id
          } : undefined,
        versionLabel: prop.mandateVersion.versionLabel !== undefined ? {
            set: prop.mandateVersion.versionLabel
          } : undefined,
        versionSeq: prop.mandateVersion.versionSeq !== undefined ? {
            set: prop.mandateVersion.versionSeq
          } : undefined,
        status: prop.mandateVersion.status !== undefined ? {
            set: prop.mandateVersion.status
          } : undefined,
        summary: prop.mandateVersion.summary !== undefined ? {
            set: prop.mandateVersion.summary
          } : undefined,
        charterBody: prop.mandateVersion.charterBody !== undefined ? prop.mandateVersion.charterBody : undefined,
    mandate: prop.mandateVersion.mandate ? 
    typeof prop.mandateVersion.mandate === 'object' && Object.keys(prop.mandateVersion.mandate).length === 1 && (Object.keys(prop.mandateVersion.mandate)[0] === 'id' || Object.keys(prop.mandateVersion.mandate)[0] === 'symbol')
? {
    connect: {
      id: prop.mandateVersion.mandate.id
    }
} : { upsert: {
        where: {
          id: prop.mandateVersion.mandate.id !== undefined ? {
              equals: prop.mandateVersion.mandate.id
            } : undefined,
          name: prop.mandateVersion.mandate.name !== undefined ? {
              equals: prop.mandateVersion.mandate.name
            } : undefined,
          organizationId: prop.mandateVersion.mandate.organizationId !== undefined ? {
              equals: prop.mandateVersion.mandate.organizationId
            } : undefined,
          fundId: prop.mandateVersion.mandate.fundId !== undefined ? {
              equals: prop.mandateVersion.mandate.fundId
            } : undefined,
          ownerId: prop.mandateVersion.mandate.ownerId !== undefined ? {
              equals: prop.mandateVersion.mandate.ownerId
            } : undefined,
          activeVersionId: prop.mandateVersion.mandate.activeVersionId !== undefined ? {
              equals: prop.mandateVersion.mandate.activeVersionId
            } : undefined,
        },
        update: {
          id: prop.mandateVersion.mandate.id !== undefined ? {
              set: prop.mandateVersion.mandate.id
            } : undefined,
          scopeKind: prop.mandateVersion.mandate.scopeKind !== undefined ? {
              set: prop.mandateVersion.mandate.scopeKind
            } : undefined,
          klass: prop.mandateVersion.mandate.klass !== undefined ? {
              set: prop.mandateVersion.mandate.klass
            } : undefined,
          name: prop.mandateVersion.mandate.name !== undefined ? {
              set: prop.mandateVersion.mandate.name
            } : undefined,
          personaScope: prop.mandateVersion.mandate.personaScope !== undefined ? {
              set: prop.mandateVersion.mandate.personaScope
            } : undefined,
          deletedAt: prop.mandateVersion.mandate.deletedAt !== undefined ? {
              set: prop.mandateVersion.mandate.deletedAt
            } : undefined,
      organization: prop.mandateVersion.mandate.organization ? 
      typeof prop.mandateVersion.mandate.organization === 'object' && Object.keys(prop.mandateVersion.mandate.organization).length === 1 && (Object.keys(prop.mandateVersion.mandate.organization)[0] === 'id' || Object.keys(prop.mandateVersion.mandate.organization)[0] === 'symbol')
? {
      connect: {
        id: prop.mandateVersion.mandate.organization.id
      }
} : { upsert: {
          where: {
            id: prop.mandateVersion.mandate.organization.id !== undefined ? {
                equals: prop.mandateVersion.mandate.organization.id
              } : undefined,
            name: prop.mandateVersion.mandate.organization.name !== undefined ? {
                equals: prop.mandateVersion.mandate.organization.name
              } : undefined,
            slug: prop.mandateVersion.mandate.organization.slug !== undefined ? {
                equals: prop.mandateVersion.mandate.organization.slug
              } : undefined,
          },
          update: {
            id: prop.mandateVersion.mandate.organization.id !== undefined ? {
                set: prop.mandateVersion.mandate.organization.id
              } : undefined,
            name: prop.mandateVersion.mandate.organization.name !== undefined ? {
                set: prop.mandateVersion.mandate.organization.name
              } : undefined,
            slug: prop.mandateVersion.mandate.organization.slug !== undefined ? {
                set: prop.mandateVersion.mandate.organization.slug
              } : undefined,
            logoUrl: prop.mandateVersion.mandate.organization.logoUrl !== undefined ? {
                set: prop.mandateVersion.mandate.organization.logoUrl
              } : undefined,
            website: prop.mandateVersion.mandate.organization.website !== undefined ? {
                set: prop.mandateVersion.mandate.organization.website
              } : undefined,
            businessType: prop.mandateVersion.mandate.organization.businessType !== undefined ? {
                set: prop.mandateVersion.mandate.organization.businessType
              } : undefined,
            emailDomains: prop.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: prop.mandateVersion.mandate.organization.emailDomains
              } : undefined,
            jurisdiction: prop.mandateVersion.mandate.organization.jurisdiction !== undefined ? {
                set: prop.mandateVersion.mandate.organization.jurisdiction
              } : undefined,
            regulatoryStatus: prop.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? {
                set: prop.mandateVersion.mandate.organization.regulatoryStatus
              } : undefined,
            description: prop.mandateVersion.mandate.organization.description !== undefined ? {
                set: prop.mandateVersion.mandate.organization.description
              } : undefined,
            tradingDefaults: prop.mandateVersion.mandate.organization.tradingDefaults !== undefined ? prop.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: prop.mandateVersion.mandate.organization.deletedAt !== undefined ? {
                set: prop.mandateVersion.mandate.organization.deletedAt
              } : undefined,
          },
          create: {
            name: prop.mandateVersion.mandate.organization.name !== undefined ? prop.mandateVersion.mandate.organization.name : undefined,
            slug: prop.mandateVersion.mandate.organization.slug !== undefined ? prop.mandateVersion.mandate.organization.slug : undefined,
            logoUrl: prop.mandateVersion.mandate.organization.logoUrl !== undefined ? prop.mandateVersion.mandate.organization.logoUrl : undefined,
            website: prop.mandateVersion.mandate.organization.website !== undefined ? prop.mandateVersion.mandate.organization.website : undefined,
            businessType: prop.mandateVersion.mandate.organization.businessType !== undefined ? prop.mandateVersion.mandate.organization.businessType : undefined,
            emailDomains: prop.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: prop.mandateVersion.mandate.organization.emailDomains 
               } : undefined,
            jurisdiction: prop.mandateVersion.mandate.organization.jurisdiction !== undefined ? prop.mandateVersion.mandate.organization.jurisdiction : undefined,
            regulatoryStatus: prop.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? prop.mandateVersion.mandate.organization.regulatoryStatus : undefined,
            description: prop.mandateVersion.mandate.organization.description !== undefined ? prop.mandateVersion.mandate.organization.description : undefined,
            tradingDefaults: prop.mandateVersion.mandate.organization.tradingDefaults !== undefined ? prop.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: prop.mandateVersion.mandate.organization.deletedAt !== undefined ? prop.mandateVersion.mandate.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: prop.mandateVersion.mandate.fund ? 
      typeof prop.mandateVersion.mandate.fund === 'object' && Object.keys(prop.mandateVersion.mandate.fund).length === 1 && (Object.keys(prop.mandateVersion.mandate.fund)[0] === 'id' || Object.keys(prop.mandateVersion.mandate.fund)[0] === 'symbol')
? {
      connect: {
        id: prop.mandateVersion.mandate.fund.id
      }
} : { upsert: {
          where: {
            id: prop.mandateVersion.mandate.fund.id !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.id
              } : undefined,
            name: prop.mandateVersion.mandate.fund.name !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.name
              } : undefined,
            slug: prop.mandateVersion.mandate.fund.slug !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.slug
              } : undefined,
            status: prop.mandateVersion.mandate.fund.status !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.status
              } : undefined,
            organizationId: prop.mandateVersion.mandate.fund.organizationId !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.organizationId
              } : undefined,
            managerId: prop.mandateVersion.mandate.fund.managerId !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.managerId
              } : undefined,
            operatorId: prop.mandateVersion.mandate.fund.operatorId !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.operatorId
              } : undefined,
          },
          update: {
            id: prop.mandateVersion.mandate.fund.id !== undefined ? {
                set: prop.mandateVersion.mandate.fund.id
              } : undefined,
            name: prop.mandateVersion.mandate.fund.name !== undefined ? {
                set: prop.mandateVersion.mandate.fund.name
              } : undefined,
            slug: prop.mandateVersion.mandate.fund.slug !== undefined ? {
                set: prop.mandateVersion.mandate.fund.slug
              } : undefined,
            description: prop.mandateVersion.mandate.fund.description !== undefined ? {
                set: prop.mandateVersion.mandate.fund.description
              } : undefined,
            status: prop.mandateVersion.mandate.fund.status !== undefined ? {
                set: prop.mandateVersion.mandate.fund.status
              } : undefined,
            currency: prop.mandateVersion.mandate.fund.currency !== undefined ? {
                set: prop.mandateVersion.mandate.fund.currency
              } : undefined,
            inceptionDate: prop.mandateVersion.mandate.fund.inceptionDate !== undefined ? {
                set: prop.mandateVersion.mandate.fund.inceptionDate
              } : undefined,
            aum: prop.mandateVersion.mandate.fund.aum !== undefined ? {
                set: prop.mandateVersion.mandate.fund.aum
              } : undefined,
            navPerShare: prop.mandateVersion.mandate.fund.navPerShare !== undefined ? {
                set: prop.mandateVersion.mandate.fund.navPerShare
              } : undefined,
            sharesOutstanding: prop.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? {
                set: prop.mandateVersion.mandate.fund.sharesOutstanding
              } : undefined,
            highWaterMarkNav: prop.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? {
                set: prop.mandateVersion.mandate.fund.highWaterMarkNav
              } : undefined,
            fees: prop.mandateVersion.mandate.fund.fees !== undefined ? prop.mandateVersion.mandate.fund.fees : undefined,
            terms: prop.mandateVersion.mandate.fund.terms !== undefined ? prop.mandateVersion.mandate.fund.terms : undefined,
            regulatory: prop.mandateVersion.mandate.fund.regulatory !== undefined ? prop.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: prop.mandateVersion.mandate.fund.serviceProviders !== undefined ? prop.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: prop.mandateVersion.mandate.fund.tradingOverrides !== undefined ? prop.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: prop.mandateVersion.mandate.fund.deletedAt !== undefined ? {
                set: prop.mandateVersion.mandate.fund.deletedAt
              } : undefined,
          },
          create: {
            name: prop.mandateVersion.mandate.fund.name !== undefined ? prop.mandateVersion.mandate.fund.name : undefined,
            slug: prop.mandateVersion.mandate.fund.slug !== undefined ? prop.mandateVersion.mandate.fund.slug : undefined,
            description: prop.mandateVersion.mandate.fund.description !== undefined ? prop.mandateVersion.mandate.fund.description : undefined,
            status: prop.mandateVersion.mandate.fund.status !== undefined ? prop.mandateVersion.mandate.fund.status : undefined,
            currency: prop.mandateVersion.mandate.fund.currency !== undefined ? prop.mandateVersion.mandate.fund.currency : undefined,
            inceptionDate: prop.mandateVersion.mandate.fund.inceptionDate !== undefined ? prop.mandateVersion.mandate.fund.inceptionDate : undefined,
            aum: prop.mandateVersion.mandate.fund.aum !== undefined ? prop.mandateVersion.mandate.fund.aum : undefined,
            navPerShare: prop.mandateVersion.mandate.fund.navPerShare !== undefined ? prop.mandateVersion.mandate.fund.navPerShare : undefined,
            sharesOutstanding: prop.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? prop.mandateVersion.mandate.fund.sharesOutstanding : undefined,
            highWaterMarkNav: prop.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? prop.mandateVersion.mandate.fund.highWaterMarkNav : undefined,
            fees: prop.mandateVersion.mandate.fund.fees !== undefined ? prop.mandateVersion.mandate.fund.fees : undefined,
            terms: prop.mandateVersion.mandate.fund.terms !== undefined ? prop.mandateVersion.mandate.fund.terms : undefined,
            regulatory: prop.mandateVersion.mandate.fund.regulatory !== undefined ? prop.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: prop.mandateVersion.mandate.fund.serviceProviders !== undefined ? prop.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: prop.mandateVersion.mandate.fund.tradingOverrides !== undefined ? prop.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: prop.mandateVersion.mandate.fund.deletedAt !== undefined ? prop.mandateVersion.mandate.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: prop.mandateVersion.mandate.owner ? 
      typeof prop.mandateVersion.mandate.owner === 'object' && Object.keys(prop.mandateVersion.mandate.owner).length === 1 && (Object.keys(prop.mandateVersion.mandate.owner)[0] === 'id' || Object.keys(prop.mandateVersion.mandate.owner)[0] === 'symbol')
? {
      connect: {
        id: prop.mandateVersion.mandate.owner.id
      }
} : { upsert: {
          where: {
            id: prop.mandateVersion.mandate.owner.id !== undefined ? {
                equals: prop.mandateVersion.mandate.owner.id
              } : undefined,
            name: prop.mandateVersion.mandate.owner.name !== undefined ? {
                equals: prop.mandateVersion.mandate.owner.name
              } : undefined,
            email: prop.mandateVersion.mandate.owner.email !== undefined ? {
                equals: prop.mandateVersion.mandate.owner.email
              } : undefined,
            customerId: prop.mandateVersion.mandate.owner.customerId !== undefined ? {
                equals: prop.mandateVersion.mandate.owner.customerId
              } : undefined,
          },
          update: {
            id: prop.mandateVersion.mandate.owner.id !== undefined ? {
                set: prop.mandateVersion.mandate.owner.id
              } : undefined,
            name: prop.mandateVersion.mandate.owner.name !== undefined ? {
                set: prop.mandateVersion.mandate.owner.name
              } : undefined,
            email: prop.mandateVersion.mandate.owner.email !== undefined ? {
                set: prop.mandateVersion.mandate.owner.email
              } : undefined,
            emailVerified: prop.mandateVersion.mandate.owner.emailVerified !== undefined ? {
                set: prop.mandateVersion.mandate.owner.emailVerified
              } : undefined,
            image: prop.mandateVersion.mandate.owner.image !== undefined ? {
                set: prop.mandateVersion.mandate.owner.image
              } : undefined,
            avatarUrl: prop.mandateVersion.mandate.owner.avatarUrl !== undefined ? {
                set: prop.mandateVersion.mandate.owner.avatarUrl
              } : undefined,
            onboardingComplete: prop.mandateVersion.mandate.owner.onboardingComplete !== undefined ? {
                set: prop.mandateVersion.mandate.owner.onboardingComplete
              } : undefined,
            signupCategory: prop.mandateVersion.mandate.owner.signupCategory !== undefined ? {
                set: prop.mandateVersion.mandate.owner.signupCategory
              } : undefined,
            deletedAt: prop.mandateVersion.mandate.owner.deletedAt !== undefined ? {
                set: prop.mandateVersion.mandate.owner.deletedAt
              } : undefined,
            role: prop.mandateVersion.mandate.owner.role !== undefined ? {
                set: prop.mandateVersion.mandate.owner.role
              } : undefined,
            bio: prop.mandateVersion.mandate.owner.bio !== undefined ? {
                set: prop.mandateVersion.mandate.owner.bio
              } : undefined,
            jobTitle: prop.mandateVersion.mandate.owner.jobTitle !== undefined ? {
                set: prop.mandateVersion.mandate.owner.jobTitle
              } : undefined,
            currentAccount: prop.mandateVersion.mandate.owner.currentAccount !== undefined ? {
                set: prop.mandateVersion.mandate.owner.currentAccount
              } : undefined,
            plan: prop.mandateVersion.mandate.owner.plan !== undefined ? {
                set: prop.mandateVersion.mandate.owner.plan
              } : undefined,
            openaiAPIKey: prop.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? {
                set: prop.mandateVersion.mandate.owner.openaiAPIKey
              } : undefined,
            openaiModel: prop.mandateVersion.mandate.owner.openaiModel !== undefined ? {
                set: prop.mandateVersion.mandate.owner.openaiModel
              } : undefined,
          },
          create: {
            name: prop.mandateVersion.mandate.owner.name !== undefined ? prop.mandateVersion.mandate.owner.name : undefined,
            email: prop.mandateVersion.mandate.owner.email !== undefined ? prop.mandateVersion.mandate.owner.email : undefined,
            emailVerified: prop.mandateVersion.mandate.owner.emailVerified !== undefined ? prop.mandateVersion.mandate.owner.emailVerified : undefined,
            image: prop.mandateVersion.mandate.owner.image !== undefined ? prop.mandateVersion.mandate.owner.image : undefined,
            avatarUrl: prop.mandateVersion.mandate.owner.avatarUrl !== undefined ? prop.mandateVersion.mandate.owner.avatarUrl : undefined,
            onboardingComplete: prop.mandateVersion.mandate.owner.onboardingComplete !== undefined ? prop.mandateVersion.mandate.owner.onboardingComplete : undefined,
            signupCategory: prop.mandateVersion.mandate.owner.signupCategory !== undefined ? prop.mandateVersion.mandate.owner.signupCategory : undefined,
            deletedAt: prop.mandateVersion.mandate.owner.deletedAt !== undefined ? prop.mandateVersion.mandate.owner.deletedAt : undefined,
            role: prop.mandateVersion.mandate.owner.role !== undefined ? prop.mandateVersion.mandate.owner.role : undefined,
            bio: prop.mandateVersion.mandate.owner.bio !== undefined ? prop.mandateVersion.mandate.owner.bio : undefined,
            jobTitle: prop.mandateVersion.mandate.owner.jobTitle !== undefined ? prop.mandateVersion.mandate.owner.jobTitle : undefined,
            currentAccount: prop.mandateVersion.mandate.owner.currentAccount !== undefined ? prop.mandateVersion.mandate.owner.currentAccount : undefined,
            plan: prop.mandateVersion.mandate.owner.plan !== undefined ? prop.mandateVersion.mandate.owner.plan : undefined,
            openaiAPIKey: prop.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? prop.mandateVersion.mandate.owner.openaiAPIKey : undefined,
            openaiModel: prop.mandateVersion.mandate.owner.openaiModel !== undefined ? prop.mandateVersion.mandate.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      activeVersion: prop.mandateVersion.mandate.activeVersion ? 
      typeof prop.mandateVersion.mandate.activeVersion === 'object' && Object.keys(prop.mandateVersion.mandate.activeVersion).length === 1 && (Object.keys(prop.mandateVersion.mandate.activeVersion)[0] === 'id' || Object.keys(prop.mandateVersion.mandate.activeVersion)[0] === 'symbol')
? {
      connect: {
        id: prop.mandateVersion.mandate.activeVersion.id
      }
} : { upsert: {
          where: {
            id: prop.mandateVersion.mandate.activeVersion.id !== undefined ? {
                equals: prop.mandateVersion.mandate.activeVersion.id
              } : undefined,
            mandateId: prop.mandateVersion.mandate.activeVersion.mandateId !== undefined ? {
                equals: prop.mandateVersion.mandate.activeVersion.mandateId
              } : undefined,
            status: prop.mandateVersion.mandate.activeVersion.status !== undefined ? {
                equals: prop.mandateVersion.mandate.activeVersion.status
              } : undefined,
            authoredById: prop.mandateVersion.mandate.activeVersion.authoredById !== undefined ? {
                equals: prop.mandateVersion.mandate.activeVersion.authoredById
              } : undefined,
          },
          update: {
            id: prop.mandateVersion.mandate.activeVersion.id !== undefined ? {
                set: prop.mandateVersion.mandate.activeVersion.id
              } : undefined,
            versionLabel: prop.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? {
                set: prop.mandateVersion.mandate.activeVersion.versionLabel
              } : undefined,
            versionSeq: prop.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? {
                set: prop.mandateVersion.mandate.activeVersion.versionSeq
              } : undefined,
            status: prop.mandateVersion.mandate.activeVersion.status !== undefined ? {
                set: prop.mandateVersion.mandate.activeVersion.status
              } : undefined,
            summary: prop.mandateVersion.mandate.activeVersion.summary !== undefined ? {
                set: prop.mandateVersion.mandate.activeVersion.summary
              } : undefined,
            charterBody: prop.mandateVersion.mandate.activeVersion.charterBody !== undefined ? prop.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
          create: {
            versionLabel: prop.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? prop.mandateVersion.mandate.activeVersion.versionLabel : undefined,
            versionSeq: prop.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? prop.mandateVersion.mandate.activeVersion.versionSeq : undefined,
            status: prop.mandateVersion.mandate.activeVersion.status !== undefined ? prop.mandateVersion.mandate.activeVersion.status : undefined,
            summary: prop.mandateVersion.mandate.activeVersion.summary !== undefined ? prop.mandateVersion.mandate.activeVersion.summary : undefined,
            charterBody: prop.mandateVersion.mandate.activeVersion.charterBody !== undefined ? prop.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
        }
      } : undefined,
        },
        create: {
          scopeKind: prop.mandateVersion.mandate.scopeKind !== undefined ? prop.mandateVersion.mandate.scopeKind : undefined,
          klass: prop.mandateVersion.mandate.klass !== undefined ? prop.mandateVersion.mandate.klass : undefined,
          name: prop.mandateVersion.mandate.name !== undefined ? prop.mandateVersion.mandate.name : undefined,
          personaScope: prop.mandateVersion.mandate.personaScope !== undefined ? prop.mandateVersion.mandate.personaScope : undefined,
          deletedAt: prop.mandateVersion.mandate.deletedAt !== undefined ? prop.mandateVersion.mandate.deletedAt : undefined,
      organization: prop.mandateVersion.mandate.organization ? 
        typeof prop.mandateVersion.mandate.organization === 'object' && Object.keys(prop.mandateVersion.mandate.organization).length === 1 && Object.keys(prop.mandateVersion.mandate.organization)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.mandate.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.mandate.organization.id !== undefined ? prop.mandateVersion.mandate.organization.id : undefined,
            slug: prop.mandateVersion.mandate.organization.slug !== undefined ? prop.mandateVersion.mandate.organization.slug : undefined,
            name: prop.mandateVersion.mandate.organization.name !== undefined ? {
                equals: prop.mandateVersion.mandate.organization.name 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.mandate.organization.name !== undefined ? prop.mandateVersion.mandate.organization.name : undefined,
            slug: prop.mandateVersion.mandate.organization.slug !== undefined ? prop.mandateVersion.mandate.organization.slug : undefined,
            logoUrl: prop.mandateVersion.mandate.organization.logoUrl !== undefined ? prop.mandateVersion.mandate.organization.logoUrl : undefined,
            website: prop.mandateVersion.mandate.organization.website !== undefined ? prop.mandateVersion.mandate.organization.website : undefined,
            businessType: prop.mandateVersion.mandate.organization.businessType !== undefined ? prop.mandateVersion.mandate.organization.businessType : undefined,
            emailDomains: prop.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: prop.mandateVersion.mandate.organization.emailDomains 
               } : undefined,
            jurisdiction: prop.mandateVersion.mandate.organization.jurisdiction !== undefined ? prop.mandateVersion.mandate.organization.jurisdiction : undefined,
            regulatoryStatus: prop.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? prop.mandateVersion.mandate.organization.regulatoryStatus : undefined,
            description: prop.mandateVersion.mandate.organization.description !== undefined ? prop.mandateVersion.mandate.organization.description : undefined,
            tradingDefaults: prop.mandateVersion.mandate.organization.tradingDefaults !== undefined ? prop.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: prop.mandateVersion.mandate.organization.deletedAt !== undefined ? prop.mandateVersion.mandate.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: prop.mandateVersion.mandate.fund ? 
        typeof prop.mandateVersion.mandate.fund === 'object' && Object.keys(prop.mandateVersion.mandate.fund).length === 1 && Object.keys(prop.mandateVersion.mandate.fund)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.mandate.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.mandate.fund.id !== undefined ? prop.mandateVersion.mandate.fund.id : undefined,
            name: prop.mandateVersion.mandate.fund.name !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.name 
               } : undefined,
            slug: prop.mandateVersion.mandate.fund.slug !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.slug 
               } : undefined,
            status: prop.mandateVersion.mandate.fund.status !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.status 
               } : undefined,
            organizationId: prop.mandateVersion.mandate.fund.organizationId !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.organizationId 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.mandate.fund.name !== undefined ? prop.mandateVersion.mandate.fund.name : undefined,
            slug: prop.mandateVersion.mandate.fund.slug !== undefined ? prop.mandateVersion.mandate.fund.slug : undefined,
            description: prop.mandateVersion.mandate.fund.description !== undefined ? prop.mandateVersion.mandate.fund.description : undefined,
            status: prop.mandateVersion.mandate.fund.status !== undefined ? prop.mandateVersion.mandate.fund.status : undefined,
            currency: prop.mandateVersion.mandate.fund.currency !== undefined ? prop.mandateVersion.mandate.fund.currency : undefined,
            inceptionDate: prop.mandateVersion.mandate.fund.inceptionDate !== undefined ? prop.mandateVersion.mandate.fund.inceptionDate : undefined,
            aum: prop.mandateVersion.mandate.fund.aum !== undefined ? prop.mandateVersion.mandate.fund.aum : undefined,
            navPerShare: prop.mandateVersion.mandate.fund.navPerShare !== undefined ? prop.mandateVersion.mandate.fund.navPerShare : undefined,
            sharesOutstanding: prop.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? prop.mandateVersion.mandate.fund.sharesOutstanding : undefined,
            highWaterMarkNav: prop.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? prop.mandateVersion.mandate.fund.highWaterMarkNav : undefined,
            fees: prop.mandateVersion.mandate.fund.fees !== undefined ? prop.mandateVersion.mandate.fund.fees : undefined,
            terms: prop.mandateVersion.mandate.fund.terms !== undefined ? prop.mandateVersion.mandate.fund.terms : undefined,
            regulatory: prop.mandateVersion.mandate.fund.regulatory !== undefined ? prop.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: prop.mandateVersion.mandate.fund.serviceProviders !== undefined ? prop.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: prop.mandateVersion.mandate.fund.tradingOverrides !== undefined ? prop.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: prop.mandateVersion.mandate.fund.deletedAt !== undefined ? prop.mandateVersion.mandate.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: prop.mandateVersion.mandate.owner ? 
        typeof prop.mandateVersion.mandate.owner === 'object' && Object.keys(prop.mandateVersion.mandate.owner).length === 1 && Object.keys(prop.mandateVersion.mandate.owner)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.mandate.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.mandate.owner.id !== undefined ? prop.mandateVersion.mandate.owner.id : undefined,
            email: prop.mandateVersion.mandate.owner.email !== undefined ? prop.mandateVersion.mandate.owner.email : undefined,
            name: prop.mandateVersion.mandate.owner.name !== undefined ? {
                equals: prop.mandateVersion.mandate.owner.name 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.mandate.owner.name !== undefined ? prop.mandateVersion.mandate.owner.name : undefined,
            email: prop.mandateVersion.mandate.owner.email !== undefined ? prop.mandateVersion.mandate.owner.email : undefined,
            emailVerified: prop.mandateVersion.mandate.owner.emailVerified !== undefined ? prop.mandateVersion.mandate.owner.emailVerified : undefined,
            image: prop.mandateVersion.mandate.owner.image !== undefined ? prop.mandateVersion.mandate.owner.image : undefined,
            avatarUrl: prop.mandateVersion.mandate.owner.avatarUrl !== undefined ? prop.mandateVersion.mandate.owner.avatarUrl : undefined,
            onboardingComplete: prop.mandateVersion.mandate.owner.onboardingComplete !== undefined ? prop.mandateVersion.mandate.owner.onboardingComplete : undefined,
            signupCategory: prop.mandateVersion.mandate.owner.signupCategory !== undefined ? prop.mandateVersion.mandate.owner.signupCategory : undefined,
            deletedAt: prop.mandateVersion.mandate.owner.deletedAt !== undefined ? prop.mandateVersion.mandate.owner.deletedAt : undefined,
            role: prop.mandateVersion.mandate.owner.role !== undefined ? prop.mandateVersion.mandate.owner.role : undefined,
            bio: prop.mandateVersion.mandate.owner.bio !== undefined ? prop.mandateVersion.mandate.owner.bio : undefined,
            jobTitle: prop.mandateVersion.mandate.owner.jobTitle !== undefined ? prop.mandateVersion.mandate.owner.jobTitle : undefined,
            currentAccount: prop.mandateVersion.mandate.owner.currentAccount !== undefined ? prop.mandateVersion.mandate.owner.currentAccount : undefined,
            plan: prop.mandateVersion.mandate.owner.plan !== undefined ? prop.mandateVersion.mandate.owner.plan : undefined,
            openaiAPIKey: prop.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? prop.mandateVersion.mandate.owner.openaiAPIKey : undefined,
            openaiModel: prop.mandateVersion.mandate.owner.openaiModel !== undefined ? prop.mandateVersion.mandate.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      activeVersion: prop.mandateVersion.mandate.activeVersion ? 
        typeof prop.mandateVersion.mandate.activeVersion === 'object' && Object.keys(prop.mandateVersion.mandate.activeVersion).length === 1 && Object.keys(prop.mandateVersion.mandate.activeVersion)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.mandate.activeVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.mandate.activeVersion.id !== undefined ? prop.mandateVersion.mandate.activeVersion.id : undefined,
            mandateId: prop.mandateVersion.mandate.activeVersion.mandateId !== undefined ? {
                equals: prop.mandateVersion.mandate.activeVersion.mandateId 
               } : undefined,
            status: prop.mandateVersion.mandate.activeVersion.status !== undefined ? {
                equals: prop.mandateVersion.mandate.activeVersion.status 
               } : undefined,
          },
          create: {
            versionLabel: prop.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? prop.mandateVersion.mandate.activeVersion.versionLabel : undefined,
            versionSeq: prop.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? prop.mandateVersion.mandate.activeVersion.versionSeq : undefined,
            status: prop.mandateVersion.mandate.activeVersion.status !== undefined ? prop.mandateVersion.mandate.activeVersion.status : undefined,
            summary: prop.mandateVersion.mandate.activeVersion.summary !== undefined ? prop.mandateVersion.mandate.activeVersion.summary : undefined,
            charterBody: prop.mandateVersion.mandate.activeVersion.charterBody !== undefined ? prop.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
        }
      } : undefined,
        },
      }
    } : undefined,
    authoredBy: prop.mandateVersion.authoredBy ? 
    typeof prop.mandateVersion.authoredBy === 'object' && Object.keys(prop.mandateVersion.authoredBy).length === 1 && (Object.keys(prop.mandateVersion.authoredBy)[0] === 'id' || Object.keys(prop.mandateVersion.authoredBy)[0] === 'symbol')
? {
    connect: {
      id: prop.mandateVersion.authoredBy.id
    }
} : { upsert: {
        where: {
          id: prop.mandateVersion.authoredBy.id !== undefined ? {
              equals: prop.mandateVersion.authoredBy.id
            } : undefined,
          name: prop.mandateVersion.authoredBy.name !== undefined ? {
              equals: prop.mandateVersion.authoredBy.name
            } : undefined,
          email: prop.mandateVersion.authoredBy.email !== undefined ? {
              equals: prop.mandateVersion.authoredBy.email
            } : undefined,
          customerId: prop.mandateVersion.authoredBy.customerId !== undefined ? {
              equals: prop.mandateVersion.authoredBy.customerId
            } : undefined,
        },
        update: {
          id: prop.mandateVersion.authoredBy.id !== undefined ? {
              set: prop.mandateVersion.authoredBy.id
            } : undefined,
          name: prop.mandateVersion.authoredBy.name !== undefined ? {
              set: prop.mandateVersion.authoredBy.name
            } : undefined,
          email: prop.mandateVersion.authoredBy.email !== undefined ? {
              set: prop.mandateVersion.authoredBy.email
            } : undefined,
          emailVerified: prop.mandateVersion.authoredBy.emailVerified !== undefined ? {
              set: prop.mandateVersion.authoredBy.emailVerified
            } : undefined,
          image: prop.mandateVersion.authoredBy.image !== undefined ? {
              set: prop.mandateVersion.authoredBy.image
            } : undefined,
          avatarUrl: prop.mandateVersion.authoredBy.avatarUrl !== undefined ? {
              set: prop.mandateVersion.authoredBy.avatarUrl
            } : undefined,
          onboardingComplete: prop.mandateVersion.authoredBy.onboardingComplete !== undefined ? {
              set: prop.mandateVersion.authoredBy.onboardingComplete
            } : undefined,
          signupCategory: prop.mandateVersion.authoredBy.signupCategory !== undefined ? {
              set: prop.mandateVersion.authoredBy.signupCategory
            } : undefined,
          deletedAt: prop.mandateVersion.authoredBy.deletedAt !== undefined ? {
              set: prop.mandateVersion.authoredBy.deletedAt
            } : undefined,
          role: prop.mandateVersion.authoredBy.role !== undefined ? {
              set: prop.mandateVersion.authoredBy.role
            } : undefined,
          bio: prop.mandateVersion.authoredBy.bio !== undefined ? {
              set: prop.mandateVersion.authoredBy.bio
            } : undefined,
          jobTitle: prop.mandateVersion.authoredBy.jobTitle !== undefined ? {
              set: prop.mandateVersion.authoredBy.jobTitle
            } : undefined,
          currentAccount: prop.mandateVersion.authoredBy.currentAccount !== undefined ? {
              set: prop.mandateVersion.authoredBy.currentAccount
            } : undefined,
          plan: prop.mandateVersion.authoredBy.plan !== undefined ? {
              set: prop.mandateVersion.authoredBy.plan
            } : undefined,
          openaiAPIKey: prop.mandateVersion.authoredBy.openaiAPIKey !== undefined ? {
              set: prop.mandateVersion.authoredBy.openaiAPIKey
            } : undefined,
          openaiModel: prop.mandateVersion.authoredBy.openaiModel !== undefined ? {
              set: prop.mandateVersion.authoredBy.openaiModel
            } : undefined,
      customer: prop.mandateVersion.authoredBy.customer ? 
      typeof prop.mandateVersion.authoredBy.customer === 'object' && Object.keys(prop.mandateVersion.authoredBy.customer).length === 1 && (Object.keys(prop.mandateVersion.authoredBy.customer)[0] === 'id' || Object.keys(prop.mandateVersion.authoredBy.customer)[0] === 'symbol')
? {
      connect: {
        id: prop.mandateVersion.authoredBy.customer.id
      }
} : { upsert: {
          where: {
            id: prop.mandateVersion.authoredBy.customer.id !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.id
              } : undefined,
            authUserId: prop.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.authUserId
              } : undefined,
            name: prop.mandateVersion.authoredBy.customer.name !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.name
              } : undefined,
            stripeCustomerId: prop.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: prop.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: prop.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.stripePriceId
              } : undefined,
          },
          update: {
            authUserId: prop.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                set: prop.mandateVersion.authoredBy.customer.authUserId
              } : undefined,
            name: prop.mandateVersion.authoredBy.customer.name !== undefined ? {
                set: prop.mandateVersion.authoredBy.customer.name
              } : undefined,
            plan: prop.mandateVersion.authoredBy.customer.plan !== undefined ? {
                set: prop.mandateVersion.authoredBy.customer.plan
              } : undefined,
            stripeCustomerId: prop.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? {
                set: prop.mandateVersion.authoredBy.customer.stripeCustomerId
              } : undefined,
            stripeSubscriptionId: prop.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? {
                set: prop.mandateVersion.authoredBy.customer.stripeSubscriptionId
              } : undefined,
            stripePriceId: prop.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                set: prop.mandateVersion.authoredBy.customer.stripePriceId
              } : undefined,
            stripeCurrentPeriodEnd: prop.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? {
                set: prop.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd
              } : undefined,
            jurisdiction: prop.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? {
                set: prop.mandateVersion.authoredBy.customer.jurisdiction
              } : undefined,
            riskProfile: prop.mandateVersion.authoredBy.customer.riskProfile !== undefined ? {
                set: prop.mandateVersion.authoredBy.customer.riskProfile
              } : undefined,
            amlStatus: prop.mandateVersion.authoredBy.customer.amlStatus !== undefined ? {
                set: prop.mandateVersion.authoredBy.customer.amlStatus
              } : undefined,
            lastKycUpdate: prop.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? {
                set: prop.mandateVersion.authoredBy.customer.lastKycUpdate
              } : undefined,
          },
          create: {
            authUserId: prop.mandateVersion.authoredBy.customer.authUserId !== undefined ? prop.mandateVersion.authoredBy.customer.authUserId : undefined,
            name: prop.mandateVersion.authoredBy.customer.name !== undefined ? prop.mandateVersion.authoredBy.customer.name : undefined,
            plan: prop.mandateVersion.authoredBy.customer.plan !== undefined ? prop.mandateVersion.authoredBy.customer.plan : undefined,
            stripeCustomerId: prop.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? prop.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: prop.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? prop.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            stripePriceId: prop.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? prop.mandateVersion.authoredBy.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: prop.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? prop.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: prop.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? prop.mandateVersion.authoredBy.customer.jurisdiction : undefined,
            riskProfile: prop.mandateVersion.authoredBy.customer.riskProfile !== undefined ? prop.mandateVersion.authoredBy.customer.riskProfile : undefined,
            amlStatus: prop.mandateVersion.authoredBy.customer.amlStatus !== undefined ? prop.mandateVersion.authoredBy.customer.amlStatus : undefined,
            lastKycUpdate: prop.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? prop.mandateVersion.authoredBy.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: prop.mandateVersion.authoredBy.accounts ? 
      Array.isArray(prop.mandateVersion.authoredBy.accounts) && prop.mandateVersion.authoredBy.accounts.length > 0 && prop.mandateVersion.authoredBy.accounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.accounts.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.accounts.map((item) => ({
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
      sessions: prop.mandateVersion.authoredBy.sessions ? 
      Array.isArray(prop.mandateVersion.authoredBy.sessions) && prop.mandateVersion.authoredBy.sessions.length > 0 && prop.mandateVersion.authoredBy.sessions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.sessions.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.sessions.map((item) => ({
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
      authenticators: prop.mandateVersion.authoredBy.authenticators ? 
      Array.isArray(prop.mandateVersion.authoredBy.authenticators) && prop.mandateVersion.authoredBy.authenticators.length > 0 && prop.mandateVersion.authoredBy.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.authenticators.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.authenticators.map((item) => ({
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
      alpacaAccounts: prop.mandateVersion.authoredBy.alpacaAccounts ? 
      Array.isArray(prop.mandateVersion.authoredBy.alpacaAccounts) && prop.mandateVersion.authoredBy.alpacaAccounts.length > 0 && prop.mandateVersion.authoredBy.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
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
      linkedProviders: prop.mandateVersion.authoredBy.linkedProviders ? 
      Array.isArray(prop.mandateVersion.authoredBy.linkedProviders) && prop.mandateVersion.authoredBy.linkedProviders.length > 0 && prop.mandateVersion.authoredBy.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.linkedProviders.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.linkedProviders.map((item) => ({
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
      accountLinkingRequests: prop.mandateVersion.authoredBy.accountLinkingRequests ? 
      Array.isArray(prop.mandateVersion.authoredBy.accountLinkingRequests) && prop.mandateVersion.authoredBy.accountLinkingRequests.length > 0 && prop.mandateVersion.authoredBy.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
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
      reviewedWaitlistEntries: prop.mandateVersion.authoredBy.reviewedWaitlistEntries ? 
      Array.isArray(prop.mandateVersion.authoredBy.reviewedWaitlistEntries) && prop.mandateVersion.authoredBy.reviewedWaitlistEntries.length > 0 && prop.mandateVersion.authoredBy.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
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
      llmConfiguration: prop.mandateVersion.authoredBy.llmConfiguration ? 
      typeof prop.mandateVersion.authoredBy.llmConfiguration === 'object' && Object.keys(prop.mandateVersion.authoredBy.llmConfiguration).length === 1 && (Object.keys(prop.mandateVersion.authoredBy.llmConfiguration)[0] === 'id' || Object.keys(prop.mandateVersion.authoredBy.llmConfiguration)[0] === 'symbol')
? {
      connect: {
        id: prop.mandateVersion.authoredBy.llmConfiguration.id
      }
} : { upsert: {
          where: {
            id: prop.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? {
                equals: prop.mandateVersion.authoredBy.llmConfiguration.id
              } : undefined,
            userId: prop.mandateVersion.authoredBy.llmConfiguration.userId !== undefined ? {
                equals: prop.mandateVersion.authoredBy.llmConfiguration.userId
              } : undefined,
          },
          update: {
            id: prop.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.id
              } : undefined,
            defaultProvider: prop.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.defaultProvider
              } : undefined,
            miniProvider: prop.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.miniProvider
              } : undefined,
            normalProvider: prop.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.normalProvider
              } : undefined,
            advancedProvider: prop.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.advancedProvider
              } : undefined,
            miniModel: prop.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.miniModel
              } : undefined,
            normalModel: prop.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.normalModel
              } : undefined,
            advancedModel: prop.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.advancedModel
              } : undefined,
            openaiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.openaiApiKey
              } : undefined,
            anthropicApiKey: prop.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey
              } : undefined,
            deepseekApiKey: prop.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey
              } : undefined,
            kimiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.kimiApiKey
              } : undefined,
            qwenApiKey: prop.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.qwenApiKey
              } : undefined,
            xaiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.xaiApiKey
              } : undefined,
            geminiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.geminiApiKey
              } : undefined,
            deepinfraApiKey: prop.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? {
                set: prop.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey
              } : undefined,
          },
          create: {
            defaultProvider: prop.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.defaultProvider : undefined,
            miniProvider: prop.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.miniProvider : undefined,
            normalProvider: prop.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.normalProvider : undefined,
            advancedProvider: prop.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.advancedProvider : undefined,
            miniModel: prop.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.miniModel : undefined,
            normalModel: prop.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.normalModel : undefined,
            advancedModel: prop.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.advancedModel : undefined,
            openaiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: prop.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: prop.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: prop.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: prop.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: prop.mandateVersion.authoredBy.orgMemberships ? 
      Array.isArray(prop.mandateVersion.authoredBy.orgMemberships) && prop.mandateVersion.authoredBy.orgMemberships.length > 0 && prop.mandateVersion.authoredBy.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.orgMemberships.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.orgMemberships.map((item) => ({
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
      fundAssignments: prop.mandateVersion.authoredBy.fundAssignments ? 
      Array.isArray(prop.mandateVersion.authoredBy.fundAssignments) && prop.mandateVersion.authoredBy.fundAssignments.length > 0 && prop.mandateVersion.authoredBy.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.fundAssignments.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.fundAssignments.map((item) => ({
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
      managedFunds: prop.mandateVersion.authoredBy.managedFunds ? 
      Array.isArray(prop.mandateVersion.authoredBy.managedFunds) && prop.mandateVersion.authoredBy.managedFunds.length > 0 && prop.mandateVersion.authoredBy.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.managedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.managedFunds.map((item) => ({
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
      operatedFunds: prop.mandateVersion.authoredBy.operatedFunds ? 
      Array.isArray(prop.mandateVersion.authoredBy.operatedFunds) && prop.mandateVersion.authoredBy.operatedFunds.length > 0 && prop.mandateVersion.authoredBy.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.operatedFunds.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.operatedFunds.map((item) => ({
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
      ownedMandates: prop.mandateVersion.authoredBy.ownedMandates ? 
      Array.isArray(prop.mandateVersion.authoredBy.ownedMandates) && prop.mandateVersion.authoredBy.ownedMandates.length > 0 && prop.mandateVersion.authoredBy.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.ownedMandates.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.ownedMandates.map((item) => ({
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
      mandateApprovalsDecided: prop.mandateVersion.authoredBy.mandateApprovalsDecided ? 
      Array.isArray(prop.mandateVersion.authoredBy.mandateApprovalsDecided) && prop.mandateVersion.authoredBy.mandateApprovalsDecided.length > 0 && prop.mandateVersion.authoredBy.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
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
      investorProfiles: prop.mandateVersion.authoredBy.investorProfiles ? 
      Array.isArray(prop.mandateVersion.authoredBy.investorProfiles) && prop.mandateVersion.authoredBy.investorProfiles.length > 0 && prop.mandateVersion.authoredBy.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.investorProfiles.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.investorProfiles.map((item) => ({
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
      notificationDeliveries: prop.mandateVersion.authoredBy.notificationDeliveries ? 
      Array.isArray(prop.mandateVersion.authoredBy.notificationDeliveries) && prop.mandateVersion.authoredBy.notificationDeliveries.length > 0 && prop.mandateVersion.authoredBy.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
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
      notificationPreferences: prop.mandateVersion.authoredBy.notificationPreferences ? 
      Array.isArray(prop.mandateVersion.authoredBy.notificationPreferences) && prop.mandateVersion.authoredBy.notificationPreferences.length > 0 && prop.mandateVersion.authoredBy.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
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
      ownedStrategies: prop.mandateVersion.authoredBy.ownedStrategies ? 
      Array.isArray(prop.mandateVersion.authoredBy.ownedStrategies) && prop.mandateVersion.authoredBy.ownedStrategies.length > 0 && prop.mandateVersion.authoredBy.ownedStrategies.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            key: item.key !== undefined ? item.key : undefined,
            ownerUserId: item.ownerUserId !== undefined ? {
                equals: item.ownerUserId
              } : undefined,
          },
          update: {
            id: item.id !== undefined ? {
                set: item.id
              } : undefined,
            key: item.key !== undefined ? {
                set: item.key
              } : undefined,
            displayName: item.displayName !== undefined ? {
                set: item.displayName
              } : undefined,
            description: item.description !== undefined ? {
                set: item.description
              } : undefined,
            origin: item.origin !== undefined ? {
                set: item.origin
              } : undefined,
            lifecycleState: item.lifecycleState !== undefined ? {
                set: item.lifecycleState
              } : undefined,
            manifestHash: item.manifestHash !== undefined ? {
                set: item.manifestHash
              } : undefined,
            deletedAt: item.deletedAt !== undefined ? {
                set: item.deletedAt
              } : undefined,
          },
          create: {
            key: item.key !== undefined ? item.key : undefined,
            displayName: item.displayName !== undefined ? item.displayName : undefined,
            description: item.description !== undefined ? item.description : undefined,
            origin: item.origin !== undefined ? item.origin : undefined,
            lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
            manifestHash: item.manifestHash !== undefined ? item.manifestHash : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          name: prop.mandateVersion.authoredBy.name !== undefined ? prop.mandateVersion.authoredBy.name : undefined,
          email: prop.mandateVersion.authoredBy.email !== undefined ? prop.mandateVersion.authoredBy.email : undefined,
          emailVerified: prop.mandateVersion.authoredBy.emailVerified !== undefined ? prop.mandateVersion.authoredBy.emailVerified : undefined,
          image: prop.mandateVersion.authoredBy.image !== undefined ? prop.mandateVersion.authoredBy.image : undefined,
          avatarUrl: prop.mandateVersion.authoredBy.avatarUrl !== undefined ? prop.mandateVersion.authoredBy.avatarUrl : undefined,
          onboardingComplete: prop.mandateVersion.authoredBy.onboardingComplete !== undefined ? prop.mandateVersion.authoredBy.onboardingComplete : undefined,
          signupCategory: prop.mandateVersion.authoredBy.signupCategory !== undefined ? prop.mandateVersion.authoredBy.signupCategory : undefined,
          deletedAt: prop.mandateVersion.authoredBy.deletedAt !== undefined ? prop.mandateVersion.authoredBy.deletedAt : undefined,
          role: prop.mandateVersion.authoredBy.role !== undefined ? prop.mandateVersion.authoredBy.role : undefined,
          bio: prop.mandateVersion.authoredBy.bio !== undefined ? prop.mandateVersion.authoredBy.bio : undefined,
          jobTitle: prop.mandateVersion.authoredBy.jobTitle !== undefined ? prop.mandateVersion.authoredBy.jobTitle : undefined,
          currentAccount: prop.mandateVersion.authoredBy.currentAccount !== undefined ? prop.mandateVersion.authoredBy.currentAccount : undefined,
          plan: prop.mandateVersion.authoredBy.plan !== undefined ? prop.mandateVersion.authoredBy.plan : undefined,
          openaiAPIKey: prop.mandateVersion.authoredBy.openaiAPIKey !== undefined ? prop.mandateVersion.authoredBy.openaiAPIKey : undefined,
          openaiModel: prop.mandateVersion.authoredBy.openaiModel !== undefined ? prop.mandateVersion.authoredBy.openaiModel : undefined,
      customer: prop.mandateVersion.authoredBy.customer ? 
        typeof prop.mandateVersion.authoredBy.customer === 'object' && Object.keys(prop.mandateVersion.authoredBy.customer).length === 1 && Object.keys(prop.mandateVersion.authoredBy.customer)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.authoredBy.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.authoredBy.customer.id !== undefined ? prop.mandateVersion.authoredBy.customer.id : undefined,
            stripeCustomerId: prop.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? prop.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: prop.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? prop.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            authUserId: prop.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.authUserId 
               } : undefined,
            name: prop.mandateVersion.authoredBy.customer.name !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.name 
               } : undefined,
            stripePriceId: prop.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: prop.mandateVersion.authoredBy.customer.authUserId !== undefined ? prop.mandateVersion.authoredBy.customer.authUserId : undefined,
            name: prop.mandateVersion.authoredBy.customer.name !== undefined ? prop.mandateVersion.authoredBy.customer.name : undefined,
            plan: prop.mandateVersion.authoredBy.customer.plan !== undefined ? prop.mandateVersion.authoredBy.customer.plan : undefined,
            stripeCustomerId: prop.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? prop.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: prop.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? prop.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            stripePriceId: prop.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? prop.mandateVersion.authoredBy.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: prop.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? prop.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: prop.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? prop.mandateVersion.authoredBy.customer.jurisdiction : undefined,
            riskProfile: prop.mandateVersion.authoredBy.customer.riskProfile !== undefined ? prop.mandateVersion.authoredBy.customer.riskProfile : undefined,
            amlStatus: prop.mandateVersion.authoredBy.customer.amlStatus !== undefined ? prop.mandateVersion.authoredBy.customer.amlStatus : undefined,
            lastKycUpdate: prop.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? prop.mandateVersion.authoredBy.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: prop.mandateVersion.authoredBy.accounts ? 
        Array.isArray(prop.mandateVersion.authoredBy.accounts) && prop.mandateVersion.authoredBy.accounts.length > 0 &&  prop.mandateVersion.authoredBy.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.accounts.map((item) => ({
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
      sessions: prop.mandateVersion.authoredBy.sessions ? 
        Array.isArray(prop.mandateVersion.authoredBy.sessions) && prop.mandateVersion.authoredBy.sessions.length > 0 &&  prop.mandateVersion.authoredBy.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.sessions.map((item) => ({
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
      authenticators: prop.mandateVersion.authoredBy.authenticators ? 
        Array.isArray(prop.mandateVersion.authoredBy.authenticators) && prop.mandateVersion.authoredBy.authenticators.length > 0 &&  prop.mandateVersion.authoredBy.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.authenticators.map((item) => ({
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
      alpacaAccounts: prop.mandateVersion.authoredBy.alpacaAccounts ? 
        Array.isArray(prop.mandateVersion.authoredBy.alpacaAccounts) && prop.mandateVersion.authoredBy.alpacaAccounts.length > 0 &&  prop.mandateVersion.authoredBy.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
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
      linkedProviders: prop.mandateVersion.authoredBy.linkedProviders ? 
        Array.isArray(prop.mandateVersion.authoredBy.linkedProviders) && prop.mandateVersion.authoredBy.linkedProviders.length > 0 &&  prop.mandateVersion.authoredBy.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.linkedProviders.map((item) => ({
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
      accountLinkingRequests: prop.mandateVersion.authoredBy.accountLinkingRequests ? 
        Array.isArray(prop.mandateVersion.authoredBy.accountLinkingRequests) && prop.mandateVersion.authoredBy.accountLinkingRequests.length > 0 &&  prop.mandateVersion.authoredBy.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
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
      reviewedWaitlistEntries: prop.mandateVersion.authoredBy.reviewedWaitlistEntries ? 
        Array.isArray(prop.mandateVersion.authoredBy.reviewedWaitlistEntries) && prop.mandateVersion.authoredBy.reviewedWaitlistEntries.length > 0 &&  prop.mandateVersion.authoredBy.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
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
      llmConfiguration: prop.mandateVersion.authoredBy.llmConfiguration ? 
        typeof prop.mandateVersion.authoredBy.llmConfiguration === 'object' && Object.keys(prop.mandateVersion.authoredBy.llmConfiguration).length === 1 && Object.keys(prop.mandateVersion.authoredBy.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.authoredBy.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.id : undefined,
            userId: prop.mandateVersion.authoredBy.llmConfiguration.userId !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: prop.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.defaultProvider : undefined,
            miniProvider: prop.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.miniProvider : undefined,
            normalProvider: prop.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.normalProvider : undefined,
            advancedProvider: prop.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.advancedProvider : undefined,
            miniModel: prop.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.miniModel : undefined,
            normalModel: prop.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.normalModel : undefined,
            advancedModel: prop.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.advancedModel : undefined,
            openaiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: prop.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: prop.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: prop.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: prop.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: prop.mandateVersion.authoredBy.orgMemberships ? 
        Array.isArray(prop.mandateVersion.authoredBy.orgMemberships) && prop.mandateVersion.authoredBy.orgMemberships.length > 0 &&  prop.mandateVersion.authoredBy.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.orgMemberships.map((item) => ({
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
      fundAssignments: prop.mandateVersion.authoredBy.fundAssignments ? 
        Array.isArray(prop.mandateVersion.authoredBy.fundAssignments) && prop.mandateVersion.authoredBy.fundAssignments.length > 0 &&  prop.mandateVersion.authoredBy.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.fundAssignments.map((item) => ({
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
      managedFunds: prop.mandateVersion.authoredBy.managedFunds ? 
        Array.isArray(prop.mandateVersion.authoredBy.managedFunds) && prop.mandateVersion.authoredBy.managedFunds.length > 0 &&  prop.mandateVersion.authoredBy.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.managedFunds.map((item) => ({
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
      operatedFunds: prop.mandateVersion.authoredBy.operatedFunds ? 
        Array.isArray(prop.mandateVersion.authoredBy.operatedFunds) && prop.mandateVersion.authoredBy.operatedFunds.length > 0 &&  prop.mandateVersion.authoredBy.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.operatedFunds.map((item) => ({
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
      ownedMandates: prop.mandateVersion.authoredBy.ownedMandates ? 
        Array.isArray(prop.mandateVersion.authoredBy.ownedMandates) && prop.mandateVersion.authoredBy.ownedMandates.length > 0 &&  prop.mandateVersion.authoredBy.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.ownedMandates.map((item) => ({
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
      mandateApprovalsDecided: prop.mandateVersion.authoredBy.mandateApprovalsDecided ? 
        Array.isArray(prop.mandateVersion.authoredBy.mandateApprovalsDecided) && prop.mandateVersion.authoredBy.mandateApprovalsDecided.length > 0 &&  prop.mandateVersion.authoredBy.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
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
      investorProfiles: prop.mandateVersion.authoredBy.investorProfiles ? 
        Array.isArray(prop.mandateVersion.authoredBy.investorProfiles) && prop.mandateVersion.authoredBy.investorProfiles.length > 0 &&  prop.mandateVersion.authoredBy.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.investorProfiles.map((item) => ({
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
      notificationDeliveries: prop.mandateVersion.authoredBy.notificationDeliveries ? 
        Array.isArray(prop.mandateVersion.authoredBy.notificationDeliveries) && prop.mandateVersion.authoredBy.notificationDeliveries.length > 0 &&  prop.mandateVersion.authoredBy.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
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
      notificationPreferences: prop.mandateVersion.authoredBy.notificationPreferences ? 
        Array.isArray(prop.mandateVersion.authoredBy.notificationPreferences) && prop.mandateVersion.authoredBy.notificationPreferences.length > 0 &&  prop.mandateVersion.authoredBy.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
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
      ownedStrategies: prop.mandateVersion.authoredBy.ownedStrategies ? 
        Array.isArray(prop.mandateVersion.authoredBy.ownedStrategies) && prop.mandateVersion.authoredBy.ownedStrategies.length > 0 &&  prop.mandateVersion.authoredBy.ownedStrategies.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            key: item.key !== undefined ? item.key : undefined,
          },
          create: {
            key: item.key !== undefined ? item.key : undefined,
            displayName: item.displayName !== undefined ? item.displayName : undefined,
            description: item.description !== undefined ? item.description : undefined,
            origin: item.origin !== undefined ? item.origin : undefined,
            lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
            manifestHash: item.manifestHash !== undefined ? item.manifestHash : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    approvals: prop.mandateVersion.approvals ? 
    Array.isArray(prop.mandateVersion.approvals) && prop.mandateVersion.approvals.length > 0 && prop.mandateVersion.approvals.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.mandateVersion.approvals.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.mandateVersion.approvals.map((item) => ({
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
      decidedBy: item.decidedBy ? 
      typeof item.decidedBy === 'object' && Object.keys(item.decidedBy).length === 1 && (Object.keys(item.decidedBy)[0] === 'id' || Object.keys(item.decidedBy)[0] === 'symbol')
? {
      connect: {
        id: item.decidedBy.id
      }
} : { upsert: {
          where: {
            id: item.decidedBy.id !== undefined ? {
                equals: item.decidedBy.id
              } : undefined,
            name: item.decidedBy.name !== undefined ? {
                equals: item.decidedBy.name
              } : undefined,
            email: item.decidedBy.email !== undefined ? {
                equals: item.decidedBy.email
              } : undefined,
            customerId: item.decidedBy.customerId !== undefined ? {
                equals: item.decidedBy.customerId
              } : undefined,
          },
          update: {
            id: item.decidedBy.id !== undefined ? {
                set: item.decidedBy.id
              } : undefined,
            name: item.decidedBy.name !== undefined ? {
                set: item.decidedBy.name
              } : undefined,
            email: item.decidedBy.email !== undefined ? {
                set: item.decidedBy.email
              } : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? {
                set: item.decidedBy.emailVerified
              } : undefined,
            image: item.decidedBy.image !== undefined ? {
                set: item.decidedBy.image
              } : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? {
                set: item.decidedBy.avatarUrl
              } : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? {
                set: item.decidedBy.onboardingComplete
              } : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? {
                set: item.decidedBy.signupCategory
              } : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? {
                set: item.decidedBy.deletedAt
              } : undefined,
            role: item.decidedBy.role !== undefined ? {
                set: item.decidedBy.role
              } : undefined,
            bio: item.decidedBy.bio !== undefined ? {
                set: item.decidedBy.bio
              } : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? {
                set: item.decidedBy.jobTitle
              } : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? {
                set: item.decidedBy.currentAccount
              } : undefined,
            plan: item.decidedBy.plan !== undefined ? {
                set: item.decidedBy.plan
              } : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? {
                set: item.decidedBy.openaiAPIKey
              } : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? {
                set: item.decidedBy.openaiModel
              } : undefined,
          },
          create: {
            name: item.decidedBy.name !== undefined ? item.decidedBy.name : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? item.decidedBy.emailVerified : undefined,
            image: item.decidedBy.image !== undefined ? item.decidedBy.image : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? item.decidedBy.avatarUrl : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? item.decidedBy.onboardingComplete : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? item.decidedBy.signupCategory : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? item.decidedBy.deletedAt : undefined,
            role: item.decidedBy.role !== undefined ? item.decidedBy.role : undefined,
            bio: item.decidedBy.bio !== undefined ? item.decidedBy.bio : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? item.decidedBy.jobTitle : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? item.decidedBy.currentAccount : undefined,
            plan: item.decidedBy.plan !== undefined ? item.decidedBy.plan : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? item.decidedBy.openaiAPIKey : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? item.decidedBy.openaiModel : undefined,
          },
        }
      } : undefined,
        },
        create: {
          action: item.action !== undefined ? item.action : undefined,
          decidedByRole: item.decidedByRole !== undefined ? item.decidedByRole : undefined,
          rationale: item.rationale !== undefined ? item.rationale : undefined,
          correlationId: item.correlationId !== undefined ? item.correlationId : undefined,
      decidedBy: item.decidedBy ? 
        typeof item.decidedBy === 'object' && Object.keys(item.decidedBy).length === 1 && Object.keys(item.decidedBy)[0] === 'id'
    ? { connect: {
            id: item.decidedBy.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.decidedBy.id !== undefined ? item.decidedBy.id : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            name: item.decidedBy.name !== undefined ? {
                equals: item.decidedBy.name 
               } : undefined,
          },
          create: {
            name: item.decidedBy.name !== undefined ? item.decidedBy.name : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? item.decidedBy.emailVerified : undefined,
            image: item.decidedBy.image !== undefined ? item.decidedBy.image : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? item.decidedBy.avatarUrl : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? item.decidedBy.onboardingComplete : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? item.decidedBy.signupCategory : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? item.decidedBy.deletedAt : undefined,
            role: item.decidedBy.role !== undefined ? item.decidedBy.role : undefined,
            bio: item.decidedBy.bio !== undefined ? item.decidedBy.bio : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? item.decidedBy.jobTitle : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? item.decidedBy.currentAccount : undefined,
            plan: item.decidedBy.plan !== undefined ? item.decidedBy.plan : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? item.decidedBy.openaiAPIKey : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? item.decidedBy.openaiModel : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    activeFor: prop.mandateVersion.activeFor ? 
    typeof prop.mandateVersion.activeFor === 'object' && Object.keys(prop.mandateVersion.activeFor).length === 1 && (Object.keys(prop.mandateVersion.activeFor)[0] === 'id' || Object.keys(prop.mandateVersion.activeFor)[0] === 'symbol')
? {
    connect: {
      id: prop.mandateVersion.activeFor.id
    }
} : { upsert: {
        where: {
          id: prop.mandateVersion.activeFor.id !== undefined ? {
              equals: prop.mandateVersion.activeFor.id
            } : undefined,
          name: prop.mandateVersion.activeFor.name !== undefined ? {
              equals: prop.mandateVersion.activeFor.name
            } : undefined,
          organizationId: prop.mandateVersion.activeFor.organizationId !== undefined ? {
              equals: prop.mandateVersion.activeFor.organizationId
            } : undefined,
          fundId: prop.mandateVersion.activeFor.fundId !== undefined ? {
              equals: prop.mandateVersion.activeFor.fundId
            } : undefined,
          ownerId: prop.mandateVersion.activeFor.ownerId !== undefined ? {
              equals: prop.mandateVersion.activeFor.ownerId
            } : undefined,
          activeVersionId: prop.mandateVersion.activeFor.activeVersionId !== undefined ? {
              equals: prop.mandateVersion.activeFor.activeVersionId
            } : undefined,
        },
        update: {
          id: prop.mandateVersion.activeFor.id !== undefined ? {
              set: prop.mandateVersion.activeFor.id
            } : undefined,
          scopeKind: prop.mandateVersion.activeFor.scopeKind !== undefined ? {
              set: prop.mandateVersion.activeFor.scopeKind
            } : undefined,
          klass: prop.mandateVersion.activeFor.klass !== undefined ? {
              set: prop.mandateVersion.activeFor.klass
            } : undefined,
          name: prop.mandateVersion.activeFor.name !== undefined ? {
              set: prop.mandateVersion.activeFor.name
            } : undefined,
          personaScope: prop.mandateVersion.activeFor.personaScope !== undefined ? {
              set: prop.mandateVersion.activeFor.personaScope
            } : undefined,
          deletedAt: prop.mandateVersion.activeFor.deletedAt !== undefined ? {
              set: prop.mandateVersion.activeFor.deletedAt
            } : undefined,
      organization: prop.mandateVersion.activeFor.organization ? 
      typeof prop.mandateVersion.activeFor.organization === 'object' && Object.keys(prop.mandateVersion.activeFor.organization).length === 1 && (Object.keys(prop.mandateVersion.activeFor.organization)[0] === 'id' || Object.keys(prop.mandateVersion.activeFor.organization)[0] === 'symbol')
? {
      connect: {
        id: prop.mandateVersion.activeFor.organization.id
      }
} : { upsert: {
          where: {
            id: prop.mandateVersion.activeFor.organization.id !== undefined ? {
                equals: prop.mandateVersion.activeFor.organization.id
              } : undefined,
            name: prop.mandateVersion.activeFor.organization.name !== undefined ? {
                equals: prop.mandateVersion.activeFor.organization.name
              } : undefined,
            slug: prop.mandateVersion.activeFor.organization.slug !== undefined ? {
                equals: prop.mandateVersion.activeFor.organization.slug
              } : undefined,
          },
          update: {
            id: prop.mandateVersion.activeFor.organization.id !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.id
              } : undefined,
            name: prop.mandateVersion.activeFor.organization.name !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.name
              } : undefined,
            slug: prop.mandateVersion.activeFor.organization.slug !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.slug
              } : undefined,
            logoUrl: prop.mandateVersion.activeFor.organization.logoUrl !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.logoUrl
              } : undefined,
            website: prop.mandateVersion.activeFor.organization.website !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.website
              } : undefined,
            businessType: prop.mandateVersion.activeFor.organization.businessType !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.businessType
              } : undefined,
            emailDomains: prop.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.emailDomains
              } : undefined,
            jurisdiction: prop.mandateVersion.activeFor.organization.jurisdiction !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.jurisdiction
              } : undefined,
            regulatoryStatus: prop.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.regulatoryStatus
              } : undefined,
            description: prop.mandateVersion.activeFor.organization.description !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.description
              } : undefined,
            tradingDefaults: prop.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? prop.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: prop.mandateVersion.activeFor.organization.deletedAt !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.deletedAt
              } : undefined,
          },
          create: {
            name: prop.mandateVersion.activeFor.organization.name !== undefined ? prop.mandateVersion.activeFor.organization.name : undefined,
            slug: prop.mandateVersion.activeFor.organization.slug !== undefined ? prop.mandateVersion.activeFor.organization.slug : undefined,
            logoUrl: prop.mandateVersion.activeFor.organization.logoUrl !== undefined ? prop.mandateVersion.activeFor.organization.logoUrl : undefined,
            website: prop.mandateVersion.activeFor.organization.website !== undefined ? prop.mandateVersion.activeFor.organization.website : undefined,
            businessType: prop.mandateVersion.activeFor.organization.businessType !== undefined ? prop.mandateVersion.activeFor.organization.businessType : undefined,
            emailDomains: prop.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.emailDomains 
               } : undefined,
            jurisdiction: prop.mandateVersion.activeFor.organization.jurisdiction !== undefined ? prop.mandateVersion.activeFor.organization.jurisdiction : undefined,
            regulatoryStatus: prop.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? prop.mandateVersion.activeFor.organization.regulatoryStatus : undefined,
            description: prop.mandateVersion.activeFor.organization.description !== undefined ? prop.mandateVersion.activeFor.organization.description : undefined,
            tradingDefaults: prop.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? prop.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: prop.mandateVersion.activeFor.organization.deletedAt !== undefined ? prop.mandateVersion.activeFor.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: prop.mandateVersion.activeFor.fund ? 
      typeof prop.mandateVersion.activeFor.fund === 'object' && Object.keys(prop.mandateVersion.activeFor.fund).length === 1 && (Object.keys(prop.mandateVersion.activeFor.fund)[0] === 'id' || Object.keys(prop.mandateVersion.activeFor.fund)[0] === 'symbol')
? {
      connect: {
        id: prop.mandateVersion.activeFor.fund.id
      }
} : { upsert: {
          where: {
            id: prop.mandateVersion.activeFor.fund.id !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.id
              } : undefined,
            name: prop.mandateVersion.activeFor.fund.name !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.name
              } : undefined,
            slug: prop.mandateVersion.activeFor.fund.slug !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.slug
              } : undefined,
            status: prop.mandateVersion.activeFor.fund.status !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.status
              } : undefined,
            organizationId: prop.mandateVersion.activeFor.fund.organizationId !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.organizationId
              } : undefined,
            managerId: prop.mandateVersion.activeFor.fund.managerId !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.managerId
              } : undefined,
            operatorId: prop.mandateVersion.activeFor.fund.operatorId !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.operatorId
              } : undefined,
          },
          update: {
            id: prop.mandateVersion.activeFor.fund.id !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.id
              } : undefined,
            name: prop.mandateVersion.activeFor.fund.name !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.name
              } : undefined,
            slug: prop.mandateVersion.activeFor.fund.slug !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.slug
              } : undefined,
            description: prop.mandateVersion.activeFor.fund.description !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.description
              } : undefined,
            status: prop.mandateVersion.activeFor.fund.status !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.status
              } : undefined,
            currency: prop.mandateVersion.activeFor.fund.currency !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.currency
              } : undefined,
            inceptionDate: prop.mandateVersion.activeFor.fund.inceptionDate !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.inceptionDate
              } : undefined,
            aum: prop.mandateVersion.activeFor.fund.aum !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.aum
              } : undefined,
            navPerShare: prop.mandateVersion.activeFor.fund.navPerShare !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.navPerShare
              } : undefined,
            sharesOutstanding: prop.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.sharesOutstanding
              } : undefined,
            highWaterMarkNav: prop.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.highWaterMarkNav
              } : undefined,
            fees: prop.mandateVersion.activeFor.fund.fees !== undefined ? prop.mandateVersion.activeFor.fund.fees : undefined,
            terms: prop.mandateVersion.activeFor.fund.terms !== undefined ? prop.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: prop.mandateVersion.activeFor.fund.regulatory !== undefined ? prop.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: prop.mandateVersion.activeFor.fund.serviceProviders !== undefined ? prop.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: prop.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? prop.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: prop.mandateVersion.activeFor.fund.deletedAt !== undefined ? {
                set: prop.mandateVersion.activeFor.fund.deletedAt
              } : undefined,
          },
          create: {
            name: prop.mandateVersion.activeFor.fund.name !== undefined ? prop.mandateVersion.activeFor.fund.name : undefined,
            slug: prop.mandateVersion.activeFor.fund.slug !== undefined ? prop.mandateVersion.activeFor.fund.slug : undefined,
            description: prop.mandateVersion.activeFor.fund.description !== undefined ? prop.mandateVersion.activeFor.fund.description : undefined,
            status: prop.mandateVersion.activeFor.fund.status !== undefined ? prop.mandateVersion.activeFor.fund.status : undefined,
            currency: prop.mandateVersion.activeFor.fund.currency !== undefined ? prop.mandateVersion.activeFor.fund.currency : undefined,
            inceptionDate: prop.mandateVersion.activeFor.fund.inceptionDate !== undefined ? prop.mandateVersion.activeFor.fund.inceptionDate : undefined,
            aum: prop.mandateVersion.activeFor.fund.aum !== undefined ? prop.mandateVersion.activeFor.fund.aum : undefined,
            navPerShare: prop.mandateVersion.activeFor.fund.navPerShare !== undefined ? prop.mandateVersion.activeFor.fund.navPerShare : undefined,
            sharesOutstanding: prop.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? prop.mandateVersion.activeFor.fund.sharesOutstanding : undefined,
            highWaterMarkNav: prop.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? prop.mandateVersion.activeFor.fund.highWaterMarkNav : undefined,
            fees: prop.mandateVersion.activeFor.fund.fees !== undefined ? prop.mandateVersion.activeFor.fund.fees : undefined,
            terms: prop.mandateVersion.activeFor.fund.terms !== undefined ? prop.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: prop.mandateVersion.activeFor.fund.regulatory !== undefined ? prop.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: prop.mandateVersion.activeFor.fund.serviceProviders !== undefined ? prop.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: prop.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? prop.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: prop.mandateVersion.activeFor.fund.deletedAt !== undefined ? prop.mandateVersion.activeFor.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: prop.mandateVersion.activeFor.owner ? 
      typeof prop.mandateVersion.activeFor.owner === 'object' && Object.keys(prop.mandateVersion.activeFor.owner).length === 1 && (Object.keys(prop.mandateVersion.activeFor.owner)[0] === 'id' || Object.keys(prop.mandateVersion.activeFor.owner)[0] === 'symbol')
? {
      connect: {
        id: prop.mandateVersion.activeFor.owner.id
      }
} : { upsert: {
          where: {
            id: prop.mandateVersion.activeFor.owner.id !== undefined ? {
                equals: prop.mandateVersion.activeFor.owner.id
              } : undefined,
            name: prop.mandateVersion.activeFor.owner.name !== undefined ? {
                equals: prop.mandateVersion.activeFor.owner.name
              } : undefined,
            email: prop.mandateVersion.activeFor.owner.email !== undefined ? {
                equals: prop.mandateVersion.activeFor.owner.email
              } : undefined,
            customerId: prop.mandateVersion.activeFor.owner.customerId !== undefined ? {
                equals: prop.mandateVersion.activeFor.owner.customerId
              } : undefined,
          },
          update: {
            id: prop.mandateVersion.activeFor.owner.id !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.id
              } : undefined,
            name: prop.mandateVersion.activeFor.owner.name !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.name
              } : undefined,
            email: prop.mandateVersion.activeFor.owner.email !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.email
              } : undefined,
            emailVerified: prop.mandateVersion.activeFor.owner.emailVerified !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.emailVerified
              } : undefined,
            image: prop.mandateVersion.activeFor.owner.image !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.image
              } : undefined,
            avatarUrl: prop.mandateVersion.activeFor.owner.avatarUrl !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.avatarUrl
              } : undefined,
            onboardingComplete: prop.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.onboardingComplete
              } : undefined,
            signupCategory: prop.mandateVersion.activeFor.owner.signupCategory !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.signupCategory
              } : undefined,
            deletedAt: prop.mandateVersion.activeFor.owner.deletedAt !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.deletedAt
              } : undefined,
            role: prop.mandateVersion.activeFor.owner.role !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.role
              } : undefined,
            bio: prop.mandateVersion.activeFor.owner.bio !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.bio
              } : undefined,
            jobTitle: prop.mandateVersion.activeFor.owner.jobTitle !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.jobTitle
              } : undefined,
            currentAccount: prop.mandateVersion.activeFor.owner.currentAccount !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.currentAccount
              } : undefined,
            plan: prop.mandateVersion.activeFor.owner.plan !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.plan
              } : undefined,
            openaiAPIKey: prop.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.openaiAPIKey
              } : undefined,
            openaiModel: prop.mandateVersion.activeFor.owner.openaiModel !== undefined ? {
                set: prop.mandateVersion.activeFor.owner.openaiModel
              } : undefined,
          },
          create: {
            name: prop.mandateVersion.activeFor.owner.name !== undefined ? prop.mandateVersion.activeFor.owner.name : undefined,
            email: prop.mandateVersion.activeFor.owner.email !== undefined ? prop.mandateVersion.activeFor.owner.email : undefined,
            emailVerified: prop.mandateVersion.activeFor.owner.emailVerified !== undefined ? prop.mandateVersion.activeFor.owner.emailVerified : undefined,
            image: prop.mandateVersion.activeFor.owner.image !== undefined ? prop.mandateVersion.activeFor.owner.image : undefined,
            avatarUrl: prop.mandateVersion.activeFor.owner.avatarUrl !== undefined ? prop.mandateVersion.activeFor.owner.avatarUrl : undefined,
            onboardingComplete: prop.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? prop.mandateVersion.activeFor.owner.onboardingComplete : undefined,
            signupCategory: prop.mandateVersion.activeFor.owner.signupCategory !== undefined ? prop.mandateVersion.activeFor.owner.signupCategory : undefined,
            deletedAt: prop.mandateVersion.activeFor.owner.deletedAt !== undefined ? prop.mandateVersion.activeFor.owner.deletedAt : undefined,
            role: prop.mandateVersion.activeFor.owner.role !== undefined ? prop.mandateVersion.activeFor.owner.role : undefined,
            bio: prop.mandateVersion.activeFor.owner.bio !== undefined ? prop.mandateVersion.activeFor.owner.bio : undefined,
            jobTitle: prop.mandateVersion.activeFor.owner.jobTitle !== undefined ? prop.mandateVersion.activeFor.owner.jobTitle : undefined,
            currentAccount: prop.mandateVersion.activeFor.owner.currentAccount !== undefined ? prop.mandateVersion.activeFor.owner.currentAccount : undefined,
            plan: prop.mandateVersion.activeFor.owner.plan !== undefined ? prop.mandateVersion.activeFor.owner.plan : undefined,
            openaiAPIKey: prop.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? prop.mandateVersion.activeFor.owner.openaiAPIKey : undefined,
            openaiModel: prop.mandateVersion.activeFor.owner.openaiModel !== undefined ? prop.mandateVersion.activeFor.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      versions: prop.mandateVersion.activeFor.versions ? 
      Array.isArray(prop.mandateVersion.activeFor.versions) && prop.mandateVersion.activeFor.versions.length > 0 && prop.mandateVersion.activeFor.versions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.mandateVersion.activeFor.versions.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.mandateVersion.activeFor.versions.map((item) => ({
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
        },
        create: {
          scopeKind: prop.mandateVersion.activeFor.scopeKind !== undefined ? prop.mandateVersion.activeFor.scopeKind : undefined,
          klass: prop.mandateVersion.activeFor.klass !== undefined ? prop.mandateVersion.activeFor.klass : undefined,
          name: prop.mandateVersion.activeFor.name !== undefined ? prop.mandateVersion.activeFor.name : undefined,
          personaScope: prop.mandateVersion.activeFor.personaScope !== undefined ? prop.mandateVersion.activeFor.personaScope : undefined,
          deletedAt: prop.mandateVersion.activeFor.deletedAt !== undefined ? prop.mandateVersion.activeFor.deletedAt : undefined,
      organization: prop.mandateVersion.activeFor.organization ? 
        typeof prop.mandateVersion.activeFor.organization === 'object' && Object.keys(prop.mandateVersion.activeFor.organization).length === 1 && Object.keys(prop.mandateVersion.activeFor.organization)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.activeFor.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.activeFor.organization.id !== undefined ? prop.mandateVersion.activeFor.organization.id : undefined,
            slug: prop.mandateVersion.activeFor.organization.slug !== undefined ? prop.mandateVersion.activeFor.organization.slug : undefined,
            name: prop.mandateVersion.activeFor.organization.name !== undefined ? {
                equals: prop.mandateVersion.activeFor.organization.name 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.activeFor.organization.name !== undefined ? prop.mandateVersion.activeFor.organization.name : undefined,
            slug: prop.mandateVersion.activeFor.organization.slug !== undefined ? prop.mandateVersion.activeFor.organization.slug : undefined,
            logoUrl: prop.mandateVersion.activeFor.organization.logoUrl !== undefined ? prop.mandateVersion.activeFor.organization.logoUrl : undefined,
            website: prop.mandateVersion.activeFor.organization.website !== undefined ? prop.mandateVersion.activeFor.organization.website : undefined,
            businessType: prop.mandateVersion.activeFor.organization.businessType !== undefined ? prop.mandateVersion.activeFor.organization.businessType : undefined,
            emailDomains: prop.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.emailDomains 
               } : undefined,
            jurisdiction: prop.mandateVersion.activeFor.organization.jurisdiction !== undefined ? prop.mandateVersion.activeFor.organization.jurisdiction : undefined,
            regulatoryStatus: prop.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? prop.mandateVersion.activeFor.organization.regulatoryStatus : undefined,
            description: prop.mandateVersion.activeFor.organization.description !== undefined ? prop.mandateVersion.activeFor.organization.description : undefined,
            tradingDefaults: prop.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? prop.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: prop.mandateVersion.activeFor.organization.deletedAt !== undefined ? prop.mandateVersion.activeFor.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: prop.mandateVersion.activeFor.fund ? 
        typeof prop.mandateVersion.activeFor.fund === 'object' && Object.keys(prop.mandateVersion.activeFor.fund).length === 1 && Object.keys(prop.mandateVersion.activeFor.fund)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.activeFor.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.activeFor.fund.id !== undefined ? prop.mandateVersion.activeFor.fund.id : undefined,
            name: prop.mandateVersion.activeFor.fund.name !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.name 
               } : undefined,
            slug: prop.mandateVersion.activeFor.fund.slug !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.slug 
               } : undefined,
            status: prop.mandateVersion.activeFor.fund.status !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.status 
               } : undefined,
            organizationId: prop.mandateVersion.activeFor.fund.organizationId !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.organizationId 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.activeFor.fund.name !== undefined ? prop.mandateVersion.activeFor.fund.name : undefined,
            slug: prop.mandateVersion.activeFor.fund.slug !== undefined ? prop.mandateVersion.activeFor.fund.slug : undefined,
            description: prop.mandateVersion.activeFor.fund.description !== undefined ? prop.mandateVersion.activeFor.fund.description : undefined,
            status: prop.mandateVersion.activeFor.fund.status !== undefined ? prop.mandateVersion.activeFor.fund.status : undefined,
            currency: prop.mandateVersion.activeFor.fund.currency !== undefined ? prop.mandateVersion.activeFor.fund.currency : undefined,
            inceptionDate: prop.mandateVersion.activeFor.fund.inceptionDate !== undefined ? prop.mandateVersion.activeFor.fund.inceptionDate : undefined,
            aum: prop.mandateVersion.activeFor.fund.aum !== undefined ? prop.mandateVersion.activeFor.fund.aum : undefined,
            navPerShare: prop.mandateVersion.activeFor.fund.navPerShare !== undefined ? prop.mandateVersion.activeFor.fund.navPerShare : undefined,
            sharesOutstanding: prop.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? prop.mandateVersion.activeFor.fund.sharesOutstanding : undefined,
            highWaterMarkNav: prop.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? prop.mandateVersion.activeFor.fund.highWaterMarkNav : undefined,
            fees: prop.mandateVersion.activeFor.fund.fees !== undefined ? prop.mandateVersion.activeFor.fund.fees : undefined,
            terms: prop.mandateVersion.activeFor.fund.terms !== undefined ? prop.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: prop.mandateVersion.activeFor.fund.regulatory !== undefined ? prop.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: prop.mandateVersion.activeFor.fund.serviceProviders !== undefined ? prop.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: prop.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? prop.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: prop.mandateVersion.activeFor.fund.deletedAt !== undefined ? prop.mandateVersion.activeFor.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: prop.mandateVersion.activeFor.owner ? 
        typeof prop.mandateVersion.activeFor.owner === 'object' && Object.keys(prop.mandateVersion.activeFor.owner).length === 1 && Object.keys(prop.mandateVersion.activeFor.owner)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.activeFor.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.activeFor.owner.id !== undefined ? prop.mandateVersion.activeFor.owner.id : undefined,
            email: prop.mandateVersion.activeFor.owner.email !== undefined ? prop.mandateVersion.activeFor.owner.email : undefined,
            name: prop.mandateVersion.activeFor.owner.name !== undefined ? {
                equals: prop.mandateVersion.activeFor.owner.name 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.activeFor.owner.name !== undefined ? prop.mandateVersion.activeFor.owner.name : undefined,
            email: prop.mandateVersion.activeFor.owner.email !== undefined ? prop.mandateVersion.activeFor.owner.email : undefined,
            emailVerified: prop.mandateVersion.activeFor.owner.emailVerified !== undefined ? prop.mandateVersion.activeFor.owner.emailVerified : undefined,
            image: prop.mandateVersion.activeFor.owner.image !== undefined ? prop.mandateVersion.activeFor.owner.image : undefined,
            avatarUrl: prop.mandateVersion.activeFor.owner.avatarUrl !== undefined ? prop.mandateVersion.activeFor.owner.avatarUrl : undefined,
            onboardingComplete: prop.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? prop.mandateVersion.activeFor.owner.onboardingComplete : undefined,
            signupCategory: prop.mandateVersion.activeFor.owner.signupCategory !== undefined ? prop.mandateVersion.activeFor.owner.signupCategory : undefined,
            deletedAt: prop.mandateVersion.activeFor.owner.deletedAt !== undefined ? prop.mandateVersion.activeFor.owner.deletedAt : undefined,
            role: prop.mandateVersion.activeFor.owner.role !== undefined ? prop.mandateVersion.activeFor.owner.role : undefined,
            bio: prop.mandateVersion.activeFor.owner.bio !== undefined ? prop.mandateVersion.activeFor.owner.bio : undefined,
            jobTitle: prop.mandateVersion.activeFor.owner.jobTitle !== undefined ? prop.mandateVersion.activeFor.owner.jobTitle : undefined,
            currentAccount: prop.mandateVersion.activeFor.owner.currentAccount !== undefined ? prop.mandateVersion.activeFor.owner.currentAccount : undefined,
            plan: prop.mandateVersion.activeFor.owner.plan !== undefined ? prop.mandateVersion.activeFor.owner.plan : undefined,
            openaiAPIKey: prop.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? prop.mandateVersion.activeFor.owner.openaiAPIKey : undefined,
            openaiModel: prop.mandateVersion.activeFor.owner.openaiModel !== undefined ? prop.mandateVersion.activeFor.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      versions: prop.mandateVersion.activeFor.versions ? 
        Array.isArray(prop.mandateVersion.activeFor.versions) && prop.mandateVersion.activeFor.versions.length > 0 &&  prop.mandateVersion.activeFor.versions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.activeFor.versions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.activeFor.versions.map((item) => ({
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
        },
      }
    } : undefined,
      },
      create: {
        versionLabel: prop.mandateVersion.versionLabel !== undefined ? prop.mandateVersion.versionLabel : undefined,
        versionSeq: prop.mandateVersion.versionSeq !== undefined ? prop.mandateVersion.versionSeq : undefined,
        status: prop.mandateVersion.status !== undefined ? prop.mandateVersion.status : undefined,
        summary: prop.mandateVersion.summary !== undefined ? prop.mandateVersion.summary : undefined,
        charterBody: prop.mandateVersion.charterBody !== undefined ? prop.mandateVersion.charterBody : undefined,
    mandate: prop.mandateVersion.mandate ? 
      typeof prop.mandateVersion.mandate === 'object' && Object.keys(prop.mandateVersion.mandate).length === 1 && Object.keys(prop.mandateVersion.mandate)[0] === 'id'
    ? { connect: {
          id: prop.mandateVersion.mandate.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: prop.mandateVersion.mandate.id !== undefined ? prop.mandateVersion.mandate.id : undefined,
          activeVersionId: prop.mandateVersion.mandate.activeVersionId !== undefined ? prop.mandateVersion.mandate.activeVersionId : undefined,
          name: prop.mandateVersion.mandate.name !== undefined ? {
              equals: prop.mandateVersion.mandate.name 
             } : undefined,
          organizationId: prop.mandateVersion.mandate.organizationId !== undefined ? {
              equals: prop.mandateVersion.mandate.organizationId 
             } : undefined,
        },
        create: {
          scopeKind: prop.mandateVersion.mandate.scopeKind !== undefined ? prop.mandateVersion.mandate.scopeKind : undefined,
          klass: prop.mandateVersion.mandate.klass !== undefined ? prop.mandateVersion.mandate.klass : undefined,
          name: prop.mandateVersion.mandate.name !== undefined ? prop.mandateVersion.mandate.name : undefined,
          personaScope: prop.mandateVersion.mandate.personaScope !== undefined ? prop.mandateVersion.mandate.personaScope : undefined,
          deletedAt: prop.mandateVersion.mandate.deletedAt !== undefined ? prop.mandateVersion.mandate.deletedAt : undefined,
      organization: prop.mandateVersion.mandate.organization ? 
        typeof prop.mandateVersion.mandate.organization === 'object' && Object.keys(prop.mandateVersion.mandate.organization).length === 1 && Object.keys(prop.mandateVersion.mandate.organization)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.mandate.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.mandate.organization.id !== undefined ? prop.mandateVersion.mandate.organization.id : undefined,
            slug: prop.mandateVersion.mandate.organization.slug !== undefined ? prop.mandateVersion.mandate.organization.slug : undefined,
            name: prop.mandateVersion.mandate.organization.name !== undefined ? {
                equals: prop.mandateVersion.mandate.organization.name 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.mandate.organization.name !== undefined ? prop.mandateVersion.mandate.organization.name : undefined,
            slug: prop.mandateVersion.mandate.organization.slug !== undefined ? prop.mandateVersion.mandate.organization.slug : undefined,
            logoUrl: prop.mandateVersion.mandate.organization.logoUrl !== undefined ? prop.mandateVersion.mandate.organization.logoUrl : undefined,
            website: prop.mandateVersion.mandate.organization.website !== undefined ? prop.mandateVersion.mandate.organization.website : undefined,
            businessType: prop.mandateVersion.mandate.organization.businessType !== undefined ? prop.mandateVersion.mandate.organization.businessType : undefined,
            emailDomains: prop.mandateVersion.mandate.organization.emailDomains !== undefined ? {
                set: prop.mandateVersion.mandate.organization.emailDomains 
               } : undefined,
            jurisdiction: prop.mandateVersion.mandate.organization.jurisdiction !== undefined ? prop.mandateVersion.mandate.organization.jurisdiction : undefined,
            regulatoryStatus: prop.mandateVersion.mandate.organization.regulatoryStatus !== undefined ? prop.mandateVersion.mandate.organization.regulatoryStatus : undefined,
            description: prop.mandateVersion.mandate.organization.description !== undefined ? prop.mandateVersion.mandate.organization.description : undefined,
            tradingDefaults: prop.mandateVersion.mandate.organization.tradingDefaults !== undefined ? prop.mandateVersion.mandate.organization.tradingDefaults : undefined,
            deletedAt: prop.mandateVersion.mandate.organization.deletedAt !== undefined ? prop.mandateVersion.mandate.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: prop.mandateVersion.mandate.fund ? 
        typeof prop.mandateVersion.mandate.fund === 'object' && Object.keys(prop.mandateVersion.mandate.fund).length === 1 && Object.keys(prop.mandateVersion.mandate.fund)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.mandate.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.mandate.fund.id !== undefined ? prop.mandateVersion.mandate.fund.id : undefined,
            name: prop.mandateVersion.mandate.fund.name !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.name 
               } : undefined,
            slug: prop.mandateVersion.mandate.fund.slug !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.slug 
               } : undefined,
            status: prop.mandateVersion.mandate.fund.status !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.status 
               } : undefined,
            organizationId: prop.mandateVersion.mandate.fund.organizationId !== undefined ? {
                equals: prop.mandateVersion.mandate.fund.organizationId 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.mandate.fund.name !== undefined ? prop.mandateVersion.mandate.fund.name : undefined,
            slug: prop.mandateVersion.mandate.fund.slug !== undefined ? prop.mandateVersion.mandate.fund.slug : undefined,
            description: prop.mandateVersion.mandate.fund.description !== undefined ? prop.mandateVersion.mandate.fund.description : undefined,
            status: prop.mandateVersion.mandate.fund.status !== undefined ? prop.mandateVersion.mandate.fund.status : undefined,
            currency: prop.mandateVersion.mandate.fund.currency !== undefined ? prop.mandateVersion.mandate.fund.currency : undefined,
            inceptionDate: prop.mandateVersion.mandate.fund.inceptionDate !== undefined ? prop.mandateVersion.mandate.fund.inceptionDate : undefined,
            aum: prop.mandateVersion.mandate.fund.aum !== undefined ? prop.mandateVersion.mandate.fund.aum : undefined,
            navPerShare: prop.mandateVersion.mandate.fund.navPerShare !== undefined ? prop.mandateVersion.mandate.fund.navPerShare : undefined,
            sharesOutstanding: prop.mandateVersion.mandate.fund.sharesOutstanding !== undefined ? prop.mandateVersion.mandate.fund.sharesOutstanding : undefined,
            highWaterMarkNav: prop.mandateVersion.mandate.fund.highWaterMarkNav !== undefined ? prop.mandateVersion.mandate.fund.highWaterMarkNav : undefined,
            fees: prop.mandateVersion.mandate.fund.fees !== undefined ? prop.mandateVersion.mandate.fund.fees : undefined,
            terms: prop.mandateVersion.mandate.fund.terms !== undefined ? prop.mandateVersion.mandate.fund.terms : undefined,
            regulatory: prop.mandateVersion.mandate.fund.regulatory !== undefined ? prop.mandateVersion.mandate.fund.regulatory : undefined,
            serviceProviders: prop.mandateVersion.mandate.fund.serviceProviders !== undefined ? prop.mandateVersion.mandate.fund.serviceProviders : undefined,
            tradingOverrides: prop.mandateVersion.mandate.fund.tradingOverrides !== undefined ? prop.mandateVersion.mandate.fund.tradingOverrides : undefined,
            deletedAt: prop.mandateVersion.mandate.fund.deletedAt !== undefined ? prop.mandateVersion.mandate.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: prop.mandateVersion.mandate.owner ? 
        typeof prop.mandateVersion.mandate.owner === 'object' && Object.keys(prop.mandateVersion.mandate.owner).length === 1 && Object.keys(prop.mandateVersion.mandate.owner)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.mandate.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.mandate.owner.id !== undefined ? prop.mandateVersion.mandate.owner.id : undefined,
            email: prop.mandateVersion.mandate.owner.email !== undefined ? prop.mandateVersion.mandate.owner.email : undefined,
            name: prop.mandateVersion.mandate.owner.name !== undefined ? {
                equals: prop.mandateVersion.mandate.owner.name 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.mandate.owner.name !== undefined ? prop.mandateVersion.mandate.owner.name : undefined,
            email: prop.mandateVersion.mandate.owner.email !== undefined ? prop.mandateVersion.mandate.owner.email : undefined,
            emailVerified: prop.mandateVersion.mandate.owner.emailVerified !== undefined ? prop.mandateVersion.mandate.owner.emailVerified : undefined,
            image: prop.mandateVersion.mandate.owner.image !== undefined ? prop.mandateVersion.mandate.owner.image : undefined,
            avatarUrl: prop.mandateVersion.mandate.owner.avatarUrl !== undefined ? prop.mandateVersion.mandate.owner.avatarUrl : undefined,
            onboardingComplete: prop.mandateVersion.mandate.owner.onboardingComplete !== undefined ? prop.mandateVersion.mandate.owner.onboardingComplete : undefined,
            signupCategory: prop.mandateVersion.mandate.owner.signupCategory !== undefined ? prop.mandateVersion.mandate.owner.signupCategory : undefined,
            deletedAt: prop.mandateVersion.mandate.owner.deletedAt !== undefined ? prop.mandateVersion.mandate.owner.deletedAt : undefined,
            role: prop.mandateVersion.mandate.owner.role !== undefined ? prop.mandateVersion.mandate.owner.role : undefined,
            bio: prop.mandateVersion.mandate.owner.bio !== undefined ? prop.mandateVersion.mandate.owner.bio : undefined,
            jobTitle: prop.mandateVersion.mandate.owner.jobTitle !== undefined ? prop.mandateVersion.mandate.owner.jobTitle : undefined,
            currentAccount: prop.mandateVersion.mandate.owner.currentAccount !== undefined ? prop.mandateVersion.mandate.owner.currentAccount : undefined,
            plan: prop.mandateVersion.mandate.owner.plan !== undefined ? prop.mandateVersion.mandate.owner.plan : undefined,
            openaiAPIKey: prop.mandateVersion.mandate.owner.openaiAPIKey !== undefined ? prop.mandateVersion.mandate.owner.openaiAPIKey : undefined,
            openaiModel: prop.mandateVersion.mandate.owner.openaiModel !== undefined ? prop.mandateVersion.mandate.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      activeVersion: prop.mandateVersion.mandate.activeVersion ? 
        typeof prop.mandateVersion.mandate.activeVersion === 'object' && Object.keys(prop.mandateVersion.mandate.activeVersion).length === 1 && Object.keys(prop.mandateVersion.mandate.activeVersion)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.mandate.activeVersion.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.mandate.activeVersion.id !== undefined ? prop.mandateVersion.mandate.activeVersion.id : undefined,
            mandateId: prop.mandateVersion.mandate.activeVersion.mandateId !== undefined ? {
                equals: prop.mandateVersion.mandate.activeVersion.mandateId 
               } : undefined,
            status: prop.mandateVersion.mandate.activeVersion.status !== undefined ? {
                equals: prop.mandateVersion.mandate.activeVersion.status 
               } : undefined,
          },
          create: {
            versionLabel: prop.mandateVersion.mandate.activeVersion.versionLabel !== undefined ? prop.mandateVersion.mandate.activeVersion.versionLabel : undefined,
            versionSeq: prop.mandateVersion.mandate.activeVersion.versionSeq !== undefined ? prop.mandateVersion.mandate.activeVersion.versionSeq : undefined,
            status: prop.mandateVersion.mandate.activeVersion.status !== undefined ? prop.mandateVersion.mandate.activeVersion.status : undefined,
            summary: prop.mandateVersion.mandate.activeVersion.summary !== undefined ? prop.mandateVersion.mandate.activeVersion.summary : undefined,
            charterBody: prop.mandateVersion.mandate.activeVersion.charterBody !== undefined ? prop.mandateVersion.mandate.activeVersion.charterBody : undefined,
          },
        }
      } : undefined,
        },
      }
    } : undefined,
    authoredBy: prop.mandateVersion.authoredBy ? 
      typeof prop.mandateVersion.authoredBy === 'object' && Object.keys(prop.mandateVersion.authoredBy).length === 1 && Object.keys(prop.mandateVersion.authoredBy)[0] === 'id'
    ? { connect: {
          id: prop.mandateVersion.authoredBy.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: prop.mandateVersion.authoredBy.id !== undefined ? prop.mandateVersion.authoredBy.id : undefined,
          email: prop.mandateVersion.authoredBy.email !== undefined ? prop.mandateVersion.authoredBy.email : undefined,
          name: prop.mandateVersion.authoredBy.name !== undefined ? {
              equals: prop.mandateVersion.authoredBy.name 
             } : undefined,
        },
        create: {
          name: prop.mandateVersion.authoredBy.name !== undefined ? prop.mandateVersion.authoredBy.name : undefined,
          email: prop.mandateVersion.authoredBy.email !== undefined ? prop.mandateVersion.authoredBy.email : undefined,
          emailVerified: prop.mandateVersion.authoredBy.emailVerified !== undefined ? prop.mandateVersion.authoredBy.emailVerified : undefined,
          image: prop.mandateVersion.authoredBy.image !== undefined ? prop.mandateVersion.authoredBy.image : undefined,
          avatarUrl: prop.mandateVersion.authoredBy.avatarUrl !== undefined ? prop.mandateVersion.authoredBy.avatarUrl : undefined,
          onboardingComplete: prop.mandateVersion.authoredBy.onboardingComplete !== undefined ? prop.mandateVersion.authoredBy.onboardingComplete : undefined,
          signupCategory: prop.mandateVersion.authoredBy.signupCategory !== undefined ? prop.mandateVersion.authoredBy.signupCategory : undefined,
          deletedAt: prop.mandateVersion.authoredBy.deletedAt !== undefined ? prop.mandateVersion.authoredBy.deletedAt : undefined,
          role: prop.mandateVersion.authoredBy.role !== undefined ? prop.mandateVersion.authoredBy.role : undefined,
          bio: prop.mandateVersion.authoredBy.bio !== undefined ? prop.mandateVersion.authoredBy.bio : undefined,
          jobTitle: prop.mandateVersion.authoredBy.jobTitle !== undefined ? prop.mandateVersion.authoredBy.jobTitle : undefined,
          currentAccount: prop.mandateVersion.authoredBy.currentAccount !== undefined ? prop.mandateVersion.authoredBy.currentAccount : undefined,
          plan: prop.mandateVersion.authoredBy.plan !== undefined ? prop.mandateVersion.authoredBy.plan : undefined,
          openaiAPIKey: prop.mandateVersion.authoredBy.openaiAPIKey !== undefined ? prop.mandateVersion.authoredBy.openaiAPIKey : undefined,
          openaiModel: prop.mandateVersion.authoredBy.openaiModel !== undefined ? prop.mandateVersion.authoredBy.openaiModel : undefined,
      customer: prop.mandateVersion.authoredBy.customer ? 
        typeof prop.mandateVersion.authoredBy.customer === 'object' && Object.keys(prop.mandateVersion.authoredBy.customer).length === 1 && Object.keys(prop.mandateVersion.authoredBy.customer)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.authoredBy.customer.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.authoredBy.customer.id !== undefined ? prop.mandateVersion.authoredBy.customer.id : undefined,
            stripeCustomerId: prop.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? prop.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: prop.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? prop.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            authUserId: prop.mandateVersion.authoredBy.customer.authUserId !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.authUserId 
               } : undefined,
            name: prop.mandateVersion.authoredBy.customer.name !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.name 
               } : undefined,
            stripePriceId: prop.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? {
                equals: prop.mandateVersion.authoredBy.customer.stripePriceId 
               } : undefined,
          },
          create: {
            authUserId: prop.mandateVersion.authoredBy.customer.authUserId !== undefined ? prop.mandateVersion.authoredBy.customer.authUserId : undefined,
            name: prop.mandateVersion.authoredBy.customer.name !== undefined ? prop.mandateVersion.authoredBy.customer.name : undefined,
            plan: prop.mandateVersion.authoredBy.customer.plan !== undefined ? prop.mandateVersion.authoredBy.customer.plan : undefined,
            stripeCustomerId: prop.mandateVersion.authoredBy.customer.stripeCustomerId !== undefined ? prop.mandateVersion.authoredBy.customer.stripeCustomerId : undefined,
            stripeSubscriptionId: prop.mandateVersion.authoredBy.customer.stripeSubscriptionId !== undefined ? prop.mandateVersion.authoredBy.customer.stripeSubscriptionId : undefined,
            stripePriceId: prop.mandateVersion.authoredBy.customer.stripePriceId !== undefined ? prop.mandateVersion.authoredBy.customer.stripePriceId : undefined,
            stripeCurrentPeriodEnd: prop.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd !== undefined ? prop.mandateVersion.authoredBy.customer.stripeCurrentPeriodEnd : undefined,
            jurisdiction: prop.mandateVersion.authoredBy.customer.jurisdiction !== undefined ? prop.mandateVersion.authoredBy.customer.jurisdiction : undefined,
            riskProfile: prop.mandateVersion.authoredBy.customer.riskProfile !== undefined ? prop.mandateVersion.authoredBy.customer.riskProfile : undefined,
            amlStatus: prop.mandateVersion.authoredBy.customer.amlStatus !== undefined ? prop.mandateVersion.authoredBy.customer.amlStatus : undefined,
            lastKycUpdate: prop.mandateVersion.authoredBy.customer.lastKycUpdate !== undefined ? prop.mandateVersion.authoredBy.customer.lastKycUpdate : undefined,
          },
        }
      } : undefined,
      accounts: prop.mandateVersion.authoredBy.accounts ? 
        Array.isArray(prop.mandateVersion.authoredBy.accounts) && prop.mandateVersion.authoredBy.accounts.length > 0 &&  prop.mandateVersion.authoredBy.accounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.accounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.accounts.map((item) => ({
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
      sessions: prop.mandateVersion.authoredBy.sessions ? 
        Array.isArray(prop.mandateVersion.authoredBy.sessions) && prop.mandateVersion.authoredBy.sessions.length > 0 &&  prop.mandateVersion.authoredBy.sessions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.sessions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.sessions.map((item) => ({
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
      authenticators: prop.mandateVersion.authoredBy.authenticators ? 
        Array.isArray(prop.mandateVersion.authoredBy.authenticators) && prop.mandateVersion.authoredBy.authenticators.length > 0 &&  prop.mandateVersion.authoredBy.authenticators.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.authenticators.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.authenticators.map((item) => ({
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
      alpacaAccounts: prop.mandateVersion.authoredBy.alpacaAccounts ? 
        Array.isArray(prop.mandateVersion.authoredBy.alpacaAccounts) && prop.mandateVersion.authoredBy.alpacaAccounts.length > 0 &&  prop.mandateVersion.authoredBy.alpacaAccounts.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.alpacaAccounts.map((item) => ({
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
      linkedProviders: prop.mandateVersion.authoredBy.linkedProviders ? 
        Array.isArray(prop.mandateVersion.authoredBy.linkedProviders) && prop.mandateVersion.authoredBy.linkedProviders.length > 0 &&  prop.mandateVersion.authoredBy.linkedProviders.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.linkedProviders.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.linkedProviders.map((item) => ({
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
      accountLinkingRequests: prop.mandateVersion.authoredBy.accountLinkingRequests ? 
        Array.isArray(prop.mandateVersion.authoredBy.accountLinkingRequests) && prop.mandateVersion.authoredBy.accountLinkingRequests.length > 0 &&  prop.mandateVersion.authoredBy.accountLinkingRequests.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.accountLinkingRequests.map((item) => ({
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
      reviewedWaitlistEntries: prop.mandateVersion.authoredBy.reviewedWaitlistEntries ? 
        Array.isArray(prop.mandateVersion.authoredBy.reviewedWaitlistEntries) && prop.mandateVersion.authoredBy.reviewedWaitlistEntries.length > 0 &&  prop.mandateVersion.authoredBy.reviewedWaitlistEntries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.reviewedWaitlistEntries.map((item) => ({
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
      llmConfiguration: prop.mandateVersion.authoredBy.llmConfiguration ? 
        typeof prop.mandateVersion.authoredBy.llmConfiguration === 'object' && Object.keys(prop.mandateVersion.authoredBy.llmConfiguration).length === 1 && Object.keys(prop.mandateVersion.authoredBy.llmConfiguration)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.authoredBy.llmConfiguration.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.authoredBy.llmConfiguration.id !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.id : undefined,
            userId: prop.mandateVersion.authoredBy.llmConfiguration.userId !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.userId : undefined,
          },
          create: {
            defaultProvider: prop.mandateVersion.authoredBy.llmConfiguration.defaultProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.defaultProvider : undefined,
            miniProvider: prop.mandateVersion.authoredBy.llmConfiguration.miniProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.miniProvider : undefined,
            normalProvider: prop.mandateVersion.authoredBy.llmConfiguration.normalProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.normalProvider : undefined,
            advancedProvider: prop.mandateVersion.authoredBy.llmConfiguration.advancedProvider !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.advancedProvider : undefined,
            miniModel: prop.mandateVersion.authoredBy.llmConfiguration.miniModel !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.miniModel : undefined,
            normalModel: prop.mandateVersion.authoredBy.llmConfiguration.normalModel !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.normalModel : undefined,
            advancedModel: prop.mandateVersion.authoredBy.llmConfiguration.advancedModel !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.advancedModel : undefined,
            openaiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.openaiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.openaiApiKey : undefined,
            anthropicApiKey: prop.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.anthropicApiKey : undefined,
            deepseekApiKey: prop.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.deepseekApiKey : undefined,
            kimiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.kimiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.kimiApiKey : undefined,
            qwenApiKey: prop.mandateVersion.authoredBy.llmConfiguration.qwenApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.qwenApiKey : undefined,
            xaiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.xaiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.xaiApiKey : undefined,
            geminiApiKey: prop.mandateVersion.authoredBy.llmConfiguration.geminiApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.geminiApiKey : undefined,
            deepinfraApiKey: prop.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey !== undefined ? prop.mandateVersion.authoredBy.llmConfiguration.deepinfraApiKey : undefined,
          },
        }
      } : undefined,
      orgMemberships: prop.mandateVersion.authoredBy.orgMemberships ? 
        Array.isArray(prop.mandateVersion.authoredBy.orgMemberships) && prop.mandateVersion.authoredBy.orgMemberships.length > 0 &&  prop.mandateVersion.authoredBy.orgMemberships.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.orgMemberships.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.orgMemberships.map((item) => ({
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
      fundAssignments: prop.mandateVersion.authoredBy.fundAssignments ? 
        Array.isArray(prop.mandateVersion.authoredBy.fundAssignments) && prop.mandateVersion.authoredBy.fundAssignments.length > 0 &&  prop.mandateVersion.authoredBy.fundAssignments.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.fundAssignments.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.fundAssignments.map((item) => ({
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
      managedFunds: prop.mandateVersion.authoredBy.managedFunds ? 
        Array.isArray(prop.mandateVersion.authoredBy.managedFunds) && prop.mandateVersion.authoredBy.managedFunds.length > 0 &&  prop.mandateVersion.authoredBy.managedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.managedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.managedFunds.map((item) => ({
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
      operatedFunds: prop.mandateVersion.authoredBy.operatedFunds ? 
        Array.isArray(prop.mandateVersion.authoredBy.operatedFunds) && prop.mandateVersion.authoredBy.operatedFunds.length > 0 &&  prop.mandateVersion.authoredBy.operatedFunds.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.operatedFunds.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.operatedFunds.map((item) => ({
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
      ownedMandates: prop.mandateVersion.authoredBy.ownedMandates ? 
        Array.isArray(prop.mandateVersion.authoredBy.ownedMandates) && prop.mandateVersion.authoredBy.ownedMandates.length > 0 &&  prop.mandateVersion.authoredBy.ownedMandates.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.ownedMandates.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.ownedMandates.map((item) => ({
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
      mandateApprovalsDecided: prop.mandateVersion.authoredBy.mandateApprovalsDecided ? 
        Array.isArray(prop.mandateVersion.authoredBy.mandateApprovalsDecided) && prop.mandateVersion.authoredBy.mandateApprovalsDecided.length > 0 &&  prop.mandateVersion.authoredBy.mandateApprovalsDecided.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.mandateApprovalsDecided.map((item) => ({
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
      investorProfiles: prop.mandateVersion.authoredBy.investorProfiles ? 
        Array.isArray(prop.mandateVersion.authoredBy.investorProfiles) && prop.mandateVersion.authoredBy.investorProfiles.length > 0 &&  prop.mandateVersion.authoredBy.investorProfiles.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.investorProfiles.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.investorProfiles.map((item) => ({
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
      notificationDeliveries: prop.mandateVersion.authoredBy.notificationDeliveries ? 
        Array.isArray(prop.mandateVersion.authoredBy.notificationDeliveries) && prop.mandateVersion.authoredBy.notificationDeliveries.length > 0 &&  prop.mandateVersion.authoredBy.notificationDeliveries.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.notificationDeliveries.map((item) => ({
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
      notificationPreferences: prop.mandateVersion.authoredBy.notificationPreferences ? 
        Array.isArray(prop.mandateVersion.authoredBy.notificationPreferences) && prop.mandateVersion.authoredBy.notificationPreferences.length > 0 &&  prop.mandateVersion.authoredBy.notificationPreferences.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.notificationPreferences.map((item) => ({
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
      ownedStrategies: prop.mandateVersion.authoredBy.ownedStrategies ? 
        Array.isArray(prop.mandateVersion.authoredBy.ownedStrategies) && prop.mandateVersion.authoredBy.ownedStrategies.length > 0 &&  prop.mandateVersion.authoredBy.ownedStrategies.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.authoredBy.ownedStrategies.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            key: item.key !== undefined ? item.key : undefined,
          },
          create: {
            key: item.key !== undefined ? item.key : undefined,
            displayName: item.displayName !== undefined ? item.displayName : undefined,
            description: item.description !== undefined ? item.description : undefined,
            origin: item.origin !== undefined ? item.origin : undefined,
            lifecycleState: item.lifecycleState !== undefined ? item.lifecycleState : undefined,
            manifestHash: item.manifestHash !== undefined ? item.manifestHash : undefined,
            deletedAt: item.deletedAt !== undefined ? item.deletedAt : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
    approvals: prop.mandateVersion.approvals ? 
      Array.isArray(prop.mandateVersion.approvals) && prop.mandateVersion.approvals.length > 0 &&  prop.mandateVersion.approvals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.mandateVersion.approvals.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.mandateVersion.approvals.map((item) => ({
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
      decidedBy: item.decidedBy ? 
        typeof item.decidedBy === 'object' && Object.keys(item.decidedBy).length === 1 && Object.keys(item.decidedBy)[0] === 'id'
    ? { connect: {
            id: item.decidedBy.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.decidedBy.id !== undefined ? item.decidedBy.id : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            name: item.decidedBy.name !== undefined ? {
                equals: item.decidedBy.name 
               } : undefined,
          },
          create: {
            name: item.decidedBy.name !== undefined ? item.decidedBy.name : undefined,
            email: item.decidedBy.email !== undefined ? item.decidedBy.email : undefined,
            emailVerified: item.decidedBy.emailVerified !== undefined ? item.decidedBy.emailVerified : undefined,
            image: item.decidedBy.image !== undefined ? item.decidedBy.image : undefined,
            avatarUrl: item.decidedBy.avatarUrl !== undefined ? item.decidedBy.avatarUrl : undefined,
            onboardingComplete: item.decidedBy.onboardingComplete !== undefined ? item.decidedBy.onboardingComplete : undefined,
            signupCategory: item.decidedBy.signupCategory !== undefined ? item.decidedBy.signupCategory : undefined,
            deletedAt: item.decidedBy.deletedAt !== undefined ? item.decidedBy.deletedAt : undefined,
            role: item.decidedBy.role !== undefined ? item.decidedBy.role : undefined,
            bio: item.decidedBy.bio !== undefined ? item.decidedBy.bio : undefined,
            jobTitle: item.decidedBy.jobTitle !== undefined ? item.decidedBy.jobTitle : undefined,
            currentAccount: item.decidedBy.currentAccount !== undefined ? item.decidedBy.currentAccount : undefined,
            plan: item.decidedBy.plan !== undefined ? item.decidedBy.plan : undefined,
            openaiAPIKey: item.decidedBy.openaiAPIKey !== undefined ? item.decidedBy.openaiAPIKey : undefined,
            openaiModel: item.decidedBy.openaiModel !== undefined ? item.decidedBy.openaiModel : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    activeFor: prop.mandateVersion.activeFor ? 
      typeof prop.mandateVersion.activeFor === 'object' && Object.keys(prop.mandateVersion.activeFor).length === 1 && Object.keys(prop.mandateVersion.activeFor)[0] === 'id'
    ? { connect: {
          id: prop.mandateVersion.activeFor.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: prop.mandateVersion.activeFor.id !== undefined ? prop.mandateVersion.activeFor.id : undefined,
          activeVersionId: prop.mandateVersion.activeFor.activeVersionId !== undefined ? prop.mandateVersion.activeFor.activeVersionId : undefined,
          name: prop.mandateVersion.activeFor.name !== undefined ? {
              equals: prop.mandateVersion.activeFor.name 
             } : undefined,
          organizationId: prop.mandateVersion.activeFor.organizationId !== undefined ? {
              equals: prop.mandateVersion.activeFor.organizationId 
             } : undefined,
        },
        create: {
          scopeKind: prop.mandateVersion.activeFor.scopeKind !== undefined ? prop.mandateVersion.activeFor.scopeKind : undefined,
          klass: prop.mandateVersion.activeFor.klass !== undefined ? prop.mandateVersion.activeFor.klass : undefined,
          name: prop.mandateVersion.activeFor.name !== undefined ? prop.mandateVersion.activeFor.name : undefined,
          personaScope: prop.mandateVersion.activeFor.personaScope !== undefined ? prop.mandateVersion.activeFor.personaScope : undefined,
          deletedAt: prop.mandateVersion.activeFor.deletedAt !== undefined ? prop.mandateVersion.activeFor.deletedAt : undefined,
      organization: prop.mandateVersion.activeFor.organization ? 
        typeof prop.mandateVersion.activeFor.organization === 'object' && Object.keys(prop.mandateVersion.activeFor.organization).length === 1 && Object.keys(prop.mandateVersion.activeFor.organization)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.activeFor.organization.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.activeFor.organization.id !== undefined ? prop.mandateVersion.activeFor.organization.id : undefined,
            slug: prop.mandateVersion.activeFor.organization.slug !== undefined ? prop.mandateVersion.activeFor.organization.slug : undefined,
            name: prop.mandateVersion.activeFor.organization.name !== undefined ? {
                equals: prop.mandateVersion.activeFor.organization.name 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.activeFor.organization.name !== undefined ? prop.mandateVersion.activeFor.organization.name : undefined,
            slug: prop.mandateVersion.activeFor.organization.slug !== undefined ? prop.mandateVersion.activeFor.organization.slug : undefined,
            logoUrl: prop.mandateVersion.activeFor.organization.logoUrl !== undefined ? prop.mandateVersion.activeFor.organization.logoUrl : undefined,
            website: prop.mandateVersion.activeFor.organization.website !== undefined ? prop.mandateVersion.activeFor.organization.website : undefined,
            businessType: prop.mandateVersion.activeFor.organization.businessType !== undefined ? prop.mandateVersion.activeFor.organization.businessType : undefined,
            emailDomains: prop.mandateVersion.activeFor.organization.emailDomains !== undefined ? {
                set: prop.mandateVersion.activeFor.organization.emailDomains 
               } : undefined,
            jurisdiction: prop.mandateVersion.activeFor.organization.jurisdiction !== undefined ? prop.mandateVersion.activeFor.organization.jurisdiction : undefined,
            regulatoryStatus: prop.mandateVersion.activeFor.organization.regulatoryStatus !== undefined ? prop.mandateVersion.activeFor.organization.regulatoryStatus : undefined,
            description: prop.mandateVersion.activeFor.organization.description !== undefined ? prop.mandateVersion.activeFor.organization.description : undefined,
            tradingDefaults: prop.mandateVersion.activeFor.organization.tradingDefaults !== undefined ? prop.mandateVersion.activeFor.organization.tradingDefaults : undefined,
            deletedAt: prop.mandateVersion.activeFor.organization.deletedAt !== undefined ? prop.mandateVersion.activeFor.organization.deletedAt : undefined,
          },
        }
      } : undefined,
      fund: prop.mandateVersion.activeFor.fund ? 
        typeof prop.mandateVersion.activeFor.fund === 'object' && Object.keys(prop.mandateVersion.activeFor.fund).length === 1 && Object.keys(prop.mandateVersion.activeFor.fund)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.activeFor.fund.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.activeFor.fund.id !== undefined ? prop.mandateVersion.activeFor.fund.id : undefined,
            name: prop.mandateVersion.activeFor.fund.name !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.name 
               } : undefined,
            slug: prop.mandateVersion.activeFor.fund.slug !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.slug 
               } : undefined,
            status: prop.mandateVersion.activeFor.fund.status !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.status 
               } : undefined,
            organizationId: prop.mandateVersion.activeFor.fund.organizationId !== undefined ? {
                equals: prop.mandateVersion.activeFor.fund.organizationId 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.activeFor.fund.name !== undefined ? prop.mandateVersion.activeFor.fund.name : undefined,
            slug: prop.mandateVersion.activeFor.fund.slug !== undefined ? prop.mandateVersion.activeFor.fund.slug : undefined,
            description: prop.mandateVersion.activeFor.fund.description !== undefined ? prop.mandateVersion.activeFor.fund.description : undefined,
            status: prop.mandateVersion.activeFor.fund.status !== undefined ? prop.mandateVersion.activeFor.fund.status : undefined,
            currency: prop.mandateVersion.activeFor.fund.currency !== undefined ? prop.mandateVersion.activeFor.fund.currency : undefined,
            inceptionDate: prop.mandateVersion.activeFor.fund.inceptionDate !== undefined ? prop.mandateVersion.activeFor.fund.inceptionDate : undefined,
            aum: prop.mandateVersion.activeFor.fund.aum !== undefined ? prop.mandateVersion.activeFor.fund.aum : undefined,
            navPerShare: prop.mandateVersion.activeFor.fund.navPerShare !== undefined ? prop.mandateVersion.activeFor.fund.navPerShare : undefined,
            sharesOutstanding: prop.mandateVersion.activeFor.fund.sharesOutstanding !== undefined ? prop.mandateVersion.activeFor.fund.sharesOutstanding : undefined,
            highWaterMarkNav: prop.mandateVersion.activeFor.fund.highWaterMarkNav !== undefined ? prop.mandateVersion.activeFor.fund.highWaterMarkNav : undefined,
            fees: prop.mandateVersion.activeFor.fund.fees !== undefined ? prop.mandateVersion.activeFor.fund.fees : undefined,
            terms: prop.mandateVersion.activeFor.fund.terms !== undefined ? prop.mandateVersion.activeFor.fund.terms : undefined,
            regulatory: prop.mandateVersion.activeFor.fund.regulatory !== undefined ? prop.mandateVersion.activeFor.fund.regulatory : undefined,
            serviceProviders: prop.mandateVersion.activeFor.fund.serviceProviders !== undefined ? prop.mandateVersion.activeFor.fund.serviceProviders : undefined,
            tradingOverrides: prop.mandateVersion.activeFor.fund.tradingOverrides !== undefined ? prop.mandateVersion.activeFor.fund.tradingOverrides : undefined,
            deletedAt: prop.mandateVersion.activeFor.fund.deletedAt !== undefined ? prop.mandateVersion.activeFor.fund.deletedAt : undefined,
          },
        }
      } : undefined,
      owner: prop.mandateVersion.activeFor.owner ? 
        typeof prop.mandateVersion.activeFor.owner === 'object' && Object.keys(prop.mandateVersion.activeFor.owner).length === 1 && Object.keys(prop.mandateVersion.activeFor.owner)[0] === 'id'
    ? { connect: {
            id: prop.mandateVersion.activeFor.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.mandateVersion.activeFor.owner.id !== undefined ? prop.mandateVersion.activeFor.owner.id : undefined,
            email: prop.mandateVersion.activeFor.owner.email !== undefined ? prop.mandateVersion.activeFor.owner.email : undefined,
            name: prop.mandateVersion.activeFor.owner.name !== undefined ? {
                equals: prop.mandateVersion.activeFor.owner.name 
               } : undefined,
          },
          create: {
            name: prop.mandateVersion.activeFor.owner.name !== undefined ? prop.mandateVersion.activeFor.owner.name : undefined,
            email: prop.mandateVersion.activeFor.owner.email !== undefined ? prop.mandateVersion.activeFor.owner.email : undefined,
            emailVerified: prop.mandateVersion.activeFor.owner.emailVerified !== undefined ? prop.mandateVersion.activeFor.owner.emailVerified : undefined,
            image: prop.mandateVersion.activeFor.owner.image !== undefined ? prop.mandateVersion.activeFor.owner.image : undefined,
            avatarUrl: prop.mandateVersion.activeFor.owner.avatarUrl !== undefined ? prop.mandateVersion.activeFor.owner.avatarUrl : undefined,
            onboardingComplete: prop.mandateVersion.activeFor.owner.onboardingComplete !== undefined ? prop.mandateVersion.activeFor.owner.onboardingComplete : undefined,
            signupCategory: prop.mandateVersion.activeFor.owner.signupCategory !== undefined ? prop.mandateVersion.activeFor.owner.signupCategory : undefined,
            deletedAt: prop.mandateVersion.activeFor.owner.deletedAt !== undefined ? prop.mandateVersion.activeFor.owner.deletedAt : undefined,
            role: prop.mandateVersion.activeFor.owner.role !== undefined ? prop.mandateVersion.activeFor.owner.role : undefined,
            bio: prop.mandateVersion.activeFor.owner.bio !== undefined ? prop.mandateVersion.activeFor.owner.bio : undefined,
            jobTitle: prop.mandateVersion.activeFor.owner.jobTitle !== undefined ? prop.mandateVersion.activeFor.owner.jobTitle : undefined,
            currentAccount: prop.mandateVersion.activeFor.owner.currentAccount !== undefined ? prop.mandateVersion.activeFor.owner.currentAccount : undefined,
            plan: prop.mandateVersion.activeFor.owner.plan !== undefined ? prop.mandateVersion.activeFor.owner.plan : undefined,
            openaiAPIKey: prop.mandateVersion.activeFor.owner.openaiAPIKey !== undefined ? prop.mandateVersion.activeFor.owner.openaiAPIKey : undefined,
            openaiModel: prop.mandateVersion.activeFor.owner.openaiModel !== undefined ? prop.mandateVersion.activeFor.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      versions: prop.mandateVersion.activeFor.versions ? 
        Array.isArray(prop.mandateVersion.activeFor.versions) && prop.mandateVersion.activeFor.versions.length > 0 &&  prop.mandateVersion.activeFor.versions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.mandateVersion.activeFor.versions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.mandateVersion.activeFor.versions.map((item) => ({
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
        },
      }
    } : undefined,
      },
    }
  } : undefined,

          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_MANDATERULE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyMandateRule) {
          return response.data.updateManyMandateRule;
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
          logger.error("Non-retryable constraint violation in updateManyMandateRule", {
            operation: 'updateManyMandateRule',
            model: 'MandateRule',
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
          logger.warn("Database connection error in updateManyMandateRule, retrying...", {
            operation: 'updateManyMandateRule',
            model: 'MandateRule',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyMandateRule',
            model: 'MandateRule',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyMandateRule',
            model: 'MandateRule',
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
   * Delete a single MandateRule record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted MandateRule or null.
   */
  async delete(props: MandateRuleType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<MandateRuleType> {
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

        const DELETE_ONE_MANDATERULE = gql`
          mutation deleteOneMandateRule($where: MandateRuleWhereUniqueInput!) {
            deleteOneMandateRule(where: $where) {
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
          mutation: DELETE_ONE_MANDATERULE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneMandateRule) {
          return response.data.deleteOneMandateRule;
        } else {
          return null as unknown as MandateRuleType;
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
          logger.error("Non-retryable constraint violation in deleteOneMandateRule", {
            operation: 'deleteOneMandateRule',
            model: 'MandateRule',
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
          logger.warn("Database connection error in deleteOneMandateRule, retrying...", {
            operation: 'deleteOneMandateRule',
            model: 'MandateRule',
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
            operation: 'deleteOneMandateRule',
            model: 'MandateRule',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneMandateRule',
            model: 'MandateRule',
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
   * Retrieve a single MandateRule record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved MandateRule or null.
   */
  async get(props: MandateRuleType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<MandateRuleType | null> {
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

        const GET_MANDATERULE = gql`
          query getMandateRule($where: MandateRuleWhereUniqueInput!) {
            getMandateRule(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  mandateVersionId: props.mandateVersionId !== undefined ? {
    equals: props.mandateVersionId 
  } : undefined,
  sectionId: props.sectionId !== undefined ? {
    equals: props.sectionId 
  } : undefined,
  orderIdx: props.orderIdx !== undefined ? {
    equals: props.orderIdx 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_MANDATERULE,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getMandateRule ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No MandateRule found') {
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
          logger.warn("Database connection error in getMandateRule, retrying...", {
            operation: 'getMandateRule',
            model: 'MandateRule',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getMandateRule',
            model: 'MandateRule',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getMandateRule',
            model: 'MandateRule',
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
   * Retrieve all MandateRules records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of MandateRule records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<MandateRuleType[] | null> {
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

        const GET_ALL_MANDATERULE = gql`
          query getAllMandateRule {
            mandateRules {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_MANDATERULE,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.mandateRules ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No MandateRule found') {
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
          logger.warn("Database connection error in getAllMandateRule, retrying...", {
            operation: 'getAllMandateRule',
            model: 'MandateRule',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllMandateRule',
            model: 'MandateRule',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllMandateRule',
            model: 'MandateRule',
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
   * Find multiple MandateRule records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found MandateRule records or null.
   */
  async findMany(props: MandateRuleType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<MandateRuleType[] | null> {
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

        const FIND_MANY_MANDATERULE = gql`
          query findManyMandateRule($where: MandateRuleWhereInput!) {
            mandateRules(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
  mandateVersionId: props.mandateVersionId !== undefined ? {
    equals: props.mandateVersionId 
  } : undefined,
  sectionId: props.sectionId !== undefined ? {
    equals: props.sectionId 
  } : undefined,
  orderIdx: props.orderIdx !== undefined ? {
    equals: props.orderIdx 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyMandateRule requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_MANDATERULE,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.mandateRules) {
          return response.data.mandateRules;
        } else {
          return [] as MandateRuleType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No MandateRule found') {
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
          logger.warn("Database connection error in findManyMandateRule, retrying...", {
            operation: 'findManyMandateRule',
            model: 'MandateRule',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyMandateRule',
            model: 'MandateRule',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyMandateRule',
            model: 'MandateRule',
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


  
import { InstitutionalFlowSignal as InstitutionalFlowSignalType } from './generated/typegraphql-prisma/models/InstitutionalFlowSignal';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the InstitutionalFlowSignal model.
   */

  const selectionSet = `
    
  id
  symbol
  signalDate
  signalType
  signalStrength
  netFlow
  confidence
  metadata
  createdAt
  asset {
    id
    symbol
    name
    type
    logoUrl
    description
    cik
    exchange
    currency
    country
    sector
    industry
    address
    officialSite
    fiscalYearEnd
    latestQuarter
    marketCapitalization
    ebitda
    peRatio
    pegRatio
    bookValue
    dividendPerShare
    dividendYield
    eps
    revenuePerShareTTM
    profitMargin
    operatingMarginTTM
    returnOnAssetsTTM
    returnOnEquityTTM
    revenueTTM
    grossProfitTTM
    dilutedEPSTTM
    quarterlyEarningsGrowthYOY
    quarterlyRevenueGrowthYOY
    analystTargetPrice
    analystRatingStrongBuy
    analystRatingBuy
    analystRatingHold
    analystRatingSell
    analystRatingStrongSell
    trailingPE
    forwardPE
    priceToSalesRatioTTM
    priceToBookRatio
    evToRevenue
    evToEbitda
    beta
    week52High
    week52Low
    day50MovingAverage
    day200MovingAverage
    sharesOutstanding
    dividendDate
    exDividendDate
    askPrice
    bidPrice
    createdAt
    updatedAt
  }

  `;

  export const InstitutionalFlowSignal = {

    /**
     * Create a new InstitutionalFlowSignal record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created InstitutionalFlowSignal or null.
     */

    /**
     * Create a new InstitutionalFlowSignal record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created InstitutionalFlowSignal or null.
     */
    async create(props: InstitutionalFlowSignalType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<InstitutionalFlowSignalType> {
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

          const CREATE_ONE_INSTITUTIONALFLOWSIGNAL = gql`
              mutation createOneInstitutionalFlowSignal($data: InstitutionalFlowSignalCreateInput!) {
                createOneInstitutionalFlowSignal(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                signalDate: props.signalDate !== undefined ? props.signalDate : undefined,
  signalType: props.signalType !== undefined ? props.signalType : undefined,
  signalStrength: props.signalStrength !== undefined ? props.signalStrength : undefined,
  netFlow: props.netFlow !== undefined ? props.netFlow : undefined,
  confidence: props.confidence !== undefined ? props.confidence : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  asset: props.asset ? 
    typeof props.asset === 'object' && Object.keys(props.asset).length === 1 && Object.keys(props.asset)[0] === 'id'
    ? { connect: {
        id: props.asset.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.asset.id !== undefined ? props.asset.id : undefined,
        symbol: props.asset.symbol !== undefined ? props.asset.symbol : undefined,
        name: props.asset.name !== undefined ? props.asset.name : undefined,
        type: props.asset.type !== undefined ? {
            equals: props.asset.type 
           } : undefined,
      },
      create: {
        symbol: props.asset.symbol !== undefined ? props.asset.symbol : undefined,
        name: props.asset.name !== undefined ? props.asset.name : undefined,
        type: props.asset.type !== undefined ? props.asset.type : undefined,
        logoUrl: props.asset.logoUrl !== undefined ? props.asset.logoUrl : undefined,
        description: props.asset.description !== undefined ? props.asset.description : undefined,
        cik: props.asset.cik !== undefined ? props.asset.cik : undefined,
        exchange: props.asset.exchange !== undefined ? props.asset.exchange : undefined,
        currency: props.asset.currency !== undefined ? props.asset.currency : undefined,
        country: props.asset.country !== undefined ? props.asset.country : undefined,
        sector: props.asset.sector !== undefined ? props.asset.sector : undefined,
        industry: props.asset.industry !== undefined ? props.asset.industry : undefined,
        address: props.asset.address !== undefined ? props.asset.address : undefined,
        officialSite: props.asset.officialSite !== undefined ? props.asset.officialSite : undefined,
        fiscalYearEnd: props.asset.fiscalYearEnd !== undefined ? props.asset.fiscalYearEnd : undefined,
        latestQuarter: props.asset.latestQuarter !== undefined ? props.asset.latestQuarter : undefined,
        marketCapitalization: props.asset.marketCapitalization !== undefined ? props.asset.marketCapitalization : undefined,
        ebitda: props.asset.ebitda !== undefined ? props.asset.ebitda : undefined,
        peRatio: props.asset.peRatio !== undefined ? props.asset.peRatio : undefined,
        pegRatio: props.asset.pegRatio !== undefined ? props.asset.pegRatio : undefined,
        bookValue: props.asset.bookValue !== undefined ? props.asset.bookValue : undefined,
        dividendPerShare: props.asset.dividendPerShare !== undefined ? props.asset.dividendPerShare : undefined,
        dividendYield: props.asset.dividendYield !== undefined ? props.asset.dividendYield : undefined,
        eps: props.asset.eps !== undefined ? props.asset.eps : undefined,
        revenuePerShareTTM: props.asset.revenuePerShareTTM !== undefined ? props.asset.revenuePerShareTTM : undefined,
        profitMargin: props.asset.profitMargin !== undefined ? props.asset.profitMargin : undefined,
        operatingMarginTTM: props.asset.operatingMarginTTM !== undefined ? props.asset.operatingMarginTTM : undefined,
        returnOnAssetsTTM: props.asset.returnOnAssetsTTM !== undefined ? props.asset.returnOnAssetsTTM : undefined,
        returnOnEquityTTM: props.asset.returnOnEquityTTM !== undefined ? props.asset.returnOnEquityTTM : undefined,
        revenueTTM: props.asset.revenueTTM !== undefined ? props.asset.revenueTTM : undefined,
        grossProfitTTM: props.asset.grossProfitTTM !== undefined ? props.asset.grossProfitTTM : undefined,
        dilutedEPSTTM: props.asset.dilutedEPSTTM !== undefined ? props.asset.dilutedEPSTTM : undefined,
        quarterlyEarningsGrowthYOY: props.asset.quarterlyEarningsGrowthYOY !== undefined ? props.asset.quarterlyEarningsGrowthYOY : undefined,
        quarterlyRevenueGrowthYOY: props.asset.quarterlyRevenueGrowthYOY !== undefined ? props.asset.quarterlyRevenueGrowthYOY : undefined,
        analystTargetPrice: props.asset.analystTargetPrice !== undefined ? props.asset.analystTargetPrice : undefined,
        analystRatingStrongBuy: props.asset.analystRatingStrongBuy !== undefined ? props.asset.analystRatingStrongBuy : undefined,
        analystRatingBuy: props.asset.analystRatingBuy !== undefined ? props.asset.analystRatingBuy : undefined,
        analystRatingHold: props.asset.analystRatingHold !== undefined ? props.asset.analystRatingHold : undefined,
        analystRatingSell: props.asset.analystRatingSell !== undefined ? props.asset.analystRatingSell : undefined,
        analystRatingStrongSell: props.asset.analystRatingStrongSell !== undefined ? props.asset.analystRatingStrongSell : undefined,
        trailingPE: props.asset.trailingPE !== undefined ? props.asset.trailingPE : undefined,
        forwardPE: props.asset.forwardPE !== undefined ? props.asset.forwardPE : undefined,
        priceToSalesRatioTTM: props.asset.priceToSalesRatioTTM !== undefined ? props.asset.priceToSalesRatioTTM : undefined,
        priceToBookRatio: props.asset.priceToBookRatio !== undefined ? props.asset.priceToBookRatio : undefined,
        evToRevenue: props.asset.evToRevenue !== undefined ? props.asset.evToRevenue : undefined,
        evToEbitda: props.asset.evToEbitda !== undefined ? props.asset.evToEbitda : undefined,
        beta: props.asset.beta !== undefined ? props.asset.beta : undefined,
        week52High: props.asset.week52High !== undefined ? props.asset.week52High : undefined,
        week52Low: props.asset.week52Low !== undefined ? props.asset.week52Low : undefined,
        day50MovingAverage: props.asset.day50MovingAverage !== undefined ? props.asset.day50MovingAverage : undefined,
        day200MovingAverage: props.asset.day200MovingAverage !== undefined ? props.asset.day200MovingAverage : undefined,
        sharesOutstanding: props.asset.sharesOutstanding !== undefined ? props.asset.sharesOutstanding : undefined,
        dividendDate: props.asset.dividendDate !== undefined ? props.asset.dividendDate : undefined,
        exDividendDate: props.asset.exDividendDate !== undefined ? props.asset.exDividendDate : undefined,
        askPrice: props.asset.askPrice !== undefined ? props.asset.askPrice : undefined,
        bidPrice: props.asset.bidPrice !== undefined ? props.asset.bidPrice : undefined,
    newsMentions: props.asset.newsMentions ? 
      Array.isArray(props.asset.newsMentions) && props.asset.newsMentions.length > 0 &&  props.asset.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.asset.newsMentions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.asset.newsMentions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          url: item.url !== undefined ? item.url : undefined,
          newsArticleId: item.newsArticleId !== undefined ? {
              equals: item.newsArticleId 
             } : undefined,
        },
        create: {
          url: item.url !== undefined ? item.url : undefined,
          relevancyScore: item.relevancyScore !== undefined ? item.relevancyScore : undefined,
          sentimentScore: item.sentimentScore !== undefined ? item.sentimentScore : undefined,
          sentimentLabel: item.sentimentLabel !== undefined ? item.sentimentLabel : undefined,
      news: item.news ? 
        typeof item.news === 'object' && Object.keys(item.news).length === 1 && Object.keys(item.news)[0] === 'id'
    ? { connect: {
            id: item.news.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.news.id !== undefined ? item.news.id : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            title: item.news.title !== undefined ? {
                equals: item.news.title 
               } : undefined,
          },
          create: {
            title: item.news.title !== undefined ? item.news.title : undefined,
            content: item.news.content !== undefined ? item.news.content : undefined,
            source: item.news.source !== undefined ? item.news.source : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? item.news.sourceDomain : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            sentiment: item.news.sentiment !== undefined ? item.news.sentiment : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors 
               } : undefined,
            summary: item.news.summary !== undefined ? item.news.summary : undefined,
            bannerImage: item.news.bannerImage !== undefined ? item.news.bannerImage : undefined,
            timePublished: item.news.timePublished !== undefined ? item.news.timePublished : undefined,
            category: item.news.category !== undefined ? item.news.category : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics 
               } : undefined,
            logo: item.news.logo !== undefined ? item.news.logo : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols 
               } : undefined,
            relevance: item.news.relevance !== undefined ? item.news.relevance : undefined,
            publishedAt: item.news.publishedAt !== undefined ? item.news.publishedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    institutionalHoldings: props.asset.institutionalHoldings ? 
      Array.isArray(props.asset.institutionalHoldings) && props.asset.institutionalHoldings.length > 0 &&  props.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.asset.institutionalHoldings.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.asset.institutionalHoldings.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          symbol: item.symbol !== undefined ? {
              equals: item.symbol 
             } : undefined,
        },
        create: {
          institutionName: item.institutionName !== undefined ? item.institutionName : undefined,
          filingDate: item.filingDate !== undefined ? item.filingDate : undefined,
          reportDate: item.reportDate !== undefined ? item.reportDate : undefined,
          sharesHeld: item.sharesHeld !== undefined ? item.sharesHeld : undefined,
          marketValue: item.marketValue !== undefined ? item.marketValue : undefined,
          percentOfClass: item.percentOfClass !== undefined ? item.percentOfClass : undefined,
          changeShares: item.changeShares !== undefined ? item.changeShares : undefined,
          changePercent: item.changePercent !== undefined ? item.changePercent : undefined,
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
            mutation: CREATE_ONE_INSTITUTIONALFLOWSIGNAL,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneInstitutionalFlowSignal) {
            return response.data.createOneInstitutionalFlowSignal;
          } else {
            return null as unknown as InstitutionalFlowSignalType;
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
            logger.error("Non-retryable constraint violation in createOneInstitutionalFlowSignal", {
              operation: 'createOneInstitutionalFlowSignal',
              model: 'InstitutionalFlowSignal',
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
            logger.warn("Database connection error in createOneInstitutionalFlowSignal, retrying...", {
              operation: 'createOneInstitutionalFlowSignal',
              model: 'InstitutionalFlowSignal',
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
              operation: 'createOneInstitutionalFlowSignal',
              model: 'InstitutionalFlowSignal',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneInstitutionalFlowSignal',
              model: 'InstitutionalFlowSignal',
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
   * Create multiple InstitutionalFlowSignal records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of InstitutionalFlowSignal objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: InstitutionalFlowSignalType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_INSTITUTIONALFLOWSIGNAL = gql`
          mutation createManyInstitutionalFlowSignal($data: [InstitutionalFlowSignalCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyInstitutionalFlowSignal(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      symbol: prop.symbol !== undefined ? prop.symbol : undefined,
  signalDate: prop.signalDate !== undefined ? prop.signalDate : undefined,
  signalType: prop.signalType !== undefined ? prop.signalType : undefined,
  signalStrength: prop.signalStrength !== undefined ? prop.signalStrength : undefined,
  netFlow: prop.netFlow !== undefined ? prop.netFlow : undefined,
  confidence: prop.confidence !== undefined ? prop.confidence : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_INSTITUTIONALFLOWSIGNAL,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyInstitutionalFlowSignal) {
          return response.data.createManyInstitutionalFlowSignal;
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
          logger.warn("Duplicate key in createManyInstitutionalFlowSignal (expected during overlapping fetches)", {
            operation: 'createManyInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
          logger.warn("Database connection error in createManyInstitutionalFlowSignal, retrying...", {
            operation: 'createManyInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
   * Update a single InstitutionalFlowSignal record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated InstitutionalFlowSignal or null.
   */
  async update(props: InstitutionalFlowSignalType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<InstitutionalFlowSignalType> {
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

        const UPDATE_ONE_INSTITUTIONALFLOWSIGNAL = gql`
          mutation updateOneInstitutionalFlowSignal($data: InstitutionalFlowSignalUpdateInput!, $where: InstitutionalFlowSignalWhereUniqueInput!) {
            updateOneInstitutionalFlowSignal(data: $data, where: $where) {
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
  signalDate: props.signalDate !== undefined ? {
            set: props.signalDate 
           } : undefined,
  signalType: props.signalType !== undefined ? {
            set: props.signalType 
           } : undefined,
  signalStrength: props.signalStrength !== undefined ? {
            set: props.signalStrength 
           } : undefined,
  netFlow: props.netFlow !== undefined ? {
            set: props.netFlow 
           } : undefined,
  confidence: props.confidence !== undefined ? {
            set: props.confidence 
           } : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  asset: props.asset ? 
  typeof props.asset === 'object' && Object.keys(props.asset).length === 1 && (Object.keys(props.asset)[0] === 'id' || Object.keys(props.asset)[0] === 'symbol')
? {
  connect: {
    id: props.asset.id
  }
} : { upsert: {
      where: {
        id: props.asset.id !== undefined ? {
            equals: props.asset.id
          } : undefined,
        symbol: props.asset.symbol !== undefined ? {
            equals: props.asset.symbol
          } : undefined,
        name: props.asset.name !== undefined ? {
            equals: props.asset.name
          } : undefined,
        type: props.asset.type !== undefined ? {
            equals: props.asset.type
          } : undefined,
      },
      update: {
        id: props.asset.id !== undefined ? {
            set: props.asset.id
          } : undefined,
        symbol: props.asset.symbol !== undefined ? {
            set: props.asset.symbol
          } : undefined,
        name: props.asset.name !== undefined ? {
            set: props.asset.name
          } : undefined,
        type: props.asset.type !== undefined ? {
            set: props.asset.type
          } : undefined,
        logoUrl: props.asset.logoUrl !== undefined ? {
            set: props.asset.logoUrl
          } : undefined,
        description: props.asset.description !== undefined ? {
            set: props.asset.description
          } : undefined,
        cik: props.asset.cik !== undefined ? {
            set: props.asset.cik
          } : undefined,
        exchange: props.asset.exchange !== undefined ? {
            set: props.asset.exchange
          } : undefined,
        currency: props.asset.currency !== undefined ? {
            set: props.asset.currency
          } : undefined,
        country: props.asset.country !== undefined ? {
            set: props.asset.country
          } : undefined,
        sector: props.asset.sector !== undefined ? {
            set: props.asset.sector
          } : undefined,
        industry: props.asset.industry !== undefined ? {
            set: props.asset.industry
          } : undefined,
        address: props.asset.address !== undefined ? {
            set: props.asset.address
          } : undefined,
        officialSite: props.asset.officialSite !== undefined ? {
            set: props.asset.officialSite
          } : undefined,
        fiscalYearEnd: props.asset.fiscalYearEnd !== undefined ? {
            set: props.asset.fiscalYearEnd
          } : undefined,
        latestQuarter: props.asset.latestQuarter !== undefined ? {
            set: props.asset.latestQuarter
          } : undefined,
        marketCapitalization: props.asset.marketCapitalization !== undefined ? {
            set: props.asset.marketCapitalization
          } : undefined,
        ebitda: props.asset.ebitda !== undefined ? {
            set: props.asset.ebitda
          } : undefined,
        peRatio: props.asset.peRatio !== undefined ? {
            set: props.asset.peRatio
          } : undefined,
        pegRatio: props.asset.pegRatio !== undefined ? {
            set: props.asset.pegRatio
          } : undefined,
        bookValue: props.asset.bookValue !== undefined ? {
            set: props.asset.bookValue
          } : undefined,
        dividendPerShare: props.asset.dividendPerShare !== undefined ? {
            set: props.asset.dividendPerShare
          } : undefined,
        dividendYield: props.asset.dividendYield !== undefined ? {
            set: props.asset.dividendYield
          } : undefined,
        eps: props.asset.eps !== undefined ? {
            set: props.asset.eps
          } : undefined,
        revenuePerShareTTM: props.asset.revenuePerShareTTM !== undefined ? {
            set: props.asset.revenuePerShareTTM
          } : undefined,
        profitMargin: props.asset.profitMargin !== undefined ? {
            set: props.asset.profitMargin
          } : undefined,
        operatingMarginTTM: props.asset.operatingMarginTTM !== undefined ? {
            set: props.asset.operatingMarginTTM
          } : undefined,
        returnOnAssetsTTM: props.asset.returnOnAssetsTTM !== undefined ? {
            set: props.asset.returnOnAssetsTTM
          } : undefined,
        returnOnEquityTTM: props.asset.returnOnEquityTTM !== undefined ? {
            set: props.asset.returnOnEquityTTM
          } : undefined,
        revenueTTM: props.asset.revenueTTM !== undefined ? {
            set: props.asset.revenueTTM
          } : undefined,
        grossProfitTTM: props.asset.grossProfitTTM !== undefined ? {
            set: props.asset.grossProfitTTM
          } : undefined,
        dilutedEPSTTM: props.asset.dilutedEPSTTM !== undefined ? {
            set: props.asset.dilutedEPSTTM
          } : undefined,
        quarterlyEarningsGrowthYOY: props.asset.quarterlyEarningsGrowthYOY !== undefined ? {
            set: props.asset.quarterlyEarningsGrowthYOY
          } : undefined,
        quarterlyRevenueGrowthYOY: props.asset.quarterlyRevenueGrowthYOY !== undefined ? {
            set: props.asset.quarterlyRevenueGrowthYOY
          } : undefined,
        analystTargetPrice: props.asset.analystTargetPrice !== undefined ? {
            set: props.asset.analystTargetPrice
          } : undefined,
        analystRatingStrongBuy: props.asset.analystRatingStrongBuy !== undefined ? {
            set: props.asset.analystRatingStrongBuy
          } : undefined,
        analystRatingBuy: props.asset.analystRatingBuy !== undefined ? {
            set: props.asset.analystRatingBuy
          } : undefined,
        analystRatingHold: props.asset.analystRatingHold !== undefined ? {
            set: props.asset.analystRatingHold
          } : undefined,
        analystRatingSell: props.asset.analystRatingSell !== undefined ? {
            set: props.asset.analystRatingSell
          } : undefined,
        analystRatingStrongSell: props.asset.analystRatingStrongSell !== undefined ? {
            set: props.asset.analystRatingStrongSell
          } : undefined,
        trailingPE: props.asset.trailingPE !== undefined ? {
            set: props.asset.trailingPE
          } : undefined,
        forwardPE: props.asset.forwardPE !== undefined ? {
            set: props.asset.forwardPE
          } : undefined,
        priceToSalesRatioTTM: props.asset.priceToSalesRatioTTM !== undefined ? {
            set: props.asset.priceToSalesRatioTTM
          } : undefined,
        priceToBookRatio: props.asset.priceToBookRatio !== undefined ? {
            set: props.asset.priceToBookRatio
          } : undefined,
        evToRevenue: props.asset.evToRevenue !== undefined ? {
            set: props.asset.evToRevenue
          } : undefined,
        evToEbitda: props.asset.evToEbitda !== undefined ? {
            set: props.asset.evToEbitda
          } : undefined,
        beta: props.asset.beta !== undefined ? {
            set: props.asset.beta
          } : undefined,
        week52High: props.asset.week52High !== undefined ? {
            set: props.asset.week52High
          } : undefined,
        week52Low: props.asset.week52Low !== undefined ? {
            set: props.asset.week52Low
          } : undefined,
        day50MovingAverage: props.asset.day50MovingAverage !== undefined ? {
            set: props.asset.day50MovingAverage
          } : undefined,
        day200MovingAverage: props.asset.day200MovingAverage !== undefined ? {
            set: props.asset.day200MovingAverage
          } : undefined,
        sharesOutstanding: props.asset.sharesOutstanding !== undefined ? {
            set: props.asset.sharesOutstanding
          } : undefined,
        dividendDate: props.asset.dividendDate !== undefined ? {
            set: props.asset.dividendDate
          } : undefined,
        exDividendDate: props.asset.exDividendDate !== undefined ? {
            set: props.asset.exDividendDate
          } : undefined,
        askPrice: props.asset.askPrice !== undefined ? {
            set: props.asset.askPrice
          } : undefined,
        bidPrice: props.asset.bidPrice !== undefined ? {
            set: props.asset.bidPrice
          } : undefined,
    newsMentions: props.asset.newsMentions ? 
    Array.isArray(props.asset.newsMentions) && props.asset.newsMentions.length > 0 && props.asset.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.asset.newsMentions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.asset.newsMentions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          url: item.url !== undefined ? item.url : undefined,
          assetId: item.assetId !== undefined ? {
              equals: item.assetId
            } : undefined,
          newsArticleId: item.newsArticleId !== undefined ? {
              equals: item.newsArticleId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          url: item.url !== undefined ? {
              set: item.url
            } : undefined,
          relevancyScore: item.relevancyScore !== undefined ? {
              set: item.relevancyScore
            } : undefined,
          sentimentScore: item.sentimentScore !== undefined ? {
              set: item.sentimentScore
            } : undefined,
          sentimentLabel: item.sentimentLabel !== undefined ? {
              set: item.sentimentLabel
            } : undefined,
      news: item.news ? 
      typeof item.news === 'object' && Object.keys(item.news).length === 1 && (Object.keys(item.news)[0] === 'id' || Object.keys(item.news)[0] === 'symbol')
? {
      connect: {
        id: item.news.id
      }
} : { upsert: {
          where: {
            id: item.news.id !== undefined ? {
                equals: item.news.id
              } : undefined,
            title: item.news.title !== undefined ? {
                equals: item.news.title
              } : undefined,
            url: item.news.url !== undefined ? {
                equals: item.news.url
              } : undefined,
          },
          update: {
            id: item.news.id !== undefined ? {
                set: item.news.id
              } : undefined,
            title: item.news.title !== undefined ? {
                set: item.news.title
              } : undefined,
            content: item.news.content !== undefined ? {
                set: item.news.content
              } : undefined,
            source: item.news.source !== undefined ? {
                set: item.news.source
              } : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? {
                set: item.news.sourceDomain
              } : undefined,
            url: item.news.url !== undefined ? {
                set: item.news.url
              } : undefined,
            sentiment: item.news.sentiment !== undefined ? {
                set: item.news.sentiment
              } : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors
              } : undefined,
            summary: item.news.summary !== undefined ? {
                set: item.news.summary
              } : undefined,
            bannerImage: item.news.bannerImage !== undefined ? {
                set: item.news.bannerImage
              } : undefined,
            timePublished: item.news.timePublished !== undefined ? {
                set: item.news.timePublished
              } : undefined,
            category: item.news.category !== undefined ? {
                set: item.news.category
              } : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics
              } : undefined,
            logo: item.news.logo !== undefined ? {
                set: item.news.logo
              } : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols
              } : undefined,
            relevance: item.news.relevance !== undefined ? {
                set: item.news.relevance
              } : undefined,
            publishedAt: item.news.publishedAt !== undefined ? {
                set: item.news.publishedAt
              } : undefined,
          },
          create: {
            title: item.news.title !== undefined ? item.news.title : undefined,
            content: item.news.content !== undefined ? item.news.content : undefined,
            source: item.news.source !== undefined ? item.news.source : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? item.news.sourceDomain : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            sentiment: item.news.sentiment !== undefined ? item.news.sentiment : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors 
               } : undefined,
            summary: item.news.summary !== undefined ? item.news.summary : undefined,
            bannerImage: item.news.bannerImage !== undefined ? item.news.bannerImage : undefined,
            timePublished: item.news.timePublished !== undefined ? item.news.timePublished : undefined,
            category: item.news.category !== undefined ? item.news.category : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics 
               } : undefined,
            logo: item.news.logo !== undefined ? item.news.logo : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols 
               } : undefined,
            relevance: item.news.relevance !== undefined ? item.news.relevance : undefined,
            publishedAt: item.news.publishedAt !== undefined ? item.news.publishedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          url: item.url !== undefined ? item.url : undefined,
          relevancyScore: item.relevancyScore !== undefined ? item.relevancyScore : undefined,
          sentimentScore: item.sentimentScore !== undefined ? item.sentimentScore : undefined,
          sentimentLabel: item.sentimentLabel !== undefined ? item.sentimentLabel : undefined,
      news: item.news ? 
        typeof item.news === 'object' && Object.keys(item.news).length === 1 && Object.keys(item.news)[0] === 'id'
    ? { connect: {
            id: item.news.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.news.id !== undefined ? item.news.id : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            title: item.news.title !== undefined ? {
                equals: item.news.title 
               } : undefined,
          },
          create: {
            title: item.news.title !== undefined ? item.news.title : undefined,
            content: item.news.content !== undefined ? item.news.content : undefined,
            source: item.news.source !== undefined ? item.news.source : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? item.news.sourceDomain : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            sentiment: item.news.sentiment !== undefined ? item.news.sentiment : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors 
               } : undefined,
            summary: item.news.summary !== undefined ? item.news.summary : undefined,
            bannerImage: item.news.bannerImage !== undefined ? item.news.bannerImage : undefined,
            timePublished: item.news.timePublished !== undefined ? item.news.timePublished : undefined,
            category: item.news.category !== undefined ? item.news.category : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics 
               } : undefined,
            logo: item.news.logo !== undefined ? item.news.logo : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols 
               } : undefined,
            relevance: item.news.relevance !== undefined ? item.news.relevance : undefined,
            publishedAt: item.news.publishedAt !== undefined ? item.news.publishedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    institutionalHoldings: props.asset.institutionalHoldings ? 
    Array.isArray(props.asset.institutionalHoldings) && props.asset.institutionalHoldings.length > 0 && props.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.asset.institutionalHoldings.map((item) => ({
      id: item.id
    }))
} : { upsert: props.asset.institutionalHoldings.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          symbol: item.symbol !== undefined ? {
              equals: item.symbol
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          institutionName: item.institutionName !== undefined ? {
              set: item.institutionName
            } : undefined,
          filingDate: item.filingDate !== undefined ? {
              set: item.filingDate
            } : undefined,
          reportDate: item.reportDate !== undefined ? {
              set: item.reportDate
            } : undefined,
          sharesHeld: item.sharesHeld !== undefined ? {
              set: item.sharesHeld
            } : undefined,
          marketValue: item.marketValue !== undefined ? {
              set: item.marketValue
            } : undefined,
          percentOfClass: item.percentOfClass !== undefined ? {
              set: item.percentOfClass
            } : undefined,
          changeShares: item.changeShares !== undefined ? {
              set: item.changeShares
            } : undefined,
          changePercent: item.changePercent !== undefined ? {
              set: item.changePercent
            } : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
        },
        create: {
          institutionName: item.institutionName !== undefined ? item.institutionName : undefined,
          filingDate: item.filingDate !== undefined ? item.filingDate : undefined,
          reportDate: item.reportDate !== undefined ? item.reportDate : undefined,
          sharesHeld: item.sharesHeld !== undefined ? item.sharesHeld : undefined,
          marketValue: item.marketValue !== undefined ? item.marketValue : undefined,
          percentOfClass: item.percentOfClass !== undefined ? item.percentOfClass : undefined,
          changeShares: item.changeShares !== undefined ? item.changeShares : undefined,
          changePercent: item.changePercent !== undefined ? item.changePercent : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        symbol: props.asset.symbol !== undefined ? props.asset.symbol : undefined,
        name: props.asset.name !== undefined ? props.asset.name : undefined,
        type: props.asset.type !== undefined ? props.asset.type : undefined,
        logoUrl: props.asset.logoUrl !== undefined ? props.asset.logoUrl : undefined,
        description: props.asset.description !== undefined ? props.asset.description : undefined,
        cik: props.asset.cik !== undefined ? props.asset.cik : undefined,
        exchange: props.asset.exchange !== undefined ? props.asset.exchange : undefined,
        currency: props.asset.currency !== undefined ? props.asset.currency : undefined,
        country: props.asset.country !== undefined ? props.asset.country : undefined,
        sector: props.asset.sector !== undefined ? props.asset.sector : undefined,
        industry: props.asset.industry !== undefined ? props.asset.industry : undefined,
        address: props.asset.address !== undefined ? props.asset.address : undefined,
        officialSite: props.asset.officialSite !== undefined ? props.asset.officialSite : undefined,
        fiscalYearEnd: props.asset.fiscalYearEnd !== undefined ? props.asset.fiscalYearEnd : undefined,
        latestQuarter: props.asset.latestQuarter !== undefined ? props.asset.latestQuarter : undefined,
        marketCapitalization: props.asset.marketCapitalization !== undefined ? props.asset.marketCapitalization : undefined,
        ebitda: props.asset.ebitda !== undefined ? props.asset.ebitda : undefined,
        peRatio: props.asset.peRatio !== undefined ? props.asset.peRatio : undefined,
        pegRatio: props.asset.pegRatio !== undefined ? props.asset.pegRatio : undefined,
        bookValue: props.asset.bookValue !== undefined ? props.asset.bookValue : undefined,
        dividendPerShare: props.asset.dividendPerShare !== undefined ? props.asset.dividendPerShare : undefined,
        dividendYield: props.asset.dividendYield !== undefined ? props.asset.dividendYield : undefined,
        eps: props.asset.eps !== undefined ? props.asset.eps : undefined,
        revenuePerShareTTM: props.asset.revenuePerShareTTM !== undefined ? props.asset.revenuePerShareTTM : undefined,
        profitMargin: props.asset.profitMargin !== undefined ? props.asset.profitMargin : undefined,
        operatingMarginTTM: props.asset.operatingMarginTTM !== undefined ? props.asset.operatingMarginTTM : undefined,
        returnOnAssetsTTM: props.asset.returnOnAssetsTTM !== undefined ? props.asset.returnOnAssetsTTM : undefined,
        returnOnEquityTTM: props.asset.returnOnEquityTTM !== undefined ? props.asset.returnOnEquityTTM : undefined,
        revenueTTM: props.asset.revenueTTM !== undefined ? props.asset.revenueTTM : undefined,
        grossProfitTTM: props.asset.grossProfitTTM !== undefined ? props.asset.grossProfitTTM : undefined,
        dilutedEPSTTM: props.asset.dilutedEPSTTM !== undefined ? props.asset.dilutedEPSTTM : undefined,
        quarterlyEarningsGrowthYOY: props.asset.quarterlyEarningsGrowthYOY !== undefined ? props.asset.quarterlyEarningsGrowthYOY : undefined,
        quarterlyRevenueGrowthYOY: props.asset.quarterlyRevenueGrowthYOY !== undefined ? props.asset.quarterlyRevenueGrowthYOY : undefined,
        analystTargetPrice: props.asset.analystTargetPrice !== undefined ? props.asset.analystTargetPrice : undefined,
        analystRatingStrongBuy: props.asset.analystRatingStrongBuy !== undefined ? props.asset.analystRatingStrongBuy : undefined,
        analystRatingBuy: props.asset.analystRatingBuy !== undefined ? props.asset.analystRatingBuy : undefined,
        analystRatingHold: props.asset.analystRatingHold !== undefined ? props.asset.analystRatingHold : undefined,
        analystRatingSell: props.asset.analystRatingSell !== undefined ? props.asset.analystRatingSell : undefined,
        analystRatingStrongSell: props.asset.analystRatingStrongSell !== undefined ? props.asset.analystRatingStrongSell : undefined,
        trailingPE: props.asset.trailingPE !== undefined ? props.asset.trailingPE : undefined,
        forwardPE: props.asset.forwardPE !== undefined ? props.asset.forwardPE : undefined,
        priceToSalesRatioTTM: props.asset.priceToSalesRatioTTM !== undefined ? props.asset.priceToSalesRatioTTM : undefined,
        priceToBookRatio: props.asset.priceToBookRatio !== undefined ? props.asset.priceToBookRatio : undefined,
        evToRevenue: props.asset.evToRevenue !== undefined ? props.asset.evToRevenue : undefined,
        evToEbitda: props.asset.evToEbitda !== undefined ? props.asset.evToEbitda : undefined,
        beta: props.asset.beta !== undefined ? props.asset.beta : undefined,
        week52High: props.asset.week52High !== undefined ? props.asset.week52High : undefined,
        week52Low: props.asset.week52Low !== undefined ? props.asset.week52Low : undefined,
        day50MovingAverage: props.asset.day50MovingAverage !== undefined ? props.asset.day50MovingAverage : undefined,
        day200MovingAverage: props.asset.day200MovingAverage !== undefined ? props.asset.day200MovingAverage : undefined,
        sharesOutstanding: props.asset.sharesOutstanding !== undefined ? props.asset.sharesOutstanding : undefined,
        dividendDate: props.asset.dividendDate !== undefined ? props.asset.dividendDate : undefined,
        exDividendDate: props.asset.exDividendDate !== undefined ? props.asset.exDividendDate : undefined,
        askPrice: props.asset.askPrice !== undefined ? props.asset.askPrice : undefined,
        bidPrice: props.asset.bidPrice !== undefined ? props.asset.bidPrice : undefined,
    newsMentions: props.asset.newsMentions ? 
      Array.isArray(props.asset.newsMentions) && props.asset.newsMentions.length > 0 &&  props.asset.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.asset.newsMentions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.asset.newsMentions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          url: item.url !== undefined ? item.url : undefined,
          newsArticleId: item.newsArticleId !== undefined ? {
              equals: item.newsArticleId 
             } : undefined,
        },
        create: {
          url: item.url !== undefined ? item.url : undefined,
          relevancyScore: item.relevancyScore !== undefined ? item.relevancyScore : undefined,
          sentimentScore: item.sentimentScore !== undefined ? item.sentimentScore : undefined,
          sentimentLabel: item.sentimentLabel !== undefined ? item.sentimentLabel : undefined,
      news: item.news ? 
        typeof item.news === 'object' && Object.keys(item.news).length === 1 && Object.keys(item.news)[0] === 'id'
    ? { connect: {
            id: item.news.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.news.id !== undefined ? item.news.id : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            title: item.news.title !== undefined ? {
                equals: item.news.title 
               } : undefined,
          },
          create: {
            title: item.news.title !== undefined ? item.news.title : undefined,
            content: item.news.content !== undefined ? item.news.content : undefined,
            source: item.news.source !== undefined ? item.news.source : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? item.news.sourceDomain : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            sentiment: item.news.sentiment !== undefined ? item.news.sentiment : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors 
               } : undefined,
            summary: item.news.summary !== undefined ? item.news.summary : undefined,
            bannerImage: item.news.bannerImage !== undefined ? item.news.bannerImage : undefined,
            timePublished: item.news.timePublished !== undefined ? item.news.timePublished : undefined,
            category: item.news.category !== undefined ? item.news.category : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics 
               } : undefined,
            logo: item.news.logo !== undefined ? item.news.logo : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols 
               } : undefined,
            relevance: item.news.relevance !== undefined ? item.news.relevance : undefined,
            publishedAt: item.news.publishedAt !== undefined ? item.news.publishedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    institutionalHoldings: props.asset.institutionalHoldings ? 
      Array.isArray(props.asset.institutionalHoldings) && props.asset.institutionalHoldings.length > 0 &&  props.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.asset.institutionalHoldings.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.asset.institutionalHoldings.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          symbol: item.symbol !== undefined ? {
              equals: item.symbol 
             } : undefined,
        },
        create: {
          institutionName: item.institutionName !== undefined ? item.institutionName : undefined,
          filingDate: item.filingDate !== undefined ? item.filingDate : undefined,
          reportDate: item.reportDate !== undefined ? item.reportDate : undefined,
          sharesHeld: item.sharesHeld !== undefined ? item.sharesHeld : undefined,
          marketValue: item.marketValue !== undefined ? item.marketValue : undefined,
          percentOfClass: item.percentOfClass !== undefined ? item.percentOfClass : undefined,
          changeShares: item.changeShares !== undefined ? item.changeShares : undefined,
          changePercent: item.changePercent !== undefined ? item.changePercent : undefined,
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
          mutation: UPDATE_ONE_INSTITUTIONALFLOWSIGNAL,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneInstitutionalFlowSignal) {
          return response.data.updateOneInstitutionalFlowSignal;
        } else {
          return null as unknown as InstitutionalFlowSignalType;
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
          logger.error("Non-retryable constraint violation in updateOneInstitutionalFlowSignal", {
            operation: 'updateOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
          logger.warn("Database connection error in updateOneInstitutionalFlowSignal, retrying...", {
            operation: 'updateOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
            operation: 'updateOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
   * Upsert a single InstitutionalFlowSignal record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated InstitutionalFlowSignal or null.
   */
  async upsert(props: InstitutionalFlowSignalType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<InstitutionalFlowSignalType> {
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

        const UPSERT_ONE_INSTITUTIONALFLOWSIGNAL = gql`
          mutation upsertOneInstitutionalFlowSignal($where: InstitutionalFlowSignalWhereUniqueInput!, $create: InstitutionalFlowSignalCreateInput!, $update: InstitutionalFlowSignalUpdateInput!) {
            upsertOneInstitutionalFlowSignal(where: $where, create: $create, update: $update) {
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
        signalDate: props.signalDate !== undefined ? props.signalDate : undefined,
  signalType: props.signalType !== undefined ? props.signalType : undefined,
  signalStrength: props.signalStrength !== undefined ? props.signalStrength : undefined,
  netFlow: props.netFlow !== undefined ? props.netFlow : undefined,
  confidence: props.confidence !== undefined ? props.confidence : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  asset: props.asset ? 
    typeof props.asset === 'object' && Object.keys(props.asset).length === 1 && Object.keys(props.asset)[0] === 'id'
    ? { connect: {
        id: props.asset.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.asset.id !== undefined ? props.asset.id : undefined,
        symbol: props.asset.symbol !== undefined ? props.asset.symbol : undefined,
        name: props.asset.name !== undefined ? props.asset.name : undefined,
        type: props.asset.type !== undefined ? {
            equals: props.asset.type 
           } : undefined,
      },
      create: {
        symbol: props.asset.symbol !== undefined ? props.asset.symbol : undefined,
        name: props.asset.name !== undefined ? props.asset.name : undefined,
        type: props.asset.type !== undefined ? props.asset.type : undefined,
        logoUrl: props.asset.logoUrl !== undefined ? props.asset.logoUrl : undefined,
        description: props.asset.description !== undefined ? props.asset.description : undefined,
        cik: props.asset.cik !== undefined ? props.asset.cik : undefined,
        exchange: props.asset.exchange !== undefined ? props.asset.exchange : undefined,
        currency: props.asset.currency !== undefined ? props.asset.currency : undefined,
        country: props.asset.country !== undefined ? props.asset.country : undefined,
        sector: props.asset.sector !== undefined ? props.asset.sector : undefined,
        industry: props.asset.industry !== undefined ? props.asset.industry : undefined,
        address: props.asset.address !== undefined ? props.asset.address : undefined,
        officialSite: props.asset.officialSite !== undefined ? props.asset.officialSite : undefined,
        fiscalYearEnd: props.asset.fiscalYearEnd !== undefined ? props.asset.fiscalYearEnd : undefined,
        latestQuarter: props.asset.latestQuarter !== undefined ? props.asset.latestQuarter : undefined,
        marketCapitalization: props.asset.marketCapitalization !== undefined ? props.asset.marketCapitalization : undefined,
        ebitda: props.asset.ebitda !== undefined ? props.asset.ebitda : undefined,
        peRatio: props.asset.peRatio !== undefined ? props.asset.peRatio : undefined,
        pegRatio: props.asset.pegRatio !== undefined ? props.asset.pegRatio : undefined,
        bookValue: props.asset.bookValue !== undefined ? props.asset.bookValue : undefined,
        dividendPerShare: props.asset.dividendPerShare !== undefined ? props.asset.dividendPerShare : undefined,
        dividendYield: props.asset.dividendYield !== undefined ? props.asset.dividendYield : undefined,
        eps: props.asset.eps !== undefined ? props.asset.eps : undefined,
        revenuePerShareTTM: props.asset.revenuePerShareTTM !== undefined ? props.asset.revenuePerShareTTM : undefined,
        profitMargin: props.asset.profitMargin !== undefined ? props.asset.profitMargin : undefined,
        operatingMarginTTM: props.asset.operatingMarginTTM !== undefined ? props.asset.operatingMarginTTM : undefined,
        returnOnAssetsTTM: props.asset.returnOnAssetsTTM !== undefined ? props.asset.returnOnAssetsTTM : undefined,
        returnOnEquityTTM: props.asset.returnOnEquityTTM !== undefined ? props.asset.returnOnEquityTTM : undefined,
        revenueTTM: props.asset.revenueTTM !== undefined ? props.asset.revenueTTM : undefined,
        grossProfitTTM: props.asset.grossProfitTTM !== undefined ? props.asset.grossProfitTTM : undefined,
        dilutedEPSTTM: props.asset.dilutedEPSTTM !== undefined ? props.asset.dilutedEPSTTM : undefined,
        quarterlyEarningsGrowthYOY: props.asset.quarterlyEarningsGrowthYOY !== undefined ? props.asset.quarterlyEarningsGrowthYOY : undefined,
        quarterlyRevenueGrowthYOY: props.asset.quarterlyRevenueGrowthYOY !== undefined ? props.asset.quarterlyRevenueGrowthYOY : undefined,
        analystTargetPrice: props.asset.analystTargetPrice !== undefined ? props.asset.analystTargetPrice : undefined,
        analystRatingStrongBuy: props.asset.analystRatingStrongBuy !== undefined ? props.asset.analystRatingStrongBuy : undefined,
        analystRatingBuy: props.asset.analystRatingBuy !== undefined ? props.asset.analystRatingBuy : undefined,
        analystRatingHold: props.asset.analystRatingHold !== undefined ? props.asset.analystRatingHold : undefined,
        analystRatingSell: props.asset.analystRatingSell !== undefined ? props.asset.analystRatingSell : undefined,
        analystRatingStrongSell: props.asset.analystRatingStrongSell !== undefined ? props.asset.analystRatingStrongSell : undefined,
        trailingPE: props.asset.trailingPE !== undefined ? props.asset.trailingPE : undefined,
        forwardPE: props.asset.forwardPE !== undefined ? props.asset.forwardPE : undefined,
        priceToSalesRatioTTM: props.asset.priceToSalesRatioTTM !== undefined ? props.asset.priceToSalesRatioTTM : undefined,
        priceToBookRatio: props.asset.priceToBookRatio !== undefined ? props.asset.priceToBookRatio : undefined,
        evToRevenue: props.asset.evToRevenue !== undefined ? props.asset.evToRevenue : undefined,
        evToEbitda: props.asset.evToEbitda !== undefined ? props.asset.evToEbitda : undefined,
        beta: props.asset.beta !== undefined ? props.asset.beta : undefined,
        week52High: props.asset.week52High !== undefined ? props.asset.week52High : undefined,
        week52Low: props.asset.week52Low !== undefined ? props.asset.week52Low : undefined,
        day50MovingAverage: props.asset.day50MovingAverage !== undefined ? props.asset.day50MovingAverage : undefined,
        day200MovingAverage: props.asset.day200MovingAverage !== undefined ? props.asset.day200MovingAverage : undefined,
        sharesOutstanding: props.asset.sharesOutstanding !== undefined ? props.asset.sharesOutstanding : undefined,
        dividendDate: props.asset.dividendDate !== undefined ? props.asset.dividendDate : undefined,
        exDividendDate: props.asset.exDividendDate !== undefined ? props.asset.exDividendDate : undefined,
        askPrice: props.asset.askPrice !== undefined ? props.asset.askPrice : undefined,
        bidPrice: props.asset.bidPrice !== undefined ? props.asset.bidPrice : undefined,
    newsMentions: props.asset.newsMentions ? 
      Array.isArray(props.asset.newsMentions) && props.asset.newsMentions.length > 0 &&  props.asset.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.asset.newsMentions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.asset.newsMentions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          url: item.url !== undefined ? item.url : undefined,
          newsArticleId: item.newsArticleId !== undefined ? {
              equals: item.newsArticleId 
             } : undefined,
        },
        create: {
          url: item.url !== undefined ? item.url : undefined,
          relevancyScore: item.relevancyScore !== undefined ? item.relevancyScore : undefined,
          sentimentScore: item.sentimentScore !== undefined ? item.sentimentScore : undefined,
          sentimentLabel: item.sentimentLabel !== undefined ? item.sentimentLabel : undefined,
      news: item.news ? 
        typeof item.news === 'object' && Object.keys(item.news).length === 1 && Object.keys(item.news)[0] === 'id'
    ? { connect: {
            id: item.news.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.news.id !== undefined ? item.news.id : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            title: item.news.title !== undefined ? {
                equals: item.news.title 
               } : undefined,
          },
          create: {
            title: item.news.title !== undefined ? item.news.title : undefined,
            content: item.news.content !== undefined ? item.news.content : undefined,
            source: item.news.source !== undefined ? item.news.source : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? item.news.sourceDomain : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            sentiment: item.news.sentiment !== undefined ? item.news.sentiment : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors 
               } : undefined,
            summary: item.news.summary !== undefined ? item.news.summary : undefined,
            bannerImage: item.news.bannerImage !== undefined ? item.news.bannerImage : undefined,
            timePublished: item.news.timePublished !== undefined ? item.news.timePublished : undefined,
            category: item.news.category !== undefined ? item.news.category : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics 
               } : undefined,
            logo: item.news.logo !== undefined ? item.news.logo : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols 
               } : undefined,
            relevance: item.news.relevance !== undefined ? item.news.relevance : undefined,
            publishedAt: item.news.publishedAt !== undefined ? item.news.publishedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    institutionalHoldings: props.asset.institutionalHoldings ? 
      Array.isArray(props.asset.institutionalHoldings) && props.asset.institutionalHoldings.length > 0 &&  props.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.asset.institutionalHoldings.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.asset.institutionalHoldings.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          symbol: item.symbol !== undefined ? {
              equals: item.symbol 
             } : undefined,
        },
        create: {
          institutionName: item.institutionName !== undefined ? item.institutionName : undefined,
          filingDate: item.filingDate !== undefined ? item.filingDate : undefined,
          reportDate: item.reportDate !== undefined ? item.reportDate : undefined,
          sharesHeld: item.sharesHeld !== undefined ? item.sharesHeld : undefined,
          marketValue: item.marketValue !== undefined ? item.marketValue : undefined,
          percentOfClass: item.percentOfClass !== undefined ? item.percentOfClass : undefined,
          changeShares: item.changeShares !== undefined ? item.changeShares : undefined,
          changePercent: item.changePercent !== undefined ? item.changePercent : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
        },
      }))
    } : undefined,
      },
    }
  } : undefined,
      },
          update: {
      signalDate: props.signalDate !== undefined ? {
            set: props.signalDate 
           } : undefined,
  signalType: props.signalType !== undefined ? {
            set: props.signalType 
           } : undefined,
  signalStrength: props.signalStrength !== undefined ? {
            set: props.signalStrength 
           } : undefined,
  netFlow: props.netFlow !== undefined ? {
            set: props.netFlow 
           } : undefined,
  confidence: props.confidence !== undefined ? {
            set: props.confidence 
           } : undefined,
  metadata: props.metadata !== undefined ? props.metadata : undefined,
  asset: props.asset ? 
  typeof props.asset === 'object' && Object.keys(props.asset).length === 1 && (Object.keys(props.asset)[0] === 'id' || Object.keys(props.asset)[0] === 'symbol')
? {
  connect: {
    id: props.asset.id
  }
} : { upsert: {
      where: {
        id: props.asset.id !== undefined ? {
            equals: props.asset.id
          } : undefined,
        symbol: props.asset.symbol !== undefined ? {
            equals: props.asset.symbol
          } : undefined,
        name: props.asset.name !== undefined ? {
            equals: props.asset.name
          } : undefined,
        type: props.asset.type !== undefined ? {
            equals: props.asset.type
          } : undefined,
      },
      update: {
        id: props.asset.id !== undefined ? {
            set: props.asset.id
          } : undefined,
        symbol: props.asset.symbol !== undefined ? {
            set: props.asset.symbol
          } : undefined,
        name: props.asset.name !== undefined ? {
            set: props.asset.name
          } : undefined,
        type: props.asset.type !== undefined ? {
            set: props.asset.type
          } : undefined,
        logoUrl: props.asset.logoUrl !== undefined ? {
            set: props.asset.logoUrl
          } : undefined,
        description: props.asset.description !== undefined ? {
            set: props.asset.description
          } : undefined,
        cik: props.asset.cik !== undefined ? {
            set: props.asset.cik
          } : undefined,
        exchange: props.asset.exchange !== undefined ? {
            set: props.asset.exchange
          } : undefined,
        currency: props.asset.currency !== undefined ? {
            set: props.asset.currency
          } : undefined,
        country: props.asset.country !== undefined ? {
            set: props.asset.country
          } : undefined,
        sector: props.asset.sector !== undefined ? {
            set: props.asset.sector
          } : undefined,
        industry: props.asset.industry !== undefined ? {
            set: props.asset.industry
          } : undefined,
        address: props.asset.address !== undefined ? {
            set: props.asset.address
          } : undefined,
        officialSite: props.asset.officialSite !== undefined ? {
            set: props.asset.officialSite
          } : undefined,
        fiscalYearEnd: props.asset.fiscalYearEnd !== undefined ? {
            set: props.asset.fiscalYearEnd
          } : undefined,
        latestQuarter: props.asset.latestQuarter !== undefined ? {
            set: props.asset.latestQuarter
          } : undefined,
        marketCapitalization: props.asset.marketCapitalization !== undefined ? {
            set: props.asset.marketCapitalization
          } : undefined,
        ebitda: props.asset.ebitda !== undefined ? {
            set: props.asset.ebitda
          } : undefined,
        peRatio: props.asset.peRatio !== undefined ? {
            set: props.asset.peRatio
          } : undefined,
        pegRatio: props.asset.pegRatio !== undefined ? {
            set: props.asset.pegRatio
          } : undefined,
        bookValue: props.asset.bookValue !== undefined ? {
            set: props.asset.bookValue
          } : undefined,
        dividendPerShare: props.asset.dividendPerShare !== undefined ? {
            set: props.asset.dividendPerShare
          } : undefined,
        dividendYield: props.asset.dividendYield !== undefined ? {
            set: props.asset.dividendYield
          } : undefined,
        eps: props.asset.eps !== undefined ? {
            set: props.asset.eps
          } : undefined,
        revenuePerShareTTM: props.asset.revenuePerShareTTM !== undefined ? {
            set: props.asset.revenuePerShareTTM
          } : undefined,
        profitMargin: props.asset.profitMargin !== undefined ? {
            set: props.asset.profitMargin
          } : undefined,
        operatingMarginTTM: props.asset.operatingMarginTTM !== undefined ? {
            set: props.asset.operatingMarginTTM
          } : undefined,
        returnOnAssetsTTM: props.asset.returnOnAssetsTTM !== undefined ? {
            set: props.asset.returnOnAssetsTTM
          } : undefined,
        returnOnEquityTTM: props.asset.returnOnEquityTTM !== undefined ? {
            set: props.asset.returnOnEquityTTM
          } : undefined,
        revenueTTM: props.asset.revenueTTM !== undefined ? {
            set: props.asset.revenueTTM
          } : undefined,
        grossProfitTTM: props.asset.grossProfitTTM !== undefined ? {
            set: props.asset.grossProfitTTM
          } : undefined,
        dilutedEPSTTM: props.asset.dilutedEPSTTM !== undefined ? {
            set: props.asset.dilutedEPSTTM
          } : undefined,
        quarterlyEarningsGrowthYOY: props.asset.quarterlyEarningsGrowthYOY !== undefined ? {
            set: props.asset.quarterlyEarningsGrowthYOY
          } : undefined,
        quarterlyRevenueGrowthYOY: props.asset.quarterlyRevenueGrowthYOY !== undefined ? {
            set: props.asset.quarterlyRevenueGrowthYOY
          } : undefined,
        analystTargetPrice: props.asset.analystTargetPrice !== undefined ? {
            set: props.asset.analystTargetPrice
          } : undefined,
        analystRatingStrongBuy: props.asset.analystRatingStrongBuy !== undefined ? {
            set: props.asset.analystRatingStrongBuy
          } : undefined,
        analystRatingBuy: props.asset.analystRatingBuy !== undefined ? {
            set: props.asset.analystRatingBuy
          } : undefined,
        analystRatingHold: props.asset.analystRatingHold !== undefined ? {
            set: props.asset.analystRatingHold
          } : undefined,
        analystRatingSell: props.asset.analystRatingSell !== undefined ? {
            set: props.asset.analystRatingSell
          } : undefined,
        analystRatingStrongSell: props.asset.analystRatingStrongSell !== undefined ? {
            set: props.asset.analystRatingStrongSell
          } : undefined,
        trailingPE: props.asset.trailingPE !== undefined ? {
            set: props.asset.trailingPE
          } : undefined,
        forwardPE: props.asset.forwardPE !== undefined ? {
            set: props.asset.forwardPE
          } : undefined,
        priceToSalesRatioTTM: props.asset.priceToSalesRatioTTM !== undefined ? {
            set: props.asset.priceToSalesRatioTTM
          } : undefined,
        priceToBookRatio: props.asset.priceToBookRatio !== undefined ? {
            set: props.asset.priceToBookRatio
          } : undefined,
        evToRevenue: props.asset.evToRevenue !== undefined ? {
            set: props.asset.evToRevenue
          } : undefined,
        evToEbitda: props.asset.evToEbitda !== undefined ? {
            set: props.asset.evToEbitda
          } : undefined,
        beta: props.asset.beta !== undefined ? {
            set: props.asset.beta
          } : undefined,
        week52High: props.asset.week52High !== undefined ? {
            set: props.asset.week52High
          } : undefined,
        week52Low: props.asset.week52Low !== undefined ? {
            set: props.asset.week52Low
          } : undefined,
        day50MovingAverage: props.asset.day50MovingAverage !== undefined ? {
            set: props.asset.day50MovingAverage
          } : undefined,
        day200MovingAverage: props.asset.day200MovingAverage !== undefined ? {
            set: props.asset.day200MovingAverage
          } : undefined,
        sharesOutstanding: props.asset.sharesOutstanding !== undefined ? {
            set: props.asset.sharesOutstanding
          } : undefined,
        dividendDate: props.asset.dividendDate !== undefined ? {
            set: props.asset.dividendDate
          } : undefined,
        exDividendDate: props.asset.exDividendDate !== undefined ? {
            set: props.asset.exDividendDate
          } : undefined,
        askPrice: props.asset.askPrice !== undefined ? {
            set: props.asset.askPrice
          } : undefined,
        bidPrice: props.asset.bidPrice !== undefined ? {
            set: props.asset.bidPrice
          } : undefined,
    newsMentions: props.asset.newsMentions ? 
    Array.isArray(props.asset.newsMentions) && props.asset.newsMentions.length > 0 && props.asset.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.asset.newsMentions.map((item) => ({
      id: item.id
    }))
} : { upsert: props.asset.newsMentions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          url: item.url !== undefined ? item.url : undefined,
          assetId: item.assetId !== undefined ? {
              equals: item.assetId
            } : undefined,
          newsArticleId: item.newsArticleId !== undefined ? {
              equals: item.newsArticleId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          url: item.url !== undefined ? {
              set: item.url
            } : undefined,
          relevancyScore: item.relevancyScore !== undefined ? {
              set: item.relevancyScore
            } : undefined,
          sentimentScore: item.sentimentScore !== undefined ? {
              set: item.sentimentScore
            } : undefined,
          sentimentLabel: item.sentimentLabel !== undefined ? {
              set: item.sentimentLabel
            } : undefined,
      news: item.news ? 
      typeof item.news === 'object' && Object.keys(item.news).length === 1 && (Object.keys(item.news)[0] === 'id' || Object.keys(item.news)[0] === 'symbol')
? {
      connect: {
        id: item.news.id
      }
} : { upsert: {
          where: {
            id: item.news.id !== undefined ? {
                equals: item.news.id
              } : undefined,
            title: item.news.title !== undefined ? {
                equals: item.news.title
              } : undefined,
            url: item.news.url !== undefined ? {
                equals: item.news.url
              } : undefined,
          },
          update: {
            id: item.news.id !== undefined ? {
                set: item.news.id
              } : undefined,
            title: item.news.title !== undefined ? {
                set: item.news.title
              } : undefined,
            content: item.news.content !== undefined ? {
                set: item.news.content
              } : undefined,
            source: item.news.source !== undefined ? {
                set: item.news.source
              } : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? {
                set: item.news.sourceDomain
              } : undefined,
            url: item.news.url !== undefined ? {
                set: item.news.url
              } : undefined,
            sentiment: item.news.sentiment !== undefined ? {
                set: item.news.sentiment
              } : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors
              } : undefined,
            summary: item.news.summary !== undefined ? {
                set: item.news.summary
              } : undefined,
            bannerImage: item.news.bannerImage !== undefined ? {
                set: item.news.bannerImage
              } : undefined,
            timePublished: item.news.timePublished !== undefined ? {
                set: item.news.timePublished
              } : undefined,
            category: item.news.category !== undefined ? {
                set: item.news.category
              } : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics
              } : undefined,
            logo: item.news.logo !== undefined ? {
                set: item.news.logo
              } : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols
              } : undefined,
            relevance: item.news.relevance !== undefined ? {
                set: item.news.relevance
              } : undefined,
            publishedAt: item.news.publishedAt !== undefined ? {
                set: item.news.publishedAt
              } : undefined,
          },
          create: {
            title: item.news.title !== undefined ? item.news.title : undefined,
            content: item.news.content !== undefined ? item.news.content : undefined,
            source: item.news.source !== undefined ? item.news.source : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? item.news.sourceDomain : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            sentiment: item.news.sentiment !== undefined ? item.news.sentiment : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors 
               } : undefined,
            summary: item.news.summary !== undefined ? item.news.summary : undefined,
            bannerImage: item.news.bannerImage !== undefined ? item.news.bannerImage : undefined,
            timePublished: item.news.timePublished !== undefined ? item.news.timePublished : undefined,
            category: item.news.category !== undefined ? item.news.category : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics 
               } : undefined,
            logo: item.news.logo !== undefined ? item.news.logo : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols 
               } : undefined,
            relevance: item.news.relevance !== undefined ? item.news.relevance : undefined,
            publishedAt: item.news.publishedAt !== undefined ? item.news.publishedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          url: item.url !== undefined ? item.url : undefined,
          relevancyScore: item.relevancyScore !== undefined ? item.relevancyScore : undefined,
          sentimentScore: item.sentimentScore !== undefined ? item.sentimentScore : undefined,
          sentimentLabel: item.sentimentLabel !== undefined ? item.sentimentLabel : undefined,
      news: item.news ? 
        typeof item.news === 'object' && Object.keys(item.news).length === 1 && Object.keys(item.news)[0] === 'id'
    ? { connect: {
            id: item.news.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.news.id !== undefined ? item.news.id : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            title: item.news.title !== undefined ? {
                equals: item.news.title 
               } : undefined,
          },
          create: {
            title: item.news.title !== undefined ? item.news.title : undefined,
            content: item.news.content !== undefined ? item.news.content : undefined,
            source: item.news.source !== undefined ? item.news.source : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? item.news.sourceDomain : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            sentiment: item.news.sentiment !== undefined ? item.news.sentiment : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors 
               } : undefined,
            summary: item.news.summary !== undefined ? item.news.summary : undefined,
            bannerImage: item.news.bannerImage !== undefined ? item.news.bannerImage : undefined,
            timePublished: item.news.timePublished !== undefined ? item.news.timePublished : undefined,
            category: item.news.category !== undefined ? item.news.category : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics 
               } : undefined,
            logo: item.news.logo !== undefined ? item.news.logo : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols 
               } : undefined,
            relevance: item.news.relevance !== undefined ? item.news.relevance : undefined,
            publishedAt: item.news.publishedAt !== undefined ? item.news.publishedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    institutionalHoldings: props.asset.institutionalHoldings ? 
    Array.isArray(props.asset.institutionalHoldings) && props.asset.institutionalHoldings.length > 0 && props.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: props.asset.institutionalHoldings.map((item) => ({
      id: item.id
    }))
} : { upsert: props.asset.institutionalHoldings.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          symbol: item.symbol !== undefined ? {
              equals: item.symbol
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          institutionName: item.institutionName !== undefined ? {
              set: item.institutionName
            } : undefined,
          filingDate: item.filingDate !== undefined ? {
              set: item.filingDate
            } : undefined,
          reportDate: item.reportDate !== undefined ? {
              set: item.reportDate
            } : undefined,
          sharesHeld: item.sharesHeld !== undefined ? {
              set: item.sharesHeld
            } : undefined,
          marketValue: item.marketValue !== undefined ? {
              set: item.marketValue
            } : undefined,
          percentOfClass: item.percentOfClass !== undefined ? {
              set: item.percentOfClass
            } : undefined,
          changeShares: item.changeShares !== undefined ? {
              set: item.changeShares
            } : undefined,
          changePercent: item.changePercent !== undefined ? {
              set: item.changePercent
            } : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
        },
        create: {
          institutionName: item.institutionName !== undefined ? item.institutionName : undefined,
          filingDate: item.filingDate !== undefined ? item.filingDate : undefined,
          reportDate: item.reportDate !== undefined ? item.reportDate : undefined,
          sharesHeld: item.sharesHeld !== undefined ? item.sharesHeld : undefined,
          marketValue: item.marketValue !== undefined ? item.marketValue : undefined,
          percentOfClass: item.percentOfClass !== undefined ? item.percentOfClass : undefined,
          changeShares: item.changeShares !== undefined ? item.changeShares : undefined,
          changePercent: item.changePercent !== undefined ? item.changePercent : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        symbol: props.asset.symbol !== undefined ? props.asset.symbol : undefined,
        name: props.asset.name !== undefined ? props.asset.name : undefined,
        type: props.asset.type !== undefined ? props.asset.type : undefined,
        logoUrl: props.asset.logoUrl !== undefined ? props.asset.logoUrl : undefined,
        description: props.asset.description !== undefined ? props.asset.description : undefined,
        cik: props.asset.cik !== undefined ? props.asset.cik : undefined,
        exchange: props.asset.exchange !== undefined ? props.asset.exchange : undefined,
        currency: props.asset.currency !== undefined ? props.asset.currency : undefined,
        country: props.asset.country !== undefined ? props.asset.country : undefined,
        sector: props.asset.sector !== undefined ? props.asset.sector : undefined,
        industry: props.asset.industry !== undefined ? props.asset.industry : undefined,
        address: props.asset.address !== undefined ? props.asset.address : undefined,
        officialSite: props.asset.officialSite !== undefined ? props.asset.officialSite : undefined,
        fiscalYearEnd: props.asset.fiscalYearEnd !== undefined ? props.asset.fiscalYearEnd : undefined,
        latestQuarter: props.asset.latestQuarter !== undefined ? props.asset.latestQuarter : undefined,
        marketCapitalization: props.asset.marketCapitalization !== undefined ? props.asset.marketCapitalization : undefined,
        ebitda: props.asset.ebitda !== undefined ? props.asset.ebitda : undefined,
        peRatio: props.asset.peRatio !== undefined ? props.asset.peRatio : undefined,
        pegRatio: props.asset.pegRatio !== undefined ? props.asset.pegRatio : undefined,
        bookValue: props.asset.bookValue !== undefined ? props.asset.bookValue : undefined,
        dividendPerShare: props.asset.dividendPerShare !== undefined ? props.asset.dividendPerShare : undefined,
        dividendYield: props.asset.dividendYield !== undefined ? props.asset.dividendYield : undefined,
        eps: props.asset.eps !== undefined ? props.asset.eps : undefined,
        revenuePerShareTTM: props.asset.revenuePerShareTTM !== undefined ? props.asset.revenuePerShareTTM : undefined,
        profitMargin: props.asset.profitMargin !== undefined ? props.asset.profitMargin : undefined,
        operatingMarginTTM: props.asset.operatingMarginTTM !== undefined ? props.asset.operatingMarginTTM : undefined,
        returnOnAssetsTTM: props.asset.returnOnAssetsTTM !== undefined ? props.asset.returnOnAssetsTTM : undefined,
        returnOnEquityTTM: props.asset.returnOnEquityTTM !== undefined ? props.asset.returnOnEquityTTM : undefined,
        revenueTTM: props.asset.revenueTTM !== undefined ? props.asset.revenueTTM : undefined,
        grossProfitTTM: props.asset.grossProfitTTM !== undefined ? props.asset.grossProfitTTM : undefined,
        dilutedEPSTTM: props.asset.dilutedEPSTTM !== undefined ? props.asset.dilutedEPSTTM : undefined,
        quarterlyEarningsGrowthYOY: props.asset.quarterlyEarningsGrowthYOY !== undefined ? props.asset.quarterlyEarningsGrowthYOY : undefined,
        quarterlyRevenueGrowthYOY: props.asset.quarterlyRevenueGrowthYOY !== undefined ? props.asset.quarterlyRevenueGrowthYOY : undefined,
        analystTargetPrice: props.asset.analystTargetPrice !== undefined ? props.asset.analystTargetPrice : undefined,
        analystRatingStrongBuy: props.asset.analystRatingStrongBuy !== undefined ? props.asset.analystRatingStrongBuy : undefined,
        analystRatingBuy: props.asset.analystRatingBuy !== undefined ? props.asset.analystRatingBuy : undefined,
        analystRatingHold: props.asset.analystRatingHold !== undefined ? props.asset.analystRatingHold : undefined,
        analystRatingSell: props.asset.analystRatingSell !== undefined ? props.asset.analystRatingSell : undefined,
        analystRatingStrongSell: props.asset.analystRatingStrongSell !== undefined ? props.asset.analystRatingStrongSell : undefined,
        trailingPE: props.asset.trailingPE !== undefined ? props.asset.trailingPE : undefined,
        forwardPE: props.asset.forwardPE !== undefined ? props.asset.forwardPE : undefined,
        priceToSalesRatioTTM: props.asset.priceToSalesRatioTTM !== undefined ? props.asset.priceToSalesRatioTTM : undefined,
        priceToBookRatio: props.asset.priceToBookRatio !== undefined ? props.asset.priceToBookRatio : undefined,
        evToRevenue: props.asset.evToRevenue !== undefined ? props.asset.evToRevenue : undefined,
        evToEbitda: props.asset.evToEbitda !== undefined ? props.asset.evToEbitda : undefined,
        beta: props.asset.beta !== undefined ? props.asset.beta : undefined,
        week52High: props.asset.week52High !== undefined ? props.asset.week52High : undefined,
        week52Low: props.asset.week52Low !== undefined ? props.asset.week52Low : undefined,
        day50MovingAverage: props.asset.day50MovingAverage !== undefined ? props.asset.day50MovingAverage : undefined,
        day200MovingAverage: props.asset.day200MovingAverage !== undefined ? props.asset.day200MovingAverage : undefined,
        sharesOutstanding: props.asset.sharesOutstanding !== undefined ? props.asset.sharesOutstanding : undefined,
        dividendDate: props.asset.dividendDate !== undefined ? props.asset.dividendDate : undefined,
        exDividendDate: props.asset.exDividendDate !== undefined ? props.asset.exDividendDate : undefined,
        askPrice: props.asset.askPrice !== undefined ? props.asset.askPrice : undefined,
        bidPrice: props.asset.bidPrice !== undefined ? props.asset.bidPrice : undefined,
    newsMentions: props.asset.newsMentions ? 
      Array.isArray(props.asset.newsMentions) && props.asset.newsMentions.length > 0 &&  props.asset.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.asset.newsMentions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.asset.newsMentions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          url: item.url !== undefined ? item.url : undefined,
          newsArticleId: item.newsArticleId !== undefined ? {
              equals: item.newsArticleId 
             } : undefined,
        },
        create: {
          url: item.url !== undefined ? item.url : undefined,
          relevancyScore: item.relevancyScore !== undefined ? item.relevancyScore : undefined,
          sentimentScore: item.sentimentScore !== undefined ? item.sentimentScore : undefined,
          sentimentLabel: item.sentimentLabel !== undefined ? item.sentimentLabel : undefined,
      news: item.news ? 
        typeof item.news === 'object' && Object.keys(item.news).length === 1 && Object.keys(item.news)[0] === 'id'
    ? { connect: {
            id: item.news.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.news.id !== undefined ? item.news.id : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            title: item.news.title !== undefined ? {
                equals: item.news.title 
               } : undefined,
          },
          create: {
            title: item.news.title !== undefined ? item.news.title : undefined,
            content: item.news.content !== undefined ? item.news.content : undefined,
            source: item.news.source !== undefined ? item.news.source : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? item.news.sourceDomain : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            sentiment: item.news.sentiment !== undefined ? item.news.sentiment : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors 
               } : undefined,
            summary: item.news.summary !== undefined ? item.news.summary : undefined,
            bannerImage: item.news.bannerImage !== undefined ? item.news.bannerImage : undefined,
            timePublished: item.news.timePublished !== undefined ? item.news.timePublished : undefined,
            category: item.news.category !== undefined ? item.news.category : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics 
               } : undefined,
            logo: item.news.logo !== undefined ? item.news.logo : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols 
               } : undefined,
            relevance: item.news.relevance !== undefined ? item.news.relevance : undefined,
            publishedAt: item.news.publishedAt !== undefined ? item.news.publishedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    institutionalHoldings: props.asset.institutionalHoldings ? 
      Array.isArray(props.asset.institutionalHoldings) && props.asset.institutionalHoldings.length > 0 &&  props.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      props.asset.institutionalHoldings.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: props.asset.institutionalHoldings.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          symbol: item.symbol !== undefined ? {
              equals: item.symbol 
             } : undefined,
        },
        create: {
          institutionName: item.institutionName !== undefined ? item.institutionName : undefined,
          filingDate: item.filingDate !== undefined ? item.filingDate : undefined,
          reportDate: item.reportDate !== undefined ? item.reportDate : undefined,
          sharesHeld: item.sharesHeld !== undefined ? item.sharesHeld : undefined,
          marketValue: item.marketValue !== undefined ? item.marketValue : undefined,
          percentOfClass: item.percentOfClass !== undefined ? item.percentOfClass : undefined,
          changeShares: item.changeShares !== undefined ? item.changeShares : undefined,
          changePercent: item.changePercent !== undefined ? item.changePercent : undefined,
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
          mutation: UPSERT_ONE_INSTITUTIONALFLOWSIGNAL,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneInstitutionalFlowSignal) {
          return response.data.upsertOneInstitutionalFlowSignal;
        } else {
          return null as unknown as InstitutionalFlowSignalType;
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
          logger.error("Non-retryable constraint violation in upsertOneInstitutionalFlowSignal", {
            operation: 'upsertOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
          logger.warn("Database connection error in upsertOneInstitutionalFlowSignal, retrying...", {
            operation: 'upsertOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
            operation: 'upsertOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
   * Update multiple InstitutionalFlowSignal records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of InstitutionalFlowSignal objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: InstitutionalFlowSignalType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_INSTITUTIONALFLOWSIGNAL = gql`
          mutation updateManyInstitutionalFlowSignal($data: [InstitutionalFlowSignalCreateManyInput!]!) {
            updateManyInstitutionalFlowSignal(data: $data) {
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
  signalDate: prop.signalDate !== undefined ? {
            set: prop.signalDate 
           } : undefined,
  signalType: prop.signalType !== undefined ? {
            set: prop.signalType 
           } : undefined,
  signalStrength: prop.signalStrength !== undefined ? {
            set: prop.signalStrength 
           } : undefined,
  netFlow: prop.netFlow !== undefined ? {
            set: prop.netFlow 
           } : undefined,
  confidence: prop.confidence !== undefined ? {
            set: prop.confidence 
           } : undefined,
  metadata: prop.metadata !== undefined ? prop.metadata : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  asset: prop.asset ? 
  typeof prop.asset === 'object' && Object.keys(prop.asset).length === 1 && (Object.keys(prop.asset)[0] === 'id' || Object.keys(prop.asset)[0] === 'symbol')
? {
  connect: {
    id: prop.asset.id
  }
} : { upsert: {
      where: {
        id: prop.asset.id !== undefined ? {
            equals: prop.asset.id
          } : undefined,
        symbol: prop.asset.symbol !== undefined ? {
            equals: prop.asset.symbol
          } : undefined,
        name: prop.asset.name !== undefined ? {
            equals: prop.asset.name
          } : undefined,
        type: prop.asset.type !== undefined ? {
            equals: prop.asset.type
          } : undefined,
      },
      update: {
        id: prop.asset.id !== undefined ? {
            set: prop.asset.id
          } : undefined,
        symbol: prop.asset.symbol !== undefined ? {
            set: prop.asset.symbol
          } : undefined,
        name: prop.asset.name !== undefined ? {
            set: prop.asset.name
          } : undefined,
        type: prop.asset.type !== undefined ? {
            set: prop.asset.type
          } : undefined,
        logoUrl: prop.asset.logoUrl !== undefined ? {
            set: prop.asset.logoUrl
          } : undefined,
        description: prop.asset.description !== undefined ? {
            set: prop.asset.description
          } : undefined,
        cik: prop.asset.cik !== undefined ? {
            set: prop.asset.cik
          } : undefined,
        exchange: prop.asset.exchange !== undefined ? {
            set: prop.asset.exchange
          } : undefined,
        currency: prop.asset.currency !== undefined ? {
            set: prop.asset.currency
          } : undefined,
        country: prop.asset.country !== undefined ? {
            set: prop.asset.country
          } : undefined,
        sector: prop.asset.sector !== undefined ? {
            set: prop.asset.sector
          } : undefined,
        industry: prop.asset.industry !== undefined ? {
            set: prop.asset.industry
          } : undefined,
        address: prop.asset.address !== undefined ? {
            set: prop.asset.address
          } : undefined,
        officialSite: prop.asset.officialSite !== undefined ? {
            set: prop.asset.officialSite
          } : undefined,
        fiscalYearEnd: prop.asset.fiscalYearEnd !== undefined ? {
            set: prop.asset.fiscalYearEnd
          } : undefined,
        latestQuarter: prop.asset.latestQuarter !== undefined ? {
            set: prop.asset.latestQuarter
          } : undefined,
        marketCapitalization: prop.asset.marketCapitalization !== undefined ? {
            set: prop.asset.marketCapitalization
          } : undefined,
        ebitda: prop.asset.ebitda !== undefined ? {
            set: prop.asset.ebitda
          } : undefined,
        peRatio: prop.asset.peRatio !== undefined ? {
            set: prop.asset.peRatio
          } : undefined,
        pegRatio: prop.asset.pegRatio !== undefined ? {
            set: prop.asset.pegRatio
          } : undefined,
        bookValue: prop.asset.bookValue !== undefined ? {
            set: prop.asset.bookValue
          } : undefined,
        dividendPerShare: prop.asset.dividendPerShare !== undefined ? {
            set: prop.asset.dividendPerShare
          } : undefined,
        dividendYield: prop.asset.dividendYield !== undefined ? {
            set: prop.asset.dividendYield
          } : undefined,
        eps: prop.asset.eps !== undefined ? {
            set: prop.asset.eps
          } : undefined,
        revenuePerShareTTM: prop.asset.revenuePerShareTTM !== undefined ? {
            set: prop.asset.revenuePerShareTTM
          } : undefined,
        profitMargin: prop.asset.profitMargin !== undefined ? {
            set: prop.asset.profitMargin
          } : undefined,
        operatingMarginTTM: prop.asset.operatingMarginTTM !== undefined ? {
            set: prop.asset.operatingMarginTTM
          } : undefined,
        returnOnAssetsTTM: prop.asset.returnOnAssetsTTM !== undefined ? {
            set: prop.asset.returnOnAssetsTTM
          } : undefined,
        returnOnEquityTTM: prop.asset.returnOnEquityTTM !== undefined ? {
            set: prop.asset.returnOnEquityTTM
          } : undefined,
        revenueTTM: prop.asset.revenueTTM !== undefined ? {
            set: prop.asset.revenueTTM
          } : undefined,
        grossProfitTTM: prop.asset.grossProfitTTM !== undefined ? {
            set: prop.asset.grossProfitTTM
          } : undefined,
        dilutedEPSTTM: prop.asset.dilutedEPSTTM !== undefined ? {
            set: prop.asset.dilutedEPSTTM
          } : undefined,
        quarterlyEarningsGrowthYOY: prop.asset.quarterlyEarningsGrowthYOY !== undefined ? {
            set: prop.asset.quarterlyEarningsGrowthYOY
          } : undefined,
        quarterlyRevenueGrowthYOY: prop.asset.quarterlyRevenueGrowthYOY !== undefined ? {
            set: prop.asset.quarterlyRevenueGrowthYOY
          } : undefined,
        analystTargetPrice: prop.asset.analystTargetPrice !== undefined ? {
            set: prop.asset.analystTargetPrice
          } : undefined,
        analystRatingStrongBuy: prop.asset.analystRatingStrongBuy !== undefined ? {
            set: prop.asset.analystRatingStrongBuy
          } : undefined,
        analystRatingBuy: prop.asset.analystRatingBuy !== undefined ? {
            set: prop.asset.analystRatingBuy
          } : undefined,
        analystRatingHold: prop.asset.analystRatingHold !== undefined ? {
            set: prop.asset.analystRatingHold
          } : undefined,
        analystRatingSell: prop.asset.analystRatingSell !== undefined ? {
            set: prop.asset.analystRatingSell
          } : undefined,
        analystRatingStrongSell: prop.asset.analystRatingStrongSell !== undefined ? {
            set: prop.asset.analystRatingStrongSell
          } : undefined,
        trailingPE: prop.asset.trailingPE !== undefined ? {
            set: prop.asset.trailingPE
          } : undefined,
        forwardPE: prop.asset.forwardPE !== undefined ? {
            set: prop.asset.forwardPE
          } : undefined,
        priceToSalesRatioTTM: prop.asset.priceToSalesRatioTTM !== undefined ? {
            set: prop.asset.priceToSalesRatioTTM
          } : undefined,
        priceToBookRatio: prop.asset.priceToBookRatio !== undefined ? {
            set: prop.asset.priceToBookRatio
          } : undefined,
        evToRevenue: prop.asset.evToRevenue !== undefined ? {
            set: prop.asset.evToRevenue
          } : undefined,
        evToEbitda: prop.asset.evToEbitda !== undefined ? {
            set: prop.asset.evToEbitda
          } : undefined,
        beta: prop.asset.beta !== undefined ? {
            set: prop.asset.beta
          } : undefined,
        week52High: prop.asset.week52High !== undefined ? {
            set: prop.asset.week52High
          } : undefined,
        week52Low: prop.asset.week52Low !== undefined ? {
            set: prop.asset.week52Low
          } : undefined,
        day50MovingAverage: prop.asset.day50MovingAverage !== undefined ? {
            set: prop.asset.day50MovingAverage
          } : undefined,
        day200MovingAverage: prop.asset.day200MovingAverage !== undefined ? {
            set: prop.asset.day200MovingAverage
          } : undefined,
        sharesOutstanding: prop.asset.sharesOutstanding !== undefined ? {
            set: prop.asset.sharesOutstanding
          } : undefined,
        dividendDate: prop.asset.dividendDate !== undefined ? {
            set: prop.asset.dividendDate
          } : undefined,
        exDividendDate: prop.asset.exDividendDate !== undefined ? {
            set: prop.asset.exDividendDate
          } : undefined,
        askPrice: prop.asset.askPrice !== undefined ? {
            set: prop.asset.askPrice
          } : undefined,
        bidPrice: prop.asset.bidPrice !== undefined ? {
            set: prop.asset.bidPrice
          } : undefined,
    newsMentions: prop.asset.newsMentions ? 
    Array.isArray(prop.asset.newsMentions) && prop.asset.newsMentions.length > 0 && prop.asset.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.asset.newsMentions.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.asset.newsMentions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          url: item.url !== undefined ? item.url : undefined,
          assetId: item.assetId !== undefined ? {
              equals: item.assetId
            } : undefined,
          newsArticleId: item.newsArticleId !== undefined ? {
              equals: item.newsArticleId
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          url: item.url !== undefined ? {
              set: item.url
            } : undefined,
          relevancyScore: item.relevancyScore !== undefined ? {
              set: item.relevancyScore
            } : undefined,
          sentimentScore: item.sentimentScore !== undefined ? {
              set: item.sentimentScore
            } : undefined,
          sentimentLabel: item.sentimentLabel !== undefined ? {
              set: item.sentimentLabel
            } : undefined,
      news: item.news ? 
      typeof item.news === 'object' && Object.keys(item.news).length === 1 && (Object.keys(item.news)[0] === 'id' || Object.keys(item.news)[0] === 'symbol')
? {
      connect: {
        id: item.news.id
      }
} : { upsert: {
          where: {
            id: item.news.id !== undefined ? {
                equals: item.news.id
              } : undefined,
            title: item.news.title !== undefined ? {
                equals: item.news.title
              } : undefined,
            url: item.news.url !== undefined ? {
                equals: item.news.url
              } : undefined,
          },
          update: {
            id: item.news.id !== undefined ? {
                set: item.news.id
              } : undefined,
            title: item.news.title !== undefined ? {
                set: item.news.title
              } : undefined,
            content: item.news.content !== undefined ? {
                set: item.news.content
              } : undefined,
            source: item.news.source !== undefined ? {
                set: item.news.source
              } : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? {
                set: item.news.sourceDomain
              } : undefined,
            url: item.news.url !== undefined ? {
                set: item.news.url
              } : undefined,
            sentiment: item.news.sentiment !== undefined ? {
                set: item.news.sentiment
              } : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors
              } : undefined,
            summary: item.news.summary !== undefined ? {
                set: item.news.summary
              } : undefined,
            bannerImage: item.news.bannerImage !== undefined ? {
                set: item.news.bannerImage
              } : undefined,
            timePublished: item.news.timePublished !== undefined ? {
                set: item.news.timePublished
              } : undefined,
            category: item.news.category !== undefined ? {
                set: item.news.category
              } : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics
              } : undefined,
            logo: item.news.logo !== undefined ? {
                set: item.news.logo
              } : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols
              } : undefined,
            relevance: item.news.relevance !== undefined ? {
                set: item.news.relevance
              } : undefined,
            publishedAt: item.news.publishedAt !== undefined ? {
                set: item.news.publishedAt
              } : undefined,
          },
          create: {
            title: item.news.title !== undefined ? item.news.title : undefined,
            content: item.news.content !== undefined ? item.news.content : undefined,
            source: item.news.source !== undefined ? item.news.source : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? item.news.sourceDomain : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            sentiment: item.news.sentiment !== undefined ? item.news.sentiment : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors 
               } : undefined,
            summary: item.news.summary !== undefined ? item.news.summary : undefined,
            bannerImage: item.news.bannerImage !== undefined ? item.news.bannerImage : undefined,
            timePublished: item.news.timePublished !== undefined ? item.news.timePublished : undefined,
            category: item.news.category !== undefined ? item.news.category : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics 
               } : undefined,
            logo: item.news.logo !== undefined ? item.news.logo : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols 
               } : undefined,
            relevance: item.news.relevance !== undefined ? item.news.relevance : undefined,
            publishedAt: item.news.publishedAt !== undefined ? item.news.publishedAt : undefined,
          },
        }
      } : undefined,
        },
        create: {
          url: item.url !== undefined ? item.url : undefined,
          relevancyScore: item.relevancyScore !== undefined ? item.relevancyScore : undefined,
          sentimentScore: item.sentimentScore !== undefined ? item.sentimentScore : undefined,
          sentimentLabel: item.sentimentLabel !== undefined ? item.sentimentLabel : undefined,
      news: item.news ? 
        typeof item.news === 'object' && Object.keys(item.news).length === 1 && Object.keys(item.news)[0] === 'id'
    ? { connect: {
            id: item.news.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.news.id !== undefined ? item.news.id : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            title: item.news.title !== undefined ? {
                equals: item.news.title 
               } : undefined,
          },
          create: {
            title: item.news.title !== undefined ? item.news.title : undefined,
            content: item.news.content !== undefined ? item.news.content : undefined,
            source: item.news.source !== undefined ? item.news.source : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? item.news.sourceDomain : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            sentiment: item.news.sentiment !== undefined ? item.news.sentiment : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors 
               } : undefined,
            summary: item.news.summary !== undefined ? item.news.summary : undefined,
            bannerImage: item.news.bannerImage !== undefined ? item.news.bannerImage : undefined,
            timePublished: item.news.timePublished !== undefined ? item.news.timePublished : undefined,
            category: item.news.category !== undefined ? item.news.category : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics 
               } : undefined,
            logo: item.news.logo !== undefined ? item.news.logo : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols 
               } : undefined,
            relevance: item.news.relevance !== undefined ? item.news.relevance : undefined,
            publishedAt: item.news.publishedAt !== undefined ? item.news.publishedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    institutionalHoldings: prop.asset.institutionalHoldings ? 
    Array.isArray(prop.asset.institutionalHoldings) && prop.asset.institutionalHoldings.length > 0 && prop.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
    connect: prop.asset.institutionalHoldings.map((item) => ({
      id: item.id
    }))
} : { upsert: prop.asset.institutionalHoldings.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          symbol: item.symbol !== undefined ? {
              equals: item.symbol
            } : undefined,
        },
        update: {
          id: item.id !== undefined ? {
              set: item.id
            } : undefined,
          institutionName: item.institutionName !== undefined ? {
              set: item.institutionName
            } : undefined,
          filingDate: item.filingDate !== undefined ? {
              set: item.filingDate
            } : undefined,
          reportDate: item.reportDate !== undefined ? {
              set: item.reportDate
            } : undefined,
          sharesHeld: item.sharesHeld !== undefined ? {
              set: item.sharesHeld
            } : undefined,
          marketValue: item.marketValue !== undefined ? {
              set: item.marketValue
            } : undefined,
          percentOfClass: item.percentOfClass !== undefined ? {
              set: item.percentOfClass
            } : undefined,
          changeShares: item.changeShares !== undefined ? {
              set: item.changeShares
            } : undefined,
          changePercent: item.changePercent !== undefined ? {
              set: item.changePercent
            } : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
        },
        create: {
          institutionName: item.institutionName !== undefined ? item.institutionName : undefined,
          filingDate: item.filingDate !== undefined ? item.filingDate : undefined,
          reportDate: item.reportDate !== undefined ? item.reportDate : undefined,
          sharesHeld: item.sharesHeld !== undefined ? item.sharesHeld : undefined,
          marketValue: item.marketValue !== undefined ? item.marketValue : undefined,
          percentOfClass: item.percentOfClass !== undefined ? item.percentOfClass : undefined,
          changeShares: item.changeShares !== undefined ? item.changeShares : undefined,
          changePercent: item.changePercent !== undefined ? item.changePercent : undefined,
          metadata: item.metadata !== undefined ? item.metadata : undefined,
        },
      }))
    } : undefined,
      },
      create: {
        symbol: prop.asset.symbol !== undefined ? prop.asset.symbol : undefined,
        name: prop.asset.name !== undefined ? prop.asset.name : undefined,
        type: prop.asset.type !== undefined ? prop.asset.type : undefined,
        logoUrl: prop.asset.logoUrl !== undefined ? prop.asset.logoUrl : undefined,
        description: prop.asset.description !== undefined ? prop.asset.description : undefined,
        cik: prop.asset.cik !== undefined ? prop.asset.cik : undefined,
        exchange: prop.asset.exchange !== undefined ? prop.asset.exchange : undefined,
        currency: prop.asset.currency !== undefined ? prop.asset.currency : undefined,
        country: prop.asset.country !== undefined ? prop.asset.country : undefined,
        sector: prop.asset.sector !== undefined ? prop.asset.sector : undefined,
        industry: prop.asset.industry !== undefined ? prop.asset.industry : undefined,
        address: prop.asset.address !== undefined ? prop.asset.address : undefined,
        officialSite: prop.asset.officialSite !== undefined ? prop.asset.officialSite : undefined,
        fiscalYearEnd: prop.asset.fiscalYearEnd !== undefined ? prop.asset.fiscalYearEnd : undefined,
        latestQuarter: prop.asset.latestQuarter !== undefined ? prop.asset.latestQuarter : undefined,
        marketCapitalization: prop.asset.marketCapitalization !== undefined ? prop.asset.marketCapitalization : undefined,
        ebitda: prop.asset.ebitda !== undefined ? prop.asset.ebitda : undefined,
        peRatio: prop.asset.peRatio !== undefined ? prop.asset.peRatio : undefined,
        pegRatio: prop.asset.pegRatio !== undefined ? prop.asset.pegRatio : undefined,
        bookValue: prop.asset.bookValue !== undefined ? prop.asset.bookValue : undefined,
        dividendPerShare: prop.asset.dividendPerShare !== undefined ? prop.asset.dividendPerShare : undefined,
        dividendYield: prop.asset.dividendYield !== undefined ? prop.asset.dividendYield : undefined,
        eps: prop.asset.eps !== undefined ? prop.asset.eps : undefined,
        revenuePerShareTTM: prop.asset.revenuePerShareTTM !== undefined ? prop.asset.revenuePerShareTTM : undefined,
        profitMargin: prop.asset.profitMargin !== undefined ? prop.asset.profitMargin : undefined,
        operatingMarginTTM: prop.asset.operatingMarginTTM !== undefined ? prop.asset.operatingMarginTTM : undefined,
        returnOnAssetsTTM: prop.asset.returnOnAssetsTTM !== undefined ? prop.asset.returnOnAssetsTTM : undefined,
        returnOnEquityTTM: prop.asset.returnOnEquityTTM !== undefined ? prop.asset.returnOnEquityTTM : undefined,
        revenueTTM: prop.asset.revenueTTM !== undefined ? prop.asset.revenueTTM : undefined,
        grossProfitTTM: prop.asset.grossProfitTTM !== undefined ? prop.asset.grossProfitTTM : undefined,
        dilutedEPSTTM: prop.asset.dilutedEPSTTM !== undefined ? prop.asset.dilutedEPSTTM : undefined,
        quarterlyEarningsGrowthYOY: prop.asset.quarterlyEarningsGrowthYOY !== undefined ? prop.asset.quarterlyEarningsGrowthYOY : undefined,
        quarterlyRevenueGrowthYOY: prop.asset.quarterlyRevenueGrowthYOY !== undefined ? prop.asset.quarterlyRevenueGrowthYOY : undefined,
        analystTargetPrice: prop.asset.analystTargetPrice !== undefined ? prop.asset.analystTargetPrice : undefined,
        analystRatingStrongBuy: prop.asset.analystRatingStrongBuy !== undefined ? prop.asset.analystRatingStrongBuy : undefined,
        analystRatingBuy: prop.asset.analystRatingBuy !== undefined ? prop.asset.analystRatingBuy : undefined,
        analystRatingHold: prop.asset.analystRatingHold !== undefined ? prop.asset.analystRatingHold : undefined,
        analystRatingSell: prop.asset.analystRatingSell !== undefined ? prop.asset.analystRatingSell : undefined,
        analystRatingStrongSell: prop.asset.analystRatingStrongSell !== undefined ? prop.asset.analystRatingStrongSell : undefined,
        trailingPE: prop.asset.trailingPE !== undefined ? prop.asset.trailingPE : undefined,
        forwardPE: prop.asset.forwardPE !== undefined ? prop.asset.forwardPE : undefined,
        priceToSalesRatioTTM: prop.asset.priceToSalesRatioTTM !== undefined ? prop.asset.priceToSalesRatioTTM : undefined,
        priceToBookRatio: prop.asset.priceToBookRatio !== undefined ? prop.asset.priceToBookRatio : undefined,
        evToRevenue: prop.asset.evToRevenue !== undefined ? prop.asset.evToRevenue : undefined,
        evToEbitda: prop.asset.evToEbitda !== undefined ? prop.asset.evToEbitda : undefined,
        beta: prop.asset.beta !== undefined ? prop.asset.beta : undefined,
        week52High: prop.asset.week52High !== undefined ? prop.asset.week52High : undefined,
        week52Low: prop.asset.week52Low !== undefined ? prop.asset.week52Low : undefined,
        day50MovingAverage: prop.asset.day50MovingAverage !== undefined ? prop.asset.day50MovingAverage : undefined,
        day200MovingAverage: prop.asset.day200MovingAverage !== undefined ? prop.asset.day200MovingAverage : undefined,
        sharesOutstanding: prop.asset.sharesOutstanding !== undefined ? prop.asset.sharesOutstanding : undefined,
        dividendDate: prop.asset.dividendDate !== undefined ? prop.asset.dividendDate : undefined,
        exDividendDate: prop.asset.exDividendDate !== undefined ? prop.asset.exDividendDate : undefined,
        askPrice: prop.asset.askPrice !== undefined ? prop.asset.askPrice : undefined,
        bidPrice: prop.asset.bidPrice !== undefined ? prop.asset.bidPrice : undefined,
    newsMentions: prop.asset.newsMentions ? 
      Array.isArray(prop.asset.newsMentions) && prop.asset.newsMentions.length > 0 &&  prop.asset.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.asset.newsMentions.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.asset.newsMentions.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          url: item.url !== undefined ? item.url : undefined,
          newsArticleId: item.newsArticleId !== undefined ? {
              equals: item.newsArticleId 
             } : undefined,
        },
        create: {
          url: item.url !== undefined ? item.url : undefined,
          relevancyScore: item.relevancyScore !== undefined ? item.relevancyScore : undefined,
          sentimentScore: item.sentimentScore !== undefined ? item.sentimentScore : undefined,
          sentimentLabel: item.sentimentLabel !== undefined ? item.sentimentLabel : undefined,
      news: item.news ? 
        typeof item.news === 'object' && Object.keys(item.news).length === 1 && Object.keys(item.news)[0] === 'id'
    ? { connect: {
            id: item.news.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: item.news.id !== undefined ? item.news.id : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            title: item.news.title !== undefined ? {
                equals: item.news.title 
               } : undefined,
          },
          create: {
            title: item.news.title !== undefined ? item.news.title : undefined,
            content: item.news.content !== undefined ? item.news.content : undefined,
            source: item.news.source !== undefined ? item.news.source : undefined,
            sourceDomain: item.news.sourceDomain !== undefined ? item.news.sourceDomain : undefined,
            url: item.news.url !== undefined ? item.news.url : undefined,
            sentiment: item.news.sentiment !== undefined ? item.news.sentiment : undefined,
            authors: item.news.authors !== undefined ? {
                set: item.news.authors 
               } : undefined,
            summary: item.news.summary !== undefined ? item.news.summary : undefined,
            bannerImage: item.news.bannerImage !== undefined ? item.news.bannerImage : undefined,
            timePublished: item.news.timePublished !== undefined ? item.news.timePublished : undefined,
            category: item.news.category !== undefined ? item.news.category : undefined,
            topics: item.news.topics !== undefined ? {
                set: item.news.topics 
               } : undefined,
            logo: item.news.logo !== undefined ? item.news.logo : undefined,
            symbols: item.news.symbols !== undefined ? {
                set: item.news.symbols 
               } : undefined,
            relevance: item.news.relevance !== undefined ? item.news.relevance : undefined,
            publishedAt: item.news.publishedAt !== undefined ? item.news.publishedAt : undefined,
          },
        }
      } : undefined,
        },
      }))
    } : undefined,
    institutionalHoldings: prop.asset.institutionalHoldings ? 
      Array.isArray(prop.asset.institutionalHoldings) && prop.asset.institutionalHoldings.length > 0 &&  prop.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
        connect:      prop.asset.institutionalHoldings.map((item) => ({
           id: item.id
        }))
 }
 : { connectOrCreate: prop.asset.institutionalHoldings.map((item) => ({
        where: {
          id: item.id !== undefined ? item.id : undefined,
          symbol: item.symbol !== undefined ? {
              equals: item.symbol 
             } : undefined,
        },
        create: {
          institutionName: item.institutionName !== undefined ? item.institutionName : undefined,
          filingDate: item.filingDate !== undefined ? item.filingDate : undefined,
          reportDate: item.reportDate !== undefined ? item.reportDate : undefined,
          sharesHeld: item.sharesHeld !== undefined ? item.sharesHeld : undefined,
          marketValue: item.marketValue !== undefined ? item.marketValue : undefined,
          percentOfClass: item.percentOfClass !== undefined ? item.percentOfClass : undefined,
          changeShares: item.changeShares !== undefined ? item.changeShares : undefined,
          changePercent: item.changePercent !== undefined ? item.changePercent : undefined,
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
          mutation: UPDATE_MANY_INSTITUTIONALFLOWSIGNAL,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyInstitutionalFlowSignal) {
          return response.data.updateManyInstitutionalFlowSignal;
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
          logger.error("Non-retryable constraint violation in updateManyInstitutionalFlowSignal", {
            operation: 'updateManyInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
          logger.warn("Database connection error in updateManyInstitutionalFlowSignal, retrying...", {
            operation: 'updateManyInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
   * Delete a single InstitutionalFlowSignal record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted InstitutionalFlowSignal or null.
   */
  async delete(props: InstitutionalFlowSignalType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<InstitutionalFlowSignalType> {
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

        const DELETE_ONE_INSTITUTIONALFLOWSIGNAL = gql`
          mutation deleteOneInstitutionalFlowSignal($where: InstitutionalFlowSignalWhereUniqueInput!) {
            deleteOneInstitutionalFlowSignal(where: $where) {
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
          mutation: DELETE_ONE_INSTITUTIONALFLOWSIGNAL,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneInstitutionalFlowSignal) {
          return response.data.deleteOneInstitutionalFlowSignal;
        } else {
          return null as unknown as InstitutionalFlowSignalType;
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
          logger.error("Non-retryable constraint violation in deleteOneInstitutionalFlowSignal", {
            operation: 'deleteOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
          logger.warn("Database connection error in deleteOneInstitutionalFlowSignal, retrying...", {
            operation: 'deleteOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
            operation: 'deleteOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
   * Retrieve a single InstitutionalFlowSignal record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved InstitutionalFlowSignal or null.
   */
  async get(props: InstitutionalFlowSignalType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<InstitutionalFlowSignalType | null> {
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

        const GET_INSTITUTIONALFLOWSIGNAL = gql`
          query getInstitutionalFlowSignal($where: InstitutionalFlowSignalWhereUniqueInput!) {
            getInstitutionalFlowSignal(where: $where) {
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
          query: GET_INSTITUTIONALFLOWSIGNAL,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getInstitutionalFlowSignal ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No InstitutionalFlowSignal found') {
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
          logger.warn("Database connection error in getInstitutionalFlowSignal, retrying...", {
            operation: 'getInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
   * Retrieve all InstitutionalFlowSignals records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of InstitutionalFlowSignal records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<InstitutionalFlowSignalType[] | null> {
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

        const GET_ALL_INSTITUTIONALFLOWSIGNAL = gql`
          query getAllInstitutionalFlowSignal {
            institutionalFlowSignals {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_INSTITUTIONALFLOWSIGNAL,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.institutionalFlowSignals ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No InstitutionalFlowSignal found') {
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
          logger.warn("Database connection error in getAllInstitutionalFlowSignal, retrying...", {
            operation: 'getAllInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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
   * Find multiple InstitutionalFlowSignal records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found InstitutionalFlowSignal records or null.
   */
  async findMany(props: InstitutionalFlowSignalType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<InstitutionalFlowSignalType[] | null> {
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

        const FIND_MANY_INSTITUTIONALFLOWSIGNAL = gql`
          query findManyInstitutionalFlowSignal($where: InstitutionalFlowSignalWhereInput!) {
            institutionalFlowSignals(where: $where) {
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
          throw new Error(`findManyInstitutionalFlowSignal requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_INSTITUTIONALFLOWSIGNAL,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.institutionalFlowSignals) {
          return response.data.institutionalFlowSignals;
        } else {
          return [] as InstitutionalFlowSignalType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No InstitutionalFlowSignal found') {
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
          logger.warn("Database connection error in findManyInstitutionalFlowSignal, retrying...", {
            operation: 'findManyInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyInstitutionalFlowSignal',
            model: 'InstitutionalFlowSignal',
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

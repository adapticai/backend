
  
import { NewsArticle as NewsArticleType } from './generated/typegraphql-prisma/models/NewsArticle';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the NewsArticle model.
   */

  const selectionSet = `
    
  id
  title
  content
  source
  sourceDomain
  url
  sentiment
  authors
  summary
  bannerImage
  timePublished
  category
  topics
  logo
  symbols
  relevance
  publishedAt
  createdAt
  updatedAt

  `;

  export const NewsArticle = {

    /**
     * Create a new NewsArticle record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created NewsArticle or null.
     */

    /**
     * Create a new NewsArticle record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created NewsArticle or null.
     */
    async create(props: NewsArticleType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<NewsArticleType> {
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

          const CREATE_ONE_NEWSARTICLE = gql`
              mutation createOneNewsArticle($data: NewsArticleCreateInput!) {
                createOneNewsArticle(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                title: props.title !== undefined ? props.title : undefined,
  content: props.content !== undefined ? props.content : undefined,
  source: props.source !== undefined ? props.source : undefined,
  sourceDomain: props.sourceDomain !== undefined ? props.sourceDomain : undefined,
  url: props.url !== undefined ? props.url : undefined,
  sentiment: props.sentiment !== undefined ? props.sentiment : undefined,
  authors: props.authors !== undefined ? {
    set: props.authors 
  } : undefined,
  summary: props.summary !== undefined ? props.summary : undefined,
  bannerImage: props.bannerImage !== undefined ? props.bannerImage : undefined,
  timePublished: props.timePublished !== undefined ? props.timePublished : undefined,
  category: props.category !== undefined ? props.category : undefined,
  topics: props.topics !== undefined ? {
    set: props.topics 
  } : undefined,
  logo: props.logo !== undefined ? props.logo : undefined,
  symbols: props.symbols !== undefined ? {
    set: props.symbols 
  } : undefined,
  relevance: props.relevance !== undefined ? props.relevance : undefined,
  publishedAt: props.publishedAt !== undefined ? props.publishedAt : undefined,
  assets: props.assets ? 
    Array.isArray(props.assets) && props.assets.length > 0 &&  props.assets.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.assets.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.assets.map((item) => ({
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
    asset: item.asset ? 
      typeof item.asset === 'object' && Object.keys(item.asset).length === 1 && Object.keys(item.asset)[0] === 'id'
    ? { connect: {
          id: item.asset.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: item.asset.id !== undefined ? item.asset.id : undefined,
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? {
              equals: item.asset.type 
             } : undefined,
        },
        create: {
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? item.asset.type : undefined,
          logoUrl: item.asset.logoUrl !== undefined ? item.asset.logoUrl : undefined,
          description: item.asset.description !== undefined ? item.asset.description : undefined,
          cik: item.asset.cik !== undefined ? item.asset.cik : undefined,
          exchange: item.asset.exchange !== undefined ? item.asset.exchange : undefined,
          currency: item.asset.currency !== undefined ? item.asset.currency : undefined,
          country: item.asset.country !== undefined ? item.asset.country : undefined,
          sector: item.asset.sector !== undefined ? item.asset.sector : undefined,
          industry: item.asset.industry !== undefined ? item.asset.industry : undefined,
          address: item.asset.address !== undefined ? item.asset.address : undefined,
          officialSite: item.asset.officialSite !== undefined ? item.asset.officialSite : undefined,
          fiscalYearEnd: item.asset.fiscalYearEnd !== undefined ? item.asset.fiscalYearEnd : undefined,
          latestQuarter: item.asset.latestQuarter !== undefined ? item.asset.latestQuarter : undefined,
          marketCapitalization: item.asset.marketCapitalization !== undefined ? item.asset.marketCapitalization : undefined,
          ebitda: item.asset.ebitda !== undefined ? item.asset.ebitda : undefined,
          peRatio: item.asset.peRatio !== undefined ? item.asset.peRatio : undefined,
          pegRatio: item.asset.pegRatio !== undefined ? item.asset.pegRatio : undefined,
          bookValue: item.asset.bookValue !== undefined ? item.asset.bookValue : undefined,
          dividendPerShare: item.asset.dividendPerShare !== undefined ? item.asset.dividendPerShare : undefined,
          dividendYield: item.asset.dividendYield !== undefined ? item.asset.dividendYield : undefined,
          eps: item.asset.eps !== undefined ? item.asset.eps : undefined,
          revenuePerShareTTM: item.asset.revenuePerShareTTM !== undefined ? item.asset.revenuePerShareTTM : undefined,
          profitMargin: item.asset.profitMargin !== undefined ? item.asset.profitMargin : undefined,
          operatingMarginTTM: item.asset.operatingMarginTTM !== undefined ? item.asset.operatingMarginTTM : undefined,
          returnOnAssetsTTM: item.asset.returnOnAssetsTTM !== undefined ? item.asset.returnOnAssetsTTM : undefined,
          returnOnEquityTTM: item.asset.returnOnEquityTTM !== undefined ? item.asset.returnOnEquityTTM : undefined,
          revenueTTM: item.asset.revenueTTM !== undefined ? item.asset.revenueTTM : undefined,
          grossProfitTTM: item.asset.grossProfitTTM !== undefined ? item.asset.grossProfitTTM : undefined,
          dilutedEPSTTM: item.asset.dilutedEPSTTM !== undefined ? item.asset.dilutedEPSTTM : undefined,
          quarterlyEarningsGrowthYOY: item.asset.quarterlyEarningsGrowthYOY !== undefined ? item.asset.quarterlyEarningsGrowthYOY : undefined,
          quarterlyRevenueGrowthYOY: item.asset.quarterlyRevenueGrowthYOY !== undefined ? item.asset.quarterlyRevenueGrowthYOY : undefined,
          analystTargetPrice: item.asset.analystTargetPrice !== undefined ? item.asset.analystTargetPrice : undefined,
          analystRatingStrongBuy: item.asset.analystRatingStrongBuy !== undefined ? item.asset.analystRatingStrongBuy : undefined,
          analystRatingBuy: item.asset.analystRatingBuy !== undefined ? item.asset.analystRatingBuy : undefined,
          analystRatingHold: item.asset.analystRatingHold !== undefined ? item.asset.analystRatingHold : undefined,
          analystRatingSell: item.asset.analystRatingSell !== undefined ? item.asset.analystRatingSell : undefined,
          analystRatingStrongSell: item.asset.analystRatingStrongSell !== undefined ? item.asset.analystRatingStrongSell : undefined,
          trailingPE: item.asset.trailingPE !== undefined ? item.asset.trailingPE : undefined,
          forwardPE: item.asset.forwardPE !== undefined ? item.asset.forwardPE : undefined,
          priceToSalesRatioTTM: item.asset.priceToSalesRatioTTM !== undefined ? item.asset.priceToSalesRatioTTM : undefined,
          priceToBookRatio: item.asset.priceToBookRatio !== undefined ? item.asset.priceToBookRatio : undefined,
          evToRevenue: item.asset.evToRevenue !== undefined ? item.asset.evToRevenue : undefined,
          evToEbitda: item.asset.evToEbitda !== undefined ? item.asset.evToEbitda : undefined,
          beta: item.asset.beta !== undefined ? item.asset.beta : undefined,
          week52High: item.asset.week52High !== undefined ? item.asset.week52High : undefined,
          week52Low: item.asset.week52Low !== undefined ? item.asset.week52Low : undefined,
          day50MovingAverage: item.asset.day50MovingAverage !== undefined ? item.asset.day50MovingAverage : undefined,
          day200MovingAverage: item.asset.day200MovingAverage !== undefined ? item.asset.day200MovingAverage : undefined,
          sharesOutstanding: item.asset.sharesOutstanding !== undefined ? item.asset.sharesOutstanding : undefined,
          dividendDate: item.asset.dividendDate !== undefined ? item.asset.dividendDate : undefined,
          exDividendDate: item.asset.exDividendDate !== undefined ? item.asset.exDividendDate : undefined,
          askPrice: item.asset.askPrice !== undefined ? item.asset.askPrice : undefined,
          bidPrice: item.asset.bidPrice !== undefined ? item.asset.bidPrice : undefined,
      institutionalHoldings: item.asset.institutionalHoldings ? 
        Array.isArray(item.asset.institutionalHoldings) && item.asset.institutionalHoldings.length > 0 &&  item.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalHoldings.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalHoldings.map((item) => ({
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
      institutionalFlowSignals: item.asset.institutionalFlowSignals ? 
        Array.isArray(item.asset.institutionalFlowSignals) && item.asset.institutionalFlowSignals.length > 0 &&  item.asset.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalFlowSignals.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalFlowSignals.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            symbol: item.symbol !== undefined ? {
                equals: item.symbol 
               } : undefined,
          },
          create: {
            signalDate: item.signalDate !== undefined ? item.signalDate : undefined,
            signalType: item.signalType !== undefined ? item.signalType : undefined,
            signalStrength: item.signalStrength !== undefined ? item.signalStrength : undefined,
            netFlow: item.netFlow !== undefined ? item.netFlow : undefined,
            confidence: item.confidence !== undefined ? item.confidence : undefined,
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
            mutation: CREATE_ONE_NEWSARTICLE,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneNewsArticle) {
            return response.data.createOneNewsArticle;
          } else {
            return null as unknown as NewsArticleType;
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
            logger.error("Non-retryable constraint violation in createOneNewsArticle", {
              operation: 'createOneNewsArticle',
              model: 'NewsArticle',
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
            logger.warn("Database connection error in createOneNewsArticle, retrying...", {
              operation: 'createOneNewsArticle',
              model: 'NewsArticle',
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
              operation: 'createOneNewsArticle',
              model: 'NewsArticle',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneNewsArticle',
              model: 'NewsArticle',
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
   * Create multiple NewsArticle records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of NewsArticle objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: NewsArticleType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_NEWSARTICLE = gql`
          mutation createManyNewsArticle($data: [NewsArticleCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyNewsArticle(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      title: prop.title !== undefined ? prop.title : undefined,
  content: prop.content !== undefined ? prop.content : undefined,
  source: prop.source !== undefined ? prop.source : undefined,
  sourceDomain: prop.sourceDomain !== undefined ? prop.sourceDomain : undefined,
  url: prop.url !== undefined ? prop.url : undefined,
  sentiment: prop.sentiment !== undefined ? prop.sentiment : undefined,
  authors: prop.authors !== undefined ? {
    set: prop.authors 
  } : undefined,
  summary: prop.summary !== undefined ? prop.summary : undefined,
  bannerImage: prop.bannerImage !== undefined ? prop.bannerImage : undefined,
  timePublished: prop.timePublished !== undefined ? prop.timePublished : undefined,
  category: prop.category !== undefined ? prop.category : undefined,
  topics: prop.topics !== undefined ? {
    set: prop.topics 
  } : undefined,
  logo: prop.logo !== undefined ? prop.logo : undefined,
  symbols: prop.symbols !== undefined ? {
    set: prop.symbols 
  } : undefined,
  relevance: prop.relevance !== undefined ? prop.relevance : undefined,
  publishedAt: prop.publishedAt !== undefined ? prop.publishedAt : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_NEWSARTICLE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyNewsArticle) {
          return response.data.createManyNewsArticle;
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
          logger.warn("Duplicate key in createManyNewsArticle (expected during overlapping fetches)", {
            operation: 'createManyNewsArticle',
            model: 'NewsArticle',
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
          logger.warn("Database connection error in createManyNewsArticle, retrying...", {
            operation: 'createManyNewsArticle',
            model: 'NewsArticle',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyNewsArticle',
            model: 'NewsArticle',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyNewsArticle',
            model: 'NewsArticle',
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
   * Update a single NewsArticle record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated NewsArticle or null.
   */
  async update(props: NewsArticleType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<NewsArticleType> {
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

        const UPDATE_ONE_NEWSARTICLE = gql`
          mutation updateOneNewsArticle($data: NewsArticleUpdateInput!, $where: NewsArticleWhereUniqueInput!) {
            updateOneNewsArticle(data: $data, where: $where) {
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
  title: props.title !== undefined ? {
            set: props.title 
           } : undefined,
  content: props.content !== undefined ? {
            set: props.content 
           } : undefined,
  source: props.source !== undefined ? {
            set: props.source 
           } : undefined,
  sourceDomain: props.sourceDomain !== undefined ? {
            set: props.sourceDomain 
           } : undefined,
  url: props.url !== undefined ? {
            set: props.url 
           } : undefined,
  sentiment: props.sentiment !== undefined ? {
            set: props.sentiment 
           } : undefined,
  authors: props.authors !== undefined ? {
            set: props.authors 
           } : undefined,
  summary: props.summary !== undefined ? {
            set: props.summary 
           } : undefined,
  bannerImage: props.bannerImage !== undefined ? {
            set: props.bannerImage 
           } : undefined,
  timePublished: props.timePublished !== undefined ? {
            set: props.timePublished 
           } : undefined,
  category: props.category !== undefined ? {
            set: props.category 
           } : undefined,
  topics: props.topics !== undefined ? {
            set: props.topics 
           } : undefined,
  logo: props.logo !== undefined ? {
            set: props.logo 
           } : undefined,
  symbols: props.symbols !== undefined ? {
            set: props.symbols 
           } : undefined,
  relevance: props.relevance !== undefined ? {
            set: props.relevance 
           } : undefined,
  publishedAt: props.publishedAt !== undefined ? {
            set: props.publishedAt 
           } : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
  assets: props.assets ? 
  Array.isArray(props.assets) && props.assets.length > 0 && props.assets.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.assets.map((item) => ({
    id: item.id
  }))
} : { upsert: props.assets.map((item) => ({
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
    asset: item.asset ? 
    typeof item.asset === 'object' && Object.keys(item.asset).length === 1 && (Object.keys(item.asset)[0] === 'id' || Object.keys(item.asset)[0] === 'symbol')
? {
    connect: {
      id: item.asset.id
    }
} : { upsert: {
        where: {
          id: item.asset.id !== undefined ? {
              equals: item.asset.id
            } : undefined,
          symbol: item.asset.symbol !== undefined ? {
              equals: item.asset.symbol
            } : undefined,
          name: item.asset.name !== undefined ? {
              equals: item.asset.name
            } : undefined,
          type: item.asset.type !== undefined ? {
              equals: item.asset.type
            } : undefined,
        },
        update: {
          id: item.asset.id !== undefined ? {
              set: item.asset.id
            } : undefined,
          symbol: item.asset.symbol !== undefined ? {
              set: item.asset.symbol
            } : undefined,
          name: item.asset.name !== undefined ? {
              set: item.asset.name
            } : undefined,
          type: item.asset.type !== undefined ? {
              set: item.asset.type
            } : undefined,
          logoUrl: item.asset.logoUrl !== undefined ? {
              set: item.asset.logoUrl
            } : undefined,
          description: item.asset.description !== undefined ? {
              set: item.asset.description
            } : undefined,
          cik: item.asset.cik !== undefined ? {
              set: item.asset.cik
            } : undefined,
          exchange: item.asset.exchange !== undefined ? {
              set: item.asset.exchange
            } : undefined,
          currency: item.asset.currency !== undefined ? {
              set: item.asset.currency
            } : undefined,
          country: item.asset.country !== undefined ? {
              set: item.asset.country
            } : undefined,
          sector: item.asset.sector !== undefined ? {
              set: item.asset.sector
            } : undefined,
          industry: item.asset.industry !== undefined ? {
              set: item.asset.industry
            } : undefined,
          address: item.asset.address !== undefined ? {
              set: item.asset.address
            } : undefined,
          officialSite: item.asset.officialSite !== undefined ? {
              set: item.asset.officialSite
            } : undefined,
          fiscalYearEnd: item.asset.fiscalYearEnd !== undefined ? {
              set: item.asset.fiscalYearEnd
            } : undefined,
          latestQuarter: item.asset.latestQuarter !== undefined ? {
              set: item.asset.latestQuarter
            } : undefined,
          marketCapitalization: item.asset.marketCapitalization !== undefined ? {
              set: item.asset.marketCapitalization
            } : undefined,
          ebitda: item.asset.ebitda !== undefined ? {
              set: item.asset.ebitda
            } : undefined,
          peRatio: item.asset.peRatio !== undefined ? {
              set: item.asset.peRatio
            } : undefined,
          pegRatio: item.asset.pegRatio !== undefined ? {
              set: item.asset.pegRatio
            } : undefined,
          bookValue: item.asset.bookValue !== undefined ? {
              set: item.asset.bookValue
            } : undefined,
          dividendPerShare: item.asset.dividendPerShare !== undefined ? {
              set: item.asset.dividendPerShare
            } : undefined,
          dividendYield: item.asset.dividendYield !== undefined ? {
              set: item.asset.dividendYield
            } : undefined,
          eps: item.asset.eps !== undefined ? {
              set: item.asset.eps
            } : undefined,
          revenuePerShareTTM: item.asset.revenuePerShareTTM !== undefined ? {
              set: item.asset.revenuePerShareTTM
            } : undefined,
          profitMargin: item.asset.profitMargin !== undefined ? {
              set: item.asset.profitMargin
            } : undefined,
          operatingMarginTTM: item.asset.operatingMarginTTM !== undefined ? {
              set: item.asset.operatingMarginTTM
            } : undefined,
          returnOnAssetsTTM: item.asset.returnOnAssetsTTM !== undefined ? {
              set: item.asset.returnOnAssetsTTM
            } : undefined,
          returnOnEquityTTM: item.asset.returnOnEquityTTM !== undefined ? {
              set: item.asset.returnOnEquityTTM
            } : undefined,
          revenueTTM: item.asset.revenueTTM !== undefined ? {
              set: item.asset.revenueTTM
            } : undefined,
          grossProfitTTM: item.asset.grossProfitTTM !== undefined ? {
              set: item.asset.grossProfitTTM
            } : undefined,
          dilutedEPSTTM: item.asset.dilutedEPSTTM !== undefined ? {
              set: item.asset.dilutedEPSTTM
            } : undefined,
          quarterlyEarningsGrowthYOY: item.asset.quarterlyEarningsGrowthYOY !== undefined ? {
              set: item.asset.quarterlyEarningsGrowthYOY
            } : undefined,
          quarterlyRevenueGrowthYOY: item.asset.quarterlyRevenueGrowthYOY !== undefined ? {
              set: item.asset.quarterlyRevenueGrowthYOY
            } : undefined,
          analystTargetPrice: item.asset.analystTargetPrice !== undefined ? {
              set: item.asset.analystTargetPrice
            } : undefined,
          analystRatingStrongBuy: item.asset.analystRatingStrongBuy !== undefined ? {
              set: item.asset.analystRatingStrongBuy
            } : undefined,
          analystRatingBuy: item.asset.analystRatingBuy !== undefined ? {
              set: item.asset.analystRatingBuy
            } : undefined,
          analystRatingHold: item.asset.analystRatingHold !== undefined ? {
              set: item.asset.analystRatingHold
            } : undefined,
          analystRatingSell: item.asset.analystRatingSell !== undefined ? {
              set: item.asset.analystRatingSell
            } : undefined,
          analystRatingStrongSell: item.asset.analystRatingStrongSell !== undefined ? {
              set: item.asset.analystRatingStrongSell
            } : undefined,
          trailingPE: item.asset.trailingPE !== undefined ? {
              set: item.asset.trailingPE
            } : undefined,
          forwardPE: item.asset.forwardPE !== undefined ? {
              set: item.asset.forwardPE
            } : undefined,
          priceToSalesRatioTTM: item.asset.priceToSalesRatioTTM !== undefined ? {
              set: item.asset.priceToSalesRatioTTM
            } : undefined,
          priceToBookRatio: item.asset.priceToBookRatio !== undefined ? {
              set: item.asset.priceToBookRatio
            } : undefined,
          evToRevenue: item.asset.evToRevenue !== undefined ? {
              set: item.asset.evToRevenue
            } : undefined,
          evToEbitda: item.asset.evToEbitda !== undefined ? {
              set: item.asset.evToEbitda
            } : undefined,
          beta: item.asset.beta !== undefined ? {
              set: item.asset.beta
            } : undefined,
          week52High: item.asset.week52High !== undefined ? {
              set: item.asset.week52High
            } : undefined,
          week52Low: item.asset.week52Low !== undefined ? {
              set: item.asset.week52Low
            } : undefined,
          day50MovingAverage: item.asset.day50MovingAverage !== undefined ? {
              set: item.asset.day50MovingAverage
            } : undefined,
          day200MovingAverage: item.asset.day200MovingAverage !== undefined ? {
              set: item.asset.day200MovingAverage
            } : undefined,
          sharesOutstanding: item.asset.sharesOutstanding !== undefined ? {
              set: item.asset.sharesOutstanding
            } : undefined,
          dividendDate: item.asset.dividendDate !== undefined ? {
              set: item.asset.dividendDate
            } : undefined,
          exDividendDate: item.asset.exDividendDate !== undefined ? {
              set: item.asset.exDividendDate
            } : undefined,
          askPrice: item.asset.askPrice !== undefined ? {
              set: item.asset.askPrice
            } : undefined,
          bidPrice: item.asset.bidPrice !== undefined ? {
              set: item.asset.bidPrice
            } : undefined,
      institutionalHoldings: item.asset.institutionalHoldings ? 
      Array.isArray(item.asset.institutionalHoldings) && item.asset.institutionalHoldings.length > 0 && item.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.asset.institutionalHoldings.map((item) => ({
        id: item.id
      }))
} : { upsert: item.asset.institutionalHoldings.map((item) => ({
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
      institutionalFlowSignals: item.asset.institutionalFlowSignals ? 
      Array.isArray(item.asset.institutionalFlowSignals) && item.asset.institutionalFlowSignals.length > 0 && item.asset.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.asset.institutionalFlowSignals.map((item) => ({
        id: item.id
      }))
} : { upsert: item.asset.institutionalFlowSignals.map((item) => ({
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
            signalDate: item.signalDate !== undefined ? {
                set: item.signalDate
              } : undefined,
            signalType: item.signalType !== undefined ? {
                set: item.signalType
              } : undefined,
            signalStrength: item.signalStrength !== undefined ? {
                set: item.signalStrength
              } : undefined,
            netFlow: item.netFlow !== undefined ? {
                set: item.netFlow
              } : undefined,
            confidence: item.confidence !== undefined ? {
                set: item.confidence
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            signalDate: item.signalDate !== undefined ? item.signalDate : undefined,
            signalType: item.signalType !== undefined ? item.signalType : undefined,
            signalStrength: item.signalStrength !== undefined ? item.signalStrength : undefined,
            netFlow: item.netFlow !== undefined ? item.netFlow : undefined,
            confidence: item.confidence !== undefined ? item.confidence : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? item.asset.type : undefined,
          logoUrl: item.asset.logoUrl !== undefined ? item.asset.logoUrl : undefined,
          description: item.asset.description !== undefined ? item.asset.description : undefined,
          cik: item.asset.cik !== undefined ? item.asset.cik : undefined,
          exchange: item.asset.exchange !== undefined ? item.asset.exchange : undefined,
          currency: item.asset.currency !== undefined ? item.asset.currency : undefined,
          country: item.asset.country !== undefined ? item.asset.country : undefined,
          sector: item.asset.sector !== undefined ? item.asset.sector : undefined,
          industry: item.asset.industry !== undefined ? item.asset.industry : undefined,
          address: item.asset.address !== undefined ? item.asset.address : undefined,
          officialSite: item.asset.officialSite !== undefined ? item.asset.officialSite : undefined,
          fiscalYearEnd: item.asset.fiscalYearEnd !== undefined ? item.asset.fiscalYearEnd : undefined,
          latestQuarter: item.asset.latestQuarter !== undefined ? item.asset.latestQuarter : undefined,
          marketCapitalization: item.asset.marketCapitalization !== undefined ? item.asset.marketCapitalization : undefined,
          ebitda: item.asset.ebitda !== undefined ? item.asset.ebitda : undefined,
          peRatio: item.asset.peRatio !== undefined ? item.asset.peRatio : undefined,
          pegRatio: item.asset.pegRatio !== undefined ? item.asset.pegRatio : undefined,
          bookValue: item.asset.bookValue !== undefined ? item.asset.bookValue : undefined,
          dividendPerShare: item.asset.dividendPerShare !== undefined ? item.asset.dividendPerShare : undefined,
          dividendYield: item.asset.dividendYield !== undefined ? item.asset.dividendYield : undefined,
          eps: item.asset.eps !== undefined ? item.asset.eps : undefined,
          revenuePerShareTTM: item.asset.revenuePerShareTTM !== undefined ? item.asset.revenuePerShareTTM : undefined,
          profitMargin: item.asset.profitMargin !== undefined ? item.asset.profitMargin : undefined,
          operatingMarginTTM: item.asset.operatingMarginTTM !== undefined ? item.asset.operatingMarginTTM : undefined,
          returnOnAssetsTTM: item.asset.returnOnAssetsTTM !== undefined ? item.asset.returnOnAssetsTTM : undefined,
          returnOnEquityTTM: item.asset.returnOnEquityTTM !== undefined ? item.asset.returnOnEquityTTM : undefined,
          revenueTTM: item.asset.revenueTTM !== undefined ? item.asset.revenueTTM : undefined,
          grossProfitTTM: item.asset.grossProfitTTM !== undefined ? item.asset.grossProfitTTM : undefined,
          dilutedEPSTTM: item.asset.dilutedEPSTTM !== undefined ? item.asset.dilutedEPSTTM : undefined,
          quarterlyEarningsGrowthYOY: item.asset.quarterlyEarningsGrowthYOY !== undefined ? item.asset.quarterlyEarningsGrowthYOY : undefined,
          quarterlyRevenueGrowthYOY: item.asset.quarterlyRevenueGrowthYOY !== undefined ? item.asset.quarterlyRevenueGrowthYOY : undefined,
          analystTargetPrice: item.asset.analystTargetPrice !== undefined ? item.asset.analystTargetPrice : undefined,
          analystRatingStrongBuy: item.asset.analystRatingStrongBuy !== undefined ? item.asset.analystRatingStrongBuy : undefined,
          analystRatingBuy: item.asset.analystRatingBuy !== undefined ? item.asset.analystRatingBuy : undefined,
          analystRatingHold: item.asset.analystRatingHold !== undefined ? item.asset.analystRatingHold : undefined,
          analystRatingSell: item.asset.analystRatingSell !== undefined ? item.asset.analystRatingSell : undefined,
          analystRatingStrongSell: item.asset.analystRatingStrongSell !== undefined ? item.asset.analystRatingStrongSell : undefined,
          trailingPE: item.asset.trailingPE !== undefined ? item.asset.trailingPE : undefined,
          forwardPE: item.asset.forwardPE !== undefined ? item.asset.forwardPE : undefined,
          priceToSalesRatioTTM: item.asset.priceToSalesRatioTTM !== undefined ? item.asset.priceToSalesRatioTTM : undefined,
          priceToBookRatio: item.asset.priceToBookRatio !== undefined ? item.asset.priceToBookRatio : undefined,
          evToRevenue: item.asset.evToRevenue !== undefined ? item.asset.evToRevenue : undefined,
          evToEbitda: item.asset.evToEbitda !== undefined ? item.asset.evToEbitda : undefined,
          beta: item.asset.beta !== undefined ? item.asset.beta : undefined,
          week52High: item.asset.week52High !== undefined ? item.asset.week52High : undefined,
          week52Low: item.asset.week52Low !== undefined ? item.asset.week52Low : undefined,
          day50MovingAverage: item.asset.day50MovingAverage !== undefined ? item.asset.day50MovingAverage : undefined,
          day200MovingAverage: item.asset.day200MovingAverage !== undefined ? item.asset.day200MovingAverage : undefined,
          sharesOutstanding: item.asset.sharesOutstanding !== undefined ? item.asset.sharesOutstanding : undefined,
          dividendDate: item.asset.dividendDate !== undefined ? item.asset.dividendDate : undefined,
          exDividendDate: item.asset.exDividendDate !== undefined ? item.asset.exDividendDate : undefined,
          askPrice: item.asset.askPrice !== undefined ? item.asset.askPrice : undefined,
          bidPrice: item.asset.bidPrice !== undefined ? item.asset.bidPrice : undefined,
      institutionalHoldings: item.asset.institutionalHoldings ? 
        Array.isArray(item.asset.institutionalHoldings) && item.asset.institutionalHoldings.length > 0 &&  item.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalHoldings.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalHoldings.map((item) => ({
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
      institutionalFlowSignals: item.asset.institutionalFlowSignals ? 
        Array.isArray(item.asset.institutionalFlowSignals) && item.asset.institutionalFlowSignals.length > 0 &&  item.asset.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalFlowSignals.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalFlowSignals.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            symbol: item.symbol !== undefined ? {
                equals: item.symbol 
               } : undefined,
          },
          create: {
            signalDate: item.signalDate !== undefined ? item.signalDate : undefined,
            signalType: item.signalType !== undefined ? item.signalType : undefined,
            signalStrength: item.signalStrength !== undefined ? item.signalStrength : undefined,
            netFlow: item.netFlow !== undefined ? item.netFlow : undefined,
            confidence: item.confidence !== undefined ? item.confidence : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
      },
      create: {
        url: item.url !== undefined ? item.url : undefined,
        relevancyScore: item.relevancyScore !== undefined ? item.relevancyScore : undefined,
        sentimentScore: item.sentimentScore !== undefined ? item.sentimentScore : undefined,
        sentimentLabel: item.sentimentLabel !== undefined ? item.sentimentLabel : undefined,
    asset: item.asset ? 
      typeof item.asset === 'object' && Object.keys(item.asset).length === 1 && Object.keys(item.asset)[0] === 'id'
    ? { connect: {
          id: item.asset.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: item.asset.id !== undefined ? item.asset.id : undefined,
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? {
              equals: item.asset.type 
             } : undefined,
        },
        create: {
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? item.asset.type : undefined,
          logoUrl: item.asset.logoUrl !== undefined ? item.asset.logoUrl : undefined,
          description: item.asset.description !== undefined ? item.asset.description : undefined,
          cik: item.asset.cik !== undefined ? item.asset.cik : undefined,
          exchange: item.asset.exchange !== undefined ? item.asset.exchange : undefined,
          currency: item.asset.currency !== undefined ? item.asset.currency : undefined,
          country: item.asset.country !== undefined ? item.asset.country : undefined,
          sector: item.asset.sector !== undefined ? item.asset.sector : undefined,
          industry: item.asset.industry !== undefined ? item.asset.industry : undefined,
          address: item.asset.address !== undefined ? item.asset.address : undefined,
          officialSite: item.asset.officialSite !== undefined ? item.asset.officialSite : undefined,
          fiscalYearEnd: item.asset.fiscalYearEnd !== undefined ? item.asset.fiscalYearEnd : undefined,
          latestQuarter: item.asset.latestQuarter !== undefined ? item.asset.latestQuarter : undefined,
          marketCapitalization: item.asset.marketCapitalization !== undefined ? item.asset.marketCapitalization : undefined,
          ebitda: item.asset.ebitda !== undefined ? item.asset.ebitda : undefined,
          peRatio: item.asset.peRatio !== undefined ? item.asset.peRatio : undefined,
          pegRatio: item.asset.pegRatio !== undefined ? item.asset.pegRatio : undefined,
          bookValue: item.asset.bookValue !== undefined ? item.asset.bookValue : undefined,
          dividendPerShare: item.asset.dividendPerShare !== undefined ? item.asset.dividendPerShare : undefined,
          dividendYield: item.asset.dividendYield !== undefined ? item.asset.dividendYield : undefined,
          eps: item.asset.eps !== undefined ? item.asset.eps : undefined,
          revenuePerShareTTM: item.asset.revenuePerShareTTM !== undefined ? item.asset.revenuePerShareTTM : undefined,
          profitMargin: item.asset.profitMargin !== undefined ? item.asset.profitMargin : undefined,
          operatingMarginTTM: item.asset.operatingMarginTTM !== undefined ? item.asset.operatingMarginTTM : undefined,
          returnOnAssetsTTM: item.asset.returnOnAssetsTTM !== undefined ? item.asset.returnOnAssetsTTM : undefined,
          returnOnEquityTTM: item.asset.returnOnEquityTTM !== undefined ? item.asset.returnOnEquityTTM : undefined,
          revenueTTM: item.asset.revenueTTM !== undefined ? item.asset.revenueTTM : undefined,
          grossProfitTTM: item.asset.grossProfitTTM !== undefined ? item.asset.grossProfitTTM : undefined,
          dilutedEPSTTM: item.asset.dilutedEPSTTM !== undefined ? item.asset.dilutedEPSTTM : undefined,
          quarterlyEarningsGrowthYOY: item.asset.quarterlyEarningsGrowthYOY !== undefined ? item.asset.quarterlyEarningsGrowthYOY : undefined,
          quarterlyRevenueGrowthYOY: item.asset.quarterlyRevenueGrowthYOY !== undefined ? item.asset.quarterlyRevenueGrowthYOY : undefined,
          analystTargetPrice: item.asset.analystTargetPrice !== undefined ? item.asset.analystTargetPrice : undefined,
          analystRatingStrongBuy: item.asset.analystRatingStrongBuy !== undefined ? item.asset.analystRatingStrongBuy : undefined,
          analystRatingBuy: item.asset.analystRatingBuy !== undefined ? item.asset.analystRatingBuy : undefined,
          analystRatingHold: item.asset.analystRatingHold !== undefined ? item.asset.analystRatingHold : undefined,
          analystRatingSell: item.asset.analystRatingSell !== undefined ? item.asset.analystRatingSell : undefined,
          analystRatingStrongSell: item.asset.analystRatingStrongSell !== undefined ? item.asset.analystRatingStrongSell : undefined,
          trailingPE: item.asset.trailingPE !== undefined ? item.asset.trailingPE : undefined,
          forwardPE: item.asset.forwardPE !== undefined ? item.asset.forwardPE : undefined,
          priceToSalesRatioTTM: item.asset.priceToSalesRatioTTM !== undefined ? item.asset.priceToSalesRatioTTM : undefined,
          priceToBookRatio: item.asset.priceToBookRatio !== undefined ? item.asset.priceToBookRatio : undefined,
          evToRevenue: item.asset.evToRevenue !== undefined ? item.asset.evToRevenue : undefined,
          evToEbitda: item.asset.evToEbitda !== undefined ? item.asset.evToEbitda : undefined,
          beta: item.asset.beta !== undefined ? item.asset.beta : undefined,
          week52High: item.asset.week52High !== undefined ? item.asset.week52High : undefined,
          week52Low: item.asset.week52Low !== undefined ? item.asset.week52Low : undefined,
          day50MovingAverage: item.asset.day50MovingAverage !== undefined ? item.asset.day50MovingAverage : undefined,
          day200MovingAverage: item.asset.day200MovingAverage !== undefined ? item.asset.day200MovingAverage : undefined,
          sharesOutstanding: item.asset.sharesOutstanding !== undefined ? item.asset.sharesOutstanding : undefined,
          dividendDate: item.asset.dividendDate !== undefined ? item.asset.dividendDate : undefined,
          exDividendDate: item.asset.exDividendDate !== undefined ? item.asset.exDividendDate : undefined,
          askPrice: item.asset.askPrice !== undefined ? item.asset.askPrice : undefined,
          bidPrice: item.asset.bidPrice !== undefined ? item.asset.bidPrice : undefined,
      institutionalHoldings: item.asset.institutionalHoldings ? 
        Array.isArray(item.asset.institutionalHoldings) && item.asset.institutionalHoldings.length > 0 &&  item.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalHoldings.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalHoldings.map((item) => ({
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
      institutionalFlowSignals: item.asset.institutionalFlowSignals ? 
        Array.isArray(item.asset.institutionalFlowSignals) && item.asset.institutionalFlowSignals.length > 0 &&  item.asset.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalFlowSignals.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalFlowSignals.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            symbol: item.symbol !== undefined ? {
                equals: item.symbol 
               } : undefined,
          },
          create: {
            signalDate: item.signalDate !== undefined ? item.signalDate : undefined,
            signalType: item.signalType !== undefined ? item.signalType : undefined,
            signalStrength: item.signalStrength !== undefined ? item.signalStrength : undefined,
            netFlow: item.netFlow !== undefined ? item.netFlow : undefined,
            confidence: item.confidence !== undefined ? item.confidence : undefined,
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
          mutation: UPDATE_ONE_NEWSARTICLE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneNewsArticle) {
          return response.data.updateOneNewsArticle;
        } else {
          return null as unknown as NewsArticleType;
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
          logger.error("Non-retryable constraint violation in updateOneNewsArticle", {
            operation: 'updateOneNewsArticle',
            model: 'NewsArticle',
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
          logger.warn("Database connection error in updateOneNewsArticle, retrying...", {
            operation: 'updateOneNewsArticle',
            model: 'NewsArticle',
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
            operation: 'updateOneNewsArticle',
            model: 'NewsArticle',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneNewsArticle',
            model: 'NewsArticle',
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
   * Upsert a single NewsArticle record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated NewsArticle or null.
   */
  async upsert(props: NewsArticleType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<NewsArticleType> {
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

        const UPSERT_ONE_NEWSARTICLE = gql`
          mutation upsertOneNewsArticle($where: NewsArticleWhereUniqueInput!, $create: NewsArticleCreateInput!, $update: NewsArticleUpdateInput!) {
            upsertOneNewsArticle(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  url: props.url !== undefined ? props.url : undefined,
  title: props.title !== undefined ? {
    equals: props.title 
  } : undefined,
      },
          create: {
        title: props.title !== undefined ? props.title : undefined,
  content: props.content !== undefined ? props.content : undefined,
  source: props.source !== undefined ? props.source : undefined,
  sourceDomain: props.sourceDomain !== undefined ? props.sourceDomain : undefined,
  url: props.url !== undefined ? props.url : undefined,
  sentiment: props.sentiment !== undefined ? props.sentiment : undefined,
  authors: props.authors !== undefined ? {
    set: props.authors 
  } : undefined,
  summary: props.summary !== undefined ? props.summary : undefined,
  bannerImage: props.bannerImage !== undefined ? props.bannerImage : undefined,
  timePublished: props.timePublished !== undefined ? props.timePublished : undefined,
  category: props.category !== undefined ? props.category : undefined,
  topics: props.topics !== undefined ? {
    set: props.topics 
  } : undefined,
  logo: props.logo !== undefined ? props.logo : undefined,
  symbols: props.symbols !== undefined ? {
    set: props.symbols 
  } : undefined,
  relevance: props.relevance !== undefined ? props.relevance : undefined,
  publishedAt: props.publishedAt !== undefined ? props.publishedAt : undefined,
  assets: props.assets ? 
    Array.isArray(props.assets) && props.assets.length > 0 &&  props.assets.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.assets.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.assets.map((item) => ({
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
    asset: item.asset ? 
      typeof item.asset === 'object' && Object.keys(item.asset).length === 1 && Object.keys(item.asset)[0] === 'id'
    ? { connect: {
          id: item.asset.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: item.asset.id !== undefined ? item.asset.id : undefined,
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? {
              equals: item.asset.type 
             } : undefined,
        },
        create: {
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? item.asset.type : undefined,
          logoUrl: item.asset.logoUrl !== undefined ? item.asset.logoUrl : undefined,
          description: item.asset.description !== undefined ? item.asset.description : undefined,
          cik: item.asset.cik !== undefined ? item.asset.cik : undefined,
          exchange: item.asset.exchange !== undefined ? item.asset.exchange : undefined,
          currency: item.asset.currency !== undefined ? item.asset.currency : undefined,
          country: item.asset.country !== undefined ? item.asset.country : undefined,
          sector: item.asset.sector !== undefined ? item.asset.sector : undefined,
          industry: item.asset.industry !== undefined ? item.asset.industry : undefined,
          address: item.asset.address !== undefined ? item.asset.address : undefined,
          officialSite: item.asset.officialSite !== undefined ? item.asset.officialSite : undefined,
          fiscalYearEnd: item.asset.fiscalYearEnd !== undefined ? item.asset.fiscalYearEnd : undefined,
          latestQuarter: item.asset.latestQuarter !== undefined ? item.asset.latestQuarter : undefined,
          marketCapitalization: item.asset.marketCapitalization !== undefined ? item.asset.marketCapitalization : undefined,
          ebitda: item.asset.ebitda !== undefined ? item.asset.ebitda : undefined,
          peRatio: item.asset.peRatio !== undefined ? item.asset.peRatio : undefined,
          pegRatio: item.asset.pegRatio !== undefined ? item.asset.pegRatio : undefined,
          bookValue: item.asset.bookValue !== undefined ? item.asset.bookValue : undefined,
          dividendPerShare: item.asset.dividendPerShare !== undefined ? item.asset.dividendPerShare : undefined,
          dividendYield: item.asset.dividendYield !== undefined ? item.asset.dividendYield : undefined,
          eps: item.asset.eps !== undefined ? item.asset.eps : undefined,
          revenuePerShareTTM: item.asset.revenuePerShareTTM !== undefined ? item.asset.revenuePerShareTTM : undefined,
          profitMargin: item.asset.profitMargin !== undefined ? item.asset.profitMargin : undefined,
          operatingMarginTTM: item.asset.operatingMarginTTM !== undefined ? item.asset.operatingMarginTTM : undefined,
          returnOnAssetsTTM: item.asset.returnOnAssetsTTM !== undefined ? item.asset.returnOnAssetsTTM : undefined,
          returnOnEquityTTM: item.asset.returnOnEquityTTM !== undefined ? item.asset.returnOnEquityTTM : undefined,
          revenueTTM: item.asset.revenueTTM !== undefined ? item.asset.revenueTTM : undefined,
          grossProfitTTM: item.asset.grossProfitTTM !== undefined ? item.asset.grossProfitTTM : undefined,
          dilutedEPSTTM: item.asset.dilutedEPSTTM !== undefined ? item.asset.dilutedEPSTTM : undefined,
          quarterlyEarningsGrowthYOY: item.asset.quarterlyEarningsGrowthYOY !== undefined ? item.asset.quarterlyEarningsGrowthYOY : undefined,
          quarterlyRevenueGrowthYOY: item.asset.quarterlyRevenueGrowthYOY !== undefined ? item.asset.quarterlyRevenueGrowthYOY : undefined,
          analystTargetPrice: item.asset.analystTargetPrice !== undefined ? item.asset.analystTargetPrice : undefined,
          analystRatingStrongBuy: item.asset.analystRatingStrongBuy !== undefined ? item.asset.analystRatingStrongBuy : undefined,
          analystRatingBuy: item.asset.analystRatingBuy !== undefined ? item.asset.analystRatingBuy : undefined,
          analystRatingHold: item.asset.analystRatingHold !== undefined ? item.asset.analystRatingHold : undefined,
          analystRatingSell: item.asset.analystRatingSell !== undefined ? item.asset.analystRatingSell : undefined,
          analystRatingStrongSell: item.asset.analystRatingStrongSell !== undefined ? item.asset.analystRatingStrongSell : undefined,
          trailingPE: item.asset.trailingPE !== undefined ? item.asset.trailingPE : undefined,
          forwardPE: item.asset.forwardPE !== undefined ? item.asset.forwardPE : undefined,
          priceToSalesRatioTTM: item.asset.priceToSalesRatioTTM !== undefined ? item.asset.priceToSalesRatioTTM : undefined,
          priceToBookRatio: item.asset.priceToBookRatio !== undefined ? item.asset.priceToBookRatio : undefined,
          evToRevenue: item.asset.evToRevenue !== undefined ? item.asset.evToRevenue : undefined,
          evToEbitda: item.asset.evToEbitda !== undefined ? item.asset.evToEbitda : undefined,
          beta: item.asset.beta !== undefined ? item.asset.beta : undefined,
          week52High: item.asset.week52High !== undefined ? item.asset.week52High : undefined,
          week52Low: item.asset.week52Low !== undefined ? item.asset.week52Low : undefined,
          day50MovingAverage: item.asset.day50MovingAverage !== undefined ? item.asset.day50MovingAverage : undefined,
          day200MovingAverage: item.asset.day200MovingAverage !== undefined ? item.asset.day200MovingAverage : undefined,
          sharesOutstanding: item.asset.sharesOutstanding !== undefined ? item.asset.sharesOutstanding : undefined,
          dividendDate: item.asset.dividendDate !== undefined ? item.asset.dividendDate : undefined,
          exDividendDate: item.asset.exDividendDate !== undefined ? item.asset.exDividendDate : undefined,
          askPrice: item.asset.askPrice !== undefined ? item.asset.askPrice : undefined,
          bidPrice: item.asset.bidPrice !== undefined ? item.asset.bidPrice : undefined,
      institutionalHoldings: item.asset.institutionalHoldings ? 
        Array.isArray(item.asset.institutionalHoldings) && item.asset.institutionalHoldings.length > 0 &&  item.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalHoldings.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalHoldings.map((item) => ({
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
      institutionalFlowSignals: item.asset.institutionalFlowSignals ? 
        Array.isArray(item.asset.institutionalFlowSignals) && item.asset.institutionalFlowSignals.length > 0 &&  item.asset.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalFlowSignals.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalFlowSignals.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            symbol: item.symbol !== undefined ? {
                equals: item.symbol 
               } : undefined,
          },
          create: {
            signalDate: item.signalDate !== undefined ? item.signalDate : undefined,
            signalType: item.signalType !== undefined ? item.signalType : undefined,
            signalStrength: item.signalStrength !== undefined ? item.signalStrength : undefined,
            netFlow: item.netFlow !== undefined ? item.netFlow : undefined,
            confidence: item.confidence !== undefined ? item.confidence : undefined,
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
      title: props.title !== undefined ? {
            set: props.title 
           } : undefined,
  content: props.content !== undefined ? {
            set: props.content 
           } : undefined,
  source: props.source !== undefined ? {
            set: props.source 
           } : undefined,
  sourceDomain: props.sourceDomain !== undefined ? {
            set: props.sourceDomain 
           } : undefined,
  url: props.url !== undefined ? {
            set: props.url 
           } : undefined,
  sentiment: props.sentiment !== undefined ? {
            set: props.sentiment 
           } : undefined,
  authors: props.authors !== undefined ? {
            set: props.authors 
           } : undefined,
  summary: props.summary !== undefined ? {
            set: props.summary 
           } : undefined,
  bannerImage: props.bannerImage !== undefined ? {
            set: props.bannerImage 
           } : undefined,
  timePublished: props.timePublished !== undefined ? {
            set: props.timePublished 
           } : undefined,
  category: props.category !== undefined ? {
            set: props.category 
           } : undefined,
  topics: props.topics !== undefined ? {
            set: props.topics 
           } : undefined,
  logo: props.logo !== undefined ? {
            set: props.logo 
           } : undefined,
  symbols: props.symbols !== undefined ? {
            set: props.symbols 
           } : undefined,
  relevance: props.relevance !== undefined ? {
            set: props.relevance 
           } : undefined,
  publishedAt: props.publishedAt !== undefined ? {
            set: props.publishedAt 
           } : undefined,
  assets: props.assets ? 
  Array.isArray(props.assets) && props.assets.length > 0 && props.assets.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.assets.map((item) => ({
    id: item.id
  }))
} : { upsert: props.assets.map((item) => ({
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
    asset: item.asset ? 
    typeof item.asset === 'object' && Object.keys(item.asset).length === 1 && (Object.keys(item.asset)[0] === 'id' || Object.keys(item.asset)[0] === 'symbol')
? {
    connect: {
      id: item.asset.id
    }
} : { upsert: {
        where: {
          id: item.asset.id !== undefined ? {
              equals: item.asset.id
            } : undefined,
          symbol: item.asset.symbol !== undefined ? {
              equals: item.asset.symbol
            } : undefined,
          name: item.asset.name !== undefined ? {
              equals: item.asset.name
            } : undefined,
          type: item.asset.type !== undefined ? {
              equals: item.asset.type
            } : undefined,
        },
        update: {
          id: item.asset.id !== undefined ? {
              set: item.asset.id
            } : undefined,
          symbol: item.asset.symbol !== undefined ? {
              set: item.asset.symbol
            } : undefined,
          name: item.asset.name !== undefined ? {
              set: item.asset.name
            } : undefined,
          type: item.asset.type !== undefined ? {
              set: item.asset.type
            } : undefined,
          logoUrl: item.asset.logoUrl !== undefined ? {
              set: item.asset.logoUrl
            } : undefined,
          description: item.asset.description !== undefined ? {
              set: item.asset.description
            } : undefined,
          cik: item.asset.cik !== undefined ? {
              set: item.asset.cik
            } : undefined,
          exchange: item.asset.exchange !== undefined ? {
              set: item.asset.exchange
            } : undefined,
          currency: item.asset.currency !== undefined ? {
              set: item.asset.currency
            } : undefined,
          country: item.asset.country !== undefined ? {
              set: item.asset.country
            } : undefined,
          sector: item.asset.sector !== undefined ? {
              set: item.asset.sector
            } : undefined,
          industry: item.asset.industry !== undefined ? {
              set: item.asset.industry
            } : undefined,
          address: item.asset.address !== undefined ? {
              set: item.asset.address
            } : undefined,
          officialSite: item.asset.officialSite !== undefined ? {
              set: item.asset.officialSite
            } : undefined,
          fiscalYearEnd: item.asset.fiscalYearEnd !== undefined ? {
              set: item.asset.fiscalYearEnd
            } : undefined,
          latestQuarter: item.asset.latestQuarter !== undefined ? {
              set: item.asset.latestQuarter
            } : undefined,
          marketCapitalization: item.asset.marketCapitalization !== undefined ? {
              set: item.asset.marketCapitalization
            } : undefined,
          ebitda: item.asset.ebitda !== undefined ? {
              set: item.asset.ebitda
            } : undefined,
          peRatio: item.asset.peRatio !== undefined ? {
              set: item.asset.peRatio
            } : undefined,
          pegRatio: item.asset.pegRatio !== undefined ? {
              set: item.asset.pegRatio
            } : undefined,
          bookValue: item.asset.bookValue !== undefined ? {
              set: item.asset.bookValue
            } : undefined,
          dividendPerShare: item.asset.dividendPerShare !== undefined ? {
              set: item.asset.dividendPerShare
            } : undefined,
          dividendYield: item.asset.dividendYield !== undefined ? {
              set: item.asset.dividendYield
            } : undefined,
          eps: item.asset.eps !== undefined ? {
              set: item.asset.eps
            } : undefined,
          revenuePerShareTTM: item.asset.revenuePerShareTTM !== undefined ? {
              set: item.asset.revenuePerShareTTM
            } : undefined,
          profitMargin: item.asset.profitMargin !== undefined ? {
              set: item.asset.profitMargin
            } : undefined,
          operatingMarginTTM: item.asset.operatingMarginTTM !== undefined ? {
              set: item.asset.operatingMarginTTM
            } : undefined,
          returnOnAssetsTTM: item.asset.returnOnAssetsTTM !== undefined ? {
              set: item.asset.returnOnAssetsTTM
            } : undefined,
          returnOnEquityTTM: item.asset.returnOnEquityTTM !== undefined ? {
              set: item.asset.returnOnEquityTTM
            } : undefined,
          revenueTTM: item.asset.revenueTTM !== undefined ? {
              set: item.asset.revenueTTM
            } : undefined,
          grossProfitTTM: item.asset.grossProfitTTM !== undefined ? {
              set: item.asset.grossProfitTTM
            } : undefined,
          dilutedEPSTTM: item.asset.dilutedEPSTTM !== undefined ? {
              set: item.asset.dilutedEPSTTM
            } : undefined,
          quarterlyEarningsGrowthYOY: item.asset.quarterlyEarningsGrowthYOY !== undefined ? {
              set: item.asset.quarterlyEarningsGrowthYOY
            } : undefined,
          quarterlyRevenueGrowthYOY: item.asset.quarterlyRevenueGrowthYOY !== undefined ? {
              set: item.asset.quarterlyRevenueGrowthYOY
            } : undefined,
          analystTargetPrice: item.asset.analystTargetPrice !== undefined ? {
              set: item.asset.analystTargetPrice
            } : undefined,
          analystRatingStrongBuy: item.asset.analystRatingStrongBuy !== undefined ? {
              set: item.asset.analystRatingStrongBuy
            } : undefined,
          analystRatingBuy: item.asset.analystRatingBuy !== undefined ? {
              set: item.asset.analystRatingBuy
            } : undefined,
          analystRatingHold: item.asset.analystRatingHold !== undefined ? {
              set: item.asset.analystRatingHold
            } : undefined,
          analystRatingSell: item.asset.analystRatingSell !== undefined ? {
              set: item.asset.analystRatingSell
            } : undefined,
          analystRatingStrongSell: item.asset.analystRatingStrongSell !== undefined ? {
              set: item.asset.analystRatingStrongSell
            } : undefined,
          trailingPE: item.asset.trailingPE !== undefined ? {
              set: item.asset.trailingPE
            } : undefined,
          forwardPE: item.asset.forwardPE !== undefined ? {
              set: item.asset.forwardPE
            } : undefined,
          priceToSalesRatioTTM: item.asset.priceToSalesRatioTTM !== undefined ? {
              set: item.asset.priceToSalesRatioTTM
            } : undefined,
          priceToBookRatio: item.asset.priceToBookRatio !== undefined ? {
              set: item.asset.priceToBookRatio
            } : undefined,
          evToRevenue: item.asset.evToRevenue !== undefined ? {
              set: item.asset.evToRevenue
            } : undefined,
          evToEbitda: item.asset.evToEbitda !== undefined ? {
              set: item.asset.evToEbitda
            } : undefined,
          beta: item.asset.beta !== undefined ? {
              set: item.asset.beta
            } : undefined,
          week52High: item.asset.week52High !== undefined ? {
              set: item.asset.week52High
            } : undefined,
          week52Low: item.asset.week52Low !== undefined ? {
              set: item.asset.week52Low
            } : undefined,
          day50MovingAverage: item.asset.day50MovingAverage !== undefined ? {
              set: item.asset.day50MovingAverage
            } : undefined,
          day200MovingAverage: item.asset.day200MovingAverage !== undefined ? {
              set: item.asset.day200MovingAverage
            } : undefined,
          sharesOutstanding: item.asset.sharesOutstanding !== undefined ? {
              set: item.asset.sharesOutstanding
            } : undefined,
          dividendDate: item.asset.dividendDate !== undefined ? {
              set: item.asset.dividendDate
            } : undefined,
          exDividendDate: item.asset.exDividendDate !== undefined ? {
              set: item.asset.exDividendDate
            } : undefined,
          askPrice: item.asset.askPrice !== undefined ? {
              set: item.asset.askPrice
            } : undefined,
          bidPrice: item.asset.bidPrice !== undefined ? {
              set: item.asset.bidPrice
            } : undefined,
      institutionalHoldings: item.asset.institutionalHoldings ? 
      Array.isArray(item.asset.institutionalHoldings) && item.asset.institutionalHoldings.length > 0 && item.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.asset.institutionalHoldings.map((item) => ({
        id: item.id
      }))
} : { upsert: item.asset.institutionalHoldings.map((item) => ({
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
      institutionalFlowSignals: item.asset.institutionalFlowSignals ? 
      Array.isArray(item.asset.institutionalFlowSignals) && item.asset.institutionalFlowSignals.length > 0 && item.asset.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.asset.institutionalFlowSignals.map((item) => ({
        id: item.id
      }))
} : { upsert: item.asset.institutionalFlowSignals.map((item) => ({
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
            signalDate: item.signalDate !== undefined ? {
                set: item.signalDate
              } : undefined,
            signalType: item.signalType !== undefined ? {
                set: item.signalType
              } : undefined,
            signalStrength: item.signalStrength !== undefined ? {
                set: item.signalStrength
              } : undefined,
            netFlow: item.netFlow !== undefined ? {
                set: item.netFlow
              } : undefined,
            confidence: item.confidence !== undefined ? {
                set: item.confidence
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            signalDate: item.signalDate !== undefined ? item.signalDate : undefined,
            signalType: item.signalType !== undefined ? item.signalType : undefined,
            signalStrength: item.signalStrength !== undefined ? item.signalStrength : undefined,
            netFlow: item.netFlow !== undefined ? item.netFlow : undefined,
            confidence: item.confidence !== undefined ? item.confidence : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? item.asset.type : undefined,
          logoUrl: item.asset.logoUrl !== undefined ? item.asset.logoUrl : undefined,
          description: item.asset.description !== undefined ? item.asset.description : undefined,
          cik: item.asset.cik !== undefined ? item.asset.cik : undefined,
          exchange: item.asset.exchange !== undefined ? item.asset.exchange : undefined,
          currency: item.asset.currency !== undefined ? item.asset.currency : undefined,
          country: item.asset.country !== undefined ? item.asset.country : undefined,
          sector: item.asset.sector !== undefined ? item.asset.sector : undefined,
          industry: item.asset.industry !== undefined ? item.asset.industry : undefined,
          address: item.asset.address !== undefined ? item.asset.address : undefined,
          officialSite: item.asset.officialSite !== undefined ? item.asset.officialSite : undefined,
          fiscalYearEnd: item.asset.fiscalYearEnd !== undefined ? item.asset.fiscalYearEnd : undefined,
          latestQuarter: item.asset.latestQuarter !== undefined ? item.asset.latestQuarter : undefined,
          marketCapitalization: item.asset.marketCapitalization !== undefined ? item.asset.marketCapitalization : undefined,
          ebitda: item.asset.ebitda !== undefined ? item.asset.ebitda : undefined,
          peRatio: item.asset.peRatio !== undefined ? item.asset.peRatio : undefined,
          pegRatio: item.asset.pegRatio !== undefined ? item.asset.pegRatio : undefined,
          bookValue: item.asset.bookValue !== undefined ? item.asset.bookValue : undefined,
          dividendPerShare: item.asset.dividendPerShare !== undefined ? item.asset.dividendPerShare : undefined,
          dividendYield: item.asset.dividendYield !== undefined ? item.asset.dividendYield : undefined,
          eps: item.asset.eps !== undefined ? item.asset.eps : undefined,
          revenuePerShareTTM: item.asset.revenuePerShareTTM !== undefined ? item.asset.revenuePerShareTTM : undefined,
          profitMargin: item.asset.profitMargin !== undefined ? item.asset.profitMargin : undefined,
          operatingMarginTTM: item.asset.operatingMarginTTM !== undefined ? item.asset.operatingMarginTTM : undefined,
          returnOnAssetsTTM: item.asset.returnOnAssetsTTM !== undefined ? item.asset.returnOnAssetsTTM : undefined,
          returnOnEquityTTM: item.asset.returnOnEquityTTM !== undefined ? item.asset.returnOnEquityTTM : undefined,
          revenueTTM: item.asset.revenueTTM !== undefined ? item.asset.revenueTTM : undefined,
          grossProfitTTM: item.asset.grossProfitTTM !== undefined ? item.asset.grossProfitTTM : undefined,
          dilutedEPSTTM: item.asset.dilutedEPSTTM !== undefined ? item.asset.dilutedEPSTTM : undefined,
          quarterlyEarningsGrowthYOY: item.asset.quarterlyEarningsGrowthYOY !== undefined ? item.asset.quarterlyEarningsGrowthYOY : undefined,
          quarterlyRevenueGrowthYOY: item.asset.quarterlyRevenueGrowthYOY !== undefined ? item.asset.quarterlyRevenueGrowthYOY : undefined,
          analystTargetPrice: item.asset.analystTargetPrice !== undefined ? item.asset.analystTargetPrice : undefined,
          analystRatingStrongBuy: item.asset.analystRatingStrongBuy !== undefined ? item.asset.analystRatingStrongBuy : undefined,
          analystRatingBuy: item.asset.analystRatingBuy !== undefined ? item.asset.analystRatingBuy : undefined,
          analystRatingHold: item.asset.analystRatingHold !== undefined ? item.asset.analystRatingHold : undefined,
          analystRatingSell: item.asset.analystRatingSell !== undefined ? item.asset.analystRatingSell : undefined,
          analystRatingStrongSell: item.asset.analystRatingStrongSell !== undefined ? item.asset.analystRatingStrongSell : undefined,
          trailingPE: item.asset.trailingPE !== undefined ? item.asset.trailingPE : undefined,
          forwardPE: item.asset.forwardPE !== undefined ? item.asset.forwardPE : undefined,
          priceToSalesRatioTTM: item.asset.priceToSalesRatioTTM !== undefined ? item.asset.priceToSalesRatioTTM : undefined,
          priceToBookRatio: item.asset.priceToBookRatio !== undefined ? item.asset.priceToBookRatio : undefined,
          evToRevenue: item.asset.evToRevenue !== undefined ? item.asset.evToRevenue : undefined,
          evToEbitda: item.asset.evToEbitda !== undefined ? item.asset.evToEbitda : undefined,
          beta: item.asset.beta !== undefined ? item.asset.beta : undefined,
          week52High: item.asset.week52High !== undefined ? item.asset.week52High : undefined,
          week52Low: item.asset.week52Low !== undefined ? item.asset.week52Low : undefined,
          day50MovingAverage: item.asset.day50MovingAverage !== undefined ? item.asset.day50MovingAverage : undefined,
          day200MovingAverage: item.asset.day200MovingAverage !== undefined ? item.asset.day200MovingAverage : undefined,
          sharesOutstanding: item.asset.sharesOutstanding !== undefined ? item.asset.sharesOutstanding : undefined,
          dividendDate: item.asset.dividendDate !== undefined ? item.asset.dividendDate : undefined,
          exDividendDate: item.asset.exDividendDate !== undefined ? item.asset.exDividendDate : undefined,
          askPrice: item.asset.askPrice !== undefined ? item.asset.askPrice : undefined,
          bidPrice: item.asset.bidPrice !== undefined ? item.asset.bidPrice : undefined,
      institutionalHoldings: item.asset.institutionalHoldings ? 
        Array.isArray(item.asset.institutionalHoldings) && item.asset.institutionalHoldings.length > 0 &&  item.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalHoldings.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalHoldings.map((item) => ({
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
      institutionalFlowSignals: item.asset.institutionalFlowSignals ? 
        Array.isArray(item.asset.institutionalFlowSignals) && item.asset.institutionalFlowSignals.length > 0 &&  item.asset.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalFlowSignals.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalFlowSignals.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            symbol: item.symbol !== undefined ? {
                equals: item.symbol 
               } : undefined,
          },
          create: {
            signalDate: item.signalDate !== undefined ? item.signalDate : undefined,
            signalType: item.signalType !== undefined ? item.signalType : undefined,
            signalStrength: item.signalStrength !== undefined ? item.signalStrength : undefined,
            netFlow: item.netFlow !== undefined ? item.netFlow : undefined,
            confidence: item.confidence !== undefined ? item.confidence : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
      },
      create: {
        url: item.url !== undefined ? item.url : undefined,
        relevancyScore: item.relevancyScore !== undefined ? item.relevancyScore : undefined,
        sentimentScore: item.sentimentScore !== undefined ? item.sentimentScore : undefined,
        sentimentLabel: item.sentimentLabel !== undefined ? item.sentimentLabel : undefined,
    asset: item.asset ? 
      typeof item.asset === 'object' && Object.keys(item.asset).length === 1 && Object.keys(item.asset)[0] === 'id'
    ? { connect: {
          id: item.asset.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: item.asset.id !== undefined ? item.asset.id : undefined,
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? {
              equals: item.asset.type 
             } : undefined,
        },
        create: {
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? item.asset.type : undefined,
          logoUrl: item.asset.logoUrl !== undefined ? item.asset.logoUrl : undefined,
          description: item.asset.description !== undefined ? item.asset.description : undefined,
          cik: item.asset.cik !== undefined ? item.asset.cik : undefined,
          exchange: item.asset.exchange !== undefined ? item.asset.exchange : undefined,
          currency: item.asset.currency !== undefined ? item.asset.currency : undefined,
          country: item.asset.country !== undefined ? item.asset.country : undefined,
          sector: item.asset.sector !== undefined ? item.asset.sector : undefined,
          industry: item.asset.industry !== undefined ? item.asset.industry : undefined,
          address: item.asset.address !== undefined ? item.asset.address : undefined,
          officialSite: item.asset.officialSite !== undefined ? item.asset.officialSite : undefined,
          fiscalYearEnd: item.asset.fiscalYearEnd !== undefined ? item.asset.fiscalYearEnd : undefined,
          latestQuarter: item.asset.latestQuarter !== undefined ? item.asset.latestQuarter : undefined,
          marketCapitalization: item.asset.marketCapitalization !== undefined ? item.asset.marketCapitalization : undefined,
          ebitda: item.asset.ebitda !== undefined ? item.asset.ebitda : undefined,
          peRatio: item.asset.peRatio !== undefined ? item.asset.peRatio : undefined,
          pegRatio: item.asset.pegRatio !== undefined ? item.asset.pegRatio : undefined,
          bookValue: item.asset.bookValue !== undefined ? item.asset.bookValue : undefined,
          dividendPerShare: item.asset.dividendPerShare !== undefined ? item.asset.dividendPerShare : undefined,
          dividendYield: item.asset.dividendYield !== undefined ? item.asset.dividendYield : undefined,
          eps: item.asset.eps !== undefined ? item.asset.eps : undefined,
          revenuePerShareTTM: item.asset.revenuePerShareTTM !== undefined ? item.asset.revenuePerShareTTM : undefined,
          profitMargin: item.asset.profitMargin !== undefined ? item.asset.profitMargin : undefined,
          operatingMarginTTM: item.asset.operatingMarginTTM !== undefined ? item.asset.operatingMarginTTM : undefined,
          returnOnAssetsTTM: item.asset.returnOnAssetsTTM !== undefined ? item.asset.returnOnAssetsTTM : undefined,
          returnOnEquityTTM: item.asset.returnOnEquityTTM !== undefined ? item.asset.returnOnEquityTTM : undefined,
          revenueTTM: item.asset.revenueTTM !== undefined ? item.asset.revenueTTM : undefined,
          grossProfitTTM: item.asset.grossProfitTTM !== undefined ? item.asset.grossProfitTTM : undefined,
          dilutedEPSTTM: item.asset.dilutedEPSTTM !== undefined ? item.asset.dilutedEPSTTM : undefined,
          quarterlyEarningsGrowthYOY: item.asset.quarterlyEarningsGrowthYOY !== undefined ? item.asset.quarterlyEarningsGrowthYOY : undefined,
          quarterlyRevenueGrowthYOY: item.asset.quarterlyRevenueGrowthYOY !== undefined ? item.asset.quarterlyRevenueGrowthYOY : undefined,
          analystTargetPrice: item.asset.analystTargetPrice !== undefined ? item.asset.analystTargetPrice : undefined,
          analystRatingStrongBuy: item.asset.analystRatingStrongBuy !== undefined ? item.asset.analystRatingStrongBuy : undefined,
          analystRatingBuy: item.asset.analystRatingBuy !== undefined ? item.asset.analystRatingBuy : undefined,
          analystRatingHold: item.asset.analystRatingHold !== undefined ? item.asset.analystRatingHold : undefined,
          analystRatingSell: item.asset.analystRatingSell !== undefined ? item.asset.analystRatingSell : undefined,
          analystRatingStrongSell: item.asset.analystRatingStrongSell !== undefined ? item.asset.analystRatingStrongSell : undefined,
          trailingPE: item.asset.trailingPE !== undefined ? item.asset.trailingPE : undefined,
          forwardPE: item.asset.forwardPE !== undefined ? item.asset.forwardPE : undefined,
          priceToSalesRatioTTM: item.asset.priceToSalesRatioTTM !== undefined ? item.asset.priceToSalesRatioTTM : undefined,
          priceToBookRatio: item.asset.priceToBookRatio !== undefined ? item.asset.priceToBookRatio : undefined,
          evToRevenue: item.asset.evToRevenue !== undefined ? item.asset.evToRevenue : undefined,
          evToEbitda: item.asset.evToEbitda !== undefined ? item.asset.evToEbitda : undefined,
          beta: item.asset.beta !== undefined ? item.asset.beta : undefined,
          week52High: item.asset.week52High !== undefined ? item.asset.week52High : undefined,
          week52Low: item.asset.week52Low !== undefined ? item.asset.week52Low : undefined,
          day50MovingAverage: item.asset.day50MovingAverage !== undefined ? item.asset.day50MovingAverage : undefined,
          day200MovingAverage: item.asset.day200MovingAverage !== undefined ? item.asset.day200MovingAverage : undefined,
          sharesOutstanding: item.asset.sharesOutstanding !== undefined ? item.asset.sharesOutstanding : undefined,
          dividendDate: item.asset.dividendDate !== undefined ? item.asset.dividendDate : undefined,
          exDividendDate: item.asset.exDividendDate !== undefined ? item.asset.exDividendDate : undefined,
          askPrice: item.asset.askPrice !== undefined ? item.asset.askPrice : undefined,
          bidPrice: item.asset.bidPrice !== undefined ? item.asset.bidPrice : undefined,
      institutionalHoldings: item.asset.institutionalHoldings ? 
        Array.isArray(item.asset.institutionalHoldings) && item.asset.institutionalHoldings.length > 0 &&  item.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalHoldings.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalHoldings.map((item) => ({
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
      institutionalFlowSignals: item.asset.institutionalFlowSignals ? 
        Array.isArray(item.asset.institutionalFlowSignals) && item.asset.institutionalFlowSignals.length > 0 &&  item.asset.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalFlowSignals.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalFlowSignals.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            symbol: item.symbol !== undefined ? {
                equals: item.symbol 
               } : undefined,
          },
          create: {
            signalDate: item.signalDate !== undefined ? item.signalDate : undefined,
            signalType: item.signalType !== undefined ? item.signalType : undefined,
            signalStrength: item.signalStrength !== undefined ? item.signalStrength : undefined,
            netFlow: item.netFlow !== undefined ? item.netFlow : undefined,
            confidence: item.confidence !== undefined ? item.confidence : undefined,
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
          mutation: UPSERT_ONE_NEWSARTICLE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneNewsArticle) {
          return response.data.upsertOneNewsArticle;
        } else {
          return null as unknown as NewsArticleType;
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
          logger.error("Non-retryable constraint violation in upsertOneNewsArticle", {
            operation: 'upsertOneNewsArticle',
            model: 'NewsArticle',
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
          logger.warn("Database connection error in upsertOneNewsArticle, retrying...", {
            operation: 'upsertOneNewsArticle',
            model: 'NewsArticle',
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
            operation: 'upsertOneNewsArticle',
            model: 'NewsArticle',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneNewsArticle',
            model: 'NewsArticle',
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
   * Update multiple NewsArticle records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of NewsArticle objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: NewsArticleType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_NEWSARTICLE = gql`
          mutation updateManyNewsArticle($data: [NewsArticleCreateManyInput!]!) {
            updateManyNewsArticle(data: $data) {
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
  title: prop.title !== undefined ? {
            set: prop.title 
           } : undefined,
  content: prop.content !== undefined ? {
            set: prop.content 
           } : undefined,
  source: prop.source !== undefined ? {
            set: prop.source 
           } : undefined,
  sourceDomain: prop.sourceDomain !== undefined ? {
            set: prop.sourceDomain 
           } : undefined,
  url: prop.url !== undefined ? {
            set: prop.url 
           } : undefined,
  sentiment: prop.sentiment !== undefined ? {
            set: prop.sentiment 
           } : undefined,
  authors: prop.authors !== undefined ? {
            set: prop.authors 
           } : undefined,
  summary: prop.summary !== undefined ? {
            set: prop.summary 
           } : undefined,
  bannerImage: prop.bannerImage !== undefined ? {
            set: prop.bannerImage 
           } : undefined,
  timePublished: prop.timePublished !== undefined ? {
            set: prop.timePublished 
           } : undefined,
  category: prop.category !== undefined ? {
            set: prop.category 
           } : undefined,
  topics: prop.topics !== undefined ? {
            set: prop.topics 
           } : undefined,
  logo: prop.logo !== undefined ? {
            set: prop.logo 
           } : undefined,
  symbols: prop.symbols !== undefined ? {
            set: prop.symbols 
           } : undefined,
  relevance: prop.relevance !== undefined ? {
            set: prop.relevance 
           } : undefined,
  publishedAt: prop.publishedAt !== undefined ? {
            set: prop.publishedAt 
           } : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,
  assets: prop.assets ? 
  Array.isArray(prop.assets) && prop.assets.length > 0 && prop.assets.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: prop.assets.map((item) => ({
    id: item.id
  }))
} : { upsert: prop.assets.map((item) => ({
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
    asset: item.asset ? 
    typeof item.asset === 'object' && Object.keys(item.asset).length === 1 && (Object.keys(item.asset)[0] === 'id' || Object.keys(item.asset)[0] === 'symbol')
? {
    connect: {
      id: item.asset.id
    }
} : { upsert: {
        where: {
          id: item.asset.id !== undefined ? {
              equals: item.asset.id
            } : undefined,
          symbol: item.asset.symbol !== undefined ? {
              equals: item.asset.symbol
            } : undefined,
          name: item.asset.name !== undefined ? {
              equals: item.asset.name
            } : undefined,
          type: item.asset.type !== undefined ? {
              equals: item.asset.type
            } : undefined,
        },
        update: {
          id: item.asset.id !== undefined ? {
              set: item.asset.id
            } : undefined,
          symbol: item.asset.symbol !== undefined ? {
              set: item.asset.symbol
            } : undefined,
          name: item.asset.name !== undefined ? {
              set: item.asset.name
            } : undefined,
          type: item.asset.type !== undefined ? {
              set: item.asset.type
            } : undefined,
          logoUrl: item.asset.logoUrl !== undefined ? {
              set: item.asset.logoUrl
            } : undefined,
          description: item.asset.description !== undefined ? {
              set: item.asset.description
            } : undefined,
          cik: item.asset.cik !== undefined ? {
              set: item.asset.cik
            } : undefined,
          exchange: item.asset.exchange !== undefined ? {
              set: item.asset.exchange
            } : undefined,
          currency: item.asset.currency !== undefined ? {
              set: item.asset.currency
            } : undefined,
          country: item.asset.country !== undefined ? {
              set: item.asset.country
            } : undefined,
          sector: item.asset.sector !== undefined ? {
              set: item.asset.sector
            } : undefined,
          industry: item.asset.industry !== undefined ? {
              set: item.asset.industry
            } : undefined,
          address: item.asset.address !== undefined ? {
              set: item.asset.address
            } : undefined,
          officialSite: item.asset.officialSite !== undefined ? {
              set: item.asset.officialSite
            } : undefined,
          fiscalYearEnd: item.asset.fiscalYearEnd !== undefined ? {
              set: item.asset.fiscalYearEnd
            } : undefined,
          latestQuarter: item.asset.latestQuarter !== undefined ? {
              set: item.asset.latestQuarter
            } : undefined,
          marketCapitalization: item.asset.marketCapitalization !== undefined ? {
              set: item.asset.marketCapitalization
            } : undefined,
          ebitda: item.asset.ebitda !== undefined ? {
              set: item.asset.ebitda
            } : undefined,
          peRatio: item.asset.peRatio !== undefined ? {
              set: item.asset.peRatio
            } : undefined,
          pegRatio: item.asset.pegRatio !== undefined ? {
              set: item.asset.pegRatio
            } : undefined,
          bookValue: item.asset.bookValue !== undefined ? {
              set: item.asset.bookValue
            } : undefined,
          dividendPerShare: item.asset.dividendPerShare !== undefined ? {
              set: item.asset.dividendPerShare
            } : undefined,
          dividendYield: item.asset.dividendYield !== undefined ? {
              set: item.asset.dividendYield
            } : undefined,
          eps: item.asset.eps !== undefined ? {
              set: item.asset.eps
            } : undefined,
          revenuePerShareTTM: item.asset.revenuePerShareTTM !== undefined ? {
              set: item.asset.revenuePerShareTTM
            } : undefined,
          profitMargin: item.asset.profitMargin !== undefined ? {
              set: item.asset.profitMargin
            } : undefined,
          operatingMarginTTM: item.asset.operatingMarginTTM !== undefined ? {
              set: item.asset.operatingMarginTTM
            } : undefined,
          returnOnAssetsTTM: item.asset.returnOnAssetsTTM !== undefined ? {
              set: item.asset.returnOnAssetsTTM
            } : undefined,
          returnOnEquityTTM: item.asset.returnOnEquityTTM !== undefined ? {
              set: item.asset.returnOnEquityTTM
            } : undefined,
          revenueTTM: item.asset.revenueTTM !== undefined ? {
              set: item.asset.revenueTTM
            } : undefined,
          grossProfitTTM: item.asset.grossProfitTTM !== undefined ? {
              set: item.asset.grossProfitTTM
            } : undefined,
          dilutedEPSTTM: item.asset.dilutedEPSTTM !== undefined ? {
              set: item.asset.dilutedEPSTTM
            } : undefined,
          quarterlyEarningsGrowthYOY: item.asset.quarterlyEarningsGrowthYOY !== undefined ? {
              set: item.asset.quarterlyEarningsGrowthYOY
            } : undefined,
          quarterlyRevenueGrowthYOY: item.asset.quarterlyRevenueGrowthYOY !== undefined ? {
              set: item.asset.quarterlyRevenueGrowthYOY
            } : undefined,
          analystTargetPrice: item.asset.analystTargetPrice !== undefined ? {
              set: item.asset.analystTargetPrice
            } : undefined,
          analystRatingStrongBuy: item.asset.analystRatingStrongBuy !== undefined ? {
              set: item.asset.analystRatingStrongBuy
            } : undefined,
          analystRatingBuy: item.asset.analystRatingBuy !== undefined ? {
              set: item.asset.analystRatingBuy
            } : undefined,
          analystRatingHold: item.asset.analystRatingHold !== undefined ? {
              set: item.asset.analystRatingHold
            } : undefined,
          analystRatingSell: item.asset.analystRatingSell !== undefined ? {
              set: item.asset.analystRatingSell
            } : undefined,
          analystRatingStrongSell: item.asset.analystRatingStrongSell !== undefined ? {
              set: item.asset.analystRatingStrongSell
            } : undefined,
          trailingPE: item.asset.trailingPE !== undefined ? {
              set: item.asset.trailingPE
            } : undefined,
          forwardPE: item.asset.forwardPE !== undefined ? {
              set: item.asset.forwardPE
            } : undefined,
          priceToSalesRatioTTM: item.asset.priceToSalesRatioTTM !== undefined ? {
              set: item.asset.priceToSalesRatioTTM
            } : undefined,
          priceToBookRatio: item.asset.priceToBookRatio !== undefined ? {
              set: item.asset.priceToBookRatio
            } : undefined,
          evToRevenue: item.asset.evToRevenue !== undefined ? {
              set: item.asset.evToRevenue
            } : undefined,
          evToEbitda: item.asset.evToEbitda !== undefined ? {
              set: item.asset.evToEbitda
            } : undefined,
          beta: item.asset.beta !== undefined ? {
              set: item.asset.beta
            } : undefined,
          week52High: item.asset.week52High !== undefined ? {
              set: item.asset.week52High
            } : undefined,
          week52Low: item.asset.week52Low !== undefined ? {
              set: item.asset.week52Low
            } : undefined,
          day50MovingAverage: item.asset.day50MovingAverage !== undefined ? {
              set: item.asset.day50MovingAverage
            } : undefined,
          day200MovingAverage: item.asset.day200MovingAverage !== undefined ? {
              set: item.asset.day200MovingAverage
            } : undefined,
          sharesOutstanding: item.asset.sharesOutstanding !== undefined ? {
              set: item.asset.sharesOutstanding
            } : undefined,
          dividendDate: item.asset.dividendDate !== undefined ? {
              set: item.asset.dividendDate
            } : undefined,
          exDividendDate: item.asset.exDividendDate !== undefined ? {
              set: item.asset.exDividendDate
            } : undefined,
          askPrice: item.asset.askPrice !== undefined ? {
              set: item.asset.askPrice
            } : undefined,
          bidPrice: item.asset.bidPrice !== undefined ? {
              set: item.asset.bidPrice
            } : undefined,
      institutionalHoldings: item.asset.institutionalHoldings ? 
      Array.isArray(item.asset.institutionalHoldings) && item.asset.institutionalHoldings.length > 0 && item.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.asset.institutionalHoldings.map((item) => ({
        id: item.id
      }))
} : { upsert: item.asset.institutionalHoldings.map((item) => ({
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
      institutionalFlowSignals: item.asset.institutionalFlowSignals ? 
      Array.isArray(item.asset.institutionalFlowSignals) && item.asset.institutionalFlowSignals.length > 0 && item.asset.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: item.asset.institutionalFlowSignals.map((item) => ({
        id: item.id
      }))
} : { upsert: item.asset.institutionalFlowSignals.map((item) => ({
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
            signalDate: item.signalDate !== undefined ? {
                set: item.signalDate
              } : undefined,
            signalType: item.signalType !== undefined ? {
                set: item.signalType
              } : undefined,
            signalStrength: item.signalStrength !== undefined ? {
                set: item.signalStrength
              } : undefined,
            netFlow: item.netFlow !== undefined ? {
                set: item.netFlow
              } : undefined,
            confidence: item.confidence !== undefined ? {
                set: item.confidence
              } : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
          create: {
            signalDate: item.signalDate !== undefined ? item.signalDate : undefined,
            signalType: item.signalType !== undefined ? item.signalType : undefined,
            signalStrength: item.signalStrength !== undefined ? item.signalStrength : undefined,
            netFlow: item.netFlow !== undefined ? item.netFlow : undefined,
            confidence: item.confidence !== undefined ? item.confidence : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
        create: {
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? item.asset.type : undefined,
          logoUrl: item.asset.logoUrl !== undefined ? item.asset.logoUrl : undefined,
          description: item.asset.description !== undefined ? item.asset.description : undefined,
          cik: item.asset.cik !== undefined ? item.asset.cik : undefined,
          exchange: item.asset.exchange !== undefined ? item.asset.exchange : undefined,
          currency: item.asset.currency !== undefined ? item.asset.currency : undefined,
          country: item.asset.country !== undefined ? item.asset.country : undefined,
          sector: item.asset.sector !== undefined ? item.asset.sector : undefined,
          industry: item.asset.industry !== undefined ? item.asset.industry : undefined,
          address: item.asset.address !== undefined ? item.asset.address : undefined,
          officialSite: item.asset.officialSite !== undefined ? item.asset.officialSite : undefined,
          fiscalYearEnd: item.asset.fiscalYearEnd !== undefined ? item.asset.fiscalYearEnd : undefined,
          latestQuarter: item.asset.latestQuarter !== undefined ? item.asset.latestQuarter : undefined,
          marketCapitalization: item.asset.marketCapitalization !== undefined ? item.asset.marketCapitalization : undefined,
          ebitda: item.asset.ebitda !== undefined ? item.asset.ebitda : undefined,
          peRatio: item.asset.peRatio !== undefined ? item.asset.peRatio : undefined,
          pegRatio: item.asset.pegRatio !== undefined ? item.asset.pegRatio : undefined,
          bookValue: item.asset.bookValue !== undefined ? item.asset.bookValue : undefined,
          dividendPerShare: item.asset.dividendPerShare !== undefined ? item.asset.dividendPerShare : undefined,
          dividendYield: item.asset.dividendYield !== undefined ? item.asset.dividendYield : undefined,
          eps: item.asset.eps !== undefined ? item.asset.eps : undefined,
          revenuePerShareTTM: item.asset.revenuePerShareTTM !== undefined ? item.asset.revenuePerShareTTM : undefined,
          profitMargin: item.asset.profitMargin !== undefined ? item.asset.profitMargin : undefined,
          operatingMarginTTM: item.asset.operatingMarginTTM !== undefined ? item.asset.operatingMarginTTM : undefined,
          returnOnAssetsTTM: item.asset.returnOnAssetsTTM !== undefined ? item.asset.returnOnAssetsTTM : undefined,
          returnOnEquityTTM: item.asset.returnOnEquityTTM !== undefined ? item.asset.returnOnEquityTTM : undefined,
          revenueTTM: item.asset.revenueTTM !== undefined ? item.asset.revenueTTM : undefined,
          grossProfitTTM: item.asset.grossProfitTTM !== undefined ? item.asset.grossProfitTTM : undefined,
          dilutedEPSTTM: item.asset.dilutedEPSTTM !== undefined ? item.asset.dilutedEPSTTM : undefined,
          quarterlyEarningsGrowthYOY: item.asset.quarterlyEarningsGrowthYOY !== undefined ? item.asset.quarterlyEarningsGrowthYOY : undefined,
          quarterlyRevenueGrowthYOY: item.asset.quarterlyRevenueGrowthYOY !== undefined ? item.asset.quarterlyRevenueGrowthYOY : undefined,
          analystTargetPrice: item.asset.analystTargetPrice !== undefined ? item.asset.analystTargetPrice : undefined,
          analystRatingStrongBuy: item.asset.analystRatingStrongBuy !== undefined ? item.asset.analystRatingStrongBuy : undefined,
          analystRatingBuy: item.asset.analystRatingBuy !== undefined ? item.asset.analystRatingBuy : undefined,
          analystRatingHold: item.asset.analystRatingHold !== undefined ? item.asset.analystRatingHold : undefined,
          analystRatingSell: item.asset.analystRatingSell !== undefined ? item.asset.analystRatingSell : undefined,
          analystRatingStrongSell: item.asset.analystRatingStrongSell !== undefined ? item.asset.analystRatingStrongSell : undefined,
          trailingPE: item.asset.trailingPE !== undefined ? item.asset.trailingPE : undefined,
          forwardPE: item.asset.forwardPE !== undefined ? item.asset.forwardPE : undefined,
          priceToSalesRatioTTM: item.asset.priceToSalesRatioTTM !== undefined ? item.asset.priceToSalesRatioTTM : undefined,
          priceToBookRatio: item.asset.priceToBookRatio !== undefined ? item.asset.priceToBookRatio : undefined,
          evToRevenue: item.asset.evToRevenue !== undefined ? item.asset.evToRevenue : undefined,
          evToEbitda: item.asset.evToEbitda !== undefined ? item.asset.evToEbitda : undefined,
          beta: item.asset.beta !== undefined ? item.asset.beta : undefined,
          week52High: item.asset.week52High !== undefined ? item.asset.week52High : undefined,
          week52Low: item.asset.week52Low !== undefined ? item.asset.week52Low : undefined,
          day50MovingAverage: item.asset.day50MovingAverage !== undefined ? item.asset.day50MovingAverage : undefined,
          day200MovingAverage: item.asset.day200MovingAverage !== undefined ? item.asset.day200MovingAverage : undefined,
          sharesOutstanding: item.asset.sharesOutstanding !== undefined ? item.asset.sharesOutstanding : undefined,
          dividendDate: item.asset.dividendDate !== undefined ? item.asset.dividendDate : undefined,
          exDividendDate: item.asset.exDividendDate !== undefined ? item.asset.exDividendDate : undefined,
          askPrice: item.asset.askPrice !== undefined ? item.asset.askPrice : undefined,
          bidPrice: item.asset.bidPrice !== undefined ? item.asset.bidPrice : undefined,
      institutionalHoldings: item.asset.institutionalHoldings ? 
        Array.isArray(item.asset.institutionalHoldings) && item.asset.institutionalHoldings.length > 0 &&  item.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalHoldings.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalHoldings.map((item) => ({
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
      institutionalFlowSignals: item.asset.institutionalFlowSignals ? 
        Array.isArray(item.asset.institutionalFlowSignals) && item.asset.institutionalFlowSignals.length > 0 &&  item.asset.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalFlowSignals.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalFlowSignals.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            symbol: item.symbol !== undefined ? {
                equals: item.symbol 
               } : undefined,
          },
          create: {
            signalDate: item.signalDate !== undefined ? item.signalDate : undefined,
            signalType: item.signalType !== undefined ? item.signalType : undefined,
            signalStrength: item.signalStrength !== undefined ? item.signalStrength : undefined,
            netFlow: item.netFlow !== undefined ? item.netFlow : undefined,
            confidence: item.confidence !== undefined ? item.confidence : undefined,
            metadata: item.metadata !== undefined ? item.metadata : undefined,
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
      },
      create: {
        url: item.url !== undefined ? item.url : undefined,
        relevancyScore: item.relevancyScore !== undefined ? item.relevancyScore : undefined,
        sentimentScore: item.sentimentScore !== undefined ? item.sentimentScore : undefined,
        sentimentLabel: item.sentimentLabel !== undefined ? item.sentimentLabel : undefined,
    asset: item.asset ? 
      typeof item.asset === 'object' && Object.keys(item.asset).length === 1 && Object.keys(item.asset)[0] === 'id'
    ? { connect: {
          id: item.asset.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: item.asset.id !== undefined ? item.asset.id : undefined,
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? {
              equals: item.asset.type 
             } : undefined,
        },
        create: {
          symbol: item.asset.symbol !== undefined ? item.asset.symbol : undefined,
          name: item.asset.name !== undefined ? item.asset.name : undefined,
          type: item.asset.type !== undefined ? item.asset.type : undefined,
          logoUrl: item.asset.logoUrl !== undefined ? item.asset.logoUrl : undefined,
          description: item.asset.description !== undefined ? item.asset.description : undefined,
          cik: item.asset.cik !== undefined ? item.asset.cik : undefined,
          exchange: item.asset.exchange !== undefined ? item.asset.exchange : undefined,
          currency: item.asset.currency !== undefined ? item.asset.currency : undefined,
          country: item.asset.country !== undefined ? item.asset.country : undefined,
          sector: item.asset.sector !== undefined ? item.asset.sector : undefined,
          industry: item.asset.industry !== undefined ? item.asset.industry : undefined,
          address: item.asset.address !== undefined ? item.asset.address : undefined,
          officialSite: item.asset.officialSite !== undefined ? item.asset.officialSite : undefined,
          fiscalYearEnd: item.asset.fiscalYearEnd !== undefined ? item.asset.fiscalYearEnd : undefined,
          latestQuarter: item.asset.latestQuarter !== undefined ? item.asset.latestQuarter : undefined,
          marketCapitalization: item.asset.marketCapitalization !== undefined ? item.asset.marketCapitalization : undefined,
          ebitda: item.asset.ebitda !== undefined ? item.asset.ebitda : undefined,
          peRatio: item.asset.peRatio !== undefined ? item.asset.peRatio : undefined,
          pegRatio: item.asset.pegRatio !== undefined ? item.asset.pegRatio : undefined,
          bookValue: item.asset.bookValue !== undefined ? item.asset.bookValue : undefined,
          dividendPerShare: item.asset.dividendPerShare !== undefined ? item.asset.dividendPerShare : undefined,
          dividendYield: item.asset.dividendYield !== undefined ? item.asset.dividendYield : undefined,
          eps: item.asset.eps !== undefined ? item.asset.eps : undefined,
          revenuePerShareTTM: item.asset.revenuePerShareTTM !== undefined ? item.asset.revenuePerShareTTM : undefined,
          profitMargin: item.asset.profitMargin !== undefined ? item.asset.profitMargin : undefined,
          operatingMarginTTM: item.asset.operatingMarginTTM !== undefined ? item.asset.operatingMarginTTM : undefined,
          returnOnAssetsTTM: item.asset.returnOnAssetsTTM !== undefined ? item.asset.returnOnAssetsTTM : undefined,
          returnOnEquityTTM: item.asset.returnOnEquityTTM !== undefined ? item.asset.returnOnEquityTTM : undefined,
          revenueTTM: item.asset.revenueTTM !== undefined ? item.asset.revenueTTM : undefined,
          grossProfitTTM: item.asset.grossProfitTTM !== undefined ? item.asset.grossProfitTTM : undefined,
          dilutedEPSTTM: item.asset.dilutedEPSTTM !== undefined ? item.asset.dilutedEPSTTM : undefined,
          quarterlyEarningsGrowthYOY: item.asset.quarterlyEarningsGrowthYOY !== undefined ? item.asset.quarterlyEarningsGrowthYOY : undefined,
          quarterlyRevenueGrowthYOY: item.asset.quarterlyRevenueGrowthYOY !== undefined ? item.asset.quarterlyRevenueGrowthYOY : undefined,
          analystTargetPrice: item.asset.analystTargetPrice !== undefined ? item.asset.analystTargetPrice : undefined,
          analystRatingStrongBuy: item.asset.analystRatingStrongBuy !== undefined ? item.asset.analystRatingStrongBuy : undefined,
          analystRatingBuy: item.asset.analystRatingBuy !== undefined ? item.asset.analystRatingBuy : undefined,
          analystRatingHold: item.asset.analystRatingHold !== undefined ? item.asset.analystRatingHold : undefined,
          analystRatingSell: item.asset.analystRatingSell !== undefined ? item.asset.analystRatingSell : undefined,
          analystRatingStrongSell: item.asset.analystRatingStrongSell !== undefined ? item.asset.analystRatingStrongSell : undefined,
          trailingPE: item.asset.trailingPE !== undefined ? item.asset.trailingPE : undefined,
          forwardPE: item.asset.forwardPE !== undefined ? item.asset.forwardPE : undefined,
          priceToSalesRatioTTM: item.asset.priceToSalesRatioTTM !== undefined ? item.asset.priceToSalesRatioTTM : undefined,
          priceToBookRatio: item.asset.priceToBookRatio !== undefined ? item.asset.priceToBookRatio : undefined,
          evToRevenue: item.asset.evToRevenue !== undefined ? item.asset.evToRevenue : undefined,
          evToEbitda: item.asset.evToEbitda !== undefined ? item.asset.evToEbitda : undefined,
          beta: item.asset.beta !== undefined ? item.asset.beta : undefined,
          week52High: item.asset.week52High !== undefined ? item.asset.week52High : undefined,
          week52Low: item.asset.week52Low !== undefined ? item.asset.week52Low : undefined,
          day50MovingAverage: item.asset.day50MovingAverage !== undefined ? item.asset.day50MovingAverage : undefined,
          day200MovingAverage: item.asset.day200MovingAverage !== undefined ? item.asset.day200MovingAverage : undefined,
          sharesOutstanding: item.asset.sharesOutstanding !== undefined ? item.asset.sharesOutstanding : undefined,
          dividendDate: item.asset.dividendDate !== undefined ? item.asset.dividendDate : undefined,
          exDividendDate: item.asset.exDividendDate !== undefined ? item.asset.exDividendDate : undefined,
          askPrice: item.asset.askPrice !== undefined ? item.asset.askPrice : undefined,
          bidPrice: item.asset.bidPrice !== undefined ? item.asset.bidPrice : undefined,
      institutionalHoldings: item.asset.institutionalHoldings ? 
        Array.isArray(item.asset.institutionalHoldings) && item.asset.institutionalHoldings.length > 0 &&  item.asset.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalHoldings.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalHoldings.map((item) => ({
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
      institutionalFlowSignals: item.asset.institutionalFlowSignals ? 
        Array.isArray(item.asset.institutionalFlowSignals) && item.asset.institutionalFlowSignals.length > 0 &&  item.asset.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        item.asset.institutionalFlowSignals.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: item.asset.institutionalFlowSignals.map((item) => ({
          where: {
            id: item.id !== undefined ? item.id : undefined,
            symbol: item.symbol !== undefined ? {
                equals: item.symbol 
               } : undefined,
          },
          create: {
            signalDate: item.signalDate !== undefined ? item.signalDate : undefined,
            signalType: item.signalType !== undefined ? item.signalType : undefined,
            signalStrength: item.signalStrength !== undefined ? item.signalStrength : undefined,
            netFlow: item.netFlow !== undefined ? item.netFlow : undefined,
            confidence: item.confidence !== undefined ? item.confidence : undefined,
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
          mutation: UPDATE_MANY_NEWSARTICLE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyNewsArticle) {
          return response.data.updateManyNewsArticle;
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
          logger.error("Non-retryable constraint violation in updateManyNewsArticle", {
            operation: 'updateManyNewsArticle',
            model: 'NewsArticle',
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
          logger.warn("Database connection error in updateManyNewsArticle, retrying...", {
            operation: 'updateManyNewsArticle',
            model: 'NewsArticle',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyNewsArticle',
            model: 'NewsArticle',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyNewsArticle',
            model: 'NewsArticle',
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
   * Delete a single NewsArticle record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted NewsArticle or null.
   */
  async delete(props: NewsArticleType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<NewsArticleType> {
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

        const DELETE_ONE_NEWSARTICLE = gql`
          mutation deleteOneNewsArticle($where: NewsArticleWhereUniqueInput!) {
            deleteOneNewsArticle(where: $where) {
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
          mutation: DELETE_ONE_NEWSARTICLE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneNewsArticle) {
          return response.data.deleteOneNewsArticle;
        } else {
          return null as unknown as NewsArticleType;
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
          logger.error("Non-retryable constraint violation in deleteOneNewsArticle", {
            operation: 'deleteOneNewsArticle',
            model: 'NewsArticle',
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
          logger.warn("Database connection error in deleteOneNewsArticle, retrying...", {
            operation: 'deleteOneNewsArticle',
            model: 'NewsArticle',
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
            operation: 'deleteOneNewsArticle',
            model: 'NewsArticle',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneNewsArticle',
            model: 'NewsArticle',
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
   * Retrieve a single NewsArticle record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved NewsArticle or null.
   */
  async get(props: NewsArticleType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<NewsArticleType | null> {
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

        const GET_NEWSARTICLE = gql`
          query getNewsArticle($where: NewsArticleWhereUniqueInput!) {
            getNewsArticle(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  url: props.url !== undefined ? props.url : undefined,
  title: props.title !== undefined ? {
    equals: props.title 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_NEWSARTICLE,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getNewsArticle ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No NewsArticle found') {
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
          logger.warn("Database connection error in getNewsArticle, retrying...", {
            operation: 'getNewsArticle',
            model: 'NewsArticle',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getNewsArticle',
            model: 'NewsArticle',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getNewsArticle',
            model: 'NewsArticle',
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
   * Retrieve all NewsArticles records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of NewsArticle records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<NewsArticleType[] | null> {
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

        const GET_ALL_NEWSARTICLE = gql`
          query getAllNewsArticle {
            newsArticles {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_NEWSARTICLE,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.newsArticles ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No NewsArticle found') {
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
          logger.warn("Database connection error in getAllNewsArticle, retrying...", {
            operation: 'getAllNewsArticle',
            model: 'NewsArticle',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllNewsArticle',
            model: 'NewsArticle',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllNewsArticle',
            model: 'NewsArticle',
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
   * Find multiple NewsArticle records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found NewsArticle records or null.
   */
  async findMany(props: NewsArticleType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<NewsArticleType[] | null> {
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

        const FIND_MANY_NEWSARTICLE = gql`
          query findManyNewsArticle($where: NewsArticleWhereInput!) {
            newsArticles(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
  title: props.title !== undefined ? {
    equals: props.title 
  } : undefined,
  url: props.url !== undefined ? {
    equals: props.url 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyNewsArticle requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_NEWSARTICLE,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.newsArticles) {
          return response.data.newsArticles;
        } else {
          return [] as NewsArticleType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No NewsArticle found') {
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
          logger.warn("Database connection error in findManyNewsArticle, retrying...", {
            operation: 'findManyNewsArticle',
            model: 'NewsArticle',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyNewsArticle',
            model: 'NewsArticle',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyNewsArticle',
            model: 'NewsArticle',
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

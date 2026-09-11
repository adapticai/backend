
  
import { Asset as AssetType } from './generated/typegraphql-prisma/models/Asset';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the Asset model.
   */

  const selectionSet = `
    
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

  `;

  export const Asset = {

    /**
     * Create a new Asset record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created Asset or null.
     */

    /**
     * Create a new Asset record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created Asset or null.
     */
    async create(props: AssetType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<AssetType> {
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

          const CREATE_ONE_ASSET = gql`
              mutation createOneAsset($data: AssetCreateInput!) {
                createOneAsset(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                symbol: props.symbol !== undefined ? props.symbol : undefined,
  name: props.name !== undefined ? props.name : undefined,
  type: props.type !== undefined ? props.type : undefined,
  logoUrl: props.logoUrl !== undefined ? props.logoUrl : undefined,
  description: props.description !== undefined ? props.description : undefined,
  cik: props.cik !== undefined ? props.cik : undefined,
  exchange: props.exchange !== undefined ? props.exchange : undefined,
  currency: props.currency !== undefined ? props.currency : undefined,
  country: props.country !== undefined ? props.country : undefined,
  sector: props.sector !== undefined ? props.sector : undefined,
  industry: props.industry !== undefined ? props.industry : undefined,
  address: props.address !== undefined ? props.address : undefined,
  officialSite: props.officialSite !== undefined ? props.officialSite : undefined,
  fiscalYearEnd: props.fiscalYearEnd !== undefined ? props.fiscalYearEnd : undefined,
  latestQuarter: props.latestQuarter !== undefined ? props.latestQuarter : undefined,
  marketCapitalization: props.marketCapitalization !== undefined ? props.marketCapitalization : undefined,
  ebitda: props.ebitda !== undefined ? props.ebitda : undefined,
  peRatio: props.peRatio !== undefined ? props.peRatio : undefined,
  pegRatio: props.pegRatio !== undefined ? props.pegRatio : undefined,
  bookValue: props.bookValue !== undefined ? props.bookValue : undefined,
  dividendPerShare: props.dividendPerShare !== undefined ? props.dividendPerShare : undefined,
  dividendYield: props.dividendYield !== undefined ? props.dividendYield : undefined,
  eps: props.eps !== undefined ? props.eps : undefined,
  revenuePerShareTTM: props.revenuePerShareTTM !== undefined ? props.revenuePerShareTTM : undefined,
  profitMargin: props.profitMargin !== undefined ? props.profitMargin : undefined,
  operatingMarginTTM: props.operatingMarginTTM !== undefined ? props.operatingMarginTTM : undefined,
  returnOnAssetsTTM: props.returnOnAssetsTTM !== undefined ? props.returnOnAssetsTTM : undefined,
  returnOnEquityTTM: props.returnOnEquityTTM !== undefined ? props.returnOnEquityTTM : undefined,
  revenueTTM: props.revenueTTM !== undefined ? props.revenueTTM : undefined,
  grossProfitTTM: props.grossProfitTTM !== undefined ? props.grossProfitTTM : undefined,
  dilutedEPSTTM: props.dilutedEPSTTM !== undefined ? props.dilutedEPSTTM : undefined,
  quarterlyEarningsGrowthYOY: props.quarterlyEarningsGrowthYOY !== undefined ? props.quarterlyEarningsGrowthYOY : undefined,
  quarterlyRevenueGrowthYOY: props.quarterlyRevenueGrowthYOY !== undefined ? props.quarterlyRevenueGrowthYOY : undefined,
  analystTargetPrice: props.analystTargetPrice !== undefined ? props.analystTargetPrice : undefined,
  analystRatingStrongBuy: props.analystRatingStrongBuy !== undefined ? props.analystRatingStrongBuy : undefined,
  analystRatingBuy: props.analystRatingBuy !== undefined ? props.analystRatingBuy : undefined,
  analystRatingHold: props.analystRatingHold !== undefined ? props.analystRatingHold : undefined,
  analystRatingSell: props.analystRatingSell !== undefined ? props.analystRatingSell : undefined,
  analystRatingStrongSell: props.analystRatingStrongSell !== undefined ? props.analystRatingStrongSell : undefined,
  trailingPE: props.trailingPE !== undefined ? props.trailingPE : undefined,
  forwardPE: props.forwardPE !== undefined ? props.forwardPE : undefined,
  priceToSalesRatioTTM: props.priceToSalesRatioTTM !== undefined ? props.priceToSalesRatioTTM : undefined,
  priceToBookRatio: props.priceToBookRatio !== undefined ? props.priceToBookRatio : undefined,
  evToRevenue: props.evToRevenue !== undefined ? props.evToRevenue : undefined,
  evToEbitda: props.evToEbitda !== undefined ? props.evToEbitda : undefined,
  beta: props.beta !== undefined ? props.beta : undefined,
  week52High: props.week52High !== undefined ? props.week52High : undefined,
  week52Low: props.week52Low !== undefined ? props.week52Low : undefined,
  day50MovingAverage: props.day50MovingAverage !== undefined ? props.day50MovingAverage : undefined,
  day200MovingAverage: props.day200MovingAverage !== undefined ? props.day200MovingAverage : undefined,
  sharesOutstanding: props.sharesOutstanding !== undefined ? props.sharesOutstanding : undefined,
  dividendDate: props.dividendDate !== undefined ? props.dividendDate : undefined,
  exDividendDate: props.exDividendDate !== undefined ? props.exDividendDate : undefined,
  askPrice: props.askPrice !== undefined ? props.askPrice : undefined,
  bidPrice: props.bidPrice !== undefined ? props.bidPrice : undefined,
  newsMentions: props.newsMentions ? 
    Array.isArray(props.newsMentions) && props.newsMentions.length > 0 &&  props.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.newsMentions.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.newsMentions.map((item) => ({
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
  institutionalHoldings: props.institutionalHoldings ? 
    Array.isArray(props.institutionalHoldings) && props.institutionalHoldings.length > 0 &&  props.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.institutionalHoldings.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.institutionalHoldings.map((item) => ({
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
  institutionalFlowSignals: props.institutionalFlowSignals ? 
    Array.isArray(props.institutionalFlowSignals) && props.institutionalFlowSignals.length > 0 &&  props.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.institutionalFlowSignals.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.institutionalFlowSignals.map((item) => ({
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
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_ASSET,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneAsset) {
            return response.data.createOneAsset;
          } else {
            return null as unknown as AssetType;
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
            logger.error("Non-retryable constraint violation in createOneAsset", {
              operation: 'createOneAsset',
              model: 'Asset',
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
            logger.warn("Database connection error in createOneAsset, retrying...", {
              operation: 'createOneAsset',
              model: 'Asset',
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
              operation: 'createOneAsset',
              model: 'Asset',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneAsset',
              model: 'Asset',
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
   * Create multiple Asset records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of Asset objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: AssetType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_ASSET = gql`
          mutation createManyAsset($data: [AssetCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyAsset(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      symbol: prop.symbol !== undefined ? prop.symbol : undefined,
  name: prop.name !== undefined ? prop.name : undefined,
  type: prop.type !== undefined ? prop.type : undefined,
  logoUrl: prop.logoUrl !== undefined ? prop.logoUrl : undefined,
  description: prop.description !== undefined ? prop.description : undefined,
  cik: prop.cik !== undefined ? prop.cik : undefined,
  exchange: prop.exchange !== undefined ? prop.exchange : undefined,
  currency: prop.currency !== undefined ? prop.currency : undefined,
  country: prop.country !== undefined ? prop.country : undefined,
  sector: prop.sector !== undefined ? prop.sector : undefined,
  industry: prop.industry !== undefined ? prop.industry : undefined,
  address: prop.address !== undefined ? prop.address : undefined,
  officialSite: prop.officialSite !== undefined ? prop.officialSite : undefined,
  fiscalYearEnd: prop.fiscalYearEnd !== undefined ? prop.fiscalYearEnd : undefined,
  latestQuarter: prop.latestQuarter !== undefined ? prop.latestQuarter : undefined,
  marketCapitalization: prop.marketCapitalization !== undefined ? prop.marketCapitalization : undefined,
  ebitda: prop.ebitda !== undefined ? prop.ebitda : undefined,
  peRatio: prop.peRatio !== undefined ? prop.peRatio : undefined,
  pegRatio: prop.pegRatio !== undefined ? prop.pegRatio : undefined,
  bookValue: prop.bookValue !== undefined ? prop.bookValue : undefined,
  dividendPerShare: prop.dividendPerShare !== undefined ? prop.dividendPerShare : undefined,
  dividendYield: prop.dividendYield !== undefined ? prop.dividendYield : undefined,
  eps: prop.eps !== undefined ? prop.eps : undefined,
  revenuePerShareTTM: prop.revenuePerShareTTM !== undefined ? prop.revenuePerShareTTM : undefined,
  profitMargin: prop.profitMargin !== undefined ? prop.profitMargin : undefined,
  operatingMarginTTM: prop.operatingMarginTTM !== undefined ? prop.operatingMarginTTM : undefined,
  returnOnAssetsTTM: prop.returnOnAssetsTTM !== undefined ? prop.returnOnAssetsTTM : undefined,
  returnOnEquityTTM: prop.returnOnEquityTTM !== undefined ? prop.returnOnEquityTTM : undefined,
  revenueTTM: prop.revenueTTM !== undefined ? prop.revenueTTM : undefined,
  grossProfitTTM: prop.grossProfitTTM !== undefined ? prop.grossProfitTTM : undefined,
  dilutedEPSTTM: prop.dilutedEPSTTM !== undefined ? prop.dilutedEPSTTM : undefined,
  quarterlyEarningsGrowthYOY: prop.quarterlyEarningsGrowthYOY !== undefined ? prop.quarterlyEarningsGrowthYOY : undefined,
  quarterlyRevenueGrowthYOY: prop.quarterlyRevenueGrowthYOY !== undefined ? prop.quarterlyRevenueGrowthYOY : undefined,
  analystTargetPrice: prop.analystTargetPrice !== undefined ? prop.analystTargetPrice : undefined,
  analystRatingStrongBuy: prop.analystRatingStrongBuy !== undefined ? prop.analystRatingStrongBuy : undefined,
  analystRatingBuy: prop.analystRatingBuy !== undefined ? prop.analystRatingBuy : undefined,
  analystRatingHold: prop.analystRatingHold !== undefined ? prop.analystRatingHold : undefined,
  analystRatingSell: prop.analystRatingSell !== undefined ? prop.analystRatingSell : undefined,
  analystRatingStrongSell: prop.analystRatingStrongSell !== undefined ? prop.analystRatingStrongSell : undefined,
  trailingPE: prop.trailingPE !== undefined ? prop.trailingPE : undefined,
  forwardPE: prop.forwardPE !== undefined ? prop.forwardPE : undefined,
  priceToSalesRatioTTM: prop.priceToSalesRatioTTM !== undefined ? prop.priceToSalesRatioTTM : undefined,
  priceToBookRatio: prop.priceToBookRatio !== undefined ? prop.priceToBookRatio : undefined,
  evToRevenue: prop.evToRevenue !== undefined ? prop.evToRevenue : undefined,
  evToEbitda: prop.evToEbitda !== undefined ? prop.evToEbitda : undefined,
  beta: prop.beta !== undefined ? prop.beta : undefined,
  week52High: prop.week52High !== undefined ? prop.week52High : undefined,
  week52Low: prop.week52Low !== undefined ? prop.week52Low : undefined,
  day50MovingAverage: prop.day50MovingAverage !== undefined ? prop.day50MovingAverage : undefined,
  day200MovingAverage: prop.day200MovingAverage !== undefined ? prop.day200MovingAverage : undefined,
  sharesOutstanding: prop.sharesOutstanding !== undefined ? prop.sharesOutstanding : undefined,
  dividendDate: prop.dividendDate !== undefined ? prop.dividendDate : undefined,
  exDividendDate: prop.exDividendDate !== undefined ? prop.exDividendDate : undefined,
  askPrice: prop.askPrice !== undefined ? prop.askPrice : undefined,
  bidPrice: prop.bidPrice !== undefined ? prop.bidPrice : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_ASSET,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyAsset) {
          return response.data.createManyAsset;
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
          logger.warn("Duplicate key in createManyAsset (expected during overlapping fetches)", {
            operation: 'createManyAsset',
            model: 'Asset',
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
          logger.warn("Database connection error in createManyAsset, retrying...", {
            operation: 'createManyAsset',
            model: 'Asset',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyAsset',
            model: 'Asset',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyAsset',
            model: 'Asset',
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
   * Update a single Asset record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated Asset or null.
   */
  async update(props: AssetType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<AssetType> {
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

        const UPDATE_ONE_ASSET = gql`
          mutation updateOneAsset($data: AssetUpdateInput!, $where: AssetWhereUniqueInput!) {
            updateOneAsset(data: $data, where: $where) {
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
  name: props.name !== undefined ? {
            set: props.name 
           } : undefined,
  type: props.type !== undefined ? {
            set: props.type 
           } : undefined,
  logoUrl: props.logoUrl !== undefined ? {
            set: props.logoUrl 
           } : undefined,
  description: props.description !== undefined ? {
            set: props.description 
           } : undefined,
  cik: props.cik !== undefined ? {
            set: props.cik 
           } : undefined,
  exchange: props.exchange !== undefined ? {
            set: props.exchange 
           } : undefined,
  currency: props.currency !== undefined ? {
            set: props.currency 
           } : undefined,
  country: props.country !== undefined ? {
            set: props.country 
           } : undefined,
  sector: props.sector !== undefined ? {
            set: props.sector 
           } : undefined,
  industry: props.industry !== undefined ? {
            set: props.industry 
           } : undefined,
  address: props.address !== undefined ? {
            set: props.address 
           } : undefined,
  officialSite: props.officialSite !== undefined ? {
            set: props.officialSite 
           } : undefined,
  fiscalYearEnd: props.fiscalYearEnd !== undefined ? {
            set: props.fiscalYearEnd 
           } : undefined,
  latestQuarter: props.latestQuarter !== undefined ? {
            set: props.latestQuarter 
           } : undefined,
  marketCapitalization: props.marketCapitalization !== undefined ? {
            set: props.marketCapitalization 
           } : undefined,
  ebitda: props.ebitda !== undefined ? {
            set: props.ebitda 
           } : undefined,
  peRatio: props.peRatio !== undefined ? {
            set: props.peRatio 
           } : undefined,
  pegRatio: props.pegRatio !== undefined ? {
            set: props.pegRatio 
           } : undefined,
  bookValue: props.bookValue !== undefined ? {
            set: props.bookValue 
           } : undefined,
  dividendPerShare: props.dividendPerShare !== undefined ? {
            set: props.dividendPerShare 
           } : undefined,
  dividendYield: props.dividendYield !== undefined ? {
            set: props.dividendYield 
           } : undefined,
  eps: props.eps !== undefined ? {
            set: props.eps 
           } : undefined,
  revenuePerShareTTM: props.revenuePerShareTTM !== undefined ? {
            set: props.revenuePerShareTTM 
           } : undefined,
  profitMargin: props.profitMargin !== undefined ? {
            set: props.profitMargin 
           } : undefined,
  operatingMarginTTM: props.operatingMarginTTM !== undefined ? {
            set: props.operatingMarginTTM 
           } : undefined,
  returnOnAssetsTTM: props.returnOnAssetsTTM !== undefined ? {
            set: props.returnOnAssetsTTM 
           } : undefined,
  returnOnEquityTTM: props.returnOnEquityTTM !== undefined ? {
            set: props.returnOnEquityTTM 
           } : undefined,
  revenueTTM: props.revenueTTM !== undefined ? {
            set: props.revenueTTM 
           } : undefined,
  grossProfitTTM: props.grossProfitTTM !== undefined ? {
            set: props.grossProfitTTM 
           } : undefined,
  dilutedEPSTTM: props.dilutedEPSTTM !== undefined ? {
            set: props.dilutedEPSTTM 
           } : undefined,
  quarterlyEarningsGrowthYOY: props.quarterlyEarningsGrowthYOY !== undefined ? {
            set: props.quarterlyEarningsGrowthYOY 
           } : undefined,
  quarterlyRevenueGrowthYOY: props.quarterlyRevenueGrowthYOY !== undefined ? {
            set: props.quarterlyRevenueGrowthYOY 
           } : undefined,
  analystTargetPrice: props.analystTargetPrice !== undefined ? {
            set: props.analystTargetPrice 
           } : undefined,
  analystRatingStrongBuy: props.analystRatingStrongBuy !== undefined ? {
            set: props.analystRatingStrongBuy 
           } : undefined,
  analystRatingBuy: props.analystRatingBuy !== undefined ? {
            set: props.analystRatingBuy 
           } : undefined,
  analystRatingHold: props.analystRatingHold !== undefined ? {
            set: props.analystRatingHold 
           } : undefined,
  analystRatingSell: props.analystRatingSell !== undefined ? {
            set: props.analystRatingSell 
           } : undefined,
  analystRatingStrongSell: props.analystRatingStrongSell !== undefined ? {
            set: props.analystRatingStrongSell 
           } : undefined,
  trailingPE: props.trailingPE !== undefined ? {
            set: props.trailingPE 
           } : undefined,
  forwardPE: props.forwardPE !== undefined ? {
            set: props.forwardPE 
           } : undefined,
  priceToSalesRatioTTM: props.priceToSalesRatioTTM !== undefined ? {
            set: props.priceToSalesRatioTTM 
           } : undefined,
  priceToBookRatio: props.priceToBookRatio !== undefined ? {
            set: props.priceToBookRatio 
           } : undefined,
  evToRevenue: props.evToRevenue !== undefined ? {
            set: props.evToRevenue 
           } : undefined,
  evToEbitda: props.evToEbitda !== undefined ? {
            set: props.evToEbitda 
           } : undefined,
  beta: props.beta !== undefined ? {
            set: props.beta 
           } : undefined,
  week52High: props.week52High !== undefined ? {
            set: props.week52High 
           } : undefined,
  week52Low: props.week52Low !== undefined ? {
            set: props.week52Low 
           } : undefined,
  day50MovingAverage: props.day50MovingAverage !== undefined ? {
            set: props.day50MovingAverage 
           } : undefined,
  day200MovingAverage: props.day200MovingAverage !== undefined ? {
            set: props.day200MovingAverage 
           } : undefined,
  sharesOutstanding: props.sharesOutstanding !== undefined ? {
            set: props.sharesOutstanding 
           } : undefined,
  dividendDate: props.dividendDate !== undefined ? {
            set: props.dividendDate 
           } : undefined,
  exDividendDate: props.exDividendDate !== undefined ? {
            set: props.exDividendDate 
           } : undefined,
  askPrice: props.askPrice !== undefined ? {
            set: props.askPrice 
           } : undefined,
  bidPrice: props.bidPrice !== undefined ? {
            set: props.bidPrice 
           } : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
  newsMentions: props.newsMentions ? 
  Array.isArray(props.newsMentions) && props.newsMentions.length > 0 && props.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.newsMentions.map((item) => ({
    id: item.id
  }))
} : { upsert: props.newsMentions.map((item) => ({
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
  institutionalHoldings: props.institutionalHoldings ? 
  Array.isArray(props.institutionalHoldings) && props.institutionalHoldings.length > 0 && props.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.institutionalHoldings.map((item) => ({
    id: item.id
  }))
} : { upsert: props.institutionalHoldings.map((item) => ({
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
  institutionalFlowSignals: props.institutionalFlowSignals ? 
  Array.isArray(props.institutionalFlowSignals) && props.institutionalFlowSignals.length > 0 && props.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.institutionalFlowSignals.map((item) => ({
    id: item.id
  }))
} : { upsert: props.institutionalFlowSignals.map((item) => ({
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
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_ASSET,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneAsset) {
          return response.data.updateOneAsset;
        } else {
          return null as unknown as AssetType;
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
          logger.error("Non-retryable constraint violation in updateOneAsset", {
            operation: 'updateOneAsset',
            model: 'Asset',
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
          logger.warn("Database connection error in updateOneAsset, retrying...", {
            operation: 'updateOneAsset',
            model: 'Asset',
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
            operation: 'updateOneAsset',
            model: 'Asset',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneAsset',
            model: 'Asset',
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
   * Upsert a single Asset record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated Asset or null.
   */
  async upsert(props: AssetType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<AssetType> {
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

        const UPSERT_ONE_ASSET = gql`
          mutation upsertOneAsset($where: AssetWhereUniqueInput!, $create: AssetCreateInput!, $update: AssetUpdateInput!) {
            upsertOneAsset(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  name: props.name !== undefined ? props.name : undefined,
  type: props.type !== undefined ? {
    equals: props.type 
  } : undefined,
      },
          create: {
        symbol: props.symbol !== undefined ? props.symbol : undefined,
  name: props.name !== undefined ? props.name : undefined,
  type: props.type !== undefined ? props.type : undefined,
  logoUrl: props.logoUrl !== undefined ? props.logoUrl : undefined,
  description: props.description !== undefined ? props.description : undefined,
  cik: props.cik !== undefined ? props.cik : undefined,
  exchange: props.exchange !== undefined ? props.exchange : undefined,
  currency: props.currency !== undefined ? props.currency : undefined,
  country: props.country !== undefined ? props.country : undefined,
  sector: props.sector !== undefined ? props.sector : undefined,
  industry: props.industry !== undefined ? props.industry : undefined,
  address: props.address !== undefined ? props.address : undefined,
  officialSite: props.officialSite !== undefined ? props.officialSite : undefined,
  fiscalYearEnd: props.fiscalYearEnd !== undefined ? props.fiscalYearEnd : undefined,
  latestQuarter: props.latestQuarter !== undefined ? props.latestQuarter : undefined,
  marketCapitalization: props.marketCapitalization !== undefined ? props.marketCapitalization : undefined,
  ebitda: props.ebitda !== undefined ? props.ebitda : undefined,
  peRatio: props.peRatio !== undefined ? props.peRatio : undefined,
  pegRatio: props.pegRatio !== undefined ? props.pegRatio : undefined,
  bookValue: props.bookValue !== undefined ? props.bookValue : undefined,
  dividendPerShare: props.dividendPerShare !== undefined ? props.dividendPerShare : undefined,
  dividendYield: props.dividendYield !== undefined ? props.dividendYield : undefined,
  eps: props.eps !== undefined ? props.eps : undefined,
  revenuePerShareTTM: props.revenuePerShareTTM !== undefined ? props.revenuePerShareTTM : undefined,
  profitMargin: props.profitMargin !== undefined ? props.profitMargin : undefined,
  operatingMarginTTM: props.operatingMarginTTM !== undefined ? props.operatingMarginTTM : undefined,
  returnOnAssetsTTM: props.returnOnAssetsTTM !== undefined ? props.returnOnAssetsTTM : undefined,
  returnOnEquityTTM: props.returnOnEquityTTM !== undefined ? props.returnOnEquityTTM : undefined,
  revenueTTM: props.revenueTTM !== undefined ? props.revenueTTM : undefined,
  grossProfitTTM: props.grossProfitTTM !== undefined ? props.grossProfitTTM : undefined,
  dilutedEPSTTM: props.dilutedEPSTTM !== undefined ? props.dilutedEPSTTM : undefined,
  quarterlyEarningsGrowthYOY: props.quarterlyEarningsGrowthYOY !== undefined ? props.quarterlyEarningsGrowthYOY : undefined,
  quarterlyRevenueGrowthYOY: props.quarterlyRevenueGrowthYOY !== undefined ? props.quarterlyRevenueGrowthYOY : undefined,
  analystTargetPrice: props.analystTargetPrice !== undefined ? props.analystTargetPrice : undefined,
  analystRatingStrongBuy: props.analystRatingStrongBuy !== undefined ? props.analystRatingStrongBuy : undefined,
  analystRatingBuy: props.analystRatingBuy !== undefined ? props.analystRatingBuy : undefined,
  analystRatingHold: props.analystRatingHold !== undefined ? props.analystRatingHold : undefined,
  analystRatingSell: props.analystRatingSell !== undefined ? props.analystRatingSell : undefined,
  analystRatingStrongSell: props.analystRatingStrongSell !== undefined ? props.analystRatingStrongSell : undefined,
  trailingPE: props.trailingPE !== undefined ? props.trailingPE : undefined,
  forwardPE: props.forwardPE !== undefined ? props.forwardPE : undefined,
  priceToSalesRatioTTM: props.priceToSalesRatioTTM !== undefined ? props.priceToSalesRatioTTM : undefined,
  priceToBookRatio: props.priceToBookRatio !== undefined ? props.priceToBookRatio : undefined,
  evToRevenue: props.evToRevenue !== undefined ? props.evToRevenue : undefined,
  evToEbitda: props.evToEbitda !== undefined ? props.evToEbitda : undefined,
  beta: props.beta !== undefined ? props.beta : undefined,
  week52High: props.week52High !== undefined ? props.week52High : undefined,
  week52Low: props.week52Low !== undefined ? props.week52Low : undefined,
  day50MovingAverage: props.day50MovingAverage !== undefined ? props.day50MovingAverage : undefined,
  day200MovingAverage: props.day200MovingAverage !== undefined ? props.day200MovingAverage : undefined,
  sharesOutstanding: props.sharesOutstanding !== undefined ? props.sharesOutstanding : undefined,
  dividendDate: props.dividendDate !== undefined ? props.dividendDate : undefined,
  exDividendDate: props.exDividendDate !== undefined ? props.exDividendDate : undefined,
  askPrice: props.askPrice !== undefined ? props.askPrice : undefined,
  bidPrice: props.bidPrice !== undefined ? props.bidPrice : undefined,
  newsMentions: props.newsMentions ? 
    Array.isArray(props.newsMentions) && props.newsMentions.length > 0 &&  props.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.newsMentions.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.newsMentions.map((item) => ({
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
  institutionalHoldings: props.institutionalHoldings ? 
    Array.isArray(props.institutionalHoldings) && props.institutionalHoldings.length > 0 &&  props.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.institutionalHoldings.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.institutionalHoldings.map((item) => ({
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
  institutionalFlowSignals: props.institutionalFlowSignals ? 
    Array.isArray(props.institutionalFlowSignals) && props.institutionalFlowSignals.length > 0 &&  props.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
      connect:    props.institutionalFlowSignals.map((item) => ({
         id: item.id
      }))
 }
 : { connectOrCreate: props.institutionalFlowSignals.map((item) => ({
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
          update: {
      symbol: props.symbol !== undefined ? {
            set: props.symbol 
           } : undefined,
  name: props.name !== undefined ? {
            set: props.name 
           } : undefined,
  type: props.type !== undefined ? {
            set: props.type 
           } : undefined,
  logoUrl: props.logoUrl !== undefined ? {
            set: props.logoUrl 
           } : undefined,
  description: props.description !== undefined ? {
            set: props.description 
           } : undefined,
  cik: props.cik !== undefined ? {
            set: props.cik 
           } : undefined,
  exchange: props.exchange !== undefined ? {
            set: props.exchange 
           } : undefined,
  currency: props.currency !== undefined ? {
            set: props.currency 
           } : undefined,
  country: props.country !== undefined ? {
            set: props.country 
           } : undefined,
  sector: props.sector !== undefined ? {
            set: props.sector 
           } : undefined,
  industry: props.industry !== undefined ? {
            set: props.industry 
           } : undefined,
  address: props.address !== undefined ? {
            set: props.address 
           } : undefined,
  officialSite: props.officialSite !== undefined ? {
            set: props.officialSite 
           } : undefined,
  fiscalYearEnd: props.fiscalYearEnd !== undefined ? {
            set: props.fiscalYearEnd 
           } : undefined,
  latestQuarter: props.latestQuarter !== undefined ? {
            set: props.latestQuarter 
           } : undefined,
  marketCapitalization: props.marketCapitalization !== undefined ? {
            set: props.marketCapitalization 
           } : undefined,
  ebitda: props.ebitda !== undefined ? {
            set: props.ebitda 
           } : undefined,
  peRatio: props.peRatio !== undefined ? {
            set: props.peRatio 
           } : undefined,
  pegRatio: props.pegRatio !== undefined ? {
            set: props.pegRatio 
           } : undefined,
  bookValue: props.bookValue !== undefined ? {
            set: props.bookValue 
           } : undefined,
  dividendPerShare: props.dividendPerShare !== undefined ? {
            set: props.dividendPerShare 
           } : undefined,
  dividendYield: props.dividendYield !== undefined ? {
            set: props.dividendYield 
           } : undefined,
  eps: props.eps !== undefined ? {
            set: props.eps 
           } : undefined,
  revenuePerShareTTM: props.revenuePerShareTTM !== undefined ? {
            set: props.revenuePerShareTTM 
           } : undefined,
  profitMargin: props.profitMargin !== undefined ? {
            set: props.profitMargin 
           } : undefined,
  operatingMarginTTM: props.operatingMarginTTM !== undefined ? {
            set: props.operatingMarginTTM 
           } : undefined,
  returnOnAssetsTTM: props.returnOnAssetsTTM !== undefined ? {
            set: props.returnOnAssetsTTM 
           } : undefined,
  returnOnEquityTTM: props.returnOnEquityTTM !== undefined ? {
            set: props.returnOnEquityTTM 
           } : undefined,
  revenueTTM: props.revenueTTM !== undefined ? {
            set: props.revenueTTM 
           } : undefined,
  grossProfitTTM: props.grossProfitTTM !== undefined ? {
            set: props.grossProfitTTM 
           } : undefined,
  dilutedEPSTTM: props.dilutedEPSTTM !== undefined ? {
            set: props.dilutedEPSTTM 
           } : undefined,
  quarterlyEarningsGrowthYOY: props.quarterlyEarningsGrowthYOY !== undefined ? {
            set: props.quarterlyEarningsGrowthYOY 
           } : undefined,
  quarterlyRevenueGrowthYOY: props.quarterlyRevenueGrowthYOY !== undefined ? {
            set: props.quarterlyRevenueGrowthYOY 
           } : undefined,
  analystTargetPrice: props.analystTargetPrice !== undefined ? {
            set: props.analystTargetPrice 
           } : undefined,
  analystRatingStrongBuy: props.analystRatingStrongBuy !== undefined ? {
            set: props.analystRatingStrongBuy 
           } : undefined,
  analystRatingBuy: props.analystRatingBuy !== undefined ? {
            set: props.analystRatingBuy 
           } : undefined,
  analystRatingHold: props.analystRatingHold !== undefined ? {
            set: props.analystRatingHold 
           } : undefined,
  analystRatingSell: props.analystRatingSell !== undefined ? {
            set: props.analystRatingSell 
           } : undefined,
  analystRatingStrongSell: props.analystRatingStrongSell !== undefined ? {
            set: props.analystRatingStrongSell 
           } : undefined,
  trailingPE: props.trailingPE !== undefined ? {
            set: props.trailingPE 
           } : undefined,
  forwardPE: props.forwardPE !== undefined ? {
            set: props.forwardPE 
           } : undefined,
  priceToSalesRatioTTM: props.priceToSalesRatioTTM !== undefined ? {
            set: props.priceToSalesRatioTTM 
           } : undefined,
  priceToBookRatio: props.priceToBookRatio !== undefined ? {
            set: props.priceToBookRatio 
           } : undefined,
  evToRevenue: props.evToRevenue !== undefined ? {
            set: props.evToRevenue 
           } : undefined,
  evToEbitda: props.evToEbitda !== undefined ? {
            set: props.evToEbitda 
           } : undefined,
  beta: props.beta !== undefined ? {
            set: props.beta 
           } : undefined,
  week52High: props.week52High !== undefined ? {
            set: props.week52High 
           } : undefined,
  week52Low: props.week52Low !== undefined ? {
            set: props.week52Low 
           } : undefined,
  day50MovingAverage: props.day50MovingAverage !== undefined ? {
            set: props.day50MovingAverage 
           } : undefined,
  day200MovingAverage: props.day200MovingAverage !== undefined ? {
            set: props.day200MovingAverage 
           } : undefined,
  sharesOutstanding: props.sharesOutstanding !== undefined ? {
            set: props.sharesOutstanding 
           } : undefined,
  dividendDate: props.dividendDate !== undefined ? {
            set: props.dividendDate 
           } : undefined,
  exDividendDate: props.exDividendDate !== undefined ? {
            set: props.exDividendDate 
           } : undefined,
  askPrice: props.askPrice !== undefined ? {
            set: props.askPrice 
           } : undefined,
  bidPrice: props.bidPrice !== undefined ? {
            set: props.bidPrice 
           } : undefined,
  newsMentions: props.newsMentions ? 
  Array.isArray(props.newsMentions) && props.newsMentions.length > 0 && props.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.newsMentions.map((item) => ({
    id: item.id
  }))
} : { upsert: props.newsMentions.map((item) => ({
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
  institutionalHoldings: props.institutionalHoldings ? 
  Array.isArray(props.institutionalHoldings) && props.institutionalHoldings.length > 0 && props.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.institutionalHoldings.map((item) => ({
    id: item.id
  }))
} : { upsert: props.institutionalHoldings.map((item) => ({
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
  institutionalFlowSignals: props.institutionalFlowSignals ? 
  Array.isArray(props.institutionalFlowSignals) && props.institutionalFlowSignals.length > 0 && props.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: props.institutionalFlowSignals.map((item) => ({
    id: item.id
  }))
} : { upsert: props.institutionalFlowSignals.map((item) => ({
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
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_ASSET,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneAsset) {
          return response.data.upsertOneAsset;
        } else {
          return null as unknown as AssetType;
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
          logger.error("Non-retryable constraint violation in upsertOneAsset", {
            operation: 'upsertOneAsset',
            model: 'Asset',
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
          logger.warn("Database connection error in upsertOneAsset, retrying...", {
            operation: 'upsertOneAsset',
            model: 'Asset',
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
            operation: 'upsertOneAsset',
            model: 'Asset',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneAsset',
            model: 'Asset',
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
   * Update multiple Asset records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of Asset objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: AssetType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_ASSET = gql`
          mutation updateManyAsset($data: [AssetCreateManyInput!]!) {
            updateManyAsset(data: $data) {
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
  name: prop.name !== undefined ? {
            set: prop.name 
           } : undefined,
  type: prop.type !== undefined ? {
            set: prop.type 
           } : undefined,
  logoUrl: prop.logoUrl !== undefined ? {
            set: prop.logoUrl 
           } : undefined,
  description: prop.description !== undefined ? {
            set: prop.description 
           } : undefined,
  cik: prop.cik !== undefined ? {
            set: prop.cik 
           } : undefined,
  exchange: prop.exchange !== undefined ? {
            set: prop.exchange 
           } : undefined,
  currency: prop.currency !== undefined ? {
            set: prop.currency 
           } : undefined,
  country: prop.country !== undefined ? {
            set: prop.country 
           } : undefined,
  sector: prop.sector !== undefined ? {
            set: prop.sector 
           } : undefined,
  industry: prop.industry !== undefined ? {
            set: prop.industry 
           } : undefined,
  address: prop.address !== undefined ? {
            set: prop.address 
           } : undefined,
  officialSite: prop.officialSite !== undefined ? {
            set: prop.officialSite 
           } : undefined,
  fiscalYearEnd: prop.fiscalYearEnd !== undefined ? {
            set: prop.fiscalYearEnd 
           } : undefined,
  latestQuarter: prop.latestQuarter !== undefined ? {
            set: prop.latestQuarter 
           } : undefined,
  marketCapitalization: prop.marketCapitalization !== undefined ? {
            set: prop.marketCapitalization 
           } : undefined,
  ebitda: prop.ebitda !== undefined ? {
            set: prop.ebitda 
           } : undefined,
  peRatio: prop.peRatio !== undefined ? {
            set: prop.peRatio 
           } : undefined,
  pegRatio: prop.pegRatio !== undefined ? {
            set: prop.pegRatio 
           } : undefined,
  bookValue: prop.bookValue !== undefined ? {
            set: prop.bookValue 
           } : undefined,
  dividendPerShare: prop.dividendPerShare !== undefined ? {
            set: prop.dividendPerShare 
           } : undefined,
  dividendYield: prop.dividendYield !== undefined ? {
            set: prop.dividendYield 
           } : undefined,
  eps: prop.eps !== undefined ? {
            set: prop.eps 
           } : undefined,
  revenuePerShareTTM: prop.revenuePerShareTTM !== undefined ? {
            set: prop.revenuePerShareTTM 
           } : undefined,
  profitMargin: prop.profitMargin !== undefined ? {
            set: prop.profitMargin 
           } : undefined,
  operatingMarginTTM: prop.operatingMarginTTM !== undefined ? {
            set: prop.operatingMarginTTM 
           } : undefined,
  returnOnAssetsTTM: prop.returnOnAssetsTTM !== undefined ? {
            set: prop.returnOnAssetsTTM 
           } : undefined,
  returnOnEquityTTM: prop.returnOnEquityTTM !== undefined ? {
            set: prop.returnOnEquityTTM 
           } : undefined,
  revenueTTM: prop.revenueTTM !== undefined ? {
            set: prop.revenueTTM 
           } : undefined,
  grossProfitTTM: prop.grossProfitTTM !== undefined ? {
            set: prop.grossProfitTTM 
           } : undefined,
  dilutedEPSTTM: prop.dilutedEPSTTM !== undefined ? {
            set: prop.dilutedEPSTTM 
           } : undefined,
  quarterlyEarningsGrowthYOY: prop.quarterlyEarningsGrowthYOY !== undefined ? {
            set: prop.quarterlyEarningsGrowthYOY 
           } : undefined,
  quarterlyRevenueGrowthYOY: prop.quarterlyRevenueGrowthYOY !== undefined ? {
            set: prop.quarterlyRevenueGrowthYOY 
           } : undefined,
  analystTargetPrice: prop.analystTargetPrice !== undefined ? {
            set: prop.analystTargetPrice 
           } : undefined,
  analystRatingStrongBuy: prop.analystRatingStrongBuy !== undefined ? {
            set: prop.analystRatingStrongBuy 
           } : undefined,
  analystRatingBuy: prop.analystRatingBuy !== undefined ? {
            set: prop.analystRatingBuy 
           } : undefined,
  analystRatingHold: prop.analystRatingHold !== undefined ? {
            set: prop.analystRatingHold 
           } : undefined,
  analystRatingSell: prop.analystRatingSell !== undefined ? {
            set: prop.analystRatingSell 
           } : undefined,
  analystRatingStrongSell: prop.analystRatingStrongSell !== undefined ? {
            set: prop.analystRatingStrongSell 
           } : undefined,
  trailingPE: prop.trailingPE !== undefined ? {
            set: prop.trailingPE 
           } : undefined,
  forwardPE: prop.forwardPE !== undefined ? {
            set: prop.forwardPE 
           } : undefined,
  priceToSalesRatioTTM: prop.priceToSalesRatioTTM !== undefined ? {
            set: prop.priceToSalesRatioTTM 
           } : undefined,
  priceToBookRatio: prop.priceToBookRatio !== undefined ? {
            set: prop.priceToBookRatio 
           } : undefined,
  evToRevenue: prop.evToRevenue !== undefined ? {
            set: prop.evToRevenue 
           } : undefined,
  evToEbitda: prop.evToEbitda !== undefined ? {
            set: prop.evToEbitda 
           } : undefined,
  beta: prop.beta !== undefined ? {
            set: prop.beta 
           } : undefined,
  week52High: prop.week52High !== undefined ? {
            set: prop.week52High 
           } : undefined,
  week52Low: prop.week52Low !== undefined ? {
            set: prop.week52Low 
           } : undefined,
  day50MovingAverage: prop.day50MovingAverage !== undefined ? {
            set: prop.day50MovingAverage 
           } : undefined,
  day200MovingAverage: prop.day200MovingAverage !== undefined ? {
            set: prop.day200MovingAverage 
           } : undefined,
  sharesOutstanding: prop.sharesOutstanding !== undefined ? {
            set: prop.sharesOutstanding 
           } : undefined,
  dividendDate: prop.dividendDate !== undefined ? {
            set: prop.dividendDate 
           } : undefined,
  exDividendDate: prop.exDividendDate !== undefined ? {
            set: prop.exDividendDate 
           } : undefined,
  askPrice: prop.askPrice !== undefined ? {
            set: prop.askPrice 
           } : undefined,
  bidPrice: prop.bidPrice !== undefined ? {
            set: prop.bidPrice 
           } : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,
  newsMentions: prop.newsMentions ? 
  Array.isArray(prop.newsMentions) && prop.newsMentions.length > 0 && prop.newsMentions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: prop.newsMentions.map((item) => ({
    id: item.id
  }))
} : { upsert: prop.newsMentions.map((item) => ({
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
  institutionalHoldings: prop.institutionalHoldings ? 
  Array.isArray(prop.institutionalHoldings) && prop.institutionalHoldings.length > 0 && prop.institutionalHoldings.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: prop.institutionalHoldings.map((item) => ({
    id: item.id
  }))
} : { upsert: prop.institutionalHoldings.map((item) => ({
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
  institutionalFlowSignals: prop.institutionalFlowSignals ? 
  Array.isArray(prop.institutionalFlowSignals) && prop.institutionalFlowSignals.length > 0 && prop.institutionalFlowSignals.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
  connect: prop.institutionalFlowSignals.map((item) => ({
    id: item.id
  }))
} : { upsert: prop.institutionalFlowSignals.map((item) => ({
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
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_ASSET,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyAsset) {
          return response.data.updateManyAsset;
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
          logger.error("Non-retryable constraint violation in updateManyAsset", {
            operation: 'updateManyAsset',
            model: 'Asset',
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
          logger.warn("Database connection error in updateManyAsset, retrying...", {
            operation: 'updateManyAsset',
            model: 'Asset',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyAsset',
            model: 'Asset',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyAsset',
            model: 'Asset',
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
   * Delete a single Asset record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted Asset or null.
   */
  async delete(props: AssetType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<AssetType> {
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

        const DELETE_ONE_ASSET = gql`
          mutation deleteOneAsset($where: AssetWhereUniqueInput!) {
            deleteOneAsset(where: $where) {
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
          mutation: DELETE_ONE_ASSET,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneAsset) {
          return response.data.deleteOneAsset;
        } else {
          return null as unknown as AssetType;
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
          logger.error("Non-retryable constraint violation in deleteOneAsset", {
            operation: 'deleteOneAsset',
            model: 'Asset',
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
          logger.warn("Database connection error in deleteOneAsset, retrying...", {
            operation: 'deleteOneAsset',
            model: 'Asset',
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
            operation: 'deleteOneAsset',
            model: 'Asset',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneAsset',
            model: 'Asset',
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
   * Retrieve a single Asset record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved Asset or null.
   */
  async get(props: AssetType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<AssetType | null> {
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

        const GET_ASSET = gql`
          query getAsset($where: AssetWhereUniqueInput!) {
            getAsset(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  symbol: props.symbol !== undefined ? props.symbol : undefined,
  name: props.name !== undefined ? props.name : undefined,
  type: props.type !== undefined ? {
    equals: props.type 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_ASSET,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getAsset ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No Asset found') {
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
          logger.warn("Database connection error in getAsset, retrying...", {
            operation: 'getAsset',
            model: 'Asset',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getAsset',
            model: 'Asset',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getAsset',
            model: 'Asset',
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
   * Retrieve all Assets records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of Asset records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<AssetType[] | null> {
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

        const GET_ALL_ASSET = gql`
          query getAllAsset {
            assets {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_ASSET,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.assets ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No Asset found') {
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
          logger.warn("Database connection error in getAllAsset, retrying...", {
            operation: 'getAllAsset',
            model: 'Asset',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllAsset',
            model: 'Asset',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllAsset',
            model: 'Asset',
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
   * Find multiple Asset records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found Asset records or null.
   */
  async findMany(props: AssetType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<AssetType[] | null> {
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

        const FIND_MANY_ASSET = gql`
          query findManyAsset($where: AssetWhereInput!) {
            assets(where: $where) {
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
  name: props.name !== undefined ? {
    equals: props.name 
  } : undefined,
  type: props.type !== undefined ? {
    equals: props.type 
  } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(`findManyAsset requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_ASSET,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.assets) {
          return response.data.assets;
        } else {
          return [] as AssetType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No Asset found') {
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
          logger.warn("Database connection error in findManyAsset, retrying...", {
            operation: 'findManyAsset',
            model: 'Asset',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyAsset',
            model: 'Asset',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyAsset',
            model: 'Asset',
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


  
import { Action as ActionType } from './generated/typegraphql-prisma/models/Action';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the Action model.
   */

  const selectionSet = `
    
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

  `;

  export const Action = {

    /**
     * Create a new Action record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created Action or null.
     */

    /**
     * Create a new Action record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created Action or null.
     */
    async create(props: ActionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<ActionType> {
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

          const CREATE_ONE_ACTION = gql`
              mutation createOneAction($data: ActionCreateInput!) {
                createOneAction(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                sequence: props.sequence !== undefined ? props.sequence : undefined,
  type: props.type !== undefined ? props.type : undefined,
  primary: props.primary !== undefined ? props.primary : undefined,
  note: props.note !== undefined ? props.note : undefined,
  status: props.status !== undefined ? props.status : undefined,
  deletedAt: props.deletedAt !== undefined ? props.deletedAt : undefined,
  alpacaOrderId: props.alpacaOrderId !== undefined ? props.alpacaOrderId : undefined,
  supersededActionId: props.supersededActionId !== undefined ? props.supersededActionId : undefined,
  triggerSource: props.triggerSource !== undefined ? props.triggerSource : undefined,
  triggerSourceType: props.triggerSourceType !== undefined ? props.triggerSourceType : undefined,
  trade: props.trade ? 
    typeof props.trade === 'object' && Object.keys(props.trade).length === 1 && Object.keys(props.trade)[0] === 'id'
    ? { connect: {
        id: props.trade.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.trade.id !== undefined ? props.trade.id : undefined,
        alpacaAccountId: props.trade.alpacaAccountId !== undefined ? {
            equals: props.trade.alpacaAccountId 
           } : undefined,
        status: props.trade.status !== undefined ? {
            equals: props.trade.status 
           } : undefined,
        symbol: props.trade.symbol !== undefined ? {
            equals: props.trade.symbol 
           } : undefined,
        signalId: props.trade.signalId !== undefined ? {
            equals: props.trade.signalId 
           } : undefined,
      },
      create: {
        alpacaAccountId: props.trade.alpacaAccountId !== undefined ? props.trade.alpacaAccountId : undefined,
        signal: props.trade.signal !== undefined ? props.trade.signal : undefined,
        strategy: props.trade.strategy !== undefined ? props.trade.strategy : undefined,
        analysis: props.trade.analysis !== undefined ? props.trade.analysis : undefined,
        summary: props.trade.summary !== undefined ? props.trade.summary : undefined,
        confidence: props.trade.confidence !== undefined ? props.trade.confidence : undefined,
        timestamp: props.trade.timestamp !== undefined ? props.trade.timestamp : undefined,
        status: props.trade.status !== undefined ? props.trade.status : undefined,
        deletedAt: props.trade.deletedAt !== undefined ? props.trade.deletedAt : undefined,
        symbol: props.trade.symbol !== undefined ? props.trade.symbol : undefined,
        side: props.trade.side !== undefined ? props.trade.side : undefined,
        entryPrice: props.trade.entryPrice !== undefined ? props.trade.entryPrice : undefined,
        exitPrice: props.trade.exitPrice !== undefined ? props.trade.exitPrice : undefined,
        entryQty: props.trade.entryQty !== undefined ? props.trade.entryQty : undefined,
        exitQty: props.trade.exitQty !== undefined ? props.trade.exitQty : undefined,
        entryValue: props.trade.entryValue !== undefined ? props.trade.entryValue : undefined,
        exitValue: props.trade.exitValue !== undefined ? props.trade.exitValue : undefined,
        entryTime: props.trade.entryTime !== undefined ? props.trade.entryTime : undefined,
        exitTime: props.trade.exitTime !== undefined ? props.trade.exitTime : undefined,
        pnlAmount: props.trade.pnlAmount !== undefined ? props.trade.pnlAmount : undefined,
        pnlPercent: props.trade.pnlPercent !== undefined ? props.trade.pnlPercent : undefined,
        durationMinutes: props.trade.durationMinutes !== undefined ? props.trade.durationMinutes : undefined,
        marketPhase: props.trade.marketPhase !== undefined ? props.trade.marketPhase : undefined,
        marketVolatility: props.trade.marketVolatility !== undefined ? props.trade.marketVolatility : undefined,
        sessionHorizonMinutes: props.trade.sessionHorizonMinutes !== undefined ? props.trade.sessionHorizonMinutes : undefined,
        thresholdsJson: props.trade.thresholdsJson !== undefined ? props.trade.thresholdsJson : undefined,
        thesisVersion: props.trade.thesisVersion !== undefined ? props.trade.thesisVersion : undefined,
        lastReunderwrittenAt: props.trade.lastReunderwrittenAt !== undefined ? props.trade.lastReunderwrittenAt : undefined,
        supersededById: props.trade.supersededById !== undefined ? props.trade.supersededById : undefined,
        rejectionMetadata: props.trade.rejectionMetadata !== undefined ? props.trade.rejectionMetadata : undefined,
        signalSource: props.trade.signalSource !== undefined ? props.trade.signalSource : undefined,
        signalSourceType: props.trade.signalSourceType !== undefined ? props.trade.signalSourceType : undefined,
        signalId: props.trade.signalId !== undefined ? props.trade.signalId : undefined,
        pathway: props.trade.pathway !== undefined ? props.trade.pathway : undefined,
        pathwayType: props.trade.pathwayType !== undefined ? props.trade.pathwayType : undefined,
        exitTier: props.trade.exitTier !== undefined ? props.trade.exitTier : undefined,
        exitTierType: props.trade.exitTierType !== undefined ? props.trade.exitTierType : undefined,
    strategyRef: props.trade.strategyRef ? 
      typeof props.trade.strategyRef === 'object' && Object.keys(props.trade.strategyRef).length === 1 && Object.keys(props.trade.strategyRef)[0] === 'id'
    ? { connect: {
          id: props.trade.strategyRef.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.trade.strategyRef.id !== undefined ? props.trade.strategyRef.id : undefined,
          key: props.trade.strategyRef.key !== undefined ? props.trade.strategyRef.key : undefined,
        },
        create: {
          key: props.trade.strategyRef.key !== undefined ? props.trade.strategyRef.key : undefined,
          displayName: props.trade.strategyRef.displayName !== undefined ? props.trade.strategyRef.displayName : undefined,
          description: props.trade.strategyRef.description !== undefined ? props.trade.strategyRef.description : undefined,
          origin: props.trade.strategyRef.origin !== undefined ? props.trade.strategyRef.origin : undefined,
          lifecycleState: props.trade.strategyRef.lifecycleState !== undefined ? props.trade.strategyRef.lifecycleState : undefined,
          manifestHash: props.trade.strategyRef.manifestHash !== undefined ? props.trade.strategyRef.manifestHash : undefined,
          deletedAt: props.trade.strategyRef.deletedAt !== undefined ? props.trade.strategyRef.deletedAt : undefined,
      owner: props.trade.strategyRef.owner ? 
        typeof props.trade.strategyRef.owner === 'object' && Object.keys(props.trade.strategyRef.owner).length === 1 && Object.keys(props.trade.strategyRef.owner)[0] === 'id'
    ? { connect: {
            id: props.trade.strategyRef.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.trade.strategyRef.owner.id !== undefined ? props.trade.strategyRef.owner.id : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            name: props.trade.strategyRef.owner.name !== undefined ? {
                equals: props.trade.strategyRef.owner.name 
               } : undefined,
          },
          create: {
            name: props.trade.strategyRef.owner.name !== undefined ? props.trade.strategyRef.owner.name : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            emailVerified: props.trade.strategyRef.owner.emailVerified !== undefined ? props.trade.strategyRef.owner.emailVerified : undefined,
            image: props.trade.strategyRef.owner.image !== undefined ? props.trade.strategyRef.owner.image : undefined,
            avatarUrl: props.trade.strategyRef.owner.avatarUrl !== undefined ? props.trade.strategyRef.owner.avatarUrl : undefined,
            onboardingComplete: props.trade.strategyRef.owner.onboardingComplete !== undefined ? props.trade.strategyRef.owner.onboardingComplete : undefined,
            signupCategory: props.trade.strategyRef.owner.signupCategory !== undefined ? props.trade.strategyRef.owner.signupCategory : undefined,
            deletedAt: props.trade.strategyRef.owner.deletedAt !== undefined ? props.trade.strategyRef.owner.deletedAt : undefined,
            role: props.trade.strategyRef.owner.role !== undefined ? props.trade.strategyRef.owner.role : undefined,
            bio: props.trade.strategyRef.owner.bio !== undefined ? props.trade.strategyRef.owner.bio : undefined,
            jobTitle: props.trade.strategyRef.owner.jobTitle !== undefined ? props.trade.strategyRef.owner.jobTitle : undefined,
            currentAccount: props.trade.strategyRef.owner.currentAccount !== undefined ? props.trade.strategyRef.owner.currentAccount : undefined,
            plan: props.trade.strategyRef.owner.plan !== undefined ? props.trade.strategyRef.owner.plan : undefined,
            openaiAPIKey: props.trade.strategyRef.owner.openaiAPIKey !== undefined ? props.trade.strategyRef.owner.openaiAPIKey : undefined,
            openaiModel: props.trade.strategyRef.owner.openaiModel !== undefined ? props.trade.strategyRef.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      subscriptions: props.trade.strategyRef.subscriptions ? 
        Array.isArray(props.trade.strategyRef.subscriptions) && props.trade.strategyRef.subscriptions.length > 0 &&  props.trade.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.trade.strategyRef.subscriptions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.trade.strategyRef.subscriptions.map((item) => ({
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
            mutation: CREATE_ONE_ACTION,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneAction) {
            return response.data.createOneAction;
          } else {
            return null as unknown as ActionType;
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
            logger.error("Non-retryable constraint violation in createOneAction", {
              operation: 'createOneAction',
              model: 'Action',
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
            logger.warn("Database connection error in createOneAction, retrying...", {
              operation: 'createOneAction',
              model: 'Action',
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
              operation: 'createOneAction',
              model: 'Action',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneAction',
              model: 'Action',
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
   * Create multiple Action records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of Action objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: ActionType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_ACTION = gql`
          mutation createManyAction($data: [ActionCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyAction(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      sequence: prop.sequence !== undefined ? prop.sequence : undefined,
  tradeId: prop.tradeId !== undefined ? prop.tradeId : undefined,
  type: prop.type !== undefined ? prop.type : undefined,
  primary: prop.primary !== undefined ? prop.primary : undefined,
  note: prop.note !== undefined ? prop.note : undefined,
  status: prop.status !== undefined ? prop.status : undefined,
  deletedAt: prop.deletedAt !== undefined ? prop.deletedAt : undefined,
  alpacaOrderId: prop.alpacaOrderId !== undefined ? prop.alpacaOrderId : undefined,
  supersededActionId: prop.supersededActionId !== undefined ? prop.supersededActionId : undefined,
  triggerSource: prop.triggerSource !== undefined ? prop.triggerSource : undefined,
  triggerSourceType: prop.triggerSourceType !== undefined ? prop.triggerSourceType : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_ACTION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyAction) {
          return response.data.createManyAction;
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
          logger.warn("Duplicate key in createManyAction (expected during overlapping fetches)", {
            operation: 'createManyAction',
            model: 'Action',
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
          logger.warn("Database connection error in createManyAction, retrying...", {
            operation: 'createManyAction',
            model: 'Action',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyAction',
            model: 'Action',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyAction',
            model: 'Action',
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
   * Update a single Action record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated Action or null.
   */
  async update(props: ActionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<ActionType> {
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

        const UPDATE_ONE_ACTION = gql`
          mutation updateOneAction($data: ActionUpdateInput!, $where: ActionWhereUniqueInput!) {
            updateOneAction(data: $data, where: $where) {
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
  sequence: props.sequence !== undefined ? {
            set: props.sequence 
           } : undefined,
  type: props.type !== undefined ? {
            set: props.type 
           } : undefined,
  primary: props.primary !== undefined ? {
            set: props.primary 
           } : undefined,
  note: props.note !== undefined ? {
            set: props.note 
           } : undefined,
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
  createdAt: props.createdAt !== undefined ? {
            set: props.createdAt 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
  deletedAt: props.deletedAt !== undefined ? {
            set: props.deletedAt 
           } : undefined,
  alpacaOrderId: props.alpacaOrderId !== undefined ? {
            set: props.alpacaOrderId 
           } : undefined,
  supersededActionId: props.supersededActionId !== undefined ? {
            set: props.supersededActionId 
           } : undefined,
  triggerSource: props.triggerSource !== undefined ? {
            set: props.triggerSource 
           } : undefined,
  triggerSourceType: props.triggerSourceType !== undefined ? {
            set: props.triggerSourceType 
           } : undefined,
  trade: props.trade ? 
  typeof props.trade === 'object' && Object.keys(props.trade).length === 1 && (Object.keys(props.trade)[0] === 'id' || Object.keys(props.trade)[0] === 'symbol')
? {
  connect: {
    id: props.trade.id
  }
} : { upsert: {
      where: {
        id: props.trade.id !== undefined ? {
            equals: props.trade.id
          } : undefined,
        alpacaAccountId: props.trade.alpacaAccountId !== undefined ? {
            equals: props.trade.alpacaAccountId
          } : undefined,
        status: props.trade.status !== undefined ? {
            equals: props.trade.status
          } : undefined,
        symbol: props.trade.symbol !== undefined ? {
            equals: props.trade.symbol
          } : undefined,
        supersededById: props.trade.supersededById !== undefined ? {
            equals: props.trade.supersededById
          } : undefined,
        signalId: props.trade.signalId !== undefined ? {
            equals: props.trade.signalId
          } : undefined,
        strategyId: props.trade.strategyId !== undefined ? {
            equals: props.trade.strategyId
          } : undefined,
      },
      update: {
        id: props.trade.id !== undefined ? {
            set: props.trade.id
          } : undefined,
        alpacaAccountId: props.trade.alpacaAccountId !== undefined ? {
            set: props.trade.alpacaAccountId
          } : undefined,
        signal: props.trade.signal !== undefined ? {
            set: props.trade.signal
          } : undefined,
        strategy: props.trade.strategy !== undefined ? {
            set: props.trade.strategy
          } : undefined,
        analysis: props.trade.analysis !== undefined ? {
            set: props.trade.analysis
          } : undefined,
        summary: props.trade.summary !== undefined ? {
            set: props.trade.summary
          } : undefined,
        confidence: props.trade.confidence !== undefined ? {
            set: props.trade.confidence
          } : undefined,
        timestamp: props.trade.timestamp !== undefined ? {
            set: props.trade.timestamp
          } : undefined,
        status: props.trade.status !== undefined ? {
            set: props.trade.status
          } : undefined,
        deletedAt: props.trade.deletedAt !== undefined ? {
            set: props.trade.deletedAt
          } : undefined,
        symbol: props.trade.symbol !== undefined ? {
            set: props.trade.symbol
          } : undefined,
        side: props.trade.side !== undefined ? {
            set: props.trade.side
          } : undefined,
        entryPrice: props.trade.entryPrice !== undefined ? {
            set: props.trade.entryPrice
          } : undefined,
        exitPrice: props.trade.exitPrice !== undefined ? {
            set: props.trade.exitPrice
          } : undefined,
        entryQty: props.trade.entryQty !== undefined ? {
            set: props.trade.entryQty
          } : undefined,
        exitQty: props.trade.exitQty !== undefined ? {
            set: props.trade.exitQty
          } : undefined,
        entryValue: props.trade.entryValue !== undefined ? {
            set: props.trade.entryValue
          } : undefined,
        exitValue: props.trade.exitValue !== undefined ? {
            set: props.trade.exitValue
          } : undefined,
        entryTime: props.trade.entryTime !== undefined ? {
            set: props.trade.entryTime
          } : undefined,
        exitTime: props.trade.exitTime !== undefined ? {
            set: props.trade.exitTime
          } : undefined,
        pnlAmount: props.trade.pnlAmount !== undefined ? {
            set: props.trade.pnlAmount
          } : undefined,
        pnlPercent: props.trade.pnlPercent !== undefined ? {
            set: props.trade.pnlPercent
          } : undefined,
        durationMinutes: props.trade.durationMinutes !== undefined ? {
            set: props.trade.durationMinutes
          } : undefined,
        marketPhase: props.trade.marketPhase !== undefined ? {
            set: props.trade.marketPhase
          } : undefined,
        marketVolatility: props.trade.marketVolatility !== undefined ? {
            set: props.trade.marketVolatility
          } : undefined,
        sessionHorizonMinutes: props.trade.sessionHorizonMinutes !== undefined ? {
            set: props.trade.sessionHorizonMinutes
          } : undefined,
        thresholdsJson: props.trade.thresholdsJson !== undefined ? {
            set: props.trade.thresholdsJson
          } : undefined,
        thesisVersion: props.trade.thesisVersion !== undefined ? {
            set: props.trade.thesisVersion
          } : undefined,
        lastReunderwrittenAt: props.trade.lastReunderwrittenAt !== undefined ? {
            set: props.trade.lastReunderwrittenAt
          } : undefined,
        supersededById: props.trade.supersededById !== undefined ? {
            set: props.trade.supersededById
          } : undefined,
        rejectionMetadata: props.trade.rejectionMetadata !== undefined ? props.trade.rejectionMetadata : undefined,
        signalSource: props.trade.signalSource !== undefined ? {
            set: props.trade.signalSource
          } : undefined,
        signalSourceType: props.trade.signalSourceType !== undefined ? {
            set: props.trade.signalSourceType
          } : undefined,
        signalId: props.trade.signalId !== undefined ? {
            set: props.trade.signalId
          } : undefined,
        pathway: props.trade.pathway !== undefined ? {
            set: props.trade.pathway
          } : undefined,
        pathwayType: props.trade.pathwayType !== undefined ? {
            set: props.trade.pathwayType
          } : undefined,
        exitTier: props.trade.exitTier !== undefined ? {
            set: props.trade.exitTier
          } : undefined,
        exitTierType: props.trade.exitTierType !== undefined ? {
            set: props.trade.exitTierType
          } : undefined,
    strategyRef: props.trade.strategyRef ? 
    typeof props.trade.strategyRef === 'object' && Object.keys(props.trade.strategyRef).length === 1 && (Object.keys(props.trade.strategyRef)[0] === 'id' || Object.keys(props.trade.strategyRef)[0] === 'symbol')
? {
    connect: {
      id: props.trade.strategyRef.id
    }
} : { upsert: {
        where: {
          id: props.trade.strategyRef.id !== undefined ? {
              equals: props.trade.strategyRef.id
            } : undefined,
          key: props.trade.strategyRef.key !== undefined ? {
              equals: props.trade.strategyRef.key
            } : undefined,
          ownerUserId: props.trade.strategyRef.ownerUserId !== undefined ? {
              equals: props.trade.strategyRef.ownerUserId
            } : undefined,
        },
        update: {
          id: props.trade.strategyRef.id !== undefined ? {
              set: props.trade.strategyRef.id
            } : undefined,
          key: props.trade.strategyRef.key !== undefined ? {
              set: props.trade.strategyRef.key
            } : undefined,
          displayName: props.trade.strategyRef.displayName !== undefined ? {
              set: props.trade.strategyRef.displayName
            } : undefined,
          description: props.trade.strategyRef.description !== undefined ? {
              set: props.trade.strategyRef.description
            } : undefined,
          origin: props.trade.strategyRef.origin !== undefined ? {
              set: props.trade.strategyRef.origin
            } : undefined,
          lifecycleState: props.trade.strategyRef.lifecycleState !== undefined ? {
              set: props.trade.strategyRef.lifecycleState
            } : undefined,
          manifestHash: props.trade.strategyRef.manifestHash !== undefined ? {
              set: props.trade.strategyRef.manifestHash
            } : undefined,
          deletedAt: props.trade.strategyRef.deletedAt !== undefined ? {
              set: props.trade.strategyRef.deletedAt
            } : undefined,
      owner: props.trade.strategyRef.owner ? 
      typeof props.trade.strategyRef.owner === 'object' && Object.keys(props.trade.strategyRef.owner).length === 1 && (Object.keys(props.trade.strategyRef.owner)[0] === 'id' || Object.keys(props.trade.strategyRef.owner)[0] === 'symbol')
? {
      connect: {
        id: props.trade.strategyRef.owner.id
      }
} : { upsert: {
          where: {
            id: props.trade.strategyRef.owner.id !== undefined ? {
                equals: props.trade.strategyRef.owner.id
              } : undefined,
            name: props.trade.strategyRef.owner.name !== undefined ? {
                equals: props.trade.strategyRef.owner.name
              } : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? {
                equals: props.trade.strategyRef.owner.email
              } : undefined,
            customerId: props.trade.strategyRef.owner.customerId !== undefined ? {
                equals: props.trade.strategyRef.owner.customerId
              } : undefined,
          },
          update: {
            id: props.trade.strategyRef.owner.id !== undefined ? {
                set: props.trade.strategyRef.owner.id
              } : undefined,
            name: props.trade.strategyRef.owner.name !== undefined ? {
                set: props.trade.strategyRef.owner.name
              } : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? {
                set: props.trade.strategyRef.owner.email
              } : undefined,
            emailVerified: props.trade.strategyRef.owner.emailVerified !== undefined ? {
                set: props.trade.strategyRef.owner.emailVerified
              } : undefined,
            image: props.trade.strategyRef.owner.image !== undefined ? {
                set: props.trade.strategyRef.owner.image
              } : undefined,
            avatarUrl: props.trade.strategyRef.owner.avatarUrl !== undefined ? {
                set: props.trade.strategyRef.owner.avatarUrl
              } : undefined,
            onboardingComplete: props.trade.strategyRef.owner.onboardingComplete !== undefined ? {
                set: props.trade.strategyRef.owner.onboardingComplete
              } : undefined,
            signupCategory: props.trade.strategyRef.owner.signupCategory !== undefined ? {
                set: props.trade.strategyRef.owner.signupCategory
              } : undefined,
            deletedAt: props.trade.strategyRef.owner.deletedAt !== undefined ? {
                set: props.trade.strategyRef.owner.deletedAt
              } : undefined,
            role: props.trade.strategyRef.owner.role !== undefined ? {
                set: props.trade.strategyRef.owner.role
              } : undefined,
            bio: props.trade.strategyRef.owner.bio !== undefined ? {
                set: props.trade.strategyRef.owner.bio
              } : undefined,
            jobTitle: props.trade.strategyRef.owner.jobTitle !== undefined ? {
                set: props.trade.strategyRef.owner.jobTitle
              } : undefined,
            currentAccount: props.trade.strategyRef.owner.currentAccount !== undefined ? {
                set: props.trade.strategyRef.owner.currentAccount
              } : undefined,
            plan: props.trade.strategyRef.owner.plan !== undefined ? {
                set: props.trade.strategyRef.owner.plan
              } : undefined,
            openaiAPIKey: props.trade.strategyRef.owner.openaiAPIKey !== undefined ? {
                set: props.trade.strategyRef.owner.openaiAPIKey
              } : undefined,
            openaiModel: props.trade.strategyRef.owner.openaiModel !== undefined ? {
                set: props.trade.strategyRef.owner.openaiModel
              } : undefined,
          },
          create: {
            name: props.trade.strategyRef.owner.name !== undefined ? props.trade.strategyRef.owner.name : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            emailVerified: props.trade.strategyRef.owner.emailVerified !== undefined ? props.trade.strategyRef.owner.emailVerified : undefined,
            image: props.trade.strategyRef.owner.image !== undefined ? props.trade.strategyRef.owner.image : undefined,
            avatarUrl: props.trade.strategyRef.owner.avatarUrl !== undefined ? props.trade.strategyRef.owner.avatarUrl : undefined,
            onboardingComplete: props.trade.strategyRef.owner.onboardingComplete !== undefined ? props.trade.strategyRef.owner.onboardingComplete : undefined,
            signupCategory: props.trade.strategyRef.owner.signupCategory !== undefined ? props.trade.strategyRef.owner.signupCategory : undefined,
            deletedAt: props.trade.strategyRef.owner.deletedAt !== undefined ? props.trade.strategyRef.owner.deletedAt : undefined,
            role: props.trade.strategyRef.owner.role !== undefined ? props.trade.strategyRef.owner.role : undefined,
            bio: props.trade.strategyRef.owner.bio !== undefined ? props.trade.strategyRef.owner.bio : undefined,
            jobTitle: props.trade.strategyRef.owner.jobTitle !== undefined ? props.trade.strategyRef.owner.jobTitle : undefined,
            currentAccount: props.trade.strategyRef.owner.currentAccount !== undefined ? props.trade.strategyRef.owner.currentAccount : undefined,
            plan: props.trade.strategyRef.owner.plan !== undefined ? props.trade.strategyRef.owner.plan : undefined,
            openaiAPIKey: props.trade.strategyRef.owner.openaiAPIKey !== undefined ? props.trade.strategyRef.owner.openaiAPIKey : undefined,
            openaiModel: props.trade.strategyRef.owner.openaiModel !== undefined ? props.trade.strategyRef.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      subscriptions: props.trade.strategyRef.subscriptions ? 
      Array.isArray(props.trade.strategyRef.subscriptions) && props.trade.strategyRef.subscriptions.length > 0 && props.trade.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.trade.strategyRef.subscriptions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.trade.strategyRef.subscriptions.map((item) => ({
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
          },
        }))
      } : undefined,
        },
        create: {
          key: props.trade.strategyRef.key !== undefined ? props.trade.strategyRef.key : undefined,
          displayName: props.trade.strategyRef.displayName !== undefined ? props.trade.strategyRef.displayName : undefined,
          description: props.trade.strategyRef.description !== undefined ? props.trade.strategyRef.description : undefined,
          origin: props.trade.strategyRef.origin !== undefined ? props.trade.strategyRef.origin : undefined,
          lifecycleState: props.trade.strategyRef.lifecycleState !== undefined ? props.trade.strategyRef.lifecycleState : undefined,
          manifestHash: props.trade.strategyRef.manifestHash !== undefined ? props.trade.strategyRef.manifestHash : undefined,
          deletedAt: props.trade.strategyRef.deletedAt !== undefined ? props.trade.strategyRef.deletedAt : undefined,
      owner: props.trade.strategyRef.owner ? 
        typeof props.trade.strategyRef.owner === 'object' && Object.keys(props.trade.strategyRef.owner).length === 1 && Object.keys(props.trade.strategyRef.owner)[0] === 'id'
    ? { connect: {
            id: props.trade.strategyRef.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.trade.strategyRef.owner.id !== undefined ? props.trade.strategyRef.owner.id : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            name: props.trade.strategyRef.owner.name !== undefined ? {
                equals: props.trade.strategyRef.owner.name 
               } : undefined,
          },
          create: {
            name: props.trade.strategyRef.owner.name !== undefined ? props.trade.strategyRef.owner.name : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            emailVerified: props.trade.strategyRef.owner.emailVerified !== undefined ? props.trade.strategyRef.owner.emailVerified : undefined,
            image: props.trade.strategyRef.owner.image !== undefined ? props.trade.strategyRef.owner.image : undefined,
            avatarUrl: props.trade.strategyRef.owner.avatarUrl !== undefined ? props.trade.strategyRef.owner.avatarUrl : undefined,
            onboardingComplete: props.trade.strategyRef.owner.onboardingComplete !== undefined ? props.trade.strategyRef.owner.onboardingComplete : undefined,
            signupCategory: props.trade.strategyRef.owner.signupCategory !== undefined ? props.trade.strategyRef.owner.signupCategory : undefined,
            deletedAt: props.trade.strategyRef.owner.deletedAt !== undefined ? props.trade.strategyRef.owner.deletedAt : undefined,
            role: props.trade.strategyRef.owner.role !== undefined ? props.trade.strategyRef.owner.role : undefined,
            bio: props.trade.strategyRef.owner.bio !== undefined ? props.trade.strategyRef.owner.bio : undefined,
            jobTitle: props.trade.strategyRef.owner.jobTitle !== undefined ? props.trade.strategyRef.owner.jobTitle : undefined,
            currentAccount: props.trade.strategyRef.owner.currentAccount !== undefined ? props.trade.strategyRef.owner.currentAccount : undefined,
            plan: props.trade.strategyRef.owner.plan !== undefined ? props.trade.strategyRef.owner.plan : undefined,
            openaiAPIKey: props.trade.strategyRef.owner.openaiAPIKey !== undefined ? props.trade.strategyRef.owner.openaiAPIKey : undefined,
            openaiModel: props.trade.strategyRef.owner.openaiModel !== undefined ? props.trade.strategyRef.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      subscriptions: props.trade.strategyRef.subscriptions ? 
        Array.isArray(props.trade.strategyRef.subscriptions) && props.trade.strategyRef.subscriptions.length > 0 &&  props.trade.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.trade.strategyRef.subscriptions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.trade.strategyRef.subscriptions.map((item) => ({
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
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
      },
      create: {
        alpacaAccountId: props.trade.alpacaAccountId !== undefined ? props.trade.alpacaAccountId : undefined,
        signal: props.trade.signal !== undefined ? props.trade.signal : undefined,
        strategy: props.trade.strategy !== undefined ? props.trade.strategy : undefined,
        analysis: props.trade.analysis !== undefined ? props.trade.analysis : undefined,
        summary: props.trade.summary !== undefined ? props.trade.summary : undefined,
        confidence: props.trade.confidence !== undefined ? props.trade.confidence : undefined,
        timestamp: props.trade.timestamp !== undefined ? props.trade.timestamp : undefined,
        status: props.trade.status !== undefined ? props.trade.status : undefined,
        deletedAt: props.trade.deletedAt !== undefined ? props.trade.deletedAt : undefined,
        symbol: props.trade.symbol !== undefined ? props.trade.symbol : undefined,
        side: props.trade.side !== undefined ? props.trade.side : undefined,
        entryPrice: props.trade.entryPrice !== undefined ? props.trade.entryPrice : undefined,
        exitPrice: props.trade.exitPrice !== undefined ? props.trade.exitPrice : undefined,
        entryQty: props.trade.entryQty !== undefined ? props.trade.entryQty : undefined,
        exitQty: props.trade.exitQty !== undefined ? props.trade.exitQty : undefined,
        entryValue: props.trade.entryValue !== undefined ? props.trade.entryValue : undefined,
        exitValue: props.trade.exitValue !== undefined ? props.trade.exitValue : undefined,
        entryTime: props.trade.entryTime !== undefined ? props.trade.entryTime : undefined,
        exitTime: props.trade.exitTime !== undefined ? props.trade.exitTime : undefined,
        pnlAmount: props.trade.pnlAmount !== undefined ? props.trade.pnlAmount : undefined,
        pnlPercent: props.trade.pnlPercent !== undefined ? props.trade.pnlPercent : undefined,
        durationMinutes: props.trade.durationMinutes !== undefined ? props.trade.durationMinutes : undefined,
        marketPhase: props.trade.marketPhase !== undefined ? props.trade.marketPhase : undefined,
        marketVolatility: props.trade.marketVolatility !== undefined ? props.trade.marketVolatility : undefined,
        sessionHorizonMinutes: props.trade.sessionHorizonMinutes !== undefined ? props.trade.sessionHorizonMinutes : undefined,
        thresholdsJson: props.trade.thresholdsJson !== undefined ? props.trade.thresholdsJson : undefined,
        thesisVersion: props.trade.thesisVersion !== undefined ? props.trade.thesisVersion : undefined,
        lastReunderwrittenAt: props.trade.lastReunderwrittenAt !== undefined ? props.trade.lastReunderwrittenAt : undefined,
        supersededById: props.trade.supersededById !== undefined ? props.trade.supersededById : undefined,
        rejectionMetadata: props.trade.rejectionMetadata !== undefined ? props.trade.rejectionMetadata : undefined,
        signalSource: props.trade.signalSource !== undefined ? props.trade.signalSource : undefined,
        signalSourceType: props.trade.signalSourceType !== undefined ? props.trade.signalSourceType : undefined,
        signalId: props.trade.signalId !== undefined ? props.trade.signalId : undefined,
        pathway: props.trade.pathway !== undefined ? props.trade.pathway : undefined,
        pathwayType: props.trade.pathwayType !== undefined ? props.trade.pathwayType : undefined,
        exitTier: props.trade.exitTier !== undefined ? props.trade.exitTier : undefined,
        exitTierType: props.trade.exitTierType !== undefined ? props.trade.exitTierType : undefined,
    strategyRef: props.trade.strategyRef ? 
      typeof props.trade.strategyRef === 'object' && Object.keys(props.trade.strategyRef).length === 1 && Object.keys(props.trade.strategyRef)[0] === 'id'
    ? { connect: {
          id: props.trade.strategyRef.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.trade.strategyRef.id !== undefined ? props.trade.strategyRef.id : undefined,
          key: props.trade.strategyRef.key !== undefined ? props.trade.strategyRef.key : undefined,
        },
        create: {
          key: props.trade.strategyRef.key !== undefined ? props.trade.strategyRef.key : undefined,
          displayName: props.trade.strategyRef.displayName !== undefined ? props.trade.strategyRef.displayName : undefined,
          description: props.trade.strategyRef.description !== undefined ? props.trade.strategyRef.description : undefined,
          origin: props.trade.strategyRef.origin !== undefined ? props.trade.strategyRef.origin : undefined,
          lifecycleState: props.trade.strategyRef.lifecycleState !== undefined ? props.trade.strategyRef.lifecycleState : undefined,
          manifestHash: props.trade.strategyRef.manifestHash !== undefined ? props.trade.strategyRef.manifestHash : undefined,
          deletedAt: props.trade.strategyRef.deletedAt !== undefined ? props.trade.strategyRef.deletedAt : undefined,
      owner: props.trade.strategyRef.owner ? 
        typeof props.trade.strategyRef.owner === 'object' && Object.keys(props.trade.strategyRef.owner).length === 1 && Object.keys(props.trade.strategyRef.owner)[0] === 'id'
    ? { connect: {
            id: props.trade.strategyRef.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.trade.strategyRef.owner.id !== undefined ? props.trade.strategyRef.owner.id : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            name: props.trade.strategyRef.owner.name !== undefined ? {
                equals: props.trade.strategyRef.owner.name 
               } : undefined,
          },
          create: {
            name: props.trade.strategyRef.owner.name !== undefined ? props.trade.strategyRef.owner.name : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            emailVerified: props.trade.strategyRef.owner.emailVerified !== undefined ? props.trade.strategyRef.owner.emailVerified : undefined,
            image: props.trade.strategyRef.owner.image !== undefined ? props.trade.strategyRef.owner.image : undefined,
            avatarUrl: props.trade.strategyRef.owner.avatarUrl !== undefined ? props.trade.strategyRef.owner.avatarUrl : undefined,
            onboardingComplete: props.trade.strategyRef.owner.onboardingComplete !== undefined ? props.trade.strategyRef.owner.onboardingComplete : undefined,
            signupCategory: props.trade.strategyRef.owner.signupCategory !== undefined ? props.trade.strategyRef.owner.signupCategory : undefined,
            deletedAt: props.trade.strategyRef.owner.deletedAt !== undefined ? props.trade.strategyRef.owner.deletedAt : undefined,
            role: props.trade.strategyRef.owner.role !== undefined ? props.trade.strategyRef.owner.role : undefined,
            bio: props.trade.strategyRef.owner.bio !== undefined ? props.trade.strategyRef.owner.bio : undefined,
            jobTitle: props.trade.strategyRef.owner.jobTitle !== undefined ? props.trade.strategyRef.owner.jobTitle : undefined,
            currentAccount: props.trade.strategyRef.owner.currentAccount !== undefined ? props.trade.strategyRef.owner.currentAccount : undefined,
            plan: props.trade.strategyRef.owner.plan !== undefined ? props.trade.strategyRef.owner.plan : undefined,
            openaiAPIKey: props.trade.strategyRef.owner.openaiAPIKey !== undefined ? props.trade.strategyRef.owner.openaiAPIKey : undefined,
            openaiModel: props.trade.strategyRef.owner.openaiModel !== undefined ? props.trade.strategyRef.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      subscriptions: props.trade.strategyRef.subscriptions ? 
        Array.isArray(props.trade.strategyRef.subscriptions) && props.trade.strategyRef.subscriptions.length > 0 &&  props.trade.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.trade.strategyRef.subscriptions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.trade.strategyRef.subscriptions.map((item) => ({
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
          mutation: UPDATE_ONE_ACTION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneAction) {
          return response.data.updateOneAction;
        } else {
          return null as unknown as ActionType;
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
          logger.error("Non-retryable constraint violation in updateOneAction", {
            operation: 'updateOneAction',
            model: 'Action',
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
          logger.warn("Database connection error in updateOneAction, retrying...", {
            operation: 'updateOneAction',
            model: 'Action',
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
            operation: 'updateOneAction',
            model: 'Action',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneAction',
            model: 'Action',
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
   * Upsert a single Action record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated Action or null.
   */
  async upsert(props: ActionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<ActionType> {
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

        const UPSERT_ONE_ACTION = gql`
          mutation upsertOneAction($where: ActionWhereUniqueInput!, $create: ActionCreateInput!, $update: ActionUpdateInput!) {
            upsertOneAction(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  alpacaOrderId: props.alpacaOrderId !== undefined ? props.alpacaOrderId : undefined,
  tradeId: props.tradeId !== undefined ? {
    equals: props.tradeId 
  } : undefined,
  type: props.type !== undefined ? {
    equals: props.type 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
      },
          create: {
        sequence: props.sequence !== undefined ? props.sequence : undefined,
  type: props.type !== undefined ? props.type : undefined,
  primary: props.primary !== undefined ? props.primary : undefined,
  note: props.note !== undefined ? props.note : undefined,
  status: props.status !== undefined ? props.status : undefined,
  deletedAt: props.deletedAt !== undefined ? props.deletedAt : undefined,
  alpacaOrderId: props.alpacaOrderId !== undefined ? props.alpacaOrderId : undefined,
  supersededActionId: props.supersededActionId !== undefined ? props.supersededActionId : undefined,
  triggerSource: props.triggerSource !== undefined ? props.triggerSource : undefined,
  triggerSourceType: props.triggerSourceType !== undefined ? props.triggerSourceType : undefined,
  trade: props.trade ? 
    typeof props.trade === 'object' && Object.keys(props.trade).length === 1 && Object.keys(props.trade)[0] === 'id'
    ? { connect: {
        id: props.trade.id
        }
      }
    : { connectOrCreate: {
      where: {
        id: props.trade.id !== undefined ? props.trade.id : undefined,
        alpacaAccountId: props.trade.alpacaAccountId !== undefined ? {
            equals: props.trade.alpacaAccountId 
           } : undefined,
        status: props.trade.status !== undefined ? {
            equals: props.trade.status 
           } : undefined,
        symbol: props.trade.symbol !== undefined ? {
            equals: props.trade.symbol 
           } : undefined,
        signalId: props.trade.signalId !== undefined ? {
            equals: props.trade.signalId 
           } : undefined,
      },
      create: {
        alpacaAccountId: props.trade.alpacaAccountId !== undefined ? props.trade.alpacaAccountId : undefined,
        signal: props.trade.signal !== undefined ? props.trade.signal : undefined,
        strategy: props.trade.strategy !== undefined ? props.trade.strategy : undefined,
        analysis: props.trade.analysis !== undefined ? props.trade.analysis : undefined,
        summary: props.trade.summary !== undefined ? props.trade.summary : undefined,
        confidence: props.trade.confidence !== undefined ? props.trade.confidence : undefined,
        timestamp: props.trade.timestamp !== undefined ? props.trade.timestamp : undefined,
        status: props.trade.status !== undefined ? props.trade.status : undefined,
        deletedAt: props.trade.deletedAt !== undefined ? props.trade.deletedAt : undefined,
        symbol: props.trade.symbol !== undefined ? props.trade.symbol : undefined,
        side: props.trade.side !== undefined ? props.trade.side : undefined,
        entryPrice: props.trade.entryPrice !== undefined ? props.trade.entryPrice : undefined,
        exitPrice: props.trade.exitPrice !== undefined ? props.trade.exitPrice : undefined,
        entryQty: props.trade.entryQty !== undefined ? props.trade.entryQty : undefined,
        exitQty: props.trade.exitQty !== undefined ? props.trade.exitQty : undefined,
        entryValue: props.trade.entryValue !== undefined ? props.trade.entryValue : undefined,
        exitValue: props.trade.exitValue !== undefined ? props.trade.exitValue : undefined,
        entryTime: props.trade.entryTime !== undefined ? props.trade.entryTime : undefined,
        exitTime: props.trade.exitTime !== undefined ? props.trade.exitTime : undefined,
        pnlAmount: props.trade.pnlAmount !== undefined ? props.trade.pnlAmount : undefined,
        pnlPercent: props.trade.pnlPercent !== undefined ? props.trade.pnlPercent : undefined,
        durationMinutes: props.trade.durationMinutes !== undefined ? props.trade.durationMinutes : undefined,
        marketPhase: props.trade.marketPhase !== undefined ? props.trade.marketPhase : undefined,
        marketVolatility: props.trade.marketVolatility !== undefined ? props.trade.marketVolatility : undefined,
        sessionHorizonMinutes: props.trade.sessionHorizonMinutes !== undefined ? props.trade.sessionHorizonMinutes : undefined,
        thresholdsJson: props.trade.thresholdsJson !== undefined ? props.trade.thresholdsJson : undefined,
        thesisVersion: props.trade.thesisVersion !== undefined ? props.trade.thesisVersion : undefined,
        lastReunderwrittenAt: props.trade.lastReunderwrittenAt !== undefined ? props.trade.lastReunderwrittenAt : undefined,
        supersededById: props.trade.supersededById !== undefined ? props.trade.supersededById : undefined,
        rejectionMetadata: props.trade.rejectionMetadata !== undefined ? props.trade.rejectionMetadata : undefined,
        signalSource: props.trade.signalSource !== undefined ? props.trade.signalSource : undefined,
        signalSourceType: props.trade.signalSourceType !== undefined ? props.trade.signalSourceType : undefined,
        signalId: props.trade.signalId !== undefined ? props.trade.signalId : undefined,
        pathway: props.trade.pathway !== undefined ? props.trade.pathway : undefined,
        pathwayType: props.trade.pathwayType !== undefined ? props.trade.pathwayType : undefined,
        exitTier: props.trade.exitTier !== undefined ? props.trade.exitTier : undefined,
        exitTierType: props.trade.exitTierType !== undefined ? props.trade.exitTierType : undefined,
    strategyRef: props.trade.strategyRef ? 
      typeof props.trade.strategyRef === 'object' && Object.keys(props.trade.strategyRef).length === 1 && Object.keys(props.trade.strategyRef)[0] === 'id'
    ? { connect: {
          id: props.trade.strategyRef.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.trade.strategyRef.id !== undefined ? props.trade.strategyRef.id : undefined,
          key: props.trade.strategyRef.key !== undefined ? props.trade.strategyRef.key : undefined,
        },
        create: {
          key: props.trade.strategyRef.key !== undefined ? props.trade.strategyRef.key : undefined,
          displayName: props.trade.strategyRef.displayName !== undefined ? props.trade.strategyRef.displayName : undefined,
          description: props.trade.strategyRef.description !== undefined ? props.trade.strategyRef.description : undefined,
          origin: props.trade.strategyRef.origin !== undefined ? props.trade.strategyRef.origin : undefined,
          lifecycleState: props.trade.strategyRef.lifecycleState !== undefined ? props.trade.strategyRef.lifecycleState : undefined,
          manifestHash: props.trade.strategyRef.manifestHash !== undefined ? props.trade.strategyRef.manifestHash : undefined,
          deletedAt: props.trade.strategyRef.deletedAt !== undefined ? props.trade.strategyRef.deletedAt : undefined,
      owner: props.trade.strategyRef.owner ? 
        typeof props.trade.strategyRef.owner === 'object' && Object.keys(props.trade.strategyRef.owner).length === 1 && Object.keys(props.trade.strategyRef.owner)[0] === 'id'
    ? { connect: {
            id: props.trade.strategyRef.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.trade.strategyRef.owner.id !== undefined ? props.trade.strategyRef.owner.id : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            name: props.trade.strategyRef.owner.name !== undefined ? {
                equals: props.trade.strategyRef.owner.name 
               } : undefined,
          },
          create: {
            name: props.trade.strategyRef.owner.name !== undefined ? props.trade.strategyRef.owner.name : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            emailVerified: props.trade.strategyRef.owner.emailVerified !== undefined ? props.trade.strategyRef.owner.emailVerified : undefined,
            image: props.trade.strategyRef.owner.image !== undefined ? props.trade.strategyRef.owner.image : undefined,
            avatarUrl: props.trade.strategyRef.owner.avatarUrl !== undefined ? props.trade.strategyRef.owner.avatarUrl : undefined,
            onboardingComplete: props.trade.strategyRef.owner.onboardingComplete !== undefined ? props.trade.strategyRef.owner.onboardingComplete : undefined,
            signupCategory: props.trade.strategyRef.owner.signupCategory !== undefined ? props.trade.strategyRef.owner.signupCategory : undefined,
            deletedAt: props.trade.strategyRef.owner.deletedAt !== undefined ? props.trade.strategyRef.owner.deletedAt : undefined,
            role: props.trade.strategyRef.owner.role !== undefined ? props.trade.strategyRef.owner.role : undefined,
            bio: props.trade.strategyRef.owner.bio !== undefined ? props.trade.strategyRef.owner.bio : undefined,
            jobTitle: props.trade.strategyRef.owner.jobTitle !== undefined ? props.trade.strategyRef.owner.jobTitle : undefined,
            currentAccount: props.trade.strategyRef.owner.currentAccount !== undefined ? props.trade.strategyRef.owner.currentAccount : undefined,
            plan: props.trade.strategyRef.owner.plan !== undefined ? props.trade.strategyRef.owner.plan : undefined,
            openaiAPIKey: props.trade.strategyRef.owner.openaiAPIKey !== undefined ? props.trade.strategyRef.owner.openaiAPIKey : undefined,
            openaiModel: props.trade.strategyRef.owner.openaiModel !== undefined ? props.trade.strategyRef.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      subscriptions: props.trade.strategyRef.subscriptions ? 
        Array.isArray(props.trade.strategyRef.subscriptions) && props.trade.strategyRef.subscriptions.length > 0 &&  props.trade.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.trade.strategyRef.subscriptions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.trade.strategyRef.subscriptions.map((item) => ({
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
      sequence: props.sequence !== undefined ? {
            set: props.sequence 
           } : undefined,
  type: props.type !== undefined ? {
            set: props.type 
           } : undefined,
  primary: props.primary !== undefined ? {
            set: props.primary 
           } : undefined,
  note: props.note !== undefined ? {
            set: props.note 
           } : undefined,
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
  deletedAt: props.deletedAt !== undefined ? {
            set: props.deletedAt 
           } : undefined,
  alpacaOrderId: props.alpacaOrderId !== undefined ? {
            set: props.alpacaOrderId 
           } : undefined,
  supersededActionId: props.supersededActionId !== undefined ? {
            set: props.supersededActionId 
           } : undefined,
  triggerSource: props.triggerSource !== undefined ? {
            set: props.triggerSource 
           } : undefined,
  triggerSourceType: props.triggerSourceType !== undefined ? {
            set: props.triggerSourceType 
           } : undefined,
  trade: props.trade ? 
  typeof props.trade === 'object' && Object.keys(props.trade).length === 1 && (Object.keys(props.trade)[0] === 'id' || Object.keys(props.trade)[0] === 'symbol')
? {
  connect: {
    id: props.trade.id
  }
} : { upsert: {
      where: {
        id: props.trade.id !== undefined ? {
            equals: props.trade.id
          } : undefined,
        alpacaAccountId: props.trade.alpacaAccountId !== undefined ? {
            equals: props.trade.alpacaAccountId
          } : undefined,
        status: props.trade.status !== undefined ? {
            equals: props.trade.status
          } : undefined,
        symbol: props.trade.symbol !== undefined ? {
            equals: props.trade.symbol
          } : undefined,
        supersededById: props.trade.supersededById !== undefined ? {
            equals: props.trade.supersededById
          } : undefined,
        signalId: props.trade.signalId !== undefined ? {
            equals: props.trade.signalId
          } : undefined,
        strategyId: props.trade.strategyId !== undefined ? {
            equals: props.trade.strategyId
          } : undefined,
      },
      update: {
        id: props.trade.id !== undefined ? {
            set: props.trade.id
          } : undefined,
        alpacaAccountId: props.trade.alpacaAccountId !== undefined ? {
            set: props.trade.alpacaAccountId
          } : undefined,
        signal: props.trade.signal !== undefined ? {
            set: props.trade.signal
          } : undefined,
        strategy: props.trade.strategy !== undefined ? {
            set: props.trade.strategy
          } : undefined,
        analysis: props.trade.analysis !== undefined ? {
            set: props.trade.analysis
          } : undefined,
        summary: props.trade.summary !== undefined ? {
            set: props.trade.summary
          } : undefined,
        confidence: props.trade.confidence !== undefined ? {
            set: props.trade.confidence
          } : undefined,
        timestamp: props.trade.timestamp !== undefined ? {
            set: props.trade.timestamp
          } : undefined,
        status: props.trade.status !== undefined ? {
            set: props.trade.status
          } : undefined,
        deletedAt: props.trade.deletedAt !== undefined ? {
            set: props.trade.deletedAt
          } : undefined,
        symbol: props.trade.symbol !== undefined ? {
            set: props.trade.symbol
          } : undefined,
        side: props.trade.side !== undefined ? {
            set: props.trade.side
          } : undefined,
        entryPrice: props.trade.entryPrice !== undefined ? {
            set: props.trade.entryPrice
          } : undefined,
        exitPrice: props.trade.exitPrice !== undefined ? {
            set: props.trade.exitPrice
          } : undefined,
        entryQty: props.trade.entryQty !== undefined ? {
            set: props.trade.entryQty
          } : undefined,
        exitQty: props.trade.exitQty !== undefined ? {
            set: props.trade.exitQty
          } : undefined,
        entryValue: props.trade.entryValue !== undefined ? {
            set: props.trade.entryValue
          } : undefined,
        exitValue: props.trade.exitValue !== undefined ? {
            set: props.trade.exitValue
          } : undefined,
        entryTime: props.trade.entryTime !== undefined ? {
            set: props.trade.entryTime
          } : undefined,
        exitTime: props.trade.exitTime !== undefined ? {
            set: props.trade.exitTime
          } : undefined,
        pnlAmount: props.trade.pnlAmount !== undefined ? {
            set: props.trade.pnlAmount
          } : undefined,
        pnlPercent: props.trade.pnlPercent !== undefined ? {
            set: props.trade.pnlPercent
          } : undefined,
        durationMinutes: props.trade.durationMinutes !== undefined ? {
            set: props.trade.durationMinutes
          } : undefined,
        marketPhase: props.trade.marketPhase !== undefined ? {
            set: props.trade.marketPhase
          } : undefined,
        marketVolatility: props.trade.marketVolatility !== undefined ? {
            set: props.trade.marketVolatility
          } : undefined,
        sessionHorizonMinutes: props.trade.sessionHorizonMinutes !== undefined ? {
            set: props.trade.sessionHorizonMinutes
          } : undefined,
        thresholdsJson: props.trade.thresholdsJson !== undefined ? {
            set: props.trade.thresholdsJson
          } : undefined,
        thesisVersion: props.trade.thesisVersion !== undefined ? {
            set: props.trade.thesisVersion
          } : undefined,
        lastReunderwrittenAt: props.trade.lastReunderwrittenAt !== undefined ? {
            set: props.trade.lastReunderwrittenAt
          } : undefined,
        supersededById: props.trade.supersededById !== undefined ? {
            set: props.trade.supersededById
          } : undefined,
        rejectionMetadata: props.trade.rejectionMetadata !== undefined ? props.trade.rejectionMetadata : undefined,
        signalSource: props.trade.signalSource !== undefined ? {
            set: props.trade.signalSource
          } : undefined,
        signalSourceType: props.trade.signalSourceType !== undefined ? {
            set: props.trade.signalSourceType
          } : undefined,
        signalId: props.trade.signalId !== undefined ? {
            set: props.trade.signalId
          } : undefined,
        pathway: props.trade.pathway !== undefined ? {
            set: props.trade.pathway
          } : undefined,
        pathwayType: props.trade.pathwayType !== undefined ? {
            set: props.trade.pathwayType
          } : undefined,
        exitTier: props.trade.exitTier !== undefined ? {
            set: props.trade.exitTier
          } : undefined,
        exitTierType: props.trade.exitTierType !== undefined ? {
            set: props.trade.exitTierType
          } : undefined,
    strategyRef: props.trade.strategyRef ? 
    typeof props.trade.strategyRef === 'object' && Object.keys(props.trade.strategyRef).length === 1 && (Object.keys(props.trade.strategyRef)[0] === 'id' || Object.keys(props.trade.strategyRef)[0] === 'symbol')
? {
    connect: {
      id: props.trade.strategyRef.id
    }
} : { upsert: {
        where: {
          id: props.trade.strategyRef.id !== undefined ? {
              equals: props.trade.strategyRef.id
            } : undefined,
          key: props.trade.strategyRef.key !== undefined ? {
              equals: props.trade.strategyRef.key
            } : undefined,
          ownerUserId: props.trade.strategyRef.ownerUserId !== undefined ? {
              equals: props.trade.strategyRef.ownerUserId
            } : undefined,
        },
        update: {
          id: props.trade.strategyRef.id !== undefined ? {
              set: props.trade.strategyRef.id
            } : undefined,
          key: props.trade.strategyRef.key !== undefined ? {
              set: props.trade.strategyRef.key
            } : undefined,
          displayName: props.trade.strategyRef.displayName !== undefined ? {
              set: props.trade.strategyRef.displayName
            } : undefined,
          description: props.trade.strategyRef.description !== undefined ? {
              set: props.trade.strategyRef.description
            } : undefined,
          origin: props.trade.strategyRef.origin !== undefined ? {
              set: props.trade.strategyRef.origin
            } : undefined,
          lifecycleState: props.trade.strategyRef.lifecycleState !== undefined ? {
              set: props.trade.strategyRef.lifecycleState
            } : undefined,
          manifestHash: props.trade.strategyRef.manifestHash !== undefined ? {
              set: props.trade.strategyRef.manifestHash
            } : undefined,
          deletedAt: props.trade.strategyRef.deletedAt !== undefined ? {
              set: props.trade.strategyRef.deletedAt
            } : undefined,
      owner: props.trade.strategyRef.owner ? 
      typeof props.trade.strategyRef.owner === 'object' && Object.keys(props.trade.strategyRef.owner).length === 1 && (Object.keys(props.trade.strategyRef.owner)[0] === 'id' || Object.keys(props.trade.strategyRef.owner)[0] === 'symbol')
? {
      connect: {
        id: props.trade.strategyRef.owner.id
      }
} : { upsert: {
          where: {
            id: props.trade.strategyRef.owner.id !== undefined ? {
                equals: props.trade.strategyRef.owner.id
              } : undefined,
            name: props.trade.strategyRef.owner.name !== undefined ? {
                equals: props.trade.strategyRef.owner.name
              } : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? {
                equals: props.trade.strategyRef.owner.email
              } : undefined,
            customerId: props.trade.strategyRef.owner.customerId !== undefined ? {
                equals: props.trade.strategyRef.owner.customerId
              } : undefined,
          },
          update: {
            id: props.trade.strategyRef.owner.id !== undefined ? {
                set: props.trade.strategyRef.owner.id
              } : undefined,
            name: props.trade.strategyRef.owner.name !== undefined ? {
                set: props.trade.strategyRef.owner.name
              } : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? {
                set: props.trade.strategyRef.owner.email
              } : undefined,
            emailVerified: props.trade.strategyRef.owner.emailVerified !== undefined ? {
                set: props.trade.strategyRef.owner.emailVerified
              } : undefined,
            image: props.trade.strategyRef.owner.image !== undefined ? {
                set: props.trade.strategyRef.owner.image
              } : undefined,
            avatarUrl: props.trade.strategyRef.owner.avatarUrl !== undefined ? {
                set: props.trade.strategyRef.owner.avatarUrl
              } : undefined,
            onboardingComplete: props.trade.strategyRef.owner.onboardingComplete !== undefined ? {
                set: props.trade.strategyRef.owner.onboardingComplete
              } : undefined,
            signupCategory: props.trade.strategyRef.owner.signupCategory !== undefined ? {
                set: props.trade.strategyRef.owner.signupCategory
              } : undefined,
            deletedAt: props.trade.strategyRef.owner.deletedAt !== undefined ? {
                set: props.trade.strategyRef.owner.deletedAt
              } : undefined,
            role: props.trade.strategyRef.owner.role !== undefined ? {
                set: props.trade.strategyRef.owner.role
              } : undefined,
            bio: props.trade.strategyRef.owner.bio !== undefined ? {
                set: props.trade.strategyRef.owner.bio
              } : undefined,
            jobTitle: props.trade.strategyRef.owner.jobTitle !== undefined ? {
                set: props.trade.strategyRef.owner.jobTitle
              } : undefined,
            currentAccount: props.trade.strategyRef.owner.currentAccount !== undefined ? {
                set: props.trade.strategyRef.owner.currentAccount
              } : undefined,
            plan: props.trade.strategyRef.owner.plan !== undefined ? {
                set: props.trade.strategyRef.owner.plan
              } : undefined,
            openaiAPIKey: props.trade.strategyRef.owner.openaiAPIKey !== undefined ? {
                set: props.trade.strategyRef.owner.openaiAPIKey
              } : undefined,
            openaiModel: props.trade.strategyRef.owner.openaiModel !== undefined ? {
                set: props.trade.strategyRef.owner.openaiModel
              } : undefined,
          },
          create: {
            name: props.trade.strategyRef.owner.name !== undefined ? props.trade.strategyRef.owner.name : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            emailVerified: props.trade.strategyRef.owner.emailVerified !== undefined ? props.trade.strategyRef.owner.emailVerified : undefined,
            image: props.trade.strategyRef.owner.image !== undefined ? props.trade.strategyRef.owner.image : undefined,
            avatarUrl: props.trade.strategyRef.owner.avatarUrl !== undefined ? props.trade.strategyRef.owner.avatarUrl : undefined,
            onboardingComplete: props.trade.strategyRef.owner.onboardingComplete !== undefined ? props.trade.strategyRef.owner.onboardingComplete : undefined,
            signupCategory: props.trade.strategyRef.owner.signupCategory !== undefined ? props.trade.strategyRef.owner.signupCategory : undefined,
            deletedAt: props.trade.strategyRef.owner.deletedAt !== undefined ? props.trade.strategyRef.owner.deletedAt : undefined,
            role: props.trade.strategyRef.owner.role !== undefined ? props.trade.strategyRef.owner.role : undefined,
            bio: props.trade.strategyRef.owner.bio !== undefined ? props.trade.strategyRef.owner.bio : undefined,
            jobTitle: props.trade.strategyRef.owner.jobTitle !== undefined ? props.trade.strategyRef.owner.jobTitle : undefined,
            currentAccount: props.trade.strategyRef.owner.currentAccount !== undefined ? props.trade.strategyRef.owner.currentAccount : undefined,
            plan: props.trade.strategyRef.owner.plan !== undefined ? props.trade.strategyRef.owner.plan : undefined,
            openaiAPIKey: props.trade.strategyRef.owner.openaiAPIKey !== undefined ? props.trade.strategyRef.owner.openaiAPIKey : undefined,
            openaiModel: props.trade.strategyRef.owner.openaiModel !== undefined ? props.trade.strategyRef.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      subscriptions: props.trade.strategyRef.subscriptions ? 
      Array.isArray(props.trade.strategyRef.subscriptions) && props.trade.strategyRef.subscriptions.length > 0 && props.trade.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: props.trade.strategyRef.subscriptions.map((item) => ({
        id: item.id
      }))
} : { upsert: props.trade.strategyRef.subscriptions.map((item) => ({
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
          },
        }))
      } : undefined,
        },
        create: {
          key: props.trade.strategyRef.key !== undefined ? props.trade.strategyRef.key : undefined,
          displayName: props.trade.strategyRef.displayName !== undefined ? props.trade.strategyRef.displayName : undefined,
          description: props.trade.strategyRef.description !== undefined ? props.trade.strategyRef.description : undefined,
          origin: props.trade.strategyRef.origin !== undefined ? props.trade.strategyRef.origin : undefined,
          lifecycleState: props.trade.strategyRef.lifecycleState !== undefined ? props.trade.strategyRef.lifecycleState : undefined,
          manifestHash: props.trade.strategyRef.manifestHash !== undefined ? props.trade.strategyRef.manifestHash : undefined,
          deletedAt: props.trade.strategyRef.deletedAt !== undefined ? props.trade.strategyRef.deletedAt : undefined,
      owner: props.trade.strategyRef.owner ? 
        typeof props.trade.strategyRef.owner === 'object' && Object.keys(props.trade.strategyRef.owner).length === 1 && Object.keys(props.trade.strategyRef.owner)[0] === 'id'
    ? { connect: {
            id: props.trade.strategyRef.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.trade.strategyRef.owner.id !== undefined ? props.trade.strategyRef.owner.id : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            name: props.trade.strategyRef.owner.name !== undefined ? {
                equals: props.trade.strategyRef.owner.name 
               } : undefined,
          },
          create: {
            name: props.trade.strategyRef.owner.name !== undefined ? props.trade.strategyRef.owner.name : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            emailVerified: props.trade.strategyRef.owner.emailVerified !== undefined ? props.trade.strategyRef.owner.emailVerified : undefined,
            image: props.trade.strategyRef.owner.image !== undefined ? props.trade.strategyRef.owner.image : undefined,
            avatarUrl: props.trade.strategyRef.owner.avatarUrl !== undefined ? props.trade.strategyRef.owner.avatarUrl : undefined,
            onboardingComplete: props.trade.strategyRef.owner.onboardingComplete !== undefined ? props.trade.strategyRef.owner.onboardingComplete : undefined,
            signupCategory: props.trade.strategyRef.owner.signupCategory !== undefined ? props.trade.strategyRef.owner.signupCategory : undefined,
            deletedAt: props.trade.strategyRef.owner.deletedAt !== undefined ? props.trade.strategyRef.owner.deletedAt : undefined,
            role: props.trade.strategyRef.owner.role !== undefined ? props.trade.strategyRef.owner.role : undefined,
            bio: props.trade.strategyRef.owner.bio !== undefined ? props.trade.strategyRef.owner.bio : undefined,
            jobTitle: props.trade.strategyRef.owner.jobTitle !== undefined ? props.trade.strategyRef.owner.jobTitle : undefined,
            currentAccount: props.trade.strategyRef.owner.currentAccount !== undefined ? props.trade.strategyRef.owner.currentAccount : undefined,
            plan: props.trade.strategyRef.owner.plan !== undefined ? props.trade.strategyRef.owner.plan : undefined,
            openaiAPIKey: props.trade.strategyRef.owner.openaiAPIKey !== undefined ? props.trade.strategyRef.owner.openaiAPIKey : undefined,
            openaiModel: props.trade.strategyRef.owner.openaiModel !== undefined ? props.trade.strategyRef.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      subscriptions: props.trade.strategyRef.subscriptions ? 
        Array.isArray(props.trade.strategyRef.subscriptions) && props.trade.strategyRef.subscriptions.length > 0 &&  props.trade.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.trade.strategyRef.subscriptions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.trade.strategyRef.subscriptions.map((item) => ({
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
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
      },
      create: {
        alpacaAccountId: props.trade.alpacaAccountId !== undefined ? props.trade.alpacaAccountId : undefined,
        signal: props.trade.signal !== undefined ? props.trade.signal : undefined,
        strategy: props.trade.strategy !== undefined ? props.trade.strategy : undefined,
        analysis: props.trade.analysis !== undefined ? props.trade.analysis : undefined,
        summary: props.trade.summary !== undefined ? props.trade.summary : undefined,
        confidence: props.trade.confidence !== undefined ? props.trade.confidence : undefined,
        timestamp: props.trade.timestamp !== undefined ? props.trade.timestamp : undefined,
        status: props.trade.status !== undefined ? props.trade.status : undefined,
        deletedAt: props.trade.deletedAt !== undefined ? props.trade.deletedAt : undefined,
        symbol: props.trade.symbol !== undefined ? props.trade.symbol : undefined,
        side: props.trade.side !== undefined ? props.trade.side : undefined,
        entryPrice: props.trade.entryPrice !== undefined ? props.trade.entryPrice : undefined,
        exitPrice: props.trade.exitPrice !== undefined ? props.trade.exitPrice : undefined,
        entryQty: props.trade.entryQty !== undefined ? props.trade.entryQty : undefined,
        exitQty: props.trade.exitQty !== undefined ? props.trade.exitQty : undefined,
        entryValue: props.trade.entryValue !== undefined ? props.trade.entryValue : undefined,
        exitValue: props.trade.exitValue !== undefined ? props.trade.exitValue : undefined,
        entryTime: props.trade.entryTime !== undefined ? props.trade.entryTime : undefined,
        exitTime: props.trade.exitTime !== undefined ? props.trade.exitTime : undefined,
        pnlAmount: props.trade.pnlAmount !== undefined ? props.trade.pnlAmount : undefined,
        pnlPercent: props.trade.pnlPercent !== undefined ? props.trade.pnlPercent : undefined,
        durationMinutes: props.trade.durationMinutes !== undefined ? props.trade.durationMinutes : undefined,
        marketPhase: props.trade.marketPhase !== undefined ? props.trade.marketPhase : undefined,
        marketVolatility: props.trade.marketVolatility !== undefined ? props.trade.marketVolatility : undefined,
        sessionHorizonMinutes: props.trade.sessionHorizonMinutes !== undefined ? props.trade.sessionHorizonMinutes : undefined,
        thresholdsJson: props.trade.thresholdsJson !== undefined ? props.trade.thresholdsJson : undefined,
        thesisVersion: props.trade.thesisVersion !== undefined ? props.trade.thesisVersion : undefined,
        lastReunderwrittenAt: props.trade.lastReunderwrittenAt !== undefined ? props.trade.lastReunderwrittenAt : undefined,
        supersededById: props.trade.supersededById !== undefined ? props.trade.supersededById : undefined,
        rejectionMetadata: props.trade.rejectionMetadata !== undefined ? props.trade.rejectionMetadata : undefined,
        signalSource: props.trade.signalSource !== undefined ? props.trade.signalSource : undefined,
        signalSourceType: props.trade.signalSourceType !== undefined ? props.trade.signalSourceType : undefined,
        signalId: props.trade.signalId !== undefined ? props.trade.signalId : undefined,
        pathway: props.trade.pathway !== undefined ? props.trade.pathway : undefined,
        pathwayType: props.trade.pathwayType !== undefined ? props.trade.pathwayType : undefined,
        exitTier: props.trade.exitTier !== undefined ? props.trade.exitTier : undefined,
        exitTierType: props.trade.exitTierType !== undefined ? props.trade.exitTierType : undefined,
    strategyRef: props.trade.strategyRef ? 
      typeof props.trade.strategyRef === 'object' && Object.keys(props.trade.strategyRef).length === 1 && Object.keys(props.trade.strategyRef)[0] === 'id'
    ? { connect: {
          id: props.trade.strategyRef.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: props.trade.strategyRef.id !== undefined ? props.trade.strategyRef.id : undefined,
          key: props.trade.strategyRef.key !== undefined ? props.trade.strategyRef.key : undefined,
        },
        create: {
          key: props.trade.strategyRef.key !== undefined ? props.trade.strategyRef.key : undefined,
          displayName: props.trade.strategyRef.displayName !== undefined ? props.trade.strategyRef.displayName : undefined,
          description: props.trade.strategyRef.description !== undefined ? props.trade.strategyRef.description : undefined,
          origin: props.trade.strategyRef.origin !== undefined ? props.trade.strategyRef.origin : undefined,
          lifecycleState: props.trade.strategyRef.lifecycleState !== undefined ? props.trade.strategyRef.lifecycleState : undefined,
          manifestHash: props.trade.strategyRef.manifestHash !== undefined ? props.trade.strategyRef.manifestHash : undefined,
          deletedAt: props.trade.strategyRef.deletedAt !== undefined ? props.trade.strategyRef.deletedAt : undefined,
      owner: props.trade.strategyRef.owner ? 
        typeof props.trade.strategyRef.owner === 'object' && Object.keys(props.trade.strategyRef.owner).length === 1 && Object.keys(props.trade.strategyRef.owner)[0] === 'id'
    ? { connect: {
            id: props.trade.strategyRef.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: props.trade.strategyRef.owner.id !== undefined ? props.trade.strategyRef.owner.id : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            name: props.trade.strategyRef.owner.name !== undefined ? {
                equals: props.trade.strategyRef.owner.name 
               } : undefined,
          },
          create: {
            name: props.trade.strategyRef.owner.name !== undefined ? props.trade.strategyRef.owner.name : undefined,
            email: props.trade.strategyRef.owner.email !== undefined ? props.trade.strategyRef.owner.email : undefined,
            emailVerified: props.trade.strategyRef.owner.emailVerified !== undefined ? props.trade.strategyRef.owner.emailVerified : undefined,
            image: props.trade.strategyRef.owner.image !== undefined ? props.trade.strategyRef.owner.image : undefined,
            avatarUrl: props.trade.strategyRef.owner.avatarUrl !== undefined ? props.trade.strategyRef.owner.avatarUrl : undefined,
            onboardingComplete: props.trade.strategyRef.owner.onboardingComplete !== undefined ? props.trade.strategyRef.owner.onboardingComplete : undefined,
            signupCategory: props.trade.strategyRef.owner.signupCategory !== undefined ? props.trade.strategyRef.owner.signupCategory : undefined,
            deletedAt: props.trade.strategyRef.owner.deletedAt !== undefined ? props.trade.strategyRef.owner.deletedAt : undefined,
            role: props.trade.strategyRef.owner.role !== undefined ? props.trade.strategyRef.owner.role : undefined,
            bio: props.trade.strategyRef.owner.bio !== undefined ? props.trade.strategyRef.owner.bio : undefined,
            jobTitle: props.trade.strategyRef.owner.jobTitle !== undefined ? props.trade.strategyRef.owner.jobTitle : undefined,
            currentAccount: props.trade.strategyRef.owner.currentAccount !== undefined ? props.trade.strategyRef.owner.currentAccount : undefined,
            plan: props.trade.strategyRef.owner.plan !== undefined ? props.trade.strategyRef.owner.plan : undefined,
            openaiAPIKey: props.trade.strategyRef.owner.openaiAPIKey !== undefined ? props.trade.strategyRef.owner.openaiAPIKey : undefined,
            openaiModel: props.trade.strategyRef.owner.openaiModel !== undefined ? props.trade.strategyRef.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      subscriptions: props.trade.strategyRef.subscriptions ? 
        Array.isArray(props.trade.strategyRef.subscriptions) && props.trade.strategyRef.subscriptions.length > 0 &&  props.trade.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        props.trade.strategyRef.subscriptions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: props.trade.strategyRef.subscriptions.map((item) => ({
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
          mutation: UPSERT_ONE_ACTION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneAction) {
          return response.data.upsertOneAction;
        } else {
          return null as unknown as ActionType;
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
          logger.error("Non-retryable constraint violation in upsertOneAction", {
            operation: 'upsertOneAction',
            model: 'Action',
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
          logger.warn("Database connection error in upsertOneAction, retrying...", {
            operation: 'upsertOneAction',
            model: 'Action',
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
            operation: 'upsertOneAction',
            model: 'Action',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneAction',
            model: 'Action',
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
   * Update multiple Action records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of Action objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: ActionType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_ACTION = gql`
          mutation updateManyAction($data: [ActionCreateManyInput!]!) {
            updateManyAction(data: $data) {
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
  sequence: prop.sequence !== undefined ? {
            set: prop.sequence 
           } : undefined,
  type: prop.type !== undefined ? {
            set: prop.type 
           } : undefined,
  primary: prop.primary !== undefined ? {
            set: prop.primary 
           } : undefined,
  note: prop.note !== undefined ? {
            set: prop.note 
           } : undefined,
  status: prop.status !== undefined ? {
            set: prop.status 
           } : undefined,
  createdAt: prop.createdAt !== undefined ? {
            set: prop.createdAt 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,
  deletedAt: prop.deletedAt !== undefined ? {
            set: prop.deletedAt 
           } : undefined,
  alpacaOrderId: prop.alpacaOrderId !== undefined ? {
            set: prop.alpacaOrderId 
           } : undefined,
  supersededActionId: prop.supersededActionId !== undefined ? {
            set: prop.supersededActionId 
           } : undefined,
  triggerSource: prop.triggerSource !== undefined ? {
            set: prop.triggerSource 
           } : undefined,
  triggerSourceType: prop.triggerSourceType !== undefined ? {
            set: prop.triggerSourceType 
           } : undefined,
  trade: prop.trade ? 
  typeof prop.trade === 'object' && Object.keys(prop.trade).length === 1 && (Object.keys(prop.trade)[0] === 'id' || Object.keys(prop.trade)[0] === 'symbol')
? {
  connect: {
    id: prop.trade.id
  }
} : { upsert: {
      where: {
        id: prop.trade.id !== undefined ? {
            equals: prop.trade.id
          } : undefined,
        alpacaAccountId: prop.trade.alpacaAccountId !== undefined ? {
            equals: prop.trade.alpacaAccountId
          } : undefined,
        status: prop.trade.status !== undefined ? {
            equals: prop.trade.status
          } : undefined,
        symbol: prop.trade.symbol !== undefined ? {
            equals: prop.trade.symbol
          } : undefined,
        supersededById: prop.trade.supersededById !== undefined ? {
            equals: prop.trade.supersededById
          } : undefined,
        signalId: prop.trade.signalId !== undefined ? {
            equals: prop.trade.signalId
          } : undefined,
        strategyId: prop.trade.strategyId !== undefined ? {
            equals: prop.trade.strategyId
          } : undefined,
      },
      update: {
        id: prop.trade.id !== undefined ? {
            set: prop.trade.id
          } : undefined,
        alpacaAccountId: prop.trade.alpacaAccountId !== undefined ? {
            set: prop.trade.alpacaAccountId
          } : undefined,
        signal: prop.trade.signal !== undefined ? {
            set: prop.trade.signal
          } : undefined,
        strategy: prop.trade.strategy !== undefined ? {
            set: prop.trade.strategy
          } : undefined,
        analysis: prop.trade.analysis !== undefined ? {
            set: prop.trade.analysis
          } : undefined,
        summary: prop.trade.summary !== undefined ? {
            set: prop.trade.summary
          } : undefined,
        confidence: prop.trade.confidence !== undefined ? {
            set: prop.trade.confidence
          } : undefined,
        timestamp: prop.trade.timestamp !== undefined ? {
            set: prop.trade.timestamp
          } : undefined,
        status: prop.trade.status !== undefined ? {
            set: prop.trade.status
          } : undefined,
        deletedAt: prop.trade.deletedAt !== undefined ? {
            set: prop.trade.deletedAt
          } : undefined,
        symbol: prop.trade.symbol !== undefined ? {
            set: prop.trade.symbol
          } : undefined,
        side: prop.trade.side !== undefined ? {
            set: prop.trade.side
          } : undefined,
        entryPrice: prop.trade.entryPrice !== undefined ? {
            set: prop.trade.entryPrice
          } : undefined,
        exitPrice: prop.trade.exitPrice !== undefined ? {
            set: prop.trade.exitPrice
          } : undefined,
        entryQty: prop.trade.entryQty !== undefined ? {
            set: prop.trade.entryQty
          } : undefined,
        exitQty: prop.trade.exitQty !== undefined ? {
            set: prop.trade.exitQty
          } : undefined,
        entryValue: prop.trade.entryValue !== undefined ? {
            set: prop.trade.entryValue
          } : undefined,
        exitValue: prop.trade.exitValue !== undefined ? {
            set: prop.trade.exitValue
          } : undefined,
        entryTime: prop.trade.entryTime !== undefined ? {
            set: prop.trade.entryTime
          } : undefined,
        exitTime: prop.trade.exitTime !== undefined ? {
            set: prop.trade.exitTime
          } : undefined,
        pnlAmount: prop.trade.pnlAmount !== undefined ? {
            set: prop.trade.pnlAmount
          } : undefined,
        pnlPercent: prop.trade.pnlPercent !== undefined ? {
            set: prop.trade.pnlPercent
          } : undefined,
        durationMinutes: prop.trade.durationMinutes !== undefined ? {
            set: prop.trade.durationMinutes
          } : undefined,
        marketPhase: prop.trade.marketPhase !== undefined ? {
            set: prop.trade.marketPhase
          } : undefined,
        marketVolatility: prop.trade.marketVolatility !== undefined ? {
            set: prop.trade.marketVolatility
          } : undefined,
        sessionHorizonMinutes: prop.trade.sessionHorizonMinutes !== undefined ? {
            set: prop.trade.sessionHorizonMinutes
          } : undefined,
        thresholdsJson: prop.trade.thresholdsJson !== undefined ? {
            set: prop.trade.thresholdsJson
          } : undefined,
        thesisVersion: prop.trade.thesisVersion !== undefined ? {
            set: prop.trade.thesisVersion
          } : undefined,
        lastReunderwrittenAt: prop.trade.lastReunderwrittenAt !== undefined ? {
            set: prop.trade.lastReunderwrittenAt
          } : undefined,
        supersededById: prop.trade.supersededById !== undefined ? {
            set: prop.trade.supersededById
          } : undefined,
        rejectionMetadata: prop.trade.rejectionMetadata !== undefined ? prop.trade.rejectionMetadata : undefined,
        signalSource: prop.trade.signalSource !== undefined ? {
            set: prop.trade.signalSource
          } : undefined,
        signalSourceType: prop.trade.signalSourceType !== undefined ? {
            set: prop.trade.signalSourceType
          } : undefined,
        signalId: prop.trade.signalId !== undefined ? {
            set: prop.trade.signalId
          } : undefined,
        pathway: prop.trade.pathway !== undefined ? {
            set: prop.trade.pathway
          } : undefined,
        pathwayType: prop.trade.pathwayType !== undefined ? {
            set: prop.trade.pathwayType
          } : undefined,
        exitTier: prop.trade.exitTier !== undefined ? {
            set: prop.trade.exitTier
          } : undefined,
        exitTierType: prop.trade.exitTierType !== undefined ? {
            set: prop.trade.exitTierType
          } : undefined,
    strategyRef: prop.trade.strategyRef ? 
    typeof prop.trade.strategyRef === 'object' && Object.keys(prop.trade.strategyRef).length === 1 && (Object.keys(prop.trade.strategyRef)[0] === 'id' || Object.keys(prop.trade.strategyRef)[0] === 'symbol')
? {
    connect: {
      id: prop.trade.strategyRef.id
    }
} : { upsert: {
        where: {
          id: prop.trade.strategyRef.id !== undefined ? {
              equals: prop.trade.strategyRef.id
            } : undefined,
          key: prop.trade.strategyRef.key !== undefined ? {
              equals: prop.trade.strategyRef.key
            } : undefined,
          ownerUserId: prop.trade.strategyRef.ownerUserId !== undefined ? {
              equals: prop.trade.strategyRef.ownerUserId
            } : undefined,
        },
        update: {
          id: prop.trade.strategyRef.id !== undefined ? {
              set: prop.trade.strategyRef.id
            } : undefined,
          key: prop.trade.strategyRef.key !== undefined ? {
              set: prop.trade.strategyRef.key
            } : undefined,
          displayName: prop.trade.strategyRef.displayName !== undefined ? {
              set: prop.trade.strategyRef.displayName
            } : undefined,
          description: prop.trade.strategyRef.description !== undefined ? {
              set: prop.trade.strategyRef.description
            } : undefined,
          origin: prop.trade.strategyRef.origin !== undefined ? {
              set: prop.trade.strategyRef.origin
            } : undefined,
          lifecycleState: prop.trade.strategyRef.lifecycleState !== undefined ? {
              set: prop.trade.strategyRef.lifecycleState
            } : undefined,
          manifestHash: prop.trade.strategyRef.manifestHash !== undefined ? {
              set: prop.trade.strategyRef.manifestHash
            } : undefined,
          deletedAt: prop.trade.strategyRef.deletedAt !== undefined ? {
              set: prop.trade.strategyRef.deletedAt
            } : undefined,
      owner: prop.trade.strategyRef.owner ? 
      typeof prop.trade.strategyRef.owner === 'object' && Object.keys(prop.trade.strategyRef.owner).length === 1 && (Object.keys(prop.trade.strategyRef.owner)[0] === 'id' || Object.keys(prop.trade.strategyRef.owner)[0] === 'symbol')
? {
      connect: {
        id: prop.trade.strategyRef.owner.id
      }
} : { upsert: {
          where: {
            id: prop.trade.strategyRef.owner.id !== undefined ? {
                equals: prop.trade.strategyRef.owner.id
              } : undefined,
            name: prop.trade.strategyRef.owner.name !== undefined ? {
                equals: prop.trade.strategyRef.owner.name
              } : undefined,
            email: prop.trade.strategyRef.owner.email !== undefined ? {
                equals: prop.trade.strategyRef.owner.email
              } : undefined,
            customerId: prop.trade.strategyRef.owner.customerId !== undefined ? {
                equals: prop.trade.strategyRef.owner.customerId
              } : undefined,
          },
          update: {
            id: prop.trade.strategyRef.owner.id !== undefined ? {
                set: prop.trade.strategyRef.owner.id
              } : undefined,
            name: prop.trade.strategyRef.owner.name !== undefined ? {
                set: prop.trade.strategyRef.owner.name
              } : undefined,
            email: prop.trade.strategyRef.owner.email !== undefined ? {
                set: prop.trade.strategyRef.owner.email
              } : undefined,
            emailVerified: prop.trade.strategyRef.owner.emailVerified !== undefined ? {
                set: prop.trade.strategyRef.owner.emailVerified
              } : undefined,
            image: prop.trade.strategyRef.owner.image !== undefined ? {
                set: prop.trade.strategyRef.owner.image
              } : undefined,
            avatarUrl: prop.trade.strategyRef.owner.avatarUrl !== undefined ? {
                set: prop.trade.strategyRef.owner.avatarUrl
              } : undefined,
            onboardingComplete: prop.trade.strategyRef.owner.onboardingComplete !== undefined ? {
                set: prop.trade.strategyRef.owner.onboardingComplete
              } : undefined,
            signupCategory: prop.trade.strategyRef.owner.signupCategory !== undefined ? {
                set: prop.trade.strategyRef.owner.signupCategory
              } : undefined,
            deletedAt: prop.trade.strategyRef.owner.deletedAt !== undefined ? {
                set: prop.trade.strategyRef.owner.deletedAt
              } : undefined,
            role: prop.trade.strategyRef.owner.role !== undefined ? {
                set: prop.trade.strategyRef.owner.role
              } : undefined,
            bio: prop.trade.strategyRef.owner.bio !== undefined ? {
                set: prop.trade.strategyRef.owner.bio
              } : undefined,
            jobTitle: prop.trade.strategyRef.owner.jobTitle !== undefined ? {
                set: prop.trade.strategyRef.owner.jobTitle
              } : undefined,
            currentAccount: prop.trade.strategyRef.owner.currentAccount !== undefined ? {
                set: prop.trade.strategyRef.owner.currentAccount
              } : undefined,
            plan: prop.trade.strategyRef.owner.plan !== undefined ? {
                set: prop.trade.strategyRef.owner.plan
              } : undefined,
            openaiAPIKey: prop.trade.strategyRef.owner.openaiAPIKey !== undefined ? {
                set: prop.trade.strategyRef.owner.openaiAPIKey
              } : undefined,
            openaiModel: prop.trade.strategyRef.owner.openaiModel !== undefined ? {
                set: prop.trade.strategyRef.owner.openaiModel
              } : undefined,
          },
          create: {
            name: prop.trade.strategyRef.owner.name !== undefined ? prop.trade.strategyRef.owner.name : undefined,
            email: prop.trade.strategyRef.owner.email !== undefined ? prop.trade.strategyRef.owner.email : undefined,
            emailVerified: prop.trade.strategyRef.owner.emailVerified !== undefined ? prop.trade.strategyRef.owner.emailVerified : undefined,
            image: prop.trade.strategyRef.owner.image !== undefined ? prop.trade.strategyRef.owner.image : undefined,
            avatarUrl: prop.trade.strategyRef.owner.avatarUrl !== undefined ? prop.trade.strategyRef.owner.avatarUrl : undefined,
            onboardingComplete: prop.trade.strategyRef.owner.onboardingComplete !== undefined ? prop.trade.strategyRef.owner.onboardingComplete : undefined,
            signupCategory: prop.trade.strategyRef.owner.signupCategory !== undefined ? prop.trade.strategyRef.owner.signupCategory : undefined,
            deletedAt: prop.trade.strategyRef.owner.deletedAt !== undefined ? prop.trade.strategyRef.owner.deletedAt : undefined,
            role: prop.trade.strategyRef.owner.role !== undefined ? prop.trade.strategyRef.owner.role : undefined,
            bio: prop.trade.strategyRef.owner.bio !== undefined ? prop.trade.strategyRef.owner.bio : undefined,
            jobTitle: prop.trade.strategyRef.owner.jobTitle !== undefined ? prop.trade.strategyRef.owner.jobTitle : undefined,
            currentAccount: prop.trade.strategyRef.owner.currentAccount !== undefined ? prop.trade.strategyRef.owner.currentAccount : undefined,
            plan: prop.trade.strategyRef.owner.plan !== undefined ? prop.trade.strategyRef.owner.plan : undefined,
            openaiAPIKey: prop.trade.strategyRef.owner.openaiAPIKey !== undefined ? prop.trade.strategyRef.owner.openaiAPIKey : undefined,
            openaiModel: prop.trade.strategyRef.owner.openaiModel !== undefined ? prop.trade.strategyRef.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      subscriptions: prop.trade.strategyRef.subscriptions ? 
      Array.isArray(prop.trade.strategyRef.subscriptions) && prop.trade.strategyRef.subscriptions.length > 0 && prop.trade.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1) ? {
      connect: prop.trade.strategyRef.subscriptions.map((item) => ({
        id: item.id
      }))
} : { upsert: prop.trade.strategyRef.subscriptions.map((item) => ({
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
          },
        }))
      } : undefined,
        },
        create: {
          key: prop.trade.strategyRef.key !== undefined ? prop.trade.strategyRef.key : undefined,
          displayName: prop.trade.strategyRef.displayName !== undefined ? prop.trade.strategyRef.displayName : undefined,
          description: prop.trade.strategyRef.description !== undefined ? prop.trade.strategyRef.description : undefined,
          origin: prop.trade.strategyRef.origin !== undefined ? prop.trade.strategyRef.origin : undefined,
          lifecycleState: prop.trade.strategyRef.lifecycleState !== undefined ? prop.trade.strategyRef.lifecycleState : undefined,
          manifestHash: prop.trade.strategyRef.manifestHash !== undefined ? prop.trade.strategyRef.manifestHash : undefined,
          deletedAt: prop.trade.strategyRef.deletedAt !== undefined ? prop.trade.strategyRef.deletedAt : undefined,
      owner: prop.trade.strategyRef.owner ? 
        typeof prop.trade.strategyRef.owner === 'object' && Object.keys(prop.trade.strategyRef.owner).length === 1 && Object.keys(prop.trade.strategyRef.owner)[0] === 'id'
    ? { connect: {
            id: prop.trade.strategyRef.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.trade.strategyRef.owner.id !== undefined ? prop.trade.strategyRef.owner.id : undefined,
            email: prop.trade.strategyRef.owner.email !== undefined ? prop.trade.strategyRef.owner.email : undefined,
            name: prop.trade.strategyRef.owner.name !== undefined ? {
                equals: prop.trade.strategyRef.owner.name 
               } : undefined,
          },
          create: {
            name: prop.trade.strategyRef.owner.name !== undefined ? prop.trade.strategyRef.owner.name : undefined,
            email: prop.trade.strategyRef.owner.email !== undefined ? prop.trade.strategyRef.owner.email : undefined,
            emailVerified: prop.trade.strategyRef.owner.emailVerified !== undefined ? prop.trade.strategyRef.owner.emailVerified : undefined,
            image: prop.trade.strategyRef.owner.image !== undefined ? prop.trade.strategyRef.owner.image : undefined,
            avatarUrl: prop.trade.strategyRef.owner.avatarUrl !== undefined ? prop.trade.strategyRef.owner.avatarUrl : undefined,
            onboardingComplete: prop.trade.strategyRef.owner.onboardingComplete !== undefined ? prop.trade.strategyRef.owner.onboardingComplete : undefined,
            signupCategory: prop.trade.strategyRef.owner.signupCategory !== undefined ? prop.trade.strategyRef.owner.signupCategory : undefined,
            deletedAt: prop.trade.strategyRef.owner.deletedAt !== undefined ? prop.trade.strategyRef.owner.deletedAt : undefined,
            role: prop.trade.strategyRef.owner.role !== undefined ? prop.trade.strategyRef.owner.role : undefined,
            bio: prop.trade.strategyRef.owner.bio !== undefined ? prop.trade.strategyRef.owner.bio : undefined,
            jobTitle: prop.trade.strategyRef.owner.jobTitle !== undefined ? prop.trade.strategyRef.owner.jobTitle : undefined,
            currentAccount: prop.trade.strategyRef.owner.currentAccount !== undefined ? prop.trade.strategyRef.owner.currentAccount : undefined,
            plan: prop.trade.strategyRef.owner.plan !== undefined ? prop.trade.strategyRef.owner.plan : undefined,
            openaiAPIKey: prop.trade.strategyRef.owner.openaiAPIKey !== undefined ? prop.trade.strategyRef.owner.openaiAPIKey : undefined,
            openaiModel: prop.trade.strategyRef.owner.openaiModel !== undefined ? prop.trade.strategyRef.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      subscriptions: prop.trade.strategyRef.subscriptions ? 
        Array.isArray(prop.trade.strategyRef.subscriptions) && prop.trade.strategyRef.subscriptions.length > 0 &&  prop.trade.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.trade.strategyRef.subscriptions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.trade.strategyRef.subscriptions.map((item) => ({
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
          },
        }))
      } : undefined,
        },
      }
    } : undefined,
      },
      create: {
        alpacaAccountId: prop.trade.alpacaAccountId !== undefined ? prop.trade.alpacaAccountId : undefined,
        signal: prop.trade.signal !== undefined ? prop.trade.signal : undefined,
        strategy: prop.trade.strategy !== undefined ? prop.trade.strategy : undefined,
        analysis: prop.trade.analysis !== undefined ? prop.trade.analysis : undefined,
        summary: prop.trade.summary !== undefined ? prop.trade.summary : undefined,
        confidence: prop.trade.confidence !== undefined ? prop.trade.confidence : undefined,
        timestamp: prop.trade.timestamp !== undefined ? prop.trade.timestamp : undefined,
        status: prop.trade.status !== undefined ? prop.trade.status : undefined,
        deletedAt: prop.trade.deletedAt !== undefined ? prop.trade.deletedAt : undefined,
        symbol: prop.trade.symbol !== undefined ? prop.trade.symbol : undefined,
        side: prop.trade.side !== undefined ? prop.trade.side : undefined,
        entryPrice: prop.trade.entryPrice !== undefined ? prop.trade.entryPrice : undefined,
        exitPrice: prop.trade.exitPrice !== undefined ? prop.trade.exitPrice : undefined,
        entryQty: prop.trade.entryQty !== undefined ? prop.trade.entryQty : undefined,
        exitQty: prop.trade.exitQty !== undefined ? prop.trade.exitQty : undefined,
        entryValue: prop.trade.entryValue !== undefined ? prop.trade.entryValue : undefined,
        exitValue: prop.trade.exitValue !== undefined ? prop.trade.exitValue : undefined,
        entryTime: prop.trade.entryTime !== undefined ? prop.trade.entryTime : undefined,
        exitTime: prop.trade.exitTime !== undefined ? prop.trade.exitTime : undefined,
        pnlAmount: prop.trade.pnlAmount !== undefined ? prop.trade.pnlAmount : undefined,
        pnlPercent: prop.trade.pnlPercent !== undefined ? prop.trade.pnlPercent : undefined,
        durationMinutes: prop.trade.durationMinutes !== undefined ? prop.trade.durationMinutes : undefined,
        marketPhase: prop.trade.marketPhase !== undefined ? prop.trade.marketPhase : undefined,
        marketVolatility: prop.trade.marketVolatility !== undefined ? prop.trade.marketVolatility : undefined,
        sessionHorizonMinutes: prop.trade.sessionHorizonMinutes !== undefined ? prop.trade.sessionHorizonMinutes : undefined,
        thresholdsJson: prop.trade.thresholdsJson !== undefined ? prop.trade.thresholdsJson : undefined,
        thesisVersion: prop.trade.thesisVersion !== undefined ? prop.trade.thesisVersion : undefined,
        lastReunderwrittenAt: prop.trade.lastReunderwrittenAt !== undefined ? prop.trade.lastReunderwrittenAt : undefined,
        supersededById: prop.trade.supersededById !== undefined ? prop.trade.supersededById : undefined,
        rejectionMetadata: prop.trade.rejectionMetadata !== undefined ? prop.trade.rejectionMetadata : undefined,
        signalSource: prop.trade.signalSource !== undefined ? prop.trade.signalSource : undefined,
        signalSourceType: prop.trade.signalSourceType !== undefined ? prop.trade.signalSourceType : undefined,
        signalId: prop.trade.signalId !== undefined ? prop.trade.signalId : undefined,
        pathway: prop.trade.pathway !== undefined ? prop.trade.pathway : undefined,
        pathwayType: prop.trade.pathwayType !== undefined ? prop.trade.pathwayType : undefined,
        exitTier: prop.trade.exitTier !== undefined ? prop.trade.exitTier : undefined,
        exitTierType: prop.trade.exitTierType !== undefined ? prop.trade.exitTierType : undefined,
    strategyRef: prop.trade.strategyRef ? 
      typeof prop.trade.strategyRef === 'object' && Object.keys(prop.trade.strategyRef).length === 1 && Object.keys(prop.trade.strategyRef)[0] === 'id'
    ? { connect: {
          id: prop.trade.strategyRef.id
          }
        }
    : { connectOrCreate: {
        where: {
          id: prop.trade.strategyRef.id !== undefined ? prop.trade.strategyRef.id : undefined,
          key: prop.trade.strategyRef.key !== undefined ? prop.trade.strategyRef.key : undefined,
        },
        create: {
          key: prop.trade.strategyRef.key !== undefined ? prop.trade.strategyRef.key : undefined,
          displayName: prop.trade.strategyRef.displayName !== undefined ? prop.trade.strategyRef.displayName : undefined,
          description: prop.trade.strategyRef.description !== undefined ? prop.trade.strategyRef.description : undefined,
          origin: prop.trade.strategyRef.origin !== undefined ? prop.trade.strategyRef.origin : undefined,
          lifecycleState: prop.trade.strategyRef.lifecycleState !== undefined ? prop.trade.strategyRef.lifecycleState : undefined,
          manifestHash: prop.trade.strategyRef.manifestHash !== undefined ? prop.trade.strategyRef.manifestHash : undefined,
          deletedAt: prop.trade.strategyRef.deletedAt !== undefined ? prop.trade.strategyRef.deletedAt : undefined,
      owner: prop.trade.strategyRef.owner ? 
        typeof prop.trade.strategyRef.owner === 'object' && Object.keys(prop.trade.strategyRef.owner).length === 1 && Object.keys(prop.trade.strategyRef.owner)[0] === 'id'
    ? { connect: {
            id: prop.trade.strategyRef.owner.id
            }
          }
    : { connectOrCreate: {
          where: {
            id: prop.trade.strategyRef.owner.id !== undefined ? prop.trade.strategyRef.owner.id : undefined,
            email: prop.trade.strategyRef.owner.email !== undefined ? prop.trade.strategyRef.owner.email : undefined,
            name: prop.trade.strategyRef.owner.name !== undefined ? {
                equals: prop.trade.strategyRef.owner.name 
               } : undefined,
          },
          create: {
            name: prop.trade.strategyRef.owner.name !== undefined ? prop.trade.strategyRef.owner.name : undefined,
            email: prop.trade.strategyRef.owner.email !== undefined ? prop.trade.strategyRef.owner.email : undefined,
            emailVerified: prop.trade.strategyRef.owner.emailVerified !== undefined ? prop.trade.strategyRef.owner.emailVerified : undefined,
            image: prop.trade.strategyRef.owner.image !== undefined ? prop.trade.strategyRef.owner.image : undefined,
            avatarUrl: prop.trade.strategyRef.owner.avatarUrl !== undefined ? prop.trade.strategyRef.owner.avatarUrl : undefined,
            onboardingComplete: prop.trade.strategyRef.owner.onboardingComplete !== undefined ? prop.trade.strategyRef.owner.onboardingComplete : undefined,
            signupCategory: prop.trade.strategyRef.owner.signupCategory !== undefined ? prop.trade.strategyRef.owner.signupCategory : undefined,
            deletedAt: prop.trade.strategyRef.owner.deletedAt !== undefined ? prop.trade.strategyRef.owner.deletedAt : undefined,
            role: prop.trade.strategyRef.owner.role !== undefined ? prop.trade.strategyRef.owner.role : undefined,
            bio: prop.trade.strategyRef.owner.bio !== undefined ? prop.trade.strategyRef.owner.bio : undefined,
            jobTitle: prop.trade.strategyRef.owner.jobTitle !== undefined ? prop.trade.strategyRef.owner.jobTitle : undefined,
            currentAccount: prop.trade.strategyRef.owner.currentAccount !== undefined ? prop.trade.strategyRef.owner.currentAccount : undefined,
            plan: prop.trade.strategyRef.owner.plan !== undefined ? prop.trade.strategyRef.owner.plan : undefined,
            openaiAPIKey: prop.trade.strategyRef.owner.openaiAPIKey !== undefined ? prop.trade.strategyRef.owner.openaiAPIKey : undefined,
            openaiModel: prop.trade.strategyRef.owner.openaiModel !== undefined ? prop.trade.strategyRef.owner.openaiModel : undefined,
          },
        }
      } : undefined,
      subscriptions: prop.trade.strategyRef.subscriptions ? 
        Array.isArray(prop.trade.strategyRef.subscriptions) && prop.trade.strategyRef.subscriptions.length > 0 &&  prop.trade.strategyRef.subscriptions.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
          connect:        prop.trade.strategyRef.subscriptions.map((item) => ({
             id: item.id
          }))
 }
 : { connectOrCreate: prop.trade.strategyRef.subscriptions.map((item) => ({
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
          mutation: UPDATE_MANY_ACTION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyAction) {
          return response.data.updateManyAction;
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
          logger.error("Non-retryable constraint violation in updateManyAction", {
            operation: 'updateManyAction',
            model: 'Action',
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
          logger.warn("Database connection error in updateManyAction, retrying...", {
            operation: 'updateManyAction',
            model: 'Action',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyAction',
            model: 'Action',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyAction',
            model: 'Action',
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
   * Delete a single Action record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted Action or null.
   */
  async delete(props: ActionType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<ActionType> {
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

        const DELETE_ONE_ACTION = gql`
          mutation deleteOneAction($where: ActionWhereUniqueInput!) {
            deleteOneAction(where: $where) {
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
          mutation: DELETE_ONE_ACTION,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneAction) {
          return response.data.deleteOneAction;
        } else {
          return null as unknown as ActionType;
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
          logger.error("Non-retryable constraint violation in deleteOneAction", {
            operation: 'deleteOneAction',
            model: 'Action',
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
          logger.warn("Database connection error in deleteOneAction, retrying...", {
            operation: 'deleteOneAction',
            model: 'Action',
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
            operation: 'deleteOneAction',
            model: 'Action',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneAction',
            model: 'Action',
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
   * Retrieve a single Action record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved Action or null.
   */
  async get(props: ActionType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<ActionType | null> {
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

        const GET_ACTION = gql`
          query getAction($where: ActionWhereUniqueInput!) {
            getAction(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  alpacaOrderId: props.alpacaOrderId !== undefined ? props.alpacaOrderId : undefined,
  tradeId: props.tradeId !== undefined ? {
    equals: props.tradeId 
  } : undefined,
  type: props.type !== undefined ? {
    equals: props.type 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_ACTION,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getAction ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No Action found') {
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
          logger.warn("Database connection error in getAction, retrying...", {
            operation: 'getAction',
            model: 'Action',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getAction',
            model: 'Action',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getAction',
            model: 'Action',
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
   * Retrieve all Actions records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of Action records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<ActionType[] | null> {
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

        const GET_ALL_ACTION = gql`
          query getAllAction {
            actions {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_ACTION,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.actions ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No Action found') {
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
          logger.warn("Database connection error in getAllAction, retrying...", {
            operation: 'getAllAction',
            model: 'Action',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllAction',
            model: 'Action',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllAction',
            model: 'Action',
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
   * Find multiple Action records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found Action records or null.
   */
  async findMany(props: ActionType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<ActionType[] | null> {
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

        const FIND_MANY_ACTION = gql`
          query findManyAction($where: ActionWhereInput!) {
            actions(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
  tradeId: props.tradeId !== undefined ? {
    equals: props.tradeId 
  } : undefined,
  type: props.type !== undefined ? {
    equals: props.type 
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
          throw new Error(`findManyAction requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_ACTION,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.actions) {
          return response.data.actions;
        } else {
          return [] as ActionType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No Action found') {
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
          logger.warn("Database connection error in findManyAction, retrying...", {
            operation: 'findManyAction',
            model: 'Action',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyAction',
            model: 'Action',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyAction',
            model: 'Action',
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

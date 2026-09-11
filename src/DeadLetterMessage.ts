
  
import { DeadLetterMessage as DeadLetterMessageType } from './generated/typegraphql-prisma/models/DeadLetterMessage';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
  
  /**
   * CRUD operations for the DeadLetterMessage model.
   */

  const selectionSet = `
    
  id
  timestamp
  accountId
  ticker
  action
  quantity
  strikePrice
  expirationDate
  optionType
  strategy
  orderType
  limitPrice
  errorMessage
  errorCode
  errorStack
  retryCount
  maxRetries
  lastRetryAt
  nextRetryAt
  backoffMs
  status
  resolvedAt
  resolvedBy
  resolution
  tradeContext
  accountState
  marketContext
  validationErrors
  failureCategory
  severity
  tags
  createdBy
  updatedAt
  notes

  `;

  export const DeadLetterMessage = {

    /**
     * Create a new DeadLetterMessage record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created DeadLetterMessage or null.
     */

    /**
     * Create a new DeadLetterMessage record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created DeadLetterMessage or null.
     */
    async create(props: DeadLetterMessageType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<DeadLetterMessageType> {
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

          const CREATE_ONE_DEADLETTERMESSAGE = gql`
              mutation createOneDeadLetterMessage($data: DeadLetterMessageCreateInput!) {
                createOneDeadLetterMessage(data: $data) {
                  ${selectionSet}
                }
              }
           `;

          const variables = {
            data: {
                timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  accountId: props.accountId !== undefined ? props.accountId : undefined,
  ticker: props.ticker !== undefined ? props.ticker : undefined,
  action: props.action !== undefined ? props.action : undefined,
  quantity: props.quantity !== undefined ? props.quantity : undefined,
  strikePrice: props.strikePrice !== undefined ? props.strikePrice : undefined,
  expirationDate: props.expirationDate !== undefined ? props.expirationDate : undefined,
  optionType: props.optionType !== undefined ? props.optionType : undefined,
  strategy: props.strategy !== undefined ? props.strategy : undefined,
  orderType: props.orderType !== undefined ? props.orderType : undefined,
  limitPrice: props.limitPrice !== undefined ? props.limitPrice : undefined,
  errorMessage: props.errorMessage !== undefined ? props.errorMessage : undefined,
  errorCode: props.errorCode !== undefined ? props.errorCode : undefined,
  errorStack: props.errorStack !== undefined ? props.errorStack : undefined,
  retryCount: props.retryCount !== undefined ? props.retryCount : undefined,
  maxRetries: props.maxRetries !== undefined ? props.maxRetries : undefined,
  lastRetryAt: props.lastRetryAt !== undefined ? props.lastRetryAt : undefined,
  nextRetryAt: props.nextRetryAt !== undefined ? props.nextRetryAt : undefined,
  backoffMs: props.backoffMs !== undefined ? props.backoffMs : undefined,
  status: props.status !== undefined ? props.status : undefined,
  resolvedAt: props.resolvedAt !== undefined ? props.resolvedAt : undefined,
  resolvedBy: props.resolvedBy !== undefined ? props.resolvedBy : undefined,
  resolution: props.resolution !== undefined ? props.resolution : undefined,
  tradeContext: props.tradeContext !== undefined ? props.tradeContext : undefined,
  accountState: props.accountState !== undefined ? props.accountState : undefined,
  marketContext: props.marketContext !== undefined ? props.marketContext : undefined,
  validationErrors: props.validationErrors !== undefined ? props.validationErrors : undefined,
  failureCategory: props.failureCategory !== undefined ? props.failureCategory : undefined,
  severity: props.severity !== undefined ? props.severity : undefined,
  tags: props.tags !== undefined ? props.tags : undefined,
  createdBy: props.createdBy !== undefined ? props.createdBy : undefined,
  notes: props.notes !== undefined ? props.notes : undefined,

            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_DEADLETTERMESSAGE,
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOneDeadLetterMessage) {
            return response.data.createOneDeadLetterMessage;
          } else {
            return null as unknown as DeadLetterMessageType;
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
            logger.error("Non-retryable constraint violation in createOneDeadLetterMessage", {
              operation: 'createOneDeadLetterMessage',
              model: 'DeadLetterMessage',
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
            logger.warn("Database connection error in createOneDeadLetterMessage, retrying...", {
              operation: 'createOneDeadLetterMessage',
              model: 'DeadLetterMessage',
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
              operation: 'createOneDeadLetterMessage',
              model: 'DeadLetterMessage',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOneDeadLetterMessage',
              model: 'DeadLetterMessage',
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
   * Create multiple DeadLetterMessage records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of DeadLetterMessage objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: DeadLetterMessageType[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
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

        const CREATE_MANY_DEADLETTERMESSAGE = gql`
          mutation createManyDeadLetterMessage($data: [DeadLetterMessageCreateManyInput!]!, $skipDuplicates: Boolean) {
            createManyDeadLetterMessage(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }`;

        const variables = {
          data: props.map(prop => ({
      timestamp: prop.timestamp !== undefined ? prop.timestamp : undefined,
  accountId: prop.accountId !== undefined ? prop.accountId : undefined,
  ticker: prop.ticker !== undefined ? prop.ticker : undefined,
  action: prop.action !== undefined ? prop.action : undefined,
  quantity: prop.quantity !== undefined ? prop.quantity : undefined,
  strikePrice: prop.strikePrice !== undefined ? prop.strikePrice : undefined,
  expirationDate: prop.expirationDate !== undefined ? prop.expirationDate : undefined,
  optionType: prop.optionType !== undefined ? prop.optionType : undefined,
  strategy: prop.strategy !== undefined ? prop.strategy : undefined,
  orderType: prop.orderType !== undefined ? prop.orderType : undefined,
  limitPrice: prop.limitPrice !== undefined ? prop.limitPrice : undefined,
  errorMessage: prop.errorMessage !== undefined ? prop.errorMessage : undefined,
  errorCode: prop.errorCode !== undefined ? prop.errorCode : undefined,
  errorStack: prop.errorStack !== undefined ? prop.errorStack : undefined,
  retryCount: prop.retryCount !== undefined ? prop.retryCount : undefined,
  maxRetries: prop.maxRetries !== undefined ? prop.maxRetries : undefined,
  lastRetryAt: prop.lastRetryAt !== undefined ? prop.lastRetryAt : undefined,
  nextRetryAt: prop.nextRetryAt !== undefined ? prop.nextRetryAt : undefined,
  backoffMs: prop.backoffMs !== undefined ? prop.backoffMs : undefined,
  status: prop.status !== undefined ? prop.status : undefined,
  resolvedAt: prop.resolvedAt !== undefined ? prop.resolvedAt : undefined,
  resolvedBy: prop.resolvedBy !== undefined ? prop.resolvedBy : undefined,
  resolution: prop.resolution !== undefined ? prop.resolution : undefined,
  tradeContext: prop.tradeContext !== undefined ? prop.tradeContext : undefined,
  accountState: prop.accountState !== undefined ? prop.accountState : undefined,
  marketContext: prop.marketContext !== undefined ? prop.marketContext : undefined,
  validationErrors: prop.validationErrors !== undefined ? prop.validationErrors : undefined,
  failureCategory: prop.failureCategory !== undefined ? prop.failureCategory : undefined,
  severity: prop.severity !== undefined ? prop.severity : undefined,
  tags: prop.tags !== undefined ? prop.tags : undefined,
  createdBy: prop.createdBy !== undefined ? prop.createdBy : undefined,
  notes: prop.notes !== undefined ? prop.notes : undefined,
      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_DEADLETTERMESSAGE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createManyDeadLetterMessage) {
          return response.data.createManyDeadLetterMessage;
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
          logger.warn("Duplicate key in createManyDeadLetterMessage (expected during overlapping fetches)", {
            operation: 'createManyDeadLetterMessage',
            model: 'DeadLetterMessage',
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
          logger.warn("Database connection error in createManyDeadLetterMessage, retrying...", {
            operation: 'createManyDeadLetterMessage',
            model: 'DeadLetterMessage',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createManyDeadLetterMessage',
            model: 'DeadLetterMessage',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createManyDeadLetterMessage',
            model: 'DeadLetterMessage',
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
   * Update a single DeadLetterMessage record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated DeadLetterMessage or null.
   */
  async update(props: DeadLetterMessageType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<DeadLetterMessageType> {
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

        const UPDATE_ONE_DEADLETTERMESSAGE = gql`
          mutation updateOneDeadLetterMessage($data: DeadLetterMessageUpdateInput!, $where: DeadLetterMessageWhereUniqueInput!) {
            updateOneDeadLetterMessage(data: $data, where: $where) {
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
  timestamp: props.timestamp !== undefined ? {
            set: props.timestamp 
           } : undefined,
  accountId: props.accountId !== undefined ? {
            set: props.accountId 
           } : undefined,
  ticker: props.ticker !== undefined ? {
            set: props.ticker 
           } : undefined,
  action: props.action !== undefined ? {
            set: props.action 
           } : undefined,
  quantity: props.quantity !== undefined ? {
            set: props.quantity 
           } : undefined,
  strikePrice: props.strikePrice !== undefined ? {
            set: props.strikePrice 
           } : undefined,
  expirationDate: props.expirationDate !== undefined ? {
            set: props.expirationDate 
           } : undefined,
  optionType: props.optionType !== undefined ? {
            set: props.optionType 
           } : undefined,
  strategy: props.strategy !== undefined ? {
            set: props.strategy 
           } : undefined,
  orderType: props.orderType !== undefined ? {
            set: props.orderType 
           } : undefined,
  limitPrice: props.limitPrice !== undefined ? {
            set: props.limitPrice 
           } : undefined,
  errorMessage: props.errorMessage !== undefined ? {
            set: props.errorMessage 
           } : undefined,
  errorCode: props.errorCode !== undefined ? {
            set: props.errorCode 
           } : undefined,
  errorStack: props.errorStack !== undefined ? {
            set: props.errorStack 
           } : undefined,
  retryCount: props.retryCount !== undefined ? {
            set: props.retryCount 
           } : undefined,
  maxRetries: props.maxRetries !== undefined ? {
            set: props.maxRetries 
           } : undefined,
  lastRetryAt: props.lastRetryAt !== undefined ? {
            set: props.lastRetryAt 
           } : undefined,
  nextRetryAt: props.nextRetryAt !== undefined ? {
            set: props.nextRetryAt 
           } : undefined,
  backoffMs: props.backoffMs !== undefined ? {
            set: props.backoffMs 
           } : undefined,
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
  resolvedAt: props.resolvedAt !== undefined ? {
            set: props.resolvedAt 
           } : undefined,
  resolvedBy: props.resolvedBy !== undefined ? {
            set: props.resolvedBy 
           } : undefined,
  resolution: props.resolution !== undefined ? {
            set: props.resolution 
           } : undefined,
  tradeContext: props.tradeContext !== undefined ? props.tradeContext : undefined,
  accountState: props.accountState !== undefined ? props.accountState : undefined,
  marketContext: props.marketContext !== undefined ? props.marketContext : undefined,
  validationErrors: props.validationErrors !== undefined ? props.validationErrors : undefined,
  failureCategory: props.failureCategory !== undefined ? {
            set: props.failureCategory 
           } : undefined,
  severity: props.severity !== undefined ? {
            set: props.severity 
           } : undefined,
  tags: props.tags !== undefined ? props.tags : undefined,
  createdBy: props.createdBy !== undefined ? {
            set: props.createdBy 
           } : undefined,
  updatedAt: props.updatedAt !== undefined ? {
            set: props.updatedAt 
           } : undefined,
  notes: props.notes !== undefined ? {
            set: props.notes 
           } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_DEADLETTERMESSAGE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOneDeadLetterMessage) {
          return response.data.updateOneDeadLetterMessage;
        } else {
          return null as unknown as DeadLetterMessageType;
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
          logger.error("Non-retryable constraint violation in updateOneDeadLetterMessage", {
            operation: 'updateOneDeadLetterMessage',
            model: 'DeadLetterMessage',
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
          logger.warn("Database connection error in updateOneDeadLetterMessage, retrying...", {
            operation: 'updateOneDeadLetterMessage',
            model: 'DeadLetterMessage',
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
            operation: 'updateOneDeadLetterMessage',
            model: 'DeadLetterMessage',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOneDeadLetterMessage',
            model: 'DeadLetterMessage',
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
   * Upsert a single DeadLetterMessage record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated DeadLetterMessage or null.
   */
  async upsert(props: DeadLetterMessageType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<DeadLetterMessageType> {
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

        const UPSERT_ONE_DEADLETTERMESSAGE = gql`
          mutation upsertOneDeadLetterMessage($where: DeadLetterMessageWhereUniqueInput!, $create: DeadLetterMessageCreateInput!, $update: DeadLetterMessageUpdateInput!) {
            upsertOneDeadLetterMessage(where: $where, create: $create, update: $update) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: {
            id: props.id !== undefined ? props.id : undefined,
  accountId: props.accountId !== undefined ? {
    equals: props.accountId 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
      },
          create: {
        timestamp: props.timestamp !== undefined ? props.timestamp : undefined,
  accountId: props.accountId !== undefined ? props.accountId : undefined,
  ticker: props.ticker !== undefined ? props.ticker : undefined,
  action: props.action !== undefined ? props.action : undefined,
  quantity: props.quantity !== undefined ? props.quantity : undefined,
  strikePrice: props.strikePrice !== undefined ? props.strikePrice : undefined,
  expirationDate: props.expirationDate !== undefined ? props.expirationDate : undefined,
  optionType: props.optionType !== undefined ? props.optionType : undefined,
  strategy: props.strategy !== undefined ? props.strategy : undefined,
  orderType: props.orderType !== undefined ? props.orderType : undefined,
  limitPrice: props.limitPrice !== undefined ? props.limitPrice : undefined,
  errorMessage: props.errorMessage !== undefined ? props.errorMessage : undefined,
  errorCode: props.errorCode !== undefined ? props.errorCode : undefined,
  errorStack: props.errorStack !== undefined ? props.errorStack : undefined,
  retryCount: props.retryCount !== undefined ? props.retryCount : undefined,
  maxRetries: props.maxRetries !== undefined ? props.maxRetries : undefined,
  lastRetryAt: props.lastRetryAt !== undefined ? props.lastRetryAt : undefined,
  nextRetryAt: props.nextRetryAt !== undefined ? props.nextRetryAt : undefined,
  backoffMs: props.backoffMs !== undefined ? props.backoffMs : undefined,
  status: props.status !== undefined ? props.status : undefined,
  resolvedAt: props.resolvedAt !== undefined ? props.resolvedAt : undefined,
  resolvedBy: props.resolvedBy !== undefined ? props.resolvedBy : undefined,
  resolution: props.resolution !== undefined ? props.resolution : undefined,
  tradeContext: props.tradeContext !== undefined ? props.tradeContext : undefined,
  accountState: props.accountState !== undefined ? props.accountState : undefined,
  marketContext: props.marketContext !== undefined ? props.marketContext : undefined,
  validationErrors: props.validationErrors !== undefined ? props.validationErrors : undefined,
  failureCategory: props.failureCategory !== undefined ? props.failureCategory : undefined,
  severity: props.severity !== undefined ? props.severity : undefined,
  tags: props.tags !== undefined ? props.tags : undefined,
  createdBy: props.createdBy !== undefined ? props.createdBy : undefined,
  notes: props.notes !== undefined ? props.notes : undefined,
      },
          update: {
      timestamp: props.timestamp !== undefined ? {
            set: props.timestamp 
           } : undefined,
  accountId: props.accountId !== undefined ? {
            set: props.accountId 
           } : undefined,
  ticker: props.ticker !== undefined ? {
            set: props.ticker 
           } : undefined,
  action: props.action !== undefined ? {
            set: props.action 
           } : undefined,
  quantity: props.quantity !== undefined ? {
            set: props.quantity 
           } : undefined,
  strikePrice: props.strikePrice !== undefined ? {
            set: props.strikePrice 
           } : undefined,
  expirationDate: props.expirationDate !== undefined ? {
            set: props.expirationDate 
           } : undefined,
  optionType: props.optionType !== undefined ? {
            set: props.optionType 
           } : undefined,
  strategy: props.strategy !== undefined ? {
            set: props.strategy 
           } : undefined,
  orderType: props.orderType !== undefined ? {
            set: props.orderType 
           } : undefined,
  limitPrice: props.limitPrice !== undefined ? {
            set: props.limitPrice 
           } : undefined,
  errorMessage: props.errorMessage !== undefined ? {
            set: props.errorMessage 
           } : undefined,
  errorCode: props.errorCode !== undefined ? {
            set: props.errorCode 
           } : undefined,
  errorStack: props.errorStack !== undefined ? {
            set: props.errorStack 
           } : undefined,
  retryCount: props.retryCount !== undefined ? {
            set: props.retryCount 
           } : undefined,
  maxRetries: props.maxRetries !== undefined ? {
            set: props.maxRetries 
           } : undefined,
  lastRetryAt: props.lastRetryAt !== undefined ? {
            set: props.lastRetryAt 
           } : undefined,
  nextRetryAt: props.nextRetryAt !== undefined ? {
            set: props.nextRetryAt 
           } : undefined,
  backoffMs: props.backoffMs !== undefined ? {
            set: props.backoffMs 
           } : undefined,
  status: props.status !== undefined ? {
            set: props.status 
           } : undefined,
  resolvedAt: props.resolvedAt !== undefined ? {
            set: props.resolvedAt 
           } : undefined,
  resolvedBy: props.resolvedBy !== undefined ? {
            set: props.resolvedBy 
           } : undefined,
  resolution: props.resolution !== undefined ? {
            set: props.resolution 
           } : undefined,
  tradeContext: props.tradeContext !== undefined ? props.tradeContext : undefined,
  accountState: props.accountState !== undefined ? props.accountState : undefined,
  marketContext: props.marketContext !== undefined ? props.marketContext : undefined,
  validationErrors: props.validationErrors !== undefined ? props.validationErrors : undefined,
  failureCategory: props.failureCategory !== undefined ? {
            set: props.failureCategory 
           } : undefined,
  severity: props.severity !== undefined ? {
            set: props.severity 
           } : undefined,
  tags: props.tags !== undefined ? props.tags : undefined,
  createdBy: props.createdBy !== undefined ? {
            set: props.createdBy 
           } : undefined,
  notes: props.notes !== undefined ? {
            set: props.notes 
           } : undefined,
      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_DEADLETTERMESSAGE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOneDeadLetterMessage) {
          return response.data.upsertOneDeadLetterMessage;
        } else {
          return null as unknown as DeadLetterMessageType;
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
          logger.error("Non-retryable constraint violation in upsertOneDeadLetterMessage", {
            operation: 'upsertOneDeadLetterMessage',
            model: 'DeadLetterMessage',
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
          logger.warn("Database connection error in upsertOneDeadLetterMessage, retrying...", {
            operation: 'upsertOneDeadLetterMessage',
            model: 'DeadLetterMessage',
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
            operation: 'upsertOneDeadLetterMessage',
            model: 'DeadLetterMessage',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOneDeadLetterMessage',
            model: 'DeadLetterMessage',
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
   * Update multiple DeadLetterMessage records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of DeadLetterMessage objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: DeadLetterMessageType[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
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

        const UPDATE_MANY_DEADLETTERMESSAGE = gql`
          mutation updateManyDeadLetterMessage($data: [DeadLetterMessageCreateManyInput!]!) {
            updateManyDeadLetterMessage(data: $data) {
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
  timestamp: prop.timestamp !== undefined ? {
            set: prop.timestamp 
           } : undefined,
  accountId: prop.accountId !== undefined ? {
            set: prop.accountId 
           } : undefined,
  ticker: prop.ticker !== undefined ? {
            set: prop.ticker 
           } : undefined,
  action: prop.action !== undefined ? {
            set: prop.action 
           } : undefined,
  quantity: prop.quantity !== undefined ? {
            set: prop.quantity 
           } : undefined,
  strikePrice: prop.strikePrice !== undefined ? {
            set: prop.strikePrice 
           } : undefined,
  expirationDate: prop.expirationDate !== undefined ? {
            set: prop.expirationDate 
           } : undefined,
  optionType: prop.optionType !== undefined ? {
            set: prop.optionType 
           } : undefined,
  strategy: prop.strategy !== undefined ? {
            set: prop.strategy 
           } : undefined,
  orderType: prop.orderType !== undefined ? {
            set: prop.orderType 
           } : undefined,
  limitPrice: prop.limitPrice !== undefined ? {
            set: prop.limitPrice 
           } : undefined,
  errorMessage: prop.errorMessage !== undefined ? {
            set: prop.errorMessage 
           } : undefined,
  errorCode: prop.errorCode !== undefined ? {
            set: prop.errorCode 
           } : undefined,
  errorStack: prop.errorStack !== undefined ? {
            set: prop.errorStack 
           } : undefined,
  retryCount: prop.retryCount !== undefined ? {
            set: prop.retryCount 
           } : undefined,
  maxRetries: prop.maxRetries !== undefined ? {
            set: prop.maxRetries 
           } : undefined,
  lastRetryAt: prop.lastRetryAt !== undefined ? {
            set: prop.lastRetryAt 
           } : undefined,
  nextRetryAt: prop.nextRetryAt !== undefined ? {
            set: prop.nextRetryAt 
           } : undefined,
  backoffMs: prop.backoffMs !== undefined ? {
            set: prop.backoffMs 
           } : undefined,
  status: prop.status !== undefined ? {
            set: prop.status 
           } : undefined,
  resolvedAt: prop.resolvedAt !== undefined ? {
            set: prop.resolvedAt 
           } : undefined,
  resolvedBy: prop.resolvedBy !== undefined ? {
            set: prop.resolvedBy 
           } : undefined,
  resolution: prop.resolution !== undefined ? {
            set: prop.resolution 
           } : undefined,
  tradeContext: prop.tradeContext !== undefined ? prop.tradeContext : undefined,
  accountState: prop.accountState !== undefined ? prop.accountState : undefined,
  marketContext: prop.marketContext !== undefined ? prop.marketContext : undefined,
  validationErrors: prop.validationErrors !== undefined ? prop.validationErrors : undefined,
  failureCategory: prop.failureCategory !== undefined ? {
            set: prop.failureCategory 
           } : undefined,
  severity: prop.severity !== undefined ? {
            set: prop.severity 
           } : undefined,
  tags: prop.tags !== undefined ? prop.tags : undefined,
  createdBy: prop.createdBy !== undefined ? {
            set: prop.createdBy 
           } : undefined,
  updatedAt: prop.updatedAt !== undefined ? {
            set: prop.updatedAt 
           } : undefined,
  notes: prop.notes !== undefined ? {
            set: prop.notes 
           } : undefined,

          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_DEADLETTERMESSAGE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateManyDeadLetterMessage) {
          return response.data.updateManyDeadLetterMessage;
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
          logger.error("Non-retryable constraint violation in updateManyDeadLetterMessage", {
            operation: 'updateManyDeadLetterMessage',
            model: 'DeadLetterMessage',
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
          logger.warn("Database connection error in updateManyDeadLetterMessage, retrying...", {
            operation: 'updateManyDeadLetterMessage',
            model: 'DeadLetterMessage',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateManyDeadLetterMessage',
            model: 'DeadLetterMessage',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateManyDeadLetterMessage',
            model: 'DeadLetterMessage',
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
   * Delete a single DeadLetterMessage record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted DeadLetterMessage or null.
   */
  async delete(props: DeadLetterMessageType, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<DeadLetterMessageType> {
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

        const DELETE_ONE_DEADLETTERMESSAGE = gql`
          mutation deleteOneDeadLetterMessage($where: DeadLetterMessageWhereUniqueInput!) {
            deleteOneDeadLetterMessage(where: $where) {
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
          mutation: DELETE_ONE_DEADLETTERMESSAGE,
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOneDeadLetterMessage) {
          return response.data.deleteOneDeadLetterMessage;
        } else {
          return null as unknown as DeadLetterMessageType;
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
          logger.error("Non-retryable constraint violation in deleteOneDeadLetterMessage", {
            operation: 'deleteOneDeadLetterMessage',
            model: 'DeadLetterMessage',
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
          logger.warn("Database connection error in deleteOneDeadLetterMessage, retrying...", {
            operation: 'deleteOneDeadLetterMessage',
            model: 'DeadLetterMessage',
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
            operation: 'deleteOneDeadLetterMessage',
            model: 'DeadLetterMessage',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOneDeadLetterMessage',
            model: 'DeadLetterMessage',
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
   * Retrieve a single DeadLetterMessage record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved DeadLetterMessage or null.
   */
  async get(props: DeadLetterMessageType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<DeadLetterMessageType | null> {
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

        const GET_DEADLETTERMESSAGE = gql`
          query getDeadLetterMessage($where: DeadLetterMessageWhereUniqueInput!) {
            getDeadLetterMessage(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
            id: props.id !== undefined ? props.id : undefined,
  accountId: props.accountId !== undefined ? {
    equals: props.accountId 
  } : undefined,
  status: props.status !== undefined ? {
    equals: props.status 
  } : undefined,
},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_DEADLETTERMESSAGE,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.getDeadLetterMessage ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No DeadLetterMessage found') {
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
          logger.warn("Database connection error in getDeadLetterMessage, retrying...", {
            operation: 'getDeadLetterMessage',
            model: 'DeadLetterMessage',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'getDeadLetterMessage',
            model: 'DeadLetterMessage',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'getDeadLetterMessage',
            model: 'DeadLetterMessage',
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
   * Retrieve all DeadLetterMessages records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of DeadLetterMessage records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<DeadLetterMessageType[] | null> {
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

        const GET_ALL_DEADLETTERMESSAGE = gql`
          query getAllDeadLetterMessage {
            deadLetterMessages {
              ${selectionSet}
            }
          }`;

        const response = await client.query({
          query: GET_ALL_DEADLETTERMESSAGE,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.deadLetterMessages ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No DeadLetterMessage found') {
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
          logger.warn("Database connection error in getAllDeadLetterMessage, retrying...", {
            operation: 'getAllDeadLetterMessage',
            model: 'DeadLetterMessage',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAllDeadLetterMessage',
            model: 'DeadLetterMessage',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAllDeadLetterMessage',
            model: 'DeadLetterMessage',
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
   * Find multiple DeadLetterMessage records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found DeadLetterMessage records or null.
   */
  async findMany(props: DeadLetterMessageType, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<DeadLetterMessageType[] | null> {
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

        const FIND_MANY_DEADLETTERMESSAGE = gql`
          query findManyDeadLetterMessage($where: DeadLetterMessageWhereInput!) {
            deadLetterMessages(where: $where) {
              ${selectionSet}
            }
          }`;

        const variables = {
          where: whereInput ? whereInput : {
      id: props.id !== undefined ? {
    equals: props.id 
  } : undefined,
  accountId: props.accountId !== undefined ? {
    equals: props.accountId 
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
          throw new Error(`findManyDeadLetterMessage requires at least one filter criterion. Received empty where clause.`);
        }

        const response = await client.query({
          query: FIND_MANY_DEADLETTERMESSAGE,
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deadLetterMessages) {
          return response.data.deadLetterMessages;
        } else {
          return [] as DeadLetterMessageType[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No DeadLetterMessage found') {
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
          logger.warn("Database connection error in findManyDeadLetterMessage, retrying...", {
            operation: 'findManyDeadLetterMessage',
            model: 'DeadLetterMessage',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findManyDeadLetterMessage',
            model: 'DeadLetterMessage',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findManyDeadLetterMessage',
            model: 'DeadLetterMessage',
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

/**
 * The audit plugin inside a real Apollo request pipeline: what it stores for
 * each mutation field an operation executes.
 *
 * The schema mirrors the generated input types the documents below touch
 * (same type and field names as the served schema), so the platform's broker
 * credential writers (`platform/apps/web/app/api/broker-credentials/
 * credential-store.ts`) run here as written. Their stored credentials must be
 * redacted because the row records each argument under its schema path, not
 * because the calling operation happens to name its variables after the
 * credential columns.
 */
import { ApolloServer, type ApolloServerPlugin } from '@apollo/server';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';

import { REDACTED, redactCredentials } from '../../auth/credential-redaction';
import { createAuditLogPlugin } from '../audit-logger';

/** The request context the plugin reads. */
type AuditContext =
  ReturnType<typeof createAuditLogPlugin> extends ApolloServerPlugin<infer Context> ? Context : never;

// Obviously fake values: a stored row must never contain either.
const FAKE_KEY = 'PKFAKEAUDITARGUMENTKEY00';
const FAKE_SECRET = 'fake-audit-argument-secret-never-stored';

const CONFIGURATION = {
  brokerAccountId: 'broker-acct-9',
  credentialsUpdatedAt: '2026-09-25T00:00:00.000Z',
};

const TYPE_DEFS = `#graphql
  scalar JSON

  enum BrokerageProvider { ALPACA IBKR COINBASE }
  enum BrokerageAccountType { PAPER LIVE }
  enum AlertSeverity { LOW MEDIUM HIGH CRITICAL }

  input StringFilter { equals: String, in: [String!] }
  input NullableStringFieldUpdateOperationsInput { set: String }
  input StringFieldUpdateOperationsInput { set: String }
  input BoolFieldUpdateOperationsInput { set: Boolean }
  input EnumBrokerageProviderFilter { equals: BrokerageProvider }
  input DateTimeNullableFilter { equals: String }
  input EnumBrokerageAccountTypeFieldUpdateOperationsInput { set: BrokerageAccountType }

  input FundWhereUniqueInput { id: String }
  input FundCreateNestedOneWithoutBrokerageAccountsInput { connect: FundWhereUniqueInput }

  input BrokerageAccountCreateInput {
    id: String
    provider: BrokerageProvider
    type: BrokerageAccountType
    label: String
    apiKey: String
    apiSecret: String
    configuration: JSON
    fund: FundCreateNestedOneWithoutBrokerageAccountsInput!
  }
  input BrokerageAccountUpdateInput {
    type: EnumBrokerageAccountTypeFieldUpdateOperationsInput
    label: NullableStringFieldUpdateOperationsInput
    apiKey: NullableStringFieldUpdateOperationsInput
    apiSecret: NullableStringFieldUpdateOperationsInput
    configuration: JSON
  }
  input BrokerageAccountUpdateManyMutationInput {
    apiKey: NullableStringFieldUpdateOperationsInput
    apiSecret: NullableStringFieldUpdateOperationsInput
  }
  input BrokerageAccountWhereUniqueInput { id: String }
  input BrokerageAccountWhereInput {
    fundId: StringFilter
    provider: EnumBrokerageProviderFilter
    deletedAt: DateTimeNullableFilter
  }

  input AlpacaAccountCreateWithoutUserInput { APIKey: String!, APISecret: String! }
  input AlpacaAccountCreateNestedManyWithoutUserInput { create: [AlpacaAccountCreateWithoutUserInput!] }
  input UserCreateInput {
    name: String
    openaiAPIKey: String
    alpacaAccounts: AlpacaAccountCreateNestedManyWithoutUserInput
  }

  input AlpacaAccountWhereUniqueInput { id: String }
  input AlpacaAccountCreateNestedOneWithoutAlertsInput { connect: AlpacaAccountWhereUniqueInput }
  input AlertCreateInput {
    title: String
    message: String!
    severity: AlertSeverity
    isRead: Boolean
    alpacaAccount: AlpacaAccountCreateNestedOneWithoutAlertsInput!
  }
  input AlertCreateManyInput { message: String!, alpacaAccountId: String! }
  input AlertUpdateInput {
    message: StringFieldUpdateOperationsInput
    isRead: BoolFieldUpdateOperationsInput
  }
  input AlertWhereUniqueInput { id: String }

  type BrokerageAccount { id: String!, updatedAt: String }
  type User { id: String! }
  type Alert { id: String! }
  type AffectedRowsOutput { count: Int! }

  type Query { alert(where: AlertWhereUniqueInput!): Alert }

  type Mutation {
    createOneBrokerageAccount(data: BrokerageAccountCreateInput!): BrokerageAccount!
    updateOneBrokerageAccount(
      data: BrokerageAccountUpdateInput!
      where: BrokerageAccountWhereUniqueInput!
    ): BrokerageAccount
    updateManyBrokerageAccount(
      data: BrokerageAccountUpdateManyMutationInput!
      where: BrokerageAccountWhereInput
    ): AffectedRowsOutput!
    createOneUser(data: UserCreateInput!): User!
    createOneAlert(data: AlertCreateInput!): Alert!
    createManyAlert(data: [AlertCreateManyInput!]!, skipDuplicates: Boolean): AffectedRowsOutput!
    updateOneAlert(data: AlertUpdateInput!, where: AlertWhereUniqueInput!): Alert
    deleteOneAlert(where: AlertWhereUniqueInput!): Alert
    upsertOneAlert(
      where: AlertWhereUniqueInput!
      create: AlertCreateInput!
      update: AlertUpdateInput!
    ): Alert!
  }
`;

interface WhereArgs {
  where?: { id?: string };
}

/** Each resolver returns a row whose id says which field produced it. */
const RESOLVERS = {
  Mutation: {
    createOneBrokerageAccount: (): { id: string; updatedAt: string } => ({
      id: 'ba-created',
      updatedAt: '2026-09-25T00:00:00.000Z',
    }),
    updateOneBrokerageAccount: (_: unknown, args: WhereArgs): { id: string } => ({
      id: args.where?.id ?? 'ba-updated',
    }),
    updateManyBrokerageAccount: (): { count: number } => ({ count: 1 }),
    createOneUser: (): { id: string } => ({ id: 'user-created' }),
    createOneAlert: (): { id: string } => ({ id: 'alert-created' }),
    createManyAlert: (): { count: number } => ({ count: 2 }),
    updateOneAlert: (_: unknown, args: WhereArgs): { id: string } => ({
      id: args.where?.id ?? 'alert-updated',
    }),
    deleteOneAlert: (_: unknown, args: WhereArgs): { id: string } => ({
      id: args.where?.id ?? 'alert-deleted',
    }),
    upsertOneAlert: (): { id: string } => ({ id: 'alert-upserted' }),
  },
};

type StoredRow = Record<string, unknown> & { changedFields: Record<string, unknown> };

let server: ApolloServer<AuditContext>;

beforeAll(async () => {
  server = new ApolloServer<AuditContext>({
    typeDefs: TYPE_DEFS,
    resolvers: RESOLVERS,
    plugins: [createAuditLogPlugin()],
  });
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

/** Run one request through the pipeline and return the audit rows it wrote. */
async function audit(
  query: string,
  variables?: Record<string, unknown>,
  operationName?: string
): Promise<StoredRow[]> {
  const rows: StoredRow[] = [];
  // The plugin calls exactly one Prisma method, `auditLog.create`.
  const prisma = {
    auditLog: {
      create: async ({ data }: { data: StoredRow }): Promise<StoredRow> => {
        rows.push(data);
        return data;
      },
    },
  } as unknown as AuditContext['prisma'];
  const response = await server.executeOperation(
    { query, variables, operationName },
    { contextValue: { prisma, user: null, principal: { kind: 'server', sub: 'audit-test' } } }
  );
  if (response.body.kind !== 'single') throw new Error('expected a single result');
  expect(response.body.singleResult.errors).toBeUndefined();
  return rows;
}

/** The platform's create document, verbatim apart from its variable names. */
function brokerCredentialCreate(keyVariable: string, secretVariable: string): string {
  return `
    mutation BrokerCredentialCreate(
      $fundId: String!
      $provider: BrokerageProvider!
      $type: BrokerageAccountType!
      $${keyVariable}: String!
      $${secretVariable}: String!
      $label: String
      $configuration: JSON
    ) {
      createOneBrokerageAccount(
        data: {
          provider: $provider
          type: $type
          apiKey: $${keyVariable}
          apiSecret: $${secretVariable}
          label: $label
          configuration: $configuration
          fund: { connect: { id: $fundId } }
        }
      ) {
        id
        updatedAt
      }
    }
  `;
}

const BROKER_CREDENTIAL_UPDATE = `
  mutation BrokerCredentialUpdate(
    $id: String!
    $apiKey: String!
    $apiSecret: String!
    $type: BrokerageAccountType!
    $configuration: JSON
  ) {
    updateOneBrokerageAccount(
      where: { id: $id }
      data: {
        apiKey: { set: $apiKey }
        apiSecret: { set: $apiSecret }
        type: { set: $type }
        configuration: $configuration
      }
    ) {
      id
      updatedAt
    }
  }
`;

const BROKER_CREDENTIAL_CLEAR = `
  mutation BrokerCredentialClear($fundIds: [String!]!, $provider: BrokerageProvider!) {
    updateManyBrokerageAccount(
      where: {
        fundId: { in: $fundIds }
        provider: { equals: $provider }
        deletedAt: { equals: null }
      }
      data: { apiKey: { set: null }, apiSecret: { set: null } }
    ) {
      count
    }
  }
`;

function expectNoCredentialValue(rows: StoredRow[]): void {
  const stored = JSON.stringify(rows);
  expect(stored).not.toContain(FAKE_KEY);
  expect(stored).not.toContain(FAKE_SECRET);
}

describe('audit rows record each argument under its schema path', () => {
  it('stores neither value when BrokerCredentialCreate names its variables $key / $secret', async () => {
    const rows = await audit(brokerCredentialCreate('key', 'secret'), {
      fundId: 'fund-1',
      provider: 'ALPACA',
      type: 'PAPER',
      key: FAKE_KEY,
      secret: FAKE_SECRET,
      label: null,
      configuration: CONFIGURATION,
    });

    expect(rows).toHaveLength(1);
    expectNoCredentialValue(rows);
    expect(rows[0]).toMatchObject({
      operationType: 'CREATE',
      modelName: 'BrokerageAccount',
      recordId: 'ba-created',
    });
    expect(rows[0].changedFields).toEqual({
      input: {
        provider: 'ALPACA',
        type: 'PAPER',
        apiKey: REDACTED,
        apiSecret: REDACTED,
        label: null,
        configuration: CONFIGURATION,
        fund: { connect: { id: 'fund-1' } },
      },
    });
  });

  it('stores the same redacted payload whatever the operation calls its variables', async () => {
    const variables = {
      fundId: 'fund-1',
      provider: 'ALPACA',
      type: 'PAPER',
      label: 'primary',
      configuration: CONFIGURATION,
    };
    const asColumns = await audit(brokerCredentialCreate('apiKey', 'apiSecret'), {
      ...variables,
      apiKey: FAKE_KEY,
      apiSecret: FAKE_SECRET,
    });
    const renamed = await audit(brokerCredentialCreate('k', 's'), {
      ...variables,
      k: FAKE_KEY,
      s: FAKE_SECRET,
    });

    expectNoCredentialValue([...asColumns, ...renamed]);
    expect(JSON.stringify(renamed[0].changedFields)).toBe(
      JSON.stringify(asColumns[0].changedFields)
    );
  });

  it('records a credential update as a redacted change, not as an empty one', async () => {
    const rows = await audit(BROKER_CREDENTIAL_UPDATE, {
      id: 'ba-1',
      apiKey: FAKE_KEY,
      apiSecret: FAKE_SECRET,
      type: 'LIVE',
      configuration: CONFIGURATION,
    });

    expect(rows).toHaveLength(1);
    expectNoCredentialValue(rows);
    expect(rows[0]).toMatchObject({ operationType: 'UPDATE', recordId: 'ba-1' });
    expect(rows[0].changedFields).toEqual({
      where: { id: 'ba-1' },
      data: {
        apiKey: REDACTED,
        apiSecret: REDACTED,
        type: { set: 'LIVE' },
        configuration: CONFIGURATION,
      },
    });
  });

  it('records a credential written inline, with no variables at all, redacted', async () => {
    const rows = await audit(`
      mutation {
        updateOneBrokerageAccount(
          where: { id: "ba-2" }
          data: { apiKey: { set: "${FAKE_KEY}" }, apiSecret: { set: "${FAKE_SECRET}" } }
        ) { id }
      }
    `);

    expectNoCredentialValue(rows);
    expect(rows[0].changedFields).toEqual({
      where: { id: 'ba-2' },
      data: { apiKey: REDACTED, apiSecret: REDACTED },
    });
  });

  it('records a credential revoke with the filter it applied to', async () => {
    const rows = await audit(BROKER_CREDENTIAL_CLEAR, {
      fundIds: ['fund-1', 'fund-2'],
      provider: 'ALPACA',
    });

    expect(rows[0].changedFields).toEqual({
      where: {
        fundId: { in: ['fund-1', 'fund-2'] },
        provider: { equals: 'ALPACA' },
        deletedAt: { equals: null },
      },
      data: { apiKey: REDACTED, apiSecret: REDACTED },
    });
  });

  it('redacts a credential nested under a model that holds none itself', async () => {
    const rows = await audit(
      `mutation M($o: String, $k: String!, $s: String!) {
        createOneUser(data: {
          name: "n"
          openaiAPIKey: $o
          alpacaAccounts: { create: [{ APIKey: $k, APISecret: $s }] }
        }) { id }
      }`,
      { o: FAKE_SECRET, k: FAKE_KEY, s: FAKE_SECRET }
    );

    expectNoCredentialValue(rows);
    expect(rows[0].changedFields).toEqual({
      input: {
        name: 'n',
        openaiAPIKey: REDACTED,
        alpacaAccounts: { create: [{ APIKey: REDACTED, APISecret: REDACTED }] },
      },
    });
  });
});

describe('audit rows cover exactly the fields the operation executed', () => {
  const ALERT_DATA = {
    message: 'm',
    alpacaAccount: { connect: { id: 'acct-1' } },
  };

  it('audits a mutation selected through an inline fragment or a fragment spread', async () => {
    const inline = await audit(
      `mutation M($data: AlertCreateInput!) {
        ... on Mutation { createOneAlert(data: $data) { id } }
      }`,
      { data: ALERT_DATA }
    );
    const spread = await audit(
      `mutation M($data: AlertCreateInput!) { ...Create }
      fragment Create on Mutation { createOneAlert(data: $data) { id } }`,
      { data: ALERT_DATA }
    );

    for (const rows of [inline, spread]) {
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ modelName: 'Alert', recordId: 'alert-created' });
      expect(rows[0].changedFields).toEqual({ input: ALERT_DATA });
    }
  });

  it('does not audit a field that @skip or @include left out', async () => {
    const rows = await audit(
      `mutation M($data: AlertCreateInput!, $yes: Boolean!, $no: Boolean!) {
        skipped: createOneAlert(data: $data) @skip(if: $yes) { id }
        excluded: createOneAlert(data: $data) @include(if: $no) { id }
        kept: createOneAlert(data: $data) @skip(if: $no) { id }
      }`,
      { data: ALERT_DATA, yes: true, no: false }
    );

    expect(rows).toHaveLength(1);
  });

  it('audits the operation operationName selected, not the first mutation in the document', async () => {
    const rows = await audit(
      `mutation First { createOneAlert(data: { message: "first", alpacaAccount: { connect: { id: "a" } } }) { id } }
      mutation Second { deleteOneAlert(where: { id: "alert-9" }) { id } }`,
      undefined,
      'Second'
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      operationType: 'DELETE',
      recordId: 'alert-9',
      changedFields: { where: { id: 'alert-9' } },
    });
  });

  it('gives each aliased field its own arguments and its own record id', async () => {
    const rows = await audit(
      `mutation M($a: String!, $b: String!) {
        first: updateOneAlert(where: { id: $a }, data: { isRead: { set: true } }) { id }
        second: deleteOneAlert(where: { id: $b }) { id }
      }`,
      { a: 'alert-a', b: 'alert-b' }
    );

    expect(rows).toEqual([
      expect.objectContaining({
        recordId: 'alert-a',
        changedFields: { where: { id: 'alert-a' }, data: { isRead: { set: true } } },
      }),
      expect.objectContaining({
        recordId: 'alert-b',
        changedFields: { where: { id: 'alert-b' } },
      }),
    ]);
  });

  it("records a variable's declared default when the request omits it", async () => {
    const rows = await audit(
      `mutation M($data: AlertCreateInput = { message: "default", alpacaAccount: { connect: { id: "acct-d" } } }) {
        createOneAlert(data: $data) { id }
      }`
    );

    expect(rows[0].changedFields).toEqual({
      input: { message: 'default', alpacaAccount: { connect: { id: 'acct-d' } } },
    });
  });

  it('records only what the request or the operation supplied', async () => {
    // An omitted optional variable named like an Object.prototype member must
    // resolve to nothing, not to the inherited member.
    const rows = await audit(
      `mutation M($constructor: String, $toString: String) {
        createOneAlert(data: {
          message: "m"
          title: $constructor
          alpacaAccount: { connect: { id: $toString } }
        }) { id }
      }`
    );

    expect(rows[0].changedFields).toEqual({
      input: { message: 'm', alpacaAccount: { connect: {} } },
    });
  });
});

/**
 * The recorder as it was before arguments were resolved against the field:
 * the request's variables map, cut by operation type. Kept verbatim as the
 * oracle for the no-op proof below.
 */
function legacyChangedFields(
  operationType: 'CREATE' | 'UPDATE' | 'DELETE',
  variables: Record<string, unknown> | null | undefined
): Record<string, unknown> {
  if (!variables) return {};
  const fields =
    operationType === 'CREATE'
      ? { input: variables.data || variables }
      : operationType === 'UPDATE'
        ? { where: variables.where || {}, data: variables.data || {} }
        : { where: variables.where || {} };
  return redactCredentials(fields) as Record<string, unknown>;
}

describe('no-op on the generated client: canonical documents store what they stored before', () => {
  // The generated `adaptic.<model>.<op>()` documents name each variable after
  // the argument it fills, so the variables map and the resolved arguments
  // coincide. On those documents the stored row must be byte-identical.
  const CANONICAL: ReadonlyArray<{
    name: string;
    operationType: 'CREATE' | 'UPDATE' | 'DELETE';
    recordId: string;
    query: string;
    variables: Record<string, unknown>;
  }> = [
    {
      name: 'createOne',
      operationType: 'CREATE',
      recordId: 'alert-created',
      query: `mutation createOneAlert($data: AlertCreateInput!) { createOneAlert(data: $data) { id } }`,
      variables: {
        data: {
          title: 't',
          message: 'm',
          severity: 'HIGH',
          isRead: false,
          alpacaAccount: { connect: { id: 'acct-1' } },
        },
      },
    },
    {
      name: 'createMany',
      operationType: 'CREATE',
      recordId: 'unknown',
      query: `mutation createManyAlert($data: [AlertCreateManyInput!]!, $skipDuplicates: Boolean) {
        createManyAlert(data: $data, skipDuplicates: $skipDuplicates) { count }
      }`,
      variables: {
        data: [
          { message: 'a', alpacaAccountId: 'acct-1' },
          { message: 'b', alpacaAccountId: 'acct-2' },
        ],
        skipDuplicates: true,
      },
    },
    {
      name: 'updateOne',
      operationType: 'UPDATE',
      recordId: 'alert-1',
      query: `mutation updateOneAlert($data: AlertUpdateInput!, $where: AlertWhereUniqueInput!) {
        updateOneAlert(data: $data, where: $where) { id }
      }`,
      variables: {
        where: { id: 'alert-1' },
        data: { message: { set: 'edited' }, isRead: { set: true } },
      },
    },
    {
      name: 'upsertOne',
      operationType: 'CREATE',
      recordId: 'alert-upserted',
      query: `mutation upsertOneAlert($where: AlertWhereUniqueInput!, $create: AlertCreateInput!, $update: AlertUpdateInput!) {
        upsertOneAlert(where: $where, create: $create, update: $update) { id }
      }`,
      variables: {
        where: { id: 'alert-2' },
        create: { message: 'new', alpacaAccount: { connect: { id: 'acct-1' } } },
        update: { message: { set: 'again' } },
      },
    },
    {
      name: 'deleteOne',
      operationType: 'DELETE',
      recordId: 'alert-3',
      query: `mutation deleteOneAlert($where: AlertWhereUniqueInput!) { deleteOneAlert(where: $where) { id } }`,
      variables: { where: { id: 'alert-3' } },
    },
  ];

  for (const canonical of CANONICAL) {
    it(`${canonical.name} stores the byte-identical row`, async () => {
      const operationName = `${canonical.name}Alert`;
      const rows = await audit(canonical.query, canonical.variables, operationName);

      expect(rows).toHaveLength(1);
      expect(JSON.stringify(rows[0])).toBe(
        JSON.stringify({
          userId: null,
          operationType: canonical.operationType,
          modelName: 'Alert',
          recordId: canonical.recordId,
          changedFields: legacyChangedFields(canonical.operationType, canonical.variables),
          operationName,
          ipAddress: null,
          metadata: {
            graphqlOperationName: operationName,
            principalKind: 'server',
            principalSub: 'audit-test',
          },
        })
      );
    });
  }

  it('differs from the variables map only by the argument path when variables are renamed', async () => {
    const data = { message: 'm', alpacaAccount: { connect: { id: 'acct-1' } } };
    const rows = await audit(
      `mutation M($input: AlertCreateInput!) { createOneAlert(data: $input) { id } }`,
      { input: data }
    );

    expect(legacyChangedFields('CREATE', { input: data })).toEqual({ input: { input: data } });
    expect(rows[0].changedFields).toEqual({ input: data });
  });
});

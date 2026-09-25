/**
 * Audit payload guard: credential copies inside `AuditLog` JSON payloads.
 *
 * The fixtures are shaped like the rows the audit logger stored before writes
 * were redacted: a broker-key update keeps the key and secret at
 * `data.APIKey.set` / `data.APISecret.set`, and a user create keeps nested
 * account keys under `input.alpacaAccounts.connectOrCreate[…].create`. Every
 * value here is a fixture literal.
 *
 * The middleware cases run the guard in-process against a small SDL schema
 * whose field names match the generated ones; the served-schema shapes
 * (every generated AuditLog resolver) run in `credential-field-coverage`.
 */
import { buildSchema, graphql, type GraphQLObjectType, type GraphQLSchema } from 'graphql';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { REDACTED, credentialKeyPaths, redactCredentials } from '../../auth/credential-redaction';
import type { BackendPrincipal } from '../../auth/token-verifier';
import { logger } from '../../utils/logger';
import {
  auditPayloadAccessTotal,
  createCredentialFieldGuardMiddleware,
  resetCredentialFieldGuardLogThrottle,
  type CredentialFieldGuardContext,
  type CredentialFieldGuardMode,
} from '../credential-field-guard';

const FIXTURE_KEY = 'PKAUDITFIXTUREKEY000000000';
const FIXTURE_SECRET = 'audit-fixture-secret-that-must-never-leak';
const FIXTURE_NESTED_SECRET = 'audit-fixture-nested-secret-never-leaks';
const FIXTURE_TOKEN = 'audit-fixture-oauth-access-token';
const PREDICATE_CANARY = 'audit-predicate-canary-7d1e';

/** A broker-key update, as the unredacted audit logger stored it. */
const UPDATE_ROW_PAYLOAD = {
  where: { id: 'acct-1' },
  data: {
    APIKey: { set: FIXTURE_KEY },
    APISecret: { set: FIXTURE_SECRET },
    realTime: { set: false },
  },
};

/** A user create with a nested account, as the unredacted audit logger stored it. */
const CREATE_ROW_PAYLOAD = {
  input: {
    name: 'fixture user',
    alpacaAccounts: {
      connectOrCreate: [
        {
          where: { id: 'acct-2' },
          create: { type: 'PAPER', APIKey: FIXTURE_KEY, APISecret: FIXTURE_NESTED_SECRET },
        },
      ],
    },
  },
};

/** A payload with no credential keys at all. */
const CLEAN_PAYLOAD = { status: 'cancel_requested', where: { id: 'order-1' } };

function nest(depth: number, leaf: unknown): unknown {
  let value = leaf;
  for (let i = 0; i < depth; i += 1) value = { level: value };
  return value;
}

describe('credentialKeyPaths', () => {
  it('locates the key and secret of a stored broker-key update', () => {
    expect(credentialKeyPaths(UPDATE_ROW_PAYLOAD)).toEqual([
      { path: 'data.APIKey', carriesValue: true },
      { path: 'data.APISecret', carriesValue: true },
    ]);
  });

  it('locates nested account keys inside a stored user create', () => {
    expect(credentialKeyPaths(CREATE_ROW_PAYLOAD)).toEqual([
      { path: 'input.alpacaAccounts.connectOrCreate.0.create.APIKey', carriesValue: true },
      { path: 'input.alpacaAccounts.connectOrCreate.0.create.APISecret', carriesValue: true },
    ]);
  });

  it('reports a credential key set to nothing as replaced but carrying no value', () => {
    expect(credentialKeyPaths({ data: { APIKey: { set: '' }, APISecret: '' } })).toEqual([
      { path: 'data.APIKey', carriesValue: false },
      { path: 'data.APISecret', carriesValue: false },
    ]);
  });

  it('skips a null credential, which redaction keeps as written', () => {
    expect(credentialKeyPaths({ data: { APIKey: null } })).toEqual([]);
    expect(redactCredentials({ data: { APIKey: null } })).toEqual({ data: { APIKey: null } });
  });

  it('reports a subtree past the depth limit, which redaction replaces whole', () => {
    const deep = nest(20, 'plain value');
    const paths = credentialKeyPaths(deep);
    expect(paths).toHaveLength(1);
    expect(paths[0]?.carriesValue).toBe(true);
  });

  it('is empty exactly when redaction leaves the payload unchanged', () => {
    const fixtures: unknown[] = [
      UPDATE_ROW_PAYLOAD,
      CREATE_ROW_PAYLOAD,
      CLEAN_PAYLOAD,
      { data: { APIKey: null } },
      { data: { APIKey: { set: '' } } },
      { metadata: { accessToken: FIXTURE_TOKEN } },
      nest(20, 'plain value'),
      nest(5, { APISecret: FIXTURE_SECRET }),
      [UPDATE_ROW_PAYLOAD, CLEAN_PAYLOAD],
      'a bare string',
      42,
      null,
    ];
    for (const fixture of fixtures) {
      const unchanged = JSON.stringify(redactCredentials(fixture)) === JSON.stringify(fixture);
      expect({ fixture, unchanged }).toEqual({
        fixture,
        unchanged: credentialKeyPaths(fixture).length === 0,
      });
    }
  });
});

interface Row {
  id: string;
  changedFields: unknown;
  metadata: unknown;
}

const ROWS: Row[] = [
  { id: 'log-1', changedFields: UPDATE_ROW_PAYLOAD, metadata: { graphqlOperationName: 'updateAlpacaAccount' } },
  { id: 'log-2', changedFields: CREATE_ROW_PAYLOAD, metadata: { accessToken: FIXTURE_TOKEN } },
  { id: 'log-3', changedFields: CLEAN_PAYLOAD, metadata: null },
];

/**
 * An SDL schema with the generated type and argument names, the guard
 * installed on every field the way TypeGraphQL's global middleware runs it.
 */
function guardedSchema(mode: CredentialFieldGuardMode): { schema: GraphQLSchema; calls: () => number } {
  const schema = buildSchema(`
    scalar JSON
    type AuditLog { id: String! changedFields: JSON! metadata: JSON }
    type AuditTrail { logs: [AuditLog!]! }
    input JsonFilter { path: [String!] string_starts_with: String equals: JSON }
    input AuditLogWhereInput { AND: [AuditLogWhereInput!] changedFields: JsonFilter metadata: JsonFilter }
    enum SortOrder { asc desc }
    input AuditLogOrderByWithRelationInput { id: SortOrder changedFields: SortOrder metadata: SortOrder }
    enum AuditLogScalarFieldEnum { id changedFields metadata }
    type Query {
      auditLogs(
        where: AuditLogWhereInput
        orderBy: [AuditLogOrderByWithRelationInput!]
        distinct: [AuditLogScalarFieldEnum!]
      ): [AuditLog!]!
      trail: AuditTrail!
    }
  `);
  const guard = createCredentialFieldGuardMiddleware({ modeProvider: () => mode });
  let resolverCalls = 0;
  const resolvers: Record<string, Record<string, (root: unknown) => unknown>> = {
    Query: {
      auditLogs: () => {
        resolverCalls += 1;
        return ROWS;
      },
      trail: () => ({ logs: ROWS }),
    },
  };
  for (const typeName of ['Query', 'AuditLog', 'AuditTrail']) {
    const type = schema.getType(typeName) as GraphQLObjectType;
    for (const [fieldName, field] of Object.entries(type.getFields())) {
      const own = resolvers[typeName]?.[fieldName];
      field.resolve = (root, args, context, info) =>
        guard({ root, args, context: context as CredentialFieldGuardContext, info }, () =>
          Promise.resolve(own ? own(root) : (root as Record<string, unknown>)[fieldName])
        );
    }
  }
  return { schema, calls: () => resolverCalls };
}

const PRINCIPALS: Record<string, BackendPrincipal | null> = {
  none: null,
  user: { kind: 'user', sub: 'u-1', roles: ['user'] },
  admin: { kind: 'admin', sub: 'a-1', roles: ['admin'] },
  server: { kind: 'server', sub: 'adaptic-engine:host:1' },
};

async function run(
  mode: CredentialFieldGuardMode,
  principal: keyof typeof PRINCIPALS,
  source: string
): Promise<{ body: string; codes: string[]; resolverCalls: number }> {
  const { schema, calls } = guardedSchema(mode);
  const result = await graphql({
    schema,
    source,
    contextValue: {
      principal: PRINCIPALS[principal],
      req: { ip: '152.233.12.241', headers: { 'user-agent': 'node' } },
    },
  });
  return {
    body: JSON.stringify(result),
    codes: (result.errors ?? []).map((e) => String(e.extensions?.code)),
    resolverCalls: calls(),
  };
}

async function counterValue(labels: Record<string, string>): Promise<number> {
  const metric = await auditPayloadAccessTotal.get();
  return metric.values
    .filter((v) => Object.entries(labels).every(([k, want]) => String(v.labels[k]) === want))
    .reduce((sum, v) => sum + v.value, 0);
}

const READ_ALL = '{ auditLogs { id changedFields metadata } }';

type LogCall = [string, Record<string, unknown>?];

describe('audit payload guard in the middleware', () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetCredentialFieldGuardLogThrottle();
    warn = vi.spyOn(logger, 'warn').mockImplementation(() => logger);
    vi.spyOn(logger, 'info').mockImplementation(() => logger);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const guardLines = (): LogCall[] =>
    (warn.mock.calls as LogCall[]).filter(([message]) => message.includes('audit payload'));

  describe.each(['none', 'user'] as const)('enforce, %s principal', (principal) => {
    it('serves every payload with its credential values replaced', async () => {
      const { body, codes } = await run('enforce', principal, READ_ALL);
      expect(codes).toEqual([]);
      for (const secret of [FIXTURE_KEY, FIXTURE_SECRET, FIXTURE_NESTED_SECRET, FIXTURE_TOKEN]) {
        expect(body).not.toContain(secret);
      }
      expect(body).toContain(REDACTED);
    });

    it('keeps everything in the payload that is not a credential', async () => {
      const { body } = await run('enforce', principal, READ_ALL);
      const logs = (JSON.parse(body) as { data: { auditLogs: Row[] } }).data.auditLogs;
      expect(logs[0]?.changedFields).toEqual({
        where: { id: 'acct-1' },
        data: { APIKey: REDACTED, APISecret: REDACTED, realTime: { set: false } },
      });
      expect(logs[0]?.metadata).toEqual({ graphqlOperationName: 'updateAlpacaAccount' });
      expect(logs[2]?.changedFields).toEqual(CLEAN_PAYLOAD);
    });

    it('redacts a payload reached through another type, not only at the root', async () => {
      const { body } = await run('enforce', principal, '{ trail { logs { changedFields } } }');
      expect(body).not.toContain(FIXTURE_SECRET);
      expect(body).toContain(REDACTED);
    });

    it.each([
      ['a JSON path filter', `{ auditLogs(where: { changedFields: { path: ["data", "APISecret", "set"], string_starts_with: "${PREDICATE_CANARY}" } }) { id } }`],
      ['a nested filter', '{ auditLogs(where: { AND: [{ metadata: { equals: {} } }] }) { id } }'],
      ['a sort', '{ auditLogs(orderBy: [{ changedFields: asc }]) { id } }'],
      ['a distinct', '{ auditLogs(distinct: [changedFields]) { id } }'],
    ])('refuses %s over a payload before the resolver runs', async (_label, source) => {
      const { codes, resolverCalls, body } = await run('enforce', principal, source);
      expect(codes).toEqual(['FORBIDDEN']);
      expect(resolverCalls).toBe(0);
      expect(body).not.toContain(PREDICATE_CANARY);
    });
  });

  describe.each(['admin', 'server'] as const)('enforce, %s principal (control)', (principal) => {
    it('reads payloads as stored', async () => {
      const { body, codes } = await run('enforce', principal, READ_ALL);
      expect(codes).toEqual([]);
      expect(body).toContain(FIXTURE_SECRET);
      expect(body).toContain(FIXTURE_NESTED_SECRET);
    });

    it('may filter on a payload', async () => {
      const { codes, resolverCalls } = await run(
        'enforce',
        principal,
        '{ auditLogs(where: { changedFields: { path: ["data"], equals: {} } }) { id } }'
      );
      expect(codes).toEqual([]);
      expect(resolverCalls).toBe(1);
    });
  });

  it('leaves non-payload fields alone for an anonymous caller', async () => {
    const before = await counterValue({ principal_kind: 'none' });
    const { body, codes } = await run('enforce', 'none', '{ auditLogs { id } }');
    expect(codes).toEqual([]);
    expect(body).toContain('log-1');
    expect(await counterValue({ principal_kind: 'none' })).toBe(before);
  });

  it('shadow: serves payloads as stored, counts the reads it would redact, and logs paths only', async () => {
    const wouldRedact = { surface: 'output', decision: 'would_redact', principal_kind: 'none', carried_value: 'true' };
    const unchanged = { surface: 'output', decision: 'unchanged', principal_kind: 'none' };
    const [wouldBefore, unchangedBefore] = [await counterValue(wouldRedact), await counterValue(unchanged)];

    const { body, codes } = await run('shadow', 'none', READ_ALL);

    expect(codes).toEqual([]);
    expect(body).toContain(FIXTURE_SECRET);
    // log-1 changedFields, log-2 changedFields and log-2 metadata hold credentials.
    expect((await counterValue(wouldRedact)) - wouldBefore).toBe(3);
    // log-1 metadata, log-3 changedFields and log-3 metadata do not.
    expect((await counterValue(unchanged)) - unchangedBefore).toBe(3);

    const lines = guardLines();
    expect(lines.map(([, meta]) => meta?.credentialPaths)).toContainEqual([
      'data.APIKey',
      'data.APISecret',
    ]);
    const logged = JSON.stringify(lines);
    for (const secret of [FIXTURE_KEY, FIXTURE_SECRET, FIXTURE_NESTED_SECRET, FIXTURE_TOKEN]) {
      expect(logged).not.toContain(secret);
    }
  });

  it('shadow: admits a payload predicate but counts and logs it', async () => {
    const wouldDeny = { surface: 'argument', decision: 'would_deny', principal_kind: 'user' };
    const before = await counterValue(wouldDeny);

    const { codes, resolverCalls } = await run('shadow', 'user', '{ auditLogs(orderBy: [{ metadata: desc }]) { id } }');

    expect(codes).toEqual([]);
    expect(resolverCalls).toBe(1);
    expect((await counterValue(wouldDeny)) - before).toBe(1);
    expect(guardLines().map(([message]) => message)).toContainEqual(
      expect.stringContaining('audit payload predicate')
    );
  });

  it('off: serves payloads as stored and records nothing', async () => {
    const before = await counterValue({ principal_kind: 'none' });
    const { body } = await run('off', 'none', READ_ALL);
    expect(body).toContain(FIXTURE_SECRET);
    expect(await counterValue({ principal_kind: 'none' })).toBe(before);
    expect(guardLines()).toEqual([]);
  });
});

/**
 * Credential-field guard: whole-schema coverage and query-shape battery.
 *
 * `credential-field-guard.test.ts` proves the guard's mechanics on a small
 * schema. This suite proves it against the schema production actually
 * serves, via `credential-field-coverage.harness.ts` (ts-node, because the
 * generated resolvers need decorator metadata):
 *
 * - every place the served schema lets a caller READ a stored credential
 *   (output field), FILTER / SORT on one (predicate input key) or GROUP /
 *   DISTINCT by one (enum value) is claimed by the guard — a new generator
 *   output shape or credential column turns this red rather than widening
 *   the read surface silently;
 * - no credential-SHAPED output field exists that is neither guarded nor on
 *   the reviewed allowlist;
 * - aliased, fragment, nested-relation, multi-root, variable-driven,
 *   bulk-write-return and mutation-predicate shapes are refused for
 *   anonymous, user and admin principals, and each is paired with a service
 *   CONTROL that must return the value, so "the secret did not appear" is
 *   evidence rather than an artefact of a harness that never serves it;
 * - no refused response body carries a credential value or echoes the
 *   caller's predicate literal.
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { runTsNodeHarness } from './ts-node-harness';

/**
 * The harness builds the full served schema: about a minute of CPU, and
 * several minutes of wall clock on a loaded machine.
 */
const HARNESS_TIMEOUT_MS = 300_000;

/** Headroom so the harness's own timeout, not the hook's, reports a hang. */
const HOOK_TIMEOUT_MS = HARNESS_TIMEOUT_MS + 30_000;

const API_KEY = 'PKCOVERAGEKEYVALUE00000000';
const API_SECRET = 'coverage-secret-value-that-must-never-leak';
const PREDICATE_CANARY = 'predicate-canary-value-9f3c';
/** Mirror the harness's stored AuditLog payload values (it runs out of process). */
const AUDIT_KEY = 'PKAUDITCOVERAGEKEY00000000';
const AUDIT_SECRET = 'audit-coverage-secret-that-must-never-leak';
const AUDIT_NESTED_SECRET = 'audit-coverage-nested-secret-never-leaks';
const AUDIT_TOKEN = 'audit-coverage-oauth-access-token';
const AUDIT_VALUES = [AUDIT_KEY, AUDIT_SECRET, AUDIT_NESTED_SECRET, AUDIT_TOKEN];
const REDACTED = '[REDACTED]';
/** Mirrors `DOUBLE_GAP_MARKER` in the harness (it runs out of process). */
const DOUBLE_GAP_MARKER = 'COVERAGE_HARNESS_DOUBLE_GAP';

interface CoverageReport {
  typesWalked: number;
  uncoveredOutputs: string[];
  uncoveredPredicates: string[];
  uncoveredEnumValues: string[];
  unreviewedCredentialShapedOutputs: string[];
  guardedOutputsSeen: string[];
  uncoveredAuditPayloadOutputs: string[];
  uncoveredAuditPayloadPredicates: string[];
  uncoveredAuditPayloadEnumValues: string[];
  guardedAuditPayloadOutputsSeen: string[];
}

interface ShapeResult {
  codes: string[];
  json: string;
  resolverCalls: number;
}

let coverage: CoverageReport;
let shapes: Record<string, ShapeResult>;

function shape(name: string): ShapeResult {
  const r = shapes[name];
  if (!r) throw new Error(`harness produced no result for scenario "${name}"`);
  return r;
}

beforeAll(async () => {
  const parsed = await runTsNodeHarness<{
    coverage: CoverageReport;
    shapes: Record<string, ShapeResult>;
  }>('src/middleware/__tests__/credential-field-coverage.harness.ts', HARNESS_TIMEOUT_MS);
  coverage = parsed.coverage;
  shapes = parsed.shapes;
}, HOOK_TIMEOUT_MS);

describe('harness integrity', () => {
  it('every resolver the battery reached found its Prisma method on the double', () => {
    const gaps = Object.entries(shapes)
      .filter(([, r]) => r.json.includes(DOUBLE_GAP_MARKER))
      .map(([name]) => name);
    expect(gaps).toEqual([]);
  });
});

describe('whole-schema coverage', () => {
  it('walked the served schema, not an empty one', () => {
    expect(coverage.typesWalked).toBeGreaterThan(1000);
    expect(coverage.guardedOutputsSeen).toEqual(
      expect.arrayContaining([
        'AlpacaAccount.APIKey',
        'AlpacaAccount.APISecret',
        'BrokerageAccount.apiSecret',
        'CreateManyAndReturnAlpacaAccount.APISecret',
        'VerificationToken.token',
      ])
    );
  });

  it('claims every output field that returns a stored credential value', () => {
    expect(coverage.uncoveredOutputs).toEqual([]);
  });

  it('claims every predicate input key over a stored credential column', () => {
    expect(coverage.uncoveredPredicates).toEqual([]);
  });

  it('claims every enum value that groups or distincts by a credential column', () => {
    expect(coverage.uncoveredEnumValues).toEqual([]);
  });

  it('has no credential-shaped output field that is unguarded and unreviewed', () => {
    expect(coverage.unreviewedCredentialShapedOutputs).toEqual([]);
  });
});

const DENIED_PRINCIPALS = ['none', 'user', 'admin'] as const;

const OUTPUT_SHAPES = [
  'aliased',
  'fragment',
  'inline-fragment',
  'nested-relation',
  'multi-root',
  'bulk-return',
  'update-return',
] as const;

const PREDICATE_SHAPES = ['variable-predicate', 'canary-predicate', 'mutation-oracle'] as const;

describe('output shapes', () => {
  it.each(OUTPUT_SHAPES)('%s: a service principal receives the secret (control)', (name) => {
    const r = shape(`${name}/server`);
    expect(r.codes).toEqual([]);
    expect(r.json).toContain(API_SECRET);
  });

  it.each(
    OUTPUT_SHAPES.flatMap((name) => DENIED_PRINCIPALS.map((p) => `${name}/${p}`))
  )('%s: refused, and neither the key nor the secret is in the body', (name) => {
    const r = shape(name);
    expect(r.codes).toContain('FORBIDDEN');
    expect(r.json).not.toContain(API_SECRET);
    expect(r.json).not.toContain(API_KEY);
  });

  it('multi-root: the refusal names only the credential path, never the clean root', () => {
    // `APISecret` is non-null, so the refusal nulls the whole response under
    // GraphQL's null-propagation rules; the error itself must point at the
    // credential field and nowhere else.
    const body = JSON.parse(shape('multi-root/none').json) as {
      errors: Array<{ path: Array<string | number> }>;
    };
    expect(body.errors.map((e) => e.path.join('.'))).toEqual(['closed.0.APISecret']);
  });
});

describe('predicate shapes (filter oracles, including on the write path)', () => {
  it.each(PREDICATE_SHAPES)('%s: a service principal may filter (control)', (name) => {
    const r = shape(`${name}/server`);
    expect(r.codes).toEqual([]);
    expect(r.resolverCalls).toBe(1);
  });

  it.each(
    PREDICATE_SHAPES.flatMap((name) => DENIED_PRINCIPALS.map((p) => `${name}/${p}`))
  )('%s: refused before the resolver touches the database', (name) => {
    const r = shape(name);
    expect(r.codes).toContain('FORBIDDEN');
    expect(r.resolverCalls).toBe(0);
  });

  it.each(DENIED_PRINCIPALS)(
    'canary-predicate/%s: the refusal does not echo the predicate literal',
    (principal) => {
      expect(shape(`canary-predicate/${principal}`).json).not.toContain(PREDICATE_CANARY);
    }
  );
});

describe('refused bodies carry no values at all', () => {
  it('no FORBIDDEN response anywhere in the battery contains a seeded credential', () => {
    const refused = Object.entries(shapes).filter(([, r]) => r.codes.includes('FORBIDDEN'));
    expect(refused.length).toBeGreaterThanOrEqual(30);
    for (const [name, r] of refused) {
      expect({ name, leaksSecret: r.json.includes(API_SECRET) }).toEqual({
        name,
        leaksSecret: false,
      });
      expect({ name, leaksKey: r.json.includes(API_KEY) }).toEqual({
        name,
        leaksKey: false,
      });
    }
  });
});

const PAYLOAD_READERS_REDACTED = ['none', 'user'] as const;
const PAYLOAD_READERS_RAW = ['admin', 'server'] as const;

const AUDIT_OUTPUT_SHAPES = [
  'audit-root',
  'audit-aliased-fragment',
  'audit-unique',
  'audit-get',
  'audit-first',
  'audit-first-or-throw',
  'audit-group-by-output',
  'audit-bulk-return',
  'audit-create-return',
  'audit-update-return',
  'audit-upsert-return',
  'audit-delete-return',
] as const;

const AUDIT_PREDICATE_SHAPES = [
  'audit-path-predicate',
  'audit-variable-predicate',
  'audit-order-by',
  'audit-distinct',
  'audit-group-by-payload',
  'audit-having',
  'audit-cursor',
  'audit-mutation-oracle',
] as const;

describe('audit payload coverage', () => {
  it('walked the AuditLog payload columns of the served schema', () => {
    expect(coverage.guardedAuditPayloadOutputsSeen).toEqual(
      expect.arrayContaining([
        'AuditLog.changedFields',
        'AuditLog.metadata',
        'AuditLogGroupBy.changedFields',
        'CreateManyAndReturnAuditLog.changedFields',
      ])
    );
  });

  it('claims every output field that returns an audit payload', () => {
    expect(coverage.uncoveredAuditPayloadOutputs).toEqual([]);
  });

  it('claims every predicate input key over an audit payload column', () => {
    expect(coverage.uncoveredAuditPayloadPredicates).toEqual([]);
  });

  it('claims every enum value that groups or distincts by an audit payload column', () => {
    expect(coverage.uncoveredAuditPayloadEnumValues).toEqual([]);
  });
});

describe('audit payload shapes (stored rows holding broker keys)', () => {
  it.each(
    AUDIT_OUTPUT_SHAPES.flatMap((name) => PAYLOAD_READERS_RAW.map((p) => `${name}/${p}`))
  )('%s: read as stored (control)', (name) => {
    const r = shape(name);
    expect(r.codes).toEqual([]);
    expect(AUDIT_VALUES.some((v) => r.json.includes(v))).toBe(true);
  });

  it.each(
    AUDIT_OUTPUT_SHAPES.flatMap((name) => PAYLOAD_READERS_REDACTED.map((p) => `${name}/${p}`))
  )('%s: served redacted, with no stored credential value in the body', (name) => {
    const r = shape(name);
    expect(r.codes).toEqual([]);
    expect(r.json).toContain(REDACTED);
    for (const value of AUDIT_VALUES) expect(r.json).not.toContain(value);
  });

  it.each(PAYLOAD_READERS_REDACTED)(
    'audit-root/%s: everything in the payload that is not a credential is served',
    (principal) => {
      const body = JSON.parse(shape(`audit-root/${principal}`).json) as {
        data: { auditLogs: Array<{ changedFields: unknown; metadata: unknown }> };
      };
      expect(body.data.auditLogs[0]?.changedFields).toEqual({
        where: { id: 'acct-1' },
        data: { APIKey: REDACTED, APISecret: REDACTED, realTime: { set: false } },
      });
      expect(body.data.auditLogs[0]?.metadata).toEqual({
        graphqlOperationName: 'updateAlpacaAccount',
        accessToken: REDACTED,
      });
    }
  );

  it.each(
    AUDIT_PREDICATE_SHAPES.flatMap((name) => PAYLOAD_READERS_RAW.map((p) => `${name}/${p}`))
  )('%s: may filter, sort or group on a payload (control)', (name) => {
    const r = shape(name);
    expect(r.codes).toEqual([]);
    expect(r.resolverCalls).toBe(1);
  });

  it.each(
    AUDIT_PREDICATE_SHAPES.flatMap((name) => PAYLOAD_READERS_REDACTED.map((p) => `${name}/${p}`))
  )('%s: refused before the resolver touches the database', (name) => {
    const r = shape(name);
    expect(r.codes).toContain('FORBIDDEN');
    expect(r.resolverCalls).toBe(0);
    expect(r.json).not.toContain(PREDICATE_CANARY);
  });

  it.each(PAYLOAD_READERS_REDACTED)(
    'audit-clean-fields/%s: a read that touches no payload column is untouched',
    (principal) => {
      const r = shape(`audit-clean-fields/${principal}`);
      expect(r.codes).toEqual([]);
      expect(r.json).toContain('updateOneAlpacaAccount');
    }
  );

  it('no response to a user or anonymous principal anywhere in the battery holds a stored payload credential', () => {
    const redactedReaders = Object.entries(shapes).filter(
      ([name]) => name.endsWith('/none') || name.endsWith('/user')
    );
    expect(redactedReaders.length).toBeGreaterThanOrEqual(40);
    for (const [name, r] of redactedReaders) {
      const leaked = AUDIT_VALUES.filter((v) => r.json.includes(v));
      expect({ name, leaked }).toEqual({ name, leaked: [] });
    }
  });
});

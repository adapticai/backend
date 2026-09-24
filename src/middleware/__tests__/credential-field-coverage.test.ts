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
import { execFileSync } from 'node:child_process';
import path from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

const API_KEY = 'PKCOVERAGEKEYVALUE00000000';
const API_SECRET = 'coverage-secret-value-that-must-never-leak';
const PREDICATE_CANARY = 'predicate-canary-value-9f3c';
/** Mirrors `DOUBLE_GAP_MARKER` in the harness (it runs out of process). */
const DOUBLE_GAP_MARKER = 'COVERAGE_HARNESS_DOUBLE_GAP';

interface CoverageReport {
  typesWalked: number;
  uncoveredOutputs: string[];
  uncoveredPredicates: string[];
  uncoveredEnumValues: string[];
  unreviewedCredentialShapedOutputs: string[];
  guardedOutputsSeen: string[];
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

beforeAll(() => {
  const root = path.resolve(__dirname, '../../..');
  const stdout = execFileSync(
    path.join(root, 'node_modules/.bin/ts-node'),
    ['--transpile-only', 'src/middleware/__tests__/credential-field-coverage.harness.ts'],
    {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, LOG_LEVEL: 'error' },
      maxBuffer: 64 * 1024 * 1024,
    }
  );
  const match = /<<<RESULTS>>>(.*)<<<END>>>/s.exec(stdout);
  if (!match) throw new Error(`harness printed no results:\n${stdout.slice(-2000)}`);
  const parsed = JSON.parse(match[1]) as {
    coverage: CoverageReport;
    shapes: Record<string, ShapeResult>;
  };
  coverage = parsed.coverage;
  shapes = parsed.shapes;
}, 300_000);

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

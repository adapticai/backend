/**
 * Generator smoke test — standalone, deliberately OUTSIDE vitest.
 *
 * `generateModelFunctions('user', ...)` walks the full generated
 * input/model surface in one synchronous pass that blocks the event loop
 * for 45s+ locally and 60-90s on a 4-core CI runner. Inside vitest that
 * block starves the worker's birpc channel past its fixed 60s budget and
 * the run records an unhandled `[vitest-worker]: Timeout calling
 * "onTaskUpdate"` — failing the publish quality gate with 367/367 tests
 * green (runs 31244014211 / 31249917514 / 31251731595). Neither
 * `disableConsoleIntercept` nor log-level suppression can fix that: the
 * starvation is the blocked loop itself, not output volume.
 *
 * This script preserves the retired src/tests/generator.test.ts assertions
 * verbatim against a SINGLE generation pass (the vitest suite regenerated
 * four times for no additional coverage) and runs via
 * `npm run test:generator`, which both the publish quality gate and ci.yml
 * execute after the vitest suite.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { generateModelFunctions } from '../src/modules/generator';

const modelsPath = path.join(
  __dirname,
  '../src/generated/typegraphql-prisma/models'
);
const inputsPath = path.join(
  __dirname,
  '../src/generated/typegraphql-prisma/resolvers/inputs'
);

function main(): void {
  const started = Date.now();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-smoke-'));
  try {
    const result = generateModelFunctions('user', modelsPath, inputsPath, tmpDir);
    assert.notStrictEqual(
      result,
      null,
      'generateModelFunctions returned null for the user model with valid paths'
    );
    const generated = result as string;
    assert.strictEqual(typeof generated, 'string');

    for (const op of [
      'async create',
      'async update',
      'async delete',
      'async get',
      'async getAll',
      'async findMany',
      'async upsert',
      'async createMany',
      'async updateMany',
    ]) {
      assert.ok(generated.includes(op), `generated code missing "${op}"`);
    }

    assert.ok(generated.includes('import { User as UserType }'));
    assert.ok(generated.includes('import { removeUndefinedProps }'));
    assert.ok(
      generated.includes(
        'import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules }'
      )
    );
    assert.ok(generated.includes('selectionSet'));

    // findMany's props-only where filters on every column of UserWhereInput,
    // not only the unique-looking names `get` uses, and refuses a key it
    // cannot express instead of dropping it (src/modules/find-many-where.ts).
    const findManyStart = generated.indexOf('async findMany(');
    const getStart = generated.indexOf('async get(');
    assert.ok(findManyStart > 0 && getStart > 0, 'generated code missing get/findMany bodies');
    const findManySource = generated.slice(findManyStart);
    const getSource = generated.slice(getStart, generated.indexOf('async getAll('));
    assert.ok(
      findManySource.includes('role: props.role !== undefined ? {'),
      'findMany props where must filter on the non-unique column `role`'
    );
    assert.ok(
      findManySource.includes('findManyUser: filter field(s) ${inexpressible.join'),
      'findMany must refuse props keys it cannot express'
    );
    assert.ok(
      !getSource.includes('role: props.role'),
      'get (WhereUniqueInput) must keep the unique-field builder'
    );
    assert.ok(
      fs.existsSync(path.join(tmpDir, 'user.ts')),
      'generator did not write user.ts to the output directory'
    );

    const invalid = generateModelFunctions(
      'user',
      modelsPath,
      inputsPath,
      '/nonexistent/directory/that/does/not/exist'
    );
    assert.strictEqual(
      invalid,
      null,
      'generator must return null for an unwritable output path'
    );

    process.stdout.write(
      `generator-smoke PASS (${((Date.now() - started) / 1000).toFixed(1)}s)\n`
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main();

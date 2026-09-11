import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';
import { getDMMF } from '@prisma/internals';
import type { DMMF } from '@prisma/generator-helper';

/**
 * Guardrails for DeepInfra-hosted model routing.
 *
 * DeepInfra is an inference host rather than a model author: it serves
 * open-weight models from many organisations behind one API, so its model ids
 * are namespaced `"<org>/<model>"` and preserve each author's casing. Those are
 * the only ids in this schema carrying a slash or mixed case, which makes them
 * the ids most likely to be broken by a consumer that assumes an id is a bare
 * lowercase slug.
 *
 * Two properties are load-bearing outside this repo and are pinned here:
 *
 * 1. The per-tier model columns must stay FREE TEXT (`String?`). A host whose
 *    catalogue changes without a schema migration is only nameable if the
 *    column imposes no value space. Narrowing these to an enum would make every
 *    future DeepInfra model a migration.
 * 2. The documented wire ids must survive verbatim, slash and casing intact.
 *    `DeepinfraModel`'s MEMBER names cannot hold them — enum labels are
 *    identifiers — so the callable id exists only in each member's
 *    `API model id:` doc comment. A well-meaning "normalisation" of those
 *    comments to lowercase or slash-free form would silently produce ids that
 *    DeepInfra rejects, with nothing else in the repo to catch it.
 */

const SCHEMA_PATH = join(__dirname, '..', '..', 'prisma', 'schema.prisma');

/** The exact strings DeepInfra accepts on the wire. */
const EXPECTED_DEEPINFRA_MODEL_IDS = [
  'deepseek-ai/DeepSeek-V4-Pro',
  'deepseek-ai/DeepSeek-V4-Flash',
  'deepseek-ai/DeepSeek-V4.1-Flash',
  'zai-org/GLM-5.3',
  'zai-org/GLM-5.3-Flash',
  'moonshotai/Kimi-K3',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'inclusionAI/Ling-3.0-flash-Fin',
  'nvidia/Nemotron-3-Nano-30B-A3B',
  'Qwen/Qwen3.8-2.4T-A95B',
] as const;

/** Per-tier model columns that must remain free text on each owning model. */
const FREE_TEXT_MODEL_FIELDS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['LlmConfiguration', ['miniModel', 'normalModel', 'advancedModel']],
  ['TradingPolicy', ['miniModelId', 'normalModelId', 'advancedModelId']],
];

describe('DeepInfra model routing', () => {
  let schema: string;
  let dmmf: DMMF.Document;

  beforeAll(async () => {
    schema = readFileSync(SCHEMA_PATH, 'utf8');
    dmmf = await getDMMF({ datamodel: schema });
  });

  const findEnum = (name: string): DMMF.DatamodelEnum => {
    const found = dmmf.datamodel.enums.find((e) => e.name === name);
    if (!found) throw new Error(`enum ${name} is missing from the datamodel`);
    return found;
  };

  it('exposes DEEPINFRA as a routable LlmProvider', () => {
    const values = findEnum('LlmProvider').values.map((v) => v.name);
    expect(values).toContain('DEEPINFRA');
  });

  it('documents every DeepInfra wire id verbatim, slash and casing intact', () => {
    // Each member carries its callable id in a `/// API model id: "..."` line.
    const documented = Array.from(
      schema
        .slice(schema.indexOf('enum DeepinfraModel {'))
        .slice(0, schema.slice(schema.indexOf('enum DeepinfraModel {')).indexOf('\n}'))
        .matchAll(/API model id: "([^"]+)"/g),
      (m) => m[1],
    );

    expect(documented).toEqual([...EXPECTED_DEEPINFRA_MODEL_IDS]);
    // The namespacing is the property that breaks naive consumers, so assert it
    // directly rather than relying on the list above staying namespaced.
    expect(documented.every((id) => id.includes('/'))).toBe(true);
    expect(documented.some((id) => id !== id.toLowerCase())).toBe(true);
  });

  it('gives DeepinfraModel one member per documented id', () => {
    expect(findEnum('DeepinfraModel').values).toHaveLength(
      EXPECTED_DEEPINFRA_MODEL_IDS.length,
    );
  });

  it.each(FREE_TEXT_MODEL_FIELDS)(
    'keeps %s per-tier model columns free text, so a namespaced id needs no migration',
    (modelName, fieldNames) => {
      const model = dmmf.datamodel.models.find((m) => m.name === modelName);
      if (!model) throw new Error(`model ${modelName} is missing from the datamodel`);

      for (const fieldName of fieldNames) {
        const field = model.fields.find((f) => f.name === fieldName);
        if (!field) throw new Error(`${modelName}.${fieldName} is missing`);
        expect(field.type).toBe('String');
        expect(field.kind).toBe('scalar');
      }
    },
  );

  it('gives DEEPINFRA a key column, without which the provider cannot authenticate', () => {
    const model = dmmf.datamodel.models.find((m) => m.name === 'LlmConfiguration');
    if (!model) throw new Error('model LlmConfiguration is missing from the datamodel');
    const field = model.fields.find((f) => f.name === 'deepinfraApiKey');
    expect(field?.type).toBe('String');
    expect(field?.isRequired).toBe(false);
  });
});

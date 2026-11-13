import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import adaptic from '../index';
import { UserTotpTypeString } from '../generated/typeStrings/UserTotp';

/**
 * The trading-desk models and fields on the published `adaptic.*` surface.
 *
 * Surface assertions only, no network. Selection sets are read from the
 * committed per-model CRUD files (`src/<Model>.ts`), because those strings are
 * what every consumer's query actually selects; the CI drift gate keeps them
 * equal to a fresh regeneration of the schema.
 */

const SRC_DIR = join(__dirname, '..');

/**
 * @param model - Prisma model name.
 * @returns The field names in the committed CRUD file's selection set, one per
 *   line, top level and nested alike.
 */
function selectionFields(model: string): string[] {
  const source = readFileSync(join(SRC_DIR, `${model}.ts`), 'utf8');
  const match = /const selectionSet = `([^`]*)`/.exec(source);
  if (!match) throw new Error(`no selectionSet in src/${model}.ts`);
  return match[1]
    .split('\n')
    .map((line) => line.trim().replace(/\s*\{$/, ''))
    .filter((line) => line.length > 0 && line !== '}');
}

const CRUD_METHODS = [
  'create',
  'createMany',
  'update',
  'updateMany',
  'upsert',
  'delete',
  'get',
  'getAll',
  'findMany',
] as const;

const NEW_MODELS = {
  featureFlagOverride: 'FeatureFlagOverride',
  follow: 'Follow',
  autoFollowRule: 'AutoFollowRule',
  pushSubscription: 'PushSubscription',
  adaConversation: 'AdaConversation',
  adaMessage: 'AdaMessage',
  userTotp: 'UserTotp',
  deskDecision: 'DeskDecision',
  userPreference: 'UserPreference',
} as const;

describe('desk models are on the adaptic namespace with full CRUD', () => {
  describe.each(Object.keys(NEW_MODELS) as (keyof typeof NEW_MODELS)[])(
    'adaptic.%s',
    (key) => {
      it.each(CRUD_METHODS)('exposes %s', (method) => {
        expect(typeof adaptic[key]?.[method]).toBe('function');
      });
    }
  );
});

describe('desk selection sets carry the contract fields', () => {
  it.each([
    ['FeatureFlagOverride', ['id', 'flag', 'userId', 'organizationId', 'enabled', 'updatedBy', 'createdAt', 'updatedAt']],
    ['Follow', ['id', 'userId', 'fundId', 'targetKind', 'targetId', 'level', 'riskBudgetPctNav', 'createdAt', 'updatedAt']],
    ['AutoFollowRule', ['id', 'fundId', 'ownerId', 'name', 'condition', 'action', 'destinationDesks', 'enabled', 'createdAt', 'updatedAt']],
    ['PushSubscription', ['id', 'userId', 'endpoint', 'p256dh', 'auth', 'userAgent', 'createdAt', 'lastSeenAt']],
    ['AdaConversation', ['id', 'userId', 'fundId', 'title', 'sharedWithOrg', 'createdAt', 'updatedAt', 'deletedAt']],
    ['AdaMessage', ['id', 'conversationId', 'role', 'text', 'blocks', 'createdAt']],
    ['UserTotp', ['id', 'userId', 'enabledAt', 'createdAt', 'updatedAt']],
    [
      'DeskDecision',
      [
        'id', 'fundId', 'accountId', 'kind', 'ruleId', 'desk', 'question', 'nums',
        'counterCase', 'ifIdle', 'facets', 'dueAt', 'defaultAction', 'amendLabel',
        'reasonRequired', 'status', 'decidedBy', 'decidedAt', 'reason',
      ],
    ],
    ['UserPreference', ['id', 'userId', 'theme', 'density', 'deskPrefs', 'notificationPrefs', 'createdAt', 'updatedAt']],
    ['User', ['availability', 'availabilityUntil']],
    ['MandateVersion', ['autonomy', 'triggers', 'instruments', 'exclusions']],
    ['Strategy', ['kind', 'spec', 'backtestJobId']],
  ] as const)('%s selects %j', (model, fields) => {
    expect(selectionFields(model)).toEqual(expect.arrayContaining([...fields]));
  });
});

describe('the TOTP secret and recovery-code hashes are never selected', () => {
  const SECRETS = ['secretEnc', 'recoveryCodesHash'];

  it('UserTotp selection set omits them', () => {
    const fields = selectionFields('UserTotp');
    expect(fields).toContain('enabledAt');
    expect(fields.filter((field) => SECRETS.includes(field))).toEqual([]);
  });

  it('the User selection set does not reach the enrolment through a relation', () => {
    expect(selectionFields('User')).not.toContain('totp');
  });

  it('the UserTotp typeString omits them', () => {
    for (const secret of SECRETS) expect(UserTotpTypeString).not.toContain(secret);
  });
});

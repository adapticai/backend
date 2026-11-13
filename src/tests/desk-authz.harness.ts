/**
 * Exercises the desk models' authorization, the TOTP mutations, the natural-key
 * upserts, the Ada message delete restriction and the MandateVersion write
 * rules against a real Postgres built from the migration history.
 *
 * The schema is assembled as src/server.ts assembles it — generated resolvers
 * minus server-only models, the TOTP resolver, the credential-field guard and
 * tenancy scoping as global middlewares, the cortex authChecker over the
 * authorization map, then the MandateVersion validation and the mutation guard
 * installed on the built schema — and every operation runs through `graphql()`
 * with a principal in the context, so what is measured is the served path.
 * Both staged modes are left at their default (`shadow`) unless a step says
 * otherwise, because the claim under test is that the desk models do not
 * depend on them. The generated `adaptic.follow.upsert` /
 * `adaptic.pushSubscription.upsert` run through an Apollo client whose link
 * executes against the same schema.
 *
 * Needs `DESK_IT_DATABASE_URL` pointing at a disposable database the
 * migrations have been applied to. Runs out of process under ts-node because
 * the generated resolvers need `emitDecoratorMetadata`. Output is printed
 * between `<<<RESULTS>>>` and `<<<END>>>`. Rows it seeds are removed before it
 * exits.
 */
import 'reflect-metadata';
import { randomBytes, randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { buildSchema } from 'type-graphql';
import { graphql, type GraphQLSchema } from 'graphql';
import {
  ApolloClient,
  InMemoryCache,
  type NormalizedCacheObject,
} from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';

import { resolvers } from '../generated/typegraphql-prisma';
import type { Follow as FollowType } from '../generated/typegraphql-prisma/models/Follow';
import type { PushSubscription as PushSubscriptionType } from '../generated/typegraphql-prisma/models/PushSubscription';
import {
  withoutServerOnlyResolvers,
  withoutServerOnlySchemaSurface,
} from '../config/server-only-models';
import { UserTotpResolver } from '../resolvers/custom';
import { createCredentialFieldGuardMiddleware } from '../middleware/credential-field-guard';
import { createTenancyScopingMiddleware } from '../middleware/tenancy-scoping';
import { installMutationAuthGuard } from '../middleware/mutation-auth-guard';
import { installMandateVersionValidation } from '../middleware/mandate-version-validation';
import { cortexAuthChecker } from '../auth/cortex-auth-checker';
import { applyCortexAuthorizationMap } from '../auth/authorization-map';
import type { BackendPrincipal } from '../auth/token-verifier';
import { hotp, totpStep, TOTP_ENCRYPTION_KEY_ENV } from '../auth/totp';
import adaptic from '../index';

/** One executed operation: its data, or its errors' messages and codes. */
interface StepResult {
  data: unknown;
  errors: string[];
  codes: string[];
}

type Principal = BackendPrincipal | null;

async function run(
  schema: GraphQLSchema,
  prisma: PrismaClient,
  principal: Principal,
  source: string,
  variableValues: Record<string, unknown> = {}
): Promise<StepResult> {
  const result = await graphql({
    schema,
    source,
    variableValues,
    contextValue: { prisma, principal },
  });
  return {
    data: result.data ?? null,
    errors: (result.errors ?? []).map((error) => error.message),
    codes: (result.errors ?? []).map((error) =>
      String(error.extensions?.code ?? '')
    ),
  };
}

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(text: string): Buffer {
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const char of text) {
    value = (value << 5) | BASE32.indexOf(char);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

const LIST_QUERIES = [
  'follows',
  'autoFollowRules',
  'pushSubscriptions',
  'adaConversations',
  'adaMessages',
  'userTotps',
  'deskDecisions',
  'featureFlagOverrides',
];

const VALID_ROW = ['auto', 'notify', 'approve', 'forbidden'];
const VALID_SCOPE = {
  open: VALID_ROW,
  add: VALID_ROW,
  reduce: VALID_ROW,
  close: VALID_ROW,
  hedge: VALID_ROW,
  'new-instrument': VALID_ROW,
};
const VALID_AUTONOMY = {
  all: VALID_SCOPE,
  event: VALID_SCOPE,
  thematic: VALID_SCOPE,
  systematic: VALID_SCOPE,
};

async function main(): Promise<void> {
  const url = process.env.DESK_IT_DATABASE_URL;
  if (!url) throw new Error('DESK_IT_DATABASE_URL is not set');
  delete process.env.MUTATION_AUTH_MODE;
  delete process.env.MUTATION_AUTH_ENFORCE_MODELS;
  delete process.env.TENANCY_SCOPING_MODE;
  delete process.env.CORTEX_AUTHCHECKER_ENFORCE;
  process.env[TOTP_ENCRYPTION_KEY_ENV] = randomBytes(32).toString('base64');

  const prisma = new PrismaClient({ datasourceUrl: url });
  applyCortexAuthorizationMap();
  const schema = withoutServerOnlySchemaSurface(
    await buildSchema({
      resolvers: [...withoutServerOnlyResolvers(resolvers), UserTotpResolver],
      validate: false,
      globalMiddlewares: [
        createCredentialFieldGuardMiddleware(),
        createTenancyScopingMiddleware(),
      ],
      authChecker: cortexAuthChecker,
    })
  );
  installMandateVersionValidation(schema);
  installMutationAuthGuard(schema);

  const tag = randomUUID().slice(0, 8);
  const userA = await prisma.user.create({
    data: { email: `desk-a-${tag}@example.test` },
  });
  const userB = await prisma.user.create({
    data: { email: `desk-b-${tag}@example.test` },
  });
  const userC = await prisma.user.create({
    data: { email: `desk-c-${tag}@example.test` },
  });
  const org = await prisma.organization.create({
    data: { name: `Desk ${tag}`, slug: `desk-${tag}` },
  });
  const fund = await prisma.fund.create({
    data: { name: 'Desk fund', slug: `desk-${tag}`, organizationId: org.id },
  });
  await prisma.orgMembership.createMany({
    data: [
      { userId: userA.id, organizationId: org.id },
      { userId: userB.id, organizationId: org.id },
    ],
  });

  const A: BackendPrincipal = { kind: 'user', sub: userA.id, roles: [] };
  const B: BackendPrincipal = { kind: 'user', sub: userB.id, roles: [] };
  const C: BackendPrincipal = { kind: 'user', sub: userC.id, roles: [] };
  const ADMIN: BackendPrincipal = {
    kind: 'admin',
    sub: userB.id,
    roles: ['admin'],
  };
  const SERVER: BackendPrincipal = { kind: 'server' };

  const follow = await prisma.follow.create({
    data: {
      userId: userA.id,
      fundId: fund.id,
      targetKind: 'asset',
      targetId: 'NVDA',
      level: 1,
    },
  });
  const privateConversation = await prisma.adaConversation.create({
    data: { userId: userA.id, fundId: fund.id, title: 'Private' },
  });
  const sharedConversation = await prisma.adaConversation.create({
    data: {
      userId: userA.id,
      fundId: fund.id,
      title: 'Shared',
      sharedWithOrg: true,
    },
  });
  await prisma.adaMessage.create({
    data: {
      conversationId: privateConversation.id,
      role: 'user',
      text: 'hello',
      blocks: [],
    },
  });
  const push = await prisma.pushSubscription.create({
    data: {
      userId: userA.id,
      endpoint: `https://push.example.test/${tag}/a`,
      p256dh: 'p',
      auth: 'a',
    },
  });
  const seededTotp = await prisma.userTotp.create({
    data: { userId: userA.id, secretEnc: 'v1.x.y.z', recoveryCodesHash: [] },
  });
  await prisma.featureFlagOverride.create({
    data: {
      flag: 'desk_ia',
      userId: userA.id,
      enabled: true,
      updatedBy: 'desk-it',
    },
  });
  const mandate = await prisma.mandate.create({
    data: {
      klass: 'STRATEGY_CHARTER',
      name: 'Desk mandate',
      organizationId: org.id,
    },
  });
  const version = await prisma.mandateVersion.create({
    data: { mandateId: mandate.id, versionLabel: 'v1.0', versionSeq: 1 },
  });

  const steps: Record<string, unknown> = {};
  const apollo = (
    principal: BackendPrincipal
  ): ApolloClient<NormalizedCacheObject> =>
    new ApolloClient({
      link: new SchemaLink({ schema, context: { prisma, principal } }),
      cache: new InMemoryCache(),
    });

  try {
    // 1. Unauthenticated reads, with both staged modes at their shadow default.
    const unauth: Record<string, string[]> = {};
    for (const query of LIST_QUERIES) {
      unauth[query] = (
        await run(schema, prisma, null, `{ ${query} { id } }`)
      ).codes;
    }
    steps.unauthenticatedReads = unauth;

    // 2. Cross-user reads.
    const byId = async (
      principal: Principal,
      field: string,
      id: string
    ): Promise<unknown> =>
      (
        (
          await run(
            schema,
            prisma,
            principal,
            `query ($id: String!) { ${field}(where: { id: $id }) { id } }`,
            { id }
          )
        ).data as Record<string, unknown> | null
      )?.[field] ?? null;
    const list = async (
      principal: Principal,
      field: string
    ): Promise<string[]> =>
      (
        ((
          (await run(schema, prisma, principal, `{ ${field} { id } }`))
            .data as Record<string, Array<{ id: string }>> | null
        )?.[field] ?? []) as Array<{ id: string }>
      ).map((row) => row.id);
    steps.crossUser = {
      ownFollow: await byId(A, 'follow', follow.id),
      otherFollow: await byId(B, 'follow', follow.id),
      otherFollows: await list(B, 'follows'),
      otherPrivateConversation: await byId(
        B,
        'adaConversation',
        privateConversation.id
      ),
      otherSharedConversation: await byId(
        B,
        'adaConversation',
        sharedConversation.id
      ),
      otherMessages: await list(B, 'adaMessages'),
      ownMessages: (await list(A, 'adaMessages')).length,
      otherPush: await byId(B, 'pushSubscription', push.id),
      otherPushes: await list(B, 'pushSubscriptions'),
      otherTotps: await list(B, 'userTotps'),
      otherOverrides: await list(B, 'featureFlagOverrides'),
    };

    // 3. UserTotp writes by non-service principals, mutation-auth mode shadow.
    const totpUpdate = `mutation ($id: String!) { updateOneUserTotp(where: { id: $id }, data: { enabledAt: { set: "2026-11-14T00:00:00.000Z" } }) { id enabledAt } }`;
    const totpDelete = `mutation ($id: String!) { deleteOneUserTotp(where: { id: $id }) { id } }`;
    steps.totpWrites = {
      userUpdate: await run(schema, prisma, A, totpUpdate, {
        id: seededTotp.id,
      }),
      userDelete: await run(schema, prisma, A, totpDelete, {
        id: seededTotp.id,
      }),
      adminUpdate: await run(schema, prisma, ADMIN, totpUpdate, {
        id: seededTotp.id,
      }),
      adminDelete: await run(schema, prisma, ADMIN, totpDelete, {
        id: seededTotp.id,
      }),
      rowAfter: await prisma.userTotp.findUnique({
        where: { id: seededTotp.id },
        select: { enabledAt: true },
      }),
      serverDelete: await run(schema, prisma, SERVER, totpDelete, {
        id: seededTotp.id,
      }),
    };

    // 4. Natural-key upserts through the generated functions.
    const followProps = {
      user: { id: userA.id },
      fund: { id: fund.id },
      targetKind: 'asset',
      targetId: 'AAPL',
      level: 1,
    } as unknown as FollowType;
    await adaptic.follow.upsert(followProps, apollo(SERVER));
    await adaptic.follow.upsert(
      { ...followProps, level: 2 } as FollowType,
      apollo(SERVER)
    );
    const afterServer = await prisma.follow.findMany({
      where: { userId: userA.id, targetId: 'AAPL' },
    });
    // A user principal upserts by the same natural key over raw GraphQL: the
    // generated function re-sends the relation connects on its update side,
    // which the nested-write policy refuses for a user (re-tenanting).
    const followUpsert = `mutation ($where: FollowWhereUniqueInput!, $create: FollowCreateInput!, $update: FollowUpdateInput!) {
      upsertOneFollow(where: $where, create: $create, update: $update) { id level }
    }`;
    const naturalWhere = {
      userId_fundId_targetKind_targetId: { userId: userA.id, fundId: fund.id, targetKind: 'asset', targetId: 'AAPL' },
    };
    const naturalCreate = {
      user: { connect: { id: userA.id } },
      fund: { connect: { id: fund.id } },
      targetKind: 'asset',
      targetId: 'AAPL',
      level: 0,
    };
    const userFollowUpsert = await run(schema, prisma, A, followUpsert, {
      where: naturalWhere,
      create: naturalCreate,
      update: { level: { set: 0 } },
    });
    const afterUser = await prisma.follow.findMany({ where: { userId: userA.id, targetId: 'AAPL' } });
    const otherUserFollowUpsert = await run(schema, prisma, B, followUpsert, {
      where: naturalWhere,
      create: naturalCreate,
      update: { level: { set: 2 } },
    });
    const afterOther = await prisma.follow.findMany({ where: { userId: userA.id, targetId: 'AAPL' } });
    const pushProps = {
      user: { id: userA.id },
      endpoint: `https://push.example.test/${tag}/natural`,
      p256dh: 'p1',
      auth: 'a1',
    } as unknown as PushSubscriptionType;
    await adaptic.pushSubscription.upsert(pushProps, apollo(SERVER));
    await adaptic.pushSubscription.upsert({ ...pushProps, p256dh: 'p2' } as PushSubscriptionType, apollo(SERVER));
    const pushes = await prisma.pushSubscription.findMany({ where: { endpoint: pushProps.endpoint } });
    steps.naturalKey = {
      followRowsAfterTwoServerUpserts: afterServer.map((row) => row.level),
      userFollowUpsertErrors: userFollowUpsert.errors,
      followRowsAfterUserUpsert: afterUser.map((row) => row.level),
      otherUserFollowUpsertCodes: otherUserFollowUpsert.codes,
      followRowsAfterOtherUser: afterOther.map((row) => row.level),
      pushRows: pushes.map((row) => row.p256dh),
    };

    // 5. Deleting a conversation that still has messages is refused.
    steps.conversationDelete = await run(
      schema,
      prisma,
      SERVER,
      `mutation ($id: String!) { deleteOneAdaConversation(where: { id: $id }) { id } }`,
      { id: privateConversation.id }
    );
    steps.conversationStillThere =
      (await prisma.adaConversation.count({
        where: { id: privateConversation.id },
      })) === 1;

    // 6. TOTP mutations.
    const enroll = `mutation ($u: String!) { enrollUserTotp(userId: $u) { otpauthUri recoveryCodes } }`;
    const confirm = `mutation ($u: String!, $c: String!) { confirmUserTotp(userId: $u, code: $c) { ok } }`;
    const verify = `mutation ($u: String!, $c: String!) { verifyUserTotp(userId: $u, code: $c) { ok recoveryUsed } }`;
    const enrolled = await run(schema, prisma, SERVER, enroll, { u: userA.id });
    const material = (
      enrolled.data as {
        enrollUserTotp?: { otpauthUri: string; recoveryCodes: string[] };
      } | null
    )?.enrollUserTotp;
    const secret = base32Decode(
      new URL(material?.otpauthUri ?? 'otpauth://x/y?secret=').searchParams.get(
        'secret'
      ) ?? ''
    );
    const now = Date.now();
    const step = totpStep(now);
    const current = hotp(secret, step);
    const wrong = String((Number(current) + 1) % 1_000_000).padStart(6, '0');
    const recovery = material?.recoveryCodes[0] ?? '';
    const stored = await prisma.userTotp.findUnique({
      where: { userId: userA.id },
    });
    steps.totp = {
      enrollErrors: enrolled.errors,
      recoveryCodeCount: material?.recoveryCodes.length ?? 0,
      storedSecretIsCiphertext: stored
        ? !stored.secretEnc.includes(secret.toString('hex')) &&
          stored.secretEnc.startsWith('v1.')
        : false,
      storedHashesExcludeCodes: stored
        ? !stored.recoveryCodesHash.includes(recovery)
        : false,
      userEnroll: (await run(schema, prisma, A, enroll, { u: userA.id })).codes,
      adminEnroll: (await run(schema, prisma, ADMIN, enroll, { u: userA.id }))
        .codes,
      unauthVerify: (
        await run(schema, prisma, null, verify, { u: userA.id, c: current })
      ).codes,
      confirmWrong: (
        await run(schema, prisma, SERVER, confirm, { u: userA.id, c: wrong })
      ).data,
      confirmRight: (
        await run(schema, prisma, SERVER, confirm, { u: userA.id, c: current })
      ).data,
      reEnroll: (await run(schema, prisma, SERVER, enroll, { u: userA.id }))
        .codes,
      verifyWrong: (
        await run(schema, prisma, SERVER, verify, { u: userA.id, c: wrong })
      ).data,
      verifyReplay: (
        await run(schema, prisma, SERVER, verify, { u: userA.id, c: current })
      ).data,
      verifyNextStep: (
        await run(schema, prisma, SERVER, verify, {
          u: userA.id,
          c: hotp(secret, step + 1),
        })
      ).data,
      verifyRecovery: (
        await run(schema, prisma, SERVER, verify, {
          u: userA.id,
          c: recovery.toLowerCase(),
        })
      ).data,
      verifyRecoveryAgain: (
        await run(schema, prisma, SERVER, verify, { u: userA.id, c: recovery })
      ).data,
      hashesLeft:
        (await prisma.userTotp.findUnique({ where: { userId: userA.id } }))
          ?.recoveryCodesHash.length ?? -1,
    };
    delete process.env[TOTP_ENCRYPTION_KEY_ENV];
    (steps.totp as Record<string, unknown>).missingKey = (
      await run(schema, prisma, SERVER, verify, { u: userA.id, c: current })
    ).codes;
    process.env[TOTP_ENCRYPTION_KEY_ENV] = randomBytes(32).toString('base64');
    (steps.totp as Record<string, unknown>).disable = (
      await run(
        schema,
        prisma,
        SERVER,
        `mutation ($u: String!) { disableUserTotp(userId: $u) { ok } }`,
        { u: userA.id }
      )
    ).data;

    // 7. MandateVersion JSON shapes and tenant.
    const updateVersion = `mutation ($id: String!, $data: MandateVersionUpdateInput!) { updateOneMandateVersion(where: { id: $id }, data: $data) { id summary } }`;
    const badRow = { ...VALID_SCOPE, open: ['auto', 'notify', 'approve'] };
    steps.mandate = {
      invalidAutonomy: await run(schema, prisma, SERVER, updateVersion, {
        id: version.id,
        data: { autonomy: { ...VALID_AUTONOMY, event: badRow } },
      }),
      invalidTrigger: await run(schema, prisma, SERVER, updateVersion, {
        id: version.id,
        data: {
          triggers: [
            {
              id: 't1',
              label: 'Drawdown',
              condition: 'dd > 2%',
              route: 'You',
              deadlineMinutes: 0,
              defaultAction: 'halt',
              enabled: true,
            },
          ],
        },
      }),
      invalidNested: await run(
        schema,
        prisma,
        SERVER,
        `mutation ($id: String!, $data: MandateUpdateInput!) { updateOneMandate(where: { id: $id }, data: $data) { id } }`,
        {
          id: mandate.id,
          data: {
            versions: {
              update: [
                {
                  where: { id: version.id },
                  data: { instruments: [{ id: 'eq', label: 'Equities' }] },
                },
              ],
            },
          },
        }
      ),
      valid: await run(schema, prisma, SERVER, updateVersion, {
        id: version.id,
        data: {
          autonomy: VALID_AUTONOMY,
          triggers: [
            {
              id: 't1',
              label: 'Drawdown',
              condition: 'dd > 2%',
              route: 'You',
              deadlineMinutes: null,
              defaultAction: 'halt',
              enabled: true,
            },
          ],
          instruments: [{ id: 'eq', label: 'Equities', enabled: true }],
        },
      }),
    };
    process.env.MUTATION_AUTH_MODE = 'enforce';
    (steps.mandate as Record<string, unknown>).outsideTenant = await run(
      schema,
      prisma,
      C,
      updateVersion,
      {
        id: version.id,
        data: { summary: { set: 'from outside' } },
      }
    );
    (steps.mandate as Record<string, unknown>).insideTenant = await run(
      schema,
      prisma,
      A,
      updateVersion,
      {
        id: version.id,
        data: { summary: { set: 'from inside' } },
      }
    );
    delete process.env.MUTATION_AUTH_MODE;

    // 9. A staged model with a user-equality scope, under TENANCY_SCOPING_MODE=enforce.
    const preference = await prisma.notificationPreference.create({
      data: { userId: userA.id, eventId: `desk-it-${tag}`, channel: 'EMAIL', enabled: true },
    });
    process.env.TENANCY_SCOPING_MODE = 'enforce';
    steps.notificationPreferenceEnforced = {
      own: await list(A, 'notificationPreferences'),
      other: await list(B, 'notificationPreferences'),
      expectedOwn: [preference.id],
    };
    delete process.env.TENANCY_SCOPING_MODE;

    // 8. An unauthenticated desk write is refused in shadow.
    steps.unauthenticatedWrite = await run(
      schema,
      prisma,
      null,
      `mutation ($data: FollowCreateInput!) { createOneFollow(data: $data) { id } }`,
      {
        data: {
          user: { connect: { id: userA.id } },
          fund: { connect: { id: fund.id } },
          targetKind: 'event',
          targetId: 'E-1',
          level: 0,
        },
      }
    );
  } finally {
    await prisma.adaMessage.deleteMany({
      where: { conversation: { fundId: fund.id } },
    });
    await prisma.adaConversation.deleteMany({ where: { fundId: fund.id } });
    await prisma.follow.deleteMany({ where: { fundId: fund.id } });
    await prisma.pushSubscription.deleteMany({ where: { userId: userA.id } });
    await prisma.notificationPreference.deleteMany({ where: { userId: userA.id } });
    await prisma.featureFlagOverride.deleteMany({
      where: { userId: userA.id },
    });
    await prisma.userTotp.deleteMany({ where: { userId: userA.id } });
    await prisma.mandate.deleteMany({ where: { id: mandate.id } });
    await prisma.orgMembership.deleteMany({
      where: { organizationId: org.id },
    });
    await prisma.fund.delete({ where: { id: fund.id } });
    await prisma.organization.delete({ where: { id: org.id } });
    await prisma.user.deleteMany({
      where: { id: { in: [userA.id, userB.id, userC.id] } },
    });
    await prisma.$disconnect();
  }

  process.stdout.write(`<<<RESULTS>>>${JSON.stringify(steps)}<<<END>>>\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(
    `harness failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`
  );
  process.exit(1);
});

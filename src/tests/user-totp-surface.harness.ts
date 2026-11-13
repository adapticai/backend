/**
 * Builds the GraphQL schema exactly as src/server.ts assembles it and reports
 * every place the UserTotp secret columns (`secretEnc`, `recoveryCodesHash`)
 * appear in it, split by how a caller could use that place.
 *
 * The generated TypeGraphQL resolvers rely on `emitDecoratorMetadata`, which
 * vitest's esbuild transform does not emit, so this runs out of process under
 * ts-node (see src/middleware/__tests__/ts-node-harness.ts). Output is printed
 * between `<<<RESULTS>>>` and `<<<END>>>`.
 */
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import {
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
} from 'graphql';

import { resolvers } from '../generated/typegraphql-prisma';
import {
  BrokerageAccountCredentialStatusResolver,
  OptionsGreeksHistoryCustomResolver,
  TradingSettingsResolver,
} from '../resolvers/custom';
import {
  withoutServerOnlyResolvers,
  withoutServerOnlySchemaSurface,
} from '../config/server-only-models';

/** The UserTotp columns that must never be read or used as a predicate. */
const SECRET_COLUMNS = new Set(['secretEnc', 'recoveryCodesHash']);

/** Input types whose keys act as a filter, sort or cursor over the model. */
const PREDICATE_INPUT = /(Where|OrderBy|Having)/;

async function main(): Promise<void> {
  const schema = withoutServerOnlySchemaSurface(
    await buildSchema({
      resolvers: [
        ...withoutServerOnlyResolvers(resolvers),
        OptionsGreeksHistoryCustomResolver,
        TradingSettingsResolver,
        BrokerageAccountCredentialStatusResolver,
      ],
      validate: false,
    })
  );

  const outputs: string[] = [];
  const predicates: string[] = [];
  const writeInputs: string[] = [];
  const enumValues: string[] = [];

  for (const type of Object.values(schema.getTypeMap())) {
    if (type.name.startsWith('__')) continue;
    if (isObjectType(type) || isInterfaceType(type)) {
      for (const name of Object.keys(type.getFields())) {
        if (SECRET_COLUMNS.has(name)) outputs.push(`${type.name}.${name}`);
      }
    } else if (isInputObjectType(type)) {
      for (const name of Object.keys(type.getFields())) {
        if (!SECRET_COLUMNS.has(name)) continue;
        const ref = `${type.name}.${name}`;
        if (PREDICATE_INPUT.test(type.name)) predicates.push(ref);
        else writeInputs.push(ref);
      }
    } else if (isEnumType(type)) {
      for (const value of type.getValues()) {
        if (SECRET_COLUMNS.has(value.name)) {
          enumValues.push(`${type.name}.${value.name}`);
        }
      }
    }
  }

  const totp = schema.getType('UserTotp');
  const report = {
    outputs,
    predicates,
    writeInputs: writeInputs.sort(),
    enumValues,
    userTotpFields:
      totp && isObjectType(totp) ? Object.keys(totp.getFields()).sort() : [],
  };
  process.stdout.write(`<<<RESULTS>>>${JSON.stringify(report)}<<<END>>>\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`harness failed: ${String(error)}\n`);
  process.exit(1);
});

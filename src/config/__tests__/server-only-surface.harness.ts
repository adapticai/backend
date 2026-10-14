/**
 * Builds the GraphQL schema exactly as src/server.ts assembles it (generated
 * resolvers minus server-only models, residual surface stripped) and reports
 * anything of a server-only model that survives.
 *
 * The generated TypeGraphQL resolvers rely on `emitDecoratorMetadata`, which
 * vitest's esbuild transform does not emit, so this runs out of process under
 * ts-node (see src/middleware/__tests__/ts-node-harness.ts). Output is printed
 * between `<<<RESULTS>>>` and `<<<END>>>`.
 */
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { GraphQLObjectType, printSchema } from 'graphql';

import { resolvers } from '../../generated/typegraphql-prisma';
import {
  BrokerageAccountCredentialStatusResolver,
  OptionsGreeksHistoryCustomResolver,
  TradingSettingsResolver,
} from '../../resolvers/custom';
import {
  isServerOnlyTypeName,
  withoutServerOnlyResolvers,
  withoutServerOnlySchemaSurface,
} from '../server-only-models';

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
  const sdl = printSchema(schema);
  const tradeCount = schema.getType('TradeCount') as
    GraphQLObjectType | undefined;
  const report = {
    serverOnlyTypes: Object.keys(schema.getTypeMap()).filter(
      isServerOnlyTypeName
    ),
    sdlMentions: (sdl.match(/restatement/gi) ?? []).length,
    hasTrade: schema.getType('Trade') !== undefined,
    tradeCountFields: tradeCount ? Object.keys(tradeCount.getFields()) : [],
  };
  process.stdout.write(`<<<RESULTS>>>${JSON.stringify(report)}<<<END>>>\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`harness failed: ${String(error)}\n`);
  process.exit(1);
});

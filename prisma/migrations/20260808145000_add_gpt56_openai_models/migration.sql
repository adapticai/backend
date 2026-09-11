-- gpt-5.6 release tier aliases (in-flight platform work, landed 2026-08-08):
-- sol (flagship), terra (advanced), luna (normal). Postgres 12+ permits
-- multiple ALTER TYPE ... ADD VALUE statements inside one migration
-- transaction as long as the values are not consumed in the same
-- transaction, which prisma migrate deploy satisfies.
ALTER TYPE "OpenaiModel" ADD VALUE 'GPT_5_6_SOL';
ALTER TYPE "OpenaiModel" ADD VALUE 'GPT_5_6_TERRA';
ALTER TYPE "OpenaiModel" ADD VALUE 'GPT_5_6_LUNA';

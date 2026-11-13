-- AnthropicModel gained CLAUDE_FABLE_5 and CLAUDE_OPUS_5 in the schema
-- (7ea3710) without a migration, so a database built from the migration
-- history rejects those values and `prisma migrate diff` reports drift.
-- IF NOT EXISTS keeps this idempotent on a database where the values were
-- already added out of band. Postgres 12+ permits several ADD VALUE
-- statements in one migration transaction as long as the new values are not
-- used in the same transaction, which prisma migrate deploy satisfies.
ALTER TYPE "AnthropicModel" ADD VALUE IF NOT EXISTS 'CLAUDE_FABLE_5';
ALTER TYPE "AnthropicModel" ADD VALUE IF NOT EXISTS 'CLAUDE_OPUS_5';

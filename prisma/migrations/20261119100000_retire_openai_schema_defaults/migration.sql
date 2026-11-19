-- Retire the two schema defaults that named a retired LLM vendor.
--
-- Neither field has a production dispatch reader: the engine's `defaultProvider`
-- references are all the env-based LLM_DEFAULT_PROVIDER, a different setting, and
-- this repository's own references are generated CRUD pass-through. So these
-- defaults decide only what a FUTURE row or user receives, and the LlmConfiguration
-- table was measured empty (0 rows) when this was written, meaning no existing row
-- carries the old value and no backfill is required.
--
-- Both statements are catalogue-only: ALTER COLUMN ... SET/DROP DEFAULT rewrites no
-- rows and takes no long lock, and either is reversed by restoring the prior default.
--
-- `openaiModel` loses its default rather than gaining a new one, because its enum
-- holds only that vendor's models — there is no non-vendor value to default to, and
-- the column is nullable, so absent correctly means "the user has chosen no model"
-- instead of silently selecting one from a vendor that cannot serve.

-- AlterTable
ALTER TABLE "LlmConfiguration" ALTER COLUMN "defaultProvider" SET DEFAULT 'DEEPINFRA';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "openaiModel" DROP DEFAULT;

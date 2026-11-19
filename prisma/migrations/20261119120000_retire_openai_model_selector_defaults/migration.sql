-- Retire the two column defaults that select a retired LLM vendor.
--
-- A column default is the selector that applies to every row nobody set, which
-- makes it the only selector that grows: each new row inherits it, and the
-- selection is invisible because nobody made it. These two named a vendor that
-- no route may serve, so a row created without an explicit choice selected a
-- provider the system cannot reach.
--
-- Non-destructive in both directions. Altering a default rewrites no row and
-- reads no row: every existing value, explicit or previously defaulted, is
-- left exactly as it is, so this changes what the NEXT unset row resolves to
-- and nothing else. Neither column is NOT NULL on the user side, and the
-- configuration column keeps its NOT NULL with a value every insert satisfies.

-- AlterTable: an unset user preference stays unset rather than naming a vendor.
ALTER TABLE "users" ALTER COLUMN "openaiModel" DROP DEFAULT;

-- AlterTable: an unedited configuration row names the provider that serves.
ALTER TABLE "LlmConfiguration" ALTER COLUMN "defaultProvider" SET DEFAULT 'DEEPINFRA';

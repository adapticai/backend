-- DeepInfra joins the multi-provider routing surface as an inference host for
-- open-weight models. Every statement here is additive: no enum value is renamed
-- or dropped, no column is dropped, and no existing row's value changes.
--
-- Postgres 12+ permits ALTER TYPE ... ADD VALUE inside a migration transaction
-- as long as the new value is not consumed in the same transaction, which
-- `prisma migrate deploy` satisfies.

-- CreateEnum
-- Member names are the DeepInfra wire ids uppercased with "/", "-" and "."
-- folded to "_", because enum labels are identifiers and cannot carry those
-- characters. The callable id itself lives in the free-text model-id columns,
-- never here, which is why a namespaced host needs no schema change per model.
CREATE TYPE "DeepinfraModel" AS ENUM ('DEEPSEEK_AI_DEEPSEEK_V4_PRO', 'DEEPSEEK_AI_DEEPSEEK_V4_FLASH', 'DEEPSEEK_AI_DEEPSEEK_V4_1_FLASH', 'ZAI_ORG_GLM_5_3', 'ZAI_ORG_GLM_5_3_FLASH', 'MOONSHOTAI_KIMI_K3', 'OPENAI_GPT_OSS_120B', 'OPENAI_GPT_OSS_20B', 'INCLUSIONAI_LING_3_0_FLASH_FIN', 'NVIDIA_NEMOTRON_3_NANO_30B_A3B', 'QWEN_QWEN3_8_2_4T_A95B');

-- AlterEnum
ALTER TYPE "LlmProvider" ADD VALUE 'DEEPINFRA';

-- AlterTable
-- Nullable, so existing rows are unaffected and no backfill is required.
ALTER TABLE "LlmConfiguration" ADD COLUMN     "deepinfraApiKey" TEXT;

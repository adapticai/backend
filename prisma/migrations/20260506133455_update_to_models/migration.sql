-- CreateEnum
CREATE TYPE "AnthropicModel" AS ENUM ('CLAUDE_OPUS_4_7', 'CLAUDE_OPUS_4_6', 'CLAUDE_SONNET_4_6', 'CLAUDE_HAIKU_4_5');

-- CreateEnum
CREATE TYPE "DeepseekModel" AS ENUM ('DEEPSEEK_V4_PRO', 'DEEPSEEK_V4_FLASH', 'DEEPSEEK_CHAT', 'DEEPSEEK_REASONER');

-- CreateEnum
CREATE TYPE "KimiModel" AS ENUM ('KIMI_K2_6', 'KIMI_K2_5', 'KIMI_K2_0905_PREVIEW', 'KIMI_K2_TURBO_PREVIEW', 'KIMI_K2_THINKING', 'KIMI_K2_THINKING_TURBO');

-- CreateEnum
CREATE TYPE "QwenModel" AS ENUM ('QWEN3_MAX', 'QWEN3_5_PLUS', 'QWEN3_5_FLASH');

-- CreateEnum
CREATE TYPE "XaiModel" AS ENUM ('GROK_4_3', 'GROK_4_20', 'GROK_4_1_FAST', 'GROK_4', 'GROK_4_FAST_REASONING', 'GROK_4_FAST_NON_REASONING', 'GROK_3', 'GROK_3_MINI');

-- CreateEnum
CREATE TYPE "GeminiModel" AS ENUM ('GEMINI_3_1_PRO_PREVIEW', 'GEMINI_3_FLASH_PREVIEW', 'GEMINI_3_1_FLASH_LITE_PREVIEW');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OpenaiModel" ADD VALUE 'GPT_5_5';
ALTER TYPE "OpenaiModel" ADD VALUE 'GPT_5_5_PRO';
ALTER TYPE "OpenaiModel" ADD VALUE 'GPT_5_4';
ALTER TYPE "OpenaiModel" ADD VALUE 'GPT_5_4_MINI';
ALTER TYPE "OpenaiModel" ADD VALUE 'GPT_5_4_NANO';
ALTER TYPE "OpenaiModel" ADD VALUE 'O1';
ALTER TYPE "OpenaiModel" ADD VALUE 'O1_MINI';
ALTER TYPE "OpenaiModel" ADD VALUE 'O3';
ALTER TYPE "OpenaiModel" ADD VALUE 'O3_MINI';
ALTER TYPE "OpenaiModel" ADD VALUE 'O4_MINI';

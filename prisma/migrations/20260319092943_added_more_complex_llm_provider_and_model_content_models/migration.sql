-- CreateEnum
CREATE TYPE "LlmProvider" AS ENUM ('OPENAI', 'ANTHROPIC', 'DEEPSEEK', 'KIMI', 'QWEN', 'XAI', 'GEMINI');

-- CreateTable
CREATE TABLE "LlmConfiguration" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "defaultProvider" "LlmProvider" NOT NULL DEFAULT 'OPENAI',
    "miniProvider" "LlmProvider",
    "normalProvider" "LlmProvider",
    "advancedProvider" "LlmProvider",
    "miniModel" TEXT,
    "normalModel" TEXT,
    "advancedModel" TEXT,
    "openaiApiKey" TEXT,
    "anthropicApiKey" TEXT,
    "deepseekApiKey" TEXT,
    "kimiApiKey" TEXT,
    "qwenApiKey" TEXT,
    "xaiApiKey" TEXT,
    "geminiApiKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LlmConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LlmConfiguration_userId_key" ON "LlmConfiguration"("userId");

-- AddForeignKey
ALTER TABLE "LlmConfiguration" ADD CONSTRAINT "LlmConfiguration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

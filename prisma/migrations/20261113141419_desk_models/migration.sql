-- CreateEnum
CREATE TYPE "UserAvailability" AS ENUM ('desk', 'away', 'dnd');

-- CreateEnum
CREATE TYPE "FollowTargetKind" AS ENUM ('asset', 'event');

-- CreateEnum
CREATE TYPE "AutoFollowAction" AS ENUM ('follow_propose', 'follow_watch', 'never');

-- CreateEnum
CREATE TYPE "AdaMessageRole" AS ENUM ('user', 'ada');

-- CreateEnum
CREATE TYPE "DeskDecisionStatus" AS ENUM ('open', 'approved', 'amended', 'declined', 'defaulted');

-- CreateEnum
CREATE TYPE "StrategyKind" AS ENUM ('thematic', 'signal');

-- AlterTable
ALTER TABLE "mandate_versions" ADD COLUMN     "autonomy" JSONB,
ADD COLUMN     "exclusions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "instruments" JSONB,
ADD COLUMN     "triggers" JSONB;

-- AlterTable
ALTER TABLE "strategies" ADD COLUMN     "backtestJobId" TEXT,
ADD COLUMN     "kind" "StrategyKind",
ADD COLUMN     "spec" JSONB;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "availability" "UserAvailability" NOT NULL DEFAULT 'desk',
ADD COLUMN     "availabilityUntil" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "feature_flag_overrides" (
    "id" UUID NOT NULL,
    "flag" TEXT NOT NULL,
    "userId" UUID,
    "organizationId" UUID,
    "enabled" BOOLEAN NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flag_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "fundId" UUID NOT NULL,
    "targetKind" "FollowTargetKind" NOT NULL,
    "targetId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "riskBudgetPctNav" DECIMAL(9,6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auto_follow_rules" (
    "id" UUID NOT NULL,
    "fundId" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "action" "AutoFollowAction" NOT NULL,
    "destinationDesks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auto_follow_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_subscriptions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ada_conversations" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "fundId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "sharedWithOrg" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ada_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ada_messages" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "role" "AdaMessageRole" NOT NULL,
    "text" TEXT NOT NULL,
    "blocks" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ada_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_totps" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "secretEnc" TEXT NOT NULL,
    "enabledAt" TIMESTAMP(3),
    "recoveryCodesHash" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_totps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "desk_decisions" (
    "id" UUID NOT NULL,
    "fundId" UUID NOT NULL,
    "accountId" UUID,
    "kind" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "desk" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "nums" JSONB NOT NULL,
    "counterCase" TEXT NOT NULL,
    "ifIdle" TEXT NOT NULL,
    "facets" JSONB NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "defaultAction" TEXT NOT NULL,
    "amendLabel" TEXT,
    "reasonRequired" BOOLEAN NOT NULL,
    "status" "DeskDecisionStatus" NOT NULL DEFAULT 'open',
    "decidedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "desk_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "theme" TEXT,
    "density" TEXT,
    "deskPrefs" JSONB,
    "notificationPrefs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feature_flag_overrides_flag_idx" ON "feature_flag_overrides"("flag");

-- CreateIndex
CREATE INDEX "feature_flag_overrides_organizationId_idx" ON "feature_flag_overrides"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flag_overrides_flag_userId_organizationId_key" ON "feature_flag_overrides"("flag", "userId", "organizationId");

-- CreateIndex
CREATE INDEX "follows_fundId_idx" ON "follows"("fundId");

-- CreateIndex
CREATE UNIQUE INDEX "follows_userId_fundId_targetKind_targetId_key" ON "follows"("userId", "fundId", "targetKind", "targetId");

-- CreateIndex
CREATE INDEX "auto_follow_rules_fundId_idx" ON "auto_follow_rules"("fundId");

-- CreateIndex
CREATE INDEX "auto_follow_rules_ownerId_idx" ON "auto_follow_rules"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "push_subscriptions_endpoint_key" ON "push_subscriptions"("endpoint");

-- CreateIndex
CREATE INDEX "push_subscriptions_userId_idx" ON "push_subscriptions"("userId");

-- CreateIndex
CREATE INDEX "ada_conversations_userId_fundId_idx" ON "ada_conversations"("userId", "fundId");

-- CreateIndex
CREATE INDEX "ada_conversations_fundId_idx" ON "ada_conversations"("fundId");

-- CreateIndex
CREATE INDEX "ada_messages_conversationId_createdAt_idx" ON "ada_messages"("conversationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_totps_userId_key" ON "user_totps"("userId");

-- CreateIndex
CREATE INDEX "desk_decisions_fundId_status_dueAt_idx" ON "desk_decisions"("fundId", "status", "dueAt");

-- CreateIndex
CREATE INDEX "desk_decisions_accountId_idx" ON "desk_decisions"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- AddForeignKey
ALTER TABLE "feature_flag_overrides" ADD CONSTRAINT "feature_flag_overrides_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flag_overrides" ADD CONSTRAINT "feature_flag_overrides_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_follow_rules" ADD CONSTRAINT "auto_follow_rules_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_follow_rules" ADD CONSTRAINT "auto_follow_rules_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ada_conversations" ADD CONSTRAINT "ada_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ada_conversations" ADD CONSTRAINT "ada_conversations_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ada_messages" ADD CONSTRAINT "ada_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ada_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_totps" ADD CONSTRAINT "user_totps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desk_decisions" ADD CONSTRAINT "desk_decisions_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desk_decisions" ADD CONSTRAINT "desk_decisions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "alpaca_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Invariants Prisma cannot express in the schema. Prisma's migrate diff does
-- not model CHECK constraints or partial indexes, so these do not drift.

-- A follow level is 0 (watch), 1 (propose) or 2 (act within the risk budget).
ALTER TABLE "follows" ADD CONSTRAINT "follows_level_range_check" CHECK ("level" BETWEEN 0 AND 2);

-- An override targets exactly one principal: a user or an organization.
ALTER TABLE "feature_flag_overrides" ADD CONSTRAINT "feature_flag_overrides_one_target_check" CHECK (num_nonnulls("userId", "organizationId") = 1);

-- Postgres treats NULLs as distinct, so the composite unique key above never
-- rejects a duplicate: one of its two principal columns is always NULL. These
-- partial indexes make "one override per flag per principal" hold.
CREATE UNIQUE INDEX "feature_flag_overrides_flag_user_key" ON "feature_flag_overrides"("flag", "userId") WHERE "organizationId" IS NULL;
CREATE UNIQUE INDEX "feature_flag_overrides_flag_org_key" ON "feature_flag_overrides"("flag", "organizationId") WHERE "userId" IS NULL;

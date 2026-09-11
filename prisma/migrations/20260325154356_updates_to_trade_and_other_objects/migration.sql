-- AlterEnum (idempotent: IF NOT EXISTS prevents error if already added by failed migration)
ALTER TYPE "TradeStatus" ADD VALUE IF NOT EXISTS 'SUPERSEDED';

-- AlterTable: actions (idempotent: only add columns if they don't already exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'actions' AND column_name = 'supersededActionId') THEN
        ALTER TABLE "actions" ADD COLUMN "supersededActionId" UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'actions' AND column_name = 'triggerSource') THEN
        ALTER TABLE "actions" ADD COLUMN "triggerSource" TEXT;
    END IF;
END $$;

-- AlterTable: trades (idempotent: only add columns if they don't already exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trades' AND column_name = 'lastReunderwrittenAt') THEN
        ALTER TABLE "trades" ADD COLUMN "lastReunderwrittenAt" TIMESTAMP(3);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trades' AND column_name = 'supersededById') THEN
        ALTER TABLE "trades" ADD COLUMN "supersededById" UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trades' AND column_name = 'thesisVersion') THEN
        ALTER TABLE "trades" ADD COLUMN "thesisVersion" INTEGER NOT NULL DEFAULT 1;
    END IF;
END $$;

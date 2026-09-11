-- AlterTable
ALTER TABLE "options_positions" ADD COLUMN     "exitThresholds" JSONB,
ADD COLUMN     "lifecycleState" TEXT,
ADD COLUMN     "linkedRollId" UUID;

-- CreateTable
CREATE TABLE "options_position_events" (
    "id" UUID NOT NULL,
    "positionId" UUID NOT NULL,
    "fromState" TEXT NOT NULL,
    "toState" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "options_position_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "options_position_events_positionId_createdAt_idx" ON "options_position_events"("positionId", "createdAt");

-- CreateIndex
CREATE INDEX "options_position_events_createdAt_idx" ON "options_position_events"("createdAt");

-- CreateIndex
CREATE INDEX "options_positions_lifecycleState_idx" ON "options_positions"("lifecycleState");

-- AddForeignKey
ALTER TABLE "options_position_events" ADD CONSTRAINT "options_position_events_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "options_positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

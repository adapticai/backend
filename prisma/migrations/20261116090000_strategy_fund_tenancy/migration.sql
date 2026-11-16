-- Strategy fund tenancy (G-STR-06).
-- Additive only: one nullable column every existing row satisfies, its index,
-- and a foreign key to funds. An authored strategy (kind IS NOT NULL) is
-- stamped with its fund by createStrategyDraft; SYSTEM strategies keep NULL.

-- AlterTable
ALTER TABLE "strategies" ADD COLUMN     "fundId" UUID;

-- CreateIndex
CREATE INDEX "strategies_fundId_idx" ON "strategies"("fundId");

-- AddForeignKey
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

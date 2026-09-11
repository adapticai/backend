-- CreateIndex
CREATE INDEX "TradeOutcome_assetClass_createdAt_idx" ON "TradeOutcome"("assetClass", "createdAt");

-- CreateIndex
CREATE INDEX "TradeOutcome_symbol_createdAt_idx" ON "TradeOutcome"("symbol", "createdAt");

-- CreateIndex
CREATE INDEX "TradeOutcome_accountId_createdAt_idx" ON "TradeOutcome"("accountId", "createdAt");

-- CreateIndex
CREATE INDEX "MLModelVersion_assetClass_slot_idx" ON "MLModelVersion"("assetClass", "slot");

-- CreateIndex
CREATE INDEX "MLModelVersion_assetClass_trainedAt_idx" ON "MLModelVersion"("assetClass", "trainedAt");

-- CreateTable
CREATE TABLE "TradeOutcome" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT,
    "symbol" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "exitPrice" DOUBLE PRECISION NOT NULL,
    "entryTimestamp" TIMESTAMP(3) NOT NULL,
    "exitTimestamp" TIMESTAMP(3) NOT NULL,
    "holdDurationMinutes" DOUBLE PRECISION NOT NULL,
    "exitReason" TEXT NOT NULL,
    "grossReturnPct" DOUBLE PRECISION NOT NULL,
    "netReturnPct" DOUBLE PRECISION NOT NULL,
    "maxAdverseExcursionPct" DOUBLE PRECISION NOT NULL,
    "maxFavorableExcursionPct" DOUBLE PRECISION NOT NULL,
    "signalSource" TEXT NOT NULL,
    "transformerConfidence" DOUBLE PRECISION,
    "llmConfidence" DOUBLE PRECISION,
    "ensembleConfidence" DOUBLE PRECISION NOT NULL,
    "ensembleWeight" DOUBLE PRECISION NOT NULL,
    "regimeAtEntry" TEXT NOT NULL,
    "featureSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MLModelVersion" (
    "id" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "rankIC" DOUBLE PRECISION NOT NULL,
    "trainedAt" TIMESTAMP(3) NOT NULL,
    "promotedAt" TIMESTAMP(3),
    "checkpointPath" TEXT NOT NULL,
    "featureCount" INTEGER NOT NULL,
    "trainingSymbols" TEXT[],
    "trainingBarCount" INTEGER NOT NULL,
    "configSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MLModelVersion_pkey" PRIMARY KEY ("id")
);

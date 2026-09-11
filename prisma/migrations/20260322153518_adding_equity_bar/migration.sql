-- CreateEnum
CREATE TYPE "EquityBarTimespan" AS ENUM ('second', 'minute', 'hour', 'day');

-- CreateTable
CREATE TABLE "EquityBar" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "timeStamp" BIGINT NOT NULL,
    "timespan" "EquityBarTimespan" NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "vol" DOUBLE PRECISION NOT NULL,
    "vwap" DOUBLE PRECISION,
    "trades" INTEGER,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquityBar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EquityBar_symbol_timespan_timeStamp_idx" ON "EquityBar"("symbol", "timespan", "timeStamp");

-- CreateIndex
CREATE INDEX "EquityBar_timeStamp_idx" ON "EquityBar"("timeStamp");

-- CreateIndex
CREATE UNIQUE INDEX "EquityBar_symbol_timeStamp_timespan_key" ON "EquityBar"("symbol", "timeStamp", "timespan");

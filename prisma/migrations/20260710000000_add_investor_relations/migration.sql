-- CreateEnum
CREATE TYPE "InvestorType" AS ENUM ('INDIVIDUAL', 'JOINT', 'ENTITY', 'INSTITUTION', 'TRUST', 'RETIREMENT_ACCOUNT');

-- CreateEnum
CREATE TYPE "InvestorKycStatus" AS ENUM ('PENDING', 'REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InvestorStatus" AS ENUM ('PROSPECT', 'ONBOARDING', 'ACTIVE', 'INACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "HoldingStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "InvestorTransactionType" AS ENUM ('SUBSCRIPTION', 'REDEMPTION', 'CAPITAL_CALL', 'DISTRIBUTION', 'TRANSFER', 'FEE');

-- CreateEnum
CREATE TYPE "InvestorTransactionStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'SETTLED', 'REJECTED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "InvestorDocumentType" AS ENUM ('STATEMENT', 'REPORT', 'SUBSCRIPTION_AGREEMENT', 'OFFERING_MEMORANDUM', 'CAPITAL_CALL_NOTICE', 'DISTRIBUTION_NOTICE', 'KYC', 'TAX', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestorDocumentStatus" AS ENUM ('DRAFT', 'AVAILABLE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TaxDocumentType" AS ENUM ('K1', 'FORM_1099', 'FORM_1042S', 'FORM_8949', 'ANNUAL_SUMMARY', 'OTHER');

-- CreateEnum
CREATE TYPE "TaxDocumentStatus" AS ENUM ('PENDING', 'AVAILABLE', 'AMENDED', 'SUPERSEDED');

-- CreateTable
CREATE TABLE "investors" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID,
    "customerId" INTEGER,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "type" "InvestorType" NOT NULL DEFAULT 'INDIVIDUAL',
    "status" "InvestorStatus" NOT NULL DEFAULT 'ACTIVE',
    "kycStatus" "InvestorKycStatus" NOT NULL DEFAULT 'PENDING',
    "jurisdiction" TEXT,
    "joinedAt" TIMESTAMP(3),
    "externalRef" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "investors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holdings" (
    "id" UUID NOT NULL,
    "investorId" UUID NOT NULL,
    "fundId" UUID NOT NULL,
    "units" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costBasis" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "realizedPL" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "distributionsPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "HoldingStatus" NOT NULL DEFAULT 'ACTIVE',
    "firstInvestedAt" TIMESTAMP(3),
    "lastTransactionAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_transactions" (
    "id" UUID NOT NULL,
    "investorId" UUID NOT NULL,
    "fundId" UUID NOT NULL,
    "holdingId" UUID,
    "type" "InvestorTransactionType" NOT NULL,
    "status" "InvestorTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION,
    "units" DOUBLE PRECISION,
    "requestNav" DOUBLE PRECISION,
    "executionNav" DOUBLE PRECISION,
    "executedUnits" DOUBLE PRECISION,
    "fees" DOUBLE PRECISION,
    "netAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "requestedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "settledAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "notes" TEXT,
    "externalRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investor_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_documents" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "fundId" UUID,
    "investorId" UUID,
    "type" "InvestorDocumentType" NOT NULL,
    "status" "InvestorDocumentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "storageKey" TEXT,
    "version" TEXT NOT NULL DEFAULT '1',
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "effectiveDate" TIMESTAMP(3),
    "requiresAcknowledgment" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "investor_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_documents" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "investorId" UUID NOT NULL,
    "fundId" UUID,
    "taxYear" INTEGER NOT NULL,
    "formType" "TaxDocumentType" NOT NULL,
    "status" "TaxDocumentStatus" NOT NULL DEFAULT 'PENDING',
    "url" TEXT,
    "storageKey" TEXT,
    "issuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tax_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "investors_organizationId_idx" ON "investors"("organizationId");

-- CreateIndex
CREATE INDEX "investors_userId_idx" ON "investors"("userId");

-- CreateIndex
CREATE INDEX "investors_customerId_idx" ON "investors"("customerId");

-- CreateIndex
CREATE INDEX "investors_status_idx" ON "investors"("status");

-- CreateIndex
CREATE INDEX "holdings_fundId_idx" ON "holdings"("fundId");

-- CreateIndex
CREATE INDEX "holdings_investorId_idx" ON "holdings"("investorId");

-- CreateIndex
CREATE UNIQUE INDEX "holdings_investorId_fundId_key" ON "holdings"("investorId", "fundId");

-- CreateIndex
CREATE INDEX "investor_transactions_investorId_idx" ON "investor_transactions"("investorId");

-- CreateIndex
CREATE INDEX "investor_transactions_fundId_idx" ON "investor_transactions"("fundId");

-- CreateIndex
CREATE INDEX "investor_transactions_holdingId_idx" ON "investor_transactions"("holdingId");

-- CreateIndex
CREATE INDEX "investor_transactions_status_idx" ON "investor_transactions"("status");

-- CreateIndex
CREATE INDEX "investor_transactions_type_idx" ON "investor_transactions"("type");

-- CreateIndex
CREATE INDEX "investor_documents_organizationId_idx" ON "investor_documents"("organizationId");

-- CreateIndex
CREATE INDEX "investor_documents_fundId_idx" ON "investor_documents"("fundId");

-- CreateIndex
CREATE INDEX "investor_documents_investorId_idx" ON "investor_documents"("investorId");

-- CreateIndex
CREATE INDEX "investor_documents_type_idx" ON "investor_documents"("type");

-- CreateIndex
CREATE INDEX "tax_documents_organizationId_idx" ON "tax_documents"("organizationId");

-- CreateIndex
CREATE INDEX "tax_documents_investorId_idx" ON "tax_documents"("investorId");

-- CreateIndex
CREATE INDEX "tax_documents_fundId_idx" ON "tax_documents"("fundId");

-- CreateIndex
CREATE INDEX "tax_documents_taxYear_idx" ON "tax_documents"("taxYear");

-- AddForeignKey
ALTER TABLE "investors" ADD CONSTRAINT "investors_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investors" ADD CONSTRAINT "investors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investors" ADD CONSTRAINT "investors_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_transactions" ADD CONSTRAINT "investor_transactions_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_transactions" ADD CONSTRAINT "investor_transactions_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_transactions" ADD CONSTRAINT "investor_transactions_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "holdings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_documents" ADD CONSTRAINT "investor_documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_documents" ADD CONSTRAINT "investor_documents_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_documents" ADD CONSTRAINT "investor_documents_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_documents" ADD CONSTRAINT "tax_documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_documents" ADD CONSTRAINT "tax_documents_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_documents" ADD CONSTRAINT "tax_documents_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE SET NULL ON UPDATE CASCADE;


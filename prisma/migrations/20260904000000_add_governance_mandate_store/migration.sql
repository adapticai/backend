-- CreateEnum
CREATE TYPE "MandateScopeKind" AS ENUM ('ORGANIZATION', 'FUND');

-- CreateEnum
CREATE TYPE "MandateClass" AS ENUM ('STRATEGY_CHARTER', 'FIRM_ETHOS', 'APPROVAL_MATRIX', 'RISK_POLICY', 'SOP');

-- CreateEnum
CREATE TYPE "MandateStatus" AS ENUM ('DRAFTED', 'PROPOSED', 'APPROVED', 'SUPERSEDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MandateControlGate" AS ENUM ('AUTO', 'NOTIFY', 'APPROVAL', 'PROPOSE', 'HUMAN');

-- CreateEnum
CREATE TYPE "MandateLimitKind" AS ENUM ('MAX', 'MIN', 'TARGET', 'TRIGGER');

-- CreateTable
CREATE TABLE "mandates" (
    "id" UUID NOT NULL,
    "scopeKind" "MandateScopeKind" NOT NULL DEFAULT 'ORGANIZATION',
    "klass" "MandateClass" NOT NULL,
    "name" TEXT NOT NULL,
    "personaScope" TEXT,
    "organizationId" UUID NOT NULL,
    "fundId" UUID,
    "ownerId" UUID,
    "activeVersionId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "mandates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mandate_versions" (
    "id" UUID NOT NULL,
    "mandateId" UUID NOT NULL,
    "versionLabel" TEXT NOT NULL,
    "versionSeq" INTEGER NOT NULL,
    "status" "MandateStatus" NOT NULL DEFAULT 'DRAFTED',
    "summary" TEXT,
    "charterBody" JSONB,
    "authoredById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mandate_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mandate_rules" (
    "id" UUID NOT NULL,
    "mandateVersionId" UUID NOT NULL,
    "sectionId" TEXT,
    "label" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "control" "MandateControlGate" NOT NULL DEFAULT 'APPROVAL',
    "threshold" DOUBLE PRECISION,
    "unit" TEXT,
    "limitKind" "MandateLimitKind",
    "orderIdx" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mandate_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mandate_approvals" (
    "id" UUID NOT NULL,
    "mandateVersionId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "decidedByUserId" UUID,
    "decidedByRole" TEXT,
    "rationale" TEXT,
    "correlationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mandate_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mandates_activeVersionId_key" ON "mandates"("activeVersionId");

-- CreateIndex
CREATE INDEX "mandates_organizationId_idx" ON "mandates"("organizationId");

-- CreateIndex
CREATE INDEX "mandates_fundId_idx" ON "mandates"("fundId");

-- CreateIndex
CREATE INDEX "mandates_klass_idx" ON "mandates"("klass");

-- CreateIndex
CREATE INDEX "mandates_scopeKind_idx" ON "mandates"("scopeKind");

-- CreateIndex
CREATE INDEX "mandate_versions_mandateId_idx" ON "mandate_versions"("mandateId");

-- CreateIndex
CREATE INDEX "mandate_versions_status_idx" ON "mandate_versions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "mandate_versions_mandateId_versionSeq_key" ON "mandate_versions"("mandateId", "versionSeq");

-- CreateIndex
CREATE UNIQUE INDEX "mandate_versions_mandateId_versionLabel_key" ON "mandate_versions"("mandateId", "versionLabel");

-- CreateIndex
CREATE INDEX "mandate_rules_mandateVersionId_idx" ON "mandate_rules"("mandateVersionId");

-- CreateIndex
CREATE INDEX "mandate_rules_mandateVersionId_orderIdx_idx" ON "mandate_rules"("mandateVersionId", "orderIdx");

-- CreateIndex
CREATE INDEX "mandate_approvals_mandateVersionId_idx" ON "mandate_approvals"("mandateVersionId");

-- CreateIndex
CREATE INDEX "mandate_approvals_mandateVersionId_createdAt_idx" ON "mandate_approvals"("mandateVersionId", "createdAt");

-- CreateIndex
CREATE INDEX "mandate_approvals_decidedByUserId_idx" ON "mandate_approvals"("decidedByUserId");

-- AddForeignKey
ALTER TABLE "mandates" ADD CONSTRAINT "mandates_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandates" ADD CONSTRAINT "mandates_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandates" ADD CONSTRAINT "mandates_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandates" ADD CONSTRAINT "mandates_activeVersionId_fkey" FOREIGN KEY ("activeVersionId") REFERENCES "mandate_versions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mandate_versions" ADD CONSTRAINT "mandate_versions_mandateId_fkey" FOREIGN KEY ("mandateId") REFERENCES "mandates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandate_versions" ADD CONSTRAINT "mandate_versions_authoredById_fkey" FOREIGN KEY ("authoredById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandate_rules" ADD CONSTRAINT "mandate_rules_mandateVersionId_fkey" FOREIGN KEY ("mandateVersionId") REFERENCES "mandate_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandate_approvals" ADD CONSTRAINT "mandate_approvals_mandateVersionId_fkey" FOREIGN KEY ("mandateVersionId") REFERENCES "mandate_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandate_approvals" ADD CONSTRAINT "mandate_approvals_decidedByUserId_fkey" FOREIGN KEY ("decidedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;


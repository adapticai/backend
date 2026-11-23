-- Allocator office identity, roles, entity scope and record tagging
-- (AG-10, AG-29, GAP-MO-ORG-02 RoleAssignment, GAP-MO-ROLE-01, GAP-MO-WALL-03).
--
-- Additive only: every new column is nullable or carries a default that keeps
-- an existing row's meaning (an organization is a MANAGER; a membership sees no
-- office-owned entity until granted one; an audit entry is untagged), and no
-- existing column, value or constraint changes.

-- CreateEnum
CREATE TYPE "AuditWorkspace" AS ENUM ('STRATEGY', 'FUND', 'SHARED', 'ORGANISATION');

-- CreateEnum
CREATE TYPE "OrganizationKind" AS ENUM ('MANAGER', 'ALLOCATOR_OFFICE');

-- CreateEnum
CREATE TYPE "Workspace" AS ENUM ('STRATEGY', 'FUND', 'SHARED');

-- CreateEnum
CREATE TYPE "RoleScopeType" AS ENUM ('ORGANIZATION', 'FUND', 'SLEEVE');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('COO', 'SECOND_APPROVER', 'OVERSIGHT', 'VERIFIER');

-- AlterEnum


ALTER TYPE "OrgRole" ADD VALUE 'ALLOCATOR_PRINCIPAL';
ALTER TYPE "OrgRole" ADD VALUE 'INVESTMENT_LEAD';
ALTER TYPE "OrgRole" ADD VALUE 'OPERATIONS_LEAD';

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "workspace" "AuditWorkspace";

-- AlterTable
ALTER TABLE "investors" ADD COLUMN     "officeOrganizationId" UUID,
ADD COLUMN     "parentInvestorId" UUID,
ADD COLUMN     "registrationNumber" TEXT;

-- AlterTable
ALTER TABLE "org_memberships" ADD COLUMN     "entityScopeAll" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "entityScopeIds" UUID[] DEFAULT ARRAY[]::UUID[];

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "kind" "OrganizationKind" NOT NULL DEFAULT 'MANAGER',
ADD COLUMN     "timeZone" TEXT;

-- CreateTable
CREATE TABLE "entity_groups" (
    "id" UUID NOT NULL,
    "officeId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "investorIds" UUID[] DEFAULT ARRAY[]::UUID[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entity_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditor_grants" (
    "id" UUID NOT NULL,
    "officeOrganizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "entityIds" UUID[] DEFAULT ARRAY[]::UUID[],
    "periodFrom" TIMESTAMP(3) NOT NULL,
    "periodTo" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "grantedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditor_grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_assignments" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "WorkspaceRole" NOT NULL,
    "workspace" "Workspace" NOT NULL,
    "scopeType" "RoleScopeType" NOT NULL,
    "scopeId" UUID,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "grantedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "entity_groups_officeId_idx" ON "entity_groups"("officeId");

-- CreateIndex
CREATE INDEX "auditor_grants_officeOrganizationId_idx" ON "auditor_grants"("officeOrganizationId");

-- CreateIndex
CREATE INDEX "auditor_grants_userId_expiresAt_idx" ON "auditor_grants"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "role_assignments_organizationId_idx" ON "role_assignments"("organizationId");

-- CreateIndex
CREATE INDEX "role_assignments_userId_organizationId_idx" ON "role_assignments"("userId", "organizationId");

-- CreateIndex
CREATE INDEX "investors_parentInvestorId_idx" ON "investors"("parentInvestorId");

-- CreateIndex
CREATE INDEX "investors_officeOrganizationId_idx" ON "investors"("officeOrganizationId");

-- AddForeignKey
ALTER TABLE "entity_groups" ADD CONSTRAINT "entity_groups_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditor_grants" ADD CONSTRAINT "auditor_grants_officeOrganizationId_fkey" FOREIGN KEY ("officeOrganizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditor_grants" ADD CONSTRAINT "auditor_grants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investors" ADD CONSTRAINT "investors_parentInvestorId_fkey" FOREIGN KEY ("parentInvestorId") REFERENCES "investors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investors" ADD CONSTRAINT "investors_officeOrganizationId_fkey" FOREIGN KEY ("officeOrganizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Invariants Prisma cannot state, held by the database so an invalid row is
-- unrepresentable whoever writes it.

-- The audited period never ends before it starts.
ALTER TABLE "auditor_grants" ADD CONSTRAINT "auditor_grants_period_order_check" CHECK ("periodFrom" <= "periodTo");

-- An open-ended role has no end; a bounded one ends after it starts.
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_window_check" CHECK ("endsAt" IS NULL OR "endsAt" > "startsAt");

-- An organization-wide role names no scope id; a fund or sleeve role names one.
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_scope_id_check" CHECK (("scopeType" = 'ORGANIZATION') = ("scopeId" IS NULL));

-- An entity is never its own parent.
ALTER TABLE "investors" ADD CONSTRAINT "investors_parent_not_self_check" CHECK ("parentInvestorId" IS NULL OR "parentInvestorId" <> "id");

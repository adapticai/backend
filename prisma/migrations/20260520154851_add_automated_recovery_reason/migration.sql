-- Add AUTOMATED_RECOVERY value to RiskEscalationReason enum.
--
-- Companion to:
--   schema commit 7c6f48d (feat(schema): add AUTOMATED_RECOVERY to
--   RiskEscalationReason enum) — that commit only updated the Prisma
--   schema/types but did not generate a database migration. The Prisma
--   client accepts the value at validation time, but the Postgres enum
--   rejects it at INSERT time with `22P02 invalid input value for enum`.
--
-- Live evidence (2026-05-20T15:48:05Z):
--   Invalid `prisma.riskEscalationEvent.create()` invocation:
--   ConnectorError ... QueryError ... PostgresError code 22P02:
--   invalid input value for enum "RiskEscalationReason": "AUTOMATED_RECOVERY"
--
-- Postgres enum ALTER is non-transactional for new values; runs cleanly
-- on a live database without taking write locks against
-- RiskEscalationEvent.

ALTER TYPE "RiskEscalationReason" ADD VALUE IF NOT EXISTS 'AUTOMATED_RECOVERY';

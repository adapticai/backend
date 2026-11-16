-- Strategy submission awaiting approval (G-STR-04).
-- Additive only: one new enum value, ordered after DRAFT. No existing row
-- holds it, so every reader and writer is unchanged until the engine's
-- submission writes it. IF NOT EXISTS lets a re-run after a partial apply
-- converge.

-- AlterEnum
ALTER TYPE "StrategyLifecycleState" ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL' AFTER 'DRAFT';

#!/usr/bin/env bash
#
# validate-schema.sh
#
# Validates the Prisma schema and checks for generated-code drift.
# Intended for use in CI pipelines (e.g., GitHub Actions) on every PR that
# touches prisma/schema.prisma or src/generated/.
#
# Exit codes:
#   0 - Schema is valid, generation succeeds, no drift detected
#   1 - Validation or generation failure
#   2 - Generated code drift detected (schema changed but generated files were not updated)
#
# Usage:
#   bash scripts/validate-schema.sh
#   npm run validate:schema

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "================================================"
echo "  Prisma Schema Validation"
echo "================================================"
echo ""

# Step 1: Validate schema syntax
echo "[1/3] Validating Prisma schema syntax..."
if npx prisma validate; then
  echo "  --> Schema syntax is valid."
else
  echo "  --> ERROR: Schema syntax validation failed."
  exit 1
fi
echo ""

# Step 2: Run prisma generate to verify code generation works
echo "[2/3] Running prisma generate (checking code generation)..."
if SKIP_PRISMA_VERSION_CHECK=true npx prisma generate; then
  echo "  --> Code generation succeeded."
else
  echo "  --> ERROR: Code generation failed."
  exit 1
fi
echo ""

# Step 3: Check for uncommitted changes in generated files (drift detection)
echo "[3/3] Checking for generated code drift..."
if git diff --quiet -- src/generated/ 2>/dev/null; then
  echo "  --> No drift detected. Generated code is up to date."
else
  echo "  --> WARNING: Drift detected in src/generated/"
  echo ""
  echo "  The following generated files have changed after running prisma generate:"
  echo ""
  git diff --stat -- src/generated/ 2>/dev/null || true
  echo ""
  echo "  This means the schema was updated but the generated code was not regenerated."
  echo "  Please run 'npm run generate' and commit the updated files."
  echo ""
  exit 2
fi

echo ""
echo "================================================"
echo "  All schema validations passed."
echo "================================================"

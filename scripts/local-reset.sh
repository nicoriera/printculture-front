#!/bin/bash
set -euo pipefail

if [ ! -f .env.local ]; then
  echo "Error: .env.local not found."
  echo "Run: cp .env.local.example .env.local and fill in the values."
  exit 1
fi

# Load .env.local into environment
set -a
# shellcheck disable=SC1091
source .env.local
set +a

echo "→ Pushing Prisma schema to local database..."
npx prisma db push --skip-generate

echo "→ Seeding local database..."
npx prisma db seed

echo "✓ Local database ready"

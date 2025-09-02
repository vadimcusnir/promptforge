#!/bin/bash
set -euo pipefail

FILES=$(rg -n "import.*Header|import.*Footer" app | rg -v "app/layout.tsx|app/admin/layout.tsx" || true)
if [ -n "$FILES" ]; then
  echo "❌ Header/Footer detectate în pagini. Folosește doar în app/layout.tsx:"
  echo "$FILES"
  exit 1
fi
echo "✓ No duplicate Header/Footer"

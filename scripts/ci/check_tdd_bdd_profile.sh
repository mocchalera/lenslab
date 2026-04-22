#!/usr/bin/env bash
set -euo pipefail

required=(
  "docs/testing/TDD_BDD_POLICY.md"
  "docs/testing/BDD_SCENARIOS.md"
  "docs/testing/QUALITY_GATES.md"
  "prompts/codex/tdd_cycle_prompt.md"
  "prompts/codex/bdd_spec_prompt.md"
  "scripts/ci/check_tdd_bdd_profile.sh"
)

missing=0
for path in "${required[@]}"; do
  if [[ ! -f "$path" ]]; then
    echo "missing: $path" >&2
    missing=1
  fi
done

if [[ -f "docs/testing/TDD_BDD_POLICY.md" ]]; then
  if ! grep -q "Red -> Green -> Refactor" "docs/testing/TDD_BDD_POLICY.md"; then
    echo "TDD_BDD_POLICY.md must include Red -> Green -> Refactor." >&2
    missing=1
  fi
fi

if [[ "$missing" -ne 0 ]]; then
  exit 1
fi

echo "check_tdd_bdd_profile.sh: OK"

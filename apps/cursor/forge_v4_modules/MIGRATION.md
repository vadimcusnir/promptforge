# Migration Plan (v3 → v4)

1) **Create canonical schema** (`lib/module.schema.ts`). Commit.
2) **Introduce catalog JSON** (`lib/modules.catalog.json`) as data SSOT. Commit.
3) **Write mapping functions** (`lib/module.mapping.ts`) for v3 fields → v4. Commit.
4) **Build API route** (`app/api/modules/route.ts`). Commit.
5) **Refactor UI** (`app/modules/page.tsx`) to consume API, render 50, add filters + overlay. Commit.
6) **Update ruleset.yml** with v4 plans (Free/Creator/Pro/Enterprise) and gating. Commit.
7) **Tests** (`tests/modules.spec.ts`) and CI gate to block deploy on invalid catalog. Commit.
8) **Populate all 50 modules** in catalog (replace TBD). Commit.
9) **QA** against DoD.

## DoD (Definition of Done)
- [ ] 50/50 modules visible with correct badges (vectors, difficulty, plan).
- [ ] Filters functional; page Lighthouse ≥ 90.
- [ ] API returns validated catalog; schema passes in CI.
- [ ] Plan gates enforced FE + API.
- [ ] 3 demo bundles download from landing reflect new catalog.

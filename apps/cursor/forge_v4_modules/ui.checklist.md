# UI Changes — /app/modules/page.tsx

- Fetch from /api/modules (SSR or RSC) and render all 50.
- Filters:
  [ ] Search by title/tag
  [ ] Vectors (multi-select: strategic, rhetoric, content, analytics, branding, crisis, cognitive)
  [ ] Difficulty (1–5; display label via `labelForDifficulty`)
  [ ] Plan gates (badge for minPlan; disable CTA if user plan < minPlan)
- Card → Overlay (Module Detail Overlay):
  - Title + ™ where applicable
  - Vectors chips
  - Difficulty badge (label)
  - Min plan badge
  - Summary + outputs
  - CTA: Simulate (all), Run Real Test (Pro+), Export (gated)

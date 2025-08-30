# Component Spec — PromptForge v4

## 1. NavBar
- Left: logo + "PromptForge™"
- Center: tabs → Landing, Generator, Pricing, Dashboard, API Docs
- Right: plan badge, avatar menu
- Behavior: sticky, 80px, subtle border, keyboard focus ring

## 2. ModuleCard
- Props: id, title, vectors[], difficulty(1–5), minPlan, summary
- Badges: vectors chips, difficulty label, minPlan gate
- CTA: View → opens ModuleOverlay

## 3. ModuleOverlay
- Sections: Overview, Inputs (7D), Outputs, KPIs, Guardrails
- Footer CTA: Simulate (all), Run Real Test (Pro+), Export (gated)
- Close: ESC, X button; trap focus; scroll lock

## 4. FilterBar
- Search input (cmd+k), Vectors multi-select, Difficulty slider (1–5), Plan select
- Chip filters; clear-all

## 5. BadgePlan
- Free/Creator/Pro/Enterprise; color-coded; tooltip w/ rights

## 6. DifficultyMeter
- 5-step meter; label: Beginner → Expert; `aria-valuenow`

## 7. TelemetryBadge
- run_id, score, duration; subdued pill; copy-to-clipboard

## 8. ExportMenu
- Options shown per entitlement; disabled with reason tooltip

## 9. Toast/Inline Errors
- Non-blocking; include resolution tips; respect prefers-reduced-motion

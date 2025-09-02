# PromptForge v4 — Module Sync Solution
Date: 2025-08-30

This bundle proposes a concrete, code-first fix to **synchronize the 50-module backend (M01–M50)** with the frontend UI,
standardize taxonomy (categories/vectors), normalize difficulty, and enforce plan gates (Free, Creator, Pro, Enterprise).

## What you get
1) **Canonical schema (Zod + TS types)** shared by backend & frontend.
2) **Mapping layer** that converts legacy v3 fields → v4 canonical (categories, difficulty, plans).
3) **API route** (`/api/modules`) returning fully-gated, validated module catalog.
4) **UI checklist** to render all 50 modules with filters + detail overlay.
5) **Ruleset excerpt** updating SSOT gating & validation.
6) **Tests & CI checks** (Vitest) to guarantee consistency (50 items, unique IDs, valid gates).
7) **Migration plan** with commit sequence and DoD.

> Ship small, true loops. Data SSOT = `lib/modules.catalog.json` + schema guard.

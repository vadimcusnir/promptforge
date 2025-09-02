// /apps/cursor/init.js — SSOT: reguli hard pentru Cursor/agenți (CommonJS)
const CURSOR_INIT = {
  meta: {
    project: "PromptForge",
    source_of_truth: "/apps/cursor/init.js",
    last_updated: "2025-09-02",
  },

  // 0) Mod ANALYZE (raportare-only)
  analysis: {
    allow_soft_fail_via_env: true, // dacă ANALYZE=true -> nu aruncă erori, doar raportează
  },

  // 1) INTERDICȚII ABSOLUTE (au prioritate peste orice)
  //    NIMIC din design/ui/layout/tokens/imagini comune NU poate fi atins.
  git_protect: {
    deny_changes: [
      // Layout & schelet UI global
      "**/app/layout.tsx",
      "**/components/header.tsx",
      "**/components/footer.tsx",
      "**/components/nav.tsx",
      "**/components/navigation.tsx",

      // Biblioteci și stiluri vizuale
      "**/components/**",          // orice componentă UI existentă
      "**/styles/**",
      "**/theme/**",
      "**/tokens/**",
      "**/design.tokens.*",
      "**/.storybook/**",

      // Configuri de design/build vizual
      "**/tailwind.config.*",
      "**/postcss.config.*",
      "**/next-seo.config.*",

      // Asset-uri publice/imagini/iconuri (pot rupe identitatea)
      "**/public/**",
      "**/icons/**",

      // Zone senzitive business
      "**/stripe/**",              // plăți — schimbări controlate separat
      "**/supabase/**",            // RLS/migrări doar via scripturi aprobate
    ],
    // dacă vrei excepții punctuale (de ex: .env local), adaugi aici
    allow_changes: [
      // exemple:
      // "!apps/site-v4-manus/promptforge_production/source/src/lib/api.ts",
      // "!apps/site-v4-manus/promptforge_production/source/.env*",
    ],
  },

  // 2) WHITELIST (zone în care AI-ul are voie să MODIFICE cod)
  //    Orice modificare în afara acestor patternuri va fi marcată ca „nepermisă”.
  allow_paths: [
    "apps/site-v4/app/api/**",     // endpoints Next API
    "apps/site-v4/lib/**",         // logică non-UI
    "apps/site-v4/server/**",      // utilitare server-only
    "apps/site-v4/infra/**",       // infrastructură locală
    "apps/site-v4/utils/**",       // helpers non-UI
    "apps/site-v4/middleware.ts",
    "apps/site-v4/next.config.mjs",

    // Docs/knowledge (dacă migrezi conținut generat)
    "cursor/**",
    "content/**",
    "docs/**",

    // Teste / hook-uri / scripturi (auxiliare, nu UI)
    "__tests__/**",
    "hooks/**",
    "scripts/**",
  ],

  // 3) PRE-FLIGHT (blochează dacă pică și nu e ANALYZE=true)
  preflight_checks: {
    must_pass: [
      "lint",
      "typecheck",
      "build:site-v4"
    ],
    block_on_fail: true,
  },

  // 4) Politici pe PR/branch (informațional; poți aplica și în CI)
  code_change_policy: {
    mode: "pr_only",
    require_reviews: 2,
    forbid_direct_push_to: ["main", "prod", "stable"],
    enforce_branch_naming: "^(feat|fix|chore|docs|refactor)/[a-z0-9._-]+$",
    enforce_commit_msg: "^(feat|fix|chore|docs|refactor): .{10,}$",
  },
};

module.exports = { CURSOR_INIT };

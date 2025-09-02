// SSOT reguli hard (CommonJS) — STRÂNS pentru root app (ai mutat site-ul la rădăcină)
const CURSOR_INIT = {
  meta: { project: "PromptForge", source_of_truth: "/apps/cursor/init.js", last_updated: "2025-09-02" },

  // ANALYZE=true => nu aruncă erori, doar raportează
  analysis: { allow_soft_fail_via_env: true },

  // 1) INTERDICȚII ABSOLUTE — nu se ating fișierele de UI/Design/Schema
  git_protect: {
    deny_changes: [
      // App Router & schelet UI
      "app/layout.tsx", "app/**/layout.tsx", "app/ClientRootLayout.tsx", "app/globals.css", "app/styles/**",
      // Bibliotecă UI & assets comune
      "components/**", "public/**", "icons/**", "tokens/**", "design.tokens.*",
      // Configuri vizuale critice
      "tailwind.config.*", "postcss.config.*", ".storybook/**",
      // Zone sensibile business
      "stripe/**", "supabase/**"
    ],
    allow_changes: [
      "package.json",
      "pnpm-lock.yaml"
    ]
  },

  // 2) WHITELIST — DOAR aici are voie să modifice
  allow_paths: [
    "app/api/**", "lib/**", "server/**", "infra/**", "utils/**",
    "middleware.ts", "next.config.mjs",
    "cursor/**", "content/**", "docs/**", "__tests__/**", "hooks/**", "scripts/**"
  ],

  // 3) PRE-FLIGHT — blochează pe fail în modul strict
  preflight_checks: { must_pass: ["lint", "typecheck", "build:root"], block_on_fail: true },

  // 4) Politici PR/branch (informațional — recomand să le pui și în CI/Git hooks)
  code_change_policy: {
    mode: "pr_only",
    require_reviews: 2,
    forbid_direct_push_to: ["main", "prod", "stable"],
    enforce_branch_naming: "^(feat|fix|chore|docs|refactor)/[a-z0-9._-]+$",
    enforce_commit_msg: "^(feat|fix|chore|docs|refactor): .{10,}$"
  }
};

module.exports = { CURSOR_INIT };

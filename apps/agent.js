// /apps/agent.js — Executor STRICT (CommonJS)
// - blochează dif-urile interzise (design/layout/tokens/...)
// - asigură că modificările sunt doar în allow_paths (whitelist)
// - rulează preflight (lint, typecheck, build:site-v4)
// - ANALYZE=true => doar raportează, nu blochează

const { CURSOR_INIT } = require("./cursor/init.js");
const picomatch = require("picomatch");
const { execSync } = require("node:child_process");

function run(cmd) {
  return execSync(cmd, { stdio: "inherit" });
}
function collect(cmd) {
  return execSync(cmd, { stdio: ["pipe", "pipe", "inherit"] }).toString();
}
function asMatchers(globs = []) {
  return globs.map((g) => picomatch(g, { dot: true }));
}

function listChangedFiles() {
  // combini staged + unstaged ca să nu existe „găuri”
  const a = collect("git diff --name-only").split("\n");
  const b = collect("git diff --name-only --cached").split("\n");
  return [...new Set([...a, ...b].map((s) => s.trim()).filter(Boolean))];
}

function assertProtectedDiff() {
  const changed = listChangedFiles();
  const denies = asMatchers(CURSOR_INIT.git_protect.deny_changes || []);
  const allows = asMatchers(CURSOR_INIT.git_protect.allow_changes || []);
  const allowPaths = asMatchers(CURSOR_INIT.allow_paths || []);

  const violations = [];
  const notWhitelisted = [];

  for (const file of changed) {
    // excepții explicite (allow_changes) au prioritate
    if (allows.some((ok) => ok(file))) continue;

    // 1) Interdicție absolută
    if (denies.some((deny) => deny(file))) {
      violations.push(file);
      continue;
    }

    // 2) Dacă NU e pe whitelist → marcat separat (nu interzis absolut, dar blocăm)
    if (!allowPaths.some((ok) => ok(file))) {
      notWhitelisted.push(file);
    }
  }

  const hasViol = violations.length > 0;
  const hasOutside = notWhitelisted.length > 0;
  const analyze = process.env.ANALYZE === "true" && CURSOR_INIT.analysis?.allow_soft_fail_via_env;

  if (hasViol || hasOutside) {
    const msg =
      (hasViol
        ? "FORBIDDEN (design/layout/etc.):\n" + violations.map((v) => "  – " + v).join("\n")
        : "") +
      (hasViol && hasOutside ? "\n\n" : "") +
      (hasOutside
        ? "OUTSIDE WHITELIST (nu e în allow_paths):\n" + notWhitelisted.map((v) => "  – " + v).join("\n")
        : "") +
      "\n\nSetează ANALYZE=true ca să vezi raport doar, fără blocare.";

    if (analyze) {
      console.log("[ANALYZE MODE]\n" + msg);
      return;
    }
    throw new Error(msg);
  }
}

function runPreflight() {
  const steps = CURSOR_INIT.preflight_checks?.must_pass || [];
  const analyze = process.env.ANALYZE === "true" && CURSOR_INIT.analysis?.allow_soft_fail_via_env;

  const cmds = {
    lint: "pnpm -s lint",
    typecheck: "pnpm -s typecheck || pnpm -s type-check",
    "build:site-v4": "pnpm -s build --filter site-v4 || pnpm -s build",
  };

  for (const step of steps) {
    const cmd = cmds[step];
    if (!cmd) continue;
    try {
      run(cmd);
    } catch (e) {
      const msg = `Preflight failed on step: ${step}`;
      if (analyze && CURSOR_INIT.preflight_checks?.block_on_fail) {
        console.warn("[ANALYZE MODE] " + msg);
        continue;
      }
      if (CURSOR_INIT.preflight_checks?.block_on_fail) {
        throw new Error(msg);
      } else {
        console.warn(msg);
      }
    }
  }
}

function guardedApply() {
  assertProtectedDiff();
  runPreflight();
  console.log("OK: rules passed. Proceed.");
}

module.exports = { guardedApply };

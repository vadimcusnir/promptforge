// Executor STRICT (CommonJS) — blochează dif-urile interzise + preflight
const { CURSOR_INIT } = require("./cursor/init.js");
const picomatch = require("picomatch");
const { execSync } = require("node:child_process");

function run(cmd) { return execSync(cmd, { stdio: "inherit" }); }
function collect(cmd) { return execSync(cmd, { stdio: ["pipe","pipe","inherit"] }).toString(); }
function matchers(globs=[]) { return globs.map(g => picomatch(g, { dot: true })); }

function changedFiles() {
  const a = collect("git diff --name-only").split("\n");
  const b = collect("git diff --name-only --cached").split("\n");
  return [...new Set([...a, ...b].map(s => s.trim()).filter(Boolean))];
}

function assertProtectedDiff() {
  const files = changedFiles();
  const denies = matchers(CURSOR_INIT.git_protect.deny_changes || []);
  const allows = matchers(CURSOR_INIT.git_protect.allow_changes || []);
  const whitelist = matchers(CURSOR_INIT.allow_paths || []);
  const violations = [];
  const outside = [];

  for (const f of files) {
    if (allows.some(ok => ok(f))) continue;          // excepții explicite
    if (denies.some(ko => ko(f))) { violations.push(f); continue; } // hard-block
    if (!whitelist.some(ok => ok(f))) outside.push(f);              // în afara whitelist-ului
  }

  const analyze = process.env.ANALYZE === "true" && CURSOR_INIT.analysis?.allow_soft_fail_via_env;
  if (violations.length || outside.length) {
    const msg =
      (violations.length ? "FORBIDDEN (design/layout/etc.):\n" + violations.map(v=>"  – "+v).join("\n") : "") +
      (violations.length && outside.length ? "\n\n" : "") +
      (outside.length ? "OUTSIDE WHITELIST (în afara allow_paths):\n" + outside.map(v=>"  – "+v).join("\n") : "") +
      "\n\nSetează ANALYZE=true pentru raport doar.";
    if (analyze) { console.log("[ANALYZE MODE]\n"+msg); return; }
    throw new Error(msg);
  }
}

function runPreflight() {
  const steps = CURSOR_INIT.preflight_checks?.must_pass || [];
  const analyze = process.env.ANALYZE === "true" && CURSOR_INIT.analysis?.allow_soft_fail_via_env;
  const cmds = {
    lint: "pnpm -s lint",
    typecheck: "pnpm -s typecheck || pnpm -s type-check",
    "build:root": "pnpm -s build || pnpm -s next build"
  };
  for (const step of steps) {
    const cmd = cmds[step]; if (!cmd) continue;
    try { run(cmd); } catch (_e) {
      const msg = `Preflight failed on step: ${step}`;
      if (analyze && CURSOR_INIT.preflight_checks?.block_on_fail) { console.warn("[ANALYZE MODE] "+msg); continue; }
      if (CURSOR_INIT.preflight_checks?.block_on_fail) throw new Error(msg);
      console.warn(msg);
    }
  }
}

function guardedApply() {
  assertProtectedDiff();
  runPreflight();
  console.log("OK: rules passed. Proceed.");
}

module.exports = { guardedApply };

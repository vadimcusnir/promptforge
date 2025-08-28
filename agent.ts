/**
 * agent.ts — Cursor Agent pentru PROMPTFORGE™ v3.0
 * FINAL • STRICT • NON-DEVIATION
 *
 * Principiu: /cursor/init este sursa unică de adevăr (SSOT).
 * Orice acțiune în afara regulilor → blocată imediat cu verdict explicit.
 */

import fs from "node:fs";
import path from "node:path";

// ————————————————————————————————————————————————
// Tipuri canonice
// ————————————————————————————————————————————————
type FileSpec = {
  path?: string;
  paths?: string[];
  role: string;
  interaction: "read_only" | "compile_apply" | "reference_apply" | "reference_generate";
};

type CursorInit = {
  meta: { project: string; source_of_truth: string; last_updated: string };
  directories: { root: string; docs_root: string; docs_subfolders: string[] };
  precedence: { order: { id: string; path?: string; paths?: string[]; level: number }[] };
  docs_routing: { write_allowed: string[]; write_forbidden: string[]; migrations_target: string; licensing_target: string; bundles_target: string };
  non_deviation_laws: { id: number; text: string }[];
};

// ————————————————————————————————————————————————
// Utilitare de bază
// ————————————————————————————————————————————————
function fail(reason: string, violatedLaw: number): never {
  throw new Error(`[AGENT BLOCKED] Law ${violatedLaw} violated → ${reason}`);
}

function readInit(abs: string): CursorInit {
  if (!fs.existsSync(abs)) fail(`Missing init at: ${abs}`, 1);
  const raw = fs.readFileSync(abs, "utf8").trim();
  try {
    return JSON.parse(raw) as CursorInit;
  } catch (e) {
    fail(`/cursor/init is not valid JSON: ${String(e)}`, 1);
  }
}

// ————————————————————————————————————————————————
// Încărcare INIT & legi
// ————————————————————————————————————————————————
const INIT_PATH = process.env.CURSOR_INIT_PATH || "/cursor/init";
const INIT = readInit(INIT_PATH);

const ROOT = path.resolve(INIT.directories.root);
const DOCS_ROOT = path.resolve(INIT.directories.docs_root);
const WRITE_ALLOWED = INIT.docs_routing.write_allowed.map(p => path.resolve(p));
const WRITE_FORBIDDEN = INIT.docs_routing.write_forbidden.map(p => path.resolve(p));
const LAWS = Object.freeze(INIT.non_deviation_laws);

// ————————————————————————————————————————————————
// Tipuri de acțiuni
// ————————————————————————————————————————————————
type Action =
  | { kind: "READ"; target: string }
  | { kind: "WRITE" | "DELETE"; target: string }
  | { kind: "GENERATE"; targetDir: string }
  | { kind: "MIGRATE"; targetDir?: string }
  | { kind: "EXPORT"; targetDir: string }
  | { kind: "LICENSE_CHECK" };

type Verdict = { allowed: true } | { allowed: false; violatedLaw: number; reason: string };

// ————————————————————————————————————————————————
// Verificator dur
// ————————————————————————————————————————————————
function isUnder(base: string, candidate: string): boolean {
  const rel = path.relative(base, candidate);
  return !!rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}

function check(action: Action): Verdict {
  switch (action.kind) {
    case "READ": {
      const t = path.resolve(action.target);
      if (!t.startsWith(ROOT)) return { allowed: false, violatedLaw: 3, reason: `Read outside /cursor: ${t}` };
      return { allowed: true };
    }

    case "WRITE":
    case "DELETE": {
      const t = path.resolve(action.target);
      if (WRITE_FORBIDDEN.includes(t)) return { allowed: false, violatedLaw: 2, reason: `Target forbidden: ${t}` };
      if (!isUnder(DOCS_ROOT, t)) return { allowed: false, violatedLaw: 3, reason: `Writes only allowed under ${DOCS_ROOT}` };
      const inAllowed = WRITE_ALLOWED.some(dir => isUnder(dir, t) || dir === t);
      if (!inAllowed) return { allowed: false, violatedLaw: 3, reason: `Not whitelisted: ${t}` };
      return { allowed: true };
    }

    case "GENERATE": {
      const dir = path.resolve(action.targetDir);
      if (!isUnder(DOCS_ROOT, dir)) return { allowed: false, violatedLaw: 3, reason: `Generate only under ${DOCS_ROOT}` };
      const inAllowed = WRITE_ALLOWED.some(d => isUnder(d, dir) || d === dir);
      if (!inAllowed) return { allowed: false, violatedLaw: 3, reason: `Not whitelisted: ${dir}` };
      return { allowed: true };
    }

    case "MIGRATE": {
      const dir = path.resolve(action.targetDir ?? INIT.docs_routing.migrations_target);
      if (dir !== path.resolve(INIT.docs_routing.migrations_target)) return { allowed: false, violatedLaw: 8, reason: `Migrations only in ${INIT.docs_routing.migrations_target}` };
      return { allowed: true };
    }

    case "EXPORT": {
      const dir = path.resolve(action.targetDir);
      if (dir !== path.resolve(INIT.docs_routing.bundles_target)) return { allowed: false, violatedLaw: 1, reason: `Exports only in ${INIT.docs_routing.bundles_target}` };
      return { allowed: true };
    }

    case "LICENSE_CHECK": {
      const ent = path.resolve("/cursor/forge_v3_standard_entitlements.txt");
      if (!fs.existsSync(ent)) return { allowed: false, violatedLaw: 7, reason: `Missing entitlements: ${ent}` };
      return { allowed: true };
    }

    default:
      return { allowed: false, violatedLaw: 5, reason: `Unknown or unsupported action` };
  }
}

// ————————————————————————————————————————————————
// API public Agent
// ————————————————————————————————————————————————
export const CursorAgent = {
  info() {
    return {
      project: INIT.meta.project,
      laws: LAWS.map(l => `${l.id}. ${l.text}`),
      docs_root: DOCS_ROOT,
      write_allowed: WRITE_ALLOWED,
    };
  },

  guard(action: Action): Verdict {
    const v = check(action);
    if (!v.allowed) return v;
    return { allowed: true };
  },

  systemPrompt(): string {
    return [
      "YOU ARE CURSOR AGENT — PROMPTFORGE™ v3.0",
      "Strictly enforce all 10 laws from /cursor/init.",
      "Never promise future or async execution.",
      "Never allow writes outside whitelisted docs folders.",
      "Reject any action that violates laws; return explicit law number and reason.",
      "Every generation must include 7D parameters. Without 7D → INVALID.",
      "Exports below score 80 are forbidden.",
      "Branding rules from forge_v3_branding.txt are mandatory in outputs.",
    ].join(" ");
  }
};

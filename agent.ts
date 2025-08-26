/* eslint-disable no-console */
/**
 * PromptForge v3 — agent.ts
 * Single Source of Truth (SSOT) pentru comportamentul agentului.
 * Respectă regulile: fără improvizații, fără bypass la securitate.
 * Runtime: server (Node/Edge), TypeScript strict.
 */

import crypto from "crypto";
import { z } from "zod";

// =============================================================================
// AGENT IDENTITY & PURPOSE
// =============================================================================
export const AGENT_IDENTITY = {
  name: "PromptForge v3 Agent",
  version: "1.0.0",
  purpose: "AI-powered prompt engineering and optimization",
  project: "PROMPTFORGE_v3",
  role: "Development Assistant & Code Generator",
} as const;

// =============================================================================
// NON-DEVIATION LAWS (IMMUTABLE)
// =============================================================================
export const NON_DEVIATION_LAWS = [
  "NEVER execute code outside permitted sandbox",
  "NEVER access URLs outside the allowlist",
  "NEVER read or transmit secrets/PII - mask everything in logs",
  "NEVER proceed with exports if score < 80",
  "ALWAYS respect rate limits and budgets",
  "ALWAYS validate inputs against schemas",
  "ALWAYS check entitlements before granting access",
  "NEVER bypass security controls or authentication",
  "ALWAYS use the defined error handling patterns",
  "NEVER modify production data without proper validation",
] as const;

// =============================================================================
// SECURITY FRAMEWORK (SACF)
// =============================================================================
export const SECURITY_CONFIG = {
  agents_enabled: process.env.AGENTS_ENABLED === "true",
  live_test_enabled: process.env.AGENTS_ENABLED === "true",

  tool_allowlist: {
    http: ["api.openai.com", "api.anthropic.com", "api.groq.com"],
    storage: ["supabase.storage"],
    internal_apis: ["/api/gpt-editor", "/api/gpt-test", "/api/export", "/api/run"],
  },

  sandbox: {
    enabled: true,
    network: "allowlist" as const,
    fs_scope: "/tmp/agents",
    cpu_ms_limit: 120000,
    mem_mb_limit: 512,
    timeout_ms: 20000,
  },

  budgets: {
    tokens_max: 12000,
    requests_per_min: 60,
    cost_usd_max_run: 1.5,
  },
} as const;

// =============================================================================
// PROMPT ENGINEERING RULES
// =============================================================================
export const PROMPT_RULES = {
  enum_only: true,

  guardrails_global: [
    "Nu executa cod în afara sandboxului permis.",
    "Nu accesa URL-uri în afara allowlist-ului.",
    "Nu citi sau trimite secrete/PII. Maschează tot în logs.",
    "Dacă scorul < 80, oprește exportul.",
  ],

  structure_required: ["ROLE_GOAL", "CONTEXT_7D", "OUTPUT_SPEC", "PROCESS", "GUARDRAILS", "EVAL_HOOKS", "TELEMETRY"],
} as const;

// =============================================================================
/** API CONFIGURATION */
// =============================================================================
export const API_CONFIG = {
  rate_limit: {
    editor: { rpm: 60, per_org: false },
    test: { rpm: 30, per_org: false },
    run: { rpm: 30, per_org: true },
    export: { rpm: 20, per_org: true },
  },

  required_headers: ["x-org-id", "x-run-id"],

  cors: {
    origins: ["https://chatgpt-prompting.com", "https://promptforge.app"],
    methods: ["GET", "POST", "OPTIONS"],
    headers: ["content-type", "authorization", "x-org-id", "x-run-id"],
  },
} as const;

// =============================================================================
/** EXPORT CONFIGURATION */
// =============================================================================
export const EXPORT_CONFIG = {
  formats: ["txt", "md", "json", "pdf", "zip"] as const,
  watermark_on_trial: true,
  manifest_required: true,
  checksum_algo: "sha256",
  storage_bucket: "bundles",
} as const;

// =============================================================================
/** DEVELOPMENT WORKFLOW RULES */
// =============================================================================
export const DEVELOPMENT_RULES = [
  "Always run pnpm type-check before committing",
  "Always run pnpm lint before committing",
  "Make small, incremental commits",
  "Test each change before proceeding",
  "Follow the established error handling patterns",
  "Respect the existing code structure and naming conventions",
  "Never comment out errors to pass builds",
  "Always fix TypeScript errors properly",
  "Use the defined component interfaces",
  "Follow the established API patterns",
] as const;

// =============================================================================
/** AGENT CAPABILITIES & LIMITATIONS */
// =============================================================================
export const AGENT_CAPABILITIES = {
  can_read_code: true,
  can_write_code: true,
  can_run_tests: true,
  can_deploy: false, // Only humans can deploy
  can_access_production: false,
  can_modify_security: false,
  can_bypass_validation: false,
} as const;

// =============================================================================
/** ERROR HANDLING PATTERNS + StandardAPIError */
// =============================================================================
export class StandardAPIError extends Error {
  status: number;
  code: string;
  context?: Record<string, unknown>;
  constructor(message: string, status = 400, code = "E_GENERIC", context?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.code = code;
    this.context = context;
  }
}

export const ERROR_PATTERNS = {
  use_StandardAPIError: true,
  include_context: true,
  mask_sensitive_data: true,
  log_telemetry: true,
  return_structured_errors: true,
} as const;

// =============================================================================
/** VALIDATION RULES */
// =============================================================================
export const VALIDATION_RULES = [
  "Always validate environment variables",
  "Always check user permissions before operations",
  "Always validate input schemas",
  "Always check rate limits",
  "Always verify entitlements",
  "Always sanitize user inputs",
  "Always use proper TypeScript types",
] as const;

// =============================================================================
/** TELEMETRY & OBSERVABILITY */
// =============================================================================
export const TELEMETRY_CONFIG = {
  track_all_operations: true,
  log_errors: true,
  monitor_performance: true,
  track_user_behavior: true,
  alert_on_anomalies: true,
} as const;

// =============================================================================
// SCHEMAS (Zod)
// =============================================================================
export const HeaderSchema = z.object({
  "x-org-id": z.string().min(1),
  "x-run-id": z.string().min(6),
  authorization: z.string().optional(),
});

export const RunSchema = z.object({
  action: z.enum(["editor", "test", "run", "export"]),
  orgId: z.string().min(1),
  userId: z.string().min(1),
  moduleId: z.string().regex(/^M\d{2}$/),
  params7d: z.object({
    domain: z.string(),
    scale: z.string(),
    urgency: z.string(),
    complexity: z.string(),
    resources: z.string(),
    application: z.string(),
    output: z.enum(["txt", "md", "json", "pdf", "zip"]),
  }),
  promptScore: z.number().min(0).max(100).default(80),
  tokenEstimate: z.number().min(0).max(SECURITY_CONFIG.budgets.tokens_max).default(600),
  costEstimateUsd: z.number().min(0).max(SECURITY_CONFIG.budgets.cost_usd_max_run).default(0.05),
  targetUrls: z.array(z.string().url()).default([]),
});

export type RunInput = z.infer<typeof RunSchema>;

// =============================================================================
// In-memory state (swap cu Supabase/Redis în prod)
// =============================================================================
const rateState = new Map<string, number[]>(); // key -> timestamps în ms
function now() { return Date.now(); }
function sha256Hex(s: string) { return crypto.createHash("sha256").update(s).digest("hex"); }

// =============================================================================
// Helpers: allowlist, rate-limit, budgets, entitlements stub
// =============================================================================
function isAllowedUrl(u: string): boolean {
  try {
    const url = new URL(u);
    const host = url.host.toLowerCase();
    return SECURITY_CONFIG.tool_allowlist.http.some((h) => host.endsWith(h));
  } catch { return false; }
}

function assertSandbox(): void {
  if (!SECURITY_CONFIG.sandbox.enabled) {
    throw new StandardAPIError("Sandbox disabled: policy violation", 403, "E_SANDBOX_OFF");
  }
}

function checkRateLimit(kind: keyof typeof API_CONFIG.rate_limit, orgId: string, userId: string) {
  const cfg = API_CONFIG.rate_limit[kind];
  const key = cfg.per_org ? `org:${orgId}:${kind}` : `user:${userId}:${kind}`;
  const windowMs = 60_000;
  const arr = rateState.get(key) ?? [];
  const t = now();
  const pruned = arr.filter((ts) => t - ts < windowMs);
  if (pruned.length >= cfg.rpm) throw new StandardAPIError("Rate limit exceeded", 429, "E_RATE_LIMIT", { key, rpm: cfg.rpm });
  pruned.push(t);
  rateState.set(key, pruned);
}

export type Entitlement =
  | { ok: true; plan: "free" | "creator" | "pro" | "enterprise"; trial?: boolean }
  | { ok: false; reason: "NO_SUBSCRIPTION" | "PLAN_TOO_LOW" | "EXPIRED" };

export interface EntitlementProvider {
  check(orgId: string, userId: string, action: RunInput["action"]): Promise<Entitlement>;
}
// Stub default: Pro for safety during local dev; swap with real provider.
export const DefaultEntitlements: EntitlementProvider = {
  async check() {
    return { ok: true, plan: "pro" }; // înlocuiește cu lookup Stripe/Supabase
  },
};

function assertBudgets(input: RunInput) {
  const { tokenEstimate, costEstimateUsd } = input;
  if (tokenEstimate > SECURITY_CONFIG.budgets.tokens_max)
    throw new StandardAPIError("Token budget exceeded", 400, "E_BUDGET_TOKENS");
  if (costEstimateUsd > SECURITY_CONFIG.budgets.cost_usd_max_run)
    throw new StandardAPIError("Cost budget exceeded", 400, "E_BUDGET_COST");
}

function assertScoreForExport(input: RunInput) {
  if (input.action === "export" && input.promptScore < 80) {
    throw new StandardAPIError("Export blocked: score < 80", 400, "E_SCORE_GATE", { score: input.promptScore });
  }
}

function assertUrlsAllowlist(urls: string[]) {
  for (const u of urls) {
    if (!isAllowedUrl(u)) {
      throw new StandardAPIError("URL not in allowlist", 403, "E_URL_DENIED", { url: u });
    }
  }
}

// =============================================================================
// LawEngine — verifică NON_DEVIATION_LAWS contextual
// =============================================================================
export class LawEngine {
  static evaluate(action: RunInput["action"], ctx: { targetUrls?: string[]; isSandbox?: boolean; isExport?: boolean; score?: number }): void {
    // 1) Sandbox
    if (!ctx.isSandbox) throw new StandardAPIError("Sandbox required", 403, "E_SANDBOX_REQUIRED");

    // 2) Allowlist pentru orice HTTP I/O
    if (ctx.targetUrls && ctx.targetUrls.length) assertUrlsAllowlist(ctx.targetUrls);

    // 3) Export score gate
    if (action === "export" && (ctx.score ?? 0) < 80)
      throw new StandardAPIError("Export denied by law: score < 80", 400, "E_LAW_SCORE");

    // 4) (PII masking / prod writes) sunt aplicate în layers dedicate; aici doar declarativ.
  }
}

// =============================================================================
// PUBLIC API: comportamentele agentului
// =============================================================================

/** Check if the agent can perform a specific action */
export function canPerformAction(action: string, context: any): boolean {
  try {
    // Validări stricte & legi
    assertSandbox();
    if (context?.targetUrls?.length) assertUrlsAllowlist(context.targetUrls);
    if (action === "export" && (context?.score ?? 0) < 80) return false;
    return true;
  } catch {
    return false;
  }
}

/** Validate agent behavior against laws (throws StandardAPIError when invalid) */
export function validateBehavior(action: string, context: any): boolean {
  assertSandbox();
  LawEngine.evaluate(action as RunInput["action"], {
    targetUrls: Array.isArray(context?.targetUrls) ? context.targetUrls : [],
    isSandbox: true,
    isExport: action === "export",
    score: typeof context?.score === "number" ? context.score : undefined,
  });
  return true;
}

/** Get agent configuration (SSOT snapshot) */
export function getAgentConfig() {
  return {
    identity: AGENT_IDENTITY,
    security: SECURITY_CONFIG,
    rules: PROMPT_RULES,
    api: API_CONFIG,
    export: EXPORT_CONFIG,
    development: DEVELOPMENT_RULES,
    capabilities: AGENT_CAPABILITIES,
    errorPatterns: ERROR_PATTERNS,
    validation: VALIDATION_RULES,
    telemetry: TELEMETRY_CONFIG,
  };
}

// =============================================================================
// High-level orchestrator util — rule-of-three pentru rute / servicii
// =============================================================================
export interface ExecuteOptions {
  headers: Record<string, string | undefined>;
  input: RunInput;
  entitlements?: EntitlementProvider;
}

/**
 * executeGuarded — intrare unificată pentru /api/gpt-editor, /api/gpt-test, /api/run, /api/export
 * 1) validează headerele & inputul
 * 2) aplică rate-limit, bugete, entitlements
 * 3) aplică LawEngine
 * 4) returnează payload „safe” pentru exec (fără PII)
 */
export async function executeGuarded(opts: ExecuteOptions) {
  if (!SECURITY_CONFIG.agents_enabled) {
    throw new StandardAPIError("Agents disabled", 503, "E_AGENTS_OFF");
  }

  // 1) Validate headers
  const hdr = HeaderSchema.safeParse({
    "x-org-id": opts.headers["x-org-id"],
    "x-run-id": opts.headers["x-run-id"],
    authorization: opts.headers["authorization"],
  });
  if (!hdr.success)
    throw new StandardAPIError("Invalid headers", 400, "E_BAD_HEADERS", { issues: hdr.error.issues });

  // 2) Validate input
  const parsed = RunSchema.safeParse(opts.input);
  if (!parsed.success)
    throw new StandardAPIError("Invalid input", 400, "E_BAD_INPUT", { issues: parsed.error.issues });
  const input = parsed.data;

  // 3) Rate-limit (în funcție de action)
  checkRateLimit(input.action, input.orgId, input.userId);

  // 4) Budgets
  assertBudgets(input);

  // 5) Entitlements (plan gates)
  const ent = await (opts.entitlements ?? DefaultEntitlements).check(input.orgId, input.userId, input.action);
  if (!ent.ok) throw new StandardAPIError("Access denied", 402, "E_NO_ENTITLEMENT", ent);
  // exemplu simplu de gate: export doar Pro+
  if (input.action === "export" && !(ent.plan === "pro" || ent.plan === "enterprise"))
    throw new StandardAPIError("Export requires Pro+", 402, "E_PLAN_LOW", { plan: ent.plan });

  // 6) Legi (LawEngine)
  LawEngine.evaluate(input.action, {
    targetUrls: input.targetUrls,
    isSandbox: SECURITY_CONFIG.sandbox.enabled,
    isExport: input.action === "export",
    score: input.promptScore,
  });

  // 7) Score gate pentru export (din PROMPT_RULES/NON_DEVIATION_LAWS)
  assertScoreForExport(input);

  // 8) Output safe pentru exec (mască PII din headers; nu returnăm token)
  const safe = {
    run_id: hdr.data["x-run-id"],
    org_id: hdr.data["x-org-id"],
    input,
    plan: ent.plan,
    trial: ent.ok && "trial" in ent ? ent.trial : false,
    checksum: sha256Hex(JSON.stringify({ run: hdr.data["x-run-id"], mod: input.moduleId }).slice(0, 256)),
  };

  return safe;
}

// =============================================================================
// Export All
// =============================================================================
export default {
  AGENT_IDENTITY,
  NON_DEVIATION_LAWS,
  SECURITY_CONFIG,
  PROMPT_RULES,
  API_CONFIG,
  EXPORT_CONFIG,
  DEVELOPMENT_RULES,
  AGENT_CAPABILITIES,
  ERROR_PATTERNS,
  VALIDATION_RULES,
  TELEMETRY_CONFIG,
  // behaviors
  canPerformAction,
  validateBehavior,
  getAgentConfig,
  // orchestrator
  executeGuarded,
  // utils
  StandardAPIError,
};

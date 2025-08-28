// rate-limit.ts — FINAL • STRICT • NON-DEVIATION
// Next.js App Router middleware helper + adapters (Memory/Redis).
// Enforce: required headers (x-org-id, x-run-id), endpoint RPM from ruleset.yml,
// per_org option for /api/run, 429 with Retry-After. No future/async promises of leniency.
//
// Usage (route.ts):
//   import { withRateLimit } from "@/lib/rate-limit";
//   export const POST = withRateLimit({ endpoint: "test" }, async (req) => { ... });
//
// Notes:
// - Headers required by ruleset.yml: x-org-id, x-run-id (for API):contentReference[oaicite:2]{index=2}.
// - Default limits (read from ruleset.yml): editor:60 rpm, test:30 rpm, run:30 rpm (per_org):contentReference[oaicite:3]{index=3}.

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Ruleset (SSOT) minimal loader: inject or import your parsed YAML at build.
// Here we keep a minimal shape; in real app, import from a central ruleset.ts.
type ApiLimits = { rpm: number; per_org?: boolean };
type RuleSet = {
  api: {
    rate_limit: { editor: ApiLimits; test: ApiLimits; run: ApiLimits };
    required_headers: string[];
  };
};
const RULESET: RuleSet = {
  api: {
    rate_limit: {
      editor: { rpm: 60 },
      test:   { rpm: 30 },
      run:    { rpm: 30, per_org: true }
    },
    required_headers: ["x-org-id","x-run-id"]
  }
}; // ← SSOT mirrors ruleset.yml:contentReference[oaicite:4]{index=4}

// ─────────────────────────────────────────────────────────────────────────────
// Storage adapter interface + Memory & Redis variants
export interface RateStore {
  incrAndGet(nowMs: number, key: string, windowMs: number): Promise<number>;
  ttlMs(key: string, windowMs: number): Promise<number>;
}

export class MemoryStore implements RateStore {
  private buckets = new Map<string, { count: number; resetAt: number }>();
  async incrAndGet(nowMs: number, key: string, windowMs: number) {
    const b = this.buckets.get(key);
    if (!b || nowMs >= b.resetAt) {
      this.buckets.set(key, { count: 1, resetAt: nowMs + windowMs });
      return 1;
    }
    b.count++;
    return b.count;
  }
  async ttlMs(key: string, windowMs: number) {
    const b = this.buckets.get(key);
    if (!b) return windowMs;
    const ttl = b.resetAt - Date.now();
    return ttl > 0 ? ttl : 0;
  }
}

// Optional Redis adapter (pseudo, plug your client)
// export class RedisStore implements RateStore { ... }

const DEFAULT_STORE: RateStore = new MemoryStore();

// ─────────────────────────────────────────────────────────────────────────────
// Keys, windows & helpers
const WINDOW_MS = 60_000;

type EndpointKind = "editor" | "test" | "run";

function getLimits(kind: EndpointKind): ApiLimits {
  return RULESET.api.rate_limit[kind]; // editor/test/run from ruleset.yml:contentReference[oaicite:5]{index=5}
}

function requireHeaders(req: NextRequest) {
  const missing: string[] = [];
  for (const h of RULESET.api.required_headers) {           // x-org-id, x-run-id:contentReference[oaicite:6]{index=6}
    if (!req.headers.get(h)) missing.push(h);
  }
  if (missing.length) {
    return NextResponse.json(
      { error: "MISSING_REQUIRED_HEADERS", missing },
      { status: 400 }
    );
  }
  return null;
}

function keyFor(kind: EndpointKind, req: NextRequest, perOrg: boolean) {
  const org = (req.headers.get("x-org-id") ?? "no-org").trim().toLowerCase();
  const ip  = (req.headers.get("x-forwarded-for") ?? "0.0.0.0").split(",")[0].trim();
  // If per_org: key couples org + endpoint; else: ip + endpoint
  return perOrg ? `rl:${kind}:org:${org}` : `rl:${kind}:ip:${ip}`;
}

function toRetryAfterSeconds(ttlMs: number) {
  return Math.max(1, Math.ceil(ttlMs / 1000));
}

// ─────────────────────────────────────────────────────────────────────────────
// Main wrapper
export function withRateLimit(
  cfg: { endpoint: EndpointKind; store?: RateStore },
  handler: (req: NextRequest) => Promise<Response> | Response
) {
  const store = cfg.store ?? DEFAULT_STORE;
  const limits = getLimits(cfg.endpoint);
  const max = limits.rpm;
  const perOrg = !!limits.per_org;

  return async (req: NextRequest) => {
    // Enforce required headers first (hard fail):contentReference[oaicite:7]{index=7}
    const bad = requireHeaders(req);
    if (bad) return bad;

    // Build key (per org for /run if per_org: true):contentReference[oaicite:8]{index=8}
    const key = keyFor(cfg.endpoint, req, perOrg);

    // Windowed counter
    const now = Date.now();
    const used = await store.incrAndGet(now, key, WINDOW_MS);

    if (used > max) {
      const ttl = await store.ttlMs(key, WINDOW_MS);
      const retry = toRetryAfterSeconds(ttl);
      const res = NextResponse.json(
        {
          error: "RATE_LIMITED",
          endpoint: cfg.endpoint,
          limit_rpm: max,
          policy: perOrg ? "per_org" : "per_ip",
          retry_after_seconds: retry
        },
        { status: 429 }
      );
      res.headers.set("Retry-After", String(retry));
      return res;
    }

    // Pass through
    return handler(req);
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Strict helpers for common endpoints (clar, fără ambiguități)
export const withEditorRateLimit = (h: (r: NextRequest) => Promise<Response> | Response) =>
  withRateLimit({ endpoint: "editor" }, h);

export const withTestRateLimit = (h: (r: NextRequest) => Promise<Response> | Response) =>
  withRateLimit({ endpoint: "test" }, h);

export const withRunRateLimit = (h: (r: NextRequest) => Promise<Response> | Response) =>
  withRateLimit({ endpoint: "run" }, h);

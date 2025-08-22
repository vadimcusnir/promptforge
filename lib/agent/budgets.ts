type Budget = {
  tokensMax: number;
  reqPerMin: number;
  usdMax: number;
  timeoutMs: number;
};
const DEFAULT: Budget = {
  tokensMax: 12000,
  reqPerMin: 60,
  usdMax: 1.5,
  timeoutMs: 20000,
};

export class BudgetGuard {
  private spentUsd = 0;
  private usedTokens = 0;
  private started = Date.now();
  constructor(private b: Budget = DEFAULT) {}
  can(tokens: number, usd: number) {
    if (this.usedTokens + tokens > this.b.tokensMax) return false;
    if (this.spentUsd + usd > this.b.usdMax) return false;
    return true;
  }
  add(tokens: number, usd: number) {
    this.usedTokens += tokens;
    this.spentUsd += usd;
  }
}

// Usage: Mount BudgetGuard in orchestrator; check can(..) before each LLM call
// Storage & Export Hardening:
// - File names: ^[a-z0-9._-]+$ pattern only
// - Signed URLs from Supabase Storage, 5-15 min expiry
// - Manifest contains: 7-D signature, scores, models, times, pipeline versions
// - Checksum = sha256(manifest + canonical file order)
// - PDF: server-side generation (Chromium --disable-gpu --no-sandbox in isolated container)
// - ZIP: Enterprise only; verify canExportBundleZip

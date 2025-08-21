type Budget = { tokensMax:number; reqPerMin:number; usdMax:number; timeoutMs:number }
const DEFAULT: Budget = { tokensMax: 12000, reqPerMin: 60, usdMax: 1.5, timeoutMs: 20000 };

export class BudgetGuard {
  private spentUsd=0; private usedTokens=0; private started=Date.now();
  constructor(private b:Budget=DEFAULT) {}
  can(tokens:number, usd:number) {
    if (this.usedTokens + tokens > this.b.tokensMax) return false;
    if (this.spentUsd + usd > this.b.usdMax) return false;
    return true;
  }
  add(tokens:number, usd:number){ this.usedTokens+=tokens; this.spentUsd+=usd; }
}


Montezi BudgetGuard în orchestratorul de run; înainte de fiecare apel LLM verifici can(..).
5) Storage & Export Hardening
Nume fișiere: ^[a-z0-9._-]+$; respingi orice altceva.
Signed URLs din Supabase Storage, expirare 5–15 min.
Manifest conține: semnătură 7-D, scoruri, modele, timpi, versiuni pipeline.
Checksum = sha256(manifest + ordinea canonică a fișierelor).
PDF: generezi server-side (Chromium with --disable-gpu --no-sandbox în container izolat).
ZIP: doar pentru Enterprise; verifici canExportBundleZip.
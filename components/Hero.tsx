"use client"

import { GTMEvents } from "@/lib/gtm-events"

export function Hero() {
  return (
    <section className="min-h-[100dvh] grid place-items-center px-4">
      <div className="max-w-3xl w-full text-center">
        <div 
          className="mx-auto mb-8 h-24 w-24 rounded-xl border"
          style={{
            borderColor: "var(--pf-gold-500)", 
            boxShadow: "0 0 0 1px var(--pf-gold-400) inset"
          }}
        />
        <h1 className="font-heading font-black tracking-tight text-5xl sm:text-6xl">
          The Cognitive‑OS for Prompts
        </h1>
        <p className="mt-4 text-lg text-white/80">
          Turn 4h of tweaking into 30m of execution. 50 Modules + 7D Engine → Scored ≥80 & Export‑ready.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a 
            data-cta="primary" 
            className="px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:transform hover:-translate-y-px"
            style={{
              background: "var(--pf-gold-600)", 
              color: "var(--pf-gold-contrast)",
              border: "1px solid var(--pf-gold-500)",
              boxShadow: "0 10px 28px rgba(199,168,105,.18)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 1px var(--pf-gold-500), 0 8px 24px rgba(199,168,105,.18)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 10px 28px rgba(199,168,105,.18)"
            }}
            href="/generator"
            onClick={() => GTMEvents.heroCTA()}
          >
            START THE FORGE
          </a>
          <a 
            data-cta="secondary" 
            className="px-6 py-3 rounded-md font-semibold border border-white/15 text-white/80 hover:border-white/25 hover:text-white/90 transition-all duration-200"
            href="/generator#demo"
          >
            Preview Demo
          </a>
        </div>
        <p className="mt-2 text-xs text-white/60">No credit card · upgrade anytime</p>

        <div className="mt-6 mx-auto max-w-2xl grid grid-cols-3 gap-2 text-xs text-white/70">
          <div className="rounded-md border border-white/10 bg-white/5 p-2">TTA &lt; 60s</div>
          <div className="rounded-md border border-white/10 bg-white/5 p-2">Score ≥ 80</div>
          <div className="rounded-md border border-white/10 bg-white/5 p-2">.md/.pdf/.json (.zip Ent)</div>
        </div>
      </div>
    </section>
  );
}

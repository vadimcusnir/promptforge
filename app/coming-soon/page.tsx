"use client";

import { useState } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import { DigitalRune } from "@/components/background/DigitalRune";
import { CyberPoeticBackground } from "@/components/background/cyber-poetic-background";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          name: name.trim(),
          org_id: null // For future multi-tenant support
        }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "A apărut o eroare. Te rugăm să încerci din nou.");
      }
    } catch (err) {
      console.error("Waitlist error:", err);
      setError("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background with ClientOnly wrapper to prevent SSR conflicts */}
      <ClientOnly fallback={<div className="fixed inset-0 bg-[#0a0a0a]" />}>
        <CyberPoeticBackground />
      </ClientOnly>
      
      {/* Digital Rune - Central Symbol */}
      <ClientOnly>
        <DigitalRune />
      </ClientOnly>

      {/* Main Content */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {!submitted ? (
          <>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
              The 1st Cognitive OS for Prompts
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}>
              50 Semantic Modules × 7D Parameter Engine → From Chaos to Execution in 30 Minutes.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-lg"
            >
              <input
                type="text"
                placeholder="Numele tău"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-4 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#d1a954] focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
              <input
                type="email"
                placeholder="Email-ul tău"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#d1a954] focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 rounded-lg bg-[#d1a954] hover:bg-[#d1a954]/90 text-black font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black min-h-[56px]"
                style={{ minHeight: "56px" }} // Ensures ≥44px height for accessibility
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                    Se procesează...
                  </div>
                ) : (
                  "Join the Waitlist"
                )}
              </button>
            </form>

            {error && (
              <p className="mt-4 text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
                {error}
              </p>
            )}

            <p className="mt-6 text-sm text-white/70 max-w-md">
              Primești acces anticipat + bundle demo gratuit. Fără spam. Doar Forge.
            </p>

            <a
              href="/demo-bundle"
              className="mt-4 inline-block text-sm text-[#d1a954] hover:text-[#d1a954]/80 underline transition-colors"
            >
              Preview Demo Bundle →
            </a>
          </>
        ) : (
          <div className="max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Mulțumim că te-ai alăturat!</h2>
            <p className="text-white/80 leading-relaxed">
              Vei fi printre primii care vor accesa PromptForge și vei primi bundle-ul demo gratuit.
            </p>
            <p className="mt-4 text-sm text-white/60">
              Verifică-ți email-ul pentru confirmarea înregistrării.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
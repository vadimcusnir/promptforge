"use client";

import { useState } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import { DigitalRune } from "@/components/background/DigitalRune";

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
          org_id: null, // For future multi-tenant support
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Waitlist error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background now handled by global BackgroundRoot */}

      {/* Digital Rune - Central Symbol */}
      <ClientOnly>
        <DigitalRune />
      </ClientOnly>

      {/* Main Content */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {!submitted ? (
          <>
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
            >
              The 1st Cognitive OS for Prompts
            </h1>
            <p
              className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}
            >
              50 Semantic Modules × 7D Parameter Engine → From Chaos to
              Execution in 30 Minutes.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-12 flex flex-col gap-3 w-full max-w-sm mx-auto"
            >
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 text-sm rounded border bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#d1a954] focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 text-sm rounded border bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#d1a954] focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 px-4 rounded bg-[#d1a954] hover:bg-[#d1a954]/90 text-black font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
                    Processing...
                  </div>
                ) : (
                  "Join Waitlist"
                )}
              </button>
            </form>

            {error && (
              <p className="mt-4 text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
                {error}
              </p>
            )}

            <p className="mt-4 text-xs text-white/60 max-w-sm">
              No spam. Just launch updates.
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
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">
              Thank you for joining!
            </h2>
            <p className="text-white/80 leading-relaxed">
              You'll be among the first to access PromptForge and receive the
              free demo bundle.
            </p>
            <p className="mt-4 text-sm text-white/60">
              Check your email for registration confirmation.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

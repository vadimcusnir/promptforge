"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function ComingSoonInteractive() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle waitlist submission
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Badge */}
        <Badge variant="outline" className="border-emerald-400/30 text-emerald-400 bg-emerald-400/10 text-lg px-6 py-2">
          PROMPTFORGE™ v3.0 — Coming Soon!
        </Badge>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold text-white font-mono tracking-tight">
            Your operational <span className="text-emerald-400 animate-pulse">prompt engine</span>.
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 font-mono">
            50 modules. 7 vectors. Export .md / .json / .pdf in under 60s.
          </p>
        </div>

        {/* Feature Indicators */}
        <div className="flex flex-wrap justify-center gap-4 text-sm font-mono">
          <div className="bg-slate-800/50 border border-emerald-400/30 rounded-lg px-4 py-2 text-emerald-400">
            TTA &lt; 60s
          </div>
          <div className="bg-slate-800/50 border border-emerald-400/30 rounded-lg px-4 py-2 text-emerald-400">
            AI Score ≥ 80
          </div>
          <div className="bg-slate-800/50 border border-emerald-400/30 rounded-lg px-4 py-2 text-emerald-400">
            Verified exports: .md / .json / .pdf
          </div>
        </div>

        {/* Waitlist Form */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-2 font-mono">Join the Waitlist</h2>
          <p className="text-slate-400 mb-6">Get early access to PROMPTFORGE™ before anyone else.</p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 font-mono"
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 font-mono"
                required
              />
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-lg py-3"
              >
                Add Me to the List
              </Button>
            </form>
          ) : (
            <div className="text-emerald-400 font-mono text-lg">Thank you! You've been added to our waitlist.</div>
          )}
        </div>
      </div>
    </div>
  )
}

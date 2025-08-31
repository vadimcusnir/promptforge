"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export function Footer() {
  const [systemStatus, setSystemStatus] = useState<"operational" | "maintenance" | "degraded">("operational")
  const [timestamp, setTimestamp] = useState("")

  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date()
      setTimestamp(now.toISOString().slice(0, 19).replace("T", " "))
    }

    updateTimestamp()
    const interval = setInterval(updateTimestamp, 1000)

    return () => clearInterval(interval)
  }, [])

  const statusMessages = {
    operational: '&gt; system.status: "forge.exe running successfully"',
    maintenance: '&gt; system.status: "scheduled maintenance in progress"',
    degraded: '&gt; system.status: "performance degraded - investigating"',
  }

  const statusColors = {
    operational: "text-primary",
    maintenance: "text-accent",
    degraded: "text-destructive",
  }

  return (
    <footer className="border-t border-border/30 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-mono text-sm font-bold text-white mb-3">Platform</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/generator" className="text-muted-foreground hover:text-primary transition-colors">
                  Generator
                </Link>
              </li>
              <li>
                <Link href="/modules" className="text-muted-foreground hover:text-primary transition-colors">
                  Modules
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-sm font-bold text-white mb-3">Resources</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/docs/api" className="text-muted-foreground hover:text-primary transition-colors">
                  API Docs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-sm font-bold text-white mb-3">Account</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-sm font-bold text-white mb-3">Legal</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* System Status */}
        <div className="text-center space-y-2">
          <p className={`font-mono text-sm ${statusColors[systemStatus]}`}>{statusMessages[systemStatus]}</p>
          <p className="font-mono text-xs text-muted-foreground">
            &gt; timestamp: "{timestamp}" | forge_v4.0 | runa_executabila.active
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        {/* Brand Philosophy */}
        <div className="text-center space-y-3">
          <p className="font-mono text-sm text-muted-foreground italic">
            "Identitatea e putere. Nu e nevoie să o pronunți."
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground/60">
            <span className="font-mono">Crafted in the digital realm</span>
            <span>•</span>
            <span className="font-mono">Where prompts become power</span>
            <span>•</span>
            <span className="font-mono">Forge v4.0</span>
          </div>
        </div>

        {/* Runa Symbol */}
        <div className="flex justify-center mt-6">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded border border-yellow-400/30 flex items-center justify-center">
            <div className="text-yellow-400/60 text-xs font-mono">⟨⟩</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

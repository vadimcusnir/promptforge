"use client"

import { useState } from "react"
import { NavBar } from "@/components/ui/navbar"
import { BadgePlan } from "@/components/ui/badge-plan"
import { TelemetryBadge } from "@/components/ui/telemetry-badge"
import { ForgeGlyph } from "@/components/ui/forge-glyph"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [currentPlan] = useState<'free' | 'creator' | 'pro' | 'enterprise'>('free')

  const demoBundles = [
    {
      id: 'bundle_001',
      title: 'Content Optimization',
      score: 87,
      duration: 1250,
      vectors: ['prompt', 'context', 'output']
    },
    {
      id: 'bundle_002', 
      title: 'Technical Documentation',
      score: 92,
      duration: 2100,
      vectors: ['prompt', 'context', 'output', 'guardrails']
    },
    {
      id: 'bundle_003',
      title: 'Marketing Copy Generator', 
      score: 89,
      duration: 1800,
      vectors: ['prompt', 'context', 'output', 'metrics', 'feedback']
    }
  ]
  
  return (
    <div className="min-h-screen bg-bg">
      <NavBar plan={currentPlan} />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto mb-6">
              <ForgeGlyph variant="pulse" size="xl" />
            </div>
            
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-surfaceAlt border border-border mb-6">
              <span className="text-brand font-ui text-sm font-medium">
                Industrial Prompt Engineering
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl font-bold text-text mb-6">
              Your Operational
              <br />
              <span className="text-brand">Prompt Generator</span>
            </h1>
            
            <p className="text-xl text-textMuted font-ui max-w-3xl mx-auto mb-8">
              50 modules. 7 vectors. Export in {"<"}60s.
              <br />
              Build auditable, reproducible prompt systems for professional workflows.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => window.location.href = '/generator'}
              className="px-8 py-4 bg-brand text-bg rounded-lg font-ui font-semibold hover:bg-brand/90 transition-all duration-200 focus-ring"
            >
              Start the Forge
            </button>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="px-8 py-4 bg-surface border border-border text-text rounded-lg font-ui font-semibold hover:border-brand/50 transition-all duration-200 focus-ring"
            >
              View Pricing
            </button>
          </div>

          {/* Proof Bar */}
          <div className="flex flex-wrap justify-center gap-8 p-6 bg-surface border border-border rounded-xl max-w-2xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-brand rounded-full" />
              <span className="text-textMuted font-ui text-sm">TTA {"<"} 60s</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-brand rounded-full" />
              <span className="text-textMuted font-ui text-sm">Score ≥ 80</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-brand rounded-full" />
              <span className="text-textMuted font-ui text-sm">Export .md/.json/.pdf</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Bundles */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-text mb-4">
              Live Demo Bundles
            </h2>
            <p className="text-textMuted font-ui text-lg">
              See PromptForge in action with real telemetry data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {demoBundles.map((bundle: any) => (
              <div
                key={bundle.id}
                className="bg-surface border border-border rounded-xl p-6 hover:border-brand/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-ui text-lg font-semibold text-text">
                    {bundle.title}
                  </h3>
                  <TelemetryBadge 
                    runId={bundle.id} 
                    score={bundle.score}
                    duration={bundle.duration}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {bundle.vectors.map((vector: string) => (
                    <span
                      key={vector}
                      className="px-2 py-1 bg-surfaceAlt border border-border rounded text-xs font-mono text-textMuted"
                    >
                      {vector}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => window.location.href = '/generator'}
                  className="w-full py-2 px-4 bg-surfaceAlt border border-border rounded-md text-text hover:border-brand/50 transition-colors focus-ring font-ui text-sm"
                >
                  Try This Module
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-surfaceAlt">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-text mb-4">
              How It Works
            </h2>
            <p className="text-textMuted font-ui text-lg">
              Three steps to professional prompt generation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="mx-auto mb-6">
                <ForgeGlyph variant="pulse" size="lg" />
              </div>
              <h3 className="font-ui text-xl font-semibold text-text mb-3">
                Configure 7D Parameters
              </h3>
              <p className="text-textMuted font-ui">
                Set domain, scale, urgency, complexity, resources, application, and output format
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6">
                <ForgeGlyph variant="animated" size="lg" />
              </div>
              <h3 className="font-ui text-xl font-semibold text-text mb-3">
                Run Selected Module
              </h3>
              <p className="text-textMuted font-ui">
                Choose from 50 specialized modules across 7 semantic vectors for your use case
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6">
                <ForgeGlyph variant="static" size="lg" />
              </div>
              <h3 className="font-ui text-xl font-semibold text-text mb-3">
                Export Professional Bundle
              </h3>
              <p className="text-textMuted font-ui">
                Get structured outputs with checksums, manifests, and telemetry data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-text mb-6">
            Ready to Build Industrial-Grade Prompts?
          </h2>
          <p className="text-xl text-textMuted font-ui mb-8 max-w-2xl mx-auto">
            Join professionals who demand auditable, reproducible prompt systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/generator'}
              className="px-8 py-4 bg-brand text-bg rounded-lg font-ui font-semibold hover:bg-brand/90 transition-all duration-200 focus-ring"
            >
              Start Building Now
            </button>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="px-8 py-4 bg-surface border border-border text-text rounded-lg font-ui font-semibold hover:border-brand/50 transition-all duration-200 focus-ring"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
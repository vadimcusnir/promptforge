"use client";

import { ModuleBrowser } from '@/components/modules/module-browser'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-pf-black">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pf-text mb-4">
            PromptForge Dashboard
          </h1>
          <p className="text-pf-text-muted text-lg">
            Explore and use our 50+ prompt modules to build powerful AI systems
          </p>
        </div>
        
        <ModuleBrowser />
      </div>
    </div>
  )
}

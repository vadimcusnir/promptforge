"use client";

import { Target, Settings, BarChart3, Shield, Zap } from "lucide-react";
import type { PromptModule } from "@/types/promptforge";

interface ModuleSpecProps {
  module: PromptModule;
}

export function ModuleSpec({ module }: ModuleSpecProps) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-8 text-[hsl(var(--accent))] font-sans">
        Module Specifications
      </h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Requirements */}
        <div className="glass-effect border border-border/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-[hsl(var(--accent))]" />
            <h3 className="text-xl font-semibold text-[hsl(var(--accent))] font-sans">
              Input Requirements
            </h3>
          </div>
          <p className="text-foreground font-open-sans leading-relaxed">
            {module.requirements}
          </p>
        </div>

        {/* Specifications */}
        <div className="glass-effect border border-border/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-[hsl(var(--accent))]" />
            <h3 className="text-xl font-semibold text-[hsl(var(--accent))] font-sans">
              Technical Specs
            </h3>
          </div>
          <p className="text-foreground font-open-sans leading-relaxed">
            {module.spec}
          </p>
        </div>

        {/* Output */}
        <div className="glass-effect border border-border/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-[hsl(var(--accent))]" />
            <h3 className="text-xl font-semibold text-[hsl(var(--accent))] font-sans">
              Expected Output
            </h3>
          </div>
          <p className="text-foreground font-open-sans leading-relaxed">
            {module.output}
          </p>
        </div>

        {/* KPI */}
        <div className="glass-effect border border-border/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-[hsl(var(--accent))]" />
            <h3 className="text-xl font-semibold text-[hsl(var(--accent))] font-sans">
              Success Metrics
            </h3>
          </div>
          <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
            <p className="text-green-400 font-semibold font-open-sans">
              {module.kpi}
            </p>
          </div>
        </div>
      </div>

      {/* Guardrails - Full Width */}
      <div className="glass-effect border border-border/30 rounded-lg p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-[hsl(var(--accent))]" />
          <h3 className="text-xl font-semibold text-[hsl(var(--accent))] font-sans">
            Guardrails & Constraints
          </h3>
        </div>
        <p className="text-foreground font-open-sans leading-relaxed">
          {module.guardrails}
        </p>
      </div>
    </div>
  );
}

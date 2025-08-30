"use client";

import { ArrowUp, Zap, Shield, BarChart3 } from "lucide-react";

export function TestEngineSection() {
  const scoringMetrics = [
    {
      name: "Structure",
      description: "Logical organization and flow of the prompt",
      weight: 25,
      criteria: ["Clear sections", "Logical progression", "Proper formatting"]
    },
    {
      name: "KPI Compliance",
      description: "Alignment with specified objectives and requirements",
      weight: 30,
      criteria: ["Goal alignment", "Requirement coverage", "Success metrics"]
    },
    {
      name: "Clarity",
      description: "Ease of understanding and interpretation",
      weight: 25,
      criteria: ["Readability", "Precision", "Ambiguity reduction"]
    },
    {
      name: "Executability",
      description: "Practical implementation and actionability",
      weight: 20,
      criteria: ["Actionable steps", "Measurable outcomes", "Resource feasibility"]
    }
  ];

  return (
    <section id="test-engine" className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          <span className="text-[#d1a954]">Test Engine</span> & Quality Assurance
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Validate your prompts with our advanced testing system: simulated analysis and live GPT testing 
          to ensure professional-grade quality (score ≥80)
        </p>
      </div>

      {/* Testing Overview */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d1a954] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          Testing Philosophy
        </h2>
        
        <div className="space-y-4 text-white/90 leading-relaxed">
          <p>
            PromptForge™ v3 employs a dual-testing approach to ensure every generated prompt meets 
            professional standards. Our system combines automated analysis with real-world validation 
            to deliver prompts that consistently score ≥80 on our comprehensive quality scale.
          </p>
          
          <p>
            Testing is not just about validation—it's about continuous improvement. Each test result 
            provides actionable feedback to refine and optimize your prompts for maximum effectiveness.
          </p>
        </div>
      </div>

      {/* Testing Modes */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Simulated Testing */}
        <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-xl font-bold text-[#d1a954]">Simulated Testing</h3>
          </div>
          
          <div className="space-y-3 text-white/80 text-sm">
            <p>
              <strong>Available to all users</strong> - Comprehensive analysis using our proprietary 
              algorithms to evaluate prompt quality across multiple dimensions.
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Instant feedback and scoring</li>
              <li>• Detailed breakdown by metric</li>
              <li>• Improvement suggestions</li>
              <li>• No external API calls</li>
            </ul>
          </div>
        </div>

        {/* Live GPT Testing */}
        <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-xl font-bold text-[#d1a954]">Live GPT Testing</h3>
          </div>
          
          <div className="space-y-3 text-white/80 text-sm">
            <p>
              <strong>Pro/Enterprise plans only</strong> - Real-time testing with actual GPT models 
              to validate prompt effectiveness in real-world scenarios.
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Real GPT model responses</li>
              <li>• Performance validation</li>
              <li>• Iterative refinement</li>
              <li>• Advanced analytics</li>
            </ul>
          </div>
          
          <div className="mt-4 p-3 bg-[#d1a954]/10 border border-[#d1a954]/30 rounded-lg">
            <div className="flex items-center gap-2 text-[#d1a954] text-xs">
              <Shield className="w-4 h-4" />
              <span>Requires Pro/Enterprise entitlement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring System */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Scoring System</h2>
        
        <div className="space-y-6">
          <div className="text-center p-6 bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg">
            <div className="text-4xl font-bold text-[#d1a954] mb-2">≥80</div>
            <p className="text-white/80">Minimum score required for professional-grade prompts</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {scoringMetrics.map((metric) => (
              <div key={metric.name} className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">{metric.name}</h4>
                  <span className="text-[#d1a954] font-bold">{metric.weight}%</span>
                </div>
                <p className="text-white/70 text-sm mb-3">{metric.description}</p>
                <div className="space-y-1">
                  {metric.criteria.map((criterion) => (
                    <div key={criterion} className="flex items-center gap-2 text-white/60 text-xs">
                      <div className="w-1.5 h-1.5 bg-[#d1a954] rounded-full" />
                      {criterion}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score Calculation */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">How Scores Are Calculated</h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-lg">Weighted Scoring</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                  <span className="text-white/80 text-sm">Structure</span>
                  <span className="text-[#d1a954] font-mono">25%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                  <span className="text-white/80 text-sm">KPI Compliance</span>
                  <span className="text-[#d1a954] font-mono">30%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                  <span className="text-white/80 text-sm">Clarity</span>
                  <span className="text-[#d1a954] font-mono">25%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                  <span className="text-white/80 text-sm">Executability</span>
                  <span className="text-[#d1a954] font-mono">20%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white text-lg">Example Calculation</h4>
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-4">
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-white/80">Structure: 85/100</span>
                    <span className="text-[#d1a954]">× 0.25 = 21.25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">KPI: 90/100</span>
                    <span className="text-[#d1a954]">× 0.30 = 27.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Clarity: 88/100</span>
                    <span className="text-[#d1a954]">× 0.25 = 22.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Executability: 82/100</span>
                    <span className="text-[#d1a954]">× 0.20 = 16.40</span>
                  </div>
                  <div className="border-t border-[#5a5a5a]/30 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Total Score:</span>
                      <span className="text-[#d1a954]">86.65</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testing Workflow */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Testing Workflow</h2>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Generate Prompt</h4>
              <p className="text-white/80 text-sm">
                Create your prompt using the 7D parameter engine and selected module.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Run Simulated Test</h4>
              <p className="text-white/80 text-sm">
                Get instant feedback on structure, clarity, and compliance with your requirements.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Refine & Iterate</h4>
              <p className="text-white/80 text-sm">
                Use feedback to improve your prompt and achieve the target score of ≥80.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              4
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Live Testing (Optional)</h4>
              <p className="text-white/80 text-sm">
                For Pro/Enterprise users: validate with real GPT models for ultimate confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <div className="text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#d1a954]/20 border border-[#d1a954]/40 text-[#d1a954] rounded-lg hover:bg-[#d1a954]/30 transition-colors duration-200"
        >
          <ArrowUp className="w-4 h-4" />
          Back to Top
        </button>
      </div>
    </section>
  );
}

"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";

export function OverviewSection() {
  return (
    <section id="overview" className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Welcome to <span className="text-[#d1a954]">PromptForge™ v3</span>
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          The Cognitive OS for Prompts - 50 semantic modules powered by a revolutionary 7D parameter engine
        </p>
      </div>

      {/* What is PromptForge */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d1a954] rounded-lg flex items-center justify-center">
            <ArrowUp className="w-5 h-5 text-black" />
          </div>
          What is PromptForge?
        </h2>
        
        <div className="space-y-4 text-white/90 leading-relaxed">
          <p>
            PromptForge™ v3 is a cognitive operating system designed to revolutionize prompt engineering. 
            It combines 50 specialized semantic modules with an advanced 7-dimensional parameter engine 
            to generate contextually aware, highly optimized prompts for any AI interaction.
          </p>
          
          <p>
            Unlike traditional prompt generators, PromptForge uses a sophisticated scoring system that 
            ensures every generated prompt meets professional standards (score ≥80) before delivery. 
            This creates a reliable, enterprise-grade tool for AI professionals, content creators, and developers.
          </p>
        </div>
      </div>

      {/* Core Components */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 50 Semantic Modules */}
        <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-[#d1a954] mb-4">50 Semantic Modules</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-4">
            Each module specializes in a specific domain or use case, from creative writing and 
            technical documentation to business strategy and scientific research.
          </p>
          <div className="flex items-center gap-2 text-[#d1a954] text-sm">
            <span>Specialized domains</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* 7D Parameter Engine */}
        <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-[#d1a954] mb-4">7D Parameter Engine</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-4">
            A revolutionary parameter system that considers Domain, Scale, Urgency, Complexity, 
            Resources, Application, and Output to generate perfectly calibrated prompts.
          </p>
          <div className="flex items-center gap-2 text-[#d1a954] text-sm">
            <span>Multi-dimensional optimization</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Workflow Overview */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Select Module</h4>
              <p className="text-white/80 text-sm">
                Choose from 50 specialized modules based on your specific use case and domain requirements.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Configure 7D Parameters</h4>
              <p className="text-white/80 text-sm">
                Fine-tune Domain, Scale, Urgency, Complexity, Resources, Application, and Output 
                to match your exact needs and constraints.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Generate & Test</h4>
              <p className="text-white/80 text-sm">
                Generate your prompt and test it using our advanced scoring system to ensure 
                quality meets professional standards (score ≥80).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              4
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Export & Deploy</h4>
              <p className="text-white/80 text-sm">
                Export your validated prompt in multiple formats (.txt, .md, .json, .pdf, .zip) 
                and deploy it directly to your AI workflows.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Key Benefits</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#d1a954] rounded-full" />
              <span className="text-white/90">Professional-grade prompt quality</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#d1a954] rounded-full" />
              <span className="text-white/90">Context-aware generation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#d1a954] rounded-full" />
              <span className="text-white/90">Advanced testing & validation</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#d1a954] rounded-full" />
              <span className="text-white/90">Multiple export formats</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#d1a954] rounded-full" />
              <span className="text-white/90">Enterprise API access</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#d1a954] rounded-full" />
              <span className="text-white/90">Scalable team collaboration</span>
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

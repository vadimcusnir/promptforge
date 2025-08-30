"use client";

import { useState } from "react";
import { Play, Copy, Download } from "lucide-react";
import type { PromptModule } from "@/types/promptforge";

interface ModuleDemoProps {
  module: PromptModule;
}

export function ModuleDemo({ module }: ModuleDemoProps) {
  const [inputValue, setInputValue] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDemo = async () => {
    if (!inputValue.trim()) return;

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      const demoPrompt = `[PROMPTFORGE™ M${String(module.id).padStart(2, "0")} - ${module.name}]

INPUT: "${inputValue}"

GENERATED PROMPT:
---
You are an expert ${module.name.toLowerCase()} specialist. Your task is to ${module.description.toLowerCase()}.

Context: ${inputValue}

Requirements:
${module.requirements}

Expected Output Format:
${module.output}

Success Criteria:
${module.kpi}

Constraints:
${module.guardrails}

Execute this task with precision and industrial-grade quality.
---

RUN_ID: demo_${Date.now()}
TELEMETRY: Vector V${module.vector} | Score: 85/100 | TTA: 45s`;

      setGeneratedPrompt(demoPrompt);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-8 text-[#d1a954] font-sans">
        Interactive Demo
      </h2>

      <div className="glass-effect border border-[#5a5a5a]/30 rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 text-white font-open-sans">
            Enter your context or requirements:
          </label>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Example: "Launch campaign for new SaaS product targeting enterprise clients"`}
            className="w-full h-24 bg-black/50 border border-[#5a5a5a]/30 rounded-lg p-4 text-white placeholder-[#5a5a5a] focus:border-[#d1a954] focus:outline-none font-open-sans"
          />
        </div>

        <button
          onClick={handleDemo}
          disabled={!inputValue.trim() || isGenerating}
          className="bg-gradient-to-r from-[#d1a954] to-[#d1a954]/80 text-black font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-[#d1a954]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-open-sans"
        >
          <Play className="w-4 h-4 inline mr-2" />
          {isGenerating ? "Generating..." : "Run Demo Now"}
        </button>

        {generatedPrompt && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white font-sans">
                Generated Output
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="text-[#5a5a5a] hover:text-white transition-colors p-2"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  className="text-[#5a5a5a] hover:text-white transition-colors p-2"
                  title="Download as file"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <pre className="bg-black/70 border border-[#5a5a5a]/30 rounded-lg p-4 text-sm text-[#5a5a5a] overflow-x-auto whitespace-pre-wrap font-mono">
              {generatedPrompt}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

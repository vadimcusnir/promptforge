"use client";

import { ArrowUp, Download, Shield, CheckCircle, Package } from "lucide-react";

export function ExportPipelineSection() {
  const exportFormats = [
    {
      name: "Plain Text (.txt)",
      description: "Simple text format for basic use cases",
      features: ["Universal compatibility", "Lightweight", "Easy to edit"],
      plan: "All plans",
      icon: "📄"
    },
    {
      name: "Markdown (.md)",
      description: "Structured text with formatting support",
      features: ["Rich formatting", "Git-friendly", "Documentation ready"],
      plan: "All plans",
      icon: "📝"
    },
    {
      name: "JSON (.json)",
      description: "Structured data format for APIs and automation",
      features: ["Machine readable", "Schema validation", "Integration ready"],
      plan: "Pro/Enterprise",
      icon: "🔧"
    },
    {
      name: "PDF (.pdf)",
      description: "Professional document format for presentations",
      features: ["Print ready", "Branded templates", "Client delivery"],
      plan: "Pro/Enterprise",
      icon: "📊"
    },
    {
      name: "ZIP Bundle (.zip)",
      description: "Complete project package with all assets",
      features: ["Multiple formats", "Asset inclusion", "Project backup"],
      plan: "Enterprise",
      icon: "📦"
    }
  ];

  return (
    <section id="export-pipeline" className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          <span className="text-[#d1a954]">Export Pipeline</span> & Artifacts
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Transform your validated prompts into professional deliverables with multiple export formats, 
          gating rules, and comprehensive artifact management
        </p>
      </div>

      {/* Export Overview */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d1a954] rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-black" />
          </div>
          Export Philosophy
        </h2>
        
        <div className="space-y-4 text-white/90 leading-relaxed">
          <p>
            PromptForge™ v3's export pipeline is designed to transform your validated prompts into 
            professional, production-ready artifacts. Every export includes comprehensive metadata, 
            validation certificates, and format-specific optimizations.
          </p>
          
          <p>
            Our gating system ensures that export capabilities scale with your plan level, providing 
            access to advanced formats and features as your needs grow. All exports maintain the 
            quality standards established during testing (score ≥80).
          </p>
        </div>
      </div>

      {/* Export Formats */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Available Export Formats</h2>
        
        {exportFormats.map((format) => (
          <div key={format.name} className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-3xl">{format.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-[#d1a954]">{format.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    format.plan === "All plans" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : format.plan === "Pro/Enterprise"
                      ? "bg-[#d1a954]/20 text-[#d1a954] border border-[#d1a954]/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}>
                    {format.plan}
                  </span>
                </div>
                <p className="text-white/80 text-sm mb-3">{format.description}</p>
                <div className="flex flex-wrap gap-2">
                  {format.features.map((feature) => (
                    <span key={feature} className="px-2 py-1 bg-[#1a1a1a] text-white/70 text-xs rounded border border-[#5a5a5a]/30">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gating Rules */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d1a954] rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          Plan-Based Gating
        </h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3 text-center">Free Plan</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>.txt export</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>.md export</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-4 h-4 border border-[#5a5a5a] rounded-full" />
                  <span>.json export</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-4 h-4 border border-[#5a5a5a] rounded-full" />
                  <span>.pdf export</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-4 h-4 border border-[#5a5a5a] rounded-full" />
                  <span>.zip bundles</span>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#1a1a1a] border border-[#d1a954]/30 rounded-lg p-4">
              <h4 className="font-semibold text-[#d1a954] mb-3 text-center">Pro Plan</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>.txt export</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>.md export</span>
                </div>
                <div className="flex items-center gap-2 text-[#d1a954]">
                  <CheckCircle className="w-4 h-4 text-[#d1a954]" />
                  <span>.json export</span>
                </div>
                <div className="flex items-center gap-2 text-[#d1a954]">
                  <CheckCircle className="w-4 h-4 text-[#d1a954]" />
                  <span>.pdf export</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-4 h-4 border border-[#5a5a5a] rounded-full" />
                  <span>.zip bundles</span>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[#1a1a1a] border border-[#d1a954]/30 rounded-lg p-4">
              <h4 className="font-semibold text-[#d1a954] mb-3 text-center">Enterprise Plan</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>.txt export</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>.md export</span>
                </div>
                <div className="flex items-center gap-2 text-[#d1a954]">
                  <CheckCircle className="w-4 h-4 text-[#d1a954]" />
                  <span>.json export</span>
                </div>
                <div className="flex items-center gap-2 text-[#d1a954]">
                  <CheckCircle className="w-4 h-4 text-[#d1a954]" />
                  <span>.pdf export</span>
                </div>
                <div className="flex items-center gap-2 text-[#d1a954]">
                  <CheckCircle className="w-4 h-4 text-[#d1a954]" />
                  <span>.zip bundles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artifact Management */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d1a954] rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-black" />
          </div>
          Artifact Management
        </h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Manifest Requirements */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-lg">Export Manifest</h4>
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-4">
                <div className="space-y-2 text-sm font-mono">
                  <div className="text-white/60">Every export includes:</div>
                  <div className="text-white/80">• Prompt content & metadata</div>
                  <div className="text-white/80">• 7D parameter configuration</div>
                  <div className="text-white/80">• Test results & validation score</div>
                  <div className="text-white/80">• Export timestamp & version</div>
                  <div className="text-white/80">• Quality certification (≥80)</div>
                </div>
              </div>
            </div>

            {/* Checksum & Validation */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-lg">Integrity Verification</h4>
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-4">
                <div className="space-y-2 text-sm font-mono">
                  <div className="text-white/60">Security features:</div>
                  <div className="text-white/80">• SHA-256 checksums</div>
                  <div className="text-white/80">• Digital signatures</div>
                  <div className="text-white/80">• Tamper detection</div>
                  <div className="text-white/80">• Version control</div>
                  <div className="text-white/80">• Audit trails</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Workflow */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Export Workflow</h2>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Validate Prompt</h4>
              <p className="text-white/80 text-sm">
                Ensure your prompt achieves the required score of ≥80 through testing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Select Format</h4>
              <p className="text-white/80 text-sm">
                Choose from available export formats based on your plan and requirements.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Generate Artifact</h4>
              <p className="text-white/80 text-sm">
                Create the export with full metadata, validation, and integrity checks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded-full flex items-center justify-center text-black font-bold text-sm">
              4
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Download & Deploy</h4>
              <p className="text-white/80 text-sm">
                Download your artifact and deploy it directly to your AI workflows.
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

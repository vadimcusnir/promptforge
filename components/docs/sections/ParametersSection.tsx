"use client";

import { ArrowUp, Info, CheckCircle } from "lucide-react";

export function ParametersSection() {
  const parameters = [
    {
      name: "Domain",
      description: "The field or industry context for the prompt",
      allowedValues: ["Creative", "Technical", "Business", "Academic", "Scientific", "Marketing", "Legal", "Medical", "Education", "Entertainment"],
      defaultValue: "Creative",
      example: "Domain: Technical - for software development prompts"
    },
    {
      name: "Scale",
      description: "The scope and magnitude of the task",
      allowedValues: ["Micro", "Small", "Medium", "Large", "Enterprise", "Global"],
      defaultValue: "Medium",
      example: "Scale: Large - for comprehensive project planning"
    },
    {
      name: "Urgency",
      description: "Time sensitivity and priority level",
      allowedValues: ["Low", "Normal", "High", "Critical", "Emergency"],
      defaultValue: "Normal",
      example: "Urgency: High - for time-sensitive content creation"
    },
    {
      name: "Complexity",
      description: "The intricacy and sophistication required",
      allowedValues: ["Simple", "Moderate", "Complex", "Advanced", "Expert"],
      defaultValue: "Moderate",
      example: "Complexity: Expert - for advanced technical documentation"
    },
    {
      name: "Resources",
      description: "Available tools, data, and capabilities",
      allowedValues: ["Minimal", "Basic", "Standard", "Enhanced", "Premium", "Unlimited"],
      defaultValue: "Standard",
      example: "Resources: Enhanced - with access to specialized databases"
    },
    {
      name: "Application",
      description: "How the prompt will be used and deployed",
      allowedValues: ["Internal", "Client", "Public", "Research", "Production", "Development"],
      defaultValue: "Internal",
      example: "Application: Client - for customer-facing content"
    },
    {
      name: "Output",
      description: "The desired format and structure of results",
      allowedValues: ["Text", "Structured", "Code", "Visual", "Interactive", "Multi-format"],
      defaultValue: "Text",
      example: "Output: Structured - for organized data presentation"
    }
  ];

  return (
    <section id="7d-parameters" className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          <span className="text-[hsl(var(--accent))]">7D Parameters</span> Engine
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Master the seven dimensions that control prompt generation: Domain, Scale, Urgency, 
          Complexity, Resources, Application, and Output
        </p>
      </div>

      {/* Parameter Overview */}
      <div className="bg-primary border border-border/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center">
            <Info className="w-5 h-5 text-black" />
          </div>
          How 7D Parameters Work
        </h2>
        
        <div className="space-y-4 text-white/90 leading-relaxed">
          <p>
            The 7D parameter engine is the heart of PromptForge™ v3. Each parameter influences 
            how the system generates prompts, ensuring they're perfectly calibrated for your 
            specific use case and requirements.
          </p>
          
          <p>
            Parameters work together synergistically - changing one can affect how others are 
            interpreted. For example, setting Complexity to "Expert" with Resources to "Minimal" 
            will generate prompts that maximize efficiency with limited tools.
          </p>
        </div>
      </div>

      {/* Parameter Details */}
      <div className="space-y-6">
        {parameters.map((param, index) => (
          <div key={param.name} className="bg-primary border border-border/30 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-[hsl(var(--accent))] rounded-full flex items-center justify-center text-black font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[hsl(var(--accent))] mb-2">{param.name}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{param.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Allowed Values */}
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[hsl(var(--accent))]" />
                  Allowed Values
                </h4>
                <div className="flex flex-wrap gap-2">
                  {param.allowedValues.map((value) => (
                    <span
                      key={value}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        value === param.defaultValue
                          ? "bg-[hsl(var(--accent))] text-black"
                          : "bg-primary text-white/80 border border-border/30"
                      }`}
                    >
                      {value}
                    </span>
                  ))}
                </div>
                <p className="text-white/60 text-xs mt-2">
                  Default: <span className="text-[hsl(var(--accent))]">{param.defaultValue}</span>
                </p>
              </div>

              {/* Example */}
              <div>
                <h4 className="font-semibold text-white mb-3">Example Usage</h4>
                <div className="bg-primary border border-border/30 rounded-lg p-3">
                  <p className="text-white/90 text-sm font-mono">{param.example}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Parameter Interactions */}
      <div className="bg-primary border border-border/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Parameter Interactions</h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-lg">Synergistic Effects</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">High Complexity + Enhanced Resources</p>
                    <p className="text-white/60 text-xs">Generates sophisticated, feature-rich prompts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Critical Urgency + Minimal Resources</p>
                    <p className="text-white/60 text-xs">Creates efficient, streamlined solutions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Enterprise Scale + Client Application</p>
                    <p className="text-white/60 text-xs">Produces professional, client-ready content</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white text-lg">Best Practices</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Start with Domain and Scale</p>
                    <p className="text-white/60 text-xs">These provide the foundation for other parameters</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Balance Complexity with Resources</p>
                    <p className="text-white/60 text-xs">Ensure your capabilities match your ambitions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Consider Application Context</p>
                    <p className="text-white/60 text-xs">Internal vs. client-facing prompts have different requirements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <div className="text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--accent))]/20 border border-[hsl(var(--accent))]/40 text-[hsl(var(--accent))] rounded-lg hover:bg-[hsl(var(--accent))]/30 transition-colors duration-200"
        >
          <ArrowUp className="w-4 h-4" />
          Back to Top
        </button>
      </div>
    </section>
  );
}

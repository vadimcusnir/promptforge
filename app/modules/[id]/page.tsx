import { notFound } from "next/navigation";
import { modules } from "@/lib/modules";
import { ExternalLink, Play } from "lucide-react";
import { ModuleSpec } from "@/components/module-spec";
import { ModuleDemo } from "@/components/module-demo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

interface ModulePageProps {
  params: {
    id: string;
  };
}

export default function ModulePage({ params }: ModulePageProps) {
  const moduleId = Number.parseInt(params.id);
  const module = modules.find((m) => m.id === moduleId);

  if (!module) {
    notFound();
  }

  const vectorColors = {
    1: "text-red-400 border-red-400/30 bg-red-400/10",
    2: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    3: "text-green-400 border-green-400/30 bg-green-400/10",
    4: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    5: "text-purple-400 border-purple-400/30 bg-purple-400/10",
    6: "text-pink-400 border-pink-400/30 bg-pink-400/10",
    7: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  };

  const vectorNames = {
    1: "Semantic Warfare",
    2: "Marketing Intelligence",
    3: "Content Engineering",
    4: "Brand Architecture",
    5: "Semiotic Branding",
    6: "Crisis Management",
    7: "Growth Hacking",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Modules", href: "/modules" },
            {
              label: `M${String(module.id).padStart(2, "0")} ${module.name}`,
              href: `/modules/${module.id}`,
            },
          ]}
        />

        <div className="mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`px-4 py-2 rounded-lg border text-sm font-mono font-bold ${vectorColors[module.vector as keyof typeof vectorColors]}`}
            >
              M{String(module.id).padStart(2, "0")}
            </div>
            <div
              className={`px-4 py-2 rounded-lg border text-sm font-semibold ${vectorColors[module.vector as keyof typeof vectorColors]}`}
            >
              V{module.vector}{" "}
              {vectorNames[module.vector as keyof typeof vectorNames]}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-montserrat">
            {module.name}
          </h1>
          <p className="text-xl text-[#5a5a5a] mb-6 font-open-sans">
            {module.description}
          </p>
        </div>

        <ModuleSpec module={module} />

        <ModuleDemo module={module} />

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button className="flex-1 bg-gradient-to-r from-[#d1a954] to-[#d1a954]/80 text-black font-semibold py-4 px-8 rounded-lg hover:shadow-lg hover:shadow-[#d1a954]/25 transition-all font-open-sans">
            <Play className="w-5 h-5 inline mr-2" />
            Generate Prompt with This Module
          </button>
          <button className="flex items-center justify-center gap-2 border border-[#5a5a5a]/30 text-[#5a5a5a] hover:text-white hover:border-white py-4 px-8 rounded-lg transition-colors font-open-sans">
            <ExternalLink className="w-4 h-4" />
            Export Specifications
          </button>
        </div>

        <div className="glass-effect border border-[#5a5a5a]/30 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-[#d1a954] font-montserrat">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2 text-white">
                When should I use this module?
              </h4>
              <p className="text-[#5a5a5a] font-open-sans">
                This module is optimized for {module.description.toLowerCase()}.
                Use it when you need precise, industrial-grade prompts that meet
                the specified KPI targets.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2 text-white">
                What makes this different from other modules?
              </h4>
              <p className="text-[#5a5a5a] font-open-sans">
                Each module in Vector {module.vector} is specifically engineered
                for{" "}
                {vectorNames[
                  module.vector as keyof typeof vectorNames
                ].toLowerCase()}
                with unique guardrails and optimization parameters.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2 text-white">
                What do I get with Pro upgrade?
              </h4>
              <p className="text-[#5a5a5a] font-open-sans">
                Pro users get complete export bundles (JSON/PDF), advanced
                telemetry, GPT Live optimization, and unlimited module
                executions with priority processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

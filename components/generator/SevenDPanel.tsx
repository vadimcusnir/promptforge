"use client";

import { useState } from "react";
import { ChevronDown, Zap } from "lucide-react";
import type { PromptModule, SevenDConfig } from "@/types/promptforge";
import { modules } from "@/lib/modules";

interface SevenDPanelProps {
  selectedModule: PromptModule;
  onModuleChange: (module: PromptModule) => void;
  sevenDConfig: SevenDConfig;
  onConfigChange: (config: SevenDConfig) => void;
}

const SEVEN_D_OPTIONS = {
  domain: [
    "business",
    "technical",
    "creative",
    "research",
    "marketing",
    "operations",
  ],
  scale: ["startup", "enterprise", "global", "personal", "team"],
  urgency: ["low", "medium", "high", "critical", "emergency"],
  complexity: ["simple", "moderate", "advanced", "expert", "research"],
  resources: ["limited", "moderate", "extensive", "unlimited"],
  application: ["prototype", "testing", "production", "mission-critical"],
  output: ["structured", "narrative", "analytical", "creative", "technical"],
};

const DOMAIN_DEFAULTS: Record<string, Partial<SevenDConfig>> = {
  business: { scale: "enterprise", urgency: "high", complexity: "advanced" },
  technical: { scale: "team", urgency: "medium", complexity: "expert" },
  creative: { scale: "personal", urgency: "low", complexity: "moderate" },
  research: { scale: "global", urgency: "medium", complexity: "research" },
  marketing: { scale: "enterprise", urgency: "high", complexity: "advanced" },
  operations: {
    scale: "enterprise",
    urgency: "critical",
    complexity: "expert",
  },
};

export function SevenDPanel({
  selectedModule,
  onModuleChange,
  sevenDConfig,
  onConfigChange,
}: SevenDPanelProps) {
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);

  const handleDomainChange = (domain: string) => {
    const defaults = DOMAIN_DEFAULTS[domain] || {};
    onConfigChange({
      ...sevenDConfig,
      domain,
      ...defaults,
    });
  };

  const handleConfigChange = (key: keyof SevenDConfig, value: string) => {
    onConfigChange({
      ...sevenDConfig,
      [key]: value,
    });
  };

  const getVectorColors = (vectors: number[]) => {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
    ];
    return vectors.map((v) => colors[v - 1] || "#5a5a5a");
  };

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 font-sans">
          Module Selection
        </h2>

        <div className="relative">
          <button
            onClick={() => setShowModuleDropdown(!showModuleDropdown)}
            className="w-full p-4 bg-dark-secondary border border-lead-gray/30 rounded-lg text-left flex items-center justify-between hover:border-gold-industrial/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {getVectorColors(selectedModule.vectors).map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div>
                <div className="font-medium">{selectedModule.name}</div>
                <div className="text-sm text-lead-gray">
                  {selectedModule.description}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${showModuleDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {showModuleDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-dark-secondary border border-lead-gray/30 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => {
                    onModuleChange(module);
                    setShowModuleDropdown(false);
                  }}
                  className="w-full p-4 text-left hover:bg-lead-gray/10 border-b border-lead-gray/10 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {getVectorColors(module.vectors).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div>
                      <div className="font-medium">{module.name}</div>
                      <div className="text-sm text-lead-gray">
                        {module.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-gold-industrial" />
          <h2 className="text-xl font-semibold font-sans">
            7-D Configuration
          </h2>
        </div>

        <div className="grid gap-4">
          {Object.entries(SEVEN_D_OPTIONS).map(([key, options]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-2 capitalize">
                {key.replace("_", " ")}
              </label>
              <select
                value={sevenDConfig[key as keyof SevenDConfig]}
                onChange={(e) =>
                  key === "domain"
                    ? handleDomainChange(e.target.value)
                    : handleConfigChange(
                        key as keyof SevenDConfig,
                        e.target.value,
                      )
                }
                className="w-full p-3 bg-dark-secondary border border-lead-gray/30 rounded-lg focus:border-gold-industrial focus:outline-none transition-colors"
              >
                {options.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="bg-dark-secondary"
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-black/30 rounded-lg">
          <div className="text-xs text-lead-gray mb-1">7D Signature:</div>
          <div className="text-xs font-mono text-gold-industrial">
            {Object.entries(sevenDConfig)
              .map(([k, v]) => `${k}:${v}`)
              .join("|")}
          </div>
        </div>
      </div>
    </div>
  );
}

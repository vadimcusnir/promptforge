"use client";

import { SearchBar } from "./SearchBar";
import { ChevronRight, BookOpen, Settings, Zap, Download, Shield, Code, FileText, X } from "lucide-react";

interface DocsSidebarProps {
  isOpen: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onClose: () => void;
}

const sections = [
  {
    id: "overview",
    title: "Overview",
    icon: BookOpen,
    description: "What PromptForge does"
  },
  {
    id: "7d-parameters",
    title: "7D Parameters",
    icon: Settings,
    description: "Domain, Scale, Urgency, Complexity, Resources, Application, Output"
  },
  {
    id: "test-engine",
    title: "Test Engine",
    icon: Zap,
    description: "Simulated and live testing modes"
  },
  {
    id: "export-pipeline",
    title: "Export Pipeline",
    icon: Download,
    description: "Formats, gating rules, and artifacts"
  },
  {
    id: "entitlements",
    title: "Entitlements",
    icon: Shield,
    description: "Plan-based capabilities and limits"
  },
  {
    id: "examples",
    title: "Examples",
    icon: Code,
    description: "Practical configurations and results"
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: FileText,
    description: "Enterprise API endpoints"
  }
];

export function DocsSidebar({ isOpen, activeSection, onSectionChange, onClose }: DocsSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 bg-[#0e0e0e] border-r border-[#5a5a5a]/30 min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-[#d1a954] rounded" />
            <span className="font-mono font-bold text-[#d1a954] text-lg">Documentation</span>
          </div>
          
          <SearchBar />
          
          <nav className="mt-8 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#d1a954]/20 border border-[#d1a954]/40 text-[#d1a954]"
                      : "text-white/80 hover:text-white hover:bg-[#1a1a1a]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${
                      isActive ? "text-[#d1a954]" : "text-white/60 group-hover:text-white/80"
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium">{section.title}</div>
                      <div className={`text-xs mt-1 ${
                        isActive ? "text-[#d1a954]/80" : "text-white/50"
                      }`}>
                        {section.description}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isActive ? "rotate-90 text-[#d1a954]" : "text-white/40"
                    }`} />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#0e0e0e] border-r border-[#5a5a5a]/30 transform transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#d1a954] rounded" />
              <span className="font-mono font-bold text-[#d1a954] text-lg">Documentation</span>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-2 hover:bg-[#1a1a1a] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <SearchBar />
          
          <nav className="mt-8 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    onSectionChange(section.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#d1a954]/20 border border-[#d1a954]/40 text-[#d1a954]"
                      : "text-white/80 hover:text-white hover:bg-[#1a1a1a]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${
                      isActive ? "text-[#d1a954]" : "text-white/60 group-hover:text-white/80"
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium">{section.title}</div>
                      <div className={`text-xs mt-1 ${
                        isActive ? "text-[#d1a954]/80" : "text-white/50"
                      }`}>
                        {section.description}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isActive ? "rotate-90 text-[#d1a954]" : "text-white/40"
                    }`} />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

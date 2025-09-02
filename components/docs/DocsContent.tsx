"use client";

import { useEffect, useRef } from "react";
import { OverviewSection } from "./sections/OverviewSection";
import { ParametersSection } from "./sections/ParametersSection";
import { TestEngineSection } from "./sections/TestEngineSection";
import { ExportPipelineSection } from "./sections/ExportPipelineSection";
import { EntitlementsSection } from "./sections/EntitlementsSection";
import { ExamplesSection } from "./sections/ExamplesSection";
import { ApiReferenceSection } from "./sections/ApiReferenceSection";

interface DocsContentProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DocsContent({ activeSection, onSectionChange }: DocsContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for section highlighting
  useEffect(() => {
    if (typeof window === "undefined" || !('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId && sectionId !== activeSection) {
              onSectionChange(sectionId);
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -80% 0px",
        threshold: 0.1,
      }
    );

    const sections = contentRef.current?.querySelectorAll("[id]");
    sections?.forEach((_section) => observer.observe(_section));

    return () => observer.disconnect();
  }, [activeSection, onSectionChange]);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "7d-parameters":
        return <ParametersSection />;
      case "test-engine":
        return <TestEngineSection />;
      case "export-pipeline":
        return <ExportPipelineSection />;
      case "entitlements":
        return <EntitlementsSection />;
      case "examples":
        return <ExamplesSection />;
      case "api-reference":
        return <ApiReferenceSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div ref={contentRef}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

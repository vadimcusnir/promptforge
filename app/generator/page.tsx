import React from "react";
import { GeneratorClient } from "@/components/generator/GeneratorClient";
import { MODULES } from "@/lib/modules";

// Generate static params for all modules
export async function generateStaticParams() {
  return Object.keys(MODULES).map((moduleId) => ({
    moduleId: moduleId,
  }));
}

// Fetch module metadata at build time
export async function generateMetadata({ params }: { params: { moduleId?: string } }) {
  if (params?.moduleId) {
    const module = MODULES[parseInt(params.moduleId)];
    if (module) {
      return {
        title: `${module.name} - PromptForge Generator`,
        description: module.description,
      };
    }
  }
  
  return {
    title: "PromptForge Generator - AI Prompt Engineering",
    description: "Create powerful, context-aware prompts using our 7-Dimensional framework and curated module library.",
  };
}

export default async function GeneratorPage() {
  // Convert modules object to array for the client component
  const modulesArray = Object.values(MODULES);

  return <GeneratorClient modules={modulesArray} />;
}

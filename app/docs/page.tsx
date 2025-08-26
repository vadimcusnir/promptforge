import type { Metadata } from "next";
import { DocsLayout } from "@/components/docs/DocsLayout";

export const metadata: Metadata = {
  title: "Documentation — PromptForge™ v3",
  description: "Complete guide to PromptForge™ v3: 7D Parameters, Test Engine, Export Pipeline, and API Reference",
  keywords: "PromptForge documentation, 7D parameters, test engine, export pipeline, API reference",
};

export default function DocsPage() {
  return (
    <DocsLayout />
  );
}

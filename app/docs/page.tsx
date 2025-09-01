import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Code, Zap, Download, TestTube } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation — PromptForge™ v3",
  description: "Complete guide to PromptForge™ v3: 7D Parameters, Test Engine, Export Pipeline, and API Reference",
  keywords: "PromptForge documentation, 7D parameters, test engine, export pipeline, API reference",
  openGraph: {
    title: "Documentation — PromptForge™ v3",
    description: "Complete guide to PromptForge™ v3: 7D Parameters, Test Engine, Export Pipeline, and API Reference",
    type: "website",
  },
  alternates: {
    canonical: "https://chatgpt-prompting.com/docs",
  },
};

const documentationSections = [
  {
    title: "Overview",
    description: "Get started with PromptForge™ v3 and understand the core concepts",
    icon: BookOpen,
    href: "/docs#overview",
    color: "text-blue-400",
  },
  {
    title: "7D Parameters",
    description: "Learn about the 7D framework for structured prompt engineering",
    icon: Zap,
    href: "/docs#parameters",
    color: "text-purple-400",
  },
  {
    title: "Test Engine",
    description: "Validate and score your prompts with our advanced testing system",
    icon: TestTube,
    href: "/docs#test-engine",
    color: "text-green-400",
  },
  {
    title: "Export Pipeline",
    description: "Export your prompts in multiple formats with quality validation",
    icon: Download,
    href: "/docs#export-pipeline",
    color: "text-orange-400",
  },
  {
    title: "API Reference",
    description: "Integrate PromptForge into your applications with our REST API",
    icon: Code,
    href: "/docs/api",
    color: "text-cyan-400",
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#5a5a5a]/30 bg-[#0e0e0e]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded" />
            <span className="font-mono font-bold text-[#d1a954] text-xl">PromptForge™ v3</span>
          </div>
          <h1 className="font-sans text-4xl font-bold text-white mb-4">
            Documentation
          </h1>
          <p className="text-xl text-[#a0a0a0] font-sans max-w-3xl">
            Complete guide to PromptForge™ v3: 7D Parameters, Test Engine, Export Pipeline, and API Reference
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentationSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.title}
                href={section.href}
                className="group bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6 hover:border-[#d1a954]/50 transition-all duration-200 hover:bg-[#1f1f1f]"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-md bg-[#2a2a2a] ${section.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-sans text-lg font-semibold text-white mb-2 group-hover:text-[#d1a954] transition-colors">
                      {section.title}
                    </h2>
                    <p className="text-[#a0a0a0] font-sans text-sm mb-4">
                      {section.description}
                    </p>
                    <div className="flex items-center text-[#d1a954] text-sm font-sans">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Start */}
        <div className="mt-16 bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-8">
          <h2 className="font-sans text-2xl font-semibold text-white mb-4">
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-sans text-lg font-medium text-white mb-3">
                1. Understanding 7D Parameters
              </h3>
              <p className="text-[#a0a0a0] font-sans text-sm mb-4">
                The 7D framework provides structured parameters for consistent prompt engineering across all modules.
              </p>
              <Link
                href="/docs#parameters"
                className="inline-flex items-center text-[#d1a954] text-sm font-sans hover:text-[#d1a954]/80 transition-colors"
              >
                Learn about 7D <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div>
              <h3 className="font-sans text-lg font-medium text-white mb-3">
                2. API Integration
              </h3>
              <p className="text-[#a0a0a0] font-sans text-sm mb-4">
                Integrate PromptForge into your applications with our REST API and comprehensive examples.
              </p>
              <Link
                href="/docs/api"
                className="inline-flex items-center text-[#d1a954] text-sm font-sans hover:text-[#d1a954]/80 transition-colors"
              >
                View API Reference <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "PromptForge™ v3 Documentation",
            "description": "Complete guide to PromptForge™ v3: 7D Parameters, Test Engine, Export Pipeline, and API Reference",
            "author": {
              "@type": "Organization",
              "name": "PromptForge"
            },
            "datePublished": "2024-12-20",
            "dateModified": new Date().toISOString().split('T')[0],
            "publisher": {
              "@type": "Organization",
              "name": "PromptForge",
              "logo": {
                "@type": "ImageObject",
                "url": "https://chatgpt-prompting.com/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://chatgpt-prompting.com/docs"
            }
          })
        }}
      />
    </div>
  );
}

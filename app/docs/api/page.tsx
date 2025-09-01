import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { TableOfContents } from "@/components/docs/TableOfContents";

export const metadata: Metadata = {
  title: "API Reference — PromptForge™ v3",
  description: "Complete API reference for PromptForge™ v3: REST endpoints, 7D parameters, authentication, and examples",
  keywords: "PromptForge API, REST API, 7D parameters, API documentation, prompt engineering API",
  openGraph: {
    title: "API Reference — PromptForge™ v3",
    description: "Complete API reference for PromptForge™ v3: REST endpoints, 7D parameters, authentication, and examples",
    type: "website",
  },
  alternates: {
    canonical: "https://chatgpt-prompting.com/docs/api",
  },
};

const modules = [
  { id: 'M001', name: 'Content Optimization', description: 'Optimize content for clarity and engagement' },
  { id: 'M002', name: 'Technical Documentation', description: 'Generate technical documentation and guides' },
  { id: 'M003', name: 'Marketing Copy Generator', description: 'Create compelling marketing copy and campaigns' },
  { id: 'M004', name: 'Code Review Assistant', description: 'Review and improve code quality' },
  { id: 'M005', name: 'Data Analysis Prompts', description: 'Generate prompts for data analysis tasks' }
];

const curlExample = `curl -X POST https://api.promptforge.com/api/run/M001 \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "inputs": {
      "content": "Your input content here",
      "target_audience": "professionals",
      "optimization_goals": ["clarity", "engagement"]
    },
    "params": {
      "temperature": 0.7,
      "max_tokens": 1000,
      "stream": false
    }
  }'`;

const responseExample = `{
  "run_id": "run_M001_20241220_123456",
  "status": "completed",
  "score": 87,
  "duration_ms": 1250,
  "outputs": {
    "optimized_content": "Your optimized content here...",
    "engagement_metrics": {
      "readability_score": 85,
      "engagement_potential": 92
    },
    "improvement_suggestions": [
      "Consider adding more specific examples",
      "Use shorter sentences for better readability"
    ]
  },
  "telemetry": {
    "tokens_used": 1250,
    "model_version": "gpt-4-turbo",
    "processing_time": 1.2
  },
  "created_at": "2024-12-20T10:30:00Z"
}`;

const schema7D = {
  "inputs": {
    "type": "object",
    "properties": {
      "content": {
        "type": "string",
        "description": "The content to be processed",
        "required": true
      },
      "target_audience": {
        "type": "string",
        "description": "Target audience for the content",
        "enum": ["general", "professionals", "students", "experts"]
      },
      "optimization_goals": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["clarity", "engagement", "conversion", "accessibility"]
        },
        "description": "List of optimization objectives"
      }
    },
    "required": ["content"]
  },
  "params": {
    "type": "object",
    "properties": {
      "temperature": {
        "type": "number",
        "minimum": 0,
        "maximum": 2,
        "default": 0.7,
        "description": "Controls randomness in output"
      },
      "max_tokens": {
        "type": "integer",
        "minimum": 1,
        "maximum": 4000,
        "default": 1000,
        "description": "Maximum tokens in response"
      },
      "stream": {
        "type": "boolean",
        "default": false,
        "description": "Enable streaming response"
      }
    }
  }
};

const tocItems = [
  { id: 'authentication', title: 'Authentication', level: 2 },
  { id: 'endpoints', title: 'Endpoints', level: 2 },
  { id: 'schema', title: 'Schema (7D Framework)', level: 2 },
  { id: 'examples', title: 'Examples', level: 2 },
  { id: 'telemetry', title: 'Telemetry & Monitoring', level: 2 },
  { id: 'rate-limits', title: 'Rate Limits', level: 2 },
  { id: 'error-handling', title: 'Error Handling', level: 2 }
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#5a5a5a]/30 bg-[#0e0e0e]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/docs"
              className="inline-flex items-center text-[#d1a954] hover:text-[#d1a954]/80 transition-colors font-sans"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded" />
            <span className="font-mono font-bold text-[#d1a954] text-xl">PromptForge™ v3</span>
          </div>
          <h1 className="font-sans text-4xl font-bold text-white mb-4">
            API Reference
          </h1>
          <p className="text-xl text-[#a0a0a0] font-sans max-w-3xl">
            Integrate PromptForge modules into your applications with our REST API. 
            Execute prompt engineering workflows programmatically.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TableOfContents items={tocItems} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Authentication */}
            <section id="authentication">
              <h2 className="font-sans text-2xl font-semibold text-white mb-6">
                Authentication
              </h2>
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6">
                <p className="text-[#a0a0a0] font-sans mb-4">
                  All API requests require authentication using a Bearer token in the Authorization header.
                </p>
                <CodeBlock
                  code="Authorization: Bearer YOUR_API_KEY"
                  language="text"
                  title="Authorization Header"
                />
                <p className="text-[#a0a0a0] font-sans text-sm mt-4">
                  API keys are available in your dashboard settings. Keep your API key secure and never expose it in client-side code.
                </p>
              </div>
            </section>

            {/* Endpoints */}
            <section id="endpoints">
              <h2 className="font-sans text-2xl font-semibold text-white mb-6">
                Endpoints
              </h2>
              <div className="space-y-6">
                <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-2 py-1 bg-[#d1a954] text-black rounded text-xs font-mono font-semibold">
                      POST
                    </span>
                    <code className="text-white font-mono">
                      /api/run/{'{moduleId}'}
                    </code>
                  </div>
                  <p className="text-[#a0a0a0] font-sans mb-6">
                    Execute a module with the specified inputs and parameters.
                  </p>
                  
                  <h3 className="font-sans text-lg font-medium text-white mb-4">
                    Available Modules
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {modules.map((module) => (
                      <div key={module.id} className="bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-sans font-medium text-white">{module.name}</h4>
                          <code className="text-[#d1a954] font-mono text-xs">{module.id}</code>
                        </div>
                        <p className="text-[#a0a0a0] font-sans text-sm">{module.description}</p>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-sans text-lg font-medium text-white mb-4">
                    cURL Example
                  </h3>
                  <CodeBlock
                    code={curlExample}
                    language="bash"
                    title="Execute Module"
                  />
                </div>
              </div>
            </section>

            {/* Schema */}
            <section id="schema">
              <h2 className="font-sans text-2xl font-semibold text-white mb-6">
                Schema (7D Framework)
              </h2>
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6">
                <p className="text-[#a0a0a0] font-sans mb-6">
                  All modules follow the 7D framework for structured input and output.
                </p>
                <CodeBlock
                  code={JSON.stringify(schema7D, null, 2)}
                  language="json"
                  title="Input Schema"
                />
              </div>
            </section>

            {/* Examples */}
            <section id="examples">
              <h2 className="font-sans text-2xl font-semibold text-white mb-6">
                Response Example
              </h2>
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6">
                <CodeBlock
                  code={responseExample}
                  language="json"
                  title="Success Response"
                />
              </div>
            </section>

            {/* Telemetry */}
            <section id="telemetry">
              <h2 className="font-sans text-2xl font-semibold text-white mb-6">
                Telemetry & Monitoring
              </h2>
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6">
                <p className="text-[#a0a0a0] font-sans mb-6">
                  Every API call includes telemetry data for monitoring and optimization.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md p-4">
                    <h3 className="font-sans font-medium text-white mb-3">Performance Metrics</h3>
                    <ul className="space-y-2 text-[#a0a0a0] font-sans text-sm">
                      <li>• Response time (duration_ms)</li>
                      <li>• Token usage</li>
                      <li>• Model version</li>
                      <li>• Processing time</li>
                    </ul>
                  </div>
                  <div className="bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md p-4">
                    <h3 className="font-sans font-medium text-white mb-3">Quality Metrics</h3>
                    <ul className="space-y-2 text-[#a0a0a0] font-sans text-sm">
                      <li>• Quality score (0-100)</li>
                      <li>• Confidence level</li>
                      <li>• Validation status</li>
                      <li>• Error details</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits">
              <h2 className="font-sans text-2xl font-semibold text-white mb-6">
                Rate Limits
              </h2>
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#d1a954] mb-2">100</div>
                    <div className="text-white font-sans font-medium">Free Plan</div>
                    <div className="text-[#a0a0a0] font-sans text-sm">requests/hour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#d1a954] mb-2">1,000</div>
                    <div className="text-white font-sans font-medium">Pro Plan</div>
                    <div className="text-[#a0a0a0] font-sans text-sm">requests/hour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#d1a954] mb-2">10,000</div>
                    <div className="text-white font-sans font-medium">Enterprise</div>
                    <div className="text-[#a0a0a0] font-sans text-sm">requests/hour</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Error Handling */}
            <section id="error-handling">
              <h2 className="font-sans text-2xl font-semibold text-white mb-6">
                Error Handling
              </h2>
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6">
                <p className="text-[#a0a0a0] font-sans mb-6">
                  The API uses standard HTTP status codes and returns detailed error information.
                </p>
                <div className="space-y-4">
                  <div className="bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md p-4">
                    <h3 className="font-sans font-medium text-white mb-2">400 - Bad Request</h3>
                    <p className="text-[#a0a0a0] font-sans text-sm mb-2">Invalid request parameters or missing required fields.</p>
                    <CodeBlock
                      code={`{
  "error": "INVALID_INPUT",
  "message": "Missing required field: content",
  "details": {
    "field": "content",
    "type": "required"
  }
}`}
                      language="json"
                    />
                  </div>
                  <div className="bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md p-4">
                    <h3 className="font-sans font-medium text-white mb-2">401 - Unauthorized</h3>
                    <p className="text-[#a0a0a0] font-sans text-sm mb-2">Invalid or missing API key.</p>
                    <CodeBlock
                      code={`{
  "error": "UNAUTHORIZED",
  "message": "Invalid API key"
}`}
                      language="json"
                    />
                  </div>
                  <div className="bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md p-4">
                    <h3 className="font-sans font-medium text-white mb-2">429 - Rate Limited</h3>
                    <p className="text-[#a0a0a0] font-sans text-sm mb-2">Rate limit exceeded for your plan.</p>
                    <CodeBlock
                      code={`{
  "error": "RATE_LIMITED",
  "message": "Rate limit exceeded",
  "retry_after": 3600
}`}
                      language="json"
                    />
                  </div>
                </div>
              </div>
            </section>
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
            "headline": "PromptForge™ v3 API Reference",
            "description": "Complete API reference for PromptForge™ v3: REST endpoints, 7D parameters, authentication, and examples",
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
              "@id": "https://chatgpt-prompting.com/docs/api"
            }
          })
        }}
      />
    </div>
  );
}

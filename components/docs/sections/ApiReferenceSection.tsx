"use client";

import { ArrowUp, FileText, AlertTriangle, Terminal } from "lucide-react";

export function ApiReferenceSection() {
  return (
    <section id="api-reference" className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          <span className="text-[hsl(var(--accent))]">API Reference</span> & Integration
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Integrate PromptForge™ v3 into your applications with our comprehensive Enterprise API. 
          Generate prompts programmatically with full 7D parameter control and validation.
        </p>
      </div>

      {/* Enterprise Notice */}
      <div className="bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-[hsl(var(--accent))]" />
          <div>
            <h3 className="font-semibold text-[hsl(var(--accent))] text-lg">Enterprise Plan Required</h3>
            <p className="text-white/80 text-sm">
              API access is limited to Enterprise plan subscribers. Contact our sales team for 
              API access and custom integration support.
            </p>
          </div>
        </div>
      </div>

      {/* API Overview */}
      <div className="bg-primary border border-border/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-black" />
          </div>
          API Overview
        </h2>
        
        <div className="space-y-4 text-white/90 leading-relaxed">
          <p>
            The PromptForge™ v3 API provides programmatic access to our prompt generation 
            engine, allowing you to integrate AI prompt creation directly into your applications, 
            workflows, and automation systems.
          </p>
          
          <p>
            All API endpoints require proper authentication and entitlements. The system 
            automatically validates your plan level and returns appropriate error responses 
            for unauthorized requests.
          </p>
        </div>
      </div>

      {/* Base URL and Authentication */}
      <div className="bg-primary border border-border/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Base URL & Authentication</h2>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-white mb-3">Base URL</h4>
            <div className="bg-primary border border-border/30 rounded-lg p-4">
              <code className="text-[hsl(var(--accent))] font-mono text-sm">
                https://api.chatgpt-prompting.com/v3
              </code>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Authentication</h4>
            <div className="bg-primary border border-border/30 rounded-lg p-4">
              <div className="space-y-2 text-sm font-mono">
                <div className="text-white/60">All requests require an API key in the header:</div>
                <div className="text-white/80">Authorization: Bearer YOUR_API_KEY</div>
                <div className="text-white/60 mt-2">API keys are provided with Enterprise subscriptions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Endpoint */}
      <div className="bg-primary border border-border/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Generate Prompt</h2>
        
        <div className="space-y-6">
          {/* Endpoint Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Endpoint</h4>
              <div className="bg-primary border border-border/30 rounded-lg p-4">
                <div className="space-y-2 text-sm font-mono">
                  <div className="text-[hsl(var(--accent))]">POST</div>
                  <div className="text-white/80">/api/run/{'{moduleId}'}</div>
                  <div className="text-white/60">Generate a prompt using the specified module</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Rate Limits</h4>
              <div className="bg-primary border border-border/30 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/80">Requests per minute:</span>
                    <span className="text-[hsl(var(--accent))] font-mono">60</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Requests per hour:</span>
                    <span className="text-[hsl(var(--accent))] font-mono">1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Requests per day:</span>
                    <span className="text-[hsl(var(--accent))] font-mono">10,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Request Parameters */}
          <div>
            <h4 className="font-semibold text-white mb-3">Request Body Parameters</h4>
            <div className="bg-primary border border-border/30 rounded-lg p-4">
              <div className="space-y-4 text-sm font-mono">
                <div>
                  <div className="text-[hsl(var(--accent))] font-medium">params7D</div>
                  <div className="text-white/60 text-xs">Object containing the 7D parameter configuration</div>
                  <div className="text-white/80 mt-1">
                    <pre className="whitespace-pre-wrap">
{`{
  "domain": "Technical",
  "scale": "Medium",
  "urgency": "Normal",
  "complexity": "Moderate",
  "resources": "Standard",
  "application": "Internal",
  "output": "Text"
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="text-[hsl(var(--accent))] font-medium">variant</div>
                  <div className="text-white/60 text-xs">Optional: Specific variant of the module to use</div>
                  <div className="text-white/80 mt-1">"default" | "creative" | "technical" | "business"</div>
                </div>

                <div>
                  <div className="text-[hsl(var(--accent))] font-medium">seed</div>
                  <div className="text-white/60 text-xs">Optional: Random seed for reproducible results</div>
                  <div className="text-white/80 mt-1">Integer value (e.g., 12345)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Response Fields */}
          <div>
            <h4 className="font-semibold text-white mb-3">Response Fields</h4>
            <div className="bg-primary border border-border/30 rounded-lg p-4">
              <div className="space-y-4 text-sm font-mono">
                <div>
                  <div className="text-[hsl(var(--accent))] font-medium">artifacts</div>
                  <div className="text-white/60 text-xs">Generated prompt content and metadata</div>
                  <div className="text-white/80 mt-1">
                    <pre className="whitespace-pre-wrap">
{`{
  "prompt": "Generated prompt text...",
  "module": "module_id",
  "variant": "default",
  "timestamp": "2024-01-01T00:00:00Z"
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="text-[hsl(var(--accent))] font-medium">telemetry</div>
                  <div className="text-white/60 text-xs">Testing results and quality metrics</div>
                  <div className="text-white/80 mt-1">
                    <pre className="whitespace-pre-wrap">
{`{
  "score": 87,
  "metrics": {
    "structure": 85,
    "kpi_compliance": 90,
    "clarity": 88,
    "executability": 82
  },
  "validation": "passed"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Requests */}
      <div className="bg-primary border border-border/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Sample Requests</h2>
        
        <div className="space-y-6">
          {/* cURL Example */}
          <div>
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[hsl(var(--accent))]" />
              cURL Example
            </h4>
            <div className="bg-primary border border-border/30 rounded-lg p-4">
              <pre className="text-white/90 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
{`curl -X POST https://api.chatgpt-prompting.com/v3/api/run/creative-writing \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "params7D": {
      "domain": "Creative",
      "scale": "Medium",
      "urgency": "Normal",
      "complexity": "Moderate",
      "resources": "Standard",
      "application": "Public",
      "output": "Text"
    },
    "variant": "default",
    "seed": 12345
  }'`}
              </pre>
            </div>
          </div>

          {/* Python Example */}
          <div>
            <h4 className="font-semibold text-white mb-3">Python Example</h4>
            <div className="bg-primary border border-border/30 rounded-lg p-4">
              <pre className="text-white/90 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
{`import requests
import json

url = "https://api.chatgpt-prompting.com/v3/api/run/creative-writing"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "params7D": {
        "domain": "Creative",
        "scale": "Medium",
        "urgency": "Normal",
        "complexity": "Moderate",
        "resources": "Standard",
        "application": "Public",
        "output": "Text"
    },
    "variant": "default",
    "seed": 12345
}

response = requests.post(url, headers=headers, json=data)
result = response.json()

print(f"Generated Prompt: {result['artifacts']['prompt']}")
print(f"Quality Score: {result['telemetry']['score']}")`}
              </pre>
            </div>
          </div>

          {/* JavaScript Example */}
          <div>
            <h4 className="font-semibold text-white mb-3">JavaScript Example</h4>
            <div className="bg-primary border border-border/30 rounded-lg p-4">
              <pre className="text-white/90 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
{`const generatePrompt = async () => {
  const response = await fetch(
    'https://api.chatgpt-prompting.com/v3/api/run/creative-writing',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params7D: {
          domain: 'Creative',
          scale: 'Medium',
          urgency: 'Normal',
          complexity: 'Moderate',
          resources: 'Standard',
          application: 'Public',
          output: 'Text'
        },
        variant: 'default',
        seed: 12345
      })
    }
  );

  const result = await response.json();
  console.log('Generated Prompt:', result.artifacts.prompt);
  console.log('Quality Score:', result.telemetry.score);
};`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Error Handling */}
      <div className="bg-primary border border-border/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Error Handling</h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Common Error Codes</h4>
              <div className="space-y-3">
                <div className="bg-primary border border-border/30 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-400 font-mono text-sm">400</span>
                    <span className="text-white/80 text-xs">Bad Request</span>
                  </div>
                  <p className="text-white/60 text-xs">Invalid parameters or malformed request</p>
                </div>
                <div className="bg-primary border border-border/30 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-400 font-mono text-sm">401</span>
                    <span className="text-white/80 text-xs">Unauthorized</span>
                  </div>
                  <p className="text-white/60 text-xs">Invalid or missing API key</p>
                </div>
                <div className="bg-primary border border-border/30 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-400 font-mono text-sm">403</span>
                    <span className="text-white/80 text-xs">Forbidden</span>
                  </div>
                  <p className="text-white/60 text-xs">ENTITLEMENT_REQUIRED - Plan doesn't support API</p>
                </div>
                <div className="bg-primary border border-border/30 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-400 font-mono text-sm">429</span>
                    <span className="text-white/80 text-xs">Too Many Requests</span>
                  </div>
                  <p className="text-white/60 text-xs">Rate limit exceeded</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Error Response Format</h4>
              <div className="bg-primary border border-border/30 rounded-lg p-4">
                <pre className="text-white/90 text-sm font-mono whitespace-pre-wrap">
{`{
  "error": {
    "code": "ENTITLEMENT_REQUIRED",
    "message": "Your plan does not include API access",
    "details": "Upgrade to Enterprise plan for API features",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-primary border border-border/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">API Best Practices</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Performance</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Implement Caching</p>
                  <p className="text-white/60 text-xs">Cache responses for identical parameter combinations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Batch Requests</p>
                  <p className="text-white/60 text-xs">Group multiple prompts into single requests when possible</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Handle Rate Limits</p>
                  <p className="text-white/60 text-xs">Implement exponential backoff for 429 responses</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Security</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Secure API Keys</p>
                  <p className="text-white/60 text-xs">Never expose API keys in client-side code</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Validate Responses</p>
                  <p className="text-white/60 text-xs">Always validate API responses before processing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mt-2" />
                <div>
                  <p className="text-white/90 text-sm font-medium">Monitor Usage</p>
                  <p className="text-white/60 text-xs">Track API usage to stay within rate limits</p>
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

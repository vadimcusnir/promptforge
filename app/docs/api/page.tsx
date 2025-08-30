'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { cn } from '@/lib/utils'

export default function ApiDocsPage() {
  const [currentPlan] = useState<'free' | 'creator' | 'pro' | 'enterprise'>('free')
  const [selectedModule, setSelectedModule] = useState('M001')

  const modules = [
    { id: 'M001', name: 'Content Optimization' },
    { id: 'M002', name: 'Technical Documentation' },
    { id: 'M003', name: 'Marketing Copy Generator' }
  ]

  const generateCurlExample = (moduleId: string) => {
    return `curl -X POST https://api.chatgpt-prompting.com/api/run/${moduleId} \\
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
  }'`
  }

  const generateResponseExample = () => {
    return `{
  "run_id": "run_${selectedModule}_20241220_123456",
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
}`
  }

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
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-sans text-4xl font-bold text-foreground mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-muted-foreground font-sans max-w-3xl">
            Integrate PromptForge modules into your applications with our REST API. 
            Execute prompt engineering workflows programmatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Module Selection */}
              <div>
                <h2 className="font-sans text-lg font-semibold text-foreground mb-4">
                  Select Module
                </h2>
                <div className="space-y-2">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module.id)}
                      className={cn(
                        'w-full text-left p-3 rounded-md border transition-colors focus-ring font-sans',
                        selectedModule === module.id
                          ? 'border-primary bg-card text-foreground'
                          : 'border-border bg-surface text-foregroundMuted hover:border-primary/50'
                      )}
                    >
                      <div className="font-medium">{module.name}</div>
                      <div className="text-xs font-mono">{module.id}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div>
                <h2 className="font-sans text-lg font-semibold text-foreground mb-4">
                  Documentation
                </h2>
                <nav className="space-y-2">
                  <a href="#authentication" className="block text-foregroundMuted hover:text-foreground transition-colors font-sans">
                    Authentication
                  </a>
                  <a href="#endpoints" className="block text-foregroundMuted hover:text-foreground transition-colors font-sans">
                    Endpoints
                  </a>
                  <a href="#schema" className="block text-foregroundMuted hover:text-foreground transition-colors font-sans">
                    Schema (7D)
                  </a>
                  <a href="#examples" className="block text-foregroundMuted hover:text-foreground transition-colors font-sans">
                    Examples
                  </a>
                  <a href="#telemetry" className="block text-foregroundMuted hover:text-foreground transition-colors font-sans">
                    Telemetry
                  </a>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Authentication */}
            <section id="authentication">
              <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                Authentication
              </h2>
              <div className="bg-surface border border-border rounded-lg p-6">
                <p className="text-foregroundMuted font-sans mb-4">
                  All API requests require authentication using a Bearer token in the Authorization header.
                </p>
                <div className="bg-card border border-border rounded-md p-4">
                  <code className="text-foreground font-mono text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
                <p className="text-foregroundMuted font-sans text-sm mt-4">
                  API keys are available in your dashboard settings. Keep your API key secure and never expose it in client-side code.
                </p>
              </div>
            </section>

            {/* Endpoints */}
            <section id="endpoints">
              <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                Endpoints
              </h2>
              <div className="space-y-4">
                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs font-mono font-semibold">
                      POST
                    </span>
                    <code className="text-foreground font-mono">
                      /api/run/{selectedModule}
                    </code>
                  </div>
                  <p className="text-foregroundMuted font-sans mb-4">
                    Execute a module with the specified inputs and parameters.
                  </p>
                  
                  {/* cURL Example */}
                  <div className="bg-card border border-border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-sans font-medium text-foreground">cURL Example</h3>
                      <button
                        onClick={() => navigator.clipboard.writeText(generateCurlExample(selectedModule))}
                        className="text-xs text-accent hover:text-accent/80 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="text-foreground font-mono text-sm overflow-x-auto">
                      <code>{generateCurlExample(selectedModule)}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Schema */}
            <section id="schema">
              <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                Schema (7D Framework)
              </h2>
              <div className="bg-surface border border-border rounded-lg p-6">
                <p className="text-foregroundMuted font-sans mb-4">
                  All modules follow the 7D framework for structured input and output.
                </p>
                <div className="bg-card border border-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-sans font-medium text-foreground">Input Schema</h3>
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(schema7D, null, 2))}
                      className="text-xs text-accent hover:text-accent/80 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="text-foreground font-mono text-sm overflow-x-auto">
                    <code>{JSON.stringify(schema7D, null, 2)}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Response Example */}
            <section id="examples">
              <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                Response Example
              </h2>
              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="bg-card border border-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-sans font-medium text-foreground">Success Response</h3>
                    <button
                      onClick={() => navigator.clipboard.writeText(generateResponseExample())}
                      className="text-xs text-accent hover:text-accent/80 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="text-foreground font-mono text-sm overflow-x-auto">
                    <code>{generateResponseExample()}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Telemetry */}
            <section id="telemetry">
              <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                Telemetry & Monitoring
              </h2>
              <div className="bg-surface border border-border rounded-lg p-6">
                <p className="text-foregroundMuted font-sans mb-4">
                  Every API call includes telemetry data for monitoring and optimization.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-md p-4">
                    <h3 className="font-sans font-medium text-foreground mb-2">Performance Metrics</h3>
                    <ul className="space-y-1 text-foregroundMuted font-sans text-sm">
                      <li>• Response time (duration_ms)</li>
                      <li>• Token usage</li>
                      <li>• Model version</li>
                      <li>• Processing time</li>
                    </ul>
                  </div>
                  <div className="bg-card border border-border rounded-md p-4">
                    <h3 className="font-sans font-medium text-foreground mb-2">Quality Metrics</h3>
                    <ul className="space-y-1 text-foregroundMuted font-sans text-sm">
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
            <section>
              <h2 className="font-sans text-2xl font-semibold text-foreground mb-4">
                Rate Limits
              </h2>
              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-1">100</div>
                    <div className="text-foregroundMuted font-sans text-sm">Free Plan</div>
                    <div className="text-foregroundMuted font-sans text-xs">requests/hour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold mb-1">1,000</div>
                    <div className="text-foregroundMuted font-sans text-sm">Pro Plan</div>
                    <div className="text-foregroundMuted font-sans text-xs">requests/hour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-1">10,000</div>
                    <div className="text-foregroundMuted font-sans text-sm">Enterprise</div>
                    <div className="text-foregroundMuted font-sans text-xs">requests/hour</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

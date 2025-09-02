"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Copy, CheckCircle, AlertTriangle, ChevronLeft, ArrowRight, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function AuthenticationDocs() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const moduleId = "M01" // Declare the variable here

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const codeExamples = {
    curl: `curl -X POST "https://api.promptforge.com/v1/run/M01" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "params7D": {
      "domain": "marketing",
      "scale": "startup",
      "urgency": "standard",
      "complexity": "simple",
      "resources": "limited",
      "application": "content",
      "output": "text"
    }
  }'`,
    javascript: `const response = await fetch('https://api.promptforge.com/v1/run/M01', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    params7D: {
      domain: 'marketing',
      scale: 'startup',
      urgency: 'standard',
      complexity: 'simple',
      resources: 'limited',
      application: 'content',
      output: 'text'
    }
  })
});

const result = await response.json();`,
    python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

data = {
    'params7D': {
        'domain': 'marketing',
        'scale': 'startup',
        'urgency': 'standard',
        'complexity': 'simple',
        'resources': 'limited',
        'application': 'content',
        'output': 'text'
    }
}

response = requests.post(
    'https://api.promptforge.com/v1/run/M01',
    headers=headers,
    json=data
)`,
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/docs" className="text-gray-400 hover:text-[#d1a954] transition-colors">
            Documentation
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-[#d1a954]">Authentication</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#d1a954]/20 rounded-lg">
              <Shield className="w-6 h-6 text-[#d1a954]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-montserrat">Authentication</h1>
              <Badge className="mt-2 bg-red-500/20 text-red-400 border-red-500/30">Enterprise Only</Badge>
            </div>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl">
            Secure your API requests with bearer token authentication. Enterprise users get dedicated API keys for
            programmatic access to PromptForge.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="font-montserrat">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  PromptForge API uses Bearer Token authentication for all requests. Each Enterprise account receives a
                  unique API key that provides access to all modules and features programmatically.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-400 mb-1">Enterprise Feature</h4>
                      <p className="text-sm text-gray-300">
                        API access is only available for Enterprise plan subscribers. Upgrade your plan to get
                        programmatic access.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Getting Your API Key */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="font-montserrat">Getting Your API Key</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#d1a954] text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </span>
                    <span>Navigate to your Dashboard and click on "API Keys" in the sidebar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#d1a954] text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </span>
                    <span>Click "Generate New API Key" and provide a descriptive name</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#d1a954] text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </span>
                    <span>Copy and securely store your API key - it won't be shown again</span>
                  </li>
                </ol>

                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">Example API Key</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-gray-400 hover:text-white"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <code className="text-[#d1a954] font-mono">
                    {showApiKey
                      ? "pf_live_sk_1234567890abcdef1234567890abcdef"
                      : "pf_live_sk_••••••••••••••••••••••••••••••••"}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Authentication Header */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="font-montserrat">Authentication Header</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Include your API key in the Authorization header of every request using the Bearer token format:
                </p>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">Authorization Header</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY", "auth-header")}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode === "auth-header" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <code className="text-emerald-400 font-mono">Authorization: Bearer YOUR_API_KEY</code>
                </div>
              </CardContent>
            </Card>

            {/* Code Examples */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="font-montserrat">Code Examples</CardTitle>
                <CardDescription>Examples of authenticated requests in different programming languages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* cURL */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">cURL</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(codeExamples.curl, "curl")}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode === "curl" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{codeExamples.curl}</pre>
                  </div>
                </div>

                {/* JavaScript */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">JavaScript</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(codeExamples.javascript, "javascript")}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode === "javascript" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{codeExamples.javascript}</pre>
                  </div>
                </div>

                {/* Python */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">Python</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(codeExamples.python, "python")}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode === "python" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{codeExamples.python}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Handling */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="font-montserrat">Error Handling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Authentication errors return specific HTTP status codes and error messages:
                </p>

                <div className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">401</Badge>
                      <span className="font-semibold text-red-400">Unauthorized</span>
                    </div>
                    <p className="text-sm text-gray-300">Missing or invalid API key</p>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">403</Badge>
                      <span className="font-semibold text-amber-400">Forbidden</span>
                    </div>
                    <p className="text-sm text-gray-300">API key doesn't have required permissions</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">429</Badge>
                      <span className="font-semibold text-blue-400">Rate Limited</span>
                    </div>
                    <p className="text-sm text-gray-300">Too many requests - check rate limits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Reference */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-montserrat">Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-white mb-1">Base URL</div>
                  <code className="text-[#d1a954] bg-gray-900 px-2 py-1 rounded">https://api.promptforge.com/v1</code>
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Authentication</div>
                  <code className="text-[#d1a954] bg-gray-900 px-2 py-1 rounded">Bearer Token</code>
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Content-Type</div>
                  <code className="text-[#d1a954] bg-gray-900 px-2 py-1 rounded">application/json</code>
                </div>
              </CardContent>
            </Card>

            {/* Related Documentation */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-montserrat">Related Docs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/docs/api-run-module"
                  className="block p-3 rounded-lg border border-gray-800 hover:border-[#d1a954]/30 transition-colors"
                >
                  <div className="font-medium text-white">POST /api/run/{moduleId}</div>
                  <div className="text-sm text-gray-400">Execute modules via API</div>
                </Link>
                <Link
                  href="/docs/rate-limits"
                  className="block p-3 rounded-lg border border-gray-800 hover:border-[#d1a954]/30 transition-colors"
                >
                  <div className="font-medium text-white">Rate Limits & Quotas</div>
                  <div className="text-sm text-gray-400">Usage limits and throttling</div>
                </Link>
              </CardContent>
            </Card>

            {/* Need Enterprise? */}
            <Card className="bg-gradient-to-r from-[#d1a954]/10 to-transparent border-[#d1a954]/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-[#d1a954] mb-2">Need API Access?</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Upgrade to Enterprise to get full API access with dedicated keys.
                </p>
                <Button asChild size="sm" className="w-full bg-[#d1a954] hover:bg-[#d1a954]/80 text-black">
                  <Link href="/pricing">View Enterprise Plans</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-800">
          <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
            <Link href="/docs">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Link>
          </Button>
          <Button asChild className="bg-[#d1a954] hover:bg-[#d1a954]/80 text-black">
            <Link href="/docs/api-run-module">
              Next: API Endpoints
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

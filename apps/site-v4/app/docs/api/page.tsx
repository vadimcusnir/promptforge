"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, ExternalLink } from "lucide-react"

export default function APIDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)

  const copyEndpoint = () => {
    navigator.clipboard.writeText("POST /api/run/{moduleId}")
    setCopiedEndpoint(true)
    setTimeout(() => setCopiedEndpoint(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            API Documentation
          </h1>
          <p className="text-xl text-slate-300 font-mono">
            Integrate PromptForge into your applications with our REST API.
          </p>
        </div>

        {/* Main Endpoint */}
        <Card className="mb-8 bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-emerald-400 font-mono text-lg">Execute Module Endpoint</CardTitle>
                <CardDescription className="text-slate-400">Execute a prompt module with 7-D inputs</CardDescription>
              </div>
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                POST
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-700/50 mb-4">
              <div className="flex items-center justify-between">
                <code className="text-emerald-400 font-mono text-lg">POST /api/run/{"{moduleId}"}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyEndpoint}
                  className="text-slate-400 hover:text-emerald-400"
                >
                  {copiedEndpoint ? "Copied!" : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7D Schema */}
        <Card className="mb-8 bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-400">7D Schema</CardTitle>
            <CardDescription>Required parameters for module execution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {[
                { key: "context", desc: "Business background" },
                { key: "objective", desc: "Desired outcome" },
                { key: "audience", desc: "Target user characteristics" },
                { key: "constraints", desc: "Limitations and requirements" },
                { key: "domain", desc: "Industry or vertical" },
                { key: "depth", desc: "Level of detail" },
                { key: "deliverable", desc: "Expected format" },
              ].map((param) => (
                <div
                  key={param.key}
                  className="flex items-center justify-between p-3 bg-slate-950/30 rounded border border-slate-700/30"
                >
                  <code className="text-cyan-400 font-mono">{param.key}</code>
                  <span className="text-slate-300 text-sm">{param.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Handling */}
        <Card className="mb-8 bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-400">Error Handling</CardTitle>
            <CardDescription>HTTP status codes and error responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {[
                { code: "400", desc: "Invalid schema" },
                { code: "401", desc: "Unauthorized (API key missing/invalid)" },
                { code: "403", desc: "Insufficient plan permissions" },
                { code: "429", desc: "Rate limit exceeded" },
              ].map((error) => (
                <div
                  key={error.code}
                  className="flex items-center gap-4 p-3 bg-slate-950/30 rounded border border-slate-700/30"
                >
                  <Badge variant="destructive" className="font-mono">
                    {error.code}
                  </Badge>
                  <span className="text-slate-300">{error.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SDKs */}
        <Card className="mb-8 bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-400">SDKs & Tools</CardTitle>
            <CardDescription>Official SDKs and development tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "JavaScript", icon: "🟨", desc: "npm install @promptforge/sdk" },
                { name: "Python", icon: "🐍", desc: "pip install promptforge" },
                { name: "Postman", icon: "📮", desc: "Import collection" },
              ].map((sdk) => (
                <div
                  key={sdk.name}
                  className="p-4 bg-slate-950/30 rounded border border-slate-700/30 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{sdk.icon}</span>
                    <h3 className="font-semibold text-emerald-400">{sdk.name}</h3>
                  </div>
                  <code className="text-xs text-slate-400 font-mono">{sdk.desc}</code>
                  <Button variant="ghost" size="sm" className="mt-2 w-full text-emerald-400 hover:bg-emerald-500/10">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security & Legal */}
        <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-400">Security & Legal</CardTitle>
            <CardDescription>Compliance and security measures</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="legal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-950/50">
                <TabsTrigger value="legal" className="data-[state=active]:bg-emerald-500/20">
                  Legal
                </TabsTrigger>
                <TabsTrigger value="protection" className="data-[state=active]:bg-emerald-500/20">
                  Protection
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-emerald-500/20">
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="legal" className="mt-4">
                <div className="grid gap-2">
                  {["ToS", "Privacy Policy", "DPA", "GDPR-compliant cookie banner"].map((item) => (
                    <div key={item} className="flex items-center justify-between p-2 bg-slate-950/30 rounded">
                      <span className="text-slate-300">{item}</span>
                      <ExternalLink className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="protection" className="mt-4">
                <div className="grid gap-2">
                  {["Export watermarking", "PII detection", "Anonymized telemetry"].map((item) => (
                    <div key={item} className="flex items-center gap-2 p-2 bg-slate-950/30 rounded">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-4">
                <div className="grid gap-2">
                  {["Headers (CSP, HSTS)", "Rate limits", "CORS", "Input validation", "Key rotation"].map((item) => (
                    <div key={item} className="flex items-center gap-2 p-2 bg-slate-950/30 rounded">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

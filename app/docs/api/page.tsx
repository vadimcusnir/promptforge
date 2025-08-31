"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';

export default function APIDocsPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-pf-black py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pf-text mb-4">
            API Documentation
          </h1>
          <p className="text-pf-text-muted text-lg">
            Integrate PromptForge into your applications with our REST API
          </p>
        </div>

        {/* API Endpoint */}
        <Card className="bg-pf-surface border-pf-text-muted/30 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-pf-text">POST /api/run/{`{moduleId}`}</CardTitle>
                <CardDescription className="text-pf-text-muted">
                  Execute a prompt module with 7D framework inputs
                </CardDescription>
              </div>
              <Badge className="bg-gold-industrial text-pf-black">v1</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Request */}
            <div>
              <h3 className="text-pf-text font-semibold mb-3">Request</h3>
              <div className="bg-pf-black/50 p-4 rounded border border-pf-text-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-pf-text-muted">Headers</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(`Content-Type: application/json
Authorization: Bearer YOUR_API_KEY`)}
                    className="border-pf-text-muted/30 text-pf-text-muted"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="text-sm text-pf-text-muted overflow-x-auto">
{`Content-Type: application/json
Authorization: Bearer YOUR_API_KEY`}
                </pre>
              </div>
            </div>

            {/* 7D Schema */}
            <div>
              <h3 className="text-pf-text font-semibold mb-3">7D Schema</h3>
              <div className="bg-pf-black/50 p-4 rounded border border-pf-text-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-pf-text-muted">Request Body</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(`{
  "context": "Business context and background",
  "objective": "Specific goal or outcome desired",
  "audience": "Target audience characteristics",
  "constraints": "Limitations and requirements",
  "domain": "Industry or field of application",
  "depth": "Level of detail required",
  "deliverable": "Expected output format"
}`)}
                    className="border-pf-text-muted/30 text-pf-text-muted"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="text-sm text-pf-text-muted overflow-x-auto">
{`{
  "context": "Business context and background",
  "objective": "Specific goal or outcome desired", 
  "audience": "Target audience characteristics",
  "constraints": "Limitations and requirements",
  "domain": "Industry or field of application",
  "depth": "Level of detail required",
  "deliverable": "Expected output format"
}`}
                </pre>
              </div>
            </div>

            {/* Response */}
            <div>
              <h3 className="text-pf-text font-semibold mb-3">Response</h3>
              <div className="bg-pf-black/50 p-4 rounded border border-pf-text-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-pf-text-muted">Success Response (200)</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(`{
  "success": true,
  "data": {
    "runId": "run_123456789",
    "moduleId": "m01",
    "prompt": "Generated prompt text...",
    "score": 85,
    "kpis": {
      "clarity": 90,
      "completeness": 85,
      "relevance": 80
    },
    "guardrails": {
      "safety": "passed",
      "bias": "passed", 
      "quality": "passed"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}`)}
                    className="border-pf-text-muted/30 text-pf-text-muted"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="text-sm text-pf-text-muted overflow-x-auto">
{`{
  "success": true,
  "data": {
    "runId": "run_123456789",
    "moduleId": "m01", 
    "prompt": "Generated prompt text...",
    "score": 85,
    "kpis": {
      "clarity": 90,
      "completeness": 85,
      "relevance": 80
    },
    "guardrails": {
      "safety": "passed",
      "bias": "passed",
      "quality": "passed"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Telemetry Example */}
        <Card className="bg-pf-surface border-pf-text-muted/30 mb-8">
          <CardHeader>
            <CardTitle className="text-pf-text">Telemetry Example</CardTitle>
            <CardDescription className="text-pf-text-muted">
              Real-time performance metrics and usage analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-pf-black/50 p-4 rounded border border-pf-text-muted/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-pf-text-muted">Telemetry Data</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`{
  "runId": "run_123456789",
  "moduleId": "m01",
  "userId": "user_abc123",
  "plan": "PRO",
  "metrics": {
    "processingTime": 1.2,
    "tokenCount": 150,
    "vectorScore": 85,
    "qualityScore": 92
  },
  "usage": {
    "apiCalls": 1,
    "tokensUsed": 150,
    "quotaRemaining": 9850
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`)}
                  className="border-pf-text-muted/30 text-pf-text-muted"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="text-sm text-pf-text-muted overflow-x-auto">
{`{
  "runId": "run_123456789",
  "moduleId": "m01",
  "userId": "user_abc123", 
  "plan": "PRO",
  "metrics": {
    "processingTime": 1.2,
    "tokenCount": 150,
    "vectorScore": 85,
    "qualityScore": 92
  },
  "usage": {
    "apiCalls": 1,
    "tokensUsed": 150,
    "quotaRemaining": 9850
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Error Handling */}
        <Card className="bg-pf-surface border-pf-text-muted/30 mb-8">
          <CardHeader>
            <CardTitle className="text-pf-text">Error Handling</CardTitle>
            <CardDescription className="text-pf-text-muted">
              Common error responses and status codes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-pf-black/50 p-4 rounded border border-pf-text-muted/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="destructive">400</Badge>
                  <span className="text-sm font-medium text-pf-text">Bad Request</span>
                </div>
                <p className="text-xs text-pf-text-muted">
                  Invalid 7D schema or missing required fields
                </p>
              </div>
              
              <div className="bg-pf-black/50 p-4 rounded border border-pf-text-muted/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="destructive">401</Badge>
                  <span className="text-sm font-medium text-pf-text">Unauthorized</span>
                </div>
                <p className="text-xs text-pf-text-muted">
                  Invalid or missing API key
                </p>
              </div>
              
              <div className="bg-pf-black/50 p-4 rounded border border-pf-text-muted/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="destructive">403</Badge>
                  <span className="text-sm font-medium text-pf-text">Forbidden</span>
                </div>
                <p className="text-xs text-pf-text-muted">
                  Insufficient plan permissions
                </p>
              </div>
              
              <div className="bg-pf-black/50 p-4 rounded border border-pf-text-muted/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="destructive">429</Badge>
                  <span className="text-sm font-medium text-pf-text">Rate Limited</span>
                </div>
                <p className="text-xs text-pf-text-muted">
                  API rate limit exceeded
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SDK Links */}
        <Card className="bg-pf-surface border-pf-text-muted/30">
          <CardHeader>
            <CardTitle className="text-pf-text">SDKs & Libraries</CardTitle>
            <CardDescription className="text-pf-text-muted">
              Official SDKs and community libraries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="border-pf-text-muted/30 text-pf-text hover:bg-pf-text-muted/10 justify-start"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                JavaScript SDK
              </Button>
              <Button
                variant="outline"
                className="border-pf-text-muted/30 text-pf-text hover:bg-pf-text-muted/10 justify-start"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Python SDK
              </Button>
              <Button
                variant="outline"
                className="border-pf-text-muted/30 text-pf-text hover:bg-pf-text-muted/10 justify-start"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Postman Collection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

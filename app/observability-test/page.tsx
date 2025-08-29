"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  AlertTriangle, 
  Activity, 
  BarChart3, 
  Bell, 
  Zap,
  Target,
  Clock,
  Gauge,
  Shield
} from "lucide-react"
import { 
  forceTestError, 
  trackSentryEvent, 
  trackPerformanceMetric 
} from "@/lib/sentry"
import { 
  trackLandingCTAClick, 
  trackPricingView, 
  trackCheckoutStarted, 
  trackCheckoutCompleted, 
  trackGateHit, 
  trackFeatureUsage, 
  trackError, 
  trackPerformanceMetric as trackGA4Performance 
} from "@/lib/analytics"
import { 
  forceTestAlert, 
  getKPIMetrics, 
  getActiveAlerts,
  SLA_THRESHOLDS 
} from "@/lib/kpi-monitoring"

export default function ObservabilityTestPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [kpiMetrics, setKpiMetrics] = useState<any>(null)
  const [activeAlerts, setActiveAlerts] = useState<any[]>([])

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testSentryError = () => {
    try {
      addResult("🔴 Forcing Sentry error...")
      forceTestError("Test error for observability verification")
      addResult("✅ Sentry error sent successfully")
    } catch (error) {
      addResult(`❌ Failed to send Sentry error: ${error}`)
    }
  }

  const testSentryEvent = () => {
    try {
      addResult("📝 Sending Sentry event...")
      trackSentryEvent("test_event", { 
        test_type: "observability", 
        timestamp: Date.now() 
      })
      addResult("✅ Sentry event sent successfully")
    } catch (error) {
      addResult(`❌ Failed to send Sentry event: ${error}`)
    }
  }

  const testSentryPerformance = () => {
    try {
      addResult("⚡ Sending Sentry performance metric...")
      trackPerformanceMetric("test_metric", 100, { test: "observability" })
      addResult("✅ Sentry performance metric sent successfully")
    } catch (error) {
      addResult(`❌ Failed to send Sentry performance metric: ${error}`)
    }
  }

  const testGA4LandingCTA = () => {
    try {
      addResult("🎯 Tracking landing CTA click...")
      trackLandingCTAClick("hero_cta", "hero_section")
      addResult("✅ GA4 landing CTA event sent successfully")
    } catch (error) {
      addResult(`❌ Failed to send GA4 landing CTA event: ${error}`)
    }
  }

  const testGA4PricingView = () => {
    try {
      addResult("💰 Tracking pricing view...")
      trackPricingView("pro_plan")
      addResult("✅ GA4 pricing view event sent successfully")
    } catch (error) {
      addResult(`❌ Failed to send GA4 pricing view event: ${error}`)
    }
  }

  const testGA4Checkout = () => {
    try {
      addResult("🛒 Tracking checkout events...")
      trackCheckoutStarted("pro_plan", 49)
      trackCheckoutCompleted("pro_plan", 49, "txn_test_123")
      addResult("✅ GA4 checkout events sent successfully")
    } catch (error) {
      addResult(`❌ Failed to send GA4 checkout events: ${error}`)
    }
  }

  const testGA4GateHit = () => {
    try {
      addResult("🚪 Tracking gate hit...")
      trackGateHit("export_pdf", "user_123", "org_456")
      addResult("✅ GA4 gate hit event sent successfully")
    } catch (error) {
      addResult(`❌ Failed to send GA4 gate hit event: ${error}`)
    }
  }

  const testGA4FeatureUsage = () => {
    try {
      addResult("🔧 Tracking feature usage...")
      trackFeatureUsage("gpt_test", "user_123")
      addResult("✅ GA4 feature usage event sent successfully")
    } catch (error) {
      addResult(`❌ Failed to send GA4 feature usage event: ${error}`)
    }
  }

  const testGA4Error = () => {
    try {
      addResult("❌ Tracking error event...")
      trackError("test_error", "Test error for observability", "user_123")
      addResult("✅ GA4 error event sent successfully")
    } catch (error) {
      addResult(`❌ Failed to send GA4 error event: ${error}`)
    }
  }

  const testGA4Performance = () => {
    try {
      addResult("⚡ Tracking performance metric...")
      trackGA4Performance("page_load_time", 1200, "ms")
      addResult("✅ GA4 performance metric sent successfully")
    } catch (error) {
      addResult(`❌ Failed to send GA4 performance metric: ${error}`)
    }
  }

  const testKPIAlert = () => {
    try {
      addResult("🚨 Creating test KPI alert...")
      forceTestAlert("test_metric")
      addResult("✅ Test KPI alert created successfully")
      updateKPIStatus()
    } catch (error) {
      addResult(`❌ Failed to create test KPI alert: ${error}`)
    }
  }

  const updateKPIStatus = () => {
    try {
      const metrics = getKPIMetrics()
      const alerts = getActiveAlerts()
      setKpiMetrics(metrics)
      setActiveAlerts(alerts)
      addResult("📊 KPI status updated")
    } catch (error) {
      addResult(`❌ Failed to update KPI status: ${error}`)
    }
  }

  const runAllTests = () => {
    addResult("🚀 Running all observability tests...")
    
    // Sentry tests
    testSentryError()
    testSentryEvent()
    testSentryPerformance()
    
    // GA4 tests
    testGA4LandingCTA()
    testGA4PricingView()
    testGA4Checkout()
    testGA4GateHit()
    testGA4FeatureUsage()
    testGA4Error()
    testGA4Performance()
    
    // KPI tests
    testKPIAlert()
    
    addResult("🎉 All tests completed!")
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Observability Test Suite</h1>
        <p className="text-gray-600">
          Test Sentry error tracking, GA4 analytics, and KPI monitoring
        </p>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Test Controls
          </CardTitle>
          <CardDescription>
            Run individual tests or execute all at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={runAllTests} className="w-full">
              🚀 Run All Tests
            </Button>
            <Button onClick={updateKPIStatus} variant="outline" className="w-full">
              📊 Update KPI Status
            </Button>
            <Button onClick={clearResults} variant="outline" className="w-full">
              🗑️ Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentry Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Sentry Tests
            </CardTitle>
            <CardDescription>
              Error tracking and monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={testSentryError} variant="outline" className="w-full">
              🔴 Test Error
            </Button>
            <Button onClick={testSentryEvent} variant="outline" className="w-full">
              📝 Test Event
            </Button>
            <Button onClick={testSentryPerformance} variant="outline" className="w-full">
              ⚡ Test Performance
            </Button>
          </CardContent>
        </Card>

        {/* GA4 Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              GA4 Tests
            </CardTitle>
            <CardDescription>
              Analytics event tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={testGA4LandingCTA} variant="outline" className="w-full">
              🎯 Landing CTA
            </Button>
            <Button onClick={testGA4PricingView} variant="outline" className="w-full">
              💰 Pricing View
            </Button>
            <Button onClick={testGA4Checkout} variant="outline" className="w-full">
              🛒 Checkout
            </Button>
            <Button onClick={testGA4GateHit} variant="outline" className="w-full">
              🚪 Gate Hit
            </Button>
            <Button onClick={testGA4FeatureUsage} variant="outline" className="w-full">
              🔧 Feature Usage
            </Button>
            <Button onClick={testGA4Error} variant="outline" className="w-full">
              ❌ Error Event
            </Button>
            <Button onClick={testGA4Performance} variant="outline" className="w-full">
              ⚡ Performance
            </Button>
          </CardContent>
        </Card>

        {/* KPI Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              KPI Tests
            </CardTitle>
            <CardDescription>
              SLA monitoring and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={testKPIAlert} variant="outline" className="w-full">
              🚨 Test Alert
            </Button>
            <Button onClick={updateKPIStatus} variant="outline" className="w-full">
              📊 Update Status
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* KPI Status */}
      {kpiMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Current KPI Status
            </CardTitle>
            <CardDescription>
              Real-time SLA compliance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {kpiMetrics.pass_rate_pct.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Pass Rate</div>
                <Badge variant={kpiMetrics.pass_rate_pct >= SLA_THRESHOLDS.PASS_RATE ? 'default' : 'destructive'}>
                  Target: {SLA_THRESHOLDS.PASS_RATE}%
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {kpiMetrics.p95_tta_text}s
                </div>
                <div className="text-sm text-gray-600">Text TTA P95</div>
                <Badge variant={kpiMetrics.p95_tta_text <= SLA_THRESHOLDS.P95_TTA_TEXT ? 'default' : 'destructive'}>
                  Target: ≤{SLA_THRESHOLDS.P95_TTA_TEXT}s
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {kpiMetrics.p95_tta_sop}s
                </div>
                <div className="text-sm text-gray-600">SOP TTA P95</div>
                <Badge variant={kpiMetrics.p95_tta_sop <= SLA_THRESHOLDS.P95_TTA_SOP ? 'default' : 'destructive'}>
                  Target: ≤{SLA_THRESHOLDS.P95_TTA_SOP}s
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {kpiMetrics.p95_score}
                </div>
                <div className="text-sm text-gray-600">Score P95</div>
                <Badge variant={kpiMetrics.p95_score >= SLA_THRESHOLDS.P95_SCORE ? 'default' : 'destructive'}>
                  Target: ≥{SLA_THRESHOLDS.P95_SCORE}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Bell className="w-5 h-5" />
              Active Alerts ({activeAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-white rounded border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{alert.title}</div>
                      <div className="text-sm text-gray-600">{alert.message}</div>
                      <div className="text-xs text-gray-500">
                        {alert.timestamp.toLocaleString()} • {alert.metric}
                      </div>
                    </div>
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Test Results
          </CardTitle>
          <CardDescription>
            Real-time test execution logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tests run yet. Click "Run All Tests" to start.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {result}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>
            Testing instructions and verification steps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Sentry Verification</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check Sentry dashboard for test errors</li>
                <li>• Verify error context and stack traces</li>
                <li>• Check performance metrics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">GA4 Verification</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check GA4 real-time events</li>
                <li>• Verify event parameters</li>
                <li>• Check user properties</li>
              </ul>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">KPI Monitoring</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Monitor SLA compliance in real-time</li>
              <li>• Check alert generation and acknowledgment</li>
              <li>• Verify metric calculations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

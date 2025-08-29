"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  forceTestError, 
  captureException, 
  captureMessage,
  trackSentryEvent, 
  trackPerformanceMetric,
  setUserContext,
  setOrganizationContext
} from "@/lib/sentry"

export default function SentryTestPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [userId, setUserId] = useState("")
  const [orgId, setOrgId] = useState("")

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testForceError = () => {
    try {
      addResult("🔴 Testing forceTestError...")
      forceTestError("Test error from Sentry test page")
      addResult("✅ forceTestError executed successfully")
    } catch (error) {
      addResult(`❌ forceTestError failed: ${error}`)
    }
  }

  const testCaptureException = () => {
    try {
      addResult("🚨 Testing captureException...")
      const testError = new Error("Test exception for Sentry")
      testError.stack = "Test stack trace\nat testFunction\nat testPage"
      captureException(testError, {
        component: "SentryTestPage",
        testType: "manual_exception",
        timestamp: Date.now()
      })
      addResult("✅ captureException executed successfully")
    } catch (error) {
      addResult(`❌ captureException failed: ${error}`)
    }
  }

  const testCaptureMessage = () => {
    try {
      addResult("📝 Testing captureMessage...")
      captureMessage("Test message from Sentry test page", "info", {
        component: "SentryTestPage",
        testType: "manual_message",
        timestamp: Date.now()
      })
      addResult("✅ captureMessage executed successfully")
    } catch (error) {
      addResult(`❌ captureMessage failed: ${error}`)
    }
  }

  const testTrackEvent = () => {
    try {
      addResult("🎯 Testing trackSentryEvent...")
      trackSentryEvent("test_event", {
        component: "SentryTestPage",
        testType: "manual_event",
        timestamp: Date.now()
      })
      addResult("✅ trackSentryEvent executed successfully")
    } catch (error) {
      addResult(`❌ trackSentryEvent failed: ${error}`)
    }
  }

  const testPerformanceMetric = () => {
    try {
      addResult("⚡ Testing trackPerformanceMetric...")
      trackPerformanceMetric("test_metric", 100, { test: "manual_performance" })
      addResult("✅ trackPerformanceMetric executed successfully")
    } catch (error) {
      addResult(`❌ trackPerformanceMetric failed: ${error}`)
    }
  }

  const testSetUserContext = () => {
    try {
      addResult("👤 Testing setUserContext...")
      if (userId) {
        setUserContext(userId, orgId || undefined)
        addResult(`✅ User context set: ${userId}${orgId ? ` (org: ${orgId})` : ''}`)
      } else {
        addResult("⚠️ Please enter a user ID first")
      }
    } catch (error) {
      addResult(`❌ setUserContext failed: ${error}`)
    }
  }

  const testSetOrganizationContext = () => {
    try {
      addResult("🏢 Testing setOrganizationContext...")
      if (orgId) {
        setOrganizationContext(orgId, "Test Organization")
        addResult(`✅ Organization context set: ${orgId}`)
      } else {
        addResult("⚠️ Please enter an organization ID first")
      }
    } catch (error) {
      addResult(`❌ setOrganizationContext failed: ${error}`)
    }
  }

  const testAllFunctions = () => {
    addResult("🚀 Running all Sentry tests...")
    testForceError()
    testCaptureException()
    testCaptureMessage()
    testTrackEvent()
    testPerformanceMetric()
    addResult("🎉 All tests completed!")
  }

  const clearResults = () => {
    setTestResults([])
  }

  const throwUnhandledError = () => {
    addResult("💥 Throwing unhandled error...")
    // This will trigger the error boundary
    throw new Error("Unhandled error for testing error boundary")
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Sentry Error Tracking Test</h1>
        <p className="text-gray-600">
          Test Sentry error tracking, performance monitoring, and user context
        </p>
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
          <CardDescription>
            Check if Sentry is properly configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Sentry DSN</span>
              <Badge variant={process.env.NEXT_PUBLIC_SENTRY_DSN ? 'default' : 'destructive'}>
                {process.env.NEXT_PUBLIC_SENTRY_DSN ? 'Configured' : 'Not Configured'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Environment</span>
              <Badge variant="secondary">
                {process.env.NODE_ENV || 'unknown'}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              {!process.env.NEXT_PUBLIC_SENTRY_DSN && (
                <p>⚠️ Set NEXT_PUBLIC_SENTRY_DSN in your environment variables to enable Sentry</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Context Setup */}
      <Card>
        <CardHeader>
          <CardTitle>User Context Setup</CardTitle>
          <CardDescription>
            Set user and organization context for error tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
                className="w-full p-2 border rounded bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Organization ID</label>
              <input
                type="text"
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                placeholder="Enter organization ID (optional)"
                className="w-full p-2 border rounded bg-white text-black"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={testSetUserContext} variant="outline">
              Set User Context
            </Button>
            <Button onClick={testSetOrganizationContext} variant="outline">
              Set Organization Context
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>
            Run individual tests or execute all at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={testAllFunctions} className="w-full">
              🚀 Run All Tests
            </Button>
            <Button onClick={throwUnhandledError} variant="destructive" className="w-full">
              💥 Test Error Boundary
            </Button>
            <Button onClick={clearResults} variant="outline" className="w-full">
              🗑️ Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Test Functions */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Test Functions</CardTitle>
          <CardDescription>
            Test specific Sentry functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button onClick={testForceError} variant="outline" className="w-full">
              🔴 Force Test Error
            </Button>
            <Button onClick={testCaptureException} variant="outline" className="w-full">
              🚨 Capture Exception
            </Button>
            <Button onClick={testCaptureMessage} variant="outline" className="w-full">
              📝 Capture Message
            </Button>
            <Button onClick={testTrackEvent} variant="outline" className="w-full">
              🎯 Track Event
            </Button>
            <Button onClick={testPerformanceMetric} variant="outline" className="w-full">
              ⚡ Performance Metric
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
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
          <CardTitle>How to Verify</CardTitle>
          <CardDescription>
            Steps to verify Sentry is working correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Sentry Dashboard Verification</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check your Sentry dashboard for test errors and events</li>
              <li>• Verify error context and stack traces are captured</li>
              <li>• Check that user and organization context is attached</li>
              <li>• Verify performance metrics are being tracked</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Error Boundary Test</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click "Test Error Boundary" to trigger an unhandled error</li>
              <li>• Verify the error boundary catches and displays the error</li>
              <li>• Check Sentry dashboard for the captured error</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

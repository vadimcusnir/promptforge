"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, Clock, Users, Globe } from "lucide-react"

// Mock gate status
const mockGateStatus = {
  isEnabled: false,
  lastToggled: "2024-01-10T08:30:00Z",
  toggledBy: "admin@promptforge.com",
  reason: "Scheduled maintenance completed",
  affectedUsers: 0,
  bypassUsers: ["admin@promptforge.com", "support@promptforge.com"],
  customMessage:
    "We are currently performing scheduled maintenance to improve your experience. Please check back soon!",
  estimatedDuration: null,
  scheduledEnd: null,
}

const mockGateHistory = [
  {
    id: "gate_1234567890",
    action: "disabled",
    timestamp: "2024-01-10T08:30:00Z",
    user: "admin@promptforge.com",
    reason: "Scheduled maintenance completed",
    duration: "2 hours 15 minutes",
  },
  {
    id: "gate_0987654321",
    action: "enabled",
    timestamp: "2024-01-10T06:15:00Z",
    user: "admin@promptforge.com",
    reason: "Scheduled maintenance - database migration",
    duration: null,
  },
  {
    id: "gate_1122334455",
    action: "disabled",
    timestamp: "2024-01-08T14:20:00Z",
    user: "system@promptforge.com",
    reason: "Emergency maintenance completed",
    duration: "45 minutes",
  },
]

export default function AdminGate() {
  const [gateStatus, setGateStatus] = useState(mockGateStatus)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingToggle, setPendingToggle] = useState(false)
  const [toggleReason, setToggleReason] = useState("")
  const [customMessage, setCustomMessage] = useState(gateStatus.customMessage)
  const [estimatedDuration, setEstimatedDuration] = useState("")
  const [bypassEmails, setBypassEmails] = useState(gateStatus.bypassUsers.join(", "))

  const handleToggleGate = () => {
    if (!toggleReason.trim()) {
      alert("Please provide a reason for toggling the gate")
      return
    }

    setShowConfirmModal(true)
    setPendingToggle(!gateStatus.isEnabled)
  }

  const confirmToggle = () => {
    const newStatus = {
      ...gateStatus,
      isEnabled: pendingToggle,
      lastToggled: new Date().toISOString(),
      toggledBy: "admin@promptforge.com", // In real app, get from session
      reason: toggleReason,
      customMessage: customMessage,
      bypassUsers: bypassEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email),
    }

    setGateStatus(newStatus)
    setShowConfirmModal(false)
    setToggleReason("")

    // In real implementation, this would make an API call to update the gate status
    console.log("Gate toggled:", newStatus)
  }

  const getStatusBadge = (enabled: boolean) => {
    return enabled ? (
      <Badge className="bg-red-900 text-red-300">
        <AlertTriangle className="h-3 w-3 mr-1" />
        MAINTENANCE MODE
      </Badge>
    ) : (
      <Badge className="bg-green-900 text-green-300">
        <CheckCircle className="h-3 w-3 mr-1" />
        OPERATIONAL
      </Badge>
    )
  }

  const getActionBadge = (action: string) => {
    return action === "enabled" ? (
      <Badge className="bg-red-900 text-red-300">Enabled</Badge>
    ) : (
      <Badge className="bg-green-900 text-green-300">Disabled</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#CDA434] mb-2">Site Gate Control</h1>
        <p className="text-gray-400">Manage site-wide maintenance mode and access control</p>
      </div>

      {/* Current Status */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#CDA434] flex items-center">
              {gateStatus.isEnabled ? (
                <ToggleRight className="h-6 w-6 mr-2 text-red-400" />
              ) : (
                <ToggleLeft className="h-6 w-6 mr-2 text-green-400" />
              )}
              Coming Soon Gate
            </CardTitle>
            {getStatusBadge(gateStatus.isEnabled)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <p className="font-bold text-white">{gateStatus.isEnabled ? "Maintenance Mode" : "Operational"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Last Toggled</p>
              <p className="text-white">{new Date(gateStatus.lastToggled).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Toggled By</p>
              <p className="text-white">{gateStatus.toggledBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Affected Users</p>
              <p className="text-white">{gateStatus.affectedUsers.toLocaleString()}</p>
            </div>
          </div>

          {gateStatus.isEnabled && (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <h3 className="font-medium text-red-300">Site is in Maintenance Mode</h3>
              </div>
              <p className="text-red-200 mb-2">Reason: {gateStatus.reason}</p>
              <p className="text-red-200">Message: {gateStatus.customMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gate Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434]">Gate Configuration</CardTitle>
            <CardDescription className="text-gray-400">Configure maintenance mode settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reason" className="text-gray-300">
                Reason for Toggle
              </Label>
              <Input
                id="reason"
                placeholder="Enter reason for maintenance mode..."
                value={toggleReason}
                onChange={(e) => setToggleReason(e.target.value)}
                className="bg-gray-800 border-gray-700 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-gray-300">
                Custom Message
              </Label>
              <Textarea
                id="message"
                placeholder="Message to display to users..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="bg-gray-800 border-gray-700 mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="duration" className="text-gray-300">
                Estimated Duration
              </Label>
              <Input
                id="duration"
                placeholder="e.g., 2 hours, 30 minutes"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="bg-gray-800 border-gray-700 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bypass" className="text-gray-300">
                Bypass Users (emails)
              </Label>
              <Textarea
                id="bypass"
                placeholder="admin@example.com, support@example.com"
                value={bypassEmails}
                onChange={(e) => setBypassEmails(e.target.value)}
                className="bg-gray-800 border-gray-700 mt-1"
                rows={2}
              />
              <p className="text-xs text-gray-400 mt-1">
                Comma-separated list of emails that can bypass maintenance mode
              </p>
            </div>

            <Button
              onClick={handleToggleGate}
              className={`w-full ${
                gateStatus.isEnabled
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {gateStatus.isEnabled ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Disable Maintenance Mode
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Enable Maintenance Mode
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434]">Impact Summary</CardTitle>
            <CardDescription className="text-gray-400">Current system status and user impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <Users className="h-8 w-8 text-[#CDA434] mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">1,247</p>
                <p className="text-sm text-gray-400">Active Users</p>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <Globe className="h-8 w-8 text-[#CDA434] mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">99.97%</p>
                <p className="text-sm text-gray-400">Uptime</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-white">Bypass Users</h4>
              <div className="space-y-2">
                {gateStatus.bypassUsers.map((email, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                    <span className="text-gray-300">{email}</span>
                    <Badge className="bg-green-900 text-green-300">Bypass</Badge>
                  </div>
                ))}
              </div>
            </div>

            {gateStatus.isEnabled && (
              <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-300 text-sm">
                    Maintenance mode is active - all non-bypass users are redirected
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gate History */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-[#CDA434]">Gate History</CardTitle>
          <CardDescription className="text-gray-400">
            Recent maintenance mode toggles and their duration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockGateHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getActionBadge(entry.action)}
                    <span className="text-white">Maintenance mode {entry.action}</span>
                  </div>
                  <p className="text-gray-400 mb-1">Reason: {entry.reason}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>By: {entry.user}</span>
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    {entry.duration && <span>Duration: {entry.duration}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-[#CDA434] flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Confirm Gate Toggle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  You are about to {pendingToggle ? "enable" : "disable"} maintenance mode.
                  {pendingToggle && " This will redirect all users (except bypass users) to the coming soon page."}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-300">
                  <strong>Reason:</strong> {toggleReason}
                </p>
                <p className="text-gray-300">
                  <strong>Custom Message:</strong> {customMessage}
                </p>
                {estimatedDuration && (
                  <p className="text-gray-300">
                    <strong>Estimated Duration:</strong> {estimatedDuration}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmToggle}
                  className={pendingToggle ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {pendingToggle ? "Enable Maintenance" : "Disable Maintenance"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

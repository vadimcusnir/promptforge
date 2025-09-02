"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
} from "lucide-react"

// Mock API keys data
const mockApiKeys = [
  {
    id: "key_1234567890",
    name: "Production API Key",
    keyPreview: "pk_live_1234...5678",
    fullKey: "pk_live_1234567890abcdef1234567890abcdef12345678",
    status: "active",
    createdAt: "2024-01-01T10:30:00Z",
    lastUsed: "2024-01-15T14:20:00Z",
    rateLimit: 1000,
    requestsToday: 847,
    requestsThisHour: 45,
    environment: "production",
    scopes: ["read", "write", "admin"],
    expiresAt: "2024-12-31T23:59:59Z",
    createdBy: "admin@promptforge.com",
  },
  {
    id: "key_0987654321",
    name: "Development API Key",
    keyPreview: "pk_test_0987...4321",
    fullKey: "pk_test_0987654321fedcba0987654321fedcba09876543",
    status: "active",
    createdAt: "2023-12-15T09:15:00Z",
    lastUsed: "2024-01-14T16:45:00Z",
    rateLimit: 100,
    requestsToday: 23,
    requestsThisHour: 2,
    environment: "development",
    scopes: ["read", "write"],
    expiresAt: null,
    createdBy: "developer@promptforge.com",
  },
  {
    id: "key_1122334455",
    name: "Staging API Key",
    keyPreview: "pk_test_1122...4455",
    fullKey: "pk_test_1122334455aabbcc1122334455aabbcc11223344",
    status: "revoked",
    createdAt: "2023-11-20T11:00:00Z",
    lastUsed: "2024-01-10T08:30:00Z",
    rateLimit: 500,
    requestsToday: 0,
    requestsThisHour: 0,
    environment: "staging",
    scopes: ["read"],
    expiresAt: "2024-06-30T23:59:59Z",
    createdBy: "admin@promptforge.com",
  },
]

const availableScopes = [
  { id: "read", name: "Read", description: "Read access to resources" },
  { id: "write", name: "Write", description: "Create and update resources" },
  { id: "delete", name: "Delete", description: "Delete resources" },
  { id: "admin", name: "Admin", description: "Full administrative access" },
]

export default function AdminApiKeys() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyEnvironment, setNewKeyEnvironment] = useState("development")
  const [newKeyRateLimit, setNewKeyRateLimit] = useState("100")
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(["read"])
  const [newKeyExpiry, setNewKeyExpiry] = useState("")
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [createdKey, setCreatedKey] = useState<{ key: string; id: string } | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [operationInProgress, setOperationInProgress] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("[v0] Admin API keys view tracked", { keyCount: apiKeys.length, searchTerm })
    }
  }, [apiKeys.length, searchTerm])

  // Simulate real-time last_used_at updates
  useEffect(() => {
    const interval = setInterval(() => {
      setApiKeys((prevKeys) =>
        prevKeys.map((key) => {
          if (key.status === "active" && Math.random() < 0.1) {
            // 10% chance to update
            return {
              ...key,
              lastUsed: new Date().toISOString(),
              requestsThisHour: key.requestsThisHour + Math.floor(Math.random() * 5),
              requestsToday: key.requestsToday + Math.floor(Math.random() * 5),
            }
          }
          return key
        }),
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const filteredKeys = apiKeys.filter(
    (key) =>
      key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.keyPreview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.environment.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-900 text-green-300",
      revoked: "bg-red-900 text-red-300",
      expired: "bg-yellow-900 text-yellow-300",
    }
    return variants[status as keyof typeof variants] || variants.active
  }

  const getEnvironmentBadge = (environment: string) => {
    const variants = {
      production: "bg-red-900 text-red-300",
      staging: "bg-yellow-900 text-yellow-300",
      development: "bg-blue-900 text-blue-300",
    }
    return variants[environment as keyof typeof variants] || variants.development
  }

  const generateApiKey = (environment: string): string => {
    const prefix = environment === "production" ? "pk_live" : "pk_test"
    const randomString = Array.from({ length: 40 }, () => Math.random().toString(36).charAt(2)).join("")
    return `${prefix}_${randomString}`
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      alert("Please enter a key name")
      return
    }

    if (newKeyScopes.length === 0) {
      alert("Please select at least one scope")
      return
    }

    setIsCreating(true)
    try {
      // Validate expiry date
      let expiresAt = null
      if (newKeyExpiry) {
        const expiryDate = new Date(newKeyExpiry)
        if (expiryDate <= new Date()) {
          alert("Expiry date must be in the future")
          return
        }
        expiresAt = expiryDate.toISOString()
      }

      // Generate secure API key
      const fullKey = generateApiKey(newKeyEnvironment)
      const keyPreview = `${fullKey.substring(0, 12)}...${fullKey.substring(fullKey.length - 4)}`

      const newKey = {
        id: `key_${Date.now()}`,
        name: newKeyName.trim(),
        keyPreview,
        fullKey,
        status: "active" as const,
        createdAt: new Date().toISOString(),
        lastUsed: null,
        rateLimit: Number.parseInt(newKeyRateLimit),
        requestsToday: 0,
        requestsThisHour: 0,
        environment: newKeyEnvironment,
        scopes: [...newKeyScopes],
        expiresAt,
        createdBy: "current-admin@promptforge.com", // In real app, get from session
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setApiKeys([newKey, ...apiKeys])
      setCreatedKey({ key: newKey.fullKey, id: newKey.id })

      // Log admin action
      console.log("[v0] API key created", {
        keyId: newKey.id,
        keyName: newKey.name,
        environment: newKey.environment,
        scopes: newKey.scopes,
        rateLimit: newKey.rateLimit,
        expiresAt: newKey.expiresAt,
        createdBy: "current-admin",
        timestamp: new Date().toISOString(),
      })

      // Reset form
      setNewKeyName("")
      setNewKeyEnvironment("development")
      setNewKeyRateLimit("100")
      setNewKeyScopes(["read"])
      setNewKeyExpiry("")
      setShowCreateModal(false)
    } catch (error) {
      console.error("[v0] Failed to create API key", error)
      alert("Failed to create API key. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyKey = async (key: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(keyId)
      setTimeout(() => setCopiedKey(null), 2000)

      console.log("[v0] API key copied", { keyId, timestamp: new Date().toISOString() })
    } catch (err) {
      console.error("Failed to copy key:", err)
      alert("Failed to copy key to clipboard")
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys)
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId)
    } else {
      newVisibleKeys.add(keyId)
    }
    setVisibleKeys(newVisibleKeys)

    console.log("[v0] API key visibility toggled", {
      keyId,
      visible: newVisibleKeys.has(keyId),
      timestamp: new Date().toISOString(),
    })
  }

  const handleRevokeKey = async (keyId: string) => {
    const key = apiKeys.find((k) => k.id === keyId)
    if (!key) return

    const confirmed = window.confirm(
      `Are you sure you want to revoke "${key.name}"? This action cannot be undone and will immediately disable the key.`,
    )
    if (!confirmed) return

    setOperationInProgress(keyId)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setApiKeys(apiKeys.map((k) => (k.id === keyId ? { ...k, status: "revoked" as const } : k)))

      // Log admin action
      console.log("[v0] API key revoked", {
        keyId,
        keyName: key.name,
        environment: key.environment,
        revokedBy: "current-admin",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Failed to revoke API key", error)
      alert("Failed to revoke API key. Please try again.")
    } finally {
      setOperationInProgress(null)
    }
  }

  const handleRotateKey = async (keyId: string) => {
    const key = apiKeys.find((k) => k.id === keyId)
    if (!key) return

    const confirmed = window.confirm(
      `Are you sure you want to rotate "${key.name}"? The old key will be immediately invalidated.`,
    )
    if (!confirmed) return

    setOperationInProgress(keyId)
    try {
      // Generate new key
      const newFullKey = generateApiKey(key.environment)
      const newPreview = `${newFullKey.substring(0, 12)}...${newFullKey.substring(newFullKey.length - 4)}`

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setApiKeys(
        apiKeys.map((k) =>
          k.id === keyId
            ? {
                ...k,
                fullKey: newFullKey,
                keyPreview: newPreview,
                createdAt: new Date().toISOString(),
                lastUsed: null,
                requestsToday: 0,
                requestsThisHour: 0,
              }
            : k,
        ),
      )

      setCreatedKey({ key: newFullKey, id: keyId })

      // Log admin action
      console.log("[v0] API key rotated", {
        keyId,
        keyName: key.name,
        environment: key.environment,
        rotatedBy: "current-admin",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Failed to rotate API key", error)
      alert("Failed to rotate API key. Please try again.")
    } finally {
      setOperationInProgress(null)
    }
  }

  const getRateLimitStatus = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    if (percentage >= 90) return "text-red-400"
    if (percentage >= 70) return "text-yellow-400"
    return "text-green-400"
  }

  const isKeyExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) <= new Date()
  }

  const isKeyExpiringSoon = (expiresAt: string | null) => {
    if (!expiresAt) return false
    const expiryDate = new Date(expiresAt)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  const handleScopeToggle = (scope: string, checked: boolean) => {
    if (checked) {
      setNewKeyScopes([...newKeyScopes, scope])
    } else {
      setNewKeyScopes(newKeyScopes.filter((s) => s !== scope))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#CDA434] mb-2">API Keys</h1>
          <p className="text-gray-400">Manage API keys for programmatic access to PromptForge</p>
        </div>
        <Button
          className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 mt-4 sm:mt-0 focus:ring-2 focus:ring-[#00FF7F]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search API keys..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]"
        />
      </div>

      {createdKey && (
        <Card className="bg-green-900/20 border-green-800">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              API Key {createdKey.id.startsWith("key_") ? "Created" : "Rotated"} Successfully
            </CardTitle>
            <CardDescription className="text-green-300">
              Make sure to copy your API key now. You won't be able to see it again!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg font-mono text-sm">
              <code className="flex-1 text-green-400 break-all">{createdKey.key}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyKey(createdKey.key, "created")}
                className="text-green-400 hover:text-green-300 focus:ring-2 focus:ring-[#00FF7F]"
              >
                {copiedKey === "created" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCreatedKey(null)}
              className="mt-2 text-green-400 hover:text-green-300 focus:ring-2 focus:ring-[#00FF7F]"
            >
              I've saved this key
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-[#CDA434] flex items-center">
            <Key className="h-5 w-5 mr-2" />
            API Keys ({filteredKeys.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredKeys.map((apiKey) => {
              const expired = isKeyExpired(apiKey.expiresAt)
              const expiringSoon = isKeyExpiringSoon(apiKey.expiresAt)

              return (
                <div key={apiKey.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  {(expired || expiringSoon) && (
                    <Alert
                      className={`mb-4 ${expired ? "border-red-600 bg-red-900/20" : "border-yellow-600 bg-yellow-900/20"}`}
                    >
                      <AlertTriangle className={`h-4 w-4 ${expired ? "text-red-400" : "text-yellow-400"}`} />
                      <AlertDescription className={expired ? "text-red-300" : "text-yellow-300"}>
                        {expired
                          ? "This API key has expired and is no longer functional."
                          : `This API key expires on ${new Date(apiKey.expiresAt!).toLocaleDateString()}.`}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-white">{apiKey.name}</h3>
                        <Badge className={getStatusBadge(expired ? "expired" : apiKey.status)}>
                          {expired ? "expired" : apiKey.status}
                        </Badge>
                        <Badge className={getEnvironmentBadge(apiKey.environment)}>{apiKey.environment}</Badge>
                        {apiKey.scopes.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Shield className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{apiKey.scopes.join(", ")}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="text-sm font-mono text-gray-300 bg-gray-700 px-2 py-1 rounded break-all">
                          {visibleKeys.has(apiKey.id) ? apiKey.fullKey : apiKey.keyPreview}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F]"
                        >
                          {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyKey(apiKey.fullKey, apiKey.id)}
                          className="text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F]"
                        >
                          {copiedKey === apiKey.id ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Created {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                        {apiKey.lastUsed && (
                          <span className="flex items-center">
                            <Activity className="h-3 w-3 mr-1" />
                            Last used {new Date(apiKey.lastUsed).toLocaleString()}
                          </span>
                        )}
                        {apiKey.expiresAt && !expired && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Expires {new Date(apiKey.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                        <span>by {apiKey.createdBy}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {apiKey.status === "active" && !expired && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRotateKey(apiKey.id)}
                            disabled={operationInProgress === apiKey.id}
                            className="text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F]"
                          >
                            <RotateCcw
                              className={`h-4 w-4 ${operationInProgress === apiKey.id ? "animate-spin" : ""}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeKey(apiKey.id)}
                            disabled={operationInProgress === apiKey.id}
                            className="text-gray-400 hover:text-red-400 focus:ring-2 focus:ring-[#00FF7F]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-xs text-gray-400">Rate Limit</p>
                      <p className="text-sm font-medium text-white">{apiKey.rateLimit.toLocaleString()} req/hour</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">This Hour</p>
                      <p
                        className={`text-sm font-medium ${getRateLimitStatus(apiKey.requestsThisHour, apiKey.rateLimit)}`}
                      >
                        {apiKey.requestsThisHour.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Today</p>
                      <p
                        className={`text-sm font-medium ${getRateLimitStatus(apiKey.requestsToday, apiKey.rateLimit * 24)}`}
                      >
                        {apiKey.requestsToday.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Hourly Usage</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-[#CDA434] h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((apiKey.requestsThisHour / apiKey.rateLimit) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {Math.round((apiKey.requestsThisHour / apiKey.rateLimit) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-[#CDA434]">Create API Key</CardTitle>
              <CardDescription className="text-gray-400">
                Generate a new API key for programmatic access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="keyName" className="text-gray-300">
                  Key Name *
                </Label>
                <Input
                  id="keyName"
                  placeholder="Enter a descriptive name..."
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-[#00FF7F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="environment" className="text-gray-300">
                    Environment
                  </Label>
                  <Select value={newKeyEnvironment} onValueChange={setNewKeyEnvironment}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-[#00FF7F]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="rateLimit" className="text-gray-300">
                    Rate Limit (req/hour)
                  </Label>
                  <Select value={newKeyRateLimit} onValueChange={setNewKeyRateLimit}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-[#00FF7F]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="500">500</SelectItem>
                      <SelectItem value="1000">1,000</SelectItem>
                      <SelectItem value="5000">5,000</SelectItem>
                      <SelectItem value="10000">10,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Scopes *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {availableScopes.map((scope) => (
                    <div key={scope.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={scope.id}
                        checked={newKeyScopes.includes(scope.id)}
                        onCheckedChange={(checked) => handleScopeToggle(scope.id, checked as boolean)}
                        className="focus:ring-2 focus:ring-[#00FF7F]"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor={scope.id} className="text-sm font-medium text-white cursor-pointer">
                          {scope.name}
                        </label>
                        <p className="text-xs text-gray-400">{scope.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="expiry" className="text-gray-300">
                  Expiry Date (optional)
                </Label>
                <Input
                  id="expiry"
                  type="date"
                  value={newKeyExpiry}
                  onChange={(e) => setNewKeyExpiry(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-[#00FF7F]"
                />
                <p className="text-xs text-gray-400 mt-1">Leave empty for keys that never expire</p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-[#00FF7F]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKey}
                  className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 focus:ring-2 focus:ring-[#00FF7F]"
                  disabled={!newKeyName.trim() || newKeyScopes.length === 0 || isCreating}
                >
                  <Key className="h-4 w-4 mr-2" />
                  {isCreating ? "Creating..." : "Create Key"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, AlertCircle, Loader2, CheckCircle } from "lucide-react"

export default function ComingSoonPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Please enter your name"
    }
    if (!formData.email.trim()) {
      return "Please enter your email"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        window.location.href = "/thankyou"
      } else {
        const data = await response.json()
        setError(data.error || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Fixed two-layer background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:20px_20px]" />
      <div className="fixed inset-0 bg-gradient-to-br from-[#0e0e0e] via-[#1a1a1a] to-[#0e0e0e]" />

      {/* Animated grid elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-500/30 rounded-full " />
        <div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400/40 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-yellow-300/30 rounded-full "
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-yellow-500/40 rounded-full animate-ping"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Card className="bg-black/40 backdrop-blur-sm border-gray-800/50 shadow-md border border-yellow-500/20">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-3xl font-bold text-white font-serif">
                We&apos;re forging something powerful.
              </CardTitle>
              <p className="text-gray-400 font-sans">Join the waitlist to be among the first</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 font-sans">
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20"
                      placeholder="Enter your name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 font-sans">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20"
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !formData.name.trim() || !formData.email.trim()}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold py-2.5 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining Waitlist...
                    </>
                  ) : (
                    "Join the Waitlist"
                  )}
                </Button>
              </form>

              {/* Proof Bar */}
              <div className="pt-6 border-t border-gray-800/50">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    TTA &lt; 60s
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Score ≥ 80
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Export .md/.json/.pdf
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

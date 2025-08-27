"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Building, ArrowRight, CheckCircle } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"

interface EnterpriseContactFormProps {
  preselectedPlan?: string
  onSuccess?: () => void
}

export default function EnterpriseContactForm({ preselectedPlan, onSuccess }: EnterpriseContactFormProps) {
  const [formData, setFormData] = useState({
    company: "",
    email: "",
    message: preselectedPlan === "enterprise" ? "Interested in Enterprise plan with custom pricing and features." : ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const analytics = useAnalytics()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Track enterprise contact form submission
      analytics.enterpriseContact({
        company: formData.company,
        email: formData.email,
        plan: preselectedPlan || "enterprise"
      })

      // Send to API endpoint
      const response = await fetch("/api/enterprise-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          plan: preselectedPlan || "enterprise",
          source: "pricing_page"
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        onSuccess?.()
        
        // Track successful submission
        analytics.enterpriseContactSuccess({
          company: formData.company,
          plan: preselectedPlan || "enterprise"
        })
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      console.error("Enterprise contact error:", error)
      
      // Track error
      analytics.enterpriseContactError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <Card className="glass-card max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Thank You!</h3>
          <p className="text-gray-400 mb-4">
            We've received your enterprise inquiry and will contact you within 24 hours.
          </p>
          <Badge className="bg-yellow-600 text-black">
            Enterprise Team Contacting You
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-yellow-500" />
        </div>
        <CardTitle className="text-2xl font-serif">Enterprise Inquiry</CardTitle>
        <CardDescription className="text-gray-400">
          Get custom pricing and features for your organization
        </CardDescription>
        {preselectedPlan && (
          <Badge className="bg-yellow-600 text-black mx-auto">
            {preselectedPlan === "enterprise" ? "Enterprise Plan" : "Custom Plan"}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name - Field 1 */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium text-gray-300">
              Company Name *
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="Your company name"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              required
              className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-400"
            />
          </div>

          {/* Email - Field 2 */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-300">
              Work Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@company.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-400"
            />
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-gray-300">
              Additional Details (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us about your needs, team size, or specific requirements..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={3}
              className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-400 resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Send Enterprise Inquiry
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            We'll respond within 24 hours with custom pricing and features
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

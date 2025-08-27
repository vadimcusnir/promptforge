"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { Building2, Users, Target, ArrowRight, CheckCircle } from "lucide-react"

interface LeadCaptureProps {
  variant?: 'enterprise' | 'consulting' | 'general'
  title?: string
  subtitle?: string
  showCompanyFields?: boolean
  showConsultingFields?: boolean
}

export default function LeadCapture({
  variant = 'general',
  title = "Get Early Access",
  subtitle = "Join the future of industrial prompt engineering",
  showCompanyFields = false,
  showConsultingFields = false
}: LeadCaptureProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    companySize: '',
    industry: '',
    useCase: '',
    budget: '',
    timeline: '',
    teamSize: '',
    challenges: '',
    newsletter: true,
    consulting: false,
    demo: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()
  const analytics = useAnalytics()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Track lead capture event
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "lead_captured", {
          variant,
          company: formData.company,
          industry: formData.industry,
          company_size: formData.companySize,
          consulting_interest: formData.consulting
        })
      }

      // Submit to CRM (replace with actual API endpoint)
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSubmitted(true)
        toast({
          title: "Thank you!",
          description: "We'll be in touch within 24 hours.",
        })
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="glass-card border-green-600/30">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-zinc-400 mb-6">
            We've received your information and will contact you within 24 hours.
          </p>
          <div className="space-y-2 text-sm text-zinc-500">
            <p>✅ Added to our launch list</p>
            <p>✅ Priority access to new features</p>
            <p>✅ Exclusive early adopter benefits</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          {variant === 'enterprise' && <Building2 className="w-6 h-6 text-yellow-500" />}
          {variant === 'consulting' && <Target className="w-6 h-6 text-blue-500" />}
          {variant === 'general' && <Users className="w-6 h-6 text-green-500" />}
          <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
            {variant === 'enterprise' ? 'Enterprise' : variant === 'consulting' ? 'Consulting' : 'Early Access'}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-serif text-white">{title}</CardTitle>
        <p className="text-zinc-400">{subtitle}</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="bg-zinc-900 border-zinc-700 text-white"
            />
          </div>

          {/* Company Information */}
          {showCompanyFields && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Consulting Fields */}
          {showConsultingFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="useCase">Primary Use Case *</Label>
                <Textarea
                  id="useCase"
                  value={formData.useCase}
                  onChange={(e) => handleInputChange('useCase', e.target.value)}
                  required
                  placeholder="Describe your prompt engineering needs and challenges..."
                  className="bg-zinc-900 border-zinc-700 text-white min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5k-25k">$5K - $25K</SelectItem>
                      <SelectItem value="25k-100k">$25K - $100K</SelectItem>
                      <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                      <SelectItem value="500k+">$500K+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (0-3 months)</SelectItem>
                      <SelectItem value="short">Short term (3-6 months)</SelectItem>
                      <SelectItem value="medium">Medium term (6-12 months)</SelectItem>
                      <SelectItem value="long">Long term (12+ months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Current Challenges</Label>
                <Textarea
                  id="challenges"
                  value={formData.challenges}
                  onChange={(e) => handleInputChange('challenges', e.target.value)}
                  placeholder="What are your biggest challenges with prompt engineering?"
                  className="bg-zinc-900 border-zinc-700 text-white min-h-[80px]"
                />
              </div>
            </>
          )}

          {/* Preferences */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={formData.newsletter}
                onCheckedChange={(checked) => handleInputChange('newsletter', checked as boolean)}
              />
              <Label htmlFor="newsletter" className="text-sm text-zinc-400">
                Subscribe to our newsletter for updates and insights
              </Label>
            </div>

            {variant === 'consulting' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consulting"
                  checked={formData.consulting}
                  onCheckedChange={(checked) => handleInputChange('consulting', checked as boolean)}
                />
                <Label htmlFor="consulting" className="text-sm text-zinc-400">
                  Interested in enterprise consulting services
                </Label>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="demo"
                checked={formData.demo}
                onCheckedChange={(checked) => handleInputChange('demo', checked as boolean)}
              />
              <Label htmlFor="demo" className="text-sm text-zinc-400">
                Schedule a personalized demo
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-lg py-6"
          >
            {isSubmitting ? "Submitting..." : "Get Started"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-xs text-zinc-500 text-center">
            By submitting this form, you agree to our privacy policy and terms of service.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

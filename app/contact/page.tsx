"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, Mail, Phone, MapPin, ArrowRight, Star } from "lucide-react"
import EnterpriseContactForm from "@/components/enterprise-contact-form"

export default function ContactPage() {
  const searchParams = useSearchParams()
  const preselectedPlan = searchParams.get('plan')
  const [showEnterpriseForm, setShowEnterpriseForm] = useState(false)

  useEffect(() => {
    // Show enterprise form if plan is specified
    if (preselectedPlan === 'enterprise') {
      setShowEnterpriseForm(true)
    }
  }, [preselectedPlan])

  const handleEnterpriseSuccess = () => {
    setShowEnterpriseForm(false)
    // Redirect to thank you or show success message
  }

  if (showEnterpriseForm) {
    return (
      <div className="min-h-screen pattern-bg text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-serif mb-4">Enterprise Contact</h2>
            <p className="text-xl text-gray-400">
              Get custom pricing and features for your organization
            </p>
          </div>
          
          <EnterpriseContactForm 
            preselectedPlan="enterprise"
            onSuccess={handleEnterpriseSuccess}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pattern-bg text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold font-serif mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions about PromptForge? Need enterprise pricing? Want to discuss custom integrations?
            We're here to help you succeed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Contact Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Reach out to our team for support, sales, or partnerships
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-medium">Email Support</div>
                    <div className="text-gray-400">support@promptforge.com</div>
                    <div className="text-sm text-gray-500">24/7 technical support</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-medium">Enterprise Sales</div>
                    <div className="text-gray-400">enterprise@promptforge.com</div>
                    <div className="text-sm text-gray-500">Custom pricing & features</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-medium">Phone Support</div>
                    <div className="text-gray-400">+1 (555) 123-4567</div>
                    <div className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-medium">Office</div>
                    <div className="text-gray-400">123 AI Street, Tech City</div>
                    <div className="text-sm text-gray-500">United States</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Essential Actions */}
            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Essential Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  onClick={() => setShowEnterpriseForm(true)}
                >
                  <Building className="w-4 h-4 mr-2" />
                  Enterprise Inquiry
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
                  onClick={() => window.open('https://docs.promptforge.com', '_blank')}
                >
                  <Star className="w-4 h-4 mr-2" />
                  View Documentation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enterprise Contact Form */}
          <div>
            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-10 h-10 text-yellow-500" />
                </div>
                <CardTitle className="font-serif text-2xl">Enterprise Solutions</CardTitle>
                <CardDescription className="text-gray-400">
                  Get custom pricing and features for your organization
                </CardDescription>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge className="bg-yellow-600 text-black">Custom Pricing</Badge>
                  <Badge className="bg-green-600 text-white">White-label</Badge>
                  <Badge className="bg-blue-600 text-white">API Access</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <EnterpriseContactForm 
                  preselectedPlan={preselectedPlan || undefined}
                  onSuccess={handleEnterpriseSuccess}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold font-serif mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-zinc-900/80 border border-zinc-700 text-left">
              <CardHeader>
                <CardTitle className="font-serif text-lg">What's included in Enterprise?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Everything in Pro plus API access, white-label options, custom integrations, 
                  dedicated support, and SLA guarantees.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 border border-zinc-700 text-left">
              <CardHeader>
                <CardTitle className="font-serif text-lg">How efficient is response time?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  We respond to all inquiries within 24 hours, with enterprise customers 
                  getting priority support and dedicated account managers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 border border-zinc-700 text-left">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Do you offer custom features?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Yes! Enterprise customers can request custom integrations, white-label solutions, 
                  and tailored features for their specific use cases.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

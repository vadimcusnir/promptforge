"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ForgeGlyphInteractive } from "@/components/forge/ForgeGlyphInteractive"
import { Send, Mail, MessageSquare, HelpCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-zinc-900/80 border border-zinc-700">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <Send className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-white mb-4">
              Message Sent
            </h2>
            <p className="text-gray-400 mb-6">
              Thank you for contacting us. We&apos;ll get back to you within 24 hours.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({ name: "", email: "", subject: "", category: "", message: "" })
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
            >
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/95 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center mb-6">
            <ForgeGlyphInteractive 
              status="ready" 
              size="md"
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ready to forge your prompts? Get in touch with our team.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-zinc-900/80 border border-zinc-700">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-white">Send us a Message</CardTitle>
              <CardDescription className="text-gray-400">
                                     Fill out the form below and we&apos;ll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                    Category
                  </label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="general" className="text-white hover:bg-zinc-700">General Inquiry</SelectItem>
                      <SelectItem value="support" className="text-white hover:bg-zinc-700">Technical Support</SelectItem>
                      <SelectItem value="billing" className="text-white hover:bg-zinc-700">Billing Question</SelectItem>
                      <SelectItem value="enterprise" className="text-white hover:bg-zinc-700">Enterprise Sales</SelectItem>
                      <SelectItem value="partnership" className="text-white hover:bg-zinc-700">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                    placeholder="Brief subject line"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-yellow-500" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">General Inquiries</p>
                    <p className="text-white font-mono">hello@promptforge.ai</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Technical Support</p>
                    <p className="text-white font-mono">support@promptforge.ai</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Enterprise Sales</p>
                    <p className="text-white font-mono">enterprise@promptforge.ai</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-yellow-500" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">General Inquiries</p>
                    <p className="text-white">Within 24 hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Technical Support</p>
                    <p className="text-white">Within 12 hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Enterprise Sales</p>
                    <p className="text-white">Within 4 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-yellow-500" />
                  FAQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Check our documentation and guides for quick answers to common questions.
                </p>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  onClick={() => window.location.href = '/docs'}
                >
                  View Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
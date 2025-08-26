"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageSquare, Send, AlertCircle, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    type: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Simulate form submission
    setTimeout(() => {
      if (formData.name && formData.email && formData.message) {
        setSuccess("Message sent successfully! We'll get back to you within 24 hours.")
        setFormData({ name: "", email: "", company: "", subject: "", message: "", type: "" })
      } else {
        setError("Please fill in all required fields")
      }
      setIsLoading(false)
    }, 1000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      content: "support@promptforge.com",
      description: "General inquiries and support",
    },
    {
      icon: Mail,
      title: "Legal & Privacy",
      content: "legal@promptforge.com",
      description: "Legal matters and privacy concerns",
    },
    {
      icon: MessageSquare,
      title: "Enterprise Sales",
      content: "enterprise@promptforge.com",
      description: "Custom solutions and partnerships",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 font-montserrat">Contact Us</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-open-sans">
            Get in touch with our team. We're here to help you succeed with PromptForge.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/30 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-montserrat text-white">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-6">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-green-400 text-sm">{success}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300 font-open-sans">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-gold-400"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300 font-open-sans">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-gold-400"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-gray-300 font-open-sans">
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-gold-400"
                        placeholder="Your company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-gray-300 font-open-sans">
                        Inquiry Type
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="sales">Sales Inquiry</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-300 font-open-sans">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-gold-400"
                      placeholder="Brief subject line"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-300 font-open-sans">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-gold-400 min-h-32"
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gold-400 hover:bg-gold-500 text-black font-semibold py-3 font-open-sans"
                  >
                    {isLoading ? (
                      "Sending..."
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
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-gray-900/30 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-montserrat text-white">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-gold-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-white font-open-sans">{info.title}</h3>
                        <p className="text-gold-400 font-open-sans">{info.content}</p>
                        <p className="text-sm text-gray-400 font-open-sans">{info.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="bg-gray-900/30 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-montserrat text-white">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm font-open-sans">
                  <div className="flex justify-between">
                    <span className="text-gray-400">General Support:</span>
                    <span className="text-white">24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Enterprise:</span>
                    <span className="text-white">4 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Critical Issues:</span>
                    <span className="text-white">1 hour</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

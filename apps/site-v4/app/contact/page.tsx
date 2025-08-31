"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MessageSquare } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-600/20 text-emerald-400 border-emerald-500/50">Contact Us</Badge>
          <h1 className="text-4xl font-bold text-white mb-6 font-mono">
            Get in <span className="text-emerald-400">Touch</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Have questions about PromptForge™? Need support? Want to discuss enterprise solutions? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-emerald-400" />
                Send us a message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject" className="text-slate-300">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-slate-300">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-emerald-400" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-2">For general inquiries and support:</p>
                <p className="text-emerald-400 font-mono">support@promptforge.ai</p>
                <p className="text-slate-300 mt-4 mb-2">For enterprise and partnerships:</p>
                <p className="text-emerald-400 font-mono">enterprise@promptforge.ai</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Response Times</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">General Support:</span>
                  <span className="text-emerald-400 font-mono">&lt; 24h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Enterprise Support:</span>
                  <span className="text-emerald-400 font-mono">&lt; 4h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Critical Issues:</span>
                  <span className="text-emerald-400 font-mono">&lt; 1h</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Before reaching out, check our comprehensive documentation for quick answers.
                </p>
                <Button
                  variant="outline"
                  className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 bg-transparent"
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

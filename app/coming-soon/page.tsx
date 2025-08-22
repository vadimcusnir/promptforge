"use client"

import { useState, useEffect } from "react"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SkipLink } from "@/components/SkipLink"
import { COPY } from "@/lib/copy"
import {
  Zap,
  Crown,
  Download,
  Brain,
  TrendingUp,
  Award,
  Clock,
  Cpu,
  Crosshair,
  Activity,
  Shield,
  ChevronRight,
  Mail,
  Bell,
} from "lucide-react"

// Metadata moved to layout.tsx

export default function ComingSoonPage() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ 
    days: 7, 
    hours: 12, 
    minutes: 45, 
    seconds: 30 
  })

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    // TODO: Integrate with email service
    console.log("Subscribing email:", email)
    setIsSubscribed(true)
    setEmail("")
  }

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "50 Module Semantice",
      description: "Bibliotecă completă de module specializate pentru prompt engineering"
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "7-D Parameter Engine",
      description: "Motor avansat cu 7 dimensiuni pentru optimizarea prompturilor"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Export Bundle",
      description: "Export deterministic cu manifest și checksum pentru consistență"
    },
    {
      icon: <Crosshair className="h-6 w-6" />,
      title: "Test Engine",
      description: "Testare live cu scoruri PASS/FAIL și feedback detaliat"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Ready",
      description: "API, rate limiting, seats management și integrări enterprise"
    },
    {
      icon: <Crown className="h-6 w-6" />,
      title: "Premium Features",
      description: "Acces la toate modulele, packs industriale și AI assistants"
    }
  ]

  return (
    <>
      <SkipLink />
      
      {/* No background system here - SSR off pentru background conform documentației */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 text-blue-400 border-blue-400">
              <Clock className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              PromptForge v3
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto">
              Prima platformă Cognitive-OS pentru prompts cu{" "}
              <span className="text-blue-400 font-semibold">50 module semantice</span> și{" "}
              <span className="text-purple-400 font-semibold">7-D Parameter Engine</span>
            </p>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-12">
              {[
                { label: "Zile", value: timeLeft.days },
                { label: "Ore", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds }
              ].map((item, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{item.value}</div>
                    <div className="text-xs text-slate-400">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Email Subscription */}
          <Card className="max-w-md mx-auto mb-16 bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Early Access</CardTitle>
              <CardDescription>
                Fii primul care testează PromptForge v3
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubscribed ? (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                    <Bell className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-green-400 font-medium">Mulțumim!</p>
                  <p className="text-slate-400 text-sm">Te vom anunța când lansăm.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Notify Me
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    Nu spam. Doar update-uri importante.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-colors">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4">
                    <div className="text-blue-400">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Revoluționează-ți prompt engineering-ul
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              PromptForge v3 combină puterea AI-ului cu precizia ingineriei pentru 
              a crea cea mai avansată platformă de prompt engineering din lume.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <ChevronRight className="h-5 w-5 mr-2" />
                Află mai multe
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <Activity className="h-5 w-5 mr-2" />
                Vezi demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


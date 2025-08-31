"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, ShoppingCart, Download, CheckCircle, Clock, Shield, Award } from "lucide-react"
import { getPackById } from "@/lib/marketplace-data"

export default function PackDetailPage() {
  const params = useParams()
  const pack = getPackById(params.id as string)
  const [isLoading, setIsLoading] = useState(false)

  if (!pack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white font-mono mb-4">Pack Not Found</h1>
          <p className="text-slate-400 font-mono mb-8">The module pack you're looking for doesn't exist.</p>
          <Link href="/shop">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handlePurchase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packId: pack.id,
          priceId: pack.stripePriceId,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Purchase error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center text-slate-400 hover:text-white font-mono mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge
                    variant="outline"
                    className="border-emerald-400/30 text-emerald-400 bg-emerald-400/10 font-mono text-sm mb-4"
                  >
                    {pack.category}
                  </Badge>
                  <h1 className="text-4xl font-bold text-white font-mono mb-4">{pack.name}</h1>
                  <p className="text-xl text-slate-300 font-mono">{pack.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-mono text-white">{pack.rating}</span>
                  <span className="text-slate-400 font-mono">({pack.sales} sales)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">{pack.successRate}%</div>
                  <div className="text-sm text-slate-400 font-mono">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">{pack.modules.length}</div>
                  <div className="text-sm text-slate-400 font-mono">Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">{pack.sales}</div>
                  <div className="text-sm text-slate-400 font-mono">Sales</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-slate-900/50 border border-slate-700 p-1">
                <TabsTrigger value="overview" className="font-mono">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="modules" className="font-mono">
                  Modules
                </TabsTrigger>
                <TabsTrigger value="case-studies" className="font-mono">
                  Case Studies
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="font-mono">
                  Testimonials
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Expected Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg text-emerald-400 font-mono">{pack.expectedResults}</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Features Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {pack.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-slate-300 font-mono text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">What You'll Get</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pack.deliverables.map((deliverable, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600"
                        >
                          <Download className="w-5 h-5 text-emerald-400 mt-0.5" />
                          <div>
                            <div className="font-mono text-white font-semibold">{deliverable.type}</div>
                            <div className="text-sm text-slate-400 font-mono">{deliverable.description}</div>
                            <Badge variant="outline" className="border-slate-600 text-slate-300 font-mono text-xs mt-1">
                              {deliverable.format}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="modules" className="space-y-6">
                <div className="grid gap-4">
                  {pack.modules.map((module, index) => (
                    <Card key={index} className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="border-emerald-400/30 text-emerald-400 bg-emerald-400/10 font-mono"
                          >
                            {module}
                          </Badge>
                          <div className="flex-1">
                            <div className="font-mono text-white font-semibold">Module {module}</div>
                            <div className="text-sm text-slate-400 font-mono">
                              Industrial-grade prompt with KPI validation
                            </div>
                          </div>
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="case-studies" className="space-y-6">
                {pack.caseStudies.map((study, index) => (
                  <Card key={index} className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white font-mono">{study.title}</CardTitle>
                      <CardDescription className="font-mono">{study.industry}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-mono text-white font-semibold mb-2">Challenge</h4>
                          <p className="text-sm text-slate-400 font-mono">{study.challenge}</p>
                        </div>
                        <div>
                          <h4 className="font-mono text-white font-semibold mb-2">Solution</h4>
                          <p className="text-sm text-slate-400 font-mono">{study.solution}</p>
                        </div>
                        <div>
                          <h4 className="font-mono text-white font-semibold mb-2">Results</h4>
                          <p className="text-sm text-emerald-400 font-mono">{study.results}</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        {study.metrics.map((metric, metricIndex) => (
                          <div key={metricIndex} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                            <div className="text-sm text-slate-400 font-mono mb-1">{metric.metric}</div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-slate-300 font-mono text-sm">{metric.before}</span>
                              <span className="text-slate-500">→</span>
                              <span className="text-white font-mono text-sm">{metric.after}</span>
                            </div>
                            <div className="text-emerald-400 font-mono font-semibold">{metric.improvement}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="testimonials" className="space-y-6">
                {pack.testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-mono font-bold">
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-white font-semibold">{testimonial.name}</span>
                            <span className="text-slate-400 font-mono text-sm">{testimonial.company}</span>
                          </div>
                          <p className="text-slate-300 font-mono mb-3">"{testimonial.text}"</p>
                          <div className="bg-emerald-900/20 border border-emerald-400/30 rounded-lg p-3">
                            <div className="text-emerald-400 font-mono font-semibold text-sm">
                              {testimonial.results}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    {pack.originalPrice && (
                      <div className="text-slate-400 font-mono line-through text-lg">${pack.originalPrice}</div>
                    )}
                    <div className="text-3xl font-bold text-white font-mono">${pack.price}</div>
                    <div className="text-sm text-slate-400 font-mono">One-time purchase</div>
                  </div>
                  {pack.originalPrice && (
                    <Badge className="bg-red-600/20 text-red-400 border-red-400/30 font-mono">
                      Save ${pack.originalPrice - pack.price}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono"
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </>
                  )}
                </Button>

                <div className="space-y-3 text-sm font-mono">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">{pack.timeline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">{pack.support}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white font-mono">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pack.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300 font-mono text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white font-mono">Pack Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-mono text-sm">Success Rate</span>
                  <span className="text-emerald-400 font-mono font-semibold">{pack.successRate}%</span>
                </div>
                <Progress value={pack.successRate} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-mono text-sm">Customer Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-mono">{pack.rating}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-mono text-sm">Total Sales</span>
                  <span className="text-white font-mono">{pack.sales}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-mono text-sm">License Type</span>
                  <Badge variant="outline" className="border-slate-600 text-slate-300 font-mono text-xs">
                    {pack.license}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

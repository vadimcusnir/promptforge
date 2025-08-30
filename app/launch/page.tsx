import { Metadata } from 'next'
import ProductHuntLaunch from '@/components/marketing/product-hunt-launch'
import LeadCapture from '@/components/marketing/lead-capture'
import LaunchAnalytics from '@/components/marketing/launch-analytics'
import CommunityHub from '@/components/marketing/community-hub'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Star, Users, TrendingUp, Target, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'PromptForge v3 Launch - Industrial Prompt Engineering Platform',
  description: 'Join the launch of PromptForge v3 - the most advanced industrial prompt engineering platform with 50 modules and 7D parameters.',
  keywords: 'prompt engineering, AI, industrial AI, launch, Product Hunt, enterprise AI',
  openGraph: {
    title: 'PromptForge v3 Launch - Industrial Prompt Engineering Platform',
    description: 'Join the launch of PromptForge v3 - the most advanced industrial prompt engineering platform.',
    type: 'website',
    url: 'https://chatgpt-prompting.com/launch',
    images: ['/og-launch.png']
  }
}

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30 mb-4">
              🚀 Phase 2 Launch
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              PromptForge v3
              <br />
              <span className="text-yellow-500">Public Launch</span>
            </h1>
            <p className="text-xl text-zinc-500 mb-8 max-w-3xl mx-auto">
              The future of industrial prompt engineering is here. Join thousands of professionals 
              building auditable, reproducible AI systems.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-lg px-8 py-6">
              Get Early Access
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-zinc-700 text-lg px-8 py-6 bg-transparent">
              View Demo
            </Button>
          </div>

          {/* Launch Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">50</div>
              <div className="text-sm text-zinc-500">Industrial Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">7D</div>
              <div className="text-sm text-zinc-500">Parameters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">{"<"}60s</div>
              <div className="text-sm text-zinc-500">Export Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">100+</div>
              <div className="text-sm text-zinc-500">Early Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Hunt Launch */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">We're Live on Product Hunt!</h2>
            <p className="text-zinc-500 text-lg">Help us reach the top by upvoting and sharing</p>
          </div>
          
          <ProductHuntLaunch
            launchDate="2024-01-20T00:00:00Z"
            targetUpvotes={1000}
            currentUpvotes={847}
            isLive={true}
          />
        </div>
      </section>

      {/* Launch Goals */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Phase 2 Launch Goals</h2>
            <p className="text-zinc-500 text-lg">Our targets for the next 4 weeks</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-zinc-900/80 border border-yellow-600/30">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-yellow-500" />
                </div>
                <CardTitle className="text-xl text-white">100+ Paying Customers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">78</div>
                <div className="text-sm text-zinc-400">Current Progress</div>
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-3">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 border border-green-600/30">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle className="text-xl text-white">$10K MRR</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">$6,850</div>
                <div className="text-sm text-zinc-400">Current Progress</div>
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '68.5%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 border border-blue-600/30">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
                <CardTitle className="text-xl text-white">Top 5 Product Hunt</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">#8</div>
                <div className="text-sm text-zinc-400">Current Rank</div>
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-3">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '84.7%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 border border-purple-600/30">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-500" />
                </div>
                <CardTitle className="text-xl text-white">2-3 Consulting Deals</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">1</div>
                <div className="text-sm text-zinc-400">Current Progress</div>
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-3">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '33.3%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">
                Get Exclusive Early Access
              </h2>
              <p className="text-zinc-400 text-lg mb-8">
                Join our launch list and be among the first to experience PromptForge v3. 
                Get priority access, exclusive pricing, and direct support from our team.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-zinc-300">Priority access to all 50 modules</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-zinc-300">Exclusive early adopter pricing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-zinc-300">Direct support from our engineering team</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-zinc-300">Access to beta features and updates</span>
                </div>
              </div>
            </div>
            
            <div>
              <LeadCapture
                variant="general"
                title="Join the Launch"
                subtitle="Be among the first to experience PromptForge v3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise & Consulting */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Enterprise & Consulting Services</h2>
            <p className="text-zinc-500 text-lg">High-ticket solutions for enterprise teams</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-zinc-900/80 border border-blue-600/30">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-500" />
                  Enterprise Solutions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-400">
                  Deploy PromptForge v3 across your entire organization with enterprise-grade security, 
                  compliance, and support.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-zinc-300">Custom module development</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-zinc-300">Dedicated support team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-zinc-300">SLA guarantees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-zinc-300">On-premise deployment options</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Contact Enterprise Sales
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 border border-purple-600/30">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-500" />
                  Consulting Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-400">
                  Work directly with our experts to implement prompt engineering best practices 
                  and optimize your AI workflows.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-zinc-300">Custom implementation strategy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-zinc-300">Team training & workshops</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-zinc-300">Performance optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-zinc-300">Ongoing support & maintenance</span>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Schedule Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Join Our Community</h2>
            <p className="text-zinc-500 text-lg">Connect with fellow prompt engineers and stay updated</p>
          </div>
          
          <CommunityHub />
        </div>
      </section>

      {/* Analytics Dashboard Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Launch Analytics Dashboard</h2>
            <p className="text-zinc-500 text-lg">Real-time tracking of our launch progress and KPIs</p>
          </div>
          
          <LaunchAnalytics variant="overview" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-600/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">
            Ready to Transform Your Prompt Engineering?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Join thousands of professionals who are already building better AI systems with PromptForge v3.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-lg px-8 py-6">
              Start Building Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-zinc-700 text-lg px-8 py-6 bg-transparent">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

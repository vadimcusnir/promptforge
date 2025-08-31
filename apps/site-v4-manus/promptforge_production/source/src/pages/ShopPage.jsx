import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShoppingCart,
  Star,
  Download,
  Users,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Package,
  Crown,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Layers,
  Code,
  BarChart3,
  Briefcase,
  Rocket,
  Heart,
  Eye,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Tag,
  Globe,
  Lock,
  Unlock,
  Play,
  FileText,
  Hash,
  Timer,
  Gauge
} from 'lucide-react'

const ShopPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState('all')

  // Module Packs - Complete industrial-grade prompt systems
  const modulePacks = [
    {
      id: 'sales-accelerator',
      title: 'Sales Accelerator Pack',
      category: 'sales',
      difficulty: 'Advanced',
      modules: 6,
      price: 329,
      originalPrice: 449,
      plan: 'pro',
      rating: 4.9,
      reviews: 127,
      description: 'Activate an end-to-end sales pipeline that increases Conversion Rate by +15% and reduces Cost-per-Lead by -10% in 30 days.',
      features: [
        'Hunter/Closer/Nurturer conversational playbook',
        '7-stage pipeline for rapid commercial decisions',
        'Lead orchestration with Make/Notion/Telegram automation',
        'B2B sales scripts with psychological triggers',
        'Objection handling matrix with response templates',
        'Performance KPIs and conversion tracking'
      ],
      results: {
        cr_increase: '+15%',
        cac_reduction: '-10%',
        time_to_close: '30 days',
        satisfaction: '94%'
      },
      tags: ['B2B', 'Automation', 'Conversion', 'Pipeline'],
      icon: <Target className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'edu-ops',
      title: 'Edu Ops Pack',
      category: 'education',
      difficulty: 'Intermediate',
      modules: 5,
      price: 219,
      originalPrice: 299,
      plan: 'creator',
      rating: 4.8,
      reviews: 89,
      description: 'Complete system for educators and trainers: from curriculum to evaluation, with measurable KPIs and GDPR compliance.',
      features: [
        'Structured educational curriculum generator',
        'Assessment and evaluation frameworks',
        'Student engagement optimization',
        'GDPR-compliant data handling',
        'Learning outcome measurement',
        'Interactive content creation tools'
      ],
      results: {
        engagement: '85%',
        completion_rate: '+40%',
        satisfaction: '92%',
        compliance: '100%'
      },
      tags: ['Education', 'Curriculum', 'Assessment', 'Compliance'],
      icon: <Award className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'creator-commerce',
      title: 'Creator Commerce Pack',
      category: 'content',
      difficulty: 'Advanced',
      modules: 6,
      price: 274,
      originalPrice: 349,
      plan: 'pro',
      rating: 4.7,
      reviews: 156,
      description: 'Monetize content with automated sales systems: from audience building to conversion optimization.',
      features: [
        'Data-driven content strategy builder',
        'Audience growth automation',
        'Conversion funnel optimization',
        'Revenue stream diversification',
        'Performance analytics dashboard',
        'Brand positioning framework'
      ],
      results: {
        audience_growth: '+20%',
        revenue_increase: '+35%',
        engagement: '78%',
        conversion: '+25%'
      },
      tags: ['Content', 'Monetization', 'Growth', 'Analytics'],
      icon: <Rocket className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'crisis-management',
      title: 'Crisis Management Pack',
      category: 'crisis',
      difficulty: 'Expert',
      modules: 4,
      price: 439,
      originalPrice: 549,
      plan: 'enterprise',
      rating: 4.9,
      reviews: 73,
      description: 'Respond rapidly to communication crises with validated playbooks and pre-tested messages for any scenario.',
      features: [
        'Crisis response playbooks',
        'Pre-tested message templates',
        'Stakeholder communication matrix',
        'Media relations protocols',
        'Reputation recovery strategies',
        'Real-time monitoring tools'
      ],
      results: {
        response_time: '≤2h',
        reputation_recovery: '95%',
        stakeholder_satisfaction: '88%',
        media_coverage: '+positive'
      },
      tags: ['Crisis', 'Communication', 'Reputation', 'Response'],
      icon: <Shield className="w-6 h-6" />,
      color: 'from-red-500 to-orange-600'
    },
    {
      id: 'analytics-insights',
      title: 'Analytics & Insights Pack',
      category: 'analytics',
      difficulty: 'Advanced',
      modules: 5,
      price: 197,
      originalPrice: 249,
      plan: 'pro',
      rating: 4.8,
      reviews: 112,
      description: 'Transform data into decisions with automated dashboards and executive-ready reports.',
      features: [
        'Automated dashboard creation',
        'Executive report generation',
        'Data visualization tools',
        'Predictive analytics models',
        'KPI tracking systems',
        'Decision support frameworks'
      ],
      results: {
        data_accuracy: '95%',
        decision_speed: '+50%',
        insight_quality: '92%',
        roi_improvement: '+30%'
      },
      tags: ['Analytics', 'Dashboards', 'Reports', 'Insights'],
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'brand-authority',
      title: 'Brand Authority Pack',
      category: 'branding',
      difficulty: 'Advanced',
      modules: 5,
      price: 252,
      originalPrice: 319,
      plan: 'pro',
      rating: 4.6,
      reviews: 94,
      description: 'Build industry authority with strategic content and expert positioning validated by algorithms.',
      features: [
        'Authority positioning framework',
        'Strategic content planning',
        'Thought leadership development',
        'Industry influence metrics',
        'Expert validation systems',
        'Brand reputation monitoring'
      ],
      results: {
        brand_mentions: '+50%',
        authority_score: '+65%',
        media_coverage: '+40%',
        industry_recognition: '+80%'
      },
      tags: ['Branding', 'Authority', 'Content', 'Positioning'],
      icon: <Crown className="w-6 h-6" />,
      color: 'from-yellow-500 to-amber-600'
    }
  ]

  // Individual Modules
  const individualModules = [
    {
      id: 'hunter-closer-nurturer',
      title: 'Hunter/Closer/Nurturer System',
      category: 'sales',
      difficulty: 'Advanced',
      price: 89,
      plan: 'pro',
      rating: 4.8,
      reviews: 45,
      description: 'Hunter/Closer/Nurturer system with conversational playbook for B2B sales.',
      tags: ['B2B', 'Sales', 'Conversation'],
      icon: <Target className="w-5 h-5" />
    },
    {
      id: 'rapid-verdict-pipeline',
      title: 'Rapid Verdict Pipeline',
      category: 'sales',
      difficulty: 'Intermediate',
      price: 67,
      plan: 'creator',
      rating: 4.7,
      reviews: 32,
      description: '7-stage pipeline for rapid and efficient commercial decisions.',
      tags: ['Pipeline', 'Decision', 'Efficiency'],
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'lead-orchestration',
      title: 'Lead Orchestration System',
      category: 'automation',
      difficulty: 'Expert',
      price: 124,
      plan: 'enterprise',
      rating: 4.9,
      reviews: 28,
      description: 'Lead orchestration with Make/Notion/Telegram for complete automation.',
      tags: ['Automation', 'Integration', 'Leads'],
      icon: <Layers className="w-5 h-5" />
    },
    {
      id: 'curriculum-generator',
      title: 'Educational Curriculum Generator',
      category: 'education',
      difficulty: 'Intermediate',
      price: 56,
      plan: 'creator',
      rating: 4.6,
      reviews: 41,
      description: 'Generate structured educational curriculum with measurable objectives.',
      tags: ['Education', 'Curriculum', 'Structure'],
      icon: <Award className="w-5 h-5" />
    },
    {
      id: 'content-strategy-builder',
      title: 'Content Strategy Builder',
      category: 'content',
      difficulty: 'Advanced',
      price: 78,
      plan: 'pro',
      rating: 4.8,
      reviews: 67,
      description: 'Build data-driven content strategies with performance KPIs.',
      tags: ['Content', 'Strategy', 'Analytics'],
      icon: <Briefcase className="w-5 h-5" />
    }
  ]

  const categories = [
    { id: 'all', name: 'All Categories', icon: <Package className="w-4 h-4" /> },
    { id: 'sales', name: 'Sales & Marketing', icon: <Target className="w-4 h-4" /> },
    { id: 'education', name: 'Education & Training', icon: <Award className="w-4 h-4" /> },
    { id: 'content', name: 'Content & Creator', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics & Data', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'branding', name: 'Branding & Authority', icon: <Crown className="w-4 h-4" /> },
    { id: 'crisis', name: 'Crisis Management', icon: <Shield className="w-4 h-4" /> },
    { id: 'automation', name: 'Automation & Tools', icon: <Layers className="w-4 h-4" /> }
  ]

  const plans = [
    { id: 'all', name: 'All Plans' },
    { id: 'free', name: 'Free' },
    { id: 'creator', name: 'Creator' },
    { id: 'pro', name: 'Pro' },
    { id: 'enterprise', name: 'Enterprise' }
  ]

  const filteredPacks = modulePacks.filter(pack => {
    const matchesSearch = pack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pack.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pack.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || pack.category === selectedCategory
    const matchesPlan = selectedPlan === 'all' || pack.plan === selectedPlan
    return matchesSearch && matchesCategory && matchesPlan
  })

  const filteredModules = individualModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory
    const matchesPlan = selectedPlan === 'all' || module.plan === selectedPlan
    return matchesSearch && matchesCategory && matchesPlan
  })

  const handlePurchase = (item) => {
    navigate(`/shop/${item.id}`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-fuchsia-500/10" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
            <Package className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">PromptForge™ v3.0 Marketplace</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-white to-fuchsia-400 bg-clip-text text-transparent">
            Industrial Prompt Modules
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional-grade prompt systems and module packs. Built for scale, tested for results, ready for deployment.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>50+ Industrial Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Verified Results</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Enterprise Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search modules, packs, or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-black/50 border-gray-700 text-white placeholder-gray-400 h-12"
              />
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 h-12 px-6">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Plan Level</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
                <option>All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
                <option>Most Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <Tabs defaultValue="packs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-gray-800 mb-8">
            <TabsTrigger value="packs" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              Module Packs ({filteredPacks.length})
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              Individual Modules ({filteredModules.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packs">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredPacks.map((pack) => (
                <Card key={pack.id} className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all duration-300 group overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${pack.color}`} />
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${pack.color} bg-opacity-20`}>
                        {pack.icon}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-400 mb-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{pack.rating}</span>
                          <span className="text-xs text-gray-400">({pack.reviews})</span>
                        </div>
                        <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {pack.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                      {pack.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {pack.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {pack.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-gray-400 mb-1">Modules</div>
                        <div className="text-white font-semibold">{pack.modules} modules</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-gray-400 mb-1">Plan Required</div>
                        <div className="text-white font-semibold capitalize">{pack.plan}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white">${pack.price}</span>
                          <span className="text-sm text-gray-400 line-through">${pack.originalPrice}</span>
                        </div>
                        <div className="text-xs text-green-400">
                          Save ${pack.originalPrice - pack.price}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        onClick={() => handlePurchase(pack)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Purchase Pack
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                        onClick={() => navigate(`/shop/${pack.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="modules">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredModules.map((module) => (
                <Card key={module.id} className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all duration-300 group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        {module.icon}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-400 mb-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs">{module.rating}</span>
                        </div>
                        <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {module.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="font-semibold text-white mb-2 group-hover:text-green-400 transition-colors text-sm">
                      {module.title}
                    </h3>
                    
                    <p className="text-gray-400 text-xs mb-4 line-clamp-2">
                      {module.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {module.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-white">${module.price}</span>
                      <span className="text-xs text-gray-400 capitalize">{module.plan} plan</span>
                    </div>

                    <Button 
                      onClick={() => handlePurchase(module)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm"
                    >
                      <ShoppingCart className="w-3 h-3 mr-2" />
                      Purchase
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ShopPage


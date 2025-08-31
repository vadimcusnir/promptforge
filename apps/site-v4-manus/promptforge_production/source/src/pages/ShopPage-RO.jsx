import { useState, useEffect } from 'react'
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
  const [cart, setCart] = useState([])

  // Module Packs Data based on marketplace requirements
  const modulePacks = [
    {
      id: 'sales-accelerator',
      name: 'Sales Accelerator Pack',
      description: 'Activează un pipeline de vânzări end-to-end care crește Conversion Rate cu +15% și reduce Cost-per-Lead cu -10% în 30 zile.',
      category: 'sales',
      modules: ['M06', 'M03', 'M22', 'M11', 'M14', 'M18'],
      moduleCount: 6,
      price: {
        single: 299,
        team: 899,
        enterprise: 2499
      },
      kpis: [
        'Reply Rate ≥ 25%',
        'SQL% ≥ 15%',
        'CR Uplift ≥ +15%',
        'CAC Reduction -10%'
      ],
      features: [
        'Agentic GPT Sales System',
        'Codul 7:1™ Pipeline',
        'SOP Lead Generation',
        'Funnel Nota Doi',
        'Authority Content→Commerce',
        'Carusele RFA'
      ],
      deliverables: [
        'Prompts Industriale (A/B variants)',
        'Implementation Checklists',
        'KPI Templates & Dashboard',
        '3 Validated Case Studies',
        'Output Templates (JSON/MD)',
        'Guardrails & License'
      ],
      rating: 4.9,
      reviews: 127,
      difficulty: 'Intermediate',
      timeToValue: '30 days',
      minPlan: 'Creator',
      popular: true,
      cover: '/api/placeholder/400/240'
    },
    {
      id: 'edu-ops',
      name: 'Edu Ops Pack',
      description: 'Sistemul complet pentru educatori și traineri: de la curriculum la evaluare, cu KPI măsurabile și compliance GDPR.',
      category: 'education',
      modules: ['M47', 'M21', 'M10', 'M33', 'M45'],
      moduleCount: 5,
      price: {
        single: 199,
        team: 599,
        enterprise: 1799
      },
      kpis: [
        'Student Engagement ≥ 85%',
        'Completion Rate ≥ 75%',
        'Assessment Accuracy ≥ 90%',
        'Time-to-Curriculum -40%'
      ],
      features: [
        'Curriculum Generator',
        'Assessment Builder',
        'Learning Path Optimizer',
        'Progress Analytics',
        'Compliance Templates'
      ],
      deliverables: [
        'Educational Prompts Library',
        'Assessment Templates',
        'Learning Analytics Dashboard',
        'Compliance Checklists',
        'Student Progress Tracking'
      ],
      rating: 4.8,
      reviews: 89,
      difficulty: 'Beginner',
      timeToValue: '14 days',
      minPlan: 'Free',
      popular: false,
      cover: '/api/placeholder/400/240'
    },
    {
      id: 'creator-commerce',
      name: 'Creator Commerce Pack',
      description: 'Monetizează conținutul cu sisteme de vânzare automatizate: de la audience building la conversion optimization.',
      category: 'content',
      modules: ['M35', 'M34', 'M09', 'M18', 'M14', 'M25'],
      moduleCount: 6,
      price: {
        single: 249,
        team: 749,
        enterprise: 2199
      },
      kpis: [
        'Audience Growth ≥ 20%/month',
        'Engagement Rate ≥ 8%',
        'Conversion Rate ≥ 3%',
        'Revenue per Follower +25%'
      ],
      features: [
        'Content Calendar System',
        'Audience Segmentation',
        'Conversion Funnels',
        'Product Launch Sequences',
        'Revenue Analytics'
      ],
      deliverables: [
        'Content Strategy Templates',
        'Sales Funnel Blueprints',
        'Email Sequences',
        'Social Media Calendars',
        'Analytics Dashboards'
      ],
      rating: 4.7,
      reviews: 156,
      difficulty: 'Advanced',
      timeToValue: '21 days',
      minPlan: 'Pro',
      popular: true,
      cover: '/api/placeholder/400/240'
    },
    {
      id: 'crisis-management',
      name: 'Crisis Management Pack',
      description: 'Răspunde rapid la crize de comunicare cu playbook-uri validate și mesaje pre-testate pentru orice scenariu.',
      category: 'crisis',
      modules: ['M41', 'M42', 'M43', 'M44'],
      moduleCount: 4,
      price: {
        single: 399,
        team: 1199,
        enterprise: 3599
      },
      kpis: [
        'Response Time ≤ 2 hours',
        'Sentiment Recovery ≥ 70%',
        'Media Coverage Control ≥ 80%',
        'Stakeholder Retention ≥ 90%'
      ],
      features: [
        'Crisis Detection System',
        'Response Templates',
        'Stakeholder Communication',
        'Media Relations Kit',
        'Recovery Playbooks'
      ],
      deliverables: [
        'Crisis Response Protocols',
        'Communication Templates',
        'Stakeholder Maps',
        'Media Kits',
        'Recovery Metrics'
      ],
      rating: 4.9,
      reviews: 43,
      difficulty: 'Expert',
      timeToValue: '7 days',
      minPlan: 'Enterprise',
      popular: false,
      cover: '/api/placeholder/400/240'
    },
    {
      id: 'analytics-insights',
      name: 'Analytics & Insights Pack',
      description: 'Transformă datele în decizii cu dashboard-uri automatizate și rapoarte executive ready-to-present.',
      category: 'analytics',
      modules: ['M15', 'M16', 'M17', 'M19', 'M20'],
      moduleCount: 5,
      price: {
        single: 179,
        team: 539,
        enterprise: 1619
      },
      kpis: [
        'Data Accuracy ≥ 95%',
        'Report Generation Time -60%',
        'Decision Speed +40%',
        'Insight Actionability ≥ 85%'
      ],
      features: [
        'Automated Dashboards',
        'Executive Reports',
        'Predictive Analytics',
        'KPI Monitoring',
        'Data Visualization'
      ],
      deliverables: [
        'Dashboard Templates',
        'Report Generators',
        'Analytics Frameworks',
        'Visualization Tools',
        'KPI Libraries'
      ],
      rating: 4.6,
      reviews: 92,
      difficulty: 'Intermediate',
      timeToValue: '10 days',
      minPlan: 'Creator',
      popular: false,
      cover: '/api/placeholder/400/240'
    },
    {
      id: 'brand-authority',
      name: 'Brand Authority Pack',
      description: 'Construiește autoritate în industrie cu conținut strategic și poziționare expertă validată de algoritmi.',
      category: 'branding',
      modules: ['M26', 'M27', 'M28', 'M29', 'M30'],
      moduleCount: 5,
      price: {
        single: 229,
        team: 689,
        enterprise: 2069
      },
      kpis: [
        'Brand Mentions +50%',
        'Thought Leadership Score ≥ 8/10',
        'Media Coverage +30%',
        'Industry Recognition +25%'
      ],
      features: [
        'Thought Leadership Content',
        'Industry Positioning',
        'Expert Commentary',
        'Media Relations',
        'Authority Metrics'
      ],
      deliverables: [
        'Content Strategy',
        'Positioning Frameworks',
        'Media Templates',
        'Authority Metrics',
        'Industry Reports'
      ],
      rating: 4.8,
      reviews: 78,
      difficulty: 'Advanced',
      timeToValue: '45 days',
      minPlan: 'Pro',
      popular: false,
      cover: '/api/placeholder/400/240'
    }
  ]

  // Individual Modules Data
  const individualModules = [
    {
      id: 'M06',
      name: 'Agentic GPT Sales',
      description: 'Hunter/Closer/Nurturer system cu playbook conversațional pentru vânzări B2B.',
      category: 'sales',
      price: 79,
      difficulty: 'Intermediate',
      timeToValue: '3 days',
      minPlan: 'Creator',
      rating: 4.9,
      reviews: 234,
      cover: '/api/placeholder/300/180'
    },
    {
      id: 'M03',
      name: 'Codul 7:1™',
      description: 'Pipeline în 7 etape pentru verdict comercial rapid și eficient.',
      category: 'sales',
      price: 59,
      difficulty: 'Beginner',
      timeToValue: '2 days',
      minPlan: 'Free',
      rating: 4.7,
      reviews: 189,
      cover: '/api/placeholder/300/180'
    },
    {
      id: 'M22',
      name: 'SOP Lead Gen',
      description: 'Orchestrare leaduri cu Make/Notion/Telegram pentru automatizare completă.',
      category: 'sales',
      price: 89,
      difficulty: 'Advanced',
      timeToValue: '5 days',
      minPlan: 'Pro',
      rating: 4.8,
      reviews: 156,
      cover: '/api/placeholder/300/180'
    },
    {
      id: 'M47',
      name: 'Curriculum Generator',
      description: 'Generează curriculum educațional structurat cu obiective măsurabile.',
      category: 'education',
      price: 49,
      difficulty: 'Beginner',
      timeToValue: '1 day',
      minPlan: 'Free',
      rating: 4.6,
      reviews: 98,
      cover: '/api/placeholder/300/180'
    },
    {
      id: 'M35',
      name: 'Content Strategy Builder',
      description: 'Construiește strategii de conținut data-driven cu KPI-uri de performanță.',
      category: 'content',
      price: 69,
      difficulty: 'Intermediate',
      timeToValue: '4 days',
      minPlan: 'Creator',
      rating: 4.8,
      reviews: 167,
      cover: '/api/placeholder/300/180'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Categories', icon: Package },
    { id: 'sales', name: 'Sales & Marketing', icon: TrendingUp },
    { id: 'education', name: 'Education & Training', icon: Award },
    { id: 'content', name: 'Content & Creator', icon: Sparkles },
    { id: 'analytics', name: 'Analytics & Insights', icon: BarChart3 },
    { id: 'branding', name: 'Branding & Authority', icon: Crown },
    { id: 'crisis', name: 'Crisis Management', icon: Shield }
  ]

  const planRequirements = [
    { id: 'all', name: 'All Plans' },
    { id: 'Free', name: 'Free' },
    { id: 'Creator', name: 'Creator' },
    { id: 'Pro', name: 'Pro' },
    { id: 'Enterprise', name: 'Enterprise' }
  ]

  const filteredPacks = modulePacks.filter(pack => {
    const matchesSearch = pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pack.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || pack.category === selectedCategory
    const matchesPlan = selectedPlan === 'all' || pack.minPlan === selectedPlan
    return matchesSearch && matchesCategory && matchesPlan
  })

  const filteredModules = individualModules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory
    const matchesPlan = selectedPlan === 'all' || module.minPlan === selectedPlan
    return matchesSearch && matchesCategory && matchesPlan
  })

  const addToCart = (item, type = 'pack', plan = 'single') => {
    const cartItem = {
      id: `${item.id}-${type}-${plan}`,
      itemId: item.id,
      name: item.name,
      type,
      plan,
      price: type === 'pack' ? item.price[plan] : item.price,
      quantity: 1
    }
    setCart(prev => [...prev, cartItem])
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Advanced':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Expert':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'Free':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'Creator':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Pro':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Enterprise':
        return 'bg-gold-500/20 text-gold-400 border-gold-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background via-muted/30 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-gradient-primary">Module Packs Marketplace</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Industrial-grade prompt systems, not one-offs. 50+ modules, validated KPIs, and exports you can trust.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Badge className="badge-primary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Verified Exports
              </Badge>
              <Badge className="badge-outline">
                <Shield className="w-4 h-4 mr-2" />
                Enterprise Grade
              </Badge>
              <Badge className="badge-outline">
                <Timer className="w-4 h-4 mr-2" />
                TTA &lt; 60s
              </Badge>
              <Badge className="badge-outline">
                <Gauge className="w-4 h-4 mr-2" />
                AI Score ≥ 80
              </Badge>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search modules and packs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-background border border-border rounded-md text-foreground"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="px-4 py-2 bg-background border border-border rounded-md text-foreground"
                  >
                    {planRequirements.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="packs" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30">
            <TabsTrigger value="packs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Module Packs
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Individual Modules
            </TabsTrigger>
          </TabsList>

          {/* Module Packs Tab */}
          <TabsContent value="packs" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPacks.map((pack) => (
                <Card key={pack.id} className="card-industrial overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={pack.cover} 
                      alt={pack.name}
                      className="w-full h-48 object-cover"
                    />
                    {pack.popular && (
                      <Badge className="absolute top-3 left-3 badge-primary">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge className={getDifficultyColor(pack.difficulty)}>
                        {pack.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {pack.name}
                      </h3>
                      <Badge className={getPlanColor(pack.minPlan)}>
                        {pack.minPlan}+
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {pack.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Layers className="w-4 h-4 mr-1" />
                        {pack.moduleCount} modules
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {pack.rating} ({pack.reviews})
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {pack.timeToValue}
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {pack.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {pack.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{pack.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Target KPIs:</h4>
                        <div className="space-y-1">
                          {pack.kpis.slice(0, 2).map((kpi, index) => (
                            <div key={index} className="flex items-center text-xs text-muted-foreground">
                              <Target className="w-3 h-3 mr-2 text-green-500" />
                              {kpi}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold">${pack.price.single}</span>
                          <span className="text-sm text-muted-foreground ml-1">single</span>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>Team: ${pack.price.team}</div>
                          <div>Enterprise: ${pack.price.enterprise}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 btn-primary"
                          onClick={() => navigate(`/shop/${pack.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => addToCart(pack, 'pack', 'single')}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Individual Modules Tab */}
          <TabsContent value="modules" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredModules.map((module) => (
                <Card key={module.id} className="card-industrial overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={module.cover} 
                      alt={module.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge className={getDifficultyColor(module.difficulty)} size="sm">
                        {module.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold group-hover:text-primary transition-colors">
                        {module.name}
                      </h3>
                      <Badge className={getPlanColor(module.minPlan)} size="sm">
                        {module.minPlan}+
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {module.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        {module.rating}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {module.timeToValue}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold">${module.price}</span>
                      <span className="text-xs text-muted-foreground">{module.reviews} reviews</span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        className="flex-1 btn-primary"
                        onClick={() => navigate(`/shop/module/${module.id}`)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(module, 'module')}
                      >
                        <ShoppingCart className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Shopping Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Card className="card-industrial p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <span className="font-medium">{cart.length} items in cart</span>
                <Button size="sm" className="btn-primary">
                  Checkout
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopPage


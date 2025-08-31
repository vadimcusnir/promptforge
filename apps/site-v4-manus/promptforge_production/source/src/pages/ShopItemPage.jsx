import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  ShoppingCart,
  Star,
  Download,
  Users,
  Zap,
  Shield,
  Clock,
  CheckCircle,
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
  Gauge,
  CreditCard
} from 'lucide-react'

const ShopItemPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('single')
  const [quantity, setQuantity] = useState(1)

  // Mock data - replace with real API calls
  const itemData = {
    'sales-accelerator': {
      id: 'sales-accelerator',
      type: 'pack',
      name: 'Sales Accelerator Pack',
      tagline: 'Your operational sales engine',
      description: 'Activează un pipeline de vânzări end-to-end care crește Conversion Rate cu +15% și reduce Cost-per-Lead cu -10% în 30 zile.',
      longDescription: `
        Sales Accelerator Pack este sistemul complet pentru echipele de vânzări care vor să treacă de la improvizație la rezultate predictibile. 
        
        Pachetul include 6 module industriale validate, fiecare cu prompts testate, KPI-uri măsurabile și guardrails integrate. Nu mai pierzi timp cu experimente - folosești sisteme care funcționează.
        
        Fiecare modul vine cu studii de caz reale, hash-uri de validare și export-uri în multiple formate (.txt, .md, .json, .pdf) cu manifest și checksum pentru audit complet.
      `,
      category: 'sales',
      modules: [
        {
          id: 'M06',
          name: 'Agentic GPT Sales',
          description: 'Hunter/Closer/Nurturer system cu playbook conversațional',
          kpis: ['Reply Rate ≥ 25%', 'Qualification Rate ≥ 60%']
        },
        {
          id: 'M03',
          name: 'Codul 7:1™',
          description: 'Pipeline în 7 etape pentru verdict comercial rapid',
          kpis: ['Decision Time -50%', 'Close Rate +20%']
        },
        {
          id: 'M22',
          name: 'SOP Lead Gen',
          description: 'Orchestrare leaduri Make/Notion/Telegram',
          kpis: ['Lead Quality Score ≥ 8/10', 'Processing Time -70%']
        },
        {
          id: 'M11',
          name: 'Funnel Nota Doi',
          description: 'Lead→Quiz→VIP→Curs conversion system',
          kpis: ['Funnel CR ≥ 12%', 'LTV +35%']
        },
        {
          id: 'M14',
          name: 'Authority Content→Commerce',
          description: 'Pilon editorial conectat la ofertă',
          kpis: ['Content-to-Sale Rate ≥ 8%', 'Authority Score +40%']
        },
        {
          id: 'M18',
          name: 'Carusele RFA',
          description: 'Copertă→Lamă→Verdict social media system',
          kpis: ['Engagement Rate ≥ 15%', 'Share Rate ≥ 5%']
        }
      ],
      price: {
        single: 299,
        team: 899,
        enterprise: 2499
      },
      kpis: [
        'Reply Rate ≥ 25%',
        'SQL% ≥ 15%',
        'Conversion Rate Uplift ≥ +15%',
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
        'KPI Templates & Dashboard JSON',
        '3 Validated Case Studies with Hash',
        'Output Templates (JSON/MD/PDF)',
        'Guardrails & License Documentation',
        'Export Bundle (.zip) with Manifest',
        'Checksum Verification'
      ],
      caseStudies: [
        {
          id: 1,
          title: 'SaaS Startup B2B',
          industry: 'Software',
          results: {
            'Reply Rate': { before: '18%', after: '28%', uplift: '+55%' },
            'SQL%': { before: '12%', after: '17%', uplift: '+42%' },
            'CR': { before: '2.8%', after: '3.3%', uplift: '+18%' }
          },
          hash: 'pf_9b17a4c2',
          timestamp: '2025-08-24T10:00:00Z'
        },
        {
          id: 2,
          title: 'E-commerce Agency',
          industry: 'Marketing',
          results: {
            'Lead Quality': { before: '6.2/10', after: '8.4/10', uplift: '+35%' },
            'CAC': { before: '$127', after: '$89', uplift: '-30%' },
            'LTV': { before: '$890', after: '$1,203', uplift: '+35%' }
          },
          hash: 'pf_7c23d1a9',
          timestamp: '2025-08-20T14:30:00Z'
        },
        {
          id: 3,
          title: 'Consulting Firm',
          industry: 'Professional Services',
          results: {
            'Proposal Win Rate': { before: '23%', after: '34%', uplift: '+48%' },
            'Sales Cycle': { before: '45 days', after: '28 days', uplift: '-38%' },
            'Revenue per Client': { before: '$12K', after: '$18K', uplift: '+50%' }
          },
          hash: 'pf_5a89f3e1',
          timestamp: '2025-08-18T09:15:00Z'
        }
      ],
      rating: 4.9,
      reviews: 127,
      difficulty: 'Intermediate',
      timeToValue: '30 days',
      minPlan: 'Creator',
      popular: true,
      cover: '/api/placeholder/800/400',
      gallery: [
        '/api/placeholder/600/400',
        '/api/placeholder/600/400',
        '/api/placeholder/600/400'
      ]
    }
  }

  const item = itemData[id]

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
          <Button onClick={() => navigate('/shop')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </div>
    )
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

  const handlePurchase = () => {
    // Integrate with Stripe here
    const purchaseData = {
      itemId: item.id,
      itemName: item.name,
      plan: selectedPlan,
      price: item.price[selectedPlan],
      quantity: quantity,
      total: item.price[selectedPlan] * quantity
    }
    
    // Redirect to Stripe Checkout or open payment modal
    console.log('Purchase data:', purchaseData)
    // window.location.href = `/api/stripe/checkout?item=${item.id}&plan=${selectedPlan}&qty=${quantity}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{item.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={item.cover} 
                alt={item.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {item.popular && (
                <Badge className="absolute top-4 left-4 badge-primary">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
            
            {item.gallery && (
              <div className="grid grid-cols-3 gap-2">
                {item.gallery.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${item.name} ${index + 1}`}
                    className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getDifficultyColor(item.difficulty)}>
                  {item.difficulty}
                </Badge>
                <Badge className={getPlanColor(item.minPlan)}>
                  {item.minPlan}+ Required
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{item.tagline}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="font-medium">{item.rating}</span>
                  <span className="text-muted-foreground ml-1">({item.reviews} reviews)</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {item.timeToValue} to value
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Layers className="w-4 h-4 mr-1" />
                  {item.modules?.length || 1} modules
                </div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>

            {/* Pricing */}
            <Card className="card-industrial p-6">
              <h3 className="font-bold mb-4">Choose Your Plan</h3>
              
              <div className="space-y-3 mb-6">
                {Object.entries(item.price).map(([plan, price]) => (
                  <div 
                    key={plan}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPlan === plan 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium capitalize">{plan} License</div>
                        <div className="text-sm text-muted-foreground">
                          {plan === 'single' && 'Individual use only'}
                          {plan === 'team' && 'Up to 5 team members'}
                          {plan === 'enterprise' && 'Unlimited team + white-label'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${price}</div>
                        {plan === 'team' && <div className="text-sm text-muted-foreground">$180/seat</div>}
                        {plan === 'enterprise' && <div className="text-sm text-muted-foreground">Custom support</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border border-border rounded">
                  <button 
                    className="px-3 py-1 hover:bg-muted transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-border">{quantity}</span>
                  <button 
                    className="px-3 py-1 hover:bg-muted transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${(item.price[selectedPlan] * quantity).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full btn-primary"
                  size="lg"
                  onClick={handlePurchase}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Purchase Now
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Secure Payment
                </div>
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  Instant Download
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  30-day Guarantee
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-muted/30">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
              <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
              <TabsTrigger value="cases">Case Studies</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="card-industrial p-6">
                <h3 className="text-xl font-bold mb-4">About This Pack</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {item.longDescription}
                  </p>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="card-industrial p-6">
                  <h4 className="font-bold mb-4">Key Features</h4>
                  <div className="space-y-2">
                    {item.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="card-industrial p-6">
                  <h4 className="font-bold mb-4">What You Get</h4>
                  <div className="space-y-2">
                    {item.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center">
                        <Package className="w-4 h-4 text-primary mr-3" />
                        <span className="text-sm">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-6">
              <div className="grid gap-4">
                {item.modules?.map((module) => (
                  <Card key={module.id} className="card-industrial p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{module.id} - {module.name}</h4>
                        <p className="text-muted-foreground">{module.description}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/shop/module/${module.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {module.kpis.map((kpi, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          {kpi}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="kpis" className="space-y-6">
              <Card className="card-industrial p-6">
                <h3 className="text-xl font-bold mb-4">Target KPIs & Metrics</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {item.kpis.map((kpi, index) => (
                    <div key={index} className="flex items-center p-4 bg-muted/30 rounded-lg">
                      <Target className="w-6 h-6 text-green-500 mr-3" />
                      <span className="font-medium">{kpi}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="deliverables" className="space-y-6">
              <Card className="card-industrial p-6">
                <h3 className="text-xl font-bold mb-4">Complete Package Contents</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {item.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-start p-4 bg-muted/30 rounded-lg">
                      <FileText className="w-5 h-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium">{deliverable}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {deliverable.includes('Prompts') && 'Industrial-grade prompts with A/B variants'}
                          {deliverable.includes('Checklists') && 'Step-by-step implementation guides'}
                          {deliverable.includes('KPI') && 'JSON dashboards and tracking matrices'}
                          {deliverable.includes('Case Studies') && 'Real results with hash verification'}
                          {deliverable.includes('Templates') && 'Ready-to-use output formats'}
                          {deliverable.includes('Guardrails') && 'Ethics and compliance documentation'}
                          {deliverable.includes('Bundle') && 'Complete .zip package with manifest'}
                          {deliverable.includes('Checksum') && 'Integrity verification for all files'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="cases" className="space-y-6">
              <div className="grid gap-6">
                {item.caseStudies?.map((caseStudy) => (
                  <Card key={caseStudy.id} className="card-industrial p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{caseStudy.title}</h4>
                        <p className="text-muted-foreground">{caseStudy.industry}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Hash className="w-3 h-3 mr-1" />
                          {caseStudy.hash}
                        </div>
                        <div>{new Date(caseStudy.timestamp).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      {Object.entries(caseStudy.results).map(([metric, data]) => (
                        <div key={metric} className="p-4 bg-muted/30 rounded-lg">
                          <div className="font-medium text-sm text-muted-foreground mb-2">{metric}</div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Before: {data.before}</span>
                            <span>After: {data.after}</span>
                          </div>
                          <div className="text-center mt-2">
                            <Badge className="badge-primary">{data.uplift}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card className="card-industrial p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Customer Reviews</h3>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="font-bold">{item.rating}</span>
                    <span className="text-muted-foreground ml-1">({item.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Mock reviews */}
                  <div className="border-b border-border pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium ml-2">Sarah Chen</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-muted-foreground">
                      "Incredible results! Our reply rate went from 18% to 28% in just two weeks. The prompts are industrial-grade and the KPI tracking is spot-on."
                    </p>
                  </div>
                  
                  <div className="border-b border-border pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium ml-2">Mike Rodriguez</span>
                      </div>
                      <span className="text-sm text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-muted-foreground">
                      "Finally, a system that works. The implementation checklists made it easy to deploy across our team. ROI was positive within 30 days."
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ShopItemPage


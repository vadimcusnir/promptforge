"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Legend,
} from "recharts"
import {
  DollarSign,
  Users,
  ShoppingCart,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Key,
  RefreshCw,
  Download,
  ToggleLeft,
  ToggleRight,
  Edit,
  Eye,
  Plus,
  Send,
  BarChart3,
  TrendingDown,
  Activity,
} from "lucide-react"
import { withAuth } from "@/lib/auth"
import { CreditCard, Shield, Database, ExternalLink } from "lucide-react"

function AdminPage() {
  const [activeTab, setActiveTab] = useState("analytics")
  const [comingSoonEnabled, setComingSoonEnabled] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [campaignType, setCampaignType] = useState("email")
  const [funnelView, setFunnelView] = useState("overview")

  const revenueData = [
    { month: "Oct", revenue: 45200, orders: 89, users: 234 },
    { month: "Nov", revenue: 52800, orders: 103, users: 267 },
    { month: "Dec", revenue: 67400, orders: 134, users: 298 },
    { month: "Jan", revenue: 78900, orders: 156, users: 342 },
    { month: "Feb", revenue: 89200, orders: 178, users: 389 },
    { month: "Mar", revenue: 107400, orders: 261, users: 445 },
  ]

  const packPerformanceData = [
    { name: "Sales Accelerator", revenue: 63119, sales: 127, conversionRate: 8.4 },
    { name: "Creator Commerce", revenue: 26433, sales: 89, conversionRate: 6.2 },
    { name: "Edu Ops", revenue: 17865, sales: 45, conversionRate: 4.8 },
  ]

  const userGrowthData = [
    { week: "W1", newUsers: 23, activeUsers: 234, churnRate: 2.1 },
    { week: "W2", newUsers: 31, activeUsers: 267, churnRate: 1.8 },
    { week: "W3", newUsers: 28, activeUsers: 298, churnRate: 2.3 },
    { week: "W4", newUsers: 44, activeUsers: 342, churnRate: 1.5 },
  ]

  const systemMetricsData = [
    { time: "00:00", responseTime: 245, errorRate: 0.1, throughput: 1200 },
    { time: "04:00", responseTime: 198, errorRate: 0.0, throughput: 890 },
    { time: "08:00", responseTime: 312, errorRate: 0.2, throughput: 2100 },
    { time: "12:00", responseTime: 278, errorRate: 0.1, throughput: 2800 },
    { time: "16:00", responseTime: 334, errorRate: 0.3, throughput: 3200 },
    { time: "20:00", responseTime: 289, errorRate: 0.1, throughput: 2400 },
  ]

  const planDistributionData = [
    { name: "Free", value: 156, color: "#64748b" },
    { name: "Pro", value: 234, color: "#3b82f6" },
    { name: "Enterprise", value: 55, color: "#10b981" },
  ]

  const COLORS = ["#64748b", "#3b82f6", "#10b981", "#f59e0b"]

  const marketplacePacks = [
    {
      id: "sales-accelerator",
      name: "Sales Accelerator",
      modules: ["M06", "M03", "M22", "M11", "M14", "M18"],
      price: 497,
      sales: 127,
      revenue: 63119,
      status: "active",
      lastUpdated: "2024-01-15",
    },
    {
      id: "creator-commerce",
      name: "Creator Commerce",
      modules: ["M35", "M34", "M09"],
      price: 297,
      sales: 89,
      revenue: 26433,
      status: "active",
      lastUpdated: "2024-01-12",
    },
    {
      id: "edu-ops",
      name: "Edu Ops",
      modules: ["M47", "M21", "M10"],
      price: 397,
      sales: 45,
      revenue: 17865,
      status: "active",
      lastUpdated: "2024-01-10",
    },
  ]

  const recentOrders = [
    {
      id: "ord_2024_001",
      customer: "alex@techcorp.com",
      pack: "Sales Accelerator",
      amount: 497,
      status: "completed",
      date: "2024-01-20T10:30:00Z",
    },
    {
      id: "ord_2024_002",
      customer: "sarah@startup.io",
      pack: "Creator Commerce",
      amount: 297,
      status: "completed",
      date: "2024-01-19T15:45:00Z",
    },
    {
      id: "ord_2024_003",
      customer: "mike@university.edu",
      pack: "Edu Ops",
      amount: 397,
      status: "pending",
      date: "2024-01-19T09:15:00Z",
    },
  ]

  const adminKPIs = [
    {
      label: "Active Subscriptions",
      value: "247",
      status: "healthy",
      change: "+12",
      icon: CreditCard,
    },
    {
      label: "Marketplace Revenue",
      value: "$107.4K",
      status: "healthy",
      change: "+23%",
      icon: CreditCard,
    },
    {
      label: "Pack Sales (30d)",
      value: "261",
      status: "healthy",
      change: "+18",
      icon: Activity,
    },
    {
      label: "Entitlement Coverage",
      value: "94.2%",
      status: "healthy",
      change: "+2.1%",
      icon: Shield,
    },
    {
      label: "Export Integrity",
      value: "100%",
      status: "healthy",
      change: "All verified",
      icon: Database,
    },
  ]

  const members = [
    {
      name: "Alex Chen",
      email: "alex@company.com",
      role: "Owner",
      lastLogin: "2 min ago",
      status: "active",
    },
    {
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Admin",
      lastLogin: "1 hour ago",
      status: "active",
    },
    {
      name: "Mike Rodriguez",
      email: "mike@company.com",
      role: "Member",
      lastLogin: "2 days ago",
      status: "active",
    },
    {
      name: "Emma Wilson",
      email: "emma@company.com",
      role: "Member",
      lastLogin: "1 week ago",
      status: "inactive",
    },
  ]

  const apiKeys = [
    {
      name: "Production API",
      hash: "pk_live_51H...7Ks",
      created: "2024-01-15",
      lastUsed: "2 min ago",
      rateLimit: "1000/hour",
      status: "active",
    },
    {
      name: "Development API",
      hash: "pk_test_51H...9Mn",
      created: "2024-01-10",
      lastUsed: "1 hour ago",
      rateLimit: "100/hour",
      status: "active",
    },
    {
      name: "Legacy Integration",
      hash: "pk_live_51G...2Qp",
      created: "2023-12-01",
      lastUsed: "Never",
      rateLimit: "500/hour",
      status: "paused",
    },
  ]

  const entitlements = [
    { feature: "Generator Access", enabled: true, source: "Pro Plan" },
    { feature: "Real Test Engine", enabled: true, source: "Pro Plan" },
    { feature: "PDF Export", enabled: true, source: "Pro Plan" },
    { feature: "JSON Export", enabled: true, source: "Pro Plan" },
    { feature: "ZIP Export", enabled: true, source: "Pro Plan" },
    { feature: "API Access", enabled: true, source: "Enterprise Add-on" },
    { feature: "White-label", enabled: false, source: "Enterprise Plan" },
    { feature: "Custom Modules", enabled: false, source: "Enterprise Plan" },
  ]

  const systemStats = [
    { metric: "P95 Time-to-Artifact", value: "52s", target: "<60s", status: "healthy" },
    { metric: "Pass Rate", value: "94.2%", target: ">90%", status: "healthy" },
    { metric: "Error Budget", value: "99.8%", target: ">99.5%", status: "healthy" },
    { metric: "4xx Errors", value: "0.2%", target: "<1%", status: "healthy" },
    { metric: "5xx Errors", value: "0.1%", target: "<0.5%", status: "healthy" },
  ]

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Industrial Prompt Engineering",
      slug: "future-industrial-prompt-engineering",
      status: "published",
      author: "Alex Chen",
      publishDate: "2024-01-15",
      views: 2847,
      engagement: 8.4,
      excerpt: "Exploring how industrial-grade prompt engineering is transforming business operations...",
    },
    {
      id: 2,
      title: "7D Framework: Beyond Traditional Prompting",
      slug: "7d-framework-beyond-traditional-prompting",
      status: "draft",
      author: "Sarah Johnson",
      publishDate: null,
      views: 0,
      engagement: 0,
      excerpt: "Deep dive into the seven-dimensional parameter system that powers PromptForge...",
    },
    {
      id: 3,
      title: "Case Study: 300% ROI with Module M01",
      slug: "case-study-300-roi-module-m01",
      status: "scheduled",
      author: "Alex Chen",
      publishDate: "2024-01-20",
      views: 0,
      engagement: 0,
      excerpt: "How TechCorp achieved remarkable results using our SOPFORGE module...",
    },
  ]

  const salesCampaigns = [
    {
      id: 1,
      name: "Q1 Pro Plan Push",
      type: "email",
      status: "active",
      sent: 1247,
      opened: 523,
      clicked: 89,
      converted: 23,
      revenue: 18140,
      startDate: "2024-01-01",
      endDate: "2024-03-31",
    },
    {
      id: 2,
      name: "Creator Pack Launch",
      type: "social",
      status: "completed",
      sent: 2340,
      opened: 1456,
      clicked: 234,
      converted: 67,
      revenue: 19899,
      startDate: "2023-12-15",
      endDate: "2024-01-15",
    },
    {
      id: 3,
      name: "Enterprise Outreach",
      type: "direct",
      status: "draft",
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      startDate: "2024-02-01",
      endDate: "2024-02-29",
    },
  ]

  const funnelData = [
    { stage: "Visitors", users: 12450, conversion: 100, color: "#64748b" },
    { stage: "Sign Ups", users: 2847, conversion: 22.9, color: "#3b82f6" },
    { stage: "Trial Users", users: 1234, conversion: 43.4, color: "#8b5cf6" },
    { stage: "Paid Users", users: 445, conversion: 36.1, color: "#10b981" },
    { stage: "Enterprise", users: 55, conversion: 12.4, color: "#f59e0b" },
  ]

  const conversionFlowData = [
    { step: "Landing", users: 12450, dropoff: 0 },
    { step: "Sign Up", users: 2847, dropoff: 9603 },
    { step: "Onboarding", users: 2234, dropoff: 613 },
    { step: "First Use", users: 1567, dropoff: 667 },
    { step: "Paid Plan", users: 445, dropoff: 1122 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white font-mono mb-2">Admin Dashboard</h1>
          <p className="text-slate-400 font-mono">System governance and operational controls</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-700 p-1">
            <TabsTrigger value="analytics" className="font-mono">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="blog" className="font-mono">
              Blog Editor
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="font-mono">
              Sales Campaigns
            </TabsTrigger>
            <TabsTrigger value="funnel" className="font-mono">
              Funnel Analytics
            </TabsTrigger>
            <TabsTrigger value="members" className="font-mono">
              Members & Roles
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="font-mono">
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="billing" className="font-mono">
              Plans & Billing
            </TabsTrigger>
            <TabsTrigger value="system" className="font-mono">
              System
            </TabsTrigger>
            <TabsTrigger value="audit" className="font-mono">
              Audit
            </TabsTrigger>
          </TabsList>

          {/* ... existing analytics tab ... */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white font-mono text-sm flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-emerald-400" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white font-mono">$107.4K</div>
                  <div className="text-xs text-emerald-400 font-mono">+23% from last month</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white font-mono text-sm flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-400" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white font-mono">445</div>
                  <div className="text-xs text-blue-400 font-mono">+44 this week</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white font-mono text-sm flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2 text-purple-400" />
                    Pack Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white font-mono">261</div>
                  <div className="text-xs text-purple-400 font-mono">+18 this month</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white font-mono text-sm flex items-center">
                    <Target className="w-4 h-4 mr-2 text-yellow-400" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white font-mono">6.8%</div>
                  <div className="text-xs text-yellow-400 font-mono">+1.2% improvement</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white font-mono text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                    Revenue Growth
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-mono">
                    Monthly revenue, orders, and user growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenue ($)" />
                      <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white font-mono text-lg flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                    Pack Performance
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-mono">
                    Revenue and conversion rates by pack
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={packPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white font-mono text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-400" />
                    User Growth
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-mono">Weekly new user acquisition</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                      <Area type="monotone" dataKey="newUsers" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white font-mono text-lg flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-yellow-400" />
                    System Performance
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-mono">
                    Response times throughout the day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={systemMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                      <Line type="monotone" dataKey="responseTime" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white font-mono text-lg flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-emerald-400" />
                    Plan Distribution
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-mono">User distribution across plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={planDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {planDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Blog Posts List */}
              <div className="lg:col-span-1">
                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white font-mono">Blog Posts</CardTitle>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
                        <Plus className="w-4 h-4 mr-2" />
                        New Post
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {blogPosts.map((post) => (
                      <div
                        key={post.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedPost?.id === post.id
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                        }`}
                        onClick={() => setSelectedPost(post)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-mono text-sm font-bold line-clamp-2">{post.title}</h4>
                          <Badge
                            variant="outline"
                            className={`font-mono text-xs ml-2 ${
                              post.status === "published"
                                ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                                : post.status === "scheduled"
                                  ? "border-blue-400/30 text-blue-400 bg-blue-400/10"
                                  : "border-slate-400/30 text-slate-400 bg-slate-400/10"
                            }`}
                          >
                            {post.status}
                          </Badge>
                        </div>
                        <p className="text-slate-400 font-mono text-xs mb-2 line-clamp-2">{post.excerpt}</p>
                        <div className="flex justify-between text-xs font-mono text-slate-500">
                          <span>{post.author}</span>
                          <span>{post.publishDate || "Draft"}</span>
                        </div>
                        {post.status === "published" && (
                          <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
                            <span>{post.views} views</span>
                            <span>{post.engagement}% engagement</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Blog Editor */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white font-mono">
                        {selectedPost ? "Edit Post" : "Create New Post"}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
                          <Send className="w-4 h-4 mr-2" />
                          Publish
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300 font-mono">Title</Label>
                        <Input
                          placeholder="Enter post title..."
                          defaultValue={selectedPost?.title || ""}
                          className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 font-mono"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300 font-mono">Slug</Label>
                        <Input
                          placeholder="post-url-slug"
                          defaultValue={selectedPost?.slug || ""}
                          className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300 font-mono">Excerpt</Label>
                      <Textarea
                        placeholder="Brief description for SEO and social sharing..."
                        defaultValue={selectedPost?.excerpt || ""}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 font-mono"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300 font-mono">Content</Label>
                      <Textarea
                        placeholder="Write your blog post content here... (Markdown supported)"
                        defaultValue={selectedPost ? "# " + selectedPost.title + "\n\n" + selectedPost.excerpt : ""}
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 font-mono"
                        rows={12}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-300 font-mono">Status</Label>
                        <Select defaultValue={selectedPost?.status || "draft"}>
                          <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white font-mono">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300 font-mono">Author</Label>
                        <Select defaultValue={selectedPost?.author || "Alex Chen"}>
                          <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white font-mono">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="Alex Chen">Alex Chen</SelectItem>
                            <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300 font-mono">Publish Date</Label>
                        <Input
                          type="date"
                          defaultValue={selectedPost?.publishDate || ""}
                          className="bg-slate-800/50 border-slate-600 text-white font-mono"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Campaign List */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white font-mono">Sales Campaigns</CardTitle>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
                        <Plus className="w-4 h-4 mr-2" />
                        New Campaign
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {salesCampaigns.map((campaign) => (
                        <div key={campaign.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-white font-mono font-bold">{campaign.name}</h4>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="font-mono text-xs border-slate-600 text-slate-300">
                                  {campaign.type}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`font-mono text-xs ${
                                    campaign.status === "active"
                                      ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                                      : campaign.status === "completed"
                                        ? "border-blue-400/30 text-blue-400 bg-blue-400/10"
                                        : "border-slate-400/30 text-slate-400 bg-slate-400/10"
                                  }`}
                                >
                                  {campaign.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                              >
                                <BarChart3 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm font-mono">
                            <div>
                              <div className="text-slate-400">Sent</div>
                              <div className="text-white font-bold">{campaign.sent.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Opened</div>
                              <div className="text-white font-bold">
                                {campaign.opened.toLocaleString()}
                                <span className="text-blue-400 ml-1">
                                  ({campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : 0}%)
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-400">Clicked</div>
                              <div className="text-white font-bold">
                                {campaign.clicked.toLocaleString()}
                                <span className="text-purple-400 ml-1">
                                  ({campaign.opened > 0 ? ((campaign.clicked / campaign.opened) * 100).toFixed(1) : 0}%)
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-400">Converted</div>
                              <div className="text-white font-bold">
                                {campaign.converted.toLocaleString()}
                                <span className="text-emerald-400 ml-1">
                                  (
                                  {campaign.clicked > 0
                                    ? ((campaign.converted / campaign.clicked) * 100).toFixed(1)
                                    : 0}
                                  %)
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-400">Revenue</div>
                              <div className="text-white font-bold">${campaign.revenue.toLocaleString()}</div>
                            </div>
                          </div>

                          <div className="flex justify-between text-xs font-mono text-slate-500 mt-3">
                            <span>
                              {campaign.startDate} - {campaign.endDate}
                            </span>
                            <span>
                              ROI:{" "}
                              {campaign.revenue > 0 ? ((campaign.revenue / (campaign.sent * 0.1)) * 100).toFixed(0) : 0}
                              %
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign Creator */}
              <div className="lg:col-span-1">
                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Create Campaign</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300 font-mono">Campaign Name</Label>
                      <Input
                        placeholder="Q2 Enterprise Push"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 font-mono"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300 font-mono">Type</Label>
                      <Select value={campaignType} onValueChange={setCampaignType}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white font-mono">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="email">Email Campaign</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="direct">Direct Outreach</SelectItem>
                          <SelectItem value="content">Content Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-slate-300 font-mono">Start Date</Label>
                        <Input type="date" className="bg-slate-800/50 border-slate-600 text-white font-mono" />
                      </div>
                      <div>
                        <Label className="text-slate-300 font-mono">End Date</Label>
                        <Input type="date" className="bg-slate-800/50 border-slate-600 text-white font-mono" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300 font-mono">Target Audience</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white font-mono">
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="free-users">Free Plan Users</SelectItem>
                          <SelectItem value="trial-users">Trial Users</SelectItem>
                          <SelectItem value="pro-users">Pro Plan Users</SelectItem>
                          <SelectItem value="enterprise-leads">Enterprise Leads</SelectItem>
                          <SelectItem value="churned-users">Churned Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-slate-300 font-mono">Budget ($)</Label>
                      <Input
                        type="number"
                        placeholder="5000"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 font-mono"
                      />
                    </div>

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
                      Create Campaign
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Funnel Visualization */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white font-mono">Conversion Funnel</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={funnelView === "overview" ? "default" : "outline"}
                          onClick={() => setFunnelView("overview")}
                          className="font-mono"
                        >
                          Overview
                        </Button>
                        <Button
                          size="sm"
                          variant={funnelView === "detailed" ? "default" : "outline"}
                          onClick={() => setFunnelView("detailed")}
                          className="font-mono"
                        >
                          Detailed
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {funnelView === "overview" ? (
                      <div className="space-y-4">
                        {funnelData.map((stage, index) => (
                          <div key={stage.stage} className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-mono font-bold">{stage.stage}</span>
                              <div className="text-right">
                                <span className="text-white font-mono">{stage.users.toLocaleString()}</span>
                                <span className="text-slate-400 font-mono ml-2">({stage.conversion}%)</span>
                              </div>
                            </div>
                            <div className="relative h-12 bg-slate-800 rounded-lg overflow-hidden">
                              <div
                                className="h-full transition-all duration-500"
                                style={{
                                  width: `${stage.conversion}%`,
                                  backgroundColor: stage.color,
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-mono text-sm font-bold">
                                  {stage.users.toLocaleString()} users
                                </span>
                              </div>
                            </div>
                            {index < funnelData.length - 1 && (
                              <div className="flex justify-center my-2">
                                <TrendingDown className="w-4 h-4 text-slate-500" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={conversionFlowData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="step" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "1px solid #374151",
                                borderRadius: "8px",
                                color: "#fff",
                              }}
                            />
                            <Area type="monotone" dataKey="users" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                            <Area type="monotone" dataKey="dropoff" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Funnel Metrics */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                      <div className="text-slate-400 font-mono text-sm">Overall Conversion</div>
                      <div className="text-2xl font-bold text-white font-mono">3.6%</div>
                      <div className="text-emerald-400 font-mono text-xs">+0.4% vs last month</div>
                    </div>

                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                      <div className="text-slate-400 font-mono text-sm">Avg. Time to Convert</div>
                      <div className="text-2xl font-bold text-white font-mono">14.2d</div>
                      <div className="text-blue-400 font-mono text-xs">-2.1d vs last month</div>
                    </div>

                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                      <div className="text-slate-400 font-mono text-sm">Customer LTV</div>
                      <div className="text-2xl font-bold text-white font-mono">$2,847</div>
                      <div className="text-emerald-400 font-mono text-xs">+12% vs last month</div>
                    </div>

                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                      <div className="text-slate-400 font-mono text-sm">Churn Rate</div>
                      <div className="text-2xl font-bold text-white font-mono">1.8%</div>
                      <div className="text-emerald-400 font-mono text-xs">-0.3% vs last month</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-orange-900/20 border border-orange-600/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 font-mono text-sm font-bold">High Drop-off</span>
                      </div>
                      <p className="text-slate-300 font-mono text-xs">
                        67% users drop off at onboarding. Consider simplifying the flow.
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-900/20 border border-emerald-600/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-mono text-sm font-bold">Strong Retention</span>
                      </div>
                      <p className="text-slate-300 font-mono text-xs">Paid users show 88% retention after 30 days.</p>
                    </div>

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
                      <Activity className="w-4 h-4 mr-2" />
                      Run A/B Test
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Marketplace Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">Total Revenue</span>
                    <span className="text-white font-mono">$107,417</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">Active Packs</span>
                    <span className="text-white font-mono">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">Total Sales</span>
                    <span className="text-white font-mono">261</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">Avg Order Value</span>
                    <span className="text-white font-mono">$411</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {recentOrders.map((order, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600"
                    >
                      <div>
                        <div className="text-white font-mono text-sm">{order.customer}</div>
                        <div className="text-slate-400 font-mono text-xs">{order.pack}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-mono text-sm">${order.amount}</div>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs ${
                            order.status === "completed"
                              ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                              : "border-orange-400/30 text-orange-400 bg-orange-400/10"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-mono">Module Packs Management</h2>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Sales Data
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">Create New Pack</Button>
                </div>
              </div>

              <div className="space-y-4">
                {marketplacePacks.map((pack, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white font-mono">{pack.name}</h3>
                        <Badge
                          variant="outline"
                          className="border-emerald-400/30 text-emerald-400 bg-emerald-400/10 font-mono text-xs"
                        >
                          {pack.status}
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-300 font-mono text-xs">
                          {pack.modules.length} modules
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm font-mono text-slate-400">
                        <span>Modules: {pack.modules.join(", ")}</span>
                        <span>Price: ${pack.price}</span>
                        <span>Sales: {pack.sales}</span>
                        <span>Revenue: ${pack.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                      >
                        Edit Pack
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                      >
                        View Analytics
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-orange-600 text-orange-400 hover:bg-orange-900/20 font-mono bg-transparent"
                      >
                        {pack.status === "active" ? "Pause" : "Activate"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Members & Roles Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-mono">Members & Roles</h2>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>

              <div className="space-y-3">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white font-mono">{member.name}</h3>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs ${
                            member.role === "Owner"
                              ? "border-red-400/30 text-red-400 bg-red-400/10"
                              : member.role === "Admin"
                                ? "border-orange-400/30 text-orange-400 bg-orange-400/10"
                                : "border-slate-400/30 text-slate-400 bg-slate-400/10"
                          }`}
                        >
                          {member.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs ${
                            member.status === "active"
                              ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                              : "border-slate-400/30 text-slate-400 bg-slate-400/10"
                          }`}
                        >
                          {member.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm font-mono text-slate-400">
                        <span>{member.email}</span>
                        <span>Last login: {member.lastLogin}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                      >
                        Change Role
                      </Button>
                      {member.role !== "Owner" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-900/20 font-mono bg-transparent"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Plans & Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Current Plan</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">Plan</span>
                    <span className="text-white font-mono">Pro</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">Seats</span>
                    <span className="text-white font-mono">4/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">Renewal</span>
                    <span className="text-white font-mono">Feb 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">Status</span>
                    <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-400/30 font-mono">Active</Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono flex-1">
                    Upgrade Plan
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Webhook Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">Last Event</span>
                    <span className="text-white font-mono">2 min ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">Last Error</span>
                    <span className="text-slate-400 font-mono">None</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono">Status</span>
                    <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-400/30 font-mono">
                      Healthy
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reconcile
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Entitlements Tab */}
          <TabsContent value="entitlements" className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-mono">Entitlements & Feature Flags</h2>
                <Button
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Invalidate Cache
                </Button>
              </div>

              <div className="space-y-3">
                {entitlements.map((entitlement, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {entitlement.enabled ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-slate-500" />
                        )}
                        <span className="font-mono text-white">{entitlement.feature}</span>
                      </div>
                      <Badge variant="outline" className="border-slate-600 text-slate-300 font-mono text-xs">
                        {entitlement.source}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                    >
                      {entitlement.enabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-mono">API Keys</h2>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Postman Collection
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
                    <Key className="w-4 h-4 mr-2" />
                    Create Key
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {apiKeys.map((key, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white font-mono">{key.name}</h3>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs ${
                            key.status === "active"
                              ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                              : "border-orange-400/30 text-orange-400 bg-orange-400/10"
                          }`}
                        >
                          {key.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm font-mono text-slate-400">
                        <span>Key: {key.hash}</span>
                        <span>Created: {key.created}</span>
                        <span>Last Used: {key.lastUsed}</span>
                        <span>Rate Limit: {key.rateLimit}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                      >
                        Rotate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                      >
                        {key.status === "active" ? "Pause" : "Resume"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-900/20 font-mono bg-transparent"
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white font-mono mb-4">System Stats</h3>
                <div className="space-y-4">
                  {systemStats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="text-white font-mono">{stat.metric}</span>
                        <div className="text-xs text-slate-400 font-mono">Target: {stat.target}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-mono">{stat.value}</span>
                        <div
                          className={`text-xs font-mono ${
                            stat.status === "healthy" ? "text-emerald-400" : "text-orange-400"
                          }`}
                        >
                          {stat.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white font-mono mb-4">System Controls</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <div>
                      <span className="text-white font-mono">Coming Soon Mode</span>
                      <div className="text-xs text-slate-400 font-mono">Global access gate</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                      onClick={() => setComingSoonEnabled(!comingSoonEnabled)}
                    >
                      {comingSoonEnabled ? (
                        <ToggleRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <div>
                      <span className="text-white font-mono">Maintenance Mode</span>
                      <div className="text-xs text-slate-400 font-mono">Read-only access</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                    >
                      <ToggleLeft className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white font-mono mb-4">Ruleset & Versions</h3>
              <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                <div>
                  <span className="text-white font-mono">Current Version: v4.2.1</span>
                  <div className="text-xs text-slate-400 font-mono">
                    Score threshold: ≥80 • Enum validation: enabled
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                  >
                    Rollback
                  </Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
                    Promote
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-mono">Exports & Audit</h2>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Audit CSV
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
                  >
                    Run Compliance Check
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                  <h4 className="font-bold text-white font-mono mb-3">Legal & Compliance</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Terms of Service</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Privacy Policy</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cookie Banner</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">DLP/PII Checks</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                  <h4 className="font-bold text-white font-mono mb-3">Recent Incidents</h4>
                  <div className="text-center py-8">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-slate-400 font-mono text-sm">No incidents in the last 7 days</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default withAuth(AdminPage, "admin:*")

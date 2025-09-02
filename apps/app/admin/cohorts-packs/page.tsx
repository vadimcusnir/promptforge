"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Download,
  RefreshCw,
  Search,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  GraduationCap,
  ShoppingCart,
} from "lucide-react"

interface CohortMetrics {
  overall_conversion_rate: number
  avg_ltv: number
  avg_upgrade_velocity_days: number
  retention_30d: number
  retention_90d: number
  cohorts: Array<{
    month: string
    channel: string
    users_acquired: number
    converted: number
    conversion_rate: number
    ltv: number
    retention_30d: number
    retention_90d: number
  }>
  conversion_funnel: Array<{
    stage: string
    users: number
    conversion_rate: number
    drop_off: number
  }>
  user_journeys: Array<{
    user_id: string
    acquisition_date: string
    channel: string
    days_to_convert: number
    conversion_trigger: string
    current_plan: string
    ltv: number
  }>
  churn_reasons: Array<{
    reason: string
    count: number
    percentage: number
  }>
}

interface IndustryPackMetrics {
  total_packs_sold: number
  avg_revenue_per_pack: number
  overall_adoption_rate: number
  cross_sell_success_rate: number
  packs: Array<{
    name: string
    type: "FinTech" | "E-Comm" | "Edu"
    adoption_rate: number
    revenue: number
    active_orgs: number
    avg_utilization: number
    top_modules: string[]
  }>
  pack_performance: Array<{
    pack_name: string
    org_size: "small" | "medium" | "large"
    adoption_rate: number
    revenue_per_org: number
    utilization_rate: number
    roi_score: number
  }>
  usage_patterns: Array<{
    pack_type: string
    module_id: string
    usage_count: number
    success_rate: number
    avg_score: number
  }>
}

export default function CohortsPacksPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [cohortMetrics, setCohortMetrics] = useState<CohortMetrics | null>(null)
  const [packMetrics, setPackMetrics] = useState<IndustryPackMetrics | null>(null)
  const [timeRange, setTimeRange] = useState("12m")
  const [selectedChannel, setSelectedChannel] = useState("all")
  const [selectedPackType, setSelectedPackType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadMetrics()
  }, [timeRange, selectedChannel, selectedPackType])

  const loadMetrics = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCohortMetrics({
        overall_conversion_rate: 23.7,
        avg_ltv: 1247,
        avg_upgrade_velocity_days: 14,
        retention_30d: 78.4,
        retention_90d: 62.1,
        cohorts: [
          {
            month: "2024-01",
            channel: "organic",
            users_acquired: 1247,
            converted: 312,
            conversion_rate: 25.0,
            ltv: 1340,
            retention_30d: 82.1,
            retention_90d: 67.3,
          },
          {
            month: "2024-01",
            channel: "paid",
            users_acquired: 856,
            converted: 189,
            conversion_rate: 22.1,
            ltv: 1180,
            retention_30d: 75.2,
            retention_90d: 58.9,
          },
          {
            month: "2023-12",
            channel: "referral",
            users_acquired: 423,
            converted: 127,
            conversion_rate: 30.0,
            ltv: 1520,
            retention_30d: 85.6,
            retention_90d: 72.1,
          },
          {
            month: "2023-12",
            channel: "organic",
            users_acquired: 1089,
            converted: 245,
            conversion_rate: 22.5,
            ltv: 1290,
            retention_30d: 79.8,
            retention_90d: 64.2,
          },
          {
            month: "2023-11",
            channel: "content",
            users_acquired: 634,
            converted: 165,
            conversion_rate: 26.0,
            ltv: 1410,
            retention_30d: 81.3,
            retention_90d: 69.7,
          },
        ],
        conversion_funnel: [
          { stage: "Signup", users: 10000, conversion_rate: 100, drop_off: 0 },
          { stage: "First Login", users: 8500, conversion_rate: 85, drop_off: 15 },
          { stage: "First Generation", users: 6800, conversion_rate: 68, drop_off: 17 },
          { stage: "First Export", users: 4760, conversion_rate: 47.6, drop_off: 20.4 },
          { stage: "Paid Conversion", users: 2380, conversion_rate: 23.8, drop_off: 23.8 },
        ],
        user_journeys: [
          {
            user_id: "usr_001",
            acquisition_date: "2024-01-15",
            channel: "organic",
            days_to_convert: 7,
            conversion_trigger: "Export limit reached",
            current_plan: "creator",
            ltv: 1450,
          },
          {
            user_id: "usr_002",
            acquisition_date: "2024-01-14",
            channel: "paid",
            days_to_convert: 21,
            conversion_trigger: "Advanced module needed",
            current_plan: "pro",
            ltv: 2340,
          },
          {
            user_id: "usr_003",
            acquisition_date: "2024-01-13",
            channel: "referral",
            days_to_convert: 3,
            conversion_trigger: "Referrer recommendation",
            current_plan: "creator",
            ltv: 890,
          },
        ],
        churn_reasons: [
          { reason: "Price too high", count: 45, percentage: 32.1 },
          { reason: "Limited features needed", count: 38, percentage: 27.1 },
          { reason: "Found alternative", count: 23, percentage: 16.4 },
          { reason: "Technical issues", count: 18, percentage: 12.9 },
          { reason: "Other", count: 16, percentage: 11.4 },
        ],
      })

      setPackMetrics({
        total_packs_sold: 342,
        avg_revenue_per_pack: 2890,
        overall_adoption_rate: 34.7,
        cross_sell_success_rate: 67.8,
        packs: [
          {
            name: "FinTech Accelerator",
            type: "FinTech",
            adoption_rate: 42.3,
            revenue: 456780,
            active_orgs: 89,
            avg_utilization: 78.4,
            top_modules: ["M07", "M12", "M25"],
          },
          {
            name: "E-Commerce Optimizer",
            type: "E-Comm",
            adoption_rate: 38.9,
            revenue: 387650,
            active_orgs: 76,
            avg_utilization: 82.1,
            top_modules: ["M10", "M18", "M35"],
          },
          {
            name: "Education Suite",
            type: "Edu",
            adoption_rate: 29.1,
            revenue: 234560,
            active_orgs: 54,
            avg_utilization: 71.3,
            top_modules: ["M01", "M11", "M25"],
          },
        ],
        pack_performance: [
          {
            pack_name: "FinTech Accelerator",
            org_size: "large",
            adoption_rate: 67.8,
            revenue_per_org: 8900,
            utilization_rate: 89.2,
            roi_score: 94,
          },
          {
            pack_name: "E-Commerce Optimizer",
            org_size: "medium",
            adoption_rate: 45.2,
            revenue_per_org: 4560,
            utilization_rate: 76.8,
            roi_score: 87,
          },
          {
            pack_name: "Education Suite",
            org_size: "small",
            adoption_rate: 23.4,
            revenue_per_org: 1890,
            utilization_rate: 68.9,
            roi_score: 78,
          },
        ],
        usage_patterns: [
          { pack_type: "FinTech", module_id: "M07", usage_count: 1247, success_rate: 89.3, avg_score: 87.2 },
          { pack_type: "FinTech", module_id: "M12", usage_count: 1089, success_rate: 91.7, avg_score: 89.1 },
          { pack_type: "E-Comm", module_id: "M10", usage_count: 1456, success_rate: 85.4, avg_score: 84.7 },
          { pack_type: "E-Comm", module_id: "M18", usage_count: 1234, success_rate: 88.9, avg_score: 86.3 },
          { pack_type: "Edu", module_id: "M01", usage_count: 987, success_rate: 82.1, avg_score: 81.9 },
        ],
      })
    } catch (error) {
      toast({
        title: "Failed to Load Metrics",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportAnalytics = async (type: "cohorts" | "packs", format: "csv" | "pdf") => {
    try {
      // Simulate export
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Export Complete",
        description: `${type} analytics exported as ${format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05010A] text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#CDA434]" />
              <p className="text-gray-400">Loading cohort and pack analytics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05010A] text-white p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Cohort Analysis & Industry Pack Analytics</h1>
            <p className="text-gray-400">Track user conversion journeys and industry pack performance</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => exportAnalytics("cohorts", "csv")}
              className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Cohorts
            </Button>
            <Button
              variant="outline"
              onClick={() => exportAnalytics("packs", "pdf")}
              className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Packs
            </Button>
            <Button onClick={loadMetrics} className="bg-[#CDA434] text-black hover:bg-[#8B7355]">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-black/50 border-gray-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-400 mb-2 block">Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="bg-black/50 border-gray-700 focus:ring-[#00FF7F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m">Last 3 months</SelectItem>
                    <SelectItem value="6m">Last 6 months</SelectItem>
                    <SelectItem value="12m">Last 12 months</SelectItem>
                    <SelectItem value="24m">Last 24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-400 mb-2 block">Channel</Label>
                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                  <SelectTrigger className="bg-black/50 border-gray-700 focus:ring-[#00FF7F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-400 mb-2 block">Pack Type</Label>
                <Select value={selectedPackType} onValueChange={setSelectedPackType}>
                  <SelectTrigger className="bg-black/50 border-gray-700 focus:ring-[#00FF7F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pack Types</SelectItem>
                    <SelectItem value="fintech">FinTech</SelectItem>
                    <SelectItem value="ecomm">E-Commerce</SelectItem>
                    <SelectItem value="edu">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-400 mb-2 block">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search cohorts, packs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/50 border-gray-700 focus:ring-[#00FF7F]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="cohorts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-black/50">
            <TabsTrigger value="cohorts" className="data-[state=active]:bg-[#CDA434] data-[state=active]:text-black">
              <Users className="w-4 h-4 mr-2" />
              Cohort Analysis
            </TabsTrigger>
            <TabsTrigger
              value="industry-packs"
              className="data-[state=active]:bg-[#CDA434] data-[state=active]:text-black"
            >
              <Package className="w-4 h-4 mr-2" />
              Industry Packs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cohorts" className="space-y-6">
            {/* Cohort Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Conversion Rate</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{cohortMetrics?.overall_conversion_rate}%</p>
                    </div>
                    <Target className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">+2.3%</span>
                    <span className="text-gray-400 ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Avg LTV</p>
                      <p className="text-2xl font-bold text-[#CDA434]">${cohortMetrics?.avg_ltv}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">+$127</span>
                    <span className="text-gray-400 ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Upgrade Velocity</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{cohortMetrics?.avg_upgrade_velocity_days}d</p>
                    </div>
                    <Zap className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowDownRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">-2 days</span>
                    <span className="text-gray-400 ml-1">faster</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">30d Retention</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{cohortMetrics?.retention_30d}%</p>
                    </div>
                    <Users className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#CDA434] h-2 rounded-full"
                        style={{ width: `${cohortMetrics?.retention_30d}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">90d Retention</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{cohortMetrics?.retention_90d}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#CDA434] h-2 rounded-full"
                        style={{ width: `${cohortMetrics?.retention_90d}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cohort Performance Table */}
            <Card className="bg-black/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#CDA434]">Cohort Performance by Channel</CardTitle>
                <CardDescription>Monthly cohorts with conversion and retention metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-3 text-sm text-gray-400">Month</th>
                        <th className="text-left p-3 text-sm text-gray-400">Channel</th>
                        <th className="text-right p-3 text-sm text-gray-400">Acquired</th>
                        <th className="text-right p-3 text-sm text-gray-400">Converted</th>
                        <th className="text-right p-3 text-sm text-gray-400">Conv. Rate</th>
                        <th className="text-right p-3 text-sm text-gray-400">LTV</th>
                        <th className="text-right p-3 text-sm text-gray-400">30d Ret.</th>
                        <th className="text-right p-3 text-sm text-gray-400">90d Ret.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohortMetrics?.cohorts.map((cohort, index) => (
                        <tr key={index} className="border-b border-gray-800 hover:bg-black/30">
                          <td className="p-3 text-sm text-white">{cohort.month}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {cohort.channel}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-right text-white">
                            {cohort.users_acquired.toLocaleString()}
                          </td>
                          <td className="p-3 text-sm text-right text-white">{cohort.converted}</td>
                          <td className="p-3 text-sm text-right">
                            <span
                              className={`font-medium ${cohort.conversion_rate > 25 ? "text-green-400" : cohort.conversion_rate > 20 ? "text-[#CDA434]" : "text-orange-400"}`}
                            >
                              {cohort.conversion_rate}%
                            </span>
                          </td>
                          <td className="p-3 text-sm text-right text-[#CDA434] font-medium">${cohort.ltv}</td>
                          <td className="p-3 text-sm text-right text-white">{cohort.retention_30d}%</td>
                          <td className="p-3 text-sm text-right text-white">{cohort.retention_90d}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Conversion Funnel & User Journeys */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-[#CDA434] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Conversion Funnel
                  </CardTitle>
                  <CardDescription>User progression through conversion stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cohortMetrics?.conversion_funnel.map((stage, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">{stage.stage}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#CDA434] font-medium">{stage.conversion_rate}%</span>
                            <span className="text-xs text-gray-400">({stage.users.toLocaleString()})</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-[#CDA434] h-3 rounded-full transition-all duration-300"
                            style={{ width: `${stage.conversion_rate}%` }}
                          ></div>
                        </div>
                        {stage.drop_off > 0 && (
                          <div className="text-xs text-red-400 mt-1">-{stage.drop_off}% drop-off</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Recent User Journeys
                  </CardTitle>
                  <CardDescription>Individual conversion paths and triggers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cohortMetrics?.user_journeys.map((journey) => (
                      <div key={journey.user_id} className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-white">{journey.user_id}</span>
                          <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                            {journey.current_plan}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-300 mb-1">
                          {journey.channel} → {journey.days_to_convert} days → {journey.conversion_trigger}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Acquired: {new Date(journey.acquisition_date).toLocaleDateString()}</span>
                          <span className="text-[#CDA434] font-medium">LTV: ${journey.ltv}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Churn Reasons */}
            <Card className="bg-black/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Churn Reasons Analysis
                </CardTitle>
                <CardDescription>Why users are leaving and how to improve retention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {cohortMetrics?.churn_reasons.map((reason, index) => (
                    <div key={index} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400 mb-1">{reason.percentage}%</div>
                        <div className="text-sm text-white mb-2">{reason.reason}</div>
                        <div className="text-xs text-gray-400">{reason.count} users</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="industry-packs" className="space-y-6">
            {/* Industry Pack Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Packs Sold</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{packMetrics?.total_packs_sold}</p>
                    </div>
                    <Package className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">+23</span>
                    <span className="text-gray-400 ml-1">this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Avg Revenue/Pack</p>
                      <p className="text-2xl font-bold text-[#CDA434]">${packMetrics?.avg_revenue_per_pack}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">+$340</span>
                    <span className="text-gray-400 ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Adoption Rate</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{packMetrics?.overall_adoption_rate}%</p>
                    </div>
                    <Target className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#CDA434] h-2 rounded-full"
                        style={{ width: `${packMetrics?.overall_adoption_rate}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Cross-sell Success</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{packMetrics?.cross_sell_success_rate}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-green-400">Target: ≥60%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Industry Pack Performance */}
            <Card className="bg-black/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#CDA434]">Industry Pack Performance</CardTitle>
                <CardDescription>Revenue, adoption, and utilization by pack type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packMetrics?.packs.map((pack, index) => (
                    <div key={index} className="p-4 bg-black/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {pack.type === "FinTech" && <Briefcase className="w-5 h-5 text-blue-400" />}
                          {pack.type === "E-Comm" && <ShoppingCart className="w-5 h-5 text-green-400" />}
                          {pack.type === "Edu" && <GraduationCap className="w-5 h-5 text-purple-400" />}
                          <div>
                            <h3 className="font-medium text-white">{pack.name}</h3>
                            <p className="text-sm text-gray-400">{pack.active_orgs} active organizations</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            pack.type === "FinTech"
                              ? "text-blue-400 border-blue-400"
                              : pack.type === "E-Comm"
                                ? "text-green-400 border-green-400"
                                : "text-purple-400 border-purple-400"
                          }`}
                        >
                          {pack.type}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#CDA434]">{pack.adoption_rate}%</div>
                          <div className="text-gray-400">Adoption Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#CDA434]">${pack.revenue.toLocaleString()}</div>
                          <div className="text-gray-400">Revenue</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#CDA434]">{pack.avg_utilization}%</div>
                          <div className="text-gray-400">Utilization</div>
                        </div>
                        <div className="text-center">
                          <div className="flex gap-1 justify-center">
                            {pack.top_modules.map((module, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {module}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-gray-400">Top Modules</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pack Performance by Org Size */}
            <Card className="bg-black/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance by Organization Size
                </CardTitle>
                <CardDescription>How different org sizes adopt and utilize industry packs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-3 text-sm text-gray-400">Pack Name</th>
                        <th className="text-left p-3 text-sm text-gray-400">Org Size</th>
                        <th className="text-right p-3 text-sm text-gray-400">Adoption Rate</th>
                        <th className="text-right p-3 text-sm text-gray-400">Revenue/Org</th>
                        <th className="text-right p-3 text-sm text-gray-400">Utilization</th>
                        <th className="text-right p-3 text-sm text-gray-400">ROI Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packMetrics?.pack_performance.map((perf, index) => (
                        <tr key={index} className="border-b border-gray-800 hover:bg-black/30">
                          <td className="p-3 text-sm text-white">{perf.pack_name}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs capitalize">
                              {perf.org_size}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-right">
                            <span
                              className={`font-medium ${perf.adoption_rate > 50 ? "text-green-400" : perf.adoption_rate > 30 ? "text-[#CDA434]" : "text-orange-400"}`}
                            >
                              {perf.adoption_rate}%
                            </span>
                          </td>
                          <td className="p-3 text-sm text-right text-[#CDA434] font-medium">
                            ${perf.revenue_per_org.toLocaleString()}
                          </td>
                          <td className="p-3 text-sm text-right text-white">{perf.utilization_rate}%</td>
                          <td className="p-3 text-sm text-right">
                            <span
                              className={`font-medium ${perf.roi_score > 90 ? "text-green-400" : perf.roi_score > 80 ? "text-[#CDA434]" : "text-orange-400"}`}
                            >
                              {perf.roi_score}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Usage Patterns */}
            <Card className="bg-black/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Module Usage Patterns by Pack Type
                </CardTitle>
                <CardDescription>Most popular modules within each industry pack</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {packMetrics?.usage_patterns.map((pattern, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-purple-400 border-purple-400 text-xs">
                          {pattern.pack_type}
                        </Badge>
                        <span className="font-mono text-sm text-white">{pattern.module_id}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-[#CDA434] font-medium">{pattern.usage_count.toLocaleString()}</div>
                          <div className="text-gray-400 text-xs">Uses</div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`font-medium ${pattern.success_rate > 85 ? "text-green-400" : "text-orange-400"}`}
                          >
                            {pattern.success_rate}%
                          </div>
                          <div className="text-gray-400 text-xs">Success</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[#CDA434] font-medium">{pattern.avg_score}</div>
                          <div className="text-gray-400 text-xs">Avg Score</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

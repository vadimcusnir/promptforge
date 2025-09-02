"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  CheckCircle,
  AlertTriangle,
  Download,
  BarChart3,
  PieChart,
  FileText,
  Users,
} from "lucide-react"

const mockData = {
  mrr: { current: 12450, previous: 11100, change: 12.2 },
  conversionRate: { current: 3.2, previous: 3.5, change: -8.6 },
  churnRate: { current: 2.1, previous: 2.8, change: -25.0 },
  arpu: { current: 47, previous: 42, change: 11.9 },
  paybackMonths: { current: 3.2, previous: 3.8, change: -15.8 },
  runs24h: 1247,
  runs7d: 8934,
  runs30d: 34567,
  exports: {
    txt: 1234,
    md: 2345,
    pdf: 567,
    json: 890,
    zip: 123,
  },
  passRate: 87.3,
  ttv: 4.2,
  wau: 2847,
  mau: 8934,
  uptime: 99.97,
  checkoutSuccess: 94.2,
  exportIntegrity: 99.1,
  openIncidents: 2,
  closedIncidents7d: 8,
  heavyUsers: [
    { name: "TechCorp Inc", runs: 2847, plan: "Enterprise", lastActive: "2 min ago" },
    { name: "StartupXYZ", runs: 1923, plan: "Pro", lastActive: "15 min ago" },
    { name: "AgencyABC", runs: 1456, plan: "Pro", lastActive: "1 hour ago" },
    { name: "ConsultingDEF", runs: 1234, plan: "Creator", lastActive: "3 hours ago" },
    { name: "FreelancerGHI", runs: 987, plan: "Pro", lastActive: "5 hours ago" },
  ],
  errors24h: [
    { time: "14:32", error: "Rate limit exceeded", count: 23, severity: "medium" },
    { time: "12:15", error: "Export timeout", count: 8, severity: "high" },
    { time: "09:45", error: "Authentication failed", count: 45, severity: "low" },
    { time: "08:20", error: "Module not found", count: 12, severity: "medium" },
    { time: "06:10", error: "Database connection", count: 3, severity: "high" },
  ],
}

const chartData = {
  runsDaily: [
    { date: "2024-01-01", runs: 1200 },
    { date: "2024-01-02", runs: 1350 },
    { date: "2024-01-03", runs: 1100 },
    { date: "2024-01-04", runs: 1450 },
    { date: "2024-01-05", runs: 1600 },
    { date: "2024-01-06", runs: 1300 },
    { date: "2024-01-07", runs: 1247 },
  ],
  passRateTrend: [
    { date: "Week 1", rate: 85.2 },
    { date: "Week 2", rate: 86.1 },
    { date: "Week 3", rate: 84.8 },
    { date: "Week 4", rate: 87.3 },
  ],
  topModules: [
    { name: "Strategic Framework", runs: 2345, percentage: 34 },
    { name: "Content Engine", runs: 1890, percentage: 27 },
    { name: "Crisis Management", runs: 1567, percentage: 23 },
    { name: "Market Analysis", runs: 1234, percentage: 18 },
    { name: "Product Launch", runs: 987, percentage: 14 },
  ],
}

export default function AdminStatistici() {
  const [dateRange, setDateRange] = useState("30d")
  const [planFilter, setPlanFilter] = useState("all")
  const [orgFilter, setOrgFilter] = useState("all")
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    // Track admin view
    if (typeof window !== "undefined") {
      console.log("[v0] Admin statistics view tracked", { dateRange, planFilter, orgFilter })
    }
  }, [dateRange, planFilter, orgFilter])

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatChange = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-400" : "text-red-400"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const handleExport = async (format: "csv" | "pdf") => {
    setIsExporting(true)
    try {
      console.log("[v0] Exporting statistics data", { format, filters: { dateRange, planFilter, orgFilter } })
      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (format === "csv") {
        // Generate CSV data
        const csvData = `Date Range,${dateRange}\nPlan Filter,${planFilter}\nOrg Filter,${orgFilter}\n\nMRR,$${mockData.mrr.current}\nConversion Rate,${mockData.conversionRate.current}%\nChurn Rate,${mockData.churnRate.current}%`
        const blob = new Blob([csvData], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `statistics-${dateRange}.csv`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        // For PDF, would integrate with a PDF library
        alert("PDF export functionality would be implemented with a PDF library")
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#CDA434] mb-2">Statistics Dashboard</h1>
          <p className="text-gray-400">Comprehensive analytics and performance metrics</p>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          <Select value={orgFilter} onValueChange={setOrgFilter}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Orgs</SelectItem>
              <SelectItem value="promptforge">PromptForge</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => handleExport("csv")}
            disabled={isExporting}
            className="bg-[#CDA434] text-black hover:bg-[#CDA434]/80 focus:ring-2 focus:ring-[#00FF7F]"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>

          <Button
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
            variant="outline"
            className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black focus:ring-2 focus:ring-[#00FF7F]"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Business Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-[#CDA434] mb-4">Business Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">MRR</CardTitle>
              <DollarSign className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(mockData.mrr.current)}</div>
              <p className={`text-xs ${getChangeColor(mockData.mrr.change)}`}>
                {formatChange(mockData.mrr.change)} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Free→Paid %</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(mockData.conversionRate.current)}</div>
              <p className={`text-xs ${getChangeColor(mockData.conversionRate.change)}`}>
                {formatChange(mockData.conversionRate.change)} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Churn %</CardTitle>
              <TrendingDown className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(mockData.churnRate.current)}</div>
              <p className={`text-xs ${getChangeColor(mockData.churnRate.change)}`}>
                {formatChange(mockData.churnRate.change)} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">ARPU</CardTitle>
              <DollarSign className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(mockData.arpu.current)}</div>
              <p className={`text-xs ${getChangeColor(mockData.arpu.change)}`}>
                {formatChange(mockData.arpu.change)} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Payback</CardTitle>
              <Calendar className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mockData.paybackMonths.current} mo</div>
              <p className={`text-xs ${getChangeColor(mockData.paybackMonths.change)}`}>
                {formatChange(mockData.paybackMonths.change)} from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-[#CDA434] mb-4">Product Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-300">Runs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">24h:</span>
                <span className="text-sm font-medium text-white">{mockData.runs24h.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">7d:</span>
                <span className="text-sm font-medium text-white">{mockData.runs7d.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">30d:</span>
                <span className="text-sm font-medium text-white">{mockData.runs30d.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-300">Exports by Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(mockData.exports).map(([format, count]) => (
                <div key={format} className="flex justify-between">
                  <span className="text-xs text-gray-400 uppercase">{format}:</span>
                  <span className="text-sm font-medium text-white">{count.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pass Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(mockData.passRate)}</div>
              <p className="text-xs text-gray-400">Target: ≥80%</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-300">User Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">TTV:</span>
                <span className="text-sm font-medium text-white">{mockData.ttv} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">WAU:</span>
                <span className="text-sm font-medium text-white">{mockData.wau.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">MAU:</span>
                <span className="text-sm font-medium text-white">{mockData.mau.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Operations Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-[#CDA434] mb-4">Operations Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Uptime</CardTitle>
              <Activity className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(mockData.uptime)}</div>
              <p className="text-xs text-green-400">Target: ≥99.9%</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Checkout Success</CardTitle>
              <CheckCircle className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(mockData.checkoutSuccess)}</div>
              <p className="text-xs text-yellow-400">Below 95% target</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Export Integrity</CardTitle>
              <Download className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(mockData.exportIntegrity)}</div>
              <p className="text-xs text-green-400">Excellent</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Incidents (7d)</CardTitle>
              <AlertTriangle className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mockData.openIncidents}</div>
              <p className="text-xs text-gray-400">{mockData.closedIncidents7d} resolved</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Daily Runs (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.runsDaily.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="bg-[#CDA434] w-full rounded-t" style={{ height: `${(day.runs / 1600) * 200}px` }} />
                  <span className="text-xs text-gray-400 mt-2">{new Date(day.date).getDate()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Pass-Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-4">
              {chartData.passRateTrend.map((week, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="bg-green-500 w-full rounded-t" style={{ height: `${(week.rate / 100) * 200}px` }} />
                  <span className="text-xs text-gray-400 mt-2">{week.date}</span>
                  <span className="text-xs text-white">{week.rate}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Export Formats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(mockData.exports).map(([format, count], index) => {
                const total = Object.values(mockData.exports).reduce((a, b) => a + b, 0)
                const percentage = Math.round((count / total) * 100)
                return (
                  <div key={format} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full`}
                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                      />
                      <span className="text-sm text-gray-300 uppercase">{format}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-white">{count.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-2">({percentage}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Heavy Users (Top 5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.heavyUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-sm text-gray-400">
                      {user.plan} • {user.lastActive}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#CDA434]">{user.runs.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">runs</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Errors (Last 24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.errors24h.map((error, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{error.error}</div>
                    <div className="text-sm text-gray-400">{error.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{error.count}</div>
                    <div className={`text-xs ${getSeverityColor(error.severity)}`}>{error.severity}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

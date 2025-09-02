"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Play,
  CheckCircle,
  Download,
  Target,
  AlertTriangle,
  Zap,
} from "lucide-react"

// Mock usage funnel data
const usageFunnelData = {
  generatorVisits: 15420,
  runsSimulate: 8934,
  runsLive: 2847,
  successfulRuns: 10234,
  exports: {
    total: 5678,
    byFormat: {
      txt: 2340,
      md: 1890,
      pdf: 890,
      json: 456,
      zip: 102,
    },
  },
  conversionRates: {
    visitToRun: 76.2,
    runToSuccess: 87.3,
    successToExport: 55.5,
    overallConversion: 36.8,
  },
  paywallBlocks: [
    { action: "PDF Export", blocks: 1234, plan: "Free", upgradeRate: 12.3 },
    { action: "Live GPT Test", blocks: 890, plan: "Creator", upgradeRate: 8.7 },
    { action: "Bundle ZIP", blocks: 567, plan: "Pro", upgradeRate: 15.2 },
    { action: "API Access", blocks: 234, plan: "Pro", upgradeRate: 22.1 },
  ],
}

// Mock module performance data
const modulePerformanceData = {
  topModules: [
    {
      id: "M01",
      name: "Strategic Framework",
      runs: 2847,
      avgScore: 89.2,
      exportRate: 67.3,
      ttaMedian: 42,
      pack: "Business",
      trend: 12.5,
    },
    {
      id: "M15",
      name: "Content Engine",
      runs: 2340,
      avgScore: 91.5,
      exportRate: 72.1,
      ttaMedian: 38,
      pack: "Marketing",
      trend: 8.9,
    },
    {
      id: "M23",
      name: "Crisis Management",
      runs: 1890,
      avgScore: 85.7,
      exportRate: 58.9,
      ttaMedian: 55,
      pack: "Business",
      trend: -3.2,
    },
    {
      id: "M08",
      name: "Market Analysis",
      runs: 1567,
      avgScore: 87.4,
      exportRate: 61.2,
      ttaMedian: 47,
      pack: "FinTech",
      trend: 15.7,
    },
    {
      id: "M34",
      name: "Product Launch",
      runs: 1234,
      avgScore: 88.9,
      exportRate: 64.5,
      ttaMedian: 41,
      pack: "E-Commerce",
      trend: 6.3,
    },
  ],
  underUsedModules: [
    {
      id: "M47",
      name: "Legal Compliance",
      runs: 89,
      avgScore: 92.1,
      exportRate: 78.9,
      ttaMedian: 35,
      pack: "Legal",
      potential: "High",
    },
    {
      id: "M39",
      name: "Supply Chain",
      runs: 156,
      avgScore: 90.3,
      exportRate: 71.2,
      ttaMedian: 43,
      pack: "Operations",
      potential: "High",
    },
    {
      id: "M42",
      name: "HR Policies",
      runs: 203,
      avgScore: 86.7,
      exportRate: 65.4,
      ttaMedian: 52,
      pack: "HR",
      potential: "Medium",
    },
  ],
  packPerformance: [
    { pack: "Business", modules: 12, totalRuns: 8934, avgScore: 87.2, exportRate: 63.4 },
    { pack: "FinTech", modules: 8, totalRuns: 5678, avgScore: 89.1, exportRate: 68.9 },
    { pack: "E-Commerce", modules: 10, totalRuns: 4567, avgScore: 85.9, exportRate: 61.7 },
    { pack: "Marketing", modules: 7, totalRuns: 3456, avgScore: 90.3, exportRate: 72.1 },
    { pack: "Legal", modules: 5, totalRuns: 1234, avgScore: 91.8, exportRate: 75.6 },
    { pack: "Operations", modules: 8, totalRuns: 2345, avgScore: 88.4, exportRate: 66.2 },
  ],
}

export default function AdminUsage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [packFilter, setPackFilter] = useState("all")
  const [domainFilter, setDomainFilter] = useState("all")

  useEffect(() => {
    console.log("[v0] Usage analytics viewed", { timeRange, moduleFilter, planFilter, packFilter, domainFilter })
  }, [timeRange, moduleFilter, planFilter, packFilter, domainFilter])

  const formatNumber = (value: number) => value.toLocaleString()
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatChange = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-400" : "text-red-400"
  }

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case "High":
        return "text-green-400"
      case "Medium":
        return "text-yellow-400"
      case "Low":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#CDA434] mb-2">Usage Funnel & Module Analytics</h1>
          <p className="text-gray-400">Track user journey and module performance insights</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
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

          <Select value={packFilter} onValueChange={setPackFilter}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Packs</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="fintech">FinTech</SelectItem>
              <SelectItem value="ecommerce">E-Commerce</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={domainFilter} onValueChange={setDomainFilter}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="strategic">Strategic</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="analytical">Analytical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Usage Funnel Overview */}
      <div>
        <h2 className="text-xl font-semibold text-[#CDA434] mb-4">Usage Funnel: Open → Run → Success → Export</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Generator Visits</CardTitle>
              <Users className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNumber(usageFunnelData.generatorVisits)}</div>
              <p className="text-xs text-gray-400">Starting point</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Runs</CardTitle>
              <Play className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatNumber(usageFunnelData.runsSimulate + usageFunnelData.runsLive)}
              </div>
              <p className="text-xs text-green-400">
                {formatPercentage(usageFunnelData.conversionRates.visitToRun)} conversion
              </p>
              <div className="text-xs text-gray-400 mt-1">
                <span>Simulate: {formatNumber(usageFunnelData.runsSimulate)}</span>
                <br />
                <span>Live: {formatNumber(usageFunnelData.runsLive)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Successful Runs</CardTitle>
              <CheckCircle className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNumber(usageFunnelData.successfulRuns)}</div>
              <p className="text-xs text-green-400">
                {formatPercentage(usageFunnelData.conversionRates.runToSuccess)} success rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Exports</CardTitle>
              <Download className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNumber(usageFunnelData.exports.total)}</div>
              <p className="text-xs text-green-400">
                {formatPercentage(usageFunnelData.conversionRates.successToExport)} export rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Overall Conversion</CardTitle>
              <Target className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatPercentage(usageFunnelData.conversionRates.overallConversion)}
              </div>
              <p className="text-xs text-gray-400">Visit to Export</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Format Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Export Formats Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(usageFunnelData.exports.byFormat).map(([format, count], index) => {
                const percentage = (count / usageFunnelData.exports.total) * 100
                return (
                  <div key={format} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white uppercase">{format}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#CDA434]">{formatNumber(count)}</span>
                        <span className="text-xs text-gray-400 ml-2">({formatPercentage(percentage)})</span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Paywall Blocks & Upgrades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageFunnelData.paywallBlocks.map((block, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{block.action}</div>
                    <div className="text-sm text-gray-400">Blocked on {block.plan} plan</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-400">{formatNumber(block.blocks)} blocks</div>
                    <div className="text-xs text-green-400">{formatPercentage(block.upgradeRate)} upgrade</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Performance */}
      <div>
        <h2 className="text-xl font-semibold text-[#CDA434] mb-4">Module Performance Analytics</h2>

        {/* Top Performing Modules */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Performing Modules
            </CardTitle>
            <CardDescription className="text-gray-400">Highest usage modules with performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">Module</th>
                    <th className="text-right py-3 px-4 text-gray-300">Runs</th>
                    <th className="text-right py-3 px-4 text-gray-300">Avg Score</th>
                    <th className="text-right py-3 px-4 text-gray-300">Export Rate</th>
                    <th className="text-right py-3 px-4 text-gray-300">TTA Median</th>
                    <th className="text-right py-3 px-4 text-gray-300">Trend</th>
                    <th className="text-right py-3 px-4 text-gray-300">Pack</th>
                  </tr>
                </thead>
                <tbody>
                  {modulePerformanceData.topModules.map((module, index) => (
                    <tr key={module.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-white">{module.name}</div>
                          <div className="text-sm text-gray-400">{module.id}</div>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-bold text-[#CDA434]">{formatNumber(module.runs)}</td>
                      <td className="text-right py-3 px-4 text-white">{formatPercentage(module.avgScore)}</td>
                      <td className="text-right py-3 px-4 text-white">{formatPercentage(module.exportRate)}</td>
                      <td className="text-right py-3 px-4 text-white">{module.ttaMedian}s</td>
                      <td className={`text-right py-3 px-4 ${getChangeColor(module.trend)}`}>
                        {formatChange(module.trend)}
                      </td>
                      <td className="text-right py-3 px-4">
                        <Badge className="bg-blue-900 text-blue-300">{module.pack}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Under-used Modules */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <TrendingDown className="h-5 w-5 mr-2" />
              Under-used High-Quality Modules
            </CardTitle>
            <CardDescription className="text-gray-400">
              Low usage modules with high potential - consider promoting these
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {modulePerformanceData.underUsedModules.map((module, index) => (
                <div key={module.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">{module.name}</h3>
                      <p className="text-sm text-gray-400">
                        {module.id} • {module.pack}
                      </p>
                    </div>
                    <Badge className={`${getPotentialColor(module.potential)}`}>{module.potential} Potential</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Runs:</span>
                      <span className="text-white font-medium">{formatNumber(module.runs)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Score:</span>
                      <span className="text-green-400 font-medium">{formatPercentage(module.avgScore)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Export Rate:</span>
                      <span className="text-green-400 font-medium">{formatPercentage(module.exportRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">TTA:</span>
                      <span className="text-white font-medium">{module.ttaMedian}s</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full mt-4 bg-[#CDA434] text-black hover:bg-[#CDA434]/90 focus:ring-2 focus:ring-[#00FF7F]"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Try Now in Generator
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pack Performance */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Industry Pack Performance
            </CardTitle>
            <CardDescription className="text-gray-400">Performance metrics by industry pack</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {modulePerformanceData.packPerformance.map((pack, index) => (
                <div key={pack.pack} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">{pack.pack}</h3>
                    <Badge className="bg-gray-700 text-gray-300">{pack.modules} modules</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Runs:</span>
                      <span className="text-[#CDA434] font-bold">{formatNumber(pack.totalRuns)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Score:</span>
                      <span className="text-white font-medium">{formatPercentage(pack.avgScore)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Export Rate:</span>
                      <span className="text-white font-medium">{formatPercentage(pack.exportRate)}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Usage Distribution</span>
                      <span className="text-xs text-gray-400">{formatPercentage((pack.totalRuns / 25214) * 100)}</span>
                    </div>
                    <Progress value={(pack.totalRuns / 25214) * 100} className="h-2" />
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

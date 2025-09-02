"use client"

import { useState, useEffect } from "react"
import {
  Users,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity,
  CheckCircle,
  Clock,
  Target,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const executiveKPIs = {
  // Financial Metrics (Stripe sync)
  mrr: { current: 12450, previous: 11100, change: 12.2, target: 15000 },
  arr: { current: 149400, previous: 133200, change: 12.2 },
  nrr: { current: 108.5, previous: 105.2, change: 3.1, target: 110 },
  freeToPaid28d: { current: 3.2, previous: 3.5, change: -8.6, target: 4.0 },
  churn: { current: 2.1, previous: 2.8, change: -25.0, target: 2.0 },
  paybackMonths: { current: 3.2, previous: 3.8, change: -15.8, target: 3.0 },

  // Product Health
  activations10m: { current: 78.5, previous: 72.1, change: 8.9, target: 80.0 },
  passRate: { current: 87.3, previous: 84.8, change: 2.9, target: 80.0 },
  ttaMedian: { current: 42, previous: 58, change: -27.6, target: 60 },

  // System Health
  uptime: { current: 99.97, previous: 99.94, change: 0.03, target: 99.9 },
  errorBudget: { current: 85.2, previous: 78.9, change: 8.0, target: 70.0 },
  incidents7d: { current: 2, previous: 5, change: -60.0, target: 3 },
}

const alerts = [
  {
    type: "warning",
    metric: "Free→Paid Conversion",
    message: "Below target: 3.2% vs 4.0% target",
    severity: "medium",
    action: "Review onboarding funnel",
  },
  {
    type: "success",
    metric: "Pass Rate",
    message: "Above target: 87.3% vs 80% target",
    severity: "low",
    action: "Maintain quality standards",
  },
  {
    type: "info",
    metric: "TTA Performance",
    message: "Excellent: 42s vs 60s target",
    severity: "low",
    action: "Monitor for consistency",
  },
]

export default function AdminOverview() {
  const [timeRange, setTimeRange] = useState("7d")
  const [planFilter, setPlanFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")

  useEffect(() => {
    // Track executive dashboard view
    console.log("[v0] Executive dashboard viewed", { timeRange, planFilter, countryFilter })
  }, [timeRange, planFilter, countryFilter])

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatChange = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-400" : "text-red-400"
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-500 bg-red-500/10"
      case "medium":
        return "border-yellow-500 bg-yellow-500/10"
      case "low":
        return "border-green-500 bg-green-500/10"
      default:
        return "border-gray-500 bg-gray-500/10"
    }
  }

  const getTargetStatus = (current: number, target: number, higherIsBetter = true) => {
    const isOnTarget = higherIsBetter ? current >= target : current <= target
    return isOnTarget ? "text-green-400" : "text-yellow-400"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#CDA434] mb-2">Executive Dashboard</h1>
          <p className="text-gray-400">60-second board overview • Money • Usage • Quality • Risk</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="28d">Last 28 days</SelectItem>
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

          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="eu">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#CDA434]">Critical Alerts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {alerts.map((alert, index) => (
              <Card key={index} className={`bg-gray-900 border ${getAlertColor(alert.severity)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{alert.metric}</h3>
                      <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{alert.action}</p>
                    </div>
                    <AlertTriangle
                      className={`h-5 w-5 ${alert.severity === "high" ? "text-red-400" : alert.severity === "medium" ? "text-yellow-400" : "text-green-400"}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-[#CDA434] mb-4">Financial Health (Stripe Sync)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">MRR</CardTitle>
              <DollarSign className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(executiveKPIs.mrr.current)}</div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.mrr.change)}`}>
                {formatChange(executiveKPIs.mrr.change)} vs last period
              </p>
              <p className="text-xs text-gray-500">Target: {formatCurrency(executiveKPIs.mrr.target)}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">ARR</CardTitle>
              <DollarSign className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(executiveKPIs.arr.current)}</div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.arr.change)}`}>
                {formatChange(executiveKPIs.arr.change)} vs last period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Free→Paid (28d)</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatPercentage(executiveKPIs.freeToPaid28d.current)}
              </div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.freeToPaid28d.change)}`}>
                {formatChange(executiveKPIs.freeToPaid28d.change)} vs last period
              </p>
              <p
                className={`text-xs ${getTargetStatus(executiveKPIs.freeToPaid28d.current, executiveKPIs.freeToPaid28d.target)}`}
              >
                Target: {formatPercentage(executiveKPIs.freeToPaid28d.target)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">NRR</CardTitle>
              <Target className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(executiveKPIs.nrr.current)}</div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.nrr.change)}`}>
                {formatChange(executiveKPIs.nrr.change)} vs last period
              </p>
              <p className={`text-xs ${getTargetStatus(executiveKPIs.nrr.current, executiveKPIs.nrr.target)}`}>
                Target: {formatPercentage(executiveKPIs.nrr.target)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Churn</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(executiveKPIs.churn.current)}</div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.churn.change)}`}>
                {formatChange(executiveKPIs.churn.change)} vs last period
              </p>
              <p
                className={`text-xs ${getTargetStatus(executiveKPIs.churn.current, executiveKPIs.churn.target, false)}`}
              >
                Target: ≤{formatPercentage(executiveKPIs.churn.target)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Payback</CardTitle>
              <Clock className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{executiveKPIs.paybackMonths.current} mo</div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.paybackMonths.change)}`}>
                {formatChange(executiveKPIs.paybackMonths.change)} vs last period
              </p>
              <p
                className={`text-xs ${getTargetStatus(executiveKPIs.paybackMonths.current, executiveKPIs.paybackMonths.target, false)}`}
              >
                Target: ≤{executiveKPIs.paybackMonths.target} mo
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#CDA434] mb-4">Product Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Activations (≤10m)</CardTitle>
              <Zap className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatPercentage(executiveKPIs.activations10m.current)}
              </div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.activations10m.change)}`}>
                {formatChange(executiveKPIs.activations10m.change)} vs last period
              </p>
              <p
                className={`text-xs ${getTargetStatus(executiveKPIs.activations10m.current, executiveKPIs.activations10m.target)}`}
              >
                Target: ≥{formatPercentage(executiveKPIs.activations10m.target)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pass-Rate (≥80)</CardTitle>
              <CheckCircle className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(executiveKPIs.passRate.current)}</div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.passRate.change)}`}>
                {formatChange(executiveKPIs.passRate.change)} vs last period
              </p>
              <p
                className={`text-xs ${getTargetStatus(executiveKPIs.passRate.current, executiveKPIs.passRate.target)}`}
              >
                Target: ≥{formatPercentage(executiveKPIs.passRate.target)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">TTA Median</CardTitle>
              <Clock className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{executiveKPIs.ttaMedian.current}s</div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.ttaMedian.change)}`}>
                {formatChange(executiveKPIs.ttaMedian.change)} vs last period
              </p>
              <p
                className={`text-xs ${getTargetStatus(executiveKPIs.ttaMedian.current, executiveKPIs.ttaMedian.target, false)}`}
              >
                Target: &lt;{executiveKPIs.ttaMedian.target}s
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#CDA434] mb-4">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Uptime</CardTitle>
              <Activity className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(executiveKPIs.uptime.current)}</div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.uptime.change)}`}>
                {formatChange(executiveKPIs.uptime.change)} vs last period
              </p>
              <p className={`text-xs ${getTargetStatus(executiveKPIs.uptime.current, executiveKPIs.uptime.target)}`}>
                Target: ≥{formatPercentage(executiveKPIs.uptime.target)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Error Budget</CardTitle>
              <Target className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(executiveKPIs.errorBudget.current)}</div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.errorBudget.change)}`}>
                {formatChange(executiveKPIs.errorBudget.change)} vs last period
              </p>
              <p
                className={`text-xs ${getTargetStatus(executiveKPIs.errorBudget.current, executiveKPIs.errorBudget.target)}`}
              >
                Target: ≥{formatPercentage(executiveKPIs.errorBudget.target)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Incidents (7d)</CardTitle>
              <AlertTriangle className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{executiveKPIs.incidents7d.current}</div>
              <p className={`text-xs ${getChangeColor(executiveKPIs.incidents7d.change)}`}>
                {formatChange(executiveKPIs.incidents7d.change)} vs last period
              </p>
              <p
                className={`text-xs ${getTargetStatus(executiveKPIs.incidents7d.current, executiveKPIs.incidents7d.target, false)}`}
              >
                Target: ≤{executiveKPIs.incidents7d.target}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434]">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">Critical administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/statistici">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Full Analytics
                </Button>
              </Link>
              <Link href="/admin/incidente">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Incidents
                </Button>
              </Link>
              <Link href="/admin/abonamente">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Subscriptions
                </Button>
              </Link>
              <Link href="/admin/entitlements">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Entitlements
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434]">Recent Critical Events</CardTitle>
            <CardDescription className="text-gray-400">Board-level notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">MRR milestone: $12K reached</span>
                <span className="text-green-400">2 min ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Pass-rate improved to 87.3%</span>
                <span className="text-green-400">15 min ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Conversion rate below target</span>
                <span className="text-yellow-400">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">System incident resolved</span>
                <span className="text-gray-500">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

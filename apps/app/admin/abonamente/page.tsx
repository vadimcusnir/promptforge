"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard,
  Calendar,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  BarChart3,
  Download,
} from "lucide-react"

// Mock subscription data
const mockSubscription = {
  id: "sub_1234567890",
  plan: {
    name: "Pro",
    price: 49,
    interval: "month",
    seats: 5,
    features: ["All modules", "Live GPT testing", "Advanced exports", "Priority support"],
  },
  status: "active",
  currentPeriodStart: "2024-01-01T00:00:00Z",
  currentPeriodEnd: "2024-02-01T00:00:00Z",
  nextInvoice: {
    amount: 49,
    date: "2024-02-01T00:00:00Z",
    status: "upcoming",
  },
  usage: {
    seats: 3,
    apiCalls: 8750,
    exports: 245,
  },
  limits: {
    seats: 5,
    apiCalls: 10000,
    exports: 500,
  },
  dunning: null,
  paymentMethod: {
    type: "card",
    last4: "4242",
    brand: "visa",
    expMonth: 12,
    expYear: 2025,
  },
}

const mockInvoices = [
  {
    id: "in_1234567890",
    amount: 49,
    status: "paid",
    date: "2024-01-01T00:00:00Z",
    downloadUrl: "#",
  },
  {
    id: "in_0987654321",
    amount: 49,
    status: "paid",
    date: "2023-12-01T00:00:00Z",
    downloadUrl: "#",
  },
  {
    id: "in_1122334455",
    amount: 49,
    status: "paid",
    date: "2023-11-01T00:00:00Z",
    downloadUrl: "#",
  },
]

const planOptions = [
  {
    name: "Creator",
    price: 19,
    interval: "month",
    seats: 1,
    description: "Perfect for individual creators",
  },
  {
    name: "Pro",
    price: 49,
    interval: "month",
    seats: 5,
    description: "Best for growing teams",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 299,
    interval: "month",
    seats: 25,
    description: "For large organizations",
  },
]

// Comprehensive revenue analytics data
const revenueAnalytics = {
  mrr: { current: 12450, previous: 11100, change: 12.2 },
  arpa: { current: 47, previous: 42, change: 11.9 },
  nrr: { current: 108.5, previous: 105.2, change: 3.1 },
  logoChurn: { current: 2.1, previous: 2.8, change: -25.0 },
  revenueChurn: { current: 1.8, previous: 2.3, change: -21.7 },
  freeToPaid28d: { current: 3.2, previous: 3.5, change: -8.6 },
  dunningRate: { current: 4.2, previous: 5.1, change: -17.6 },

  // Revenue by plan
  revenueByPlan: [
    { plan: "Enterprise", revenue: 7470, percentage: 60, customers: 25 },
    { plan: "Pro", revenue: 3430, percentage: 27.5, customers: 70 },
    { plan: "Creator", revenue: 1550, percentage: 12.5, customers: 82 },
  ],

  // Revenue by country
  revenueByCountry: [
    { country: "United States", revenue: 6225, percentage: 50 },
    { country: "United Kingdom", revenue: 2490, percentage: 20 },
    { country: "Germany", revenue: 1870, percentage: 15 },
    { country: "Canada", revenue: 1245, percentage: 10 },
    { country: "Others", revenue: 620, percentage: 5 },
  ],

  // Subscription status breakdown
  statusBreakdown: {
    active: 142,
    trialing: 23,
    past_due: 8,
    canceled: 4,
  },

  // Recent upgrades/downgrades
  recentChanges: [
    { org: "TechCorp Inc", from: "Pro", to: "Enterprise", amount: 250, date: "2024-01-15", type: "upgrade" },
    { org: "StartupXYZ", from: "Creator", to: "Pro", amount: 30, date: "2024-01-14", type: "upgrade" },
    { org: "AgencyABC", from: "Pro", to: "Creator", amount: -30, date: "2024-01-13", type: "downgrade" },
    { org: "ConsultingDEF", from: "Free", to: "Creator", amount: 19, date: "2024-01-12", type: "upgrade" },
  ],
}

export default function AdminAbonamente() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("30d")
  const [planFilter, setPlanFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const [orgFilter, setOrgFilter] = useState("all")

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-900 text-green-300",
      past_due: "bg-red-900 text-red-300",
      canceled: "bg-gray-700 text-gray-300",
      trialing: "bg-blue-900 text-blue-300",
    }
    return variants[status as keyof typeof variants] || variants.active
  }

  const getInvoiceStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-green-900 text-green-300",
      open: "bg-yellow-900 text-yellow-300",
      void: "bg-gray-700 text-gray-300",
      uncollectible: "bg-red-900 text-red-300",
    }
    return variants[status as keyof typeof variants] || variants.open
  }

  const calculateProration = (newPlan: string) => {
    // Mock proration calculation
    const currentPlan = mockSubscription.plan
    const newPlanData = planOptions.find((p) => p.name === newPlan)
    if (!newPlanData) return 0

    const daysRemaining = Math.ceil(
      (new Date(mockSubscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    )
    const proratedCredit = (currentPlan.price / 30) * daysRemaining
    const newPlanCost = newPlanData.price

    return newPlanCost - proratedCredit
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatChange = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-400" : "text-red-400"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#CDA434] mb-2">Revenue & Billing Analytics</h1>
          <p className="text-gray-400">Comprehensive subscription management and financial insights</p>
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

          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black focus:ring-2 focus:ring-[#00FF7F] bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#CDA434] mb-4">Revenue Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">MRR</CardTitle>
              <DollarSign className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(revenueAnalytics.mrr.current)}</div>
              <p className={`text-xs ${getChangeColor(revenueAnalytics.mrr.change)}`}>
                {formatChange(revenueAnalytics.mrr.change)} vs last period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">ARPA</CardTitle>
              <DollarSign className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(revenueAnalytics.arpa.current)}</div>
              <p className={`text-xs ${getChangeColor(revenueAnalytics.arpa.change)}`}>
                {formatChange(revenueAnalytics.arpa.change)} vs last period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">NRR</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatPercentage(revenueAnalytics.nrr.current)}</div>
              <p className={`text-xs ${getChangeColor(revenueAnalytics.nrr.change)}`}>
                {formatChange(revenueAnalytics.nrr.change)} vs last period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Logo Churn</CardTitle>
              <Users className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatPercentage(revenueAnalytics.logoChurn.current)}
              </div>
              <p className={`text-xs ${getChangeColor(revenueAnalytics.logoChurn.change)}`}>
                {formatChange(revenueAnalytics.logoChurn.change)} vs last period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Revenue Churn</CardTitle>
              <DollarSign className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatPercentage(revenueAnalytics.revenueChurn.current)}
              </div>
              <p className={`text-xs ${getChangeColor(revenueAnalytics.revenueChurn.change)}`}>
                {formatChange(revenueAnalytics.revenueChurn.change)} vs last period
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
                {formatPercentage(revenueAnalytics.freeToPaid28d.current)}
              </div>
              <p className={`text-xs ${getChangeColor(revenueAnalytics.freeToPaid28d.change)}`}>
                {formatChange(revenueAnalytics.freeToPaid28d.change)} vs last period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Dunning Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-[#CDA434]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatPercentage(revenueAnalytics.dunningRate.current)}
              </div>
              <p className={`text-xs ${getChangeColor(revenueAnalytics.dunningRate.change)}`}>
                {formatChange(revenueAnalytics.dunningRate.change)} vs last period
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Revenue by Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueAnalytics.revenueByPlan.map((item, index) => (
                <div key={item.plan} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{item.plan}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#CDA434]">{formatCurrency(item.revenue)}</span>
                      <span className="text-xs text-gray-400 ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{item.customers} customers</span>
                    <Progress value={item.percentage} className="w-24 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(revenueAnalytics.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusBadge(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
                  </div>
                  <span className="font-bold text-white">{count}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-gray-300">Total Subscriptions</span>
                  <span className="text-[#CDA434]">
                    {Object.values(revenueAnalytics.statusBreakdown).reduce((a, b) => a + b, 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Plan Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueAnalytics.recentChanges.map((change, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{change.org}</div>
                    <div className="text-sm text-gray-400">
                      {change.from} → {change.to}
                    </div>
                    <div className="text-xs text-gray-500">{new Date(change.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${change.type === "upgrade" ? "text-green-400" : "text-red-400"}`}>
                      {change.amount > 0 ? "+" : ""}
                      {formatCurrency(change.amount)}
                    </div>
                    <Badge
                      className={change.type === "upgrade" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}
                    >
                      {change.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Subscription */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#CDA434]">Current Subscription</CardTitle>
                <Badge className={getStatusBadge(mockSubscription.status)}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {mockSubscription.status.charAt(0).toUpperCase() + mockSubscription.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{mockSubscription.plan.name} Plan</h3>
                  <p className="text-gray-400">
                    ${mockSubscription.plan.price}/{mockSubscription.plan.interval} • {mockSubscription.plan.seats}{" "}
                    seats
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#CDA434]">${mockSubscription.plan.price}</p>
                  <p className="text-sm text-gray-400">per month</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Seats Used</span>
                    <span className="text-sm text-white">
                      {mockSubscription.usage.seats} / {mockSubscription.limits.seats}
                    </span>
                  </div>
                  <Progress
                    value={(mockSubscription.usage.seats / mockSubscription.limits.seats) * 100}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">API Calls</span>
                    <span className="text-sm text-white">
                      {mockSubscription.usage.apiCalls.toLocaleString()} /{" "}
                      {mockSubscription.limits.apiCalls.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={(mockSubscription.usage.apiCalls / mockSubscription.limits.apiCalls) * 100}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Exports</span>
                    <span className="text-sm text-white">
                      {mockSubscription.usage.exports} / {mockSubscription.limits.exports}
                    </span>
                  </div>
                  <Progress
                    value={(mockSubscription.usage.exports / mockSubscription.limits.exports) * 100}
                    className="h-2"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 focus:ring-2 focus:ring-[#00FF7F]"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Change Plan
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Customer Portal
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Stripe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Next Invoice */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#CDA434] flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Next Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-medium text-white">${mockSubscription.nextInvoice.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date</span>
                  <span className="font-medium text-white">
                    {new Date(mockSubscription.nextInvoice.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <Badge className="bg-blue-900 text-blue-300">{mockSubscription.nextInvoice.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#CDA434] flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  {mockSubscription.paymentMethod.brand.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-white">•••• {mockSubscription.paymentMethod.last4}</p>
                  <p className="text-sm text-gray-400">
                    Expires {mockSubscription.paymentMethod.expMonth}/{mockSubscription.paymentMethod.expYear}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
              >
                Update Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice History */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-[#CDA434]">Invoice History</CardTitle>
          <CardDescription className="text-gray-400">View and download your billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-white">${invoice.amount}</p>
                    <p className="text-sm text-gray-400">{new Date(invoice.date).toLocaleDateString()}</p>
                  </div>
                  <Badge className={getInvoiceStatusBadge(invoice.status)}>{invoice.status}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F]"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan Change Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-4xl mx-4">
            <CardHeader>
              <CardTitle className="text-[#CDA434]">Change Subscription Plan</CardTitle>
              <CardDescription className="text-gray-400">
                Select a new plan and see the proration details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planOptions.map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors focus:ring-2 focus:ring-[#00FF7F] ${
                      selectedPlan === plan.name
                        ? "border-[#CDA434] bg-[#CDA434]/10"
                        : "border-gray-700 hover:border-gray-600"
                    } ${plan.popular ? "ring-2 ring-[#CDA434]/50" : ""}`}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    {plan.popular && <Badge className="bg-[#CDA434] text-black mb-2">Most Popular</Badge>}
                    <h3 className="font-bold text-white">{plan.name}</h3>
                    <p className="text-2xl font-bold text-[#CDA434]">${plan.price}</p>
                    <p className="text-sm text-gray-400 mb-2">per month</p>
                    <p className="text-sm text-gray-300">{plan.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{plan.seats} seats included</p>
                  </div>
                ))}
              </div>

              {selectedPlan && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Proration Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current plan credit</span>
                      <span className="text-green-400">
                        -$
                        {Math.abs(
                          calculateProration(selectedPlan) - planOptions.find((p) => p.name === selectedPlan)!.price,
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">New plan cost</span>
                      <span className="text-white">${planOptions.find((p) => p.name === selectedPlan)!.price}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2 flex justify-between font-medium">
                      <span className="text-white">Amount due today</span>
                      <span className="text-[#CDA434]">
                        ${Math.max(0, calculateProration(selectedPlan)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowUpgradeModal(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-[#00FF7F]"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 focus:ring-2 focus:ring-[#00FF7F]"
                  disabled={!selectedPlan}
                >
                  Confirm Change
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { withAuth } from "@/lib/auth"
import {
  Download,
  Play,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Database,
  Zap,
  Target,
  Calendar,
  TrendingUp,
  Activity,
  BarChart3,
  LucidePieChart as RechartsPieChart,
  Pi as Pie,
  Brain,
  Lightbulb,
  Star,
  ArrowRight,
  Sparkles,
  Users,
  Eye,
} from "lucide-react"
import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import { Cell } from "recharts"

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("runs")
  const [recommendations, setRecommendations] = useState([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  const aiRecommendations = [
    {
      id: "rec_001",
      type: "module_suggestion",
      title: "Try Crisis Communication Plan",
      reason: "Based on your Strategic Framework usage, this module could boost your crisis management capabilities",
      confidence: 92,
      potentialScore: 89,
      category: "Crisis Management",
      module: "M41",
      action: "Try Module",
      priority: "high",
      insights: ["Similar users see 15% score improvement", "Complements your current workflow"],
    },
    {
      id: "rec_002",
      type: "optimization",
      title: "Optimize 7D Parameters for Content Strategy",
      reason: "Your Content Strategy runs could improve by adjusting Scale and Urgency parameters",
      confidence: 87,
      potentialScore: 91,
      category: "Parameter Optimization",
      action: "View Suggestions",
      priority: "medium",
      insights: ["Avg score could increase from 86.7% to 91%", "Based on 234 similar patterns"],
    },
    {
      id: "rec_003",
      type: "workflow",
      title: "Combine Strategic + Analysis Modules",
      reason: "Users with similar patterns get better results by chaining these module types",
      confidence: 84,
      potentialScore: 93,
      category: "Workflow Enhancement",
      action: "Create Workflow",
      priority: "medium",
      insights: ["Chain completion rate: 94%", "Average combined score: 93%"],
    },
    {
      id: "rec_004",
      type: "timing",
      title: "Run modules between 12-16h for best performance",
      reason: "Your time-to-artifact is 23% faster during these hours",
      confidence: 91,
      category: "Performance Optimization",
      action: "Schedule Runs",
      priority: "low",
      insights: ["43s avg vs 51s other times", "Higher quality scores during peak hours"],
    },
  ]

  const trendingModules = [
    {
      name: "Ethical Guardrails GPT",
      code: "M44",
      trendScore: 96,
      weeklyGrowth: "+34%",
      category: "AI Safety",
      description: "Guardrails etice pentru sisteme GPT",
      userCount: 1247,
      avgScore: 95,
    },
    {
      name: "Semiotic Brand Architecture",
      code: "M36",
      trendScore: 94,
      weeklyGrowth: "+28%",
      category: "Branding",
      description: "Arhitectură semiotică pentru brand",
      userCount: 892,
      avgScore: 95,
    },
    {
      name: "Closed-Loop Telemetry",
      code: "M31",
      trendScore: 92,
      weeklyGrowth: "+22%",
      category: "Analytics",
      description: "Sistem de telemetrie în buclă închisă",
      userCount: 634,
      avgScore: 94,
    },
  ]

  const behaviorInsights = [
    {
      pattern: "Sequential Module Usage",
      description: "You tend to use Strategic → Content → Analysis in sequence",
      frequency: "78% of sessions",
      recommendation: "Consider the new Workflow Templates feature",
      impact: "Could save 12 minutes per session",
    },
    {
      pattern: "Peak Performance Hours",
      description: "Your best scores happen between 14:00-16:00",
      frequency: "Average +8% score improvement",
      recommendation: "Schedule complex modules during this window",
      impact: "Potential 6-point score boost",
    },
    {
      pattern: "Parameter Consistency",
      description: "You rarely change Complexity and Resources parameters",
      frequency: "Same values in 89% of runs",
      recommendation: "Experiment with different parameter combinations",
      impact: "Users who vary parameters score 12% higher",
    },
  ]

  const loadRecommendations = async () => {
    setIsLoadingRecommendations(true)
    try {
      // Simulate API call to AI recommendation engine
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setRecommendations(aiRecommendations)
    } catch (error) {
      console.error("Failed to load recommendations:", error)
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  useEffect(() => {
    loadRecommendations()
  }, [])

  const scoreHistoryData = [
    { date: "Jan 1", score: 82, runs: 45 },
    { date: "Jan 8", score: 85, runs: 52 },
    { date: "Jan 15", score: 87, runs: 48 },
    { date: "Jan 22", score: 89, runs: 61 },
    { date: "Jan 29", score: 87, runs: 58 },
    { date: "Feb 5", score: 91, runs: 67 },
    { date: "Feb 12", score: 88, runs: 54 },
  ]

  const modulePerformanceData = [
    { name: "Strategic", runs: 234, avgScore: 89, exports: 198 },
    { name: "Content", runs: 187, avgScore: 86, exports: 156 },
    { name: "Analysis", runs: 156, avgScore: 84, exports: 134 },
    { name: "Branding", runs: 143, avgScore: 91, exports: 127 },
    { name: "Crisis", runs: 98, avgScore: 93, exports: 89 },
  ]

  const scoreDistributionData = [
    { range: "90-100%", count: 435, percentage: 35 },
    { range: "80-89%", count: 559, percentage: 45 },
    { range: "70-79%", count: 186, percentage: 15 },
    { range: "<70%", count: 62, percentage: 5 },
  ]

  const timeToArtifactData = [
    { hour: "00", avgTime: 52 },
    { hour: "04", avgTime: 48 },
    { hour: "08", avgTime: 45 },
    { hour: "12", avgTime: 43 },
    { hour: "16", avgTime: 47 },
    { hour: "20", avgTime: 51 },
  ]

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]

  const primaryKPIs = [
    {
      label: "Runs (7d)",
      value: "1,247",
      change: "+12%",
      trend: "up",
      target: "1,500",
      icon: Play,
    },
    {
      label: "Avg Score",
      value: "87.3",
      change: "+5.2%",
      trend: "up",
      target: "≥80",
      icon: Target,
    },
    {
      label: "Exports",
      value: "342",
      change: "+18%",
      trend: "up",
      breakdown: { md: 156, json: 98, pdf: 67, zip: 21 },
      icon: Download,
    },
    {
      label: "Time-to-Artifact",
      value: "47s",
      change: "-8s",
      trend: "down",
      target: "<60s",
      icon: Clock,
    },
    {
      label: "Pass Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      target: "≥80%",
      icon: CheckCircle,
    },
  ]

  const recentRuns = [
    {
      id: "RUN_2024_001247",
      module: "Strategic Framework Generator",
      score: 92,
      verdict: "PASS",
      duration: "45s",
      owner: "You",
      created: "2 min ago",
      format: ".pdf",
      status: "completed",
    },
    {
      id: "RUN_2024_001246",
      module: "Content Strategy Builder",
      score: 88,
      verdict: "PASS",
      duration: "52s",
      owner: "You",
      created: "8 min ago",
      format: ".json",
      status: "completed",
    },
    {
      id: "RUN_2024_001245",
      module: "Crisis Communication Plan",
      score: 95,
      verdict: "PASS",
      duration: "38s",
      owner: "You",
      created: "15 min ago",
      format: ".md",
      status: "completed",
    },
    {
      id: "RUN_2024_001244",
      module: "Market Analysis Framework",
      score: 76,
      verdict: "REPAIR",
      duration: "62s",
      owner: "You",
      created: "23 min ago",
      format: ".json",
      status: "needs_repair",
    },
    {
      id: "RUN_2024_001243",
      module: "Brand Voice Generator",
      score: 91,
      verdict: "PASS",
      duration: "41s",
      owner: "You",
      created: "1 hour ago",
      format: ".pdf",
      status: "completed",
    },
  ]

  const artifacts = [
    {
      format: ".pdf",
      filename: "strategic_framework_v2.pdf",
      checksum: "sha256:a1b2c3d4...",
      size: "2.4 MB",
      exportedAt: "2 min ago",
      runId: "RUN_2024_001247",
    },
    {
      format: ".json",
      filename: "content_strategy_data.json",
      checksum: "sha256:e5f6g7h8...",
      size: "156 KB",
      exportedAt: "8 min ago",
      runId: "RUN_2024_001246",
    },
    {
      format: ".md",
      filename: "crisis_communication.md",
      checksum: "sha256:i9j0k1l2...",
      size: "89 KB",
      exportedAt: "15 min ago",
      runId: "RUN_2024_001245",
    },
  ]

  const moduleUsage = [
    {
      name: "Strategic Framework Generator",
      runs: 47,
      avgScore: 89.2,
      exports: 42,
      lastUsed: "2 min ago",
      category: "Strategy",
    },
    {
      name: "Content Strategy Builder",
      runs: 34,
      avgScore: 86.7,
      exports: 31,
      lastUsed: "8 min ago",
      category: "Content",
    },
    {
      name: "Crisis Communication Plan",
      runs: 28,
      avgScore: 91.4,
      exports: 26,
      lastUsed: "15 min ago",
      category: "Communication",
    },
    {
      name: "Market Analysis Framework",
      runs: 23,
      avgScore: 82.1,
      exports: 19,
      lastUsed: "23 min ago",
      category: "Analysis",
    },
    {
      name: "Brand Voice Generator",
      runs: 19,
      avgScore: 88.9,
      exports: 17,
      lastUsed: "1 hour ago",
      category: "Branding",
    },
  ]

  const underUsedModules = [
    { name: "Competitive Intelligence", runs: 2, potential: "High", category: "Analysis" },
    { name: "Stakeholder Mapping", runs: 1, potential: "Medium", category: "Strategy" },
    { name: "Risk Assessment Matrix", runs: 0, potential: "High", category: "Planning" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white font-mono">Dashboard</h1>
              <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-400/30 font-mono">
                Personal Workspace
              </Badge>
            </div>
            <p className="text-xl text-slate-300 font-mono">
              Your operational prompt engine. Track runs, optimize scores, export artifacts.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
              <Play className="w-4 h-4 mr-2" />
              New Run
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white font-mono text-lg flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                AI Discovery & Recommendations
                <Badge className="ml-2 bg-purple-600/20 text-purple-400 border-purple-400/30 font-mono text-xs">
                  Powered by Usage Patterns
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-400 font-mono">
                Personalized suggestions based on your workflow and performance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRecommendations ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  <span className="ml-3 text-slate-400 font-mono">Analyzing your patterns...</span>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendations.slice(0, 4).map((rec) => (
                    <div
                      key={rec.id}
                      className={`bg-slate-800/50 border rounded-lg p-4 ${
                        rec.priority === "high"
                          ? "border-emerald-400/30 bg-emerald-400/5"
                          : rec.priority === "medium"
                            ? "border-blue-400/30 bg-blue-400/5"
                            : "border-slate-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Lightbulb
                            className={`w-4 h-4 ${
                              rec.priority === "high"
                                ? "text-emerald-400"
                                : rec.priority === "medium"
                                  ? "text-blue-400"
                                  : "text-slate-400"
                            }`}
                          />
                          <Badge variant="outline" className="border-slate-600 text-slate-300 font-mono text-xs">
                            {rec.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs font-mono text-slate-400">{rec.confidence}%</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-white font-mono mb-2">{rec.title}</h4>
                      <p className="text-sm text-slate-400 font-mono mb-3">{rec.reason}</p>

                      {rec.insights && (
                        <div className="space-y-1 mb-3">
                          {rec.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                              <ArrowRight className="w-3 h-3" />
                              {insight}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          className={`font-mono ${
                            rec.priority === "high"
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          } text-white`}
                        >
                          {rec.action}
                        </Button>
                        {rec.potentialScore && (
                          <div className="text-xs font-mono text-slate-400">
                            Potential: <span className="text-emerald-400">{rec.potentialScore}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {primaryKPIs.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-mono text-slate-400">{kpi.label}</h3>
                  </div>
                  <Badge
                    variant="outline"
                    className={`border-emerald-400/30 text-emerald-400 bg-emerald-400/10 font-mono text-xs ${
                      kpi.trend === "down" && kpi.label === "Time-to-Artifact"
                        ? "border-emerald-400/30 text-emerald-400"
                        : ""
                    }`}
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-white font-mono mb-2">{kpi.value}</div>
                {kpi.target && <div className="text-xs text-slate-500 font-mono">Target: {kpi.target}</div>}
                {kpi.breakdown && (
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    .md:{kpi.breakdown.md} .json:{kpi.breakdown.json} .pdf:{kpi.breakdown.pdf} .zip:{kpi.breakdown.zip}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white font-mono text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                Trending Modules
                <Badge className="ml-2 bg-emerald-600/20 text-emerald-400 border-emerald-400/30 font-mono text-xs">
                  Community
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-400 font-mono">
                Most popular modules across all users this week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingModules.map((module, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-600"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="border-emerald-400/30 text-emerald-400 font-mono text-xs">
                        {module.code}
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-300 font-mono text-xs">
                        {module.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs font-mono text-emerald-400">{module.weeklyGrowth}</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-white font-mono text-sm">{module.name}</h4>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {module.userCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {module.avgScore}%
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white font-mono text-lg flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                Behavior Insights
                <Badge className="ml-2 bg-blue-600/20 text-blue-400 border-blue-400/30 font-mono text-xs">
                  Personal
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-400 font-mono">
                Patterns discovered in your usage data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {behaviorInsights.map((insight, idx) => (
                <div key={idx} className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white font-mono text-sm">{insight.pattern}</h4>
                    <Badge variant="outline" className="border-blue-400/30 text-blue-400 font-mono text-xs">
                      {insight.frequency}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mb-2">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">{insight.recommendation}</span>
                    <span className="text-xs text-emerald-400 font-mono">{insight.impact}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white font-mono text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                Score Trend (7d)
              </CardTitle>
              <CardDescription className="text-slate-400 font-mono">Average quality scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={scoreHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white font-mono text-lg flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                Module Performance
              </CardTitle>
              <CardDescription className="text-slate-400 font-mono">Runs vs average scores by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={modulePerformanceData}>
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
                  <Bar dataKey="runs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white font-mono text-lg flex items-center">
                <RechartsPieChart className="w-5 h-5 mr-2 text-yellow-400" />
                Score Distribution
              </CardTitle>
              <CardDescription className="text-slate-400 font-mono">Quality score ranges breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={scoreDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white font-mono text-lg flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                Time-to-Artifact Pattern
              </CardTitle>
              <CardDescription className="text-slate-400 font-mono">Performance by time of day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={timeToArtifactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Area type="monotone" dataKey="avgTime" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white font-mono text-lg flex items-center">
                <Target className="w-5 h-5 mr-2 text-emerald-400" />
                Quality Metrics Radar
              </CardTitle>
              <CardDescription className="text-slate-400 font-mono">
                Current performance across all dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-mono text-slate-400">Clarity</span>
                    <span className="text-sm font-mono text-emerald-400">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-mono text-slate-400">Execution</span>
                    <span className="text-sm font-mono text-blue-400">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-mono text-slate-400">Business Fit</span>
                    <span className="text-sm font-mono text-purple-400">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-mono text-slate-400">Ambiguity (inverted)</span>
                    <span className="text-sm font-mono text-yellow-400">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-700 p-1">
            <TabsTrigger value="runs" className="font-mono">
              Recent Runs
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="font-mono">
              Artifacts
            </TabsTrigger>
            <TabsTrigger value="modules" className="font-mono">
              Module Usage
            </TabsTrigger>
            <TabsTrigger value="scores" className="font-mono">
              Scores & Quality
            </TabsTrigger>
            <TabsTrigger value="history" className="font-mono">
              History
            </TabsTrigger>
          </TabsList>

          {/* ... existing TabsContent sections remain the same ... */}

          {/* Recent Runs Tab */}
          <TabsContent value="runs" className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-mono">Recent Runs</h2>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
                  >
                    Export Selected
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {recentRuns.map((run, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white font-mono">{run.module}</h3>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs ${
                            run.verdict === "PASS"
                              ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                              : "border-orange-400/30 text-orange-400 bg-orange-400/10"
                          }`}
                        >
                          {run.verdict}
                        </Badge>
                        {run.status === "needs_repair" && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                      </div>
                      <div className="grid grid-cols-6 gap-4 text-sm font-mono text-slate-400">
                        <span>ID: {run.id}</span>
                        <span>Score: {run.score}%</span>
                        <span>Duration: {run.duration}</span>
                        <span>Owner: {run.owner}</span>
                        <span>Created: {run.created}</span>
                        <span>Format: {run.format}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Re-run
                      </Button>
                      {run.status === "needs_repair" ? (
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-mono">
                          <Zap className="w-3 h-3 mr-1" />
                          Tighten
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Artifacts Tab */}
          <TabsContent value="artifacts" className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-mono">Artifacts / Exports</h2>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="border-slate-600 text-slate-300 font-mono cursor-pointer hover:bg-slate-800"
                  >
                    .md
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-slate-600 text-slate-300 font-mono cursor-pointer hover:bg-slate-800"
                  >
                    .json
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-slate-600 text-slate-300 font-mono cursor-pointer hover:bg-slate-800"
                  >
                    .pdf
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-slate-600 text-slate-300 font-mono cursor-pointer hover:bg-slate-800"
                  >
                    .zip
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artifacts.map((artifact, index) => (
                  <div key={index} className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-400/30 font-mono">
                        {artifact.format}
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">{artifact.size}</span>
                    </div>
                    <h3 className="font-bold text-white font-mono mb-2 truncate">{artifact.filename}</h3>
                    <div className="space-y-1 text-xs text-slate-400 font-mono mb-3">
                      <div>Checksum: {artifact.checksum}</div>
                      <div>Exported: {artifact.exportedAt}</div>
                      <div>Run: {artifact.runId}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Module Usage Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white font-mono mb-6">Module Usage</h2>

              <div className="space-y-4 mb-8">
                {moduleUsage.map((module, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white font-mono">{module.name}</h3>
                        <Badge variant="outline" className="border-slate-600 text-slate-300 font-mono text-xs">
                          {module.category}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm font-mono text-slate-400">
                        <span>Runs: {module.runs}</span>
                        <span>Avg Score: {module.avgScore}%</span>
                        <span>Exports: {module.exports}</span>
                        <span>Last Used: {module.lastUsed}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700 font-mono bg-transparent"
                    >
                      Open Module
                    </Button>
                  </div>
                ))}
              </div>

              <div className="bg-slate-800/30 border border-slate-600 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white font-mono mb-4">Your Top 3 Under-Used Modules</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {underUsedModules.map((module, index) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                      <h4 className="font-bold text-white font-mono mb-2">{module.name}</h4>
                      <div className="text-sm text-slate-400 font-mono mb-3">
                        <div>Runs: {module.runs}</div>
                        <div>Potential: {module.potential}</div>
                      </div>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono w-full">
                        Try Now
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Scores & Quality Tab */}
          <TabsContent value="scores" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Score Distribution</h3>
                <div className="space-y-4">
                  {scoreDistributionData.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-mono text-slate-400">{entry.range}</span>
                      <div className="flex-1 mx-4">
                        <Progress value={entry.percentage} className="h-2" />
                      </div>
                      <span className="text-sm font-mono text-white">{entry.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Repair Candidates (Score &lt; 80)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-orange-400/30">
                    <div>
                      <h4 className="font-bold text-white font-mono">Market Analysis Framework</h4>
                      <span className="text-sm text-slate-400 font-mono">Score: 76% • Run ID: RUN_2024_001244</span>
                    </div>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-mono">
                      <Zap className="w-3 h-3 mr-1" />
                      Tighten Prompt
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-mono">Complete History</h2>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Date Range
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
                  >
                    Export CSV
                  </Button>
                </div>
              </div>
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-mono">Infinite scroll history view for audits and compliance</p>
                <p className="text-sm text-slate-500 font-mono mt-2">Load more runs as you scroll</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default withAuth(DashboardPage, "dashboard:read")

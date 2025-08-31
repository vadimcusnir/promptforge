import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play,
  Download,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Settings,
  Zap,
  Target,
  Award,
  Calendar,
  User,
  ExternalLink,
  Copy,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowRight,
  Activity,
  Gauge,
  Shield,
  Star,
  Hash,
  Timer,
  Users,
  Layers,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Bell,
  Crown,
  Sparkles
} from 'lucide-react'

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('recent-runs')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data - replace with real API calls
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      runs7d: { value: 247, trend: 12.5, isUp: true },
      avgScore: { value: 87.3, trend: 3.2, isUp: true },
      exports: { value: 156, trend: -2.1, isUp: false },
      timeToArtifact: { value: 42, trend: -8.3, isUp: true },
      passRate: { value: 94.2, trend: 1.8, isUp: true }
    },
    recentRuns: [
      {
        id: 'run_abc123',
        module: 'Strategic Framework Generator',
        score: 92,
        verdict: 'passed',
        duration: 38,
        owner: 'You',
        created: '2024-01-15T10:30:00Z',
        status: 'completed',
        exports: ['md', 'json', 'pdf']
      },
      {
        id: 'run_def456',
        module: 'Content Strategy Builder',
        score: 85,
        verdict: 'passed',
        duration: 45,
        owner: 'Sarah Chen',
        created: '2024-01-15T09:15:00Z',
        status: 'completed',
        exports: ['md', 'txt']
      },
      {
        id: 'run_ghi789',
        module: 'Crisis Communication Plan',
        score: 76,
        verdict: 'needs_improvement',
        duration: 52,
        owner: 'You',
        created: '2024-01-15T08:45:00Z',
        status: 'completed',
        exports: []
      }
    ],
    artifacts: [
      {
        id: 'art_001',
        filename: 'strategic-framework-v2.pdf',
        format: 'pdf',
        size: '2.4 MB',
        checksum: 'sha256:abc123...',
        runId: 'run_abc123',
        exportedAt: '2024-01-15T10:32:00Z'
      },
      {
        id: 'art_002',
        filename: 'content-strategy.json',
        format: 'json',
        size: '156 KB',
        checksum: 'sha256:def456...',
        runId: 'run_def456',
        exportedAt: '2024-01-15T09:18:00Z'
      }
    ],
    moduleUsage: [
      { module: 'Strategic Framework Generator', runs: 45, avgScore: 89.2, exports: 42, lastUsed: '2024-01-15' },
      { module: 'Content Strategy Builder', runs: 32, avgScore: 86.7, exports: 28, lastUsed: '2024-01-15' },
      { module: 'Crisis Communication Plan', runs: 18, avgScore: 82.1, exports: 12, lastUsed: '2024-01-14' }
    ]
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'needs_improvement':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 80) return 'text-blue-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gradient-primary">Dashboard</h1>
              <Badge className="badge-primary">chatgpt-prompting.com</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search runs, modules, keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 input-industrial"
                />
              </div>
              
              <Link to="/generator">
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Run
                </Button>
              </Link>
              
              <Link to="/modules">
                <Button variant="outline" className="btn-outline">
                  <Layers className="w-4 h-4 mr-2" />
                  Browse Modules
                </Button>
              </Link>
              
              <Link to="/generator?mode=test">
                <Button variant="outline" className="btn-outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Try Generator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Primary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="card-industrial p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Runs (7d)</p>
                <p className="text-2xl font-bold">{dashboardData.kpis.runs7d.value}</p>
              </div>
              <div className={`flex items-center ${dashboardData.kpis.runs7d.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {dashboardData.kpis.runs7d.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm ml-1">{Math.abs(dashboardData.kpis.runs7d.trend)}%</span>
              </div>
            </div>
            <div className="mt-4">
              <Activity className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="card-industrial p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{dashboardData.kpis.avgScore.value}</p>
              </div>
              <div className={`flex items-center ${dashboardData.kpis.avgScore.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {dashboardData.kpis.avgScore.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm ml-1">{Math.abs(dashboardData.kpis.avgScore.trend)}%</span>
              </div>
            </div>
            <div className="mt-4">
              <Target className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="card-industrial p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exports</p>
                <p className="text-2xl font-bold">{dashboardData.kpis.exports.value}</p>
              </div>
              <div className={`flex items-center ${dashboardData.kpis.exports.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {dashboardData.kpis.exports.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm ml-1">{Math.abs(dashboardData.kpis.exports.trend)}%</span>
              </div>
            </div>
            <div className="mt-4">
              <Download className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="card-industrial p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time-to-Artifact</p>
                <p className="text-2xl font-bold">{dashboardData.kpis.timeToArtifact.value}s</p>
              </div>
              <div className={`flex items-center ${dashboardData.kpis.timeToArtifact.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {dashboardData.kpis.timeToArtifact.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm ml-1">{Math.abs(dashboardData.kpis.timeToArtifact.trend)}%</span>
              </div>
            </div>
            <div className="mt-4">
              <Timer className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="card-industrial p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold">{dashboardData.kpis.passRate.value}%</p>
              </div>
              <div className={`flex items-center ${dashboardData.kpis.passRate.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {dashboardData.kpis.passRate.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm ml-1">{Math.abs(dashboardData.kpis.passRate.trend)}%</span>
              </div>
            </div>
            <div className="mt-4">
              <Award className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        {/* Working Area Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted/30">
            <TabsTrigger value="recent-runs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Recent Runs
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Artifacts
            </TabsTrigger>
            <TabsTrigger value="module-usage" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Module Usage
            </TabsTrigger>
            <TabsTrigger value="scores-quality" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Scores & Quality
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              History
            </TabsTrigger>
          </TabsList>

          {/* Recent Runs Tab */}
          <TabsContent value="recent-runs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Runs</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Export Selected
                </Button>
              </div>
            </div>

            <Card className="card-industrial">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Run ID</th>
                      <th className="text-left p-4 font-medium">Module</th>
                      <th className="text-left p-4 font-medium">Score</th>
                      <th className="text-left p-4 font-medium">Verdict</th>
                      <th className="text-left p-4 font-medium">Duration</th>
                      <th className="text-left p-4 font-medium">Owner</th>
                      <th className="text-left p-4 font-medium">Created</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentRuns.map((run) => (
                      <tr key={run.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Hash className="w-3 h-3 text-muted-foreground" />
                            <code className="text-sm font-mono">{run.id}</code>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{run.module}</div>
                        </td>
                        <td className="p-4">
                          <span className={`font-bold ${getScoreColor(run.score)}`}>
                            {run.score}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getVerdictIcon(run.verdict)}
                            <span className="capitalize">{run.verdict.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span>{run.duration}s</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span>{run.owner}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatDate(run.created)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Other tabs content would continue here... */}
        </Tabs>
      </div>
    </div>
  )
}

export default DashboardPage


import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Shield,
  Users,
  CreditCard,
  Key,
  Settings,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Crown,
  Zap,
  Globe,
  Lock,
  Unlock,
  UserPlus,
  RotateCcw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  Bell,
  Gauge,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Star,
  Hash,
  Timer,
  FileText,
  Folder,
  Archive,
  Layers,
  Code,
  Terminal,
  Bug,
  Wrench,
  Cog,
  Power,
  Pause,
  Play,
  SkipForward,
  Rewind,
  FastForward
} from 'lucide-react'

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEnvironment, setSelectedEnvironment] = useState('production')

  // Mock admin data - replace with real API calls
  const [adminData, setAdminData] = useState({
    kpis: {
      activeSubscriptions: { value: 1247, status: 'healthy', trend: 8.3 },
      entitlementCoverage: { value: 94.2, status: 'good', trend: 2.1 },
      apiUsage24h: { value: 15847, rateLimitHits: 23, trend: -5.2 },
      exportIntegrity: { value: 100, manifests: 1247, checksums: 1247 },
      incidents7d: { open: 0, closed: 3, trend: -2 }
    },
    members: [
      {
        id: 1,
        name: 'John Smith',
        email: 'john@company.com',
        role: 'owner',
        lastLogin: '2024-01-15T10:30:00Z',
        status: 'active'
      },
      {
        id: 2,
        name: 'Sarah Chen',
        email: 'sarah@company.com',
        role: 'admin',
        lastLogin: '2024-01-15T09:15:00Z',
        status: 'active'
      },
      {
        id: 3,
        name: 'Mike Rodriguez',
        email: 'mike@company.com',
        role: 'member',
        lastLogin: '2024-01-14T16:45:00Z',
        status: 'active'
      }
    ],
    subscription: {
      plan: 'Enterprise',
      status: 'active',
      seats: { used: 12, total: 25 },
      renewal: '2024-06-15',
      billing: 'monthly',
      amount: 2499
    },
    apiKeys: [
      {
        id: 'key_1',
        name: 'Production API Key',
        keyHash: 'pk_live_abc123...',
        created: '2024-01-01T00:00:00Z',
        lastUsed: '2024-01-15T10:30:00Z',
        rateLimit: 10000,
        status: 'active'
      },
      {
        id: 'key_2',
        name: 'Development API Key',
        keyHash: 'pk_test_def456...',
        created: '2024-01-10T00:00:00Z',
        lastUsed: '2024-01-15T08:15:00Z',
        rateLimit: 1000,
        status: 'active'
      }
    ],
    systemHealth: {
      uptime: 99.97,
      p95TTA: 42,
      passRate: 94.2,
      errorBudget: 87.3,
      hotspots: [
        { endpoint: '/api/run/strategic-framework', errors: 12, type: '4xx' },
        { endpoint: '/api/exports/download', errors: 8, type: '5xx' }
      ]
    }
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'admin':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'member':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gradient-primary">Admin Console</h1>
              <Badge className="badge-primary">chatgpt-prompting.com</Badge>
              <Badge variant="outline" className={selectedEnvironment === 'production' ? 'border-red-500 text-red-400' : 'border-yellow-500 text-yellow-400'}>
                {selectedEnvironment === 'production' ? 'PROD' : 'STAGING'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
              
              <Button variant="outline" size="sm">
                <Key className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
              
              <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-600 hover:bg-yellow-600/10">
                <Power className="w-4 h-4 mr-2" />
                Toggle Coming-Soon
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="card-industrial p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-bold">{adminData.kpis.activeSubscriptions.value}</p>
              </div>
              <div className="flex items-center text-green-500">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm ml-1">{adminData.kpis.activeSubscriptions.trend}%</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-muted-foreground capitalize">{adminData.kpis.activeSubscriptions.status}</span>
            </div>
          </Card>

          <Card className="card-industrial p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entitlement Coverage</p>
                <p className="text-2xl font-bold">{adminData.kpis.entitlementCoverage.value}%</p>
              </div>
              <div className="flex items-center text-green-500">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm ml-1">{adminData.kpis.entitlementCoverage.trend}%</span>
              </div>
            </div>
            <div className="mt-4">
              <Shield className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="card-industrial p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Usage (24h)</p>
                <p className="text-2xl font-bold">{adminData.kpis.apiUsage24h.value.toLocaleString()}</p>
              </div>
              <div className="flex items-center text-red-500">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm ml-1">{Math.abs(adminData.kpis.apiUsage24h.trend)}%</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">
                Rate limit hits: {adminData.kpis.apiUsage24h.rateLimitHits}
              </div>
            </div>
          </Card>

          <Card className="card-industrial p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Export Integrity</p>
                <p className="text-2xl font-bold">{adminData.kpis.exportIntegrity.value}%</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {adminData.kpis.exportIntegrity.manifests} manifests + checksums
            </div>
          </Card>

          <Card className="card-industrial p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Incidents (7d)</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-500">{adminData.kpis.incidents7d.open}</span>
                  <span className="text-sm text-muted-foreground">open</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">{adminData.kpis.incidents7d.closed} closed</div>
              </div>
            </div>
            <div className="mt-4">
              <Activity className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        {/* Admin Workspace Sections */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-muted/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Members
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Billing
            </TabsTrigger>
            <TabsTrigger value="entitlements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Entitlements
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              API Keys
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              System
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Audit
            </TabsTrigger>
            <TabsTrigger value="controls" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Controls
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-industrial p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">System Health</h3>
                  <Gauge className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Uptime</span>
                    <span className="font-bold text-green-500">{adminData.systemHealth.uptime}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>P95 TTA</span>
                    <span className="font-bold">{adminData.systemHealth.p95TTA}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pass Rate</span>
                    <span className="font-bold">{adminData.systemHealth.passRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Budget</span>
                    <span className="font-bold">{adminData.systemHealth.errorBudget}%</span>
                  </div>
                </div>
              </Card>

              <Card className="card-industrial p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Quick Actions</h3>
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <Button className="w-full btn-primary" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                  <Button className="w-full btn-outline" size="sm">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Billing
                  </Button>
                  <Button className="w-full btn-outline" size="sm">
                    <Key className="w-4 h-4 mr-2" />
                    Create API Key
                  </Button>
                  <Button className="w-full btn-outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Audit
                  </Button>
                </div>
              </Card>

              <Card className="card-industrial p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Recent Activity</h3>
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>API key rotated successfully</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-3 h-3 text-blue-500" />
                    <span>New member invited</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-3 h-3 text-yellow-500" />
                    <span>Entitlements updated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="w-3 h-3 text-purple-500" />
                    <span>Audit report generated</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Members & Roles Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Members & Roles</h2>
              <Button className="btn-primary">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </div>

            <Card className="card-industrial">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Role</th>
                      <th className="text-left p-4 font-medium">Last Login</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminData.members.map((member) => (
                      <tr key={member.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getRoleColor(member.role)}>
                            {member.role === 'owner' && <Crown className="w-3 h-3 mr-1" />}
                            {member.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                            {member.role === 'member' && <Users className="w-3 h-3 mr-1" />}
                            {member.role}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatDate(member.lastLogin)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(member.status)}
                            <span className="capitalize">{member.status}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="w-3 h-3" />
                            </Button>
                            {member.role !== 'owner' && (
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Plans & Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Plans & Billing</h2>
              <div className="flex items-center space-x-2">
                <Button className="btn-primary">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Stripe Portal
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-industrial p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Current Subscription</h3>
                  <Badge className="badge-primary">{adminData.subscription.plan}</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Status</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="capitalize font-medium">{adminData.subscription.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Seats</span>
                    <span className="font-medium">
                      {adminData.subscription.seats.used} / {adminData.subscription.seats.total}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Renewal</span>
                    <span className="font-medium">{formatDate(adminData.subscription.renewal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span className="font-bold text-primary">${adminData.subscription.amount}/month</span>
                  </div>
                </div>
              </Card>

              <Card className="card-industrial p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Webhook Status</h3>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Last Event</span>
                    <span className="font-medium">invoice.payment_succeeded</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Received</span>
                    <span className="font-medium">{formatDate('2024-01-15T10:30:00Z')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Error</span>
                    <span className="text-muted-foreground">None</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reconcile Webhooks
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">API Keys</h2>
              <div className="flex items-center space-x-2">
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Key
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Postman Collection
                </Button>
              </div>
            </div>

            <Card className="card-industrial">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Name</th>
                      <th className="text-left p-4 font-medium">Key Hash</th>
                      <th className="text-left p-4 font-medium">Created</th>
                      <th className="text-left p-4 font-medium">Last Used</th>
                      <th className="text-left p-4 font-medium">Rate Limit</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminData.apiKeys.map((key) => (
                      <tr key={key.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="font-medium">{key.name}</div>
                        </td>
                        <td className="p-4">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {key.keyHash}
                          </code>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatDate(key.created)}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatDate(key.lastUsed)}
                        </td>
                        <td className="p-4">
                          <span className="font-medium">{key.rateLimit.toLocaleString()}/hour</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(key.status)}
                            <span className="capitalize">{key.status}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Pause className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400">
                              <Trash2 className="w-3 h-3" />
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

          {/* System Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            <h2 className="text-2xl font-bold">System Controls</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-industrial p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Global Controls</h3>
                  <Power className="w-5 h-5 text-primary" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Coming Soon Mode</div>
                      <div className="text-sm text-muted-foreground">Global gate for new signups</div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Maintenance Mode</div>
                      <div className="text-sm text-muted-foreground">Read-only access with banner</div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Beta Features</div>
                      <div className="text-sm text-muted-foreground">Enable experimental features</div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </Card>

              <Card className="card-industrial p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Emergency Actions</h3>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full text-red-500 border-red-500 hover:bg-red-500/10">
                    <Power className="w-4 h-4 mr-2" />
                    Emergency Stop
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-yellow-500 border-yellow-500 hover:bg-yellow-500/10">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause All Operations
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Rewind className="w-4 h-4 mr-2" />
                    Rollback Ruleset
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Invalidate Cache
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPage


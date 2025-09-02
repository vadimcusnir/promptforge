import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, History, Search, TrendingUp } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { HeroBlock } from "@/components/layout/hero-block"

export default function DashboardPage() {
  return (
    <PageLayout variant="app" userPlan="pro" userName="John Doe" orgName="Acme Corp">
      <HeroBlock title="Dashboard" subtitle="Monitor your prompt generation activity and performance" />

      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground font-space-grotesk">
                  Total Runs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-cinzel">247</div>
                <div className="text-xs text-green-500 flex items-center gap-1 font-space-grotesk">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground font-space-grotesk">
                  Avg Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#CDA434] font-cinzel">84.2</div>
                <div className="text-xs text-green-500 flex items-center gap-1 font-space-grotesk">
                  <TrendingUp className="w-3 h-3" />
                  +3.1 from last month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground font-space-grotesk">
                  Modules Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-cinzel">12</div>
                <div className="text-xs text-muted-foreground font-space-grotesk">of 50 available</div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground font-space-grotesk">Exports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-cinzel">89</div>
                <div className="text-xs text-muted-foreground font-space-grotesk">this month</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-cinzel flex items-center gap-2">
                        <History className="w-5 h-5 text-[#CDA434]" />
                        Recent Runs
                      </CardTitle>
                      <CardDescription className="font-space-grotesk">Your latest prompt generations</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search..."
                          className="pl-10 w-48 bg-input border-border focus:ring-[#00FF7F]"
                        />
                      </div>
                      <Select>
                        <SelectTrigger className="w-32 bg-input border-border">
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="strategic">Strategic</SelectItem>
                          <SelectItem value="content">Content</SelectItem>
                          <SelectItem value="analytics">Analytics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: "abc123",
                        module: "M01 - SOP Forge",
                        score: 87,
                        date: "2025-01-21 15:30",
                        status: "completed",
                      },
                      {
                        id: "def456",
                        module: "M12 - Visibility Diag",
                        score: 92,
                        date: "2025-01-21 14:15",
                        status: "completed",
                      },
                      {
                        id: "ghi789",
                        module: "M01 - SOP Forge",
                        score: 78,
                        date: "2025-01-21 13:45",
                        status: "completed",
                      },
                      {
                        id: "jkl012",
                        module: "M10 - Process Map",
                        score: 85,
                        date: "2025-01-21 12:20",
                        status: "completed",
                      },
                    ].map((run) => (
                      <div
                        key={run.id}
                        className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <div className="font-medium font-space-grotesk">{run.module}</div>
                            <div className="text-sm text-muted-foreground font-space-grotesk">
                              #{run.id} • {run.date}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium text-[#CDA434] font-space-grotesk">Score: {run.score}</div>
                            <Badge variant="outline" className="text-xs">
                              {run.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Performance Chart */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="font-cinzel flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#CDA434]" />
                    Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-card/50 rounded-lg flex items-center justify-center">
                    <div className="text-muted-foreground text-sm font-space-grotesk">Chart placeholder</div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="font-cinzel">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-[#CDA434] hover:bg-[#CDA434]/90">New Generation</Button>
                  <Button variant="outline" className="w-full border-border bg-transparent">
                    View All Modules
                  </Button>
                  <Button variant="outline" className="w-full border-border bg-transparent">
                    Export History
                  </Button>
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="font-cinzel">Usage This Month</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between font-space-grotesk">
                    <span className="text-muted-foreground">Generations</span>
                    <span>23 / 100</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-[#CDA434] h-2 rounded-full" style={{ width: "23%" }}></div>
                  </div>
                  <div className="flex justify-between font-space-grotesk">
                    <span className="text-muted-foreground">Exports</span>
                    <span>12 / 50</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-[#CDA434] h-2 rounded-full" style={{ width: "24%" }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

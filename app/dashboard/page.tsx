"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Download, 
  FileText, 
  BarChart3, 
  Users, 
  Settings, 
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Zap
} from "lucide-react";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabaseAuth, Workspace } from "@/lib/auth/supabase-auth";
import { ExportPipeline } from "@/lib/export/export-pipeline";
import type { GeneratedPrompt, TestResult } from "@/types/promptforge";

interface PromptHistory {
  id: string;
  prompt: any;
  sevenDConfig: any;
  moduleId: string;
  createdAt: Date;
  status: string;
  score: number;
  exportedFormats: string[];
}

interface DashboardStats {
  totalRuns: number;
  successfulRuns: number;
  avgScore: number;
  monthlyRunsRemaining: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState(supabaseAuth.getCurrentState());
  const [stats, setStats] = useState<DashboardStats>({
    totalRuns: 0,
    successfulRuns: 0,
    avgScore: 0,
    monthlyRunsRemaining: 0,
  });
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PromptHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [exportPipeline] = useState(() => ExportPipeline.getInstance());

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = supabaseAuth.subscribe(setAuthState);
    
    // Load dashboard data
    if (authState.user && authState.workspace) {
      loadDashboardData();
    }

    return unsubscribe;
  }, [authState.user, authState.workspace]);

  useEffect(() => {
    const filtered = promptHistory.filter((item) => {
      const matchesSearch = item.prompt?.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.moduleId.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (statusFilter === "all") return matchesSearch;
      if (statusFilter === "completed") return item.status === "completed";
      if (statusFilter === "failed") return item.status === "failed";
      if (statusFilter === "pending") return item.status === "pending";
      return matchesSearch;
    });
    
    setFilteredHistory(filtered);
  }, [promptHistory, searchQuery, statusFilter]);

  const loadDashboardData = async () => {
    if (!authState.user || !authState.workspace) return;

    try {
      // Use the public method instead of accessing private property
      const history = await supabaseAuth.getPromptHistory(authState.user.id, authState.workspace.id);
      
      if (history) {
        const transformedHistory: PromptHistory[] = history.map((item: any) => ({
          id: item.id,
          prompt: item.prompt,
          sevenDConfig: item.seven_d_config,
          moduleId: item.module_id,
          createdAt: new Date(item.created_at),
          status: item.status || 'completed',
          score: item.score || 0,
          exportedFormats: item.exported_formats || [],
        }));
        
        setPromptHistory(transformedHistory);
        
        // Calculate stats
        const totalRuns = transformedHistory.length;
        const successfulRuns = transformedHistory.filter(h => h.status === 'completed').length;
        const avgScore = totalRuns > 0 
          ? transformedHistory.reduce((sum, h) => sum + h.score, 0) / totalRuns 
          : 0;
        
        setStats({
          totalRuns,
          successfulRuns,
          avgScore: Math.round(avgScore * 100) / 100,
          monthlyRunsRemaining: getPlanLimit('free'), // Default to free plan
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanLimit = (planTier: string): number => {
    switch (planTier) {
      case 'free': return 10;
      case 'creator': return 100;
      case 'pro': return 1000;
      case 'enterprise': return 10000;
      default: return 10;
    }
  };

  const handleExport = async (prompt: GeneratedPrompt, format: string) => {
    try {
      const result = await exportPipeline.exportPrompt(
        prompt,
        format,
        { planTier: authState.workspace?.plan_tier || 'free' },
        false // Not a trial user
      );

      if (result.success && result.data) {
        // Create download
        const blob = Buffer.isBuffer(result.data) 
          ? new Blob([result.data]) 
          : new Blob([result.data], { type: 'text/plain' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt-${prompt.id}.${format}`;
        a.click();
        URL.revokeObjectURL(url);

        // Update exported formats in history
        updateExportedFormats(prompt.id, format);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const updateExportedFormats = async (promptId: string, format: string) => {
    setPromptHistory(prev => prev.map(item => 
      item.prompt.id === promptId 
        ? { ...item, exportedFormats: [...item.exportedFormats, format] }
        : item
    ));
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Star className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <Star className="h-4 w-4 text-yellow-600" />;
    return <Star className="h-4 w-4 text-red-600" />;
  };

  if (authState.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authState.user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipLink />
      <Header showBreadcrumbs={true} />

      <main id="main" tabIndex={-1}>
        <div className="container mx-auto max-w-7xl px-6 py-8">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {authState.user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {authState.workspace?.plan_tier || 'free'} Plan
              </Badge>
              <Button onClick={() => router.push('/generator')}>
                <Plus className="w-4 h-4 mr-2" />
                New Prompt
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRuns}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.monthlyRunsRemaining} / {getPlanLimit(authState.workspace?.plan_tier || 'free')} this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalRuns > 0 ? Math.round((stats.successfulRuns / stats.totalRuns) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Successful runs this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgScore}%</div>
                <p className="text-xs text-muted-foreground">
                  Based on tested prompts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining Runs</CardTitle>
                <Zap className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.monthlyRunsRemaining}</div>
                <p className="text-xs text-muted-foreground">
                  Runs remaining this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalRuns > 0 ? Math.round((stats.successfulRuns / stats.totalRuns) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Successful runs this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workspace</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium">{authState.workspace?.name}</div>
                <p className="text-xs text-muted-foreground">
                  {authState.workspace?.slug}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Prompt History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Prompt History</CardTitle>
                  <CardDescription>
                    Your generated prompts, test results, and exports
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prompts</SelectItem>
                    <SelectItem value="tested">Tested</SelectItem>
                    <SelectItem value="untested">Untested</SelectItem>
                    <SelectItem value="exported">Exported</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* History List */}
              <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No prompts found</p>
                    <p className="text-sm">
                      {searchQuery || statusFilter !== "all" 
                        ? "Try adjusting your search criteria" 
                        : "Generate your first prompt to get started"
                      }
                    </p>
                  </div>
                ) : (
                  filteredHistory.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                                                      <h3 className="font-medium">
                            Module {item.moduleId}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {item.sevenDConfig?.domain || 'Unknown'}
                          </Badge>
                            {item.score > 0 && (
                              <div className="flex items-center gap-1">
                                {getScoreIcon(item.score)}
                                <span className={`text-sm font-medium ${getScoreColor(item.score)}`}>
                                  {item.score}%
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {typeof item.prompt === 'string' ? item.prompt.substring(0, 200) + '...' : 'Prompt content'}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {item.createdAt.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              Module: {item.moduleId}
                            </div>
                            {item.score > 0 && (
                              <div className="flex items-center gap-1">
                                <BarChart3 className="w-3 h-3" />
                                Score: {item.score}%
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-1">
                            {item.exportedFormats.map((format) => (
                              <Badge key={format} variant="secondary" className="text-xs">
                                .{format}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/generator?prompt=${item.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExport(item.prompt, 'txt')}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

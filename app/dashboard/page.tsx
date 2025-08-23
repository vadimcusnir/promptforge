'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RunTable } from '@/components/dashboard/RunTable';
import { RunDetails } from '@/components/dashboard/RunDetails';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePremiumFeatures } from '@/lib/premium-features';
import { Search, Filter, Calendar, Hash } from 'lucide-react';

interface RunRecord {
  id: string;
  hash: string;
  module: string;
  score: number;
  status: 'PASS' | 'PARTIAL' | 'FAIL';
  date: Date;
  exportType: string[];
  config7D: any;
  telemetry: any;
  actions: string[];
}

export default function DashboardPage() {
  const { tier, canAccessCloudHistory } = usePremiumFeatures();
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [selectedRun, setSelectedRun] = useState<RunRecord | null>(null);
  const [filters, setFilters] = useState({
    module: 'all',
    score: 'all',
    dateRange: 'all',
    search: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRunHistory();
  }, [tier]);

  const loadRunHistory = async () => {
    setLoading(true);
    try {
      // Simulate loading run history based on tier
      const mockRuns: RunRecord[] =
        tier === 'Basic'
          ? generateMockRuns(3)
          : // Basic: limited local history
            generateMockRuns(25); // Pro/Enterprise: full cloud history

      setRuns(mockRuns);
    } catch (error) {
      console.error('Failed to load run history:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRuns = (count: number): RunRecord[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `run_${i + 1}`,
      hash: `pf_m${String(Math.floor(Math.random() * 50) + 1).padStart(2, '0')}_${Math.random().toString(36).substring(2, 8)}`,
      module: `M${String(Math.floor(Math.random() * 50) + 1).padStart(2, '0')} – ${['SaaS Funnel', 'Content Strategy', 'Brand Voice', 'Sales Copy', 'Email Sequence'][Math.floor(Math.random() * 5)]}`,
      score: Math.floor(Math.random() * 40) + 60,
      status: Math.random() > 0.7 ? 'FAIL' : Math.random() > 0.3 ? 'PASS' : 'PARTIAL',
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      exportType: ['txt', 'md', 'json', 'pdf'].slice(0, Math.floor(Math.random() * 3) + 1),
      config7D: {
        domain: 'SaaS',
        scale: 'Startup',
        urgency: 'High',
        complexity: 'Medium',
      },
      telemetry: {
        tta: Math.floor(Math.random() * 120) + 30,
        iterations: Math.floor(Math.random() * 5) + 1,
      },
      actions: ['Generate', 'Test', 'Export'],
    }));
  };

  const filteredRuns = runs.filter(run => {
    if (
      filters.module !== 'all' &&
      !run.moduleData.toLowerCase().includes(filters.moduleData.toLowerCase())
    )
      return false;
    if (filters.score !== 'all' && run.status !== filters.score) return false;
    if (
      filters.search &&
      !run.hash.toLowerCase().includes(filters.search.toLowerCase()) &&
      !run.moduleData.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold font-heading text-white">Run History</h1>
            <Badge variant="outline" className="text-gold-industrial border-gold-industrial">
              {tier} Plan
            </Badge>
          </div>
          <p className="text-lead-gray text-lg">Scores. Exports. Reloadable prompts.</p>
        </div>

        {/* Filters */}
        <Card className="glass-effect p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-lead-gray" />
              <Input
                placeholder="Search by hash or moduleData..."
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 bg-black/50 border-lead-gray/30 text-white placeholder:text-lead-gray"
              />
            </div>

            <Select
              value={filters.module}
              onValueChange={value => setFilters(prev => ({ ...prev, module: value }))}
            >
              <SelectTrigger className="bg-black/50 border-lead-gray/30 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent className="bg-black border-lead-gray/30">
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="saas">SaaS Modules</SelectItem>
                <SelectItem value="content">Content Modules</SelectItem>
                <SelectItem value="brand">Brand Modules</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.score}
              onValueChange={value => setFilters(prev => ({ ...prev, score: value }))}
            >
              <SelectTrigger className="bg-black/50 border-lead-gray/30 text-white">
                <SelectValue placeholder="Filter by score" />
              </SelectTrigger>
              <SelectContent className="bg-black border-lead-gray/30">
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="PASS">PASS</SelectItem>
                <SelectItem value="PARTIAL">PARTIAL</SelectItem>
                <SelectItem value="FAIL">FAIL</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={value => setFilters(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger className="bg-black/50 border-lead-gray/30 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent className="bg-black border-lead-gray/30">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Run Table */}
          <div className="lg:col-span-2">
            <RunTable
              runs={filteredRuns}
              selectedRun={selectedRun}
              onSelectRun={setSelectedRun}
              tier={tier}
            />
          </div>

          {/* Run Details Panel */}
          <div className="lg:col-span-1">
            {selectedRun ? (
              <RunDetails run={selectedRun} tier={tier} />
            ) : (
              <Card className="glass-effect p-6">
                <div className="text-center text-lead-gray">
                  <Hash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a run to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Tier Limitation Notice */}
        {tier === 'Basic' && (
          <Card className="glass-effect p-4 mt-6 border-gold-industrial/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gold-industrial">
                  Showing last 10 runs (local storage). Upgrade to Pro for full cloud history.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-gold-industrial text-gold-industrial hover:bg-gold-industrial hover:text-black bg-transparent"
              >
                Upgrade to Pro
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRunsLocal } from '@/lib/contexts/runs-local-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  FileText, 
  Star, 
  RotateCcw, 
  Trash2, 
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RunsHistoryProps {
  onRestoreRun?: (run: any) => void;
  showActions?: boolean;
}

export function RunsHistory({ onRestoreRun, showActions = true }: RunsHistoryProps) {
  const { runs, removeRun, clearRuns } = useRunsLocal();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'score' | 'module'>('timestamp');

  // Get unique modules for filtering
  const modules = Array.from(new Set(runs.map(run => run.moduleName)));

  // Filter and sort runs
  const filteredRuns = runs
    .filter(run => {
      const matchesSearch = run.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          run.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          run.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesModule = filterModule === 'all' || run.moduleName === filterModule;
      
      return matchesSearch && matchesModule;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'score':
          const scoreA = a.score?.composite || 0;
          const scoreB = b.score?.composite || 0;
          return scoreB - scoreA;
        case 'module':
          return a.moduleName.localeCompare(b.moduleName);
        default:
          return 0;
      }
    });

  const handleRestore = (run: any) => {
    if (onRestoreRun) {
      onRestoreRun(run);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (runs.length === 0) {
    return (
      <Card className="bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)]">
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-[#ECFEFF]/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#ECFEFF] mb-2">No runs yet</h3>
          <p className="text-[#ECFEFF]/60">
            Your prompt generation history will appear here. Start creating prompts to see your progress.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#ECFEFF]">Runs History</h2>
          <p className="text-[#ECFEFF]/60">
            {runs.length} runs • {runs.filter(r => r.score).length} scored
          </p>
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearRuns}
              className="border-[rgba(255,255,255,0.12)] text-[#ECFEFF] hover:bg-[rgba(255,255,255,0.06)]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ECFEFF]/50 w-4 h-4" />
          <Input
            placeholder="Search runs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)] text-[#ECFEFF] placeholder:text-[#ECFEFF]/50"
          />
        </div>
        
        <Select value={filterModule} onValueChange={setFilterModule}>
          <SelectTrigger className="bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)] text-[#ECFEFF]">
            <SelectValue placeholder="Filter by module" />
          </SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] border-[rgba(255,255,255,0.12)]">
            <SelectItem value="all">All Modules</SelectItem>
            {modules.map(module => (
              <SelectItem key={module} value={module}>{module}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)] text-[#ECFEFF]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] border-[rgba(255,255,255,0.12)]">
            <SelectItem value="timestamp">Most Recent</SelectItem>
            <SelectItem value="score">Highest Score</SelectItem>
            <SelectItem value="module">Module Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Runs List */}
      <div className="space-y-4">
        {filteredRuns.map((run) => (
          <Card key={run.id} className="bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.20)] transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-[#C7A869] text-[#C7A869] bg-[#C7A869]/10">
                      {run.moduleName}
                    </Badge>
                    {run.score && (
                      <Badge className={getScoreColor(run.score.composite)}>
                        {run.score.composite}/100
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-[#ECFEFF] text-lg line-clamp-2">
                    {run.prompt.length > 100 ? `${run.prompt.substring(0, 100)}...` : run.prompt}
                  </CardTitle>
                </div>
                
                {showActions && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestore(run)}
                      className="border-[#C7A869] text-[#C7A869] hover:bg-[#C7A869]/10"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeRun(run.id)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Score breakdown if available */}
                {run.score && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-sm text-[#ECFEFF]/60">Clarity</div>
                      <div className="text-lg font-semibold text-[#ECFEFF]">{run.score.clarity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-[#ECFEFF]/60">Execution</div>
                      <div className="text-lg font-semibold text-[#ECFEFF]">{run.score.execution}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-[#ECFEFF]/60">Ambiguity</div>
                      <div className="text-lg font-semibold text-[#ECFEFF]">{run.score.ambiguity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-[#ECFEFF]/60">Business Fit</div>
                      <div className="text-lg font-semibold text-[#ECFEFF]">{run.score.business_fit}</div>
                    </div>
                  </div>
                )}
                
                {/* Tags */}
                {run.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {run.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-[rgba(255,255,255,0.08)] text-[#ECFEFF]/80">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-[#ECFEFF]/60">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(run.timestamp), { addSuffix: true })}
                    </div>
                    {run.response && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {run.response.length > 50 ? `${run.response.length} chars` : 'Response'}
                      </div>
                    )}
                  </div>
                  
                  {run.score && (
                    <div className="text-right">
                      <div className="text-xs text-[#ECFEFF]/40">Overall</div>
                      <div className={`font-medium ${getScoreColor(run.score.composite).split(' ')[0]} ${getScoreColor(run.score.composite).split(' ')[1]}`}>
                        {getScoreLabel(run.score.composite)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRuns.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-[#ECFEFF]/60">No runs found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}

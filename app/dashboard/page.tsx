'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { RunsHistory } from '@/components/runs-history';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRunsLocal } from '@/lib/contexts/runs-local-context';
import { Search, Filter, Calendar, Hash, LogOut, User } from 'lucide-react';

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { runs } = useRunsLocal();
  const router = useRouter();
  const [filters, setFilters] = useState({
    module: 'all',
    score: 'all',
    dateRange: 'all',
    search: '',
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleRestoreRun = (run: any) => {
    // Navigate to generator with run data
    router.push(`/generator?restore=${run.id}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#ECFEFF] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-[rgba(255,255,255,0.06)] rounded w-1/4"></div>
            <div className="h-4 bg-[rgba(255,255,255,0.06)] rounded w-1/2"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-[rgba(255,255,255,0.06)] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#ECFEFF]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#ECFEFF]">Dashboard</h1>
              <p className="text-[#ECFEFF]/60 text-lg">Your prompt generation history and analytics</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#ECFEFF]/80">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-[rgba(255,255,255,0.12)] text-[#ECFEFF] hover:bg-[rgba(255,255,255,0.06)]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)]">
              <div className="p-4">
                <div className="text-2xl font-bold text-[#ECFEFF]">{runs.length}</div>
                <div className="text-[#ECFEFF]/60 text-sm">Total Runs</div>
              </div>
            </Card>
            
            <Card className="bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)]">
              <div className="p-4">
                <div className="text-2xl font-bold text-[#ECFEFF]">
                  {runs.filter(r => r.score).length}
                </div>
                <div className="text-[#ECFEFF]/60 text-sm">Scored Runs</div>
              </div>
            </Card>
            
            <Card className="bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)]">
              <div className="p-4">
                <div className="text-2xl font-bold text-[#ECFEFF]">
                  {runs.length > 0 ? Math.round(runs.reduce((acc, r) => acc + (r.score?.composite || 0), 0) / runs.filter(r => r.score).length) : 0}
                </div>
                <div className="text-[#ECFEFF]/60 text-sm">Avg Score</div>
              </div>
            </Card>
            
            <Card className="bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)]">
              <div className="p-4">
                <div className="text-2xl font-bold text-[#ECFEFF]">
                  {Array.from(new Set(runs.map(r => r.moduleName))).length}
                </div>
                <div className="text-[#ECFEFF]/60 text-sm">Modules Used</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Runs History */}
        <RunsHistory onRestoreRun={handleRestoreRun} />
      </div>
    </div>
  );
}

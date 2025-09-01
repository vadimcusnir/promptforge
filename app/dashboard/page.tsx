import type { Metadata } from 'next'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export const metadata: Metadata = {
  title: 'Dashboard - PromptForge v3.1',
  description: 'Monitor your prompt engineering runs, exports, and performance metrics.',
  robots: 'noindex, nofollow', // Dashboard is private
}

// Mock data for development
const mockData = {
  runs: [
    {
      id: '1',
      module: 'Content Generation',
      domain: 'Marketing',
      score: 85.2,
      verdict: 'success',
      format: 'json',
      created_at: new Date().toISOString(),
      user_name: 'John Doe'
    },
    {
      id: '2',
      module: 'Code Review',
      domain: 'Development',
      score: 72.1,
      verdict: 'partial',
      format: 'pdf',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      user_name: 'Jane Smith'
    }
  ],
  artifacts: [
    {
      id: '1',
      name: 'marketing-campaign.json',
      type: 'json',
      size: 2048,
      created_at: new Date().toISOString(),
      run_id: '1',
      run_score: 85.2,
      checksum: 'abc123def456',
      is_watermarked: false
    }
  ],
  modules: [
    {
      module_id: '1',
      module_name: 'Content Generation',
      category: 'Marketing',
      usage_count: 45,
      success_rate: 0.89,
      avg_score: 82.3,
      last_used: new Date().toISOString(),
      trend_7d: 0.15,
      trend_30d: 0.08,
      unique_users: 12,
      total_runs: 45
    }
  ],
  scoreData: {
    current_score: 78.5,
    target_score: 80,
    trend_7d: 0.12,
    trend_30d: 0.08,
    total_runs: 150,
    successful_runs: 128,
    failed_runs: 22,
    avg_response_time: 2500,
    quality_metrics: {
      clarity: 82.1,
      relevance: 79.3,
      completeness: 76.8,
      consistency: 81.2
    },
    recent_scores: [
      { date: new Date().toISOString(), score: 78.5, run_id: '1' },
      { date: new Date(Date.now() - 86400000).toISOString(), score: 76.2, run_id: '2' }
    ]
  }
}

export default function DashboardPage() {
  return <DashboardClient initialData={mockData} />
}
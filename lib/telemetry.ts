import { createHash } from 'crypto';

// KPI and SLA thresholds
export const SLA_THRESHOLDS = {
  PASS_RATE: 99, // 99% pass rate required
  FAST_TTA: 60, // 60 seconds for "fast" TTA
  P95_TTA: 120, // 95th percentile TTA ≤120s
  P95_SCORE: 80, // 95th percentile score ≥80
  MIN_SCORE: 80  // Minimum score threshold
} as const;

// Telemetry event types
export type TelemetryEventType = 
  | 'prompt_generation'
  | 'gpt_test'
  | 'export_bundle'
  | 'run_module'
  | 'api_call'
  | 'error'
  | 'performance';

// Performance metrics
export interface PerformanceMetrics {
  tta_seconds: number; // Time to Answer
  tokens_used: number;
  model_used: string;
  cost_estimate: number;
  success: boolean;
  error_code?: string;
}

// Score breakdown for detailed analysis
export interface ScoreBreakdown {
  overall_score: number;
  clarity_score: number;
  execution_score: number;
  ambiguity_inverse_score: number;
  business_fit_score: number;
  pragmatism_score: number;
  verdict: 'pass' | 'fail' | 'partial';
}

// Telemetry data structure (no PII)
export interface TelemetryData {
  event_type: TelemetryEventType;
  operation: string;
  org_id: string;
  user_id_hash: string; // Hashed user ID, not PII
  run_id?: string;
  module_id?: string;
  seven_d_signature: string; // Hashed 7D params
  performance: PerformanceMetrics;
  score_breakdown?: ScoreBreakdown;
  metadata: Record<string, unknown>;
  timestamp: string;
  environment: 'development' | 'staging' | 'production';
}

// KPI metrics interface
export interface KPIMetrics {
  pass_rate_pct: number;
  sla_fast_pct: number;
  p95_score: number;
  p95_tta: number;
  total_runs: number;
  successful_runs: number;
  fast_runs: number;
  avg_score: number;
  avg_tta: number;
}

/**
 * Get Supabase client (only when needed and available)
 */
async function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  } catch (error) {
    console.warn('Supabase client not available:', error);
    return null;
  }
}

/**
 * Log telemetry event with performance metrics
 */
export async function logTelemetryEvent(
  data: Omit<TelemetryData, 'timestamp' | 'environment'>
): Promise<void> {
  try {
    const telemetryData: TelemetryData = {
      ...data,
      timestamp: new Date().toISOString(),
      environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development'
    };

    // In production, save to telemetry table
    // For now, log to console
    console.log('Telemetry Event:', JSON.stringify(telemetryData, null, 2));
    
  } catch (error) {
    console.error('Failed to log telemetry event:', error);
  }
}

/**
 * Calculate hash for user ID (no PII exposure)
 */
export function hashUserId(userId: string): string {
  return createHash('sha256').update(userId).digest('hex').substring(0, 16);
}

/**
 * Generate 7D parameter signature for telemetry
 */
export function generate7DSignature(sevenD: Record<string, unknown>): string {
  const sortedParams = Object.keys(sevenD)
    .sort()
    .map(key => `${key}:${sevenD[key]}`)
    .join('|');
  
  return createHash('sha256').update(sortedParams).digest('hex').substring(0, 16);
}

/**
 * Calculate percentile from sorted array
 */
function calculatePercentile(sortedValues: number[], percentile: number): number {
  if (sortedValues.length === 0) return 0;
  
  const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
  return sortedValues[Math.max(0, index)] || 0;
}

/**
 * Get KPI metrics for an organization
 */
export async function getKPIMetrics(orgId: string, days: number = 7): Promise<KPIMetrics> {
  try {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      // Return mock data during P0 launch when Supabase is not configured
      return {
        pass_rate_pct: 95.0,
        sla_fast_pct: 88.0,
        p95_score: 85.0,
        p95_tta: 95.0,
        total_runs: 150,
        successful_runs: 143,
        fast_runs: 132,
        avg_score: 87.0,
        avg_tta: 78.0
      };
    }

    // This would be the real implementation when Supabase is available
    // For P0 launch, return mock data
    return {
      pass_rate_pct: 95.0,
      sla_fast_pct: 88.0,
      p95_score: 85.0,
      p95_tta: 95.0,
      total_runs: 150,
      successful_runs: 143,
      fast_runs: 132,
      avg_score: 87.0,
      avg_tta: 78.0
    };
    
  } catch (error) {
    console.error('Failed to get KPI metrics:', error);
    return {
      pass_rate_pct: 0,
      sla_fast_pct: 0,
      p95_score: 0,
      p95_tta: 0,
      total_runs: 0,
      successful_runs: 0,
      fast_runs: 0,
      avg_score: 0,
      avg_tta: 0
    };
  }
}

/**
 * Check SLA compliance for an organization
 */
export async function checkSLACompliance(orgId: string) {
  try {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      // Return mock data during P0 launch when Supabase is not configured
      return {
        compliant: true,
        alerts: [],
        message: 'SLA monitoring not available during launch phase'
      };
    }

    // Rest of the SLA compliance logic would go here
    // For P0 launch, return mock data
    return {
      compliant: true,
      alerts: [],
      message: 'SLA monitoring in development'
    };
    
  } catch (error) {
    console.error('SLA compliance check failed:', error);
    return {
      compliant: false,
      alerts: [{
        id: 'error',
        type: 'error',
        message: 'SLA compliance check failed',
        timestamp: new Date().toISOString(),
        metric: 'compliance',
        value: 0,
        threshold: 100
      }],
      message: 'SLA monitoring temporarily unavailable'
    };
  }
}

/**
 * Get performance trends for an organization
 */
export async function getPerformanceTrends(orgId: string, days: number = 30) {
  try {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      // Return mock data during P0 launch
      return {
        trends: {
          score_trend: 'improving',
          tta_trend: 'stable',
          volume_trend: 'increasing'
        },
        message: 'Performance trends not available during launch phase'
      };
    }

    // This would be the real implementation when Supabase is available
    return {
      trends: {
        score_trend: 'improving',
        tta_trend: 'stable',
        volume_trend: 'increasing'
      },
      message: 'Performance trends in development'
    };
    
  } catch (error) {
    console.error('Failed to get performance trends:', error);
    return {
      trends: {
        score_trend: 'unknown',
        tta_trend: 'unknown',
        volume_trend: 'unknown'
      },
      message: 'Performance trends temporarily unavailable'
    };
  }
}

/**
 * Get organization health score
 */
export async function getOrganizationHealth(orgId: string): Promise<number> {
  try {
    const metrics = await getKPIMetrics(orgId, 7);
    
    // Calculate health score based on multiple factors
    const scoreFactors = [
      metrics.pass_rate_pct / 100, // Pass rate weight
      metrics.sla_fast_pct / 100,  // SLA compliance weight
      Math.min(metrics.p95_score / 100, 1), // Score quality weight
      Math.max(0, 1 - (metrics.p95_tta / SLA_THRESHOLDS.P95_TTA)) // TTA efficiency weight
    ];
    
    const avgScore = scoreFactors.reduce((sum, factor) => sum + factor, 0) / scoreFactors.length;
    return Math.round(avgScore * 100);
    
  } catch (error) {
    console.error('Failed to calculate organization health:', error);
    return 0;
  }
}

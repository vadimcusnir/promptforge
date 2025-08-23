import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export interface TelemetryEvent {
  event: string;
  orgId: string;
  userId: string;
  payload: Record<string, any>;
  timestamp?: string;
}

export async function logEvent(event: TelemetryEvent): Promise<void> {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    await supabase.from('telemetry_events').insert({
      event: event.event,
      org_id: event.orgId,
      user_id: event.userId,
      payload: event.payload,
      timestamp: event.timestamp || new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log telemetry event:', error);
    // Don't throw - telemetry failures shouldn't break main functionality
  }
}

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<number> {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const now = new Date();
    const windowStart = new Date(now.getTime() - windowSeconds * 1000);

    const { count } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('key', key)
      .gte('timestamp', windowStart.toISOString());

    return count || 0;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return 0; // Allow request if rate limiting fails
  }
}

// Export functions needed by other modules
export const trackEvent = logEvent;

export async function logRunTelemetry(data: {
  runId: string;
  orgId: string;
  userId: string;
  moduleId: string;
  parameters: Record<string, any>;
  telemetry: {
    generation_time_ms: number;
    evaluation_time_ms: number | null;
    bundle_time_ms: number;
    total_time_ms: number;
    tokens_used: number;
    estimated_cost_usd: number;
  };
  evaluation?: any;
}): Promise<void> {
  await logEvent({
    event: 'module_run_completed',
    orgId: data.orgId,
    userId: data.userId,
    payload: {
      runId: data.runId,
      moduleId: data.moduleId,
      parameters: data.parameters,
      telemetry: data.telemetry,
      evaluation: data.evaluation
        ? {
            scores: data.evaluation.scores,
            feedback: data.evaluation.feedback,
          }
        : null,
    },
  });
}

// Mock telemetry engine for compatibility
export const telemetry = {
  trackEvent: logEvent,
  trackGlitchProtocol: async (metrics: any) => {
    await logEvent({
      event: 'glitch_protocol',
      orgId: 'system',
      userId: 'system',
      payload: metrics,
    });
  },
};

// Client-safe telemetry functions
export interface TelemetryEvent {
  event: string;
  orgId: string;
  userId: string;
  payload: Record<string, any>;
  timestamp?: string;
}

// Mock telemetry engine for client-side
export const telemetry = {
  trackEvent: (event: string, category: string, data: Record<string, any> = {}) => {
    console.log('[Telemetry]', event, category, data);
  },
  trackGlitchProtocol: (metrics: any) => {
    console.log('[Glitch Protocol]', metrics);
  },
};

export async function logEventClient(event: TelemetryEvent): Promise<void> {
  try {
    // Send to API endpoint instead of direct database access
    await fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Failed to log telemetry event:', error);
    // Don't throw - telemetry failures shouldn't break main functionality
  }
}

export async function checkRateLimitClient(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<number> {
  try {
    const response = await fetch(
      `/api/rate-limit?key=${key}&max=${maxRequests}&window=${windowSeconds}`
    );
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return 0; // Allow request if rate limiting fails
  }
}

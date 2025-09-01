import { useCallback } from 'react';

// =================================
// TELEMETRY HOOK - MODULE TRACKING
// =================================

interface TelemetryEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
  session_id?: string;
}

interface TelemetryContext {
  user_id?: string;
  user_plan?: string;
  session_id: string;
  page_url: string;
  user_agent: string;
}

class TelemetryService {
  private endpoint: string;
  private context: TelemetryContext;

  constructor() {
    this.endpoint = process.env.NEXT_PUBLIC_TELEMETRY_ENDPOINT || '/api/telemetry';
    this.context = this.initializeContext();
  }

  private initializeContext(): TelemetryContext {
    return {
      session_id: this.getSessionId(),
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      user_id: this.getUserId(),
      user_plan: this.getUserPlan()
    };
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server';
    
    let sessionId = sessionStorage.getItem('telemetry_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('telemetry_session_id', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    // Get from localStorage, auth context, or other sources
    return localStorage.getItem('user_id') || undefined;
  }

  private getUserPlan(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    // Get from localStorage, auth context, or other sources
    return localStorage.getItem('user_plan') || undefined;
  }

  async track(event: string, properties: Record<string, any> = {}): Promise<void> {
    const telemetryEvent: TelemetryEvent = {
      event,
      properties,
      timestamp: Date.now(),
      session_id: this.context.session_id
    };

    try {
      // Send to backend
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...telemetryEvent,
          context: this.context
        }),
      });

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Telemetry:', telemetryEvent);
      }
    } catch (error) {
      // Fallback to console in case of network issues
      console.warn('Telemetry failed:', error);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Telemetry (fallback):', telemetryEvent);
      }
    }
  }

  // Module-specific tracking methods
  async trackModuleOpen(moduleId: string, moduleTitle: string, userPlan?: string): Promise<void> {
    await this.track('module_open', {
      module_id: moduleId,
      module_title: moduleTitle,
      user_plan: userPlan,
      timestamp: Date.now()
    });
  }

  async trackModuleRun(moduleId: string, mode: 'sample' | 'real', userPlan?: string): Promise<void> {
    await this.track('module_run', {
      module_id: moduleId,
      mode,
      user_plan: userPlan,
      timestamp: Date.now()
    });
  }

  async trackModuleExport(moduleId: string, format: string, score: number, userPlan?: string): Promise<void> {
    await this.track('module_export', {
      module_id: moduleId,
      format,
      score,
      user_plan: userPlan,
      timestamp: Date.now()
    });
  }

  async trackFilterChange(filters: Record<string, any>, resultsCount: number): Promise<void> {
    await this.track('filter_change', {
      ...filters,
      results_count: resultsCount,
      timestamp: Date.now()
    });
  }

  async trackUpgradePrompt(moduleId: string, requiredPlan: string, userPlan?: string): Promise<void> {
    await this.track('upgrade_prompt', {
      module_id: moduleId,
      required_plan: requiredPlan,
      user_plan: userPlan,
      timestamp: Date.now()
    });
  }

  async trackPageView(page: string, referrer?: string): Promise<void> {
    await this.track('page_view', {
      page,
      referrer,
      timestamp: Date.now()
    });
  }

  async trackError(error: string, context?: Record<string, any>): Promise<void> {
    await this.track('error', {
      error,
      context,
      timestamp: Date.now()
    });
  }
}

// Global telemetry service instance
const telemetryService = new TelemetryService();

// React hook for telemetry
export function useTelemetry() {
  const track = useCallback(async (event: string, properties: Record<string, any> = {}) => {
    await telemetryService.track(event, properties);
  }, []);

  const trackModuleOpen = useCallback(async (moduleId: string, moduleTitle: string, userPlan?: string) => {
    await telemetryService.trackModuleOpen(moduleId, moduleTitle, userPlan);
  }, []);

  const trackModuleRun = useCallback(async (moduleId: string, mode: 'sample' | 'real', userPlan?: string) => {
    await telemetryService.trackModuleRun(moduleId, mode, userPlan);
  }, []);

  const trackModuleExport = useCallback(async (moduleId: string, format: string, score: number, userPlan?: string) => {
    await telemetryService.trackModuleExport(moduleId, format, score, userPlan);
  }, []);

  const trackFilterChange = useCallback(async (filters: Record<string, any>, resultsCount: number) => {
    await telemetryService.trackFilterChange(filters, resultsCount);
  }, []);

  const trackUpgradePrompt = useCallback(async (moduleId: string, requiredPlan: string, userPlan?: string) => {
    await telemetryService.trackUpgradePrompt(moduleId, requiredPlan, userPlan);
  }, []);

  const trackPageView = useCallback(async (page: string, referrer?: string) => {
    await telemetryService.trackPageView(page, referrer);
  }, []);

  const trackError = useCallback(async (error: string, context?: Record<string, any>) => {
    await telemetryService.trackError(error, context);
  }, []);

  return {
    track,
    trackModuleOpen,
    trackModuleRun,
    trackModuleExport,
    trackFilterChange,
    trackUpgradePrompt,
    trackPageView,
    trackError
  };
}

// Export the service for direct use
export { telemetryService };

"use client";

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export function useAnalytics() {
  const track = (event: string, properties?: Record<string, any>) => {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now()
    };

    // Send to analytics endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(analyticsEvent)
    }).catch(error => {
      console.error('Analytics tracking failed:', error);
    });

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsEvent);
    }
  };

  const trackPageView = (page: string, properties?: Record<string, any>) => {
    track('page_view', {
      page,
      ...properties
    });
  };

  const trackModuleInteraction = (moduleId: string, action: string, properties?: Record<string, any>) => {
    track('module_interaction', {
      module_id: moduleId,
      action,
      ...properties
    });
  };

  const trackFilterChange = (filters: Record<string, any>, resultsCount: number) => {
    track('filter_change', {
      ...filters,
      results_count: resultsCount
    });
  };

  const trackExport = (format: string, moduleId: string, score?: number) => {
    track('export_performed', {
      format,
      module_id: moduleId,
      score,
      timestamp: Date.now()
    });
  };

  return {
    track,
    trackPageView,
    trackModuleInteraction,
    trackFilterChange,
    trackExport
  };
}

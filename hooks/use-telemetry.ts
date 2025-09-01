"use client";

import { useCallback } from 'react';

export interface TelemetryEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export function useTelemetry() {
  const track = useCallback(async (event: string, properties?: Record<string, any>) => {
    try {
      // Send to analytics API
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          properties,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error('Failed to track telemetry event:', error);
    }
  }, []);

  const trackPageView = useCallback((page: string, properties?: Record<string, any>) => {
    track('page_view', { page, ...properties });
  }, [track]);

  const trackUserAction = useCallback((action: string, properties?: Record<string, any>) => {
    track('user_action', { action, ...properties });
  }, [track]);

  const trackConversion = useCallback((conversion: string, value?: number, properties?: Record<string, any>) => {
    track('conversion', { conversion, value, ...properties });
  }, [track]);

  const trackError = useCallback((error: string, properties?: Record<string, any>) => {
    track('error', { error, ...properties });
  }, [track]);

  // Pricing-specific tracking methods
  const trackPricingView = useCallback((properties?: Record<string, any>) => {
    track('pricing_view', { ...properties });
  }, [track]);

  const trackPlanSelected = useCallback((planId: string, billingCycle: string, properties?: Record<string, any>) => {
    track('plan_selected', { plan_id: planId, billing_cycle: billingCycle, ...properties });
  }, [track]);

  const trackCheckoutStarted = useCallback((planId: string, billingCycle: string, properties?: Record<string, any>) => {
    track('checkout_started', { plan_id: planId, billing_cycle: billingCycle, ...properties });
  }, [track]);

  const trackCheckoutCompleted = useCallback((planId: string, billingCycle: string, value: number, properties?: Record<string, any>) => {
    track('checkout_completed', { plan_id: planId, billing_cycle: billingCycle, value, ...properties });
  }, [track]);

  const trackTrialStarted = useCallback((planId: string, properties?: Record<string, any>) => {
    track('trial_started', { plan_id: planId, ...properties });
  }, [track]);

  const trackTrialConverted = useCallback((planId: string, value: number, properties?: Record<string, any>) => {
    track('trial_converted', { plan_id: planId, value, ...properties });
  }, [track]);

  const trackTrialExpired = useCallback((planId: string, properties?: Record<string, any>) => {
    track('trial_expired', { plan_id: planId, ...properties });
  }, [track]);

  const trackExportAttempt = useCallback((format: string, planId: string, properties?: Record<string, any>) => {
    track('export_attempt', { format, plan_id: planId, ...properties });
  }, [track]);

  const trackExportCompleted = useCallback((format: string, planId: string, properties?: Record<string, any>) => {
    track('export_completed', { format, plan_id: planId, ...properties });
  }, [track]);

  const trackExportBlocked = useCallback((format: string, planId: string, reason: string, properties?: Record<string, any>) => {
    track('export_blocked', { format, plan_id: planId, reason, ...properties });
  }, [track]);

  return {
    track,
    trackPageView,
    trackUserAction,
    trackConversion,
    trackError,
    // Pricing-specific methods
    trackPricingView,
    trackPlanSelected,
    trackCheckoutStarted,
    trackCheckoutCompleted,
    trackTrialStarted,
    trackTrialConverted,
    trackTrialExpired,
    trackExportAttempt,
    trackExportCompleted,
    trackExportBlocked,
  };
}

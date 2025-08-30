/**
 * Standard Analytics Events for PromptForge
 * Aligned with Privacy Policy - documents what data is collected and stored
 */

export interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  userId?: string
  sessionId?: string
  timestamp: number
  url: string
  userAgent?: string
}

// Standard event types as requested
export const STANDARD_EVENTS = {
  VIEW_PAGE: 'view_page',
  CTA_CLICK: 'cta_click', 
  PRICING_SELECT: 'pricing_select',
  START_TRIAL: 'start_trial',
  EXPORT: 'export'
} as const

// Event properties that are collected (aligned with privacy policy)
export interface ViewPageEvent {
  event: typeof STANDARD_EVENTS.VIEW_PAGE
  properties: {
    page_path: string
    page_title: string
    page_category?: string
    referrer?: string
    user_agent?: string
    session_id: string
    timestamp: number
  }
}

export interface CtaClickEvent {
  event: typeof STANDARD_EVENTS.CTA_CLICK
  properties: {
    cta_type: string
    cta_text: string
    cta_position: string
    page_path: string
    target_url?: string
    session_id: string
    timestamp: number
  }
}

export interface PricingSelectEvent {
  event: typeof STANDARD_EVENTS.PRICING_SELECT
  properties: {
    plan_id: string
    plan_type: 'free' | 'pro' | 'enterprise'
    billing_cycle: 'monthly' | 'annual'
    price: number
    currency: string
    page_path: string
    session_id: string
    timestamp: number
  }
}

export interface StartTrialEvent {
  event: typeof STANDARD_EVENTS.START_TRIAL
  properties: {
    plan_id: string
    trial_type: 'free' | 'pro_trial'
    user_id?: string
    email?: string
    page_path: string
    session_id: string
    timestamp: number
  }
}

export interface ExportEvent {
  event: typeof STANDARD_EVENTS.EXPORT
  properties: {
    export_type: 'pdf' | 'json' | 'txt' | 'md' | 'zip'
    module_id?: string
    file_size?: number
    user_id?: string
    page_path: string
    session_id: string
    timestamp: number
  }
}

// Privacy-compliant data collection
export interface PrivacyCompliantData {
  // Always collected (essential for service)
  session_id: string
  timestamp: number
  page_path: string
  event_type: string
  
  // Conditionally collected (with user consent)
  user_id?: string
  email?: string
  user_agent?: string
  referrer?: string
  
  // Never collected (privacy-sensitive)
  // ip_address: never
  // personal_data: never
  // sensitive_content: never
}

// Analytics configuration aligned with privacy policy
export const ANALYTICS_CONFIG = {
  // Data retention periods (aligned with privacy policy)
  RETENTION_PERIODS: {
    SESSION_DATA: 30, // days
    USER_DATA: 365, // days
    ANALYTICS_DATA: 24, // months
  },
  
  // Data collection scopes
  COLLECTION_SCOPES: {
    ESSENTIAL: ['session_id', 'timestamp', 'page_path', 'event_type'],
    OPTIONAL: ['user_id', 'email', 'user_agent', 'referrer'],
    FORBIDDEN: ['ip_address', 'personal_data', 'sensitive_content']
  },
  
  // Event categories for organization
  EVENT_CATEGORIES: {
    NAVIGATION: 'navigation',
    ENGAGEMENT: 'engagement', 
    CONVERSION: 'conversion',
    FEATURE_USAGE: 'feature_usage',
    ERROR: 'error'
  }
} as const

// Helper functions for creating privacy-compliant events
export function createViewPageEvent(
  pagePath: string,
  pageTitle: string,
  sessionId: string,
  options?: {
    pageCategory?: string
    referrer?: string
    userAgent?: string
  }
): ViewPageEvent {
  return {
    event: STANDARD_EVENTS.VIEW_PAGE,
    properties: {
      page_path: pagePath,
      page_title: pageTitle,
      page_category: options?.pageCategory,
      referrer: options?.referrer,
      user_agent: options?.userAgent,
      session_id: sessionId,
      timestamp: Date.now()
    }
  }
}

export function createCtaClickEvent(
  ctaType: string,
  ctaText: string,
  ctaPosition: string,
  sessionId: string,
  options?: {
    targetUrl?: string
    pagePath?: string
  }
): CtaClickEvent {
  return {
    event: STANDARD_EVENTS.CTA_CLICK,
    properties: {
      cta_type: ctaType,
      cta_text: ctaText,
      cta_position: ctaPosition,
      page_path: options?.pagePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
      target_url: options?.targetUrl,
      session_id: sessionId,
      timestamp: Date.now()
    }
  }
}

export function createPricingSelectEvent(
  planId: string,
  planType: 'free' | 'pro' | 'enterprise',
  billingCycle: 'monthly' | 'annual',
  price: number,
  sessionId: string,
  options?: {
    pagePath?: string
  }
): PricingSelectEvent {
  return {
    event: STANDARD_EVENTS.PRICING_SELECT,
    properties: {
      plan_id: planId,
      plan_type: planType,
      billing_cycle: billingCycle,
      price,
      currency: 'USD',
      page_path: options?.pagePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
      session_id: sessionId,
      timestamp: Date.now()
    }
  }
}

export function createStartTrialEvent(
  planId: string,
  trialType: 'free' | 'pro_trial',
  sessionId: string,
  options?: {
    userId?: string
    email?: string
    pagePath?: string
  }
): StartTrialEvent {
  return {
    event: STANDARD_EVENTS.START_TRIAL,
    properties: {
      plan_id: planId,
      trial_type: trialType,
      user_id: options?.userId,
      email: options?.email,
      page_path: options?.pagePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
      session_id: sessionId,
      timestamp: Date.now()
    }
  }
}

export function createExportEvent(
  exportType: 'pdf' | 'json' | 'txt' | 'md' | 'zip',
  sessionId: string,
  options?: {
    moduleId?: string
    fileSize?: number
    userId?: string
    pagePath?: string
  }
): ExportEvent {
  return {
    event: STANDARD_EVENTS.EXPORT,
    properties: {
      export_type: exportType,
      module_id: options?.moduleId,
      file_size: options?.fileSize,
      user_id: options?.userId,
      page_path: options?.pagePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
      session_id: sessionId,
      timestamp: Date.now()
    }
  }
}

// Privacy policy alignment documentation
export const PRIVACY_ALIGNMENT = {
  DATA_COLLECTED: {
    ESSENTIAL: [
      'Session ID (for analytics continuity)',
      'Page views and navigation',
      'Feature usage (which modules used)',
      'Export activities (type and frequency)',
      'Error events (for debugging)'
    ],
    OPTIONAL: [
      'User ID (when logged in)',
      'Email (for trial signups)',
      'User agent (for compatibility)',
      'Referrer (for traffic analysis)'
    ],
    NEVER: [
      'IP addresses',
      'Personal content',
      'Sensitive business data',
      'Prompt content',
      'Generated outputs'
    ]
  },
  
  STORAGE: {
    DURATION: {
      SESSION_DATA: '30 days',
      USER_DATA: '1 year',
      ANALYTICS_DATA: '2 years'
    },
    LOCATION: 'Secure cloud storage with encryption',
    ACCESS: 'Only authorized personnel for service improvement'
  },
  
  PURPOSE: {
    PRIMARY: 'Service improvement and feature development',
    SECONDARY: 'Usage analytics and performance monitoring',
    NEVER: 'Personal profiling or advertising'
  }
} as const

// GTM Event Tracking for PromptForge

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

type GTMEvent = {
  event: string
  event_category?: string
  event_action?: string
  event_label?: string
  value?: number
  user_plan?: string
  seven_d_signature?: string
}

export const trackEvent = (eventData: GTMEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventData.event, {
      event_category: eventData.event_category,
      event_action: eventData.event_action,
      event_label: eventData.event_label,
      value: eventData.value,
      custom_parameters: {
        user_plan: eventData.user_plan,
        seven_d_signature: eventData.seven_d_signature,
      },
    })
  }
}

// Predefined conversion events
export const GTMEvents = {
  heroCTA: (plan?: string) => trackEvent({
    event: 'hero_cta_click',
    event_category: 'conversion',
    event_action: 'click',
    event_label: 'start_the_forge',
    user_plan: plan,
  }),

  seeModules: (plan?: string) => trackEvent({
    event: 'see_modules_click',
    event_category: 'engagement',
    event_action: 'click',
    event_label: 'view_modules',
    user_plan: plan,
  }),

  topicGenerate: (topic: string, plan?: string, sevenDHash?: string) => trackEvent({
    event: 'topic_generate',
    event_category: 'conversion',
    event_action: 'generate',
    event_label: topic,
    user_plan: plan,
    seven_d_signature: sevenDHash,
  }),

  pricingUpgrade: (planName: string, planPrice: number) => trackEvent({
    event: 'pricing_upgrade_click',
    event_category: 'conversion',
    event_action: 'upgrade',
    event_label: planName,
    value: planPrice,
  }),

  checkoutStart: (planName: string, planPrice: number) => trackEvent({
    event: 'checkout_start',
    event_category: 'conversion',
    event_action: 'checkout',
    event_label: planName,
    value: planPrice,
  }),

  checkoutComplete: (planName: string, planPrice: number, transactionId?: string) => trackEvent({
    event: 'checkout_complete',
    event_category: 'conversion',
    event_action: 'purchase',
    event_label: planName,
    value: planPrice,
  }),

  demoBundlePreview: (plan?: string) => trackEvent({
    event: 'demo_bundle_preview',
    event_category: 'engagement',
    event_action: 'click',
    event_label: 'preview_bundle',
    user_plan: plan,
  }),
}

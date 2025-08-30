// Google Tag Manager events
export interface GTMEvent {
  event: string;
  [key: string]: any;
}

export const GTMEvents = {
  pageView: (page: string): GTMEvent => ({
    event: 'page_view',
    page_title: page,
    page_location: window.location.href,
  }),
  
  ctaClick: (cta: string, location: string): GTMEvent => ({
    event: 'cta_click',
    cta_name: cta,
    cta_location: location,
  }),
  
  signUp: (method: string): GTMEvent => ({
    event: 'sign_up',
    method,
  }),
  
  login: (method: string): GTMEvent => ({
    event: 'login',
    method,
  }),
  
  purchase: (value: number, currency: string = 'USD'): GTMEvent => ({
    event: 'purchase',
    value,
    currency,
  }),
  
  custom: (eventName: string, parameters: Record<string, any> = {}): GTMEvent => ({
    event: eventName,
    ...parameters,
  }),
  
  pricingUpgrade: (planName: string, price: number): GTMEvent => ({
    event: 'pricing_upgrade',
    plan_name: planName,
    plan_price: price,
  }),
};

export function trackEvent(event: GTMEvent): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.event, event);
  }
}

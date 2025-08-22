export interface BrandMessage {
  id: string;
  context: string;
  primary: string;
  secondary?: string;
  cta?: string;
  tone: "authoritative" | "technical" | "conversion" | "supportive";
  audience: "free" | "pro" | "enterprise" | "all";
}

export const BRAND_VOICE = {
  personality: "Engineering-focused, authoritative, results-driven",
  tone: "Professional yet approachable, technical without being intimidating",
  values: ["Precision", "Performance", "Innovation", "Reliability"],
  avoid: [
    "Overly casual language",
    "Buzzwords without substance",
    "Vague promises",
  ],
};

export const BRAND_MESSAGES: Record<string, BrandMessage> = {
  hero_tagline: {
    id: "hero_tagline",
    context: "Main header tagline",
    primary: "Enterprise AI Prompt Engineering Platform",
    secondary:
      "Transform ideas into execution-ready AI prompts with military-grade precision",
    tone: "authoritative",
    audience: "all",
  },
  value_proposition: {
    id: "value_proposition",
    context: "Core value proposition",
    primary: "From concept to deployment in minutes, not hours",
    secondary:
      "50 battle-tested modules. 7 semantic vectors. Infinite possibilities.",
    tone: "technical",
    audience: "all",
  },
  mission_config_desc: {
    id: "mission_config_desc",
    context: "Mission configuration section",
    primary: "Strategic Mission Parameters",
    secondary:
      "Configure your operational context for maximum prompt effectiveness and business alignment",
    tone: "technical",
    audience: "all",
  },
  module_arsenal_desc: {
    id: "module_arsenal_desc",
    context: "Module selection section",
    primary: "Tactical Module Arsenal",
    secondary:
      "Select from 50 specialized AI modules engineered for specific business outcomes and market conditions",
    tone: "technical",
    audience: "all",
  },
  generator_cta: {
    id: "generator_cta",
    context: "Generator tab",
    primary: "Deploy Prompt",
    secondary:
      "Generate execution-ready prompts with validated structure and KPI alignment",
    cta: "Generate Now",
    tone: "conversion",
    audience: "all",
  },
  gpt_editor_premium: {
    id: "gpt_editor_premium",
    context: "GPT Editor premium feature",
    primary: "GPT-4 Live Optimization Engine",
    secondary:
      "Real-time prompt enhancement with streaming feedback and performance metrics",
    cta: "Upgrade to Pro",
    tone: "conversion",
    audience: "free",
  },
  test_engine_desc: {
    id: "test_engine_desc",
    context: "Test engine section",
    primary: "Validation & Quality Assurance",
    secondary:
      "Comprehensive testing suite with multi-dimensional scoring and improvement recommendations",
    tone: "technical",
    audience: "all",
  },
  history_desc: {
    id: "history_desc",
    context: "History section",
    primary: "Mission Intelligence Archive",
    secondary:
      "Complete audit trail with advanced analytics and pattern recognition for continuous optimization",
    tone: "technical",
    audience: "all",
  },
  export_desc: {
    id: "export_desc",
    context: "Export section",
    primary: "Enterprise Export & Intelligence",
    secondary:
      "Multi-format export bundles with comprehensive analytics and white-label customization",
    tone: "technical",
    audience: "all",
  },
  analytics_desc: {
    id: "analytics_desc",
    context: "Analytics section",
    primary: "Performance Intelligence Dashboard",
    secondary:
      "Real-time telemetry, user behavior analysis, and system health monitoring for data-driven optimization",
    tone: "technical",
    audience: "all",
  },
  upgrade_urgency: {
    id: "upgrade_urgency",
    context: "Premium upgrade messaging",
    primary: "Unlock Professional-Grade Capabilities",
    secondary:
      "Join 10,000+ teams using PROMPTFORGE™ to accelerate AI implementation and drive measurable results",
    cta: "Upgrade Now - 30% Off",
    tone: "conversion",
    audience: "free",
  },
  social_proof: {
    id: "social_proof",
    context: "Social proof messaging",
    primary: "Trusted by Industry Leaders",
    secondary:
      "From Fortune 500 enterprises to innovative startups, teams choose PROMPTFORGE™ for mission-critical AI operations",
    tone: "authoritative",
    audience: "all",
  },
  technical_specs: {
    id: "technical_specs",
    context: "Technical specifications",
    primary: "Enterprise-Grade Architecture",
    secondary:
      "99.9% uptime SLA, SOC2 compliance, advanced security, and unlimited scalability",
    tone: "technical",
    audience: "enterprise",
  },
};

export const CONVERSION_COPY = {
  urgency_indicators: [
    "Limited time offer",
    "Join 10,000+ professionals",
    "30% off expires soon",
    "Upgrade now and save",
  ],
  value_reinforcement: [
    "Proven ROI in 30 days",
    "10x faster prompt development",
    "Enterprise-grade reliability",
    "Battle-tested by industry leaders",
  ],
  risk_mitigation: [
    "30-day money-back guarantee",
    "No setup fees",
    "Cancel anytime",
    "Free migration support",
  ],
};

export const CTA_VARIANTS = {
  primary: {
    free_to_pro: "Upgrade to Pro - Unlock Full Power",
    pro_to_enterprise: "Scale to Enterprise - Custom Solutions",
    trial_start: "Start Free Trial - No Credit Card Required",
    demo_request: "Request Enterprise Demo",
  },
  secondary: {
    learn_more: "Explore Features",
    view_pricing: "View Pricing Plans",
    contact_sales: "Contact Sales Team",
    documentation: "View Documentation",
  },
};

export function getBrandMessage(
  messageId: string,
  userTier = "free",
): BrandMessage | null {
  const message = BRAND_MESSAGES[messageId];
  if (!message) return null;

  // Filter by audience
  if (message.audience !== "all" && message.audience !== userTier) {
    return null;
  }

  return message;
}

export function getContextualCTA(userTier: string, context: string): string {
  switch (userTier) {
    case "free":
      return context === "premium_feature"
        ? CTA_VARIANTS.primary.free_to_pro
        : CTA_VARIANTS.primary.trial_start;
    case "pro":
      return CTA_VARIANTS.primary.pro_to_enterprise;
    case "enterprise":
      return CTA_VARIANTS.secondary.contact_sales;
    default:
      return CTA_VARIANTS.primary.trial_start;
  }
}

export function getUrgencyMessage(userTier: string): string {
  const urgencyMessages = {
    free: "Join 10,000+ professionals already using PROMPTFORGE™ Pro",
    pro: "Scale your operations with Enterprise features",
    enterprise: "Optimize your deployment with our success team",
  };

  return (
    urgencyMessages[userTier as keyof typeof urgencyMessages] ||
    urgencyMessages.free
  );
}

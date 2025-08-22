export const COPY = {
  brand: "PromptForge™",
  cta_start: "Start the Forge",
  nav_generator: "Generator",
  nav_modules: "Modules",
  nav_pricing: "Pricing",
  nav_docs: "Docs",
  nav_dashboard: "Dashboard",
  nav_signin: "Sign in",
  nav_signup: "Sign up",
  f_product: "Product",
  f_company: "Company",
  f_legal: "Legal",
  f_privacy: "Privacy Policy",
  f_terms: "Terms of Service",
  f_gdpr: "GDPR Compliance",
  f_security: "Security",
  f_about: "About",
  f_blog: "Blog",
  f_careers: "Careers",
  f_contact: "Contact",
  skip_to_content: "Skip to content",
  menu_toggle: "Toggle menu",
  copyright:
    "© " + new Date().getFullYear() + " PROMPTFORGE™. All rights reserved.",
} as const;

export type CopyKeys = keyof typeof COPY;

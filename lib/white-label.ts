// PROMPTFORGE™ v3 - White-Label System
// Branding custom și personalizare completă pentru Enterprise

import { createClient } from '@supabase/supabase-js';

// SACF - Development mode fallback
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dev-placeholder.supabase.co';
const SUPABASE_SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dev-placeholder';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export interface WhiteLabelConfig {
  id: string;
  org_id: string;
  is_active: boolean;

  // Branding
  brand_name: string;
  brand_logo_url?: string;
  brand_logo_dark_url?: string;
  brand_favicon_url?: string;
  brand_colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text_primary: string;
    text_secondary: string;
  };

  // Customization
  custom_domain?: string;
  custom_email_domain?: string;
  custom_support_email?: string;
  custom_terms_url?: string;
  custom_privacy_url?: string;

  // Content
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_text?: string;
  hero_cta_url?: string;

  // Features
  hide_promptforge_branding: boolean;
  custom_footer_text?: string;
  custom_meta_description?: string;
  custom_meta_keywords?: string;

  // Advanced
  custom_css?: string;
  custom_js?: string;
  custom_analytics_id?: string;
  custom_gtm_id?: string;

  // Compliance
  gdpr_compliant: boolean;
  ccpa_compliant: boolean;
  custom_compliance_text?: string;

  created_at: string;
  updated_at: string;
}

export interface WhiteLabelTheme {
  colors: WhiteLabelConfig['brand_colors'];
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

class WhiteLabelManager {
  private static instance: WhiteLabelManager;
  private cache: Map<string, { config: WhiteLabelConfig; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): WhiteLabelManager {
    if (!WhiteLabelManager.instance) {
      WhiteLabelManager.instance = new WhiteLabelManager();
    }
    return WhiteLabelManager.instance;
  }

  // Obține configurația white-label pentru o organizație
  async getWhiteLabelConfig(orgId: string): Promise<WhiteLabelConfig | null> {
    // Check cache first
    const cached = this.cache.get(orgId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.config;
    }

    if (SUPABASE_URL.includes('dev-placeholder')) {
      // Development mode - return mock config
      const mockConfig: WhiteLabelConfig = {
        id: 'dev-white-label',
        org_id: orgId,
        is_active: true,
        brand_name: 'DevForge',
        brand_logo_url: '/api/white-label/logo/dev',
        brand_colors: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          accent: '#F59E0B',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          background: '#FFFFFF',
          surface: '#F8FAFC',
          text_primary: '#1E293B',
          text_secondary: '#64748B',
        },
        hide_promptforge_branding: false,
        gdpr_compliant: true,
        ccpa_compliant: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.cache.set(orgId, { config: mockConfig, timestamp: Date.now() });
      return mockConfig;
    }

    try {
      const { data, error } = await supabase
        .from('white_label_configs')
        .select('*')
        .eq('org_id', orgId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        this.cache.set(orgId, { config: data, timestamp: Date.now() });
        return data;
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch white-label config:', error);
      return null;
    }
  }

  // Generează CSS custom pentru white-label
  generateCustomCSS(config: WhiteLabelConfig): string {
    const { brand_colors } = config;

    return `
      :root {
        /* Brand Colors */
        --color-primary: ${brand_colors.primary};
        --color-primary-hover: ${this.adjustColor(brand_colors.primary, -10)};
        --color-primary-active: ${this.adjustColor(brand_colors.primary, -20)};
        
        --color-secondary: ${brand_colors.secondary};
        --color-secondary-hover: ${this.adjustColor(brand_colors.secondary, -10)};
        --color-secondary-active: ${this.adjustColor(brand_colors.secondary, -20)};
        
        --color-accent: ${brand_colors.accent};
        --color-accent-hover: ${this.adjustColor(brand_colors.accent, -10)};
        --color-accent-active: ${this.adjustColor(brand_colors.accent, -20)};
        
        --color-success: ${brand_colors.success};
        --color-warning: ${brand_colors.warning};
        --color-error: ${brand_colors.error};
        
        --color-background: ${brand_colors.background};
        --color-surface: ${brand_colors.surface};
        --color-text-primary: ${brand_colors.text_primary};
        --color-text-secondary: ${brand_colors.text_secondary};
        
        /* Semantic Colors */
        --color-border: ${this.adjustColor(brand_colors.surface, -10)};
        --color-border-hover: ${this.adjustColor(brand_colors.surface, -20)};
        --color-focus: ${brand_colors.primary};
        --color-selection: ${this.adjustColor(brand_colors.primary, 20)};
        
        /* Component Specific */
        --color-button-primary: ${brand_colors.primary};
        --color-button-primary-hover: ${this.adjustColor(brand_colors.primary, -10)};
        --color-button-primary-active: ${this.adjustColor(brand_colors.primary, -20)};
        
        --color-button-secondary: ${brand_colors.surface};
        --color-button-secondary-hover: ${this.adjustColor(brand_colors.surface, -10)};
        --color-button-secondary-active: ${this.adjustColor(brand_colors.surface, -20)};
        
        --color-input-border: ${this.adjustColor(brand_colors.surface, -20)};
        --color-input-border-focus: ${brand_colors.primary};
        --color-input-background: ${brand_colors.background};
        
        --color-card-background: ${brand_colors.surface};
        --color-card-border: ${this.adjustColor(brand_colors.surface, -10)};
        --color-card-shadow: ${this.generateShadow(brand_colors.primary, 0.1)};
        
        --color-nav-background: ${brand_colors.surface};
        --color-nav-border: ${this.adjustColor(brand_colors.surface, -10)};
        --color-nav-text: ${brand_colors.text_primary};
        --color-nav-text-hover: ${brand_colors.primary};
        
        --color-footer-background: ${this.adjustColor(brand_colors.surface, -5)};
        --color-footer-text: ${brand_colors.text_secondary};
        --color-footer-border: ${this.adjustColor(brand_colors.surface, -10)};
      }
      
      /* Custom CSS Overrides */
      ${config.custom_css || ''}
      
      /* Brand-specific Component Styles */
      .brand-logo {
        background-image: url('${config.brand_logo_url || ''}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      
      .brand-logo-dark {
        background-image: url('${config.brand_logo_dark_url || config.brand_logo_url || ''}');
      }
      
      /* Hide PromptForge branding if requested */
      ${
        config.hide_promptforge_branding
          ? `
        .promptforge-branding,
        .promptforge-logo,
        .promptforge-footer {
          display: none !important;
        }
      `
          : ''
      }
      
      /* Custom Hero Section */
      .hero-section {
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        color: white;
      }
      
      .hero-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
      }
      
      .hero-subtitle {
        font-size: 1.25rem;
        opacity: 0.9;
        margin-bottom: 2rem;
      }
      
      .hero-cta {
        background: var(--color-accent);
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.2s ease;
      }
      
      .hero-cta:hover {
        background: var(--color-accent-hover);
        transform: translateY(-2px);
      }
    `;
  }

  // Generează JavaScript custom pentru white-label
  generateCustomJS(config: WhiteLabelConfig): string {
    return `
      // White-Label Custom JavaScript
      (function() {
        'use strict';
        
        // Custom Analytics
        ${
          config.custom_analytics_id
            ? `
          // Google Analytics
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${config.custom_analytics_id}');
        `
            : ''
        }
        
        ${
          config.custom_gtm_id
            ? `
          // Google Tag Manager
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${config.custom_gtm_id}');
        `
            : ''
        }
        
        // Custom Branding
        document.addEventListener('DOMContentLoaded', function() {
          // Update page title
          if ('${config.brand_name}') {
            document.title = document.title.replace('PromptForge', '${config.brand_name}');
          }
          
          // Update meta description
          ${
            config.custom_meta_description
              ? `
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute('content', '${config.custom_meta_description}');
            }
          `
              : ''
          }
          
          // Update meta keywords
          ${
            config.custom_meta_keywords
              ? `
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
              metaKeywords.setAttribute('content', '${config.custom_meta_keywords}');
            }
          `
              : ''
          }
          
          // Custom footer text
          ${
            config.custom_footer_text
              ? `
            const footerText = document.querySelector('.footer-text');
            if (footerText) {
              footerText.innerHTML = '${config.custom_footer_text}';
            }
          `
              : ''
          }
          
          // Custom support email
          ${
            config.custom_support_email
              ? `
            const supportLinks = document.querySelectorAll('a[href*="support"]');
            supportLinks.forEach(link => {
              link.href = link.href.replace(/support@[^\\s]+/, '${config.custom_support_email}');
            });
          `
              : ''
          }
        });
        
        // Custom CSS Injection
        ${
          config.custom_css
            ? `
          const style = document.createElement('style');
          style.textContent = \`${config.custom_css}\`;
          document.head.appendChild(style);
        `
            : ''
        }
        
        ${config.custom_js || ''}
      })();
    `;
  }

  // Generează tema CSS-in-JS pentru React
  generateTheme(config: WhiteLabelConfig): WhiteLabelTheme {
    return {
      colors: config.brand_colors,
      fonts: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, monospace',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      shadows: {
        sm: this.generateShadow(config.brand_colors.primary, 0.05),
        md: this.generateShadow(config.brand_colors.primary, 0.1),
        lg: this.generateShadow(config.brand_colors.primary, 0.15),
        xl: this.generateShadow(config.brand_colors.primary, 0.2),
      },
    };
  }

  // Helper functions
  private adjustColor(color: string, amount: number): string {
    // Simple color adjustment - în production ar folosi o librărie de culori
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  private generateShadow(color: string, opacity: number): string {
    return `0 4px 6px -1px ${color}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')}`;
  }

  // Validează configurația white-label
  validateConfig(config: Partial<WhiteLabelConfig>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!config.brand_name) {
      errors.push('Brand name is required');
    }

    if (config.brand_name && config.brand_name.length < 2) {
      errors.push('Brand name must be at least 2 characters');
    }

    if (config.brand_name && config.brand_name.length > 50) {
      errors.push('Brand name must be less than 50 characters');
    }

    if (config.custom_domain && !this.isValidDomain(config.custom_domain)) {
      errors.push('Invalid custom domain format');
    }

    if (config.custom_email_domain && !this.isValidEmailDomain(config.custom_email_domain)) {
      errors.push('Invalid email domain format');
    }

    if (config.custom_support_email && !this.isValidEmail(config.custom_support_email)) {
      errors.push('Invalid support email format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isValidDomain(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }

  private isValidEmailDomain(domain: string): boolean {
    const emailDomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return emailDomainRegex.test(domain);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Clear cache pentru o organizație
  clearCache(orgId: string): void {
    this.cache.delete(orgId);
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
  }
}

// Export singleton
export const whiteLabelManager = WhiteLabelManager.getInstance();

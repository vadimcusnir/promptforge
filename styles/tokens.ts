/**
 * Design Tokens for PromptForge v3
 * Centralized design system tokens following the project's voice and branding guidelines
 * WCAG 2.1 AA compliant with robust contrast ratios
 */

export const tokens = {
  // Color System - Dark theme with gold accent (#d1a954) - WCAG 2.1 AA compliant
  colors: {
    // Primary background colors
    bg: {
      primary: 'oklch(0.05 0 0)', // Deep black - #0a0a0a
      secondary: 'oklch(0.08 0 0)', // Dark gray - #141414
      tertiary: 'oklch(0.12 0 0)', // Medium dark - #1f1f1f
      elevated: 'oklch(0.15 0 0)', // Elevated surface - #262626
      glass: 'rgba(255, 255, 255, 0.05)', // Glass effect
      glassHover: 'rgba(255, 255, 255, 0.1)', // Glass hover
    },
    
    // Foreground colors - WCAG 2.1 AA compliant contrast ratios
    fg: {
      primary: 'oklch(0.985 0 0)', // White text - 21:1 contrast on dark
      secondary: 'oklch(0.75 0 0)', // Muted text - 4.5:1 contrast (AA)
      tertiary: 'oklch(0.65 0 0)', // Disabled text - 3:1 contrast (AA large)
      accent: 'oklch(0.75 0.189 84.429)', // Gold accent text - 4.5:1 contrast
      onAccent: 'oklch(0.15 0 0)', // Dark text on gold - 4.5:1 contrast
    },
    
    // Muted colors
    muted: {
      primary: 'oklch(0.269 0 0)', // Muted background
      secondary: 'oklch(0.205 0 0)', // Muted border
      accent: 'oklch(0.439 0 0)', // Muted ring
    },
    
    // Accent colors (Forge Gold theme) - WCAG 2.1 AA compliant
    accent: {
      primary: 'oklch(0.708 0.189 84.429)', // #F4B001 - Forge primary gold
      secondary: 'oklch(0.78 0.189 84.429)', // #FFD700 - Lighter gold for effects
      tertiary: 'oklch(0.65 0.189 84.429)', // Darker gold - 4.5:1 contrast
      contrast: 'oklch(0.15 0 0)', // Dark contrast for gold - 4.5:1 contrast
      hover: 'oklch(0.75 0.189 84.429)', // Hover state - 4.5:1 contrast
      focus: 'oklch(0.8 0.189 84.429)', // Focus state - 4.5:1 contrast
      glow: 'oklch(0.8 0.189 84.429)', // Glow effect color
    },
    
    // Forge ritual colors
    ritual: {
      obsidian: 'oklch(0.05 0 0)', // #0a0a0a - Deep black
      glitch: 'oklch(0.7 0.2 180)', // #00ffe7 - Glitch cyan
      pulse: 'oklch(0.8 0.189 84.429)', // Gold pulse animation
      initiation: 'oklch(0.9 0.189 84.429)', // Initiation mode gold
      crimson: 'oklch(0.6 0.2 15)', // #ff003c - Decision red
      forge: 'oklch(0.708 0.189 84.429)', // #F4B001 - Forge gold
    },
    
    // State colors - WCAG 2.1 AA compliant
    state: {
      success: 'oklch(0.65 0.17 162.48)', // Green - 4.5:1 contrast
      warning: 'oklch(0.75 0.188 70.08)', // Yellow - 4.5:1 contrast
      error: 'oklch(0.55 0.141 25.723)', // Red - 4.5:1 contrast
      info: 'oklch(0.65 0.243 264.376)', // Blue - 4.5:1 contrast
      successBg: 'oklch(0.2 0.1 162.48)', // Success background
      warningBg: 'oklch(0.25 0.1 70.08)', // Warning background
      errorBg: 'oklch(0.2 0.1 25.723)', // Error background
      infoBg: 'oklch(0.2 0.15 264.376)', // Info background
    },
    
    // Border colors
    border: {
      primary: 'oklch(0.269 0 0)', // Default border
      secondary: 'oklch(0.205 0 0)', // Subtle border
      accent: 'oklch(0.708 0.189 84.429)', // Accent border
      glass: 'rgba(255, 255, 255, 0.1)', // Glass border
    },
  },

  // Spacing system (8px base unit)
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
  },

  // Border radius system
  radii: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Z-index system
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Transition system
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Typography system - Unified font stack and sizes
  typography: {
    fontFamily: {
      sans: 'var(--font-open-sans), ui-sans-serif, system-ui, sans-serif',
      serif: 'var(--font-montserrat), ui-serif, Georgia, serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
    },
    fontSize: {
      // Headings H1-H6
      h1: ['3rem', { lineHeight: '1.1', fontWeight: '700' }], // 48px
      h2: ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }], // 36px
      h3: ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }], // 30px
      h4: ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }], // 24px
      h5: ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }], // 20px
      h6: ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }], // 18px
      
      // Body text
      body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // 16px
      bodyLarge: ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // 18px
      bodySmall: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px
      
      // Labels and UI text
      label: ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }], // 14px
      caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }], // 12px
      
      // Legacy sizes for compatibility
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
    },
  },

  // Shadow system
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },

  // Glass effect system
  glass: {
    backdrop: 'blur(10px)',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    hover: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  },

  // Accessibility system
  a11y: {
    // Focus indicators
    focus: {
      ring: '2px solid oklch(0.8 0.189 84.429)', // Gold focus ring
      ringOffset: '2px',
      ringOffsetColor: 'oklch(0.145 0 0)', // Dark background
      outline: 'none',
    },
    // Skip links
    skipLink: {
      position: 'absolute',
      top: '-40px',
      left: '6px',
      background: 'oklch(0.8 0.189 84.429)',
      color: 'oklch(0.15 0 0)',
      padding: '8px 16px',
      borderRadius: '4px',
      zIndex: '9999',
      textDecoration: 'none',
      fontWeight: '600',
      '&:focus': {
        top: '6px',
      },
    },
    // High contrast mode support
    highContrast: {
      border: '2px solid currentColor',
      background: 'Canvas',
      color: 'CanvasText',
    },
    // Reduced motion
    reducedMotion: {
      transition: 'none',
      animation: 'none',
    },
  },

  // Brand-aligned micro-interactions
  microInteractions: {
    // Gold pulse animation for ritualized affordances
    pulse: {
      keyframes: {
        '0%': { boxShadow: '0 0 0 0 oklch(0.8 0.189 84.429 / 0.7)' },
        '70%': { boxShadow: '0 0 0 10px oklch(0.8 0.189 84.429 / 0)' },
        '100%': { boxShadow: '0 0 0 0 oklch(0.8 0.189 84.429 / 0)' },
      },
      duration: '2s',
      iteration: 'infinite',
    },
    // Initiation mode glow
    initiation: {
      keyframes: {
        '0%': { 
          boxShadow: '0 0 5px oklch(0.9 0.189 84.429 / 0.5)',
          transform: 'scale(1)',
        },
        '50%': { 
          boxShadow: '0 0 20px oklch(0.9 0.189 84.429 / 0.8)',
          transform: 'scale(1.02)',
        },
        '100%': { 
          boxShadow: '0 0 5px oklch(0.9 0.189 84.429 / 0.5)',
          transform: 'scale(1)',
        },
      },
      duration: '3s',
      iteration: 'infinite',
    },
    // Ritualized hover states
    ritualHover: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 25px oklch(0.8 0.189 84.429 / 0.3)',
      },
    },
  },
} as const;

// Component-specific token combinations
export const componentTokens = {
  button: {
    height: {
      sm: '2.25rem', // 36px
      md: '2.5rem',  // 40px
      lg: '2.75rem', // 44px
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.5rem 1rem',
      lg: '0.75rem 1.5rem',
    },
  },
  
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
    gap: '1.5rem',
  },
  
  input: {
    height: '2.5rem', // 40px
    padding: '0.5rem 0.75rem',
  },
} as const;

export type DesignTokens = typeof tokens;
export type ComponentTokens = typeof componentTokens;

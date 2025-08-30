/**
 * Design Tokens - Single source of truth for PromptForge v3
 * Dark theme with gold accent and glassmorphism effects
 */

export const tokens = {
  // Color System
  colors: {
    // Base colors
    bg: '#0E0E0E',
    fg: '#EDEDED',
    card: '#111316',
    muted: '#6B7280',
    
    // Accent system
    accent: '#D1A954',
    accentHover: '#B8944A',
    accentContrast: '#0E0E0E',
    
    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Border and overlay
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(209, 169, 84, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.25)',
    
    // Glass effects
    glass: 'rgba(17, 19, 22, 0.95)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['Montserrat', 'system-ui', 'sans-serif'],
      serif: ['Open Sans', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '3rem',
    '4xl': '4rem',
  },
  
  // Border radius
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadows
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    glass: '0 10px 30px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(209, 169, 84, 0.3)',
  },
  
  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const

// CSS Custom Properties for runtime usage
export const cssVariables = `
  :root {
    /* Colors */
    --color-bg: ${tokens.colors.bg};
    --color-fg: ${tokens.colors.fg};
    --color-card: ${tokens.colors.card};
    --color-muted: ${tokens.colors.muted};
    --color-accent: ${tokens.colors.accent};
    --color-accent-hover: ${tokens.colors.accentHover};
    --color-accent-contrast: ${tokens.colors.accentContrast};
    --color-success: ${tokens.colors.success};
    --color-warning: ${tokens.colors.warning};
    --color-error: ${tokens.colors.error};
    --color-info: ${tokens.colors.info};
    --color-border: ${tokens.colors.border};
    --color-border-hover: ${tokens.colors.borderHover};
    --color-overlay: ${tokens.colors.overlay};
    --color-glass: ${tokens.colors.glass};
    --color-glass-border: ${tokens.colors.glassBorder};
    
    /* Typography */
    --font-family-sans: ${tokens.typography.fontFamily.sans.join(', ')};
    --font-family-serif: ${tokens.typography.fontFamily.serif.join(', ')};
    --font-family-mono: ${tokens.typography.fontFamily.mono.join(', ')};
    
    /* Spacing */
    --spacing-xs: ${tokens.spacing.xs};
    --spacing-sm: ${tokens.spacing.sm};
    --spacing-md: ${tokens.spacing.md};
    --spacing-lg: ${tokens.spacing.lg};
    --spacing-xl: ${tokens.spacing.xl};
    --spacing-2xl: ${tokens.spacing['2xl']};
    --spacing-3xl: ${tokens.spacing['3xl']};
    --spacing-4xl: ${tokens.spacing['4xl']};
    
    /* Border radius */
    --radius-sm: ${tokens.radius.sm};
    --radius-md: ${tokens.radius.md};
    --radius-lg: ${tokens.radius.lg};
    --radius-xl: ${tokens.radius.xl};
    --radius-2xl: ${tokens.radius['2xl']};
    --radius-full: ${tokens.radius.full};
    
    /* Shadows */
    --shadow-sm: ${tokens.shadow.sm};
    --shadow-md: ${tokens.shadow.md};
    --shadow-lg: ${tokens.shadow.lg};
    --shadow-xl: ${tokens.shadow.xl};
    --shadow-glass: ${tokens.shadow.glass};
    --shadow-glow: ${tokens.shadow.glow};
    
    /* Animation */
    --duration-fast: ${tokens.animation.duration.fast};
    --duration-normal: ${tokens.animation.duration.normal};
    --duration-slow: ${tokens.animation.duration.slow};
    --easing-ease: ${tokens.animation.easing.ease};
    --easing-ease-in: ${tokens.animation.easing.easeIn};
    --easing-ease-out: ${tokens.animation.easing.easeOut};
    --easing-ease-in-out: ${tokens.animation.easing.easeInOut};
  }
`

// Utility functions for common patterns
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return {
        bg: 'rgba(16, 185, 129, 0.2)',
        text: '#10B981',
        border: 'rgba(16, 185, 129, 0.3)',
      }
    case 'intermediate':
      return {
        bg: 'rgba(245, 158, 11, 0.2)',
        text: '#F59E0B',
        border: 'rgba(245, 158, 11, 0.3)',
      }
    case 'advanced':
      return {
        bg: 'rgba(239, 68, 68, 0.2)',
        text: '#EF4444',
        border: 'rgba(239, 68, 68, 0.3)',
      }
    default:
      return {
        bg: 'rgba(107, 114, 128, 0.2)',
        text: '#6B7280',
        border: 'rgba(107, 114, 128, 0.3)',
      }
  }
}

export const getVectorColor = (vector: string) => {
  const colors = {
    'M01': '#3B82F6', // Blue
    'M02': '#10B981', // Green
    'M03': '#F59E0B', // Yellow
    'M04': '#EF4444', // Red
    'M05': '#8B5CF6', // Purple
    'M06': '#06B6D4', // Cyan
    'M07': '#F97316', // Orange
    'M08': '#84CC16', // Lime
    'M09': '#EC4899', // Pink
    'M10': '#6366F1', // Indigo
    'M11': '#14B8A6', // Teal
    'M12': '#F43F5E', // Rose
    'M13': '#A855F7', // Violet
  }
  
  return colors[vector as keyof typeof colors] || tokens.colors.accent
}

// Focus ring utility
export const focusRing = `
  focus:outline-none focus:ring-2 focus:ring-${tokens.colors.accent} focus:ring-offset-2 focus:ring-offset-${tokens.colors.bg}
`

// Glass effect utility
export const glassEffect = `
  backdrop-blur-sm bg-${tokens.colors.glass} border border-${tokens.colors.glassBorder}
`
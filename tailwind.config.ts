import { tokens } from './styles/tokens';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Design tokens integration
      colors: {
        // Foreground colors
        fg: {
          primary: tokens.colors.fg.primary,
          secondary: tokens.colors.fg.secondary,
          tertiary: tokens.colors.fg.tertiary,
          accent: tokens.colors.fg.accent,
        },
        
        // Background colors
        bg: {
          primary: tokens.colors.bg.primary,
          secondary: tokens.colors.bg.secondary,
          tertiary: tokens.colors.bg.tertiary,
          glass: tokens.colors.bg.glass,
          'glass-hover': tokens.colors.bg.glassHover,
        },
        
        // Muted colors
        muted: {
          primary: tokens.colors.muted.primary,
          secondary: tokens.colors.muted.secondary,
          accent: tokens.colors.muted.accent,
        },
        
        // Accent colors (Gold theme)
        accent: {
          primary: tokens.colors.accent.primary,
          secondary: tokens.colors.accent.secondary,
          tertiary: tokens.colors.accent.tertiary,
          contrast: tokens.colors.accent.contrast,
        },
        
        // State colors
        state: {
          success: tokens.colors.state.success,
          warning: tokens.colors.state.warning,
          error: tokens.colors.state.error,
          info: tokens.colors.state.info,
          'success-bg': tokens.colors.state.successBg,
          'warning-bg': tokens.colors.state.warningBg,
          'error-bg': tokens.colors.state.errorBg,
          'info-bg': tokens.colors.state.infoBg,
        },
        
        // Border colors
        border: {
          primary: tokens.colors.border.primary,
          secondary: tokens.colors.border.secondary,
          accent: tokens.colors.border.accent,
          glass: tokens.colors.border.glass,
        },
        
        // Legacy shadcn/ui colors for compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        ring: 'hsl(var(--ring))',
        input: 'hsl(var(--input))',
      },
      
      // Spacing system
      spacing: tokens.spacing,
      
      // Border radius system
      borderRadius: tokens.radii,
      
      // Z-index system
      zIndex: tokens.zIndex,
      
      // Typography system
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      
      // Shadow system
      boxShadow: tokens.shadow,
      
      // Transition system
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
        bounce: '500ms',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      // Animation system
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'glass-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(209, 169, 84, 0.1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(209, 169, 84, 0.2)' 
          },
        },
        'ritual-pulse': {
          '0%': { boxShadow: '0 0 0 0 oklch(0.8 0.189 84.429 / 0.7)' },
          '70%': { boxShadow: '0 0 0 10px oklch(0.8 0.189 84.429 / 0)' },
          '100%': { boxShadow: '0 0 0 0 oklch(0.8 0.189 84.429 / 0)' },
        },
        'initiation-glow': {
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'glass-glow': 'glass-glow 2s ease-in-out infinite',
        'ritual-pulse': 'ritual-pulse 2s infinite',
        'initiation-glow': 'initiation-glow 3s infinite',
      },
      
      // Glass effect utilities
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Custom plugin for glass effects
    function({ addUtilities }: any) {
      const glassUtilities = {
        '.glass': {
          background: tokens.glass.background,
          backdropFilter: `blur(${tokens.glass.backdrop})`,
          border: tokens.glass.border,
        },
        '.glass-hover': {
          '&:hover': {
            background: tokens.glass.hover.background,
            border: tokens.glass.hover.border,
          },
        },
        '.glass-card': {
          background: tokens.glass.background,
          backdropFilter: `blur(${tokens.glass.backdrop})`,
          border: tokens.glass.border,
          borderRadius: tokens.radii.lg,
          boxShadow: tokens.shadow.glass,
        },
        '.glass-card-hover': {
          '&:hover': {
            background: tokens.glass.hover.background,
            border: tokens.glass.hover.border,
            transform: 'translateY(-2px)',
            boxShadow: tokens.shadow.lg,
          },
        },
        // Ritualized affordances
        '.ritual-hover': {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px oklch(0.8 0.189 84.429 / 0.3)',
          },
        },
        '.ritual-pulse': {
          animation: 'ritual-pulse 2s infinite',
        },
        '.initiation-glow': {
          animation: 'initiation-glow 3s infinite',
        },
        // Focus ring utilities - WCAG 2.1 AA compliant
        '.focus-ring': {
          '&:focus-visible': {
            outline: tokens.a11y.focus.outline,
            ring: '2px',
            ringColor: tokens.a11y.focus.ring,
            ringOffset: tokens.a11y.focus.ringOffset,
            ringOffsetColor: tokens.a11y.focus.ringOffsetColor,
          },
        },
        '.focus-ring-inset': {
          '&:focus-visible': {
            outline: tokens.a11y.focus.outline,
            ring: '2px',
            ringColor: tokens.a11y.focus.ring,
            ringOffset: '-2px',
            ringOffsetColor: tokens.a11y.focus.ringOffsetColor,
          },
        },
        // Skip link utility
        '.skip-link': {
          position: tokens.a11y.skipLink.position,
          top: tokens.a11y.skipLink.top,
          left: tokens.a11y.skipLink.left,
          background: tokens.a11y.skipLink.background,
          color: tokens.a11y.skipLink.color,
          padding: tokens.a11y.skipLink.padding,
          borderRadius: tokens.a11y.skipLink.borderRadius,
          zIndex: tokens.a11y.skipLink.zIndex,
          textDecoration: tokens.a11y.skipLink.textDecoration,
          fontWeight: tokens.a11y.skipLink.fontWeight,
          '&:focus': tokens.a11y.skipLink['&:focus'],
        },
        // High contrast mode support
        '.high-contrast': {
          border: tokens.a11y.highContrast.border,
          background: tokens.a11y.highContrast.background,
          color: tokens.a11y.highContrast.color,
        },
        // Reduced motion support
        '.reduced-motion': {
          transition: tokens.a11y.reducedMotion.transition,
          animation: tokens.a11y.reducedMotion.animation,
        },
      };
      
      addUtilities(glassUtilities);
    },
  ],
};

export default config;
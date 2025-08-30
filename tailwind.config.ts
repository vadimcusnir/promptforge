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
      // Unified Design System Colors
      colors: {
        // State colors
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        error: tokens.colors.error,
        info: tokens.colors.info,
        
        // Unified shadcn/ui colors
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
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      
      // Spacing system
      spacing: tokens.spacing,
      
      // Border radius system
      borderRadius: tokens.radius,
      
      // Z-index system
      zIndex: tokens.zIndex,
      
      // Unified Typography System
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      
      // PFv3.1 Shadow System
      boxShadow: {
        'glow': '0 0 0 2px rgba(0,255,127,.2), 0 0 24px rgba(0,255,127,.35)',
        'rune': '0 0 0 1px rgba(205,164,52,.3), 0 0 12px rgba(205,164,52,.2)',
      },
      
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
          background: tokens.colors.glass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${tokens.colors.glassBorder}`,
        },
        '.glass-hover': {
          '&:hover': {
            background: tokens.colors.glass,
            border: `1px solid ${tokens.colors.borderHover}`,
          },
        },
        '.glass-card': {
          background: tokens.colors.glass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${tokens.colors.glassBorder}`,
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadow.glass,
        },
        '.glass-card-hover': {
          '&:hover': {
            background: tokens.colors.glass,
            border: `1px solid ${tokens.colors.borderHover}`,
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
            outline: 'none',
            ring: '2px',
            ringColor: tokens.colors.accent,
            ringOffset: '2px',
            ringOffsetColor: tokens.colors.bg,
          },
        },
        '.focus-ring-inset': {
          '&:focus-visible': {
            outline: 'none',
            ring: '2px',
            ringColor: tokens.colors.accent,
            ringOffset: '-2px',
            ringOffsetColor: tokens.colors.bg,
          },
        },
      };
      
      addUtilities(glassUtilities);
    },
  ],
};

export default config;
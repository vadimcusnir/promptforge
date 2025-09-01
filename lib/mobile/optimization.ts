// Mobile UI/UX optimization system for PromptForge
// Implements responsive design, accessibility, and performance optimizations

export interface MobileBreakpoint {
  name: string
  width: number
  height?: number
}

export interface TapTarget {
  element: string
  width: number
  height: number
  spacing: number
  accessible: boolean
}

export interface PerformanceMetrics {
  lcp: number
  inp: number
  cls: number
  fcp: number
  ttfb: number
}

export interface AccessibilityAudit {
  contrastRatio: number
  focusVisible: boolean
  landmarks: string[]
  tabOrder: string[]
  reducedMotion: boolean
  screenReader: boolean
}

// Mobile breakpoints for testing
export const MOBILE_BREAKPOINTS: MobileBreakpoint[] = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 12 Mini', width: 360, height: 780 },
  { name: 'iPhone 12/13', width: 390, height: 844 },
  { name: 'iPhone 12/13 Pro Max', width: 414, height: 896 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'Samsung Galaxy S21', width: 360, height: 800 },
  { name: 'Google Pixel 5', width: 393, height: 851 }
]

class MobileOptimization {
  // Validate tap targets meet minimum requirements
  validateTapTargets(elements: TapTarget[]): {
    valid: boolean
    violations: Array<{ element: string; issue: string; recommendation: string }>
  } {
    const violations: Array<{ element: string; issue: string; recommendation: string }> = []
    
    for (const target of elements) {
      // Minimum tap target size: 44x44px
      if (target.width < 44 || target.height < 44) {
        violations.push({
          element: target.element,
          issue: `Tap target too small: ${target.width}x${target.height}px`,
          recommendation: 'Increase tap target to minimum 44x44px'
        })
      }
      
      // Minimum spacing between tap targets: 8px
      if (target.spacing < 8) {
        violations.push({
          element: target.element,
          issue: `Insufficient spacing: ${target.spacing}px`,
          recommendation: 'Increase spacing to minimum 8px between tap targets'
        })
      }
      
      // Accessibility check
      if (!target.accessible) {
        violations.push({
          element: target.element,
          issue: 'Not accessible to screen readers',
          recommendation: 'Add proper ARIA labels and semantic markup'
        })
      }
    }
    
    return {
      valid: violations.length === 0,
      violations
    }
  }

  // Generate responsive CSS for mobile breakpoints
  generateResponsiveCSS(): string {
    return `
      /* Mobile-first responsive design */
      .container {
        width: 100%;
        max-width: 100vw;
        padding: 0 16px;
        margin: 0 auto;
      }

      /* Safe area handling for iOS */
      .safe-area-top {
        padding-top: env(safe-area-inset-top);
      }

      .safe-area-bottom {
        padding-bottom: env(safe-area-inset-bottom);
      }

      .safe-area-left {
        padding-left: env(safe-area-inset-left);
      }

      .safe-area-right {
        padding-right: env(safe-area-inset-right);
      }

      /* Minimum tap target sizes */
      .tap-target {
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        touch-action: manipulation;
      }

      /* Sticky CTA positioning */
      .sticky-cta {
        position: sticky;
        bottom: 0;
        z-index: 50;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        padding: 16px;
        margin: 0 -16px;
      }

      /* Typography scaling */
      .text-mobile {
        font-size: 16px;
        line-height: 1.5;
        letter-spacing: 0.01em;
      }

      .text-mobile-large {
        font-size: 18px;
        line-height: 1.4;
      }

      .text-mobile-small {
        font-size: 14px;
        line-height: 1.4;
      }

      /* Spacing system */
      .space-mobile-xs { margin: 4px; }
      .space-mobile-sm { margin: 8px; }
      .space-mobile-md { margin: 12px; }
      .space-mobile-lg { margin: 16px; }
      .space-mobile-xl { margin: 24px; }
      .space-mobile-2xl { margin: 32px; }

      /* Input optimization */
      .input-mobile {
        font-size: 16px; /* Prevents zoom on iOS */
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        width: 100%;
        box-sizing: border-box;
      }

      /* Focus states */
      .focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .text-muted {
          color: #000;
        }
        
        .border {
          border-color: #000;
        }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .input-mobile {
          background-color: #1f2937;
          border-color: #374151;
          color: #f9fafb;
        }
      }

      /* Breakpoint-specific styles */
      @media (max-width: 320px) {
        .container {
          padding: 0 12px;
        }
        
        .text-mobile {
          font-size: 14px;
        }
      }

      @media (min-width: 768px) {
        .container {
          max-width: 768px;
        }
        
        .sticky-cta {
          position: relative;
          background: transparent;
          backdrop-filter: none;
          margin: 0;
        }
      }
    `
  }

  // Validate performance metrics against Core Web Vitals
  validatePerformance(metrics: PerformanceMetrics): {
    passed: boolean
    issues: Array<{ metric: string; value: number; threshold: number; status: 'good' | 'needs-improvement' | 'poor' }>
  } {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      inp: { good: 200, poor: 500 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
      ttfb: { good: 800, poor: 1800 }
    }

    const issues: Array<{ metric: string; value: number; threshold: number; status: 'good' | 'needs-improvement' | 'poor' }> = []

    for (const [metric, value] of Object.entries(metrics)) {
      const threshold = thresholds[metric as keyof typeof thresholds]
      let status: 'good' | 'needs-improvement' | 'poor'

      if (value <= threshold.good) {
        status = 'good'
      } else if (value <= threshold.poor) {
        status = 'needs-improvement'
      } else {
        status = 'poor'
      }

      if (status !== 'good') {
        issues.push({
          metric,
          value,
          threshold: threshold.good,
          status
        })
      }
    }

    return {
      passed: issues.length === 0,
      issues
    }
  }

  // Audit accessibility compliance
  auditAccessibility(): AccessibilityAudit {
    // This would integrate with actual accessibility testing tools
    // For now, return a mock audit structure
    return {
      contrastRatio: 4.5, // WCAG AA minimum
      focusVisible: true,
      landmarks: ['header', 'nav', 'main', 'footer'],
      tabOrder: ['header', 'nav', 'main', 'footer'],
      reducedMotion: true,
      screenReader: true
    }
  }

  // Generate mobile-optimized component props
  generateMobileProps(componentType: 'button' | 'input' | 'link' | 'card'): Record<string, any> {
    const baseProps = {
      className: 'tap-target',
      style: {
        minWidth: '44px',
        minHeight: '44px',
        touchAction: 'manipulation' as const
      }
    }

    switch (componentType) {
      case 'button':
        return {
          ...baseProps,
          className: `${baseProps.className} focus-visible`,
          type: 'button' as const
        }
      
      case 'input':
        return {
          className: 'input-mobile focus-visible',
          autoComplete: 'on' as const,
          autoCorrect: 'on' as const,
          autoCapitalize: 'sentences' as const,
          spellCheck: true
        }
      
      case 'link':
        return {
          ...baseProps,
          className: `${baseProps.className} focus-visible`,
          role: 'link' as const
        }
      
      case 'card':
        return {
          className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-4',
          style: {
            marginBottom: '16px'
          }
        }
      
      default:
        return baseProps
    }
  }

  // Generate skeleton loading states
  generateSkeletonCSS(): string {
    return `
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
      }

      @keyframes skeleton-loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      .skeleton-text {
        height: 16px;
        margin-bottom: 8px;
      }

      .skeleton-text:last-child {
        width: 60%;
      }

      .skeleton-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      .skeleton-button {
        height: 44px;
        width: 120px;
        border-radius: 8px;
      }

      .skeleton-card {
        height: 200px;
        border-radius: 12px;
        margin-bottom: 16px;
      }

      /* Dark mode skeleton */
      @media (prefers-color-scheme: dark) {
        .skeleton {
          background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
          background-size: 200% 100%;
        }
      }
    `
  }

  // Generate offline state components
  generateOfflineStates(): Record<string, string> {
    return {
      noConnection: `
        <div class="offline-state">
          <div class="offline-icon">📡</div>
          <h3>No Internet Connection</h3>
          <p>Please check your connection and try again.</p>
          <button class="retry-button tap-target">Retry</button>
        </div>
      `,
      loading: `
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      `,
      error: `
        <div class="error-state">
          <div class="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>We're having trouble loading this content.</p>
          <button class="retry-button tap-target">Try Again</button>
        </div>
      `,
      empty: `
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>No content yet</h3>
          <p>Start by creating your first prompt.</p>
          <button class="create-button tap-target">Create Prompt</button>
        </div>
      `
    }
  }

  // Validate mobile-specific requirements
  validateMobileRequirements(): {
    passed: boolean
    issues: Array<{ category: string; issue: string; recommendation: string }>
  } {
    const issues: Array<{ category: string; issue: string; recommendation: string }> = []

    // Check for horizontal scroll
    if (typeof window !== 'undefined') {
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth
      if (hasHorizontalScroll) {
        issues.push({
          category: 'Layout',
          issue: 'Horizontal scroll detected',
          recommendation: 'Ensure all content fits within viewport width'
        })
      }
    }

    // Check for safe area support
    const hasSafeAreaSupport = CSS.supports('padding-top: env(safe-area-inset-top)')
    if (!hasSafeAreaSupport) {
      issues.push({
        category: 'iOS Support',
        issue: 'Safe area insets not supported',
        recommendation: 'Add fallback padding for iOS devices with notches'
      })
    }

    // Check for proper viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    if (!viewportMeta) {
      issues.push({
        category: 'Viewport',
        issue: 'Viewport meta tag missing',
        recommendation: 'Add viewport meta tag for proper mobile rendering'
      })
    }

    return {
      passed: issues.length === 0,
      issues
    }
  }
}

// Export singleton instance
export const mobileOptimization = new MobileOptimization()

/**
 * Accessibility utilities for PromptForge
 * WCAG 2.1 AA compliance helpers and testing utilities
 */

// Color contrast ratio calculation
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    // Apply gamma correction
    const [rs, gs, bs] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    )

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)

  return (brightest + 0.05) / (darkest + 0.05)
}

// WCAG 2.1 AA compliance check
export function isWCAGCompliant(contrastRatio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? contrastRatio >= 3 : contrastRatio >= 4.5
}

// Generate accessible color combinations
export function generateAccessibleColors(baseColor: string, background: string = '#000000'): {
  primary: string
  hover: string
  focus: string
  disabled: string
} {
  const baseRatio = getContrastRatio(baseColor, background)
  
  // Ensure minimum contrast ratios
  const primary = isWCAGCompliant(baseRatio) ? baseColor : adjustColorForContrast(baseColor, background, 4.5)
  const hover = adjustColorForContrast(primary, background, 4.5)
  const focus = adjustColorForContrast(primary, background, 4.5)
  const disabled = adjustColorForContrast(primary, background, 3) // Large text ratio for disabled

  return { primary, hover, focus, disabled }
}

// Adjust color to meet contrast requirements
function adjustColorForContrast(color: string, background: string, targetRatio: number): string {
  // This is a simplified implementation
  // In practice, you'd want more sophisticated color adjustment
  const currentRatio = getContrastRatio(color, background)
  
  if (currentRatio >= targetRatio) {
    return color
  }

  // Lighten or darken the color to improve contrast
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // Simple adjustment - increase brightness
  const factor = targetRatio / currentRatio
  const newR = Math.min(255, Math.round(r * factor))
  const newG = Math.min(255, Math.round(g * factor))
  const newB = Math.min(255, Math.round(b * factor))

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// ARIA live region management
export class AriaLiveManager {
  private regions: Map<string, HTMLElement> = new Map()

  createRegion(id: string, politeness: 'polite' | 'assertive' = 'polite'): HTMLElement {
    if (this.regions.has(id)) {
      return this.regions.get(id)!
    }

    const region = document.createElement('div')
    region.id = id
    region.setAttribute('aria-live', politeness)
    region.setAttribute('aria-atomic', 'true')
    region.className = 'sr-only'
    document.body.appendChild(region)

    this.regions.set(id, region)
    return region
  }

  announce(message: string, id: string = 'default', politeness: 'polite' | 'assertive' = 'polite'): void {
    const region = this.regions.get(id) || this.createRegion(id, politeness)
    region.textContent = message
  }

  clear(id: string = 'default'): void {
    const region = this.regions.get(id)
    if (region) {
      region.textContent = ''
    }
  }

  destroy(id: string): void {
    const region = this.regions.get(id)
    if (region) {
      region.remove()
      this.regions.delete(id)
    }
  }
}

// Focus management utilities
export class FocusManager {
  private focusHistory: HTMLElement[] = []
  private trapStack: HTMLElement[] = []

  // Save current focus for restoration
  saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement)
    }
  }

  // Restore previous focus
  restoreFocus(): void {
    const previousFocus = this.focusHistory.pop()
    if (previousFocus && previousFocus.focus) {
      previousFocus.focus()
    }
  }

  // Trap focus within an element
  trapFocus(container: HTMLElement): void {
    this.trapStack.push(container)
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    // Store cleanup function
    ;(container as any).__focusTrapCleanup = () => {
      container.removeEventListener('keydown', handleKeyDown)
      this.trapStack = this.trapStack.filter(el => el !== container)
    }
  }

  // Release focus trap
  releaseFocus(container: HTMLElement): void {
    const cleanup = (container as any).__focusTrapCleanup
    if (cleanup) {
      cleanup()
    }
  }

  // Move focus to next/previous element
  moveFocus(direction: 'next' | 'previous'): void {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)
    let nextIndex: number

    if (direction === 'next') {
      nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1
    }

    focusableElements[nextIndex]?.focus()
  }
}

// Keyboard navigation utilities
export const KeyboardNavigation = {
  // Common keyboard shortcuts
  shortcuts: {
    ESCAPE: 'Escape',
    ENTER: 'Enter',
    SPACE: ' ',
    TAB: 'Tab',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End',
  },

  // Check if key is a navigation key
  isNavigationKey(key: string): boolean {
    return [
      this.shortcuts.ARROW_UP,
      this.shortcuts.ARROW_DOWN,
      this.shortcuts.ARROW_LEFT,
      this.shortcuts.ARROW_RIGHT,
      this.shortcuts.HOME,
      this.shortcuts.END,
    ].includes(key)
  },

  // Check if key is an activation key
  isActivationKey(key: string): boolean {
    return [
      this.shortcuts.ENTER,
      this.shortcuts.SPACE,
    ].includes(key)
  },

  // Handle keyboard events for common patterns
  handleKeyboardEvent(
    event: KeyboardEvent,
    handlers: {
      onEscape?: () => void
      onEnter?: () => void
      onSpace?: () => void
      onArrowUp?: () => void
      onArrowDown?: () => void
      onArrowLeft?: () => void
      onArrowRight?: () => void
      onHome?: () => void
      onEnd?: () => void
    }
  ): void {
    switch (event.key) {
      case this.shortcuts.ESCAPE:
        handlers.onEscape?.()
        break
      case this.shortcuts.ENTER:
        handlers.onEnter?.()
        break
      case this.shortcuts.SPACE:
        event.preventDefault() // Prevent page scroll
        handlers.onSpace?.()
        break
      case this.shortcuts.ARROW_UP:
        event.preventDefault()
        handlers.onArrowUp?.()
        break
      case this.shortcuts.ARROW_DOWN:
        event.preventDefault()
        handlers.onArrowDown?.()
        break
      case this.shortcuts.ARROW_LEFT:
        event.preventDefault()
        handlers.onArrowLeft?.()
        break
      case this.shortcuts.ARROW_RIGHT:
        event.preventDefault()
        handlers.onArrowRight?.()
        break
      case this.shortcuts.HOME:
        event.preventDefault()
        handlers.onHome?.()
        break
      case this.shortcuts.END:
        event.preventDefault()
        handlers.onEnd?.()
        break
    }
  },
}

// Screen reader utilities
export const ScreenReader = {
  // Announce text to screen readers
  announce(text: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = text

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },

  // Check if screen reader is likely active
  isScreenReaderActive(): boolean {
    return (
      window.speechSynthesis !== undefined ||
      'speechSynthesis' in window ||
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver')
    )
  },
}

// Export singleton instances
export const ariaLiveManager = new AriaLiveManager()
export const focusManager = new FocusManager()

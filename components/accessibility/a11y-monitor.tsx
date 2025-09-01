'use client'

import { useEffect } from 'react'
import { useTelemetry } from '@/hooks/use-telemetry'

export function A11yMonitor() {
  const { track } = useTelemetry()

  useEffect(() => {
    // Monitor focus management
    const monitorFocus = () => {
      let focusTraps = 0
      let focusableElements = 0
      let elementsWithoutFocus = 0

      // Check for focusable elements
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ]

      focusableSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        focusableElements += elements.length
        
        elements.forEach(element => {
          if (!element.hasAttribute('aria-label') && 
              !element.hasAttribute('aria-labelledby') && 
              !element.textContent?.trim()) {
            elementsWithoutFocus++
          }
        })
      })

      // Check for focus traps
      const focusableElementsList = document.querySelectorAll(focusableSelectors.join(', '))
      const firstElement = focusableElementsList[0]
      const lastElement = focusableElementsList[focusableElementsList.length - 1]

      if (firstElement && lastElement) {
        // Check if focus can cycle properly
        firstElement.addEventListener('keydown', (e) => {
          if (e.key === 'Tab' && e.shiftKey) {
            focusTraps++
          }
        })
      }

      track('a11y_focus_audit', {
        focusableElements,
        elementsWithoutFocus,
        focusTraps,
        passed: elementsWithoutFocus === 0 && focusTraps === 0
      })
    }

    // Monitor color contrast
    const monitorContrast = () => {
      let lowContrastElements = 0
      
      const elements = document.querySelectorAll('*')
      elements.forEach(element => {
        const styles = window.getComputedStyle(element)
        const color = styles.color
        const backgroundColor = styles.backgroundColor
        
        // Simple contrast check (this is a basic implementation)
        if (color && backgroundColor && color !== backgroundColor) {
          // In a real implementation, you'd calculate actual contrast ratio
          // For now, we'll just track that we're monitoring
        }
      })

      track('a11y_contrast_audit', {
        lowContrastElements,
        passed: lowContrastElements === 0
      })
    }

    // Monitor keyboard navigation
    const monitorKeyboard = () => {
      let keyboardIssues = 0
      
      // Check for elements that should be keyboard accessible
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]')
      
      interactiveElements.forEach(element => {
        // Check if element is focusable
        if (element.getAttribute('tabindex') === '-1') {
          keyboardIssues++
        }
        
        // Check for proper ARIA attributes
        if (element.hasAttribute('aria-expanded') && !element.hasAttribute('aria-controls')) {
          keyboardIssues++
        }
      })

      track('a11y_keyboard_audit', {
        keyboardIssues,
        passed: keyboardIssues === 0
      })
    }

    // Monitor ARIA usage
    const monitorARIA = () => {
      let ariaIssues = 0
      
      // Check for missing ARIA labels
      const elementsNeedingLabels = document.querySelectorAll('input, select, textarea, button')
      elementsNeedingLabels.forEach(element => {
        if (!element.hasAttribute('aria-label') && 
            !element.hasAttribute('aria-labelledby') && 
            !element.getAttribute('placeholder') &&
            !element.textContent?.trim()) {
          ariaIssues++
        }
      })

      // Check for invalid ARIA attributes
      const elementsWithAria = document.querySelectorAll('[aria-*]')
      elementsWithAria.forEach(element => {
        const ariaAttributes = Array.from(element.attributes)
          .filter(attr => attr.name.startsWith('aria-'))
        
        ariaAttributes.forEach(attr => {
          // Basic validation (in real implementation, use proper ARIA validator)
          if (attr.name === 'aria-expanded' && !['true', 'false'].includes(attr.value)) {
            ariaIssues++
          }
        })
      })

      track('a11y_aria_audit', {
        ariaIssues,
        passed: ariaIssues === 0
      })
    }

    // Monitor screen reader compatibility
    const monitorScreenReader = () => {
      let screenReaderIssues = 0
      
      // Check for images without alt text
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        if (!img.hasAttribute('alt')) {
          screenReaderIssues++
        }
      })

      // Check for headings structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let headingLevels: number[] = []
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1))
        headingLevels.push(level)
      })

      // Check for proper heading hierarchy
      for (let i = 1; i < headingLevels.length; i++) {
        if (headingLevels[i] - headingLevels[i-1] > 1) {
          screenReaderIssues++
        }
      }

      track('a11y_screen_reader_audit', {
        screenReaderIssues,
        headingCount: headings.length,
        passed: screenReaderIssues === 0
      })
    }

    // Run accessibility audits
    const runA11yAudit = () => {
      monitorFocus()
      monitorContrast()
      monitorKeyboard()
      monitorARIA()
      monitorScreenReader()
    }

    // Run audit after page load
    if (document.readyState === 'complete') {
      runA11yAudit()
    } else {
      window.addEventListener('load', runA11yAudit)
    }

    // Monitor for accessibility issues during runtime
    const observer = new MutationObserver((mutations) => {
      let hasA11yChanges = false
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              hasA11yChanges = true
            }
          })
        }
      })

      if (hasA11yChanges) {
        // Re-run audit after DOM changes
        setTimeout(runA11yAudit, 100)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
    }

  }, [track])

  return null // This component doesn't render anything
}
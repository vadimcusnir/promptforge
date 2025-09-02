// Design Contract Validation System
// Enforces design system compliance at build time and runtime

export interface DesignContractViolation {
  type: "error" | "warning"
  rule: string
  message: string
  element?: string
  file?: string
  line?: number
}

export interface ComponentValidationResult {
  isValid: boolean
  violations: DesignContractViolation[]
  score: number // 0-100
}

export function validateTypography(element: HTMLElement): DesignContractViolation[] {
  const violations: DesignContractViolation[] = []
  const computedStyle = window.getComputedStyle(element)

  // Check minimum font size (16px for body text)
  const fontSize = Number.parseFloat(computedStyle.fontSize)
  if (element.tagName === "P" && fontSize < 16) {
    violations.push({
      type: "error",
      rule: "typography-min-size",
      message: `Body text must be ≥16px. Current: ${fontSize}px`,
      element: element.tagName.toLowerCase(),
    })
  }

  // Check line height (≥1.35)
  const lineHeight = Number.parseFloat(computedStyle.lineHeight) / fontSize
  if (lineHeight < 1.35) {
    violations.push({
      type: "error",
      rule: "typography-line-height",
      message: `Line height must be ≥1.35. Current: ${lineHeight.toFixed(2)}`,
      element: element.tagName.toLowerCase(),
    })
  }

  // Check text width (75-85 characters)
  if (element.tagName === "P") {
    const textContent = element.textContent || ""
    const avgCharWidth = fontSize * 0.6 // Approximate character width
    const elementWidth = element.offsetWidth
    const estimatedChars = elementWidth / avgCharWidth

    if (estimatedChars > 85) {
      violations.push({
        type: "warning",
        rule: "typography-line-length",
        message: `Text line too long. Estimated ${Math.round(estimatedChars)} chars, max 85`,
        element: element.tagName.toLowerCase(),
      })
    }
  }

  // Check heading hierarchy
  if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(element.tagName)) {
    const fontFamily = computedStyle.fontFamily
    if (!fontFamily.includes("Cinzel")) {
      violations.push({
        type: "error",
        rule: "typography-heading-font",
        message: `Headings must use Cinzel font. Current: ${fontFamily}`,
        element: element.tagName.toLowerCase(),
      })
    }
  }

  return violations
}

export function validateColors(element: HTMLElement): DesignContractViolation[] {
  const violations: DesignContractViolation[] = []
  const computedStyle = window.getComputedStyle(element)

  // Check for arbitrary color values (not from design tokens)
  const backgroundColor = computedStyle.backgroundColor
  const color = computedStyle.color

  // List of allowed design token colors (RGB values)
  const allowedColors = [
    "rgb(5, 1, 10)", // #05010A - Dark ritual
    "rgb(205, 164, 52)", // #CDA434 - Gold
    "rgb(0, 255, 127)", // #00FF7F - Neon green
    "rgb(255, 255, 255)", // White
    "rgb(0, 0, 0)", // Black
    "rgba(0, 0, 0, 0)", // Transparent
  ]

  if (
    backgroundColor !== "rgba(0, 0, 0, 0)" &&
    !allowedColors.some((allowed) => backgroundColor.includes(allowed.split("(")[1].split(")")[0]))
  ) {
    violations.push({
      type: "warning",
      rule: "color-arbitrary-background",
      message: `Background color may not be from design tokens: ${backgroundColor}`,
      element: element.tagName.toLowerCase(),
    })
  }

  return violations
}

export function validateSpacing(element: HTMLElement): DesignContractViolation[] {
  const violations: DesignContractViolation[] = []
  const computedStyle = window.getComputedStyle(element)

  // Check 4px/8px spacing scale
  const spacingProperties = [
    "marginTop",
    "marginBottom",
    "marginLeft",
    "marginRight",
    "paddingTop",
    "paddingBottom",
    "paddingLeft",
    "paddingRight",
  ]

  spacingProperties.forEach((prop) => {
    const value = Number.parseFloat(computedStyle[prop as keyof CSSStyleDeclaration] as string)
    if (value > 0 && value % 4 !== 0) {
      violations.push({
        type: "warning",
        rule: "spacing-scale",
        message: `${prop} should follow 4px/8px scale. Current: ${value}px`,
        element: element.tagName.toLowerCase(),
      })
    }
  })

  return violations
}

export function validateAccessibility(element: HTMLElement): DesignContractViolation[] {
  const violations: DesignContractViolation[] = []

  // Check tap target size (≥44px)
  if (["BUTTON", "A", "INPUT"].includes(element.tagName)) {
    const rect = element.getBoundingClientRect()
    if (rect.width < 44 || rect.height < 44) {
      violations.push({
        type: "error",
        rule: "accessibility-tap-target",
        message: `Interactive elements must be ≥44×44px. Current: ${Math.round(rect.width)}×${Math.round(rect.height)}px`,
        element: element.tagName.toLowerCase(),
      })
    }
  }

  // Check focus indicators
  if (["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"].includes(element.tagName)) {
    const focusStyle = window.getComputedStyle(element, ":focus-visible")
    if (!focusStyle.outline || focusStyle.outline === "none") {
      violations.push({
        type: "error",
        rule: "accessibility-focus-indicator",
        message: "Interactive elements must have visible focus indicators",
        element: element.tagName.toLowerCase(),
      })
    }
  }

  // Check alt text for images
  if (element.tagName === "IMG") {
    const img = element as HTMLImageElement
    if (!img.alt && !img.getAttribute("aria-label")) {
      violations.push({
        type: "error",
        rule: "accessibility-alt-text",
        message: "Images must have alt text or aria-label",
        element: element.tagName.toLowerCase(),
      })
    }
  }

  return violations
}

export function validatePerformance(element: HTMLElement): DesignContractViolation[] {
  const violations: DesignContractViolation[] = []

  // Check animation duration (≤200ms)
  const computedStyle = window.getComputedStyle(element)
  const animationDuration = computedStyle.animationDuration
  const transitionDuration = computedStyle.transitionDuration

  if (animationDuration && animationDuration !== "none") {
    const duration = Number.parseFloat(animationDuration) * 1000 // Convert to ms
    if (duration > 200) {
      violations.push({
        type: "error",
        rule: "performance-animation-duration",
        message: `Animation duration must be ≤200ms. Current: ${duration}ms`,
        element: element.tagName.toLowerCase(),
      })
    }
  }

  if (transitionDuration && transitionDuration !== "none") {
    const duration = Number.parseFloat(transitionDuration) * 1000 // Convert to ms
    if (duration > 200) {
      violations.push({
        type: "error",
        rule: "performance-transition-duration",
        message: `Transition duration must be ≤200ms. Current: ${duration}ms`,
        element: element.tagName.toLowerCase(),
      })
    }
  }

  return violations
}

export function validateDesignContract(element: HTMLElement): ComponentValidationResult {
  const violations: DesignContractViolation[] = [
    ...validateTypography(element),
    ...validateColors(element),
    ...validateSpacing(element),
    ...validateAccessibility(element),
    ...validatePerformance(element),
  ]

  const errorCount = violations.filter((v) => v.type === "error").length
  const warningCount = violations.filter((v) => v.type === "warning").length

  // Calculate score (100 - penalties)
  const score = Math.max(0, 100 - errorCount * 10 - warningCount * 2)

  return {
    isValid: errorCount === 0,
    violations,
    score,
  }
}

export function validatePage(): ComponentValidationResult {
  const allElements = document.querySelectorAll("*")
  const allViolations: DesignContractViolation[] = []

  allElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      const result = validateDesignContract(element)
      allViolations.push(...result.violations)
    }
  })

  const errorCount = allViolations.filter((v) => v.type === "error").length
  const warningCount = allViolations.filter((v) => v.type === "warning").length
  const score = Math.max(0, 100 - errorCount * 10 - warningCount * 2)

  return {
    isValid: errorCount === 0,
    violations: allViolations,
    score,
  }
}

export function enableDesignContractValidation() {
  if (process.env.NODE_ENV !== "development") return

  // Run validation on page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      const result = validatePage()

      if (result.violations.length > 0) {
        console.group("🎨 Design Contract Violations")
        console.log(`Score: ${result.score}/100`)

        result.violations.forEach((violation) => {
          const method = violation.type === "error" ? "error" : "warn"
          console[method](`[${violation.rule}] ${violation.message}`)
        })

        console.groupEnd()
      } else {
        console.log("✅ Design Contract: All validations passed!")
      }
    }, 1000)
  })

  // Run validation on DOM changes
  const observer = new MutationObserver(() => {
    // Debounce validation
    clearTimeout((window as any).designContractTimeout)
    ;(window as any).designContractTimeout = setTimeout(() => {
      const result = validatePage()
      if (result.violations.length > 0) {
        console.warn(`🎨 Design Contract: ${result.violations.length} violations detected`)
      }
    }, 500)
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  })
}

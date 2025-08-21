/**
 * Overlay Control System
 * Manages route-specific overlay opacity and quote focus states
 */

// Quote focus management
export const showQuote = () => {
  document.dispatchEvent(new CustomEvent("quote:show"))
}

export const hideQuote = () => {
  document.dispatchEvent(new CustomEvent("quote:hide"))
}

// Route-specific overlay opacity values
export const OVERLAY_OPACITY = {
  marketing: {
    start: 0.45,
    end: 0.55
  },
  generator: {
    start: 0.40,
    end: 0.48
  },
  dashboard: {
    start: 0.28,
    end: 0.35
  }
} as const

// Utility to get current route type
export const getRouteType = (pathname: string): keyof typeof OVERLAY_OPACITY => {
  if (pathname === "/" || pathname.startsWith("/pricing")) return "marketing"
  if (pathname.startsWith("/generator")) return "generator"
  if (pathname.startsWith("/dashboard")) return "dashboard"
  return "marketing" // default
}

// Manual overlay opacity control (if needed)
export const setOverlayOpacity = (start: number, end: number) => {
  document.documentElement.style.setProperty("--overlay-opacity-start", start.toString())
  document.documentElement.style.setProperty("--overlay-opacity-end", end.toString())
}

// Reset to route default
export const resetOverlayOpacity = (pathname: string) => {
  const routeType = getRouteType(pathname)
  const opacity = OVERLAY_OPACITY[routeType]
  setOverlayOpacity(opacity.start, opacity.end)
}

// Check if quote is currently active
export const isQuoteActive = (): boolean => {
  return document.body.classList.contains("quote-active")
}

// Get current route class
export const getCurrentRouteClass = (): string => {
  const classes = document.body.classList
  if (classes.contains("route-marketing")) return "route-marketing"
  if (classes.contains("route-generator")) return "route-generator"
  if (classes.contains("route-dashboard")) return "route-dashboard"
  return "route-marketing"
}

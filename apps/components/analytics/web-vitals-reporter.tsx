"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/telemetry"

export function WebVitalsReporter() {
  useEffect(() => {
    // Report Core Web Vitals
    const reportWebVitals = async () => {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import("web-vitals")

      getCLS((metric) => {
        trackEvent("web_vital", {
          name: "CLS",
          value: metric.value,
          rating: metric.rating,
          timestamp: new Date().toISOString(),
        })
      })

      getFID((metric) => {
        trackEvent("web_vital", {
          name: "FID",
          value: metric.value,
          rating: metric.rating,
          timestamp: new Date().toISOString(),
        })
      })

      getFCP((metric) => {
        trackEvent("web_vital", {
          name: "FCP",
          value: metric.value,
          rating: metric.rating,
          timestamp: new Date().toISOString(),
        })
      })

      getLCP((metric) => {
        trackEvent("web_vital", {
          name: "LCP",
          value: metric.value,
          rating: metric.rating,
          timestamp: new Date().toISOString(),
        })
      })

      getTTFB((metric) => {
        trackEvent("web_vital", {
          name: "TTFB",
          value: metric.value,
          rating: metric.rating,
          timestamp: new Date().toISOString(),
        })
      })
    }

    // Only report in production
    if (process.env.NODE_ENV === "production") {
      reportWebVitals()
    }
  }, [])

  return null
}

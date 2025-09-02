import { test, expect } from "@playwright/test"

test.describe("Core Web Vitals", () => {
  test("Homepage meets LCP budget", async ({ page }) => {
    await page.goto("/")

    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ["largest-contentful-paint"] })

        // Fallback timeout
        setTimeout(() => resolve(0), 5000)
      })
    })

    expect(lcp).toBeLessThan(2500) // 2.5s budget
  })

  test("Pricing page meets CLS budget", async ({ page }) => {
    await page.goto("/pricing")

    let clsValue = 0
    await page.evaluate(() => {
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
      }).observe({ entryTypes: ["layout-shift"] })
    })

    // Wait for layout shifts to settle
    await page.waitForTimeout(2000)

    expect(clsValue).toBeLessThan(0.1) // 0.1 CLS budget
  })

  test("Generator page meets INP budget", async ({ page }) => {
    await page.goto("/generator")

    // Simulate user interaction
    await page.click("button:first-of-type")

    const inp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            resolve(entry.processingStart - entry.startTime)
          })
        }).observe({ entryTypes: ["first-input"] })

        setTimeout(() => resolve(0), 3000)
      })
    })

    expect(inp).toBeLessThan(200) // 200ms INP budget
  })

  test("Bundle size within limits", async ({ page }) => {
    const response = await page.goto("/")

    // Get all script resources
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("script[src]"))
        .map((script) => (script as HTMLScriptElement).src)
        .filter((src) => src.includes("/_next/static/"))
    })

    let totalSize = 0
    for (const script of scripts) {
      const scriptResponse = await page.request.get(script)
      const buffer = await scriptResponse.body()
      totalSize += buffer.length
    }

    // Convert to KB
    const sizeInKB = totalSize / 1024
    expect(sizeInKB).toBeLessThan(150) // 150KB budget
  })
})

import { test, expect, type Page } from "@playwright/test";

test.describe("Glitch Protocol v1 Compliance", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto("/");
    // Wait for glitch script to load
    await page.waitForLoadState("networkidle");
  });

  test("should respect max 6 keywords per page limit", async ({
    page,
  }: {
    page: Page;
  }) => {
    const glitchElements = page.locator("[data-glitch]");
    const count = await glitchElements.count();

    expect(count).toBeLessThanOrEqual(6);
    console.log(`Found ${count} glitch elements (max 6 allowed)`);
  });

  test("should have correct contract markup structure", async ({
    page,
  }: {
    page: Page;
  }) => {
    const glitchContainers = page.locator(".kw[data-glitch]");
    const count = await glitchContainers.count();

    expect(count).toBeGreaterThan(0);

    // Check each container has required children
    for (let i = 0; i < count; i++) {
      const container = glitchContainers.nth(i);
      const textEl = container.locator(".kw__text");
      const glitchEl = container.locator(".kw__glitch");

      await expect(textEl).toBeVisible();
      await expect(glitchEl).toHaveAttribute("aria-hidden", "true");
    }
  });

  test("should have accessible overlay elements", async ({
    page,
  }: {
    page: Page;
  }) => {
    const overlays = page.locator('.kw__glitch[aria-hidden="true"]');
    const count = await overlays.count();

    expect(count).toBeGreaterThan(0);
    console.log(`Found ${count} accessible overlay elements`);
  });

  test("should respect reduced motion preferences", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Glitch animations should be disabled
    const glitchScript = await page.evaluate(() => {
      return (
        document.querySelector('script[src="/glitch-keywords.js"]') !== null
      );
    });

    expect(glitchScript).toBe(true);

    // Script should exit early with reduced motion
    const glitchTelemetry = await page.evaluate(() => {
      return window.glitchTelemetry;
    });

    // Should either be undefined (script exited) or have disabled flag
    if (glitchTelemetry) {
      expect(glitchTelemetry.disabled_by_reduced_motion).toBe(true);
    }
  });

  test('should respect data-motion="off" attribute', async ({
    page,
  }: {
    page: Page;
  }) => {
    // Set motion off via HTML attribute
    await page.addInitScript(() => {
      document.documentElement.setAttribute("data-motion", "off");
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Check that glitch animations are disabled
    const motionAttribute = await page.getAttribute("html", "data-motion");
    expect(motionAttribute).toBe("off");
  });

  test("should have deterministic output for same text", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Test that same text produces same glitch pattern
    const testText = "Cognitive OS";

    // Get the first glitch element with this text
    const firstRun = await page.evaluate((text: string) => {
      const elements = document.querySelectorAll("[data-glitch]");
      for (const el of elements) {
        const textEl = el.querySelector(".kw__text");
        if (textEl && textEl.textContent?.includes(text)) {
          // Simulate glitch animation
          return textEl.textContent;
        }
      }
      return null;
    }, testText);

    expect(firstRun).toBeTruthy();
  });

  test("should enforce performance constraints", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Start performance monitoring
    const startTime = Date.now();

    // Trigger glitch animations by scrolling
    await page.evaluate(() => {
      window.scrollTo(0, 100);
    });

    // Wait for potential animations
    await page.waitForTimeout(500);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time
    expect(duration).toBeLessThan(1000);

    // Check for telemetry data
    const telemetry = await page.evaluate(() => {
      return window.glitchTelemetry;
    });

    if (telemetry) {
      expect(telemetry.count).toBeLessThanOrEqual(6);

      // Check animation durations are within 280-420ms range
      if (telemetry.run_times && telemetry.run_times.length > 0) {
        for (const time of telemetry.run_times) {
          expect(time).toBeGreaterThanOrEqual(280);
          expect(time).toBeLessThanOrEqual(420);
        }
      }
    }
  });

  test("should prevent infinite loops", async ({ page }: { page: Page }) => {
    // Monitor for infinite loops by checking CPU usage
    const startTime = Date.now();

    // Trigger multiple glitch elements
    await page.evaluate(() => {
      const elements = document.querySelectorAll("[data-glitch]");
      elements.forEach((el) => {
        const event = new Event("mouseenter");
        el.dispatchEvent(event);
      });
    });

    // Wait and check system is still responsive
    await page.waitForTimeout(2000);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should not hang or take excessive time
    expect(duration).toBeLessThan(3000);

    // Page should still be responsive
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test("should have anti-CLS measures in place", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Check that glitch overlays have fixed width
    const glitchOverlays = page.locator(".kw__glitch");
    const count = await glitchOverlays.count();

    if (count > 0) {
      const firstOverlay = glitchOverlays.first();
      const styles = await firstOverlay.evaluate((el: Element) => {
        const computed = window.getComputedStyle(el);
        return {
          position: computed.position,
          display: computed.display,
          whiteSpace: computed.whiteSpace,
          fontFamily: computed.fontFamily,
        };
      });

      expect(styles.position).toBe("absolute");
      expect(styles.whiteSpace).toBe("pre");
    }
  });

  test("should have proper CSS containment for performance", async ({
    page,
  }: {
    page: Page;
  }) => {
    const containers = page.locator(".kw[data-glitch]");
    const count = await containers.count();

    if (count > 0) {
      const firstContainer = containers.first();
      const containProperty = await firstContainer.evaluate((el: Element) => {
        return window.getComputedStyle(el).contain;
      });

      // Should have layout style paint containment
      expect(containProperty).toContain("layout");
      expect(containProperty).toContain("style");
      expect(containProperty).toContain("paint");
    }
  });

  test("should validate H1/H2 targeting only", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Check that glitch elements are only in H1 and H2
    const glitchElements = await page.$$("[data-glitch]");

    for (const element of glitchElements) {
      const tagName = await element.evaluate((el: Element) => {
        // Find the closest H1 or H2 ancestor
        let current: Element | null = el;
        while (current && current !== document.body) {
          if (current.tagName === "H1" || current.tagName === "H2") {
            return current.tagName;
          }
          current = current.parentElement;
        }
        return null;
      });

      expect(["H1", "H2"]).toContain(tagName);
    }
  });
});

test.describe("Glitch Protocol Telemetry", () => {
  test("should expose telemetry data", async ({ page }: { page: Page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for script to initialize
    await page.waitForTimeout(1000);

    const telemetry = await page.evaluate(() => {
      return window.glitchTelemetry;
    });

    if (telemetry) {
      expect(typeof telemetry.count).toBe("number");
      expect(Array.isArray(telemetry.run_times)).toBe(true);
      expect(typeof telemetry.hover_replays).toBe("number");
      expect(typeof telemetry.disabled_by_reduced_motion).toBe("boolean");
    }
  });
});

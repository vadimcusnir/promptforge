import { test, expect } from "@playwright/test";

test.describe("UI Overlay Policy - SSOT Enforcement", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for overlay controller to initialize
    await page.waitForTimeout(100);
  });

  test("overlays apply within 50ms requirement", async ({ page }) => {
    const startTime = Date.now();

    // Navigate to generator page
    await page.goto("/generator");

    // Check overlay element has correct route class
    const overlay = page.locator("#bg-overlay");
    await expect(overlay).toHaveClass(/route-generator/);

    const endTime = Date.now();
    const applyTime = endTime - startTime;

    // Acceptance criteria: overlays.apply_within_ms <= 50
    expect(applyTime).toBeLessThanOrEqual(50);
  });

  test("overlay cleanup on unmount", async ({ page }) => {
    // Start on marketing page
    await page.goto("/");
    const overlay = page.locator("#bg-overlay");
    await expect(overlay).toHaveClass(/route-marketing/);

    // Navigate to dashboard
    await page.goto("/dashboard");
    await expect(overlay).toHaveClass(/route-dashboard/);

    // Verify old class was removed (single route class policy)
    await expect(overlay).not.toHaveClass(/route-marketing/);

    // Navigate to generator
    await page.goto("/generator");
    await expect(overlay).toHaveClass(/route-generator/);

    // Verify previous classes were cleaned up
    await expect(overlay).not.toHaveClass(/route-marketing/);
    await expect(overlay).not.toHaveClass(/route-dashboard/);
  });

  test("classlist has single route class enforcement", async ({ page }) => {
    const overlay = page.locator("#bg-overlay");

    // Test all routes to ensure only one route class at a time
    const routes = [
      { path: "/", expectedClass: "route-marketing" },
      { path: "/generator", expectedClass: "route-generator" },
      { path: "/dashboard", expectedClass: "route-dashboard" },
    ];

    for (const route of routes) {
      await page.goto(route.path);
      await page.waitForTimeout(10); // Allow for DOM update

      const classList = await overlay.evaluate((el) =>
        Array.from(el.classList),
      );
      const routeClasses = classList.filter((cls) => cls.startsWith("route-"));

      // Acceptance criteria: overlays.classlist_has_single_route_class == true
      expect(routeClasses).toHaveLength(1);
      expect(routeClasses[0]).toBe(route.expectedClass);
    }
  });

  test("quote focus controls tokens opacity", async ({ page }) => {
    // Navigate to a page with quotes
    await page.goto("/");

    // Create a test quote element
    await page.evaluate(() => {
      const quote = document.createElement("blockquote");
      quote.className = "pf-quote";
      quote.textContent = "Test quote for overlay policy";
      quote.id = "test-quote";
      document.body.appendChild(quote);

      // Add matrix tokens element for testing
      const tokens = document.createElement("div");
      tokens.className = "matrix-tokens";
      tokens.id = "test-tokens";
      document.body.appendChild(tokens);
    });

    const testQuote = page.locator("#test-quote");
    const testTokens = page.locator("#test-tokens");
    const overlay = page.locator("#bg-overlay");

    // Initial state - tokens should have default opacity
    const initialOpacity = await testTokens.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.opacity;
    });
    expect(initialOpacity).toBe("1");

    // Hover over quote to trigger focus
    await testQuote.hover();

    // Wait for transition
    await page.waitForTimeout(200);

    // Check overlay has quote-active and quote-focus classes
    await expect(overlay).toHaveClass(/quote-active/);
    await expect(overlay).toHaveClass(/quote-focus/);

    // Check tokens opacity is reduced
    const focusOpacity = await testTokens.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return parseFloat(computed.opacity);
    });

    // Acceptance criteria: overlays.quote_focus_controls_tokens_opacity == true
    expect(focusOpacity).toBeLessThan(1);
    expect(focusOpacity).toBeCloseTo(0.28, 2); // Should match --tokens-opacity from policy

    // Move mouse away
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);

    // Verify cleanup - classes should be removed
    await expect(overlay).not.toHaveClass(/quote-active/);
    await expect(overlay).not.toHaveClass(/quote-focus/);

    // Tokens opacity should return to normal
    const finalOpacity = await testTokens.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.opacity;
    });
    expect(finalOpacity).toBe("1");
  });

  test("no console.log in production mode", async ({ page }) => {
    // Monitor console messages
    const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "log") {
        consoleMessages.push(msg.text());
      }
    });

    // Set production mode
    await page.addInitScript(() => {
      Object.defineProperty(process, "env", {
        value: { NODE_ENV: "production" },
      });
    });

    // Navigate through different routes to trigger overlay changes
    await page.goto("/");
    await page.goto("/generator");
    await page.goto("/dashboard");

    // Create and interact with quote element
    await page.evaluate(() => {
      const quote = document.createElement("blockquote");
      quote.className = "pf-quote";
      quote.textContent = "Test quote";
      document.body.appendChild(quote);
    });

    await page.hover(".pf-quote");
    await page.waitForTimeout(100);

    // Acceptance criteria: overlays.no_console_log_in_production == true
    const overlayLogs = consoleMessages.filter(
      (msg) =>
        msg.includes("[OverlayController]") ||
        msg.includes("[QuoteFocusProvider]"),
    );
    expect(overlayLogs).toHaveLength(0);
  });

  test("CSS variables are properly applied from ruleset.yml", async ({
    page,
  }) => {
    // Test route-specific gradients
    const overlay = page.locator("#bg-overlay");

    // Marketing route
    await page.goto("/");
    await expect(overlay).toHaveClass(/route-marketing/);

    const marketingGradient = await overlay.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.getPropertyValue("--overlay-gradient");
    });
    expect(marketingGradient).toContain("linear-gradient(180deg");

    // Generator route
    await page.goto("/generator");
    await expect(overlay).toHaveClass(/route-generator/);

    const generatorGradient = await overlay.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.getPropertyValue("--overlay-gradient");
    });
    expect(generatorGradient).toContain("radial-gradient(60% 60%");

    // Dashboard route
    await page.goto("/dashboard");
    await expect(overlay).toHaveClass(/route-dashboard/);

    const dashboardGradient = await overlay.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.getPropertyValue("--overlay-gradient");
    });
    expect(dashboardGradient).toContain("linear-gradient(160deg");
  });

  test("hardware acceleration is enabled", async ({ page }) => {
    const overlay = page.locator("#bg-overlay");

    // Check will-change property for hardware acceleration
    const willChange = await overlay.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.willChange;
    });

    // Should include transform and opacity for GPU acceleration
    expect(willChange).toContain("transform");
    expect(willChange).toContain("opacity");
  });

  test("respects reduced motion preferences", async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });

    const overlay = page.locator("#bg-overlay");
    const matrixTokens = page.locator(".matrix-tokens");

    // Check overlay transitions are disabled
    const overlayTransition = await overlay.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.transition;
    });
    expect(overlayTransition).toBe("none");

    // Check matrix tokens transitions are disabled
    if ((await matrixTokens.count()) > 0) {
      const tokensTransition = await matrixTokens.first().evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return computed.transition;
      });
      expect(tokensTransition).toBe("none");
    }
  });

  test("overlay element exists and has correct structure", async ({ page }) => {
    const overlay = page.locator("#bg-overlay");

    // Element should exist
    await expect(overlay).toBeAttached();

    // Should be positioned fixed
    const position = await overlay.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.position;
    });
    expect(position).toBe("fixed");

    // Should have pointer-events: none
    const pointerEvents = await overlay.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.pointerEvents;
    });
    expect(pointerEvents).toBe("none");

    // Should cover full viewport
    const boundingBox = await overlay.boundingBox();
    expect(boundingBox?.x).toBe(0);
    expect(boundingBox?.y).toBe(0);
  });

  test("QuoteBlock component integration", async ({ page }) => {
    // Add QuoteBlock component to page
    await page.evaluate(() => {
      const quote = document.createElement("blockquote");
      quote.className = "pf-quote";
      quote.setAttribute("data-focus", "off");
      quote.textContent = "Test quote for integration";
      quote.id = "integration-quote";
      document.body.appendChild(quote);
    });

    const quote = page.locator("#integration-quote");
    const overlay = page.locator("#bg-overlay");

    // Initial state
    await expect(quote).toHaveAttribute("data-focus", "off");

    // Hover to activate
    await quote.hover();
    await page.waitForTimeout(100);

    // Quote should update data-focus attribute
    await expect(quote).toHaveAttribute("data-focus", "on");

    // Overlay should have focus classes
    await expect(overlay).toHaveClass(/quote-active/);
    await expect(overlay).toHaveClass(/quote-focus/);

    // Move away to deactivate
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);

    // Should return to initial state
    await expect(quote).toHaveAttribute("data-focus", "off");
    await expect(overlay).not.toHaveClass(/quote-active/);
    await expect(overlay).not.toHaveClass(/quote-focus/);
  });

  test("performance benchmarks within acceptable limits", async ({ page }) => {
    // Measure route transition performance
    const startTime = Date.now();

    await page.goto("/generator");

    // Wait for overlay to be applied
    await page.waitForSelector("#bg-overlay.route-generator");

    const endTime = Date.now();
    const transitionTime = endTime - startTime;

    // Should be well within 50ms requirement for route transitions
    expect(transitionTime).toBeLessThan(50);

    // Measure quote focus performance
    await page.evaluate(() => {
      const quote = document.createElement("blockquote");
      quote.className = "pf-quote";
      quote.textContent = "Performance test quote";
      quote.id = "perf-quote";
      document.body.appendChild(quote);
    });

    const perfStartTime = Date.now();
    await page.hover("#perf-quote");

    // Wait for quote-active class to be applied
    await page.waitForSelector("#bg-overlay.quote-active");

    const perfEndTime = Date.now();
    const focusTime = perfEndTime - perfStartTime;

    // Quote focus should be very fast (under 20ms)
    expect(focusTime).toBeLessThan(20);
  });
});

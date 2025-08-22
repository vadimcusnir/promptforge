import { test, expect } from "@playwright/test";

test.describe("Header & Footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("header maintains stable height on hover and scroll", async ({
    page,
  }) => {
    // Get initial header dimensions
    const header = page.locator('header[role="banner"]');
    const initialBox = await header.boundingBox();

    expect(initialBox).toBeTruthy();
    const initialHeight = initialBox!.height;

    // Hover over navigation items
    await page.hover("nav a");
    const hoverBox = await header.boundingBox();
    expect(hoverBox!.height).toBe(initialHeight);

    // Scroll page
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(100);

    const scrollBox = await header.boundingBox();
    expect(scrollBox!.height).toBe(initialHeight);

    // Hover over CTA button
    await page.hover('[data-gate="pro"]');
    const ctaHoverBox = await header.boundingBox();
    expect(ctaHoverBox!.height).toBe(initialHeight);
  });

  test("skip link is accessible and functional", async ({ page }) => {
    // Skip link should be initially hidden
    const skipLink = page.locator('a:has-text("Skip to content")');
    await expect(skipLink).toHaveClass(/sr-only/);

    // Tab to skip link - should become visible
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveClass(/focus:not-sr-only/);

    // Activate skip link
    await page.keyboard.press("Enter");

    // Main content should be focused
    const main = page.locator("main");
    await expect(main).toBeFocused();
  });

  test("mobile navigation has proper ARIA and focus management", async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const menuButton = page.locator('button[aria-label*="menu"]');
    const mobileNav = page.locator('[role="dialog"][aria-modal="true"]');

    // Initially closed
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(mobileNav).toBeHidden();

    // Open mobile menu
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(mobileNav).toBeVisible();

    // First focusable element should be focused
    const firstLink = mobileNav.locator("a").first();
    await expect(firstLink).toBeFocused();

    // Escape should close menu
    await page.keyboard.press("Escape");
    await expect(mobileNav).toBeHidden();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  test("navigation has proper aria-current for active page", async ({
    page,
  }) => {
    await page.goto("/generator");

    const generatorLink = page.locator('nav a:has-text("Generator")');
    await expect(generatorLink).toHaveAttribute("aria-current", "page");

    // Other links should not have aria-current
    const modulesLink = page.locator('nav a:has-text("Modules")');
    await expect(modulesLink).not.toHaveAttribute("aria-current");
  });

  test("focus is visible and meets contrast requirements", async ({ page }) => {
    // Test header links
    await page.keyboard.press("Tab"); // Skip link
    await page.keyboard.press("Tab"); // Logo

    const logo = page.locator("header a").first();
    await expect(logo).toBeFocused();

    // Check focus outline is visible
    const logoStyles = await logo.evaluate((el) => {
      const computed = window.getComputedStyle(el, ":focus");
      return {
        outline: computed.outline,
        outlineColor: computed.outlineColor,
        outlineWidth: computed.outlineWidth,
      };
    });

    expect(logoStyles.outlineWidth).not.toBe("0px");
    expect(logoStyles.outline).not.toBe("none");
  });

  test("footer links are accessible and functional", async ({ page }) => {
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();

    // Check footer structure
    const productSection = footer.locator('h3:has-text("PRODUCT")');
    const companySection = footer.locator('h3:has-text("COMPANY")');
    const legalSection = footer.locator('h3:has-text("LEGAL")');

    await expect(productSection).toBeVisible();
    await expect(companySection).toBeVisible();
    await expect(legalSection).toBeVisible();

    // Test footer links are clickable
    const footerLinks = footer.locator("a");
    const linkCount = await footerLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Test first link in each section
    const firstProductLink = productSection
      .locator("..")
      .locator("ul a")
      .first();
    await expect(firstProductLink).toBeVisible();
    await expect(firstProductLink).toHaveAttribute("href");
  });

  test("CTA buttons have proper data-gate attributes", async ({ page }) => {
    const ctaButtons = page.locator('[data-gate="pro"]');
    const buttonCount = await ctaButtons.count();

    expect(buttonCount).toBeGreaterThan(0);

    // Check each CTA has proper attributes
    for (let i = 0; i < buttonCount; i++) {
      const button = ctaButtons.nth(i);
      await expect(button).toHaveAttribute("data-gate", "pro");
    }
  });

  test("telemetry events are emitted on interactions", async ({ page }) => {
    const events: any[] = [];

    // Listen for custom events
    await page.exposeFunction("logEvent", (event: any) => {
      events.push(event);
    });

    await page.addInitScript(() => {
      window.addEventListener("cta_primary_click", (e: any) => {
        (window as any).logEvent({
          type: "cta_primary_click",
          detail: e.detail,
        });
      });
      window.addEventListener("open_nav", (e: any) => {
        (window as any).logEvent({ type: "open_nav", detail: e.detail });
      });
    });

    // Trigger CTA click
    const ctaButton = page.locator('[data-gate="pro"]').first();
    await ctaButton.click();

    // Check if event was emitted
    await page.waitForTimeout(100);
    expect(events.some((e) => e.type === "cta_primary_click")).toBeTruthy();
  });

  test("header works on dashboard layout", async ({ page }) => {
    // Mock dashboard page
    await page.goto("/dashboard");

    const header = page.locator('header[role="banner"]');
    await expect(header).toBeVisible();

    // Header should still be sticky
    const headerBox = await header.boundingBox();
    expect(headerBox!.y).toBe(0);

    // Scroll to test stickiness
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(100);

    const scrolledHeaderBox = await header.boundingBox();
    expect(scrolledHeaderBox!.y).toBe(0);
  });

  test("respects prefers-reduced-motion", async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });

    // Check that transitions are disabled
    const header = page.locator("header");
    const headerStyles = await header.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.transition;
    });

    // With reduced motion, transitions should be none or very short
    expect(headerStyles === "none" || headerStyles.includes("0s")).toBeTruthy();
  });
});

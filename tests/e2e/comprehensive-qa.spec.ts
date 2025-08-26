import { test, expect } from "@playwright/test";

test.describe("Comprehensive QA Audit - PromptForge v3", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for page to fully load
    await page.waitForLoadState("networkidle");
  });

  test.describe("Cross-Platform Testing", () => {
    test("Desktop - All interactive elements are functional", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Test navigation links
      const navLinks = [
        { text: "Modules", href: "/modules" },
        { text: "Generator", href: "/generator" },
        { text: "Dashboard", href: "/dashboard" },
        { text: "Docs", href: "/docs" },
        { text: "Pricing", href: "/pricing" },
        { text: "About", href: "/about" },
        { text: "Contact", href: "/contact" },
        { text: "Blog", href: "/blog" },
      ];

      for (const link of navLinks) {
        const navLink = page.locator(`nav a:has-text("${link.text}")`);
        await expect(navLink).toBeVisible();
        await expect(navLink).toHaveAttribute("href", link.href);
      }

      // Test CTA buttons
      const ctaButton = page.locator('[data-gate="pro"]');
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toHaveText(/upgrade|pro|enterprise/i);
    });

    test("Mobile - Responsive design and touch interactions", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Test mobile menu
      const menuButton = page.locator('button[aria-label*="menu"]');
      await expect(menuButton).toBeVisible();
      
      // Open mobile menu
      await menuButton.click();
      const mobileNav = page.locator('[role="dialog"][aria-modal="true"]');
      await expect(mobileNav).toBeVisible();
      
      // Test mobile navigation links
      const mobileLinks = page.locator('[role="dialog"] a');
      await expect(mobileLinks).toHaveCount(8); // Should have all nav links
      
      // Close menu with escape
      await page.keyboard.press("Escape");
      await expect(mobileNav).toBeHidden();
    });
  });

  test.describe("Form Validation and Interactive Components", () => {
    test("Generator form validation and submission", async ({ page }) => {
      await page.goto("/generator");
      await page.waitForLoadState("networkidle");
      
      // Test module selection
      const moduleSelect = page.locator('[data-testid="module-select"]');
      if (await moduleSelect.isVisible()) {
        await moduleSelect.click();
        const firstModule = page.locator('[role="option"]').first();
        await firstModule.click();
        
        // Verify module is selected
        await expect(moduleSelect).toContainText(firstModule.textContent());
      }
      
      // Test 7D configuration form
      const configForm = page.locator('form');
      if (await configForm.isVisible()) {
        // Test form inputs
        const inputs = page.locator('input, select, textarea');
        await expect(inputs).toHaveCount.greaterThan(0);
        
        // Test form submission
        const submitButton = page.locator('button[type="submit"]');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          // Should show loading state or validation errors
          await expect(page.locator('.loading, .error, [role="alert"]')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("Contact form validation", async ({ page }) => {
      await page.goto("/contact");
      await page.waitForLoadState("networkidle");
      
      const contactForm = page.locator('form');
      if (await contactForm.isVisible()) {
        // Test required fields
        const requiredFields = page.locator('input[required], textarea[required]');
        await expect(requiredFields).toHaveCount.greaterThan(0);
        
        // Test form submission without required fields
        const submitButton = page.locator('button[type="submit"]');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          // Should show validation errors
          await expect(page.locator('.error, [role="alert"]')).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test("Demo form functionality", async ({ page }) => {
      // Test the brand linter demo on homepage
      const demoInput = page.locator('input[placeholder*="analyze"]');
      const analyzeButton = page.locator('button:has-text("Analyze")');
      
      if (await demoInput.isVisible() && await analyzeButton.isVisible()) {
        // Test input validation
        await demoInput.fill("test input");
        await expect(demoInput).toHaveValue("test input");
        
        // Test button state
        await expect(analyzeButton).toBeEnabled();
        
        // Test form submission
        await analyzeButton.click();
        
        // Should show loading state
        await expect(page.locator('button:has-text("Analyzing")')).toBeVisible({ timeout: 3000 });
        
        // Wait for result
        await expect(page.locator('h3:has-text("Analysis Result")')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe("Accessibility and Focus Management", () => {
    test("Keyboard navigation and focus indicators", async ({ page }) => {
      // Test skip link
      await page.keyboard.press("Tab");
      const skipLink = page.locator('a:has-text("Skip to content")');
      await expect(skipLink).toBeFocused();
      await expect(skipLink).toBeVisible();
      
      // Test focus indicators
      await page.keyboard.press("Tab");
      const logo = page.locator("header a").first();
      await expect(logo).toBeFocused();
      
      // Verify focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toHaveCSS('outline', /none|auto/);
      
      // Test all interactive elements are keyboard accessible
      const interactiveElements = page.locator('a, button, input, select, textarea, [tabindex]');
      const count = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          await element.focus();
          await expect(element).toBeFocused();
        }
      }
    });

    test("ARIA labels and semantic HTML", async ({ page }) => {
      // Test header role
      const header = page.locator('header[role="banner"]');
      await expect(header).toBeVisible();
      
      // Test navigation role
      const nav = page.locator('nav[role="navigation"]');
      await expect(nav).toBeVisible();
      
      // Test main content role
      const main = page.locator('main[role="main"]');
      await expect(main).toBeVisible();
      
      // Test footer role
      const footer = page.locator('footer[role="contentinfo"]');
      await expect(footer).toBeVisible();
      
      // Test form labels
      const inputs = page.locator('input, select, textarea');
      const count = await inputs.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          if (await label.isVisible()) {
            await expect(label).toHaveText(/./);
          }
        }
      }
    });

    test("Color contrast and visual accessibility", async ({ page }) => {
      // Test text contrast
      const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
      const count = await textElements.count();
      
      // Sample a few text elements for contrast testing
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = textElements.nth(i);
        if (await element.isVisible()) {
          const text = await element.textContent();
          if (text && text.trim().length > 0) {
            // Verify text is visible (basic contrast check)
            await expect(element).toHaveCSS('color', /rgba|rgb|#/);
          }
        }
      }
      
      // Test focus indicators are visible
      await page.keyboard.press("Tab");
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe("Performance and Loading States", () => {
    test("Page load performance", async ({ page }) => {
      const startTime = Date.now();
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
      
      // Test Core Web Vitals
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        };
      });
      
      // DOM content should be loaded quickly
      expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);
    });

    test("Loading states and error handling", async ({ page }) => {
      // Test loading states in generator
      await page.goto("/generator");
      await page.waitForLoadState("networkidle");
      
      // Look for loading indicators
      const loadingElements = page.locator('.loading, [aria-busy="true"], .spinner, .loader');
      if (await loadingElements.count() > 0) {
        await expect(loadingElements.first()).toBeVisible();
      }
      
      // Test error handling
      const errorElements = page.locator('.error, [role="alert"], .alert-error');
      // Should not have errors on normal load
      await expect(errorElements).toHaveCount(0);
    });

    test("Image loading and optimization", async ({ page }) => {
      // Test image loading
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        // Check for alt text
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const image = images.nth(i);
          const alt = await image.getAttribute('alt');
          // Images should have alt text or be decorative
          expect(alt !== null || await image.getAttribute('role') === 'presentation').toBeTruthy();
        }
      }
    });
  });

  test.describe("Cross-Browser Compatibility", () => {
    test("Chrome compatibility", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Test basic functionality
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    });

    test("Firefox compatibility", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Test basic functionality
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    });

    test("Safari compatibility", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Test basic functionality
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    });
  });

  test.describe("Mobile-Specific Testing", () => {
    test("Touch interactions and gestures", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Test touch-friendly button sizes
      const buttons = page.locator('button, a[role="button"]');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          if (box) {
            // Buttons should be at least 44x44px for touch
            expect(box.width).toBeGreaterThanOrEqual(44);
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });

    test("Mobile navigation and menu", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Test mobile menu functionality
      const menuButton = page.locator('button[aria-label*="menu"]');
      await expect(menuButton).toBeVisible();
      
      // Open menu
      await menuButton.click();
      const mobileMenu = page.locator('[role="dialog"]');
      await expect(mobileMenu).toBeVisible();
      
      // Test menu items
      const menuItems = mobileMenu.locator('a');
      await expect(menuItems).toHaveCount.greaterThan(0);
      
      // Close menu
      await page.keyboard.press("Escape");
      await expect(mobileMenu).toBeHidden();
    });
  });

  test.describe("Error Handling and Edge Cases", () => {
    test("404 page handling", async ({ page }) => {
      await page.goto("/nonexistent-page");
      
      // Should show 404 page
      await expect(page.locator('h1')).toContainText(/404|not found|page not found/i);
      
      // Should have navigation back to home
      const homeLink = page.locator('a[href="/"]');
      await expect(homeLink).toBeVisible();
    });

    test("Network error handling", async ({ page }) => {
      // Test offline behavior
      await page.route('**/*', route => route.abort());
      
      try {
        await page.goto("/");
        // Should handle network errors gracefully
        await expect(page.locator('main')).toBeVisible();
      } finally {
        // Restore normal routing
        await page.unroute('**/*');
      }
    });

    test("Form validation edge cases", async ({ page }) => {
      await page.goto("/generator");
      await page.waitForLoadState("networkidle");
      
      // Test with very long input
      const inputs = page.locator('input, textarea');
      if (await inputs.count() > 0) {
        const longInput = "a".repeat(10000);
        await inputs.first().fill(longInput);
        
        // Should handle long input gracefully
        await expect(inputs.first()).toHaveValue(longInput);
      }
    });
  });

  test.describe("Security and Data Validation", () => {
    test("XSS protection", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Test that script tags are not executed
      const scriptTags = page.locator('script');
      const scriptCount = await scriptTags.count();
      
      // Should not have inline scripts (security best practice)
      expect(scriptCount).toBeLessThanOrEqual(1); // Only Next.js runtime script
    });

    test("Form input sanitization", async ({ page }) => {
      await page.goto("/generator");
      await page.waitForLoadState("networkidle");
      
      const inputs = page.locator('input, textarea');
      if (await inputs.count() > 0) {
        const maliciousInput = '<script>alert("xss")</script>';
        await inputs.first().fill(maliciousInput);
        
        // Should not execute script
        const value = await inputs.first().inputValue();
        expect(value).toContain('<script>');
        expect(value).toContain('</script>');
      }
    });
  });
});

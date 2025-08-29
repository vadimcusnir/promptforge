import { test, expect } from '@playwright/test';

/**
 * E2E Test: Global Layout Consistency
 * 
 * This test ensures that:
 * 1. There is exactly one <header> element on the homepage
 * 2. There is exactly one <footer> element on the homepage
 * 3. Header and Footer are properly mounted from the root layout
 * 4. No duplicate navigation elements exist
 */

test.describe('Global Layout Consistency', () => {
  test('should have exactly one header and one footer on homepage', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Verify there is exactly one header element
    const headers = page.locator('header');
    await expect(headers).toHaveCount(1);
    
    // Verify there is exactly one footer element
    const footers = page.locator('footer');
    await expect(footers).toHaveCount(1);
    
    // Verify the header is visible and has proper content
    const header = headers.first();
    await expect(header).toBeVisible();
    
    // Verify the footer is visible and has proper content
    const footer = footers.first();
    await expect(footer).toBeVisible();
  });

  test('should maintain layout consistency across navigation', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get initial header and footer content
    const initialHeader = await page.locator('header').first().textContent();
    const initialFooter = await page.locator('footer').first().textContent();
    
    // Navigate to different pages and verify layout consistency
    const testPages = ['/about', '/pricing', '/contact', '/docs'];
    
    for (const testPage of testPages) {
      // Navigate to test page
      await page.goto(testPage);
      await page.waitForLoadState('networkidle');
      
      // Verify header and footer still exist
      await expect(page.locator('header')).toHaveCount(1);
      await expect(page.locator('footer')).toHaveCount(1);
      
      // Verify header content is consistent (should be the same component)
      const currentHeader = await page.locator('header').first().textContent();
      expect(currentHeader).toBe(initialHeader);
      
      // Verify footer content is consistent (should be the same component)
      const currentFooter = await page.locator('footer').first().textContent();
      expect(currentFooter).toBe(initialFooter);
    }
  });

  test('should not have duplicate navigation elements', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for navigation elements
    const navElements = page.locator('nav');
    const navCount = await navElements.count();
    
    // Should have at least one navigation element (in header)
    expect(navCount).toBeGreaterThan(0);
    
    // Check for any duplicate navigation content
    const navTexts = await navElements.allTextContents();
    const uniqueNavTexts = [...new Set(navTexts)];
    
    // All navigation elements should have unique content
    expect(navTexts.length).toBe(uniqueNavTexts.length);
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify header has proper role
    const header = page.locator('header').first();
    await expect(header).toHaveAttribute('role', 'banner');
    
    // Verify footer has proper role
    const footer = page.locator('footer').first();
    await expect(footer).toHaveAttribute('role', 'contentinfo');
    
    // Verify main content area exists
    const mainContent = page.locator('main, [role="main"], #main-content');
    await expect(mainContent).toHaveCount(1);
  });

  test('should handle coming-soon layout correctly', async ({ page }) => {
    // Navigate to coming-soon page
    await page.goto('/coming-soon');
    await page.waitForLoadState('networkidle');
    
    // Coming-soon page should still have the global header and footer
    // because it inherits from the root layout
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    
    // But it should have the coming-soon wrapper
    const comingSoonWrapper = page.locator('.coming-soon-layout');
    await expect(comingSoonWrapper).toHaveCount(1);
  });
});

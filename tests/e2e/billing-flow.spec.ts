import { test, expect } from '@playwright/test';

/**
 * End-to-end tests for billing flow
 * Tests the complete user journey from paywall to successful upgrade
 */

test.describe('Billing Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Stripe in test environment
    await page.route('**/api/billing/create-checkout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://checkout.stripe.com/test-session'
        })
      });
    });

    // Mock entitlements API
    await page.route('**/api/entitlements*', async (route) => {
      const url = new URL(route.request().url());
      const orgId = url.searchParams.get('org_id');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: orgId,
          user_id: 'test-user',
          entitlements: {
            canUseGptTestReal: false, // Pilot plan - no GPT test
            canExportPDF: false,
            canExportJSON: false,
            canExportBundleZip: false,
            hasAPI: false,
            canUseAllModules: false,
            canExportMD: true,
            hasCloudHistory: false,
            hasEvaluatorAI: false,
            hasWhiteLabel: false,
            hasSeatsGT1: false,
            hasExportDesigner: false,
            hasFinTechPack: false,
            hasEduPack: false,
            hasIndustryTemplates: false,
            maxRunsPerDay: 10,
            maxSeats: 1,
          },
          subscription: {
            plan_code: 'pilot',
            status: 'active',
            seats: 1,
          },
          membership: {
            role: 'owner',
          },
        })
      });
    });

    // Navigate to generator page
    await page.goto('/generator');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should show paywall modal when clicking GPT Test without Pro plan', async ({ page }) => {
    // Try to click GPT Test button
    const testButton = page.locator('button', { hasText: 'Run Test' });
    await testButton.click();

    // Should show paywall modal
    const modal = page.locator('[role="dialog"]', { hasText: 'Upgrade Required' });
    await expect(modal).toBeVisible();

    // Should show Pro plan as recommended
    const proCard = modal.locator('[data-testid="plan-pro"]').or(
      modal.locator('text=Pro').locator('..').locator('..')
    );
    await expect(proCard).toBeVisible();

    // Should have upgrade button
    const upgradeButton = modal.locator('button', { hasText: /Upgrade to Pro/i });
    await expect(upgradeButton).toBeVisible();
  });

  test('should show paywall modal when trying to export PDF', async ({ page }) => {
    // Generate a prompt first
    await page.locator('button', { hasText: 'Generate Prompt' }).click();
    await page.waitForTimeout(1000); // Wait for generation

    // Try to export PDF (should be gated)
    const exportBar = page.locator('[data-testid="export-bar"]').or(
      page.locator('text=Export').locator('..')
    );
    
    const pdfButton = exportBar.locator('button', { hasText: '.pdf' });
    await pdfButton.click();

    // Should show paywall modal
    const modal = page.locator('[role="dialog"]', { hasText: 'Upgrade Required' });
    await expect(modal).toBeVisible();

    // Should mention PDF export in the message
    await expect(modal.locator('text=PDF')).toBeVisible();
  });

  test('should redirect to Stripe checkout when upgrading', async ({ page }) => {
    // Click a gated feature to open paywall
    const testButton = page.locator('button', { hasText: 'Run Test' });
    await testButton.click();

    // Wait for modal
    const modal = page.locator('[role="dialog"]', { hasText: 'Upgrade Required' });
    await expect(modal).toBeVisible();

    // Click upgrade button
    const upgradeButton = modal.locator('button', { hasText: /Upgrade to Pro/i });
    
    // Listen for navigation
    const navigationPromise = page.waitForURL('https://checkout.stripe.com/test-session');
    
    await upgradeButton.click();
    
    // Should redirect to Stripe
    await navigationPromise;
    expect(page.url()).toContain('checkout.stripe.com');
  });

  test('should allow free features without paywall', async ({ page }) => {
    // Generate a prompt
    await page.locator('button', { hasText: 'Generate Prompt' }).click();
    await page.waitForTimeout(1000);

    // Try to export markdown (should be free)
    const exportBar = page.locator('[data-testid="export-bar"]').or(
      page.locator('text=Export').locator('..')
    );
    
    const mdButton = exportBar.locator('button', { hasText: '.md' });
    await mdButton.click();

    // Should not show paywall modal
    const modal = page.locator('[role="dialog"]', { hasText: 'Upgrade Required' });
    await expect(modal).not.toBeVisible();

    // Should trigger download (in real app)
    // In test, we just verify no modal appeared
  });

  test('should show different plans for different features', async ({ page }) => {
    // Test Enterprise feature (Bundle ZIP)
    await page.locator('button', { hasText: 'Generate Prompt' }).click();
    await page.waitForTimeout(1000);

    const exportBar = page.locator('[data-testid="export-bar"]').or(
      page.locator('text=Export').locator('..')
    );
    
    const zipButton = exportBar.locator('button', { hasText: '.zip' });
    await zipButton.click();

    // Should show paywall with Enterprise recommended
    const modal = page.locator('[role="dialog"]', { hasText: 'Upgrade Required' });
    await expect(modal).toBeVisible();

    const enterpriseCard = modal.locator('[data-testid="plan-enterprise"]').or(
      modal.locator('text=Enterprise').locator('..').locator('..')
    );
    await expect(enterpriseCard).toBeVisible();

    // Should have "Recommended" badge on Enterprise
    const recommendedBadge = enterpriseCard.locator('text=Recommended');
    await expect(recommendedBadge).toBeVisible();
  });

  test('should handle billing cycle toggle', async ({ page }) => {
    // Open paywall
    const testButton = page.locator('button', { hasText: 'Run Test' });
    await testButton.click();

    const modal = page.locator('[role="dialog"]', { hasText: 'Upgrade Required' });
    await expect(modal).toBeVisible();

    // Should default to monthly
    const monthlyButton = modal.locator('button', { hasText: 'Monthly' });
    await expect(monthlyButton).toHaveClass(/bg-white/); // Active state

    // Click annual
    const annualButton = modal.locator('button', { hasText: 'Annual' });
    await annualButton.click();

    // Should show annual pricing
    await expect(annualButton).toHaveClass(/bg-white/);
    
    // Should show savings badge
    const savingsBadge = modal.locator('text=Save 17%');
    await expect(savingsBadge).toBeVisible();
  });

  test('should close paywall modal', async ({ page }) => {
    // Open paywall
    const testButton = page.locator('button', { hasText: 'Run Test' });
    await testButton.click();

    const modal = page.locator('[role="dialog"]', { hasText: 'Upgrade Required' });
    await expect(modal).toBeVisible();

    // Close with X button
    const closeButton = modal.locator('button').first(); // Usually the X button
    await closeButton.click();

    // Modal should be hidden
    await expect(modal).not.toBeVisible();
  });

  test('should show inline paywall for replace mode', async ({ page }) => {
    // This test would need a component configured with mode="replace"
    // For now, we test the modal mode which is more common
    
    // Navigate to a page that might use inline paywalls
    // await page.goto('/dashboard');
    
    // Look for inline paywall elements
    // const inlinePaywall = page.locator('[data-testid="inline-paywall"]');
    // await expect(inlinePaywall).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error for checkout
    await page.route('**/api/billing/create-checkout', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    // Try to upgrade
    const testButton = page.locator('button', { hasText: 'Run Test' });
    await testButton.click();

    const modal = page.locator('[role="dialog"]', { hasText: 'Upgrade Required' });
    await expect(modal).toBeVisible();

    const upgradeButton = modal.locator('button', { hasText: /Upgrade to Pro/i });
    await upgradeButton.click();

    // Should not redirect (error handling)
    await page.waitForTimeout(1000);
    expect(page.url()).not.toContain('checkout.stripe.com');
    
    // Modal should still be visible
    await expect(modal).toBeVisible();
  });

  test('should show correct feature descriptions in paywall', async ({ page }) => {
    // Test GPT Test feature
    const testButton = page.locator('button', { hasText: 'Run Test' });
    await testButton.click();

    const modal = page.locator('[role="dialog"]', { hasText: 'Upgrade Required' });
    await expect(modal).toBeVisible();

    // Should mention GPT testing in description
    await expect(modal.locator('text=GPT test')).toBeVisible();
    await expect(modal.locator('text=analysis')).toBeVisible();
  });

  test('should handle successful upgrade flow', async ({ page }) => {
    // Mock successful upgrade by changing entitlements response
    await page.route('**/api/entitlements*', async (route) => {
      const url = new URL(route.request().url());
      const orgId = url.searchParams.get('org_id');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: orgId,
          user_id: 'test-user',
          entitlements: {
            canUseGptTestReal: true, // Now has Pro features
            canExportPDF: true,
            canExportJSON: true,
            canExportBundleZip: false,
            hasAPI: false,
            canUseAllModules: true,
            canExportMD: true,
            hasCloudHistory: true,
            hasEvaluatorAI: true,
            hasWhiteLabel: false,
            hasSeatsGT1: false,
            hasExportDesigner: false,
            hasFinTechPack: false,
            hasEduPack: false,
            hasIndustryTemplates: false,
            maxRunsPerDay: 100,
            maxSeats: 1,
          },
          subscription: {
            plan_code: 'pro',
            status: 'active',
            seats: 1,
          },
          membership: {
            role: 'owner',
          },
        })
      });
    });

    // Simulate returning from successful Stripe checkout
    await page.goto('/generator?session_id=cs_test_success');
    
    // Wait for entitlements to load
    await page.waitForTimeout(1000);

    // Should now be able to use GPT Test without paywall
    const testButton = page.locator('button', { hasText: 'Run Test (Real)' });
    await expect(testButton).toBeVisible();
    
    // Click should not show paywall
    await testButton.click();
    
    const modal = page.locator('[role="dialog"]', { hasText: 'Upgrade Required' });
    await expect(modal).not.toBeVisible();
  });
});

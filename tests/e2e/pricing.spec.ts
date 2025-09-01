import { test, expect } from '@playwright/test'

test.describe('Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing')
  })

  test('should display pricing page with all plans', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Pricing/)
    
    // Check main heading
    await expect(page.getByRole('heading', { name: 'Pricing' })).toBeVisible()
    
    // Check all plan cards are visible
    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByText('Creator')).toBeVisible()
    await expect(page.getByText('Pro')).toBeVisible()
    await expect(page.getByText('Enterprise')).toBeVisible()
    
    // Check pricing is displayed
    await expect(page.getByText('$0')).toBeVisible()
    await expect(page.getByText('$29')).toBeVisible()
    await expect(page.getByText('$99')).toBeVisible()
    await expect(page.getByText('$299')).toBeVisible()
  })

  test('should toggle between monthly and annual billing', async ({ page }) => {
    // Check monthly is selected by default
    const monthlyToggle = page.getByText('Monthly')
    const annualToggle = page.getByText('Annual')
    
    await expect(monthlyToggle).toHaveClass(/text-pf-text/)
    await expect(annualToggle).toHaveClass(/text-pf-text-muted/)
    
    // Click annual toggle
    await page.getByRole('button', { name: 'Toggle billing period' }).click()
    
    // Check annual is now selected
    await expect(monthlyToggle).toHaveClass(/text-pf-text-muted/)
    await expect(annualToggle).toHaveClass(/text-pf-text/)
    
    // Check prices have changed to annual
    await expect(page.getByText('$290')).toBeVisible()
    await expect(page.getByText('$990')).toBeVisible()
    await expect(page.getByText('$2990')).toBeVisible()
  })

  test('should handle free plan selection', async ({ page }) => {
    // Click free plan button
    await page.getByRole('button', { name: 'Get Started Free' }).click()
    
    // Should redirect to generator
    await expect(page).toHaveURL('/generator')
  })

  test('should handle paid plan checkout flow', async ({ page }) => {
    // Click Pro plan button
    await page.getByRole('button', { name: 'Start Pro Trial' }).click()
    
    // Should redirect to checkout success (mock)
    await expect(page).toHaveURL(/\/checkout\/success/)
    
    // Check success page content
    await expect(page.getByText('Payment Successful!')).toBeVisible()
    await expect(page.getByText('Plan Summary')).toBeVisible()
    await expect(page.getByText('Pro')).toBeVisible()
  })

  test('should display plan comparison matrix', async ({ page }) => {
    // Check comparison matrix is visible
    await expect(page.getByText('Compare All Plans')).toBeVisible()
    
    // Check feature categories
    await expect(page.getByText('Core Features')).toBeVisible()
    await expect(page.getByText('Export Formats')).toBeVisible()
    await expect(page.getByText('Advanced Features')).toBeVisible()
    
    // Check some features are displayed
    await expect(page.getByText('Module Access')).toBeVisible()
    await expect(page.getByText('Run Real Tests')).toBeVisible()
    await expect(page.getByText('.pdf Export')).toBeVisible()
  })

  test('should display FAQ section', async ({ page }) => {
    // Check FAQ section
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible()
    
    // Check FAQ items
    await expect(page.getByText('How does billing work?')).toBeVisible()
    await expect(page.getByText("What's included in the Pro trial?")).toBeVisible()
    await expect(page.getByText('Can I export my prompts?')).toBeVisible()
    await expect(page.getByText("What's \"Run Real Test\"?")).toBeVisible()
  })

  test('should display legal links', async ({ page }) => {
    // Check legal links in footer
    await expect(page.getByRole('link', { name: 'Terms of Service' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Data Processing Agreement' })).toBeVisible()
    
    // Check trust elements
    await expect(page.getByText('VAT handled by Stripe Tax')).toBeVisible()
    await expect(page.getByText('Secure payments powered by Stripe')).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCount(1)
    
    // Check for proper button labels
    const buttons = page.getByRole('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const ariaLabel = await button.getAttribute('aria-label')
      const textContent = await button.textContent()
      
      // Button should have either aria-label or text content
      expect(ariaLabel || textContent).toBeTruthy()
    }
    
    // Check for proper form labels
    const toggle = page.getByRole('button', { name: 'Toggle billing period' })
    await expect(toggle).toHaveAttribute('aria-label', 'Toggle billing period')
  })

  test('should track analytics events', async ({ page }) => {
    // Mock analytics API
    await page.route('/api/analytics', async (route) => {
      const request = route.request()
      const postData = request.postDataJSON()
      
      // Verify analytics events are being sent
      expect(postData.event).toBeDefined()
      expect(postData.properties).toBeDefined()
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })
    
    // Navigate to pricing page (should trigger page_view)
    await page.goto('/pricing')
    
    // Click billing toggle (should trigger billing_cycle_changed)
    await page.getByRole('button', { name: 'Toggle billing period' }).click()
    
    // Click a plan button (should trigger checkout_started)
    await page.getByRole('button', { name: 'Get Started Free' }).click()
  })
})

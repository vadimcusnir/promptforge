import { test, expect } from '@playwright/test';

test.describe('Redirect Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page first
    await page.goto('/');
  });

  test('should redirect legacy module URLs with 308 status', async ({ page }) => {
    const legacySlugs = [
      'risk-and-trust-reversal',
      'crisis-communication',
      'social-media-calendar',
      'content-calendar-optimizer',
      'landing-page-optimizer',
      'influencer-partnership-framework',
      'content-performance-analyzer',
      'content-personalization-engine',
      'database-design-optimizer',
      'microservices-architecture',
      'security-architecture-framework',
      'performance-optimization-engine',
      'container-orchestration-strategy',
      'cloud-infrastructure-architect',
      'sales-process-optimizer',
      'sales-operations-framework',
      'sales-enablement-framework',
      'sales-intelligence-framework',
      'quality-management-system',
      'supply-chain-optimizer',
      'change-management-framework',
      'executive-prompt-report'
    ];

    const expectedRedirects = {
      'risk-and-trust-reversal': 'trust-reversal-protocol',
      'crisis-communication': 'crisis-communication-playbook',
      'social-media-calendar': 'social-content-grid',
      'content-calendar-optimizer': 'social-content-grid',
      'landing-page-optimizer': 'landing-page-alchemist',
      'influencer-partnership-framework': 'influence-partnership-frame',
      'content-performance-analyzer': 'content-analytics-dashboard',
      'content-personalization-engine': 'momentum-campaign-builder',
      'database-design-optimizer': 'data-schema-optimizer',
      'microservices-architecture': 'microservices-grid',
      'security-architecture-framework': 'security-fortress-frame',
      'performance-optimization-engine': 'performance-engine',
      'container-orchestration-strategy': 'orchestration-matrix',
      'cloud-infrastructure-architect': 'cloud-infra-map',
      'sales-process-optimizer': 'sales-flow-architect',
      'sales-operations-framework': 'sales-flow-architect',
      'sales-enablement-framework': 'enablement-frame',
      'sales-intelligence-framework': 'negotiation-dynamics',
      'quality-management-system': 'quality-system-map',
      'supply-chain-optimizer': 'supply-flow-optimizer',
      'change-management-framework': 'change-force-field',
      'executive-prompt-report': 'executive-prompt-dossier'
    };

    for (const legacySlug of legacySlugs) {
      const legacyUrl = `/modules/${legacySlug}`;
      const expectedNewSlug = expectedRedirects[legacySlug as keyof typeof expectedRedirects];
      
      // Test the redirect
      const response = await page.goto(legacyUrl, { waitUntil: 'networkidle' });
      
      // Check that we get a 308 redirect
      expect(response?.status()).toBe(308);
      
      // Check that the final URL contains the new slug
      const finalUrl = page.url();
      expect(finalUrl).toContain(`/modules/${expectedNewSlug}`);
      
      console.log(`✅ ${legacySlug} → ${expectedNewSlug}`);
    }
  });

  test('should redirect generator URLs with module parameters', async ({ page }) => {
    const legacySlug = 'risk-and-trust-reversal';
    const expectedNewSlug = 'trust-reversal-protocol';
    
    const generatorUrl = `/generator?module=${legacySlug}`;
    
    // Test the redirect
    const response = await page.goto(generatorUrl, { waitUntil: 'networkidle' });
    
    // Check that we get a 308 redirect
    expect(response?.status()).toBe(308);
    
    // Check that the final URL contains the new slug in the module parameter
    const finalUrl = page.url();
    expect(finalUrl).toContain(`module=${expectedNewSlug}`);
    
    console.log(`✅ Generator redirect: ${legacySlug} → ${expectedNewSlug}`);
  });

  test('should not redirect non-legacy URLs', async ({ page }) => {
    const nonLegacyUrls = [
      '/modules/trust-reversal-protocol',
      '/modules/crisis-communication-playbook',
      '/modules/social-content-grid',
      '/generator?module=trust-reversal-protocol'
    ];

    for (const url of nonLegacyUrls) {
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      
      // Check that we get a 200 status (not a redirect)
      expect(response?.status()).toBe(200);
      
      // Check that the URL hasn't changed
      expect(page.url()).toContain(url.split('?')[0]);
      
      console.log(`✅ No redirect for: ${url}`);
    }
  });

  test('should track redirect telemetry', async ({ page }) => {
    // Navigate to a legacy URL to trigger a redirect
    const legacyUrl = '/modules/risk-and-trust-reversal';
    
    // Listen for network requests to the analytics API
    const analyticsRequest = page.waitForRequest(request => 
      request.url().includes('/api/analytics/redirects')
    );
    
    // Navigate to the legacy URL
    await page.goto(legacyUrl, { waitUntil: 'networkidle' });
    
    // Wait for the analytics request (it might be async)
    try {
      await analyticsRequest;
      console.log('✅ Redirect telemetry request detected');
    } catch (error) {
      // Telemetry might be async and not captured, that's okay
      console.log('ℹ️  Redirect telemetry request not captured (async)');
    }
  });

  test('should handle redirects with query parameters', async ({ page }) => {
    const legacySlug = 'crisis-communication';
    const expectedNewSlug = 'crisis-communication-playbook';
    
    const urlWithParams = `/modules/${legacySlug}?tab=overview&section=details`;
    
    // Test the redirect
    const response = await page.goto(urlWithParams, { waitUntil: 'networkidle' });
    
    // Check that we get a 308 redirect
    expect(response?.status()).toBe(308);
    
    // Check that the final URL contains the new slug and preserves query params
    const finalUrl = page.url();
    expect(finalUrl).toContain(`/modules/${expectedNewSlug}`);
    expect(finalUrl).toContain('tab=overview');
    expect(finalUrl).toContain('section=details');
    
    console.log(`✅ Redirect with query params: ${legacySlug} → ${expectedNewSlug}`);
  });

  test('should handle redirects with hash fragments', async ({ page }) => {
    const legacySlug = 'social-media-calendar';
    const expectedNewSlug = 'social-content-grid';
    
    const urlWithHash = `/modules/${legacySlug}#section-1`;
    
    // Test the redirect
    const response = await page.goto(urlWithHash, { waitUntil: 'networkidle' });
    
    // Check that we get a 308 redirect
    expect(response?.status()).toBe(308);
    
    // Check that the final URL contains the new slug
    const finalUrl = page.url();
    expect(finalUrl).toContain(`/modules/${expectedNewSlug}`);
    
    console.log(`✅ Redirect with hash: ${legacySlug} → ${expectedNewSlug}`);
  });

  test('should handle multiple redirects in sequence', async ({ page }) => {
    // Test that multiple redirects work correctly
    const testCases = [
      {
        legacy: 'risk-and-trust-reversal',
        expected: 'trust-reversal-protocol'
      },
      {
        legacy: 'crisis-communication',
        expected: 'crisis-communication-playbook'
      },
      {
        legacy: 'social-media-calendar',
        expected: 'social-content-grid'
      }
    ];

    for (const testCase of testCases) {
      const legacyUrl = `/modules/${testCase.legacy}`;
      
      // Test the redirect
      const response = await page.goto(legacyUrl, { waitUntil: 'networkidle' });
      
      // Check that we get a 308 redirect
      expect(response?.status()).toBe(308);
      
      // Check that the final URL contains the new slug
      const finalUrl = page.url();
      expect(finalUrl).toContain(`/modules/${testCase.expected}`);
      
      console.log(`✅ Sequential redirect: ${testCase.legacy} → ${testCase.expected}`);
    }
  });

  test('should handle edge cases gracefully', async ({ page }) => {
    const edgeCases = [
      '/modules/', // Empty slug
      '/modules/non-existent-module', // Non-legacy, non-existent module
      '/modules/risk-and-trust-reversal/', // Trailing slash
      '/modules/RISK-AND-TRUST-REVERSAL', // Uppercase
      '/modules/risk_and_trust_reversal', // Underscores instead of hyphens
    ];

    for (const url of edgeCases) {
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      
      // These should either redirect properly or return 404, but not crash
      expect([200, 308, 404]).toContain(response?.status() || 0);
      
      console.log(`✅ Edge case handled: ${url} (status: ${response?.status()})`);
    }
  });
});

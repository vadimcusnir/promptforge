import { test, expect } from "@playwright/test";

test.describe("PromptForge Generator - SSR & 7D Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/generator");
  });

  test("should load with SSR and display modules", async ({ page }) => {
    // Check that the page loads with server-side rendered content
    await expect(page.locator("h1")).toContainText("PromptForge Generator");
    
    // Verify modules are loaded from SSR
    const moduleCards = page.locator('[data-testid="module-card"]');
    await expect(moduleCards).toHaveCount(5); // We have 5 modules defined
    
    // Check that the first module is visible
    const firstModule = page.locator('[data-testid="module-card"]').first();
    await expect(firstModule).toBeVisible();
  });

  test("should handle direct URL access with parameters", async ({ page }) => {
    // Test direct access with module and 7D parameters
    await page.goto("/generator?module=3&domain=marketing&scale=startup");
    
    // Verify the module is pre-selected
    await expect(page.locator("text=Selected Module")).toBeVisible();
    
    // Check that 7D config is pre-populated
    const domainSelect = page.locator('select[name="domain"]');
    await expect(domainSelect).toHaveValue("marketing");
    
    const scaleSelect = page.locator('select[name="scale"]');
    await expect(scaleSelect).toHaveValue("startup");
  });

  test("should pre-populate 7D config from module defaults", async ({ page }) => {
    // Select a module with specific defaults
    const moduleCard = page.locator('[data-testid="module-card"]').filter({ hasText: "AI-IDEI.SOPFORGE" });
    await moduleCard.click();
    
    // Verify 7D config is pre-populated from module defaults
    await expect(page.locator('select[name="complexity"]')).toHaveValue("advanced");
    await expect(page.locator('select[name="domain"]')).toHaveValue("ai");
    await expect(page.locator('select[name="vector"]')).toHaveValue("V1");
  });

  test("should generate prompt with complete 7D flow", async ({ page }) => {
    // Select a module
    const moduleCard = page.locator('[data-testid="module-card"]').first();
    await moduleCard.click();
    
    // Configure 7D parameters
    await page.selectOption('select[name="domain"]', "saas");
    await page.selectOption('select[name="scale"]', "startup");
    await page.selectOption('select[name="urgency"]', "planned");
    
    // Click generate button
    const generateBtn = page.locator("button:has-text('Generate Prompt')");
    await generateBtn.click();
    
    // Wait for generation to complete
    await expect(page.locator("text=Generated Prompt")).toBeVisible();
    
    // Verify prompt content is displayed
    const promptContent = page.locator('[data-testid="prompt-content"]');
    await expect(promptContent).toBeVisible();
    await expect(promptContent).not.toBeEmpty();
  });

  test("should save to local history and display run ID", async ({ page }) => {
    // Generate a prompt first
    const moduleCard = page.locator('[data-testid="module-card"]').first();
    await moduleCard.click();
    
    const generateBtn = page.locator("button:has-text('Generate Prompt')");
    await generateBtn.click();
    
    // Wait for generation and check run ID
    await expect(page.locator("text=Run ID:")).toBeVisible();
    const runId = page.locator("text=Run ID:").locator("..").locator("span").first();
    await expect(runId).not.toBeEmpty();
    
    // Check that history is displayed
    await expect(page.locator("text=Recent Runs")).toBeVisible();
  });

  test("should load previous runs from history", async ({ page }) => {
    // Generate a prompt to create history
    const moduleCard = page.locator('[data-testid="module-card"]').first();
    await moduleCard.click();
    
    const generateBtn = page.locator("button:has-text('Generate Prompt')");
    await generateBtn.click();
    
    await expect(page.locator("text=Generated Prompt")).toBeVisible();
    
    // Click on history item to load previous run
    const historyItem = page.locator('[data-testid="history-item"]').first();
    await historyItem.click();
    
    // Verify the run is loaded
    await expect(page.locator("text=Run Loaded")).toBeVisible();
  });

  test("should run GPT test and update scores", async ({ page }) => {
    // Generate a prompt first
    const moduleCard = page.locator('[data-testid="module-card"]').first();
    await moduleCard.click();
    
    const generateBtn = page.locator("button:has-text('Generate Prompt')");
    await generateBtn.click();
    
    await expect(page.locator("text=Generated Prompt")).toBeVisible();
    
    // Click run test button
    const testBtn = page.locator("button:has-text('Run Test')");
    await testBtn.click();
    
    // Wait for test to complete
    await expect(page.locator("text=Test Completed")).toBeVisible();
    
    // Verify scores are displayed
    await expect(page.locator("text=Clarity")).toBeVisible();
    await expect(page.locator("text=Execution")).toBeVisible();
    await expect(page.locator("text=Ambiguity")).toBeVisible();
    await expect(page.locator("text=Business-fit")).toBeVisible();
  });

  test("should export prompts in available formats", async ({ page }) => {
    // Generate a prompt first
    const moduleCard = page.locator('[data-testid="module-card"]').first();
    await moduleCard.click();
    
    const generateBtn = page.locator("button:has-text('Generate Prompt')");
    await generateBtn.click();
    
    await expect(page.locator("text=Generated Prompt")).toBeVisible();
    
    // Check export options are available
    await expect(page.locator("text=Export Options")).toBeVisible();
    
    // Try to export (this will trigger download in real browser)
    const exportBtn = page.locator("button:has-text('Export as TXT')");
    await expect(exportBtn).toBeVisible();
  });

  test("should handle URL synchronization for 7D config", async ({ page }) => {
    // Select a module
    const moduleCard = page.locator('[data-testid="module-card"]').first();
    await moduleCard.click();
    
    // Change some 7D parameters
    await page.selectOption('select[name="domain"]', "fintech");
    await page.selectOption('select[name="complexity"]', "advanced");
    
    // Check that URL is updated
    await expect(page).toHaveURL(/domain=fintech/);
    await expect(page).toHaveURL(/complexity=advanced/);
    
    // Refresh page and verify state is preserved
    await page.reload();
    
    await expect(page.locator('select[name="domain"]')).toHaveValue("fintech");
    await expect(page.locator('select[name="complexity"]')).toHaveValue("advanced");
  });

  test("should respect entitlements and show paywall when needed", async ({ page }) => {
    // Mock free tier entitlements (limited runs)
    await page.addInitScript(() => {
      window.localStorage.setItem('mock_entitlements', JSON.stringify({
        planTier: 'free',
        monthlyRunsRemaining: 0,
        canGeneratePrompt: false
      }));
    });
    
    // Try to generate prompt
    const moduleCard = page.locator('[data-testid="module-card"]').first();
    await moduleCard.click();
    
    const generateBtn = page.locator("button:has-text('Generate Prompt')");
    await generateBtn.click();
    
    // Should show paywall
    await expect(page.locator("text=Upgrade Required")).toBeVisible();
  });

  test("should display module metadata and filtering", async ({ page }) => {
    // Test vector filtering
    await page.selectOption('select[name="vector-filter"]', "2");
    const filteredModules = page.locator('[data-testid="module-card"]');
    await expect(filteredModules).toHaveCount(3); // V2 modules
    
    // Test complexity filtering
    await page.selectOption('select[name="complexity-filter"]', "advanced");
    await expect(filteredModules).toHaveCount(2); // Advanced modules
    
    // Test domain filtering
    await page.selectOption('select[name="domain-filter"]', "ai");
    await expect(filteredModules).toHaveCount(2); // AI modules
    
    // Clear filters
    const clearFiltersBtn = page.locator("button:has-text('Clear Filters')");
    await clearFiltersBtn.click();
    
    // Should show all modules again
    await expect(filteredModules).toHaveCount(5);
  });

  test("should handle module selection and 7D pre-population", async ({ page }) => {
    // Select different modules and verify 7D config changes
    const modules = [
      { name: "AI-IDEI.SOPFORGE", expectedComplexity: "advanced", expectedDomain: "ai" },
      { name: "Codul 7:1", expectedComplexity: "intermediate", expectedDomain: "marketing" },
      { name: "ORAKON Memory Grid", expectedComplexity: "advanced", expectedDomain: "ai" }
    ];
    
    for (const module of modules) {
      const moduleCard = page.locator('[data-testid="module-card"]').filter({ hasText: module.name });
      await moduleCard.click();
      
      // Verify 7D config is updated
      await expect(page.locator('select[name="complexity"]')).toHaveValue(module.expectedComplexity);
      await expect(page.locator('select[name="domain"]')).toHaveValue(module.expectedDomain);
      
      // Clear any generated prompt
      const clearBtn = page.locator("button:has-text('Clear')");
      if (await clearBtn.isVisible()) {
        await clearBtn.click();
      }
    }
  });
});

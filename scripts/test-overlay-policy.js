#!/usr/bin/env node

/**
 * UI Overlay Policy Test Script
 *
 * Simple validation script that checks implementation compliance
 * without requiring Playwright setup.
 */

const fs = require("fs");
const path = require("path");

console.log("🎯 UI Overlay Policy - Validation Script");
console.log("==========================================\n");

const errors = [];
const warnings = [];

// Check 1: SSOT Configuration exists
function checkSSOTConfig() {
  const rulesetPath = path.join(__dirname, "../cursor/ruleset.yml");

  if (!fs.existsSync(rulesetPath)) {
    errors.push("❌ cursor/ruleset.yml not found");
    return false;
  }

  const content = fs.readFileSync(rulesetPath, "utf8");

  // Check required sections
  const requiredSections = [
    "ui_overlays:",
    "target_selector:",
    "route_class_map:",
    "state_class_map:",
    "css_vars:",
    "acceptance:",
  ];

  const missingSections = requiredSections.filter(
    (section) => !content.includes(section),
  );

  if (missingSections.length > 0) {
    errors.push(`❌ Missing SSOT sections: ${missingSections.join(", ")}`);
    return false;
  }

  console.log("✅ SSOT Configuration (cursor/ruleset.yml)");
  return true;
}

// Check 2: Core Components exist
function checkCoreComponents() {
  const components = [
    "components/OverlayController.tsx",
    "lib/quote-focus.tsx",
    "components/ui/QuoteBlock.tsx",
  ];

  let allExist = true;

  components.forEach((component) => {
    const componentPath = path.join(__dirname, "..", component);
    if (fs.existsSync(componentPath)) {
      console.log(`✅ ${component}`);
    } else {
      errors.push(`❌ Missing component: ${component}`);
      allExist = false;
    }
  });

  return allExist;
}

// Check 3: CSS Implementation
function checkCSSImplementation() {
  const cssPath = path.join(__dirname, "../app/globals.css");

  if (!fs.existsSync(cssPath)) {
    errors.push("❌ app/globals.css not found");
    return false;
  }

  const content = fs.readFileSync(cssPath, "utf8");

  const requiredCSS = [
    "#bg-overlay",
    "var(--overlay-gradient",
    "var(--overlay-opacity",
    "var(--tokens-opacity",
    ".route-marketing",
    ".route-generator",
    ".route-dashboard",
    ".quote-active",
    ".quote-focus",
    ".matrix-tokens",
    "will-change: transform, opacity",
    "@media (prefers-reduced-motion: reduce)",
  ];

  const missingCSS = requiredCSS.filter((rule) => !content.includes(rule));

  if (missingCSS.length > 0) {
    errors.push(`❌ Missing CSS rules: ${missingCSS.join(", ")}`);
    return false;
  }

  console.log("✅ CSS Implementation (app/globals.css)");
  return true;
}

// Check 4: Integration in Layout
function checkLayoutIntegration() {
  const layoutPath = path.join(__dirname, "../app/ClientRootLayout.tsx");

  if (!fs.existsSync(layoutPath)) {
    errors.push("❌ app/ClientRootLayout.tsx not found");
    return false;
  }

  const content = fs.readFileSync(layoutPath, "utf8");

  const requiredIntegrations = [
    "OverlayController",
    "QuoteFocusProvider",
    'id="bg-overlay"',
  ];

  const missingIntegrations = requiredIntegrations.filter(
    (integration) => !content.includes(integration),
  );

  if (missingIntegrations.length > 0) {
    errors.push(
      `❌ Missing layout integrations: ${missingIntegrations.join(", ")}`,
    );
    return false;
  }

  console.log("✅ Layout Integration (app/ClientRootLayout.tsx)");
  return true;
}

// Check 5: E2E Tests exist
function checkE2ETests() {
  const testPath = path.join(
    __dirname,
    "../tests/e2e/ui-overlay-policy.spec.ts",
  );

  if (!fs.existsSync(testPath)) {
    warnings.push("⚠️  E2E tests not found - consider setting up Playwright");
    return false;
  }

  console.log("✅ E2E Tests (tests/e2e/ui-overlay-policy.spec.ts)");
  return true;
}

// Check 6: Documentation exists
function checkDocumentation() {
  const docsPath = path.join(
    __dirname,
    "../docs/ui/overlay-policy-operations.txt",
  );

  if (!fs.existsSync(docsPath)) {
    errors.push("❌ Operations documentation not found");
    return false;
  }

  console.log(
    "✅ Operations Documentation (docs/ui/overlay-policy-operations.txt)",
  );
  return true;
}

// Check 7: Guardrails (CODEOWNERS, lint rules)
function checkGuardrails() {
  const codeownersPath = path.join(__dirname, "../.github/CODEOWNERS");
  const lintConfigPath = path.join(__dirname, "../.eslintrc.overlay-policy.js");

  let guardrailsOk = true;

  if (!fs.existsSync(codeownersPath)) {
    warnings.push(
      "⚠️  CODEOWNERS not found - consider adding for mandatory reviews",
    );
    guardrailsOk = false;
  } else {
    console.log("✅ CODEOWNERS (.github/CODEOWNERS)");
  }

  if (!fs.existsSync(lintConfigPath)) {
    warnings.push("⚠️  Overlay policy lint rules not found");
    guardrailsOk = false;
  } else {
    console.log("✅ Lint Rules (.eslintrc.overlay-policy.js)");
  }

  return guardrailsOk;
}

// Run all checks
console.log("Running validation checks...\n");

checkSSOTConfig();
checkCoreComponents();
checkCSSImplementation();
checkLayoutIntegration();
checkE2ETests();
checkDocumentation();
checkGuardrails();

// Summary
console.log("\n==========================================");
console.log("📊 VALIDATION SUMMARY");
console.log("==========================================");

if (errors.length === 0) {
  console.log("🎉 All critical checks passed!");
} else {
  console.log("💥 Critical errors found:");
  errors.forEach((error) => console.log(`   ${error}`));
}

if (warnings.length > 0) {
  console.log("\n⚠️  Warnings:");
  warnings.forEach((warning) => console.log(`   ${warning}`));
}

console.log("\n📋 Manual Testing Checklist:");
console.log("   1. Navigate to / → check #bg-overlay has .route-marketing");
console.log("   2. Navigate to /generator → check route class changes");
console.log("   3. Hover on quote → check opacity changes");
console.log("   4. Test reduced motion preference");
console.log("   5. Check performance (≤50ms route transitions)");

console.log("\n🚀 Next Steps:");
console.log("   • Run: npm run dev");
console.log("   • Test manually through different routes");
console.log("   • Check browser dev tools for performance");
console.log("   • Verify no console.log in production build");

// Exit with appropriate code
process.exit(errors.length > 0 ? 1 : 0);

#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

async function comparePerformanceMetrics() {
  const resultsPath = ".lighthouseci/lhr-*.json"
  const budgetsPath = "./budgets.json"

  try {
    const budgets = JSON.parse(fs.readFileSync(budgetsPath, "utf8"))
    const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"))

    let hasFailures = false
    const failures = []

    // Check Core Web Vitals against budgets
    const vitals = {
      "largest-contentful-paint": results.audits["largest-contentful-paint"].numericValue,
      "cumulative-layout-shift": results.audits["cumulative-layout-shift"].numericValue,
      "first-input-delay": results.audits["max-potential-fid"].numericValue,
      "total-blocking-time": results.audits["total-blocking-time"].numericValue,
      "speed-index": results.audits["speed-index"].numericValue,
      interactive: results.audits["interactive"].numericValue,
    }

    budgets.budgets[0].timings.forEach((budget) => {
      const actual = vitals[budget.metric]
      if (actual > budget.budget) {
        hasFailures = true
        failures.push({
          metric: budget.metric,
          budget: budget.budget,
          actual: actual,
          difference: actual - budget.budget,
        })
      }
    })

    // Check bundle sizes
    const bundleSize =
      results.audits["resource-summary"].details.items.find((item) => item.resourceType === "script")?.size || 0

    const scriptBudget =
      budgets.budgets[0].resourceSizes.find((budget) => budget.resourceType === "script")?.budget * 1024 || 0

    if (bundleSize > scriptBudget) {
      hasFailures = true
      failures.push({
        metric: "bundle-size",
        budget: scriptBudget,
        actual: bundleSize,
        difference: bundleSize - scriptBudget,
      })
    }

    if (hasFailures) {
      console.error("❌ Performance budget failures:")
      failures.forEach((failure) => {
        console.error(
          `  ${failure.metric}: ${failure.actual} (budget: ${failure.budget}, over by: ${failure.difference})`,
        )
      })
      process.exit(1)
    } else {
      console.log("✅ All performance budgets passed!")
      process.exit(0)
    }
  } catch (error) {
    console.error("Error comparing performance metrics:", error)
    process.exit(1)
  }
}

comparePerformanceMetrics()

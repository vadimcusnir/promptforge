// Build-time Design Contract Validation
// Runs during build to catch violations before deployment

import fs from "fs"
import path from "path"
import { glob } from "glob"

export interface BuildValidationResult {
  isValid: boolean
  violations: Array<{
    file: string
    line: number
    column: number
    rule: string
    message: string
    severity: "error" | "warning"
  }>
}

export function validateFileContent(filePath: string, content: string): BuildValidationResult {
  const violations: BuildValidationResult["violations"] = []
  const lines = content.split("\n")

  lines.forEach((line, lineIndex) => {
    // Check for arbitrary values
    const arbitraryValueRegex = /className="[^"]*\[(#[0-9a-fA-F]{3,6}|[0-9]+px|[0-9]+rem)\]/g
    let match
    while ((match = arbitraryValueRegex.exec(line)) !== null) {
      violations.push({
        file: filePath,
        line: lineIndex + 1,
        column: match.index + 1,
        rule: "no-arbitrary-values",
        message: `Arbitrary values are forbidden. Use design tokens instead: ${match[0]}`,
        severity: "error",
      })
    }

    // Check for inline styles
    if (line.includes("style={{") || line.includes('style="')) {
      violations.push({
        file: filePath,
        line: lineIndex + 1,
        column: line.indexOf("style=") + 1,
        rule: "no-inline-styles",
        message: "Inline styles are forbidden. Use design tokens from tailwind.config.ts",
        severity: "error",
      })
    }

    // Check for non-standard font sizes
    const fontSizeRegex = /text-\[([0-9]+)px\]/g
    while ((match = fontSizeRegex.exec(line)) !== null) {
      violations.push({
        file: filePath,
        line: lineIndex + 1,
        column: match.index + 1,
        rule: "typography-standard-sizes",
        message: `Use standard font sizes (text-base, text-lg, etc.) instead of: ${match[0]}`,
        severity: "error",
      })
    }

    // Check for non-standard spacing
    const spacingRegex = /(m[trbl]?|p[trbl]?)-\[([0-9]+)px\]/g
    while ((match = spacingRegex.exec(line)) !== null) {
      const value = Number.parseInt(match[2])
      if (value % 4 !== 0) {
        violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index + 1,
          rule: "spacing-4px-scale",
          message: `Spacing must follow 4px/8px scale. ${value}px is not valid`,
          severity: "error",
        })
      }
    }

    // Check for missing alt text on images
    if (line.includes("<img") && !line.includes("alt=")) {
      violations.push({
        file: filePath,
        line: lineIndex + 1,
        column: line.indexOf("<img") + 1,
        rule: "accessibility-alt-text",
        message: "Images must have alt text for accessibility",
        severity: "error",
      })
    }

    // Check for buttons without proper accessibility
    if (line.includes("<button") && !line.includes("aria-") && !line.includes("type=")) {
      violations.push({
        file: filePath,
        line: lineIndex + 1,
        column: line.indexOf("<button") + 1,
        rule: "accessibility-button-type",
        message: "Buttons should have explicit type or aria attributes",
        severity: "warning",
      })
    }
  })

  return {
    isValid: violations.filter((v) => v.severity === "error").length === 0,
    violations,
  }
}

export async function validateProject(projectRoot: string = process.cwd()): Promise<BuildValidationResult> {
  const allViolations: BuildValidationResult["violations"] = []

  // Find all TypeScript and TSX files
  const files = await glob("**/*.{ts,tsx}", {
    cwd: projectRoot,
    ignore: ["node_modules/**", ".next/**", "dist/**", "build/**"],
  })

  for (const file of files) {
    const filePath = path.join(projectRoot, file)
    const content = fs.readFileSync(filePath, "utf-8")
    const result = validateFileContent(filePath, content)
    allViolations.push(...result.violations)
  }

  return {
    isValid: allViolations.filter((v) => v.severity === "error").length === 0,
    violations: allViolations,
  }
}

export async function runBuildValidation() {
  console.log("🎨 Running Design Contract validation...")

  const result = await validateProject()

  if (result.violations.length === 0) {
    console.log("✅ Design Contract: All validations passed!")
    return true
  }

  console.log(`❌ Design Contract: Found ${result.violations.length} violations`)

  // Group violations by file
  const violationsByFile = result.violations.reduce(
    (acc, violation) => {
      if (!acc[violation.file]) {
        acc[violation.file] = []
      }
      acc[violation.file].push(violation)
      return acc
    },
    {} as Record<string, typeof result.violations>,
  )

  Object.entries(violationsByFile).forEach(([file, violations]) => {
    console.log(`\n📄 ${file}:`)
    violations.forEach((violation) => {
      const icon = violation.severity === "error" ? "❌" : "⚠️"
      console.log(`  ${icon} Line ${violation.line}:${violation.column} - ${violation.message} (${violation.rule})`)
    })
  })

  const errorCount = result.violations.filter((v) => v.severity === "error").length
  if (errorCount > 0) {
    console.log(`\n💥 Build failed: ${errorCount} design contract errors must be fixed`)
    process.exit(1)
  }

  return result.isValid
}

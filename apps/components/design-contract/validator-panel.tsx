"use client"

import { useEffect, useState } from "react"
import { validatePage, type ComponentValidationResult } from "@/lib/design-contract/validation"

export function ValidatorPanel() {
  const [result, setResult] = useState<ComponentValidationResult | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    const runValidation = () => {
      const validationResult = validatePage()
      setResult(validationResult)
    }

    // Run initial validation
    setTimeout(runValidation, 1000)

    // Run validation on DOM changes
    const observer = new MutationObserver(() => {
      clearTimeout((window as any).validatorTimeout)
      ;(window as any).validatorTimeout = setTimeout(runValidation, 500)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    })

    return () => observer.disconnect()
  }, [])

  if (process.env.NODE_ENV !== "development" || !result) return null

  const errorCount = result.violations.filter((v) => v.type === "error").length
  const warningCount = result.violations.filter((v) => v.type === "warning").length

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-sm">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`w-full px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
          result.isValid
            ? "bg-green-600 text-white"
            : errorCount > 0
              ? "bg-red-600 text-white"
              : "bg-yellow-600 text-white"
        }`}
      >
        🎨 Design Contract: {result.score}/100
        {errorCount > 0 && ` (${errorCount} errors)`}
        {warningCount > 0 && ` (${warningCount} warnings)`}
      </button>

      {isVisible && (
        <div className="bg-gray-900 text-white rounded-b-lg border border-gray-700 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="mb-3">
              <div className="text-sm font-medium mb-1">Validation Score: {result.score}/100</div>
              <div className="text-xs text-gray-400">
                {errorCount} errors, {warningCount} warnings
              </div>
            </div>

            {result.violations.length > 0 && (
              <div className="space-y-2">
                {result.violations.slice(0, 10).map((violation, index) => (
                  <div
                    key={index}
                    className={`text-xs p-2 rounded ${
                      violation.type === "error" ? "bg-red-900/50" : "bg-yellow-900/50"
                    }`}
                  >
                    <div className="font-medium">{violation.rule}</div>
                    <div className="text-gray-300">{violation.message}</div>
                    {violation.element && <div className="text-gray-400 mt-1">&lt;{violation.element}&gt;</div>}
                  </div>
                ))}
                {result.violations.length > 10 && (
                  <div className="text-xs text-gray-400 text-center py-2">
                    ... and {result.violations.length - 10} more violations
                  </div>
                )}
              </div>
            )}

            {result.violations.length === 0 && <div className="text-green-400 text-sm">✅ All validations passed!</div>}
          </div>
        </div>
      )}
    </div>
  )
}

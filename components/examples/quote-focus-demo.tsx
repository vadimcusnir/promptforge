"use client";

import React, { useState } from "react";
import { useQuoteFocus } from "@/lib/quote-focus";
import { QuoteBlock } from "@/components/ui/QuoteBlock";

/**
 * Example component demonstrating the UI Overlay Policy system
 *
 * Usage patterns:
 * 1. Manual control with useQuoteFocus hook
 * 2. Automatic control with QuoteBlock component
 *
 * Enforces SSOT from ruleset.yml with performance requirements:
 * - Route transitions ≤50ms
 * - Quote focus activation ≤20ms
 * - GPU-accelerated animations
 * - Reduced motion support
 */
export function QuoteFocusDemo() {
  const { active, set } = useQuoteFocus();
  const [showAutoQuote, setShowAutoQuote] = useState(false);

  return (
    <div className="space-y-6 p-6 glass-card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">
        Quote Focus System Demo
      </h2>

      {/* Manual Control Example */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gold-industrial">
          Manual Control
        </h3>
        <p className="text-gray-300 text-sm">
          Use the toggle button to manually activate/deactivate quote focus
          mode. This reduces overlay opacity and matrix token visibility by
          ~35%.
        </p>
        <button
          onClick={() => set(!active)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            active
              ? "bg-gold-industrial text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          {active ? "Deactivate" : "Activate"} Quote Focus
        </button>
        <div className="text-xs text-gray-400">
          Status: {active ? "🎯 Focus Active" : "⚪ Normal Mode"}
        </div>
      </div>

      {/* Automatic Control Example */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gold-industrial">
          Automatic Control
        </h3>
        <p className="text-gray-300 text-sm">
          This quote automatically triggers focus mode when visible. Perfect for
          narrative quotes, testimonials, or important messages.
        </p>
        <button
          onClick={() => setShowAutoQuote(!showAutoQuote)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
        >
          {showAutoQuote ? "Hide" : "Show"} Auto Quote
        </button>

        {showAutoQuote && (
          <QuoteBlock className="italic text-gray-200">
            "When this quote appears, the background automatically dims and
            matrix tokens fade to improve readability and focus. This creates a
            cinematic effect that draws attention to important content."
            <footer className="text-gold-industrial text-sm mt-2">
              — UI Overlay Policy System
            </footer>
          </QuoteBlock>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
        <h4 className="font-semibold text-white mb-2">Implementation Guide</h4>
        <div className="text-sm text-gray-300 space-y-2">
          <p>
            <strong>For manual control:</strong> Use{" "}
            <code className="bg-gray-800 px-1 rounded">useQuoteFocus()</code>{" "}
            hook
          </p>
          <p>
            <strong>For automatic control:</strong> Use{" "}
            <code className="bg-gray-800 px-1 rounded">QuoteBlock</code>{" "}
            component
          </p>
          <p>
            <strong>UI Overlay Policy:</strong> SSOT enforcement with GPU
            acceleration and reduced motion support
          </p>
          <p>
            <strong>Performance:</strong> &lt;50ms route transitions, &lt;20ms
            quote focus activation
          </p>
        </div>
      </div>
    </div>
  );
}

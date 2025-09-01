import type { Metadata } from 'next'
import Link from 'next/link'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Checkout Cancelled - PromptForge v3.1',
  description: 'Your checkout was cancelled. You can try again or explore our free features.',
  robots: 'noindex, nofollow', // Don't index checkout pages
}

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Cancel Icon */}
        <div className="mb-8">
          <XCircle className="w-24 h-24 text-red-500 mx-auto" />
        </div>

        {/* Cancel Message */}
        <h1 className="text-4xl font-bold text-[var(--fg-primary)] mb-4">
          Checkout Cancelled
        </h1>
        
        <p className="text-xl text-[var(--fg-muted)] mb-8">
          No worries! Your checkout was cancelled and you haven't been charged.
        </p>

        {/* Free Features Reminder */}
        <div className="bg-[var(--border)]/20 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4">
            You can still use PromptForge for free:
          </h2>
          <ul className="space-y-2 text-left">
            <li className="flex items-center gap-2 text-[var(--fg-muted)]">
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full flex-shrink-0" />
              10 Core Modules
            </li>
            <li className="flex items-center gap-2 text-[var(--fg-muted)]">
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full flex-shrink-0" />
              .txt Export
            </li>
            <li className="flex items-center gap-2 text-[var(--fg-muted)]">
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full flex-shrink-0" />
              Basic Scoring
            </li>
            <li className="flex items-center gap-2 text-[var(--fg-muted)]">
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full flex-shrink-0" />
              Community Support
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] text-black px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[var(--brand)]/25 transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Link>
          
          <Link
            href="/generator"
            className="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--fg-primary)] px-6 py-3 rounded-lg font-medium hover:border-[var(--brand)] hover:bg-[var(--brand)]/5 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue with Free Plan
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-sm text-[var(--fg-muted)]">
          <p>
            Have questions about our plans?{' '}
            <Link href="/contact" className="text-[var(--brand)] hover:underline">
              Contact us
            </Link>{' '}
            or check out our{' '}
            <Link href="/pricing" className="text-[var(--brand)] hover:underline">
              pricing page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Checkout Success - PromptForge v3.1',
  description: 'Your subscription has been successfully activated. Start using PromptForge Pro features immediately.',
  robots: 'noindex, nofollow', // Don't index checkout pages
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <CheckCircle className="w-24 h-24 text-[var(--accent)] mx-auto" />
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-[var(--fg-primary)] mb-4">
          Welcome to PromptForge Pro!
        </h1>
        
        <p className="text-xl text-[var(--fg-muted)] mb-8">
          Your subscription has been successfully activated. You now have access to all Pro features.
        </p>

        {/* Feature Highlights */}
        <div className="bg-[var(--border)]/20 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4">
            What's New in Your Pro Plan:
          </h2>
          <ul className="space-y-2 text-left">
            <li className="flex items-center gap-2 text-[var(--fg-muted)]">
              <CheckCircle className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
              Run Real Tests with live AI models
            </li>
            <li className="flex items-center gap-2 text-[var(--fg-muted)]">
              <CheckCircle className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
              Export to PDF and JSON formats
            </li>
            <li className="flex items-center gap-2 text-[var(--fg-muted)]">
              <CheckCircle className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
              Advanced analytics and insights
            </li>
            <li className="flex items-center gap-2 text-[var(--fg-muted)]">
              <CheckCircle className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
              Priority support
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/generator"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] text-black px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[var(--brand)]/25 transition-all duration-200"
          >
            Start Using Pro Features
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--fg-primary)] px-6 py-3 rounded-lg font-medium hover:border-[var(--brand)] hover:bg-[var(--brand)]/5 transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-sm text-[var(--fg-muted)]">
          <p>
            Need help getting started? Check out our{' '}
            <Link href="/docs" className="text-[var(--brand)] hover:underline">
              documentation
            </Link>{' '}
            or contact{' '}
            <Link href="/support" className="text-[var(--brand)] hover:underline">
              support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
import type { Metadata } from 'next'
import { PricingClient } from './pricing-client'

export const metadata: Metadata = {
  title: 'Pricing - PromptForge v3.1',
  description: 'Choose the perfect plan for your prompt engineering needs. Free, Creator, Pro, and Enterprise plans with live testing, professional exports, and API access.',
  keywords: 'prompt engineering pricing, AI tools pricing, prompt generator plans, enterprise AI solutions',
  openGraph: {
    title: 'Pricing - PromptForge v3.1',
    description: 'Choose the perfect plan for your prompt engineering needs. Free, Creator, Pro, and Enterprise plans with live testing, professional exports, and API access.',
    type: 'website',
    url: 'https://chatgpt-prompting.com/pricing',
    siteName: 'PromptForge v3.1',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing - PromptForge v3.1',
    description: 'Choose the perfect plan for your prompt engineering needs. Free, Creator, Pro, and Enterprise plans with live testing, professional exports, and API access.',
  },
  alternates: {
    canonical: 'https://chatgpt-prompting.com/pricing',
  },
}

export default function PricingPage() {
  return <PricingClient />
}
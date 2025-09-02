import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | PromptForge",
  description: "Privacy policy and data protection information for PromptForge users.",
  robots: "index, follow",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="text-sm text-gray-400 mb-8">
          <a href="/" className="hover:text-[#d1a954] transition-colors">
            Home
          </a>
          <span className="mx-2">/</span>
          <a href="/legal" className="hover:text-[#d1a954] transition-colors">
            Legal
          </a>
          <span className="mx-2">/</span>
          <span className="text-white">Privacy</span>
        </nav>

        <div className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-[#d1a954] mb-8">Privacy Policy</h1>
          <p className="text-xl text-gray-300 mb-12">Your prompts are your power. We guard it.</p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">What We Collect</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong>Account Information:</strong> Email, name, billing details for subscription management.
              </p>
              <p>
                <strong>Usage Data:</strong> Prompts generated, modules accessed, export history for service
                improvement.
              </p>
              <p>
                <strong>Technical Data:</strong> IP address, browser type, session data for security and analytics.
              </p>
              <p>
                <strong>Behavioral Data:</strong> Interaction patterns for cognitive tier assessment and
                personalization.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Why We Collect It</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-[#d1a954] font-semibold mb-3">Functionality</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Deliver personalized prompt recommendations</li>
                  <li>• Enable collaboration features</li>
                  <li>• Maintain usage history and preferences</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-[#d1a954] font-semibold mb-3">Security & Analytics</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Prevent fraud and abuse</li>
                  <li>• Improve platform performance</li>
                  <li>• Analyze usage patterns for optimization</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">How We Store It</h2>
            <div className="bg-green-900/20 border border-green-800 p-6 rounded-lg">
              <p className="text-gray-300 leading-relaxed">
                All data is stored in encrypted Supabase databases with row-level security policies. Prompt content is
                encrypted at rest and in transit. We use industry-standard security practices including regular security
                audits and compliance monitoring.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">What We Never Do</h2>
            <div className="bg-red-900/20 border border-red-800 p-6 rounded-lg">
              <ul className="text-gray-300 space-y-2">
                <li>• Sell your personal data to third parties</li>
                <li>• Share prompts without explicit consent</li>
                <li>• Use your content to train external AI models</li>
                <li>• Access your data without legitimate business need</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Your Rights</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong>Access:</strong> Request a copy of all data we hold about you.
              </p>
              <p>
                <strong>Export:</strong> Download your prompts and usage history in standard formats.
              </p>
              <p>
                <strong>Delete:</strong> Request complete account and data deletion (irreversible).
              </p>
              <p>
                <strong>Anonymize:</strong> Convert your data to anonymous analytics while preserving insights.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">GDPR Compliance</h2>
            <p className="text-gray-300 leading-relaxed">
              We comply with GDPR requirements for EU users. You have the right to data portability, rectification, and
              erasure. Contact our Data Protection Officer for GDPR-related requests.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Contact</h2>
            <p className="text-gray-300">
              For privacy questions or data requests, contact us at{" "}
              <a href="mailto:legal@promptforge.com" className="text-[#d1a954] hover:underline">
                legal@promptforge.com
              </a>
            </p>
          </section>

          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

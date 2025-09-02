import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | PromptForge",
  description: "Terms of service and usage guidelines for PromptForge industrial prompt engineering platform.",
  robots: "index, follow",
}

export default function TermsPage() {
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
          <span className="text-white">Terms</span>
        </nav>

        <div className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-[#d1a954] mb-8">Terms of Service</h1>
          <p className="text-xl text-gray-300 mb-12">Use the Forge. Don't abuse the Forge.</p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Service Description</h2>
            <p className="text-gray-300 leading-relaxed">
              PromptForge is an industrial-grade prompt engineering platform that provides access to 50 specialized
              modules, 7D parameter optimization, and cognitive stratification tools for professional prompt
              development.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Usage Rights</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong>Personal Use:</strong> Individual accounts for personal prompt development and learning.
              </p>
              <p>
                <strong>Team Use:</strong> Creator and Pro plans include collaboration features for team environments.
              </p>
              <p>
                <strong>Enterprise Use:</strong> Full API access, white-label options, and custom integrations
                available.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Plan Entitlements</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-[#d1a954] font-semibold mb-3">Free & Creator</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Module access as per plan limits</li>
                  <li>• Simulation testing only</li>
                  <li>• Basic export formats</li>
                  <li>• Community support</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-[#d1a954] font-semibold mb-3">Pro & Enterprise</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Live GPT testing access</li>
                  <li>• Advanced export formats</li>
                  <li>• Priority support</li>
                  <li>• API access (Enterprise)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Limitations</h2>
            <div className="bg-red-900/20 border border-red-800 p-6 rounded-lg">
              <ul className="text-gray-300 space-y-2">
                <li>• No reselling or redistribution of generated prompts for commercial gain</li>
                <li>• No automated scraping or bulk data extraction</li>
                <li>• No reverse engineering of proprietary algorithms</li>
                <li>• Rate limits apply to all API endpoints</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Refunds & Support</h2>
            <p className="text-gray-300 leading-relaxed">
              Pro and Enterprise subscriptions include a 7-day refund window from the initial purchase date. Refunds are
              processed within 5-10 business days. Contact our support team for assistance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              Accounts may be terminated for violations of these terms, including but not limited to: abuse of system
              resources, violation of usage limitations, or fraudulent activity.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Contact</h2>
            <p className="text-gray-300">
              For questions regarding these terms, contact us at{" "}
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

import { FileText, Shield, Users, Crown, AlertTriangle, Phone, ArrowUp } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Use - PromptForge™',
  description: 'Use the Forge. Don\'t abuse the Forge. Clear terms for using PromptForge™ services and platform.',
  openGraph: {
    title: 'Terms of Use - PromptForge™',
    description: 'Use the Forge. Don\'t abuse the Forge. Clear terms for using PromptForge™ services and platform.',
    type: 'website',
    url: 'https://chatgpt-prompting.com/terms',
  },
};

export default function TermsPage() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/legal" className="hover:text-foreground transition-colors">
              Legal
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-foreground" aria-current="page">
            Terms of Use
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {/* Header Section */}
        <header className="text-center mb-16">
          {/* Animated Term Verified Seal */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-border rounded-full flex items-center justify-center animate-pulse">
                <FileText className="w-12 h-12 text-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 bg-primary text-black text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                VERIFIED
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 text-white">
            Terms of Use
          </h1>
          <p className="text-2xl text-foreground font-medium">
            Use the Forge. Don't abuse the Forge.
          </p>
        </header>

        {/* Content Grid - 12 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Description of Service */}
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-foreground flex items-center gap-3">
                <Shield className="w-8 h-8" />
                Description of Service
              </h2>
              <div className="space-y-4 text-foreground leading-relaxed text-lg">
                <p>
                  PromptForge™ is a cognitive operating system for AI prompt engineering. We provide:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-foreground mt-2">•</span>
                    <span>50+ specialized prompt modules across various domains</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-foreground mt-2">•</span>
                    <span>7D Engine for comprehensive prompt evaluation and optimization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-foreground mt-2">•</span>
                    <span>Real-time AI testing and validation tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-foreground mt-2">•</span>
                    <span>Export capabilities for PDF, JSON, and ZIP formats</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Usage Rights */}
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-foreground flex items-center gap-3">
                <Users className="w-8 h-8" />
                Usage Rights
              </h2>
              <div className="space-y-6 text-foreground leading-relaxed text-lg">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Personal Use</h3>
                  <p>Free tier users can access basic modules and generate prompts for personal projects.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Team Use</h3>
                  <p>Creator and Pro plans allow sharing within your organization and team collaboration features.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Enterprise Use</h3>
                  <p>Enterprise plans include advanced security, custom integrations, and dedicated support.</p>
                </div>
              </div>
            </section>

            {/* Plan Entitlements */}
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-foreground flex items-center gap-3">
                <Crown className="w-8 h-8" />
                Plan Entitlements
              </h2>
              <div className="grid gap-6">
                <div className="border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">Free Plan</h3>
                  <ul className="space-y-2 text-foreground">
                    <li>• Access to 5 basic modules</li>
                    <li>• Basic prompt generation</li>
                    <li>• Community support</li>
                  </ul>
                </div>
                <div className="border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">Creator Plan</h3>
                  <ul className="space-y-2 text-foreground">
                    <li>• Access to 25+ modules</li>
                    <li>• 7D Engine evaluation</li>
                    <li>• PDF export capability</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
                <div className="border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">Pro Plan</h3>
                  <ul className="space-y-2 text-foreground">
                    <li>• Full module access (50+)</li>
                    <li>• Advanced 7D Engine</li>
                    <li>• All export formats (PDF, JSON, ZIP)</li>
                    <li>• API access</li>
                    <li>• 7-day refund guarantee</li>
                  </ul>
                </div>
                <div className="border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">Enterprise Plan</h3>
                  <ul className="space-y-2 text-foreground">
                    <li>• Custom integrations</li>
                    <li>• Dedicated support team</li>
                    <li>• Advanced security features</li>
                    <li>• Custom training and onboarding</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-foreground flex items-center gap-3">
                <AlertTriangle className="w-8 h-8" />
                Limitations
              </h2>
              <div className="space-y-4 text-foreground leading-relaxed text-lg">
                <p>To maintain platform integrity, the following activities are strictly prohibited:</p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-foreground mt-2">•</span>
                    <span><strong>Prompt Reselling:</strong> You may not resell, redistribute, or commercialize prompts generated on our platform</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-foreground mt-2">•</span>
                    <span><strong>AI Scraping:</strong> Automated collection of prompts or systematic extraction of our content is forbidden</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-foreground mt-2">•</span>
                    <span><strong>Platform Abuse:</strong> Excessive API calls, attempts to overload our systems, or circumventing rate limits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-foreground mt-2">•</span>
                    <span><strong>Content Violations:</strong> Generating prompts for illegal activities, harassment, or harmful content</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Refunds & Support */}
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-foreground flex items-center gap-3">
                <Phone className="w-8 h-8" />
                Refunds & Support
              </h2>
              <div className="space-y-4 text-foreground leading-relaxed text-lg">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Refund Policy</h3>
                  <p>
                    <strong>Pro Plan:</strong> 7-day money-back guarantee. If you're not satisfied, contact us within 7 days of purchase for a full refund.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Support Channels</h3>
                  <ul className="space-y-2 ml-6">
                    <li>• Email: <a href="mailto:support@chatgpt-prompting.com" className="text-foreground hover:text-foreground/80 underline">support@chatgpt-prompting.com</a></li>
                    <li>• Documentation: <Link href="/docs" className="text-foreground hover:text-foreground/80 underline">/docs</Link></li>
                    <li>• Community: Available for all users</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Termination Clause */}
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-foreground flex items-center gap-3">
                <Shield className="w-8 h-8" />
                Termination Clause
              </h2>
              <div className="space-y-4 text-foreground leading-relaxed text-lg">
                <p>
                  We reserve the right to terminate or suspend your account immediately if you violate these Terms of Service.
                </p>
                <p>
                  <strong>Grounds for termination include:</strong>
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Violation of usage limitations</li>
                  <li>• Attempted platform abuse</li>
                  <li>• Illegal or harmful content generation</li>
                  <li>• Non-payment of subscription fees</li>
                </ul>
                <p>
                  Upon termination, you lose access to all services and your data may be permanently deleted.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="border-t border-gray-800 pt-8">
              <h2 className="text-3xl font-semibold mb-6 text-foreground">
                Contact & Legal Questions
              </h2>
              <div className="space-y-4 text-foreground leading-relaxed text-lg">
                <p>
                  For questions about these terms or legal matters:
                </p>
                <div className="bg-gray-900/20 border border-gray-800 rounded-lg p-6">
                  <p className="mb-3">
                    <strong>Legal Team:</strong>
                  </p>
                  <a 
                    href="mailto:legal@chatgpt-prompting.com" 
                    className="text-foreground hover:text-foreground/80 underline text-lg"
                  >
                    legal@chatgpt-prompting.com
                  </a>
                  <p className="mt-3 text-sm text-gray-400">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Quick Navigation */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="bg-gray-900/20 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Quick Navigation</h3>
                <nav className="space-y-3">
                  <a href="#service" className="block text-foreground hover:text-foreground transition-colors">Service Description</a>
                  <a href="#rights" className="block text-foreground hover:text-foreground transition-colors">Usage Rights</a>
                  <a href="#plans" className="block text-foreground hover:text-foreground transition-colors">Plan Entitlements</a>
                  <a href="#limitations" className="block text-foreground hover:text-foreground transition-colors">Limitations</a>
                  <a href="#refunds" className="block text-foreground hover:text-foreground transition-colors">Refunds & Support</a>
                  <a href="#termination" className="block text-foreground hover:text-foreground transition-colors">Termination</a>
                  <a href="#contact" className="block text-foreground hover:text-foreground transition-colors">Contact</a>
                </nav>
              </div>

              <div className="mt-6 bg-gray-900/20 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Related Documents</h3>
                <div className="space-y-3">
                  <Link href="/privacy" className="block text-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/legal" className="block text-foreground hover:text-foreground transition-colors">
                    Legal Hub
                  </Link>
                  <a 
                    href="https://gdpr.eu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-foreground hover:text-foreground transition-colors"
                  >
                    GDPR Information
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="text-center mt-16">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors font-semibold"
          >
            <ArrowUp className="w-5 h-5" />
            Back to Top
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-16 pt-8 border-t border-gray-800">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p className="mt-2">
            PromptForge™ - Use the Forge. Don't abuse the Forge.
          </p>
        </footer>
      </main>
    </div>
  );
}

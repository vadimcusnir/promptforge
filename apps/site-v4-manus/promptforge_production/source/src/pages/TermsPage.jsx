import { Card } from '@/components/ui/card'

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">Terms of Service</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Last updated: December 2024
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="card-industrial">
          <div className="p-8 prose prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using PromptForge™ ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              PromptForge™ is an operational prompt engineering platform that provides:
            </p>
            <ul>
              <li>50+ industrial-grade prompt modules</li>
              <li>7-dimensional parameter framework</li>
              <li>Export capabilities in multiple formats (.txt, .md, .json, .pdf)</li>
              <li>Quality scoring and verification systems</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the Service, you must register for an account. You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h2>4. Subscription Plans</h2>
            <p>
              PromptForge™ offers multiple subscription tiers:
            </p>
            <ul>
              <li><strong>Free:</strong> Limited access to basic modules and .txt exports</li>
              <li><strong>Creator:</strong> Enhanced capabilities with .txt and .md exports</li>
              <li><strong>Pro:</strong> Advanced features with all export formats</li>
              <li><strong>Enterprise:</strong> Full platform access with API and white-label options</li>
            </ul>

            <h2>5. Payment Terms</h2>
            <p>
              Subscription fees are billed in advance on a monthly or annual basis. All payments are processed securely through Stripe. Refunds are provided according to our refund policy.
            </p>

            <h2>6. Acceptable Use</h2>
            <p>
              You agree not to use the Service to:
            </p>
            <ul>
              <li>Generate harmful, illegal, or malicious content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to reverse engineer or compromise the platform</li>
            </ul>

            <h2>7. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by PromptForge™ and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>8. Content Ownership</h2>
            <p>
              You retain ownership of content you create using the Service. However, you grant us a license to use, store, and process your content to provide the Service.
            </p>

            <h2>9. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>

            <h2>10. Service Availability</h2>
            <p>
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted access to the Service. Scheduled maintenance will be announced in advance when possible.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              In no event shall PromptForge™ be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.
            </p>

            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be interpreted and governed by the laws of the State of California, without regard to its conflict of law provisions.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul>
              <li>Email: legal@chatgpt-prompting.com</li>
              <li>Address: 123 Innovation Drive, San Francisco, CA 94105</li>
            </ul>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-0">
                <strong>Effective Date:</strong> These terms are effective as of December 1, 2024, and will remain in effect except with respect to any changes in their provisions in the future, which will be in effect immediately after being posted on this page.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TermsPage


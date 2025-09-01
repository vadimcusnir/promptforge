import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - PromptForge',
  description: 'Privacy Policy for PromptForge AI prompt engineering platform',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-300 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                <p className="text-gray-300 mb-4">
                  PromptForge is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI prompt engineering platform.
                </p>
                <p className="text-gray-300 mb-4">
                  This policy complies with applicable data protection laws, including GDPR and CCPA.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                <p className="text-gray-300 mb-4">
                  We collect personal information including email address, usage data, technical data, and payment information (processed by Stripe).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-300 mb-4">
                  We use your information to provide our service, manage your account, communicate with you, analyze usage patterns, and ensure security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">4. Your Rights (GDPR)</h2>
                <p className="text-gray-300 mb-4">
                  You have rights to access, rectify, erase, restrict, port, and object to processing of your personal data. Contact us at privacy@promptforge.ai to exercise these rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
                <p className="text-gray-300 mb-4">
                  We implement encryption, access controls, and other security measures to protect your personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-300">
                    <strong>Data Protection Officer:</strong> privacy@promptforge.ai<br />
                    <strong>General Inquiries:</strong> support@promptforge.ai
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
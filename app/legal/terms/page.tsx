import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - PromptForge',
  description: 'Terms of Service for PromptForge AI prompt engineering platform',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-300 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-300 mb-4">
                  By accessing and using PromptForge ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                <p className="text-gray-300 mb-4">
                  PromptForge is an AI-powered prompt engineering platform that helps users create, optimize, and test prompts for various AI models. The service includes:
                </p>
                <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                  <li>Prompt generation and optimization tools</li>
                  <li>AI model testing and scoring</li>
                  <li>Export capabilities in multiple formats</li>
                  <li>Cloud-based prompt history and management</li>
                  <li>Analytics and performance tracking</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts and Responsibilities</h2>
                <p className="text-gray-300 mb-4">
                  To use certain features of the Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use Policy</h2>
                <p className="text-gray-300 mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                  <li>Generate harmful, illegal, or inappropriate content</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Attempt to gain unauthorized access to the Service</li>
                  <li>Use the Service for commercial purposes without proper licensing</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                <p className="text-gray-300 mb-4">
                  The Service and its original content, features, and functionality are owned by PromptForge and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p className="text-gray-300 mb-4">
                  You retain ownership of prompts and content you create using the Service, but grant us a license to store, process, and display such content as necessary to provide the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">6. Privacy and Data Protection</h2>
                <p className="text-gray-300 mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                </p>
                <p className="text-gray-300 mb-4">
                  We comply with applicable data protection laws, including GDPR, and provide you with rights to access, rectify, and delete your personal data.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">7. Payment Terms</h2>
                <p className="text-gray-300 mb-4">
                  Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We may change our pricing with 30 days' notice.
                </p>
                <p className="text-gray-300 mb-4">
                  You are responsible for all taxes associated with your use of the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">8. Service Availability</h2>
                <p className="text-gray-300 mb-4">
                  We strive to maintain high service availability but do not guarantee uninterrupted access. We may temporarily suspend the Service for maintenance, updates, or other operational reasons.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-300 mb-4">
                  To the maximum extent permitted by law, PromptForge shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
                <p className="text-gray-300 mb-4">
                  We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
                <p className="text-gray-300 mb-4">
                  You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to Terms</h2>
                <p className="text-gray-300 mb-4">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
                <p className="text-gray-300 mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-300">
                    <strong>Email:</strong> legal@promptforge.ai<br />
                    <strong>Address:</strong> [Company Address]<br />
                    <strong>Phone:</strong> [Contact Phone]
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
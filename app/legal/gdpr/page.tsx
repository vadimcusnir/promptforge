import Link from "next/link"
import { ChevronRight, Shield, Lock, Eye, Download, Trash2, FileText } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'GDPR Compliance - PromptForge™ v3',
  description: 'GDPR compliance information and data protection rights for PromptForge™ v3',
}

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gold-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/legal" className="hover:text-gold-400 transition-colors">
              Legal
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">GDPR</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="w-16 h-16 text-gold-400 " />
              <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-xl " />
            </div>
          </div>
          <p className="text-gray-400 text-lg mb-4 italic">"Your data rights are fundamental. We respect them."</p>
          <h1 className="text-5xl font-bold font-montserrat text-white mb-4">GDPR Compliance</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Your rights under the General Data Protection Regulation.</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-12 max-w-5xl mx-auto">
          <div className="lg:col-span-8 space-y-12">
            {/* Your Rights */}
            <section>
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Your Data Protection Rights</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Under GDPR, you have the following rights regarding your personal data:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Right of Access:</strong> Request copies of your personal data and information about how it's processed
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Right to Rectification:</strong> Correct inaccurate or incomplete personal data
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Right to Erasure:</strong> Request deletion of your personal data under certain circumstances
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Right to Restrict Processing:</strong> Limit how we process your personal data
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Right to Object:</strong> Object to processing of your personal data for direct marketing
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Lawful Basis */}
            <section>
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Lawful Basis for Processing</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>We process your personal data based on the following lawful grounds:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Contract Performance:</strong> Processing necessary to provide our services under our Terms of Service
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Legitimate Interests:</strong> Improving our services, security monitoring, and fraud prevention
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Consent:</strong> Marketing communications and optional data collection (withdrawable at any time)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Legal Obligation:</strong> Compliance with applicable laws and regulations
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Categories */}
            <section>
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Categories of Personal Data</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>We process the following categories of personal data:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Identity Data:</strong> Name, email address, and account credentials
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Contact Data:</strong> Email address, billing address, and communication preferences
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Technical Data:</strong> IP address, browser type, device information, and usage patterns
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Usage Data:</strong> Information about how you use our services and generated content
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Marketing Data:</strong> Communication preferences and marketing interaction history
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Data Retention</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>We retain your personal data only as long as necessary:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Account Data:</strong> Retained while your account is active and for 30 days after deletion
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Usage Data:</strong> Retained for 2 years for service improvement and analytics
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Marketing Data:</strong> Retained until you withdraw consent or unsubscribe
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Legal Requirements:</strong> Some data may be retained longer to comply with legal obligations
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Transfers */}
            <section>
              <div className="flex items-center mb-6">
                <Download className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">International Data Transfers</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Your data may be transferred to and processed in countries outside the EEA:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Adequacy Decisions:</strong> Transfers to countries with adequate data protection levels
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Standard Contractual Clauses:</strong> EU-approved contractual safeguards for data transfers
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Binding Corporate Rules:</strong> Internal data protection policies for multinational transfers
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Certification Schemes:</strong> Third-party certifications ensuring adequate protection
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Exercising Your Rights */}
            <section>
              <div className="flex items-center mb-6">
                <Trash2 className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Exercising Your Rights</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>To exercise your GDPR rights, you can:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Account Settings:</strong> Update your data and preferences directly in your account
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Email Request:</strong> Send requests to our Data Protection Officer at the contact below
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Response Time:</strong> We will respond to your request within 30 days
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Identity Verification:</strong> We may need to verify your identity before processing requests
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="border-t border-gray-800 pt-8">
              <div className="space-y-4 text-gray-300">
                <p>
                  For GDPR-related questions or to exercise your rights, contact our Data Protection Officer at{" "}
                  <a
                    href="mailto:privacy@[EXAMPLE_DOMAIN_yourdomain.com]"
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    privacy@[EXAMPLE_DOMAIN_yourdomain.com]
                  </a>
                </p>
                <p>
                  You also have the right to lodge a complaint with your local data protection authority if you believe we have not handled your personal data in accordance with GDPR.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <Link href="/legal" className="text-gold-400 hover:text-gold-300 transition-colors">
                    ← Back to Legal Center
                  </Link>
                  <Link href="/legal/privacy" className="text-gold-400 hover:text-gold-300 transition-colors">
                    Privacy Policy →
                  </Link>
                </div>
                <p className="text-sm text-gray-500">Last updated: January 2025</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

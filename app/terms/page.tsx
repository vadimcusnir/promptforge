import Link from "next/link"
import { ChevronRight, FileText, Shield, Lock, AlertTriangle, Scale } from "lucide-react"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - PromptForge™ v3',
  description: 'Terms of service and usage agreement for PromptForge™ v3',
}

export default function TermsPage() {
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
            <span className="text-white">Terms of Service</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <FileText className="w-16 h-16 text-gold-400 " />
              <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-xl " />
            </div>
          </div>
          <p className="text-gray-400 text-lg mb-4 italic">"Clear terms for professional use."</p>
          <h1 className="text-5xl font-bold font-montserrat text-white mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Terms and conditions for using PromptForge™ v3.</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-12 max-w-5xl mx-auto">
          <div className="lg:col-span-8 space-y-12">
            {/* Acceptance of Terms */}
            <section>
              <div className="flex items-center mb-6">
                <Scale className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>By accessing and using PromptForge™ v3, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                <p>If you do not agree with any of these terms, you are prohibited from using or accessing this service.</p>
                <p>These terms constitute a legally binding agreement between you and PromptForge™ v3.</p>
              </div>
            </section>

            {/* Service Description */}
            <section>
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Service Description</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>PromptForge™ v3 provides industrial-grade prompt engineering tools, modules, and export capabilities for professional use.</p>
                <p>Our service includes:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>AI-powered prompt generation using 50 specialized modules</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>7D parameter engine for precise prompt configuration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Quality scoring and evaluation tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Professional export formats (PDF, JSON, Markdown)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Cloud history and version control</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">User Responsibilities</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>As a user of PromptForge™ v3, you are responsible for:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Maintaining the confidentiality of your account credentials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>All activities that occur under your account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Complying with all applicable laws and regulations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Using the service only for lawful purposes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Not attempting to reverse engineer or compromise our systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Respecting intellectual property rights of others</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Intellectual Property</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Intellectual property rights are protected as follows:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>PromptForge™ v3 retains all rights to its software, technology, and proprietary content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Users retain rights to their generated content and prompts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Our modules, templates, and algorithms are proprietary and protected</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>You may not copy, modify, or distribute our proprietary content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Fair use policies apply to generated content for personal and professional use</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Payment and Billing */}
            <section>
              <div className="flex items-center mb-6">
                <Scale className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Payment and Billing</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Payment terms and billing policies:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Subscription fees are billed in advance on a monthly or annual basis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>All fees are non-refundable except as required by law</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>We may change pricing with 30 days notice to existing subscribers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Failure to pay may result in service suspension or termination</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Free tier users are subject to usage limits and feature restrictions</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Limitation of Liability</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Important limitations on our liability:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>PromptForge™ v3 is provided "as is" without warranties of any kind</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>We are not liable for any damages arising from use of our service</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Our total liability is limited to the amount paid for the service in the 12 months preceding the claim</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>We are not responsible for third-party services or integrations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Users are responsible for backing up their data and content</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section>
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Termination</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Service termination policies:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>You may terminate your account at any time through your account settings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>We may suspend or terminate accounts for violations of these terms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Upon termination, your access to the service will cease immediately</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>We will retain your data for 30 days after termination for recovery purposes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>Provisions that by their nature should survive termination will remain in effect</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Legal Links */}
            <section className="border-t border-gray-800 pt-8">
              <div className="space-y-4 text-gray-300">
                <p>
                  For questions about these terms, contact us at{" "}
                  <a
                    href="mailto:legal@[EXAMPLE_DOMAIN_yourdomain.com]"
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    legal@[EXAMPLE_DOMAIN_yourdomain.com]
                  </a>
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

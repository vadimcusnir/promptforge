import Link from "next/link"
import { ChevronRight, Shield, Lock, Eye, Download, Trash2 } from "lucide-react"

export default function PrivacyPage() {
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
            <span>Legal</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Privacy</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="w-16 h-16 text-gold-400 animate-pulse" />
              <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-xl animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 text-lg mb-4 italic">"Your prompts are your power. We guard it."</p>
          <h1 className="text-5xl font-bold font-montserrat text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">We protect your data like it's semantic gold.</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-12 max-w-5xl mx-auto">
          <div className="lg:col-span-8 space-y-12">
            {/* What We Collect */}
            <section>
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">What We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>We collect only what's necessary to make PromptForge work effectively:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Prompt metadata:</strong> Module selections, parameter configurations, and generation
                      timestamps
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Generated prompts:</strong> Your final outputs for cloud history and version tracking
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Usage telemetry:</strong> Performance metrics, error logs, and feature usage patterns
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Account information:</strong> Email, workspace name, and subscription details
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Why We Collect */}
            <section>
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Why We Collect It</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Every piece of data serves a specific purpose:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Functionality:</strong> Enable cloud history, version control, and cross-device sync
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Analytics:</strong> Understand which modules are most valuable and improve the platform
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Security:</strong> Detect abuse, prevent unauthorized access, and maintain system
                      integrity
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Support:</strong> Troubleshoot issues and provide personalized assistance
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* How We Store It */}
            <section>
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">How We Store It</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Your data is protected with enterprise-grade security:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Encrypted storage:</strong> All data encrypted at rest using Supabase's AES-256 encryption
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Secure transmission:</strong> TLS 1.3 encryption for all data in transit
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Access controls:</strong> Row-level security ensures you only see your own data
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Regular backups:</strong> Automated backups with point-in-time recovery
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* What We Never Do */}
            <section>
              <div className="flex items-center mb-6">
                <Trash2 className="w-6 h-6 text-red-400 mr-3" />
                <h2 className="text-2xl font-bold text-red-400 font-montserrat">What We Never Do</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Your trust is sacred. We will never:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>
                      <strong>Sell your data:</strong> Your prompts and usage patterns are never sold to third parties
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>
                      <strong>Share without consent:</strong> No data sharing except with explicit permission or legal
                      requirement
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>
                      <strong>Train AI on your prompts:</strong> Your creative work remains yours, not training data
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>
                      <strong>Track across sites:</strong> No third-party tracking pixels or cross-site surveillance
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <div className="flex items-center mb-6">
                <Download className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Your Rights</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>You have complete control over your data:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Export everything:</strong> Download all your prompts, history, and metadata in JSON
                      format
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Delete your account:</strong> Permanent deletion within 30 days of request
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Anonymize data:</strong> Remove personal identifiers while keeping usage analytics
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Access transparency:</strong> See exactly what data we have about you
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Legal Links */}
            <section className="border-t border-gray-800 pt-8">
              <div className="space-y-4 text-gray-300">
                <p>
                  This policy complies with GDPR, CCPA, and other privacy regulations. For questions or data requests,
                  contact us at{" "}
                  <a
                    href="mailto:legal@promptforge.com"
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    legal@promptforge.com
                  </a>
                </p>
                <p className="text-sm text-gray-500">Last updated: January 2025</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

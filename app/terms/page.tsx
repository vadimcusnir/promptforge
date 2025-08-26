"use client"

import Link from "next/link"
import { ChevronRight, Scale, CheckCircle, XCircle, RefreshCw, Mail } from "lucide-react"

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
            <span>Legal</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Terms</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Scale className="w-16 h-16 text-gold-400 animate-pulse" />
              <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-xl animate-pulse" />
              {/* Term Verified Seal */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center animate-spin-slow">
                <CheckCircle className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold font-montserrat text-gold-400 mb-4">Terms of Use</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Use the Forge. Don't abuse the Forge.</p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Description of Service</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>PromptForge is an industrial-grade prompt generation platform that provides:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-gold-400 mr-2">•</span>
                  <span>50 specialized modules across 7 vectors for systematic prompt engineering</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-400 mr-2">•</span>
                  <span>7D Parameter Engine for precise prompt configuration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-400 mr-2">•</span>
                  <span>Cloud history, versioning, and export capabilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-400 mr-2">•</span>
                  <span>Enterprise API access and white-label solutions</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Usage Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Usage Rights</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>You may use PromptForge for:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Personal use:</strong> Individual prompt generation and experimentation
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Team collaboration:</strong> Shared workspaces and prompt libraries
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Commercial projects:</strong> Using generated prompts in your business
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Educational purposes:</strong> Teaching and learning prompt engineering
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Plan Entitlements */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Plan Entitlements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-3">Free & Creator</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Module access (limited/full)</li>
                  <li>• Basic exports (txt/md)</li>
                  <li>• Local history</li>
                  <li>• Community support</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 border border-gold-400/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gold-400 mb-3">Pro & Enterprise</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• All modules + live testing</li>
                  <li>• Advanced exports (PDF/JSON)</li>
                  <li>• Cloud history & API access</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Limitations */}
          <section>
            <h2 className="text-2xl font-bold text-red-400 font-montserrat mb-6">Limitations</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>You may NOT use PromptForge for:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Prompt reselling:</strong> Redistributing generated prompts as a commercial product
                  </span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>AI scraping:</strong> Automated data extraction or reverse engineering
                  </span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>System abuse:</strong> Excessive API calls, spam, or malicious activity
                  </span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Illegal content:</strong> Generating prompts for harmful or illegal purposes
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Refunds & Support */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Refunds & Support</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <div className="flex items-start">
                  <RefreshCw className="w-5 h-5 text-gold-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white mb-2">7-Day Refund Policy</h3>
                    <p className="text-sm">
                      Pro and Enterprise subscribers can request a full refund within 7 days of purchase. No questions
                      asked, no usage limits.
                    </p>
                  </div>
                </div>
              </div>
              <p>
                For support requests, billing issues, or refunds, contact us at{" "}
                <a href="mailto:legal@promptforge.com" className="text-gold-400 hover:text-gold-300 transition-colors">
                  legal@promptforge.com
                </a>
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-red-400 font-montserrat mb-6">Termination</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We may terminate your account if you violate these terms, including:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Repeated system abuse or API violations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Commercial redistribution of prompts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Fraudulent billing or chargebacks</span>
                </li>
              </ul>
              <p>You may terminate your account at any time from your dashboard settings.</p>
            </div>
          </section>

          {/* Quick Links & Back to Top */}
          <section className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/privacy" className="text-gold-400 hover:text-gold-300 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/contact" className="text-gold-400 hover:text-gold-300 transition-colors">
                  Contact
                </Link>
                <a
                  href="mailto:legal@promptforge.com"
                  className="text-gold-400 hover:text-gold-300 transition-colors flex items-center"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  legal@promptforge.com
                </a>
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-gray-400 hover:text-gold-400 transition-colors text-sm flex items-center"
              >
                Back to top ↑
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-6">Last updated: January 2025</p>
          </section>
        </div>
      </div>
    </div>
  )
}

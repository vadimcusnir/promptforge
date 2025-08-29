"use client"

import Link from "next/link"
import { ChevronRight, Shield, FileText, CheckCircle, AlertTriangle, Users, Database, Lock } from "lucide-react"

export default function DPAPage() {
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
            <span className="text-white">Data Processing Agreement</span>
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
          <h1 className="text-5xl font-bold font-montserrat text-gold-400 mb-4">Data Processing Agreement</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Enterprise-grade data protection and GDPR compliance for your organization
          </p>
          <div className="mt-6 flex justify-center">
            <Badge className="bg-green-600 text-white px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              GDPR Article 28 Compliant
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Introduction</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                This Data Processing Agreement ("DPA") forms part of the Terms of Service between PromptForge ("Data Processor") 
                and the Enterprise customer ("Data Controller") for the processing of personal data in connection with the 
                PromptForge services.
              </p>
              <p>
                This DPA is designed to ensure compliance with GDPR Article 28 requirements and provides the necessary 
                safeguards for data processing activities.
              </p>
            </div>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Definitions</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-3">
                <div>
                  <h4 className="font-bold text-gold-400">Personal Data</h4>
                  <p className="text-sm">Any information relating to an identified or identifiable natural person</p>
                </div>
                <div>
                  <h4 className="font-bold text-gold-400">Processing</h4>
                  <p className="text-sm">Any operation performed on personal data (collection, recording, organization, etc.)</p>
                </div>
                <div>
                  <h4 className="font-bold text-gold-400">Data Subject</h4>
                  <p className="text-sm">The individual whose personal data is being processed</p>
                </div>
                <div>
                  <h4 className="font-bold text-gold-400">Sub-processor</h4>
                  <p className="text-sm">Any third party engaged by PromptForge to process personal data</p>
                </div>
              </div>
            </div>
          </section>

          {/* Processing Details */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Processing Details</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h4 className="font-bold text-white mb-3">Nature and Purpose of Processing</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Prompt generation and optimization services</li>
                  <li>• User authentication and account management</li>
                  <li>• Usage analytics and service improvement</li>
                  <li>• Technical support and customer service</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h4 className="font-bold text-white mb-3">Types of Personal Data</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Contact information (email, name, organization)</li>
                  <li>• Usage data and preferences</li>
                  <li>• Technical data (IP addresses, device information)</li>
                  <li>• Generated prompts and configurations</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h4 className="font-bold text-white mb-3">Data Subject Categories</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Enterprise users and administrators</li>
                  <li>• End users of generated prompts</li>
                  <li>• Technical support personnel</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Processor Obligations */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Data Processor Obligations</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h4 className="font-bold text-green-400 mb-3">Security Measures</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Encryption at rest and in transit</li>
                    <li>• Access controls and authentication</li>
                    <li>• Regular security assessments</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h4 className="font-bold text-green-400 mb-3">Data Protection</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• PII detection and redaction</li>
                    <li>• Data minimization practices</li>
                    <li>• Retention policy enforcement</li>
                    <li>• Regular data audits</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sub-processors */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Sub-processors</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                PromptForge engages the following sub-processors to provide the service:
              </p>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-4">
                <div>
                  <h4 className="font-bold text-white mb-2">Infrastructure & Hosting</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Vercel (hosting and CDN)</li>
                    <li>• Supabase (database and authentication)</li>
                    <li>• AWS (file storage and processing)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Analytics & Monitoring</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Sentry (error monitoring)</li>
                    <li>• Google Analytics (usage analytics)</li>
                    <li>• Stripe (payment processing)</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-400">
                  All sub-processors are bound by data protection agreements and GDPR compliance requirements.
                </p>
              </div>
            </div>
          </section>

          {/* Data Subject Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Data Subject Rights</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                PromptForge supports the following data subject rights as required by GDPR:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 w-5 text-green-400" />
                  <span>Right to Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 w-5 text-green-400" />
                  <span>Right to Rectification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 w-5 text-green-400" />
                  <span>Right to Erasure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 w-5 text-green-400" />
                  <span>Right to Portability</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 w-5 text-green-400" />
                  <span>Right to Restriction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 w-5 text-green-400" />
                  <span>Right to Object</span>
                </div>
              </div>
            </div>
          </section>

          {/* Data Breach Procedures */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Data Breach Procedures</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h4 className="font-bold text-red-400 mb-3">Incident Response</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Immediate containment and assessment</li>
                  <li>• Notification within 72 hours of detection</li>
                  <li>• Detailed incident documentation</li>
                  <li>• Remediation and prevention measures</li>
                </ul>
              </div>
              <p>
                PromptForge will notify the Data Controller of any data breach without undue delay and provide 
                all necessary information to comply with GDPR Article 33.
              </p>
            </div>
          </section>

          {/* Audit Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Audit Rights</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                The Data Controller has the right to audit PromptForge's compliance with this DPA:
              </p>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-3">
                <div>
                  <h4 className="font-bold text-white mb-2">Audit Scope</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Data processing activities</li>
                    <li>• Security measures and controls</li>
                    <li>• Compliance documentation</li>
                    <li>• Sub-processor agreements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Audit Process</h4>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• 30 days advance notice required</li>
                    <li>• Conducted during business hours</li>
                    <li>• Confidentiality obligations apply</li>
                    <li>• Results shared within 30 days</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Termination</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Upon termination of the service agreement:
              </p>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-3">
                <div>
                  <h4 className="font-bold text-white mb-2">Data Return</h4>
                  <p className="text-sm">
                    All personal data will be returned to the Data Controller in a structured, commonly used format 
                    within 30 days of termination.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Data Deletion</h4>
                  <p className="text-sm">
                    After data return, all copies of personal data will be securely deleted from PromptForge systems 
                    and confirmed in writing.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Ongoing Obligations</h4>
                  <p className="text-sm">
                    PromptForge will continue to protect any personal data that cannot be immediately deleted due to 
                    technical or legal requirements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gold-400 font-montserrat mb-6">Contact Information</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h4 className="font-bold text-white mb-3">Data Protection Officer</h4>
                <p className="text-sm mb-2">
                  For questions about this DPA or data protection matters:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> dpo@[EXAMPLE_DOMAIN_yourdomain.com]</p>
                  <p><strong>Address:</strong> [Company Address]</p>
                  <p><strong>Phone:</strong> [Contact Number]</p>
                </div>
              </div>
            </div>
          </section>

          {/* Essential Links & Back to Top */}
          <section className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/legal/privacy" className="text-gold-400 hover:text-gold-300 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/legal/terms" className="text-gold-400 hover:text-gold-300 transition-colors">
                  Terms of Use
                </Link>
                <Link href="/legal" className="text-gold-400 hover:text-gold-300 transition-colors">
                  Legal Center
                </Link>
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

// Badge component for the header
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      {children}
    </span>
  );
}

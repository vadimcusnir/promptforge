import Link from "next/link"
import { ChevronRight, Shield, Lock, Eye, Download, Trash2, AlertTriangle } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Security Policy - PromptForge™ v3',
  description: 'Security measures and data protection policies for PromptForge™ v3',
}

export default function SecurityPage() {
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
            <span className="text-white">Security</span>
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
          <p className="text-gray-400 text-lg mb-4 italic">"Security is not optional. It's fundamental."</p>
          <h1 className="text-5xl font-bold font-montserrat text-white mb-4">Security Policy</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Enterprise-grade security for your prompt engineering workflows.</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-12 max-w-5xl mx-auto">
          <div className="lg:col-span-8 space-y-12">
            {/* Infrastructure Security */}
            <section>
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Infrastructure Security</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Our infrastructure is built on enterprise-grade security foundations:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Cloud Infrastructure:</strong> Hosted on Vercel with global CDN and DDoS protection
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Database Security:</strong> Supabase with AES-256 encryption at rest and TLS 1.3 in transit
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Access Controls:</strong> Row-level security (RLS) ensures data isolation between organizations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Backup Strategy:</strong> Automated daily backups with point-in-time recovery capabilities
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Authentication & Authorization */}
            <section>
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Authentication & Authorization</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Multi-layered authentication and authorization controls:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>OAuth Integration:</strong> Secure authentication via Google, GitHub, and email/password
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>JWT Tokens:</strong> Stateless authentication with configurable expiration
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Role-Based Access:</strong> Granular permissions based on subscription tier and user role
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Session Management:</strong> Secure session handling with automatic timeout and refresh
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Protection */}
            <section>
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Data Protection</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Comprehensive data protection measures:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Encryption:</strong> All data encrypted at rest (AES-256) and in transit (TLS 1.3)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Data Minimization:</strong> We collect only what's necessary for service functionality
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Retention Policies:</strong> Automatic data purging based on configurable retention periods
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Data Residency:</strong> Data stored in compliance with regional data protection laws
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Monitoring & Incident Response */}
            <section>
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Monitoring & Incident Response</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>Proactive monitoring and rapid incident response:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Real-time Monitoring:</strong> 24/7 system monitoring with automated alerting
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Security Logging:</strong> Comprehensive audit logs for all system activities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Incident Response:</strong> Documented procedures for security incident handling
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>Vulnerability Management:</strong> Regular security assessments and penetration testing
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Compliance */}
            <section>
              <div className="flex items-center mb-6">
                <Download className="w-6 h-6 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-gold-400 font-montserrat">Compliance & Certifications</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>We maintain compliance with industry standards and regulations:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>GDPR Compliance:</strong> Full compliance with EU General Data Protection Regulation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>CCPA Compliance:</strong> California Consumer Privacy Act compliance for US users
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>SOC 2 Type II:</strong> Security controls audited by independent third parties
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-400 mr-2">•</span>
                    <span>
                      <strong>ISO 27001:</strong> Information security management system certification
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Security Contact */}
            <section className="border-t border-gray-800 pt-8">
              <div className="space-y-4 text-gray-300">
                <p>
                  For security concerns, vulnerability reports, or questions about our security practices, contact us at{" "}
                  <a
                    href="mailto:security@[EXAMPLE_DOMAIN_yourdomain.com]"
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    security@[EXAMPLE_DOMAIN_yourdomain.com]
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

import { Shield, Lock, Eye, Download, Trash2, UserCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - PromptForge™',
  description: 'We protect your data like it\'s semantic gold. Learn how PromptForge™ safeguards your prompts and personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto px-4 py-6" aria-label="Breadcrumb">
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
            Privacy
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <main className="max-w-[720px] mx-auto px-4 pb-16">
        {/* Header Section */}
        <header className="text-center mb-16">
          {/* Animated Legal Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Shield className="w-20 h-20 text-foreground animate-pulse" />
              <Lock className="w-8 h-8 text-foreground absolute -bottom-2 -right-2 animate-bounce" />
            </div>
          </div>
          
          {/* Narrative Quote */}
          <blockquote className="text-lg text-gray-400 mb-8 italic">
            "Your prompts are your power. We guard it."
          </blockquote>
          
          <h1 className="text-4xl font-bold mb-4 text-white">
            Privacy Policy
          </h1>
          <p className="text-xl text-foreground font-medium">
            We protect your data like it's semantic gold.
          </p>
        </header>

        {/* Content Grid */}
        <div className="grid gap-12">
          {/* What We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
              <Eye className="w-6 h-6 text-foreground" />
              What We Collect
            </h2>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                We collect only what's necessary to make PromptForge™ work for you:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Metadata:</strong> Account info, usage patterns, and preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Prompts:</strong> Your AI prompts and generated content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Telemetry:</strong> Performance data to improve your experience</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Why We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
              <Shield className="w-6 h-6 text-foreground" />
              Why We Collect It
            </h2>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                Every piece of data serves a purpose in making PromptForge™ better:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Functionality:</strong> To save your work and personalize your experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Analytics:</strong> To identify and fix issues, improve performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Security:</strong> To protect your account and detect threats</span>
                </li>
              </ul>
            </div>
          </section>

          {/* How We Store */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
              <Lock className="w-6 h-6 text-foreground" />
              How We Store It
            </h2>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                Your data is protected with enterprise-grade security:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Supabase Encrypted Storage:</strong> All data encrypted at rest and in transit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Access Controls:</strong> Role-based permissions and audit logging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Regular Backups:</strong> Automated backups with point-in-time recovery</span>
                </li>
              </ul>
            </div>
          </section>

          {/* What We Never Do */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
              <Shield className="w-6 h-6 text-foreground" />
              What We Never Do
            </h2>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                We have strict boundaries that we never cross:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Sell Your Data:</strong> We never sell, rent, or monetize your personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Share Without Consent:</strong> No third-party access without explicit permission</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Use for Training:</strong> Your prompts are never used to train AI models</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-foreground" />
              Your Rights
            </h2>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                You have complete control over your data:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Export:</strong> Download all your data in standard formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Delete:</strong> Remove your account and all associated data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span><strong>Anonymize:</strong> Request data anonymization while keeping functionality</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact & Legal */}
          <section className="border-t border-gray-800 pt-8">
            <h2 className="text-2xl font-semibold mb-6 text-white">
              Contact & Legal
            </h2>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                For privacy questions or to exercise your rights:
              </p>
              <div className="space-y-3">
                <p>
                  <strong>Legal Team:</strong>{' '}
                  <a 
                    href="mailto:legal@chatgpt-prompting.com" 
                    className="text-foreground hover:text-foreground/80 underline transition-colors"
                  >
                    legal@chatgpt-prompting.com
                  </a>
                </p>
                <p>
                  <strong>GDPR Compliance:</strong>{' '}
                  <a 
                    href="https://gdpr.eu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-foreground/80 underline transition-colors"
                  >
                    Learn about your GDPR rights
                  </a>
                </p>
                <p>
                  <strong>Data Protection Officer:</strong> Available for EU residents upon request
                </p>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <footer className="text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p className="mt-2">
              PromptForge™ - Protecting your semantic gold since 2024
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

import { FileText, Shield, Scale, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Legal - PromptForge™',
  description: 'Legal documents and policies for PromptForge™. Privacy policy, terms of service, and legal information.',
};

export default function LegalPage() {
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
          <li className="text-foreground" aria-current="page">
            Legal
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <main className="max-w-[720px] mx-auto px-4 pb-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="mb-8 flex justify-center">
            <Scale className="w-20 h-20 text-foreground" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 text-white">
            Legal
          </h1>
          <p className="text-xl text-foreground font-medium">
            Transparency and trust in every document
          </p>
        </header>

        {/* Legal Documents Grid */}
        <div className="grid gap-8">
          {/* Privacy Policy */}
          <div className="border border-gray-800 rounded-lg p-6 hover:border-border transition-colors">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-foreground mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Privacy Policy
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Learn how we protect your data and respect your privacy rights. 
                  We collect only what's necessary and never share without consent.
                </p>
                <Link 
                  href="/privacy" 
                  className="inline-flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors font-medium"
                >
                  Read Privacy Policy
                  <FileText className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Terms of Service */}
          <div className="border border-gray-800 rounded-lg p-6 hover:border-border transition-colors">
            <div className="flex items-start gap-4">
              <FileText className="w-8 h-8 text-foreground mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Terms of Service
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Clear terms for using PromptForge™ services. Use the Forge. Don't abuse the Forge.
                </p>
                <Link 
                  href="/terms" 
                  className="inline-flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors font-medium"
                >
                  Read Terms of Service
                  <FileText className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Legal Team */}
          <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/20">
            <div className="flex items-start gap-4">
              <Mail className="w-8 h-8 text-foreground mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Contact Legal Team
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Have questions about our legal documents or need to exercise your rights? 
                  Our legal team is here to help.
                </p>
                <a 
                  href="mailto:legal@chatgpt-prompting.com" 
                  className="inline-flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors font-medium"
                >
                  legal@chatgpt-prompting.com
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-16 pt-8 border-t border-gray-800">
          <p>
            PromptForge™ - Legal documents updated regularly to ensure compliance and transparency
          </p>
        </footer>
      </main>
    </div>
  );
}

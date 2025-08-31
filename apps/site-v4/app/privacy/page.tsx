export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 font-mono">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">1. Information We Collect</h2>
                <p className="text-slate-300 leading-relaxed">
                  We collect information you provide directly to us, such as when you create an account, use our
                  services, or contact us for support.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">2. How We Use Your Information</h2>
                <p className="text-slate-300 leading-relaxed">
                  We use the information we collect to provide, maintain, and improve our services, process
                  transactions, and communicate with you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">3. Information Sharing</h2>
                <p className="text-slate-300 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your
                  consent, except as described in this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">4. Data Security</h2>
                <p className="text-slate-300 leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">5. Contact Us</h2>
                <p className="text-slate-300 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us through our support channels.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

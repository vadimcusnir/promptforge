export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 font-mono">Terms of Service</h1>
          <div className="prose prose-invert max-w-none">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-300 leading-relaxed">
                  By accessing and using PromptForge™, you accept and agree to be bound by the terms and provision of
                  this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">2. Service Description</h2>
                <p className="text-slate-300 leading-relaxed">
                  PromptForge™ is an operational prompt engine that provides industrial-grade AI prompt generation
                  through a 7-D framework and 50 specialized modules.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">3. User Responsibilities</h2>
                <p className="text-slate-300 leading-relaxed">
                  Users are responsible for maintaining the confidentiality of their account credentials and for all
                  activities that occur under their account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">4. Intellectual Property</h2>
                <p className="text-slate-300 leading-relaxed">
                  All content, features, and functionality of PromptForge™ are owned by us and are protected by
                  international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">5. Limitation of Liability</h2>
                <p className="text-slate-300 leading-relaxed">
                  PromptForge™ shall not be liable for any indirect, incidental, special, consequential, or punitive
                  damages resulting from your use of the service.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

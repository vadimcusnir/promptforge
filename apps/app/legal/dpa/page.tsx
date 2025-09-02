import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Data Processing Agreement | PromptForge",
  description: "Data Processing Agreement for enterprise customers and GDPR compliance.",
  robots: "index, follow",
}

export default function DPAPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="text-sm text-gray-400 mb-8">
          <a href="/" className="hover:text-[#d1a954] transition-colors">
            Home
          </a>
          <span className="mx-2">/</span>
          <a href="/legal" className="hover:text-[#d1a954] transition-colors">
            Legal
          </a>
          <span className="mx-2">/</span>
          <span className="text-white">DPA</span>
        </nav>

        <div className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-[#d1a954] mb-8">Data Processing Agreement</h1>
          <p className="text-xl text-gray-300 mb-12">Enterprise-grade data protection and compliance framework.</p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Agreement Scope</h2>
            <p className="text-gray-300 leading-relaxed">
              This Data Processing Agreement (DPA) applies to Enterprise customers and governs the processing of
              personal data in accordance with GDPR, CCPA, and other applicable data protection regulations.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Data Controller vs Processor</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-[#d1a954] font-semibold mb-3">Customer (Controller)</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Determines purposes of data processing</li>
                  <li>• Provides lawful basis for processing</li>
                  <li>• Handles data subject requests</li>
                  <li>• Ensures data accuracy and consent</li>
                </ul>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-[#d1a954] font-semibold mb-3">PromptForge (Processor)</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Processes data per customer instructions</li>
                  <li>• Implements technical safeguards</li>
                  <li>• Assists with compliance obligations</li>
                  <li>• Maintains processing records</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Security Measures</h2>
            <div className="bg-blue-900/20 border border-blue-800 p-6 rounded-lg">
              <ul className="text-gray-300 space-y-2">
                <li>• End-to-end encryption for data in transit and at rest</li>
                <li>• Multi-factor authentication and access controls</li>
                <li>• Regular security audits and penetration testing</li>
                <li>• SOC 2 Type II compliance and monitoring</li>
                <li>• Incident response and breach notification procedures</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Data Transfers</h2>
            <p className="text-gray-300 leading-relaxed">
              Data processing occurs within EU/EEA regions. Any transfers to third countries are protected by Standard
              Contractual Clauses (SCCs) and additional safeguards as required by applicable law.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Sub-processors</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-800 rounded-lg">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="text-left p-4 text-[#d1a954]">Service</th>
                    <th className="text-left p-4 text-[#d1a954]">Provider</th>
                    <th className="text-left p-4 text-[#d1a954]">Purpose</th>
                    <th className="text-left p-4 text-[#d1a954]">Location</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-t border-gray-800">
                    <td className="p-4">Database</td>
                    <td className="p-4">Supabase</td>
                    <td className="p-4">Data storage and processing</td>
                    <td className="p-4">EU/US</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="p-4">Hosting</td>
                    <td className="p-4">Vercel</td>
                    <td className="p-4">Application hosting</td>
                    <td className="p-4">Global</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="p-4">Analytics</td>
                    <td className="p-4">Google Analytics</td>
                    <td className="p-4">Usage analytics</td>
                    <td className="p-4">Global</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              Personal data is retained only as long as necessary for the purposes outlined in our Privacy Policy or as
              required by law. Enterprise customers can specify custom retention periods in their service agreement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#d1a954] mb-4">Contact Information</h2>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <p className="text-gray-300 mb-4">
                <strong>Data Protection Officer:</strong>
                <br />
                Email:{" "}
                <a href="mailto:dpo@promptforge.com" className="text-[#d1a954] hover:underline">
                  dpo@promptforge.com
                </a>
              </p>
              <p className="text-gray-300">
                <strong>Legal Department:</strong>
                <br />
                Email:{" "}
                <a href="mailto:legal@promptforge.com" className="text-[#d1a954] hover:underline">
                  legal@promptforge.com
                </a>
              </p>
            </div>
          </section>

          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

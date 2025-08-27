import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - PromptForge™ v3',
  description: 'Terms of service and usage agreement for PromptForge™ v3',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen text-white relative z-10">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>

          <div className="bg-zinc-900/80 border border-zinc-700 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using PromptForge™ v3, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
            <p className="mb-4">
              If you do not agree with any of these terms, you are prohibited from using or accessing this service.
            </p>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-700 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
            <p className="mb-4">
              PromptForge™ v3 provides industrial-grade prompt engineering tools, modules, and export capabilities for professional use.
            </p>
            <p className="mb-4">
              Our service includes AI-powered prompt generation, quality scoring, and professional export formats.
            </p>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-700 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <p className="mb-4">
              Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.
            </p>
            <p className="mb-4">
              Users must comply with all applicable laws and regulations when using our service.
            </p>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-700 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p className="mb-4">
              PromptForge™ v3 retains all rights to its software, technology, and proprietary content.
            </p>
            <p className="mb-4">
              Users retain rights to their generated content and prompts, subject to our fair use policies.
            </p>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-700 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              PromptForge™ v3 is provided "as is" without warranties of any kind. We are not liable for any damages arising from use of our service.
            </p>
            <p className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

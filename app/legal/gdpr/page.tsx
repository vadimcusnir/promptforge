import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ForgeGlyphInteractive } from "@/components/forge/ForgeGlyphInteractive"

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/95 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center mb-6">
            <ForgeGlyphInteractive 
              status="ready" 
              size="md"
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              GDPR Compliance
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Your data rights and our commitment to privacy protection
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <Card className="bg-zinc-900/80 border border-zinc-700">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-white">Your Rights Under GDPR</CardTitle>
              <CardDescription className="text-gray-400">
                As a data subject, you have specific rights regarding your personal data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Right to Access</h3>
                <p className="text-gray-400">
                  You have the right to request copies of your personal data. We will provide this information 
                  within 30 days of your request.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Right to Rectification</h3>
                <p className="text-gray-400">
                  You have the right to request that we correct any inaccurate or incomplete personal data.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Right to Erasure</h3>
                <p className="text-gray-400">
                  You have the right to request that we delete your personal data under certain circumstances.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Right to Data Portability</h3>
                <p className="text-gray-400">
                  You have the right to request that we transfer your data to another organization or directly to you.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Right to Object</h3>
                <p className="text-gray-400">
                  You have the right to object to the processing of your personal data for certain purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/80 border border-zinc-700">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-white">Data Processing</CardTitle>
              <CardDescription className="text-gray-400">
                How we process and protect your personal data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Legal Basis</h3>
                <p className="text-gray-400">
                  We process your personal data based on legitimate interest for service provision, 
                  contract performance, and legal compliance.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Data Retention</h3>
                <p className="text-gray-400">
                  We retain your personal data only as long as necessary for the purposes outlined in our 
                  Privacy Policy or as required by law.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Data Security</h3>
                <p className="text-gray-400">
                  We implement appropriate technical and organizational measures to protect your personal data 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/80 border border-zinc-700">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-white">Contact Information</CardTitle>
              <CardDescription className="text-gray-400">
                How to exercise your rights or contact us about data protection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Data Protection Officer</h3>
                  <p className="text-gray-400">
                    Email: privacy@promptforge.ai
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">General Inquiries</h3>
                  <p className="text-gray-400">
                    Email: legal@promptforge.ai
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Response Time</h3>
                  <p className="text-gray-400">
                    We will respond to all GDPR-related requests within 30 days of receipt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
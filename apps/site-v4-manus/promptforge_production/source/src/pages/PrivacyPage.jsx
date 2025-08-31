import { Card } from '@/components/ui/card'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">Privacy Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Last updated: December 2024
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="card-industrial">
          <div className="p-8 prose prose-invert max-w-none">
            <h2>1. Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>
              When you create an account or use our services, we may collect:
            </p>
            <ul>
              <li>Name and email address</li>
              <li>Company information</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Profile preferences and settings</li>
            </ul>

            <h3>Usage Data</h3>
            <p>
              We automatically collect information about how you use PromptForge™:
            </p>
            <ul>
              <li>Module usage patterns and preferences</li>
              <li>Generated content metadata (not the content itself)</li>
              <li>Performance metrics and error logs</li>
              <li>Device and browser information</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the collected information to:
            </p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Improve our platform and develop new features</li>
              <li>Send important service updates and notifications</li>
              <li>Provide customer support</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>

            <h2>3. Content Privacy</h2>
            <p>
              Your generated content is private and secure:
            </p>
            <ul>
              <li>We do not read, analyze, or store your generated prompts or outputs</li>
              <li>Content is encrypted in transit and at rest</li>
              <li>You maintain full ownership of all content you create</li>
              <li>We only collect anonymized metadata for service improvement</li>
            </ul>

            <h2>4. Data Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal information. We may share information only in these limited circumstances:
            </p>
            <ul>
              <li><strong>Service Providers:</strong> Trusted third parties who assist in operating our platform (e.g., Stripe for payments)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard security measures:
            </p>
            <ul>
              <li>End-to-end encryption for all data transmission</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication protocols</li>
              <li>Secure data centers with 24/7 monitoring</li>
              <li>Regular backups with encryption</li>
            </ul>

            <h2>6. Data Retention</h2>
            <p>
              We retain your information only as long as necessary:
            </p>
            <ul>
              <li>Account data: Until you delete your account</li>
              <li>Usage analytics: Anonymized data for up to 2 years</li>
              <li>Payment records: As required by law (typically 7 years)</li>
              <li>Support communications: Up to 3 years</li>
            </ul>

            <h2>7. Your Rights and Choices</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access and download your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request data portability</li>
              <li>Object to certain data processing activities</li>
            </ul>

            <h2>8. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul>
              <li>Maintain your login session</li>
              <li>Remember your preferences</li>
              <li>Analyze platform usage (anonymized)</li>
              <li>Improve user experience</li>
            </ul>
            <p>
              You can control cookie settings through your browser preferences.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including:
            </p>
            <ul>
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Certification schemes and codes of conduct</li>
            </ul>

            <h2>10. Children's Privacy</h2>
            <p>
              PromptForge™ is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information immediately.
            </p>

            <h2>11. GDPR Compliance</h2>
            <p>
              For users in the European Union, we comply with GDPR requirements:
            </p>
            <ul>
              <li>Lawful basis for processing personal data</li>
              <li>Data Protection Officer available for inquiries</li>
              <li>Right to lodge complaints with supervisory authorities</li>
              <li>Data Protection Impact Assessments when required</li>
            </ul>

            <h2>12. California Privacy Rights (CCPA)</h2>
            <p>
              California residents have additional rights under the CCPA:
            </p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>

            <h2>13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by:
            </p>
            <ul>
              <li>Posting the new policy on this page</li>
              <li>Sending an email notification for material changes</li>
              <li>Providing in-app notifications</li>
            </ul>

            <h2>14. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, contact us:
            </p>
            <ul>
              <li>Email: privacy@chatgpt-prompting.com</li>
              <li>Data Protection Officer: dpo@chatgpt-prompting.com</li>
              <li>Address: 123 Innovation Drive, San Francisco, CA 94105</li>
            </ul>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-0">
                <strong>Effective Date:</strong> This Privacy Policy is effective as of December 1, 2024. Your continued use of PromptForge™ after any changes indicates your acceptance of the updated policy.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PrivacyPage


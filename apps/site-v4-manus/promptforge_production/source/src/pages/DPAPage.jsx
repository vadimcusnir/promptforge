import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Shield } from 'lucide-react'

const DPAPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">Data Processing Agreement</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Enterprise-grade data protection and compliance documentation
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="card-industrial text-center">
            <div className="p-6">
              <FileText className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Standard DPA</h3>
              <p className="text-muted-foreground mb-4">GDPR-compliant standard agreement</p>
              <Button className="btn-outline w-full">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </Card>

          <Card className="card-industrial text-center">
            <div className="p-6">
              <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Enterprise DPA</h3>
              <p className="text-muted-foreground mb-4">Customizable enterprise agreement</p>
              <Button className="btn-primary w-full">
                Request Custom DPA
              </Button>
            </div>
          </Card>

          <Card className="card-industrial text-center">
            <div className="p-6">
              <FileText className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Security Docs</h3>
              <p className="text-muted-foreground mb-4">SOC 2, ISO 27001 certificates</p>
              <Button className="btn-outline w-full">
                View Certificates
              </Button>
            </div>
          </Card>
        </div>

        <Card className="card-industrial">
          <div className="p-8 prose prose-invert max-w-none">
            <h2>Data Processing Agreement (DPA)</h2>
            <p className="lead">
              This Data Processing Agreement ("DPA") forms part of the PromptForge™ Terms of Service and governs the processing of personal data by PromptForge™ on behalf of its customers.
            </p>

            <h3>1. Definitions</h3>
            <p>
              For the purposes of this DPA:
            </p>
            <ul>
              <li><strong>"Controller"</strong> means the customer who determines the purposes and means of processing personal data</li>
              <li><strong>"Processor"</strong> means PromptForge™, which processes personal data on behalf of the Controller</li>
              <li><strong>"Personal Data"</strong> has the meaning set out in applicable Data Protection Laws</li>
              <li><strong>"Data Protection Laws"</strong> means GDPR, CCPA, and other applicable privacy regulations</li>
            </ul>

            <h3>2. Scope and Application</h3>
            <p>
              This DPA applies to the processing of personal data by PromptForge™ in the course of providing services under the Terms of Service, where such processing is subject to Data Protection Laws.
            </p>

            <h3>3. Data Processing Details</h3>
            
            <h4>Subject Matter</h4>
            <p>Processing of personal data necessary for the provision of PromptForge™ services.</p>

            <h4>Duration</h4>
            <p>For the duration of the service agreement and retention periods specified in our Privacy Policy.</p>

            <h4>Nature and Purpose</h4>
            <ul>
              <li>Account management and authentication</li>
              <li>Service delivery and platform operation</li>
              <li>Customer support and communication</li>
              <li>Billing and payment processing</li>
            </ul>

            <h4>Categories of Data Subjects</h4>
            <ul>
              <li>Customer employees and authorized users</li>
              <li>Customer contacts and administrators</li>
            </ul>

            <h4>Categories of Personal Data</h4>
            <ul>
              <li>Contact information (name, email, phone)</li>
              <li>Account credentials and preferences</li>
              <li>Usage data and analytics</li>
              <li>Billing and payment information</li>
            </ul>

            <h3>4. Processor Obligations</h3>
            <p>
              PromptForge™ shall:
            </p>
            <ul>
              <li>Process personal data only on documented instructions from the Controller</li>
              <li>Ensure confidentiality of personal data</li>
              <li>Implement appropriate technical and organizational security measures</li>
              <li>Assist with data subject rights requests</li>
              <li>Notify of personal data breaches without undue delay</li>
              <li>Delete or return personal data upon termination</li>
            </ul>

            <h3>5. Security Measures</h3>
            <p>
              PromptForge™ implements industry-standard security measures including:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Access controls and authentication</li>
              <li>Regular security assessments and audits</li>
              <li>Incident response procedures</li>
              <li>Employee training and background checks</li>
            </ul>

            <h3>6. Sub-processors</h3>
            <p>
              PromptForge™ may engage sub-processors to assist in providing services. Current sub-processors include:
            </p>
            <ul>
              <li>Amazon Web Services (hosting and infrastructure)</li>
              <li>Stripe (payment processing)</li>
              <li>SendGrid (email communications)</li>
            </ul>
            <p>
              We will provide 30 days' notice of any changes to sub-processors.
            </p>

            <h3>7. International Transfers</h3>
            <p>
              Personal data may be transferred to countries outside the EEA. We ensure adequate protection through:
            </p>
            <ul>
              <li>Standard Contractual Clauses approved by the European Commission</li>
              <li>Adequacy decisions</li>
              <li>Appropriate safeguards as required by GDPR</li>
            </ul>

            <h3>8. Data Subject Rights</h3>
            <p>
              PromptForge™ will assist the Controller in responding to data subject requests, including:
            </p>
            <ul>
              <li>Access to personal data</li>
              <li>Rectification of inaccurate data</li>
              <li>Erasure of personal data</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>

            <h3>9. Data Breach Notification</h3>
            <p>
              In case of a personal data breach, PromptForge™ will:
            </p>
            <ul>
              <li>Notify the Controller without undue delay (within 72 hours when possible)</li>
              <li>Provide all relevant information about the breach</li>
              <li>Assist with breach notification to supervisory authorities and data subjects</li>
              <li>Implement measures to mitigate the breach</li>
            </ul>

            <h3>10. Audits and Compliance</h3>
            <p>
              PromptForge™ will:
            </p>
            <ul>
              <li>Make available information necessary to demonstrate compliance</li>
              <li>Allow for and contribute to audits by the Controller or authorized auditor</li>
              <li>Maintain records of processing activities</li>
              <li>Provide compliance documentation upon request</li>
            </ul>

            <h3>11. Liability and Indemnification</h3>
            <p>
              Each party's liability under this DPA is subject to the limitation of liability provisions in the main service agreement.
            </p>

            <h3>12. Term and Termination</h3>
            <p>
              This DPA remains in effect for the duration of the service agreement. Upon termination, PromptForge™ will delete or return all personal data as instructed by the Controller.
            </p>

            <div className="mt-8 p-6 bg-muted/50 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">Need a Custom DPA?</h4>
              <p className="text-muted-foreground mb-4">
                Enterprise customers may require customized data processing agreements. Our legal team can work with you to create an agreement that meets your specific compliance requirements.
              </p>
              <Button className="btn-primary">
                Contact Legal Team
              </Button>
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm mb-0">
                <strong>Questions about this DPA?</strong> Contact our Data Protection Officer at dpo@chatgpt-prompting.com or our legal team at legal@chatgpt-prompting.com.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DPAPage


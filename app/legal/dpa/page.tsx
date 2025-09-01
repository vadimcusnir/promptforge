import { Metadata } from 'next'
import { LegalDocument } from '@/components/legal/LegalDocument'

export const metadata: Metadata = {
  title: 'Data Processing Agreement | PromptForge',
  description: 'Data Processing Agreement for PromptForge Enterprise customers',
  robots: 'index, follow'
}

const dpaContent = `
# Data Processing Agreement (DPA)

**Last Updated: January 27, 2025**

## 1. Definitions

**"Controller"** means the entity that determines the purposes and means of processing personal data.

**"Processor"** means PromptForge, which processes personal data on behalf of the Controller.

**"Personal Data"** means any information relating to an identified or identifiable natural person.

**"Processing"** means any operation performed on personal data, including collection, storage, use, and deletion.

**"Data Subject"** means the natural person to whom personal data relates.

## 2. Scope and Purpose

This Data Processing Agreement (DPA) governs the processing of personal data by PromptForge on behalf of Enterprise customers in accordance with applicable data protection laws, including the General Data Protection Regulation (GDPR).

## 3. Processing Details

### 3.1 Categories of Personal Data
PromptForge may process the following categories of personal data:
- Contact information (name, email address, phone number)
- Professional information (job title, company, department)
- Usage data (login times, feature usage, performance metrics)
- Content data (prompts, inputs, outputs created through the Service)
- Technical data (IP addresses, device information, browser data)

### 3.2 Categories of Data Subjects
- Employees and contractors of the Controller
- End users of the Controller's systems
- Business contacts and partners
- Customer service representatives

### 3.3 Processing Purposes
- Providing and maintaining the PromptForge platform
- Processing user requests and generating AI-powered content
- Managing user accounts and subscriptions
- Providing customer support and technical assistance
- Ensuring security and preventing fraud
- Complying with legal obligations

## 4. Processor Obligations

### 4.1 Processing Instructions
PromptForge shall:
- Process personal data only in accordance with documented instructions from the Controller
- Not process personal data for any purpose other than those specified in this DPA
- Immediately inform the Controller if any instruction violates applicable data protection laws

### 4.2 Confidentiality
PromptForge shall:
- Ensure that persons authorized to process personal data are bound by confidentiality obligations
- Maintain the confidentiality of all personal data processed under this DPA
- Not disclose personal data to any third party without the Controller's prior written consent

### 4.3 Security Measures
PromptForge shall implement appropriate technical and organizational measures to ensure:
- The confidentiality, integrity, and availability of personal data
- Protection against unauthorized or unlawful processing
- Protection against accidental loss, destruction, or damage
- Regular testing and evaluation of security measures

### 4.4 Sub-processors
PromptForge may engage sub-processors to assist in providing the Service, including:
- **Stripe**: Payment processing
- **Supabase**: Database and authentication services
- **Vercel**: Cloud hosting and content delivery
- **Sentry**: Error monitoring and performance tracking
- **Postmark**: Email delivery services

PromptForge shall:
- Maintain a list of sub-processors and notify the Controller of any changes
- Ensure sub-processors are bound by the same data protection obligations
- Remain fully liable for the performance of sub-processors

## 5. Controller Obligations

### 5.1 Lawful Basis
The Controller shall ensure that:
- It has a lawful basis for processing personal data
- Data subjects have been informed of the processing
- Any necessary consents have been obtained
- Processing is necessary for the legitimate interests pursued

### 5.2 Data Quality
The Controller shall ensure that:
- Personal data is accurate and up-to-date
- Personal data is adequate, relevant, and not excessive
- Personal data is processed fairly and lawfully

## 6. Data Subject Rights

### 6.1 Assistance with Rights
PromptForge shall assist the Controller in responding to data subject requests, including:
- Right of access to personal data
- Right to rectification of inaccurate data
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object to processing

### 6.2 Response Timeframes
PromptForge shall respond to data subject requests within 7 days as required by GDPR.

## 7. Data Breach Notification

### 7.1 Breach Detection
PromptForge shall:
- Implement appropriate measures to detect data breaches
- Monitor systems for unauthorized access or data loss
- Maintain incident response procedures

### 7.2 Notification Requirements
In the event of a data breach, PromptForge shall:
- Notify the Controller without undue delay and within 24 hours
- Provide detailed information about the breach
- Assist the Controller in meeting its notification obligations
- Cooperate with any investigation or remediation efforts

## 8. Data Transfers

### 8.1 International Transfers
PromptForge may transfer personal data to countries outside the EEA, ensuring appropriate safeguards including:
- Standard Contractual Clauses (SCCs) approved by the European Commission
- Adequacy decisions by the European Commission
- Binding Corporate Rules where applicable

### 8.2 Transfer Impact Assessments
PromptForge shall conduct transfer impact assessments and implement additional safeguards as necessary.

## 9. Data Retention and Deletion

### 9.1 Retention Periods
Personal data shall be retained only for as long as necessary for the purposes specified in this DPA:
- **Account Data**: Retained while the account is active
- **Usage Data**: Retained for up to 90 days for operational purposes
- **Audit Logs**: Retained for 18 months for compliance
- **Export Data**: Automatically deleted after 30 days

### 9.2 Deletion Procedures
Upon termination of this DPA or at the Controller's request, PromptForge shall:
- Delete or return all personal data to the Controller
- Provide certification of deletion
- Ensure that any copies are also deleted

## 10. Audits and Compliance

### 10.1 Audit Rights
The Controller has the right to:
- Audit PromptForge's compliance with this DPA
- Request documentation of security measures
- Conduct on-site inspections (with reasonable notice)

### 10.2 Compliance Certifications
PromptForge maintains the following certifications and compliance frameworks:
- SOC 2 Type II
- ISO 27001
- GDPR compliance
- Regular third-party security assessments

## 11. Liability and Indemnification

### 11.1 Liability Limitations
Each party's liability under this DPA shall be limited to direct damages and shall not exceed the total amount paid by the Controller to PromptForge in the 12 months preceding the claim.

### 11.2 Indemnification
Each party shall indemnify the other against claims arising from its breach of this DPA or applicable data protection laws.

## 12. Term and Termination

### 12.1 Term
This DPA shall remain in effect for as long as PromptForge processes personal data on behalf of the Controller.

### 12.2 Termination
Either party may terminate this DPA with 30 days' written notice. Upon termination, all personal data shall be returned or deleted as specified in Section 9.

## 13. Governing Law

This DPA shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to conflict of law principles.

## 14. Contact Information

For questions about this DPA or data protection matters, please contact:

- **Data Protection Officer**: dpo@promptforge.cloud
- **Privacy Team**: privacy@promptforge.cloud
- **Address**: [Company Address]

## 15. Amendments

This DPA may be amended by mutual written agreement of the parties. Any amendments shall be documented and signed by authorized representatives of both parties.

## 16. Severability

If any provision of this DPA is found to be unenforceable, the remaining provisions shall remain in full force and effect.

## 17. Entire Agreement

This DPA, together with the Terms of Service and Privacy Policy, constitutes the entire agreement between the parties regarding data processing.
`

export default function DPAPage() {
  return (
    <LegalDocument
      title="Data Processing Agreement"
      content={dpaContent}
      lastUpdated="January 27, 2025"
    />
  )
}
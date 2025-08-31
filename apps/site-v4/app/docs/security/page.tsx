import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, FileCheck, AlertTriangle, CheckCircle } from "lucide-react"

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "Enterprise-grade security for your prompts and outputs",
      features: [
        "End-to-end encryption in transit and at rest",
        "Zero-knowledge architecture for sensitive data",
        "Automatic PII detection and redaction",
        "Secure data deletion and retention policies",
      ],
    },
    {
      icon: Lock,
      title: "Access Control",
      description: "Granular permissions and authentication systems",
      features: [
        "Multi-factor authentication (MFA)",
        "Role-based access control (RBAC)",
        "API key management and rotation",
        "Session management and timeout controls",
      ],
    },
    {
      icon: Eye,
      title: "Audit & Monitoring",
      description: "Complete visibility into system usage and access",
      features: [
        "Comprehensive audit logs",
        "Real-time security monitoring",
        "Anomaly detection and alerting",
        "Compliance reporting and exports",
      ],
    },
    {
      icon: FileCheck,
      title: "Compliance",
      description: "Meeting industry standards and regulations",
      features: [
        "GDPR compliance and data subject rights",
        "SOC 2 Type II certification",
        "ISO 27001 security management",
        "CCPA privacy compliance",
      ],
    },
  ]

  const complianceStandards = [
    {
      name: "GDPR",
      description: "General Data Protection Regulation",
      status: "Compliant",
      details: [
        "Data subject rights implementation",
        "Privacy by design architecture",
        "Data processing agreements",
        "Right to be forgotten",
      ],
    },
    {
      name: "SOC 2 Type II",
      description: "Security, Availability, and Confidentiality",
      status: "Certified",
      details: [
        "Annual third-party audits",
        "Security controls validation",
        "Availability monitoring",
        "Confidentiality measures",
      ],
    },
    {
      name: "ISO 27001",
      description: "Information Security Management",
      status: "Certified",
      details: [
        "Information security policies",
        "Risk management framework",
        "Incident response procedures",
        "Continuous improvement process",
      ],
    },
    {
      name: "CCPA",
      description: "California Consumer Privacy Act",
      status: "Compliant",
      details: [
        "Consumer rights implementation",
        "Data transparency measures",
        "Opt-out mechanisms",
        "Third-party data sharing controls",
      ],
    },
  ]

  const securityPractices = [
    {
      category: "Infrastructure Security",
      practices: [
        "AWS/Azure cloud infrastructure with security best practices",
        "Network segmentation and firewall protection",
        "DDoS protection and traffic filtering",
        "Regular security patches and updates",
        "Intrusion detection and prevention systems",
      ],
    },
    {
      category: "Application Security",
      practices: [
        "Secure coding practices and code reviews",
        "Regular penetration testing and vulnerability assessments",
        "Input validation and output encoding",
        "SQL injection and XSS protection",
        "Dependency scanning and management",
      ],
    },
    {
      category: "Data Security",
      practices: [
        "AES-256 encryption for data at rest",
        "TLS 1.3 for data in transit",
        "Database encryption and access controls",
        "Secure backup and recovery procedures",
        "Data classification and handling policies",
      ],
    },
    {
      category: "Operational Security",
      practices: [
        "24/7 security monitoring and incident response",
        "Employee security training and awareness",
        "Background checks for personnel",
        "Secure development lifecycle (SDLC)",
        "Regular security assessments and audits",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 font-mono neon-text">
            Security & Compliance
          </h1>
          <p className="text-xl text-muted-foreground font-mono leading-relaxed mb-8">
            Enterprise-grade security measures and compliance standards to protect your data and ensure regulatory
            adherence.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm font-mono">
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              SOC 2 Certified
            </Badge>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              GDPR Compliant
            </Badge>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              ISO 27001
            </Badge>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center font-mono neon-text">Security Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={feature.title}
                  className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-foreground font-mono">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground font-mono">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, index) => (
                        <li key={index} className="flex items-start text-muted-foreground font-mono text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center font-mono neon-text">
            Compliance Standards
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {complianceStandards.map((standard) => (
              <Card
                key={standard.name}
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle className="text-foreground font-mono">{standard.name}</CardTitle>
                    <Badge variant="outline" className="border-green-500/50 text-green-400 font-mono">
                      {standard.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground font-mono">{standard.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {standard.details.map((detail, index) => (
                      <li key={index} className="flex items-start text-muted-foreground font-mono text-sm">
                        <div className="w-1 h-1 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center font-mono neon-text">Security Practices</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {securityPractices.map((category) => (
              <Card
                key={category.category}
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-foreground font-mono">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.practices.map((practice, index) => (
                      <li key={index} className="flex items-start text-muted-foreground font-mono text-sm">
                        <Shield className="w-4 h-4 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        {practice}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Contact */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-foreground font-mono text-2xl">Security Contact</CardTitle>
              <CardDescription className="text-muted-foreground font-mono">
                Report security vulnerabilities or compliance concerns
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground font-mono text-sm mb-2">Security Email:</p>
                  <code className="text-primary font-mono">security@chatgpt-prompting.com</code>
                </div>
                <div>
                  <p className="text-muted-foreground font-mono text-sm mb-2">PGP Key Fingerprint:</p>
                  <code className="text-muted-foreground font-mono text-xs">
                    4A3B 2C1D 5E6F 7890 1234 5678 9ABC DEF0 1234 5678
                  </code>
                </div>
                <div className="pt-4">
                  <p className="text-muted-foreground font-mono text-sm">
                    We take security seriously and will respond to verified reports within 24 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

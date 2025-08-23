// PROMPTFORGE™ v3 - Industry Packs System
// Packs specializate pentru domenii cu template-uri, compliance și best practices

import { readFileSync } from 'fs';
import { join } from 'path';
import { type Domain, type SevenD } from './ruleset';

export interface DomainConfig {
  industry: string;
  slug: string;
  jargon: string[];
  kpis: string[];
  compliance_notes: string;
  style_bias: string;
  default_output_format: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  defaults_7d: {
    scale: string;
    urgency: string;
    complexity: string;
    resources: string;
    application: string;
    output: string[];
  };
  guardrails: string[];
  evaluation_weights?: {
    clarity: number;
    execution: number;
    ambiguity_inv: number;
    business_fit: number;
  };
  thresholds?: {
    clarity_min: number;
    execution_min: number;
    ambiguity_max: number;
    business_fit_min: number;
  };
}

export interface IndustryPack {
  domain: Domain;
  config: DomainConfig;
  templates: ModuleTemplate[];
  compliance: ComplianceRequirements;
  best_practices: BestPractice[];
  premium_features: PremiumFeature[];
}

export interface ModuleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'strategy' | 'implementation' | 'analysis' | 'compliance' | 'optimization';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_time_hours: number;
  required_entitlements: string[];
  template_7d: Partial<SevenD>;
  prompt_template: string;
  example_outputs: {
    format: string;
    sample: string;
  }[];
  success_metrics: string[];
}

export interface ComplianceRequirements {
  regulations: string[];
  mandatory_disclaimers: string[];
  data_retention_days: number;
  audit_requirements: string[];
  restricted_content: string[];
  required_approvals: string[];
}

export interface BestPractice {
  id: string;
  title: string;
  description: string;
  implementation_steps: string[];
  common_pitfalls: string[];
  success_indicators: string[];
  related_kpis: string[];
}

export interface PremiumFeature {
  feature_id: string;
  name: string;
  description: string;
  required_plan: 'pro' | 'enterprise';
  entitlement_flag: string;
  value_proposition: string;
}

class IndustryPacksManager {
  private static instance: IndustryPacksManager;
  private packs: Map<Domain, IndustryPack> = new Map();
  private initialized = false;

  private constructor() {}

  public static getInstance(): IndustryPacksManager {
    if (!IndustryPacksManager.instance) {
      IndustryPacksManager.instance = new IndustryPacksManager();
    }
    return IndustryPacksManager.instance;
  }

  // Încarcă toate domain configs din filesystem
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const configDir = join(process.cwd(), 'config', 'domains');
      const domains: Domain[] = [
        'healthcare',
        'fintech',
        'legal',
        'cybersecurity',
        'aiml',
        'web3',
        'ecommerce',
        'saas',
        'consulting',
        'education',
      ];

      for (const domain of domains) {
        try {
          const configPath = join(configDir, `${domain}.json`);
          const configContent = readFileSync(configPath, 'utf8');
          const domainConfig: DomainConfig = JSON.parse(configContent);

          const industryPack: IndustryPack = {
            domain,
            config: domainConfig,
            templates: this.generateTemplatesForDomain(domain, domainConfig),
            compliance: this.generateComplianceForDomain(domain, domainConfig),
            best_practices: this.generateBestPracticesForDomain(domain, domainConfig),
            premium_features: this.generatePremiumFeaturesForDomain(domain),
          };

          this.packs.set(domain, industryPack);
        } catch (error) {
          console.warn(`Failed to load domain config for ${domain}:`, error);
          // Continue loading other domains
        }
      }

      this.initialized = true;
      console.log(`Initialized ${this.packs.size} industry packs`);
    } catch (error) {
      console.error('Failed to initialize industry packs:', error);
      throw error;
    }
  }

  // Obține pack pentru un domeniu specific
  public getIndustryPack(domain: Domain): IndustryPack | null {
    if (!this.initialized) {
      throw new Error('IndustryPacksManager not initialized. Call initialize() first.');
    }
    return this.packs.get(domain) || null;
  }

  // Obține toate pack-urile disponibile
  public getAllPacks(): IndustryPack[] {
    if (!this.initialized) {
      throw new Error('IndustryPacksManager not initialized. Call initialize() first.');
    }
    return Array.from(this.packs.values());
  }

  // Verifică dacă un pack este disponibil pentru utilizator
  public isPackAvailableForUser(
    domain: Domain,
    userEntitlements: Record<string, boolean>
  ): {
    available: boolean;
    missing_entitlements: string[];
    upgrade_required: 'pro' | 'enterprise' | null;
  } {
    const pack = this.getIndustryPack(domain);
    if (!pack) {
      return { available: false, missing_entitlements: [], upgrade_required: null };
    }

    const missingEntitlements: string[] = [];
    let upgradeRequired: 'pro' | 'enterprise' | null = null;

    // Verifică premium features
    for (const feature of pack.premium_features) {
      if (!userEntitlements[feature.entitlement_flag]) {
        missingEntitlements.push(feature.entitlement_flag);
        if (!upgradeRequired || feature.required_plan === 'enterprise') {
          upgradeRequired = feature.required_plan;
        }
      }
    }

    return {
      available: missingEntitlements.length === 0,
      missing_entitlements: missingEntitlements,
      upgrade_required: upgradeRequired,
    };
  }

  // Generează template-uri pentru un domeniu
  private generateTemplatesForDomain(domain: Domain, config: DomainConfig): ModuleTemplate[] {
    const baseTemplates: Partial<ModuleTemplate>[] = [
      {
        category: 'strategy',
        name: `${config.industry} Strategic Assessment`,
        description: `Comprehensive strategic analysis for ${config.industry} organizations`,
        difficulty: 'intermediate',
        estimated_time_hours: 2,
      },
      {
        category: 'implementation',
        name: `${config.industry} Implementation Playbook`,
        description: `Step-by-step implementation guide for ${config.industry} initiatives`,
        difficulty: 'advanced',
        estimated_time_hours: 4,
      },
      {
        category: 'compliance',
        name: `${config.industry} Compliance Checklist`,
        description: `Regulatory compliance verification for ${config.industry}`,
        difficulty: 'expert',
        estimated_time_hours: 3,
      },
      {
        category: 'analysis',
        name: `${config.industry} Performance Analysis`,
        description: `KPI analysis and optimization recommendations for ${config.industry}`,
        difficulty: 'intermediate',
        estimated_time_hours: 1.5,
      },
    ];

    return baseTemplates.map((template, index) => ({
      id: `${domain}_template_${index + 1}`,
      name: template.name!,
      description: template.description!,
      category: template.category!,
      difficulty: template.difficulty!,
      estimated_time_hours: template.estimated_time_hours!,
      required_entitlements: this.getRequiredEntitlementsForTemplate(domain, template.category!),
      template_7d: {
        domain,
        ...config.defaults_7d,
        output_format: config.default_output_format as any,
      },
      prompt_template: this.generatePromptTemplate(domain, config, template.category!),
      example_outputs: this.generateExampleOutputs(config.default_output_format),
      success_metrics: config.kpis.slice(0, 3),
    }));
  }

  // Generează compliance requirements
  private generateComplianceForDomain(
    domain: Domain,
    config: DomainConfig
  ): ComplianceRequirements {
    const baseCompliance: ComplianceRequirements = {
      regulations: config.compliance_notes.split(', '),
      mandatory_disclaimers: [
        `This content is for informational purposes only and does not constitute professional ${config.industry.toLowerCase()} advice.`,
        'Consult with qualified professionals before making business decisions.',
        'Compliance requirements may vary by jurisdiction.',
      ],
      data_retention_days:
        config.risk_level === 'high' ? 2555 : config.risk_level === 'medium' ? 1095 : 365, // 7 years, 3 years, 1 year
      audit_requirements:
        config.risk_level === 'high'
          ? [
              'All prompt inputs and outputs must be logged',
              'PII must be anonymized in audit logs',
              'Compliance officer approval required for sensitive content',
              'Regular compliance audits required',
            ]
          : ['Standard audit logging enabled', 'PII anonymization applied'],
      restricted_content: this.getRestrictedContentForDomain(domain),
      required_approvals:
        config.risk_level === 'high'
          ? [
              'Legal team review for compliance-sensitive content',
              'Domain expert validation for technical accuracy',
            ]
          : [],
    };

    return baseCompliance;
  }

  // Generează best practices
  private generateBestPracticesForDomain(domain: Domain, config: DomainConfig): BestPractice[] {
    return [
      {
        id: `${domain}_bp_1`,
        title: `${config.industry} Terminology Accuracy`,
        description: `Ensure proper use of ${config.industry} terminology and jargon`,
        implementation_steps: [
          `Review industry-specific terminology: ${config.jargon.slice(0, 5).join(', ')}`,
          'Validate technical accuracy with domain experts',
          'Use standardized definitions from industry bodies',
        ],
        common_pitfalls: [
          'Using outdated or deprecated terminology',
          'Mixing terminology from different domains',
          'Oversimplifying complex industry concepts',
        ],
        success_indicators: [
          'Industry experts validate terminology usage',
          'Consistent use of domain-specific language',
          'High clarity scores in expert reviews',
        ],
        related_kpis: config.kpis.slice(0, 2),
      },
      {
        id: `${domain}_bp_2`,
        title: `${config.industry} Compliance Integration`,
        description: 'Embed compliance considerations throughout the workflow',
        implementation_steps: [
          'Identify applicable regulations and standards',
          'Include compliance checkpoints in processes',
          'Document compliance rationale for decisions',
        ],
        common_pitfalls: [
          'Treating compliance as an afterthought',
          'Ignoring jurisdiction-specific requirements',
          'Insufficient documentation for audit purposes',
        ],
        success_indicators: [
          'All deliverables pass compliance review',
          'Audit trail is complete and accessible',
          'Regulatory requirements are addressed proactively',
        ],
        related_kpis: config.kpis.slice(1, 3),
      },
    ];
  }

  // Generează premium features pentru domeniu
  private generatePremiumFeaturesForDomain(domain: Domain): PremiumFeature[] {
    const features: PremiumFeature[] = [
      {
        feature_id: `${domain}_advanced_templates`,
        name: `Advanced ${domain} Templates`,
        description: `Access to expert-level templates and workflows for ${domain}`,
        required_plan: 'pro',
        entitlement_flag: 'canUseAllModules',
        value_proposition: `Unlock specialized templates designed by ${domain} experts`,
      },
    ];

    // Domain-specific premium features
    if (['healthcare', 'legal', 'fintech', 'cybersecurity'].includes(domain)) {
      features.push({
        feature_id: `${domain}_compliance_automation`,
        name: `${domain} Compliance Automation`,
        description: `Automated compliance checking and documentation for ${domain}`,
        required_plan: 'enterprise',
        entitlement_flag: 'hasAPI',
        value_proposition: `Reduce compliance overhead with automated checks and reporting`,
      });
    }

    return features;
  }

  // Helper methods
  private getRequiredEntitlementsForTemplate(domain: Domain, category: string): string[] {
    const baseEntitlements = ['canUseAllModules'];

    if (category === 'compliance' || ['healthcare', 'legal', 'fintech'].includes(domain)) {
      baseEntitlements.push('canExportPDF');
    }

    if (category === 'strategy' && ['enterprise', 'corporate'].includes(domain)) {
      baseEntitlements.push('hasAPI');
    }

    return baseEntitlements;
  }

  private generatePromptTemplate(domain: Domain, config: DomainConfig, category: string): string {
    return `You are a senior ${config.industry} ${category} expert. Create a comprehensive ${category} framework that addresses the specific needs and challenges of ${config.industry} organizations.

CONTEXT & REQUIREMENTS:
- Industry: ${config.industry}
- Style: ${config.style_bias}
- Key terminology: ${config.jargon.slice(0, 5).join(', ')}
- Success metrics: ${config.kpis.slice(0, 3).join(', ')}

COMPLIANCE & GUARDRAILS:
${config.guardrails.map(g => `- ${g}`).join('\n')}

REGULATORY NOTES:
${config.compliance_notes}

DELIVERABLE FORMAT:
- Output as ${config.default_output_format}
- Include implementation timeline
- Specify success metrics and KPIs
- Address compliance requirements
- Provide actionable next steps

Focus on practical, actionable guidance that can be immediately implemented by ${config.industry} professionals.`;
  }

  private generateExampleOutputs(outputFormat: string): { format: string; sample: string }[] {
    return [
      {
        format: outputFormat,
        sample: `# Example ${outputFormat} Output\n\nThis is a sample output showing the expected structure and quality...`,
      },
    ];
  }

  private getRestrictedContentForDomain(domain: Domain): string[] {
    const baseRestrictions = [
      'Personal identifiable information (PII)',
      'Confidential business information',
      'Unverified claims or advice',
    ];

    const domainSpecificRestrictions: Record<string, string[]> = {
      healthcare: [
        'Medical diagnosis or treatment advice',
        'Unverified health claims',
        'Protected health information (PHI)',
      ],
      legal: [
        'Specific legal advice',
        'Attorney-client privileged information',
        'Case-specific recommendations',
      ],
      fintech: [
        'Investment advice',
        'Specific financial recommendations',
        'Credit or lending decisions',
      ],
      cybersecurity: [
        'Specific vulnerability details',
        'Security system configurations',
        'Threat actor methodologies',
      ],
    };

    return [...baseRestrictions, ...(domainSpecificRestrictions[domain] || [])];
  }
}

// Export singleton instance
export const industryPacks = IndustryPacksManager.getInstance();

// Helper functions pentru utilizare rapidă
export async function getIndustryPack(domain: Domain): Promise<IndustryPack | null> {
  await industryPacks.initialize();
  return industryPacks.getIndustryPack(domain);
}

export async function getAvailablePacksForUser(entitlements: Record<string, boolean>): Promise<{
  available: IndustryPack[];
  restricted: {
    pack: IndustryPack;
    missing_entitlements: string[];
    upgrade_required: string | null;
  }[];
}> {
  await industryPacks.initialize();
  const allPacks = industryPacks.getAllPacks();

  const available: IndustryPack[] = [];
  const restricted: {
    pack: IndustryPack;
    missing_entitlements: string[];
    upgrade_required: string | null;
  }[] = [];

  for (const pack of allPacks) {
    const access = industryPacks.isPackAvailableForUser(pack.domain, entitlements);
    if (access.available) {
      available.push(pack);
    } else {
      restricted.push({
        pack,
        missing_entitlements: access.missing_entitlements,
        upgrade_required: access.upgrade_required,
      });
    }
  }

  return { available, restricted };
}

export async function getTemplatesForDomain(
  domain: Domain,
  userEntitlements: Record<string, boolean>
): Promise<{
  available: ModuleTemplate[];
  restricted: ModuleTemplate[];
}> {
  const pack = await getIndustryPack(domain);
  if (!pack) {
    return { available: [], restricted: [] };
  }

  const available: ModuleTemplate[] = [];
  const restricted: ModuleTemplate[] = [];

  for (const template of pack.templates) {
    const hasAllEntitlements = template.required_entitlements.every(
      entitlement => userEntitlements[entitlement]
    );

    if (hasAllEntitlements) {
      available.push(template);
    } else {
      restricted.push(template);
    }
  }

  return { available, restricted };
}

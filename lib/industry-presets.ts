// PROMPTFORGE™ v3 - Industry Presets System
// Presete predefinite per domeniu pentru configurare rapidă

import { type Domain, type SevenD } from './ruleset';

export interface IndustryPreset {
  id: string;
  name: string;
  description: string;
  domain: Domain;
  category: 'starter' | 'professional' | 'expert' | 'compliance';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  use_cases: string[];
  seven_d_config: SevenD;
  prompt_template: string;
  example_inputs: {
    [key: string]: string;
  };
  expected_outputs: {
    format: string;
    structure: string[];
    sample_snippet: string;
  };
  success_metrics: string[];
  time_to_complete_minutes: number;
  required_entitlements: string[];
  compliance_notes?: string;
  industry_best_practices: string[];
}

// Healthcare Presets
const healthcarePresets: IndustryPreset[] = [
  {
    id: 'healthcare_patient_journey',
    name: 'Patient Journey Optimization',
    description: 'Optimize patient experience from admission to discharge',
    domain: 'healthcare',
    category: 'professional',
    difficulty: 'intermediate',
    use_cases: ['Hospital workflow', 'Clinic operations', 'Telehealth', 'Patient satisfaction'],
    seven_d_config: {
      domain: 'healthcare',
      scale: 'corporate',
      urgency: 'planned',
      complexity: 'advanced',
      resources: 'full_stack_org',
      application: 'implementation',
      output_format: 'spec',
    },
    prompt_template: `You are a healthcare operations expert specializing in patient journey optimization. 

CONTEXT:
- Healthcare facility: {{facility_type}}
- Patient volume: {{patient_volume}}
- Current pain points: {{pain_points}}
- Compliance requirements: HIPAA, Joint Commission standards

TASK:
Create a comprehensive patient journey optimization plan that improves {{target_metric}} while maintaining HIPAA compliance.

DELIVERABLES:
1. Current state analysis
2. Improved patient journey map
3. Implementation timeline
4. Success metrics and KPIs
5. Risk mitigation strategies
6. Compliance checklist

CONSTRAINTS:
- Must comply with HIPAA regulations
- No patient data processing recommendations
- Include appropriate medical disclaimers
- Focus on operational efficiency, not medical advice`,
    example_inputs: {
      facility_type: 'Regional hospital with 300 beds',
      patient_volume: '150 patients/day average',
      pain_points: 'Long wait times, complex discharge process',
      target_metric: 'patient satisfaction scores and discharge efficiency',
    },
    expected_outputs: {
      format: 'structured specification',
      structure: [
        'Executive Summary',
        'Current State Analysis',
        'Proposed Solution',
        'Implementation Plan',
        'Success Metrics',
        'Compliance Notes',
      ],
      sample_snippet:
        '## Patient Journey Optimization Plan\n\n### Executive Summary\nThis plan addresses workflow inefficiencies...',
    },
    success_metrics: [
      'Patient satisfaction increase',
      'Reduced wait times',
      'Compliance score maintenance',
    ],
    time_to_complete_minutes: 45,
    required_entitlements: ['canUseAllModules', 'canExportPDF'],
    compliance_notes: 'HIPAA compliance verified, no PHI processing',
    industry_best_practices: [
      'Always include HIPAA compliance considerations',
      'Focus on patient safety and satisfaction',
      'Include measurable outcomes and KPIs',
      'Consider interdisciplinary team coordination',
    ],
  },
  {
    id: 'healthcare_compliance_audit',
    name: 'Healthcare Compliance Audit Framework',
    description: 'Comprehensive compliance audit framework for healthcare organizations',
    domain: 'healthcare',
    category: 'compliance',
    difficulty: 'expert',
    use_cases: [
      'Regulatory compliance',
      'Internal audits',
      'Joint Commission prep',
      'HIPAA assessment',
    ],
    seven_d_config: {
      domain: 'healthcare',
      scale: 'corporate',
      urgency: 'crisis',
      complexity: 'expert',
      resources: 'full_stack_org',
      application: 'audit',
      output_format: 'checklist',
    },
    prompt_template: `You are a healthcare compliance expert with extensive experience in {{compliance_type}} audits.

AUDIT SCOPE:
- Organization type: {{org_type}}
- Audit focus: {{audit_focus}}
- Timeline: {{timeline}}
- Previous findings: {{previous_findings}}

REGULATORY REQUIREMENTS:
- HIPAA Privacy and Security Rules
- Joint Commission standards
- CMS requirements
- State-specific healthcare regulations

DELIVERABLES:
1. Comprehensive audit checklist
2. Risk assessment framework
3. Documentation requirements
4. Remediation plan template
5. Ongoing monitoring procedures

COMPLIANCE STANDARDS:
- All recommendations must align with current federal and state regulations
- Include citation of relevant regulatory sections
- Provide implementation timelines
- Address both preventive and corrective measures`,
    example_inputs: {
      compliance_type: 'HIPAA Security Rule',
      org_type: 'Multi-specialty clinic with 50 providers',
      audit_focus: 'Electronic health records security',
      timeline: '6-month audit cycle',
      previous_findings: 'Minor documentation gaps, access control improvements needed',
    },
    expected_outputs: {
      format: 'detailed compliance checklist',
      structure: [
        'Audit Scope',
        'Regulatory Framework',
        'Assessment Criteria',
        'Documentation Requirements',
        'Remediation Actions',
        'Monitoring Plan',
      ],
      sample_snippet:
        '## HIPAA Security Audit Checklist\n\n### Administrative Safeguards\n- [ ] Security Officer designated...',
    },
    success_metrics: [
      'Compliance score improvement',
      'Audit findings reduction',
      'Regulatory alignment',
    ],
    time_to_complete_minutes: 60,
    required_entitlements: ['canUseAllModules', 'canExportPDF', 'hasAPI'],
    compliance_notes: 'Expert-level compliance framework, requires legal review',
    industry_best_practices: [
      'Always cite current regulatory requirements',
      'Include implementation timelines',
      'Address both technical and administrative safeguards',
      'Provide clear documentation requirements',
    ],
  },
];

// FinTech Presets
const fintechPresets: IndustryPreset[] = [
  {
    id: 'fintech_api_security',
    name: 'FinTech API Security Framework',
    description: 'Comprehensive API security framework for financial services',
    domain: 'fintech',
    category: 'professional',
    difficulty: 'advanced',
    use_cases: ['Open Banking', 'Payment APIs', 'Investment platforms', 'Digital wallets'],
    seven_d_config: {
      domain: 'fintech',
      scale: 'enterprise',
      urgency: 'sprint',
      complexity: 'advanced',
      resources: 'full_stack_org',
      application: 'implementation',
      output_format: 'spec',
    },
    prompt_template: `You are a FinTech security architect specializing in API security for financial services.

PROJECT CONTEXT:
- API type: {{api_type}}
- Transaction volume: {{transaction_volume}}
- Regulatory environment: {{regulatory_env}}
- Current security gaps: {{security_gaps}}

REGULATORY REQUIREMENTS:
- PCI DSS compliance for payment data
- PSD2 requirements for Open Banking
- SOX compliance for public companies
- Regional financial regulations

SECURITY FRAMEWORK:
1. Authentication and authorization
2. Data encryption and tokenization
3. API rate limiting and monitoring
4. Fraud detection integration
5. Audit logging and compliance
6. Incident response procedures

CONSTRAINTS:
- No specific investment advice
- Focus on security, not business strategy
- Include appropriate financial disclaimers
- Ensure regulatory compliance alignment`,
    example_inputs: {
      api_type: 'Payment processing API with card transactions',
      transaction_volume: '10,000 transactions/day',
      regulatory_env: 'EU - PSD2 compliance required',
      security_gaps: 'Rate limiting improvements, enhanced fraud detection',
    },
    expected_outputs: {
      format: 'technical specification',
      structure: [
        'Security Architecture',
        'Implementation Guide',
        'Compliance Framework',
        'Monitoring Setup',
        'Incident Response',
        'Testing Procedures',
      ],
      sample_snippet:
        '## FinTech API Security Specification\n\n### Authentication Framework\nImplement OAuth 2.0 with PKCE...',
    },
    success_metrics: ['Security score improvement', 'Compliance adherence', 'Fraud reduction'],
    time_to_complete_minutes: 50,
    required_entitlements: ['canUseAllModules', 'canExportPDF', 'hasAPI'],
    compliance_notes: 'PCI DSS and PSD2 compliance verified',
    industry_best_practices: [
      'Always implement defense in depth',
      'Include comprehensive audit logging',
      'Design for regulatory compliance from start',
      'Implement real-time fraud monitoring',
    ],
  },
];

// SaaS Presets
const saasPresets: IndustryPreset[] = [
  {
    id: 'saas_onboarding_optimization',
    name: 'SaaS User Onboarding Optimization',
    description: 'Optimize user onboarding flow for SaaS applications',
    domain: 'saas',
    category: 'professional',
    difficulty: 'intermediate',
    use_cases: ['User activation', 'Churn reduction', 'Feature adoption', 'Time to value'],
    seven_d_config: {
      domain: 'saas',
      scale: 'startup',
      urgency: 'sprint',
      complexity: 'standard',
      resources: 'lean_team',
      application: 'implementation',
      output_format: 'playbook',
    },
    prompt_template: `You are a SaaS growth expert specializing in user onboarding optimization.

PRODUCT CONTEXT:
- SaaS type: {{saas_type}}
- Current metrics: {{current_metrics}}
- Target users: {{target_users}}
- Key features: {{key_features}}

OPTIMIZATION GOALS:
- Reduce time to first value
- Increase feature adoption
- Decrease early churn
- Improve user activation

DELIVERABLES:
1. Current onboarding analysis
2. Optimized onboarding flow
3. Implementation roadmap
4. A/B testing framework
5. Success metrics and KPIs
6. User feedback collection plan

FOCUS AREAS:
- User experience optimization
- Feature discovery and adoption
- Progress tracking and gamification
- Support and documentation integration`,
    example_inputs: {
      saas_type: 'Project management tool for small teams',
      current_metrics: '30% activation rate, 15% churn in first month',
      target_users: 'Small business owners and team leads',
      key_features: 'Task management, team collaboration, reporting',
    },
    expected_outputs: {
      format: 'implementation playbook',
      structure: [
        'Current State Analysis',
        'Optimized Onboarding Flow',
        'Implementation Plan',
        'Testing Framework',
        'Success Metrics',
        'Continuous Improvement',
      ],
      sample_snippet:
        '## SaaS Onboarding Optimization Playbook\n\n### Current State Analysis\nUser journey analysis reveals...',
    },
    success_metrics: ['Activation rate increase', 'Churn reduction', 'Time to value improvement'],
    time_to_complete_minutes: 35,
    required_entitlements: ['canUseAllModules'],
    industry_best_practices: [
      'Focus on immediate value demonstration',
      'Progressive feature disclosure',
      'Personalized onboarding paths',
      'Continuous measurement and optimization',
    ],
  },
];

// Colectează toate presetele
const allPresets: IndustryPreset[] = [...healthcarePresets, ...fintechPresets, ...saasPresets];

// Export functions
export function getPresetsForDomain(domain: Domain): IndustryPreset[] {
  return allPresets.filter(preset => preset.domain === domain);
}

export function getPresetById(presetId: string): IndustryPreset | null {
  return allPresets.find(preset => preset.id === presetId) || null;
}

export function getPresetsByCategory(category: IndustryPreset['category']): IndustryPreset[] {
  return allPresets.filter(preset => preset.category === category);
}

export function getPresetsForUser(userEntitlements: Record<string, boolean>): {
  available: IndustryPreset[];
  restricted: IndustryPreset[];
} {
  const available: IndustryPreset[] = [];
  const restricted: IndustryPreset[] = [];

  for (const preset of allPresets) {
    const hasAllEntitlements = preset.required_entitlements.every(
      entitlement => userEntitlements[entitlement]
    );

    if (hasAllEntitlements) {
      available.push(preset);
    } else {
      restricted.push(preset);
    }
  }

  return { available, restricted };
}

export function getAllPresets(): IndustryPreset[] {
  return allPresets;
}

export function getPresetStats(): {
  total: number;
  by_domain: Record<Domain, number>;
  by_category: Record<string, number>;
  by_difficulty: Record<string, number>;
} {
  const stats = {
    total: allPresets.length,
    by_domain: {} as Record<Domain, number>,
    by_category: {} as Record<string, number>,
    by_difficulty: {} as Record<string, number>,
  };

  allPresets.forEach(preset => {
    stats.by_domain[preset.domain] = (stats.by_domain[preset.domain] || 0) + 1;
    stats.by_category[preset.category] = (stats.by_category[preset.category] || 0) + 1;
    stats.by_difficulty[preset.difficulty] = (stats.by_difficulty[preset.difficulty] || 0) + 1;
  });

  return stats;
}

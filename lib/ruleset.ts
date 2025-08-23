// PROMPTFORGE™ v3 - Ruleset SSOT Manager
// Single Source of Truth pentru 7D enums, domain defaults și validări

import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import { z } from 'zod';

// Types pentru 7D Framework
export type Domain =
  | 'saas'
  | 'fintech'
  | 'ecommerce'
  | 'consulting'
  | 'education'
  | 'healthcare'
  | 'legal'
  | 'marketing'
  | 'media'
  | 'real_estate'
  | 'hr'
  | 'ngo'
  | 'government'
  | 'web3'
  | 'aiml'
  | 'cybersecurity'
  | 'manufacturing'
  | 'logistics'
  | 'travel'
  | 'gaming'
  | 'fashion'
  | 'beauty'
  | 'spiritual'
  | 'architecture'
  | 'agriculture';

export type Scale =
  | 'personal_brand'
  | 'solo'
  | 'startup'
  | 'boutique_agency'
  | 'smb'
  | 'corporate'
  | 'enterprise';

export type Urgency = 'low' | 'planned' | 'sprint' | 'pilot' | 'crisis';

export type Complexity = 'foundational' | 'standard' | 'advanced' | 'expert';

export type Resources =
  | 'minimal'
  | 'solo'
  | 'lean_team'
  | 'agency_stack'
  | 'full_stack_org'
  | 'enterprise_budget';

export type Application =
  | 'training'
  | 'audit'
  | 'implementation'
  | 'strategy_design'
  | 'crisis_response'
  | 'experimentation'
  | 'documentation';

export type OutputFormat =
  | 'txt'
  | 'md'
  | 'checklist'
  | 'spec'
  | 'playbook'
  | 'json'
  | 'yaml'
  | 'diagram'
  | 'bundle';

// 7D Framework Schema
export const SevenDSchema = z.object({
  domain: z.enum([
    'saas',
    'fintech',
    'ecommerce',
    'consulting',
    'education',
    'healthcare',
    'legal',
    'marketing',
    'media',
    'real_estate',
    'hr',
    'ngo',
    'government',
    'web3',
    'aiml',
    'cybersecurity',
    'manufacturing',
    'logistics',
    'travel',
    'gaming',
    'fashion',
    'beauty',
    'spiritual',
    'architecture',
    'agriculture',
  ]),
  scale: z
    .enum([
      'personal_brand',
      'solo',
      'startup',
      'boutique_agency',
      'smb',
      'corporate',
      'enterprise',
    ])
    .optional(),
  urgency: z.enum(['low', 'planned', 'sprint', 'pilot', 'crisis']).optional(),
  complexity: z.enum(['foundational', 'standard', 'advanced', 'expert']).optional(),
  resources: z
    .enum(['minimal', 'solo', 'lean_team', 'agency_stack', 'full_stack_org', 'enterprise_budget'])
    .optional(),
  application: z
    .enum([
      'training',
      'audit',
      'implementation',
      'strategy_design',
      'crisis_response',
      'experimentation',
      'documentation',
    ])
    .optional(),
  output_format: z.enum([
    'txt',
    'md',
    'checklist',
    'spec',
    'playbook',
    'json',
    'yaml',
    'diagram',
    'bundle',
  ]),
});

export type SevenD = z.infer<typeof SevenDSchema>;

// Ruleset complete schema
const RulesetSchema = z.object({
  project: z.string(),
  schema_version: z.number(),
  semver: z.string(),
  is_ssot: z.boolean(),
  policies: z.object({
    defaults_editable_only_here: z.boolean(),
    ui_cannot_override_defaults: z.boolean(),
    compatibility: z.object({
      signature_fields: z.array(z.string()),
    }),
    security: z.object({
      knowledge_scoping_tag: z.string(),
      pii_public_export: z.string(),
    }),
    telemetry: z.object({
      do_not_log_raw_client_content: z.boolean(),
    }),
  }),
  sevenD: z.object({
    required: z.array(z.string()),
    enums: z.object({
      domain: z.array(z.string()),
      scale: z.array(z.string()),
      urgency: z.array(z.string()),
      complexity: z.array(z.string()),
      resources: z.array(z.string()),
      application: z.array(z.string()),
      output_format: z.array(z.string()),
    }),
    aliases: z.object({
      scale: z.record(z.string()),
      output_format: z.record(z.string()),
    }),
    validation: z.object({
      enum_only: z.boolean(),
      raise_on_invalid: z.boolean(),
    }),
    fallback: z.object({
      by_domain_defaults: z.boolean(),
    }),
    variability: z.object({
      diversity_budget: z.object({
        applies_to: z.array(z.string()),
        not_applied_to: z.array(z.string()),
        range: z.object({
          min: z.number(),
          max: z.number(),
        }),
        default: z.number(),
      }),
    }),
    domain_defaults: z.record(
      z.object({
        scale: z.string(),
        urgency: z.string(),
        complexity: z.string(),
        resources: z.string(),
        application: z.string(),
        output_format: z.string(),
      })
    ),
  }),
  test_and_score: z.object({
    rubric_axes: z.array(z.string()),
    thresholds: z.object({
      clarity_min: z.number(),
      execution_min: z.number(),
      ambiguity_max: z.number(),
      business_fit_min: z.number(),
      total_min: z.number(),
    }),
    weights: z.object({
      clarity: z.number(),
      execution: z.number(),
      ambiguity_inv: z.number(),
      business_fit: z.number(),
    }),
    auto_fix: z.object({
      enabled: z.boolean(),
      max_iterations: z.number(),
      strategies: z.array(z.string()),
    }),
  }),
  export: z.object({
    structure: z.string(),
    artifacts: z.array(z.string()),
    checksum: z.object({
      algo: z.string(),
      canonical_order: z.array(z.string()),
    }),
    storage: z.object({
      path_template: z.string(),
    }),
    pdf: z.object({
      paper: z.string(),
      margin_mm: z.number(),
      header: z.string(),
      footer: z.string(),
      watermark_trial: z.string(),
    }),
  }),
  entitlements: z.object({
    plans: z.record(
      z.object({
        modules: z.string(),
        features: z.array(z.string()),
        flags: z.record(z.boolean()),
        retention_days: z.number(),
      })
    ),
    ui_rules: z.object({
      hide_modules_without_entitlement: z.boolean(),
      block_endpoints_without_entitlement: z.boolean(),
    }),
  }),
});

type Ruleset = z.infer<typeof RulesetSchema>;

class RulesetManager {
  private static instance: RulesetManager;
  private ruleset: Ruleset | null = null;

  private constructor() {}

  public static getInstance(): RulesetManager {
    if (!RulesetManager.instance) {
      RulesetManager.instance = new RulesetManager();
    }
    return RulesetManager.instance;
  }

  // Încarcă ruleset.yml din filesystem
  public loadRuleset(): Ruleset {
    if (this.ruleset) {
      return this.ruleset;
    }

    try {
      const rulesetPath = join(process.cwd(), 'ruleset.yml');
      const fileContent = readFileSync(rulesetPath, 'utf8');
      const parsedYaml = yaml.load(fileContent) as any;

      this.ruleset = RulesetSchema.parse(parsedYaml);
      return this.ruleset;
    } catch (error) {
      throw new Error(`Failed to load ruleset.yml: ${error}`);
    }
  }

  // Obține enum-urile pentru 7D
  public getEnums() {
    const ruleset = this.loadRuleset();
    return ruleset.sevenD.enums;
  }

  // Obține domain defaults pentru un domeniu specific
  public getDomainDefaults(domain: Domain): Partial<SevenD> {
    const ruleset = this.loadRuleset();
    const defaults = ruleset.sevenD.domain_defaults[domain];

    if (!defaults) {
      throw new Error(`No domain defaults found for: ${domain}`);
    }

    return {
      domain,
      scale: defaults.scale as Scale,
      urgency: defaults.urgency as Urgency,
      complexity: defaults.complexity as Complexity,
      resources: defaults.resources as Resources,
      application: defaults.application as Application,
      output_format: defaults.output_format as OutputFormat,
    };
  }

  // Validează și normalizează 7D cu fallback pe domain defaults
  public validate7D(input: Partial<SevenD>): {
    isValid: boolean;
    errors: string[];
    normalized: SevenD;
    signature: string;
  } {
    const ruleset = this.loadRuleset();
    const errors: string[] = [];

    try {
      // Verifică câmpurile obligatorii
      if (!input.domain) {
        errors.push('Domain is required');
      }
      if (!input.output_format) {
        errors.push('Output format is required');
      }

      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Aplică domain defaults pentru câmpurile lipsă
      const domainDefaults = this.getDomainDefaults(input.domain!);
      const normalized: SevenD = {
        domain: input.domain!,
        scale: input.scale || domainDefaults.scale!,
        urgency: input.urgency || domainDefaults.urgency!,
        complexity: input.complexity || domainDefaults.complexity!,
        resources: input.resources || domainDefaults.resources!,
        application: input.application || domainDefaults.application!,
        output_format: input.output_format || domainDefaults.output_format!,
      };

      // Validează cu schema Zod
      const validationResult = SevenDSchema.safeParse(normalized);

      if (!validationResult.success) {
        errors.push(...validationResult.error.errors.map(e => e.message));

        if (ruleset.sevenD.validation.raise_on_invalid) {
          throw new Error(`7D validation failed: ${errors.join(', ')}`);
        }
      }

      // Generează signature pentru compatibility
      const signature = this.generateSignature(normalized);

      return {
        isValid: validationResult.success,
        errors,
        normalized: validationResult.success ? validationResult.data : normalized,
        signature,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown validation error'],
        normalized: input as SevenD,
        signature: '',
      };
    }
  }

  // Generează signature pentru compatibility checking
  private generateSignature(sevenD: SevenD): string {
    const ruleset = this.loadRuleset();
    const signatureFields = ruleset.policies.compatibility.signature_fields;

    const signatureParts = signatureFields.map(field => {
      const value = sevenD[field as keyof SevenD];
      return `${field}:${value}`;
    });

    return signatureParts.join('|');
  }

  // Obține scoring thresholds
  public getScoringThresholds() {
    const ruleset = this.loadRuleset();
    return ruleset.test_and_score.thresholds;
  }

  // Obține scoring weights
  public getScoringWeights() {
    const ruleset = this.loadRuleset();
    return ruleset.test_and_score.weights;
  }

  // Obține export configuration
  public getExportConfig() {
    const ruleset = this.loadRuleset();
    return ruleset.export;
  }

  // Obține plan entitlements
  public getPlanEntitlements(planCode: string) {
    const ruleset = this.loadRuleset();
    return ruleset.entitlements.plans[planCode];
  }

  // Verifică dacă un modul este permis pentru un plan
  public isModuleAllowedForPlan(moduleId: string, planCode: string): boolean {
    const planConfig = this.getPlanEntitlements(planCode);
    if (!planConfig) return false;

    const moduleRange = planConfig.modules;

    // Parse M01-M30 format
    const match = moduleRange.match(/M(\d+)-M(\d+)/);
    if (match) {
      const minModule = parseInt(match[1]);
      const maxModule = parseInt(match[2]);
      const currentModule = parseInt(moduleId.replace('M', ''));

      return currentModule >= minModule && currentModule <= maxModule;
    }

    return false;
  }

  // Obține toate domeniile disponibile
  public getAvailableDomains(): Domain[] {
    const enums = this.getEnums();
    return enums.domain as Domain[];
  }

  // Obține informații complete despre ruleset
  public getRulesetInfo() {
    const ruleset = this.loadRuleset();
    return {
      project: ruleset.project,
      version: ruleset.semver,
      isSSoT: ruleset.is_ssot,
      schemaVersion: ruleset.schema_version,
    };
  }
}

// Export singleton instance
export const ruleset = RulesetManager.getInstance();

// Helper functions pentru utilizare rapidă
export function validate7D(input: Partial<SevenD>) {
  return ruleset.validate7D(input);
}

export function getDomainDefaults(domain: Domain) {
  return ruleset.getDomainDefaults(domain);
}

export function getEnums() {
  return ruleset.getEnums();
}

export function getScoringThresholds() {
  return ruleset.getScoringThresholds();
}

export function getExportConfig() {
  return ruleset.getExportConfig();
}

// Middleware pentru validare în API routes
export function validateSevenDMiddleware(sevenD: any) {
  const result = validate7D(sevenD);

  if (!result.isValid) {
    throw new Error(`7D validation failed: ${result.errors.join(', ')}`);
  }

  return result.normalized;
}

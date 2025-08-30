// PromptForge v3 - Industry Packs API
// Access la packs specializate pentru domenii cu gating pe entitlements

import { NextRequest, NextResponse } from 'next/server';
import { getAvailablePacksForUser, getIndustryPack, getTemplatesForDomain } from '@/lib/industry-packs';
import { type Domain } from '@/lib/ruleset';
import { assertMembership, validateSACFHeaders, handleSecurityError } from '@/lib/security/assert';
import { createClient } from '@supabase/supabase-js';

// SACF - Development mode fallback pentru testing
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dev-placeholder.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dev-placeholder';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Obține entitlements pentru organizație
async function getEntitlements(orgId: string): Promise<Record<string, boolean>> {
  if (SUPABASE_URL.includes('dev-placeholder')) {
    // Development mode - return mock entitlements
    return {
      canUseAllModules: true,
      canExportPDF: true,
      canExportJSON: true,
      hasAPI: false,
      canExportBundleZip: false
    };
  }

  try {
    const { data, error } = await supabase
      .from('entitlements')
      .select('flag, value')
      .eq('org_id', orgId)
      .eq('value', true);

    if (error) throw error;

    return Object.fromEntries(
      (data || []).map((r: any) => [r.flag, r.value])
    );
  } catch (error) {
    console.error('Failed to fetch entitlements:', error);
    return {};
  }
}

// GET - Listează toate pack-urile disponibile pentru organizație
export async function GET(req: NextRequest) {
  try {
    const { orgId } = await validateSACFHeaders();
    const url = new URL(req.url);
    const domain = url.searchParams.get('domain') as Domain;

    // Verifică membership (în development mode este bypass)
    if (!SUPABASE_URL.includes('dev-placeholder')) {
      await assertMembership(orgId);
    }

    // Obține entitlements
    const entitlements = await getEntitlements(orgId);

    if (domain) {
      // Request pentru un domeniu specific
      const pack = await getIndustryPack(domain);
      if (!pack) {
        return NextResponse.json(
          { error: 'DOMAIN_NOT_FOUND', message: `Industry pack for domain '${domain}' not found` },
          { status: 404 }
        );
      }

      // Verifică access la pack
      const packAccess = await getAvailablePacksForUser(entitlements);
      const availablePack = packAccess.available.find(p => p.domain === domain);
      const restrictedPack = packAccess.restricted.find(p => p.pack.domain === domain);

      if (!availablePack && restrictedPack) {
        return NextResponse.json(
          {
            error: 'ENTITLEMENT_REQUIRED',
            domain,
            missing_entitlements: restrictedPack.missing_entitlements,
            upgrade_required: restrictedPack.upgrade_required,
            upsell: restrictedPack.upgrade_required === 'enterprise' ? 'enterprise_needed' : 'pro_needed'
          },
          { status: 403 }
        );
      }

      // Obține template-urile pentru domeniu
      const templates = await getTemplatesForDomain(domain, entitlements);

      return NextResponse.json({
        domain,
        pack: availablePack || pack,
        templates: {
          available: templates.available,
          restricted: templates.restricted.map(t => ({
            ...t,
            restriction_reason: 'Missing required entitlements',
            required_entitlements: t.required_entitlements
          }))
        },
        access: {
          full_access: !!availablePack,
          restricted_features: restrictedPack?.missing_entitlements || []
        }
      });

    } else {
      // Request pentru toate pack-urile
      const packsAccess = await getAvailablePacksForUser(entitlements);

      return NextResponse.json({
        orgId,
        summary: {
          total_packs: packsAccess.available.length + packsAccess.restricted.length,
          available: packsAccess.available.length,
          restricted: packsAccess.restricted.length
        },
        available_packs: packsAccess.available.map(pack => ({
          domain: pack.domain,
          industry: pack.config.industry,
          risk_level: pack.config.risk_level,
          templates_count: pack.templates.length,
          premium_features_count: pack.premium_features.length,
          compliance_requirements: pack.compliance.regulations.length
        })),
        restricted_packs: packsAccess.restricted.map(item => ({
          domain: item.pack.domain,
          industry: item.pack.config.industry,
          missing_entitlements: item.missing_entitlements,
          upgrade_required: item.upgrade_required,
          value_proposition: item.pack.premium_features[0]?.value_proposition || 'Advanced industry-specific features'
        })),
        entitlements
      });
    }

  } catch (error) {
    console.error('Industry Packs API error:', error);
    return handleSecurityError(error);
  }
}

// POST - Generează conținut folosind template dintr-un industry pack
export async function POST(req: NextRequest) {
  try {
    const { orgId } = await validateSACFHeaders();
    const body = await req.json();
    const { domain, templateId, customParameters, userInputs } = body;

    if (!domain || !templateId) {
      return NextResponse.json(
        { error: 'MISSING_PARAMETERS', message: 'domain and templateId are required' },
        { status: 400 }
      );
    }

    // Verifică membership (în development mode este bypass)
    if (!SUPABASE_URL.includes('dev-placeholder')) {
      await assertMembership(orgId);
    }

    // Obține entitlements
    const entitlements = await getEntitlements(orgId);

    // Obține pack-ul pentru domeniu
    const pack = await getIndustryPack(domain);
    if (!pack) {
      return NextResponse.json(
        { error: 'DOMAIN_NOT_FOUND', message: `Industry pack for domain '${domain}' not found` },
        { status: 404 }
      );
    }

    // Găsește template-ul
    const template = pack.templates.find(t => t.id === templateId);
    if (!template) {
      return NextResponse.json(
        { error: 'TEMPLATE_NOT_FOUND', message: `Template '${templateId}' not found in domain '${domain}'` },
        { status: 404 }
      );
    }

    // Verifică entitlements pentru template
    const missingEntitlements = template.required_entitlements.filter(
      entitlement => !entitlements[entitlement]
    );

    if (missingEntitlements.length > 0) {
      return NextResponse.json(
        {
          error: 'ENTITLEMENT_REQUIRED',
          template: templateId,
          missing_entitlements: missingEntitlements,
          upgrade_required: missingEntitlements.includes('hasAPI') ? 'enterprise' : 'pro',
          upsell: missingEntitlements.includes('hasAPI') ? 'enterprise_needed' : 'pro_needed'
        },
        { status: 403 }
      );
    }

    // Construiește prompt-ul final
    const finalPrompt = buildFinalPrompt(template, pack, userInputs, customParameters);

    // Verifică compliance requirements
    const complianceCheck = validateComplianceRequirements(pack, userInputs);
    if (!complianceCheck.passed) {
      return NextResponse.json(
        {
          error: 'COMPLIANCE_VIOLATION',
          violations: complianceCheck.violations,
          mandatory_disclaimers: pack.compliance.mandatory_disclaimers
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
        estimated_time_hours: template.estimated_time_hours
      },
      prompt: finalPrompt,
      configuration: {
        domain: pack.domain,
        seven_d: template.template_7d,
        success_metrics: template.success_metrics,
        compliance_notes: pack.config.compliance_notes
      },
      next_steps: [
        'Review the generated prompt for accuracy',
        'Test the prompt using /api/gpt-test',
        'Export results using /api/export/bundle when satisfied'
      ],
      mandatory_disclaimers: pack.compliance.mandatory_disclaimers
    });

  } catch (error) {
    console.error('Industry Pack generation error:', error);
    return handleSecurityError(error);
  }
}

// Helper function pentru construirea prompt-ului final
function buildFinalPrompt(template: any, pack: any, userInputs: any, customParameters: any): string {
  let prompt = template.prompt_template;

  // Înlocuiește placeholder-urile cu input-urile utilizatorului
  if (userInputs) {
    for (const [key, value] of Object.entries(userInputs)) {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
    }
  }

  // Adaugă compliance disclaimers
  prompt += '\n\n' + 'MANDATORY DISCLAIMERS:\n';
  prompt += pack.compliance.mandatory_disclaimers.map((d: string) => `- ${d}`).join('\n');

  // Adaugă custom parameters dacă există
  if (customParameters) {
    prompt += '\n\n' + 'ADDITIONAL REQUIREMENTS:\n';
    for (const [key, value] of Object.entries(customParameters)) {
      prompt += `- ${key}: ${value}\n`;
    }
  }

  return prompt;
}

// Helper function pentru validarea compliance
function validateComplianceRequirements(pack: any, userInputs: any): {
  passed: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // Verifică conținut restricționat
  if (userInputs) {
    const inputText = JSON.stringify(userInputs).toLowerCase();
    
    for (const restrictedContent of pack.compliance.restricted_content) {
      const keywords = restrictedContent.toLowerCase().split(' ');
      if (keywords.some((keyword: string) => inputText.includes(keyword))) {
        violations.push(`Content contains restricted information: ${restrictedContent}`);
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}

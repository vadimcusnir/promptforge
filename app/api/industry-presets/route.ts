// PROMPTFORGE™ v3 - Industry Presets API
// Access la presete predefinite per domeniu cu gating

import { NextRequest, NextResponse } from 'next/server';
import {
  getPresetsForDomain,
  getPresetById,
  getPresetsForUser,
  getPresetStats,
} from '@/lib/industry-presets';
import { type Domain } from '@/lib/ruleset';
import { validateSACFHeaders, assertMembership, handleSecurityError } from '@/lib/security/assert';
import { createClient } from '@supabase/supabase-js';

// SACF - Development mode fallback
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dev-placeholder.supabase.co';
const SUPABASE_SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dev-placeholder';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function getEntitlements(orgId: string): Promise<Record<string, boolean>> {
  if (SUPABASE_URL.includes('dev-placeholder')) {
    return {
      canUseAllModules: true,
      canExportPDF: true,
      canExportJSON: true,
      hasAPI: false,
      canExportBundleZip: false,
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
      (data || []).map((r: { flag: string; value: boolean }) => [r.flag, r.value])
    );
  } catch (error) {
    console.error('Failed to fetch entitlements:', error);
    return {};
  }
}

// GET - Listează presete disponibile
export async function GET(req: NextRequest) {
  try {
    const { orgId } = await validateSACFHeaders();
    const url = new URL(req.url);
    const domain = url.searchParams.get('domain') as Domain;
    const presetId = url.searchParams.get('presetId');

    // Verifică membership în development mode
    if (!SUPABASE_URL.includes('dev-placeholder')) {
      await assertMembership(orgId);
    }

    const entitlements = await getEntitlements(orgId);

    if (presetId) {
      // Request pentru un preset specific
      const preset = getPresetById(presetId);
      if (!preset) {
        return NextResponse.json(
          { error: 'PRESET_NOT_FOUND', message: `Preset '${presetId}' not found` },
          { status: 404 }
        );
      }

      // Verifică entitlements pentru preset
      const hasAccess = preset.required_entitlements.every(
        entitlement => entitlements[entitlement]
      );

      if (!hasAccess) {
        const missingEntitlements = preset.required_entitlements.filter(
          entitlement => !entitlements[entitlement]
        );

        return NextResponse.json(
          {
            error: 'ENTITLEMENT_REQUIRED',
            preset: presetId,
            missing_entitlements: missingEntitlements,
            upgrade_required: missingEntitlements.includes('hasAPI') ? 'enterprise' : 'pro',
            upsell: missingEntitlements.includes('hasAPI') ? 'enterprise_needed' : 'pro_needed',
          },
          { status: 403 }
        );
      }

      return NextResponse.json({
        preset,
        access: {
          available: true,
          entitlements_met: preset.required_entitlements,
        },
      });
    } else if (domain) {
      // Request pentru un domeniu specific
      const domainPresets = getPresetsForDomain(domain);
      const userAccess = getPresetsForUser(entitlements);

      const availableForDomain = domainPresets.filter(preset =>
        userAccess.available.some(available => available.id === preset.id)
      );

      const restrictedForDomain = domainPresets.filter(preset =>
        userAccess.restricted.some(restricted => restricted.id === preset.id)
      );

      return NextResponse.json({
        domain,
        summary: {
          total: domainPresets.length,
          available: availableForDomain.length,
          restricted: restrictedForDomain.length,
        },
        presets: {
          available: availableForDomain.map(preset => ({
            id: preset.id,
            name: preset.name,
            description: preset.description,
            category: preset.category,
            difficulty: preset.difficulty,
            time_to_complete_minutes: preset.time_to_complete_minutes,
            use_cases: preset.use_cases,
            success_metrics: preset.success_metrics,
          })),
          restricted: restrictedForDomain.map(preset => ({
            id: preset.id,
            name: preset.name,
            description: preset.description,
            category: preset.category,
            difficulty: preset.difficulty,
            required_entitlements: preset.required_entitlements,
            upgrade_hint: preset.required_entitlements.includes('hasAPI')
              ? 'Available with Enterprise plan'
              : 'Available with Pro plan',
          })),
        },
      });
    } else {
      // Request pentru toate presetele
      const userAccess = getPresetsForUser(entitlements);
      const stats = getPresetStats();

      return NextResponse.json({
        orgId,
        stats,
        summary: {
          total_presets: stats.total,
          available: userAccess.available.length,
          restricted: userAccess.restricted.length,
        },
        presets_by_domain: Object.keys(stats.by_domain).map(domain => ({
          domain,
          count: stats.by_domain[domain as Domain],
          available_count: userAccess.available.filter(p => p.domain === domain).length,
        })),
        featured_presets: userAccess.available
          .filter(preset => preset.category === 'professional')
          .slice(0, 3)
          .map(preset => ({
            id: preset.id,
            name: preset.name,
            description: preset.description,
            domain: preset.domain,
            time_to_complete_minutes: preset.time_to_complete_minutes,
          })),
        entitlements,
      });
    }
  } catch (error) {
    console.error('Industry Presets API error:', error);
    return handleSecurityError(error);
  }
}

// POST - Generează conținut folosind un preset
export async function POST(req: NextRequest) {
  try {
    const { orgId } = await validateSACFHeaders();
    const body = await req.json();
    const { presetId, userInputs, customizations } = body;

    if (!presetId) {
      return NextResponse.json(
        { error: 'MISSING_PARAMETERS', message: 'presetId is required' },
        { status: 400 }
      );
    }

    // Verifică membership în development mode
    if (!SUPABASE_URL.includes('dev-placeholder')) {
      await assertMembership(orgId);
    }

    const entitlements = await getEntitlements(orgId);
    const preset = getPresetById(presetId);

    if (!preset) {
      return NextResponse.json(
        { error: 'PRESET_NOT_FOUND', message: `Preset '${presetId}' not found` },
        { status: 404 }
      );
    }

    // Verifică entitlements
    const hasAccess = preset.required_entitlements.every(entitlement => entitlements[entitlement]);

    if (!hasAccess) {
      const missingEntitlements = preset.required_entitlements.filter(
        entitlement => !entitlements[entitlement]
      );

      return NextResponse.json(
        {
          error: 'ENTITLEMENT_REQUIRED',
          preset: presetId,
          missing_entitlements: missingEntitlements,
          upgrade_required: missingEntitlements.includes('hasAPI') ? 'enterprise' : 'pro',
        },
        { status: 403 }
      );
    }

    // Construiește prompt-ul final din preset
    let finalPrompt = preset.prompt_template;

    // Înlocuiește placeholder-urile cu input-urile utilizatorului
    if (userInputs) {
      for (const [key, value] of Object.entries(userInputs)) {
        finalPrompt = finalPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
      }
    }

    // Adaugă customizations dacă există
    if (customizations) {
      finalPrompt += '\n\n' + 'ADDITIONAL CUSTOMIZATIONS:\n';
      for (const [key, value] of Object.entries(customizations)) {
        finalPrompt += `- ${key}: ${value}\n`;
      }
    }

    // Adaugă compliance notes dacă există
    if (preset.compliance_notes) {
      finalPrompt += '\n\n' + 'COMPLIANCE REQUIREMENTS:\n';
      finalPrompt += preset.compliance_notes;
    }

    return NextResponse.json({
      success: true,
      preset: {
        id: preset.id,
        name: preset.name,
        domain: preset.domain,
        category: preset.category,
        time_to_complete_minutes: preset.time_to_complete_minutes,
      },
      configuration: {
        seven_d: preset.seven_d_config,
        expected_output_format: preset.expected_outputs.format,
        success_metrics: preset.success_metrics,
      },
      prompt: finalPrompt,
      next_steps: [
        'Review the generated prompt for completeness',
        'Test the prompt using /api/gpt-test',
        'Refine based on results',
        'Export final version using /api/export/bundle',
      ],
      compliance_notes: preset.compliance_notes,
      industry_best_practices: preset.industry_best_practices,
    });
  } catch (error) {
    console.error('Industry Preset generation error:', error);
    return handleSecurityError(error);
  }
}

// PromptForge v3 - Export Bundle API
// Simplified version that works with our current schema

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verifică entitlements pentru user
async function getEntitlements(userId: string): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from('user_entitlements')
    .select('can_export_pdf, can_export_json, can_export_bundle_zip, can_use_gpt_test_real')
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  return {
    canExportPDF: data?.can_export_pdf || false,
    canExportJSON: data?.can_export_json || false,
    canExportBundleZip: data?.can_export_bundle_zip || false,
    canUseGptTestReal: data?.can_use_gpt_test_real || false
  };
}

// Verifică dacă prompt history există și aparține user-ului
async function validatePromptHistory(promptHistoryId: string, userId: string): Promise<any> {
  const { data, error } = await supabase
    .from('prompt_history')
    .select('*')
    .eq('id', promptHistoryId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new Error('Prompt history not found or access denied');
  }

  return data;
}

// Generează un bundle simplu (placeholder pentru implementarea completă)
async function generateSimpleBundle(data: any): Promise<any> {
  // Placeholder implementation
  return {
    outputDir: '/tmp/bundle',
    manifest: {
      bundle_id: crypto.randomUUID(),
      bundle_checksum: crypto.randomBytes(32).toString('hex'),
      exported_at: new Date().toISOString(),
      version: data.version || '1.0.0',
      artifacts: []
    },
    zipInfo: { size: 0, files: 0 }
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      promptHistoryId,
      moduleId,
      parameterSet7D,
      promptText,
      mdReport,
      jsonPayload,
      licenseNotice,
      version = '1.0.0',
      requestedFormats = ['txt', 'md']
    } = body;

    // Validări de bază
    if (!userId || !promptHistoryId || !moduleId || !promptText || !mdReport || !jsonPayload) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verifică că prompt history există și aparține user-ului
    const promptData = await validatePromptHistory(promptHistoryId, userId);
    
    // Verifică că prompt-ul are scor ≥80
    const score = promptData.score || 0;
    if (score < 80) {
      return NextResponse.json(
        { 
          error: 'SCORE_TOO_LOW',
          message: `Score ${score} is below minimum threshold of 80`,
          score
        },
        { status: 400 }
      );
    }

    // Verifică entitlements și determină formatele permise
    const flags = await getEntitlements(userId);
    const allowedFormats = ['txt', 'md']; // Base formats pentru toți

    // Gating pe planuri
    if (flags.canExportJSON) allowedFormats.push('json');
    if (flags.canExportPDF) allowedFormats.push('pdf');
    if (flags.canExportBundleZip) allowedFormats.push('zip');

    // Verifică că formatele cerute sunt permise
    const unauthorizedFormats = requestedFormats.filter(
      (format: string) => !allowedFormats.includes(format)
    );

    if (unauthorizedFormats.length > 0) {
      return NextResponse.json(
        {
          error: 'ENTITLEMENT_REQUIRED',
          unauthorizedFormats,
          allowedFormats,
          upsell: unauthorizedFormats.includes('pdf') || unauthorizedFormats.includes('json') 
            ? 'pro_needed' 
            : 'enterprise_needed'
        },
        { status: 403 }
      );
    }

    // Generează bundle-ul simplu
    const bundleResult = await generateSimpleBundle({
      promptHistoryId,
      moduleId,
      userId,
      parameterSet7D,
      promptText,
      mdReport,
      jsonPayload,
      version
    });

    // Salvează în DB
    const { error: dbError } = await supabase
      .from('export_bundles')
      .insert([{
        prompt_history_id: promptHistoryId,
        bundle_hash: bundleResult.manifest.bundle_checksum,
        formats: allowedFormats,
        manifest: {
          exported_at: bundleResult.manifest.exported_at,
          version: bundleResult.manifest.version,
          license_notice: licenseNotice || `© PromptForge v3 — Generated ${new Date().toISOString()}`,
          artifacts: bundleResult.manifest.artifacts,
          paths: {}
        }
      }]);

    if (dbError) {
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    return NextResponse.json({
      success: true,
      bundle: {
        id: bundleResult.manifest.bundle_id,
        promptHistoryId,
        moduleId,
        version: bundleResult.manifest.version,
        formats: allowedFormats,
        checksum: bundleResult.manifest.bundle_checksum,
        artifacts: bundleResult.manifest.artifacts.length,
        exportedAt: bundleResult.manifest.exported_at
      },
      manifest: bundleResult.manifest,
      metadata: {
        score,
        domain: parameterSet7D?.domain || 'unknown',
        totalFiles: 0,
        hasWatermark: false
      }
    });

  } catch (error) {
    console.error('Export Bundle API error:', error);

    if (error instanceof Error) {
      if (error.message.includes('ENTITLEMENT_REQUIRED')) {
        return NextResponse.json(
          { 
            error: 'ENTITLEMENT_REQUIRED',
            message: error.message
          },
          { status: 403 }
        );
      }

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return NextResponse.json(
          { error: 'PROMPT_NOT_FOUND', message: error.message },
          { status: 404 }
        );
      }

      if (error.message.includes('SCORE_TOO_LOW')) {
        return NextResponse.json(
          { error: 'SCORE_TOO_LOW', message: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'INTERNAL_ERROR',
        message: 'Failed to generate export bundle'
      },
      { status: 500 }
    );
  }
}

// GET pentru informații despre export capabilities
export async function GET(req: NextRequest) {
  const userId = new URL(req.url).searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'userId parameter is required' },
      { status: 400 }
    );
  }

  try {
    const flags = await getEntitlements(userId);
    
    const capabilities = {
      baseFormats: ['txt', 'md'],
      availableFormats: ['txt', 'md'],
      restrictions: [] as string[]
    };

    if (flags.canExportJSON) {
      capabilities.availableFormats.push('json');
    } else {
      capabilities.restrictions.push('JSON export requires Pro plan');
    }

    if (flags.canExportPDF) {
      capabilities.availableFormats.push('pdf');
    } else {
      capabilities.restrictions.push('PDF export requires Pro plan');
    }

    if (flags.canExportBundleZip) {
      capabilities.availableFormats.push('zip');
    } else {
      capabilities.restrictions.push('ZIP bundle requires Enterprise plan');
    }

    return NextResponse.json({
      userId,
      capabilities,
      requirements: {
        minimumScore: 80
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check export capabilities' },
      { status: 500 }
    );
  }
}
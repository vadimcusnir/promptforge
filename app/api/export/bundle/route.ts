// PromptForge v3 - Export Bundle API
// Generează bundle complete cu gating pe plan și salvare în Supabase Storage

import { NextRequest, NextResponse } from 'next/server';
import { generateBundle, validateBundle, detectMimeType } from '@/lib/bundle';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

// Verifică entitlements pentru org
async function getEntitlements(orgId: string): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from('entitlements')
    .select('flag, value')
    .eq('org_id', orgId)
    .eq('value', true);

  if (error) throw error;

  const flags = Object.fromEntries(
    (data || []).map((r: any) => [r.flag, r.value])
  );
  
  return flags;
}

// Verifică dacă run-ul există și aparține org-ului
async function validateRun(runId: string, orgId: string): Promise<any> {
  const { data, error } = await supabase
    .from('runs')
    .select('*, prompt_scores(*)')
    .eq('id', runId)
    .eq('org_id', orgId)
    .single();

  if (error || !data) {
    throw new Error('Run not found or access denied');
  }

  return data;
}

// Uploadează fișiere în Supabase Storage
async function uploadToStorage(
  outputDir: string,
  orgId: string,
  moduleId: string,
  runId: string
): Promise<Record<string, string>> {
  const bucket = 'bundles';
  const prefix = `${orgId}/${moduleId}/${runId}/`;
  const uploads: Record<string, string> = {};

  const files = fs.readdirSync(outputDir);

  for (const fileName of files) {
    const filePath = path.join(outputDir, fileName);
    const fileContent = fs.readFileSync(filePath);
    const mimeType = detectMimeType(fileName);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(prefix + fileName, fileContent, {
        upsert: true,
        contentType: mimeType
      });

    if (error) {
      throw new Error(`Storage upload failed for ${fileName}: ${error.message}`);
    }

    uploads[fileName] = `${bucket}/${prefix}${fileName}`;
  }

  return uploads;
}

// Salvează bundle în DB
async function saveBundleToDb(
  runId: string,
  manifest: any,
  uploads: Record<string, string>
): Promise<void> {
  const formats = Object.keys(uploads)
    .filter(f => f.match(/\.(txt|md|json|pdf|zip)$/))
    .map(f => f.split('.').pop()!)
    .filter(ext => ext && ext !== 'txt'); // Exclude .txt din formats pentru UI

  const { error } = await supabase
    .from('bundles')
    .insert([{
      run_id: runId,
      formats,
      paths: uploads,
      checksum: manifest.bundle_checksum,
      exported_at: manifest.exported_at,
      version: manifest.version,
      license_notice: manifest.license_notice
    }]);

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orgId,
      runId,
      moduleId,
      parameterSet7D,
      promptText,
      mdReport,
      jsonPayload,
      licenseNotice,
      version = '1.0.0',
      requestedFormats = ['txt', 'md'] // Default la format minim
    } = body;

    // Validări de bază
    if (!orgId || !runId || !moduleId || !promptText || !mdReport || !jsonPayload) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verifică că run-ul există și aparține org-ului
    const runData = await validateRun(runId, orgId);
    
    // Verifică că run-ul a fost success și are scor ≥80
    if (runData.status !== 'success') {
      return NextResponse.json(
        { error: 'Can only export successful runs' },
        { status: 400 }
      );
    }

    const score = runData.prompt_scores?.[0]?.overall_score || 0;
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
    const flags = await getEntitlements(orgId);
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

    // Determină watermark pentru trial
    let watermark;
    const subscription = await supabase
      .from('subscriptions')
      .select('status, trial_end')
      .eq('org_id', orgId)
      .single();

    if (subscription.data?.status === 'trialing') {
      watermark = 'TRIAL — Not for Redistribution';
    }

    // Generează bundle-ul
    const telemetry = {
      run_id: runId,
      model: runData.model,
      tokens_used: runData.tokens_used,
      cost_usd: runData.cost_usd,
      duration_ms: runData.duration_ms,
      score: score,
      verdict: runData.telemetry?.verdict || 'unknown',
      domain: parameterSet7D.domain,
      export_formats: allowedFormats,
      exported_by: orgId
    };

    const bundleResult = await generateBundle({
      runId,
      moduleId,
      orgId,
      parameterSet7D,
      promptText,
      mdReport,
      jsonPayload,
      telemetry,
      licenseNotice: licenseNotice || `© PromptForge v3 — Generated ${new Date().toISOString()}`,
      formats: allowedFormats,
      version,
      watermark
    });

    // Validează bundle-ul
    const validation = validateBundle(bundleResult.outputDir, allowedFormats);
    if (!validation.isValid) {
      throw new Error(`Bundle validation failed: ${validation.errors.join(', ')}`);
    }

    // Upload în Supabase Storage
    const uploads = await uploadToStorage(
      bundleResult.outputDir,
      orgId,
      moduleId,
      runId
    );

    // Salvează în DB
    await saveBundleToDb(runId, bundleResult.manifest, uploads);

    // Cleanup director temporar
    fs.rmSync(bundleResult.outputDir, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      bundle: {
        id: bundleResult.manifest.bundle_id,
        runId,
        moduleId,
        version: bundleResult.manifest.version,
        formats: allowedFormats,
        checksum: bundleResult.manifest.bundle_checksum,
        artifacts: bundleResult.manifest.artifacts.length,
        exportedAt: bundleResult.manifest.exported_at
      },
      paths: uploads,
      manifest: bundleResult.manifest,
      zipInfo: bundleResult.zipInfo,
      metadata: {
        score,
        domain: parameterSet7D.domain,
        totalFiles: validation.files.length,
        hasWatermark: !!watermark
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
          { error: 'RUN_NOT_FOUND', message: error.message },
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
  const orgId = new URL(req.url).searchParams.get('orgId');
  
  if (!orgId) {
    return NextResponse.json(
      { error: 'orgId parameter is required' },
      { status: 400 }
    );
  }

  try {
    const flags = await getEntitlements(orgId);
    
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
      orgId,
      capabilities,
      requirements: {
        minimumScore: 80,
        runStatus: 'success'
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check export capabilities' },
      { status: 500 }
    );
  }
}
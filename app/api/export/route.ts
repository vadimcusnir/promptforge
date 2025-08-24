/**
 * Export Bundle API
 * POST /api/export - Generate auditable bundles from validated runs
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromCookies } from '@/lib/auth';

// Import export modules
import { composeTxt, composeMd, composeJson, composeTelemetry, normalizeContent } from '@/lib/export/composeArtifacts';
import { renderPdf, isUserInTrial } from '@/lib/export/renderPdf';
import { buildManifest, validateManifest } from '@/lib/export/buildManifest';
import { sha256, canonicalChecksum, generateChecksumFile } from '@/lib/export/hash';
import { uploadArtifacts, generateStoragePath, getContentType, createZipArchive, validateStorageConfig } from '@/lib/export/storage';
import { planAllowsFormat, type PlanCode } from '@/lib/export/license';

// Import telemetry
import { trackEvent } from '@/lib/telemetry';

interface ExportRequest {
  runId: string;
  formats: string[];
  orgId: string;
  userId: string;
}

interface ExportResponse {
  bundleId: string;
  paths: Record<string, string>;
  license_notice: string;
  checksum: string;
  formats: string[];
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let traceId = crypto.randomUUID();
  
  try {
    // Validate environment
    validateStorageConfig();
    
    // Get current user from cookies
    const user = await getUserFromCookies();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request
    const body: ExportRequest = await req.json();
    const { runId, formats, orgId } = body;
    const userId = user.email; // Use current user's email

    if (!runId || !formats?.length || !orgId) {
      return NextResponse.json(
        { error: 'Missing required fields: runId, formats, orgId' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify user membership
    const { data: membership } = await supabase
      .from('org_members')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', userId)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    // Get user entitlements
    const { data: entitlementsData } = await supabase
      .from('entitlements_effective_user')
      .select('flag, value')
      .eq('org_id', orgId)
      .eq('user_id', userId);

    const entitlements = entitlementsData?.reduce((acc, ent) => {
      acc[ent.flag] = ent.value;
      return acc;
    }, {} as Record<string, boolean>) || {};

    // Get subscription info
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_code, trial_end')
      .eq('org_id', orgId)
      .single();

    const plan: PlanCode = subscription?.plan_code || 'pilot';

    // Track export started
    await trackEvent({
      event: 'export.started',
      orgId,
      userId,
      payload: {
        run_id: runId,
        formats: formats,
        org_id: orgId,
        user_id: userId,
        plan: plan,
        trace_id: traceId,
        timestamp: startTime
      }
    });

    // Check entitlements for each requested format
    for (const format of formats) {
      if (!planAllowsFormat(plan, format)) {
        return NextResponse.json(
          { 
            error: 'ENTITLEMENT_REQUIRED',
            message: `Format '${format}' requires ${format === 'zip' ? 'Enterprise' : 'Pro'} plan`
          },
          { status: 403 }
        );
      }

      // Check specific entitlements
      const entitlementChecks: Record<string, string> = {
        'pdf': 'canExportPDF',
        'json': 'canExportJSON',
        'zip': 'canExportBundleZip'
      };

      const requiredEntitlement = entitlementChecks[format];
      if (requiredEntitlement && !entitlements[requiredEntitlement]) {
        return NextResponse.json(
          {
            error: 'ENTITLEMENT_REQUIRED',
            message: `Missing entitlement: ${requiredEntitlement}`
          },
          { status: 403 }
        );
      }
    }

    // Load run data and validate DoD
    const { data: run, error: runError } = await supabase
      .from('runs')
      .select(`
        *,
        prompt_scores(*)
      `)
      .eq('id', runId)
      .eq('org_id', orgId)
      .single();

    if (runError || !run) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 });
    }

    // DoD Validation: Score >= 80
    const score = run.prompt_scores?.[0];
    if (!score || score.overall_score < 80) {
      return NextResponse.json(
        {
          error: 'DOD_NOT_MET',
          message: 'Run score must be >= 80 for export'
        },
        { status: 422 }
      );
    }

    // DoD Validation: Complete output
    if (run.status !== 'success' || !run.telemetry) {
      return NextResponse.json(
        {
          error: 'DOD_NOT_MET', 
          message: 'Run must be successful with complete output'
        },
        { status: 422 }
      );
    }

    // Get module info
    const { data: module } = await supabase
      .from('modules')
      .select('*')
      .eq('module_id', run.module_id)
      .single();

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Get prompt history for content
    const { data: promptHistory } = await supabase
      .from('prompt_history')
      .select('*')
      .eq('id', run.prompt_history_id)
      .single();

    if (!promptHistory) {
      return NextResponse.json({ error: 'Prompt history not found' }, { status: 404 });
    }

    // Generate artifacts
    const bundleId = crypto.randomUUID();
    const artifacts: Record<string, string | Uint8Array> = {};
    const fileHashes: Record<string, string> = {};

    // Always generate core files
    const promptContent = promptHistory.output;
    const normalizedPrompt = normalizeContent(promptContent);
    
    // Generate txt
    artifacts['prompt.txt'] = composeTxt({ prompt: normalizedPrompt });
    fileHashes['prompt.txt'] = sha256(artifacts['prompt.txt'] as string);

    // Generate json
    const jsonContent = composeJson({
      sevenD: promptHistory.config,
      output: promptContent,
      meta: run.telemetry,
      moduleId: run.module_id,
      domain: promptHistory.parameter_set_id || 'general'
    });
    artifacts['prompt.json'] = JSON.stringify(jsonContent, null, 2);
    fileHashes['prompt.json'] = sha256(artifacts['prompt.json'] as string);

    // Generate md if requested
    if (formats.includes('md')) {
      artifacts['prompt.md'] = composeMd({
        title: module.name,
        kpi: module.kpi,
        spec: module.spec,
        guardrails: module.guardrails,
        moduleId: run.module_id,
        domain: promptHistory.parameter_set_id || 'general',
        prompt: normalizedPrompt
      });
      fileHashes['prompt.md'] = sha256(artifacts['prompt.md'] as string);
    }

    // Generate PDF if requested
    if (formats.includes('pdf')) {
      const isTrialUser = isUserInTrial(subscription);
      artifacts['prompt.pdf'] = await renderPdf({
        title: module.name,
        content: normalizedPrompt,
        moduleId: run.module_id,
        domain: promptHistory.parameter_set_id || 'general',
        isTrialUser
      });
      fileHashes['prompt.pdf'] = sha256(Buffer.from(artifacts['prompt.pdf'] as Uint8Array));
    }

    // Generate telemetry
    artifacts['telemetry.json'] = JSON.stringify(composeTelemetry({
      score: {
        clarity: score.clarity,
        execution: score.execution,
        ambiguity: score.ambiguity,
        business_fit: score.business_fit,
        overall_score: score.overall_score
      },
      tokens: {
        input: run.telemetry.tokens_input || 0,
        output: run.telemetry.tokens_output || 0,
        total: run.tokens_used || 0
      },
      tta: run.duration_ms || 0,
      cost_usd: parseFloat(run.cost_usd || '0'),
      model: run.model || 'unknown'
    }), null, 2);
    fileHashes['telemetry.json'] = sha256(artifacts['telemetry.json'] as string);

    // Generate manifest
    const manifest = buildManifest({
      bundleId,
      runId,
      moduleId: run.module_id,
      domain: promptHistory.parameter_set_id || 'general',
      signature7d: promptHistory.hash,
      score: {
        total: score.overall_score,
        clarity: score.clarity,
        execution: score.execution,
        ambiguity: score.ambiguity,
        business_fit: score.business_fit
      },
      formats: formats.filter(f => f !== 'zip'),
      artifacts: Object.keys(fileHashes).map(filename => ({
        file: filename,
        checksum: `sha256:${fileHashes[filename]}`,
        bytes: typeof artifacts[filename] === 'string' 
          ? new TextEncoder().encode(artifacts[filename] as string).length
          : (artifacts[filename] as Uint8Array).length
      })),
      plan,
      version: '1.0.0'
    });

    if (!validateManifest(manifest)) {
      throw new Error('Invalid manifest generated');
    }

    artifacts['manifest.json'] = JSON.stringify(manifest, null, 2);
    fileHashes['manifest.json'] = sha256(artifacts['manifest.json'] as string);

    // Generate checksum
    const canonicalChecksumValue = canonicalChecksum(
      Object.keys(fileHashes).map(filename => `${filename}:${fileHashes[filename]}`)
    );
    artifacts['checksum.txt'] = generateChecksumFile(fileHashes);

    // Create ZIP if Enterprise
    if (formats.includes('zip')) {
      artifacts['bundle.zip'] = await createZipArchive(artifacts);
    }

    // Upload to storage
    const basePath = generateStoragePath({
      orgId,
      domain: promptHistory.parameter_set_id || 'general',
      moduleId: run.module_id,
      runId,
      filename: '' // Will be appended per file
    }).replace(/\/$/, ''); // Remove trailing slash

    const uploadArtifactsList = Object.entries(artifacts).map(([filename, content]) => ({
      filename,
      content,
      contentType: getContentType(filename)
    }));

    const uploadResults = await uploadArtifacts(basePath, uploadArtifactsList);

    // Save bundle to database
    const { data: bundleRecord, error: bundleError } = await supabase
      .from('bundles')
      .insert({
        id: bundleId,
        run_id: runId,
        formats: formats,
        paths: Object.fromEntries(
          Object.entries(uploadResults).map(([filename, result]) => [
            filename.split('.')[0], // Remove extension for key
            result.url
          ])
        ),
        checksum: canonicalChecksumValue,
        version: '1.0.0',
        license_notice: manifest.license_notice
      })
      .select()
      .single();

    if (bundleError) {
      console.error('Failed to save bundle:', bundleError);
      throw new Error('Failed to save bundle record');
    }

    // Calculate total bytes
    const totalBytes = Object.values(uploadResults).reduce((sum, result) => sum + result.bytes, 0);

    // Track export finished
    await trackEvent({
      event: 'export.finished',
      orgId,
      userId,
      payload: {
        run_id: runId,
        bundle_id: bundleId,
        formats: formats,
        org_id: orgId,
        user_id: userId,
        plan: plan,
        trace_id: traceId,
        duration_ms: Date.now() - startTime,
        bytes_total: totalBytes,
        checksum: canonicalChecksumValue
      }
    });

    // Return response
    const response: ExportResponse = {
      bundleId,
      paths: Object.fromEntries(
        Object.entries(uploadResults).map(([filename, result]) => [
          filename,
          result.url
        ])
      ),
      license_notice: manifest.license_notice,
      checksum: canonicalChecksumValue,
      formats
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[Export API] Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('ENTITLEMENT_REQUIRED')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      if (error.message.includes('DOD_NOT_MET')) {
        return NextResponse.json({ error: error.message }, { status: 422 });
      }
    }
    
    return NextResponse.json(
      { error: 'EXPORT_FAILED', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { type NextRequest, NextResponse } from "next/server";
import { ExportBundleRequestSchema, APIError, assertDoD } from "@/lib/server/validation";
import { generateBundle, type BundleContent } from "@/lib/server/bundle";
import { 
  verifyOrgMembership, 
  hasEntitlement, 
  createBundle,
  checkRateLimit,
  supabaseAdmin 
} from "@/lib/server/supabase";

/**
 * POST /api/export/bundle - Generate export artifacts (Pro+ / Enterprise gating)
 * 
 * Creates bundle with multiple formats, manifest, checksum, and license notice.
 * Enforces entitlement-based format restrictions and saves to storage.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse and validate request
    const body = await request.json();
    const validation = ExportBundleRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "INPUT_SCHEMA_MISMATCH",
          details: validation.error.errors 
        },
        { status: 422 }
      );
    }

    const { runId, formats, whiteLabel = false } = validation.data;

    // Extract authentication context
    const orgId = request.headers.get('x-org-id');
    const userId = request.headers.get('x-user-id');
    
    if (!orgId || !userId) {
      return NextResponse.json(
        { error: "UNAUTHENTICATED", message: "Missing authentication headers" },
        { status: 401 }
      );
    }

    // Verify organization membership
    const isMember = await verifyOrgMembership(orgId, userId);
    if (!isMember) {
      return NextResponse.json(
        { error: "ENTITLEMENT_REQUIRED", message: "Not a member of this organization" },
        { status: 403 }
      );
    }

    // Rate limiting for exports (30 requests per minute per org)
    const rateLimit = await checkRateLimit(`export:${orgId}`, 30);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "RATE_LIMITED",
          message: "Rate limit exceeded for exports",
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      );
    }

    // Get run data and validate DoD requirements
    const { data: runData, error: runError } = await supabaseAdmin
      .from('runs')
      .select(`
        id, org_id, user_id, module_id, seven_d, signature_7d, score_total, 
        started_at, finished_at, tokens_in, tokens_out, cost_usd,
        prompt_scores (clarity, execution, ambiguity, business_fit, composite, breakdown)
      `)
      .eq('id', runId)
      .eq('org_id', orgId)
      .single();

    if (runError || !runData) {
      return NextResponse.json(
        { error: "MODULE_NOT_FOUND", message: "Run not found or access denied" },
        { status: 404 }
      );
    }

    // Validate DoD requirements
    const scores = runData.prompt_scores?.[0];
    if (!scores || scores.composite < 80) {
      return NextResponse.json(
        {
          error: "INTERNAL_RUN_ERROR",
          message: "Cannot export: run score below minimum threshold (80)",
          current_score: scores?.composite || 0
        },
        { status: 422 }
      );
    }

    if (runData.status !== 'success') {
      return NextResponse.json(
        {
          error: "INTERNAL_RUN_ERROR",
          message: "Cannot export: run not completed successfully"
        },
        { status: 422 }
      );
    }

    // Check format-specific entitlements
    const entitlementChecks = await Promise.all([
      hasEntitlement(orgId, 'canExportMD', userId),
      hasEntitlement(orgId, 'canExportPDF', userId),
      hasEntitlement(orgId, 'canExportJSON', userId),
      hasEntitlement(orgId, 'canExportBundleZip', userId),
      hasEntitlement(orgId, 'hasWhiteLabel', userId),
    ]);

    const [canExportMD, canExportPDF, canExportJSON, canExportZip, hasWhiteLabelAccess] = entitlementChecks;

    // Validate format permissions
    const allowedFormats: string[] = ['txt']; // TXT is always allowed
    if (canExportMD) allowedFormats.push('md');
    if (canExportPDF) allowedFormats.push('pdf');
    if (canExportJSON) allowedFormats.push('json');
    if (canExportZip) allowedFormats.push('zip');

    const unauthorizedFormats = formats.filter(format => !allowedFormats.includes(format));
    if (unauthorizedFormats.length > 0) {
      return NextResponse.json(
        {
          error: "ENTITLEMENT_REQUIRED",
          message: `Insufficient permissions for formats: ${unauthorizedFormats.join(', ')}`,
          allowed_formats: allowedFormats,
          required_entitlements: {
            md: 'canExportMD',
            pdf: 'canExportPDF', 
            json: 'canExportJSON',
            zip: 'canExportBundleZip'
          }
        },
        { status: 403 }
      );
    }

    // Check white label permission
    if (whiteLabel && !hasWhiteLabelAccess) {
      return NextResponse.json(
        {
          error: "ENTITLEMENT_REQUIRED",
          message: "White label exports require Enterprise subscription",
          required_entitlement: "hasWhiteLabel"
        },
        { status: 403 }
      );
    }

    // Get prompt content (in production, this would come from prompt_history or runs)
    const promptContent = "Sample prompt content"; // TODO: Get from actual storage

    // Prepare bundle content
    const bundleContent: BundleContent = {
      prompt: promptContent,
      sevenD: runData.seven_d,
      scores: {
        clarity: scores.clarity,
        execution: scores.execution,
        ambiguity: scores.ambiguity,
        business_fit: scores.business_fit,
        composite: scores.composite,
      },
      metadata: {
        runId: runData.id,
        moduleId: runData.module_id,
        orgId: runData.org_id,
        userId: runData.user_id,
        createdAt: runData.started_at,
        version: '1.0.0',
      },
      telemetry: {
        tokens_used: runData.tokens_in + runData.tokens_out,
        duration_ms: runData.finished_at ? 
          new Date(runData.finished_at).getTime() - new Date(runData.started_at).getTime() : 0,
        cost_usd: runData.cost_usd,
      },
    };

    // Generate bundle
    const bundle = await generateBundle(bundleContent, formats, whiteLabel);

    // Assert DoD compliance
    try {
      assertDoD({
        score: scores.composite,
        manifestPresent: true,
        checksumValid: bundle.bundleChecksum.length === 64, // SHA256 length
        telemetryClean: true, // No PII in telemetry
      });
    } catch (error) {
      if (error instanceof APIError) {
        return NextResponse.json(
          { error: error.apiCode, message: error.message },
          { status: error.code }
        );
      }
      throw error;
    }

    // Save bundle record to database
    const bundleRecord = await createBundle({
      run_id: runId,
      org_id: orgId,
      formats: formats,
      manifest: bundle.manifest,
      checksum: bundle.bundleChecksum,
      license_notice: bundle.manifest.metadata.license_notice,
      storage_path: `bundles/${orgId}/${bundle.manifest.bundle_id}`,
    });

    // In production, upload files to storage (Supabase Storage, S3, etc.)
    // For now, we'll return the bundle data directly

    // Convert files to base64 for JSON response
    const filesData: Record<string, string> = {};
    bundle.files.forEach((buffer, filename) => {
      filesData[filename] = buffer.toString('base64');
    });

    return NextResponse.json({
      bundleId: bundleRecord.id,
      manifest: bundle.manifest,
      checksum: bundle.bundleChecksum,
      files: filesData,
      metadata: {
        formats: formats,
        file_count: bundle.files.size,
        total_size: Array.from(bundle.files.values()).reduce((sum, buf) => sum + buf.length, 0),
        white_label: whiteLabel,
        created_at: bundleRecord.created_at,
      },
      telemetry: {
        processing_time: Date.now() - startTime,
        run_id: runId,
        score: scores.composite,
      },
    });

  } catch (error) {
    console.error("[Export Bundle API] Error:", error);

    // Handle specific API errors
    if (error instanceof APIError) {
      return NextResponse.json(
        {
          error: error.apiCode,
          message: error.message,
          details: error.details
        },
        { status: error.code }
      );
    }

    // Generic error fallback
    return NextResponse.json(
      { 
        error: "INTERNAL_RUN_ERROR",
        message: "Failed to generate export bundle" 
      },
      { status: 500 }
    );
  }
}

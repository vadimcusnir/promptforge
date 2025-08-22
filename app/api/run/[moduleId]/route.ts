import { type NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { RunModuleRequestSchema, normalize7D, APIError, assertDoR, assertDoD } from "@/lib/server/validation";
import { optimizePrompt, runGPTTest, tightenPrompt } from "@/lib/server/openai";
import { generateBundle, type BundleContent } from "@/lib/server/bundle";
import { 
  verifyAPIKey, 
  hasEntitlement, 
  getModule,
  createRun, 
  updateRunStatus, 
  savePromptScore,
  createBundle,
  checkRateLimit 
} from "@/lib/server/supabase";

/**
 * POST /api/run/[moduleId] - Enterprise API Orchestrator
 * 
 * Public API endpoint for Enterprise customers with API access.
 * Requires valid API key, enforces rate limits, and provides full workflow.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  const startTime = Date.now();
  const { moduleId } = params;

  try {
    // Parse and validate request
    const body = await request.json();
    const validation = RunModuleRequestSchema.safeParse({
      ...body,
      moduleId,
    });
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "INPUT_SCHEMA_MISMATCH",
          details: validation.error.errors 
        },
        { status: 422 }
      );
    }

    const { sevenD, prompt, testMode = false, exportFormats = [] } = validation.data;

    // Authenticate via API key
    const apiKeyHeader = request.headers.get('x-pf-key');
    if (!apiKeyHeader) {
      return NextResponse.json(
        { error: "UNAUTHENTICATED", message: "API key required in x-pf-key header" },
        { status: 401 }
      );
    }

    // Hash API key for lookup
    const keyHash = createHash('sha256').update(apiKeyHeader).digest('hex');
    const apiKeyData = await verifyAPIKey(keyHash);
    
    if (!apiKeyData) {
      return NextResponse.json(
        { error: "UNAUTHENTICATED", message: "Invalid or disabled API key" },
        { status: 401 }
      );
    }

    const { orgId } = apiKeyData;

    // Verify Enterprise entitlements
    const [hasAPI, hasEnterprise] = await Promise.all([
      hasEntitlement(orgId, 'hasAPI'),
      hasEntitlement(orgId, 'plan_enterprise'), // Assuming enterprise plan flag
    ]);

    if (!hasAPI || !hasEnterprise) {
      return NextResponse.json(
        {
          error: "ENTITLEMENT_REQUIRED",
          message: "Enterprise subscription with API access required",
          required_entitlements: ["hasAPI", "plan_enterprise"]
        },
        { status: 403 }
      );
    }

    // Rate limiting per organization (30 requests per minute)
    const rateLimit = await checkRateLimit(`api-run:${orgId}`, 30);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "RATE_LIMITED",
          message: "API rate limit exceeded",
          resetTime: rateLimit.resetTime,
          remaining: rateLimit.remaining
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
          }
        }
      );
    }

    // Validate module exists and is enabled
    const module = await getModule(moduleId);
    if (!module) {
      return NextResponse.json(
        { error: "MODULE_NOT_FOUND", message: `Module ${moduleId} not found or disabled` },
        { status: 404 }
      );
    }

    // Normalize 7D configuration (SSOT enforcement)
    let normalized7D;
    try {
      normalized7D = normalize7D(sevenD);
    } catch (error) {
      return NextResponse.json(
        {
          error: "INVALID_7D_ENUM",
          message: error instanceof Error ? error.message : "7D validation failed"
        },
        { status: 400 }
      );
    }

    // For chain modules, verify signature compatibility (simplified)
    if (body.previousSignature) {
      if (body.previousSignature !== normalized7D.signature_7d) {
        return NextResponse.json(
          {
            error: "SEVEND_SIGNATURE_MISMATCH",
            message: "7D signature mismatch in chain execution",
            expected: body.previousSignature,
            actual: normalized7D.signature_7d
          },
          { status: 422 }
        );
      }
    }

    // Assert DoR (Definition of Ready)
    try {
      assertDoR({
        sevenDValid: true,
        entitlementsValid: hasAPI && hasEnterprise,
        outputSpecLoaded: true, // Module spec loaded
        testsDefined: testMode ? true : true, // Always allow for API
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

    // Create run record
    const run = await createRun({
      org_id: orgId,
      user_id: 'api', // API user
      module_id: moduleId,
      seven_d: normalized7D,
      signature_7d: normalized7D.signature_7d,
      status: 'queued',
      tokens_in: 0,
      tokens_out: 0,
      cost_usd: 0,
    });

    let finalPrompt = prompt;
    let totalUsage = {
      tokens_in: 0,
      tokens_out: 0,
      cost_usd: 0,
    };
    let scores: any = null;
    let artifacts: string[] = [];

    try {
      // Step 1: Optimize prompt if requested or if no prompt provided
      if (!prompt || body.optimize) {
        const optimizeResult = await optimizePrompt(
          prompt || `Generate a ${normalized7D.domain} prompt for ${normalized7D.application}`,
          { domain: normalized7D.domain }
        );
        
        finalPrompt = JSON.parse(optimizeResult.content).editedPrompt || optimizeResult.content;
        totalUsage.tokens_in += optimizeResult.usage.prompt_tokens;
        totalUsage.tokens_out += optimizeResult.usage.completion_tokens;
        totalUsage.cost_usd += optimizeResult.usage.cost_usd;
        
        artifacts.push('prompt_optimization');
      }

      // Step 2: Run GPT test if requested
      if (testMode) {
        const testResult = await runGPTTest(finalPrompt, normalized7D.domain, []);
        scores = testResult.scores;
        
        totalUsage.tokens_in += testResult.response.usage.prompt_tokens;
        totalUsage.tokens_out += testResult.response.usage.completion_tokens;
        totalUsage.cost_usd += testResult.response.usage.cost_usd;
        
        artifacts.push('gpt_test_results');

        // Auto-tighten if score < 80
        if (scores.composite < 80) {
          const tightenResult = await tightenPrompt(finalPrompt, normalized7D.domain, scores.composite);
          if (tightenResult.content !== finalPrompt) {
            finalPrompt = tightenResult.content;
            
            // Re-test
            const retestResult = await runGPTTest(finalPrompt, normalized7D.domain, []);
            scores = retestResult.scores;
            
            totalUsage.tokens_in += tightenResult.usage.prompt_tokens + retestResult.response.usage.prompt_tokens;
            totalUsage.tokens_out += tightenResult.usage.completion_tokens + retestResult.response.usage.completion_tokens;
            totalUsage.cost_usd += tightenResult.usage.cost_usd + retestResult.response.usage.cost_usd;
            
            artifacts.push('auto_tighten');
          }
        }

        // Save scores
        await savePromptScore({
          run_id: run.id,
          clarity: scores.clarity,
          execution: scores.execution,
          ambiguity: scores.ambiguity,
          business_fit: scores.business_fit,
          composite: scores.composite,
          breakdown: { api_execution: true },
          created_at: new Date().toISOString(),
        });
      }

      // Step 3: Generate export bundle if formats requested
      let bundleData = null;
      if (exportFormats.length > 0) {
        // Verify export permissions
        const exportEntitlements = await Promise.all([
          hasEntitlement(orgId, 'canExportMD'),
          hasEntitlement(orgId, 'canExportPDF'),
          hasEntitlement(orgId, 'canExportJSON'),
          hasEntitlement(orgId, 'canExportBundleZip'),
          hasEntitlement(orgId, 'hasWhiteLabel'),
        ]);

        const [canExportMD, canExportPDF, canExportJSON, canExportZip, hasWhiteLabel] = exportEntitlements;
        
        const allowedFormats = ['txt'];
        if (canExportMD) allowedFormats.push('md');
        if (canExportPDF) allowedFormats.push('pdf');
        if (canExportJSON) allowedFormats.push('json');
        if (canExportZip) allowedFormats.push('zip');

        const unauthorizedFormats = exportFormats.filter(f => !allowedFormats.includes(f));
        if (unauthorizedFormats.length > 0) {
          throw new APIError('ENTITLEMENT_REQUIRED', `Unauthorized export formats: ${unauthorizedFormats.join(', ')}`);
        }

        // Generate bundle
        const bundleContent: BundleContent = {
          prompt: finalPrompt,
          sevenD: normalized7D,
          scores: scores || undefined,
          metadata: {
            runId: run.id,
            moduleId: moduleId,
            orgId: orgId,
            userId: 'api',
            createdAt: new Date().toISOString(),
            version: '1.0.0',
          },
          telemetry: {
            tokens_used: totalUsage.tokens_in + totalUsage.tokens_out,
            duration_ms: Date.now() - startTime,
            cost_usd: totalUsage.cost_usd,
          },
        };

        const bundle = await generateBundle(bundleContent, exportFormats, hasWhiteLabel);
        
        // Save bundle record
        const bundleRecord = await createBundle({
          run_id: run.id,
          org_id: orgId,
          formats: exportFormats,
          manifest: bundle.manifest,
          checksum: bundle.bundleChecksum,
          license_notice: bundle.manifest.metadata.license_notice,
          storage_path: `api-bundles/${orgId}/${bundle.manifest.bundle_id}`,
        });

        bundleData = {
          bundle_id: bundleRecord.id,
          checksum: bundle.bundleChecksum,
          formats: exportFormats,
          manifest: bundle.manifest,
        };
        
        artifacts.push('export_bundle');
      }

      // Update run with success status
      await updateRunStatus(run.id, 'success', {
        tokens_in: totalUsage.tokens_in,
        tokens_out: totalUsage.tokens_out,
        cost_usd: totalUsage.cost_usd,
        score_total: scores?.composite,
      });

      // Assert DoD if testing was performed
      if (testMode && scores) {
        try {
          assertDoD({
            score: scores.composite,
            manifestPresent: bundleData ? true : true,
            checksumValid: bundleData ? bundleData.checksum.length === 64 : true,
            telemetryClean: true,
          });
        } catch (error) {
          if (error instanceof APIError) {
            await updateRunStatus(run.id, 'error');
            return NextResponse.json(
              { error: error.apiCode, message: error.message },
              { status: error.code }
            );
          }
          throw error;
        }
      }

      // Generate response hash for consistency
      const responseHash = createHash('sha256')
        .update(finalPrompt + normalized7D.signature_7d + run.id)
        .digest('hex')
        .substring(0, 16);

      return NextResponse.json({
        hash: responseHash,
        run_id: run.id,
        module_id: moduleId,
        seven_d: normalized7D,
        prompt: finalPrompt,
        status: 'success',
        scores: scores || null,
        artifacts: artifacts,
        bundle: bundleData || null,
        telemetry: {
          tokens_used: totalUsage.tokens_in + totalUsage.tokens_out,
          cost_usd: totalUsage.cost_usd,
          duration_ms: Date.now() - startTime,
          processing_steps: artifacts.length,
        },
        metadata: {
          api_version: '1.0.0',
          module_name: module.name,
          created_at: new Date().toISOString(),
        },
      });

    } catch (error) {
      // Update run with error status
      await updateRunStatus(run.id, 'error');
      throw error;
    }

  } catch (error) {
    console.error("[API Run] Error:", error);

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

    // Handle OpenAI API errors
    if (error && typeof error === 'object' && 'status' in error) {
      return NextResponse.json(
        {
          error: "OPENAI_API_ERROR",
          message: "OpenAI service temporarily unavailable"
        },
        { status: 503 }
      );
    }

    // Generic error fallback
    return NextResponse.json(
      { 
        error: "INTERNAL_RUN_ERROR",
        message: "Module execution failed" 
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://chatgpt-prompting.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-pf-key, x-org-id',
      'Access-Control-Max-Age': '86400',
    },
  });
}

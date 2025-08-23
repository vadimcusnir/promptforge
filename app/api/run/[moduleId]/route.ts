import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { withEntitlementGate } from "@/lib/gating";
import { logRunTelemetry } from "@/lib/telemetry";
import { generatePrompt } from "@/lib/ai/generator";
import { evaluatePrompt } from "@/lib/ai/evaluator";
import { createBundle } from "@/lib/exports";
import { validateParams7D } from "@/lib/param-engine";

// Request schema validation
const RunRequestSchema = z.object({
  // 7D Parameters (required)
  domain: z.enum([
    "saas", "fintech", "ecommerce", "consulting", "education", 
    "healthcare", "legal", "marketing", "media", "real_estate",
    "hr", "ngo", "government", "web3", "aiml", "cybersecurity",
    "manufacturing", "logistics", "travel", "gaming", 
    "fashion", "beauty", "spiritual", "architecture", "agriculture"
  ]),
  scale: z.enum(["personal_brand", "solo", "startup", "boutique_agency", "smb", "corporate", "enterprise"]),
  urgency: z.enum(["low", "planned", "sprint", "pilot", "crisis"]),
  complexity: z.enum(["foundational", "standard", "advanced", "expert"]),
  resources: z.enum(["minimal", "solo", "lean_team", "agency_stack", "full_stack_org", "enterprise_budget"]),
  application: z.enum(["training", "audit", "implementation", "strategy_design", "crisis_response", "experimentation", "documentation"]),
  output_format: z.enum(["txt", "md", "checklist", "spec", "playbook", "json", "yaml", "diagram", "bundle"]),
  
  // Optional context
  context: z.string().max(5000).optional(),
  specific_requirements: z.string().max(2000).optional(),
  
  // API key (for Enterprise external access)
  api_key: z.string().optional()
});

export async function POST(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  const startTime = Date.now();
  let runId: string | undefined;
  let orgId: string | undefined;
  let userId: string | undefined;

  try {
    // Parse request body
    const body = await request.json();
    const validatedInput = RunRequestSchema.parse(body);
  const { moduleId } = params;

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Authentication & authorization
    let user;
    if (validatedInput.api_key) {
      // API key authentication (Enterprise)
      const { data: apiKey } = await supabase
        .from("api_keys")
        .select("org_id, scopes, rate_limit_rpm, revoked_at")
        .eq("key_hash", validatedInput.api_key)
        .is("revoked_at", null)
        .single();

      if (!apiKey) {
    return NextResponse.json(
          { error: "Invalid API key" },
          { status: 401 }
        );
      }

      if (!apiKey.scopes?.includes("run_modules")) {
    return NextResponse.json(
          { error: "API key lacks run_modules scope" },
          { status: 403 }
        );
      }

      orgId = apiKey.org_id;
      userId = "api_user"; // Special user for API calls
    } else {
      // Session authentication
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (!sessionUser) {
    return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
      user = sessionUser;
      userId = user.id;

      // Get user's org
      const { data: orgMember } = await supabase
        .from("org_members")
        .select("org_id")
        .eq("user_id", userId)
        .single();

      if (!orgMember) {
    return NextResponse.json(
          { error: "User not associated with any organization" },
          { status: 403 }
        );
      }
      orgId = orgMember.org_id;
    }

    // Validate module exists and user can access it
    const { data: module } = await supabase
      .from("modules")
      .select("id, title, vectors, complexity_min")
      .eq("id", moduleId)
      .single();

    if (!module) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    // Check entitlements
    if (orgId) {
      await withEntitlementGate(orgId, ["canUseAllModules"], async () => {
        // Additional module-specific checks
        const { data: allowedModules } = await supabase.rpc("pf_get_allowed_modules", { p_org: orgId });
        if (allowedModules && !allowedModules.includes(moduleId)) {
          throw new Error("Module not included in current plan");
        }
      });
    }

    // Validate 7D parameters
    if (orgId) {
      const normalizedParams = await validateParams7D(validatedInput, moduleId);

      // Check complexity requirements
      const complexityLevels = ["foundational", "standard", "advanced", "expert"];
      const minComplexityIndex = complexityLevels.indexOf(module.complexity_min);
      const userComplexityIndex = complexityLevels.indexOf(validatedInput.complexity);
      
      if (userComplexityIndex < minComplexityIndex) {
        return NextResponse.json(
          { 
            error: "Complexity level too low for this module",
            minimum_required: module.complexity_min,
            provided: validatedInput.complexity
          },
          { status: 400 }
        );
      }

      // Generate unique run ID and hash
      runId = crypto.randomUUID();
      const runHash = await generateRunHash(normalizedParams, moduleId);

      // Check for duplicate run (same module + same params)
      const { data: existingRun } = await supabase
        .from("runs")
        .select("id, status, created_at")
        .eq("org_id", orgId)
        .eq("module_id", moduleId) 
        .eq("run_hash", runHash)
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24h
        .single();

      if (existingRun && existingRun.status === "ok") {
        // Return cached result if recent and successful
        const { data: existingBundle } = await supabase
          .from("bundles")
          .select("*")
          .eq("run_id", existingRun.id)
          .single();

        if (existingBundle) {
          return NextResponse.json({
            run_id: existingRun.id,
            status: "cached",
            bundle_id: existingBundle.id,
            created_at: existingRun.created_at
          });
        }
      }

      // Create run record
      const { error: runError } = await supabase
        .from("runs")
        .insert({
          id: runId,
          org_id: orgId,
          user_id: userId,
          module_id: moduleId,
          run_hash: runHash,
          parameter_set_7d: normalizedParams,
          mode: validatedInput.api_key ? "real" : "sim", // API calls default to real mode
          status: "running"
        });

      if (runError) {
        throw new Error(`Failed to create run record: ${runError.message}`);
      }

    // Generate prompt
    const generationStart = Date.now();
    const promptResult = await generatePrompt({
      moduleId,
      parameters: normalizedParams,
      context: validatedInput.context,
      requirements: validatedInput.specific_requirements
    });
    const generationTime = Date.now() - generationStart;

    // Evaluate prompt (if real mode and entitlement allows)
    let evaluation = null;
    if (validatedInput.api_key || await hasEntitlement(orgId, "hasEvaluatorAI")) {
      const evaluationStart = Date.now();
      evaluation = await evaluatePrompt(promptResult.content, normalizedParams.domain);
      const evaluationTime = Date.now() - evaluationStart;

      // Store evaluation
      await supabase.from("scores").insert({
        run_id: runId,
        clarity: evaluation.scores.clarity,
        execution: evaluation.scores.execution,
        ambiguity: evaluation.scores.ambiguity,
        businessFit: evaluation.scores.businessFit,
        feedback: evaluation.feedback
      });
    }

    // Create export bundle
    const bundleStart = Date.now();
    let bundle;
    if (orgId) {
      bundle = await createBundle({
        runId: runId!,
        moduleId,
        content: promptResult.content,
        parameters: normalizedParams,
        evaluation,
        outputFormat: validatedInput.output_format,
        orgId
      });
    }
    const bundleTime = Date.now() - bundleStart;

    // Update run with success status and telemetry
    const totalTime = Date.now() - startTime;
    const telemetryData = {
      generation_time_ms: generationTime,
      evaluation_time_ms: evaluation ? Date.now() - startTime - generationTime - bundleTime : null,
      bundle_time_ms: bundleTime,
      total_time_ms: totalTime,
      tokens_used: promptResult.usage?.total_tokens || 0,
      estimated_cost_usd: promptResult.usage?.estimated_cost || 0
    };

    await supabase
      .from("runs")
      .update({
        status: "ok",
        runtime_ms: totalTime,
        tokens: telemetryData.tokens_used,
        cost_usd: telemetryData.estimated_cost_usd,
        telemetry: telemetryData
      })
      .eq("id", runId);

    // Log telemetry
    if (runId && orgId && userId) {
      await logRunTelemetry({
        runId,
        orgId,
        userId,
        moduleId,
        parameters: normalizedParams,
        telemetry: telemetryData,
        evaluation
      });
    }

    return NextResponse.json({
      run_id: runId,
      bundle_id: bundle?.id || null,
      status: "completed",
      evaluation: evaluation ? {
        scores: evaluation.scores,
        feedback: evaluation.feedback
      } : null,
      telemetry: {
        total_time_ms: totalTime,
        tokens_used: telemetryData.tokens_used,
        estimated_cost_usd: telemetryData.estimated_cost_usd
      },
      created_at: new Date().toISOString()
    });

  } catch (error) {
    console.error("Run API error:", error);

    // Update run status to failed if run was created
    if (runId) {
      const supabase = createRouteHandlerClient({ cookies });
      await supabase.from("runs").update({
        status: "failed",
        runtime_ms: Date.now() - startTime
      }).eq("id", runId);
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    if (errorMessage.includes("entitlement") || errorMessage.includes("plan")) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 402 } // Payment required
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions
async function generateRunHash(params: any, moduleId: string): Promise<string> {
  const hashInput = JSON.stringify({ ...params, moduleId });
  const encoder = new TextEncoder();
  const data = encoder.encode(hashInput);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hasEntitlement(orgId: string, flag: string): Promise<boolean> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data } = await supabase.rpc("pf_has_entitlement", { 
    p_org: orgId, 
    p_flag: flag 
  });
  return data || false;
}
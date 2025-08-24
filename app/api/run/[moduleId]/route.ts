import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookies } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { generatePrompt } from "@/lib/prompt-generator";
import { modules } from "@/lib/modules";
import { logEvent } from "@/lib/telemetry";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Rate limiting configuration
const RATE_LIMITS = {
  free: { requests: 10, window: 3600 }, // 10 requests per hour
  creator: { requests: 100, window: 3600 }, // 100 requests per hour
  pro: { requests: 1000, window: 3600 }, // 1000 requests per hour
  enterprise: { requests: 10000, window: 3600 }, // 10000 requests per hour
};

interface RunRequest {
  sevenDConfig: any;
  customParameters?: Record<string, any>;
  telemetry?: {
    sessionId?: string;
    clientInfo?: string;
    userAgent?: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    const user = await getUserFromCookies();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user entitlements
    const { data: entitlements } = await supabase
      .from("user_entitlements")
      .select("*")
      .eq("user_id", user.email)
      .single();

    if (!entitlements) {
      return NextResponse.json(
        { error: "User entitlements not found" },
        { status: 403 }
      );
    }

    // Check if user has Enterprise plan for this API
    if (entitlements.plan_tier !== "enterprise") {
      return NextResponse.json(
        { 
          error: "Enterprise plan required",
          requiredPlan: "enterprise",
          currentPlan: entitlements.plan_tier,
          upgradeUrl: "/pricing"
        },
        { status: 403 }
      );
    }

    // Rate limiting check
    if (!user.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }
    
    const rateLimit = await checkRateLimit(user.email, entitlements.plan_tier);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          retryAfter: rateLimit.retryAfter,
          limit: rateLimit.limit,
          window: rateLimit.window
        },
        { status: 429 }
      );
    }

    // Validate module ID
    const module = modules.find(m => m.id.toString() === moduleId);
    if (!module) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    const body: RunRequest = await request.json();
    const { sevenDConfig, customParameters, telemetry } = body;

    // Basic validation of 7-D configuration
    if (!sevenDConfig || typeof sevenDConfig !== "object") {
      return NextResponse.json(
        { 
          error: "Invalid 7-D configuration",
          details: "sevenDConfig must be an object"
        },
        { status: 400 }
      );
    }

    // Generate prompt with enhanced parameters for Enterprise
    const promptResult = await generatePrompt(module.id, sevenDConfig);

    // Track usage for Enterprise users
    await trackEnterpriseUsage(user.email, moduleId, {
      sevenDConfig,
      customParameters,
      telemetry,
      promptLength: promptResult.content.length,
      tokens: promptResult.tokens || 0,
    });

    // Enhanced response for Enterprise users
    const response = {
      success: true,
      data: {
        prompt: promptResult,
        module: {
          id: module.id,
          name: module.name,
          description: module.description,
          vector: module.vector,
        },
        sevenDConfig: sevenDConfig,
        customParameters: customParameters || {},
        telemetry: {
          sessionId: telemetry?.sessionId,
          timestamp: new Date().toISOString(),
          usageId: `ent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        },
        artifacts: {
          promptHash: await generateHash(promptResult.content),
          configHash: await generateHash(JSON.stringify(sevenDConfig)),
          metadataHash: await generateHash(JSON.stringify(customParameters || {})),
        },
        rateLimit: {
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime,
        },
      },
    };

    // Log Enterprise API usage
    await logEvent({
      event: "enterprise_api_used",
      orgId: "enterprise",
      userId: user.email,
      payload: {
        moduleId,
        sevenDConfig,
        customParameters,
        promptLength: promptResult.content.length,
        tokens: promptResult.tokens || 0,
        rateLimitRemaining: rateLimit.remaining,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in Enterprise API:", error);
    
    // Log error for Enterprise users
    const moduleId = params ? await params.then(p => p.moduleId) : "unknown";
    await logEvent({
      event: "enterprise_api_error",
      orgId: "enterprise",
      userId: "system",
      payload: {
        error: error instanceof Error ? error.message : "Unknown error",
        moduleId,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function checkRateLimit(userId: string, planTier: string): Promise<{
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
  limit: number;
  window: number;
  resetTime: string;
}> {
  const config = RATE_LIMITS[planTier as keyof typeof RATE_LIMITS] || RATE_LIMITS.free;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - config.window;
  
  // Get current usage
  const { data: usage } = await supabase
    .from("api_usage")
    .select("id, requests_count, window_start")
    .eq("user_id", userId)
    .eq("window_start", windowStart)
    .single();

  const currentCount = usage?.requests_count || 0;
  const remaining = Math.max(0, config.requests - currentCount);
  const allowed = currentCount < config.requests;

  // Update usage count
  if (usage && usage.id) {
    await supabase
      .from("api_usage")
      .update({ 
        requests_count: currentCount + 1,
        updated_at: new Date().toISOString()
      })
      .eq("id", usage.id);
  } else {
    await supabase
      .from("api_usage")
      .insert({
        user_id: userId,
        window_start: windowStart,
        requests_count: 1,
        plan_tier: planTier,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
  }

  const resetTime = new Date((windowStart + config.window) * 1000).toISOString();

  return {
    allowed,
    remaining,
    limit: config.requests,
    window: config.window,
    resetTime,
    ...(allowed ? {} : { retryAfter: config.window - (now - windowStart) }),
  };
}

async function trackEnterpriseUsage(
  userId: string, 
  moduleId: string, 
  metadata: {
    sevenDConfig: any;
    customParameters?: Record<string, any>;
    telemetry?: any;
    promptLength: number;
    tokens: number;
  }
) {
  await supabase.from("enterprise_usage").insert({
    user_id: userId,
    module_id: moduleId,
    seven_d_config: metadata.sevenDConfig,
    custom_parameters: metadata.customParameters,
    telemetry: metadata.telemetry,
    prompt_length: metadata.promptLength,
    tokens: metadata.tokens,
    created_at: new Date().toISOString(),
  });
}

async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
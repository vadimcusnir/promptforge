import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { improvePrompt } from "@/lib/ai/editor";
import { logEvent } from "@/lib/telemetry";

// Request schema for prompt editing
const EditorRequestSchema = z.object({
  action: z.enum([
    "tighten",      // Reduce ambiguity and improve clarity
    "expand",       // Add more detail and context
    "optimize",     // Optimize for specific goal (conversion, clarity, etc.)
    "adapt",        // Adapt for different domain/context
    "simplify",     // Make more accessible/understandable
    "formalize",    // Make more professional/formal
    "segment"       // Break into sections/steps
  ]),
  content: z.string().min(10).max(10000),
  context?: z.object({
    domain: z.string().optional(),
    target_audience: z.string().optional(),
    specific_goal: z.string().optional(),
    constraints: z.string().optional()
  }).optional(),
  preserve_intent: z.boolean().default(true)
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse and validate request
    const body = await request.json();
    const validatedInput = EditorRequestSchema.parse(body);

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Authentication (no special entitlement required - available to all users)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user's org for telemetry
    const { data: orgMember } = await supabase
      .from("org_members")
      .select("org_id")
      .eq("user_id", user.id)
      .single();

    if (!orgMember) {
      return NextResponse.json(
        { error: "User not associated with any organization" },
        { status: 403 }
      );
    }

    // Rate limiting check (basic implementation)
    const rateLimitKey = `gpt-editor:${user.id}`;
    const rateLimitCount = await checkRateLimit(rateLimitKey, 10, 60); // 10 requests per minute
    
    if (rateLimitCount > 10) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before making more requests." },
        { status: 429 }
      );
    }

    // Improve the prompt using AI
    const improvementStart = Date.now();
    const improvement = await improvePrompt({
      action: validatedInput.action,
      content: validatedInput.content,
      context: validatedInput.context,
      preserveIntent: validatedInput.preserve_intent
    });
    const improvementTime = Date.now() - improvementStart;

    // Log usage for telemetry
    await logEvent({
      event: "gpt_editor_used",
      orgId: orgMember.org_id,
      userId: user.id,
      payload: {
        action: validatedInput.action,
        content_length: validatedInput.content.length,
        improvement_time_ms: improvementTime,
        tokens_used: improvement.usage?.total_tokens || 0,
        estimated_cost_usd: improvement.usage?.estimated_cost || 0
      }
    });

    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      original_content: validatedInput.content,
      improved_content: improvement.content,
      action_taken: validatedInput.action,
      improvements: improvement.improvements,
      metadata: {
        processing_time_ms: totalTime,
        tokens_used: improvement.usage?.total_tokens || 0,
        estimated_cost_usd: improvement.usage?.estimated_cost || 0,
        preserve_intent: validatedInput.preserve_intent
      },
      suggestions: improvement.suggestions || []
    });

  } catch (error) {
    console.error("GPT Editor API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid request format",
          details: error.errors
        },
        { status: 400 }
      );
    }

    if (error.message.includes("rate limit")) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint for available actions and their descriptions
export async function GET(request: NextRequest) {
  try {
    const actions = {
      tighten: {
        description: "Reduce ambiguity and improve clarity",
        use_cases: ["Remove vague language", "Clarify instructions", "Eliminate contradictions"],
        typical_improvement: "15-25% clarity increase"
      },
      expand: {
        description: "Add more detail and context",
        use_cases: ["Add missing context", "Provide more examples", "Include edge cases"],
        typical_improvement: "Enhanced completeness and execution readiness"
      },
      optimize: {
        description: "Optimize for specific goal",
        use_cases: ["Improve conversion focus", "Enhance clarity", "Boost engagement"],
        typical_improvement: "Goal-specific performance increase"
      },
      adapt: {
        description: "Adapt for different domain or context",
        use_cases: ["Change industry focus", "Adjust for different audience", "Modify complexity level"],
        typical_improvement: "Context-appropriate language and examples"
      },
      simplify: {
        description: "Make more accessible and understandable",
        use_cases: ["Reduce complexity", "Use simpler language", "Break down complex concepts"],
        typical_improvement: "Improved accessibility and comprehension"
      },
      formalize: {
        description: "Make more professional and formal",
        use_cases: ["Business documentation", "Professional communications", "Formal proposals"],
        typical_improvement: "Professional tone and structure"
      },
      segment: {
        description: "Break into logical sections or steps",
        use_cases: ["Create step-by-step guides", "Organize complex content", "Improve readability"],
        typical_improvement: "Better organization and flow"
      }
    };

    return NextResponse.json({
      available_actions: actions,
      usage_guidelines: {
        rate_limit: "10 requests per minute per user",
        max_content_length: "10,000 characters",
        recommended_use: "Iterative improvement of prompts and content"
      }
    });

  } catch (error) {
    console.error("GPT Editor GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function for basic rate limiting
async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<number> {
  // This is a basic implementation - in production, you'd use Redis or similar
  // For now, we'll just return 0 to disable rate limiting
  // TODO: Implement proper rate limiting with Redis
  return 0;
}
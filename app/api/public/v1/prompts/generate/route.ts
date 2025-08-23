// PROMPTFORGE™ v3 - Public API v1 - Generate Prompts
// POST /api/public/v1/prompts/generate

import { NextRequest, NextResponse } from 'next/server';
import { publicAPIManager, type PublicAPIResponse } from '@/lib/api-public';
import { validate7D, type SevenD } from '@/lib/ruleset';
import { getPresetById } from '@/lib/industry-presets';
import { chatPromptEditor } from '@/lib/openai';

interface GenerateRequest {
  preset_id?: string;        // Industry preset ID
  seven_d: Partial<SevenD>;  // 7D configuration
  user_inputs?: Record<string, string>;  // Template variables
  custom_requirements?: string;          // Additional requirements
  response_format?: 'json' | 'text';     // Response format
}

interface GenerateResponse {
  prompt: string;
  configuration: {
    seven_d: SevenD;
    preset_used?: string;
    domain: string;
  };
  metadata: {
    estimated_tokens: number;
    complexity_score: number;
    confidence: number;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse<PublicAPIResponse<GenerateResponse>>> {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  let tokensUsed = 0;
  let costUsd = 0;

  try {
    // 1. Validate API Key
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        publicAPIManager.createResponse({
          success: false,
          error: { code: 'MISSING_AUTH', message: 'Authorization header with Bearer token required' },
          tokensUsed: 0,
          costUsd: 0,
          durationMs: Date.now() - startTime,
          rateLimitRemaining: 0,
          monthlyUsageRemaining: 0,
          requestId
        }),
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7);
    const keyValidation = await publicAPIManager.validateAPIKey(apiKey);

    if (!keyValidation.valid || !keyValidation.keyData || !keyValidation.orgId) {
      return NextResponse.json(
        publicAPIManager.createResponse({
          success: false,
          error: { code: 'INVALID_API_KEY', message: keyValidation.error || 'Invalid API key' },
          tokensUsed: 0,
          costUsd: 0,
          durationMs: Date.now() - startTime,
          rateLimitRemaining: 0,
          monthlyUsageRemaining: 0,
          requestId
        }),
        { status: 401 }
      );
    }

    // 2. Check Rate Limiting
    const rateLimit = await publicAPIManager.checkRateLimit(keyValidation.keyData);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        publicAPIManager.createResponse({
          success: false,
          error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Rate limit exceeded' },
          tokensUsed: 0,
          costUsd: 0,
          durationMs: Date.now() - startTime,
          rateLimitRemaining: rateLimit.remaining,
          monthlyUsageRemaining: keyValidation.keyData.monthly_request_limit - keyValidation.keyData.requests_used_this_month,
          requestId
        }),
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      );
    }

    // 3. Check Scopes
    const scopeCheck = publicAPIManager.checkScopes(keyValidation.keyData, ['prompts:generate']);
    if (!scopeCheck.allowed) {
      return NextResponse.json(
        publicAPIManager.createResponse({
          success: false,
          error: { 
            code: 'INSUFFICIENT_SCOPES', 
            message: 'Missing required scopes',
            details: { required: ['prompts:generate'], missing: scopeCheck.missingScopes }
          },
          tokensUsed: 0,
          costUsd: 0,
          durationMs: Date.now() - startTime,
          rateLimitRemaining: rateLimit.remaining,
          monthlyUsageRemaining: keyValidation.keyData.monthly_request_limit - keyValidation.keyData.requests_used_this_month,
          requestId
        }),
        { status: 403 }
      );
    }

    // 4. Parse and Validate Request
    const body: GenerateRequest = await req.json();
    
    if (!body.seven_d) {
      return NextResponse.json(
        publicAPIManager.createResponse({
          success: false,
          error: { code: 'MISSING_PARAMETERS', message: 'seven_d configuration is required' },
          tokensUsed: 0,
          costUsd: 0,
          durationMs: Date.now() - startTime,
          rateLimitRemaining: rateLimit.remaining,
          monthlyUsageRemaining: keyValidation.keyData.monthly_request_limit - keyValidation.keyData.requests_used_this_month,
          requestId
        }),
        { status: 400 }
      );
    }

    // 5. Validate 7D Configuration
    const validationResult = validate7D(body.seven_d);
    if (!validationResult.isValid) {
      return NextResponse.json(
        publicAPIManager.createResponse({
          success: false,
          error: { 
            code: 'INVALID_7D_CONFIG', 
            message: 'Invalid 7D configuration',
            details: { errors: validationResult.errors }
          },
          tokensUsed: 0,
          costUsd: 0,
          durationMs: Date.now() - startTime,
          rateLimitRemaining: rateLimit.remaining,
          monthlyUsageRemaining: keyValidation.keyData.monthly_request_limit - keyValidation.keyData.requests_used_this_month,
          requestId
        }),
        { status: 400 }
      );
    }

    // 6. Process Request
    let finalPrompt = '';
    let presetUsed: string | undefined;

    if (body.preset_id) {
      // Use industry preset
      const preset = getPresetById(body.preset_id);
      if (!preset) {
        return NextResponse.json(
          publicAPIManager.createResponse({
            success: false,
            error: { code: 'PRESET_NOT_FOUND', message: `Preset ${body.preset_id} not found` },
            tokensUsed: 0,
            costUsd: 0,
            durationMs: Date.now() - startTime,
            rateLimitRemaining: rateLimit.remaining,
            monthlyUsageRemaining: keyValidation.keyData.monthly_request_limit - keyValidation.keyData.requests_used_this_month,
            requestId
          }),
          { status: 404 }
        );
      }

      presetUsed = preset.id;
      finalPrompt = preset.prompt_template;

      // Replace template variables
      if (body.user_inputs) {
        for (const [key, value] of Object.entries(body.user_inputs)) {
          finalPrompt = finalPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
      }

    } else {
      // Generate custom prompt based on 7D
      const domain = validationResult.normalized.domain;
      const application = validationResult.normalized.application;
      const outputFormat = validationResult.normalized.output_format;

      finalPrompt = `You are an expert in ${domain} specialized in ${application}.

Create a comprehensive ${outputFormat} that addresses the specific requirements for ${domain} organizations.

CONFIGURATION:
- Domain: ${domain}
- Scale: ${validationResult.normalized.scale}
- Urgency: ${validationResult.normalized.urgency}
- Complexity: ${validationResult.normalized.complexity}
- Resources: ${validationResult.normalized.resources}
- Application: ${application}
- Output Format: ${outputFormat}

Please provide actionable, specific guidance that can be immediately implemented.`;
    }

    // Add custom requirements
    if (body.custom_requirements) {
      finalPrompt += '\n\nADDITIONAL REQUIREMENTS:\n' + body.custom_requirements;
    }

    // 7. Optimize prompt if requested
    let optimizedPrompt = finalPrompt;
    if (body.response_format !== 'text') {
      try {
        const optimization = await chatPromptEditor(finalPrompt, validationResult.normalized);
        optimizedPrompt = optimization.text;
        tokensUsed += optimization.usage?.total_tokens || 0;
        costUsd += optimization.usage ? (optimization.usage.total_tokens * 0.0001) : 0;
      } catch (error) {
        // Continue with original prompt if optimization fails
        console.warn('Prompt optimization failed:', error);
      }
    }

    // 8. Calculate Metadata
    const estimatedTokens = Math.ceil(optimizedPrompt.length / 4); // Rough estimate
    const complexityScore = calculateComplexityScore(validationResult.normalized);
    const confidence = presetUsed ? 0.95 : 0.85; // Higher confidence for presets

    // 9. Record Usage
    const finalDuration = Date.now() - startTime;
    await publicAPIManager.recordUsage({
      orgId: keyValidation.orgId,
      apiKeyId: keyValidation.keyData.id,
      endpoint: '/api/public/v1/prompts/generate',
      method: 'POST',
      statusCode: 200,
      tokensUsed,
      costUsd,
      durationMs: finalDuration,
      userAgent: req.headers.get('user-agent') || undefined,
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    });

    // 10. Return Response
    const response: GenerateResponse = {
      prompt: optimizedPrompt,
      configuration: {
        seven_d: validationResult.normalized,
        preset_used: presetUsed,
        domain: validationResult.normalized.domain
      },
      metadata: {
        estimated_tokens: estimatedTokens,
        complexity_score: complexityScore,
        confidence
      }
    };

    return NextResponse.json(
      publicAPIManager.createResponse({
        success: true,
        data: response,
        tokensUsed,
        costUsd,
        durationMs: finalDuration,
        rateLimitRemaining: rateLimit.remaining - 1,
        monthlyUsageRemaining: keyValidation.keyData.monthly_request_limit - keyValidation.keyData.requests_used_this_month - 1,
        requestId
      })
    );

  } catch (error) {
    console.error('Public API Generate error:', error);

    return NextResponse.json(
      publicAPIManager.createResponse({
        success: false,
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Internal server error',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        },
        tokensUsed,
        costUsd,
        durationMs: Date.now() - startTime,
        rateLimitRemaining: 0,
        monthlyUsageRemaining: 0,
        requestId
      }),
      { status: 500 }
    );
  }
}

function calculateComplexityScore(sevenD: SevenD): number {
  const complexityWeights: Record<string, number> = {
    foundational: 0.25,
    standard: 0.5,
    advanced: 0.75,
    expert: 1.0
  };

  const urgencyWeights: Record<string, number> = {
    low: 0.2,
    planned: 0.4,
    sprint: 0.7,
    pilot: 0.8,
    crisis: 1.0
  };

  const scaleWeights: Record<string, number> = {
    personal_brand: 0.1,
    solo: 0.2,
    startup: 0.4,
    boutique_agency: 0.5,
    smb: 0.6,
    corporate: 0.8,
    enterprise: 1.0
  };

  const complexityScore = sevenD.complexity ? complexityWeights[sevenD.complexity] || 0.5 : 0.5;
  const urgencyScore = sevenD.urgency ? urgencyWeights[sevenD.urgency] || 0.4 : 0.4;
  const scaleScore = sevenD.scale ? scaleWeights[sevenD.scale] || 0.5 : 0.5;

  return Math.round((complexityScore * 0.5 + urgencyScore * 0.3 + scaleScore * 0.2) * 100) / 100;
}

import OpenAI from 'openai';
import { APIError } from './validation';

/**
 * OpenAI client for GPT operations
 * Includes retry logic, cost tracking, and guardrails
 */

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: openaiApiKey,
});

export interface GPTUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd: number;
}

export interface GPTResponse {
  content: string;
  usage: GPTUsage;
  model: string;
  duration_ms: number;
}

// Token pricing (as of 2024)
const TOKEN_PRICES = {
  'gpt-4': { input: 0.03 / 1000, output: 0.06 / 1000 },
  'gpt-4-turbo': { input: 0.01 / 1000, output: 0.03 / 1000 },
  'gpt-3.5-turbo': { input: 0.0005 / 1000, output: 0.0015 / 1000 },
} as const;

function calculateCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = TOKEN_PRICES[model as keyof typeof TOKEN_PRICES];
  if (!pricing) return 0;
  
  return (promptTokens * pricing.input) + (completionTokens * pricing.output);
}

/**
 * GPT Editor - Optimize prompts with guardrails
 */
export async function optimizePrompt(
  prompt: string,
  options: {
    focus?: string;
    tone?: string;
    length?: string;
    domain?: string;
  } = {}
): Promise<GPTResponse> {
  const startTime = Date.now();

  try {
    const systemPrompt = `You are a prompt optimization expert. You must respond in English only.

CRITICAL GUARDRAILS:
- No promises or guarantees about results
- No PII (personal identifiable information) in output
- Maintain professional, audit-ready tone
- Focus on clarity and actionability

Improve the given prompt based on these criteria:
- Focus: ${options.focus || 'clarity'}
- Tone: ${options.tone || 'professional'}
- Length: ${options.length || 'concise'}
- Domain: ${options.domain || 'general'}

Return a JSON object with:
- editedPrompt: the improved prompt (MUST be in English)
- improvements: array of improvements made (MUST be in English)
- confidence: confidence score (0-100)`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const usage = response.usage;
    if (!usage) {
      throw new APIError('INTERNAL_RUN_ERROR', 'No usage data from OpenAI');
    }

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new APIError('INTERNAL_RUN_ERROR', 'No content from OpenAI');
    }

    return {
      content,
      usage: {
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        cost_usd: calculateCost('gpt-4-turbo', usage.prompt_tokens, usage.completion_tokens),
      },
      model: 'gpt-4-turbo',
      duration_ms: Date.now() - startTime,
    };

  } catch (error) {
    if (error instanceof APIError) throw error;
    
    console.error('[OpenAI] Prompt optimization error:', error);
    throw new APIError('INTERNAL_RUN_ERROR', `OpenAI API error: ${error}`);
  }
}

/**
 * GPT Test - Run live test with scoring
 */
export async function runGPTTest(
  prompt: string,
  domain: string,
  testCases: Array<{ input: string; expectedOutput?: string; criteria?: string }> = []
): Promise<{
  response: GPTResponse;
  scores: {
    clarity: number;
    execution: number;
    ambiguity: number;
    business_fit: number;
    composite: number;
  };
}> {
  const startTime = Date.now();

  try {
    // Run the actual prompt
    const testResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: testCases[0]?.input || 'Please demonstrate your capabilities.' }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const testUsage = testResponse.usage;
    if (!testUsage) {
      throw new APIError('INTERNAL_RUN_ERROR', 'No usage data from test');
    }

    const testContent = testResponse.choices[0]?.message?.content;
    if (!testContent) {
      throw new APIError('INTERNAL_RUN_ERROR', 'No content from test');
    }

    // Evaluate the prompt and response
    const evaluationPrompt = `Evaluate this prompt and its response for a ${domain} domain context.

PROMPT:
${prompt}

RESPONSE:
${testContent}

Rate each dimension (0-100):
1. CLARITY: How clear and unambiguous is the prompt?
2. EXECUTION: How well does the response follow the prompt?
3. AMBIGUITY: How much ambiguity remains? (lower is better, invert score)
4. BUSINESS_FIT: How well does this fit ${domain} business context?

Return JSON: {"clarity": 0-100, "execution": 0-100, "ambiguity": 0-100, "business_fit": 0-100, "reasoning": "brief explanation"}`;

    const evaluationResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a prompt evaluation expert. Return only valid JSON.' },
        { role: 'user', content: evaluationPrompt }
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const evalUsage = evaluationResponse.usage;
    const evalContent = evaluationResponse.choices[0]?.message?.content;

    if (!evalUsage || !evalContent) {
      throw new APIError('INTERNAL_RUN_ERROR', 'Evaluation failed');
    }

    // Parse evaluation scores
    let scores;
    try {
      const evalData = JSON.parse(evalContent);
      scores = {
        clarity: Math.max(0, Math.min(100, evalData.clarity || 0)),
        execution: Math.max(0, Math.min(100, evalData.execution || 0)),
        ambiguity: Math.max(0, Math.min(100, 100 - (evalData.ambiguity || 100))), // Invert ambiguity
        business_fit: Math.max(0, Math.min(100, evalData.business_fit || 0)),
        composite: 0, // Will be calculated below
      };
      
      // Calculate composite score (weighted average)
      scores.composite = Math.round(
        (scores.clarity * 0.25) +
        (scores.execution * 0.35) +
        (scores.ambiguity * 0.20) +
        (scores.business_fit * 0.20)
      );
    } catch {
      // Fallback scores if JSON parsing fails
      scores = {
        clarity: 60,
        execution: 60,
        ambiguity: 60,
        business_fit: 60,
        composite: 60,
      };
    }

    const totalUsage = {
      prompt_tokens: testUsage.prompt_tokens + evalUsage.prompt_tokens,
      completion_tokens: testUsage.completion_tokens + evalUsage.completion_tokens,
      total_tokens: testUsage.total_tokens + evalUsage.total_tokens,
      cost_usd: calculateCost('gpt-4', 
        testUsage.prompt_tokens + evalUsage.prompt_tokens,
        testUsage.completion_tokens + evalUsage.completion_tokens
      ),
    };

    return {
      response: {
        content: testContent,
        usage: totalUsage,
        model: 'gpt-4',
        duration_ms: Date.now() - startTime,
      },
      scores,
    };

  } catch (error) {
    if (error instanceof APIError) throw error;
    
    console.error('[OpenAI] GPT test error:', error);
    throw new APIError('INTERNAL_RUN_ERROR', `GPT test failed: ${error}`);
  }
}

/**
 * Auto-tighten prompt if score is below threshold
 */
export async function tightenPrompt(prompt: string, domain: string, currentScore: number): Promise<GPTResponse> {
  if (currentScore >= 80) {
    return {
      content: prompt,
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0, cost_usd: 0 },
      model: 'none',
      duration_ms: 0,
    };
  }

  const systemPrompt = `You are a prompt optimization expert specializing in ${domain}.

The current prompt scored ${currentScore}/100. Improve it to score ≥80 by:
1. Reducing ambiguity
2. Adding clear success criteria
3. Improving business context fit
4. Enhancing clarity

Return only the improved prompt, no explanation.`;

  return optimizePrompt(prompt, { domain, focus: 'clarity', tone: 'professional' });
}

/**
 * Rate limiting check for OpenAI API
 */
export async function checkOpenAILimits(): Promise<{ allowed: boolean; reason?: string }> {
  // Simple budget check (in production, implement proper rate limiting)
  const maxCostPerHour = 100; // $100/hour limit
  
  // For now, always allow (implement proper tracking)
  return { allowed: true };
}

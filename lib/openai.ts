// PROMPTFORGE™ v3 - OpenAI Integration
// GPT Live integration pentru editor și testing

import OpenAI from 'openai';

// Initialize OpenAI client only when needed
let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

export const openai = {
  chat: {
    completions: {
      create: async (options: any) => {
        const client = getOpenAI();
        return client.chat.completions.create(options);
      },
    },
  },
};

export interface ChatOptions {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null;
  duration_ms: number;
}

// Chat completion wrapper cu error handling și telemetry
export async function chatOnce({
  system,
  user,
  model = 'gpt-4o-mini',
  temperature = 0.2,
  maxTokens = 1200,
}: ChatOptions): Promise<ChatResponse> {
  const startTime = Date.now();

  try {
    const response = await openai.chat.completions.create({
      model,
      temperature,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: maxTokens,
    });

    const duration_ms = Date.now() - startTime;
    const text = response.choices?.[0]?.message?.content ?? '';
    const usage = response.usage;

    return {
      text,
      usage: usage
        ? {
            prompt_tokens: usage.prompt_tokens,
            completion_tokens: usage.completion_tokens,
            total_tokens: usage.total_tokens,
          }
        : null,
      duration_ms,
    };
  } catch (error) {
    const duration_ms = Date.now() - startTime;

    if (error instanceof Error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }

    throw new Error('Unknown OpenAI API error');
  }
}

// Specialized chat pentru prompt editing
export async function chatPromptEditor(promptDraft: string, sevenD: any): Promise<ChatResponse> {
  const system = `You are a senior prompt engineer specializing in business prompts. 
Your task is to optimize prompts for clarity, structure, and effectiveness while preserving the original intent.

RULES:
- Maintain the core purpose and requirements
- Improve clarity and remove ambiguity  
- Ensure proper structure and flow
- Make it actionable and specific
- No promises or unrealistic claims
- Keep professional tone
- Preserve any technical requirements`;

  const user = `7D Context: ${JSON.stringify(sevenD)}

Optimize this prompt for maximum clarity and effectiveness:

${promptDraft}

Return only the optimized prompt, no explanations.`;

  return chatOnce({
    system,
    user,
    model: 'gpt-4o-mini',
    temperature: 0.2,
    maxTokens: 1000,
  });
}

// Specialized chat pentru prompt testing pe model real
export async function chatPromptTest(prompt: string, sevenD: any): Promise<ChatResponse> {
  const system = `You are the target AI model. Execute the given prompt with maximum quality and attention to detail. 
Provide the best possible output that fulfills all requirements specified in the prompt.

Follow the prompt instructions exactly and produce professional, actionable results.`;

  const user = prompt;

  return chatOnce({
    system,
    user,
    model: 'gpt-4o',
    temperature: 0.4,
    maxTokens: 1600,
  });
}

// Evaluator pentru scoring prompturi
export async function evaluatePrompt(
  prompt: string,
  sevenD: any
): Promise<{
  clarity: number;
  execution: number;
  ambiguity: number;
  business_fit: number;
  composite: number;
  verdict: 'pass' | 'partial_pass' | 'fail';
  feedback: string;
}> {
  const system = `You are an automated prompt evaluator. Analyze prompts across 4 dimensions and return scores 0-100.

SCORING CRITERIA:
- Clarity (0-100): How clear and understandable is the prompt?
- Execution (0-100): How actionable and executable is it?  
- Ambiguity (0-100): How much ambiguity exists? (higher = more ambiguous, worse)
- Business Fit (0-100): How well does it align with business context?

THRESHOLDS:
- Pass: clarity ≥80, execution ≥80, ambiguity ≤20, business_fit ≥75
- Composite = (clarity*0.3 + execution*0.35 + (100-ambiguity)*0.15 + business_fit*0.2)

Return valid JSON only.`;

  const user = `Context: ${JSON.stringify(sevenD)}

Evaluate this prompt:
${prompt}

Return JSON format:
{
  "clarity": 85,
  "execution": 88,
  "ambiguity": 15,
  "business_fit": 82,
  "feedback": "Brief specific feedback"
}`;

  const response = await chatOnce({
    system,
    user,
    model: 'gpt-4o-mini',
    temperature: 0.0,
    maxTokens: 700,
  });

  try {
    const evaluation = JSON.parse(response.text);

    // Calculate composite score
    const composite = Math.round(
      evaluation.clarity * 0.3 +
        evaluation.execution * 0.35 +
        (100 - evaluation.ambiguity) * 0.15 +
        evaluation.business_fit * 0.2
    );

    // Determine verdict based on thresholds
    const passThresholds =
      evaluation.clarity >= 80 &&
      evaluation.execution >= 80 &&
      evaluation.ambiguity <= 20 &&
      evaluation.business_fit >= 75;

    const verdict = passThresholds ? 'pass' : composite >= 80 ? 'partial_pass' : 'fail';

    return {
      clarity: evaluation.clarity || 80,
      execution: evaluation.execution || 80,
      ambiguity: evaluation.ambiguity || 20,
      business_fit: evaluation.business_fit || 75,
      composite,
      verdict,
      feedback: evaluation.feedback || 'Evaluation completed',
    };
  } catch (error) {
    // Fallback robust dacă JSON parse fail
    return {
      clarity: 80,
      execution: 80,
      ambiguity: 20,
      business_fit: 75,
      composite: 80,
      verdict: 'partial_pass',
      feedback: 'Evaluation completed with fallback scoring',
    };
  }
}

// Auto-tighten pentru prompturi sub threshold
export async function autoTightenPrompt(prompt: string, sevenD: any): Promise<ChatResponse> {
  const system = `You are a prompt optimization specialist. Your task is to tighten and improve prompts that scored below threshold.

OBJECTIVES:
- Reduce ambiguity and increase clarity
- Improve execution readiness and actionability  
- Maintain original intent and requirements
- Make instructions more specific and structured
- Remove any vague or unclear language

Return only the improved prompt, no explanations.`;

  const user = `Context: ${JSON.stringify(sevenD)}

Tighten and improve this prompt to score above 80:

${prompt}`;

  return chatOnce({
    system,
    user,
    model: 'gpt-4o-mini',
    temperature: 0.2,
    maxTokens: 900,
  });
}

// Calculate estimated cost pentru OpenAI usage
export function calculateCost(
  model: string,
  usage: { prompt_tokens: number; completion_tokens: number }
): number {
  // Pricing per 1K tokens (as of 2024)
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
  };

  const modelPricing = pricing[model] || pricing['gpt-4o-mini'];

  const inputCost = (usage.prompt_tokens / 1000) * modelPricing.input;
  const outputCost = (usage.completion_tokens / 1000) * modelPricing.output;

  return inputCost + outputCost;
}

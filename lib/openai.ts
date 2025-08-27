import OpenAI from 'openai';
import { SevenDParams, sanitize7DForTelemetry } from './validator';

// OpenAI client configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 60000, // 60 seconds
});

// Model configuration
const MODELS = {
  GPT_4: 'gpt-4',
  GPT_4_TURBO: 'gpt-4-turbo-preview',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini'
} as const;

type ModelType = typeof MODELS[keyof typeof MODELS];

// Temperature settings for different use cases
const TEMPERATURES = {
  CREATIVE: 0.8,
  BALANCED: 0.5,
  PRECISE: 0.2,
  EVALUATOR: 0.1 // Very low for consistent evaluation
} as const;

/**
 * Optimize/tighten a prompt using GPT
 */
export async function optimizePrompt(
  prompt: string,
  sevenD: SevenDParams,
  optimizationType: 'tighten' | 'enhance' | 'clarify' = 'tighten'
): Promise<{
  optimizedPrompt: string;
  changes: string[];
  usage: {
    duration_ms: number;
    tokens_used: number;
    model: string;
  };
}> {
  const startTime = Date.now();
  
  const systemPrompt = `You are a prompt engineering expert. Your task is to ${optimizationType} the given prompt based on the 7D parameters.

7D Context:
- Domain: ${sevenD.domain}
- Scale: ${sevenD.scale}
- Urgency: ${sevenD.urgency}
- Complexity: ${sevenD.complexity}
- Resources: ${sevenD.resources}
- Application: ${sevenD.application}
- Output Format: ${sevenD.output_format}

Instructions:
1. ${optimizationType === 'tighten' ? 'Make the prompt more concise and focused' : 
    optimizationType === 'enhance' ? 'Improve the prompt with better structure and clarity' : 
    'Clarify ambiguous parts and add specific details'}
2. Maintain the original intent and requirements
3. Ensure the prompt is appropriate for the specified domain and complexity level
4. Optimize for the specified output format
5. Return only the optimized prompt, no explanations

Original Prompt:
${prompt}`;

  try {
    const completion = await openai.chat.completions.create({
      model: MODELS.GPT_4O,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Please optimize this prompt.' }
      ],
      temperature: TEMPERATURES.PRECISE,
      max_tokens: 1000,
      response_format: { type: 'text' }
    });

    const optimizedPrompt = completion.choices[0]?.message?.content || prompt;
    const duration = Date.now() - startTime;

    return {
      optimizedPrompt,
      changes: [`${optimizationType}d prompt based on 7D parameters`],
      usage: {
        duration_ms: duration,
        tokens_used: completion.usage?.total_tokens || 0,
        model: MODELS.GPT_4O
      }
    };
  } catch (error) {
    console.error('OpenAI API error during prompt optimization:', error);
    throw new Error(`Failed to optimize prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Evaluate prompt quality using GPT as an evaluator
 * Returns scores based on the rubric from ruleset.yml
 */
export async function evaluatePrompt(
  prompt: string,
  sevenD: SevenDParams,
  expectedOutput?: string
): Promise<{
  overall_score: number;
  clarity_score: number;
  execution_score: number;
  ambiguity_inverse_score: number;
  business_fit_score: number;
  pragmatism_score: number;
  feedback: string;
  breakdown: Record<string, { score: number; reasoning: string }>;
  usage: {
    duration_ms: number;
    tokens_used: number;
    model: string;
  };
}> {
  const startTime = Date.now();
  
  const evaluationPrompt = `You are an expert prompt evaluator. Rate the following prompt on a scale of 0-100 for each criterion.

Prompt to evaluate:
${prompt}

7D Context:
- Domain: ${sevenD.domain}
- Scale: ${sevenD.scale}
- Urgency: ${sevenD.urgency}
- Complexity: ${sevenD.complexity}
- Resources: ${sevenD.resources}
- Application: ${sevenD.application}
- Output Format: ${sevenD.output_format}

${expectedOutput ? `Expected Output: ${expectedOutput}` : ''}

Evaluation Criteria (0-100 each):

1. CLARITY (25% weight): How clear and understandable is the prompt?
   - Clear instructions
   - Unambiguous language
   - Logical structure

2. EXECUTION (25% weight): How well can the task be executed?
   - Actionable steps
   - Complete information
   - Proper context

3. AMBIGUITY INVERSE (20% weight): How well does it minimize ambiguity?
   - Specific requirements
   - Clear constraints
   - Defined boundaries

4. BUSINESS FIT (20% weight): How well does it align with business objectives?
   - Goal alignment
   - Value delivery
   - ROI consideration

5. PRAGMATISM (10% weight): How practical and feasible is it?
   - Resource availability
   - Time constraints
   - Technical feasibility

Respond with a JSON object in this exact format:
{
  "clarity_score": 85,
  "execution_score": 80,
  "ambiguity_inverse_score": 90,
  "business_fit_score": 75,
  "pragmatism_score": 85,
  "feedback": "Overall good prompt with clear structure...",
  "breakdown": {
    "clarity": {"score": 85, "reasoning": "Clear instructions and logical flow"},
    "execution": {"score": 80, "reasoning": "Good actionable steps but could use more context"},
    "ambiguity_inverse": {"score": 90, "reasoning": "Very specific requirements and constraints"},
    "business_fit": {"score": 75, "reasoning": "Aligns with goals but could better address ROI"},
    "pragmatism": {"score": 85, "reasoning": "Realistic resource requirements and timeline"}
  }
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: MODELS.GPT_4O,
      messages: [
        { role: 'system', content: 'You are a prompt evaluation expert. Always respond with valid JSON.' },
        { role: 'user', content: evaluationPrompt }
      ],
      temperature: TEMPERATURES.EVALUATOR,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response content from OpenAI');
    }

    const evaluation = JSON.parse(responseContent);
    const duration = Date.now() - startTime;

    // Calculate weighted overall score
    const overall_score = Math.round(
      (evaluation.clarity_score * 0.25) +
      (evaluation.execution_score * 0.25) +
      (evaluation.ambiguity_inverse_score * 0.20) +
      (evaluation.business_fit_score * 0.20) +
      (evaluation.pragmatism_score * 0.10)
    );

    return {
      overall_score,
      clarity_score: evaluation.clarity_score,
      execution_score: evaluation.execution_score,
      ambiguity_inverse_score: evaluation.ambiguity_inverse_score,
      business_fit_score: evaluation.business_fit_score,
      pragmatism_score: evaluation.pragmatism_score,
      feedback: evaluation.feedback,
      breakdown: evaluation.breakdown,
      usage: {
        duration_ms: duration,
        tokens_used: completion.usage?.total_tokens || 0,
        model: MODELS.GPT_4O
      }
    };
  } catch (error) {
    console.error('OpenAI API error during prompt evaluation:', error);
    throw new Error(`Failed to evaluate prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate content based on prompt and 7D parameters
 */
export async function generateContent(
  prompt: string,
  sevenD: SevenDParams,
  model: ModelType = MODELS.GPT_4O
): Promise<{
  content: string;
  usage: {
    duration_ms: number;
    tokens_used: number;
    model: string;
  };
}> {
  const startTime = Date.now();
  
  const enhancedPrompt = `Based on the following context and requirements, generate the requested content:

7D Context:
- Domain: ${sevenD.domain}
- Scale: ${sevenD.scale}
- Urgency: ${sevenD.urgency}
- Complexity: ${sevenD.complexity}
- Resources: ${sevenD.resources}
- Application: ${sevenD.application}
- Output Format: ${sevenD.output_format}

${prompt}

Please ensure the output is appropriate for the specified domain, complexity level, and output format.`;

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: `You are a professional content generator specializing in ${sevenD.domain}.` },
        { role: 'user', content: enhancedPrompt }
      ],
      temperature: TEMPERATURES.BALANCED,
      max_tokens: 2000,
      response_format: { type: 'text' }
    });

    const content = completion.choices[0]?.message?.content || '';
    const duration = Date.now() - startTime;

    return {
      content,
      usage: {
        duration_ms: duration,
        tokens_used: completion.usage?.total_tokens || 0,
        model
      }
    };
  } catch (error) {
    console.error('OpenAI API error during content generation:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Test prompt execution with live model
 */
export async function testPromptExecution(
  prompt: string,
  sevenD: SevenDParams,
  testType: 'validation' | 'execution' | 'quality' = 'execution'
): Promise<{
  test_result: string;
  success: boolean;
  execution_time_ms: number;
  usage: {
    duration_ms: number;
    tokens_used: number;
    model: string;
  };
}> {
  const startTime = Date.now();
  
  let testPrompt: string;
  switch (testType) {
    case 'validation':
      testPrompt = `Validate this prompt for clarity and completeness: ${prompt}`;
      break;
    case 'execution':
      testPrompt = `Execute this prompt and provide a sample output: ${prompt}`;
      break;
    case 'quality':
      testPrompt = `Assess the quality and effectiveness of this prompt: ${prompt}`;
      break;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: MODELS.GPT_4O,
      messages: [
        { role: 'system', content: `You are a prompt testing specialist. Test the given prompt for ${testType}.` },
        { role: 'user', content: testPrompt }
      ],
      temperature: TEMPERATURES.PRECISE,
      max_tokens: 1000,
      response_format: { type: 'text' }
    });

    const test_result = completion.choices[0]?.message?.content || '';
    const execution_time = Date.now() - startTime;
    const duration = Date.now() - startTime;

    return {
      test_result,
      success: test_result.length > 0,
      execution_time_ms: execution_time,
      usage: {
        duration_ms: duration,
        tokens_used: completion.usage?.total_tokens || 0,
        model: MODELS.GPT_4O
      }
    };
  } catch (error) {
    console.error('OpenAI API error during prompt testing:', error);
    throw new Error(`Failed to test prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Export types and constants
export { openai, MODELS, TEMPERATURES };
export type { ModelType };

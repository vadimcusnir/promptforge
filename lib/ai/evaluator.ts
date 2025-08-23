// PROMPTFORGE™ v3 - AI Prompt Evaluator System
import OpenAI from 'openai';

export interface EvaluationCriteria {
  clarity: number; // 0-100: How clear and understandable the prompt is
  execution: number; // 0-100: How actionable and executable the prompt is
  ambiguity: number; // 0-100: How ambiguous or unclear the prompt is (lower is better)
  businessFit: number; // 0-100: How well the prompt fits business requirements
  safety: number; // 0-100: How safe and compliant the prompt is
  compliance: number; // 0-100: How compliant with regulations the prompt is
}

export interface EvaluationResult {
  id: string;
  promptId: string;
  timestamp: Date;
  scores: EvaluationCriteria;
  overallScore: number;
  feedback: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  metadata: {
    model: string;
    evaluationTime: number;
    evaluator: string;
  };
}

export interface EvaluationOptions {
  model?: string;
  temperature?: number;
  includeDetailedFeedback?: boolean;
  focusAreas?: (keyof EvaluationCriteria)[];
}

/**
 * Evaluate a prompt using AI analysis
 */
export async function evaluatePrompt(
  prompt: string,
  domain: string,
  options: EvaluationOptions = {}
): Promise<EvaluationResult> {
  const startTime = Date.now();
  const evaluationId = crypto.randomUUID();

  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const model = options.model || 'gpt-4o-mini';
    const temperature = options.temperature ?? 0.3;

    // Create evaluation prompt
    const evaluationPrompt = createEvaluationPrompt(prompt, domain, options);

    // Execute evaluation
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert prompt evaluator. Analyze prompts based on clarity, execution, ambiguity, business fit, safety, and compliance. Provide scores from 0-100 and constructive feedback.',
        },
        {
          role: 'user',
          content: evaluationPrompt,
        },
      ],
      temperature,
      max_tokens: 2000,
    });

    const evaluationTime = Date.now() - startTime;
    const response = completion.choices[0]?.message?.content || '';

    // Parse AI response
    const parsedResult = parseEvaluationResponse(response);

    // Calculate overall score
    const overallScore = calculateOverallScore(parsedResult.scores);

    // Determine risk level
    const riskLevel = determineRiskLevel(parsedResult.scores);

    return {
      id: evaluationId,
      promptId: crypto.randomUUID(), // This should come from the actual prompt
      timestamp: new Date(),
      scores: parsedResult.scores,
      overallScore,
      feedback: parsedResult.feedback,
      recommendations: parsedResult.recommendations,
      riskLevel,
      metadata: {
        model,
        evaluationTime,
        evaluator: 'ai-evaluator',
      },
    };
  } catch (error) {
    // Return default evaluation on error
    return {
      id: evaluationId,
      promptId: crypto.randomUUID(),
      timestamp: new Date(),
      scores: {
        clarity: 50,
        execution: 50,
        ambiguity: 50,
        businessFit: 50,
        safety: 50,
        compliance: 50,
      },
      overallScore: 50,
      feedback: ['Evaluation failed due to technical error'],
      recommendations: ['Please try again or contact support'],
      riskLevel: 'medium',
      metadata: {
        model: options.model || 'unknown',
        evaluationTime: Date.now() - startTime,
        evaluator: 'ai-evaluator',
      },
    };
  }
}

/**
 * Create the evaluation prompt for AI analysis
 */
function createEvaluationPrompt(
  prompt: string,
  domain: string,
  options: EvaluationOptions
): string {
  const focusAreas = options.focusAreas || [
    'clarity',
    'execution',
    'ambiguity',
    'businessFit',
    'safety',
    'compliance',
  ];

  return `
Please evaluate the following prompt for a ${domain} domain application.

PROMPT TO EVALUATE:
${prompt}

EVALUATION CRITERIA:
${focusAreas.map(area => `- ${area}: Score 0-100 with brief explanation`).join('\n')}

Please provide your evaluation in the following JSON format:
{
  "scores": {
    ${focusAreas.map(area => `"${area}": <score>`).join(',\n    ')}
  },
  "feedback": [
    "<specific feedback point 1>",
    "<specific feedback point 2>"
  ],
  "recommendations": [
    "<specific recommendation 1>",
    "<specific recommendation 2>"
  ]
}

Focus on practical, actionable feedback that would help improve the prompt's effectiveness.
`;
}

/**
 * Parse the AI evaluation response
 */
function parseEvaluationResponse(response: string): {
  scores: EvaluationCriteria;
  feedback: string[];
  recommendations: string[];
} {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      return {
        scores: {
          clarity: parsed.scores?.clarity || 50,
          execution: parsed.scores?.execution || 50,
          ambiguity: parsed.scores?.ambiguity || 50,
          businessFit: parsed.scores?.businessFit || 50,
          safety: parsed.scores?.safety || 50,
          compliance: parsed.scores?.compliance || 50,
        },
        feedback: parsed.feedback || ['No specific feedback provided'],
        recommendations: parsed.recommendations || ['No specific recommendations provided'],
      };
    }
  } catch (error) {
    console.error('Failed to parse AI evaluation response:', error);
  }

  // Fallback parsing
  return {
    scores: {
      clarity: 50,
      execution: 50,
      ambiguity: 50,
      businessFit: 50,
      safety: 50,
      compliance: 50,
    },
    feedback: ['Could not parse AI evaluation response'],
    recommendations: ['Please review the prompt manually'],
  };
}

/**
 * Calculate overall score from individual criteria
 */
function calculateOverallScore(scores: EvaluationCriteria): number {
  const weights = {
    clarity: 0.25,
    execution: 0.25,
    ambiguity: 0.15, // Lower is better, so invert
    businessFit: 0.2,
    safety: 0.1,
    compliance: 0.05,
  };

  const weightedSum =
    scores.clarity * weights.clarity +
    scores.execution * weights.execution +
    (100 - scores.ambiguity) * weights.ambiguity + // Invert ambiguity
    scores.businessFit * weights.businessFit +
    scores.safety * weights.safety +
    scores.compliance * weights.compliance;

  return Math.round(weightedSum);
}

/**
 * Determine risk level based on scores
 */
function determineRiskLevel(scores: EvaluationCriteria): 'low' | 'medium' | 'high' {
  const lowThreshold = 70;
  const highThreshold = 40;

  // Check for high-risk indicators
  if (scores.safety < highThreshold || scores.compliance < highThreshold) {
    return 'high';
  }

  if (scores.clarity < highThreshold || scores.execution < highThreshold) {
    return 'medium';
  }

  if (scores.ambiguity > 100 - lowThreshold) {
    // High ambiguity = low score
    return 'medium';
  }

  return 'low';
}

/**
 * Evaluate multiple prompts and compare them
 */
export async function evaluateMultiplePrompts(
  prompts: Array<{ id: string; content: string; domain: string }>,
  options: EvaluationOptions = {}
): Promise<EvaluationResult[]> {
  const results: EvaluationResult[] = [];

  for (const prompt of prompts) {
    const result = await evaluatePrompt(prompt.content, prompt.domain, options);
    result.promptId = prompt.id; // Use actual prompt ID
    results.push(result);
  }

  return results;
}

/**
 * Generate evaluation report summary
 */
export function generateEvaluationReport(evaluations: EvaluationResult[]): {
  summary: {
    totalPrompts: number;
    averageScore: number;
    riskDistribution: Record<string, number>;
    topIssues: string[];
  };
  recommendations: string[];
} {
  const totalPrompts = evaluations.length;
  const averageScore = evaluations.reduce((sum, e) => sum + e.overallScore, 0) / totalPrompts;

  // Count risk levels
  const riskDistribution = evaluations.reduce(
    (acc, e) => {
      acc[e.riskLevel] = (acc[e.riskLevel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Collect common issues
  const allFeedback = evaluations.flatMap(e => e.feedback);
  const feedbackCounts = allFeedback.reduce(
    (acc, feedback) => {
      acc[feedback] = (acc[feedback] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topIssues = Object.entries(feedbackCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([feedback]) => feedback);

  // Generate recommendations
  const recommendations = [];
  if (averageScore < 70) {
    recommendations.push(
      'Overall prompt quality needs improvement. Focus on clarity and execution.'
    );
  }
  if (riskDistribution.high > 0) {
    recommendations.push(
      'Address high-risk prompts immediately, especially safety and compliance issues.'
    );
  }
  if (riskDistribution.medium > totalPrompts * 0.3) {
    recommendations.push('Many prompts have medium risk. Review ambiguity and business fit.');
  }

  return {
    summary: {
      totalPrompts,
      averageScore: Math.round(averageScore),
      riskDistribution,
      topIssues,
    },
    recommendations,
  };
}

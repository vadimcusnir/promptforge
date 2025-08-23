import { openai } from '../openai';

export interface PromptImprovement {
  content: string;
  improvements: string[];
  suggestions: string[];
  usage?: {
    total_tokens: number;
    estimated_cost: number;
  };
}

export async function improvePrompt({
  action,
  content,
  context,
  preserveIntent
}: {
  action: string;
  content: string;
  context?: {
    domain?: string;
    target_audience?: string;
    specific_goal?: string;
    constraints?: string;
  };
  preserveIntent: boolean;
}): Promise<PromptImprovement> {
  const systemPrompt = `You are an expert prompt engineer. Your task is to ${action} the given prompt while ${preserveIntent ? 'preserving the original intent and meaning' : 'adapting it for the new context'}.

${context?.domain ? `Domain: ${context.domain}` : ''}
${context?.target_audience ? `Target Audience: ${context.target_audience}` : ''}
${context?.specific_goal ? `Specific Goal: ${context.specific_goal}` : ''}
${context?.constraints ? `Constraints: ${context.constraints}` : ''}

Provide:
1. The improved prompt
2. A list of specific improvements made
3. Additional suggestions for further optimization

Format your response as JSON:
{
  "improved_prompt": "...",
  "improvements": ["...", "..."],
  "suggestions": ["...", "..."]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: content }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // Try to parse JSON response
    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch {
      // Fallback: treat as plain text
      parsed = {
        improved_prompt: response,
        improvements: [`Applied ${action} transformation`],
        suggestions: ["Consider reviewing the output manually"]
      };
    }

    return {
      content: parsed.improved_prompt || response,
      improvements: parsed.improvements || [`Applied ${action} transformation`],
      suggestions: parsed.suggestions || [],
      usage: {
        total_tokens: completion.usage?.total_tokens || 0,
        estimated_cost: (completion.usage?.total_tokens || 0) * 0.00001 // Rough estimate
      }
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      content: content, // Return original on error
      improvements: [`Error occurred during ${action}`],
      suggestions: ["Please try again or contact support"],
      usage: {
        total_tokens: 0,
        estimated_cost: 0
      }
    };
  }
}

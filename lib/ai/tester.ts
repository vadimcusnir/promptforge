// PromptForge v3 - Live Prompt Testing System
import OpenAI from "openai";

export interface TestScenario {
  name: string;
  input: string;
  expectedOutcome?: string;
}

export interface TestResult {
  id: string;
  scenario: string;
  input: string;
  output: string;
  success: boolean;
  executionTime: number;
  tokensUsed: number;
  cost: number;
  error?: string;
  metadata: {
    model: string;
    temperature: number;
    maxTokens: number;
    timestamp: Date;
  };
}

export interface TestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

/**
 * Test a prompt with a live scenario using OpenAI
 */
export async function testPromptLive(
  prompt: string,
  scenario: string,
  expectedOutcome?: string,
  options: TestOptions = {}
): Promise<TestResult> {
  const startTime = Date.now();
  const testId = crypto.randomUUID();

  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const model = options.model || "gpt-4o-mini";
    const temperature = options.temperature ?? 0.4;
    const maxTokens = options.maxTokens ?? 2000;

    // Create the test prompt by combining the original prompt with the scenario
    const testPrompt = `${prompt}\n\nTest Scenario: ${scenario}\n\nPlease respond to this scenario using the prompt above.`;

    // Execute the test
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: testPrompt,
        },
      ],
      temperature,
      max_tokens: maxTokens,
    });

    const executionTime = Date.now() - startTime;
    const output = completion.choices[0]?.message?.content || "";
    const tokensUsed = completion.usage?.total_tokens || 0;
    const cost = calculateCost(model, tokensUsed);

    // Determine success based on expected outcome if provided
    let success = true;
    if (expectedOutcome) {
      success = evaluateSuccess(output, expectedOutcome);
    }

    return {
      id: testId,
      scenario,
      input: scenario,
      output,
      success,
      executionTime,
      tokensUsed,
      cost,
      metadata: {
        model,
        temperature,
        maxTokens,
        timestamp: new Date(),
      },
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    return {
      id: testId,
      scenario,
      input: scenario,
      output: "",
      success: false,
      executionTime,
      tokensUsed: 0,
      cost: 0,
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        model: options.model || "unknown",
        temperature: options.temperature ?? 0,
        maxTokens: options.maxTokens ?? 0,
        timestamp: new Date(),
      },
    };
  }
}

/**
 * Test multiple scenarios for a prompt
 */
export async function testPromptMultipleScenarios(
  prompt: string,
  scenarios: TestScenario[],
  options: TestOptions = {}
): Promise<TestResult[]> {
  const results: TestResult[] = [];

  for (const scenario of scenarios) {
    const result = await testPromptLive(
      prompt,
      scenario.input,
      scenario.expectedOutcome,
      options
    );
    results.push(result);
  }

  return results;
}

/**
 * Calculate cost based on model and token usage
 */
function calculateCost(model: string, tokens: number): number {
  // OpenAI pricing (as of 2024) - adjust as needed
  const pricing: Record<string, { input: number; output: number }> = {
    "gpt-4o": { input: 0.000005, output: 0.000015 },
    "gpt-4o-mini": { input: 0.00000015, output: 0.0000006 },
    "gpt-4-turbo": { input: 0.00001, output: 0.00003 },
    "gpt-3.5-turbo": { input: 0.0000005, output: 0.0000015 },
  };

  const modelPricing = pricing[model] || pricing["gpt-4o-mini"];
  const estimatedInputTokens = Math.floor(tokens * 0.7); // Estimate 70% input, 30% output
  const estimatedOutputTokens = tokens - estimatedInputTokens;

  return (
    estimatedInputTokens * modelPricing.input +
    estimatedOutputTokens * modelPricing.output
  );
}

/**
 * Evaluate if the test output meets the expected outcome
 */
function evaluateSuccess(output: string, expectedOutcome: string): boolean {
  // Simple evaluation - can be enhanced with more sophisticated logic
  const outputLower = output.toLowerCase();
  const expectedLower = expectedOutcome.toLowerCase();

  // Check if key concepts from expected outcome are present
  const expectedKeywords = expectedLower
    .split(/\s+/)
    .filter(word => word.length > 3); // Filter out short words

  const presentKeywords = expectedKeywords.filter(keyword =>
    outputLower.includes(keyword)
  );

  const keywordMatchRate = presentKeywords.length / expectedKeywords.length;
  return keywordMatchRate >= 0.6; // 60% keyword match threshold
}

/**
 * Generate test scenarios for a specific domain
 */
export function generateDomainScenarios(domain: string): TestScenario[] {
  const scenarios: Record<string, TestScenario[]> = {
    saas: [
      {
        name: "User Onboarding",
        input: "New user just signed up, needs guidance",
        expectedOutcome: "Clear onboarding steps and welcome message",
      },
      {
        name: "Feature Request",
        input: "Customer asking about specific feature availability",
        expectedOutcome: "Helpful response about feature status or alternatives",
      },
      {
        name: "Billing Issue",
        input: "User has questions about their subscription",
        expectedOutcome: "Professional billing support and next steps",
      },
    ],
    ecommerce: [
      {
        name: "Product Inquiry",
        input: "Customer asking about product specifications",
        expectedOutcome: "Detailed product information and recommendations",
      },
      {
        name: "Order Status",
        input: "Customer wants to track their order",
        expectedOutcome: "Order tracking information and support",
      },
      {
        name: "Return Request",
        input: "Customer wants to return a product",
        expectedOutcome: "Return policy explanation and process",
      },
    ],
    consulting: [
      {
        name: "Initial Assessment",
        input: "Client seeking strategic advice for their business",
        expectedOutcome: "Professional assessment approach and next steps",
      },
      {
        name: "Implementation Plan",
        input: "Client needs detailed implementation roadmap",
        expectedOutcome: "Structured implementation plan with milestones",
      },
      {
        name: "Progress Review",
        input: "Client wants to review project progress",
        expectedOutcome: "Progress summary and recommendations",
      },
    ],
  };

  return scenarios[domain] || [
    {
      name: "General Inquiry",
      input: "User has a general question about the service",
      expectedOutcome: "Helpful and informative response",
    },
    {
      name: "Problem Solving",
      input: "User needs help solving a specific problem",
      expectedOutcome: "Problem analysis and solution approach",
    },
    {
      name: "Information Request",
      input: "User is looking for specific information",
      expectedOutcome: "Clear and accurate information provided",
    },
  ];
}

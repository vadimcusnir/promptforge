export const aiTester = {};
export const testPromptLive = (content: any, input: any, expectedOutcome: any, modelConfig: any) => ({ 
  result: { success: true, output: 'Mock test result' },
  output: 'Mock test output',
  success: true,
  tokensUsed: 150,
  cost: 0.02
});
export const evaluatePrompt = (content: any, domain: any, options: any) => ({ 
  score: 85,
  scores: { clarity: 90, specificity: 80, completeness: 85 },
  feedback: "Mock feedback for prompt evaluation"
});

export const aiEditor = {};
export const improvePrompt = (params: any) => ({ 
  improved: 'Mock improved prompt',
  usage: { tokens: 100, cost: 0.01, total_tokens: 100, estimated_cost: 0.01 },
  content: 'Mock improved content',
  improvements: ['Mock improvement 1', 'Mock improvement 2'],
  suggestions: ['Mock suggestion 1', 'Mock suggestion 2']
});

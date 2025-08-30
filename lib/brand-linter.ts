// Brand linter for voice and branding compliance
export interface BrandLinterResult {
  isValid: boolean;
  issues: BrandIssue[];
  fixes: BrandFix[];
}

export interface BrandIssue {
  type: 'forbidden-lexicon' | 'voice-violation' | 'brand-inconsistency';
  message: string;
  line?: number;
  file?: string;
}

export interface BrandFix {
  type: 'replace' | 'remove' | 'restructure';
  message: string;
  suggestion: string;
}

export function lintBrandContent(content: string): BrandLinterResult {
  const issues: BrandIssue[] = [];
  const fixes: BrandFix[] = [];
  
  // Check for forbidden lexicon
  const forbiddenWords = ['ușor', 'magic', 'simplu', 'facil'];
  forbiddenWords.forEach(word => {
    if (content.toLowerCase().includes(word)) {
      issues.push({
        type: 'forbidden-lexicon',
        message: `Forbidden word "${word}" found`,
      });
      fixes.push({
        type: 'replace',
        message: `Replace "${word}" with appropriate alternative`,
        suggestion: `Use more professional terminology`,
      });
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues,
    fixes,
  };
}

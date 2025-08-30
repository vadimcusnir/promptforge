export interface Preset {
  id: string;
  name: string;
  description: string;
  prompt_template: string;
  domain: string;
  difficulty: string;
  estimated_tokens: number;
}

export const industryPresets: Preset[] = [
  {
    id: "creative-writing-001",
    name: "Creative Story Generator",
    description: "Generate creative stories and narratives",
    prompt_template: "Write a creative story about: {topic}",
    domain: "creative",
    difficulty: "beginner",
    estimated_tokens: 500
  }
];

export const getPresetsForDomain = (domain?: string) => {
  return domain ? industryPresets.filter(p => p.domain === domain) : industryPresets;
};

export const getPresetsForUser = (userId?: string) => industryPresets;
export const getPresetStats = () => ({ total: industryPresets.length, domains: ['creative', 'technical'] });

export const getPresetById = (id?: string): Preset | null => {
  if (!id) return null;
  return industryPresets.find(p => p.id === id) || null;
};

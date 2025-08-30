export interface ModuleDefinition {
  id: number;
  name: string;
  description: string;
  domain: string;
  vectors: string[];
  difficulty: string;
  plan: string;
  kpi: string;
  spec: string;
  output_template: string;
  estimated_tokens: number;
  vector?: string;
}

// Mock modules data
const mockModules: ModuleDefinition[] = [
  {
    id: 1,
    name: "Creative Writing",
    description: "Generate creative content and stories",
    domain: "creative",
    vectors: ["V1"],
    difficulty: "beginner",
    plan: "free",
    kpi: "engagement",
    spec: "creative-writing-spec",
    output_template: "story-template",
    estimated_tokens: 500,
    vector: "V1"
  },
  {
    id: 2,
    name: "Technical Documentation",
    description: "Create technical documentation and guides",
    domain: "technical",
    vectors: ["V2"],
    difficulty: "intermediate",
    plan: "pro",
    kpi: "clarity",
    spec: "tech-doc-spec",
    output_template: "doc-template",
    estimated_tokens: 800,
    vector: "V2"
  }
];

export const modules = mockModules;
export const MODULES = mockModules;
export const COMPLETE_MODULES_CATALOG = mockModules;
export const searchModules = (query?: string) => {
  if (!query) return mockModules;
  return mockModules.filter(module => 
    module.name.toLowerCase().includes(query.toLowerCase()) ||
    module.description.toLowerCase().includes(query.toLowerCase())
  );
};

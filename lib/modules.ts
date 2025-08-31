import { z } from 'zod'

export const ModuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['content', 'analysis', 'optimization', 'integration']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string()),
  prompt: z.string(),
  parameters: z.record(z.any()),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
  })),
})

export type Module = z.infer<typeof ModuleSchema>

export const MODULES: Module[] = [
  {
    id: 'M01',
    name: 'Content Generator',
    description: 'Generate high-quality content for any topic',
    category: 'content',
    difficulty: 'beginner',
    tags: ['content', 'writing', 'generation'],
    prompt: 'Generate comprehensive content about {topic} with the following requirements: {requirements}',
    parameters: {
      topic: 'string',
      requirements: 'string',
      tone: 'string',
      length: 'string',
    },
    examples: [
      {
        input: 'Topic: AI, Requirements: Technical but accessible, Tone: Professional, Length: 500 words',
        output: 'Artificial Intelligence (AI) represents one of the most transformative technologies of our time...'
      }
    ]
  },
  {
    id: 'M02',
    name: 'Text Analyzer',
    description: 'Analyze text for sentiment, keywords, and structure',
    category: 'analysis',
    difficulty: 'intermediate',
    tags: ['analysis', 'sentiment', 'keywords'],
    prompt: 'Analyze the following text: {text}. Provide sentiment analysis, key themes, and structural insights.',
    parameters: {
      text: 'string',
      analysis_type: 'string',
    },
    examples: [
      {
        input: 'Text: "This product is amazing! I love it so much."',
        output: 'Sentiment: Positive (0.8), Key themes: Product satisfaction, emotional attachment'
      }
    ]
  },
  {
    id: 'M03',
    name: 'Prompt Optimizer',
    description: 'Optimize prompts for better AI responses',
    category: 'optimization',
    difficulty: 'advanced',
    tags: ['optimization', 'prompting', 'efficiency'],
    prompt: 'Optimize this prompt for better AI performance: {original_prompt}. Consider clarity, specificity, and context.',
    parameters: {
      original_prompt: 'string',
      optimization_goals: 'array',
    },
    examples: [
      {
        input: 'Original: "Write about cats"',
        output: 'Optimized: "Write a comprehensive 300-word article about domestic cats, focusing on their behavior, care requirements, and benefits as pets. Use a friendly, informative tone suitable for pet owners."'
      }
    ]
  },
  // Add more modules as needed
]

export function getModuleById(id: string): Module | undefined {
  return MODULES.find(module => module.id === id)
}

export function getModulesByCategory(category: string): Module[] {
  return MODULES.filter(module => module.category === category)
}

export function searchModules(query: string): Module[] {
  const lowercaseQuery = query.toLowerCase()
  return MODULES.filter(module => 
    module.name.toLowerCase().includes(lowercaseQuery) ||
    module.description.toLowerCase().includes(lowercaseQuery) ||
    module.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

// Extended module schema for API compatibility
export const ExtendedModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  vectors: z.array(z.string()),
  difficulty: z.number(),
  minPlan: z.string(),
  tags: z.array(z.string()),
  outputs: z.array(z.string()),
  version: z.string(),
  deprecated: z.boolean().optional(),
})

export type ExtendedModule = z.infer<typeof ExtendedModuleSchema>

export const catalogData = {
  version: "1.0.0",
  modules: {
    'M01': {
      id: 'M01',
      title: 'Content Generator',
      slug: 'content-generator',
      summary: 'Generate high-quality content for any topic',
      vectors: ['content', 'strategic'],
      difficulty: 1,
      minPlan: 'free',
      tags: ['content', 'writing', 'generation'],
      outputs: ['text', 'markdown'],
      version: '1.0.0',
      deprecated: false,
    },
    'M02': {
      id: 'M02',
      title: 'Text Analyzer',
      slug: 'text-analyzer',
      summary: 'Analyze text for sentiment, keywords, and structure',
      vectors: ['analytics', 'content'],
      difficulty: 2,
      minPlan: 'creator',
      tags: ['analysis', 'sentiment', 'keywords'],
      outputs: ['json', 'report'],
      version: '1.0.0',
      deprecated: false,
    },
    'M03': {
      id: 'M03',
      title: 'Prompt Optimizer',
      slug: 'prompt-optimizer',
      summary: 'Optimize prompts for better AI responses',
      vectors: ['strategic', 'cognitive'],
      difficulty: 3,
      minPlan: 'pro',
      tags: ['optimization', 'prompting', 'efficiency'],
      outputs: ['text', 'json'],
      version: '1.0.0',
      deprecated: false,
    },
  }
}

export function validateModuleCatalog(catalog: any) {
  return {
    version: catalog.version,
    modules: catalog.modules
  }
}

// PromptForge Industrial Module Catalog
// Based on cusnir_prompt_forge_31.zip structure

export const moduleVectors = [
  'Analytics',
  'Branding', 
  'Cognitive',
  'Content',
  'Crisis',
  'Rhetoric',
  'Strategic'
]

export const difficultyLevels = [
  'Beginner',
  'Intermediate', 
  'Advanced'
]

export const planRequirements = {
  free: ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10'],
  pro: 'all',
  enterprise: 'all'
}

export const modules = [
  // Strategic Vector - Free Modules
  {
    id: 'M01',
    title: 'SOP Forge',
    slug: 'sop-forge',
    summary: 'Standard Operating Procedure generation with industrial precision',
    description: 'Generate comprehensive SOPs with step-by-step workflows, quality checkpoints, and compliance frameworks.',
    vector: 'Strategic',
    difficulty: 'Beginner',
    duration: '2-3 min',
    minPlan: 'free',
    tags: ['procedures', 'workflow', 'compliance'],
    outputs: ['txt', 'md', 'json'],
    version: '4.0.0',
    parameters: {
      domain: 'required',
      scale: 'required', 
      urgency: 'required',
      complexity: 'required',
      resources: 'optional',
      application: 'optional',
      output: 'required'
    }
  },
  {
    id: 'M02',
    title: 'Strategic Planning™',
    slug: 'strategic-planning',
    summary: 'Define objectives, KPIs, and the 7D parameter engine',
    description: 'Comprehensive strategic planning framework with OKRs, milestone tracking, and risk assessment.',
    vector: 'Strategic',
    difficulty: 'Intermediate',
    duration: '4-5 min',
    minPlan: 'free',
    tags: ['strategy', 'planning', 'objectives'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  },
  {
    id: 'M03',
    title: 'Risk Assessment',
    slug: 'risk-assessment',
    summary: 'Comprehensive risk evaluation framework',
    description: 'Multi-dimensional risk analysis with probability matrices, impact assessment, and mitigation strategies.',
    vector: 'Strategic',
    difficulty: 'Intermediate',
    duration: '3-4 min',
    minPlan: 'free',
    tags: ['risk', 'assessment', 'mitigation'],
    outputs: ['txt', 'md', 'json'],
    version: '4.0.0'
  },
  {
    id: 'M04',
    title: 'Process Optimization',
    slug: 'process-optimization',
    summary: 'Workflow efficiency enhancement',
    description: 'Lean methodology application with bottleneck identification and automation opportunities.',
    vector: 'Strategic',
    difficulty: 'Beginner',
    duration: '2-3 min',
    minPlan: 'free',
    tags: ['optimization', 'efficiency', 'lean'],
    outputs: ['txt', 'md', 'json'],
    version: '4.0.0'
  },
  {
    id: 'M05',
    title: 'Market Analysis',
    slug: 'market-analysis',
    summary: 'Competitive landscape evaluation',
    description: 'SWOT analysis, competitor benchmarking, and market opportunity identification.',
    vector: 'Strategic',
    difficulty: 'Intermediate',
    duration: '4-5 min',
    minPlan: 'free',
    tags: ['market', 'competition', 'analysis'],
    outputs: ['txt', 'md', 'json'],
    version: '4.0.0'
  },

  // Content Vector - Free Modules
  {
    id: 'M06',
    title: 'Content Strategy',
    slug: 'content-strategy',
    summary: 'Editorial calendar and content planning',
    description: 'Content pillar development, audience segmentation, and distribution strategy.',
    vector: 'Content',
    difficulty: 'Beginner',
    duration: '3-4 min',
    minPlan: 'free',
    tags: ['content', 'strategy', 'editorial'],
    outputs: ['txt', 'md', 'json'],
    version: '4.0.0'
  },
  {
    id: 'M07',
    title: 'SEO Optimization',
    slug: 'seo-optimization',
    summary: 'Search engine optimization framework',
    description: 'Keyword research, on-page optimization, and technical SEO implementation.',
    vector: 'Content',
    difficulty: 'Intermediate',
    duration: '3-4 min',
    minPlan: 'free',
    tags: ['seo', 'keywords', 'optimization'],
    outputs: ['txt', 'md', 'json'],
    version: '4.0.0'
  },
  {
    id: 'M08',
    title: 'Social Media Strategy',
    slug: 'social-media-strategy',
    summary: 'Multi-platform social media planning',
    description: 'Platform-specific content adaptation, engagement strategies, and community building.',
    vector: 'Content',
    difficulty: 'Beginner',
    duration: '2-3 min',
    minPlan: 'free',
    tags: ['social', 'media', 'engagement'],
    outputs: ['txt', 'md', 'json'],
    version: '4.0.0'
  },

  // Analytics Vector - Free Modules
  {
    id: 'M09',
    title: 'Performance Metrics',
    slug: 'performance-metrics',
    summary: 'KPI definition and tracking framework',
    description: 'Metric selection, dashboard design, and performance benchmarking.',
    vector: 'Analytics',
    difficulty: 'Intermediate',
    duration: '3-4 min',
    minPlan: 'free',
    tags: ['metrics', 'kpi', 'tracking'],
    outputs: ['txt', 'md', 'json'],
    version: '4.0.0'
  },
  {
    id: 'M10',
    title: 'Evaluator & Scoring Engine™',
    slug: 'evaluator-scoring',
    summary: 'Advanced evaluation system with multi-dimensional scoring',
    description: 'Comprehensive scoring framework with weighted criteria, benchmarking, and improvement recommendations.',
    vector: 'Analytics',
    difficulty: 'Advanced',
    duration: '5-6 min',
    minPlan: 'free',
    tags: ['evaluation', 'scoring', 'metrics'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  },

  // Pro Modules (M11-M50)
  {
    id: 'M11',
    title: 'Funnel Optimization',
    slug: 'funnel-optimization',
    summary: 'Conversion funnel analysis and improvement',
    description: 'Multi-stage funnel analysis with conversion rate optimization and A/B testing frameworks.',
    vector: 'Rhetoric',
    difficulty: 'Intermediate',
    duration: '4-5 min',
    minPlan: 'pro',
    tags: ['funnel', 'conversion', 'optimization'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  },
  {
    id: 'M12',
    title: 'Visibility Diagnostics',
    slug: 'visibility-diagnostics',
    summary: 'Brand visibility assessment',
    description: 'Multi-channel visibility analysis with reach optimization and brand awareness metrics.',
    vector: 'Strategic',
    difficulty: 'Advanced',
    duration: '5-6 min',
    minPlan: 'pro',
    tags: ['visibility', 'brand', 'diagnostics'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  },
  {
    id: 'M13',
    title: 'Pricing Psychology',
    slug: 'pricing-psychology',
    summary: 'Psychological pricing strategies',
    description: 'Behavioral economics application in pricing with anchoring, bundling, and value perception.',
    vector: 'Rhetoric',
    difficulty: 'Intermediate',
    duration: '3-4 min',
    minPlan: 'pro',
    tags: ['pricing', 'psychology', 'behavior'],
    outputs: ['txt', 'md', 'json'],
    version: '4.0.0'
  },
  {
    id: 'M14',
    title: 'Customer Journey Mapping',
    slug: 'customer-journey',
    summary: 'End-to-end customer experience design',
    description: 'Touchpoint analysis, pain point identification, and experience optimization.',
    vector: 'Strategic',
    difficulty: 'Advanced',
    duration: '6-7 min',
    minPlan: 'pro',
    tags: ['journey', 'customer', 'experience'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  },
  {
    id: 'M15',
    title: 'Brand Architecture',
    slug: 'brand-architecture',
    summary: 'Comprehensive brand system design',
    description: 'Brand hierarchy, positioning framework, and identity system development.',
    vector: 'Branding',
    difficulty: 'Advanced',
    duration: '6-7 min',
    minPlan: 'pro',
    tags: ['brand', 'architecture', 'identity'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  },

  // Additional Pro Modules (continuing to M50)
  {
    id: 'M18',
    title: 'Export Manager™',
    slug: 'export-manager',
    summary: 'Professional export system with checksums and manifests',
    description: 'Multi-format export engine with integrity verification, metadata embedding, and audit trails.',
    vector: 'Strategic',
    difficulty: 'Advanced',
    duration: '4-5 min',
    minPlan: 'pro',
    tags: ['export', 'integrity', 'audit'],
    outputs: ['txt', 'md', 'json', 'pdf', 'zip'],
    version: '4.0.0'
  },
  {
    id: 'M22',
    title: 'Lead Generation',
    slug: 'lead-generation',
    summary: 'Advanced lead generation strategies',
    description: 'Multi-channel lead acquisition with qualification frameworks and nurturing sequences.',
    vector: 'Content',
    difficulty: 'Advanced',
    duration: '4-5 min',
    minPlan: 'pro',
    tags: ['leads', 'generation', 'acquisition'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  },
  {
    id: 'M24',
    title: 'Personal PR',
    slug: 'personal-pr',
    summary: 'Personal brand development',
    description: 'Thought leadership positioning, media relations, and reputation management.',
    vector: 'Content',
    difficulty: 'Intermediate',
    duration: '3-4 min',
    minPlan: 'pro',
    tags: ['pr', 'personal', 'reputation'],
    outputs: ['txt', 'md', 'json'],
    version: '4.0.0'
  },
  {
    id: 'M32',
    title: 'Cohort Testing',
    slug: 'cohort-testing',
    summary: 'User cohort analysis framework',
    description: 'Behavioral cohort segmentation with retention analysis and lifecycle optimization.',
    vector: 'Analytics',
    difficulty: 'Advanced',
    duration: '5-6 min',
    minPlan: 'pro',
    tags: ['cohort', 'testing', 'retention'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  },
  {
    id: 'M35',
    title: 'Content Heat Mapping',
    slug: 'content-heatmap',
    summary: 'Content performance visualization',
    description: 'Engagement pattern analysis with performance hotspots and optimization recommendations.',
    vector: 'Branding',
    difficulty: 'Intermediate',
    duration: '4-5 min',
    minPlan: 'pro',
    tags: ['heatmap', 'content', 'performance'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  },
  {
    id: 'M40',
    title: 'Crisis Management',
    slug: 'crisis-management',
    summary: 'Crisis response protocols',
    description: 'Emergency response frameworks with communication strategies and recovery planning.',
    vector: 'Crisis',
    difficulty: 'Advanced',
    duration: '6-7 min',
    minPlan: 'pro',
    tags: ['crisis', 'management', 'response'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  },
  {
    id: 'M45',
    title: 'Learning Path Design',
    slug: 'learning-path',
    summary: 'Educational pathway creation',
    description: 'Curriculum development with competency mapping and assessment frameworks.',
    vector: 'Cognitive',
    difficulty: 'Advanced',
    duration: '5-6 min',
    minPlan: 'pro',
    tags: ['learning', 'education', 'curriculum'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  },
  {
    id: 'M50',
    title: 'Brand Voice Architecture',
    slug: 'brand-voice',
    summary: 'Comprehensive brand voice system',
    description: 'Voice and tone framework with style guides, messaging hierarchy, and communication protocols.',
    vector: 'Branding',
    difficulty: 'Advanced',
    duration: '6-7 min',
    minPlan: 'pro',
    tags: ['voice', 'brand', 'communication'],
    outputs: ['txt', 'md', 'json', 'pdf'],
    version: '4.0.0'
  }
]

// Helper functions
export const getModulesByVector = (vector) => {
  return modules.filter(module => module.vector === vector)
}

export const getModulesByDifficulty = (difficulty) => {
  return modules.filter(module => module.difficulty === difficulty)
}

export const getModulesByPlan = (plan) => {
  if (plan === 'free') {
    return modules.filter(module => planRequirements.free.includes(module.id))
  }
  return modules
}

export const getModuleById = (id) => {
  return modules.find(module => module.id === id)
}

export const searchModules = (query) => {
  const lowercaseQuery = query.toLowerCase()
  return modules.filter(module => 
    module.title.toLowerCase().includes(lowercaseQuery) ||
    module.summary.toLowerCase().includes(lowercaseQuery) ||
    module.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}


export interface BlogPost {
  id: string
  slug: string
  title: string
  subtitle: string
  excerpt: string
  content: string
  author: string
  authorImage: string
  authorBio: string
  publishDate: string
  readTime: string
  domain: string
  vectors: string[]
  tags: string[]
  seoKeywords: string[]
  status: 'draft' | 'published' | 'scheduled'
  featured: boolean
  viewCount: number
  upvoteCount: number
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'mastering-7d-parameter-engine',
    title: 'Mastering the 7D Parameter Engine: A Complete Guide',
    subtitle: 'Learn how to leverage all seven dimensions for industrial-grade prompt engineering',
    excerpt: 'Learn how to leverage all seven dimensions of our parameter engine to create industrial-grade prompts that deliver consistent, auditable results.',
    content: `
      <h2>Introduction to 7D Parameters</h2>
      <p>The 7D Parameter Engine represents a fundamental shift in how we approach prompt engineering. Instead of relying on intuition and trial-and-error, we now have a systematic framework that provides precise control over every aspect of prompt generation.</p>
      
      <h2>Domain Dimension: Context Mastery</h2>
      <p>The Domain dimension establishes the contextual framework within which all other parameters operate. It's the foundation that determines expertise level, industry terminology, and regulatory requirements.</p>
      
      <h2>Scale & Urgency: Performance Tuning</h2>
      <p>These dimensions work together to optimize performance characteristics. High-scale, low-urgency scenarios allow sophisticated processing, while high-urgency situations prioritize speed.</p>
      
      <h2>Complexity & Resources: Optimization</h2>
      <p>The interplay determines feasibility and sustainability. Key strategies include complexity budgeting, caching strategies, and fallback mechanisms.</p>
      
      <h2>Application & Output: Delivery</h2>
      <p>Application defines how the prompt will be used, while Output specifies format and structure. This ensures consistent, professional results.</p>
    `,
    author: 'Sarah Chen',
    authorImage: '/professional-woman-portrait.png',
    authorBio: 'Senior Prompt Engineer at PromptForge with 8+ years in AI systems architecture. Previously led ML teams at Google and OpenAI.',
    publishDate: '2024-01-15',
    readTime: '8 min',
    domain: 'Engineering',
    vectors: ['Precision', 'Scale', 'Complexity'],
    tags: ['7D Parameters', 'Prompt Engineering', 'AI Systems'],
    seoKeywords: ['prompt engineering', 'AI parameters', 'industrial AI', '7D engine'],
    status: 'published',
    featured: true,
    viewCount: 1247,
    upvoteCount: 89
  },
  {
    id: '2',
    slug: 'from-prototype-to-production',
    title: 'From Prototype to Production: Scaling Your Prompt Systems',
    subtitle: 'Essential patterns and practices for enterprise-grade prompt deployment',
    excerpt: 'Discover the essential patterns and practices for taking your prompt experiments from local testing to enterprise-grade deployment.',
    content: `
      <h2>The Prototype Gap</h2>
      <p>Most prompt engineering projects fail at the transition from prototype to production. This guide covers the essential patterns that bridge this gap.</p>
      
      <h2>Validation Frameworks</h2>
      <p>Implement systematic testing protocols that catch issues before they reach production. Use our 7D validation matrix for comprehensive coverage.</p>
      
      <h2>Deployment Strategies</h2>
      <p>From blue-green deployments to canary releases, learn how to safely roll out prompt updates without disrupting operations.</p>
      
      <h2>Monitoring & Observability</h2>
      <p>Real-time monitoring of prompt performance, user satisfaction, and business impact ensures continuous improvement.</p>
    `,
    author: 'Marcus Rodriguez',
    authorImage: '/professional-man-portrait.png',
    authorBio: 'DevOps Engineer specializing in AI infrastructure scaling. Built deployment systems for Fortune 500 companies.',
    publishDate: '2024-01-12',
    readTime: '12 min',
    domain: 'Operations',
    vectors: ['Scale', 'Urgency', 'Resources'],
    tags: ['Production', 'Scaling', 'DevOps', 'AI Infrastructure'],
    seoKeywords: ['AI production', 'prompt scaling', 'enterprise AI', 'AI deployment'],
    status: 'published',
    featured: true,
    viewCount: 892,
    upvoteCount: 67
  },
  {
    id: '3',
    slug: 'audit-trails-compliance',
    title: 'Building Audit Trails for AI Compliance',
    subtitle: 'Comprehensive logging and traceability for regulatory compliance',
    excerpt: 'Ensure your AI systems meet regulatory requirements with comprehensive logging, versioning, and traceability features.',
    content: `
      <h2>Regulatory Landscape</h2>
      <p>AI systems face increasing regulatory scrutiny. GDPR, CCPA, and industry-specific regulations require comprehensive audit trails.</p>
      
      <h2>Logging Architecture</h2>
      <p>Implement structured logging that captures every decision point, input variation, and output generation for full traceability.</p>
      
      <h2>Version Control</h2>
      <p>Track prompt versions, parameter changes, and performance metrics to demonstrate compliance and enable rollbacks.</p>
      
      <h2>Compliance Reporting</h2>
      <p>Automated generation of compliance reports that satisfy auditor requirements and demonstrate due diligence.</p>
    `,
    author: 'Dr. Elena Vasquez',
    authorImage: '/professional-woman-scientist.png',
    authorBio: 'AI Ethics Researcher and Compliance Specialist. PhD in Computer Science with focus on responsible AI deployment.',
    publishDate: '2024-01-10',
    readTime: '15 min',
    domain: 'Compliance',
    vectors: ['Complexity', 'Domain', 'Output'],
    tags: ['Compliance', 'Audit Trails', 'AI Ethics', 'Regulations'],
    seoKeywords: ['AI compliance', 'audit trails', 'AI regulations', 'responsible AI'],
    status: 'published',
    featured: false,
    viewCount: 567,
    upvoteCount: 43
  },
  {
    id: '4',
    slug: 'module-library-best-practices',
    title: 'Module Library Best Practices: Organizing Your Prompt Arsenal',
    subtitle: 'Organizing prompt modules for maximum reusability and team collaboration',
    excerpt: 'Structure your prompt modules for maximum reusability and team collaboration with proven organizational patterns.',
    content: `
      <h2>Organizational Principles</h2>
      <p>Effective module organization follows clear principles: separation of concerns, single responsibility, and progressive enhancement.</p>
      
      <h2>Naming Conventions</h2>
      <p>Consistent naming that reflects function, domain, and complexity level enables rapid discovery and reduces duplication.</p>
      
      <h2>Dependency Management</h2>
      <p>Clear dependency graphs prevent circular references and ensure modules can be composed safely and predictably.</p>
      
      <h2>Team Collaboration</h2>
      <p>Version control, code reviews, and documentation standards enable teams to work together effectively on shared modules.</p>
    `,
    author: 'James Park',
    authorImage: '/professional-engineer.png',
    authorBio: 'Software Architect with 15+ years building scalable systems. Led engineering teams at Microsoft and Amazon.',
    publishDate: '2024-01-08',
    readTime: '6 min',
    domain: 'Architecture',
    vectors: ['Application', 'Resources', 'Scale'],
    tags: ['Module Library', 'Best Practices', 'Team Collaboration', 'Architecture'],
    seoKeywords: ['prompt modules', 'AI architecture', 'team collaboration', 'best practices'],
    status: 'published',
    featured: false,
    viewCount: 423,
    upvoteCount: 31
  },
  {
    id: '5',
    slug: 'enterprise-prompt-engineering-roi',
    title: 'Enterprise Prompt Engineering ROI: Measuring Business Impact',
    subtitle: 'Measuring business impact and ROI of prompt engineering investments',
    excerpt: 'Quantify the business value of your prompt engineering investments with proven metrics and measurement frameworks.',
    content: `
      <h2>ROI Framework</h2>
      <p>Measure prompt engineering ROI across three dimensions: operational efficiency, quality improvement, and innovation acceleration.</p>
      
      <h2>Key Metrics</h2>
      <p>Track time-to-value, accuracy improvements, cost savings, and revenue impact to demonstrate clear business value.</p>
      
      <h2>Case Studies</h2>
      <p>Real-world examples from Fortune 500 companies showing measurable improvements in productivity and quality.</p>
      
      <h2>Investment Planning</h2>
      <p>Strategic guidance on scaling prompt engineering teams and infrastructure based on proven ROI patterns.</p>
    `,
    author: 'Dr. Michael Chang',
    authorImage: '/professional-man-portrait.png',
    authorBio: 'Business Strategy Consultant specializing in AI transformation. PhD in Economics, former McKinsey partner.',
    publishDate: '2024-01-05',
    readTime: '10 min',
    domain: 'Business',
    vectors: ['Scale', 'Resources', 'Output'],
    tags: ['ROI', 'Business Impact', 'Enterprise', 'Metrics'],
    seoKeywords: ['AI ROI', 'business impact', 'enterprise AI', 'prompt engineering ROI'],
    status: 'draft',
    featured: false,
    viewCount: 0,
    upvoteCount: 0
  }
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug)
}

export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS.filter(post => post.status === 'published')
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter(post => post.featured && post.status === 'published')
}

export function getPostsByDomain(domain: string): BlogPost[] {
  return BLOG_POSTS.filter(post => post.domain === domain && post.status === 'published')
}

export function getPostsByVector(vector: string): BlogPost[] {
  return BLOG_POSTS.filter(post => post.vectors.includes(vector) && post.status === 'published')
}

export function searchPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase()
  return BLOG_POSTS.filter(post => 
    post.status === 'published' && (
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      post.seoKeywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
    )
  )
}

// Blog articles data for chatgpt-prompting.com
export const blogArticles = [
  {
    id: 1,
    slug: 'industrial-prompt-engineering-guide',
    title: 'The Complete Guide to Industrial-Grade Prompt Engineering',
    excerpt: 'Transform your AI workflows from chaotic experimentation to systematic, repeatable processes with our comprehensive framework.',
    content: 'Full article content here...',
    category: 'Strategy',
    tags: ['prompt-engineering', 'enterprise', 'best-practices'],
    author: {
      name: 'Alex Chen',
      avatar: '/images/authors/alex-chen.jpg'
    },
    coverImage: '/images/blog/industrial-prompt-guide.jpg',
    publishedAt: '2024-01-15',
    readTime: '12 min read',
    featured: true
  },
  {
    id: 2,
    slug: 'chatgpt-enterprise-deployment',
    title: 'ChatGPT Enterprise Deployment: Best Practices and Pitfalls',
    excerpt: 'Learn how to successfully deploy ChatGPT in enterprise environments while maintaining security, compliance, and performance.',
    content: 'Full article content here...',
    category: 'Enterprise',
    tags: ['chatgpt', 'enterprise', 'deployment', 'security'],
    author: {
      name: 'Sarah Johnson',
      avatar: '/images/authors/sarah-johnson.jpg'
    },
    coverImage: '/images/blog/enterprise-deployment.jpg',
    publishedAt: '2024-01-10',
    readTime: '8 min read',
    featured: true
  },
  {
    id: 3,
    slug: 'prompt-optimization-techniques',
    title: '7 Advanced Prompt Optimization Techniques That Actually Work',
    excerpt: 'Discover proven techniques to improve your prompt quality, consistency, and output reliability across different use cases.',
    content: 'Full article content here...',
    category: 'Techniques',
    tags: ['optimization', 'techniques', 'quality'],
    author: {
      name: 'Michael Rodriguez',
      avatar: '/images/authors/michael-rodriguez.jpg'
    },
    coverImage: '/images/blog/optimization-techniques.jpg',
    publishedAt: '2024-01-05',
    readTime: '10 min read',
    featured: false
  },
  {
    id: 4,
    slug: 'ai-content-quality-scoring',
    title: 'Building Reliable AI Content Quality Scoring Systems',
    excerpt: 'How to implement automated quality scoring for AI-generated content to ensure consistency and reliability at scale.',
    content: 'Full article content here...',
    category: 'Quality',
    tags: ['quality-scoring', 'automation', 'reliability'],
    author: {
      name: 'Dr. Emily Watson',
      avatar: '/images/authors/emily-watson.jpg'
    },
    coverImage: '/images/blog/quality-scoring.jpg',
    publishedAt: '2024-01-01',
    readTime: '15 min read',
    featured: false
  },
  {
    id: 5,
    slug: 'prompt-engineering-roi',
    title: 'Measuring ROI of Prompt Engineering Investments',
    excerpt: 'Calculate the real business impact of systematic prompt engineering and justify your AI tooling investments.',
    content: 'Full article content here...',
    category: 'Business',
    tags: ['roi', 'business-case', 'metrics'],
    author: {
      name: 'David Kim',
      avatar: '/images/authors/david-kim.jpg'
    },
    coverImage: '/images/blog/prompt-roi.jpg',
    publishedAt: '2023-12-28',
    readTime: '6 min read',
    featured: false
  }
]

export const getFeaturedArticles = () => {
  return blogArticles.filter(article => article.featured)
}

export const getAllCategories = () => {
  return [...new Set(blogArticles.map(article => article.category))]
}

export const getAllTags = () => {
  const allTags = blogArticles.flatMap(article => article.tags)
  return [...new Set(allTags)]
}

export const getArticleBySlug = (slug) => {
  return blogArticles.find(article => article.slug === slug)
}

export const getArticlesByCategory = (category) => {
  return blogArticles.filter(article => article.category === category)
}

export const getArticlesByTag = (tag) => {
  return blogArticles.filter(article => article.tags.includes(tag))
}


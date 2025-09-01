export interface BlogSearchIndex {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  headings: string[];
  tags: string[];
  categories: string[];
  author: string;
  published_at: string;
  popularity_score: number;
  search_score?: number;
}

export interface BlogSearchResult {
  post: BlogSearchIndex;
  score: number;
  highlights: {
    title?: string;
    excerpt?: string;
    content?: string;
  };
}

export interface BlogSearchOptions {
  query: string;
  categories?: string[];
  tags?: string[];
  author?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  limit?: number;
  offset?: number;
}

// Mock search index - in production this would use Algolia, OpenSearch, or similar
const searchIndex: BlogSearchIndex[] = [
  {
    id: '1',
    title: 'Introduction to the 7D Framework for Prompt Engineering',
    slug: 'introduction-to-7d-framework',
    excerpt: 'Learn how the 7D framework revolutionizes prompt engineering with structured parameters for consistent, high-quality AI outputs.',
    content: 'The 7D framework represents a paradigm shift in how we approach prompt engineering...',
    headings: ['What is the 7D Framework?', 'The Seven Dimensions', 'Benefits', 'Implementation'],
    tags: ['prompt-engineering', '7d-framework', 'ai-optimization'],
    categories: ['Tutorial', '7D Framework'],
    author: 'PromptForge Team',
    published_at: '2024-12-20T10:00:00Z',
    popularity_score: 95,
  },
  {
    id: '2',
    title: 'Optimizing Prompt Performance: A Complete Guide',
    slug: 'optimizing-prompt-performance',
    excerpt: 'Discover advanced techniques for improving prompt performance, including parameter tuning and quality validation strategies.',
    content: 'Performance optimization is crucial for achieving the best results from your AI prompts...',
    headings: ['Understanding Prompt Performance', 'Key Optimization Strategies', 'Advanced Techniques'],
    tags: ['performance', 'optimization', 'prompt-tuning'],
    categories: ['Performance', 'Optimization'],
    author: 'Alex Chen',
    published_at: '2024-12-18T14:30:00Z',
    popularity_score: 88,
  },
  {
    id: '3',
    title: 'API Integration Best Practices for PromptForge',
    slug: 'api-integration-best-practices',
    excerpt: 'Learn how to effectively integrate PromptForge APIs into your applications with real-world examples and best practices.',
    content: 'Integrating PromptForge APIs into your applications requires careful consideration...',
    headings: ['Authentication', 'Rate Limiting', 'Error Handling', 'Best Practices'],
    tags: ['api', 'integration', 'best-practices'],
    categories: ['API', 'Integration'],
    author: 'Sarah Johnson',
    published_at: '2024-12-15T09:15:00Z',
    popularity_score: 82,
  },
];

export function searchBlogPosts(options: BlogSearchOptions): BlogSearchResult[] {
  const { query, categories, tags, author, dateRange, limit = 10, offset = 0 } = options;
  
  let results = searchIndex.filter(post => {
    // Filter by categories
    if (categories && categories.length > 0) {
      if (!categories.some(cat => post.categories.includes(cat))) {
        return false;
      }
    }
    
    // Filter by tags
    if (tags && tags.length > 0) {
      if (!tags.some(tag => post.tags.includes(tag))) {
        return false;
      }
    }
    
    // Filter by author
    if (author && post.author !== author) {
      return false;
    }
    
    // Filter by date range
    if (dateRange) {
      const postDate = new Date(post.published_at);
      if (postDate < dateRange.start || postDate > dateRange.end) {
        return false;
      }
    }
    
    return true;
  });
  
  // If no query, return by popularity
  if (!query || query.trim() === '') {
    return results
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(offset, offset + limit)
      .map(post => ({
        post,
        score: post.popularity_score,
        highlights: {},
      }));
  }
  
  // Search with query
  const queryLower = query.toLowerCase();
  const searchResults = results.map(post => {
    let score = 0;
    const highlights: { title?: string; excerpt?: string; content?: string } = {};
    
    // Title match (highest weight)
    if (post.title.toLowerCase().includes(queryLower)) {
      score += 100;
      highlights.title = highlightText(post.title, query);
    }
    
    // Excerpt match
    if (post.excerpt.toLowerCase().includes(queryLower)) {
      score += 50;
      highlights.excerpt = highlightText(post.excerpt, query);
    }
    
    // Content match
    if (post.content.toLowerCase().includes(queryLower)) {
      score += 25;
      highlights.content = highlightText(post.content.substring(0, 200), query);
    }
    
    // Tags match
    if (post.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
      score += 30;
    }
    
    // Categories match
    if (post.categories.some(cat => cat.toLowerCase().includes(queryLower))) {
      score += 20;
    }
    
    // Headings match
    if (post.headings.some(heading => heading.toLowerCase().includes(queryLower))) {
      score += 15;
    }
    
    // Author match
    if (post.author.toLowerCase().includes(queryLower)) {
      score += 10;
    }
    
    // Boost by popularity
    score += post.popularity_score * 0.1;
    
    return {
      post,
      score,
      highlights,
    };
  });
  
  // Sort by score and apply pagination
  return searchResults
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(offset, offset + limit);
}

function highlightText(text: string, query: string): string {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): BlogSearchIndex[] {
  const currentPost = searchIndex.find(post => post.slug === currentSlug);
  if (!currentPost) return [];
  
  // Find posts with similar tags or categories
  const relatedPosts = searchIndex
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      let score = 0;
      
      // Score by shared tags
      const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
      score += sharedTags.length * 20;
      
      // Score by shared categories
      const sharedCategories = post.categories.filter(cat => currentPost.categories.includes(cat));
      score += sharedCategories.length * 15;
      
      // Score by author
      if (post.author === currentPost.author) {
        score += 10;
      }
      
      // Boost by popularity
      score += post.popularity_score * 0.1;
      
      return { post, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(result => result.post);
  
  return relatedPosts;
}

export function getPopularPosts(limit: number = 5): BlogSearchIndex[] {
  return searchIndex
    .sort((a, b) => b.popularity_score - a.popularity_score)
    .slice(0, limit);
}

export function getPostsByCategory(category: string): BlogSearchIndex[] {
  return searchIndex.filter(post => 
    post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  );
}

export function getPostsByTag(tag: string): BlogSearchIndex[] {
  return searchIndex.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getPostsByAuthor(author: string): BlogSearchIndex[] {
  return searchIndex.filter(post => 
    post.author.toLowerCase() === author.toLowerCase()
  );
}

export function indexBlogPost(post: BlogSearchIndex): void {
  const existingIndex = searchIndex.findIndex(p => p.id === post.id);
  if (existingIndex >= 0) {
    searchIndex[existingIndex] = post;
  } else {
    searchIndex.push(post);
  }
}

export function removeFromIndex(postId: string): void {
  const index = searchIndex.findIndex(p => p.id === postId);
  if (index >= 0) {
    searchIndex.splice(index, 1);
  }
}

export function getSearchSuggestions(query: string, limit: number = 5): string[] {
  if (!query || query.length < 2) return [];
  
  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();
  
  searchIndex.forEach(post => {
    // Add matching titles
    if (post.title.toLowerCase().includes(queryLower)) {
      suggestions.add(post.title);
    }
    
    // Add matching tags
    post.tags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag);
      }
    });
    
    // Add matching categories
    post.categories.forEach(category => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.add(category);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, limit);
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'review' | 'approved' | 'scheduled' | 'published';
  published_at: string;
  updated_at: string;
  author_id: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  canonical_url?: string;
  og_image?: string;
  noindex?: boolean;
  read_time: string;
  word_count: number;
  seo_score?: number;
}

export interface BlogPostFrontMatter {
  title: string;
  slug: string;
  excerpt: string;
  cover: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'review' | 'approved' | 'scheduled' | 'published';
  published_at: string;
  author_id: string;
  canonical_url?: string;
  og_image?: string;
  noindex?: boolean;
}

export interface BlogValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  seo_score: number;
}

export function validateBlogPost(post: BlogPost): BlogValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let seo_score = 100;

  // Required fields validation
  if (!post.title) errors.push('Title is required');
  if (!post.slug) errors.push('Slug is required');
  if (!post.excerpt) errors.push('Excerpt is required');
  if (!post.content) errors.push('Content is required');
  if (!post.author_id) errors.push('Author ID is required');

  // Title validation
  if (post.title && post.title.length > 60) {
    warnings.push('Title should be 60 characters or less for optimal SEO');
    seo_score -= 10;
  }

  // Excerpt validation
  if (post.excerpt && (post.excerpt.length < 120 || post.excerpt.length > 160)) {
    warnings.push('Excerpt should be between 120-160 characters for optimal SEO');
    seo_score -= 10;
  }

  // Content validation
  if (post.content) {
    const h1Count = (post.content.match(/^#\s/gm) || []).length;
    if (h1Count === 0) {
      errors.push('Content must have at least one H1 heading');
    } else if (h1Count > 1) {
      errors.push('Content should have only one H1 heading');
    }

    // Check for internal links (minimum 3)
    const internalLinks = (post.content.match(/\[([^\]]+)\]\(\/[^)]+\)/g) || []).length;
    if (internalLinks < 3) {
      warnings.push('Content should have at least 3 internal links');
      seo_score -= 15;
    }

    // Word count validation
    const wordCount = post.content.split(/\s+/).length;
    if (wordCount < 300) {
      warnings.push('Content should be at least 300 words for better SEO');
      seo_score -= 20;
    }
  }

  // Categories validation
  if (!post.categories || post.categories.length === 0) {
    warnings.push('At least one category should be specified');
    seo_score -= 5;
  }

  // Tags validation
  if (!post.tags || post.tags.length === 0) {
    warnings.push('At least one tag should be specified');
    seo_score -= 5;
  }

  // Cover image validation
  if (!post.cover) {
    warnings.push('Cover image should be specified');
    seo_score -= 10;
  }

  // Author validation
  if (!post.author || !post.author.name) {
    errors.push('Author information is required');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    seo_score: Math.max(0, seo_score),
  };
}

export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function sanitizeContent(content: string): string {
  // Remove potentially dangerous HTML/JS
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
}

export function extractHeadings(content: string): string[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: string[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push(match[2].trim());
  }

  return headings;
}

export function extractInternalLinks(content: string): string[] {
  const linkRegex = /\[([^\]]+)\]\(\/([^)]+)\)/g;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[2]);
  }

  return links;
}

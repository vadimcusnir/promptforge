import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Clock, Tag, Share2 } from "lucide-react";
import { generateArticleJSONLD } from "@/lib/json-ld";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  categories: string[];
  tags: string[];
  published_at: string;
  updated_at?: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  read_time: string;
  canonical_url?: string;
  og_image?: string;
  noindex?: boolean;
}

// Mock blog post data - in production this would come from a CMS or database
const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  const posts: Record<string, BlogPost> = {
    "introduction-to-7d-framework": {
      slug: "introduction-to-7d-framework",
      title: "Introduction to the 7D Framework for Prompt Engineering",
      excerpt: "Learn how the 7D framework revolutionizes prompt engineering with structured parameters for consistent, high-quality AI outputs.",
  content: `
# Introduction to the 7D Framework for Prompt Engineering

The 7D framework represents a paradigm shift in how we approach prompt engineering. By providing seven key dimensions for structured prompt development, it ensures consistency, quality, and scalability across all AI interactions.

## What is the 7D Framework?

The 7D framework is a comprehensive approach to prompt engineering that addresses the common challenges of inconsistency, poor quality, and lack of scalability in AI prompt development.

### The Seven Dimensions

1. **Domain**: The specific field or industry context
2. **Scale**: The scope and complexity of the task
3. **Urgency**: The time sensitivity of the output
4. **Complexity**: The technical difficulty level
5. **Resources**: Available computational and human resources
6. **Application**: The intended use case or deployment scenario
7. **Output**: The desired format and structure of results

## Benefits of the 7D Framework

<Callout type="info" title="Key Benefits">
The 7D framework provides structured parameters for consistent prompt engineering across all modules, ensuring high-quality outputs and scalable workflows.
</Callout>

### Consistency
By standardizing the approach to prompt engineering, the 7D framework eliminates the guesswork and ensures consistent results across different use cases.

### Quality
The structured approach leads to higher quality outputs by considering all relevant factors before prompt generation.

### Scalability
The framework scales from individual use cases to enterprise-wide deployments, making it suitable for any organization size.

## Implementation Example

Here's how you would implement the 7D framework in your prompts:

\`\`\`json
{
  "7d": {
    "domain": "technical",
    "scale": "team",
    "urgency": "normal",
    "complexity": "medium",
    "resources": "standard",
    "application": "content_generation",
    "output": "markdown"
  }
}
\`\`\`

## Getting Started

To get started with the 7D framework:

1. **Identify your domain**: Determine the specific field or industry context
2. **Assess scale**: Consider the scope and complexity of your task
3. **Set urgency**: Define the time sensitivity requirements
4. **Evaluate complexity**: Determine the technical difficulty level
5. **Review resources**: Assess available computational and human resources
6. **Define application**: Specify the intended use case
7. **Choose output format**: Select the desired output structure

## Conclusion

The 7D framework provides a robust foundation for prompt engineering that ensures consistency, quality, and scalability. By following this structured approach, you can create more effective prompts and achieve better results from your AI interactions.

Ready to implement the 7D framework in your projects? [Get started with PromptForge™ v3](/docs) today.
      `,
      cover: "/blog/7d-framework-intro.jpg",
      categories: ["Tutorial", "7D Framework"],
      tags: ["prompt-engineering", "7d-framework", "ai-optimization"],
      published_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z",
      author: {
        name: "PromptForge Team",
        avatar: "/authors/promptforge-team.jpg",
        bio: "The PromptForge team consists of AI researchers and engineers dedicated to advancing prompt engineering practices.",
      },
      read_time: "8 min read",
    },
    "optimizing-prompt-performance": {
      slug: "optimizing-prompt-performance",
      title: "Optimizing Prompt Performance: A Complete Guide",
      excerpt: "Discover advanced techniques for improving prompt performance, including parameter tuning and quality validation strategies.",
      content: `
# Optimizing Prompt Performance: A Complete Guide

Performance optimization is crucial for achieving the best results from your AI prompts. This comprehensive guide covers advanced techniques for improving prompt performance across different use cases.

## Understanding Prompt Performance

Prompt performance is measured by several key metrics:

- **Accuracy**: How well the output matches the intended result
- **Consistency**: Reliability across multiple runs
- **Efficiency**: Resource usage and response time
- **Relevance**: Alignment with the specific use case

## Key Optimization Strategies

### 1. Parameter Tuning

Fine-tuning parameters is essential for optimal performance:

\`\`\`json
{
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 0.9,
  "frequency_penalty": 0.1,
  "presence_penalty": 0.1
}
\`\`\`

### 2. Context Management

Proper context management ensures relevant and focused outputs:

<Callout type="warning" title="Context Length">
Be mindful of context length limits. Longer contexts don't always lead to better results.
</Callout>

### 3. Quality Validation

Implement quality validation to ensure consistent outputs:

- Automated scoring systems
- Human review processes
- A/B testing methodologies

## Advanced Techniques

### Chain-of-Thought Prompting

Chain-of-thought prompting improves reasoning capabilities:

\`\`\`text
Let's think step by step:
1. First, identify the key requirements
2. Then, analyze the available options
3. Finally, provide a reasoned recommendation
\`\`\`

### Few-Shot Learning

Provide examples to improve performance:

\`\`\`text
Example 1: Input: "Write a product description" → Output: "Premium wireless headphones with noise cancellation..."
Example 2: Input: "Create a marketing tagline" → Output: "Innovation that connects the world..."
\`\`\`

## Performance Monitoring

### Key Metrics to Track

1. **Response Time**: Measure how quickly prompts are processed
2. **Token Usage**: Monitor computational resource consumption
3. **Quality Scores**: Track output quality over time
4. **User Satisfaction**: Collect feedback on prompt effectiveness

### Monitoring Tools

- Real-time dashboards
- Automated alerting systems
- Performance analytics
- Cost tracking

## Best Practices

<Callout type="success" title="Best Practices">
- Start with simple prompts and gradually add complexity
- Test thoroughly before deploying to production
- Monitor performance continuously
- Iterate based on real-world feedback
</Callout>

## Conclusion

Optimizing prompt performance is an ongoing process that requires careful attention to parameters, context, and quality validation. By following these strategies and continuously monitoring performance, you can achieve better results from your AI interactions.

For more advanced optimization techniques, explore our [API documentation](/docs/api) and [test engine](/docs#test-engine).
      `,
      cover: "/blog/prompt-optimization.jpg",
      categories: ["Performance", "Optimization"],
      tags: ["performance", "optimization", "prompt-tuning"],
      published_at: "2024-12-18T14:30:00Z",
      updated_at: "2024-12-18T14:30:00Z",
      author: {
        name: "Alex Chen",
        avatar: "/authors/alex-chen.jpg",
        bio: "Alex is a senior AI engineer with expertise in prompt optimization and performance tuning.",
      },
      read_time: "12 min read",
    },
  };

  return posts[slug] || null;
};

const getRelatedPosts = async (currentSlug: string, categories: string[]): Promise<BlogPost[]> => {
  // Mock related posts - in production this would be based on categories/tags
  const allPosts = await Promise.all([
    getBlogPost("introduction-to-7d-framework"),
    getBlogPost("optimizing-prompt-performance"),
  ]);

  return allPosts
    .filter(post => post && post.slug !== currentSlug)
    .slice(0, 3) as BlogPost[];
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} — PromptForge™ v3 Blog`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author.name],
      images: [
        {
          url: post.og_image || post.cover,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.og_image || post.cover],
    },
    alternates: {
      canonical: post.canonical_url || `https://chatgpt-prompting.com/blog/${post.slug}`,
    },
    robots: post.noindex ? "noindex,nofollow" : "index,follow",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(params.slug, post.categories);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#5a5a5a]/30 bg-[#0e0e0e]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-[#d1a954] hover:text-[#d1a954]/80 transition-colors font-sans"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded" />
            <span className="font-mono font-bold text-[#d1a954] text-xl">PromptForge™ v3</span>
          </div>
              </div>
            </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="prose prose-invert max-w-none">
              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-[#d1a954] text-black text-xs font-mono font-semibold rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <h1 className="font-sans text-4xl font-bold text-white mb-4">
                  {post.title}
                </h1>
                <p className="text-xl text-[#a0a0a0] font-sans mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-[#a0a0a0] font-sans mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author.name}</span>
              </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                    <span>{post.read_time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md text-white hover:bg-[#2a2a2a]/80 transition-colors font-sans text-sm">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </header>

              {/* Article Cover */}
              <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Article Content */}
              <div className="prose prose-invert max-w-none">
                <div
                  className="font-sans text-[#e0e0e0] leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: post.content
                      .replace(/```json\n([\s\S]*?)\n```/g, (match, code) => {
                        return `<div class="code-block-wrapper"><pre><code class="language-json">${code}</code></pre></div>`;
                      })
                      .replace(/```text\n([\s\S]*?)\n```/g, (match, code) => {
                        return `<div class="code-block-wrapper"><pre><code class="language-text">${code}</code></pre></div>`;
                      })
                      .replace(/```([\s\S]*?)```/g, (match, code) => {
                        return `<div class="code-block-wrapper"><pre><code>${code}</code></pre></div>`;
                      })
                      .replace(/#{1,6}\s+(.+)/g, (match, heading) => {
                        const level = match.match(/^#+/)?.[0].length || 1;
                        return `<h${level} class="font-sans font-bold text-white mt-8 mb-4">${heading}</h${level}>`;
                      })
                      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
                      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#d1a954] hover:text-[#d1a954]/80 transition-colors">$1</a>')
                      .replace(/\n\n/g, '</p><p class="mb-4">')
                      .replace(/^/, '<p class="mb-4">')
                      .replace(/$/, '</p>'),
                  }}
                />
            </div>

              {/* Tags */}
              <div className="mt-8 pt-8 border-t border-[#5a5a5a]/30">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-[#d1a954]" />
                  <span className="font-sans font-medium text-white">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-full text-[#a0a0a0] font-sans text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-12">
                <h2 className="font-sans text-2xl font-bold text-white mb-6">
                  Related Posts
                        </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <article
                      key={relatedPost.slug}
                      className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg overflow-hidden hover:border-[#d1a954]/50 transition-all duration-200"
                    >
                      <div className="relative h-32 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a]">
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-sans text-sm font-semibold text-white mb-2 line-clamp-2">
                          <Link
                            href={`/blog/${relatedPost.slug}`}
                            className="hover:text-[#d1a954] transition-colors"
                          >
                            {relatedPost.title}
                          </Link>
                        </h3>
                        <p className="text-[#a0a0a0] font-sans text-xs line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Author Bio */}
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6">
                <h3 className="font-sans text-lg font-semibold text-white mb-4">
                  About the Author
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#d1a954] rounded-full" />
                  <div>
                    <h4 className="font-sans font-medium text-white">{post.author.name}</h4>
                    <p className="text-[#a0a0a0] font-sans text-sm">{post.read_time}</p>
                  </div>
                </div>
                {post.author.bio && (
                  <p className="text-[#a0a0a0] font-sans text-sm">
                    {post.author.bio}
                  </p>
                )}
              </div>

              {/* Table of Contents */}
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6">
                <h3 className="font-sans text-lg font-semibold text-white mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  <a href="#introduction" className="block text-[#a0a0a0] hover:text-white transition-colors font-sans text-sm">
                    Introduction
                  </a>
                  <a href="#framework" className="block text-[#a0a0a0] hover:text-white transition-colors font-sans text-sm">
                    The 7D Framework
                  </a>
                  <a href="#benefits" className="block text-[#a0a0a0] hover:text-white transition-colors font-sans text-sm">
                    Benefits
                  </a>
                  <a href="#implementation" className="block text-[#a0a0a0] hover:text-white transition-colors font-sans text-sm">
                    Implementation
                  </a>
                  <a href="#conclusion" className="block text-[#a0a0a0] hover:text-white transition-colors font-sans text-sm">
                    Conclusion
                  </a>
                </nav>
                  </div>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleJSONLD({
            headline: post.title,
            description: post.excerpt,
            url: `https://chatgpt-prompting.com/blog/${post.slug}`,
            image: post.og_image || post.cover,
            author: post.author.name,
            datePublished: post.published_at,
            dateModified: post.updated_at || post.published_at,
          }))
        }}
      />
    </div>
  );
}

export async function generateStaticParams() {
  // In production, this would fetch all published blog post slugs
  return [
    { slug: "introduction-to-7d-framework" },
    { slug: "optimizing-prompt-performance" },
  ];
}
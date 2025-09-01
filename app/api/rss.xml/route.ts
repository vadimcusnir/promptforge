import { NextResponse } from 'next/server';

// Mock blog posts data - in production this would come from a CMS or database
const blogPosts = [
  {
    slug: "introduction-to-7d-framework",
    title: "Introduction to the 7D Framework for Prompt Engineering",
    excerpt: "Learn how the 7D framework revolutionizes prompt engineering with structured parameters for consistent, high-quality AI outputs.",
    cover: "/blog/7d-framework-intro.jpg",
    published_at: "2024-12-20T10:00:00Z",
    author: {
      name: "PromptForge Team",
    },
  },
  {
    slug: "optimizing-prompt-performance",
    title: "Optimizing Prompt Performance: A Complete Guide",
    excerpt: "Discover advanced techniques for improving prompt performance, including parameter tuning and quality validation strategies.",
    cover: "/blog/prompt-optimization.jpg",
    published_at: "2024-12-18T14:30:00Z",
    author: {
      name: "Alex Chen",
    },
  },
  {
    slug: "api-integration-best-practices",
    title: "API Integration Best Practices for PromptForge",
    excerpt: "Learn how to effectively integrate PromptForge APIs into your applications with real-world examples and best practices.",
    cover: "/blog/api-integration.jpg",
    published_at: "2024-12-15T09:15:00Z",
    author: {
      name: "Sarah Johnson",
    },
  },
  {
    slug: "understanding-prompt-scoring",
    title: "Understanding Prompt Scoring and Quality Metrics",
    excerpt: "Deep dive into how PromptForge evaluates prompt quality and what metrics matter most for your use cases.",
    cover: "/blog/prompt-scoring.jpg",
    published_at: "2024-12-12T16:45:00Z",
    author: {
      name: "Dr. Michael Rodriguez",
    },
  },
  {
    slug: "export-pipeline-deep-dive",
    title: "Export Pipeline Deep Dive: From Prompt to Production",
    excerpt: "Explore the complete export pipeline that transforms your prompts into production-ready formats with quality validation.",
    cover: "/blog/export-pipeline.jpg",
    published_at: "2024-12-10T11:20:00Z",
    author: {
      name: "Emma Wilson",
    },
  },
  {
    slug: "prompt-engineering-trends-2024",
    title: "Prompt Engineering Trends to Watch in 2024",
    excerpt: "Stay ahead of the curve with our analysis of emerging trends in prompt engineering and AI workflow optimization.",
    cover: "/blog/trends-2024.jpg",
    published_at: "2024-12-08T13:00:00Z",
    author: {
      name: "David Kim",
    },
  },
];

export async function GET() {
  const baseUrl = "https://chatgpt-prompting.com";
  const blogUrl = `${baseUrl}/blog`;
  
  // Generate RSS XML
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>PromptForge™ v3 Blog</title>
    <description>Latest insights, tutorials, and updates on prompt engineering, AI workflows, and the 7D framework</description>
    <link>${blogUrl}</link>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>PromptForge™ v3 Blog</title>
      <link>${blogUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <managingEditor>team@promptforge.com (PromptForge Team)</managingEditor>
    <webMaster>team@promptforge.com (PromptForge Team)</webMaster>
    <generator>PromptForge™ v3</generator>
    <docs>https://cyber.harvard.edu/rss/rss.html</docs>
    <ttl>60</ttl>
    
    ${blogPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <author>${post.author.name}</author>
      <category>Blog</category>
      ${post.cover ? `<media:content url="${baseUrl}${post.cover}" type="image/jpeg" medium="image">
        <media:title><![CDATA[${post.title}]]></media:title>
        <media:description><![CDATA[${post.excerpt}]]></media:description>
      </media:content>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

import { NextResponse } from "next/server"

const blogPosts = [
  {
    slug: "cognitive-stratification-mastery",
    title: "Cognitive Stratification: From Tool User to System Architect",
    description:
      "Discover the three-tier progression that separates industrial operators from casual users. Learn the behavioral markers that unlock advanced capabilities.",
    author: "Dr. Sarah Chen",
    publishDate: "2024-01-15",
    category: "Prompt Engineering",
  },
  {
    slug: "7d-parameter-engine-deep-dive",
    title: "The 7D Parameter Engine: Industrial-Grade Prompt Architecture",
    description:
      "Master the seven dimensions that transform simple prompts into auditable, scalable systems. Domain, Scale, Urgency, Complexity, Resources, Application, Output.",
    author: "Marcus Rodriguez",
    publishDate: "2024-01-12",
    category: "Automation",
  },
  {
    slug: "behavioral-screening-algorithms",
    title: "Behavioral Screening: Identifying Systems Thinkers",
    description:
      "How PromptForge's qualification algorithms separate tactical users from strategic operators. The 80% failure rate is by design.",
    author: "Dr. Elena Vasquez",
    publishDate: "2024-01-10",
    category: "Architecture",
  },
  {
    slug: "module-m01-m50-mastery",
    title: "The 50-Module Arsenal: From M01 to Industrial Mastery",
    description:
      "Navigate the complete module ecosystem. Learn which modules unlock at each cognitive tier and how to progress through the qualification system.",
    author: "James Park",
    publishDate: "2024-01-08",
    category: "Automation",
  },
  {
    slug: "exclusionary-pricing-philosophy",
    title: "Why We Price to Exclude: The Anti-SaaS Approach",
    description:
      "Traditional SaaS optimizes for inclusion. PromptForge optimizes for cognitive advancement. Learn why our pricing creates better outcomes.",
    author: "Alexandra Kim",
    publishDate: "2024-01-05",
    category: "Architecture",
  },
  {
    slug: "prompt-education-vs-transformation",
    title: "Beyond Prompt Education: Cognitive Transformation",
    description:
      "Why teaching prompts keeps users dependent. How PromptForge builds independent system operators through behavioral architecture.",
    author: "Dr. Michael Torres",
    publishDate: "2024-01-03",
    category: "Prompting",
  },
]

export async function GET() {
  const baseUrl = "https://promptforge.com"
  const buildDate = new Date().toUTCString()

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Forge Chronicles: AI Prompt Engineering &amp; Meta-Prompts Blog</title>
    <description>Discover industrial insights on AI prompting, custom GPTs, automation flows, and monetization strategies. Expert articles on cognitive stratification and system architecture.</description>
    <link>${baseUrl}/blog</link>
    <language>en-US</language>
    <managingEditor>editorial@promptforge.com (PromptForge Editorial)</managingEditor>
    <webMaster>technical@promptforge.com (PromptForge Technical)</webMaster>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Forge Chronicles</title>
      <link>${baseUrl}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${blogPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
      <author>editorial@promptforge.com (${post.author})</author>
      <category><![CDATA[${post.category}]]></category>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}

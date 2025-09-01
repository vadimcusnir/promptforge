import { MetadataRoute } from "next";

// Mock blog posts data - in production this would come from a CMS or database
const blogPosts = [
  {
    slug: "introduction-to-7d-framework",
    published_at: "2024-12-20T10:00:00Z",
    updated_at: "2024-12-20T10:00:00Z",
  },
  {
    slug: "optimizing-prompt-performance",
    published_at: "2024-12-18T14:30:00Z",
    updated_at: "2024-12-18T14:30:00Z",
  },
  {
    slug: "api-integration-best-practices",
    published_at: "2024-12-15T09:15:00Z",
    updated_at: "2024-12-15T09:15:00Z",
  },
  {
    slug: "understanding-prompt-scoring",
    published_at: "2024-12-12T16:45:00Z",
    updated_at: "2024-12-12T16:45:00Z",
  },
  {
    slug: "export-pipeline-deep-dive",
    published_at: "2024-12-10T11:20:00Z",
    updated_at: "2024-12-10T11:20:00Z",
  },
  {
    slug: "prompt-engineering-trends-2024",
    published_at: "2024-12-08T13:00:00Z",
    updated_at: "2024-12-08T13:00:00Z",
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chatgpt-prompting.com";

  return [
    // Blog index page
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Individual blog posts
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
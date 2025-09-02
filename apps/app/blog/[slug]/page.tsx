import type { Metadata } from "next"
import { BlogArticlePageClient } from "./BlogArticlePageClient"
import { articleData } from "./articleData"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = articleData[params.slug as keyof typeof articleData]

  if (!article) {
    return {
      title: "Article Not Found - Forge Chronicles",
      description: "The requested article could not be found.",
    }
  }

  const baseUrl = "https://promptforge.com"
  const articleUrl = `${baseUrl}/blog/${params.slug}`

  return {
    title: `${article.title} - Forge Chronicles`,
    description: article.description,
    canonical: articleUrl,
    openGraph: {
      title: article.title,
      description: article.description,
      url: articleUrl,
      siteName: "PromptForge",
      images: [
        {
          url: `${baseUrl}${article.coverImage}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.publishDate,
      authors: [article.author],
      tags: article.vectors,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [`${baseUrl}${article.coverImage}`],
    },
    other: {
      "article:author": article.author,
      "article:published_time": article.publishDate,
      "article:section": article.domain,
      "article:tag": article.vectors.join(", "),
    },
  }
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  return <BlogArticlePageClient params={params} />
}

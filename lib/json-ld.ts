interface TechArticleData {
  headline: string;
  description: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  url: string;
  image?: string;
}

interface OrganizationData {
  name: string;
  logo?: string;
  url?: string;
}

export function generateTechArticleJSONLD(
  article: TechArticleData,
  organization: OrganizationData = { name: 'PromptForge' }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.headline,
    description: article.description,
    author: {
      '@type': 'Organization',
      name: organization.name,
    },
    datePublished: article.datePublished || new Date().toISOString().split('T')[0],
    dateModified: article.dateModified || new Date().toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name: organization.name,
      ...(organization.logo && {
        logo: {
          '@type': 'ImageObject',
          url: organization.logo,
        },
      }),
      ...(organization.url && { url: organization.url }),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
    ...(article.image && {
      image: {
        '@type': 'ImageObject',
        url: article.image,
      },
    }),
  };
}

export function generateOrganizationJSONLD(organization: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    ...(organization.logo && {
      logo: {
        '@type': 'ImageObject',
        url: organization.logo,
      },
    }),
    ...(organization.url && { url: organization.url }),
  };
}

export function generateWebSiteJSONLD(siteName: string, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBlogIndexJSONLD(data: {
  title: string;
  description: string;
  url: string;
  posts: Array<{
    title: string;
    url: string;
    publishedAt: string;
    author: string;
    excerpt: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: data.title,
    description: data.description,
    url: data.url,
    publisher: {
      '@type': 'Organization',
      name: 'PromptForge',
      logo: {
        '@type': 'ImageObject',
        url: 'https://chatgpt-prompting.com/logo.png',
      },
    },
    blogPost: data.posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: post.url,
      datePublished: post.publishedAt,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      description: post.excerpt,
    })),
  };
}

export function generateBreadcrumbJSONLD(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

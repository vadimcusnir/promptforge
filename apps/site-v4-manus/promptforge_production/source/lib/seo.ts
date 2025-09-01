import { Module } from './modules';

// =================================
// SEO UTILITIES - JSON-LD & META
// =================================

export function generateModuleJsonLd(module: Module) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": module.title,
    "description": module.summary,
    "applicationCategory": "AI Tool",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "PromptForge",
      "url": "https://chatgpt-prompting.com"
    },
    "creator": {
      "@type": "Person",
      "name": module.author
    },
    "dateCreated": module.createdAt,
    "dateModified": module.updatedAt,
    "version": module.version,
    "downloadUrl": `https://chatgpt-prompting.com/modules/${module.id}`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": module.rating,
      "reviewCount": module.reviews,
      "bestRating": 5,
      "worstRating": 1
    },
    "keywords": [...module.vectors, ...module.tags].join(', '),
    "softwareRequirements": `Requires ${module.minPlan} plan`,
    "featureList": module.vectors.map(vector => `7D Vector: ${vector}`),
    "screenshot": module.image,
    "license": module.license,
    "url": `https://chatgpt-prompting.com/modules/${module.id}`
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PromptForge",
    "alternateName": "PromptForge v3.1",
    "url": "https://chatgpt-prompting.com",
    "logo": "https://chatgpt-prompting.com/logo.png",
    "description": "Industrial prompt engineering platform with 50 modules and 7D parameter optimization",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/promptforge",
      "https://github.com/promptforge",
      "https://linkedin.com/company/promptforge"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@chatgpt-prompting.com"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PromptForge v3.1",
    "description": "Industrial prompt engineering platform",
    "url": "https://chatgpt-prompting.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://chatgpt-prompting.com/modules?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PromptForge"
    }
  };
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function generateModuleListJsonLd(modules: Module[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "PromptForge Module Library",
    "description": "Collection of 50 operational modules with 7D parameter optimization",
    "numberOfItems": modules.length,
    "itemListElement": modules.map((module, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": module.title,
        "description": module.summary,
        "url": `https://chatgpt-prompting.com/modules/${module.id}`,
        "applicationCategory": "AI Tool",
        "operatingSystem": "Web Browser"
      }
    }))
  };
}

// Meta tag generators
export function generateMetaTags(module: Module) {
  return {
    title: `${module.title} — PromptForge v3.1`,
    description: module.summary,
    keywords: [...module.vectors, ...module.tags, 'prompt engineering', 'AI module'].join(', '),
    openGraph: {
      title: `${module.title} — PromptForge v3.1`,
      description: module.summary,
      url: `https://chatgpt-prompting.com/modules/${module.id}`,
      type: 'website',
      images: [
        {
          url: module.image || 'https://chatgpt-prompting.com/og-module-default.png',
          width: 1200,
          height: 630,
          alt: module.title
        }
      ],
      siteName: 'PromptForge v3.1'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${module.title} — PromptForge v3.1`,
      description: module.summary,
      images: [module.image || 'https://chatgpt-prompting.com/og-module-default.png']
    },
    alternates: {
      canonical: `https://chatgpt-prompting.com/modules/${module.id}`
    }
  };
}

// Structured data for search engines
export function generateStructuredData(module: Module) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": module.title,
    "description": module.description,
    "author": {
      "@type": "Person",
      "name": module.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "PromptForge",
      "logo": {
        "@type": "ImageObject",
        "url": "https://chatgpt-prompting.com/logo.png"
      }
    },
    "datePublished": module.createdAt,
    "dateModified": module.updatedAt,
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": module.title,
      "applicationCategory": "AI Tool",
      "operatingSystem": "Web Browser"
    },
    "keywords": [...module.vectors, ...module.tags].join(', '),
    "articleSection": "AI Tools",
    "articleBody": module.description
  };
}

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://chatgpt-prompting.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/modules',
          '/modules/*',
          '/pricing',
          '/generator',
          '/docs',
          '/about',
          '/contact',
          '/legal/*',
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/dashboard/*',
          '/_next/*',
          '/static/*',
          '/*.json',
          '/*.xml',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/modules',
          '/modules/*',
          '/docs',
          '/about',
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/dashboard/*',
          '/legal/*',
        ],
      },
      {
        userAgent: 'CCBot',
        allow: [
          '/',
          '/modules',
          '/modules/*',
          '/docs',
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/dashboard/*',
          '/legal/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

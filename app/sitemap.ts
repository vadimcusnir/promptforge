import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://chatgpt-prompting.com'
  const now = new Date()
  
  // Core pages with high priority
  const corePages = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/generator`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/modules`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Documentation pages
  const documentationPages: Array<{
    url: string
    lastModified: Date
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: number
  }> = [
    {
      url: `${baseUrl}/docs`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

    // Individual guide pages (static) - temporarily disabled
  const guidePages: any[] = []
  // [
  //   'first-prompt',
  //   'platform-overview',
  //   'account-setup',
  //   'module-selection',
  //   'module-combinations',
  //   'module-optimization',
  //   '7d-parameters',
  //   'domain-selection',
  //   'scale-urgency-config',
  //   'test-simulate',
  //   'quality-scoring',
  //   'a-b-testing',
  //   'export-bundles',
  //   'format-selection',
  //   'batch-export',
  //   'api-integration',
  //   'api-authentication',
  //   'webhook-integration'
  // ].map(slug => ({
  //   url: `${baseUrl}/guides/${slug}`,
  //   lastModified: now,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }))

  // Individual module pages (static) - using new slugs
  const modulePages = [
    'sop-forge',
    'trust-reversal-protocol',
    'crisis-communication-playbook',
    'social-content-grid',
    'landing-page-alchemist',
    'influence-partnership-frame',
    'content-analytics-dashboard',
    'audience-segment-personalizer',
    'momentum-campaign-builder',
    'data-schema-optimizer',
    'microservices-grid',
    'security-fortress-frame',
    'performance-engine',
    'orchestration-matrix',
    'cloud-infra-map',
    'sales-flow-architect',
    'enablement-frame',
    'customer-success-playbook',
    'intelligence-engine',
    'negotiation-dynamics',
    'quality-system-map',
    'supply-flow-optimizer',
    'change-force-field',
    'executive-prompt-dossier'
  ].map(slug => ({
    url: `${baseUrl}/modules/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Blog pages (static)
  const blogPages = [
    'complete-guide-prompt-engineering',
    '7d-framework-business-communication-ai'
  ].map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

            // Secondary pages
          const secondaryPages = [
            {
              url: `${baseUrl}/about`,
              lastModified: now,
              changeFrequency: 'monthly' as const,
              priority: 0.5,
            },
            {
              url: `${baseUrl}/contact`,
              lastModified: now,
              changeFrequency: 'monthly' as const,
              priority: 0.5,
            },
            {
              url: `${baseUrl}/blog`,
              lastModified: now,
              changeFrequency: 'weekly' as const,
              priority: 0.6,
            },
            // Temporarily disabled due to build issues
            // {
            //   url: `${baseUrl}/launch`,
            //   lastModified: now,
            //   changeFrequency: 'monthly' as const,
            //   priority: 0.4,
            // },
          ]

  // Legal pages
  const legalPages = [
    {
      url: `${baseUrl}/legal`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/security`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/gdpr`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/dpa`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Auth and utility pages (lower priority)
  const utilityPages = [
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/thankyou`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.1,
    },
  ]

  // Coming soon page (noindex but included for completeness)
  const comingSoonPage = {
    url: `${baseUrl}/coming-soon`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.1,
  }

  return [
    ...corePages,
    ...documentationPages,
    ...guidePages,
    ...modulePages,
    ...blogPages,
    ...secondaryPages,
    ...legalPages,
    ...utilityPages,
    comingSoonPage,
  ]
}

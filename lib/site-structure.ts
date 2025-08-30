/**
 * Site Structure and Navigation Tree
 * Defines the hierarchical structure of the PromptForge website
 * Used for breadcrumb generation, navigation, and SEO
 */

export interface SiteNode {
  id: string
  title: string
  path: string
  description?: string
  children?: SiteNode[]
  isActive?: boolean
  isExternal?: boolean
  requiresAuth?: boolean
  plan?: 'free' | 'creator' | 'pro' | 'enterprise'
  category?: string
  icon?: string
  meta?: {
    robots?: string
    canonical?: string
    keywords?: string[]
  }
}

export const SITE_STRUCTURE: SiteNode = {
  id: 'root',
  title: 'PromptForge',
  path: '/',
  description: 'Industrial Prompt Engineering Platform',
  children: [
    // Main Application Pages
    {
      id: 'home',
      title: 'Home',
      path: '/',
      description: 'Industrial Prompt Engineering Platform',
      category: 'main'
    },
    {
      id: 'generator',
      title: 'Generator',
      path: '/generator',
      description: 'AI Prompt Generator with 7D Parameters',
      category: 'main',
      plan: 'free'
    },
    {
      id: 'modules',
      title: 'Modules',
      path: '/modules',
      description: '50 Industrial Prompt Engineering Modules',
      category: 'main',
      children: [
        {
          id: 'module-detail',
          title: 'Module Details',
          path: '/modules/[slug]',
          description: 'Individual Module Information',
          category: 'modules'
        }
      ]
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/dashboard',
      description: 'User Dashboard and Analytics',
      category: 'main',
      requiresAuth: true
    },

    // Learning & Documentation
    {
      id: 'guides',
      title: 'Guides',
      path: '/guides',
      description: 'Prompt Engineering Tutorials and Guides',
      category: 'learning',
      children: [
        {
          id: 'guide-detail',
          title: 'Guide Details',
          path: '/guides/[slug]',
          description: 'Individual Guide Content',
          category: 'learning'
        }
      ]
    },
    {
      id: 'docs',
      title: 'Documentation',
      path: '/docs',
      description: 'Technical Documentation and API Reference',
      category: 'learning'
    },
    {
      id: 'blog',
      title: 'Blog',
      path: '/blog',
      description: 'Latest News and Insights',
      category: 'learning',
      children: [
        {
          id: 'blog-post',
          title: 'Blog Post',
          path: '/blog/[slug]',
          description: 'Individual Blog Post',
          category: 'learning'
        }
      ]
    },

    // Business & Legal
    {
      id: 'pricing',
      title: 'Pricing',
      path: '/pricing',
      description: 'Plans and Pricing Information',
      category: 'business'
    },
    {
      id: 'about',
      title: 'About',
      path: '/about',
      description: 'About PromptForge',
      category: 'business'
    },
    {
      id: 'contact',
      title: 'Contact',
      path: '/contact',
      description: 'Contact Information and Support',
      category: 'business'
    },

    // Legal Pages
    {
      id: 'legal',
      title: 'Legal',
      path: '/legal',
      description: 'Legal Information',
      category: 'legal',
      children: [
        {
          id: 'privacy',
          title: 'Privacy Policy',
          path: '/legal/privacy',
          description: 'Privacy Policy and Data Protection',
          category: 'legal'
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          path: '/legal/terms',
          description: 'Terms of Service and Usage',
          category: 'legal'
        },
        {
          id: 'security',
          title: 'Security',
          path: '/legal/security',
          description: 'Security Information and Compliance',
          category: 'legal'
        },
        {
          id: 'gdpr',
          title: 'GDPR',
          path: '/legal/gdpr',
          description: 'GDPR Compliance Information',
          category: 'legal'
        },
        {
          id: 'dpa',
          title: 'Data Processing Agreement',
          path: '/legal/dpa',
          description: 'Data Processing Agreement',
          category: 'legal'
        }
      ]
    },

    // Authentication
    {
      id: 'auth',
      title: 'Authentication',
      path: '/auth',
      description: 'User Authentication',
      category: 'auth',
      children: [
        {
          id: 'login',
          title: 'Login',
          path: '/login',
          description: 'User Login',
          category: 'auth'
        },
        {
          id: 'signup',
          title: 'Sign Up',
          path: '/signup',
          description: 'User Registration',
          category: 'auth'
        }
      ]
    },

    // Special Pages
    {
      id: 'launch',
      title: 'Launch',
      path: '/launch',
      description: 'Product Launch Information',
      category: 'special'
    },
    {
      id: 'coming-soon',
      title: 'Coming Soon',
      path: '/coming-soon',
      description: 'Coming Soon Page',
      category: 'special'
    },
    {
      id: 'thankyou',
      title: 'Thank You',
      path: '/thankyou',
      description: 'Thank You Page',
      category: 'special'
    },

    // Admin & Testing (Development)
    {
      id: 'admin',
      title: 'Admin',
      path: '/admin',
      description: 'Administrative Panel',
      category: 'admin',
      requiresAuth: true,
      plan: 'enterprise'
    },
    {
      id: 'observability-test',
      title: 'Observability Test',
      path: '/observability-test',
      description: 'Observability Testing Page',
      category: 'testing'
    },
    {
      id: 'sentry-test',
      title: 'Sentry Test',
      path: '/sentry-test',
      description: 'Sentry Error Testing',
      category: 'testing'
    }
  ]
}

/**
 * Find a node in the site structure by path
 */
export function findNodeByPath(path: string, node: SiteNode = SITE_STRUCTURE): SiteNode | null {
  if (node.path === path) {
    return node
  }

  if (node.children) {
    for (const child of node.children) {
      const found = findNodeByPath(path, child)
      if (found) return found
    }
  }

  return null
}

/**
 * Find a node by ID
 */
export function findNodeById(id: string, node: SiteNode = SITE_STRUCTURE): SiteNode | null {
  if (node.id === id) {
    return node
  }

  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(id, child)
      if (found) return found
    }
  }

  return null
}

/**
 * Get breadcrumb trail for a given path
 */
export function getBreadcrumbTrail(path: string): SiteNode[] {
  const trail: SiteNode[] = []
  
  // Always start with home
  const homeNode = findNodeById('home')
  if (homeNode) {
    trail.push(homeNode)
  }

  // Handle dynamic routes
  const normalizedPath = normalizePath(path)
  
  // Find the matching node
  const targetNode = findNodeByPath(normalizedPath)
  if (targetNode && targetNode.id !== 'home') {
    // Build trail by walking up the hierarchy
    buildTrailToNode(targetNode, trail)
  }

  return trail
}

/**
 * Normalize path for matching (handle dynamic routes)
 */
function normalizePath(path: string): string {
  // Handle dynamic routes
  if (path.includes('/modules/') && path !== '/modules') {
    return '/modules/[slug]'
  }
  if (path.includes('/guides/') && path !== '/guides') {
    return '/guides/[slug]'
  }
  if (path.includes('/blog/') && path !== '/blog') {
    return '/blog/[slug]'
  }
  
  return path
}

/**
 * Build trail to a specific node
 */
function buildTrailToNode(targetNode: SiteNode, trail: SiteNode[]): void {
  // Find parent nodes by checking if target is a child
  const parent = findParentNode(targetNode, SITE_STRUCTURE)
  
  if (parent && parent.id !== 'root') {
    buildTrailToNode(parent, trail)
  }
  
  // Add current node to trail
  trail.push(targetNode)
}

/**
 * Find parent node of a given node
 */
function findParentNode(targetNode: SiteNode, rootNode: SiteNode): SiteNode | null {
  if (rootNode.children) {
    for (const child of rootNode.children) {
      if (child.id === targetNode.id) {
        return rootNode
      }
      
      const found = findParentNode(targetNode, child)
      if (found) return found
    }
  }
  
  return null
}

/**
 * Get navigation items for a specific category
 */
export function getNavigationItems(category?: string): SiteNode[] {
  if (!category) {
    return SITE_STRUCTURE.children?.filter(node => 
      ['main', 'learning', 'business'].includes(node.category || '')
    ) || []
  }
  
  return SITE_STRUCTURE.children?.filter(node => node.category === category) || []
}

/**
 * Get all public pages (for sitemap generation)
 */
export function getAllPublicPages(): SiteNode[] {
  const pages: SiteNode[] = []
  
  function collectPages(node: SiteNode) {
    if (node.id !== 'root' && !node.requiresAuth && node.category !== 'admin' && node.category !== 'testing') {
      pages.push(node)
    }
    
    if (node.children) {
      node.children.forEach(collectPages)
    }
  }
  
  collectPages(SITE_STRUCTURE)
  return pages
}

/**
 * Get page metadata for SEO
 */
export function getPageMetadata(path: string): Partial<SiteNode> {
  const node = findNodeByPath(normalizePath(path))
  return node || {}
}

/**
 * Check if a path requires authentication
 */
export function requiresAuth(path: string): boolean {
  const node = findNodeByPath(normalizePath(path))
  return node?.requiresAuth || false
}

/**
 * Check if a path requires a specific plan
 */
export function getRequiredPlan(path: string): string | null {
  const node = findNodeByPath(normalizePath(path))
  return node?.plan || null
}

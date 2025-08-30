# Site Structure & Navigation Guide

This guide explains how to use the centralized site structure and breadcrumb system in PromptForge v3.

## Overview

The site structure is defined in `lib/site-structure.ts` and provides:
- Hierarchical navigation tree
- Automatic breadcrumb generation
- SEO metadata management
- Sitemap generation
- Navigation components

## Site Structure

The site is organized into the following categories:

### Main Pages (`main`)
- `/` - Homepage
- `/generator` - AI Prompt Generator
- `/modules` - Module Library
- `/dashboard` - User Dashboard (requires auth)

### Learning (`learning`)
- `/guides` - Tutorials and Guides
- `/docs` - Technical Documentation
- `/blog` - News and Insights

### Business (`business`)
- `/pricing` - Plans and Pricing
- `/about` - About PromptForge
- `/contact` - Contact Information

### Legal (`legal`)
- `/legal/privacy` - Privacy Policy
- `/legal/terms` - Terms of Service
- `/legal/security` - Security Information
- `/legal/gdpr` - GDPR Compliance
- `/legal/dpa` - Data Processing Agreement

### Authentication (`auth`)
- `/login` - User Login
- `/signup` - User Registration

### Special Pages (`special`)
- `/launch` - Product Launch
- `/coming-soon` - Coming Soon
- `/thankyou` - Thank You

## Breadcrumb System

### Automatic Breadcrumbs

The breadcrumb system automatically generates navigation trails based on the site structure:

```tsx
import { Breadcrumb } from "@/components/ui/breadcrumb"

// Automatic breadcrumb generation
<Breadcrumb path="/modules/trust-reversal-protocol" />
// Generates: Home > Modules > Trust Reversal Protocol

<Breadcrumb path="/legal/privacy" />
// Generates: Home > Legal > Privacy Policy
```

### Manual Breadcrumbs

You can also provide manual breadcrumb items:

```tsx
const breadcrumbItems = [
  { label: "Custom", href: "/custom" },
  { label: "Current Page", current: true }
]

<Breadcrumb items={breadcrumbItems} />
```

### Breadcrumb Options

```tsx
<Breadcrumb 
  path="/modules/trust-reversal-protocol"
  showHome={true}        // Show home icon (default: true)
  maxItems={5}           // Limit breadcrumb items (default: 5)
  className="custom-class"
/>
```

## Navigation Components

### Site Navigation

```tsx
import { SiteNavigation } from "@/components/navigation/site-navigation"

// Full navigation with categories
<SiteNavigation showCategories={true} />

// Simple navigation without categories
<SiteNavigation showCategories={false} />

// Mobile navigation
<MobileSiteNavigation />
```

### Navigation Features

- **Active State Detection**: Automatically highlights current page
- **Dropdown Menus**: For pages with children
- **Responsive Design**: Mobile-friendly navigation
- **Accessibility**: ARIA labels and keyboard navigation

## Sitemap Generation

The sitemap is automatically generated from the site structure:

```tsx
// In app/sitemap.ts
import { getAllPublicPages } from '@/lib/site-structure'

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = getAllPublicPages()
  // Automatically generates sitemap entries
}
```

## Adding New Pages

### 1. Update Site Structure

Add your new page to `lib/site-structure.ts`:

```tsx
{
  id: 'new-page',
  title: 'New Page',
  path: '/new-page',
  description: 'Description for SEO',
  category: 'main', // or 'learning', 'business', etc.
  requiresAuth: false, // optional
  plan: 'free' // optional
}
```

### 2. Create the Page

Create your page component in the appropriate directory:

```tsx
// app/new-page/page.tsx
import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function NewPage() {
  return (
    <div>
      <Breadcrumb path="/new-page" />
      {/* Your page content */}
    </div>
  )
}
```

### 3. Update Navigation (if needed)

If you want the page in the main navigation, it will automatically appear based on its category.

## Dynamic Routes

The system handles dynamic routes automatically:

```tsx
// For /modules/[slug]
<Breadcrumb path="/modules/trust-reversal-protocol" />
// Generates: Home > Modules > Trust Reversal Protocol

// For /guides/[slug]
<Breadcrumb path="/guides/first-prompt" />
// Generates: Home > Guides > First Prompt
```

## SEO Integration

### Page Metadata

```tsx
import { getPageMetadata } from '@/lib/site-structure'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const metadata = getPageMetadata(`/modules/${params.slug}`)
  
  return {
    title: metadata.title,
    description: metadata.description,
    // ... other metadata
  }
}
```

### Structured Data

The breadcrumb system automatically generates structured data for search engines.

## Best Practices

### 1. Consistent Naming
- Use descriptive, SEO-friendly titles
- Keep paths simple and logical
- Use kebab-case for URLs

### 2. Category Organization
- Group related pages in the same category
- Use consistent category names
- Consider user mental models

### 3. Breadcrumb Usage
- Always use automatic breadcrumbs when possible
- Only use manual breadcrumbs for special cases
- Keep breadcrumb trails concise (max 5 items)

### 4. Navigation Design
- Show categories in main navigation
- Use dropdowns for pages with children
- Provide mobile-friendly alternatives

## Troubleshooting

### Breadcrumb Not Showing
- Check if the path exists in site structure
- Verify the path format matches exactly
- Ensure the page is not in a restricted category

### Navigation Issues
- Verify the page category is correct
- Check if `requiresAuth` is set properly
- Ensure the page is not in `admin` or `testing` categories

### Sitemap Problems
- Run `getAllPublicPages()` to see included pages
- Check if pages have `requiresAuth: true`
- Verify pages are not in excluded categories

## Examples

### Complete Page Implementation

```tsx
// app/example/page.tsx
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { getPageMetadata } from '@/lib/site-structure'

export async function generateMetadata() {
  return getPageMetadata('/example')
}

export default function ExamplePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb path="/example" />
      
      <h1>Example Page</h1>
      {/* Your content */}
    </div>
  )
}
```

### Custom Navigation

```tsx
// components/custom-nav.tsx
import { getNavigationItems } from '@/lib/site-structure'

export function CustomNav() {
  const mainItems = getNavigationItems('main')
  const learningItems = getNavigationItems('learning')
  
  return (
    <nav>
      <div>
        <h3>Main</h3>
        {mainItems.map(item => (
          <a key={item.id} href={item.path}>{item.title}</a>
        ))}
      </div>
      
      <div>
        <h3>Learning</h3>
        {learningItems.map(item => (
          <a key={item.id} href={item.path}>{item.title}</a>
        ))}
      </div>
    </nav>
  )
}
```

This system provides a centralized, maintainable approach to site navigation and SEO while ensuring consistency across the entire application.

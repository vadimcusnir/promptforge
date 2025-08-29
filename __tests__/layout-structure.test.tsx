import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'

// Mock Next.js components and hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

jest.mock('@/components/coming-soon-wrapper', () => ({
  ComingSoonWrapper: ({ children }: { children: React.ReactNode }) => <div data-testid="coming-soon-wrapper">{children}</div>,
}))

jest.mock('@/components/analytics-provider', () => ({
  AnalyticsProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="analytics-provider">{children}</div>,
}))

jest.mock('@/components/error-boundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>,
}))

jest.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster" />,
}))

jest.mock('@/components/ui/skip-link', () => ({
  SkipLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="skip-link">{children}</a>
  ),
}))

jest.mock('@/components/cookie-banner', () => ({
  CookieBanner: () => <div data-testid="cookie-banner" />,
}))

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  jest.resetModules()
  process.env = { ...originalEnv }
  process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'
  process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123'
  process.env.GOOGLE_SITE_VERIFICATION = 'test-verification'
})

afterEach(() => {
  process.env = originalEnv
})

// Test file structure and configuration
describe('Layout File Structure', () => {
  it('should have proper ARIA roles in Header component', () => {
    const headerPath = path.join(process.cwd(), 'components/header.tsx')
    const headerContent = fs.readFileSync(headerPath, 'utf8')
    
    // Check for role="banner"
    expect(headerContent).toMatch(/role="banner"/)
    
    // Check for proper header tag
    expect(headerContent).toMatch(/<header[^>]*role="banner"/)
  })
  
  it('should have proper ARIA roles in Footer component', () => {
    const footerPath = path.join(process.cwd(), 'components/footer.tsx')
    const footerContent = fs.readFileSync(footerPath, 'utf8')
    
    // Check for role="contentinfo"
    expect(footerContent).toMatch(/role="contentinfo"/)
    
    // Check for proper footer tag
    expect(footerContent).toMatch(/<footer[^>]*role="contentinfo"/)
  })
  
  it('should have proper layout structure in main layout', () => {
    const layoutPath = path.join(process.cwd(), 'app/layout.tsx')
    const layoutContent = fs.readFileSync(layoutPath, 'utf8')
    
    // Check for Header import
    expect(layoutContent).toMatch(/import.*Header.*from.*@\/components\/header/)
    
    // Check for Footer import
    expect(layoutContent).toMatch(/import.*Footer.*from.*@\/components\/footer/)
    
    // Check for Header usage
    expect(layoutContent).toMatch(/<Header\s*\/>/)
    
    // Check for Footer usage
    expect(layoutContent).toMatch(/<Footer\s*\/>/)
  })
  
  it('should have cursor configuration protection', () => {
    const cursorConfigPath = path.join(process.cwd(), 'cursor/init.json')
    const cursorConfig = fs.readFileSync(cursorConfigPath, 'utf8')
    
    // Check for layout protection configuration
    expect(cursorConfig).toMatch(/"layout_protection"/)
    expect(cursorConfig).toMatch(/"global_layout_forbidden"/)
    expect(cursorConfig).toMatch(/"app\/layout\.tsx"/)
    expect(cursorConfig).toMatch(/"components\/header\.tsx"/)
    expect(cursorConfig).toMatch(/"components\/footer\.tsx"/)
  })
})

// Test component isolation
describe('Component Isolation', () => {
  it('should not have Header imports outside main layout', () => {
    const appDir = path.join(process.cwd(), 'app')
    const files = getAllFiles(appDir, ['.tsx', '.ts'])
    
    let headerImportsOutsideLayout = 0
    
    files.forEach(file => {
      if (file !== path.join(appDir, 'layout.tsx')) {
        const content = fs.readFileSync(file, 'utf8')
        if (content.includes('import') && content.includes('Header') && content.includes('@/components/header')) {
          headerImportsOutsideLayout++
        }
      }
    })
    
    expect(headerImportsOutsideLayout).toBe(0)
  })
  
  it('should not have Footer imports outside main layout', () => {
    const appDir = path.join(process.cwd(), 'app')
    const files = getAllFiles(appDir, ['.tsx', '.ts'])
    
    let footerImportsOutsideLayout = 0
    
    files.forEach(file => {
      if (file !== path.join(appDir, 'layout.tsx')) {
        const content = fs.readFileSync(file, 'utf8')
        if (content.includes('import') && content.includes('Footer') && content.includes('@/components/footer')) {
          footerImportsOutsideLayout++
        }
      }
    })
    
    expect(footerImportsOutsideLayout).toBe(0)
  })
  
  it('should not have Header usage outside main layout', () => {
    const appDir = path.join(process.cwd(), 'app')
    const files = getAllFiles(appDir, ['.tsx', '.ts'])
    
    let headerUsageOutsideLayout = 0
    
    files.forEach(file => {
      if (file !== path.join(appDir, 'layout.tsx')) {
        const content = fs.readFileSync(file, 'utf8')
        if (content.includes('<Header') || content.includes('<Header/>')) {
          headerUsageOutsideLayout++
        }
      }
    })
    
    expect(headerUsageOutsideLayout).toBe(0)
  })
  
  it('should not have Footer usage outside main layout', () => {
    const appDir = path.join(process.cwd(), 'app')
    const files = getAllFiles(appDir, ['.tsx', '.ts'])
    
    let footerUsageOutsideLayout = 0
    
    files.forEach(file => {
      if (file !== path.join(appDir, 'layout.tsx')) {
        const content = fs.readFileSync(file, 'utf8')
        if (content.includes('<Footer') || content.includes('<Footer/>')) {
          footerUsageOutsideLayout++
        }
      }
    })
    
    expect(footerUsageOutsideLayout).toBe(0)
  })
})

// Test accessibility compliance
describe('Accessibility Compliance', () => {
  it('should have proper skip link structure', () => {
    const layoutPath = path.join(process.cwd(), 'app/layout.tsx')
    const layoutContent = fs.readFileSync(layoutPath, 'utf8')
    
    // Check for SkipLink import
    expect(layoutContent).toMatch(/import.*SkipLink.*from.*@\/components\/ui\/skip-link/)
    
    // Check for SkipLink usage with proper href
    expect(layoutContent).toMatch(/<SkipLink[^>]*href="#main-content"[^>]*>/)
  })
  
  it('should have proper navigation structure in Header', () => {
    const headerPath = path.join(process.cwd(), 'components/header.tsx')
    const headerContent = fs.readFileSync(headerPath, 'utf8')
    
    // Check for navigation role
    expect(headerContent).toMatch(/role="navigation"/)
    
    // Check for proper nav tag
    expect(headerContent).toMatch(/<nav[^>]*role="navigation"/)
  })
})

// Test coming-soon layout isolation
describe('Coming Soon Layout', () => {
  it('should have local layout without navigation', () => {
    const comingSoonLayoutPath = path.join(process.cwd(), 'app/coming-soon/layout.tsx')
    const comingSoonLayoutContent = fs.readFileSync(comingSoonLayoutPath, 'utf8')
    
    // Should not import Header or Footer
    expect(comingSoonLayoutContent).not.toMatch(/import.*Header/)
    expect(comingSoonLayoutContent).not.toMatch(/import.*Footer/)
    
    // Should not use Header or Footer components
    expect(comingSoonLayoutContent).not.toMatch(/<Header/)
    expect(comingSoonLayoutContent).not.toMatch(/<Footer/)
    
    // Should have simple layout structure
    expect(comingSoonLayoutContent).toMatch(/export default function ComingSoonLayout/)
    expect(comingSoonLayoutContent).toMatch(/return \(/)
  })
})

// Helper function to get all files in a directory
function getAllFiles(dirPath: string, extensions: string[]): string[] {
  const files: string[] = []
  
  function traverse(currentPath: string) {
    const items = fs.readdirSync(currentPath)
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        traverse(fullPath)
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath)
        if (extensions.includes(ext)) {
          files.push(fullPath)
        }
      }
    }
  }
  
  traverse(dirPath)
  return files
}

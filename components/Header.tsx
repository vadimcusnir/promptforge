"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { COPY } from "@/lib/copy"
import { 
  Home, 
  ChevronRight,
} from "lucide-react"

interface HeaderProps {
  isAuthenticated?: boolean
  showBreadcrumbs?: boolean
}

export function Header({ isAuthenticated = false, showBreadcrumbs = true }: HeaderProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const pathname = usePathname()

  const getBreadcrumbPage = () => {
    if (pathname === '/') return 'Homepage'
    if (pathname === '/generator') return 'Generator'
    if (pathname === '/modules') return 'Modules'
    if (pathname === '/pricing') return 'Pricing'
    if (pathname === '/dashboard') return 'Dashboard'
    return 'Page'
  }

  return (
    <header 
      role="banner"
      className="sticky top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800/50 transition-all duration-300 ease-out"
    >
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="flex items-center py-2 text-xs text-gray-400 border-b border-gray-800/30">
            <Home className="w-3 h-3 mr-1" />
            <span>{COPY.brand}</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="text-[#d1a954]">Cognitive OS</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span>{getBreadcrumbPage()}</span>
          </div>
        )}

        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="text-[#d1a954] font-black text-xl tracking-wider font-mono">{COPY.brand}</div>
              <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs font-mono text-green-400">
                FREE
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Desktop Navigation */}
            <nav 
              className="hidden md:flex items-center space-x-4 text-sm font-mono"
              aria-label="Primary navigation"
            >
              <span className="text-gray-400">€29/mo</span>
              <span className="text-gray-600">|</span>
              <button
                className="text-white font-bold tracking-wider underline cursor-pointer font-mono hover:text-[#d1a954] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Navigate to Generator"
                aria-current={pathname === '/generator' ? "page" : undefined}
              >
                {COPY.nav_generator.toUpperCase()}
              </button>
              <button
                className="text-white font-bold tracking-wider underline cursor-pointer font-mono hover:text-[#d1a954] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="View Pricing"
                aria-current={pathname === '/pricing' ? "page" : undefined}
              >
                {COPY.nav_pricing.toUpperCase()}
              </button>
              <button
                className="text-white font-bold tracking-wider underline cursor-pointer font-mono hover:text-[#d1a954] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="View Modules"
                aria-current={pathname === '/modules' ? "page" : undefined}
              >
                {COPY.nav_modules.toUpperCase()}
              </button>
              <button
                className="text-white font-bold tracking-wider underline cursor-pointer font-mono hover:text-[#d1a954] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="View Documentation"
                aria-current={pathname === '/docs' ? "page" : undefined}
              >
                {COPY.nav_docs.toUpperCase()}
              </button>
            </nav>

            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <Button
                  className="btn-primary px-6 py-3 font-bold text-sm font-mono transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Go to Dashboard"
                  data-gate="pro"
                >
                  {COPY.nav_dashboard.toUpperCase()}
                </Button>
              ) : (
                <>
                  <Button
                    className="btn-secondary px-6 py-3 font-bold text-sm font-mono transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
                    aria-label="Sign in to Prompt-Forge"
                  >
                    {COPY.nav_signin.toUpperCase()}
                  </Button>
                  <Button
                    className="btn-primary px-6 py-3 font-bold text-sm font-mono transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                    aria-label="Start using Prompt-Forge"
                    data-gate="pro"
                  >
                    {COPY.cta_start.toUpperCase()}
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white hover:text-[#d1a954] transition-colors duration-150"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              aria-expanded={isMobileNavOpen}
              aria-controls="mobile-nav"
              aria-label={COPY.menu_toggle}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileNavOpen && (
        <div 
          id="mobile-nav"
          className="md:hidden bg-black border-t border-gray-800"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="px-6 py-4">
            <ul className="space-y-4">
              <li>
                <button 
                  className="block text-white hover:text-[#d1a954] transition-colors duration-150 py-2 w-full text-left"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  {COPY.nav_generator}
                </button>
              </li>
              <li>
                <button 
                  className="block text-white hover:text-[#d1a954] transition-colors duration-150 py-2 w-full text-left"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  {COPY.nav_modules}
                </button>
              </li>
              <li>
                <button 
                  className="block text-white hover:text-[#d1a954] transition-colors duration-150 py-2 w-full text-left"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  {COPY.nav_pricing}
                </button>
              </li>
              <li>
                <button 
                  className="block text-white hover:text-[#d1a954] transition-colors duration-150 py-2 w-full text-left"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  {COPY.nav_docs}
                </button>
              </li>
            </ul>
            
            <div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
              {isAuthenticated ? (
                <Button
                  className="block w-full text-center px-4 py-3 bg-[#d1a954] text-black font-medium rounded hover:bg-[#b8954a] transition-colors duration-150"
                  data-gate="pro"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  {COPY.nav_dashboard}
                </Button>
              ) : (
                <>
                  <Button
                    className="block w-full text-center px-4 py-3 bg-transparent border border-white/20 text-white font-medium rounded hover:bg-white/10 transition-colors duration-150"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    {COPY.nav_signin}
                  </Button>
                  <Button
                    className="block w-full text-center px-4 py-3 bg-[#d1a954] text-black font-medium rounded hover:bg-[#b8954a] transition-colors duration-150"
                    data-gate="pro"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    {COPY.cta_start}
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

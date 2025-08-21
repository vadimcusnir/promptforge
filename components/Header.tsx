"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavMobile } from "./NavMobile"
import { COPY } from "@/lib/copy"

interface HeaderProps {
  isAuthenticated?: boolean
}

export function Header({ isAuthenticated = false }: HeaderProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/generator", label: COPY.nav_generator },
    { href: "/modules", label: COPY.nav_modules },
    { href: "/pricing", label: COPY.nav_pricing },
    { href: "/docs/api", label: COPY.nav_docs },
  ]

  const handleMobileToggle = () => {
    const newState = !isMobileNavOpen
    setIsMobileNavOpen(newState)
    
    // Emit telemetry event
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('open_nav', { detail: { open: newState } }))
    }
  }

  const handleCTAClick = (event: string) => {
    // Emit telemetry event
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('cta_primary_click', { detail: { event } }))
    }
  }

  return (
    <header 
      role="banner" 
      className="header-container sticky top-0 z-[100] bg-black/95 backdrop-blur-sm border-b border-gray-800/50"
    >
      <div className="container mx-auto px-5" style={{ maxWidth: 'var(--container, 1160px)' }}>
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex-shrink-0 text-[#d1a954] font-bold text-xl tracking-wide hover:opacity-80 transition-opacity duration-150"
            aria-label="PromptForge home"
          >
            {COPY.brand}
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center space-x-8" 
            aria-label="Primary navigation"
          >
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-white hover:text-[#d1a954] transition-colors duration-150 font-medium"
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => handleCTAClick('header_dashboard')}
                className="px-6 py-2 bg-[#d1a954] text-black font-medium rounded hover:bg-[#b8954a] transition-colors duration-150"
                data-gate="pro"
              >
                {COPY.nav_dashboard}
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-white hover:text-[#d1a954] transition-colors duration-150 font-medium"
                >
                  {COPY.nav_signin}
                </Link>
                <Link
                  href="/generator"
                  onClick={() => handleCTAClick('header_start_forge')}
                  className="px-6 py-2 bg-[#d1a954] text-black font-medium rounded hover:bg-[#b8954a] transition-colors duration-150"
                  data-gate="pro"
                >
                  {COPY.cta_start}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white hover:text-[#d1a954] transition-colors duration-150"
            onClick={handleMobileToggle}
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

      {/* Mobile Navigation */}
      <NavMobile
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        isAuthenticated={isAuthenticated}
      />
    </header>
  )
}

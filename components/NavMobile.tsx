"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { COPY } from "@/lib/copy"

interface NavMobileProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated?: boolean
}

export function NavMobile({ isOpen, onClose, isAuthenticated = false }: NavMobileProps) {
  const navRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const nav = navRef.current
    if (!nav) return

    const focusableElements = nav.querySelectorAll(
      'a[href], button:not([disabled])'
    ) as NodeListOf<HTMLElement>
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const navItems = [
    { href: "/generator", label: COPY.nav_generator },
    { href: "/modules", label: COPY.nav_modules },
    { href: "/pricing", label: COPY.nav_pricing },
    { href: "/docs/api", label: COPY.nav_docs },
  ]

  const handleLinkClick = () => {
    onClose()
  }

  const handleCTAClick = (event: string) => {
    // Emit telemetry event
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('cta_primary_click', { detail: { event } }))
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] lg:hidden">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={navRef}
        className="absolute top-14 left-0 right-0 bg-black border-t border-gray-800"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <nav className="px-5 py-4">
          <ul className="space-y-4">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={handleLinkClick}
                  className="block text-white hover:text-[#d1a954] transition-colors duration-150 py-2"
                  aria-current={pathname === href ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => handleCTAClick('mobile_dashboard')}
                className="block w-full text-center px-4 py-3 bg-[#d1a954] text-black font-medium rounded hover:bg-[#b8954a] transition-colors duration-150"
                data-gate="pro"
              >
                {COPY.nav_dashboard}
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={handleLinkClick}
                  className="block text-center text-white hover:text-[#d1a954] transition-colors duration-150 py-2"
                >
                  {COPY.nav_signin}
                </Link>
                <Link
                  href="/generator"
                  onClick={() => handleCTAClick('mobile_start_forge')}
                  className="block w-full text-center px-4 py-3 bg-[#d1a954] text-black font-medium rounded hover:bg-[#b8954a] transition-colors duration-150"
                  data-gate="pro"
                >
                  {COPY.cta_start}
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}

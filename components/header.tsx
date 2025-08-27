"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true"

  type NavigationItem = {
    name: string
    href: string
    disabled?: boolean
  }

  const baseNavigation: NavigationItem[] = [
    { name: "Generator", href: "/generator" },
    { name: "Modules", href: "/modules" },
    { name: "Pricing", href: "/pricing" },
    { name: "Docs", href: "/docs" },
    { name: "Guides", href: "/guides" },
    { name: "Dashboard", href: "/dashboard" },
  ]

  const navigation: NavigationItem[] = isComingSoon
    ? baseNavigation.map((item) =>
        item.name === "Generator" ? { name: "Launching Soon", href: "#", disabled: true } : item,
      )
    : baseNavigation

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 group" aria-label="PromptForge - Go to homepage">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-black font-bold" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </div>
          <span className="font-montserrat font-bold text-xl text-white">Forge</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
          {navigation.map((item) =>
            item.disabled ? (
              <span key={item.name} className="font-montserrat text-sm font-medium text-gray-500 cursor-not-allowed" aria-disabled="true">
                {item.name}
              </span>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`font-montserrat text-sm font-medium transition-colors duration-200 relative ${
                  isActive(item.href) ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-sm shadow-yellow-400/50" />
                )}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10" ariaLabel="Log in to your account">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 font-medium shadow-lg shadow-yellow-400/25" ariaLabel="Create a new account">
              Sign up
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-gray-300 hover:text-yellow-400 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur border-b border-gray-800"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navigation.map((item) =>
              item.disabled ? (
                <span
                  key={item.name}
                  className="block font-montserrat text-sm font-medium text-gray-500 cursor-not-allowed"
                  aria-disabled="true"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block font-montserrat text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href) ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ),
            )}
            <div className="pt-4 border-t border-gray-800 space-y-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10" ariaLabel="Log in to your account">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 font-medium" ariaLabel="Create a new account">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

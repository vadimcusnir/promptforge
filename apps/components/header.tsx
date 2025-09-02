"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true"

  const baseNavigation = [
    { name: "Generator", href: "/generator" },
    { name: "Modules", href: "/modules" },
    { name: "Pricing", href: "/pricing" },
    { name: "Docs", href: "/docs" },
    { name: "Blog", href: "/blog" },
    { name: "Dashboard", href: "/dashboard" },
  ]

  const navigation = isComingSoon
    ? baseNavigation.map((item) =>
        item.name === "Generator" ? { name: "Launching Soon", href: "#", disabled: true } : item,
      )
    : baseNavigation

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#CDA434]/20 to-[#CDA434]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-8 h-8 bg-gradient-to-br from-[#CDA434] to-[#CDA434] rounded-lg flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-black font-bold" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </div>
          <span className="font-montserrat font-bold text-xl text-white">Forge</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) =>
            item.disabled ? (
              <span key={item.name} className="font-montserrat text-sm font-medium text-gray-500 cursor-not-allowed">
                {item.name}
              </span>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`font-montserrat text-sm font-medium transition-colors duration-200 relative focus:outline-none focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-black rounded ${
                  isActive(item.href) ? "text-[#CDA434]" : "text-gray-300 hover:text-[#CDA434]"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#CDA434] to-[#CDA434] rounded-full shadow-sm shadow-[#CDA434]/50" />
                )}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-[#CDA434] hover:bg-[#CDA434]/10 focus:ring-[#00FF7F]"
            >
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-[#CDA434] to-[#CDA434] text-black hover:from-[#CDA434]/90 hover:to-[#CDA434]/90 font-medium shadow-lg shadow-[#CDA434]/25 focus:ring-[#00FF7F]">
              Sign up
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-gray-300 hover:text-[#CDA434] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-black rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur border-b border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navigation.map((item) =>
              item.disabled ? (
                <span
                  key={item.name}
                  className="block font-montserrat text-sm font-medium text-gray-500 cursor-not-allowed"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block font-montserrat text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-black rounded ${
                    isActive(item.href) ? "text-[#CDA434]" : "text-gray-300 hover:text-[#CDA434]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ),
            )}
            <div className="pt-4 border-t border-gray-800 space-y-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-[#CDA434] hover:bg-[#CDA434]/10 focus:ring-[#00FF7F]"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-[#CDA434] to-[#CDA434] text-black hover:from-[#CDA434]/90 hover:to-[#CDA434]/90 font-medium focus:ring-[#00FF7F]">
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

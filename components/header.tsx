"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy";
import { Home, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';

interface HeaderProps {
  isAuthenticated?: boolean;
  showBreadcrumbs?: boolean;
}

export function Header({
  isAuthenticated = false,
  showBreadcrumbs = true,
}: HeaderProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const getBreadcrumbPage = () => {
    if (pathname === "/") return "Homepage";
    if (pathname === "/generator") return "Generator";
    if (pathname === "/modules") return "Modules";
    if (pathname === "/pricing") return "Pricing";
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/contact") return "Contact";
    return "Page";
  };

  return (
    <header role="banner" className="site-header">
      <div className="container mx-auto max-w-[1240px] px-6">
        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="flex items-center py-2 text-xs text-foreground/60 border-b border-border/10">
            <Home className="w-3 h-3 mr-1" />
            <span>{COPY.brand}</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="text-foreground">Cognitive OS</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span>{getBreadcrumbPage()}</span>
          </div>
        )}

        <div className="flex items-center justify-between h-16">
          {/* Logo (Rună Digitală) */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-150">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image
                  src="/forge_v3_logo/nav_static_03_loading.webp"
                  alt="PromptForge™ Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                  priority
                />
              </div>
              <div 
                className="text-xl font-black font-mono"
                style={{color: "var(--pf-gold-600)"}}
              >
                {COPY.brand}
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-6 text-sm font-mono"
              role="navigation"
              aria-label="Primary navigation"
            >
              <Link
                href="/modules"
                className="text-white transition-colors duration-150 hover:text-accent focus-ring"
                
                
                aria-current={pathname === "/modules" ? "page" : undefined}
              >
                Modules
              </Link>
              <Link
                href="/generator"
                className="text-white transition-colors duration-150"
                
                
                aria-current={pathname === "/generator" ? "page" : undefined}
              >
                Generator
              </Link>
              <Link
                href="/pricing"
                className="text-white transition-colors duration-150"
                
                
                aria-current={pathname === "/pricing" ? "page" : undefined}
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="text-white transition-colors duration-150"
                
                
                aria-current={pathname === "/docs" ? "page" : undefined}
              >
                Docs
              </Link>
              <Link
                href="/contact"
                className="text-white transition-colors duration-150"
                
                
                aria-current={pathname === "/contact" ? "page" : undefined}
              >
                Contact
              </Link>
              <Link
                href="/login"
                className="text-white transition-colors duration-150"
                
                
                aria-current={pathname === "/login" ? "page" : undefined}
              >
                Login
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-3 text-white hover:text-accent focus-ring transition-colors duration-150 min-w-[44px] min-h-[44px] focus-ring flex items-center justify-center"
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

            {/* CTA Button */}
            <Button
              className="hidden md:block px-6 py-3 bg-accent text-accent-foreground font-medium rounded hover:bg-accent/90 transition-colors duration-150 min-w-[44px] min-h-[44px] focus-ring"
              data-gate="pro"
            >
              {COPY.cta_start}
            </Button>
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
          <nav className="px-6 py-4" role="navigation" aria-label="Mobile navigation">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/generator"
                  className="block text-white hover:text-accent focus-ring transition-colors duration-150 py-2 w-full text-left"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/modules"
                  className="block text-white hover:text-accent focus-ring transition-colors duration-150 py-2 w-full text-left"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Modules
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="block text-white hover:text-accent focus-ring transition-colors duration-150 py-2 w-full text-left"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="block text-white hover:text-accent focus-ring transition-colors duration-150 py-2 w-full text-left"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block text-white hover:text-accent focus-ring transition-colors duration-150 py-2 w-full text-left"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="block text-white hover:text-accent focus-ring transition-colors duration-150 py-2 w-full text-left"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

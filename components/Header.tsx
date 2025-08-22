"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy";
import { Home, ChevronRight } from "lucide-react";
import Image from "next/image";

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
    return "Page";
  };

  return (
    <header role="banner" className="site-header">
      <div className="container mx-auto max-w-[1240px] px-6">
        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="flex items-center py-2 text-xs text-[#ECFEFF]/60 border-b border-[#ECFEFF]/10">
            <Home className="w-3 h-3 mr-1" />
            <span>{COPY.brand}</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="text-[#0891B2]">Cognitive OS</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span>{getBreadcrumbPage()}</span>
          </div>
        )}

        <div className="flex items-center justify-between h-16">
          {/* Logo (Rună Digitală) */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-150">
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
            </a>
          </div>

          <div className="flex items-center space-x-8">
            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-6 text-sm font-mono"
              aria-label="Primary navigation"
            >
              <a
                href="/modules"
                className="text-white transition-colors duration-150 hover:text-[var(--pf-gold-600)]"
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--pf-gold-600)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "white"}
                aria-current={pathname === "/modules" ? "page" : undefined}
              >
                Modules
              </a>
              <a
                href="/pricing"
                className="text-white transition-colors duration-150"
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--pf-gold-600)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "white"}
                aria-current={pathname === "/pricing" ? "page" : undefined}
              >
                Pricing
              </a>
              <a
                href="/docs"
                className="text-white transition-colors duration-150"
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--pf-gold-600)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "white"}
                aria-current={pathname === "/docs" ? "page" : undefined}
              >
                Docs
              </a>
              <a
                href="/login"
                className="text-white transition-colors duration-150"
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--pf-gold-600)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "white"}
                aria-current={pathname === "/login" ? "page" : undefined}
              >
                Login
              </a>
            </nav>

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
  );
}

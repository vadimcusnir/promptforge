"use client"

import Link from "next/link"
import { COPY } from "@/lib/copy"

export function Footer() {
  const productLinks = [
    { href: "/generator", label: COPY.nav_generator },
    { href: "/modules", label: COPY.nav_modules },
    { href: "/dashboard", label: COPY.nav_dashboard },
    { href: "/pricing", label: COPY.nav_pricing },
  ]

  const companyLinks = [
    { href: "/about", label: COPY.f_about },
    { href: "/blog", label: COPY.f_blog },
    { href: "/careers", label: COPY.f_careers },
    { href: "/contact", label: COPY.f_contact },
  ]

  const legalLinks = [
    { href: "/privacy", label: COPY.f_privacy },
    { href: "/terms", label: COPY.f_terms },
    { href: "/gdpr", label: COPY.f_gdpr },
    { href: "/security", label: COPY.f_security },
  ]

  return (
    <footer 
      role="contentinfo" 
      className="bg-gray-900 border-t border-gray-800 text-gray-300"
    >
      <div className="container mx-auto px-5 py-12" style={{ maxWidth: 'var(--container, 1160px)' }}>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {COPY.f_product}
            </h3>
            <ul className="space-y-3">
              {productLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-white transition-all duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {COPY.f_company}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-white transition-all duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {COPY.f_legal}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-white transition-all duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Line */}
        <div className="pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                GDPR‑ready
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Stripe verified
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Telemetry only (no raw prompts)
              </span>
            </div>
            <p className="text-sm opacity-70">
              {COPY.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

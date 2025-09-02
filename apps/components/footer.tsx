"use client"

import Link from "next/link"
import { trackEvent } from "@/lib/telemetry"

export function Footer() {
  const legalLinks = [
    { name: "Privacy Policy", href: "/legal/privacy" },
    { name: "Terms of Service", href: "/legal/terms" },
    { name: "Data Processing Agreement", href: "/legal/dpa" },
    { name: "Contact", href: "/contact" },
  ]

  const navigationLinks = [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Documentation", href: "/docs" },
    { name: "Modules", href: "/modules" },
    { name: "Pricing", href: "/pricing" },
    { name: "Generator", href: "/generator" },
  ]

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/promptforge", icon: "github" },
    { name: "Twitter", href: "https://twitter.com/promptforge", icon: "twitter" },
    { name: "LinkedIn", href: "https://linkedin.com/company/promptforge", icon: "linkedin" },
  ]

  const handleLinkClick = (linkName: string, href: string) => {
    trackEvent("footer_link_click", {
      link_name: linkName,
      link_url: href,
      section: "footer",
    })
  }

  return (
    <footer className="bg-black border-t border-[#CDA434]/20" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Legal & Utility Links */}
          <div>
            <h3 className="font-montserrat font-semibold text-white mb-4">Legal & Support</h3>
            <ul className="space-y-2" role="list">
              {legalLinks.map((link) => (
                <li key={link.name} role="listitem">
                  <Link
                    href={link.href}
                    onClick={() => handleLinkClick(link.name, link.href)}
                    className="text-gray-400 hover:text-[#CDA434] transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-black rounded-sm"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Secondary Navigation */}
          <div>
            <h3 className="font-montserrat font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2" role="list">
              {navigationLinks.map((link) => (
                <li key={link.name} role="listitem">
                  <Link
                    href={link.href}
                    onClick={() => handleLinkClick(link.name, link.href)}
                    className="text-gray-400 hover:text-[#CDA434] transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-black rounded-sm"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branding & Social */}
          <div>
            <h3 className="font-montserrat font-semibold text-white mb-4">Connect</h3>

            <div className="flex items-center space-x-4 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  onClick={() => handleLinkClick(social.name, social.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#CDA434] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-black rounded-sm"
                  aria-label={`Follow us on ${social.name} (opens in new tab)`}
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon === "github" && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {social.icon === "twitter" && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {social.icon === "linkedin" && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-[#CDA434]/20 to-[#CDA434]/20 rounded border border-[#CDA434]/30 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#CDA434]" fill="currentColor" aria-hidden="true">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                </svg>
              </div>
              <span className="text-gray-400 text-sm">Industrial Prompt Engineering</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Forging precision in the art of prompt engineering. Every output auditable, every process reproducible.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © PromptForge™ 2025. All rights reserved.
              <span className="ml-2 text-gray-600">v4.0.1</span>
            </div>
            <div className="text-gray-500 text-sm italic">
              "Precision forged through discipline, excellence through iteration."
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-900 text-center">
            <p className="text-gray-600 text-xs">
              Enterprise inquiries:{" "}
              <a
                href="mailto:enterprise@promptforge.com"
                className="text-[#CDA434] hover:text-[#CDA434]/80 focus:outline-none focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-black rounded-sm"
              >
                enterprise@promptforge.com
              </a>{" "}
              | Support:{" "}
              <a
                href="mailto:support@promptforge.com"
                className="text-[#CDA434] hover:text-[#CDA434]/80 focus:outline-none focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-black rounded-sm"
              >
                support@promptforge.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

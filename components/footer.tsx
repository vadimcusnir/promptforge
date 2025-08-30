import Link from "next/link"

export function Footer() {
  const legalLinks = [
    { name: "Legal Center", href: "/legal" },
    { name: "Privacy Policy", href: "/legal/privacy" },
    { name: "Terms of Use", href: "/legal/terms" },
    { name: "Security", href: "/legal/security" },
    { name: "GDPR", href: "/legal/gdpr" },
    { name: "Contact", href: "/contact" },
  ]

  const navigationLinks = [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Docs", href: "/docs" },
    { name: "Guides", href: "/guides" },
    { name: "Modules", href: "/modules" },
    { name: "Pricing", href: "/pricing" },
  ]

  return (
    <footer role="contentinfo" className="bg-bg-primary border-t border-accent/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Legal & Utility Links */}
          <div>
            <h3 className="font-montserrat font-semibold text-fg-primary mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-fg-secondary hover:text-accent transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Secondary Navigation */}
          <div>
            <h3 className="font-montserrat font-semibold text-fg-primary mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-fg-secondary hover:text-accent transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branding & Social */}
          <div>
            <h3 className="font-montserrat font-semibold text-fg-primary mb-4">Connect</h3>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-accent/20 to-accent/20 rounded border border-accent/30 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-accent" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                </svg>
              </div>
              <span className="text-fg-secondary text-sm">Industrial Prompt Engineering</span>
            </div>
            <p className="text-fg-secondary text-xs leading-relaxed">
              Forging precision in the art of prompt engineering. Every output auditable, every process reproducible.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-fg-secondary text-sm">© PromptForge™ 2025. All rights reserved.</div>
            <div className="text-fg-secondary text-sm italic">
              "Precision forged through discipline, excellence through iteration."
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

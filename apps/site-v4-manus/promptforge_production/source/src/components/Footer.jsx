import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link to="/legal" className="block text-muted-foreground hover:text-primary transition-colors">
                Legal Center
              </Link>
              <Link to="/legal/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/legal/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Use
              </Link>
              <Link to="/legal/security" className="block text-muted-foreground hover:text-primary transition-colors">
                Security
              </Link>
              <Link to="/legal/gdpr" className="block text-muted-foreground hover:text-primary transition-colors">
                GDPR
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link to="/docs" className="block text-muted-foreground hover:text-primary transition-colors">
                Docs
              </Link>
              <Link to="/guides" className="block text-muted-foreground hover:text-primary transition-colors">
                Guides
              </Link>
              <Link to="/modules" className="block text-muted-foreground hover:text-primary transition-colors">
                Modules
              </Link>
              <Link to="/pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link to="/shop" className="block text-muted-foreground hover:text-primary transition-colors">
                Shop
              </Link>
            </div>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">⚡</span>
              </div>
              <span className="font-semibold">Industrial Prompt Engineering</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Forging precision in the art of prompt engineering. Every output auditable, every process reproducible.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © PromptForge™ 2025. All rights reserved.
          </div>
          <div className="text-sm text-muted-foreground italic">
            "Precision forged through discipline, excellence through iteration."
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


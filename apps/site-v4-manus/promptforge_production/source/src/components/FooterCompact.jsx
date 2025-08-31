import { Link } from 'react-router-dom'
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  ExternalLink,
  Zap
} from 'lucide-react'

const FooterCompact = () => {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { name: 'Generator', href: '/generator' },
    { name: 'Modules', href: '/modules' },
    { name: 'Shop', href: '/shop' },
    { name: 'Pricing', href: '/pricing' }
  ]

  const resourceLinks = [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/docs/api' },
    { name: 'Blog', href: '/blog' },
    { name: 'Support', href: '/contact' }
  ]

  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' }
  ]

  const legalLinks = [
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'DPA', href: '/dpa' },
    { name: 'Security', href: '/security' }
  ]

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/promptforge', icon: Twitter },
    { name: 'GitHub', href: 'https://github.com/promptforge', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/promptforge', icon: Linkedin },
    { name: 'Email', href: 'mailto:hello@chatgpt-prompting.com', icon: Mail }
  ]

  return (
    <footer className="bg-background border-t border-border">
      <div className="container-pro">
        {/* Main Footer Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg text-gradient-primary">PromptForge™</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Industrial prompt engineering platform. 50 modules, 7 vectors, verified exports in under 60 seconds.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={social.name}
                      target={social.href.startsWith('http') ? '_blank' : undefined}
                      rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-sm mb-3 emphasis-primary">Product</h3>
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold text-sm mb-3 emphasis-primary">Resources</h3>
              <ul className="space-y-2">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-sm mb-3 emphasis-primary">Company</h3>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-sm mb-3 emphasis-primary">Legal</h3>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© {currentYear} PromptForge™</span>
              <span>•</span>
              <span>Industrial Prompt Engineering</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <a
                href="https://status.chatgpt-prompting.com"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Status</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterCompact


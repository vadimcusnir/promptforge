import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import '../styles/mobile-fixes-pro.css'
import '../styles/header-compact.css'

const MobileNavigationFixed = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/generator', label: 'Generator' },
    { to: '/modules', label: 'Modules' },
    { to: '/shop', label: 'Shop' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/docs', label: 'Docs' },
    { to: '/blog', label: 'Blog' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/auth', label: 'Login' }
  ]

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">🔥</span>
            </div>
            <span className="font-bold text-base text-gradient-primary">PromptForge</span>
          </Link>

          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className={`mobile-hamburger ${isOpen ? 'active' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-nav-overlay ${isOpen ? 'active' : ''}`}>
        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="mobile-close-btn"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        {/* Navigation Menu */}
        <nav className="mobile-nav-menu">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="mt-8">
          <Link
            to="/generator"
            className="btn-primary-pro"
            onClick={closeMenu}
          >
            Start the Forge
          </Link>
        </div>
      </div>

      {/* Desktop Navigation */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border desktop-nav">
        <div className="container-pro">
          <div className="flex items-center justify-between py-2">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">🔥</span>
              </div>
              <span className="font-bold text-lg text-gradient-primary">PromptForge™</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/generator" className="nav-link text-sm">Generator</Link>
              <Link to="/modules" className="nav-link text-sm">Modules</Link>
              <Link to="/shop" className="nav-link text-sm">Shop</Link>
              <Link to="/pricing" className="nav-link text-sm">Pricing</Link>
              <Link to="/docs" className="nav-link text-sm">Docs</Link>
              <Link to="/blog" className="nav-link text-sm">Blog</Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link to="/auth" className="nav-link text-sm">Login</Link>
              <Link to="/generator" className="btn-primary-pro text-sm px-4 py-2">
                Start the Forge
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-12 lg:h-14"></div>
    </>
  )
}

export default MobileNavigationFixed


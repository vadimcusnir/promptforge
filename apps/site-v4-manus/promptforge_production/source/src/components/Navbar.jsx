import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, Zap, User, LogOut } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()

  const navigation = [
    { name: 'Generator', href: '/generator', badge: '50' },
    { name: 'Modules', href: '/modules', badge: '7D' },
    { name: 'Shop', href: '/shop', badge: 'NEW' },
    { name: 'Pricing', href: '/pricing', badge: '$' },
    { name: 'Docs', href: '/docs', badge: 'API' },
    { name: 'Blog', href: '/blog', badge: 'SEO' }
  ]

  const isActive = (path) => location.pathname === path

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  const handleMenuToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Skip Link for Screen Readers */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <nav 
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border sticky-header"
        role="navigation"
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 container-safe">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              aria-label="PromptForge Home"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient-primary">PromptForge</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1" role="menubar">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                  role="menuitem"
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <span>{item.name}</span>
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                    {item.badge}
                  </span>
                </Link>
              ))}
            </div>

            {/* User Menu / Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors min-h-[44px]"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1"
                      role="menu"
                      aria-label="User menu options"
                    >
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors min-h-[44px] flex items-center"
                        onClick={() => setShowUserMenu(false)}
                        role="menuitem"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors min-h-[44px] flex items-center"
                        onClick={() => setShowUserMenu(false)}
                        role="menuitem"
                      >
                        Profile
                      </Link>
                      <hr className="my-1 border-border" />
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center space-x-2 min-h-[44px]"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="min-h-[44px]">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/auth?mode=signup">
                    <Button size="sm" className="btn-primary min-h-[44px]">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={handleMenuToggle}
                className="hamburger-menu p-2 rounded-lg hover:bg-muted transition-colors"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div 
              id="mobile-menu"
              className="md:hidden py-4 border-t border-border"
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center justify-between ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                  >
                    <span>{item.name}</span>
                    <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                      {item.badge}
                    </span>
                  </Link>
                ))}
                
                <hr className="my-4 border-border" />
                
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors min-h-[44px] flex items-center"
                      onClick={() => setIsOpen(false)}
                      role="menuitem"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors min-h-[44px] flex items-center"
                      role="menuitem"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 px-4">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full min-h-[44px]">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full btn-primary min-h-[44px]">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar


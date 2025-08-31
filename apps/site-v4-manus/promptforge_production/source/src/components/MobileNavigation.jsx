import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '../contexts/AuthContext'
import { 
  Menu, 
  X, 
  Zap, 
  User, 
  LogOut, 
  Home,
  Settings,
  Cpu,
  Package,
  ShoppingCart,
  DollarSign,
  FileText,
  BookOpen,
  BarChart3,
  Shield
} from 'lucide-react'

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const location = useLocation()
  const { user, signOut } = useAuth()

  const navigation = [
    { 
      name: 'Home', 
      href: '/', 
      icon: Home,
      badge: null,
      description: 'Industrial prompt engine'
    },
    { 
      name: 'Generator', 
      href: '/generator', 
      icon: Cpu,
      badge: '50',
      description: '7D framework & modules'
    },
    { 
      name: 'Modules', 
      href: '/modules', 
      icon: Package,
      badge: '7D',
      description: 'Browse 50+ modules'
    },
    { 
      name: 'Shop', 
      href: '/shop', 
      icon: ShoppingCart,
      badge: 'NEW',
      description: 'Module packs & bundles'
    },
    { 
      name: 'Pricing', 
      href: '/pricing', 
      icon: DollarSign,
      badge: '$',
      description: 'Plans & features'
    },
    { 
      name: 'Docs', 
      href: '/docs', 
      icon: FileText,
      badge: 'API',
      description: 'Documentation & guides'
    },
    { 
      name: 'Blog', 
      href: '/blog', 
      icon: BookOpen,
      badge: 'SEO',
      description: 'Latest insights'
    }
  ]

  const userNavigation = user ? [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: BarChart3,
      description: 'Your runs & analytics'
    },
    { 
      name: 'Profile', 
      href: '/profile', 
      icon: User,
      description: 'Account settings'
    },
    { 
      name: 'Admin', 
      href: '/admin', 
      icon: Shield,
      description: 'Admin workspace',
      adminOnly: true
    }
  ] : []

  const isActive = (path) => location.pathname === path

  // Swipe gesture handling
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && isOpen) {
      setIsOpen(false)
    }
    if (isRightSwipe && !isOpen) {
      setIsOpen(true)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
    setIsOpen(false)
  }

  const handleMenuToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false)
    }
  }

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
    setShowUserMenu(false)
  }, [location.pathname])

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
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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
              {navigation.slice(1).map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                    role="menuitem"
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    title={item.description}
                  >
                    <IconComponent className="w-4 h-4 mr-1" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
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
                      {userNavigation.map((item) => {
                        const IconComponent = item.icon
                        if (item.adminOnly && !user.isAdmin) return null
                        
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block px-4 py-2 text-sm hover:bg-muted transition-colors min-h-[44px] flex items-center space-x-2"
                            onClick={() => setShowUserMenu(false)}
                            role="menuitem"
                            title={item.description}
                          >
                            <IconComponent className="w-4 h-4" />
                            <span>{item.name}</span>
                          </Link>
                        )
                      })}
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
                className="hamburger-menu p-2 rounded-lg hover:bg-muted transition-colors relative"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <div className="relative w-6 h-6">
                  <span 
                    className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                      isOpen ? 'rotate-45 top-3' : 'top-1'
                    }`}
                  />
                  <span 
                    className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 top-3 ${
                      isOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span 
                    className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                      isOpen ? '-rotate-45 top-3' : 'top-5'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Overlay */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
              
              {/* Mobile Menu */}
              <div 
                id="mobile-menu"
                className="fixed top-16 left-0 right-0 bottom-0 bg-background z-50 md:hidden overflow-y-auto"
                role="menu"
                aria-label="Mobile navigation menu"
              >
                <div className="p-4 space-y-2">
                  {/* Main Navigation */}
                  <div className="space-y-1">
                    {navigation.map((item) => {
                      const IconComponent = item.icon
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`block p-4 rounded-lg transition-colors min-h-[60px] flex items-center space-x-3 ${
                            isActive(item.href)
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'hover:bg-muted border border-transparent'
                          }`}
                          onClick={() => setIsOpen(false)}
                          role="menuitem"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isActive(item.href) ? 'bg-primary/20' : 'bg-muted/50'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.name}</span>
                              {item.badge && (
                                <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                  
                  <hr className="my-6 border-border" />
                  
                  {/* User Section */}
                  {user ? (
                    <div className="space-y-1">
                      <div className="p-4 bg-muted/30 rounded-lg mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.user_metadata?.full_name || 'User'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {userNavigation.map((item) => {
                        const IconComponent = item.icon
                        if (item.adminOnly && !user.isAdmin) return null
                        
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block p-4 rounded-lg hover:bg-muted transition-colors min-h-[60px] flex items-center space-x-3"
                            onClick={() => setIsOpen(false)}
                            role="menuitem"
                          >
                            <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full p-4 rounded-lg hover:bg-muted transition-colors min-h-[60px] flex items-center space-x-3 text-left"
                        role="menuitem"
                      >
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <LogOut className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <div className="font-medium">Sign Out</div>
                          <p className="text-sm text-muted-foreground">
                            End your session
                          </p>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 p-4">
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full min-h-[50px] justify-start">
                          <User className="w-5 h-5 mr-3" />
                          Log in to your account
                        </Button>
                      </Link>
                      <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full btn-primary min-h-[50px] justify-start">
                          <Zap className="w-5 h-5 mr-3" />
                          Start forging prompts
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default MobileNavigation


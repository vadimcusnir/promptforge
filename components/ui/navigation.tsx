import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Link } from "./link"
import { SkipLink } from "./skip-link"
import { Search, Menu, X, Home, User, Settings, HelpCircle } from "lucide-react"

export interface NavigationProps {
  className?: string
  currentPage?: string
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ className, currentPage, user, onMenuToggle, isMenuOpen, ...props }, ref) => {
    const [isSearchOpen, setIsSearchOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")

    const navigationItems = [
      { href: "/", label: "Home", icon: Home, current: currentPage === "/" },
      { href: "/dashboard", label: "Dashboard", icon: User, current: currentPage === "/dashboard" },
      { href: "/generator", label: "Generator", icon: Settings, current: currentPage === "/generator" },
      { href: "/guides", label: "Guides", icon: HelpCircle, current: currentPage === "/guides" },
    ]

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        // Implement search functionality
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
      }
    }

    return (
      <nav
        ref={ref}
        className={cn(
          "bg-bg-primary border-b border-border-primary",
          className
        )}
        role="navigation"
        aria-label="Main navigation"
        {...props}
      >
        {/* Skip Links */}
        <div className="sr-only">
          <SkipLink href="#main-content">Skip to main content</SkipLink>
          <SkipLink href="#search">Skip to search</SkipLink>
          <SkipLink href="#user-menu">Skip to user menu</SkipLink>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
                  <span className="text-accent-contrast font-bold text-sm">PF</span>
                </div>
                <span className="text-fg-primary font-semibold text-lg">PromptForge</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      variant={item.current ? "default" : "ghost"}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        item.current
                          ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
                          : "text-fg-secondary hover:text-accent-primary hover:bg-bg-glass"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fg-tertiary" />
                  <input
                    id="search"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 bg-bg-glass border border-border-primary rounded-lg text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                    aria-label="Search"
                  />
                </div>
              </form>
            </div>

            {/* User Menu */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {user ? (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2"
                      aria-label="User menu"
                      aria-describedby="user-menu"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.name}'s avatar`}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-accent-primary flex items-center justify-center">
                          <span className="text-accent-contrast text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-fg-primary">{user.name}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login" variant="ghost" size="sm">
                      Sign In
                    </Link>
                    <Link href="/signup" variant="primary" size="sm">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuToggle}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-border-primary bg-bg-secondary"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fg-tertiary" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-bg-glass border border-border-primary rounded-lg text-fg-primary placeholder:text-fg-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                      aria-label="Search"
                    />
                  </div>
                </form>
              </div>

              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    variant="ghost"
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium w-full",
                      item.current
                        ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
                        : "text-fg-secondary hover:text-accent-primary hover:bg-bg-glass"
                    )}
                    aria-current={item.current ? "page" : undefined}
                    role="menuitem"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Mobile User Menu */}
              <div className="pt-4 pb-3 border-t border-border-primary">
                {user ? (
                  <div className="flex items-center px-3">
                    <div className="flex-shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.name}'s avatar`}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-accent-primary flex items-center justify-center">
                          <span className="text-accent-contrast text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-fg-primary">{user.name}</div>
                      <div className="text-sm text-fg-secondary">{user.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 space-y-2">
                    <Link href="/login" variant="ghost" className="w-full justify-start">
                      Sign In
                    </Link>
                    <Link href="/signup" variant="primary" className="w-full justify-start">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    )
  }
)
Navigation.displayName = "Navigation"

export { Navigation }

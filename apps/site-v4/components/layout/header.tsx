"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Menu, X, User, Settings, LogOut, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, hasPermission } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigationItems = [
    { href: "/", label: "Landing", active: pathname === "/" },
    { href: "/generator", label: "Generator", active: pathname === "/generator" },
    { href: "/shop", label: "Shop", active: pathname.startsWith("/shop") },
    { href: "/pricing", label: "Pricing", active: pathname === "/pricing" },
    { href: "/dashboard", label: "Dashboard", active: pathname === "/dashboard" },
    { href: "/docs/api", label: "API Docs", active: pathname === "/docs/api" },
    ...(hasPermission("admin:read") ? [{ href: "/admin", label: "Admin", active: pathname === "/admin" }] : []),
  ]

  const planColors = {
    free: "bg-muted text-muted-foreground",
    creator: "bg-accent/20 text-accent border-accent/30",
    pro: "bg-primary/20 text-primary border-primary/30",
    enterprise: "bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30",
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-3 group">
          {/* Runa Executabilă Logo */}
          <div className="relative w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-yellow-400/25 transition-all duration-300">
            <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
              <div className="text-yellow-400 text-xs font-mono font-bold">⟨⟩</div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg font-mono text-foreground group-hover:text-primary transition-colors">
              PromptForge™
            </span>
            <span className="text-xs text-muted-foreground font-mono -mt-1">v4.0</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} font-mono ${
                      item.active
                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                        : "hover:bg-accent/10 hover:text-accent"
                    }`}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Plan Badge */}
          {user && (
            <Badge variant="outline" className={`font-mono text-xs uppercase tracking-wider ${planColors[user.plan]}`}>
              {user.plan}
            </Badge>
          )}

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 h-8">
                  {user.role === "owner" || user.role === "admin" ? (
                    <Shield className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline font-mono text-sm">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-mono">
                  <div className="font-medium text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {user.role}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {hasPermission("admin:read") && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="font-mono bg-transparent">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/50">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md font-mono text-sm transition-colors ${
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

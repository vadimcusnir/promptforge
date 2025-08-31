"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "owner" | "admin" | "member"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  plan: "free" | "creator" | "pro" | "enterprise"
  avatar?: string
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration
const mockUsers: Record<string, User & { password: string }> = {
  "admin@chatgpt-prompting.com": {
    id: "1",
    email: "admin@chatgpt-prompting.com",
    name: "Alex Chen",
    role: "owner",
    plan: "enterprise",
    password: "admin123",
    avatar: "/admin-avatar.png",
    lastLogin: "2 min ago",
  },
  "user@chatgpt-prompting.com": {
    id: "2",
    email: "user@chatgpt-prompting.com",
    name: "Sarah Johnson",
    role: "member",
    plan: "pro",
    password: "user123",
    avatar: "/diverse-user-avatars.png",
    lastLogin: "1 hour ago",
  },
}

// Role-based permissions
const permissions: Record<UserRole, string[]> = {
  owner: ["admin:*", "dashboard:*", "generator:*", "modules:*", "billing:*", "members:*", "api:*", "system:*"],
  admin: ["dashboard:*", "generator:*", "modules:*", "members:read", "members:invite", "api:read", "system:read"],
  member: ["dashboard:read", "generator:*", "modules:read"],
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem("promptforge_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error("Failed to parse stored user data:", error)
        localStorage.removeItem("promptforge_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser = mockUsers[email]
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser
      setUser(userWithoutPassword)
      localStorage.setItem("promptforge_user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("promptforge_user")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    const userPermissions = permissions[user.role] || []

    // Check for wildcard permissions
    const hasWildcard = userPermissions.some((p) => {
      if (p.endsWith(":*")) {
        const prefix = p.slice(0, -2)
        return permission.startsWith(prefix)
      }
      return p === permission
    })

    return hasWildcard || userPermissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Higher-order component for route protection
export function withAuth<P extends object>(Component: React.ComponentType<P>, requiredPermission?: string) {
  return function AuthenticatedComponent(props: P) {
    const { user, hasPermission, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-slate-400 font-mono">Loading...</p>
          </div>
        </div>
      )
    }

    if (!user) {
      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      return null
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white font-mono mb-4">Access Denied</h1>
            <p className="text-slate-400 font-mono">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

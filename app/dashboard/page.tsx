"use client";

import { useAuth } from '@/lib/auth'
import { ModuleBrowser } from '@/components/modules/module-browser'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-pf-black flex items-center justify-center">
        <div className="text-pf-text">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-pf-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showLogin ? (
            <div>
              <LoginForm />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-pf-text-muted hover:text-pf-text"
                >
                  Don't have an account? Register
                </button>
              </div>
            </div>
          ) : showRegister ? (
            <div>
              <RegisterForm />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-pf-text-muted hover:text-pf-text"
                >
                  Already have an account? Login
                </button>
              </div>
            </div>
          ) : (
            <Card className="bg-pf-surface border-pf-text-muted/30">
              <CardHeader>
                <CardTitle className="text-2xl text-pf-text text-center">
                  Welcome to PromptForge
                </CardTitle>
                <CardDescription className="text-pf-text-muted text-center">
                  Access our full suite of prompt modules and export tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-gold-industrial text-pf-black font-bold py-3 text-lg hover:bg-gold-industrial-dark transition-all"
                >
                  Login
                </Button>
                <Button
                  onClick={() => setShowRegister(true)}
                  variant="outline"
                  className="w-full border-pf-text-muted/30 text-pf-text hover:bg-pf-surface"
                >
                  Register
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pf-black">
      {/* Header */}
      <header className="border-b border-pf-text-muted/30 bg-pf-surface/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-pf-text">PromptForge Dashboard</h1>
              <p className="text-pf-text-muted">Welcome back, {user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-pf-text-muted">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <Button
                onClick={signOut}
                variant="outline"
                className="border-pf-text-muted/30 text-pf-text hover:bg-pf-surface flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <ModuleBrowser />
      </main>
    </div>
  )
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import './styles/global-fixes.css'
import './mobile-fixes.css'
import './performance-optimizations.css'
import './accessibility.css'
// Components
import MobileNavigationFixed from './components/MobileNavigationFixed'
import FooterCompact from './components/FooterCompact'
import HomePageFixed from './pages/HomePageFixed'
import GeneratorPage from './pages/GeneratorPage'
import ModulesPage from './pages/ModulesPage'
import ShopPage from './pages/ShopPage'
import ShopItemPage from './pages/ShopItemPage'
import PricingPage from './pages/PricingPage'
import DocsPage from './pages/DocsPage'
import BlogPage from './pages/BlogPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import DPAPage from './pages/DPAPage'

// Context
import { AuthProvider } from './contexts/AuthContext'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-lg flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-primary-foreground">🔥</span>
          </div>
          <div className="text-xl font-semibold text-gradient-primary">PromptForge</div>
          <div className="text-sm text-muted-foreground mt-2">Loading Industrial Platform...</div>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <MobileNavigationFixed />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePageFixed />} />
              <Route path="/generator" element={<GeneratorPage />} />
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:id" element={<ShopItemPage />} />
              <Route path="/shop/module/:id" element={<ShopItemPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/docs/api" element={<DocsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/dpa" element={<DPAPage />} />
            </Routes>
          </main>
          <FooterCompact />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App


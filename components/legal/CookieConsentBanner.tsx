'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Cookie, Settings, Check } from 'lucide-react'

interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

interface CookieConsentBannerProps {
  onConsentChange?: (preferences: ConsentPreferences) => void
}

export function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    } else {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
      applyConsent(savedPreferences)
    }
  }, [])

  const applyConsent = (consentPreferences: ConsentPreferences) => {
    // Apply consent to third-party services
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (consentPreferences.analytics) {
        window.gtag?.('consent', 'update', {
          analytics_storage: 'granted'
        })
      } else {
        window.gtag?.('consent', 'update', {
          analytics_storage: 'denied'
        })
      }

      // Marketing/Advertising
      if (consentPreferences.marketing) {
        window.gtag?.('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted'
        })
      } else {
        window.gtag?.('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        })
      }
    }

    // Log consent event for audit trail
    logConsentEvent(consentPreferences)
  }

  const logConsentEvent = (consentPreferences: ConsentPreferences) => {
    // This would integrate with your audit trail system
    console.log('Cookie consent updated:', {
      timestamp: new Date().toISOString(),
      preferences: consentPreferences,
      userAgent: navigator.userAgent
    })
  }

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true
    }
    
    setPreferences(allAccepted)
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    setIsVisible(false)
    applyConsent(allAccepted)
    onConsentChange?.(allAccepted)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false
    }
    
    setPreferences(onlyNecessary)
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary))
    setIsVisible(false)
    applyConsent(onlyNecessary)
    onConsentChange?.(onlyNecessary)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    setIsVisible(false)
    setShowSettings(false)
    applyConsent(preferences)
    onConsentChange?.(preferences)
  }

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === 'necessary') return // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-2xl p-6 shadow-2xl">
          {!showSettings ? (
            // Main consent banner
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Cookie className="w-6 h-6 text-gold-400" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  We use cookies to enhance your experience
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  We use cookies to provide essential functionality, analyze site usage, and personalize content. 
                  You can choose which types of cookies to allow.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-gold-500 hover:bg-gold-600 text-slate-900 font-medium"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept All
                  </Button>
                  
                  <Button
                    onClick={handleRejectAll}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Reject All
                  </Button>
                  
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="ghost"
                    className="text-slate-400 hover:text-slate-300"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={handleRejectAll}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            // Settings panel
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Cookie Preferences
                </h3>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Necessary Cookies</h4>
                    <p className="text-sm text-slate-400">
                      Essential for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-6 bg-gold-500 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Analytics Cookies</h4>
                    <p className="text-sm text-slate-400">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                      preferences.analytics 
                        ? 'bg-gold-500 justify-end' 
                        : 'bg-slate-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                  </button>
                </div>
                
                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Marketing Cookies</h4>
                    <p className="text-sm text-slate-400">
                      Used to deliver personalized advertisements and measure their effectiveness.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                      preferences.marketing 
                        ? 'bg-gold-500 justify-end' 
                        : 'bg-slate-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleSavePreferences}
                  className="bg-gold-500 hover:bg-gold-600 text-slate-900 font-medium"
                >
                  Save Preferences
                </Button>
                
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Accept All
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

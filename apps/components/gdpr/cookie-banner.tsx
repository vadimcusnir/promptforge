"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Settings, Shield } from "lucide-react"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allPreferences = { necessary: true, analytics: true, marketing: true }
    setPreferences(allPreferences)
    saveConsent(allPreferences)
    setIsVisible(false)

    // Initialize Google Consent Mode V2
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      })
    }
  }

  const handleRejectAll = () => {
    const minimalPreferences = { necessary: true, analytics: false, marketing: false }
    setPreferences(minimalPreferences)
    saveConsent(minimalPreferences)
    setIsVisible(false)

    // Update Google Consent Mode V2
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      })
    }
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
    setIsVisible(false)
    setShowSettings(false)

    // Update Google Consent Mode V2 based on preferences
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("consent", "update", {
        analytics_storage: preferences.analytics ? "granted" : "denied",
        ad_storage: preferences.marketing ? "granted" : "denied",
        ad_user_data: preferences.marketing ? "granted" : "denied",
        ad_personalization: preferences.marketing ? "granted" : "denied",
      })
    }
  }

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        preferences: prefs,
        timestamp: Date.now(),
        version: "1.0",
      }),
    )
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-2xl bg-[#0e0e0e] border-gray-800 text-white">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#d1a954]" />
              <h3 className="text-lg font-semibold text-[#d1a954]">Privacy & Cookies</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {!showSettings ? (
            <>
              <p className="text-gray-300 mb-6">
                We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. Your
                data is processed in accordance with GDPR and our Privacy Policy.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAcceptAll} className="bg-[#d1a954] hover:bg-[#b8943d] text-black font-medium">
                  Accept All Cookies
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  Reject All
                </Button>
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <div>
                    <h4 className="font-medium text-white">Necessary Cookies</h4>
                    <p className="text-sm text-gray-400">Required for basic site functionality</p>
                  </div>
                  <div className="text-sm text-gray-500">Always Active</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <div>
                    <h4 className="font-medium text-white">Analytics Cookies</h4>
                    <p className="text-sm text-gray-400">Help us understand site usage and performance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d1a954]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <div>
                    <h4 className="font-medium text-white">Marketing Cookies</h4>
                    <p className="text-sm text-gray-400">Used for targeted advertising and personalization</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, marketing: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d1a954]"></div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSavePreferences}
                  className="bg-[#d1a954] hover:bg-[#b8943d] text-black font-medium"
                >
                  Save Preferences
                </Button>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Back
                </Button>
              </div>
            </>
          )}

          <p className="text-xs text-gray-500 mt-4">
            By continuing to use our site, you consent to our use of cookies. Read our{" "}
            <a href="/legal/privacy" className="text-[#d1a954] hover:underline">
              Privacy Policy
            </a>{" "}
            and
            <a href="/legal/terms" className="text-[#d1a954] hover:underline ml-1">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </Card>
    </div>
  )
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cookie, Settings, X } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setShowBanner(false);
    
    // Enable all tracking
    enableTracking(allAccepted);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setPreferences(necessaryOnly);
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    setShowBanner(false);
    
    // Disable non-necessary tracking
    enableTracking(necessaryOnly);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShowPreferences(false);
    setShowBanner(false);
    
    // Apply preferences
    enableTracking(preferences);
  };

  const enableTracking = (prefs: CookiePreferences) => {
    // Enable/disable analytics based on preferences
    if (prefs.analytics) {
      // Enable analytics tracking
      window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    } else {
      // Disable analytics tracking
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    }

    // Enable/disable marketing cookies
    if (prefs.marketing) {
      window.gtag?.('consent', 'update', { ad_storage: 'granted' });
    } else {
      window.gtag?.('consent', 'update', { ad_storage: 'denied' });
    }
  };

  if (!showBanner) {
    return null;
  }

  if (showPreferences) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-gold-400" />
                <CardTitle>Cookie Preferences</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreferences(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Manage your cookie preferences for this website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Necessary Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Necessary Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Required for the website to function properly
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Always Active
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                These cookies are essential for basic site functionality, security, and user authentication.
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Help us understand how visitors interact with our website
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="h-4 w-4 text-gold-400 focus:ring-gold-400 border-gray-300 rounded"
                />
              </div>
              <p className="text-sm text-gray-500">
                We use analytics to improve our services and understand user behavior patterns.
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Used to deliver personalized advertisements
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                  className="h-4 w-4 text-gold-400 focus:ring-gold-400 border-gray-300 rounded"
                />
              </div>
              <p className="text-sm text-gray-500">
                These cookies help us show you relevant content and measure campaign effectiveness.
              </p>
            </div>

            {/* Preferences Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Preference Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Remember your settings and preferences
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) => setPreferences(prev => ({ ...prev, preferences: e.target.checked }))}
                  className="h-4 w-4 text-gold-400 focus:ring-gold-400 border-gray-300 rounded"
                />
              </div>
              <p className="text-sm text-gray-500">
                Store your language, theme, and other personalization choices.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSavePreferences}
                className="bg-gold-400 hover:bg-gold-500 text-black"
              >
                Save Preferences
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreferences(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="h-6 w-6 text-gold-400 mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">
                We use cookies to enhance your experience
              </h3>
              <p className="text-sm text-gray-600">
                We use cookies and similar technologies to help personalize content, provide social media features, 
                and analyze our traffic. We also share information about your use of our site with our social media, 
                advertising, and analytics partners who may combine it with other information you've provided to them.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <a 
                  href="/legal/privacy" 
                  className="text-gold-400 hover:text-gold-500 underline"
                >
                  Privacy Policy
                </a>
                <a 
                  href="/legal/terms" 
                  className="text-gold-400 hover:text-gold-500 underline"
                >
                  Terms of Use
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <Button
              onClick={handleAcceptAll}
              className="bg-gold-400 hover:bg-gold-500 text-black"
            >
              Accept All
            </Button>
            <Button
              onClick={handleAcceptNecessary}
              variant="outline"
            >
              Necessary Only
            </Button>
            <Button
              onClick={() => setShowPreferences(true)}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
            >
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

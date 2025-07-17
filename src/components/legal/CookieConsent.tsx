import React, { useState, useEffect } from 'react';
import { Shield, Cookie, Settings, X, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
      // Apply cookie preferences
      applyCookiePreferences(savedPreferences);
    }
  }, []);

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Analytics cookies (Google Analytics, etc.)
    if (prefs.analytics) {
      // Enable analytics tracking
      (window as any).gtag = (window as any).gtag || function() {
        ((window as any).dataLayer = (window as any).dataLayer || []).push(arguments);
      };
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: prefs.marketing ? 'granted' : 'denied'
      });
    } else {
      // Disable analytics
      (window as any).gtag && (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }

    // Marketing cookies
    if (prefs.marketing) {
      // Enable marketing pixels, retargeting, etc.
      (window as any).gtag && (window as any).gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
    } else {
      // Disable marketing
      (window as any).gtag && (window as any).gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }

    // Functional cookies (chat widgets, preferences, etc.)
    if (prefs.functional) {
      // Enable functional features
      localStorage.setItem('functional-cookies-enabled', 'true');
    } else {
      localStorage.removeItem('functional-cookies-enabled');
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    applyCookiePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    
    setPreferences(necessaryOnly);
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    applyCookiePreferences(necessaryOnly);
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    applyCookiePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookiePreferences,
      name: 'Necessary Cookies',
      description: 'Essential for website functionality, security, and user authentication. These cannot be disabled.',
      icon: Shield,
      color: 'text-red-400',
      required: true,
      examples: 'Authentication tokens, security settings, basic functionality'
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website to improve performance and user experience.',
      icon: AlertCircle,
      color: 'text-blue-400',
      required: false,
      examples: 'Google Analytics, page views, user behavior tracking'
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      name: 'Marketing Cookies',
      description: 'Used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.',
      icon: ExternalLink,
      color: 'text-purple-400',
      required: false,
      examples: 'Advertising pixels, retargeting, social media tracking'
    },
    {
      key: 'functional' as keyof CookiePreferences,
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization, such as live chat, video content, and social media features.',
      icon: Settings,
      color: 'text-green-400',
      required: false,
      examples: 'Chat widgets, video players, social media embeds'
    }
  ];

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-4 shadow-2xl z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-teal-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">Cookie Consent</h3>
                <p className="text-slate-300 text-sm">
                  We use cookies to enhance your experience, analyze site usage, and provide personalized content. 
                  You can manage your preferences or learn more in our{' '}
                  <a href="/privacy-policy" className="text-teal-400 hover:text-teal-300 underline">
                    Privacy Policy
                  </a>
                  {' '}and{' '}
                  <a href="/cookie-policy" className="text-teal-400 hover:text-teal-300 underline">
                    Cookie Policy
                  </a>
                  .
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                onClick={handleCustomize}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Customize
              </button>
              <button
                onClick={handleAcceptNecessary}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
              >
                Necessary Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-teal-400" />
                  <h2 className="text-2xl font-bold text-white">Cookie Preferences</h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-slate-300 mt-2">
                Manage your cookie preferences. You can enable or disable different types of cookies below.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {cookieTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.key} className="border border-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Icon className={`h-5 w-5 ${type.color} mt-1`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-white font-semibold">{type.name}</h3>
                            {type.required && (
                              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm mb-2">
                            {type.description}
                          </p>
                          <p className="text-slate-400 text-xs">
                            <strong>Examples:</strong> {type.examples}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        <button
                          onClick={() => handleTogglePreference(type.key)}
                          disabled={type.required}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences[type.key] 
                              ? 'bg-teal-500' 
                              : 'bg-slate-600'
                          } ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              preferences[type.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-slate-700">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
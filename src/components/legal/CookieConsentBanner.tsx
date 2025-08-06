import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Settings, X, Check, Eye } from 'lucide-react';

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieConsentBannerProps {
  onConsentChange?: (preferences: ConsentPreferences) => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [userLocation, setUserLocation] = useState<'EU' | 'US' | 'OTHER'>('OTHER');
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  // Detect user location for compliance requirements
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Simple IP geolocation (in production, use more robust solution)
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // EU countries requiring GDPR compliance
        const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB'];
        const usStates = ['US'];
        
        if (euCountries.includes(data.country_code)) {
          setUserLocation('EU');
        } else if (usStates.includes(data.country_code)) {
          setUserLocation('US');
        } else {
          setUserLocation('OTHER');
        }
      } catch (error) {
        console.warn('Failed to detect location for cookie compliance:', error);
        // Default to EU compliance (strictest)
        setUserLocation('EU');
      }
    };

    detectLocation();
  }, []);

  // Check if consent has been given
  useEffect(() => {
    const consentData = localStorage.getItem('cookie_consent');
    const consentTimestamp = localStorage.getItem('consent_timestamp');
    
    if (!consentData || !consentTimestamp) {
      setShowBanner(true);
      return;
    }

    // Check if consent is still valid (1 year for GDPR, 13 months for CCPA)
    const consentAge = Date.now() - parseInt(consentTimestamp);
    const maxAge = userLocation === 'EU' ? 365 * 24 * 60 * 60 * 1000 : 390 * 24 * 60 * 60 * 1000; // 1 year vs 13 months
    
    if (consentAge > maxAge) {
      setShowBanner(true);
      return;
    }

    try {
      const savedPreferences = JSON.parse(consentData);
      setPreferences(savedPreferences);
      onConsentChange?.(savedPreferences);
    } catch (error) {
      console.warn('Failed to parse saved consent preferences:', error);
      setShowBanner(true);
    }
  }, [userLocation, onConsentChange]);

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    
    saveConsent(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    
    saveConsent(onlyNecessary);
    setShowBanner(false);
  };

  const handleCustomPreferences = () => {
    saveConsent(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const saveConsent = (prefs: ConsentPreferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify(prefs));
    localStorage.setItem('consent_timestamp', Date.now().toString());
    localStorage.setItem('consent_version', '2025.1');
    onConsentChange?.(prefs);

    // Set consent cookies for server-side detection
    document.cookie = `consent_analytics=${prefs.analytics}; path=/; max-age=${365*24*60*60}; SameSite=Strict`;
    document.cookie = `consent_marketing=${prefs.marketing}; path=/; max-age=${365*24*60*60}; SameSite=Strict`;
    document.cookie = `consent_functional=${prefs.functional}; path=/; max-age=${365*24*60*60}; SameSite=Strict`;
  };

  const handlePreferenceChange = (category: keyof ConsentPreferences, value: boolean) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
      
      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-teal-500 shadow-2xl animate-slide-up">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            {/* Icon and Title */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  Cookie & Privacy Notice
                  {userLocation === 'EU' && <Shield className="w-4 h-4 text-blue-500" title="GDPR Compliant" />}
                  {userLocation === 'US' && <Shield className="w-4 h-4 text-red-500" title="CCPA Compliant" />}
                </h3>
                <p className="text-sm text-gray-600">
                  {userLocation === 'EU' && 'GDPR & EU AI Act Compliant'}
                  {userLocation === 'US' && 'CCPA Compliant'}
                  {userLocation === 'OTHER' && 'Privacy Compliant'}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 text-sm leading-relaxed">
                {userLocation === 'EU' ? (
                  <>
                    We use cookies and similar technologies to provide our services, including our AI chatbot. 
                    <strong className="text-gray-900"> You are interacting with AI-powered features on this site.</strong>
                    <br />Your explicit consent is required to process personal data for analytics, marketing, and enhanced functionality.
                  </>
                ) : userLocation === 'US' ? (
                  <>
                    We use cookies to enhance your experience and analyze site usage. Our AI chatbot collects conversation data to improve service.
                    <br />California residents: You have the right to opt out of data selling/sharing.
                  </>
                ) : (
                  <>
                    We use cookies and AI technology to enhance your experience. Our chatbot is AI-powered and processes conversation data.
                    <br />You can control your privacy preferences and data usage.
                  </>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              {userLocation === 'EU' ? (
                // GDPR requires equal prominence for Accept/Reject
                <>
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Preferences
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Accept All
                  </button>
                </>
              ) : (
                // US/Other - Opt-out model
                <>
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Privacy Settings
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Accept & Continue
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-xs text-gray-500">
            <a href="/privacy-policy" target="_blank" className="hover:text-teal-600 underline">
              Privacy Policy
            </a>
            <a href="/cookie-policy" target="_blank" className="hover:text-teal-600 underline">
              Cookie Policy
            </a>
            {userLocation === 'US' && (
              <a href="/ccpa-rights" target="_blank" className="hover:text-teal-600 underline">
                Your California Privacy Rights
              </a>
            )}
            {userLocation === 'EU' && (
              <a href="/gdpr-rights" target="_blank" className="hover:text-teal-600 underline">
                Your GDPR Rights
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Cookie Preferences</h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Customize your privacy settings. Changes take effect immediately.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    Strictly Necessary Cookies
                    <Shield className="w-4 h-4 text-green-500" />
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Essential for website functionality, security, and basic AI chatbot operation. Cannot be disabled.
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    <strong>Examples:</strong> Session management, security tokens, basic functionality
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-start p-1">
                    <div className="w-4 h-4 bg-white rounded-full shadow transform translate-x-6 transition-transform"></div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Analytics & Performance</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Help us understand website usage, chatbot performance, and improve our services.
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    <strong>Examples:</strong> Google Analytics, AI conversation analytics, performance monitoring
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <button
                    onClick={() => handlePreferenceChange('analytics', !preferences.analytics)}
                    className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                      preferences.analytics ? 'bg-teal-500 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow transition-transform"></div>
                  </button>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Marketing & Advertising</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Enable personalized content, targeted advertising, and social media integration.
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    <strong>Examples:</strong> Facebook Pixel, Google Ads, retargeting cookies
                    {userLocation === 'US' && <span className="text-red-600"> (Data sharing/selling)</span>}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <button
                    onClick={() => handlePreferenceChange('marketing', !preferences.marketing)}
                    className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                      preferences.marketing ? 'bg-teal-500 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow transition-transform"></div>
                  </button>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Enhanced Functionality</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Remember your preferences, enable advanced AI features, and personalize your experience.
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    <strong>Examples:</strong> Language preferences, AI conversation memory, theme settings
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <button
                    onClick={() => handlePreferenceChange('functional', !preferences.functional)}
                    className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                      preferences.functional ? 'bg-teal-500 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow transition-transform"></div>
                  </button>
                </div>
              </div>

              {/* AI Disclosure */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-900">AI Technology Notice (EU AI Act 2025)</h5>
                    <p className="text-sm text-blue-800 mt-1">
                      This website uses AI-powered chatbot technology. All AI interactions are clearly disclosed, 
                      and you can request human assistance at any time. Conversation data is processed to improve 
                      service quality and may be stored according to your cookie preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomPreferences}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CookieConsentBanner;
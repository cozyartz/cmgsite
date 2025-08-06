import React, { useState, useEffect } from 'react';
import { Shield, Trash2, Download, Eye, Settings, X } from 'lucide-react';

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface PrivacySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });
  const [consentDate, setConsentDate] = useState<string>('');
  const [userLocation, setUserLocation] = useState<'EU' | 'US' | 'OTHER'>('OTHER');

  useEffect(() => {
    // Load current preferences
    const consentData = localStorage.getItem('cookie_consent');
    const consentTimestamp = localStorage.getItem('consent_timestamp');
    
    if (consentData) {
      try {
        setPreferences(JSON.parse(consentData));
      } catch (error) {
        console.warn('Failed to load consent preferences:', error);
      }
    }
    
    if (consentTimestamp) {
      setConsentDate(new Date(parseInt(consentTimestamp)).toLocaleDateString());
    }

    // Detect location (simplified - use robust service in production)
    const detectLocation = () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes('Europe')) {
        setUserLocation('EU');
      } else if (timezone.includes('America') && timezone.includes('New_York')) {
        setUserLocation('US');
      } else {
        setUserLocation('OTHER');
      }
    };

    detectLocation();
  }, []);

  const handlePreferenceChange = (category: keyof ConsentPreferences, value: boolean) => {
    if (category === 'necessary') return;
    
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const savePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    localStorage.setItem('consent_timestamp', Date.now().toString());
    
    // Update consent cookies
    document.cookie = `consent_analytics=${preferences.analytics}; path=/; max-age=${365*24*60*60}; SameSite=Strict`;
    document.cookie = `consent_marketing=${preferences.marketing}; path=/; max-age=${365*24*60*60}; SameSite=Strict`;
    document.cookie = `consent_functional=${preferences.functional}; path=/; max-age=${365*24*60*60}; SameSite=Strict`;
    
    // Reload page to apply new settings
    window.location.reload();
  };

  const handleDataDeletion = async () => {
    if (!confirm('This will delete all your stored data and reset your privacy settings. Continue?')) {
      return;
    }

    try {
      // Clear local storage
      localStorage.removeItem('cookie_consent');
      localStorage.removeItem('consent_timestamp');
      localStorage.removeItem('consent_version');
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      // Call deletion API if available
      try {
        await fetch('/api/privacy/delete-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete_all_data' })
        });
      } catch (error) {
        console.warn('Data deletion API call failed:', error);
      }

      alert('Your data has been deleted. The page will now reload.');
      window.location.reload();
    } catch (error) {
      console.error('Data deletion failed:', error);
      alert('Data deletion failed. Please contact support if this continues.');
    }
  };

  const handleDataExport = async () => {
    try {
      const exportData = {
        consent_preferences: preferences,
        consent_date: consentDate,
        consent_version: localStorage.getItem('consent_version') || '2025.1',
        location: userLocation,
        export_date: new Date().toISOString(),
        data_collected: {
          analytics: preferences.analytics ? 'Website usage patterns, page views, session duration' : 'None',
          marketing: preferences.marketing ? 'Ad interactions, conversion tracking, social media engagement' : 'None',
          functional: preferences.functional ? 'Language preferences, theme settings, AI conversation history' : 'None'
        }
      };

      // Try server-side export first
      try {
        const response = await fetch('/api/privacy/export-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: 'anonymous' })
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `privacy-data-export-${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          return;
        }
      } catch (error) {
        console.warn('Server-side export failed, using client-side:', error);
      }

      // Fallback to client-side export
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `privacy-data-export-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Data export failed:', error);
      alert('Data export failed. Please contact support.');
    }
  };

  const resetToDefaults = () => {
    if (!confirm('Reset all privacy settings to defaults?')) return;
    
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Privacy & Cookie Settings</h3>
                <p className="text-sm text-gray-600">
                  Manage your data preferences and privacy rights
                  {consentDate && ` • Last updated: ${consentDate}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Cookie Preferences */}
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Cookie Categories
              </h4>

              {/* Necessary */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">Strictly Necessary</h5>
                    <p className="text-sm text-gray-600">Essential website functionality</p>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end p-1">
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Security, session management, basic AI functionality. Cannot be disabled.
                </p>
              </div>

              {/* Analytics */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">Analytics & Performance</h5>
                    <p className="text-sm text-gray-600">Website usage and AI performance analysis</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('analytics', !preferences.analytics)}
                    className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                      preferences.analytics ? 'bg-teal-500 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Google Analytics, AI conversation metrics, performance monitoring.
                </p>
              </div>

              {/* Marketing */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">Marketing & Advertising</h5>
                    <p className="text-sm text-gray-600">
                      Personalized ads and social media
                      {userLocation === 'US' && <span className="text-red-600 ml-1">(Data Sharing)</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('marketing', !preferences.marketing)}
                    className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                      preferences.marketing ? 'bg-teal-500 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Facebook Pixel, Google Ads, retargeting, social sharing.
                </p>
              </div>

              {/* Functional */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">Enhanced Functionality</h5>
                    <p className="text-sm text-gray-600">Personalization and advanced features</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('functional', !preferences.functional)}
                    className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                      preferences.functional ? 'bg-teal-500 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Preferences, AI conversation memory, enhanced chatbot features.
                </p>
              </div>
            </div>

            {/* Privacy Rights & Actions */}
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Your Privacy Rights
              </h4>

              {/* Rights Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-2">
                  {userLocation === 'EU' ? 'GDPR Rights (EU)' : 
                   userLocation === 'US' ? 'CCPA Rights (California)' : 
                   'Privacy Rights'}
                </h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Access your personal data</li>
                  <li>• Request data correction or deletion</li>
                  <li>• Export your data</li>
                  {userLocation === 'EU' && <li>• Data portability and objection rights</li>}
                  {userLocation === 'US' && <li>• Opt-out of data selling/sharing</li>}
                  <li>• Contact our Data Protection Officer</li>
                </ul>
              </div>

              {/* AI Disclosure */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h5 className="font-medium text-amber-900 mb-2">AI Technology Notice (EU AI Act)</h5>
                <p className="text-sm text-amber-800">
                  This website uses AI chatbot technology. All conversations are processed by artificial intelligence. 
                  You can request human assistance at any time. Conversation data is stored based on your cookie preferences.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDataExport}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Download className="w-5 h-5 text-teal-600" />
                  <div>
                    <h6 className="font-medium text-gray-900">Export Your Data</h6>
                    <p className="text-sm text-gray-600">Download all data we have about you</p>
                  </div>
                </button>

                <button
                  onClick={handleDataDeletion}
                  className="w-full flex items-center gap-3 p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-left text-red-700"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <div>
                    <h6 className="font-medium text-red-900">Delete All My Data</h6>
                    <p className="text-sm text-red-600">Permanently remove all stored information</p>
                  </div>
                </button>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-4">
                <h6 className="font-medium text-gray-900 mb-2">Contact Information</h6>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Email:</strong> privacy@cozyartzmedia.com</p>
                  <p><strong>Phone:</strong> 269.261.0069</p>
                  <p><strong>Address:</strong> Cozyartz Media Group, Michigan, USA</p>
                  {userLocation === 'EU' && (
                    <p><strong>DPO:</strong> dpo@cozyartzmedia.com</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-between">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={savePreferences}
              className="px-6 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../lib/api';
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  CreditCard, 
  Key, 
  Globe,
  Save,
  Trash2,
  Plus,
  X
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    name: profile?.full_name || user?.email || '',
    email: user?.email || '',
    avatar_url: profile?.avatar_url || '',
    phone: '',
    timezone: 'America/New_York'
  });

  const [companyData, setCompanyData] = useState({
    name: profile?.full_name || user?.email || '',
    domain: '',
    industry: 'Consulting',
    size: '1-10',
    description: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_alerts: true,
    sms_alerts: false,
    weekly_reports: true,
    monthly_reports: true,
    ai_usage_alerts: true,
    consultation_reminders: true
  });

  const [competitors, setCompetitors] = useState([
    'competitor1.com',
    'competitor2.com'
  ]);

  const [keywords, setKeywords] = useState([
    'partnership consulting',
    'Fortune 500 partnerships',
    'business development'
  ]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'company', name: 'Company', icon: <Building className="h-4 w-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'tracking', name: 'Tracking', icon: <Globe className="h-4 w-4" /> },
    { id: 'security', name: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'billing', name: 'Billing', icon: <CreditCard className="h-4 w-4" /> },
  ];

  const handleSave = async (section: string, data: any) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.call(`/api/settings/${section}`, {
        method: 'PUT',
        body: data,
        requireAuth: true
      });

      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const addItem = (type: 'competitor' | 'keyword', value: string) => {
    if (type === 'competitor') {
      setCompetitors([...competitors, value]);
    } else {
      setKeywords([...keywords, value]);
    }
  };

  const removeItem = (type: 'competitor' | 'keyword', index: number) => {
    if (type === 'competitor') {
      setCompetitors(competitors.filter((_, i) => i !== index));
    } else {
      setKeywords(keywords.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-green-400">{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'profile' && (
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Timezone
                </label>
                <select
                  value={profileData.timezone}
                  onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => handleSave('profile', profileData)}
                disabled={loading}
                className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyData.name}
                  onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Website Domain
                </label>
                <input
                  type="text"
                  value={companyData.domain}
                  onChange={(e) => setCompanyData({...companyData, domain: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Industry
                </label>
                <select
                  value={companyData.industry}
                  onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Consulting">Consulting</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Company Size
                </label>
                <select
                  value={companyData.size}
                  onChange={(e) => setCompanyData({...companyData, size: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Company Description
              </label>
              <textarea
                value={companyData.description}
                onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
                rows={4}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Brief description of your company..."
              />
            </div>
            <div className="mt-6">
              <button
                onClick={() => handleSave('company', companyData)}
                disabled={loading}
                className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium capitalize">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {key === 'email_alerts' && 'Receive email notifications for important updates'}
                      {key === 'sms_alerts' && 'Receive SMS notifications for urgent matters'}
                      {key === 'weekly_reports' && 'Get weekly performance summaries'}
                      {key === 'monthly_reports' && 'Get monthly detailed reports'}
                      {key === 'ai_usage_alerts' && 'Get notified when approaching AI usage limits'}
                      {key === 'consultation_reminders' && 'Receive reminders for upcoming consultations'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        [key]: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button
                onClick={() => handleSave('notifications', notificationSettings)}
                disabled={loading}
                className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Competitor Tracking</h3>
              <div className="space-y-3">
                {competitors.map((competitor, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-700 p-3 rounded-lg">
                    <span className="text-white">{competitor}</span>
                    <button
                      onClick={() => removeItem('competitor', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add competitor domain..."
                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addItem('competitor', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add competitor domain..."]') as HTMLInputElement;
                      if (input?.value) {
                        addItem('competitor', input.value);
                        input.value = '';
                      }
                    }}
                    className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Keyword Tracking</h3>
              <div className="space-y-3">
                {keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-700 p-3 rounded-lg">
                    <span className="text-white">{keyword}</span>
                    <button
                      onClick={() => removeItem('keyword', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add keyword..."
                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addItem('keyword', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add keyword..."]') as HTMLInputElement;
                      if (input?.value) {
                        addItem('keyword', input.value);
                        input.value = '';
                      }
                    }}
                    className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h4 className="text-white font-medium mb-2">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button className="mt-3 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Update Password
                </button>
              </div>

              <div className="border-b border-slate-700 pb-4">
                <h4 className="text-white font-medium mb-2">Two-Factor Authentication</h4>
                <p className="text-slate-400 text-sm mb-3">
                  Add an extra layer of security to your account
                </p>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Enable 2FA
                </button>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">API Keys</h4>
                <p className="text-slate-400 text-sm mb-3">
                  Manage API keys for integrations
                </p>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>Generate API Key</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Billing Settings</h3>
            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-4">
                <h4 className="text-white font-medium mb-2">Payment Method</h4>
                <p className="text-slate-400 text-sm mb-3">
                  •••• •••• •••• 4242 (Expires 12/25)
                </p>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Update Payment Method
                </button>
              </div>

              <div className="border-b border-slate-700 pb-4">
                <h4 className="text-white font-medium mb-2">Billing Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company name"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button className="mt-3 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Update Address
                </button>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Danger Zone</h4>
                <p className="text-slate-400 text-sm mb-3">
                  Once you delete your account, there is no going back.
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
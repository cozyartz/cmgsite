import React, { useState } from 'react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { Crown, Users, TrendingUp, DollarSign, Activity, CheckCircle, ArrowUp, Bot, Zap } from 'lucide-react';

type SuperAdminTab = 'overview' | 'users' | 'analytics' | 'clientTools' | 'maxai' | 'settings';

const SuperAdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [currentTab, setCurrentTab] = useState<SuperAdminTab>('overview');

  const handleLogout = async () => {
    await signOut();
  };

  const tabs = [
    { id: 'overview' as SuperAdminTab, label: 'Overview', icon: TrendingUp },
    { id: 'users' as SuperAdminTab, label: 'User Management', icon: Users },
    { id: 'analytics' as SuperAdminTab, label: 'Analytics', icon: TrendingUp },
    { id: 'clientTools' as SuperAdminTab, label: 'Client Tools', icon: Zap },
    { id: 'maxai' as SuperAdminTab, label: 'MAX AI (Admin)', icon: Bot },
    { id: 'settings' as SuperAdminTab, label: 'Settings', icon: Users }
  ];

  const StatCard = ({ icon: Icon, title, value, change, color }: {
    icon: any;
    title: string;
    value: string | number;
    change?: string;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${color === 'green' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              <ArrowUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color === 'green' ? 'bg-green-100' : 'bg-blue-100'}`}>
          <Icon className={`w-6 h-6 ${color === 'green' ? 'text-green-600' : 'text-blue-600'}`} />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Superadmin Dashboard</h2>
                <p className="text-gray-600">Welcome back, {user?.user_metadata?.full_name || user?.email}!</p>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Superadmin Access</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Total Users"
                value="1,247"
                change="+12% from last month"
                color="green"
              />
              <StatCard
                icon={DollarSign}
                title="Monthly Revenue"
                value="$12,340"
                change="+8% from last month"
                color="green"
              />
              <StatCard
                icon={Activity}
                title="API Calls"
                value="45,678"
                change="+15% from last month"
                color="green"
              />
              <StatCard
                icon={CheckCircle}
                title="System Uptime"
                value="99.9%"
                color="green"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 text-sm">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Gateway</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 text-sm">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Authentication</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 text-sm">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-8 h-8 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">Cozyartz Superadmin</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || user?.email}</p>
                <p className="text-xs text-gray-500">Superadmin</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
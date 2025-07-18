import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  DollarSign,
  Zap,
  Globe,
  Activity,
  Shield,
  Settings,
  UserPlus,
  AlertTriangle,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  Search,
  Filter,
  Eye,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  UserCheck,
  Mail,
  Database,
  Crown,
  Tabs,
  LayoutDashboard,
  Bot
} from 'lucide-react';
import MaxHeadroomAI from '../components/admin/MaxHeadroomAI';
import UserManagement from '../components/admin/UserManagement';
import CustomerMaxAI from '../components/customer/CustomerMaxAI';
import GoogleAnalyticsCard from '../components/dashboard/GoogleAnalyticsCard';
import SearchConsoleCard from '../components/dashboard/SearchConsoleCard';
import MyBusinessCard from '../components/dashboard/MyBusinessCard';
import PageSpeedCard from '../components/dashboard/PageSpeedCard';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalRevenue: number;
  monthlyRevenue: number;
  churnRate: number;
  apiCalls: number;
  systemUptime: number;
  supportTickets: number;
  conversionRate: number;
}

type SuperAdminTab = 'overview' | 'users' | 'analytics' | 'clientTools' | 'maxai' | 'settings';

const SuperAdminDashboard: React.FC = () => {
  const { user, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<SuperAdminTab>('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    activeUsers: 892,
    newUsersToday: 23,
    totalRevenue: 89420,
    monthlyRevenue: 12340,
    churnRate: 2.3,
    apiCalls: 45678,
    systemUptime: 99.9,
    supportTickets: 12,
    conversionRate: 3.4
  });

  useEffect(() => {
    if (!user || !isSuperAdmin) {
      navigate('/auth');
      return;
    }
  }, [user, isSuperAdmin, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview' as SuperAdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'users' as SuperAdminTab, label: 'User Management', icon: Users },
    { id: 'analytics' as SuperAdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'clientTools' as SuperAdminTab, label: 'Client Tools', icon: Zap },
    { id: 'maxai' as SuperAdminTab, label: 'MAX AI (Admin)', icon: Bot },
    { id: 'settings' as SuperAdminTab, label: 'Settings', icon: Settings }
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
              {color === 'green' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
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
                <p className="text-gray-600">Welcome back, {user?.name}! Here's your system overview.</p>
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
                value={stats.totalUsers.toLocaleString()}
                change="+12% from last month"
                color="green"
              />
              <StatCard
                icon={DollarSign}
                title="Monthly Revenue"
                value={`$${stats.monthlyRevenue.toLocaleString()}`}
                change="+8% from last month"
                color="green"
              />
              <StatCard
                icon={Activity}
                title="API Calls"
                value={stats.apiCalls.toLocaleString()}
                change="+15% from last month"
                color="green"
              />
              <StatCard
                icon={CheckCircle}
                title="System Uptime"
                value={`${stats.systemUptime}%`}
                color="green"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setCurrentTab('users')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>Manage Users</span>
                    </div>
                    <ArrowUp className="w-4 h-4 text-gray-400 rotate-90" />
                  </button>
                  <button 
                    onClick={() => setCurrentTab('clientTools')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-purple-600" />
                      <span>Access Client Tools</span>
                    </div>
                    <ArrowUp className="w-4 h-4 text-gray-400 rotate-90" />
                  </button>
                  <button 
                    onClick={() => setCurrentTab('maxai')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Bot className="w-5 h-5 text-green-600" />
                      <span>MAX AI Admin Panel</span>
                    </div>
                    <ArrowUp className="w-4 h-4 text-gray-400 rotate-90" />
                  </button>
                </div>
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
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Support Tickets</span>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600 text-sm">{stats.supportTickets} Open</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <p className="text-gray-600">Manage all users across the platform</p>
            </div>
            <UserManagement />
          </div>
        );

      case 'analytics':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="text-gray-600">Google services integration & performance metrics</p>
            </div>
            
            {/* Google Analytics & Search Console Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <GoogleAnalyticsCard className="lg:col-span-1" />
              <SearchConsoleCard className="lg:col-span-1" />
            </div>
            
            {/* Business Profile & PageSpeed Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <MyBusinessCard className="lg:col-span-1" />
              <PageSpeedCard className="lg:col-span-1" />
            </div>
            
            {/* System Analytics Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total API Calls</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.apiCalls.toLocaleString()}</p>
                    </div>
                    <Zap className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">+18.2%</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">System Uptime</p>
                      <p className="text-2xl font-bold text-green-600">{stats.systemUptime}%</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">Excellent</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.supportTickets}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">-12.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'clientTools':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Client Tools Access</h2>
              <p className="text-gray-600">Access the same tools your clients use</p>
            </div>
            <div className="bg-white rounded-lg shadow">
              <CustomerMaxAI userPlan="enterprise" userId={user?.id} />
            </div>
          </div>
        );

      case 'maxai':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">MAX AI Admin Panel</h2>
              <p className="text-gray-600">Administrative AI interface with enhanced capabilities</p>
            </div>
            <MaxHeadroomAI />
          </div>
        );

      case 'settings':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Superadmin Settings</h2>
              <p className="text-gray-600">System configuration and preferences</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <input
                        type="text"
                        value="Superadmin"
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                        <p className="text-sm text-gray-600">Enable to restrict access during updates</p>
                      </div>
                      <button className="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full">
                        <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Debug Logging</h4>
                        <p className="text-sm text-gray-600">Enable detailed system logs</p>
                      </div>
                      <button className="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full">
                        <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user || !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">You need superadmin privileges via GitHub OAuth to access this dashboard.</p>
        </div>
      </div>
    );
  }

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
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
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
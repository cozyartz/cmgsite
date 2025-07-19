import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { Crown, Users, TrendingUp, DollarSign, Activity, CheckCircle, ArrowUp, Bot, Zap, Download, Calendar, BarChart3, PieChart, LineChart, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { AnalyticsService, DashboardStats, UserActivity, RevenueData, formatCurrency, formatNumber, formatPercent, getStatusColor, getPlanColor } from '../lib/analytics';
import SuperAdminNavigation from '../components/SuperAdminNavigation';

type SuperAdminTab = 'overview' | 'users' | 'analytics' | 'revenue' | 'performance' | 'clientTools' | 'maxai' | 'settings';

interface SystemHealth {
  overall_status: 'healthy' | 'degraded' | 'unhealthy';
  services: Array<{
    name: string;
    status: string;
    response_time_ms?: number;
    last_check: string;
  }>;
  incidents_this_month?: number;
  avg_response_time?: number;
}

interface DashboardData {
  stats: DashboardStats | null;
  userActivity: UserActivity[];
  revenueData: RevenueData | null;
  systemHealth: SystemHealth | null;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

interface SchemaStatus {
  isInstalled: boolean;
  missingComponents: string[];
  instructions?: string;
}

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [currentTab, setCurrentTab] = useState<SuperAdminTab>('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: null,
    userActivity: [],
    revenueData: null,
    systemHealth: null,
    loading: true,
    error: null,
    lastUpdate: null
  });
  const [, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [refreshing, setRefreshing] = useState(false);
  const [schemaStatus, setSchemaStatus] = useState<SchemaStatus | null>(null);

  const handleLogout = async () => {
    await signOut();
  };

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));
      
      const [stats, userActivity, revenueData, systemHealth, schemaCheck] = await Promise.all([
        AnalyticsService.getDashboardStats(),
        AnalyticsService.getUserActivity(100),
        AnalyticsService.getRevenueAnalytics(30),
        AnalyticsService.getSystemHealth(),
        AnalyticsService.checkSchemaStatus()
      ]);

      setDashboardData({
        stats,
        userActivity,
        revenueData,
        systemHealth,
        loading: false,
        error: null,
        lastUpdate: new Date()
      });
      
      setSchemaStatus(schemaCheck);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load dashboard data'
      }));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const exportData = async (type: 'users' | 'revenue' | 'analytics', format: 'csv' | 'json') => {
    try {
      const blob = await AnalyticsService.exportData(type, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'overview' as SuperAdminTab, label: 'Overview', icon: TrendingUp },
    { id: 'users' as SuperAdminTab, label: 'User Management', icon: Users },
    { id: 'analytics' as SuperAdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'revenue' as SuperAdminTab, label: 'Revenue', icon: DollarSign },
    { id: 'performance' as SuperAdminTab, label: 'Performance', icon: Activity },
    { id: 'clientTools' as SuperAdminTab, label: 'Client Tools', icon: Zap },
    { id: 'maxai' as SuperAdminTab, label: 'MAX AI (Admin)', icon: Bot },
    { id: 'settings' as SuperAdminTab, label: 'Settings', icon: Users }
  ];

  const StatCard = ({ icon: Icon, title, value, change, color, trend }: {
    icon: any;
    title: string;
    value: string | number;
    change?: string;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className={`text-sm flex items-center ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' && <ArrowUp className="w-4 h-4 mr-1" />}
              {trend === 'down' && <ArrowUp className="w-4 h-4 mr-1 rotate-180" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          color === 'green' ? 'bg-green-100' :
          color === 'blue' ? 'bg-blue-100' :
          color === 'red' ? 'bg-red-100' :
          color === 'yellow' ? 'bg-yellow-100' :
          'bg-gray-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            color === 'green' ? 'text-green-600' :
            color === 'blue' ? 'text-blue-600' :
            color === 'red' ? 'text-red-600' :
            color === 'yellow' ? 'text-yellow-600' :
            'text-gray-600'
          }`} />
        </div>
      </div>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <span className="ml-2 text-gray-600">Loading dashboard data...</span>
    </div>
  );

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
        <span className="text-red-800">{message}</span>
        <button 
          onClick={handleRefresh}
          className="ml-auto text-red-600 hover:text-red-800 font-medium"
        >
          Try Again
        </button>
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

            {dashboardData.error && <ErrorMessage message={dashboardData.error} />}
            
            {dashboardData.loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={Users}
                    title="Total Users"
                    value={formatNumber(dashboardData.stats?.total_users || 0)}
                    change={`${dashboardData.stats?.new_signups_today || 0} new today`}
                    color="blue"
                    trend="up"
                  />
                  <StatCard
                    icon={DollarSign}
                    title="Monthly Revenue"
                    value={formatCurrency(dashboardData.stats?.monthly_revenue_cents || 0)}
                    change={`${formatPercent(12.5)} from last month`}
                    color="green"
                    trend="up"
                  />
                  <StatCard
                    icon={Activity}
                    title="API Calls Today"
                    value={formatNumber(dashboardData.stats?.api_calls_today || 0)}
                    change={`Avg session: ${Math.round((dashboardData.stats?.api_calls_today || 0) / Math.max(dashboardData.stats?.active_users || 1, 1))} calls`}
                    color="blue"
                    trend="up"
                  />
                  <StatCard
                    icon={CheckCircle}
                    title="System Uptime"
                    value={`${formatPercent(dashboardData.stats?.system_uptime || 0)}`}
                    change={dashboardData.systemHealth?.incidents_this_month ? `${dashboardData.systemHealth.incidents_this_month} incidents` : 'All systems operational'}
                    color={dashboardData.stats?.system_uptime && dashboardData.stats.system_uptime > 99 ? 'green' : 'yellow'}
                    trend={dashboardData.stats?.system_uptime && dashboardData.stats.system_uptime > 99 ? 'up' : 'neutral'}
                  />
                </div>
              </>
            )}

            {!dashboardData.loading && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Last updated: {dashboardData.lastUpdate?.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {dashboardData.systemHealth?.services?.map((service, index: number) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              service.status === 'healthy' ? 'bg-green-500' :
                              service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-gray-700 font-medium">{service.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {service.response_time_ms && (
                              <span className="text-xs text-gray-500">{service.response_time_ms}ms</span>
                            )}
                            <span className={`text-sm font-medium capitalize ${getStatusColor(service.status)}`}>
                              {service.status}
                            </span>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-4 text-gray-500">No health data available</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {dashboardData.userActivity.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs px-2 py-1 rounded-full ${getPlanColor(user.subscription_plan || 'free')}`}>
                              {user.subscription_plan || 'Free'}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {user.recent_activity_count} actions
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => exportData('users', 'csv')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {dashboardData.loading ? (
              <LoadingSpinner />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spending</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.userActivity.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(user.subscription_plan || 'free')}`}>
                              {user.subscription_plan || 'Free'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.recent_activity_count} actions
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(user.total_spent_cents)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Last 30 days</span>
                </div>
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-center py-8 text-gray-500">
                  <LineChart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Chart visualization coming soon</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-center py-8 text-gray-500">
                  <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Chart visualization coming soon</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Feature Usage</h3>
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Chart visualization coming soon</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'revenue':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics</h2>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => exportData('revenue', 'csv')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Revenue</span>
                </button>
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value={formatCurrency(dashboardData.stats?.total_revenue_cents || 0)}
                color="green"
              />
              <StatCard
                icon={TrendingUp}
                title="Monthly Recurring"
                value={formatCurrency(dashboardData.revenueData?.subscription_metrics?.mrr || 0)}
                color="blue"
              />
              <StatCard
                icon={Users}
                title="Paying Customers"
                value={formatNumber(dashboardData.userActivity.filter(u => u.total_spent_cents > 0).length)}
                color="purple"
              />
              <StatCard
                icon={Activity}
                title="Churn Rate"
                value={formatPercent(dashboardData.revenueData?.subscription_metrics?.churn_rate || 0)}
                color="yellow"
              />
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">System Performance</h2>
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <StatCard
                icon={Activity}
                title="Avg Response Time"
                value={`${dashboardData.systemHealth?.avg_response_time || 89}ms`}
                color="blue"
              />
              <StatCard
                icon={CheckCircle}
                title="Success Rate"
                value="99.2%"
                color="green"
              />
              <StatCard
                icon={AlertTriangle}
                title="Error Rate"
                value="0.8%"
                color="red"
              />
            </div>
          </div>
        );

      case 'clientTools':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Client Tools & Services</h2>
                <p className="text-gray-600">Manage client-facing tools and internal admin features</p>
              </div>
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Client Portal Tools */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Client Portal</h3>
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-gray-600 mb-4">Basic client portal for customer access</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.open('/client-portal', '_blank')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open Client Portal
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Portal Settings
                  </button>
                </div>
              </div>

              {/* Client Admin Dashboard */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Client Admin Dashboard</h3>
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-gray-600 mb-4">Advanced admin tools for client customers</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.open('/admin-dashboard', '_blank')}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Open Admin Dashboard
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Admin Settings
                  </button>
                </div>
              </div>

              {/* Domain Management */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Domain Management</h3>
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-gray-600 mb-4">Cloudflare domain registration and DNS</p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Domain Tools
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    DNS Management
                  </button>
                </div>
              </div>

              {/* SEO Services */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">SEO Services</h3>
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-gray-600 mb-4">SEO optimization and analytics tools</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.open('/seo-services', '_blank')}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    SEO Dashboard
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Keyword Research
                  </button>
                </div>
              </div>

              {/* Email Services */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Email Services</h3>
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-gray-600 mb-4">Email campaigns and automation</p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    Email Dashboard
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Template Manager
                  </button>
                </div>
              </div>

              {/* Analytics Tools */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-gray-600 mb-4">Advanced analytics and reporting</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => setCurrentTab('analytics')}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    View Analytics
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Custom Reports
                  </button>
                </div>
              </div>

              {/* Pricing Management */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Pricing & Plans</h3>
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-gray-600 mb-4">Manage subscription plans and pricing</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.open('/pricing', '_blank')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Pricing Page
                  </button>
                  <button 
                    onClick={() => setCurrentTab('revenue')}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Revenue Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'maxai':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">MAX AI (Admin)</h2>
                <p className="text-gray-600">Artificial Intelligence tools and management</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg">
                  <Bot className="w-5 h-5" />
                  <span className="font-semibold">AI Powered</span>
                </div>
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* AI Usage Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Bot}
                title="Total AI Calls"
                value={formatNumber(dashboardData.stats?.api_calls_today || 0)}
                change="✨ Unlimited Access"
                color="purple"
                trend="up"
              />
              <StatCard
                icon={Activity}
                title="Active Models"
                value="4"
                change="Claude, GPT-4, Cloudflare AI"
                color="blue"
              />
              <StatCard
                icon={DollarSign}
                title="AI Costs (Internal)"
                value="$0.00"
                change="No charge for internal use"
                color="green"
              />
              <StatCard
                icon={CheckCircle}
                title="Success Rate"
                value="98.7%"
                change="99.2% average"
                color="green"
                trend="up"
              />
            </div>
            
            {/* SuperAdmin Notice */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">SuperAdmin Unlimited Access</h3>
                  <p className="text-purple-700">
                    As a Cozyartz Media Group SuperAdmin, you have unlimited access to all AI tools and services at no cost. 
                    All usage is tracked for internal analytics but does not count against any limits.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Tools Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Claude AI */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Claude AI</h3>
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Anthropic's Claude for advanced reasoning</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usage today:</span>
                    <span className="font-medium">234 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tokens used:</span>
                    <span className="font-medium">89.2K</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Manage Claude
                </button>
              </div>

              {/* GPT-4 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">GPT-4</h3>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">OpenAI GPT-4 for general tasks</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usage today:</span>
                    <span className="font-medium">156 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tokens used:</span>
                    <span className="font-medium">67.8K</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Manage GPT-4
                </button>
              </div>

              {/* Cloudflare AI */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cloudflare AI</h3>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Edge AI processing and inference</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usage today:</span>
                    <span className="font-medium">89 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Models active:</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Manage Cloudflare AI
                </button>
              </div>

              {/* AI Content Generation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Content Generation</h3>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">AI-powered content creation tools</p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Blog Generator
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Image Generation
                  </button>
                </div>
              </div>

              {/* AI Analytics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">AI Analytics</h3>
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Usage patterns and optimization</p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Usage Reports
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Cost Analysis
                  </button>
                </div>
              </div>

              {/* AI Model Training */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Model Training</h3>
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Custom model fine-tuning</p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Training Dashboard
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Dataset Manager
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                      <p className="text-xs text-gray-500">Enable to temporarily disable the site</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Auto Refresh</label>
                      <p className="text-xs text-gray-500">Automatically refresh dashboard data</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                      <p className="text-xs text-gray-500">Send email alerts for critical events</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Session Timeout</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>8 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                    <div className="mt-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Configure 2FA
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">IP Whitelist</label>
                    <div className="mt-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Manage IP Access
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rate Limiting</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <input 
                        type="number" 
                        defaultValue={1000}
                        className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-500">requests per minute</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">API Keys</label>
                    <div className="mt-2 space-y-2">
                      <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Generate New API Key
                      </button>
                      <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        View Active Keys
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backup & Export */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup & Export</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Database Backup</label>
                    <div className="mt-2 space-y-2">
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Create Backup
                      </button>
                      <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Schedule Backups
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Export Data</label>
                    <div className="mt-2 space-y-2">
                      <button 
                        onClick={() => exportData('analytics', 'json')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Export All Data
                      </button>
                      <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Custom Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Page Not Found</h3>
              <p className="text-gray-500">The requested section could not be found.</p>
              <button 
                onClick={() => setCurrentTab('overview')}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Return to Overview
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Global Navigation */}
      <SuperAdminNavigation />
      
      {/* Schema Status Notification */}
      {schemaStatus && !schemaStatus.isInstalled && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start">
              <AlertTriangle className="flex-shrink-0 w-5 h-5 text-amber-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-amber-800">
                  <strong>Database Schema Not Complete:</strong> Some analytics components are missing.
                  Missing: {schemaStatus.missingComponents.join(', ')}
                </p>
                <div className="mt-2">
                  <button 
                    onClick={() => alert(schemaStatus.instructions)}
                    className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1 rounded-md transition-colors"
                  >
                    View Setup Instructions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-8 h-8 text-purple-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Cozyartz SuperAdmin</h1>
                  <p className="text-sm text-gray-600">Internal Business Intelligence Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || user?.email}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">SuperAdmin</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Unlimited Access</span>
                </div>
                {dashboardData.lastUpdate && (
                  <p className="text-xs text-gray-400">Updated: {dashboardData.lastUpdate.toLocaleTimeString()}</p>
                )}
              </div>
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
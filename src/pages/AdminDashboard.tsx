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
  Database
} from 'lucide-react';
import MaxHeadroomAI from '../components/admin/MaxHeadroomAI';
import UserManagement from '../components/admin/UserManagement';

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

interface RecentUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  joinDate: string;
  status: 'active' | 'suspended' | 'pending';
  totalSpent: number;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'analytics'>('dashboard');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/client-portal');
      return;
    }
    
    // Additional security check for authorized admin emails
    const authorizedAdminEmails = [
      'hello@cozyartzmedia.com',
      'amy@cozyartzmedia.com'
    ];
    
    if (!user?.email || !authorizedAdminEmails.includes(user.email)) {
      console.warn('Unauthorized admin access attempt:', user?.email);
      navigate('/client-portal');
      return;
    }
    
    loadDashboardData();
  }, [isAdmin, navigate, selectedTimeRange, user?.email]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API calls - replace with real endpoints
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 2847,
        activeUsers: 1923,
        newUsersToday: 23,
        totalRevenue: 287543.50,
        monthlyRevenue: 34567.20,
        churnRate: 2.4,
        apiCalls: 1234567,
        systemUptime: 99.97,
        supportTickets: 8,
        conversionRate: 12.5
      });

      setRecentUsers([
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@techstartup.com',
          plan: 'Pro',
          joinDate: '2024-01-15',
          status: 'active',
          totalSpent: 299.97
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike@designagency.com',
          plan: 'Enterprise',
          joinDate: '2024-01-14',
          status: 'active',
          totalSpent: 899.99
        },
        {
          id: '3',
          name: 'Lisa Rodriguez',
          email: 'lisa@consulting.com',
          plan: 'Starter',
          joinDate: '2024-01-13',
          status: 'pending',
          totalSpent: 0
        }
      ]);

      setSystemAlerts([
        {
          id: '1',
          type: 'warning',
          message: 'High API usage detected - 85% of monthly limit reached',
          timestamp: '2024-01-15 14:30',
          resolved: false
        },
        {
          id: '2',
          type: 'info',
          message: 'Scheduled maintenance completed successfully',
          timestamp: '2024-01-15 02:00',
          resolved: true
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <RefreshCw className="h-8 w-8 animate-spin text-teal-400" />
          <div className="text-lg font-medium">Loading Admin Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-teal-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">Cozyartz Super Admin</h1>
                  <p className="text-sm text-slate-300">Welcome back, {user?.name}</p>
                  <p className="text-xs text-slate-400">Authorized: {user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Navigation Tabs */}
                <div className="flex bg-slate-700/50 rounded-lg p-1">
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                      activeView === 'dashboard' 
                        ? 'bg-teal-600 text-white' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveView('users')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                      activeView === 'users' 
                        ? 'bg-teal-600 text-white' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Users
                  </button>
                  <button
                    onClick={() => setActiveView('analytics')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                      activeView === 'analytics' 
                        ? 'bg-teal-600 text-white' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Analytics
                  </button>
                </div>
                
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="bg-slate-700/80 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <button
                  onClick={loadDashboardData}
                  className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Conditional View Rendering */}
          {activeView === 'users' && <UserManagement isVisible={true} />}
          
          {activeView === 'dashboard' && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={formatNumber(stats?.totalUsers || 0)}
              change={12.5}
              icon={Users}
              color="blue"
              subtitle={`${stats?.newUsersToday || 0} new today`}
            />
            <StatCard
              title="Monthly Revenue"
              value={formatCurrency(stats?.monthlyRevenue || 0)}
              change={8.2}
              icon={DollarSign}
              color="green"
              subtitle="MRR growth"
            />
            <StatCard
              title="API Calls"
              value={formatNumber(stats?.apiCalls || 0)}
              change={15.3}
              icon={Zap}
              color="purple"
              subtitle="this month"
            />
            <StatCard
              title="System Uptime"
              value={`${stats?.systemUptime || 0}%`}
              change={0.02}
              icon={Activity}
              color="teal"
              subtitle="last 30 days"
            />
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-teal-400" />
                  Revenue Trends
                </h3>
                <button className="text-slate-400 hover:text-white">
                  <Download className="h-5 w-5" />
                </button>
              </div>
              <RevenueChart />
            </div>

            {/* User Growth */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <UserPlus className="h-6 w-6 mr-2 text-teal-400" />
                  User Growth
                </h3>
                <button className="text-slate-400 hover:text-white">
                  <Download className="h-5 w-5" />
                </button>
              </div>
              <UserGrowthChart />
            </div>
          </div>

          {/* Recent Activity and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Users */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Signups</h3>
                <button className="text-teal-400 hover:text-teal-300 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{user.plan}</p>
                      <p className="text-slate-400 text-sm">{formatCurrency(user.totalSpent)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">System Alerts</h3>
                <span className="text-sm text-slate-400">{systemAlerts.filter(a => !a.resolved).length} active</span>
              </div>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'error' ? 'bg-red-900/20 border-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500' :
                    'bg-blue-900/20 border-blue-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        {alert.type === 'error' ? (
                          <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
                        ) : alert.type === 'warning' ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                        )}
                        <div>
                          <p className="text-white text-sm">{alert.message}</p>
                          <p className="text-slate-400 text-xs">{alert.timestamp}</p>
                        </div>
                      </div>
                      {alert.resolved && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <QuickActionButton icon={UserPlus} label="Add User" />
              <QuickActionButton icon={Mail} label="Send Newsletter" />
              <QuickActionButton icon={Settings} label="System Settings" />
              <QuickActionButton icon={Database} label="Database Tools" />
              <QuickActionButton icon={BarChart3} label="Analytics" />
              <QuickActionButton icon={Shield} label="Security" />
            </div>
          </div>
            </>
          )}
          
          {activeView === 'analytics' && (
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h2>
              <p className="text-slate-300">Detailed analytics dashboard coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Max Headroom AI Assistant */}
      <MaxHeadroomAI />
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'teal';
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color, subtitle }) => {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    teal: 'text-teal-400 bg-teal-500/20'
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colors[color]} rounded-lg`}>
          <Icon className={`h-6 w-6 ${colors[color].split(' ')[0]}`} />
        </div>
        <div className={`flex items-center space-x-1 text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{title}</div>
      {subtitle && <div className="text-slate-500 text-xs mt-1">{subtitle}</div>}
    </div>
  );
};

// Quick Action Button
interface QuickActionButtonProps {
  icon: any;
  label: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon: Icon, label }) => {
  return (
    <button className="flex flex-col items-center space-y-2 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-all duration-300 hover:scale-105">
      <Icon className="h-6 w-6 text-teal-400" />
      <span className="text-white text-sm font-medium">{label}</span>
    </button>
  );
};

// Revenue Chart Component
const RevenueChart: React.FC = () => {
  const data = [
    { month: 'Jan', revenue: 25000 },
    { month: 'Feb', revenue: 28000 },
    { month: 'Mar', revenue: 32000 },
    { month: 'Apr', revenue: 29000 },
    { month: 'May', revenue: 35000 },
    { month: 'Jun', revenue: 38000 }
  ];

  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div className="space-y-4">
      <div className="h-48 flex items-end space-x-2">
        {data.map((month, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-sm transition-all duration-500 hover:from-teal-500 hover:to-teal-300"
              style={{ height: `${(month.revenue / maxRevenue) * 100}%` }}
              title={`${month.month}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(month.revenue)}`}
            ></div>
            <div className="text-xs text-slate-400 mt-2">{month.month}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-slate-400">
        <span>Revenue</span>
        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.reduce((sum, d) => sum + d.revenue, 0))} total</span>
      </div>
    </div>
  );
};

// User Growth Chart Component
const UserGrowthChart: React.FC = () => {
  const data = [
    { month: 'Jan', users: 1200 },
    { month: 'Feb', users: 1400 },
    { month: 'Mar', users: 1800 },
    { month: 'Apr', users: 2100 },
    { month: 'May', users: 2400 },
    { month: 'Jun', users: 2800 }
  ];

  const maxUsers = Math.max(...data.map(d => d.users));

  return (
    <div className="space-y-4">
      <div className="h-48 flex items-end space-x-2">
        {data.map((month, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-500 hover:from-blue-500 hover:to-blue-300"
              style={{ height: `${(month.users / maxUsers) * 100}%` }}
              title={`${month.month}: ${month.users.toLocaleString()} users`}
            ></div>
            <div className="text-xs text-slate-400 mt-2">{month.month}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-slate-400">
        <span>Users</span>
        <span>{data[data.length - 1].users.toLocaleString()} total</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
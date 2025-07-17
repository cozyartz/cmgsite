import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut, 
  User,
  Bell,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, client, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'seo-tools', name: 'SEO Tools', icon: Search },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'consultations', name: 'Consultations', icon: Calendar },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  const usagePercentage = client ? (client.ai_calls_used / client.ai_calls_limit) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <img 
              src="/cmgLogo.png" 
              alt="Cozyartz Media Group" 
              className="h-8 w-8 object-contain"
            />
            <div className="text-white">
              <h1 className="text-sm font-bold">COZYARTZ</h1>
              <p className="text-xs text-teal-300 tracking-wider">PORTAL</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col h-full px-4 py-6">
          {/* Client Info */}
          <div className="mb-6 p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {client?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-white font-medium text-sm">{client?.name}</p>
                <p className="text-slate-400 text-xs capitalize">{client?.subscription_tier} Plan</p>
              </div>
            </div>
            
            {/* Usage Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">AI Calls Used</span>
                <span className={getUsageColor(usagePercentage)}>
                  {client?.ai_calls_used}/{client?.ai_calls_limit}
                </span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full ${usagePercentage >= 90 ? 'bg-red-400' : usagePercentage >= 70 ? 'bg-yellow-400' : 'bg-green-400'}`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="mt-auto pt-4 border-t border-slate-700">
            <div className="flex items-center px-4 py-3 text-sm">
              <div className="h-8 w-8 bg-slate-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-slate-300" />
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-slate-400 text-xs">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-slate-800 border-b border-slate-700 h-16 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
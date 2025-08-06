import React, { ReactNode, useEffect, useState } from 'react';
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
  X,
  Zap,
  TrendingUp
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  const usagePercentage = 0; // TODO: Implement usage tracking with new profile system

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-slate-800/90 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className={`flex items-center justify-between h-16 px-4 border-b border-slate-700/50 transform transition-all duration-1000 delay-100 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/cmgLogo.png" 
                alt="Cozyartz Media Group" 
                className="h-8 w-8 object-contain transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute -inset-2 bg-teal-500/20 rounded-full blur-sm opacity-0 hover:opacity-100 transition-all duration-300"></div>
            </div>
            <div className="text-white">
              <h1 className="text-sm font-bold bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">COZYARTZ</h1>
              <p className="text-xs text-teal-300 tracking-wider font-medium">PORTAL</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-all duration-200 hover:scale-110 hover:bg-slate-700 p-1 rounded-md"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col h-full px-4 py-6">
          {/* Client Info */}
          <div className={`mb-6 p-4 bg-gradient-to-br from-slate-700/80 to-slate-600/60 backdrop-blur-sm border border-slate-600/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          } delay-200`}>
            <div className="flex items-center mb-4">
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-teal-400/40 to-blue-500/40 rounded-full blur-sm animate-pulse"></div>
              </div>
              <div className="ml-4">
                <p className="text-white font-semibold text-sm">{profile?.full_name || user?.email}</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    <Zap className="h-3 w-3 mr-1" />
                    {profile?.role === 'admin' ? 'Admin' : 'User'} Plan
                  </span>
                </div>
              </div>
            </div>
            
            {/* Usage Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  AI Calls Used
                </span>
                <span className={`font-bold ${getUsageColor(usagePercentage)}`}>
                  0/1000
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-slate-800/50 rounded-full h-3 border border-slate-600/30">
                  <div 
                    className={`h-full rounded-full relative overflow-hidden transition-all duration-1000 ${
                      usagePercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-400' : 
                      usagePercentage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' : 
                      'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm"></div>
              </div>
              <div className="text-xs text-slate-400 text-center">
                {Math.round(usagePercentage)}% utilized this month
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3 flex-1">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`transform transition-all duration-1000 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`group w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 border border-teal-500/30'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-slate-600/30'
                    }`}
                  >
                    {/* Background glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      activeTab === item.id ? 'opacity-100' : ''
                    }`}></div>
                    
                    <Icon className={`h-5 w-5 mr-3 relative z-10 transition-transform duration-300 ${
                      activeTab === item.id ? 'text-white' : 'group-hover:scale-110'
                    }`} />
                    <span className="relative z-10">{item.name}</span>
                    
                    {/* Active indicator */}
                    {activeTab === item.id && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className={`mt-auto pt-4 border-t border-slate-700/50 transform transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="flex items-center px-4 py-3 text-sm hover:bg-slate-700/30 rounded-lg transition-all duration-300 group cursor-pointer">
              <div className="relative">
                <div className="h-8 w-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <User className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              <div className="ml-3">
                <p className="text-white font-medium group-hover:text-teal-200 transition-colors duration-300">{profile?.full_name || user?.email}</p>
                <p className="text-slate-400 text-xs group-hover:text-slate-300 transition-colors duration-300">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30 rounded-lg transition-all duration-300 group border border-transparent hover:shadow-lg"
            >
              <LogOut className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 relative z-10">
        {/* Top Bar */}
        <div className={`bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 h-16 flex items-center justify-between px-4 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:bg-slate-700 p-2 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="relative text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:bg-slate-700 p-2 rounded-lg group">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full animate-pulse group-hover:scale-110 transition-transform duration-300"></div>
              <div className="absolute -inset-2 bg-teal-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto relative transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
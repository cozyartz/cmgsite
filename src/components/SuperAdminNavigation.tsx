import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Crown, 
  Users, 
  Settings, 
  ChevronDown, 
  ExternalLink,
  Shield,
  Zap,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
  description?: string;
  requiresSuperAdmin?: boolean;
}

const SuperAdminNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);

  const isSuperAdmin = user?.user_metadata?.role === 'superadmin';

  const navigationItems: NavigationItem[] = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
      description: 'Cozyartz Media Group website'
    },
    {
      label: 'SuperAdmin Dashboard',
      path: '/superadmin',
      icon: Crown,
      description: 'Internal admin dashboard',
      requiresSuperAdmin: true
    },
    {
      label: 'Client Portal',
      path: '/client-portal',
      icon: Users,
      description: 'Basic client access portal',
      external: true
    },
    {
      label: 'Admin Dashboard',
      path: '/admin-dashboard',
      icon: Shield,
      description: 'Client admin tools',
      external: true
    },
    {
      label: 'Services Overview',
      path: '/seo-services',
      icon: Zap,
      description: 'SEO and web services',
      external: true
    },
    {
      label: 'Pricing',
      path: '/pricing',
      icon: BarChart3,
      description: 'Service pricing and plans',
      external: true
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    !item.requiresSuperAdmin || isSuperAdmin
  );

  const handleNavigation = (item: NavigationItem) => {
    if (item.external) {
      window.open(item.path, '_blank');
    } else {
      navigate(item.path);
    }
    setIsQuickAccessOpen(false);
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem?.label || 'Cozyartz Media Group';
  };

  // Only show navigation for SuperAdmins
  if (!user || !isSuperAdmin) return null;

  return (
    <>
      {/* Fixed Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left side - Logo and current page */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-900 hover:text-purple-600 transition-colors"
              >
                <Crown className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-lg">Cozyartz</span>
              </button>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{getCurrentPageTitle()}</span>
            </div>

            {/* Center - Quick Access Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <div className="relative">
                <button
                  onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-4 h-4" />
                  <span>Quick Access</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isQuickAccessOpen ? 'rotate-180' : ''}`} />
                </button>

                {isQuickAccessOpen && (
                  <div className="absolute top-full mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2 mb-1">
                        Navigation
                      </div>
                      {filteredItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleNavigation(item)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                        >
                          <item.icon className="w-4 h-4 text-gray-500" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{item.label}</span>
                              {item.external && <ExternalLink className="w-3 h-3 text-gray-400" />}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-500">{item.description}</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-3">
              {isSuperAdmin && (
                <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  <Crown className="w-3 h-3" />
                  <span>SuperAdmin</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm">
                <div className="text-right hidden sm:block">
                  <div className="font-medium text-gray-900">
                    {user?.user_metadata?.full_name || user?.email}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.user_metadata?.role || 'User'}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {filteredItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <item.icon className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.label}</span>
                      {item.external && <ExternalLink className="w-3 h-3 text-gray-400" />}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-500">{item.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spacer to push content below fixed navbar */}
      <div className="h-14"></div>

      {/* Click outside to close dropdowns */}
      {(isQuickAccessOpen || isMenuOpen) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsQuickAccessOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default SuperAdminNavigation;
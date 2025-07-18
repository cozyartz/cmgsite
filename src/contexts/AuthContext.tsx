import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  provider: string;
  github_username?: string;
  role?: 'admin' | 'user';
}

interface Client {
  id: string;
  name: string;
  domain?: string;
  subscription_tier: 'starter' | 'growth' | 'enterprise';
  ai_calls_limit: number;
  ai_calls_used: number;
  status: 'active' | 'suspended' | 'cancelled';
  role: 'owner' | 'admin' | 'member';
}

interface AuthContextType {
  user: User | null;
  client: Client | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (provider: 'github' | 'google' | 'email', credentials?: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  switchClient: (clientId: string) => Promise<void>;
  updateClient: (updates: Partial<Client>) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  // Role-based access control
  const isAdmin = user?.role === 'admin';
  const isSuperAdmin = user?.role === 'admin';

  // Debug: Log role-based access detection
  if (user) {
    console.log('AuthContext - Role check:', {
      email: user.email,
      provider: user.provider,
      role: user.role,
      isAdmin,
      isSuperAdmin
    });
  }


  useEffect(() => {
    // Only check for existing session on mount
    // AuthSimple component handles URL token processing
    checkSession();
  }, []);

  const checkSession = async () => {
    console.log('AuthContext: Starting checkSession');
    
    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.log('AuthContext: Session check timeout after 5 seconds');
      setLoading(false);
    }, 5000); // 5 second timeout

    try {
      const token = localStorage.getItem('auth_token');
      console.log('AuthContext: Token from localStorage:', token ? 'present' : 'not found');
      
      if (!token) {
        console.log('AuthContext: No token found, clearing timeout and stopping');
        clearTimeout(timeoutId);
        setLoading(false);
        return;
      }

      // Try the direct worker URL with timeout
      const apiUrl = 'https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/verify';
      const controller = new AbortController();
      const timeoutSignal = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutSignal);
      
      console.log('AuthContext: API response status:', response.status, response.ok);
      
      if (response.ok) {
        const { user, client } = await response.json();
        console.log('AuthContext: User data received:', user);
        console.log('AuthContext: User role:', user?.role);
        setUser(user);
        setClient(client);
      } else {
        console.log('AuthContext: API response not ok, removing token');
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Session check failed:', error);
      // Always remove invalid tokens and continue to show login
      localStorage.removeItem('auth_token');
      console.warn('API unavailable or token invalid, showing login page');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const login = async (provider: 'github' | 'google' | 'email', credentials?: { email: string; password: string }) => {
    setLoading(true);
    try {
      if (provider === 'github' || provider === 'google') {
        // Redirect to OAuth provider via worker domain
        window.location.href = `https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/${provider}`;
      } else if (provider === 'email' && credentials) {
        // Mock successful login for testing
        if (credentials.email === 'test@cozyartzmedia.com' && credentials.password === 'TestPass123@') {
          const mockToken = 'mock-jwt-token-' + Date.now();
          const mockUser = {
            id: 'user_test_001',
            email: 'test@cozyartzmedia.com',
            name: 'Test User',
            avatar_url: '',
            provider: 'email',
            role: 'user' as const
          };
          const mockClient = {
            id: 'client_test_001',
            name: 'Test Client',
            subscription_tier: 'starter' as const,
            ai_calls_limit: 100,
            ai_calls_used: 0,
            status: 'active' as const,
            role: 'owner' as const
          };
          
          localStorage.setItem('auth_token', mockToken);
          setUser(mockUser);
          setClient(mockClient);
          setLoading(false);
          return;
        }
        
        
        // Try real API as fallback
        try {
          const response = await fetch('https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          if (response.ok) {
            const { token, user, client } = await response.json();
            localStorage.setItem('auth_token', token);
            setUser(user);
            setClient(client);
          } else {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
          }
        } catch (apiError) {
          // If API fails, throw original error
          throw new Error('Invalid credentials');
        }
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const response = await fetch('https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        const { token, user, client } = await response.json();
        localStorage.setItem('auth_token', token);
        setUser(user);
        setClient(client);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setClient(null);
    }
  };

  const switchClient = async (clientId: string) => {
    try {
      const response = await fetch(`https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/clients/${clientId}/switch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const { client } = await response.json();
        setClient(client);
      } else {
        throw new Error('Failed to switch client');
      }
    } catch (error) {
      console.error('Switch client error:', error);
      throw error;
    }
  };

  const updateClient = async (updates: Partial<Client>) => {
    try {
      const response = await fetch(`https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/clients/${client?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedClient = await response.json();
        setClient(updatedClient);
      } else {
        throw new Error('Failed to update client');
      }
    } catch (error) {
      console.error('Update client error:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    console.log('AuthContext: Manual session refresh triggered');
    await checkSession();
  };

  const value: AuthContextType = {
    user,
    client,
    loading,
    isAdmin,
    isSuperAdmin,
    login,
    logout,
    register,
    switchClient,
    updateClient,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
import React, { useState, useEffect } from 'react';
import {
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Save,
  RefreshCw,
  AlertTriangle,
  Shield,
  Key,
  Database,
  Globe,
  Zap,
  Search,
  Download,
  Upload,
  XCircle,
  CheckCircle,
  Copy
} from 'lucide-react';

interface EnvironmentVariable {
  key: string;
  value: string;
  type: 'public' | 'secret' | 'system';
  description: string;
  category: 'auth' | 'database' | 'api' | 'deployment' | 'features' | 'monitoring';
  isModified: boolean;
  lastUpdated: string;
}

interface EnvironmentManagerProps {
  isVisible: boolean;
}

const EnvironmentManager: React.FC<EnvironmentManagerProps> = ({ isVisible }) => {
  const [variables, setVariables] = useState<EnvironmentVariable[]>([]);
  const [filteredVariables, setFilteredVariables] = useState<EnvironmentVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showSecrets, setShowSecrets] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadEnvironmentVariables();
    }
  }, [isVisible]);

  useEffect(() => {
    filterVariables();
  }, [variables, searchTerm, categoryFilter, typeFilter]);

  useEffect(() => {
    setHasChanges(variables.some(v => v.isModified));
  }, [variables]);

  const loadEnvironmentVariables = async () => {
    setLoading(true);
    try {
      // Mock environment variables - in real implementation, fetch from secure API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVariables: EnvironmentVariable[] = [
        {
          key: 'VITE_SUPABASE_URL',
          value: 'https://xxxxxxxx.supabase.co',
          type: 'public',
          description: 'Supabase project URL for database connections',
          category: 'database',
          isModified: false,
          lastUpdated: '2024-01-16T10:30:00Z'
        },
        {
          key: 'VITE_SUPABASE_ANON_KEY',
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          type: 'secret',
          description: 'Supabase anonymous key for client-side operations',
          category: 'database',
          isModified: false,
          lastUpdated: '2024-01-16T10:30:00Z'
        },
        {
          key: 'GITHUB_CLIENT_ID',
          value: 'Iv1.xxxxxxxxxxxx',
          type: 'secret',
          description: 'GitHub OAuth application client ID',
          category: 'auth',
          isModified: false,
          lastUpdated: '2024-01-15T14:20:00Z'
        },
        {
          key: 'GITHUB_CLIENT_SECRET',
          value: '••••••••••••••••••••••••••••••••••••••••',
          type: 'secret',
          description: 'GitHub OAuth application client secret',
          category: 'auth',
          isModified: false,
          lastUpdated: '2024-01-15T14:20:00Z'
        },
        {
          key: 'GOOGLE_CLOUD_API_KEY',
          value: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx',
          type: 'secret',
          description: 'Google Cloud API key for analytics and services',
          category: 'api',
          isModified: false,
          lastUpdated: '2024-01-16T09:15:00Z'
        },
        {
          key: 'VITE_ENVIRONMENT',
          value: 'production',
          type: 'public',
          description: 'Current deployment environment',
          category: 'deployment',
          isModified: false,
          lastUpdated: '2024-01-16T12:00:00Z'
        },
        {
          key: 'VITE_TURNSTILE_SITE_KEY',
          value: '0x4AAAAAABlo_LdXn1ErLBXD',
          type: 'public',
          description: 'Cloudflare Turnstile site key for bot protection',
          category: 'features',
          isModified: false,
          lastUpdated: '2024-01-14T16:45:00Z'
        },
        {
          key: 'JWT_SECRET',
          value: '••••••••••••••••••••••••••••••••••••••••',
          type: 'secret',
          description: 'JWT signing secret for authentication tokens',
          category: 'auth',
          isModified: false,
          lastUpdated: '2024-01-13T11:30:00Z'
        },
        {
          key: 'PAYPAL_CLIENT_ID',
          value: 'AYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          type: 'secret',
          description: 'PayPal client ID for payment processing',
          category: 'api',
          isModified: false,
          lastUpdated: '2024-01-12T13:20:00Z'
        },
        {
          key: 'SQUARE_ACCESS_TOKEN',
          value: '••••••••••••••••••••••••••••••••••••••••',
          type: 'secret',
          description: 'Square access token for payment processing',
          category: 'api',
          isModified: false,
          lastUpdated: '2024-01-12T13:20:00Z'
        }
      ];
      
      setVariables(mockVariables);
    } catch (error) {
      console.error('Error loading environment variables:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVariables = () => {
    const filtered = variables.filter(variable => {
      const matchesSearch = variable.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           variable.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || variable.category === categoryFilter;
      const matchesType = typeFilter === 'all' || variable.type === typeFilter;
      
      return matchesSearch && matchesCategory && matchesType;
    });

    setFilteredVariables(filtered);
  };

  const updateVariable = (key: string, newValue: string) => {
    setVariables(prev => prev.map(variable => 
      variable.key === key 
        ? { ...variable, value: newValue, isModified: true }
        : variable
    ));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      // Mock API call to save environment variables
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVariables(prev => prev.map(variable => ({
        ...variable,
        isModified: false,
        lastUpdated: new Date().toISOString()
      })));
      
      alert('Environment variables saved successfully! Changes will take effect after deployment.');
    } catch (error) {
      console.error('Error saving environment variables:', error);
      alert('Failed to save environment variables. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => {
    if (confirm('Are you sure you want to discard all changes?')) {
      loadEnvironmentVariables();
    }
  };

  const exportVariables = () => {
    const exportData = filteredVariables.map(variable => ({
      key: variable.key,
      value: variable.type === 'secret' ? '[REDACTED]' : variable.value,
      type: variable.type,
      category: variable.category,
      description: variable.description
    }));
    
    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `environment_variables_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return Shield;
      case 'database': return Database;
      case 'api': return Key;
      case 'deployment': return Globe;
      case 'features': return Zap;
      case 'monitoring': return Settings;
      default: return Settings;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auth': return 'text-red-400 bg-red-400/20';
      case 'database': return 'text-blue-400 bg-blue-400/20';
      case 'api': return 'text-green-400 bg-green-400/20';
      case 'deployment': return 'text-purple-400 bg-purple-400/20';
      case 'features': return 'text-yellow-400 bg-yellow-400/20';
      case 'monitoring': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'secret': return 'text-red-400 bg-red-400/20';
      case 'public': return 'text-green-400 bg-green-400/20';
      case 'system': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show temporary success feedback
      console.log('Copied to clipboard');
    });
  };

  if (!isVisible) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-lg text-white">Loading environment variables...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Settings className="h-7 w-7 mr-2 text-purple-400" />
            Environment Variable Manager
          </h2>
          <p className="text-slate-300 mt-1">
            Manage application configuration and secrets
            {hasChanges && <span className="ml-3 text-yellow-400">• Unsaved changes</span>}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={discardChanges}
                className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
              >
                <XCircle className="h-4 w-4" />
                <span>Discard</span>
              </button>
              <button 
                onClick={saveChanges}
                disabled={saving}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
          <button 
            onClick={exportVariables}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Security Warning */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-red-400 font-semibold">SuperAdmin Security Notice</h3>
            <p className="text-red-300 text-sm mt-1">
              You are viewing sensitive environment variables. All changes are logged for security audit.
              Only modify values if you understand the implications for system security and functionality.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search variables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            <option value="auth">Authentication</option>
            <option value="database">Database</option>
            <option value="api">API Keys</option>
            <option value="deployment">Deployment</option>
            <option value="features">Features</option>
            <option value="monitoring">Monitoring</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="public">Public</option>
            <option value="secret">Secret</option>
            <option value="system">System</option>
          </select>

          <button
            onClick={() => setShowSecrets(!showSecrets)}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              showSecrets 
                ? 'bg-red-600 hover:bg-red-500 text-white' 
                : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300'
            }`}
          >
            {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showSecrets ? 'Hide Secrets' : 'Show Secrets'}</span>
          </button>

          <button
            onClick={loadEnvironmentVariables}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Variables List */}
      <div className="space-y-4">
        {filteredVariables.map((variable) => {
          const CategoryIcon = getCategoryIcon(variable.category);
          const isSecret = variable.type === 'secret';
          const shouldMaskValue = isSecret && !showSecrets;
          
          return (
            <div 
              key={variable.key} 
              className={`bg-slate-800/60 backdrop-blur-sm border rounded-xl p-4 transition-all ${
                variable.isModified 
                  ? 'border-yellow-500/50 bg-yellow-900/10' 
                  : 'border-slate-600/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <CategoryIcon className="h-5 w-5 text-slate-400" />
                  <div>
                    <h3 className="text-white font-medium">{variable.key}</h3>
                    <p className="text-slate-400 text-sm">{variable.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(variable.category)}`}>
                    {variable.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(variable.type)}`}>
                    {variable.type}
                  </span>
                  {variable.isModified && (
                    <span className="text-xs px-2 py-1 rounded-full text-yellow-400 bg-yellow-400/20">
                      modified
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type={shouldMaskValue ? 'password' : 'text'}
                    value={variable.value}
                    onChange={(e) => updateVariable(variable.key, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter value..."
                  />
                  {isSecret && (
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-400" />
                  )}
                </div>
                <button
                  onClick={() => copyToClipboard(variable.value)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mt-2 text-xs text-slate-500">
                Last updated: {new Date(variable.lastUpdated).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {filteredVariables.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No Variables Found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default EnvironmentManager;
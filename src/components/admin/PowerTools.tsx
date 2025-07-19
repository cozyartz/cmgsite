import React, { useState } from 'react';
import {
  Zap,
  Database,
  Users,
  FileText,
  Settings,
  Shield,
  RefreshCw,
  Terminal,
  Key,
  Globe,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PowerToolsProps {
  isVisible: boolean;
}

const PowerTools: React.FC<PowerToolsProps> = ({ isVisible }) => {
  const [activeCategory, setActiveCategory] = useState<string>('database');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const categories = [
    { id: 'database', label: 'Database Operations', icon: Database },
    { id: 'cache', label: 'Cache Management', icon: RefreshCw },
    { id: 'security', label: 'Security Tools', icon: Shield },
    { id: 'system', label: 'System Utilities', icon: Terminal },
    { id: 'migrations', label: 'Data Migrations', icon: Upload }
  ];

  const executeAction = async (action: string, params?: any) => {
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      switch (action) {
        case 'vacuum_database':
          // Optimize database
          await supabase.rpc('vacuum_database');
          setExecutionResult({
            success: true,
            message: 'Database optimized successfully'
          });
          break;

        case 'clear_cache':
          // Clear application cache
          localStorage.clear();
          sessionStorage.clear();
          setExecutionResult({
            success: true,
            message: 'Cache cleared successfully'
          });
          break;

        case 'reset_user_sessions':
          // Reset all user sessions
          await supabase.rpc('reset_all_sessions');
          setExecutionResult({
            success: true,
            message: 'All user sessions reset'
          });
          break;

        case 'regenerate_api_keys':
          // Regenerate API keys
          await supabase.rpc('regenerate_api_keys');
          setExecutionResult({
            success: true,
            message: 'API keys regenerated successfully'
          });
          break;

        case 'backup_database':
          // Trigger database backup
          await supabase.rpc('create_backup');
          setExecutionResult({
            success: true,
            message: 'Database backup initiated'
          });
          break;

        case 'analyze_tables':
          // Analyze database tables
          await supabase.rpc('analyze_all_tables');
          setExecutionResult({
            success: true,
            message: 'Table analysis completed'
          });
          break;

        default:
          setExecutionResult({
            success: false,
            message: 'Unknown action'
          });
      }
    } catch (error) {
      console.error('Power tool execution error:', error);
      setExecutionResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const renderDatabaseTools = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-400" />
            Database Optimization
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Optimize database performance by reclaiming space and updating statistics.
        </p>
        <button
          onClick={() => executeAction('vacuum_database')}
          disabled={isExecuting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isExecuting ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin w-4 h-4 mr-2" />
              Running...
            </span>
          ) : (
            'Run VACUUM'
          )}
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 text-green-400" />
            Table Analysis
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Update table statistics for improved query planning and performance.
        </p>
        <button
          onClick={() => executeAction('analyze_tables')}
          disabled={isExecuting}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Analyze Tables
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <Download className="w-5 h-5 mr-2 text-purple-400" />
            Database Backup
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Create a backup of the entire database for disaster recovery.
        </p>
        <button
          onClick={() => executeAction('backup_database')}
          disabled={isExecuting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Create Backup
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <FileText className="w-5 h-5 mr-2 text-orange-400" />
            Export Schema
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Export complete database schema for documentation or migration.
        </p>
        <button
          onClick={() => executeAction('export_schema')}
          disabled={isExecuting}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Export Schema
        </button>
      </div>
    </div>
  );

  const renderCacheTools = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <Trash2 className="w-5 h-5 mr-2 text-red-400" />
            Clear Application Cache
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Clear all browser cache including localStorage and sessionStorage.
        </p>
        <button
          onClick={() => executeAction('clear_cache')}
          disabled={isExecuting}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Clear Cache
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-400" />
            Clear CDN Cache
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Purge Cloudflare CDN cache to force refresh of static assets.
        </p>
        <button
          onClick={() => executeAction('clear_cdn_cache')}
          disabled={isExecuting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Purge CDN
        </button>
      </div>
    </div>
  );

  const renderSecurityTools = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <Lock className="w-5 h-5 mr-2 text-yellow-400" />
            Reset User Sessions
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Force logout all users by invalidating their sessions.
        </p>
        <button
          onClick={() => executeAction('reset_user_sessions')}
          disabled={isExecuting}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Reset Sessions
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <Key className="w-5 h-5 mr-2 text-purple-400" />
            Regenerate API Keys
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Regenerate all API keys for enhanced security.
        </p>
        <button
          onClick={() => executeAction('regenerate_api_keys')}
          disabled={isExecuting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Regenerate Keys
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            Security Audit
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Run comprehensive security audit and generate report.
        </p>
        <button
          onClick={() => executeAction('security_audit')}
          disabled={isExecuting}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Run Audit
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
            Block Suspicious IPs
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Review and block IP addresses showing suspicious activity.
        </p>
        <button
          onClick={() => executeAction('manage_blocked_ips')}
          disabled={isExecuting}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Manage IPs
        </button>
      </div>
    </div>
  );

  const renderSystemTools = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <Terminal className="w-5 h-5 mr-2 text-cyan-400" />
            System Diagnostics
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Run diagnostics to check system health and performance.
        </p>
        <button
          onClick={() => executeAction('run_diagnostics')}
          disabled={isExecuting}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Run Diagnostics
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <Settings className="w-5 h-5 mr-2 text-indigo-400" />
            Reindex Search
          </h4>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Rebuild search indexes for improved search performance.
        </p>
        <button
          onClick={() => executeAction('reindex_search')}
          disabled={isExecuting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Reindex
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'database':
        return renderDatabaseTools();
      case 'cache':
        return renderCacheTools();
      case 'security':
        return renderSecurityTools();
      case 'system':
        return renderSystemTools();
      default:
        return <div>Select a category</div>;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Zap className="w-8 h-8 mr-3 text-purple-400" />
          SuperAdmin Power Tools
        </h2>
        <p className="text-slate-300 mt-2">
          Advanced tools for system maintenance, optimization, and security management.
        </p>
      </div>

      {/* Category Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              activeCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <category.icon className="w-4 h-4" />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Execution Result */}
      {executionResult && (
        <div className={`rounded-lg p-4 flex items-center space-x-3 ${
          executionResult.success 
            ? 'bg-green-900/20 border border-green-500/30' 
            : 'bg-red-900/20 border border-red-500/30'
        }`}>
          {executionResult.success ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <span className={executionResult.success ? 'text-green-400' : 'text-red-400'}>
            {executionResult.message}
          </span>
        </div>
      )}

      {/* Tool Content */}
      <div>
        {renderContent()}
      </div>

      {/* Warning Message */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-400">Caution</h4>
            <p className="text-sm text-yellow-300/80 mt-1">
              These tools perform system-wide operations. Always ensure you have recent backups before executing any actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerTools;
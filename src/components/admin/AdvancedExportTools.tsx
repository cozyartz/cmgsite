import React, { useState, useEffect } from 'react';
import {
  Download,
  Filter,
  Calendar,
  FileText,
  Database,
  Settings,
  CheckCircle,
  XCircle,
  Mail,
  Clock,
  BarChart3,
  Users,
  DollarSign,
  Activity,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

interface ExportField {
  key: string;
  label: string;
  category: 'user' | 'analytics' | 'financial' | 'system' | 'security';
  description: string;
  selected: boolean;
}

interface ExportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in_last';
  value: string | number;
  secondValue?: string | number; // For 'between' operator
}

interface ScheduledExport {
  id: string;
  name: string;
  format: string;
  schedule: string;
  filters: ExportFilter[];
  fields: string[];
  lastRun: string;
  nextRun: string;
  status: 'active' | 'paused' | 'error';
  emailRecipients: string[];
}

interface AdvancedExportToolsProps {
  isVisible: boolean;
}

const AdvancedExportTools: React.FC<AdvancedExportToolsProps> = ({ isVisible }) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'excel' | 'pdf'>('csv');
  const [selectedFields, setSelectedFields] = useState<ExportField[]>([]);
  const [filters, setFilters] = useState<ExportFilter[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exportName, setExportName] = useState('');
  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const availableFields: ExportField[] = [
    // User data fields
    { key: 'user_id', label: 'User ID', category: 'user', description: 'Unique user identifier', selected: true },
    { key: 'user_name', label: 'User Name', category: 'user', description: 'Full name of the user', selected: true },
    { key: 'user_email', label: 'Email Address', category: 'user', description: 'User email address', selected: true },
    { key: 'user_plan', label: 'Subscription Plan', category: 'user', description: 'Current subscription tier', selected: true },
    { key: 'user_status', label: 'Account Status', category: 'user', description: 'Active, suspended, cancelled', selected: true },
    { key: 'user_join_date', label: 'Join Date', category: 'user', description: 'Account creation date', selected: false },
    { key: 'user_last_login', label: 'Last Login', category: 'user', description: 'Most recent login timestamp', selected: false },
    { key: 'user_provider', label: 'Auth Provider', category: 'user', description: 'GitHub, Google, Email', selected: false },
    
    // Analytics fields
    { key: 'ai_calls_used', label: 'AI Calls Used', category: 'analytics', description: 'Total AI API calls made', selected: false },
    { key: 'ai_calls_limit', label: 'AI Calls Limit', category: 'analytics', description: 'Monthly AI call limit', selected: false },
    { key: 'page_views', label: 'Page Views', category: 'analytics', description: 'Total page views', selected: false },
    { key: 'session_duration', label: 'Avg Session Duration', category: 'analytics', description: 'Average time spent per session', selected: false },
    { key: 'feature_usage', label: 'Feature Usage', category: 'analytics', description: 'Most used platform features', selected: false },
    { key: 'conversion_events', label: 'Conversion Events', category: 'analytics', description: 'Goal completions and conversions', selected: false },
    
    // Financial fields
    { key: 'total_spent', label: 'Total Revenue', category: 'financial', description: 'Lifetime customer value', selected: false },
    { key: 'monthly_revenue', label: 'Monthly Revenue', category: 'financial', description: 'Current month recurring revenue', selected: false },
    { key: 'payment_method', label: 'Payment Method', category: 'financial', description: 'Primary payment method', selected: false },
    { key: 'refunds', label: 'Refunds', category: 'financial', description: 'Total refunded amount', selected: false },
    { key: 'churn_risk', label: 'Churn Risk Score', category: 'financial', description: 'Predicted likelihood to cancel', selected: false },
    
    // System fields
    { key: 'api_usage', label: 'API Usage', category: 'system', description: 'API calls and rate limiting', selected: false },
    { key: 'storage_used', label: 'Storage Used', category: 'system', description: 'File storage consumption', selected: false },
    { key: 'bandwidth_used', label: 'Bandwidth Used', category: 'system', description: 'Data transfer usage', selected: false },
    { key: 'error_rate', label: 'Error Rate', category: 'system', description: 'API and system error frequency', selected: false },
    { key: 'performance_metrics', label: 'Performance Metrics', category: 'system', description: 'Response times and uptime', selected: false },
    
    // Security fields
    { key: 'login_attempts', label: 'Login Attempts', category: 'security', description: 'Failed and successful logins', selected: false },
    { key: 'ip_addresses', label: 'IP Addresses', category: 'security', description: 'Recent login IP addresses', selected: false },
    { key: 'security_events', label: 'Security Events', category: 'security', description: 'Security alerts and violations', selected: false },
    { key: 'two_factor_enabled', label: '2FA Status', category: 'security', description: 'Two-factor authentication status', selected: false }
  ];

  useEffect(() => {
    setSelectedFields(availableFields.filter(field => field.selected));
    loadScheduledExports();
  }, []);

  const loadScheduledExports = async () => {
    // Mock scheduled exports - in real implementation, fetch from API
    const mockScheduledExports: ScheduledExport[] = [
      {
        id: '1',
        name: 'Weekly User Report',
        format: 'excel',
        schedule: 'weekly',
        filters: [{ field: 'user_status', operator: 'equals', value: 'active' }],
        fields: ['user_name', 'user_email', 'user_plan', 'total_spent'],
        lastRun: '2024-01-15T10:00:00Z',
        nextRun: '2024-01-22T10:00:00Z',
        status: 'active',
        emailRecipients: ['admin@cozyartzmedia.com']
      },
      {
        id: '2',
        name: 'Monthly Revenue Analysis',
        format: 'pdf',
        schedule: 'monthly',
        filters: [{ field: 'total_spent', operator: 'greater_than', value: 0 }],
        fields: ['user_name', 'total_spent', 'monthly_revenue', 'payment_method'],
        lastRun: '2024-01-01T09:00:00Z',
        nextRun: '2024-02-01T09:00:00Z',
        status: 'active',
        emailRecipients: ['finance@cozyartzmedia.com', 'admin@cozyartzmedia.com']
      }
    ];
    
    setScheduledExports(mockScheduledExports);
  };

  const filteredFields = availableFields.filter(field => 
    categoryFilter === 'all' || field.category === categoryFilter
  );

  const toggleField = (fieldKey: string) => {
    setSelectedFields(prev => {
      const field = availableFields.find(f => f.key === fieldKey);
      if (!field) return prev;
      
      const isSelected = prev.some(f => f.key === fieldKey);
      if (isSelected) {
        return prev.filter(f => f.key !== fieldKey);
      } else {
        return [...prev, field];
      }
    });
  };

  const addFilter = () => {
    setFilters(prev => [...prev, {
      field: 'user_status',
      operator: 'equals',
      value: ''
    }]);
  };

  const updateFilter = (index: number, updates: Partial<ExportFilter>) => {
    setFilters(prev => prev.map((filter, i) => 
      i === index ? { ...filter, ...updates } : filter
    ));
  };

  const removeFilter = (index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  };

  const generateExport = async () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field to export');
      return;
    }

    setExporting(true);
    
    try {
      // Simulate export generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = await generateExportData();
      downloadExport(exportData);
      
      alert('Export generated successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to generate export. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const generateExportData = async () => {
    // Mock data generation based on selected fields and filters
    const mockData = Array.from({ length: 100 }, (_, i) => {
      const record: any = {};
      
      selectedFields.forEach(field => {
        switch (field.key) {
          case 'user_id':
            record[field.label] = `user_${i + 1}`;
            break;
          case 'user_name':
            record[field.label] = `User ${i + 1}`;
            break;
          case 'user_email':
            record[field.label] = `user${i + 1}@example.com`;
            break;
          case 'user_plan':
            record[field.label] = ['starter', 'growth', 'enterprise'][i % 3];
            break;
          case 'user_status':
            record[field.label] = ['active', 'suspended', 'pending'][i % 3];
            break;
          case 'total_spent':
            record[field.label] = Math.floor(Math.random() * 1000) + 50;
            break;
          case 'ai_calls_used':
            record[field.label] = Math.floor(Math.random() * 5000);
            break;
          default:
            record[field.label] = `Sample data ${i + 1}`;
        }
      });
      
      return record;
    });

    return mockData;
  };

  const downloadExport = (data: any[]) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${exportName || 'export'}_${timestamp}`;
    
    switch (selectedFormat) {
      case 'csv':
        downloadCSV(data, filename);
        break;
      case 'json':
        downloadJSON(data, filename);
        break;
      case 'excel':
        alert('Excel export would be generated here (requires additional library)');
        break;
      case 'pdf':
        alert('PDF export would be generated here (requires additional library)');
        break;
    }
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user': return Users;
      case 'analytics': return BarChart3;
      case 'financial': return DollarSign;
      case 'system': return Activity;
      case 'security': return Shield;
      default: return Database;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'user': return 'text-blue-400 bg-blue-400/20';
      case 'analytics': return 'text-green-400 bg-green-400/20';
      case 'financial': return 'text-yellow-400 bg-yellow-400/20';
      case 'system': return 'text-purple-400 bg-purple-400/20';
      case 'security': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Download className="h-7 w-7 mr-2 text-purple-400" />
            Advanced Export Tools
          </h2>
          <p className="text-slate-300 mt-1">
            Create custom exports with filters, scheduling, and multiple formats
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Export Format and Name */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-purple-400" />
              Export Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Export Name</label>
                <input
                  type="text"
                  value={exportName}
                  onChange={(e) => setExportName(e.target.value)}
                  placeholder="Custom export name..."
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="csv">CSV (Excel compatible)</option>
                  <option value="json">JSON (API format)</option>
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="pdf">PDF Report</option>
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Field Selection */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Database className="h-5 w-5 mr-2 text-purple-400" />
                Data Fields ({selectedFields.length} selected)
              </h3>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                <option value="user">User Data</option>
                <option value="analytics">Analytics</option>
                <option value="financial">Financial</option>
                <option value="system">System</option>
                <option value="security">Security</option>
              </select>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredFields.map((field) => {
                const CategoryIcon = getCategoryIcon(field.category);
                const isSelected = selectedFields.some(f => f.key === field.key);
                
                return (
                  <div
                    key={field.key}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-900/30 border-purple-500/50' 
                        : 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-600/30'
                    }`}
                    onClick={() => toggleField(field.key)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleField(field.key)}
                      className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                    />
                    <CategoryIcon className="h-4 w-4 text-slate-400" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{field.label}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(field.category)}`}>
                          {field.category}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{field.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Filter className="h-5 w-5 mr-2 text-purple-400" />
                Data Filters ({filters.length})
              </h3>
              <button
                onClick={addFilter}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors"
              >
                Add Filter
              </button>
            </div>
            
            {filters.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No filters applied - all data will be exported</p>
            ) : (
              <div className="space-y-3">
                {filters.map((filter, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <select
                      value={filter.field}
                      onChange={(e) => updateFilter(index, { field: e.target.value })}
                      className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm"
                    >
                      {availableFields.map(field => (
                        <option key={field.key} value={field.key}>{field.label}</option>
                      ))}
                    </select>
                    
                    <select
                      value={filter.operator}
                      onChange={(e) => updateFilter(index, { operator: e.target.value as any })}
                      className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm"
                    >
                      <option value="equals">Equals</option>
                      <option value="contains">Contains</option>
                      <option value="greater_than">Greater Than</option>
                      <option value="less_than">Less Than</option>
                      <option value="between">Between</option>
                      <option value="in_last">In Last</option>
                    </select>
                    
                    <input
                      type="text"
                      value={filter.value}
                      onChange={(e) => updateFilter(index, { value: e.target.value })}
                      placeholder="Value..."
                      className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm"
                    />
                    
                    <button
                      onClick={() => removeFilter(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Export Actions */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Ready to export {selectedFields.length} fields with {filters.length} filters
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Clock className="h-4 w-4" />
                  <span>Schedule</span>
                </button>
                
                <button
                  onClick={generateExport}
                  disabled={exporting || selectedFields.length === 0}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center space-x-2 transition-colors"
                >
                  {exporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Export Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Exports */}
        <div className="space-y-6">
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-400" />
              Scheduled Exports
            </h3>
            
            {scheduledExports.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No scheduled exports</p>
            ) : (
              <div className="space-y-3">
                {scheduledExports.map((export_) => (
                  <div key={export_.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{export_.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        export_.status === 'active' ? 'text-green-400 bg-green-400/20' :
                        export_.status === 'paused' ? 'text-yellow-400 bg-yellow-400/20' :
                        'text-red-400 bg-red-400/20'
                      }`}>
                        {export_.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 space-y-1">
                      <div>Format: {export_.format.toUpperCase()}</div>
                      <div>Schedule: {export_.schedule}</div>
                      <div>Next run: {new Date(export_.nextRun).toLocaleDateString()}</div>
                      <div>Recipients: {export_.emailRecipients.length}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Export Templates */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-400" />
              Quick Templates
            </h3>
            
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-lg border border-slate-600/30 transition-colors">
                <div className="text-white font-medium">Active Users Report</div>
                <div className="text-slate-400 text-sm">User data for active subscribers</div>
              </button>
              
              <button className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-lg border border-slate-600/30 transition-colors">
                <div className="text-white font-medium">Revenue Analysis</div>
                <div className="text-slate-400 text-sm">Financial metrics and billing data</div>
              </button>
              
              <button className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-lg border border-slate-600/30 transition-colors">
                <div className="text-white font-medium">System Performance</div>
                <div className="text-slate-400 text-sm">API usage and system metrics</div>
              </button>
              
              <button className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-lg border border-slate-600/30 transition-colors">
                <div className="text-white font-medium">Security Audit</div>
                <div className="text-slate-400 text-sm">Login attempts and security events</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-600/50 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Schedule Export</h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Schedule Name</label>
                <input
                  type="text"
                  placeholder="Weekly user report..."
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">Frequency</label>
                <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email Recipients</label>
                <input
                  type="email"
                  placeholder="admin@cozyartzmedia.com"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedExportTools;
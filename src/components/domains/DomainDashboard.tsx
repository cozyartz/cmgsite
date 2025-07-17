import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Settings, 
  TrendingUp, 
  Shield, 
  RefreshCw, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Calendar
} from 'lucide-react';

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'expired' | 'transferring';
  registrar: string;
  expiresAt: string;
  autoRenew: boolean;
  dnsProvider: string;
  sslStatus: 'active' | 'pending' | 'expired';
  monthlyRevenue: number;
  seoScore: number;
  lastUpdated: string;
  managementFee: number;
  nextBilling: string;
}

interface DomainDashboardProps {
  clientId?: string;
}

const DomainDashboard: React.FC<DomainDashboardProps> = ({ clientId }) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  useEffect(() => {
    loadDomains();
  }, [clientId]);

  const loadDomains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/domains/list${clientId ? `?clientId=${clientId}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load domains');
      }

      const data = await response.json();
      setDomains(data.domains || []);
    } catch (error) {
      console.error('Error loading domains:', error);
      // Mock data for demo
      setDomains([
        {
          id: '1',
          name: 'example.com',
          status: 'active',
          registrar: 'Cloudflare',
          expiresAt: '2025-12-15T00:00:00Z',
          autoRenew: true,
          dnsProvider: 'Cloudflare',
          sslStatus: 'active',
          monthlyRevenue: 1250.00,
          seoScore: 85,
          lastUpdated: '2025-01-15T10:30:00Z',
          managementFee: 25.00,
          nextBilling: '2025-02-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'startup.io',
          status: 'active',
          registrar: 'Cloudflare',
          expiresAt: '2025-08-22T00:00:00Z',
          autoRenew: true,
          dnsProvider: 'Cloudflare',
          sslStatus: 'active',
          monthlyRevenue: 850.00,
          seoScore: 78,
          lastUpdated: '2025-01-14T15:45:00Z',
          managementFee: 25.00,
          nextBilling: '2025-02-01T00:00:00Z'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDomain = async (domainId: string) => {
    setRefreshing(domainId);
    try {
      const response = await fetch(`/api/domains/${domainId}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        await loadDomains();
      }
    } catch (error) {
      console.error('Error refreshing domain:', error);
    } finally {
      setRefreshing(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'expired': return 'text-red-600 bg-red-50';
      case 'transferring': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      case 'transferring': return <RefreshCw className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalRevenue = domains.reduce((sum, domain) => sum + domain.monthlyRevenue, 0);
  const totalManagementFees = domains.reduce((sum, domain) => sum + domain.managementFee, 0);
  const activeDomains = domains.filter(d => d.status === 'active').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-teal-600" />
        <span className="ml-3 text-lg text-gray-600">Loading domains...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Domain Management</h1>
          <p className="text-gray-600 mt-2">Manage your domains and track performance</p>
        </div>
        <button
          onClick={() => window.location.href = '/domains/search'}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
        >
          Add Domain
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Domains</p>
              <p className="text-2xl font-bold text-gray-900">{activeDomains}</p>
            </div>
            <Globe className="w-8 h-8 text-teal-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Management Fees</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalManagementFees)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg SEO Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(domains.reduce((sum, d) => sum + d.seoScore, 0) / domains.length || 0)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Domains List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Domains</h2>
        </div>

        {domains.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No domains yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first domain</p>
            <button
              onClick={() => window.location.href = '/domains/search'}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
            >
              Search Domains
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {domains.map((domain) => {
              const daysUntilExpiry = getDaysUntilExpiry(domain.expiresAt);
              const isExpiringSoon = daysUntilExpiry <= 30;

              return (
                <div key={domain.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{domain.name}</h3>
                        
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(domain.status)}`}>
                          {getStatusIcon(domain.status)}
                          <span className="capitalize">{domain.status}</span>
                        </div>

                        {domain.sslStatus === 'active' && (
                          <div className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                            <Shield className="w-3 h-3" />
                            <span>SSL Active</span>
                          </div>
                        )}

                        {isExpiringSoon && (
                          <div className="flex items-center space-x-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                            <AlertCircle className="w-3 h-3" />
                            <span>Expires in {daysUntilExpiry} days</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Registrar:</span>
                          <p className="font-medium">{domain.registrar}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Expires:</span>
                          <p className="font-medium">{formatDate(domain.expiresAt)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Monthly Revenue:</span>
                          <p className="font-medium text-green-600">{formatCurrency(domain.monthlyRevenue)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Management Fee:</span>
                          <p className="font-medium">{formatCurrency(domain.managementFee)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">SEO Score:</span>
                          <p className={`font-medium ${getSEOScoreColor(domain.seoScore)}`}>
                            {domain.seoScore}/100
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Auto-Renew:</span>
                          <p className="font-medium">{domain.autoRenew ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-6">
                      <button
                        onClick={() => refreshDomain(domain.id)}
                        disabled={refreshing === domain.id}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Refresh domain status"
                      >
                        <RefreshCw className={`w-5 h-5 ${refreshing === domain.id ? 'animate-spin' : ''}`} />
                      </button>

                      <button
                        onClick={() => setSelectedDomain(domain)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Domain settings"
                      >
                        <Settings className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => window.open(`https://${domain.name}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Visit domain"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Renewal Reminders</h3>
          </div>
          <p className="text-gray-600 mb-4">
            We'll automatically remind you 30, 14, and 7 days before domain expiration.
          </p>
          <button className="text-teal-600 hover:text-teal-700 font-medium">
            Manage Notifications →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">SEO Optimization</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Get detailed SEO analysis and recommendations for all your domains.
          </p>
          <button className="text-teal-600 hover:text-teal-700 font-medium">
            View SEO Reports →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Manage SSL certificates, DNS security, and protection settings.
          </p>
          <button className="text-teal-600 hover:text-teal-700 font-medium">
            Security Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DomainDashboard;
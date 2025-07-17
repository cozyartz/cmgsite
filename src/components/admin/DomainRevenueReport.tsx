import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Globe, 
  Calendar, 
  Download, 
  Filter,
  BarChart3,
  PieChart,
  Users
} from 'lucide-react';

interface RevenueData {
  daily: Array<{
    date: string;
    total_revenue: number;
    transaction_count: number;
    type: 'setup' | 'monthly' | 'transfer' | 'renewal';
  }>;
  totals: {
    setup: number;
    monthly: number;
    transfer: number;
    renewal: number;
    total: number;
  };
  clients: Array<{
    client_id: string;
    client_name: string;
    domains_count: number;
    total_revenue: number;
    package_types: string[];
  }>;
  packages: Array<{
    package_type: string;
    count: number;
    revenue: number;
  }>;
}

interface DomainRevenueReportProps {
  isAdmin?: boolean;
}

const DomainRevenueReport: React.FC<DomainRevenueReportProps> = ({ isAdmin = false }) => {
  const [data, setData] = useState<RevenueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedPackage, setSelectedPackage] = useState('all');

  useEffect(() => {
    loadRevenueData();
  }, [dateRange, selectedPackage]);

  const loadRevenueData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/domains/revenue?range=${dateRange}&package=${selectedPackage}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load revenue data');
      }

      const revenueData = await response.json();
      setData(revenueData);
    } catch (error) {
      console.error('Error loading revenue data:', error);
      // Mock data for demo
      setData({
        daily: [
          { date: '2025-01-15', total_revenue: 1250.00, transaction_count: 5, type: 'setup' },
          { date: '2025-01-14', total_revenue: 850.00, transaction_count: 3, type: 'monthly' },
          { date: '2025-01-13', total_revenue: 450.00, transaction_count: 2, type: 'setup' },
        ],
        totals: {
          setup: 12500.00,
          monthly: 8500.00,
          transfer: 1200.00,
          renewal: 3400.00,
          total: 25600.00
        },
        clients: [
          {
            client_id: '1',
            client_name: 'TechStart Inc',
            domains_count: 3,
            total_revenue: 850.00,
            package_types: ['pro', 'enterprise']
          },
          {
            client_id: '2', 
            client_name: 'Local Restaurant',
            domains_count: 1,
            total_revenue: 325.00,
            package_types: ['basic']
          }
        ],
        packages: [
          { package_type: 'basic', count: 15, revenue: 4500.00 },
          { package_type: 'pro', count: 8, revenue: 12800.00 },
          { package_type: 'enterprise', count: 3, revenue: 8300.00 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const exportReport = () => {
    if (!data) return;

    const csvContent = [
      'Date,Revenue Type,Amount,Transactions',
      ...data.daily.map(row => 
        `${row.date},${row.type},${row.total_revenue},${row.transaction_count}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `domain-revenue-${dateRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <span className="ml-3 text-lg text-gray-600">Loading revenue data...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No revenue data</h3>
        <p className="text-gray-600">Domain revenue tracking will appear here</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Domain Revenue Report</h1>
          <p className="text-gray-600 mt-2">Track commission earnings from domain services</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          {/* Package Filter */}
          <select
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All packages</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <button
            onClick={exportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totals.total)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Setup Fees</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totals.setup)}</p>
            </div>
            <Globe className="w-8 h-8 text-teal-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Fees</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totals.monthly)}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transfers</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totals.transfer)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Renewals</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totals.renewal)}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts and Detailed Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Package Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Package Performance</h3>
            <PieChart className="w-6 h-6 text-teal-600" />
          </div>
          
          <div className="space-y-4">
            {data.packages.map((pkg) => {
              const percentage = (pkg.revenue / data.totals.total) * 100;
              return (
                <div key={pkg.package_type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: pkg.package_type === 'basic' ? '#10b981' : 
                                       pkg.package_type === 'pro' ? '#3b82f6' : '#8b5cf6'
                      }}
                    ></div>
                    <span className="font-medium capitalize">{pkg.package_type}</span>
                    <span className="text-sm text-gray-500">({pkg.count} domains)</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(pkg.revenue)}</p>
                    <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Top Clients</h3>
            <Users className="w-6 h-6 text-teal-600" />
          </div>
          
          <div className="space-y-4">
            {data.clients.slice(0, 5).map((client) => (
              <div key={client.client_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{client.client_name}</p>
                  <p className="text-sm text-gray-600">
                    {client.domains_count} domains • {client.package_types.join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(client.total_revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.daily.slice(0, 10).map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(row.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      row.type === 'setup' ? 'bg-green-100 text-green-800' :
                      row.type === 'monthly' ? 'bg-blue-100 text-blue-800' :
                      row.type === 'transfer' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(row.total_revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.transaction_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DomainRevenueReport;
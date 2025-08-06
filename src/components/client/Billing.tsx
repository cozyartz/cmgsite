import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SubscriptionManager from '../payment/SubscriptionManager';
import { apiService } from '../../lib/api';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface Invoice {
  id: string;
  amount: number;
  description: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidAt?: string;
  downloadUrl?: string;
}

interface UsageStats {
  aiCallsUsed: number;
  aiCallsLimit: number;
  overage: number;
  consultationHours: number;
  consultationCost: number;
}

const Billing: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const [invoicesData, usageData] = await Promise.all([
        apiService.call('/api/billing/invoices', { requireAuth: true }),
        apiService.call('/api/billing/usage', { requireAuth: true })
      ]);
      setInvoices(invoicesData);
      setUsageStats(usageData);
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockInvoices: Invoice[] = [
    {
      id: 'INV-2024-001',
      amount: 1050,
      description: 'SEO Platform Subscription + AI Overages',
      status: 'paid',
      dueDate: '2024-01-15',
      paidAt: '2024-01-12',
      downloadUrl: '/invoices/INV-2024-001.pdf'
    },
    {
      id: 'INV-2024-002',
      amount: 1250,
      description: 'Monthly Platform + Strategic Consultation',
      status: 'pending',
      dueDate: '2024-02-15'
    },
    {
      id: 'INV-2023-012',
      amount: 1000,
      description: 'SEO Platform Subscription',
      status: 'paid',
      dueDate: '2023-12-15',
      paidAt: '2023-12-10',
      downloadUrl: '/invoices/INV-2023-012.pdf'
    }
  ];

  const mockUsageStats: UsageStats = {
    aiCallsUsed: 0, // TODO: Implement usage tracking with new profile system
    aiCallsLimit: 1000, // TODO: Implement usage tracking with new profile system
    overage: 0, // TODO: Implement usage tracking with new profile system
    consultationHours: 6,
    consultationCost: 1200
  };

  const data = invoices.length > 0 ? invoices : mockInvoices;
  const usage = usageStats || mockUsageStats;

  const subscriptionPlans = [
    {
      name: 'Starter',
      price: 1000,
      aiCalls: 100,
      features: [
        'Basic AI tools',
        'Monthly analytics',
        'Email support',
        'Basic templates'
      ],
      current: false // TODO: Implement subscription tier tracking
    },
    {
      name: 'Growth',
      price: 1500,
      aiCalls: 250,
      features: [
        'Advanced AI tools',
        'Real-time analytics',
        'Priority support',
        'Custom templates',
        'Consultation discount'
      ],
      current: true // TODO: Implement subscription tier tracking
    },
    {
      name: 'Enterprise',
      price: 2500,
      aiCalls: 500,
      features: [
        'All AI tools',
        'Custom analytics',
        'Dedicated support',
        'White-label options',
        'Monthly consultation included'
      ],
      current: false // TODO: Implement subscription tier tracking
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'overdue': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const upgradePlan = async (planName: string) => {
    try {
      await apiService.call('/api/billing/upgrade', {
        method: 'POST',
        body: {
          plan: planName.toLowerCase(),
          userId: user?.id
        },
        requireAuth: true
      });

      setShowUpgradeModal(false);
      // Refresh data
      fetchBillingData();
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-800 p-6 rounded-lg">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'subscription', name: 'Subscription' },
    { id: 'invoices', name: 'Invoices' },
    { id: 'usage', name: 'Usage' }
  ];

  if (activeTab === 'subscription') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <SubscriptionManager />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing & Usage</h1>
          <p className="text-slate-400">Manage your subscription and view billing history</p>
        </div>
        <div className="flex items-center space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Current Plan</h3>
            <CreditCard className="h-5 w-5 text-teal-400" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-teal-400 capitalize">Growth</p>
            <p className="text-slate-400">
              $1,500/month
            </p>
            <p className="text-slate-400 text-sm">Next billing: Feb 15, 2024</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">AI Usage</h3>
            <Zap className="h-5 w-5 text-teal-400" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{usage.aiCallsUsed}/{usage.aiCallsLimit}</p>
            <p className="text-slate-400">AI calls this month</p>
            {usage.overage > 0 && (
              <p className="text-yellow-400 text-sm">
                {usage.overage} overage calls (+{formatCurrency(usage.overage * 0.5)})
              </p>
            )}
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className="bg-teal-500 h-2 rounded-full"
                style={{ width: `${Math.min((usage.aiCallsUsed / usage.aiCallsLimit) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Consultations</h3>
            <Calendar className="h-5 w-5 text-teal-400" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{usage.consultationHours}</p>
            <p className="text-slate-400">Hours this month</p>
            <p className="text-slate-400 text-sm">
              Total: {formatCurrency(usage.consultationCost)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Invoices</h3>
          <button className="text-teal-400 hover:text-teal-300 text-sm">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Invoice</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Due Date</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((invoice) => (
                <tr key={invoice.id} className="border-b border-slate-700/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-white font-medium">{invoice.id}</p>
                      <p className="text-slate-400 text-sm">{invoice.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white font-medium">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className={getStatusColor(invoice.status)}>
                        {getStatusIcon(invoice.status)}
                      </div>
                      <span className={`text-sm capitalize ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {invoice.downloadUrl && (
                        <button className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700">
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      {invoice.status === 'pending' && (
                        <button className="text-teal-400 hover:text-teal-300 text-sm">
                          Pay Now
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Summary */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">This Month's Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-400">
              $1,500
            </p>
            <p className="text-slate-400">Base Subscription</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-400">
              {formatCurrency(usage.overage * 0.5)}
            </p>
            <p className="text-slate-400">AI Overages</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-400">
              {formatCurrency(usage.consultationCost)}
            </p>
            <p className="text-slate-400">Consultations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-400">
              {formatCurrency(1500 + (usage.overage * 0.5) + usage.consultationCost)}
            </p>
            <p className="text-slate-400">Total This Month</p>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Upgrade Your Plan</h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`border rounded-lg p-6 ${
                    plan.current ? 'border-teal-400 bg-teal-400/10' : 'border-slate-600'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                    <p className="text-3xl font-bold text-teal-400 mt-2">
                      {formatCurrency(plan.price)}
                    </p>
                    <p className="text-slate-400">/month</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center">
                      <span className="text-white font-medium">{plan.aiCalls} AI calls</span>
                    </div>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-teal-400 mr-2" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => upgradePlan(plan.name)}
                    disabled={plan.current}
                    className={`w-full py-2 px-4 rounded-lg transition-colors ${
                      plan.current
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-teal-500 hover:bg-teal-600 text-white'
                    }`}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
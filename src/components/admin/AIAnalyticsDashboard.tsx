/**
 * AI Analytics Dashboard Component
 * Advanced analytics for AI chatbot performance and business insights
 */

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  TrendingUp, 
  DollarSign, 
  MessageCircle, 
  Users, 
  Clock,
  Target,
  Activity,
  Zap,
  PieChart,
  BarChart3,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import { apiService } from '../../lib/api';
import MCPAIIntegration from './MCPAIIntegration';

interface AIAnalyticsData {
  overview: {
    total_conversations: number;
    total_messages: number;
    avg_lead_score: number;
    conversion_rate: number;
    total_ai_cost: number;
    cost_per_conversion: number;
  };
  daily_stats: Array<{
    date: string;
    conversations: number;
    messages: number;
    leads_generated: number;
    ai_cost: number;
    avg_response_time: number;
  }>;
  model_performance: Array<{
    model_name: string;
    requests: number;
    success_rate: number;
    avg_tokens: number;
    total_cost: number;
    fallback_rate: number;
  }>;
  intent_analysis: Array<{
    intent: string;
    count: number;
    conversion_rate: number;
    avg_lead_score: number;
  }>;
  lead_quality: {
    high_intent_leads: number;
    qualified_leads: number;
    converted_leads: number;
    avg_conversation_length: number;
  };
  cost_breakdown: Array<{
    category: string;
    cost: number;
    percentage: number;
  }>;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}> = ({ title, value, change, changeType, icon: Icon, color }) => {
  const changeColor = changeType === 'positive' ? 'text-green-600' : 
                      changeType === 'negative' ? 'text-red-600' : 'text-gray-600';
  const ChangeIcon = changeType === 'positive' ? ArrowUp : 
                     changeType === 'negative' ? ArrowDown : null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${changeColor}`}>
              {ChangeIcon && <ChangeIcon className="w-4 h-4" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const AIAnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AIAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.call('/api/ai/analytics', {
        method: 'GET',
        params: { timeRange },
        requireAuth: true
      });

      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch AI analytics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      console.error('AI Analytics error:', err);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  if (loading && !data) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading AI analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 font-medium">Failed to load AI analytics</p>
          <p className="text-red-600 text-sm mt-2">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Bot className="w-8 h-8 text-purple-600" />
            AI Analytics Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Real-time insights into AI chatbot performance and lead generation
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {lastRefresh.toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Conversations"
          value={data.overview.total_conversations.toLocaleString()}
          icon={MessageCircle}
          color="bg-blue-600"
        />
        <StatCard
          title="Lead Conversion Rate"
          value={formatPercentage(data.overview.conversion_rate)}
          changeType="positive"
          change="+12.3% vs last period"
          icon={Target}
          color="bg-green-600"
        />
        <StatCard
          title="Avg Lead Score"
          value={data.overview.avg_lead_score.toFixed(1)}
          icon={TrendingUp}
          color="bg-purple-600"
        />
        <StatCard
          title="AI Cost"
          value={formatCurrency(data.overview.total_ai_cost)}
          changeType="positive"
          change={`${formatCurrency(data.overview.cost_per_conversion)}/conversion`}
          icon={DollarSign}
          color="bg-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            AI Model Performance
          </h3>
          <div className="space-y-4">
            {data.model_performance.map((model, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {model.model_name.replace('@cf/meta/', '')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {model.requests.toLocaleString()} requests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {formatPercentage(model.success_rate)} success
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(model.total_cost)}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${model.success_rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intent Analysis */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Conversation Intents
          </h3>
          <div className="space-y-3">
            {data.intent_analysis.map((intent, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {intent.intent.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {intent.count}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPercentage(intent.conversion_rate)} convert
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead Quality Metrics */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          Lead Quality & Conversion Pipeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.lead_quality.high_intent_leads}
            </div>
            <div className="text-sm text-gray-600 mt-1">High Intent Leads</div>
            <div className="text-xs text-gray-500">Score 60+</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {data.lead_quality.qualified_leads}
            </div>
            <div className="text-sm text-gray-600 mt-1">Qualified Leads</div>
            <div className="text-xs text-gray-500">Contact captured</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.lead_quality.converted_leads}
            </div>
            <div className="text-sm text-gray-600 mt-1">Converted</div>
            <div className="text-xs text-gray-500">Booked consultation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {data.lead_quality.avg_conversation_length.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Avg Messages</div>
            <div className="text-xs text-gray-500">Per conversation</div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-600" />
          AI Cost Breakdown
        </h3>
        <div className="space-y-3">
          {data.cost_breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {formatCurrency(item.cost)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          AI ROI Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              ${((data.lead_quality.converted_leads * 2500) - data.overview.total_ai_cost).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Estimated ROI</div>
            <div className="text-xs text-gray-500">Based on $2.5k avg project</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(data.overview.cost_per_conversion)}
            </div>
            <div className="text-sm text-gray-600">Cost Per Lead</div>
            <div className="text-xs text-gray-500">Including AI costs</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {((data.lead_quality.converted_leads * 2500) / data.overview.total_ai_cost).toFixed(1)}x
            </div>
            <div className="text-sm text-gray-600">Return Multiple</div>
            <div className="text-xs text-gray-500">Revenue vs AI cost</div>
          </div>
        </div>
      </div>

      {/* MCP Server Integration */}
      <MCPAIIntegration 
        mcpServerUrl="/Users/cozart-lundin/code/cozyartz-mcp-hub/dashboard"
        autoSync={true}
        syncInterval={15}
      />
    </div>
  );
};

export default AIAnalyticsDashboard;
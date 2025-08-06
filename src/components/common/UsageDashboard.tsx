import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AnalyticsService } from '../../lib/analytics';
import { TierService } from '../../lib/tiers';
import { 
  Zap, 
  TrendingUp, 
  Calendar, 
  Users, 
  Database,
  AlertTriangle,
  Crown,
  ArrowUp
} from 'lucide-react';

interface UsageDashboardProps {
  className?: string;
}

const UsageDashboard: React.FC<UsageDashboardProps> = ({ className = '' }) => {
  const { user, profile } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await AnalyticsService.getUserAnalytics(user.id, timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return (
      <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Usage Data</h3>
          <p className="text-slate-400">Start using AI features to see your analytics here.</p>
        </div>
      </div>
    );
  }

  const userTier = profile?.subscription_tier || 'free';
  const tierInfo = analytics.tierInfo;
  const usagePercentage = analytics.usagePercentage;
  const isUnlimited = analytics.usageLimit === -1;

  // Prepare chart data
  const dailyData = Object.entries(analytics.dailyUsage || {}).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    usage: count
  })).slice(-7); // Last 7 days

  const featureData = Object.entries(analytics.featureUsage || {}).map(([feature, count]) => ({
    name: feature.replace('_', ' ').toUpperCase(),
    value: count,
    percentage: ((count as number) / analytics.totalCalls * 100).toFixed(1)
  }));

  const getUsageColor = () => {
    if (isUnlimited) return 'text-green-400';
    if (usagePercentage >= 90) return 'text-red-400';
    if (usagePercentage >= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getUsageBarColor = () => {
    if (isUnlimited) return 'bg-green-500';
    if (usagePercentage >= 90) return 'bg-red-500';
    if (usagePercentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Usage Analytics</h2>
          <p className="text-slate-400">Track your AI usage and plan limits</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Upgrade Recommendation */}
      {analytics.recommendedUpgrade && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-orange-400" />
              <div>
                <h3 className="text-white font-medium">Upgrade Recommended</h3>
                <p className="text-slate-400 text-sm">
                  You're using {usagePercentage.toFixed(1)}% of your plan. Consider upgrading to {TierService.getTierLimits(analytics.recommendedUpgrade).displayName}.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <ArrowUp className="h-4 w-4" />
              <span>Upgrade</span>
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* AI Usage */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <span className={`text-sm font-medium ${getUsageColor()}`}>
              {isUnlimited ? 'Unlimited' : `${usagePercentage.toFixed(1)}%`}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-medium">AI Calls</h3>
            <p className="text-2xl font-bold text-white">
              {analytics.currentUsage}
              {!isUnlimited && <span className="text-slate-400 text-lg">/{analytics.usageLimit}</span>}
            </p>
            {!isUnlimited && (
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUsageBarColor()}`}
                  style={{ width: `${Math.min(100, usagePercentage)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-sm font-medium text-green-400">
              {analytics.successRate.toFixed(1)}%
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-medium">Success Rate</h3>
            <p className="text-2xl font-bold text-white">
              {analytics.successRate.toFixed(1)}%
            </p>
            <p className="text-slate-400 text-sm">
              {analytics.totalCalls} total calls
            </p>
          </div>
        </div>

        {/* Current Plan */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Crown className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-medium">Current Plan</h3>
            <p className="text-2xl font-bold text-white">{tierInfo.displayName}</p>
            <p className="text-slate-400 text-sm">
              ${tierInfo.price}/month
            </p>
          </div>
        </div>

        {/* Remaining Calls */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-medium">Remaining</h3>
            <p className="text-2xl font-bold text-white">
              {isUnlimited ? '∞' : analytics.remainingCalls}
            </p>
            <p className="text-slate-400 text-sm">
              {isUnlimited ? 'Unlimited calls' : 'calls this month'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Usage Chart */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Daily Usage (Last 7 Days)</h3>
          {dailyData.length > 0 ? (
            <div className="space-y-3">
              {dailyData.map((day, index) => {
                const maxUsage = Math.max(...dailyData.map(d => d.usage as number));
                const percentage = maxUsage > 0 ? (day.usage as number / maxUsage) * 100 : 0;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-16 text-sm text-slate-400">{day.date}</div>
                    <div className="flex-1 bg-slate-700 rounded-full h-4 relative">
                      <div 
                        className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                        {day.usage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400">
              No usage data for this period
            </div>
          )}
        </div>

        {/* Feature Usage Breakdown */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Feature Usage</h3>
          {featureData.length > 0 ? (
            <div className="space-y-4">
              {featureData.map((feature, index) => {
                const colors = ['bg-cyan-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                const color = colors[index % colors.length];
                return (
                  <div key={feature.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${color}`}></div>
                        <span className="text-slate-300 text-sm">{feature.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-medium">{feature.value}</span>
                        <span className="text-slate-400 text-sm ml-1">({feature.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${color} transition-all duration-300`}
                        style={{ width: `${feature.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400">
              No feature usage data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsageDashboard;
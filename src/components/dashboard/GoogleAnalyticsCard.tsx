import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface AnalyticsData {
  activeUsers: number;
  totalSessions: number;
  pageViews: number;
  bounceRate: number;
  sessionDuration: number;
  newUsers: number;
  returningUsers: number;
  topPages: { page: string; views: number }[];
  dailyTrend: { date: string; users: number }[];
}

interface GoogleAnalyticsCardProps {
  propertyId?: string;
  timeRange?: '7d' | '30d' | '90d';
  className?: string;
}

const GoogleAnalyticsCard: React.FC<GoogleAnalyticsCardProps> = ({
  propertyId = 'demo',
  timeRange = '30d',
  className = ''
}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Mock data for demonstration
  const mockData: AnalyticsData = {
    activeUsers: 847,
    totalSessions: 1234,
    pageViews: 4567,
    bounceRate: 42.3,
    sessionDuration: 185,
    newUsers: 523,
    returningUsers: 324,
    topPages: [
      { page: '/services', views: 1234 },
      { page: '/about', views: 987 },
      { page: '/contact', views: 654 },
      { page: '/pricing', views: 432 }
    ],
    dailyTrend: [
      { date: '2024-01-01', users: 45 },
      { date: '2024-01-02', users: 52 },
      { date: '2024-01-03', users: 38 },
      { date: '2024-01-04', users: 67 },
      { date: '2024-01-05', users: 73 },
      { date: '2024-01-06', users: 82 },
      { date: '2024-01-07', users: 91 }
    ]
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual Google Analytics API call
        // const response = await fetch(`/api/analytics?property=${propertyId}&range=${timeRange}`);
        // const data = await response.json();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockData);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [propertyId, timeRange]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getChangeIcon = (isPositive: boolean) => {
    return isPositive ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google Analytics</h3>
              <p className="text-sm text-gray-500">Loading analytics data...</p>
            </div>
          </div>
          <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google Analytics</h3>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Unable to load analytics data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google Analytics</h3>
              <p className="text-sm text-gray-500">Website traffic & engagement</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {expanded ? 'Less' : 'More'}
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-blue-600">{data?.activeUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(true)}
              <span className="text-sm text-green-600 ml-1">+12.5%</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-green-600">{data?.pageViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(true)}
              <span className="text-sm text-green-600 ml-1">+8.2%</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-purple-600">{data?.bounceRate}%</p>
              </div>
              <TrendingDown className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(false)}
              <span className="text-sm text-red-600 ml-1">-2.1%</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                <p className="text-2xl font-bold text-orange-600">{formatDuration(data?.sessionDuration || 0)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(true)}
              <span className="text-sm text-green-600 ml-1">+15.3%</span>
            </div>
          </div>
        </div>

        {/* Expanded View */}
        {expanded && (
          <div className="space-y-6 pt-6 border-t border-gray-200">
            {/* User Breakdown */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">User Breakdown</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">New Users</p>
                  <p className="text-xl font-bold text-blue-600">{data?.newUsers.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Returning Users</p>
                  <p className="text-xl font-bold text-green-600">{data?.returningUsers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Top Pages</h4>
              <div className="space-y-2">
                {data?.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{page.page}</span>
                    <span className="text-sm text-gray-500">{page.views.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Chart */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">7-Day Trend</h4>
              <div className="flex items-end space-x-2 h-16">
                {data?.dailyTrend.map((day, index) => (
                  <div key={index} className="flex-1 bg-blue-500 rounded-t" 
                       style={{ height: `${(day.users / 100) * 100}%` }}
                       title={`${day.date}: ${day.users} users`}>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAnalyticsCard;
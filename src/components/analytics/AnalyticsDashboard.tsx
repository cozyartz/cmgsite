import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  Globe,
  Search,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Zap
} from 'lucide-react';

interface AnalyticsData {
  realtime: {
    activeUsers: number;
    pageViews: number;
    conversions: number;
    topCountries: Array<{ country: string; users: number }>;
    topSources: Array<{ source: string; users: number }>;
  };
  traffic: {
    totalSessions: number;
    totalUsers: number;
    totalPageviews: number;
    averageBounceRate: number;
    averageSessionDuration: number;
    dailyData: Array<{ date: string; sessions: number; users: number; pageviews: number }>;
    growth: {
      sessions: number;
      users: number;
      pageviews: number;
    };
  };
  searchConsole: {
    totalClicks: number;
    totalImpressions: number;
    averageCTR: number;
    averagePosition: number;
    topQueries: Array<{ query: string; clicks: number; impressions: number; ctr: string; position: string }>;
    positionDistribution: { '1-3': number; '4-10': number; '11-20': number; '21+': number };
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    loadAnalyticsData();
  }, [selectedTimeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual Google Analytics integration
      const response = await fetch('/api/analytics/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ timeRange: selectedTimeRange })
      });
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Use demo data for now
      setAnalyticsData(getDemoData());
    } finally {
      setLoading(false);
    }
  };

  const getDemoData = (): AnalyticsData => ({
    realtime: {
      activeUsers: 47,
      pageViews: 156,
      conversions: 3,
      topCountries: [
        { country: 'United States', users: 23 },
        { country: 'Canada', users: 12 },
        { country: 'United Kingdom', users: 8 },
        { country: 'Australia', users: 4 }
      ],
      topSources: [
        { source: 'Organic Search', users: 28 },
        { source: 'Direct', users: 15 },
        { source: 'Social Media', users: 4 }
      ]
    },
    traffic: {
      totalSessions: 12543,
      totalUsers: 8942,
      totalPageviews: 24567,
      averageBounceRate: 34.2,
      averageSessionDuration: 245,
      dailyData: generateDailyData(),
      growth: {
        sessions: 23.5,
        users: 18.2,
        pageviews: 31.4
      }
    },
    searchConsole: {
      totalClicks: 5674,
      totalImpressions: 89234,
      averageCTR: 6.36,
      averagePosition: 12.4,
      topQueries: [
        { query: 'web design michigan', clicks: 234, impressions: 2456, ctr: '9.5', position: '3.2' },
        { query: 'seo services', clicks: 189, impressions: 4567, ctr: '4.1', position: '8.7' },
        { query: 'digital marketing', clicks: 156, impressions: 3421, ctr: '4.6', position: '6.3' },
        { query: 'cozyartz media', clicks: 143, impressions: 1234, ctr: '11.6', position: '2.1' }
      ],
      positionDistribution: {
        '1-3': 45,
        '4-10': 128,
        '11-20': 89,
        '21+': 234
      }
    }
  });

  const generateDailyData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        sessions: Math.floor(Math.random() * 200) + 300,
        users: Math.floor(Math.random() * 150) + 200,
        pageviews: Math.floor(Math.random() * 400) + 600
      });
    }
    return data;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <RefreshCw className="h-8 w-8 animate-spin text-teal-400" />
          <div className="text-lg font-medium">Loading Analytics Data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className={`flex justify-between items-center mb-8 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-slate-300">Real-time insights and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Last 12 months</option>
            </select>
            
            <button
              onClick={loadAnalyticsData}
              className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            
            <button className="bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 hover:bg-slate-600/80 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className={`mb-8 transform transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-teal-400" />
            Real-time Activity
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Users className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Active Users</h3>
                    <p className="text-slate-400 text-sm">Right now</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-green-400">{analyticsData?.realtime.activeUsers}</div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Page Views</h3>
                  <p className="text-slate-400 text-sm">Last 30 minutes</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-400">{analyticsData?.realtime.pageViews}</div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <MousePointer className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Conversions</h3>
                  <p className="text-slate-400 text-sm">This hour</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-400">{analyticsData?.realtime.conversions}</div>
            </div>
          </div>
        </div>

        {/* Main Metrics */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 transform transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <MetricCard
            title="Total Sessions"
            value={formatNumber(analyticsData?.traffic.totalSessions || 0)}
            growth={analyticsData?.traffic.growth.sessions || 0}
            icon={BarChart3}
            color="teal"
          />
          <MetricCard
            title="Unique Users"
            value={formatNumber(analyticsData?.traffic.totalUsers || 0)}
            growth={analyticsData?.traffic.growth.users || 0}
            icon={Users}
            color="blue"
          />
          <MetricCard
            title="Page Views"
            value={formatNumber(analyticsData?.traffic.totalPageviews || 0)}
            growth={analyticsData?.traffic.growth.pageviews || 0}
            icon={Eye}
            color="green"
          />
          <MetricCard
            title="Avg. Session"
            value={formatDuration(analyticsData?.traffic.averageSessionDuration || 0)}
            growth={12.5}
            icon={Calendar}
            color="purple"
          />
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traffic Chart */}
          <div className={`bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-teal-400" />
              Traffic Trends
            </h3>
            <TrafficChart data={analyticsData?.traffic.dailyData || []} />
          </div>

          {/* Search Console Data */}
          <div className={`bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 transform transition-all duration-1000 delay-800 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Search className="h-6 w-6 mr-2 text-teal-400" />
              Search Performance
            </h3>
            <SearchMetrics data={analyticsData?.searchConsole} />
          </div>
        </div>

        {/* Top Queries Table */}
        <div className={`mt-8 bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 transform transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h3 className="text-xl font-bold text-white mb-6">Top Performing Keywords</h3>
          <TopQueriesTable queries={analyticsData?.searchConsole.topQueries || []} />
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  growth: number;
  icon: any;
  color: 'teal' | 'blue' | 'green' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, growth, icon: Icon, color }) => {
  const colors = {
    teal: 'text-teal-400 bg-teal-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20'
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colors[color]} rounded-lg`}>
          <Icon className={`h-6 w-6 ${colors[color].split(' ')[0]}`} />
        </div>
        <div className={`flex items-center space-x-1 text-sm ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {growth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <span>{Math.abs(growth)}%</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{title}</div>
    </div>
  );
};

// Traffic Chart Component
const TrafficChart: React.FC<{ data: Array<{ date: string; sessions: number; users: number }> }> = ({ data }) => {
  const maxSessions = Math.max(...data.map(d => d.sessions));
  
  return (
    <div className="space-y-4">
      <div className="h-48 flex items-end space-x-1">
        {data.slice(-14).map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-sm transition-all duration-500 hover:from-teal-500 hover:to-teal-300"
              style={{ height: `${(day.sessions / maxSessions) * 100}%` }}
              title={`${day.date}: ${day.sessions} sessions`}
            ></div>
            <div className="text-xs text-slate-400 mt-2 rotate-45 origin-bottom-left">
              {new Date(day.date).getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-slate-400">
        <span>Sessions</span>
        <span>{formatNumber(data.reduce((sum, d) => sum + d.sessions, 0))} total</span>
      </div>
    </div>
  );
};

// Search Metrics Component
const SearchMetrics: React.FC<{ data?: any }> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-400">{formatNumber(data.totalClicks)}</div>
          <div className="text-sm text-slate-400">Total Clicks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{data.averageCTR}%</div>
          <div className="text-sm text-slate-400">Avg. CTR</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-slate-300 font-medium">Position Distribution</div>
        {Object.entries(data.positionDistribution).map(([range, count]) => (
          <div key={range} className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Position {range}</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(Number(count) / 100) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-white w-8">{count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Top Queries Table
const TopQueriesTable: React.FC<{ queries: any[] }> = ({ queries }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-600/50">
            <th className="text-left py-3 px-4 text-slate-300 font-medium">Query</th>
            <th className="text-right py-3 px-4 text-slate-300 font-medium">Clicks</th>
            <th className="text-right py-3 px-4 text-slate-300 font-medium">Impressions</th>
            <th className="text-right py-3 px-4 text-slate-300 font-medium">CTR</th>
            <th className="text-right py-3 px-4 text-slate-300 font-medium">Position</th>
          </tr>
        </thead>
        <tbody>
          {queries.slice(0, 10).map((query, index) => (
            <tr key={index} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200">
              <td className="py-3 px-4 text-white font-medium">{query.query}</td>
              <td className="py-3 px-4 text-right text-teal-400">{query.clicks}</td>
              <td className="py-3 px-4 text-right text-slate-300">{formatNumber(query.impressions)}</td>
              <td className="py-3 px-4 text-right text-blue-400">{query.ctr}%</td>
              <td className="py-3 px-4 text-right text-slate-300">{query.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default AnalyticsDashboard;
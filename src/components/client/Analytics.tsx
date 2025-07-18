import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter,
  Target,
  Users,
  MousePointer,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  organicTraffic: {
    current: number;
    previous: number;
    data: { date: string; value: number }[];
  };
  keywords: {
    total: number;
    improved: number;
    declined: number;
    data: { keyword: string; rank: number; change: number }[];
  };
  conversions: {
    rate: number;
    total: number;
    change: number;
  };
}

const Analytics: React.FC = () => {
  const { client } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '12m', label: 'Last 12 Months' },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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

  const mockData: AnalyticsData = {
    organicTraffic: {
      current: 12543,
      previous: 10234,
      data: [
        { date: '2024-01-01', value: 8500 },
        { date: '2024-01-15', value: 9200 },
        { date: '2024-02-01', value: 10234 },
        { date: '2024-02-15', value: 11800 },
        { date: '2024-03-01', value: 12543 },
      ]
    },
    keywords: {
      total: 47,
      improved: 23,
      declined: 8,
      data: [
        { keyword: 'partnership consulting', rank: 3, change: +2 },
        { keyword: 'Fortune 500 partnerships', rank: 8, change: +5 },
        { keyword: 'corporate sponsorship deals', rank: 12, change: -1 },
        { keyword: 'business development consulting', rank: 15, change: +7 },
        { keyword: 'strategic partnerships', rank: 6, change: +3 },
      ]
    },
    conversions: {
      rate: 3.4,
      total: 89,
      change: 12
    }
  };

  const data = analyticsData || mockData;

  const trafficChange = ((data.organicTraffic.current - data.organicTraffic.previous) / data.organicTraffic.previous) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-slate-400">Track your SEO performance and ROI</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Organic Traffic</p>
              <p className="text-2xl font-bold text-white">{data.organicTraffic.current.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-teal-400" />
          </div>
          <div className="mt-4 flex items-center">
            {trafficChange > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
            )}
            <span className={`text-sm ${trafficChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trafficChange > 0 ? '+' : ''}{trafficChange.toFixed(1)}% vs previous period
            </span>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Keywords Ranking</p>
              <p className="text-2xl font-bold text-white">{data.keywords.total}</p>
            </div>
            <Target className="h-8 w-8 text-teal-400" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-sm text-green-400">
              {data.keywords.improved} improved positions
            </span>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">{data.conversions.rate}%</p>
            </div>
            <MousePointer className="h-8 w-8 text-teal-400" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-sm text-green-400">
              +{data.conversions.change}% vs previous period
            </span>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Conversions</p>
              <p className="text-2xl font-bold text-white">{data.conversions.total}</p>
            </div>
            <Users className="h-8 w-8 text-teal-400" />
          </div>
          <div className="mt-4 flex items-center">
            <Clock className="h-4 w-4 text-slate-400 mr-1" />
            <span className="text-sm text-slate-400">
              This month
            </span>
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Organic Traffic Trend</h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-400">All Sources</span>
          </div>
        </div>
        
        {/* Simple chart representation */}
        <div className="h-64 flex items-end space-x-2">
          {data.organicTraffic.data.map((point, index) => (
            <div
              key={index}
              className="bg-teal-500 rounded-t flex-1 min-w-0"
              style={{ height: `${(point.value / Math.max(...data.organicTraffic.data.map(p => p.value))) * 100}%` }}
              title={`${point.date}: ${point.value.toLocaleString()}`}
            />
          ))}
        </div>
        
        <div className="flex justify-between mt-4 text-sm text-slate-400">
          {data.organicTraffic.data.map((point, index) => (
            <span key={index}>{new Date(point.date).toLocaleDateString()}</span>
          ))}
        </div>
      </div>

      {/* Keyword Rankings */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Keyword Rankings</h3>
          <button className="text-teal-400 hover:text-teal-300 text-sm">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Keyword</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Current Rank</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Change</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {data.keywords.data.map((keyword, index) => (
                <tr key={index} className="border-b border-slate-700/50">
                  <td className="py-3 px-4 text-white">{keyword.keyword}</td>
                  <td className="py-3 px-4 text-white">#{keyword.rank}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm ${keyword.change > 0 ? 'text-green-400' : keyword.change < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {keyword.change > 0 ? '+' : ''}{keyword.change}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {keyword.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : keyword.change < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    ) : (
                      <div className="h-4 w-4 bg-slate-600 rounded-full" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Content</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div>
                <p className="text-white font-medium">Partnership Strategy Guide</p>
                <p className="text-slate-400 text-sm">1,234 views • 23 conversions</p>
              </div>
              <div className="text-teal-400">+45%</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div>
                <p className="text-white font-medium">Fortune 500 Outreach Template</p>
                <p className="text-slate-400 text-sm">892 views • 18 conversions</p>
              </div>
              <div className="text-teal-400">+32%</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div>
                <p className="text-white font-medium">Corporate Sponsorship Trends</p>
                <p className="text-slate-400 text-sm">567 views • 12 conversions</p>
              </div>
              <div className="text-teal-400">+28%</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Organic Search</span>
              <span className="text-white font-medium">68%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-teal-500 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Direct Traffic</span>
              <span className="text-white font-medium">22%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '22%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Referral</span>
              <span className="text-white font-medium">10%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
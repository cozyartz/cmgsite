import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Eye, MousePointer, Target, RefreshCw } from 'lucide-react';

interface SearchConsoleData {
  totalClicks: number;
  totalImpressions: number;
  avgCTR: number;
  avgPosition: number;
  topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
  topPages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[];
  dailyTrend: { date: string; clicks: number; impressions: number }[];
}

interface SearchConsoleCardProps {
  siteUrl?: string;
  timeRange?: '7d' | '30d' | '90d';
  className?: string;
}

const SearchConsoleCard: React.FC<SearchConsoleCardProps> = ({
  siteUrl = 'https://cozyartzmedia.com',
  timeRange = '30d',
  className = ''
}) => {
  const [data, setData] = useState<SearchConsoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Mock data for demonstration
  const mockData: SearchConsoleData = {
    totalClicks: 2847,
    totalImpressions: 45632,
    avgCTR: 6.24,
    avgPosition: 8.7,
    topQueries: [
      { query: 'web design services', clicks: 234, impressions: 3456, ctr: 6.77, position: 4.2 },
      { query: 'michigan web design', clicks: 187, impressions: 2890, ctr: 6.47, position: 5.1 },
      { query: 'cozyartz media', clicks: 156, impressions: 1234, ctr: 12.64, position: 2.3 },
      { query: 'instructional design', clicks: 134, impressions: 2876, ctr: 4.66, position: 7.8 },
      { query: 'drone photography', clicks: 98, impressions: 1987, ctr: 4.93, position: 9.2 }
    ],
    topPages: [
      { page: '/web-design-services', clicks: 456, impressions: 7890, ctr: 5.78, position: 6.2 },
      { page: '/instructional-design', clicks: 334, impressions: 5432, ctr: 6.15, position: 7.1 },
      { page: '/drone-services', clicks: 298, impressions: 4321, ctr: 6.89, position: 8.9 },
      { page: '/about', clicks: 234, impressions: 3210, ctr: 7.29, position: 5.4 }
    ],
    dailyTrend: [
      { date: '2024-01-01', clicks: 89, impressions: 1432 },
      { date: '2024-01-02', clicks: 94, impressions: 1589 },
      { date: '2024-01-03', clicks: 78, impressions: 1234 },
      { date: '2024-01-04', clicks: 112, impressions: 1876 },
      { date: '2024-01-05', clicks: 134, impressions: 2098 },
      { date: '2024-01-06', clicks: 156, impressions: 2345 },
      { date: '2024-01-07', clicks: 178, impressions: 2567 }
    ]
  };

  useEffect(() => {
    const fetchSearchConsole = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual Google Search Console API call
        // const response = await fetch(`/api/search-console?site=${siteUrl}&range=${timeRange}`);
        // const data = await response.json();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        setData(mockData);
      } catch (err) {
        setError('Failed to fetch search console data');
        console.error('Search Console error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchConsole();
  }, [siteUrl, timeRange]);

  const getChangeIcon = (isPositive: boolean) => {
    return isPositive ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600';
    if (position <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Search Console</h3>
              <p className="text-sm text-gray-500">Loading search data...</p>
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
              <Search className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Search Console</h3>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Unable to load search data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Search Console</h3>
              <p className="text-sm text-gray-500">SEO performance & visibility</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 text-sm text-green-600 hover:text-green-800 transition-colors"
          >
            {expanded ? 'Less' : 'More'}
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-blue-600">{data?.totalClicks.toLocaleString()}</p>
              </div>
              <MousePointer className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(true)}
              <span className="text-sm text-green-600 ml-1">+18.7%</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impressions</p>
                <p className="text-2xl font-bold text-purple-600">{data?.totalImpressions.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(true)}
              <span className="text-sm text-green-600 ml-1">+24.3%</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg CTR</p>
                <p className="text-2xl font-bold text-green-600">{data?.avgCTR}%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(true)}
              <span className="text-sm text-green-600 ml-1">+2.1%</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Position</p>
                <p className={`text-2xl font-bold ${getPositionColor(data?.avgPosition || 0)}`}>
                  {data?.avgPosition.toFixed(1)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(false)}
              <span className="text-sm text-green-600 ml-1">-1.2 (better)</span>
            </div>
          </div>
        </div>

        {/* Expanded View */}
        {expanded && (
          <div className="space-y-6 pt-6 border-t border-gray-200">
            {/* Top Queries */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Top Search Queries</h4>
              <div className="space-y-2">
                {data?.topQueries.map((query, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{query.query}</span>
                      <span className={`text-sm font-medium ${getPositionColor(query.position)}`}>
                        #{query.position.toFixed(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">{query.clicks}</span> clicks
                      </div>
                      <div>
                        <span className="font-medium">{query.impressions.toLocaleString()}</span> impressions
                      </div>
                      <div>
                        <span className="font-medium">{query.ctr.toFixed(2)}%</span> CTR
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Pages */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Top Landing Pages</h4>
              <div className="space-y-2">
                {data?.topPages.map((page, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{page.page}</span>
                      <span className={`text-sm font-medium ${getPositionColor(page.position)}`}>
                        #{page.position.toFixed(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">{page.clicks}</span> clicks
                      </div>
                      <div>
                        <span className="font-medium">{page.impressions.toLocaleString()}</span> impressions
                      </div>
                      <div>
                        <span className="font-medium">{page.ctr.toFixed(2)}%</span> CTR
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Click Trend Chart */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">7-Day Click Trend</h4>
              <div className="flex items-end space-x-2 h-16">
                {data?.dailyTrend.map((day, index) => (
                  <div key={index} className="flex-1 bg-green-500 rounded-t" 
                       style={{ height: `${(day.clicks / 200) * 100}%` }}
                       title={`${day.date}: ${day.clicks} clicks`}>
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

export default SearchConsoleCard;
import React, { useState, useEffect } from 'react';
import { Zap, Smartphone, Monitor, Clock, Image, Code, TrendingUp, TrendingDown, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface PageSpeedData {
  mobile: {
    score: number;
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    cls: number; // Cumulative Layout Shift
    fid: number; // First Input Delay
    si: number;  // Speed Index
  };
  desktop: {
    score: number;
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
    si: number;
  };
  opportunities: { title: string; savings: number; type: 'critical' | 'warning' | 'info' }[];
  diagnostics: { title: string; description: string; type: 'critical' | 'warning' | 'info' }[];
  loadingExperience: {
    overall: 'FAST' | 'AVERAGE' | 'SLOW';
    metrics: {
      fcp: 'FAST' | 'AVERAGE' | 'SLOW';
      lcp: 'FAST' | 'AVERAGE' | 'SLOW';
      cls: 'FAST' | 'AVERAGE' | 'SLOW';
      fid: 'FAST' | 'AVERAGE' | 'SLOW';
    };
  };
}

interface PageSpeedCardProps {
  url?: string;
  className?: string;
}

const PageSpeedCard: React.FC<PageSpeedCardProps> = ({
  url = 'https://cozyartzmedia.com',
  className = ''
}) => {
  const [data, setData] = useState<PageSpeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'mobile' | 'desktop'>('mobile');

  // Mock data for demonstration
  const mockData: PageSpeedData = {
    mobile: {
      score: 87,
      fcp: 1.2,
      lcp: 2.1,
      cls: 0.08,
      fid: 45,
      si: 1.8
    },
    desktop: {
      score: 94,
      fcp: 0.8,
      lcp: 1.4,
      cls: 0.03,
      fid: 12,
      si: 1.2
    },
    opportunities: [
      { title: 'Enable text compression', savings: 0.45, type: 'warning' },
      { title: 'Properly size images', savings: 0.32, type: 'info' },
      { title: 'Remove unused CSS', savings: 0.28, type: 'info' },
      { title: 'Minify JavaScript', savings: 0.15, type: 'info' }
    ],
    diagnostics: [
      { title: 'Avoid enormous network payloads', description: 'Large network payloads cost users real money', type: 'warning' },
      { title: 'Serve images in next-gen formats', description: 'WebP and AVIF provide better compression', type: 'info' },
      { title: 'Eliminate render-blocking resources', description: 'Resources are blocking the first paint', type: 'critical' }
    ],
    loadingExperience: {
      overall: 'FAST',
      metrics: {
        fcp: 'FAST',
        lcp: 'FAST',
        cls: 'FAST',
        fid: 'AVERAGE'
      }
    }
  };

  useEffect(() => {
    const fetchPageSpeed = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual Google PageSpeed Insights API call
        // const response = await fetch(`/api/pagespeed?url=${encodeURIComponent(url)}`);
        // const data = await response.json();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setData(mockData);
      } catch (err) {
        setError('Failed to fetch PageSpeed data');
        console.error('PageSpeed error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageSpeed();
  }, [url]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 50) return 'from-orange-500 to-yellow-600';
    return 'from-red-500 to-pink-600';
  };

  const getMetricColor = (value: number, metric: string) => {
    if (metric === 'cls') {
      if (value <= 0.1) return 'text-green-600';
      if (value <= 0.25) return 'text-orange-600';
      return 'text-red-600';
    }
    if (metric === 'fid') {
      if (value <= 100) return 'text-green-600';
      if (value <= 300) return 'text-orange-600';
      return 'text-red-600';
    }
    // For FCP, LCP, SI (in seconds)
    if (value <= 1.8) return 'text-green-600';
    if (value <= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getChangeIcon = (isPositive: boolean) => {
    return isPositive ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getTypeIcon = (type: 'critical' | 'warning' | 'info') => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const CircularProgress = ({ score, size = 80 }: { score: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ${getScoreColor(score)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">PageSpeed Insights</h3>
              <p className="text-sm text-gray-500">Analyzing performance...</p>
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
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">PageSpeed Insights</h3>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Unable to load performance data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentData = data?.[activeTab];

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-gradient-to-r ${getScoreBackground(currentData?.score || 0)} rounded-lg`}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">PageSpeed Insights</h3>
              <p className="text-sm text-gray-500">Performance & Core Web Vitals</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 text-sm text-orange-600 hover:text-orange-800 transition-colors"
          >
            {expanded ? 'Less' : 'More'}
          </button>
        </div>

        {/* Device Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'mobile' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'desktop' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Performance Score */}
        <div className="text-center mb-6">
          <CircularProgress score={currentData?.score || 0} size={100} />
          <p className="text-sm text-gray-500 mt-2">Performance Score</p>
        </div>

        {/* Core Web Vitals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">FCP</p>
                <p className={`text-lg font-bold ${getMetricColor(currentData?.fcp || 0, 'fcp')}`}>
                  {currentData?.fcp.toFixed(1)}s
                </p>
              </div>
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">First Contentful Paint</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">LCP</p>
                <p className={`text-lg font-bold ${getMetricColor(currentData?.lcp || 0, 'lcp')}`}>
                  {currentData?.lcp.toFixed(1)}s
                </p>
              </div>
              <Image className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Largest Contentful Paint</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CLS</p>
                <p className={`text-lg font-bold ${getMetricColor(currentData?.cls || 0, 'cls')}`}>
                  {currentData?.cls.toFixed(3)}
                </p>
              </div>
              <Code className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Cumulative Layout Shift</p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">FID</p>
                <p className={`text-lg font-bold ${getMetricColor(currentData?.fid || 0, 'fid')}`}>
                  {currentData?.fid}ms
                </p>
              </div>
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">First Input Delay</p>
          </div>
        </div>

        {/* Expanded View */}
        {expanded && (
          <div className="space-y-6 pt-6 border-t border-gray-200">
            {/* Opportunities */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Opportunities</h4>
              <div className="space-y-2">
                {data?.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(opportunity.type)}
                      <span className="text-sm font-medium text-gray-700">{opportunity.title}</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      -{opportunity.savings.toFixed(2)}s
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostics */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Diagnostics</h4>
              <div className="space-y-2">
                {data?.diagnostics.map((diagnostic, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(diagnostic.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 mb-1">{diagnostic.title}</p>
                        <p className="text-xs text-gray-500">{diagnostic.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Data */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Field Data (Real User Experience)</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">FCP</p>
                  <p className={`text-lg font-bold ${
                    data?.loadingExperience.metrics.fcp === 'FAST' ? 'text-green-600' :
                    data?.loadingExperience.metrics.fcp === 'AVERAGE' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {data?.loadingExperience.metrics.fcp}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">LCP</p>
                  <p className={`text-lg font-bold ${
                    data?.loadingExperience.metrics.lcp === 'FAST' ? 'text-green-600' :
                    data?.loadingExperience.metrics.lcp === 'AVERAGE' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {data?.loadingExperience.metrics.lcp}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">CLS</p>
                  <p className={`text-lg font-bold ${
                    data?.loadingExperience.metrics.cls === 'FAST' ? 'text-green-600' :
                    data?.loadingExperience.metrics.cls === 'AVERAGE' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {data?.loadingExperience.metrics.cls}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">FID</p>
                  <p className={`text-lg font-bold ${
                    data?.loadingExperience.metrics.fid === 'FAST' ? 'text-green-600' :
                    data?.loadingExperience.metrics.fid === 'AVERAGE' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {data?.loadingExperience.metrics.fid}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageSpeedCard;
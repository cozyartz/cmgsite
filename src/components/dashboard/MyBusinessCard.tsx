import React, { useState, useEffect } from 'react';
import { MapPin, Star, MessageSquare, Eye, Phone, Globe, Clock, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

interface MyBusinessData {
  businessName: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  totalReviews: number;
  totalViews: number;
  totalClicks: number;
  directionsRequests: number;
  phoneClicks: number;
  websiteClicks: number;
  isVerified: boolean;
  recentReviews: { author: string; rating: number; text: string; date: string }[];
  recentQAs: { question: string; answer: string; date: string }[];
  monthlyTrend: { month: string; views: number; clicks: number }[];
  photos: { url: string; views: number }[];
}

interface MyBusinessCardProps {
  businessId?: string;
  className?: string;
}

const MyBusinessCard: React.FC<MyBusinessCardProps> = ({
  businessId = 'cozyartz-media-group',
  className = ''
}) => {
  const [data, setData] = useState<MyBusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Mock data for demonstration
  const mockData: MyBusinessData = {
    businessName: 'Cozyartz Media Group',
    address: '123 Main St, Battle Creek, MI 49015',
    phone: '(269) 261-0069',
    website: 'https://cozyartzmedia.com',
    rating: 4.8,
    totalReviews: 47,
    totalViews: 3456,
    totalClicks: 892,
    directionsRequests: 234,
    phoneClicks: 156,
    websiteClicks: 324,
    isVerified: true,
    recentReviews: [
      { author: 'Sarah Johnson', rating: 5, text: 'Amazing web design work! Very professional and creative.', date: '2024-01-15' },
      { author: 'Mike Chen', rating: 5, text: 'Great drone photography for our real estate business.', date: '2024-01-12' },
      { author: 'Lisa Rodriguez', rating: 4, text: 'Excellent instructional design services. Highly recommend!', date: '2024-01-10' }
    ],
    recentQAs: [
      { question: 'Do you offer SEO services?', answer: 'Yes, we provide comprehensive SEO services including keyword optimization, content strategy, and technical SEO audits.', date: '2024-01-14' },
      { question: 'What is your typical project timeline?', answer: 'Most web design projects take 4-6 weeks, depending on complexity and scope.', date: '2024-01-11' }
    ],
    monthlyTrend: [
      { month: 'Oct', views: 2890, clicks: 634 },
      { month: 'Nov', views: 3124, clicks: 712 },
      { month: 'Dec', views: 3456, clicks: 892 },
      { month: 'Jan', views: 3789, clicks: 945 }
    ],
    photos: [
      { url: '/api/placeholder/400/300', views: 1234 },
      { url: '/api/placeholder/400/300', views: 987 },
      { url: '/api/placeholder/400/300', views: 756 }
    ]
  };

  useEffect(() => {
    const fetchMyBusiness = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual Google My Business API call
        // const response = await fetch(`/api/my-business?id=${businessId}`);
        // const data = await response.json();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1300));
        setData(mockData);
      } catch (err) {
        setError('Failed to fetch business data');
        console.error('My Business error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBusiness();
  }, [businessId]);

  const getChangeIcon = (isPositive: boolean) => {
    return isPositive ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google My Business</h3>
              <p className="text-sm text-gray-500">Loading business data...</p>
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
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google My Business</h3>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Unable to load business data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google My Business</h3>
              <p className="text-sm text-gray-500">Local business presence</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            {expanded ? 'Less' : 'More'}
          </button>
        </div>

        {/* Business Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-900">{data?.businessName}</h4>
            {data?.isVerified && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Verified
              </span>
            )}
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{data?.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{data?.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>{data?.website}</span>
            </div>
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              {renderStars(Math.floor(data?.rating || 0))}
              <span className="text-lg font-semibold text-gray-900 ml-2">{data?.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({data?.totalReviews} reviews)</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-blue-600">{data?.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(true)}
              <span className="text-sm text-green-600 ml-1">+22.4%</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-green-600">{data?.totalClicks.toLocaleString()}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(true)}
              <span className="text-sm text-green-600 ml-1">+15.7%</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Directions</p>
                <p className="text-2xl font-bold text-purple-600">{data?.directionsRequests.toLocaleString()}</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(true)}
              <span className="text-sm text-green-600 ml-1">+8.3%</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Phone Calls</p>
                <p className="text-2xl font-bold text-orange-600">{data?.phoneClicks.toLocaleString()}</p>
              </div>
              <Phone className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              {getChangeIcon(true)}
              <span className="text-sm text-green-600 ml-1">+12.1%</span>
            </div>
          </div>
        </div>

        {/* Expanded View */}
        {expanded && (
          <div className="space-y-6 pt-6 border-t border-gray-200">
            {/* Recent Reviews */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Reviews</h4>
              <div className="space-y-3">
                {data?.recentReviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{review.author}</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-700">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Q&As */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Q&As</h4>
              <div className="space-y-3">
                {data?.recentQAs.map((qa, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-900 mb-1">Q: {qa.question}</p>
                      <p className="text-sm text-gray-700">A: {qa.answer}</p>
                    </div>
                    <span className="text-xs text-gray-500">{qa.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trend */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Monthly Performance</h4>
              <div className="flex items-end space-x-4 h-20">
                {data?.monthlyTrend.map((month, index) => (
                  <div key={index} className="flex-1 text-center">
                    <div className="relative">
                      <div 
                        className="bg-red-500 rounded-t mb-1" 
                        style={{ height: `${(month.views / 4000) * 60}px` }}
                        title={`${month.month}: ${month.views} views`}
                      ></div>
                      <div 
                        className="bg-red-300 rounded-t" 
                        style={{ height: `${(month.clicks / 1000) * 40}px` }}
                        title={`${month.month}: ${month.clicks} clicks`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{month.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-6 mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-300 rounded"></div>
                  <span>Clicks</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBusinessCard;
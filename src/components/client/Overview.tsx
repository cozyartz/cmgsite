import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { apiService } from '../../lib/api';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Zap,
  AlertCircle
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon }) => (
  <div className="bg-slate-800 p-6 rounded-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className="text-teal-400">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {changeType === 'increase' && <ArrowUpRight className="h-4 w-4 text-green-400" />}
      {changeType === 'decrease' && <ArrowDownRight className="h-4 w-4 text-red-400" />}
      <span className={`text-sm ml-1 ${
        changeType === 'increase' ? 'text-green-400' : 
        changeType === 'decrease' ? 'text-red-400' : 'text-slate-400'
      }`}>
        {change}
      </span>
    </div>
  </div>
);

const Overview: React.FC = () => {
  const { user, profile } = useAuth();
  const [metrics, setMetrics] = useState({
    organicTraffic: 0,
    keywordRankings: 0,
    conversionRate: 0,
    totalLeads: 0
  });

  console.log('Overview component render:', { user, profile });

  useEffect(() => {
    // Fetch dashboard metrics
    fetchMetrics();
  }, []);

  // Show loading state if user is not loaded yet
  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  const fetchMetrics = async () => {
    try {
      const response = await apiService.call('/api/dashboard/metrics', {
        requireAuth: true
      });
      
      setMetrics(response);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const usagePercentage = 0; // TODO: Implement usage tracking with new profile system
  const remainingCalls = 1000; // TODO: Implement usage tracking with new profile system

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back! Here's your SEO performance summary.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors">
            Schedule Consultation
          </button>
        </div>
      </div>

      {/* AI Usage Alert */}
      {usagePercentage > 80 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
          <div>
            <p className="text-yellow-400 font-medium">AI Usage Alert</p>
            <p className="text-yellow-300 text-sm">
              You've used 0 of 1000 AI calls this month. 
              Consider upgrading to continue using AI tools.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Organic Traffic"
          value="12,543"
          change="+23% from last month"
          changeType="increase"
          icon={<TrendingUp className="h-8 w-8" />}
        />
        <MetricCard
          title="Keyword Rankings"
          value="47"
          change="+8 positions improved"
          changeType="increase"
          icon={<Target className="h-8 w-8" />}
        />
        <MetricCard
          title="Conversion Rate"
          value="3.4%"
          change="+0.8% from last month"
          changeType="increase"
          icon={<DollarSign className="h-8 w-8" />}
        />
        <MetricCard
          title="Total Leads"
          value="89"
          change="+12% from last month"
          changeType="increase"
          icon={<Users className="h-8 w-8" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Usage Card */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">AI Usage</h3>
            <Zap className="h-5 w-5 text-teal-400" />
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Used this month</span>
                <span className="text-white">0/1000</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    usagePercentage >= 90 ? 'bg-red-400' : 
                    usagePercentage >= 70 ? 'bg-yellow-400' : 'bg-teal-400'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm text-slate-400">
              {remainingCalls} calls remaining
            </div>
            
            {usagePercentage > 80 && (
              <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                Upgrade Plan
              </button>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <Activity className="h-5 w-5 text-teal-400" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-teal-400 rounded-full mr-3"></div>
              <span className="text-slate-300">Generated SEO content for "Partnership Strategy"</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-slate-300">Keyword research completed</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span className="text-slate-300">Competitor analysis updated</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
              <span className="text-slate-300">Email campaign optimized</span>
            </div>
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Sessions</h3>
            <Calendar className="h-5 w-5 text-teal-400" />
          </div>
          
          <div className="space-y-3">
            <div className="border-l-4 border-teal-400 pl-4">
              <p className="text-white font-medium">Strategic Planning</p>
              <p className="text-slate-400 text-sm">Tomorrow at 2:00 PM</p>
              <p className="text-slate-400 text-sm">2 hours • $250/hour</p>
            </div>
            
            <div className="border-l-4 border-blue-400 pl-4">
              <p className="text-white font-medium">Campaign Review</p>
              <p className="text-slate-400 text-sm">Friday at 10:00 AM</p>
              <p className="text-slate-400 text-sm">1 hour • $150/hour</p>
            </div>
            
            <button className="w-full text-teal-400 hover:text-teal-300 text-sm font-medium py-2">
              View All Sessions
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg text-left transition-colors">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-teal-400 mr-2" />
              <span className="font-medium">Generate Content</span>
            </div>
            <p className="text-slate-400 text-sm">Create SEO-optimized content</p>
          </button>
          
          <button className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg text-left transition-colors">
            <div className="flex items-center mb-2">
              <Activity className="h-5 w-5 text-teal-400 mr-2" />
              <span className="font-medium">Analyze Keywords</span>
            </div>
            <p className="text-slate-400 text-sm">Research new opportunities</p>
          </button>
          
          <button className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg text-left transition-colors">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-teal-400 mr-2" />
              <span className="font-medium">Competitor Research</span>
            </div>
            <p className="text-slate-400 text-sm">Monitor competition</p>
          </button>
          
          <button className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg text-left transition-colors">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-teal-400 mr-2" />
              <span className="font-medium">Book Consultation</span>
            </div>
            <p className="text-slate-400 text-sm">Schedule expert session</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
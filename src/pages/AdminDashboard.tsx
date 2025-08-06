import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  TrendingUp,
  DollarSign,
  Zap,
  Globe,
  Activity,
  Target,
  FileText,
  Link,
  Users,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  Search,
  Eye,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Star,
  Trophy,
  Rocket,
  Brain,
  Sparkles,
  MessageCircle,
  AlertCircle,
  PieChart,
  LineChart,
  MousePointer,
  ExternalLink,
  Lightbulb,
  Crown,
  Award
} from 'lucide-react';

interface SEOHealthScore {
  overall: number;
  technical: number;
  content: number;
  backlinks: number;
  local: number;
  trends: { score: number; change: number }[];
}

interface MonthlyValue {
  contentCreated: number;
  backlinksAcquired: number;
  keywordsImproved: number;
  totalValueDelivered: number;
  projectedROI: number;
  timesSaved: number;
}

interface AITask {
  id: string;
  type: 'content' | 'backlinks' | 'technical' | 'competitor';
  title: string;
  description: string;
  status: 'in_progress' | 'completed' | 'scheduled';
  value: number;
  deadline: string;
  progress: number;
  eta?: string;
}

interface CompetitorIntel {
  id: string;
  name: string;
  threat_level: 'low' | 'medium' | 'high';
  recent_activity: string;
  opportunity: string;
  action_taken: string;
  timestamp: string;
}

interface KeywordOpportunity {
  keyword: string;
  difficulty: number;
  traffic_potential: number;
  current_rank: number | null;
  target_rank: number;
  ai_confidence: number;
  estimated_value: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [seoHealth, setSeoHealth] = useState<SEOHealthScore | null>(null);
  const [monthlyValue, setMonthlyValue] = useState<MonthlyValue | null>(null);
  const [aiTasks, setAiTasks] = useState<AITask[]>([]);
  const [competitorIntel, setCompetitorIntel] = useState<CompetitorIntel[]>([]);
  const [keywordOpportunities, setKeywordOpportunities] = useState<KeywordOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [activeView, setActiveView] = useState<'overview' | 'content' | 'backlinks' | 'competitor' | 'ai_chat'>('overview');
  

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadClientDashboardData();
  }, [user, selectedTimeRange, navigate]);

  const loadClientDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate AI-powered client data - replace with real endpoints
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // SEO Health Score with AI analysis
      setSeoHealth({
        overall: 87,
        technical: 92,
        content: 84,
        backlinks: 79,
        local: 95,
        trends: [
          { score: 82, change: 5 },
          { score: 85, change: 3 },
          { score: 87, change: 2 }
        ]
      });

      // Monthly Value Delivered
      setMonthlyValue({
        contentCreated: 4, // blog posts
        backlinksAcquired: 12,
        keywordsImproved: 23,
        totalValueDelivered: 2400,
        projectedROI: 8500,
        timesSaved: 32 // hours
      });

      // AI Tasks in Progress
      setAiTasks([
        {
          id: '1',
          type: 'content',
          title: 'Blog Post: "Advanced Partnership Strategies for 2024"',
          description: 'AI writing SEO-optimized content targeting "partnership consulting"',
          status: 'in_progress',
          value: 200,
          deadline: '2024-01-18',
          progress: 65
        },
        {
          id: '2',
          type: 'backlinks',
          title: 'Outreach Campaign: Tech Industry Blogs',
          description: 'AI prospecting and outreach for 15 high-authority backlinks',
          status: 'in_progress',
          value: 750,
          deadline: '2024-01-20',
          progress: 30
        },
        {
          id: '3',
          type: 'competitor',
          title: 'Competitor Analysis: McKinsey Content Strategy',
          description: 'AI analyzing competitor content gaps and opportunities',
          status: 'completed',
          value: 300,
          deadline: '2024-01-15',
          progress: 100
        }
      ]);

      // Competitor Intelligence
      setCompetitorIntel([
        {
          id: '1',
          name: 'McKinsey & Company',
          threat_level: 'high',
          recent_activity: 'Published 3 new partnership strategy articles',
          opportunity: 'Target their keyword gaps in Fortune 500 partnerships',
          action_taken: 'AI creating counter-content targeting same keywords',
          timestamp: '2 hours ago'
        },
        {
          id: '2',
          name: 'BCG',
          threat_level: 'medium',
          recent_activity: 'Launched new corporate partnership service page',
          opportunity: 'Their page lacks technical depth - we can outrank',
          action_taken: 'AI drafting comprehensive technical guide',
          timestamp: '6 hours ago'
        }
      ]);

      // Keyword Opportunities
      setKeywordOpportunities([
        {
          keyword: 'Fortune 500 partnership strategy',
          difficulty: 65,
          traffic_potential: 1200,
          current_rank: null,
          target_rank: 3,
          ai_confidence: 89,
          estimated_value: 450
        },
        {
          keyword: 'corporate sponsorship deals',
          difficulty: 45,
          traffic_potential: 800,
          current_rank: 15,
          target_rank: 5,
          ai_confidence: 94,
          estimated_value: 320
        }
      ]);

    } catch (error) {
      console.error('Error loading client dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Brain className="h-8 w-8 animate-pulse text-teal-400" />
          <div className="text-lg font-medium">AI analyzing your SEO performance...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 relative overflow-hidden">
      {/* AI-powered Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* AI-Powered Client Header */}
        <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    AI SEO Command Center
                    <Crown className="h-6 w-6 text-yellow-400 ml-2" />
                  </h1>
                  <p className="text-sm text-slate-300">Welcome back, {user?.email?.split('@')[0]}!</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400">AI Working</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-blue-400">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* AI Dashboard Navigation */}
                <div className="flex bg-slate-700/50 rounded-xl p-1">
                  <button
                    onClick={() => setActiveView('overview')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                      activeView === 'overview' 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveView('content')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                      activeView === 'content' 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Content AI</span>
                  </button>
                  <button
                    onClick={() => setActiveView('backlinks')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                      activeView === 'backlinks' 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                    }`}
                  >
                    <Link className="h-4 w-4" />
                    <span>Link Building</span>
                  </button>
                  <button
                    onClick={() => setActiveView('competitor')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                      activeView === 'competitor' 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Competitor Intel</span>
                  </button>
                  <button
                    onClick={() => setActiveView('ai_chat')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                      activeView === 'ai_chat' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                    }`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Ask AI</span>
                  </button>
                </div>
                
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="bg-slate-700/80 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                <button
                  onClick={loadClientDashboardData}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* AI-Powered Client Dashboard Views */}
          
          {activeView === 'overview' && (
            <>
              {/* SEO Health Score & Monthly Value */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* SEO Health Score */}
                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Trophy className="h-6 w-6 mr-2 text-yellow-400" />
                      SEO Health Score
                    </h3>
                    <div className="text-3xl font-bold text-teal-400">{seoHealth?.overall}/100</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Technical SEO</span>
                      <span className="text-white font-medium">{seoHealth?.technical}/100</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${seoHealth?.technical}%` }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Content Quality</span>
                      <span className="text-white font-medium">{seoHealth?.content}/100</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${seoHealth?.content}%` }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Backlink Profile</span>
                      <span className="text-white font-medium">{seoHealth?.backlinks}/100</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${seoHealth?.backlinks}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Monthly Value Delivered */}
                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <DollarSign className="h-6 w-6 mr-2 text-green-400" />
                      Monthly Value Delivered
                    </h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">${monthlyValue?.totalValueDelivered.toLocaleString()}</div>
                      <div className="text-sm text-slate-400">This month</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-400" />
                        <span className="text-slate-300">Blog Posts Created</span>
                      </div>
                      <div className="text-white font-bold">{monthlyValue?.contentCreated}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Link className="h-5 w-5 text-purple-400" />
                        <span className="text-slate-300">Backlinks Acquired</span>
                      </div>
                      <div className="text-white font-bold">{monthlyValue?.backlinksAcquired}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                        <span className="text-slate-300">Keywords Improved</span>
                      </div>
                      <div className="text-white font-bold">{monthlyValue?.keywordsImproved}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg border border-green-500/30">
                      <div className="flex items-center space-x-3">
                        <Rocket className="h-5 w-5 text-green-400" />
                        <span className="text-green-300 font-medium">Projected ROI</span>
                      </div>
                      <div className="text-green-400 font-bold text-lg">${monthlyValue?.projectedROI.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Tasks in Progress */}
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Bot className="h-6 w-6 mr-2 text-teal-400" />
                    AI Working For You Right Now
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">Live Activity</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {aiTasks.map((task) => (
                    <div key={task.id} className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-teal-400">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {task.type === 'content' && <FileText className="h-4 w-4 text-blue-400" />}
                          {task.type === 'backlinks' && <Link className="h-4 w-4 text-purple-400" />}
                          {task.type === 'competitor' && <Users className="h-4 w-4 text-red-400" />}
                          {task.type === 'technical' && <Zap className="h-4 w-4 text-yellow-400" />}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-green-400 font-medium">${task.value}</div>
                      </div>
                      <h4 className="text-white font-medium mb-2">{task.title}</h4>
                      <p className="text-slate-400 text-sm mb-3">{task.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Intelligence & Keyword Opportunities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Competitor Intelligence */}
                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Users className="h-6 w-6 mr-2 text-red-400" />
                      Competitor Intelligence
                    </h3>
                    <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                      View All Threats
                    </button>
                  </div>
                  <div className="space-y-4">
                    {competitorIntel.map((intel) => (
                      <div key={intel.id} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{intel.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{intel.name}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                intel.threat_level === 'high' ? 'bg-red-500/20 text-red-400' :
                                intel.threat_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {intel.threat_level} threat
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-slate-400">{intel.timestamp}</div>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{intel.recent_activity}</p>
                        <div className="bg-slate-600/30 rounded p-3 mb-2">
                          <p className="text-teal-400 text-sm font-medium mb-1">🎯 Opportunity:</p>
                          <p className="text-slate-300 text-sm">{intel.opportunity}</p>
                        </div>
                        <div className="bg-green-500/10 rounded p-3">
                          <p className="text-green-400 text-sm font-medium mb-1">✅ AI Action Taken:</p>
                          <p className="text-slate-300 text-sm">{intel.action_taken}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keyword Opportunities */}
                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Target className="h-6 w-6 mr-2 text-yellow-400" />
                      AI Keyword Opportunities
                    </h3>
                    <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
                      Generate More
                    </button>
                  </div>
                  <div className="space-y-4">
                    {keywordOpportunities.map((keyword, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium">{keyword.keyword}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              keyword.difficulty <= 30 ? 'bg-green-500/20 text-green-400' :
                              keyword.difficulty <= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              Difficulty: {keyword.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Traffic Potential</p>
                            <p className="text-white font-medium">{keyword.traffic_potential.toLocaleString()}/month</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Current Rank</p>
                            <p className="text-white font-medium">{keyword.current_rank || 'Not ranking'}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-teal-400 text-sm">AI Confidence:</span>
                            <span className="text-white font-medium">{keyword.ai_confidence}%</span>
                          </div>
                          <div className="text-green-400 font-bold">${keyword.estimated_value}/month</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Content AI View */}
          {activeView === 'content' && (
            <div className="space-y-8">
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <FileText className="h-6 w-6 mr-2 text-blue-400" />
                    AI Content Production Engine
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                      {monthlyValue?.contentCreated || 0}/4 posts this month
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                      Generate New Content
                    </button>
                  </div>
                </div>
                
                {/* Content Calendar */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-green-400 font-medium">Week 1 - Published</h4>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <p className="text-white font-medium mb-2">"Advanced Partnership Strategies for 2024"</p>
                    <p className="text-slate-400 text-sm mb-3">2,340 words • SEO optimized</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400">Ranking #8</span>
                      <span className="text-white">+$320 value</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-blue-400 font-medium">Week 2 - In Progress</h4>
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-white font-medium mb-2">"Fortune 500 Partnership Playbook"</p>
                    <p className="text-slate-400 text-sm mb-3">AI writing: 65% complete</p>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-slate-400 font-medium">Week 3 - Scheduled</h4>
                      <Clock className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-white font-medium mb-2">"Corporate Sponsorship Trends"</p>
                    <p className="text-slate-400 text-sm mb-3">Target: Jan 28</p>
                    <div className="text-sm text-slate-400">AI topic research complete</div>
                  </div>
                  
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-slate-400 font-medium">Week 4 - Planning</h4>
                      <Lightbulb className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-white font-medium mb-2">"Strategic Alliance Frameworks"</p>
                    <p className="text-slate-400 text-sm mb-3">AI analyzing trends</p>
                    <div className="text-sm text-slate-400">Research phase</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backlinks View */}
          {activeView === 'backlinks' && (
            <div className="space-y-8">
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Link className="h-6 w-6 mr-2 text-purple-400" />
                    Automated Backlink Acquisition
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                      {monthlyValue?.backlinksAcquired || 0} acquired this month
                    </div>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                      Start New Campaign
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Active Campaigns */}
                  <div className="lg:col-span-2">
                    <h4 className="text-white font-semibold mb-4">Active Outreach Campaigns</h4>
                    <div className="space-y-4">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-white font-medium">Tech Industry Blogs Campaign</h5>
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">In Progress</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-slate-400">Prospects Found</p>
                            <p className="text-white font-medium">47</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Emails Sent</p>
                            <p className="text-white font-medium">23</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Response Rate</p>
                            <p className="text-green-400 font-medium">34%</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-slate-400">AI Success Prediction: 87%</div>
                          <div className="text-purple-400 font-bold">Est. Value: $1,200</div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-white font-medium">Business Consulting Sites</h5>
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Successful</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-slate-400">Links Acquired</p>
                            <p className="text-white font-medium">8</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Domain Authority</p>
                            <p className="text-white font-medium">65+ avg</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Traffic Boost</p>
                            <p className="text-green-400 font-medium">+23%</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-green-400">Campaign Completed</div>
                          <div className="text-green-400 font-bold">Value: $890</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Acquisition Stats */}
                  <div>
                    <h4 className="text-white font-semibold mb-4">This Month's Progress</h4>
                    <div className="space-y-4">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">12</div>
                          <div className="text-sm text-green-300">High-Quality Backlinks</div>
                        </div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">68</div>
                          <div className="text-sm text-blue-300">Average Domain Authority</div>
                        </div>
                      </div>
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">$1,890</div>
                          <div className="text-sm text-purple-300">Estimated Link Value</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Competitor Intelligence View */}
          {activeView === 'competitor' && (
            <div className="space-y-6">
              {/* Competitive Intelligence Dashboard */}
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Users className="h-6 w-6 mr-2 text-red-400" />
                    Competitive Intelligence Warfare
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="bg-red-500 w-3 h-3 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-400">24/7 Monitoring</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm">Threats Detected</p>
                        <p className="text-2xl font-bold text-white">3</p>
                        <p className="text-red-200 text-sm">This Week</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Opportunities</p>
                        <p className="text-2xl font-bold text-white">12</p>
                        <p className="text-orange-200 text-sm">To Exploit</p>
                      </div>
                      <Target className="h-8 w-8 text-orange-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Market Share</p>
                        <p className="text-2xl font-bold text-white">23%</p>
                        <p className="text-blue-200 text-sm">vs Competitors</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Advantage</p>
                        <p className="text-2xl font-bold text-white">+$2.1M</p>
                        <p className="text-green-200 text-sm">Revenue Impact</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-200" />
                    </div>
                  </div>
                </div>
                
                {/* Competitor Analysis */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Competitor Threat Matrix</h4>
                  <div className="space-y-4">
                    {[
                      {
                        name: "McKinsey & Company",
                        threat: "high",
                        movement: "aggressive expansion",
                        weakness: "High pricing, slow delivery",
                        opportunity: "Undercut with faster AI solutions",
                        marketShare: 34
                      },
                      {
                        name: "Deloitte Consulting",
                        threat: "medium",
                        movement: "defensive positioning",
                        weakness: "Legacy processes, no AI integration",
                        opportunity: "Target their Fortune 500 clients",
                        marketShare: 28
                      },
                      {
                        name: "Boston Consulting Group",
                        threat: "high",
                        movement: "AI investment surge",
                        weakness: "Limited partnership expertise",
                        opportunity: "Leverage deep partnership knowledge",
                        marketShare: 22
                      },
                      {
                        name: "PwC Strategy&",
                        threat: "low",
                        movement: "stable operations",
                        weakness: "Generic offerings, no specialization",
                        opportunity: "Position as partnership specialists",
                        marketShare: 16
                      }
                    ].map((competitor, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${
                              competitor.threat === 'high' ? 'bg-red-500' :
                              competitor.threat === 'medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}></div>
                            <h5 className="font-medium text-white">{competitor.name}</h5>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-slate-400 text-sm">{competitor.marketShare}% market share</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              competitor.threat === 'high' ? 'bg-red-600 text-white' :
                              competitor.threat === 'medium' ? 'bg-yellow-600 text-white' :
                              'bg-green-600 text-white'
                            }`}>
                              {competitor.threat} threat
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400 mb-1">Current Movement</p>
                            <p className="text-white">{competitor.movement}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 mb-1">Key Weakness</p>
                            <p className="text-white">{competitor.weakness}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 mb-1">Our Opportunity</p>
                            <p className="text-teal-400">{competitor.opportunity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Market Intelligence */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Real-Time Market Intelligence</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">Latest Competitor Moves</h5>
                      <div className="space-y-3">
                        {[
                          { time: "2 hours ago", action: "McKinsey launched AI partnership tool", impact: "Monitor closely" },
                          { time: "1 day ago", action: "Deloitte acquired partnership startup", impact: "Assess threat level" },
                          { time: "3 days ago", action: "BCG hired Fortune 500 partnership expert", impact: "Counter-recruit" }
                        ].map((intel, index) => (
                          <div key={index} className="border-l-4 border-teal-500 pl-3">
                            <div className="flex justify-between items-start">
                              <p className="text-white text-sm">{intel.action}</p>
                              <span className="text-xs text-slate-400">{intel.time}</span>
                            </div>
                            <p className="text-teal-400 text-xs mt-1">{intel.impact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">AI Warfare Metrics</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">Content velocity vs competitors</span>
                          <span className="text-green-400 text-sm font-medium">+340% faster</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">SEO dominance score</span>
                          <span className="text-teal-400 text-sm font-medium">8.7/10</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">Client acquisition rate</span>
                          <span className="text-green-400 text-sm font-medium">+67% vs industry</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">Market positioning</span>
                          <span className="text-purple-400 text-sm font-medium">#2 in niche</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Chat View */}
          {activeView === 'ai_chat' && (
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2 text-purple-400" />
                  Ask Your AI SEO Consultant
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">AI Online</span>
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-6 mb-6 h-96 overflow-y-auto">
                {/* Chat Messages */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-slate-600/50 rounded-lg p-3 max-w-md">
                      <p className="text-white text-sm">Hi! I'm your AI SEO consultant. I've been analyzing your website performance and I have some exciting insights to share. What would you like to know about your SEO strategy?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-teal-600/50 rounded-lg p-3 max-w-md">
                      <p className="text-white text-sm">Why did my rankings improve last week?</p>
                    </div>
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{user?.email?.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-slate-600/50 rounded-lg p-3 max-w-md">
                      <p className="text-white text-sm">Great question! Your rankings improved because:
                      
1. The blog post "Advanced Partnership Strategies" I created last week is now ranking #8 for "partnership consulting"
2. I acquired 3 high-authority backlinks (DA 70+) from business consulting sites
3. I optimized your page load speed by 0.8 seconds

This combination boosted your overall domain authority and improved rankings for 12 target keywords. The projected monthly value from these improvements is $1,240!</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Ask me anything about your SEO performance..."
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all">
                  <span>Send</span>
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
              
              {/* Suggested Questions */}
              <div className="mt-6">
                <p className="text-slate-400 text-sm mb-3">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  <button className="bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 px-3 py-2 rounded-lg text-sm transition-colors">
                    What content should I create next?
                  </button>
                  <button className="bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 px-3 py-2 rounded-lg text-sm transition-colors">
                    How can I beat my competitors?
                  </button>
                  <button className="bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 px-3 py-2 rounded-lg text-sm transition-colors">
                    What's my ROI projection?
                  </button>
                  <button className="bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 px-3 py-2 rounded-lg text-sm transition-colors">
                    Show me technical issues to fix
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
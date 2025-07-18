import React, { useState, useEffect } from 'react';
import { apiService } from '../../lib/api';
import {
  Eye,
  TrendingUp,
  TrendingDown,
  Globe,
  Search,
  Users,
  Zap,
  Shield,
  Clock,
  BarChart3,
  Plus,
  RefreshCw,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Target,
  Hash,
  ExternalLink,
  Image,
  Code,
  Server,
  Smartphone,
  Monitor,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface Competitor {
  id: string;
  domain: string;
  name: string;
  lastScanned: string;
  score: number;
  status: 'active' | 'warning' | 'error';
  metrics: {
    seo: {
      score: number;
      title: string;
      metaDescription: string;
      h1Count: number;
      imageAltPercentage: number;
      internalLinks: number;
      externalLinks: number;
      pageSpeed: number;
      mobileFriendly: boolean;
      httpsEnabled: boolean;
    };
    content: {
      totalPages: number;
      averageLoadTime: number;
      wordCount: number;
      technologies: string[];
    };
    keywords: {
      averagePosition: number;
      totalKeywords: number;
      improvements: number;
      declines: number;
      topKeywords: Array<{
        keyword: string;
        position: number;
        change: number;
        volume: number;
      }>;
    };
    social: {
      totalFollowers: number;
      platforms: Array<{
        platform: string;
        handle: string;
        followers: number;
        engagement: number;
      }>;
    };
    technical: {
      cms: string;
      framework: string;
      server: string;
      cdn: string;
      analytics: string[];
      security: {
        hsts: boolean;
        csp: boolean;
        xFrameOptions: boolean;
      };
    };
  };
  alerts: Array<{
    type: 'keyword' | 'content' | 'technical' | 'social';
    message: string;
    severity: 'high' | 'medium' | 'low';
    timestamp: string;
  }>;
}

const CompetitorDashboard: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    loadCompetitors();
  }, []);

  const loadCompetitors = async () => {
    setLoading(true);
    try {
      const response = await apiService.call('/api/competitors', {
        requireAuth: true
      });
      setCompetitors(response.competitors || getDemoCompetitors());
    } catch (error) {
      console.error('Error loading competitors:', error);
      setCompetitors(getDemoCompetitors());
    } finally {
      setLoading(false);
    }
  };

  const scanCompetitor = async (competitorId: string) => {
    try {
      await apiService.call(`/api/competitors/${competitorId}/scan`, {
        method: 'POST',
        requireAuth: true
      });
      await loadCompetitors();
      }
    } catch (error) {
      console.error('Error scanning competitor:', error);
    }
  };

  const getDemoCompetitors = (): Competitor[] => [
    {
      id: '1',
      domain: 'example-competitor.com',
      name: 'Main Competitor',
      lastScanned: '2024-07-17T10:30:00Z',
      score: 85,
      status: 'active',
      metrics: {
        seo: {
          score: 88,
          title: 'Digital Marketing Agency | SEO & Web Design Services',
          metaDescription: 'Professional digital marketing services including SEO, web design, and social media management. Get results fast.',
          h1Count: 1,
          imageAltPercentage: 92,
          internalLinks: 45,
          externalLinks: 12,
          pageSpeed: 85,
          mobileFriendly: true,
          httpsEnabled: true
        },
        content: {
          totalPages: 28,
          averageLoadTime: 1850,
          wordCount: 2340,
          technologies: ['WordPress', 'Google Analytics', 'Cloudflare', 'jQuery']
        },
        keywords: {
          averagePosition: 12.4,
          totalKeywords: 45,
          improvements: 8,
          declines: 3,
          topKeywords: [
            { keyword: 'digital marketing agency', position: 5, change: 2, volume: 8900 },
            { keyword: 'seo services', position: 8, change: -1, volume: 12400 },
            { keyword: 'web design company', position: 15, change: 3, volume: 5600 },
            { keyword: 'social media marketing', position: 22, change: 0, volume: 9800 }
          ]
        },
        social: {
          totalFollowers: 18500,
          platforms: [
            { platform: 'LinkedIn', handle: 'example-competitor', followers: 8500, engagement: 4.2 },
            { platform: 'Twitter', handle: '@examplecomp', followers: 6200, engagement: 2.8 },
            { platform: 'Facebook', handle: 'examplecompetitor', followers: 3800, engagement: 3.1 }
          ]
        },
        technical: {
          cms: 'WordPress',
          framework: 'Unknown',
          server: 'Nginx',
          cdn: 'Cloudflare',
          analytics: ['Google Analytics', 'Google Tag Manager'],
          security: {
            hsts: true,
            csp: false,
            xFrameOptions: true
          }
        }
      },
      alerts: [
        {
          type: 'keyword',
          message: 'Gained 2 positions for "digital marketing agency"',
          severity: 'medium',
          timestamp: '2024-07-17T09:15:00Z'
        },
        {
          type: 'technical',
          message: 'Page speed improved to 85/100',
          severity: 'low',
          timestamp: '2024-07-17T08:30:00Z'
        }
      ]
    },
    {
      id: '2',
      domain: 'competitor-two.com',
      name: 'Growing Competitor',
      lastScanned: '2024-07-17T09:45:00Z',
      score: 72,
      status: 'warning',
      metrics: {
        seo: {
          score: 65,
          title: 'SEO & Marketing Solutions',
          metaDescription: 'We help businesses grow online with SEO and digital marketing strategies.',
          h1Count: 2,
          imageAltPercentage: 78,
          internalLinks: 32,
          externalLinks: 8,
          pageSpeed: 72,
          mobileFriendly: true,
          httpsEnabled: true
        },
        content: {
          totalPages: 15,
          averageLoadTime: 2340,
          wordCount: 1890,
          technologies: ['React', 'Next.js', 'Vercel', 'Google Analytics']
        },
        keywords: {
          averagePosition: 18.7,
          totalKeywords: 32,
          improvements: 12,
          declines: 2,
          topKeywords: [
            { keyword: 'seo consultant', position: 9, change: 4, volume: 3200 },
            { keyword: 'content marketing', position: 14, change: 6, volume: 7800 },
            { keyword: 'local seo', position: 25, change: -2, volume: 4500 }
          ]
        },
        social: {
          totalFollowers: 8900,
          platforms: [
            { platform: 'LinkedIn', handle: 'competitor-two', followers: 4200, engagement: 5.8 },
            { platform: 'Twitter', handle: '@comptwo', followers: 2800, engagement: 3.2 },
            { platform: 'Instagram', handle: '@competitor2', followers: 1900, engagement: 4.5 }
          ]
        },
        technical: {
          cms: 'Custom',
          framework: 'Next.js',
          server: 'Vercel',
          cdn: 'Vercel Edge',
          analytics: ['Google Analytics'],
          security: {
            hsts: true,
            csp: true,
            xFrameOptions: true
          }
        }
      },
      alerts: [
        {
          type: 'keyword',
          message: 'Significant improvement in content marketing rankings',
          severity: 'high',
          timestamp: '2024-07-17T07:20:00Z'
        },
        {
          type: 'social',
          message: 'LinkedIn engagement rate increased to 5.8%',
          severity: 'medium',
          timestamp: '2024-07-16T15:45:00Z'
        }
      ]
    }
  ];

  const filteredCompetitors = competitors.filter(competitor => {
    if (filterStatus === 'all') return true;
    return competitor.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

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
              Competitor Intelligence
            </h1>
            <p className="text-slate-300">Monitor, analyze, and stay ahead of your competition</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Competitors</option>
              <option value="active">Active</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              <span>Add Competitor</span>
            </button>
            
            <button
              onClick={loadCompetitors}
              className="bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 hover:bg-slate-600/80 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 transform transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <StatCard
            title="Competitors"
            value={competitors.length.toString()}
            growth={8.3}
            icon={Globe}
            color="teal"
          />
          <StatCard
            title="Avg Score"
            value={Math.round(competitors.reduce((sum, c) => sum + c.score, 0) / competitors.length || 0).toString()}
            growth={-2.1}
            icon={BarChart3}
            color="blue"
          />
          <StatCard
            title="Active Alerts"
            value={competitors.reduce((sum, c) => sum + c.alerts.length, 0).toString()}
            growth={15.7}
            icon={AlertTriangle}
            color="yellow"
          />
          <StatCard
            title="Last Scan"
            value="2h ago"
            growth={0}
            icon={Clock}
            color="purple"
          />
        </div>

        {/* View Toggle */}
        <div className={`flex items-center justify-between mb-6 transform transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'overview' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-slate-700/50 text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'detailed' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-slate-700/50 text-slate-400 hover:text-white'
              }`}
            >
              Detailed Analysis
            </button>
          </div>
          
          <button className="bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 hover:bg-slate-600/80 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Competitors Grid */}
        {viewMode === 'overview' ? (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {filteredCompetitors.map(competitor => (
              <CompetitorCard
                key={competitor.id}
                competitor={competitor}
                onScan={() => scanCompetitor(competitor.id)}
                onViewDetails={() => setSelectedCompetitor(competitor)}
              />
            ))}
          </div>
        ) : (
          <div className={`space-y-6 transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {filteredCompetitors.map(competitor => (
              <DetailedCompetitorView
                key={competitor.id}
                competitor={competitor}
                onScan={() => scanCompetitor(competitor.id)}
              />
            ))}
          </div>
        )}

        {filteredCompetitors.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No competitors found</h3>
            <p className="text-slate-400 mb-4">Add competitors to start monitoring their performance</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Add Your First Competitor
            </button>
          </div>
        )}
      </div>

      {/* Competitor Detail Modal */}
      {selectedCompetitor && (
        <CompetitorDetailModal
          competitor={selectedCompetitor}
          onClose={() => setSelectedCompetitor(null)}
        />
      )}

      {/* Add Competitor Modal */}
      {showAddModal && (
        <AddCompetitorModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newCompetitor) => {
            setCompetitors(prev => [...prev, { ...newCompetitor, id: Date.now().toString() }]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

// Stat Card Component (reused)
interface StatCardProps {
  title: string;
  value: string;
  growth: number;
  icon: any;
  color: 'teal' | 'blue' | 'green' | 'purple' | 'yellow';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, growth, icon: Icon, color }) => {
  const colors = {
    teal: 'text-teal-400 bg-teal-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/20'
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colors[color]} rounded-lg`}>
          <Icon className={`h-6 w-6 ${colors[color].split(' ')[0]}`} />
        </div>
        {growth !== 0 && (
          <div className={`flex items-center space-x-1 text-sm ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {growth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span>{Math.abs(growth)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{title}</div>
    </div>
  );
};

// Competitor Card Component
interface CompetitorCardProps {
  competitor: Competitor;
  onScan: () => void;
  onViewDetails: () => void;
}

const CompetitorCard: React.FC<CompetitorCardProps> = ({ competitor, onScan, onViewDetails }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-teal-200 transition-colors duration-300">
            {competitor.name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-slate-400">{competitor.domain}</span>
            <ExternalLink className="h-4 w-4 text-slate-500" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(competitor.status)}`}>
            {competitor.status}
          </span>
          <div className={`text-2xl font-bold ${getScoreColor(competitor.score)}`}>
            {competitor.score}
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Search className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-slate-400">SEO Score</span>
          </div>
          <div className="text-lg font-bold text-white">{competitor.metrics.seo.score}/100</div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm text-slate-400">Keywords</span>
          </div>
          <div className="text-lg font-bold text-white">{competitor.metrics.keywords.totalKeywords}</div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Users className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-slate-400">Followers</span>
          </div>
          <div className="text-lg font-bold text-white">
            {(competitor.metrics.social.totalFollowers / 1000).toFixed(1)}K
          </div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-slate-400">Load Time</span>
          </div>
          <div className="text-lg font-bold text-white">
            {(competitor.metrics.content.averageLoadTime / 1000).toFixed(1)}s
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      {competitor.alerts.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Recent Alerts</h4>
          <div className="space-y-2">
            {competitor.alerts.slice(0, 2).map((alert, index) => (
              <div key={index} className={`px-3 py-2 rounded-lg text-sm ${getSeverityColor(alert.severity)}`}>
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technologies */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Technologies</h4>
        <div className="flex flex-wrap gap-1">
          {competitor.metrics.content.technologies.slice(0, 4).map(tech => (
            <span key={tech} className="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded-md">
              {tech}
            </span>
          ))}
          {competitor.metrics.content.technologies.length > 4 && (
            <span className="px-2 py-1 bg-slate-600/50 text-slate-400 text-xs rounded-md">
              +{competitor.metrics.content.technologies.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="text-xs text-slate-400">
          Last scan: {new Date(competitor.lastScanned).toLocaleDateString()}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onViewDetails}
            className="px-3 py-1 bg-slate-600/50 hover:bg-slate-600 text-white text-sm rounded-md transition-all duration-200"
          >
            View Details
          </button>
          <button
            onClick={onScan}
            className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white text-sm rounded-md transition-all duration-200 flex items-center space-x-1"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Scan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Detailed Competitor View Component
interface DetailedCompetitorViewProps {
  competitor: Competitor;
  onScan: () => void;
}

const DetailedCompetitorView: React.FC<DetailedCompetitorViewProps> = ({ competitor, onScan }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">{competitor.name}</h3>
          <p className="text-slate-400">{competitor.domain}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`text-3xl font-bold ${getScoreColor(competitor.score)}`}>
            {competitor.score}
          </div>
          <button
            onClick={onScan}
            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Scan Now</span>
          </button>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* SEO Metrics */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-400" />
            <span>SEO</span>
          </h4>
          <div className="space-y-3">
            <MetricItem label="Overall Score" value={`${competitor.metrics.seo.score}/100`} />
            <MetricItem label="Page Speed" value={`${competitor.metrics.seo.pageSpeed}/100`} />
            <MetricItem label="Mobile Friendly" value={competitor.metrics.seo.mobileFriendly ? 'Yes' : 'No'} />
            <MetricItem label="HTTPS" value={competitor.metrics.seo.httpsEnabled ? 'Yes' : 'No'} />
            <MetricItem label="Alt Text Coverage" value={`${competitor.metrics.seo.imageAltPercentage}%`} />
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Hash className="h-5 w-5 text-green-400" />
            <span>Keywords</span>
          </h4>
          <div className="space-y-3">
            <MetricItem label="Total Keywords" value={competitor.metrics.keywords.totalKeywords.toString()} />
            <MetricItem label="Avg Position" value={competitor.metrics.keywords.averagePosition.toFixed(1)} />
            <MetricItem label="Improvements" value={competitor.metrics.keywords.improvements.toString()} color="green" />
            <MetricItem label="Declines" value={competitor.metrics.keywords.declines.toString()} color="red" />
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-400" />
            <span>Social</span>
          </h4>
          <div className="space-y-3">
            <MetricItem label="Total Followers" value={(competitor.metrics.social.totalFollowers / 1000).toFixed(1) + 'K'} />
            <MetricItem label="Platforms" value={competitor.metrics.social.platforms.length.toString()} />
            {competitor.metrics.social.platforms.slice(0, 2).map(platform => (
              <MetricItem 
                key={platform.platform}
                label={platform.platform} 
                value={`${(platform.followers / 1000).toFixed(1)}K`} 
              />
            ))}
          </div>
        </div>

        {/* Technical */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Code className="h-5 w-5 text-yellow-400" />
            <span>Technical</span>
          </h4>
          <div className="space-y-3">
            <MetricItem label="CMS" value={competitor.metrics.technical.cms} />
            <MetricItem label="Framework" value={competitor.metrics.technical.framework} />
            <MetricItem label="CDN" value={competitor.metrics.technical.cdn} />
            <MetricItem label="Server" value={competitor.metrics.technical.server} />
            <MetricItem label="Analytics" value={competitor.metrics.technical.analytics.join(', ')} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Item Component
interface MetricItemProps {
  label: string;
  value: string;
  color?: 'default' | 'green' | 'red' | 'yellow';
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value, color = 'default' }) => {
  const colors = {
    default: 'text-white',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400'
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-medium ${colors[color]}`}>{value}</span>
    </div>
  );
};

// Competitor Detail Modal Component
interface CompetitorDetailModalProps {
  competitor: Competitor;
  onClose: () => void;
}

const CompetitorDetailModal: React.FC<CompetitorDetailModalProps> = ({ competitor, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h2 className="text-2xl font-bold text-white">{competitor.name}</h2>
            <p className="text-slate-400">{competitor.domain}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Top Keywords */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Top Keywords</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Keyword</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-medium">Position</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-medium">Change</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-medium">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {competitor.metrics.keywords.topKeywords.map((keyword, index) => (
                    <tr key={index} className="border-b border-slate-700/30">
                      <td className="py-3 px-4 text-white">{keyword.keyword}</td>
                      <td className="py-3 px-4 text-right text-slate-300">{keyword.position}</td>
                      <td className={`py-3 px-4 text-right ${keyword.change > 0 ? 'text-red-400' : keyword.change < 0 ? 'text-green-400' : 'text-slate-400'}`}>
                        {keyword.change > 0 ? '+' : ''}{keyword.change}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">{keyword.volume.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Social Platforms */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Social Media Presence</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {competitor.metrics.social.platforms.map(platform => (
                <div key={platform.platform} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{platform.platform}</h4>
                    <span className="text-slate-400 text-sm">{platform.handle}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-400">Followers</span>
                      <div className="text-white font-medium">{platform.followers.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Engagement</span>
                      <div className="text-white font-medium">{platform.engagement}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {competitor.alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm opacity-75 mt-1">
                        {new Date(alert.timestamp).toLocaleDateString()} • {alert.type}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-black/20 rounded-md">
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Competitor Modal Component
interface AddCompetitorModalProps {
  onClose: () => void;
  onAdd: (competitor: Partial<Competitor>) => void;
}

const AddCompetitorModal: React.FC<AddCompetitorModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    domain: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      lastScanned: new Date().toISOString(),
      score: 0,
      status: 'active',
      metrics: {
        seo: { score: 0, title: '', metaDescription: '', h1Count: 0, imageAltPercentage: 0, internalLinks: 0, externalLinks: 0, pageSpeed: 0, mobileFriendly: false, httpsEnabled: false },
        content: { totalPages: 0, averageLoadTime: 0, wordCount: 0, technologies: [] },
        keywords: { averagePosition: 0, totalKeywords: 0, improvements: 0, declines: 0, topKeywords: [] },
        social: { totalFollowers: 0, platforms: [] },
        technical: { cms: '', framework: '', server: '', cdn: '', analytics: [], security: { hsts: false, csp: false, xFrameOptions: false } }
      },
      alerts: []
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">Add Competitor</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-slate-300 font-medium mb-2">Competitor Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., Main Competitor"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-2">Domain</label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              placeholder="competitor.com"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-600/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all duration-300 hover:scale-105"
            >
              Add & Scan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-500/20';
    case 'warning': return 'text-yellow-400 bg-yellow-500/20';
    case 'error': return 'text-red-400 bg-red-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'text-red-400 bg-red-500/20';
    case 'medium': return 'text-yellow-400 bg-yellow-500/20';
    case 'low': return 'text-green-400 bg-green-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

export default CompetitorDashboard;
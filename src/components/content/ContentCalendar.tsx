import React, { useState, useEffect } from 'react';
import { apiService } from '../../lib/api';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  TrendingUp,
  Target,
  Zap,
  Image,
  FileText,
  Video,
  Hash,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Send,
  BarChart3,
  Users,
  Heart
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'blog' | 'social' | 'email' | 'video';
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledDate: string;
  platform?: string[];
  aiGenerated: boolean;
  performance?: {
    views: number;
    engagement: number;
    clicks: number;
    shares: number;
  };
  content: string;
  tags: string[];
  thumbnail?: string;
}

const ContentCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    loadContentItems();
  }, []);

  const loadContentItems = async () => {
    setLoading(true);
    try {
      const response = await apiService.call('/api/content/calendar', {
        requireAuth: true
      });
      setContentItems(response.items || getDemoContent());
    } catch (error) {
      console.error('Error loading content:', error);
      setContentItems(getDemoContent());
    } finally {
      setLoading(false);
    }
  };

  const getDemoContent = (): ContentItem[] => [
    {
      id: '1',
      title: 'Ultimate SEO Guide for Local Businesses',
      type: 'blog',
      status: 'published',
      scheduledDate: '2024-07-15',
      aiGenerated: true,
      performance: { views: 2450, engagement: 87, clicks: 156, shares: 23 },
      content: 'Complete guide to local SEO optimization...',
      tags: ['SEO', 'Local Business', 'Marketing'],
      thumbnail: '/blog-thumbnail-1.jpg'
    },
    {
      id: '2',
      title: 'Social Media Post: Web Design Tips',
      type: 'social',
      status: 'scheduled',
      scheduledDate: '2024-07-17',
      platform: ['Twitter', 'LinkedIn'],
      aiGenerated: true,
      content: '5 essential web design tips that convert visitors into customers...',
      tags: ['Web Design', 'Conversion', 'Tips']
    },
    {
      id: '3',
      title: 'Weekly Newsletter: Digital Marketing Trends',
      type: 'email',
      status: 'draft',
      scheduledDate: '2024-07-18',
      aiGenerated: false,
      content: 'This week in digital marketing...',
      tags: ['Newsletter', 'Trends', 'Marketing']
    },
    {
      id: '4',
      title: 'Tutorial: Setting Up Google Analytics',
      type: 'video',
      status: 'scheduled',
      scheduledDate: '2024-07-20',
      platform: ['YouTube', 'Website'],
      aiGenerated: false,
      content: 'Step-by-step tutorial for GA4 setup...',
      tags: ['Analytics', 'Tutorial', 'Google']
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getContentForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return contentItems.filter(item => item.scheduledDate === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return FileText;
      case 'social': return Hash;
      case 'email': return Send;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-500/20';
      case 'scheduled': return 'text-blue-400 bg-blue-500/20';
      case 'draft': return 'text-yellow-400 bg-yellow-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filterContentByType = (type: string) => {
    return type === 'all' ? contentItems : contentItems.filter(item => item.type === type);
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
              Content Calendar
            </h1>
            <p className="text-slate-300">Plan, schedule, and track your content performance</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Content</option>
              <option value="blog">Blog Posts</option>
              <option value="social">Social Media</option>
              <option value="email">Email</option>
              <option value="video">Video</option>
            </select>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              <span>Create Content</span>
            </button>
            
            <button
              onClick={loadContentItems}
              className="bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 hover:bg-slate-600/80 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 transform transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <StatCard
            title="Total Content"
            value={contentItems.length.toString()}
            growth={12.5}
            icon={FileText}
            color="teal"
          />
          <StatCard
            title="Published"
            value={contentItems.filter(c => c.status === 'published').length.toString()}
            growth={8.3}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Scheduled"
            value={contentItems.filter(c => c.status === 'scheduled').length.toString()}
            growth={-2.1}
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="AI Generated"
            value={contentItems.filter(c => c.aiGenerated).length.toString()}
            growth={25.7}
            icon={Zap}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className={`lg:col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 transform transition-all duration-1000 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-slate-400 font-medium text-sm">
                  {day}
                </div>
              ))}
              
              {getDaysInMonth(currentDate).map((date, index) => {
                const content = getContentForDate(date);
                const isSelected = selectedDate && date && 
                  date.toDateString() === selectedDate.toDateString();
                
                return (
                  <div
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    className={`
                      min-h-[80px] p-2 border border-slate-700/30 rounded-lg cursor-pointer transition-all duration-200
                      ${date ? 'hover:bg-slate-700/20' : 'opacity-50'}
                      ${isSelected ? 'bg-teal-600/20 border-teal-500/50' : ''}
                    `}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isSelected ? 'text-teal-300' : 'text-white'
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {content.slice(0, 2).map(item => {
                            const Icon = getTypeIcon(item.type);
                            return (
                              <div
                                key={item.id}
                                className={`
                                  text-xs px-2 py-1 rounded-md flex items-center space-x-1
                                  ${getStatusColor(item.status)}
                                `}
                              >
                                <Icon className="h-3 w-3" />
                                <span className="truncate">{item.title.slice(0, 15)}...</span>
                              </div>
                            );
                          })}
                          {content.length > 2 && (
                            <div className="text-xs text-slate-400">
                              +{content.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Details */}
          <div className={`bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h3 className="text-xl font-bold text-white mb-4">
              {selectedDate ? 
                `Content for ${selectedDate.toLocaleDateString()}` : 
                'Select a date'
              }
            </h3>
            
            <div className="space-y-4">
              {selectedDate ? (
                getContentForDate(selectedDate).length > 0 ? (
                  getContentForDate(selectedDate).map(item => (
                    <ContentCard key={item.id} content={item} />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content scheduled for this date</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 text-teal-400 hover:text-teal-300 transition-colors duration-200"
                    >
                      Create content for this date
                    </button>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a date to view content</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className={`mt-8 bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 transform transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h3 className="text-xl font-bold text-white mb-6">All Content</h3>
          <ContentTable content={filterContentByType(selectedType)} />
        </div>
      </div>

      {/* Create Content Modal */}
      {showCreateModal && (
        <CreateContentModal
          onClose={() => setShowCreateModal(false)}
          onSave={(newContent) => {
            setContentItems(prev => [...prev, { ...newContent, id: Date.now().toString() }]);
            setShowCreateModal(false);
          }}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  growth: number;
  icon: any;
  color: 'teal' | 'blue' | 'green' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, growth, icon: Icon, color }) => {
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
          <TrendingUp className="h-4 w-4" />
          <span>{Math.abs(growth)}%</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{title}</div>
    </div>
  );
};

// Content Card Component
const ContentCard: React.FC<{ content: ContentItem }> = ({ content }) => {
  const Icon = getTypeIcon(content.type);
  
  return (
    <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-teal-400" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
            {content.status}
          </span>
          {content.aiGenerated && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
              AI
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1 text-slate-400 hover:text-white transition-colors duration-200">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-1 text-slate-400 hover:text-red-400 transition-colors duration-200">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <h4 className="text-white font-medium mb-2">{content.title}</h4>
      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{content.content}</p>
      
      {content.performance && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1 text-blue-400">
            <Eye className="h-3 w-3" />
            <span>{content.performance.views}</span>
          </div>
          <div className="flex items-center space-x-1 text-green-400">
            <Heart className="h-3 w-3" />
            <span>{content.performance.engagement}%</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-1 mt-3">
        {content.tags.slice(0, 2).map(tag => (
          <span key={tag} className="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded-md">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// Content Table Component
const ContentTable: React.FC<{ content: ContentItem[] }> = ({ content }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-600/50">
            <th className="text-left py-3 px-4 text-slate-300 font-medium">Content</th>
            <th className="text-left py-3 px-4 text-slate-300 font-medium">Type</th>
            <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
            <th className="text-left py-3 px-4 text-slate-300 font-medium">Scheduled</th>
            <th className="text-left py-3 px-4 text-slate-300 font-medium">Performance</th>
            <th className="text-right py-3 px-4 text-slate-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {content.map(item => {
            const Icon = getTypeIcon(item.type);
            return (
              <tr key={item.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    {item.aiGenerated && <Zap className="h-4 w-4 text-purple-400" />}
                    <div>
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-sm text-slate-400">{item.content.slice(0, 50)}...</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-teal-400" />
                    <span className="text-slate-300 capitalize">{item.type}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {new Date(item.scheduledDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  {item.performance ? (
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-400">{item.performance.views} views</span>
                      <span className="text-green-400">{item.performance.engagement}% eng.</span>
                    </div>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-1 text-slate-400 hover:text-white transition-colors duration-200">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-white transition-colors duration-200">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-400 transition-colors duration-200">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Create Content Modal Component
interface CreateContentModalProps {
  onClose: () => void;
  onSave: (content: Partial<ContentItem>) => void;
  selectedDate: Date | null;
}

const CreateContentModal: React.FC<CreateContentModalProps> = ({ onClose, onSave, selectedDate }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'blog' as ContentItem['type'],
    content: '',
    scheduledDate: selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    tags: '',
    aiGenerated: false,
    platform: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      status: 'draft',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Content</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-300 font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter content title..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentItem['type'] })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="blog">Blog Post</option>
                <option value="social">Social Media</option>
                <option value="email">Email</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Scheduled Date</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={6}
              placeholder="Enter your content..."
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="SEO, Marketing, Tips (comma separated)"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.aiGenerated}
                onChange={(e) => setFormData({ ...formData, aiGenerated: e.target.checked })}
                className="w-4 h-4 text-teal-600 bg-slate-700 border-slate-600 rounded focus:ring-teal-500"
              />
              <span className="text-slate-300">AI Generated</span>
            </label>
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
              className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Create Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper functions
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'blog': return FileText;
    case 'social': return Hash;
    case 'email': return Send;
    case 'video': return Video;
    default: return FileText;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return 'text-green-400 bg-green-500/20';
    case 'scheduled': return 'text-blue-400 bg-blue-500/20';
    case 'draft': return 'text-yellow-400 bg-yellow-500/20';
    case 'failed': return 'text-red-400 bg-red-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

export default ContentCalendar;
import React, { useState, useEffect } from 'react';
import {
  Save,
  Copy,
  Search,
  Filter,
  Star,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  BookOpen,
  Zap,
  Hash,
  FileText,
  Send,
  Video,
  TrendingUp,
  Heart,
  Users,
  BarChart3,
  Plus,
  RefreshCw,
  Tag
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  type: 'blog' | 'social' | 'email' | 'video' | 'ad' | 'landing';
  content: string;
  category: string;
  tags: string[];
  performance: {
    views: number;
    engagement: number;
    clicks: number;
    conversions: number;
    rating: number;
  };
  aiGenerated: boolean;
  createdDate: string;
  lastUsed: string;
  usageCount: number;
  isFavorite: boolean;
  preview?: string;
  variables?: string[]; // Placeholders like {company_name}, {product}
}

const TemplateLibrary: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/templates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      setTemplates(data.templates || getDemoTemplates());
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates(getDemoTemplates());
    } finally {
      setLoading(false);
    }
  };

  const getDemoTemplates = (): Template[] => [
    {
      id: '1',
      title: 'High-Converting Landing Page Headlines',
      type: 'landing',
      content: `Unlock {benefit} in Just {timeframe} - Guaranteed!

Transform Your {pain_point} Into {desired_outcome} With Our Proven {solution_type}

Join {social_proof_number} {target_audience} Who've Already {achievement}`,
      category: 'Conversion',
      tags: ['headlines', 'landing-page', 'conversion', 'copywriting'],
      performance: {
        views: 5420,
        engagement: 92,
        clicks: 1680,
        conversions: 34,
        rating: 4.9
      },
      aiGenerated: true,
      createdDate: '2024-06-15',
      lastUsed: '2024-07-16',
      usageCount: 23,
      isFavorite: true,
      preview: 'Unlock Better SEO in Just 30 Days - Guaranteed!',
      variables: ['benefit', 'timeframe', 'pain_point', 'desired_outcome', 'solution_type', 'social_proof_number', 'target_audience', 'achievement']
    },
    {
      id: '2',
      title: 'Social Media Engagement Posts',
      type: 'social',
      content: `💡 Quick tip for {industry} professionals:

{tip_content}

This simple strategy helped {client_example} {result_achieved}.

What's your biggest {challenge_area} right now? 
Drop a comment below! 👇

#marketing #seo #businesstips #growth`,
      category: 'Engagement',
      tags: ['social-media', 'engagement', 'tips', 'linkedin'],
      performance: {
        views: 12350,
        engagement: 78,
        clicks: 890,
        conversions: 12,
        rating: 4.7
      },
      aiGenerated: true,
      createdDate: '2024-06-20',
      lastUsed: '2024-07-15',
      usageCount: 41,
      isFavorite: true,
      preview: '💡 Quick tip for marketing professionals...',
      variables: ['industry', 'tip_content', 'client_example', 'result_achieved', 'challenge_area']
    },
    {
      id: '3',
      title: 'Email Newsletter Welcome Series',
      type: 'email',
      content: `Subject: Welcome to {company_name} - Your {benefit} Journey Starts Now!

Hi {first_name},

Welcome to the {company_name} family! 🎉

I'm {sender_name}, and I'm thrilled you've joined our community of {community_description}.

Over the next few days, I'll be sharing:
✓ {benefit_1}
✓ {benefit_2}  
✓ {benefit_3}

But first, I'd love to know: what's your biggest {challenge_area} right now?

Simply reply to this email and let me know!

Talk soon,
{sender_name}`,
      category: 'Onboarding',
      tags: ['email', 'welcome', 'onboarding', 'sequence'],
      performance: {
        views: 8960,
        engagement: 85,
        clicks: 1240,
        conversions: 28,
        rating: 4.8
      },
      aiGenerated: true,
      createdDate: '2024-06-25',
      lastUsed: '2024-07-14',
      usageCount: 17,
      isFavorite: false,
      variables: ['company_name', 'benefit', 'first_name', 'sender_name', 'community_description', 'benefit_1', 'benefit_2', 'benefit_3', 'challenge_area']
    },
    {
      id: '4',
      title: 'SEO Blog Post Structure',
      type: 'blog',
      content: `# The Ultimate Guide to {main_topic}: {promise} in {timeframe}

## Introduction
Are you struggling with {pain_point}? You're not alone. {statistic} of {target_audience} face this challenge daily.

In this comprehensive guide, you'll discover:
- {benefit_1}
- {benefit_2}
- {benefit_3}

## What is {main_topic}?
{definition_paragraph}

## Why {main_topic} Matters for {target_audience}
{importance_explanation}

## {number} Proven Strategies for {main_topic}

### 1. {strategy_1_title}
{strategy_1_content}

### 2. {strategy_2_title}  
{strategy_2_content}

### 3. {strategy_3_title}
{strategy_3_content}

## Real Results: {case_study_title}
{case_study_content}

## Common Mistakes to Avoid
{mistakes_list}

## Next Steps
{call_to_action}

## Conclusion
{summary_paragraph}`,
      category: 'SEO',
      tags: ['blog', 'seo', 'structure', 'content-marketing'],
      performance: {
        views: 15670,
        engagement: 81,
        clicks: 2340,
        conversions: 45,
        rating: 4.6
      },
      aiGenerated: true,
      createdDate: '2024-07-01',
      lastUsed: '2024-07-16',
      usageCount: 8,
      isFavorite: true,
      variables: ['main_topic', 'promise', 'timeframe', 'pain_point', 'statistic', 'target_audience', 'benefit_1', 'benefit_2', 'benefit_3']
    }
  ];

  const categories = ['all', 'Conversion', 'Engagement', 'Onboarding', 'SEO', 'Sales'];
  const types = ['all', 'blog', 'social', 'email', 'video', 'ad', 'landing'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const toggleFavorite = async (templateId: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? { ...template, isFavorite: !template.isFavorite }
          : template
      )
    );
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return FileText;
      case 'social': return Hash;
      case 'email': return Send;
      case 'video': return Video;
      case 'ad': return TrendingUp;
      case 'landing': return BarChart3;
      default: return FileText;
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4.0) return 'text-yellow-400';
    if (rating >= 3.5) return 'text-orange-400';
    return 'text-red-400';
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
              Template Library
            </h1>
            <p className="text-slate-300">Save, organize, and reuse your best-performing content</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              <span>New Template</span>
            </button>
            
            <button
              onClick={loadTemplates}
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
            title="Total Templates"
            value={templates.length.toString()}
            growth={15.3}
            icon={BookOpen}
            color="teal"
          />
          <StatCard
            title="AI Generated"
            value={templates.filter(t => t.aiGenerated).length.toString()}
            growth={28.7}
            icon={Zap}
            color="purple"
          />
          <StatCard
            title="Favorites"
            value={templates.filter(t => t.isFavorite).length.toString()}
            growth={5.2}
            icon={Star}
            color="yellow"
          />
          <StatCard
            title="Total Usage"
            value={templates.reduce((sum, t) => sum + t.usageCount, 0).toString()}
            growth={22.1}
            icon={TrendingUp}
            color="green"
          />
        </div>

        {/* Filters */}
        <div className={`bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 mb-8 transform transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Search Templates</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, content, or tags..."
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-slate-600/50 text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-slate-600/50 text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className={`transform transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onToggleFavorite={toggleFavorite}
                  onCopy={copyToClipboard}
                  onView={setSelectedTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
              <TemplateTable
                templates={filteredTemplates}
                onToggleFavorite={toggleFavorite}
                onCopy={copyToClipboard}
                onView={setSelectedTemplate}
              />
            </div>
          )}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
            <p className="text-slate-400 mb-4">Try adjusting your search criteria or create a new template</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Create Your First Template
            </button>
          </div>
        )}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <TemplateDetailModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onCopy={copyToClipboard}
        />
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <CreateTemplateModal
          onClose={() => setShowCreateModal(false)}
          onSave={(newTemplate) => {
            setTemplates(prev => [...prev, { ...newTemplate, id: Date.now().toString() }]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

// Stat Card Component (reused from earlier)
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

// Template Card Component
interface TemplateCardProps {
  template: Template;
  onToggleFavorite: (id: string) => void;
  onCopy: (content: string) => void;
  onView: (template: Template) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onToggleFavorite, onCopy, onView }) => {
  const Icon = getTypeIcon(template.type);
  
  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon className="h-6 w-6 text-teal-400" />
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-teal-200 transition-colors duration-300">
              {template.title}
            </h3>
            <p className="text-sm text-slate-400">{template.category}</p>
          </div>
        </div>
        
        <button
          onClick={() => onToggleFavorite(template.id)}
          className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
            template.isFavorite
              ? 'text-yellow-400 hover:text-yellow-300'
              : 'text-slate-400 hover:text-yellow-400'
          }`}
        >
          <Star className={`h-5 w-5 ${template.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Preview */}
      <div className="mb-4">
        <p className="text-slate-300 text-sm line-clamp-3">
          {template.preview || template.content.slice(0, 120) + '...'}
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-blue-400" />
          <span className="text-slate-300">{template.performance.views}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Heart className="h-4 w-4 text-red-400" />
          <span className="text-slate-300">{template.performance.engagement}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-green-400" />
          <span className="text-slate-300">{template.usageCount} uses</span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-slate-300">{template.performance.rating}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {template.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded-md">
            #{tag}
          </span>
        ))}
        {template.tags.length > 3 && (
          <span className="px-2 py-1 bg-slate-600/50 text-slate-400 text-xs rounded-md">
            +{template.tags.length - 3}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center space-x-2">
          {template.aiGenerated && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-md flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>AI</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(template)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onCopy(template.content)}
            className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-700 rounded-lg transition-all duration-200"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200">
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Template Table Component
interface TemplateTableProps {
  templates: Template[];
  onToggleFavorite: (id: string) => void;
  onCopy: (content: string) => void;
  onView: (template: Template) => void;
}

const TemplateTable: React.FC<TemplateTableProps> = ({ templates, onToggleFavorite, onCopy, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-600/50">
            <th className="text-left py-4 px-6 text-slate-300 font-medium">Template</th>
            <th className="text-left py-4 px-6 text-slate-300 font-medium">Type</th>
            <th className="text-left py-4 px-6 text-slate-300 font-medium">Performance</th>
            <th className="text-left py-4 px-6 text-slate-300 font-medium">Usage</th>
            <th className="text-right py-4 px-6 text-slate-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(template => {
            const Icon = getTypeIcon(template.type);
            return (
              <tr key={template.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-teal-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-white font-medium">{template.title}</h4>
                        {template.isFavorite && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                        {template.aiGenerated && <Zap className="h-4 w-4 text-purple-400" />}
                      </div>
                      <p className="text-sm text-slate-400">{template.category} • {template.tags.length} tags</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-slate-600/50 text-slate-300 text-sm rounded-md capitalize">
                    {template.type}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-blue-400">{template.performance.views} views</span>
                    <span className="text-green-400">{template.performance.engagement}% eng</span>
                    <span className="text-yellow-400">{template.performance.rating}★</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-slate-300">
                    <div>{template.usageCount} times</div>
                    <div className="text-slate-400">Last: {new Date(template.lastUsed).toLocaleDateString()}</div>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onToggleFavorite(template.id)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        template.isFavorite
                          ? 'text-yellow-400 hover:text-yellow-300'
                          : 'text-slate-400 hover:text-yellow-400'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${template.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => onView(template)}
                      className="p-2 text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onCopy(template.content)}
                      className="p-2 text-slate-400 hover:text-teal-400 transition-colors duration-200"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white transition-colors duration-200">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-400 transition-colors duration-200">
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

// Template Detail Modal Component
interface TemplateDetailModalProps {
  template: Template;
  onClose: () => void;
  onCopy: (content: string) => void;
}

const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({ template, onClose, onCopy }) => {
  const Icon = getTypeIcon(template.type);
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <Icon className="h-8 w-8 text-teal-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">{template.title}</h2>
              <p className="text-slate-400">{template.category} • {template.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onCopy(template.content)}
              className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Template</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{template.performance.views}</div>
              <div className="text-sm text-slate-400">Views</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{template.performance.engagement}%</div>
              <div className="text-sm text-slate-400">Engagement</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{template.usageCount}</div>
              <div className="text-sm text-slate-400">Uses</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{template.performance.rating}</div>
              <div className="text-sm text-slate-400">Rating</div>
            </div>
          </div>

          {/* Variables */}
          {template.variables && template.variables.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Template Variables</h3>
              <div className="flex flex-wrap gap-2">
                {template.variables.map(variable => (
                  <span key={variable} className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-md text-sm border border-teal-500/30">
                    {`{${variable}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Template Content</h3>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
              <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm">
                {template.content}
              </pre>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {template.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-600/50 text-slate-300 rounded-md text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-white font-medium mb-2">Created</h4>
              <p className="text-slate-400">{new Date(template.createdDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Last Used</h4>
              <p className="text-slate-400">{new Date(template.lastUsed).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create Template Modal Component
interface CreateTemplateModalProps {
  onClose: () => void;
  onSave: (template: Partial<Template>) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'blog' as Template['type'],
    content: '',
    category: '',
    tags: '',
    aiGenerated: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const variables = (formData.content.match(/\{([^}]+)\}/g) || [])
      .map(match => match.slice(1, -1));
    
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      variables: [...new Set(variables)], // Remove duplicates
      performance: {
        views: 0,
        engagement: 0,
        clicks: 0,
        conversions: 0,
        rating: 0
      },
      createdDate: new Date().toISOString().split('T')[0],
      lastUsed: new Date().toISOString().split('T')[0],
      usageCount: 0,
      isFavorite: false
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-2xl font-bold text-white">Create New Template</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-slate-300 font-medium mb-2">Template Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              placeholder="Enter template title..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Template['type'] })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="blog">Blog Post</option>
                <option value="social">Social Media</option>
                <option value="email">Email</option>
                <option value="video">Video</option>
                <option value="ad">Advertisement</option>
                <option value="landing">Landing Page</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., Conversion, SEO, Engagement..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-2">Template Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              rows={10}
              placeholder="Enter your template content. Use {variable_name} for placeholders..."
              required
            />
            <p className="text-sm text-slate-400 mt-2">
              Tip: Use curly braces for variables like {`{company_name}`} or {`{product}`}
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
              placeholder="seo, marketing, conversion (comma separated)"
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
              <span className="text-slate-300">AI Generated Content</span>
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
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'blog': return FileText;
    case 'social': return Hash;
    case 'email': return Send;
    case 'video': return Video;
    case 'ad': return TrendingUp;
    case 'landing': return BarChart3;
    default: return FileText;
  }
};

export default TemplateLibrary;
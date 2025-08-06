import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../lib/api';
import { 
  Search, 
  FileText, 
  Mail, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  Copy,
  Download,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface AIToolProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  cost: number;
  onUse: () => void;
  disabled?: boolean;
}

const AITool: React.FC<AIToolProps> = ({ title, description, icon, cost, onUse, disabled }) => (
  <div className="bg-slate-800 p-6 rounded-lg">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className="text-teal-400 mr-3">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-teal-400 text-sm font-medium">{cost} credit{cost !== 1 ? 's' : ''}</div>
      </div>
    </div>
    <button
      onClick={onUse}
      disabled={disabled}
      className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
    >
      {disabled ? 'Insufficient Credits' : 'Use Tool'}
    </button>
  </div>
);

const SEOTools: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('generator');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [prompt, setPrompt] = useState('');

  const remainingCredits = 1000; // TODO: Implement usage tracking with new profile system

  const handleGenerateContent = async (toolType: string, userPrompt: string) => {
    if (remainingCredits < 1) {
      alert('Insufficient AI credits. Please upgrade your plan.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiService.call('/api/ai/generate', {
        method: 'POST',
        body: {
          type: toolType,
          prompt: userPrompt,
          clientId: user?.id
        },
        requireAuth: true
      });

      setGeneratedContent(response.content);
      // Update usage count in context
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const tabs = [
    { id: 'generator', name: 'Content Generator', icon: <FileText className="h-4 w-4" /> },
    { id: 'keywords', name: 'Keyword Research', icon: <Search className="h-4 w-4" /> },
    { id: 'competitor', name: 'Competitor Analysis', icon: <Users className="h-4 w-4" /> },
    { id: 'email', name: 'Email Optimizer', icon: <Mail className="h-4 w-4" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SEO AI Tools</h1>
          <p className="text-slate-400">AI-powered tools to boost your SEO performance</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">AI Credits Remaining</p>
          <p className="text-xl font-bold text-teal-400">{remainingCredits}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'generator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AITool
                title="Blog Post Generator"
                description="Create SEO-optimized blog posts on any topic"
                icon={<FileText className="h-6 w-6" />}
                cost={5}
                onUse={() => handleGenerateContent('blog_post', 'Generate a blog post about partnership strategies')}
                disabled={remainingCredits < 5}
              />
              <AITool
                title="Meta Description"
                description="Generate compelling meta descriptions"
                icon={<Target className="h-6 w-6" />}
                cost={1}
                onUse={() => handleGenerateContent('meta_description', 'Create meta description for partnership consulting')}
                disabled={remainingCredits < 1}
              />
              <AITool
                title="Social Media Posts"
                description="Create engaging social media content"
                icon={<Sparkles className="h-6 w-6" />}
                cost={2}
                onUse={() => handleGenerateContent('social_media', 'Create LinkedIn post about Fortune 500 partnerships')}
                disabled={remainingCredits < 2}
              />
              <AITool
                title="Email Subject Lines"
                description="Generate high-converting email subjects"
                icon={<Mail className="h-6 w-6" />}
                cost={1}
                onUse={() => handleGenerateContent('email_subject', 'Create subject line for partnership proposal')}
                disabled={remainingCredits < 1}
              />
            </div>

            {/* Custom Prompt */}
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Custom Content Generator</h3>
              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to create... (e.g., 'Write a professional email to introduce our partnership services to a Fortune 500 company')"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Cost: 3 credits</span>
                  <button
                    onClick={() => handleGenerateContent('custom', prompt)}
                    disabled={isGenerating || remainingCredits < 3 || !prompt.trim()}
                    className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Content */}
            {generatedContent && (
              <div className="bg-slate-800 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Generated Content</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(generatedContent)}
                      className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <pre className="text-slate-200 whitespace-pre-wrap">{generatedContent}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Keyword Research</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AITool
                  title="Keyword Opportunities"
                  description="Find high-value keywords for your niche"
                  icon={<Search className="h-6 w-6" />}
                  cost={3}
                  onUse={() => handleGenerateContent('keyword_research', 'Find keywords for partnership consulting')}
                  disabled={remainingCredits < 3}
                />
                <AITool
                  title="Long-tail Keywords"
                  description="Discover less competitive long-tail opportunities"
                  icon={<TrendingUp className="h-6 w-6" />}
                  cost={2}
                  onUse={() => handleGenerateContent('longtail_keywords', 'Find long-tail keywords for Fortune 500 partnerships')}
                  disabled={remainingCredits < 2}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitor' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Competitor Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AITool
                  title="Competitor Content Analysis"
                  description="Analyze competitor content strategies"
                  icon={<Users className="h-6 w-6" />}
                  cost={4}
                  onUse={() => handleGenerateContent('competitor_analysis', 'Analyze competitor content for partnership consulting')}
                  disabled={remainingCredits < 4}
                />
                <AITool
                  title="Gap Analysis"
                  description="Find content gaps in your market"
                  icon={<Target className="h-6 w-6" />}
                  cost={3}
                  onUse={() => handleGenerateContent('gap_analysis', 'Find content gaps in partnership consulting market')}
                  disabled={remainingCredits < 3}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Email Optimization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AITool
                  title="Email Templates"
                  description="Generate professional email templates"
                  icon={<Mail className="h-6 w-6" />}
                  cost={2}
                  onUse={() => handleGenerateContent('email_template', 'Create cold outreach email for Fortune 500 partnerships')}
                  disabled={remainingCredits < 2}
                />
                <AITool
                  title="Subject Line A/B Test"
                  description="Generate multiple subject line variations"
                  icon={<TrendingUp className="h-6 w-6" />}
                  cost={1}
                  onUse={() => handleGenerateContent('subject_variations', 'Create subject line variations for partnership outreach')}
                  disabled={remainingCredits < 1}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOTools;
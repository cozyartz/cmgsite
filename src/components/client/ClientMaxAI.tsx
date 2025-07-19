import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, AlertTriangle, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { AnalyticsService } from '../../lib/analytics';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface ClientMaxAIProps {
  className?: string;
}

const ClientMaxAI: React.FC<ClientMaxAIProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usageData, setUsageData] = useState({
    hasUnlimitedAccess: false,
    aiCallsUsed: 0,
    aiCallsLimit: 100,
    canMakeRequest: true
  });
  const [clientData, setClientData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load user's AI usage limits when component mounts
    if (user) {
      loadUsageLimits();
      loadClientData();
    }
  }, [user]);

  const loadUsageLimits = async () => {
    if (!user) return;
    
    try {
      const limits = await AnalyticsService.getUserUsageLimits(user.id);
      setUsageData(limits);
    } catch (error) {
      console.error('Error loading usage limits:', error);
    }
  };

  const loadClientData = async () => {
    if (!user) return;
    
    try {
      // Load user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setClientData(profile);
      }
    } catch (error) {
      console.error('Error loading client data:', error);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          content: `Hello! I'm your AI assistant. ${
            usageData.hasUnlimitedAccess 
              ? 'You have unlimited access to all AI features!' 
              : `You have ${usageData.aiCallsLimit - usageData.aiCallsUsed} AI calls remaining this month.`
          } How can I help you today?`,
          isBot: true,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }, 500);
    }
  }, [isOpen, usageData]);

  const getAIResponse = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    // Account and profile queries
    if (lowerMessage.includes('my account') || lowerMessage.includes('my profile') || lowerMessage.includes('who am i')) {
      if (clientData) {
        return `Here's your account information:\n\n` +
          `📧 Email: ${clientData.email}\n` +
          `👤 Name: ${clientData.full_name || 'Not set'}\n` +
          `🎯 Role: ${clientData.role || 'user'}\n` +
          `📅 Member since: ${new Date(clientData.created_at).toLocaleDateString()}\n` +
          `🔄 Last login: ${clientData.last_login ? new Date(clientData.last_login).toLocaleString() : 'N/A'}`;
      }
      return "I'm having trouble accessing your account information. Please try again later.";
    }
    
    // Usage and limits queries
    if (lowerMessage.includes('usage') || lowerMessage.includes('limit') || lowerMessage.includes('calls') || lowerMessage.includes('how many')) {
      await loadUsageLimits(); // Refresh data
      if (usageData.hasUnlimitedAccess) {
        return "🌟 You have unlimited AI access! As a premium user, you can make as many AI requests as you need without any restrictions.";
      } else {
        const remaining = usageData.aiCallsLimit - usageData.aiCallsUsed;
        const percentage = ((usageData.aiCallsUsed / usageData.aiCallsLimit) * 100).toFixed(1);
        return `📊 AI Usage Report:\n\n` +
          `• Used: ${usageData.aiCallsUsed} calls (${percentage}%)\n` +
          `• Limit: ${usageData.aiCallsLimit} calls/month\n` +
          `• Remaining: ${remaining} calls\n\n` +
          `💡 Tip: Consider upgrading to get unlimited access!`;
      }
    }
    
    // Analytics and stats queries
    if (lowerMessage.includes('stats') || lowerMessage.includes('analytics') || lowerMessage.includes('data')) {
      try {
        // Get user's recent activity
        const { data: activities } = await supabase
          .from('user_analytics')
          .select('event_type, created_at')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        const eventCounts = activities?.reduce((acc: any, activity) => {
          acc[activity.event_type] = (acc[activity.event_type] || 0) + 1;
          return acc;
        }, {}) || {};
        
        return `📈 Your Activity Analytics:\n\n` +
          `Recent Events:\n${Object.entries(eventCounts).map(([event, count]) => `• ${event}: ${count}`).join('\n')}\n\n` +
          `Total events tracked: ${activities?.length || 0}`;
      } catch (error) {
        return "I can track your usage analytics including AI calls, feature usage, and activity patterns. What specific data would you like to see?";
      }
    }
    
    // Help with platform features
    if (lowerMessage.includes('help') || lowerMessage.includes('features') || lowerMessage.includes('platform')) {
      return "🚀 I can help you with:\n\n" +
        "• 📝 Content generation and copywriting\n" +
        "• 🔍 SEO optimization and keyword research\n" +
        "• 📊 Business strategy and planning\n" +
        "• 💡 Marketing campaigns and ideas\n" +
        "• 📈 Account usage and analytics\n" +
        "• ⚙️ Platform features and settings\n\n" +
        "What would you like to explore?";
    }
    
    // SEO and content queries
    if (lowerMessage.includes('seo') || lowerMessage.includes('content') || lowerMessage.includes('marketing')) {
      return "🔍 SEO & Content Services:\n\n" +
        "I can help you with:\n" +
        "• Keyword research and analysis\n" +
        "• Content optimization strategies\n" +
        "• Meta descriptions and title tags\n" +
        "• Blog post ideas and outlines\n" +
        "• Social media content calendars\n" +
        "• Email marketing campaigns\n\n" +
        "What type of content do you need help with?";
    }
    
    // Business queries
    if (lowerMessage.includes('business') || lowerMessage.includes('strategy') || lowerMessage.includes('growth')) {
      return "💼 Business Strategy Assistant:\n\n" +
        "I can help analyze and plan:\n" +
        "• Market positioning and competitive analysis\n" +
        "• Revenue optimization strategies\n" +
        "• Customer acquisition tactics\n" +
        "• Operational efficiency improvements\n" +
        "• Growth forecasting and planning\n\n" +
        "Which area would you like to focus on?";
    }
    
    // Subscription queries
    if (lowerMessage.includes('upgrade') || lowerMessage.includes('subscription') || lowerMessage.includes('plan')) {
      const plans = {
        starter: { calls: 100, price: '$29/mo' },
        growth: { calls: 500, price: '$99/mo' },
        enterprise: { calls: 'Unlimited', price: '$299/mo' }
      };
      
      return "💎 Subscription Plans:\n\n" +
        "**Starter** - $29/mo\n• 100 AI calls/month\n• Basic features\n\n" +
        "**Growth** - $99/mo\n• 500 AI calls/month\n• Priority support\n• Advanced features\n\n" +
        "**Enterprise** - $299/mo\n• Unlimited AI calls\n• White-glove support\n• Custom integrations\n\n" +
        "Ready to upgrade? Visit your billing section!";
    }
    
    // Default response
    return "I'm MAX, your AI assistant! I can help with content creation, SEO optimization, business strategy, and provide insights about your account usage. What would you like to work on today?";
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !user) return;

    // Check if user can make AI request
    if (!usageData.canMakeRequest && !usageData.hasUnlimitedAccess) {
      const limitMessage: Message = {
        id: Date.now().toString(),
        content: "You've reached your monthly AI call limit. Please upgrade your plan to continue using AI features, or wait until next month for your limits to reset.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, limitMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Track the AI usage
      await AnalyticsService.trackAIUsage(
        user.id,
        'client_max_ai',
        'chat_response',
        0, // tokens (we're not using real AI yet)
        0, // cost
        true,
        { query: currentInput }
      );

      // Get AI response
      const response = await getAIResponse(currentInput);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Update usage count (only for non-unlimited users)
      if (!usageData.hasUnlimitedAccess) {
        setUsageData(prev => ({
          ...prev,
          aiCallsUsed: prev.aiCallsUsed + 1,
          canMakeRequest: prev.aiCallsUsed + 1 < prev.aiCallsLimit
        }));
        
        // Also update in database
        await supabase
          .from('profiles')
          .update({ ai_calls_used: usageData.aiCallsUsed + 1 })
          .eq('id', user.id);
      }
      
      // Track successful interaction
      await AnalyticsService.trackEvent(user.id, 'ai_chat_interaction', {
        success: true,
        query_type: detectQueryType(currentInput)
      });
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble processing your request. Please try again later.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to categorize queries
  const detectQueryType = (query: string): string => {
    const lower = query.toLowerCase();
    if (lower.includes('usage') || lower.includes('limit')) return 'usage_query';
    if (lower.includes('account') || lower.includes('profile')) return 'account_query';
    if (lower.includes('seo') || lower.includes('content')) return 'content_query';
    if (lower.includes('business') || lower.includes('strategy')) return 'business_query';
    if (lower.includes('upgrade') || lower.includes('plan')) return 'subscription_query';
    return 'general_query';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-br from-teal-500 via-blue-600 to-purple-600 hover:from-teal-400 hover:via-blue-500 hover:to-purple-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-40 ${className}`}
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          {usageData.hasUnlimitedAccess && (
            <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
          )}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl border border-gray-200 z-40 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-6 h-6 text-teal-200" />
              {usageData.hasUnlimitedAccess && (
                <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Assistant</h3>
              <p className="text-xs text-teal-200">
                {usageData.hasUnlimitedAccess 
                  ? 'Unlimited Access' 
                  : `${usageData.aiCallsLimit - usageData.aiCallsUsed} calls left`
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Usage Warning */}
      {!usageData.hasUnlimitedAccess && !usageData.canMakeRequest && (
        <div className="bg-red-50 border-b border-red-200 p-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">AI call limit reached. Upgrade for unlimited access.</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isBot ? 'items-start' : 'items-start justify-end'}`}
          >
            {message.isBot && (
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isBot
                  ? 'bg-white text-gray-800 border border-gray-200'
                  : 'bg-gradient-to-br from-teal-600 to-blue-600 text-white ml-auto'
              }`}
            >
              <p className="text-sm leading-relaxed">
                {message.content}
              </p>
              <span className="text-xs opacity-70 mt-2 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            {!message.isBot && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">U</span>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-white text-gray-800 p-3 rounded-lg border border-gray-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              usageData.canMakeRequest || usageData.hasUnlimitedAccess 
                ? "Ask me anything..." 
                : "Upgrade to continue using AI"
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            rows={1}
            disabled={isLoading || (!usageData.canMakeRequest && !usageData.hasUnlimitedAccess)}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading || (!usageData.canMakeRequest && !usageData.hasUnlimitedAccess)}
            className="bg-gradient-to-br from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send • {usageData.hasUnlimitedAccess ? 'Unlimited AI access' : `${usageData.aiCallsLimit - usageData.aiCallsUsed} calls remaining`}
        </p>
      </div>
    </div>
  );
};

export default ClientMaxAI;
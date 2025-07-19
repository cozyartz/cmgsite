import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, AlertTriangle, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AnalyticsService } from '../../lib/analytics';

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
  const { client } = useAuth();
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load user's AI usage limits when component mounts
    loadUsageLimits();
  }, [client]);

  const loadUsageLimits = async () => {
    if (!client) return;
    
    try {
      const limits = await AnalyticsService.getUserUsageLimits(client.id);
      setUsageData(limits);
    } catch (error) {
      console.error('Error loading usage limits:', error);
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

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Usage and limits queries
    if (lowerMessage.includes('usage') || lowerMessage.includes('limit') || lowerMessage.includes('calls')) {
      if (usageData.hasUnlimitedAccess) {
        return "You have unlimited AI access! As a premium user, you can make as many AI requests as you need without any restrictions.";
      } else {
        const remaining = usageData.aiCallsLimit - usageData.aiCallsUsed;
        return `You've used ${usageData.aiCallsUsed} of ${usageData.aiCallsLimit} AI calls this month. You have ${remaining} calls remaining. Consider upgrading to get unlimited access!`;
      }
    }
    
    // Help with platform features
    if (lowerMessage.includes('help') || lowerMessage.includes('features') || lowerMessage.includes('platform')) {
      return "I can help you with various tasks including content generation, SEO optimization, business planning, and more. You can also ask me about your account usage, subscription details, or how to use specific features.";
    }
    
    // SEO and content queries
    if (lowerMessage.includes('seo') || lowerMessage.includes('content') || lowerMessage.includes('marketing')) {
      return "I can assist with SEO strategies, content creation, keyword research, and marketing plans. Would you like me to help you create optimized content or analyze your current SEO performance?";
    }
    
    // Business queries
    if (lowerMessage.includes('business') || lowerMessage.includes('strategy') || lowerMessage.includes('growth')) {
      return "I can help with business strategy, growth planning, market analysis, and operational optimization. What specific aspect of your business would you like to focus on?";
    }
    
    // Subscription queries
    if (lowerMessage.includes('upgrade') || lowerMessage.includes('subscription') || lowerMessage.includes('plan')) {
      return "To upgrade your plan for unlimited AI access and premium features, visit your billing section. Higher tier plans include unlimited AI calls, priority support, and advanced features.";
    }
    
    // Default response
    return "I'm here to help! I can assist with content creation, SEO optimization, business strategy, and answer questions about your account. What would you like to work on?";
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

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
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
      
      // Update usage count (only for non-unlimited users)
      if (!usageData.hasUnlimitedAccess) {
        setUsageData(prev => ({
          ...prev,
          aiCallsUsed: prev.aiCallsUsed + 1,
          canMakeRequest: prev.aiCallsUsed + 1 < prev.aiCallsLimit
        }));
      }
    }, 1000);
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
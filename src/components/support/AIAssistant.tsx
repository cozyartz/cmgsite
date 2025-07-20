import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, HelpCircle } from 'lucide-react';
import { apiService } from '../../lib/api';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface AIAssistantProps {
  userId?: string;
  userEmail?: string;
  context?: 'onboarding' | 'billing' | 'technical' | 'general';
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  userId, 
  userEmail, 
  context = 'general' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message based on context
      const welcomeMessage = getWelcomeMessage(context);
      setMessages([{
        id: Date.now().toString(),
        content: welcomeMessage,
        isBot: true,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, context]);

  const getWelcomeMessage = (context: string): string => {
    switch (context) {
      case 'onboarding':
        return "👋 Hi! I'm your AI assistant here to help you get started with the platform. I can guide you through account setup, payment processing, feature exploration, and answer any questions you have. What would you like help with first?";
      case 'billing':
        return "💳 Hello! I'm here to help with billing questions, payment issues, subscription management, and coupon codes. What billing topic can I assist you with?";
      case 'technical':
        return "🔧 Hi there! I'm your technical support assistant. I can help with API integration, troubleshooting, security settings, and platform features. What technical challenge are you facing?";
      default:
        return "👋 Hello! I'm your AI assistant trained on every aspect of the Cozyartz SEO platform. I can help with onboarding, billing, technical issues, feature tutorials, and more. How can I help you today?";
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send to AI assistant API
      const data = await apiService.call('/api/ai/assistant', {
        method: 'POST',
        body: {
          message: inputValue,
          context,
          userId,
          userEmail,
          messageHistory: messages.slice(-10) // Last 10 messages for context
        },
        requireAuth: true
      });

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or contact our support team at hello@cozyartzmedia.com for immediate assistance.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: 'Setup Help', action: 'How do I set up my account and get started?' },
    { label: 'Payment Issues', action: 'I need help with payment or billing' },
    { label: 'Feature Tutorial', action: 'Can you show me how to use the main features?' },
    { label: 'Security Questions', action: 'I have questions about security and data protection' }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isBot ? 'items-start' : 'items-start justify-end'}`}
          >
            {message.isBot && (
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-teal-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-teal-500 text-white ml-auto'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            {!message.isBot && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-teal-600" />
            </div>
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
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

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(action.action);
                  sendMessage();
                }}
                className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 p-2 rounded border transition-colors text-left"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about the platform..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Users,
  Maximize2,
  Minimize2,
  Phone,
  Mail,
  Calendar,
  Shield,
  HelpCircle
} from 'lucide-react';
import { apiService } from '../../lib/api';
import { breakcoldAPI, CreateLeadRequest } from '../../lib/breakcold-api';
import { getRelevantServices, companyInfo, containsRestrictedContent } from '../../lib/service-knowledge-base';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  leadCapture?: boolean;
  suggestions?: string[];
}

interface LeadData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  title?: string;
  interest?: string;
  budget?: string;
  timeline?: string;
}

interface EnhancedAIAssistantProps {
  userId?: string;
  userEmail?: string;
  context?: 'onboarding' | 'billing' | 'technical' | 'general' | 'sales';
  enableLeadCapture?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'center';
}

const EnhancedAIAssistant: React.FC<EnhancedAIAssistantProps> = ({ 
  userId, 
  userEmail, 
  context = 'sales',
  enableLeadCapture = true,
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({});
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadScore, setLeadScore] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [currentIntent, setCurrentIntent] = useState<string>('general');
  const [currentSentiment, setCurrentSentiment] = useState<string>('neutral');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message with typing animation
      setIsTyping(true);
      setTimeout(() => {
        const welcomeMessage = getWelcomeMessage(context);
        setMessages([{
          id: Date.now().toString(),
          content: welcomeMessage,
          isBot: true,
          timestamp: new Date(),
          suggestions: getInitialSuggestions(context)
        }]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, context]);

  const getWelcomeMessage = (context: string): string => {
    switch (context) {
      case 'sales':
        return `👋 Hello! I'm your AI assistant from ${companyInfo.name}. I'm here to help you discover how our web design, SEO, and AI integration services can transform your business.\n\nI can provide information about:\n• Service pricing and packages\n• Project timelines and processes\n• Custom solutions for your industry\n• Free consultation booking\n\nWhat brings you here today?`;
      case 'technical':
        return "🔧 Hi there! I'm your technical support assistant. I can help with platform features, account setup, billing questions, and general troubleshooting. What can I help you with?";
      case 'billing':
        return "💳 Hello! I'm here to help with billing questions, payment issues, subscription management, and pricing information. How can I assist you today?";
      default:
        return `👋 Welcome! I'm your AI assistant from ${companyInfo.name}. I'm trained on all our services and can help with questions about web design, SEO, AI integration, pricing, and more. How can I help you today?`;
    }
  };

  const getInitialSuggestions = (context: string): string[] => {
    switch (context) {
      case 'sales':
        return [
          "I need a new website for my business",
          "Tell me about your SEO services",
          "How can AI help my business?",
          "What are your pricing options?",
          "I'd like to book a consultation"
        ];
      case 'technical':
        return [
          "How do I get started?",
          "I'm having trouble with my account",
          "Help with billing questions",
          "Show me platform features"
        ];
      default:
        return [
          "What services do you offer?",
          "How much do your services cost?",
          "Can you help with my website?",
          "Tell me about your company"
        ];
    }
  };

  // Enhanced lead qualification scoring
  const calculateLeadScore = (message: string, history: Message[]): number => {
    let score = leadScore;
    const lowerMessage = message.toLowerCase();
    
    // High-value indicators
    if (lowerMessage.includes('quote') || lowerMessage.includes('proposal')) score += 25;
    if (lowerMessage.includes('budget') || lowerMessage.includes('investment')) score += 20;
    if (lowerMessage.includes('timeline') || lowerMessage.includes('when can')) score += 15;
    if (lowerMessage.includes('urgent') || lowerMessage.includes('asap')) score += 20;
    
    // Service interest indicators
    if (lowerMessage.includes('website') || lowerMessage.includes('web design')) score += 15;
    if (lowerMessage.includes('seo') || lowerMessage.includes('search engine')) score += 15;
    if (lowerMessage.includes('ai') || lowerMessage.includes('chatbot')) score += 15;
    if (lowerMessage.includes('marketing') || lowerMessage.includes('digital')) score += 10;
    
    // Business indicators
    if (lowerMessage.includes('business') || lowerMessage.includes('company')) score += 10;
    if (lowerMessage.includes('customers') || lowerMessage.includes('leads')) score += 15;
    if (lowerMessage.includes('revenue') || lowerMessage.includes('sales')) score += 15;
    
    // Engagement indicators
    if (history.length > 3) score += 10;
    if (history.length > 7) score += 10;
    if (lowerMessage.length > 50) score += 5;
    
    return Math.min(score, 100);
  };

  // Enhanced lead information extraction
  const extractLeadInfo = (message: string): Partial<LeadData> => {
    const extracted: Partial<LeadData> = {};
    const lowerMessage = message.toLowerCase();
    
    // Email extraction
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) extracted.email = emailMatch[0];
    
    // Phone extraction (multiple formats)
    const phoneMatch = message.match(/(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/);
    if (phoneMatch) extracted.phone = phoneMatch[0];
    
    // Company extraction
    if (lowerMessage.includes('company') || lowerMessage.includes('business')) {
      const patterns = [
        /(?:company|business)(?:\s+is|\s+called|\s+name)?\s+([A-Za-z0-9\s&.-]+)/i,
        /(?:i work at|i'm at|i'm with)\s+([A-Za-z0-9\s&.-]+)/i
      ];
      for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match && match[1].trim().length > 2) {
          extracted.company = match[1].trim();
          break;
        }
      }
    }
    
    // Interest categorization
    if (lowerMessage.includes('website') || lowerMessage.includes('web design')) {
      extracted.interest = 'Web Design & Development';
    } else if (lowerMessage.includes('seo') || lowerMessage.includes('search')) {
      extracted.interest = 'SEO Services';
    } else if (lowerMessage.includes('ai') || lowerMessage.includes('chatbot') || lowerMessage.includes('automation')) {
      extracted.interest = 'AI Integration';
    } else if (lowerMessage.includes('marketing') || lowerMessage.includes('social media') || lowerMessage.includes('advertising')) {
      extracted.interest = 'Digital Marketing';
    } else if (lowerMessage.includes('ecommerce') || lowerMessage.includes('online store') || lowerMessage.includes('shop')) {
      extracted.interest = 'E-commerce Solutions';
    }
    
    // Budget detection
    if (lowerMessage.includes('thousand') || lowerMessage.includes('k')) {
      const budgetMatch = message.match(/(\$?[\d,]+)\s*(?:thousand|k)/i);
      if (budgetMatch) extracted.budget = budgetMatch[0];
    } else if (lowerMessage.includes('budget')) {
      const budgetMatch = message.match(/budget.*?(\$[\d,]+)/i);
      if (budgetMatch) extracted.budget = budgetMatch[1];
    }
    
    return extracted;
  };

  // Create lead in CRM
  const createLeadInCRM = async (data: LeadData, conversationContext: string) => {
    if (!enableLeadCapture || !data.email) return;

    try {
      const leadRequest: CreateLeadRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        website: data.website,
        title: data.title,
        source: `Enhanced AI Assistant - ${context}`,
        tags: [
          'Website Lead',
          'Enhanced Chat',
          context.charAt(0).toUpperCase() + context.slice(1),
          data.interest || 'General Inquiry'
        ].filter(Boolean),
        customAttributes: {
          leadScore: leadScore,
          interest: data.interest,
          budget: data.budget,
          timeline: data.timeline,
          conversationContext: conversationContext,
          chatVersion: 'enhanced',
          capturedAt: new Date().toISOString()
        },
        notes: `High-quality lead captured via Enhanced AI Assistant. Interest: ${data.interest || 'General'}. Lead score: ${leadScore}/100. Conversation length: ${messages.length} messages.`
      };

      const result = await breakcoldAPI.upsertLead(leadRequest);
      
      if (result.success) {
        console.log('Lead created/updated in Breakcold:', result.data);
        
        const successMessage: Message = {
          id: Date.now().toString(),
          content: `Thanks ${data.firstName || 'for your interest'}! 🎉 I've saved your information and someone from our team will reach out within 24 hours.\n\nIn the meantime, feel free to browse our portfolio at ${companyInfo.contact.website} or ask me any other questions!`,
          isBot: true,
          timestamp: new Date(),
          suggestions: [
            "Tell me about your portfolio",
            "What makes you different?",
            "Book a consultation now",
            "What's your typical process?"
          ]
        };
        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error) {
      console.error('Failed to create lead in CRM:', error);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const message = messageText || inputValue.trim();
    if (!message || isLoading) return;

    // Check for restricted content
    if (containsRestrictedContent(message)) {
      const warningMessage: Message = {
        id: Date.now().toString(),
        content: "I can't provide information about technical implementation details or internal systems. However, I'd be happy to discuss our services, pricing, processes, and how we can help your business grow! What would you like to know?",
        isBot: true,
        timestamp: new Date(),
        suggestions: [
          "Tell me about your services",
          "What are your prices?",
          "How do you work with clients?",
          "Can I see your portfolio?"
        ]
      };
      setMessages(prev => [...prev, warningMessage]);
      setInputValue('');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    // Calculate lead score and extract information
    const messageScore = calculateLeadScore(message, messages);
    const newLeadScore = Math.max(leadScore, messageScore);
    setLeadScore(newLeadScore);

    const extractedInfo = extractLeadInfo(message);
    const updatedLeadData = { ...leadData, ...extractedInfo };
    setLeadData(updatedLeadData);

    try {
      // Send to advanced AI assistant API with session persistence
      const data = await apiService.call('/api/ai/advanced-assistant', {
        method: 'POST',
        body: {
          message,
          context,
          userId,
          userEmail,
          messageHistory: messages.slice(-10),
          leadScore: newLeadScore,
          leadData: updatedLeadData,
          enableLeadCapture,
          sessionId: sessionId
        },
        requireAuth: false
      });

      setTimeout(() => {
        setIsTyping(false);
        
        if (data.success) {
          // Update AI-enhanced lead score and insights
          if (data.leadScore) setLeadScore(data.leadScore);
          if (data.intent) setCurrentIntent(data.intent);
          if (data.sentiment) setCurrentSentiment(data.sentiment);

          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data.response,
            isBot: true,
            timestamp: new Date(),
            suggestions: data.suggestions || []
          };
          setMessages(prev => [...prev, botMessage]);

          // Lead capture logic
          if (enableLeadCapture && newLeadScore >= 40 && updatedLeadData.email) {
            const conversationSummary = messages.slice(-5).map(m => 
              `${m.isBot ? 'Bot' : 'User'}: ${m.content}`
            ).join('\n');
            createLeadInCRM(updatedLeadData, conversationSummary);
          } else if (enableLeadCapture && newLeadScore >= 60 && !updatedLeadData.email) {
            setShowLeadForm(true);
            setTimeout(() => {
              const promptMessage: Message = {
                id: (Date.now() + 2).toString(),
                content: "You seem really interested in our services! 🌟 I'd love to have our team send you a personalized proposal. Could you share your contact information?",
                isBot: true,
                timestamp: new Date(),
                leadCapture: true
              };
              setMessages(prev => [...prev, promptMessage]);
            }, 1500);
          }
        } else {
          throw new Error(data.error || 'Failed to get response');
        }
      }, 1200); // Simulate typing delay
    } catch (error) {
      setIsTyping(false);
      console.error('Enhanced AI Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I'm having trouble connecting right now. 😅\n\nYou can always reach our team directly:\n📧 ${companyInfo.contact.email}\n📞 ${companyInfo.contact.phone}\n\nOr book a consultation: ${companyInfo.contact.consultation}`,
        isBot: true,
        timestamp: new Date(),
        suggestions: ["Try asking again", "Contact support", "Book consultation"]
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

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    sendMessage(suggestion);
  };

  // Handle lead form submission
  const handleLeadFormSubmit = async (formData: LeadData) => {
    const finalLeadData = { ...leadData, ...formData };
    setLeadData(finalLeadData);
    setShowLeadForm(false);
    
    const conversationSummary = messages.slice(-5).map(m => 
      `${m.isBot ? 'Bot' : 'User'}: ${m.content}`
    ).join('\n');
    await createLeadInCRM(finalLeadData, conversationSummary);
  };

  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'bottom-6 right-6';
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        
        {/* Notification badge */}
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
          <Bot className="w-3 h-3" />
        </div>
      </div>
    );
  }

  const chatWidth = isExpanded ? 'w-[600px]' : 'w-96';
  const chatHeight = isExpanded ? 'h-[700px]' : 'h-[500px]';

  return (
    <div className={`fixed ${getPositionClasses()} ${chatWidth} max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 ${chatHeight} flex flex-col`}>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-6 h-6" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Assistant</h3>
            <p className="text-xs text-teal-100">Powered by Cloudflare AI • {companyInfo.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {enableLeadCapture && leadScore > 0 && (
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
                <Users className="w-4 h-4" />
                <span>{leadScore}% interest</span>
              </div>
            )}
            {currentIntent !== 'general' && (
              <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-full text-xs">
                <span>{currentIntent.replace('_', ' ')}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/80 hover:text-white transition-colors p-1 rounded"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div key={message.id}>
            <div className={`flex gap-3 ${message.isBot ? 'items-start' : 'items-start justify-end'}`}>
              {message.isBot && (
                <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-teal-600" />
                </div>
              )}
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                message.isBot
                  ? 'bg-white text-gray-800 border border-gray-100'
                  : 'bg-gradient-to-r from-teal-500 to-blue-600 text-white ml-auto'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              {!message.isBot && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              )}
            </div>
            
            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && index === messages.length - 1 && (
              <div className="mt-3 ml-11 flex flex-wrap gap-2">
                {message.suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-2 rounded-full border border-teal-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-teal-600" />
            </div>
            <div className="bg-white text-gray-800 p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Lead Capture Form */}
      {showLeadForm && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50">
          <div className="bg-white p-4 rounded-xl border border-teal-200">
            <h4 className="text-base font-bold text-teal-800 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Let's Connect! 🤝
            </h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data: LeadData = {
                  firstName: formData.get('firstName') as string,
                  lastName: formData.get('lastName') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  company: formData.get('company') as string,
                };
                handleLeadFormSubmit(data);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="firstName"
                  placeholder="First Name"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  defaultValue={leadData.firstName || ''}
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  defaultValue={leadData.lastName || ''}
                />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email Address *"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                defaultValue={leadData.email || ''}
              />
              <div className="grid grid-cols-1 gap-3">
                <input
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  defaultValue={leadData.phone || ''}
                />
                <input
                  name="company"
                  placeholder="Company Name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  defaultValue={leadData.company || ''}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white text-sm py-3 px-4 rounded-lg transition-all font-medium"
                >
                  Send My Info
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeadForm(false)}
                  className="px-4 py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Skip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about our services..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              rows={isExpanded ? 2 : 1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all font-medium min-w-[48px] flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{companyInfo.contact.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            <span>Response in 24hrs</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default EnhancedAIAssistant;
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, HelpCircle, Users } from 'lucide-react';
import { apiService } from '../../lib/api';
import { breakcoldAPI, CreateLeadRequest } from '../../lib/breakcold-api';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  leadCapture?: boolean;
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

interface AIAssistantProps {
  userId?: string;
  userEmail?: string;
  context?: 'onboarding' | 'billing' | 'technical' | 'general' | 'sales';
  enableLeadCapture?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  userId, 
  userEmail, 
  context = 'general',
  enableLeadCapture = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({});
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadScore, setLeadScore] = useState(0);
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
      case 'sales':
        return "🚀 Hello! I'm here to help you learn about our services and find the perfect solution for your business. I can assist with web design, SEO, AI integration, and custom development services. What brings you here today?";
      default:
        return "👋 Hello! I'm your AI assistant trained on every aspect of the Cozyartz SEO platform. I can help with onboarding, billing, technical issues, feature tutorials, and more. How can I help you today?";
    }
  };

  // Lead qualification scoring
  const calculateLeadScore = (message: string, history: Message[]): number => {
    let score = 0;
    const lowerMessage = message.toLowerCase();
    
    // Interest indicators
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) score += 15;
    if (lowerMessage.includes('quote') || lowerMessage.includes('estimate')) score += 20;
    if (lowerMessage.includes('when can') || lowerMessage.includes('timeline') || lowerMessage.includes('how soon')) score += 15;
    if (lowerMessage.includes('website') || lowerMessage.includes('web design') || lowerMessage.includes('seo')) score += 10;
    if (lowerMessage.includes('business') || lowerMessage.includes('company')) score += 10;
    if (lowerMessage.includes('need help') || lowerMessage.includes('looking for')) score += 10;
    
    // Urgency indicators
    if (lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('immediately')) score += 25;
    if (lowerMessage.includes('deadline') || lowerMessage.includes('launch')) score += 20;
    
    // Engagement indicators
    if (history.length > 5) score += 10; // Sustained conversation
    if (lowerMessage.length > 100) score += 5; // Detailed messages
    
    return Math.min(score, 100);
  };

  // Extract lead information from conversation
  const extractLeadInfo = (message: string): Partial<LeadData> => {
    const extracted: Partial<LeadData> = {};
    const lowerMessage = message.toLowerCase();
    
    // Email pattern
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) extracted.email = emailMatch[0];
    
    // Phone pattern
    const phoneMatch = message.match(/(\d{3}[-.]?)?\d{3}[-.]?\d{4}/);
    if (phoneMatch) extracted.phone = phoneMatch[0];
    
    // Company indicators
    if (lowerMessage.includes('company') || lowerMessage.includes('business')) {
      const companyMatch = message.match(/(?:company|business)(?:\s+is|\s+called|\s+name)?\s+([A-Za-z0-9\s]+)/i);
      if (companyMatch) extracted.company = companyMatch[1].trim();
    }
    
    // Interest categorization
    if (lowerMessage.includes('website') || lowerMessage.includes('web design')) extracted.interest = 'Web Design';
    else if (lowerMessage.includes('seo') || lowerMessage.includes('search')) extracted.interest = 'SEO Services';
    else if (lowerMessage.includes('ai') || lowerMessage.includes('chatbot')) extracted.interest = 'AI Integration';
    else if (lowerMessage.includes('marketing') || lowerMessage.includes('social media')) extracted.interest = 'Digital Marketing';
    
    return extracted;
  };

  // Create lead in Breakcold CRM
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
        source: `Website Chatbot - ${context}`,
        tags: [
          'Website Lead',
          context.charAt(0).toUpperCase() + context.slice(1),
          data.interest || 'General Inquiry'
        ].filter(Boolean),
        customAttributes: {
          leadScore: leadScore,
          interest: data.interest,
          budget: data.budget,
          timeline: data.timeline,
          conversationContext: conversationContext,
          capturedAt: new Date().toISOString()
        },
        notes: `Lead captured via AI chatbot. Interest: ${data.interest || 'General'}. Lead score: ${leadScore}/100. Context: ${conversationContext}`
      };

      const result = await breakcoldAPI.upsertLead(leadRequest);
      
      if (result.success) {
        console.log('Lead created/updated in Breakcold:', result.data);
        
        // Show success message
        const successMessage: Message = {
          id: Date.now().toString(),
          content: "Thanks for your information! I've noted your details and someone from our team will reach out to you soon. Is there anything else I can help you with right now?",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error) {
      console.error('Failed to create lead in CRM:', error);
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

    // Calculate lead score and extract information
    const messageScore = calculateLeadScore(inputValue, messages);
    const newLeadScore = Math.max(leadScore, messageScore);
    setLeadScore(newLeadScore);

    // Extract lead information from message
    const extractedInfo = extractLeadInfo(inputValue);
    const updatedLeadData = { ...leadData, ...extractedInfo };
    setLeadData(updatedLeadData);

    try {
      // Send to AI assistant API with enhanced context
      const data = await apiService.call('/api/ai/assistant', {
        method: 'POST',
        body: {
          message: inputValue,
          context,
          userId,
          userEmail,
          messageHistory: messages.slice(-10), // Last 10 messages for context
          leadScore: newLeadScore,
          leadData: updatedLeadData,
          enableLeadCapture
        },
        requireAuth: false // Don't require authentication for AI assistant
      });

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);

        // Check if we should capture the lead
        if (enableLeadCapture && newLeadScore >= 30 && updatedLeadData.email) {
          // Create lead in CRM
          const conversationSummary = messages.slice(-5).map(m => `${m.isBot ? 'Bot' : 'User'}: ${m.content}`).join('\n');
          await createLeadInCRM(updatedLeadData, conversationSummary);
        } else if (enableLeadCapture && newLeadScore >= 50 && !updatedLeadData.email) {
          // Show lead capture form for high-scoring leads without email
          setShowLeadForm(true);
          const promptMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: "I'd love to help you further! Could you share your email so I can send you some additional resources and have our team follow up with a personalized proposal?",
            isBot: true,
            timestamp: new Date(),
            leadCapture: true
          };
          setMessages(prev => [...prev, promptMessage]);
        }
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

  const quickActions = context === 'sales' ? [
    { label: 'Web Design', action: 'I need a new website for my business' },
    { label: 'SEO Services', action: 'I need help with search engine optimization' },
    { label: 'AI Integration', action: 'I want to add AI features to my business' },
    { label: 'Get Quote', action: 'Can you provide a quote for your services?' }
  ] : [
    { label: 'Setup Help', action: 'How do I set up my account and get started?' },
    { label: 'Payment Issues', action: 'I need help with payment or billing' },
    { label: 'Feature Tutorial', action: 'Can you show me how to use the main features?' },
    { label: 'Security Questions', action: 'I have questions about security and data protection' }
  ];

  // Handle lead form submission
  const handleLeadFormSubmit = async (formData: LeadData) => {
    const finalLeadData = { ...leadData, ...formData };
    setLeadData(finalLeadData);
    setShowLeadForm(false);
    
    // Create lead in CRM
    const conversationSummary = messages.slice(-5).map(m => `${m.isBot ? 'Bot' : 'User'}: ${m.content}`).join('\n');
    await createLeadInCRM(finalLeadData, conversationSummary);
  };

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
          {enableLeadCapture && leadScore > 0 && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs">
              <Users className="w-3 h-3" />
              <span>{leadScore}</span>
            </div>
          )}
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
      {messages.length === 1 && !showLeadForm && (
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

      {/* Lead Capture Form */}
      {showLeadForm && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="bg-teal-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-teal-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Let's Connect!
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
              className="space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="firstName"
                  placeholder="First Name"
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                  defaultValue={leadData.firstName || ''}
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                  defaultValue={leadData.lastName || ''}
                />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email Address *"
                required
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                defaultValue={leadData.email || ''}
              />
              <input
                name="phone"
                placeholder="Phone Number"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                defaultValue={leadData.phone || ''}
              />
              <input
                name="company"
                placeholder="Company Name"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                defaultValue={leadData.company || ''}
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-xs py-2 px-3 rounded transition-colors"
                >
                  Send Info
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeadForm(false)}
                  className="px-3 py-2 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Skip
                </button>
              </div>
            </form>
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
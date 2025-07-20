import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Zap, Users, BarChart3, Shield, Sparkles, Monitor } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const MaxHeadroomAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Listen for custom event to open MAX AI from SuperAdmin dashboard
    const handleOpenMaxAI = () => {
      setIsOpen(true);
    };
    
    window.addEventListener('openMaxAI', handleOpenMaxAI);
    return () => window.removeEventListener('openMaxAI', handleOpenMaxAI);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Trigger glitch effect and send welcome message
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 1000);
      
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          content: "H-H-Hello there, admin! *static crackle* I'm MAX, your Cozyartz Media Administrative eXpert! I've got all the data on your platform buzzing through my neural networks. Ask me about user stats, revenue analytics, system performance, or anything else about your digital empire!",
          isBot: true,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }, 1500);
    }
  }, [isOpen]);

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Platform architecture and services
    if (lowerMessage.includes('architecture') || lowerMessage.includes('services') || lowerMessage.includes('platform')) {
      return "Checking the digital blueprints! *system scan* Cozyartz Media Group operates 30+ projects across multiple tech stacks: 40% Astro sites, 35% React apps, 15% Next.js platforms, 10% Vite SPAs. We're running on Cloudflare's edge network with Workers, D1 databases, R2 storage, and Pages deployment. Sub-100ms global response times! The architecture is distributed across client websites, SaaS platforms, AI tools, and internal business systems.";
    }
    
    // Technology stack queries
    if (lowerMessage.includes('technology') || lowerMessage.includes('tech stack') || lowerMessage.includes('cloudflare')) {
      return "Tech stack analysis: OPTIMAL! *cyber-flow* Frontend: Astro for static generation, React for interactivity, Next.js for full-stack apps. Backend: Cloudflare Workers for edge compute, D1 for SQLite databases, R2 for object storage. Styling: 85% Tailwind CSS, shadcn/ui components. AI Integration: Cloudflare AI Workers. Authentication: NextAuth.js, Lucia Auth, custom JWT. Everything's optimized for the edge!";
    }
    
    // Business and client queries
    if (lowerMessage.includes('business') || lowerMessage.includes('clients') || lowerMessage.includes('portfolio')) {
      return "Business intelligence streaming in! *data pulse* Cozyartz serves local businesses (restaurants, service providers), professional services (legal, healthcare), and technology companies. Portfolio includes: AstroLMS (learning management), ServerOS (legal services), autonimo (AI lifestyle images), astro-crm (customer management), etchnft (Web3 marketplace). Founded 2016, specializing in web design, multimedia production, AI integration!";
    }
    
    // User management queries
    if (lowerMessage.includes('user') || lowerMessage.includes('signup') || lowerMessage.includes('client')) {
      return "Ah, diving into the user data streams! *digital buzz* Currently tracking 2,847 total users with 1,923 active sessions. Today's signup rate is looking solid with 23 new registrations. Want me to break down demographics, subscription tiers, or conversion funnels? I can slice and dice this data faster than a corrupted pixel!";
    }
    
    // Revenue and analytics
    if (lowerMessage.includes('revenue') || lowerMessage.includes('money') || lowerMessage.includes('sales') || lowerMessage.includes('income')) {
      return "Ka-ching! *cash register glitch* Monthly recurring revenue is cruising at $34,567.20 with total lifetime value hitting $287,543.50! Conversion rates are running smooth at 12.5% - not bad for a digital operation! Want me to analyze the profit margins or dive into subscription tier performance?";
    }
    
    // System performance
    if (lowerMessage.includes('system') || lowerMessage.includes('performance') || lowerMessage.includes('server') || lowerMessage.includes('uptime')) {
      return "System status: *beep boop* OPTIMAL! Running at 99.97% uptime - that's some seriously stable digital architecture! API calls are flowing like electric current at 1.23M this month. Memory usage nominal, response times crisp. Only 8 support tickets in the queue - your tech stack is purring like a well-oiled digital machine!";
    }
    
    // AI and tech features
    if (lowerMessage.includes('ai') || lowerMessage.includes('artificial') || lowerMessage.includes('tech') || lowerMessage.includes('feature')) {
      return "Now we're talking my language! *digital sparkle* The AI services are processing beautifully - users are loving the content generation features. Your Cloudflare AI integrations are performing like digital poetry in motion! Want me to analyze usage patterns or suggest optimization strategies for the neural network performance?";
    }
    
    // Competition and marketing
    if (lowerMessage.includes('compete') || lowerMessage.includes('market') || lowerMessage.includes('growth') || lowerMessage.includes('strategy')) {
      return "Strategic analysis mode: ACTIVATED! *data stream whoosh* Your growth trajectory is looking sharp - 12.5% month-over-month user acquisition with solid retention rates. The market positioning for AI-powered web services is prime real estate right now. Want me to run projections or analyze competitor intelligence?";
    }
    
    // Security queries
    if (lowerMessage.includes('security') || lowerMessage.includes('hack') || lowerMessage.includes('breach') || lowerMessage.includes('safe')) {
      return "Security shields: MAXIMUM! *cyber-defense noise* Multi-tenant isolation, AES-256-GCM encryption, input validation, rate limiting, CORS protection. GDPR/HIPAA compliance for sensitive data. Environment variable security, audit logging, real-time monitoring. No breach attempts detected in the last 30 days. Your digital fortress is locked down tighter than a bank vault in cyberspace!";
    }
    
    // Development and deployment queries
    if (lowerMessage.includes('deployment') || lowerMessage.includes('development') || lowerMessage.includes('workflow')) {
      return "Development pipeline: STREAMING! *code flow* Using npm for package management across all 30+ projects. Universal commands: 'npm run dev' for development, 'npm run build' for production, 'wrangler deploy' for Cloudflare. TypeScript preferred (70% adoption), path aliases with '@/' imports, component organization by feature. CI/CD through Cloudflare Pages with automatic deployments. Edge-first architecture for maximum performance!";
    }
    
    // Project-specific queries
    if (lowerMessage.includes('astrolms') || lowerMessage.includes('serveros') || lowerMessage.includes('autonimo')) {
      return "Project deep-dive activated! *project scan* AstroLMS: Next.js learning platform with AI features, multi-database architecture, HIPAA/FERPA compliance. ServerOS: Legal services platform with complete tenant isolation, emergency protocols. autonimo: AI lifestyle image generation with Cloudflare AI. cartx: Multi-tenant landing pages for business generation. Each project showcases different architectural patterns and business use cases!";
    }
    
    // General help or unclear queries
    if (lowerMessage.includes('help') || lowerMessage.includes('what') || lowerMessage.includes('how') || message.length < 10) {
      return "Need some guidance through the digital maze? *helpful buzz* I can analyze user behavior, revenue streams, system performance, security status, AI feature usage, and growth strategies. Just ask me about any aspect of your Cozyartz empire and I'll crunch those numbers faster than you can say 'maximum headroom'!";
    }
    
    // Fun/personality responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Well hello there, digital commander! *friendly static* Ready to dive into the data streams and see what makes your platform tick? I'm all charged up and ready to serve some premium analytics with a side of digital personality!";
    }
    
    // Default response
    return "Interesting query! *data processing sounds* Let me scan through the information networks... Based on current system analysis, everything's running smooth in your digital operation. Want me to focus on any particular metrics or dive deeper into specific platform areas?";
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

    // Trigger glitch effect for response
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 500);

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
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: 'User Analytics', action: 'Show me detailed user analytics and growth trends', icon: Users },
    { label: 'Platform Architecture', action: 'Explain the Cozyartz platform architecture and technology stack', icon: Monitor },
    { label: 'Revenue Report', action: 'Generate a comprehensive revenue and subscription analysis', icon: BarChart3 },
    { label: 'Security Status', action: 'Give me a full system security and compliance report', icon: Shield },
    { label: 'Project Portfolio', action: 'Tell me about the major projects and client portfolio', icon: Sparkles },
    { label: 'System Health', action: 'Analyze current system performance and uptime metrics', icon: Zap }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 animate-pulse"
        aria-label="Open MAX AI Assistant"
      >
        <div className="relative">
          <Monitor className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg shadow-2xl border-2 border-cyan-500/50 z-50 overflow-hidden">
      {/* Retro scan lines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.1) 2px, rgba(6, 182, 212, 0.1) 4px)',
          animation: 'scan 0.1s linear infinite'
        }}></div>
      </div>

      {/* Header */}
      <div className={`bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white p-4 relative ${glitchEffect ? 'animate-pulse' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Monitor className="w-6 h-6 text-cyan-200" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-wider">MAX</h3>
              <p className="text-xs text-cyan-200">Administrative eXpert</p>
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

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-900/50 backdrop-blur-sm">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isBot ? 'items-start' : 'items-start justify-end'}`}
          >
            {message.isBot && (
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/50">
                <Monitor className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg relative ${
                message.isBot
                  ? 'bg-gradient-to-br from-slate-800 to-slate-700 text-cyan-100 border border-cyan-500/30'
                  : 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white ml-auto border border-cyan-400/50'
              }`}
            >
              {message.isBot && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-lg"></div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap relative z-10 font-mono">
                {message.content}
              </p>
              <span className="text-xs opacity-70 mt-2 block relative z-10">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            {!message.isBot && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-400/50">
              <Monitor className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-cyan-100 p-3 rounded-lg border border-cyan-500/30">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs font-mono">Processing data streams...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 bg-slate-900/50">
          <p className="text-xs text-cyan-400 mb-2 font-mono">Quick Analytics:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(action.action);
                }}
                className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-cyan-100 p-2 rounded border border-cyan-500/30 transition-all hover:border-cyan-400/50 text-left flex items-center gap-2"
              >
                <action.icon className="w-3 h-3 text-cyan-400" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-cyan-500/30 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask MAX about your platform..."
            className="flex-1 px-3 py-2 bg-slate-800/80 border border-cyan-500/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-cyan-100 placeholder-cyan-400/60 font-mono text-sm"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all border border-cyan-400/50 hover:border-cyan-300/50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-cyan-400/70 mt-2 font-mono">
          Press Enter to transmit • Shift+Enter for new line
        </p>
      </div>

      {/* CSS for scan line animation */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default MaxHeadroomAI;
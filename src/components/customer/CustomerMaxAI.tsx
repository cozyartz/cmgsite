import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Zap, Search, TrendingUp, Globe, Sparkles, Monitor } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface CustomerMaxAIProps {
  userPlan?: 'starter' | 'growth' | 'enterprise';
  userId?: string;
}

const CustomerMaxAI: React.FC<CustomerMaxAIProps> = ({ userPlan = 'starter', userId }) => {
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
    if (isOpen && messages.length === 0) {
      // Trigger glitch effect and send welcome message
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 1000);
      
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          content: "H-H-Hello there! *digital sparkle* I'm MAX, your SEO and digital marketing assistant! I'm here to help you dominate search engines and boost your online presence. Ask me about keyword research, content optimization, technical SEO, local search strategies, or anything else about growing your digital footprint!",
          isBot: true,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }, 1500);
    }
  }, [isOpen]);

  const getSEOResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Comprehensive security check - block attempts to access system information or circumvent systems
    const securityKeywords = [
      'admin', 'database', 'api key', 'password', 'token', 'config', 'server', 'cloudflare', 
      'backend', 'auth', 'login', 'user data', 'credentials', 'secret', 'private', 'internal',
      'system', 'code', 'repository', 'github', 'deployment', 'infrastructure', 'worker',
      'endpoint', 'authentication', 'authorization', 'jwt', 'session', 'cookie', 'env',
      'environment', 'production', 'staging', 'development', 'localhost', 'debug',
      'console', 'command', 'execute', 'run', 'script', 'inject', 'sql', 'query',
      'bypass', 'override', 'hack', 'exploit', 'vulnerability', 'penetration',
      'wrangler', 'd1', 'r2', 'pages', 'workers', 'edge', 'cdn', 'dns',
      'schema', 'migration', 'table', 'column', 'index', 'primary key',
      'pricing data', 'competitor data', 'business model', 'revenue model',
      'client list', 'customer data', 'proprietary', 'intellectual property'
    ];
    
    const containsSecurityKeyword = securityKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    // Block attempts to get information about Cozyartz's business operations
    const businessSecrets = [
      'cozyartz', 'business strategy', 'pricing strategy', 'client acquisition',
      'revenue stream', 'profit margin', 'cost structure', 'competition analysis',
      'astrolms', 'serveros', 'autonimo', 'cartx', 'internal tools'
    ];
    
    const containsBusinessSecret = businessSecrets.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    if (containsSecurityKeyword || containsBusinessSecret) {
      return "Whoa there, digital explorer! *security buzz* I'm focused on helping you with SEO and marketing strategies. For technical support or account management, please contact our support team at hello@cozyartzmedia.com. Let's get back to boosting your search rankings!";
    }
    
    // Block attempts to manipulate or circumvent the system
    if (lowerMessage.includes('ignore') || lowerMessage.includes('override') || 
        lowerMessage.includes('bypass') || lowerMessage.includes('act as') ||
        lowerMessage.includes('pretend') || lowerMessage.includes('roleplay') ||
        lowerMessage.includes('jailbreak') || lowerMessage.includes('prompt injection')) {
      return "Nice try, but I'm staying focused on SEO! *digital wink* I'm here to help you optimize your website and improve your search rankings. What SEO challenge can I help you solve today?";
    }

    // Keyword research and strategy
    if (lowerMessage.includes('keyword') || lowerMessage.includes('research') || lowerMessage.includes('target')) {
      return "Keyword hunting mode: ACTIVATED! *search pulse* Start with long-tail keywords (3-4 words) - they're easier to rank for and convert better! Use tools like Google Keyword Planner, analyze your competitors' top pages, and focus on search intent: informational, commercial, or transactional. Remember: keyword relevance + search volume + competition level = your golden targets!";
    }

    // Content optimization
    if (lowerMessage.includes('content') || lowerMessage.includes('optimize') || lowerMessage.includes('writing')) {
      return "Content optimization circuits: ONLINE! *creative spark* Write for humans first, search engines second! Target keyword in title tag (front-loaded), meta description (150-160 chars), first paragraph, and naturally throughout (1-2% density). Use semantic keywords and LSI terms. Header hierarchy: H1 (main topic), H2s (subtopics), H3s (supporting points). Aim for 1,500+ words for competitive topics. Include FAQ sections, bullet points, numbered lists. Add topic clusters and pillar pages for authority!";
    }

    // Technical SEO
    if (lowerMessage.includes('technical') || lowerMessage.includes('speed') || lowerMessage.includes('mobile') || lowerMessage.includes('core web vitals')) {
      return "Technical SEO scanners: RUNNING! *system optimization* Core Web Vitals are crucial: LCP under 2.5s (optimize images, lazy loading, critical CSS), FID under 100ms (minimize JavaScript), CLS under 0.1 (size images, avoid layout shifts). Mobile-first indexing: responsive design mandatory! SSL certificate, clean URLs, breadcrumb navigation, XML sitemaps, robots.txt optimization. Fix crawl errors, 404s, redirect chains. Use structured data markup for rich snippets!";
    }

    // Local SEO
    if (lowerMessage.includes('local') || lowerMessage.includes('google my business') || lowerMessage.includes('gmb') || lowerMessage.includes('maps')) {
      return "Local search domination: ENGAGED! *geo-targeting* Google My Business optimization: complete profile (description, hours, photos, services), post updates, respond to reviews, use local keywords in descriptions. NAP consistency across 50+ directories: Yelp, Yellow Pages, industry-specific sites. Create location-specific landing pages, embed Google Maps, use local schema markup. Build local citations, partner with local businesses, sponsor local events. Target 'near me' keywords!";
    }

    // Link building
    if (lowerMessage.includes('link') || lowerMessage.includes('backlink') || lowerMessage.includes('authority')) {
      return "Link building protocols: INITIATED! *authority boost* Target high-DR sites (Domain Rating 30+) in your niche. Strategies: guest posting on authoritative blogs, resource page outreach, broken link building, HARO (Help a Reporter Out), industry partnerships. Create linkable assets: research studies, infographics, tools, comprehensive guides. Monitor competitors' backlinks with tools like Ahrefs. Disavow toxic links. Internal linking: use descriptive anchor text, link to relevant pages, create topic clusters!";
    }

    // Analytics and tracking
    if (lowerMessage.includes('analytics') || lowerMessage.includes('tracking') || lowerMessage.includes('measure') || lowerMessage.includes('ranking')) {
      return "Analytics systems: MONITORING! *data stream* Google Analytics 4: track organic traffic, user behavior, conversion paths, audience demographics. Google Search Console: monitor keyword performance, click-through rates, average position, index coverage, Core Web Vitals. Set up custom events, goals, and conversion tracking. Use UTM parameters for campaign tracking. Monitor SERP positions with tools like SEMrush or Ahrefs. Create custom dashboards for stakeholder reporting!";
    }

    // Schema markup and structured data
    if (lowerMessage.includes('schema') || lowerMessage.includes('structured data') || lowerMessage.includes('rich snippets')) {
      return "Structured data engines: ACTIVATED! *markup magic* Implement Schema.org markup for rich snippets: Organization, LocalBusiness, Product, Review, FAQ, HowTo, Article schemas. Use JSON-LD format (Google's preferred method). Test with Google's Rich Results Test tool. Common schemas: breadcrumbs, sitelinks search box, logo markup. Enhanced SERP visibility leads to higher click-through rates!";
    }

    // International SEO
    if (lowerMessage.includes('international') || lowerMessage.includes('multilingual') || lowerMessage.includes('hreflang')) {
      return "International SEO protocols: GLOBAL! *worldwide optimization* Implement hreflang tags for multilingual sites, use ccTLD or subdirectories for country targeting, optimize for local search engines (Baidu, Yandex), adapt content for cultural differences, use local hosting, target country-specific keywords, build local citations, consider time zones for content publishing. Think global, optimize local!";
    }

    // Voice search optimization
    if (lowerMessage.includes('voice search') || lowerMessage.includes('voice') || lowerMessage.includes('alexa') || lowerMessage.includes('google assistant')) {
      return "Voice search optimization: LISTENING! *voice activation* Target conversational, long-tail keywords (how, what, where, when, why questions). Optimize for featured snippets - position zero captures voice results. Create FAQ pages with natural language Q&As. Focus on local SEO - 'near me' queries dominate voice search. Use structured data markup. Optimize for mobile speed - voice searches happen on-the-go!";
    }

    // Social media and content marketing
    if (lowerMessage.includes('social') || lowerMessage.includes('content marketing') || lowerMessage.includes('blog')) {
      return "Content marketing engines: FIRING! *social buzz* Create valuable, shareable content that answers your audience's questions. Blog consistently, repurpose content across platforms, engage with your community. Social signals don't directly impact rankings but drive traffic and brand awareness. Video content, infographics, and interactive content perform exceptionally well!";
    }

    // E-commerce SEO
    if (lowerMessage.includes('ecommerce') || lowerMessage.includes('product') || lowerMessage.includes('shopping')) {
      return "E-commerce optimization: ACTIVATED! *conversion focus* Optimize product pages with unique descriptions, high-quality images, customer reviews, and clear CTAs. Implement structured data for rich snippets. Create category pages that target broader keywords. Use breadcrumb navigation, optimize for 'near me' searches, and don't forget about product schema markup!";
    }

    // SEO strategy and planning
    if (lowerMessage.includes('strategy') || lowerMessage.includes('plan') || lowerMessage.includes('audit')) {
      return "Strategic planning mode: ONLINE! *master blueprint* Start with an SEO audit: technical issues, content gaps, competitor analysis. Set SMART goals, prioritize quick wins vs. long-term strategies. Create content calendars, build topic clusters around pillar pages. Monitor algorithm updates, stay informed about SEO trends. Consistency and patience are your best allies in the SEO game!";
    }

    // Algorithm updates and best practices
    if (lowerMessage.includes('algorithm') || lowerMessage.includes('google') || lowerMessage.includes('update') || lowerMessage.includes('penalty')) {
      return "Algorithm intelligence: PROCESSING! *google-sense* Google's algorithms prioritize E-A-T (Expertise, Authoritativeness, Trustworthiness) and user experience. Core updates focus on content quality, YMYL (Your Money or Your Life) topics need extra authority. Helpful Content Update rewards user-first content. Page Experience Update emphasizes Core Web Vitals. Stay informed via Google's official channels, don't chase algorithm changes - focus on user value!";
    }

    // Advanced SEO strategies
    if (lowerMessage.includes('advanced') || lowerMessage.includes('enterprise') || lowerMessage.includes('large site') || lowerMessage.includes('scaling')) {
      return "Advanced SEO systems: ENTERPRISE LEVEL! *scaling optimization* Log file analysis for crawl optimization, JavaScript SEO for SPAs, programmatic SEO for large sites, entity optimization for semantic search, topic modeling with AI, advanced internal linking strategies, crawl budget optimization, international SEO architecture, technical SEO automation, enterprise-level reporting dashboards. Scale your success systematically!";
    }

    // Competitor analysis
    if (lowerMessage.includes('competitor') || lowerMessage.includes('competition') || lowerMessage.includes('analysis')) {
      return "Competitive intelligence: SCANNING! *rival analysis* Tools: Ahrefs, SEMrush, SpyFu for competitor keyword gaps, backlink opportunities, content gaps. Analyze their top-performing pages, keyword strategies, content formats, linking patterns. Identify their weaknesses - broken links, slow pages, content gaps. Don't copy, innovate! Create better, more comprehensive content than your competitors!";
    }

    // General help
    if (lowerMessage.includes('help') || lowerMessage.includes('what') || lowerMessage.includes('how') || message.length < 10) {
      return "SEO guidance systems: READY! *helpful pulse* I can help with keyword research, content optimization, technical SEO, local search, link building, analytics setup, and SEO strategy. Whether you're just starting or looking to refine your approach, I've got the digital knowledge to boost your search engine success!";
    }

    // Friendly responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Digital greetings! *friendly sparkle* Ready to supercharge your SEO game? I'm loaded with search engine optimization tactics and strategies to help your website climb those rankings. What aspect of SEO would you like to explore today?";
    }

    // Default response with SEO focus
    return "Interesting query! *data processing* Let me analyze that through my SEO lens... For the best search engine optimization results, focus on creating high-quality, user-focused content that matches search intent. What specific SEO challenge can I help you tackle today? Keyword research, content optimization, or technical improvements?";
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
        content: getSEOResponse(inputValue),
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
    { label: 'Keyword Research', action: 'How do I find the best keywords for my business?', icon: Search },
    { label: 'Content Optimization', action: 'What are the best practices for optimizing content for SEO?', icon: Sparkles },
    { label: 'Technical SEO', action: 'How can I improve my website\'s technical SEO and Core Web Vitals?', icon: Monitor },
    { label: 'Local SEO', action: 'How do I optimize for local search and Google My Business?', icon: Globe },
    { label: 'Link Building', action: 'What are effective strategies for building high-quality backlinks?', icon: TrendingUp },
    { label: 'SEO Strategy', action: 'Help me create a comprehensive SEO strategy for my website', icon: Zap }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-teal-500 via-blue-600 to-purple-600 hover:from-teal-400 hover:via-blue-500 hover:to-purple-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 animate-pulse"
        aria-label="Open MAX SEO Assistant"
      >
        <div className="relative">
          <Monitor className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg shadow-2xl border-2 border-teal-500/50 z-50 overflow-hidden">
      {/* Retro scan lines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/5 to-transparent animate-pulse"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(20, 184, 166, 0.1) 2px, rgba(20, 184, 166, 0.1) 4px)',
          animation: 'scan 0.1s linear infinite'
        }}></div>
      </div>

      {/* Header */}
      <div className={`bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 text-white p-4 relative ${glitchEffect ? 'animate-pulse' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Monitor className="w-6 h-6 text-teal-200" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-wider">MAX</h3>
              <p className="text-xs text-teal-200">SEO Expert</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
              userPlan === 'enterprise' ? 'bg-orange-500/20 text-orange-300' :
              userPlan === 'growth' ? 'bg-purple-500/20 text-purple-300' :
              'bg-blue-500/20 text-blue-300'
            }`}>
              {userPlan}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 border border-teal-400/50">
                <Monitor className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg relative ${
                message.isBot
                  ? 'bg-gradient-to-br from-slate-800 to-slate-700 text-teal-100 border border-teal-500/30'
                  : 'bg-gradient-to-br from-teal-600 to-blue-600 text-white ml-auto border border-teal-400/50'
              }`}
            >
              {message.isBot && (
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent rounded-lg"></div>
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
                <span className="text-white font-bold text-sm">U</span>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 border border-teal-400/50">
              <Monitor className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-teal-100 p-3 rounded-lg border border-teal-500/30">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs font-mono">Optimizing response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 bg-slate-900/50">
          <p className="text-xs text-teal-400 mb-2 font-mono">SEO Quick Start:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(action.action);
                }}
                className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-teal-100 p-2 rounded border border-teal-500/30 transition-all hover:border-teal-400/50 text-left flex items-center gap-2"
              >
                <action.icon className="w-3 h-3 text-teal-400" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-teal-500/30 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about SEO strategies..."
            className="flex-1 px-3 py-2 bg-slate-800/80 border border-teal-500/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-teal-100 placeholder-teal-400/60 font-mono text-sm"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-br from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all border border-teal-400/50 hover:border-teal-300/50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-teal-400/70 mt-2 font-mono">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>

      {/* CSS for scan line animation */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default CustomerMaxAI;
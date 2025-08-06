/**
 * Enhanced AI Assistant API Endpoint
 * Uses comprehensive service knowledge base and security measures
 */

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
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

interface EnhancedAssistantRequest {
  message: string;
  context: 'onboarding' | 'billing' | 'technical' | 'general' | 'sales';
  userId?: string;
  userEmail?: string;
  messageHistory?: Message[];
  leadScore?: number;
  leadData?: LeadData;
  enableLeadCapture?: boolean;
}

// Service knowledge base (secure version for API)
const serviceKnowledgeBase = {
  webDesign: {
    name: "Web Design & Development",
    pricing: { starting: "$2,500", range: "$2,500 - $15,000" },
    timeline: "4-8 weeks",
    features: [
      "Mobile-responsive design",
      "SEO-optimized structure", 
      "Fast loading speeds",
      "Content management system",
      "Professional brand integration",
      "Lead capture forms",
      "Social media integration",
      "Analytics setup"
    ],
    idealFor: "Small to medium businesses, professional services, e-commerce"
  },
  seo: {
    name: "SEO Services", 
    pricing: { starting: "$59/month", range: "$59 - $299/month" },
    timeline: "3-6 months for significant results",
    features: [
      "Comprehensive SEO audit",
      "Keyword research and strategy",
      "On-page optimization",
      "Technical SEO improvements",
      "Local SEO optimization",
      "Content strategy",
      "Link building",
      "Monthly reporting"
    ],
    idealFor: "Local businesses, professional services, e-commerce stores"
  },
  ai: {
    name: "AI Integration Services",
    pricing: { starting: "$1,500", range: "$1,500 - $10,000" },
    timeline: "2-8 weeks",
    features: [
      "AI-powered chatbots",
      "Customer service automation",
      "Content generation systems",
      "Process automation",
      "Data analysis tools",
      "Personalization engines",
      "API integrations"
    ],
    idealFor: "E-commerce, customer service teams, content creators"
  },
  marketing: {
    name: "Digital Marketing",
    pricing: { starting: "$800/month", range: "$800 - $5,000/month" },
    timeline: "Ongoing with monthly optimization",
    features: [
      "Social media management",
      "Google Ads campaigns",
      "Email marketing automation",
      "Content creation",
      "Brand development",
      "Analytics and reporting",
      "Conversion optimization"
    ],
    idealFor: "Growing businesses, local services, B2B companies"
  }
};

const companyInfo = {
  name: "Cozyartz Media Group",
  founded: "2016",
  experience: "8+ years",
  clients: "200+ satisfied clients",
  location: "Michigan, USA (serving nationwide)",
  phone: "269.261.0069",
  email: "hello@cozyartzmedia.com",
  website: "https://cozyartzmedia.com",
  consultation: "https://cozyartzmedia.com/book-consultation"
};

// Restricted topics that should trigger security responses
const restrictedKeywords = [
  "database", "schema", "api key", "token", "password", "secret", 
  "server", "config", "code", "repository", "internal", "admin",
  "cloudflare", "worker", "deployment", "env", "environment"
];

export async function onRequestPost(context: EventContext<{}, any, {}>) {
  const { request, env } = context;

  try {
    const requestData: EnhancedAssistantRequest = await request.json();
    const { 
      message, 
      context: chatContext, 
      messageHistory = [], 
      leadScore = 0,
      leadData = {},
      enableLeadCapture = true
    } = requestData;

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Message is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for restricted content
    const lowerMessage = message.toLowerCase();
    const hasRestrictedContent = restrictedKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (hasRestrictedContent) {
      return new Response(JSON.stringify({
        success: true,
        response: "I focus on helping with our business services and solutions rather than technical implementation details. I'd be happy to discuss our web design, SEO, AI integration, or digital marketing services! What interests you most?",
        suggestions: [
          "Tell me about web design services",
          "What SEO packages do you offer?",
          "How can AI help my business?",
          "I'd like pricing information"
        ]
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const aiResponse = await generateEnhancedResponse({
      message,
      context: chatContext,
      messageHistory,
      leadScore,
      leadData,
      enableLeadCapture
    });

    return new Response(JSON.stringify({
      success: true,
      response: aiResponse.response,
      suggestions: aiResponse.suggestions,
      leadScore,
      context: chatContext
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error) {
    console.error('Enhanced AI Assistant API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      response: `I apologize for the technical difficulty! 😅 You can always reach our team directly at ${companyInfo.email} or ${companyInfo.phone} for immediate assistance.`
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

async function generateEnhancedResponse({
  message,
  context,
  messageHistory,
  leadScore,
  leadData,
  enableLeadCapture
}: {
  message: string;
  context: string;
  messageHistory: Message[];
  leadScore: number;
  leadData: LeadData;
  enableLeadCapture: boolean;
}): Promise<{ response: string; suggestions: string[] }> {
  
  const lowerMessage = message.toLowerCase();
  
  // Personalized greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    const greeting = leadData.firstName ? `Hi ${leadData.firstName}! 👋` : "Hello! 👋";
    return {
      response: `${greeting} I'm thrilled you're here! I'm your AI assistant from ${companyInfo.name}. We've been helping businesses grow online since ${companyInfo.founded} with cutting-edge web design, SEO, and AI solutions.\n\nI'm here to answer questions about our services, pricing, and how we can help transform your business. What brings you here today?`,
      suggestions: [
        "I need a new website",
        "Tell me about SEO services", 
        "How can AI help my business?",
        "What are your prices?",
        "I'd like to book a consultation"
      ]
    };
  }

  // Web design inquiries
  if (lowerMessage.includes('website') || lowerMessage.includes('web design') || lowerMessage.includes('web development')) {
    const service = serviceKnowledgeBase.webDesign;
    return {
      response: `Excellent choice! 🎨 Web design is one of our core specialties. Here's what makes our websites special:\n\n✨ **What's Included:**\n${service.features.map(f => `• ${f}`).join('\n')}\n\n💰 **Investment:** Starting at ${service.pricing.starting} (typically ${service.pricing.range})\n⏱️ **Timeline:** ${service.timeline}\n🎯 **Perfect For:** ${service.idealFor}\n\nWhat type of business is this website for? I can provide more specific recommendations based on your industry!`,
      suggestions: [
        "What's the typical process?",
        "Can I see examples of your work?",
        "Do you handle e-commerce?",
        "I'd like a quote for my project",
        "What about ongoing maintenance?"
      ]
    };
  }

  // SEO inquiries  
  if (lowerMessage.includes('seo') || lowerMessage.includes('search engine') || lowerMessage.includes('google ranking') || lowerMessage.includes('search results')) {
    const service = serviceKnowledgeBase.seo;
    return {
      response: `SEO is fantastic for long-term growth! 📈 Our SEO services have helped clients increase their organic traffic by 150-300% on average.\n\n🔍 **Our SEO Services Include:**\n${service.features.map(f => `• ${f}`).join('\n')}\n\n💰 **Investment:** Starting at ${service.pricing.starting} (${service.pricing.range})\n⏱️ **Results Timeline:** ${service.timeline}\n🎯 **Ideal For:** ${service.idealFor}\n\nWhat's your biggest challenge with online visibility right now?`,
      suggestions: [
        "How long before I see results?",
        "What's included in the audit?",
        "Can you help with local SEO?",
        "What are your success stories?",
        "I want to get started"
      ]
    };
  }

  // AI integration inquiries
  if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('chatbot') || lowerMessage.includes('automation')) {
    const service = serviceKnowledgeBase.ai;
    return {
      response: `AI integration is the future of business! 🤖 We help companies leverage AI to work smarter, not harder.\n\n🚀 **AI Solutions We Provide:**\n${service.features.map(f => `• ${f}`).join('\n')}\n\n💰 **Investment:** Starting at ${service.pricing.starting} (${service.pricing.range})\n⏱️ **Timeline:** ${service.timeline}\n🎯 **Perfect For:** ${service.idealFor}\n\nWhat business processes would you most like to automate or enhance with AI?`,
      suggestions: [
        "Customer service chatbot",
        "Content generation tools",
        "Process automation",
        "Data analysis solutions",
        "Get an AI consultation"
      ]
    };
  }

  // Digital marketing inquiries
  if (lowerMessage.includes('marketing') || lowerMessage.includes('social media') || lowerMessage.includes('advertising') || lowerMessage.includes('google ads')) {
    const service = serviceKnowledgeBase.marketing;
    return {
      response: `Digital marketing is essential for growth! 📊 We create comprehensive strategies that actually drive results.\n\n🎯 **Our Marketing Services:**\n${service.features.map(f => `• ${f}`).join('\n')}\n\n💰 **Investment:** Starting at ${service.pricing.starting} (${service.pricing.range})\n⏱️ **Timeline:** ${service.timeline}\n🎯 **Great For:** ${service.idealFor}\n\nWhat's your primary goal - more leads, increased sales, or better brand awareness?`,
      suggestions: [
        "Social media management",
        "Google Ads campaigns", 
        "Email marketing setup",
        "Content creation services",
        "I need a marketing strategy"
      ]
    };
  }

  // Pricing inquiries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget') || lowerMessage.includes('how much')) {
    return {
      response: `Great question! 💰 Our pricing is tailored to deliver maximum value for your investment:\n\n🌐 **Web Design:** ${serviceKnowledgeBase.webDesign.pricing.range}\n🔍 **SEO Services:** ${serviceKnowledgeBase.seo.pricing.range}\n🤖 **AI Integration:** ${serviceKnowledgeBase.ai.pricing.range}\n📱 **Digital Marketing:** ${serviceKnowledgeBase.marketing.pricing.range}\n\nPricing depends on your specific needs and goals. Most clients find our solutions pay for themselves through increased leads and sales!\n\n${leadScore >= 40 ? "I'd love to provide a personalized quote! " : ""}Want to discuss what would work best for your situation?`,
      suggestions: [
        "I'd like a custom quote",
        "What affects the pricing?",
        "Do you offer payment plans?",
        "Book a free consultation",
        "Tell me about your guarantee"
      ]
    };
  }

  // Quote/consultation requests
  if (lowerMessage.includes('quote') || lowerMessage.includes('estimate') || lowerMessage.includes('consultation') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
    return {
      response: `I'd love to connect you with our team for a personalized consultation! 🎯\n\n**Here's what happens next:**\n• **Free 30-minute consultation** to understand your goals\n• **Custom strategy proposal** tailored to your business\n• **Transparent pricing** with no hidden fees\n• **Timeline and next steps** clearly outlined\n\n📅 **Book Online:** ${companyInfo.consultation}\n📧 **Email Us:** ${companyInfo.email}\n📞 **Call Direct:** ${companyInfo.phone}\n\n${leadScore >= 50 ? "You seem really interested! " : ""}Would you like me to help collect some quick details for a more targeted consultation?`,
      suggestions: [
        "Book consultation now",
        "Email me the details", 
        "Call me instead",
        "I have more questions first",
        "What info do you need?"
      ]
    };
  }

  // Company information
  if (lowerMessage.includes('company') || lowerMessage.includes('about') || lowerMessage.includes('team') || lowerMessage.includes('experience')) {
    return {
      response: `I'm proud to represent ${companyInfo.name}! 🌟\n\n**About Us:**\n• **Founded:** ${companyInfo.founded} (${companyInfo.experience} of excellence)\n• **Clients Served:** ${companyInfo.clients}\n• **Location:** ${companyInfo.location}\n• **Certified:** Women-Owned Small Business (WOSB)\n\n**What Makes Us Different:**\n• Proven track record with measurable results\n• Cutting-edge technology with personal service\n• Transparent communication and pricing\n• Long-term partnership approach\n• Industry expertise across multiple sectors\n\nWe're not just a service provider - we're your growth partners! What would you like to know more about?`,
      suggestions: [
        "Show me your portfolio",
        "What industries do you serve?",
        "Client success stories",
        "Your team's expertise",
        "Why should I choose you?"
      ]
    };
  }

  // Timeline questions
  if (lowerMessage.includes('timeline') || lowerMessage.includes('how long') || lowerMessage.includes('when') || lowerMessage.includes('time frame')) {
    return {
      response: `Great question about timing! ⏰ Here are our typical project timelines:\n\n🌐 **Website Design:** 4-8 weeks\n🔍 **SEO Results:** 3-6 months for significant improvement\n🤖 **AI Integration:** 2-8 weeks (depends on complexity)\n📱 **Digital Marketing:** Ongoing with monthly optimization\n\n**Factors that affect timeline:**\n• Project scope and complexity\n• Content and materials availability\n• Number of revisions needed\n• Client response time\n\n💨 **Need it faster?** We offer expedited services for urgent projects!\n\nDo you have a specific deadline in mind?`,
      suggestions: [
        "I need it done quickly", 
        "Standard timeline is fine",
        "What affects the timeline?",
        "When can we start?",
        "Rush job pricing"
      ]
    };
  }

  // Portfolio/examples requests
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('examples') || lowerMessage.includes('work') || lowerMessage.includes('case study') || lowerMessage.includes('results')) {
    return {
      response: `I'd love to show you our work! 🎨 We have an impressive portfolio spanning multiple industries:\n\n**Recent Successes:**\n• **Healthcare:** HIPAA-compliant patient portals\n• **Education:** Learning management systems\n• **E-commerce:** High-converting online stores\n• **Professional Services:** Lead-generating websites\n• **Restaurants:** Online ordering systems\n• **Non-profits:** Donation and volunteer platforms\n\n**Typical Results:**\n• 150-300% increase in organic traffic\n• 40-60% improvement in conversion rates\n• 200-500% boost in lead generation\n\nYou can view our full portfolio at ${companyInfo.website}, or I can send you specific case studies. What industry are you in?`,
      suggestions: [
        "Show me similar businesses",
        "Healthcare examples",
        "E-commerce case studies", 
        "What results can I expect?",
        "View full portfolio"
      ]
    };
  }

  // Support/help questions
  if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('stuck') || lowerMessage.includes('confused')) {
    return {
      response: `I'm here to help! 😊 Let me make this super easy for you.\n\n**I can help you with:**\n• Understanding our services and pricing\n• Determining what's best for your business\n• Explaining our process and timelines\n• Connecting you with our team\n• Answering any specific questions\n\n**Popular Questions:**\n• "What do you recommend for my type of business?"\n• "How much would this cost for my project?"\n• "Can you help me get started?"\n• "What's your process like?"\n\nWhat specific challenge can I help you solve today?`,
      suggestions: [
        "What do you recommend for me?",
        "I'm not sure what I need",
        "Help me get started",
        "Explain your process",
        "Connect me with your team"
      ]
    };
  }

  // Default responses based on context and lead score
  if (context === 'sales') {
    const isHighIntent = leadScore >= 50;
    const response = isHighIntent 
      ? `Thanks for your continued interest! 🌟 Based on our conversation, I can tell you're serious about growing your business.\n\n**Quick Recap of What We Offer:**\n• Web Design & Development (${serviceKnowledgeBase.webDesign.pricing.starting}+)\n• SEO Services (${serviceKnowledgeBase.seo.pricing.starting}+)\n• AI Integration (${serviceKnowledgeBase.ai.pricing.starting}+)\n• Digital Marketing (${serviceKnowledgeBase.marketing.pricing.starting}+)\n\nI'd love to get you connected with our team for a personalized strategy session. What's the best way to reach you?`
      : `Great question! ${companyInfo.name} specializes in helping businesses like yours succeed online through:\n\n💻 **Web Design & Development**\n🔍 **SEO & Digital Marketing**\n🤖 **AI Integration Services**\n📊 **Analytics & Optimization**\n\nSince ${companyInfo.founded}, we've helped ${companyInfo.clients} achieve their digital goals. What specific challenge can we help you solve?`;

    return {
      response,
      suggestions: isHighIntent 
        ? ["Get my custom quote", "Book consultation now", "Call me today", "Email me details", "I'm ready to start"]
        : ["Tell me about pricing", "I need a new website", "Help with SEO", "AI for my business", "Book consultation"]
    };
  }

  // Generic helpful response
  return {
    response: `I'd be happy to help you learn more about how ${companyInfo.name} can support your business growth! 🚀\n\n**We excel in:**\n• Creating stunning, conversion-focused websites\n• Boosting your search engine rankings\n• Implementing AI solutions to save time and money\n• Developing comprehensive digital marketing strategies\n\nWith ${companyInfo.experience} of experience and ${companyInfo.clients}, we know what works.\n\nCould you tell me more about what you're hoping to achieve? I can provide more specific recommendations!`,
    suggestions: [
      "I need a new website",
      "Improve my Google rankings", 
      "Add AI to my business",
      "Get more customers online",
      "I'd like to learn about pricing"
    ]
  };
}
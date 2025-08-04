/**
 * AI Assistant API Endpoint
 * Handles chat interactions with AI assistant for lead generation and support
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

interface AssistantRequest {
  message: string;
  context: 'onboarding' | 'billing' | 'technical' | 'general' | 'sales';
  userId?: string;
  userEmail?: string;
  messageHistory?: Message[];
  leadScore?: number;
  leadData?: LeadData;
  enableLeadCapture?: boolean;
}

export async function onRequestPost(context: EventContext<{}, any, {}>) {
  const { request, env } = context;

  try {
    // Parse request body
    const requestData: AssistantRequest = await request.json();
    const { 
      message, 
      context: chatContext, 
      userId, 
      userEmail, 
      messageHistory = [], 
      leadScore = 0,
      leadData = {},
      enableLeadCapture = true
    } = requestData;

    // Validate input
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Message is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate AI response based on context and message
    const aiResponse = await generateAIResponse({
      message,
      context: chatContext,
      messageHistory,
      leadScore,
      leadData,
      enableLeadCapture
    });

    return new Response(JSON.stringify({
      success: true,
      response: aiResponse,
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
    console.error('AI Assistant API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      response: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact our support team at hello@cozyartzmedia.com for immediate assistance."
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

async function generateAIResponse({
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
}): Promise<string> {
  
  const lowerMessage = message.toLowerCase();
  
  // Handle greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    if (context === 'sales') {
      return "Hi there! 👋 I'm here to help you discover how Cozyartz Media Group can transform your business with cutting-edge web design, SEO, and AI integration services. What brings you here today?";
    }
    return "Hello! I'm your AI assistant. How can I help you today?";
  }

  // Handle pricing questions
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
    if (context === 'sales') {
      return "Great question! Our pricing varies based on your specific needs and project scope. Here's what we offer:\n\n💻 **Web Design & Development**: Starting at $2,500\n🔍 **SEO Services**: $500-2,000/month\n🤖 **AI Integration**: $1,500-5,000\n📱 **Complete Digital Packages**: $5,000-15,000\n\nI'd love to provide you with a personalized quote! Could you tell me more about what type of project you have in mind?";
    }
    return "I can help you understand our pricing structure. What specific service are you interested in?";
  }

  // Handle web design questions
  if (lowerMessage.includes('website') || lowerMessage.includes('web design') || lowerMessage.includes('web development')) {
    return "Excellent! We specialize in creating stunning, high-converting websites that drive real business results. Our web design services include:\n\n✨ **Custom Design**: Unique, brand-focused designs\n📱 **Mobile-First**: Optimized for all devices\n⚡ **Fast Loading**: Performance-optimized builds\n🔍 **SEO Ready**: Built for search engine success\n💰 **Conversion Focused**: Designed to turn visitors into customers\n\nWhat type of business is this website for? I can provide more specific recommendations based on your industry.";
  }

  // Handle SEO questions
  if (lowerMessage.includes('seo') || lowerMessage.includes('search engine') || lowerMessage.includes('google ranking')) {
    return "SEO is one of our core strengths! 🚀 Our comprehensive SEO services include:\n\n🔍 **Technical SEO**: Site speed, mobile optimization, crawlability\n📝 **Content Strategy**: Keyword research and content creation\n🔗 **Link Building**: High-quality backlink acquisition\n📊 **Local SEO**: Google My Business and local citations\n📈 **Analytics**: Monthly reporting and performance tracking\n\nMost clients see significant improvements within 3-6 months. What's your current biggest challenge with online visibility?";
  }

  // Handle AI questions
  if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('chatbot') || lowerMessage.includes('automation')) {
    return "AI integration is the future of business! 🤖 We help companies leverage AI to:\n\n💬 **Customer Service**: AI chatbots for 24/7 support\n📊 **Data Analysis**: Automated insights and reporting\n🎯 **Personalization**: Dynamic content and recommendations\n⚡ **Process Automation**: Streamline repetitive tasks\n🧠 **Content Generation**: AI-powered marketing content\n\nWhat specific business processes would you like to automate or enhance with AI?";
  }

  // Handle contact/quote requests
  if (lowerMessage.includes('quote') || lowerMessage.includes('estimate') || lowerMessage.includes('contact') || lowerMessage.includes('call')) {
    if (enableLeadCapture && leadScore >= 20) {
      return "I'd be happy to connect you with our team for a personalized quote! 🎯\n\nTo provide you with the most accurate estimate, I'll need a few quick details:\n\n📧 **Email**: So we can send you the quote\n🏢 **Company**: What type of business is this for?\n📈 **Goals**: What are your main objectives?\n💰 **Budget Range**: This helps us recommend the best solutions\n\nAlternatively, you can book a free 30-minute consultation at cozyartzmedia.com/book-consultation where we'll discuss your project in detail!";
    }
    return "I'd love to help you get a quote! You can reach out to our team at hello@cozyartzmedia.com or book a consultation directly on our website.";
  }

  // Handle timeline questions
  if (lowerMessage.includes('timeline') || lowerMessage.includes('how long') || lowerMessage.includes('when') || lowerMessage.includes('deadline')) {
    return "Great question about timing! ⏰ Here are our typical project timelines:\n\n🌐 **Website Design**: 4-8 weeks\n🔍 **SEO Campaign**: 3-6 months for significant results\n🤖 **AI Integration**: 2-6 weeks depending on complexity\n📱 **Mobile App**: 8-16 weeks\n\nWe also offer expedited services for urgent projects. Do you have a specific deadline you need to meet?";
  }

  // Handle portfolio/examples questions
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('examples') || lowerMessage.includes('work') || lowerMessage.includes('case study')) {
    return "Absolutely! We're proud of our diverse portfolio spanning multiple industries 🎨\n\n🏥 **Healthcare**: HIPAA-compliant patient portals\n🏫 **Education**: Learning management systems\n🏢 **Corporate**: Enterprise web applications\n🛒 **E-commerce**: High-converting online stores\n🍕 **Restaurants**: Online ordering systems\n\nYou can view our full portfolio on our website, or I can send you specific case studies relevant to your industry. What type of business are you in?";
  }

  // Handle support/help questions
  if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
    if (context === 'technical') {
      return "I'm here to help with any technical issues! Common topics I can assist with:\n\n🔧 **Platform Issues**: Login, navigation, features\n💳 **Billing**: Payment, subscriptions, invoices\n🔒 **Security**: Account settings, data protection\n📊 **Analytics**: Reports, tracking, performance\n\nWhat specific issue are you experiencing?";
    }
    return "I'm here to help! What specific challenge can I assist you with today?";
  }

  // Handle company information questions
  if (lowerMessage.includes('company') || lowerMessage.includes('about') || lowerMessage.includes('team') || lowerMessage.includes('experience')) {
    return "Great question! Cozyartz Media Group has been transforming businesses since 2016 🚀\n\n👥 **Our Team**: Expert designers, developers, and digital strategists\n🏆 **Experience**: 8+ years serving 200+ satisfied clients\n🌟 **Specialties**: Web design, SEO, AI integration, multimedia production\n🎯 **Mission**: Combining creativity with data-driven strategies\n📍 **Location**: Based in Michigan, serving clients nationwide\n\nWe're certified as a Women-Owned Small Business (WOSB) and pride ourselves on delivering exceptional results. What would you like to know more about?";
  }

  // Default responses based on context
  if (context === 'sales') {
    return "Thanks for your question! I'm here to help you explore how Cozyartz Media Group can boost your business growth. We specialize in:\n\n💻 Web Design & Development\n🔍 SEO & Digital Marketing  \n🤖 AI Integration Services\n📱 Mobile Applications\n🎥 Multimedia Production\n\nWhat specific challenge or goal can we help you achieve? I'd love to learn more about your project!";
  }

  if (context === 'technical') {
    return "I can help you with technical questions about our platform. Common areas include account setup, feature usage, integrations, and troubleshooting. What specific technical topic would you like assistance with?";
  }

  if (context === 'billing') {
    return "I'm here to help with billing and account questions. I can assist with payment issues, subscription management, invoicing, and pricing information. What billing topic can I help you with?";
  }

  // Generic helpful response
  return "I understand you're looking for information. I'm here to help! Could you provide a bit more detail about what you're trying to accomplish? Whether it's about our services, technical support, or general questions, I'm ready to assist you.";
}
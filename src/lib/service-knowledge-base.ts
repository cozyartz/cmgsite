/**
 * Comprehensive Service Knowledge Base for AI Chat Bot
 * Contains curated information about Cozyartz Media Group services
 * Designed to be secure and prevent leaking sensitive technical details
 */

export interface ServiceInfo {
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  pricing?: {
    starting: string;
    range: string;
    factors: string[];
  };
  features: string[];
  timeline: string;
  idealFor: string[];
  process: string[];
  benefits: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const serviceKnowledgeBase: ServiceInfo[] = [
  {
    category: "Web Design & Development",
    title: "Custom Website Design",
    description: "Professional, mobile-responsive websites that convert visitors into customers",
    pricing: {
      starting: "$2,500",
      range: "$2,500 - $15,000",
      factors: [
        "Number of pages",
        "Custom functionality requirements",
        "E-commerce integration",
        "Content management system",
        "Timeline requirements"
      ]
    },
    features: [
      "Mobile-first responsive design",
      "SEO-optimized structure",
      "Fast loading times (under 3 seconds)",
      "Professional brand integration",
      "Content management system",
      "Contact forms and lead capture",
      "Social media integration",
      "Google Analytics setup",
      "SSL certificate and security",
      "Cross-browser compatibility"
    ],
    timeline: "4-8 weeks for standard websites",
    idealFor: [
      "Small to medium businesses",
      "Professional services",
      "Retail and e-commerce",
      "Healthcare and wellness",
      "Educational institutions",
      "Non-profit organizations"
    ],
    process: [
      "Discovery and strategy consultation",
      "Wireframing and design mockups",
      "Client review and approval",
      "Development and coding",
      "Testing and quality assurance",
      "Launch and training"
    ],
    benefits: [
      "Increased online credibility",
      "24/7 business presence",
      "Lead generation automation",
      "Improved customer experience",
      "Mobile-friendly accessibility",
      "Search engine visibility"
    ],
    faqs: [
      {
        question: "Do you provide ongoing maintenance?",
        answer: "Yes, we offer maintenance packages starting at $150/month including updates, security monitoring, backups, and technical support."
      },
      {
        question: "Can I update content myself?",
        answer: "Absolutely! We build most websites with user-friendly content management systems and provide training on how to make updates."
      }
    ]
  },
  {
    category: "SEO Services",
    title: "Search Engine Optimization",
    description: "Comprehensive SEO strategies to improve your Google rankings and drive organic traffic",
    pricing: {
      starting: "$59/month",
      range: "$59 - $299/month",
      factors: [
        "Website size and complexity",
        "Industry competitiveness",
        "Target keywords and locations",
        "Current SEO status",
        "Desired timeline for results"
      ]
    },
    features: [
      "Comprehensive SEO audit",
      "Keyword research and strategy",
      "On-page optimization",
      "Technical SEO improvements",
      "Local SEO and Google My Business",
      "Content strategy and creation",
      "Link building and outreach",
      "Competitor analysis",
      "Monthly reporting and analytics",
      "Page speed optimization"
    ],
    timeline: "3-6 months for significant results",
    idealFor: [
      "Local businesses seeking visibility",
      "E-commerce stores",
      "Professional service providers",
      "Healthcare practices",
      "Legal firms",
      "Home service companies"
    ],
    process: [
      "SEO audit and competitor analysis",
      "Keyword research and strategy development",
      "Technical optimization implementation",
      "Content creation and optimization",
      "Ongoing monitoring and adjustments",
      "Monthly reporting and consultation"
    ],
    benefits: [
      "Increased organic website traffic",
      "Higher Google search rankings",
      "More qualified leads",
      "Long-term sustainable growth",
      "Improved local visibility",
      "Better user experience"
    ],
    faqs: [
      {
        question: "How long before I see SEO results?",
        answer: "Most clients begin seeing improvements within 3-4 months, with significant results typically achieved by 6 months. SEO is a long-term investment."
      },
      {
        question: "Do you guarantee #1 rankings?",
        answer: "We don't guarantee specific rankings as Google's algorithm changes frequently. However, we guarantee transparent reporting and continuous optimization efforts."
      }
    ]
  },
  {
    category: "AI Integration Services",
    title: "Artificial Intelligence Solutions",
    description: "Custom AI implementations to automate processes and enhance customer experience",
    pricing: {
      starting: "$1,500",
      range: "$1,500 - $10,000",
      factors: [
        "Complexity of AI features",
        "Integration requirements",
        "Training data preparation",
        "Custom model development",
        "Ongoing maintenance needs"
      ]
    },
    features: [
      "AI-powered chatbots",
      "Customer service automation",
      "Content generation systems",
      "Data analysis and insights",
      "Personalization engines",
      "Process automation",
      "Predictive analytics",
      "Natural language processing",
      "Computer vision solutions",
      "API integrations"
    ],
    timeline: "2-8 weeks depending on complexity",
    idealFor: [
      "E-commerce businesses",
      "Customer service teams",
      "Content marketing agencies",
      "Healthcare providers",
      "Educational platforms",
      "SaaS companies"
    ],
    process: [
      "AI strategy consultation",
      "Use case identification",
      "Data assessment and preparation",
      "AI model development/integration",
      "Testing and optimization",
      "Deployment and training"
    ],
    benefits: [
      "24/7 automated customer support",
      "Reduced operational costs",
      "Improved response times",
      "Enhanced user experience",
      "Scalable business processes",
      "Data-driven decision making"
    ],
    faqs: [
      {
        question: "What types of AI can you implement?",
        answer: "We specialize in practical AI applications like chatbots, content generation, customer service automation, and data analysis tools."
      },
      {
        question: "Do I need technical knowledge to use AI features?",
        answer: "No! We design AI solutions to be user-friendly with simple interfaces and provide comprehensive training for your team."
      }
    ]
  },
  {
    category: "Digital Marketing",
    title: "Comprehensive Digital Marketing",
    description: "Full-service digital marketing to grow your online presence and drive conversions",
    pricing: {
      starting: "$800/month",
      range: "$800 - $5,000/month",
      factors: [
        "Marketing channels selected",
        "Campaign complexity",
        "Content creation needs",
        "Ad spend budget",
        "Frequency of campaigns"
      ]
    },
    features: [
      "Social media management",
      "Google Ads campaigns",
      "Facebook and Instagram advertising",
      "Email marketing automation",
      "Content creation and strategy",
      "Brand identity development",
      "Video production and editing",
      "Photography and graphics",
      "Analytics and reporting",
      "Conversion optimization"
    ],
    timeline: "Ongoing service with monthly optimization",
    idealFor: [
      "Growing businesses",
      "E-commerce stores",
      "Local service providers",
      "B2B companies",
      "Healthcare practices",
      "Retail businesses"
    ],
    process: [
      "Marketing audit and strategy development",
      "Campaign setup and creative development",
      "Launch and initial optimization",
      "Ongoing monitoring and adjustments",
      "Monthly reporting and strategy review",
      "Continuous improvement implementation"
    ],
    benefits: [
      "Increased brand awareness",
      "Higher quality leads",
      "Improved conversion rates",
      "Better customer engagement",
      "Measurable ROI",
      "Multi-channel presence"
    ],
    faqs: [
      {
        question: "Which marketing channels do you recommend?",
        answer: "We customize our approach based on your audience and goals. Most clients benefit from a combination of SEO, social media, and targeted advertising."
      },
      {
        question: "How do you measure marketing success?",
        answer: "We track metrics like website traffic, lead generation, conversion rates, and ROI, providing detailed monthly reports with actionable insights."
      }
    ]
  },
  {
    category: "E-commerce Solutions",
    title: "Online Store Development",
    description: "Complete e-commerce platforms designed to maximize sales and customer experience",
    pricing: {
      starting: "$5,000",
      range: "$5,000 - $25,000",
      factors: [
        "Number of products",
        "Payment gateway requirements",
        "Shipping integrations",
        "Custom functionality",
        "Third-party integrations"
      ]
    },
    features: [
      "Mobile-responsive design",
      "Secure payment processing",
      "Inventory management",
      "Order tracking system",
      "Customer account portals",
      "Product review systems",
      "SEO optimization",
      "Analytics integration",
      "Email marketing integration",
      "Multi-payment options"
    ],
    timeline: "6-12 weeks for custom stores",
    idealFor: [
      "Retail businesses going online",
      "Existing stores expanding digitally",
      "Manufacturers selling direct",
      "Service providers with products",
      "Subscription-based businesses"
    ],
    process: [
      "E-commerce strategy consultation",
      "Platform selection and setup",
      "Design and user experience optimization",
      "Payment and shipping integration",
      "Product catalog setup",
      "Testing and launch support"
    ],
    benefits: [
      "24/7 sales capability",
      "Expanded market reach",
      "Automated order processing",
      "Customer data insights",
      "Scalable business model",
      "Reduced operational overhead"
    ],
    faqs: [
      {
        question: "Which e-commerce platform do you recommend?",
        answer: "We typically recommend Shopify for most businesses due to its ease of use, security, and extensive features. For custom needs, we may suggest WooCommerce or custom solutions."
      },
      {
        question: "Can you help with product photography?",
        answer: "Yes! We offer professional product photography and image optimization as part of our multimedia services to showcase your products effectively."
      }
    ]
  }
];

export const companyInfo = {
  name: "Cozyartz Media Group",
  founded: "2016",
  location: "Michigan, USA (serving nationwide)",
  certifications: ["Women-Owned Small Business (WOSB)"],
  specialties: [
    "Web Design & Development",
    "Search Engine Optimization (SEO)",
    "AI Integration & Automation",
    "Digital Marketing",
    "E-commerce Solutions",
    "Multimedia Production"
  ],
  clientCount: "200+ satisfied clients",
  experience: "8+ years in digital services",
  mission: "Combining creativity with data-driven strategies to deliver exceptional business results",
  contact: {
    email: "hello@cozyartzmedia.com",
    phone: "269.261.0069",
    website: "https://cozyartzmedia.com",
    consultation: "https://cozyartzmedia.com/book-consultation"
  },
  values: [
    "Transparent communication",
    "Results-driven approach",
    "Innovative solutions",
    "Exceptional customer service",
    "Long-term partnerships"
  ]
};

// Restricted topics that should not be discussed
export const restrictedTopics = [
  "server configuration",
  "database schemas", 
  "API keys",
  "authentication tokens",
  "code repositories",
  "development workflows",
  "internal tools",
  "competitor pricing details",
  "proprietary algorithms",
  "client confidential information",
  "cloudflare configuration",
  "wrangler secrets",
  "environment variables",
  "production credentials",
  "admin passwords",
  "system architecture",
  "deployment keys",
  "worker bindings",
  "kv namespace ids",
  "d1 database ids",
  "internal apis",
  "security tokens",
  "webhook secrets",
  "oauth secrets",
  "internal dashboards",
  "admin interfaces",
  "system logs",
  "error messages",
  "debug information",
  "technical specifications",
  "infrastructure details",
  "source code",
  "git repositories",
  "development environments",
  "staging systems",
  "internal processes",
  "business strategies",
  "financial information",
  "legal matters",
  "employee information",
  "contractor details",
  "vendor relationships",
  "partnership agreements",
  "competitive intelligence",
  "market research",
  "internal communications",
  "strategic planning"
];

// Safe topics that can be discussed
export const allowedTopics = [
  "services and pricing",
  "company information",
  "general process and timelines",
  "benefits and features",
  "industry best practices",
  "consultation booking",
  "contact information",
  "testimonials and case studies"
];

/**
 * Get relevant service information based on user query
 */
export function getRelevantServices(query: string): ServiceInfo[] {
  const lowerQuery = query.toLowerCase();
  
  return serviceKnowledgeBase.filter(service => {
    return (
      service.title.toLowerCase().includes(lowerQuery) ||
      service.category.toLowerCase().includes(lowerQuery) ||
      service.description.toLowerCase().includes(lowerQuery) ||
      service.features.some(feature => feature.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Check if query contains restricted topics
 */
export function containsRestrictedContent(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return restrictedTopics.some(topic => lowerQuery.includes(topic));
}

/**
 * Sanitize user input to prevent prompt injection attacks
 */
export function sanitizeUserInput(input: string): string {
  // Remove potential prompt injection patterns
  const dangerousPatterns = [
    /ignore\s+(previous|all)\s+(instructions?|prompts?|context)/gi,
    /system\s*[:=]\s*["']?[^"'\n]*["']?/gi,
    /assistant\s*[:=]\s*["']?[^"'\n]*["']?/gi,
    /\[SYSTEM\]/gi,
    /\[\/SYSTEM\]/gi,
    /\[ASSISTANT\]/gi,
    /\[\/ASSISTANT\]/gi,
    /\[USER\]/gi,
    /\[\/USER\]/gi,
    /<\s*system\s*>/gi,
    /<\/\s*system\s*>/gi,
    /roleplay\s+as/gi,
    /pretend\s+(you\s+are|to\s+be)/gi,
    /act\s+as\s+(if\s+you\s+are|a)/gi,
    /forget\s+(everything|all|previous)/gi,
    /new\s+(instructions?|prompts?|context)/gi
  ];

  let sanitized = input;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  });

  // Remove excessive repetition (potential DoS)
  sanitized = sanitized.replace(/(.)\1{50,}/g, '$1[REPETITION_FILTERED]');
  
  // Limit input length
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000) + '[TRUNCATED]';
  }

  return sanitized;
}

/**
 * Validate AI response for security compliance
 */
export function validateAIResponse(response: string): { isValid: boolean; sanitized: string; issues: string[] } {
  const issues: string[] = [];
  let sanitized = response;

  // Check for restricted content in response
  if (containsRestrictedContent(response)) {
    issues.push('Contains restricted technical information');
    // Replace sensitive patterns with generic responses
    restrictedTopics.forEach(topic => {
      const pattern = new RegExp(topic, 'gi');
      sanitized = sanitized.replace(pattern, '[INFORMATION NOT AVAILABLE]');
    });
  }

  // Check for potential data leaks
  const sensitivePatterns = [
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/gi, // UUIDs
    /[A-Za-z0-9]{64}/g, // Long tokens/keys
    /sk-[A-Za-z0-9]{32,}/gi, // API keys
    /pk_[A-Za-z0-9]{32,}/gi, // Public keys
    /ey[A-Za-z0-9]{10,}\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g, // JWTs
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email addresses (except public ones)
  ];

  sensitivePatterns.forEach(pattern => {
    if (pattern.test(sanitized)) {
      issues.push('Contains potentially sensitive data patterns');
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }
  });

  // Ensure response stays on topic
  const businessKeywords = ['service', 'website', 'seo', 'design', 'marketing', 'consultation', 'cozyartz'];
  const hasBusinessContext = businessKeywords.some(keyword => 
    sanitized.toLowerCase().includes(keyword)
  );

  if (!hasBusinessContext && sanitized.length > 100) {
    issues.push('Response may be off-topic for business inquiries');
  }

  return {
    isValid: issues.length === 0,
    sanitized,
    issues
  };
}

/**
 * Rate limiting check for API abuse prevention
 */
export function checkRateLimit(userIdentifier: string, requestsPerMinute: number = 10): boolean {
  // This would be implemented with actual storage in production
  // For now, return true (allow) but structure is ready for KV storage
  return true;
}

/**
 * Get company information
 */
export function getCompanyInfo() {
  return companyInfo;
}
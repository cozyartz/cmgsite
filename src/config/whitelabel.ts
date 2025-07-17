export interface WhitelabelConfig {
  brandName: string;
  companyName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  domain: string;
  contact: {
    email: string;
    phone: string;
    address: {
      street?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  social: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  legal: {
    businessName: string;
    foundingDate: string;
    businessType: string;
    registrationNumber?: string;
    taxId?: string;
  };
  services: {
    seo: boolean;
    webDesign: boolean;
    aiServices: boolean;
    drones: boolean;
    multimedia: boolean;
    instructionalDesign: boolean;
  };
  pricing: {
    starter: {
      price: number;
      aiCalls: number;
      domainLimit: number;
      features: string[];
    };
    starterPlus: {
      price: number;
      aiCalls: number;
      domainLimit: number;
      features: string[];
    };
    growth: {
      price: number;
      aiCalls: number;
      domainLimit: number;
      features: string[];
      discount: number; // percentage off consultations
    };
    growthPlus: {
      price: number;
      aiCalls: number;
      domainLimit: number;
      features: string[];
      discount: number; // percentage off consultations
    };
    enterprise: {
      price: number;
      aiCalls: number;
      domainLimit: number;
      features: string[];
      discount: number; // percentage off consultations
    };
    enterprisePlus: {
      price: number;
      aiCalls: number;
      domainLimit: number;
      features: string[];
      discount: number; // percentage off consultations
    };
    consultations: {
      strategic: number; // per hour in cents
      partnership: number; // per hour in cents
      implementation: number; // per hour in cents
    };
    aiOverage: number; // per call in cents
    prepaymentDiscount: number; // percentage off for 3-month prepayment
  };
  features: {
    clientPortal: boolean;
    whitelabel: boolean;
    customBranding: boolean;
    multiTenant: boolean;
    prepaymentOption: boolean;
  };
}

// Default Cozyartz Media Group configuration
export const defaultWhitelabelConfig: WhitelabelConfig = {
  brandName: "COZYARTZ",
  companyName: "Cozyartz Media Group",
  logo: "/cmgLogo.png",
  primaryColor: "#14b8a6", // teal-500
  secondaryColor: "#0f766e", // teal-600
  domain: "cozyartzmedia.com",
  contact: {
    email: "hello@cozyartzmedia.com",
    phone: "+1 (269) 261-0069",
    address: {
      city: "Battle Creek",
      state: "Michigan",
      zip: "49015",
      country: "US"
    }
  },
  social: {
    facebook: "https://www.facebook.com/cozyartzmedia/",
    linkedin: "https://www.linkedin.com/company/cozyartzmediagroup",
    github: "https://github.com/cozyartz/cmgsite"
  },
  legal: {
    businessName: "Cozyartz Media Group",
    foundingDate: "2016",
    businessType: "ProfessionalService",
    registrationNumber: "WOSB Certified",
    taxId: "EIN: [Protected]"
  },
  services: {
    seo: true,
    webDesign: true,
    aiServices: true,
    drones: true,
    multimedia: true,
    instructionalDesign: true
  },
  pricing: {
    starter: {
      price: 100000, // $1,000 in cents (Special rate for Jon Werbeck)
      aiCalls: 100,
      domainLimit: 1,
      features: [
        "Basic SEO tools",
        "Monthly reporting",
        "Email support",
        "100 AI calls/month",
        "1 domain"
      ]
    },
    starterPlus: {
      price: 125000, // $1,250 in cents
      aiCalls: 150,
      domainLimit: 2,
      features: [
        "Basic SEO tools",
        "Monthly reporting",
        "Email support",
        "150 AI calls/month",
        "2 domains"
      ]
    },
    growth: {
      price: 150000, // $1,500 in cents
      aiCalls: 250,
      domainLimit: 5,
      features: [
        "Advanced SEO tools",
        "Bi-weekly reporting",
        "Priority support",
        "250 AI calls/month",
        "5 domains",
        "Competitor analysis"
      ],
      discount: 10 // 10% off consultations
    },
    growthPlus: {
      price: 200000, // $2,000 in cents
      aiCalls: 400,
      domainLimit: 10,
      features: [
        "Advanced SEO tools",
        "Bi-weekly reporting",
        "Priority support",
        "400 AI calls/month",
        "10 domains",
        "Competitor analysis",
        "Advanced keyword tracking"
      ],
      discount: 15 // 15% off consultations
    },
    enterprise: {
      price: 250000, // $2,500 in cents
      aiCalls: 500,
      domainLimit: 25,
      features: [
        "Full SEO suite",
        "Weekly reporting",
        "Dedicated account manager",
        "500 AI calls/month",
        "25 domains",
        "Advanced analytics",
        "White-label options"
      ],
      discount: 20 // 20% off consultations
    },
    enterprisePlus: {
      price: 350000, // $3,500 in cents
      aiCalls: 1000,
      domainLimit: 50,
      features: [
        "Full SEO suite",
        "Daily reporting",
        "Dedicated account manager",
        "1000 AI calls/month",
        "50 domains",
        "Advanced analytics",
        "White-label options",
        "Custom integrations"
      ],
      discount: 25 // 25% off consultations
    },
    consultations: {
      strategic: 25000, // $250/hour in cents
      partnership: 50000, // $500/hour in cents
      implementation: 15000 // $150/hour in cents
    },
    aiOverage: 50, // $0.50 per call in cents
    prepaymentDiscount: 10 // 10% off for 3-month prepayment
  },
  features: {
    clientPortal: true,
    whitelabel: true,
    customBranding: true,
    multiTenant: true,
    prepaymentOption: true
  }
};

// Example partner configuration (for demonstration)
export const partnerWhitelabelConfig: WhitelabelConfig = {
  brandName: "PARTNER SEO",
  companyName: "Partner SEO Solutions",
  logo: "/partner-logo.png",
  primaryColor: "#3b82f6", // blue-500
  secondaryColor: "#1d4ed8", // blue-700
  domain: "partner-seo.com",
  contact: {
    email: "info@partner-seo.com",
    phone: "+1 (555) 123-4567",
    address: {
      city: "Austin",
      state: "Texas",
      zip: "78701",
      country: "US"
    }
  },
  social: {
    linkedin: "https://www.linkedin.com/company/partnerseo",
    twitter: "https://twitter.com/partnerseo"
  },
  legal: {
    businessName: "Partner SEO Solutions LLC",
    foundingDate: "2024",
    businessType: "ProfessionalService"
  },
  services: {
    seo: true,
    webDesign: true,
    aiServices: true,
    drones: false,
    multimedia: false,
    instructionalDesign: false
  },
  pricing: {
    starter: {
      price: 120000, // $1,200 in cents (20% markup)
      aiCalls: 100,
      domainLimit: 1,
      features: [
        "Basic SEO tools",
        "Monthly reporting",
        "Email support",
        "100 AI calls/month",
        "1 domain"
      ]
    },
    starterPlus: {
      price: 150000, // $1,500 in cents (20% markup)
      aiCalls: 150,
      domainLimit: 2,
      features: [
        "Basic SEO tools",
        "Monthly reporting",
        "Email support",
        "150 AI calls/month",
        "2 domains"
      ]
    },
    growth: {
      price: 180000, // $1,800 in cents (20% markup)
      aiCalls: 250,
      domainLimit: 5,
      features: [
        "Advanced SEO tools",
        "Bi-weekly reporting",
        "Priority support",
        "250 AI calls/month",
        "5 domains",
        "Competitor analysis"
      ],
      discount: 10
    },
    growthPlus: {
      price: 240000, // $2,400 in cents (20% markup)
      aiCalls: 400,
      domainLimit: 10,
      features: [
        "Advanced SEO tools",
        "Bi-weekly reporting",
        "Priority support",
        "400 AI calls/month",
        "10 domains",
        "Competitor analysis",
        "Advanced keyword tracking"
      ],
      discount: 15
    },
    enterprise: {
      price: 300000, // $3,000 in cents (20% markup)
      aiCalls: 500,
      domainLimit: 25,
      features: [
        "Full SEO suite",
        "Weekly reporting",
        "Dedicated account manager",
        "500 AI calls/month",
        "25 domains",
        "Advanced analytics"
      ],
      discount: 20
    },
    enterprisePlus: {
      price: 420000, // $4,200 in cents (20% markup)
      aiCalls: 1000,
      domainLimit: 50,
      features: [
        "Full SEO suite",
        "Daily reporting",
        "Dedicated account manager",
        "1000 AI calls/month",
        "50 domains",
        "Advanced analytics",
        "Custom integrations"
      ],
      discount: 25
    },
    consultations: {
      strategic: 30000, // $300/hour (20% markup)
      partnership: 60000, // $600/hour (20% markup)
      implementation: 18000 // $180/hour (20% markup)
    },
    aiOverage: 60, // $0.60 per call (20% markup)
    prepaymentDiscount: 10 // 10% off for 3-month prepayment
  },
  features: {
    clientPortal: true,
    whitelabel: false, // Partners can't offer whitelabel to their clients
    customBranding: true,
    multiTenant: true,
    prepaymentOption: true
  }
};

// Function to get current configuration (in production, this would come from database)
export function getWhitelabelConfig(): WhitelabelConfig {
  // In production, this would check subdomain/domain and return appropriate config
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  
  // For development, always return default config
  if (hostname === 'localhost' || hostname.includes('cozyartz')) {
    return defaultWhitelabelConfig;
  }
  
  // Example: if hostname is 'partner-seo.com', return partner config
  if (hostname.includes('partner-seo')) {
    return partnerWhitelabelConfig;
  }
  
  return defaultWhitelabelConfig;
}

// Helper function to format currency
export function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amountInCents / 100);
}

// Helper function to get pricing tier discount
export function getConsultationDiscount(tier: PricingTier): number {
  const config = getWhitelabelConfig();
  return config.pricing[tier].discount || 0;
}

// Helper function to calculate discounted consultation rate
export function getDiscountedConsultationRate(
  consultationType: 'strategic' | 'partnership' | 'implementation',
  tier: PricingTier
): number {
  const config = getWhitelabelConfig();
  const baseRate = config.pricing.consultations[consultationType];
  const discount = getConsultationDiscount(tier);
  
  return Math.round(baseRate * (1 - discount / 100));
}

// Type definition for pricing tiers
export type PricingTier = 'starter' | 'starterPlus' | 'growth' | 'growthPlus' | 'enterprise' | 'enterprisePlus';

// Helper function to get tier pricing with coupon applied
export function getTierPriceWithCoupon(tier: PricingTier, couponDiscountCents: number = 0): number {
  const config = getWhitelabelConfig();
  const basePrice = config.pricing[tier].price;
  return Math.max(0, basePrice - couponDiscountCents);
}

// Helper function to calculate prepayment total
export function calculatePrepaymentTotal(tier: PricingTier, couponDiscountCents: number = 0): {
  monthlyPrice: number;
  threeMonthTotal: number;
  prepaymentDiscount: number;
  prepaymentTotal: number;
  totalSavings: number;
} {
  const config = getWhitelabelConfig();
  const monthlyPrice = getTierPriceWithCoupon(tier, couponDiscountCents);
  const threeMonthTotal = monthlyPrice * 3;
  const prepaymentDiscount = config.pricing.prepaymentDiscount;
  const prepaymentTotal = Math.round(threeMonthTotal * (1 - prepaymentDiscount / 100));
  const totalSavings = threeMonthTotal - prepaymentTotal;

  return {
    monthlyPrice,
    threeMonthTotal,
    prepaymentDiscount,
    prepaymentTotal,
    totalSavings
  };
}

// Helper function to get domain limit for tier
export function getDomainLimit(tier: PricingTier): number {
  const config = getWhitelabelConfig();
  return config.pricing[tier].domainLimit;
}

// Helper function to get AI calls limit for tier
export function getAICalls(tier: PricingTier): number {
  const config = getWhitelabelConfig();
  return config.pricing[tier].aiCalls;
}

// Jon Werbeck paying client configuration
export const jonWerbeckConfig = {
  email: 'jon@jwpartnership.com',
  couponCode: 'JON250', // $250/month off for 3 months - client pricing
  specialTier: 'starter' as PricingTier,
  specialPrice: 100000, // $1,000/month base price (will be $750 with coupon)
  duration: 3, // months
  clientStatus: 'paying_client', // Active paying client
  purpose: 'client_service' // Regular client service
};

// Amy Tipton business advisor configuration
export const amyTiptonConfig = {
  personalEmail: 'amy.tipton@company.com',
  personalCouponCode: 'AMYFREE', // 6 months free Starter tier for basic testing
  companyCouponCode: 'AMYCOMPANY40', // 40% off any tier for first year for her company
  personalTier: 'starter' as PricingTier, // First paid tier - NO white-label access
  personalDuration: 6, // months
  companyDiscount: 40, // percentage
  advisorStatus: 'business_advisor', // Confirmed business advisor
  purpose: 'advisor_testing', // Platform testing and business guidance
  rateLimit: {
    aiCalls: 100, // Standard Starter tier: 100 AI calls/month
    domains: 1, // Standard Starter tier: 1 domain
    overageRate: 50, // $0.50 per additional AI call (cents)
    noWhitelabel: true // Explicitly no white-label access
  },
  testingFeatures: {
    aiAssistantAccess: true, // AI assistant for support
    basicTesting: true, // Basic platform testing
    paymentTesting: true, // PayPal integration testing
    securityTesting: true, // Security audit participation
    // Removed enterprise features:
    betaFeatures: false, // No beta access
    directSupportLine: false, // Standard support only
    feedbackPortal: false, // No special feedback portal
    unlimitedDomains: false, // Starter limit: 1 domain
    unlimitedAICalls: false, // Starter limit: 100 calls/month
    whitelabelAccess: false // NO white-label access
  },
  testingPeriod: {
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
    reminderDays: [30, 14, 7, 1], // Days before expiration to send reminders
    autoExpire: true
  }
};
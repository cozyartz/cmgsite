/**
 * Cloudflare Registrar API Integration
 * 
 * While Cloudflare doesn't offer traditional commissions (they sell at cost),
 * we can add value by providing domain management as part of our SEO services
 * and charging a service fee for domain setup, management, and integration.
 */

export class CloudflareRegistrarService {
  constructor(apiToken, accountId) {
    this.apiToken = apiToken;
    this.accountId = accountId;
    this.baseURL = 'https://api.cloudflare.com/client/v4';
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Cloudflare API Error: ${data.errors?.[0]?.message || 'Unknown error'}`);
    }

    return data;
  }

  /**
   * List all domains in the account
   */
  async listDomains() {
    const endpoint = `/accounts/${this.accountId}/registrar/domains`;
    return await this.makeRequest(endpoint);
  }

  /**
   * Get detailed information about a specific domain
   */
  async getDomainDetails(domainName) {
    const endpoint = `/accounts/${this.accountId}/registrar/domains/${domainName}`;
    return await this.makeRequest(endpoint);
  }

  /**
   * Update domain settings
   */
  async updateDomain(domainName, updates) {
    const endpoint = `/accounts/${this.accountId}/registrar/domains/${domainName}`;
    return await this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  /**
   * Check domain availability (uses zone endpoint since registrar doesn't have availability check)
   */
  async checkDomainAvailability(domainName) {
    try {
      // Try to get zone info - if it exists, domain might be taken
      const endpoint = `/zones?name=${domainName}`;
      const response = await this.makeRequest(endpoint);
      
      return {
        domain: domainName,
        available: response.result.length === 0,
        message: response.result.length > 0 ? 'Domain appears to be registered' : 'Domain may be available'
      };
    } catch (error) {
      return {
        domain: domainName,
        available: null,
        error: error.message
      };
    }
  }

  /**
   * Get domain pricing from registry (this would need to be enhanced with actual pricing data)
   */
  async getDomainPricing(domainName) {
    const tld = domainName.split('.').pop();
    
    // Common TLD pricing (these are approximate registry costs)
    const pricingMap = {
      'com': { register: 8.86, renew: 8.86, transfer: 8.86 },
      'net': { register: 11.86, renew: 11.86, transfer: 11.86 },
      'org': { register: 11.86, renew: 11.86, transfer: 11.86 },
      'io': { register: 54.00, renew: 54.00, transfer: 54.00 },
      'ai': { register: 120.00, renew: 120.00, transfer: 120.00 },
      'shop': { register: 3.98, renew: 32.98, transfer: 32.98 },
      'dev': { register: 12.00, renew: 12.00, transfer: 12.00 },
      'app': { register: 18.00, renew: 18.00, transfer: 18.00 },
    };

    const pricing = pricingMap[tld] || { register: 15.00, renew: 15.00, transfer: 15.00 };
    
    return {
      domain: domainName,
      tld: tld,
      pricing: {
        registration: pricing.register,
        renewal: pricing.renew,
        transfer: pricing.transfer,
        currency: 'USD'
      },
      // Our service fees for domain management
      serviceFees: {
        setup: 50.00, // One-time setup fee
        management: 10.00, // Monthly management fee
        integration: 25.00, // SEO integration fee
      }
    };
  }

  /**
   * Create a zone for a domain (first step in domain setup)
   */
  async createZone(domainName) {
    const endpoint = '/zones';
    return await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        name: domainName,
        type: 'full'
      })
    });
  }

  /**
   * Get nameservers for a domain
   */
  async getNameservers(domainName) {
    try {
      const zones = await this.makeRequest(`/zones?name=${domainName}`);
      if (zones.result.length > 0) {
        const zone = zones.result[0];
        return {
          domain: domainName,
          nameservers: zone.name_servers,
          status: zone.status
        };
      }
      throw new Error('Domain not found in Cloudflare');
    } catch (error) {
      return {
        domain: domainName,
        error: error.message
      };
    }
  }

  /**
   * Setup DNS records for SEO optimization
   */
  async setupSEODNS(domainName, records = []) {
    try {
      const zones = await this.makeRequest(`/zones?name=${domainName}`);
      if (zones.result.length === 0) {
        throw new Error('Domain not found in Cloudflare');
      }

      const zoneId = zones.result[0].id;
      const results = [];

      // Default SEO-friendly DNS records
      const defaultRecords = [
        { type: 'A', name: '@', content: '192.0.2.1', comment: 'Main website' },
        { type: 'A', name: 'www', content: '192.0.2.1', comment: 'WWW subdomain' },
        { type: 'CNAME', name: 'blog', content: domainName, comment: 'Blog subdomain for SEO' },
        { type: 'MX', name: '@', content: '10 mail.' + domainName, comment: 'Email setup' },
        { type: 'TXT', name: '@', content: 'v=spf1 include:_spf.google.com ~all', comment: 'SPF record' },
        ...records
      ];

      for (const record of defaultRecords) {
        try {
          const result = await this.makeRequest(`/zones/${zoneId}/dns_records`, {
            method: 'POST',
            body: JSON.stringify(record)
          });
          results.push({ success: true, record: record.name, result });
        } catch (error) {
          results.push({ success: false, record: record.name, error: error.message });
        }
      }

      return {
        domain: domainName,
        zoneId,
        records: results
      };
    } catch (error) {
      return {
        domain: domainName,
        error: error.message
      };
    }
  }
}

/**
 * Domain Service Integration for SEO Platform
 * This adds domain services to our existing SEO offering
 */
export class DomainSEOService {
  constructor(registrarService, emailService) {
    this.registrar = registrarService;
    this.email = emailService;
  }

  /**
   * Search for available domains with SEO recommendations
   */
  async searchDomains(baseName, tlds = ['com', 'net', 'org', 'io']) {
    const results = [];
    
    for (const tld of tlds) {
      const domain = `${baseName}.${tld}`;
      try {
        const [availability, pricing] = await Promise.all([
          this.registrar.checkDomainAvailability(domain),
          this.registrar.getDomainPricing(domain)
        ]);
        
        results.push({
          domain,
          available: availability.available,
          pricing: pricing.pricing,
          serviceFees: pricing.serviceFees,
          totalFirstYear: pricing.pricing.registration + pricing.serviceFees.setup,
          seoScore: this.calculateSEOScore(domain),
          recommendations: this.getSEORecommendations(domain)
        });
      } catch (error) {
        results.push({
          domain,
          error: error.message
        });
      }
    }

    return results.sort((a, b) => (b.seoScore || 0) - (a.seoScore || 0));
  }

  /**
   * Calculate SEO score for a domain
   */
  calculateSEOScore(domain) {
    let score = 50; // Base score
    
    const tld = domain.split('.').pop();
    const name = domain.split('.')[0];
    
    // TLD scoring
    if (tld === 'com') score += 20;
    else if (['org', 'net'].includes(tld)) score += 15;
    else if (['io', 'dev', 'app'].includes(tld)) score += 10;
    
    // Length scoring
    if (name.length <= 8) score += 15;
    else if (name.length <= 12) score += 10;
    else if (name.length > 20) score -= 10;
    
    // Character scoring
    if (!/[-_0-9]/.test(name)) score += 10; // No hyphens, underscores, or numbers
    if (/^[a-z]+$/.test(name)) score += 5; // Only letters
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Get SEO recommendations for a domain
   */
  getSEORecommendations(domain) {
    const recommendations = [];
    const tld = domain.split('.').pop();
    const name = domain.split('.')[0];
    
    if (tld === 'com') {
      recommendations.push('✅ .com is the most trusted TLD for SEO');
    } else {
      recommendations.push('💡 Consider .com for maximum SEO benefit');
    }
    
    if (name.length <= 8) {
      recommendations.push('✅ Short domain name is easy to remember and type');
    } else if (name.length > 15) {
      recommendations.push('⚠️ Long domain names can hurt user experience');
    }
    
    if (/-/.test(name)) {
      recommendations.push('⚠️ Hyphens can make domains harder to remember');
    }
    
    if (/\d/.test(name)) {
      recommendations.push('⚠️ Numbers in domains can cause confusion');
    }
    
    return recommendations;
  }

  /**
   * Complete domain setup package with SEO optimization
   */
  async setupDomainPackage(domainName, clientId, packageType = 'basic') {
    try {
      const packages = {
        basic: {
          name: 'Basic Domain Setup',
          price: 75.00,
          features: ['Domain registration', 'Basic DNS setup', 'Email forwarding']
        },
        pro: {
          name: 'Pro SEO Domain Package',
          price: 150.00,
          features: ['Domain registration', 'SEO-optimized DNS', 'Email setup', 'SSL certificate', 'CDN setup']
        },
        enterprise: {
          name: 'Enterprise Domain Management',
          price: 250.00,
          features: ['Domain registration', 'Advanced DNS', 'Email hosting', 'SSL certificate', 'CDN + DDoS protection', 'Monthly reporting']
        }
      };

      const selectedPackage = packages[packageType];
      
      // Create zone in Cloudflare
      const zone = await this.registrar.createZone(domainName);
      
      // Setup SEO-optimized DNS
      const dns = await this.registrar.setupSEODNS(domainName);
      
      // Send setup confirmation email
      await this.email.sendDomainSetupEmail(clientId, {
        domain: domainName,
        package: selectedPackage,
        nameservers: dns.nameservers || ['pending'],
        zoneId: zone.result?.id
      });

      return {
        success: true,
        domain: domainName,
        package: selectedPackage,
        zoneId: zone.result?.id,
        setupComplete: true,
        nextSteps: [
          'Update nameservers at your registrar',
          'DNS propagation (24-48 hours)',
          'SSL certificate activation',
          'SEO optimization begins'
        ]
      };
    } catch (error) {
      return {
        success: false,
        domain: domainName,
        error: error.message
      };
    }
  }
}

// Revenue model: Instead of commissions, we charge service fees
export const DOMAIN_PRICING = {
  serviceFees: {
    setup: 50.00,        // One-time domain setup and optimization
    management: 15.00,   // Monthly management fee
    integration: 25.00,  // SEO platform integration
    transfer: 35.00,     // Domain transfer service
    consultation: 100.00 // Domain strategy consultation
  },
  packages: {
    basic: {
      name: 'Basic Domain Setup',
      price: 75.00,
      monthlyFee: 10.00,
      features: ['Domain setup', 'Basic DNS', 'Email forwarding']
    },
    pro: {
      name: 'Pro SEO Domain Package', 
      price: 150.00,
      monthlyFee: 25.00,
      features: ['SEO-optimized setup', 'Advanced DNS', 'Email hosting', 'SSL management']
    },
    enterprise: {
      name: 'Enterprise Domain Management',
      price: 250.00,
      monthlyFee: 50.00,
      features: ['Full management', 'Priority support', 'Advanced security', 'Monthly reporting']
    }
  }
};
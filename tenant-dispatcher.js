/**
 * Tenant Dispatcher for Workers for Platforms
 * 
 * This script routes requests to tenant-specific Workers based on:
 * - Subdomain (partner1.cozyartzmedia.com)
 * - Custom domain (partner-seo.com) 
 * - Default routing (cozyartzmedia.com)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();
    
    console.log(`🔀 Tenant Dispatcher: ${hostname}${url.pathname}`);
    
    try {
      // Extract tenant information
      const tenantInfo = await resolveTenant(hostname, env);
      
      if (!tenantInfo) {
        console.log(`❌ No tenant found for hostname: ${hostname}`);
        return new Response('Tenant not found', { status: 404 });
      }
      
      console.log(`✅ Resolved tenant: ${tenantInfo.id} (${tenantInfo.type})`);
      
      // Route to appropriate tenant Worker
      const tenantWorker = await env.TENANT_NAMESPACE.get(tenantInfo.scriptName);
      
      if (!tenantWorker) {
        console.log(`❌ Tenant Worker not found: ${tenantInfo.scriptName}`);
        return new Response('Tenant Worker not found', { status: 500 });
      }
      
      // Add tenant context to request headers
      const modifiedRequest = new Request(request, {
        headers: {
          ...request.headers,
          'X-Tenant-ID': tenantInfo.id,
          'X-Tenant-Type': tenantInfo.type,
          'X-Tenant-Domain': tenantInfo.domain,
          'X-Tenant-Config': JSON.stringify(tenantInfo.config),
        },
      });
      
      // Dispatch to tenant Worker
      return await tenantWorker.fetch(modifiedRequest);
      
    } catch (error) {
      console.error('❌ Tenant dispatch error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

/**
 * Resolve tenant based on hostname
 */
async function resolveTenant(hostname, env) {
  // Default tenant (Cozyartz Media Group)
  if (hostname === 'cozyartzmedia.com' || hostname === 'www.cozyartzmedia.com') {
    return {
      id: 'cmg-default',
      type: 'primary',
      domain: hostname,
      scriptName: 'cmgsite-primary-tenant',
      config: {
        whitelabel: await getWhitelabelConfig('default', env),
        authProvider: 'supabase-primary',
        database: 'primary',
        features: ['all']
      }
    };
  }
  
  // Subdomain routing (partner1.cozyartzmedia.com)
  const subdomainMatch = hostname.match(/^([^.]+)\.cozyartzmedia\.com$/);
  if (subdomainMatch) {
    const subdomain = subdomainMatch[1];
    
    // Skip www and common subdomains
    if (['www', 'api', 'admin', 'static'].includes(subdomain)) {
      return null;
    }
    
    // Look up partner configuration
    const partnerConfig = await getPartnerConfig(subdomain, env);
    if (!partnerConfig) {
      return null;
    }
    
    return {
      id: `partner-${subdomain}`,
      type: 'partner-subdomain',
      domain: hostname,
      scriptName: 'cmgsite-partner-tenant',
      config: {
        whitelabel: partnerConfig.whitelabel,
        authProvider: 'supabase-tenant',
        database: 'tenant-isolated',
        features: partnerConfig.features,
        partnerId: partnerConfig.id
      }
    };
  }
  
  // Custom domain routing
  const customDomainConfig = await getCustomDomainConfig(hostname, env);
  if (customDomainConfig) {
    return {
      id: `custom-${customDomainConfig.tenantId}`,
      type: 'custom-domain',
      domain: hostname,
      scriptName: 'cmgsite-custom-tenant',
      config: {
        whitelabel: customDomainConfig.whitelabel,
        authProvider: 'supabase-tenant',
        database: 'tenant-isolated',
        features: customDomainConfig.features,
        customDomain: true
      }
    };
  }
  
  return null;
}

/**
 * Get whitelabel configuration for tenant
 */
async function getWhitelabelConfig(tenantType, env) {
  // This would normally query your database
  // For now, return appropriate config based on tenant type
  
  const configs = {
    default: {
      brandName: "COZYARTZ",
      companyName: "Cozyartz Media Group",
      primaryColor: "#14b8a6",
      features: {
        whitelabel: true,
        multiTenant: true,
        clientPortal: true
      }
    },
    partner: {
      brandName: "PARTNER SEO",
      companyName: "Partner SEO Solutions",
      primaryColor: "#3b82f6",
      features: {
        whitelabel: false,
        multiTenant: true,
        clientPortal: true
      }
    }
  };
  
  return configs[tenantType] || configs.default;
}

/**
 * Get partner configuration by subdomain
 */
async function getPartnerConfig(subdomain, env) {
  // This would query your database for partner configurations
  // Mock implementation:
  
  const partners = {
    'partner1': {
      id: 'partner-001',
      name: 'Partner SEO Solutions',
      whitelabel: {
        brandName: 'PARTNER SEO',
        companyName: 'Partner SEO Solutions',
        primaryColor: '#3b82f6'
      },
      features: ['seo', 'analytics', 'client-portal'],
      status: 'active'
    }
  };
  
  return partners[subdomain] || null;
}

/**
 * Get custom domain configuration
 */
async function getCustomDomainConfig(hostname, env) {
  // This would query your database for custom domain mappings
  // Mock implementation:
  
  const customDomains = {
    'partner-seo.com': {
      tenantId: 'partner-001',
      whitelabel: {
        brandName: 'PARTNER SEO',
        companyName: 'Partner SEO Solutions',
        primaryColor: '#3b82f6'
      },
      features: ['seo', 'analytics', 'client-portal'],
      status: 'active'
    }
  };
  
  return customDomains[hostname] || null;
}
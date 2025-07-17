# AI Rate Limits & Enterprise White-Label System

## Overview
Our platform uses tiered AI rate limiting to ensure fair usage and platform stability while providing appropriate access levels for different business needs.

## AI Rate Limits by Tier

### 🎯 **Starter Tier - $1,000/month**
- **AI Calls**: 100 per month
- **Domains**: 1 domain limit
- **Features**: Basic SEO tools, monthly reporting, email support
- **White-label**: ❌ Not available
- **Target**: Small businesses, testing, individual consultants

### 📈 **Starter Plus - $1,250/month**
- **AI Calls**: 150 per month
- **Domains**: 2 domains
- **Features**: Enhanced SEO tools, bi-weekly reporting
- **White-label**: ❌ Not available
- **Target**: Growing small businesses

### 🚀 **Growth Tier - $1,500/month**
- **AI Calls**: 250 per month
- **Domains**: 5 domains
- **Features**: Advanced SEO suite, competitor analysis, priority support
- **White-label**: ❌ Not available
- **Target**: Established businesses, small agencies

### 💼 **Growth Plus - $2,000/month**
- **AI Calls**: 400 per month
- **Domains**: 10 domains
- **Features**: Advanced keyword tracking, enhanced analytics
- **White-label**: ❌ Not available
- **Target**: Growing agencies, multi-location businesses

### 🏢 **Enterprise - $2,500/month**
- **AI Calls**: 500 per month
- **Domains**: 25 domains
- **Features**: Full SEO suite, dedicated account manager, weekly reporting
- **White-label**: ✅ **Basic white-label options available**
- **Target**: Large agencies, enterprise clients

### 🌟 **Enterprise Plus - $3,500/month**
- **AI Calls**: 1,000 per month
- **Domains**: 50 domains
- **Features**: Custom integrations, daily reporting, SLA guarantee
- **White-label**: ✅ **Full white-label platform access**
- **Target**: Large agencies, reseller partners, enterprise solutions

## Overage Pricing
- **Rate**: $0.50 per additional AI call
- **Billing**: Monthly, added to next invoice
- **Notifications**: Alerts at 80%, 90%, and 100% usage
- **Auto-cutoff**: Optional setting to prevent overages

## White-Label Access Tiers

### 🚫 **No White-Label Access (Starter through Growth Plus)**
- Standard Cozyartz branding
- Standard support channels
- No reseller capabilities
- Client-only usage

### 🎨 **Basic White-Label (Enterprise - $2,500/month)**
- Custom color scheme
- Logo replacement
- Basic co-branding
- Limited reseller tools
- Standard API access

### 🔧 **Full White-Label (Enterprise Plus - $3,500/month)**
- Complete branding customization
- Custom domain support
- Multi-tenant architecture
- Advanced reseller portal
- Priority API access
- Custom integrations
- Dedicated support team

## Technical Implementation

### Rate Limiting Mechanism
```javascript
// AI call tracking per client
const client = await env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first();

if (client.ai_calls_used >= client.ai_calls_limit) {
  return new Response(JSON.stringify({ 
    error: 'AI usage limit exceeded',
    current: client.ai_calls_used,
    limit: client.ai_calls_limit,
    overageRate: 50 // $0.50 per call
  }), { status: 429 });
}

// Increment usage counter
await env.DB.prepare('UPDATE clients SET ai_calls_used = ai_calls_used + 1 WHERE id = ?')
  .bind(clientId).run();
```

### White-Label Detection
```javascript
// Check if client has white-label access
const hasWhitelabel = client.subscription_tier === 'enterprise' || 
                     client.subscription_tier === 'enterprisePlus';

if (requestedFeature === 'whitelabel' && !hasWhitelabel) {
  return { error: 'White-label access requires Enterprise tier or higher' };
}
```

## Amy Tipton's Testing Configuration

### ✅ **Current Setup (Fixed)**
- **Tier**: Starter (first paid tier)
- **AI Calls**: 100 per month (standard limit)
- **Domains**: 1 domain (standard limit)
- **Duration**: 6 months free
- **White-label**: ❌ **NO ACCESS** (correct)
- **Value**: $6,000 free access

### 🔧 **Testing Features Available**
- ✅ AI Assistant support
- ✅ PayPal payment testing
- ✅ Security audit participation
- ✅ Basic platform functionality
- ✅ Standard support channel

### 🚫 **Enterprise Features NOT Available**
- ❌ White-label customization
- ❌ Beta feature access
- ❌ Direct development team line
- ❌ Unlimited AI calls
- ❌ Multiple domains
- ❌ Advanced integrations

## Why This Structure?

### 🎯 **Business Logic**
1. **Starter Tier Testing**: Gives Amy real user experience without enterprise privileges
2. **No White-label**: Protects our enterprise tier value and prevents unauthorized reselling
3. **Rate Limits**: Ensures platform stability and fair resource allocation
4. **Upgrade Path**: Clear progression for clients who need more resources

### 💡 **Technical Benefits**
1. **Resource Management**: Prevents any single user from overwhelming the AI system
2. **Cost Control**: Tracks actual AI usage and associated costs
3. **Scalability**: System can handle growth without performance degradation
4. **Security**: Limits potential abuse or misuse of AI resources

### 📊 **Monitoring & Analytics**
- Real-time usage tracking
- Predictive usage alerts
- Cost analysis per client
- Performance impact monitoring
- Overage revenue tracking

## Upgrade Scenarios

### 📈 **If Amy Needs More During Testing**
- Can temporarily increase AI call limit
- Cannot enable white-label access
- Can add testing-specific features
- Must maintain tier restrictions

### 🎓 **Post-Testing Options**
- Upgrade to any paid tier
- Enterprise access requires $2,500/month minimum
- White-label requires Enterprise tier commitment
- Can negotiate custom enterprise packages

This structure ensures Amy gets meaningful testing access while protecting our enterprise tier value and maintaining system stability.
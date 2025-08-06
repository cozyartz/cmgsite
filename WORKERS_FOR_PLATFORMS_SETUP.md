# Workers for Platforms Multi-Tenant SaaS Setup

This document describes the migration from a single-tenant application to a multi-tenant SaaS platform using **Cloudflare Workers for Platforms**.

## Architecture Overview

### Before: Single Worker
- One Cloudflare Worker handling all requests
- Single Supabase project with basic authentication
- Limited tenant separation

### After: Workers for Platforms
- **Tenant Dispatcher**: Routes requests to tenant-specific Workers
- **Primary Tenant Worker**: Cozyartz Media Group (main business)
- **Partner Tenant Workers**: White-label partners with subdomains
- **Custom Domain Workers**: Partners with their own domains
- **Multi-tenant Database**: Row Level Security (RLS) for data isolation

## Key Benefits

1. **True Tenant Isolation**: Each tenant runs in isolated Workers
2. **Scalable Architecture**: Automatic scaling per tenant
3. **Security**: Zero data leakage between tenants
4. **White-labeling**: Complete branding customization
5. **Cost Efficiency**: Pay only for what each tenant uses
6. **Global Performance**: Edge-first architecture

## Deployment Architecture

```
Internet Request
       ↓
Tenant Dispatcher Worker
   (cmgsite-tenant-dispatcher)
       ↓
   Route Decision
       ↓
┌─────────────────────────────────────┐
│  Primary Tenant (cozyartzmedia.com) │
│  ├─ cmgsite-primary-tenant         │
│  └─ Full feature set + admin       │
├─────────────────────────────────────┤
│  Partner Subdomains                 │
│  ├─ partner1.cozyartzmedia.com     │
│  ├─ cmgsite-partner-tenant         │
│  └─ White-label features           │
├─────────────────────────────────────┤
│  Custom Domains                     │
│  ├─ partner-seo.com                │
│  ├─ cmgsite-custom-tenant          │
│  └─ Full white-label               │
└─────────────────────────────────────┘
```

## Database Design

### Multi-Tenant Tables

1. **`tenants`** - Master tenant registry
   ```sql
   - tenant_id (unique identifier)
   - name (display name)
   - domain (primary domain)
   - type (primary|partner-subdomain|custom-domain)
   - whitelabel_config (JSON)
   - subscription_tier
   - status (active|suspended|inactive)
   ```

2. **`profiles`** - User profiles with tenant association
   ```sql
   - id (user ID)
   - tenant_id (FK to tenants)
   - tenant_role (client|admin|super_admin)
   - tenant_permissions (JSON)
   ```

3. **`tenant_usage`** - Resource usage tracking
   ```sql
   - tenant_id
   - usage_type (ai_calls|domains|storage)
   - usage_count / usage_limit
   ```

4. **`tenant_domains`** - Domain management
   ```sql
   - tenant_id
   - domain
   - domain_type (primary|custom|subdomain)
   - ssl_status / dns_configured
   ```

### Row Level Security (RLS)

All tenant data is protected by PostgreSQL RLS policies:

```sql
-- Users can only access their own tenant's data
CREATE POLICY "tenant_isolation" ON profiles
    FOR ALL USING (
        tenant_id = get_current_tenant_id()
        OR 
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'super_admin'
        )
    );
```

## Authentication Setup

### Multi-Tenant Auth Flow

1. **Request arrives** → Tenant Dispatcher identifies tenant
2. **Tenant context** → Added to request headers
3. **Auth provider** → Tenant-specific Supabase client
4. **Session validation** → Verified against tenant
5. **Data access** → RLS enforces tenant isolation

### OAuth Configuration

Each tenant needs separate OAuth app configurations:

#### GitHub OAuth
- **Primary**: `https://cozyartzmedia.com/auth/callback`
- **Partner**: `https://partner1.cozyartzmedia.com/auth/callback`
- **Custom**: `https://partner-seo.com/auth/callback`

#### Google OAuth
- Same redirect URL pattern as GitHub
- Separate OAuth app per domain for security

## Cloudflare Configuration

### 1. Workers Deployment

```bash
# Deploy tenant dispatcher
wrangler deploy tenant-dispatcher.js --name cmgsite-tenant-dispatcher

# Create dispatch namespace
wrangler dispatch-namespace create cmgsite-tenants

# Deploy tenant workers
wrangler deploy worker.js --name cmgsite-primary-tenant
wrangler deploy worker.js --name cmgsite-partner-tenant
wrangler deploy worker.js --name cmgsite-custom-tenant
```

### 2. DNS Configuration

```
# Primary domain
cozyartzmedia.com → cmgsite-tenant-dispatcher.workers.dev

# Wildcard for subdomains
*.cozyartzmedia.com → cmgsite-tenant-dispatcher.workers.dev

# Custom domains (per partner)
partner-seo.com → cmgsite-tenant-dispatcher.workers.dev
```

### 3. Secret Management

Use Cloudflare's secure secret store for all sensitive data:

```bash
# Primary tenant secrets
wrangler secret put VITE_SUPABASE_URL --name cmgsite-primary-tenant
wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name cmgsite-primary-tenant
wrangler secret put GITHUB_CLIENT_ID --name cmgsite-primary-tenant
wrangler secret put GITHUB_CLIENT_SECRET --name cmgsite-primary-tenant
wrangler secret put GOOGLE_CLIENT_ID --name cmgsite-primary-tenant
wrangler secret put GOOGLE_CLIENT_SECRET --name cmgsite-primary-tenant
wrangler secret put JWT_SECRET --name cmgsite-primary-tenant

# Partner tenant secrets (separate OAuth apps)
wrangler secret put GITHUB_CLIENT_ID --name cmgsite-partner-tenant
wrangler secret put GITHUB_CLIENT_SECRET --name cmgsite-partner-tenant
# ... etc
```

## Development Workflow

### 1. Local Development

```bash
# Start tenant dispatcher locally
wrangler dev tenant-dispatcher.js --port 8787

# Start specific tenant worker
wrangler dev worker.js --name cmgsite-primary-tenant --port 8788

# Frontend development
npm run dev
```

### 2. Testing Multi-Tenancy

```bash
# Test primary tenant
curl -H "Host: cozyartzmedia.com" http://localhost:8787/api/health

# Test partner subdomain  
curl -H "Host: partner1.cozyartzmedia.com" http://localhost:8787/api/health

# Test custom domain
curl -H "Host: partner-seo.com" http://localhost:8787/api/health
```

### 3. Database Migrations

```bash
# Apply multi-tenant migrations
supabase db push

# Or manually in Supabase dashboard:
# Run SQL in supabase/migrations/001_multi_tenant_setup.sql
```

## Security Considerations

### 1. Tenant Isolation
- **Database**: RLS policies prevent cross-tenant data access
- **Authentication**: Tenant context validated on every request
- **File Storage**: Tenant-prefixed paths in Cloudflare R2
- **Caching**: Tenant-aware cache keys

### 2. Secrets Management
- ✅ All secrets stored in Cloudflare secret store
- ✅ No secrets in environment files or code
- ✅ Tenant-specific secrets for OAuth apps
- ✅ Automatic secret rotation support

### 3. Data Protection
- **Encryption**: AES-256-GCM for sensitive data
- **Audit Logging**: All tenant actions logged
- **GDPR Compliance**: Per-tenant data export/deletion
- **Backup Isolation**: Tenant-aware backup procedures

## Monitoring and Analytics

### 1. Per-Tenant Metrics
- Request volume and response times
- Authentication success/failure rates  
- Feature usage (AI calls, domains managed)
- Error rates and types

### 2. Usage Tracking
```javascript
// Track AI usage per tenant
await incrementTenantUsage(tenantId, 'ai_calls', 1);

// Check usage limits
const usage = await getTenantUsage(tenantId, 'ai_calls');
if (usage.count >= usage.limit) {
  throw new Error('AI usage limit exceeded');
}
```

### 3. Business Intelligence
- Revenue per tenant
- Feature adoption rates
- Churn prediction
- Support ticket volume

## Cost Optimization

### 1. Resource Allocation
- **CPU**: Automatic scaling per tenant workload
- **Memory**: Isolated per Worker instance
- **Storage**: Pay per tenant data usage
- **Bandwidth**: Cloudflare's global CDN

### 2. Pricing Model
- **Starter**: $1,000/month - 100 AI calls, 1 domain
- **Growth**: $1,500/month - 250 AI calls, 5 domains
- **Enterprise**: $2,500/month - 500 AI calls, 25 domains
- **White-label markup**: 20% partner markup

## Support and Maintenance

### 1. Tenant Management
```bash
# Add new tenant
INSERT INTO tenants (tenant_id, name, domain, type) 
VALUES ('new-partner', 'New Partner Inc', 'new-partner.com', 'custom-domain');

# Configure tenant worker
wrangler deploy worker.js --name cmgsite-new-partner-tenant

# Set tenant secrets  
wrangler secret put GITHUB_CLIENT_ID --name cmgsite-new-partner-tenant
```

### 2. Health Monitoring
- Synthetic transaction monitoring per tenant
- Real-time alerting for tenant issues
- Automated failover to backup regions
- Performance optimization recommendations

### 3. Customer Support
- Tenant-aware support dashboard
- Direct access to tenant logs and metrics
- Escalation to engineering team
- SLA tracking and reporting

## Migration Checklist

- [x] ✅ Create tenant dispatcher worker
- [x] ✅ Set up dispatch namespace  
- [x] ✅ Design multi-tenant database schema
- [x] ✅ Implement RLS policies for data isolation
- [x] ✅ Create tenant-specific auth service
- [x] ✅ Configure OAuth for multiple domains
- [x] ✅ Set up Cloudflare secret management
- [x] ✅ Create deployment automation scripts
- [ ] 🔄 **Apply database migrations** (Next step)
- [ ] 🔄 **Configure OAuth apps** (Next step)
- [ ] 🔄 **Deploy to production** (Next step)
- [ ] 🔄 **Test tenant isolation** (Next step)
- [ ] 🔄 **Monitor performance** (Next step)

## Next Steps

1. **Apply Database Migrations**
   ```bash
   supabase db push
   # Or run SQL manually in Supabase dashboard
   ```

2. **Configure OAuth Applications**
   - Set up GitHub OAuth apps for each domain
   - Set up Google OAuth apps for each domain
   - Update redirect URIs in each app

3. **Deploy Workers for Platforms**
   ```bash
   chmod +x scripts/deploy-multi-tenant.sh
   ./scripts/deploy-multi-tenant.sh
   ```

4. **Configure DNS**
   - Point domains to tenant dispatcher
   - Set up SSL certificates
   - Verify routing works correctly

5. **Test Multi-Tenant Auth**
   ```bash
   node scripts/configure-supabase-auth.js
   ```

6. **Monitor and Optimize**
   - Set up tenant monitoring dashboards
   - Configure alerting for tenant issues
   - Optimize performance per tenant

## Conclusion

This multi-tenant architecture positions your SaaS for massive scalability while maintaining security, performance, and cost efficiency. The Workers for Platforms approach provides true tenant isolation and the flexibility to customize each tenant's experience completely.

The architecture supports:
- ✅ **Unlimited tenants** with automatic scaling
- ✅ **Complete white-labeling** for partners  
- ✅ **Enterprise-grade security** with RLS
- ✅ **Global performance** via Cloudflare Edge
- ✅ **Cost-effective scaling** with usage-based pricing
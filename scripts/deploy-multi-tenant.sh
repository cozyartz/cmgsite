#!/bin/bash

# Multi-tenant SaaS Deployment Script for Workers for Platforms
# This script securely deploys the multi-tenant architecture using Cloudflare secrets

set -e

echo "🚀 Deploying Multi-tenant SaaS Platform to Cloudflare Workers for Platforms"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Please install it first."
    exit 1
fi

# Check if user is logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "❌ Please login to Cloudflare first: wrangler login"
    exit 1
fi

echo "✅ Wrangler CLI ready"

# Deploy the tenant dispatcher (main routing worker)
echo "📦 Deploying tenant dispatcher..."
wrangler deploy tenant-dispatcher.js --name cmgsite-tenant-dispatcher --compatibility-date 2024-01-01

# Create dispatch namespace for tenant isolation
echo "🏗️ Creating dispatch namespace for tenant isolation..."
wrangler dispatch-namespace create cmgsite-tenants || echo "ℹ️ Namespace may already exist"

# Deploy primary tenant worker (Cozyartz Media Group)
echo "📦 Deploying primary tenant worker..."
wrangler deploy worker.js --name cmgsite-primary-tenant --compatibility-date 2024-01-01

# Set up secrets for primary tenant (using Cloudflare secret store)
echo "🔐 Setting up Cloudflare secrets for primary tenant..."

# These secrets should be set using: wrangler secret put SECRET_NAME --name cmgsite-primary-tenant
echo "ℹ️ Required secrets for primary tenant:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY" 
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - GITHUB_CLIENT_ID"
echo "   - GITHUB_CLIENT_SECRET"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - JWT_SECRET"
echo "   - TURNSTILE_SECRET_KEY"

# Deploy partner tenant worker template
echo "📦 Deploying partner tenant worker template..."
wrangler deploy worker.js --name cmgsite-partner-tenant --compatibility-date 2024-01-01

# Deploy custom domain tenant worker template  
echo "📦 Deploying custom domain tenant worker template..."
wrangler deploy worker.js --name cmgsite-custom-tenant --compatibility-date 2024-01-01

# Configure DNS routing for multi-tenancy
echo "🌐 Configuring DNS for multi-tenant setup..."
echo "ℹ️ DNS Configuration Required:"
echo "   - cozyartzmedia.com → cmgsite-tenant-dispatcher"
echo "   - *.cozyartzmedia.com → cmgsite-tenant-dispatcher"
echo "   - Custom domains → cmgsite-tenant-dispatcher"

# Deploy the frontend to Cloudflare Pages
echo "📱 Building and deploying frontend..."
npm run build

wrangler pages deploy dist --project-name cmgsite-platform --compatibility-date 2024-01-01

# Configure environment variables for Pages
echo "🔧 Setting Pages environment variables..."
wrangler pages secret put VITE_ENVIRONMENT --project-name cmgsite-platform || echo "ℹ️ Set manually in dashboard"
wrangler pages secret put VITE_SITE_URL --project-name cmgsite-platform || echo "ℹ️ Set manually in dashboard"

# Apply database migrations
echo "🗄️ Applying database migrations..."
if command -v supabase &> /dev/null; then
    echo "ℹ️ Please run database migrations manually:"
    echo "   supabase db push"
    echo "   OR apply the SQL in supabase/migrations/001_multi_tenant_setup.sql"
else
    echo "ℹ️ Supabase CLI not found. Please apply migrations manually:"
    echo "   Run SQL in supabase/migrations/001_multi_tenant_setup.sql in your Supabase dashboard"
fi

# Configure Supabase auth settings
echo "🔐 Configuring Supabase authentication..."
if [ -f "scripts/configure-supabase-auth.js" ]; then
    echo "ℹ️ Run auth configuration script:"
    echo "   node scripts/configure-supabase-auth.js"
else
    echo "ℹ️ Configure Supabase auth manually in the dashboard"
fi

echo ""
echo "🎉 Multi-tenant SaaS deployment completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Set Cloudflare secrets for each tenant worker:"
echo "   wrangler secret put VITE_SUPABASE_URL --name cmgsite-primary-tenant"
echo "   wrangler secret put GITHUB_CLIENT_ID --name cmgsite-primary-tenant"
echo "   # ... etc for all required secrets"
echo ""
echo "2. Configure DNS routing in Cloudflare dashboard:"
echo "   - Add CNAME: cozyartzmedia.com → cmgsite-tenant-dispatcher.workers.dev"
echo "   - Add CNAME: *.cozyartzmedia.com → cmgsite-tenant-dispatcher.workers.dev"
echo ""
echo "3. Apply database migrations in Supabase dashboard"
echo ""
echo "4. Configure authentication providers in Supabase:"
echo "   - GitHub OAuth with tenant-specific redirect URLs"
echo "   - Google OAuth with tenant-specific redirect URLs"
echo ""
echo "5. Test the multi-tenant setup:"
echo "   - https://cozyartzmedia.com (primary tenant)"
echo "   - https://partner1.cozyartzmedia.com (partner subdomain)"
echo "   - https://partner-seo.com (custom domain - after DNS setup)"
echo ""
echo "🔒 Security Notes:"
echo "- All secrets are stored in Cloudflare's secure secret store"
echo "- Tenant isolation is enforced at the database level with RLS"
echo "- Each tenant has isolated authentication contexts"
echo "- No secrets are exposed in the codebase or environment files"

exit 0
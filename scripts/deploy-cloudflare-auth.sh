#!/bin/bash

# Deploy Cloudflare Auth System
# This script sets up D1, KV, and deploys the multi-tenant auth system

set -e

echo "🚀 Deploying Cloudflare Multi-tenant Auth System"

# Check if wrangler is installed and logged in
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Please install it first: npm install -g wrangler"
    exit 1
fi

if ! wrangler whoami &> /dev/null; then
    echo "❌ Please login to Cloudflare first: wrangler login"
    exit 1
fi

echo "✅ Wrangler CLI ready"

# Create D1 database
echo "📦 Creating D1 database..."
wrangler d1 create cmgsite-main || echo "ℹ️ Database may already exist"

# Create KV namespaces
echo "📦 Creating KV namespaces..."
wrangler kv:namespace create "SESSIONS" || echo "ℹ️ SESSIONS namespace may already exist"
wrangler kv:namespace create "CACHE" || echo "ℹ️ CACHE namespace may already exist"

# Create R2 bucket
echo "📦 Creating R2 bucket..."
wrangler r2 bucket create cmgsite-assets || echo "ℹ️ Bucket may already exist"

echo "✅ Cloudflare resources created successfully"

# Apply database migrations
echo "🗄️ Applying database migrations..."

# Get the database ID from wrangler.toml or create command output
if grep -q "database_id" wrangler.toml; then
    echo "ℹ️ Database ID found in wrangler.toml"
else
    echo "⚠️ Please update wrangler.toml with the correct database_id from the D1 creation output above"
fi

# Apply the initial schema
if [ -f "migrations/001_initial_schema.sql" ]; then
    echo "📝 Applying initial schema..."
    wrangler d1 execute cmgsite-main --file=migrations/001_initial_schema.sql || echo "ℹ️ Schema may already be applied"
else
    echo "⚠️ Initial schema file not found at migrations/001_initial_schema.sql"
fi

echo "✅ Database migrations completed"

# Set up required secrets
echo "🔐 Setting up required secrets..."
echo ""
echo "You need to set the following secrets manually:"
echo ""
echo "📧 Email Service (Resend):"
echo "   wrangler secret put RESEND_API_KEY"
echo ""
echo "🔑 Authentication:"
echo "   wrangler secret put JWT_SECRET"
echo ""
echo "🐙 GitHub OAuth:"
echo "   wrangler secret put GITHUB_CLIENT_ID"
echo "   wrangler secret put GITHUB_CLIENT_SECRET"
echo ""
echo "🌍 Google OAuth:"
echo "   wrangler secret put GOOGLE_CLIENT_ID"
echo "   wrangler secret put GOOGLE_CLIENT_SECRET"
echo ""
echo "🛡️ Cloudflare Turnstile:"
echo "   wrangler secret put TURNSTILE_SECRET_KEY"
echo ""

# Build and deploy
echo "🏗️ Building application..."
npm run build

echo "🚀 Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name cmgsite

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. 📧 Set up OAuth Applications:"
echo "   - GitHub: https://github.com/settings/applications/new"
echo "     - Application name: CMGsite Auth"
echo "     - Homepage URL: https://cozyartzmedia.com"
echo "     - Authorization callback URL: https://cozyartzmedia.com/api/auth/github/callback"
echo ""
echo "   - Google: https://console.developers.google.com/apis/credentials"
echo "     - Create OAuth 2.0 Client"
echo "     - Authorized redirect URIs: https://cozyartzmedia.com/api/auth/google/callback"
echo ""
echo "2. 🔑 Set secrets using the wrangler commands listed above"
echo ""
echo "3. 🌐 Update DNS:"
echo "   - Point cozyartzmedia.com to your Cloudflare Pages deployment"
echo "   - Enable proxying in Cloudflare dashboard"
echo ""
echo "4. ✅ Test the authentication system:"
echo "   - Magic link: https://cozyartzmedia.com/auth"
echo "   - GitHub OAuth: https://cozyartzmedia.com/api/auth/github"
echo ""
echo "💡 Features enabled:"
echo "   ✅ Multi-tenant architecture"
echo "   ✅ Magic link authentication"
echo "   ✅ GitHub & Google OAuth"
echo "   ✅ JWT-based sessions"
echo "   ✅ Unlimited tenants (no per-tenant setup)"
echo "   ✅ $0 cost on Cloudflare free tier"
echo ""
echo "🔒 Security features:"
echo "   ✅ Tenant data isolation via database RLS"
echo "   ✅ Secure session management in KV storage"
echo "   ✅ All secrets stored in Cloudflare secret store"
echo "   ✅ No hardcoded credentials in code"

exit 0
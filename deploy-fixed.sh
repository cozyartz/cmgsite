#!/bin/bash

echo "🚀 Comprehensive CMG Site Deployment"
echo "======================================"

# Set error handling
set -e

# Change to project directory
cd /Users/cozart-lundin/code/cmgsite

# 1. Clean everything
echo "🧹 Cleaning previous builds..."
rm -rf dist
rm -rf node_modules/.vite
npm cache clean --force

# 2. Install fresh dependencies
echo "📦 Installing dependencies..."
npm ci

# 3. Check environment variables
echo "🔧 Checking environment setup..."
if [ ! -f ".env.production" ]; then
    echo "❌ Missing .env.production file"
    exit 1
fi

# 4. Build with production settings
echo "🏗️ Building for production..."
export VITE_ENVIRONMENT=production
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
export VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
export VITE_SITE_URL=https://cozyartzmedia.com
export VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback

npm run build

# 5. Copy routing files
echo "📋 Setting up routing..."
cp public/_routes.json dist/
cp public/_redirects dist/

# 6. Deploy to Cloudflare Pages
echo "☁️ Deploying to Cloudflare..."
npx wrangler pages deploy dist --project-name=cmgsite --compatibility-date=2024-07-15

echo ""
echo "✅ Deployment completed!"
echo "🌐 Site: https://cozyartzmedia.com"
echo "🔗 Auth: https://cozyartzmedia.com/auth"
echo ""
echo "🧪 Running tests in 30 seconds..."
sleep 30

# 7. Test deployment
echo "Testing deployment..."
curl -I https://cozyartzmedia.com/auth
curl -I https://cozyartzmedia.com/client-portal

echo ""
echo "🎉 All done! Test your site now:"
echo "   1. Visit https://cozyartzmedia.com"
echo "   2. Click 'Client Portal'"
echo "   3. Try signing in"

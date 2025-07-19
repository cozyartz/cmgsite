#!/bin/bash

# Fix and Deploy Script for CMG Site Routing Issues
echo "🔧 Starting CMG Site routing fixes and deployment..."

# Set script to exit on error
set -e

# Navigate to project directory
cd /Users/cozart-lundin/code/cmgsite

# 1. Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist node_modules/.vite

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Run linting and fix issues
echo "🔍 Running linter..."
npm run lint:fix || echo "⚠️ Linting issues found but continuing..."

# 4. Build the project with production settings
echo "🏗️ Building production bundle..."
VITE_ENVIRONMENT=production \
VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD \
VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co \
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8 \
VITE_SITE_URL=https://cozyartzmedia.com \
VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback \
npm run build:pages

# 5. Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name=cmgsite

echo "✅ Deployment complete!"
echo "🌐 Your site should be live at: https://cozyartzmedia.com"
echo "🔗 Test the client portal at: https://cozyartzmedia.com/auth"

# 6. Test the deployment
echo "🧪 Testing deployment..."
sleep 10
curl -I https://cozyartzmedia.com/auth || echo "⚠️ Site might still be propagating..."

echo "🎉 Script completed! Check the site and test the client portal link."

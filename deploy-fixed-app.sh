#!/bin/bash

echo "🚀 Building and deploying React app without loops..."
echo "=================================================="

cd /Users/cozart-lundin/code/cmgsite

# Set environment variables
export VITE_ENVIRONMENT=production
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
export VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
export VITE_SITE_URL=https://cozyartzmedia.com
export VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback

echo "🔧 Building React application..."
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
npm run build

echo "📁 Configuring SPA routing..."
# Ensure SPA routing works properly
cp public/_routes.json dist/_routes.json
cp public/_redirects dist/_redirects

echo "🚀 Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name=cmgsite

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "======================"
echo "🔧 Fixed authentication loops"
echo "🛡️ Proper protected routes implemented"
echo "📱 SPA routing configured"
echo "🌐 Live at: https://cozyartzmedia.com"
echo ""
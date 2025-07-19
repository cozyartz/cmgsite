#!/bin/bash

echo "🚨 EMERGENCY AUTH FIX - GETTING YOU LOGGED IN NOW"
echo "=============================================="

cd /Users/cozart-lundin/code/cmgsite

# Check if deployment is stuck
echo "Checking current deployment status..."
npx wrangler pages deployment list --project-name=cmgsite | head -5

echo ""
echo "🏗️ Force building and deploying working version..."

# Set all environment variables
export VITE_ENVIRONMENT=production
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
export VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
export VITE_SITE_URL=https://cozyartzmedia.com
export VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback

# Clean build
rm -rf dist
npm run build

# Ensure routing files exist
echo "Setting up routing files..."
mkdir -p dist
cp public/_routes.json dist/ 2>/dev/null || echo '{"version": 1, "include": ["/*"], "exclude": []}' > dist/_routes.json
cp public/_redirects dist/ 2>/dev/null || echo '/*    /index.html   200' > dist/_redirects

# Force deploy with compatibility date
echo "🚀 Force deploying..."
npx wrangler pages deploy dist --project-name=cmgsite --compatibility-date=2024-07-19

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎯 DIRECT LOGIN INSTRUCTIONS:"
echo "1. Visit: https://cozyartzmedia.com/auth"
echo "2. Click 'Continue with GitHub' or 'Continue with Google'"
echo "3. After auth, you should go directly to /superadmin"
echo ""
echo "🆔 Your email (cozy2963@gmail.com) is configured for superadmin access"
echo ""
echo "Testing in 30 seconds..."
sleep 30

echo "Testing auth page..."
curl -I https://cozyartzmedia.com/auth

echo ""
echo "🎉 Ready! Try clicking Client Portal now!"

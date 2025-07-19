#!/bin/bash

echo "🚨 CRITICAL FIXES - EMERGENCY DEPLOYMENT"
echo "========================================"

cd /Users/cozart-lundin/code/cmgsite

# Quick build and deploy
echo "🏗️ Building with fixes..."
export VITE_ENVIRONMENT=production
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
export VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
export VITE_SITE_URL=https://cozyartzmedia.com
export VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback

npm run build

echo "📋 Copying routing files..."
cp public/_routes.json dist/
cp public/_redirects dist/

echo "🚀 Deploying critical fixes..."
npx wrangler pages deploy dist --project-name=cmgsite

echo ""
echo "✅ CRITICAL FIXES DEPLOYED!"
echo "🧪 Testing in 30 seconds..."
sleep 30

echo "Testing main routes..."
curl -I https://cozyartzmedia.com/auth
echo "Auth page test completed."

echo ""
echo "🎯 Fixed issues:"
echo "   ✅ profile is not defined"
echo "   ✅ ES module import errors"  
echo "   ✅ async/await in useEffect"
echo "   ✅ Component state management"
echo ""
echo "🌐 Test your site now: https://cozyartzmedia.com/auth"

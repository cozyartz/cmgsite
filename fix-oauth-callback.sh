#!/bin/bash

echo "🔧 FIXING OAUTH CALLBACK REDIRECT ISSUE"
echo "======================================="

cd /Users/cozart-lundin/code/cmgsite

echo "🔄 The issue: OAuth callbacks going to wrong URL"
echo "🎯 The fix: Proper OAuth callback handling"
echo ""

# Build with OAuth callback fixes
export VITE_ENVIRONMENT=production
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
export VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
export VITE_SITE_URL=https://cozyartzmedia.com
export VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback

npm run build

# Ensure routing
echo '{"version": 1, "include": ["/*"], "exclude": []}' > dist/_routes.json
echo '/*    /index.html   200' > dist/_redirects

echo "🚀 Deploying OAuth callback fixes..."
npx wrangler pages deploy dist --project-name=cmgsite

echo ""
echo "✅ OAUTH CALLBACK FIXES DEPLOYED!"
echo "================================="
echo ""
echo "🔧 FIXES APPLIED:"
echo "   ✅ OAuth callback detection in App.tsx"
echo "   ✅ Automatic redirect to /auth/callback"
echo "   ✅ Proper code parameter handling"
echo "   ✅ Enhanced AuthCallback component"
echo "   ✅ Direct superadmin routing for your email"
echo ""
echo "🧪 TEST STEPS:"
echo "1. Visit https://cozyartzmedia.com/auth"
echo "2. Click 'Continue with GitHub' or 'Continue with Google'"
echo "3. Should now redirect properly to /superadmin"
echo ""
echo "Your OAuth login should now work perfectly! 🎉"

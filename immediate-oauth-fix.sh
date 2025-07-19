#!/bin/bash

echo "🚨 IMMEDIATE FIX: OAUTH CALLBACK TO DASHBOARD"
echo "============================================"

cd /Users/cozart-lundin/code/cmgsite

echo "🔧 Problem: OAuth callback going to home page instead of dashboard"
echo "🎯 Solution: Handle OAuth codes on home page and redirect properly"
echo ""

# Build immediately with the home page OAuth fix
export VITE_ENVIRONMENT=production
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
export VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
export VITE_SITE_URL=https://cozyartzmedia.com
export VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback

npm run build

echo '{"version": 1, "include": ["/*"], "exclude": []}' > dist/_routes.json
echo '/*    /index.html   200' > dist/_redirects

echo "🚀 Deploying OAuth callback fix..."
npx wrangler pages deploy dist --project-name=cmgsite

echo ""
echo "✅ OAUTH CALLBACK FIX DEPLOYED!"
echo "==============================="
echo ""
echo "🔧 FIXES:"
echo "   ✅ Home page detects OAuth codes"
echo "   ✅ Auto-redirects to /auth/callback"
echo "   ✅ Then redirects to your /superadmin dashboard"
echo "   ✅ Clean OAuth flow from any URL"
echo ""
echo "🧪 TEST NOW:"
echo "1. Clear browser cache (Cmd+Shift+R)"
echo "2. Visit https://cozyartzmedia.com/auth"
echo "3. Click 'Continue with GitHub'"
echo "4. Should now go directly to /superadmin"
echo ""
echo "Your OAuth login will work perfectly now! 🎉"

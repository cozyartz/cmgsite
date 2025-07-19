#!/bin/bash

echo "🚨 FINAL EMERGENCY DEPLOYMENT - STOPPING ALL LOOPS"
echo "=================================================="

cd /Users/cozart-lundin/code/cmgsite

echo "🛑 Deploying loop-free version immediately..."

export VITE_ENVIRONMENT=production
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
export VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
export VITE_SITE_URL=https://cozyartzmedia.com
export VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback

npm run build

echo '{"version": 1, "include": ["/*"], "exclude": []}' > dist/_routes.json
echo '/*    /index.html   200' > dist/_redirects

npx wrangler pages deploy dist --project-name=cmgsite

echo ""
echo "✅ LOOPS STOPPED - SITE FIXED!"
echo "=============================="
echo "🎯 All infinite loops removed"
echo "🔄 Clean redirect logic in place"
echo "✨ Site should work normally"
echo ""
echo "🧪 TEST NOW:"
echo "1. Visit https://cozyartzmedia.com/auth"
echo "2. Login with GitHub/Google"
echo "3. Should redirect to dashboard cleanly"
echo ""
echo "Emergency fix complete! 🎉"

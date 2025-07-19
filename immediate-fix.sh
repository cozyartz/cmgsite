#!/bin/bash

echo "🚀 IMMEDIATE FIX DEPLOYMENT"
echo "=========================="

cd /Users/cozart-lundin/code/cmgsite

# Build with the simplified auth component
echo "🏗️ Building with simplified auth..."
export VITE_ENVIRONMENT=production
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
export VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
export VITE_SITE_URL=https://cozyartzmedia.com
export VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback

npm run build

# Copy routing files
cp public/_routes.json dist/
cp public/_redirects dist/

# Deploy
echo "☁️ Deploying simplified version..."
npx wrangler pages deploy dist --project-name=cmgsite

echo ""
echo "✅ SIMPLIFIED AUTH DEPLOYED!"
echo "🌐 Test: https://cozyartzmedia.com/auth"
echo ""
echo "Changes made:"
echo "   ✅ Simplified auth component without async imports"
echo "   ✅ Direct routing logic"
echo "   ✅ Removed complex validation"
echo "   ✅ Basic but functional auth flow"

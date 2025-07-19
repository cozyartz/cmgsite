#!/bin/bash

echo "🚨 MANUAL DEPLOYMENT TO GET YOU LOGGED IN"
echo "========================================"

cd /Users/cozart-lundin/code/cmgsite

# Check if we have node and npm
which npm || echo "NPM not found"
which node || echo "Node not found"

# Try to use the node that should be installed
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

echo "Building production version..."

# Simple build command
VITE_ENVIRONMENT=production \
VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD \
VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co \
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8 \
VITE_SITE_URL=https://cozyartzmedia.com \
VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback \
npm run build

# Ensure routing
echo '{"version": 1, "include": ["/*"], "exclude": []}' > dist/_routes.json
echo '/*    /index.html   200' > dist/_redirects

# Deploy using wrangler
echo "Deploying to Cloudflare Pages..."
/usr/local/bin/npx wrangler pages deploy dist --project-name=cmgsite || \
/opt/homebrew/bin/npx wrangler pages deploy dist --project-name=cmgsite || \
npx wrangler pages deploy dist --project-name=cmgsite

echo ""
echo "🎯 DEPLOYMENT COMPLETED!"
echo ""
echo "NOW TRY THIS:"
echo "1. Wait 60 seconds for propagation"
echo "2. Visit https://cozyartzmedia.com"
echo "3. Click 'Client Portal' in the header"
echo "4. You should see the login page"
echo "5. Click 'Continue with GitHub'"
echo "6. Login and you'll go to /superadmin"
echo ""
echo "Your email cozy2963@gmail.com has superadmin access configured"

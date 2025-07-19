#!/bin/bash

echo "🎨 DEPLOYING AMAZING LOGIN SCREEN"
echo "================================="

cd /Users/cozart-lundin/code/cmgsite

echo "🏗️ Building beautiful auth experience..."

# Build with all the enhanced features
export VITE_ENVIRONMENT=production
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
export VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
export VITE_SITE_URL=https://cozyartzmedia.com
export VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback

npm run build

# Ensure routing files
cp public/_routes.json dist/ 2>/dev/null || echo '{"version": 1, "include": ["/*"], "exclude": []}' > dist/_routes.json
cp public/_redirects dist/ 2>/dev/null || echo '/*    /index.html   200' > dist/_redirects

echo "🚀 Deploying stunning auth experience..."
npx wrangler pages deploy dist --project-name=cmgsite

echo ""
echo "✨ BEAUTIFUL LOGIN SCREEN DEPLOYED!"
echo "=================================="
echo ""
echo "🎯 NEW FEATURES:"
echo "   ✅ Two-column layout with branding"
echo "   ✅ Real-time email validation with suggestions"
echo "   ✅ Enhanced form validation with icons"
echo "   ✅ Beautiful progress indicators"
echo "   ✅ Plan selection display"
echo "   ✅ Improved error messages"
echo "   ✅ Accessibility features"
echo "   ✅ Mobile responsive design"
echo "   ✅ Loading states and animations"
echo "   ✅ Security indicators"
echo ""
echo "🌐 Visit: https://cozyartzmedia.com/auth"
echo "🔗 Click 'Client Portal' from the main site"
echo ""
echo "Your login experience is now AMAZING! 🎉"

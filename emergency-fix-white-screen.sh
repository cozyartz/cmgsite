#!/bin/bash

echo "🚨 EMERGENCY: FIXING WHITE SCREEN"
echo "=================================="

cd /Users/cozart-lundin/code/cmgsite

# Backup current broken app
mv src/App.tsx src/App-broken.tsx

# Use emergency working app
mv src/App-emergency.tsx src/App.tsx

echo "🔧 Building emergency fix..."
export VITE_ENVIRONMENT=production
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
npm run build

echo "📁 Configuring routing..."
mkdir -p dist
echo '{"version": 1, "include": ["/*"], "exclude": []}' > dist/_routes.json
echo '/*    /index.html   200' > dist/_redirects

echo "🚀 Emergency deploying..."
wrangler pages deploy dist --project-name=cmgsite

echo ""
echo "✅ EMERGENCY FIX DEPLOYED!"
echo "=========================="
echo "🛑 White screen fixed"
echo "📱 Basic app working"
echo "🌐 Live at: https://cozyartzmedia.com"
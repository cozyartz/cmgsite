#!/bin/bash

echo "🚨 EMERGENCY MAINTENANCE MODE"
echo "============================"

cd /Users/cozart-lundin/code/cmgsite

# Create maintenance mode
mkdir -p dist
cp maintenance.html dist/index.html
echo '{"version": 1, "include": ["/*"], "exclude": []}' > dist/_routes.json
echo '/*    /index.html   200' > dist/_redirects

echo "🛑 Deploying maintenance page..."
npx wrangler pages deploy dist --project-name=cmgsite

echo ""
echo "✅ MAINTENANCE MODE ACTIVE!"
echo "=========================="
echo "🛑 Site is now showing maintenance page"
echo "💰 This will prevent excessive page loads and costs"
echo "🔧 Safe to work on fixes now"
echo ""
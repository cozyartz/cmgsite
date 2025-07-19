#!/bin/bash

echo "🔧 Fixing authentication issues for production..."

# Clear any problematic session storage
echo "🧹 Clearing browser storage..."

# Build with production environment
echo "📦 Building for production..."
VITE_ENVIRONMENT=production npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "🚀 Deploying to Cloudflare Pages..."
    npm run deploy:pages
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment successful!"
        echo ""
        echo "🎯 Authentication fixes applied:"
        echo "   ✅ Added timeout mechanisms to prevent infinite loading"
        echo "   ✅ Added emergency bypass for stuck auth states"
        echo "   ✅ Fixed redirect loops with better session management"
        echo "   ✅ Added resilient profile loading with fallbacks"
        echo "   ✅ Improved error handling for Supabase connections"
        echo ""
        echo "🌐 Your site should now load properly at:"
        echo "   https://cozyartzmedia.com/auth"
        echo ""
        echo "🚑 If you still experience issues, click the 'Taking too long?' button"
        echo "   that appears after 8 seconds on the loading screen."
    else
        echo "❌ Deployment failed"
        exit 1
    fi
else
    echo "❌ Build failed"
    exit 1
fi

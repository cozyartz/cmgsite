#!/bin/bash

# Build and Deploy Script for CMGsite SPA
echo "🚀 Building and deploying CMGsite with SPA routing..."

# Clean previous build
rm -rf dist

# Build the React SPA
echo "📦 Building React application..."
npm run build

# Ensure routing files are in place
echo "🔧 Setting up SPA routing configuration..."

# Copy routing files to dist directory
cp public/_routes dist/_routes 2>/dev/null || echo "No _routes file found"
cp public/_redirects dist/_redirects 2>/dev/null || echo "No _redirects file found"
cp public/.htaccess dist/.htaccess 2>/dev/null || echo "No .htaccess file found"

# Verify build output
echo "📋 Build verification:"
ls -la dist/

echo "✅ Build completed!"
echo ""
echo "🌐 Deploy to Cloudflare Pages:"
echo "1. Manual: Upload the 'dist' folder to Cloudflare Pages"
echo "2. CLI: wrangler pages deploy dist"
echo ""
echo "🔍 Test routes after deployment:"
echo "• https://cozyartzmedia.com/auth"
echo "• https://cozyartzmedia.com/client-portal" 
echo "• https://cozyartzmedia.com/admin"
echo ""
echo "If routing still doesn't work, check Cloudflare Pages settings:"
echo "• Build output directory: dist"
echo "• Build command: npm run build"
echo "• Root directory: /"
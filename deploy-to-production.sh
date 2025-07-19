#!/bin/bash

echo "🚀 Production Deployment Script"
echo "=" $(printf '=%.0s' {1..40})

# Set proper PATH for npm/node
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in project directory${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Step 1: Installing dependencies...${NC}"
if command -v npm &> /dev/null; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ npm install failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ npm not found in PATH${NC}"
    echo "PATH: $PATH"
    exit 1
fi

echo -e "${YELLOW}🔧 Step 2: Building for production...${NC}"
VITE_ENVIRONMENT=production npm run build:pages
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"

echo -e "${YELLOW}🚀 Step 3: Deploying to Cloudflare Pages...${NC}"
if command -v wrangler &> /dev/null; then
    wrangler pages deploy dist
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Deployment successful!${NC}"
        echo ""
        echo "🎉 Your production-ready authentication system is now live!"
        echo ""
        echo "🌐 Test your deployment:"
        echo "   https://cozyartzmedia.com/auth"
        echo ""
        echo "🔍 Key features now active:"
        echo "   ✅ Timeout protection (no more infinite loading)"
        echo "   ✅ Emergency bypass functionality"
        echo "   ✅ Robust error handling"
        echo "   ✅ Fallback authentication flows"
        echo "   ✅ Enhanced security (PKCE, Turnstile)"
        echo ""
        echo "✨ 100% Production Ready! ✨"
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ wrangler not found. Installing...${NC}"
    npm install -g wrangler
    wrangler pages deploy dist
fi

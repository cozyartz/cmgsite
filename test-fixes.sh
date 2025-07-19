#!/bin/bash

echo "🧪 Testing CMG Site after fixes..."

# Test the main site
echo "1. Testing main site..."
MAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://cozyartzmedia.com)
echo "   Main site status: $MAIN_STATUS"

# Test auth page
echo "2. Testing auth page..."
AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://cozyartzmedia.com/auth)
echo "   Auth page status: $AUTH_STATUS"

# Test client portal redirect
echo "3. Testing client portal..."
PORTAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://cozyartzmedia.com/client-portal)
echo "   Client portal status: $PORTAL_STATUS"

# Test auth callback
echo "4. Testing auth callback..."
CALLBACK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://cozyartzmedia.com/auth/callback)
echo "   Auth callback status: $CALLBACK_STATUS"

echo ""
if [ "$MAIN_STATUS" = "200" ] && [ "$AUTH_STATUS" = "200" ]; then
    echo "✅ Basic tests passed!"
    echo "🎯 Next steps:"
    echo "   1. Open https://cozyartzmedia.com"
    echo "   2. Click 'Client Portal' link"
    echo "   3. Verify auth page loads without errors"
    echo "   4. Try signing in with GitHub/Google"
else
    echo "❌ Some tests failed. Check the deployment."
fi

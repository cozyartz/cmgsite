#!/bin/bash

echo "🧪 TESTING AUTH SYSTEM STATUS"
echo "============================"

# Test main site
echo "1. Testing main site..."
MAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://cozyartzmedia.com)
echo "   Main site: $MAIN_STATUS"

# Test auth page specifically  
echo "2. Testing auth page..."
AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://cozyartzmedia.com/auth)
echo "   Auth page: $AUTH_STATUS"

# Test if we can get the HTML content
echo "3. Testing auth page content..."
AUTH_CONTENT=$(curl -s https://cozyartzmedia.com/auth | head -c 200)
echo "   Content preview: $AUTH_CONTENT"

# Check if auth endpoint returns any useful info
echo "4. Testing Supabase connection..."
curl -s -I https://uncynkmprbzgzvonafoe.supabase.co/auth/v1/signup || echo "Supabase connection test failed"

echo ""
echo "🎯 DIRECT LOGIN STEPS FOR YOU:"
echo "================================"
echo "If the auth page (status $AUTH_STATUS) is working:"
echo ""
echo "1. Open: https://cozyartzmedia.com/auth"
echo "2. Click 'Continue with GitHub'"
echo "3. Login with your GitHub account"
echo "4. Should auto-redirect to /superadmin"
echo ""
echo "Your GitHub account should be linked to cozy2963@gmail.com"
echo "This will give you superadmin access immediately."
echo ""
echo "If that doesn't work, try Google OAuth instead."

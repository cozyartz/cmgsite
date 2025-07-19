#!/bin/bash

echo "🔍 Testing local build process..."

# Set environment variables to match production
export VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
export VITE_SITE_URL=https://cozyartzmedia.com
export VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback
export VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
export VITE_ENVIRONMENT=production

echo "📦 Installing dependencies..."
npm ci

echo "🏗️ Building application..."
npm run build:spa

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Checking dist directory..."
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi

#!/bin/bash

# Production deployment script with environment variables
# This script safely deploys with required environment variables without leaking them in git

echo "🚀 Starting production deployment..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with required environment variables"
    exit 1
fi

# Source environment variables from .env.local
export $(grep -v '^#' .env.local | xargs)

# Validate required environment variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Missing required environment variables"
    echo "Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local"
    exit 1
fi

echo "✅ Environment variables validated"

# Run deployment with environment variables
npm run deploy

echo "🎉 Deployment completed!"
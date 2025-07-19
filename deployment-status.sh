#!/bin/bash

echo "🚀 CMGsite Deployment Status Check"
echo "================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Not in CMGsite directory"
    exit 1
fi

echo "✅ In CMGsite directory"

# Check if changes were committed
git_status=$(git status --porcelain)
if [ -z "$git_status" ]; then
    echo "✅ All changes committed"
else
    echo "⚠️  Uncommitted changes detected"
fi

# Check last commit
echo "📝 Last commit:"
git log -1 --oneline

# Check if we're up to date with remote
echo ""
echo "🌐 Remote status:"
git status | head -2

echo ""
echo "🎯 Ready for deployment!"
echo ""
echo "Manual deployment commands:"
echo "1. npm run health-check"
echo "2. npm run build:production" 
echo "3. npm run deploy:pages"
echo ""
echo "Or run all at once:"
echo "npm run deploy:production"

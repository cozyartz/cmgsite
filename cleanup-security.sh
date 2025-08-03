#!/bin/bash

# CRITICAL SECURITY CLEANUP SCRIPT
# This script removes sensitive data from git history

echo "🚨 CRITICAL: Starting security cleanup..."
echo "⚠️  WARNING: This will rewrite git history!"
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo "🔄 Removing sensitive files from git history..."

# Remove .env files with credentials from history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env .dev.vars test-email-setup.js package-email-test.json' \
  --prune-empty --tag-name-filter cat -- --all

echo "🔄 Cleaning up references..."
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "✅ Git history cleaned!"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Force push: git push --force-with-lease origin main"
echo "2. Regenerate ALL exposed credentials:"
echo "   - GitHub OAuth app credentials"
echo "   - Google OAuth app credentials" 
echo "   - Cloudflare API tokens"
echo "   - Any other API keys in the exposed files"
echo "3. Update .env files with new credentials"
echo "4. Verify all team members pull the cleaned history"

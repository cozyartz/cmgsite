#!/bin/bash

# CMGsite Cleanup Script - Remove unused legacy files
echo "🧹 Cleaning up CMGsite - Removing unused files..."

# Remove legacy static HTML files (replaced by React SPA)
echo "Removing legacy static HTML files..."
rm -f ai-services.html
rm -f seo-services.html
rm -f instructional-design-services.html
rm -f multimedia-services.html
rm -f drone-services.html
rm -f web-graphic-design-services.html
rm -f pricing.html

# Remove unused auth components
echo "Removing unused auth components..."
rm -f src/pages/AuthSimpleSupabase.tsx
rm -f src/pages/TestAuth.tsx

# Remove old test files
echo "Removing old test files..."
rm -f test-auth.mjs
rm -f test-superadmin.sql

# Clean up legacy documentation that's no longer relevant
echo "Cleaning up outdated documentation..."
rm -f AUTH_TEST_SUMMARY.md
rm -f BUSINESS_STRATEGY_SUMMARY.md
rm -f GDPR_COMPLIANCE_SUMMARY.md
rm -f LEGAL_COMPLIANCE_SUMMARY.md
rm -f SECURITY_AUDIT.md

echo "✅ Cleanup complete!"
echo ""
echo "📋 Remaining files are:"
echo "✅ Current React SPA implementation"
echo "✅ Active Supabase authentication"
echo "✅ Role-based routing system"
echo "✅ Updated documentation"
echo ""
echo "🚀 Ready for deployment with: npm run deploy:production"
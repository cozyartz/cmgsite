#!/bin/bash

# Quick fix for RLS infinite recursion issue
echo "🔧 Fixing Supabase RLS Infinite Recursion"
echo "========================================"
echo ""

echo "📋 The issue: RLS policies are referencing themselves causing infinite recursion"
echo "💡 The fix: Simplified policies using JWT claims instead of profile lookups"
echo ""

echo "🎯 Next Steps:"
echo "1. Open Supabase Dashboard: https://supabase.com/dashboard"
echo "2. Go to your project: uncynkmprbzgzvonafoe"
echo "3. Navigate to: SQL Editor"
echo "4. Copy and run the contents of: fix-rls-recursion.sql"
echo ""

echo "📄 The fix includes:"
echo "  ✅ Drop problematic recursive policies"
echo "  ✅ Create simple non-recursive policies"
echo "  ✅ Use JWT claims for admin checks"
echo "  ✅ Update functions to avoid profile table lookups"
echo ""

echo "🔍 To verify the fix worked:"
echo "  npm run health-check"
echo ""

echo "🚀 After fixing, you can deploy:"
echo "  npm run deploy:production"
echo ""

# Check if Supabase CLI is available
if command -v supabase &> /dev/null; then
    echo "💡 Supabase CLI detected!"
    echo "Alternative: Run this command to apply the fix:"
    echo "  supabase db push --include-all"
    echo ""
fi

echo "📁 SQL Fix File Location:"
echo "  $(pwd)/fix-rls-recursion.sql"
echo ""

echo "🔗 Direct Supabase Dashboard Link:"
echo "  https://supabase.com/dashboard/project/uncynkmprbzgzvonafoe/sql"

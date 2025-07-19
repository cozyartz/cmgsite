#!/usr/bin/env node

/**
 * Production Environment Variables Validation Script
 * Validates that all required environment variables are properly configured
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });
dotenv.config({ path: join(__dirname, '.env') });

console.log('🔍 Production Environment Validation');
console.log('=' .repeat(50));

let allTestsPassed = true;

// Required environment variables
const requiredVars = [
  { name: 'VITE_SUPABASE_URL', description: 'Supabase project URL' },
  { name: 'VITE_SUPABASE_ANON_KEY', description: 'Supabase anonymous key' },
];

const optionalVars = [
  { name: 'VITE_TURNSTILE_SITE_KEY', description: 'Cloudflare Turnstile site key' },
  { name: 'VITE_SITE_URL', description: 'Site URL for callbacks' },
  { name: 'VITE_CALLBACK_URL', description: 'OAuth callback URL' },
];

console.log('\n1️⃣ Testing Required Environment Variables...');
requiredVars.forEach(envVar => {
  const value = process.env[envVar.name];
  const status = value ? '✅' : '❌';
  console.log(`   ${status} ${envVar.name}: ${value ? 'Set' : 'MISSING'}`);
  
  if (!value) {
    allTestsPassed = false;
    console.log(`      Error: ${envVar.description} is required`);
  }
});

console.log('\n2️⃣ Testing Optional Environment Variables...');
optionalVars.forEach(envVar => {
  const value = process.env[envVar.name];
  const status = value ? '✅' : '⚠️ ';
  console.log(`   ${status} ${envVar.name}: ${value ? 'Set' : 'Using default'}`);
});

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('\n3️⃣ Testing Supabase Connection...');
  
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.log('   ❌ Cannot test connection - missing credentials');
    return false;
  }
  
  try {
    const supabase = createClient(url, key);
    
    // Test auth service
    const { error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log('   ❌ Auth service error:', authError.message);
      return false;
    }
    console.log('   ✅ Auth service responding');
    
    // Test database connection (expect RLS error, which is good)
    const { error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (dbError) {
      if (dbError.code === 'PGRST116') {
        console.log('   ⚠️  Profiles table not found - run schema setup');
      } else if (dbError.message.includes('permission denied') || dbError.message.includes('RLS')) {
        console.log('   ✅ Database connection working (RLS active)');
      } else if (dbError.message.includes('infinite recursion')) {
        console.log('   ❌ RLS infinite recursion detected - run fix-rls-recursion.sql');
        return false;
      } else {
        console.log('   ❌ Database error:', dbError.message);
        console.log('   💡 This might be a policy issue - check Supabase dashboard');
        return false;
      }
    } else {
      console.log('   ✅ Database connection successful');
    }
    
    return true;
  } catch (error) {
    console.log('   ❌ Connection failed:', error.message);
    return false;
  }
}

// Test build configuration
function testBuildConfig() {
  console.log('\n4️⃣ Testing Build Configuration...');
  
  const environment = process.env.VITE_ENVIRONMENT || 'development';
  console.log(`   ✅ Environment: ${environment}`);
  
  // Check if we're in production mode
  if (environment === 'production') {
    console.log('   ✅ Production mode detected');
    
    // Additional production checks
    const siteUrl = process.env.VITE_SITE_URL;
    if (siteUrl && siteUrl.startsWith('https://')) {
      console.log('   ✅ HTTPS site URL configured');
    } else {
      console.log('   ⚠️  Non-HTTPS site URL or using default');
    }
    
    const turnstileKey = process.env.VITE_TURNSTILE_SITE_KEY;
    if (turnstileKey && turnstileKey !== 'your_turnstile_site_key_here') {
      console.log('   ✅ Turnstile configured for production');
    } else {
      console.log('   ⚠️  Turnstile not configured (using placeholder)');
    }
  }
  
  return true;
}

// Run all tests
async function runAllTests() {
  console.log('\n🚀 Running All Environment Tests...\n');
  
  let supabaseOk = true;
  try {
    supabaseOk = await testSupabaseConnection();
  } catch (error) {
    console.error('   ❌ Supabase test failed:', error.message);
    supabaseOk = false;
  }
  
  const buildOk = testBuildConfig();
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Environment Validation Results');
  console.log('=' .repeat(50));
  
  console.log(`Required Variables: ${requiredVars.every(v => process.env[v.name]) ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Supabase Connection: ${supabaseOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Build Configuration: ${buildOk ? '✅ PASS' : '❌ FAIL'}`);
  
  const overallStatus = allTestsPassed && supabaseOk && buildOk;
  
  console.log('\n🎯 Overall Status:');
  if (overallStatus) {
    console.log('✅ Environment is PRODUCTION READY!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run npm run build to test compilation');
    console.log('   2. Deploy to staging environment');
    console.log('   3. Run end-to-end authentication tests');
    console.log('   4. Deploy to production');
  } else {
    console.log('❌ Environment needs configuration');
    console.log('\n🔧 Required actions:');
    if (!allTestsPassed) {
      console.log('   • Set missing required environment variables');
    }
    if (!supabaseOk) {
      console.log('   • Fix Supabase connection issues');
      console.log('   • Verify Supabase project settings');
      console.log('   • Run database schema setup');
    }
    console.log('   • Re-run this validation script');
  }
  
  return overallStatus;
}

// Execute
runAllTests()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('\n💥 Validation script error:', error);
    process.exit(1);
  });

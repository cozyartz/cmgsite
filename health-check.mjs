#!/usr/bin/env node

/**
 * Production Health Check Script
 * Verifies the application is production-ready
 */

import { promises as fs } from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

console.log('🏥 Production Health Check');
console.log('='.repeat(40));

let healthScore = 0;
let maxScore = 0;

function checkItem(name, condition, critical = false) {
  maxScore += critical ? 2 : 1;
  const weight = critical ? 2 : 1;
  
  if (condition) {
    healthScore += weight;
    console.log(`✅ ${name}`);
    return true;
  } else {
    console.log(`❌ ${name} ${critical ? '(CRITICAL)' : ''}`);
    return false;
  }
}

async function runHealthCheck() {
  console.log('\n1️⃣ Environment Configuration');
  
  // Critical environment variables
  checkItem(
    'Supabase URL configured',
    !!process.env.VITE_SUPABASE_URL,
    true
  );
  
  checkItem(
    'Supabase anonymous key configured',
    !!process.env.VITE_SUPABASE_ANON_KEY,
    true
  );
  
  checkItem(
    'Production environment set',
    process.env.VITE_ENVIRONMENT === 'production',
    true
  );
  
  checkItem(
    'Production site URL configured',
    process.env.VITE_SITE_URL === 'https://cozyartzmedia.com'
  );
  
  checkItem(
    'Production callback URL configured',
    process.env.VITE_CALLBACK_URL === 'https://cozyartzmedia.com/auth/callback'
  );
  
  checkItem(
    'Turnstile configured',
    !!process.env.VITE_TURNSTILE_SITE_KEY
  );
  
  console.log('\n2️⃣ File Structure');
  
  // Check critical files exist
  try {
    await fs.access('src/App.tsx');
    checkItem('App.tsx exists', true, true);
  } catch {
    checkItem('App.tsx exists', false, true);
  }
  
  try {
    await fs.access('src/main.tsx');
    checkItem('main.tsx exists', true, true);
  } catch {
    checkItem('main.tsx exists', false, true);
  }
  
  try {
    await fs.access('src/lib/supabase.ts');
    checkItem('Supabase configuration exists', true, true);
  } catch {
    checkItem('Supabase configuration exists', false, true);
  }
  
  try {
    await fs.access('src/contexts/SupabaseAuthContext.tsx');
    checkItem('Auth context exists', true, true);
  } catch {
    checkItem('Auth context exists', false, true);
  }
  
  // Check page files
  const pages = ['Home.tsx', 'AuthPage.tsx', 'ClientPortal.tsx', 'SuperAdminDashboard.tsx'];
  for (const page of pages) {
    try {
      await fs.access(`src/pages/${page}`);
      checkItem(`${page} exists`, true);
    } catch {
      checkItem(`${page} exists`, false);
    }
  }
  
  console.log('\n3️⃣ App.tsx Content Validation');
  
  try {
    const appContent = await fs.readFile('src/App.tsx', 'utf8');
    
    checkItem(
      'Using SupabaseAuthContext',
      appContent.includes("from './contexts/SupabaseAuthContext'"),
      true
    );
    
    checkItem(
      'Not using simple auth demo',
      !appContent.includes('Simple auth state'),
      true
    );
    
    checkItem(
      'Has protected routes',
      appContent.includes('ProtectedRoute'),
      true
    );
    
    checkItem(
      'Has error boundary',
      appContent.includes('ErrorBoundary')
    );
    
  } catch (error) {
    checkItem('App.tsx readable', false, true);
  }
  
  console.log('\n4️⃣ Supabase Connection Test');
  
  if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.VITE_SUPABASE_ANON_KEY
      );
      
      // Test auth connection
      const { error } = await supabase.auth.getSession();
      checkItem('Supabase auth connection', !error, true);
      
      // Test database connection (expect RLS error which is good)
      const { error: dbError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (dbError) {
        if (dbError.code === 'PGRST116') {
          checkItem('Database connection', false); // Table doesn't exist
        } else if (dbError.message.includes('permission denied')) {
          checkItem('Database connection with RLS', true); // RLS is working
        } else {
          checkItem('Database connection', false);
        }
      } else {
        checkItem('Database connection', true);
      }
      
    } catch (error) {
      checkItem('Supabase connection test', false, true);
      console.log(`   Error: ${error.message}`);
    }
  }
  
  console.log('\n5️⃣ Build Configuration');
  
  try {
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    
    checkItem(
      'Has build:pages script',
      !!packageJson.scripts['build:pages']
    );
    
    checkItem(
      'Has deploy scripts',
      !!packageJson.scripts['deploy:pages']
    );
    
    checkItem(
      'Has production dependencies',
      !!packageJson.dependencies['@supabase/supabase-js'] &&
      !!packageJson.dependencies['react'] &&
      !!packageJson.dependencies['react-router-dom']
    );
    
  } catch (error) {
    checkItem('Package.json readable', false);
  }
  
  // Calculate health percentage
  const healthPercentage = Math.round((healthScore / maxScore) * 100);
  
  console.log('\n' + '='.repeat(40));
  console.log('📊 Health Check Results');
  console.log('='.repeat(40));
  console.log(`Score: ${healthScore}/${maxScore} (${healthPercentage}%)`);
  
  if (healthPercentage >= 90) {
    console.log('🎉 EXCELLENT - Ready for production!');
    return true;
  } else if (healthPercentage >= 80) {
    console.log('✅ GOOD - Ready for production with minor issues');
    return true;
  } else if (healthPercentage >= 70) {
    console.log('⚠️  FAIR - Address issues before production');
    return false;
  } else {
    console.log('❌ POOR - Critical issues must be fixed');
    return false;
  }
}

// Run the health check
runHealthCheck()
  .then((passed) => {
    if (passed) {
      console.log('\n🚀 Ready to deploy to production!');
      console.log('Run: npm run build:production');
      process.exit(0);
    } else {
      console.log('\n🔧 Fix issues before deploying');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 Health check failed:', error);
    process.exit(1);
  });

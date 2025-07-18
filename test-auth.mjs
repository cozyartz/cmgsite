import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

console.log('🔍 Testing Supabase Authentication Setup\n');
console.log(`📍 Supabase URL: ${supabaseUrl}`);
console.log(`🔑 Anon Key: ${supabaseAnonKey.substring(0, 20)}...`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  try {
    // Test 1: Check if we can connect to Supabase
    console.log('\n✅ Test 1: Connection to Supabase');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session Error:', sessionError.message);
    } else {
      console.log('✓ Connected to Supabase successfully');
      console.log('✓ Current session:', session ? 'Active' : 'None');
    }

    // Test 2: Check if profiles table exists (will fail if not created)
    console.log('\n✅ Test 2: Profiles Table');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      console.error('❌ Profiles Table Error:', profileError.message);
      console.log('→ You need to run the SQL schema in Supabase dashboard');
    } else {
      console.log('✓ Profiles table exists');
    }

    // Test 3: Check current user
    console.log('\n✅ Test 3: Current User');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('✓ No user currently logged in');
    } else {
      console.log('✓ Current user:', user.email);
      console.log('✓ User ID:', user.id);
      console.log('✓ Provider:', user.app_metadata?.provider);
    }

    // Test 4: Check OAuth providers configuration
    console.log('\n✅ Test 4: OAuth Configuration');
    console.log('→ GitHub OAuth Callback:', `${supabaseUrl}/auth/v1/callback`);
    console.log('→ Google OAuth Callback:', `${supabaseUrl}/auth/v1/callback`);
    
    console.log('\n📋 Next Steps:');
    console.log('1. Ensure you\'ve run the SQL schema in Supabase SQL editor');
    console.log('2. Configure OAuth providers in Supabase dashboard');
    console.log('3. Update OAuth apps with the callback URLs above');
    console.log('4. Visit http://localhost:5173/auth to test login');
    console.log('5. Visit http://localhost:5173/auth/debug to check status');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testAuth();
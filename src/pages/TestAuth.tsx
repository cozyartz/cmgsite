import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const TestAuth: React.FC = () => {
  const { user, profile, loading, isAdmin, isSuperAdmin, signInWithOAuth, signOut } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = async () => {
    const results: string[] = [];
    
    // Test 1: Supabase Connection
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        results.push(`❌ Supabase Connection Error: ${error.message}`);
      } else {
        results.push('✅ Connected to Supabase');
        results.push(`   Session: ${data.session ? 'Active' : 'None'}`);
      }
    } catch (e) {
      results.push(`❌ Connection failed: ${e}`);
    }

    // Test 2: Current User Status
    if (user) {
      results.push('✅ User Authenticated');
      results.push(`   Email: ${user.email}`);
      results.push(`   Provider: ${user.app_metadata?.provider}`);
      results.push(`   GitHub: ${user.user_metadata?.user_name || 'N/A'}`);
    } else {
      results.push('❌ No user logged in');
    }

    // Test 3: Profile Status
    if (profile) {
      results.push('✅ Profile Loaded');
      results.push(`   Name: ${profile.full_name}`);
      results.push(`   Role: ${profile.role}`);
      results.push(`   Admin: ${isAdmin ? 'Yes' : 'No'}`);
      results.push(`   SuperAdmin: ${isSuperAdmin ? 'Yes' : 'No'}`);
    } else {
      results.push('❌ No profile loaded');
    }

    // Test 4: Expected SuperAdmin
    results.push('');
    results.push('📋 Expected SuperAdmin Detection:');
    results.push('   Emails: cozy2963@gmail.com, andrea@cozyartzmedia.com');
    results.push('   GitHub: cozyartz');

    setTestResults(results);
  };

  React.useEffect(() => {
    runTests();
  }, [user, profile]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Auth Status</h2>
          <div className="space-y-2 font-mono text-sm">
            {loading ? (
              <p className="text-yellow-600">Loading...</p>
            ) : (
              <>
                <p>Loading: {loading ? 'Yes' : 'No'}</p>
                <p>User: {user ? user.email : 'None'}</p>
                <p>Profile: {profile ? profile.role : 'None'}</p>
                <p>Is Admin: {isAdmin ? 'Yes' : 'No'}</p>
                <p>Is SuperAdmin: {isSuperAdmin ? 'Yes' : 'No'}</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {testResults.join('\n')}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            {!user ? (
              <>
                <button
                  onClick={() => signInWithOAuth('github')}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                >
                  Login with GitHub
                </button>
                <button
                  onClick={() => signInWithOAuth('google')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Login with Google
                </button>
              </>
            ) : (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={runTests}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Re-run Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuth;
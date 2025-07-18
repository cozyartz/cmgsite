import React from 'react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { User, Shield, Mail, Github, AlertCircle, CheckCircle } from 'lucide-react';

const AuthDebug: React.FC = () => {
  const { user, profile, loading, isAdmin, isSuperAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-yellow-800">Loading authentication state...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Authentication Status */}
      <div className={`p-4 rounded-lg border ${user ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          {user ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <h3 className="font-semibold text-lg">Authentication Status</h3>
        </div>
        <p className={user ? 'text-green-800' : 'text-red-800'}>
          {user ? 'Authenticated' : 'Not Authenticated'}
        </p>
      </div>

      {/* User Information */}
      {user && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg">User Information</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Email:</span>
              <span className="text-blue-800">{user.email}</span>
            </div>
            <div>
              <span className="font-medium">User ID:</span>
              <span className="text-blue-800 ml-2 font-mono text-xs">{user.id}</span>
            </div>
            <div>
              <span className="font-medium">Provider:</span>
              <span className="text-blue-800 ml-2">{user.app_metadata?.provider || 'Unknown'}</span>
            </div>
            {user.user_metadata?.user_name && (
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-blue-500" />
                <span className="font-medium">GitHub Username:</span>
                <span className="text-blue-800">{user.user_metadata.user_name}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Information */}
      {profile && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-lg">Profile & Permissions</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Full Name:</span>
              <span className="text-purple-800 ml-2">{profile.full_name}</span>
            </div>
            <div>
              <span className="font-medium">Role:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                profile.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {profile.role}
              </span>
            </div>
            <div>
              <span className="font-medium">Is Admin:</span>
              <span className={`ml-2 font-semibold ${isAdmin ? 'text-green-600' : 'text-gray-600'}`}>
                {isAdmin ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Is SuperAdmin:</span>
              <span className={`ml-2 font-semibold ${isSuperAdmin ? 'text-green-600' : 'text-gray-600'}`}>
                {isSuperAdmin ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Created:</span>
              <span className="text-purple-800 ml-2">
                {new Date(profile.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Expected SuperAdmin Status */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-lg mb-2">Expected SuperAdmin Detection</h3>
        <div className="space-y-1 text-sm">
          <p className="text-gray-700">
            You should be automatically detected as SuperAdmin if:
          </p>
          <ul className="list-disc list-inside text-gray-600 ml-2">
            <li>Email is: <code className="bg-gray-200 px-1 rounded">cozy2963@gmail.com</code></li>
            <li>Email is: <code className="bg-gray-200 px-1 rounded">andrea@cozyartzmedia.com</code></li>
            <li>GitHub username is: <code className="bg-gray-200 px-1 rounded">cozyartz</code></li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      {user && (
        <div className="flex gap-2">
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthDebug;
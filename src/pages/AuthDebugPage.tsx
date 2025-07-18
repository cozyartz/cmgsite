import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthDebug from '../components/debug/AuthDebug';

const AuthDebugPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          to="/auth" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Panel</h1>
        
        <AuthDebug />
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">🔍 Debug Information</h3>
          <p className="text-sm text-yellow-800">
            This page displays your current authentication state and verifies SuperAdmin detection.
            After logging in, you should see your profile information and admin status here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugPage;
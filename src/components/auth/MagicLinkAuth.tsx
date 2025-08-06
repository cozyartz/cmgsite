import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MagicLinkAuthProps {
  mode?: 'signin' | 'signup';
  onSuccess?: () => void;
  className?: string;
}

export const MagicLinkAuth: React.FC<MagicLinkAuthProps> = ({
  mode = 'signin',
  onSuccess,
  className = ''
}) => {
  const { signInWithMagicLink, signUpWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        await signUpWithMagicLink(email, { fullName });
      } else {
        await signInWithMagicLink(email);
      }
      
      setSent(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Check your email
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a magic link to <strong>{email}</strong>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Click the link in your email to {mode === 'signup' ? 'create your account' : 'sign in'}
          </p>
        </div>
        
        <button
          onClick={() => {
            setSent(false);
            setEmail('');
            setFullName('');
          }}
          className="w-full text-center text-sm text-teal-600 hover:text-teal-500"
        >
          Try a different email
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <Mail className="mx-auto h-12 w-12 text-teal-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {mode === 'signup' ? 'Create Account' : 'Sign In'} with Magic Link
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {mode === 'signup' 
            ? 'Get started with a secure magic link sent to your email'
            : 'No password needed - just enter your email'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter your email address"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email || (mode === 'signup' && !fullName)}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Sending magic link...
            </>
          ) : (
            <>
              <Mail className="-ml-1 mr-2 h-4 w-4" />
              Send Magic Link
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default MagicLinkAuth;
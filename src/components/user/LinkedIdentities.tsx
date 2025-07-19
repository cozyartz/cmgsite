import React, { useState, useEffect } from 'react';
import { Github, Mail, Link2, Unlink, AlertCircle, CheckCircle, Plus, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/SupabaseAuthContext';

interface Identity {
  id: string;
  provider: string;
  email?: string;
  created_at: string;
  updated_at: string;
  identity_data: {
    email?: string;
    user_name?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

interface LinkedIdentitiesProps {
  className?: string;
}

export const LinkedIdentities: React.FC<LinkedIdentitiesProps> = ({ className = '' }) => {
  const { 
    user, 
    getUserIdentities, 
    linkIdentity, 
    unlinkIdentity, 
    canUnlinkIdentity,
    isProviderLinked 
  } = useAuth();
  
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(false);
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [canUnlink, setCanUnlink] = useState(false);

  useEffect(() => {
    loadIdentities();
  }, [user]);

  const loadIdentities = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getUserIdentities();
      setIdentities(data?.identities || []);
      
      // Check if user can unlink identities
      const unlinkable = await canUnlinkIdentity();
      setCanUnlink(unlinkable);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to load identities' });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkIdentity = async (provider: 'github' | 'google') => {
    setLinkingProvider(provider);
    setMessage(null);

    try {
      // Check if already linked
      const alreadyLinked = await isProviderLinked(provider);
      if (alreadyLinked) {
        setMessage({ type: 'error', text: `${provider} is already linked to your account` });
        return;
      }

      await linkIdentity(provider);
      // OAuth redirect will handle the rest
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || `Failed to link ${provider}` });
    } finally {
      setLinkingProvider(null);
    }
  };

  const handleUnlinkIdentity = async (identity: Identity) => {
    if (!canUnlink) {
      setMessage({ 
        type: 'error', 
        text: 'Cannot unlink identity. You must have at least one authentication method.' 
      });
      return;
    }

    setUnlinkingProvider(identity.provider);
    setMessage(null);

    try {
      await unlinkIdentity(identity);
      setMessage({ 
        type: 'success', 
        text: `Successfully unlinked ${identity.provider} from your account` 
      });
      
      // Reload identities
      await loadIdentities();
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || `Failed to unlink ${identity.provider}` });
    } finally {
      setUnlinkingProvider(null);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'google':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'email':
        return <Mail className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case 'github':
        return 'GitHub';
      case 'google':
        return 'Google';
      case 'email':
        return 'Email';
      default:
        return provider.charAt(0).toUpperCase() + provider.slice(1);
    }
  };

  const getPrimaryIdentity = () => {
    if (!identities.length) return null;
    return identities.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )[0];
  };

  const availableProviders = ['github', 'google'].filter(provider => 
    !identities.some(identity => identity.provider === provider)
  );

  if (!user) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">Please sign in to manage linked accounts</p>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto bg-white shadow rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Link2 className="h-6 w-6 text-teal-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Linked Accounts</h3>
            <p className="text-sm text-gray-500">
              Manage how you sign in to your account
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 flex items-center space-x-2 p-3 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Current Identities */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700">Connected Accounts</h4>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto"></div>
            </div>
          ) : identities.length === 0 ? (
            <p className="text-sm text-gray-500">No linked accounts found</p>
          ) : (
            <div className="space-y-3">
              {identities.map((identity) => {
                const isPrimary = identity.id === getPrimaryIdentity()?.id;
                return (
                  <div
                    key={identity.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600">
                        {getProviderIcon(identity.provider)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {getProviderLabel(identity.provider)}
                          </span>
                          {isPrimary && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {identity.identity_data?.email || 
                           identity.identity_data?.user_name ||
                           'Connected'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Added {new Date(identity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Unlink Button */}
                    {!isPrimary && canUnlink && (
                      <button
                        onClick={() => handleUnlinkIdentity(identity)}
                        disabled={unlinkingProvider === identity.provider}
                        className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {unlinkingProvider === identity.provider ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600"></div>
                            <span>Unlinking...</span>
                          </>
                        ) : (
                          <>
                            <Unlink className="h-3 w-3" />
                            <span>Unlink</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add New Identity */}
        {availableProviders.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Add Account</h4>
            <div className="space-y-2">
              {availableProviders.map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleLinkIdentity(provider as 'github' | 'google')}
                  disabled={linkingProvider === provider}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {linkingProvider === provider ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-gray-600"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      {getProviderIcon(provider)}
                      <span>Link {getProviderLabel(provider)}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">About Linked Accounts</p>
              <ul className="space-y-1 text-xs">
                <li>• You can sign in with any of your linked accounts</li>
                <li>• All accounts access the same profile and data</li>
                <li>• You must keep at least one authentication method</li>
                <li>• Your primary account cannot be unlinked</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedIdentities;
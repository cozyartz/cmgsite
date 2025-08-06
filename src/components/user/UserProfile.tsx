import React, { useState, useRef } from 'react';
import { User, Camera, Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LinkedIdentities from './LinkedIdentities';

interface UserProfileProps {
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
  const { user, profile, updateProfile, uploadAvatar } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    company: profile?.company || '',
    phone: profile?.phone || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await updateProfile(formData);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' });
      return;
    }

    setUploadingAvatar(true);
    setMessage(null);

    try {
      const avatarUrl = await uploadAvatar(file);
      if (avatarUrl) {
        setMessage({ type: 'success', text: 'Avatar updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload avatar' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user || !profile) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Profile Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center space-x-6 mb-6">
          {/* Avatar */}
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-gray-400" />
              )}
            </div>
            
            <button
              onClick={triggerFileInput}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
            >
              {uploadingAvatar ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Camera className="h-3 w-3" />
              )}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {profile.full_name || 'Unnamed User'}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500 capitalize">
              {profile.role} • {profile.provider} authentication
            </p>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => {
              if (editing) {
                setFormData({
                  full_name: profile.full_name || '',
                  company: profile.company || '',
                  phone: profile.phone || '',
                });
              }
              setEditing(!editing);
            }}
            className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-md hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
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

        {/* Profile Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">
                {profile.full_name || 'Not set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company
            </label>
            {editing ? (
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Your company name"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">
                {profile.company || 'Not set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            {editing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Your phone number"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">
                {profile.phone || 'Not set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            <p className="text-xs text-gray-500">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {editing && (
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Linked Identities */}
      <LinkedIdentities />
    </div>
  );
};

export default UserProfile;
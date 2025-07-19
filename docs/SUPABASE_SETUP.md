# Supabase Production Setup Guide

This guide will help you configure Supabase for production with all advanced features including Identity Linking, Magic Links, Storage, and Real-time capabilities.

## 🔧 1. Database Setup

### Run the SQL Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `/supabase/schema.sql`
4. Click **Run** to execute

This will create:
- ✅ **Profiles table** with Row Level Security (RLS)
- ✅ **Notifications table** for real-time features
- ✅ **Analytics events table** for user tracking
- ✅ **Storage bucket** for file uploads
- ✅ **Automatic triggers** for profile creation
- ✅ **Performance indexes** for fast queries

## 🔐 2. Authentication Configuration

### Enable Identity Linking (Critical)

1. Go to **Authentication** → **Settings**
2. Find **Manual linking** section
3. ✅ **Enable manual linking** toggle
4. Click **Save**

### Configure Site URL

1. In **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://cozyartzmedia.com`
3. Add **Redirect URLs**:
   - `https://cozyartzmedia.com/auth/callback`
   - `https://cozyartzmedia.com/auth`
   - `https://cozyartzmedia.com/client-portal`

### Security Settings

1. In **Authentication** → **Settings**
2. Set **OTP Expiry**: `3600` seconds (1 hour) ⚠️ **Important for security**
3. ✅ Enable **Confirm email**
4. ✅ Enable **Magic link**
5. ✅ Enable **Email confirmations**

## 🔑 3. OAuth Provider Setup

### GitHub OAuth

1. Go to **Authentication** → **Providers** → **GitHub**
2. ✅ **Enable GitHub provider**
3. Add your GitHub OAuth credentials:
   - **Client ID**: `your_github_client_id`
   - **Client Secret**: `your_github_client_secret`
4. **Redirect URL**: `https://uncynkmprbzgzvonafoe.supabase.co/auth/v1/callback`

### Google OAuth

1. Go to **Authentication** → **Providers** → **Google**
2. ✅ **Enable Google provider**
3. Add your Google OAuth credentials:
   - **Client ID**: `your_google_client_id`
   - **Client Secret**: `your_google_client_secret`
4. **Redirect URL**: `https://uncynkmprbzgzvonafoe.supabase.co/auth/v1/callback`

## 📧 4. Email Configuration

### SMTP Settings (Recommended for Production)

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Configure your email provider:
   ```
   Host: your-smtp-host.com
   Port: 587
   Username: your-smtp-username
   Password: your-smtp-password
   Sender name: Cozyartz Media Group
   Sender email: noreply@cozyartzmedia.com
   ```

### Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize templates for:
   - **Confirm signup**
   - **Magic link**
   - **Reset password**
   - **Email change**

Example Magic Link template:
```html
<h2>Sign in to Cozyartz Media Group</h2>
<p>Click the link below to sign in:</p>
<p><a href="{{ .ConfirmationURL }}">Sign in to your account</a></p>
<p>This link expires in 1 hour.</p>
```

## 💾 5. Storage Configuration

### Create Storage Bucket

✅ **Already created via SQL schema** - `user-content` bucket

### Storage Policies (Already Applied)

The following RLS policies are automatically created:
- Users can upload to their own folder
- Users can view their own files
- Users can delete their own files

### File Upload Limits

- **Maximum file size**: 10MB
- **Allowed types**: Images (JPEG, PNG, GIF, WebP), PDFs
- **Folder structure**: `avatars/{user_id}-{random}.{ext}`

## ⚡ 6. Real-time Configuration

### Enable Real-time

1. Go to **Database** → **Replication**
2. ✅ **Enable** replication for:
   - `public.profiles`
   - `public.notifications`
   - `public.analytics_events`

### Real-time Channels

The application uses these real-time channels:
- `profile:{user_id}` - Profile changes
- `notifications:{user_id}` - New notifications

## 🔒 7. Row Level Security (RLS) Policies

### Profiles Table Policies
```sql
-- Users can view own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update own profile  
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Notifications Table Policies
```sql
-- Users can view own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update own notifications
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
```

## 🌍 8. Environment Variables

### Required Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Production URLs (Critical)
VITE_SITE_URL=https://cozyartzmedia.com
VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback
VITE_ENVIRONMENT=production
```

## 🚀 9. Features Enabled

### ✅ Identity Linking
- Users can link multiple OAuth providers to one account
- Automatic account unification
- Secure identity management

### ✅ Magic Link Authentication
- Passwordless authentication
- Secure OTP with 1-hour expiry
- Professional email templates

### ✅ File Storage
- Avatar uploads with automatic resizing
- Secure file access with RLS
- 10MB upload limit

### ✅ Real-time Features
- Live profile updates
- Real-time notifications
- Instant UI synchronization

### ✅ Analytics & Tracking
- User behavior tracking
- Page view analytics
- Custom event logging

## 🔍 10. Testing Your Setup

### Test Identity Linking

1. Sign up with GitHub
2. Go to Profile → Linked Accounts
3. Click "Link Google"
4. Complete OAuth flow
5. Verify both accounts are linked

### Test Magic Links

1. Go to authentication page
2. Switch to "Magic Link" mode
3. Enter email address
4. Check email for magic link
5. Click link to sign in

### Test File Upload

1. Go to Profile page
2. Click camera icon on avatar
3. Upload an image
4. Verify image appears immediately

## 🛠️ 11. Troubleshooting

### Common Issues

**Identity Linking Not Working**
- ✅ Verify manual linking is enabled in Supabase dashboard
- ✅ Check OAuth redirect URLs are correct
- ✅ Ensure same email is used for linking

**Magic Links Not Sending**
- ✅ Check SMTP configuration
- ✅ Verify OTP expiry is set to 3600 seconds
- ✅ Check spam folder

**File Upload Failing**
- ✅ Check file size (max 10MB)
- ✅ Verify file type is allowed
- ✅ Check storage RLS policies

**Real-time Not Working**
- ✅ Enable replication on tables
- ✅ Check RLS policies allow reading
- ✅ Verify real-time subscriptions

## 📋 12. Production Checklist

- [ ] SQL schema executed successfully
- [ ] Manual linking enabled
- [ ] Site URL configured correctly
- [ ] OTP expiry set to 1 hour
- [ ] OAuth providers configured
- [ ] SMTP email configured
- [ ] Storage bucket created
- [ ] RLS policies applied
- [ ] Real-time replication enabled
- [ ] Environment variables set
- [ ] Application deployed and tested

## 🎯 13. Next Steps

After completing this setup:

1. **Deploy your application**: `npm run deploy:production`
2. **Test all authentication flows**
3. **Verify identity linking works**
4. **Test magic link authentication**
5. **Upload test files to storage**
6. **Monitor real-time features**

Your Supabase setup will now support enterprise-grade authentication with identity linking, magic links, secure file storage, and real-time capabilities!
# 🔐 Supabase Setup Guide - Current Implementation

## Overview

CMGsite uses Supabase for authentication and user management with role-based access control. This guide covers the current production setup.

## 🎯 Current Configuration

### **Project Details:**
- **Project ID:** `uncynkmprbzgzvonafoe`
- **Project URL:** `https://uncynkmprbzgzvonafoe.supabase.co`
- **Environment:** Production ready ✅

### **Authentication Status:**
- ✅ OAuth with GitHub and Google configured
- ✅ Row Level Security (RLS) enabled
- ✅ Automatic profile creation
- ✅ Role-based access control
- ✅ Superadmin detection

## 🔧 Required Configuration

### 1. Authentication Settings

In your Supabase dashboard go to **Authentication** → **Settings**:

```
Site URL: https://cozyartzmedia.com
Redirect URLs: https://cozyartzmedia.com/auth/callback
```

### 2. OAuth Providers

#### **GitHub OAuth:**
- **Provider:** GitHub
- **Client ID:** Your GitHub OAuth app client ID
- **Client Secret:** Your GitHub OAuth app secret
- **Redirect URL:** `https://uncynkmprbzgzvonafoe.supabase.co/auth/v1/callback`

#### **Google OAuth:**
- **Provider:** Google
- **Client ID:** Your Google OAuth client ID  
- **Client Secret:** Your Google OAuth client secret
- **Redirect URL:** `https://uncynkmprbzgzvonafoe.supabase.co/auth/v1/callback`

### 3. Database Schema

The database schema is already configured. Key components:

#### **profiles Table:**
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT,
  github_username TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);
```

#### **Row Level Security Policies:**
- Users can view/update their own profiles
- Admins can view all profiles
- Automatic profile creation on signup

#### **Superadmin Detection:**
Automatic admin role assignment for:
- **Emails:** `cozy2963@gmail.com`, `andrea@cozyartzmedia.com`
- **GitHub:** `cozyartz` username

## 🚀 Environment Variables

### **Required in `.env.local`:**
```bash
VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8
VITE_SITE_URL=https://cozyartzmedia.com
VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback
```

### **Optional (for advanced features):**
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 🧪 Testing Your Setup

### **1. Test Database Connection:**
```bash
npm run test:supabase
```

### **2. Test Role Detection:**
```bash
npm run test:roles
```

### **3. Manual Testing:**
1. Visit `https://cozyartzmedia.com/auth`
2. Login with GitHub (`cozyartz`) or Gmail (`cozy2963@gmail.com`)
3. Should redirect to `/superadmin` with admin access
4. Test with other accounts → should go to `/client-portal`

## 🔍 Troubleshooting

### **Profile Not Created:**
1. Check the `handle_new_user()` trigger function exists
2. Verify RLS policies are set correctly
3. Check Supabase logs for errors

### **OAuth Issues:**
1. Verify redirect URLs match exactly
2. Check OAuth app configuration
3. Ensure site URL is set correctly

### **Role Detection Problems:**
1. Check user metadata in Supabase dashboard
2. Verify email/GitHub username in database
3. Test role detection logic: `npm run test:roles`

### **Common Fixes:**
```sql
-- Re-run schema if needed
\i supabase-schema-fix.sql

-- Check user profiles
SELECT id, email, role, github_username FROM profiles;

-- Manually promote user to admin
SELECT promote_to_admin('user@example.com');
```

## 📊 Database Schema Status

### **Tables:**
- ✅ `profiles` - User profiles with role management
- ✅ `auth.users` - Supabase auth users (automatic)

### **Functions:**
- ✅ `handle_new_user()` - Auto-create profiles
- ✅ `promote_to_admin()` - Manual role promotion
- ✅ `check_superadmin_status()` - Role validation

### **Policies:**
- ✅ User profile access control
- ✅ Admin profile visibility
- ✅ Secure role management

### **Triggers:**
- ✅ `on_auth_user_created` - Auto-profile creation
- ✅ `update_profiles_updated_at` - Timestamp updates

## 🎯 Current Features

### **Authentication Methods:**
- ✅ GitHub OAuth
- ✅ Google OAuth
- ✅ Magic link email (optional)
- ✅ Email/password (optional)

### **Role System:**
- ✅ Automatic superadmin detection
- ✅ Role-based dashboard routing
- ✅ Protected route access control
- ✅ Profile metadata management

### **Security:**
- ✅ Row Level Security (RLS)
- ✅ JWT token validation
- ✅ Secure session management
- ✅ CSRF protection with Turnstile

## 🔄 Updates & Maintenance

### **Schema Updates:**
If you need to update the database schema, run:
```sql
-- Copy from supabase-schema-fix.sql
-- Paste in Supabase SQL Editor
```

### **Adding New Superadmins:**
Update the role detection in `handle_new_user()` function:
```sql
IF user_email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com', 'new@email.com') OR
   github_username IN ('cozyartz', 'newusername') THEN
  user_role := 'admin';
END IF;
```

---

## ✅ Status: Production Ready

Your Supabase authentication is fully configured and production-ready with:
- ✅ OAuth providers configured
- ✅ Database schema deployed
- ✅ Role-based access control
- ✅ Automatic superadmin detection
- ✅ Protected routing system

**Ready for use!** 🚀
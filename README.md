# 🚀 Cozyartz Media Group - Client Portal & Website

> Modern React SPA with Supabase authentication, role-based access control, and Cloudflare deployment

## 📋 Overview

CMGsite is a comprehensive client portal and business website built with React, TypeScript, and Supabase. It features role-based authentication, protected dashboards, and a complete business automation platform.

## ✨ Features

### 🔐 **Authentication & Security**
- **Supabase Authentication** - OAuth with GitHub & Google
- **Role-Based Access Control** - User, Admin, and Superadmin roles
- **Protected Routes** - Automatic redirects based on user permissions
- **Cloudflare Turnstile** - Bot protection and security validation
- **Session Management** - Persistent authentication across visits

### 🎯 **User Experience**
- **Single Page Application** - Fast, seamless navigation
- **Responsive Design** - Mobile-first, works on all devices
- **Progressive Web App** - Installable, offline-capable
- **Loading States** - Smooth transitions and feedback

### 🏢 **Business Features**
- **Client Portal** - Secure dashboard for client management
- **Admin Dashboard** - Administrative tools and controls
- **Superadmin Panel** - Full system access and configuration
- **Service Pages** - AI, SEO, Design, Multimedia, Drone services
- **Consultation Booking** - Integrated scheduling system

### 🛠️ **Technical Stack**
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Authentication:** Supabase Auth with RLS
- **Deployment:** Cloudflare Pages + Workers
- **Database:** Supabase PostgreSQL
- **Build Tool:** Vite
- **Icons:** Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Cloudflare account
- Supabase account

### 1. Clone and Install
```bash
git clone <repository>
cd cmgsite
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Cloudflare Turnstile
VITE_TURNSTILE_SITE_KEY=your-turnstile-key

# Production URLs
VITE_SITE_URL=https://your-domain.com
VITE_CALLBACK_URL=https://your-domain.com/auth/callback
```

### 3. Database Setup
Run the SQL schema in your Supabase SQL Editor:
```bash
# Copy the schema from supabase-schema-fix.sql
# Paste and execute in Supabase dashboard > SQL Editor
```

### 4. Development
```bash
npm run dev          # Start dev server
npm run test:supabase # Test Supabase connection
npm run test:roles   # Test role detection
```

### 5. Deploy
```bash
npm run deploy:production
```

## 🔐 Authentication & Roles

### **Superadmin Access** (Full System Control)
- **Emails:** `cozy2963@gmail.com`, `andrea@cozyartzmedia.com`
- **GitHub:** `cozyartz`
- **Access:** `/superadmin` dashboard with full permissions

### **Regular Users** (Client Portal)
- **All other authenticated users**
- **Access:** `/client-portal` with standard features

### **Authentication Flow**
1. Visit `/auth` → Login page
2. OAuth with GitHub/Google → Supabase processing
3. Redirect to `/auth/callback` → Role detection
4. Auto-redirect to appropriate dashboard:
   - Superadmin → `/superadmin`
   - Regular users → `/client-portal`

## 📁 Project Structure

```
cmgsite/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ProtectedRoute.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── contexts/          # React contexts
│   │   └── SupabaseAuthContext.tsx
│   ├── lib/               # Core libraries
│   │   └── supabase.ts    # Supabase client & services
│   ├── pages/             # Page components
│   │   ├── AuthSupabaseTurnstile.tsx  # Login page
│   │   ├── AuthCallback.tsx           # OAuth callback
│   │   ├── ClientPortalSimple.tsx     # User dashboard
│   │   ├── AdminDashboard.tsx         # Admin panel
│   │   ├── SuperAdminDashboard.tsx    # Superadmin panel
│   │   └── ...service pages
│   ├── utils/             # Utility functions
│   │   └── roleUtils.ts   # Role detection logic
│   └── App.tsx            # Main app component
├── public/                # Static assets
│   ├── _routes           # Cloudflare Pages routing
│   ├── _redirects        # SPA fallback rules
│   └── .htaccess         # Apache/server config
├── supabase/             # Database schema
├── tests/                # Test scripts
└── docs/                 # Documentation
```

## 🧪 Testing

### **Test Commands**
```bash
npm run test:supabase     # Test database connection
npm run test:roles        # Test role detection logic
npm run test:routing      # Test SPA routing locally
```

### **Manual Testing**
1. **Authentication Flow:**
   - Visit `https://your-domain.com/auth`
   - Login with GitHub/Google
   - Verify correct dashboard redirect

2. **Protected Routes:**
   - Try accessing `/superadmin` without auth
   - Verify access control enforcement

3. **Role Detection:**
   - Test with superadmin accounts
   - Test with regular user accounts

## 🌐 Deployment

### **Cloudflare Pages + Workers**
```bash
# Full deployment (recommended)
npm run deploy:production

# Individual components
npm run build:spa         # Build with routing config
npm run deploy:worker     # Deploy Cloudflare Worker
npm run deploy:pages      # Deploy to Cloudflare Pages
```

### **Environment-Specific Deployments**
```bash
npm run deploy:staging    # Deploy to staging
npm run worker:dev        # Local worker development
```

## 📚 Configuration Files

### **Key Configuration Files:**
- `vite.config.ts` - Build configuration
- `wrangler.toml` - Cloudflare Workers config
- `public/_routes` - Cloudflare Pages routing
- `public/_redirects` - SPA fallback rules
- `supabase-schema-fix.sql` - Database schema

### **Environment Variables:**
- **Required:** Supabase URL, Anon Key, Turnstile Site Key
- **Optional:** Service API keys (PayPal, Google, etc.)
- **Production:** Site URL, Callback URL

## 🔧 Troubleshooting

### **Common Issues:**

**404 on /auth route:**
- Ensure `_routes` and `_redirects` files are deployed
- Check Cloudflare Pages build settings
- Verify SPA routing configuration

**Authentication fails:**
- Check Supabase site URL and redirect URLs
- Verify OAuth provider configuration
- Test with auth debug page: `/auth/debug`

**Role detection incorrect:**
- Check user metadata in Supabase dashboard
- Verify profile creation in database
- Test role logic: `npm run test:roles`

**Build failures:**
- Clear node_modules and reinstall
- Check TypeScript compilation
- Verify environment variables

## 📞 Support

### **Documentation:**
- `SUPABASE_SETUP.md` - Database setup guide
- `ENVIRONMENT_SETUP.md` - Local development setup
- `PRODUCTION_SETUP.md` - Deployment configuration

### **Development:**
- Run tests before deploying
- Check browser console for errors
- Use Supabase dashboard for debugging

---

## 🎯 Current Status

✅ **Authentication:** Supabase OAuth with GitHub/Google  
✅ **Routing:** Fixed SPA routing, no more 404s  
✅ **Roles:** Automatic superadmin detection  
✅ **Security:** Protected routes with access control  
✅ **Deployment:** Cloudflare Pages + Workers  

**Ready for production use!** 🚀
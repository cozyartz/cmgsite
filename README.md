# 🚀 Cozyartz Media Group - Client Portal & Website

> Modern React SPA with Supabase authentication, role-based access control, and Cloudflare deployment

## 📋 Overview

CMGsite is a comprehensive client portal and business website built with React, TypeScript, and Supabase. It features role-based authentication, protected dashboards, and a complete business automation platform.

## ✨ Features

### 🔐 **Authentication & Security**
- **Supabase Authentication** - OAuth with GitHub & Google + Magic Link
- **Role-Based Access Control** - User, Admin, and Superadmin roles
- **Protected Routes** - Automatic redirects based on user permissions
- **Cloudflare Turnstile** - Bot protection and security validation
- **Session Management** - Persistent authentication across visits

### 🤖 **Enhanced AI Chatbot System** 
- **Enterprise-Grade AI** - Powered by Cloudflare Workers AI (Llama 3.3 70B + 3.1 8B)
- **Conversation Intelligence** - Intent classification, sentiment analysis, session memory
- **Advanced Lead Qualification** - AI-powered scoring and automated CRM integration  
- **Real-Time Analytics** - Live dashboard with AI performance metrics
- **Business Automation** - 24/7 lead generation with intelligent conversation flows
- **Multi-Modal AI** - Supports both MAX AI Assistant and public chatbot interfaces

### 🎯 **User Experience**
- **Single Page Application** - Fast, seamless navigation
- **Responsive Design** - Mobile-first, works on all devices
- **Progressive Web App** - Installable, offline-capable
- **Loading States** - Smooth transitions and feedback

### 🏢 **Business Features**
- **Client Portal** - Secure dashboard with SEO tools and analytics
- **MAX AI Integration** - Role-based AI assistant on all dashboards
- **Admin Dashboard** - Administrative tools and user management
- **Superadmin Panel** - Full system access with advanced AI features
- **Service Pages** - AI, SEO, Design, Multimedia, Drone services
- **Consultation Booking** - Integrated scheduling system
- **Analytics Integration** - Google Analytics, Search Console, PageSpeed insights

### 🛠️ **Technical Stack**
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **AI Infrastructure:** Cloudflare Workers AI, KV Storage for conversation memory
- **Authentication:** Supabase Auth with RLS
- **Deployment:** Cloudflare for Platforms (Pages + Functions + AI)
- **Database:** Cloudflare D1 (SQLite) + Supabase PostgreSQL
- **Build Tool:** Vite
- **Icons:** Lucide React
- **Analytics:** Real-time AI metrics with MCP server integration

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

### **Authentication Flow & Dashboard Access**
1. Visit `/auth` → Login page with OAuth and Magic Link options
2. OAuth with GitHub/Google → Supabase processing
3. Redirect to `/auth/callback` → Role detection and session setup
4. Auto-redirect to appropriate dashboard:
   - **Superadmin** → `/superadmin` (Full platform access + Admin MAX AI)
   - **Regular users** → `/client-portal` (SEO tools + Client MAX AI)

### **MAX AI Assistant Features**

#### **Superadmin MAX AI** (`/superadmin`)
- **Platform Intelligence**: User analytics, revenue data, system metrics
- **Business Insights**: Client portfolio, technology stack details
- **System Monitoring**: Performance data, security status, uptime metrics
- **Administrative Queries**: Quick access to platform management tasks

#### **Client MAX AI** (`/client-portal`)
- **SEO Expertise**: Keyword research, content optimization, technical SEO
- **Marketing Guidance**: Local SEO, link building, analytics setup
- **Security Restrictions**: Prevents access to system/business information
- **Plan-Based Features**: Different capabilities based on subscription tier

## 📁 Project Structure

```
cmgsite/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   │   ├── MaxHeadroomAI.tsx      # Superadmin AI assistant
│   │   │   └── UserManagement.tsx     # User admin tools
│   │   ├── customer/       # Client-facing components
│   │   │   └── CustomerMaxAI.tsx      # Client AI assistant
│   │   ├── dashboard/      # Dashboard widgets
│   │   │   ├── GoogleAnalyticsCard.tsx
│   │   │   ├── SearchConsoleCard.tsx
│   │   │   └── PageSpeedCard.tsx
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
npm run test:maxai        # Test AI assistant responses
```

### **Manual Testing**
1. **Authentication Flow:**
   - Visit `https://your-domain.com/auth`
   - Login with GitHub/Google or Magic Link
   - Verify correct dashboard redirect
   - Test logout functionality

2. **MAX AI Testing:**
   - **Superadmin**: Test admin AI responses with platform queries
   - **Client**: Test SEO AI responses and security restrictions
   - Verify role-based response differences

3. **Protected Routes:**
   - Try accessing `/superadmin` without auth
   - Verify access control enforcement
   - Test role-based redirects

4. **Dashboard Features:**
   - Test analytics integration
   - Verify user management (superadmin)
   - Check AI assistant accessibility

## 🌐 Deployment

### **Cloudflare for Platforms (Pages + AI + Functions)**

Using the latest Cloudflare for Platforms architecture. See: https://developers.cloudflare.com/cloudflare-for-platforms/

```bash
# Full deployment (recommended)
npm run deploy:production

# Individual components  
npm run build             # Build production bundle
wrangler pages deploy dist --project-name=cmgsite

# AI Infrastructure Setup
wrangler kv namespace create "AI_CONVERSATIONS"
wrangler kv namespace create "AI_ANALYTICS" 
wrangler d1 execute cmgsite-client-portal-db --file migrations/008_ai_analytics_tables.sql --remote
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
- **AI Required:** CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID (for Workers AI)
- **Optional:** Service API keys (PayPal, Google, etc.)
- **Production:** Site URL, Callback URL

### **AI Analytics & Business Intelligence:**
- **SuperAdmin Dashboard:** New "AI Analytics" tab with comprehensive metrics
- **MCP Server Integration:** Automatic sync to `/Users/cozart-lundin/code/cozyartz-mcp-hub/dashboard`
- **Real-Time Metrics:** Conversation stats, lead conversion rates, AI costs
- **Business Intelligence:** ROI analysis, performance optimization alerts

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

✅ **Authentication:** Supabase OAuth with GitHub/Google + Magic Link  
✅ **AI Integration:** MAX AI assistant with role-based responses  
✅ **Dashboard Routing:** Automatic user routing to appropriate dashboards  
✅ **Routing:** Fixed SPA routing, no more 404s  
✅ **Roles:** Automatic superadmin detection with enhanced features  
✅ **Security:** Protected routes with access control and AI safeguards  
✅ **Analytics:** Google services integration on all dashboards  
✅ **Deployment:** Cloudflare Pages + Workers with edge optimization  

**Ready for production use!** 🚀# Deployment test - $(date)

# 🔧 Environment Setup Guide - CMGsite

## Overview

This guide covers setting up your local development environment for CMGsite.

## 📋 Prerequisites

### **Required:**
- **Node.js 18+** and npm
- **Git** for version control
- **Cloudflare account** (free tier works)
- **Supabase account** (free tier works)

### **Recommended:**
- **VS Code** with TypeScript extension
- **Chrome DevTools** for debugging
- **Postman** for API testing (optional)

## 🚀 Quick Setup

### **1. Clone Repository**
```bash
git clone <repository-url>
cd cmgsite
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Configuration**

Copy the example environment file:
```bash
cp .env.example .env.local
```

Update `.env.local` with your values:
```bash
# ===== REQUIRED CONFIGURATION =====

# Supabase (get from dashboard > Settings > API)
VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Cloudflare Turnstile (get from dashboard > Turnstile)
VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD

# ===== DEVELOPMENT URLS =====
VITE_SITE_URL=http://localhost:5173
VITE_CALLBACK_URL=http://localhost:5173/auth/callback
VITE_ENVIRONMENT=development

# ===== OPTIONAL SERVICES =====
# PayPal (for payment features)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# Resend (for email features)
RESEND_API_KEY=your_resend_key

# Google APIs (for business features)
GOOGLE_CLOUD_API_KEY=your_google_api_key
```

### **4. Database Setup**

Your Supabase database is already configured, but verify it's working:
```bash
npm run test:supabase
```

### **5. Start Development**
```bash
# Start frontend
npm run dev

# Start worker (in another terminal)
npm run worker:dev
```

Visit `http://localhost:5173` to see your app!

## 🧪 Testing Your Setup

### **Run All Tests:**
```bash
npm run test:supabase    # Test database connection
npm run test:roles       # Test role detection
npm run test:routing     # Test SPA routing
```

### **Manual Testing:**
1. **Frontend:** `http://localhost:5173`
2. **Worker API:** `http://localhost:8787`
3. **Auth Flow:** Login with GitHub/Google
4. **Role Detection:** Check if you get superadmin access

## 🔧 Development Commands

### **Frontend Development:**
```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run build:spa        # Build with SPA routing config
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### **Worker Development:**
```bash
npm run worker:dev       # Start local worker
npm run worker:deploy    # Deploy to Cloudflare
```

### **Testing:**
```bash
npm run test:supabase    # Test Supabase connection
npm run test:roles       # Test role detection logic
npm run test:routing     # Test routing locally
```

### **Deployment:**
```bash
npm run deploy:production  # Full production deploy
npm run deploy:staging     # Deploy to staging
```

## 📁 Project Structure

```
cmgsite/
├── src/
│   ├── components/        # Reusable components
│   ├── contexts/         # React contexts
│   ├── lib/              # Core libraries
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main app
├── public/               # Static files
├── supabase/            # Database schema
├── .env.local           # Your environment config
├── vite.config.ts       # Build configuration
└── wrangler.toml        # Worker configuration
```

## 🐛 Troubleshooting

### **Common Issues:**

#### **Port Already in Use:**
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

#### **Node Version Issues:**
```bash
# Check Node version
node --version  # Should be 18+

# Update Node if needed
nvm install 18
nvm use 18
```

#### **Dependencies Issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **TypeScript Errors:**
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Or run with type checking
npm run build
```

### **Environment Issues:**

#### **Missing Supabase Connection:**
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Check Supabase dashboard is accessible
3. Run `npm run test:supabase`

#### **OAuth Not Working Locally:**
1. Update Supabase redirect URLs to include `http://localhost:5173/auth/callback`
2. Check OAuth app settings
3. Ensure localhost is allowed in provider settings

#### **Turnstile Issues:**
1. Get site key from Cloudflare Turnstile dashboard
2. Add localhost to allowed domains
3. Use test keys for development if needed

### **Database Issues:**

#### **Profile Not Created:**
```bash
# Check database schema
npm run test:supabase

# Verify in Supabase dashboard:
# 1. Go to Table Editor
# 2. Check 'profiles' table exists
# 3. Verify triggers are active
```

#### **Role Detection Problems:**
```bash
# Test role logic
npm run test:roles

# Check your user data in Supabase:
# 1. Go to Authentication > Users
# 2. Find your user
# 3. Check user_metadata and app_metadata
```

## 🔄 Development Workflow

### **Daily Development:**
1. `git pull` to get latest changes
2. `npm install` if dependencies changed
3. `npm run dev` to start development
4. Make your changes
5. `npm run test:*` to verify functionality
6. `git commit` and `git push`

### **Before Deploying:**
1. `npm run build` to test production build
2. `npm run test:supabase` to verify database
3. `npm run deploy:staging` for staging test
4. `npm run deploy:production` for production

## 🎯 Ready for Development!

Your environment should now be set up with:
- ✅ React development server running
- ✅ Supabase authentication working
- ✅ Role-based routing functional
- ✅ All tests passing

**Happy coding!** 🚀

## 📞 Need Help?

- Check browser console for errors
- Review Supabase logs for auth issues
- Test individual components with npm scripts
- Verify environment variables are loaded
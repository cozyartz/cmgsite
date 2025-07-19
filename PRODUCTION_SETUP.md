# 🚀 Production Setup Guide - CMGsite

## Overview

This guide covers deploying CMGsite to production with Cloudflare Pages + Workers and Supabase.

## 🎯 Production Architecture

- **Frontend:** Cloudflare Pages (React SPA)
- **Backend API:** Cloudflare Workers
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **CDN:** Cloudflare Global Network
- **Domain:** `cozyartzmedia.com`

## 🔧 Prerequisites

### **Accounts Required:**
- ✅ Cloudflare account with Pages and Workers
- ✅ Supabase account with project `uncynkmprbzgzvonafoe`
- ✅ Domain configured in Cloudflare
- ✅ GitHub/Google OAuth apps configured

### **Local Setup:**
- ✅ Wrangler CLI installed and authenticated
- ✅ Environment variables configured
- ✅ Project builds successfully locally

## 🚀 Deployment Process

### **Quick Deploy (Recommended):**
```bash
cd /Users/cozart-lundin/code/cmgsite
npm run deploy:production
```

This single command:
1. Builds React SPA with routing configuration
2. Deploys Cloudflare Worker with APIs
3. Deploys to Cloudflare Pages
4. Configures SPA routing rules

### **Manual Deploy Steps:**

#### **1. Build for Production:**
```bash
npm run build:spa
```

#### **2. Deploy Worker:**
```bash
npm run deploy:worker
```

#### **3. Deploy Pages:**
```bash
npm run deploy:pages
```

## 🌐 Cloudflare Configuration

### **Pages Settings:**
- **Build Command:** `npm run build:spa`
- **Build Output:** `dist`
- **Root Directory:** `/`
- **Node Version:** `18`

### **Worker Configuration:**
Configured in `wrangler.toml`:
```toml
name = "cmgsite-client-portal"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"

[vars]
ENVIRONMENT = "production"
FRONTEND_BASE_URL = "https://cozyartzmedia.com"
API_BASE_URL = "https://cmgsite-client-portal.cozyartz-media-group.workers.dev"
```

### **Domain Setup:**
- ✅ Primary domain: `cozyartzmedia.com`
- ✅ SSL/TLS: Full (strict)
- ✅ Always Use HTTPS: Enabled
- ✅ HSTS: Enabled

## 🔐 Environment Variables

### **Production Environment (.env.local):**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://uncynkmprbzgzvonafoe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Production URLs
VITE_SITE_URL=https://cozyartzmedia.com
VITE_CALLBACK_URL=https://cozyartzmedia.com/auth/callback
VITE_ENVIRONMENT=production

# Security
VITE_TURNSTILE_SITE_KEY=0x4AAAAAABlo_LdXn1ErLBXD
```

### **Cloudflare Worker Secrets:**
Set via Wrangler CLI:
```bash
# Required secrets
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put JWT_SECRET
wrangler secret put PAYPAL_CLIENT_SECRET
wrangler secret put RESEND_API_KEY

# OAuth secrets
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put GOOGLE_CLIENT_SECRET
```

## 🗄️ Database Configuration

### **Supabase Production Setup:**
- ✅ Project: `uncynkmprbzgzvonafoe`
- ✅ Schema: Deployed and configured
- ✅ RLS Policies: Active
- ✅ OAuth Providers: GitHub & Google configured
- ✅ Site URL: `https://cozyartzmedia.com`
- ✅ Redirect URLs: `https://cozyartzmedia.com/auth/callback`

### **OAuth Provider Configuration:**

#### **GitHub OAuth App:**
- **Application Name:** Cozyartz Media Group
- **Homepage URL:** `https://cozyartzmedia.com`
- **Authorization Callback URL:** `https://uncynkmprbzgzvonafoe.supabase.co/auth/v1/callback`

#### **Google OAuth App:**
- **Application Name:** Cozyartz Media Group
- **Authorized JavaScript Origins:** `https://cozyartzmedia.com`
- **Authorized Redirect URIs:** `https://uncynkmprbzgzvonafoe.supabase.co/auth/v1/callback`

## 🔍 Post-Deployment Testing

### **1. Routing Tests:**
```bash
# Test main routes
curl -I https://cozyartzmedia.com/
curl -I https://cozyartzmedia.com/auth
curl -I https://cozyartzmedia.com/client-portal
curl -I https://cozyartzmedia.com/superadmin

# All should return 200 OK
```

### **2. Authentication Flow:**
1. Visit `https://cozyartzmedia.com/auth`
2. Login with GitHub (`cozyartz`) or Gmail (`cozy2963@gmail.com`)
3. Should redirect to `/superadmin` with admin access
4. Test with other accounts → should redirect to `/client-portal`

### **3. API Endpoints:**
```bash
# Test worker API
curl https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/health

# Should return JSON with status
```

### **4. Security Headers:**
Check with [SecurityHeaders.com](https://securityheaders.com/?q=cozyartzmedia.com):
- ✅ HTTPS enforcement
- ✅ HSTS headers
- ✅ Content Security Policy
- ✅ X-Frame-Options

## 📊 Monitoring & Maintenance

### **Cloudflare Analytics:**
- Monitor page views and performance
- Track API requests and errors
- Review security events

### **Supabase Monitoring:**
- Check authentication metrics
- Monitor database performance
- Review RLS policy usage

### **Error Tracking:**
- Cloudflare Worker logs
- Browser console errors
- Supabase auth logs

## 🚨 Troubleshooting Production

### **Common Issues:**

#### **404 on SPA Routes:**
1. Verify `_routes` and `_redirects` files in deployment
2. Check Cloudflare Pages build output
3. Ensure SPA routing is configured

**Fix:**
```bash
# Redeploy with routing config
npm run deploy:production
```

#### **Authentication Failures:**
1. Check Supabase site URL and redirect URLs
2. Verify OAuth provider configuration
3. Check environment variables

**Debug:**
```bash
# Test auth configuration
npm run test:supabase
npm run test:roles
```

#### **API Errors:**
1. Check Cloudflare Worker logs
2. Verify environment variables and secrets
3. Test worker endpoints directly

#### **SSL/TLS Issues:**
1. Verify Cloudflare SSL mode is "Full (strict)"
2. Check certificate status
3. Clear Cloudflare cache

### **Performance Issues:**

#### **Slow Page Loads:**
1. Check Cloudflare cache settings
2. Optimize image assets
3. Review bundle size

#### **Worker Timeouts:**
1. Optimize database queries
2. Implement request caching
3. Review CPU usage

## 🔄 Deployment Checklist

### **Pre-Deployment:**
- [ ] All tests pass locally
- [ ] Environment variables updated
- [ ] Database schema current
- [ ] OAuth providers configured
- [ ] Build completes successfully

### **Deployment:**
- [ ] Worker deployed without errors
- [ ] Pages deployment successful
- [ ] DNS/domain configured
- [ ] SSL certificate active

### **Post-Deployment:**
- [ ] All routes respond correctly
- [ ] Authentication flow works
- [ ] Role-based redirects function
- [ ] API endpoints accessible
- [ ] Security headers present
- [ ] Performance acceptable

## 📈 Performance Optimizations

### **Already Implemented:**
- ✅ Cloudflare global CDN
- ✅ React code splitting
- ✅ Image optimization
- ✅ Asset caching
- ✅ Gzip compression

### **Future Improvements:**
- WebP image conversion
- Service worker for offline support
- Database query optimization
- API response caching

## 🎯 Production Status

### **Current Deployment:**
- ✅ **Frontend:** Deployed to Cloudflare Pages
- ✅ **Backend:** Worker deployed and functional
- ✅ **Database:** Supabase production ready
- ✅ **Authentication:** OAuth configured and working
- ✅ **Domain:** SSL enabled and secure
- ✅ **Monitoring:** Analytics and logging active

### **URLs:**
- **Main Site:** https://cozyartzmedia.com
- **Auth:** https://cozyartzmedia.com/auth
- **Client Portal:** https://cozyartzmedia.com/client-portal
- **Superadmin:** https://cozyartzmedia.com/superadmin
- **API:** https://cmgsite-client-portal.cozyartz-media-group.workers.dev

**✅ Production deployment complete and operational!** 🚀

## 📞 Support

For production issues:
1. Check Cloudflare dashboard for errors
2. Review Supabase logs for auth issues
3. Monitor Worker performance metrics
4. Test authentication flow manually

**System is production-ready and performing well!** 🎉
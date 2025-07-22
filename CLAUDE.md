# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### Worker Development
- `npm run worker:dev` - Start local worker development server on port 8787
- `npm run worker:deploy` - Deploy worker to production
- `npm run worker:deploy:staging` - Deploy worker to staging environment
- `npm run worker:deploy:dev` - Deploy worker to development environment

### Deployment Commands
- `npm run deploy:production` - Build and deploy both worker and pages to production
- `npm run deploy:staging` - Build and deploy both worker and pages to staging
- `npm run deploy` - Full production deployment (worker + pages)
- `npm run deploy:worker` - Deploy only worker to production
- `npm run deploy:pages` - Deploy only pages to production

### Project Setup
- `npm install` - Install dependencies
- Copy `.env.example` to `.env.local` and configure environment variables
- Dependencies are managed with npm (package-lock.json present)

## Architecture Overview

### Technology Stack
- **Frontend**: React 18.3.1 with TypeScript
- **Backend**: Cloudflare Worker with environment-aware configuration
- **Build Tool**: Vite with React plugin
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React
- **SEO**: react-helmet-async for metadata management
- **Authentication**: JWT with OAuth (GitHub/Google)
- **Environment Management**: Centralized configuration system

### Project Structure
```
src/
├── App.tsx                    # Main application component
├── components/                # React components
│   ├── auth/                 # Authentication components
│   │   ├── OAuthProvider.tsx # Reusable OAuth button component
│   │   └── OAuthCallback.tsx # OAuth callback handler
│   ├── [other components]/   # Organized by feature
│   └── SEO.tsx              # Comprehensive SEO/metadata component
├── config/
│   └── environment.ts        # Environment configuration management
├── contexts/
│   └── AuthContext.tsx      # Authentication state management
├── hooks/
│   └── useOAuth.ts          # OAuth hooks and utilities
├── lib/
│   ├── api.ts               # Centralized API client with retry logic
│   └── urls.ts              # URL building and routing management
├── pages/                   # Page components
│   ├── AuthSimple.tsx       # Authentication page
│   ├── ClientPortalSimple.tsx # Client dashboard
│   └── SuperAdminDashboard.tsx # Admin interface
├── index.css               # Global styles and Tailwind imports
└── main.tsx                # React app entry point
worker.js                   # Environment-aware Cloudflare Worker
wrangler.toml              # Cloudflare configuration with environments
docs/
└── OAUTH_SETUP.md         # OAuth configuration guide
```

### Component Architecture
- **Environment-aware configuration** - Centralized config management for all environments
- **Reusable components** - OAuth providers, API client, URL builders for DRY principle
- **TypeScript-first** - Full type safety with interfaces and error handling
- **Hook-based state management** - Custom hooks for OAuth, API calls, and configuration
- **Clean separation of concerns** - Distinct layers for UI, business logic, and data

### Key Architectural Features
- **No hardcoded URLs** - All URLs generated from environment configuration
- **Centralized API client** - Retry logic, token management, error handling
- **Environment-specific deployment** - Separate configs for dev/staging/production
- **OAuth component system** - Reusable authentication flows
- **Comprehensive error handling** - Type-safe error management throughout

### Styling System
- **Tailwind CSS** utility-first approach
- **Design tokens**: Primary teal colors (teal-500, teal-600), slate grays
- **Responsive design**: Mobile-first with md:, lg: breakpoints
- **Animation patterns**: CSS transitions, transform animations, staggered delays

### SEO Implementation
- **Comprehensive SEO component** with structured data (Schema.org)
- **Social media meta tags** (Open Graph, Twitter Cards)
- **Business schema markup** for local SEO
- **Performance optimizations** (preconnect, dns-prefetch)

## Development Patterns

### Environment Management
- Use `src/config/environment.ts` for all environment-specific configuration
- Set environment via `VITE_ENVIRONMENT` in `.env.local` 
- All URLs built using `src/lib/urls.ts` utilities
- Never hardcode URLs - always use environment-aware builders

### API Development
- Use `src/lib/api.ts` for all HTTP requests
- Implement proper error handling with typed error classes
- All endpoints configured in `src/lib/urls.ts` 
- Use the `apiService` singleton for consistent API calls

### OAuth Development
- Use `src/components/auth/OAuthProvider.tsx` for OAuth buttons
- Implement OAuth flows with `src/hooks/useOAuth.ts`
- All OAuth URLs generated from environment configuration
- Follow OAuth setup guide in `docs/OAUTH_SETUP.md`

### Component Creation
- Follow functional component pattern with TypeScript
- Use centralized configuration via `src/config/environment.ts`
- Implement error boundaries and proper error handling
- Use hooks for state management and side effects

## Deployment Information

### Current Production URLs
- **Main Domain**: https://cozyartzmedia.com (production frontend)
- **Backend API (Cloudflare Worker)**: https://cmgsite-client-portal.cozyartz-media-group.workers.dev
- **Latest Pages Deployment**: Automatically updated via environment variables

### Environment Configuration
- **Production**: Uses `cozyartzmedia.com` domain
- **Staging**: Uses `staging.cmgsite.pages.dev` domain  
- **Development**: Uses `localhost:5173` and `localhost:8787`

### OAuth Configuration (Production)
- **GitHub OAuth Redirect URI**: https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/github/callback
- **Google OAuth Redirect URI**: https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/google/callback
- **Authentication Success Redirect**: https://cozyartzmedia.com/auth
- **OAuth Setup**: See `docs/OAUTH_SETUP.md` for complete configuration guide

### Required Secrets (Wrangler)
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials  
- `JWT_SECRET` - JWT token signing key
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` - PayPal payment processing
- `SQUARE_ACCESS_TOKEN` / `SQUARE_APPLICATION_ID` / `SQUARE_LOCATION_ID` - Square payments

## Email Configuration

### Comprehensive Email Setup Documentation
See `EMAIL_CONFIGURATION.md` for complete email infrastructure documentation including:
- AWS SES configuration for all domains (cozyartz.com, zserved.com, astrolms.com)
- DNS records and authentication (SPF, DKIM, DMARC)
- Subdomain strategy for transactional vs business emails
- Microsoft 365 integration for zserved.com
- Troubleshooting guides and maintenance procedures

### Email Infrastructure Overview
- **Business Emails**: cozyartz.com (AWS SES), zserved.com (Microsoft 365)
- **Transactional**: transaction.cozyartz.com, transaction.zserved.com, transactions.astrolms.com
- **Authentication**: Full SPF/DKIM/DMARC implementation across all domains
- **Deliverability**: Optimized subdomain separation for different email types

### Business Context
- **Cozyartz Media Group** - Creative agency specializing in web design, multimedia production
- **Founded**: 2016
- **Services**: Web design, graphic design, instructional design, video production, aerial photography
- **Contact**: 269.261.0069, hello@cozyartzmedia.com, Kalamazoo, MI
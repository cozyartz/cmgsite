# OAuth Setup Guide

This guide explains how to properly configure OAuth for the cmgsite project.

## Overview

The OAuth flow works as follows:
1. **User clicks OAuth button** → Redirects to OAuth provider (GitHub/Google)
2. **OAuth provider** → Redirects to worker callback URL with authorization code
3. **Worker callback** → Exchanges code for tokens, creates JWT, redirects to frontend
4. **Frontend** → Receives JWT token and authenticates user

## Google OAuth Configuration

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable the Google+ API (if not already enabled)
4. Go to **APIs & Services** → **Credentials**

### 2. OAuth 2.0 Client Configuration

**Application Type:** Web application

**Authorized JavaScript Origins:**
```
https://cozyartzmedia.com
https://cmgsite-client-portal.cozyartz-media-group.workers.dev
```

**Authorized Redirect URIs:**
```
https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/google/callback
```

### 3. Domain Verification

To remove the "unverified app" warning and show cozyartzmedia.com in the consent screen:

1. Go to **APIs & Services** → **Domain verification**
2. Add and verify `cozyartzmedia.com`
3. Follow Google's domain verification process
4. In **OAuth consent screen**, set:
   - **Application domain:** `cozyartzmedia.com`
   - **Authorized domains:** `cozyartzmedia.com`

## GitHub OAuth Configuration

### 1. GitHub App Settings

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create or edit your OAuth App

**Application Name:** Cozyartz Media Group Client Portal

**Homepage URL:** `https://cozyartzmedia.com`

**Authorization callback URL:**
```
https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/github/callback
```

## Environment Variables

### Cloudflare Worker Secrets

Set these using `wrangler secret put <SECRET_NAME>`:

```bash
# GitHub OAuth
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET

# Google OAuth  
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET

# JWT signing
wrangler secret put JWT_SECRET
```

### Worker Environment Variables (wrangler.toml)

Production configuration:
```toml
[vars]
ENVIRONMENT = "production"
FRONTEND_BASE_URL = "https://cozyartzmedia.com"
FRONTEND_AUTH_URL = "https://cozyartzmedia.com/auth"
FRONTEND_CLIENT_PORTAL_URL = "https://cozyartzmedia.com/client-portal"
FRONTEND_ADMIN_URL = "https://cozyartzmedia.com/admin"
FRONTEND_SUPERADMIN_URL = "https://cozyartzmedia.com/superadmin"
API_BASE_URL = "https://cmgsite-client-portal.cozyartz-media-group.workers.dev"
GITHUB_REDIRECT_URI = "https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/github/callback"
GOOGLE_REDIRECT_URI = "https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/google/callback"
DEBUG_MODE = "false"
ENABLE_DEBUG_ENDPOINT = "false"
```

## OAuth Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Cloudflare     │    │   OAuth         │
│ cozyartzmedia   │    │   Worker         │    │   Provider      │
│    .com         │    │                  │    │ (GitHub/Google) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Click OAuth       │                       │
         │ ─────────────────────→│                       │
         │                       │ 2. Redirect to OAuth │
         │                       │ ─────────────────────→│
         │                       │                       │
         │                       │ 3. Auth + callback   │
         │                       │ ←─────────────────────│
         │                       │                       │
         │ 4. Success redirect   │                       │
         │ ←─────────────────────│                       │
         │   with JWT token      │                       │
```

## Domain Configuration

### Primary Domain: cozyartzmedia.com

This should:
- Be configured in Cloudflare DNS
- Point to the Cloudflare Pages deployment
- Be verified in Google Cloud Console
- Appear in OAuth consent screens

### Worker Domain: cmgsite-client-portal.cozyartz-media-group.workers.dev

This should:
- Handle API endpoints and OAuth callbacks
- Not appear in user-facing consent screens (after domain verification)
- Be configured as an authorized origin for development/testing

### Pages Deployment: *.cmgsite.pages.dev

These are:
- Temporary deployment URLs
- Used for testing and staging
- Should not be used in production OAuth configuration

## Security Considerations

1. **Domain Verification:** Always verify your primary domain with OAuth providers
2. **HTTPS Only:** All OAuth URLs must use HTTPS
3. **Exact URL Matching:** OAuth providers require exact URL matches
4. **Token Security:** Store JWT secrets securely using Wrangler secrets
5. **Environment Separation:** Use different OAuth apps for staging/production

## Troubleshooting

### "Unverified App" Warning
- Verify your domain in Google Cloud Console
- Add domain to OAuth consent screen configuration

### "Redirect URI Mismatch"
- Check exact URL matching in OAuth provider settings
- Ensure URLs use HTTPS
- Verify worker deployment URLs

### Console Security Warning
The "Self-XSS" warning in browser console is normal browser security behavior and doesn't indicate a problem with the application.

## Testing OAuth

### Development
```bash
npm run dev
# Uses localhost URLs for testing
```

### Staging
```bash
npm run deploy:staging
# Uses staging.cmgsite.pages.dev URLs
```

### Production
```bash
npm run deploy:production
# Uses cozyartzmedia.com URLs
```
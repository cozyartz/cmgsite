# Cloudflare Turnstile Setup Guide

## 🛡️ What is Cloudflare Turnstile?

Cloudflare Turnstile is a **modern, privacy-first CAPTCHA alternative** that:
- **Free** for unlimited requests
- **No user interaction** required (invisible challenges)
- **Privacy-focused** - no tracking or cookies
- **Faster** than traditional CAPTCHAs
- **Already integrated** with your Cloudflare infrastructure

## 🚀 Setup Instructions

### Step 1: Create Turnstile Site

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Turnstile** in the sidebar
3. Click **"Add site"**
4. Configure:
   - **Site name**: `Cozyartz Media Group - Auth`
   - **Domain**: 
     - `cozyartzmedia.com`
     - `localhost` (for development)
   - **Widget Mode**: `Managed` (recommended)
   - **Widget Type**: `Non-interactive` (best user experience)

### Step 2: Get Your Keys

After creating the site, you'll receive:
- **Site Key**: Public key for frontend (starts with `0x...`)
- **Secret Key**: Private key for backend verification

### Step 3: Update Environment Variables

Add to your `.env` file:
```env
# Cloudflare Turnstile
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAA... (your site key)
TURNSTILE_SECRET_KEY=0x4AAAAAAA... (your secret key)
```

### Step 4: Configure Worker (Backend Verification)

The Turnstile token needs to be verified on the backend. Add this to your worker:

```javascript
// worker.js - Add to your auth endpoints
async function verifyTurnstile(token, ip) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip // Optional
    }),
  });

  const data = await response.json();
  return data.success;
}

// In your login/signup endpoint
if (request.method === 'POST') {
  const { email, password, turnstileToken } = await request.json();
  
  // Verify Turnstile token
  const isHuman = await verifyTurnstile(turnstileToken, request.headers.get('CF-Connecting-IP'));
  
  if (!isHuman) {
    return new Response(JSON.stringify({ error: 'Bot detection failed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Continue with authentication...
}
```

### Step 5: Update Wrangler Secrets

Add the secret key to your Worker:
```bash
wrangler secret put TURNSTILE_SECRET_KEY
# Paste your secret key when prompted
```

## 🎨 Customization Options

### Widget Appearance
- **Theme**: `auto` (adapts to light/dark mode)
- **Size**: `normal` or `compact`
- **Language**: Auto-detects from browser

### Advanced Features
- **Action**: Different challenge types (`login`, `signup`, `submit`)
- **cData**: Custom data for analytics
- **Retry**: Auto-retry on failure

## 🧪 Testing

### Development Testing
1. Use the **test keys** for localhost:
   - Site Key: `1x00000000000000000000AA`
   - Secret Key: `1x0000000000000000000000000000000AA`
   - Always passes validation

2. Visit `http://localhost:5173/auth`
3. The Turnstile widget should appear below the password field
4. Green checkmark appears when verified

### Production Testing
1. Deploy with real keys
2. Test on `https://cozyartzmedia.com/auth`
3. Monitor Turnstile analytics in Cloudflare Dashboard

## 📊 Analytics & Monitoring

In Cloudflare Dashboard → Turnstile:
- **Challenge solve rate**
- **Widget impressions**
- **Top challenge types**
- **Geographic distribution**

## 🔒 Security Benefits

1. **Bot Protection**: Blocks automated attacks
2. **Credential Stuffing**: Prevents password spray attacks
3. **Account Takeover**: Reduces ATO attempts
4. **API Abuse**: Protects your backend resources
5. **Privacy Compliant**: GDPR/CCPA friendly

## 🚨 Troubleshooting

### Widget Not Showing
- Check browser console for errors
- Verify site key is correct
- Ensure domain is added to Turnstile site

### Verification Failing
- Check secret key in Worker
- Verify token is being sent in request
- Check Turnstile analytics for errors

### Development Issues
- Use test keys for localhost
- Add `localhost` to allowed domains
- Check CORS settings

## 🎯 Current Implementation

The Turnstile widget is now integrated into:
- ✅ `/auth` - Login and signup forms
- ✅ Email/password authentication required
- ✅ Visual feedback with green checkmark
- ✅ Error handling for failed challenges
- ✅ Token expiration handling

OAuth providers (GitHub/Google) don't need Turnstile as they have their own bot protection.
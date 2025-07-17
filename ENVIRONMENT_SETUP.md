# 🔧 Environment Setup Guide

Quick setup guide for your Cloudflare Registrar integration.

## 📋 **Required Setup Steps**

### **1. Copy Environment File**
```bash
cp .env.example .env
```

### **2. Fill in REQUIRED Values**

**Cloudflare API (Required):**
```bash
# Get from: https://dash.cloudflare.com/profile/api-tokens
CLOUDFLARE_API_TOKEN=your_token_here

# Get from any domain's sidebar in Cloudflare dashboard  
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
```

**Email Service (Required):**
```bash
# Get from: https://resend.com/api-keys
RESEND_API_KEY=re_your_key_here
```

**PayPal (Required):**
```bash
# Already provided
PAYPAL_CLIENT_ID=AQMzbwCSEUPkjLW8Ff7YarfVmRec3633qRlyvB2mCN_eX4W3-dAdtBZ_UPkINI6WtXaJ2WwLmcIGxuaF

# Get from PayPal Developer Dashboard
PAYPAL_CLIENT_SECRET=your_secret_here
```

**Security (Required):**
```bash
# Generate secure random strings (32+ characters each)
JWT_SECRET=your_secure_random_string_here
ENCRYPTION_KEY=another_secure_random_string_here
```

### **3. Deploy to Cloudflare Workers**
```bash
# Add secrets to Cloudflare Workers
wrangler secret put CLOUDFLARE_API_TOKEN
wrangler secret put CLOUDFLARE_ACCOUNT_ID
wrangler secret put RESEND_API_KEY
wrangler secret put PAYPAL_CLIENT_SECRET
wrangler secret put JWT_SECRET
wrangler secret put ENCRYPTION_KEY

# Deploy the worker
wrangler deploy
```

### **4. Apply Database Migration**
```bash
# Create the domain management tables
wrangler d1 execute DB --file migrations/006_add_domain_management.sql
```

## ✅ **Verification**

Test your setup:
1. Visit your domain search page
2. Try searching for a domain
3. Check the revenue dashboard
4. Test email notifications

## 🔒 **Security Notes**

- Never commit `.env` to git (it's already in `.gitignore`)
- Keep API tokens secure and rotate them regularly
- Use strong, unique values for JWT_SECRET and ENCRYPTION_KEY

## 📞 **Support**

If you need help:
- Check Cloudflare API permissions
- Verify all required environment variables are set
- Review worker deployment logs
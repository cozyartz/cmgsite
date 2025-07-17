# Production Setup Guide for SEO Client Portal

## Square Payment Integration - Final Setup

Your Square payment integration is now configured for production with location ID `LPM1GX56NW50D`. Here's what you need to do next:

### 1. Create Square Developer Application

1. Go to [Square Developer Portal](https://developer.squareup.com/)
2. Sign in with your existing Square account
3. Click "Create an App"
4. Choose "Build for yourself" (since this is for your own business)
5. Name your app: "CMG SEO Client Portal"
6. Select "General use" as the app type
7. Click "Create App"

### 2. Get Your Production Credentials

After creating your app:

1. Navigate to the "Credentials" tab
2. Click on "Production" tab
3. Copy these values:
   - **Application ID**: `sq0idb-[your-app-id]` (starts with sq0idb-)
   - **Access Token**: `EAAA[your-access-token]` (starts with EAAA)
   - **Location ID**: Use `LPM1GX56NW50D` (your Online location)

### 3. Configure Cloudflare Worker Secrets

Run these commands to securely store your Square credentials:

```bash
cd /Users/cozart-lundin/code/cmgsite

# Set Square production credentials
wrangler secret put SQUARE_ACCESS_TOKEN
# Enter your production access token when prompted

wrangler secret put SQUARE_APPLICATION_ID
# Enter your production application ID when prompted

wrangler secret put SQUARE_LOCATION_ID
# Enter: LPM1GX56NW50D

# Set other required secrets
wrangler secret put JWT_SECRET
# Enter a secure random string (e.g., 64 characters)

wrangler secret put GITHUB_CLIENT_ID
# Enter your GitHub OAuth app client ID (if using GitHub login)

wrangler secret put GITHUB_CLIENT_SECRET
# Enter your GitHub OAuth app client secret
```

### 4. Update Environment Variables

Create a `.env` file for local development:

```bash
# .env (for local development only)
SQUARE_ACCESS_TOKEN=your_production_access_token
SQUARE_APPLICATION_ID=your_production_app_id
SQUARE_LOCATION_ID=LPM1GX56NW50D
```

### 5. Deploy to Production

```bash
# Deploy the worker
wrangler deploy

# Create the D1 database
wrangler d1 create cmgsite-client-portal-db

# Update wrangler.toml with the database ID returned above
# Then run the schema migration
wrangler d1 execute cmgsite-client-portal-db --file migrations/001_initial_schema.sql

# Create R2 bucket for file storage
wrangler r2 bucket create cmgsite-client-portal-files

# Create KV namespace for sessions
wrangler kv:namespace create "SESSIONS"
```

### 6. Test Payment Processing

After deployment, test the payment flow:

1. **Test Card Numbers** (use these in production for testing):
   - Visa: `4111 1111 1111 1111`
   - Any future expiration date
   - Any 3-digit CVV
   - Any postal code

2. **Test Subscription Flow**:
   - Create account in client portal
   - Navigate to billing section
   - Try upgrading to Growth plan ($1,500/month)
   - Complete payment process

3. **Test Consultation Booking**:
   - Book a strategic consultation ($250/hour)
   - Verify payment processing
   - Check database for payment records

### 7. Configure Your Current Square Settings

Since you're using location ID `LPM1GX56NW50D`, make sure this location is properly configured in your Square Dashboard:

1. Go to [Square Dashboard](https://squareup.com/dashboard)
2. Navigate to "Account & Settings" → "Locations"
3. Find your "Online" location
4. Verify it's set up for online payments
5. Enable "Accept online payments" if not already enabled

### 8. Pricing Configuration

Your portal is configured with these rates:

**Monthly Subscriptions:**
- Starter: $1,000/month (100 AI calls)
- Growth: $1,500/month (250 AI calls)
- Enterprise: $2,500/month (500 AI calls)

**AI Overage:**
- $0.50 per additional AI call

**Consultation Rates:**
- Strategic Advisory: $250/hour
- Partnership Development: $500/hour
- Implementation Support: $150/hour

### 9. Domain Configuration

Update your domain settings:

1. Point your domain to Cloudflare Pages
2. Add custom domain in Cloudflare Pages dashboard
3. Update CORS settings if needed for your domain

### 10. Security Checklist

- [ ] All secrets are stored in Cloudflare Workers (not in code)
- [ ] JWT_SECRET is a secure random string
- [ ] Production Square credentials are configured
- [ ] HTTPS is enforced for all payment pages
- [ ] Test payment processing thoroughly
- [ ] Monitor error logs after deployment

### 11. Go Live

Once everything is tested:

1. Update your website to link to the client portal
2. Send onboarding instructions to existing clients
3. Monitor payment processing and usage
4. Set up alerts for failed payments or system errors

## Support

If you encounter issues:

1. Check Cloudflare Workers logs: `wrangler tail`
2. Verify Square credentials in developer dashboard
3. Test with Square's test card numbers first
4. Check database connections and migrations

Your client portal is now ready for production with enterprise-grade payment processing!
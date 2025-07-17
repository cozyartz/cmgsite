# Square Payment Integration Setup Guide

This guide walks you through setting up Square payments for your client portal.

## 1. Create Square Developer Account

1. Go to [Square Developer Portal](https://developer.squareup.com/)
2. Sign up or log in with your Square account
3. Create a new application for your client portal

## 2. Get Square Credentials

### Sandbox (Development)
1. In your Square Developer Dashboard, go to your application
2. Navigate to "Credentials" → "Sandbox"
3. Copy the following values:
   - **Application ID**: `sandbox-sq0idb-xxxxx`
   - **Access Token**: `EAAAE***`
   - **Location ID**: `LH***`

### Production
1. In your Square Developer Dashboard, go to your application
2. Navigate to "Credentials" → "Production"
3. Copy the following values:
   - **Application ID**: `sq0idb-xxxxx`
   - **Access Token**: `EAAAE***`
   - **Location ID**: `LH***`

## 3. Configure Cloudflare Secrets

Set up your Square credentials as Cloudflare Workers secrets:

```bash
# For Sandbox/Development
wrangler secret put SQUARE_ACCESS_TOKEN
# Enter your sandbox access token

wrangler secret put SQUARE_APPLICATION_ID
# Enter your sandbox application ID

wrangler secret put SQUARE_LOCATION_ID
# Enter your sandbox location ID

# For Production
wrangler secret put SQUARE_ACCESS_TOKEN
# Enter your production access token

wrangler secret put SQUARE_APPLICATION_ID
# Enter your production application ID

wrangler secret put SQUARE_LOCATION_ID
# Enter your production location ID
```

## 4. Update Square Payment Component

Update the Square application ID in your payment component:

```typescript
// src/components/payment/SquarePayment.tsx
const payments = window.Square.payments('YOUR_APPLICATION_ID_HERE', 'YOUR_LOCATION_ID_HERE');
```

For development, use sandbox credentials:
```typescript
const payments = window.Square.payments('sandbox-sq0idb-YOUR_APP_ID', 'YOUR_LOCATION_ID');
```

For production, use production credentials:
```typescript
const payments = window.Square.payments('sq0idb-YOUR_APP_ID', 'YOUR_LOCATION_ID');
```

## 5. Environment Configuration

### Development
- Use `https://sandbox-web.squarecdn.com/v1/square.js` for the Square SDK
- Use `https://connect.squareupsandbox.com/` for API calls
- Use sandbox credentials

### Production
- Use `https://web.squarecdn.com/v1/square.js` for the Square SDK
- Use `https://connect.squareup.com/` for API calls
- Use production credentials

## 6. Test Payment Flow

### Test Cards for Sandbox
Use these test card numbers in sandbox:

**Successful Payments:**
- Visa: `4111 1111 1111 1111`
- MasterCard: `5555 5555 5555 4444`
- Discover: `6011 1111 1111 1117`
- American Express: `3782 8224 6310 005`

**Failed Payments:**
- Declined: `4000 0000 0000 0002`
- Insufficient Funds: `4000 0000 0000 9995`
- Invalid CVV: `4000 0000 0000 0127`

**Test Details:**
- Any future expiration date
- Any 3-digit CVV (4 digits for Amex)
- Any postal code

## 7. Webhook Configuration (Optional)

For advanced payment tracking, set up webhooks:

1. In Square Developer Dashboard, go to "Webhooks"
2. Add webhook endpoint: `https://your-domain.com/api/webhooks/square`
3. Subscribe to these events:
   - `payment.created`
   - `payment.updated`
   - `refund.created`
   - `refund.updated`

## 8. Security Best Practices

### PCI Compliance
- Never store card data in your database
- Use Square's tokenization for card processing
- Ensure HTTPS for all payment pages

### Environment Variables
```bash
# Never commit these to version control
SQUARE_ACCESS_TOKEN=your_access_token_here
SQUARE_APPLICATION_ID=your_app_id_here
SQUARE_LOCATION_ID=your_location_id_here
```

### Worker Environment
```toml
# wrangler.toml
[env.production]
[env.production.vars]
SQUARE_ENVIRONMENT = "production"

[env.development]
[env.development.vars]
SQUARE_ENVIRONMENT = "sandbox"
```

## 9. Pricing Structure Implementation

### Subscription Plans
- **Starter**: $1,000/month
- **Growth**: $1,500/month
- **Enterprise**: $2,500/month

### AI Overage
- $0.50 per additional AI call

### Consultation Rates
- **Strategic Advisory**: $250/hour
- **Partnership Development**: $500/hour
- **Implementation Support**: $150/hour

### Discounts
- Growth plan: 10% off consultations
- Enterprise plan: 20% off consultations

## 10. Testing Checklist

### Payment Flow Testing
- [ ] Subscription payments work correctly
- [ ] Consultation payments process successfully
- [ ] Failed payments show proper error messages
- [ ] Invoice generation works after payment
- [ ] Database records are created properly

### Integration Testing
- [ ] Square SDK loads correctly
- [ ] Card tokenization works
- [ ] Payment processing completes
- [ ] Webhook handling (if implemented)
- [ ] Error handling for failed payments

### Security Testing
- [ ] API tokens are properly secured
- [ ] Card data is never stored
- [ ] HTTPS is enforced
- [ ] PCI compliance maintained

## 11. Go Live Checklist

### Pre-Production
- [ ] Switch to production Square credentials
- [ ] Update Square SDK to production URL
- [ ] Test with real payment methods
- [ ] Verify webhook endpoints
- [ ] Set up monitoring and alerting

### Production Deployment
- [ ] Deploy to production environment
- [ ] Monitor payment processing
- [ ] Set up customer support for payment issues
- [ ] Document payment procedures for team

## 12. Support and Documentation

### Square Resources
- [Square Developer Documentation](https://developer.squareup.com/docs)
- [Square Community Forum](https://community.squareup.com/)
- [Square Support](https://squareup.com/help)

### Client Portal Integration
- Payment processing is integrated into the billing dashboard
- Subscription management handles recurring payments
- Consultation booking includes payment processing
- Invoice generation is automated after payment

---

This Square integration provides a complete payment solution for your client portal, handling both subscription billing and one-time consultation payments with enterprise-grade security and reliability.
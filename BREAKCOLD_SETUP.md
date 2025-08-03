# Breakcold CRM Integration Setup Guide

This guide walks you through setting up the complete Breakcold CRM integration with your AI-powered lead generation system.

## 🔧 Environment Variables Configuration

### Required Environment Variables

Add these variables to your Cloudflare Pages environment:

#### Production Environment
```bash
# Breakcold API Configuration
BREAKCOLD_API_KEY=your_api_key_here
BREAKCOLD_WEBHOOK_SECRET=wk_354a4803ba2384
BREAKCOLD_SECRET_STORE_ID=383e46b47c2749a1804ba0c434b80b47
BREAKCOLD_WORKSPACE_ID=your_workspace_id_here

# Optional: JWT Secret for API authentication
JWT_SECRET=your_jwt_secret_here
```

#### Preview/Staging Environment
```bash
# Same as production for testing
BREAKCOLD_API_KEY=your_api_key_here
BREAKCOLD_WEBHOOK_SECRET=wk_354a4803ba2384
BREAKCOLD_SECRET_STORE_ID=383e46b47c2749a1804ba0c434b80b47
BREAKCOLD_WORKSPACE_ID=your_workspace_id_here
JWT_SECRET=your_jwt_secret_here
```

## 📋 Breakcold Webhook Configuration

### 1. Webhook Endpoint Setup

**Current Configuration (from your screenshot):**
- **URL**: `https://cozyartz.pages.dev/api/breakcold/webhook`
- **Secret**: `wk_354a4803ba2384` ✅ Already configured
- **Status**: Active ✅
- **Events**: `lead.create` + 7 additional events ✅

### 2. Supported Webhook Events

Your current webhook is configured to handle:
- `lead.create` - New leads created
- `lead.update` - Lead information updated
- `lead.delete` - Leads deleted
- Additional events (status changes, tag updates, etc.)

### 3. Webhook Payload Format

Breakcold sends webhooks in this format:
```json
{
  "id_space": "your_workspace_id",
  "event": "lead.create",
  "secret": "wk_354a4803ba2384",
  "payload": {
    "id": "lead_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "company": "Acme Corp",
    "status": "New",
    "tags": ["Website Lead"],
    "customAttributes": {
      "leadScore": 75,
      "source": "AI Chatbot"
    }
  }
}
```

## 🔑 API Key Management

### Option 1: Direct Environment Variable
Set `BREAKCOLD_API_KEY` directly in Cloudflare Pages environment variables.

### Option 2: Secret Store (Recommended)
Your API key is stored in secret store ID: `383e46b47c2749a1804ba0c434b80b47`

To implement secret store retrieval:
1. Add secret store integration to your Cloudflare Worker
2. Use the store ID to retrieve the API key at runtime
3. Update the `getBreakcoldApiKey` function in `/functions/api/leads/create.ts`

## 🚀 Deployment Steps

### 1. Configure Cloudflare Pages Environment Variables

In your Cloudflare Dashboard:
1. Go to **Pages** → **cmgsite** → **Settings** → **Environment variables**
2. Add all required variables for **Production** and **Preview** environments
3. Click **Save**

### 2. Deploy the Functions

Your webhook endpoints are ready:
- `/functions/api/breakcold/webhook.ts` - Webhook handler
- `/functions/api/leads/create.ts` - Lead creation API
- `/functions/api/leads/analytics.ts` - Analytics endpoint

### 3. Test the Integration

#### Test Webhook Reception:
```bash
# Check webhook endpoint is responding
curl -X GET https://cozyartz.pages.dev/api/breakcold/webhook
```

#### Test Lead Creation:
```bash
# Create a test lead via API
curl -X POST https://cozyartz.pages.dev/api/leads/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "company": "Test Company",
    "source": "API Test"
  }'
```

## 🔄 AI Chatbot Integration

### Lead Capture Flow

1. **User interacts** with AI chatbot on your website
2. **AI scores** the conversation based on interest indicators
3. **System extracts** contact information and project details
4. **Lead is created** automatically in Breakcold CRM
5. **Webhook confirms** successful creation
6. **Follow-up triggered** based on lead score and status

### Lead Scoring Algorithm

The AI chatbot scores leads based on:
- **Interest indicators** (15-20 points): pricing, quotes, timelines
- **Urgency signals** (20-25 points): ASAP, deadlines, launch dates
- **Engagement depth** (5-15 points): message length, conversation duration
- **Contact sharing** (15-20 points): email, phone number provided

**Qualification threshold**: 30+ points triggers automatic CRM creation

## 📊 Monitoring and Analytics

### Webhook Health Monitoring

Monitor webhook delivery in:
1. **Breakcold Dashboard** - Check webhook status and delivery logs
2. **Cloudflare Functions Logs** - Monitor function execution and errors
3. **Lead Analytics Dashboard** - Track lead generation performance

### Key Metrics to Track

- **Webhook delivery success rate** (should be >95%)
- **Lead creation rate** from AI chatbot
- **Lead qualification percentage**
- **Average lead score** trends
- **Conversion rate** from leads to customers

## 🛠 Troubleshooting

### Common Issues

#### Webhook Not Receiving Events
1. Verify webhook URL: `https://cozyartz.pages.dev/api/breakcold/webhook`
2. Check webhook secret matches: `wk_354a4803ba2384`
3. Ensure environment variables are set correctly
4. Review Cloudflare Functions logs for errors

#### API Key Issues
1. Verify API key is valid in Breakcold dashboard
2. Check secret store ID: `383e46b47c2749a1804ba0c434b80b47`
3. Ensure API key has necessary permissions (lead management)

#### Lead Creation Failures
1. Check JWT authentication is working
2. Verify required fields are present (email is mandatory)
3. Review API rate limits and quotas
4. Check Breakcold API status

### Debug Commands

```bash
# Check environment variables
wrangler pages secret list --project-name=cmgsite

# View function logs
wrangler pages deployment tail --project-name=cmgsite

# Test webhook endpoint
curl -X GET https://cozyartz.pages.dev/api/breakcold/webhook
```

## ✅ Verification Checklist

- [ ] Environment variables configured in Cloudflare Pages
- [ ] Webhook endpoint active in Breakcold (`wk_354a4803ba2384`)
- [ ] API key accessible (direct or via secret store)
- [ ] Webhook receiving and processing events correctly
- [ ] AI chatbot creating leads in Breakcold CRM
- [ ] Lead scoring and qualification working
- [ ] Analytics and monitoring set up

## 🎯 Next Steps

Once the integration is working:

1. **Customize lead scoring** rules based on your business needs
2. **Set up automated follow-up** sequences for qualified leads
3. **Configure team notifications** for high-value leads
4. **Add lead source tracking** across different marketing channels
5. **Implement advanced analytics** and reporting dashboards

Your Breakcold CRM integration is now ready to capture and qualify leads automatically through your AI-powered website chatbot! 🚀
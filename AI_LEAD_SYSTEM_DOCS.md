# AI-Powered Lead Generation System Documentation

## Overview

This document provides complete operational guidance for the AI-powered lead generation and CRM integration system deployed on **cmgsite.pages.dev**. The system automatically captures, qualifies, and routes leads from website visitors directly into your Breakcold CRM.

## 🎯 System Architecture

### Core Components

1. **AI Chatbot Assistant** - Context-aware conversational AI
2. **Lead Scoring Engine** - Real-time qualification algorithm  
3. **Breakcold CRM Integration** - Automatic lead creation and sync
4. **Cloudflare Functions** - Serverless backend processing
5. **Analytics Dashboard** - Performance monitoring and insights

### Technology Stack

- **Frontend**: React + TypeScript with Tailwind CSS
- **Backend**: Cloudflare Pages Functions (Serverless)
- **AI Processing**: Custom lead scoring algorithms
- **CRM**: Breakcold API v3 integration
- **Authentication**: JWT with webhook security
- **Hosting**: Cloudflare Pages with edge computing

---

## 🤖 AI Chatbot Assistant

### What It Does

The AI assistant appears as a floating chat bubble on your website and:
- **Engages visitors** with contextual conversations
- **Scores interactions** based on buying intent
- **Extracts contact information** automatically
- **Creates leads** in Breakcold CRM instantly
- **Provides 24/7 availability** for lead capture

### How to Use

#### For Website Visitors
1. **Chat bubble appears** in bottom-right corner
2. **Click to start** conversation
3. **AI responds** based on their intent (sales, support, etc.)
4. **Information captured** automatically during natural conversation
5. **Lead created** when qualification threshold reached

#### For Your Team
1. **Monitor conversations** in Breakcold CRM
2. **Review lead scores** and qualification status
3. **Follow up** with qualified leads automatically
4. **Track conversion** from chat to customer

### AI Contexts Available

The chatbot operates in different modes:

#### **Sales Context** (`context="sales"`)
```javascript
// Usage in code
<AIAssistant context="sales" enableLeadCapture={true} />
```
- Focuses on **service inquiries** and **project discussions**
- **Higher lead scoring** for commercial intent
- **Quick actions**: Web Design, SEO Services, AI Integration, Get Quote
- **Automatic CRM tagging**: "Sales Lead", "Website Inquiry"

#### **Support Context** (`context="technical"`)
```javascript
<AIAssistant context="technical" enableLeadCapture={false} />
```
- Helps with **platform issues** and **technical questions**
- **Lower lead scoring** (support-focused)
- **Quick actions**: Setup Help, Feature Tutorial, Security Questions
- **CRM tagging**: "Support Request", "Technical"

#### **General Context** (`context="general"`)
```javascript
<AIAssistant context="general" enableLeadCapture={true} />
```
- **Multi-purpose** conversations
- **Balanced lead scoring**
- **Adaptive responses** based on conversation flow

---

## 📊 Lead Scoring System

### How It Works

The AI analyzes conversations in real-time and assigns scores based on:

#### **Interest Indicators** (10-20 points each)
- **Pricing inquiries**: "What do you charge?", "How much does it cost?"
- **Service requests**: "I need a website", "Can you help with SEO?"
- **Timeline questions**: "When can you start?", "How long does it take?"
- **Business mentions**: References to company, business needs

#### **Urgency Signals** (20-25 points each)
- **Immediate needs**: "ASAP", "urgent", "immediately"
- **Deadlines**: "launch date", "deadline", "by next month"
- **Competitive pressure**: "getting quotes", "comparing options"

#### **Engagement Depth** (5-15 points each)
- **Message length**: Detailed descriptions worth more points
- **Conversation duration**: Sustained engagement = higher scores
- **Follow-up questions**: Shows genuine interest

#### **Contact Sharing** (15-20 points each)
- **Email provided**: Automatic +20 points
- **Phone number**: +15 points
- **Company details**: +10 points

### Lead Qualification Thresholds

| Score Range | Status | Action |
|-------------|--------|---------|
| **0-29** | Visitor | Continue conversation |
| **30-49** | Warm Lead | Show lead capture form |
| **50-74** | Qualified Lead | Auto-create in CRM |
| **75-100** | Hot Lead | Priority notification + CRM |

### Example Scoring Scenarios

#### **High-Scoring Conversation** (Score: 75)
```
User: "Hi, I need a new website for my restaurant. We're launching next month and need pricing ASAP."

AI Scoring:
- Business mention: +10 points
- Service request: +15 points  
- Timeline urgency: +25 points
- Pricing inquiry: +15 points
- Deadline pressure: +20 points
Total: 85 points → Hot Lead
```

#### **Medium-Scoring Conversation** (Score: 45)
```
User: "What services do you offer? I might need help with my company website."

AI Scoring:
- Service inquiry: +10 points
- Business mention: +10 points
- Tentative interest: +5 points
- General question: +5 points
Total: 30 points → Warm Lead
```

---

## 🔗 Breakcold CRM Integration

### Current Configuration

#### **Webhook Settings**
- **URL**: `https://cmgsite.pages.dev/api/breakcold/webhook`
- **Secret**: `wk_354a4803ba2384`
- **Status**: ✅ Active
- **Events**: `lead.create`, `lead.update`, `lead.delete` + 5 others

#### **API Integration**
- **Endpoint**: `https://api.breakcold.com/v3`
- **Authentication**: Bearer token (stored in secret store `383e46b47c2749a1804ba0c434b80b47`)
- **Rate Limits**: Standard Breakcold API limits apply

### What Gets Created in CRM

When a qualified lead is captured, the system creates a Breakcold lead with:

#### **Basic Information**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "phone": "555-0123",
  "company": "Acme Corp",
  "website": "https://acme.com"
}
```

#### **Lead Source Tracking**
- **Source**: "Website Chatbot - sales" (context-specific)
- **Tags**: ["Website Lead", "Sales", "Web Design"] 
- **Lead Score**: Numerical score (0-100)

#### **Conversation Context**
```json
{
  "customAttributes": {
    "leadScore": 75,
    "interest": "Web Design",
    "budget": "$5,000 - $15,000",
    "timeline": "Next month",
    "conversationContext": "User requested pricing for restaurant website...",
    "capturedAt": "2025-08-01T22:14:31.668Z"
  }
}
```

#### **Detailed Notes**
```
Lead captured via AI chatbot. Interest: Web Design. Lead score: 75/100. 
Budget: $5,000 - $15,000. Timeline: Next month. 
Context: User needs restaurant website with ASAP timeline.
```

### CRM Workflow Integration

#### **Automatic Actions**
1. **Lead Created** → Webhook fired → Internal notification
2. **Status Changed** → Team notified → Follow-up triggered  
3. **Tags Updated** → Automation rules → Email sequences
4. **Notes Added** → Context preserved → Better handoffs

#### **Team Notifications**
When high-value leads are created:
```javascript
// Example notification
console.log(`🔥 HOT LEAD: ${firstName} ${lastName} (${email}) 
Score: ${leadScore}/100 | Interest: ${interest} | Source: Website Chat`);
```

---

## 🛠 System Configuration

### Environment Variables

#### **Required Settings** (Cloudflare Pages)
```bash
# Breakcold Integration
BREAKCOLD_WEBHOOK_SECRET=wk_354a4803ba2384
BREAKCOLD_SECRET_STORE_ID=383e46b47c2749a1804ba0c434b80b47
BREAKCOLD_API_KEY=your_api_key_here

# Authentication
JWT_SECRET=your_jwt_secret

# Optional
BREAKCOLD_WORKSPACE_ID=your_workspace_id
```

#### **Deployment URLs**
- **Production**: `https://cmgsite.pages.dev`
- **Webhook Endpoint**: `https://cmgsite.pages.dev/api/breakcold/webhook`
- **Lead API**: `https://cmgsite.pages.dev/api/leads/create`
- **Analytics**: `https://cmgsite.pages.dev/api/leads/analytics`

### File Structure

```
src/
├── components/
│   ├── support/
│   │   └── AIAssistant.tsx          # Main chatbot component
│   └── lead/
│       └── LeadCapture.tsx          # Lead capture forms
├── hooks/
│   └── useLeadTracking.ts           # Lead management hooks
├── lib/
│   └── breakcold-api.ts             # CRM API client
├── pages/
│   └── LeadGenerationDemo.tsx       # Demo page
└── utils/
    └── breakcold-test.ts            # Testing utilities

functions/
└── api/
    ├── breakcold/
    │   └── webhook.ts               # Webhook handler
    └── leads/
        ├── create.ts                # Lead creation API
        └── analytics.ts             # Analytics endpoint
```

---

## 📈 Using the Analytics Dashboard

### Available Metrics

#### **Lead Volume**
- **Total Leads**: All-time lead count
- **Monthly Leads**: Current month performance
- **Weekly Leads**: Recent activity trends
- **Conversion Rate**: Chat → Lead percentage

#### **Lead Quality** 
- **Average Score**: Mean qualification score
- **Qualification Rate**: Percentage of qualified leads
- **Source Performance**: Which channels convert best

#### **Operational Metrics**
- **Response Time**: AI response speed
- **Engagement Depth**: Conversation length trends
- **Peak Hours**: When most leads are captured

### Accessing Analytics

#### **Browser Console** (Development)
```javascript
// Run integration tests
breakcoldTests.runIntegrationTests()

// Test specific components
breakcoldTests.testWebhookEndpoint()
breakcoldTests.testLeadCreation()
```

#### **API Access** (Production)
```bash
# Get analytics data
curl -X GET https://cmgsite.pages.dev/api/leads/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Export as CSV
curl -X GET "https://cmgsite.pages.dev/api/leads/analytics?format=csv" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Breakcold Dashboard**
- View leads with **source tracking**
- Monitor **conversation context** in notes
- Track **lead scores** in custom attributes
- Analyze **conversion patterns** by tag

---

## 🔧 Operational Procedures

### Daily Operations

#### **Morning Checklist**
1. **Check webhook status** in Breakcold dashboard
2. **Review overnight leads** in CRM
3. **Monitor system health** via Cloudflare Functions logs
4. **Respond to high-scoring leads** within 2 hours

#### **Lead Follow-up Process**
1. **Hot Leads (75-100)**: Call within 1 hour
2. **Qualified Leads (50-74)**: Email within 4 hours  
3. **Warm Leads (30-49)**: Email within 24 hours
4. **Cold Inquiries (<30)**: Add to newsletter

### Weekly Maintenance

#### **Performance Review**
- **Lead volume trends**: Week-over-week analysis
- **Conversion rates**: Chat → Lead → Customer
- **AI effectiveness**: Score accuracy review
- **Source attribution**: Which pages generate leads

#### **System Health Checks**
```bash
# Test webhook endpoint
curl -X GET https://cmgsite.pages.dev/api/breakcold/webhook

# Verify lead creation
curl -X POST https://cmgsite.pages.dev/api/leads/create \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "firstName": "Test User"}'
```

### Monthly Optimization

#### **AI Tuning**
- **Review conversation logs** for missed opportunities
- **Adjust scoring thresholds** based on lead quality
- **Update quick actions** for seasonal promotions
- **Refine context responses** for better engagement

#### **CRM Cleanup**
- **Remove test leads** from development
- **Update lead status** for completed conversions
- **Archive old conversations** for performance
- **Review automation rules** for effectiveness

---

## 🚨 Troubleshooting Guide

### Common Issues

#### **Webhook Not Receiving Events**
**Symptoms**: No leads appearing in CRM despite chat activity
**Solutions**:
```bash
# 1. Check webhook status
curl -X GET https://cmgsite.pages.dev/api/breakcold/webhook

# 2. Verify environment variables
echo $BREAKCOLD_WEBHOOK_SECRET

# 3. Test manual webhook
curl -X POST https://cmgsite.pages.dev/api/breakcold/webhook \
  -H "Content-Type: application/json" \
  -d '{"id_space": "test", "event": "lead.create", "secret": "wk_354a4803ba2384", "payload": {"id": "123", "email": "test@example.com"}}'
```

#### **AI Not Scoring Leads**
**Symptoms**: All conversations show 0 lead score
**Solutions**:
1. Check **conversation context** is being saved
2. Verify **scoring algorithm** is running
3. Review **threshold settings** for your business
4. Test with **high-intent phrases** ("need pricing ASAP")

#### **CRM Integration Failures**
**Symptoms**: Leads scored but not created in Breakcold
**Solutions**:
```bash
# Check API key access
curl -X POST https://cmgsite.pages.dev/api/leads/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{"email": "test@example.com"}'

# Verify secret store access
# Check Cloudflare Functions logs for API errors
```

### Error Codes

| Error | Meaning | Solution |
|-------|---------|----------|
| **401 Unauthorized** | Invalid webhook secret | Check `BREAKCOLD_WEBHOOK_SECRET` |
| **403 Forbidden** | Wrong workspace | Verify `BREAKCOLD_WORKSPACE_ID` |
| **500 Internal Error** | API key issues | Check secret store access |
| **400 Bad Request** | Invalid payload | Review webhook format |

### Debug Commands

```bash
# View deployment logs
wrangler pages deployment tail --project-name=cmgsite

# Test all endpoints
breakcoldTests.runIntegrationTests()

# Check environment variables
wrangler pages secret list --project-name=cmgsite

# Monitor webhook deliveries
# (Check Breakcold dashboard webhook logs)
```

---

## 🎯 Best Practices

### Optimizing Lead Capture

#### **Conversation Starters**
Train your team to promote specific phrases that trigger high scores:
- **"I need pricing for..."** (20 points)
- **"When can you start?"** (15 points)  
- **"We have a deadline of..."** (25 points)
- **"Looking for a quote on..."** (20 points)

#### **Page Optimization**
- **Place chatbot** on high-traffic pages (pricing, services)
- **Use sales context** on commercial pages
- **Enable lead capture** site-wide except support pages
- **A/B test** different chat prompts

### CRM Management

#### **Lead Tagging Strategy**
```javascript
// Automatic tags based on conversation
"Website Lead"           // All chatbot leads
"High Intent"           // Score 75+
"Web Design"            // Service-specific
"Urgent Timeline"       // Timeline indicators
"Price Sensitive"       // Budget discussions
```

#### **Follow-up Templates**
Create Breakcold email templates for each lead type:
- **Hot Leads**: "Thanks for your interest! Let's schedule a call..."
- **Qualified Leads**: "I saw you're interested in [service]..."
- **Warm Leads**: "Here are some resources that might help..."

### Performance Monitoring

#### **Key Metrics to Track**
- **Chat Engagement Rate**: % of visitors who start conversations
- **Lead Conversion Rate**: % of chats that become leads  
- **Qualification Accuracy**: % of scored leads that actually convert
- **Response Time**: Average AI response speed
- **Customer Satisfaction**: Follow-up survey scores

#### **Success Indicators**
- **30%+ engagement** rate on high-traffic pages
- **15%+ conversion** rate from chat to qualified lead
- **85%+ accuracy** in lead scoring (qualified leads actually convert)
- **<2 second** average AI response time
- **4.5+ stars** in customer satisfaction

---

## 🚀 Future Enhancements

### Planned Features

#### **Advanced AI Capabilities**
- **Sentiment analysis** for better lead qualification
- **Intent classification** for automatic routing
- **Conversation summarization** for better handoffs
- **Multi-language support** for broader reach

#### **Enhanced CRM Integration**
- **Automated follow-up sequences** based on lead score
- **Calendar integration** for instant meeting booking
- **Pipeline automation** for lead progression
- **Revenue attribution** from chat to close

#### **Analytics Improvements**
- **Real-time dashboard** with live metrics
- **Predictive lead scoring** using historical data
- **ROI tracking** from chat investment to revenue
- **A/B testing framework** for optimization

### Upgrade Path

#### **Phase 1**: Current system optimization
- Fine-tune scoring algorithms
- Improve conversation flows
- Enhance CRM automation

#### **Phase 2**: Advanced AI features
- Implement sentiment analysis
- Add predictive scoring
- Deploy multi-language support

#### **Phase 3**: Full automation
- Complete pipeline automation
- Revenue attribution tracking
- Advanced analytics dashboard

---

## 📞 Support & Maintenance

### System Monitoring

#### **Daily Health Checks**
- Webhook delivery success rate
- Lead creation accuracy  
- AI response performance
- CRM sync status

#### **Weekly Performance Review**
- Lead volume trends
- Conversion rate analysis
- Customer feedback review
- System optimization opportunities

### Getting Help

#### **System Issues**
1. Check **Cloudflare Functions logs** for errors
2. Verify **environment variables** are set correctly
3. Test **webhook endpoints** manually
4. Review **Breakcold webhook logs** for delivery issues

#### **Business Questions**
1. Analyze **lead scoring accuracy** against actual conversions
2. Review **conversation patterns** for optimization opportunities  
3. Adjust **qualification thresholds** based on business needs
4. Optimize **follow-up processes** for better conversion

---

## ✅ Quick Reference

### Essential URLs
- **Production Site**: https://cmgsite.pages.dev
- **Webhook Endpoint**: https://cmgsite.pages.dev/api/breakcold/webhook  
- **Demo Page**: https://cmgsite.pages.dev/LeadGenerationDemo
- **Breakcold Dashboard**: https://app.breakcold.com

### Key Commands
```bash
# Deploy updates
npm run deploy

# Test webhook
curl -X GET https://cmgsite.pages.dev/api/breakcold/webhook

# Run integration tests
breakcoldTests.runIntegrationTests()

# View logs
wrangler pages deployment tail --project-name=cmgsite
```

### Configuration Values
- **Webhook Secret**: `wk_354a4803ba2384`
- **Secret Store ID**: `383e46b47c2749a1804ba0c434b80b47`
- **Lead Qualification Threshold**: 30 points
- **Hot Lead Threshold**: 75 points

---

Your AI-powered lead generation system is now fully operational and documented! 🎉

This system will automatically capture, qualify, and route leads from your website visitors directly into your Breakcold CRM, providing 24/7 lead generation capability with intelligent scoring and automated follow-up triggers.
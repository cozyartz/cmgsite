# Client Portal - Multi-Tenant SEO AI Platform

This is a comprehensive client portal built for Cozyartz Media Group that provides AI-powered SEO tools and consultation services to clients like Jon Werbeck from JW Partnership Consulting.

## Features

### 🔐 Authentication
- **Multi-provider authentication**: GitHub, Google, and email/password
- **Enterprise security**: JWT tokens, session management, RBAC
- **Multi-tenant isolation**: Each client gets isolated data and AI gateway

### 🤖 AI-Powered SEO Tools
- **Content Generation**: Blog posts, meta descriptions, social media content
- **Keyword Research**: Find high-value keywords and opportunities
- **Competitor Analysis**: Analyze competitor strategies
- **Email Optimization**: Subject lines and templates
- **Custom AI Assistant**: Trained on client-specific data

### 📊 Analytics & Reporting
- **Real-time dashboards**: Traffic, rankings, conversions
- **Performance tracking**: Keyword positions, organic growth
- **Usage analytics**: AI credits, tool usage patterns
- **Competitive intelligence**: Market positioning insights

### 💼 Consultation Services
- **Strategic Advisory**: $250/hour - High-level business strategy
- **Partnership Development**: $500/hour - Fortune 500 network leverage
- **Implementation Support**: $150/hour - Technical setup and optimization
- **Automated booking**: Calendar integration and session management

### 💳 Billing & Subscription Management
- **Tiered pricing**: Starter ($1,000), Growth ($1,500), Enterprise ($2,500)
- **AI credit system**: Usage-based billing with overages at $0.50/call
- **Automated invoicing**: Monthly billing with detailed breakdowns
- **Upgrade paths**: Performance-based scaling recommendations

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend (Cloudflare)
- **Cloudflare Workers** for serverless API
- **Cloudflare D1** for SQLite database
- **Cloudflare R2** for file storage
- **Workers AI** for AI processing
- **AI Gateway** for usage tracking and analytics

### Architecture
```
Client → AI Gateway → Workers AI → Client Dashboard
   ↓
Cloudflare D1 Database (Multi-tenant)
   ↓
Billing & Analytics System
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Cloudflare
```bash
# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create cmgsite-client-portal-db

# Create R2 bucket
wrangler r2 bucket create cmgsite-client-portal-files

# Create KV namespace for sessions
wrangler kv:namespace create SESSIONS
```

### 3. Set Environment Variables
```bash
# Set secrets
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put JWT_SECRET
wrangler secret put STRIPE_SECRET_KEY
```

### 4. Initialize Database
```bash
# Run database migrations
wrangler d1 execute cmgsite-client-portal-db --file migrations/001_initial_schema.sql
```

### 5. Start Development Servers
```bash
# Terminal 1: Start Cloudflare Worker
npm run worker:dev

# Terminal 2: Start React app
npm run dev
```

### 6. Access the Portal
- **Main site**: http://localhost:5173
- **Client portal**: http://localhost:5173/auth
- **API endpoints**: http://localhost:8787/api

## Usage Guide

### For Clients (like Jon Werbeck)

#### Getting Started
1. **Sign up** at `/auth` using GitHub, Google, or email
2. **Complete onboarding** - company profile, goals, competitors
3. **Explore dashboard** - overview of SEO performance and AI tools

#### Using AI Tools
1. **Content Generation**: Create blog posts, social media content
2. **Keyword Research**: Find partnership-focused keywords
3. **Competitor Analysis**: Monitor competitive landscape
4. **Email Optimization**: Craft executive outreach emails

#### Booking Consultations
1. **Choose consultation type** based on needs
2. **Select available time slots**
3. **Join video/phone sessions**
4. **Access recordings and notes**

#### Managing Usage
1. **Monitor AI credits** in dashboard
2. **Track billing** in billing section
3. **Upgrade plan** when needed
4. **Download invoices** for accounting

### For Administrators

#### Client Management
- **View all clients** in admin dashboard
- **Monitor usage** across all accounts
- **Manage subscriptions** and billing
- **Access support tickets** and issues

#### Platform Analytics
- **Track platform usage** and performance
- **Monitor AI costs** and revenue
- **Analyze client success** metrics
- **Generate business reports**

## Client Pricing Structure

### Subscription Tiers
- **Starter** ($1,000/month): 100 AI calls, basic tools
- **Growth** ($1,500/month): 250 AI calls, advanced features
- **Enterprise** ($2,500/month): 500 AI calls, white-label options

### AI Usage
- **Base allocation**: Included in subscription
- **Overage pricing**: $0.50 per additional call
- **Credit system**: Real-time usage tracking

### Consultation Services
- **Strategic Advisory**: $250/hour (business strategy)
- **Partnership Development**: $500/hour (Fortune 500 network)
- **Implementation Support**: $150/hour (technical assistance)

### Package Deals
- **Launch Package**: $750 (3 hours initial setup)
- **Growth Advisory**: $1,500/month (ongoing strategic support)

## Security Features

### Enterprise-Grade Security
- **JWT authentication** with secure token management
- **Multi-tenant data isolation** in database
- **Role-based access control** (owner, admin, member)
- **Session management** with automatic expiration
- **API rate limiting** and abuse protection

### Data Protection
- **Encryption at rest** for sensitive data
- **Secure API endpoints** with authentication
- **Audit logging** for compliance
- **GDPR compliance** for data privacy

## Deployment

### Production Deployment
```bash
# Deploy Cloudflare Worker
npm run worker:deploy

# Deploy static site
npm run build
# Upload dist/ to Cloudflare Pages
```

### Environment Configuration
- **Production secrets** via Cloudflare dashboard
- **Database scaling** via D1 console
- **AI Gateway configuration** for production limits
- **Custom domain** setup for client access

## Support & Documentation

### Client Support
- **In-app help** and documentation
- **Video tutorials** for key features
- **Email support** for technical issues
- **Consultation booking** for strategic guidance

### Developer Documentation
- **API reference** for integrations
- **Database schema** documentation
- **Deployment guides** for scaling
- **Security best practices** for compliance

## Business Model

This client portal enables a scalable SEO consulting business with:
- **Recurring revenue** from monthly subscriptions
- **High-margin services** through AI automation
- **Premium consulting** leveraging expertise
- **Scalable architecture** for growth

Perfect for clients like Jon Werbeck who need:
- **Professional SEO tools** for partnership consulting
- **Fortune 500 outreach** automation
- **Strategic guidance** from experienced consultants
- **Transparent billing** and usage tracking

---

Built with ❤️ by Cozyartz Media Group for enterprise SEO consulting.
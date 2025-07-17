# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### Deployment Commands
- `wrangler deploy` - Deploy Cloudflare Worker (API backend)
- `wrangler pages deploy dist` - Deploy frontend to Cloudflare Pages
- `npm run build && wrangler pages deploy dist` - Build and deploy frontend

### Project Setup
- `npm install` - Install dependencies
- Dependencies are managed with npm (package-lock.json present)

## Architecture Overview

### Technology Stack
- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite with React plugin
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React
- **SEO**: react-helmet-async for metadata management

### Project Structure
```
src/
├── App.tsx                 # Main application component
├── components/             # React components
│   ├── Header.tsx         # Navigation with responsive menu
│   ├── Hero.tsx           # Landing section with animations
│   ├── Services.tsx       # Service offerings with scroll animations
│   ├── Portfolio.tsx      # Portfolio showcase
│   ├── About.tsx          # Company information
│   ├── Contact.tsx        # Contact form/information
│   ├── Footer.tsx         # Footer component
│   └── SEO.tsx            # Comprehensive SEO/metadata component
├── index.css              # Global styles and Tailwind imports
└── main.tsx               # React app entry point
```

### Component Architecture
- **Single-page application** with component-based architecture
- **Functional components** using React hooks (useState, useEffect, useRef)
- **TypeScript interfaces** for type safety, especially in SEO component
- **Intersection Observer API** for scroll-based animations
- **Props-based communication** between components

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

### Animation Implementation
- Use Intersection Observer for performance-efficient scroll animations
- Implement staggered animations with delays (e.g., 200ms intervals)
- Apply consistent transform patterns (translate, scale, opacity)

### Component Creation
- Follow functional component pattern with TypeScript
- Use consistent export: `export default ComponentName`
- Implement responsive design with Tailwind breakpoints
- Add hover effects and transitions for interactive elements

## Deployment Information

### Current Production URLs
- **Frontend (Cloudflare Pages)**: https://f77fbcbc.cmgsite.pages.dev
- **Backend API (Cloudflare Worker)**: https://cmgsite-client-portal.cozyartz-media-group.workers.dev
- **Main Domain**: https://cozyartzmedia.com (currently redirects to Pages deployment)

### OAuth Configuration
- **GitHub OAuth Redirect URI**: https://cozyartzmedia.com/api/auth/github/callback
- **Google OAuth Redirect URI**: https://cozyartzmedia.com/api/auth/google/callback
- **Authentication Success Redirect**: https://f77fbcbc.cmgsite.pages.dev/auth

### Required Secrets (Wrangler)
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials  
- `JWT_SECRET` - JWT token signing key
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` - PayPal payment processing
- `SQUARE_ACCESS_TOKEN` / `SQUARE_APPLICATION_ID` / `SQUARE_LOCATION_ID` - Square payments

### Business Context
- **Cozyartz Media Group** - Creative agency specializing in web design, multimedia production
- **Founded**: 2016
- **Services**: Web design, graphic design, instructional design, video production, aerial photography
- **Contact**: 269.261.0069, hello@cozyartzmedia.com, Kalamazoo, MI
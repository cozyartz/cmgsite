import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface Props {
  // Basic SEO
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  
  // Open Graph / Social Media
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterImage?: string;
  
  // Business Information
  businessName: string;
  phone: string;
  email?: string;
  address: {
    street?: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
  
  // Geographic Data
  geo: {
    latitude: number;
    longitude: number;
  };
  
  // Business Data
  businessType?: string;
  services?: string[];
  hours?: string[];
  foundingDate?: string;
  copyrightYear?: string;
  ownerInfo?: {
    name?: string;
    type?: string;
    established?: string;
  };
  
  // Additional Options
  robotsContent?: string;
  language?: string;
  region?: string;
}

const SEO: React.FC<Props> = ({
  title,
  description,
  keywords = "",
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterImage,
  businessName,
  phone,
  email,
  address,
  geo,
  businessType = "LocalBusiness",
  services = [],
  hours = [],
  foundingDate = "2016",
  copyrightYear,
  ownerInfo,
  robotsContent = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  language = "en",
  region = "US"
}) => {
  // Defaults
  const defaultOgTitle = ogTitle || title;
  const defaultOgDescription = ogDescription || description;
  const baseUrl = ogUrl || canonical || 'https://cozyartzmedia.com';
  const defaultOgImage = ogImage || `${baseUrl}/og-image.jpg`;
  const defaultTwitterImage = twitterImage || `${baseUrl}/twitter-image.jpg`;
  const currentYear = new Date().getFullYear();
  const businessCopyrightYear = copyrightYear || currentYear.toString();
  const businessFoundingDate = foundingDate;
  
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": businessName,
    "description": description,
    "url": canonical,
    "telephone": phone,
    "email": email,
    "foundingDate": businessFoundingDate,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.city,
      "addressRegion": address.state,
      "postalCode": address.zip,
      "addressCountry": address.country || "United States"
    },
    "copyrightYear": businessCopyrightYear,
    "copyrightHolder": {
      "@type": "Organization",
      "name": ownerInfo?.name || businessName,
      "description": ownerInfo?.type || "Local Business"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": geo.latitude,
      "longitude": geo.longitude
    },
    "areaServed": {
      "@type": "City",
      "name": address.city,
      "containedInPlace": {
        "@type": "State",
        "name": address.state
      }
    },
    "hasOfferCatalog": services.length > 0 ? {
      "@type": "OfferCatalog",
      "name": `${businessName} Services`,
      "itemListElement": services.map(service => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service,
          "provider": {
            "@type": "Organization",
            "name": businessName
          }
        }
      }))
    } : undefined,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": phone,
      "contactType": "customer service",
      "areaServed": address.state,
      "availableLanguage": "English"
    }
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": title,
    "url": canonical,
    "description": description,
    "publisher": {
      "@type": "Organization",
      "name": businessName
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${canonical}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "inLanguage": `${language}-${region}`,
    "copyrightYear": businessCopyrightYear,
    "copyrightHolder": {
      "@type": "Organization",
      "name": ownerInfo?.name || businessName,
      "foundingDate": businessFoundingDate,
      "description": ownerInfo?.type || "Professional Service Provider"
    },
    "dateCreated": businessFoundingDate,
    "dateModified": new Date().toISOString().split('T')[0]
  };

  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": businessType,
    "name": businessName,
    "description": description,
    "url": canonical,
    "telephone": phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.city,
      "addressRegion": address.state,
      "postalCode": address.zip,
      "addressCountry": address.country || "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": geo.latitude,
      "longitude": geo.longitude
    },
    "openingHours": hours.length > 0 ? hours.map(hour => {
      const [day, time] = hour.split(': ');
      const dayCode = {
        'Monday': 'Mo', 'Tuesday': 'Tu', 'Wednesday': 'We', 
        'Thursday': 'Th', 'Friday': 'Fr', 'Saturday': 'Sa', 'Sunday': 'Su'
      }[day] || 'Mo';
      return `${dayCode} ${time.replace(' AM', '').replace(' PM', '').replace(/(\d+):(\d+)/g, '$1:$2')}`;
    }) : undefined,
    "paymentAccepted": ["Cash", "Credit Card"],
    "currenciesAccepted": "USD",
    "keywords": keywords,
    "servesCuisine": businessType === "Restaurant" ? "American" : undefined,
    "hasMenu": businessType === "Restaurant" || businessType === "FoodTruck" ? canonical + "#menu" : undefined,
    "copyrightYear": businessCopyrightYear,
    "copyrightHolder": {
      "@type": "Organization",
      "name": ownerInfo?.name || businessName,
      "foundingDate": businessFoundingDate
    },
    "dateEstablished": businessFoundingDate
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <meta charSet="UTF-8" />
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={businessName} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={defaultOgTitle} />
      <meta property="og:description" content={defaultOgDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:image" content={defaultOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={defaultOgTitle} />
      <meta property="og:site_name" content={businessName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cozyartzmedia" />
      <meta name="twitter:creator" content="@cozyartzmedia" />
      <meta name="twitter:title" content={defaultOgTitle} />
      <meta name="twitter:description" content={defaultOgDescription} />
      <meta name="twitter:image" content={defaultTwitterImage} />
      <meta name="twitter:image:alt" content={defaultOgTitle} />

      {/* Additional Social Media Meta Tags */}
      <meta property="fb:app_id" content="" />
      <meta name="pinterest-rich-pin" content="true" />
      <meta name="linkedin:owner" content="cozyartz-media-group" />

      {/* SEO Meta Tags */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="language" content={language.toUpperCase()} />
      <meta name="geo.region" content={`${region}-${address.state}`} />
      <meta name="geo.placename" content={`${address.city}, ${address.state} ${address.zip}`} />
      <meta name="geo.position" content={`${geo.latitude};${geo.longitude}`} />
      <meta name="ICBM" content={`${geo.latitude}, ${geo.longitude}`} />

      {/* Location and Coverage Meta Tags */}
      <meta name="location" content={`${address.state}, United States`} />
      <meta name="coverage" content={address.state} />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="web_author" content={businessName} />
      <meta name="owner" content={businessName} />
      {canonical && <meta name="url" content={canonical} />}
      {canonical && <meta name="identifier-URL" content={canonical} />}
      <meta name="category" content="business" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="subject" content="Web Design, Digital Marketing, SEO Services" />
      <meta name="copyright" content={businessName} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Preload Critical Resources */}
      <link rel="preload" href="https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Inter:wght@300;400;500;600;700;800;900&display=swap" as="style" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* Language */}
      <html lang={`${language}-${region}`} />
    </Helmet>
  );
};

export default SEO;
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface Address {
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Geo {
  latitude: number;
  longitude: number;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  twitterImage?: string;
  canonical?: string;
  structuredData?: any;
  businessName?: string;
  phone?: string;
  email?: string;
  address?: Address;
  geo?: Geo;
  ogUrl?: string;
  businessType?: string;
  ogTitle?: string;
  ogDescription?: string;
  services?: string[];
  foundingDate?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = "",
  ogImage = "https://cozartmedia.com/og-image.jpg",
  twitterImage,
  canonical,
  structuredData,
  businessName,
  phone,
  email,
  address,
  geo,
  ogUrl,
  businessType = "ProfessionalService",
  ogTitle,
  ogDescription,
  services = [],
  foundingDate
}) => {
  const baseUrl = "https://cozartmedia.com";
  const fullCanonical = canonical || `${baseUrl}${window.location.pathname}`;
  const finalTwitterImage = twitterImage || ogImage;

  // Enhanced Local Business Schema
  const localBusinessSchema = businessName ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#business`,
    "name": businessName,
    "alternateName": "Cozyartz Media",
    "description": description,
    "url": baseUrl,
    "logo": `${baseUrl}/cmgLogo.png`,
    "image": ogImage,
    "telephone": phone,
    "email": email,
    "foundingDate": foundingDate,
    "priceRange": "$",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Credit Card, Check, Invoice",
    "address": address ? {
      "@type": "PostalAddress",
      "addressLocality": address.city,
      "addressRegion": address.state,
      "postalCode": address.zip,
      "addressCountry": address.country
    } : undefined,
    "geo": geo ? {
      "@type": "GeoCoordinates",
      "latitude": geo.latitude,
      "longitude": geo.longitude
    } : undefined,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": phone,
      "contactType": "customer service",
      "email": email,
      "availableLanguage": "English"
    },
    "serviceArea": {
      "@type": "Place",
      "name": "United States"
    },
    "knowsAbout": services,
    "hasOfferCatalog": services.length > 0 ? {
      "@type": "OfferCatalog",
      "name": "Creative Services",
      "itemListElement": services.map((service, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "itemOffered": {
          "@type": "Service",
          "name": service,
          "provider": {
            "@id": `${baseUrl}/#business`
          }
        }
      }))
    } : undefined,
    "sameAs": [
      "https://www.linkedin.com/company/cozyartz-media-group",
      "https://andreacozart.me",
      "https://amylundin.me"
    ],
    "openingHours": "Mo-Fr 09:00-17:00",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    }
  } : null;

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": businessName || "Cozyartz Media Group",
    "description": description,
    "publisher": {
      "@id": `${baseUrl}/#business`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/?s={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Breadcrumb Schema for navigation
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Enhanced Meta Tags */}
      <meta name="author" content="Andrea Cozart-Lundin, Amy Cozart-Lundin" />
      <meta name="copyright" content="Cozyartz Media Group" />
      <meta name="language" content="English" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={ogUrl || fullCanonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Cozyartz Media Group" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={finalTwitterImage} />
      <meta name="twitter:site" content="@CozyartzMedia" />
      <meta name="twitter:creator" content="@andreacozart" />
      
      {/* Business/Local SEO */}
      {businessName && (
        <>
          <meta name="business:contact_data:street_address" content={address ? `${address.city}, ${address.state} ${address.zip}` : "Battle Creek, MI"} />
          <meta name="business:contact_data:locality" content={address?.city || "Battle Creek"} />
          <meta name="business:contact_data:region" content={address?.state || "MI"} />
          <meta name="business:contact_data:postal_code" content={address?.zip || "49015"} />
          <meta name="business:contact_data:country_name" content={address?.country || "United States"} />
          {phone && <meta name="business:contact_data:phone_number" content={phone} />}
          {email && <meta name="business:contact_data:email" content={email} />}
          {geo && (
            <>
              <meta name="geo.position" content={`${geo.latitude};${geo.longitude}`} />
              <meta name="geo.placename" content={address?.city || "Battle Creek"} />
              <meta name="geo.region" content={address?.state || "Michigan"} />
            </>
          )}
        </>
      )}
      
      {/* Canonical */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* Structured Data */}
      {localBusinessSchema && (
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      )}
      
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      
      {/* Custom Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
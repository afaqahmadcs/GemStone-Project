import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: Record<string, any> | Record<string, any>[];
}

export default function SEOHead({
  title,
  description,
  image = '/Images/Gemstone catalogue 0.jpeg',
  type = 'website',
  schema,
}: SEOHeadProps) {
  const location = useLocation();

  // Retrieve site config from Vite environment variables
  const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://bluesapphiregemstones.com').replace(/\/$/, '');
  const canonicalUrl = `${siteUrl}${location.pathname}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const gaId = import.meta.env.VITE_GA_ID;
  const googleVerification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;
  const bingVerification = import.meta.env.VITE_BING_SITE_VERIFICATION;

  useEffect(() => {
    // 1. Title Tag
    document.title = title;

    // Helper to find or create meta/link elements
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Description
    setMetaTag('name', 'description', description);

    // 3. Open Graph Metadata
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', imageUrl);
    setMetaTag('property', 'og:site_name', 'Blue Sapphire Gem Stones');

    // 4. Twitter / X Card Metadata
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', imageUrl);

    // 5. Verification Meta Tags
    if (googleVerification) {
      setMetaTag('name', 'google-site-verification', googleVerification);
    }
    if (bingVerification) {
      setMetaTag('name', 'msvalidate.01', bingVerification);
    }

    // 6. Canonical URL Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 7. Dynamic JSON-LD Schema Script
    let scriptTag = document.getElementById('jsonld-schema') as HTMLScriptElement;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'jsonld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Clear schema script on transitions to prevent duplicate scripts accumulating
      const script = document.getElementById('jsonld-schema');
      if (script) {
        script.textContent = '';
      }
    };
  }, [title, description, canonicalUrl, imageUrl, type, schema, googleVerification, bingVerification]);

  // 8. Google Analytics 4 Script Initialization
  useEffect(() => {
    if (!gaId) return;

    // Check if script is already injected
    const scriptId = 'google-analytics-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    if (!script) {
      const scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.async = true;
      scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(scriptEl);

      const initScript = document.createElement('script');
      initScript.id = 'google-analytics-init';
      initScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', { page_path: window.location.pathname });
      `;
      document.head.appendChild(initScript);
    } else {
      // Triggers dynamic pageview on routing state transitions
      const win = window as any;
      if (win.gtag) {
        win.gtag('config', gaId, { page_path: location.pathname });
      }
    }
  }, [gaId, location.pathname]);

  return null; // Side-effect execution only
}

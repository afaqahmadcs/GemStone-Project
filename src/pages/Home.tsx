import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SapphireScene from '../components/SapphireScene';
import type { SapphireSceneController } from '../components/SapphireScene';
import CollectionSection from '../components/CollectionSection';
import AboutSection from '../components/AboutSection';
import BrandStatement from '../components/BrandStatement';
import ExpertiseSection from '../components/ExpertiseSection';
import TrustSection from '../components/TrustSection';
import SEOHead from '../components/SEOHead';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  
  // Ref pointers for GSAP ScrollTrigger
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SapphireSceneController>(null);


  
  // Accessibility check for user systems preferring reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  // GSAP ScrollTrigger timeline orchestration disabled to allow natural page scroll
  useEffect(() => {
    return;
  }, []);

  const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://bluesapphiregemstones.com').replace(/\/$/, '');
  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Blue Sapphire Gem Stones",
      "url": siteUrl,
      "logo": `${siteUrl}/favicon.svg`,
      "email": "junaidkkhan2113@gmail.com",
      "telephone": "03341020791",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "SF934, Deans Trade Centre",
        "addressLocality": "Peshawar",
        "addressCountry": "PK"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Blue Sapphire Gem Stones",
      "image": `${siteUrl}/assets/gemstones/sapphire-kashmir.jpg`,
      "telephone": "03341020791",
      "email": "junaidkkhan2113@gmail.com",
      "url": siteUrl,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "SF934, Deans Trade Centre",
        "addressLocality": "Peshawar",
        "addressCountry": "PK"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "opens": "09:00",
        "closes": "17:00"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Blue Sapphire Gem Stones",
      "url": siteUrl
    }
  ];

  return (
    <div className="page-home" style={{ paddingTop: '80px' }}>
      <SEOHead
        title="Blue Sapphire Gem Stones | Natural Gemstones in Peshawar"
        description="Explore Blue Sapphire Gem Stones in Peshawar and discover a curated selection of natural gemstones with private enquiry options."
        schema={homeSchema}
      />
      
      {/* Naturally Flowing Hero Section */}
      <div 
        ref={containerRef} 
        className="story-container"
      >
        <div ref={pinRef} className="pin-wrapper">
          
          {/* Left Panel: Hero Text & Spec Information */}
          <div className="story-text-track">
            <div className="story-slides-container">
              <div className="story-slide active-interaction">
                <span className="text-overline">THE STONE</span>
                <h1>Nature, <br />Refined.</h1>
                <p className="story-slide-desc">
                  Every exceptional gemstone begins with character that cannot be manufactured.
                </p>
                
                {/* Specifications table */}
                <div className="spec-panel">
                  <div className="spec-row">
                    <span className="spec-label">Classification</span>
                    <span className="spec-val">Premium Natural Corundum</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Luster Level</span>
                    <span className="spec-val">Vivid / Velvety Blue</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Sourcing Slices</span>
                    <span className="spec-val">Unheated Only</span>
                  </div>
                </div>

                <div className="hero-ctas" style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                  <Link to="/collection" className="btn-primary">
                    Explore Collection &rarr;
                  </Link>
                  <Link to="/contact" className="btn-primary" style={{ borderColor: 'rgba(250, 248, 245, 0.3)', backgroundColor: 'transparent' }}>
                    Private Enquiry
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: WebGL 3D Sapphire view */}
          <div className="story-visual-track">
            <SapphireScene ref={controllerRef} mode={prefersReducedMotion ? 'media' : '3d'} />
          </div>

        </div>
      </div>

      {/* Premium Editorial Gemstone Catalogue Section */}
      <CollectionSection />

      {/* Editorial Brand Story & Heritage Section */}
      <AboutSection />

      {/* Brand Approach Statement Callout */}
      <BrandStatement />

      {/* Interactive Gemstone Appraisal Expertise Section */}
      <ExpertiseSection />

      {/* Website Experiential Trust Principles */}
      <TrustSection />
      
    </div>
  );
}

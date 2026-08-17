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
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SapphireSceneController>(null);

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

  const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://bluesapphiregemstones.com').replace(/\/$/, '');
  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Blue Sapphire Gem Stones",
      "url": siteUrl,
      "logo": `${siteUrl}/favicon.png`,
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
      "image": `${siteUrl}/Images/Gemstone catalogue 0.jpeg`,
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
    <div className="page-home">
      <SEOHead
        title="Blue Sapphire Gem Stones | Natural Gemstones in Peshawar"
        description="Explore Blue Sapphire Gem Stones in Peshawar and discover a curated selection of natural gemstones with private enquiry options."
        schema={homeSchema}
      />

      <section
        ref={containerRef}
        className="story-container"
        aria-label="Blue Sapphire Gem Stones hero"
      >
        <div className="pin-wrapper">

          <div className="story-text-track">
            <div className="story-slides-container">
              <div className="story-slide active-interaction">
                <span className="text-overline">BLUE SAPPHIRE GEM STONES</span>
                <h1 className="hero-headline">Rare Stones.<br />Timeless Beauty.</h1>
                <p className="story-slide-desc">
                  Discover carefully selected gemstones and fine jewellery sourced with an eye for colour, character and authenticity.
                </p>

                <div className="hero-ctas">
                  <Link to="/collection" className="btn-primary">
                    Explore Collection &rarr;
                  </Link>
                  <Link to="/contact" className="btn-secondary">
                    Private Enquiry &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="story-visual-track">
            <div className="hero-editorial-labels" aria-hidden="true">
              <span className="editorial-label label-left">Natural Sapphire</span>
              <span className="editorial-label label-right">Premium Collection</span>
            </div>

            <SapphireScene ref={controllerRef} mode={prefersReducedMotion ? 'media' : '3d'} />
          </div>

        </div>

        <div className="scroll-indicator-container" aria-hidden="true">
          <span className="scroll-indicator-text">Scroll to Discover</span>
          <div className="scroll-indicator-line">
            <div className="scroll-indicator-fill" />
          </div>
        </div>
      </section>

      <CollectionSection />
      <AboutSection />
      <BrandStatement />
      <ExpertiseSection />
      <TrustSection />
    </div>
  );
}

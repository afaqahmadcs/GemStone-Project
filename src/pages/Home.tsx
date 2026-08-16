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

  // Scroll moments progress tracking
  const [activeMoment, setActiveMoment] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  
  // Accessibility check and screen size checks for mobile devices
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', listener);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      mediaQuery.removeEventListener('change', listener);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // GSAP ScrollTrigger timeline orchestration
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !pinRef.current) return;

    // Scope GSAP triggers to containerRef to prevent global selectors clashes
    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>('.story-slide');
      
      // Initialize slides transitions (first is visible, others are offset/hidden)
      gsap.set(slides.slice(1), { opacity: 0, y: 30, filter: 'blur(10px)' });
      gsap.set(slides[0], { opacity: 1, y: 0, filter: 'blur(0px)' });

      // Core gemstone proxy values for 3D tweening
      const gemProxy = {
        rotationX: 0.1,
        rotationY: 0,
        rotationZ: 0,
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        scale: 1.0,
        cameraDistance: 7.0
      };

      const updateGemstone = () => {
        if (controllerRef.current) {
          const isDesktop = window.innerWidth >= 768;
          const finalPosX = isDesktop ? gemProxy.positionX : 0;
          const finalPosY = isDesktop ? gemProxy.positionY : 0.4; // Slightly offset vertically on mobile
          
          controllerRef.current.setRotation(gemProxy.rotationX, gemProxy.rotationY, gemProxy.rotationZ);
          controllerRef.current.setPosition(finalPosX, finalPosY, gemProxy.positionZ);
          controllerRef.current.setScale(gemProxy.scale);
          controllerRef.current.setCameraDistance(gemProxy.cameraDistance);
        }
      };

      // Set initial values
      updateGemstone();

      // Create scroll-linked timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrub easing
          pin: pinRef.current,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.min(Math.floor(progress * 5), 4);
            setActiveMoment(index);
            setProgressPercent(progress * 100);
          }
        }
      });

      // Moment 1 (Start) -> Moment 2
      // Slides cross-fade, gemstone rotates and zooms
      tl.to(slides[0], { opacity: 0, y: -30, filter: 'blur(5px)', duration: 0.8 }, 0)
        .to(gemProxy, { rotationY: Math.PI * 0.75, cameraDistance: 5.8, onUpdate: updateGemstone, duration: 1.0 }, 0)
        .to(slides[1], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, 0.5)

      // Moment 2 -> Moment 3
      // Gemstone tilts up to catch lighting highlights on facets
        .to(slides[1], { opacity: 0, y: -30, filter: 'blur(5px)', duration: 0.8 }, 1.5)
        .to(gemProxy, { rotationY: Math.PI * 1.5, rotationX: 0.4, cameraDistance: 5.5, onUpdate: updateGemstone, duration: 1.0 }, 1.5)
        .to(slides[2], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, 2.0)

      // Moment 3 -> Moment 4
      // Gemstone scales down and translates right to accommodate specifications table
        .to(slides[2], { opacity: 0, y: -30, filter: 'blur(5px)', duration: 0.8 }, 3.0)
        .to(gemProxy, { rotationY: Math.PI * 2.2, rotationX: 0.2, scale: 0.85, positionX: 0.8, onUpdate: updateGemstone, duration: 1.0 }, 3.0)
        .to(slides[3], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, 3.5)

      // Moment 4 -> Moment 5 (End)
      // Gemstone returns to center and expands for call-to-actions display
        .to(slides[3], { opacity: 0, y: -30, filter: 'blur(5px)', duration: 0.8 }, 4.5)
        .to(gemProxy, { rotationY: Math.PI * 3.0, rotationX: 0.1, scale: 1.05, positionX: 0.0, onUpdate: updateGemstone, duration: 1.0 }, 4.5)
        .to(slides[4], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, 5.0);

    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

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
      
      {/* Scroll-Driven Pinned Story Section */}
      <div 
        ref={containerRef} 
        className={`story-container ${prefersReducedMotion ? 'reduced-motion' : ''}`}
        style={{ height: prefersReducedMotion ? 'auto' : '450vh' }}
      >
        <div ref={pinRef} className="pin-wrapper">
          
          {/* Progress Indicators Track */}
          <div className="story-progress-indicator" aria-hidden="true">
            <span className={`progress-number ${activeMoment === 0 ? 'active' : ''}`}>01</span>
            <span className={`progress-number ${activeMoment === 1 ? 'active' : ''}`}>02</span>
            <span className={`progress-number ${activeMoment === 2 ? 'active' : ''}`}>03</span>
            <span className={`progress-number ${activeMoment === 3 ? 'active' : ''}`}>04</span>
            <span className={`progress-number ${activeMoment === 4 ? 'active' : ''}`}>05</span>
            <div className="progress-track-line">
              <div className="progress-fill-line" style={{ height: `${progressPercent}%` }} />
            </div>
          </div>

          {/* Left Panel: Text moments overlay */}
          <div className="story-text-track">
            <div className="story-slides-container">
              
              {/* Moment 1 */}
              <div className={`story-slide ${activeMoment === 0 ? 'active-interaction' : ''}`}>
                <span className="text-overline">THE STONE</span>
                <h1>Nature, <br />Refined.</h1>
                <p className="story-slide-desc">
                  Every exceptional gemstone begins with character that cannot be manufactured.
                </p>
              </div>

              {/* Moment 2 */}
              <div className={`story-slide ${activeMoment === 1 ? 'active-interaction' : ''}`}>
                <span className="text-overline">NATURAL CHARACTER</span>
                <h2>Every Facet <br />Tells a Story.</h2>
                <p className="story-slide-desc">
                  Color, clarity and structure come together to reveal the individual character of every stone.
                </p>
              </div>

              {/* Moment 3 */}
              <div className={`story-slide ${activeMoment === 2 ? 'active-interaction' : ''}`}>
                <span className="text-overline">PRECISION</span>
                <h2>Cut To <br />Reveal Light.</h2>
                <p className="story-slide-desc">
                  Precision cutting transforms natural material into a surface where light can move, reflect and disappear.
                </p>
              </div>

              {/* Moment 4 */}
              <div className={`story-slide ${activeMoment === 3 ? 'active-interaction' : ''}`}>
                <span className="text-overline">SELECTED WITH DISCERNMENT</span>
                <h2>Sapphire Profile</h2>
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
                <Link to="/contact" className="btn-primary">
                  Private Enquiry &rarr;
                </Link>
              </div>

              {/* Moment 5 */}
              <div className={`story-slide ${activeMoment === 4 ? 'active-interaction' : ''}`}>
                <span className="text-overline">BLUE SAPPHIRE GEM STONES</span>
                <h2>Looking For <br />Something Rare?</h2>
                <p className="story-slide-desc">
                  Discover a curated selection of exceptional gemstones.
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                  <Link to="/collection" className="btn-primary">
                    Explore Collection &rarr;
                  </Link>
                  <Link to="/contact" className="btn-primary" style={{ borderColor: 'transparent' }}>
                    Private Enquiry
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Right Panel: WebGL 3D Sapphire view */}
          <div className="story-visual-track">
            <SapphireScene ref={controllerRef} mode={(prefersReducedMotion || isMobile) ? 'media' : '3d'} />
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

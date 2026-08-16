import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import '../components/Gallery.css';

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Curated list of specific Visual Gallery Exhibition assets
  const galleryItems = [
    {
      id: "gal-001",
      name: "Blue Sapphire Facet Study",
      origin: "Kashmir Focus",
      carat: 4.82,
      image: "/Images/Gallery 0.jpeg",
      slug: "kashmir-heritage-sapphire"
    },
    {
      id: "gal-002",
      name: "Cornflower Luster Focus",
      origin: "Ceylon Focus",
      carat: 8.54,
      image: "/Images/Gallery 1.jpeg",
      slug: "ceylon-royal-oval"
    },
    {
      id: "gal-003",
      name: "Refractive Geometry Examination",
      origin: "Spinel Focus",
      carat: 5.22,
      image: "/Images/Gallery-02.jpeg",
      slug: "mahenge-pink-spinel"
    }
  ];



  // Keyboard navigation event listeners for the Lightbox overlay
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('lightbox-open');

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('lightbox-open');
    };
  }, [lightboxOpen, galleryItems.length]);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  // Helper assigning asymmetric columns spans based on child indices
  const getGridClass = (index: number) => {
    const mod = index % 4;
    if (mod === 0) return 'gallery-item-large';
    if (mod === 1) return 'gallery-item-small';
    return 'gallery-item-medium';
  };

  // Shared Vector Gemstone Placeholder rendering
  const renderVectorGemstone = (label: string) => (
    <div className="gem-image-placeholder">
      <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: '80px', height: '80px' }}>
        <polygon points="50,15 75,30 75,70 50,85 25,70 25,30" stroke="var(--color-champagne)" strokeWidth="0.75" fill="none" />
        <line x1="50" y1="15" x2="50" y2="85" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" />
        <line x1="25" y1="30" x2="75" y2="30" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" />
        <line x1="25" y1="70" x2="75" y2="70" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" />
        <polygon points="25,30 50,50 75,30" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" fill="none" />
        <polygon points="25,70 50,50 75,70" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" fill="none" />
      </svg>
      <span className="placeholder-tag">[ {label} ]</span>
    </div>
  );

  return (
    <div className="gallery-section">
      <SEOHead
        title="Gemstone Gallery | Blue Sapphire Gem Stones"
        description="Explore gemstone photography and visual details from Blue Sapphire Gem Stones in Peshawar."
      />
      <div className="container">
        
        {/* Exhibition Header */}
        <div className="gallery-intro">
          <span className="text-overline">The Gallery</span>
          <h1>Captured in Light.<br />Defined by Character.</h1>
          <p className="gallery-intro-desc">
            A visual study of natural gemstones. Explore their crystallographic forms, saturated hue centers, and precision cut facets.
          </p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="gallery-grid" role="list">
          {galleryItems.map((gem, index) => {
            const hasError = imageErrors[gem.id];
            return (
              <div 
                key={gem.id} 
                className={`gallery-card ${getGridClass(index)}`}
                role="listitem"
                onClick={() => openLightbox(index)}
              >
                <div className="gallery-img-wrapper image-reveal">
                  {!hasError ? (
                    <img 
                      src={gem.image} 
                      alt={gem.name} 
                      loading="lazy" 
                      className="gallery-img"
                      onError={() => handleImageError(gem.id)}
                    />
                  ) : (
                    renderVectorGemstone(`${gem.origin} study`)
                  )}
                  
                  {/* Luxury Hover Overlay Info */}
                  <div className="gallery-overlay-mask">
                    <h3 className="gallery-overlay-name">{gem.name}</h3>
                    <span className="gallery-overlay-label">
                      Examine Specimen &bull; {gem.carat} CT
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full-Screen Accessible Lightbox Overlay */}
        {lightboxOpen && (
          <div 
            className="lightbox-backdrop" 
            role="dialog" 
            aria-modal="true" 
            aria-label="Gemstone Visual Exhibition Zoom"
          >
            {/* Top Navigation Row */}
            <div className="lightbox-header">
              <span className="lightbox-counter">
                {String(activeIndex + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
              </span>
              <button 
                type="button" 
                className="lightbox-close-btn"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close Gallery Lightbox"
              >
                Close &times;
              </button>
            </div>

            {/* Previous Arrow Button */}
            <button 
              type="button" 
              className="lightbox-arrow arrow-left"
              onClick={() => setActiveIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))}
              aria-label="Previous Gemstone Image"
            >
              &#8249;
            </button>

            {/* Center Image Container */}
            <div className="lightbox-content">
              <div className="lightbox-image-wrapper">
                {!imageErrors[galleryItems[activeIndex].id] ? (
                  <img 
                    src={galleryItems[activeIndex].image} 
                    alt={galleryItems[activeIndex].name} 
                    className="lightbox-image"
                    onError={() => handleImageError(galleryItems[activeIndex].id)}
                  />
                ) : (
                  <div style={{ padding: 'var(--spacing-lg)' }}>
                    {renderVectorGemstone(galleryItems[activeIndex].name)}
                  </div>
                )}
              </div>
              <h3 className="lightbox-gem-name">
                {galleryItems[activeIndex].name} &bull; {galleryItems[activeIndex].carat} Carats
              </h3>
              <Link 
                to={`/gemstones/${galleryItems[activeIndex].slug}`}
                className="view-stone-link"
                style={{ marginTop: '8px', color: 'var(--color-champagne)' }}
              >
                View Collection Details &rarr;
              </Link>
            </div>

            {/* Next Arrow Button */}
            <button 
              type="button" 
              className="lightbox-arrow arrow-right"
              onClick={() => setActiveIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))}
              aria-label="Next Gemstone Image"
            >
              &#8250;
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

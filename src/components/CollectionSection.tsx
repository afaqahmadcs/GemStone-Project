import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GEMSTONES_DATA } from '../data/gemstones';
import CollectionFilter from './CollectionFilter';
import FeaturedGemstone from './FeaturedGemstone';
import GemstoneCard from './GemstoneCard';
import { initImageReveals } from '../utils/imageReveal';
import './Collection.css';

export default function CollectionSection() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const sectionRef = useRef<HTMLElement>(null);

  // Hardcode available category filters
  const categories = ['ALL', 'SAPPHIRE', 'EMERALD', 'RUBY', 'TOURMALINE', 'AMETHYST', 'SPINEL'];

  // Filter gemstones data based on activeCategory
  const filteredGems = activeCategory === 'ALL'
    ? GEMSTONES_DATA
    : GEMSTONES_DATA.filter((gem) => gem.category === activeCategory);

  // Designate Kashmir Heritage Sapphire (g-001) as the absolute featured model spotlight
  const featuredGem = GEMSTONES_DATA.find((gem) => gem.id === 'g-001');

  // Filter out the featured gemstone from the main catalogue grid ONLY when category filter is 'ALL' or 'SAPPHIRE'
  // (This prevents duplicating it on screen, while preserving filter visibility of other sapphires)
  const gridGems = filteredGems.filter(
    (gem) => !(activeCategory === 'ALL' && gem.id === 'g-001')
  );

  // Helper mapping rhythm indexes to asymmetric layout classes
  const getGridClass = (index: number) => {
    const mod = index % 4;
    if (mod === 0) return 'grid-item-large';
    if (mod === 1) return 'grid-item-small';
    return 'grid-item-medium';
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!sectionRef.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const cleanup = initImageReveals(sectionRef.current);
    return cleanup;
  }, [gridGems, activeCategory]);

  return (
    <section ref={sectionRef} id="collection" className="collection-section" aria-labelledby="collection-heading">
      <div className="container">
        
        {/* Editorial Split Introduction Header & Showcase Banner */}
        <div className="collection-intro-wrapper">
          <div className="collection-intro">
            <span className="text-overline">The Catalogue</span>
            <h2 id="collection-heading">Exceptional Stones.<br />Distinctive Character.</h2>
            <p className="collection-intro-desc">
              A considered selection of natural gemstones chosen for their color saturation, crystal purity, and individual geometric beauty.
            </p>
          </div>
          <div className="collection-visual-showcase image-reveal">
            <img 
              src="/Images/Gemstone collection visual.jpeg" 
              alt="Natural Gemstones Curation Selection" 
              className="collection-visual-img"
              loading="lazy"
            />
          </div>
        </div>

        {/* Category Filter Navigation bar */}
        <CollectionFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Spotlight Featured Gemstone display (Visible under 'ALL' view) */}
        {activeCategory === 'ALL' && featuredGem && (
          <FeaturedGemstone gem={featuredGem} />
        )}

        {/* Asymmetric main catalog grid */}
        {gridGems.length > 0 ? (
          <div className="asymmetric-grid" role="list">
            {gridGems.map((gem, index) => (
              <div key={gem.id} role="listitem" className={getGridClass(index)}>
                <GemstoneCard
                  gem={gem}
                  gridClass={getGridClass(index)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-xl) var(--spacing-md)', 
            border: '1px solid var(--border-color)', 
            backgroundColor: 'var(--color-charcoal)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <span className="text-overline" style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>Acquisitions</span>
            <h4 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--font-size-2xl)', 
              color: 'var(--color-ivory)', 
              marginBottom: 'var(--spacing-sm)' 
            }}>
              No Current Inventory
            </h4>
            <p style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--color-text-secondary)', 
              lineHeight: 'var(--leading-normal)',
              marginBottom: 'var(--spacing-md)',
              maxWidth: '440px',
              margin: '0 auto var(--spacing-md) auto'
            }}>
              We do not currently have specimens matching this category in active inventory. Please request a private commission.
            </p>
            <Link to="/contact" className="btn-primary" style={{ display: 'inline-block' }}>
              Request Custom Sourcing &rarr;
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}

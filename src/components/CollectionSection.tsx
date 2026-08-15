import { useState } from 'react';
import { GEMSTONES_DATA } from '../data/gemstones';
import CollectionFilter from './CollectionFilter';
import FeaturedGemstone from './FeaturedGemstone';
import GemstoneCard from './GemstoneCard';
import './Collection.css';

export default function CollectionSection() {
  const [activeCategory, setActiveCategory] = useState('ALL');

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

  return (
    <section id="collection" className="collection-section" aria-labelledby="collection-heading">
      <div className="container">
        
        {/* Editorial Introduction Header */}
        <div className="collection-intro">
          <span className="text-overline">The Catalogue</span>
          <h2 id="collection-heading">Exceptional Stones.<br />Distinctive Character.</h2>
          <p className="collection-intro-desc">
            A considered selection of natural gemstones chosen for their color saturation, crystal purity, and individual geometric beauty.
          </p>
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
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-charcoal)' }}>
            <span className="text-overline">Acquisitions</span>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              No Current Inventory
            </h4>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              We do not currently have specimens matching this category. Please contact us for custom sourcing inquiries.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

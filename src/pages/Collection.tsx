import { GEMSTONES_DATA } from '../data/gemstones';
import SEOHead from '../components/SEOHead';
import GemstoneCard from '../components/GemstoneCard';

export default function Collection() {
  return (
    <div className="page-collection" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <SEOHead
        title="Gemstone Collection | Blue Sapphire Gem Stones"
        description="Explore the gemstone collection from Blue Sapphire Gem Stones, featuring natural stones presented with detailed information and private enquiry."
      />
      <div className="container">
        <span className="text-overline">The Catalogue</span>
        <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-md)' }}>The Signature Collection</h1>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: 'var(--spacing-xl)' }}>
          Explore our select, certified natural acquisitions. Each gemstone is individually evaluated for color purity, clarity profile, and geographical provenance.
        </p>

        <div className="collection-catalog-grid">
          {GEMSTONES_DATA.map((gem) => (
            <GemstoneCard key={gem.id} gem={gem} />
          ))}
        </div>
      </div>
    </div>
  );
}

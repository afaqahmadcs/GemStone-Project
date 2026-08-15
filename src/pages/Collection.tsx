import { Link } from 'react-router-dom';
import { GEMSTONES_DATA } from '../data/gemstones';
import SEOHead from '../components/SEOHead';

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
          {GEMSTONES_DATA.map((gem) => (
            <article key={gem.id} style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', padding: 'var(--spacing-sm)' }}>
              <div style={{ aspectRatio: '1/1', backgroundColor: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-sm)' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>[ {gem.name} ]</span>
              </div>
              <span className="text-overline" style={{ fontSize: '10px', marginBottom: '4px' }}>{gem.origin} &bull; {gem.carat} Carats</span>
              <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '8px' }}>{gem.name}</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', flexGrow: 1, marginBottom: 'var(--spacing-sm)' }}>{gem.description}</p>
              <Link to={`/gemstones/${gem.slug}`} className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Examine Gemstone
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

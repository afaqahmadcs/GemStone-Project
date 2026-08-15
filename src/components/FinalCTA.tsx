import { Link } from 'react-router-dom';
import { getWhatsAppGeneralLink } from '../utils/contactUtils';

export default function FinalCTA() {
  const waLink = getWhatsAppGeneralLink();

  return (
    <section className="final-cta-section" aria-labelledby="final-cta-heading" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: 'var(--spacing-xl) 0', textAlign: 'center', backgroundColor: 'var(--color-charcoal)' }}>
      <div className="container">
        <span className="text-overline" style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
          BLUE SAPPHIRE GEM STONES
        </span>
        <h2 id="final-cta-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-3xl)', color: 'var(--color-ivory)', marginBottom: 'var(--spacing-sm)' }}>
          Discover Something Exceptional.
        </h2>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto var(--spacing-md) auto', lineHeight: '1.6' }}>
          Explore our signature natural gemstone collection or consult with our showroom specialists regarding bespoke gemstone acquisition.
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/collection" className="btn-primary">
            Explore Collection &rarr;
          </Link>
          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary"
            style={{ borderColor: 'transparent' }}
          >
            Private Enquiry &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

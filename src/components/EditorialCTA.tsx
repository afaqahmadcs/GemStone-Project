import { Link } from 'react-router-dom';
import { getWhatsAppGeneralLink } from '../utils/contactUtils';
import './AboutExpertise.css';

export default function EditorialCTA() {
  const waGeneralLink = getWhatsAppGeneralLink();

  return (
    <section className="editorial-cta-section" aria-labelledby="cta-heading">
      <div className="container">
        <div className="editorial-cta-content">
          <span className="text-overline">Discover the Collection</span>
          <h2 id="cta-heading">Find the Stone<br />That Speaks to You.</h2>
          <p>
            Explore our curated signature catalogue or schedule a private consultation regarding custom gemstone sourcing.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/collection" className="btn-primary">
              Explore Collection &rarr;
            </Link>
            <a 
              href={waGeneralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ borderColor: 'transparent' }}
            >
              Private Enquiry &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

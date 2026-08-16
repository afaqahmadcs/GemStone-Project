import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Gemstone } from '../data/gemstones';
import { getWhatsAppInquiryLink } from '../utils/contactUtils';
import './Collection.css';

interface FeaturedGemstoneProps {
  gem: Gemstone;
}

export default function FeaturedGemstone({ gem }: FeaturedGemstoneProps) {
  const [imageError, setImageError] = useState(false);
  const waLink = getWhatsAppInquiryLink(gem.name, gem.carat, gem.origin);

  return (
    <div className="featured-gem-wrapper">
      <div className="featured-gem-container">
        
        {/* Left Column: Visual Showcase */}
        <div className="featured-gem-visual image-reveal">
          {!imageError ? (
            <img 
              src={gem.image} 
              alt={`Featured Gemstone: ${gem.name}`} 
              loading="lazy"
              className="gem-image-media"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="gem-image-placeholder">
              <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: '120px', height: '120px' }}>
                <polygon points="50,15 75,30 75,70 50,85 25,70 25,30" stroke="var(--color-champagne)" strokeWidth="0.5" fill="none" />
                <line x1="50" y1="15" x2="50" y2="85" stroke="rgba(229, 212, 188, 0.2)" strokeWidth="0.4" />
                <line x1="25" y1="30" x2="75" y2="30" stroke="rgba(229, 212, 188, 0.2)" strokeWidth="0.4" />
                <line x1="25" y1="70" x2="75" y2="70" stroke="rgba(229, 212, 188, 0.2)" strokeWidth="0.4" />
                <polygon points="25,30 50,50 75,30" stroke="rgba(229, 212, 188, 0.2)" strokeWidth="0.4" fill="none" />
                <polygon points="25,70 50,50 75,70" stroke="rgba(229, 212, 188, 0.2)" strokeWidth="0.4" fill="none" />
              </svg>
              <span className="placeholder-tag">[ {gem.category} SPOTLIGHT ]</span>
            </div>
          )}
        </div>

        {/* Right Column: Editorial Specifications */}
        <div className="featured-gem-specs">
          <span className="text-overline">Acquisition Spotlight</span>
          <span className="text-overline" style={{ color: 'var(--color-text-muted)', fontSize: '10px', marginTop: '2px', marginBottom: '8px' }}>
            {gem.category}
          </span>
          <h3>{gem.name}</h3>
          
          <p className="featured-desc">{gem.description}</p>
          
          <div className="spec-panel">
            <div className="spec-row">
              <span className="spec-label">Provenance / Origin</span>
              <span className="spec-val">{gem.origin}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Carat Weight</span>
              <span className="spec-val">{gem.carat} CT</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Color Profile</span>
              <span className="spec-val">{gem.color}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Clarity Scale</span>
              <span className="spec-val">{gem.clarity}</span>
            </div>
            {gem.specifications.treatment && (
              <div className="spec-row">
                <span className="spec-label">Treatment Info</span>
                <span className="spec-val">{gem.specifications.treatment}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
            <Link to={`/gemstones/${gem.slug}`} className="btn-primary">
              View Gemstone &rarr;
            </Link>
            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
              style={{ borderColor: 'transparent' }}
            >
              WhatsApp Enquiry &rarr;
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

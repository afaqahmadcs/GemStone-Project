import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Gemstone } from '../data/gemstones';
import './Collection.css';

interface GemstoneCardProps {
  gem: Gemstone;
  gridClass?: string;
}

export default function GemstoneCard({ gem, gridClass = 'grid-item-medium' }: GemstoneCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link 
      to={`/gemstones/${gem.slug}`} 
      className={`gem-card ${gridClass}`} 
      aria-label={`Examine ${gem.name}`}
    >
      <div className="gem-image-wrapper image-reveal">
        {!imageError ? (
          <img 
            src={gem.image} 
            alt={gem.name} 
            loading="lazy" 
            className="gem-image-media"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="gem-image-placeholder">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <polygon points="50,15 75,30 75,70 50,85 25,70 25,30" stroke="var(--color-champagne)" strokeWidth="0.75" fill="none" />
              <line x1="50" y1="15" x2="50" y2="85" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" />
              <line x1="25" y1="30" x2="75" y2="30" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" />
              <line x1="25" y1="70" x2="75" y2="70" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" />
              <polygon points="25,30 50,50 75,30" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" fill="none" />
              <polygon points="25,70 50,50 75,70" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" fill="none" />
            </svg>
            <span className="placeholder-tag">[ {gem.origin} &bull; {gem.carat} CT ]</span>
          </div>
        )}
      </div>

      <div className="gem-card-meta">
        <span className="text-overline" style={{ fontSize: '9px', marginBottom: '2px' }}>
          {gem.origin} &bull; {gem.carat} Carats
        </span>
        <h3>{gem.name}</h3>
        <span className="view-stone-link">
          View Stone 
          <span className="arrow-icon" aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}

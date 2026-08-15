import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  // Enforce tab titles and page indexing controls
  useEffect(() => {
    document.title = "Stone Not Found | Blue Sapphire Gem Stones";

    // Set page to noindex, nofollow to prevent crawling broken references
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow');

    return () => {
      // Restore standard indexable status on route exit
      const robots = document.querySelector('meta[name="robots"]');
      if (robots) {
        robots.setAttribute('content', 'index, follow');
      }
    };
  }, []);

  return (
    <div className="page-notfound" style={{ paddingTop: '150px', paddingBottom: 'var(--spacing-xxl)', textAlign: 'center', minHeight: '80vh', backgroundColor: 'var(--color-obsidian)' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <span className="text-overline" style={{ color: 'var(--color-champagne)' }}>404 Error</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-4xl)', color: 'var(--color-ivory)', marginTop: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
          Stone Not Found
        </h1>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)', lineHeight: '1.6' }}>
          The gemstone specimen or page you are looking for may have been privately acquired, moved, or no longer exists.
        </p>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/collection" className="btn-primary">
            Back to Collection &rarr;
          </Link>
          <Link to="/" className="btn-primary" style={{ borderColor: 'transparent' }}>
            Back to Home &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

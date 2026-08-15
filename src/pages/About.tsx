import SEOHead from '../components/SEOHead';

export default function About() {
  return (
    <div className="page-about" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: 'var(--spacing-xl)' }}>
      <SEOHead
        title="About Blue Sapphire Gem Stones | Peshawar"
        description="Learn more about Blue Sapphire Gem Stones and our approach to presenting natural gemstones with clarity and attention to detail."
      />
      <div className="container" style={{ maxWidth: '800px' }}>
        <span className="text-overline">The Maison</span>
        <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-md)' }}>Our Story & Heritage</h1>
        
        <p style={{ fontSize: 'var(--font-size-lg)', lineHeight: '1.7', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          Operating from Peshawar, Blue Sapphire Gem Stones has established a reputation for sourcing fine, natural gemstones of exceptional caliber.
        </p>

        <p style={{ marginBottom: 'var(--spacing-md)' }}>
          Our business is built upon the core tenets of authenticity and expert selection. We specialize in unheated blue sapphires, star sapphires, and other high-quality natural minerals, offering them directly to collectors, jewelry designers, and private individuals.
        </p>

        <div style={{ margin: 'var(--spacing-lg) 0 var(--spacing-xl) 0', border: '1px solid var(--border-color)', overflow: 'hidden', aspectRatio: '16/7', position: 'relative' }}>
          <img 
            src="/Images/Jewellery.jpeg" 
            alt="Masterpiece Gemstone Jewellery Integration" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
        </div>

        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-2xl)', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-sm)' }}>
          Authenticity Sourced
        </h3>
        <p style={{ marginBottom: 'var(--spacing-md)' }}>
          Every specimen in our collection undergoes rigorous gemological appraisal. We operate transparently, disclosing all gemological metrics, measurements, and treatment histories. By providing certifiable gemological documentation, we maintain absolute trust with our international clientele.
        </p>

        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-2xl)', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-sm)' }}>
          Private Consultation
        </h3>
        <p style={{ marginBottom: 'var(--spacing-md)' }}>
          For clients looking for specific carat weights, cuts, or origins, we provide private search and consulting services. Leveraging our deep regional network, we source exceptional gemstones that fit precise custom specifications.
        </p>
      </div>
    </div>
  );
}

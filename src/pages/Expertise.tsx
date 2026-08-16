import SEOHead from '../components/SEOHead';
import '../components/AboutExpertise.css';

export default function Expertise() {
  const services = [
    {
      title: "Gemstone Sourcing",
      description: "Access a curated selection of unheated natural sapphires sourced from historic origins. We specialize in finding specimens that meet strict criteria for color intensity, clarity, and cut precision."
    },
    {
      title: "Private Consultation",
      description: "Work directly with our experts to find custom stones for bespoke jewelry, private collections, or investment portfolios. We offer personalized attention and full transparency throughout the sourcing lifecycle."
    },
    {
      title: "Authentication & Certification Support",
      description: "We coordinate testing with renowned international gemological laboratories (such as GIA, GRS, and SSEF) to verify the authenticity, treatment status, and geographic origin of our gemological offerings."
    }
  ];

  return (
    <div className="page-expertise" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: 'var(--spacing-xl)' }}>
      <SEOHead
        title="Gemstone Expertise | Blue Sapphire Gem Stones"
        description="Learn more about Blue Sapphire Gem Stones and our approach to presenting natural gemstones with clarity and attention to detail."
      />
      <div className="container">
        <span className="text-overline">Services</span>
        <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-md)' }}>Our Expertise</h1>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: 'var(--spacing-xl)' }}>
          We provide specialized services tailored to the requirements of jewelers, collectors, and private clients seeking rare, unheated natural sapphires.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {services.map((service, index) => (
            <div key={index} style={{ border: '1px solid var(--border-color)', padding: 'var(--spacing-md)', backgroundColor: 'var(--color-charcoal)' }}>
              <span className="text-overline" style={{ fontSize: '10px' }}>0{index + 1}</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-sm)' }}>{service.title}</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

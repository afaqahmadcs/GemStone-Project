import './AboutExpertise.css';

export default function AboutSection() {
  return (
    <section id="about-house" className="about-section" aria-labelledby="about-heading">
      <div className="container">
        <div className="about-grid">
          
          {/* Left Column: Story Copy */}
          <div className="about-text-content">
            <span className="text-overline">About the House</span>
            <h2 id="about-heading">Where Natural Beauty<br />Meets Discernment.</h2>
            
            <p className="about-primary-text">
              Blue Sapphire Gem Stones presents a considered selection of natural gemstones chosen for their distinctive color saturation, internal character, and structural beauty.
            </p>
            
            <p className="about-secondary-text">
              Operating from Peshawar, we focus on presenting natural, unheated sapphires to collectors, jewelers, and private individuals. Our approach centers on offering a transparent, unhurried, and highly personal selection experience, ensuring every gemstone's unique geological origin and history are fully detailed and understood before purchase.
            </p>
          </div>

          {/* Right Column: Staggered Image Compositions */}
          <div className="staggered-visual-composition" aria-hidden="true">
            {/* Primary Visual Layer (Large) */}
            <div className="visual-layer-primary" style={{ overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img 
                src="/Images/Our Story — Woman.jpeg" 
                alt="Blue Sapphire Gem Stones Brand Heritage Story" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
            </div>

            {/* Secondary Visual Layer (Small Overlap) */}
            <div className="visual-layer-secondary" style={{ overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img 
                src="/Images/Jewellery.jpeg" 
                alt="Blue Sapphire Fine Jewellery Curation" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

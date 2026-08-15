import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GEMSTONES_DATA } from '../data/gemstones';
import GemstoneCard from '../components/GemstoneCard';
import { getWhatsAppInquiryLink } from '../utils/contactUtils';
import SEOHead from '../components/SEOHead';
import '../components/Detail.css';

export default function Detail() {
  const { slug } = useParams();
  
  // Find gemstone corresponding to dynamic slug key
  const gem = GEMSTONES_DATA.find((g) => g.slug === slug);

  const [activeImage, setActiveImage] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  // Reset states when gemstone slug changes
  useEffect(() => {
    if (gem) {
      setActiveImage(gem.image);
      setFormSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: '',
      });
    }
  }, [gem]);

  if (!gem) {
    return (
      <div className="container" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-3xl)' }}>Acquisition Not Found</h2>
        <p style={{ margin: 'var(--spacing-sm) 0 var(--spacing-md) 0', color: 'var(--color-text-secondary)' }}>
          The requested gemstone may have been private-enquired or archived.
        </p>
        <Link to="/collection" className="btn-primary">Return to Catalogue</Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepped for future backend/API database integration in subsequent phases
    setFormSubmitted(true);
  };

  const handleImageError = (path: string) => {
    setImageErrors((prev) => ({ ...prev, [path]: true }));
  };

  // Compile list of main image + gallery images
  const allImages = [gem.image, ...gem.galleryImages];
  
  // Get 3 related gemstones (filter by category, exclude current gem)
  const relatedGems = GEMSTONES_DATA
    .filter((g) => g.category === gem.category && g.id !== gem.id)
    .slice(0, 3);

  // If not enough related gems in category, fill with featured gemstones
  const finalRelated = relatedGems.length >= 3
    ? relatedGems
    : [
        ...relatedGems,
        ...GEMSTONES_DATA.filter((g) => g.id !== gem.id && !relatedGems.some(r => r.id === g.id)).slice(0, 3 - relatedGems.length)
      ];

  const waInquiryLink = getWhatsAppInquiryLink(gem.name, gem.carat, gem.origin);

  // Shared Vector Gemstone Placeholder rendering
  const renderVectorGemstone = (label: string) => (
    <div className="gem-image-placeholder">
      <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: '100px', height: '100px' }}>
        <polygon points="50,15 75,30 75,70 50,85 25,70 25,30" stroke="var(--color-champagne)" strokeWidth="0.75" fill="none" />
        <line x1="50" y1="15" x2="50" y2="85" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" />
        <line x1="25" y1="30" x2="75" y2="30" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" />
        <line x1="25" y1="70" x2="75" y2="70" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" />
        <polygon points="25,30 50,50 75,30" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" fill="none" />
        <polygon points="25,70 50,50 75,70" stroke="rgba(229, 212, 188, 0.25)" strokeWidth="0.5" fill="none" />
      </svg>
      <span className="placeholder-tag">[ {label} ]</span>
    </div>
  );

  const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://bluesapphiregemstones.com').replace(/\/$/, '');
  const detailSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": gem.name,
      "image": gem.image.startsWith('http') ? gem.image : `${siteUrl}${gem.image}`,
      "description": gem.description,
      "brand": {
        "@type": "Brand",
        "name": "Blue Sapphire Gem Stones"
      },
      "sku": gem.id,
      "category": gem.category
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Collection",
          "item": `${siteUrl}/collection`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": gem.name,
          "item": `${siteUrl}/gemstones/${gem.slug}`
        }
      ]
    }
  ];

  return (
    <div className="detail-section">
      <SEOHead
        title={`${gem.name} | Blue Sapphire Gem Stones`}
        description={gem.description}
        image={gem.image}
        schema={detailSchema}
      />
      <div className="container">
        
        {/* Navigation Breadcrumb back path */}
        <Link 
          to="/collection" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 'var(--spacing-md)' }}
        >
          &larr; Back to Catalogue
        </Link>

        {/* 1. Detail Page Hero Grid */}
        <div className="detail-hero-grid">
          
          {/* Left Panel: Primary Visual Box + Thumbnail strip */}
          <div className="detail-media-panel">
            <div className="detail-main-image-wrapper">
              {!imageErrors[activeImage] ? (
                <img 
                  src={activeImage} 
                  alt={gem.name} 
                  className="detail-main-img"
                  onError={() => handleImageError(activeImage)}
                />
              ) : (
                renderVectorGemstone(`${gem.origin} study`)
              )}
            </div>

            {/* Thumbnail Selection strip (Only displays if multiple images exist) */}
            {allImages.length > 1 && (
              <div className="detail-thumbnail-strip" role="group" aria-label="Gemstone Visual Angles">
                {allImages.map((img, idx) => {
                  const hasErr = imageErrors[img];
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`detail-thumbnail ${activeImage === img ? 'active' : ''}`}
                      onClick={() => setActiveImage(img)}
                      aria-label={`View angle ${idx + 1}`}
                    >
                      {!hasErr ? (
                        <img src={img} alt="" className="detail-thumb-img" onError={() => handleImageError(img)} />
                      ) : (
                        <span style={{ fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-champagne)' }}>
                          [{idx + 1}]
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Specifications Summary details */}
          <div className="detail-info-panel">
            <span className="detail-category-label">{gem.category}</span>
            <h1 className="detail-title">{gem.name}</h1>
            <p className="detail-tagline">
              A carefully selected natural {gem.category.toLowerCase()} sourced for private collections and custom commissions.
            </p>

            <table className="detail-specs-table">
              <tbody>
                <tr>
                  <td className="spec-key">Provenance</td>
                  <td className="spec-val">{gem.origin}</td>
                </tr>
                <tr>
                  <td className="spec-key">Carat weight</td>
                  <td className="spec-val">{gem.carat} CT</td>
                </tr>
                <tr>
                  <td className="spec-key">Facet Cut</td>
                  <td className="spec-val">{gem.cut}</td>
                </tr>
                <tr>
                  <td className="spec-key">Color grade</td>
                  <td className="spec-val">{gem.color}</td>
                </tr>
                <tr>
                  <td className="spec-key">Clarity grade</td>
                  <td className="spec-val">{gem.clarity}</td>
                </tr>
                {Object.entries(gem.specifications).map(([key, val]) => (
                  val && key !== 'treatment' && (
                    <tr key={key}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-val">{val}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* 2. Editorial Description section */}
        <section className="detail-story-section" aria-labelledby="story-heading">
          <div className="detail-story-content">
            <span className="text-overline">The Stone</span>
            <h2 id="story-heading">Defined by Its Natural Character.</h2>
            <p style={{ marginBottom: 'var(--spacing-md)' }}>
              {gem.description}
            </p>
            {gem.specifications.treatment && (
              <p style={{ fontStyle: 'italic', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                *Gemological Treatment Status: {gem.specifications.treatment}
              </p>
            )}
          </div>
        </section>

        {/* 3. Private Enquiry conversion card */}
        <section className="detail-enquiry-section" aria-labelledby="enquiry-card-heading">
          <div className="detail-enquiry-intro">
            <span className="text-overline">Inquire</span>
            <h2 id="enquiry-card-heading">Private Acquisition Enquiry</h2>
            <p>
              Please submit your consultation details below, or initiate a direct chat with our Peshawar showroom advisors.
            </p>
          </div>

          {formSubmitted ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-md) 0', color: 'var(--color-champagne)' }}>
              <span className="text-overline">Logged</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-xl)', marginBottom: '8px' }}>Enquiry Received</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Thank you for your interest. A representative will contact you shortly regarding <strong>{gem.name}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="detail-enquiry-form">
              <div className="enquiry-input-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="enquiry-input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="enquiry-input-group">
                <label htmlFor="phone">Phone / WhatsApp</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="enquiry-input-group">
                <label htmlFor="gemstoneInterest">Gemstone Interested In</label>
                <input
                  type="text"
                  id="gemstoneInterest"
                  name="gemstoneInterest"
                  readOnly
                  disabled
                  value={gem.name}
                  style={{ opacity: 0.7 }}
                />
              </div>

              <div className="enquiry-input-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={`I am interested in scheduling a private discussion regarding the unheated ${gem.carat} carat ${gem.name}.`}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>
                  Submit Enquiry
                </button>
                <a 
                  href={waInquiryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ borderColor: 'transparent', flexGrow: 1, textAlign: 'center' }}
                >
                  WhatsApp Enquiry &rarr;
                </a>
              </div>
              <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xs)' }}>
                <a href="mailto:junaidkkhan2113@gmail.com" className="nav-link" style={{ fontSize: 'var(--font-size-xs)' }}>
                  Email: junaidkkhan2113@gmail.com
                </a>
              </div>
            </form>
          )}
        </section>

        {/* 4. Related Gemstones recommendation block */}
        <section className="related-section" aria-labelledby="related-heading">
          <h2 id="related-heading">You May Also Like</h2>
          <div className="related-grid">
            {finalRelated.map((g) => (
              <GemstoneCard key={g.id} gem={g} gridClass="grid-item-medium" />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

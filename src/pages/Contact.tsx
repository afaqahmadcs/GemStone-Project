import { useState } from 'react';
import { getWhatsAppGeneralLink } from '../utils/contactUtils';
import SEOHead from '../components/SEOHead';
import '../components/Contact.css';

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function Contact() {

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gemstoneInterest: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear individual error as the user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // 1. Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    // 2. Optional email validation (only checks if filled)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please provide a valid email address format.";
      }
    }

    // 3. Phone validation (required, minimum 7 chars check)
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone or WhatsApp number is required.";
    } else {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length < 7) {
        newErrors.phone = "Please enter a valid phone number (minimum 7 digits).";
      }
    }

    // 4. Message validation (required, minimum 10 characters check)
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Your message must be at least 10 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Build a pre-filled WhatsApp message from the form data so the
      // enquiry actually reaches the client immediately.
      const phone = '923341020791';
      const lines = [
        'Hello Blue Sapphire Gem Stones, I would like to submit a private enquiry:',
        `Name: ${formData.fullName}`,
        formData.email ? `Email: ${formData.email}` : '',
        `Phone: ${formData.phone}`,
        formData.gemstoneInterest ? `Gemstone Interest: ${formData.gemstoneInterest}` : '',
        `Message: ${formData.message}`,
      ].filter(Boolean).join('\n');

      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(lines)}`;

      // Open WhatsApp in a new tab then show the success screen
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      setFormSubmitted(true);
    }
  };

  const waLink = getWhatsAppGeneralLink();

  return (
    <div className="contact-section">
      <SEOHead
        title="Contact Blue Sapphire Gem Stones | Peshawar"
        description="Contact Blue Sapphire Gem Stones in Peshawar for gemstone enquiries, availability and further information."
      />
      <div className="container">
        
        {/* Contact Page Intro */}
        <div className="contact-intro">
          <span className="text-overline">Get In Touch</span>
          <h1>Let's Find the<br />Right Stone.</h1>
          <p className="contact-intro-desc">
            For gemstone enquiries, custom sourcing requests, and Peshawar showroom availability, connect with us directly.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="contact-grid">
          
          {/* Left Column: Direct Contacts */}
          <div className="contact-info-panel">
            
            {/* Address */}
            <div className="contact-info-card">
              <h3>Showroom Address</h3>
              <p>SF934, Deans Trade Centre, Peshawar</p>
              <div style={{ marginTop: '12px' }}>
                <a 
                  href="https://maps.google.com/?q=Deans+Trade+Centre+Peshawar" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="nav-link"
                  style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}
                >
                  View Location &rarr;
                </a>
              </div>
            </div>

            {/* Direct Connect channels */}
            <div className="contact-info-card">
              <h3>Phone & WhatsApp</h3>
              <p>T: <a href="tel:03341020791">03341020791</a></p>
              <div style={{ marginTop: '12px' }}>
                <a 
                  href={waLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  style={{ display: 'inline-flex', width: '100%', textAlign: 'center', fontSize: 'var(--font-size-xs)', letterSpacing: '0.1em', position: 'relative', zIndex: 1 }}
                >
                  Enquire on WhatsApp &rarr;
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="contact-info-card">
              <h3>Email Enquiries</h3>
              <p>E: <a href="mailto:junaidkkhan2113@gmail.com">junaidkkhan2113@gmail.com</a></p>
              <div style={{ marginTop: '12px' }}>
                <a 
                  href="mailto:junaidkkhan2113@gmail.com" 
                  className="btn-primary"
                  style={{ display: 'inline-flex', width: '100%', textAlign: 'center', fontSize: 'var(--font-size-xs)', letterSpacing: '0.1em', borderColor: 'rgba(229, 212, 188, 0.3)', backgroundColor: 'transparent', position: 'relative', zIndex: 1 }}
                >
                  Send an Email &rarr;
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="contact-info-card">
              <h3>Working Hours</h3>
              <p>9:00 AM – 5:00 PM</p>
            </div>

            {/* Showroom visual display */}
            <div className="contact-visual-showcase image-reveal" aria-hidden="true" style={{ overflow: 'hidden', border: '1px solid var(--border-color)', height: '240px', marginTop: 'var(--spacing-md)' }}>
              <img 
                src="/Images/showroom visual.jpeg" 
                alt="Peshawar Deans Trade Centre Showroom" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
            </div>

          </div>

          {/* Right Column: Enquiry Form */}
          <div className="contact-form-panel">
            {formSubmitted ? (
              <div className="enquiry-success-card">
                <span className="text-overline">Enquiry Sent</span>
                <h3>WhatsApp Opened</h3>
                <p>
                  Your enquiry has been forwarded to our WhatsApp. If the chat did not open automatically, contact us directly:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-md)' }}>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ display: 'inline-flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}
                  >
                    Open WhatsApp &rarr;
                  </a>
                  <a
                    href="mailto:junaidkkhan2113@gmail.com"
                    className="btn-primary"
                    style={{ display: 'inline-flex', justifyContent: 'center', borderColor: 'rgba(229, 212, 188, 0.3)', position: 'relative', zIndex: 1 }}
                  >
                    Send Email Instead &rarr;
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="contact-form" noValidate>
                <div className={`form-group ${errors.fullName ? 'has-error' : ''}`}>
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                  {errors.fullName && (
                    <span id="fullName-error" className="validation-error" role="alert">
                      {errors.fullName}
                    </span>
                  )}
                </div>

                <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <span id="email-error" className="validation-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                  <label htmlFor="phone">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <span id="phone-error" className="validation-error" role="alert">
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="gemstoneInterest">Gemstone Interested In</label>
                  <input
                    type="text"
                    id="gemstoneInterest"
                    name="gemstoneInterest"
                    value={formData.gemstoneInterest}
                    onChange={handleInputChange}
                    placeholder="e.g. Kashmir Sapphire (VS1)"
                  />
                </div>

                <div className={`form-group ${errors.message ? 'has-error' : ''}`}>
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe specifications, origins, and carat weight requirements."
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <span id="message-error" className="validation-error" role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                <button type="submit" className="btn-primary">
                  Send Enquiry &rarr;
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

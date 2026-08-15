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
      // Prepped for future backend/API database integration in subsequent phases
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
              <div style={{ marginTop: '8px' }}>
                {/* VIEW LOCATION ready for future Google Maps parameters configurations */}
                <a 
                  href="https://maps.google.com/?q=Deans+Trade+Centre+Peshawar" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="nav-link"
                  style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}
                >
                  View Location &rarr;
                </a>
              </div>
            </div>

            {/* Direct Connect channels */}
            <div className="contact-info-card">
              <h3>Phone & WhatsApp</h3>
              <p>T: <a href="tel:03341020791">03341020791</a></p>
              <div style={{ marginTop: '8px' }}>
                <a 
                  href={waLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="nav-link"
                  style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}
                >
                  WhatsApp Us &rarr;
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="contact-info-card">
              <h3>Email Enquiries</h3>
              <p>E: <a href="mailto:junaidkkhan2113@gmail.com">junaidkkhan2113@gmail.com</a></p>
              <div style={{ marginTop: '8px' }}>
                <a 
                  href="mailto:junaidkkhan2113@gmail.com" 
                  className="nav-link"
                  style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}
                >
                  Email Us &rarr;
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="contact-info-card">
              <h3>Working Hours</h3>
              <p>9:00 AM – 5:00 PM</p>
            </div>

            {/* Subtle crystal visual block */}
            <div className="contact-visual-showcase" aria-hidden="true">
              <svg viewBox="0 0 100 100" fill="none" stroke="rgba(250, 248, 245, 0.25)" strokeWidth="0.75">
                <polygon points="50,15 75,30 75,70 50,85 25,70 25,30" />
                <line x1="50" y1="15" x2="50" y2="85" />
                <line x1="25" y1="30" x2="75" y2="30" />
                <line x1="25" y1="70" x2="75" y2="70" />
                <polygon points="25,30 50,50 75,30" fill="none" />
                <polygon points="25,70 50,50 75,70" fill="none" />
              </svg>
            </div>

          </div>

          {/* Right Column: Enquiry Form */}
          <div className="contact-form-panel">
            {formSubmitted ? (
              <div className="enquiry-success-card">
                <span className="text-overline">Acquisition Link</span>
                <h3>Enquiry Logged</h3>
                <p>
                  Thank you. Your enquiry has been received. A representative will contact you shortly regarding your request.
                </p>
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

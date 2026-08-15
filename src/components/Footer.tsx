import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Brand Section */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="brand-title">BLUE SAPPHIRE</span>
            <span className="brand-subtitle">GEM STONES</span>
          </Link>
          <p className="brand-statement">
            A premium gemstone house specializing in carefully selected natural gemstones for collectors, jewelers, and private clients.
          </p>
        </div>

        {/* Contact Info Section */}
        <div className="footer-contact">
          <h4 className="footer-heading">Maison Peshawar</h4>
          <address className="contact-details">
            <p className="contact-item">SF934, Deans Trade Centre, Peshawar</p>
            <p className="contact-item">
              T: <a href="tel:03341020791">03341020791</a>
            </p>
            <p className="contact-item">
              E: <a href="mailto:junaidkkhan2113@gmail.com">junaidkkhan2113@gmail.com</a>
            </p>
            <p className="contact-item">Hours: 9:00 AM – 5:00 PM</p>
          </address>
        </div>

        {/* Navigation / Links Section */}
        <div className="footer-links">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/collection">Collection</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/expertise">Expertise</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Direct Inquiries Section */}
        <div className="footer-social">
          <h4 className="footer-heading">Inquiries</h4>
          <ul className="social-list">
            <li>
              <a href="https://wa.me/923341020791" target="_blank" rel="noopener noreferrer">
                WhatsApp Inquiry
              </a>
            </li>
            <li>
              <a href="mailto:junaidkkhan2113@gmail.com">
                Email Inquiry
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="copyright">
          &copy; {currentYear} Blue Sapphire Gem Stones. All rights reserved.
        </p>
        <p className="credits">Fine Gemstones & Craftsmanship</p>
      </div>
    </footer>
  );
}

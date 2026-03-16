import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faXTwitter, faGithub, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const handleAnchorClick = (e, href) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/assets/logo.svg" alt="Meptrasoft" className="footer-logo" />
            <p>Building AI-powered products, training the next generation of engineers, and providing real-world project experience.</p>
          </div>
          <div className="footer-links">
            <h4>Products</h4>
            <ul>
              <li><a href="#products" onClick={(e) => handleAnchorClick(e, '#products')}>AI Exam Platform</a></li>
              <li><a href="#products" onClick={(e) => handleAnchorClick(e, '#products')}>Placement Platform</a></li>
              <li><a href="#products" onClick={(e) => handleAnchorClick(e, '#products')}>Document Intelligence</a></li>
              <li><a href="#products" onClick={(e) => handleAnchorClick(e, '#products')}>Analytics Platform</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Programs</h4>
            <ul>
              <li><a href="#training" onClick={(e) => handleAnchorClick(e, '#training')}>Training Programs</a></li>
              <li><a href="#courses" onClick={(e) => handleAnchorClick(e, '#courses')}>Professional Courses</a></li>
              <li><a href="#internship" onClick={(e) => handleAnchorClick(e, '#internship')}>Internships</a></li>
              <li><a href="#projects" onClick={(e) => handleAnchorClick(e, '#projects')}>Final Year Projects</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="#about" onClick={(e) => handleAnchorClick(e, '#about')}>About Us</a></li>
              <li><a href="#career" onClick={(e) => handleAnchorClick(e, '#career')}>Careers</a></li>
              <li><a href="#services" onClick={(e) => handleAnchorClick(e, '#services')}>Solutions</a></li>
              <li><a href="#register" onClick={(e) => handleAnchorClick(e, '#register')}>Register / Apply</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Connect</h4>
            <ul>
              <li><a href="#contact" onClick={(e) => handleAnchorClick(e, '#contact')}>Contact Us</a></li>
              <li><a href="https://wa.me/919345984804" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faWhatsapp} /> WhatsApp</a></li>
              <li><a href="#"><FontAwesomeIcon icon={faLinkedinIn} /> LinkedIn</a></li>
              <li><a href="#"><FontAwesomeIcon icon={faGithub} /> GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Meptrasoft AI Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

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
            <p>Building AI-powered products and the next generation of engineers.</p>
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
            <h4>Company</h4>
            <ul>
              <li><a href="#about" onClick={(e) => handleAnchorClick(e, '#about')}>About Us</a></li>
              <li><a href="#services" onClick={(e) => handleAnchorClick(e, '#services')}>Solutions</a></li>
              <li><a href="#internship" onClick={(e) => handleAnchorClick(e, '#internship')}>Internship</a></li>
              <li><a href="#training" onClick={(e) => handleAnchorClick(e, '#training')}>Training</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Connect</h4>
            <ul>
              <li><a href="#contact" onClick={(e) => handleAnchorClick(e, '#contact')}>Contact Us</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">GitHub</a></li>
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

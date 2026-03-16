import { useState, useEffect } from 'react';

const navItems = [
  { href: '#hero', label: 'Home' },
  { href: '#products', label: 'Products' },
  { href: '#services', label: 'Solutions' },
  { href: '#career', label: 'Career' },
  { href: '#internship', label: 'Internship' },
  { href: '#training', label: 'Training' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  };

  return (
    <>
      <div className={`header-wrap${scrolled ? ' scrolled' : ''}`} id="header">
        <header className="header">
          <a href="#" className="logo" onClick={(e) => handleAnchorClick(e, '#hero')}>
            <img src="/assets/logo.svg" alt="Meptrasoft AI Technologies" className="logo-img" />
          </a>
          <ul className="nav-links">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className={`nav-link${activeSection === href.slice(1) ? ' active' : ''}`}
                  onClick={(e) => handleAnchorClick(e, href)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn-cta-header" onClick={(e) => handleAnchorClick(e, '#contact')}>
            Contact Us
          </a>
          <button
            className="mobile-toggle"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </header>
      </div>

      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        <ul className="mobile-nav-links">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={(e) => handleAnchorClick(e, href)}>{label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

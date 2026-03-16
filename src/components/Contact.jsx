import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
  const sectionRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('[data-animate]');
    if (!elements?.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      e.target.reset();
    }, 3000);
  };

  return (
    <section className="section contact" id="contact" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Contact</span>
          <h2 className="section-title">Get in <span className="gradient-text">Touch</span></h2>
          <p className="section-sub">Ready to build something intelligent? Let's talk.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info" data-animate>
            <div className="contact-item">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div>
                <h4>Email</h4>
                <p>contact@meptrasoft.com</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <div>
                <h4>Location</h4>
                <p>3rd Street, SSBDL - Near Alpha City, Navalur, Chennai, Tamil Nadu 600130</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div>
                <h4>Phone</h4>
                <p>+91 9345984804</p>
              </div>
            </div>
          </div>
          <form className="contact-form" data-animate onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
            </div>
            <div className="form-group">
              <select required defaultValue="">
                <option value="" disabled>Select Interest</option>
                <option>AI Product Development</option>
                <option>SaaS Platform</option>
                <option>Internship Program</option>
                <option>Training Program</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows="5" required />
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={submitted} style={submitted ? { opacity: 0.7 } : {}}>
              <span>{submitted ? 'Message Sent!' : 'Send Message'}</span>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

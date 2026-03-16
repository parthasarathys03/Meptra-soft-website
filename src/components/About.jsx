import { useEffect, useRef } from 'react';

export default function About() {
  const sectionRef = useRef(null);

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

  return (
    <section className="section about" id="about" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          <div className="about-content" data-animate>
            <span className="section-tag">About Us</span>
            <h2 className="section-title">Pioneering <span className="gradient-text">AI Innovation</span></h2>
            <p>Meptrasoft AI Technologies is an AI-first technology company building intelligent products that solve real-world problems. We combine deep expertise in artificial intelligence, data engineering, and software development to create platforms that drive business transformation.</p>
            <p>Beyond products, we are committed to building the next generation of engineers. Our internship and training programs provide hands-on experience with production-grade AI systems, ensuring graduates are industry-ready from day one.</p>
            <div className="about-values">
              <div className="value">
                <div className="value-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <span>AI-First Approach</span>
              </div>
              <div className="value">
                <div className="value-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                </div>
                <span>Engineer-Led Culture</span>
              </div>
              <div className="value">
                <div className="value-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <span>Production-Grade Quality</span>
              </div>
            </div>
          </div>
          <div className="about-visual" data-animate>
            <div className="about-card-stack">
              <div className="about-float-card afc-1">
                <span className="afc-num">50+</span>
                <span className="afc-label">AI Models in Production</span>
              </div>
              <div className="about-float-card afc-2">
                <span className="afc-num">500+</span>
                <span className="afc-label">Engineers Trained</span>
              </div>
              <div className="about-float-card afc-3">
                <span className="afc-num">10+</span>
                <span className="afc-label">SaaS Products Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

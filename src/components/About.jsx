import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faUsers, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

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
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>
                <span>AI-First Approach</span>
              </div>
              <div className="value">
                <div className="value-icon">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <span>Engineer-Led Culture</span>
              </div>
              <div className="value">
                <div className="value-icon">
                  <FontAwesomeIcon icon={faLayerGroup} />
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

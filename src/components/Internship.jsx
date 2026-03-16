import { useEffect, useRef } from 'react';

const internships = [
  { num: '01', title: 'Artificial Intelligence Engineering', desc: 'Work on production AI systems including NLP, computer vision, and deep learning models.' },
  { num: '02', title: 'Data Science', desc: 'Analyze datasets, build predictive models, and drive data-informed product decisions.' },
  { num: '03', title: 'Data Engineering', desc: 'Design and build scalable data pipelines, ETL workflows, and real-time data systems.' },
  { num: '04', title: 'Backend Development', desc: 'Build robust APIs, microservices, and server-side systems with modern frameworks.' },
  { num: '05', title: 'SaaS Product Development', desc: 'Contribute to building multi-tenant SaaS platforms with modern cloud architecture.' },
  { num: '06', title: 'Full Stack Development', desc: 'End-to-end development from frontend interfaces to backend APIs and databases.' },
];

export default function Internship() {
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

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="section internship" id="internship" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Internship</span>
          <h2 className="section-title">Industry <span className="gradient-text">Internship Programs</span></h2>
          <p className="section-sub">Gain real-world experience building AI products alongside our engineering team.</p>
        </div>
        <div className="internship-grid">
          {internships.map((item) => (
            <div className="intern-card" data-animate key={item.num}>
              <div className="intern-number">{item.num}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="intern-duration">3–6 Months</span>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <a href="#contact" className="btn-primary" onClick={(e) => handleAnchorClick(e, '#contact')}>
            <span>Join Internship</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

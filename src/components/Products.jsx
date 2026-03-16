import { useEffect, useRef } from 'react';

function useScrollAnimate(ref) {
  useEffect(() => {
    const elements = ref.current?.querySelectorAll('[data-animate]');
    if (!elements?.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), index * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const products = [
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="#01808e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="28" height="28" rx="6"/>
        <path d="M11 18l5 5 9-10"/>
        <circle cx="18" cy="10" r="2" fill="#01808e" stroke="none"/>
      </svg>
    ),
    name: 'AI Exam Intelligence Platform',
    desc: 'Automated exam generation, intelligent grading, and deep analytics powered by machine learning for smarter assessments.',
    tags: ['NLP', 'ML', 'Analytics'],
  },
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="#01808e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 4a7 7 0 017 7c0 2-.8 3.8-2 5l3 3-3 3-3-3a7 7 0 01-9-6.5"/>
        <path d="M8 22l4-4M18 26v6M12 32h12"/>
        <circle cx="18" cy="11" r="3" strokeWidth="2"/>
      </svg>
    ),
    name: 'AI Placement Preparation Platform',
    desc: 'Personalized learning paths, mock interviews with AI, resume analysis, and company-specific preparation for career success.',
    tags: ['AI Coach', 'Career', 'Prep'],
  },
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="#01808e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4h24a2 2 0 012 2v24a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"/>
        <path d="M10 12h16M10 18h16M10 24h10"/>
        <circle cx="27" cy="24" r="3" fill="#01808e" stroke="none"/>
        <path d="M25.5 24l1 1 2-2" stroke="#fff" strokeWidth="1.2"/>
      </svg>
    ),
    name: 'AI Document Intelligence Platform',
    desc: 'Extract, classify, and process documents with state-of-the-art OCR, NLP, and AI models for enterprise document workflows.',
    tags: ['OCR', 'NLP', 'Enterprise'],
  },
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="#01808e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="30" height="30" rx="6"/>
        <path d="M8 26l6-8 5 5 5-9 4 5"/>
        <circle cx="8" cy="26" r="1.5" fill="#01808e" stroke="none"/>
        <circle cx="14" cy="18" r="1.5" fill="#01808e" stroke="none"/>
        <circle cx="19" cy="23" r="1.5" fill="#01808e" stroke="none"/>
        <circle cx="24" cy="14" r="1.5" fill="#01808e" stroke="none"/>
        <circle cx="28" cy="19" r="1.5" fill="#01808e" stroke="none"/>
      </svg>
    ),
    name: 'Data Analytics & BI Platform',
    desc: 'Real-time dashboards, predictive analytics, and business intelligence tools to make data-driven decisions at scale.',
    tags: ['BI', 'Dashboards', 'Predictive'],
  },
];

export default function Products() {
  const sectionRef = useRef(null);
  useScrollAnimate(sectionRef);

  return (
    <section className="section products" id="products" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Products</span>
          <h2 className="section-title">Our <span className="gradient-text">AI Products</span></h2>
          <p className="section-sub">Intelligent platforms built to transform industries with AI and data-driven insights.</p>
        </div>
        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" data-animate key={p.name}>
              <div className="product-icon">{p.icon}</div>
              <h3 className="product-name">{p.name}</h3>
              <p className="product-desc">{p.desc}</p>
              <div className="product-tags">
                {p.tags.map(t => <span key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

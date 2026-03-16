import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faUserGraduate, faFileLines, faChartLine } from '@fortawesome/free-solid-svg-icons';

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
    icon: <FontAwesomeIcon icon={faClipboardCheck} />,
    name: 'AI Exam Intelligence Platform',
    desc: 'Automated exam generation, intelligent grading, and deep analytics powered by machine learning for smarter assessments.',
    tags: ['NLP', 'ML', 'Analytics'],
  },
  {
    icon: <FontAwesomeIcon icon={faUserGraduate} />,
    name: 'AI Placement Preparation Platform',
    desc: 'Personalized learning paths, mock interviews with AI, resume analysis, and company-specific preparation for career success.',
    tags: ['AI Coach', 'Career', 'Prep'],
  },
  {
    icon: <FontAwesomeIcon icon={faFileLines} />,
    name: 'AI Document Intelligence Platform',
    desc: 'Extract, classify, and process documents with state-of-the-art OCR, NLP, and AI models for enterprise document workflows.',
    tags: ['OCR', 'NLP', 'Enterprise'],
  },
  {
    icon: <FontAwesomeIcon icon={faChartLine} />,
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

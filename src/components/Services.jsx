import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faLaptopCode, faDatabase, faBullseye, faCode, faChartColumn } from '@fortawesome/free-solid-svg-icons';

const services = [
  {
    icon: <FontAwesomeIcon icon={faWandMagicSparkles} />,
    title: 'AI Product Development',
    desc: 'Build intelligent products with NLP, computer vision, recommendation systems, and generative AI capabilities.',
  },
  {
    icon: <FontAwesomeIcon icon={faLaptopCode} />,
    title: 'SaaS Platform Engineering',
    desc: 'Scalable, multi-tenant SaaS platforms with modern architecture, microservices, and cloud-native design.',
  },
  {
    icon: <FontAwesomeIcon icon={faDatabase} />,
    title: 'Data Engineering Systems',
    desc: 'Build robust data pipelines, data lakes, warehouses, and ETL systems for real-time and batch processing.',
  },
  {
    icon: <FontAwesomeIcon icon={faBullseye} />,
    title: 'Machine Learning Solutions',
    desc: 'Custom ML models for prediction, classification, anomaly detection, and optimization across domains.',
  },
  {
    icon: <FontAwesomeIcon icon={faCode} />,
    title: 'Custom Software Development',
    desc: 'Full-cycle development of enterprise applications, APIs, and digital platforms tailored to business needs.',
  },
  {
    icon: <FontAwesomeIcon icon={faChartColumn} />,
    title: 'Data Analytics Platforms',
    desc: 'Interactive dashboards, data visualization, and analytics platforms for actionable business intelligence.',
  },
];

export default function Services() {
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
    <section className="section services" id="services" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Solutions</span>
          <h2 className="section-title">AI & Data <span className="gradient-text">Technology Services</span></h2>
          <p className="section-sub">End-to-end technology services from ideation to deployment, powered by AI expertise.</p>
        </div>
        <div className="services-grid">
          {services.map((s) => (
            <div className="service-card" data-animate key={s.title}>
              <div className="service-icon-wrap">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

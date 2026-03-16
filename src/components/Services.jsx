import { useEffect, useRef } from 'react';

const services = [
  {
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#01808e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><path d="M17 3l1.5 1.5L21 2"/></svg>,
    title: 'AI Product Development',
    desc: 'Build intelligent products with NLP, computer vision, recommendation systems, and generative AI capabilities.',
  },
  {
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#01808e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M6 8h4M6 11h8"/></svg>,
    title: 'SaaS Platform Engineering',
    desc: 'Scalable, multi-tenant SaaS platforms with modern architecture, microservices, and cloud-native design.',
  },
  {
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#01808e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/><path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"/><path d="M4 14v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"/></svg>,
    title: 'Data Engineering Systems',
    desc: 'Build robust data pipelines, data lakes, warehouses, and ETL systems for real-time and batch processing.',
  },
  {
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#01808e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>,
    title: 'Machine Learning Solutions',
    desc: 'Custom ML models for prediction, classification, anomaly detection, and optimization across domains.',
  },
  {
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#01808e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>,
    title: 'Custom Software Development',
    desc: 'Full-cycle development of enterprise applications, APIs, and digital platforms tailored to business needs.',
  },
  {
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#01808e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/><path d="M3 20h18"/><circle cx="6" cy="14" r="1.5" fill="#01808e" stroke="none"/><circle cx="12" cy="4" r="1.5" fill="#01808e" stroke="none"/><circle cx="18" cy="10" r="1.5" fill="#01808e" stroke="none"/></svg>,
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

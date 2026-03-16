import { useEffect, useRef } from 'react';

const programs = [
  {
    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a4 4 0 014 4c0 1.1-.9 2-2 2h-4a2 2 0 01-2-2 4 4 0 014-4z"/><path d="M8 18a4 4 0 108 0"/><path d="M12 10v4"/></svg>,
    title: 'Artificial Intelligence',
    desc: 'Deep learning, NLP, computer vision, and generative AI with hands-on projects.',
  },
  {
    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    title: 'Data Science',
    desc: 'Statistical analysis, machine learning, visualization, and real-world data projects.',
  },
  {
    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h10"/></svg>,
    title: 'Data Engineering',
    desc: 'Data pipelines, warehousing, Spark, Kafka, and cloud data platforms.',
  },
  {
    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    title: 'Full Stack Development',
    desc: 'React, Node.js, databases, APIs, and modern full-stack architecture.',
  },
  {
    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2"/><path d="M22 2L13 11"/><path d="M16 2h6v6"/></svg>,
    title: 'Cloud Computing',
    desc: 'AWS, Azure, GCP, containerization, CI/CD, and cloud-native architecture.',
  },
];

export default function Training() {
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
    <section className="section training" id="training" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Training</span>
          <h2 className="section-title">Industry-Focused <span className="gradient-text">Training Programs</span></h2>
          <p className="section-sub">Upskill with industry-standard tools, frameworks, and methodologies used by top tech companies.</p>
        </div>
        <div className="training-grid">
          {programs.map((p) => (
            <div className="training-card" data-animate key={p.title}>
              <div className="training-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faMagnifyingGlassChart, faGears, faLayerGroup, faCloud } from '@fortawesome/free-solid-svg-icons';

const programs = [
  {
    icon: <FontAwesomeIcon icon={faBrain} />,
    title: 'Artificial Intelligence',
    desc: 'Deep learning, NLP, computer vision, and generative AI with hands-on projects.',
  },
  {
    icon: <FontAwesomeIcon icon={faMagnifyingGlassChart} />,
    title: 'Data Science',
    desc: 'Statistical analysis, machine learning, visualization, and real-world data projects.',
  },
  {
    icon: <FontAwesomeIcon icon={faGears} />,
    title: 'Data Engineering',
    desc: 'Data pipelines, warehousing, Spark, Kafka, and cloud data platforms.',
  },
  {
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
    title: 'Full Stack Development',
    desc: 'React, Node.js, databases, APIs, and modern full-stack architecture.',
  },
  {
    icon: <FontAwesomeIcon icon={faCloud} />,
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

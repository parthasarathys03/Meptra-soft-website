import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faMagnifyingGlassChart, faGears, faLayerGroup, faCloud, faArrowRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const programs = [
  {
    icon: <FontAwesomeIcon icon={faBrain} />,
    title: 'Artificial Intelligence Engineering',
    duration: '3–6 Months',
    topics: ['Machine Learning', 'Deep Learning', 'NLP', 'Generative AI', 'AI Product Development'],
    desc: 'Master AI from fundamentals to production-grade systems with hands-on projects.',
  },
  {
    icon: <FontAwesomeIcon icon={faMagnifyingGlassChart} />,
    title: 'Data Science Program',
    duration: '3 Months',
    topics: ['Python for Data Science', 'Statistics', 'Machine Learning', 'Data Visualization', 'Predictive Modeling'],
    desc: 'Statistical analysis, machine learning, visualization, and real-world data projects.',
  },
  {
    icon: <FontAwesomeIcon icon={faGears} />,
    title: 'Data Engineering Program',
    duration: '3 Months',
    topics: ['SQL', 'Data Warehousing', 'ETL Pipelines', 'Apache Spark', 'Cloud Data Platforms'],
    desc: 'Build scalable data pipelines, warehouses, and cloud data platforms.',
  },
  {
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
    title: 'Full Stack Development',
    duration: '3 Months',
    topics: ['React', 'Node.js', 'REST APIs', 'Databases', 'SaaS Architecture'],
    desc: 'End-to-end web development from frontend to backend and deployment.',
  },
  {
    icon: <FontAwesomeIcon icon={faCloud} />,
    title: 'Cloud Computing',
    duration: '3 Months',
    topics: ['AWS', 'Azure', 'GCP', 'Containerization', 'CI/CD'],
    desc: 'Cloud-native architecture, DevOps, and infrastructure management.',
  },
];

const benefits = [
  'Real-world projects from our AI product portfolio',
  'Industry mentors with 5+ years experience',
  'Resume building & interview preparation',
  'Industry-recognised certification',
  'Placement assistance & career support',
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

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="section training" id="training" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Training Programs</span>
          <h2 className="section-title">AI & Technology <span className="gradient-text">Training Programs</span> for Freshers</h2>
          <p className="section-sub">Industry-oriented training designed for students and fresh graduates to gain real-world skills in AI, Data Science, Data Engineering, and Software Development.</p>
        </div>
        <div className="training-grid">
          {programs.map((p) => (
            <div className="training-card training-card-expanded" data-animate key={p.title}>
              <div className="training-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <span className="training-duration">{p.duration}</span>
              <p>{p.desc}</p>
              <ul className="training-topics">
                {p.topics.map(t => <li key={t}>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="training-benefits" data-animate>
          <h3>Key Benefits</h3>
          <div className="benefits-list">
            {benefits.map(b => (
              <div className="benefit-item" key={b}>
                <FontAwesomeIcon icon={faCheckCircle} className="benefit-check" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="section-cta">
          <a href="#register" className="btn-primary" onClick={(e) => handleAnchorClick(e, '#register')}>
            <span>Enroll in Training</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </section>
  );
}

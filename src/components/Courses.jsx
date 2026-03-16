import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faReact, faAws } from '@fortawesome/free-brands-svg-icons';
import { faBrain, faChartLine, faDatabase, faWandMagicSparkles, faArrowRight, faClock, faFlask, faCertificate } from '@fortawesome/free-solid-svg-icons';

const courses = [
  { icon: <FontAwesomeIcon icon={faPython} />, title: 'Python for AI', duration: '4 Weeks', desc: 'Python fundamentals, NumPy, Pandas, and AI libraries.' },
  { icon: <FontAwesomeIcon icon={faBrain} />, title: 'Machine Learning', duration: '6 Weeks', desc: 'Supervised, unsupervised learning, model evaluation, and deployment.' },
  { icon: <FontAwesomeIcon icon={faChartLine} />, title: 'Data Analytics with Python', duration: '4 Weeks', desc: 'Data wrangling, visualization, and insights with real datasets.' },
  { icon: <FontAwesomeIcon icon={faDatabase} />, title: 'SQL for Data Engineering', duration: '3 Weeks', desc: 'Advanced SQL, query optimization, and data warehouse design.' },
  { icon: <FontAwesomeIcon icon={faReact} />, title: 'Full Stack Web Development', duration: '8 Weeks', desc: 'React, Node.js, REST APIs, MongoDB, and deployment.' },
  { icon: <FontAwesomeIcon icon={faWandMagicSparkles} />, title: 'Generative AI Development', duration: '6 Weeks', desc: 'LLMs, prompt engineering, RAG, and AI application building.' },
  { icon: <FontAwesomeIcon icon={faAws} />, title: 'Cloud & DevOps', duration: '6 Weeks', desc: 'AWS/Azure, Docker, Kubernetes, CI/CD pipelines.' },
];

const features = [
  { icon: <FontAwesomeIcon icon={faFlask} />, text: 'Hands-on Labs' },
  { icon: <FontAwesomeIcon icon={faBrain} />, text: 'Mini Projects' },
  { icon: <FontAwesomeIcon icon={faCertificate} />, text: 'Certification' },
];

export default function Courses() {
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
    <section className="section courses" id="courses" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Courses</span>
          <h2 className="section-title">Professional <span className="gradient-text">Short-Term Courses</span></h2>
          <p className="section-sub">Quickly build industry-ready skills with focused, hands-on courses designed for rapid upskilling.</p>
        </div>
        <div className="course-features" data-animate>
          {features.map(f => (
            <div className="course-feature" key={f.text}>
              {f.icon}
              <span>{f.text}</span>
            </div>
          ))}
        </div>
        <div className="courses-grid">
          {courses.map((c) => (
            <div className="course-card" data-animate key={c.title}>
              <div className="course-icon">{c.icon}</div>
              <div className="course-info">
                <h3>{c.title}</h3>
                <span className="course-duration"><FontAwesomeIcon icon={faClock} /> {c.duration}</span>
                <p>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <a href="#register" className="btn-primary" onClick={(e) => handleAnchorClick(e, '#register')}>
            <span>View Courses</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </section>
  );
}

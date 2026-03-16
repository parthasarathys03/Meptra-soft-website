import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faDraftingCompass, faCode, faFileAlt, faUserGraduate, faArrowRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const steps = [
  {
    num: '01',
    icon: <FontAwesomeIcon icon={faLightbulb} />,
    title: 'Topic Selection',
    desc: 'Choose from AI, Data Science, Full Stack, Data Engineering, or Cloud projects — or bring your own topic.',
  },
  {
    num: '02',
    icon: <FontAwesomeIcon icon={faDraftingCompass} />,
    title: 'Architecture Design',
    desc: 'We design system architecture, database schema, and technology stack tailored to your project.',
  },
  {
    num: '03',
    icon: <FontAwesomeIcon icon={faCode} />,
    title: 'Development',
    desc: 'Build your project with guided backend, frontend, model building, and API integration support.',
  },
  {
    num: '04',
    icon: <FontAwesomeIcon icon={faFileAlt} />,
    title: 'Documentation',
    desc: 'Get help with project report, documentation, PPT preparation, and research paper formatting.',
  },
  {
    num: '05',
    icon: <FontAwesomeIcon icon={faUserGraduate} />,
    title: 'Viva Preparation',
    desc: 'Prepare for viva questions, project explanation, and live demo with mock sessions.',
  },
];

const options = [
  'Project Guidance Only',
  'Project + Training',
  'Project + Internship',
];

export default function FinalYearProjects() {
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
    <section className="section fyp" id="projects" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Final Year Projects</span>
          <h2 className="section-title">Complete Final Year <span className="gradient-text">Project Development</span> Support</h2>
          <p className="section-sub">We help students develop industry-level projects from scratch to final submission. Choose from our ready project ideas or bring your own topic.</p>
        </div>
        <div className="fyp-steps">
          {steps.map((s) => (
            <div className="fyp-step" data-animate key={s.num}>
              <div className="fyp-step-num">{s.num}</div>
              <div className="fyp-step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="fyp-options" data-animate>
          <h3>Available Options</h3>
          <div className="fyp-option-list">
            {options.map(o => (
              <div className="fyp-option" key={o}>
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>{o}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="section-cta">
          <a href="#booking" className="btn-primary" onClick={(e) => handleAnchorClick(e, '#booking')}>
            <span>Book Project Consultation</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </section>
  );
}

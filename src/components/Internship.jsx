import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faGift, faMoneyBillWave, faRocket } from '@fortawesome/free-solid-svg-icons';

const internshipTypes = [
  {
    icon: <FontAwesomeIcon icon={faGift} />,
    type: 'Free Internship',
    desc: 'Work on internal projects, get mentorship from senior engineers, and earn an internship certificate.',
    highlights: ['Internal projects', 'Mentorship', 'Certificate'],
    badge: 'Free',
  },
  {
    icon: <FontAwesomeIcon icon={faMoneyBillWave} />,
    type: 'Paid Internship',
    desc: 'Work on production systems, contribute to real products, and receive a monthly stipend.',
    highlights: ['Production systems', 'Real products', 'Stipend'],
    badge: 'Paid',
  },
  {
    icon: <FontAwesomeIcon icon={faRocket} />,
    type: 'Real Product Internship',
    desc: 'Contribute directly to our AI SaaS platforms, data analytics systems, and AI automation tools.',
    highlights: ['AI SaaS platforms', 'Data analytics', 'AI automation'],
    badge: 'Premium',
  },
];

const roles = [
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
          <p className="section-sub">Gain hands-on experience by working on real AI products developed at Meptrasoft. Duration: 3–6 Months.</p>
        </div>
        <div className="internship-types">
          {internshipTypes.map((t) => (
            <div className="intern-type-card" data-animate key={t.type}>
              <span className="intern-badge">{t.badge}</span>
              <div className="intern-type-icon">{t.icon}</div>
              <h3>{t.type}</h3>
              <p>{t.desc}</p>
              <ul className="intern-highlights">
                {t.highlights.map(h => <li key={h}>{h}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <h3 className="intern-roles-title">Available Roles</h3>
        <div className="internship-grid">
          {roles.map((item) => (
            <div className="intern-card" data-animate key={item.num}>
              <div className="intern-number">{item.num}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="intern-duration">3–6 Months</span>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <a href="#register" className="btn-primary" onClick={(e) => handleAnchorClick(e, '#register')}>
            <span>Apply for Internship</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </section>
  );
}

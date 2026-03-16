import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faGraduationCap, faHandshake, faRocket, faTrophy, faBrain, faChartLine, faServer, faLayerGroup, faDatabase } from '@fortawesome/free-solid-svg-icons';

const highlights = [
  { icon: <FontAwesomeIcon icon={faGraduationCap} />, title: 'Real-World Projects', sub: 'Work on live AI products' },
  { icon: <FontAwesomeIcon icon={faHandshake} />, title: 'Mentorship', sub: 'Guided by industry experts' },
  { icon: <FontAwesomeIcon icon={faRocket} />, title: 'Placement Support', sub: 'Resume & interview prep' },
  { icon: <FontAwesomeIcon icon={faTrophy} />, title: 'Certification', sub: 'Industry-recognised credentials' },
];

const openRoles = [
  { icon: <FontAwesomeIcon icon={faBrain} />, title: 'AI Engineer', desc: 'Build and deploy production AI/ML models and systems.' },
  { icon: <FontAwesomeIcon icon={faChartLine} />, title: 'Data Scientist', desc: 'Analyze data, build predictive models, and derive insights.' },
  { icon: <FontAwesomeIcon icon={faServer} />, title: 'Backend Developer', desc: 'Design APIs, microservices, and scalable server systems.' },
  { icon: <FontAwesomeIcon icon={faLayerGroup} />, title: 'Full Stack Developer', desc: 'Build end-to-end web applications and SaaS platforms.' },
  { icon: <FontAwesomeIcon icon={faDatabase} />, title: 'Data Engineer', desc: 'Design data pipelines, warehouses, and ETL systems.' },
];

export default function Career() {
  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="section career" id="career">
      <div className="logo-bg-section">
        <img src="/assets/logo.svg" alt="" className="logo-bg-img" aria-hidden="true" />
        <div className="logo-bg-overlay" />
        <div className="container logo-bg-content">
          <span className="section-tag">Careers</span>
          <h2 className="section-title" style={{ color: '#fff' }}>
            Build Your Career with <span className="gradient-text">Meptrasoft AI</span>
          </h2>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.82)', maxWidth: '700px', margin: '0 auto' }}>
            Join our team building AI-powered products and advanced data platforms. We offer internship programs, training, and full-time roles for passionate engineers, data scientists, and product builders.
          </p>
          <div className="career-cta-btns">
            <a href="#register" className="btn-primary" onClick={(e) => handleAnchorClick(e, '#register')}>
              <span>View Career Opportunities</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
            <a href="#training" className="btn-secondary" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }} onClick={(e) => handleAnchorClick(e, '#training')}>
              <span>Explore Training</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>
          <div className="career-highlights">
            {highlights.map((h) => (
              <div className="career-highlight-item" key={h.title}>
                <span className="career-icon">{h.icon}</span>
                <strong>{h.title}</strong>
                <span>{h.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="open-roles">
          <h3 className="open-roles-title">Open Roles</h3>
          <div className="roles-grid">
            {openRoles.map(r => (
              <div className="role-card" key={r.title}>
                <div className="role-icon">{r.icon}</div>
                <div>
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

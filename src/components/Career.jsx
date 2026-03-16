const highlights = [
  { icon: '🎓', title: 'Real-World Projects', sub: 'Work on live AI products' },
  { icon: '🤝', title: 'Mentorship', sub: 'Guided by industry experts' },
  { icon: '🚀', title: 'Placement Support', sub: 'Resume & interview prep' },
  { icon: '🏆', title: 'Certification', sub: 'Industry-recognised credentials' },
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
          <span className="section-tag">Career</span>
          <h2 className="section-title" style={{ color: '#fff' }}>
            Build Your Career with <span className="gradient-text">Meptrasoft AI</span>
          </h2>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Join a team of innovators building the future of AI. We offer internship programs, training, and full-time roles for passionate engineers, data scientists, and product builders.
          </p>
          <div className="career-cta-btns">
            <a href="#internship" className="btn-primary" onClick={(e) => handleAnchorClick(e, '#internship')}>
              <span>View Internships</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#training" className="btn-secondary" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }} onClick={(e) => handleAnchorClick(e, '#training')}>
              <span>Explore Training</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
    </section>
  );
}

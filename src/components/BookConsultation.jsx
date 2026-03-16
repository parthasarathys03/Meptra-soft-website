import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faComments, faGraduationCap, faRocket, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const topics = [
  { icon: <FontAwesomeIcon icon={faGraduationCap} />, text: 'Training Programs' },
  { icon: <FontAwesomeIcon icon={faComments} />, text: 'Final Year Projects' },
  { icon: <FontAwesomeIcon icon={faRocket} />, text: 'Internships' },
  { icon: <FontAwesomeIcon icon={faCalendarCheck} />, text: 'Career Guidance' },
];

export default function BookConsultation() {
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
    <section className="section booking" id="booking" ref={sectionRef}>
      <div className="container">
        <div className="booking-inner" data-animate>
          <div className="booking-content">
            <span className="section-tag">Free Consultation</span>
            <h2 className="section-title">Book a Free <span className="gradient-text">15-Minute</span> Consultation</h2>
            <p>Discuss your goals with our team. We'll help you find the right program, project, or career path.</p>
            <div className="booking-topics">
              {topics.map(t => (
                <div className="booking-topic" key={t.text}>
                  {t.icon}
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
            <div className="booking-actions">
              <a href="#register" className="btn-primary" onClick={(e) => { e.preventDefault(); document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span>Book a Call</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </a>
              <a href="https://wa.me/919345984804" className="btn-secondary btn-whatsapp" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faWhatsapp} />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

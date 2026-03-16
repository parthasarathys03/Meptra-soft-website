import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default function Register() {
  const sectionRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      e.target.reset();
    }, 3000);
  };

  return (
    <section className="section register" id="register" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Register / Apply</span>
          <h2 className="section-title">Start Your <span className="gradient-text">Journey</span> with Us</h2>
          <p className="section-sub">One simple form for all programs — training, courses, internships, projects, and career applications.</p>
        </div>
        <form className="register-form" data-animate onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input type="text" placeholder="Full Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email Address" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <input type="tel" placeholder="Phone Number" required />
            </div>
            <div className="form-group">
              <input type="text" placeholder="College / University" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <select defaultValue="">
                <option value="" disabled>Year of Study</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year / Final Year</option>
                <option>Graduate / Fresher</option>
                <option>Working Professional</option>
              </select>
            </div>
            <div className="form-group">
              <select required defaultValue="">
                <option value="" disabled>Program Type</option>
                <option>Training Program</option>
                <option>Professional Course</option>
                <option>Internship</option>
                <option>Final Year Project</option>
                <option>Career Application</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <textarea placeholder="Message (optional)" rows="4" />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={submitted} style={submitted ? { opacity: 0.7 } : {}}>
            <span>{submitted ? 'Application Submitted!' : 'Submit Application'}</span>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </section>
  );
}

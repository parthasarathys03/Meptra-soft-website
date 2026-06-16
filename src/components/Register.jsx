import { useRef, useState, useEffect } from 'react';
import { Send } from 'grommet-icons';
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

  const fieldCls = 'w-full rounded-[12px] border border-border bg-white px-[18px] py-3.5 font-sans text-[0.9rem] transition duration-[400ms] ease-smooth focus:border-teal focus:shadow-[0_0_0_3px_rgba(1,128,142,0.1)] focus:outline-none';

  return (
    <section className="relative bg-white py-[100px] even:bg-bg-light max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="register" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="mb-[64px] text-center max-[1024px]:mb-[48px] max-[768px]:mb-[36px]">
          <span className="mb-[14px] inline-block rounded-pill border-[1.5px] border-[rgba(1,128,142,0.25)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">Register / Apply</span>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-text-dark max-[480px]:text-[1.5rem]">Start Your <span className="text-teal">Journey</span> with Us</h2>
          <p className="mx-auto max-w-[600px] text-[1.05rem] leading-[1.75] text-text-body max-[480px]:text-[0.92rem]">One simple form for all programs — training, courses, internships, projects, and career applications.</p>
        </div>
        <form className="mx-auto max-w-[700px]" data-animate onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 max-[768px]:grid-cols-1">
            <div className="mb-4">
              <input className={fieldCls} type="text" placeholder="Full Name" required />
            </div>
            <div className="mb-4">
              <input className={fieldCls} type="email" placeholder="Email Address" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 max-[768px]:grid-cols-1">
            <div className="mb-4">
              <input className={fieldCls} type="tel" placeholder="Phone Number" required />
            </div>
            <div className="mb-4">
              <input className={fieldCls} type="text" placeholder="College / University" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 max-[768px]:grid-cols-1">
            <div className="mb-4">
              <select className={fieldCls} defaultValue="">
                <option value="" disabled>Year of Study</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year / Final Year</option>
                <option>Graduate / Fresher</option>
                <option>Working Professional</option>
              </select>
            </div>
            <div className="mb-4">
              <select className={fieldCls} required defaultValue="">
                <option value="" disabled>Program Type</option>
                <option>Training Program</option>
                <option>Professional Course</option>
                <option>Internship</option>
                <option>Final Year Project</option>
                <option>Career Application</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <textarea className={fieldCls} placeholder="Message (optional)" rows="4" />
          </div>
          <button type="submit" className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-pill border-0 bg-orange px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:bg-[#fde8e4] hover:text-orange hover:shadow-[0_4px_20px_rgba(232,116,74,0.15)] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem]" disabled={submitted} style={submitted ? { opacity: 0.7 } : {}}>
            <span>{submitted ? 'Application Submitted!' : 'Submit Application'}</span>
            <Send size="medium" />
          </button>
        </form>
      </div>
    </section>
  );
}

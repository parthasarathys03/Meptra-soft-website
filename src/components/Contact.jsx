import { useEffect, useRef, useState } from 'react';
import { MailOption, Location, Phone, Send } from 'grommet-icons';

export default function Contact() {
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

  const fieldCls = 'w-full rounded-[12px] border-2 border-border bg-white px-[18px] py-3.5 font-sans text-[0.9rem] text-text-dark outline-none transition duration-[400ms] ease-smooth placeholder:text-text-muted focus:border-teal focus:shadow-[0_0_0_3px_rgba(1,128,142,0.08)]';

  return (
    <section className="relative bg-white py-[100px] even:bg-bg-light max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="contact" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="mb-[64px] text-center max-[1024px]:mb-[48px] max-[768px]:mb-[36px]">
          <span className="mb-[14px] inline-block rounded-pill border-[1.5px] border-[rgba(1,128,142,0.25)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">Contact</span>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-text-dark max-[480px]:text-[1.5rem]">Get in <span className="text-teal">Touch</span></h2>
          <p className="mx-auto max-w-[600px] text-[1.05rem] leading-[1.75] text-text-body max-[480px]:text-[0.92rem]">Ready to build something intelligent? Let's talk.</p>
        </div>
        <div className="grid grid-cols-[1fr_1.5fr] items-start gap-12 max-[1024px]:grid-cols-1">
          <div data-animate>
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[rgba(1,128,142,0.15)] bg-[rgba(1,128,142,0.06)] text-teal">
                <MailOption size="medium" className="meptra-icon" />
              </div>
              <div>
                <h4 className="mb-1 text-[0.9rem] font-bold text-text-dark">Email</h4>
                <p className="text-[0.85rem] text-text-muted">contact@meptrasoft.com</p>
              </div>
            </div>
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[rgba(1,128,142,0.15)] bg-[rgba(1,128,142,0.06)] text-teal">
                <Location size="medium" className="meptra-icon" />
              </div>
              <div>
                <h4 className="mb-1 text-[0.9rem] font-bold text-text-dark">Location</h4>
                <p className="text-[0.85rem] text-text-muted">3rd Street, SSBDL - Near Alpha City, Navalur, Chennai, Tamil Nadu 600130</p>
              </div>
            </div>
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[rgba(1,128,142,0.15)] bg-[rgba(1,128,142,0.06)] text-teal">
                <Phone size="medium" className="meptra-icon" />
              </div>
              <div>
                <h4 className="mb-1 text-[0.9rem] font-bold text-text-dark">Phone</h4>
                <p className="text-[0.85rem] text-text-muted">+91 9345984804</p>
              </div>
            </div>
          </div>
          <form className="flex flex-col gap-4" data-animate onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 max-[768px]:grid-cols-1">
              <div>
                <input className={fieldCls} type="text" placeholder="Your Name" required />
              </div>
              <div>
                <input className={fieldCls} type="email" placeholder="Your Email" required />
              </div>
            </div>
            <div>
              <select className={`${fieldCls} cursor-pointer appearance-none text-text-muted`} required defaultValue="">
                <option className="bg-white text-text-dark" value="" disabled>Select Interest</option>
                <option className="bg-white text-text-dark">AI Product Development</option>
                <option className="bg-white text-text-dark">SaaS Platform</option>
                <option className="bg-white text-text-dark">Internship Program</option>
                <option className="bg-white text-text-dark">Training Program</option>
                <option className="bg-white text-text-dark">Partnership</option>
                <option className="bg-white text-text-dark">Other</option>
              </select>
            </div>
            <div>
              <textarea className={`${fieldCls} min-h-[120px] resize-y`} placeholder="Your Message" rows="5" required />
            </div>
            <button type="submit" className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-pill border-0 bg-orange px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:bg-[#fde8e4] hover:text-orange hover:shadow-[0_4px_20px_rgba(232,116,74,0.15)] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem]" disabled={submitted} style={submitted ? { opacity: 0.7 } : {}}>
              <span>{submitted ? 'Message Sent!' : 'Send Message'}</span>
              <Send size="medium" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

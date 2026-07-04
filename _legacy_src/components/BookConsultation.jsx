import { useEffect, useRef } from 'react';
import { Schedule, Chat, Certificate, Launch, FormNextLink, ChatOption } from 'grommet-icons';

const topics = [
  { icon: <Certificate size="medium" className="meptra-icon text-white" />, text: 'Training Programs' },
  { icon: <Chat size="medium" className="meptra-icon text-white" />, text: 'Final Year Projects' },
  { icon: <Launch size="medium" className="meptra-icon text-white" />, text: 'Internships' },
  { icon: <Schedule size="medium" className="meptra-icon text-white" />, text: 'Career Guidance' },
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
    <section className="relative bg-white py-[100px] even:bg-bg-light max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="booking" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="rounded-[20px] bg-[linear-gradient(135deg,#0d5c5c_0%,#01808e_50%,#0f2f50_100%)] p-[64px_48px] text-center max-[768px]:p-[40px_24px] max-[480px]:p-[32px_16px]" data-animate>
          <div>
            <span className="mb-[14px] inline-block rounded-pill border border-[rgba(255,255,255,0.35)] bg-[rgba(255,255,255,0.2)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-white">Free Consultation</span>
            <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-white max-[480px]:text-[1.5rem]">Book a Free <span className="font-extrabold text-[#ffa44f]">15-Minute</span> Consultation</h2>
            <p className="mx-auto mb-8 max-w-[600px] text-[1rem] leading-[1.7] text-[rgba(255,255,255,0.9)]">Discuss your goals with our team. We'll help you find the right program, project, or career path.</p>
            <div className="mb-9 flex flex-wrap justify-center gap-6 max-[768px]:gap-4 max-[480px]:flex-col max-[480px]:items-center max-[480px]:gap-3">
              {topics.map(t => (
                <div className="flex items-center gap-2 text-[0.9rem] font-medium text-white" key={t.text}>
                  {t.icon}
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#register" className="inline-flex cursor-pointer items-center gap-2 rounded-pill border-0 bg-orange px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:bg-[#fde8e4] hover:text-orange hover:shadow-[0_4px_20px_rgba(232,116,74,0.15)] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem]" onClick={(e) => { e.preventDefault(); document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span>Book a Call</span>
                <FormNextLink size="medium" />
              </a>
              <a href="https://wa.me/919345984804" className="inline-flex cursor-pointer items-center gap-2 rounded-pill border-2 px-8 py-3.5 text-[0.95rem] font-semibold transition duration-[400ms] ease-smooth hover:-translate-y-0.5 max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem] !border-[#25d366] !bg-[#25d366] !text-white hover:!border-[#25d366] hover:!bg-[#1da851] hover:!shadow-[0_4px_16px_rgba(37,211,102,0.35)]" target="_blank" rel="noopener noreferrer">
                <ChatOption size="medium" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

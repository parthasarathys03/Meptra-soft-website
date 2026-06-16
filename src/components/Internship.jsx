import { useEffect, useRef } from 'react';
import { Gift, Money, Launch, FormNextLink } from 'grommet-icons';

const internshipTypes = [
  {
    icon: <Gift size="medium" className="meptra-icon" />,
    type: 'Free Internship',
    desc: 'Work on internal projects, get mentorship from senior engineers, and earn an internship certificate.',
    highlights: ['Internal projects', 'Mentorship', 'Certificate'],
    badge: 'Free',
  },
  {
    icon: <Money size="medium" className="meptra-icon" />,
    type: 'Paid Internship',
    desc: 'Work on production systems, contribute to real products, and receive a monthly stipend.',
    highlights: ['Production systems', 'Real products', 'Stipend'],
    badge: 'Paid',
  },
  {
    icon: <Launch size="medium" className="meptra-icon" />,
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
    <section className="relative bg-white py-[100px] even:bg-bg-light max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="internship" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="mb-[64px] text-center max-[1024px]:mb-[48px] max-[768px]:mb-[36px]">
          <span className="mb-[14px] inline-block rounded-pill border-[1.5px] border-[rgba(1,128,142,0.25)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">Internship</span>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-text-dark max-[480px]:text-[1.5rem]">Industry <span className="text-teal">Internship Programs</span></h2>
          <p className="mx-auto max-w-[600px] text-[1.05rem] leading-[1.75] text-text-body max-[480px]:text-[0.92rem]">Gain hands-on experience by working on real AI products developed at Meptrasoft. Duration: 3–6 Months.</p>
        </div>
        <div className="mb-12 grid grid-cols-3 gap-6 max-[1024px]:grid-cols-1">
          {internshipTypes.map((t) => (
            <div className="relative rounded-[16px] border border-border bg-white p-[36px_24px] text-center transition duration-[700ms] ease-smooth hover:-translate-y-[2px] hover:border-teal hover:shadow-card-hover max-[480px]:p-[28px_16px]" data-animate key={t.type}>
              <span className="absolute right-4 top-4 rounded-pill bg-teal px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.5px] text-white">{t.badge}</span>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[rgba(1,128,142,0.2)] bg-[linear-gradient(135deg,rgba(1,128,142,0.1),rgba(0,180,174,0.06))] text-[1.5rem] text-teal">{t.icon}</div>
              <h3 className="mb-2 text-[1.1rem] font-bold text-text-dark">{t.type}</h3>
              <p className="mb-3 text-[0.85rem] leading-[1.5] text-text-muted">{t.desc}</p>
              <ul className="flex list-none flex-wrap justify-center gap-1.5 p-0">
                {t.highlights.map(h => <li className="rounded-pill bg-[rgba(1,128,142,0.08)] px-3 py-1 text-[0.75rem] font-medium text-teal-dark" key={h}>{h}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <h3 className="mb-6 text-center text-[1.3rem] font-bold text-text-dark">Available Roles</h3>
        <div className="grid grid-cols-3 gap-7 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1">
          {roles.map((item) => (
            <div className="intern-card relative rounded-[20px] border-2 border-border-card bg-white p-[36px_28px] transition duration-[700ms] ease-smooth hover:-translate-y-1 hover:border-teal hover:shadow-card-hover max-[480px]:p-[24px_20px]" data-animate key={item.num}>
              <div className="mb-3.5 text-[2.4rem] font-black leading-none tracking-[-0.03em] text-teal opacity-55">{item.num}</div>
              <h3 className="mb-2.5 text-[1.1rem] font-extrabold tracking-[-0.01em] text-text-dark">{item.title}</h3>
              <p className="mb-5 text-[0.92rem] leading-[1.75] text-text-body">{item.desc}</p>
              <span className="inline-block rounded-pill border border-[rgba(1,128,142,0.22)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.8rem] font-bold text-teal">3–6 Months</span>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href="#register" className="inline-flex cursor-pointer items-center gap-2 rounded-pill border-0 bg-orange px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:bg-[#fde8e4] hover:text-orange hover:shadow-[0_4px_20px_rgba(232,116,74,0.15)] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem]" onClick={(e) => handleAnchorClick(e, '#register')}>
            <span>Apply for Internship</span>
            <FormNextLink size="medium" className="meptra-icon" />
          </a>
        </div>
      </div>
    </section>
  );
}

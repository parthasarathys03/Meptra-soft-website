import { useEffect, useRef } from 'react';
import { Tip, Edit, Code, DocumentText, Certificate, FormNextLink, StatusGood } from 'grommet-icons';

const steps = [
  {
    num: '01',
    icon: <Tip size="medium" className="meptra-icon" />,
    title: 'Topic Selection',
    desc: 'Choose from AI, Data Science, Full Stack, Data Engineering, or Cloud projects — or bring your own topic.',
  },
  {
    num: '02',
    icon: <Edit size="medium" className="meptra-icon" />,
    title: 'Architecture Design',
    desc: 'We design system architecture, database schema, and technology stack tailored to your project.',
  },
  {
    num: '03',
    icon: <Code size="medium" className="meptra-icon" />,
    title: 'Development',
    desc: 'Build your project with guided backend, frontend, model building, and API integration support.',
  },
  {
    num: '04',
    icon: <DocumentText size="medium" className="meptra-icon" />,
    title: 'Documentation',
    desc: 'Get help with project report, documentation, PPT preparation, and research paper formatting.',
  },
  {
    num: '05',
    icon: <Certificate size="medium" className="meptra-icon" />,
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
    <section className="relative bg-white py-[100px] even:bg-bg-light max-[1024px]:py-[80px] max-[768px]:py-[64px] max-[480px]:py-[48px]" id="projects" ref={sectionRef}>
      <div className="mx-auto max-w-[1200px] px-6 max-[768px]:px-4 max-[480px]:px-3">
        <div className="mb-[64px] text-center max-[1024px]:mb-[48px] max-[768px]:mb-[36px]">
          <span className="mb-[14px] inline-block rounded-pill border-[1.5px] border-[rgba(1,128,142,0.25)] bg-[rgba(1,128,142,0.08)] px-4 py-[5px] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">Final Year Projects</span>
          <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.025em] text-text-dark max-[480px]:text-[1.5rem]">Complete Final Year <span className="text-teal">Project Development</span> Support</h2>
          <p className="mx-auto max-w-[600px] text-[1.05rem] leading-[1.75] text-text-body max-[480px]:text-[0.92rem]">We help students develop industry-level projects from scratch to final submission. Choose from our ready project ideas or bring your own topic.</p>
        </div>
        <div className="mb-10 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1">
          {steps.map((s) => (
            <div className="fyp-step relative rounded-[16px] border border-border bg-white p-[32px_20px] text-center transition duration-[700ms] ease-smooth hover:-translate-y-[2px] hover:border-teal hover:shadow-card-hover max-[480px]:p-[24px_16px]" data-animate key={s.num}>
              <div className="absolute left-4 top-3 text-[0.75rem] font-extrabold text-teal opacity-50">{s.num}</div>
              <div className="fyp-step-icon mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[rgba(1,128,142,0.2)] bg-[linear-gradient(135deg,rgba(1,128,142,0.1),rgba(0,180,174,0.06))] text-[1.5rem] text-teal">{s.icon}</div>
              <h3 className="mb-2 text-[1rem] font-bold text-text-dark">{s.title}</h3>
              <p className="text-[0.85rem] leading-[1.5] text-text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mb-8 text-center" data-animate>
          <h3 className="mb-5 text-[1.2rem] font-bold text-text-dark">Available Options</h3>
          <div className="flex flex-wrap justify-center gap-5">
            {options.map(o => (
              <div className="flex items-center gap-2 rounded-pill bg-bg-light px-6 py-3 text-[0.9rem] font-medium text-text-body" key={o}>
                <StatusGood size="medium" className="meptra-icon text-teal" />
                <span>{o}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <a href="#booking" className="inline-flex cursor-pointer items-center gap-2 rounded-pill border-0 bg-orange px-8 py-3.5 text-[0.95rem] font-semibold text-white transition duration-[400ms] ease-smooth hover:-translate-y-0.5 hover:bg-[#fde8e4] hover:text-orange hover:shadow-[0_4px_20px_rgba(232,116,74,0.15)] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:text-[0.9rem]" onClick={(e) => handleAnchorClick(e, '#booking')}>
            <span>Book Project Consultation</span>
            <FormNextLink size="medium" className="meptra-icon" />
          </a>
        </div>
      </div>
    </section>
  );
}
